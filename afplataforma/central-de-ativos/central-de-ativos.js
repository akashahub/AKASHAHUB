import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afCentralAtivos";
let currentUser = null;
let data = { inventario: "", organizacao: "", integracao: "", evolucao: "" };
let view = "dashboard";

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(window._t);
  window._t = setTimeout(() => el.classList.add("hidden"), 2800);
}
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c])); }

async function loadData(uid) {
  const snap = await getDoc(doc(db, COL, uid));
  if (snap.exists()) data = { ...data, ...snap.data() };
  render();
}
async function saveData() {
  if (!currentUser) return;
  await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true });
  toast("Salvo com sucesso.");
  render();
}
function progress() {
  const fields = Object.keys(data);
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 10).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["inventario", "organizacao", "integracao", "evolucao"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1];
}
window.setView = setView;
function setView(v) {
  view = v;
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  document.getElementById("sidebar").classList.remove("open");
  render();
}
document.getElementById("nav").addEventListener("click", e => {
  const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view);
});
document.getElementById("menuBtn").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));

function render() {
  const p = progress();
  const content = document.getElementById("content");
  document.getElementById("breadcrumb").textContent = "CENTRAL DE ATIVOS / " + view.toUpperCase();

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">Central de Ativos</h1>
      <p class="sub">Organize e integre todos os seus ativos digitais em um sistema coerente.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="inventario">Começar</button></div>`;
  } else if (view === "inventario") {
    content.innerHTML = `
      <div class="eyebrow">Missão 1</div><h1 class="title">Inventário</h1>
      <div class="field"><label>Quais ativos digitais você já tem?</label><textarea id="f-inventario">${esc(data.inventario)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Site, AF Plataforma (todos os apps das fases), conteúdos, funis, CRM, agentes de IA, produtos digitais, e a própria identidade da marca.</p></div>
      <button class="btn" data-continue="inventario">Salvar e Continuar</button>`;
  } else if (view === "organizacao") {
    content.innerHTML = `
      <div class="eyebrow">Missão 2</div><h1 class="title">Organização</h1>
      <div class="field"><label>Como organizar esses ativos?</label><textarea id="f-organizacao">${esc(data.organizacao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Por fase da Arquitetura de Legado. Cada ativo serve a uma etapa específica e se conecta ao ecossistema.</p></div>
      <button class="btn" data-continue="organizacao">Salvar e Continuar</button>`;
  } else if (view === "integracao") {
    content.innerHTML = `
      <div class="eyebrow">Missão 3</div><h1 class="title">Integração</h1>
      <div class="field"><label>Como integrar os ativos?</label><textarea id="f-integracao">${esc(data.integracao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Firebase como backbone, links entre apps, mentor view unificada, e dados que fluem entre as fases.</p></div>
      <button class="btn" data-continue="integracao">Salvar e Continuar</button>`;
  } else if (view === "evolucao") {
    content.innerHTML = `
      <div class="eyebrow">Missão 4</div><h1 class="title">Evolução</h1>
      <div class="field"><label>Como os ativos vão evoluir?</label><textarea id="f-evolucao">${esc(data.evolucao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Novas fases (Financeiro, Expansão, Legado), novos apps, e aprofundamento contínuo da plataforma com base no uso real dos mentorandos.</p></div>
      <button class="btn" data-continue="evolucao">Salvar e Finalizar</button>`;
  }
}

document.addEventListener("click", e => {
  const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; }
  const cont = e.target.closest("[data-continue]");
  if (cont) {
    document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; });
    saveData().then(() => setView(nextStep(cont.dataset.continue)));
  }
});

onAuthStateChanged(auth, user => {
  if (!user) {
    document.getElementById("content").innerHTML = `<div class="card"><h1>Acesso restrito</h1><p>Faça login na AF Plataforma.</p><a class="btn" href="/afplataforma/">Login</a></div>`;
    return;
  }
  currentUser = user;
  document.getElementById("userPill").textContent = user.email || "Mentorando";
  document.getElementById("avatar").textContent = (user.email || "A")[0].toUpperCase();
  loadData(user.uid);
});
