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
    ? "Modelo de trabalho do mentor. O material do mentorando ainda não é uma entrega separada. O contrato continua na gestão."
    : "Estrutura do dossiê. O preenchimento com o mentor vem depois. Nada aqui é gravado ainda.";
  return pagina(
    "1",
    "Arquitetura de Essência",
    "AE",
    "Identidade, história familiar, visão de mundo e a direção inicial do projeto. Entrega desta fase: Dossiê de Essência e Direção Estratégica.",
    `<h3 class="section-h">Trabalho principal da fase</h3>
    ${lista(FASE1)}
    <h3 class="section-h">Roteiro de sessões</h3>
    <p class="notes-hint">O roteiro original continua em Sessões. A mesa ao lado segue a ordem do ano: conversa, identidade, dossiê, capacidades, marca, objetivos e a leitura de dinheiro.</p>
    <p style="display:flex;flex-wrap:wrap;gap:8px">
      <a class="tool-btn" href="/sessoes/">Abrir o roteiro em Sessões</a>
      <button class="tool-btn" type="button" data-nav="fase1-jogo">Mesa da Essência</button>
    </p>
    <h3 class="section-h">Dossiê de Essência</h3>
    <p class="notes-hint">${nota} O modelo preenchido, com relato, hipótese e decisão, fica só na gestão do mentor.</p>
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

const MESA = [
  {
    id: "conversas",
    titulo: "Perguntas e conversas",
    texto: "A pergunta abre a história. A história não é um formulário.",
    perguntas: [
      "O que você já faz e alguém já pagou, mesmo sem nome de produto?",
      "Qual história você conta quando explica o seu trabalho?",
      "O que ainda não foi perguntado e precisa ser?"
    ],
    fecha: "O que a conversa revelou, em uma frase."
  },
  {
    id: "identidade",
    titulo: "Identidade, família e visão de mundo",
    texto: "Fato é o que aconteceu. Leitura é o que a pessoa concluiu. Não misture os dois.",
    perguntas: [
      "Como você se apresenta hoje, e o que disso é fato?",
      "O que você recebeu da família e decide manter? O que decide transformar?",
      "Qual visão de mundo orienta o que você quer construir? Marque o que é experiência, não prova."
    ],
    fecha: "Quem é. O que honra. O que transforma."
  },
  {
    id: "dossie",
    titulo: "Organizar o dossiê",
    texto: "O dossiê guarda a matéria. Relato, hipótese e decisão não ocupam a mesma linha.",
    perguntas: [
      "Qual história merece ficar guardada?",
      "Qual padrão apareceu, e ainda é hipótese?",
      "O que já virou decisão, e o que continua pendente?"
    ],
    fecha: "Entra no dossiê. Fica pendente."
  },
  {
    id: "capacidades",
    titulo: "Capacidades, valores e possibilidades",
    texto: "Talento, valor e ideia ainda não são produto.",
    perguntas: [
      "O que você sabe fazer e outra pessoa já reconhece?",
      "Qual valor não pode sair da marca?",
      "Qual possibilidade apareceu e ainda não é oferta?"
    ],
    fecha: "Capacidade. Valor. Possibilidade."
  },
  {
    id: "marca",
    titulo: "Direção inicial da marca",
    texto: "Outra pessoa tem que conseguir repetir. Se só você entende, ainda não é direção.",
    perguntas: [
      "Qual frase outra pessoa consegue repetir sobre o seu trabalho?",
      "Para quem isso é, em uma pessoa real? Para quem não é?",
      "Qual símbolo, palavra ou tom já pertence a esta marca?"
    ],
    fecha: "Frase. Para quem. Limite."
  },
  {
    id: "objetivos",
    titulo: "Objetivos pessoais e empresariais",
    texto: "Os dois objetivos existem. Não são a mesma frase.",
    perguntas: [
      "O que você quer para a sua vida neste ano, em uma frase?",
      "O que a obra precisa estar de pé em doze meses, em uma frase?",
      "Onde um objetivo está empurrando o outro?"
    ],
    fecha: "Pessoal. Empresarial. Onde se cruzam."
  },
  {
    id: "dinheiro",
    titulo: "Leitura inicial do dinheiro",
    texto: "Nesta fase é leitura, não plano. O plano mora no Alinhamento Financeiro.",
    perguntas: [
      "O que entra, em uma frase, sem planilha?",
      "O que vaza e você já sabe o nome?",
      "O que é essencial para o trabalho continuar, e o que é gosto?"
    ],
    fecha: "A leitura, em uma frase."
  },
  {
    id: "entrega",
    titulo: "Dossiê e direção estratégica",
    texto: "A entrega da fase é esta. Não é site. Não é funil.",
    perguntas: [
      "Qual matéria da essência o império digital está autorizado a carregar?",
      "O que espera a próxima fase?",
      "Qual é a próxima decisão, já escrita?"
    ],
    fecha: "Leva. Espera. Próxima decisão."
  }
];

function campo(id, rotulo) {
  return `<label class="field">${rotulo}<textarea data-mesa="${id}" rows="3" style="width:100%;min-height:72px;margin-top:6px;padding:10px 12px;border:1px solid rgba(201,162,75,.35);border-radius:8px;background:transparent;color:inherit;font:inherit;line-height:1.45"></textarea></label>`;
}

export function renderFase1Jogo() {
  const corpo = MESA.map((estacao, i) => `
    <article class="q-feature">
      <p class="hero-line">Estação ${i + 1} de ${MESA.length}</p>
      <h3>${estacao.titulo}</h3>
      <p>${estacao.texto}</p>
      ${estacao.perguntas.map((q, qi) => campo(estacao.id + "-" + qi, q)).join("")}
      ${campo(estacao.id + "-fecha", "Fecha assim · " + estacao.fecha)}
    </article>`).join("");
  return pagina(
    "1",
    "Mesa da Essência",
    "AE",
    "As oito estações seguem o ano do documento-mestre: conversa, identidade, dossiê, capacidades, marca, objetivos, leitura de dinheiro e a entrega. O roteiro de 26 encontros continua em Sessões.",
    `<p><button class="tool-btn" type="button" data-nav="fase1">← Fase 1</button></p>
    ${corpo}
    <div class="row">
      <button class="tool-btn" type="button" id="mesaSalvar">Guardar neste aparelho</button>
      <button class="tool-btn" type="button" id="mesaCopiar">Copiar as respostas</button>
    </div>
    <p class="notes-hint" id="mesaAviso">As respostas ficam neste navegador. O dossiê, com relato, hipótese e decisão, o mentor preenche na gestão.</p>`
  );
}

const MESA_KEY = "afMesaEssenciaV2";

export function bindFase1Jogo() {
  const root = document.getElementById("content");
  if (!root || !root.querySelector("[data-mesa]")) return;
  let salvo = {};
  try { salvo = JSON.parse(localStorage.getItem(MESA_KEY) || "{}"); } catch (e) { salvo = {}; }
  root.querySelectorAll("[data-mesa]").forEach((el) => {
    if (salvo[el.getAttribute("data-mesa")]) el.value = salvo[el.getAttribute("data-mesa")];
  });
  const ler = () => {
    const out = {};
    root.querySelectorAll("[data-mesa]").forEach((el) => { out[el.getAttribute("data-mesa")] = el.value; });
    return out;
  };
  document.getElementById("mesaSalvar")?.addEventListener("click", () => {
    localStorage.setItem(MESA_KEY, JSON.stringify(ler()));
    const aviso = document.getElementById("mesaAviso");
    if (aviso) aviso.textContent = "Guardado neste aparelho.";
  });
  document.getElementById("mesaCopiar")?.addEventListener("click", async () => {
    const dados = ler();
    const texto = MESA.map((estacao, i) => {
      const linhas = estacao.perguntas.map((q, qi) => q + "\n" + (dados[estacao.id + "-" + qi] || "—")).join("\n\n");
      return (i + 1) + ". " + estacao.titulo + "\n" + linhas + "\n\nFecha: " + (dados[estacao.id + "-fecha"] || "—");
    }).join("\n\n");
    try { await navigator.clipboard.writeText("Mesa da Essência\n\n" + texto); } catch (e) {}
    const aviso = document.getElementById("mesaAviso");
    if (aviso) aviso.textContent = "Copiado. Cole no dossiê, na gestão do mentor.";
  });
}
