// ─────────────────────────────────────────────────────────────────────────────
// routes/transactions.js
//   GET    /api/transactions        – list all (admin + staff)
//   POST   /api/transactions        – add new (admin + staff)
//   PUT    /api/transactions/:id    – edit (admin only)
//   DELETE /api/transactions/:id    – delete (admin only)
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();

const storage = require('../storage');
const { requireLogin, requireAdmin } = require('../middleware/auth');

// GET /api/transactions
router.get('/', requireLogin, (req, res) => {
  const all = storage.getAllTransactions();

  // Optional URL filters: ?project=X&location=Y&flow=Credit&type=Income
  const { project, location, flow, type } = req.query;
  const result = all.filter(t => {
    if (project  && t.project  !== project)  return false;
    if (location && t.location !== location) return false;
    if (flow     && t.flow     !== flow)     return false;
    if (type     && t.type     !== type)     return false;
    return true;
  });

  // Add "user" field so the frontend table column works without changes
  res.json(result.map(t => ({ ...t, user: t.created_by })));
});

// POST /api/transactions
router.post('/', requireLogin, (req, res) => {
  const { date, project, location, amount, flow, type } = req.body;

  if (!date || !project || !location || !amount || !flow || !type) {
    return res.status(400).json({ error: 'All fields (date, project, location, amount, flow, type) are required.' });
  }
  if (isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }
  if (!['Credit', 'Debit'].includes(flow)) {
    return res.status(400).json({ error: 'Flow must be Credit or Debit.' });
  }
  if (!['Income', 'Expense'].includes(type)) {
    return res.status(400).json({ error: 'Type must be Income or Expense.' });
  }

  const created = storage.addTransaction({ date, project, location, amount, flow, type, created_by: req.user.username });
  storage.addLog(req.user.username, `Added transaction for ${project} – ${flow} ₹${amount}`, 'add');

  res.status(201).json({ ...created, user: created.created_by });
});

// PUT /api/transactions/:id  (admin only)
router.put('/:id', requireLogin, requireAdmin, (req, res) => {
  const { date, project, location, amount, flow, type } = req.body;

  if (!date || !project || !location || !amount || !flow || !type) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const updated = storage.updateTransaction(req.params.id, { date, project, location, amount, flow, type });
  if (!updated) return res.status(404).json({ error: 'Transaction not found.' });

  storage.addLog(req.user.username, `Edited transaction ${req.params.id} (${project})`, 'edit');

  res.json({ ...updated, user: updated.created_by });
});

// DELETE /api/transactions/:id  (admin only)
router.delete('/:id', requireLogin, requireAdmin, (req, res) => {
  const deleted = storage.deleteTransaction(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Transaction not found.' });

  storage.addLog(req.user.username, `Deleted transaction ${req.params.id} (${deleted.project})`, 'delete');

  res.json({ message: 'Transaction deleted successfully.' });
});

module.exports = router;
