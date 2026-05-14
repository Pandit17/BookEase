import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../services/api";

import { useAuth } from "../context/useAuth";

const Login = () => {
  const navigate = useNavigate();

  // Access authentication context methods
  const { setUserInfo } =
    useAuth();

  // Login form state
  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // Submit login credentials
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const { data } =
          await API.post(
            "/auth/login",
            formData
          );

        // Persist authenticated user data
        localStorage.setItem(
          "userInfo",
          JSON.stringify(data)
        );

        // Update global authentication state
        setUserInfo(data);

        toast.success(
          "Login successful!"
        );

        navigate("/");
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Login failed"
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
      {/* Background Glow Effect */}
      <div
        className="
          absolute
          inset-0
          bg-linear-to-br
          from-red-500/10
          to-pink-500/10
          blur-3xl
        "
      />

      {/* Login Card */}
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
        {/* Page Title */}
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
          Welcome Back
        </h1>

        {/* Subtitle */}
        <p
          className="
            text-slate-400
            text-center
            mb-8
          "
        >
          Login to continue your
          movie journey
        </p>

        {/* Authentication Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
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

          {/* Form Submission Button */}
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
            Login
          </button>
        </form>

        {/* Redirect to Registration */}
        <p
          className="
            text-center
            text-slate-400
            mt-8
          "
        >
          Don&apos;t have an account?{" "}
          <span
            onClick={() =>
              navigate(
                "/register"
              )
            }
            className="
              text-pink-400
              cursor-pointer
              hover:text-pink-300
              transition
            "
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;