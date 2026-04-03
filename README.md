# Finance Tracker Web Portal

A full-stack web application developed as part of our Community Engagement Project (CEP).
This project aims to deliver a practical, real-world solution while strengthening our software development skills.

## 🤝 About UPAY NGO

UPAY NGO is focused on community development and social impact initiatives.
This application is built to support their operations by providing a simple, efficient, and digital finance tracking system.

## 📁 Folder Structure
```
Finance-Tracker-WebPortal/
│
├── backend/
│   ├── server.js              ← Entry point (starts the server)
│   ├── storage.js             ← All Excel read/write logic
│   ├── package.json           ← Dependencies
│   ├── upay-data.xlsx         ← YOUR DATA (auto-created on first run)
│   │
│   ├── middleware/
│   │   └── auth.js            ← Authentication middleware
│   │
│   └── routes/
│       ├── auth.js            ← Authentication routes
│       ├── transactions.js    ← Add, edit, delete, list transactions
│       ├── logs.js            ← Activity log (admin only)
│       └── users.js           ← Manage user accounts (admin only)
│
└── frontend/
    └── index.html             ← Application UI
```
---

## 🚀 How to Run

### Step 1 – Install Node.js (once ever)
Download from https://nodejs.org → choose the **LTS** version → install normally.

Verify it worked:
```
node --version
```

### Step 2 – Open a terminal in the backend folder
```bash
cd Finance-Tracker-WebPortal/backend
```

### Step 3 – Install libraries (once ever)
```bash
npm install
```

### Step 4 – Start the server
```bash
node server.js
```

You should see:
```
✅  UPAY server running  →  http://localhost:3000
📊  Data file            →  backend/upay-data.xlsx
✅  upay-data.xlsx created with default users + sample transactions
```

### Step 5 – Open the app
Go to **http://localhost:3000** in your browser.

---
## 🔑 Default Login Credentials

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123  |
| Staff | staff1   | staff123  |

> ⚠️ To change passwords: open `upay-data.xlsx` → go to the **Users** sheet → edit the password column → save the file.

---

## 📊 Data Storage

`upay-data.xlsx` is created automatically the first time you start the server with pure *sample data*.
It has **3 sheets**:

| Sheet        | What it stores                              |
|--------------|---------------------------------------------|
| Transactions | All financial records                       |
| Users        | Login credentials for admin and staff       |
| Logs         | History of every add / edit / delete action |

⚠️ Important Notes
- Do not rename sheets or columns
- You can safely:
-     View data
-     Perform bulk edits
     - Generate reports

---
