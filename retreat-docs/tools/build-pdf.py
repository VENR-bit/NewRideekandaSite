"""Rebuild the two Daily Routine PDFs in ../files/.

Usage, from this folder:
    python3 build-pdf.py

It writes daily-routine-en.html / daily-routine-si.html beside itself and then
renders each with headless Chrome:

    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
      --headless=new --disable-gpu --no-pdf-header-footer \
      --print-to-pdf="../files/daily-routine-schedule-en.pdf" \
      "file://$PWD/daily-routine-en.html"

Chrome is used because it shapes Sinhala correctly via the system font, and
--no-pdf-header-footer suppresses the date/URL furniture it adds by default.

Both sheets are generated from ../../daily-routine/routine-data.js, which is
the one place the routine is written down -- the same file the Daily Routine
page reads. Change a time there and rerun this script.
"""
import io, os, re, subprocess

HERE   = os.path.dirname(os.path.abspath(__file__))
FILES  = os.path.join(HERE, "..", "files")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SEP    = "…" * 12          # the dotted rule between entries

# The schedule itself lives in one place, so the page and these PDFs cannot
# drift apart. See ../../daily-routine/routine-data.js.
DATA = os.path.abspath(os.path.join(HERE, "..", "..", "daily-routine", "routine-data.js"))

def load():
    src = io.open(DATA, encoding="utf-8").read()
    def field(block, name):
        m = re.search(r'%s:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)",\s*\n?\s*si:\s*"((?:[^"\\]|\\.)*)"\s*\}' % name,
                      block, re.S)
        if not m:
            raise SystemExit("could not read %s from routine-data.js" % name)
        return m.group(1), m.group(2)

    tm = re.search(r'title:\s*\{(.*?)\n  \}', src, re.S)
    t  = tm.group(1)
    def one(name):
        return re.search(r'%s:\s*"([^"]*)"' % name, t).group(1)
    titles = {"en": [one("en"), one("sub_en")], "si": [one("si")]}

    rows = {"en": [], "si": []}
    for block in re.findall(r'\{ t: \{.*?\n           si: "[^"]*" \} \}', src, re.S):
        te, ts = field(block, "t")
        ae, a_s = field(block, "a")
        rows["en"].append((te, ae))
        rows["si"].append((ts, a_s))
    if len(rows["en"]) != 11:
        raise SystemExit("expected 11 periods, read %d" % len(rows["en"]))
    return titles, rows

CSS = """
  /* Metrics traced from the original sheets: the dotted rule belongs to the
     entry above it, so the gap below the rule is the wider one. */
  @page { size: Letter; margin: 16mm 18mm 16mm; }
  * { box-sizing: border-box; }
  body { margin: 0; text-align: center; color: #000;
         font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; }
  h1 { font-size: 18pt; font-weight: bold; line-height: 1.22; margin: 0 0 27pt; }
  .e { margin: 0; }
  .t { font-size: 12pt; font-weight: bold; line-height: 1.16; }
  .d { font-size: 12pt; font-style: italic; line-height: 1.16; }
  .d.plain { font-style: normal; }
  .sep { font-size: 12pt; line-height: 1.16; margin: 0 0 9pt; }
  /* Sinhala needs its own face and more leading, so the vowel signs above and
     below the line do not collide with the neighbouring rows. */
  body.si, body.si .t, body.si .d,
  body.si h1 { font-family: "Sinhala Sangam MN", "Noto Serif Sinhala", "Sinhala MN", serif; }
  body.si h1 { font-size: 17pt; line-height: 1.4; margin-bottom: 24pt; }
  body.si .t, body.si .d { line-height: 1.42; }
  body.si .sep { font-family: Arial, sans-serif; margin-bottom: 7pt; }
"""

def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def page(lang, title_lines, rows):
    out = ['<!doctype html><html lang="%s"><head><meta charset="utf-8">' % lang,
           "<style>%s</style></head><body%s>" % (CSS, ' class="si"' if lang == "si" else "")]
    out.append("<h1>" + "<br>".join(esc(t) for t in title_lines) + "</h1>")
    last = len(rows) - 1
    for i, (t, d) in enumerate(rows):
        out.append('<div class="e">')
        out.append('<div class="t">%s</div>' % esc(t))
        # the closing entry is upright in both of the original sheets
        out.append('<div class="d%s">(%s)</div>' % (" plain" if i == last else "", esc(d)))
        out.append("</div>")
        if i != last:
            out.append('<div class="sep">%s</div>' % SEP)
    out.append("</body></html>")
    return "\n".join(out)

def build(lang, title_lines, rows, pdf_name):
    html_path = os.path.join(HERE, "daily-routine-%s.html" % lang)
    io.open(html_path, "w", encoding="utf-8").write(page(lang, title_lines, rows))
    pdf_path = os.path.abspath(os.path.join(FILES, pdf_name))
    r = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                        "--virtual-time-budget=8000",
                        "--print-to-pdf=" + pdf_path, "file://" + html_path],
                       capture_output=True, text=True)
    ok = os.path.exists(pdf_path)
    print("%-3s -> %s  %s" % (lang, pdf_name,
          ("%d KB" % round(os.path.getsize(pdf_path) / 1024)) if ok else "FAILED\n" + r.stderr[-800:]))

if __name__ == "__main__":
    titles, rows = load()
    build("en", titles["en"], rows["en"], "daily-routine-schedule-en.pdf")
    build("si", titles["si"], rows["si"], "daily-routine-schedule-si.pdf")
