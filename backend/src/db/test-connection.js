require('dotenv').config();

const db = require('./postgres');

async function main() {
  const startedAt = Date.now();
  try {
    const result = await db.query('SELECT 1 AS ok');
    // eslint-disable-next-line no-console
    console.log('PostgreSQL connected:', result.rows[0]);
    // eslint-disable-next-line no-console
    console.log(`Done in ${Date.now() - startedAt}ms`);
  } finally {
    // Ensure process exits cleanly.
    await db.pool.end();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('PostgreSQL connection failed');
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});
