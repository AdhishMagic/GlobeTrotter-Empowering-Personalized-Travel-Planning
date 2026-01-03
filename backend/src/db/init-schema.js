require('dotenv').config();

const fs = require('fs');
const path = require('path');

const db = require('./postgres');

async function main() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Initializing schema from: ${schemaPath}`);

  try {
    // Postgres can execute multiple statements in a single query string.
    await db.query(schemaSql);
    // eslint-disable-next-line no-console
    console.log('Schema initialized successfully.');
  } finally {
    await db.pool.end();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Schema initialization failed');
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});
