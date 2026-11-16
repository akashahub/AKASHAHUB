import { auth, db } from "../afplataforma/firebase/firebase-config.js";
import {
  GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, doc, getDoc, getDocs, setDoc, deleteDoc, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const root = document.getElementById("visionApp");
const MODULES = [
  ["geo", "GEO INTELLIGENCE", "Território, relevo, clima, água e condicionantes ambientais.", "map"],
  ["land", "LAND MARKET", "Terrenos, imóveis, comparativos e documentação.", "land"],
  ["cost", "COST INTELLIGENCE", "Materiais, mão de obra, índices e estimativas regionais.", "cost"],
  ["plan", "PLAN STUDIO", "Programa de necessidades e plantas 2D dimensionadas.", "plan"],
  ["world", "3D WORLD", "Visualização espacial e exploração tridimensional.", "world"],
  ["blueprint", "LIFE BLUEPRINT", "Documento mestre, cronograma, orçamento e visão integrada.", "blueprint"]
];
let currentUser = null;
let projects = [];
let activeView = "dashboard";
let editingProject = null;
let activeProject = null;
let references = [];

const esc = (value = "") => String(value).replace(/[&<>"']/g, ch => ({
  "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
}[ch]));
const val = (id) => document.getElementById(id)?.value?.trim() || "";
const fmtDate = (value) => {
  if (!value) return "Sem data";
  const date = value?.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? "Sem data" : date.toLocaleDateString("pt-BR");
};
const projectCollection = () => collection(db, "visionStudioProjects", currentUser.uid, "projects");
const projectRef = (id) => doc(db, "visionStudioProjects", currentUser.uid, "projects", id);
const referenceCollection = (id) => collection(db, "visionStudioProjects", currentUser.uid, "projects", id, "references");

function shell(content) {
  root.innerHTML = `
    <div class="studio-shell">
      <aside class="sidebar">
        <a class="brand" href="#" data-view="dashboard"><span class="brand-mark">V</span><span><b>VISION</b><small>STUDIO · AKASHA HUB</small></span></a>
        <div class="side-label">ESPAÇO DE TRABALHO</div>
        <button class="nav-link ${activeView === "dashboard" ? "active" : ""}" data-view="dashboard"><span>⌂</span> Visão geral</button>
        <div class="side-label">MÓDULOS</div>
        ${MODULES.map(m => `<button class="nav-link ${activeView === m[0] ? "active" : ""}" data-view="${m[0]}"><span>◇</span> ${m[1]}</button>`).join("")}
        <div class="side-bottom">
          <div class="user-chip"><span class="avatar">${esc((currentUser.displayName || currentUser.email || "A").slice(0,1).toUpperCase())}</span><span><b>${esc(currentUser.displayName || "Meu espaço")}</b><small>${esc(currentUser.email || "")}</small></span></div>
          <button class="logout" id="logoutBtn">Sair da conta ↗</button>
        </div>
      </aside>
      <main class="main-area">
        <header class="topbar"><div><span class="eyebrow">AKASHA HUB / VISION STUDIO</span><span class="top-context">Seu espaço de criação</span></div><span class="secure"><i></i> Dados privados</span></header>
        <section class="workspace">${content}</section>
      </main>
    </div>`;
  root.querySelectorAll("[data-view]").forEach(el => el.addEventListener("click", () => {
    activeView = el.dataset.view;
    editingProject = null;
    activeProject = null;
    render();
  }));
  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    await signOut(auth);
  });
}

