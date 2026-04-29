const { getPool, sql } = require('../../config/db');
const enviosService = require('../envios/envios.service');

async function consultar(codigo) {
  return enviosService.obtenerPorCodigo(codigo);
}

async function registrarAvance(codigo, { id_estado, observacion }, idUsuario) {
  const pool = await getPool();
  const tx = new sql.Transaction(pool);
  await tx.begin();
  try {
    const r = await new sql.Request(tx)
      .input('codigo', sql.VarChar(20), codigo)
      .query('SELECT id_envio, id_estado_actual FROM dbo.Envio WHERE codigo = @codigo');
    if (!r.recordset.length) {
      await tx.rollback();
      const e = new Error('Envio no encontrado'); e.status = 404; throw e;
    }
    const { id_envio, id_estado_actual } = r.recordset[0];

    const re = await new sql.Request(tx)
      .input('id', sql.Int, id_estado)
      .query('SELECT 1 FROM dbo.EstadoEnvio WHERE id_estado = @id');
    if (!re.recordset.length) {
      await tx.rollback();
      const e = new Error('Estado invalido'); e.status = 400; throw e;
    }

    await new sql.Request(tx)
      .input('id_envio',    sql.Int, id_envio)
      .input('id_estado',   sql.Int, id_estado)
      .input('observacion', sql.VarChar(500), observacion || null)
      .input('id_usuario',  sql.Int, idUsuario)
      .query(`INSERT INTO dbo.Historial_Envio (id_envio, id_estado, observacion, id_usuario)
              VALUES (@id_envio, @id_estado, @observacion, @id_usuario)`);

    if (id_estado !== id_estado_actual) {
      await new sql.Request(tx)
        .input('id_envio',  sql.Int, id_envio)
        .input('id_estado', sql.Int, id_estado)
        .query(`UPDATE dbo.Envio
                SET id_estado_actual = @id_estado, fecha_actualizacion = GETDATE()
                WHERE id_envio = @id_envio`);
    } else {
      await new sql.Request(tx)
        .input('id_envio', sql.Int, id_envio)
        .query(`UPDATE dbo.Envio SET fecha_actualizacion = GETDATE() WHERE id_envio = @id_envio`);
    }

    await tx.commit();
    return enviosService.obtenerPorCodigo(codigo);
  } catch (err) {
    try { await tx.rollback(); } catch { /* ya hecho */ }
    throw err;
  }
}

module.exports = { consultar, registrarAvance };
