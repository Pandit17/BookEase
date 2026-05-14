import express from "express";

import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

import protect, {
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC ROUTES
========================================================= */

// Get all movies
router.get("/", getMovies);

// Get single movie
router.get("/:id", getMovieById);

/* =========================================================
   ADMIN ROUTES
========================================================= */

// Create movie
router.post(
  "/",
  protect,
  adminOnly,
  createMovie
);

// Update movie
router.put(
  "/:id",
  protect,
  adminOnly,
  updateMovie
);

// Delete movie
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteMovie
);

export default router;