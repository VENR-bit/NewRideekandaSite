// Rideekanda Forest Monastery — spatial launcher prototype
// Honeycomb cluster of circular tiles with proximity-based fisheye scaling.
// Drag to wander · tap a satellite to bring it to center · tap the centered tile to open.

const { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } = React;

// ──────────────────────────────────────────────────────────────
// Tile dataset. Positions are filled by buildLayout(). Colors are
// hand-picked earthy/saffron tones meant to harmonise with the
// monastery's warm-deep backdrop.
// ──────────────────────────────────────────────────────────────
const DEFAULT_TILES = [
  // CENTER — Ring 0
  { id: 'home', label: 'Rideekanda WEB', sub: 'Official Website of the Rideekanda Forest Monastery',
    url: '../', size: 178, ring: 0,
    bg: 'radial-gradient(circle at 35% 30%, #4a2e16 0%, #1c100a 80%)',
    halo: 'rgba(224, 183, 106, 0.45)', fg: '#f4e1b8', icon: 'home' },

  // RING 1 — primary destinations
  { id: 'booking', label: 'Retreat Booking', sub: 'Reserve a stay for retreat',
    url: '../book-your-stay/', size: 132, ring: 1,
    bg: 'radial-gradient(circle at 30% 25%, #a06a2a 0%, #5a3210 85%)',
    halo: 'rgba(217, 155, 74, 0.35)', fg: '#f6e0bd', icon: 'calendar' },

  { id: 'threestory', label: 'Project ThreeStory Building', sub: 'Ongoing Construction of ThreeStory Building with Meditation Hall and Accommodations',
    url: '../projects/threestory/', size: 82, ring: 2,
    bg: 'radial-gradient(circle at 30% 25%, #5a4020 0%, #2a1c0c 85%)',
    halo: 'rgba(200, 160, 80, 0.32)', fg: '#f0ddb8', icon: 'threeStory' },

  { id: 'requirements', label: 'Monastery Requirements', sub: 'Necessary Items needed for Rideekanda',
    url: '../requirements/', size: 132, ring: 1,
    bg: 'radial-gradient(circle at 30% 25%, #6a4e26 0%, #2e1f0c 85%)',
    halo: 'rgba(204, 160, 92, 0.32)', fg: '#f0e0bd', icon: 'list' },

  { id: 'herbal-plants', label: 'Herbal Plant Planting', sub: 'Choose a medicinal plant, bring it, and plant it in the monastery grounds',
    url: '../projects/herbal-plants/', size: 82, ring: 2,
    bg: 'radial-gradient(circle at 30% 25%, #3c5a30 0%, #16240f 85%)',
    halo: 'rgba(140, 190, 110, 0.34)', fg: '#dcecc9', icon: 'herbalPlant' },

  { id: 'library', label: 'Project Library Cafe', sub: 'Ongoing Project to build a Library Cafe in Rideekanda',
    url: '../projects/library-cafe/', size: 82, ring: 2,
    bg: 'radial-gradient(circle at 30% 25%, #4a5a30 0%, #1e2812 85%)',
    halo: 'rgba(160, 180, 100, 0.32)', fg: '#e8e6c8', icon: 'book' },

  { id: 'donate', label: 'Dāna | Donation', sub: 'Your contributions allow the monastery to center its programs and outreach',
    url: '../donate/', size: 132, ring: 1,
    bg: 'radial-gradient(circle at 30% 25%, #7a3018 0%, #3a1808 85%)',
    halo: 'rgba(217, 130, 74, 0.32)', fg: '#f0c8a8', icon: 'hands' },

  { id: 'news', label: 'News & Events', sub: 'Happenings, observances, and announcements from the monastery',
    url: '../news-and-events/', size: 82, ring: 2,
    bg: '#3a3018', fg: '#f0e2bd', icon: 'feather' },

  { id: 'videos', label: 'Video Gallery', sub: 'Films, dhamma, and life from the hillside — watch in-page',
    url: '../videos/', size: 82, ring: 2,
    bg: '#3a2218', fg: '#f0cdbd', icon: 'play' },

  // RING 2 — secondary links
  { id: 'photos', label: 'Photo Gallery', sub: 'Photo Gallery from Google Maps',
    url: '../gallery/',
    size: 82, ring: 2,
    bg: '#2a3624', fg: '#dee0c0', icon: 'image' },
  { id: 'map', label: 'Map', sub: 'Google location on Rideekanda',
    url: 'https://maps.app.goo.gl/3Gb3nt8qaPqdSTgB9', size: 56, ring: 3,
    bg: '#2a2418', fg: '#e8d6b0', icon: 'pin' },
  { id: 'contact', label: 'Contact', sub: 'Contact Us on Email | WhatsApp | Tel',
    url: '../contact/', size: 82, ring: 2,
    bg: '#2a261a', fg: '#d4c8a4', icon: 'mail' },
  { id: 'sinhala', label: 'සිංහල වෙබ්', sub: 'රිදීකන්ද වෙබ් පිටුවට සිංහලෙන්',
    url: 'https://www.rideekanda.com/?lan=sn', size: 82, ring: 2,
    bg: '#3a2a3a', fg: '#e0c8d4', icon: 'sinhala' },
  { id: 'suttas-en', label: 'Sutta Archive', sub: 'Reading Suttas in English',
    url: 'https://suttacentral.net/?lang=en', size: 82, ring: 2,
    bg: '#4a3818', fg: '#ecd8a8', icon: 'scroll' },
  { id: 'suttas-si', label: 'සුත්‍ර පිටකය', sub: 'සුත්‍ර පිටකය සිංහලෙන්',
    url: 'https://pitaka.lk/main/', size: 82, ring: 2,
    bg: '#3a3018', fg: '#e6d4a8', icon: 'suttaPitaka' },
  { id: 'retreat-program', label: 'Retreat Program', sub: 'Details of Ongoing Retreats',
    url: '../retreat-center/', size: 132, ring: 1,
    bg: 'radial-gradient(circle at 30% 25%, #7a4424 0%, #3a1c0a 85%)',
    halo: 'rgba(217, 150, 90, 0.32)', fg: '#fbdcc0', icon: 'retreat' },
  { id: 'monastery', label: 'Monastery', sub: 'About Monastery',
    url: '../monastery/', size: 132, ring: 1,
    bg: 'radial-gradient(circle at 30% 25%, #3a5028 0%, #18240e 85%)',
    halo: 'rgba(150, 180, 100, 0.32)', fg: '#dce0c4', icon: 'tree' },
  { id: 'reviews', label: 'Reviews', sub: 'Reviews on Rideekanda',
    url: '../reviews/',
    size: 132, ring: 1,
    bg: 'radial-gradient(circle at 30% 25%, #4a3818 0%, #1e1608 85%)',
    halo: 'rgba(200, 170, 80, 0.32)', fg: '#e6c888', icon: 'star' },

  // RING 3 — tertiary / accent
  { id: 'admin', label: 'Admin', sub: 'Admin Panel',
    url: 'admin.html', size: 56, ring: 3,
    bg: '#252028', fg: '#b0a8b0', icon: 'settings' },
  { id: 'facebook', label: 'Facebook', sub: '/rideekandaforest',
    url: 'https://www.facebook.com/rideekandaforest', size: 56, ring: 3,
    bg: '#1c2238', fg: '#b0c0e0', icon: 'facebook' },
  { id: 'instagram', label: 'Instagram', sub: '/rideekanda.monastery/',
    url: 'https://www.instagram.com/rideekanda.monastery/', size: 56, ring: 3,
    bg: '#38202a', fg: '#e0b0c0', icon: 'instagram' },
  { id: 'google-profile', label: 'Google Profile', sub: 'Google Profiles',
    url: 'https://share.google/gXH0xqwl9PWo2iQOd', size: 56, ring: 3,
    bg: '#2a2a2a', fg: '#d4d4d4', icon: 'google' },
  { id: 'dhamma', label: 'Dhamma Talks', sub: 'Video Recordings of Teachings',
    url: 'https://drive.google.com/drive/folders/1ITnaTnLj3Ntx9erkMFhGeSMVdWy9mU7t?usp=drive_link', size: 56, ring: 3,
    bg: '#3a2818', fg: '#e6d4ae', icon: 'lotus' },
  { id: 'audio', label: 'Audio Library', sub: 'Guided Audio Recording of Jhāna Meditation',
    url: 'https://drive.google.com/drive/folders/10QOiPGjkCcWODUnI-kKiNLqWdcpSpMRq?usp=drive_link', size: 56, ring: 3,
    bg: '#2a2018', fg: '#d4c4a0', icon: 'wave' },
  { id: 'youtube', label: 'YouTube', sub: '/RideekandaForestMonastery',
    url: 'https://youtube.com/c/RideekandaForestMonastery', size: 56, ring: 3,
    bg: '#8a2a18', fg: '#fbe2cb', icon: 'play' },
  { id: 'projects', label: 'Projects', sub: 'Building & design initiatives at Rideekanda',
    url: '../projects/', size: 132, ring: 1,
    bg: 'radial-gradient(circle at 30% 25%, #4a5a30 0%, #1e2812 85%)',
    halo: 'rgba(160, 180, 100, 0.32)', fg: '#e8e6c8', icon: 'tree' },
];
window.DEFAULT_TILES = DEFAULT_TILES;

