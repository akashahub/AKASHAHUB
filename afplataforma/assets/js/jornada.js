/** Jornada da casa. Não apaga ferramenta. Não mostra preço. */
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

const FASES = {
  essencia: { nome: "Essência", quando: "Meses 1 a 3", linha: "Quem você é. O caderno está em Sessões." },
  imperio: { nome: "Império Digital", quando: "Meses 3 a 6", linha: "A essência vira frase, marca e casa." },
  alinhamento: { nome: "Alinhamento", quando: "Meses 4 a 8", linha: "As ferramentas de sempre. Nenhuma saiu." },
  expansao: { nome: "Expansão", quando: "Meses 7 a 10", linha: "Conteúdo, campanha e o que já pode ser entregue." },
  continuidade: { nome: "Continuidade", quando: "Meses 10 a 12", linha: "Doutrina, movimento e o que fica." }
};

function mes() {
  const n = Number(localStorage.getItem("af-jornada-mes") || "1");
  return n >= 1 && n <= 12 ? n : 1;
}

function fasesDoMes(n) {
  const ids = [];
  if (n <= 3) ids.push("essencia");
  if (n >= 3 && n <= 6) ids.push("imperio");
  if (n >= 4 && n <= 8) ids.push("alinhamento");
  if (n >= 7 && n <= 10) ids.push("expansao");
  if (n >= 10) ids.push("continuidade");
  return ids;
}

function nota() {
  return localStorage.getItem("af-jornada-nota") || "";
}

export function renderJornada() {
  const n = mes();
  const ids = fasesDoMes(n);
  const meses = Array.from({ length: 12 }, (_, i) => {
    const v = i + 1;
    return `<button type="button" class="tool-btn" data-mes="${v}" ${v === n ? "style=\"outline:1px solid var(--gold)\"" : ""}>${v}</button>`;
  }).join("");
  const fases = ids.map((id) => {
    const f = FASES[id];
    return `<article class="q-feature"><p class="hero-line">${f.quando}</p><h3>${f.nome}</h3><p>${f.linha}</p></article>`;
  }).join("");
  const lista = ENCONTROS.filter((e) => ids.includes(e[1])).map(([num, , titulo, linha]) =>
    `<div class="mod-row"><div class="mod-num">${num}</div><div class="mod-body"><h3>${titulo}</h3><p>${linha}</p></div></div>`
  ).join("");
  const ferramentas = ids.includes("alinhamento")
    ? `<div class="row" style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0">
        <button class="tool-btn" type="button" data-nav="tools">Ferramentas</button>
        <button class="tool-btn" type="button" data-nav="call">Call</button>
        <button class="tool-btn" type="button" data-nav="quitei">Quitei</button>
        <button class="tool-btn" type="button" data-nav="complementar">Complementar</button>
        <button class="tool-btn" type="button" data-nav="modules">Módulos</button>
      </div>`
    : "";
  return `<div class="view active">
    <p class="hero-line">Quem já entrou</p>
    <h2 class="hero-title">A jornada</h2>
    <p class="hero-sub">Uma casa. Essência, império, alinhamento, expansão e continuidade. Sem oferta nesta tela. As ferramentas antigas continuam no menu.</p>
    <p class="notes-hint">Mês em que você está. Os meses se cruzam de propósito.</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 16px">${meses}</div>
    ${fases}
    ${ferramentas}
    <article class="q-feature">
      <p class="hero-line">O ano inteiro</p>
      <h3>Tecnologia da Alma</h3>
      <p>Corpo, mente e campo. Prática. Não é outra mentoria e não é prova de laboratório.</p>
      <button class="tool-btn" type="button" data-nav="complementar">Abrir o complementar</button>
    </article>
    <h3 style="margin-top:18px">Encontros deste trecho</h3>
    <p class="notes-hint">Vieram de Sessões, a mentoria de Essência e Império. O caderno com pergunta e anotação continua lá.</p>
    <div class="module-list">${lista || `<p class="notes-hint">Neste mês o peso está na ferramenta, não num encontro novo.</p>`}</div>
    <p style="margin-top:12px"><a class="tool-btn" href="/sessoes/">Abrir os 26 encontros</a></p>
    <div class="field" style="margin-top:16px">
      <label>O que ficou neste mês</label>
      <textarea id="jornadaNota" rows="4">${nota().replace(/</g, "")}</textarea>
    </div>
    <p class="notes-hint">Fica neste aparelho. Relato é o que você viveu. O resto você combina com o mentor.</p>
  </div>`;
}

export function bindJornada() {
  document.querySelectorAll("[data-mes]").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      localStorage.setItem("af-jornada-mes", btn.dataset.mes);
      document.querySelector('[data-view="jornada"]')?.click();
    };
  });
  const box = document.getElementById("jornadaNota");
  if (box) box.oninput = () => localStorage.setItem("af-jornada-nota", box.value);
}

function soMentor(html) {
  if (!isMentorSession()) return `<div class="view active"><p class="empty">Acesso restrito ao mentor.</p></div>`;
  return html;
}

