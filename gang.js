/* 3D Pop-Eyed gang: models exported from Blender by Bill; hold = eyes pop, release = back */

(function(){
  const LIST=[["pop-eyed-duck-v2","Duck",""],["pop-eyed-cactus","Cactus",""],["pop-eyed-moai","Moai",""],["pop-eyed-owl","Owl",""],
    ["pop-eyed-skull","Skull",""],["pop-eyed-fat-cat","Lucky Cat",""],["pop-eyed-pumpkin-cat","Pumpkin Cat",""]];
  const stage=document.getElementById('gang');if(!stage||!window.THREE)return;const load=document.getElementById('gang-note');
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;
  stage.prepend(renderer.domElement);
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(28,2,0.1,100);
  scene.add(new THREE.HemisphereLight(0xffffff,0xe8d8c0,0.8));
  const sun=new THREE.DirectionalLight(0xffffff,0.9);sun.position.set(3,8,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,1024);
  Object.assign(sun.shadow.camera,{left:-6,right:6,top:4,bottom:-4,near:0.5,far:30});scene.add(sun);
  const fill=new THREE.DirectionalLight(0xfff1dc,0.35);fill.position.set(-5,3,-3);scene.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.ShadowMaterial({opacity:0.22}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);

  // colour fixes from Louis 11/24: owl was too red, fat cat should be off-white
  const COLORS={'pop-eyed-owl':{head:0xb5824f,base:0x5c3b22},'pop-eyed-fat-cat':{head:0xf1e6cf,base:0xf1e6cf},'pop-eyed-skull':{head:0xc9c6bd,base:0x8a857b}};
  const items=[];let loaded=0;const EYE_BOOST=1.6;const PRESS_SPEED=2.2;
  function findTimes(actions){let best=0,peak=0.3,tr=null;actions.forEach(a=>a.getClip().tracks.forEach(t=>{if(!/eyes.*position/.test(t.name))return;tr=t;
      const v=t.values,n=v.length/3;for(let i=0;i<n;i++){const d=Math.hypot(v[i*3]-v[0],v[i*3+1]-v[1],v[i*3+2]-v[2]);if(d>best){best=d;peak=t.times[i];}}}));
    let back=peak;if(tr){const v=tr.values,n=v.length/3;for(let i=0;i<n;i++){if(tr.times[i]<peak)continue;const d=Math.hypot(v[i*3]-v[0],v[i*3+1]-v[1],v[i*3+2]-v[2]);if(d<best*0.97){back=tr.times[Math.max(0,i-1)];break;}}}
    return {peak,back};}
  LIST.forEach(([file,name,tag],idx)=>{
    new THREE.GLTFLoader().load('3d/'+file+'.glb',g=>{
        const m=g.scene;const col=COLORS[file]||{};m.traverse(o=>{if(o.isMesh){o.castShadow=true;if(col[o.name]){o.material=o.material.clone();o.material.color.setHex(col[o.name]).convertSRGBToLinear();}}});
        const box=new THREE.Box3().setFromObject(m),c=box.getCenter(new THREE.Vector3()),sz=box.getSize(new THREE.Vector3());
        const s=1/sz.y;m.scale.setScalar(s);m.position.set(-c.x*s,-box.min.y*s,-c.z*s);
        const holder=new THREE.Group();holder.add(m);scene.add(holder);
        const mixer=new THREE.AnimationMixer(m);
        // pop the eyes further than Bill's clip (Louis 11/24: physically they can go further)
        g.animations.forEach(a=>a.tracks.forEach(t=>{if(!/eyes.*position/.test(t.name))return;const v=t.values;
          for(let i=3;i<v.length;i+=3){for(let k=0;k<3;k++)v[i+k]=v[k]+(v[i+k]-v[k])*EYE_BOOST;}}));
        const actions=g.animations.map(a=>{const x=mixer.clipAction(a);x.setLoop(THREE.LoopOnce);x.clampWhenFinished=false;return x;});
        const lab=document.createElement('div');lab.className='lab';lab.textContent=name;stage.appendChild(lab);
        items[idx]={holder,mixer,actions,lab,w:sz.x*s,times:findTimes(actions),holding:false,cycle:false};
        loaded++;load.textContent='Loading the gang… '+loaded+' / '+LIST.length;if(loaded===LIST.length){load.hidden=true;layout();}
      },undefined,()=>{});
  });

  let cols=7;
  const shelves=[];
  function layout(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;
    const list=items.filter(Boolean);if(!list.length){cam.updateProjectionMatrix();return;}
    cols=w>=760?7:4;const rows=Math.ceil(list.length/cols),gap=1.25,rowH=1.5;
    // rows stack like shelves, one shadow plane per shelf
    while(shelves.length<rows){const g=new THREE.Mesh(new THREE.PlaneGeometry(40,1.2),new THREE.ShadowMaterial({opacity:0.22}));g.rotation.x=-Math.PI/2;g.receiveShadow=true;scene.add(g);shelves.push(g);}
    shelves.forEach((g,r)=>{g.visible=r<rows;g.position.set(0,-r*rowH,0);});ground.visible=false;
    list.forEach((it,i)=>{const r=Math.floor(i/cols),inRow=Math.min(cols,list.length-r*cols),cIdx=i-r*cols;
      it.holder.position.set((cIdx-(inRow-1)/2)*gap,-r*rowH,0);});
    const W=cols*gap,H=1+(rows-1)*rowH+0.35,cy=1-H/2;
    const fov=cam.fov*Math.PI/180,dW=(W/2)/Math.tan(fov/2)/cam.aspect*1.02,dH=(H/2)/Math.tan(fov/2)*1.1;
    const d=Math.max(dW,dH,2.5);cam.position.set(0,cy+d*0.22,d);cam.lookAt(0,cy,0);
    sun.position.set(3,cy+8,6);cam.updateProjectionMatrix();}
  new ResizeObserver(layout).observe(stage);layout();

  const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),look=new THREE.Vector3(0,0.6,4),plane=new THREE.Plane(new THREE.Vector3(0,0,1),-2.5);
  function setPointer(e){const r=stage.getBoundingClientRect();ndc.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
    ray.setFromCamera(ndc,cam);const p=new THREE.Vector3();if(ray.ray.intersectPlane(plane,p))look.copy(p);}
  window.addEventListener('pointermove',setPointer);
  function press(it){if(!it||!it.actions.length)return;it.holding=true;it.cycle=true;it.actions.forEach(a=>{a.reset();a.paused=false;a.timeScale=PRESS_SPEED;a.play();});}
  function release(it){if(it)it.holding=false;}
  let active=null;
  stage.addEventListener('pointerdown',e=>{setPointer(e);ray.setFromCamera(ndc,cam);
    const hits=ray.intersectObjects(items.filter(Boolean).map(i=>i.holder),true);if(!hits.length)return;
    let o=hits[0].object;const it=items.find(i=>{let p=o;while(p){if(p===i.holder)return true;p=p.parent;}return false;});
    try{stage.setPointerCapture(e.pointerId);}catch(_){}active=it;press(it);});
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>stage.addEventListener(ev,()=>{release(active);active=null;}));

  function step(it){if(!it.cycle)return;const {peak,back}=it.times;
    it.actions.forEach(a=>{if(a.time>=peak&&a.time<back){if(it.holding){a.time=peak;a.paused=true;}else{a.time=back;a.timeScale=1;a.paused=false;}}});
    if(!it.holding&&it.actions.every(a=>a.time>=back))it.cycle=false;}
  const clock=new THREE.Clock(),tmp=new THREE.Vector3();
  function tick(){const dt=Math.min(0.05,clock.getDelta());
    items.forEach(it=>{if(!it)return;
      const p=it.holder.position;let yaw=Math.max(-0.9,Math.min(0.9,Math.atan2(look.x-p.x,look.z-p.z)));
      // while pressed: turn to a 3/4 side view and step forward a little so the popping eyes read clearly
      const on=it.cycle;if(on)yaw=(p.x>0.01?-1:1)*0.75;
      const sc=1+(on?0.14:0);it.holder.scale.setScalar(it.holder.scale.x+(sc-it.holder.scale.x)*Math.min(1,dt*12));
      const pitch=Math.max(-0.25,Math.min(0.25,-Math.atan2(look.y-0.6,Math.hypot(look.x-p.x,look.z-p.z))*0.6));
      it.holder.rotation.y+=(yaw-it.holder.rotation.y)*Math.min(1,dt*(it.cycle?14:7));it.holder.rotation.x+=(pitch-it.holder.rotation.x)*Math.min(1,dt*7);
      it.mixer.update(dt);step(it);
      tmp.copy(p);tmp.y=p.y-0.02;tmp.project(cam);const w=stage.clientWidth,h=stage.clientHeight;
      it.lab.style.left=((tmp.x+1)/2*w)+'px';it.lab.style.top=((1-tmp.y)/2*h+6)+'px';});
    renderer.render(scene,cam);requestAnimationFrame(tick);}
  requestAnimationFrame(tick);
})();
