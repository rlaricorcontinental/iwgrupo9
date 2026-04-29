
function errorHandler(err, req, res, next) {
  console.error('[error]', req.method, req.originalUrl, '-', err.message);
  if (err.status) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
}

function notFound(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
