import express from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   AUTH ROUTES
   - Handles user registration, login, and profile access
========================================================= */

/* -------------------------------
   REGISTER NEW USER
-------------------------------- */
router.post("/register", registerUser);

/* -------------------------------
   LOGIN USER
-------------------------------- */
router.post("/login", loginUser);

/* -------------------------------
   GET USER PROFILE (PROTECTED)
   - Requires valid JWT token
-------------------------------- */
router.get("/profile", protect, getUserProfile);

export default router;