import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afSdrOs";
let currentUser = null;
let data = { prospeccao: "", qualificacao: "", acompanhamento: "", scripts: "" };
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
  const STEPS = ["prospeccao", "qualificacao", "acompanhamento", "scripts"];
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
  document.getElementById("breadcrumb").textContent = "SDR OS / " + view.toUpperCase();

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">SDR OS</h1>
      <p class="sub">Sistema operacional de prospecção, qualificação e acompanhamento.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="prospeccao">Começar</button></div>`;
  } else if (view === "prospeccao") {
    content.innerHTML = `
      <div class="eyebrow">Missão 1</div><h1 class="title">Prospecção</h1>
      <div class="field"><label>Como e onde prospectar?</label><textarea id="f-prospeccao">${esc(data.prospeccao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Conteúdo de autoridade + indicações + eventos seletivos. Foco em empresários e profissionais que já sentem a necessidade de sistema, não de mais informação.</p></div>
      <button class="btn" data-continue="prospeccao">Salvar e Continuar</button>`;
  } else if (view === "qualificacao") {
    content.innerHTML = `
      <div class="eyebrow">Missão 2</div><h1 class="title">Qualificação</h1>
      <div class="field"><label>Critérios de qualificação</label><textarea id="f-qualificacao">${esc(data.qualificacao)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Alinhamento com a essência da Akasha Hub, capacidade de investir tempo e recursos, e desejo real de construir legado (não apenas consumir).</p></div>
      <button class="btn" data-continue="qualificacao">Salvar e Continuar</button>`;
  } else if (view === "acompanhamento") {
    content.innerHTML = `
      <div class="eyebrow">Missão 3</div><h1 class="title">Acompanhamento</h1>
      <div class="field"><label>Como acompanhar o progresso?</label><textarea id="f-acompanhamento">${esc(data.acompanhamento)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Mentor view na AF Plataforma + pontos de contato estratégicos. Foco em progressão real nas fases, não em volume de mensagens.</p></div>
      <button class="btn" data-continue="acompanhamento">Salvar e Continuar</button>`;
  } else if (view === "scripts") {
    content.innerHTML = `
      <div class="eyebrow">Missão 4</div><h1 class="title">Scripts e playbook</h1>
      <div class="field"><label>Scripts e processos</label><textarea id="f-scripts">${esc(data.scripts)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Abordagem baseada em frequência e clareza, não em pressão. Playbook alinhado à identidade da marca.</p></div>
      <button class="btn" data-continue="scripts">Salvar e Finalizar</button>`;
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
  document.getElementById("avatar").textContent = (user.email || "S")[0].toUpperCase();
  loadData(user.uid);
});
