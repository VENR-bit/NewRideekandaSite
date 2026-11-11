# Rideekanda Forest Monastery — Donation Portal

A static, single-page donation portal for **Rideekanda Forest Monastery** (Udasgiriya, Matale, Sri Lanka). Three ways to give:

1. **Scan a QR Code** — eight pre-generated QR codes for $5 – $1,000
2. **Donate Online** — in-page WeTravel checkout embed
3. **Bank Transfer** — three bank accounts (NSB · People's Bank · UNFCU) with one-tap copy

No build step, no backend, no JavaScript bundling — just open `index.html` in a browser, or serve the folder from any static host (GitHub Pages, Netlify, Cloudflare Pages, Vercel, S3, your own server).

## Project structure

```
.
├── index.html           # entry point — loads React + Babel + app.jsx via CDN
├── styles.css           # all styling (CSS custom properties at the top)
├── app.jsx              # the React app (JSX, transpiled in-browser by Babel)
├── assets/
│   ├── logo.png         # full monastery logo (with Sinhala + English title)
│   └── logo-mark.png    # lotus mark only, used in the header
└── qr/                  # eight QR PNGs — keep filenames as the dollar amount
    ├── 5.png
    ├── 10.png
    ├── 20.png
    ├── 50.png
    ├── 100.png
    ├── 200.png
    ├── 500.png
    └── 1000.png
```

## Run locally

Open `index.html` directly, **or** serve the folder over HTTP (recommended — some browsers block `file://` for cross-origin reasons):

```bash
# Python 3
python3 -m http.server 8000

# Node
npx serve .

# or any static server
```

Then visit `http://localhost:8000`.

## Deploy

### GitHub Pages
1. Push this folder to a GitHub repo.
2. Settings → Pages → Source: **Deploy from a branch** → Branch: `main`, Folder: `/ (root)`.
3. Your site is at `https://<user>.github.io/<repo>/`.

### Netlify / Vercel / Cloudflare Pages
Drop the folder in or connect the repo. No build command, publish directory `.`.

## Configuring the WeTravel checkout

The in-page checkout uses WeTravel's `checkout_embed` URL. WeTravel only allows the embed on **whitelisted domains** — after deploying, log into your WeTravel dashboard and add the production domain (e.g. `rideekanda.org`) to the allowed embed list. Until then, donors will see the fallback panel with an **Open Secure Checkout** button that opens WeTravel in a new tab — donations still complete normally.

The embed UUIDs per amount live in `app.jsx`:

```js
const AMOUNTS = [
  { v: 5,    url: "https://tri.ps/ZdZTS", embed: "0812417710", img: "qr/5.png" },
  // ...
];
```

To change an amount, replace the `embed` UUID and the `url` short link (and swap the QR image).

## Editing bank account details

Bank account data lives at the top of `app.jsx` in the `BANK_ACCOUNTS` array. Each tab is one object with `label`, `flag`, `rows: [{k, v}, ...]`, and an optional `note`. Add/remove/reorder freely — the tab strip and account cards rebuild automatically.

## Editing contact phone numbers

Search `app.jsx` for `+94 742 252 980` and `+94 714 283 258`. The header phone is in the `Header` component; the contact strip below the bank tabs is in the `BankStack` component.

## License

Content (monastery name, logo, account details, photographs if added) © Rideekanda Forest Monastery — all rights reserved. Source code is provided as-is for the use of the monastery and may be adapted freely.
