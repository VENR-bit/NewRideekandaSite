# Rideekanda Forest Monastery — Honeycomb launcher

A spatial / fisheye landing page for **rideekanda.org**. A central tile shows the
monastery's logo; satellites link to the YouTube channel, booking platform,
project library, requirements list, dhamma talks, and other resources.

## Files

```
site/
├── index.html            ← main page (the only file the browser requests directly)
├── app.jsx               ← React app: layout, drag/pan, fisheye math
├── icons.jsx             ← inline SVG glyphs used inside each tile
├── tweaks-panel.jsx      ← in-page tweak controls (palette, intensity, density)
├── image-slot.js         ← optional image-drop helper
└── rideekanda-logo.svg   ← official monastery logo, rendered in the center tile
```

External dependencies are loaded from public CDNs — no build step required:
- `react@18.3.1`, `react-dom@18.3.1` (unpkg)
- `@babel/standalone@7.29.0` for in-browser JSX transpilation (unpkg)
- Google Fonts: Cormorant, Manrope, JetBrains Mono, Noto Serif Sinhala

## Deploy to GitHub Pages

1. Upload all files in this `site/` folder to the root of your repo
   (e.g. `VENR-bit/RideekandaORGDashboard`), preserving the filenames.
2. In **Settings → Pages**, set the source to `main` branch, `/ (root)`.
3. If you're using a custom domain (`rideekanda.org`), add a `CNAME` file
   alongside `index.html` containing the single line:

   ```
   rideekanda.org
   ```

   …and configure the DNS A/CNAME records exactly as you did for the existing
   `rideekanda-home` repo. The DNS setup is unchanged.

## Editing destinations

Open `app.jsx` and edit the `RAW_TILES` array near the top. Each tile takes:

```js
{
  id: 'unique-id',
  label: 'Display name',
  sub: 'Optional one-line description shown when focal',
  url: 'https://...',           // '#...' for "coming soon"
  size: 132,                    // pixel diameter
  ring: 1,                      // 0 center, 1 primary, 2 secondary, 3 accent
  bg: '#xxxxxx' OR 'radial-gradient(...)',
  fg: '#xxxxxx',                // icon colour
  halo: 'rgba(...,0.3)',        // focal glow colour (optional)
  icon: 'play',                 // key from icons.jsx
}
```

Available icons: `home`, `play`, `calendar`, `book`, `list`, `lotus`, `wave`,
`image`, `pin`, `hands`, `broadcast`, `mail`, `sinhala`, `moon`, `scroll`,
`feather`, `bell`, `tree`.

To add a new icon, drop another entry in `icons.jsx`.

## Notes

- Production performance is fine but in-browser Babel is ~200KB. If traffic
  becomes heavy, pre-compile the `.jsx` files to `.js` and remove the Babel
  `<script>` tag from `index.html`.
- The page is fully responsive and supports mouse, touch, keyboard (arrows /
  Enter / Esc / Home), and trackpad wheel pan.
