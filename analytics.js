/* Google Analytics 4 — site-wide loader.
   Single source of truth: change the Measurement ID here and bump the
   ?v= query on the <script src="/analytics.js?v=N"> tags that load it.
   Property: rideekanda.com (restored 2026-06-26; tag was dropped during
   the migration to OneSite and analytics stopped on 2026-06-14). */
(function () {
  var ID = "G-M6YS4PGHPC";

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
  (document.head || document.documentElement).appendChild(s);

  gtag("js", new Date());
  gtag("config", ID);
})();
