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

async function assertTripOwnership(tripId, userId) {
  if (!tripId || !isUuid(tripId)) throw httpError(400, 'tripId is invalid');
  if (!userId) throw httpError(401, 'Unauthorized');

  const result = await db.query(
    'SELECT id, user_id, budget_total, currency FROM trips WHERE id = $1',
    [tripId]
  );

  if (result.rowCount === 0) throw httpError(404, 'Trip not found');
  if (result.rows[0].user_id !== userId) throw httpError(403, 'Forbidden');

  return result.rows[0];
}

function normalizeCurrency(value) {
  if (value === undefined) return undefined;
  const currency = String(value || '').trim();
  if (!currency) throw httpError(400, 'currency is invalid');
  if (currency.length > 10) throw httpError(400, 'currency is invalid');
  return currency.toUpperCase();
}

function normalizeBudgetTotal(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const num = Number(value);
  if (!Number.isFinite(num)) throw httpError(400, 'budgetTotal is invalid');
  if (num < 0) throw httpError(400, 'budgetTotal must be >= 0');

  // Keep 2 decimals
  return Math.round(num * 100) / 100;
}

async function updateTripBudget(userId, tripId, payload) {
  const trip = await assertTripOwnership(tripId, userId);

  const nextBudgetTotal = normalizeBudgetTotal(payload.budgetTotal);
  const nextCurrency = normalizeCurrency(payload.currency);

  if (nextBudgetTotal === undefined && nextCurrency === undefined) {
    throw httpError(400, 'budgetTotal or currency is required');
  }

  const budgetTotal = nextBudgetTotal === undefined ? trip.budget_total : nextBudgetTotal;
  const currency = nextCurrency === undefined ? trip.currency : nextCurrency;

  const result = await db.query(
    `UPDATE trips
     SET budget_total = $1,
         currency = $2
     WHERE id = $3
     RETURNING id, budget_total, currency`,
    [budgetTotal, currency, tripId]
  );

  return {
    tripId: result.rows[0].id,
    budgetTotal: result.rows[0].budget_total !== null ? Number(result.rows[0].budget_total) : null,
    currency: result.rows[0].currency,
  };
}

function baseCategoryTotals() {
  return {
    sightseeing: 0,
    food: 0,
    travel: 0,
    stay: 0,
    other: 0,
  };
}

async function getTripBudgetSummary(userId, tripId) {
  const trip = await assertTripOwnership(tripId, userId);

  const currency = trip.currency || 'USD';
  const budgetTotal = trip.budget_total !== null ? Number(trip.budget_total) : null;

  const totalResult = await db.query(
    'SELECT COALESCE(SUM(cost), 0) AS total_spent FROM activities WHERE trip_id = $1',
    [tripId]
  );

  const totalSpent = Number(totalResult.rows[0]?.total_spent || 0);

  const categoryResult = await db.query(
    `SELECT category, COALESCE(SUM(cost), 0) AS total
     FROM activities
     WHERE trip_id = $1
     GROUP BY category`,
    [tripId]
  );

  const byCategory = baseCategoryTotals();
  for (const row of categoryResult.rows) {
    if (row.category && Object.prototype.hasOwnProperty.call(byCategory, row.category)) {
      byCategory[row.category] = Number(row.total || 0);
    }
  }

  const cityResult = await db.query(
    `SELECT c.city_name AS city_name, COALESCE(SUM(a.cost), 0) AS total
     FROM trip_cities c
     LEFT JOIN activities a
       ON a.city_id = c.id
      AND a.trip_id = c.trip_id
     WHERE c.trip_id = $1
     GROUP BY c.city_name, c.order_index
     ORDER BY c.order_index ASC`,
    [tripId]
  );

  const byCity = cityResult.rows.map((r) => ({
    cityName: r.city_name,
    total: Number(r.total || 0),
  }));

  const overBudget = budgetTotal !== null ? totalSpent > budgetTotal : false;
  const remaining = budgetTotal !== null ? Math.round((budgetTotal - totalSpent) * 100) / 100 : null;

  return {
    tripId,
    currency,
    budgetTotal,
    totalSpent,
    remaining,
    overBudget,
    byCategory,
    byCity,
  };
}

async function getTripDailyCostBreakdown(userId, tripId) {
  await assertTripOwnership(tripId, userId);

  const result = await db.query(
    `SELECT activity_date AS date, COALESCE(SUM(cost), 0) AS total
     FROM activities
     WHERE trip_id = $1
     GROUP BY activity_date
     ORDER BY activity_date ASC`,
    [tripId]
  );

  return result.rows.map((r) => ({
    date: formatDateOnly(r.date),
    total: Number(r.total || 0),
  }));
}

module.exports = {
  updateTripBudget,
  getTripBudgetSummary,
  getTripDailyCostBreakdown,
};
