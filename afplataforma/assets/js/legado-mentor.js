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
    `${bloco("1. Quem contrata", "De um lado, o mentor e a operação Akasha Hub. Do outro, a pessoa ou a empresa indicada no instrumento assinado. Os nomes, documentos e o e-mail de acesso entram na versão final.")}
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

export function renderLegadoDossie() {
  const blocos = [
    ["Identidade", "Como você se apresenta hoje? Qual sua profissão principal? Quais seus 3 maiores talentos? O que você faz melhor? Qual sua maior conquista? O que ensinaria ao mundo? Por que a mentoria agora? Qual nome carrega sua essência? Qual a missão em uma frase?"],
    ["História familiar", "Qual o talento da mãe? Qual a força do pai? Qual avô ou avó você admira? Qual dom se repete? Qual padrão de luta se repete? Quem ficou para trás? O que a família proibiu você de ser? O que você honra? O que encerra?"],
    ["Visão de mundo", "Qual cultura ou civilização te atrai? Qual a forma, a cor e o som que você associa à sua alma? Qual missão além desta vida? O que você veio trazer que ainda não foi feito? Marcar como leitura, não como fato."],
    ["Referências pessoais", "Qual medo paralisa ao pensar em aparecer? O que você criou e nunca mostrou? O que teme que digam do seu trabalho? O que deseja que as pessoas sintam?"],
    ["Padrões identificados", "Qual história você conta sobre por que não deu certo? Você se vê merecedor de ser pago? Qual padrão familiar entra na cobrança, na liderança ou na venda?"],
    ["Direção inicial da marca", "De onde você veio? Qual foi a virada? Qual a promessa da marca? Como a marca fala? Qual cor, símbolo e energia visual? Quais palavras não entram?"],
    ["Objetivos pessoais", "O que você deseja representar? Qual papel quer exercer? O que significa independência para você?"],
    ["Objetivos empresariais", "Qual produto de entrada? Qual a casa digital? O que você ama fazer e o que precisa delegar? Qual o próximo formato da obra?"],
    ["Síntese estratégica", "Qual a maior revelação até aqui? Como a visão de si mudou? Qual o núcleo da essência? O que vem primeiro, e o que espera?"],
    ["Referências e entregas da fase", "A identidade está coerente? O que ainda ajusta? O que foi decidido? O que fica pendente? Qual entrega desta fase a pessoa leva?"]
  ];
  return page(
    "Primeira camada",
    "Modelo de dossiê de essência",
    "Junta as dez partes da Fase 1 com as perguntas que já estão em Sessões. Nada disso é gravado sozinho ainda.",
    `${bloco("Como preencher", "Em cada parte, três linhas: relato, o que a pessoa contou; hipótese, o que o mentor leu; decisão, o que os dois fecharam. Pergunta de Sessões que não couber agora fica em pendência.")}
    ${blocos.map(([t, p]) => bloco(t, p)).join("")}
    <p class="notes-hint">As perguntas continuam no roteiro original, em /sessoes. Este modelo não substitui aquele caderno.</p>`
  );
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
