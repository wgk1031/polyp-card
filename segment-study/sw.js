/* 仅缓存本站静态文件，便于添加到主屏幕后离线打开；不缓存任何用户数据 */
const C = 'segment-study-card-v1';
const BASE = '/polyp-card/segment-study/';
const FILES = [BASE, BASE + 'index.html', BASE + 'manifest.webmanifest', BASE + 'icon-192.png', BASE + 'icon-512.png', BASE + 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  const u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || !u.pathname.startsWith(BASE)) return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => {
    const net = fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
