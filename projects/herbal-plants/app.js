/* ──────────────────────────────────────────────────────────────
   Rideekanda — Herbal Plant Planting Programme
   Public page: browse the plant lists, pledge one, and (via a private
   link) attach the photograph once it is in the ground.
   ────────────────────────────────────────────────────────────── */
(function () {
  var DB = window.RK_PLANTS_DB;
  var LISTS = window.RK_PLANTS || { programme: [], reference: [] };
  var PAGE = 60;                 // plants rendered per "show more" step

  var state = { list: "programme", q: "", shown: PAGE, pledges: [], byPlant: {}, filter: "all",
                view: (function () {
                  try { return localStorage.getItem("rk-plants-view") === "list" ? "list" : "tiles"; }
                  catch (e) { return "tiles"; }
                })() };

  /* ── Wording. The Sinhala page under /si/ sets <html lang="si">; both
        pages share this one script. ────────────────────────────────── */
  var STR = {
    en: {
      unclaimed:   "Not yet claimed",
      claimedBy:   function (n) { return "Claimed by " + n; },
      plantedBy:   function (n) { return "Planted by " + n; },
      pledge:      "Pledge",
      taken:       "Taken",
      showing:     function (a, b) { return "Showing " + a + " of " + b; },
      moreInList:  "Show more plants",
      nextList:    function (n) { return "Show the balance medicinal flora · " + n + " plants"; },
      needName:    "Please tell us your name so we can record the pledge.",
      recording:   "Recording…",
      pledgeBtn:   "Pledge this plant",
      raceLost:    "Someone claimed this plant just before you. Please choose another — the list has refreshed.",
      saveFailed:  "Could not save the pledge. Please check your connection and try again.",
      copied:      "Copied",
      copyLink:    "Copy link",
      sending:     "Sending…",
      sendPhoto:   "Send photograph",
      thanksTitle: "Thank you — received.",
      thanksBody:  "Your photograph has been sent to the monastery. Once a monk has looked at it, it will appear in the planting record on this page. Your pledge is complete.",
      uploadFail:  "Upload failed. Please try again.",
      badLink:     "That link is not valid. Please check you copied all of it.",
      no:          "No. ",
      nPlants:     function (n) { return Number(n).toLocaleString() + " plants"; },
      listProgramme: "Planting list",
      listReference: "Medicinal flora",
      searchingBoth: "Searching both lists",
      uploadPhoto: "Upload photo",
      photoPending: "Photo sent \u00b7 awaiting approval",
      uploadTitle:  "Send the planting photograph",
      uploadIntro:  "Upload a picture of this plant in the ground. The monastery will look at it, and it will then appear in the planting record below.",
      alreadyDone:  "This plant's photograph has already been approved.",
      viewTiles:    "Tile view",
      viewList:     "List view",
      fAll:      "All plants",
      fOpen:     "To be pledged",
      fClaimed:  "Already pledged",
      fPlanted:  "Planted",
      noMatch:   "Nothing here yet.",
      noResults: "No plant matches that search."
    },
    si: {
      unclaimed:   "තවම වෙන් කර නැත",
      claimedBy:   function (n) { return n + " විසින් වෙන් කර ඇත"; },
      plantedBy:   function (n) { return n + " විසින් රෝපණය කර ඇත"; },
      pledge:      "වෙන් කරන්න",
      taken:       "වෙන් කර ඇත",
      showing:     function (a, b) { return b + " කින් " + a + " ක් පෙන්වයි"; },
      moreInList:  "තවත් පැළ පෙන්වන්න",
      nextList:    function (n) { return "ඉතිරි ඖෂධශාක ලැයිස්තුව · පැළ " + n + " ක්"; },
      needName:    "වෙන් කිරීම සටහන් කිරීමට ඔබගේ නම සඳහන් කරන්න.",
      recording:   "සටහන් කරමින්…",
      pledgeBtn:   "මෙම පැළය වෙන් කරන්න",
      raceLost:    "ඔබට පෙර වෙනත් අයෙක් මෙම පැළය වෙන් කර ගෙන ඇත. කරුණාකර වෙනත් පැළයක් තෝරන්න — ලැයිස්තුව යාවත්කාලීන කර ඇත.",
      saveFailed:  "වෙන් කිරීම සුරැකීමට නොහැකි විය. ඔබගේ සම්බන්ධතාවය පරීක්ෂා කර නැවත උත්සාහ කරන්න.",
      copied:      "පිටපත් විය",
      copyLink:    "සබැඳිය පිටපත් කරන්න",
      sending:     "යවමින්…",
      sendPhoto:   "ඡායාරූපය යවන්න",
      thanksTitle: "ස්තූතියි — ලැබුණි.",
      thanksBody:  "ඔබගේ ඡායාරූපය ආරණ්‍යයට යවා ඇත. භික්ෂූන් වහන්සේ නමක් එය පරීක්ෂා කළ පසු, එය මෙම පිටුවේ රෝපණ වාර්තාවට එකතු වේ. ඔබගේ වෙන් කිරීම සම්පූර්ණයි.",
      uploadFail:  "උඩුගත කිරීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.",
      badLink:     "එම සබැඳිය වලංගු නොවේ. ඔබ එය සම්පූර්ණයෙන් පිටපත් කළාදැයි පරීක්ෂා කරන්න.",
      no:          "අංක ",
      nPlants:     function (n) { return "පැළ " + Number(n).toLocaleString() + " ක්"; },
      listProgramme: "රෝපණ ලැයිස්තුව",
      listReference: "ඖෂධශාක ලැයිස්තුව",
      searchingBoth: "ලැයිස්තු දෙකෙහිම සොයයි",
      uploadPhoto: "ඡායාරූපය උඩුගත කරන්න",
      photoPending: "ඡායාරූපය එවා ඇත \u00b7 අනුමැතිය බලාපොරොත්තුවෙන්",
      uploadTitle:  "රෝපණ ඡායාරූපය එවන්න",
      uploadIntro:  "පොළොවේ රෝපණය කළ මෙම පැළයේ ඡායාරූපයක් උඩුගත කරන්න. ආරණ්‍යය එය පරීක්ෂා කළ පසු, පහත රෝපණ වාර්තාවේ පෙන්වයි.",
      alreadyDone:  "මෙම පැළයේ ඡායාරූපය දැනටමත් අනුමත කර ඇත.",
      viewTiles:    "කොටු ලෙස",
      viewList:     "ලැයිස්තුවක් ලෙස",
      fAll:      "සියලුම පැළ",
      fOpen:     "වෙන් කිරීමට ඇති",
      fClaimed:  "වෙන් කර ඇති",
      fPlanted:  "රෝපණය කර ඇති",
      noMatch:   "මෙහි තවම කිසිවක් නැත.",
      noResults: "එම සෙවීමට ගැළපෙන පැළයක් නොමැත."
    }
  };
  var L = STR[(document.documentElement.lang || "en").slice(0, 2) === "si" ? "si" : "en"];

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  // [no, sinhala, script, english, scientific]
  function P(row) { return { no: row[0], sinhala: row[1], script: row[2], english: row[3], scientific: row[4] }; }
  // A plant is identified by its list AND its name — the planting list and
  // the reference list are kept separate, so the same species can be
  // claimed once in each.
  function keyOf(p, list) { return (list || state.list) + "|" + (p.scientific || p.sinhala || "").toLowerCase(); }

  /* ── reveal-on-scroll (same behaviour as the other project pages) ── */
  function initReveal() {
    var els = [].slice.call(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("in");
      else io.observe(el);
    });
  }

  /* ── plant list rendering ────────────────────────────────── */
  function matches(p, q) {
    if (!q) return true;
    return (p.sinhala + " " + p.script + " " + p.english + " " + p.scientific).toLowerCase().indexOf(q) !== -1;
  }

  // Searching looks through BOTH lists — someone hunting for a plant should
  // not have to guess which list it lives in. Each result carries its own
  // list, because the same species in the two lists is two separate claims.
  // With no search term we show just the list whose tab is open.
  function searching() { return state.q.trim().length > 0; }

  // Everything in scope: the open list (or both when searching), before the
  // claim-status filter is applied. The filter counts are taken from here.
  function inScope() {
    var q = state.q.trim().toLowerCase();
    var names = searching() ? ["programme", "reference"] : [state.list];
    var out = [];
    for (var n = 0; n < names.length; n++) {
      var name = names[n], rows = LISTS[name] || [];
      for (var i = 0; i < rows.length; i++) {
        var p = P(rows[i]);
        if (matches(p, q)) { p.list = name; out.push(p); }
      }
    }
    return out;
  }

  function passesFilter(p) {
    var rec = claimOf(p, p.list || state.list);
    switch (state.filter) {
      case "open":    return !rec;
      case "claimed": return !!rec;
      case "planted": return !!rec && rec.status === "approved";
      default:        return true;
    }
  }

  function filtered() {
    var out = [], all = inScope();
    for (var i = 0; i < all.length; i++) if (passesFilter(all[i])) out.push(all[i]);
    return out;
  }

  // Counts shown beside each option, so the numbers the count line used to
  // give are still there — just attached to the choice they describe.
  function refreshFilterCounts() {
    var sel = $("plant-filter");
    if (!sel) return;
    var all = inScope(), n = { all: all.length, open: 0, claimed: 0, planted: 0 };
    for (var i = 0; i < all.length; i++) {
      var rec = claimOf(all[i], all[i].list || state.list);
      if (!rec) n.open++;
      else { n.claimed++; if (rec.status === "approved") n.planted++; }
    }
    var label = { all: L.fAll, open: L.fOpen, claimed: L.fClaimed, planted: L.fPlanted };
    [].slice.call(sel.options).forEach(function (o) {
      o.textContent = label[o.value] + "  (" + Number(n[o.value]).toLocaleString() + ")";
    });
  }

  function listLabel(name) { return name === "reference" ? L.listReference : L.listProgramme; }

  function claimOf(p, list) { return state.byPlant[keyOf(p, list)] || null; }

  function pledgeSummary(p, list) {
    var rec = claimOf(p, list);
    if (!rec) return '<span class="plant-pledged none">' + L.unclaimed + '</span>';
    var who = rec.name ? esc(rec.name) : "someone";
    var label = rec.planted ? L.plantedBy(who) : L.claimedBy(who);
    return '<span class="plant-pledged">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
      label + '</span>';
  }

  // What the claimed tile offers. The pledger comes back to the page and
  // presses Upload here — there is no private link to keep any more.
  function tileAction(p, list) {
    var rec = claimOf(p, list);
    if (!rec) {
      return '<button class="btn-pledge" type="button" data-pledge="' +
             esc(list) + ':' + esc(p.no) + '">' + L.pledge + '</button>';
    }
    if (rec.status === "pending") {
      return '<button class="btn-pledge is-taken" type="button" disabled>' + L.photoPending + '</button>';
    }
    if (rec.status === "approved") {
      return '<button class="btn-pledge is-taken" type="button" disabled>' + L.taken + '</button>';
    }
    // 'none' or 'rejected' — a photo is still wanted
    return '<button class="btn-pledge is-upload" type="button" data-upload="' + rec.id + '">' +
           L.uploadPhoto + '</button>';
  }

  function renderList() {
    var rows = filtered();
    var grid = $("plant-grid");
    var slice = rows.slice(0, state.shown);
    var list = state.view === "list";
    var html = "";
    for (var i = 0; i < slice.length; i++) {
      var p = slice[i];
      var lst = p.list || state.list;
      var tag = searching()
        ? '<span class="plant-list-tag' + (lst === "reference" ? " ref" : "") + '">' + esc(listLabel(lst)) + '</span>'
        : '';
      if (list) {
        html += '<div class="plant-row">' +
          '<div class="pr-no">' + L.no + esc(p.no) + '</div>' +
          '<div class="pr-name">' +
            (p.script ? '<span class="plant-si">' + esc(p.script) + '</span>' : '') +
            '<span class="pr-roman">' + esc(p.sinhala) + '</span>' + tag +
          '</div>' +
          '<div class="pr-en">' + esc(p.english || "") + '</div>' +
          '<div class="pr-sci">' + esc(p.scientific || "") + '</div>' +
          '<div class="pr-act">' + pledgeSummary(p, lst) + tileAction(p, lst) + '</div>' +
        '</div>';
      } else {
        html += '<div class="plant-card">' +
          '<div class="plant-head">' +
            '<span class="plant-no">' + L.no + esc(p.no) + '</span>' + tag +
          '</div>' +
          (p.script ? '<div class="plant-si">' + esc(p.script) + '</div>' : '') +
          '<div class="plant-name">' + esc(p.sinhala) + '</div>' +
          (p.english ? '<div class="plant-en">' + esc(p.english) + '</div>' : '') +
          (p.scientific ? '<div class="plant-sci">' + esc(p.scientific) + '</div>' : '') +
          '<div class="plant-foot">' + pledgeSummary(p, lst) + tileAction(p, lst) +
          '</div></div>';
      }
    }
    grid.className = list ? "plant-rows" : "plant-grid";
    grid.innerHTML = html;
    $("list-empty").hidden = rows.length !== 0;
    $("list-empty").textContent = state.filter === "all" ? L.noResults : L.noMatch;
    refreshFilterCounts();
    // The button pages through the current list; once everything in the
    // planting list is on screen it turns into the door to the full flora.
    var more = $("load-more");
    if (rows.length > state.shown) {
      more.hidden = false;
      more.textContent = L.moreInList;
      more.dataset.act = "page";
    } else if (state.list === "programme" && !searching()) {
      more.hidden = false;
      more.textContent = L.nextList(((LISTS.reference || []).length).toLocaleString());
      more.dataset.act = "next-list";
    } else {
      more.hidden = true;
    }
  }

  function findPlant(list, no) {
    var rows = LISTS[list] || [];
    for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === String(no)) return P(rows[i]);
    return null;
  }

  /* ── pledge + planted data ───────────────────────────────── */
  function indexPledges(rows) {
    var by = {}, people = {}, pledged = 0, planted = 0;
    rows.forEach(function (r) {
      var k = r.plant_list + "|" + (r.scientific || r.sinhala || "").toLowerCase();
      if (!by[k]) by[k] = { id: r.id, name: r.pledger_name, status: r.photo_status, planted: 0 };
      pledged += 1;
      if (r.photo_status === "approved") { by[k].planted = 1; planted += 1; }
      if (r.pledger_name) people[r.pledger_name.trim().toLowerCase()] = 1;
    });
    state.byPlant = by;
    return { pledged: pledged, planted: planted, people: Object.keys(people).length };
  }

  function renderStats(t) {
    // Both lists together — they are kept separate, and each entry is
    // claimable once, so the two counts add up rather than merge.
    var species = (LISTS.programme || []).length + (LISTS.reference || []).length;
    $("st-species").textContent = species.toLocaleString();
    $("st-pledged").textContent = t ? t.pledged : "0";
    $("st-planted").textContent = t ? t.planted : "0";
    $("st-people").textContent = t ? t.people : "0";
    var pct = (t && t.pledged) ? Math.min(100, (t.planted / t.pledged) * 100) : 0;
    $("st-bar").style.width = pct + "%";
  }

  function renderPlanted(rows) {
    var done = rows.filter(function (r) { return r.photo_status === "approved" && r.photo_path; });
    var grid = $("planted-grid"), empty = $("planted-empty");
    if (!done.length) { grid.innerHTML = ""; empty.hidden = false; return; }
    empty.hidden = true;
    grid.innerHTML = done.map(function (r) {
      return '<div class="planted-card">' +
        '<img src="' + esc(DB.publicUrl(r.photo_path)) + '" alt="' + esc(r.sinhala || r.scientific) + '" loading="lazy" decoding="async">' +
        '<div class="planted-body">' +
          (r.sinhala_script ? '<div class="planted-si">' + esc(r.sinhala_script) + '</div>' : '') +
          '<div class="planted-name">' + esc(r.sinhala || r.english || r.scientific) + '</div>' +
          '<div class="planted-by">' + L.plantedBy(esc(r.pledger_name)) + '</div>' +
        '</div></div>';
    }).join("");
  }

  function loadPledges() {
    return DB.fetchPledges().then(function (rows) {
      if (!rows) { renderStats(null); renderList(); return; }   // backend not set up yet
      state.pledges = rows;
      renderStats(indexPledges(rows));
      renderPlanted(rows);
      renderList();
    });
  }

  /* ── modals ──────────────────────────────────────────────── */
  function openModal(id) { $(id).classList.add("is-open"); $(id).setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function closeModal(id) { $(id).classList.remove("is-open"); $(id).setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  document.addEventListener("click", function (e) {
    var c = e.target.closest("[data-close]");
    if (c) { closeModal(c.closest(".modal").id); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    [].slice.call(document.querySelectorAll(".modal.is-open")).forEach(function (m) { closeModal(m.id); });
  });

  var current = null;

  function openPledge(list, no) {
    var p = findPlant(list, no);
    if (!p) return;
    current = { plant: p, list: list };
    $("pledge-form-view").hidden = false;
    $("pledge-done-view").hidden = true;
    $("pledge-err").hidden = true;
    $("pl-name").value = ""; $("pl-contact").value = ""; $("pl-note").value = "";
    $("pledge-plant").innerHTML =
      (p.script ? '<div class="plant-si">' + esc(p.script) + '</div>' : '') +
      '<div class="plant-name">' + esc(p.sinhala) + '</div>' +
      (p.english ? '<div class="plant-en">' + esc(p.english) + '</div>' : '') +
      (p.scientific ? '<div class="plant-sci">' + esc(p.scientific) + '</div>' : '');
    openModal("pledge-modal");
    setTimeout(function () { $("pl-name").focus(); }, 60);
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-pledge]");
    if (!b) return;
    var parts = b.getAttribute("data-pledge").split(":");
    openPledge(parts[0], parts[1]);
  });

  var uploadFor = null;   // pledge id when the dialog was opened from a tile

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-upload]");
    if (!b) return;
    uploadFor = parseInt(b.getAttribute("data-upload"), 10);
    claimFile = null;
    $("claim-err").hidden = true;
    $("cl-file").value = "";
    $("cl-preview").style.display = "none";
    $("cl-submit").disabled = true;
    $("cl-submit").textContent = L.sendPhoto;
    $("claim-title").textContent = L.uploadTitle;
    var intro = document.getElementById("claim-intro");
    if (intro) intro.textContent = L.uploadIntro;
    openModal("claim-modal");
  });

  $("pl-submit").addEventListener("click", function () {
    var name = $("pl-name").value.trim();
    var err = $("pledge-err");
    if (!name) { err.textContent = L.needName; err.hidden = false; return; }
    err.hidden = true;
    var btn = this; btn.disabled = true; btn.textContent = L.recording;

    DB.createPledge({
      no: current.plant.no, list: current.list,
      sinhala: current.plant.sinhala, script: current.plant.script,
      english: current.plant.english, scientific: current.plant.scientific,
      name: name, qty: 1,
      contact: $("pl-contact").value.trim(), note: $("pl-note").value.trim()
    }).then(function (row) {
      btn.disabled = false; btn.textContent = L.pledgeBtn;
      if (row && row.claimed) {
        err.textContent = L.raceLost;
        err.hidden = false;
        loadPledges();
        return;
      }
      if (!row) {
        err.textContent = L.saveFailed;
        err.hidden = false; return;
      }
      $("pledge-form-view").hidden = true;
      $("pledge-done-view").hidden = false;
      loadPledges();
    });
  });

  /* ── photo upload: from a tile, or an older ?claim=<token> link ── */
  var claimFile = null;

  function shrink(file) {
    return new Promise(function (resolve) {
      if (!/^image\//.test(file.type) || file.size < 900 * 1024) return resolve(file);
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var max = 1600, r = Math.min(1, max / Math.max(img.width, img.height));
        var cv = document.createElement("canvas");
        cv.width = Math.round(img.width * r); cv.height = Math.round(img.height * r);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        cv.toBlob(function (b) {
          resolve(b ? new File([b], "planted.jpg", { type: "image/jpeg" }) : file);
        }, "image/jpeg", 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  $("cl-file").addEventListener("change", function (e) {
    var f = e.target.files && e.target.files[0];
    $("cl-submit").disabled = !f;
    if (!f) return;
    shrink(f).then(function (out) {
      claimFile = out;
      var pv = $("cl-preview");
      pv.src = URL.createObjectURL(out);
      pv.style.display = "block";
    });
  });

  $("cl-submit").addEventListener("click", function () {
    var token = new URLSearchParams(location.search).get("claim");
    var err = $("claim-err"), btn = this;
    if (!claimFile) return;
    if (!uploadFor && !token) return;
    err.hidden = true; btn.disabled = true; btn.textContent = L.sending;

    // From a tile we go by pledge id; an older private link still goes by token.
    var job = uploadFor
      ? DB.uploadPhotoForPledge(uploadFor, claimFile)
      : DB.uploadPhoto(token, claimFile);

    job.then(function () {
      document.querySelector("#claim-modal .modal-panel").innerHTML =
        '<button class="modal-x" type="button" aria-label="Close" data-close>&times;</button>' +
        '<div style="text-align:center">' +
        '<div class="ok-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
        '<h3>' + L.thanksTitle + '</h3>' +
        '<p style="color:var(--ink-soft);margin-top:8px">' + L.thanksBody + '</p>' +
        '</div>';
      loadPledges();
    }).catch(function (e) {
      btn.disabled = false; btn.textContent = L.sendPhoto;
      var m = e && e.message ? e.message : "";
      err.textContent = m === "NOT_ATTACHED" ? L.alreadyDone
                      : (m.indexOf("not valid") !== -1 ? L.badLink : (m || L.uploadFail));
      err.hidden = false;
      if (m === "NOT_ATTACHED") loadPledges();
    });
  });

  /* ── wiring ──────────────────────────────────────────────── */
  function switchList(name) {
    state.list = name;
    state.shown = PAGE;
    [].slice.call(document.querySelectorAll(".list-tab")).forEach(function (t) {
      t.classList.toggle("on", t.getAttribute("data-list") === name);
    });
    renderList();
  }

  [].slice.call(document.querySelectorAll(".list-tab")).forEach(function (tab) {
    tab.addEventListener("click", function () { switchList(tab.getAttribute("data-list")); });
  });

  (function () {
    var sel = $("plant-filter");
    if (!sel) return;
    sel.addEventListener("change", function () {
      state.filter = sel.value;
      state.shown = PAGE;
      renderList();
    });
  })();

  function setView(v) {
    state.view = v;
    try { localStorage.setItem("rk-plants-view", v); } catch (e) {}
    [].slice.call(document.querySelectorAll("[data-view]")).forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-view") === v);
      b.setAttribute("aria-pressed", b.getAttribute("data-view") === v ? "true" : "false");
    });
    renderList();
  }
  [].slice.call(document.querySelectorAll("[data-view]")).forEach(function (b) {
    b.title = b.getAttribute("data-view") === "list" ? L.viewList : L.viewTiles;
    b.setAttribute("aria-label", b.title);
    b.addEventListener("click", function () { setView(b.getAttribute("data-view")); });
  });

  var t = null;
  $("plant-search").addEventListener("input", function (e) {
    clearTimeout(t);
    var v = e.target.value;
    t = setTimeout(function () { state.q = v; state.shown = PAGE; renderList(); }, 140);
  });

  $("load-more").addEventListener("click", function () {
    if (this.dataset.act === "next-list") {
      switchList("reference");
      $("lists").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    state.shown += PAGE;
    renderList();
  });

  /* ── boot ────────────────────────────────────────────────── */
  $("tab-count-programme").textContent = L.nPlants((LISTS.programme || []).length);
  $("tab-count-reference").textContent = L.nPlants((LISTS.reference || []).length);
  renderStats(null);
  setView(state.view);
  initReveal();
  loadPledges();

  if (new URLSearchParams(location.search).get("claim")) {
    openModal("claim-modal");
  }
})();
