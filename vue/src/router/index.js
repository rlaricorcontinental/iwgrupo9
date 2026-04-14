import { defineRouter } from '#q-app/wrappers';
import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';

export default defineRouter(function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHashHistory()
  });

  Router.beforeEach((to) => {
    if (to.meta.requiresAuth) {
      const session = JSON.parse(localStorage.getItem('ics_session') || 'null');
      if (!session) {
        return { path: '/login', query: { redirect: to.fullPath } };
      }
    }
    return true;
  });

  return Router;
});
