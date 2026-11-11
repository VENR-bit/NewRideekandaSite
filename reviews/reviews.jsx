// Reusable presentational pieces for the Reviews page.
const { useState, useMemo, useRef, useLayoutEffect, useEffect: useEffectR, useCallback } = React;

function useIsMobile(breakpoint = 600) {
  const [mobile, setMobile] = useState(() => window.innerWidth < breakpoint);
  useEffectR(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    setMobile(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return mobile;
}

/* ---------- Iconography ---------- */

// Brand lotus — rendered from the Rideekanda PNG mark.
// `color` is ignored (kept for API compat with prior SVG version);
// the artwork is a warm brown gradient and should not be tinted.
function Lotus({ size = 28, color, opacity = 1 }) {
  // Natural aspect ratio of the mark is ~1.53 : 1 (w : h).
  const w = Math.round(size * 1.53);
  return (
    <img
      src="assets/lotus.png"
      alt=""
      aria-hidden="true"
      className="rk-lotus"
      width={w}
      height={size}
      style={{ opacity, display: "inline-block", verticalAlign: "middle" }}
    />
  );
}

function StarRow({ rating = 5, size = 16 }) {
  return (
    <div style={{ display: "inline-flex", gap: 2 }} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={i < rating ? "var(--star)" : "rgba(0,0,0,0.08)"}>
          <path d="M10 1.5l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L4.6 18l1-6L1.3 7.9l6-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleG({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C34.5 6.2 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.9-8 19.9-20 0-1.3-.1-2.4-.3-3.5z"/>
      <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 13 24 13c3 0 5.8 1.1 8 3l5.7-5.7C34.5 6.2 29.5 4 24 4 16 4 9.1 8.5 6.3 14.7z"/>
      <path fill="#FBBC05" d="M24 44c5.3 0 10.1-2 13.7-5.4l-6.3-5.2C29.3 35 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9 39.4 16 44 24 44z"/>
      <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.3 5.2C41 35.6 44 30.3 44 24c0-1.3-.2-2.4-.4-3.5z"/>
    </svg>
  );
}

/* ---------- Avatar (initial in a soft circle) ---------- */

function Avatar({ name, initial, color, size = 40 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        color: "#fff",
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--serif)",
        fontWeight: 500,
        fontSize: size * 0.42,
        letterSpacing: 0.5,
        flexShrink: 0,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
      }}
      title={name}
    >
      {initial}
    </div>
  );
}

/* ---------- Expandable review text ---------- */

function ReviewText({ text, clampLines = 6, variant = "grid" }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 220;

  const baseStyle = {
    margin: 0,
    color: "var(--ink-soft)",
    fontSize: variant === "editorial" ? 17 : 15,
    lineHeight: 1.65,
    fontFamily: variant === "editorial" ? "var(--serif)" : "var(--sans)",
    fontWeight: variant === "editorial" ? 400 : 400,
  };

  const clampStyle = expanded
    ? {}
    : {
        display: "-webkit-box",
        WebkitLineClamp: clampLines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      };

  return (
    <div>
      <p style={{ ...baseStyle, ...clampStyle }}>{text}</p>
      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            marginTop: 10,
            background: "none",
            border: "none",
            padding: 0,
            color: "var(--accent)",
            fontFamily: "var(--sans)",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 0.2,
            textDecoration: "underline",
            textUnderlineOffset: 3,
            textDecorationColor: "rgba(45,74,50,0.3)",
          }}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

/* ---------- Layout 1: Grid (default, matches screenshot) ---------- */

function GridCard({ r }) {
  return (
    <article
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: "22px 22px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "var(--shadow-sm)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar name={r.name} initial={r.initial} color={r.color} size={40} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5, color: "var(--ink)" }}>{r.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{r.when}</div>
        </div>
      </header>
      <ReviewText text={r.text} clampLines={6} />
      <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 8 }}>
        <StarRow rating={r.rating} size={14} />
        <GoogleG size={18} />
      </footer>
    </article>
  );
}

