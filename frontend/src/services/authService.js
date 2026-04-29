import { api } from './api';

export async function login(usuario, password) {
  const { data } = await api.post('/auth/login', { usuario, password });
  return data;
}

export async function me() {
  const { data } = await api.get('/auth/me');
  return data;
}
