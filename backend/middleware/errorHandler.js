const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.code === 11000) {
    return res.status(400).json({ message: 'A car with this VIN already exists' });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    message: err.message || 'Server error',
  });
};

module.exports = errorHandler;
