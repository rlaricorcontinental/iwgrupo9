import { api } from './api';

// Endpoint público
export async function consultar(codigo) {
  const { data } = await api.get(`/seguimiento/${encodeURIComponent(codigo)}`);
  return data;
}

export async function registrarAvance(codigo, { id_estado, observacion }) {
  const { data } = await api.post(
    `/seguimiento/${encodeURIComponent(codigo)}/avance`,
    { id_estado, observacion }
  );
  return data;
}
