const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes         = require('./modules/auth/auth.routes');
const enviosRoutes       = require('./modules/envios/envios.routes');
const seguimientoRoutes  = require('./modules/seguimiento/seguimiento.routes');
const { catalogos, clientes } = require('./modules/catalogos/catalogos.routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { getPool } = require('./config/db');

const app = express();

app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:9000').split(','),
  credentials: false
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().query('SELECT 1 AS ok');
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    res.status(500).json({ ok: false, db: 'error', error: err.message });
  }
});

app.use('/api/auth',         authRoutes);
app.use('/api/envios',       enviosRoutes);
app.use('/api/seguimiento',  seguimientoRoutes);
app.use('/api/catalogos',    catalogos);
app.use('/api/clientes',     clientes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
