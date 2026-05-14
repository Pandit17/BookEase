import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Database connection
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Background job (cleans expired bookings automatically)
import "./jobs/bookingCleanupCron.js";

// Error middleware
import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

dotenv.config(); // Load environment variables from .env

// Connect to MongoDB before starting server
connectDB();

const app = express();

/* =========================================================
   MIDDLEWARES
========================================================= */
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

/* =========================================================
   API ROUTES
========================================================= */
app.use("/api/auth", authRoutes); // Authentication routes (register/login)
app.use("/api/movies", movieRoutes); // Movie CRUD routes
app.use("/api/bookings", bookingRoutes); // Booking system routes
app.use("/api/payment", paymentRoutes); // Payment-related routes (PayPal)
app.use("/api/users", userRoutes); // User management routes

/* =========================================================
   HEALTH CHECK ROUTE
========================================================= */
app.get("/", (req, res) => {
  res.send("API Running...");
});

/* =========================================================
   ERROR HANDLERS (must be after routes)
========================================================= */
app.use(notFound); // 404 handler
app.use(errorHandler); // global error handler

/* =========================================================
   START SERVER
========================================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});