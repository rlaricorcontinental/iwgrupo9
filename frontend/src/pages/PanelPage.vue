<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Panel principal</div>
        <div class="text-grey-7">Resumen operativo de los envios</div>
      </div>
      <div class="q-gutter-sm">
        <q-btn unelevated color="primary" icon="add_box" label="Nuevo envio" :to="{ name: 'registroEnvio' }" no-caps />
        <q-btn outline color="secondary" icon="update" label="Actualizar estado" :to="{ name: 'actualizarEstado' }" no-caps />
      </div>
    </div>

    <!-- KPIs -->
    <div class="row q-col-gutter-md">
      <div v-for="k in kpis" :key="k.label" class="col-12 col-sm-6 col-md-3">
        <q-card class="card-soft">
          <q-card-section class="row items-center no-wrap">
            <q-avatar size="48px" :color="k.color" text-color="white">
              <q-icon :name="k.icon" />
            </q-avatar>
            <div class="q-ml-md">
              <div class="text-caption text-grey-7 text-uppercase">{{ k.label }}</div>
              <div class="text-h5 text-weight-bold">{{ k.value }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Distribucion por estado -->
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-md-4">
        <q-card class="card-soft">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">Distribucion por estado</div>
            <div class="text-caption text-grey-7">Total: {{ envios.length }} envios</div>
            <div v-if="cargando" class="text-caption text-grey-6"><q-spinner-dots class="q-mr-xs" />Cargando...</div>
          </q-card-section>
          <q-separator />
          <q-list>
            <q-item v-for="e in ESTADOS" :key="e.id">
              <q-item-section avatar>
                <q-avatar :color="e.color" text-color="white" size="36px">
                  <q-icon :name="e.icon" size="20px" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ e.nombre }}</q-item-label>
                <q-linear-progress
                  :value="porcentaje(e.id) / 100"
                  :color="e.color"
                  class="q-mt-xs"
                  rounded size="8px"
                />
              </q-item-section>
              <q-item-section side>
                <div class="text-weight-bold">{{ conteoPorEstado(e.id) }}</div>
                <div class="text-caption text-grey-7">{{ porcentaje(e.id) }}%</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Envios recientes -->
      <div class="col-12 col-md-8">
        <q-card class="card-soft">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle1 text-weight-bold">Envios recientes</div>
              <div class="text-caption text-grey-7">Ultimos registros del sistema</div>
            </div>
            <q-input v-model="filtro" outlined dense clearable placeholder="Buscar por codigo, origen, destino...">
              <template #prepend><q-icon name="search" /></template>
            </q-input>
          </q-card-section>
          <q-separator />
          <q-table
            :rows="enviosFiltrados"
            :columns="columnas"
            row-key="codigo"
            flat
            dense
            :rows-per-page-options="[5, 10, 20]"
          >
            <template #body-cell-codigo="props">
              <q-td :props="props">
                <code class="text-primary text-weight-bold">{{ props.row.codigo }}</code>
              </q-td>
            </template>
            <template #body-cell-ruta="props">
              <q-td :props="props">
                {{ props.row.origen }} <q-icon name="arrow_forward" size="xs" /> {{ props.row.destino }}
              </q-td>
            </template>
            <template #body-cell-estado="props">
              <q-td :props="props">
                <q-chip
                  :color="estadoPorId(props.row.estadoId).color"
                  text-color="white"
                  :icon="estadoPorId(props.row.estadoId).icon"
                  dense
                >
                  {{ estadoPorId(props.row.estadoId).nombre }}
                </q-chip>
              </q-td>
            </template>
            <template #body-cell-peso="props">
              <q-td :props="props">{{ props.row.pesoKg }} kg</q-td>
            </template>
            <template #body-cell-acciones="props">
              <q-td :props="props" class="text-right">
                <q-btn
                  flat dense round icon="edit" color="primary"
                  :to="{ name: 'actualizarEstado', query: { codigo: props.row.codigo } }"
                >
                  <q-tooltip>Actualizar estado</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { ESTADOS, estadoPorId } from 'src/data/mock';
import { listar as listarEnvios, stats as statsEnvios } from 'src/services/enviosService';
import { extractError } from 'src/services/api';

const $q = useQuasar();
const filtro = ref('');
const envios = ref([]);
const cargando = ref(false);
const totales = ref({ total: 0, pendientes: 0, enTransito: 0, enReparto: 0, entregados: 0 });

async function cargar() {
  cargando.value = true;
  try {
    const [lista, st] = await Promise.all([listarEnvios(), statsEnvios()]);
    envios.value = lista;
    totales.value = st;
  } catch (err) {
    $q.notify({ type: 'negative', message: extractError(err) });
  } finally {
    cargando.value = false;
  }
}

onMounted(cargar);

const kpis = computed(() => [
  { label: 'Total envios', value: totales.value.total,      color: 'secondary', icon: 'inventory_2' },
  { label: 'Pendientes',   value: totales.value.pendientes, color: 'grey-7',    icon: 'schedule' },
  { label: 'En transito',  value: totales.value.enTransito, color: 'info',      icon: 'local_shipping' },
  { label: 'Entregados',   value: totales.value.entregados, color: 'positive',  icon: 'check_circle' }
]);

function conteoPorEstado(id) {
  return envios.value.filter((e) => e.estadoId === id).length;
}
function porcentaje(id) {
  if (envios.value.length === 0) return 0;
  return Math.round((conteoPorEstado(id) / envios.value.length) * 100);
}

const columnas = [
  { name: 'codigo',    label: 'Codigo',       field: 'codigo',    align: 'left' },
  { name: 'ruta',      label: 'Ruta',         field: 'origen',    align: 'left' },
  { name: 'tipoCarga', label: 'Tipo de carga',field: 'tipoCarga', align: 'left' },
  { name: 'peso',      label: 'Peso',         field: 'pesoKg',    align: 'left' },
  { name: 'estado',    label: 'Estado',       field: 'estadoId',  align: 'left' },
  { name: 'fecha',     label: 'Ult. actualizacion', field: 'fechaActualizacion', align: 'left' },
  { name: 'acciones',  label: '',             field: 'id',        align: 'right' }
];

const enviosFiltrados = computed(() => {
  if (!filtro.value) return envios.value;
  const q = filtro.value.toLowerCase();
  return envios.value.filter(e =>
    e.codigo.toLowerCase().includes(q) ||
    e.origen.toLowerCase().includes(q) ||
    e.destino.toLowerCase().includes(q) ||
    e.tipoCarga.toLowerCase().includes(q) ||
    e.remitente.nombre.toLowerCase().includes(q) ||
    e.destinatario.nombre.toLowerCase().includes(q)
  );
});
</script>
