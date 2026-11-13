import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afComunicacao";
let currentUser = null;
let data = { estilo: "", mensagens: "", presenca: "", autoridade: "", plano: "", observacoes: "" };
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
  const fields = ["estilo", "mensagens", "presenca", "autoridade", "plano"];
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
  document.getElementById("breadcrumb").textContent = "COMUNICAÇÃO / " + view.toUpperCase();

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Comunicação</div>
      <h1 class="title">Sua comunicação</h1>
      <p class="sub">Defina estilo, mensagens, presença e autoridade. Construa um plano de comunicação consciente.</p>
      <div class="card">
        <div>Progresso do plano</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Mapeie estilo e mensagens para consolidar a comunicação." : "Plano pronto. Use como referência em toda interação."}</p>
        <button class="btn" onclick="setView('estilo')">Começar pelo estilo</button>
      </div>`;
  } else if (view === "estilo") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Estilo de comunicação</h1>
      <p class="sub">Como você se comunica e o estilo que deseja desenvolver.</p>
      <div class="field"><label>Estilo atual e desejado</label><textarea id="f-estilo">${esc(data.estilo)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.estilo = document.getElementById("f-estilo").value; saveData(); };
  } else if (view === "mensagens") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Mensagens-chave</h1>
      <p class="sub">O que você quer que as pessoas lembrem e entendam.</p>
      <div class="field"><label>Mensagens principais</label><textarea id="f-mensagens">${esc(data.mensagens)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.mensagens = document.getElementById("f-mensagens").value; saveData(); };
  } else if (view === "presenca") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Presença e impacto</h1>
      <p class="sub">Como você ocupa espaço e gera impacto.</p>
      <div class="field"><label>Presença e impacto</label><textarea id="f-presenca">${esc(data.presenca)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.presenca = document.getElementById("f-presenca").value; saveData(); };
  } else if (view === "autoridade") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Autoridade</h1>
      <p class="sub">Como comunica autoridade e gera confiança.</p>
      <div class="field"><label>Autoridade na comunicação</label><textarea id="f-autoridade">${esc(data.autoridade)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.autoridade = document.getElementById("f-autoridade").value; saveData(); };
  } else if (view === "plano") {
    content.innerHTML = `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Comunicação</h1>
      <p class="sub">Síntese para orientar sua comunicação.</p>
      <div class="card"><h3>Estilo</h3><p>${esc(data.estilo) || "—"}</p></div>
      <div class="card"><h3>Mensagens</h3><p>${esc(data.mensagens) || "—"}</p></div>
      <div class="card"><h3>Presença</h3><p>${esc(data.presenca) || "—"}</p></div>
      <div class="card"><h3>Autoridade</h3><p>${esc(data.autoridade) || "—"}</p></div>
      <div class="card"><h3>Plano</h3><p>${esc(data.plano) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados no Firestore (afComunicacao).</p>`;
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
