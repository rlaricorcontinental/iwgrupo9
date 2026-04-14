import { defineBoot } from '#q-app/wrappers';
import { reactive } from 'vue';

// Sesion simple: solo guarda el nombre de usuario ingresado.
export const session = reactive({
  usuario: null,
  get isAuthenticated() {
    return this.usuario !== null;
  },
  login(usuario) {
    this.usuario = usuario;
    localStorage.setItem('ics_session', usuario);
  },
  logout() {
    this.usuario = null;
    localStorage.removeItem('ics_session');
  },
  restore() {
    const s = localStorage.getItem('ics_session');
    if (s) this.usuario = s;
  }
});

export default defineBoot(({ app }) => {
  session.restore();
  app.config.globalProperties.$session = session;
});
