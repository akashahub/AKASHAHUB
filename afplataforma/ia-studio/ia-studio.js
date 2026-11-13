import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afIaStudio";
let currentUser = null;
let data = { agentes: "", prompts: "", automacoes: "", casos: "" };
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
  const STEPS = ["agentes", "prompts", "automacoes", "casos"];
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
  document.getElementById("breadcrumb").textContent = "IA STUDIO / " + view.toUpperCase();

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">IA Studio</h1>
      <p class="sub">Agentes, prompts e automações a serviço da sua essência e do legado.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="agentes">Começar</button></div>`;
  } else if (view === "agentes") {
    content.innerHTML = `
      <div class="eyebrow">Missão 1</div><h1 class="title">Agentes</h1>
      <div class="field"><label>Quais agentes fazem sentido para você?</label><textarea id="f-agentes">${esc(data.agentes)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Agente de reflexão de essência, agente de geração de conteúdo alinhado à identidade, agente de acompanhamento de mentorandos.</p></div>
      <button class="btn" data-continue="agentes">Salvar e Continuar</button>`;
  } else if (view === "prompts") {
    content.innerHTML = `
      <div class="eyebrow">Missão 2</div><h1 class="title">Prompts</h1>
      <div class="field"><label>Prompts e sistemas de prompt</label><textarea id="f-prompts">${esc(data.prompts)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Prompts que forçam alinhamento com o Dossiê de Essência e a frequência da marca. Nunca genéricos.</p></div>
      <button class="btn" data-continue="prompts">Salvar e Continuar</button>`;
  } else if (view === "automacoes") {
    content.innerHTML = `
      <div class="eyebrow">Missão 3</div><h1 class="title">Automações</h1>
      <div class="field"><label>Automações com IA</label><textarea id="f-automacoes">${esc(data.automacoes)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Geração de orientações personalizadas com base no progresso do mentorando, resumos de sessões, sugestões de próximos passos.</p></div>
      <button class="btn" data-continue="automacoes">Salvar e Continuar</button>`;
  } else if (view === "casos") {
    content.innerHTML = `
      <div class="eyebrow">Missão 4</div><h1 class="title">Casos de uso</h1>
      <div class="field"><label>Casos de uso prioritários</label><textarea id="f-casos">${esc(data.casos)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Suporte ao mentor na revisão de dossiês, geração de conteúdo para o império digital, e automação de processos repetitivos sem perder a essência.</p></div>
      <button class="btn" data-continue="casos">Salvar e Finalizar</button>`;
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
  document.getElementById("avatar").textContent = (user.email || "I")[0].toUpperCase();
  loadData(user.uid);
});
