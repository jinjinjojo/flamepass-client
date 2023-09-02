let bareServer = 'k12.studybetter.xyz/bare/';

importScripts('/sw/uv/uv.bundle.js');
importScripts('/sw/uv/uv.config.js');
importScripts('/sw/uv/uv.sw.js');

importScripts('/sw/dynamic/dynamic.config.js');
importScripts('/sw/dynamic/dynamic.worker.js');

addEventListener('install', async function (event) {
  event.waitUntil(self.skipWaiting());
});

addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

const p = new Promise(async (res) => {
  const cache = await caches.open('astro-data');

  if (await cache.match('/bare.txt')) {
    bareServer = await (await cache.match('/bare.txt')).text();
  }

  try {
    const req = await fetch('http://' + bareServer.replace(/\/$/, '') + '/', {
      redirect: 'follow',
    });

    //console.log('bare server', bareServer)

    self.__uv$config.bare = req.url;
    self.__dynamic$config.bare.path = req.url;
  } catch {}

  self.dynamic = new Dynamic(self.__dynamic$config);
  self.uv = new UVServiceWorker(self.__uv$config);

  res(true);
});

addEventListener('fetch', function (event) {
  event.respondWith(
    (async function () {
      await p;

      if (event.request.url.endsWith('?sw=ignore'))
        return await fetch(event.request);

      if (event.request.url.startsWith(location.origin + '/~/uv/')) {
        return await self.uv.fetch(event);
      }

      //console.log(event.request.url, await self.dynamic.route(event), await self.dynamic.fetch(event));

      if (await self.dynamic.route(event)) {
        return await self.dynamic.fetch(event);
      }

      return await fetch(event.request);
    })()
  );
});
