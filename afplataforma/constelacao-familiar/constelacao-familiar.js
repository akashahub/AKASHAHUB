import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afConstelacaoFamiliar";
let currentUser = null;
let data = { sistema: "", padroes: "", relacoes: "", reflexoes: "", observacoes: "" };
let view = "dashboard";

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(window._t);
  window._t = setTimeout(() => el.classList.add("hidden"), 2800);
}

function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

async function loadData(uid) {
  const ref = doc(db, COL, uid);
  const snap = await getDoc(ref);
  if (snap.exists()) data = { ...data, ...snap.data() };
  render();
}

async function saveData() {
  if (!currentUser) return;
  const ref = doc(db, COL, currentUser.uid);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true });
  toast("Salvo com sucesso.");
  render();
}

function progress() {
  const fields = ["sistema", "padroes", "relacoes", "reflexoes"];
  const filled = fields.filter(f => (data[f] || "").trim().length > 20).length;
  return Math.round((filled / fields.length) * 100);
}

function setView(v) {
  view = v;
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  document.getElementById("sidebar").classList.remove("open");
  render();
}

document.getElementById("nav").addEventListener("click", e => {
  const b = e.target.closest("button[data-view]");
  if (b) setView(b.dataset.view);
});
document.getElementById("menuBtn").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));

function render() {
  const p = progress();
  const content = document.getElementById("content");
  document.getElementById("breadcrumb").textContent = "CONSTELAÇÃO / " + view.toUpperCase();

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Constelação Familiar</div>
      <h1 class="title">Seu sistema</h1>
      <p class="sub">Mapeamento reflexivo de padrões, relações e dinâmica familiar. Não é terapia; é observação consciente.</p>
      <div class="card">
        <div>Progresso do mapa</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Observe o sistema e padrões para consolidar o mapa." : "Mapa pronto. Use como reflexão para escolhas conscientes."}</p>
        <button class="btn" onclick="setView('sistema')">Começar pelo sistema</button>
      </div>`;
  } else if (view === "sistema") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Sistema familiar</h1>
      <p class="sub">Estrutura, membros relevantes e dinâmica observada.</p>
      <div class="field"><label>Descrição do sistema</label><textarea id="f-sistema">${esc(data.sistema)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.sistema = document.getElementById("f-sistema").value; saveData(); };
  } else if (view === "padroes") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Padrões observados</h1>
      <p class="sub">Repetições, lealdades e dinâmicas que se repetem.</p>
      <div class="field"><label>Padrões e dinâmicas</label><textarea id="f-padroes">${esc(data.padroes)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.padroes = document.getElementById("f-padroes").value; saveData(); };
  } else if (view === "relacoes") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Relações chave</h1>
      <p class="sub">Relações que mais influenciam decisões e identidade.</p>
      <div class="field"><label>Relações relevantes</label><textarea id="f-relacoes">${esc(data.relacoes)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.relacoes = document.getElementById("f-relacoes").value; saveData(); };
  } else if (view === "reflexoes") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Reflexões</h1>
      <p class="sub">O que isso revela sobre suas escolhas atuais.</p>
      <div class="field"><label>Reflexões e insights</label><textarea id="f-reflexoes">${esc(data.reflexoes)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.reflexoes = document.getElementById("f-reflexoes").value; saveData(); };
  } else if (view === "mapa") {
    content.innerHTML = `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Mapa de Constelação</h1>
      <p class="sub">Síntese reflexiva do sistema, padrões e relações. Uso pessoal e confidencial.</p>
      <div class="card"><h3>Sistema</h3><p>${esc(data.sistema) || "—"}</p></div>
      <div class="card"><h3>Padrões</h3><p>${esc(data.padroes) || "—"}</p></div>
      <div class="card"><h3>Relações</h3><p>${esc(data.relacoes) || "—"}</p></div>
      <div class="card"><h3>Reflexões</h3><p>${esc(data.reflexoes) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados no Firestore (afConstelacaoFamiliar).</p>`;
  }
}

onAuthStateChanged(auth, user => {
  if (!user) {
    document.getElementById("content").innerHTML = `<div class="card"><h1>Acesso restrito</h1><p>Faça login na AF Plataforma.</p><a class="btn" href="/afplataforma/">Ir para login</a></div>`;
    return;
  }
  currentUser = user;
  document.getElementById("userPill").textContent = user.email || "Mentorando";
  document.getElementById("avatar").textContent = (user.email || "C")[0].toUpperCase();
  loadData(user.uid);
});
