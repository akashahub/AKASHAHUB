/** Fases do Legado, no mesmo visual da AF. A AF em si não mora aqui. */
import { isMentorSession } from "./auth.js";

const ENCONTROS = [
  [1, "essencia", "O Portal de Entrada", "Abertura e o primeiro olhar sobre quem você é hoje."],
  [2, "essencia", "Raízes e Linhagem", "O talento que corre na família."],
  [3, "essencia", "A Árvore Genealógica do Dom", "Padrões e forças que você escolhe honrar ou encerrar."],
  [4, "essencia", "Sombras e Espelhos", "Medo e bloqueio de visibilidade."],
  [5, "essencia", "O Merecimento do Criador", "Crença sobre valor e a permissão para cobrar."],
  [6, "essencia", "Abertura Akáshica", "Meditação. Leitura, não prova."],
  [7, "essencia", "A Missão de Alma", "O que a conversa devolveu."],
  [8, "essencia", "Síntese da Essência", "O que fica escrito do primeiro trecho."],
  [9, "imperio", "O Batismo Digital", "Nome e núcleo da identidade."],
  [10, "imperio", "A Narrativa de Origem", "A história que a marca conta."],
  [11, "imperio", "A Jornada do Herói Invisível", "Desafio e superação, sem enfeite."],
  [12, "imperio", "O Manifesto da Marca", "Missão, visão e o convite."],
  [13, "imperio", "Alquimia Visual", "Cor, símbolo e atmosfera."],
  [14, "imperio", "A Voz da Essência", "Como a marca fala."],
  [15, "imperio", "Estética Digital Avançada", "Tipo e imagem."],
  [16, "imperio", "O Livro da Identidade", "O guia que outra pessoa consegue seguir."],
  [17, "expansao", "A Casa Digital", "Site e bio. Um lugar só."],
  [18, "expansao", "O Primeiro Ciclo de Conteúdo", "Os primeiros nove posts."],
  [19, "expansao", "Venda sem gritaria", "O caminho até a oferta."],
  [20, "expansao", "A Primeira Campanha", "O primeiro produto no ar."],
  [21, "expansao", "Operação e Delegação", "O que outra pessoa já faz."],
  [22, "expansao", "Escala", "Curso, áudio, o que se repete."],
  [23, "expansao", "Além da sala", "O que cresce sem você em todo passo."],
  [24, "continuidade", "Aparição", "Se o rosto entra, entra com critério."],
  [25, "continuidade", "Revisão", "Número e ajuste. Sem história bonita no lugar do dado."],
  [26, "continuidade", "O Legado", "O que continua quando o ciclo fecha."]
];

function lista(fase) {
  return ENCONTROS.filter((e) => e[1] === fase).map(([num, , titulo, linha]) =>
    `<div class="mod-row"><div class="mod-num">${num}</div><div class="mod-body"><h3>${titulo}</h3><p>${linha}</p></div></div>`
  ).join("");
}

function pagina(linha, titulo, sub, corpo) {
  return `<div class="view active">
    <p class="hero-line">${linha}</p>
    <h2 class="hero-title">${titulo}</h2>
    <p class="hero-sub">${sub}</p>
    ${corpo}
  </div>`;
}

export function renderCasa() {
  const boxes = [
    ["essencia", "01", "Arquitetura de Essência", "Os 26 encontros. Identidade, família, visão."],
    ["imperio", "02", "Império Digital", "Frase, marca, oferta e a casa digital."],
    ["alinhamento", "03", "Alinhamento Financeiro", "A relação com o dinheiro e a decisão."],
    ["expansao", "04", "Expansão", "Conteúdo, campanha e delegação."],
    ["continuidade", "05", "Continuidade", "Doutrina, movimento e o que fica."],
    ["alma", "06", "Tecnologia da Alma", "Corpo, mente e campo. O ano inteiro."],
    ["dashboard", "AF", "AF Plataforma", "Dashboard, módulos, call, Quitei e complementar. Tudo que já era da AF."]
  ];
  return pagina(
    "Quem já entrou",
    "Arquitetura de Legado",
    "A casa. Cada caixinha é uma frente. A AF continua inteira, lá dentro.",
    `<div class="module-list">${boxes.map(([id, num, titulo, linha]) =>
      `<div class="mod-row" data-nav="${id}"><div class="mod-num">${num}</div><div class="mod-body"><h3>${titulo}</h3><p>${linha}</p></div></div>`
    ).join("")}</div>`
  );
}

export function renderEssencia() {
  return pagina(
    "Meses 1 a 3",
    "Arquitetura de Essência",
    "O que já estava em Sessões. O caderno com pergunta e anotação continua no mesmo lugar.",
    `<div class="module-list">${lista("essencia")}</div><p style="margin-top:12px"><a class="tool-btn" href="/sessoes/">Abrir os 26 encontros</a></p>`
  );
}

