/* ──────────────────────────────────────────────────────────────
   Rideekanda — Service Worker (PWA / kiosk)
   Strategy:
     • Navigations (HTML): network-first, fall back to cache, then to
       the cached dashboard — so the kiosk keeps working if the network
       drops, but always shows fresh content when online.
     • Static assets (css/js/img/fonts): stale-while-revalidate — fast
       paint from cache, refreshed in the background.
   Bump CACHE_VERSION to force clients to drop old caches.
   ────────────────────────────────────────────────────────────── */
var CACHE_VERSION = "rk-v116";
var CACHE = "rideekanda-" + CACHE_VERSION;

// Core shell to precache so the dashboard works offline on first launch.
// The dashboard now lives at /dashboard/; its scripts stay at the site root.
var PRECACHE = [
  "./",
  "dashboard/",
  "dashboard/index.html",
  "./app.jsx?v=28",
  "./icons.jsx?v=26",
  "./admin-panel.jsx?v=25",
  "./tweaks-panel.jsx?v=21",
  "./image-slot.js?v=21",
  "./tiles-data.js?v=18",
  "./calendar-data.js?v=31",
  "./daily-routine/routine-data.js?v=1",
  "./rk/dash.js?v=1",
  "./rk/inner.css?v=3",
  "./rk/page.css?v=5",
  "./rk/page.js?v=2",
  "./rk/rk.css?v=16",
  "./rk/rk.js?v=7",
  "./rk/sky.js?v=7",
  "./rk/vendor/gsap.min.js",
  "./rk/vendor/ScrollTrigger.min.js",
  "./rk/vendor/SplitText.min.js",
  "./rk/vendor/lenis.min.js",
  "./eco-nav.js?v=42",
  "./eco-nav.css?v=21",
  "./styles.css?v=15",
  "./analytics.js?v=1",
  "./eco-header.css?v=10",
  "./eco-header.js?v=10",
  "./rideekanda-logo.svg",
  "./app/icon-192.png",
  "./app/icon-512.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // Best-effort precache — don't fail install if one item 404s.
      return Promise.allSettled(PRECACHE.map(function (u) { return c.add(u); }));
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Shown only when a page is requested that we have never cached and the
// network is unreachable. Deliberately self-contained (no CSS/JS fetches).
function offlineResponse() {
  var html = '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
    '<title>Offline \u2014 Rideekanda</title><style>' +
    'html,body{margin:0;height:100%;background:#1f1a14;color:#f3ecdb;' +
    "font-family:system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}" +
    'main{min-height:100%;display:flex;flex-direction:column;align-items:center;' +
    'justify-content:center;text-align:center;padding:32px;box-sizing:border-box;gap:14px}' +
    'h1{font-size:22px;font-weight:500;margin:0;color:#f3ecdb}' +
    'p{margin:0;max-width:32ch;line-height:1.6;color:#9d8d72;font-size:14px}' +
    '.row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:8px}' +
    'a,button{font:inherit;font-size:14px;padding:11px 20px;border-radius:999px;cursor:pointer;' +
    'text-decoration:none;border:1px solid rgba(224,183,106,.45);background:transparent;color:#e0b76a}' +
    'button{background:#c08a3e;border-color:#c08a3e;color:#1f1a14}' +
    '</style></head><body><main>' +
    '<h1>This page didn\u2019t load</h1>' +
    '<p>The connection dropped before the page could be fetched. It hasn\u2019t been saved for offline use yet.</p>' +
    '<div class="row"><button onclick="location.reload()">Try again</button>' +
    '<a href="/dashboard/">Go to the dashboard</a></div>' +
    '</main></body></html>';
  return new Response(html, {
    status: 503,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;

  // HTML navigations → network-first.
  var isNav = req.mode === "navigate" ||
              (req.headers.get("accept") || "").indexOf("text/html") !== -1;

  if (isNav) {
    e.respondWith(
      fetch(req).then(function (res) {
        if (sameOrigin && res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // Network failed. Serve a cached copy of THIS page if we have one.
        // We must never substitute a DIFFERENT page: falling back to the
        // dashboard here made any uncached page (e.g. /projects/library-cafe/)
        // silently render the dashboard under the original URL, which looks
        // exactly like "the page won't load". Show an honest offline notice
        // instead, so a retry is one tap away once the link is back.
        return caches.match(req).then(function (hit) {
          return hit || offlineResponse();
        });
      })
    );
    return;
  }

  // Cross-origin (fonts, maps, CDNs) → just go to network, fall back to cache.
  if (!sameOrigin) {
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          if (res && res.ok && (url.hostname.indexOf("fonts.g") !== -1 || url.hostname.indexOf("unpkg") !== -1 || url.hostname.indexOf("cdnjs") !== -1)) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        }).catch(function () { return hit; });
      })
    );
    return;
  }

  // Same-origin static assets → stale-while-revalidate.
  e.respondWith(
    caches.match(req).then(function (hit) {
      var fetchP = fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || fetchP;
    })
  );
});
