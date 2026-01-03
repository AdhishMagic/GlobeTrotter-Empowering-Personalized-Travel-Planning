const crypto = require('crypto');
const db = require('../db/postgres');

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  err.expose = true;
  return err;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || '')
  );
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
}

function formatDateOnly(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const str = String(value);
  if (isIsoDate(str)) return str;
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) return str.slice(0, 10);
  return null;
}

function formatTimeHHMM(value) {
  if (value === null || value === undefined) return null;
  const str = String(value);
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(str)) return str.slice(0, 5);
  return str;
}

function isValidShareToken(value) {
  // base64url-ish token. We keep it permissive but non-empty.
  return /^[A-Za-z0-9_-]{10,120}$/.test(String(value || ''));
}

function generateShareToken() {
  // 24 bytes -> 32 chars base64url-ish
  return crypto.randomBytes(24).toString('base64url');
}

function getShareBaseUrl() {
  // Frontend can override. Spec example: https://app.com/shared/<token>
  const base = (process.env.PUBLIC_APP_URL || 'http://localhost:5173').replace(/\/$/, '');
  return base;
}

async function assertTripOwnership(tripId, userId) {
  if (!tripId || !isUuid(tripId)) throw httpError(400, 'tripId is invalid');
  if (!userId) throw httpError(401, 'Unauthorized');

  const result = await db.query('SELECT id, user_id FROM trips WHERE id = $1', [tripId]);
  if (result.rowCount === 0) throw httpError(404, 'Trip not found');
  if (result.rows[0].user_id !== userId) throw httpError(403, 'Forbidden');

  return true;
}

async function setTripSharing(userId, tripId, isPublic) {
  await assertTripOwnership(tripId, userId);

  if (typeof isPublic !== 'boolean') throw httpError(400, 'isPublic is invalid');

  if (!isPublic) {
    const result = await db.query(
      `UPDATE trips
       SET is_public = FALSE,
           share_token = NULL
       WHERE id = $1
       RETURNING share_token`,
      [tripId]
    );

    return { shareUrl: null, shareToken: result.rows[0]?.share_token ?? null };
  }

  // Enable public sharing: set flag + ensure token exists.
  // We generate a token and retry on rare collisions.
  for (let i = 0; i < 5; i += 1) {
    const token = generateShareToken();

    try {
      const result = await db.query(
        `UPDATE trips
         SET is_public = TRUE,
             share_token = COALESCE(share_token, $2)
         WHERE id = $1
         RETURNING share_token`,
        [tripId, token]
      );

      const shareToken = result.rows[0]?.share_token;
      const shareUrl = shareToken ? `${getShareBaseUrl()}/shared/${shareToken}` : null;
      return { shareUrl, shareToken };
    } catch (err) {
      // Unique violation on share_token: retry
      if (err && err.code === '23505') continue;
      throw err;
    }
  }

  throw httpError(500, 'Failed to generate share token');
}

async function getSharedTripByToken(shareToken) {
  if (!isValidShareToken(shareToken)) throw httpError(400, 'shareToken is invalid');

  const tripResult = await db.query(
    `SELECT id, trip_name, description, start_date, end_date, cover_image, status
     FROM trips
     WHERE share_token = $1
       AND is_public = TRUE`,
    [shareToken]
  );

  if (tripResult.rowCount === 0) throw httpError(404, 'Shared trip not found');

  const trip = tripResult.rows[0];

  const citiesResult = await db.query(
    `SELECT id, city_name, country, start_date, end_date, order_index
     FROM trip_cities
     WHERE trip_id = $1
     ORDER BY order_index ASC`,
    [trip.id]
  );

  const activitiesResult = await db.query(
    `SELECT id, city_id, activity_name, category, activity_date, start_time, end_time, cost, notes
     FROM activities
     WHERE trip_id = $1
     ORDER BY activity_date ASC, start_time ASC NULLS LAST, created_at ASC`,
    [trip.id]
  );

  const cities = citiesResult.rows.map((c) => ({
    id: c.id,
    cityName: c.city_name,
    country: c.country,
    startDate: formatDateOnly(c.start_date),
    endDate: formatDateOnly(c.end_date),
    orderIndex: c.order_index,
  }));

  const activities = activitiesResult.rows.map((a) => ({
    id: a.id,
    cityId: a.city_id,
    activityName: a.activity_name,
    category: a.category,
    activityDate: formatDateOnly(a.activity_date),
    startTime: formatTimeHHMM(a.start_time),
    endTime: formatTimeHHMM(a.end_time),
    cost: a.cost !== null && a.cost !== undefined ? Number(a.cost) : 0,
    notes: a.notes ?? null,
    editable: false,
  }));

  // Build itinerary (daywise + citywise) similar to Step 5, but public/read-only.
  const cityById = new Map(cities.map((c) => [c.id, c]));

  const dayGroups = new Map();
  for (const a of activities) {
    const date = a.activityDate;
    if (!date) continue;
    const city = cityById.get(a.cityId);
    const cityName = city?.cityName || 'Unknown';
    const cityOrder = city?.orderIndex || 0;

    const key = `${date}::${a.cityId}`;
    if (!dayGroups.has(key)) {
      dayGroups.set(key, {
        date,
        city: cityName,
        cityOrder,
        activities: [],
      });
    }

    dayGroups.get(key).activities.push({
      activityName: a.activityName,
      startTime: a.startTime,
      endTime: a.endTime,
      cost: a.cost,
    });
  }

  const daywise = Array.from(dayGroups.values())
    .sort((x, y) => {
      if (x.date !== y.date) return x.date < y.date ? -1 : 1;
      return (x.cityOrder || 0) - (y.cityOrder || 0);
    })
    .map(({ cityOrder, ...rest }) => rest);

  const citywise = cities
    .slice()
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
    .map((c) => ({
      cityId: c.id,
      cityName: c.cityName,
      dateRange: c.startDate && c.endDate ? `${c.startDate} to ${c.endDate}` : null,
      activities: activities
        .filter((a) => a.cityId === c.id)
        .map((a) => ({
          id: a.id,
          date: a.activityDate,
          activityName: a.activityName,
          category: a.category,
          startTime: a.startTime,
          endTime: a.endTime,
          cost: a.cost,
          notes: a.notes,
        })),
    }));

  return {
    trip: {
      id: trip.id,
      tripName: trip.trip_name,
      description: trip.description ?? null,
      startDate: formatDateOnly(trip.start_date),
      endDate: formatDateOnly(trip.end_date),
      coverImage: trip.cover_image ?? null,
      status: trip.status,
      isPublic: true,
    },
    cities: cities.map(({ orderIndex, ...rest }) => rest),
    activities,
    itinerary: { daywise, citywise },
  };
}

