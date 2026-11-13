import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afComunicacao";
let currentUser = null;
let data = { estilo: "", mensagens: "", presenca: "", autoridade: "", plano: "", observacoes: "" };
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
  const fields = ["estilo", "mensagens", "presenca", "autoridade", "plano"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["estilo", "mensagens", "presenca", "autoridade", "plano"];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "COMUNICAÇÃO / " + view.toUpperCase();
  const notice = !currentUser ? `<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>` : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
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
        <button class="btn" data-goto="estilo">Começar</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar</div>
        <p>Exemplos da Akasha Hub como referência de tom e profundidade. Idealize a comunicação que combina com sua essência.</p>
      </div>`;
  } else if (view === "estilo") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Estilo de comunicação</h1>
      <p class="sub">Como você se comunica e o estilo que deseja desenvolver.</p>
      <div class="field"><label>Estilo atual e desejado</label><textarea id="f-estilo">${esc(data.estilo)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Estilo: claro, profundo, direto e elegante. Sem hype. Linguagem que une tecnologia e alma. Fala com autoridade sem precisar gritar. Luxo silencioso — menos volume, mais precisão e coerência.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir o tom que combina com quem você é.</p>
        <ul>
          <li>Como você se comunica quando está no seu melhor?</li>
          <li>Qual tom você quer que as pessoas associem a você?</li>
        </ul>
      </div>
      <button class="btn" data-continue="estilo">Salvar e Continuar</button>`;
  } else if (view === "mensagens") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Mensagens-chave</h1>
      <p class="sub">O que você quer que as pessoas lembrem e entendam.</p>
      <div class="field"><label>Mensagens principais</label><textarea id="f-mensagens">${esc(data.mensagens)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Mensagens centrais: “Pare de consumir transformação e comece a construir legado.” “Tecnologia da alma a serviço da essência.” “Identidade clara gera autoridade real.” Mensagens que conectam essência, identidade e construção digital.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir 2-3 mensagens que você quer que as pessoas lembrem.</p>
        <ul>
          <li>Qual é a frase que resume o que você faz?</li>
          <li>O que você quer que as pessoas entendam sobre você sem você precisar explicar?</li>
        </ul>
      </div>
      <button class="btn" data-continue="mensagens">Salvar e Continuar</button>`;
  } else if (view === "presenca") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Presença e impacto</h1>
      <p class="sub">Como você ocupa espaço e gera impacto.</p>
      <div class="field"><label>Presença e impacto</label><textarea id="f-presenca">${esc(data.presenca)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Presença de profundidade, não de volume. Impacto que vem da coerência entre o que se é e o que se comunica. Menos postagens, mais clareza. A presença da Akasha Hub é a de quem já mapeou a essência e constrói a partir dela.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir como você quer ocupar espaço.</p>
        <ul>
          <li>Como você gera impacto quando fala ou escreve?</li>
          <li>O que você quer que as pessoas sintam ao interagir com você?</li>
        </ul>
      </div>
      <button class="btn" data-continue="presenca">Salvar e Continuar</button>`;
  } else if (view === "autoridade") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Autoridade</h1>
      <p class="sub">Como comunica autoridade e gera confiança.</p>
      <div class="field"><label>Autoridade na comunicação</label><textarea id="f-autoridade">${esc(data.autoridade)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Autoridade comunicada pela coerência, não pelo volume. Confiança gerada por quem já mapeou sua essência e ajuda outros a fazerem o mesmo. A comunicação de autoridade da Akasha Hub é precisa, profunda e alinhada com o que se constrói.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir como você comunica autoridade sem forçar.</p>
        <ul>
          <li>Como você transmite confiança na comunicação?</li>
          <li>O que você não faz para proteger sua autoridade comunicativa?</li>
        </ul>
      </div>
      <button class="btn" data-continue="autoridade">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Comunicação</h1>
      <p class="sub">Síntese para orientar sua comunicação.</p>
      <div class="card"><h3>Estilo</h3><p>${esc(data.estilo) || "—"}</p></div>
      <div class="card"><h3>Mensagens</h3><p>${esc(data.mensagens) || "—"}</p></div>
      <div class="card"><h3>Presença</h3><p>${esc(data.presenca) || "—"}</p></div>
      <div class="card"><h3>Autoridade</h3><p>${esc(data.autoridade) || "—"}</p></div>
      <div class="card"><h3>Plano</h3><p>${esc(data.plano) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados no Firestore (afComunicacao).</p>
      <div class="guidance">
        <div class="eyebrow">Próximo nível</div>
        <p>Use este plano junto com Marketing Pessoal e Authority & Leadership OS. A comunicação ganha força quando está alinhada com a essência mapeada.</p>
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
    if (av) av.textContent = (user.email || "C")[0].toUpperCase();
    loadData(user.uid);
  } else render();
});