function renderDashboard() {
  const total = projects.length;
  return `
    <div class="hero">
      <div class="hero-copy"><span class="eyebrow gold">TRANSFORME VISÃO EM REALIDADE</span><h1>O futuro começa<br><em>com um projeto.</em></h1><p>Um ambiente para organizar ideias, investigar possibilidades e construir decisões com clareza, dados e planejamento.</p><button class="primary-btn" id="newProjectBtn">＋ Criar novo projeto</button></div>
      <div class="hero-art"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="core"><span>V</span></div><div class="art-caption">IMAGINE · ESTRUTURE · CONSTRUA</div></div>
    </div>
    <div class="section-head"><div><span class="eyebrow">SEU PORTFÓLIO</span><h2>Projetos</h2><p>Seus projetos ficam privados e vinculados à sua conta.</p></div><span class="count-pill">${total} ${total === 1 ? "projeto" : "projetos"}</span></div>
    ${projects.length ? `<div class="project-grid">${projects.map(projectCard).join("")}</div>` : `<div class="empty-state"><div class="empty-symbol">◇</div><h3>Seu espaço está pronto.</h3><p>Crie um projeto ou comece pelo REFÚGIO 777, que serve como referência de estrutura.</p><button class="primary-btn" id="newProjectEmpty">Criar projeto</button></div>`}
    <div class="section-head modules-head"><div><span class="eyebrow">ECOSSISTEMA</span><h2>Seis dimensões do Vision Studio</h2><p>Os módulos serão desenvolvidos em etapas e compartilharão os dados do mesmo projeto.</p></div></div>
    <div class="module-grid">${MODULES.map(m => `<button class="module-card" data-view="${m[0]}"><span class="module-icon">${moduleSymbol(m[0])}</span><b>${m[1]}</b><p>${m[2]}</p><small>FUNDAÇÃO PREPARADA <span>↗</span></small></button>`).join("")}</div>
    <p class="privacy-note">Seus registros de localização, orçamento e planejamento são privados. Não compartilhamos seus projetos com outros usuários.</p>`;
}

function moduleSymbol(id) {
  return ({geo:"⌖",land:"▱",cost:"＄",plan:"⌘",world:"◈",blueprint:"▤"})[id] || "◇";
}
function projectCard(p) {
  const isDemo = p.isDemo === true;
  return `<article class="project-card">
    <div class="project-cover ${isDemo ? "refuge-cover" : ""}"><span class="project-type">${esc(p.category || "PROJETO")}</span><span class="cover-symbol">${isDemo ? "777" : "◇"}</span></div>
    <div class="project-body"><div class="project-title-row"><h3>${esc(p.name || "Projeto sem título")}</h3>${isDemo ? '<span class="demo-tag">REFERÊNCIA</span>' : ""}</div><p>${esc(p.description || "Projeto em desenvolvimento.")}</p>
      <div class="project-meta"><span>⌖ ${esc(p.location || "Localização a definir")}</span><span>↻ ${fmtDate(p.updatedAt)}</span></div>
      <div class="project-actions"><button class="primary-btn small" data-open-project="${p.id}">Abrir projeto</button><button class="icon-btn" title="Editar" data-edit-project="${p.id}">✎</button></div>
    </div></article>`;
}

