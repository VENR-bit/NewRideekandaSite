/* Rideekanda — Dhamma Talks / retreat sessions renderer (shared EN + SI).
   Media lives on Google Drive; we lazily inject Drive /preview iframes for
   watch & listen and use drive.usercontent download URLs for downloads.
   Items render flexibly: Listen/Summary/guided appear only when present.
   UI strings come from window.RK_LABELS (English defaults below). */
(function () {
  var S = window.RK_SESSIONS || [];
  var L = Object.assign({
    session: "Session",
    watch: "Watch", listen: "Listen", summary: "Summary",
    download: "Download:", downloadWord: "Download",
    video: "Video", audio: "Audio", pdf: "Summary (PDF)",
    guidedTitle: "Guided meditation recordings",
    total: function (n, g) {
      return "<b>" + n + "</b> sessions · video, audio &amp; summary" +
        (g ? " · <b>" + g + "</b> guided recordings" : "");
    }
  }, window.RK_LABELS || {});

  function previewUrl(id) { return "https://drive.google.com/file/d/" + id + "/preview"; }
  function downloadUrl(id) { return "https://drive.usercontent.google.com/download?id=" + id + "&export=download&confirm=t"; }
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var IC = {
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>',
    audio:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 10v4M7 7v10M11 4v16M15 8v8M19 11v2"/></svg>',
    doc:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    dl:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>'
  };

  function card(s) {
    var sid = "ses-" + s.n;
    var eyebrow = s.day || (L.session + " " + s.n);

    var actions = '<button class="btn" data-act="video" data-id="' + s.video + '">' + IC.play + L.watch + '</button>';
    if (s.audio) actions += '<button class="btn ghost" data-act="audio" data-id="' + s.audio + '">' + IC.audio + L.listen + '</button>';
    if (s.pdf)   actions += '<button class="btn ghost" data-act="pdf" data-id="' + s.pdf + '">' + IC.doc + L.summary + '</button>';

    var dls = '<span class="lbl">' + L.download + '</span>';
    if (s.video) dls += '<a class="dl-link" href="' + downloadUrl(s.video) + '">' + IC.dl + L.video + '</a>';
    if (s.audio) dls += '<a class="dl-link" href="' + downloadUrl(s.audio) + '">' + IC.dl + L.audio + '</a>';
    if (s.pdf)   dls += '<a class="dl-link" href="' + downloadUrl(s.pdf) + '">' + IC.dl + L.pdf + '</a>';

    var guided = "";
    if (s.guided && s.guided.length) {
      guided = '<div class="ses__guided"><h4>' + L.guidedTitle + '</h4>' +
        s.guided.map(function (g) {
          return '<div class="guided">' +
            '<span class="guided__name">' + esc(g.label) + '</span>' +
            '<span class="guided__act">' +
              '<button class="btn ghost" data-act="audio" data-id="' + g.id + '">' + IC.audio + L.listen + '</button>' +
              '<a class="btn ghost" href="' + downloadUrl(g.id) + '">' + IC.dl + L.downloadWord + '</a>' +
            '</span>' +
          '</div>';
        }).join("") +
      '</div>';
    }

    return '<article class="ses" id="' + sid + '">' +
      '<div class="ses__head">' +
        '<div class="ses__num">' + s.n + '</div>' +
        '<div class="ses__meta">' +
          '<p class="ses__day">' + esc(eyebrow) + '</p>' +
          '<h2 class="ses__title">' + esc(s.title) + '</h2>' +
          (s.about ? '<p class="ses__about">' + esc(s.about) + '</p>' : '') +
        '</div>' +
      '</div>' +
      '<div class="ses__stage" data-stage></div>' +
      '<div class="ses__actions">' + actions + '</div>' +
      '<div class="ses__dl">' + dls + '</div>' +
      guided +
    '</article>';
  }

  var list = document.getElementById("sessions");
  list.innerHTML = S.map(card).join("");
  [].slice.call(list.children).forEach(function (el, k) {
    setTimeout(function () { el.classList.add("in"); }, 60 + k * 60);
  });

  var totalEl = document.getElementById("total");
  if (totalEl) {
    var guidedCount = S.reduce(function (a, s) { return a + (s.guided ? s.guided.length : 0); }, 0);
    totalEl.innerHTML = L.total(S.length, guidedCount);
  }

  function openStage(article, type, id) {
    var stage = article.querySelector("[data-stage]");
    var already = stage.classList.contains("is-open") && stage.dataset.cur === type + ":" + id;
    [].slice.call(article.querySelectorAll(".ses__actions .btn")).forEach(function (b) { b.classList.remove("is-active"); });
    if (already) {
      stage.classList.remove("is-open", "is-video", "is-audio", "is-pdf");
      stage.innerHTML = ""; stage.dataset.cur = "";
      return;
    }
    stage.className = "ses__stage is-open is-" + type;
    stage.dataset.cur = type + ":" + id;
    stage.innerHTML = '<iframe src="' + previewUrl(id) + '" allow="autoplay; encrypted-media; fullscreen" allowfullscreen loading="lazy"></iframe>';
    var r = stage.getBoundingClientRect();
    if (r.top < 70 || r.bottom > window.innerHeight) stage.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  list.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("button[data-act]");
    if (!btn) return;
    openStage(btn.closest(".ses"), btn.dataset.act, btn.dataset.id);
  });
})();
