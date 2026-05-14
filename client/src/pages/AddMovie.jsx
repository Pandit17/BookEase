import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import API from "../services/api";

const AddMovie = () => {
  const navigate = useNavigate();

  // Loading state for form submission
  const [loading, setLoading] =
    useState(false);

  // Form state for movie details
  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      image: "",
      genre: "",
      duration: "",
      releaseDate: "",
      price: "",
      availableSeats: "",
    });

  // Update form fields dynamically
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // Submit new movie data to the server
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post(
        "/movies",
        formData
      );

      toast.success(
        "Movie added successfully"
      );

      navigate("/admin");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to add movie"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-10">
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
            mb-3
          "
        >
          Add New Movie
        </h1>

        <p className="text-slate-400">
          Create and publish a new
          movie listing
        </p>
      </div>

      {/* Movie Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-slate-900/70
          border
          border-slate-800
          rounded-3xl
          p-8
          backdrop-blur-md
          space-y-6
        "
      >
        {/* Basic Movie Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            name="title"
            placeholder="Movie Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="
              w-full
              px-5
              py-4
              rounded-2xl
              bg-slate-800
              border
              border-slate-700
              outline-none
              focus:border-pink-500
            "
          />

          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            required
            className="
              w-full
              px-5
              py-4
              rounded-2xl
              bg-slate-800
              border
              border-slate-700
              outline-none
              focus:border-pink-500
            "
          />
        </div>

        {/* Movie Description */}
        <textarea
          name="description"
          placeholder="Movie Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          className="
            w-full
            px-5
            py-4
            rounded-2xl
            bg-slate-800
            border
            border-slate-700
            outline-none
            focus:border-pink-500
            resize-none
          "
        />

        {/* Poster Image URL */}
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          required
          className="
            w-full
            px-5
            py-4
            rounded-2xl
            bg-slate-800
            border
            border-slate-700
            outline-none
            focus:border-pink-500
          "
        />

        {/* Movie Timing Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g. 2h 15m)"
            value={formData.duration}
            onChange={handleChange}
            required
            className="
              w-full
              px-5
              py-4
              rounded-2xl
              bg-slate-800
              border
              border-slate-700
              outline-none
              focus:border-pink-500
            "
          />

          <input
            type="date"
            name="releaseDate"
            value={
              formData.releaseDate
            }
            onChange={handleChange}
            required
            className="
              w-full
              px-5
              py-4
              rounded-2xl
              bg-slate-800
              border
              border-slate-700
              outline-none
              focus:border-pink-500
            "
          />
        </div>

        {/* Pricing and Seat Availability */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="number"
            name="price"
            placeholder="Ticket Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="
              w-full
              px-5
              py-4
              rounded-2xl
              bg-slate-800
              border
              border-slate-700
              outline-none
              focus:border-pink-500
            "
          />

          <input
            type="number"
            name="availableSeats"
            placeholder="Available Seats"
            value={
              formData.availableSeats
            }
            onChange={handleChange}
            required
            className="
              w-full
              px-5
              py-4
              rounded-2xl
              bg-slate-800
              border
              border-slate-700
              outline-none
              focus:border-pink-500
            "
          />
        </div>

        {/* Form Submission Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            py-4
            rounded-2xl
            bg-linear-to-r
            from-red-500
            via-pink-500
            to-purple-500
            font-bold
            text-lg
            hover:scale-[1.01]
            transition-all
            duration-300
            disabled:opacity-50
          "
        >
          {loading
            ? "Adding Movie..."
            : "Add Movie"}
        </button>
      </form>
    </div>
  );
};

export default AddMovie;