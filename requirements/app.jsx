// Rideekanda — main wishlist app

const { useState, useEffect, useMemo } = React;
const ITEMS = window.RIDEEKANDA_ITEMS;
const ICONS = window.ICONS;

const fmtLKR = (n) => n.toLocaleString("en-LK", { maximumFractionDigits: 0 });

// The pledge quantity holds whatever is typed, including "", so the field can
// be cleared and retyped; clamping a number on every keystroke meant the 1
// could never be deleted and the next digit landed beside it (1 -> 10, 11).
// Coerced to a number on blur and again on submit.
const asQty = (v, max) => {
  const n = Math.round(parseFloat(v));
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(max, n));
};
const pad2 = (n) => String(n).padStart(2, "0");

function ItemThumb({ photo, icon, priority }) {
  const tag = priority === "urgent" ? "Urgent" : priority === "need" ? "Needed" : null;
  return (
    <div className="thumb">
      {photo ? <img src={photo} alt="" /> : (ICONS[icon] || ICONS.bowl)}
      {tag && <span className="thumb-tag">{tag}</span>}
    </div>
  );
}

function PriorityPill({ priority }) {
  if (priority === "urgent") return <span className="priority-pill priority-urgent">Urgent</span>;
  if (priority === "need")   return <span className="priority-pill priority-need">Needed</span>;
  return <span className="priority-pill priority-routine">Routine</span>;
}

function ItemTile({ item, onPledge }) {
  const complete = item.pledged >= item.qty;
  const pct = Math.min(100, (item.pledged / item.qty) * 100);
  const total = item.qty * item.price;
  return (
    <div className="item-tile">
      <div className="tile-thumb">
        {item.photo ? <img src={item.photo} alt="" /> : (ICONS[item.icon] || ICONS.bowl)}
      </div>
      <div className="tile-body">
        <h3 className="tile-name">{item.en}</h3>
        <div className="tile-name-si si">{item.si}</div>
        {item.desc && <div className="tile-desc">{item.desc}</div>}
        <div className="tile-tags">
          <PriorityPill priority={item.priority} />
        </div>
        <div className="tile-numbers">
          <div className="tile-stat">
            <span className="tile-stat-label">Qty</span>
            <span className="tile-stat-value">{item.qty}</span>
          </div>
          <div className="tile-stat">
            <span className="tile-stat-label">Per item</span>
            <span className="tile-stat-value"><span className="lkr">LKR</span> {fmtLKR(item.price)}</span>
          </div>
          <div className="tile-stat tile-stat-total">
            <span className="tile-stat-label">Total</span>
            <span className="tile-stat-value"><span className="lkr">LKR</span> {fmtLKR(total)}</span>
          </div>
        </div>
        <div className="tile-progress">
          <div className="tile-progress-info">
            <span>{item.pledged}/{item.qty} pledged</span>
          </div>
          <div className="progress-bar">
            <span className="progress-bar-fill" style={{width:`${pct}%`, background: complete ? "var(--priority-routine)" : "var(--accent)"}} />
          </div>
        </div>
        <button
          className={`pledge-btn tile-pledge ${complete ? "complete" : ""}`}
          onClick={() => onPledge(item)}
          disabled={complete}
        >
          {complete ? "Fulfilled" : "Pledge"}
        </button>
      </div>
    </div>
  );
}

