// admin-panel.jsx
// Admin panel for managing honeycomb tiles — add, remove, edit tiles and assign links.
// Persists tile configuration to localStorage.

const ADMIN_PIN = '92424';
const STORAGE_KEY = 'rideekanda-tiles';
const RING_DEFAULTS = { 0: 178, 1: 132, 2: 82, 3: 56 };

// The live, published tiles (set by tiles-data.js → window.RK_TILES via the
// Publish-to-site flow). Falls back to the defaults baked into app.jsx.
function publishedTiles() {
  return (Array.isArray(window.RK_TILES) && window.RK_TILES.length)
    ? window.RK_TILES
    : window.DEFAULT_TILES;
}

// ── GitHub publishing (same token system as the news admin panel) ──
const GH = {
  owner: 'VENR-bit', repo: 'OneSite', branch: 'main', api: 'https://api.github.com',
  TOK_KEY: 'rk-gh-token',
  token() { try { return localStorage.getItem(this.TOK_KEY) || ''; } catch (e) { return ''; } },
  setToken(t) { try { t ? localStorage.setItem(this.TOK_KEY, t) : localStorage.removeItem(this.TOK_KEY); } catch (e) {} },
};
async function ghFetch(path, opts) {
  opts = opts || {};
  const headers = Object.assign({
    'Authorization': 'Bearer ' + GH.token(),
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }, opts.headers || {});
  const res = await fetch(GH.api + path, { method: opts.method || 'GET', headers, body: opts.body });
  const txt = await res.text();
  let data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) {}
  if (!res.ok) { const e = new Error((data && data.message) || ('HTTP ' + res.status)); e.status = res.status; throw e; }
  return data;
}
const ghGet = (p) => ghFetch('/repos/' + GH.owner + '/' + GH.repo + '/contents/' + encodeURI(p) + '?ref=' + GH.branch);
const ghPut = (p, contentB64, message, sha) => {
  const body = { message, content: contentB64, branch: GH.branch };
  if (sha) body.sha = sha;
  return ghFetch('/repos/' + GH.owner + '/' + GH.repo + '/contents/' + encodeURI(p),
    { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
};
function b64FromStr(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '', ch = 0x8000;
  for (let i = 0; i < bytes.length; i += ch) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + ch));
  return btoa(bin);
}
function strFromB64(b64) {
  const bin = atob(b64.replace(/\s/g, ''));
  const a = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8').decode(a);
}
async function publishTilesToSite(tiles, log) {
  log('Reading tiles-data.js & dashboard/index.html…');
  let tilesFile = null;
  try { tilesFile = await ghGet('tiles-data.js'); } catch (e) { if (e.status !== 404) throw e; }
  const indexFile = await ghGet('dashboard/index.html');

  const header =
    '/* Published dashboard tiles — managed by the dashboard Admin Panel.\n' +
    '   A non-empty window.RK_TILES overrides DEFAULT_TILES in app.jsx. */\n';
  const content = header + 'window.RK_TILES = ' + JSON.stringify(tiles, null, 2) + ';\n';
  log('Writing ' + tiles.length + ' tiles to tiles-data.js…');
  await ghPut('tiles-data.js', b64FromStr(content), 'Dashboard: update tiles (admin panel)', tilesFile && tilesFile.sha);

  const html = strFromB64(indexFile.content);
  const m = html.match(/tiles-data\.js\?v=(\d+)/);
  if (m) {
    const n = (parseInt(m[1], 10) || 0) + 1;
    const bumped = html.replace(/tiles-data\.js\?v=\d+/, 'tiles-data.js?v=' + n);
    log('Bumping cache → tiles-data.js?v=' + n + ' …');
    await ghPut('dashboard/index.html', b64FromStr(bumped), 'Dashboard: bump tiles cache to v' + n + ' (admin panel)', indexFile.sha);
  } else {
    log('Note: no tiles-data.js?v= found in index.html to bump (skipped).');
  }
  log('✓ Published! GitHub Pages is rebuilding — live in about a minute.');
}

