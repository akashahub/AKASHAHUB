import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afBrandingPessoal";
let currentUser = null;
let data = { identidade: "", arquetipos: "", voz: "", diferenciais: "", elementos: "", observacoes: "" };
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
  const fields = ["identidade", "arquetipos", "voz", "diferenciais", "elementos"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["identidade", "voz", "diferenciais", "elementos"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "guia" : STEPS[i + 1];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "BRANDING / " + view.toUpperCase();
  const notice = !currentUser ? `<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>` : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
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
        <button class="btn" data-goto="identidade">Começar pela identidade</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar</div>
        <p>Exemplos da marca Akasha Hub + orientação para você idealizar a sua.</p>
      </div>`;
  } else if (view === "identidade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Identidade e arquétipos</h1>
      <p class="sub">Quem você é como marca e quais arquétipos representam.</p>
      <div class="field"><label>Identidade de marca</label><textarea id="f-identidade">${esc(data.identidade)}</textarea></div>
      <div class="field"><label>Arquétipos</label><textarea id="f-arquetipos">${esc(data.arquetipos)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Identidade: Tecnologia da Alma · Arquitetura de Essência e Legado. Arquétipos: o Sábio + o Criador + o Guia. Marca que une profundidade, clareza e sistemas que sustentam crescimento consciente.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir a identidade visual e verbal da sua marca pessoal.</p>
        <ul>
          <li>Qual arquétipo combina com a sua essência?</li>
          <li>Como sua marca se diferencia de outras no mesmo espaço?</li>
        </ul>
      </div>
      <button class="btn" data-continue="identidade">Salvar e Continuar</button>`;
  } else if (view === "voz") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Tom de voz</h1>
      <p class="sub">Como você fala, escreve e se comunica.</p>
      <div class="field"><label>Tom de voz e linguagem</label><textarea id="f-voz">${esc(data.voz)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Tom: claro, profundo, direto e elegante. Sem hype. Linguagem que une tecnologia e alma. Fala com autoridade sem precisar gritar. Luxo silencioso.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir como sua marca fala.</p>
        <ul>
          <li>Qual tom combina com sua essência?</li>
          <li>O que você nunca diz na sua comunicação?</li>
        </ul>
      </div>
      <button class="btn" data-continue="voz">Salvar e Continuar</button>`;
  } else if (view === "diferenciais") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Diferenciais</h1>
      <p class="sub">O que te torna único e como se diferencia.</p>
      <div class="field"><label>Diferenciais e posicionamento</label><textarea id="f-diferenciais">${esc(data.diferenciais)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>União de constelação, branding de essência e plataforma tecnológica. Não é só mentoria nem só software — é o sistema operacional de identidade e legado.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: listar o que só a sua marca combina.</p>
        <ul>
          <li>Qual combinação é única em você?</li>
          <li>O que as pessoas já reconhecem na sua forma de fazer?</li>
        </ul>
      </div>
      <button class="btn" data-continue="diferenciais">Salvar e Continuar</button>`;
  } else if (view === "elementos") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Elementos de marca</h1>
      <p class="sub">Cores, tipografia, símbolos e referências visuais.</p>
      <div class="field"><label>Elementos visuais e referências</label><textarea id="f-elementos">${esc(data.elementos)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Paleta: dourado + violeta sobre fundo escuro. Tipografia: Cormorant Garamond + Inter. Símbolo: flor de lótus / mandala. Estética de luxo silencioso e profundidade.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir os elementos visuais que representam sua marca.</p>
        <ul>
          <li>Quais cores e formas já combinam com sua essência?</li>
          <li>Qual referência visual você quer que as pessoas associem a você?</li>
        </ul>
      </div>
      <button class="btn" data-continue="elementos">Salvar e Continuar</button>`;
  } else if (view === "guia") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Guia de Branding Pessoal</h1>
      <p class="sub">Referência consolidada da sua marca pessoal.</p>
      <div class="card"><h3>Identidade</h3><p>${esc(data.identidade) || "—"}</p></div>
      <div class="card"><h3>Arquétipos</h3><p>${esc(data.arquetipos) || "—"}</p></div>
      <div class="card"><h3>Tom de voz</h3><p>${esc(data.voz) || "—"}</p></div>
      <div class="card"><h3>Diferenciais</h3><p>${esc(data.diferenciais) || "—"}</p></div>
      <div class="card"><h3>Elementos</h3><p>${esc(data.elementos) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados no Firestore (afBrandingPessoal).</p>`;
  }
}

bind();
render();

onAuthStateChanged(auth, user => {
  currentUser = user || null;
  if (user) {
    const pill = document.getElementById("userPill"); const av = document.getElementById("avatar");
    if (pill) pill.textContent = user.email || "Mentorando";
    if (av) av.textContent = (user.email || "B")[0].toUpperCase();
    loadData(user.uid);
  } else render();
});
