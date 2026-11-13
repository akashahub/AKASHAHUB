import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afLideranca";
let currentUser = null;
let data = { estilo: "", valores: "", comunicacao: "", autoridade: "", plano: "", observacoes: "" };
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
  const fields = ["estilo", "valores", "comunicacao", "autoridade", "plano"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["estilo", "valores", "comunicacao", "autoridade", "plano"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "plano" : STEPS[i + 1];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "LIDERANÇA / " + view.toUpperCase();
  const notice = !currentUser ? `<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>` : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Liderança</div>
      <h1 class="title">Sua liderança</h1>
      <p class="sub">Defina estilo, valores, comunicação e autoridade. Construa um plano de liderança consciente.</p>
      <div class="card">
        <div>Progresso do plano</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Mapeie seu estilo e valores para consolidar a liderança." : "Plano pronto. Use como referência em decisões e comunicação."}</p>
        <button class="btn" data-goto="estilo">Começar</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar</div>
        <p>Exemplos da Akasha Hub como espelho. Idealize sua liderança a partir da sua essência, não de modelos externos.</p>
      </div>`;
  } else if (view === "estilo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Estilo de liderança</h1>
      <p class="sub">Como você lidera e o estilo que deseja desenvolver.</p>
      <div class="field"><label>Estilo atual e desejado</label><textarea id="f-estilo">${esc(data.estilo)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Liderança por clareza e essência. Não por volume nem por carisma forçado. Direção precisa, frequência alinhada e criação de sistemas que permitem que as pessoas construam sem depender do líder o tempo todo. Liderar é criar o espaço, não ocupar todo o espaço.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir como você lidera quando está no seu melhor.</p>
        <ul>
          <li>Qual estilo já é natural em você?</li>
          <li>Como você quer ser lembrado como líder?</li>
        </ul>
      </div>
      <button class="btn" data-continue="estilo">Salvar e Continuar</button>`;
  } else if (view === "valores") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Valores de liderança</h1>
      <p class="sub">Princípios que orientam suas decisões como líder.</p>
      <div class="field"><label>Valores e princípios</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Essência antes de estratégia. Clareza sobre hype. Construção real sobre consumo de transformação. Legado sobre crescimento vazio. Valores que orientam tanto a liderança interna quanto a comunicação externa.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: listar o que é inegociável na sua forma de liderar.</p>
        <ul>
          <li>Quais valores você já pagou preço para manter como líder?</li>
          <li>O que você não faz, mesmo que seja lucrativo ou popular?</li>
        </ul>
      </div>
      <button class="btn" data-continue="valores">Salvar e Continuar</button>`;
  } else if (view === "comunicacao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Comunicação</h1>
      <p class="sub">Como comunica visão, feedback e direção.</p>
      <div class="field"><label>Comunicação de liderança</label><textarea id="f-comunicacao">${esc(data.comunicacao)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Comunicação clara, profunda e direta. Menos volume, mais precisão. Fala a partir da essência mapeada e da experiência real. Autoridade que não precisa gritar — é reconhecida pela coerência entre o que se diz e o que se constrói.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir como você comunica direção e confiança.</p>
        <ul>
          <li>Como você transmite visão sem forçar?</li>
          <li>Qual tom combina com sua essência?</li>
        </ul>
      </div>
      <button class="btn" data-continue="comunicacao">Salvar e Continuar</button>`;
  } else if (view === "autoridade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Autoridade e influência</h1>
      <p class="sub">Como constrói e exerce autoridade.</p>
      <div class="field"><label>Autoridade e influência</label><textarea id="f-autoridade">${esc(data.autoridade)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Autoridade construída sobre essência e resultados reais. Não sobre hype nem sobre volume de conteúdo. Influência que vem de quem já mapeou sua identidade e ajuda outros a fazerem o mesmo. Proteção da autoridade pela coerência.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir como você constrói autoridade de forma sustentável.</p>
        <ul>
          <li>Pelo que você quer ser reconhecido como líder?</li>
          <li>O que você não faz para proteger sua autoridade?</li>
        </ul>
      </div>
      <button class="btn" data-continue="autoridade">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Liderança</h1>
      <p class="sub">Síntese para orientar sua evolução como líder.</p>
      <div class="card"><h3>Estilo</h3><p>${esc(data.estilo) || "—"}</p></div>
      <div class="card"><h3>Valores</h3><p>${esc(data.valores) || "—"}</p></div>
      <div class="card"><h3>Comunicação</h3><p>${esc(data.comunicacao) || "—"}</p></div>
      <div class="card"><h3>Autoridade</h3><p>${esc(data.autoridade) || "—"}</p></div>
      <div class="card"><h3>Plano</h3><p>${esc(data.plano) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados no Firestore (afLideranca).</p>
      <div class="guidance">
        <div class="eyebrow">Próximo nível</div>
        <p>Este plano pode ser usado junto com o Authority & Leadership OS. Use como referência viva para suas decisões de liderança.</p>
      </div>`;
  }
}

bind();
render();

onAuthStateChanged(auth, user => {
  currentUser = user || null;
  if (user) {
    const pill = document.getElementById("userPill"); const av = document.getElementById("avatar");
    if (pill) pill.textContent = user.email || "Mentorando";
    if (av) av.textContent = (user.email || "L")[0].toUpperCase();
    loadData(user.uid);
  } else render();
});
