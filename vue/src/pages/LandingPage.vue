<template>
  <q-page>
    <!-- HERO SLIDER -->
    <q-carousel
      v-model="slide"
      animated
      arrows
      navigation
      infinite
      autoplay
      control-color="primary"
      height="560px"
    >
      <q-carousel-slide name="slide1" class="hero-slide">
        <div
          class="bg"
          style="background:linear-gradient(135deg,#0d1f30 0%,#1a3a5c 100%);"
        />
        <div class="overlay" />
        <div class="content">
          <span class="tag-chip q-mb-md">Transporte de carga nacional</span>
          <div class="text-h2 text-weight-bold q-mt-md">
            Tu carga,
            <span class="text-primary">nuestra responsabilidad</span>
          </div>
          <p class="text-subtitle1 q-mt-md">
            Soluciones logisticas confiables para el transporte de mercancias
            entre ciudades del Peru, con puntualidad y seguridad garantizadas.
          </p>
          <div class="q-mt-lg">
            <q-btn unelevated color="primary" size="lg" label="Ver servicios" href="#servicios" no-caps class="q-mr-sm" />
            <q-btn outline color="white" size="lg" label="Rastrear envio" to="/seguimiento" no-caps />
          </div>
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="slide2" class="hero-slide">
        <div
          class="bg"
          style="background:linear-gradient(135deg,#1a3a5c 0%,#e87722 100%);"
        />
        <div class="overlay" />
        <div class="content">
          <span class="tag-chip q-mb-md">Cobertura nacional</span>
          <div class="text-h2 text-weight-bold q-mt-md">
            Llegamos a <span class="text-primary">todo el Peru</span>
          </div>
          <p class="text-subtitle1 q-mt-md">
            Operamos desde Lima hacia las principales ciudades del pais,
            adaptando nuestra flota a cada tipo de carga y destino.
          </p>
          <div class="q-mt-lg">
            <q-btn unelevated color="primary" size="lg" label="Ver cobertura" href="#cobertura" no-caps class="q-mr-sm" />
            <q-btn outline color="white" size="lg" label="Cotizar ahora" href="#contacto" no-caps />
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>

    <!-- NOSOTROS -->
    <section id="nosotros" class="section-pad bg-white">
      <div class="row q-col-gutter-xl items-center" style="max-width:1200px;margin:0 auto;">
        <div class="col-12 col-md-6">
          <span class="tag-chip">Sobre nosotros</span>
          <h2 class="text-h3 text-weight-bold q-mt-md">Mas de una decada moviendo el Peru</h2>
          <p class="text-body1 text-grey-8">
            Transportes Ismael S.A.C. es una empresa peruana dedicada al
            servicio de transporte de carga por carretera. Operamos desde Lima
            hacia las principales regiones del pais, con un equipo profesional
            y una flota adaptada a cada tipo de mercancia.
          </p>
          <div class="row q-col-gutter-md q-mt-md">
            <div v-for="k in kpis" :key="k.label" class="col-6 col-sm-3">
              <div class="text-h4 text-primary text-weight-bold">{{ k.value }}</div>
              <div class="text-caption text-grey-7">{{ k.label }}</div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <q-img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900"
            class="card-soft"
            style="border-radius:16px;"
            ratio="4/3"
          />
        </div>
      </div>
    </section>

    <!-- SERVICIOS -->
    <section id="servicios" class="section-pad" style="background:#f5f7fa;">
      <div style="max-width:1200px;margin:0 auto;">
        <div class="text-center q-mb-xl">
          <span class="tag-chip">Nuestros servicios</span>
          <h2 class="text-h3 text-weight-bold q-mt-md">Soluciones pensadas para ti</h2>
        </div>
        <div class="row q-col-gutter-lg">
          <div v-for="s in servicios" :key="s.titulo" class="col-12 col-sm-6 col-md-4">
            <q-card class="card-soft full-height">
              <q-card-section class="text-center q-pa-lg">
                <q-avatar size="64px" class="bg-primary text-white q-mb-md">
                  <q-icon :name="s.icon" size="32px" />
                </q-avatar>
                <div class="text-h6 text-weight-bold">{{ s.titulo }}</div>
                <p class="text-body2 text-grey-8 q-mt-sm">{{ s.desc }}</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- COBERTURA -->
    <section id="cobertura" class="section-pad bg-white">
      <div style="max-width:1200px;margin:0 auto;">
        <div class="text-center q-mb-xl">
          <span class="tag-chip">Cobertura</span>
          <h2 class="text-h3 text-weight-bold q-mt-md">Destinos que atendemos</h2>
        </div>
        <div class="row q-col-gutter-md">
          <div v-for="c in CIUDADES" :key="c.id" class="col-6 col-sm-4 col-md-3">
            <q-card class="card-soft q-pa-md row items-center no-wrap">
              <q-icon name="place" color="primary" size="28px" class="q-mr-sm" />
              <div>
                <div class="text-weight-bold">{{ c.nombre }}</div>
                <div class="text-caption text-grey-7">{{ c.departamento }}</div>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- SEGUIMIENTO CTA -->
    <section class="section-pad brand-gradient text-center">
      <div style="max-width:720px;margin:0 auto;">
        <span class="tag-chip">Seguimiento</span>
        <h2 class="text-h3 text-weight-bold q-mt-md">Rastrea tu envio ahora</h2>
        <p class="text-body1 q-mt-md">
          Ingresa tu codigo de seguimiento y conoce el estado actual de tu carga
          en segundos.
        </p>
        <q-btn
          unelevated color="primary" size="lg"
          label="Ir al seguimiento" icon="pin_drop"
          to="/seguimiento" no-caps class="q-mt-md"
        />
      </div>
    </section>

    <!-- CONTACTO -->
    <section id="contacto" class="section-pad bg-white">
      <div class="row q-col-gutter-xl" style="max-width:1200px;margin:0 auto;">
        <div class="col-12 col-md-5">
          <span class="tag-chip">Contacto</span>
          <h2 class="text-h3 text-weight-bold q-mt-md">Conversemos</h2>
          <p class="text-body1 text-grey-8">
            Estamos listos para atender tu consulta o cotizacion.
          </p>
          <q-list>
            <q-item>
              <q-item-section avatar><q-icon name="place" color="primary" /></q-item-section>
              <q-item-section>Av. Buenos Aires N 278 Of. 206, Puente Piedra, Lima</q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="phone" color="primary" /></q-item-section>
              <q-item-section>+51 987 654 321</q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="mail" color="primary" /></q-item-section>
              <q-item-section>contacto@transportesismael.pe</q-item-section>
            </q-item>
            <q-item clickable tag="a" href="https://wa.me/51987654321" target="_blank">
              <q-item-section avatar><q-icon name="chat" color="positive" /></q-item-section>
              <q-item-section>WhatsApp directo</q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-12 col-md-7">
          <q-card class="card-soft">
            <q-card-section>
              <div class="text-h6 text-weight-bold">Envianos un mensaje</div>
              <q-form @submit="enviarContacto" class="q-mt-md q-gutter-md">
                <q-input v-model="form.nombre"  label="Nombre *"   outlined :rules="[v => !!v || 'Requerido']" />
                <q-input v-model="form.correo"  label="Correo *"   outlined type="email" :rules="[v => !!v || 'Requerido']" />
                <q-input v-model="form.telefono" label="Telefono"  outlined />
                <q-input v-model="form.mensaje" label="Mensaje *"  outlined type="textarea" autogrow :rules="[v => !!v || 'Requerido']" />
                <div class="text-right">
                  <q-btn unelevated color="primary" label="Enviar consulta" icon="send" type="submit" no-caps />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { CIUDADES } from 'src/data/mock';

