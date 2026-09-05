/**
 * Navegação e shell UI
 * Sem import de call.js / teleprompter.js (isso quebrava o login).
 */
import { session, isMentorSession } from "./auth.js";
import { MODULES } from "../../data/modules.js";
import { t } from "../../data/translations.js";
import { Store } from "./storage.js";
import { handleCoverClick } from "./covers.js";
import { handleMaterialClick } from "./materials.js";

let currentView = "dashboard";
let renderers = {};
let afterNavigateHook = null;

export function registerRenderers(map) {
  renderers = map;
}

export function onAfterNavigate(fn) {
  afterNavigateHook = fn;
}

export function getCurrentView() {
  return currentView;
}

export function buildNav() {
  const lang = session.lang || "pt-BR";
  const items = [
    { id: "dashboard", label: t(lang, "dash"), ico: "◇" },
    { id: "modules", label: t(lang, "modules"), ico: "▣" },
    { id: "tools", label: t(lang, "tools"), ico: "⚙" },
    { id: "call", label: t(lang, "call"), ico: "◎" },
    { id: "complementar", label: "Complementar", ico: "✦" },
    { id: "quitei", label: "Quitei", ico: "⬡" },
    { id: "profile", label: t(lang, "profile"), ico: "○" }
  ];
  if (isMentorSession()) {
    items.splice(1, 0, { id: "mentor", label: t(lang, "mentor"), ico: "★" });
  }

  const nav = document.getElementById("navMain");
  if (!nav) return;
  nav.innerHTML = items
    .map(
      (i) =>
        `<a class="nav-item${isActive(i.id) ? " active" : ""}" href="#" data-view="${i.id}"><span class="ico">${i.ico}</span>${esc(i.label)}</a>`
    )
    .join("");

  nav.querySelectorAll(".nav-item").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(el.dataset.view);
    });
  });
}

function isActive(id) {
  if (currentView === id) return true;
  if (currentView.startsWith("module:") && id === "modules") return true;
  if (currentView.startsWith("comp:") && id === "complementar") return true;
  return false;
}

function setActiveNav(view) {
  document.querySelectorAll(".nav-item").forEach((n) => {
    const id = n.dataset.view;
    n.classList.toggle(
      "active",
      id === view ||
        (view.startsWith("module:") && id === "modules") ||
        (view.startsWith("comp:") && id === "complementar")
    );
  });
}

export async function navigate(view) {
  currentView = view;
  try { sessionStorage.setItem("af_last_view", view); } catch (_) {}
  closeSide();
  setActiveNav(view);

  const lang = session.lang || "pt-BR";
  const titles = {
    dashboard: t(lang, "dash"),
    modules: t(lang, "modules"),
    tools: t(lang, "tools"),
    call: t(lang, "call"),
    profile: t(lang, "profile"),
    mentor: t(lang, "mentor"),
    complementar: "Complementar",
    quitei: "Quitei"
  };
  const top = document.getElementById("topTitle");
  if (top) {
    top.textContent =
      titles[view] ||
      (view.startsWith("module:") ? "Módulo" : view.startsWith("comp:") ? "Complementar" : "AF");
  }

  const root = document.getElementById("content");
  if (!root) return;

  const dock = document.getElementById("callDock");
  if (dock && dock.parentElement !== document.body) document.body.appendChild(dock);

  let html = "";
  if (view.startsWith("module:")) {
    const id = view.split(":")[1];
    html = renderers.moduleDetail ? renderers.moduleDetail(id) : "";
  } else if (view.startsWith("comp:")) {
    const id = view.split(":")[1];
    html = renderers.compApp ? renderers.compApp(id) : "";
  } else if (renderers[view]) {
    html = renderers[view]();
  } else {
    html = `<div class="view active"><p class="empty">View não encontrada</p></div>`;
  }

  if (html && typeof html.then === "function") {
    root.innerHTML = `<div class="view active"><p class="empty">Carregando…</p></div>`;
    html = await html;
    if (currentView !== view) return;
  }

  root.innerHTML = html;

  root.onclick = (e) => {
    if (handleCoverClick(e)) return;
    if (handleMaterialClick(e)) return;
    const addp = e.target.closest("#btnAddProd");
    if (addp && renderers.pickProduct) {
      e.preventDefault();
      renderers.pickProduct();
      return;
    }
    const row = e.target.closest("[data-nav]");
    if (row && row.dataset.nav) {
      e.preventDefault();
      navigate(row.dataset.nav);
      return;
    }
    const locked = e.target.closest("[data-locked]");
    if (locked && renderers.showLocked) {
      renderers.showLocked();
      return;
    }
    const tool = e.target.closest("[data-tool]");
    if (tool && renderers.openTool) renderers.openTool(tool.dataset.tool);
  };

  setActiveNav(view);
  if (afterNavigateHook) afterNavigateHook(view);
}

export function openSide() {
  document.getElementById("sidebar")?.classList.add("open");
  document.getElementById("sideBackdrop")?.classList.add("open");
}

export function closeSide() {
  document.getElementById("sidebar")?.classList.remove("open");
  document.getElementById("sideBackdrop")?.classList.remove("open");
}

export function setLang(lang) {
  session.lang = lang;
  Store.setLang(lang);
  buildNav();
  navigate(currentView);
}

export function unlockedCount() {
  return MODULES.filter((m) => session.modules[m.id]).length;
}

export function nextModule() {
  return MODULES.find((m) => !session.modules[m.id]) || null;
}

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
