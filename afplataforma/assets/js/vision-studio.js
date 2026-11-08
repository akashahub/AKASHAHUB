/**
 * VISION STUDIO — fundação modular
 * Projetos e catálogos privados por UID. Não altera os dados da AF.
 */
import { session } from "./auth.js";
import { db } from "../../firebase/firebase-config.js";
import {
  addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { esc } from "./navigation.js";

const MODULES = [
  ["geo", "GEO INTELLIGENCE", "Território, relevo, clima e contexto ambiental.", "map"],
  ["land", "LAND MARKET", "Terrenos, imóveis, documentação e mercado.", "land"],
  ["cost", "COST INTELLIGENCE", "Materiais, mão de obra e estimativas regionais.", "cost"],
  ["plan", "PLAN STUDIO", "Programa de necessidades e plantas 2D.", "plan"],
  ["world", "3D WORLD", "Visualização espacial e experiências 3D.", "3d"],
  ["blueprint", "LIFE BLUEPRINT", "Documento mestre e planejamento integrado.", "blueprint"]
];
const CATALOGS = [
  ["regionalPrices", "Preços regionais"],
  ["landListings", "Terrenos e imóveis"],
  ["materials", "Materiais"],
  ["constructionCosts", "Custos de construção"]
];
let activeProjectId = null;
let busy = false;

const projectCollection = () => collection(db, "visionStudioProjects", session.uid, "projects");
const catalogCollection = () => collection(db, "visionStudioUsers", session.uid, "catalogs");

function status(message, error = false) {
  const el = document.getElementById("vsStatus");
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("is-error", error);
}

function projectCard(p) {
  const place = [p.city, p.state].filter(Boolean).join(" · ") || "Localização em definição";
  return `<article class="vs-project-card">
    <div class="vs-project-top"><span class="vs-eyebrow">${esc(p.kind || "Projeto")}</span><span class="vs-project-state">${esc(p.status || "Em planejamento")}</span></div>
    <h3>${esc(p.name || "Projeto sem título")}</h3>
    <p>${esc(p.objective || "Objetivo ainda não definido.")}</p>
    <div class="vs-project-meta"><span>⌖ ${esc(place)}</span><span>◷ ${esc(p.horizon || "Prazo em definição")}</span></div>
    <div class="vs-project-actions">
      <button class="vs-button vs-button-secondary" type="button" data-vs-edit="${esc(p.id)}">Editar projeto</button>
      <button class="vs-text-button" type="button" data-vs-delete="${esc(p.id)}">Excluir</button>
    </div>
  </article>`;
}

function editorMarkup(p = {}) {
  return `<form id="vsProjectForm" class="vs-editor">
    <div class="vs-editor-heading"><div><span class="vs-eyebrow">CONFIGURAÇÃO DO PROJETO</span><h3>${p.id ? "Editar projeto" : "Novo projeto"}</h3></div><button type="button" class="vs-text-button" id="vsCloseEditor">Fechar</button></div>
    <input type="hidden" name="id" value="${esc(p.id || "")}">
    <div class="vs-form-grid">
      <label class="vs-field vs-span-2">Nome do projeto<input name="name" required maxlength="90" value="${esc(p.name || "")}" placeholder="Ex.: Refúgio 777"></label>
      <label class="vs-field">Tipo de projeto<select name="kind"><option ${p.kind === "Residencial" ? "selected" : ""}>Residencial</option><option ${p.kind === "Rural" ? "selected" : ""}>Rural</option><option ${p.kind === "Comercial" ? "selected" : ""}>Comercial</option><option ${p.kind === "Turístico" ? "selected" : ""}>Turístico</option><option ${p.kind === "Outro" ? "selected" : ""}>Outro</option></select></label>
      <label class="vs-field">Prazo desejado<input name="horizon" value="${esc(p.horizon || "")}" placeholder="Ex.: até 2031"></label>
      <label class="vs-field">País<input name="country" value="${esc(p.country || "Brasil")}" placeholder="País"></label>
      <label class="vs-field">Estado<input name="state" value="${esc(p.state || "")}" placeholder="UF"></label>
      <label class="vs-field">Cidade / região<input name="city" value="${esc(p.city || "")}" placeholder="Cidade, região ou litoral"></label>
      <label class="vs-field">Orçamento estimado (R$)<input name="budget" inputmode="decimal" value="${esc(p.budget || "")}" placeholder="Ainda não definido"></label>
      <label class="vs-field">Área do terreno (m²)<input name="landArea" inputmode="decimal" value="${esc(p.landArea || "")}" placeholder="A definir"></label>
      <label class="vs-field">Dimensões do terreno<input name="dimensions" value="${esc(p.dimensions || "")}" placeholder="Largura × profundidade, se souber"></label>
      <label class="vs-field vs-span-2">Objetivo principal<textarea name="objective" rows="3" maxlength="1200" placeholder="O que deseja construir, desenvolver ou realizar?">${esc(p.objective || "")}</textarea></label>
      <label class="vs-field vs-span-2">Ambientes e estruturas desejadas<textarea name="spaces" rows="3" placeholder="Casa, oficina, horta, pomar, garagem...">${esc(p.spaces || "")}</textarea></label>
      <label class="vs-field vs-span-2">Características e prioridades<textarea name="features" rows="3" placeholder="Natureza, proximidade do mar, autonomia energética, acessibilidade...">${esc(p.features || "")}</textarea></label>
    </div>
    <div class="vs-editor-footer"><span>As informações ficam vinculadas à sua conta.</span><button class="vs-button" type="submit">Salvar projeto</button></div>
  </form>`;
}

export function renderVisionStudio() {
  return `<div class="view active vision-studio-view">
    <section class="vs-hero">
      <div class="vs-hero-copy"><span class="vs-eyebrow">AKASHA HUB · AMBIENTE DE CRIAÇÃO</span><h1>VISION <em>STUDIO</em></h1><p>Transforme uma visão em um projeto estruturado. Reúna território, mercado, custos, arquitetura e planejamento em um só lugar.</p>
      <div class="vs-hero-actions"><button class="vs-button" type="button" id="vsNewProject">＋ Criar projeto</button><span class="vs-private-note">◈ Espaço privado da sua conta</span></div></div>
      <div class="vs-orbit" aria-hidden="true"><div class="vs-orbit-ring"></div><div class="vs-orbit-core">V</div><span>IDEA → PLAN → REALITY</span></div>
    </section>
    <div class="vs-section-head"><div><span class="vs-eyebrow">SEU ESPAÇO DE PROJETOS</span><h2>Projetos</h2></div><span id="vsProjectCount" class="vs-count">Carregando…</span></div>
    <p id="vsStatus" class="vs-status" role="status" aria-live="polite">Carregando seus projetos…</p>
    <div id="vsProjectList" class="vs-project-grid"></div>
    <div id="vsEditorMount"></div>
    <section class="vs-modules-section"><div class="vs-section-head"><div><span class="vs-eyebrow">ECOSSISTEMA MODULAR</span><h2>Seis frentes integradas</h2></div><span class="vs-coming">ESTRUTURA INICIAL</span></div>
      <div class="vs-module-grid">${MODULES.map(([id, name, desc, icon]) => `<article class="vs-module-card"><span class="vs-module-icon" aria-hidden="true">${icon === "map" ? "⌖" : icon === "land" ? "▱" : icon === "cost" ? "◫" : icon === "plan" ? "⌗" : icon === "3d" ? "◇" : "✧"}</span><h3>${name}</h3><p>${desc}</p><span class="vs-module-state">Preparado para expansão</span></article>`).join("")}</div>
    </section>
    <p class="vs-footnote">Dados de mercado e custos ainda não estão conectados a fontes externas. Nenhum preço demonstrativo é apresentado como cotação real.</p>
  </div>`;
}

async function ensureReferenceCatalogs() {
  const existing = await getDocs(catalogCollection());
  const known = new Set(existing.docs.map(d => d.id));
  for (const [id, label] of CATALOGS) {
    if (known.has(id)) continue;
    await addDoc(collection(db, "visionStudioUsers", session.uid, "catalogs"), {
      catalogId: id, label, entries: [], source: null, referenceDate: null,
      reliability: "not_available", createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    }).catch(async () => {
      // IDs determinísticos são gravados pelo caminho abaixo se addDoc não for permitido.
      const { setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await setDoc(doc(db, "visionStudioUsers", session.uid, "catalogs", id), {
        catalogId: id, label, entries: [], source: null, referenceDate: null,
        reliability: "not_available", createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      });
    });
  }
}

async function loadProjects() {
  if (!session.uid) throw new Error("Sua sessão não foi identificada. Entre novamente.");
  await ensureReferenceCatalogs();
  const snap = await getDocs(projectCollection());
  let projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (!projects.some(p => p.slug === "refugio-777")) {
    const demo = await addDoc(projectCollection(), {
      name: "REFÚGIO 777", slug: "refugio-777", kind: "Residencial",
      status: "Projeto de referência", country: "Brasil", state: "", city: "",
      horizon: "Até 5 anos", budget: "", landArea: "", dimensions: "",
      objective: "Desenvolver uma propriedade costeira integrada à natureza, com autonomia e espaços para morar, criar e produzir.",
      spaces: "Casa principal, atelier/oficina, horta, pomar, áreas de cultivo, armazenamento e espaços externos.",
      features: "Proximidade do mar, integração com a natureza, autonomia energética e hídrica, produção de alimentos e planejamento técnico responsável.",
      isReference: true, ownerId: session.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    });
    projects.push({ id: demo.id, name: "REFÚGIO 777", slug: "refugio-777", kind: "Residencial", status: "Projeto de referência", country: "Brasil", horizon: "Até 5 anos", objective: "Desenvolver uma propriedade costeira integrada à natureza, com autonomia e espaços para morar, criar e produzir." });
  }
  projects.sort((a,b) => (a.isReference === b.isReference ? 0 : a.isReference ? -1 : 1));
  const list = document.getElementById("vsProjectList");
  const count = document.getElementById("vsProjectCount");
  if (list) list.innerHTML = projects.map(projectCard).join("") || '<div class="vs-empty">Nenhum projeto cadastrado.</div>';
  if (count) count.textContent = projects.length + (projects.length === 1 ? " projeto" : " projetos");
  status("Projetos sincronizados com sua conta.");
}

function openEditor(project = {}) {
  activeProjectId = project.id || null;
  const mount = document.getElementById("vsEditorMount");
  if (!mount) return;
  mount.innerHTML = editorMarkup(project);
  mount.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("vsCloseEditor")?.addEventListener("click", () => { mount.innerHTML = ""; activeProjectId = null; });
  document.getElementById("vsProjectForm")?.addEventListener("submit", saveProject);
}

async function saveProject(event) {
  event.preventDefault();
  if (busy) return;
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const id = String(data.id || "").trim();
  const payload = {
    name: String(data.name || "").trim(), kind: data.kind, horizon: String(data.horizon || "").trim(),
    country: String(data.country || "").trim(), state: String(data.state || "").trim().toUpperCase(),
    city: String(data.city || "").trim(), budget: String(data.budget || "").trim(),
    landArea: String(data.landArea || "").trim(), dimensions: String(data.dimensions || "").trim(),
    objective: String(data.objective || "").trim(), spaces: String(data.spaces || "").trim(),
    features: String(data.features || "").trim(), ownerId: session.uid, updatedAt: serverTimestamp()
  };
  if (!payload.name) return status("Informe o nome do projeto.", true);
  busy = true;
  try {
    if (id) await updateDoc(doc(db, "visionStudioProjects", session.uid, "projects", id), payload);
    else await addDoc(projectCollection(), { ...payload, status: "Em planejamento", createdAt: serverTimestamp() });
    document.getElementById("vsEditorMount").innerHTML = "";
    await loadProjects();
    status("Projeto salvo com sucesso.");
  } catch (error) {
    console.error("[Vision Studio] save:", error);
    status("Não foi possível salvar. Verifique a conexão e as regras de acesso do Firestore.", true);
  } finally { busy = false; }
}

async function editProject(id) {
  try {
    const snap = await getDocs(projectCollection());
    const item = snap.docs.find(d => d.id === id);
    if (!item) return status("Projeto não encontrado.", true);
    openEditor({ id: item.id, ...item.data() });
  } catch (error) { console.error(error); status("Não foi possível abrir o projeto.", true); }
}

async function removeProject(id) {
  if (!confirm("Excluir este projeto? Esta ação não pode ser desfeita.")) return;
  try {
    const ref = doc(db, "visionStudioProjects", session.uid, "projects", id);
    const snap = await getDocs(projectCollection());
    const item = snap.docs.find(d => d.id === id);
    if (item?.data()?.isReference) return status("O projeto REFÚGIO 777 é a referência inicial e não pode ser excluído.", true);
    await deleteDoc(ref);
    await loadProjects();
    status("Projeto excluído.");
  } catch (error) { console.error(error); status("Não foi possível excluir o projeto.", true); }
}

export function bindVisionStudio() {
  const root = document.getElementById("content");
  if (!root || root.dataset.visionStudioBound === "1") return;
  root.dataset.visionStudioBound = "1";
  root.addEventListener("click", event => {
    const create = event.target.closest("#vsNewProject");
    const edit = event.target.closest("[data-vs-edit]");
    const remove = event.target.closest("[data-vs-delete]");
    if (create) openEditor();
    if (edit) editProject(edit.dataset.vsEdit);
    if (remove) removeProject(remove.dataset.vsDelete);
  });
  loadProjects().catch(error => {
    console.error("[Vision Studio] load:", error);
    status("Não foi possível carregar os projetos. Verifique sua conexão e as regras do Firestore.", true);
  });
}
