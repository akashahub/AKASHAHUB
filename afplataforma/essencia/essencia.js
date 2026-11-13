import { auth, db, isMentorIdentity } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afEssencia";
let currentUser = null;
let data = { historia: "", valores: "", crencas: "", posicionamento: "", proposito: "", observacoes: "" };
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
  const fields = ["historia", "valores", "crencas", "posicionamento", "proposito"];
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
  document.getElementById("breadcrumb").textContent = "ESSÊNCIA / " + view.toUpperCase().replace("-", " ");

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Arquitetura de Essência</div>
      <h1 class="title">Sua essência</h1>
      <p class="sub">Mapeie identidade, história, valores e direção. O resultado é um Dossiê de Essência claro e utilizável.</p>
      <div class="card">
        <div>Progresso do dossiê</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Continue preenchendo os módulos para gerar seu dossiê completo." : "Dossiê pronto. Revise e use como base para posicionamento e liderança."}</p>
        <button class="btn" onclick="setView('historia')">Começar pela história</button>
      </div>`;
  } else if (view === "historia") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">História pessoal</h1>
      <p class="sub">Contexto, experiências formativas e o que moldou quem você é.</p>
      <div class="field"><label>Narrativa pessoal</label><textarea id="f-historia">${esc(data.historia)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.historia = document.getElementById("f-historia").value; saveData(); };
  } else if (view === "valores") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Valores e crenças</h1>
      <p class="sub">Princípios que orientam decisões e padrões a observar.</p>
      <div class="field"><label>Valores centrais</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      <div class="field"><label>Crenças e padrões</label><textarea id="f-crencas">${esc(data.crencas)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => {
      data.valores = document.getElementById("f-valores").value;
      data.crencas = document.getElementById("f-crencas").value;
      saveData();
    };
  } else if (view === "posicionamento") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Posicionamento</h1>
      <p class="sub">Como você se apresenta, diferenciais e autoridade.</p>
      <div class="field"><label>Posicionamento e narrativa</label><textarea id="f-pos">${esc(data.posicionamento)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.posicionamento = document.getElementById("f-pos").value; saveData(); };
  } else if (view === "proposito") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Propósito e direção</h1>
      <p class="sub">Direção clara e o que você está construindo.</p>
      <div class="field"><label>Propósito e próximos passos</label><textarea id="f-prop">${esc(data.proposito)}</textarea></div>
      <button class="btn" id="save">Salvar</button>`;
    document.getElementById("save").onclick = () => { data.proposito = document.getElementById("f-prop").value; saveData(); };
  } else if (view === "dossie") {
    content.innerHTML = `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Dossiê de Essência</h1>
      <p class="sub">Síntese do que foi mapeado. Use como base para branding, comunicação e liderança.</p>
      <div class="card"><h3>História</h3><p>${esc(data.historia) || "—"}</p></div>
      <div class="card"><h3>Valores</h3><p>${esc(data.valores) || "—"}</p></div>
      <div class="card"><h3>Crenças e padrões</h3><p>${esc(data.crencas) || "—"}</p></div>
      <div class="card"><h3>Posicionamento</h3><p>${esc(data.posicionamento) || "—"}</p></div>
      <div class="card"><h3>Propósito</h3><p>${esc(data.proposito) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados salvos no Firestore sob seu UID.</p>`;
  }
}

onAuthStateChanged(auth, user => {
  if (!user) {
    document.getElementById("content").innerHTML = `<div class="card"><h1>Acesso restrito</h1><p>Faça login na AF Plataforma para acessar a Essência.</p><a class="btn" href="/afplataforma/">Ir para login</a></div>`;
    return;
  }
  currentUser = user;
  document.getElementById("userPill").textContent = user.email || "Mentorando";
  document.getElementById("avatar").textContent = (user.email || "E")[0].toUpperCase();
  loadData(user.uid);
});
