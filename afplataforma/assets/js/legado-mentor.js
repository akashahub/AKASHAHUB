/** Documentos da Arquitetura de Legado. Só o mentor abre. Não grava contrato nem dossiê. */
import { isMentorSession } from "./auth.js";

function gate(html) {
  if (!isMentorSession()) return `<div class="view active"><p class="empty">Acesso restrito ao mentor.</p></div>`;
  return html;
}

function page(linha, titulo, sub, corpo) {
  return gate(`<div class="view active">
    <div class="back-link" data-nav="mentor">← Gestão</div>
    <p class="hero-line">${linha}</p>
    <h2 class="hero-title">${titulo}</h2>
    <p class="hero-sub">${sub}</p>
    ${corpo}
  </div>`);
}

function bloco(titulo, texto) {
  return `<article class="q-feature"><h3>${titulo}</h3><p>${texto}</p></article>`;
}

function itens(lista) {
  return `<div class="module-list">${lista.map((t, i) =>
    `<div class="mod-row"><div class="mod-num">${i + 1}</div><div class="mod-body"><h3>${t}</h3></div></div>`
  ).join("")}</div>`;
}

export function renderLegadoPlanos() {
  return page(
    "Preço da casa",
    "Mapa dos planos da Arquitetura de Legado",
    "Conferido na central. Não é o mapa do Alinhamento Financeiro antigo.",
    `${bloco("Oferta pública · Mentoria em Grupo", "R$ 39.000. Doze meses. Três encontros individuais. Vinte e quatro encontros. Três imersões. Comunidade, plataforma e laboratório. É o único preço do funil direto.")}
    ${bloco("Só no diagnóstico · Consultoria Premium", "R$ 60.000. Doze meses. Seis encontros individuais. A base da jornada é a mesma. A diferença é o acompanhamento individual. Não entra no primeiro anúncio.")}
    ${bloco("O que estes números não são", "Não são os planos antigos do AF: Essencial, Premium e VIP. Não são R$ 350 da sessão de entrada. Não são promessa de faturamento.")}
    <p class="notes-hint">Fonte: akashahub.com.br/al/central. Se a central mudar o número, este mapa precisa ser atualizado junto.</p>`
  );
}

export function renderLegadoContrato() {
  return page(
    "Minuta de trabalho",
    "Contrato da Arquitetura de Legado",
    "Modelo para a pessoa entender o que contrata antes de pagar. Não substitui revisão jurídica antes da assinatura.",
    `<p><a class="tool-btn" href="interno/contrato-arquitetura-de-legado.pdf" target="_blank" rel="noopener">Baixar o contrato em PDF</a></p>
    ${bloco("1. Quem contrata", "De um lado, o mentor e a operação Akasha Hub. Do outro, a pessoa ou a empresa indicada no instrumento assinado. Os nomes, documentos e o e-mail de acesso entram na versão final.")}
    ${bloco("2. O que se contrata", "Um ciclo de doze meses da Arquitetura de Legado. Não são três mentorias vendidas lado a lado. É uma jornada: essência, império digital, alinhamento financeiro, expansão e continuidade. A Tecnologia da Alma atravessa o ano. Não é um quarto produto.")}
    ${bloco("3. Formato e investimento", "Mentoria em Grupo: R$ 39.000, três encontros individuais, vinte e quatro encontros, três imersões, comunidade, plataforma e laboratório. Consultoria Premium: R$ 60.000 e seis encontros individuais, somente quando o diagnóstico mostrar que três individuais não bastam. A forma de pagamento fica escrita no instrumento. Sem pagamento confirmado, a vaga não está garantida.")}
    ${bloco("4. O que a jornada cobre", "Leitura de essência e dossiê. Direção de posicionamento, linguagem e primeiros ativos digitais no escopo combinado. Uso das ferramentas de alinhamento já existentes na plataforma. Sessões conforme o formato. Registro do que foi decidido. Um mapa de continuidade no fim do ciclo. O que for construído para o projeto da pessoa pertence a ela, nas contas, licenças e acessos que a entrega listar.")}
    ${bloco("5. O que não entra", "Promessa de faturamento, seguidores ou cura. Suporte a qualquer hora. Execução ilimitada de site, aplicativo, livro ou campanha. Os planos antigos do AF. Produção fora do escopo, que só acontece com um combinado escrito à parte. Leitura espiritual registrada como se fosse fato histórico ou prova científica.")}
    ${bloco("6. Como o trabalho é registrado", "Relato é o que a pessoa contou. Hipótese é leitura do mentor. Decisão é o que os dois fecharam. Misturar os três não vale. História familiar e dado sensível ficam no acesso da mentoria. Uso público de história pessoal só com autorização.")}
    ${bloco("7. Plataforma", "O acesso é pessoal, liberado pelo mentor. Não se repassa senha. A conta não é a vaga: a liberação continua manual. Sair em aparelho compartilhado. O que já funciona no AF não muda de regra por causa deste contrato.")}
    ${bloco("8. Encerramento", "No fim do ciclo, a pessoa recebe o que foi combinado: acessos, documentos compartilhados e o mapa do que continua. Rescisão, reembolso e inadimplência seguem a lei aplicável e o texto que for assinado. Esta minuta não inventa prazo de devolução.")}
    <p class="notes-hint">A Parte 8 da organização do ano não estava nos arquivos. O escopo acima segue o texto da jornada e os preços da central.</p>`
  );
}

