const { validationResult } = require('express-validator');
const service = require('./envios.service');

async function listar(req, res, next) {
  try {
    const data = await service.listar({ search: req.query.search });
    res.json(data);
  } catch (e) { next(e); }
}

async function obtener(req, res, next) {
  try {
    const e = await service.obtenerPorCodigo(req.params.codigo);
    if (!e) return res.status(404).json({ error: 'Envio no encontrado' });
    res.json(e);
  } catch (err) { next(err); }
}

async function stats(req, res, next) {
  try {
    res.json(await service.stats());
  } catch (e) { next(e); }
}

async function crear(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Datos invalidos', details: errors.array() });
  }
  try {
    const envio = await service.crear(req.body, req.user.id);
    res.status(201).json(envio);
  } catch (e) { next(e); }
}

module.exports = { listar, obtener, stats, crear };
