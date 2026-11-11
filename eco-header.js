/* ──────────────────────────────────────────────────────────────
   Rideekanda Ecosystem Header  ·  eco-header.js
   Injects one canonical header bar at the top of every sub-page:
   the brand (links home), the page's own section links, and the
   Menu button that opens the site menu (eco-nav.js → window.RKMenu).

   Include on a host page:
     <link rel="stylesheet" href="<ROOT>eco-header.css">
     <script id="eco-header" src="<ROOT>eco-header.js"
             data-root="<ROOT>"
             data-links='[{"label":"About","href":"#about"}, ...]'
             defer></script>

   A link may set {"cta":true} to render as the accent pill
   (e.g. Support), and {"external":true} to open in a new tab.
   data-pad="true" pads the body so content clears the fixed bar.
   On narrow screens the section links move into the site menu.
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var tag = document.getElementById("eco-header") ||
            document.currentScript ||
            (function () { var s = document.querySelectorAll('script[src*="eco-header.js"]'); return s[s.length - 1]; })();
  var ROOT = (tag && tag.getAttribute("data-root")) || "";
  var PAD = (tag && tag.getAttribute("data-pad")) === "true";

  var links = [];
  try { links = JSON.parse((tag && tag.getAttribute("data-links")) || "[]"); }
  catch (e) { links = []; }

  // The official Rideekanda logo, drawn through a CSS mask so it takes the accent colour.
  var LOGO_URL = ROOT + "rideekanda-logo.svg";
  var LOTUS = '<span style="display:block;width:100%;height:100%;background-color:currentColor;' +
    "-webkit-mask:url(" + LOGO_URL + ") center/contain no-repeat;mask:url(" + LOGO_URL + ') center/contain no-repeat;"></span>';

  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }

  function mkLink(item) {
    var a = document.createElement("a");
    a.href = item.href || "#top";
    if (item.cta) a.className = "eco-h-cta";
    if (item.external) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    a.textContent = item.label || "";
    return a;
  }

  function build() {
    var header = el("header", "eco-header");
    header.setAttribute("role", "banner");
    var inner = el("div", "eco-h-inner");

    var brand = document.createElement("a");
    brand.className = "eco-h-brand";
    brand.href = ROOT || "./";
    brand.setAttribute("aria-label", "Rideekanda Forest Monastery — home");
    brand.innerHTML = '<span class="eco-h-mark">' + LOTUS + "</span>" +
      '<span class="eco-h-brandtext"><b>Rideekanda</b><small>Forest Monastery</small></span>';
    inner.appendChild(brand);

    var nav = el("nav", "eco-h-links");
    nav.setAttribute("aria-label", "On this page");
    links.forEach(function (it) { nav.appendChild(mkLink(it)); });
    inner.appendChild(nav);

    var menu = el("button", "eco-h-menu", "<span>Menu</span><i><b></b><b></b></i>");
    menu.type = "button";
    menu.setAttribute("data-rk-menu", "");
    menu.setAttribute("aria-label", "Open the site menu");
    menu.setAttribute("aria-expanded", "false");
    menu.addEventListener("click", function () {
      if (window.RKMenu) window.RKMenu.toggle();
      else location.href = ROOT || "./";      // menu script missing: home is the fallback
    });
    inner.appendChild(menu);

    header.appendChild(inner);
    if (PAD) document.body.classList.add("eco-h-pad");
    document.body.insertBefore(header, document.body.firstChild);

    // In-page links and the menu's "this page" entry jump to #top.
    if (!document.getElementById("top")) {
      var t = document.createElement("span");
      t.id = "top";
      t.style.cssText = "position:absolute;top:0;left:0;";
      document.body.insertBefore(t, document.body.firstChild);
    }

    // Solid once the page moves; steps aside on the way down, returns on the way up.
    var last = window.scrollY, ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY;
      header.classList.toggle("eco-h-scrolled", y > 16);
      if (y > 420 && y > last + 6) header.classList.add("eco-h-hidden");
      else if (y < last - 6 || y <= 420) header.classList.remove("eco-h-hidden");
      last = y;
    }
    update();
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    header.addEventListener("focusin", function () { header.classList.remove("eco-h-hidden"); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
