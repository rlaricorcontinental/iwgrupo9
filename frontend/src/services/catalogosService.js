import { api } from './api';

export async function ciudades()    { return (await api.get('/catalogos/ciudades')).data; }
export async function tiposCarga()  { return (await api.get('/catalogos/tipos-carga')).data; }
export async function estados()     { return (await api.get('/catalogos/estados')).data; }
