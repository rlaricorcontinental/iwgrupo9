const sql = require('mssql');

const config = {
  server:   process.env.DB_SERVER   || 'localhost',
  port:     parseInt(process.env.DB_PORT || '1433', 10),
  database: process.env.DB_NAME     || 'IsmaelCargoDB',
  user:     process.env.DB_USER     || 'sa',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt:               (process.env.DB_ENCRYPT    || 'false') === 'true',
    trustServerCertificate:(process.env.DB_TRUST_CERT || 'true')  === 'true',
    enableArithAbort: true
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
};

let poolPromise = null;

function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config).connect()
      .then((pool) => {
        console.log(`[db] Conectado a SQL Server (${config.server}:${config.port}/${config.database})`);
        pool.on('error', (err) => console.error('[db] pool error:', err));
        return pool;
      })
      .catch((err) => {
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

async function closePool() {
  if (poolPromise) {
    const p = await poolPromise;
    await p.close();
    poolPromise = null;
  }
}

module.exports = { sql, getPool, closePool };
