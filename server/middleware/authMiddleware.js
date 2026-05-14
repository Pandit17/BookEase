import jwt from "jsonwebtoken";

import User from "../models/User.js";

/* =========================================================
   PROTECT MIDDLEWARE
   - Verifies JWT token
   - Attaches logged-in user to request
========================================================= */
const protect = async (
  req,
  res,
  next
) => {
  try {
    let token;

    /* -------------------------------
       CHECK AUTH HEADER
    -------------------------------- */
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];
    }

    // No token provided
    if (!token) {
      return res.status(401).json({
        message:
          "Not authorized, no token provided",
      });
    }

    /* -------------------------------
       VERIFY TOKEN
    -------------------------------- */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /* -------------------------------
       FIND USER
    -------------------------------- */
    const user = await User.findById(
      decoded.id
    ).select("-password");

    // User deleted after token creation
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    /* -------------------------------
       ATTACH USER TO REQUEST
    -------------------------------- */
    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Auth Middleware Error:",
      error.name
    );

    /* -------------------------------
       TOKEN EXPIRED
    -------------------------------- */
    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        message:
          "Session expired. Please login again.",
      });
    }

    /* -------------------------------
       INVALID TOKEN
    -------------------------------- */
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

/* =========================================================
   ADMIN ONLY MIDDLEWARE
   - Allows only admin users
========================================================= */
export const adminOnly = (
  req,
  res,
  next
) => {
  if (
    req.user &&
    req.user.role === "admin"
  ) {
    next();
  } else {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
};

export default protect;