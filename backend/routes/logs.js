// ─────────────────────────────────────────────────────────────────────────────
// routes/logs.js
//   GET /api/logs  – returns activity log (admin only)
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();

const storage = require('../storage');
const { requireLogin, requireAdmin } = require('../middleware/auth');

router.get('/', requireLogin, requireAdmin, (req, res) => {
  const logs = storage.getAllLogs().map(l => ({
    id:     l.id,
    user:   l.username,
    action: l.action,
    type:   l.action_type,
    ts:     l.created_at,
  }));
  res.json(logs);
});

module.exports = router;
