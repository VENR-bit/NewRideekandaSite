/* Rideekanda — Daily Routine renderer.
   Draws every period once, with the English and Sinhala wording together, and
   marks whichever period is under way right now. */
(function () {
  var R = window.RK_ROUTINE || { rows: [] };
  var rows = R.rows || [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function mins(hhmm) {
    var p = String(hhmm || "").split(":");
    return (+p[0]) * 60 + (+p[1] || 0);
  }
  // True when `now` falls in [from, to). The night period wraps past midnight,
  // so it is the one case where `to` is smaller than `from`.
  function covers(r, now) {
    var a = mins(r.from), b = mins(r.to);
    return a <= b ? (now >= a && now < b) : (now >= a || now < b);
  }

  var root = document.getElementById("day");
  if (!root) return;

  root.innerHTML = rows.map(function (r, i) {
    return '<div class="slot" data-i="' + i + '">' +
      '<div class="slot__time">' +
        '<div class="t-en">' + esc(r.t.en) + '</div>' +
        '<div class="t-si si">' + esc(r.t.si) + '</div>' +
      '</div>' +
      '<div class="slot__what">' +
        '<p class="a-en">' + esc(r.a.en) + '<span class="now-slot"></span></p>' +
        '<p class="a-si si">' + esc(r.a.si) + '</p>' +
      '</div>' +
    '</div>';
  }).join("");

  var slots = [].slice.call(root.querySelectorAll(".slot"));
  slots.forEach(function (el, k) {
    setTimeout(function () { el.classList.add("in"); }, 40 + k * 40);
  });

  // Mark the period under way, and keep it right as the day moves on.
  function markNow() {
    var d = new Date(), now = d.getHours() * 60 + d.getMinutes();
    slots.forEach(function (el, i) {
      var on = covers(rows[i], now);
      el.classList.toggle("now", on);
      var tag = el.querySelector(".now-slot");
      if (tag) tag.innerHTML = on ? '<span class="now-tag">Now</span>' : "";
    });
  }
  markNow();
  setInterval(markNow, 30000);

  var totalEl = document.getElementById("total");
  if (totalEl) {
    totalEl.innerHTML = "<b>" + rows.length + "</b> periods · English &amp; සිංහල";
  }
})();
