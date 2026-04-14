const routes = [
  {
    path: '/',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      { path: '',          name: 'landing',   component: () => import('pages/LandingPage.vue') },
      { path: 'seguimiento', name: 'seguimiento', component: () => import('pages/ConsultaEnvioPage.vue') }
    ]
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue')
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '',               name: 'panel',            component: () => import('pages/PanelPage.vue') },
      { path: 'envios/nuevo',   name: 'registroEnvio',    component: () => import('pages/RegistroEnvioPage.vue') },
      { path: 'envios/estado',  name: 'actualizarEstado', component: () => import('pages/ActualizarEstadoPage.vue') }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
