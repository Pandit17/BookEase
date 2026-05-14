import {
  Routes,
  Route,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

/* ================= LAYOUT ================= */
import MainLayout from "./layouts/MainLayout";

/* ================= PUBLIC PAGES ================= */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";

/* ================= PROTECTED PAGES ================= */
import Bookings from "./pages/Bookings";

/* ================= ADMIN PAGES ================= */
import AdminDashboard from "./pages/AdminDashboard";
import AddMovie from "./pages/AddMovie";
import EditMovie from "./pages/EditMovie";

/* ================= ROUTE PROTECTION ================= */
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <>
      {/* =========================================================
          GLOBAL TOAST CONFIGURATION
         ========================================================= */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,

          /* ---------- GLOBAL TOAST STYLING ---------- */
          style: {
            background: "#0f172a",
            color: "#ffffff",
            border: "1px solid #334155",
            borderRadius: "18px",
            padding: "14px 18px",
            backdropFilter: "blur(10px)",
          },

          /* ---------- SUCCESS TOAST ---------- */
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },

          /* ---------- ERROR TOAST ---------- */
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      {/* =========================================================
          MAIN APPLICATION LAYOUT
         ========================================================= */}
      <MainLayout>

        <Routes>

          {/* =====================================================
              PUBLIC ROUTES
             ===================================================== */}

          {/* Home Page */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Login Page */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Register Page */}
          <Route
            path="/register"
            element={<Register />}
          />

          {/* Single Movie Details */}
          <Route
            path="/movies/:id"
            element={<MovieDetails />}
          />

          {/* =====================================================
              USER PROTECTED ROUTES
             ===================================================== */}

          {/* User Bookings */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              ADMIN ROUTES
             ===================================================== */}

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Add Movie */}
          <Route
            path="/admin/add-movie"
            element={
              <ProtectedRoute adminOnly={true}>
                <AddMovie />
              </ProtectedRoute>
            }
          />

          {/* Edit Movie */}
          <Route
            path="/admin/edit-movie/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <EditMovie />
              </ProtectedRoute>
            }
          />

        </Routes>
      </MainLayout>
    </>
  );
};

export default App;