function useTiles() {
  const [tiles, setTiles] = React.useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          // Migration: repoint the centre 'home' tile to the new homepage
          // (older saved stores pointed it at the dashboard root / monastery).
          const h = parsed.find((t) => t && t.id === 'home');
          if (h && (h.url === 'monastery/' || h.url === 'index.html' || h.url === '' || h.url === '#')) {
            h.url = 'home/';
          }
          return parsed;
        }
      }
    } catch (e) {}
    return publishedTiles();
  });

  const persist = (next) => {
    setTiles(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addTile = (tile) => {
    const id = tile.id || 'tile-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    const ring = tile.ring != null ? tile.ring : 2;
    const newTile = {
      id,
      label: tile.label || 'New Tile',
      sub: tile.sub || '',
      url: tile.url || '#',
      size: tile.size || RING_DEFAULTS[ring] || 82,
      ring,
      bg: tile.bg || '#2a2a2a',
      fg: tile.fg || '#d4d4d4',
      halo: tile.halo || '',
      icon: tile.icon || 'list',
    };
    persist([...tiles, newTile]);
    return id;
  };

  const updateTile = (id, changes) => {
    persist(tiles.map(t => t.id === id ? { ...t, ...changes } : t));
  };

  const removeTile = (id) => {
    const tile = tiles.find(t => t.id === id);
    if (tile && tile.ring === 0) return false;
    persist(tiles.filter(t => t.id !== id));
    return true;
  };

  const resetTiles = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTiles(publishedTiles());
  };

  return [tiles, { addTile, updateTile, removeTile, resetTiles }];
}

const __ADMIN_STYLE = `
  .adm-panel{position:fixed;left:16px;bottom:16px;z-index:2147483645;width:320px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.82);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .adm-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .adm-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .adm-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:8px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .adm-body::-webkit-scrollbar{width:8px}
  .adm-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .adm-ring-label{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:8px 0 2px}
  .adm-ring-label:first-child{padding-top:0}
  .adm-tile-row{display:flex;align-items:center;gap:8px;padding:5px 6px;
    border-radius:8px;cursor:pointer;transition:background .12s}
  .adm-tile-row:hover{background:rgba(0,0,0,.05)}
  .adm-tile-row.active{background:rgba(0,0,0,.08)}
  .adm-tile-icon{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;
    flex-shrink:0;overflow:hidden}
  .adm-tile-info{flex:1;min-width:0}
  .adm-tile-name{font-weight:500;font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .adm-tile-url{font-size:10px;color:rgba(41,38,27,.45);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .adm-ring-badge{font-size:9px;font-weight:600;padding:1px 5px;border-radius:4px;
    background:rgba(0,0,0,.08);color:rgba(41,38,27,.5);flex-shrink:0}
  .adm-del{appearance:none;border:0;background:transparent;color:rgba(200,60,60,.6);
    font-size:14px;cursor:pointer;padding:2px 4px;border-radius:4px;flex-shrink:0;line-height:1}
  .adm-del:hover{background:rgba(200,60,60,.1);color:rgba(200,60,60,.9)}
  .adm-editor{padding:8px 0 4px;display:flex;flex-direction:column;gap:8px;
    border-top:1px solid rgba(0,0,0,.06);margin-top:4px}
  .adm-actions{display:flex;gap:6px;padding-top:6px;border-top:1px solid rgba(0,0,0,.08)}
  .adm-actions .twk-btn{flex:1;font-size:10px}
  .adm-pub{padding-top:8px;border-top:1px solid rgba(0,0,0,.08);margin-top:6px}
  .adm-pub .adm-ring-label{padding-top:0}
  .adm-tok{width:100%;padding:6px 8px;border:1px solid rgba(0,0,0,.15);border-radius:7px;
    font-size:11px;background:#fff;color:#29261b;margin-bottom:6px;box-sizing:border-box}
  .adm-tok:focus{outline:none;border-color:rgba(156,111,58,.7)}
  .adm-log{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;line-height:1.6;
    background:rgba(0,0,0,.04);border-radius:7px;padding:7px 9px;margin-top:7px;
    max-height:130px;overflow:auto;white-space:pre-wrap}
  .adm-log .l-ok{color:#3e7d4f}
  .adm-log .l-err{color:#b4452c}
  .adm-note{font-size:9.5px;color:rgba(41,38,27,.5);margin-top:7px;line-height:1.45}
`;

