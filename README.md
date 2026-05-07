# VnDyn — Frontend

> **Solving for Street Food**

---

## Why This Project Exists

India's street food ecosystem is massive — millions of vendors, crores of customers, and an invisible supply chain that
nobody talks about. Every vendor selling chaat, dosa, or biryani has one persistent problem: **sourcing raw materials
reliably and cheaply**.

There is no platform where a street vendor can browse available ingredients and supplies, place an order, and have it
dispatched by a supplier — all in one place. Vendors rely on word of mouth, local middlemen, and physical markets with
inconsistent pricing and zero accountability.

**VnDyn (Vendor Dynamics)** was built to fix this. It connects three stakeholders:

- **Street Vendors** who need raw materials and supplies
- **Retailers / Suppliers** who provide those materials
- **Admins** who manage the platform and ensure smooth operations

VnDyn gives every party their own portal with exactly the tools they need — order management, payment tracking,
complaint filing, and resource browsing — all in a single web application backed by a real MongoDB database.

---

## What VnDyn Actually Does — Working Principle

```
┌─────────────────────────────────────────────────────────────────┐
│                        VnDyn Platform                           │
│                                                                 │
│   VENDOR                SUPPLIER               ADMIN            │
│   ──────                ────────               ─────            │
│   Browse Resources  →   View Orders       →   View Complaints   │
│   Add to Cart       →   Approve/Reject    →   Resolve/Delete    │
│   Place Order       →   Dispatch          →   Add Resources     │
│   Pay Online        →                    →   View Payments      │
│   File Complaint    →                    →                      │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram (DFD)

```
                        ┌───────────────┐
                        │     USER      │
                        │  (Browser)    │
                        └──────┬────────┘
                               │  HTTP Request
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │   (Vite + React)     │
                    │   localhost:5173     │
                    └──────────┬───────────┘
                               │  fetch() calls
                               │  to /api/*
                               ▼
                    ┌──────────────────────┐
                    │   Flask Backend      │
                    │   (Python + PyMongo) │
                    │   localhost:3001     │
                    └──────────┬───────────┘
                               │  PyMongo driver
                               ▼
                    ┌──────────────────────┐
                    │   MongoDB Atlas      │
                    │   (Cloud Database)   │
                    │   VnDynCluster001    │
                    └──────────────────────┘
```

### Level 1 DFD — Core Processes

```
                    ┌─────────────────────────────────────────┐
                    │              VnDyn System               │
                    │                                         │
  Vendor ──────────►  1.0 Authentication  ◄──────── Supplier  │
                    │        │                                │
                    │        ▼                                │
                    │  2.0 Resource Browse ──► Resource DB    │
                    │        │                                │
                    │        ▼                                │
                    │  3.0 Order Management ──► Orders DB     │
                    │        │                                │
                    │        ▼                                │
                    │  4.0 Payment Processing ──► Payments DB │
                    │        │                                │
  Admin ───────────►  5.0 Complaint System ──► Complaints DB  │
                    │                                         │
                    └─────────────────────────────────────────┘
```

### User Journey — Step by Step

**Vendor Journey:**

```
Register → Login → Dashboard → Vendor Portal
→ Browse Resources → Add to Cart → Place Order
→ Payment Modal → Pay (Card/UPI/Net Banking/COD)
→ Order appears as "pending" in My Orders
→ [Supplier approves] → Status changes to "approved"
```

**Supplier Journey:**

```
Register → Login → Dashboard → Supplier Portal
→ See pending orders from vendors
→ Review order details (items, address, amount)
→ Approve & Dispatch OR Reject
→ Order status updates for vendor in real time
```

**Admin Journey:**

```
Login → Dashboard → Admin Dashboard
→ Complaints tab: View all complaints, Resolve or Delete
→ Resources tab: Add new resources for vendors to browse
→ Payments: View pending/settled/rejected payments
```

---

## User Roles Explained

### Street Vendor

A street food vendor is someone running a small food stall or cart — selling chaat, momos, dosa, or any other street
food. They need raw materials like vegetables, cooking oil, plates, and napkins regularly. On VnDyn, vendors can:

- Browse all available resources listed by suppliers
- Add items to a cart and place an order
- Pay online through the payment modal (Card, UPI, Net Banking, COD)
- Track their order status (pending → approved)
- File complaints if something goes wrong

### Retailer to Vendor (Supplier)

A supplier is a retailer or wholesaler who stocks raw materials and sells them to vendors. On VnDyn, suppliers can:

- View all incoming orders placed by vendors
- See full order details — which vendor, what items, delivery address, total amount
- Approve an order (marks it as dispatched) or Reject it
- Access the payment processing page to track payments

### Admin

The admin manages the entire platform. On VnDyn, admins can:

- View all complaints filed by any user and resolve or delete them
- Add new resources/products for vendors to browse (e.g. new ingredient categories)
- View and manage all payments across the platform
- Access both the complaint dashboard and the resource management panel

---

## Project Structure

```
VnDyn/                          ← Root of frontend project
│
├── index.html                  ← Entry HTML, loads Vite app
├── package.json                ← Node dependencies and scripts
├── vite.config.js              ← Vite build configuration
│
└── src/
    ├── main.jsx                ← React entry point, mounts App
    ├── App.jsx                 ← Route definitions, protected routes
    ├── AuthContext.jsx         ← Global auth state (user login/logout)
    ├── api.js                  ← All API calls to Flask backend
    ├── index.css               ← Global styles (glassmorphism UI)
    │
    └── components/
        ├── Home.jsx            ← Landing page with typewriter animation
        ├── Login.jsx           ← Login form with demo account shortcuts
        ├── Signup.jsx          ← 2-step registration (account + address)
        ├── Dashboard.jsx       ← User dashboard after login
        ├── VendorPortal.jsx    ← Vendor: browse, cart, orders
        ├── SupplierPortal.jsx  ← Supplier: pending orders, approve/reject
        ├── Admin.jsx           ← Admin: complaints + resources
        ├── PaymentProcessing.jsx ← Payment list with settle/reject actions
        ├── PaymentModal.jsx    ← Payment flow modal (card/UPI/COD)
        └── ComplaintForm.jsx   ← Complaint submission form
```

---

## Getting Started — From Scratch

### Prerequisites

Before you begin, make sure you have:

| Tool          | Version              | Download            |
|---------------|----------------------|---------------------|
| Node.js       | v18 or higher        | https://nodejs.org  |
| npm           | comes with Node      | —                   |
| Git           | any                  | https://git-scm.com |
| Flask backend | running on port 3001 | See backend README  |

> **Important:** The frontend talks to the Flask backend. You must start the backend first before using the frontend.
> See `README-backend.md` for backend setup.

---

### Step 1 — Get the Code

```bash
git clone https://github.com/gitgyana/VnDyn.git
cd VnDyn
```

Or if you downloaded a ZIP, extract it and open a terminal inside the folder.

---

### Step 2 — Install Dependencies

```bash
npm install
```

This installs React, React Router, and Vite. It may take a minute.

---

### Step 3 — Start the Backend First

Open a **separate terminal** and start the Flask backend (see `README-backend.md`). Make sure you see:

```
VnDyn Flask API running on http://localhost:3001
```

---

### Step 4 — Start the Frontend

Back in your VnDyn terminal:

```bash
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

### Step 5 — Log In and Explore

Use the demo accounts on the login page to instantly access each role:

| Role     | Email             | Password    |
|----------|-------------------|-------------|
| Admin    | admin@vndyn.com   | admin123    |
| Vendor   | vendor@test.com   | vendor123   |
| Supplier | supplier@test.com | supplier123 |

Click the **"Use"** button next to any demo account on the login page to auto-fill the credentials.

---

## How to Use VnDyn — Beginner Guide

### As a Vendor

1. Go to **http://localhost:5173** and click **"Join as Vendor"** or use the demo vendor account
2. After login, click **"Go to Vendor Portal"**
3. In the **Browse Items** tab, you'll see all available resources. Click **"Add"** to add items to your cart
4. Switch to the **Cart** tab to review your selection and see the total
5. Click **"Place Order and Pay"** — a payment modal will appear
6. Select a payment method (Card, UPI, Net Banking, or COD) and complete the payment
7. Your order appears in the **My Orders** tab with status "pending"
8. Once the supplier approves it, the status changes to "approved"
9. To file a complaint, click **"File Complaint"** at the bottom of any page

### As a Supplier

1. Log in with the supplier demo account
2. Click **"Go to Supplier Portal"**
3. The **Pending Orders** tab shows all orders waiting for your approval
4. Each order card shows: vendor name, items ordered, delivery address, and total amount
5. Click **"Approve and Dispatch"** to fulfill the order, or **"Reject"** to decline
6. Switch to **All Orders** to see the complete history
7. Click **"Payment Processing"** to view payment status for all orders

### As an Admin

1. Log in with the admin demo account
2. Click **"Go to Admin Dashboard"**
3. In the **Complaints** tab, you'll see all complaints filed by vendors and suppliers
4. Click **"Resolve"** to mark a complaint as resolved, or **"Delete"** to remove it
5. Switch to the **Manage Resources** tab to add new products for vendors to browse
6. Fill in the resource name, description, price, and category, then click **"Add Resource"**
7. Click **"Payment Processing"** to view and manage all payments

---

## Available Test Accounts

| Role          | Email             | Phone      | Password    |
|---------------|-------------------|------------|-------------|
| Admin         | admin@vndyn.com   | 9999999999 | admin123    |
| Street Vendor | vendor@test.com   | 8888888888 | vendor123   |
| Supplier      | supplier@test.com | 7777777777 | supplier123 |

You can also register a new account using the **Sign Up** button on the home page.

---

## Component Overview

| Component               | What It Does                                                                                                                                                                       |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Home.jsx`              | Landing page with animated typewriter effect cycling through user types. Has "Join as Vendor" and "Join as Retailer" buttons that go directly to signup with the role pre-selected |
| `Login.jsx`             | Email or phone-based login. Includes demo account shortcuts that auto-fill credentials with one click                                                                              |
| `Signup.jsx`            | Two-step registration form. Step 1 collects account info and role selection. Step 2 collects delivery address. Both steps validate inputs before proceeding                        |
| `Dashboard.jsx`         | Shown after login. Displays user info, account type, address, and quick action buttons to navigate to the appropriate portal                                                       |
| `VendorPortal.jsx`      | Three-tab interface for vendors: Browse Items (with Add to Cart), Cart (with order placement), and My Orders (with status badges)                                                  |
| `SupplierPortal.jsx`    | Two-tab interface for suppliers: Pending Orders (with Approve/Reject buttons and full order details) and All Orders (history view)                                                 |
| `Admin.jsx`             | Two-tab interface for admins: Complaints management (resolve/delete) and Resource management (add new items to the catalog)                                                        |
| `PaymentProcessing.jsx` | Shows payments filtered by status (pending/settled/rejected). Pending payments can be settled via the PaymentModal or rejected directly                                            |
| `PaymentModal.jsx`      | Full payment flow modal with method selection (Card, UPI, Net Banking, COD), input fields, simulated processing animation, and success/failure screens                             |
| `ComplaintForm.jsx`     | Category-based complaint form (Order, Payment, Delivery, Product Quality, Service, Other) with character counter and confirmation redirect                                         |
| `AuthContext.jsx`       | React context that stores the logged-in user globally so all components can access it without prop drilling                                                                        |
| `api.js`                | Centralized API layer. All fetch calls to the Flask backend go through here. Makes it easy to change the backend URL in one place                                                  |

---

## Tech Stack

| Layer             | Technology                    |
|-------------------|-------------------------------|
| Framework         | React 18                      |
| Build Tool        | Vite 5                        |
| Routing           | React Router v6               |
| Styling           | Custom CSS (glassmorphism)    |
| Fonts             | Syne + DM Sans (Google Fonts) |
| API Communication | Fetch API (REST)              |
| State Management  | React useState + Context API  |

---

## Hackathon Context

This project was built for **a contest**, which challenged participants to solve a real problem in India's street food
ecosystem. The challenge: street food vendors struggle to source raw materials from trusted and affordable suppliers.

VnDyn addresses this by creating a structured digital marketplace where vendors can discover suppliers, place orders,
make payments, and raise issues — all without needing to leave their phone or computer.

---

## License

This project is licensed under the **VnDyn License v1.0**. See the `LICENSE` file for details.

---

*Built with purpose. Made for the streets.*

---

