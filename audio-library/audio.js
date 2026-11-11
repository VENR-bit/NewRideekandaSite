/* Rideekanda — Audio Library renderer.
   Renders grouped guided-meditation audio rows. Each row has an inline
   "Listen" (lazy Drive /preview audio player) and a clean download link. */
(function () {
  var G = window.RK_AUDIO || [];

  function previewUrl(id) { return "https://drive.google.com/file/d/" + id + "/preview"; }
  function downloadUrl(id) { return "https://drive.usercontent.google.com/download?id=" + id + "&export=download&confirm=t"; }
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var IC = {
    audio:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 10v4M7 7v10M11 4v16M15 8v8M19 11v2"/></svg>',
    dl:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>',
    qr:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v7h-7"/></svg>'
  };

  // QR is for the kiosk: an installed PWA (display-mode standalone) OR a
  // fullscreen / minimal-ui kiosk browser. ?kiosk=1 forces on, ?kiosk=0 off.
  // Once kiosk is seen we remember it (localStorage), because some kiosk
  // launchers don't report a display-mode on every page — so the QR keeps
  // showing as visitors move between pages.
  var kparam = new URLSearchParams(location.search).get("kiosk");
  var mm = window.matchMedia;
  var standalone =
    (mm && (mm("(display-mode: standalone)").matches ||
            mm("(display-mode: fullscreen)").matches ||
            mm("(display-mode: minimal-ui)").matches)) ||
    window.navigator.standalone === true;
  try {
    if (kparam === "1" || standalone) localStorage.setItem("rk-kiosk", "1");
    if (kparam === "0") localStorage.removeItem("rk-kiosk");
  } catch (e) {}
  var remembered = false;
  try { remembered = localStorage.getItem("rk-kiosk") === "1"; } catch (e) {}
  var KIOSK = kparam === "1" || (kparam !== "0" && (standalone || remembered));
  function qrButton(it) {
    return KIOSK ? '<button class="btn ghost qr" data-id="' + it.id + '" data-title="' + esc(it.title) +
      '" aria-label="Show QR code to download">' + IC.qr + '<span>QR</span></button>' : "";
  }

  var idx = 0;
  function row(it) {
    var n = ++idx;
    return '<div class="aud" id="aud-' + n + '">' +
      '<div class="aud__main">' +
        '<span class="aud__ico">' + IC.audio + '</span>' +
        '<div class="aud__meta">' +
          '<p class="aud__title">' + esc(it.title) + '</p>' +
          (it.sub ? '<p class="aud__sub">' + esc(it.sub) + '</p>' : '') +
        '</div>' +
        '<div class="aud__act">' +
          '<button class="btn" data-id="' + it.id + '">' + IC.audio + '<span>Listen</span></button>' +
          '<a class="btn ghost" href="' + downloadUrl(it.id) + '">' + IC.dl + '<span>Download</span></a>' +
          qrButton(it) +
        '</div>' +
      '</div>' +
      '<div class="aud__stage" data-stage></div>' +
    '</div>';
  }

  function group(g) {
    return '<section class="grp' + (g.sinhala ? ' grp--si' : '') + '">' +
      '<div class="grp__label"><span>' + esc(g.label) + '</span><span class="line"></span>' +
        '<span class="count">' + String(g.items.length).padStart(2, "0") + '</span></div>' +
      g.items.map(row).join("") +
    '</section>';
  }

  var root = document.getElementById("library");
  root.innerHTML = G.map(group).join("");
  [].slice.call(root.querySelectorAll(".aud")).forEach(function (el, k) {
    setTimeout(function () { el.classList.add("in"); }, 50 + k * 45);
  });

  var totalEl = document.getElementById("total");
  if (totalEl) {
    var n = G.reduce(function (a, g) { return a + g.items.length; }, 0);
    totalEl.innerHTML = "<b>" + n + "</b> guided recordings · listen &amp; download";
  }

  /* ---- QR modal (kiosk only) ---- */
  var qrm = document.getElementById("qrm");
  function openQR(id, title) {
    if (!qrm) return;
    var box = document.getElementById("qr-code");
    try {
      var qr = qrcode(0, "M");
      qr.addData(downloadUrl(id));
      qr.make();
      box.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 1, scalable: true });
    } catch (err) { box.textContent = "QR unavailable"; }
    document.getElementById("qr-title").textContent = title || "";
    qrm.classList.add("open"); qrm.setAttribute("aria-hidden", "false");
  }
  function closeQR() { if (qrm) { qrm.classList.remove("open"); qrm.setAttribute("aria-hidden", "true"); } }
  if (qrm) {
    var qx = document.getElementById("qr-close");
    if (qx) qx.addEventListener("click", closeQR);
    qrm.addEventListener("click", function (e) { if (e.target === qrm) closeQR(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeQR(); });
  }

  root.addEventListener("click", function (e) {
    var qrBtn = e.target.closest && e.target.closest("button.qr");
    if (qrBtn) { openQR(qrBtn.dataset.id, qrBtn.dataset.title); return; }
    var btn = e.target.closest && e.target.closest("button[data-id]:not(.qr)");
    if (!btn) return;
    var card = btn.closest(".aud");
    var stage = card.querySelector("[data-stage]");
    var open = stage.classList.contains("is-open");
    // close any other open player so only one plays at a time
    [].slice.call(root.querySelectorAll(".aud__stage.is-open")).forEach(function (s) {
      if (s !== stage) { s.classList.remove("is-open"); s.innerHTML = ""; s.closest(".aud").querySelector(".btn").classList.remove("is-active"); }
    });
    if (open) {
      stage.classList.remove("is-open"); stage.innerHTML = ""; btn.classList.remove("is-active");
    } else {
      stage.classList.add("is-open"); btn.classList.add("is-active");
      stage.innerHTML = '<iframe src="' + previewUrl(btn.dataset.id) + '" allow="autoplay; encrypted-media" loading="lazy"></iframe>';
    }
  });
})();
