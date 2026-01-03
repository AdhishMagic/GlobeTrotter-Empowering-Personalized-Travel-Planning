const jwt = require('jsonwebtoken');

function getJwtConfig() {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    const err = new Error('JWT_SECRET is required');
    err.status = 500;
    err.expose = true;
    throw err;
  }

  return { secret, expiresIn };
}

function signAccessToken(payload) {
  const { secret, expiresIn } = getJwtConfig();
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyAccessToken(token) {
  const { secret } = getJwtConfig();
  return jwt.verify(token, secret);
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
};
