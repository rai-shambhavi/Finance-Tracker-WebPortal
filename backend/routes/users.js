// ─────────────────────────────────────────────────────────────────────────────
// routes/users.js
//   GET    /api/users      – list all users, no passwords (admin only)
//   POST   /api/users      – create a new user (admin only)
//   DELETE /api/users/:id  – delete a user (admin only, can't delete yourself)
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();

const storage = require('../storage');
const { requireLogin, requireAdmin } = require('../middleware/auth');

// GET /api/users
router.get('/', requireLogin, requireAdmin, (req, res) => {
  // Return all users but strip the password field for security
  const users = storage.getAllUsers().map(({ password, ...u }) => u);
  res.json(users);
});

// POST /api/users
router.post('/', requireLogin, requireAdmin, (req, res) => {
  const { username, password, name, role } = req.body;

  if (!username || !password || !name || !role) {
    return res.status(400).json({ error: 'All fields (username, password, name, role) are required.' });
  }
  if (!['admin', 'staff'].includes(role)) {
    return res.status(400).json({ error: 'Role must be "admin" or "staff".' });
  }

  const created = storage.addUser({ username, password, name, role });
  if (!created) {
    return res.status(409).json({ error: `Username "${username}" is already taken.` });
  }

  const { password: _, ...safe } = created;
  res.status(201).json(safe);
});

// DELETE /api/users/:id
router.delete('/:id', requireLogin, requireAdmin, (req, res) => {
  const all    = storage.getAllUsers();
  const target = all.find(u => String(u.id) === String(req.params.id));

  if (!target) return res.status(404).json({ error: 'User not found.' });
  if (target.username === req.user.username) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }

  storage.deleteUser(req.params.id);
  res.json({ message: `User "${target.username}" deleted.` });
});

module.exports = router;
