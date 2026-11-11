/* ──────────────────────────────────────────────────────────────
   Rideekanda — registration gate (soft gate / lead capture)
   Shown before Dhamma Talks · ධර්ම දේශනා · Audio Library.
   • Register once → remembered on the device (localStorage), shared
     across all three pages.
   • Returning on a new device → "continue with email" (looked up in the
     Google Sheet), or just re-register.
   • Skipped in the installed kiosk app (standalone display-mode).
   Backend: the existing pledge Apps Script web app, extended with a
   `register` POST action and a `check` GET action.
   Include with:
     <link rel="stylesheet" href="/register-gate.css?v=1">
     <script id="rk-gate" src="/register-gate.js?v=1" data-lang="en"
             data-page="dhamma-talks" defer></script>
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var ENDPOINT = "https://script.google.com/macros/s/AKfycbwXroHe8dZGecXpSUGqU0EfmHTd63K7ZJY2T3LTAvribe-NFug7r88Ow6onfPWdnLaD2A/exec";
  var FLAG = "rk-registered", EMAIL_KEY = "rk-reg-email";

  var tag = document.getElementById("rk-gate") || document.currentScript;
  // Folder this script was loaded from, so its image resolves wherever the site is hosted.
  var GATE_BASE = (function () { try { return new URL(".", tag.src).href; } catch (e) { return "/"; } })();
  var LANG = (tag && tag.getAttribute("data-lang")) || "en";
  if (LANG !== "si" && LANG !== "bi") LANG = "en";
  var PAGE = (tag && tag.getAttribute("data-page")) || location.pathname;

  // already registered on this device?
  try { if (localStorage.getItem(FLAG) === "1") return; } catch (e) {}
  // kiosk bypass — the installed standalone app at the monastery is open access
  var standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
                   window.navigator.standalone === true;
  if (standalone) return;

  var T = {
    en: {
      place: "Rideekanda · Forest Monastery",
      title: "Please register to continue",
      intro: "These teachings and recordings are offered freely. Kindly share your details so we can stay in touch and offer guidance. 🙏",
      name: "Full name", email: "Email", country: "Country (optional)",
      consent: "Keep me updated with news from the monastery",
      submit: "Enter", sending: "Sending…",
      altQ: "Already registered?", altLink: "Continue with your email →",
      emailTitle: "Welcome back", emailIntro: "Enter the email you registered with to continue.",
      emailSubmit: "Continue", checking: "Checking…",
      backLink: "← New here? Register",
      note: "Free · we’ll never share your details.",
      errName: "Please enter your name.", errEmail: "Please enter a valid email address.",
      errFind: "We couldn’t find that email. Please register below.",
      errNet: "Network problem — please try again."
    },
    si: {
      place: "රිදීකන්ද · ආරණ්‍ය සේනාසනය",
      title: "ඉදිරියට යාමට ලියාපදිංචි වන්න",
      intro: "මෙම දේශනා සහ පටිගත කිරීම් නොමිලේ පිරිනමනු ලැබේ. සම්බන්ධව සිටීමට ඔබගේ විස්තර බෙදාගන්න. 🙏",
      name: "සම්පූර්ණ නම", email: "විද්‍යුත් තැපෑල", country: "රට (අත්‍යවශ්‍ය නොවේ)",
      consent: "ආරණ්‍යයේ පුවත් ලබා ගැනීමට කැමැත්තෙමි",
      submit: "ඇතුළු වන්න", sending: "යවමින්…",
      altQ: "දැනටමත් ලියාපදිංචිද?", altLink: "විද්‍යුත් තැපෑලෙන් ඉදිරියට →",
      emailTitle: "නැවත සාදරයෙන් පිළිගනිමු", emailIntro: "ලියාපදිංචි වූ විද්‍යුත් තැපෑල ඇතුළත් කරන්න.",
      emailSubmit: "ඉදිරියට", checking: "පරීක්ෂා කරමින්…",
      backLink: "← අලුතින්ද? ලියාපදිංචි වන්න",
      note: "නොමිලේ · ඔබගේ විස්තර කිසිවිටෙක බෙදා නොගනිමු.",
      errName: "කරුණාකර නම ඇතුළත් කරන්න.", errEmail: "වලංගු විද්‍යුත් තැපෑලක් ඇතුළත් කරන්න.",
      errFind: "එම විද්‍යුත් තැපෑල හමු නොවීය. කරුණාකර පහතින් ලියාපදිංචි වන්න.",
      errNet: "සන්නිවේදන ගැටලුවක් — නැවත උත්සාහ කරන්න."
    },
    bi: {
      place: "Rideekanda · Forest Monastery",
      title: 'Please register to continue<span class="rkgate__si2">ඉදිරියට යාමට ලියාපදිංචි වන්න</span>',
      intro: 'These teachings and recordings are offered freely. Kindly share your details so we can stay in touch. 🙏<span class="rkgate__si2">මෙම දේශනා සහ පටිගත කිරීම් නොමිලේ පිරිනමනු ලැබේ. සම්බන්ධව සිටීමට ඔබගේ විස්තර බෙදාගන්න.</span>',
      name: "Full name · සම්පූර්ණ නම", email: "Email · විද්‍යුත් තැපෑල",
      country: "Country (optional) · රට (අත්‍යවශ්‍ය නොවේ)",
      consent: "Keep me updated with news · ආරණ්‍යයේ පුවත් ලබා ගැනීමට කැමැත්තෙමි",
      submit: "Enter · ඇතුළු වන්න", sending: "Sending… · යවමින්…",
      altQ: "Already registered? · දැනටමත් ලියාපදිංචිද?", altLink: "Continue with your email → · විද්‍යුත් තැපෑලෙන් →",
      emailTitle: 'Welcome back<span class="rkgate__si2">නැවත සාදරයෙන් පිළිගනිමු</span>',
      emailIntro: 'Enter the email you registered with to continue.<span class="rkgate__si2">ලියාපදිංචි වූ විද්‍යුත් තැපෑල ඇතුළත් කරන්න.</span>',
      emailSubmit: "Continue · ඉදිරියට", checking: "Checking… · පරීක්ෂා කරමින්…",
      backLink: "← New here? Register · ලියාපදිංචි වන්න",
      note: "Free · we’ll never share your details · ඔබගේ විස්තර බෙදා නොගනිමු.",
      errName: "Please enter your name · කරුණාකර නම ඇතුළත් කරන්න.",
      errEmail: "Enter a valid email · වලංගු විද්‍යුත් තැපෑලක් ඇතුළත් කරන්න.",
      errFind: "Email not found — please register below · එම විද්‍යුත් තැපෑල හමු නොවීය.",
      errNet: "Network problem — please try again · නැවත උත්සාහ කරන්න."
    }
  }[LANG];

  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }
  function emailOk(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
  function lock() { document.documentElement.classList.add("rkgate-lock"); document.body.classList.add("rkgate-lock"); }
  function unlock() { document.documentElement.classList.remove("rkgate-lock"); document.body.classList.remove("rkgate-lock"); }

  function setRegistered(email) {
    try { localStorage.setItem(FLAG, "1"); if (email) localStorage.setItem(EMAIL_KEY, email); } catch (e) {}
  }

  function build() {
    if (document.querySelector(".rkgate")) return;
    var wrap = el("div", "rkgate" + (LANG === "si" ? " rkgate--si" : LANG === "bi" ? " rkgate--bi" : ""));
    var card = el("div", "rkgate__card");
    card.innerHTML =
      '<img class="rkgate__lotus" src="' + GATE_BASE + 'assets/lotus-logo.png" alt="" draggable="false">' +
      '<p class="rkgate__place">' + T.place + '</p>' +
      '<div data-view="form">' +
        '<h2 class="rkgate__title">' + T.title + '</h2>' +
        '<p class="rkgate__intro">' + T.intro + '</p>' +
        '<form class="rkgate__form" novalidate>' +
          '<div class="rkgate__field"><label>' + T.name + '</label><input type="text" name="name" autocomplete="name" required></div>' +
          '<div class="rkgate__field"><label>' + T.email + '</label><input type="email" name="email" autocomplete="email" required></div>' +
          '<div class="rkgate__field"><label>' + T.country + '</label><input type="text" name="country" autocomplete="country-name"></div>' +
          '<label class="rkgate__consent"><input type="checkbox" name="consent" checked><span>' + T.consent + '</span></label>' +
          '<input class="rkgate__hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<button class="rkgate__btn" type="submit">' + T.submit + '</button>' +
          '<p class="rkgate__msg" data-msg></p>' +
        '</form>' +
        '<p class="rkgate__alt">' + T.altQ + ' <button class="rkgate__link" type="button" data-to="email">' + T.altLink + '</button></p>' +
      '</div>' +
      '<div data-view="email" hidden>' +
        '<h2 class="rkgate__title">' + T.emailTitle + '</h2>' +
        '<p class="rkgate__intro">' + T.emailIntro + '</p>' +
        '<form class="rkgate__form" novalidate>' +
          '<div class="rkgate__field"><label>' + T.email + '</label><input type="email" name="email" autocomplete="email" required></div>' +
          '<button class="rkgate__btn" type="submit">' + T.emailSubmit + '</button>' +
          '<p class="rkgate__msg" data-msg></p>' +
        '</form>' +
        '<p class="rkgate__alt"><button class="rkgate__link" type="button" data-to="form">' + T.backLink + '</button></p>' +
      '</div>' +
      '<p class="rkgate__note">' + T.note + '</p>';
    wrap.appendChild(card);
    document.body.appendChild(wrap);
    wrap.classList.add("is-on");
    lock();

    var viewForm = card.querySelector('[data-view="form"]');
    var viewEmail = card.querySelector('[data-view="email"]');
    function show(which) {
      viewForm.hidden = which !== "form"; viewEmail.hidden = which !== "email";
      var f = (which === "form" ? viewForm : viewEmail).querySelector("input"); if (f) f.focus();
    }
    card.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-to]"); if (b) show(b.getAttribute("data-to"));
    });

    function close() { wrap.classList.remove("is-on"); unlock(); setTimeout(function () { wrap.remove(); }, 150); }
    function msg(form, text, kind) { var m = form.querySelector("[data-msg]"); m.textContent = text || ""; m.className = "rkgate__msg" + (kind ? " " + kind : ""); }

    // register
    viewForm.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.target;
      if (form.website.value) { setRegistered(); close(); return; }   // honeypot → drop bot silently
      var name = form.name.value.trim(), email = form.email.value.trim();
      if (!name) { msg(form, T.errName, "err"); form.name.focus(); return; }
      if (!emailOk(email)) { msg(form, T.errEmail, "err"); form.email.focus(); return; }
      var btn = form.querySelector("button"); btn.disabled = true; btn.textContent = T.sending; msg(form, "");
      var payload = { action: "register", name: name.slice(0, 120), email: email.slice(0, 160),
        country: form.country.value.trim().slice(0, 80), consent: form.consent.checked ? "Y" : "N",
        page: PAGE, lang: LANG };
      // fire-and-forget (no-cors → opaque); optimistically admit on completion
      fetch(ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload) }).then(done).catch(done);
      function done() { setRegistered(email); close(); }
    });

    // continue with email (readable GET lookup)
    viewEmail.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.target, email = form.email.value.trim();
      if (!emailOk(email)) { msg(form, T.errEmail, "err"); form.email.focus(); return; }
      var btn = form.querySelector("button"); btn.disabled = true; btn.textContent = T.checking; msg(form, "");
      fetch(ENDPOINT + "?action=check&email=" + encodeURIComponent(email))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && d.registered) { setRegistered(email); close(); }
          else { btn.disabled = false; btn.textContent = T.emailSubmit; msg(form, T.errFind, "err"); }
        })
        .catch(function () { btn.disabled = false; btn.textContent = T.emailSubmit; msg(form, T.errNet, "err"); });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
