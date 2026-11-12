# Builds si/index.html — the Sinhala home page — from the English home page's
# skeleton and the Sinhala text that already exists on the site. Longer passages
# are lifted verbatim from the previous Sinhala Monastery / Retreat pages
# (rk/_orig/…/si/index.html) and from eco-nav.js; nothing long is written here.
import re, os, sys
ROOT = sys.argv[1]
def read(p): return re.sub(r' style="--reveal-delay:\s*\d+ms;?"', '', open(os.path.join(ROOT, p), encoding='utf-8').read())
def sec(s, i):
    m = re.search(r'<section class="section" id="%s">(.*?)</section>' % i, s, re.S); assert m, i; return m.group(1)
def ps(b): return [x.strip() for x in re.findall(r'<p>(.*?)</p>', b, re.S)]
def one(b, pat):
    m = re.search(pat, b, re.S); assert m, pat; return m.group(1).strip()
def eyebrow(b): return one(b, r'<p class="eyebrow[^"]*">(.*?)</p>')
def h2(b): return one(b, r'<h2 class="section-title[^"]*">(.*?)</h2>')

home = read('index.html'); mon = read('rk/_orig/monastery/si/index.html'); ret = read('rk/_orig/retreat-center/si/index.html'); nav = read('eco-nav.js')
SI_PAGE = {'monastery/': 'monastery/si/', 'retreat-center/': 'retreat-center/si/', 'dhamma-talks/': 'dhamma-talks/si/'}
def link(h): return h if re.match(r'https?:|mailto:|#', h) else '../' + SI_PAGE.get(h, h)

# names in both languages, as the site menu already has them
def arr(name):
    blk = one(nav, r'var %s = \[(.*?)\];' % name)
    return [dict(id=a, href=b, en=c, si=d) for a, b, c, d in re.findall(r'id:\s*"([^"]*)",\s*href:\s*"([^"]*)",\s*en:\s*"([^"]*)",\s*si:\s*"([^"]*)"', blk)]
MAIN, PROJ, LIBS = arr('MAIN'), arr('PROJECTS'), arr('LIBRARIES')
byid = {x['id']: x for x in MAIN + PROJ + LIBS}
SI = lambda i: byid[i]['si']

tagline = one(mon, r'<p class="tagline reveal">(.*?)</p>')
m_about = sec(mon, 'about'); m_ps = ps(m_about)
m_con = sec(mon, 'contact'); m_lead = one(m_con, r'<p class="lead reveal">(.*?)</p>')
teachers = sec(mon, 'teachers').split('<div class="teacher reveal">')[1:]
r_prog = sec(ret, 'program'); r_ps = ps(r_prog)
r_rh = sec(ret, 'rhythm'); r_life = sec(ret, 'life'); r_con = sec(ret, 'contact')
cards = re.findall(r'<div class="card">\s*<h3>(.*?)</h3>\s*<p>(.*?)</p>', r_life, re.S)
book_btn = one(r_con, r'<a class="btn" href="[^"]*">(.*?)</a>')
r_title = one(ret, r'<h1 class="reveal">(.*?)</h1>')

head_script = one(home, r'(<script>\s*/\* Theme before first paint.*?</script>)')
eagle = one(home, r'(<svg class="sky-eagle".*?</svg>)')
ver = lambda n: one(home, r'%s\?v=(\d+)' % re.escape(n))

# explore rows and project cards, taken from the English page so the two stay alike
xl = one(home, r'<ul class="x-list" id="xList">(.*?)</ul>')
rows = re.findall(r'<a href="([^"]*)"[^>]*><i>(\d+)</i><h3>(.*?)</h3><span lang="si">(.*?)</span>', xl)
pj = one(home, r'<div class="pj-rail"[^>]*>(.*?)</div>\s*</section>')
pcards = re.findall(r'<a class="pj-card" href="([^"]*)">\s*<figure( class="contain")?><img src="([^"]*)"[^>]*></figure>\s*<span lang="si">(.*?)</span><h3>(.*?)</h3>', pj)
assert len(rows) == 10 and len(pcards) == 5, (len(rows), len(pcards))

