import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afMarketingPessoal";
let currentUser = null;
let data = { narrativa: "", publico: "", canais: "", acoes: "", observacoes: "" };
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
  const fields = ["narrativa", "publico", "canais", "acoes"];
  const filled = fields.filter(f => (data[f] || "").trim().length > 20).length;
  return Math.round((filled / fields.length) * 100);
}

function nextStep(current) {
  const STEPS = ["narrativa", "publico", "canais", "acoes"];
  const i = STEPS.indexOf(current);
  if (i === -1 || i === STEPS.length - 1) return "plano";
  return STEPS[i + 1];
}
window.setView = setView;

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
  document.getElementById("breadcrumb").textContent = "MARKETING / " + view.toUpperCase();

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Marketing Pessoal</div>
      <h1 class="title">Seu marketing</h1>
      <p class="sub">Narrativa, público, canais e ações. O resultado é um Plano de Marketing Pessoal utilizável.</p>
      <div class="card">
        <div>Progresso do plano</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Continue preenchendo para gerar seu plano completo." : "Plano pronto. Use como guia de ação."}</p>
        <button class="btn" data-goto="narrativa">Começar</button>
      </div>`;
  } else if (view === "narrativa") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Narrativa</h1>
      <p class="sub">A história que você conta sobre si e seu trabalho.</p>
      <div class="field"><label>Narrativa principal</label><textarea id="f-narrativa">${esc(data.narrativa)}</textarea></div>
      <button class="btn" data-continue="narrativa">Salvar e Continuar</button>`;
  } else if (view === "publico") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Público</h1>
      <p class="sub">Quem você quer alcançar e o que eles precisam.</p>
      <div class="field"><label>Público-alvo</label><textarea id="f-publico">${esc(data.publico)}</textarea></div>
      <button class="btn" data-continue="publico">Salvar e Continuar</button>`;
  } else if (view === "canais") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Canais</h1>
      <p class="sub">Onde você se apresenta e gera presença.</p>
      <div class="field"><label>Canais prioritários</label><textarea id="f-canais">${esc(data.canais)}</textarea></div>
      <button class="btn" data-continue="canais">Salvar e Continuar</button>`;
  } else if (view === "acoes") {
    content.innerHTML = `
      <div class="eyebrow">Módulo</div>
      <h1 class="title">Ações</h1>
      <p class="sub">O que você vai fazer de forma consistente.</p>
      <div class="field"><label>Ações e rotina</label><textarea id="f-acoes">${esc(data.acoes)}</textarea></div>
      <button class="btn" data-continue="acoes">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Marketing Pessoal</h1>
      <p class="sub">Síntese para orientar sua presença e comunicação.</p>
      <div class="card"><h3>Narrativa</h3><p>${esc(data.narrativa) || "—"}</p></div>
      <div class="card"><h3>Público</h3><p>${esc(data.publico) || "—"}</p></div>
      <div class="card"><h3>Canais</h3><p>${esc(data.canais) || "—"}</p></div>
      <div class="card"><h3>Ações</h3><p>${esc(data.acoes) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados no Firestore (afMarketingPessoal).</p>`;
  }
}

document.addEventListener("click", e => {
  const goto = e.target.closest("[data-goto]");
  if (goto) { setView(goto.dataset.goto); return; }
  const cont = e.target.closest("[data-continue]");
  if (cont) {
    const step = cont.dataset.continue;
    document.querySelectorAll("textarea[id^='f-']").forEach(el => {
      let key = el.id.slice(2);
      if (key in data) data[key] = el.value;
    });
    saveData().then(() => setView(nextStep(step)));
  }
});

onAuthStateChanged(auth, user => {
  if (!user) {
    document.getElementById("content").innerHTML = `<div class="card"><h1>Acesso restrito</h1><p>Faça login na AF Plataforma.</p><a class="btn" href="/afplataforma/">Ir para login</a></div>`;
    return;
  }
  currentUser = user;
  document.getElementById("userPill").textContent = user.email || "Mentorando";
  document.getElementById("avatar").textContent = (user.email || "M")[0].toUpperCase();
  loadData(user.uid);
});
