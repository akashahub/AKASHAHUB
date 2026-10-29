import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

const canvas = document.getElementById("campo");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!canvas || reduce) {
  if (canvas) canvas.hidden = true;
} else {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  camera.position.set(0, 0.2, 9);

  const gold = 0xc9a227;
  const plum = 0x5c3d78;
  const ivory = 0xf4efe6;

  const count = window.innerWidth < 720 ? 700 : 1600;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2.2 + Math.random() * 7.5;
    const a = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 8;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(a) * r * 0.55;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({ color: gold, size: 0.028, transparent: true, opacity: 0.72, depthWrite: false })
  );
  scene.add(dust);

  const rings = new THREE.Group();
  const ringMat = new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.45, wireframe: true });
  const plumMat = new THREE.MeshBasicMaterial({ color: plum, transparent: true, opacity: 0.35, wireframe: true });
  for (let i = 0; i < 5; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15 + i * 0.38, 0.012, 12, 96), i % 2 ? plumMat : ringMat);
    ring.rotation.x = Math.PI / 2.4 + i * 0.18;
    ring.rotation.y = i * 0.4;
    rings.add(ring);
  }
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.72, 1),
    new THREE.MeshBasicMaterial({ color: ivory, transparent: true, opacity: 0.16, wireframe: true })
  );
  rings.add(core);
  scene.add(rings);

  const pointer = { x: 0, y: 0 };
  let scroll = 0;
  let pulse = 0;
  let running = true;

  function size() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  size();
  window.addEventListener("resize", size);
  window.addEventListener("pointermove", (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });
  window.addEventListener("scroll", () => {
    const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    scroll = window.scrollY / max;
  }, { passive: true });
  document.addEventListener("visibilitychange", () => { running = document.visibilityState !== "hidden"; });
  window.addEventListener("al2-pulse", (e) => {
    pulse = 1;
    const tone = e.detail && e.detail.tone === "plum" ? plum : gold;
    ringMat.color.setHex(tone);
  });

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    const t = clock.getElapsedTime();
    pulse *= 0.94;
    rings.rotation.y = t * 0.12 + pointer.x * 0.35;
    rings.rotation.x = 0.4 + pointer.y * 0.18 + scroll * 0.6;
    const s = 1 + pulse * 0.18 + Math.sin(t * 1.4) * 0.02;
    rings.scale.setScalar(s);
    dust.rotation.y = t * 0.03;
    dust.position.y = Math.sin(t * 0.2) * 0.15 - scroll * 1.4;
    ringMat.opacity = 0.32 + pulse * 0.45;
    camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 0.45 + 0.2 - scroll * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  frame();
}
