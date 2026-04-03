// ─────────────────────────────────────────────────────────────────────────────
// routes/auth.js
//   POST /api/auth/login   – check credentials, return token
//   POST /api/auth/logout  – invalidate token
//   GET  /api/auth/me      – check if current token is still valid
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const crypto  = require('crypto');
const router  = express.Router();

const storage = require('../storage');
const { createSession, destroySession, requireLogin } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password and role are required.' });
  }

  const user = storage.findUser(username);

  // Check: user exists AND password matches AND role matches
  if (!user || String(user.password) !== String(password) || user.role !== role) {
    return res.status(401).json({ error: 'Invalid username, password, or role.' });
  }

  // Generate a random session token
  const token = crypto.randomBytes(32).toString('hex');
  createSession(token, { username: user.username, name: user.name, role: user.role });

  res.json({
    token,
    user: { username: user.username, name: user.name, role: user.role },
  });
});

// POST /api/auth/logout
router.post('/logout', requireLogin, (req, res) => {
  const token = (req.headers['authorization'] || '').replace('Bearer ', '').trim();
  destroySession(token);
  res.json({ message: 'Logged out successfully.' });
});

// GET /api/auth/me  – frontend calls this on page load to restore session
router.get('/me', requireLogin, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
