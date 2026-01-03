const { verifyAccessToken } = require('../utils/jwt');
const db = require('../db/postgres');

function adminMiddleware(req, res, next) {
  (async () => {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = decoded?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Attach minimal user context
    req.user = { id: userId };

    const result = await db.query('SELECT role FROM users WHERE id = $1', [userId]);
    if (result.rowCount === 0) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const role = String(result.rows[0].role || 'user').toLowerCase();
    if (role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    return next();
  })().catch((err) => next(err));
}

module.exports = adminMiddleware;
