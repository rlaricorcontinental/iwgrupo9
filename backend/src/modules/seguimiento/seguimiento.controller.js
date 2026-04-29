const { validationResult } = require('express-validator');
const service = require('./seguimiento.service');

async function consultar(req, res, next) {
  try {
    const e = await service.consultar(req.params.codigo);
    if (!e) return res.status(404).json({ error: 'Envio no encontrado' });
    res.json(e);
  } catch (err) { next(err); }
}

async function registrarAvance(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Datos invalidos', details: errors.array() });
  }
  try {
    const envio = await service.registrarAvance(req.params.codigo, req.body, req.user.id);
    res.json(envio);
  } catch (e) { next(e); }
}

module.exports = { consultar, registrarAvance };
