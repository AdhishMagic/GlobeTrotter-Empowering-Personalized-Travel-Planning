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
  // Handle ISO timestamps like "2026-06-01T00:00:00.000Z"
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
  // Guard against JS Date auto-rollover (e.g. 2026-02-31)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

function todayDateOnly() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function computeStatus(startDateStr, endDateStr) {
  const start = toDateOnly(startDateStr);
  const end = toDateOnly(endDateStr);
  if (!start || !end) return null;

  const today = todayDateOnly();

  if (today < start) return 'upcoming';
  if (today > end) return 'completed';
  return 'ongoing';
}

function sanitizeTrip(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    tripName: row.trip_name,
    description: row.description ?? null,
    startDate: formatDateOnly(row.start_date),
    endDate: formatDateOnly(row.end_date),
    coverImage: row.cover_image ?? null,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function assertTripOwnership(tripId, userId) {
  if (!isUuid(tripId)) throw httpError(400, 'tripId is invalid');

  const result = await db.query('SELECT id, user_id FROM trips WHERE id = $1', [
    tripId,
  ]);

  if (result.rowCount === 0) throw httpError(404, 'Trip not found');

  const row = result.rows[0];
  if (row.user_id !== userId) throw httpError(403, 'Forbidden');

  return true;
}

async function createTrip(userId, payload) {
  if (!userId) throw httpError(401, 'Unauthorized');

  const tripName = String(payload.tripName || '').trim();
  const description = payload.description ? String(payload.description).trim() : null;
  const startDate = String(payload.startDate || '').trim();
  const endDate = String(payload.endDate || '').trim();
  const coverImage = payload.coverImage ? String(payload.coverImage).trim() : null;

  if (!tripName) throw httpError(400, 'tripName is required');
  if (!startDate) throw httpError(400, 'startDate is required');
  if (!endDate) throw httpError(400, 'endDate is required');

  const start = toDateOnly(startDate);
  const end = toDateOnly(endDate);
  if (!start) throw httpError(400, 'startDate is invalid');
  if (!end) throw httpError(400, 'endDate is invalid');
  if (start > end) throw httpError(400, 'startDate must be before endDate');

  const status = computeStatus(startDate, endDate) || 'upcoming';

  const insert = await db.query(
    `INSERT INTO trips (user_id, trip_name, description, start_date, end_date, cover_image, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, user_id, trip_name, description, start_date, end_date, cover_image, status, created_at, updated_at`,
    [userId, tripName, description, startDate, endDate, coverImage, status]
  );

  return sanitizeTrip(insert.rows[0]);
}

async function getTripsForUser(userId) {
  if (!userId) throw httpError(401, 'Unauthorized');

  const result = await db.query(
    `SELECT id, user_id, trip_name, description, start_date, end_date, cover_image, status, created_at, updated_at
     FROM trips
     WHERE user_id = $1
     ORDER BY start_date DESC`,
    [userId]
  );

  return result.rows.map(sanitizeTrip);
}

async function getTripById(userId, tripId) {
  if (!userId) throw httpError(401, 'Unauthorized');
  await assertTripOwnership(tripId, userId);

  const result = await db.query(
    `SELECT id, user_id, trip_name, description, start_date, end_date, cover_image, status, created_at, updated_at
     FROM trips
     WHERE id = $1`,
    [tripId]
  );

  return sanitizeTrip(result.rows[0]);
}

async function updateTrip(userId, tripId, payload) {
  if (!userId) throw httpError(401, 'Unauthorized');
  await assertTripOwnership(tripId, userId);

  // Load existing to support partial updates + status recomputation.
  const existingResult = await db.query(
    `SELECT id, user_id, trip_name, description, start_date, end_date, cover_image, status, created_at, updated_at
     FROM trips
     WHERE id = $1`,
    [tripId]
  );

  const existing = existingResult.rows[0];
  if (!existing) throw httpError(404, 'Trip not found');

  const existingStartDate = formatDateOnly(existing.start_date);
  const existingEndDate = formatDateOnly(existing.end_date);
  if (!existingStartDate || !existingEndDate) {
    throw httpError(500, 'Stored trip dates are invalid');
  }

  const nextTripName =
    payload.tripName !== undefined ? String(payload.tripName || '').trim() : existing.trip_name;
  const nextDescription =
    payload.description !== undefined
      ? payload.description
        ? String(payload.description).trim()
        : null
      : existing.description;

  const nextStartDate =
    payload.startDate !== undefined
      ? String(payload.startDate || '').trim()
      : existingStartDate;
  const nextEndDate =
    payload.endDate !== undefined ? String(payload.endDate || '').trim() : existingEndDate;

  const nextCoverImage =
    payload.coverImage !== undefined
      ? payload.coverImage
        ? String(payload.coverImage).trim()
        : null
      : existing.cover_image;

  if (!nextTripName) throw httpError(400, 'tripName is required');

  const start = toDateOnly(nextStartDate);
  const end = toDateOnly(nextEndDate);
  if (!start) throw httpError(400, 'startDate is invalid');
  if (!end) throw httpError(400, 'endDate is invalid');
  if (start > end) throw httpError(400, 'startDate must be before endDate');

  const nextStatus = computeStatus(nextStartDate, nextEndDate) || existing.status;

  const update = await db.query(
    `UPDATE trips
     SET trip_name = $1,
         description = $2,
         start_date = $3,
         end_date = $4,
         cover_image = $5,
         status = $6
     WHERE id = $7
     RETURNING id, user_id, trip_name, description, start_date, end_date, cover_image, status, created_at, updated_at`,
    [
      nextTripName,
      nextDescription,
      nextStartDate,
      nextEndDate,
      nextCoverImage,
      nextStatus,
      tripId,
    ]
  );

  return sanitizeTrip(update.rows[0]);
}

async function deleteTrip(userId, tripId) {
  if (!userId) throw httpError(401, 'Unauthorized');
  await assertTripOwnership(tripId, userId);

  const result = await db.query('DELETE FROM trips WHERE id = $1 RETURNING id', [tripId]);
  if (result.rowCount === 0) throw httpError(404, 'Trip not found');

  return { id: result.rows[0].id };
}

module.exports = {
  createTrip,
  getTripsForUser,
  getTripById,
  updateTrip,
  deleteTrip,
};
