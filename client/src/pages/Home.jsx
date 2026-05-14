import {
  useEffect,
  useMemo,
  useState,
} from "react";

import API from "../services/api";

import MovieCard from "../components/MovieCard";

const Home = () => {
  // Movie collection state
  const [movies, setMovies] =
    useState([]);

  // Initial page loading state
  const [loading, setLoading] =
    useState(true);

  // Search query state
  const [search, setSearch] =
    useState("");

  // Active genre filter
  const [selectedGenre, setSelectedGenre] =
    useState("All");

  // Fetch all available movies on component mount
  useEffect(() => {
    const fetchMovies =
      async () => {
        try {
          const { data } =
            await API.get(
              "/movies"
            );

          setMovies(data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    fetchMovies();
  }, []);

  // Generate unique genre list dynamically
  const genres = useMemo(() => {
    const uniqueGenres =
      new Set(
        movies.map(
          (movie) =>
            movie.genre
        )
      );

    return [
      "All",
      ...uniqueGenres,
    ];
  }, [movies]);

  // Apply search and genre filters
  const filteredMovies =
    movies.filter((movie) => {
      const matchesSearch =
        movie.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesGenre =
        selectedGenre ===
          "All" ||
        movie.genre ===
          selectedGenre;

      return (
        matchesSearch &&
        matchesGenre
      );
    });

  // Render loading state while movie data is being fetched
  if (loading) {
    return (
      <div className="py-20">
        <h1
          className="
            text-3xl
            text-slate-300
          "
        >
          Loading movies...
        </h1>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section
        className="
          relative
          py-28
          text-center
          overflow-hidden
        "
      >
        {/* Background Glow Effect */}
        <div
          className="
            absolute
            inset-0
            bg-linear-to-r
            from-red-500/10
            via-pink-500/10
            to-purple-500/10
            blur-3xl
          "
        />

        <div className="relative z-10">
          <h1
            className="
              text-6xl
              md:text-7xl
              font-extrabold
              mb-6
              bg-linear-to-r
              from-red-500
              via-pink-500
              to-purple-500
              bg-clip-text
              text-transparent
            "
          >
            Book Movies
            Instantly
          </h1>

          <p
            className="
              text-slate-400
              text-xl
              max-w-3xl
              mx-auto
              leading-relaxed
            "
          >
            Experience the future
            of movie ticket
            booking with seamless
            reservations, premium
            seat selection, and
            secure online payments.
          </p>
        </div>
      </section>

      {/* Search & Genre Filters */}
      <div
        className="
          flex
          flex-col
          lg:flex-row
          gap-5
          items-center
          justify-between
          mb-12
        "
      >
        {/* Movie Search Input */}
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            w-full
            lg:max-w-md
            px-5
            py-4
            rounded-2xl
            bg-slate-900/70
            border
            border-slate-800
            backdrop-blur-md
            outline-none
            focus:border-pink-500
            transition-all
          "
        />

        {/* Genre Selection Buttons */}
        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() =>
                setSelectedGenre(
                  genre
                )
              }
              className={`
                px-5
                py-3
                rounded-2xl
                border
                transition-all
                duration-300
                font-semibold

                ${
                  selectedGenre ===
                  genre
                    ? `
                  bg-linear-to-r
                  from-red-500
                  via-pink-500
                  to-purple-500
                  border-transparent
                  text-white
                  shadow-[0_0_20px_rgba(236,72,153,0.35)]
                `
                    : `
                  bg-slate-900/60
                  border-slate-800
                  hover:border-pink-500/40
                `
                }
              `}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Section Header */}
      <div
        className="
          flex
          items-center
          justify-between
          mb-10
        "
      >
        <h2
          className="
            text-4xl
            font-bold
            text-pink-300
          "
        >
          Trending Movies
        </h2>

        <p className="text-slate-400">
          {filteredMovies.length}{" "}
          movies found
        </p>
      </div>

      {/* Movie Grid / Empty State */}
      {filteredMovies.length ===
      0 ? (
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
            No movies found
          </h2>

          <p className="text-slate-400">
            Try searching with a
            different keyword.
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-8
          "
        >
          {filteredMovies.map(
            (movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Home;