const bcrypt = require('bcrypt');
const db = require('../db/postgres');

const SALT_ROUNDS = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

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

function normalizeUrlOrNull(value, fieldName) {
  if (value === undefined) return undefined;
  if (value === null || String(value).trim() === '') return null;

  const str = String(value).trim();
  // Pragmatic URL check (accept http/https only)
  if (!/^https?:\/\//i.test(str)) throw httpError(400, `${fieldName} is invalid`);
  if (str.length > 2048) throw httpError(400, `${fieldName} is invalid`);
  return str;
}

function normalizeLanguage(value) {
  if (value === undefined) return undefined;
  const str = String(value || '').trim();
  if (!str) throw httpError(400, 'language is invalid');
  if (str.length > 10) throw httpError(400, 'language is invalid');
  // Keep it simple; frontend can enforce stricter locale formats
  return str;
}

function normalizeTimezone(value) {
  if (value === undefined) return undefined;
  if (value === null || String(value).trim() === '') return null;
  const str = String(value).trim();
  if (str.length > 100) throw httpError(400, 'timezone is invalid');
  return str;
}

function normalizeName(value) {
  if (value === undefined) return undefined;
  const str = String(value || '').trim();
  if (!str) throw httpError(400, 'name is invalid');
  if (str.length > 200) throw httpError(400, 'name is invalid');
  return str;
}

function splitName(fullName) {
  const trimmed = String(fullName || '').trim();
  if (!trimmed) return { firstName: null, lastName: null };

  const parts = trimmed.split(/\s+/).filter(Boolean);
  const firstName = parts[0] || null;
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
  return { firstName, lastName };
}

function buildDisplayName(row) {
  const explicit = row.name ? String(row.name).trim() : '';
  if (explicit) return explicit;
  const combined = `${row.first_name || ''} ${row.last_name || ''}`.trim();
  return combined || null;
}

function sanitizeMe(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: buildDisplayName(row),
    email: row.email,
    firstName: row.first_name ?? null,
    lastName: row.last_name ?? null,
    phone: row.phone ?? null,
    country: row.country ?? null,
    profilePhoto: row.profile_photo ?? null,
    language: row.language || 'en',
    timezone: row.timezone ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

async function getMe(userId) {
  if (!userId || !isUuid(userId)) throw httpError(401, 'Unauthorized');

  const result = await db.query(
    `SELECT id, first_name, last_name, name, email, phone, country, profile_photo, language, timezone, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rowCount === 0) throw httpError(404, 'User not found');
  return sanitizeMe(result.rows[0]);
}

async function updateMe(userId, payload) {
  if (!userId || !isUuid(userId)) throw httpError(401, 'Unauthorized');

  const nextName = normalizeName(payload?.name);
  const nextProfilePhoto = normalizeUrlOrNull(payload?.profilePhoto, 'profilePhoto');
  const nextLanguage = normalizeLanguage(payload?.language);
  const nextTimezone = normalizeTimezone(payload?.timezone);

  if (
    nextName === undefined &&
    nextProfilePhoto === undefined &&
    nextLanguage === undefined &&
    nextTimezone === undefined
  ) {
    throw httpError(400, 'No updatable fields provided');
  }

  // Fetch current so we can do partial update safely.
  const current = await db.query(
    `SELECT id, first_name, last_name, name, email, phone, country, profile_photo, language, timezone, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (current.rowCount === 0) throw httpError(404, 'User not found');
  const row = current.rows[0];

  const finalName = nextName === undefined ? row.name : nextName;
  const finalProfilePhoto = nextProfilePhoto === undefined ? row.profile_photo : nextProfilePhoto;
  const finalLanguage = nextLanguage === undefined ? row.language : nextLanguage;
  const finalTimezone = nextTimezone === undefined ? row.timezone : nextTimezone;

  // Keep legacy first_name/last_name reasonably in sync when name is updated.
  let finalFirstName = row.first_name;
  let finalLastName = row.last_name;
  if (nextName !== undefined) {
    const split = splitName(nextName);
    if (split.firstName !== null) finalFirstName = split.firstName;
    if (split.lastName !== null) finalLastName = split.lastName;
  }

  const updated = await db.query(
    `UPDATE users
     SET first_name = $2,
         last_name = $3,
         name = $4,
         profile_photo = $5,
         language = $6,
         timezone = $7
     WHERE id = $1
     RETURNING id, first_name, last_name, name, email, phone, country, profile_photo, language, timezone, created_at, updated_at`,
    [
      userId,
      finalFirstName,
      finalLastName,
      finalName,
      finalProfilePhoto,
      finalLanguage,
      finalTimezone,
    ]
  );

  return sanitizeMe(updated.rows[0]);
}

async function changePassword(userId, currentPassword, newPassword) {
  if (!userId || !isUuid(userId)) throw httpError(401, 'Unauthorized');

  const cur = String(currentPassword || '');
  const next = String(newPassword || '');

  if (!cur) throw httpError(400, 'currentPassword is required');
  if (!next) throw httpError(400, 'newPassword is required');
  if (next.length < 8) throw httpError(400, 'newPassword must be at least 8 characters');

  const result = await db.query(
    `SELECT id, password_hash
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rowCount === 0) throw httpError(404, 'User not found');

  const ok = await bcrypt.compare(cur, result.rows[0].password_hash);
  if (!ok) throw httpError(400, 'currentPassword is incorrect');

  const passwordHash = await bcrypt.hash(next, SALT_ROUNDS);

  await db.query('UPDATE users SET password_hash = $2 WHERE id = $1', [userId, passwordHash]);

  return true;
}

async function deleteAccount(userId) {
  if (!userId || !isUuid(userId)) throw httpError(401, 'Unauthorized');

  // Hard delete: cascades to trips -> cities/activities and revokes share links via trip deletion.
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
  if (result.rowCount === 0) throw httpError(404, 'User not found');

  return true;
}

module.exports = {
  getMe,
  updateMe,
  changePassword,
  deleteAccount,
};
