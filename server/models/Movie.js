import mongoose from "mongoose";

/* =========================================================
   MOVIE SCHEMA
   - Stores all movie details shown on platform
   - Includes pricing, seats, metadata, and media
========================================================= */
const movieSchema = new mongoose.Schema(
  {
    /* -------------------------------
       MOVIE TITLE
    -------------------------------- */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------------
       MOVIE DESCRIPTION
    -------------------------------- */
    description: {
      type: String,
      required: true,
    },

    /* -------------------------------
       MOVIE POSTER IMAGE URL
    -------------------------------- */
    image: {
      type: String,
      required: true,
    },

    /* -------------------------------
       MOVIE GENRE (Action, Drama, etc.)
    -------------------------------- */
    genre: {
      type: String,
      required: true,
    },

    /* -------------------------------
       DURATION (e.g. 2h 15m)
    -------------------------------- */
    duration: {
      type: String,
      required: true,
    },

    /* -------------------------------
       RELEASE DATE
    -------------------------------- */
    releaseDate: {
      type: String,
      required: true,
    },

    /* -------------------------------
       PRICE PER SEAT
    -------------------------------- */
    price: {
      type: Number,
      required: true,
    },

    /* -------------------------------
       AVAILABLE SEATS FOR BOOKING
       - Default starts at 50 seats
       - Gets reduced on booking
    -------------------------------- */
    availableSeats: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

/* =========================================================
   MOVIE MODEL EXPORT
========================================================= */
const Movie = mongoose.model("Movie", movieSchema);

export default Movie;