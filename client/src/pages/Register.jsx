import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

import { useAuth } from "../context/useAuth";

import toast from "react-hot-toast";

const Register = () => {

  /* =========================================================
     ROUTER
  ========================================================= */
  const navigate = useNavigate();

  /* =========================================================
     AUTH CONTEXT
  ========================================================= */
  const { setUserInfo } = useAuth();

  /* =========================================================
     FORM STATE
  ========================================================= */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* =========================================================
     HANDLE INPUT CHANGE
  ========================================================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  /* =========================================================
     FORM SUBMIT (REGISTER USER)
  ========================================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send registration request to backend
      const { data } = await API.post(
        "/auth/register",
        formData
      );

      // Save user in localStorage (persistent login)
      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      // Update global auth state
      setUserInfo(data);

      // Success notification
      toast.success("Registration successful!");

      // Redirect to homepage
      navigate("/");

    } catch (error) {

      // Error handling
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-950
        relative
        overflow-hidden
      "
    >
      {/* =====================================================
          BACKGROUND GLOW EFFECT
      ===================================================== */}
      <div
        className="
          absolute
          inset-0
          bg-linear-to-br
          from-red-500/10
          via-pink-500/10
          to-purple-500/10
          blur-3xl
        "
      />

      {/* =====================================================
          REGISTER CARD
      ===================================================== */}
      <div
        className="
          relative
          w-full
          max-w-md
          bg-slate-900/70
          backdrop-blur-xl
          border
          border-slate-800
          rounded-3xl
          p-8
          shadow-2xl
        "
      >

        {/* Title */}
        <h1
          className="
            text-4xl
            font-extrabold
            text-center
            mb-8
            bg-linear-to-r
            from-red-500
            via-pink-500
            to-purple-500
            bg-clip-text
            text-transparent
          "
        >
          Create Account
        </h1>

        {/* Subtitle */}
        <p
          className="
            text-slate-400
            text-center
            mb-8
          "
        >
          Join BookEase and start booking your favorite movies
        </p>

        {/* =====================================================
            REGISTER FORM
        ===================================================== */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name Input */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              bg-slate-800
              border
              border-slate-700
              text-white
              outline-none
              focus:border-red-500
              transition-all
            "
          />

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              bg-slate-800
              border
              border-slate-700
              text-white
              outline-none
              focus:border-red-500
              transition-all
            "
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              bg-slate-800
              border
              border-slate-700
              text-white
              outline-none
              focus:border-red-500
              transition-all
            "
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-2xl
              bg-linear-to-r
              from-red-500
              via-pink-500
              to-purple-500
              font-bold
              text-white
              hover:scale-[1.02]
              transition-all
              duration-300
              shadow-[0_0_25px_rgba(239,68,68,0.25)]
            "
          >
            Register
          </button>

        </form>

        {/* =====================================================
            LOGIN REDIRECT FOOTER
        ===================================================== */}
        <p
          className="
            text-center
            text-slate-400
            mt-8
          "
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="
              text-pink-400
              cursor-pointer
              hover:text-pink-300
              transition
            "
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;