/* ============================================================
   Tool360 — hero 3D "orbit universe"
   A glowing core with three tilted orbit rings; real tool
   glyphs ride the rings as sprites. Defensive by design:
   any failure (no WebGL, small/low-power screen, reduced
   motion) leaves the static fallback composition in place.
   ============================================================ */
(function () {
  "use strict";

  var stage = document.getElementById("hero-stage");
  var canvas = document.getElementById("hero-canvas");
  if (!stage || !canvas) return;

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var smallScreen = window.innerWidth < 720;
  var lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
                 (navigator.deviceMemory && navigator.deviceMemory <= 2);
  if (reduceMotion || smallScreen || lowPower) return;   /* static fallback stays */
  if (typeof THREE === "undefined") return;

  /* Tool glyphs (same stroke paths as the site registry) riding the rings */
  var GLYPHS = [
    { p: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/><path d="M12 8v8"/><path d="M8.5 12h7"/>', c: "#a78bfa" },
    { p: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v4H5"/><path d="M15 3v4h4"/><path d="M9 21v-4H5"/><path d="M15 21v-4h4"/>', c: "#fb923c" },
    { p: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3z"/><path d="M21 14v1"/><path d="M14 21h1"/><path d="M18.5 18.5H21V21h-2.5z"/>', c: "#fb7185" },
    { p: '<path d="M8.5 4C6.6 4 5.5 5 5.5 7v2.6c0 1.2-.5 1.9-1.7 2.4 1.2.5 1.7 1.2 1.7 2.4V17c0 2 1.1 3 3 3"/><path d="M15.5 4c1.9 0 3 1 3 3v2.6c0 1.2.5 1.9 1.7 2.4-1.2.5-1.7 1.2-1.7 2.4V17c0 2-1.1 3-3 3"/>', c: "#22d3ee" },
    { p: '<path d="M4 6h16"/><path d="M4 12h10"/><path d="M4 18h7"/><path d="M17.5 15.5v5"/><path d="M15 18h5"/>', c: "#60a5fa" },
    { p: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="15.5" r="1.4"/>', c: "#fb7185" },
    { p: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15.5 16 10.5 5 21"/>', c: "#a78bfa" },
    { p: '<rect x="2" y="9" width="20" height="6" rx="1.5"/><path d="M6 9v3.2"/><path d="M10 9v3.2"/><path d="M14 9v3.2"/><path d="M18 9v3.2"/>', c: "#4ade80" },
    { p: '<path d="M12 4v9"/><path d="M5.8 6.5l12.4 6"/><path d="M18.2 6.5l-12.4 6"/><circle cx="5.5" cy="18.5" r="1.6"/>', c: "#22d3ee" },
    { p: '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.9 0-1.2-1-1.7-1-2.9 0-1 .8-1.7 2-1.7h2.1A3.9 3.9 0 0 0 21 10.6C20.6 6.4 16.6 3 12 3z"/><circle cx="7.5" cy="10.5" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="16.5" cy="10.5" r="1.2"/>', c: "#fb7185" }
  ];

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    if (!renderer.getContext()) throw new Error("no webgl context");
  } catch (e) { return; }   /* fallback composition remains */

  var DPR_CAP = 1.75;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.6, 10.4);

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  var l1 = new THREE.PointLight(0x8b5cf6, 60, 40); l1.position.set(-5, 4, 5); scene.add(l1);
  var l2 = new THREE.PointLight(0x06b6d4, 50, 40); l2.position.set(5, -3, 4); scene.add(l2);

  var universe = new THREE.Group();
  scene.add(universe);

  /* --- glowing core --- */
  var core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.12, 1),
    new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0x6d28d9, emissiveIntensity: 0.85, roughness: 0.32, metalness: 0.15, flatShading: true })
  );
  universe.add(core);
  var coreWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.16, 1),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.32 })
  );
  universe.add(coreWire);

  function glowTexture() {
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var g = c.getContext("2d");
    var grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(168,110,255,0.85)");
    grad.addColorStop(0.35, "rgba(217,70,239,0.35)");
    grad.addColorStop(1, "rgba(124,58,237,0)");
    g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }
  var glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.set(6.4, 6.4, 1);
  universe.add(glow);

  /* --- orbit rings + glyph riders --- */
  var RINGS = [
    { r: 2.25, tilt: [1.12, 0.15, 0.25], color: 0x8b5cf6, speed: 0.22 },
    { r: 2.85, tilt: [1.35, -0.35, -0.15], color: 0xe879f9, speed: -0.16 },
    { r: 3.45, tilt: [0.95, 0.45, 0.5], color: 0x22d3ee, speed: 0.12 }
  ];
  var riders = [];
  RINGS.forEach(function (cfg, ri) {
    var grp = new THREE.Group();
    grp.rotation.set(cfg.tilt[0], cfg.tilt[1], cfg.tilt[2]);
    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(cfg.r, 0.014, 8, 160),
      new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.75 })
    );
    grp.add(ring);
    universe.add(grp);
    cfg.grp = grp;
    GLYPHS.forEach(function (g, gi) {
      if (gi % RINGS.length !== ri) return;
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="' + g.c + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + g.p + "</svg>";
      var img = new Image();
      var tex = new THREE.Texture(img);
      img.onload = function () { tex.needsUpdate = true; };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      var spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
      spr.scale.set(0.62, 0.62, 1);
      grp.add(spr);
      var count = GLYPHS.filter(function (_, k) { return k % RINGS.length === ri; }).length;
      var idxOnRing = GLYPHS.slice(0, gi + 1).filter(function (_, k) { return k % RINGS.length === ri; }).length - 1;
      riders.push({ spr: spr, grp: grp, r: cfg.r, speed: cfg.speed, ang: (idxOnRing / count) * Math.PI * 2 });
    });
  });

  /* --- particle shell --- */
  var N = 260, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  var palette = [new THREE.Color(0x8b5cf6), new THREE.Color(0xe879f9), new THREE.Color(0x22d3ee), new THREE.Color(0xffffff)];
  for (var i = 0; i < N; i++) {
    var rad = 3.1 + Math.random() * 3.4;
    var th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = rad * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = rad * Math.cos(ph) * 0.72;
    pos[i * 3 + 2] = rad * Math.sin(ph) * Math.sin(th);
    var cc = palette[(Math.random() * palette.length) | 0];
    col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b;
  }
  var pgeo = new THREE.BufferGeometry();
  pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  pgeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  var particles = new THREE.Points(pgeo, new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }));
  universe.add(particles);

  /* --- sizing --- */
  function resize() {
    var w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  /* --- mouse parallax --- */
  var mx = 0, my = 0, tx = 0, ty = 0;
  stage.addEventListener("pointermove", function (e) {
    var r = stage.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 0.55;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 0.4;
  });
  stage.addEventListener("pointerleave", function () { tx = 0; ty = 0; });

  /* --- run only while visible --- */
  var running = true, inView = true;
  document.addEventListener("visibilitychange", function () { running = !document.hidden; });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }, { threshold: 0.02 }).observe(stage);
  }

  stage.classList.add("webgl-on");
  window.__hero3dActive = true;

  var clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    if (!running || !inView) return;
    var t = clock.getElapsedTime();
    core.rotation.y = t * 0.25; core.rotation.x = Math.sin(t * 0.3) * 0.18;
    coreWire.rotation.y = -t * 0.18; coreWire.rotation.z = t * 0.1;
    var pulse = 1 + Math.sin(t * 1.6) * 0.035;
    core.scale.set(pulse, pulse, pulse);
    riders.forEach(function (rd) {
      var a = rd.ang + t * rd.speed;
      rd.spr.position.set(Math.cos(a) * rd.r, Math.sin(a) * rd.r, 0);
    });
    particles.rotation.y = t * 0.02;
    mx += (tx - mx) * 0.045; my += (ty - my) * 0.045;
    universe.rotation.y = mx + t * 0.03;
    universe.rotation.x = my;
    renderer.render(scene, camera);
  })();
})();
