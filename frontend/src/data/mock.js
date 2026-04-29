export const ESTADOS = [
  { id: 1, nombre: 'Pendiente',   color: 'grey',     icon: 'schedule',        orden: 1 },
  { id: 2, nombre: 'En transito', color: 'info',     icon: 'local_shipping',  orden: 2 },
  { id: 3, nombre: 'En reparto',  color: 'warning',  icon: 'delivery_dining', orden: 3 },
  { id: 4, nombre: 'Entregado',   color: 'positive', icon: 'check_circle',    orden: 4 }
];

export const TIPOS_CARGA = [
  { id: 1, nombre: 'Carga general' },
  { id: 2, nombre: 'Carga fragil' },
  { id: 3, nombre: 'Carga refrigerada' },
  { id: 4, nombre: 'Carga peligrosa' },
  { id: 5, nombre: 'Documentos' }
];

export const CIUDADES = [
  { id: 1,  nombre: 'Lima',     departamento: 'Lima' },
  { id: 2,  nombre: 'Arequipa', departamento: 'Arequipa' },
  { id: 3,  nombre: 'Cusco',    departamento: 'Cusco' },
  { id: 4,  nombre: 'Huancayo', departamento: 'Junin' },
  { id: 5,  nombre: 'Trujillo', departamento: 'La Libertad' },
  { id: 6,  nombre: 'Chiclayo', departamento: 'Lambayeque' },
  { id: 7,  nombre: 'Piura',    departamento: 'Piura' },
  { id: 8,  nombre: 'Puno',     departamento: 'Puno' },
  { id: 9,  nombre: 'Ica',      departamento: 'Ica' },
  { id: 10, nombre: 'Ayacucho', departamento: 'Ayacucho' }
];

export function estadoPorId(id) {
  return ESTADOS.find((e) => e.id === id) || { nombre: '-', color: 'grey-5', icon: 'help' };
}
