# 🎬 BookEase – Full-Stack Movie Booking System

A full-stack movie ticket booking application built with **React (Vite)** for the frontend and **Node.js + Express + MongoDB** for the backend.

➤ Seat selection system with real-time UI state handling

➤ PayPal payment integration for secure checkout

➤ Admin dashboard for managing movies, bookings, and revenue

➤ JWT authentication with role-based access (User / Admin)

➤ RESTful APIs with structured MVC backend architecture

➤ Global error handling + background job for booking cleanup

---

## Live Demo 

*Currently under deployment. Will be available soon.*

[]()

---

## Features

### **Frontend:**

* Movie listing and detailed movie pages
* Interactive seat selection system (max 10 seats per booking)
* PayPal payment integration (`@paypal/react-paypal-js`)
* Booking summary with real-time price calculation
* Authentication system (Register/Login)
* Protected routes for logged-in users
* Admin dashboard with analytics UI
* Toast notifications using `react-hot-toast`
* Responsive dark-themed UI with Tailwind CSS

---

### **Backend:**

* User authentication (JWT-based login/register)
* Password hashing using bcrypt.js
* Movie CRUD (Admin only)
* Booking system with seat validation
* Payment status tracking (pending → paid → refunded)
* Admin booking management (cancel/delete bookings)
* Revenue calculation from paid bookings
* MongoDB with Mongoose schemas
* Centralized error handling middleware
* Background cron job for booking cleanup

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Pandit17/bookease.git
cd bookease
```

---

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

> Server runs on: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

> Frontend runs on: `http://localhost:5173`

---

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bookease
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
```

### Frontend `.env`

```env
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

---

## Project Structure

```
BookEase/
├─ server/
│  ├─ config/           # DB connection
│  ├─ controllers/      # Business logic (auth, movies, bookings)
│  ├─ middleware/       # auth + error handling
│  ├─ models/           # MongoDB schemas (User, Movie, Booking)
│  ├─ routes/           # API routes
│  ├─ jobs/             # cron jobs (cleanup bookings)
│  ├─ utils/            # Utility functions 
│  ├─ server.js         # Entry point
│  └─ .env.example
│
├─ client/
│  ├─ src/
│  │  ├─ pages/         # MovieDetails, AdminDashboard, etc.
│  │  ├─ components/    # UI components
│  │  ├─ context/       # Auth context
│  │  ├─ services/      # API layer
│  │  ├─ routes/        # Route protection logic
│  │  ├─ layouts/       # Shared UI layouts 
│  │  ├─ main.jsx
│  │  └─ App.jsx
│  └─ .env.example
│  └─ index.html
└─ .gitignore
└─ README.md
```

---

## Payment System

* Uses PayPal sandbox/production via `@paypal/react-paypal-js`
* Prices calculated in INR on frontend
* Converted to USD during PayPal checkout
* Booking marked as **paid** after successful transaction

---

## Admin Features

* Add / Edit / Delete movies
* View all bookings
* Cancel bookings (admin override)
* View platform analytics:

  * Total movies
  * Total users
  * Total bookings
  * Total revenue

---

## Security Features

* JWT authentication
* Password hashing with bcrypt
* Protected API routes
* Role-based authorization (user/admin)
* Payment verification before marking booking as paid

---

## Future Improvements

* Real-time seat locking (WebSockets)
* Email confirmation system
* Refund automation via payment gateway
* Advanced analytics charts (Recharts)
* Multi-theatre support system

---

## Tech Stack

**Frontend:**

* React (Vite)
* Tailwind CSS
* React Router DOM
* PayPal SDK
* React Hot Toast

**Backend:**

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT
* bcrypt.js

---

## Author

Built by **Shwet Gautam**

---

## License

This project is for educational purposes only.

---