const $q = useQuasar();
const slide = ref('slide1');

const kpis = [
  { value: '12+', label: 'Anios de experiencia' },
  { value: '10',  label: 'Regiones cubiertas' },
  { value: '98%', label: 'Entregas a tiempo' },
  { value: '24/7',label: 'Atencion al cliente' }
];

const servicios = [
  { icon: 'local_shipping', titulo: 'Carga general',     desc: 'Transporte de mercancia estandar en unidades de distintas capacidades.' },
  { icon: 'ac_unit',        titulo: 'Carga refrigerada', desc: 'Cadena de frio para alimentos, lacteos y productos perecibles.' },
  { icon: 'inventory_2',    titulo: 'Carga fragil',      desc: 'Manejo especial para equipos electronicos y mercancia delicada.' },
  { icon: 'description',    titulo: 'Documentos',        desc: 'Envio rapido de paqueteria y documentacion corporativa.' },
  { icon: 'warning',        titulo: 'Carga peligrosa',   desc: 'Transporte con permisos y protocolos para materiales especiales.' },
  { icon: 'inventory',      titulo: 'Logistica integral',desc: 'Almacenamiento temporal y distribucion final al destinatario.' }
];

const form = reactive({ nombre: '', correo: '', telefono: '', mensaje: '' });

function enviarContacto() {
  $q.notify({ type: 'positive', message: 'Mensaje enviado. Te contactaremos pronto.' });
  form.nombre = form.correo = form.telefono = form.mensaje = '';
}
</script>