export function renderLegadoRegras() {
  return page(
    "Para achar sempre aqui",
    "Regras da mentoria e da plataforma",
    "O que a pessoa pode esperar. O que o mentor não promete.",
    itens([
      "Uma casa, um ciclo de doze meses. Essência, império e alinhamento não são três contratos concorrentes.",
      "A oferta dita em público é a mentoria de R$ 39.000. A de R$ 60.000 só depois do diagnóstico.",
      "A sequência organiza. Não prende. Se a pessoa precisa vender no primeiro mês, vende.",
      "Pergunta abre história. História não vira verdade só porque foi dita.",
      "Leitura de registros, vidas passadas ou campo é experiência. Não é laudo.",
      "Não há promessa de faturamento, cura ou resultado de audiência.",
      "O dossiê separa relato, hipótese e decisão.",
      "Nota privada do mentor não aparece sozinha para o mentorado.",
      "História da pessoa só vira conteúdo com autorização.",
      "O acesso à plataforma é individual. Senha não se divide.",
      "Quem entra pede acesso. Quem libera é o mentor. Conta criada não é vaga aberta.",
      "Módulos, call, Quitei, complementar, crianças e empresas continuam as ferramentas que já existiam.",
      "O livro operacional do Alinhamento Financeiro não é este documento e não foi alterado.",
      "Ativo feito para o projeto da pessoa é dela, no que o contrato listar: conta, domínio, arquivo e licença.",
      "Produção extra, fora do escopo, não está inclusa por silêncio.",
      "No encerramento, a pessoa sai com o mapa do que foi feito e do que continua."
    ])
  );
}

const DOSSIE_PARTES = [
  {
    id: "historia",
    titulo: "História e contexto",
    origem: "Documento-mestre, item 1 do dossiê. Sessões 1 a 3 alimentam.",
    guia: "A trajetória que importa para o trabalho. Fatos. Sem fechar a pessoa na primeira frase."
  },
  {
    id: "perguntas",
    titulo: "Perguntas e respostas",
    origem: "O processo de Sessões. A mesa só organiza. Não substitui o caderno.",
    guia: "A pergunta que abriu. A resposta que ficou. O que ainda precisa ser perguntado de novo."
  },
  {
    id: "narrativas",
    titulo: "Narrativas importantes",
    origem: "Histórias que merecem ser preservadas, com autorização se forem virar conteúdo.",
    guia: "A história. Onde ela pode servir. Onde ela não deve ser usada."
  },
  {
    id: "padroes",
    titulo: "Padrões identificados",
    origem: "Comportamentos, crenças e repetições que vocês decidem investigar.",
    guia: "O padrão. Onde aparece na cobrança, na liderança ou na venda. O que ainda é hipótese."
  },
  {
    id: "valores",
    titulo: "Valores e símbolos",
    origem: "O que entra na identidade da marca.",
    guia: "O valor que não sai. O símbolo, a palavra, o tom. O que não entra."
  },
  {
    id: "talentos",
    titulo: "Talentos e capacidades",
    origem: "O que a pessoa sabe, faz ou pode desenvolver. Sem inventar produto.",
    guia: "O que já faz. O que outra pessoa reconhece. O que ainda é capacidade, não oferta."
  },
  {
    id: "ideias",
    titulo: "Ideias e possibilidades",
    origem: "Produtos, conteúdos, projetos e oportunidades. Ainda não são o império.",
    guia: "A possibilidade. Para quem. O que espera a próxima fase."
  },
  {
    id: "decisoes",
    titulo: "Decisões tomadas",
    origem: "O que foi definido durante o processo. Não é hipótese.",
    guia: "A decisão. Quem decidiu. O que isso muda agora."
  },
  {
    id: "pendencias",
    titulo: "Pendências",
    origem: "Perguntas que ainda precisam ser exploradas.",
    guia: "O que ficou aberto. Quando volta. O que não vira verdade enquanto estiver aqui."
  },
  {
    id: "aplicacoes",
    titulo: "Aplicações práticas",
    origem: "O que cada descoberta muda na vida ou no negócio. Inclui a leitura inicial do dinheiro.",
    guia: "O que muda na vida. O que muda na obra. A leitura de dinheiro em uma frase: o que entra, o que vaza, o que é essencial. O plano fica no Alinhamento."
  }
];

