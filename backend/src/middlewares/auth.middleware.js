const { verifyAccessToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized' });
    }

    const decoded = verifyAccessToken(token);

    // Attach minimal user context for downstream usage
    req.user = { id: decoded.userId };

    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}

module.exports = authMiddleware;
