import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../services/api";

const EditMovie = () => {
  // Extract movie ID from route parameters
  const { id } = useParams();

  const navigate = useNavigate();

  // Initial page loading state
  const [loading, setLoading] =
    useState(true);

  // Form submission loading state
  const [updateLoading, setUpdateLoading] =
    useState(false);

  // Editable movie form data
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

  // Fetch movie details on component mount
  useEffect(() => {
    const fetchMovie =
      async () => {
        try {
          const { data } =
            await API.get(
              `/movies/${id}`
            );

          setFormData({
            title:
              data.title || "",

            description:
              data.description || "",

            image:
              data.image || "",

            genre:
              data.genre || "",

            duration:
              data.duration || "",

            releaseDate:
              data.releaseDate
                ?.split("T")[0] || "",

            price:
              data.price || "",

            availableSeats:
              data.availableSeats ||
              "",
          });
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

  // Handle input field updates
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // Submit updated movie details
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setUpdateLoading(true);

      await API.put(
        `/movies/${id}`,
        formData
      );

      toast.success(
        "Movie updated successfully"
      );

      navigate("/admin");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Update failed"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  // Render loading state while fetching movie details
  if (loading) {
    return (
      <div className="text-center py-20 text-3xl font-bold">
        Loading movie...
      </div>
    );
  }

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
          Edit Movie
        </h1>

        <p className="text-slate-400">
          Update movie information
        </p>
      </div>

      {/* Movie Update Form */}
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
        {/* Basic Movie Details */}
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

        {/* Movie Poster URL */}
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

        {/* Duration & Release Date */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            name="duration"
            placeholder="Duration"
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

        {/* Pricing & Seat Availability */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="number"
            name="price"
            placeholder="Price"
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
          disabled={updateLoading}
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
          {updateLoading
            ? "Updating..."
            : "Update Movie"}
        </button>
      </form>
    </div>
  );
};

export default EditMovie;