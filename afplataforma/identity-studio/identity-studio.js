import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afIdentityStudio";
let currentUser = null;
let data = { identidade: "", valores: "", narrativa: "", diferenciais: "", observacoes: "" };
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
  const fields = ["identidade", "valores", "narrativa", "diferenciais"];
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
  document.getElementById("breadcrumb").textContent = "IDENTITY / " + view.toUpperCase();

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Identity Studio</div>
      <h1 class="title">Sua identidade</h1>
      <p class="sub">Defina identidade, valores, narrativa e diferenciais com clareza e profundidade.</p>
      <div class="card">
        <div>Progresso do mapa</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Mapeie identidade e valores para consolidar o mapa." : "Mapa pronto. Use como base para posicionamento e branding."}</p>
        <button class="btn" onclick="setView('identidade')">Começar pela identidade</button>
      </div>`;
  } else if (view === "identidade") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Identidade</h1>
      <p class="sub">Quem você é no núcleo e como se reconhece.</p>
      <div class="field"><label>Identidade central</label><textarea id="f-identidade">${esc(data.identidade)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.identidade = document.getElementById("f-identidade").value; saveData(); };
  } else if (view === "valores") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Valores</h1>
      <p class="sub">Princípios inegociáveis que orientam decisões.</p>
      <div class="field"><label>Valores centrais</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.valores = document.getElementById("f-valores").value; saveData(); };
  } else if (view === "narrativa") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Narrativa</h1>
      <p class="sub">A história que você conta sobre si e sua jornada.</p>
      <div class="field"><label>Narrativa pessoal</label><textarea id="f-narrativa">${esc(data.narrativa)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.narrativa = document.getElementById("f-narrativa").value; saveData(); };
  } else if (view === "diferenciais") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Diferenciais</h1>
      <p class="sub">O que te torna único e reconhecível.</p>
      <div class="field"><label>Diferenciais e unicidade</label><textarea id="f-diferenciais">${esc(data.diferenciais)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.diferenciais = document.getElementById("f-diferenciais").value; saveData(); };
  } else if (view === "mapa") {
    content.innerHTML = `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Mapa de Identidade</h1>
      <p class="sub">Síntese da sua identidade, valores, narrativa e diferenciais.</p>
      <div class="card"><h3>Identidade</h3><p>${esc(data.identidade) || "—"}</p></div>
      <div class="card"><h3>Valores</h3><p>${esc(data.valores) || "—"}</p></div>
      <div class="card"><h3>Narrativa</h3><p>${esc(data.narrativa) || "—"}</p></div>
      <div class="card"><h3>Diferenciais</h3><p>${esc(data.diferenciais) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados no Firestore (afIdentityStudio).</p>`;
  }
}

onAuthStateChanged(auth, user => {
  if (!user) {
    document.getElementById("content").innerHTML = `<div class="card"><h1>Acesso restrito</h1><p>Faça login na AF Plataforma.</p><a class="btn" href="/afplataforma/">Ir para login</a></div>`;
    return;
  }
  currentUser = user;
  document.getElementById("userPill").textContent = user.email || "Mentorando";
  document.getElementById("avatar").textContent = (user.email || "I")[0].toUpperCase();
  loadData(user.uid);
});
