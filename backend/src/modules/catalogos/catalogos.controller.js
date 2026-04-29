const service = require('./catalogos.service');

async function ciudades(req, res, next)    { try { res.json(await service.listarCiudades()); }   catch (e) { next(e); } }
async function tiposCarga(req, res, next)  { try { res.json(await service.listarTiposCarga()); } catch (e) { next(e); } }
async function estados(req, res, next)     { try { res.json(await service.listarEstados()); }    catch (e) { next(e); } }

async function clientes(req, res, next) {
  try { res.json(await service.listarClientes(req.query.search)); } catch (e) { next(e); }
}

async function clientePorDoc(req, res, next) {
  try {
    const c = await service.buscarClientePorDocumento(req.params.documento);
    if (!c) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(c);
  } catch (e) { next(e); }
}

module.exports = { ciudades, tiposCarga, estados, clientes, clientePorDoc };
