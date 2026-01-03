const bcrypt = require('bcrypt');
const db = require('../db/postgres');
const { signAccessToken } = require('../utils/jwt');

const SALT_ROUNDS = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  err.expose = true;
  return err;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  // Simple, pragmatic validation (frontend can be stricter)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone || null,
    country: row.country || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function registerUser(payload) {
  const firstName = String(payload.firstName || '').trim();
  const lastName = String(payload.lastName || '').trim();
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');
  const phone = payload.phone ? String(payload.phone).trim() : null;
  const country = payload.country ? String(payload.country).trim() : null;

  if (!firstName) throw httpError(400, 'firstName is required');
  if (!lastName) throw httpError(400, 'lastName is required');
  if (!email) throw httpError(400, 'email is required');
  if (!isValidEmail(email)) throw httpError(400, 'email is invalid');
  if (!password) throw httpError(400, 'password is required');
  if (password.length < 8) throw httpError(400, 'password must be at least 8 characters');

  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount > 0) throw httpError(409, 'Email already exists');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const insert = await db.query(
    `INSERT INTO users (first_name, last_name, email, password_hash, phone, country)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, first_name, last_name, email, phone, country, created_at, updated_at`,
    [firstName, lastName, email, passwordHash, phone, country]
  );

  const user = sanitizeUser(insert.rows[0]);
  const token = signAccessToken({ userId: user.id });

  return { token, user };
}

async function loginUser(payload) {
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');

  if (!email) throw httpError(400, 'email is required');
  if (!isValidEmail(email)) throw httpError(400, 'email is invalid');
  if (!password) throw httpError(400, 'password is required');

  const result = await db.query(
    `SELECT id, first_name, last_name, email, phone, country, created_at, updated_at, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rowCount === 0) throw httpError(401, 'Invalid email or password');

  const row = result.rows[0];
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) throw httpError(401, 'Invalid email or password');

  const user = sanitizeUser(row);
  const token = signAccessToken({ userId: user.id });

  return { token, user };
}

async function getUserById(userId) {
  if (!userId) throw httpError(400, 'userId is required');

  const result = await db.query(
    `SELECT id, first_name, last_name, email, phone, country, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rowCount === 0) throw httpError(404, 'User not found');
  return sanitizeUser(result.rows[0]);
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
