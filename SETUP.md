# VnDyn – Updated Setup Guide

> **This guide continues from the original simple setup.**
> A lot has changed since the first version. Read this fully before starting.

---

## What Changed From the Old Version

The old VnDyn saved all data in the browser's memory (localStorage).
This meant every time you refreshed the page or closed the browser, all data was gone.

The new VnDyn is different. It now has:

| Old Version                  | New Version                                       |
|------------------------------|---------------------------------------------------|
| Data saved in browser memory | Data saved in MongoDB Atlas (real cloud database) |
| No server needed             | Flask backend server needed                       |
| Run only `npm start`         | Run Flask server AND React app together           |
| Data lost on refresh         | Data stays forever                                |
| One terminal                 | Two terminals                                     |

So now you need to set up **two things**:

1. The **Backend** (Flask + Python) — saves data to MongoDB
2. The **Frontend** (React) — the website you see in browser

Both must be running at the same time.

---

## Before You Start — Install These

Make sure all of these are installed on your computer before proceeding.

### 1. Node.js

Used to run the React frontend.

- Download from: https://nodejs.org
- Choose the LTS version (the one that says "Recommended")
- After installing, verify:

```
node --version
```

You should see something like `v20.x.x`

### 2. Python

Used to run the Flask backend.

- Download from: https://www.python.org/downloads/
- Choose Python 3.9 or higher
- **Important on Windows:** During installation, check the box that says **"Add Python to PATH"**
- After installing, verify:

```
python --version
```

You should see something like `Python 3.13.x`

### 3. Git

Used to download the code from GitHub.

- Download from: https://git-scm.com
- After installing, verify:

```
git --version
```

### 4. VS Code (Recommended Editor)

- Download from: https://code.visualstudio.com
- Not required, but makes everything easier

---

## MongoDB Atlas Setup (One Time Only)

MongoDB Atlas is the free cloud database where all VnDyn data is stored.
You only need to set this up once.

### Step 1 — Create Account

Go to https://cloud.mongodb.com and create a free account.

### Step 2 — Create a Project

- After login, click **"New Project"**
- Name it: `VnDyn`
- Click **"Create Project"**

### Step 3 — Create a Cluster

- Click **"Create"** or **"Build a Database"**
- Choose **Free** (M0 Sandbox)
- Provider: AWS
- Region: choose the closest one (Mumbai for India)
- Cluster name: `VnDynCluster001`
- Click **"Create Deployment"**

### Step 4 — Create a Database User

When it asks you to create a user:

- Username: `vndynuser`
- Password: `VnDyn2024`
- Click **"Create User"**

> **Important:** Use this exact password. It has no special characters like `@` or `#` which would cause errors.

### Step 5 — Allow Network Access

- Click **"Add My Current IP Address"** OR
- Click **"Allow Access from Anywhere"** (easier for development)
- Click **"Finish and Close"**

Your MongoDB Atlas is now ready.

---

## Part 1 — Backend Setup (Flask Server)

The backend is in a separate GitHub repository: https://github.com/gitgyana/VnDynBackend

### Step 1 — Create a Folder for Backend

Open your file explorer and create a new folder.
For example: `E:\PR-JT\VnDynBackend`

Or use terminal:

```bash
mkdir VnDynBackend
cd VnDynBackend
```

### Step 2 — Download Backend Code

```bash
git clone https://github.com/gitgyana/VnDynBackend.git .
```

The dot `.` at the end means "download into current folder".

### Step 3 — Create Virtual Environment

A virtual environment is a clean space for Python packages. It keeps this project's packages separate from other Python
projects on your computer.

```bash
python -m venv .venv
```

You will see a new folder called `.venv` appear. That is normal.

### Step 4 — Activate Virtual Environment

**On Windows (Command Prompt or VS Code Terminal):**

```bash
.venv\Scripts\activate
```

**On Mac or Linux:**

```bash
source .venv/bin/activate
```

After activation, your terminal prompt will show `(.venv)` at the start. This means it worked.

```
(.venv) E:\PR-JT\VnDynBackend>
```

> **Every time you open a new terminal to run the backend, you must activate the virtual environment again.**

### Step 5 — Install Python Packages

```bash
pip install -r requirements.txt
```

This installs Flask, PyMongo, and other packages. It will take about a minute. You should see it downloading and
installing packages one by one.

### Step 6 — Start the Backend Server

```bash
python server.py
```

If everything is working, you will see:

```
Default data seeded successfully.
VnDyn Flask API running on http://localhost:3001
 * Running on http://0.0.0.0:3001
 * Debug mode: on
```

**Leave this terminal open. Do not close it.**

The backend is now running on port 3001. It is connected to MongoDB Atlas and ready to receive requests from the
frontend.

---

## Part 2 — Frontend Setup (React App)

The frontend is in the original VnDyn repository: https://github.com/gitgyana/VnDyn

### Step 1 — Open a New Terminal

**Do not close the backend terminal.**
Open a completely new terminal window or tab.

### Step 2 — Download Frontend Code

