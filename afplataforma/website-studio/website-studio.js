import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "afWebsiteStudio";
let currentUser = null;
let data = { proposito: "", estrutura: "", conteudo: "", visual: "", tecnico: "", plano: "" };
let view = "dashboard";

function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(window._t);
  window._t = setTimeout(() => el.classList.add("hidden"), 2800);
}

function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c])); }

async function loadData(uid) {
  try {
    const snap = await getDoc(doc(db, COL, uid));
    if (snap.exists()) data = { ...data, ...snap.data() };
  } catch (e) { console.warn("load", e); }
  render();
}

async function saveData() {
  if (!currentUser) {
    toast("Faça login na AF Plataforma para salvar.");
    return;
  }
  try {
    await setDoc(doc(db, COL, currentUser.uid), { ...data, updatedAt: serverTimestamp(), uid: currentUser.uid }, { merge: true });
    toast("Salvo com sucesso.");
  } catch (e) {
    toast("Erro ao salvar. Verifique o login.");
  }
  render();
}

function progress() {
  const fields = ["proposito", "estrutura", "conteudo", "visual", "tecnico", "plano"];
  const filled = fields.filter(f => (data[f] || "").trim().length > 15).length;
  return Math.round((filled / fields.length) * 100);
}

function nextStep(current) {
  const STEPS = ["proposito", "estrutura", "conteudo", "visual", "tecnico", "plano"];
  const i = STEPS.indexOf(current);
  return i === -1 || i === STEPS.length - 1 ? "dashboard" : STEPS[i + 1];
}
window.setView = setView;

function setView(v) {
  view = v;
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  const side = document.getElementById("sidebar");
  if (side) side.classList.remove("open");
  render();
}

function bindEvents() {
  const nav = document.getElementById("nav");
  if (nav) nav.addEventListener("click", e => {
    const b = e.target.closest("button[data-view]");
    if (b) setView(b.dataset.view);
  });
  const menu = document.getElementById("menuBtn");
  if (menu) menu.addEventListener("click", () => {
    const side = document.getElementById("sidebar");
    if (side) side.classList.toggle("open");
  });
  document.addEventListener("click", e => {
    const goto = e.target.closest("[data-goto]");
    if (goto) { setView(goto.dataset.goto); return; }
    const cont = e.target.closest("[data-continue]");
    if (cont) {
      document.querySelectorAll("textarea[id^='f-']").forEach(el => {
        const key = el.id.slice(2);
        if (key in data) data[key] = el.value;
      });
      saveData().then(() => setView(nextStep(cont.dataset.continue)));
    }
  });
}

