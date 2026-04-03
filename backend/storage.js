// ─────────────────────────────────────────────────────────────────────────────
// storage.js
//
// Everything that reads from or writes to the Excel file lives here.
// The file  upay-data.xlsx  is created automatically on the first run.
// It has three sheets:
//   • Transactions  – all financial records
//   • Users         – login credentials
//   • Logs          – audit trail (who did what and when)
// ─────────────────────────────────────────────────────────────────────────────

const XLSX = require('xlsx');
const path = require('path');
const fs   = require('fs');

// Path to the Excel file (sits inside the backend folder)
const FILE = path.join(__dirname, 'upay-data.xlsx');

// Sheet name constants – never type these strings twice
const SHEET = {
  tx:    'Transactions',
  users: 'Users',
  logs:  'Logs',
};

// ── Tiny helpers ──────────────────────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 9);
const now   = () => new Date().toISOString().replace('T', ' ').slice(0, 19);

// ── Low-level: read the workbook from disk ────────────────────────────────────
function readWorkbook() {
  if (!fs.existsSync(FILE)) return createFreshWorkbook();
  return XLSX.readFile(FILE);
}

// ── Low-level: save the workbook to disk ──────────────────────────────────────
function saveWorkbook(wb) {
  XLSX.writeFile(wb, FILE);
}

// ── Low-level: read one sheet → array of plain objects ───────────────────────
function readSheet(sheetName) {
  const wb = readWorkbook();
  const ws = wb.Sheets[sheetName];
  if (!ws) return [];
  return XLSX.utils.sheet_to_json(ws, { defval: '' });
}

// ── Low-level: overwrite one sheet with an array of objects ──────────────────
function writeSheet(sheetName, rows) {
  const wb = readWorkbook();
  wb.Sheets[sheetName] = XLSX.utils.json_to_sheet(rows);
  if (!wb.SheetNames.includes(sheetName)) wb.SheetNames.push(sheetName);
  saveWorkbook(wb);
}

// ── Create the Excel file from scratch with sample data ───────────────────────
function createFreshWorkbook() {
  const wb = XLSX.utils.book_new();

  const users = [
    { id:'u1', username:'admin',  password:'admin123', name:'Admin User',   role:'admin', created_at: now() },
    { id:'u2', username:'staff1', password:'staff123', name:'Staff User1', role:'staff', created_at: now() },
  ];

  const txs = [
    { id:'t1',  date:'2025-12-10', project:'Women Safety',      location:'Sitaburdi',    amount:50000,  flow:'Credit', type:'Income',  created_by:'admin',  created_at: now() },
    { id:'t2',  date:'2025-12-25', project:'Women Safety',      location:'Sitaburdi',    amount:20000,  flow:'Debit',  type:'Expense', created_by:'staff1', created_at: now() },
    { id:'t3',  date:'2025-12-05', project:'Annual Sports Day', location:'IT Park',     amount:170000, flow:'Credit', type:'Income',  created_by:'admin',  created_at: now() },
    { id:'t4',  date:'2025-12-20', project:'Annual Sports Day', location:'IT Park',     amount:90000,  flow:'Debit',  type:'Expense', created_by:'staff1', created_at: now() },
    { id:'t5',  date:'2025-12-11', project:'Self Awareness',    location:'Mount Road',      amount:30000,  flow:'Credit', type:'Income',  created_by:'admin',  created_at: now() },
    { id:'t6',  date:'2026-01-12', project:'Self Awareness',    location:'Mount Road',      amount:10000,  flow:'Debit',  type:'Expense', created_by:'staff1', created_at: now() },
    { id:'t7',  date:'2025-12-03', project:'Education Support', location:'Gandhi Nagar', amount:100000, flow:'Credit', type:'Income',  created_by:'admin',  created_at: now() },
    { id:'t8',  date:'2026-02-22', project:'Education Support', location:'Gandhi Nagar', amount:50000,  flow:'Debit',  type:'Expense', created_by:'admin',  created_at: now() },
    { id:'t9',  date:'2026-03-10', project:'Women Safety',      location:'Wardhaman Nagar', amount:25000,  flow:'Credit', type:'Income',  created_by:'staff1', created_at: now() },
    { id:'t10', date:'2026-03-18', project:'Annual Sports Day', location:'Sakkardara',   amount:40000,  flow:'Debit',  type:'Expense', created_by:'staff1', created_at: now() },
  ];

  const logs = [
    { id: genId(), username:'admin', action:'System initialised – sample data loaded', action_type:'add', created_at: now() },
  ];

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(users), SHEET.users);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(txs),   SHEET.tx);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(logs),  SHEET.logs);

  XLSX.writeFile(wb, FILE);
  console.log('✅  upay-data.xlsx created with default users + sample transactions');
  return wb;
}

// =============================================================================
//  TRANSACTIONS
// =============================================================================

function getAllTransactions() {
  return readSheet(SHEET.tx);
}

function addTransaction(data) {
  const rows  = readSheet(SHEET.tx);
  const newTx = {
    id:         genId(),
    date:       data.date,
    project:    data.project,
    location:   data.location,
    amount:     Number(data.amount),
    flow:       data.flow,
    type:       data.type,
    created_by: data.created_by,
    created_at: now(),
  };
  rows.push(newTx);
  writeSheet(SHEET.tx, rows);
  return newTx;
}

function updateTransaction(id, data) {
  const rows = readSheet(SHEET.tx);
  const idx  = rows.findIndex(r => String(r.id) === String(id));
  if (idx === -1) return null;
  rows[idx] = {
    ...rows[idx],
    date:       data.date,
    project:    data.project,
    location:   data.location,
    amount:     Number(data.amount),
    flow:       data.flow,
    type:       data.type,
    updated_at: now(),
  };
  writeSheet(SHEET.tx, rows);
  return rows[idx];
}

function deleteTransaction(id) {
  const rows   = readSheet(SHEET.tx);
  const target = rows.find(r => String(r.id) === String(id));
  if (!target) return null;
  writeSheet(SHEET.tx, rows.filter(r => String(r.id) !== String(id)));
  return target;
}

// =============================================================================
//  USERS
// =============================================================================

function getAllUsers() {
  return readSheet(SHEET.users);
}

function findUser(username) {
  return readSheet(SHEET.users).find(u => u.username === username) || null;
}

function addUser(data) {
  const rows = readSheet(SHEET.users);
  if (rows.find(u => u.username === data.username)) return null; // username taken
  const newUser = { id: genId(), ...data, created_at: now() };
  rows.push(newUser);
  writeSheet(SHEET.users, rows);
  return newUser;
}

function deleteUser(id) {
  const rows   = readSheet(SHEET.users);
  const target = rows.find(u => String(u.id) === String(id));
  if (!target) return null;
  writeSheet(SHEET.users, rows.filter(u => String(u.id) !== String(id)));
  return target;
}

// =============================================================================
//  LOGS
// =============================================================================

function getAllLogs() {
  return readSheet(SHEET.logs).reverse(); // newest first
}

function addLog(username, action, action_type) {
  const rows = readSheet(SHEET.logs);
  rows.push({ id: genId(), username, action, action_type, created_at: now() });
  writeSheet(SHEET.logs, rows);
}

// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  getAllTransactions, addTransaction, updateTransaction, deleteTransaction,
  getAllUsers, findUser, addUser, deleteUser,
  getAllLogs, addLog,
};
