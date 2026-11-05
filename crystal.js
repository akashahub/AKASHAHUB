(async function initAkashaCrystal(){
  const canvas=document.getElementById('brandCanvas'),fallback=document.getElementById('brandFallback');
  const stage=document.getElementById('brandStage'),journey=document.querySelector('.hero-v2');
  const heroCopy=document.querySelector('.hero-v2 .hero-copy');
  if(!canvas||!stage||!journey)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),coarse=window.matchMedia('(pointer: coarse)').matches;
  try{
    const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js');
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!coarse,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,coarse?1.1:1.75));
    renderer.setSize(Math.max(1,stage.clientWidth),Math.max(1,stage.clientHeight),false);
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.28;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,stage.clientWidth/Math.max(1,stage.clientHeight),.08,80);
    camera.position.set(0,0.15,7.8);
    scene.add(new THREE.HemisphereLight(0xf0e6ff,0x0a0614,1.8));
    const key=new THREE.DirectionalLight(0xfff0d0,4.2);key.position.set(-4,5,6);key.castShadow=true;scene.add(key);
    const violetRim=new THREE.PointLight(0x9b5cff,48,18);violetRim.position.set(3.2,1.2,-1.8);scene.add(violetRim);
    const goldFill=new THREE.PointLight(0xe8b84a,22,14);goldFill.position.set(-2.8,-1.6,3.2);scene.add(goldFill);
    const coreLight=new THREE.PointLight(0xfff6e0,12,6);coreLight.position.set(0,0.2,0.4);scene.add(coreLight);
    const crystalGroup=new THREE.Group();scene.add(crystalGroup);
    const geometry=new THREE.BufferGeometry(),rings=[],sides=12;
    for(let ring=0;ring<3;ring++){
      const y=ring===0?0.72:ring===1?0:-0.68, base=ring===0?0.78:ring===1?0.95:0.68;
      const points=[];
      for(let i=0;i<sides;i++){
        const a=i/sides*Math.PI*2 + ring*0.15;
        const r=base*(1+Math.sin(i*2.7+ring)*0.04);
        points.push(new THREE.Vector3(Math.cos(a)*r, y, Math.sin(a)*r*0.78));
      }
      rings.push(points);
    }
    const top=new THREE.Vector3(0,1.72,0), bottom=new THREE.Vector3(0,-1.48,0), verts=[];
    const tri=(a,b,c)=>verts.push(a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z);
    for(let i=0;i<sides;i++){
      const n=(i+1)%sides;
      tri(top,rings[0][i],rings[0][n]);
      tri(rings[0][i],rings[1][i],rings[0][n]);
      tri(rings[0][n],rings[1][i],rings[1][n]);
      tri(rings[1][i],rings[2][i],rings[1][n]);
      tri(rings[1][n],rings[2][i],rings[2][n]);
      tri(bottom,rings[2][n],rings[2][i]);
    }
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
    geometry.computeVertexNormals();
    const crystalMaterial=new THREE.MeshPhysicalMaterial({
      color:0xa078f0, metalness:0.08, roughness:0.08, transmission:0.62, thickness:2.1,
      ior:1.68, clearcoat:1, clearcoatRoughness:0.04, iridescence:0.65, iridescenceIOR:1.4,
      attenuationColor:new THREE.Color(0x5a28a0), attenuationDistance:1.4,
      transparent:true, opacity:0.98, side:THREE.DoubleSide, flatShading:true
    });
    const crystalMesh=new THREE.Mesh(geometry,crystalMaterial);crystalMesh.castShadow=true;crystalGroup.add(crystalMesh);
    const goldMaterial=new THREE.MeshPhysicalMaterial({color:0xe8c070, metalness:0.95, roughness:0.15, emissive:0x6a4010, emissiveIntensity:0.45, transparent:true, opacity:0.9});
    const paths=[
      [[-0.52,-0.72,0.15],[-0.28,-0.22,0.32],[0.08,0.05,0.38],[0.48,0.32,0.12],[0.22,0.75,0.04]],
      [[0.48,-0.82,-0.1],[0.15,-0.38,0.22],[-0.1,0.02,0.34],[-0.42,0.38,0.1],[-0.15,0.85,0.0]],
      [[-0.6,0.32,-0.12],[-0.18,0.52,0.25],[0.18,0.62,0.28],[0.55,0.4,0.02]]
    ];
    paths.forEach(path=>{
      const curve=new THREE.CatmullRomCurve3(path.map(p=>new THREE.Vector3(...p)));
      crystalGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve,80,0.016,8,false),goldMaterial));
    });
    const core=new THREE.Mesh(new THREE.OctahedronGeometry(0.42,2),new THREE.MeshPhysicalMaterial({
      color:0x7a40d0, metalness:0.15, roughness:0.06, transmission:0.45, clearcoat:1,
      emissive:0x3a1060, emissiveIntensity:0.55, transparent:true, opacity:0.95
    }));
    core.position.set(0.02,-0.04,0.06);crystalGroup.add(core);
    const ringGroup=new THREE.Group();crystalGroup.add(ringGroup);
    const ringMat=new THREE.MeshBasicMaterial({color:0xc9a24b, transparent:true, opacity:0.55, side:THREE.DoubleSide});
    for(let i=0;i<3;i++){
      const r=1.85+i*0.22;
      const torus=new THREE.Mesh(new THREE.TorusGeometry(r,0.008,8,120),ringMat.clone());
      torus.rotation.x=Math.PI/2 + i*0.35;
      torus.rotation.y=i*0.6;
      ringGroup.add(torus);
    }
    const nodeGeo=new THREE.SphereGeometry(0.045,16,16);
    const nodeMat=new THREE.MeshStandardMaterial({color:0xffe8b0, emissive:0xd4a017, emissiveIntensity:1.2, metalness:0.8, roughness:0.2});
    for(let i=0;i<8;i++){
      const node=new THREE.Mesh(nodeGeo,nodeMat);
      const ang=i/8*Math.PI*2;
      node.position.set(Math.cos(ang)*1.95, Math.sin(ang*1.3)*0.4, Math.sin(ang)*1.95);
      ringGroup.add(node);
    }
    const moleculeGroup=new THREE.Group();scene.add(moleculeGroup);
    const moleculeMaterials=[],nodePositions=[];
    const count=coarse?48:96, nodeGeometry=new THREE.IcosahedronGeometry(0.032,1);
    for(let i=0;i<count;i++){
      const phi=Math.acos(2*Math.random()-1), theta=Math.random()*Math.PI*2, r=0.6+Math.random()*1.4;
      const p=new THREE.Vector3(r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi)*0.9, r*Math.sin(phi)*Math.sin(theta));
      nodePositions.push(p);
      const isGold=i%5===0;
      const mat=new THREE.MeshStandardMaterial({
        color:isGold?0xf0c878:0xc8a8ff, emissive:isGold?0x8a5a1a:0x3a1868, emissiveIntensity:0.85,
        metalness:0.55, roughness:0.22, transparent:true, opacity:0
      });
      moleculeMaterials.push(mat);
      const node=new THREE.Mesh(nodeGeometry,mat);node.position.copy(p);moleculeGroup.add(node);
    }
    const linePositions=[];
    for(let i=0;i<nodePositions.length;i++)
      for(let j=i+1;j<nodePositions.length;j++)
        if(nodePositions[i].distanceTo(nodePositions[j])<0.68 && Math.random()>0.55)
          linePositions.push(...nodePositions[i].toArray(), ...nodePositions[j].toArray());
    const lineGeometry=new THREE.BufferGeometry();
    lineGeometry.setAttribute('position',new THREE.Float32BufferAttribute(linePositions,3));
    const moleculeLines=new THREE.LineSegments(lineGeometry,new THREE.LineBasicMaterial({color:0xb8a0ff, transparent:true, opacity:0}));
    moleculeGroup.add(moleculeLines);
    moleculeGroup.scale.setScalar(0.28);moleculeGroup.position.z=-0.5;
    const particleCount=coarse?140:320;
    const particleGeometry=new THREE.BufferGeometry();
    const particlePositions=new Float32Array(particleCount*3);
    for(let i=0;i<particleCount;i++){
      particlePositions[i*3]=(Math.random()-0.5)*8;
      particlePositions[i*3+1]=(Math.random()-0.5)*7;
      particlePositions[i*3+2]=(Math.random()-0.5)*6;
    }
    particleGeometry.setAttribute('position',new THREE.BufferAttribute(particlePositions,3));
    const particles=new THREE.Points(particleGeometry,new THREE.PointsMaterial({
      color:0xe8d8ff, size:coarse?0.022:0.016, transparent:true, opacity:0.55, sizeAttenuation:true, blending:THREE.AdditiveBlending
    }));
    scene.add(particles);
    const bgUniforms={uTime:{value:0},uMouse:{value:new THREE.Vector2(0.5,0.5)},uScroll:{value:0}};
    const bgMaterial=new THREE.ShaderMaterial({
      uniforms:bgUniforms, depthWrite:false, depthTest:false,
      vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:`uniform float uTime;uniform vec2 uMouse;uniform float uScroll;varying vec2 vUv;
        void main(){
          vec2 uv=vUv; float d=distance(uv,uMouse);
          float ring=exp(-abs(d-(0.14+0.02*sin(uTime*1.6)))*70.0);
          float glow=exp(-d*6.5)*0.28; float pulse=ring*(0.06+0.03*sin(uTime*2.8));
          vec3 base=mix(vec3(0.012,0.008,0.022), vec3(0.038,0.02,0.065), smoothstep(0.0,1.0,uv.y));
          vec3 violet=vec3(0.32,0.14,0.55)*(glow+pulse);
          vec3 gold=vec3(0.38,0.26,0.1)*exp(-distance(uv,vec2(0.75,0.55))*8.5)*0.14;
          gl_FragColor=vec4(base+violet+gold,1.0);
        }`
    });
    const bgPlane=new THREE.Mesh(new THREE.PlaneGeometry(42,30),bgMaterial);
    bgPlane.position.z=-8; bgPlane.renderOrder=-10; scene.add(bgPlane);
    if(fallback)fallback.hidden=true;
    let pointerX=0.5,pointerY=0.5,targetX=0,targetY=0,scrollProgress=0,raf=0,visible=true;
    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
    canvas.addEventListener('pointermove',e=>{
      const r=canvas.getBoundingClientRect();
      pointerX=clamp((e.clientX-r.left)/r.width,0,1);
      pointerY=clamp((e.clientY-r.top)/r.height,0,1);
      targetY=(pointerX-0.5)*0.85; targetX=(pointerY-0.5)*-0.58;
      bgUniforms.uMouse.value.set(pointerX,pointerY);
    },{passive:true});
    canvas.addEventListener('pointerleave',()=>{targetX=0;targetY=0;},{passive:true});
    const updateScroll=()=>{
      if(reduced.matches){scrollProgress=0;return;}
      const rect=journey.getBoundingClientRect(), span=Math.max(1,journey.offsetHeight-window.innerHeight);
      scrollProgress=clamp(-rect.top/span,0,1);
    };
    window.addEventListener('scroll',updateScroll,{passive:true}); updateScroll();
    const resize=()=>{
      const w=Math.max(1,stage.clientWidth), h=Math.max(1,stage.clientHeight);
      renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
    };
    if('ResizeObserver'in window) new ResizeObserver(resize).observe(stage);
    else window.addEventListener('resize',resize,{passive:true});
    const visibility=new IntersectionObserver(entries=>{
      visible=entries[0].isIntersecting;
      if(visible&&!raf&&!reduced.matches) render();
      if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}
    });
    visibility.observe(journey);
    function render(){
      raf=requestAnimationFrame(render);
      if(!visible||document.visibilityState==='hidden') return;
      const t=performance.now()*0.001, p=scrollProgress;
      bgUniforms.uTime.value=t; bgUniforms.uScroll.value=p;
      crystalGroup.rotation.y += (targetY - crystalGroup.rotation.y)*0.04;
      crystalGroup.rotation.x += (targetX - crystalGroup.rotation.x)*0.04;
      crystalGroup.rotation.z = Math.sin(t*0.28)*0.02;
      ringGroup.rotation.y += 0.0022; ringGroup.rotation.x = Math.sin(t*0.4)*0.08;
      particles.rotation.y += 0.00032; particles.rotation.x += 0.0001;
      const zoom=smooth(0.08,0.72,p);
      camera.position.z=7.8 - zoom*4.2; camera.position.y=0.15 + zoom*0.3;
      camera.fov=32 + zoom*10; camera.updateProjectionMatrix(); camera.lookAt(0,0.05,0);
      crystalGroup.scale.setScalar(1 + zoom*0.55);
      const shell=1 - smooth(0.38,0.78,p)*0.92;
      crystalMaterial.opacity=shell; goldMaterial.opacity=shell*0.85; core.material.opacity=shell;
      ringGroup.visible=shell>0.15;
      const micro=smooth(0.32,0.7,p);
      moleculeGroup.visible=micro>0.008;
      moleculeGroup.scale.setScalar(0.28 + micro*2.8);
      moleculeGroup.rotation.y = -t*0.05;
      moleculeMaterials.forEach(m=>m.opacity=micro*0.95);
      moleculeLines.material.opacity=micro*0.42;
      violetRim.position.x=3.2 + pointerX*2.4; violetRim.position.y=1.2 + (0.5-pointerY)*2.2;
      goldFill.position.x=-2.8 + pointerX*1.6; goldFill.intensity=22 + micro*10;
      coreLight.intensity=12 + Math.sin(t*2.2)*3 + micro*6;
      if(heroCopy){
        heroCopy.style.opacity=String(1 - smooth(0.1,0.46,p)*0.96);
        heroCopy.style.transform='translate3d(0,'+(-p*22)+'px,0)';
        heroCopy.style.pointerEvents=p>0.5?'none':'auto';
      }
      renderer.render(scene,camera);
    }
    if(reduced.matches){ renderer.render(scene,camera); }
    else render();
    reduced.addEventListener?.('change',()=>{
      if(reduced.matches){ if(raf) cancelAnimationFrame(raf); raf=0; updateScroll(); renderer.render(scene,camera); }
      else if(!raf) render();
    });
  }catch(error){
    canvas.hidden=true; if(fallback) fallback.hidden=false;
    stage.classList.add('brand-stage-fallback');
    console.warn('AKASHA crystal WebGL fallback:',error);
  }
}
initAkashaCrystal();
