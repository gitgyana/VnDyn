# VnDyn — Hub for Street Food Vendor & Resource Retailer

**VnDyn** is a fully client-side React application designed to enable seamless interaction between Street Food Vendors, Resource Providers (Suppliers), Retailers to Vendors, and Admins.

---

## Table of Contents

- [Features](#features)  
- [Getting Started](#getting-started)  
- [Project Structure](#project-structure)   
- [User Roles](#user-roles)  
- [Available Test Accounts](#available-test-accounts)  
- [Component Overview](#component-overview)   
- [License](#license)

---

## Features

- **User Authentication** — Signup & Login, with validation and in-memory persistence  
- **Role-Specific Portals**:  
  - Street Vendors: Browse resources, place orders  
  - Suppliers: Approve and dispatch orders  
  - Admin: Manage complaints, add resources  
- **Complaints Management** — Lodge and resolve complaints via UI  
- **Payment Processing** — Track and settle payments per order  
- **Animated UI** — Title animations and responsive glassmorphism styling  
- **State Persistence** — User session maintained via `localStorage` to survive page reloads  
- **Fully Responsive Design** — Mobile-friendly with adaptive layout for desktop and tablets

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)  
- npm package manager

### Installation

1. Clone the repository:

```

git clone https://github.com/gitgyana/VnDyn.git
cd VnDyn

```

2. Install dependencies:

```

npm install

```

3. Start the development server:

```

npm start

```

4. Open `http://localhost:5173` in your web browser.

---

## Project Structure

```

src/
│
├── App.jsx                      Main app that controls view states & navigation
│
├── components/                  React components grouped by functionality
│   ├── Home.jsx                 Landing page with animated title and role selection
│   ├── Signup.jsx               User registration form and logic
│   ├── Login.jsx                User login form and validation
│   ├── UserData.jsx             Dashboard showing user info & navigation options
│   ├── VendorPortal.jsx         Vendor interface for resources & ordering
│   ├── SupplierPortal.jsx       Supplier interface for order approvals
│   ├── Admin.jsx                Admin dashboard for complaint management
│   ├── PaymentProcessing.jsx    Payment settlement UI
│   └── ComplaintForm.jsx        Complaint submission form reusable by portals
│                                
├── assets/                      Static images, videos, and other media files
│                                
└── index.css                    Global CSS with glassmorphism and responsive styles

```

---

## User Roles

| Role            | Description                               | Accessible Portals                            |
|-----------------|-------------------------------------------|----------------------------------------------|
| Street Vendor   | Buys resources, places orders              | VendorPortal                                  |
| Retailer to Vendor (Supplier)  | Approves and dispatches orders          | SupplierPortal                                |
| Admin           | Manages complaints and app data            | Admin, PaymentProcessing                      |

---

## Available Test Accounts

| Role          | Email              | Phone       | Password    |
|---------------|--------------------|-------------|-------------|
| Admin         | admin@vndyn.com    | 9999999999  | admin123    |
| Vendor        | vendor@test.com    | 8888888888  | vendor123   |
| Supplier      | supplier@test.com  | 7777777777  | supplier123 |

Use these for quick login or signup to test different roles.

---

## Component Overview

- **Home.jsx:** Landing page with animated “VnDyn” title and role selection buttons (Vendor or Retailer).  
- **Signup.jsx:** Collects fullname, phone, email, password, and user type. Validates inputs and registers user in `mongoAPI.js`.  
- **Login.jsx:** Authenticates user credentials against in-memory data.  
- **UserData.jsx:** Displays user info and navigation links to role-specific portals or admin tools.  
- **VendorPortal.jsx:** Vendors browse and add resources to cart and place orders.  
- **SupplierPortal.jsx:** Suppliers view pending orders and approve or reject them.  
- **Admin.jsx:** Admin can view, resolve, and delete complaints plus add resources.  
- **PaymentProcessing.jsx:** View pending payments and mark as settled or rejected.  
- **ComplaintForm.jsx:** General complaint submission that multiple portals can reuse.

---

## License

This project is licensed under the VnDynLicense v1.0. See the [LICENSE](LICENSE) file for details.

---

Thank you for exploring **VnDyn**! We hope this fully client-side app serves as a solid foundation and inspiration for your vendor and resource management needs.

---

```

