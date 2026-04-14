<template>
  <q-page padding>
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" :to="{ name: 'panel' }" class="q-mr-sm" />
      <div>
        <div class="text-h4 text-weight-bold">Registrar nuevo envio</div>
        <div class="text-grey-7">Completa los datos para generar el codigo de seguimiento</div>
      </div>
    </div>

    <q-stepper
      v-model="step"
      color="primary"
      animated
      header-nav
      flat
      class="card-soft"
    >
      <!-- Paso 1: Remitente -->
      <q-step :name="1" title="Remitente" icon="person" :done="step > 1">
        <div class="row q-col-gutter-md">
          <q-input class="col-12 col-md-6" v-model="form.remitenteNombre" label="Nombre completo *" outlined :rules="[req]" />
          <q-input class="col-12 col-md-3" v-model="form.remitenteDoc"    label="DNI / RUC"         outlined />
          <q-input class="col-12 col-md-3" v-model="form.remitenteTel"    label="Telefono"          outlined />
        </div>
        <q-stepper-navigation>
          <q-btn color="primary" label="Siguiente" no-caps @click="siguiente(1)" />
        </q-stepper-navigation>
      </q-step>

      <!-- Paso 2: Destinatario -->
      <q-step :name="2" title="Destinatario" icon="person_pin_circle" :done="step > 2">
        <div class="row q-col-gutter-md">
          <q-input class="col-12 col-md-6" v-model="form.destinatarioNombre" label="Nombre completo *" outlined :rules="[req]" />
          <q-input class="col-12 col-md-3" v-model="form.destinatarioDoc"    label="DNI / RUC"         outlined />
          <q-input class="col-12 col-md-3" v-model="form.destinatarioTel"    label="Telefono"          outlined />
        </div>
        <q-stepper-navigation>
          <q-btn flat color="primary" label="Atras" no-caps @click="step = 1" class="q-mr-sm" />
          <q-btn color="primary" label="Siguiente" no-caps @click="siguiente(2)" />
        </q-stepper-navigation>
      </q-step>

      <!-- Paso 3: Detalles del envio -->
      <q-step :name="3" title="Detalles de la carga" icon="inventory_2" :done="step > 3">
        <div class="row q-col-gutter-md">
          <q-select
            class="col-12 col-md-6"
            v-model="form.origen"
            :options="opcionesCiudades"
            label="Ciudad de origen *"
            outlined
            :rules="[req]"
          />
          <q-select
            class="col-12 col-md-6"
            v-model="form.destino"
            :options="opcionesCiudades"
            label="Ciudad de destino *"
            outlined
            :rules="[req, (v) => v !== form.origen || 'Debe ser distinto al origen']"
          />
          <q-select
            class="col-12 col-md-6"
            v-model="form.tipoCarga"
            :options="opcionesTipoCarga"
            label="Tipo de carga *"
            outlined
            :rules="[req]"
          />
          <q-input
            class="col-12 col-md-6"
            v-model.number="form.pesoKg"
            label="Peso (kg) *"
            type="number"
            outlined
            :rules="[req, (v) => v > 0 || 'Debe ser mayor a 0']"
            suffix="kg"
          />
          <q-input
            class="col-12"
            v-model="form.descripcion"
            label="Descripcion / observaciones"
            type="textarea"
            outlined
            autogrow
          />
        </div>
        <q-stepper-navigation>
          <q-btn flat color="primary" label="Atras" no-caps @click="step = 2" class="q-mr-sm" />
          <q-btn color="primary" label="Revisar" no-caps @click="siguiente(3)" />
        </q-stepper-navigation>
      </q-step>

      <!-- Paso 4: Confirmacion -->
      <q-step :name="4" title="Confirmar" icon="check_circle">
        <div class="text-h6 q-mb-md">Resumen del envio</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-caption text-grey-7 text-uppercase">Remitente</div>
                <div class="text-weight-bold">{{ form.remitenteNombre }}</div>
                <div class="text-caption">Doc: {{ form.remitenteDoc || '-' }} | Tel: {{ form.remitenteTel || '-' }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-caption text-grey-7 text-uppercase">Destinatario</div>
                <div class="text-weight-bold">{{ form.destinatarioNombre }}</div>
                <div class="text-caption">Doc: {{ form.destinatarioDoc || '-' }} | Tel: {{ form.destinatarioTel || '-' }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12">
            <q-card flat bordered>
              <q-card-section>
                <div class="row q-col-gutter-md">
                  <div class="col-6 col-md-3">
                    <div class="text-caption text-grey-7 text-uppercase">Origen</div>
                    <div class="text-weight-bold">{{ form.origen }}</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="text-caption text-grey-7 text-uppercase">Destino</div>
                    <div class="text-weight-bold">{{ form.destino }}</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="text-caption text-grey-7 text-uppercase">Tipo de carga</div>
                    <div class="text-weight-bold">{{ form.tipoCarga }}</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="text-caption text-grey-7 text-uppercase">Peso</div>
                    <div class="text-weight-bold">{{ form.pesoKg }} kg</div>
                  </div>
                  <div v-if="form.descripcion" class="col-12">
                    <div class="text-caption text-grey-7 text-uppercase">Descripcion</div>
                    <div>{{ form.descripcion }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-banner class="bg-blue-1 text-blue-10 rounded-borders q-mt-md">
          <template #avatar><q-icon name="qr_code_2" color="primary" /></template>
          Al confirmar, el sistema generara un codigo unico de seguimiento (RF04)
          y el envio quedara con estado <b>Pendiente</b>.
        </q-banner>

        <q-stepper-navigation>
          <q-btn flat color="primary" label="Atras" no-caps @click="step = 3" class="q-mr-sm" />
          <q-btn color="positive" icon="check" label="Confirmar y registrar" no-caps @click="registrar" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>

    <!-- Dialogo de exito -->
    <q-dialog v-model="dialogOk" persistent>
      <q-card style="min-width:360px;">
        <q-card-section class="text-center q-pa-lg">
          <q-avatar size="72px" color="positive" text-color="white" icon="check_circle" />
          <div class="text-h5 q-mt-md text-weight-bold">Envio registrado!</div>
          <div class="text-grey-7 q-mt-sm">Codigo de seguimiento generado:</div>
          <div class="text-h4 text-primary text-weight-bold q-mt-sm q-mb-sm">
            {{ codigoGenerado }}
          </div>
          <q-btn
            flat dense icon="content_copy" label="Copiar"
            color="primary" no-caps
            @click="copiarCodigo"
          />
        </q-card-section>
        <q-card-actions align="right" class="q-px-lg q-pb-md">
          <q-btn flat label="Registrar otro" color="primary" no-caps @click="nuevo" />
          <q-btn unelevated label="Ir al panel" color="primary" no-caps :to="{ name: 'panel' }" @click="dialogOk = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useQuasar, copyToClipboard } from 'quasar';
import { CIUDADES, TIPOS_CARGA, agregarEnvio } from 'src/data/mock';
import { session } from 'boot/auth';

const $q = useQuasar();

const step = ref(1);
const dialogOk = ref(false);
const codigoGenerado = ref('');

const form = reactive({
  remitenteNombre: '',  remitenteDoc: '',  remitenteTel: '',
  destinatarioNombre: '', destinatarioDoc: '', destinatarioTel: '',
  origen: null, destino: null,
  tipoCarga: null,
  pesoKg: null,
  descripcion: ''
});

const opcionesCiudades  = computed(() => CIUDADES.map(c => c.nombre));
const opcionesTipoCarga = computed(() => TIPOS_CARGA.map(t => t.nombre));

const req = (v) => (!!v && v !== '') || 'Requerido';

function siguiente(paso) {
  if (paso === 1 && !form.remitenteNombre) { notifyErr('Ingresa el remitente'); return; }
  if (paso === 2 && !form.destinatarioNombre) { notifyErr('Ingresa el destinatario'); return; }
  if (paso === 3) {
    if (!form.origen || !form.destino || !form.tipoCarga || !form.pesoKg) {
      notifyErr('Completa los datos de la carga'); return;
    }
    if (form.origen === form.destino) {
      notifyErr('Origen y destino deben ser distintos'); return;
    }
    if (form.pesoKg <= 0) {
      notifyErr('El peso debe ser mayor a 0'); return;
    }
  }
  step.value = paso + 1;
}

function registrar() {
  const nuevoEnvio = agregarEnvio({
    ...form,
    usuario: session.usuario || 'admin'
  });
  codigoGenerado.value = nuevoEnvio.codigo;
  dialogOk.value = true;
  $q.notify({ type: 'positive', message: 'Envio registrado correctamente' });
}

function copiarCodigo() {
  copyToClipboard(codigoGenerado.value).then(() => {
    $q.notify({ type: 'info', message: 'Codigo copiado al portapapeles' });
  });
}

function nuevo() {
  Object.assign(form, {
    remitenteNombre: '', remitenteDoc: '', remitenteTel: '',
    destinatarioNombre: '', destinatarioDoc: '', destinatarioTel: '',
    origen: null, destino: null, tipoCarga: null, pesoKg: null, descripcion: ''
  });
  step.value = 1;
  dialogOk.value = false;
}

function notifyErr(msg) {
  $q.notify({ type: 'negative', message: msg });
}
</script>
