import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afIdentityStudio";
let currentUser = null;
let data = { identidade: "", valores: "", narrativa: "", diferenciais: "", observacoes: "" };
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
  const fields = ["identidade", "valores", "narrativa", "diferenciais"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["identidade", "valores", "narrativa", "diferenciais"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "mapa" : STEPS[i + 1];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "IDENTITY / " + view.toUpperCase();
  const notice = !currentUser ? `<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>` : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
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
        <button class="btn" data-goto="identidade">Começar pela identidade</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar</div>
        <p>Use os exemplos da Akasha Hub como espelho. Idealize a sua versão a partir do que já é verdadeiro em você.</p>
      </div>`;
  } else if (view === "identidade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Identidade</h1>
      <p class="sub">Quem você é no núcleo e como se reconhece.</p>
      <div class="field"><label>Identidade central</label><textarea id="f-identidade">${esc(data.identidade)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>A Akasha Hub é a incubadora de essência e legado. Não vendemos transformação — criamos o sistema operacional para quem já decidiu construir. Identidade: tecnologia da alma a serviço de autoridade consciente.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir quem você é quando tira o cargo, o produto e o status.</p>
        <ul>
          <li>Qual é o núcleo que permanece mesmo se tudo mudar?</li>
          <li>Como você se reconhece quando não está performando?</li>
        </ul>
      </div>
      <button class="btn" data-continue="identidade">Salvar e Continuar</button>`;
  } else if (view === "valores") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Valores</h1>
      <p class="sub">Princípios inegociáveis que orientam decisões.</p>
      <div class="field"><label>Valores centrais</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Essência antes de estratégia. Frequência alinhada. Tecnologia a serviço da alma. Legado sobre hype. Clareza sobre volume.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: listar o que você realmente não abre mão.</p>
        <ul>
          <li>Quais valores você já pagou preço para manter?</li>
          <li>O que é inegociável mesmo que seja lucrativo?</li>
        </ul>
      </div>
      <button class="btn" data-continue="valores">Salvar e Continuar</button>`;
  } else if (view === "narrativa") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Narrativa</h1>
      <p class="sub">A história que você conta sobre si e sua jornada.</p>
      <div class="field"><label>Narrativa pessoal</label><textarea id="f-narrativa">${esc(data.narrativa)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>De consumidores de transformação a construtores de legado. A narrativa da Akasha Hub é a de quem já entendeu que identidade mal mapeada gera autoridade frágil — e decidiu criar o sistema que resolve isso.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: contar a história que explica por que você faz o que faz.</p>
        <ul>
          <li>Qual é o arco da sua jornada até aqui?</li>
          <li>O que você já superou que agora se torna autoridade?</li>
        </ul>
      </div>
      <button class="btn" data-continue="narrativa">Salvar e Continuar</button>`;
  } else if (view === "diferenciais") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Diferenciais</h1>
      <p class="sub">O que te torna único e reconhecível.</p>
      <div class="field"><label>Diferenciais e unicidade</label><textarea id="f-diferenciais">${esc(data.diferenciais)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>União de constelação familiar, branding de essência e tecnologia de plataforma. Não é só software nem só mentoria — é o sistema operacional de identidade e autoridade.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: identificar o que só você combina.</p>
        <ul>
          <li>Qual combinação de experiência + visão + forma de fazer é só sua?</li>
          <li>O que as pessoas já notam em você sem você precisar explicar?</li>
        </ul>
      </div>
      <button class="btn" data-continue="diferenciais">Salvar e Continuar</button>`;
  } else if (view === "mapa") {
    content.innerHTML = notice + `
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

bind();
render();

onAuthStateChanged(auth, user => {
  currentUser = user || null;
  if (user) {
    const pill = document.getElementById("userPill"); const av = document.getElementById("avatar");
    if (pill) pill.textContent = user.email || "Mentorando";
    if (av) av.textContent = (user.email || "I")[0].toUpperCase();
    loadData(user.uid);
  } else render();
});
