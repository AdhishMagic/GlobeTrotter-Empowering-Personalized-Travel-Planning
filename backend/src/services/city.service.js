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

function toDateOnly(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (!isIsoDate(value)) return null;

  const [y, m, d] = String(value).split('-').map((n) => Number.parseInt(n, 10));
  if (!y || !m || !d) return null;

  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return null;

  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;

  return date;
}

function sanitizeCity(row) {
  if (!row) return null;
  return {
    id: row.id,
    tripId: row.trip_id,
    cityName: row.city_name,
    country: row.country,
    startDate: formatDateOnly(row.start_date),
    endDate: formatDateOnly(row.end_date),
    orderIndex: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function assertTripOwnershipAndGetTrip(tripId, userId) {
  if (!isUuid(tripId)) throw httpError(400, 'tripId is invalid');

  const result = await db.query(
    `SELECT id, user_id, start_date, end_date
     FROM trips
     WHERE id = $1`,
    [tripId]
  );

  if (result.rowCount === 0) throw httpError(404, 'Trip not found');

  const trip = result.rows[0];
  if (trip.user_id !== userId) throw httpError(403, 'Forbidden');

  const tripStart = formatDateOnly(trip.start_date);
  const tripEnd = formatDateOnly(trip.end_date);

  if (!tripStart || !tripEnd) throw httpError(500, 'Stored trip dates are invalid');

  return {
    id: trip.id,
    userId: trip.user_id,
    startDate: tripStart,
    endDate: tripEnd,
  };
}

async function assertCityOwnership(tripId, cityId, userId) {
  if (!isUuid(cityId)) throw httpError(400, 'cityId is invalid');

  await assertTripOwnershipAndGetTrip(tripId, userId);

  const result = await db.query(
    `SELECT id
     FROM trip_cities
     WHERE id = $1 AND trip_id = $2`,
    [cityId, tripId]
  );

  if (result.rowCount === 0) throw httpError(404, 'City not found');

  return true;
}

function assertCityDatesWithinTrip(cityStartStr, cityEndStr, tripStartStr, tripEndStr) {
  const cityStart = toDateOnly(cityStartStr);
  const cityEnd = toDateOnly(cityEndStr);
  const tripStart = toDateOnly(tripStartStr);
  const tripEnd = toDateOnly(tripEndStr);

  if (!cityStart) throw httpError(400, 'startDate is invalid');
  if (!cityEnd) throw httpError(400, 'endDate is invalid');
  if (cityStart > cityEnd) throw httpError(400, 'startDate must be before endDate');

  if (!tripStart || !tripEnd) throw httpError(500, 'Stored trip dates are invalid');

  if (cityStart < tripStart || cityEnd > tripEnd) {
    throw httpError(400, 'City dates must be within the trip date range');
  }
}

async function addCityToTrip(userId, tripId, payload) {
  if (!userId) throw httpError(401, 'Unauthorized');

  const trip = await assertTripOwnershipAndGetTrip(tripId, userId);

  const cityName = String(payload.cityName || '').trim();
  const country = String(payload.country || '').trim();
  const startDate = String(payload.startDate || '').trim();
  const endDate = String(payload.endDate || '').trim();

  if (!cityName) throw httpError(400, 'cityName is required');
  if (!country) throw httpError(400, 'country is required');
  if (!startDate) throw httpError(400, 'startDate is required');
  if (!endDate) throw httpError(400, 'endDate is required');

  assertCityDatesWithinTrip(startDate, endDate, trip.startDate, trip.endDate);

  const maxResult = await db.query(
    'SELECT COALESCE(MAX(order_index), 0) AS max_order FROM trip_cities WHERE trip_id = $1',
    [tripId]
  );

  const nextOrderIndex = Number.parseInt(maxResult.rows[0]?.max_order || '0', 10) + 1;

  const insert = await db.query(
    `INSERT INTO trip_cities (trip_id, city_name, country, start_date, end_date, order_index)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, trip_id, city_name, country, start_date, end_date, order_index, created_at, updated_at`,
    [tripId, cityName, country, startDate, endDate, nextOrderIndex]
  );

  return sanitizeCity(insert.rows[0]);
}

async function getCitiesForTrip(userId, tripId) {
  if (!userId) throw httpError(401, 'Unauthorized');

  await assertTripOwnershipAndGetTrip(tripId, userId);

  const result = await db.query(
    `SELECT id, trip_id, city_name, country, start_date, end_date, order_index, created_at, updated_at
     FROM trip_cities
     WHERE trip_id = $1
     ORDER BY order_index ASC`,
    [tripId]
  );

  return result.rows.map(sanitizeCity);
}

async function updateCity(userId, tripId, cityId, payload) {
  if (!userId) throw httpError(401, 'Unauthorized');

  const trip = await assertTripOwnershipAndGetTrip(tripId, userId);
  await assertCityOwnership(tripId, cityId, userId);

  const existingResult = await db.query(
    `SELECT id, trip_id, city_name, country, start_date, end_date, order_index, created_at, updated_at
     FROM trip_cities
     WHERE id = $1 AND trip_id = $2`,
    [cityId, tripId]
  );

  const existing = existingResult.rows[0];
  if (!existing) throw httpError(404, 'City not found');

  const existingStart = formatDateOnly(existing.start_date);
  const existingEnd = formatDateOnly(existing.end_date);
  if (!existingStart || !existingEnd) throw httpError(500, 'Stored city dates are invalid');

  const nextCityName =
    payload.cityName !== undefined ? String(payload.cityName || '').trim() : existing.city_name;
  const nextCountry =
    payload.country !== undefined ? String(payload.country || '').trim() : existing.country;
  const nextStartDate =
    payload.startDate !== undefined ? String(payload.startDate || '').trim() : existingStart;
  const nextEndDate =
    payload.endDate !== undefined ? String(payload.endDate || '').trim() : existingEnd;

  if (!nextCityName) throw httpError(400, 'cityName is required');
  if (!nextCountry) throw httpError(400, 'country is required');

  assertCityDatesWithinTrip(nextStartDate, nextEndDate, trip.startDate, trip.endDate);

  const update = await db.query(
    `UPDATE trip_cities
     SET city_name = $1,
         country = $2,
         start_date = $3,
         end_date = $4
     WHERE id = $5 AND trip_id = $6
     RETURNING id, trip_id, city_name, country, start_date, end_date, order_index, created_at, updated_at`,
    [nextCityName, nextCountry, nextStartDate, nextEndDate, cityId, tripId]
  );

  return sanitizeCity(update.rows[0]);
}

async function reorderCities(userId, tripId, order) {
  if (!userId) throw httpError(401, 'Unauthorized');

  await assertTripOwnershipAndGetTrip(tripId, userId);

  if (!Array.isArray(order) || order.length === 0) {
    throw httpError(400, 'order is required');
  }

  const cityIds = order.map((o) => o && o.cityId).map((id) => String(id || '').trim());
  const orderIndexes = order
    .map((o) => (o ? o.orderIndex : undefined))
    .map((n) => Number.parseInt(String(n), 10));

  if (cityIds.some((id) => !isUuid(id))) throw httpError(400, 'order contains invalid cityId');
  if (orderIndexes.some((n) => !Number.isInteger(n) || n < 1)) {
    throw httpError(400, 'order contains invalid orderIndex');
  }

  const uniqueCityIds = new Set(cityIds);
  if (uniqueCityIds.size !== cityIds.length) throw httpError(400, 'Duplicate cityId in order');

  const uniqueOrderIndexes = new Set(orderIndexes);
  if (uniqueOrderIndexes.size !== orderIndexes.length) throw httpError(400, 'Duplicate orderIndex in order');

  const n = order.length;
  for (let i = 1; i <= n; i += 1) {
    if (!uniqueOrderIndexes.has(i)) throw httpError(400, 'orderIndex must be continuous (1..n)');
  }

  // Ensure the payload includes all cities for the trip.
  const existing = await db.query(
    'SELECT id FROM trip_cities WHERE trip_id = $1 ORDER BY order_index ASC',
    [tripId]
  );

  const existingIds = existing.rows.map((r) => r.id);
  if (existingIds.length !== n) throw httpError(400, 'order must include all cities in the trip');

  const existingIdSet = new Set(existingIds);
  for (const id of cityIds) {
    if (!existingIdSet.has(id)) throw httpError(404, 'City not found');
  }

  // Transactional update.
  // IMPORTANT: because of UNIQUE(trip_id, order_index), a direct swap (1<->2)
  // can violate the constraint mid-update. We avoid this with a two-phase update:
  // 1) bump all affected rows by a large offset (still >= 1)
  // 2) set the final desired order_index
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const OFFSET = 1000000;
    const cityIdParams = cityIds.map((_, i) => `$${i + 2}`).join(', ');
    await client.query(
      `UPDATE trip_cities
       SET order_index = order_index + $1
       WHERE trip_id = $2 AND id IN (${cityIdParams})`,
      [OFFSET, tripId, ...cityIds]
    );

    const caseParts = [];
    const params = [tripId];
    let paramIndex = 2;
    for (let i = 0; i < order.length; i += 1) {
      const cityId = cityIds[i];
      const orderIndex = orderIndexes[i];
      params.push(cityId, orderIndex);
      caseParts.push(`WHEN $${paramIndex} THEN $${paramIndex + 1}`);
      paramIndex += 2;
    }

    const inList = cityIds.map((_, i) => `$${2 + i * 2}`).join(', ');
    await client.query(
      `UPDATE trip_cities
       SET order_index = CASE id
         ${caseParts.join('\n         ')}
         ELSE order_index
       END
       WHERE trip_id = $1 AND id IN (${inList})`,
      params
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return true;
}

async function deleteCity(userId, tripId, cityId) {
  if (!userId) throw httpError(401, 'Unauthorized');

  await assertTripOwnershipAndGetTrip(tripId, userId);

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const del = await client.query(
      'DELETE FROM trip_cities WHERE id = $1 AND trip_id = $2 RETURNING id',
      [cityId, tripId]
    );

    if (del.rowCount === 0) throw httpError(404, 'City not found');

    // Keep order_index continuous after delete.
    await client.query(
      `UPDATE trip_cities c
       SET order_index = s.rn
       FROM (
         SELECT id, ROW_NUMBER() OVER (ORDER BY order_index ASC, created_at ASC) AS rn
         FROM trip_cities
         WHERE trip_id = $1
       ) s
       WHERE c.id = s.id`,
      [tripId]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return true;
}

module.exports = {
  addCityToTrip,
  getCitiesForTrip,
  updateCity,
  reorderCities,
  deleteCity,
};
