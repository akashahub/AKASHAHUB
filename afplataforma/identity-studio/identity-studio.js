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

function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c])); }

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

function nextStep(current) {
  const STEPS = ["identidade", "valores", "narrativa", "diferenciais"];
  const i = STEPS.indexOf(current);
  if (i === -1 || i === STEPS.length - 1) return "mapa";
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
        <button class="btn" data-goto="identidade">Começar pela identidade</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar</div>
        <p>Use os exemplos da Akasha Hub como espelho. Idealize a sua versão a partir do que já é verdadeiro em você.</p>
      </div>`;
  } else if (view === "identidade") {
    content.innerHTML = `
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
    content.innerHTML = `
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
    content.innerHTML = `
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
    content.innerHTML = `
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
  document.getElementById("avatar").textContent = (user.email || "I")[0].toUpperCase();
  loadData(user.uid);
});
