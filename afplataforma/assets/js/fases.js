/** Áreas das cinco fases. Não cria login, não grava dossiê, não copia o roteiro. */
import { isMentorSession } from "./auth.js";

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
  </div>`;
}

const FASE1 = [
  "Conduzir os processos de sessões e a investigação da essência.",
  "Investigar identidade, história familiar e visão de mundo.",
  "Organizar o CIE. A definição da sigla não está nos arquivos desta casa.",
  "Identificar padrões, referências e elementos da história pessoal.",
  "Definir a direção inicial da marca.",
  "Estabelecer objetivos pessoais e empresariais.",
  "Fazer uma leitura inicial da situação financeira.",
  "Organizar o que entra no dossiê de essência.",
  "Definir a direção estratégica inicial.",
  "Preparar as entregas de referência desta fase."
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
  "Preparar a operação para crescer com mais organização."
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
  "Ligar a comunidade às outras fases."
];

const DOSSIE = [
  "Identidade",
  "História familiar",
  "Visão de mundo",
  "Referências pessoais",
  "Padrões identificados",
  "Direção inicial da marca",
  "Objetivos pessoais",
  "Objetivos empresariais",
  "Síntese estratégica",
  "Referências e entregas da fase"
];

export function renderFase1() {
  const nota = isMentorSession()
    ? "Modelo de trabalho do mentor. O material do mentorando ainda não é uma entrega separada. O contrato continua na gestão."
    : "Estrutura do dossiê. O preenchimento com o mentor vem depois. Nada aqui é gravado ainda.";
  return pagina(
    "1",
    "Arquitetura de Essência",
    "AE",
    "Identidade, história familiar, visão de mundo e a direção inicial do projeto.",
    `<h3 class="section-h">Trabalho principal da fase</h3>
    ${lista(FASE1)}
    <h3 class="section-h">Roteiro de sessões</h3>
    <p class="notes-hint">O roteiro original continua em Sessões. Esta fase não cria outro.</p>
    <p><a class="tool-btn" href="/sessoes/">Abrir o roteiro em Sessões</a></p>
    <h3 class="section-h">Dossiê de Essência</h3>
    <p class="notes-hint">${nota}</p>
    ${lista(DOSSIE)}`
  );
}

export function renderFase2() {
  return pagina(
    "2",
    "Império Digital",
    "ID",
    "Posicionamento, linguagem, ativos digitais e a estrutura de negócios do projeto.",
    `<h3 class="section-h">Trabalho principal da fase</h3>${lista(FASE2)}`
  );
}

export function renderFase3() {
  const recursos = [
    ["modules", "Módulos"],
    ["tools", "Ferramentas"],
    ["call", "Call"],
    ["complementar", "Complementar"],
    ["quitei", "Quitei"],
    ["criancas", "Crianças"],
    ["empresas", "Empresas"]
  ];
  return pagina(
    "3",
    "Alinhamento Financeiro",
    "AF",
    "Consolidação comercial e financeira. As ferramentas de sempre continuam aqui, sem cópia.",
    `<h3 class="section-h">Trabalho principal da fase</h3>
    ${lista(FASE3)}
    <h3 class="section-h">Ferramentas e recursos do AF</h3>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${recursos.map(([id, nome]) => `<button class="tool-btn" type="button" data-nav="${id}">${nome}</button>`).join("")}
    </div>`
  );
}

export function renderFase4() {
  return pagina(
    "4",
    "Expansão e Estruturação Operacional",
    "",
    "A operação fica mais organizada e menos dependente do fundador em cada passo.",
    `<h3 class="section-h">Trabalho principal da fase</h3>${lista(FASE4)}`
  );
}

export function renderFase5() {
  return pagina(
    "5",
    "Comunidade, Doutrina e Continuidade",
    "CDC",
    "Comunidade, transmissão da metodologia e o que permanece depois do ciclo.",
    `<h3 class="section-h">Trabalho principal da fase</h3>${lista(FASE5)}`
  );
}
