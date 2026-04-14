<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center brand-gradient" style="min-height:100vh;">
        <div class="row items-center justify-center full-width q-pa-md" style="max-width:960px;">
          <div class="col-12 col-md-6 text-white q-pa-md gt-sm">
            <q-btn flat icon="arrow_back" label="Volver al sitio" color="white" to="/" no-caps class="q-mb-lg" />
            <h1 class="text-h3 text-weight-bold">
              Ismael <span class="text-primary">Cargo System</span>
            </h1>
            <p class="text-subtitle1 text-grey-4">
              Accede al panel administrativo para gestionar envios, actualizar
              estados y mantener la operacion de Transportes Ismael S.A.C. bajo control.
            </p>
          </div>

          <div class="col-12 col-md-6 q-pa-md">
            <q-card class="card-soft q-pa-lg">
              <q-card-section class="text-center">
                <q-avatar size="64px" class="bg-primary text-white">
                  <q-icon name="lock" size="32px" />
                </q-avatar>
                <div class="text-h5 text-weight-bold q-mt-md">Iniciar sesion</div>
                <div class="text-caption text-grey-7">Ingresa tus credenciales para continuar</div>
              </q-card-section>

              <q-card-section>
                <q-form @submit="iniciarSesion" class="q-gutter-md">
                  <q-input
                    v-model="usuario"
                    label="Usuario *"
                    outlined
                    autofocus
                    :rules="[v => !!v || 'Ingresa tu usuario']"
                  >
                    <template #prepend><q-icon name="person" /></template>
                  </q-input>

                  <q-input
                    v-model="password"
                    label="Contrasena *"
                    outlined
                    :type="verPass ? 'text' : 'password'"
                    :rules="[v => !!v || 'Ingresa tu contrasena']"
                  >
                    <template #prepend><q-icon name="lock" /></template>
                    <template #append>
                      <q-icon
                        :name="verPass ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="verPass = !verPass"
                      />
                    </template>
                  </q-input>

                  <q-btn
                    unelevated
                    color="primary"
                    size="lg"
                    label="Ingresar"
                    icon-right="login"
                    class="full-width"
                    type="submit"
                    no-caps
                  />
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { session } from 'boot/auth';

const usuario  = ref('');
const password = ref('');
const verPass  = ref(false);

const router = useRouter();
const route  = useRoute();
const $q     = useQuasar();

function iniciarSesion() {
  if (!usuario.value || !password.value) return;
  session.login(usuario.value.trim());
  $q.notify({ type: 'positive', message: `Bienvenido, ${usuario.value}` });
  router.replace(route.query.redirect || '/admin');
}
</script>