const RING_NAMES = ['Center', 'Primary', 'Secondary', 'Tertiary'];

function AdminPanel({ open, onClose, tiles, actions }) {
  const [editingId, setEditingId] = React.useState(null);
  const [tokVal, setTokVal] = React.useState(() => GH.token());
  const [ghBusy, setGhBusy] = React.useState(false);
  const [ghLog, setGhLog] = React.useState([]);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });

  const pushLog = (m) => setGhLog((prev) => prev.concat(m));

  const handleTokenSave = async () => {
    GH.setToken(tokVal.trim());
    setGhLog([]);
    if (!tokVal.trim()) { pushLog('Token cleared from this browser.'); return; }
    pushLog('Verifying token & repo access…');
    setGhBusy(true);
    try {
      const r = await ghFetch('/repos/' + GH.owner + '/' + GH.repo);
      pushLog('✓ ' + r.full_name + (r.permissions && r.permissions.push ? ' — write access OK' : ' — ⚠ no write access'));
    } catch (e) {
      pushLog('✗ ' + e.message + (e.status === 404 ? ' (does the token have access to this repo?)' : ''));
    }
    setGhBusy(false);
  };

  const handlePublish = async () => {
    if (!GH.token()) { alert('Add and save a GitHub token first.'); return; }
    if (!confirm('Publish the current dashboard tiles to the live site now?')) return;
    setGhLog([]);
    setGhBusy(true);
    try {
      await publishTilesToSite(tiles, pushLog);
      GH.setToken('');
      setTokVal('');
      pushLog('🔒 Token forgotten from this browser — re-enter it next time.');
      pushLog('Tip: use “Reset” to drop local edits and load the published tiles.');
    } catch (e) {
      pushLog('✗ Publish failed: ' + e.message);
    }
    setGhBusy(false);
  };

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const PAD = 16;
    const maxLeft = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxLeft, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.left = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    window.addEventListener('resize', clampToViewport);
    return () => window.removeEventListener('resize', clampToViewport);
  }, [open, clampToViewport]);

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startLeft = r.left;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startLeft + (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const iconKeys = React.useMemo(() => {
    return Object.keys(window.Icons || {});
  }, []);

  const handleAdd = () => {
    const id = actions.addTile({});
    setEditingId(id);
  };

  const handleExport = () => {
    const json = JSON.stringify(tiles, null, 2);
    navigator.clipboard.writeText(json).then(
      () => alert('Tiles JSON copied to clipboard.'),
      () => alert('Failed to copy. Check console for output.')
    );
  };

  const handleImport = () => {
    const input = prompt('Paste tiles JSON:');
    if (!input) return;
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) throw new Error('Must be an array');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      window.location.reload();
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all tiles to defaults? This will discard your changes.')) {
      actions.resetTiles();
      setEditingId(null);
    }
  };

  if (!open) return null;

  const grouped = [0, 1, 2, 3].map(ring => ({
    ring,
    tiles: tiles.filter(t => t.ring === ring),
  }));

  return (
    <>
      <style>{__ADMIN_STYLE}</style>
      <div ref={dragRef} className="adm-panel"
           style={{ left: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="adm-hd" onMouseDown={onDragStart}>
          <b>Admin Panel</b>
          <button className="twk-x" aria-label="Close admin"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={onClose}>✕</button>
        </div>
        <div className="adm-body">
          {grouped.map(({ ring, tiles: ringTiles }) => (
            <React.Fragment key={ring}>
              <div className="adm-ring-label">Ring {ring} — {RING_NAMES[ring]}</div>
              {ringTiles.map(tile => (
                <TileRow
                  key={tile.id}
                  tile={tile}
                  editing={editingId === tile.id}
                  iconKeys={iconKeys}
                  onToggleEdit={() => setEditingId(editingId === tile.id ? null : tile.id)}
                  onUpdate={(changes) => actions.updateTile(tile.id, changes)}
                  onDelete={() => {
                    if (tile.ring === 0) {
                      alert('Cannot delete the center tile.');
                      return;
                    }
                    if (confirm(`Delete "${tile.label}"?`)) {
                      actions.removeTile(tile.id);
                      if (editingId === tile.id) setEditingId(null);
                    }
                  }}
                />
              ))}
            </React.Fragment>
          ))}

          <div style={{ paddingTop: 6 }}>
            <TweakButton label="+ Add Tile" onClick={handleAdd} />
          </div>

          <div className="adm-actions">
            <TweakButton label="Reset" onClick={handleReset} secondary />
            <TweakButton label="Export" onClick={handleExport} secondary />
            <TweakButton label="Import" onClick={handleImport} secondary />
          </div>

          <div className="adm-pub">
            <div className="adm-ring-label">Publish to site {GH.token() ? '· token saved' : '· no token'}</div>
            <input className="adm-tok" type="password" autoComplete="off" spellCheck={false}
                   placeholder="GitHub token (Contents: read & write)"
                   value={tokVal} onChange={(e) => setTokVal(e.target.value)} />
            <div className="adm-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
              <TweakButton label="Save token" onClick={handleTokenSave} secondary />
              <TweakButton label={ghBusy ? 'Working…' : 'Publish tiles'} onClick={handlePublish} />
            </div>
            {ghLog.length > 0 && (
              <div className="adm-log">
                {ghLog.map((l, i) => (
                  <div key={i} className={l[0] === '✗' ? 'l-err' : (l[0] === '✓' ? 'l-ok' : '')}>{l}</div>
                ))}
              </div>
            )}
            <div className="adm-note">
              Commits the current tiles to the repo; the site rebuilds automatically.
              The passcode only hides this panel — your GitHub token is the real key and
              is stored only in this browser.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TileRow({ tile, editing, iconKeys, onToggleEdit, onUpdate, onDelete }) {
  const Icon = Icons[tile.icon] || Icons.list;
  return (
    <div>
      <div className={'adm-tile-row' + (editing ? ' active' : '')} onClick={onToggleEdit}>
        <div className="adm-tile-icon" style={{ background: tile.bg, color: tile.fg }}>
          <Icon size={14} />
        </div>
        <div className="adm-tile-info">
          <div className="adm-tile-name">{tile.label}</div>
          <div className="adm-tile-url">{tile.url}</div>
        </div>
        <span className="adm-ring-badge">R{tile.ring}</span>
        <button className="adm-del" title="Delete tile"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}>×</button>
      </div>
      {editing && (
        <div className="adm-editor">
          <TweakText label="Label" value={tile.label || ''}
                     onChange={(v) => onUpdate({ label: v })} />
          <TweakText label="Subtitle" value={tile.sub || ''}
                     placeholder="optional"
                     onChange={(v) => onUpdate({ sub: v })} />
          <TweakText label="URL" value={tile.url || ''}
                     placeholder="https://..."
                     onChange={(v) => onUpdate({ url: v })} />
          <TweakSelect label="Icon" value={tile.icon || 'list'}
                       options={iconKeys.map(k => ({ value: k, label: k }))}
                       onChange={(v) => onUpdate({ icon: v })} />
          <TweakSelect label="Ring" value={String(tile.ring)}
                       options={[
                         { value: '0', label: '0 — Center' },
                         { value: '1', label: '1 — Primary' },
                         { value: '2', label: '2 — Secondary' },
                         { value: '3', label: '3 — Tertiary' },
                       ]}
                       onChange={(v) => {
                         const r = Number(v);
                         onUpdate({ ring: r, size: RING_DEFAULTS[r] || 82 });
                       }} />
          <TweakNumber label="Size" value={tile.size || 82}
                       min={24} max={220} step={2} unit="px"
                       onChange={(v) => onUpdate({ size: v })} />
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <TweakColor label="BG" value={tile.bg || '#2a2a2a'}
                          onChange={(v) => onUpdate({ bg: v })} />
            </div>
            <div style={{ flex: 1 }}>
              <TweakColor label="FG" value={tile.fg || '#d4d4d4'}
                          onChange={(v) => onUpdate({ fg: v })} />
            </div>
          </div>
          <TweakText label="Background CSS" value={tile.bg || ''}
                     placeholder="radial-gradient(...) or #hex"
                     onChange={(v) => onUpdate({ bg: v })} />
        </div>
      )}
    </div>
  );
}

window.useTiles = useTiles;
window.AdminPanel = AdminPanel;
window.ADMIN_PIN = ADMIN_PIN;
