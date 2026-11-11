// Rideekanda — admin page
const { useState, useEffect, useMemo, useRef } = React;
const SEED_ITEMS = window.RIDEEKANDA_ITEMS;
const ICONS = window.ICONS;
const fmtLKR = (n) => n.toLocaleString("en-LK", { maximumFractionDigits: 0 });
const pad2 = (n) => String(n).padStart(2, "0");

// Number fields hold whatever is typed, INCLUDING the empty string, so the
// value can be cleared and retyped. Storing a number instead is what made the
// old quantity field impossible to edit: clearing it gave "", `+""` is 0,
// `0 || 1` snapped it straight back to 1, and the next keystroke landed beside
// that 1 — type 0 and you got 10, type 1 and you got 11. The value is coerced
// back to a number on blur and again on save, so nothing downstream sees text.
const numOr = (v, fallback, min) => {
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return fallback;
  return n < min ? min : n;
};
const asQty   = (v) => Math.round(numOr(v, 1, 1));
const asPrice = (v) => numOr(v, 0, 0);


const PRIORITIES = [
  { id: "urgent", label: "Urgent" },
  { id: "need", label: "Needed" },
  { id: "routine", label: "Routine" },
];

const ICON_OPTIONS = ["robe","bowl","vial","stick","fan","grain","cup","lantern","lamp","candle","book","tile","brick","filter","leaf","net"];

function emptyDraft() {
  return { en: "", si: "", desc: "", price: 0, qty: 1, priority: "need", icon: "bowl", photo: "" };
}

// No passcode here any more. It lives in the database, where a visitor
// cannot read it, and is checked by admin_ok(). What is typed below is kept
// in memory for this tab and sent with each admin write, so the database —
// not this file — decides whether the write happens.

function PasscodeGate({ onUnlock }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const ok = await window.sbCheckAdminCode(code);
    setBusy(false);
    if (ok) {
      window.sbSetAdminCode(code);
      onUnlock();
    } else {
      setError(true);
      setCode("");
      inputRef.current && inputRef.current.focus();
    }
  };
  return (
    <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--paper)"}}>
      <form onSubmit={submit} style={{textAlign:"center", maxWidth:340, padding:40}}>
        <img src="images/rideekanda-logo.png" alt="" style={{width:72, marginBottom:24, opacity:0.85}} />
        <div style={{fontFamily:"var(--serif)", fontSize:26, marginBottom:6}}>Administration</div>
        <div className="si" style={{color:"var(--muted)", fontSize:13, marginBottom:28}}>පරිපාලන පුවරුව</div>
        <label style={{display:"block", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--muted)", marginBottom:8, textAlign:"left"}}>Enter passcode</label>
        <input
          ref={inputRef}
          type="password"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(false); }}
          placeholder="••••••••••••"
          autoComplete="off"
          style={{width:"100%", textAlign:"center", fontSize:18, letterSpacing:"0.12em", padding:"12px 10px", fontFamily:"var(--mono)", boxSizing:"border-box"}}
        />
        {error && <div style={{color:"var(--priority-urgent)", fontSize:13, marginTop:10}}>Incorrect passcode. Try again.</div>}
        <button type="submit" className="btn-primary" style={{marginTop:20, width:"100%"}}>Unlock</button>
      </form>
    </div>
  );
}