function renderEditor(project = null) {
  const p = project || {};
  const isNew = !project;
  return `
    <div class="page-heading"><button class="back-btn" data-view="dashboard">← Projetos</button><span class="eyebrow gold">${isNew ? "NOVO PROJETO" : "CONFIGURAÇÃO DO PROJETO"}</span><h1>${isNew ? "Dê forma à sua visão." : esc(p.name)}</h1><p>Registre as definições iniciais. Você poderá complementar e revisar tudo depois.</p></div>
    <form id="projectForm" class="editor-layout">
      <div class="form-panel">
        <div class="form-section"><span class="eyebrow">01 / IDENTIDADE</span><h2>Sobre o projeto</h2>
          <label>Nome do projeto<input name="name" id="pName" maxlength="90" required value="${esc(p.name || "")}" placeholder="Ex.: Refúgio 777"></label>
          <label>Tipo de projeto<select name="category" id="pCategory"><option value="Residencial" ${p.category==="Residencial"?"selected":""}>Residencial</option><option value="Sítio / Fazenda" ${p.category==="Sítio / Fazenda"?"selected":""}>Sítio / Fazenda</option><option value="Turismo / Hospitalidade" ${p.category==="Turismo / Hospitalidade"?"selected":""}>Turismo / Hospitalidade</option><option value="Comercial" ${p.category==="Comercial"?"selected":""}>Comercial</option><option value="Outro" ${p.category==="Outro"?"selected":""}>Outro</option></select></label>
          <label>Descrição<textarea id="pDescription" rows="3" maxlength="700" placeholder="Qual é a ideia central deste projeto?">${esc(p.description || "")}</textarea></label>
        </div>
        <div class="form-section"><span class="eyebrow">02 / GEOGRAFIA E TERRENO</span><h2>Onde isso pode existir?</h2>
          <div class="field-grid"><label>País<input id="pCountry" value="${esc(p.country || "Brasil")}" placeholder="Brasil"></label><label>Estado / região<input id="pRegion" value="${esc(p.region || "")}" placeholder="Ex.: Bahia"></label></div>
          <label>Localização desejada<input id="pLocation" value="${esc(p.location || "")}" placeholder="Cidade, região, bairro ou coordenadas"></label>
          <div class="field-grid"><label>Área do terreno (m²)<input id="pLandArea" type="number" min="0" step="0.01" value="${esc(p.landArea || "")}" placeholder="A definir"></label><label>Dimensões aproximadas<input id="pDimensions" value="${esc(p.dimensions || "")}" placeholder="Ex.: frente × profundidade"></label></div>
          <label>Características do terreno<textarea id="pTerrain" rows="3" placeholder="Relevo, proximidade da água, vegetação, acesso...">${esc(p.terrain || "")}</textarea></label>
        </div>
        <div class="form-section"><span class="eyebrow">03 / PROGRAMA E OBJETIVOS</span><h2>O que precisa existir?</h2>
          <label>Ambientes e estruturas desejadas<textarea id="pEnvironments" rows="4" placeholder="Casa principal, atelier, horta, pomar, oficina...">${esc(p.environments || "")}</textarea></label>
          <label>Objetivos do projeto<textarea id="pGoals" rows="4" placeholder="Descreva o estilo de vida, uso e resultado esperado...">${esc(p.goals || "")}</textarea></label>
          <label>Características e prioridades<textarea id="pFeatures" rows="3" placeholder="Autonomia, sustentabilidade, acessibilidade, privacidade...">${esc(p.features || "")}</textarea></label>
        </div>
        <div class="form-section"><span class="eyebrow">04 / VIABILIDADE</span><h2>Prazo e orçamento</h2>
          <div class="field-grid"><label>Orçamento estimado (R$)<input id="pBudget" type="number" min="0" step="0.01" value="${esc(p.budget || "")}" placeholder="Ainda não definido"></label><label>Horizonte desejado<input id="pDeadline" value="${esc(p.deadline || "")}" placeholder="Ex.: até 2031"></label></div>
        </div>
        <div class="form-actions"><button type="button" class="secondary-btn" data-view="dashboard">Cancelar</button><button type="submit" class="primary-btn">Salvar projeto ↗</button></div>
      </div>
      <aside class="editor-aside"><div class="aside-card"><span class="eyebrow gold">DIRETRIZ</span><h3>Primeiro a realidade. Depois a forma.</h3><p>Começamos por requisitos, geografia e viabilidade. Plantas, engenharia e imagens vêm depois, com dados verificáveis.</p><div class="aside-rule"></div><small>Preços e informações de mercado só serão tratados como dados quando houver fonte, data e referência registradas.</small></div>
      ${!isNew ? `<div class="aside-card danger-card"><h3>Zona de risco</h3><p>Excluir um projeto remove seus registros vinculados.</p><button type="button" class="danger-btn" id="deleteProjectBtn">Excluir projeto</button></div>` : ""}</aside>
    </form>`;
}

