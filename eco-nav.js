/* ──────────────────────────────────────────────────────────────
   Rideekanda Ecosystem Navigation  ·  eco-nav.js
   Injects a consistent "Explore" launcher + section menu onto
   every page so visitors can move around the ecosystem and always
   get home. Self-contained, no dependencies.

   Each host page includes it like:
     <link rel="stylesheet" href="<ROOT>eco-nav.css">
     <script id="eco-nav" src="<ROOT>eco-nav.js"
             data-root="<ROOT>" data-current="<id>" defer></script>
   where <ROOT> is the relative path back to the site root
   ("" at root, "../" for depth-1 pages, "../../" for projects/*)
   and <id> marks the current section (for highlighting).
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var tag = document.getElementById("eco-nav") ||
            document.currentScript ||
            (function () { var s = document.querySelectorAll('script[src*="eco-nav.js"]'); return s[s.length - 1]; })();
  var ROOT = (tag && tag.getAttribute("data-root")) || "";
  var CURRENT = (tag && tag.getAttribute("data-current")) || "";

  // ── Kiosk idle return ───────────────────────────────────────
  // In the installed kiosk app, if a visitor wanders off the dashboard and
  // leaves a page idle, return them to the dashboard so the next person starts
  // fresh. Any interaction resets the timer; normal browser visitors are never
  // redirected.
  (function kioskIdleReturn() {
    // Same kiosk test the QR uses: installed PWA (standalone) OR a fullscreen /
    // minimal-ui kiosk browser, remembered via localStorage so it also works on
    // mobile kiosks that don't report display-mode:standalone on every page.
    var kparam = new URLSearchParams(location.search).get("kiosk");
    var mm = window.matchMedia;
    var standalone =
      (mm && (mm("(display-mode: standalone)").matches ||
              mm("(display-mode: fullscreen)").matches ||
              mm("(display-mode: minimal-ui)").matches)) ||
      window.navigator.standalone === true;
    var remembered = false;
    try { remembered = localStorage.getItem("rk-kiosk") === "1"; } catch (e) {}
    var isKiosk = kparam === "1" || (kparam !== "0" && (standalone || remembered));
    if (!isKiosk) return;                                        // installed kiosk only
    if (location.pathname.indexOf("/dashboard") !== -1) return;  // already on the dashboard
    var IDLE_MS = 120000;                                        // 2 minutes of no interaction
    var READER_IDLE_MS = 300000;                                 // 5 while a document is open
    var DASH = ROOT + "dashboard/";
    var timer, last = Date.now();
    function go() {
      // Don't interrupt an open media player. Audio/video plays inside a
      // cross-origin iframe (Google Drive /preview in the audio library and
      // Dhamma Talks; YouTube in the video gallery) whose playback can't reset
      // this timer. Each of those iframes exists only while actively playing
      // (injected on press, removed on close), so if one is on the page, defer
      // the return instead of navigating away mid-listen.
      if (document.querySelector('iframe[src*="drive.google.com"], iframe[src*="youtube"], iframe[src*="youtu.be"], iframe[src*="vimeo"]')) { reset(); return; }
      // Belt and braces for anything played natively rather than in a frame.
      var media = document.querySelectorAll("audio, video");
      for (var i = 0; i < media.length; i++) {
        if (!media[i].paused && !media[i].ended) { reset(); return; }
      }
      // Reading is passive: the e-book and retreat-document readers can sit
      // untouched for minutes on one page. Both mark themselves .reader.open
      // while a document is up, and clear it on close. Rather than defer for
      // as long as it stays open — which would strand the kiosk on a book
      // somebody walked away from — give reading a longer window and then
      // return as usual. `last` is only moved by a real interaction, so this
      // measures genuine idle time, not time since the last check.
      if (document.querySelector(".reader.open")) {
        var idle = Date.now() - last;
        if (idle < READER_IDLE_MS) {
          clearTimeout(timer);
          timer = setTimeout(go, READER_IDLE_MS - idle);
          return;
        }
      }
      location.href = DASH;
    }
    function reset() { last = Date.now(); clearTimeout(timer); timer = setTimeout(go, IDLE_MS); }
    ["pointerdown", "touchstart", "mousemove", "keydown", "scroll", "wheel", "click"].forEach(function (ev) {
      window.addEventListener(ev, reset, { passive: true });
    });
    // Mobile OSes throttle/pause timers when the screen sleeps or the app is
    // backgrounded, so the 2-minute timer alone is unreliable there. When the
    // page becomes visible again, check the elapsed time directly and return to
    // the dashboard if it's been idle long enough.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) return;
      if (Date.now() - last >= IDLE_MS) go();
      else reset();
    });
    reset();
  })();

  var MAIN = [
    { id: "home",        href: "",                 en: "Home",                si: "මුල් පිටුව" },
    { id: "monastery",   href: "monastery/",            en: "Monastery",           si: "ආරණ්‍ය සේනාසනය" },
    { id: "retreat",     href: "retreat-center/",              en: "Retreat Program",     si: "භාවනා වැඩසටහන" },
    { id: "booking",     href: "book-your-stay/",              en: "Book Your Stay",      si: "වෙන් කරවා ගැනීම" },
    { id: "reviews",     href: "reviews/",              en: "Reviews",             si: "ඇගයීම්" },
    { id: "news",        href: "news-and-events/",                 en: "News & Events",       si: "ප්‍රවෘත්ති සහ සිදුවීම්" },
    { id: "gallery",     href: "gallery/",              en: "Gallery",             si: "ඡායාරූප" },
    { id: "videos",      href: "videos/",               en: "Video Gallery",       si: "වීඩියෝ" },
    { id: "donate",      href: "donate/",               en: "Donate",              si: "පරිත්‍යාග" },
    { id: "contact",     href: "contact/",              en: "Contact",             si: "සම්බන්ධ වන්න" }
  ];
  var PROJECTS = [
    { id: "projects",     href: "projects/",                en: "All Projects",  si: "ව්‍යාපෘති" },
    { id: "road-project", href: "projects/road-project/",   en: "Road Project",  si: "මාර්ග ව්‍යාපෘතිය" },
    { id: "herbal-plants", href: "projects/herbal-plants/", en: "Herbal Planting", si: "ඖෂධ පැළ රෝපණය" },
    { id: "threestory",   href: "projects/threestory/",     en: "ThreeStory Building", si: "තෙමහල් ගොඩනැගිල්ල" },
    { id: "requirements", href: "requirements/",            en: "Monastery Requirements", si: "ආරණ්‍ය අවශ්‍යතා" },
    { id: "library-cafe", href: "projects/library-cafe/",   en: "Library Café",  si: "පුස්තකාල කැෆේ" }
  ];
  // Libraries — its own labelled section near the bottom.
  var LIBRARIES = [
    { id: "ebooks",          href: "ebooks/",           en: "E-Book Library",          si: "ඊ-පොත් පුස්තකාලය" },
    { id: "dhamma-talks",    href: "dhamma-talks/",     en: "Dhamma Talks (English)",  si: "ධර්ම දේශනා (ඉංග්‍රීසි)" },
    { id: "dhamma-talks-si", href: "dhamma-talks/si/",  en: "Dhamma Talks (Sinhala)",  si: "ධර්ම දේශනා (සිංහල)" },
    { id: "audio-library",   href: "audio-library/",    en: "Audio Library",           si: "ශ්‍රව්‍ය පුස්තකාලය" },
    { id: "retreat-docs",    href: "retreat-docs/",     en: "Retreat Documents",       si: "වැඩසටහන් ලේඛන" }
  ];
  var BOTTOM = [
    { id: "dashboard",   href: "dashboard/",            en: "Dashboard",           si: "උපකරණ පුවරුව" }
  ];

  // Explore mark = the official Rideekanda logo, rendered via CSS mask so it
  // inherits currentColor (the accent) and themes correctly — same logo the
  // dashboard centre uses. ROOT makes the path correct at any page depth.
  var LOGO_URL = ROOT + 'rideekanda-logo.svg';
  var LOTUS = '<span style="display:block;width:100%;height:100%;' +
    'background-color:currentColor;' +
    '-webkit-mask:url(' + LOGO_URL + ') center/contain no-repeat;' +
    'mask:url(' + LOGO_URL + ') center/contain no-repeat;"></span>';

  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }

  // ── Dashboard button ────────────────────────────────────────
  // Every page but the dashboard itself carries a pill in the bottom-right
  // corner that goes straight there. It is parked behind the day/night
  // toggle and slides out from under it once the page has settled.
  // The same Sun and Moon eco-theme.js draws, for the inert disc below.
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M3.5 3.5l1.8 1.8M18.7 18.7l1.8 1.8M2 12h2.5M19.5 12H22M3.5 20.5l1.8-1.8M18.7 5.3l1.8-1.8"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.2A8 8 0 1 1 9.8 4 6.4 6.4 0 0 0 20 14.2z"/></svg>';

  // Perceived brightness of the toggle's background. Needed because the
  // toggles differ from page to page — one stays pale at night — so the label
  // colour cannot be read off the page's theme.
  function isPale(c) {
    var v, m = /rgba?\(([^)]+)\)/.exec(c);
    if (m) v = m[1].split(/[,\s/]+/).map(parseFloat);
    else {
      // Browsers report a color-mix() result as color(srgb r g b / a), 0–1.
      var k = /color\(srgb ([^)]+)\)/.exec(c);
      if (!k) return true;
      v = k[1].split(/[\s/]+/).map(function (n) { return parseFloat(n) * 255; });
    }
    return (v[0] * 0.299 + v[1] * 0.587 + v[2] * 0.114) > 150;
  }

  // The Explore menu carries its own Dashboard link, so the pill slips back
  // behind the toggle while the menu is open and slides out again after.
  function dashTuck(hide) {
    var slot = document.querySelector(".eco-dash-slot");
    if (slot) slot.classList.toggle("is-tucked", hide);
  }

  function dashButton() {
    if (location.pathname.indexOf("/dashboard") !== -1) return;
    if (document.querySelector(".eco-dash-slot")) return;

    var slot = el("div", "eco-dash-slot");
    var pill = document.createElement("a");
    pill.className = "eco-dash";
    pill.href = ROOT + "dashboard/";
    pill.title = "Dashboard · උපකරණ පුවරුව";
    pill.setAttribute("aria-label", "Open the dashboard");
    pill.appendChild(el("span", "eco-dash-label", "Dashboard"));
    slot.appendChild(pill);
    document.body.appendChild(slot);

    // Measure the toggle rather than assume it: the shared one is 42px, the
    // home page's own is 46px, and both move in on a narrow screen. Sitting
    // one layer below it keeps the toggle clickable through the parked pill.
    function place() {
      var t = document.querySelector(".eco-theme-toggle, .theme-toggle");
      if (!t) return false;
      var r = t.getBoundingClientRect();
      if (!r.width) return false;
      var doc = document.documentElement, cs = getComputedStyle(t);
      var z = parseInt(cs.zIndex, 10);
      if (z) slot.style.zIndex = z - 1;
      slot.style.setProperty("--eco-dash-size", r.height + "px");
      slot.style.setProperty("--eco-dash-right", (doc.clientWidth - r.right) + "px");
      slot.style.setProperty("--eco-dash-bottom", (doc.clientHeight - r.bottom) + "px");
      // Wear the toggle's own background so the two read as one piece, but set
      // the label against that background rather than copying the toggle's
      // gold, which is for a 20px glyph, not 13px of text.
      slot.style.setProperty("--eco-dash-bg", cs.backgroundColor);
      var pale = isPale(cs.backgroundColor);
      slot.style.setProperty("--eco-dash-ink", pale ? "#2b2620" : "#f3ecdb");
      // And the hairline the toggle wears, so the ring runs unbroken from the
      // disc round the pill: warm dark on paper, warm pale at night.
      slot.style.setProperty("--eco-dash-line",
        pale ? "rgba(43, 38, 32, 0.22)" : "rgba(255, 235, 200, 0.24)");
      return true;
    }

    // eco-theme.js appends its toggle on DOMContentLoaded as well, and the two
    // scripts are not in the same order on every page, so wait for it instead
    // of assuming it is there.
    var tries = 0;
    (function waitForToggle() {
      if (place()) { reveal(); return; }
      if (++tries > 40) { capPill(); reveal(); return; }
      setTimeout(waitForToggle, 50);
    })();

    // The project pages carry no day/night control, and without a disc at the
    // corner the pill looks as though it has slid in from nowhere. Give those
    // pages the same disc, drawn rather than wired: it takes no clicks of its
    // own, so a tap on it reaches the pill underneath and opens the dashboard.
    function capPill() {
      var h = new Date().getHours();
      var mark = el("span", "eco-dash-mark", (h >= 6 && h < 18) ? SUN : MOON);
      mark.setAttribute("aria-hidden", "true");
      slot.appendChild(mark);
      // There is no toggle to copy the hairline from, so read the colour the
      // pill itself came out as and ring it to suit.
      if (!isPale(getComputedStyle(pill).backgroundColor)) {
        slot.style.setProperty("--eco-dash-line", "rgba(255, 235, 200, 0.24)");
      }
    }

    function reveal() { setTimeout(function () { slot.classList.add("is-out"); }, 650); }

    window.addEventListener("resize", place);
    // Day/night can flip under the visitor — on a tap of the toggle, or on its
    // own at 06:00 / 18:00 — and the pill's colour is copied, not computed.
    if (window.MutationObserver) {
      new MutationObserver(place).observe(document.documentElement,
        { attributes: true, attributeFilter: ["data-theme"] });
    }
  }

  /* ════════════════════════════════════════════════════════════
     Site menu — the same full-screen menu the home page opens.
     The header's Menu button (eco-header.js) calls window.RKMenu;
     a page with no header gets a small floating button instead.
     ════════════════════════════════════════════════════════════ */
  var RM = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var FINE = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);

  var BIG = [
    { id: "home",      href: "",                 en: "Home",             si: "මුල් පිටුව",            img: "rk/img/dusk.webp" },
    { id: "monastery", href: "monastery/",       en: "The Monastery",    si: "ආරණ්‍ය සේනාසනය",       img: "rk/img/x-monastery.webp" },
    { id: "retreat",   href: "retreat-center/",  en: "Retreat Program",  si: "භාවනා වැඩසටහන",        img: "rk/img/x-retreat.webp" },
    { id: "booking",   href: "book-your-stay/",  en: "Book Your Stay",   si: "වෙන් කරවා ගැනීම",       img: "rk/img/x-booking.webp" },
    { id: "news",      href: "news-and-events/", en: "News & Events",    si: "ප්‍රවෘත්ති සහ සිදුවීම්", img: "rk/img/x-news.webp" },
    { id: "gallery",   href: "gallery/",         en: "Gallery",          si: "ඡායාරූප",              img: "rk/img/x-gallery.webp" },
    { id: "donate",    href: "donate/",          en: "Dāna · Donation",  si: "පරිත්‍යාග",             img: "rk/img/x-donate.webp" },
    { id: "contact",   href: "contact/",         en: "Contact",          si: "සම්බන්ධ වන්න",          img: "rk/img/x-contact.webp" }
  ];
  var MORE = [
    { id: "videos",        href: "videos/",        en: "Video Gallery" },
    { id: "reviews",       href: "reviews/",       en: "Reviews" },
    { id: "daily-routine", href: "daily-routine/", en: "Daily Routine" },
    { id: "dashboard",     href: "dashboard/",     en: "Dashboard" }
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  // "Current" is decided by address, not by data-current: several pages share one id.
  function norm(p) { return p.replace(/index\.html$/, "").replace(/\/+$/, "/"); }
  var HERE = norm(location.pathname);
  function isCur(it) { try { return norm(new URL(ROOT + it.href, location.href).pathname) === HERE; } catch (e) { return false; } }
  function href(it) { return isCur(it) ? "#top" : ROOT + it.href; }
  function cur(it) { return isCur(it) ? ' class="is-current" aria-current="page"' : ""; }
  function col(label, items) {
    return '<div class="rkm-col"><p class="rkm-label">' + label + "</p><ul>" + items.map(function (it) {
      return '<li><a href="' + href(it) + '"' + cur(it) + ">" + esc(it.en) + "</a></li>";
    }).join("") + "</ul></div>";
  }

  function build() {
    // In-page section links, as given to the header — shown in the menu on
    // narrow screens, where the header has no room for them.
    var pageLinks = [];
    try {
      var h = document.getElementById("eco-header");
      pageLinks = JSON.parse((h && h.getAttribute("data-links")) || "[]");
    } catch (e) { pageLinks = []; }

    var menu = el("div", "rkm");
    menu.id = "rkMenu";
    menu.hidden = true;
    menu.setAttribute("role", "dialog");
    menu.setAttribute("aria-modal", "true");
    menu.setAttribute("aria-label", "Site navigation");
    menu.innerHTML =
      '<div class="rkm-bg"></div>' +
      '<div class="rkm-bar"><a class="rkm-brand" href="' + ROOT + '" aria-label="Rideekanda Forest Monastery — home">' +
        '<span class="rkm-logo">' + LOTUS + '</span><span>Rideekanda<small>රිදීකන්ද ආරණ්‍ය සේනාසනය</small></span></a>' +
        '<button class="rkm-close" type="button" aria-label="Close menu"><span>Close</span><i></i></button></div>' +
      '<div class="rkm-in">' +
        '<div class="rkm-main"><p class="rkm-label">Explore the monastery</p><ul class="rkm-big">' +
          BIG.map(function (it, i) {
            return '<li style="--i:' + i + '"><a href="' + href(it) + '"' + cur(it) + ' data-img="' + ROOT + it.img + '">' +
              "<span>" + esc(it.en) + '</span><small lang="si">' + it.si + "</small></a></li>";
          }).join("") + "</ul></div>" +
        '<div class="rkm-side">' +
          (pageLinks.length ? '<div class="rkm-col rkm-page"><p class="rkm-label">On this page</p><ul>' + pageLinks.map(function (l) {
            return '<li><a href="' + esc(l.href || "#top") + '"' + (l.external ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + esc(l.label || "") + "</a></li>";
          }).join("") + "</ul></div>" : "") +
          col("More", MORE) + col("Projects", PROJECTS.map(function (p) { return { id: p.id, href: p.href, en: p.en }; })) +
          col("Libraries", LIBRARIES.map(function (p) { return { id: p.id, href: p.href, en: p.en }; })) +
          '<div class="rkm-foot"><a href="https://wa.me/94742252980" target="_blank" rel="noopener">WhatsApp +94 74 225 2980</a>' +
            '<a href="mailto:rideekanda@gmail.com">rideekanda@gmail.com</a><span class="rkm-social">' +
            '<a href="https://www.facebook.com/rideekandaforest" target="_blank" rel="noopener">Facebook</a>' +
            '<a href="https://www.instagram.com/rideekanda.monastery/" target="_blank" rel="noopener">Instagram</a>' +
            '<a href="https://youtube.com/c/RideekandaForestMonastery" target="_blank" rel="noopener">YouTube</a></span></div>' +
        "</div>" +
        '<div class="rkm-preview" aria-hidden="true"><img alt="" /></div>' +
      "</div>";
    document.body.appendChild(menu);

    var isOpen = false, lastFocus = null, hideTimer;
    var prev = menu.querySelector(".rkm-preview"), prevImg = prev.querySelector("img");
    function setOpen(state) {
      if (state === isOpen) return;
      isOpen = state;
      clearTimeout(hideTimer);
      document.documentElement.classList.toggle("rkm-open", isOpen);
      [].forEach.call(document.querySelectorAll("[data-rk-menu]"), function (b) { b.setAttribute("aria-expanded", isOpen ? "true" : "false"); });
      dashTuck(isOpen);
      if (isOpen) {
        lastFocus = document.activeElement;
        menu.hidden = false;
        void menu.offsetWidth;                // let the closed state paint before animating
        menu.classList.add("is-open");
        document.addEventListener("keydown", onKey);
        if (window.__rkLenis) window.__rkLenis.stop();
        var c = menu.querySelector(".rkm-close"); if (c) c.focus({ preventScroll: true });
      } else {
        menu.classList.remove("is-open");
        prev.classList.remove("on");
        document.removeEventListener("keydown", onKey);
        if (window.__rkLenis) window.__rkLenis.start();
        hideTimer = setTimeout(function () { menu.hidden = true; }, RM ? 0 : 750);
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      }
    }
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    menu.querySelector(".rkm-close").addEventListener("click", function () { setOpen(false); });
    // A link to somewhere on this page closes the menu and lets the jump happen.
    menu.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (a && a.getAttribute("href").charAt(0) === "#") setOpen(false);
    });
    [].forEach.call(menu.querySelectorAll(".rkm-big a"), function (a) {
      a.addEventListener("pointerenter", function () { prevImg.src = a.getAttribute("data-img"); prev.classList.add("on"); });
    });
    menu.querySelector(".rkm-big").addEventListener("pointerleave", function () { prev.classList.remove("on"); });

    window.RKMenu = { open: function () { setOpen(true); }, close: function () { setOpen(false); }, toggle: function () { setOpen(!isOpen); } };

    // No shared header on this page (the classic dashboard): float a Menu button.
    if (!document.getElementById("eco-header")) {
      var launch = el("button", "rkm-launch", '<span class="rkm-logo">' + LOTUS + "</span><span>Menu</span>");
      launch.type = "button";
      launch.setAttribute("data-rk-menu", "");
      launch.setAttribute("aria-expanded", "false");
      launch.addEventListener("click", function () { setOpen(true); });
      document.body.appendChild(launch);
    }
  }

  /* ── Leaving a page: a soft dark curtain rises, and the next page
        lifts it (rk/inner.css). Same gesture as the home page. ── */
  function curtain() {
    if (RM) return;
    var veil = el("div", "rk-veil");
    veil.setAttribute("aria-hidden", "true");
    document.body.appendChild(veil);
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      var h = a.getAttribute("href");
      if (!h || h.charAt(0) === "#" || a.target === "_blank" || a.hasAttribute("download") || /^(mailto|tel|javascript|blob|data):/i.test(h)) return;
      var url; try { url = new URL(h, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;   // same page, different anchor
      if (/\.(pdf|zip|jpe?g|png|webp|mp3|mp4|glb|epub)$/i.test(url.pathname)) return;    // files, not pages
      e.preventDefault();
      veil.classList.add("is-up");
      setTimeout(function () { location.href = url.href; }, 520);
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) veil.classList.remove("is-up"); });
  }

  /* ── A small dot that trails the pointer and swells over links. ── */
  function cursor() {
    if (!FINE || RM) return;
    var c = el("div", "rk-cursor is-hidden", "<i></i>");
    c.setAttribute("aria-hidden", "true");
    document.body.appendChild(c);
    var x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    function tick() {
      x += (tx - x) * 0.22; y += (ty - y) * 0.22;
      c.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
      raf = (Math.abs(tx - x) + Math.abs(ty - y) > 0.2) ? requestAnimationFrame(tick) : 0;
    }
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      tx = e.clientX; ty = e.clientY;
      if (c.classList.contains("is-hidden")) { x = tx; y = ty; c.classList.remove("is-hidden"); }
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      var t = e.target;
      c.classList.toggle("is-link", !!(t.closest && t.closest("a, button, [role=button], summary, label, select")));
      // The pointer cannot be followed inside an embedded player or a 3D view.
      c.classList.toggle("is-hidden", !!(t.closest && t.closest("iframe, canvas, model-viewer, video, input, textarea")));
    });
    document.documentElement.addEventListener("pointerleave", function () { c.classList.add("is-hidden"); });
  }

  /* ── Smooth scrolling on the long reading pages only. The interactive
        pages (readers, galleries, forms, 3D models) keep native scroll. ── */
  var SMOOTH = /\/(monastery|retreat-center|contact|daily-routine|terms|projects)\/(si\/)?$/;
  function smooth() {
    if (RM || !FINE || !SMOOTH.test(HERE)) return;
    var s = document.createElement("script");
    s.src = ROOT + "rk/vendor/lenis.min.js";
    s.onload = function () {
      if (!window.Lenis) return;
      var lenis = new window.Lenis({
        lerp: 0.1,
        // Anything that scrolls on its own (a panel, a dialog) is left alone.
        prevent: function (node) {
          for (var n = node; n && n !== document.body; n = n.parentElement) {
            if (n.hasAttribute && n.hasAttribute("data-lenis-prevent")) return true;
            var oy = getComputedStyle(n).overflowY;
            if ((oy === "auto" || oy === "scroll") && n.scrollHeight > n.clientHeight + 1) return true;
          }
          return false;
        }
      });
      window.__rkLenis = lenis;
      document.documentElement.classList.add("lenis");
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
      document.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || e.defaultPrevented) return;
        var id = a.getAttribute("href"), t = id.length > 1 ? document.getElementById(id.slice(1)) : null;
        if (id === "#top" || id === "#") { e.preventDefault(); lenis.scrollTo(0, { duration: 1.4 }); }
        else if (t) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.4, offset: -72 }); }
      });
    };
    document.head.appendChild(s);
  }

  // The Dashboard pill now lives in rk/dash.js (shared with the home page).
  function dashPill() {
    if (location.pathname.indexOf("/dashboard") !== -1) return;
    window.__rkDashRoot = ROOT;
    var s = document.createElement("script");
    s.src = ROOT + "rk/dash.js?v=2";
    document.head.appendChild(s);
  }

  function start() { build(); dashPill(); curtain(); cursor(); smooth(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
