import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afRegistrosAkashicos";
let currentUser = null;
let data = { intencao: "", reflexoes: "", insights: "", integracao: "", observacoes: "" };
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
  const fields = ["intencao", "reflexoes", "insights", "integracao"];
  return Math.round((fields.filter(f => (data[f] || "").trim().length > 20).length / fields.length) * 100);
}
function nextStep(current) {
  const STEPS = ["intencao", "reflexoes", "insights", "integracao"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "registro" : STEPS[i + 1];
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
  const crumb = document.getElementById("breadcrumb"); if (crumb) crumb.textContent = "REGISTROS / " + view.toUpperCase();
  const notice = !currentUser ? `<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> <a class="btn" href="/afplataforma/">Fazer login</a></p></div>` : "";

  if (view === "dashboard") {
    content.innerHTML = notice + `
      <div class="eyebrow">Registros Akáshicos</div>
      <h1 class="title">Sua jornada</h1>
      <p class="sub">Jornada guiada de autoconhecimento e reflexão. Espaço pessoal para intenção, insights e integração.</p>
      <div class="card">
        <div>Progresso do registro</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Defina a intenção e avance nas reflexões." : "Registro completo. Releia e integre o que surgiu."}</p>
        <button class="btn" data-goto="intencao">Começar</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar</div>
        <p>Este é um espaço de reflexão pessoal. O exemplo da Akasha Hub serve apenas como inspiração de profundidade — não como modelo a copiar.</p>
      </div>`;
  } else if (view === "intencao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Intenção</h1>
      <p class="sub">O que você deseja explorar ou esclarecer nesta jornada.</p>
      <div class="field"><label>Intenção da jornada</label><textarea id="f-intencao">${esc(data.intencao)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Intenção: esclarecer o que significa “parar de consumir transformação e começar a construir legado” no nível mais profundo. Observar onde ainda existe consumo de informação sem construção real e o que precisa ser integrado para que a tecnologia e a essência caminhem juntas.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão: definir uma intenção clara e pessoal para esta jornada.</p>
        <ul>
          <li>O que você deseja ver com mais clareza sobre si?</li>
          <li>Qual pergunta importante ainda não tem resposta?</li>
          <li>O que você quer integrar na vida prática a partir desta reflexão?</li>
        </ul>
      </div>
      <button class="btn" data-continue="intencao">Salvar e Continuar</button>`;
  } else if (view === "reflexoes") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Reflexões guiadas</h1>
      <p class="sub">O que surge quando você se abre para a observação.</p>
      <div class="field"><label>Reflexões</label><textarea id="f-reflexoes">${esc(data.reflexoes)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Surge a percepção de que muitas pessoas chegam à Akasha Hub já cansadas de consumir conteúdo e querendo estrutura real. A reflexão é: como criar espaço para que a pessoa se encontre consigo mesma antes de construir o digital? A tecnologia precisa servir à essência, não o contrário.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão: anotar o que emerge sem forçar conclusões.</p>
        <ul>
          <li>O que aparece quando você fica em silêncio com a intenção?</li>
          <li>Quais imagens, sensações ou pensamentos se repetem?</li>
          <li>O que você já sabe, mas ainda não nomeou?</li>
        </ul>
      </div>
      <button class="btn" data-continue="reflexoes">Salvar e Continuar</button>`;
  } else if (view === "insights") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Insights</h1>
      <p class="sub">Percepções e clarezas que emergiram.</p>
      <div class="field"><label>Insights principais</label><textarea id="f-insights">${esc(data.insights)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Insight central: a maior parte do consumo de transformação acontece porque a pessoa ainda não tem clareza da própria essência. Quando a identidade está mapeada, a construção de legado deixa de ser esforço e passa a ser expressão natural. A tecnologia amplifica o que já está alinhado.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão: registrar as clarezas que surgiram.</p>
        <ul>
          <li>Qual percepção mais importante apareceu?</li>
          <li>O que você entendeu sobre si que antes não estava claro?</li>
          <li>Como isso muda a forma como você se vê ou se posiciona?</li>
        </ul>
      </div>
      <button class="btn" data-continue="insights">Salvar e Continuar</button>`;
  } else if (view === "integracao") {
    content.innerHTML = notice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Integração</h1>
      <p class="sub">Como integrar o que foi percebido na vida prática.</p>
      <div class="field"><label>Integração e próximos passos</label><textarea id="f-integracao">${esc(data.integracao)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Integração: a AF Plataforma existe para que a pessoa não precise mais consumir transformação sem estrutura. O próximo passo é que cada mentorando use os apps da Fase 01 como sistema operacional de essência, e que a construção digital nasça a partir dessa clareza. A tecnologia deixa de ser ferramenta e passa a ser expressão do que a pessoa já é.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão: definir como o que você percebeu se torna ação ou escolha concreta.</p>
        <ul>
          <li>Qual mudança prática você pode fazer a partir deste insight?</li>
          <li>Como isso se conecta com os outros apps da Fase 01?</li>
          <li>Qual é o próximo passo pequeno e real?</li>
        </ul>
      </div>
      <button class="btn" data-continue="integracao">Salvar e Continuar</button>`;
  } else if (view === "registro") {
    content.innerHTML = notice + `
      <div class="eyebrow">Entregável · Nível Completo</div>
      <h1 class="title">Registro final</h1>
      <p class="sub">Síntese da jornada de reflexão. Uso pessoal e confidencial.</p>
      <div class="card"><h3>Intenção</h3><p>${esc(data.intencao) || "—"}</p></div>
      <div class="card"><h3>Reflexões</h3><p>${esc(data.reflexoes) || "—"}</p></div>
      <div class="card"><h3>Insights</h3><p>${esc(data.insights) || "—"}</p></div>
      <div class="card"><h3>Integração</h3><p>${esc(data.integracao) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados no Firestore (afRegistrosAkashicos).</p>
      <div class="guidance">
        <div class="eyebrow">Próximo nível</div>
        <p>Este registro é seu. Releia quando precisar de clareza e use-o como base para as escolhas de identidade, posicionamento e construção de legado.</p>
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
    if (av) av.textContent = (user.email || "R")[0].toUpperCase();
    loadData(user.uid);
  } else render();
});