function renderProjectDetail(project) {
  return `
    <div class="page-heading"><button class="back-btn" data-view="dashboard">← Projetos</button><span class="eyebrow gold">PROJETO / ${esc(project.category || "GERAL")}</span><h1>${esc(project.name)}</h1><p>${esc(project.description || "Organize os dados e avance por etapas.")}</p><div class="detail-actions"><button class="primary-btn small" id="editActiveProject">Editar definições</button><button class="secondary-btn small" id="deleteActiveProject">Excluir</button></div></div>
    <div class="detail-grid">
      <section class="detail-panel"><span class="eyebrow">DADOS PRINCIPAIS</span><h2>Definições registradas</h2>
        ${detailRow("Localização", project.location || "A definir")}${detailRow("País / região", [project.country,project.region].filter(Boolean).join(" · ") || "A definir")}${detailRow("Área do terreno", project.landArea ? Number(project.landArea).toLocaleString("pt-BR")+" m²" : "A definir")}${detailRow("Dimensões", project.dimensions || "A definir")}${detailRow("Orçamento", project.budget ? Number(project.budget).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "A definir")}${detailRow("Prazo", project.deadline || "A definir")}
      </section>
      <section class="detail-panel"><span class="eyebrow">PROGRAMA</span><h2>Ambientes e objetivos</h2>${detailRow("Terreno",project.terrain || "Ainda não registrado")}${detailRow("Ambientes",project.environments || "Ainda não registrados")}${detailRow("Objetivos",project.goals || "Ainda não registrados")}${detailRow("Prioridades",project.features || "Ainda não registradas")}</section>
    </div>
    <section class="detail-panel references-panel"><div class="section-head compact"><div><span class="eyebrow">BASE DE DADOS DO PROJETO</span><h2>Referências e custos</h2><p>Registre preços e referências com origem e data. Nenhum valor é preenchido como cotação automática.</p></div></div>
      <form id="referenceForm" class="reference-form">
        <label>Tipo<select id="rType"><option value="Terreno">Terreno / imóvel</option><option value="Material">Material</option><option value="Mão de obra">Mão de obra</option><option value="Serviço">Serviço / custo</option><option value="Equipamento">Equipamento</option></select></label>
        <label>Item<input id="rItem" required placeholder="Ex.: lote, cimento, diária..."></label>
        <label>Valor (R$)<input id="rValue" type="number" min="0" step="0.01" placeholder="Opcional"></label>
        <label>Unidade<input id="rUnit" placeholder="m², m³, unidade..."></label>
        <label>Região<input id="rRegion" placeholder="Cidade / estado"></label>
        <label>Fonte<input id="rSource" placeholder="URL, fornecedor, documento"></label>
        <label>Data de referência<input id="rDate" type="date"></label>
        <label>Confiabilidade<select id="rConfidence"><option value="Não verificada">Não verificada</option><option value="Baixa">Baixa</option><option value="Média">Média</option><option value="Alta">Alta</option></select></label>
        <button type="submit" class="primary-btn small">＋ Registrar referência</button>
      </form>
      <div id="referencesList" class="references-list"><p class="muted">Carregando referências...</p></div>
    </section>
    <p class="privacy-note">Projeto privado · Última atualização: ${fmtDate(project.updatedAt)}. Estudos automatizados futuros não substituem laudos técnicos ou avaliação profissional.</p>`;
}
function detailRow(label,value){return `<div class="detail-row"><small>${esc(label)}</small><p>${esc(value)}</p></div>`;}

