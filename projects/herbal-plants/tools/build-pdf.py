"""Rebuild the downloadable plant-list PDF from plants-data.js.

Usage, from this folder:
    python3 build-pdf.py
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \\
      --headless=new --disable-gpu --no-pdf-header-footer \\
      --virtual-time-budget=20000 \\
      --print-to-pdf="../rideekanda-herbal-plants.pdf" \\
      "file://$PWD/plants.html"

Chrome is used because it shapes Sinhala correctly via the system font;
--no-pdf-header-footer suppresses the date/URL furniture it adds by default.
"""
import re, io, json, datetime, os
os.chdir("/Users/ven.homagamarewatha/Desktop/GITHUB PROJECTS/OneSite/projects/herbal-plants")
HERE = os.path.dirname(os.path.abspath(__file__))
SP = HERE

src  = io.open('plants-data.js', encoding='utf-8').read()
prog = json.loads(re.search(r'programme:\s*(\[.*?\n  \])', src, re.S).group(1))
ref  = json.loads(re.search(r'reference:\s*(\[.*?\n  \])', src, re.S).group(1))

def esc(t):
    return (str(t) if t is not None else '').replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')

def table(data):
    head = ('<table><thead><tr>'
            '<th class="n">අංකය<span>No.</span></th>'
            '<th>සිංහල නම<span>Sinhala</span></th>'
            '<th>උච්චාරණය<span>Romanised</span></th>'
            '<th>ඉංග්‍රීසි නම<span>English name</span></th>'
            '<th>විද්‍යාත්මක නම<span>Botanical name</span></th>'
            '</tr></thead><tbody>')
    body = []
    for r in data:
        no, si_name, si_script, en, sci = (list(r) + ['']*5)[:5]
        body.append('<tr><td class="n">%s</td><td class="si">%s</td><td>%s</td><td>%s</td><td class="sci">%s</td></tr>'
                    % (esc(no), esc(si_script), esc(si_name), esc(en), esc(sci)))
    return head + '\n'.join(body) + '</tbody></table>'

tpl = io.open(os.path.join(HERE, 'pdf-template.html'), encoding='utf-8').read()
out = (tpl.replace('@@PROG_N@@',  str(len(prog)))
          .replace('@@REF_N@@',   '{:,}'.format(len(ref)))
          .replace('@@DATE@@',    datetime.date.today().strftime('%d %B %Y'))
          .replace('@@TABLE1@@',  table(prog))
          .replace('@@TABLE2@@',  table(ref)))
io.open(os.path.join(HERE, 'plants.html'), 'w', encoding='utf-8').write(out)
print('HTML built: %d + %d = %d rows' % (len(prog), len(ref), len(prog)+len(ref)))