function caixa(id, rotulo) {
  return `<label class="field" style="display:block;margin-top:10px">${rotulo}<textarea data-dossie="${id}" rows="3" style="width:100%;min-height:68px;margin-top:6px;padding:10px 12px;border:1px solid rgba(201,162,75,.35);border-radius:8px;background:transparent;color:inherit;font:inherit;line-height:1.45"></textarea></label>`;
}

export function renderLegadoDossie() {
  const partes = DOSSIE_PARTES.map((parte, i) => `
    <article class="q-feature">
      <p class="hero-line">${String(i + 1).padStart(2, "0")}</p>
      <h3>${parte.titulo}</h3>
      <p>${parte.origem}</p>
      <p class="notes-hint">${parte.guia}</p>
      ${caixa(parte.id + "-relato", "Relato · o que a pessoa contou")}
      ${caixa(parte.id + "-hipotese", "Hipótese · o que o mentor leu, sem tratar leitura como fato")}
      ${caixa(parte.id + "-decisao", "Decisão · o que os dois fecharam")}
    </article>`).join("");
  return page(
    "Resultado da Fase 1",
    "Dossiê de Essência",
    "Isto junta as perguntas de Sessões com o que a fase passou a pedir quando as três mentorias viraram uma. O caderno de 26 encontros continua em /sessoes. Este dossiê não grava no servidor. Fica neste aparelho, na gestão.",
    `${bloco("Como usar", "Uma parte de cada vez. Relato é a fala da pessoa. Hipótese é a leitura do mentor. Decisão é o que os dois fecham. O que não couber fica em pendência, não vira verdade. Quando isso estiver fechado, a última parte lê o dossiê e escreve os ativos. Não abre outro documento.")}
    <p><a class="tool-btn" href="interno/modelo-dossie-essencia.pdf" target="_blank" rel="noopener">Abrir o PDF do modelo</a></p>
    <label class="field">Pessoa<input id="dossieNome" placeholder="Nome de quem está na fase" style="width:100%;margin-top:6px;padding:10px 12px;border:1px solid rgba(201,162,75,.35);border-radius:8px;background:transparent;color:inherit;font:inherit"></label>
    ${partes}
    <article class="q-feature">
      <h3>Direção estratégica</h3>
      <p>A entrega da fase, junto com o dossiê. Não é o site. Não é o funil.</p>
      ${caixa("resultado-frase", "A frase que outra pessoa consegue repetir")}
      ${caixa("resultado-paraquem", "Para quem é. Para quem não é.")}
      ${caixa("resultado-leva", "O que a essência entrega ao império")}
      ${caixa("resultado-espera", "O que espera a Fase 2")}
      ${caixa("resultado-proxima", "A próxima decisão, escrita")}
    </article>
    <article class="q-feature">
      <h3>Do dossiê ao ativo</h3>
      <p>Não inventa matéria nova. Lê o que já está escrito e põe uma linha em cada lugar. Essa ordem encurta a casa digital.</p>
      <p class="notes-hint">Palavra sai da frase e das narrativas. Valor vira regra da página. História só vira conteúdo com autorização. Símbolo vira bio e visual. Contradição vira limite, não post. Talento vira a oferta. Aspiração vira a lista. Descoberta é a decisão que muda o primeiro passo.</p>
      ${caixa("ativo-palavras", "Palavras · cinco que a marca usa, e as que não usa")}
      ${caixa("ativo-valores", "Valores · a regra da página e do tom")}
      ${caixa("ativo-historias", "Histórias · uma que pode ser conteúdo. Uma que fica só aqui.")}
      ${caixa("ativo-simbolos", "Símbolos · palavra, tom, objeto")}
      ${caixa("ativo-contradicoes", "Contradições · o que trava a venda. Vira o limite da oferta.")}
      ${caixa("ativo-talentos", "Talentos · o que já faz e alguém reconhece. Vira a oferta.")}
      ${caixa("ativo-aspiracoes", "Aspirações · a lista de ativos, na ordem")}
      ${caixa("ativo-descoberta", "Descoberta · a decisão que muda o primeiro ativo")}
      ${caixa("ativo-ordem", "Ordem · frase, bio, uma página, oferta com limite, primeiro conteúdo")}
    </article>
    <div class="row">
      <button class="tool-btn" type="button" id="dossieSalvar">Guardar este dossiê</button>
      <button class="tool-btn" type="button" id="dossieCopiar">Copiar o dossiê</button>
    </div>
    <p class="notes-hint" id="dossieAviso">Escolha o nome e guarde. Cada nome fica separado neste aparelho.</p>
    <div id="dossieLista"></div>`
  );
}

