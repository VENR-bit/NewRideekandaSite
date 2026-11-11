// Small set of SVG glyph icons used inside tiles.
// All sized via the `size` prop, single-stroke or filled with currentColor.

const svgIcon = (src, alt, scale=1.1) => ({size=28}) => (
  <div
    role="img"
    aria-label={alt}
    style={{
      width: size * scale,
      height: size * scale,
      display: 'block',
      backgroundColor: 'currentColor',
      WebkitMaskImage: `url(/${src})`,
      maskImage: `url(/${src})`,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      pointerEvents: 'none',
      userSelect: 'none',
    }}
  />
);

const Icons = {
  // Official Rideekanda monastery logo for the center tile
  home: ({size=44}) => (
    <div
      role="img"
      aria-label="Rideekanda"
      style={{
        width: size * 1.55,
        height: size * 1.55,
        display: 'block',
        backgroundColor: 'currentColor',
        WebkitMaskImage: 'url(/rideekanda-logo.svg)',
        maskImage: 'url(/rideekanda-logo.svg)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  ),

  play: ({size=32}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="currentColor">
      <path d="M -5 -7 L 7 0 L -5 7 Z"/>
    </svg>
  ),

  calendar: svgIcon('icon-retreat-booking.svg', 'Retreat Booking'),

  book: ({size=32}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M -9 -7 C -5 -8, -1 -7, 0 -5 C 1 -7, 5 -8, 9 -7 L 9 7 C 5 6, 1 7, 0 9 C -1 7, -5 6, -9 7 Z"/>
      <path d="M 0 -5 L 0 9" strokeWidth="0.9"/>
    </svg>
  ),

  list: ({size=32}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="-7" cy="-6" r="1.4" fill="currentColor"/>
      <circle cx="-7" cy="0" r="1.4" fill="currentColor"/>
      <circle cx="-7" cy="6" r="1.4" fill="currentColor"/>
      <path d="M -3 -6 L 9 -6"/>
      <path d="M -3 0 L 7 0"/>
      <path d="M -3 6 L 9 6"/>
    </svg>
  ),

  docs: ({size=32}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M -6 -10 L 2 -10 L 7 -5 L 7 10 L -6 10 Z"/>
      <path d="M 2 -10 L 2 -5 L 7 -5"/>
      <path d="M -3 1 L 4 1"/>
      <path d="M -3 5 L 4 5"/>
    </svg>
  ),

  lotus: svgIcon('icon-dhamma-talks.svg', 'Dhamma Talks'),

  wave: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M -9 0 Q -6 -6, -3 0 T 3 0 T 9 0"/>
      <path d="M -9 -5 Q -6 -2, -3 -5" opacity="0.5"/>
      <path d="M 3 5 Q 6 2, 9 5" opacity="0.5"/>
    </svg>
  ),

  image: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="-9" y="-7" width="18" height="14" rx="1.5"/>
      <circle cx="-3" cy="-2" r="2"/>
      <path d="M -9 7 L -1 0 L 4 4 L 9 0 L 9 7 Z" fill="currentColor" fillOpacity="0.2"/>
    </svg>
  ),

  pin: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 0 9 C -6 2, -7 -3, -4 -7 A 5.5 5.5 0 0 1 4 -7 C 7 -3, 6 2, 0 9 Z" fill="currentColor" fillOpacity="0.18"/>
      <circle cx="0" cy="-3" r="1.8"/>
    </svg>
  ),

  hands: svgIcon('icon-donation.svg', 'Donation'),

  broadcast: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="0" cy="0" r="2" fill="currentColor"/>
      <path d="M -4 -4 A 5.5 5.5 0 0 0 -4 4"/>
      <path d="M 4 -4 A 5.5 5.5 0 0 1 4 4"/>
      <path d="M -8 -7 A 11 11 0 0 0 -8 7"/>
      <path d="M 8 -7 A 11 11 0 0 1 8 7"/>
    </svg>
  ),

  mail: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="-9" y="-6" width="18" height="12" rx="1.5"/>
      <path d="M -9 -5 L 0 2 L 9 -5"/>
    </svg>
  ),

  sinhala: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none">
      <text x="0" y="6" textAnchor="middle" fill="currentColor" style={{fontFamily: "'Noto Serif Sinhala', serif", fontSize: '15px', fontWeight: 600}}>සි</text>
    </svg>
  ),

  moon: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M 7 1 A 8 8 0 1 1 -1 -7 A 6 6 0 0 0 7 1 Z" fill="currentColor" fillOpacity="0.2"/>
      <circle cx="6" cy="-6" r="0.6" fill="currentColor"/>
      <circle cx="-7" cy="-3" r="0.6" fill="currentColor"/>
    </svg>
  ),

  scroll: svgIcon('icon-sutta-archive.svg', 'Sutta Archive'),
  suttaPitaka: svgIcon('icon-sutta-pitaka.svg', 'සුත්‍ර පිටකය'),

  feather: svgIcon('icon-newsletter.svg', 'Newsletter'),

  bell: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M -6 4 C -6 -3, -3 -8, 0 -8 C 3 -8, 6 -3, 6 4 L -6 4 Z" fill="currentColor" fillOpacity="0.15"/>
      <path d="M -7 5 L 7 5"/>
      <path d="M -1.5 7 C -1.5 9, 1.5 9, 1.5 7"/>
    </svg>
  ),

  tree: svgIcon('icon-monastery.svg', 'Monastery'),
  dailyRoutine: svgIcon('icon-daily-routine.svg', 'Daily Routine'),

  instagram: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="-8" y="-8" width="16" height="16" rx="4.5"/>
      <circle cx="0" cy="0" r="4"/>
      <circle cx="5.5" cy="-5.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),

  facebook: svgIcon('icon-facebook.svg', 'Facebook'),

  settings: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="0" cy="0" r="3"/>
      <path d="M 0 -6 L 0 -9"/>
      <path d="M 0 6 L 0 9"/>
      <path d="M -6 0 L -9 0"/>
      <path d="M 6 0 L 9 0"/>
      <path d="M -4.2 -4.2 L -6.4 -6.4"/>
      <path d="M 4.2 4.2 L 6.4 6.4"/>
      <path d="M 4.2 -4.2 L 6.4 -6.4"/>
      <path d="M -4.2 4.2 L -6.4 6.4"/>
    </svg>
  ),

  booking: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="-8" y="-6" width="16" height="15" rx="1.5"/>
      <path d="M -8 0 L 8 0"/>
      <path d="M -5 -9 L -5 -4"/>
      <path d="M 5 -9 L 5 -4"/>
      <path d="M -2 4 L 1 7 L 5 2" strokeWidth="1.6"/>
    </svg>
  ),

  retreat: svgIcon('icon-retreat-program.svg', 'Retreat Program'),

  programs: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="-8" y="-8" width="16" height="16" rx="1.5" fill="currentColor" fillOpacity="0.1"/>
      <path d="M -4 -4 L 6 -4"/>
      <path d="M -4 0 L 4 0"/>
      <path d="M -4 4 L 6 4"/>
      <circle cx="-6" cy="-4" r="1" fill="currentColor"/>
      <circle cx="-6" cy="0" r="1" fill="currentColor"/>
      <circle cx="-6" cy="4" r="1" fill="currentColor"/>
    </svg>
  ),

  star: ({size=28}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 0 -9 L 2.5 -3 L 9 -3 L 4 1.5 L 5.8 8 L 0 4.5 L -5.8 8 L -4 1.5 L -9 -3 L -2.5 -3 Z" fill="currentColor" fillOpacity="0.2"/>
    </svg>
  ),

  google: svgIcon('icon-google.svg', 'Google'),
  threeStory: svgIcon('icon-threestory.svg', 'ThreeStory Building'),
  road: svgIcon('icon-road.svg', 'Road'),
  // Seedling — two leaves rising from a stem, for the herbal planting programme.
  herbalPlant: ({size=32}) => (
    <svg width={size} height={size} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 9V-1"/>
      <path d="M0 -1c0-5 3.4-8.8 9-9.6C9.5-4.8 6.1-1 0-1Z"/>
      <path d="M0 3c-4.6 0-7.7-3-8.4-7.6C-3.5-3.9-0.6-1.2 0 3Z"/>
    </svg>
  ),
  library: svgIcon('icon-library.svg', 'Library'),
  projects: svgIcon('icon-projects.svg', 'Projects'),
};

window.Icons = Icons;