function PledgeModal({ item, onClose, onConfirm }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [phase, setPhase] = useState("form");
  const remaining = item ? item.qty - item.pledged : 0;
  useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  if (!item) return null;
  const submit = (e) => {
    e.preventDefault();
    // Settle the typed value once, here, so the pledge sent and the receipt
    // shown are the same number even after `remaining` shrinks behind us.
    const n = asQty(qty, remaining);
    setQty(n);
    onConfirm(item, n, name);
    setPhase("success");
  };
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {phase === "form" && (
          <form onSubmit={submit}>
            <div className="modal-eyebrow">Pledge to Provide</div>
            <h2>{item.en}</h2>
            <div className="h2-si">{item.si}</div>
            <p style={{color:"var(--ink-soft)", marginTop:18, marginBottom:0, fontSize:14, lineHeight:1.55}}>
              Reserve {remaining} of these for the saṅgha. We'll show your name as a sponsor (or "Anonymous" if you prefer)
              and contact you with delivery details.
            </p>
            <div className="row">
              <div style={{flex:2}}>
                <label>Your name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Anonymous" />
              </div>
              <div style={{flex:1}}>
                <label>Quantity</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  max={remaining}
                  value={qty}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setQty(e.target.value)}
                  onBlur={() => setQty(q => asQty(q, remaining))}
                />
              </div>
            </div>
            <div style={{marginTop:18, padding:"14px 16px", background:"var(--accent-tint)", display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
              <span style={{fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--accent-deep)"}}>Approximate value</span>
              <span style={{fontFamily:"var(--serif)", fontSize:22, color:"var(--accent-deep)", fontFeatureSettings:"\"tnum\""}}>LKR {fmtLKR(item.price * asQty(qty, remaining))}</span>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary">Confirm Pledge</button>
            </div>
          </form>
        )}
        {phase === "success" && (
          <div className="modal-success">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="32" cy="32" r="26" />
              <path d="M20 32 L28 40 L44 24" />
            </svg>
            <h3>Sādhu, sādhu, sādhu.</h3>
            <p style={{marginTop:8}}>Your pledge of {qty} × <em>{item.en}</em> has been recorded.</p>
            <p className="si" style={{color:"var(--ink-soft)", marginTop:4}}>ඔබගේ පින්කම සටහන් විය.</p>
            <div className="modal-actions" style={{justifyContent:"center", marginTop:24}}>
              <button className="btn-primary" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "urgent", label: "Most Urgent" },
  { id: "price-low", label: "Price: Low → High" },
  { id: "price-high", label: "Price: High → Low" },
  { id: "name", label: "Name A–Z" },
];

const PRIORITY_RANK = { urgent: 0, need: 1, routine: 2 };

/* Placeholder tiles shown while the requirements load. */
function SkeletonTile() {
  return (
    <div className="skel-tile" aria-hidden="true">
      <div className="skel-img" />
      <div className="skel-body">
        <div className="skel-line skel-title" />
        <div className="skel-line skel-sub" />
        <div className="skel-line skel-desc" />
        <div className="skel-pill" />
        <div className="skel-line skel-nums" />
        <div className="skel-btn" />
      </div>
    </div>
  );
}

function App() {
  // Start empty, not with the data.js demo list — seeding it here made the
  // sample items (robes, alms bowls…) flash on screen before the real
  // requirements arrived from Supabase. Skeletons cover the wait instead.
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("urgent");
  const [search, setSearch] = useState("");
  const [pledgeFor, setPledgeFor] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("rq-theme") || "saffron");
  const [mode, setMode] = useState(localStorage.getItem("rq-mode") || "day");
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    window.sbFetchItems().then((rows) => {
      if (rows.length) setItems(rows);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("rq-theme", theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
    localStorage.setItem("rq-mode", mode);
  }, [mode]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.data) return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  const totals = useMemo(() => {
    let qty = 0, value = 0, pledgedValue = 0, pledgedCount = 0;
    for (const it of items) {
      qty += it.qty;
      value += it.qty * it.price;
      pledgedCount += it.pledged || 0;
      pledgedValue += (it.pledged || 0) * it.price;
    }
    return { qty, value, pledgedValue, pledgedCount, remaining: value - pledgedValue, count: items.length };
  }, [items]);

  const filtered = useMemo(() => {
    let out = items.filter(it => it.pledged < it.qty);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(it => it.en.toLowerCase().includes(q) || (it.si || "").includes(search) || (it.desc || "").toLowerCase().includes(q));
    }
    out.sort((a, b) => {
      if (sort === "newest") return a.addedDays - b.addedDays;
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "name") return a.en.localeCompare(b.en);
      return (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) || (a.addedDays - b.addedDays);
    });
    return out;
  }, [items, search, sort]);

  const onConfirmPledge = async (item, addQty, pledgeName) => {
    // Show it at once, then let the database decide the real total: it
    // records the pledge and moves the item's count in one call, clamping
    // the quantity to whatever is actually left.
    const optimistic = Math.min(item.qty, (item.pledged || 0) + addQty);
    setItems(items.map(it => it.id === item.id ? { ...it, pledged: optimistic } : it));
    const confirmed = await window.sbInsertPledge(item.id, pledgeName, addQty);
    if (typeof confirmed === "number") {
      setItems(prev => prev.map(it => it.id === item.id ? { ...it, pledged: confirmed } : it));
    }
  };

  return (
    <React.Fragment>
      {/* Masthead removed — unified shared header (eco-header) is used instead */}

      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">Requirements · අවශ්‍යතා ලැයිස්තුව</div>
            <h1><span className="hl-red">Items needed</span><br />for the Monastery</h1>
            <div className="hero-si">රිදීකන්ද ආරණ්‍ය සේනාසනය සඳහා අවශ්‍ය දේවල්</div>
            <p className="lede">
              An open, living list of what the forest monastery currently requires.
              Choose an item to pledge, or contribute toward general dāna.
            </p>
          </div>
        </div>
      </section>

      <div className="toolbar">
        <span className="toolbar-label">Sort</span>
        <div className="chip-group">
          {SORTS.map(s => (
            <button key={s.id} className={`chip ${sort === s.id ? "active" : ""}`} onClick={() => setSort(s.id)}>{s.label}</button>
          ))}
        </div>
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input placeholder="Search items…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <main className="items">
        {loading ? (
          <div className="items-grid" role="status" aria-label="Loading requirements">
            {[0,1,2,3,4,5].map((i) => <SkeletonTile key={i} />)}
          </div>
        ) : (
          <React.Fragment>
            {items.length === 0 && (
              <div className="empty">The requirements list is being updated. Please check back shortly.</div>
            )}
            {items.length > 0 && filtered.length === 0 && (
              <div className="empty">No items match. Try clearing the search.</div>
            )}
            <div className="items-grid">
              {filtered.map((it) => <ItemTile key={it.id} item={it} onPledge={setPledgeFor} />)}
            </div>
          </React.Fragment>
        )}
      </main>

      <footer>
        <div className="footer-totals">
          <div className="footer-totals-inner">
            <table className="totals-table">
              <thead>
                <tr>
                  <th>Items</th>
                  <th>Total Qty</th>
                  <th>Approx. Grand Total</th>
                  <th>Already Pledged</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono" data-label="Items">{loading ? "—" : pad2(totals.count)}</td>
                  <td className="mono" data-label="Total Qty">{loading ? "—" : totals.qty}</td>
                  <td data-label="Approx. Grand Total">{loading ? "—" : <React.Fragment>LKR {fmtLKR(totals.value)}</React.Fragment>}</td>
                  <td className="td-accent" data-label="Already Pledged">{loading ? "—" : <React.Fragment>LKR {fmtLKR(totals.pledgedValue)}</React.Fragment>}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </footer>

      <PledgeModal item={pledgeFor} onClose={() => setPledgeFor(null)} onConfirm={onConfirmPledge} />

      {tweaksOpen && <ThemeTweaks theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} onClose={() => setTweaksOpen(false)} />}
    </React.Fragment>
  );
}