function buildLayout(tilesData, density) {
  const R1 = 240 * density;
  const R2 = 410 * density;
  const R3 = 540 * density;
  const tiles = tilesData.map(t => ({ ...t, x: 0, y: 0 }));
  const ring1 = tiles.filter(t => t.ring === 1);
  const ring2 = tiles.filter(t => t.ring === 2);
  const ring3 = tiles.filter(t => t.ring === 3);
  ring1.forEach((t, i) => {
    const a = (i / ring1.length) * Math.PI * 2 - Math.PI / 2;
    t.x = Math.cos(a) * R1; t.y = Math.sin(a) * R1;
  });
  ring2.forEach((t, i) => {
    const a = (i / ring2.length) * Math.PI * 2 - Math.PI / 2 + Math.PI / ring2.length;
    t.x = Math.cos(a) * R2; t.y = Math.sin(a) * R2;
  });
  ring3.forEach((t, i) => {
    const a = (i / ring3.length) * Math.PI * 2 - Math.PI / 2 + Math.PI / ring3.length / 2;
    t.x = Math.cos(a) * R3; t.y = Math.sin(a) * R3;
  });
  return tiles;
}

// Smooth step easing
const smoothstep = (t) => t * t * (3 - 2 * t);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

// ──────────────────────────────────────────────────────────────
// Hook: lerped pan position. setTarget moves the cluster toward
// (x, y); the actual pan eases toward it every frame.
// ──────────────────────────────────────────────────────────────
function useLerpedPan(stiffness = 0.16) {
  const targetRef = useRef({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panRef = useRef(pan);
  panRef.current = pan;

  useEffect(() => {
    let rafId;
    const tick = () => {
      const tx = targetRef.current.x;
      const ty = targetRef.current.y;
      const cur = panRef.current;
      const dx = tx - cur.x;
      const dy = ty - cur.y;
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        const next = { x: cur.x + dx * stiffness, y: cur.y + dy * stiffness };
        panRef.current = next;
        setPan(next);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [stiffness]);

  const setTarget = useCallback((x, y) => {
    targetRef.current = { x, y };
  }, []);
  const nudgeTarget = useCallback((dx, dy) => {
    targetRef.current = {
      x: targetRef.current.x + dx,
      y: targetRef.current.y + dy,
    };
  }, []);
  const snapTo = useCallback((x, y) => {
    targetRef.current = { x, y };
    panRef.current = { x, y };
    setPan({ x, y });
  }, []);
  return { pan, setTarget, nudgeTarget, snapTo, targetRef, panRef };
}

// ──────────────────────────────────────────────────────────────
// Tile component (memoised). Receives final transform values and
// renders the visual chrome only — no math here.
// ──────────────────────────────────────────────────────────────
const Tile = React.memo(function Tile({ tile, x, y, scale, opacity, isFocal, onPointer }) {
  const Icon = Icons[tile.icon] || Icons.list;
  const iconSize = Math.round(tile.size * 0.42);
  const tileClass = 'tile' + (tile.ring === 0 ? ' tile--home' : '') + (isFocal ? ' focal' : '');
  return (
    <div
      className={tileClass}
      data-id={tile.id}
      style={{
        width: tile.size,
        height: tile.size,
        marginLeft: -tile.size / 2,
        marginTop: -tile.size / 2,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity,
        zIndex: Math.round(200 - (tile.ring || 0) * 10 + (isFocal ? 100 : 0)),
        '--halo': tile.halo || 'rgba(45,74,50,0.22)',
      }}
      onPointerUp={(e) => onPointer(e, tile)}
    >
      <div className="tile-inner">
        <div className="tile-icon">
          <Icon size={iconSize} />
        </div>
        <div className="tile-rim" />
      </div>
      <div className="tile-label">{tile.label}</div>
    </div>
  );
});

// ──────────────────────────────────────────────────────────────
// Honeycomb stage — owns the pan state and dispatches drag /
// click events. Math runs once per frame via panRef in render.
// ──────────────────────────────────────────────────────────────
function Honeycomb({ tweaks, tilesData, onAdminToggle, onFocalChange }) {
  const stageRef = useRef(null);
  const tiles = useMemo(() => buildLayout(tilesData, tweaks.density), [tilesData, tweaks.density]);
  const { pan, setTarget, nudgeTarget, snapTo, panRef, targetRef } = useLerpedPan(0.16);
  const [dragging, setDragging] = useState(false);

  // Auto-snap to a tile id ('home' on first load)
  const [focalId, setFocalIdState] = useState('home');
  const focalIdRef = useRef('home');
  const setFocalId = (id) => { focalIdRef.current = id; setFocalIdState(id); };

  const onAdminToggleRef = useRef(onAdminToggle);
  onAdminToggleRef.current = onAdminToggle;

  // Drag handling
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let active = false;
    let lastX = 0, lastY = 0;
    let movedDist = 0;
    let pointerId = null;
    let focalAtDown = null;
    // Velocity tracking for momentum
    let vx = 0, vy = 0;
    let lastMoveTime = 0;
    let momentumRaf = null;

    const updateFocal = () => {
      const px = targetRef.current.x;
      const py = targetRef.current.y;
      let best = null, bestD = Infinity;
      for (const t of tiles) {
        const sx = t.x + px;
        const sy = t.y + py;
        const d = sx * sx + sy * sy;
        if (d < bestD) { bestD = d; best = t; }
      }
      if (best) setFocalId(best.id);
    };

    const onDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      // Cancel any ongoing momentum
      if (momentumRaf) { cancelAnimationFrame(momentumRaf); momentumRaf = null; }
      active = true;
      pointerId = e.pointerId;
      lastX = e.clientX; lastY = e.clientY;
      movedDist = 0;
      vx = 0; vy = 0;
      lastMoveTime = Date.now();
      focalAtDown = focalIdRef.current;
      setDragging(true);
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
    };
    const onMove = (e) => {
      if (!active) return;
      const now = Date.now();
      const dt = Math.max(now - lastMoveTime, 1);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      lastMoveTime = now;
      movedDist += Math.abs(dx) + Math.abs(dy);
      // Track velocity (pixels per ms, smoothed)
      const mix = 0.4;
      vx = vx * (1 - mix) + (dx / dt) * mix;
      vy = vy * (1 - mix) + (dy / dt) * mix;
      // Direct: bypass the lerp during drag so dragging feels 1:1
      targetRef.current = {
        x: targetRef.current.x + dx,
        y: targetRef.current.y + dy,
      };
      // also push pan immediately so it doesn't lag visibly
      panRef.current = {
        x: panRef.current.x + dx * 0.92,
        y: panRef.current.y + dy * 0.92,
      };
    };
    const onUp = (e) => {
      if (!active) return;
      active = false;
      setDragging(false);
      if (movedDist > 14) {
        // Apply momentum — coast with decaying velocity, then snap
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > 0.15) {
          // Scale velocity to pixels per frame (~16ms)
          let mvx = vx * 16;
          let mvy = vy * 16;
          const friction = 0.92;
          const coast = () => {
            mvx *= friction;
            mvy *= friction;
            targetRef.current = {
              x: targetRef.current.x + mvx,
              y: targetRef.current.y + mvy,
            };
            if (Math.abs(mvx) > 0.3 || Math.abs(mvy) > 0.3) {
              momentumRaf = requestAnimationFrame(coast);
            } else {
              momentumRaf = null;
              updateFocal();
            }
          };
          momentumRaf = requestAnimationFrame(coast);
        } else {
          updateFocal();
        }
      } else {
        el.releasePointerCapture && pointerId != null && el.releasePointerCapture(pointerId);
        const tapped = document.elementFromPoint(e.clientX, e.clientY);
        const tileEl = tapped && tapped.closest('.tile');
        if (tileEl) {
          const hitId = tileEl.dataset.id;
          const hit = tiles.find(t => t.id === hitId);
          if (hit) {
            const wasFocal = (hitId === focalAtDown);
            const px = targetRef.current.x;
            const py = targetRef.current.y;
            const sx = hit.x + px;
            const sy = hit.y + py;
            const distFromCenter = Math.sqrt(sx * sx + sy * sy);
            if (wasFocal && distFromCenter < 40) {
              if (hit.id === 'admin' && onAdminToggleRef.current) {
                onAdminToggleRef.current();
              } else if (hit.url && !hit.url.startsWith('#')) {
                (/^https?:/i.test(hit.url) ? window.open(hit.url, '_blank', 'noopener') : (window.location.href = hit.url));
              }
            } else {
              targetRef.current = { x: -hit.x, y: -hit.y };
              setFocalId(hit.id);
            }
          }
        }
      }
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (momentumRaf) cancelAnimationFrame(momentumRaf);
    };
  }, [tiles, targetRef, panRef]);

  // Wheel = pan
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const dx = -e.deltaX;
      const dy = -e.deltaY;
      targetRef.current = {
        x: targetRef.current.x + dx,
        y: targetRef.current.y + dy,
      };
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [targetRef]);

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e) => {
      const step = 60;
      if (e.key === 'ArrowLeft')  nudgeTarget(step, 0);
      else if (e.key === 'ArrowRight') nudgeTarget(-step, 0);
      else if (e.key === 'ArrowUp') nudgeTarget(0, step);
      else if (e.key === 'ArrowDown') nudgeTarget(0, -step);
      else if (e.key === 'Escape' || e.key === 'Home') { setTarget(0, 0); setFocalId('home'); }
      else if (e.key === 'Enter') {
        const t = tiles.find(x => x.id === focalIdRef.current);
        if (t && t.url && !t.url.startsWith('#')) (/^https?:/i.test(t.url) ? window.open(t.url, '_blank') : (window.location.href = t.url));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nudgeTarget, setTarget, tiles]);

  // Tile pointer-up: pan to it on tap; if already focal, open
  // This handler is mostly a fallback for desktop; the stage onUp handles most taps.
  const handleTilePointer = useCallback((e, tile) => {
    // Only open if this tile was already the focal tile before interaction
    const sx = tile.x + targetRef.current.x;
    const sy = tile.y + targetRef.current.y;
    const dist = Math.sqrt(sx * sx + sy * sy);
    const wasFocal = (tile.id === focalIdRef.current);
    if (wasFocal && dist < 40) {
      if (tile.id === 'admin' && onAdminToggle) {
        onAdminToggle();
        return;
      }
      if (tile.url && !tile.url.startsWith('#')) {
        (/^https?:/i.test(tile.url) ? window.open(tile.url, '_blank', 'noopener') : (window.location.href = tile.url));
      } else {
        const el = e.currentTarget;
        el.animate(
          [{ transform: el.style.transform + ' translateZ(0)' },
           { transform: el.style.transform + ' translateZ(0) scale(1.06)' },
           { transform: el.style.transform + ' translateZ(0)' }],
          { duration: 240, easing: 'ease-out' }
        );
      }
    } else {
      // Pan to bring this tile to center
      setTarget(-tile.x, -tile.y);
      setFocalId(tile.id);
    }
  }, [setTarget, targetRef]);

  // Compute per-frame transforms. Re-renders happen via pan state.
  const intensity = tweaks.intensity;
  const maxDist = 540;
  const minScale = lerp(1, 0.25, intensity);
  const computed = tiles.map((t, i) => {
    const sx = t.x + pan.x;
    const sy = t.y + pan.y;
    const dist = Math.sqrt(sx * sx + sy * sy);
    const t01 = clamp(dist / maxDist, 0, 1);
    const eased = smoothstep(t01);
    const scale = lerp(1, minScale, eased);
    // Radial inward pull at the edges — fisheye
    const pull = tweaks.fisheye ? eased * 0.18 : 0;
    const x = sx * (1 - pull);
    const y = sy * (1 - pull);
    const opacity = lerp(1, 0.45, eased);
    return { tile: t, x, y, scale, opacity, dist };
  });

  // Determine focal tile (closest to viewport center)
  let focalIdx = 0; let focalD = Infinity;
  for (let i = 0; i < computed.length; i++) {
    if (computed[i].dist < focalD) { focalD = computed[i].dist; focalIdx = i; }
  }
  const focalTile = computed[focalIdx].tile;
  const isFocalCenter = focalD < 60;

  useEffect(() => {
    if (onFocalChange) onFocalChange(focalTile, isFocalCenter);
  }, [focalTile.id, isFocalCenter]);

  // Update compass dot + click to recenter
  useEffect(() => {
    const dot = document.getElementById('compass-dot');
    if (!dot) return;
    const k = 0.06;
    dot.setAttribute('cx', String(clamp(pan.x * k, -22, 22)));
    dot.setAttribute('cy', String(clamp(pan.y * k, -22, 22)));
  }, [pan.x, pan.y]);

  useEffect(() => {
    const compass = document.querySelector('.compass');
    if (!compass) return;
    const onClick = () => {
      const home = tiles.find(t => t.ring === 0) || tiles[0];
      if (home) {
        setTarget(-home.x, -home.y);
        setFocalId(home.id);
      }
    };
    compass.addEventListener('click', onClick);
    return () => compass.removeEventListener('click', onClick);
  }, [tiles, setTarget]);

  return (
    <>
      <div ref={stageRef} className={'stage' + (dragging ? ' dragging' : '')}>
        {computed.map(({ tile, x, y, scale, opacity }) => (
          <Tile
            key={tile.id}
            tile={tile}
            x={x}
            y={y}
            scale={scale}
            opacity={opacity}
            isFocal={tile.id === focalTile.id && focalD < 60}
            onPointer={handleTilePointer}
          />
        ))}
      </div>

    </>
  );
}

