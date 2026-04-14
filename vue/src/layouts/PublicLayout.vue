<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-secondary text-white">
      <q-toolbar class="q-py-sm">
        <q-avatar rounded class="bg-primary text-white q-mr-sm">
          <q-icon name="local_shipping" size="22px" />
        </q-avatar>

        <q-toolbar-title class="text-weight-bold">
          Transportes Ismael S.A.C.
          <div class="text-caption text-grey-4">Transporte de carga confiable</div>
        </q-toolbar-title>

        <q-tabs v-model="tab" class="gt-sm" dense shrink align="right" no-caps>
          <q-route-tab to="/"            label="Inicio" exact />
          <q-route-tab to="/seguimiento" label="Seguimiento" />
          <q-route-tab to="/#servicios"  label="Servicios" />
          <q-route-tab to="/#cobertura"  label="Cobertura" />
          <q-route-tab to="/#contacto"   label="Contacto" />
        </q-tabs>

        <q-btn
          unelevated
          color="primary"
          label="Login"
          icon="lock"
          class="q-ml-md"
          to="/login"
          no-caps
        />

        <q-btn
          flat round dense
          icon="menu"
          class="lt-md q-ml-sm"
          @click="drawer = !drawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" side="right" behavior="mobile" bordered>
      <q-list>
        <q-item clickable v-ripple to="/" exact>
          <q-item-section>Inicio</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/seguimiento">
          <q-item-section>Seguimiento</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/login">
          <q-item-section>Login</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-secondary text-grey-4">
      <div class="q-pa-lg row items-center justify-between">
        <div class="text-caption">
          (c) 2026 Transportes Ismael S.A.C. - Todos los derechos reservados.
        </div>
        <div class="text-caption">
          Desarrollado por Grupo 9 - Ingenieria Web
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
const tab = ref('inicio');
const drawer = ref(false);
</script>
