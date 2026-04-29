const { getPool, sql } = require('../../config/db');

const SELECT_ENVIO_BASE = `
  SELECT
    e.id_envio, e.codigo, e.peso_kg AS pesoKg, e.descripcion,
    e.fecha_registro AS fechaRegistro, e.fecha_actualizacion AS fechaActualizacion,
    e.id_estado_actual AS estadoId,
    co.nombre AS origen, cd.nombre AS destino,
    tc.nombre AS tipoCarga,
    ur.usuario AS usuarioRegistro,
    rem.nombre AS remitente_nombre, rem.documento AS remitente_documento, rem.telefono AS remitente_telefono,
    des.nombre AS destinatario_nombre, des.documento AS destinatario_documento, des.telefono AS destinatario_telefono
  FROM dbo.Envio e
  JOIN dbo.Cliente rem    ON rem.id_cliente = e.id_remitente
  JOIN dbo.Cliente des    ON des.id_cliente = e.id_destinatario
  JOIN dbo.Ciudad  co     ON co.id_ciudad   = e.id_origen
  JOIN dbo.Ciudad  cd     ON cd.id_ciudad   = e.id_destino
  JOIN dbo.TipoCarga tc   ON tc.id_tipo_carga = e.id_tipo_carga
  JOIN dbo.Usuario ur     ON ur.id_usuario  = e.id_usuario_registro
`;

function rowToEnvio(row) {
  return {
    id: row.id_envio,
    codigo: row.codigo,
    remitente:    { nombre: row.remitente_nombre,    documento: row.remitente_documento,    telefono: row.remitente_telefono },
    destinatario: { nombre: row.destinatario_nombre, documento: row.destinatario_documento, telefono: row.destinatario_telefono },
    origen: row.origen,
    destino: row.destino,
    tipoCarga: row.tipoCarga,
    pesoKg: Number(row.pesoKg),
    descripcion: row.descripcion || '',
    estadoId: row.estadoId,
    fechaRegistro: formatDate(row.fechaRegistro),
    fechaActualizacion: formatDate(row.fechaActualizacion),
    usuarioRegistro: row.usuarioRegistro
  };
}

async function listarHistorial(pool, idEnvio) {
  const r = await pool.request()
    .input('id', sql.Int, idEnvio)
    .query(`SELECT h.id_estado AS estadoId, h.observacion, h.fecha, u.usuario
            FROM dbo.Historial_Envio h
            JOIN dbo.Usuario u ON u.id_usuario = h.id_usuario
            WHERE h.id_envio = @id
            ORDER BY h.fecha ASC, h.id_historial ASC`);
  return r.recordset.map((h) => ({
    estadoId: h.estadoId,
    fecha: formatDate(h.fecha),
    usuario: h.usuario,
    observacion: h.observacion || ''
  }));
}

