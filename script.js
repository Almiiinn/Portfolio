// ── CURSOR (faster, white) ──
(function(){
  if(window.innerWidth <= 640) return;
  var cur = document.getElementById('cursor');
  var ring = document.getElementById('cursorRing');
  var rx=0,ry=0,mx=0,my=0;
  document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
  function lerp(a,b,t){return a+(b-a)*t;}
  function loop(){rx=lerp(rx,mx,.28);ry=lerp(ry,my,.28);ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);}
  loop();
})();

// ── DRAWER ──
function toggleDrawer(){
  var d=document.getElementById('drawer');
  var h=document.getElementById('hamburger');
  d.classList.toggle('open');
  h.classList.toggle('open');
}
function closeDrawer(){
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// ── NAV ACTIVE ──
document.querySelectorAll('[data-nav]').forEach(function(a){
  a.addEventListener('click',function(){
    document.querySelectorAll('[data-nav]').forEach(function(x){
      x.style.color='#5a6a7e';
      x.style.webkitTextFillColor='#5a6a7e';
    });
    a.style.color='#4f9cf9';
    a.style.webkitTextFillColor='#4f9cf9';
  });
});

// ── REVEAL on scroll ──
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.classList.add('visible');
      if(e.target.classList.contains('skill-bar-row')) e.target.classList.add('visible');
    }
  });
},{threshold:0.08});
document.querySelectorAll('.reveal,.skill-bar-row').forEach(function(el){io.observe(el);});

// ── THREE.JS HERO ──
(function(){
  var canvas = document.getElementById('hero-canvas');
  var renderer = new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  var W=window.innerWidth,H=window.innerHeight;
  renderer.setSize(W,H);
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60,W/H,.1,100);
  camera.position.z=5;

  // Particles
  var count=1200;
  var geo=new THREE.BufferGeometry();
  var pos=new Float32Array(count*3);
  var col=new Float32Array(count*3);
  for(var i=0;i<count;i++){
    pos[i*3]=(Math.random()-0.5)*16;
    pos[i*3+1]=(Math.random()-0.5)*16;
    pos[i*3+2]=(Math.random()-0.5)*8;
    var r=Math.random();
    if(r<0.7){col[i*3]=0.31;col[i*3+1]=0.61;col[i*3+2]=0.976;}
    else if(r<0.85){col[i*3]=0.788;col[i*3+1]=0.659;col[i*3+2]=0.298;}
    else{col[i*3]=1;col[i*3+1]=1;col[i*3+2]=1;}
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  var mat=new THREE.PointsMaterial({size:.04,vertexColors:true,transparent:true,opacity:.7});
  scene.add(new THREE.Points(geo,mat));

  // Torus
  var tMat=new THREE.MeshBasicMaterial({color:0x4f9cf9,wireframe:true,transparent:true,opacity:.08});
  var torus=new THREE.Mesh(new THREE.TorusGeometry(2.5,0.8,12,60),tMat);
  scene.add(torus);

  // Ico
  var icoMat=new THREE.MeshBasicMaterial({color:0x4f9cf9,wireframe:true,transparent:true,opacity:.12});
  var ico=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2,1),icoMat);
  ico.position.set(3,1,0);
  scene.add(ico);

  var mouse={x:0,y:0};
  document.addEventListener('mousemove',function(e){mouse.x=(e.clientX/window.innerWidth-.5)*2;mouse.y=-(e.clientY/window.innerHeight-.5)*2;});

  var clock=new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    var t=clock.getElapsedTime();
    torus.rotation.x=t*.08;
    torus.rotation.y=t*.05;
    ico.rotation.x=t*.12;
    ico.rotation.y=t*.1;
    camera.position.x+=(mouse.x*.4-camera.position.x)*.04;
    camera.position.y+=(mouse.y*.4-camera.position.y)*.04;
    renderer.render(scene,camera);
  }
  animate();

  window.addEventListener('resize',function(){
    W=window.innerWidth;H=window.innerHeight;
    camera.aspect=W/H;camera.updateProjectionMatrix();
    renderer.setSize(W,H);
  });
})();
