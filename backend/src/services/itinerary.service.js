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
  // pg may return "HH:MM:SS"; frontend expects "HH:MM"
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(str)) return str.slice(0, 5);
  return str;
}

async function assertTripOwnership(tripId, userId) {
  if (!tripId || !isUuid(tripId)) throw httpError(400, 'tripId is invalid');
  if (!userId) throw httpError(401, 'Unauthorized');

  const result = await db.query('SELECT id, user_id FROM trips WHERE id = $1', [tripId]);
  if (result.rowCount === 0) throw httpError(404, 'Trip not found');
  if (result.rows[0].user_id !== userId) throw httpError(403, 'Forbidden');

  return true;
}

async function fetchTripCitiesAndActivities(tripId) {
  // Single joined query, avoids N+1.
  const result = await db.query(
    `SELECT
        c.id AS city_id,
        c.city_name,
        c.country,
        c.start_date AS city_start_date,
        c.end_date AS city_end_date,
        c.order_index,

        a.id AS activity_id,
        a.activity_name,
        a.category,
        a.activity_date,
        a.start_time,
        a.end_time,
        a.cost,
        a.notes
     FROM trip_cities c
     LEFT JOIN activities a
       ON a.city_id = c.id
      AND a.trip_id = c.trip_id
     WHERE c.trip_id = $1
     ORDER BY
       c.order_index ASC,
       a.activity_date ASC NULLS LAST,
       a.start_time ASC NULLS LAST,
       a.created_at ASC NULLS LAST`,
    [tripId]
  );

  return result.rows;
}

function buildCitywise(rows) {
  const citiesById = new Map();

  for (const r of rows) {
    const cityId = r.city_id;
    if (!citiesById.has(cityId)) {
      const start = formatDateOnly(r.city_start_date);
      const end = formatDateOnly(r.city_end_date);

      citiesById.set(cityId, {
        cityId,
        cityName: r.city_name,
        dateRange: start && end ? `${start} to ${end}` : null,
        orderIndex: r.order_index,
        activities: [],
      });
    }

    if (r.activity_id) {
      citiesById.get(cityId).activities.push({
        id: r.activity_id,
        date: formatDateOnly(r.activity_date),
        activityName: r.activity_name,
        category: r.category,
        startTime: formatTimeHHMM(r.start_time),
        endTime: formatTimeHHMM(r.end_time),
        cost: r.cost !== null && r.cost !== undefined ? Number(r.cost) : 0,
        notes: r.notes ?? null,
      });
    }
  }

  const cities = Array.from(citiesById.values()).sort(
    (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
  );

  // Do not leak internal orderIndex in response
  for (const c of cities) delete c.orderIndex;

  return cities;
}

function buildDaywise(rows) {
  // Output shape: [{ date, city, activities: [...] }]
  // If multiple cities share same date (overlap), we emit multiple entries (date+city).
  const groups = new Map();
  const cityMeta = new Map();

  for (const r of rows) {
    if (!cityMeta.has(r.city_id)) {
      cityMeta.set(r.city_id, {
        cityName: r.city_name,
        orderIndex: r.order_index,
      });
    }

    if (!r.activity_id) continue;

    const date = formatDateOnly(r.activity_date);
    const key = `${date}::${r.city_id}`;

    if (!groups.has(key)) {
      groups.set(key, {
        date,
        city: r.city_name,
        cityId: r.city_id,
        cityOrder: r.order_index,
        activities: [],
      });
    }

    groups.get(key).activities.push({
      activityName: r.activity_name,
      startTime: formatTimeHHMM(r.start_time),
      endTime: formatTimeHHMM(r.end_time),
      cost: r.cost !== null && r.cost !== undefined ? Number(r.cost) : 0,
    });
  }

  const itinerary = Array.from(groups.values())
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return (a.cityOrder || 0) - (b.cityOrder || 0);
    })
    .map((entry) => {
      // Activities already ordered by SQL; keep as-is.
      const { cityId, cityOrder, ...rest } = entry;
      return rest;
    });

  return itinerary;
}

async function getDaywiseItinerary(userId, tripId) {
  await assertTripOwnership(tripId, userId);
  const rows = await fetchTripCitiesAndActivities(tripId);
  return buildDaywise(rows);
}

async function getCitywiseItinerary(userId, tripId) {
  await assertTripOwnership(tripId, userId);
  const rows = await fetchTripCitiesAndActivities(tripId);
  return buildCitywise(rows);
}

async function getFullItinerary(userId, tripId) {
  await assertTripOwnership(tripId, userId);
  const rows = await fetchTripCitiesAndActivities(tripId);

  return {
    daywise: buildDaywise(rows),
    citywise: buildCitywise(rows),
  };
}

module.exports = {
  getDaywiseItinerary,
  getCitywiseItinerary,
  getFullItinerary,
};
