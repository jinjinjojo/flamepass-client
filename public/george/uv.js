importScripts('/george/uv/uv.bundle.js');
importScripts('/george/uv/uv.config.js');
importScripts('/george/uv/uv.sw.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => event.respondWith(sw.fetch(event)));
