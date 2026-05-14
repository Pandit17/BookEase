import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../services/api";

import { useAuth } from "../context/useAuth";

import {
  PayPalButtons,
} from "@paypal/react-paypal-js";

import toast from "react-hot-toast";

const MovieDetails = () => {

  /* =========================================================
     ROUTER + AUTH
  ========================================================= */
  const { id } = useParams();

  const navigate = useNavigate();

  const { userInfo } = useAuth();

  /* =========================================================
     STATES
  ========================================================= */
  const [movie, setMovie] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    bookingLoading,
    setBookingLoading,
  ] = useState(false);

  const [bookingId, setBookingId] =
    useState(null);

  const [showPayPal, setShowPayPal] =
    useState(false);

  const [selectedSeats, setSelectedSeats] =
    useState([]);

  /* =========================================================
     TOTAL SEATS
  ========================================================= */
  const seats =
    selectedSeats.length;

  /* =========================================================
     TEMPORARY OCCUPIED SEATS
     (Later will come from backend)
  ========================================================= */
  const occupiedSeats = [
    "A3",
    "A4",
    "B2",
    "C5",
    "D1",
  ];

  /* =========================================================
     SEAT LAYOUT
  ========================================================= */
  const rows = [
    "A",
    "B",
    "C",
    "D",
  ];

  const seatsPerRow = 6;

  /* =========================================================
     FETCH MOVIE
  ========================================================= */
  useEffect(() => {

    const fetchMovie =
      async () => {

        try {

          const { data } =
            await API.get(
              `/movies/${id}`
            );

          setMovie(data);

        } catch (error) {

          console.log(error);

          toast.error(
            "Failed to load movie"
          );

        } finally {

          setLoading(false);
        }
      };

    fetchMovie();

  }, [id]);

  /* =========================================================
     SEAT SELECTION
  ========================================================= */
  const toggleSeat = (seat) => {

    // Prevent occupied seat selection
    if (
      occupiedSeats.includes(seat)
    ) {
      return;
    }

    // Remove seat if already selected
    if (
      selectedSeats.includes(seat)
    ) {

      setSelectedSeats(
        selectedSeats.filter(
          (s) => s !== seat
        )
      );

    } else {

      // Maximum 10 seats
      if (
        selectedSeats.length >= 10
      ) {

        toast.error(
          "Maximum 10 seats allowed"
        );

        return;
      }

      // Add new seat
      setSelectedSeats([
        ...selectedSeats,
        seat,
      ]);
    }
  };

  /* =========================================================
     CREATE BOOKING
  ========================================================= */
  const handleBooking =
    async () => {

      // Redirect guests
      if (!userInfo) {

        navigate("/login");

        return;
      }

      // Prevent duplicate requests
      if (
        bookingLoading ||
        showPayPal
      ) {
        return;
      }

      // Validate seat selection
      if (
        selectedSeats.length === 0
      ) {

        toast.error(
          "Please select at least one seat"
        );

        return;
      }

      try {

        setBookingLoading(true);

        const { data } =
          await API.post(
            "/bookings",
            {
              movieId: id,

              seats,

              // Future real seat booking system
              selectedSeats,
            }
          );

        setBookingId(data._id);

        setShowPayPal(true);

        toast.success(
          "Booking created successfully"
        );

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
            "Booking failed"
        );

      } finally {

        setBookingLoading(false);
      }
    };

  /* =========================================================
     LOADING UI
  ========================================================= */
  if (loading) {

    return (
      <div className="text-center py-32">

        <div
          className="
            animate-pulse
            text-4xl
            font-bold
            text-pink-400
          "
        >
          Loading movie...
        </div>

      </div>
    );
  }

  /* =========================================================
     MOVIE NOT FOUND
  ========================================================= */
  if (!movie) {

    return (
      <div
        className="
          text-center
          py-24
          bg-slate-900/50
          border
          border-slate-800
          rounded-3xl
        "
      >
        <div className="text-7xl mb-6">
          🎬
        </div>

        <h2
          className="
            text-3xl
            font-bold
            mb-4
          "
        >
          Movie not found
        </h2>

        <p className="text-slate-400">
          This movie may have been removed.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        flex
        flex-col
        lg:flex-row
        gap-10
      "
    >

      {/* =====================================================
          MOVIE IMAGE
      ===================================================== */}
      <div className="lg:w-[40%]">

        <img
          src={movie.image}
          alt={movie.title}
          className="
            w-full
            rounded-3xl
            object-cover
            shadow-[0_0_40px_rgba(239,68,68,0.25)]
          "
        />

      </div>

      {/* =====================================================
          MOVIE CONTENT
      ===================================================== */}
      <div className="flex-1">

        {/* Title */}
        <h1
          className="
            text-5xl
            font-extrabold
            mb-6
            bg-linear-to-r
            from-red-400
            via-pink-400
            to-purple-400
            bg-clip-text
            text-transparent
          "
        >
          {movie.title}
        </h1>

        {/* Description */}
        <p
          className="
            text-slate-300
            text-lg
            leading-relaxed
            mb-8
          "
        >
          {movie.description}
        </p>

        {/* =====================================================
            MOVIE INFO
        ===================================================== */}
        <div
          className="
            grid
            grid-cols-2
            gap-4
            mb-8
          "
        >

          {[
            {
              label: "Genre",
              value: movie.genre,
            },

            {
              label: "Duration",
              value: movie.duration,
            },

            {
              label: "Release",
              value:
                new Date(
                  movie.releaseDate
                ).toLocaleDateString(),
            },

            {
              label: "Seats Left",
              value:
                movie.availableSeats,
            },

          ].map((item) => (

            <div
              key={item.label}
              className="
                bg-slate-900/60
                border
                border-slate-800
                rounded-2xl
                p-4
                backdrop-blur-md
              "
            >

              <p className="text-slate-400 text-sm">
                {item.label}
              </p>

              <p className="text-lg font-semibold">
                {item.value}
              </p>

            </div>
          ))}
        </div>

        {/* =====================================================
            PRICE
        ===================================================== */}
        <div
          className="
            text-4xl
            font-bold
            text-red-400
            mb-10
          "
        >
          ₹{movie.price}

          <span className="text-lg text-slate-400 ml-2">
            / seat
          </span>
        </div>

        {/* =====================================================
            SCREEN
        ===================================================== */}
        <div className="mb-8">

          <div
            className="
              w-full
              h-4
              rounded-full
              bg-linear-to-r
              from-red-500
              via-pink-500
              to-purple-500
              blur-[1px]
              mb-2
            "
          />

          <p
            className="
              text-center
              text-slate-400
              tracking-[8px]
              text-sm
            "
          >
            SCREEN
          </p>
        </div>

        {/* =====================================================
            SEAT LEGEND
        ===================================================== */}
        <div
          className="
            flex
            gap-6
            mb-8
            flex-wrap
          "
        >

          {/* Available */}
          <div className="flex items-center gap-2">

            <div
              className="
                w-5
                h-5
                rounded-md
                bg-slate-700
              "
            />

            <span className="text-sm">
              Available
            </span>

          </div>

          {/* Selected */}
          <div className="flex items-center gap-2">

            <div
              className="
                w-5
                h-5
                rounded-md
                bg-purple-500
              "
            />

            <span className="text-sm">
              Selected
            </span>

          </div>

          {/* Occupied */}
          <div className="flex items-center gap-2">

            <div
              className="
                w-5
                h-5
                rounded-md
                bg-red-500
              "
            />

            <span className="text-sm">
              Occupied
            </span>

          </div>
        </div>

        {/* =====================================================
            SEAT GRID
        ===================================================== */}
        <div className="space-y-5 mb-10">

          {rows.map((row) => (

            <div
              key={row}
              className="
                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  w-6
                  text-slate-400
                  font-bold
                "
              >
                {row}
              </span>

              <div className="flex gap-3 flex-wrap">

                {Array.from({
                  length: seatsPerRow,
                }).map((_, index) => {

                  const seat =
                    `${row}${index + 1}`;

                  const isOccupied =
                    occupiedSeats.includes(
                      seat
                    );

                  const isSelected =
                    selectedSeats.includes(
                      seat
                    );

                  return (

                    <button
                      key={seat}
                      onClick={() =>
                        toggleSeat(seat)
                      }
                      disabled={
                        isOccupied
                      }
                      className={`
                        w-11
                        h-11
                        rounded-xl
                        text-sm
                        font-bold
                        transition-all
                        duration-200
                        border

                        ${
                          isOccupied
                            ? `
                          bg-red-500/80
                          border-red-400
                          cursor-not-allowed
                        `
                            : isSelected
                            ? `
                          bg-purple-500
                          border-purple-300
                          scale-110
                          shadow-[0_0_20px_rgba(168,85,247,0.6)]
                        `
                            : `
                          bg-slate-800
                          border-slate-700
                          hover:bg-slate-700
                          hover:scale-105
                        `
                        }
                      `}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* =====================================================
            BOOKING SUMMARY
        ===================================================== */}
        <div
          className="
            bg-slate-900/70
            border
            border-slate-800
            rounded-3xl
            p-6
            backdrop-blur-md
            mb-8
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-4
            "
          >
            Booking Summary
          </h2>

          <div className="space-y-3 text-slate-300">

            <p>
              <span className="font-semibold">
                Selected Seats:
              </span>{" "}

              {selectedSeats.length > 0
                ? selectedSeats.join(
                    ", "
                  )
                : "None"}
            </p>

            <p>
              <span className="font-semibold">
                Total Seats:
              </span>{" "}
              {seats}
            </p>

            <p
              className="
                text-2xl
                font-bold
                text-green-400
                pt-2
              "
            >
              Total: ₹
              {movie.price * seats}
            </p>
          </div>
        </div>

        {/* =====================================================
            BOOK BUTTON
        ===================================================== */}
        {!showPayPal && (

          <button
            onClick={handleBooking}
            disabled={
              bookingLoading ||
              seats === 0
            }
            className="
              px-10
              py-4
              rounded-2xl
              bg-linear-to-r
              from-red-500
              via-pink-500
              to-purple-500
              hover:scale-105
              transition-all
              duration-300
              text-lg
              font-bold
              shadow-[0_0_30px_rgba(239,68,68,0.35)]
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {bookingLoading
              ? "Booking..."
              : "Proceed To Payment"}
          </button>
        )}

        {/* =====================================================
            PAYPAL PAYMENT
        ===================================================== */}
        {showPayPal && (

          <div
            className="
              mt-10
              max-w-md
              bg-white
              p-5
              rounded-2xl
            "
          >

            <PayPalButtons

              createOrder={(
                _,
                actions
              ) => {

                return actions.order.create({

                  intent: "CAPTURE",

                  purchase_units: [
                    {
                      amount: {
                        currency_code:
                          "USD",

                        value: (
                          movie.price *
                          seats
                        ).toString(),
                      },
                    },
                  ],
                });
              }}

              onApprove={async () => {

                try {

                  await API.put(
                    `/bookings/${bookingId}/pay`
                  );

                  toast.success(
                    "Payment successful!"
                  );

                  navigate(
                    "/bookings"
                  );

                } catch (error) {

                  console.log(error);

                  toast.error(
                    "Payment update failed"
                  );
                }
              }}

              onCancel={() => {

                toast(
                  "Payment cancelled"
                );
              }}

              onError={(err) => {

                console.log(
                  "PayPal Error:",
                  err
                );

                toast.error(
                  "PayPal payment failed"
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;