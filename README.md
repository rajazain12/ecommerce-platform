# E-Commerce Platform — Full-Stack Online Store & Admin Dashboard

[![React](https://img.shields.io/badge/Frontend-React%20%2F%20TypeScript-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933.svg?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux%20Toolkit%20%2F%20RTK%20Query-764ABC.svg?style=flat&logo=redux)](https://redux-toolkit.js.org/)
[![SQL Server](https://img.shields.io/badge/Database-SQL%20Server-CC2927.svg?style=flat&logo=microsoftsqlserver)](https://www.microsoft.com/sql-server)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-008CDD.svg?style=flat&logo=stripe)](https://stripe.com/)

A modern, production-ready, full-stack e-commerce web application featuring secure user authentication, role-based access control, a dynamic product catalog, real-time cart state management, secure payment processing, and a comprehensive admin console.

---

## 🌟 Key Features

- **🛍️ Product Catalog & Filtering**: Browse products with detailed specification views and category-based filtering.
- **🔒 Secure Authentication & Authorization**: JWT-based authentication supporting customer and administrator roles with protected routing.
- **🛒 Dynamic Cart & Checkout**: Seamless shopping cart experience powered by Redux Toolkit and integrated with Stripe payment processing.
- **📦 Order Tracking & History**: Customers can view past orders, inspect granular order statuses, and review itemized order details.
- **📊 Comprehensive Admin Dashboard**: Dedicated administrative interface to manage products, categories, users, and store orders.
- **⚡ Optimized Data Caching**: Fast, predictable asynchronous data fetching and state synchronization powered by RTK Query.

---

## 🛠️ Architecture & Tech Stack

### **Backend (`/server`)**
* **Framework**: Node.js & Express.js (TypeScript)
* **Database**: Microsoft SQL Server (via `mssql`)
* **Authentication**: JSON Web Tokens (JWT) & bcryptjs
* **Payments & Webhooks**: Stripe API integration

### **Frontend (`/client`)**
* **Framework**: React with TypeScript & Vite
* **State Management**: Redux Toolkit & RTK Query
* **Routing**: React Router (with role-based guard components)
* **Styling & UI**: Modern CSS / Component architecture

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+ recommended) & npm / yarn
- Microsoft SQL Server installed and running locally or via cloud
- Stripe account (for checkout integration keys)

### 2. Backend Setup
```bash
cd server
npm install

Create a .env file inside the server/ folder and configure your environment variables:
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SERVER=localhost
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
Start the backend development server:

Bash
npm run dev
The Express server will start at http://localhost:5000.

3. Frontend Setup
Bash
cd client
npm install

Create a .env file inside the client/ folder:
VITE_API_URL=http://localhost:5000
Start the Vite development client:

Bash
npm run dev
The frontend application will open at http://localhost:5173.

📂 Project Structure
ecommerce-platform/
├── server/
│   ├── src/
│   │   ├── config/        # Database connection configuration
│   │   ├── controllers/   # Auth, Product, Category, Order, & User controllers
│   │   ├── middleware/    # JWT verification & Admin authorization guards
│   │   ├── routes/        # Express API routers
│   │   └── index.ts       # Main Express application entrypoint
│   ├── package.json
│   └── tsconfig.json
│
└── client/
    ├── src/
    │   ├── api/           # RTK Query API slices (admin, auth, products, etc.)
    │   ├── app/           # Redux store configuration
    │   ├── components/    # Reusable UI components & Protected Route guards
    │   ├── features/      # Redux feature slices (auth, cart)
    │   ├── pages/         # View components (Home, Cart, AdminDashboard, etc.)
    │   ├── routes/        # App routing configuration
    │   └── App.tsx
    ├── package.json
    └── vite.config.ts

📄 License
Developed as a professional portfolio full-stack project demonstrating enterprise-grade software engineering principles, secure state management, and relational database design.


### Next Steps:
1. Create a file named `README.md` in the root of your `ecommerce-platform` folder.
2. Paste this text inside and save it.
3. Run `git add README.md`, commit your changes, and push to GitHub (`git push origin main`), and your repository