def tch(b, img):
    return '''      <article class="t-card">
        <figure class="clip" data-tilt><img src="../rk/img/%s.webp" alt="%s" loading="lazy" decoding="async" /></figure>
        <p class="t-role">%s</p>
        <h3>%s</h3>
        <p>%s</p>
      </article>''' % (img, one(b, r'alt="([^"]*)"'), eyebrow(b), h2(b), ps(b)[0])

step = lambda n, img, alt, p: '''    <article class="path-panel path-step">
      <figure class="path-img"><img src="../rk/img/%s.webp" alt="" loading="lazy" decoding="async" /></figure>
      <div class="path-copy"><span class="path-num">%s</span><p>%s</p></div>
    </article>''' % (img, n, p)

big = ['monastery', 'retreat', 'booking', 'news', 'gallery', 'donate', 'contact']
IMG = {'monastery': 'x-monastery', 'retreat': 'x-retreat', 'booking': 'x-booking', 'news': 'x-news', 'gallery': 'x-gallery', 'donate': 'x-donate', 'contact': 'x-contact'}
li = lambda x: '<li><a href="%s">%s</a></li>' % (link(x['href']), x['si'])

out = '''<!DOCTYPE html>
<html lang="si" data-root="../">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="theme-color" content="#0c120e" />
<title>රිදීකන්ද ආරණ්‍ය සේනාසනය</title>
%(desc)s
<link rel="alternate" hreflang="en" href="../" />
<link rel="icon" href="../favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="64x64" href="../app/favicon-64.png?v=3" />
<link rel="apple-touch-icon" href="../app/apple-touch-icon.png?v=2" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Hanken+Grotesk:wght@300..600&family=Noto+Serif+Sinhala:wght@300..600&display=swap" rel="stylesheet" />
%(head_script)s
<link rel="stylesheet" href="../rk/rk.css?v=%(vcss)s" />
<script src="/analytics.js?v=1"></script>
</head>
<body>

<div class="loader" id="loader" aria-hidden="true">
  <div class="loader-in">
    <span class="logo loader-logo"></span>
    <p class="loader-word">රිදීකන්ද<span>%(tagline)s</span></p>
  </div>
  <div class="loader-bar"><i id="loaderBar"></i></div>
  <span class="loader-num" id="loaderNum">0</span>
</div>

<div class="sky" aria-hidden="true"><canvas id="sky"></canvas><div class="sky-fallback"></div>
  %(eagle)s</div>
<div class="grain" aria-hidden="true"></div>
<div class="cursor" id="cursor" aria-hidden="true"><i></i><span></span></div>
<div class="veil" id="veil" aria-hidden="true"></div>

<header class="hd" id="hd">
  <a class="hd-brand" href="./" aria-label="රිදීකන්ද ආරණ්‍ය සේනාසනය">
    <span class="logo"></span>
    <span class="hd-name">රිදීකන්ද<small>ආරණ්‍ය සේනාසනය</small></span>
  </a>
  <nav class="hd-links" aria-label="Primary">
    <a href="../monastery/si/">%(s_mon)s</a>
    <a href="../retreat-center/si/">%(s_ret)s</a>
    <a href="../donate/">%(s_don)s</a>
    <a href="../" lang="en" style="font-family:var(--f-text);letter-spacing:.12em;text-transform:uppercase;font-size:.8rem">English</a>
  </nav>
  <div class="hd-tools">
    <button class="ic-btn" id="soundBtn" type="button" aria-pressed="false" aria-label="Forest ambience: off" title="Forest ambience"><span class="bars"><i></i><i></i><i></i><i></i></span></button>
    <button class="ic-btn" id="themeBtn" type="button" aria-label="Toggle light / dark theme"></button>
    <a class="pill hd-book" href="../book-your-stay/" data-magnet><span>%(s_book)s</span></a>
    <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="menu">
      <span class="menu-btn-t"><b>මෙනුව</b><b>වසන්න</b></span><span class="menu-btn-i"><i></i><i></i></span>
    </button>
  </div>
</header>

<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Site navigation" hidden>
  <div class="menu-bg"></div>
  <div class="menu-in">
    <div class="menu-main">
      <p class="label">රිදීකන්ද ආරණ්‍ය සේනාසනය</p>
      <ul class="menu-big">
%(menu_big)s
      </ul>
    </div>
    <div class="menu-side">
      <div class="menu-col"><p class="label">තවත්</p><ul>
        %(more)s
        <li><a href="../" lang="en" style="font-family:var(--f-text)">English</a></li>
      </ul></div>
      <div class="menu-col"><p class="label">%(s_projects)s</p><ul>
        %(projs)s
      </ul></div>
      <div class="menu-col"><p class="label">පුස්තකාල</p><ul>
        %(libs)s
      </ul></div>
      <div class="menu-foot" style="font-family:var(--f-text)">
        <a href="https://wa.me/94742252980" target="_blank" rel="noopener">WhatsApp +94 74 225 2980</a>
        <a href="mailto:rideekanda@gmail.com">rideekanda@gmail.com</a>
        <span class="menu-social">
          <a href="https://www.facebook.com/rideekandaforest" target="_blank" rel="noopener">Facebook</a>
          <a href="https://www.instagram.com/rideekanda.monastery/" target="_blank" rel="noopener">Instagram</a>
          <a href="https://youtube.com/c/RideekandaForestMonastery" target="_blank" rel="noopener">YouTube</a>
        </span>
      </div>
    </div>
    <div class="menu-preview" aria-hidden="true"><img alt="" /></div>
  </div>
</div>

<main id="main">

<section class="hero" id="top" data-sky>
  <div class="hero-top"><span>%(tagline)s</span><span lang="en" style="font-family:var(--f-text);letter-spacing:.22em;text-transform:uppercase;font-size:.7rem">Rideekanda Forest Monastery</span></div>
  <div class="hero-mid">
    <h1 class="hero-title" aria-label="රිදීකන්ද ආරණ්‍ය සේනාසනය">
      <span class="ht-1" aria-hidden="true">රිදීකන්ද</span>
      <span class="ht-2" aria-hidden="true">ආරණ්‍ය සේනාසනය</span>
    </h1>
    <div class="hero-cta">
      <a class="pill pill-solid" href="../book-your-stay/" data-magnet><span>%(s_book)s</span><i class="arr"></i></a>
      <a class="pill pill-glass" href="#about" data-magnet><span>%(s_mon)s</span></a>
    </div>
  </div>
  <div class="hero-foot">
    <div class="now" id="now"><i class="now-dot"></i><span class="now-k"></span><span class="now-t" id="nowTime">—</span><span class="now-a" id="nowAct"></span></div>
    <a class="scroll-cue" href="#about" aria-label="Scroll"><span>Scroll</span><i></i></a>
  </div>
</section>

<section class="sec about" id="about">
  <div class="mist-edge" aria-hidden="true"></div>
  <div class="wrap">
    <p class="label reveal"><b>01</b>%(about_eb)s</p>
    <p class="statement" id="statement">%(about_1)s</p>
    <div class="about-grid">
      <figure class="about-fig-a clip" data-speed="0.12"><img src="../rk/img/monk-view.webp" width="1280" height="880" alt="" loading="lazy" decoding="async" /></figure>
      <div class="about-copy">
        <p class="reveal">%(about_2)s</p>
        <p class="reveal">%(about_3)s</p>
        <div class="row-cta reveal">
          <a class="link-arrow" href="../monastery/si/"><span>%(s_mon)s</span><i class="arr"></i></a>
          <a class="link-arrow" href="../retreat-center/si/"><span>%(s_ret)s</span><i class="arr"></i></a>
        </div>
      </div>
      <figure class="about-fig-b clip" data-speed="-0.1"><img src="../rk/img/steps.webp" width="1280" height="960" alt="" loading="lazy" decoding="async" /></figure>
    </div>
  </div>
</section>

<section class="path dark" id="practice">
  <div class="path-track" id="pathTrack">
    <article class="path-panel path-intro">
      <p class="label"><b>02</b>%(prog_eb)s</p>
      <h2 class="h1">%(prog_h2)s</h2>
      <p class="path-lead">%(prog_1)s</p>
    </article>
%(steps)s
    <article class="path-panel path-end">
      <h2 class="h1">%(r_title)s</h2>
      <a class="pill pill-line" href="../retreat-center/si/" data-magnet><span>%(s_ret)s</span><i class="arr"></i></a>
    </article>
  </div>
  <div class="path-bar" aria-hidden="true"><i id="pathBar"></i></div>
</section>

<section class="day" id="day" data-sky>
  <div class="day-pin">
    <div class="day-shade" aria-hidden="true"></div>
    <div class="day-head">
      <p class="label on-sky"><b>03</b>%(rh_eb)s</p>
      <h2 class="h2 on-sky">%(rh_h2)s</h2>
    </div>
    <div class="day-read" aria-live="off">
      <p class="day-time" id="dayTime">5.30 AM</p>
      <p class="day-act" id="dayAct"></p>
      <p class="day-si" id="daySi" lang="en"></p>
    </div>
    <ol class="day-ticks" id="dayTicks"></ol>
    <a class="link-arrow on-sky day-link" href="../daily-routine/"><span>ආරණ්‍යයේ දින චර්යාව</span><i class="arr"></i></a>
  </div>
</section>

<section class="sec retreats" id="retreats">
  <div class="mist-edge" aria-hidden="true"></div>
  <div class="wrap">
    <div class="sec-head">
      <p class="label reveal"><b>04</b>%(con_eb)s</p>
      <h2 class="h1 split">%(con_h2)s</h2>
      <p class="sec-lead reveal">%(con_p)s</p>
    </div>
    <ol class="rt-list" id="rtList"><li class="rt-fallback"><a href="../book-your-stay/">%(book_btn)s →</a></li></ol>
    <div class="rt-foot reveal">
      <p class="poya" id="poya" hidden><span class="moon" aria-hidden="true"></span><span id="poyaText"></span></p>
      <a class="pill pill-solid" href="../book-your-stay/" data-magnet><span>%(book_btn)s</span><i class="arr"></i></a>
    </div>
  </div>
</section>

<section class="sec life" id="life">
  <div class="wrap">
    <div class="sec-head"><p class="label reveal"><b>05</b>%(life_eb)s</p></div>
    <div class="life-grid">
%(life)s
    </div>
  </div>
</section>

<section class="sec teachers dark" id="teachers">
  <div class="wrap">
    <div class="sec-head"><p class="label reveal"><b>06</b>ආචාර්ය</p></div>
    <div class="t-grid">
%(teachers)s
    </div>
    <a class="link-arrow reveal" href="../monastery/si/#teachers"><span>%(s_mon)s</span><i class="arr"></i></a>
  </div>
</section>

<section class="sec explore" id="explore">
  <div class="wrap">
    <div class="sec-head"><p class="label reveal"><b>07</b>ගවේෂණය</p></div>
    <ul class="x-list" id="xList">
%(xrows)s
    </ul>
  </div>
</section>

<section class="ribbon" id="ribbon" aria-label="%(s_gal)s">
  <div class="rb-row" data-dir="-1"></div>
  <div class="rb-row" data-dir="1"></div>
  <a class="rb-link pill pill-solid" href="../gallery/" data-magnet><span>%(s_gal)s</span><i class="arr"></i></a>
</section>

<section class="verse dark" id="verse">
  <div class="breath" id="breath" aria-hidden="true"><i></i><i></i><i></i><span id="breathWord">හුස්ම ගන්න</span></div>
  <div class="wrap verse-in">
    <blockquote><p class="verse-pali" id="versePali" lang="pi" style="font-family:var(--f-display);font-style:italic"></p><p class="verse-en" id="verseEn"></p></blockquote>
    <cite id="verseCite"></cite>
  </div>
</section>

<section class="sec projects" id="projects">
  <div class="wrap">
    <div class="sec-head"><p class="label reveal"><b>08</b>%(s_projects)s</p></div>
  </div>
  <div class="pj-rail" id="pjRail" data-cursor="Drag">
%(pcards)s
    <a class="pj-card pj-dana" href="../donate/">
      <span lang="en">Dāna · Donation</span><h3>%(s_don)s</h3>
      <b class="pill pill-line"><span>%(s_don)s</span><i class="arr"></i></b>
    </a>
  </div>
</section>

<section class="visit dark" id="visit">
  <div class="visit-bg" aria-hidden="true"><img src="../rk/img/dusk.webp" alt="" loading="lazy" decoding="async" /></div>
  <div class="wrap visit-in">
    <p class="label on-sky reveal">%(mcon_eb)s</p>
    <h2 class="h1 split">රිදීකන්ද ආරණ්‍ය සේනාසනය</h2>
    <p class="visit-lead reveal">%(m_lead)s</p>
    <div class="visit-cta reveal">
      <a class="pill pill-solid" href="../book-your-stay/" data-magnet><span>%(s_book)s</span><i class="arr"></i></a>
      <a class="pill pill-glass" href="../contact/" data-magnet><span>%(s_contact)s</span></a>
    </div>
    <dl class="visit-meta" style="font-family:var(--f-text)">
      <div class="reveal"><dt style="font-family:var(--f-si);letter-spacing:.02em;text-transform:none;font-size:.9rem">%(tagline)s</dt><dd><a href="https://maps.app.goo.gl/3Gb3nt8qaPqdSTgB9" target="_blank" rel="noopener">Google Maps ↗</a></dd></div>
      <div class="reveal"><dt>WhatsApp</dt><dd><a href="https://wa.me/94742252980" target="_blank" rel="noopener">+94 74 225 2980</a></dd></div>
      <div class="reveal"><dt>Email</dt><dd><a href="mailto:rideekanda@gmail.com">rideekanda@gmail.com</a></dd></div>
    </dl>
  </div>
</section>

</main>

<footer class="ft dark" id="ft">
  <div class="wrap">
    <div class="ft-grid">
      <div class="ft-brand"><span class="logo"></span><p>රිදීකන්ද ආරණ්‍ය සේනාසනය<br />%(tagline)s</p></div>
      <div><h4>රිදීකන්ද</h4><ul>%(ft1)s</ul></div>
      <div><h4>%(s_projects)s</h4><ul>%(ft2)s</ul></div>
      <div><h4>පුස්තකාල</h4><ul>%(ft3)s</ul></div>
    </div>
    <div class="ft-word" aria-hidden="true"><span>රිදීකන්ද</span></div>
    <div class="ft-base">
      <span>© <span id="year">2026</span> රිදීකන්ද ආරණ්‍ය සේනාසනය · <a href="../terms/" lang="en" style="font-family:var(--f-text)">Terms &amp; Conditions</a></span>
      <span lang="pi" style="font-family:var(--f-display)"><em style="font-style:italic">Sabbadānaṃ dhammadānaṃ jināti</em></span>
      <a class="ft-top" href="#top" lang="en" style="font-family:var(--f-text)">↑</a>
    </div>
  </div>
</footer>

<script src="../calendar-data.js?v=31"></script>
<script src="../daily-routine/routine-data.js?v=1"></script>
<script src="../rk/vendor/gsap.min.js"></script>
<script src="../rk/vendor/ScrollTrigger.min.js"></script>
<script src="../rk/vendor/SplitText.min.js"></script>
<script src="../rk/vendor/lenis.min.js"></script>
<script src="../rk/sky.js?v=%(vsky)s"></script>
<script src="../rk/rk.js?v=%(vjs)s"></script>
<script src="../rk/dash.js?v=%(vdash)s" data-root="../" data-after="0.6" defer></script>
</body>
</html>
''' % dict(
    desc=re.search(r'<meta name="description"[^>]*>', mon).group(0), head_script=head_script, eagle=eagle, tagline=tagline,
    vcss=ver('rk/rk.css'), vsky=ver('rk/sky.js'), vjs=ver('rk/rk.js'), vdash=ver('rk/dash.js'),
    s_mon=SI('monastery'), s_ret=SI('retreat'), s_don=SI('donate'), s_book=SI('booking'), s_gal=SI('gallery'), s_contact=SI('contact'), s_projects=SI('projects'),
    menu_big='\n'.join('        <li><a href="%s" data-img="../rk/img/%s.webp"><span>%s</span><small lang="en">%s</small></a></li>' % (link(byid[i]['href']), IMG[i], byid[i]['si'], byid[i]['en']) for i in big),
    more=''.join(li(byid[i]) for i in ['videos', 'reviews']) + '<li><a href="../daily-routine/">ආරණ්‍යයේ දින චර්යාව</a></li>',
    projs=''.join(li(x) for x in PROJ), libs=''.join(li(x) for x in LIBS),
    about_eb=eyebrow(m_about), about_1=m_ps[0], about_2=m_ps[1], about_3=m_ps[2],
    prog_eb=eyebrow(r_prog), prog_h2=h2(r_prog), prog_1=r_ps[0], r_title=r_title,
    steps='\n'.join(step(n, img, '', p) for n, img, p in [('01', 'sit-hall', r_ps[1]), ('02', 'sit-wall', r_ps[2]), ('03', 'sit-view', r_ps[3])]),
    rh_eb=eyebrow(r_rh), rh_h2=h2(r_rh), con_eb=eyebrow(r_con), con_h2=h2(r_con), con_p=ps(r_con)[0], book_btn=book_btn,
    life_eb=eyebrow(r_life),
    life='\n'.join('''      <article class="life-card" data-speed="%s">
        <figure class="clip"><img src="../rk/img/%s.webp" alt="" loading="lazy" decoding="async" /></figure>
        <h3>%s</h3><p>%s</p>
      </article>''' % (sp, img, a.strip(), b.strip()) for (a, b), img, sp in zip(cards[:3], ['dining', 'accommodation', 'hall'], ['0.06', '-0.06', '0.1'])),
    teachers='\n'.join(tch(b, img) for b, img in zip(teachers, ['ariyajeewa', 'rewatha'])),
    xrows='\n'.join('      <li><a href="%s"><i>%s</i><h3>%s</h3><span lang="en">%s</span><b class="arr"></b></a></li>' % (link(h), n, si, en) for h, n, en, si in rows),
    pcards='\n'.join('''    <a class="pj-card" href="%s">
      <figure%s><img src="../%s" alt="" loading="lazy" decoding="async" /></figure>
      <span lang="en">%s</span><h3>%s</h3>
    </a>''' % (link(h), c, img, en, si) for h, c, img, si, en in pcards),
    mcon_eb=eyebrow(m_con), m_lead=m_lead,
    ft1=''.join(li(byid[i]) for i in ['monastery', 'retreat', 'booking', 'gallery', 'news', 'contact']),
    ft2=''.join(li(x) for x in PROJ[:5]), ft3=''.join(li(x) for x in LIBS),
)
open(os.path.join(ROOT, 'si/index.html'), 'w', encoding='utf-8').write(out)
print('built', len(out))
