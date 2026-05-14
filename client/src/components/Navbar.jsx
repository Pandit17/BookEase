import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Film,
  LayoutDashboard,
  LogOut,
  Ticket,
  User,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { userInfo, logout } = useAuth();

  const navigate = useNavigate();

  // Handle user logout and redirect to login page
  const handleLogout = () => {
    logout();

    toast.success("Logged out successfully");

    navigate("/login");
  };

  return (
    <nav
      className="
        fixed
        top-0
        left-0
        w-full
        z-50
        bg-slate-950/70
        backdrop-blur-xl
        border-b
        border-slate-800/80
        shadow-[0_8px_30px_rgba(0,0,0,0.35)]
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-4
          flex
          items-center
          justify-between
          gap-6
        "
      >
        {/* Brand Logo */}
        <Link
          to="/"
          className="
            text-3xl
            font-extrabold
            bg-linear-to-r
            from-red-500
            via-pink-500
            to-purple-500
            text-transparent
            bg-clip-text
            tracking-tight
          "
        >
          BookEase
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/"
            className="
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-xl
              text-slate-300
              hover:text-white
              hover:bg-slate-800
              transition-all
              duration-300
            "
          >
            <Film size={18} />
            Home
          </Link>

          {/* Authenticated User Navigation */}
          {userInfo && (
            <Link
              to="/bookings"
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-xl
                text-slate-300
                hover:text-white
                hover:bg-slate-800
                transition-all
                duration-300
              "
            >
              <Ticket size={18} />
              My Bookings
            </Link>
          )}

          {/* Administrator Dashboard Access */}
          {userInfo?.user?.role === "admin" && (
            <Link
              to="/admin"
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-xl
                text-slate-300
                hover:text-white
                hover:bg-slate-800
                transition-all
                duration-300
              "
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          )}

          {/* User Profile and Authentication Actions */}
          {userInfo ? (
            <div className="flex items-center gap-3 ml-2">
              {/* Logged-in User Information */}
              <div
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  bg-slate-800/70
                  border
                  border-slate-700
                "
              >
                <User size={16} />

                <span className="text-slate-200">
                  {userInfo.name}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  bg-red-500/20
                  border
                  border-red-500/30
                  text-red-400
                  hover:bg-red-500
                  hover:text-white
                  transition-all
                  duration-300
                "
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-2">
              {/* Login Navigation */}
              <Link
                to="/login"
                className="
                  px-4
                  py-2
                  rounded-xl
                  text-slate-300
                  hover:text-white
                  hover:bg-slate-800
                  transition-all
                  duration-300
                "
              >
                Login
              </Link>

              {/* Registration Navigation */}
              <Link
                to="/register"
                className="
                  px-5
                  py-2
                  rounded-xl
                  bg-linear-to-r
                  from-red-500
                  via-pink-500
                  to-purple-500
                  hover:opacity-90
                  transition-all
                  duration-300
                  font-semibold
                "
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;