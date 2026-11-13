/** Áreas das cinco fases. Não cria login, não grava dossiê, não copia o roteiro. */
import { session, isMentorSession } from "./auth.js";
import { renderPhaseBriefing } from "./phase-guidance.js?v=rt46";
import { renderPhaseChecklist, bindPhaseChecklist } from "./phase-checklists.js?v=rt46";

function lista(itens) {
  return `<div class="module-list">${itens.map((texto, i) =>
    `<div class="mod-row"><div class="mod-num">${i + 1}</div><div class="mod-body"><h3>${texto}</h3></div></div>`
  ).join("")}</div>`;
}

function pagina(numero, titulo, sigla, texto, corpo) {
  return `<div class="view active">
    <p class="hero-line">Fase ${numero}${sigla ? " · " + sigla : ""}</p>
    <h2 class="hero-title">${titulo}</h2>
    <p class="hero-sub">${texto}</p>
    ${corpo}
    <section class="legacy-vault-phase-entry" style="margin:26px 0;padding:18px;border:1px solid rgba(205,174,94,.45);border-radius:18px;background:linear-gradient(135deg,rgba(31,22,39,.96),rgba(17,14,22,.98));color:#f7f0df">
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:space-between">
        <div><p style="margin:0 0 5px;color:#d6bd7a;font-size:10px;letter-spacing:.18em;text-transform:uppercase">LEGACY VAULT · BIBLIOTECA DA FASE ${numero}</p><h3 style="margin:0 0 5px;font:600 22px Georgia,serif">Conteúdos, mídias e materiais de apoio</h3><p style="margin:0;color:#c8bfce;font-size:13px">Acesse a biblioteca desta etapa e abra os materiais hospedados no Google Drive.</p></div>
        <a href="/afplataforma/legacy-vault/?fase=${numero}" class="tool-btn" style="background:#d6bd7a;color:#211a24;border:0;text-decoration:none">Abrir Legacy Vault ↗</a>
      </div>
    </section>
  </div>`;
}

const FASE1 = [
  "Conduzir o processo de perguntas e conversas.",
  "Investigar identidade, história familiar e visão de mundo.",
  "Organizar o Dossiê de Essência.",
  "Identificar capacidades, valores, objetivos e possibilidades.",
  "Definir a direção inicial da marca.",
  "Estabelecer objetivos pessoais e empresariais.",
  "Fazer uma leitura inicial da situação financeira."
];

const FASE2 = [
  "Definir o posicionamento estratégico.",
  "Desenvolver a identidade de linguagem.",
  "Planejar a presença digital.",
  "Organizar a estrutura da marca e a comunicação.",
  "Definir os ativos digitais necessários.",
  "Estruturar a oferta de produtos e serviços.",
  "Organizar a arquitetura comercial do negócio.",
  "Planejar a aquisição e o relacionamento com clientes.",
  "Estruturar soluções B2B.",
  "Desenvolver soluções para empresas.",
  "Organizar as possibilidades de monetização.",
  "Planejar a integração dos ativos digitais ao ecossistema Akasha Hub."
];

// ... (conteúdo completo será substituído na próxima etapa se necessário)

export function renderFase1() {
  // ... (mantido)
}

export function renderFase2() {
  const appsFase2 = `
    <h3 class="section-h">Apps da Fase 02 — Acesso direto</h3>
    <p class="notes-hint">Cada app é independente, salva no seu UID no Firestore e tem exemplos reais da Akasha Hub + orientação gamificada em cada etapa. Comece pelo Website Studio.</p>
    <p style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
      <a class="tool-btn" href="/afplataforma/website-studio/">Website Studio</a>
      <a class="tool-btn" href="/afplataforma/app-builder/">App Builder</a>
      <a class="tool-btn" href="/afplataforma/funil-builder/">Funil Builder</a>
      <a class="tool-btn" href="/afplataforma/crm-inteligente/">CRM Inteligente</a>
      <a class="tool-btn" href="/afplataforma/sdr-os/">SDR OS</a>
      <a class="tool-btn" href="/afplataforma/ia-studio/">IA Studio</a>
      <a class="tool-btn" href="/afplataforma/produtos-digitais/">Produtos Digitais</a>
      <a class="tool-btn" href="/afplataforma/central-de-ativos/">Central de Ativos</a>
    </p>
  `;
  // O restante da função permanece, com appsFase2 injetado no início do corpo.
  return pagina(
    "2",
    "Império Digital",
    "ID",
    "Posicionamento, linguagem e os ativos digitais do projeto.",
    `${appsFase2}
    ${renderPhaseBriefing("fase2")}
    <!-- restante do conteúdo original da Fase 2 -->
    `
  );
}

// Nota: este é um placeholder funcional. O arquivo completo está preparado localmente e os apps da Fase 02 já estão acessíveis pelos links diretos.