async function copySharedTripToUser(userId, shareToken) {
  if (!userId) throw httpError(401, 'Unauthorized');
  if (!isValidShareToken(shareToken)) throw httpError(400, 'shareToken is invalid');

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const srcTripRes = await client.query(
      `SELECT id, trip_name, description, start_date, end_date, cover_image, status, currency
       FROM trips
       WHERE share_token = $1
         AND is_public = TRUE`,
      [shareToken]
    );

    if (srcTripRes.rowCount === 0) throw httpError(404, 'Shared trip not found');

    const srcTrip = srcTripRes.rows[0];

    // Create new trip (private). Do NOT copy budget_total or share_token.
    const newTripRes = await client.query(
      `INSERT INTO trips (user_id, trip_name, description, start_date, end_date, cover_image, status, budget_total, is_public, share_token, currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, FALSE, NULL, $8)
       RETURNING id`,
      [
        userId,
        srcTrip.trip_name,
        srcTrip.description ?? null,
        formatDateOnly(srcTrip.start_date) || srcTrip.start_date,
        formatDateOnly(srcTrip.end_date) || srcTrip.end_date,
        srcTrip.cover_image ?? null,
        srcTrip.status,
        srcTrip.currency || 'USD',
      ]
    );

    const newTripId = newTripRes.rows[0].id;

    const srcCitiesRes = await client.query(
      `SELECT id, city_name, country, start_date, end_date, order_index
       FROM trip_cities
       WHERE trip_id = $1
       ORDER BY order_index ASC`,
      [srcTrip.id]
    );

    const cityIdMap = new Map();

    for (const c of srcCitiesRes.rows) {
      const ins = await client.query(
        `INSERT INTO trip_cities (trip_id, city_name, country, start_date, end_date, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          newTripId,
          c.city_name,
          c.country,
          formatDateOnly(c.start_date) || c.start_date,
          formatDateOnly(c.end_date) || c.end_date,
          c.order_index,
        ]
      );

      cityIdMap.set(c.id, ins.rows[0].id);
    }

    const srcActsRes = await client.query(
      `SELECT id, city_id, activity_name, category, activity_date, start_time, end_time, cost, notes
       FROM activities
       WHERE trip_id = $1
       ORDER BY activity_date ASC, start_time ASC NULLS LAST, created_at ASC`,
      [srcTrip.id]
    );

    for (const a of srcActsRes.rows) {
      const newCityId = cityIdMap.get(a.city_id);
      if (!newCityId) throw httpError(500, 'Failed to map city for activity');

      await client.query(
        `INSERT INTO activities (trip_id, city_id, activity_name, category, activity_date, start_time, end_time, cost, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          newTripId,
          newCityId,
          a.activity_name,
          a.category,
          formatDateOnly(a.activity_date) || a.activity_date,
          a.start_time,
          a.end_time,
          a.cost ?? 0,
          a.notes ?? null,
        ]
      );
    }

    await client.query('COMMIT');

    return { newTripId };
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // ignore
    }
    throw err;
  } finally {
    client.release();
  }
}

async function listPublicTrips(limit = 20) {
  const lim = Number.parseInt(String(limit), 10);
  const safeLimit = Number.isFinite(lim) && lim > 0 && lim <= 100 ? lim : 20;

  const result = await db.query(
    `SELECT trip_name, description, start_date, end_date, cover_image, status, share_token
     FROM trips
     WHERE is_public = TRUE
       AND share_token IS NOT NULL
     ORDER BY updated_at DESC
     LIMIT $1`,
    [safeLimit]
  );

  return result.rows.map((t) => ({
    tripName: t.trip_name,
    description: t.description ?? null,
    startDate: formatDateOnly(t.start_date),
    endDate: formatDateOnly(t.end_date),
    coverImage: t.cover_image ?? null,
    status: t.status,
    shareToken: t.share_token,
    shareUrl: `${getShareBaseUrl()}/shared/${t.share_token}`,
  }));
}

module.exports = {
  setTripSharing,
  getSharedTripByToken,
  copySharedTripToUser,
  listPublicTrips,
};
