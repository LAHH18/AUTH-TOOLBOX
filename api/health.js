app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});
