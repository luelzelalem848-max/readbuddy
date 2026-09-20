/* 3D hero scene — WebGL via three.js, themed objects, mouse parallax */
(function () {
  var canvas = document.getElementById('scene3d');
  if (!canvas || typeof THREE === 'undefined') return;
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0f0a23, 0.05);
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  scene.add(new THREE.AmbientLight(0x8899bb, 0.5));
  var key = new THREE.PointLight(0xa29bfe, 1.7, 60); key.position.set(6, 6, 8); scene.add(key);
  var rim = new THREE.PointLight(0xfd79a6, 1.0, 60); rim.position.set(-8, -3, 6); scene.add(rim);
  var top = new THREE.DirectionalLight(0xffffff, .5); top.position.set(0, 10, 5); scene.add(top);

  var group = new THREE.Group();
  scene.add(group);
  var floats = [];

  function reg(mesh, amp, sp, rx, ry) {
    mesh.userData = { y0: mesh.position.y, amp: amp, sp: sp, ph: Math.random() * Math.PI * 2, rx: rx || 0, ry: ry || 0 };
    group.add(mesh); floats.push(mesh);
    return mesh;
  }

  
  var covers = [0xB39DDB, 0x88D8B0, 0xFFB7D5, 0xFFD98E, 0x9AD1F5];
  var bookSpots = [[-6.0,2.2,-2.5],[-3.2,-2.8,-1],[6.6,1.8,-3],[4.2,-3.4,-.8],[-1.6,3.6,-4],[2.8,3.9,-3],[7.4,-1.4,-4.5],[-5.0,-4.0,-3],[0.2,-4.4,-2]];
  bookSpots.forEach(function (s, i) {
    var b = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.25, 0.2),
      new THREE.MeshStandardMaterial({ color: covers[i % covers.length], roughness: 0.55, metalness: 0.1 }));
    b.position.set(s[0], s[1], s[2]);
    b.rotation.set(Math.random()*.5-.25, Math.random()*3, Math.random()*.6-.3);
    reg(b, 0.6, .55 + Math.random()*.4, 0.002, 0.005);
  });
  // open book
  var ob = new THREE.Group();
  var pageMat = new THREE.MeshStandardMaterial({ color: 0xFFF6E5, roughness: 0.7 });
  [-1, 1].forEach(function (sx) {
    var pg = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 1.1), pageMat);
    pg.position.x = sx * 0.38; pg.rotation.z = sx * 0.22;
    ob.add(pg);
    var cv = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x9B7EDE, roughness: 0.5 }));
    cv.position.set(sx * 0.38, -0.05, 0); cv.rotation.z = sx * 0.22;
    ob.add(cv);
  });
  ob.position.set(0, -0.4, -2); ob.scale.setScalar(1.6);
  reg(ob, 0.35, .45, 0.004, 0.01);
  // glowing stars
  var starMat = new THREE.MeshStandardMaterial({ color: 0xFFE08A, emissive: 0xFFD166, emissiveIntensity: 1.4, roughness: 0.3 });
  [[-4.4,3.8,-2],[5.2,3.6,-2],[8.0,2.4,-4],[-8.3,1.2,-3],[2.0,-4.8,-3]].forEach(function (s) {
    var st = new THREE.Mesh(new THREE.OctahedronGeometry(0.34), starMat);
    st.position.set(s[0], s[1], s[2]);
    reg(st, 0.45, .9, 0.01, 0.012);
  });
  // moon
  var moon = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xFFEEC0, emissive: 0xFFDf9e, emissiveIntensity: 0.9, roughness: 0.6 }));
  moon.position.set(8.8, 4.6, -8);
  reg(moon, 0.2, .25, 0.0005, 0.001);


  // dust particles
  var pGeo = new THREE.BufferGeometry();
  var pArr = new Float32Array(200 * 3);
  for (var i = 0; i < 200; i++) {
    pArr[i * 3] = (Math.random() - .5) * 24;
    pArr[i * 3 + 1] = (Math.random() - .5) * 14;
    pArr[i * 3 + 2] = (Math.random() - .5) * 12;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
  var pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffe08a, size: 0.05, transparent: true, opacity: 0.55 }));
  group.add(pts);


  /* ---- v3: glow bloom sprites (procedural, additive) ---- */
  var gc = document.createElement('canvas'); gc.width = gc.height = 128;
  var gctx = gc.getContext('2d');
  var ggr = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  ggr.addColorStop(0, 'rgba(255,255,255,1)');
  ggr.addColorStop(.3, 'rgba(255,255,255,.45)');
  ggr.addColorStop(1, 'rgba(255,255,255,0)');
  gctx.fillStyle = ggr; gctx.fillRect(0, 0, 128, 128);
  var glowTex = new THREE.CanvasTexture(gc);
  function mkGlow(color, x, y, z, s, op) {
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: color, transparent: true, opacity: op,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    sp.position.set(x, y, z); sp.scale.setScalar(s);
    scene.add(sp);
    return sp;
  }
  mkGlow(0xa29bfe, -6, 3.5, -5, 8, 0.5);
  mkGlow(0xfd79a6, 6.5, -3, -4, 7, 0.42);
  mkGlow(0xffe08a, 0, -4.5, -7, 9, 0.3);

  /* ---- v3: deep nebula starfield ---- */
  var nGeo = new THREE.BufferGeometry();
  var nArr = new Float32Array(700 * 3);
  for (var ni = 0; ni < 700; ni++) {
    var r = 9 + Math.random() * 7;
    var th = Math.random() * Math.PI * 2;
    var ph = Math.acos(2 * Math.random() - 1);
    nArr[ni * 3] = r * Math.sin(ph) * Math.cos(th);
    nArr[ni * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
    nArr[ni * 3 + 2] = -6 - r * Math.cos(ph) * 0.4;
  }
  nGeo.setAttribute('position', new THREE.BufferAttribute(nArr, 3));
  var nebula = new THREE.Points(nGeo, new THREE.PointsMaterial({
    color: 0xffe08a, size: 0.045, transparent: true, opacity: 0.5, depthWrite: false
  }));
  scene.add(nebula);

  /* ---- v3: scroll-driven camera dolly ---- */
  window.addEventListener('scroll', function () {
    var sf = Math.min(window.scrollY / window.innerHeight, 1.2);
    camera.position.z = 11 + sf * 4;
  }, { passive: true });

  var tx = 0, ty = 0;
  window.addEventListener('pointermove', function (e) {
    tx = (e.clientX / window.innerWidth - .5) * 2;
    ty = (e.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });

  function resize() {
    var p = canvas.parentElement;
    var w = p.clientWidth, h = p.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  var visible = true;
  document.addEventListener('visibilitychange', function () { visible = !document.hidden; });

  var clock = new THREE.Clock();
  (function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    var t = clock.getElapsedTime();
    for (var i = 0; i < floats.length; i++) {
      var m = floats[i], u = m.userData;
      m.position.y = u.y0 + Math.sin(t * u.sp + u.ph) * u.amp;
      m.rotation.x = m.rotation.x + u.rx;
      m.rotation.y = m.rotation.y + u.ry;
    }
    pts.rotation.y = t * 0.03;
    nebula.rotation.y = -t * 0.02;
    group.rotation.y += (tx * 0.30 - group.rotation.y) * 0.045;
    group.rotation.x += (ty * 0.14 - group.rotation.x) * 0.045;
    camera.position.x = tx * 0.9; camera.position.y = -ty * 0.55;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();
})();
