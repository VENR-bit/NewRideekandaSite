/* global React, ReactDOM, PROJECT, DONATE_URL, MATERIALS, fmt, LKR, Lotus, Ico, ICONS, Hero, About, Tech, Em, makeT, LangContext, useT */
const { useState, useEffect, useRef, useMemo, useContext } = window;

const STORE_KEY = "rideekanda_pledges_v2";
const LANG_KEY = "rk_lang";

// Google Sheets backend (Apps Script Web App /exec URL). When set, pledges are
// saved to the Sheet (POST) and the live shared list is loaded from it (GET).
// Empty = the page works on its own (seed + this browser's localStorage).
const PLEDGE_ENDPOINT = "https://script.google.com/macros/s/AKfycbwXroHe8dZGecXpSUGqU0EfmHTd63K7ZJY2T3LTAvribe-NFug7r88Ow6onfPWdnLaD2A/exec";

function postPledge(p) {
  if (!PLEDGE_ENDPOINT) return;
  try {
    fetch(PLEDGE_ENDPOINT, {
      method: "POST",
      mode: "no-cors",                                 // fire-and-forget; avoids CORS preflight
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name: p.name, meters: p.feet }),
    }).catch(function () {});
  } catch (e) {}
}

const SEED = [
  { id: "s1", name: "The Silva Family", message: "For our late mother.", feet: 18 },
  { id: "s2", name: "Anonymous", message: "", feet: 30 },
  { id: "s3", name: "Dhamma Friends, Colombo", message: "May all beings be at ease.", feet: 23 },
  { id: "s4", name: "Nimal & Kumari", message: "", feet: 12 },
  { id: "s5", name: "A. Fernando", message: "In gratitude.", feet: 8 },
  { id: "s6", name: "Meditation Group, Kandy", message: "", feet: 15 },
];

function loadPledges() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) { const p = JSON.parse(raw); if (Array.isArray(p)) return p; }
  } catch (e) {}
  return SEED.slice();
}

function loadLang() {
  try { const l = localStorage.getItem(LANG_KEY); if (l === "si" || l === "en") return l; } catch (e) {}
  return "en";
}

/* ===================== PLEDGE CARD ===================== */
function PledgeCard({ remaining, onPledge, justPledged, onReset }) {
  const { t } = useT();
  const [name, setName] = useState("");
  const [feet, setFeet] = useState(1);
  const [err, setErr] = useState("");

  const ft = feet === "" ? 0 : feet;
  const cost = ft * PROJECT.costPerFoot;
  const quick = [1, 5, 10, 25, 50, 100];

  const clampFeet = (v) => Math.max(1, Math.min(remaining, v || 1));

  function submit() {
    if (!name.trim()) { setErr(t("err_name")); return; }
    if (remaining <= 0) { setErr(t("err_full")); return; }
    setErr("");
    onPledge({ name: name.trim(), feet: clampFeet(feet) });
    setName(""); setFeet(1);
  }

  if (justPledged) {
    const amount = `LKR ${fmt(justPledged.feet * PROJECT.costPerFoot)}`;
    const hasLink = DONATE_URL && DONATE_URL !== "#";
    return (
      <div className="pledge">
        <div style={{textAlign:"center", marginBottom: 6}}><Lotus className="lotus--mark" /></div>
        <h3 style={{textAlign:"center"}}>{t("jp_h3")}</h3>
        <p className="pledge__hint" style={{textAlign:"center"}}>{t("jp_hint", { n: justPledged.feet })}</p>
        <div className="pledge__cost">
          <span className="l">{t("jp_amount_l")}</span>
          <span className="v"><LKR>{fmt(justPledged.feet * PROJECT.costPerFoot)}</LKR></span>
        </div>
        <a className="btn btn--saffron btn--block" href={DONATE_URL}
           {...(hasLink ? { target: "_blank", rel: "noopener" } : {})}>
          <Ico d={ICONS.heart} style={{width:18,height:18}} /> {t("btn_donate", { amount })}
        </a>
        <button className="btn btn--ghost btn--block" style={{marginTop:10}} onClick={onReset}>
          {t("btn_pledge_another")}
        </button>
        <p className="pledge__note">{t("jp_note")}</p>
      </div>
    );
  }

  return (
    <div className="pledge">
      <h3>{t("pledge_h3")}</h3>
      <p className="pledge__hint">{t("pledge_hint")}</p>

      <div className="field">
        <label>{t("pledge_name_label")}</label>
        <input className="input" value={name} placeholder={t("pledge_name_ph")} onChange={(e)=>setName(e.target.value)} />
      </div>

      <div className="field">
        <label>{t("pledge_meters_label")}</label>
        <div className="feetfield">
          <input
            className="feetfield__input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={feet === "" ? "" : feet}
            placeholder="0"
            aria-label={t("aria_meters")}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^0-9]/g, "");
              if (digits === "") { setFeet(""); return; }
              setFeet(Math.min(remaining, parseInt(digits, 10)));
            }}
            onBlur={() => setFeet((f) => (f === "" || f < 1 ? 1 : f))}
          />
          <span className="feetfield__suffix">{t("pledge_meters_suffix")}</span>
        </div>
        <div className="quickset">
          {quick.map(q=>(
            <button key={q} className={feet===q?"on":""} onClick={()=>setFeet(clampFeet(q))}>{q} m</button>
          ))}
        </div>
      </div>

      {err && <p className="warn">{err}</p>}

      <div className="pledge__cost">
        <span className="l">{t("pledge_cost_l", { n: ft })}</span>
        <span className="v"><LKR>{fmt(cost)}</LKR></span>
      </div>

      <button className="btn btn--primary btn--block" onClick={submit} disabled={remaining<=0}>
        {remaining<=0 ? t("btn_full") : <>{t("btn_pledge_these", { n: ft })} <Ico d={ICONS.arrow} style={{width:18,height:18}}/></>}
      </button>
      <p className="pledge__note">{remaining>0 ? t("note_open", { n: fmt(remaining) }) : t("note_done")}</p>
    </div>
  );
}