function renderModule(id) {
  const m = MODULES.find(x => x[0] === id);
  if (!m) return renderDashboard();
  const descriptions = {
    geo:["Análise territorial","Mapas, relevo, altitude, declividade, clima, água, vegetação, riscos e condicionantes ambientais."],
    land:["Inteligência imobiliária","Comparação de terrenos e imóveis, preço anunciado, documentação, infraestrutura e histórico de mercado."],
    cost:["Composição de custos","Materiais, mão de obra, índices de construção, logística e estimativas com fonte e data."],
    plan:["Programa arquitetônico","Organização dos ambientes, necessidades, dimensões e etapas para futura planta 2D."],
    world:["Espaço tridimensional","Preparação para visualização 3D conectada à geometria e às definições do projeto."],
    blueprint:["Documento mestre","Consolidação das decisões, referências, cronograma, orçamento e visão completa do projeto."]
  };
  return `<div class="page-heading"><button class="back-btn" data-view="dashboard">← Visão geral</button><span class="eyebrow gold">VISION STUDIO / MÓDULO</span><h1>${m[1]}</h1><p>${descriptions[id][0]}: ${descriptions[id][1]}</p></div><div class="module-placeholder"><span class="module-icon large">${moduleSymbol(id)}</span><span class="eyebrow">FUNDAÇÃO PREPARADA</span><h2>Esta dimensão será construída por etapas.</h2><p>O módulo já está previsto na navegação e compartilhará os dados do projeto. A implementação funcional será feita em uma etapa própria, sem duplicar informações.</p><button class="secondary-btn" data-view="dashboard">Voltar aos projetos</button></div>`;
}

function renderAuth() {
  root.innerHTML = `
    <main class="auth-screen"><div class="auth-art"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="core"><span>V</span></div><p>IMAGINE · ESTRUTURE · CONSTRUA</p></div>
      <section class="auth-card"><a class="brand auth-brand" href="/"><span class="brand-mark">V</span><span><b>VISION</b><small>STUDIO · AKASHA HUB</small></span></a><span class="eyebrow gold">SEU PRÓXIMO CAPÍTULO</span><h1>Entre no seu<br><em>espaço de criação.</em></h1><p>Use a mesma conta do Akasha Hub. Seus projetos ficam vinculados ao seu usuário.</p>
      <form id="loginForm"><label>E-mail<input id="loginEmail" type="email" autocomplete="username" required placeholder="seu@email.com"></label><label>Senha<input id="loginPassword" type="password" autocomplete="current-password" required placeholder="Sua senha"></label><button class="primary-btn full" type="submit">Entrar com e-mail</button></form>
      <div class="auth-divider"><span>ou</span></div><button id="googleLogin" class="secondary-btn full">Continuar com Google</button><p id="authMessage" class="auth-message" role="status"></p><a class="back-home" href="/afplataforma/">Abrir AF Plataforma</a></section>
    </main>`;
  document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const msg = document.getElementById("authMessage");
    msg.textContent = "Validando acesso...";
    try { await signInWithEmailAndPassword(auth, val("loginEmail"), val("loginPassword")); }
    catch(err) { msg.textContent = authError(err); }
  });
  document.getElementById("googleLogin").addEventListener("click", async () => {
    const msg = document.getElementById("authMessage");
    msg.textContent = "Abrindo Google...";
    try { await signInWithPopup(auth, new GoogleAuthProvider()); }
    catch(err) { msg.textContent = authError(err); }
  });
}
function authError(error) {
  if (error?.code === "auth/invalid-credential") return "E-mail ou senha não conferem.";
  if (error?.code === "auth/popup-blocked") return "O navegador bloqueou a janela do Google. Tente novamente ou entre com e-mail.";
  if (error?.code === "auth/unauthorized-domain") return "Este domínio ainda não está autorizado no Firebase Authentication.";
  if (error?.code === "auth/network-request-failed") return "Sem conexão. Verifique sua internet.";
  return "Não foi possível entrar. Confira os dados e tente novamente.";
}

