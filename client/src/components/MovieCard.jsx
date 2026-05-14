import { Link } from "react-router-dom";

const MovieCard = ({
  movie,
  loading = false,
}) => {
  /* ================================
     SKELETON LOADER
  ================================= */
  if (loading) {
    return (
      <div
        className="
          bg-slate-900/70
          border
          border-slate-800
          rounded-3xl
          overflow-hidden
          animate-pulse
        "
      >
        {/* Poster Placeholder */}
        <div
          className="
            w-full
            h-72
            bg-slate-800
          "
        />

        {/* Content Placeholder */}
        <div className="p-5 space-y-4">
          <div
            className="
              h-6
              bg-slate-800
              rounded-xl
              w-3/4
            "
          />

          <div className="flex justify-between">
            <div
              className="
                h-4
                bg-slate-800
                rounded-lg
                w-20
              "
            />

            <div
              className="
                h-4
                bg-slate-800
                rounded-lg
                w-16
              "
            />
          </div>

          <div
            className="
              h-5
              bg-slate-800
              rounded-lg
              w-24
            "
          />

          {/* Button Placeholder */}
          <div
            className="
              h-12
              bg-slate-800
              rounded-2xl
            "
          />
        </div>
      </div>
    );
  }

  /* ================================
     MOVIE SOLD OUT CHECK
  ================================= */
  const isSoldOut =
    movie.availableSeats <= 0;

  return (
    <div
      className="
        group
        bg-slate-900/70
        border
        border-slate-800
        rounded-3xl
        overflow-hidden
        backdrop-blur-md
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-pink-500/40
        hover:shadow-[0_0_35px_rgba(236,72,153,0.2)]
        flex
        flex-col
        h-full
      "
    >
      {/* ================================
           MOVIE POSTER
      ================================= */}
      <div className="overflow-hidden relative">

        {/* Sold Out Badge */}
        {isSoldOut && (
          <div
            className="
              absolute
              top-4
              right-4
              z-10
              px-3
              py-1
              rounded-full
              bg-red-500
              text-white
              text-xs
              font-bold
              shadow-lg
            "
          >
            HOUSEFULL
          </div>
        )}

        <img
          src={movie.image}
          alt={movie.title}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/600x900?text=No+Image";
          }}
          className="
            w-full
            h-95
            object-cover
            transition-transform
            duration-500
            group-hover:scale-110
          "
        />
      </div>

      {/* ================================
           MOVIE CONTENT
      ================================= */}
      <div
        className="
          p-5
          flex
          flex-col
          flex-1
        "
      >
        {/* Movie Title */}
        <h2
          className="
            text-2xl
            font-bold
            mb-3
            text-pink-200
            line-clamp-1
          "
        >
          {movie.title}
        </h2>

        {/* Genre + Duration */}
        <div
          className="
            flex
            justify-between
            text-slate-400
            mb-3
            text-sm
          "
        >
          <span>
            🎭 {movie.genre}
          </span>

          <span>
            ⏱ {movie.duration}
          </span>
        </div>

        {/* Available Seats */}
        <div className="mb-4">
          <span
            className={`
              text-sm
              font-semibold

              ${
                isSoldOut
                  ? "text-red-400"
                  : "text-green-400"
              }
            `}
          >
            {isSoldOut
              ? "No seats available"
              : `${movie.availableSeats} seats left`}
          </span>
        </div>

        {/* Ticket Price */}
        <p
          className="
            text-red-400
            text-2xl
            font-bold
            mb-5
          "
        >
          ₹{movie.price}
        </p>

        {/* ================================
             ACTION BUTTON
        ================================= */}
        <div className="mt-auto">
          <Link
            to={`/movies/${movie._id}`}
          >
            <button
              disabled={isSoldOut}
              className={`
                w-full
                py-3
                rounded-2xl
                transition-all
                duration-300
                font-bold

                ${
                  isSoldOut
                    ? `
                      bg-slate-700
                      text-slate-400
                      cursor-not-allowed
                    `
                    : `
                      bg-linear-to-r
                      from-red-500
                      via-pink-500
                      to-purple-500
                      hover:scale-[1.02]
                      shadow-[0_0_20px_rgba(239,68,68,0.25)]
                    `
                }
              `}
            >
              {isSoldOut
                ? "Sold Out"
                : "View Details"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;