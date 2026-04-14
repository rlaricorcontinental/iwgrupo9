<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-secondary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />
        <q-avatar rounded class="bg-primary text-white q-ml-sm q-mr-sm">
          <q-icon name="local_shipping" size="22px" />
        </q-avatar>
        <q-toolbar-title class="text-weight-bold">
          Ismael Cargo System
          <div class="text-caption text-grey-4">Panel administrativo</div>
        </q-toolbar-title>

        <div class="row items-center q-gutter-sm">
          <q-avatar size="32px" color="primary" text-color="white">
            {{ inicial }}
          </q-avatar>
          <span class="gt-xs">{{ session.usuario }}</span>
          <q-btn flat dense icon="logout" label="Salir" no-caps @click="cerrarSesion" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered :width="240" class="bg-dark text-white">
      <q-list padding>
        <q-item clickable v-ripple :to="{ name: 'panel' }" exact active-class="bg-primary text-white">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Panel principal</q-item-section>
        </q-item>

        <q-item clickable v-ripple :to="{ name: 'registroEnvio' }" active-class="bg-primary text-white">
          <q-item-section avatar><q-icon name="add_box" /></q-item-section>
          <q-item-section>Registrar envio</q-item-section>
        </q-item>

        <q-item clickable v-ripple :to="{ name: 'actualizarEstado' }" active-class="bg-primary text-white">
          <q-item-section avatar><q-icon name="update" /></q-item-section>
          <q-item-section>Actualizar estado</q-item-section>
        </q-item>

        <q-separator dark class="q-my-md" />

        <q-item clickable v-ripple to="/seguimiento">
          <q-item-section avatar><q-icon name="pin_drop" /></q-item-section>
          <q-item-section>Seguimiento</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/">
          <q-item-section avatar><q-icon name="language" /></q-item-section>
          <q-item-section>Ver sitio publico</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { session } from 'boot/auth';

const drawer = ref(true);
const router = useRouter();
const $q = useQuasar();

const inicial = computed(() => (session.usuario || 'U')[0].toUpperCase());

function cerrarSesion() {
  session.logout();
  $q.notify({ type: 'info', message: 'Sesion finalizada' });
  router.replace('/login');
}
</script>
