// Liga o fundo de pontos do kit. Não reescreve o motor.
import { iniciarParticulas } from "./particulas.js";

const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
const toque = matchMedia("(pointer: coarse)").matches;
const canvas = document.getElementById("akasha-fundo");

if (canvas && !reduzido) {
  const subir = () => iniciarParticulas(canvas, {
    fonte: '"Playfair Display", Georgia, serif',
    cor: [0.93, 0.9, 0.82],
    destaque: [0.83, 0.69, 0.22],
    alfa: 0.7,
    tamanho: 2.6
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(subir);
  else subir();
} else if (canvas) {
  canvas.remove();
}

const cursor = document.querySelector(".akasha-cursor");
if (cursor && !toque && !reduzido) {
  let x = 0, y = 0, ax = 0, ay = 0;
  addEventListener("pointermove", (e) => { ax = e.clientX; ay = e.clientY; }, { passive: true });
  document.addEventListener("pointerover", (e) => {
    cursor.classList.toggle("grande", !!e.target.closest("a, button"));
  });
  const andar = () => {
    x += (ax - x) * 0.22;
    y += (ay - y) * 0.22;
    cursor.style.transform = "translate3d(" + x + "px," + y + "px,0)";
    requestAnimationFrame(andar);
  };
  andar();
  for (const el of document.querySelectorAll(".btn, .btn-gold, .btn-ghost, .tool-btn")) {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.22;
      const dy = (e.clientY - r.top - r.height / 2) * 0.28;
      el.style.transform = "translate3d(" + dx + "px," + dy + "px,0)";
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  }
}
