import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afAuthorityLeadership";
let currentUser = null;
let data = { estilo: "", comunicacao: "", reputacao: "", competencias: "", observacoes: "" };
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
  const fields = ["estilo", "comunicacao", "reputacao", "competencias"];
  const filled = fields.filter(f => (data[f] || "").trim().length > 20).length;
  return Math.round((filled / fields.length) * 100);
}

function nextStep(current) {
  const STEPS = ["estilo", "comunicacao", "reputacao", "competencias"];
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
  document.getElementById("breadcrumb").textContent = "AUTHORITY / " + view.toUpperCase();

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Authority & Leadership OS</div>
      <h1 class="title">Sua autoridade</h1>
      <p class="sub">Unifica liderança, comunicação de autoridade, reputação e competências em um plano consciente.</p>
      <div class="card">
        <div>Progresso do plano</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Defina estilo e comunicação para consolidar a autoridade." : "Plano pronto. Use como referência em liderança e presença."}</p>
        <button class="btn" data-goto="estilo">Começar pelo estilo</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar</div>
        <p>Exemplos da Akasha Hub + orientação para você construir sua autoridade de forma coerente com sua essência.</p>
      </div>`;
  } else if (view === "estilo") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Estilo de liderança</h1>
      <p class="sub">Como você lidera e o estilo que deseja consolidar.</p>
      <div class="field"><label>Estilo de liderança</label><textarea id="f-estilo">${esc(data.estilo)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Liderança por essência e clareza. Não por volume nem por hype. Direção clara, frequência alinhada e sistemas que sustentam crescimento consciente. Liderar é criar o espaço onde as pessoas constroem legado.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir como você lidera quando está no seu melhor.</p>
        <ul>
          <li>Qual estilo de liderança já é natural em você?</li>
          <li>Como você quer ser lembrado como líder?</li>
        </ul>
      </div>
      <button class="btn" data-continue="estilo">Salvar e Continuar</button>`;
  } else if (view === "comunicacao") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Comunicação de autoridade</h1>
      <p class="sub">Como comunica direção, visão e confiança.</p>
      <div class="field"><label>Comunicação de autoridade</label><textarea id="f-comunicacao">${esc(data.comunicacao)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Comunicação precisa e profunda. Menos volume, mais clareza. Fala a partir da essência mapeada e da experiência real. Autoridade que não precisa gritar — é reconhecida pela coerência.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir como você comunica autoridade sem forçar.</p>
        <ul>
          <li>Como você transmite confiança quando fala?</li>
          <li>Qual é o tom que combina com sua essência?</li>
        </ul>
      </div>
      <button class="btn" data-continue="comunicacao">Salvar e Continuar</button>`;
  } else if (view === "reputacao") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Reputação e influência</h1>
      <p class="sub">Como constrói e protege sua reputação.</p>
      <div class="field"><label>Reputação e influência</label><textarea id="f-reputacao">${esc(data.reputacao)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Reputação construída sobre essência e resultados reais. Não sobre hype. Influência que vem de quem já mapeou sua identidade e ajuda outros a fazerem o mesmo. Proteção da reputação pela coerência.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir como você quer ser reconhecido e o que protege isso.</p>
        <ul>
          <li>Pelo que você quer ser conhecido?</li>
          <li>O que você não faz para proteger sua reputação?</li>
        </ul>
      </div>
      <button class="btn" data-continue="reputacao">Salvar e Continuar</button>`;
  } else if (view === "competencias") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Competências</h1>
      <p class="sub">Competências de liderança e autoridade a desenvolver.</p>
      <div class="field"><label>Competências prioritárias</label><textarea id="f-competencias">${esc(data.competencias)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Clareza de identidade, comunicação de autoridade, construção de sistemas que sustentam legado, e capacidade de guiar pessoas de alto potencial da essência à execução.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: listar o que você precisa fortalecer para consolidar autoridade.</p>
        <ul>
          <li>Quais competências já são fortes em você?</li>
          <li>Quais 1-2 você quer desenvolver agora?</li>
        </ul>
      </div>
      <button class="btn" data-continue="competencias">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = `
      <div class="eyebrow">Entregável</div>
      <h1 class="title">Plano de Authority & Leadership</h1>
      <p class="sub">Síntese unificada de liderança, comunicação e reputação.</p>
      <div class="card"><h3>Estilo</h3><p>${esc(data.estilo) || "—"}</p></div>
      <div class="card"><h3>Comunicação</h3><p>${esc(data.comunicacao) || "—"}</p></div>
      <div class="card"><h3>Reputação</h3><p>${esc(data.reputacao) || "—"}</p></div>
      <div class="card"><h3>Competências</h3><p>${esc(data.competencias) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados no Firestore (afAuthorityLeadership).</p>`;
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
  document.getElementById("avatar").textContent = (user.email || "A")[0].toUpperCase();
  loadData(user.uid);
});
