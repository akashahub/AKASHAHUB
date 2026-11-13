import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afCrmInteligente";
let currentUser = null;
let data = { contatos: "", oportunidades: "", relacionamento: "", automacoes: "" };
let view = "dashboard";

function toast(msg) {
  const el = document.getElementById("toast"); if (!el) return;
  el.textContent = msg; el.classList.remove("hidden");
  clearTimeout(window._t); window._t = setTimeout(() => el.classList.add("hidden"), 2800);
}
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c])); }
async function loadData(uid) {
  try { const snap = await getDoc(doc(db, COL, uid)); if (snap.exists()) data = { ...data, ...snap.data() }; } catch {}
  render();
}
async function saveData() {
  if (!currentUser) { toast("Faça login para salvar."); return; }
  try { await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true }); toast("Salvo com sucesso."); }
  catch { toast("Erro ao salvar."); }
  render();
}
function progress() {
  const fields = Object.keys(data);
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 10).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["contatos", "oportunidades", "relacionamento", "automacoes"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1];
}
window.setView = setView;
function setView(v) {
  view = v;
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  const side = document.getElementById("sidebar"); if (side) side.classList.remove("open");
  render();
}
function bind() {
  const nav = document.getElementById("nav"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button[data-view]"); if (b) setView(b.dataset.view); });
  const menu = document.getElementById("menuBtn"); if (menu) menu.addEventListener("click", () => { const s = document.getElementById("sidebar"); if (s) s.classList.toggle("open"); });
  document.addEventListener("click", e => {
    const goto = e.target.closest("[data-goto]"); if (goto) { setView(goto.dataset.goto); return; }
    const cont = e.target.closest("[data-continue]");
    if (cont) {
      document.querySelectorAll("textarea[id^='f-']").forEach(el => { const key = el.id.slice(2); if (key in data) data[key] = el.value; });
      saveData().then(() => setView(nextStep(cont.dataset.continue)));
    }
  });
}
function render() {
  const p = progress();
  const content = document.getElementById("content"); if (!content) return;
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "CRM / " + view.toUpperCase();
  const notice = !currentUser ? `<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>` : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">CRM Inteligente</h1>
      <p class="sub">Organize contatos, oportunidades e relacionamento com inteligência.</p>
      <div class="card"><div>Progresso</div><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong></div>
      <div class="card"><button class="btn" data-goto="contatos">Começar</button></div>`;
  } else if (view === "contatos") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 1</div><h1 class="title">Contatos</h1>
      <div class="field"><label>Como organizar seus contatos?</label><textarea id="f-contatos">${esc(data.contatos)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Segmentação por fase da jornada (Essência, Império, Financeiro), origem e potencial de legado. Cada contato tem histórico de interação com a plataforma.</p></div>
      <button class="btn" data-continue="contatos">Salvar e Continuar</button>`;
  } else if (view === "oportunidades") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 2</div><h1 class="title">Oportunidades</h1>
      <div class="field"><label>Como mapear e acompanhar oportunidades?</label><textarea id="f-oportunidades">${esc(data.oportunidades)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Pipeline: Lead → Sessão de Alinhamento → Mentorando Ativo → Expansão / Parceria. Cada etapa tem critérios claros de avanço.</p></div>
      <button class="btn" data-continue="oportunidades">Salvar e Continuar</button>`;
  } else if (view === "relacionamento") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 3</div><h1 class="title">Relacionamento</h1>
      <div class="field"><label>Como nutrir e aprofundar o relacionamento?</label><textarea id="f-relacionamento">${esc(data.relacionamento)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Acompanhamento personalizado via mentor view, conteúdos alinhados à fase atual, e pontos de contato de alto valor (não spam).</p></div>
      <button class="btn" data-continue="relacionamento">Salvar e Continuar</button>`;
  } else if (view === "automacoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Missão 4</div><h1 class="title">Automações</h1>
      <div class="field"><label>Quais automações fazem sentido?</label><textarea id="f-automacoes">${esc(data.automacoes)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo</div><p>Notificação quando mentorando avança de fase, sequência de onboarding na plataforma, alertas de engajamento baixo.</p></div>
      <button class="btn" data-continue="automacoes">Salvar e Finalizar</button>`;
  }
}

bind();
render();

onAuthStateChanged(auth, user => {
  currentUser = user || null;
  if (user) {
    const pill = document.getElementById("userPill"); const av = document.getElementById("avatar");
    if (pill) pill.textContent = user.email || "Mentorando";
    if (av) av.textContent = (user.email || "C")[0].toUpperCase();
    loadData(user.uid);
  } else render();
});
