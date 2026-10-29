import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

const canvas = document.getElementById("campo");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!canvas || reduce) {
  if (canvas) canvas.hidden = true;
} else {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  camera.position.set(0, 1.2, 8);

  const grid = new THREE.GridHelper(28, 28, 0x9eb0c8, 0xd5deea);
  grid.position.y = -1.8;
  scene.add(grid);

  const rings = new THREE.Group();
  const cyan = new THREE.MeshBasicMaterial({ color: 0x0b6e78, transparent: true, opacity: 0.35, wireframe: true });
  const violet = new THREE.MeshBasicMaterial({ color: 0x5b3fb5, transparent: true, opacity: 0.28, wireframe: true });
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9 + i * 0.42, 0.008, 10, 80), i % 2 ? violet : cyan);
    ring.rotation.x = Math.PI / 2.2;
    rings.add(ring);
  }
  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.45, 0),
    new THREE.MeshBasicMaterial({ color: 0x12151c, wireframe: true, transparent: true, opacity: 0.35 })
  );
  rings.add(core);
  rings.position.set(2.4, 0.6, -1);
  scene.add(rings);

  const count = window.innerWidth < 720 ? 280 : 700;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = Math.random() * 6 - 1;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const dust = new THREE.Points(
    new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(positions, 3)),
    new THREE.PointsMaterial({ color: 0x5b3fb5, size: 0.03, transparent: true, opacity: 0.45, depthWrite: false })
  );
  scene.add(dust);

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
    scroll = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
  }, { passive: true });
  document.addEventListener("visibilitychange", () => { running = document.visibilityState !== "hidden"; });
  window.addEventListener("al2-pulse", () => { pulse = 1; });

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    const t = clock.getElapsedTime();
    pulse *= 0.94;
    rings.rotation.y = t * 0.25 + pointer.x * 0.4;
    rings.rotation.z = pointer.y * 0.15;
    rings.scale.setScalar(1 + pulse * 0.16 + Math.sin(t * 1.6) * 0.02);
    dust.rotation.y = t * 0.02;
    grid.position.z = -scroll * 2;
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.04;
    camera.lookAt(0.4, 0.2, 0);
    renderer.render(scene, camera);
  }
  frame();
}
