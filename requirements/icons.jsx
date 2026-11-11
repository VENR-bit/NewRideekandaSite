// Icon glyphs for item thumbnails — simple, calm line drawings on warm tile

const ICONS = {
  robe: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12 L32 8 L42 12 L48 22 L46 56 L18 56 L16 22 Z" />
      <path d="M32 8 L32 56" strokeDasharray="2 3" />
      <path d="M22 12 L18 22 M42 12 L46 22" />
    </svg>
  ),
  bowl: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 28 Q32 22 54 28 L48 50 Q32 56 16 50 Z" />
      <path d="M10 28 Q32 32 54 28" />
      <ellipse cx="32" cy="20" rx="6" ry="2" />
    </svg>
  ),
  vial: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 10 L40 10 L40 24 L48 48 Q48 56 32 56 Q16 56 16 48 L24 24 Z" />
      <path d="M22 10 L42 10" />
      <path d="M20 40 L44 40" />
    </svg>
  ),
  stick: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10 Q26 12 26 18 Q26 24 20 22 Q22 26 28 26 L42 54" />
      <circle cx="20" cy="16" r="1.2" fill="currentColor" />
    </svg>
  ),
  fan: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 10 Q12 30 18 38 Q32 30 46 38 Q52 30 32 10 Z" />
      <path d="M32 10 L32 38" />
      <path d="M24 22 L40 22" />
      <path d="M32 38 L32 56" />
    </svg>
  ),
  grain: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 8 L32 52" />
      <path d="M32 16 Q24 18 22 12 Q26 12 32 16" />
      <path d="M32 16 Q40 18 42 12 Q38 12 32 16" />
      <path d="M32 26 Q24 28 22 22 Q26 22 32 26" />
      <path d="M32 26 Q40 28 42 22 Q38 22 32 26" />
      <path d="M32 36 Q24 38 22 32 Q26 32 32 36" />
      <path d="M32 36 Q40 38 42 32 Q38 32 32 36" />
      <path d="M22 56 L42 56" />
    </svg>
  ),
  cup: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 22 L46 22 L44 48 Q42 54 32 54 Q22 54 20 48 Z" />
      <path d="M46 26 Q54 26 54 34 Q54 42 46 42" />
      <path d="M24 12 Q22 16 24 18 M32 10 Q30 14 32 16 M40 12 Q38 16 40 18" />
    </svg>
  ),
  lantern: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="20" y="18" width="24" height="32" rx="2" />
      <path d="M16 18 L48 18" />
      <path d="M28 10 L32 14 L36 10" />
      <path d="M32 8 L32 18" />
      <path d="M24 50 L40 50 L42 56 L22 56 Z" />
      <circle cx="32" cy="34" r="6" />
    </svg>
  ),
  lamp: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 44 Q32 36 52 44 L48 50 Q32 54 16 50 Z" />
      <path d="M30 36 Q32 28 34 36" />
      <path d="M32 28 Q30 22 32 18 Q34 22 32 28" fill="currentColor" />
    </svg>
  ),
  candle: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="26" y="22" width="12" height="32" />
      <path d="M22 54 L42 54" />
      <path d="M32 22 L32 18" />
      <path d="M32 18 Q28 12 32 8 Q36 12 32 18" fill="currentColor" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14 Q24 12 32 16 Q40 12 50 14 L50 50 Q40 48 32 52 Q24 48 14 50 Z" />
      <path d="M32 16 L32 52" />
      <path d="M20 22 L28 23 M20 28 L28 29 M20 34 L28 35" />
      <path d="M36 22 L44 23 M36 28 L44 29 M36 34 L44 35" />
    </svg>
  ),
  tile: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 20 L32 12 L54 20 L54 48 L32 56 L10 48 Z" />
      <path d="M10 20 L32 28 L54 20" />
      <path d="M32 28 L32 56" />
    </svg>
  ),
  brick: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="18" width="44" height="10" />
      <rect x="10" y="28" width="44" height="10" />
      <rect x="10" y="38" width="44" height="10" />
      <path d="M22 18 L22 28 M40 18 L40 28 M16 28 L16 38 M34 28 L34 38 M52 28 L52 38 M22 38 L22 48 M40 38 L40 48" />
    </svg>
  ),
  filter: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14 L50 14 L42 30 L42 50 L22 50 L22 30 Z" />
      <path d="M22 30 L42 30" />
      <path d="M28 38 L36 38" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 50 Q12 28 28 18 Q44 12 52 14 Q50 32 38 44 Q26 52 14 50 Z" />
      <path d="M14 50 L40 22" />
    </svg>
  ),
  net: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18 L50 18 L46 54 L18 54 Z" />
      <path d="M22 18 L20 54 M30 18 L30 54 M38 18 L40 54" />
      <path d="M15 28 L49 28 M16 38 L48 38 M17 48 L47 48" />
    </svg>
  ),
};

window.ICONS = ICONS;
