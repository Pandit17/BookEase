import mongoose from "mongoose";

/* =========================================================
   DATABASE CONNECTION FUNCTION
   - Connects the app to MongoDB using Mongoose
   - Uses MONGO_URI from environment variables
========================================================= */
const connectDB = async () => {
  try {
    /* Attempt to establish MongoDB connection */
    await mongoose.connect(process.env.MONGO_URI);

    /* Success message */
    console.log("MongoDB Connected");
  } catch (error) {
    /* Log detailed error if connection fails */
    console.error("MongoDB connection failed:", error.message);

    /* Stop the server if DB connection fails */
    process.exit(1);
  }
};

export default connectDB;