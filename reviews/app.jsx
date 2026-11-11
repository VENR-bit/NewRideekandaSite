// Main app — header, layout switcher, and QR-to-review panel.
const { useState: useStateApp, useMemo: useMemoApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "grid",
  "palette": ["#f4ede0", "#fdfbf6", "#2d4a32"],
  "showQR": true,
  "showStats": true,
  "headerStyle": "centered"
}/*EDITMODE-END*/;

/* ---------- Header ---------- */

function StatsBlock({ stats, mobile }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: mobile ? 10 : 18,
        padding: mobile ? "8px 16px" : "10px 22px",
        background: "color-mix(in srgb, var(--card) 70%, transparent)",
        border: "1px solid var(--line)",
        borderRadius: 999,
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <StarRow rating={5} size={16} />
        <span style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 600, color: "var(--ink)", lineHeight: 1 }}>
          {stats.average.toFixed(1)}
        </span>
      </div>
      <div style={{ width: 1, height: 22, background: "var(--line)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <GoogleG size={16} />
        <span style={{ fontSize: 13.5, color: "var(--ink-soft)", letterSpacing: 0.1 }}>
          from <strong style={{ fontWeight: 600, color: "var(--ink)" }}>{stats.displayTotal}</strong> Google reviews
        </span>
      </div>
    </div>
  );
}

