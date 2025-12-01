// In server.js: app.use(require('./middleware/errorHandler'));

// Full file: backend/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('Error:', err.stack); // Log for debugging

  // Handle specific errors (e.g., Mongo validation)
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation failed: ' + Object.values(err.errors).map(e => e.message).join(', ') });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Default: Generic error
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong!' });
};