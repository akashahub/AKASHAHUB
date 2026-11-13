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
      <div class="eyebrow">Marketing Pessoal OS</div>
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
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar</div>
        <p>Exemplos reais da Akasha Hub + orientação para você idealizar o seu marketing pessoal.</p>
      </div>`;
  } else if (view === "narrativa") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Narrativa</h1>
      <p class="sub">A história que você conta sobre si e seu trabalho.</p>
      <div class="field"><label>Narrativa principal</label><textarea id="f-narrativa">${esc(data.narrativa)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>De consumidores de transformação a construtores de legado. A narrativa da Akasha Hub é a de quem já entendeu que identidade mal mapeada gera autoridade frágil — e criou o sistema operacional que resolve isso. Tecnologia da alma a serviço de quem constrói.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir a história que você conta sobre o que faz.</p>
        <ul>
          <li>Qual é o problema que você resolve de forma única?</li>
          <li>Qual transformação você ajuda a pessoa a viver?</li>
        </ul>
      </div>
      <button class="btn" data-continue="narrativa">Salvar e Continuar</button>`;
  } else if (view === "publico") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Público</h1>
      <p class="sub">Quem você quer alcançar e o que eles precisam.</p>
      <div class="field"><label>Público-alvo</label><textarea id="f-publico">${esc(data.publico)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Empresários, investidores e profissionais de alto potencial que já consomem muita transformação, mas querem construir legado real. Pessoas que valorizam essência, autoridade consciente e sistemas que sustentam crescimento.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: descrever quem é a pessoa ideal (não todo mundo).</p>
        <ul>
          <li>Quem já está pronto para o que você oferece?</li>
          <li>Qual é a dor ou desejo central desse público?</li>
        </ul>
      </div>
      <button class="btn" data-continue="publico">Salvar e Continuar</button>`;
  } else if (view === "canais") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Canais</h1>
      <p class="sub">Onde você se apresenta e gera presença.</p>
      <div class="field"><label>Canais prioritários</label><textarea id="f-canais">${esc(data.canais)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Site próprio (akashahub.com.br), plataforma AF, conteúdo de autoridade (identidade + tecnologia), e canais onde o público de alto potencial já está. Foco em profundidade, não em volume.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: escolher onde sua presença faz mais sentido.</p>
        <ul>
          <li>Onde seu público já consome conteúdo de qualidade?</li>
          <li>Qual canal você consegue sustentar com consistência?</li>
        </ul>
      </div>
      <button class="btn" data-continue="canais">Salvar e Continuar</button>`;
  } else if (view === "acoes") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Ações</h1>
      <p class="sub">O que você vai fazer de forma consistente.</p>
      <div class="field"><label>Ações e rotina</label><textarea id="f-acoes">${esc(data.acoes)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Publicar conteúdo de autoridade sobre identidade e legado, manter a AF Plataforma como sistema operacional vivo, e gerar conversas de alto nível com empresários e profissionais que querem construir em vez de consumir.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação</div>
        <p>Missão: definir ações pequenas e consistentes.</p>
        <ul>
          <li>Qual ação semanal você consegue sustentar?</li>
          <li>Como essa ação reforça sua narrativa e autoridade?</li>
        </ul>
      </div>
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
