/**
 * Teleprompter mentor — painel flutuante (call + roteiro juntos)
 * Conteúdo APENAS de afMentorScripts/{moduleId} via Firestore
 * Sem fallback público de roteiro real
 */
import { isMentorSession } from "./auth.js";
import { MODULES } from "../../data/modules.js";
import { getMentorScript } from "../../firebase/firestore.js";
import { esc } from "./navigation.js";

let tpPlaying = false;
let tpRaf = null;
let tpSpeed = 1;

export function openTeleprompter(moduleId = "module01") {
  if (!isMentorSession()) return;

  const panel = document.getElementById("tpPanel");
  if (!panel) return;

  const sel = document.getElementById("tpModule");
  if (sel && !sel.options.length) {
    sel.innerHTML = MODULES.map((m) => `<option value="${m.id}">${m.num} · ${esc(m.title)}</option>`).join("");
  }
  if (sel && moduleId) sel.value = moduleId;

  panel.classList.add("open");
  document.body.classList.add("tp-open");
  loadTp();
}

export function closeTeleprompter() {
  stopTeleprompter(true);
  document.getElementById("tpPanel")?.classList.remove("open", "min");
  document.body.classList.remove("tp-open");
}

export function stopTeleprompter(resetBtn = false) {
  tpPlaying = false;
  if (tpRaf) {
    cancelAnimationFrame(tpRaf);
    tpRaf = null;
  }
  if (resetBtn) {
    const b = document.getElementById("tpPlay");
    if (b) b.textContent = "Play";
  }
}

export async function loadTp() {
  stopTeleprompter(true);
  const sel = document.getElementById("tpModule");
  const id = sel?.value || "module01";
  const el = document.getElementById("tpScroll");
  const meta = document.getElementById("tpMeta");
  if (!el) return;

  el.innerHTML = `<p class="tp-loading">Carregando roteiro privado…</p>`;
  if (meta) meta.textContent = id;

  try {
    const data = await getMentorScript(id);
    if (!data || (!data.content && !data.text)) {
      el.innerHTML = `<p class="tp-empty">Roteiro não encontrado ou sem permissão.<br><small>Cole o documento em Firestore: afMentorScripts/${esc(id)}</small></p>`;
      return;
    }
    const raw = (data.content || data.text || "").trim();
    const title = data.title ? `<span class="lbl">${esc(data.title)}</span>\n` : "";
    const parts = raw.split(/\n(?=[A-ZÁÉÍÓÚÃÕÇ][A-ZÁÉÍÓÚÃÕÇ \-·]+)/);
    const body = parts
      .map((block) => {
        const lines = block.trim().split("\n");
        if (lines.length === 1) return esc(lines[0]);
        return `<span class="lbl">${esc(lines[0])}</span>${esc(lines.slice(1).join("\n"))}`;
      })
      .join("\n\n");
    el.innerHTML = title + body;
    if (meta) meta.textContent = `${data.title || id}${data.duration ? " · ~" + data.duration + " min" : ""}`;
    tpReset();
  } catch (e) {
    console.error(e);
    const denied = String(e?.code || e?.message || "").includes("permission");
    el.innerHTML = denied
      ? `<p class="tp-empty">Acesso negado ao roteiro (somente mentor).</p>`
      : `<p class="tp-empty">Erro ao carregar roteiro.</p>`;
  }
}

export function toggleTp() {
  tpPlaying = !tpPlaying;
  const b = document.getElementById("tpPlay");
  if (b) b.textContent = tpPlaying ? "Pausa" : "Play";
  if (tpPlaying) tpLoop();
  else if (tpRaf) {
    cancelAnimationFrame(tpRaf);
    tpRaf = null;
  }
}

export function tpReset() {
  const st = document.getElementById("tpStage");
  if (st) st.scrollTop = 0;
}

export function tpNudge(dy) {
  const st = document.getElementById("tpStage");
  if (st) st.scrollTop += dy;
}

export function tpSpeedLbl() {
  const input = document.getElementById("tpSpeed");
  tpSpeed = parseFloat(input?.value) || 1;
  const lbl = document.getElementById("tpSpeedLabel");
  if (lbl) lbl.textContent = tpSpeed.toFixed(1) + "×";
}

function tpLoop() {
  if (!tpPlaying) return;
  const st = document.getElementById("tpStage");
  if (!st) {
    stopTeleprompter(true);
    return;
  }
  st.scrollTop += 0.45 * tpSpeed;
  if (st.scrollTop + st.clientHeight >= st.scrollHeight - 2) {
    stopTeleprompter(true);
    return;
  }
  tpRaf = requestAnimationFrame(tpLoop);
}

export function bindTeleprompterUI() {
  document.getElementById("tpClose")?.addEventListener("click", closeTeleprompter);
  document.getElementById("tpMin")?.addEventListener("click", () => {
    document.getElementById("tpPanel")?.classList.toggle("min");
  });
  document.getElementById("tpModule")?.addEventListener("change", loadTp);
  document.getElementById("tpPlay")?.addEventListener("click", toggleTp);
  document.getElementById("tpResetBtn")?.addEventListener("click", tpReset);
  document.getElementById("tpUp")?.addEventListener("click", () => tpNudge(-48));
  document.getElementById("tpDown")?.addEventListener("click", () => tpNudge(48));
  document.getElementById("tpSpeed")?.addEventListener("input", tpSpeedLbl);
  const panel = document.getElementById("tpPanel");
  const head = panel?.querySelector(".tp-head");
  if (panel && head) {
    let drag = false, ox = 0, oy = 0;
    head.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      if (window.matchMedia("(max-width:820px)").matches) return;
      drag = true;
      ox = e.clientX - panel.getBoundingClientRect().left;
      oy = e.clientY - panel.getBoundingClientRect().top;
      head.setPointerCapture(e.pointerId);
    });
    head.addEventListener("pointermove", (e) => {
      if (!drag) return;
      panel.style.left = Math.max(8, e.clientX - ox) + "px";
      panel.style.top = Math.max(8, e.clientY - oy) + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    });
    head.addEventListener("pointerup", () => { drag = false; });
  }
}
