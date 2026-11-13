import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afRegistrosAkashicos";
let currentUser = null;
let data = { intencao: "", reflexoes: "", insights: "", integracao: "", observacoes: "" };
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
  const fields = ["intencao", "reflexoes", "insights", "integracao"];
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
  document.getElementById("breadcrumb").textContent = "REGISTROS / " + view.toUpperCase();

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Registros Akáshicos</div>
      <h1 class="title">Sua jornada</h1>
      <p class="sub">Jornada guiada de autoconhecimento e reflexão. Espaço pessoal para intenção, insights e integração.</p>
      <div class="card">
        <div>Progresso do registro</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Defina a intenção e avance nas reflexões." : "Registro completo. Releia e integre o que surgiu."}</p>
        <button class="btn" onclick="setView('intencao')">Começar pela intenção</button>
      </div>`;
  } else if (view === "intencao") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Intenção</h1>
      <p class="sub">O que você deseja explorar ou esclarecer nesta jornada.</p>
      <div class="field"><label>Intenção da jornada</label><textarea id="f-intencao">${esc(data.intencao)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.intencao = document.getElementById("f-intencao").value; saveData(); };
  } else if (view === "reflexoes") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Reflexões guiadas</h1>
      <p class="sub">O que surge quando você se abre para a observação.</p>
      <div class="field"><label>Reflexões</label><textarea id="f-reflexoes">${esc(data.reflexoes)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.reflexoes = document.getElementById("f-reflexoes").value; saveData(); };
  } else if (view === "insights") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Insights</h1>
      <p class="sub">Percepções e clarezas que emergiram.</p>
      <div class="field"><label>Insights principais</label><textarea id="f-insights">${esc(data.insights)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.insights = document.getElementById("f-insights").value; saveData(); };
  } else if (view === "integracao") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Integração</h1>
      <p class="sub">Como integrar o que foi percebido na vida prática.</p>
      <div class="field"><label>Integração e próximos passos</label><textarea id="f-integracao">${esc(data.integracao)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.integracao = document.getElementById("f-integracao").value; saveData(); };
  } else if (view === "registro") {
    content.innerHTML = `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Registro final</h1>
      <p class="sub">Síntese da jornada de reflexão. Uso pessoal e confidencial.</p>
      <div class="card"><h3>Intenção</h3><p>${esc(data.intencao) || "—"}</p></div>
      <div class="card"><h3>Reflexões</h3><p>${esc(data.reflexoes) || "—"}</p></div>
      <div class="card"><h3>Insights</h3><p>${esc(data.insights) || "—"}</p></div>
      <div class="card"><h3>Integração</h3><p>${esc(data.integracao) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados no Firestore (afRegistrosAkashicos).</p>`;
  }
}

onAuthStateChanged(auth, user => {
  if (!user) {
    document.getElementById("content").innerHTML = `<div class="card"><h1>Acesso restrito</h1><p>Faça login na AF Plataforma.</p><a class="btn" href="/afplataforma/">Ir para login</a></div>`;
    return;
  }
  currentUser = user;
  document.getElementById("userPill").textContent = user.email || "Mentorando";
  document.getElementById("avatar").textContent = (user.email || "R")[0].toUpperCase();
  loadData(user.uid);
});
