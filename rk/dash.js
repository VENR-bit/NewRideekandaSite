/* ──────────────────────────────────────────────────────────────
   Rideekanda — Dashboard pill  ·  rk/dash.js
   A small dark-glass pill in the bottom-right corner of every page
   (except the dashboard itself) that leads back to the dashboard.
   Self-contained: it carries its own styles.

     <script src="<ROOT>rk/dash.js" data-root="<ROOT>" defer></script>
   eco-nav.js loads it for the inner pages; the home page includes it.

   • Sits just left of the day / night button where a page has one.
   • On a phone it folds down to its icon while the page is scrolling
     down, so it never rests on the text, and opens again on the way up.
   • data-after="0.6" keeps it away until the page has moved that share
     of a screen (the home page, whose first screen is already full).
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";
  if (location.pathname.indexOf("/dashboard") !== -1) return;
  if (document.querySelector(".rk-dash")) return;

  var tag = document.currentScript || document.querySelector('script[src*="rk/dash.js"]');
  var ROOT = (window.__rkDashRoot != null ? window.__rkDashRoot : (tag && tag.getAttribute("data-root"))) || "";
  var AFTER = parseFloat((tag && tag.getAttribute("data-after")) || "0") || 0;

  var css =
    ".rk-dash{position:fixed;z-index:99400;right:calc(18px + env(safe-area-inset-right,0px));bottom:calc(18px + env(safe-area-inset-bottom,0px));" +
      "display:inline-flex;align-items:center;height:42px;padding:0 6px 0 5px;border-radius:999px;text-decoration:none;white-space:nowrap;overflow:hidden;" +
      "background:rgba(10,16,12,.84);color:#ebe6d6;border:1px solid rgba(235,230,214,.2);" +
      "-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);" +
      "box-shadow:0 10px 30px -12px rgba(0,0,0,.55);-webkit-tap-highlight-color:transparent;" +
      "font:500 11px/1 'Hanken Grotesk','Manrope',system-ui,-apple-system,'Segoe UI',sans-serif;letter-spacing:.16em;text-transform:uppercase;" +
      "opacity:0;transform:translateY(14px);transition:opacity .5s ease,transform .6s cubic-bezier(.2,.7,.1,1),background-color .35s ease,color .35s ease,border-color .35s ease}" +
    ".rk-dash.is-in{opacity:1;transform:none}" +
    ".rk-dash.has-toggle{right:calc(18px + env(safe-area-inset-right,0px) + 42px + 8px)}" +
    ".rk-dash i{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#e39a48;color:#1a1208;transition:background-color .35s ease,transform .6s cubic-bezier(.2,.7,.1,1)}" +
    ".rk-dash svg{width:14px;height:14px;display:block}" +
    ".rk-dash span{display:inline-block;max-width:9em;padding:0 12px 0 10px;overflow:hidden;transition:max-width .5s cubic-bezier(.2,.7,.1,1),padding .5s cubic-bezier(.2,.7,.1,1),opacity .3s ease}" +
    ".rk-dash.is-small span{max-width:0;padding:0;opacity:0}" +
    ".rk-dash.is-small{padding-right:5px}" +
    "@media (hover:hover){.rk-dash:hover{background:#e39a48;color:#1a1208;border-color:#e39a48}.rk-dash:hover i{background:#1a1208;color:#e39a48;transform:rotate(90deg)}}" +
    "html.rkm-open .rk-dash,html.menu-open .rk-dash{opacity:0;pointer-events:none}" +
    "@media print{.rk-dash{display:none}}" +
    "@media (prefers-reduced-motion:reduce){.rk-dash,.rk-dash span,.rk-dash i{transition:none}}";

  function mount() {
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);

    var a = document.createElement("a");
    a.className = "rk-dash";
    a.href = ROOT + "dashboard/";
    a.title = "Dashboard · උපකරණ පුවරුව";
    a.setAttribute("aria-label", "Open the dashboard");
    a.innerHTML = '<i aria-hidden="true"><svg viewBox="0 0 16 16" fill="currentColor"><rect x="1.5" y="1.5" width="5.4" height="5.4" rx="1.4"/><rect x="9.1" y="1.5" width="5.4" height="5.4" rx="1.4"/><rect x="1.5" y="9.1" width="5.4" height="5.4" rx="1.4"/><rect x="9.1" y="9.1" width="5.4" height="5.4" rx="1.4"/></svg></i><span>Dashboard</span>';
    document.body.appendChild(a);

    // Stand beside the day / night button rather than on it. Both sit on the
    // same CSS baseline (18px + safe area, 42px tall), so nothing is measured:
    // a measured offset went stale when a phone's toolbar slid away on scroll,
    // and the pill dropped out of line with the button.
    function place() { a.classList.toggle("has-toggle", !!document.querySelector(".eco-theme-toggle")); }
    place();
    var tries = 0;
    (function wait() { place(); if (!a.classList.contains("has-toggle") && ++tries < 40) setTimeout(wait, 80); })();

    var small = window.matchMedia ? window.matchMedia("(max-width: 700px)") : { matches: false };
    var last = window.scrollY, ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY;
      a.classList.toggle("is-in", y >= window.innerHeight * AFTER);
      if (small.matches) {
        if (y > last + 6 && y > 80) a.classList.add("is-small");
        else if (y < last - 6 || y <= 80) a.classList.remove("is-small");
      } else a.classList.remove("is-small");
      last = y;
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    setTimeout(update, AFTER ? 0 : 700);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
