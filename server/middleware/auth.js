const jwt = require('jsonwebtoken');

const ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || 'admin-secret-change-me';
const CREW_SECRET = process.env.JWT_CREW_SECRET || 'crew-secret-change-me';

function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(header.slice(7), ADMIN_SECRET);
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireCrew(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(header.slice(7), CREW_SECRET);
    req.crew = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAdmin, requireCrew, ADMIN_SECRET, CREW_SECRET };
