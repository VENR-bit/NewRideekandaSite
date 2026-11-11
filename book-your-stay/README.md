# Rideekanda Forest Monastery — Book Your Stay

A static page for booking residential retreats at Rideekanda Forest Monastery (Udasgiriya, Matale, Sri Lanka). Visual system matches the [Donate page](https://venr-bit.github.io/RideekandaDonate/).

## Contents

```
index.html         — page markup
styles.css         — full stylesheet
tweaks.jsx         — Tweaks panel (hero variant + accent picker)
tweaks-panel.jsx   — Tweaks panel framework
assets/lotus.png   — monastery mark
.nojekyll          — disables Jekyll processing on GitHub Pages
```

## Deploying to GitHub Pages

1. Create a new repository (e.g. `RideekandaBookYourStay`).
2. Upload **all files in this folder** (preserving the `assets/` subfolder).
3. In **Settings → Pages**, set the source to `main` branch / root (`/`).
4. The site goes live at `https://<your-user>.github.io/<repo-name>/`.

## Features

- **WeTravel listings widget** embedded for live availability.
- **Three reservation methods** — book online, WhatsApp/phone, email.
- **Tweaks panel** (corner toggle): switch hero copy variant and accent colour (terracotta / saffron / forest / indigo).
- **Responsive** — header, cards, banner and footer adapt at 820/640/420 px breakpoints.

## Contact details rendered on the page

- Email — `rideekanda@gmail.com`
- WhatsApp / Phone — `+94 74 225 2980`
- Web — `www.rideekanda.com`

To change them, edit `index.html` directly (search for the values).
