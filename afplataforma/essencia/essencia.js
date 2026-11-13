import { auth, db, isMentorIdentity } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afEssencia";
let currentUser = null;
let data = { historia: "", valores: "", crencas: "", posicionamento: "", proposito: "", observacoes: "" };
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
  const fields = ["historia", "valores", "crencas", "posicionamento", "proposito"];
  const filled = fields.filter(f => (data[f] || "").trim().length > 20).length;
  return Math.round((filled / fields.length) * 100);
}

function nextStep(current) {
  const STEPS = ["historia", "valores", "posicionamento", "proposito"];
  const i = STEPS.indexOf(current);
  if (i === -1 || i === STEPS.length - 1) return "dossie";
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
  document.getElementById("breadcrumb").textContent = "ESSÊNCIA / " + view.toUpperCase().replace("-", " ");

  if (view === "dashboard") {
    content.innerHTML = `
      <div class="eyebrow">Arquitetura de Essência</div>
      <h1 class="title">Sua essência</h1>
      <p class="sub">Mapeie identidade, história, valores e direção. O resultado é um Dossiê de Essência claro e utilizável.</p>
      <div class="card">
        <div>Progresso do dossiê</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% preenchido</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Continue preenchendo os módulos para gerar seu dossiê completo." : "Dossiê pronto. Revise e use como base para posicionamento e liderança."}</p>
        <button class="btn" data-goto="historia">Começar</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar este app</div>
        <p>Cada etapa tem um exemplo real da Akasha Hub + uma orientação para você idealizar o seu. Não copie — use como espelho para encontrar a sua versão.</p>
      </div>`;
  } else if (view === "historia") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">História pessoal</h1>
      <p class="sub">Contexto, experiências formativas e o que moldou quem você é.</p>
      <div class="field"><label>Narrativa pessoal</label><textarea id="f-historia">${esc(data.historia)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>A Akasha Hub nasceu da percepção de que a maioria das pessoas consome transformação, mas poucos constroem legado. Unimos tecnologia, identidade e frequência para criar uma incubadora de essência — onde empresários, investidores e profissionais desenvolvem autoridade real a partir de quem eles realmente são. Não é mais uma plataforma. É o sistema operacional de quem decide parar de consumir e começar a construir.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão desta etapa: contar o arco que explica por que você faz o que faz hoje. Não é biografia completa.</p>
        <ul>
          <li>Quais 2-3 momentos decisivos moldaram sua identidade atual?</li>
          <li>O que você já tentou que não funcionou e o que isso te ensinou?</li>
          <li>Qual é a tensão central da sua história (o que te move)?</li>
        </ul>
      </div>
      <button class="btn" data-continue="historia">Salvar e Continuar</button>`;
  } else if (view === "valores") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Valores e crenças</h1>
      <p class="sub">Princípios que orientam decisões e padrões a observar.</p>
      <div class="field"><label>Valores centrais</label><textarea id="f-valores">${esc(data.valores)}</textarea></div>
      <div class="field"><label>Crenças e padrões</label><textarea id="f-crencas">${esc(data.crencas)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p><strong>Valores:</strong> Essência antes de estratégia. Frequência alinhada. Tecnologia a serviço da alma. Legado sobre crescimento vazio. Clareza sobre hype.</p>
        <p><strong>Crenças:</strong> Identidade mal mapeada gera posicionamento frágil. Autoridade verdadeira nasce da coerência entre o que se é e o que se comunica. Ferramentas digitais devem amplificar, não substituir, a essência.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão: listar o que é inegociável para você e os padrões que já percebeu em si.</p>
        <ul>
          <li>Quais 3-5 valores você realmente vive (não só declara)?</li>
          <li>Quais crenças antigas ainda influenciam suas decisões hoje?</li>
          <li>O que você recusa mesmo que seja lucrativo?</li>
        </ul>
      </div>
      <button class="btn" data-continue="valores">Salvar e Continuar</button>`;
  } else if (view === "posicionamento") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Posicionamento</h1>
      <p class="sub">Como você se apresenta, diferenciais e autoridade.</p>
      <div class="field"><label>Posicionamento e narrativa</label><textarea id="f-pos">${esc(data.posicionamento)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Não somos mais uma plataforma de cursos. Somos a Arquitetura de Legado: o sistema operacional de identidade, liderança e autoridade para quem constrói impérios conscientes. Unimos constelação, branding e tecnologia para expandir quem você é — não para vender mais cursos, mas para construir legado real.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão: definir como você quer ser reconhecido em uma frase clara.</p>
        <ul>
          <li>Se alguém perguntasse “o que você faz?”, qual seria a resposta em 1 frase?</li>
          <li>Qual é o diferencial que só você tem (mesmo que ainda não esteja óbvio)?</li>
          <li>Quem você não é (o que você recusa ser)?</li>
        </ul>
      </div>
      <button class="btn" data-continue="posicionamento">Salvar e Continuar</button>`;
  } else if (view === "proposito") {
    content.innerHTML = `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Propósito e direção</h1>
      <p class="sub">Direção clara e o que você está construindo.</p>
      <div class="field"><label>Propósito e próximos passos</label><textarea id="f-prop">${esc(data.proposito)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Ajudar pessoas de alto potencial a sair do consumo de transformação e entrar na construção de legado real — com identidade clara, comunicação precisa e tecnologia que sustenta. O próximo nível é consolidar a AF Plataforma como o sistema operacional de essência, autoridade e liderança para mentorandos e empresários conscientes.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão: conectar sua essência com a direção que você está construindo agora.</p>
        <ul>
          <li>O que você está construindo que só faz sentido se sua essência estiver clara?</li>
          <li>Qual é o próximo passo concreto depois deste dossiê?</li>
          <li>Como este propósito se conecta com o que você já mapeou acima?</li>
        </ul>
      </div>
      <button class="btn" data-continue="proposito">Salvar e Continuar</button>`;
  } else if (view === "dossie") {
    content.innerHTML = `
      <div class="eyebrow">Entregável · Nível Completo</div>
      <h1 class="title">Dossiê de Essência</h1>
      <p class="sub">Síntese do que foi mapeado. Use como base para branding, comunicação e liderança.</p>
      <div class="card"><h3>História</h3><p>${esc(data.historia) || "—"}</p></div>
      <div class="card"><h3>Valores</h3><p>${esc(data.valores) || "—"}</p></div>
      <div class="card"><h3>Crenças e padrões</h3><p>${esc(data.crencas) || "—"}</p></div>
      <div class="card"><h3>Posicionamento</h3><p>${esc(data.posicionamento) || "—"}</p></div>
      <div class="card"><h3>Propósito</h3><p>${esc(data.proposito) || "—"}</p></div>
      <p style="color:var(--muted);font-size:12px;margin-top:24px">Progresso: ${p}% · Dados salvos no Firestore sob seu UID.</p>
      <div class="guidance">
        <div class="eyebrow">Próximo nível</div>
        <p>Com este dossiê pronto, você tem a base para os próximos apps da Fase 01 (Identity Studio, Marketing Pessoal, Authority & Leadership). Use-o como referência viva.</p>
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
      const map = {'pos': 'posicionamento', 'prop': 'proposito'};
      if (key in map) key = map[key];
      if (key in data) data[key] = el.value;
    });
    saveData().then(() => setView(nextStep(step)));
  }
});

onAuthStateChanged(auth, user => {
  if (!user) {
    document.getElementById("content").innerHTML = `<div class="card"><h1>Acesso restrito</h1><p>Faça login na AF Plataforma para acessar a Essência.</p><a class="btn" href="/afplataforma/">Ir para login</a></div>`;
    return;
  }
  currentUser = user;
  document.getElementById("userPill").textContent = user.email || "Mentorando";
  document.getElementById("avatar").textContent = (user.email || "E")[0].toUpperCase();
  loadData(user.uid);
});