async function loadProjects() {
  const snap = await getDocs(projectCollection());
  projects = snap.docs.map(d => ({id:d.id,...d.data()})).sort((a,b) => {
    const ta = a.updatedAt?.toMillis?.() || 0, tb = b.updatedAt?.toMillis?.() || 0;
    return tb - ta;
  });
  if (!projects.length) {
    const markerRef = doc(db, "visionStudioProjects", currentUser.uid, "settings", "profile");
    const markerSnap = await getDoc(markerRef);
    if (markerSnap.exists() && markerSnap.data()?.initialized === true) return;
    const demo = {
      ownerUid: currentUser.uid, name:"REFÚGIO 777", category:"Residencial",
      description:"Projeto demonstrativo para transformar uma visão de vida integrada à natureza em um plano concreto. Os campos técnicos e financeiros permanecem em aberto até serem definidos e verificados.",
      country:"Brasil", region:"", location:"", landArea:"", dimensions:"", terrain:"",
      environments:"Casa principal; atelier e oficina; horta e pomar; áreas de produção e apoio; espaços de autonomia e armazenamento.",
      goals:"Criar um refúgio costeiro integrado à natureza, com planejamento responsável, autonomia progressiva e espaço para viver, criar e produzir.",
      features:"Integração com a natureza; autonomia energética e hídrica; produção de alimentos; privacidade; planejamento técnico e ambiental.",
      budget:"", deadline:"", isDemo:true, status:"planning",
      modules: MODULES.map(m=>({id:m[0],status:"prepared"})),
      dataSchemaVersion:1,
      futureIntegrations:{meditationGeneration:{status:"planned"},voiceNarration:{status:"planned"}},
      createdAt:serverTimestamp(), updatedAt:serverTimestamp()
    };
    const ref = doc(projectCollection());
    await setDoc(ref,demo);
    await setDoc(markerRef,{ownerUid:currentUser.uid,initialized:true,initializedAt:serverTimestamp()});
    projects = [{id:ref.id,...demo,updatedAt:new Date()}];
  }
}

async function loadReferences(projectId) {
  const snap = await getDocs(referenceCollection(projectId));
  references = snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>String(b.referenceDate||"").localeCompare(String(a.referenceDate||"")));
  const list = document.getElementById("referencesList");
  if (!list) return;
  if (!references.length) { list.innerHTML='<p class="muted">Nenhuma referência registrada. Os campos estão prontos para receber dados com fonte e data.</p>'; return; }
  list.innerHTML = references.map(r=>`
    <article class="reference-row"><div><b>${esc(r.item)}</b><small>${esc(r.type)} · ${esc(r.region || "Região não informada")}</small><small>Fonte: ${esc(r.source || "Não informada")} · Data: ${esc(r.referenceDate || "Não informada")}</small></div><div class="reference-value">${r.value !== "" && r.value != null ? Number(r.value).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "Sem valor"}<small>${esc(r.unit || "")} · ${esc(r.confidence || "Não verificada")}</small></div><button class="icon-btn" data-delete-reference="${r.id}" title="Excluir referência">×</button></article>`).join("");
  list.querySelectorAll("[data-delete-reference]").forEach(btn=>btn.addEventListener("click",async()=>{
    if(!confirm("Excluir esta referência?")) return;
    await deleteDoc(doc(referenceCollection(projectId),btn.dataset.deleteReference));
    await loadReferences(projectId);
  }));
}