export function renderImperio() {
  return pagina(
    "Meses 3 a 6",
    "Império Digital",
    "A essência vira frase, marca e um lugar. Os encontros 9 a 16 já existiam.",
    `<div class="module-list">${lista("imperio")}</div><p style="margin-top:12px"><a class="tool-btn" href="/sessoes/">Abrir os 26 encontros</a></p>`
  );
}

export function renderAlinhamento() {
  return pagina(
    "Meses 4 a 8",
    "Alinhamento Financeiro",
    "A frente. As ferramentas em si ficam na caixinha AF Plataforma, do jeito que você já usa.",
    `<div style="display:flex;flex-wrap:wrap;gap:8px">
      <button class="tool-btn" type="button" data-nav="dashboard">Entrar na AF</button>
      <button class="tool-btn" type="button" data-nav="tools">Ferramentas</button>
      <button class="tool-btn" type="button" data-nav="call">Call</button>
      <button class="tool-btn" type="button" data-nav="quitei">Quitei</button>
      <button class="tool-btn" type="button" data-nav="modules">Módulos</button>
    </div>`
  );
}

export function renderExpansao() {
  return pagina(
    "Meses 7 a 10",
    "Expansão",
    "Uma etapa com entrada e saída. Se a saída for só explicação, ainda não é etapa.",
    `<div class="module-list">${lista("expansao")}</div>`
  );
}

export function renderContinuidade() {
  return pagina(
    "Meses 10 a 12",
    "Continuidade",
    "Doutrina, movimento e comunidade. O que permanece quando o encontro acaba.",
    `<div class="module-list">${lista("continuidade")}</div>`
  );
}

export function renderAlma() {
  return pagina(
    "O ano inteiro",
    "Tecnologia da Alma",
    "Prática. Não é outra mentoria e não é prova de laboratório. O complementar continua dentro da AF.",
    `<button class="tool-btn" type="button" data-nav="complementar">Abrir complementar</button>`
  );
}

export function bindJornada() {}

function soMentor(html) {
  if (!isMentorSession()) return `<div class="view active"><p class="empty">Acesso restrito ao mentor.</p></div>`;
  return html;
}

export function renderPitch() {
  return soMentor(`<div class="view active">
    <div class="back-link" data-nav="mentor">← Gestão</div>
    <p class="hero-line">Só o mentor</p>
    <h2 class="hero-title">Pitch</h2>
    <p class="hero-sub">A fala da casa. Sem número nesta tela.</p>
    ${bloco("Abertura", "Você não entrou em três cursos. Entrou numa casa. Essência, império e alinhamento andam juntos.")}
    ${bloco("Espelho", "O que você já faz tem frase? Se a resposta for só a profissão, o método ainda não tem nome.")}
    ${bloco("Caminho", "Primeiro a escuta. Depois a frase. Depois a casa digital. O dinheiro entra no meio, não no fim.")}
    ${bloco("Fecho", "O próximo passo é um encontro, uma frase ou uma ferramenta. Um só.")}
  </div>`);
}

export function renderTcc() {
  return soMentor(`<div class="view active">
    <div class="back-link" data-nav="mentor">← Gestão</div>
    <p class="hero-line">Só o mentor</p>
    <h2 class="hero-title">O método, por escrito</h2>
    ${bloco("Uma jornada", "Essência, império e alinhamento. A alma atravessa. Não é a quarta oferta.")}
    ${bloco("ACESSO", "Anamnese, codificação, essência, síntese, sistema, operação. Jeito de conduzir. Não é calendário.")}
    ${bloco("Essência", "Vinte e seis encontros em Sessões. Relato é o que a pessoa contou. Hipótese é leitura. Decisão é o que os dois fecharam.")}
    ${bloco("Livros", "Códigos de Origem é linguagem. Paladins é caráter. Zen Negócios ainda é leitura. Nenhum dos três prova faturamento.")}
  </div>`);
}

export function renderSlides() {
  return soMentor(`<div class="view active">
    <div class="back-link" data-nav="mentor">← Gestão</div>
    <p class="hero-line">Só o mentor</p>
    <h2 class="hero-title">O que a casa entrega</h2>
    ${lamina("01", "Você já entrou", "Esta tela não é vitrine.")}
    ${lamina("02", "As frentes", "Essência, império, alinhamento, expansão, continuidade e alma.")}
    ${lamina("03", "A AF", "Dashboard, módulos, call, Quitei, complementar, crianças e empresas. Nada disso saiu.")}
    ${lamina("04", "O que não entra", "Promessa de faturamento. Execução sem limite.")}
  </div>`);
}

function bloco(titulo, texto) {
  return `<article class="q-feature"><h3>${titulo}</h3><p>${texto}</p></article>`;
}
function lamina(n, titulo, texto) {
  return `<article class="q-feature"><p class="hero-line">Lâmina ${n}</p><h3>${titulo}</h3><p>${texto}</p></article>`;
}
