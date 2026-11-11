/* Rideekanda — Retreat Documents renderer.
   Renders grouped PDF rows. Each row has View, Download, and — on the kiosk
   only — a QR code so a visitor can take the document away on their own phone.

   View opens the document in an in-page PDF.js reader rather than handing the
   file to the browser. A new tab is not a reliable way to *show* a PDF: an
   installed app / kiosk browser has no built-in PDF viewer, so it falls back to
   downloading the file, and on a locked-down kiosk the visitor then has no way
   to open or dismiss it. Rendering the pages ourselves works the same way
   everywhere. This is the same reader the ebooks library already uses. */
(function () {
  var G = window.RK_DOCS || [];

  function fileUrl(f) { return "files/" + f; }
  function absUrl(f) { return location.origin + location.pathname.replace(/[^/]*$/, "") + fileUrl(f); }
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var IC = {
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h6"/></svg>',
    view: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.8 12S5.5 5.5 12 5.5 22.2 12 22.2 12 18.5 18.5 12 18.5 1.8 12 1.8 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    dl:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>',
    qr:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v7h-7"/></svg>'
  };

  // QR is for the kiosk: an installed PWA (display-mode standalone) OR a
  // fullscreen / minimal-ui kiosk browser. ?kiosk=1 forces on, ?kiosk=0 off.
  // Once kiosk is seen we remember it, since some kiosk launchers don't report
  // a display-mode on every page.
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
    return KIOSK ? '<button class="btn ghost qr" data-file="' + esc(it.file) + '" data-title="' + esc(it.title) +
      '" aria-label="Show QR code to download">' + IC.qr + '<span>QR</span></button>' : "";
  }

  function row(it) {
    var meta = "PDF" + (it.size ? " · " + esc(it.size) : "");
    return '<div class="doc">' +
      '<div class="doc__main">' +
        '<span class="doc__ico">' + IC.doc + '</span>' +
        '<div class="doc__meta">' +
          '<p class="doc__title">' + esc(it.title) + '</p>' +
          '<p class="doc__sub">' + (it.desc ? esc(it.desc) + ' · ' : '') + meta + '</p>' +
        '</div>' +
        '<div class="doc__act">' +
          '<button class="btn view" data-file="' + esc(it.file) + '" data-title="' + esc(it.title) +
            '" data-desc="' + esc(it.desc || "") + '">' + IC.view + '<span>View</span></button>' +
          '<a class="btn ghost dl" href="' + fileUrl(it.file) + '" download>' + IC.dl + '<span>Download</span></a>' +
          qrButton(it) +
        '</div>' +
      '</div>' +
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
  if (!root) return;
  root.innerHTML = G.map(group).join("");
  [].slice.call(root.querySelectorAll(".doc")).forEach(function (el, k) {
    setTimeout(function () { el.classList.add("in"); }, 50 + k * 45);
  });

  var totalEl = document.getElementById("total");
  if (totalEl) {
    var n = G.reduce(function (a, g) { return a + g.items.length; }, 0);
    totalEl.innerHTML = "<b>" + n + "</b> documents · view &amp; download";
  }

  /* ---- reader (PDF.js — scrollable, works on mobile and on the kiosk) ---- */
  var reader = document.getElementById("reader");
  var stage = document.getElementById("r-stage");
  var pagesEl = document.getElementById("r-pages");
  var zoom = 100, night = false;
  var pdfDoc = null, pdfDims = null, pageObserver = null, loadToken = 0;
  try {
    var z = parseInt(localStorage.getItem("rk-read-zoom"), 10); if (z >= 50 && z <= 300) zoom = z;
    night = localStorage.getItem("rk-read-night") === "1";
  } catch (e) {}
  // The library lives with the ebooks page; reference it absolutely from here.
  if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "/ebooks/vendor/pdf.worker.min.js";

  // Opening the raw file in a new tab is useful on a desktop browser, but on
  // the kiosk it is the very thing that produces a download instead of a view.
  var openExt = document.getElementById("r-open");
  if (openExt && KIOSK) openExt.remove();

  function applyNight() {
    reader.classList.toggle("reader--night", night);
    var nb = document.getElementById("r-night");
    if (nb) nb.textContent = night ? "☀️" : "🌙";
  }
  function fitScale() {
    if (!pdfDims) return 1;
    var w = (pagesEl.clientWidth || stage.clientWidth || 700) - 4;
    return (w / pdfDims.w) * (zoom / 100);   // zoom 100% = fit page width
  }
  function buildPages() {
    if (!pdfDoc) return;
    if (pageObserver) pageObserver.disconnect();
    pagesEl.innerHTML = "";
    var s = fitScale();
    for (var n = 1; n <= pdfDoc.numPages; n++) {
      var d = document.createElement("div");
      d.className = "pdfpage"; d.dataset.n = n; d.dataset.done = "0";
      d.style.width = Math.round(pdfDims.w * s) + "px";
      d.style.height = Math.round(pdfDims.h * s) + "px";
      pagesEl.appendChild(d);
    }
    pageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) renderPage(en.target); });
    }, { root: stage, rootMargin: "300px 0px" });
    [].slice.call(pagesEl.children).forEach(function (d) { pageObserver.observe(d); });
  }
  function renderPage(div) {
    if (div.dataset.done === "1") return;
    div.dataset.done = "1";
    var n = +div.dataset.n, token = loadToken;
    pdfDoc.getPage(n).then(function (page) {
      if (token !== loadToken) return;
      var s = fitScale();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var vp = page.getViewport({ scale: s * dpr });
      var canvas = document.createElement("canvas");
      canvas.width = vp.width; canvas.height = vp.height;
      canvas.style.width = "100%"; canvas.style.height = "100%";
      div.style.height = "auto";
      div.innerHTML = ""; div.appendChild(canvas);
      page.render({ canvasContext: canvas.getContext("2d"), viewport: vp });
    }).catch(function () { div.dataset.done = "0"; });
  }
  function loadPdf(url) {
    var token = ++loadToken;
    pdfDoc = null; pdfDims = null;
    pagesEl.innerHTML = '<div class="reader__msg">Loading…</div>';
    if (!window.pdfjsLib) { pagesEl.innerHTML = '<div class="reader__msg">Reader unavailable — please use <b>Download</b>.</div>'; return; }
    pdfjsLib.getDocument(url).promise.then(function (doc) {
      if (token !== loadToken) return;
      pdfDoc = doc;
      return doc.getPage(1).then(function (p1) {
        var vp = p1.getViewport({ scale: 1 });
        pdfDims = { w: vp.width, h: vp.height };
        buildPages();
      });
    }).catch(function () {
      if (token !== loadToken) return;
      pagesEl.innerHTML = '<div class="reader__msg">Could not display this document here. Please use <b>Download</b>.</div>';
    });
  }
  function setZoom(z) {
    zoom = Math.max(50, Math.min(300, z));
    try { localStorage.setItem("rk-read-zoom", zoom); } catch (e) {}
    if (pdfDoc) buildPages();
  }

  function openReader(file, title, desc) {
    if (!reader) return;
    var url = fileUrl(file);
    document.getElementById("r-title").textContent = title || "";
    document.getElementById("r-sub").textContent = desc || "";
    var rdl = document.getElementById("r-dl");
    rdl.href = url;
    rdl.setAttribute("download", file);
    if (openExt) openExt.href = url;
    applyNight();
    reader.classList.add("open");
    reader.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    stage.scrollTop = 0;
    loadPdf(url);
  }
  function closeReader() {
    if (!reader) return;
    reader.classList.remove("open");
    reader.setAttribute("aria-hidden", "true");
    loadToken++;                 // cancel any in-flight renders
    if (pageObserver) pageObserver.disconnect();
    pagesEl.innerHTML = "";
    pdfDoc = null;
    document.body.style.overflow = "";
  }
  if (reader) {
    document.getElementById("r-close").addEventListener("click", closeReader);
    document.getElementById("r-zoomin").addEventListener("click", function () { setZoom(zoom + 25); });
    document.getElementById("r-zoomout").addEventListener("click", function () { setZoom(zoom - 25); });
    document.getElementById("r-night").addEventListener("click", function () {
      night = !night;
      try { localStorage.setItem("rk-read-night", night ? "1" : "0"); } catch (e) {}
      applyNight();
    });
    reader.addEventListener("click", function (e) { if (e.target === reader) closeReader(); });
    // Re-fit the pages when the window changes shape (tablet rotation).
    var rt;
    window.addEventListener("resize", function () {
      if (!pdfDoc || !reader.classList.contains("open")) return;
      clearTimeout(rt); rt = setTimeout(buildPages, 200);
    });
  }

  /* ---- QR modal (kiosk only) ---- */
  var qrm = document.getElementById("qrm");
  function openQR(file, title) {
    if (!qrm) return;
    var box = document.getElementById("qr-code");
    try {
      var qr = qrcode(0, "M");
      qr.addData(absUrl(file));
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
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeQR(); closeReader(); } });

  root.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var qrBtn = e.target.closest("button.qr");
    if (qrBtn) { openQR(qrBtn.dataset.file, qrBtn.dataset.title); return; }
    var v = e.target.closest("button.view");
    if (v) { openReader(v.dataset.file, v.dataset.title, v.dataset.desc); }
  });

  // Download through a Blob so the installed app actually saves the file
  // instead of opening it in a viewer the visitor cannot get back out of.
  function saveFile(url, name) {
    fetch(url).then(function (r) { if (!r.ok) throw 0; return r.blob(); }).then(function (blob) {
      var u = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = u; a.download = name || "document.pdf";
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 6000);
    }).catch(function () { window.open(url, "_blank"); });
  }
  document.addEventListener("click", function (e) {
    var dl = e.target.closest && e.target.closest("a.dl, #r-dl");
    if (!dl) return;
    var href = dl.getAttribute("href");
    if (!href || href === "#" || /^https?:\/\//i.test(href)) return;   // same-origin files only
    e.preventDefault();
    var name = dl.getAttribute("download") || href.split("/").pop().split(/[?#]/)[0] || "document.pdf";
    saveFile(href, name);
  });
})();
