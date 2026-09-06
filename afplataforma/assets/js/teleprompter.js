/**
 * Teleprompter mentor — painel flutuante (call + roteiro juntos)
 * Fonte oficial: data/mentor-scripts.js (série Julho 2026).
 * Firestore afMentorScripts só entra se o pacote local não tiver o módulo.
 */
import { isMentorSession } from "./auth.js";
import { MODULES } from "../../data/modules.js";
import { MENTOR_SCRIPTS } from "../../data/mentor-scripts.js";
import { MENTOR_SCRIPTS_I18N } from "../../data/mentor-scripts-i18n.js";
import { getMentorScript } from "../../firebase/firestore.js";
import { esc } from "./navigation.js";

let tpPlaying = false;
let tpRaf = null;
let tpSpeed = 1;
let tpLang = "pt";
const TP_CUSTOM = "af_tp_custom_v1";

function customMap() {
  try { return JSON.parse(localStorage.getItem(TP_CUSTOM) || "{}"); } catch { return {}; }
}
function saveCustom(id, text) {
  const m = customMap();
  m[id] = text;
  localStorage.setItem(TP_CUSTOM, JSON.stringify(m));
}

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
  const edit = document.getElementById("tpEdit");
  const panel = document.getElementById("tpPanel");
  if (!el) return;

  const editing = tpLang === "edit";
  panel?.classList.toggle("editing", editing);
  if (edit) {
    edit.classList.toggle("show", editing);
    edit.hidden = !editing;
  }

  if (editing) {
    const base = resolveScript(id, "pt");
    const custom = customMap()[id];
    edit.value = custom || base.content || "";
    if (meta) meta.textContent = `${base.title || id} · editar`;
    el.innerHTML = "";
    return;
  }

  el.innerHTML = `<p class="tp-loading">Carregando roteiro privado…</p>`;
  if (meta) meta.textContent = id;

  try {
    const data = resolveScript(id, tpLang);
    if (!data || !data.content) {
      el.innerHTML = `<p class="tp-empty">Roteiro não encontrado neste idioma.</p>`;
      return;
    }
    paintScript(el, data);
    if (meta) meta.textContent = `${data.title || id}${data.duration ? " · ~" + data.duration + " min" : ""} · ${tpLang.toUpperCase()}`;
    tpReset();
  } catch (e) {
    console.error(e);
    el.innerHTML = `<p class="tp-empty">Erro ao carregar roteiro.</p>`;
  }
}

function resolveScript(id, lang) {
  const bundled = MENTOR_SCRIPTS[id];
  if (lang === "pt") {
    return bundled ? { title: bundled.title, duration: bundled.duration, content: bundled.content } : null;
  }
  const pack = MENTOR_SCRIPTS_I18N[lang]?.[id];
  if (pack) return { title: pack.title || bundled?.title, duration: bundled?.duration || 90, content: pack.content };
  return bundled ? { title: bundled.title, duration: bundled.duration, content: bundled.content } : null;
}

function paintScript(el, data) {
  const raw = (data.content || "").trim();
  const title = data.title ? `<span class="lbl">${esc(data.title)}</span>\n` : "";
  const parts = raw.split(/\n(?=[A-ZÁÉÍÓÚÃÕÇÀÈÌÒÙÂÊÎÔÛÄËÏÖÜ][A-ZÁÉÍÓÚÃÕÇÀÈÌÒÙÂÊÎÔÛÄËÏÖÜ \-·’']+)/);
  const body = parts
    .map((block) => {
      const lines = block.trim().split("\n");
      if (lines.length === 1) return esc(lines[0]);
      return `<span class="lbl">${esc(lines[0])}</span>${esc(lines.slice(1).join("\n"))}`;
    })
    .join("\n\n");
  el.innerHTML = title + body;
}

export function toggleTp() {
  if (tpLang === "edit") {
    const id = document.getElementById("tpModule")?.value || "module01";
    const val = document.getElementById("tpEdit")?.value || "";
    saveCustom(id, val);
    const el = document.getElementById("tpScroll");
    const panel = document.getElementById("tpPanel");
    const edit = document.getElementById("tpEdit");
    if (el && val.trim()) {
      panel?.classList.remove("editing");
      if (edit) { edit.classList.remove("show"); edit.hidden = true; }
      paintScript(el, { title: "Roteiro editado", content: val });
    }
  }
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
  document.getElementById("tpLangs")?.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lang]");
    if (!b) return;
    if (tpLang === "edit") {
      const id = document.getElementById("tpModule")?.value || "module01";
      const val = document.getElementById("tpEdit")?.value || "";
      saveCustom(id, val);
    }
    tpLang = b.dataset.lang;
    document.querySelectorAll("#tpLangs [data-lang]").forEach((x) => x.classList.toggle("on", x === b));
    loadTp();
  });
  document.getElementById("tpEdit")?.addEventListener("input", () => {
    const id = document.getElementById("tpModule")?.value || "module01";
    saveCustom(id, document.getElementById("tpEdit").value);
  });
  document.getElementById("tpPlay")?.addEventListener("click", toggleTp);
  document.getElementById("tpResetBtn")?.addEventListener("click", tpReset);
  document.getElementById("tpUp")?.addEventListener("click", () => tpNudge(-48));
  document.getElementById("tpDown")?.addEventListener("click", () => tpNudge(48));
  document.getElementById("tpSpeed")?.addEventListener("input", tpSpeedLbl);
  bindTpDrag();
}

function bindTpDrag() {
  const panel = document.getElementById("tpPanel");
  const head = document.getElementById("tpHead") || panel?.querySelector(".tp-head");
  if (!panel || !head || head.dataset.dragBound) return;
  head.dataset.dragBound = "1";
  let dragging = false;
  let ox = 0;
  let oy = 0;

  function pinFromRect() {
    const r = panel.getBoundingClientRect();
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    panel.style.left = r.left + "px";
    panel.style.top = r.top + "px";
    panel.style.width = r.width + "px";
    if (!panel.classList.contains("min")) panel.style.height = r.height + "px";
  }

  head.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, select, input, a")) return;
    pinFromRect();
    dragging = true;
    const r = panel.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    panel.classList.add("dragging");
    try { head.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  });

  head.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const maxX = Math.max(8, window.innerWidth - panel.offsetWidth - 8);
    const maxY = Math.max(8, window.innerHeight - 56);
    const x = Math.min(maxX, Math.max(8, e.clientX - ox));
    const y = Math.min(maxY, Math.max(8, e.clientY - oy));
    panel.style.left = x + "px";
    panel.style.top = y + "px";
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    panel.classList.remove("dragging");
    try { head.releasePointerCapture(e.pointerId); } catch (err) {}
  }
  head.addEventListener("pointerup", endDrag);
  head.addEventListener("pointercancel", endDrag);
}
