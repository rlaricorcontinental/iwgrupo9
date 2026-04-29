<template>
  <q-page class="q-pb-xl">
    <!-- Hero -->
    <section class="brand-gradient q-py-xl">
      <div class="text-center q-pa-md" style="max-width:720px;margin:0 auto;">
        <span class="tag-chip">Seguimiento de envios</span>
        <h1 class="text-h3 text-weight-bold text-white q-mt-md">Rastrea tu carga</h1>
        <p class="text-body1 text-grey-4">
          Ingresa el codigo de seguimiento que recibiste al momento del registro
          para conocer el estado actual de tu envio.
        </p>

        <q-card class="card-soft q-mt-lg q-pa-md">
          <q-form @submit="consultar" class="row q-col-gutter-sm items-center">
            <q-input
              class="col-12 col-sm"
              v-model="codigo"
              placeholder="Ej. ICS-2026-000001"
              outlined
              clearable
              autofocus
              :rules="[v => !!v || 'Ingresa un codigo']"
              hide-bottom-space
            >
              <template #prepend><q-icon name="qr_code_2" color="primary" /></template>
            </q-input>
            <div class="col-12 col-sm-auto">
              <q-btn
                unelevated
                color="primary"
                size="lg"
                icon="search"
                label="Consultar"
                type="submit"
                :loading="cargando"
                no-caps
                class="full-width"
              />
            </div>
          </q-form>
        </q-card>
      </div>
    </section>

    <!-- Resultado -->
    <section class="q-pa-md" style="max-width:960px;margin:0 auto;">
      <!-- No encontrado -->
      <q-card v-if="consultado && !envio" class="card-soft q-mt-lg q-pa-lg text-center">
        <q-avatar size="80px" class="bg-red-1 text-negative">
          <q-icon name="sentiment_dissatisfied" size="40px" />
        </q-avatar>
        <div class="text-h6 q-mt-md text-weight-bold">Envio no encontrado</div>
        <p class="text-grey-7">
          No hemos encontrado ningun envio con el codigo
          <b>{{ codigoConsultado }}</b>. Verifica que hayas ingresado el codigo
          correctamente.
        </p>
        <q-btn flat color="primary" icon="help_outline" label="Contactar soporte" to="/#contacto" no-caps />
      </q-card>

      <!-- Encontrado -->
      <div v-if="envio" class="q-mt-lg">
        <q-card class="card-soft">
          <q-card-section class="bg-secondary text-white">
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-4">Codigo de seguimiento</div>
                <div class="text-h5 text-weight-bold">{{ envio.codigo }}</div>
              </div>
              <q-chip
                :color="estadoActual.color"
                text-color="white"
                :icon="estadoActual.icon"
                size="md"
              >
                {{ estadoActual.nombre }}
              </q-chip>
            </div>
          </q-card-section>

          <!-- Progress visual de estados -->
          <q-card-section class="bg-grey-1">
            <div class="row items-center no-wrap" style="overflow-x:auto;">
              <template v-for="(e, i) in ESTADOS" :key="e.id">
                <div class="col text-center">
                  <q-avatar
                    :color="e.orden <= estadoActual.orden ? e.color : 'grey-4'"
                    text-color="white"
                    size="48px"
                  >
                    <q-icon :name="e.icon" />
                  </q-avatar>
                  <div class="text-caption q-mt-xs text-weight-bold">{{ e.nombre }}</div>
                </div>
                <div
                  v-if="i < ESTADOS.length - 1"
                  :class="['col-grow', 'q-mx-sm']"
                  style="height:4px;"
                  :style="{ background: ESTADOS[i+1].orden <= estadoActual.orden ? '#e87722' : '#e0e0e0' }"
                />
              </template>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Datos del envio -->
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-3">
                <div class="text-caption text-grey-7 text-uppercase">Origen</div>
                <div class="text-weight-bold">
                  <q-icon name="place" color="primary" /> {{ envio.origen }}
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="text-caption text-grey-7 text-uppercase">Destino</div>
                <div class="text-weight-bold">
                  <q-icon name="flag" color="primary" /> {{ envio.destino }}
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="text-caption text-grey-7 text-uppercase">Tipo de carga</div>
                <div class="text-weight-bold">{{ envio.tipoCarga }}</div>
              </div>
              <div class="col-6 col-md-3">
                <div class="text-caption text-grey-7 text-uppercase">Peso</div>
                <div class="text-weight-bold">{{ envio.pesoKg }} kg</div>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7 text-uppercase">Remitente</div>
                <div class="text-weight-bold">{{ envio.remitente.nombre }}</div>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7 text-uppercase">Destinatario</div>
                <div class="text-weight-bold">{{ envio.destinatario.nombre }}</div>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7 text-uppercase">Fecha de registro</div>
                <div>{{ envio.fechaRegistro }}</div>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7 text-uppercase">Ultima actualizacion</div>
                <div>{{ envio.fechaActualizacion }}</div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Historial -->
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">Historial de movimientos</div>
            <div
              v-for="(h, i) in historialOrdenado"
              :key="i"
              :class="['timeline-step', i === 0 ? '' : 'muted']"
            >
              <div class="row items-center no-wrap">
                <q-chip
                  :color="estadoDe(h.estadoId).color"
                  text-color="white"
                  :icon="estadoDe(h.estadoId).icon"
                  dense
                >
                  {{ estadoDe(h.estadoId).nombre }}
                </q-chip>
                <div class="text-caption text-grey-7 q-ml-sm">{{ h.fecha }}</div>
              </div>
              <div class="text-body2 q-mt-xs">{{ h.observacion || '(sin observaciones)' }}</div>
            </div>
          </q-card-section>
        </q-card>

        <div class="text-center q-mt-md">
          <q-btn flat color="primary" icon="search" label="Consultar otro codigo" no-caps @click="nuevaConsulta" />
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ESTADOS, estadoPorId } from 'src/data/mock';
import { consultar as consultarEnvio } from 'src/services/seguimientoService';

const route = useRoute();

const codigo = ref('');
const envio = ref(null);
const consultado = ref(false);
const cargando = ref(false);
const codigoConsultado = ref('');

const estadoActual = computed(() => envio.value ? estadoPorId(envio.value.estadoId) : null);
const historialOrdenado = computed(() =>
  envio.value ? [...envio.value.historial].reverse() : []
);

function estadoDe(id) { return estadoPorId(id); }

async function consultar() {
  if (!codigo.value) return;
  cargando.value = true;
  codigoConsultado.value = codigo.value;
  try {
    envio.value = await consultarEnvio(codigo.value.trim());
  } catch (err) {
    if (err.response && err.response.status === 404) {
      envio.value = null;
    } else {
      envio.value = null;
    }
  } finally {
    consultado.value = true;
    cargando.value = false;
  }
}

function nuevaConsulta() {
  codigo.value = '';
  envio.value = null;
  consultado.value = false;
  codigoConsultado.value = '';
}

onMounted(() => {
  if (route.query.codigo) {
    codigo.value = String(route.query.codigo);
    consultar();
  }
});
</script>
