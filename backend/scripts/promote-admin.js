require('dotenv').config();

const db = require('../src/db/postgres');

async function main() {
  const email = process.argv[2];
  const role = process.argv[3] || 'admin';

  if (!email) {
    // eslint-disable-next-line no-console
    console.error('Usage: node ./scripts/promote-admin.js <email> [role]');
    process.exitCode = 2;
    return;
  }

  const result = await db.query(
    'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, email, role',
    [role, email]
  );

  if (!result.rows.length) {
    // eslint-disable-next-line no-console
    console.error(`No user found for email: ${email}`);
    process.exitCode = 1;
    return;
  }

  // eslint-disable-next-line no-console
  console.log('Updated user role:', result.rows[0]);
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to update user role');
    // eslint-disable-next-line no-console
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.pool.end();
  });
