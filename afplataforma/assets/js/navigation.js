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

function fase3Aberta(view) {
  return view === "af-dashboard" || view === "modules" || view === "tools" || view === "call" || view === "complementar"
    || view === "quitei" || view === "empresas"
    || view.startsWith("module:") || view.startsWith("comp:") || view.startsWith("criancas");
}

export function buildNav() {
  const lang = session.lang || "pt-BR";
  const items = [
    { id: "dashboard", label: "LifeOS", ico: "◇" }
  ];
  if (isMentorSession()) items.push({ id: "mentor", label: t(lang, "mentor"), ico: "★" });
  if (isMentorSession()) items.push({ id: "vendas-curso", label: "Projeto · Curso de Vendas", ico: "↗" });
  items.push(
    { id: "profile", label: t(lang, "profile"), ico: "○" },
    { sep: true, label: "Arquitetura de Legado" },
    { id: "fase1", label: "Fase 1 · Essência", ico: "1" },
    { id: "fase2", label: "Fase 2 · Império", ico: "2" },
    { id: "fase3", label: "Fase 3 · Alinhamento Financeiro", ico: "3" },
    { id: "fase4", label: "Fase 4 · Execução e Expansão", ico: "4" },
    { id: "fase5", label: "Fase 5 · Legado", ico: "5" },
    { id: "arquitetura-legado", label: "Jornada · Arquitetura de Legado", ico: "✦" },
    { id: "mapas-mentais", label: "Mapas mentais", ico: "◎" }
  );

  const nav = document.getElementById("navMain");
  if (!nav) return;
  nav.innerHTML = items
    .map((i) => {
      if (i.sep) {
        return `<div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);padding:14px 12px 8px">${esc(i.label)}</div>`;
      }
      return `<a class="nav-item${isActive(i.id) ? " active" : ""}" href="#" data-view="${i.id}"><span class="ico">${i.ico}</span>${esc(i.label)}</a>`;
    })
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
  if (id === "fase3" && fase3Aberta(currentView)) return true;
  if (currentView.startsWith("module:") && id === "modules") return true;
  if (currentView.startsWith("comp:") && id === "complementar") return true;
  if (currentView.startsWith("criancas") && id === "criancas") return true;
  if (currentView === "empresas" && id === "empresas") return true;
  return false;
}

function setActiveNav(view) {
  document.querySelectorAll(".nav-item").forEach((n) => {
    const id = n.dataset.view;
    n.classList.toggle(
      "active",
      id === view ||
        (id === "fase3" && fase3Aberta(view)) ||
        (view.startsWith("module:") && id === "modules") ||
        (view.startsWith("comp:") && id === "complementar") ||
        (view.startsWith("criancas") && id === "criancas") ||
        (view === "empresas" && id === "empresas")
    );
  });
}

export async function navigate(view) {
  currentView = view;
  closeSide();
  setActiveNav(view);

  const lang = session.lang || "pt-BR";
  const titles = {
    dashboard: "LifeOS · Central de Comando",
    "af-dashboard": "Dashboard AF · Alinhamento Financeiro",
    modules: t(lang, "modules"),
    tools: t(lang, "tools"),
    call: t(lang, "call"),
    profile: t(lang, "profile"),
    mentor: t(lang, "mentor"),
    "vendas-curso": "Projeto · Curso de Vendas",
    ascensao: "Ascensão",
    complementar: "Complementar",
    quitei: "Quitei",
    criancas: "Crianças",
    "criancas-pais": "Orientação dos pais",
    "criancas-sala": "Sala da criança",
    empresas: "Empresas",
    fase1: "Fase 1 · Essência",
    "fase1-jogo": "Mesa da Essência",
    fase2: "Fase 2 · Império",
    fase3: "Fase 3 · Alinhamento Financeiro",
    fase4: "Fase 4 · Processos de Execução e Expansão",
    fase5: "Fase 5 · Comunidade, Movimento, Doutrina",
    "arquitetura-legado": "Arquitetura de Legado · Jornada",
    "mapas-mentais": "Mapas mentais · Akasha",
    "legado-planos": "Planos do Legado",
    "legado-contrato": "Contrato",
    "legado-regras": "Regras",
    "legado-dossie": "Dossiê",
    "legado-oquee": "O que é a mentoria",
    "legado-direcao": "Direcionamento",
    "legado-pitch": "Pitch",
    "legado-tcc": "TCC",
    "legado-slides": "Lâminas",
    "audios-pnl": "Áudios PNL",
    "producao-audios-pnl": "PRODUÇÃO ÁUDIOS PNL",
    "conteudos-al": "Conteúdos AL"
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

  if (typeof html === "string" && fase3Aberta(view)) {
    html = html.replace('<div class="view active">', '<div class="view active"><div class="back-link" data-nav="fase3">← Fase 3</div>');
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
