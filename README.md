# E-Commerce Platform — Full-Stack Shopping & Secure Checkout System

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933.svg?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![SQL Server](https://img.shields.io/badge/Database-SQL%20Server-CC2927.svg?style=flat&logo=microsoftsqlserver)](https://www.microsoft.com/sql-server)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-008CDD.svg?style=flat&logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

A modern, production-ready e-commerce platform designed for dynamic product management, secure user authentication, global state management, and seamless Stripe payment integration. 

---

## 🌟 Key Features

- **🛍️ Dynamic Product Catalog**: Browse and filter products across multiple categories with responsive, high-performance detail views.
- **🛒 Robust State Management**: Global shopping cart and asynchronous data fetching handled efficiently via Redux Toolkit and RTK Query.
- **💳 Secure Checkout Integration**: Fully integrated with Stripe for secure payment processing and automated order verification via webhooks.
- **🔒 Role-Based Authentication**: Secure user registration, encrypted JWT-based login, and protected admin routing.
- **📊 Comprehensive Admin Dashboard**: Administrative control panel to create and manage products, handle inventory, and track customer orders.
- **📱 Responsive UI & Validation**: Built with React, Tailwind CSS, and strict form validation using Zod and React Hook Form.

---

## 🛠️ Architecture & Tech Stack

### **Backend (`/server`)**
* **Framework**: Node.js & Express
* **Language**: TypeScript
* **Database**: Microsoft SQL Server (`mssql`, `msnodesqlv8`)
* **Security & Auth**: JSON Web Tokens (JWT), bcrypt for password hashing, CORS
* **Payments**: Stripe API SDK

### **Frontend (`/client`)**
* **Framework**: React built with Vite
* **State Management**: Redux Toolkit & RTK Query
* **Routing**: React Router DOM
* **Styling**: Tailwind CSS 
* **Forms & Validation**: React Hook Form, Zod

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 18.0.0
- Microsoft SQL Server (MSSQL / LocalDB / SQL Server Express)
- Stripe CLI (Required for local webhook testing)

### 2. Backend Setup
~~~bash
cd server
npm install
~~~

Create a `.env` file inside the `server/` directory and configure your environment variables:
~~~env
PORT=5000
DB_SERVER=localhost
DB_NAME=ZainStoreDB
DB_USER=sa
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:5173
~~~

Initialize the database by running your `TABLES.sql` and `Queries.sql` scripts, then start the server:
~~~bash
npm run dev
~~~
The Express backend server will start at `http://localhost:5000`.

### 3. Frontend Setup
~~~bash
cd client
npm install
~~~

Create a `.env` file inside the `client/` directory:
~~~env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
~~~

Start the frontend development client:
~~~bash
npm run dev
~~~
Vite will serve the application locally at `http://localhost:5173`.

---

## 📂 Project Structure

~~~text
ecommerce-platform/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── api/                 # RTK Query API slices (Products, Auth, Orders, etc.)
│   │   ├── app/                 # Redux Store configuration
│   │   ├── components/          # Reusable UI components & Protected/Admin Routes
│   │   ├── features/            # Redux Slices (e.g., cartSlice, authSlice)
│   │   ├── pages/               # Views (Home, Cart, AdminDashboard, Checkout, etc.)
│   │   └── routes/              # AppRoutes configuration
│   ├── package.json
│   └── vite.config.ts
│
└── server/                      # Node.js & Express Backend
    ├── src/
    │   ├── config/              # Database connection pool setup
    │   ├── controllers/         # Business logic for Auth, Products, Orders, Categories
    │   ├── middleware/          # JWT authentication & admin role verification
    │   ├── routes/              # Express API route endpoints
    │   └── index.ts             # Main Express server entrypoint
    ├── requirement.txt          # Detailed dependency breakdown
    ├── package.json
    └── tsconfig.json
~~~

---

## 📄 License

Developed as a professional software engineering portfolio project demonstrating full-stack web development and scalable architecture.
