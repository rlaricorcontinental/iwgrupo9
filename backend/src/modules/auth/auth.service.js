const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../../config/db');

async function login(usuario, password) {
  const pool = await getPool();
  const r = await pool.request()
    .input('usuario', sql.VarChar(50), usuario)
    .query(`SELECT u.id_usuario, u.usuario, u.password_hash, u.nombre_completo, u.estado, r.nombre AS rol
            FROM dbo.Usuario u
            JOIN dbo.Rol r ON r.id_rol = u.id_rol
            WHERE u.usuario = @usuario`);

  if (!r.recordset.length) {
    const e = new Error('Credenciales incorrectas'); e.status = 401; throw e;
  }
  const u = r.recordset[0];
  if (!u.estado) {
    const e = new Error('Usuario inactivo'); e.status = 403; throw e;
  }

  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) {
    const e = new Error('Credenciales incorrectas'); e.status = 401; throw e;
  }

  const payload = {
    id: u.id_usuario,
    usuario: u.usuario,
    nombre: u.nombre_completo,
    rol: u.rol
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  });

  return { token, usuario: payload };
}

async function getById(id) {
  const pool = await getPool();
  const r = await pool.request()
    .input('id', sql.Int, id)
    .query(`SELECT u.id_usuario, u.usuario, u.nombre_completo, r.nombre AS rol
            FROM dbo.Usuario u JOIN dbo.Rol r ON r.id_rol = u.id_rol
            WHERE u.id_usuario = @id`);
  if (!r.recordset.length) return null;
  const u = r.recordset[0];
  return { id: u.id_usuario, usuario: u.usuario, nombre: u.nombre_completo, rol: u.rol };
}

module.exports = { login, getById };
