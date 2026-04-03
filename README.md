# Finance Tracker Web Portal

This project is developed as part of our Community Engagement Project(CEP) at college.
The goal of this project is to build a practical solution that addresses real-world needs while applying our technical skills.

## 🤝 About UPAY NGO

UPAY NGO works towards community development and social impact.
This project is designed to assist their operations by providing a simple and effective digital solution.

```
Finance-Tracker-WebPortal/
│
├── backend/
│   ├── server.js              ← START HERE - runs the server
│   ├── storage.js             ← All Excel read/write logic
│   ├── package.json           ← Library list
│   ├── upay-data.xlsx         ← YOUR DATA (auto-created on first run)
│   │
│   ├── middleware/
│   │   └── auth.js            ← Checks login tokens
│   │
│   └── routes/
│       ├── auth.js            ← Login / logout
│       ├── transactions.js    ← Add, edit, delete, list transactions
│       ├── logs.js            ← Activity log (admin only)
│       └── users.js           ← Manage user accounts (admin only)
│
└── frontend/
    └── index.html             ← The app UI - open in browser
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
