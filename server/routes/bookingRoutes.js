import express from "express";

import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingToPaid,
  cancelBooking,
} from "../controllers/bookingController.js";

import protect, {
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   USER ROUTES
========================================================= */

// Create new booking
router.post(
  "/",
  protect,
  createBooking
);

// Get logged-in user bookings
router.get(
  "/my-bookings",
  protect,
  getUserBookings
);

// Mark booking as paid
router.put(
  "/:id/pay",
  protect,
  updateBookingToPaid
);

// Cancel booking
router.put(
  "/:id/cancel",
  protect,
  cancelBooking
);

/* =========================================================
   ADMIN ROUTES
========================================================= */

// Get all bookings
router.get(
  "/all",
  protect,
  adminOnly,
  getAllBookings
);

export default router;