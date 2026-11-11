/* ──────────────────────────────────────────────────────────────
   Rideekanda Ecosystem Footer  ·  eco-footer.js
   Injects one canonical footer (matching the home page) at the
   bottom of every sub-page. Root-aware, like eco-nav / eco-header.

   Include on a host page (before </body>):
     <link rel="stylesheet" href="<ROOT>eco-footer.css">
     <script id="eco-footer" src="<ROOT>eco-footer.js"
             data-root="<ROOT>" defer></script>
   where <ROOT> is the relative path back to the site root
   ("../" for depth-1 pages, "../../" for projects/*, monastery/si …).
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var tag = document.getElementById("eco-footer") ||
            document.currentScript ||
            (function () { var s = document.querySelectorAll('script[src*="eco-footer.js"]'); return s[s.length - 1]; })();
  var ROOT = (tag && tag.getAttribute("data-root")) || "";
  var LOGO = ROOT + "rideekanda-logo.svg";
  var MARK = '<span class="eco-f-mark"><span style="-webkit-mask:url(' + LOGO +
    ") center/contain no-repeat;mask:url(" + LOGO + ') center/contain no-repeat;"></span></span>';

  var EXPLORE = [
    { label: "The Monastery",     href: "monastery/" },
    { label: "Retreat Program",   href: "retreat-center/" },
    { label: "Gallery",           href: "gallery/" },
    { label: "Projects",          href: "projects/" },
    { label: "News &amp; Events", href: "news-and-events/" }
  ];
  var VISIT = [
    { label: "Book your stay",  href: "book-your-stay/" },
    { label: "Dāna · Donation", href: "donate/" },
    { label: "Contact",         href: "contact/" },
    { label: "Dashboard",       href: "dashboard/" }
  ];
  var FOLLOW = [
    { label: "Facebook",  href: "https://www.facebook.com/rideekandaforest", ext: true },
    { label: "Instagram", href: "https://www.instagram.com/rideekanda.monastery/", ext: true },
    { label: "YouTube",   href: "https://youtube.com/c/RideekandaForestMonastery", ext: true }
  ];

  function li(it) {
    return '<li><a href="' + (it.ext ? it.href : ROOT + it.href) + '"' +
      (it.ext ? ' target="_blank" rel="noopener"' : "") + ">" + it.label + "</a></li>";
  }
  function col(title, items) { return "<div><h4>" + title + "</h4><ul>" + items.map(li).join("") + "</ul></div>"; }

  var year = new Date().getFullYear();
  var html =
    '<div class="eco-f-container">' +
      '<div class="eco-f-grid">' +
        '<div class="eco-f-brand">' + MARK +
          '<p class="eco-f-blurb">A Buddhist forest meditation monastery in Matale, ' +
          "Sri Lanka, devoted to preserving the true teaching of the Buddha and " +
          "guiding seekers along the noble path.</p>" +
          '<p class="eco-f-where">Udasgiriya, Yatawatta · Matale District, Sri Lanka</p>' +
        "</div>" +
        col("Explore", EXPLORE) + col("Visit &amp; Support", VISIT) + col("Follow", FOLLOW) +
      "</div>" +
      '<a class="eco-f-word" href="' + (ROOT || "./") + '" aria-label="Rideekanda — home"><span>Rideekanda</span></a>' +
      '<div class="eco-f-base">' +
        "<span>© " + year + " Rideekanda Forest Monastery" +
          ' · <a href="' + ROOT + 'terms/">Terms &amp; Conditions</a></span>' +
        "<span><em>Sabbadānaṃ dhammadānaṃ jināti</em> — the gift of Dhamma surpasses all gifts</span>" +
        '<a class="eco-f-top" href="#top">Back to top ↑</a>' +
      "</div>" +
    "</div>";

  function mount() {
    if (document.querySelector("footer.eco-footer")) return;
    var footer = document.createElement("footer");
    footer.className = "eco-footer";
    footer.setAttribute("role", "contentinfo");
    footer.innerHTML = html;
    document.body.appendChild(footer);
    // The wordmark rises into place as the footer comes into view.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en, ob) {
        if (en[0].isIntersecting) { footer.classList.add("is-in"); ob.disconnect(); }
      }, { threshold: 0.25 }).observe(footer);
    } else footer.classList.add("is-in");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
