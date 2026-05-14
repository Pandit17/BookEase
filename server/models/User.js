import mongoose from "mongoose";

/* =========================================================
   USER SCHEMA
   - Stores application user data
   - Supports authentication and role-based access
========================================================= */
const userSchema = new mongoose.Schema(
  {
    /* -------------------------------
       USER NAME
    -------------------------------- */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------------
       USER EMAIL (unique login identifier)
    -------------------------------- */
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    /* -------------------------------
       USER PASSWORD (hashed before saving)
    -------------------------------- */
    password: {
      type: String,
      required: true,
    },

    /* -------------------------------
       USER ROLE
       - user: normal customer
       - admin: platform manager
    -------------------------------- */
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

/* =========================================================
   USER MODEL EXPORT
========================================================= */
const User = mongoose.model("User", userSchema);

export default User;