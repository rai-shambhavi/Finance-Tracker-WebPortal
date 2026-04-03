// ─────────────────────────────────────────────────────────────────────────────
// server.js  –  Run with:  node server.js
// ─────────────────────────────────────────────────────────────────────────────
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// Allow browser requests from any origin (needed for local development)
app.use(cors({ origin: '*' }));

// Parse incoming JSON request bodies
app.use(express.json());

// Serve the frontend folder as static files
// So visiting http://localhost:3000 opens frontend/index.html
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/logs',         require('./routes/logs'));
app.use('/api/users',        require('./routes/users'));

// ── Health check ──────────────────────────────────────────────────────────────
// Visit http://localhost:3000/api/health to confirm the server is running
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'UPAY backend is running!' });
});

// ── Start the server ──────────────────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n✅  UPAY server running  →  http://localhost:${PORT}`);
  console.log(`📊  Data file            →  backend/upay-data.xlsx\n`);
});
