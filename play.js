/* Play page: one Pop-Eyed at a time (Louis 11/27). Models exported from Blender by Bill.
   Hold = eyes pop, release = back. Drag = turn it around, springs back to the front. Pop counter with milestones. */
(function(){
  const SHORT = window.PP_SHORT || {};
  const mw = id => SHORT[id] || 'https://makerworld.com/en/models/' + id;
  const pat = u => SHORT[u] || u;
  // [file, name, thumb, link, link label]
  const LIST = [
    ['pop-eyed-duck-v2','Duck V2','img/p_pop-eyed-duck-v2.jpg',pat('https://www.patreon.com/Patopato_design/posts/bonus-model-1-v2-169124528'),'Get it on Patreon'],
    ['pop-eyed-cactus','Cactus','img/2632867.jpg',mw('2632867'),'Download free on MakerWorld'],
    ['pop-eyed-moai','Moai','img/2561764.jpg',mw('2561764'),'Download free on MakerWorld'],
    ['pop-eyed-owl','Owl','img/3502170.jpg',mw('3502170'),'Download free on MakerWorld'],
    ['pop-eyed-skull','Skull','img/3432570.jpg',mw('3432570'),'Download free on MakerWorld'],
    ['pop-eyed-fat-cat','Fat Cat','img/2730709.jpg',mw('2730709'),'Download free on MakerWorld'],
    ['pop-eyed-pumpkin-cat','Pumpkin Cat','img/p_pop-eyed-pumpkin-cat.jpg',pat('https://www.patreon.com/Patopato_design/posts/october-model-1-171091808'),'Get it on Patreon']
  ];
  const stage = document.getElementById('stage'); if (!stage || !window.THREE) return;
  const note = document.getElementById('stage-note'), picker = document.getElementById('picker');
  const nameEl = document.getElementById('toy-name'), go = document.getElementById('toy-go');
  const countEl = document.getElementById('pops'), toast = document.getElementById('toast');

  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.outputEncoding = THREE.sRGBEncoding;
  stage.prepend(renderer.domElement);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xe8d8c0, 0.8));
  const sun = new THREE.DirectionalLight(0xffffff, 0.9); sun.position.set(3, 8, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {left:-2, right:2, top:2, bottom:-2, near:0.5, far:30}); scene.add(sun);
  const fill = new THREE.DirectionalLight(0xfff1dc, 0.35); fill.position.set(-5, 3, -3); scene.add(fill);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({opacity:0.22})); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  // colour fixes from Louis 11/24
  const COLORS = {'pop-eyed-owl':{head:0xb5824f, base:0x5c3b22}, 'pop-eyed-fat-cat':{head:0xf1e6cf, base:0xf1e6cf}, 'pop-eyed-skull':{head:0xc9c6bd, base:0x8a857b}};
  const EYE_BOOST = 1.6, PRESS_SPEED = 2.2;
  const cache = {}; let it = null, want = null;
  function findTimes(actions){ let best = 0, peak = 0.3, tr = null;
    actions.forEach(a => a.getClip().tracks.forEach(t => { if (!/eyes.*position/.test(t.name)) return; tr = t;
      const v = t.values, n = v.length / 3; for (let i = 0; i < n; i++){ const d = Math.hypot(v[i*3]-v[0], v[i*3+1]-v[1], v[i*3+2]-v[2]); if (d > best){ best = d; peak = t.times[i]; } } }));
    let back = peak; if (tr){ const v = tr.values, n = v.length / 3; for (let i = 0; i < n; i++){ if (tr.times[i] < peak) continue;
      const d = Math.hypot(v[i*3]-v[0], v[i*3+1]-v[1], v[i*3+2]-v[2]); if (d < best * 0.97){ back = tr.times[Math.max(0, i - 1)]; break; } } }
    return {peak, back}; }
  function build(file, g){
    const m = g.scene, col = COLORS[file] || {};
    m.traverse(o => { if (o.isMesh){ o.castShadow = true; if (col[o.name]){ o.material = o.material.clone(); o.material.color.setHex(col[o.name]).convertSRGBToLinear(); } } });
    const box = new THREE.Box3().setFromObject(m), c = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3());
    const s = 1 / sz.y; m.scale.setScalar(s); m.position.set(-c.x * s, -box.min.y * s, -c.z * s);
    const holder = new THREE.Group(); holder.add(m);
    const mixer = new THREE.AnimationMixer(m);
    g.animations.forEach(a => a.tracks.forEach(t => { if (!/eyes.*position/.test(t.name)) return; const v = t.values;
      for (let i = 3; i < v.length; i += 3){ for (let k = 0; k < 3; k++) v[i+k] = v[k] + (v[i+k] - v[k]) * EYE_BOOST; } }));
    const actions = g.animations.map(a => { const x = mixer.clipAction(a); x.setLoop(THREE.LoopOnce); x.clampWhenFinished = false; return x; });
    return {holder, mixer, actions, times:findTimes(actions), holding:false, cycle:false, spin:0};
  }
  function show(i){
    const [file, name, , link, label] = LIST[i]; want = file;
    picker.querySelectorAll('button').forEach((b, j) => b.classList.toggle('on', j === i));
    nameEl.textContent = 'Pop-Eyed ' + name; go.href = link; go.textContent = label + ' ›';
    const put = rec => { if (want !== file) return; if (it) scene.remove(it.holder); it = rec; it.holder.rotation.set(0, 0, 0); it.spin = 0; scene.add(it.holder); note.hidden = true; };
    if (cache[file]) return put(cache[file]);
    note.hidden = false; note.textContent = 'Loading ' + name + '…';
    new THREE.GLTFLoader().load('3d/' + file + '.glb', g => { cache[file] = build(file, g); put(cache[file]); },
      undefined, () => { if (want === file) note.textContent = 'Could not load. Try another one.'; });
  }
  picker.innerHTML = LIST.map((x, i) => '<button type="button" aria-label="' + x[1] + '"><img src="' + x[2] + '" alt="" loading="lazy"><span>' + x[1] + '</span></button>').join('');
  picker.querySelectorAll('button').forEach((b, i) => b.addEventListener('click', () => show(i)));

  function layout(){ const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h;
    const fov = cam.fov * Math.PI / 180, d = Math.max((0.75 / Math.tan(fov / 2)) / Math.min(1, cam.aspect) * 1.0, 2.6);
    cam.position.set(0, 0.5 + d * 0.22, d); cam.lookAt(0, 0.5, 0); cam.updateProjectionMatrix(); }
  new ResizeObserver(layout).observe(stage); layout();

  // pointer: eyes-follow when idle; hold = pop; drag = turn around
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), look = new THREE.Vector3(0, 0.6, 4), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2.5);
  function setPointer(e){ const r = stage.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam); const p = new THREE.Vector3(); if (ray.ray.intersectPlane(plane, p)) look.copy(p); }
  window.addEventListener('pointermove', setPointer);
  let down = null;
  function press(){ if (!it || !it.actions.length) return; it.holding = true; it.cycle = true;
    it.actions.forEach(a => { a.reset(); a.paused = false; a.timeScale = PRESS_SPEED; a.play(); }); popped(); }
  stage.addEventListener('pointerdown', e => { if (!it) return; setPointer(e);
    try { stage.setPointerCapture(e.pointerId); } catch (_){}
    down = {x:e.clientX, spin:it.spin, drag:false}; press(); });
  stage.addEventListener('pointermove', e => { if (!down || !it) return; const dx = e.clientX - down.x;
    if (!down.drag && Math.abs(dx) > 10){ down.drag = true; it.holding = false; }
    if (down.drag) it.spin = down.spin + dx / stage.clientWidth * Math.PI * 2.2; });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => stage.addEventListener(ev, () => { if (it){ it.holding = false; } down = null; }));

  // pop counter with little rewards every 10 / 50 / 100 (Louis 11/27)
  let pops = +(localStorage.getItem('pp-pops') || 0); countEl.textContent = pops;
  const MSG = {10:'10 pops! Nice start 👀', 50:'50 pops! The eyes are getting dizzy 😵', 100:'100 pops! Pop-Eyed master 🏆'};
  let tt;
  function say(t, big){ toast.textContent = t; toast.className = 'toast show' + (big ? ' big' : ''); clearTimeout(tt); tt = setTimeout(() => toast.className = 'toast', big ? 2600 : 1600); }
  function confetti(){ const box = document.createElement('div'); box.className = 'confetti';
    for (let i = 0; i < 40; i++){ const s = document.createElement('i'); s.style.left = Math.random() * 100 + '%'; s.style.background = ['#ef7d1a','#748a33','#f2c14e','#4aa3df','#e05a7a'][i % 5];
      s.style.animationDelay = Math.random() * 0.3 + 's'; s.style.transform = 'rotate(' + Math.random() * 360 + 'deg)'; box.appendChild(s); }
    stage.appendChild(box); setTimeout(() => box.remove(), 2200); }
  function popped(){ pops++; localStorage.setItem('pp-pops', pops); countEl.textContent = pops;
    countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump');
    if (MSG[pops]){ say(MSG[pops], pops >= 50); if (pops >= 50) confetti(); }
    else if (pops % 100 === 0){ say(pops + ' pops! You really love these eyes 🎉', true); confetti(); }
    else if (pops % 10 === 0) say(pops + ' pops!'); }

  function step(){ if (!it.cycle) return; const {peak, back} = it.times;
    it.actions.forEach(a => { if (a.time >= peak && a.time < back){ if (it.holding){ a.time = peak; a.paused = true; } else { a.time = back; a.timeScale = 1; a.paused = false; } } });
    if (!it.holding && it.actions.every(a => a.time >= back)) it.cycle = false; }
  const clock = new THREE.Clock();
  function tick(){ const dt = Math.min(0.05, clock.getDelta());
    if (it){ const h = it.holder;
      if (!down || !down.drag) it.spin += (0 - it.spin) * Math.min(1, dt * 4); // spring back to the front
      let yaw = Math.max(-0.7, Math.min(0.7, Math.atan2(look.x, look.z)));
      if (it.cycle && !(down && down.drag)) yaw = 0.6; // 3/4 view while popping
      if (down && down.drag) yaw = 0;
      const pitch = Math.max(-0.25, Math.min(0.25, -Math.atan2(look.y - 0.6, Math.hypot(look.x, look.z)) * 0.6));
      const target = yaw + it.spin; h.rotation.y += (target - h.rotation.y) * Math.min(1, dt * (down && down.drag ? 20 : it.cycle ? 14 : 7));
      h.rotation.x += (pitch - h.rotation.x) * Math.min(1, dt * 7);
      const sc = it.cycle ? 1.1 : 1; h.scale.setScalar(h.scale.x + (sc - h.scale.x) * Math.min(1, dt * 12));
      it.mixer.update(dt); step(); }
    renderer.render(scene, cam); requestAnimationFrame(tick); }
  requestAnimationFrame(tick);

  show(Math.floor(Math.random() * LIST.length)); // random first toy every visit (Louis 11/27)
})();
