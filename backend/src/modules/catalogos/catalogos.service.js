const { getPool, sql } = require('../../config/db');

async function listarCiudades() {
  const pool = await getPool();
  const r = await pool.request().query(
    'SELECT id_ciudad AS id, nombre, departamento FROM dbo.Ciudad ORDER BY nombre'
  );
  return r.recordset;
}

async function listarTiposCarga() {
  const pool = await getPool();
  const r = await pool.request().query(
    'SELECT id_tipo_carga AS id, nombre FROM dbo.TipoCarga ORDER BY nombre'
  );
  return r.recordset;
}

async function listarEstados() {
  const pool = await getPool();
  const r = await pool.request().query(
    'SELECT id_estado AS id, nombre, color, icon, orden FROM dbo.EstadoEnvio ORDER BY orden'
  );
  return r.recordset;
}

async function listarClientes(search) {
  const pool = await getPool();
  const req = pool.request();
  let where = '';
  if (search) {
    req.input('q', sql.VarChar(200), `%${search}%`);
    where = 'WHERE nombre LIKE @q OR documento LIKE @q OR telefono LIKE @q';
  }
  const r = await req.query(`SELECT id_cliente AS id, nombre, documento, telefono, tipo
                             FROM dbo.Cliente ${where} ORDER BY nombre`);
  return r.recordset;
}

async function buscarClientePorDocumento(documento) {
  const pool = await getPool();
  const r = await pool.request()
    .input('doc', sql.VarChar(20), documento)
    .query(`SELECT id_cliente AS id, nombre, documento, telefono, tipo
            FROM dbo.Cliente WHERE documento = @doc`);
  return r.recordset[0] || null;
}

module.exports = {
  listarCiudades, listarTiposCarga, listarEstados,
  listarClientes, buscarClientePorDocumento
};
