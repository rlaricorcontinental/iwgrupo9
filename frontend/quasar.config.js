/* eslint-disable */
import { defineConfig } from '#q-app/wrappers';

export default defineConfig((ctx) => {
  return {
    boot: ['auth'],

    css: ['app.scss'],

    extras: [
      'roboto-font',
      'material-icons',
      'material-symbols-outlined'
    ],

    build: {
      target: {
        browser: ['es2022', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node20'
      },
      vueRouterMode: 'hash',
      env: {
        API_URL: process.env.API_URL || 'http://localhost:3000/api'
      }
    },

    devServer: {
      open: true,
      port: 9000
    },

    framework: {
      config: {
        brand: {
          primary: '#e87722',
          secondary: '#0d1f30',
          accent: '#1976D2',
          dark: '#0d1f30',
          positive: '#21BA45',
          negative: '#C10015',
          info: '#31CCEC',
          warning: '#F2C037'
        },
        notify: {
          position: 'top-right',
          timeout: 2500
        }
      },
      plugins: ['Notify', 'Dialog', 'LocalStorage']
    },

    animations: [],

    ssr: false,
    pwa: false
  };
});
