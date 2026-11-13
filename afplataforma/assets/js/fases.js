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

const FASE3 = [
  "Sustentar o projeto por meio de decisões financeiras e comerciais.",
  "Organizar o fluxo de caixa.",
  "Acompanhar indicadores financeiros.",
  "Estruturar a precificação.",
  "Definir metas financeiras e comerciais.",
  "Revisar receitas, despesas e custos.",
  "Organizar o planejamento financeiro.",
  "Avaliar a sustentabilidade econômica das ofertas.",
  "Organizar as decisões comerciais da consolidação.",
  "Acompanhar os resultados e revisar a estratégia."
];

const FASE4 = [
  "Identificar o que depende diretamente do fundador.",
  "Organizar os processos operacionais.",
  "Estruturar responsabilidades e funções.",
  "Identificar o que pode ser padronizado.",
  "Documentar processos e procedimentos.",
  "Organizar fluxos de trabalho.",
  "Definir como a operação é acompanhada.",
  "Estruturar a distribuição de responsabilidades.",
  "Melhorar a previsibilidade operacional.",
  "Preparar a operação para crescer com mais organização.",
  "Definir onde o projeto aparece.",
  "Organizar o que se publica nesta semana.",
  "Separar divulgação orgânica e tráfego pago.",
  "Olhar o que foi publicado, não o que foi prometido."
];

const FASE5 = [
  "Estruturar a comunidade.",
  "Organizar a transmissão da metodologia.",
  "Sistematizar os princípios do ecossistema.",
  "Estruturar mecanismos de continuidade.",
  "Organizar o relacionamento de longo prazo.",
  "Criar uma estrutura para preservar e transmitir o que foi desenvolvido.",
  "Organizar a participação contínua no ecossistema.",
  "Planejar a evolução da comunidade.",
  "Estabelecer o acompanhamento da continuidade.",
  "Ligar a comunidade às outras fases.",
  "Escrever o que continua funcionando sem o fundador na sala.",
  "Ler o negócio como quem compra ou como quem vende.",
  "Nomear a comunidade, o movimento e a doutrina."
];

const DOSSIE = [
  "História e contexto",
  "Perguntas e respostas",
  "Narrativas importantes",
  "Padrões identificados",
  "Valores e símbolos",
  "Talentos e capacidades",
  "Ideias e possibilidades",
  "Decisões tomadas",
  "Pendências",
  "Aplicações práticas"
];

export function renderFase1() {
  const nota = isMentorSession()
    ? "O dossiê preenchido fica na gestão do mentor. O contrato também."
    : "Estrutura do dossiê. O preenchimento com o mentor vem depois. Nada aqui é gravado ainda.";
  return pagina(
    "1",
    "Arquitetura de Essência",
    "AE",
    "Identidade, história familiar, visão de mundo e a direção inicial do projeto. Constelação e registro entram como leitura, não como prova. Entrega desta fase: Dossiê de Essência e Direção Estratégica.",
    `${renderPhaseBriefing("fase1")}
    <h3 class="section-h">Trabalho principal da fase</h3>
    ${lista(FASE1)}
    <h3 class="section-h">Apps da Fase 01 — Acesso direto</h3>
    <p class="notes-hint">Cada app é independente, salva no seu UID no Firestore e tem exemplos reais da Akasha Hub + orientação gamificada em cada etapa. Comece pelo Essência OS.</p>
    <p style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
      <a class="tool-btn" href="/afplataforma/essencia/">Essência OS</a>
      <a class="tool-btn" href="/afplataforma/identity-studio/">Identity Studio</a>
      <a class="tool-btn" href="/afplataforma/marketing-pessoal/">Marketing Pessoal OS</a>
      <a class="tool-btn" href="/afplataforma/branding-pessoal/">Branding Pessoal</a>
      <a class="tool-btn" href="/afplataforma/constelacao-familiar/">Constelação Familiar</a>
      <a class="tool-btn" href="/afplataforma/registros-akashicos/">Registros Akáshicos</a>
      <a class="tool-btn" href="/afplataforma/lideranca/">Liderança</a>
      <a class="tool-btn" href="/afplataforma/comunicacao/">Comunicação</a>
      <a class="tool-btn" href="/afplataforma/authority-leadership-os/">Authority & Leadership OS</a>
    </p>
    <h3 class="section-h">Roteiro de sessões</h3>
    <p class="notes-hint">O roteiro original continua em Sessões. A mesa ao lado segue a ordem do ano: conversa, identidade, dossiê, capacidades, marca, objetivos e a leitura de dinheiro.</p>
    <p style="display:flex;flex-wrap:wrap;gap:8px">
      <a class="tool-btn" href="/sessoes/">Abrir o roteiro em Sessões</a>
      <button class="tool-btn" type="button" data-nav="fase1-jogo">Mesa da Essência</button>
      <button class="tool-btn" type="button" data-nav="fase1-marca">Formulário de Marca / Identidade</button>
    </p>
    <h3 class="section-h">Dossiê de Essência</h3>
    <p class="notes-hint">${nota} O modelo preenchido, com relato, hipótese e decisão, fica só na gestão do mentor.</p>
    ${lista(DOSSIE)}
    <h3 class="section-h">Ferramentas desta fase</h3>
    <p style="display:flex;flex-wrap:wrap;gap:8px">
      <button class="tool-btn" type="button" data-nav="fase1-dossie">Dossiê vivo</button>
      <button class="tool-btn" type="button" data-tool="vision">Visão 1 página</button>
      <button class="tool-btn" type="button" data-tool="ideation">Ideação / Insights</button>
    </p>
    <p class="notes-hint">Visão e ideação continuam também em Ferramentas. Aqui elas servem a essência. O dossiê separa fato, hipótese e decisão.</p>
    ${renderPhaseChecklist("fase1")}`
  );
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
  const trabalho = FASE2.map((texto, i) => `
    <div class="mod-row">
      <div class="mod-num">${i + 1}</div>
      <div class="mod-body"><h3>${texto}</h3></div>
    </div>`).join("");
  return pagina(
    "2",
    "Império Digital",
    "ID",
    "Posicionamento, linguagem e os ativos digitais do projeto.",
    `${appsFase2}
    ${renderPhaseBriefing("fase2")}
    <h3 class="section-h">Trabalho principal da fase</h3>
    <div class="module-list">${trabalho}</div>
    ${renderPhaseChecklist("fase2")}`
  );
}

