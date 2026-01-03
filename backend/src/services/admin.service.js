const db = require('../db/postgres');

async function getOverview() {
  const [usersRes, tripsRes, activeTripsRes, publicTripsRes] = await Promise.all([
    db.query('SELECT COUNT(*)::int AS total_users FROM users'),
    db.query('SELECT COUNT(*)::int AS total_trips FROM trips'),
    db.query(
      `SELECT COUNT(*)::int AS active_trips
       FROM trips
       WHERE updated_at >= NOW() - INTERVAL '30 days'`
    ),
    db.query(
      `SELECT COUNT(*)::int AS public_trips
       FROM trips
       WHERE is_public = TRUE`
    ),
  ]);

  return {
    totalUsers: usersRes.rows[0].total_users,
    totalTrips: tripsRes.rows[0].total_trips,
    activeTripsLast30Days: activeTripsRes.rows[0].active_trips,
    publicTrips: publicTripsRes.rows[0].public_trips,
  };
}

async function getPopularCities(limit = 10) {
  const lim = Number.parseInt(String(limit), 10);
  const safeLimit = Number.isFinite(lim) && lim > 0 && lim <= 100 ? lim : 10;

  const result = await db.query(
    `SELECT
        city_name,
        country,
        COUNT(*)::int AS added_count,
        COUNT(DISTINCT trip_id)::int AS trips_count
     FROM trip_cities
     GROUP BY city_name, country
     ORDER BY added_count DESC, trips_count DESC, city_name ASC
     LIMIT $1`,
    [safeLimit]
  );

  return result.rows.map((r) => ({
    cityName: r.city_name,
    country: r.country,
    addedCount: r.added_count,
    tripsCount: r.trips_count,
  }));
}

async function getEngagement(limit = 10) {
  const lim = Number.parseInt(String(limit), 10);
  const safeLimit = Number.isFinite(lim) && lim > 0 && lim <= 100 ? lim : 10;

  const [tripsPerUserRes, avgActsRes, mostActiveUsersRes] = await Promise.all([
    db.query(
      `SELECT u.id AS user_id,
              COALESCE(u.name, (u.first_name || ' ' || u.last_name)) AS name,
              u.email,
              COUNT(t.id)::int AS trips_count
       FROM users u
       LEFT JOIN trips t ON t.user_id = u.id
       GROUP BY u.id, u.name, u.first_name, u.last_name, u.email
       ORDER BY trips_count DESC, u.created_at ASC
       LIMIT $1`,
      [safeLimit]
    ),
    db.query(
      `SELECT
          CASE WHEN (SELECT COUNT(*) FROM trips) = 0 THEN 0
               ELSE (SELECT COUNT(*)::numeric FROM activities) / (SELECT COUNT(*)::numeric FROM trips)
          END AS avg_activities_per_trip`
    ),
    db.query(
      `SELECT
          u.id AS user_id,
          COALESCE(u.name, (u.first_name || ' ' || u.last_name)) AS name,
          u.email,
          COUNT(a.id)::int AS activities_count
       FROM users u
       LEFT JOIN trips t ON t.user_id = u.id
       LEFT JOIN activities a ON a.trip_id = t.id
       GROUP BY u.id, u.name, u.first_name, u.last_name, u.email
       ORDER BY activities_count DESC, u.created_at ASC
       LIMIT $1`,
      [safeLimit]
    ),
  ]);

  return {
    tripsPerUser: tripsPerUserRes.rows.map((r) => ({
      userId: r.user_id,
      name: r.name?.trim() || null,
      email: r.email,
      tripsCount: r.trips_count,
    })),
    averageActivitiesPerTrip: Number(avgActsRes.rows[0].avg_activities_per_trip || 0),
    mostActiveUsers: mostActiveUsersRes.rows.map((r) => ({
      userId: r.user_id,
      name: r.name?.trim() || null,
      email: r.email,
      activitiesCount: r.activities_count,
    })),
  };
}

async function getSystemHealth() {
  // Minimal health metrics; response time/error rate require instrumentation.
  return {
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  getOverview,
  getPopularCities,
  getEngagement,
  getSystemHealth,
};
