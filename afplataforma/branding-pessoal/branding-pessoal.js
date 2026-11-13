import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afBrandingPessoal";
let currentUser = null;
let data = { identidade: "", arquétipos: "", voz: "", diferenciais: "", elementos: "", observacoes: "" };
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
  const fields = ["identidade", "arquétipos", "voz", "diferenciais", "elementos"];
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
  document.getElementById("breadcrumb").textContent = "BRANDING / " + view.toUpperCase();

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Branding Pessoal</div>
      <h1 class="title">Sua marca</h1>
      <p class="sub">Defina identidade, voz, diferenciais e elementos visuais da sua marca pessoal.</p>
      <div class="card">
        <div>Progresso do guia</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Mapeie identidade e voz para consolidar o guia de branding." : "Guia pronto. Use como referência em toda comunicação."}</p>
        <button class="btn" onclick="setView('identidade')">Começar pela identidade</button>
      </div>`;
  } else if (view === "identidade") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Identidade e arquétipos</h1>
      <p class="sub">Quem você é como marca e quais arquétipos representam.</p>
      <div class="field"><label>Identidade de marca</label><textarea id="f-identidade">${esc(data.identidade)}</textarea></div>
      <div class="field"><label>Arquétipos</label><textarea id="f-arquetipos">${esc(data.arquétipos)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => {
      data.identidade = document.getElementById("f-identidade").value;
      data.arquétipos = document.getElementById("f-arquetipos").value;
      saveData();
    };
  } else if (view === "voz") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Tom de voz</h1>
      <p class="sub">Como você fala, escreve e se comunica.</p>
      <div class="field"><label>Tom de voz e linguagem</label><textarea id="f-voz">${esc(data.voz)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.voz = document.getElementById("f-voz").value; saveData(); };
  } else if (view === "diferenciais") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Diferenciais</h1>
      <p class="sub">O que te torna único e como se diferencia.</p>
      <div class="field"><label>Diferenciais e posicionamento</label><textarea id="f-diferenciais">${esc(data.diferenciais)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.diferenciais = document.getElementById("f-diferenciais").value; saveData(); };
  } else if (view === "elementos") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Elementos de marca</h1>
      <p class="sub">Cores, tipografia, símbolos e referências visuais.</p>
      <div class="field"><label>Elementos visuais e referências</label><textarea id="f-elementos">${esc(data.elementos)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.elementos = document.getElementById("f-elementos").value; saveData(); };
  } else if (view === "guia") {
    content.innerHTML = `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Guia de Branding Pessoal</h1>
      <p class="sub">Referência consolidada da sua marca pessoal.</p>
      <div class="card"><h3>Identidade</h3><p>${esc(data.identidade) || "—"}</p></div>
      <div class="card"><h3>Arquétipos</h3><p>${esc(data.arquétipos) || "—"}</p></div>
      <div class="card"><h3>Tom de voz</h3><p>${esc(data.voz) || "—"}</p></div>
      <div class="card"><h3>Diferenciais</h3><p>${esc(data.diferenciais) || "—"}</p></div>
      <div class="card"><h3>Elementos</h3><p>${esc(data.elementos) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados no Firestore (afBrandingPessoal).</p>`;
  }
}

onAuthStateChanged(auth, user => {
  if (!user) {
    document.getElementById("content").innerHTML = `<div class="card"><h1>Acesso restrito</h1><p>Faça login na AF Plataforma.</p><a class="btn" href="/afplataforma/">Ir para login</a></div>`;
    return;
  }
  currentUser = user;
  document.getElementById("userPill").textContent = user.email || "Mentorando";
  document.getElementById("avatar").textContent = (user.email || "B")[0].toUpperCase();
  loadData(user.uid);
});