function PageHeader({ stats, style, mobile }) {
  const isCentered = style === "centered";
  return (
    <header
      style={{
        textAlign: isCentered ? "center" : "left",
        padding: mobile ? "48px 16px 28px" : "72px 24px 36px",
        maxWidth: 1280,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Home link removed — unified shared header (eco-header) + Explore launcher used instead */}
      <div style={{
        display: "flex",
        justifyContent: isCentered ? "center" : "flex-start",
        alignItems: "center",
        flexDirection: "column",
        gap: 14,
        marginBottom: 22,
      }}>
        <Lotus size={64} opacity={0.95} />
        <span style={{
          fontFamily: "var(--sans)",
          fontSize: 12,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "var(--accent)",
          fontWeight: 500,
        }}>
          Rideekanda Forest Monastery
        </span>
      </div>

      <h1
        style={{
          fontFamily: "var(--serif)",
          fontWeight: 500,
          fontSize: "clamp(44px, 6.5vw, 84px)",
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
          margin: "0 0 6px",
          color: "var(--ink)",
        }}
      >
        Words from the <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>forest</em>
      </h1>
      <p
        style={{
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: "clamp(17px, 1.8vw, 22px)",
          color: "var(--muted)",
          fontWeight: 400,
          margin: "0 0 28px",
          maxWidth: 640,
          marginLeft: isCentered ? "auto" : 0,
          marginRight: isCentered ? "auto" : 0,
        }}
      >
        Reflections from those who came, sat in silence, and walked the path with us.
      </p>

      <StatsBlock stats={stats} mobile={mobile} />
    </header>
  );
}

/* ---------- QR Panel ---------- */

function QRPanel({ url }) {
  const mobile = useIsMobile();
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&format=svg&data=${encodeURIComponent(url)}&color=1f1a14&bgcolor=fdfbf6`;
  return (
    <aside
      style={{
        margin: "64px auto 88px",
        maxWidth: 880,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 22,
          padding: mobile ? "28px 20px" : "40px 44px",
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "auto 1fr",
          gap: mobile ? 24 : 40,
          alignItems: "center",
          justifyItems: mobile ? "center" : undefined,
          boxShadow: "var(--shadow-md)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Soft watermark lotus */}
        <div style={{
          position: "absolute",
          right: -40, bottom: -40,
          opacity: 0.05,
          pointerEvents: "none",
        }}>
          <Lotus size={260} color="var(--accent)" />
        </div>

        {/* QR — also a tappable link to the Google review page */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open the review page on Google"
          style={{
            width: mobile ? 140 : 184,
            height: mobile ? 140 : 184,
            padding: mobile ? 10 : 14,
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <img
            src={qrSrc}
            alt="Scan to leave a review on Google"
            width={mobile ? 120 : 156}
            height={mobile ? 120 : 156}
            style={{ display: "block" }}
          />
        </a>

        {/* Text */}
        <div style={{ position: "relative", textAlign: mobile ? "center" : undefined }}>
          <div style={{
            fontSize: 11.5,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: "var(--accent)",
            fontWeight: 600,
            marginBottom: 10,
          }}>
            Share your experience
          </div>
          <h2 style={{
            fontFamily: "var(--serif)",
            fontWeight: 500,
            fontSize: "clamp(28px, 3vw, 38px)",
            lineHeight: 1.05,
            margin: "0 0 12px",
            letterSpacing: "-0.01em",
          }}>
            Write a review
          </h2>
          <p style={{
            color: "var(--ink-soft)",
            fontSize: 15,
            lineHeight: 1.6,
            margin: "0 0 20px",
            maxWidth: 440,
          }}>
            Scan the code with your phone, or tap the link on the QR. Your words help others find their way to the practice.
          </p>
          {mobile && <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 20px 11px 22px",
              background: "var(--accent)",
              color: "#fdfbf6",
              borderRadius: 999,
              fontFamily: "var(--sans)",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.2,
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 6px 16px -8px rgba(45,74,50,0.5)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <GoogleG size={16} />
            <span>Open on Google</span>
            <span style={{ opacity: 0.75 }}>→</span>
          </a>}
        </div>
      </div>
    </aside>
  );
}

/* ---------- Load more ---------- */

function LoadMore({ hasMore, onClick }) {
  if (!hasMore) return null;
  return (
    <div style={{ textAlign: "center", marginTop: 36 }}>
      <button
        onClick={onClick}
        style={{
          fontFamily: "var(--sans)",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          padding: "12px 26px",
          background: "transparent",
          color: "var(--ink)",
          border: "1px solid var(--ink)",
          borderRadius: 999,
          transition: "background 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--card)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; }}
      >
        Load more reviews
      </button>
    </div>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "60px 24px 40px", color: "var(--muted)", fontSize: 12.5 }}>
      <div style={{ opacity: 0.55, marginBottom: 12 }}>
        <Lotus size={28} />
      </div>
      <div style={{ letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.75 }}>
        Rideekanda Forest Monastery
      </div>
      <div style={{ marginTop: 10, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14 }}>
        May all beings be free from suffering.
      </div>
    </footer>
  );
}

/* ---------- Translation (lightweight Google Translate endpoint) ---------- */

function gtTranslate(text, tl) {
  var parts = String(text || "").split(/\n{2,}/);
  return Promise.all(parts.map(function (seg) {
    if (!seg.trim()) return Promise.resolve(seg);
    return fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" + tl + "&dt=t&q=" + encodeURIComponent(seg))
      .then(function (r) { return r.json(); })
      .then(function (j) { return (j[0] || []).map(function (x) { return x[0]; }).join(""); })
      .catch(function () { return seg; });
  })).then(function (a) { return a.join("\n\n"); });
}

function LangToggle({ lang, onSet, busy }) {
  function btn(code, label) {
    var on = lang === code;
    return (
      <button onClick={() => onSet(code)} style={{
        border: 0, background: on ? "var(--accent)" : "transparent",
        color: on ? "#fdfbf6" : "var(--muted)", cursor: "pointer",
        fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600,
        letterSpacing: 0.6, textTransform: "uppercase", padding: "7px 16px", borderRadius: 999,
      }}>{label}</button>
    );
  }
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "0 0 30px" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "color-mix(in srgb, var(--card) 70%, transparent)", border: "1px solid var(--line)", borderRadius: 999, padding: 3, backdropFilter: "blur(8px)" }}>
        <span aria-hidden="true" style={{ fontSize: 13, opacity: 0.6, padding: "0 3px 0 9px" }}>&#127760;</span>
        {btn("en", "English")}
        {btn("si", "සිංහල")}
        {busy ? <span style={{ fontSize: 11, color: "var(--muted)", padding: "0 9px 0 3px" }}>…</span> : null}
      </div>
    </div>
  );
}

/* ---------- App ---------- */

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = useStateApp(1);
  const mobile = useIsMobile();
  const perPage = t.layout === "editorial" ? 6 : 8;

  // Apply the day/night palette to CSS variables, reacting to the eco-theme
  // toggle (which sets <html data-theme>). The reviews page keeps its forest
  // green identity — lightened for readability on the night palette.
  React.useEffect(() => {
    const root = document.documentElement;
    const LIGHT = {
      "--bg": "#ece7da", "--bg-deep": "#e3dccb", "--card": "#f6f2e8",
      "--ink": "#17201a", "--ink-soft": "#48524a", "--muted": "#717a68",
      "--line": "#d9d2bf", "--accent": "#2d4a32", "--accent-soft": "#5b7a5f",
      "--gold": "#c08a3e", "--star": "#e6a93b",
    };
    const DARK = {
      "--bg": "#0c120e", "--bg-deep": "#111a14", "--card": "#151f18",
      "--ink": "#ebe6d6", "--ink-soft": "#bdbcaa", "--muted": "#8b9484",
      "--line": "rgba(235,230,214,0.15)", "--accent": "#86a98a", "--accent-soft": "#9bb89e",
      "--gold": "#d6a652", "--star": "#e6a93b",
    };
    const apply = () => {
      const P = root.getAttribute("data-theme") === "dark" ? DARK : LIGHT;
      for (const k in P) root.style.setProperty(k, P[k]);
      document.body.style.background = P["--bg"];
    };
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  // ── Live Google reviews via Featurable (auto-syncs the Google listing).
  //    Falls back to the bundled REVIEWS/STATS if the feed is unreachable. ──
  const [live, setLive] = useStateApp(null);
  React.useEffect(() => {
    const FEED = "https://api.featurable.com/v1/widgets/216da9a8-0522-432c-91f6-b1ba20c43da8";
    const PALETTE = ["#b08968","#7c8c66","#8a73c2","#6b7d8c","#a0795a","#6f8c6f","#9a6b8c","#7a8ca0","#b0895a","#6f7c8c"];
    const colorFor = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return PALETTE[h % PALETTE.length]; };
    const rel = (days) => {
      if (days <= 0) return "today";
      if (days === 1) return "yesterday";
      if (days < 30) return days + " days ago";
      const m = Math.floor(days / 30.4);
      if (m <= 1) return "a month ago";
      if (m < 12) return m + " months ago";
      const y = Math.floor(days / 365);
      return y === 1 ? "a year ago" : y + " years ago";
    };
    fetch(FEED)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!d || !d.success || !Array.isArray(d.reviews)) return;
        const reviews = d.reviews
          .filter((r) => (r.comment || "").trim() && r.reviewer && r.reviewer.displayName)
          .map((r) => {
            const name = r.reviewer.displayName.trim();
            // Use updateTime (falling back to createTime) so recently edited
            // reviews surface — matching how Featurable orders/dates them.
            let days = Math.floor((Date.now() - new Date(r.updateTime || r.createTime).getTime()) / 86400000);
            if (isNaN(days) || days < 0) days = 0;
            return {
              name,
              initial: name.charAt(0).toUpperCase(),
              color: colorFor(name),
              daysAgo: days,
              when: rel(days),
              rating: r.starRating || 5,
              text: (r.comment || "").trim(),
            };
          });
        if (!reviews.length) return;
        setLive({
          reviews,
          stats: {
            average: d.averageRating || STATS.average,
            total: reviews.length,
            displayTotal: d.totalReviewCount || STATS.displayTotal,
          },
        });
      })
      .catch(() => {});
  }, []);

  const baseReviews = live ? live.reviews : REVIEWS;
  const baseStats = live ? live.stats : STATS;
  const sorted = useMemoApp(() => [...baseReviews].sort((a, b) => a.daysAgo - b.daysAgo), [baseReviews]);
  const visible = sorted.slice(0, page * perPage);
  const hasMore = visible.length < sorted.length;

  // ── Language toggle: translate review text on demand (cached) ──
  const [lang, setLang] = useStateApp("en");
  const [tr, setTr] = useStateApp({});      // original text → Sinhala text
  const [busy, setBusy] = useStateApp(false);
  React.useEffect(() => {
    if (lang !== "si") return;
    const missing = visible.filter((r) => r.text && !(r.text in tr));
    if (!missing.length) return;
    setBusy(true);
    Promise.all(missing.map((r) => gtTranslate(r.text, "si").then((t) => [r.text, t])))
      .then((pairs) => setTr((prev) => {
        const n = Object.assign({}, prev);
        pairs.forEach((p) => { n[p[0]] = p[1]; });
        return n;
      }))
      .then(() => setBusy(false), () => setBusy(false));
  }, [lang, visible.length]);
  const displayed = (lang === "si")
    ? visible.map((r) => (tr[r.text] ? Object.assign({}, r, { text: tr[r.text] }) : r))
    : visible;

  const Layout =
    t.layout === "editorial" ? EditorialLayout :
    t.layout === "stream" ? StreamLayout :
    GridLayout;

  return (
    <>
      <PageHeader stats={baseStats} style={t.headerStyle} mobile={mobile} />

      <LangToggle lang={lang} onSet={setLang} busy={busy} />

      <main style={{ padding: mobile ? "0 12px 16px" : "0 24px 24px" }}>
        <Layout reviews={displayed} />
        <LoadMore hasMore={hasMore} onClick={() => setPage((p) => p + 1)} />
      </main>

      {t.showQR && <QRPanel url={WRITE_REVIEW_URL} />}

      <TweaksPanel>
        <TweakSection label="Layout" />
        <TweakRadio
          label="Arrangement"
          value={t.layout}
          options={[
            { value: "grid", label: "Grid" },
            { value: "editorial", label: "Editorial" },
            { value: "stream", label: "Stream" },
          ]}
          onChange={(v) => { setTweak("layout", v); setPage(1); }}
        />
        <TweakSection label="Palette" />
        <TweakColor
          label="Theme"
          value={t.palette}
          options={[
            ["#f4ede0", "#fdfbf6", "#2d4a32"], // cream + forest (default)
            ["#ece4d3", "#f8f3e6", "#7a4a1c"], // sand + saffron
            ["#e8e3d4", "#f6f2e6", "#3a4a5a"], // stone + slate blue
            ["#1f1a14", "#2a241c", "#c08a3e"], // dark + gold
            ["#f1ebe0", "#fdfbf6", "#6b3a2a"], // cream + earth red
          ]}
          onChange={(v) => setTweak("palette", v)}
        />
        <TweakSection label="Composition" />
        <TweakToggle
          label="Show review-stats badge"
          value={t.showStats}
          onChange={(v) => setTweak("showStats", v)}
        />
        <TweakToggle
          label="Show QR review card"
          value={t.showQR}
          onChange={(v) => setTweak("showQR", v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