export function renderPitch() {
  return soMentor(`<div class="view active">
    <div class="back-link" data-nav="mentor">← Gestão</div>
    <p class="hero-line">Só o mentor lê em voz alta</p>
    <h2 class="hero-title">Pitch</h2>
    <p class="hero-sub">Teleprompter da casa. Sem número nesta tela. Quem já entrou não vê esta página.</p>
    ${bloco("Abertura", "Você não comprou três cursos. Entrou numa casa. Essência, império e alinhamento andam juntos.")}
    ${bloco("Espelho", "O que você já faz tem nome? Se a resposta for só a profissão, o método ainda não tem frase.")}
    ${bloco("Caminho", "Primeiro a gente escuta. Depois a frase. Depois a casa digital. O dinheiro entra no meio, não no fim, e não espera o site ficar pronto.")}
    ${bloco("O que não é", "Não é promessa de faturamento. Não é aula solta. Não é uma segunda plataforma. As ferramentas que você já usa continuam.")}
    ${bloco("Pausa", "Para. Pergunta: isso descreve o seu momento, ou eu estou falando da casa e não de você?")}
    ${bloco("Fecho", "O próximo passo é um encontro, uma frase ou uma ferramenta. Um só.")}
  </div>`);
}

export function renderTcc() {
  return soMentor(`<div class="view active">
    <div class="back-link" data-nav="mentor">← Gestão</div>
    <p class="hero-line">Leitura interna</p>
    <h2 class="hero-title">O método, por escrito</h2>
    <p class="hero-sub">Estilo de trabalho de conclusão. Para o mentor estudar a casa. Não é material do mentorado.</p>
    ${bloco("1. Uma jornada", "Arquitetura de Legado junta o que antes podia parecer três mentorias: essência, império digital e alinhamento. Tecnologia da Alma atravessa. Não é a quarta oferta.")}
    ${bloco("2. ACESSO", "Anamnese, codificação, essência, síntese, sistema, operação. É o jeito de conduzir um trecho. Não substitui o calendário.")}
    ${bloco("3. Essência", "Vinte e seis encontros já existentes em Sessões. Pilar 1 investiga. Pilar 2 dá identidade. Pilar 3 constrói a casa digital. Pergunta abre história. História não vira verdade só porque foi dita.")}
    ${bloco("4. Três tipos de registro", "Relato: o que a pessoa contou. Hipótese: o que o mentor leu. Decisão: o que os dois fecharam. Misturar os três estraga o dossiê.")}
    ${bloco("5. Livros", "Códigos de Origem é linguagem e repertório. Paladins é caráter e liderança. Zen Negócios é uma ideia de prosperidade ainda em leitura. Nenhum dos três prova resultado financeiro.")}
    ${bloco("6. Alma", "Corpo, mente e campo são prática. Experiência subjetiva não é medida de laboratório. A frase da marca não cita ciência onde só houve percepção.")}
    ${bloco("7. Continuidade", "Doutrina é o princípio. Movimento é a ideia que outra pessoa reconhece. Comunidade é quem fica com um motivo. Grupo de seguidor não conta.")}
  </div>`);
}

export function renderSlides() {
  return soMentor(`<div class="view active">
    <div class="back-link" data-nav="mentor">← Gestão</div>
    <p class="hero-line">Para mostrar a quem já está dentro</p>
    <h2 class="hero-title">O que a casa entrega</h2>
    <p class="hero-sub">Lâminas. Sem preço. Sem plano antigo. Uma ideia por tela.</p>
    ${lamina("01", "Você já entrou", "Esta casa não é vitrine. É o lugar de quem está na mentoria.")}
    ${lamina("02", "Uma jornada", "Essência, império, alinhamento, expansão e continuidade. Não três produtos.")}
    ${lamina("03", "Essência", "Os encontros de Sessões. Identidade, família, visão. O que é relato fica marcado como relato.")}
    ${lamina("04", "Império", "Frase, marca, oferta e um lugar digital. O ativo é do projeto, nos termos combinados.")}
    ${lamina("05", "Alinhamento", "Cash-flow, call, Quitei, rotina, módulos e complementar. Nada disso foi retirado.")}
    ${lamina("06", "Alma", "Prática de corpo, mente e campo, o ano inteiro.")}
    ${lamina("07", "Expansão", "Uma etapa com entrada e saída. Se a saída for só explicação oral, ainda não é etapa.")}
    ${lamina("08", "Continuidade", "Princípio, gente e o próximo ciclo. O que fica quando o encontro acaba.")}
    ${lamina("09", "O que não entra", "Promessa de faturamento. Execução sem limite. Suporte a qualquer hora.")}
  </div>`);
}

function bloco(titulo, texto) {
  return `<article class="q-feature"><h3>${titulo}</h3><p>${texto}</p></article>`;
}
function lamina(n, titulo, texto) {
  return `<article class="q-feature"><p class="hero-line">Lâmina ${n}</p><h3>${titulo}</h3><p>${texto}</p></article>`;
}