const DOSSIE_KEY = "afDossieEssenciaV2";

function lerDossies() {
  try { return JSON.parse(localStorage.getItem(DOSSIE_KEY) || "{}"); } catch (e) { return {}; }
}

export function bindLegadoDossie() {
  const root = document.getElementById("content");
  if (!root || !root.querySelector("[data-dossie]")) return;
  const nome = document.getElementById("dossieNome");
  const aviso = document.getElementById("dossieAviso");
  const lista = document.getElementById("dossieLista");
  const campos = () => root.querySelectorAll("[data-dossie]");
  const pintarLista = () => {
    const todos = lerDossies();
    const nomes = Object.keys(todos);
    if (!lista) return;
    lista.innerHTML = nomes.length
      ? `<p class="notes-hint" style="margin-top:14px">Já guardados</p><div class="row">${nomes.map((n) => {
          const seguro = String(n).replace(/[&<>"]/g, (c) => "&#" + c.charCodeAt(0) + ";");
          return `<button class="tool-btn" type="button" data-abrir-dossie="${seguro}">${seguro}</button>`;
        }).join("")}</div>`
      : "";
  };
  const preencher = (dados) => {
    campos().forEach((el) => { el.value = dados[el.getAttribute("data-dossie")] || ""; });
  };
  pintarLista();
  document.getElementById("dossieSalvar")?.addEventListener("click", () => {
    const chave = (nome?.value || "").trim();
    if (!chave) {
      if (aviso) aviso.textContent = "Escreva o nome da pessoa antes de guardar.";
      return;
    }
    const dados = {};
    campos().forEach((el) => { dados[el.getAttribute("data-dossie")] = el.value; });
    const todos = lerDossies();
    todos[chave] = dados;
    localStorage.setItem(DOSSIE_KEY, JSON.stringify(todos));
    if (aviso) aviso.textContent = "Dossiê de " + chave + " guardado neste aparelho.";
    pintarLista();
  });
  document.getElementById("dossieCopiar")?.addEventListener("click", async () => {
    const dados = {};
    campos().forEach((el) => { dados[el.getAttribute("data-dossie")] = el.value; });
    const miolo = DOSSIE_PARTES.map((parte) => [
      parte.titulo,
      "Relato: " + (dados[parte.id + "-relato"] || "—"),
      "Hipótese: " + (dados[parte.id + "-hipotese"] || "—"),
      "Decisão: " + (dados[parte.id + "-decisao"] || "—")
    ].join("\n")).join("\n\n");
    const resultado = [
      "O que o império pode carregar",
      "Frase: " + (dados["resultado-frase"] || "—"),
      "Para quem: " + (dados["resultado-paraquem"] || "—"),
      "Leva: " + (dados["resultado-leva"] || "—"),
      "Espera: " + (dados["resultado-espera"] || "—"),
      "Próxima decisão: " + (dados["resultado-proxima"] || "—")
    ].join("\n");
    const texto = "Dossiê de Essência · " + ((nome?.value || "").trim() || "sem nome") + "\n\n" + miolo + "\n\n" + resultado;
    try { await navigator.clipboard.writeText(texto); } catch (e) {}
    if (aviso) aviso.textContent = "Dossiê copiado.";
  });
  lista?.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-abrir-dossie]");
    if (!btn) return;
    const chave = btn.getAttribute("data-abrir-dossie");
    const dados = lerDossies()[chave];
    if (!dados) return;
    if (nome) nome.value = chave;
    preencher(dados);
    if (aviso) aviso.textContent = "Aberto: " + chave + ".";
  });
}