function AdminApp() {
  // Not remembered across a reload, deliberately: the passcode is held in
  // memory only, and a tab that believed it was unlocked without it would
  // meet NOT_AUTHORISED on every save.
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const fileRef = useRef(null);
  const editCardRef = useRef(null);

  useEffect(() => {
    if (!authed) return;
    window.sbFetchItems().then((rows) => {
      setItems(rows.length ? rows : SEED_ITEMS);
      setLoading(false);
    });
  }, [authed]);

  const stats = useMemo(() => {
    let qty = 0, value = 0, pledgedValue = 0, urgent = 0, fulfilled = 0;
    for (const it of items) {
      qty += it.qty;
      value += it.qty * it.price;
      pledgedValue += (it.pledged || 0) * it.price;
      if (it.priority === "urgent") urgent += 1;
      if ((it.pledged || 0) >= it.qty) fulfilled += 1;
    }
    return { qty, value, pledgedValue, urgent, fulfilled, count: items.length };
  }, [items]);

  if (!authed) return <PasscodeGate onUnlock={() => setAuthed(true)} />;

  function startEdit(item) {
    setEditingId(item.id);
    setDraft({ ...emptyDraft(), ...item });
    setTimeout(() => editCardRef.current && editCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }
  function startNew() {
    setEditingId("new");
    setDraft(emptyDraft());
    setTimeout(() => editCardRef.current && editCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }
  async function save() {
    if (!draft.en.trim()) return;
    // Blur may not have fired (Publish clicked straight from the field), so
    // coerce here too rather than trusting the form to have tidied itself.
    const clean = { ...draft, qty: asQty(draft.qty), price: asPrice(draft.price) };
    if (editingId === "new") {
      const created = await window.sbInsertItem(clean);
      if (created) setItems([created, ...items]);
    } else {
      const updated = await window.sbUpdateItem(editingId, clean);
      if (updated) setItems(items.map(i => i.id === editingId ? updated : i));
    }
    setEditingId(null);
    setDraft(emptyDraft());
  }
  function cancel() { setEditingId(null); setDraft(emptyDraft()); }
  async function remove(id) {
    if (!confirm("Remove this requirement?")) return;
    const ok = await window.sbDeleteItem(id);
    if (ok) setItems(items.filter(i => i.id !== id));
    if (editingId === id) cancel();
  }
  // Fully pledged items drop off the public page (it filters on pledged < qty).
  // This clears the pledged count so the item is listed publicly again — used
  // for recurring needs (rice, oil, candles…) once the previous lot is used up.
  // Past pledges stay on record in the `pledges` table; only the counter resets.
  async function republish(item) {
    const msg = `Push "${item.en}" back to the public requirements page?\n\n` +
      `Its pledge count (${item.pledged || 0} of ${item.qty}) resets to zero, so the full ` +
      `quantity is requested again. The record of who pledged before is kept.`;
    if (!confirm(msg)) return;
    const updated = await window.sbUpdateItem(item.id, { pledged: 0 });
    if (updated) setItems(items.map(i => i.id === item.id ? updated : i));
  }
  function onPhotoPick(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 480;
        const ratio = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const cv = document.createElement("canvas");
        cv.width = w; cv.height = h;
        cv.getContext("2d").drawImage(img, 0, 0, w, h);
        setDraft(d => ({ ...d, photo: cv.toDataURL("image/jpeg", 0.82) }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(f);
  }
  function clearPhoto() { setDraft(d => ({ ...d, photo: "" })); }
  async function resetSeed() {
    if (!confirm("Reload all items from the database?")) return;
    const rows = await window.sbFetchItems();
    if (rows.length) setItems(rows);
    cancel();
  }

  return (
    <React.Fragment>
      <header className="masthead">
        <div className="masthead-inner">
          <a className="brand" href="./index.html">
            <img className="brand-mark" src="images/rideekanda-logo.png" alt="" />
            <div className="brand-text">
              <span className="en">Rideekanda Forest Monastery</span>
              <span className="si">රිදීකන්ද ආරණ්‍ය සේනාසනය</span>
            </div>
          </a>
          <nav className="masthead-nav">
            <a className="nav-link" href="./index.html">Requirements</a>
            <a className="nav-link" href="../index.html">Monastery</a>
            <a className="nav-link active" href="./admin.html">Admin</a>
            <a className="donate-cta" href="../donate/" target="_blank" rel="noopener">Donate</a>
          </nav>
        </div>
      </header>

      <main className="admin-shell">
        <div className="admin-header">
          <h2>Administration</h2>
          <span className="admin-sub">· internal · maintained by saṅgha office</span>
          <button className="btn-ghost" onClick={resetSeed} style={{marginLeft:"auto"}}>↺ Reset to sample</button>
        </div>

        <div className="admin-stats">
          <div className="stat-block">
            <div className="summary-label">Total items</div>
            <div className="summary-value mono">{pad2(stats.count)}</div>
          </div>
          <div className="stat-block">
            <div className="summary-label">Urgent flag</div>
            <div className="summary-value mono" style={{color:"var(--priority-urgent)"}}>{pad2(stats.urgent)}</div>
          </div>
          <div className="stat-block">
            <div className="summary-label">Fulfilled</div>
            <div className="summary-value mono" style={{color:"var(--priority-routine)"}}>{pad2(stats.fulfilled)}</div>
          </div>
          <div className="stat-block">
            <div className="summary-label">Total qty</div>
            <div className="summary-value mono">{stats.qty}</div>
          </div>
          <div className="stat-block">
            <div className="summary-label">Approx. value</div>
            <div className="summary-value">LKR {fmtLKR(stats.value)}</div>
          </div>
          <div className="stat-block">
            <div className="summary-label">Pledged</div>
            <div className="summary-value" style={{color:"var(--accent)"}}>LKR {fmtLKR(stats.pledgedValue)}</div>
          </div>
        </div>

        <div className="admin-grid">
          <aside>
            <div className="admin-card" ref={editCardRef}>
              <div className="eyebrow">{editingId === "new" ? "New Requirement" : editingId ? "Edit Requirement" : "Add a Requirement"}</div>
              <h3>{editingId === "new" ? "Add to the list" : editingId ? (draft.en || "Editing…") : "Begin a new entry"}</h3>
              {!editingId && (
                <React.Fragment>
                  <p style={{color:"var(--ink-soft)", fontSize:14, marginTop:8, lineHeight:1.5}}>
                    Use this form to publish a fresh item to the public requirements page, or click any row on the right to edit it.
                  </p>
                  <button className="btn-primary" style={{marginTop:18}} onClick={startNew}>+ New Item</button>
                </React.Fragment>
              )}
              {editingId !== null && (
                <div style={{marginTop:18}}>
                  {/* Photo uploader */}
                  <div className="field">
                    <label>Photo</label>
                    <div style={{display:"flex", gap:14, alignItems:"flex-start", marginTop:6}}>
                      <div className="thumb" style={{width:96, height:96, flexShrink:0, background: draft.photo ? "var(--rule-soft)" : "var(--accent-tint)"}}>
                        {draft.photo
                          ? <img src={draft.photo} alt="" />
                          : (ICONS[draft.icon] || ICONS.bowl)}
                      </div>
                      <div style={{flex:1, display:"flex", flexDirection:"column", gap:8}}>
                        <input ref={fileRef} type="file" accept="image/*" onChange={onPhotoPick} style={{display:"none"}} />
                        <button type="button" className="pledge-btn" style={{alignSelf:"flex-start"}} onClick={() => fileRef.current && fileRef.current.click()}>
                          {draft.photo ? "Replace photo" : "Upload photo"}
                        </button>
                        {draft.photo && (
                          <button type="button" className="btn-ghost" style={{padding:"6px 10px", alignSelf:"flex-start", fontSize:11}} onClick={clearPhoto}>Remove photo</button>
                        )}
                        <div style={{fontSize:11, color:"var(--muted)", lineHeight:1.5}}>
                          JPG or PNG · auto-resized to 480 px.<br/>If no photo, a glyph is shown.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <label>Name (English)</label>
                    <input value={draft.en} onChange={(e) => setDraft({...draft, en: e.target.value})} placeholder="Outer robe (Cīvara)" />
                  </div>
                  <div className="field">
                    <label>Name (Sinhala)</label>
                    <input className="si" value={draft.si} onChange={(e) => setDraft({...draft, si: e.target.value})} placeholder="පිට සිවුර" />
                  </div>
                  <div className="field">
                    <label>Description</label>
                    <textarea value={draft.desc} onChange={(e) => setDraft({...draft, desc: e.target.value})} placeholder="A short note for sponsors." />
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label>Quantity</label>
                      <input type="number" min={1} step={1} value={draft.qty}
                             onFocus={(e) => e.target.select()}
                             onChange={(e) => setDraft({...draft, qty: e.target.value})}
                             onBlur={() => setDraft(d => ({...d, qty: asQty(d.qty)}))} />
                    </div>
                    <div className="field">
                      <label>Per cost (LKR)</label>
                      <input type="number" min={0} value={draft.price}
                             onFocus={(e) => e.target.select()}
                             onChange={(e) => setDraft({...draft, price: e.target.value})}
                             onBlur={() => setDraft(d => ({...d, price: asPrice(d.price)}))} />
                    </div>
                  </div>
                  <div className="field">
                    <label>Approx. total</label>
                    <div style={{fontFamily:"var(--serif)", fontSize:24, color:"var(--accent-deep)", fontFeatureSettings:'"tnum"', padding:"4px 0"}}>
                      LKR {fmtLKR((draft.qty || 0) * (draft.price || 0))}
                    </div>
                  </div>
                  <div className="field">
                    <label>Priority</label>
                    <select value={draft.priority} onChange={(e) => setDraft({...draft, priority: e.target.value})}>
                      {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                  </div>

                  <div className="modal-actions" style={{marginTop:22, justifyContent:"flex-end"}}>
                    <button className="btn-ghost" onClick={cancel}>Cancel</button>
                    <button className="btn-primary" onClick={save}>{editingId === "new" ? "Publish" : "Save Changes"}</button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          <section>
            <div style={{display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:14}}>
              <h3 style={{fontFamily:"var(--serif)", fontWeight:500, fontSize:22, margin:0}}>
                Current Requirements
                <span style={{color:"var(--muted)", fontSize:14, letterSpacing:"0.12em", textTransform:"uppercase", marginLeft:8}}>{items.length} items</span>
              </h3>
              {editingId === null && (
                <button className="btn-primary" onClick={startNew}>+ New</button>
              )}
            </div>
            <div>
              {items.length === 0 && (
                <div className="empty" style={{padding:"40px 0"}}>No items yet. Add one using the form on the left.</div>
              )}
              {items.map(it => {
                const pledged = it.pledged || 0;
                const fulfilled = pledged >= it.qty;
                return (
                <div className={`admin-list-row${fulfilled ? " is-fulfilled" : ""}`} key={it.id}
                  style={editingId === it.id ? {background:"var(--accent-tint)", padding:"14px 12px"} : null}>
                  <div className="thumb">
                    {it.photo ? <img src={it.photo} alt="" /> : (ICONS[it.icon] || ICONS.bowl)}
                  </div>
                  <div>
                    <div className="name">{it.en}</div>
                    <div className="name-si si">{it.si}</div>
                    <div style={{display:"flex", gap:8, marginTop:4, alignItems:"center", flexWrap:"wrap"}}>
                      <span className={`priority-pill priority-${it.priority}`}>{it.priority === "urgent" ? "Urgent" : it.priority === "need" ? "Needed" : "Routine"}</span>
                      <span style={{fontSize:11, color:"var(--muted)", fontFeatureSettings:'"tnum"'}}>
                        · LKR {fmtLKR(it.price)} ea
                      </span>
                      {fulfilled && <span className="priority-pill pill-fulfilled">Fulfilled</span>}
                    </div>
                    {/* Pledge state — and, once fulfilled, why the item is no longer
                        on the public page plus the way to put it back. */}
                    <div className="admin-pledge-line">
                      <span className="mono">{pledged}/{it.qty} pledged</span>
                      {fulfilled && <span className="off-web">· hidden from the public page</span>}
                      {fulfilled && (
                        <button className="btn-republish" onClick={() => republish(it)}
                          title="Clear the pledge count so this item is listed publicly again">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3H15" /><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.7-3H9" />
                          </svg>
                          Push back to web
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mini-num">{it.qty}</div>
                    <div className="mini-label">Qty</div>
                  </div>
                  <div>
                    <div className="mini-num">LKR {fmtLKR(it.qty * it.price)}</div>
                    <div className="mini-label">Total</div>
                  </div>
                  <div className="admin-actions">
                    <button className="icon-btn" title="Edit" onClick={() => startEdit(it)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                    <button className="icon-btn" title="Remove" onClick={() => remove(it.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6 M14 11v6 M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-mark">Rideekanda Forest Monastery</div>
            <div className="footer-meta si" style={{marginTop:4}}>රිදීකන්ද ආරණ්‍ය සේනාසනය · උඩස්ගිරිය, මාතලේ</div>
          </div>
          <div className="footer-meta" style={{textAlign:"right"}}>
            <div>Admin · saṅgha office</div>
            <div><a href="./index.html">← Public requirements page</a></div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}

window.RideekandaAdmin = AdminApp;
