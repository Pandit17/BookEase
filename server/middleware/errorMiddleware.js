 /* =========================================================
   NOT FOUND MIDDLEWARE
   - Handles routes that do not exist
   - Creates a 404 error with requested URL
   - Passes error to global error handler
========================================================= */
export const notFound = (req, res, next) => {
  // Create error with requested route
  const error = new Error(`Not Found - ${req.originalUrl}`);

  // Set HTTP status to 404
  res.status(404);

  // Forward error to error handler middleware
  next(error);
};


/* =========================================================
   GLOBAL ERROR HANDLER
   - Catches all thrown errors in the app
   - Sends structured error response
   - Hides stack trace in production
========================================================= */
export const errorHandler = (err, req, res, next) => {
  // Determine status code (default to 500 if not set properly)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Extract error message
  let message = err.message;

  // Send JSON error response
  res.status(statusCode).json({
    message,

    // Show stack trace only in development mode
    stack:
      process.env.NODE_ENV === "production"
        ? null
        : err.stack,
  });
};