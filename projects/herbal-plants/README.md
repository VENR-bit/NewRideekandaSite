# Herbal Plant Planting Programme

Visitors choose a medicinal plant, pledge to bring it, plant it at the monastery,
then send a photograph. Once a monk approves the photo it joins the planting
record on the page and the pledge is complete.

## Files

| File | Purpose |
|---|---|
| `index.html` | The public page, **in Sinhala** — this is the default |
| `en/index.html` | The same page in English |
| `si/index.html` | Redirect to the root, kept so links shared while the Sinhala page lived at `/si/` still work (it preserves `?claim=` tokens) |
| `styles.css` | All styling (paper palette, forest-green accent) |
| `plants-data.js` | Both plant lists, transcribed from the monastery's Google Sheet |
| `db.js` | Supabase access layer, shared by the page and the admin |
| `app.js` | Page behaviour: browse, search, pledge, photo upload. Holds the Sinhala/English wording table, keyed off `<html lang>` — both pages share this one script |
| `admin.html` | Passcode-gated page for approving submitted photos |
| `supabase-setup.sql` | **Run this once** to create the database |
| `rideekanda-herbal-plants.pdf` | Downloadable list of all 1,405 plants, linked from both pages' menus |
| `tools/` | Generator for that PDF — see the header of `build-pdf.py` |

## The plant lists

Taken from [the monastery's sheet](https://docs.google.com/spreadsheets/d/1mCAQ4xcG3hjyvvt2lQSa--9KeH-G567gNCXKDiOo38g/edit):

- **`programme`** — 81 plants, the current planting drive (sheet tab 2)
- **`reference`** — 1,259 plants, shown as the *balance* medicinal flora (sheet tab 1). The 65
  species that also appear in the planting list are not repeated here; the row
  numbers are the sheet's own, so they skip where those were removed.

Both are pledgeable. Each row is `[no, sinhalaName, sinhalaScript, englishName, scientificName]`.

To refresh from the sheet later, re-export both tabs as CSV and regenerate
`plants-data.js` — the row order and column meaning must stay the same.

## One-time database setup

The page reads and writes the **same Supabase project** the Requirements page
uses (`megebtfqaovaciovrzyb`). The tables do not exist yet.

1. Open the Supabase dashboard → **SQL Editor** → **New query**
2. Paste the whole of `supabase-setup.sql`
3. Press **Run**

That creates:

- `plant_pledges` — one row per pledge, including a private `token`
- `plant_pledges_public` — a view exposing everything **except** the token, which is what the site reads
- `attach_plant_photo()` — verifies the token server-side before attaching a photo
- a public-read `plant-photos` storage bucket

Re-running the script is safe.

## How a pledge flows

1. Visitor picks a plant and leaves their name → the plant shows as claimed
2. They plant it, come back to the page, find their plant and press **Upload
   photo** on its tile → status becomes `pending` (hidden from the public page)
3. A monk opens `admin.html`, reviews it, and approves → status becomes
   `approved` and the photo appears in the planting record

## Admin

`admin.html`, passcode **92424** — the same passcode as the Requirements admin.

Note this is obscurity-level protection only, exactly as on the Requirements
admin page: the passcode is checked in the browser, and moderation runs through
the public anon key. It keeps casual visitors out; it is not a real login. If
that ever matters, the fix is Supabase Auth with a real account for the saṅgha
office.

## Privacy

Pledger **name** and any **note** are public. **Contact details are never shown**
on the page — they are stored so the monastery can reach the pledger, and the
public view deliberately excludes the token so nobody can hijack another
person's pledge.

## Languages

Sinhala is the default at `/projects/herbal-plants/`; English lives at
`/en/`. Both pages share `app.js`, `db.js` and `plants-data.js` — only the
markup differs, and the interface wording comes from the `STR` table in
`app.js` selected by `<html lang>`. Add a string there, not in the markup,
or the two will drift apart.

Pledges are shared: a plant claimed on either page shows as claimed on both.

## Rebuilding the PDF

`rideekanda-herbal-plants.pdf` is generated from `plants-data.js`, so it must be
rebuilt whenever the lists change — see the instructions at the top of
`tools/build-pdf.py`. It is rendered with headless Chrome rather than a Python
PDF library because Chrome shapes Sinhala correctly using the system font.

## Why the upload button is not secret

Uploading goes by pledge id, which is public — the pledger just returns to the
page and presses **Upload photo** on their plant, with no private link to keep.
Two things make that safe rather than careless:

- a photo always lands as `pending`, so nothing reaches the public page until a
  monk approves it on `admin.html`; and
- `attach_plant_photo_by_id` refuses a pledge whose photo is already approved,
  so an approved photo cannot be replaced.

The older token route (`attach_plant_photo`) is kept so any `?claim=<token>`
links already handed out still work.
