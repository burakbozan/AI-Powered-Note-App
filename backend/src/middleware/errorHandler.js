module.exports = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.errors.map((item) => item.message).join(', ') });
  }

  console.error(error);
  res.status(error.status || 500).json({
    error: error.status ? error.message : 'An unexpected error occurred.',
  });
};