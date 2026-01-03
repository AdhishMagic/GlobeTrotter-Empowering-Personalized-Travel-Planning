const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  const err = new Error('DATABASE_URL is required');
  err.status = 500;
  err.expose = true;
  throw err;
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  // Many hosted Postgres providers require SSL. For local dev this is usually off.
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
