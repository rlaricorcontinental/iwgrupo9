const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('./seguimiento.controller');
const { requireAuth } = require('../../middleware/auth');

const router = Router();

// Consulta pública por código (sin token).
router.get('/:codigo', ctrl.consultar);

// Registrar avance (protegido).
router.post('/:codigo/avance',
  requireAuth,
  body('id_estado').isInt({ min: 1, max: 4 }),
  body('observacion').optional().isString(),
  ctrl.registrarAvance
);

module.exports = router;
