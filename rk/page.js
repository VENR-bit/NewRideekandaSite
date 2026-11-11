/* ──────────────────────────────────────────────────────────────
   Rideekanda — long-form pages  ·  rk/page.js
   Scroll choreography for the pages built on rk/page.css (The
   Monastery, the Retreat Program). Driven entirely by classes and
   data-attributes in the markup, so a page needs no script of its own:

     .ph                 hero: title lines rise, photo drifts on scroll
     .split              heading whose lines rise as it enters
     .statement          passage that lights up word by word
     .reveal             fades up on entering
     .clip               image frame that unveils        [data-speed] drifts
     [data-count]        number that counts up
     [data-tilt]         frame that leans toward the pointer
     .tl                 timeline whose line fills; marks the current hour
     #rtList             upcoming retreats, from calendar-data.js

   Without GSAP, or with reduced motion, everything is simply visible.
   Smooth scrolling itself is started by eco-nav.js.
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var RM = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var FINE = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger, SplitText = window.SplitText;

  /* ── time at the monastery (Sri Lanka is UTC+5:30, no daylight saving) ── */
  function colombo() { return new Date(Date.now() + 330 * 60000); }
  function colomboHour() { var d = colombo(); return d.getUTCHours() + d.getUTCMinutes() / 60; }
  function hm(s) { var p = s.split(":"); return +p[0] + (+p[1]) / 60; }
  function ymd(s) { var p = s.split("-"); return { y: +p[0], m: +p[1] - 1, d: +p[2], t: Date.UTC(+p[0], +p[1] - 1, +p[2]) }; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ── upcoming retreats ── */
  (function retreats() {
    var cal = window.RK_CALENDAR, list = $("#rtList");
    if (!cal || !list) return;
    var c = colombo(), today = Date.UTC(c.getUTCFullYear(), c.getUTCMonth(), c.getUTCDate());
    var href = list.getAttribute("data-book") || "../book-your-stay/";
    var up = (cal.retreats || []).filter(function (r) { return ymd(r.end).t >= today; })
      .sort(function (a, b) { return ymd(a.start).t - ymd(b.start).t; }).slice(0, +list.getAttribute("data-rows") || 4);
    if (!up.length) return;
    list.innerHTML = up.map(function (r, i) {
      var a = ymd(r.start), b = ymd(r.end), days = Math.round((a.t - today) / 864e5);
      var range = a.m === b.m ? a.d + " — " + b.d + " " + MONTHS[b.m] : a.d + " " + MONTHS[a.m] + " — " + b.d + " " + MONTHS[b.m];
      var chip = days <= 0 ? '<span class="rt-in soon">Under way</span>'
        : '<span class="rt-in' + (days <= 30 ? " soon" : "") + '">' + (days === 1 ? "Tomorrow" : "In " + days + " days") + "</span>";
      return '<li><a href="' + esc(href) + '"><span class="rt-n">' + ("0" + (i + 1)).slice(-2) + "</span>" +
        '<span class="rt-date">' + range + "<small>" + b.y + "</small></span>" +
        '<span class="rt-name">' + esc(r.name) + "</span>" + chip + '<i class="arr"></i></a></li>';
    }).join("");
  })();

  /* ── the timeline: which period is under way right now ── */
  var tlItems = $$(".tl li[data-from]");
  function markNow() {
    var h = colomboHour();
    tlItems.forEach(function (li) {
      var f = hm(li.getAttribute("data-from")), t = hm(li.getAttribute("data-to"));
      li.classList.toggle("is-now", f < t ? (h >= f && h < t) : (h >= f || h < t));
    });
  }
  if (tlItems.length) { markNow(); setInterval(markNow, 30000); }

  function showAll() {
    root.classList.add("rm");
    $$(".reveal").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
    $$(".tl li").forEach(function (li) { li.classList.add("is-on"); });
    $$(".tl-fill").forEach(function (el) { el.style.transform = "none"; });
  }
  if (!gsap || !ScrollTrigger || RM) { showAll(); return; }

  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  var EASE = "expo.out";

  function build() {
    var mm = gsap.matchMedia();

    /* hero */
    var ph = $(".ph");
    if (ph) {
      var img = $(".ph-bg img", ph), title = $(".ph-title", ph);
      var tl = gsap.timeline({ delay: 0.45, defaults: { ease: EASE } });
      if (img) tl.fromTo(img, { scale: 1.22 }, { scale: 1.06, duration: 2.6, ease: "power3.out" }, 0);
      if (title && SplitText) {
        var st = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "split-line" });
        tl.from(st.lines, { yPercent: 115, duration: 1.5, stagger: 0.12 }, 0.1);
      } else if (title) tl.from(title, { y: 50, opacity: 0, duration: 1.4 }, 0.1);
      tl.from($$(".ph .label, .ph-foot > *", ph), { y: 22, opacity: 0, duration: 1.2, stagger: 0.1 }, 0.5);
      if (img) gsap.to(img, { yPercent: 9, ease: "none", scrollTrigger: { trigger: ph, start: "top top", end: "bottom top", scrub: true } });
      gsap.to($(".ph-in", ph), { yPercent: -10, opacity: 0, ease: "none", scrollTrigger: { trigger: ph, start: "top top", end: "bottom 25%", scrub: true } });
    }

    /* headings */
    if (SplitText) {
      $$(".split").forEach(function (el) {
        SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line", autoSplit: true,
          onSplit: function (self) {
            return gsap.from(self.lines, { yPercent: 112, duration: 1.3, stagger: 0.11, ease: EASE, scrollTrigger: { trigger: el, start: "top 86%", once: true } });
          } });
      });
      $$(".statement").forEach(function (el) {
        SplitText.create(el, { type: "words", wordsClass: "word", autoSplit: true,
          onSplit: function (self) {
            return gsap.to(self.words, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 } });
          } });
      });
    }

    /* reveals */
    ScrollTrigger.batch(".reveal", { start: "top 90%", once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.2, stagger: 0.09, ease: EASE, overwrite: true }); } });

    /* image frames */
    $$(".clip").forEach(function (fig) {
      var im = $("img", fig);
      gsap.fromTo(fig, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut", scrollTrigger: { trigger: fig, start: "top 88%", once: true } });
      if (im) {
        gsap.fromTo(im, { scale: 1.3 }, { scale: 1.12, duration: 2, ease: EASE, scrollTrigger: { trigger: fig, start: "top 88%", once: true } });
        // the photograph slides a little inside its frame as the page moves
        gsap.fromTo(im, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true } });
      }
    });
    mm.add("(min-width: 821px)", function () {
      $$("[data-speed]").forEach(function (el) {
        var s = parseFloat(el.getAttribute("data-speed")) || 0;
        gsap.fromTo(el, { y: function () { return window.innerHeight * s; } }, { y: function () { return -window.innerHeight * s; }, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
      });
    });

    /* counters */
    $$("[data-count]").forEach(function (el) {
      var end = parseFloat(el.getAttribute("data-count")), plain = el.hasAttribute("data-plain"), o = { v: plain ? end - 40 : 0 };
      var fmt = function (v) { return plain ? String(Math.round(v)) : Math.round(v).toLocaleString("en-US"); };
      el.textContent = fmt(o.v);
      gsap.to(o, { v: end, duration: 2.4, ease: "power2.out", onUpdate: function () { el.textContent = fmt(o.v); }, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });

    /* staggered groups */
    $$("[data-stagger]").forEach(function (group) {
      gsap.from(group.children, { y: 44, opacity: 0, duration: 1.1, stagger: 0.09, ease: EASE, scrollTrigger: { trigger: group, start: "top 84%", once: true } });
    });

    /* timeline */
    $$(".tl").forEach(function (list) {
      var fill = $(".tl-fill", list), items = $$("li", list);
      if (fill) gsap.to(fill, { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 62%", end: "bottom 62%", scrub: 0.4 } });
      items.forEach(function (li) {
        ScrollTrigger.create({ trigger: li, start: "top 62%", onEnter: function () { li.classList.add("is-on"); }, onLeaveBack: function () { li.classList.remove("is-on"); } });
      });
    });

    /* pointer */
    if (FINE) {
      $$("[data-tilt]").forEach(function (el) {
        gsap.set(el, { transformPerspective: 900 });
        el.addEventListener("pointermove", function (e) {
          var r = el.getBoundingClientRect();
          gsap.to(el, { rotationY: ((e.clientX - r.left) / r.width - 0.5) * 6, rotationX: -((e.clientY - r.top) / r.height - 0.5) * 6, duration: 0.8 });
        });
        el.addEventListener("pointerleave", function () { gsap.to(el, { rotationX: 0, rotationY: 0, duration: 1.2 }); });
      });
      $$("[data-magnet]").forEach(function (el) {
        var mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" }), my = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
        el.addEventListener("pointermove", function (e) {
          var r = el.getBoundingClientRect();
          mx((e.clientX - r.left - r.width / 2) * 0.28); my((e.clientY - r.top - r.height / 2) * 0.4);
        });
        el.addEventListener("pointerleave", function () { gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, .4)" }); });
      });
    }

    ScrollTrigger.refresh();
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  // Line breaks depend on the web fonts, so wait for them — but never for long.
  var began = false;
  function begin() {
    if (began) return; began = true;
    try { build(); } catch (e) { if (window.console) console.error("[rk/page] build failed:", e); showAll(); }
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(begin);
  setTimeout(begin, 2500);
})();
