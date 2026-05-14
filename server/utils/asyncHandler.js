 /* =========================================================
   ASYNC HANDLER MIDDLEWARE
   - Wraps async route handlers
   - Automatically catches errors
   - Forwards errors to Express error middleware
========================================================= */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    // Convert promise errors into Express error flow
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;