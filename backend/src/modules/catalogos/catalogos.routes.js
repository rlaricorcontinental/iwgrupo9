const { Router } = require('express');
const ctrl = require('./catalogos.controller');
const { requireAuth } = require('../../middleware/auth');

const catalogos = Router();
catalogos.get('/ciudades',    ctrl.ciudades);
catalogos.get('/tipos-carga', ctrl.tiposCarga);
catalogos.get('/estados',     ctrl.estados);

const clientes = Router();
clientes.use(requireAuth);
clientes.get('/',             ctrl.clientes);
clientes.get('/:documento',   ctrl.clientePorDoc);

module.exports = { catalogos, clientes };
