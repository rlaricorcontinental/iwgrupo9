import axios from 'axios';
import { LocalStorage } from 'quasar';

const baseURL = (typeof process !== 'undefined' && process.env && process.env.API_URL)
  || 'http://localhost:3000/api';

export const api = axios.create({ baseURL, timeout: 15000 });

// Adjunta JWT si hay sesión activa.
api.interceptors.request.use((config) => {
  const sess = LocalStorage.getItem('ics_session');
  if (sess && sess.token) {
    config.headers.Authorization = `Bearer ${sess.token}`;
  }
  return config;
});

// 401 -> limpia sesión y manda al login.
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response && err.response.status === 401) {
      LocalStorage.remove('ics_session');
      if (typeof window !== 'undefined' && !window.location.hash.startsWith('#/login')) {
        window.location.hash = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export function extractError(err) {
  if (err.response && err.response.data) {
    return err.response.data.error || 'Error en el servidor';
  }
  return err.message || 'Error de red';
}
