import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afAppBuilder";
let currentUser = null;
let data = { problema: "", solucao: "", funcionalidades: "", arquitetura: "", roadmap: "" };
let view = "dashboard";

function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(window._t);
  window._t = setTimeout(() => el.classList.add("hidden"), 2800);
}
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c])); }

async function loadData(uid) {
  try {
    const snap = await getDoc(doc(db, COL, uid));
    if (snap.exists()) data = { ...data, ...snap.data() };
  } catch {}
  render();
}
async function saveData() {
  if (!currentUser) { toast("Faça login para salvar."); return; }
  try {
    await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true });
    toast("Salvo com sucesso.");
  } catch { toast("Erro ao salvar."); }
  render();
}
function progress() {
  const fields = Object.keys(data);
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 15).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["problema", "solucao", "funcionalidades", "arquitetura", "roadmap"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1];
}
window.setView = setView;
function setView(v) {
  view = v;
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  const side = document.getElementById("sidebar");
  if (side) side.classList.remove("open");
  render();
}
function bind() {
  const nav = document.getElementById("nav");
  if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); });
  const menu = document.getElementById("menuBtn");
  if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); });
  document.addEventListener("click", e => {
    const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; }
    const cont = e.target.closest("[data-continue]");
    if (cont) {
      document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; });
      saveData().then(() => setView(nextStep(cont.dataset.continue)));
    }
  });
}
function render() {
  const p = progress();
  const content = document.getElementById("content");
  if (!content) return;
  const crumb = document.getElementById("breadcrumb");
  if (crumb) crumb.textContent = "APP BUILDER / " + view.toUpperCase();
  const notice = !currentUser ? `<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>` : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">App Builder</h1>
      <p class="sub">Planeje aplicativos e plataformas que amplificam sua essência e criam ativos digitais reais.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><h3>Próximo passo</h3><button class="btn" data-goto="problema">Começar</button></div>`;
  } else if (view === "problema") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 1</div><h1 class="title">Problema e usuário</h1>
      <div class="field"><label>Qual problema resolve e para quem?</label><textarea id="f-problema">${esc(data.problema)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>A AF Plataforma resolve a fragmentação de ferramentas de autoconhecimento e posicionamento. Usuários: mentorandos e empresários que precisam de um sistema operacional de essência, não de mais apps isolados.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Seja específico. Quem sofre com o quê hoje?</p></div>
      <button class="btn" data-continue="problema">Salvar e Continuar</button>`;
  } else if (view === "solucao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 2</div><h1 class="title">Solução e valor</h1>
      <div class="field"><label>Como o app resolve e qual valor entrega?</label><textarea id="f-solucao">${esc(data.solucao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>AF Plataforma entrega um ecossistema integrado de fases com persistência, mentor view e progressão gamificada. Valor: clareza e continuidade, não mais consumo.</p></div>
      <button class="btn" data-continue="solucao">Salvar e Continuar</button>`;
  } else if (view === "funcionalidades") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 3</div><h1 class="title">Funcionalidades</h1>
      <div class="field"><label>Principais funcionalidades (MVP)</label><textarea id="f-funcionalidades">${esc(data.funcionalidades)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Auth + Firestore por UID, dashboards por fase, apps independentes com save/continue, mentor pode acompanhar, exemplos e orientações embutidos.</p></div>
      <button class="btn" data-continue="funcionalidades">Salvar e Continuar</button>`;
  } else if (view === "arquitetura") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 4</div><h1 class="title">Arquitetura</h1>
      <div class="field"><label>Decisões de arquitetura</label><textarea id="f-arquitetura">${esc(data.arquitetura)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Standalone HTML/JS/CSS + Firebase. Cada app em sua pasta. Coleções isoladas por UID. Integração com a plataforma principal via links.</p></div>
      <button class="btn" data-continue="arquitetura">Salvar e Continuar</button>`;
  } else if (view === "roadmap") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 5</div><h1 class="title">Roadmap</h1>
      <div class="field"><label>Próximos passos e fases</label><textarea id="f-roadmap">${esc(data.roadmap)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Fase 01: Essência. Fase 02: Império Digital (sites, apps, funis, CRM, IA). Evolução contínua com feedback dos mentorandos.</p></div>
      <button class="btn" data-continue="roadmap">Salvar e Finalizar</button>`;
  }
}

bind();
render();

onAuthStateChanged(auth, user => {
  currentUser = user || null;
  if (user) {
    const pill = document.getElementById("userPill");
    const av = document.getElementById("avatar");
    if (pill) pill.textContent = user.email || "Mentorando";
    if (av) av.textContent = (user.email || "A")[0].toUpperCase();
    loadData(user.uid);
  } else render();
});