/* ===================== PAVER SECTION ===================== */
function Paver({ pledges, pavedFeet, pct, remaining, onPledge, justPledged, setJustPledged }) {
  const { t, lang } = useT();
  return (
    <section className="section paver" id="road">
      <div className="wrap">
        <div className="center" style={{maxWidth:720, margin:"0 auto"}}>
          <p className="kicker kicker--center">{t("paver_kicker")}</p>
          {lang !== "si" && <h2 className="title"><Em k="paver_title" t={t} cls="h-em" /></h2>}
          {lang !== "si" && <p className="lede">{t("paver_lede")}</p>}
        </div>

        {/* 1 · Pledge a stretch */}
        <div className="paver__pledge">
          <PledgeCard
            remaining={remaining}
            onPledge={onPledge}
            justPledged={justPledged}
            onReset={() => setJustPledged(null)}
          />
        </div>

        {/* 2 · Road progress (the same panel as the floating button opens) */}
        <div className="progress-inline" id="progress">
          <div className="progress-inline__panel">
            <div className="pmodal__head">
              <p className="kicker kicker--center">{t("prog_kicker")}</p>
              <h3>{t("watch_a")}<em>{t("watch_em")}</em>{t("watch_b")}</h3>
              <div className="pmodal__big">{t("prog_big", { n: fmt(pavedFeet), pct })}</div>
            </div>
            <VRoad pledges={pledges} />
          </div>
        </div>

        {/* 3 · Supporters */}
        <Donors pledges={pledges} />
      </div>
    </section>
  );
}

