import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  BarChart3,
  Film,
  IndianRupee,
  Ticket,
  Users,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import API from "../services/api";

const AdminDashboard = () => {
  /* =========================
     DASHBOARD STATE
  ========================= */

  // Stores overall platform statistics
  const [stats, setStats] =
    useState({
      totalMovies: 0,
      totalBookings: 0,
      totalUsers: 0,
      totalRevenue: 0,
    });

  // Stores all movies
  const [movies, setMovies] =
    useState([]);

  // Stores latest bookings
  const [recentBookings, setRecentBookings] =
    useState([]);

  // Dashboard loading state
  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH DASHBOARD DATA
  ========================= */

  // Fetch movies, bookings and users together
  const loadDashboard =
    async () => {
      try {
        // Start loading
        setLoading(true);

        // Fetch all dashboard APIs simultaneously
        const [
          moviesRes,
          bookingsRes,
          usersRes,
        ] = await Promise.all([
          API.get("/movies"),

          API.get(
            "/bookings/all"
          ),

          API.get("/users"),
        ]);

        // Safe fallback arrays
        const moviesData =
          moviesRes.data || [];

        const bookings =
          bookingsRes.data || [];

        const users =
          usersRes.data || [];

        /* =========================
           CALCULATE REVENUE
        ========================= */

        // Sum only paid bookings
        const revenue =
          bookings
            .filter(
              (booking) =>
                booking.paymentStatus ===
                "paid"
            )
            .reduce(
              (acc, booking) =>
                acc +
                booking.totalPrice,
              0
            );

        /* =========================
           UPDATE STATE
        ========================= */

        // Store movies
        setMovies(moviesData);

        // Store latest bookings
        setRecentBookings(
          bookings.slice(0, 5)
        );

        // Store dashboard statistics
        setStats({
          totalMovies:
            moviesData.length,

          totalBookings:
            bookings.length,

          totalUsers:
            users.length,

          totalRevenue:
            revenue,
        });
      } catch (error) {
        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to load dashboard"
        );
      } finally {
        // Stop loading
        setLoading(false);
      }
    };

  /* =========================
     INITIAL DATA FETCH
  ========================= */

  useEffect(() => {
    // Separate async function
    // avoids React warning
    const fetchDashboard =
      async () => {
        await loadDashboard();
      };

    fetchDashboard();
  }, []);

  /* =========================
     DELETE MOVIE
  ========================= */

  // Delete selected movie
  const deleteMovieHandler =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Delete this movie?"
        );

      // Stop if user cancels
      if (!confirmDelete) {
        return;
      }

      try {
        await API.delete(
          `/movies/${id}`
        );

        toast.success(
          "Movie deleted successfully"
        );

        // Refresh dashboard
        await loadDashboard();
      } catch (error) {
        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to delete movie"
        );
      }
    };

  /* =========================
     CANCEL BOOKING
  ========================= */

  // Cancel booking instantly
  const cancelBookingHandler =
    async (id) => {
      const confirmCancel =
        window.confirm(
          "Cancel this booking?"
        );

      // Stop if user cancels
      if (!confirmCancel) {
        return;
      }

      try {
        await API.put(
          `/bookings/${id}/cancel`
        );

        toast.success(
          "Booking cancelled"
        );

        // Refresh dashboard
        await loadDashboard();
      } catch (error) {
        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to cancel booking"
        );
      }
    };

  /* =========================
     DASHBOARD CARDS
  ========================= */

  // Dashboard statistics cards
  const cards = [
    {
      title: "Total Movies",
      value: stats.totalMovies,
      icon: Film,
      gradient:
        "from-red-500 to-pink-500",
    },

    {
      title: "Bookings",
      value: stats.totalBookings,
      icon: Ticket,
      gradient:
        "from-purple-500 to-indigo-500",
    },

    {
      title: "Users",
      value: stats.totalUsers,
      icon: Users,
      gradient:
        "from-cyan-500 to-blue-500",
    },

    {
      title: "Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: IndianRupee,
      gradient:
        "from-green-500 to-emerald-500",
    },
  ];

  /* =========================
     LOADING SCREEN
  ========================= */

  // Show loading screen
  // while dashboard loads
  if (loading) {
    return (
      <div className="text-center py-20">
        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* =========================
          DASHBOARD HEADER
      ========================= */}

      <div
        className="
          flex
          items-center
          justify-between
          flex-wrap
          gap-4
        "
      >
        <div>
          <h1
            className="
              text-5xl
              font-extrabold
              bg-linear-to-r
              from-red-400
              via-pink-400
              to-purple-400
              bg-clip-text
              text-transparent
            "
          >
            Admin Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Monitor movies,
            bookings, users &
            revenue
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <Link
            to="/admin/add-movie"
          >
            <button
              className="
                flex
                items-center
                gap-2
                px-6
                py-3
                rounded-2xl
                bg-linear-to-r
                from-red-500
                to-pink-500
                hover:scale-105
                transition-all
                duration-300
                font-semibold
              "
            >
              <Plus size={20} />
              Add Movie
            </button>
          </Link>

          {/* Analytics Badge */}
          <div
            className="
              flex
              items-center
              gap-3
              px-5
              py-3
              rounded-2xl
              bg-slate-900/70
              border
              border-slate-800
            "
          >
            <BarChart3 className="text-purple-400" />

            <span className="font-semibold">
              Analytics Overview
            </span>
          </div>
        </div>
      </div>

      {/* =========================
          DASHBOARD STATISTICS
      ========================= */}

      <div
        className="
          grid
          sm:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-800
                bg-slate-900/70
                p-6
                backdrop-blur-md
                hover:scale-[1.02]
                transition-all
                duration-300
                hover:border-purple-500/30
              "
            >
              {/* Gradient Glow */}
              <div
                className={`
                  absolute
                  inset-0
                  opacity-10
                  bg-linear-to-br
                  ${card.gradient}
                `}
              />

              <div
                className="
                  relative
                  flex
                  items-start
                  justify-between
                "
              >
                <div>
                  <p className="text-slate-400 text-sm mb-2">
                    {card.title}
                  </p>

                  <h2
                    className="
                      text-4xl
                      font-extrabold
                    "
                  >
                    {card.value}
                  </h2>
                </div>

                {/* Card Icon */}
                <div
                  className={`
                    p-4
                    rounded-2xl
                    bg-linear-to-br
                    ${card.gradient}
                  `}
                >
                  <Icon size={28} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================
          MOVIE MANAGEMENT
      ========================= */}

      <div
        className="
          bg-slate-900/70
          border
          border-slate-800
          rounded-3xl
          p-8
          backdrop-blur-md
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            mb-8
            flex-wrap
            gap-4
          "
        >
          <h2
            className="
              text-3xl
              font-bold
            "
          >
            Manage Movies
          </h2>

          <span className="text-slate-400">
            {movies.length} Movies
          </span>
        </div>

        {/* Movies List */}
        <div className="space-y-5">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="
                flex
                flex-col
                lg:flex-row
                lg:items-center
                justify-between
                gap-5
                p-5
                rounded-2xl
                bg-slate-800/50
                border
                border-slate-700
              "
            >
              {/* Movie Details */}
              <div
                className="
                  flex
                  items-center
                  gap-5
                "
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="
                    w-24
                    h-32
                    object-cover
                    rounded-2xl
                  "
                />

                <div>
                  <h3
                    className="
                      text-2xl
                      font-bold
                      mb-2
                    "
                  >
                    {movie.title}
                  </h3>

                  <div
                    className="
                      flex
                      flex-wrap
                      gap-4
                      text-slate-400
                      text-sm
                    "
                  >
                    <span>
                      🎭 {movie.genre}
                    </span>

                    <span>
                      ⏱ {movie.duration}
                    </span>

                    <span>
                      💺{" "}
                      {
                        movie.availableSeats
                      }{" "}
                      Seats
                    </span>
                  </div>

                  <p
                    className="
                      text-green-400
                      font-bold
                      text-xl
                      mt-3
                    "
                  >
                    ₹{movie.price}
                  </p>
                </div>
              </div>

              {/* Movie Action Buttons */}
              <div className="flex gap-4">
                <Link
                  to={`/admin/edit-movie/${movie._id}`}
                >
                  <button
                    className="
                      flex
                      items-center
                      gap-2
                      px-5
                      py-3
                      rounded-2xl
                      bg-purple-500/20
                      border
                      border-purple-500/30
                      text-purple-400
                      hover:bg-purple-500
                      hover:text-white
                      transition-all
                      duration-300
                      font-semibold
                    "
                  >
                    <Pencil size={18} />
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() =>
                    deleteMovieHandler(
                      movie._id
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-3
                    rounded-2xl
                    bg-red-500/20
                    border
                    border-red-500/30
                    text-red-400
                    hover:bg-red-500
                    hover:text-white
                    transition-all
                    duration-300
                    font-semibold
                  "
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          REVENUE + BOOKINGS
      ========================= */}

      <div
        className="
          grid
          lg:grid-cols-2
          gap-8
        "
      >
        {/* Revenue Overview */}
        <div
          className="
            bg-slate-900/70
            border
            border-slate-800
            rounded-3xl
            p-8
            backdrop-blur-md
          "
        >
          <h2
            className="
              text-2xl
              font-bold
              mb-8
            "
          >
            Revenue Overview
          </h2>

          {/* Revenue Graph */}
          <div
            className="
              h-72
              flex
              items-end
              justify-around
              gap-4
            "
          >
            {[40, 65, 80, 55, 95, 75].map(
              (height, index) => (
                <div
                  key={index}
                  className="
                    flex
                    flex-col
                    items-center
                    gap-3
                    flex-1
                  "
                >
                  <div
                    style={{
                      height: `${height}%`,
                    }}
                    className="
                      w-full
                      rounded-t-2xl
                      bg-linear-to-t
                      from-purple-600
                      via-pink-500
                      to-red-400
                    "
                  />

                  <span className="text-slate-400 text-sm">
                    {
                      [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                      ][index]
                    }
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div
          className="
            bg-slate-900/70
            border
            border-slate-800
            rounded-3xl
            p-8
            backdrop-blur-md
          "
        >
          <h2
            className="
              text-2xl
              font-bold
              mb-8
            "
          >
            Recent Bookings
          </h2>

          <div className="space-y-5">
            {recentBookings.length ===
            0 ? (
              <p className="text-slate-400">
                No recent bookings
              </p>
            ) : (
              recentBookings.map(
                (booking) => (
                  <div
                    key={
                      booking._id
                    }
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      p-4
                      rounded-2xl
                      bg-slate-800/50
                    "
                  >
                    {/* Booking Details */}
                    <div>
                      <h3 className="font-semibold">
                        {
                          booking
                            .movie
                            ?.title
                        }
                      </h3>

                      <p className="text-sm text-slate-400">
                        {
                          booking
                            .user
                            ?.name
                        }
                      </p>
                    </div>

                    {/* Booking Status */}
                    <div className="text-right">
                      <p
                        className="
                          font-bold
                          text-green-400
                        "
                      >
                        ₹
                        {
                          booking.totalPrice
                        }
                      </p>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          booking.bookingStatus === "cancelled"
                            ? "bg-red-500/20 text-red-400"
                            : booking.paymentStatus === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {booking.bookingStatus === "cancelled"
                          ? "cancelled"
                          : booking.paymentStatus}
                      </span>

                      {/* Cancel Booking Button */}
                      {booking.bookingStatus !== "cancelled" && (
                        <button
                          onClick={() =>
                            cancelBookingHandler(
                              booking._id
                            )
                          }
                          className="
                            mt-2
                            px-3
                            py-1
                            text-xs
                            rounded-lg
                            bg-red-500/20
                            border
                            border-red-500/30
                            text-red-400
                            hover:bg-red-500
                            hover:text-white
                            transition-all
                            duration-300
                            block
                            ml-auto
                          "
                        >
                          Immediate Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>

      {/* =========================
          FOOTER BANNER
      ========================= */}

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          p-8
          bg-linear-to-r
          from-purple-600
          via-pink-500
          to-red-500
          shadow-[0_0_40px_rgba(168,85,247,0.25)]
        "
      >
        <div className="relative z-10">
          <h2
            className="
              text-3xl
              font-extrabold
              mb-3
            "
          >
            BookEase Analytics
          </h2>

          <p className="text-lg text-white/80">
            Track your platform
            growth, bookings, and
            revenue in real-time.
          </p>
        </div>

        {/* Decorative Glow Circle */}
        <div
          className="
            absolute
            -right-10
            -top-10
            w-52
            h-52
            rounded-full
            bg-white/10
          "
        />

        {/* Decorative Glow Circle */}
        <div
          className="
            absolute
            -bottom-16
            right-20
            w-40
            h-40
            rounded-full
            bg-white/10
          "
        />
      </div>
    </div>
  );
};

export default AdminDashboard;