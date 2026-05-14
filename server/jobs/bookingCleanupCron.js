import cron from "node-cron";
import Booking from "../models/Booking.js";

// Runs every day at 2 AM
cron.schedule("0 2 * * *", async () => {
  try {
    console.log("Running booking cleanup cron...");

    const now = new Date();

    const expiredBookings = await Booking.find({
      bookingStatus: "cancelled",
      deleteAt: { $lte: now },
    });

    if (expiredBookings.length === 0) {
      console.log("No expired bookings to delete");
      return;
    }

    await Booking.deleteMany({
      bookingStatus: "cancelled",
      deleteAt: { $lte: now },
    });

    console.log(
      `Deleted ${expiredBookings.length} expired bookings`
    );
  } catch (error) {
    console.error("Cron error:", error.message);
  }
});