function Donors({ pledges }) {
  const { t } = useT();
  const ordered = pledges.slice().reverse();
  return (
    <div className="donors">
      <div className="donors__head">
        <h4>{t("donors_h4")}</h4>
        <span className="donors__count">{t("donors_count", { n: pledges.length })}</span>
      </div>
      <div className="donorgrid">
        {ordered.map((p) => (
          <div className="donorcard" key={p.id}>
            <div className="donorcard__ft">{p.feet}<small>{t("donor_unit")}</small></div>
            <div className="donorcard__nm">
              {p.name}
              {p.message && <div className="msg">“{p.message}”</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== BUDGET ===================== */
function Budget({ pavedFeet, pledgedLKR }) {
  const { t } = useT();
  const total = PROJECT.totalBudget;
  const pledgedPct = Math.min(100, (pledgedLKR / total) * 100);
  const remaining = Math.max(0, total - pledgedLKR);

  return (
    <section className="section budget" id="budget">
      <div className="wrap budget__grid">
        <div>
          <p className="kicker">{t("budget_kicker")}</p>
          <h2 className="title"><Em k="budget_title" t={t} cls="h-em" /></h2>
          <p className="lede" style={{marginBottom: 30}}>{t("budget_lede")}</p>
          <div className="bigbar">
            <div className="bigbar__track">
              <div className="bigbar__done" style={{width: pledgedPct + "%"}} />
            </div>
            <div className="bigbar__labels">
              <span>{t("budget_pct_pledged", { pct: Math.round(pledgedPct) })}</span>
              <span>{t("budget_goal")}<LKR>{fmt(total)}</LKR></span>
            </div>
          </div>
        </div>

        <div className="budrows">
          <div className="budrow budrow--total">
            <div className="budrow__l"><span className="budrow__chip" style={{background:"var(--paper-3)"}} />
              <div className="budrow__k">{t("budget_total_k")}<small>{t("budget_total_sub")}</small></div></div>
            <div className="budrow__v"><LKR>{fmt(total)}</LKR></div>
          </div>
          <div className="budrow">
            <div className="budrow__l"><span className="budrow__chip" style={{background:"var(--forest)"}} />
              <div className="budrow__k">{t("budget_pledged_k")}<small>{t("budget_pledged_sub", { n: fmt(pavedFeet) })}</small></div></div>
            <div className="budrow__v"><LKR>{fmt(pledgedLKR)}</LKR></div>
          </div>
          <div className="budrow">
            <div className="budrow__l"><span className="budrow__chip" style={{background:"var(--paper-3)", boxShadow:"inset 0 0 0 1.5px var(--gravel)"}} />
              <div className="budrow__k">{t("budget_remaining_k")}<small>{t("budget_remaining_sub", { n: fmt(PROJECT.totalFeet - pavedFeet) })}</small></div></div>
            <div className="budrow__v"><LKR>{fmt(remaining)}</LKR></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== CTA + FOOTER ===================== */
function CTA() {
  const { t, lang } = useT();
  return (
    <section className="section cta">
      <div className="wrap center">
        <div className="cta__lotus"><Lotus /></div>
        <p className="kicker kicker--center">{t("cta_kicker")}</p>
        {lang !== "si" && <h2><Em k="cta_h2" t={t} italic /></h2>}
        <p className="lede">{t("cta_lede")}</p>
        <div className="cta__cta">
          <a className="btn btn--saffron" href="#road">{t("btn_pledge_meter")} <Ico d={ICONS.arrow} style={{width:18,height:18}}/></a>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <Lotus className="brand__mark" />
          <span className="brand__txt">
            <span className="brand__name" style={{fontFamily:"var(--display)",fontSize:18}}>Rideekanda Forest Monastery</span>
            <span className="brand__sub" style={{fontSize:10.5,letterSpacing:".18em",textTransform:"uppercase"}}>Road Construction Project</span>
          </span>
        </div>
        <small>A community Dhāna offering · 610 m concrete road · LKR 8,878 per linear meter</small>
      </div>
    </footer>
  );
}

/* ===================== TOAST ===================== */
function Toast({ msg, show }) {
  return (
    <div className={"toast" + (show ? " show" : "")}>
      <Ico d={ICONS.check} style={{width:18,height:18}} /> {msg}
    </div>
  );
}

/* ===================== VERTICAL CARPET ROAD ===================== */
const ROLL_MS = 1300;
function VRoad({ pledges }) {
  const { t } = useT();
  const total = PROJECT.totalFeet;
  const ordered = pledges.slice();
  let cursor = 0;
  const spans = ordered.map((p) => {
    const start = cursor; cursor += p.feet;
    return { ...p, start, end: cursor, mid: start + p.feet / 2 };
  });
  const pledgedFeet = cursor;
  const blankFeet = total - pledgedFeet;

  const [active, setActive] = useState(null);
  const [caret, setCaret] = useState(null);
  const [rolling, setRolling] = useState(true);
  const [roadH, setRoadH] = useState(0);
  const stageRef = useRef(null);

  useEffect(() => {
    const tm = setTimeout(() => setRolling(false), ROLL_MS + 80);
    return () => clearTimeout(tm);
  }, []);

  // Measure the road height so labels can be spaced apart (collision avoidance).
  useEffect(() => {
    const measure = () => {
      const el = stageRef.current && stageRef.current.querySelector(".vroad-track");
      if (el) setRoadH(el.getBoundingClientRect().height);
    };
    measure();
    const tm = setTimeout(measure, ROLL_MS + 200);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(tm); window.removeEventListener("resize", measure); };
  }, []);

  // Stack labels with a vertical gap so neighbouring pledges don't overlap.
  // The gap ADAPTS: with few pledges it stays roomy, but as more names come in
  // it squeezes them together so they all fit within the road height instead of
  // spilling off the top. The font shrinks in step so tight rows stay legible.
  const GAP_MAX = 24; // roomy spacing when there are only a handful of names
  const GAP_MIN = 11; // tightest we'll normally squeeze to before shrinking type
  const labelPos = {};
  let labelGap = GAP_MAX;
  if (roadH > 0 && spans.length) {
    const sorted = spans.slice().sort((a, b) => a.mid - b.mid);
    const n = sorted.length;
    // Largest gap that still lets every label fit inside the road height; capped
    // at GAP_MAX. min() shrinks it as n grows so the names pack in.
    const fitGap = n > 1 ? roadH / (n - 1) : GAP_MAX;
    labelGap = Math.min(GAP_MAX, fitGap);

    // Bottom-up pass: keep at least labelGap between neighbouring centres. Since
    // labelGap <= fitGap, the whole stack fits within roadH by construction.
    let last = -Infinity;
    sorted.forEach((s) => {
      let c = (s.mid / total) * roadH;
      if (c - last < labelGap) c = last + labelGap;
      labelPos[s.id] = c;
      last = c;
    });
    // Guard: if the bottom-most natural position nudged the top past the road,
    // pull the whole stack down so nothing spills off the top edge.
    const overflow = labelPos[sorted[n - 1].id] - roadH;
    if (overflow > 0) sorted.forEach((s) => { labelPos[s.id] -= overflow; });
  }
  // Scale the label type down once the rows get tight so squeezed names don't
  // collide vertically (kept between ~8.5px and the default 12px).
  const labelFs = Math.max(8.5, Math.min(12, labelGap * 0.85));

  function locate(e) {
    const el = stageRef.current; if (!el) return;
    const road = el.querySelector(".vroad-track");
    const rect = road.getBoundingClientRect();
    const fracFromBottom = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    setCaret(fracFromBottom * 100);
    // If the pointer is over a pledge label, highlight that pledge directly and
    // snap the caret to that pledge's actual spot on the road (works for mouse
    // hover and for dragging a finger across the labels).
    const over = document.elementFromPoint(e.clientX, e.clientY);
    const labelEl = over && over.closest && over.closest(".vlabel");
    if (labelEl && labelEl.dataset.segId) {
      const seg = spans.find((s) => s.id === labelEl.dataset.segId);
      if (seg) setCaret((seg.mid / total) * 100);
      setActive(labelEl.dataset.segId);
      return;
    }
    const ft = fracFromBottom * total;
    const hit = spans.find((s) => ft >= s.start && ft < s.end);
    setActive(hit ? hit.id : null);
  }
  function clear() { setActive(null); setCaret(null); }
  function start(e) {
    const el = stageRef.current;
    // Don't capture the pointer for touch — that would swallow the vertical
    // scroll gesture the mobile road now relies on to reveal every name.
    if (e.pointerType !== "touch" && el && el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch (_) {} }
    locate(e);
  }
  // On touch, let a drag scroll the road instead of scrubbing the caret; a tap
  // (pointerdown) still highlights its segment.
  function move(e) { if (e.pointerType !== "touch") locate(e); }
  function leave(e) { if (!e || e.pointerType !== "touch") clear(); }

  return (
    <div className="vstage" ref={stageRef} style={{ "--vn": spans.length }}
      onPointerDown={start} onPointerMove={move}
      onPointerCancel={clear} onPointerLeave={leave}>
      <div className="vlegend">
        <span><i className="vleg--pledged" /> {t("vleg_pledged")} <b>{fmt(pledgedFeet)}{" "}m</b></span>
        <span><i className="vleg--open" /> {t("vleg_open")} <b>{fmt(blankFeet)}{" "}m</b></span>
      </div>
      <div className={"vroad" + (rolling ? " vroad--rolling" : "")} style={{ "--roll-ms": ROLL_MS + "ms" }}>
        <span className="vcap vcap--bot">0 m</span>
        <span className="vcap vcap--top">610 m</span>
        <div className="vroad-track">
          <div className="vroad-surface">
            {spans.map((s) => (
              <div key={s.id}
                className={"vseg vseg--pledged" + (active === s.id ? " is-active" : "")}
                style={{ bottom: (s.start / total) * 100 + "%", height: (s.feet / total) * 100 + "%" }} />
            ))}
          </div>
          {/* jagged "road continues" edge at the top of the pledged stretch */}
          {!rolling && pledgedFeet > 0 && pledgedFeet < total && (
            <div className="vroad-edge" style={{ bottom: (pledgedFeet / total) * 100 + "%" }} />
          )}
        </div>
        {rolling && <div className="vroad-roll" />}
        {caret != null && (
          <React.Fragment>
            <div className="vcaret-glow" style={{ bottom: caret + "%" }} />
            <div className="vcaret" style={{ bottom: caret + "%" }} />
          </React.Fragment>
        )}

        {spans.map((s) => {
          const isActive = active === s.id;
          const delay = (s.mid / total) * ROLL_MS + 180;
          return (
            <div key={"l" + s.id}
              data-seg-id={s.id}
              className={"vlabel vlabel--pledged" + (isActive ? " is-active" : "")}
              style={{ bottom: (roadH > 0 && labelPos[s.id] != null ? labelPos[s.id] + "px" : (s.mid / total) * 100 + "%"), transform: "translateY(50%)" + (isActive ? " scale(1.16)" : ""), fontSize: (isActive ? undefined : labelFs + "px"), animationDelay: delay + "ms" }}>
              <span><span className="vlabel__ft">{s.feet}m</span> {s.name}</span>
              <span className="vlabel__dot" />
              <span className="vlabel__tick" style={{ top: "50%" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== FLOATING PROGRESS BUTTON ===================== */
function ProgressFab({ pct, onClick }) {
  const { t } = useT();
  return (
    <button className="fab" onClick={onClick} aria-label={t("fab_aria")}>
      <span className="fab__ring" style={{ "--p": pct }}>
        <span className="fab__pct">{pct}<small>%</small></span>
      </span>
      <span className="fab__txt">
        <b>{t("fab_title")}</b>
        <span>{t("fab_sub")}</span>
      </span>
    </button>
  );
}

/* ===================== PROGRESS MODAL ===================== */
function ProgressModal({ open, onClose, pledges, pct, pavedFeet }) {
  const { t } = useT();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!open) { setMounted(false); return; }
    const r = requestAnimationFrame(() => setMounted(true));
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(r); window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={"pmodal" + (mounted ? " is-open" : "")} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pmodal__panel">
        <button className="pmodal__close" onClick={onClose} aria-label={t("modal_close_aria")}>
          <Ico d="M6 6l12 12M18 6L6 18" style={{ width: 18, height: 18 }} />
        </button>
        <div className="pmodal__head">
          <p className="kicker kicker--center">{t("modal_kicker")}</p>
          <h3>{t("watch_a")}<em>{t("watch_em")}</em>{t("watch_b")}</h3>
          <div className="pmodal__big">{t("prog_big", { n: fmt(pavedFeet), pct })}</div>
        </div>
        <VRoad pledges={pledges} />
      </div>
    </div>
  );
}

/* ===================== APP ===================== */
function App() {
  const [pledges, setPledges] = useState(loadPledges);
  const [justPledged, setJustPledged] = useState(null);
  const [newId, setNewId] = useState(null);
  const [toast, setToast] = useState({ msg: "", show: false });
  const [progressOpen, setProgressOpen] = useState(false);
  const [lang, setLang] = useState(loadLang);
  const toastTimer = useRef(null);

  const t = useMemo(() => makeT(lang), [lang]);

  // Persist language, set <html lang>, and keep the "සිංහල"/"English" menu
  // toggle labels in sync (the eco-header may render after React mounts).
  useEffect(() => {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    function syncLabels() {
      document.querySelectorAll('a[href$="#sinhala"]').forEach(function (a) {
        a.classList.add("notranslate");
        a.setAttribute("translate", "no");
        a.textContent = lang === "si" ? "English" : "සිංහල";
      });
    }
    syncLabels();
    let n = 0;
    const id = setInterval(() => { syncLabels(); if (++n >= 15) clearInterval(id); }, 200);
    return () => clearInterval(id);
  }, [lang]);

  // Bridge for the eco-header menu link (outside React) to toggle language.
  useEffect(() => {
    window.rkToggleLang = () => setLang((l) => (l === "si" ? "en" : "si"));
    return () => { try { delete window.rkToggleLang; } catch (e) {} };
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(pledges)); } catch (e) {}
  }, [pledges]);

  // Load the live, shared pledge list from the Google Sheet (if configured).
  // Falls back silently to the seed + localStorage if unreachable.
  useEffect(() => {
    if (!PLEDGE_ENDPOINT) return;
    fetch(PLEDGE_ENDPOINT)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const rows = (d && d.pledges) || (Array.isArray(d) ? d : null);
        if (!rows) return; // malformed response → keep seed/local fallback
        // Live Sheet is authoritative: even an empty list replaces the seed,
        // so an empty Sheet shows an honest empty road, not fake samples.
        const mapped = rows
          .filter((x) => x && Number(x.meters || x.feet) > 0)
          .map((x, i) => ({ id: "g" + i, name: x.name || "Anonymous", feet: Number(x.meters || x.feet) || 0, message: x.message || "" }));
        setPledges(mapped);
      })
      .catch(() => {});
  }, []);

  function flash(msg) {
    setToast({ msg, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((tt) => ({ ...tt, show: false })), 2800);
  }

  const pavedFeet = useMemo(() => pledges.reduce((s, p) => s + p.feet, 0), [pledges]);
  const remaining = Math.max(0, PROJECT.totalFeet - pavedFeet);
  const pct = Math.round((pavedFeet / PROJECT.totalFeet) * 100);
  const pledgedLKR = pavedFeet * PROJECT.costPerFoot;

  function handlePledge({ name, feet }) {
    const id = "p" + Date.now();
    const p = { id, name, feet };
    setPledges((list) => [...list, p]);
    postPledge(p);                                   // save to the Google Sheet
    setJustPledged(p);
    setNewId(id);
    flash(t("toast_reserved", { n: feet }));
    setTimeout(() => { const el = document.getElementById("road"); if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" }); }, 60);
  }

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {/* Shared eco-header + eco-footer (injected into <body>) replace the
          page's own Nav/Footer, so they aren't rendered here. */}
      <Hero stats={{ pavedFeet: fmt(pavedFeet), pct }} />
      <About />
      <Tech />
      <Paver
        pledges={pledges} pavedFeet={pavedFeet} pct={pct} remaining={remaining}
        onPledge={handlePledge}
        justPledged={justPledged} setJustPledged={setJustPledged}
      />
      <Budget pavedFeet={pavedFeet} pledgedLKR={pledgedLKR} />
      <CTA />
      <Toast msg={toast.msg} show={toast.show} />
      <ProgressFab pct={pct} onClick={() => setProgressOpen(true)} />
      <ProgressModal
        open={progressOpen} onClose={() => setProgressOpen(false)}
        pledges={pledges} pct={pct} pavedFeet={pavedFeet}
      />
    </LangContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
