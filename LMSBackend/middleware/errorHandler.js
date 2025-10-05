
module.exports = (err, req, res, next) => {
  if (err) {
    res.status(err.status||400).json({
      error: {
        code: err.code || 'UNKNOWN_ERROR',
        field: err.field || undefined,
        message: err.message || 'An error occurred',
      }
    });
  } else {
    next();
  }
};
