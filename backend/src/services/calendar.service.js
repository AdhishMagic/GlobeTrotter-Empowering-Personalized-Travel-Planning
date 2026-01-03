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

function timeToMinutes(value) {
  if (value === null || value === undefined) return null;
  const str = String(value);
  const m = str.match(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/);
  if (!m) return null;
  const hh = Number.parseInt(m[1], 10);
  const mm = Number.parseInt(m[2], 10);
  return hh * 60 + mm;
}

function computeDurationMinutes(startTime, endTime) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (start === null || end === null) return null;
  const diff = end - start;
  if (diff < 0) return null;
  return diff;
}

function buildMonthRange(month, year) {
  const m = Number.parseInt(String(month), 10);
  const y = Number.parseInt(String(year), 10);

  if (!Number.isInteger(m) || m < 1 || m > 12) throw httpError(400, 'month is invalid');
  if (!Number.isInteger(y) || y < 1970 || y > 3000) throw httpError(400, 'year is invalid');

  const startMonth = String(m).padStart(2, '0');
  const startDate = `${y}-${startMonth}-01`;

  const nextM = m === 12 ? 1 : m + 1;
  const nextY = m === 12 ? y + 1 : y;
  const nextMonth = String(nextM).padStart(2, '0');
  const endExclusive = `${nextY}-${nextMonth}-01`;

  return { month: m, year: y, startDate, endExclusive };
}

async function assertTripOwnership(tripId, userId) {
  if (!tripId || !isUuid(tripId)) throw httpError(400, 'tripId is invalid');
  if (!userId) throw httpError(401, 'Unauthorized');

  const result = await db.query('SELECT id, user_id FROM trips WHERE id = $1', [tripId]);
  if (result.rowCount === 0) throw httpError(404, 'Trip not found');
  if (result.rows[0].user_id !== userId) throw httpError(403, 'Forbidden');

  return true;
}

async function getMonthlyCalendar(userId, tripId, month, year) {
  await assertTripOwnership(tripId, userId);

  const range = buildMonthRange(month, year);

  const result = await db.query(
    `SELECT
        a.id AS activity_id,
        a.activity_name,
        a.activity_date,
        a.start_time,
        a.end_time,
        c.city_name
     FROM activities a
     JOIN trip_cities c
       ON c.id = a.city_id
      AND c.trip_id = a.trip_id
     WHERE a.trip_id = $1
       AND a.activity_date >= $2
       AND a.activity_date < $3
     ORDER BY a.activity_date ASC, a.start_time ASC NULLS LAST, a.created_at ASC`,
    [tripId, range.startDate, range.endExclusive]
  );

  const days = {};
  for (const row of result.rows) {
    const date = formatDateOnly(row.activity_date);
    if (!date) continue;

    if (!days[date]) days[date] = [];

    const startTime = formatTimeHHMM(row.start_time);
    const endTime = formatTimeHHMM(row.end_time);

    days[date].push({
      activityId: row.activity_id,
      title: row.activity_name,
      city: row.city_name,
      startTime,
      endTime,
      duration: computeDurationMinutes(startTime, endTime),
      editable: true,
    });
  }

  return {
    tripId,
    month: range.month,
    year: range.year,
    days,
  };
}

async function getDayTimeline(userId, tripId, date) {
  await assertTripOwnership(tripId, userId);

  const dateStr = String(date || '').trim();
  if (!isIsoDate(dateStr)) throw httpError(400, 'date is invalid');

  const result = await db.query(
    `SELECT
        a.id AS activity_id,
        a.activity_name,
        a.category,
        a.activity_date,
        a.start_time,
        a.end_time,
        a.cost,
        a.notes,
        a.city_id,
        c.city_name
     FROM activities a
     JOIN trip_cities c
       ON c.id = a.city_id
      AND c.trip_id = a.trip_id
     WHERE a.trip_id = $1
       AND a.activity_date = $2
     ORDER BY a.start_time ASC NULLS LAST, a.created_at ASC`,
    [tripId, dateStr]
  );

  const activities = result.rows.map((row) => {
    const startTime = formatTimeHHMM(row.start_time);
    const endTime = formatTimeHHMM(row.end_time);

    return {
      activityId: row.activity_id,
      title: row.activity_name,
      city: row.city_name,
      cityId: row.city_id,
      date: formatDateOnly(row.activity_date),
      startTime,
      endTime,
      duration: computeDurationMinutes(startTime, endTime),
      editable: true,
      category: row.category,
      cost: row.cost !== null && row.cost !== undefined ? Number(row.cost) : 0,
      notes: row.notes ?? null,
    };
  });

  return {
    tripId,
    date: dateStr,
    activities,
  };
}

async function getTimelineRange(userId, tripId, startDate, endDate) {
  await assertTripOwnership(tripId, userId);

  const startStr = String(startDate || '').trim();
  const endStr = String(endDate || '').trim();

  if (!isIsoDate(startStr)) throw httpError(400, 'startDate is invalid');
  if (!isIsoDate(endStr)) throw httpError(400, 'endDate is invalid');
  if (startStr > endStr) throw httpError(400, 'startDate must be before endDate');

  const result = await db.query(
    `SELECT
        a.id AS activity_id,
        a.activity_name,
        a.category,
        a.activity_date,
        a.start_time,
        a.end_time,
        a.cost,
        a.notes,
        a.city_id,
        c.city_name
     FROM activities a
     JOIN trip_cities c
       ON c.id = a.city_id
      AND c.trip_id = a.trip_id
     WHERE a.trip_id = $1
       AND a.activity_date >= $2
       AND a.activity_date <= $3
     ORDER BY a.activity_date ASC, a.start_time ASC NULLS LAST, a.created_at ASC`,
    [tripId, startStr, endStr]
  );

  const activities = result.rows.map((row) => {
    const startTime = formatTimeHHMM(row.start_time);
    const endTime = formatTimeHHMM(row.end_time);

    return {
      activityId: row.activity_id,
      title: row.activity_name,
      city: row.city_name,
      cityId: row.city_id,
      date: formatDateOnly(row.activity_date),
      startTime,
      endTime,
      duration: computeDurationMinutes(startTime, endTime),
      editable: true,
      category: row.category,
      cost: row.cost !== null && row.cost !== undefined ? Number(row.cost) : 0,
      notes: row.notes ?? null,
    };
  });

  return {
    tripId,
    startDate: startStr,
    endDate: endStr,
    activities,
  };
}

module.exports = {
  getMonthlyCalendar,
  getDayTimeline,
  getTimelineRange,
};