```bash
git clone https://github.com/gitgyana/VnDyn.git
cd VnDyn
```

### Step 3 — Install Node Packages

```bash
npm install
```

This installs React, Vite, React Router and other packages. It will take a minute or two.

### Step 4 — Start the Frontend

```bash
npm run dev
```

You will see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5 — Open the App

Open your browser and go to:

```
http://localhost:5173
```

You should see the VnDyn home page with the animated text.

---

## Quick Login — No Setup Needed

These accounts are created automatically when the backend starts for the first time.
You do not need to register.

| Role          | Email             | Password    |
|---------------|-------------------|-------------|
| Admin         | admin@vndyn.com   | admin123    |
| Street Vendor | vendor@test.com   | vendor123   |
| Supplier      | supplier@test.com | supplier123 |

On the login page, click the **"Use"** button next to any account to auto-fill and login instantly.

---

## How Both Servers Work Together

```
Your Browser
     │
     │ opens http://localhost:5173
     ▼
React App (Frontend)          ← npm run dev
     │
     │ sends data requests to
     ▼
Flask Server (Backend)        ← python server.py
     │
     │ reads and writes data to
     ▼
MongoDB Atlas (Database)      ← cloud, always on
```

Think of it like a restaurant:

- The **frontend** is the menu and the dining area (what you see)
- The **backend** is the kitchen (processes your order)
- **MongoDB** is the storage room (where ingredients and records are kept)

---

## Running the App Every Day

Every time you want to use VnDyn, you need to start both servers.

**Terminal 1 — Backend:**

```bash
cd VnDynBackend
.venv\Scripts\activate
python server.py
```

**Terminal 2 — Frontend:**

```bash
cd VnDyn
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## Troubleshooting Common Problems

### Problem: `python server.py` shows authentication error

```
pymongo.errors.OperationFailure: bad auth: authentication failed
```

**Fix:** Your MongoDB username or password is wrong.
Go to MongoDB Atlas → Database Access → Edit your user → Reset password to `VnDyn2024` → Wait 30 seconds → Try again.

---

### Problem: `pymongo.errors.InvalidURI: Username and password must be escaped`

**Fix:** Your password has a special character like `@`. Use `VnDyn2024` which has no special characters. The code
already handles this with `quote_plus()`.

---

### Problem: `npm run dev` shows error about missing packages

**Fix:** Run `npm install` first, then try `npm run dev` again.

---

### Problem: Login shows "Failed to fetch" or network error

**Fix:** The Flask backend is not running. Go to Terminal 1 and check if `python server.py` is still running. If not,
start it again.

---

### Problem: `(.venv)` not showing in terminal

**Fix:** You forgot to activate the virtual environment. Run:

- Windows: `.venv\Scripts\activate`
- Mac/Linux: `source .venv/bin/activate`

---

### Problem: Port 3001 already in use

**Fix:** Another program is using port 3001. Either close that program, or find the process and kill it:

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F
```

---

## Full File Structure (Both Projects)

```
Your Computer
│
├── VnDynBackend/              ← Backend project (Flask)
│   ├── server.py              ← Main Flask server, all API routes
│   ├── requirements.txt       ← Python packages list
│   └── .venv/                 ← Virtual environment (auto-created)
│
└── VnDyn/                     ← Frontend project (React)
    ├── index.html             ← Entry HTML file
    ├── package.json           ← Node packages list
    ├── vite.config.js         ← Vite configuration
    └── src/
        ├── main.jsx           ← React entry point
        ├── App.jsx            ← Routes and navigation
        ├── AuthContext.jsx    ← Stores logged-in user
        ├── api.js             ← All calls to Flask backend
        ├── index.css          ← All styles
        └── components/
            ├── Home.jsx
            ├── Login.jsx
            ├── Signup.jsx
            ├── Dashboard.jsx
            ├── VendorPortal.jsx
            ├── SupplierPortal.jsx
            ├── Admin.jsx
            ├── PaymentProcessing.jsx
            ├── PaymentModal.jsx
            └── ComplaintForm.jsx
```

---

## Summary

| Step | What to Do                                                 | Where                     |
|------|------------------------------------------------------------|---------------------------|
| 1    | Create MongoDB Atlas account and cluster                   | https://cloud.mongodb.com |
| 2    | Create database user `vndynuser` with password `VnDyn2024` | Atlas Dashboard           |
| 3    | Allow network access from anywhere                         | Atlas Dashboard           |
| 4    | Clone backend repo                                         | Terminal                  |
| 5    | Create and activate virtual environment                    | Terminal                  |
| 6    | `pip install -r requirements.txt`                          | Terminal in VnDynBackend  |
| 7    | `python server.py`                                         | Terminal 1 (keep open)    |
| 8    | Clone frontend repo                                        | New Terminal              |
| 9    | `npm install`                                              | Terminal in VnDyn         |
| 10   | `npm run dev`                                              | Terminal 2 (keep open)    |
| 11   | Open http://localhost:5173                                 | Browser                   |

