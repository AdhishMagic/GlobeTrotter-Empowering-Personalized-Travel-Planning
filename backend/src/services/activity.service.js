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

function isTime(value) {
  // Accept HH:MM or HH:MM:SS
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(String(value || ''));
}

function sanitizeActivity(row) {
  if (!row) return null;
  return {
    id: row.id,
    tripId: row.trip_id,
    cityId: row.city_id,
    activityName: row.activity_name,
    category: row.category,
    activityDate: formatDateOnly(row.activity_date),
    startTime: row.start_time ?? null,
    endTime: row.end_time ?? null,
    cost: row.cost !== undefined && row.cost !== null ? Number(row.cost) : 0,
    notes: row.notes ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function assertTripOwnership(tripId, userId) {
  if (!isUuid(tripId)) throw httpError(400, 'tripId is invalid');

  const result = await db.query('SELECT id, user_id FROM trips WHERE id = $1', [tripId]);
  if (result.rowCount === 0) throw httpError(404, 'Trip not found');
  if (result.rows[0].user_id !== userId) throw httpError(403, 'Forbidden');
  return true;
}

async function getCityForTrip(tripId, cityId, userId) {
  if (!isUuid(cityId)) throw httpError(400, 'cityId is invalid');

  await assertTripOwnership(tripId, userId);

  const result = await db.query(
    `SELECT id, trip_id, start_date, end_date
     FROM trip_cities
     WHERE id = $1`,
    [cityId]
  );

  if (result.rowCount === 0) throw httpError(404, 'City not found');

  const city = result.rows[0];
  if (city.trip_id !== tripId) throw httpError(403, 'Forbidden');

  const cityStart = formatDateOnly(city.start_date);
  const cityEnd = formatDateOnly(city.end_date);
  if (!cityStart || !cityEnd) throw httpError(500, 'Stored city dates are invalid');

  return { id: city.id, tripId: city.trip_id, startDate: cityStart, endDate: cityEnd };
}

function assertActivityDateWithinCity(activityDateStr, cityStartStr, cityEndStr) {
  const activityDate = toDateOnly(activityDateStr);
  const cityStart = toDateOnly(cityStartStr);
  const cityEnd = toDateOnly(cityEndStr);

  if (!activityDate) throw httpError(400, 'activityDate is invalid');
  if (!cityStart || !cityEnd) throw httpError(500, 'Stored city dates are invalid');

  if (activityDate < cityStart || activityDate > cityEnd) {
    throw httpError(400, 'activityDate must be within the city date range');
  }
}

function normalizeTimeOrNull(value, fieldName) {
  if (value === undefined) return undefined;
  if (value === null || String(value).trim() === '') return null;

  const str = String(value).trim();
  if (!isTime(str)) throw httpError(400, `${fieldName} is invalid`);
  return str.length === 5 ? `${str}:00` : str;
}

function assertTimeOrder(startTime, endTime) {
  if (startTime && endTime && startTime >= endTime) {
    throw httpError(400, 'startTime must be before endTime');
  }
}

function normalizeCost(value) {
  if (value === undefined) return undefined;
  const num = Number(value);
  if (!Number.isFinite(num)) throw httpError(400, 'cost is invalid');
  if (num < 0) throw httpError(400, 'cost must be >= 0');
  return Math.round(num * 100) / 100;
}

const ALLOWED_CATEGORIES = new Set(['sightseeing', 'food', 'travel', 'stay', 'other']);

function normalizeCategory(value) {
  if (value === undefined) return undefined;
  const category = String(value || '').trim().toLowerCase();
  if (!ALLOWED_CATEGORIES.has(category)) throw httpError(400, 'category is invalid');
  return category;
}

async function addActivity(userId, tripId, cityId, payload) {
  if (!userId) throw httpError(401, 'Unauthorized');

  const city = await getCityForTrip(tripId, cityId, userId);

  const activityName = String(payload.activityName || '').trim();
  const category = normalizeCategory(payload.category);
  const activityDate = String(payload.activityDate || '').trim();
  const startTime = normalizeTimeOrNull(payload.startTime, 'startTime');
  const endTime = normalizeTimeOrNull(payload.endTime, 'endTime');
  const cost = normalizeCost(payload.cost);
  const notes = payload.notes !== undefined ? (payload.notes ? String(payload.notes).trim() : null) : null;

  if (!activityName) throw httpError(400, 'activityName is required');
  if (!category) throw httpError(400, 'category is required');
  if (!activityDate) throw httpError(400, 'activityDate is required');

  assertActivityDateWithinCity(activityDate, city.startDate, city.endDate);
  assertTimeOrder(startTime, endTime);

  const insert = await db.query(
    `INSERT INTO activities (trip_id, city_id, activity_name, category, activity_date, start_time, end_time, cost, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, trip_id, city_id, activity_name, category, activity_date, start_time, end_time, cost, notes, created_at, updated_at`,
    [
      tripId,
      cityId,
      activityName,
      category,
      activityDate,
      startTime,
      endTime,
      cost ?? 0,
      notes,
    ]
  );

  return sanitizeActivity(insert.rows[0]);
}

async function getActivitiesForCity(userId, tripId, cityId) {
  if (!userId) throw httpError(401, 'Unauthorized');

  await getCityForTrip(tripId, cityId, userId);

  const result = await db.query(
    `SELECT id, trip_id, city_id, activity_name, category, activity_date, start_time, end_time, cost, notes, created_at, updated_at
     FROM activities
     WHERE trip_id = $1 AND city_id = $2
     ORDER BY activity_date ASC, start_time ASC NULLS LAST, created_at ASC`,
    [tripId, cityId]
  );

  return result.rows.map(sanitizeActivity);
}

async function getActivitiesForTrip(userId, tripId) {
  if (!userId) throw httpError(401, 'Unauthorized');
  await assertTripOwnership(tripId, userId);

  const result = await db.query(
    `SELECT id, trip_id, city_id, activity_name, category, activity_date, start_time, end_time, cost, notes, created_at, updated_at
     FROM activities
     WHERE trip_id = $1
     ORDER BY activity_date ASC, start_time ASC NULLS LAST, created_at ASC`,
    [tripId]
  );

  return result.rows.map(sanitizeActivity);
}

async function updateActivity(userId, tripId, cityId, activityId, payload) {
  if (!userId) throw httpError(401, 'Unauthorized');
  if (!isUuid(activityId)) throw httpError(400, 'activityId is invalid');

  const city = await getCityForTrip(tripId, cityId, userId);

  const existingResult = await db.query(
    `SELECT id, trip_id, city_id, activity_name, category, activity_date, start_time, end_time, cost, notes, created_at, updated_at
     FROM activities
     WHERE id = $1`,
    [activityId]
  );

  if (existingResult.rowCount === 0) throw httpError(404, 'Activity not found');

  const existing = existingResult.rows[0];
  if (existing.trip_id !== tripId || existing.city_id !== cityId) throw httpError(403, 'Forbidden');

  const nextActivityName =
    payload.activityName !== undefined
      ? String(payload.activityName || '').trim()
      : existing.activity_name;
  const nextCategory =
    payload.category !== undefined ? normalizeCategory(payload.category) : existing.category;
  const nextActivityDate =
    payload.activityDate !== undefined
      ? String(payload.activityDate || '').trim()
      : formatDateOnly(existing.activity_date);

  const nextStartTime =
    payload.startTime !== undefined
      ? normalizeTimeOrNull(payload.startTime, 'startTime')
      : existing.start_time;
  const nextEndTime =
    payload.endTime !== undefined
      ? normalizeTimeOrNull(payload.endTime, 'endTime')
      : existing.end_time;

  const nextCost = payload.cost !== undefined ? normalizeCost(payload.cost) : Number(existing.cost);
  const nextNotes =
    payload.notes !== undefined ? (payload.notes ? String(payload.notes).trim() : null) : existing.notes;

  if (!nextActivityName) throw httpError(400, 'activityName is required');
  if (!nextCategory) throw httpError(400, 'category is required');
  if (!nextActivityDate) throw httpError(400, 'activityDate is required');

  assertActivityDateWithinCity(nextActivityDate, city.startDate, city.endDate);
  assertTimeOrder(nextStartTime, nextEndTime);

  const update = await db.query(
    `UPDATE activities
     SET activity_name = $1,
         category = $2,
         activity_date = $3,
         start_time = $4,
         end_time = $5,
         cost = $6,
         notes = $7
     WHERE id = $8
     RETURNING id, trip_id, city_id, activity_name, category, activity_date, start_time, end_time, cost, notes, created_at, updated_at`,
    [
      nextActivityName,
      nextCategory,
      nextActivityDate,
      nextStartTime,
      nextEndTime,
      nextCost ?? 0,
      nextNotes,
      activityId,
    ]
  );

  return sanitizeActivity(update.rows[0]);
}

async function deleteActivity(userId, tripId, cityId, activityId) {
  if (!userId) throw httpError(401, 'Unauthorized');
  if (!isUuid(activityId)) throw httpError(400, 'activityId is invalid');

  await getCityForTrip(tripId, cityId, userId);

  const del = await db.query(
    'DELETE FROM activities WHERE id = $1 AND trip_id = $2 AND city_id = $3 RETURNING id',
    [activityId, tripId, cityId]
  );

  if (del.rowCount === 0) throw httpError(404, 'Activity not found');

  return true;
}

module.exports = {
  addActivity,
  getActivitiesForCity,
  getActivitiesForTrip,
  updateActivity,
  deleteActivity,
};
