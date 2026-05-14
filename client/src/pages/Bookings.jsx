import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";

import toast from "react-hot-toast";

import API from "../services/api";

const Bookings = () => {
  const navigate = useNavigate();

  // User booking data
  const [bookings, setBookings] = useState([]);

  // Page loading state
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user's bookings
  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings/my-bookings");

      setBookings(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Load booking data on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchBookings();
    };

    loadData();
  }, []);

  // Update booking status after successful payment
  const handlePaymentSuccess = async (bookingId) => {
    try {
      await API.put(`/bookings/${bookingId}/pay`);

      toast.success("Payment successful!");

      fetchBookings();
    } catch (error) {
      console.log(error);

      toast.error("Payment update failed");
    }
  };

  // Cancel an existing booking
  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      await API.put(`/bookings/${bookingId}/cancel`);

      toast.success("Booking cancelled successfully");

      fetchBookings();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Cancellation failed"
      );
    }
  };

  // Calculate remaining cancellation time window
  const getHoursLeftToCancel = (createdAt) => {
    const bookingTime = new Date(createdAt);

    const now = new Date();

    const diffHours =
      24 - (now - bookingTime) / (1000 * 60 * 60);

    return diffHours > 0 ? diffHours : 0;
  };

  // Generate payment status badge styles
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-400 border-green-500/30";

      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";

      case "refunded":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";

      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  // Generate booking status badge styles
  const getBookingStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30";

      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";

      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  // Render loading state while booking data is being fetched
  if (loading) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">
          Loading bookings...
        </h1>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <h1 className="text-5xl font-extrabold bg-linear-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            My Bookings
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your movie experiences
          </p>
        </div>

        {/* Navigation Action */}
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
        >
          Browse Movies
        </button>
      </div>

      {/* Empty Booking State */}
      {bookings.length === 0 ? (
        <div className="text-center py-24 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-md">
          <div className="text-7xl mb-6">🎬</div>

          <h2 className="text-3xl font-bold mb-4">
            No bookings yet
          </h2>

          <p className="text-slate-400 mb-8">
            Book your first movie experience now.
          </p>

          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 rounded-2xl bg-linear-to-r from-red-500 via-pink-500 to-purple-500 hover:scale-105 transition-all duration-300 font-bold"
          >
            Explore Movies
          </button>
        </div>
      ) : (
        <div className="grid gap-8">
          {bookings.map((booking) => {
            // Remaining cancellation time
            const hoursLeft =
              getHoursLeftToCancel(
                booking.createdAt
              );

            const isExpiringSoon =
              hoursLeft > 0 &&
              hoursLeft <= 1;

            const isExpired =
              hoursLeft <= 0;

            return (
              <div
                key={booking._id}
                className={`
                  rounded-3xl
                  overflow-hidden
                  backdrop-blur-md
                  transition-all
                  duration-300
                  border

                  ${
                    isExpired
                      ? `
                        bg-slate-900/40
                        border-slate-800
                        opacity-70
                      `
                      : `
                        bg-slate-900/70
                        border-slate-800
                        hover:border-purple-500/40
                        hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]
                      `
                  }
                `}
              >
                <div className="flex flex-col lg:flex-row">

                  {/* Movie Poster */}
                  <div className="lg:w-90 h-125 overflow-hidden">
                    <img
                      src={booking.movie?.image}
                      alt={booking.movie?.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-8">

                    {/* Booking Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                      <div>
                        <h2 className="text-3xl font-bold mb-3">
                          {booking.movie?.title ||
                            "Movie Unavailable"}
                        </h2>

                        <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                          <span>
                            🎭 {booking.movie?.genre}
                          </span>

                          <span>
                            ⏱ {booking.movie?.duration}
                          </span>

                          <span>
                            📅{" "}
                            {new Date(
                              booking.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Booking Status Indicators */}
                      <div className="flex flex-wrap gap-3">
                        {isExpiringSoon && (
                          <span
                            className="
                              px-4
                              py-2
                              rounded-full
                              text-sm
                              font-semibold
                              border
                              bg-yellow-500/20
                              text-yellow-400
                              border-yellow-500/30
                              animate-pulse
                            "
                          >
                            ⏳ Less than 1 hour left to cancel
                          </span>
                        )}

                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPaymentStatusColor(
                            booking.paymentStatus
                          )}`}
                        >
                          Payment:{" "}
                          {booking.paymentStatus}
                        </span>

                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold border ${getBookingStatusColor(
                            booking.bookingStatus
                          )}`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </div>
                    </div>

                    {/* Booking Information Cards */}
                    <div className="grid sm:grid-cols-2 gap-5 mb-8">
                      <div className="bg-slate-800/50 rounded-2xl p-5">
                        <p className="text-slate-400 text-sm mb-2">
                          Seats
                        </p>

                        <p className="text-2xl font-bold">
                          {booking.seats}
                        </p>
                      </div>

                      <div className="bg-slate-800/50 rounded-2xl p-5">
                        <p className="text-slate-400 text-sm mb-2">
                          Total Price
                        </p>

                        <p className="text-2xl font-bold text-green-400">
                          ₹{booking.totalPrice}
                        </p>
                      </div>

                      <div className="bg-slate-800/50 rounded-2xl p-5">
                        <p className="text-slate-400 text-sm mb-2">
                          Payment Method
                        </p>

                        <p className="text-lg font-semibold">
                          💳{" "}
                          {booking.paymentMethod ||
                            "PayPal"}
                        </p>
                      </div>

                      <div className="bg-slate-800/50 rounded-2xl p-5">
                        <p className="text-slate-400 text-sm mb-2">
                          Booking ID
                        </p>

                        <p className="text-sm text-slate-300 break-all">
                          {booking._id}
                        </p>
                      </div>
                    </div>

                    {/* Booking Actions */}
                    <div className="flex flex-wrap gap-4">

                      {/* Booking Cancellation */}
                      {booking.bookingStatus !==
                        "cancelled" && (
                        <div className="flex flex-col gap-2">

                          <p className="text-xs text-slate-400">
                            {hoursLeft > 0
                              ? `Cancel available for ${Math.ceil(
                                  hoursLeft
                                )} hours`
                              : "Cancellation window expired permanently"}
                          </p>

                          <button
                            onClick={() =>
                              handleCancelBooking(
                                booking._id
                              )
                            }
                            disabled={
                              hoursLeft <= 0
                            }
                            className={`px-6 py-3 rounded-2xl border font-semibold transition-all duration-300 ${
                              hoursLeft <= 0
                                ? "bg-slate-700/30 text-slate-500 border-slate-700 cursor-not-allowed"
                                : "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white"
                            }`}
                          >
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>

                    {/* PayPal Payment Section */}
                    {booking.paymentStatus ===
                      "pending" &&
                      booking.bookingStatus !==
                        "cancelled" &&
                      !isExpired && (
                        <div className="mt-8 max-w-md bg-white rounded-2xl p-5">
                          <PayPalButtons
                            createOrder={(_, actions) => {
                              return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [
                                  {
                                    amount: {
                                      currency_code: "USD",
                                      value:
                                        booking.totalPrice.toString(),
                                    },
                                  },
                                ],
                              });
                            }}
                            onApprove={async () => {
                              await handlePaymentSuccess(
                                booking._id
                              );
                            }}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;