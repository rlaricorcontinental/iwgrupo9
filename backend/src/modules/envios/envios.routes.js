const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('./envios.controller');
const { requireAuth } = require('../../middleware/auth');

const router = Router();

router.use(requireAuth);

router.get('/',         ctrl.listar);
router.get('/stats',    ctrl.stats);
router.get('/:codigo',  ctrl.obtener);

router.post('/',
  body('remitente.nombre').isString().trim().notEmpty(),
  body('destinatario.nombre').isString().trim().notEmpty(),
  body('origen').isString().trim().notEmpty(),
  body('destino').isString().trim().notEmpty(),
  body('tipoCarga').isString().trim().notEmpty(),
  body('pesoKg').isFloat({ gt: 0 }).withMessage('peso_kg debe ser > 0'),
  body('descripcion').optional().isString(),
  ctrl.crear
);

module.exports = router;