function FocalReadout({ tile, isCenter }) {
  if (!tile) return null;
  return (
    <div className="focal-bar" style={{ opacity: isCenter ? 1 : 0.4, transition: 'opacity 0.4s ease' }}>
      <span>{tile.label}</span>
      {tile.sub && <><span className="focal-sep">·</span><span>{tile.sub}</span></>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Root
// ──────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "palette": ((new Date().getHours() >= 6 && new Date().getHours() < 18) ? "paper" : "night"),
    "intensity": 0.7,
    "density": 0.78,
    "fisheye": true
  }/*EDITMODE-END*/);

  const [tiles, tileActions] = useTiles();
  const [adminMode, setAdminMode] = useState(false);
  const [focal, setFocal] = useState({ tile: null, isCenter: false });
  const handleFocalChange = useCallback((tile, isCenter) => {
    setFocal({ tile, isCenter });
  }, []);

  const handleAdminToggle = useCallback(() => {
    if (adminMode) {
      setAdminMode(false);
      return;
    }
    const pin = prompt('Enter admin PIN:');
    if (pin === window.ADMIN_PIN) {
      setAdminMode(true);
    } else if (pin !== null) {
      alert('Incorrect PIN.');
    }
  }, [adminMode]);

  useLayoutEffect(() => {
    const isDark = t.palette === 'night';
    const themeBg = isDark ? '#1f1a14' : '#f4ede0';
    document.body.classList.toggle('dark', isDark);
    // Mirror the theme background onto <html> so any strip iOS Safari
    // exposes (collapsing toolbar / safe area) matches the palette
    // instead of showing white. Also keep the theme-color meta + the
    // root color-scheme in sync so Safari's toolbar/canvas follow.
    document.documentElement.style.background = themeBg;
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    const tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute('content', themeBg);
    const toggleEl = document.getElementById('theme-toggle');
    if (toggleEl) {
      const ico = toggleEl.querySelector('.tt-ico');
      if (ico) {
        const SUN  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M3.5 3.5l1.8 1.8M18.7 18.7l1.8 1.8M2 12h2.5M19.5 12H22M3.5 20.5l1.8-1.8M18.7 5.3l1.8-1.8"/></svg>';
        const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.2A8 8 0 1 1 9.8 4 6.4 6.4 0 0 0 20 14.2z"/></svg>';
        ico.innerHTML = isDark ? MOON : SUN;
      }
      toggleEl.setAttribute('aria-label', isDark ? 'Night — tap to switch to day' : 'Day — tap to switch to night');
    }
  }, [t.palette]);

  // ── Auto day/night with manual override ──────────────────────────
  // The theme follows the time of day automatically. If someone taps the
  // toggle, their choice is held for 60s, then auto-switching resumes.
  const paletteRef = useRef(t.palette);
  paletteRef.current = t.palette;
  const manualUntilRef = useRef(0);   // timestamp; auto is paused until then

  // Daytime 06:00–17:59 → 'paper' (Day); otherwise → 'night'.
  const autoPalette = useCallback(() => {
    const h = new Date().getHours();
    return (h >= 6 && h < 18) ? 'paper' : 'night';
  }, []);

  // Toggle button → manual choice, hold for 60s.
  useEffect(() => {
    const toggleEl = document.getElementById('theme-toggle');
    if (!toggleEl) return;
    const onClick = () => {
      manualUntilRef.current = Date.now() + 60000; // pause auto for 1 minute
      setTweak('palette', paletteRef.current === 'night' ? 'paper' : 'night');
    };
    toggleEl.addEventListener('click', onClick);
    return () => toggleEl.removeEventListener('click', onClick);
  }, [setTweak]);

  // Auto controller: align to the time of day on load, then keep checking.
  useEffect(() => {
    const apply = () => {
      if (Date.now() < manualUntilRef.current) return;   // manual override active
      const want = autoPalette();
      if (paletteRef.current !== want) setTweak('palette', want);
    };
    apply(); // set correct theme immediately on first load
    const id = setInterval(apply, 15000); // re-check every 15s
    return () => clearInterval(id);
  }, [autoPalette, setTweak]);

  return (
    <>
      <Honeycomb tweaks={t} tilesData={tiles} onAdminToggle={handleAdminToggle} onFocalChange={handleFocalChange} />
      {/* Strips live INSIDE #root so they sit above the tiles but below the
          focal readout (bottom text). #root is its own stacking layer, so a
          body-level strip would cover everything inside it instead. */}
      <div className="strip strip-top" aria-hidden="true" />
      <div className="strip strip-bottom" aria-hidden="true" />
      <FocalReadout tile={focal.tile} isCenter={focal.isCenter} />
      <AdminPanel open={adminMode} onClose={() => setAdminMode(false)}
                  tiles={tiles} actions={tileActions} />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette" />
        <TweakRadio label="Mood" value={t.palette}
          options={[
            { value: 'paper', label: 'Paper' },
            { value: 'night', label: 'Night' },
          ]}
          onChange={(v) => setTweak('palette', v)} />

        <TweakSection label="Motion" />
        <TweakSlider label="Fisheye intensity" value={t.intensity}
          min={0.2} max={0.95} step={0.05}
          onChange={(v) => setTweak('intensity', v)} />
        <TweakToggle label="Radial pull (bowl)" value={t.fisheye}
          onChange={(v) => setTweak('fisheye', v)} />

        <TweakSection label="Layout" />
        <TweakSlider label="Cluster density" value={t.density}
          min={0.7} max={1.4} step={0.05}
          onChange={(v) => setTweak('density', v)} />
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
