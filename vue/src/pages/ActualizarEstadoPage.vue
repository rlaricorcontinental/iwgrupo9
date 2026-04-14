<template>
  <q-page padding>
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" :to="{ name: 'panel' }" class="q-mr-sm" />
      <div>
        <div class="text-h4 text-weight-bold">Actualizar estado de envio</div>
        <div class="text-grey-7">Busca por codigo y registra el avance logistico</div>
      </div>
    </div>

    <!-- Buscador -->
    <q-card class="card-soft q-mb-md">
      <q-card-section>
        <q-form @submit="buscar" class="row q-col-gutter-md items-center">
          <q-input
            class="col-12 col-md-6"
            v-model="codigoBusqueda"
            label="Codigo de seguimiento"
            placeholder="Ej. ICS-2026-000001"
            outlined
            clearable
            autofocus
          >
            <template #prepend><q-icon name="qr_code_2" /></template>
          </q-input>
          <div class="col-12 col-md-6">
            <q-btn unelevated color="primary" icon="search" label="Buscar" no-caps type="submit" class="q-mr-sm" />
            <q-btn flat color="primary" label="Limpiar" no-caps @click="limpiar" />
          </div>
        </q-form>

        <!-- Sugerencias rapidas -->
        <div v-if="!envio" class="q-mt-md">
          <div class="text-caption text-grey-7 q-mb-xs">Envios activos recientes:</div>
          <q-chip
            v-for="e in enviosActivos.slice(0, 5)"
            :key="e.codigo"
            clickable
            color="grey-3"
            text-color="secondary"
            icon="local_shipping"
            @click="codigoBusqueda = e.codigo; buscar()"
          >
            {{ e.codigo }}
          </q-chip>
        </div>
      </q-card-section>
    </q-card>

    <q-banner v-if="mensajeError" class="bg-red-1 text-red-9 rounded-borders q-mb-md">
      <template #avatar><q-icon name="error" color="negative" /></template>
      {{ mensajeError }}
    </q-banner>

    <!-- Detalle del envio -->
    <div v-if="envio" class="row q-col-gutter-md">
      <!-- Info del envio -->
      <div class="col-12 col-md-5">
        <q-card class="card-soft">
          <q-card-section class="bg-secondary text-white">
            <div class="text-caption text-grey-4">Codigo de seguimiento</div>
            <div class="text-h5 text-weight-bold">{{ envio.codigo }}</div>
            <q-chip
              :color="estadoActual.color"
              text-color="white"
              :icon="estadoActual.icon"
              class="q-mt-sm"
              dense
            >
              {{ estadoActual.nombre }}
            </q-chip>
          </q-card-section>

          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label caption>Remitente</q-item-label>
                <q-item-label>{{ envio.remitente.nombre }}</q-item-label>
                <q-item-label caption>Doc: {{ envio.remitente.documento }} | Tel: {{ envio.remitente.telefono }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Destinatario</q-item-label>
                <q-item-label>{{ envio.destinatario.nombre }}</q-item-label>
                <q-item-label caption>Doc: {{ envio.destinatario.documento }} | Tel: {{ envio.destinatario.telefono }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Ruta</q-item-label>
                <q-item-label>
                  {{ envio.origen }}
                  <q-icon name="arrow_forward" size="xs" />
                  {{ envio.destino }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Carga</q-item-label>
                <q-item-label>{{ envio.tipoCarga }} - {{ envio.pesoKg }} kg</q-item-label>
                <q-item-label caption v-if="envio.descripcion">{{ envio.descripcion }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Registrado</q-item-label>
                <q-item-label>{{ envio.fechaRegistro }} ({{ envio.usuarioRegistro }})</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Form de actualizacion + historial -->
      <div class="col-12 col-md-7">
        <q-card class="card-soft q-mb-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">Registrar avance</div>
            <div class="text-caption text-grey-7">Selecciona el nuevo estado y agrega una observacion</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit="guardarAvance" class="q-gutter-md">
              <q-btn-toggle
                v-model="nuevoEstadoId"
                :options="opcionesEstado"
                spread
                unelevated
                toggle-color="primary"
                color="grey-3"
                text-color="secondary"
                toggle-text-color="white"
                no-caps
              />
              <q-input
                v-model="observacion"
                label="Observacion"
                placeholder="Ej. Paso por garita Corcona 14:20"
                outlined
                type="textarea"
                autogrow
              />
              <div class="row justify-end q-gutter-sm">
                <q-btn flat color="grey-7" label="Cancelar" no-caps @click="nuevoEstadoId = envio.estadoId; observacion = ''" />
                <q-btn
                  unelevated
                  color="primary"
                  icon="save"
                  label="Guardar avance"
                  type="submit"
                  no-caps
                  :disable="nuevoEstadoId === envio.estadoId && !observacion"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <!-- Timeline / historial -->
        <q-card class="card-soft">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">Historial del envio</div>
            <div class="text-caption text-grey-7">{{ envio.historial.length }} eventos registrados</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
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
              <div class="text-caption text-grey-7">Usuario: {{ h.usuario }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { envios, ESTADOS, buscarPorCodigo, estadoPorId, actualizarEstado } from 'src/data/mock';
import { session } from 'boot/auth';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const codigoBusqueda = ref('');
const envio = ref(null);
const mensajeError = ref('');
const nuevoEstadoId = ref(null);
const observacion = ref('');

const enviosActivos = computed(() => envios.filter(e => e.estadoId !== 4));

const estadoActual = computed(() => estadoPorId(envio.value.estadoId));

const opcionesEstado = computed(() =>
  ESTADOS.map(e => ({ label: e.nombre, value: e.id, icon: e.icon }))
);

const historialOrdenado = computed(() => [...envio.value.historial].reverse());

function estadoDe(id) { return estadoPorId(id); }

function buscar() {
  mensajeError.value = '';
  envio.value = null;
  if (!codigoBusqueda.value) {
    mensajeError.value = 'Ingresa un codigo de seguimiento';
    return;
  }
  const enc = buscarPorCodigo(codigoBusqueda.value);
  if (!enc) {
    mensajeError.value = `No se encontro ningun envio con el codigo "${codigoBusqueda.value}"`;
    return;
  }
  envio.value = enc;
  nuevoEstadoId.value = enc.estadoId;
  observacion.value = '';
}

function limpiar() {
  codigoBusqueda.value = '';
  envio.value = null;
  mensajeError.value = '';
  router.replace({ name: 'actualizarEstado' });
}

function guardarAvance() {
  if (!envio.value) return;
  if (nuevoEstadoId.value === envio.value.estadoId && !observacion.value) {
    $q.notify({ type: 'warning', message: 'Selecciona un nuevo estado o agrega una observacion' });
    return;
  }
  actualizarEstado(
    envio.value.codigo,
    nuevoEstadoId.value,
    observacion.value,
    session.usuario || 'admin'
  );
  observacion.value = '';
  $q.notify({ type: 'positive', message: 'Estado actualizado correctamente' });
}


onMounted(() => {
  if (route.query.codigo) {
    codigoBusqueda.value = String(route.query.codigo);
    buscar();
  }
});
watch(() => route.query.codigo, (v) => {
  if (v) {
    codigoBusqueda.value = String(v);
    buscar();
  }
});
</script>
