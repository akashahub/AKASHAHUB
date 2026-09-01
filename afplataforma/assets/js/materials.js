/**
 * Visualizador de material do mentorando (PDF / iframe).
 * Roteiros de mentor NÃO passam por aqui.
 */
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function materialButton(title, src, extraClass = "") {
  if (!src) return "";
  return `<button class="tool-btn mat-open-btn ${extraClass}" type="button" data-open-pdf="${esc(src)}" data-pdf-title="${esc(title)}">Abrir material</button>`;
}

export function bindMaterialViewer() {
  const viewer = document.getElementById("matViewer");
  if (!viewer || viewer.dataset.bound) return;
  viewer.dataset.bound = "1";

  document.getElementById("matViewerClose")?.addEventListener("click", closeMaterialViewer);
  document.getElementById("matViewerNewTab")?.addEventListener("click", () => {
    const src = viewer.dataset.src;
    if (src) window.open(src, "_blank", "noopener");
  });
  document.getElementById("matViewerFs")?.addEventListener("click", toggleMaterialFullscreen);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && viewer.classList.contains("open")) closeMaterialViewer();
  });
}

export function openMaterialViewer(src, title) {
  const viewer = document.getElementById("matViewer");
  const frame = document.getElementById("matViewerFrame");
  const heading = document.getElementById("matViewerTitle");
  if (!viewer || !frame) return;
  viewer.dataset.src = src;
  if (heading) heading.textContent = title || "Material";
  try {
    frame.src = new URL(src, location.href).href;
  } catch {
    frame.src = src;
  }
  viewer.classList.add("open");
  viewer.removeAttribute("hidden");
  document.body.classList.add("mat-open");
}

export function closeMaterialViewer() {
  const viewer = document.getElementById("matViewer");
  const frame = document.getElementById("matViewerFrame");
  if (!viewer) return;
  if (document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {});
  }
  viewer.classList.remove("open");
  viewer.setAttribute("hidden", "");
  document.body.classList.remove("mat-open");
  if (frame) frame.src = "about:blank";
}

async function toggleMaterialFullscreen() {
  const stage = document.getElementById("matViewerStage") || document.getElementById("matViewer");
  if (!stage) return;
  try {
    if (!document.fullscreenElement) await stage.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    const src = document.getElementById("matViewer")?.dataset.src;
    if (src) window.open(src, "_blank", "noopener");
  }
}

export function handleMaterialClick(e) {
  const btn = e.target.closest("[data-open-pdf]");
  if (!btn) return false;
  e.preventDefault();
  e.stopPropagation();
  openMaterialViewer(btn.dataset.openPdf, btn.dataset.pdfTitle || "Material");
  return true;
}
