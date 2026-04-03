const sessions = new Map();

function createSession(token, userInfo) {
  sessions.set(token, userInfo);
}

function destroySession(token) {
  sessions.delete(token);
}

function requireLogin(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token  = header.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ error: 'Not logged in. Please sign in first.' });
  }

  const user = sessions.get(token);
  if (!user) {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }

  req.user = user; // available as req.user in all route handlers
  next();
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can perform this action.' });
  }
  next();
}

module.exports = { createSession, destroySession, requireLogin, requireAdmin };