function GridLayout({ reviews }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 20,
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      {reviews.map((r, i) => <GridCard key={i} r={r} />)}
    </div>
  );
}

/* ---------- Layout 2: Editorial (2-col, serif, large pull quotes) ---------- */

function EditorialCard({ r, flip, mobile }) {
  return (
    <article
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 18,
        padding: mobile ? "24px 20px" : "32px 36px",
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : (flip ? "1fr auto" : "auto 1fr"),
        gap: mobile ? 18 : 28,
        alignItems: "start",
        boxShadow: "var(--shadow-sm)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative quote mark */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          [flip ? "left" : "right"]: -10,
          top: -30,
          fontFamily: "var(--serif)",
          fontSize: 180,
          lineHeight: 1,
          color: "var(--bg-deep)",
          fontStyle: "italic",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        “
      </div>

      {(mobile || !flip) && (
        <div style={mobile
          ? { display: "flex", alignItems: "center", gap: 12 }
          : { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 88 }
        }>
          <Avatar name={r.name} initial={r.initial} color={r.color} size={mobile ? 44 : 64} />
          <div style={{ textAlign: mobile ? "left" : "center", flex: mobile ? 1 : undefined }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: mobile ? 15 : 17, fontWeight: 500, color: "var(--ink)", lineHeight: 1.15 }}>{r.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: mobile ? 2 : 4, letterSpacing: 0.3, textTransform: "uppercase" }}>{r.when}</div>
          </div>
          {!mobile && <div style={{ marginTop: 4 }}><StarRow rating={r.rating} size={12} /></div>}
          {!mobile && <div style={{ marginTop: 6 }}><GoogleG size={16} /></div>}
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <ReviewText text={r.text} clampLines={5} variant="editorial" />
      </div>

      {mobile && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <StarRow rating={r.rating} size={13} />
          <GoogleG size={16} />
        </div>
      )}

      {!mobile && flip && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 88 }}>
          <Avatar name={r.name} initial={r.initial} color={r.color} size={64} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 500, color: "var(--ink)", lineHeight: 1.15 }}>{r.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4, letterSpacing: 0.3, textTransform: "uppercase" }}>{r.when}</div>
          </div>
          <div style={{ marginTop: 4 }}><StarRow rating={r.rating} size={12} /></div>
          <div style={{ marginTop: 6 }}><GoogleG size={16} /></div>
        </div>
      )}
    </article>
  );
}

function EditorialLayout({ reviews }) {
  const mobile = useIsMobile();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fill, minmax(440px, 1fr))",
        gap: mobile ? 16 : 24,
        maxWidth: 1240,
        margin: "0 auto",
      }}
    >
      {reviews.map((r, i) => <EditorialCard key={i} r={r} flip={i % 2 === 1} mobile={mobile} />)}
    </div>
  );
}

/* ---------- Layout 3: Stream (masonry, varied weight) ---------- */

function StreamCard({ r, accent }) {
  return (
    <article
      style={{
        breakInside: "avoid",
        marginBottom: 18,
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: "20px 22px 18px",
        boxShadow: "var(--shadow-sm)",
        position: "relative",
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 22, right: 22, height: 3,
            background: "linear-gradient(90deg, transparent, var(--accent-soft), transparent)",
            opacity: 0.5,
            borderRadius: 2,
          }}
        />
      )}
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <Avatar name={r.name} initial={r.initial} color={r.color} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>{r.name}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>{r.when}</div>
        </div>
        <GoogleG size={16} />
      </header>
      <ReviewText text={r.text} clampLines={8} />
      <div style={{ marginTop: 14 }}>
        <StarRow rating={r.rating} size={13} />
      </div>
    </article>
  );
}

function StreamLayout({ reviews }) {
  return (
    <div
      style={{
        columnCount: "auto",
        columnWidth: 300,
        columnGap: 18,
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      {reviews.map((r, i) => <StreamCard key={i} r={r} accent={i === 0} />)}
    </div>
  );
}

Object.assign(window, {
  Lotus, StarRow, GoogleG, Avatar,
  GridLayout, EditorialLayout, StreamLayout,
  useIsMobile,
});
