const { validationResult } = require('express-validator');
const service = require('./auth.service');

async function login(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Datos invalidos', details: errors.array() });
  }
  try {
    const { usuario, password } = req.body;
    const result = await service.login(usuario, password);
    res.json(result);
  } catch (e) { next(e); }
}

async function me(req, res, next) {
  try {
    const u = await service.getById(req.user.id);
    if (!u) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(u);
  } catch (e) { next(e); }
}

module.exports = { login, me };