export function renderLegadoOquee() {
  return page(
    "Não é o livro operacional do AF",
    "O que é a mentoria",
    "A Arquitetura de Legado, em uma leitura. O livro do Alinhamento Financeiro permanece no botão antigo.",
    `${bloco("Definição", "Um ano para incubar a pessoa, o negócio e o que permanece. Não é aula solta. Não são três produtos na mesma prateleira.")}
    ${bloco("A pessoa", "Identidade, história, padrões, valores, talentos e visão de mundo. O resultado desta escuta é o dossiê.")}
    ${bloco("A obra", "A essência vira posicionamento, linguagem, oferta, conteúdo e ativos digitais. O que for construído para o projeto é do projeto, nos termos do contrato.")}
    ${bloco("O dinheiro", "Crença, cobrança, fluxo, preço, meta e venda. As ferramentas do AF servem a esta frente. Os planos antigos do AF não são o preço desta mentoria.")}
    ${bloco("A alma", "Corpo, mente, campo, intenção e prática. Experiência subjetiva não é prova de laboratório.")}
    ${bloco("A continuidade", "Processo, gente, doutrina, movimento e comunidade. O fim do ano entrega um mapa, não um sumiço.")}
    ${bloco("O ano, sem caixa rígida", "Meses 1 a 3, leitura. 3 a 6, império. 4 a 8, dinheiro e venda, em paralelo. 7 a 10, expansão. 10 a 12, comunidade e continuidade. Se o projeto pedir venda antes, a venda não espera o mês 4.")}`
  );
}

export function renderLegadoDirecao() {
  return page(
    "Mapa, não teleprompter",
    "Roteiro de direcionamento",
    "Os pilares, na ordem em que se entra. Serve ao mentor na condução e ao mentorado para saber onde está.",
    `${bloco("Para os dois", "Uma descoberta pode virar decisão. Uma decisão pode virar construção. Uma construção pode ficar quando o encontro acaba.")}
    ${bloco("1. Escuta", "Pergunta. História. Não fechar a pessoa na primeira frase.")}
    ${bloco("2. Essência", "Identidade. Família. Visão de mundo. Separar relato, hipótese e decisão.")}
    ${bloco("3. Direção", "O que vem primeiro. O que espera. O que seria sucesso neste ciclo.")}
    ${bloco("4. Império", "Frase, marca, oferta, canal e o primeiro ativo. Nem todo canal. O que serve.")}
    ${bloco("5. Dinheiro", "O que impede de cobrar. O número real. O preço. A meta. A próxima venda.")}
    ${bloco("6. Alma", "O que a pessoa pratica. Sem transformar percepção em ciência.")}
    ${bloco("7. Expansão", "O que só o fundador faz. O que já pode ser escrito, delegado ou repetido.")}
    ${bloco("8. Continuidade", "Princípio. Gente. Comunidade. Acessos. O próximo ciclo.")}
    ${bloco("Na sessão", "Abrir o dossiê. Uma pergunta. Capturar. Decidir um passo. Marcar o que fica para a próxima. Não tentar entregar o ano numa call.")}
    ${bloco("O mentorando vê", "A fase. A ferramenta da fase. O que foi compartilhado. A tarefa. O que não vê: nota privada, preço interno do AF antigo, treinamento de vendedor.")}`
  );
}

