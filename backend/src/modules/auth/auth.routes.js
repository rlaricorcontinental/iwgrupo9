const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('./auth.controller');
const { requireAuth } = require('../../middleware/auth');

const router = Router();

router.post('/login',
  body('usuario').isString().trim().notEmpty().withMessage('Usuario requerido'),
  body('password').isString().notEmpty().withMessage('Contrasena requerida'),
  ctrl.login
);

router.get('/me', requireAuth, ctrl.me);

module.exports = router;
