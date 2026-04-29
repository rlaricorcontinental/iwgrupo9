import { api } from './api';

export async function listar(search) {
  const { data } = await api.get('/envios', { params: search ? { search } : {} });
  return data;
}

export async function stats() {
  const { data } = await api.get('/envios/stats');
  return data;
}

export async function obtener(codigo) {
  const { data } = await api.get(`/envios/${encodeURIComponent(codigo)}`);
  return data;
}

export async function crear(payload) {
  const { data } = await api.post('/envios', payload);
  return data;
}
