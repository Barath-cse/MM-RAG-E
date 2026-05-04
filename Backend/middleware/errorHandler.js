const errorHandler = (err, req, res, next) => {
  // multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'File too large. Maximum upload size is 25MB.'
    });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Unexpected file field in request.'
    });
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error ${status}] ${req.method} ${req.path} — ${message}`);
  if (status === 500) console.error(err.stack);

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