async function render() {
  if (!currentUser) return renderAuth();
  try {
    if (!projects.length) await loadProjects();
    if (editingProject) return shell(renderEditor(editingProject));
    if (activeProject) {
      shell(renderProjectDetail(activeProject));
      await loadReferences(activeProject.id);
      bindProjectDetail();
      return;
    }
    if (activeView !== "dashboard") return shell(renderModule(activeView));
    shell(renderDashboard());
    document.getElementById("newProjectBtn")?.addEventListener("click",()=>{editingProject=null;activeProject=null;openNewProject();});
    document.getElementById("newProjectEmpty")?.addEventListener("click",openNewProject);
    root.querySelectorAll("[data-open-project]").forEach(btn=>btn.addEventListener("click",()=>openProject(btn.dataset.openProject)));
    root.querySelectorAll("[data-edit-project]").forEach(btn=>btn.addEventListener("click",()=>editProject(btn.dataset.editProject)));
  } catch(error) {
    root.innerHTML = `<main class="error-screen"><h1>Não foi possível carregar seus projetos.</h1><p>${esc(error.message || "Verifique sua conexão e as permissões do banco de dados.")}</p><button class="secondary-btn" id="retryBtn">Tentar novamente</button></main>`;
    document.getElementById("retryBtn")?.addEventListener("click",()=>{projects=[];render();});
  }
}
function openNewProject(){editingProject={};renderEditorIntoShell();}
function renderEditorIntoShell(){shell(renderEditor(editingProject));bindEditor();}
function openProject(id){activeProject=projects.find(p=>p.id===id);editingProject=null;render();}
function editProject(id){editingProject=projects.find(p=>p.id===id);activeProject=null;renderEditorIntoShell();}
function bindEditor(){
  document.getElementById("projectForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    const button=e.submitter; button.disabled=true; button.textContent="Salvando...";
    const existing=editingProject?.id ? editingProject : null;
    const payload={
      ownerUid:currentUser.uid, name:val("pName"), category:val("pCategory"),
      description:val("pDescription"), country:val("pCountry"), region:val("pRegion"),
      location:val("pLocation"), landArea:val("pLandArea"), dimensions:val("pDimensions"),
      terrain:val("pTerrain"), environments:val("pEnvironments"), goals:val("pGoals"),
      features:val("pFeatures"), budget:val("pBudget"), deadline:val("pDeadline"),
      isDemo:existing?.isDemo===true, status:existing?.status || "planning",
      modules:existing?.modules || MODULES.map(m=>({id:m[0],status:"prepared"})),
      dataSchemaVersion:1,
      futureIntegrations:existing?.futureIntegrations || {meditationGeneration:{status:"planned"},voiceNarration:{status:"planned"}},
      createdAt:existing?.createdAt || serverTimestamp(), updatedAt:serverTimestamp()
    };
    try{
      const ref=existing ? projectRef(existing.id) : doc(projectCollection());
      await setDoc(ref,payload,{merge:true});
      projects=[]; editingProject=null; activeProject=null; activeView="dashboard"; await loadProjects(); render();
    }catch(err){alert("Não foi possível salvar: "+(err.message||"verifique sua conexão."));button.disabled=false;button.textContent="Salvar projeto ↗";}
  });
  const deleteBtn=document.getElementById("deleteProjectBtn");
  deleteBtn?.addEventListener("click",async()=>{
    if(!confirm("Excluir este projeto e suas referências? Esta ação não pode ser desfeita."))return;
    await deleteProject(editingProject.id);
  });
}
async function deleteProject(id){
  const refs=await getDocs(referenceCollection(id));
  await Promise.all(refs.docs.map(d=>deleteDoc(d.ref)));
  await deleteDoc(projectRef(id));
  projects=projects.filter(p=>p.id!==id); editingProject=null;activeProject=null;activeView="dashboard";render();
}
function bindProjectDetail(){
  document.getElementById("editActiveProject")?.addEventListener("click",()=>editProject(activeProject.id));
  document.getElementById("deleteActiveProject")?.addEventListener("click",async()=>{if(confirm("Excluir este projeto e suas referências? Esta ação não pode ser desfeita."))await deleteProject(activeProject.id);});
  document.getElementById("referenceForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    const button=e.submitter;button.disabled=true;
    const payload={ownerUid:currentUser.uid,type:val("rType"),item:val("rItem"),value:val("rValue"),unit:val("rUnit"),region:val("rRegion"),source:val("rSource"),referenceDate:val("rDate"),confidence:val("rConfidence"),createdAt:serverTimestamp(),updatedAt:serverTimestamp()};
    try{await addDoc(referenceCollection(activeProject.id),payload);e.target.reset();await loadReferences(activeProject.id);}
    catch(err){alert("Não foi possível registrar: "+(err.message||"erro desconhecido."));}
    finally{button.disabled=false;}
  });
}

onAuthStateChanged(auth, async user => {
  currentUser=user;
  projects=[];editingProject=null;activeProject=null;activeView="dashboard";
  if(user) await render(); else renderAuth();
});
