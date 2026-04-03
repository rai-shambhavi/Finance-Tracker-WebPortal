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
│   ├── server.js              
│   ├── storage.js             
│   ├── package.json           
│   ├── upay-data.xlsx         
│   │
│   ├── middleware/
│   │   └── auth.js            
│   │
│   └── routes/
│       ├── auth.js            
│       ├── transactions.js    
│       ├── logs.js           
│       └── users.js           
│
└── frontend/
    └── index.html             
```
---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Step 1 – Clone the repository:
git clone <your-repo-link>

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

> ⚠️ To update credentials:
Open `upay-data.xlsx` → Go to the **Users** sheet → Edit the password column → Save the file.

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
    - View data
    - Perform bulk edits
    - Generate reports

---
