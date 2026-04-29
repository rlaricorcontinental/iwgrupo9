import { defineBoot } from '#q-app/wrappers';
import { reactive } from 'vue';
import { LocalStorage } from 'quasar';

// Sesión: guarda usuario + token JWT.
export const session = reactive({
  usuario: null,
  user:    null,
  token:   null,
  get isAuthenticated() {
    return !!this.token;
  },
  login({ token, usuario }) {
    this.token = token;
    this.user = usuario;
    this.usuario = usuario.usuario;
    LocalStorage.set('ics_session', { token, user: usuario });
  },
  logout() {
    this.token = null;
    this.user = null;
    this.usuario = null;
    LocalStorage.remove('ics_session');
  },
  restore() {
    const s = LocalStorage.getItem('ics_session');
    if (s && s.token && s.user) {
      this.token = s.token;
      this.user = s.user;
      this.usuario = s.user.usuario;
    }
  }
});

export default defineBoot(({ app }) => {
  session.restore();
  app.config.globalProperties.$session = session;
});
