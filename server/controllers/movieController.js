import Movie from "../models/Movie.js";


// CREATE MOVIE
export const createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      genre,
      duration,
      releaseDate,
      price,
      availableSeats,
    } = req.body;

    const movie = await Movie.create({
      title,
      description,
      image,
      genre,
      duration,
      releaseDate,
      price,
      availableSeats,
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ALL MOVIES
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET SINGLE MOVIE
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE MOVIE
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
      }
    );

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE MOVIE
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    await movie.deleteOne();

    res.status(200).json({
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};