function render() {
  const p = progress();
  const content = document.getElementById("content");
  if (!content) return;
  const crumb = document.getElementById("breadcrumb");
  if (crumb) crumb.textContent = "WEBSITE STUDIO / " + view.toUpperCase().replace("-", " ");

  const loginNotice = !currentUser ? `<div class="card" style="border-color:#d6b45d66"><p><strong>Login necessário para salvar.</strong> Você pode navegar e preencher agora. <a class="btn" href="/afplataforma/" style="margin-left:8px">Fazer login</a></p></div>` : "";

  if (view === "dashboard") {
    content.innerHTML = loginNotice + `
      <div class="eyebrow">Império Digital · Fase 02</div>
      <h1 class="title">Website Studio</h1>
      <p class="sub">Planeje e estruture um site que posiciona sua essência e converte com clareza. Não é layout genérico — é ativo digital alinhado ao legado.</p>
      <div class="card">
        <div>Progresso do plano</div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <strong>${p}% estruturado</strong>
      </div>
      <div class="card">
        <h3>Próximo passo</h3>
        <p>${p < 100 ? "Comece pelo propósito do site." : "Plano completo. Use como brief para construção ou briefing com equipe."}</p>
        <button class="btn" data-goto="proposito">Começar pelo Propósito</button>
      </div>
      <div class="guidance">
        <div class="eyebrow">Como usar</div>
        <p>Cada etapa tem exemplo da Akasha Hub + orientação. Use como espelho, não como cópia.</p>
      </div>`;
  } else if (view === "proposito") {
    content.innerHTML = loginNotice + `
      <div class="eyebrow">Módulo · Missão 1</div>
      <h1 class="title">Propósito do site</h1>
      <p class="sub">Qual é a função principal deste site no seu império digital?</p>
      <div class="field"><label>Propósito e objetivo principal</label><textarea id="f-proposito">${esc(data.proposito)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>O site da Akasha Hub não vende cursos. Ele posiciona a Arquitetura de Legado como sistema operacional de essência e autoridade. Objetivo: atrair mentorandos de alto potencial, comunicar a frequência da marca e servir como porta de entrada para a AF Plataforma.</p>
      </div>
      <div class="guidance">
        <div class="eyebrow">Orientação · Mapa mental</div>
        <p>Missão: definir em 1-2 frases o que o site precisa fazer por você.</p>
        <ul>
          <li>Ele posiciona, capta, educa ou vende?</li>
          <li>Quem deve chegar aqui e o que deve sentir?</li>
          <li>Qual ação principal o visitante deve tomar?</li>
        </ul>
      </div>
      <button class="btn" data-continue="proposito">Salvar e Continuar</button>`;
  } else if (view === "estrutura") {
    content.innerHTML = loginNotice + `
      <div class="eyebrow">Módulo · Missão 2</div>
      <h1 class="title">Estrutura e páginas</h1>
      <p class="sub">Quais páginas e seções o site precisa ter?</p>
      <div class="field"><label>Estrutura proposta</label><textarea id="f-estrutura">${esc(data.estrutura)}</textarea></div>
      <div class="example">
        <div class="eyebrow">Exemplo Akasha Hub</div>
        <p>Home (posicionamento + frequência), Sobre (essência e legado), AF Plataforma (acesso às fases), Mentoria, Conteúdos, Contato. Cada página tem um objetivo claro e direciona para o próximo passo.</p>
      </div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Liste as páginas essenciais e o objetivo de cada uma. Menos é mais.</p></div>
      <button class="btn" data-continue="estrutura">Salvar e Continuar</button>`;
  } else if (view === "conteudo") {
    content.innerHTML = loginNotice + `
      <div class="eyebrow">Módulo · Missão 3</div>
      <h1 class="title">Conteúdo e narrativa</h1>
      <p class="sub">O que o site precisa comunicar para posicionar sua essência?</p>
      <div class="field"><label>Narrativa e mensagens-chave</label><textarea id="f-conteudo">${esc(data.conteudo)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Mensagem central: “Não consuma transformação. Construa legado.” Tom: direto, sofisticado, sem hype. Cada página reforça identidade, autoridade e o caminho da AF Plataforma.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Defina a mensagem principal e o tom. Conecte com o Dossiê de Essência da Fase 01.</p></div>
      <button class="btn" data-continue="conteudo">Salvar e Continuar</button>`;
  } else if (view === "visual") {
    content.innerHTML = loginNotice + `
      <div class="eyebrow">Módulo · Missão 4</div>
      <h1 class="title">Identidade visual</h1>
      <p class="sub">Como o site deve parecer e sentir?</p>
      <div class="field"><label>Diretrizes visuais</label><textarea id="f-visual">${esc(data.visual)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Luxo silencioso. Dourado e violeta. Tipografia serifada para títulos, sans-serif para corpo. Espaço em branco generoso. Nada de excesso visual. O design serve a essência, não a distração.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Descreva cores, tipografia, sensação e o que deve ser evitado.</p></div>
      <button class="btn" data-continue="visual">Salvar e Continuar</button>`;
  } else if (view === "tecnico") {
    content.innerHTML = loginNotice + `
      <div class="eyebrow">Módulo · Missão 5</div>
      <h1 class="title">Aspectos técnicos</h1>
      <p class="sub">Plataforma, integrações e requisitos.</p>
      <div class="field"><label>Decisões técnicas</label><textarea id="f-tecnico">${esc(data.tecnico)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>Site estático de alta performance + integração com AF Plataforma (Firebase Auth). Hospedagem rápida, formulários que alimentam o CRM, e acesso direto às ferramentas internas.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Defina plataforma (Webflow, custom, etc.), integrações necessárias e o que é prioridade.</p></div>
      <button class="btn" data-continue="tecnico">Salvar e Continuar</button>`;
  } else if (view === "plano") {
    content.innerHTML = loginNotice + `
      <div class="eyebrow">Módulo · Missão 6</div>
      <h1 class="title">Plano de construção</h1>
      <p class="sub">Próximos passos concretos para tirar o site do papel.</p>
      <div class="field"><label>Cronograma e ações</label><textarea id="f-plano">${esc(data.plano)}</textarea></div>
      <div class="example"><div class="eyebrow">Exemplo Akasha Hub</div><p>1. Brief consolidado a partir deste studio. 2. Wireframes das páginas principais. 3. Design system alinhado à identidade. 4. Desenvolvimento. 5. Integração com AF Plataforma. 6. Lançamento e medição.</p></div>
      <div class="guidance"><div class="eyebrow">Orientação</div><p>Liste as próximas 3-5 ações reais. Quem faz o quê e até quando.</p></div>
      <button class="btn" data-continue="plano">Salvar e Finalizar</button>`;
  }
}

// Render imediato (não espera auth)
bindEvents();
render();

onAuthStateChanged(auth, user => {
  currentUser = user || null;
  if (user) {
    const pill = document.getElementById("userPill");
    const av = document.getElementById("avatar");
    if (pill) pill.textContent = user.email || "Mentorando";
    if (av) av.textContent = (user.email || "W")[0].toUpperCase();
    loadData(user.uid);
  } else {
    render();
  }
});