export function renderLegadoPitch() {
  return page(
    "Fala curta",
    "Pitch de venda",
    "Estilo de mesa. Uma ideia por bloco. O preço entra uma vez, e só depois do encaixe.",
    `${bloco("Abertura", "Você não está diante de três cursos. Está diante de um ano para transformar o que você é no que o seu projeto consegue sustentar.")}
    ${bloco("O problema", "A pessoa sabe fazer. Não tem frase, casa e número no mesmo lugar. O talento fica na conversa e não vira ativo.")}
    ${bloco("A jornada", "Primeiro a escuta. Depois a frase e o primeiro ativo. O dinheiro entra no meio, não no fim. No fechamento, fica o mapa do que continua.")}
    ${bloco("A prova de método", "Não é depoimento inventado. É o que a casa já tem: sessões, plataforma, call e um dossiê que separa história de hipótese.")}
    ${bloco("A oferta", "Doze meses. Arquitetura de Legado. R$ 39.000. Três individuais, vinte e quatro encontros, três imersões, comunidade, plataforma e laboratório. Se o diagnóstico pedir seis individuais, a conversa é outra: R$ 60.000. Não é o anúncio.")}
    ${bloco("O que não prometo", "Faturamento. Plateia. Que eu faça a empresa inteira no lugar da pessoa.")}
    ${bloco("O pedido", "A aplicação não é o pagamento. A conversa decide o encaixe. Se couber, o contrato e o pagamento confirmam a vaga.")}`
  );
}

export function renderLegadoTcc() {
  return page(
    "Leitura longa",
    "Apresentação no estilo de um TCC",
    "O método por escrito, para estudar antes de uma banca ou de uma call longa.",
    `${bloco("Problema", "As frentes existiam separadas. A pessoa recebia essência, império ou dinheiro como se fossem produtos. O trabalho real já cruzava os três.")}
    ${bloco("Objeto", "A Arquitetura de Legado organiza esse cruzamento num ciclo de um ano, sem apagar as ferramentas do AF.")}
    ${bloco("Capítulo 1 · Essência", "Identidade, família e visão de mundo. Pergunta conduz. O dossiê guarda. Relato, hipótese e decisão não se misturam.")}
    ${bloco("Capítulo 2 · Império", "Posicionamento, linguagem, oferta e ativos. Império Digital é a essência materializada, com dono e acesso definidos.")}
    ${bloco("Capítulo 3 · Alinhamento", "Comportamento e número. As ferramentas atuais entram aqui. O preço desta mentoria não é o ticket antigo do AF.")}
    ${bloco("Capítulo 4 · Alma", "Prática de corpo, mente e campo ao longo do ano. Linguagem espiritual permanece. Não vira citação científica.")}
    ${bloco("Capítulo 5 · Continuidade", "Expansão, doutrina, movimento e comunidade. O critério de comunidade não é contagem de seguidor.")}
    ${bloco("Limite", "A Parte 8 escrita não foi encontrada nos arquivos. O cronograma é o que você descreveu, e ainda pode ser ajustado.")}`
  );
}

export function renderLegadoSlides() {
  const slides = [
    ["01", "Capa", "Arquitetura de Legado. Um ano. Uma casa. Espaço para uma foto sua, ambiente real, sem texto por cima do rosto."],
    ["02", "Não são três cursos", "Essência, império e alinhamento entram na mesma jornada."],
    ["03", "O que trava", "Talento sem frase, sem casa e sem número."],
    ["04", "O ano", "Escuta, construção, dinheiro, expansão, continuidade. Os meses se cruzam."],
    ["05", "Essência", "Dossiê. História de um lado. Leitura de outro. Decisão no meio."],
    ["06", "Império", "Frase, marca, oferta, primeiro ativo. Espaço para um print do que a pessoa já tem."],
    ["07", "Dinheiro", "Cobrar, ver o fluxo, definir o preço, acompanhar a venda."],
    ["08", "O que entra", "Doze meses. Vinte e quatro encontros. Três imersões. Três individuais. Comunidade, plataforma, laboratório."],
    ["09", "Investimento", "R$ 39.000. Dito uma vez. A consultoria de R$ 60.000 não entra neste slide."],
    ["10", "O que não entra", "Promessa de faturamento. Execução sem limite. Suporte a qualquer hora."],
    ["11", "Próximo passo", "Aplicação. Conversa. Se couber, contrato e pagamento. Espaço para o botão ou o QR, quando você tiver."]
  ];
  return page(
    "Antes da compra",
    "Apresentação em lâminas",
    "Texto pronto. Sem imagem gerada. Onde couber foto, está marcado.",
    slides.map(([n, t, p]) => bloco("Lâmina " + n + " · " + t, p)).join("")
  );
}
