# Rideekanda Forest Monastery — Requirements

A bilingual (English / Sinhala) donation requirements page for the Rideekanda Forest Monastery, with a built-in admin panel for managing items.

## Live pages

- **`index.html`** — Public requirements list. Visitors browse needed items, see per-item and total costs, and pledge.
- **`admin.html`** — Internal admin. Add, edit, photograph, remove requirements. Items persist to `localStorage`.

## Files

```
index.html        Public page
admin.html        Admin page
styles.css        All styles (parchment palette, type, layout, tweaks themes)
app.jsx           Public-page React app
admin.jsx         Admin-page React app
icons.jsx         Inline SVG glyphs used as photo fallbacks
data.js           Seed item list (replaced once admin saves)
images/           Logo and any item photos
```

No build step. All files are static — drop the folder into any web host (GitHub Pages, Netlify, S3, plain Apache, …) and it works.

## Deploying to GitHub Pages

1. Create a new GitHub repo, e.g. `rideekanda-requirements`.
2. Upload every file from this folder to the repo root.
3. In the repo, go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch** → `main` → `/ (root)`.
5. Save. After a minute the site is live at `https://<user>.github.io/<repo>/`.

## Tweaks

A floating "Tweaks" panel appears for changing the accent colour (Saffron / Ochre / Sage / Indigo / Claret) and Day / Night mode. The chosen theme is stored in `localStorage` so it persists across visits.

## Data persistence

The admin page writes the items list to `localStorage` under the key `rk-items`. The public page reads from the same key on load, on window focus, and on storage events — so editing an item in one tab updates the public page in another tab automatically.

To wire to a real backend (Supabase, Firebase, etc.), replace the `loadItems()` / `saveItems()` helpers in **`app.jsx`** and **`admin.jsx`** with API calls. Both files import `data.js` as the seed fallback.

## Donate link

The masthead "Donate" button links to `https://venr-bit.github.io/RideekandaDonate/`. Update the URL inside the `Masthead` component in `app.jsx` / `admin.jsx` if it moves.

## Languages

The page is fully bilingual. Strings are kept inline next to their English counterparts. The Sinhala font (`Noto Sans Sinhala`) is loaded from Google Fonts.

---

_Powered by Supabase & GitHub Pages_
