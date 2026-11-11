# Rideekanda Forest Monastery — website

A single-page site for the Rideekanda (Silver Hill) Buddhist forest meditation
monastery. Calm, scrolling page covering About, Teachers, Visiting, and Food/Dāna.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The Monastery page (home — open this) |
| `retreat.html` | The Residential Retreat Centre page |
| `styles.css` | Shared design system (tokens, type, layout) |
| `retreat.css` | Extra components for the retreat page |
| `tweaks-app.jsx` · `tweaks-panel.jsx` | Optional in-page theme controls |
| `image-slot.js` | Drag-and-drop photo placeholders |
| `assets/lotus-logo.png` | Monastery logo |

The two pages link to each other (nav + footer).

## Run locally

It's a static site — just open `index.html` in a browser. If your browser blocks
the local fonts/scripts, serve the folder instead:

```bash
cd rideekanda-site
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish on GitHub Pages

1. Create a new repository and upload **the contents of this folder** (so that
   `index.html` sits at the repository root).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*,
   choose the `main` branch and the `/ (root)` folder, then **Save**.
4. Wait a minute — your site will be live at
   `https://<your-username>.github.io/<repo-name>/`.

## Adding photos

The hero background, teacher portraits, and the Food/Dāna image are drop-in
slots. Open the page and drag an image file onto each placeholder; the choice is
saved locally. To bake photos into the published site permanently, replace the
image references in `index.html` with your own image files committed to the repo.

## Notes

- Fonts (Cormorant Garamond, Spectral, Newsreader) load from Google Fonts, so an
  internet connection is needed for the intended typography.
- Some team bios were lightly cleaned for readability versus the source site.