function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-inner">
        <a className="brand" href="./index.html">
          <img className="brand-mark" src="images/rideekanda-logo.png" alt="Rideekanda Forest Monastery" />
          <div className="brand-text">
            <span className="en">Rideekanda Forest Monastery</span>
            <span className="si">රිදීකන්ද ආරණ්‍ය සේනාසනය</span>
          </div>
        </a>
        <nav className="masthead-nav">
          <a className="nav-link active" href="./index.html">Requirements</a>
          <a className="nav-link" href="../index.html">Monastery</a>
          <a className="nav-link nav-admin" href="./admin.html">Admin</a>
          <a className="donate-cta" href="../donate/" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Donate
          </a>
        </nav>
      </div>
    </header>
  );
}

const THEMES = [
  { id: "saffron", label: "Saffron", swatch: "#b56a23" },
  { id: "ochre",   label: "Ochre",   swatch: "#c8923c" },
  { id: "sage",    label: "Sage",    swatch: "#6b7a55" },
  { id: "indigo",  label: "Indigo",  swatch: "#34527a" },
  { id: "claret",  label: "Claret",  swatch: "#8c2f3a" },
];

function ThemeTweaks({ theme, setTheme, mode, setMode, onClose }) {
  const persist = (key, value) => {
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: value } }, "*");
  };
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 300,
      background: "var(--paper)", border: "1px solid var(--rule)",
      width: 260, padding: 18, boxShadow: "0 30px 60px -10px rgba(0,0,0,0.25)",
      fontFamily: "var(--sans)"
    }}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
        <span style={{fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--accent)"}}>Tweaks</span>
        <button onClick={() => { onClose(); window.parent.postMessage({type:"__edit_mode_dismissed"}, "*"); }}
          style={{background:"none", border:0, fontSize:18, color:"var(--muted)", cursor:"pointer"}}>×</button>
      </div>
      <div style={{fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--muted)", marginBottom:8}}>Accent colour</div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:8, marginBottom:18}}>
        {THEMES.map(t => (
          <button key={t.id} title={t.label}
            onClick={() => { setTheme(t.id); persist("theme", t.id); }}
            style={{
              border: theme === t.id ? "2px solid var(--ink)" : "1px solid var(--rule)",
              background: t.swatch, height: 32, cursor:"pointer", padding:0, borderRadius:2
            }} />
        ))}
      </div>
      <div style={{fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--muted)", marginBottom:8}}>Mode</div>
      <div style={{display:"flex", gap:6}}>
        {["day", "night"].map(m => (
          <button key={m}
            onClick={() => { setMode(m); persist("mode", m); }}
            style={{
              flex:1, border: mode === m ? "1px solid var(--ink)" : "1px solid var(--rule)",
              background: mode === m ? "var(--ink)" : "transparent",
              color: mode === m ? "var(--paper)" : "var(--ink-soft)",
              padding:"8px 0", fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase",
              cursor:"pointer", borderRadius:2
            }}>
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

window.RideekandaApp = App;
