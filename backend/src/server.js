require('dotenv').config();
const app = require('./app');
const { getPool, closePool } = require('./config/db');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await getPool();
  } catch (err) {
    console.error('[startup] No se pudo conectar a SQL Server:', err.message);
    console.error('Revisa las variables DB_* en backend\\.env y que SQL Server este corriendo.');
  }

  const server = app.listen(PORT, () => {
    console.log(`[server] API escuchando en http://localhost:${PORT}/api`);
    console.log(`[server] Healthcheck: http://localhost:${PORT}/api/health`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[server] Recibido ${signal}, cerrando...`);
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  };
  process.on('SIGINT',  () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
})();
