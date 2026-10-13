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
    <p class="notes-hint">O roteiro original continua em Sessões. Esta fase não cria outro. A mesa ao lado fecha o que o roteiro antigo ainda não separava: fato, leitura, dinheiro e a matéria do império.</p>
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
    id: "pe",
    titulo: "O que já está de pé",
    texto: "Não invente um produto. Olhe o que a pessoa já faz.",
    perguntas: [
      "O que você já faz e alguém já pagou, mesmo sem nome de produto?",
      "O que você explica toda vez porque ainda não tem uma frase?",
      "O que não pode sair do trabalho, senão deixa de ser você?"
    ],
    fecha: "Uma frase do que já existe."
  },
  {
    id: "historia",
    titulo: "História, sem sentença",
    texto: "Fato é o que aconteceu. Leitura é o que a pessoa concluiu. Decisão é o que os dois fecham.",
    perguntas: [
      "Conte um fato da sua história que o trabalho precisa carregar. Só o fato.",
      "O que você concluiu desse fato, e que pode ser só uma leitura sua?",
      "Qual decisão você toma a partir disso, e qual ainda não toma?"
    ],
    fecha: "Fato, leitura e decisão, em três linhas."
  },
  {
    id: "familia",
    titulo: "Família",
    texto: "A linhagem entra como matéria. Não entra como desculpa.",
    perguntas: [
      "Qual talento da mãe, do pai ou de um avô você honra no trabalho?",
      "Qual padrão de luta você encerra e não leva para a marca?",
      "O que a família proibiu você de ser, e o que disso ainda manda na sua voz?"
    ],
    fecha: "Honro isto. Encerro isto."
  },
  {
    id: "padrao",
    titulo: "O padrão que cobra",
    texto: "O mesmo padrão aparece na cobrança, na liderança e na venda.",
    perguntas: [
      "Quando você cobra, qual voz antiga entra?",
      "Você se vê merecedor de ser pago pelo que já faz? O que sustenta essa resposta?",
      "O que você criou e nunca mostrou, e o que teme que digam?"
    ],
    fecha: "O padrão. A permissão."
  },
  {
    id: "dinheiro",
    titulo: "Leitura de dinheiro",
    texto: "Nesta fase é leitura, não plano. O plano mora no Alinhamento Financeiro.",
    perguntas: [
      "O que entra por mês, em uma frase, sem planilha?",
      "O que vaza e você já sabe o nome?",
      "O que é essencial para o trabalho continuar, e o que é gosto?"
    ],
    fecha: "A leitura, em uma frase."
  },
  {
    id: "cie",
    titulo: "CIE",
    texto: "A sigla ainda não tem definição nos arquivos desta casa. Não invente o significado. Escreva só o que vocês dois chamam assim. Se ainda não tem nome, deixe em branco.",
    perguntas: [
      "Se CIE já nomeia alguma coisa para você, o que é?",
      "O que no seu trabalho ainda está sem nome e precisa de um?",
      "O que não entra nesse nome?"
    ],
    fecha: "A definição usada aqui, ou: ainda sem nome."
  },
  {
    id: "frase",
    titulo: "A frase e o limite",
    texto: "Outra pessoa tem que conseguir repetir. Se só você entende, ainda não é direção.",
    perguntas: [
      "Qual frase outra pessoa consegue repetir sobre o seu trabalho?",
      "Para quem isso é, em uma pessoa real?",
      "Para quem isso não é?"
    ],
    fecha: "Frase. Para quem. Limite."
  },
  {
    id: "imperio",
    titulo: "O que o império pode carregar",
    texto: "A essência não vira site nesta mesa. Ela decide a matéria que o império digital vai poder usar.",
    perguntas: [
      "Qual matéria da essência vira oferta, sem inventar um produto do zero?",
      "O que espera a casa digital, o nome e o primeiro ativo?",
      "Qual é a próxima decisão, já escrita, antes de sair desta fase?"
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
    "Oito estações para tirar a essência da pessoa e entregar matéria ao império digital. O roteiro de 26 encontros continua em Sessões. Esta mesa não apaga aquele caderno.",
    `<p><button class="tool-btn" type="button" data-nav="fase1">← Fase 1</button></p>
    ${corpo}
    <div class="row">
      <button class="tool-btn" type="button" id="mesaSalvar">Guardar neste aparelho</button>
      <button class="tool-btn" type="button" id="mesaCopiar">Copiar as respostas</button>
    </div>
    <p class="notes-hint" id="mesaAviso">As respostas ficam neste navegador. O dossiê, com relato, hipótese e decisão, o mentor preenche na gestão.</p>`
  );
}

const MESA_KEY = "afMesaEssenciaV1";

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
