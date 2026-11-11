# Rideekanda Reviews

Static reviews page for Rideekanda Forest Monastery. Drop the folder into any web host (GitHub Pages, Netlify, etc.) and serve `index.html`.

## Structure

```
index.html         — entry; loads React + Babel and all script files
app.jsx            — header, QR panel, layout switcher, Tweaks wiring
reviews.jsx        — card components + three layouts (Grid / Editorial / Stream)
data.jsx           — review content + write-review URL
tweaks-panel.jsx   — Tweaks panel controls (in-page customizer)
assets/lotus.png   — brand mark
```

## Editing reviews

Open `data.jsx` and edit the `REVIEWS` array. Each entry takes:

```js
{
  name: "Nisha C.",
  initial: "N",
  color: "#b08968",      // avatar bg
  daysAgo: 9,            // used for sorting (most-recent first)
  when: "9 days ago",    // display label
  rating: 5,
  text: "...",
}
```

`STATS.displayTotal` controls the "from N Google reviews" number in the header.

## Switching to live Google reviews (Featurable)

Replace the `REVIEWS` constant with a fetch on page load:

```js
fetch("https://featurable.com/api/v1/widgets/<YOUR_WIDGET_ID>")
  .then(r => r.json())
  .then(d => /* map d.reviews into the shape above, then re-render */);
```

## Deploying to GitHub Pages

1. Push this folder to a repo (e.g. `RideekandaReviews`).
2. Settings → Pages → Source: `main` / `(root)`.
3. Page is live at `https://<user>.github.io/<repo>/`.