export function renderFase3() {
  return pagina("3", "Alinhamento Financeiro", "AF", "Organização e capital.", `${renderPhaseBriefing("fase3")}<h3 class="section-h">Trabalho principal</h3>${lista(FASE3)}${renderPhaseChecklist("fase3")}`);
}
export function renderFase4() {
  return pagina("4", "Expansão", "EX", "Escala e oportunidades.", `${renderPhaseBriefing("fase4")}<h3 class="section-h">Trabalho principal</h3>${lista(FASE4)}${renderPhaseChecklist("fase4")}`);
}
export function renderFase5() {
  return pagina("5", "Legado", "LG", "Patrimônio e continuidade.", `${renderPhaseBriefing("fase5")}<h3 class="section-h">Trabalho principal</h3>${lista(FASE5)}${renderPhaseChecklist("fase5")}`);
}

// Stubs para as funções que o app.js espera (evita quebrar o login)
export function renderFase1Jogo() { return pagina("1", "Mesa da Essência", "", "", "<p>Mesa da Essência.</p>"); }
export function bindFase1Jogo() {}
export function renderFase1Marca() { return pagina("1", "Marca", "", "", "<p>Formulário de Marca.</p>"); }
export function bindFase1Marca() {}
export function renderFase1Dossie() { return pagina("1", "Dossiê", "", "", "<p>Dossiê vivo.</p>"); }
export function bindFase1Dossie() {}
export function renderFase2Oferta() { return pagina("2", "Oferta", "", "", "<p>Construtor de oferta.</p>"); }
export function bindFase2Oferta() {}
export function renderFase2Ativos() { return pagina("2", "Ativos", "", "", "<p>Diagnóstico de ativos.</p>"); }
export function bindFase2Ativos() {}
export function renderFase3Preco() { return pagina("3", "Preço", "", "", "<p>Precificação.</p>"); }
export function bindFase3Preco() {}
export function renderFase4Sdr() { return pagina("4", "SDR", "", "", "<p>SDR.</p>"); }
export function renderFase4Treinamento() { return pagina("4", "Treinamento", "", "", "<p>Treinamento.</p>"); }
export function renderFase4Closers() { return pagina("4", "Closers", "", "", "<p>Closers.</p>"); }
export function renderFase4Depende() { return pagina("4", "Depende", "", "", "<p>O que depende do fundador.</p>"); }
export function bindFase4Depende() {}
export function renderFase4Divulga() { return pagina("4", "Divulga", "", "", "<p>Divulgação.</p>"); }
export function bindFase4Divulga() {}
export function renderFase5Livro() { return pagina("5", "Livro", "", "", "<p>Livro do método.</p>"); }
export function bindFase5Livro() {}
