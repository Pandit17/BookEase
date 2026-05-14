import mongoose from "mongoose";

/* =========================================================
   BOOKING SCHEMA
   - Stores movie ticket booking details
   - Tracks user, movie, seats, payment & status
========================================================= */
const bookingSchema = new mongoose.Schema(
  {
    /* -------------------------------
       USER REFERENCE
    -------------------------------- */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* -------------------------------
       MOVIE REFERENCE
    -------------------------------- */
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    /* -------------------------------
       NUMBER OF SEATS BOOKED
    -------------------------------- */
    seats: {
      type: Number,
      required: true,
    },

    /* -------------------------------
       TOTAL PRICE (calculated)
    -------------------------------- */
    totalPrice: {
      type: Number,
      required: true,
    },

    /* -------------------------------
       PAYMENT STATUS TRACKING
       - pending: not paid yet
       - paid: payment completed
       - refunded: money returned
    -------------------------------- */
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },

    /* -------------------------------
       BOOKING STATUS TRACKING
       - confirmed: active booking
       - cancelled: booking cancelled
    -------------------------------- */
    bookingStatus: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },

    /* -------------------------------
       AUTO DELETE TIMER FIELD
       - Used for scheduled cleanup
       - Can be used by cron job later
    -------------------------------- */
    deleteAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt auto generated
  }
);

/* =========================================================
   BOOKING MODEL EXPORT
========================================================= */
const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;