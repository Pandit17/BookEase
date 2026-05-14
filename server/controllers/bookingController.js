import Booking from "../models/Booking.js";

import Movie from "../models/Movie.js";

/* =========================================================
   CREATE BOOKING
========================================================= */
export const createBooking =
  async (req, res) => {
    try {
      const { movieId, seats } =
        req.body;

      /* -------------------------------
         VALIDATION
      -------------------------------- */
      if (!movieId || !seats) {
        return res.status(400).json({
          message:
            "Please provide all fields",
        });
      }

      if (seats <= 0) {
        return res.status(400).json({
          message:
            "Seats must be greater than 0",
        });
      }

      if (seats > 10) {
        return res.status(400).json({
          message:
            "Maximum 10 seats allowed",
        });
      }

      /* -------------------------------
         FIND MOVIE
      -------------------------------- */
      const movie =
        await Movie.findById(movieId);

      if (!movie) {
        return res.status(404).json({
          message: "Movie not found",
        });
      }

      /* -------------------------------
         CHECK SEAT AVAILABILITY
      -------------------------------- */
      if (
        movie.availableSeats < seats
      ) {
        return res.status(400).json({
          message:
            "Not enough seats available",
        });
      }

      /* -------------------------------
         CALCULATE TOTAL
      -------------------------------- */
      const totalPrice =
        movie.price * seats;

      /* -------------------------------
         CREATE BOOKING
      -------------------------------- */
      const booking =
        await Booking.create({
          user: req.user._id,
          movie: movie._id,
          seats,
          totalPrice,
          paymentStatus: "pending",
          bookingStatus:
            "confirmed",
        });

      /* -------------------------------
         REDUCE AVAILABLE SEATS
      -------------------------------- */
      movie.availableSeats -= seats;

      await movie.save();

      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

/* =========================================================
   GET USER BOOKINGS
========================================================= */
export const getUserBookings =
  async (req, res) => {
    try {
      const bookings =
        await Booking.find({
          user: req.user._id,
        })
          .populate(
            "movie",
            "title image duration genre"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        bookings
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

/* =========================================================
   GET ALL BOOKINGS (ADMIN)
========================================================= */
export const getAllBookings =
  async (req, res) => {
    try {
      const bookings =
        await Booking.find()
          .populate(
            "user",
            "name email"
          )
          .populate(
            "movie",
            "title"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        bookings
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

/* =========================================================
   UPDATE PAYMENT STATUS
========================================================= */
export const updateBookingToPaid =
  async (req, res) => {
    try {
      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {
        return res.status(404).json({
          message:
            "Booking not found",
        });
      }

      /* -------------------------------
         ONLY OWNER OR ADMIN
      -------------------------------- */
      const isOwner =
        booking.user.toString() ===
        req.user._id.toString();

      const isAdmin =
        req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(401).json({
          message:
            "Not authorized",
        });
      }

      /* -------------------------------
         PREVENT DOUBLE PAYMENT
      -------------------------------- */
      if (
        booking.paymentStatus ===
        "paid"
      ) {
        return res.status(400).json({
          message:
            "Booking already paid",
        });
      }

      booking.paymentStatus =
        "paid";

      await booking.save();

      res.status(200).json({
        message:
          "Payment successful",
        booking,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

/* =========================================================
   CANCEL BOOKING
========================================================= */
export const cancelBooking =
  async (req, res) => {
    try {
      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {
        return res.status(404).json({
          message:
            "Booking not found",
        });
      }

      const isAdmin =
        req.user.role === "admin";

      /* =====================================================
         ADMIN CANCEL
      ===================================================== */
      if (isAdmin) {
        const movie =
          await Movie.findById(
            booking.movie
          );

        if (movie) {
          movie.availableSeats +=
            booking.seats;

          await movie.save();
        }

        await Booking.findByIdAndDelete(
          req.params.id
        );

        return res.status(200).json({
          message:
            "Booking force deleted by admin",
        });
      }

      /* =====================================================
         USER CANCEL
      ===================================================== */

      // Ownership check
      if (
        booking.user.toString() !==
        req.user._id.toString()
      ) {
        return res.status(401).json({
          message:
            "Not authorized",
        });
      }

      // Already cancelled
      if (
        booking.bookingStatus ===
        "cancelled"
      ) {
        return res.status(400).json({
          message:
            "Booking already cancelled",
        });
      }

      /* -------------------------------
         24 HOUR LIMIT
      -------------------------------- */
      const bookingTime =
        new Date(
          booking.createdAt
        );

      const now = new Date();

      const hoursPassed =
        (now - bookingTime) /
        (1000 * 60 * 60);

      if (hoursPassed > 24) {
        return res.status(400).json({
          message:
            "Cancellation window expired (24 hours limit)",
        });
      }

      /* -------------------------------
         RESTORE SEATS
      -------------------------------- */
      const movie =
        await Movie.findById(
          booking.movie
        );

      if (movie) {
        movie.availableSeats +=
          booking.seats;

        await movie.save();
      }

      /* -------------------------------
         UPDATE BOOKING
      -------------------------------- */
      booking.bookingStatus =
        "cancelled";

      // Refund if already paid
      if (
        booking.paymentStatus ===
        "paid"
      ) {
        booking.paymentStatus =
          "refunded";
      }

      // Auto-delete after 7 days
      booking.deleteAfter =
        new Date(
          Date.now() +
            7 *
              24 *
              60 *
              60 *
              1000
        );

      await booking.save();

      res.status(200).json({
        message:
          "Booking cancelled successfully",
        booking,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };