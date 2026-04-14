// Datos de prueba

import { reactive } from 'vue';

export const ESTADOS = [
  { id: 1, nombre: 'Pendiente',   color: 'grey',    icon: 'schedule',        orden: 1 },
  { id: 2, nombre: 'En transito', color: 'info',    icon: 'local_shipping',  orden: 2 },
  { id: 3, nombre: 'En reparto',  color: 'warning', icon: 'delivery_dining', orden: 3 },
  { id: 4, nombre: 'Entregado',   color: 'positive',icon: 'check_circle',    orden: 4 }
];

export const TIPOS_CARGA = [
  { id: 1, nombre: 'Carga general' },
  { id: 2, nombre: 'Carga fragil' },
  { id: 3, nombre: 'Carga refrigerada' },
  { id: 4, nombre: 'Carga peligrosa' },
  { id: 5, nombre: 'Documentos' }
];

export const CIUDADES = [
  { id: 1, nombre: 'Lima',       departamento: 'Lima' },
  { id: 2, nombre: 'Arequipa',   departamento: 'Arequipa' },
  { id: 3, nombre: 'Cusco',      departamento: 'Cusco' },
  { id: 4, nombre: 'Huancayo',   departamento: 'Junin' },
  { id: 5, nombre: 'Trujillo',   departamento: 'La Libertad' },
  { id: 6, nombre: 'Chiclayo',   departamento: 'Lambayeque' },
  { id: 7, nombre: 'Piura',      departamento: 'Piura' },
  { id: 8, nombre: 'Puno',       departamento: 'Puno' },
  { id: 9, nombre: 'Ica',        departamento: 'Ica' },
  { id: 10,nombre: 'Ayacucho',   departamento: 'Ayacucho' }
];


export const envios = reactive([
  {
    id: 1,
    codigo: 'ICS-2026-000001',
    remitente: { nombre: 'Comercial Andina S.A.C.', documento: '20512345678', telefono: '987654321' },
    destinatario: { nombre: 'Maria Lopez Quispe',   documento: '45678912',     telefono: '956112233' },
    origen: 'Lima',
    destino: 'Arequipa',
    tipoCarga: 'Carga general',
    pesoKg: 125.50,
    descripcion: 'Repuestos automotrices - 3 cajas',
    estadoId: 4,
    fechaRegistro: '2026-04-05 08:15',
    fechaActualizacion: '2026-04-09 17:40',
    usuarioRegistro: 'admin',
    historial: [
      { estadoId: 1, fecha: '2026-04-05 08:15', usuario: 'admin',    observacion: 'Envio registrado en oficina Lima' },
      { estadoId: 2, fecha: '2026-04-06 05:30', usuario: 'admin',    observacion: 'Salida desde terminal Lima' },
      { estadoId: 3, fecha: '2026-04-09 09:10', usuario: 'operador', observacion: 'En reparto por Arequipa centro' },
      { estadoId: 4, fecha: '2026-04-09 17:40', usuario: 'operador', observacion: 'Entregado al destinatario' }
    ]
  },
  {
    id: 2,
    codigo: 'ICS-2026-000002',
    remitente: { nombre: 'Distribuidora El Sol',   documento: '20587456123', telefono: '998877665' },
    destinatario: { nombre: 'Carlos Mamani Ruiz',  documento: '78451236',    telefono: '965412378' },
    origen: 'Lima',
    destino: 'Cusco',
    tipoCarga: 'Carga fragil',
    pesoKg: 48.00,
    descripcion: 'Equipos de computo - 2 bultos',
    estadoId: 2,
    fechaRegistro: '2026-04-11 10:00',
    fechaActualizacion: '2026-04-12 22:05',
    usuarioRegistro: 'admin',
    historial: [
      { estadoId: 1, fecha: '2026-04-11 10:00', usuario: 'admin', observacion: 'Envio registrado' },
      { estadoId: 2, fecha: '2026-04-12 22:05', usuario: 'admin', observacion: 'En ruta Lima - Cusco' }
    ]
  },
  {
    id: 3,
    codigo: 'ICS-2026-000003',
    remitente: { nombre: 'Agroindustria Norte',    documento: '20654789321', telefono: '945612378' },
    destinatario: { nombre: 'Supermercados Plaza', documento: '20125478963', telefono: '014567890' },
    origen: 'Trujillo',
    destino: 'Lima',
    tipoCarga: 'Carga refrigerada',
    pesoKg: 850.75,
    descripcion: 'Productos lacteos - pallet completo',
    estadoId: 3,
    fechaRegistro: '2026-04-12 07:45',
    fechaActualizacion: '2026-04-13 06:20',
    usuarioRegistro: 'operador',
    historial: [
      { estadoId: 1, fecha: '2026-04-12 07:45', usuario: 'operador', observacion: 'Envio registrado - Trujillo' },
      { estadoId: 2, fecha: '2026-04-12 15:30', usuario: 'operador', observacion: 'En camino a Lima' },
      { estadoId: 3, fecha: '2026-04-13 06:20', usuario: 'admin',    observacion: 'En reparto Lima Norte' }
    ]
  },
  {
    id: 4,
    codigo: 'ICS-2026-000004',
    remitente: { nombre: 'Libreria Continental', documento: '20778899001', telefono: '012345678' },
    destinatario: { nombre: 'Universidad del Sur', documento: '20987654321', telefono: '054223344' },
    origen: 'Lima',
    destino: 'Puno',
    tipoCarga: 'Documentos',
    pesoKg: 12.30,
    descripcion: 'Material bibliografico - 4 cajas',
    estadoId: 1,
    fechaRegistro: '2026-04-13 09:30',
    fechaActualizacion: '2026-04-13 09:30',
    usuarioRegistro: 'admin',
    historial: [
      { estadoId: 1, fecha: '2026-04-13 09:30', usuario: 'admin', observacion: 'Envio recien registrado' }
    ]
  }
]);

let correlativo = envios.length;

export function generarCodigoSeguimiento() {
  correlativo += 1;
  const anio = new Date().getFullYear();
  return `ICS-${anio}-${String(correlativo).padStart(6, '0')}`;
}

export function buscarPorCodigo(codigo) {
  if (!codigo) return null;
  const q = codigo.trim().toUpperCase();
  return envios.find((e) => e.codigo.toUpperCase() === q) || null;
}

export function estadoPorId(id) {
  return ESTADOS.find((e) => e.id === id);
}

export function agregarEnvio(data) {
  const codigo = generarCodigoSeguimiento();
  const ahora = formatearFecha(new Date());
  const nuevo = {
    id: envios.length + 1,
    codigo,
    remitente:    { nombre: data.remitenteNombre,    documento: data.remitenteDoc,    telefono: data.remitenteTel },
    destinatario: { nombre: data.destinatarioNombre, documento: data.destinatarioDoc, telefono: data.destinatarioTel },
    origen:       data.origen,
    destino:      data.destino,
    tipoCarga:    data.tipoCarga,
    pesoKg:       Number(data.pesoKg),
    descripcion:  data.descripcion || '',
    estadoId:     1,
    fechaRegistro: ahora,
    fechaActualizacion: ahora,
    usuarioRegistro: data.usuario || 'admin',
    historial: [
      { estadoId: 1, fecha: ahora, usuario: data.usuario || 'admin', observacion: 'Envio registrado' }
    ]
  };
  envios.unshift(nuevo);
  return nuevo;
}

export function actualizarEstado(codigo, nuevoEstadoId, observacion, usuario) {
  const envio = buscarPorCodigo(codigo);
  if (!envio) return null;
  const ahora = formatearFecha(new Date());
  envio.estadoId = nuevoEstadoId;
  envio.fechaActualizacion = ahora;
  envio.historial.push({
    estadoId: nuevoEstadoId,
    fecha: ahora,
    usuario: usuario || 'admin',
    observacion: observacion || ''
  });
  return envio;
}

function formatearFecha(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
