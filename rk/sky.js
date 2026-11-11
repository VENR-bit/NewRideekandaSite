/* ──────────────────────────────────────────────────────────────
   Rideekanda — the living sky  ·  rk/sky.js

   A single full-screen fragment shader: layered forest ridges, valley
   mist, sun / moon, stars and fireflies. No images, no 3D library —
   plain WebGL, ~4 KB on the wire.

   The scene is driven by one number: the hour of the day (0–24).
     • In the hero it follows the real clock at the monastery
       (Asia/Colombo), so the sky a visitor sees is the sky over
       Rideekanda right now.
     • In the "A day on the hill" chapter the scroll position scrubs it
       from 5.30 am to 10 pm.

   API (window.RKSky):
     init(canvas)          → boolean (false when WebGL is unavailable)
     setHour(h, instant)   → target hour, eased unless instant
     setScroll(v)          → 0‥1 parallax lift of the ridges
     setPointer(x, y)      → −1‥1
     setActive(bool)       → pause rendering while the canvas is covered
     colomboHour()         → current decimal hour at the monastery
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

  var FRAG = [
    "precision highp float;",
    "uniform vec2 uRes;uniform float uTime;uniform float uScroll;uniform vec2 uMouse;",
    "uniform vec3 uTop;uniform vec3 uHor;uniform vec3 uFog;uniform vec3 uFar;uniform vec3 uNear;uniform vec3 uSunCol;uniform vec3 uCloud;",
    "uniform vec2 uSun;uniform float uSunAmt;uniform float uNight;uniform float uMist;",
    "float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
    " return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}",
    "float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*noise(p);p=p*2.03+vec2(11.3,7.1);a*=.5;}return s;}",
    "float fbm3(vec2 p){float a=.5,s=0.;for(int i=0;i<3;i++){s+=a*noise(p);p=p*2.1+vec2(3.7,1.9);a*=.5;}return s;}",
    "void main(){",
    " vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;",
    " vec2 p=vec2((uv.x-.5)*asp,uv.y);",
    " float lift=uScroll;",
    // ── sky ──
    " float sy=clamp(uv.y+lift*.12,0.,1.);",
    " vec3 col=mix(uHor,uTop,smoothstep(.30,1.,sy));",
    " col=mix(col,uHor,exp(-abs(sy-.42)*7.)*.35);",
    // stars
    " vec2 sg=floor(gl_FragCoord.xy/2.4);float st=fract(sin(dot(sg,vec2(12.9898,78.233)))*43758.5453);",
    " float sb=fract(st*917.3);float tw=.55+.45*sin(uTime*(1.+sb*2.)+st*900.);",
    " col+=vec3(.9,.92,1.)*step(.9986,st)*(.35+.65*sb)*tw*uNight*smoothstep(.36,.8,uv.y);",
    // sun / moon
    " vec2 sp=vec2((uSun.x-.5)*asp,uSun.y+lift*.10);float sd=length(p-sp);",
    " float disc=smoothstep(.034,.030,sd);",
    " col+=uSunCol*(disc*1.1+exp(-sd*7.)*.55+exp(-sd*2.2)*.28)*uSunAmt;",
    " vec2 mp=vec2(.30*asp*.9,.80+lift*.08);float md=length(p-mp);",
    " float moon=smoothstep(.030,.027,md)-smoothstep(.030,.027,length(p-mp-vec2(.012,.006)))*.92;",
    " col+=vec3(.86,.9,1.)*(max(moon,0.)+exp(-md*9.)*.16)*uNight;",
    // clouds
    " float cl=fbm(vec2(p.x*1.1+uTime*.006,uv.y*4.6+uTime*.002));",
    " float cm=smoothstep(.50,.78,cl)*smoothstep(.44,.72,sy)*(1.-smoothstep(.86,1.,sy));",
    " col=mix(col,uCloud,cm*.42);",
    // ── ridges, far → near ──
    " for(int i=0;i<6;i++){",
    "  float d=float(i)/5.;",
    "  float x=p.x+uMouse.x*mix(.004,.05,d)+float(i)*7.31;",
    "  float base=mix(.44,.02,d)+lift*mix(.10,.85,d*d)+uMouse.y*mix(.001,.012,d);",
    "  float h=base+fbm(vec2(x*mix(.85,1.9,d),float(i)*3.17))*mix(.16,.26,d);",
    // canopy: broken tree-line that sharpens with nearness
    "  float can=noise(vec2(x*mix(26.,58.,d),float(i)*9.))*.6+noise(vec2(x*mix(60.,140.,d),4.+float(i)))*.4;",
    "  h+=(can-.5)*mix(.004,.030,d*d);",
    "  float aa=1.5/uRes.y;",
    "  float m=smoothstep(h+aa,h-aa,uv.y);",
    "  vec3 c=mix(uFar,uNear,pow(d,1.25));",
    // light catching the crest
    "  c+=uSunCol*uSunAmt*.10*(1.-d)*exp(-abs(p.x-sp.x)*1.6)*smoothstep(h-.10,h,uv.y);",
    // valley mist pooling under each crest, drifting slowly
    "  float dn=fbm3(vec2(x*1.6-uTime*.012*(1.+d),uv.y*5.+float(i)*2.3));",
    "  float pool=smoothstep(h+.01,h-.20,uv.y)*(1.-d*.75);",
    "  c=mix(c,uFog,clamp(pool*(.42+dn*.55)*uMist,0.,.92));",
    "  col=mix(col,c,m);",
    " }",
    // fireflies in the near trees after dark
    " for(int j=0;j<12;j++){float fj=float(j);",
    "  vec2 fp=vec2((hash(vec2(fj,1.3))-.5)*asp*1.1+sin(uTime*.23+fj*1.7)*.05,",
    "   .06+hash(vec2(fj,7.7))*.30+sin(uTime*.31+fj*2.9)*.03+lift*.6);",
    "  float fd=length(p-fp);float bl=.5+.5*sin(uTime*(1.1+hash(vec2(fj,3.))*1.4)+fj*4.);",
    "  col+=vec3(.95,.86,.45)*(.000035/(fd*fd+.00002))*bl*bl*uNight;}",
    // vignette + dither
    " vec2 q=uv-.5;col*=1.-dot(q,q)*.55;",
    " col+=(hash(gl_FragCoord.xy+fract(uTime))-.5)/110.;",
    " gl_FragColor=vec4(col,1.);",
    "}"
  ].join("\n");

  /* Palette keyframes through the day. Colours are sRGB hex. */
  var KEYS = [
    { h: 0.0,  top: "#04070e", hor: "#0f1a27", fog: "#1a2a36", far: "#131e2a", near: "#030608", sun: "#000000", cloud: "#16202c", sunAmt: 0.0, night: 1.0, mist: 0.75 },
    { h: 4.6,  top: "#060a14", hor: "#172436", fog: "#22323f", far: "#17232f", near: "#04070a", sun: "#000000", cloud: "#1b2634", sunAmt: 0.0, night: 1.0, mist: 0.9 },
    { h: 5.6,  top: "#232c4c", hor: "#d98f72", fog: "#c9a79a", far: "#5b5f7c", near: "#0b1113", sun: "#ffb37a", cloud: "#e59a86", sunAmt: 0.35, night: 0.25, mist: 1.0 },
    { h: 6.6,  top: "#5a85a8", hor: "#f2cfa4", fog: "#ecdcc6", far: "#8195a2", near: "#131f1a", sun: "#ffd9a0", cloud: "#fbe3c6", sunAmt: 0.85, night: 0.0, mist: 1.0 },
    { h: 9.0,  top: "#4b83a6", hor: "#cfe0d8", fog: "#dde6dc", far: "#7d9c9c", near: "#16291f", sun: "#fff3d8", cloud: "#eef2ea", sunAmt: 0.7, night: 0.0, mist: 0.8 },
    { h: 13.0, top: "#3f7aa0", hor: "#c4dbd6", fog: "#d6e2d8", far: "#739691", near: "#183022", sun: "#fff6e2", cloud: "#eef3ee", sunAmt: 0.6, night: 0.0, mist: 0.6 },
    { h: 16.4, top: "#4c7c9c", hor: "#ecd6aa", fog: "#e6d8b8", far: "#84948a", near: "#17281e", sun: "#ffe2a8", cloud: "#f6e2bd", sunAmt: 0.8, night: 0.0, mist: 0.7 },
    { h: 17.8, top: "#33365c", hor: "#f0853f", fog: "#e39a68", far: "#6b5370", near: "#0e0c10", sun: "#ff9a4a", cloud: "#f2764a", sunAmt: 1.0, night: 0.0, mist: 0.85 },
    { h: 18.6, top: "#1a1e3c", hor: "#a34c62", fog: "#5c4662", far: "#2e2b47", near: "#07080d", sun: "#ff7a4a", cloud: "#b0506a", sunAmt: 0.35, night: 0.35, mist: 0.85 },
    { h: 19.6, top: "#070b17", hor: "#17223a", fog: "#1e2c3b", far: "#141f2c", near: "#030608", sun: "#000000", cloud: "#1a2333", sunAmt: 0.0, night: 1.0, mist: 0.8 },
    { h: 24.0, top: "#04070e", hor: "#0f1a27", fog: "#1a2a36", far: "#131e2a", near: "#030608", sun: "#000000", cloud: "#16202c", sunAmt: 0.0, night: 1.0, mist: 0.75 }
  ];
  var COLS = ["top", "hor", "fog", "far", "near", "sun", "cloud"];
  var NUMS = ["sunAmt", "night", "mist"];

  function hex(s) {
    var n = parseInt(s.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  KEYS.forEach(function (k) { COLS.forEach(function (c) { k[c] = hex(k[c]); }); });

  function sample(h) {
    h = ((h % 24) + 24) % 24;
    var a = KEYS[0], b = KEYS[KEYS.length - 1];
    for (var i = 0; i < KEYS.length - 1; i++) {
      if (h >= KEYS[i].h && h <= KEYS[i + 1].h) { a = KEYS[i]; b = KEYS[i + 1]; break; }
    }
    var t = b.h === a.h ? 0 : (h - a.h) / (b.h - a.h);
    t = t * t * (3 - 2 * t);
    var o = {};
    COLS.forEach(function (c) {
      o[c] = [a[c][0] + (b[c][0] - a[c][0]) * t, a[c][1] + (b[c][1] - a[c][1]) * t, a[c][2] + (b[c][2] - a[c][2]) * t];
    });
    NUMS.forEach(function (n) { o[n] = a[n] + (b[n] - a[n]) * t; });
    // The sun rides an arc from the left horizon (≈5.8h) to the right (≈18.6h).
    var s = (h - 5.8) / 12.8;
    o.sunPos = [0.14 + 0.72 * s, 0.36 + Math.sin(Math.max(0, Math.min(1, s)) * Math.PI) * 0.50];
    return o;
  }

  function colomboHour() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Colombo", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
      }).formatToParts(new Date());
      var v = {};
      parts.forEach(function (x) { v[x.type] = parseInt(x.value, 10); });
      return (v.hour % 24) + v.minute / 60 + v.second / 3600;
    } catch (e) {
      var d = new Date();   // Sri Lanka is UTC+5:30, no daylight saving
      var m = d.getUTCHours() * 60 + d.getUTCMinutes() + 330;
      return ((m / 60) % 24);
    }
  }

  var gl, canvas, U = {}, raf = 0, active = true, started = false;
  var hour = 12, targetHour = 12, scroll = 0, targetScroll = 0;
  var mx = 0, my = 0, tmx = 0, tmy = 0, t0 = 0, reduced = false;

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { throw new Error(gl.getShaderInfoLog(s)); }
    return s;
  }

  function resize() {
    if (!canvas) return;
    var small = Math.min(window.innerWidth, window.innerHeight) < 700;
    var dpr = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5);
    var w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  function frame(now) {
    raf = 0;
    if (!active) return;
    if (!t0) t0 = now;
    var t = (now - t0) / 1000;
    hour += (targetHour - hour) * 0.07;
    scroll += (targetScroll - scroll) * 0.14;
    mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
    var s = sample(hour);
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, reduced ? 12.0 : t);
    gl.uniform1f(U.uScroll, scroll);
    gl.uniform2f(U.uMouse, mx, my);
    gl.uniform3fv(U.uTop, s.top); gl.uniform3fv(U.uHor, s.hor); gl.uniform3fv(U.uFog, s.fog);
    gl.uniform3fv(U.uFar, s.far); gl.uniform3fv(U.uNear, s.near);
    gl.uniform3fv(U.uSunCol, s.sun); gl.uniform3fv(U.uCloud, s.cloud);
    gl.uniform2f(U.uSun, s.sunPos[0], s.sunPos[1]);
    gl.uniform1f(U.uSunAmt, s.sunAmt); gl.uniform1f(U.uNight, s.night); gl.uniform1f(U.uMist, s.mist);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // With reduced motion the scene only redraws when something changes.
    var settled = Math.abs(targetHour - hour) < 0.002 && Math.abs(targetScroll - scroll) < 0.0005;
    if (!reduced || !settled) raf = requestAnimationFrame(frame);
  }
  function kick() { if (started && active && !raf) raf = requestAnimationFrame(frame); }

  function init(c) {
    canvas = c;
    try {
      gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" }) ||
           canvas.getContext("experimental-webgl");
      if (!gl) return false;
      var prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);
      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ["uRes", "uTime", "uScroll", "uMouse", "uTop", "uHor", "uFog", "uFar", "uNear", "uSunCol", "uCloud", "uSun", "uSunAmt", "uNight", "uMist"]
        .forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    } catch (e) {
      if (window.console) console.warn("[sky] WebGL unavailable:", e && e.message);
      return false;
    }
    reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    hour = targetHour = colomboHour();
    resize();
    window.addEventListener("resize", function () { resize(); kick(); });
    canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); active = false; });
    document.addEventListener("visibilitychange", function () { if (!document.hidden) kick(); });
    started = true;
    kick();
    return true;
  }

  window.RKSky = {
    init: init,
    setHour: function (h, instant) { targetHour = h; if (instant) hour = h; kick(); },
    setScroll: function (v) { targetScroll = v; kick(); },
    setPointer: function (x, y) { tmx = x; tmy = y; },
    setActive: function (on) { active = !!on; if (active) kick(); },
    colomboHour: colomboHour,
    state: function () { return { hour: hour, targetHour: targetHour, scroll: scroll, active: active }; },
    sample: sample
  };
})();
