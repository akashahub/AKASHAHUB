import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afConstelacaoFamiliar";
let currentUser = null;
let data = { sistema: "", padroes: "", relacoes: "", reflexoes: "", observacoes: "" };
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
  const fields = ["sistema", "padroes", "relacoes", "reflexoes"];
  const filled = fields.filter(f => (data[f] || "").trim().length > 20).length;
  return Math.round((filled / fields.length) * 100);
}

function nextStep(current) {
  const STEPS = ["sistema", "padroes", "relacoes", "reflexoes"];
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
  document.getElementById("breadcrumb").textContent = "CONSTELAÇÃO / " + view.toUpperCase();

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Constelação Familiar</div>
      <h1 class="title">Seu sistema</h1>
      <p class="sub">Mapeamento reflexivo de padrões, relações e dinâmica familiar. Não é terapia; é observação consciente.</p>
      <div class="card">
        <div>Progresso do mapa</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Observe o sistema e padrões para consolidar o mapa." : "Mapa pronto. Use como reflexão para escolhas conscientes."}</p>
        <button class="btn" data-goto="sistema">Começar</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar</div>
        <p>Use o exemplo da Akasha Hub como espelho. Observe sem julgamento e idealize o que faz sentido para o seu sistema.</p>
      </div>`;
  } else if (view === "sistema") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Sistema familiar</h1>
      <p class="sub">Estrutura, membros relevantes e dinâmica observada.</p>
      <div class="field"><label>Descrição do sistema</label><textarea id="f-sistema">${esc(data.sistema)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Na origem da Akasha Hub existe uma dinâmica de quem carrega a responsabilidade de “construir o que os outros apenas consomem”. O sistema familiar reflete lealdade a quem ensinou a “ser forte sozinho” e, ao mesmo tempo, o desejo de criar espaço para outros construírem legado. Observação: não é diagnóstico, é mapa reflexivo.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão: descrever o sistema sem julgar. Quem ocupa qual lugar? O que se repete?</p>
        <ul>
          <li>Quais pessoas (vivas ou não) ainda influenciam suas decisões?</li>
          <li>Qual é o “lugar” que você ocupa na família hoje?</li>
          <li>O que o sistema “pede” que você seja ou faça?</li>
        </ul>
      </div>
      <button class="btn" data-continue="sistema">Salvar e Continuar</button>`;
  } else if (view === "padroes") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Padrões observados</h1>
      <p class="sub">Repetições, lealdades e dinâmicas que se repetem.</p>
      <div class="field"><label>Padrões e dinâmicas</label><textarea id="f-padroes">${esc(data.padroes)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Padrão observado: “quem constrói carrega sozinho”. Lealdade a não pedir ajuda e a transformar dor em estrutura. Repetição: criar sistemas para outros enquanto o próprio sistema interno ainda opera em modo de sobrevivência. Observação consciente permite escolher o que continua e o que se transforma.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão: listar o que se repete sem tentar “corrigir” agora.</p>
        <ul>
          <li>Quais situações se repetem na sua vida profissional ou pessoal?</li>
          <li>Existe alguma lealdade invisível (a não ter mais que alguém, a não brilhar, a carregar)?</li>
          <li>O que você já tentou mudar que volta no mesmo formato?</li>
        </ul>
      </div>
      <button class="btn" data-continue="padroes">Salvar e Continuar</button>`;
  } else if (view === "relacoes") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Relações chave</h1>
      <p class="sub">Relações que mais influenciam decisões e identidade.</p>
      <div class="field"><label>Relações relevantes</label><textarea id="f-relacoes">${esc(data.relacoes)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Relações que moldaram a visão: quem ensinou a “não depender de ninguém” e quem mostrou que é possível criar espaço para outros crescerem. A relação com o próprio papel de “quem constrói o sistema” é central. Observar essas relações ajuda a escolher o que se transmite para a frente.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão: nomear as relações que ainda influenciam sem precisar resolver tudo.</p>
        <ul>
          <li>Quais 2-3 relações mais impactam suas escolhas hoje?</li>
          <li>O que você herdou de cada uma (visão, limite, força ou peso)?</li>
          <li>O que você quer transmitir diferente a partir daqui?</li>
        </ul>
      </div>
      <button class="btn" data-continue="relacoes">Salvar e Continuar</button>`;
  } else if (view === "reflexoes") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Reflexões</h1>
      <p class="sub">O que isso revela sobre suas escolhas atuais.</p>
      <div class="field"><label>Reflexões e insights</label><textarea id="f-reflexoes">${esc(data.reflexoes)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>A reflexão central: construir sistemas para outros não precisa significar carregar sozinho. A Akasha Hub nasceu exatamente dessa observação — criar um espaço onde a pessoa mapeia sua essência e constrói legado sem precisar repetir o padrão de “fazer tudo sozinho”. O mapa serve para escolher o que continua e o que se transforma.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão: conectar o que observou com as escolhas que você faz hoje.</p>
        <ul>
          <li>O que esse mapa revela sobre o que você constrói ou evita construir?</li>
          <li>Qual escolha consciente você pode fazer a partir dessa observação?</li>
          <li>Como isso se conecta com sua essência e seu legado?</li>
        </ul>
      </div>
      <button class="btn" data-continue="reflexoes">Salvar e Continuar</button>`;
  } else if (view === "mapa") {
    content.innerHTML = `
      <div class="eyebrow">Entregável · Nível Completo</div>
      <h1 class="title">Mapa de Constelação</h1>
      <p class="sub">Síntese reflexiva do sistema, padrões e relações. Uso pessoal e confidencial.</p>
      <div class="card"><h3>Sistema</h3><p>${esc(data.sistema) || "—"}</p></div>
      <div class="card"><h3>Padrões</h3><p>${esc(data.padroes) || "—"}</p></div>
      <div class="card"><h3>Relações</h3><p>${esc(data.relacoes) || "—"}</p></div>
      <div class="card"><h3>Reflexões</h3><p>${esc(data.reflexoes) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados no Firestore (afConstelacaoFamiliar).</p>
      <div class="guidance">
        <div class="eyebrow">Próximo nível</div>
        <p>Com este mapa, você tem uma base reflexiva para as escolhas de identidade, posicionamento e legado. Use-o como referência viva, não como destino final.</p>
      </div>`;
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
  document.getElementById("avatar").textContent = (user.email || "C")[0].toUpperCase();
  loadData(user.uid);
});
