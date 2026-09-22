// Este archivo hace que la app quede guardada completa en el celular la
// primera vez que se abre (con internet), para poder abrirla después las
// veces que sea necesario, sin ninguna señal.

const NOMBRE_DEL_GUARDADO = 'accesibilidad-v1';

const ARCHIVOS_A_GUARDAR = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js'
];

// Cuando el navegador instala este "service worker" por primera vez,
// descarga y guarda una copia de todos los archivos de la lista de arriba.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(NOMBRE_DEL_GUARDADO).then((copiaGuardada) => {
      return copiaGuardada.addAll(ARCHIVOS_A_GUARDAR);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

// Cada vez que la página pida algo (el propio HTML, o la librería del QR),
// primero revisa si ya lo tiene guardado localmente. Si lo tiene, lo usa
// directo (sin internet). Si no lo tiene, intenta buscarlo por internet.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((copiaGuardadaDeEsteArchivo) => {
      return copiaGuardadaDeEsteArchivo || fetch(event.request);
    })
  );
});
