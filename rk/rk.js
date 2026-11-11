/* ──────────────────────────────────────────────────────────────
   Rideekanda Forest Monastery — home page behaviour  ·  rk/rk.js
   GSAP (ScrollTrigger, SplitText) + Lenis. Everything degrades: with
   no JS, no GSAP or reduced motion the page is plain, complete HTML.
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var RM = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var FINE = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var lenis = null;

  if (RM || !hasGsap) root.classList.add("rm");

  /* ═════════ Time at the monastery ═════════ */
  var Sky = window.RKSky;
  function colomboHour() { return Sky ? Sky.colomboHour() : (new Date().getHours() + new Date().getMinutes() / 60); }
  function colomboDate() {            // "YYYY-MM-DD" at the monastery
    var d = new Date(Date.now() + 330 * 60000);
    return d.getUTCFullYear() + "-" + ("0" + (d.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + d.getUTCDate()).slice(-2);
  }
  function clock(h, snap) {           // 17.5 → "5.30 PM" (the site writes times with a dot)
    var m = Math.round(h * 60);
    if (snap) m = Math.round(m / snap) * snap;
    m = ((m % 1440) + 1440) % 1440;
    var hh = Math.floor(m / 60), mm = m % 60;
    var ap = hh >= 12 ? "PM" : "AM";
    var h12 = hh % 12; if (h12 === 0) h12 = 12;
    return h12 + "." + ("0" + mm).slice(-2) + " " + ap;
  }
  function hm(s) { var p = s.split(":"); return parseInt(p[0], 10) + parseInt(p[1], 10) / 60; }
  var ROWS = (window.RK_ROUTINE && window.RK_ROUTINE.rows) || [];
  function rowAt(h) {
    for (var i = 0; i < ROWS.length; i++) {
      var f = hm(ROWS[i].from), t = hm(ROWS[i].to);
      if (f < t ? (h >= f && h < t) : (h >= f || h < t)) return i;
    }
    return -1;
  }

  /* ═════════ Theme (same rule + storage key as the rest of the site) ═════════ */
  (function theme() {
    var KEY = "rk-home-theme", btn = $("#themeBtn");
    var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M3.5 3.5l1.8 1.8M18.7 18.7l1.8 1.8M2 12h2.5M19.5 12H22M3.5 20.5l1.8-1.8M18.7 5.3l1.8-1.8"/></svg>';
    var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.2A8 8 0 1 1 9.8 4 6.4 6.4 0 0 0 20 14.2z"/></svg>';
    function byTime() { var h = new Date().getHours(); return (h >= 6 && h < 18) ? "light" : "dark"; }
    function mode() { try { var m = localStorage.getItem(KEY); if (m === "light" || m === "dark") return m; } catch (e) {} return "auto"; }
    function now() { var m = mode(); return m === "auto" ? byTime() : m; }
    function paint() {
      var t = now();
      root.setAttribute("data-theme", t); root.setAttribute("data-theme-mode", mode());
      var meta = $('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", t === "dark" ? "#0c120e" : "#ece7da");
      if (!btn) return;
      btn.innerHTML = t === "dark" ? MOON : SUN;
      var l = t === "dark" ? "Dark theme — tap for light" : "Light theme — tap for dark";
      btn.title = l; btn.setAttribute("aria-label", l);
    }
    paint();
    if (btn) btn.addEventListener("click", function () {
      try { localStorage.setItem(KEY, now() === "dark" ? "light" : "dark"); } catch (e) {}
      paint();
    });
    setInterval(function () { if (mode() === "auto" && root.getAttribute("data-theme") !== byTime()) paint(); }, 60000);
  })();

  /* ═════════ Content built from the site's shared data ═════════ */
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MONTHS_L = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function ymd(s) { var p = s.split("-"); return { y: +p[0], m: +p[1] - 1, d: +p[2], t: Date.UTC(+p[0], +p[1] - 1, +p[2]) }; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  (function retreats() {
    var cal = window.RK_CALENDAR, list = $("#rtList");
    if (!cal || !list) return;
    var today = ymd(colomboDate());
    var up = (cal.retreats || []).filter(function (r) { return ymd(r.end).t >= today.t; })
      .sort(function (a, b) { return ymd(a.start).t - ymd(b.start).t; }).slice(0, 5);
    if (up.length) {
      var href = cal.bookingUrl || "book-your-stay/";
      list.innerHTML = up.map(function (r, i) {
        var a = ymd(r.start), b = ymd(r.end);
        var days = Math.round((a.t - today.t) / 864e5);
        var range = a.m === b.m
          ? a.d + " — " + b.d + " " + MONTHS[b.m]
          : a.d + " " + MONTHS[a.m] + " — " + b.d + " " + MONTHS[b.m];
        var chip = days <= 0 ? '<span class="rt-in soon">Under way</span>'
          : '<span class="rt-in' + (days <= 30 ? " soon" : "") + '">' + (days === 1 ? "Tomorrow" : "In " + days + " days") + "</span>";
        return '<li><a href="' + esc(href) + '" data-cursor="Book">' +
          '<span class="rt-n">' + ("0" + (i + 1)).slice(-2) + "</span>" +
          '<span class="rt-date">' + range + "<small>" + b.y + "</small></span>" +
          '<span class="rt-name">' + esc(r.name) + "</span>" + chip + '<i class="arr"></i></a></li>';
      }).join("");
    }
    var next = (cal.poya || []).filter(function (p) { return ymd(p.date).t >= today.t; })[0];
    if (next) {
      var p = ymd(next.date), wd = DAYS[new Date(p.t).getUTCDay()];
      $("#poyaText").innerHTML = "Next full moon — <strong>" + esc(next.name) + "</strong>, " + wd + " " + p.d + " " + MONTHS_L[p.m];
      $("#poya").hidden = false;
    }
  })();

  (function news() {
    var posts = window.NEWS_POSTS, grid = $("#nwGrid"), sec = $("#news");
    if (!posts || !posts.length || !grid) return;
    var top = posts.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 3);
    grid.innerHTML = top.map(function (p) {
      var d = ymd(p.date);
      // The news page keeps a light thumbnail of every lead photo; fall back to the full one.
      var full = p.image ? "news-and-events/assets/" + esc(p.image) : "";
      var thumb = p.image ? "news-and-events/assets/thumbs/" + esc(p.image.replace(/\.\w+$/, ".jpg")) : "";
      var img = p.image ? '<figure><img src="' + thumb + '" data-full="' + full + '" alt="" loading="lazy" decoding="async" ' +
        'onerror="if(this.src.indexOf(this.dataset.full)<0)this.src=this.dataset.full" /></figure>' : "";
      return '<a class="nw-card reveal" href="news-and-events/">' + img +
        '<p class="nw-meta"><b>' + esc(p.type || "News") + "</b><span>" + d.d + " " + MONTHS_L[d.m] + " " + d.y + "</span></p>" +
        "<h3>" + esc(p.title) + "</h3><p>" + esc(p.excerpt || "") + "</p></a>";
    }).join("");
    sec.hidden = false;
  })();

  var VOICES = [
    { n: "Jacob A.", t: "As soon as I arrived I felt an incredibly peaceful and harmonious atmosphere here. The forest itself feels alive with practice." },
    { n: "Valesca N.", t: "Set on top of a mountain and surrounded by pure nature, the place itself is already breathtaking. Every day felt like a small awakening." },
    { n: "Hugo Z.", t: "I came with a busy mind and left with a quiet one. The schedule is rigorous but compassionate." },
    { n: "Nisha C.", t: "The Venerable Bhante guided us with such warmth and clarity that even first-time meditators felt at home." },
    { n: "Pasindu R.", t: "The forest setting, the simplicity of the kuti, and the rhythm of the day all support the practice in a way I have not experienced elsewhere." },
    { n: "Anika P.", t: "I came for a weekend and ended up staying the full week. There is something here that you cannot find in a city retreat." }
  ];
  var vStage = $("#vStage");
  if (vStage) {
    vStage.innerHTML = VOICES.map(function (v, i) {
      return '<figure class="v-item' + (i === 0 ? " is-on" : "") + '"><blockquote>' + esc(v.t) + "</blockquote>" +
        "<footer><b>" + v.n.charAt(0) + "</b><span><strong>" + esc(v.n) + "</strong> · Google review</span></footer></figure>";
    }).join("");
    $("#vTot").textContent = ("0" + VOICES.length).slice(-2);
  }

  /* Dhammapada · Citta Vagga (the Mind, verses 33–43) — a different verse each visit. */
  (function verse() {
    var V = [
      [33, ["Phandanaṃ capalaṃ cittaṃ, dūrakkhaṃ dunnivārayaṃ;", "Ujuṃ karoti medhāvī, usukārova tejanaṃ."], "The restless, agitated mind, hard to guard and hard to restrain — the wise one straightens it, as a fletcher straightens an arrow."],
      [34, ["Vārijova thale khitto, okamokata ubbhato;", "Pariphandatidaṃ cittaṃ, māradheyyaṃ pahātave."], "Like a fish pulled from its watery home and cast on dry ground, this mind quivers and thrashes to escape the realm of Māra."],
      [35, ["Dunniggahassa lahuno, yatthakāmanipātino;", "Cittassa damatho sādhu, cittaṃ dantaṃ sukhāvahaṃ."], "Hard to subdue, swift, alighting wherever it wishes — good it is to tame the mind; a tamed mind brings happiness."],
      [36, ["Sududdasaṃ sunipuṇaṃ, yatthakāmanipātinaṃ;", "Cittaṃ rakkhetha medhāvī, cittaṃ guttaṃ sukhāvahaṃ."], "So subtle and hard to see, alighting wherever it wishes — let the wise guard the mind; a guarded mind brings happiness."],
      [37, ["Dūraṅgamaṃ ekacaraṃ, asarīraṃ guhāsayaṃ;", "Ye cittaṃ saṃyamissanti, mokkhanti mārabandhanā."], "Faring far, wandering alone, bodiless, dwelling in the cave of the heart — those who restrain the mind are freed from the bonds of Māra."],
      [38, ["Anavaṭṭhitacittassa, saddhammaṃ avijānato;", "Pariplavapasādassa, paññā na paripūrati."], "He whose mind is unsteady, who does not know the true Dhamma, whose confidence wavers — his wisdom never comes to fullness."],
      [39, ["Anavassutacittassa, ananvāhatacetaso;", "Puññapāpapahīnassa, natthi jāgarato bhayaṃ."], "He whose mind is free of craving and unassailed by hatred, who has risen above good and evil — for that wakeful one there is no fear."],
      [40, ["Kumbhūpamaṃ kāyamimaṃ viditvā, nagarūpamaṃ cittamidaṃ ṭhapetvā;", "Yodhetha māraṃ paññāyudhena, jitañca rakkhe anivesano siyā."], "Knowing this body to be fragile as a clay pot, making the mind firm as a fortress, fight Māra with the sword of wisdom; guard your gain, clinging to nothing."],
      [41, ["Aciraṃ vatayaṃ kāyo, pathaviṃ adhisessati;", "Chuddho apetaviññāṇo, niratthaṃva kaliṅgaraṃ."], "Before long, alas, this body will lie upon the earth — cast aside, devoid of consciousness, like a useless log."],
      [42, ["Diso disaṃ yaṃ taṃ kayirā, verī vā pana verinaṃ;", "Micchāpaṇihitaṃ cittaṃ, pāpiyo naṃ tato kare."], "Whatever harm a foe may do to a foe, or a hater to one he hates, a wrongly directed mind does to oneself far greater harm."],
      [43, ["Na taṃ mātā pitā kayirā, aññe vāpi ca ñātakā;", "Sammāpaṇihitaṃ cittaṃ, seyyaso naṃ tato kare."], "Neither mother, father, nor any other kin can do one the good that a rightly directed mind can do."]
    ];
    var v = V[Math.floor(Math.random() * V.length)];
    var pali = $("#versePali"), en = $("#verseEn"), cite = $("#verseCite");
    if (pali) pali.innerHTML = v[1].map(esc).join("<br>");
    if (en) en.textContent = v[2];
    if (cite) cite.textContent = "Dhammapada · Citta Vagga · Verse " + v[0];
  })();

  /* Gallery ribbon — two rows drifting in opposite directions. */
  (function ribbonBuild() {
    var rows = $$(".rb-row"); if (!rows.length) return;
    var shape = { 7: "wide", 8: "wide", 11: "wide", 15: "wide", 16: "tall" };
    rows.forEach(function (row, r) {
      var h = "";
      for (var i = r; i < 20; i += 2) {
        h += '<figure class="' + (shape[i] || "") + '"><img src="rk/img/m' + ("0" + i).slice(-2) + '.webp" alt="" loading="lazy" decoding="async" /></figure>';
      }
      row.innerHTML = h + h;   // doubled so the loop is seamless
    });
  })();

  /* Day ticks */
  var dayTicks = $("#dayTicks");
  if (dayTicks && ROWS.length) {
    dayTicks.innerHTML = ROWS.map(function (r, i) {
      return '<li data-i="' + i + '" title="' + esc(r.t.en + " — " + r.a.en) + '">' + clock(hm(r.from)) + "</li>";
    }).join("");
  }

  /* "Now on the hill" */
  (function nowChip() {
    var t = $("#nowTime"), a = $("#nowAct"); if (!t) return;
    function tick() {
      var h = colomboHour(), i = rowAt(h);
      t.textContent = clock(h);
      if (a) a.textContent = i >= 0 ? ROWS[i].a.en : "";
      $$("#dayTicks li").forEach(function (li, k) { li.classList.toggle("is-now", k === i); });
    }
    tick(); setInterval(tick, 15000);
  })();

  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ═════════ Sky ═════════ */
  var skyOK = false;
  if (Sky) {
    skyOK = Sky.init($("#sky"));
    // ?hour=17.8 pins the sky to an hour — handy for previewing dawn, dusk and night.
    var forced = parseFloat(new URLSearchParams(location.search).get("hour"));
    if (!isNaN(forced)) colomboHour = function () { return forced; };
    if (skyOK) Sky.setHour(colomboHour(), true);
  }
  if (!skyOK) root.classList.add("no-webgl");
  var skyMode = "hero";   // "hero" follows the real clock; "day" is scrubbed by scroll
  if (skyOK) {
    setInterval(function () { if (skyMode === "hero") Sky.setHour(colomboHour()); }, 20000);
    if (FINE) window.addEventListener("pointermove", function (e) {
      Sky.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    }, { passive: true });
  }

  /* ═════════ The eagle ═════════
     A black eagle circling slowly on a thermal above the ridges. It keeps to
     daylight, banks as it turns, and shows its full span only when it is
     flying toward or away from the viewer. */
  (function eagle() {
    var el = $("#skyEagle"); if (!el || !skyOK) return;
    var t0 = performance.now(), raf = 0;
    function frame(now) {
      raf = 0;
      var st = Sky.state();
      if (!st.active) { raf = requestAnimationFrame(frame); return; }
      var t = RM ? 1.1 : (now - t0) / 1000;
      var W = window.innerWidth, H = window.innerHeight, small = W < 820;
      var a = t * 0.165;                                   // one circle ≈ 38 s
      var drift = Math.sin(t * 0.021) * (small ? 0.05 : 0.09);
      var cx = (small ? 0.64 : 0.70) + drift, cy = (small ? 0.20 : 0.25) + Math.sin(t * 0.033) * 0.03;
      var x = cx * W + Math.cos(a) * W * (small ? 0.2 : 0.13);
      var y = cy * H + Math.sin(a) * H * 0.055 - st.scroll * H * 0.16;
      var side = Math.abs(Math.sin(a));                    // 1 = crossing sideways
      var near = 0.5 + 0.5 * Math.sin(a);                  // lower on the circle = nearer
      var sc = 0.78 + near * 0.42;
      var night = Sky.sample(st.hour).night;
      el.style.opacity = (0.9 * (1 - night)).toFixed(3);
      el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) translate(-50%,-50%) rotate(" +
        (Math.sin(a) * -16 + Math.sin(t * 0.7) * 2).toFixed(2) + "deg) scale(" + (sc * (1 - side * 0.42)).toFixed(3) + "," + sc.toFixed(3) + ")";
      if (!RM) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    if (RM) window.addEventListener("resize", function () { if (!raf) raf = requestAnimationFrame(frame); });
  })();

  /* ═════════ Kiosk idle return (ported from eco-nav.js) ═════════
     In the installed kiosk app, an idle page returns to the dashboard so the
     next visitor starts fresh. Normal browser visitors are never redirected. */
  (function kiosk() {
    var kp = new URLSearchParams(location.search).get("kiosk"), mm = window.matchMedia;
    var standalone = (mm && (mm("(display-mode: standalone)").matches || mm("(display-mode: fullscreen)").matches ||
      mm("(display-mode: minimal-ui)").matches)) || window.navigator.standalone === true;
    var remembered = false;
    try { remembered = localStorage.getItem("rk-kiosk") === "1"; } catch (e) {}
    if (!(kp === "1" || (kp !== "0" && (standalone || remembered)))) return;
    var timer;
    function reset() { clearTimeout(timer); timer = setTimeout(function () { location.href = "dashboard/"; }, 120000); }
    ["pointerdown", "touchstart", "mousemove", "keydown", "scroll", "wheel", "click"].forEach(function (ev) {
      window.addEventListener(ev, reset, { passive: true });
    });
    reset();
  })();

  /* ═════════ Forest ambience (Web Audio, generated — no files) ═════════ */
  (function sound() {
    var btn = $("#soundBtn"); if (!btn) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { btn.hidden = true; return; }
    var ctx, master, on = false;
    function build() {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      // wind in the canopy: brown noise through a slowly breathing low-pass
      var len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), last = 0;
      for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
      var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 480; lp.Q.value = 0.4;
      var wind = ctx.createGain(); wind.gain.value = 0.5;
      var lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
      var lfoG = ctx.createGain(); lfoG.gain.value = 240; lfo.connect(lfoG); lfoG.connect(lp.frequency);
      var lfo2 = ctx.createOscillator(); lfo2.frequency.value = 0.045;
      var lfo2G = ctx.createGain(); lfo2G.gain.value = 0.22; lfo2.connect(lfo2G); lfo2G.connect(wind.gain);
      src.connect(lp); lp.connect(wind); wind.connect(master);
      src.start(); lfo.start(); lfo2.start();
    }
    function bowl() {   // one soft strike of a singing bowl when the sound comes on
      var t = ctx.currentTime;
      [[196, 0.10, 9], [392.6, 0.045, 7], [589.5, 0.022, 5], [1047, 0.008, 3]].forEach(function (p) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = p[0];
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(p[1], t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + p[2] + 0.1);
      });
    }
    btn.addEventListener("click", function () {
      on = !on;
      if (on && !ctx) build();
      if (ctx.state === "suspended") ctx.resume();
      var t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(on ? 0.16 : 0, t + (on ? 2.5 : 0.8));
      if (on) bowl();
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", "Forest ambience: " + (on ? "on" : "off"));
    });
    document.addEventListener("visibilitychange", function () {
      if (!ctx) return;
      if (document.hidden) ctx.suspend(); else if (on) ctx.resume();
    });
  })();

  /* ═════════ Without GSAP: reveal everything and stop here ═════════ */
  var loader = $("#loader");
  if (!hasGsap) {
    if (loader) loader.remove();
    $$(".reveal").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
    return;
  }

  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger, SplitText = window.SplitText;
  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  var EASE = "expo.out";

  /* ═════════ Smooth scroll ═════════ */
  if (window.Lenis && !RM) {
    lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  function scrollTo(target, opts) {
    if (lenis) lenis.scrollTo(target, opts || { duration: 1.6 });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: RM ? "auto" : "smooth" });
    else if (target && target.scrollIntoView) target.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href"), el = id.length > 1 ? $(id) : null;
      if (!el) return;
      e.preventDefault();
      scrollTo(id === "#top" ? 0 : el);
    });
  });

  /* ═════════ Cursor & magnetic buttons ═════════ */
  if (FINE && !RM) {
    var cur = $("#cursor"), curLabel = $("span", cur);
    var cx = gsap.quickTo(cur, "x", { duration: 0.35, ease: "power3" }), cy = gsap.quickTo(cur, "y", { duration: 0.35, ease: "power3" });
    cur.classList.add("is-hidden");
    window.addEventListener("pointermove", function (e) { cx(e.clientX); cy(e.clientY); cur.classList.remove("is-hidden"); }, { passive: true });
    document.addEventListener("pointerleave", function () { cur.classList.add("is-hidden"); });
    document.addEventListener("pointerover", function (e) {
      var lab = e.target.closest && e.target.closest("[data-cursor]");
      var link = e.target.closest && e.target.closest("a, button, .day-ticks li");
      cur.classList.toggle("is-label", !!lab);
      cur.classList.toggle("is-link", !lab && !!link);
      if (lab) curLabel.textContent = lab.getAttribute("data-cursor");
    });
    $$("[data-magnet]").forEach(function (el) {
      var mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" }), my = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.28); my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      el.addEventListener("pointerleave", function () { gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, .4)" }); });
    });
    $$("[data-tilt]").forEach(function (el) {
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        gsap.to(el, { rotationY: ((e.clientX - r.left) / r.width - 0.5) * 7, rotationX: -((e.clientY - r.top) / r.height - 0.5) * 7, duration: 0.8 });
      });
      el.addEventListener("pointerleave", function () { gsap.to(el, { rotationX: 0, rotationY: 0, duration: 1.2 }); });
    });
  }

  /* ═════════ Menu ═════════ */
  (function menu() {
    var btn = $("#menuBtn"), menu = $("#menu"); if (!btn || !menu) return;
    var bg = $(".menu-bg", menu), open = false, tl;
    var big = $$(".menu-big a", menu), small = $$(".menu-side .label, .menu-col li, .menu-foot", menu);
    var prev = $(".menu-preview", menu), prevImg = $("img", prev);
    function set(state) {
      open = state;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      root.classList.toggle("menu-open", open);
      if (tl) tl.kill();
      if (open) {
        menu.hidden = false;
        if (lenis) lenis.stop(); else document.body.style.overflow = "hidden";
        tl = gsap.timeline()
          .fromTo(bg, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: RM ? 0.01 : 0.9, ease: "expo.inOut" })
          .fromTo(big, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: EASE }, RM ? 0 : 0.35)
          .fromTo(small, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.02 }, RM ? 0 : 0.5);
      } else {
        prev.classList.remove("on");
        tl = gsap.timeline({ onComplete: function () { menu.hidden = true; } })
          .to([big, small], { opacity: 0, duration: 0.25 })
          .to(bg, { clipPath: "inset(100% 0 0 0)", duration: RM ? 0.01 : 0.7, ease: "expo.inOut" }, 0.05)
          .set(big, { opacity: 1 });
        if (lenis) lenis.start(); else document.body.style.overflow = "";
      }
    }
    btn.addEventListener("click", function () { set(!open); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) { set(false); btn.focus(); } });
    big.forEach(function (a) {
      a.addEventListener("pointerenter", function () {
        var src = a.getAttribute("data-img"); if (!src) return;
        prevImg.src = src; prev.classList.add("on");
      });
    });
    $(".menu-big", menu).addEventListener("pointerleave", function () { prev.classList.remove("on"); });
  })();

  /* ═════════ Leaving the page: a soft curtain ═════════ */
  (function leave() {
    var veil = $("#veil"); if (!veil || RM) return;
    gsap.set(veil, { y: 0, yPercent: 101 });
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || a.target === "_blank" || a.hasAttribute("download") || /^(mailto|tel|javascript):/i.test(href)) return;
      var url; try { url = new URL(href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      e.preventDefault();
      gsap.fromTo(veil, { yPercent: 101 }, { yPercent: 0, duration: 0.6, ease: "expo.inOut", overwrite: true, onComplete: function () { location.href = url.href; } });
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) gsap.set(veil, { yPercent: 101 }); });
  })();

  /* ═════════ Scroll choreography ═════════ */
  function build() {
    var mm = gsap.matchMedia();

    /* The two pinned chapters are set up first (see the call to early() below):
       ScrollTrigger measures in creation order, and everything after a pin has
       to be measured with that pin's extra scroll length already in place. */
    function early() {
    /* — header — */
    var hd = $("#hd"), lastY = 0, toneTrigs = null;
    function hdTone() { hd.classList.toggle("is-solid", !!toneTrigs && !toneTrigs.some(function (t) { return t.isActive; })); }
    toneTrigs = $$("[data-sky]").map(function (sec) {
      return ScrollTrigger.create({ trigger: sec, start: "top top+=70", end: "bottom top+=70", onToggle: hdTone, onRefresh: hdTone });
    });
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) {
        var y = self.scroll();
        if (y > window.innerHeight * 0.6 && y > lastY + 4) hd.classList.add("is-hidden");
        else if (y < lastY - 4 || y < window.innerHeight * 0.6) hd.classList.remove("is-hidden");
        lastY = y;
      }
    });

    /* — sky visibility: render only while a window onto it is on screen — */
    if (skyOK) {
      var visTrigs = null;
      var skyVis = function () { Sky.setActive(!visTrigs || visTrigs.some(function (t) { return t.isActive; })); };
      visTrigs = $$("[data-sky]").map(function (sec) {
        return ScrollTrigger.create({ trigger: sec, start: "top bottom", end: "bottom top", onToggle: skyVis, onRefresh: skyVis });
      });
    }

    /* — hero — */
    var heroTl = gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true,
      onUpdate: function (self) { if (skyOK && skyMode === "hero") Sky.setScroll(self.progress * 0.55); } } });
    if (!RM) {
      heroTl.to(".hero-mid", { yPercent: -22, opacity: 0, ease: "none" }, 0)
            .to(".hero-top, .hero-foot", { opacity: 0, ease: "none", duration: 0.4 }, 0);
    }

    /* — headings: lines rise out of their own baseline — */
    if (SplitText && !RM) {
      $$(".split").forEach(function (el) {
        SplitText.create(el, {
          type: "lines", mask: "lines", linesClass: "split-line", autoSplit: true,
          onSplit: function (self) {
            return gsap.from(self.lines, { yPercent: 112, duration: 1.3, stagger: 0.11, ease: EASE,
              scrollTrigger: { trigger: el, start: "top 86%", once: true } });
          }
        });
      });
      /* the statement lights up word by word as it is read */
      var st = $("#statement");
      if (st) SplitText.create(st, {
        type: "words", wordsClass: "word", autoSplit: true,
        onSplit: function (self) {
          return gsap.to(self.words, { opacity: 1, ease: "none", stagger: 0.1,
            scrollTrigger: { trigger: st, start: "top 78%", end: "bottom 42%", scrub: 0.6 } });
        }
      });
    } else {
      $$("#statement").forEach(function (el) { el.style.opacity = 1; });
    }

    /* — generic reveals — */
    ScrollTrigger.batch(".reveal", {
      start: "top 90%", once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.2, stagger: 0.09, ease: EASE, overwrite: true }); }
    });

    /* — image frames: unveil, then drift at their own pace — */
    $$(".clip").forEach(function (fig) {
      var img = $("img", fig);
      if (!RM) {
        gsap.fromTo(fig, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut",
          scrollTrigger: { trigger: fig, start: "top 88%", once: true } });
        if (img && !fig.closest(".life-card, .t-card")) gsap.fromTo(img, { scale: 1.28 }, { scale: 1.08, duration: 2, ease: EASE,
          scrollTrigger: { trigger: fig, start: "top 88%", once: true } });
      }
    });
    mm.add("(min-width: 821px) and (prefers-reduced-motion: no-preference)", function () {
      $$("[data-speed]").forEach(function (el) {
        var s = parseFloat(el.getAttribute("data-speed")) || 0;
        gsap.fromTo(el, { y: function () { return window.innerHeight * s; } }, { y: function () { return -window.innerHeight * s; }, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
      });
    });

    /* — counters — */
    $$("[data-count]").forEach(function (el) {
      var end = parseFloat(el.getAttribute("data-count")), dec = parseInt(el.getAttribute("data-dec") || "0", 10);
      var plain = el.hasAttribute("data-plain"), o = { v: plain ? end - 40 : 0 };
      function fmt(v) { return dec ? v.toFixed(dec) : (plain ? String(Math.round(v)) : Math.round(v).toLocaleString("en-US")); }
      if (RM) return;
      el.textContent = fmt(o.v);
      gsap.to(o, { v: end, duration: 2.2, ease: "power2.out", onUpdate: function () { el.textContent = fmt(o.v); },
        scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });

    }

    /* — 02 · the practice: a sideways walk — */
    mm.add("(min-width: 821px) and (prefers-reduced-motion: no-preference)", function () {
      var track = $("#pathTrack"), bar = $("#pathBar"); if (!track) return;
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var walk = gsap.to(track, { x: function () { return -dist(); }, ease: "none",
        scrollTrigger: { trigger: ".path", pin: true, scrub: 0.8, start: "top top", end: function () { return "+=" + dist(); },
          invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (self) { if (bar) bar.style.transform = "scaleX(" + self.progress + ")"; } } });
      $$(".path-step").forEach(function (panel) {
        gsap.fromTo($(".path-img img", panel), { xPercent: -7 }, { xPercent: 7, ease: "none",
          scrollTrigger: { containerAnimation: walk, trigger: panel, start: "left right", end: "right left", scrub: true } });
        gsap.from($$(".path-copy > *", panel), { y: 50, opacity: 0, duration: 1.1, stagger: 0.1, ease: EASE,
          scrollTrigger: { containerAnimation: walk, trigger: panel, start: "left 68%", toggleActions: "play none none reverse" } });
      });
      gsap.from(".path-end > *", { y: 50, opacity: 0, duration: 1.1, stagger: 0.12, ease: EASE,
        scrollTrigger: { containerAnimation: walk, trigger: ".path-end", start: "left 70%", toggleActions: "play none none reverse" } });
    });
    mm.add("(max-width: 820px), (prefers-reduced-motion: reduce)", function () {
      if (RM) return;
      $$(".path-panel").forEach(function (p) {
        gsap.from(p.children, { y: 40, opacity: 0, duration: 1.1, stagger: 0.1, ease: EASE, scrollTrigger: { trigger: p, start: "top 78%", once: true } });
      });
    });

    /* — 03 · a day on the hill: scroll turns the sky — */
    (function day() {
      var sec = $("#day"); if (!sec || !ROWS.length) return;
      var H0 = 5.5, H1 = 22.5, cur = -1, lastClock = "";
      var tEl = $("#dayTime"), aEl = $("#dayAct"), sEl = $("#daySi"), ticks = $$("#dayTicks li");
      function show(p) {
        var h = H0 + (H1 - H0) * p, i = rowAt(h), c = clock(h, 5);
        if (c !== lastClock) { tEl.textContent = c; lastClock = c; }
        if (i !== cur && i >= 0) {
          cur = i;
          ticks.forEach(function (li, k) { li.classList.toggle("is-on", k <= i); });
          if (RM) { aEl.textContent = ROWS[i].a.en; sEl.textContent = ROWS[i].a.si; }
          else gsap.timeline({ overwrite: true })
            .to([aEl, sEl], { y: -14, opacity: 0, duration: 0.25, ease: "power2.in" })
            .add(function () { aEl.textContent = ROWS[i].a.en; sEl.textContent = ROWS[i].a.si; })
            .fromTo([aEl, sEl], { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: EASE });
        }
        if (skyOK && skyMode === "day") Sky.setHour(h);
      }
      var trig = ScrollTrigger.create({
        trigger: sec, pin: ".day-pin", start: "top top", end: "+=320%", scrub: true, anticipatePin: 1,
        onUpdate: function (self) { show(self.progress); },
        onToggle: function (self) {
          skyMode = self.isActive ? "day" : "hero";
          if (!skyOK) return;
          if (self.isActive) { Sky.setScroll(0); show(self.progress); }
        }
      });
      // approaching from above or below: have the right sky waiting before the pin engages
      ScrollTrigger.create({
        trigger: sec, start: "top bottom", end: "bottom top",
        onEnter: function () { if (skyOK) { skyMode = "day"; Sky.setScroll(0); Sky.setHour(H0, true); } },
        onEnterBack: function () { if (skyOK) { skyMode = "day"; Sky.setScroll(0); Sky.setHour(H1, true); } },
        onLeave: function () { skyMode = "hero"; },
        onLeaveBack: function () { skyMode = "hero"; if (skyOK) Sky.setHour(colomboHour(), true); }
      });
      ticks.forEach(function (li) {
        li.addEventListener("click", function () {
          var h = hm(ROWS[+li.getAttribute("data-i")].from) + 0.05;
          var p = Math.max(0, Math.min(1, (h - H0) / (H1 - H0)));
          scrollTo(trig.start + (trig.end - trig.start) * p, { duration: 1.4 });
        });
      });
      show(0);
    })();

    early();

    /* — retreat rows — */
    if (!RM) gsap.from("#rtList li", { y: 40, opacity: 0, duration: 1.1, stagger: 0.09, ease: EASE,
      scrollTrigger: { trigger: "#rtList", start: "top 84%", once: true } });

    /* — 07 · explore: a picture follows the pointer — */
    (function explore() {
      var list = $("#xList"), fl = $("#xFloat"); if (!list) return;
      if (!RM) gsap.from("#xList li", { y: 36, opacity: 0, duration: 1, stagger: 0.06, ease: EASE, scrollTrigger: { trigger: list, start: "top 84%", once: true } });
      if (!FINE || !fl) return;
      var img = $("img", fl), fx = gsap.quickTo(fl, "x", { duration: 0.7, ease: "power3" }), fy = gsap.quickTo(fl, "y", { duration: 0.7, ease: "power3" });
      var rot = gsap.quickTo(fl, "rotation", { duration: 0.9, ease: "power3" }), lx = 0, settle;
      $$("a", list).forEach(function (a) {
        var src = a.getAttribute("data-img"); if (src) { var pre = new Image(); pre.src = src; }
        a.addEventListener("pointerenter", function () { if (src) img.src = src; fl.classList.add("on"); });
      });
      list.addEventListener("pointermove", function (e) {
        var w = fl.offsetWidth, hh = fl.offsetHeight;
        var x = Math.min(window.innerWidth - w - 16, e.clientX + 28), y = Math.max(16, Math.min(window.innerHeight - hh - 16, e.clientY - hh / 2));
        fx(x); fy(y); rot(Math.max(-8, Math.min(8, (e.clientX - lx) * 0.5))); lx = e.clientX;
        clearTimeout(settle); settle = setTimeout(function () { rot(0); }, 140);
      });
      list.addEventListener("pointerleave", function () { fl.classList.remove("on"); rot(0); });
      window.addEventListener("scroll", function () { if (fl.classList.contains("on") && !list.matches(":hover")) fl.classList.remove("on"); }, { passive: true });
    })();

    /* — ribbon: drifts on its own, hurries with the scroll — */
    (function ribbon() {
      var rows = $$(".rb-row"); if (!rows.length || RM) return;
      var state = rows.map(function (row) { return { el: row, dir: parseFloat(row.getAttribute("data-dir")) || -1, x: 0, half: 0 }; });
      function measure() { state.forEach(function (s) { s.half = s.el.scrollWidth / 2; if (s.dir > 0 && s.x === 0) s.x = -s.half; }); }
      measure(); window.addEventListener("resize", measure); window.addEventListener("load", measure);
      var vis = false, vel = 0;
      ScrollTrigger.create({ trigger: "#ribbon", start: "top bottom", end: "bottom top", onToggle: function (self) { vis = self.isActive; if (vis) measure(); } });
      gsap.ticker.add(function (t, dt) {
        if (!vis) return;
        var v = lenis ? lenis.velocity : 0;
        vel += (v - vel) * 0.1;
        state.forEach(function (s) {
          if (!s.half) return;
          s.x += s.dir * (0.035 * dt + Math.abs(vel) * 0.5);
          if (s.x <= -s.half) s.x += s.half;
          if (s.x > 0) s.x -= s.half;
          s.el.style.transform = "translate3d(" + s.x.toFixed(2) + "px,0,0) skewX(" + Math.max(-6, Math.min(6, vel * -0.12)).toFixed(2) + "deg)";
        });
      });
      gsap.from(".rb-link", { scale: 0.6, opacity: 0, duration: 1.2, ease: "elastic.out(1, .6)", scrollTrigger: { trigger: "#ribbon", start: "top 60%", once: true } });
    })();

    /* — 08 · voices — */
    (function voices() {
      var items = $$(".v-item"); if (items.length < 2) return;
      var i = 0, busy = false, timer, nowEl = $("#vNow");
      function go(n) {
        if (busy) return; busy = true;
        var a = items[i]; i = (n + items.length) % items.length; var b = items[i];
        nowEl.textContent = ("0" + (i + 1)).slice(-2);
        b.classList.add("is-on");
        gsap.timeline({ onComplete: function () { a.classList.remove("is-on"); gsap.set(a, { clearProps: "all" }); busy = false; } })
          .to(a, { opacity: 0, y: -24, duration: RM ? 0.01 : 0.45, ease: "power2.in" })
          .fromTo(b, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: RM ? 0.01 : 0.9, ease: EASE });
        arm();
      }
      function arm() { clearInterval(timer); if (!RM) timer = setInterval(function () { if (!document.hidden && inView) go(i + 1); }, 7000); }
      var inView = false;
      ScrollTrigger.create({ trigger: "#voices", start: "top 70%", end: "bottom 20%", onToggle: function (s) { inView = s.isActive; } });
      $("#vNext").addEventListener("click", function () { go(i + 1); });
      $("#vPrev").addEventListener("click", function () { go(i - 1); });
      $("#vStage").addEventListener("pointerenter", function () { clearInterval(timer); });
      $("#vStage").addEventListener("pointerleave", arm);
      arm();
    })();

    /* — verse: the circle breathes, four seconds in and six out — */
    (function breath() {
      var word = $("#breathWord"), ring = $(".breath i"); if (!word || !ring || RM) return;
      var t;
      function cycle() { word.textContent = "Breathe in"; clearTimeout(t); t = setTimeout(function () { word.textContent = "Breathe out"; }, 4000); }
      ring.addEventListener("animationiteration", cycle); cycle();
      gsap.from(".verse-in > *", { y: 40, opacity: 0, duration: 1.4, stagger: 0.18, ease: EASE, scrollTrigger: { trigger: "#verse", start: "top 55%", once: true } });
      gsap.fromTo(".breath", { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: "#verse", start: "top bottom", end: "top 20%", scrub: true } });
    })();

    /* — 09 · projects rail: drag to browse — */
    (function rail() {
      var el = $("#pjRail"); if (!el) return;
      if (!RM) gsap.from(".pj-card", { x: 80, opacity: 0, duration: 1.2, stagger: 0.08, ease: EASE, scrollTrigger: { trigger: el, start: "top 84%", once: true } });
      var down = false, sx = 0, sl = 0, moved = 0, v = 0, lx = 0, raf;
      el.addEventListener("pointerdown", function (e) {
        if (e.pointerType !== "mouse" || e.button) return;
        down = true; moved = 0; sx = lx = e.clientX; sl = el.scrollLeft; v = 0; cancelAnimationFrame(raf);
      });
      window.addEventListener("pointermove", function (e) {
        if (!down) return;
        var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
        if (moved > 6) el.classList.add("is-drag");
        el.scrollLeft = sl - dx; v = e.clientX - lx; lx = e.clientX;
      });
      window.addEventListener("pointerup", function () {
        if (!down) return; down = false;
        (function glide() { if (Math.abs(v) < 0.4) { el.classList.remove("is-drag"); return; } el.scrollLeft -= v; v *= 0.93; raf = requestAnimationFrame(glide); })();
      });
      el.addEventListener("click", function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
      el.addEventListener("dragstart", function (e) { e.preventDefault(); });
    })();

    /* — visit + footer — */
    if (!RM) {
      gsap.fromTo(".visit-bg img", { yPercent: -8, scale: 1.08 }, { yPercent: 8, scale: 1.08, ease: "none",
        scrollTrigger: { trigger: ".visit", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.from(".ft-word span", { yPercent: 70, ease: "none", scrollTrigger: { trigger: ".ft", start: "top bottom", end: "bottom bottom", scrub: 0.6 } });
    }

    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  /* ═════════ Intro ═════════ */
  function intro() {
    mark("intro");
    if (lenis) lenis.start();
    if (RM) { gsap.set(".hero-mid > *, .hero-top, .hero-foot", { opacity: 1 }); return; }
    var chars = [];
    if (SplitText) chars = SplitText.create(".ht-1", { type: "chars", charsClass: "char" }).chars;
    var tl = gsap.timeline({ defaults: { ease: EASE } });
    if (chars.length) tl.from(chars, { yPercent: 55, opacity: 0, filter: "blur(14px)", duration: 1.5, stagger: { each: 0.04, from: "center" } }, 0);
    else tl.from(".ht-1", { y: 60, opacity: 0, duration: 1.6 }, 0);
    tl.from(".ht-2", { y: 40, opacity: 0, filter: "blur(8px)", duration: 1.3 }, 0.3)
      .from(".hero-si", { y: 20, opacity: 0, duration: 1.1 }, 0.2)
      .from(".hero-lead", { y: 24, opacity: 0, duration: 1.1 }, 0.5)
      .from(".hero-cta > *", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.6)
      .from(".hero-top > *, .hero-foot > *", { opacity: 0, duration: 1.2, stagger: 0.06 }, 0.7)
      .from("#hd", { opacity: 0, duration: 1.2 }, 0.4);
  }

  function start() {
    try { build(); } catch (e) { if (window.console) console.error("[rk] build failed:", e); root.classList.add("rm"); }
    if (!loader) { intro(); return; }
    var o = { v: 0 }, bar = $("#loaderBar"), num = $("#loaderNum");
    gsap.timeline({ onComplete: function () { loader.remove(); } })
      .to(o, { v: 100, duration: RM ? 0.1 : 1.05, ease: "power2.inOut", onUpdate: function () {
        if (bar) bar.style.transform = "scaleX(" + (o.v / 100) + ")"; if (num) num.textContent = Math.round(o.v);
      } })
      .to(".loader-in", { opacity: 0, y: -20, duration: 0.35, ease: "power2.in" }, ">-0.1")
      .to(loader, { yPercent: -100, duration: RM ? 0.1 : 0.95, ease: "expo.inOut" }, ">-0.05")
      .add(intro, "<0.3");
  }

  // Wait for the web fonts (line breaks depend on them), but never for long.
  var began = false;
  function mark(n) { try { performance.mark("rk:" + n); } catch (e) {} }
  function begin() { if (began) return; began = true; mark("begin"); start(); mark("built"); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(begin);
  setTimeout(begin, 2500);
  // Belt and braces: the loader can never trap a visitor.
  setTimeout(function () { var l = $("#loader"); if (l && !began) l.remove(); }, 6000);
})();
