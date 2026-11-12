/* ARCO P++D marker frame: 3D viewer (loads Three.js and the model only when the section is near) */
(() => {
  const box = document.getElementById('pdViewer'); if (!box) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let started = false;
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting && !started) { started = true; io.disconnect(); start(); } }, { rootMargin: '300px' });
  io.observe(box);
  // backup in case the visibility signal never arrives (e.g. a tab opened in the background)
  const backup = () => { if (started) return; const r = box.getBoundingClientRect(); if (r.top < innerHeight + 300 && r.bottom > -300) { started = true; io.disconnect(); start(); } };
  addEventListener('scroll', backup, { passive: true }); setTimeout(backup, 1500);
  async function start() {
    removeEventListener('scroll', backup);
    let THREE, buf;
    try { THREE = await import('https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js'); } catch { return; }
    try { const r = await fetch('products/arco/pd/marker-frame.bin'); if (!r.ok) return; buf = await r.arrayBuffer(); } catch { return; }
    const dv = new DataView(buf);
    if (dv.getUint32(0, true) !== 0x314d4342) return;               // "BCM1"
    const nv = dv.getUint32(4, true); let ni = dv.getUint32(8, true); const big = !!(ni & 0x80000000); ni &= 0x7fffffff;
    const half = dv.getFloat32(12, true), q = new Int16Array(buf, 16, nv * 3);
    let off = 16 + nv * 6; off += (4 - (off % 4)) % 4;
    const idx = big ? new Uint32Array(buf, off, ni) : new Uint16Array(buf, off, ni);
    const pos = new Float32Array(nv * 3), k = half / 32767;
    for (let i = 0; i < nv; i++) { pos[i * 3] = q[i * 3] * k; pos[i * 3 + 1] = q[i * 3 + 2] * k; pos[i * 3 + 2] = -q[i * 3 + 1] * k; }  // CAD Z-up → screen Y-up
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setIndex(new THREE.BufferAttribute(idx, 1));

    const canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden', 'true');
    let renderer; try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return; }
    box.prepend(canvas); box.classList.add('is-3d');
    renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(28, 1, 1, 5000);
    camera.position.set(0, -half * 0.12, half * 6.2);   // a little below centre leaves room for the caption
    const mesh = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0xe9eef8, roughness: .42, metalness: .05, clearcoat: .6, clearcoatRoughness: .3, flatShading: true }));
    const group = new THREE.Group(); group.add(mesh); scene.add(group);
    scene.add(new THREE.AmbientLight(0xffffff, .5));
    const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(120, 200, 260); scene.add(key);
    const rimB = new THREE.PointLight(0x5aa8ff, 60000, 0, 2); rimB.position.set(-260, 80, 120); scene.add(rimB);
    const rimV = new THREE.PointLight(0x8b5cf6, 40000, 0, 2); rimV.position.set(260, -160, 80); scene.add(rimV);

    let rotY = -0.5, rotX = 0.18, velY = reduce ? 0 : 0.004, drag = null, visible = true, raf = 0;
    function size() { const r = box.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix(); }
    size(); addEventListener('resize', size);
    canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, ry: rotY, rx: rotX }; canvas.setPointerCapture(e.pointerId); velY = 0; });
    canvas.addEventListener('pointermove', e => { if (!drag) return; rotY = drag.ry + (e.clientX - drag.x) * 0.01; rotX = Math.max(-0.9, Math.min(0.9, drag.rx + (e.clientY - drag.y) * 0.006)); kick(); });
    const end = () => { drag = null; velY = reduce ? 0 : 0.004; };
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
    new IntersectionObserver(es => { visible = es[0].isIntersecting; kick(); }).observe(box);
    function kick() { if (visible && !raf) raf = requestAnimationFrame(frame); }
    function frame(now) {
      raf = 0; rotY += velY;
      group.rotation.y = rotY; group.rotation.x = rotX;
      group.position.y = reduce ? 0 : Math.sin(now / 900) * half * 0.02;
      renderer.render(scene, camera);
      if (visible && (velY || drag)) raf = requestAnimationFrame(frame);
    }
    kick();
  }
})();
