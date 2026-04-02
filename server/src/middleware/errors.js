function handleErrors(err, req, res, next) {
  console.error('[error]', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'file too big (max 5mb)' });
  }

  if (err.name === 'ValidationError') {
    const msgs = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: msgs.join(', ') });
  }

  if (err.code === 11000) {
    return res.status(400).json({ error: 'duplicate entry' });
  }

  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'something went wrong' });
}

module.exports = { handleErrors };