import { defineRouter } from '#q-app/wrappers';
import { createRouter, createWebHashHistory } from 'vue-router';
import { LocalStorage } from 'quasar';
import routes from './routes';

export default defineRouter(function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHashHistory()
  });

  Router.beforeEach((to) => {
    if (to.meta.requiresAuth) {
      const sess = LocalStorage.getItem('ics_session');
      if (!sess || !sess.token) {
        return { path: '/login', query: { redirect: to.fullPath } };
      }
    }
    return true;
  });

  return Router;
});