function formatDate(d) {
  if (!d) return null;
  const date = new Date(d);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

async function listar({ search } = {}) {
  const pool = await getPool();
  const req = pool.request();
  let where = '';
  if (search) {
    req.input('q', sql.VarChar(200), `%${search}%`);
    where = `WHERE e.codigo LIKE @q OR co.nombre LIKE @q OR cd.nombre LIKE @q
             OR rem.nombre LIKE @q OR des.nombre LIKE @q OR tc.nombre LIKE @q`;
  }
  const r = await req.query(`${SELECT_ENVIO_BASE} ${where} ORDER BY e.fecha_actualizacion DESC`);
  return r.recordset.map(rowToEnvio);
}

async function obtenerPorCodigo(codigo) {
  const pool = await getPool();
  const r = await pool.request()
    .input('codigo', sql.VarChar(20), codigo)
    .query(`${SELECT_ENVIO_BASE} WHERE e.codigo = @codigo`);
  if (!r.recordset.length) return null;
  const envio = rowToEnvio(r.recordset[0]);
  envio.historial = await listarHistorial(pool, envio.id);
  return envio;
}

async function stats() {
  const pool = await getPool();
  const r = await pool.request().query(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN id_estado_actual = 1 THEN 1 ELSE 0 END) AS pendientes,
      SUM(CASE WHEN id_estado_actual = 2 THEN 1 ELSE 0 END) AS enTransito,
      SUM(CASE WHEN id_estado_actual = 3 THEN 1 ELSE 0 END) AS enReparto,
      SUM(CASE WHEN id_estado_actual = 4 THEN 1 ELSE 0 END) AS entregados
    FROM dbo.Envio`);
  const row = r.recordset[0] || {};
  return {
    total: row.total || 0,
    pendientes: row.pendientes || 0,
    enTransito: row.enTransito || 0,
    enReparto: row.enReparto || 0,
    entregados: row.entregados || 0
  };
}

async function crear(data, idUsuario) {
  const pool = await getPool();
  const tx = new sql.Transaction(pool);
  await tx.begin();
  try {
    const idRem  = await ensureCliente(tx, data.remitente,    'remitente');
    const idDest = await ensureCliente(tx, data.destinatario, 'destinatario');
    const idOri  = await idCiudad(tx, data.origen);
    const idDes  = await idCiudad(tx, data.destino);
    const idTC   = await idTipoCarga(tx, data.tipoCarga);

    const codigo = await generarCodigo(tx);

    const ins = await new sql.Request(tx)
      .input('codigo',         sql.VarChar(20), codigo)
      .input('id_remitente',   sql.Int, idRem)
      .input('id_destinatario',sql.Int, idDest)
      .input('id_origen',      sql.Int, idOri)
      .input('id_destino',     sql.Int, idDes)
      .input('id_tipo_carga',  sql.Int, idTC)
      .input('peso_kg',        sql.Decimal(10,2), data.pesoKg)
      .input('descripcion',    sql.VarChar(500), data.descripcion || null)
      .input('id_usuario',     sql.Int, idUsuario)
      .query(`INSERT INTO dbo.Envio
              (codigo, id_remitente, id_destinatario, id_origen, id_destino,
               id_tipo_carga, peso_kg, descripcion, id_estado_actual, id_usuario_registro)
              OUTPUT INSERTED.id_envio
              VALUES (@codigo, @id_remitente, @id_destinatario, @id_origen, @id_destino,
                      @id_tipo_carga, @peso_kg, @descripcion, 1, @id_usuario)`);
    const idEnvio = ins.recordset[0].id_envio;

    await new sql.Request(tx)
      .input('id_envio',   sql.Int, idEnvio)
      .input('id_estado',  sql.Int, 1)
      .input('observacion',sql.VarChar(500), 'Envio registrado')
      .input('id_usuario', sql.Int, idUsuario)
      .query(`INSERT INTO dbo.Historial_Envio (id_envio, id_estado, observacion, id_usuario)
              VALUES (@id_envio, @id_estado, @observacion, @id_usuario)`);

    await tx.commit();
    return obtenerPorCodigo(codigo);
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}

async function ensureCliente(tx, c, tipoDefault) {
  if (c.documento) {
    const r = await new sql.Request(tx)
      .input('doc', sql.VarChar(20), c.documento)
      .query('SELECT id_cliente FROM dbo.Cliente WHERE documento = @doc');
    if (r.recordset.length) return r.recordset[0].id_cliente;
  }
  const r = await new sql.Request(tx)
    .input('nombre',    sql.VarChar(150), c.nombre)
    .input('documento', sql.VarChar(20),  c.documento || null)
    .input('telefono',  sql.VarChar(20),  c.telefono || null)
    .input('tipo',      sql.VarChar(20),  tipoDefault || 'ambos')
    .query(`INSERT INTO dbo.Cliente (nombre, documento, telefono, tipo)
            OUTPUT INSERTED.id_cliente
            VALUES (@nombre, @documento, @telefono, @tipo)`);
  return r.recordset[0].id_cliente;
}

async function idCiudad(tx, nombre) {
  const r = await new sql.Request(tx)
    .input('n', sql.VarChar(100), nombre)
    .query('SELECT id_ciudad FROM dbo.Ciudad WHERE nombre = @n');
  if (!r.recordset.length) {
    const e = new Error(`Ciudad no encontrada: ${nombre}`); e.status = 400; throw e;
  }
  return r.recordset[0].id_ciudad;
}

async function idTipoCarga(tx, nombre) {
  const r = await new sql.Request(tx)
    .input('n', sql.VarChar(100), nombre)
    .query('SELECT id_tipo_carga FROM dbo.TipoCarga WHERE nombre = @n');
  if (!r.recordset.length) {
    const e = new Error(`Tipo de carga no encontrado: ${nombre}`); e.status = 400; throw e;
  }
  return r.recordset[0].id_tipo_carga;
}

// Genera ICS-AAAA-NNNNNN dentro de la transacción para evitar colisiones.
async function generarCodigo(tx) {
  const anio = new Date().getFullYear();
  const prefijo = `ICS-${anio}-`;
  const r = await new sql.Request(tx)
    .input('p', sql.VarChar(20), `${prefijo}%`)
    .query(`SELECT TOP 1 codigo FROM dbo.Envio WITH (UPDLOCK, HOLDLOCK)
            WHERE codigo LIKE @p ORDER BY codigo DESC`);
  let next = 1;
  if (r.recordset.length) {
    const last = r.recordset[0].codigo;
    next = parseInt(last.split('-')[2], 10) + 1;
  }
  return `${prefijo}${String(next).padStart(6, '0')}`;
}

module.exports = { listar, obtenerPorCodigo, stats, crear };
