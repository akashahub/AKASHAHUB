/**
 * Área Complementar + LifeOS (organizado) + Lojinha
 * Sem duplicar ferramentas já existentes — só organiza e adiciona hubs
 */
import { esc } from "./navigation.js";
import { Store } from "./storage.js";
import { session } from "./auth.js";

const WPP = "5571983448621";

const COMP_APPS = [
  {
    id: "alimentacao",
    name: "Alimentação saudável",
    desc: "Base corporal alinhada aos 7 vetores de performance — energia estável para execução."
  },
  {
    id: "constelacao",
    name: "Constelação familiar",
    desc: "Sessões complementares e material paralelo (envio no grupo WhatsApp). Roteiros no painel do mentor."
  },
  {
    id: "dicionario",
    name: "Dicionário",
    desc: "Termos de finanças, marketing, startups e operação — referência rápida."
  },
  {
    id: "livros",
    name: "Livros dos 7 vetores",
    desc: "Coletânea em HTML dentro da plataforma (conteúdo protegido para quem tem acesso)."
  },
  {
    id: "treino",
    name: "Treino e exercícios",
    desc: "Fundamentos de corpo e consistência a serviço da mentoria."
  },
  {
    id: "yoga",
    name: "Yoga operacional",
    desc: "Slots prontos para imagens, frequência, vídeos e saudações."
  },
  {
    id: "meditacao",
    name: "Meditação guiada",
    desc: "Camada de áudios por vetor — upload depois."
  },
  {
    id: "etiqueta",
    name: "Etiqueta",
    desc: "Presença, mesa, call e networking — protocolo visual alinhado aos 7 vetores."
  },
  { id: "habitos", name: "Hábitos", desc: "Consistência que transforma. Novo no complementar." },
  { id: "metas", name: "Metas", desc: "Objetivos e resultados — não existia no AF." },
  { id: "rotina", name: "Rotina", desc: "Calendário e tarefas do dia — não existia no AF." },
  { id: "mindzone", name: "MindZone", desc: "Respiração · meditação curta · jogo de foco." },
  { id: "sono", name: "Modo sono", desc: "Dinheiro entrando + 7 frequências dos vetores." },
  { id: "coach", name: "AF Coach", desc: "IA Life Coach — estrutura pronta, IA ainda desligada." },
  { id: "encontros", name: "Mentoria · Encontros", desc: "26 encontros / anamnese — página irmã." },
  { id: "lifeos", name: "Life OS", desc: "Mapa: o que já existe no AF × o que é complementar." },
  { id: "loja", name: "Lojinha Akasha", desc: "Top 3 cores + peças únicas · pedido no WhatsApp." }
];

const DICT = [
  { t: "Bootstrapping", d: "Construir com capital próprio, sem rodada externa no início." },
  { t: "Cash-flow", d: "Fluxo de caixa: entradas menos saídas em um período." },
  { t: "Deal flow", d: "Fluxo de oportunidades de negócio ou investimento." },
  { t: "Lean Canvas", d: "Mapa de uma página do modelo de negócio para validação rápida." },
  { t: "MVP", d: "Produto mínimo viável — menor versão que testa a hipótese." },
  { t: "BATNA", d: "Melhor alternativa se a negociação falhar." },
  { t: "Runway", d: "Quanto tempo o caixa atual sustenta a operação." },
  { t: "LTV / CAC", d: "Valor do cliente no tempo versus custo de aquisição." },
  { t: "Pitch", d: "Narrativa curta do problema, solução e pedido." },
  { t: "Sunk cost", d: "Custo já irrecuperável — não deve guiar a próxima decisão sozinho." },
  { t: "Accountability", d: "Prestação de contas com prazo e evidência de execução." },
  { t: "Reserva de emergência", d: "3 a 6 meses de custo fixo em liquidez." },
  { t: "Ticket médio", d: "Receita total dividida pelo número de vendas." },
  { t: "Funil", d: "Atenção → confiança → oferta → fechamento." },
  { t: "High-ticket", d: "Oferta de valor alto com diagnóstico e acompanhamento." },
  { t: "CTA", d: "Chamada à ação — um próximo passo só." },
  { t: "MRR", d: "Receita recorrente mensal." },
  { t: "Break-even", d: "Ponto em que a receita cobre o custo." },
  { t: "Lealdade invisível", d: "Contrato inconsciente com o destino familiar que trava prosperidade." },
  { t: "Pertencimento", d: "Todos têm lugar no sistema — inclusive quem faliu." },
  { t: "Hierarquia", d: "Quem veio antes tem prioridade. Recusar os pais bloqueia a entrada." },
  { t: "Equilíbrio dar-tomar", d: "Cobrar de menos ou receber de mais afasta o fluxo." },
  { t: "ARR", d: "Receita recorrente anualizada." },
  { t: "Burn rate", d: "Ritmo de queima de caixa por mês." },
  { t: "Churn", d: "Taxa de perda de clientes no período." },
  { t: "NPS", d: "Net Promoter Score — quanto o cliente indicaria você." },
  { t: "ROI", d: "Retorno sobre o investimento." },
  { t: "Payback", d: "Tempo para recuperar o custo de aquisição." },
  { t: "Unit economics", d: "Conta de uma unidade: margem, CAC, LTV." },
  { t: "Gross margin", d: "Receita menos custo direto, em %." },
  { t: "Capex / Opex", d: "Investimento em ativo versus despesa operacional." },
  { t: "Alavancagem", d: "Usar recurso ou sistema para multiplicar resultado." },
  { t: "Ativo × passivo", d: "O que gera caixa no tempo versus o que consome." },
  { t: "Juros compostos", d: "Rendimento sobre rendimento — disciplina no tempo." },
  { t: "Custo de oportunidade", d: "O que você deixa de ganhar ao escolher A em vez de B." },
  { t: "Ancoragem", d: "O primeiro número da conversa enviesa a percepção de preço." },
  { t: "Aversão à perda", d: "A dor de perder pesa mais que o prazer de ganhar o mesmo valor." },
  { t: "Prova social", d: "Decisão influenciada pelo que outros já validaram." },
  { t: "Escassez cognitiva", d: "Mente ocupada demais com falta para executar bem." },
  { t: "Mãe = dinheiro", d: "Relação com quem nutre determina a capacidade de receber (fluxo)." },
  { t: "Pai = riqueza", d: "Relação com quem estrutura determina patrimônio e legado." },
  { t: "Stewardship", d: "Governar o dinheiro a serviço da vida, não como identidade." },
  { t: "PSI / ADP / POC", d: "Estruturas de pitch usadas no módulo 5." },
  { t: "Generosidade estratégica", d: "Dar com limite e intenção — não comprar afeto." },
  { t: "Mínimo viável diário", d: "A menor ação que mantém o vetor vivo no dia." },
  { t: "Segredo sistêmico", d: "Evento oculto na linhagem que congela o fluxo por gerações." }
];

const LIVROS = [
  { n: "01", nome: "A Raiz da Riqueza", vetor: "Base · Segurança" },
  { n: "02", nome: "A Criatividade Lucrativa", vetor: "Criativo" },
  { n: "03", nome: "Amor pelo Sucesso Financeiro", vetor: "Execução" },
  { n: "04", nome: "A Voz da Abundância", vetor: "Relacional / Comunicação" },
  { n: "05", nome: "A Visão da Fortuna", vetor: "Visão" },
  { n: "06", nome: "A Conexão Divina com a Opulência", vetor: "Governança" },
  { n: "07", nome: "O Poder da Prosperidade", vetor: "Integração" }
];

const LOJA = [
  { id: "top", name: "Top macramê", price: "Sob consulta", colors: ["Amarelo", "Cru", "Bege"], img: "assets/img/loja/top-creme.jpg" },
  { id: "colar", name: "Colar", price: "Peça única", img: "assets/img/loja/colar.jpg" },
  { id: "caneta", name: "Caneta", price: "Peça única", img: "assets/img/loja/caneta.jpg" },
  { id: "gravata", name: "Gravata", price: "Peça única", img: "assets/img/loja/gravata.jpg" },
  { id: "joia", name: "Joia", price: "Peça única", img: "assets/img/loja/joia.jpg" }
];

export function renderComplementarHome() {
  return `<div class="view active">
    <p class="hero-line">Complementar</p>
    <h2 class="hero-title">Camada paralela</h2>
    <p class="hero-sub">Alimentação, constelação, dicionário, livros, corpo, yoga, etiqueta, Life OS e loja — no mesmo ecossistema AF.</p>
    <div class="mat-grid">
      ${COMP_APPS.map(
        (a) => `<div class="mat-card">
        <h4>${esc(a.name)}</h4>
        <p>${esc(a.desc)}</p>
        <button class="tool-btn" type="button" data-nav="comp:${a.id}">Abrir</button>
      </div>`
      ).join("")}
    </div>
  </div>`;
}

export function renderComplementarApp(id) {
  if (id === "alimentacao") return viewAlimentacao();
  if (id === "constelacao") return viewConstelacao();
  if (id === "dicionario") return viewDicionario();
  if (id === "livros") return viewLivros();
  if (id === "treino") return viewTreino();
  if (id === "yoga") return viewYoga();
  if (id === "meditacao") return viewMeditacao();
  if (id === "etiqueta") return viewEtiqueta();
  if (id === "habitos") return viewHabitos();
  if (id === "metas") return viewMetas();
  if (id === "rotina") return viewRotina();
  if (id === "mindzone") return viewMindZone();
  if (id === "sono") return viewSono();
  if (id === "coach") return viewCoach();
  if (id === "encontros") return viewEncontros();
  if (id === "lifeos") return viewLifeOS();
  if (id === "loja") return viewLoja();
  return renderComplementarHome();
}

function uidKey(k) {
  return k + "_" + (session.uid || "anon");
}

function back() {
  return `<div class="back-link" data-nav="complementar">← Complementar</div>`;
}

function viewAlimentacao() {
  const vetores = [
    { n: "01 Base", t: "Estabilidade", d: "Refeições regulares. Proteína e hidratação antes de decisões pesadas." },
    { n: "02 Criativo", t: "Variedade", d: "Cores e texturas — mente aberta sem caos de excesso." },
    { n: "03 Execução", t: "Combustível", d: "Evitar pico de açúcar antes de blocos de foco." },
    { n: "04 Relacional", t: "Mesa", d: "Uma refeição consciente por semana com alguém de valor." },
    { n: "05 Comunicação", t: "Voz", d: "Hidratação e menos irritantes antes de pitch/call." },
    { n: "06 Visão", t: "Planejar", d: "Lista de compras = roadmap semanal do corpo." },
    { n: "07 Governança", t: "Ritmo", d: "Sono e limite de cafeína como política, não humor." }
  ];
  return `<div class="view active">${back()}
    <p class="hero-line">Complementar</p>
    <h2 class="hero-title">Alimentação saudável</h2>
    <p class="hero-sub">Mesma lógica dos 7 vetores — corpo como infraestrutura de performance.</p>
    <div class="module-list">${vetores
      .map(
        (v) => `<div class="mod-row">
      <div class="mod-num">${v.n.split(" ")[0]}</div>
      <div class="mod-body"><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p></div>
    </div>`
      )
      .join("")}</div>
    <p class="notes-hint" style="margin-top:16px">Material detalhado e planos no grupo WhatsApp quando liberados.</p>
  </div>`;
}

function viewConstelacao() {
  const etapas = [
    ["01", "Investigação", "Diagnóstico sistêmico antes do protocolo. Escassez herdada, criatividade silenciada, procrastinação como protesto."],
    ["02", "Resolução", "Honrar o sistema sem repetir o medo. “Eu honro o destino de vocês, mas não preciso repetir o sofrimento.”"],
    ["03", "Solução", "Tomar o lugar de adulto. Aceitar o que os pais puderam dar. Dar com limite. Cobrar o justo."],
    ["04", "Revisão", "Ver se o fluxo segue aberto: culpa ao receber, sabotagem após sucesso, silêncio sobre dinheiro."],
    ["05", "Reflexão", "Carta (não enviada) à geração que mais sofreu financeiramente."],
    ["06", "Segredo", "Nomear o oculto. Reintegrar o excluído. Discrição absoluta."]
  ];
  const mods = [
    ["1 Reserva", "Lealdade à escassez herdada", "Poupança sem ansiedade crônica"],
    ["2 Ideia", "Criatividade bloqueada por lealdade", "Inovar sem culpa"],
    ["3 Execução", "Decidir como adulto", "Ação sem paralisação"],
    ["4 Rede", "Dar com limite, receber sem culpa", "Rede sem auto-sabotagem"],
    ["5 Pitch", "Dar voz ao que foi silenciado", "Cobrar o valor justo"],
    ["6 Visão", "Honrar a linhagem ao construir maior", "Planejar sem medo de sonhar"],
    ["7 Legado", "Governar dinheiro a serviço da vida", "Opulência integrada"]
  ];
  return `<div class="view active">${back()}
    <p class="hero-line">Complementar</p>
    <h2 class="hero-title">Constelação familiar</h2>
    <p class="hero-sub">Camada paralela aos 7 módulos. Não é terapia clínica — é desbloqueio de ativo estagnado.</p>
    <div class="stat-card" style="margin-bottom:16px">
      <div class="lbl">Três ordens no dinheiro</div>
      <div class="hint" style="margin-top:10px;line-height:1.8">
        <b>Pertencimento</b> — julgar ancestral pobre é se excluir da prosperidade.<br>
        <b>Hierarquia</b> — recusar o que veio dos pais bloqueia a entrada.<br>
        <b>Dar–tomar</b> — cobrar de menos ou receber de mais afasta o fluxo.<br>
        Metáfora: mãe = dinheiro (entrada). Pai = riqueza (estrutura).
      </div>
    </div>
    <h3 class="section-h">Ciclo de 6 etapas</h3>
    <div class="module-list">${etapas.map(([n,t,d]) => `<div class="mod-row"><div class="mod-num">${n}</div><div class="mod-body"><h3>${t}</h3><p>${esc(d)}</p></div></div>`).join("")}</div>
    <h3 class="section-h">Sobreposição aos módulos</h3>
    <div class="mat-grid">${mods.map(([a,b,c]) => `<div class="mat-card"><h4>Módulo ${esc(a)}</h4><p>${esc(b)}</p><p class="notes-hint">${esc(c)}</p></div>`).join("")}</div>
    <button class="tool-btn" type="button" data-nav="call">Ir para Call</button>
  </div>`;
}

function viewDicionario() {
  return `<div class="view active">${back()}
    <p class="hero-line">Complementar</p>
    <h2 class="hero-title">Dicionário</h2>
    <p class="hero-sub">Finanças · marketing · startups · operação</p>
    <div class="mat-grid">${DICT.map(
      (x) => `<div class="mat-card"><h4>${esc(x.t)}</h4><p>${esc(x.d)}</p></div>`
    ).join("")}</div>
    <p class="notes-hint" style="margin-top:12px">Lista viva — novos termos entram sem quebrar a plataforma.</p>
  </div>`;
}

function viewLivros() {
  return `<div class="view active">${back()}
    <p class="hero-line">Bônus de membro</p>
    <h2 class="hero-title">Livros dos 7 vetores</h2>
    <p class="hero-sub">Quem está na plataforma já tem acesso. Peça o PDF no WhatsApp — um por vez.</p>
    <div class="mat-grid">${LIVROS.map((l) => `<div class="mat-card"><h4>${l.n} · ${esc(l.nome)}</h4>
      <p>Vetor ${esc(l.vetor)}</p>
      <button class="tool-btn" type="button" onclick="window.afPedirLivro('${esc(l.nome)}')">Pedir no WhatsApp</button></div>`).join("")}</div>
  </div>`;
}

function viewTreino() {
  const maq = [
    ["01", "Leg press / agachamento guiado", "assets/img/treino/chakra-01.jpg"],
    ["02", "Cadeira extensora / flexora", "assets/img/treino/chakra-02.jpg"],
    ["03", "Supino máquina / peck deck", "assets/img/treino/chakra-03.jpg"],
    ["04", "Remada baixa / puxada frente", "assets/img/treino/chakra-04.jpg"],
    ["05", "Desenvolvimento máquina", "assets/img/treino/chakra-05.jpg"],
    ["06", "Rosca scott / tríceps pulley", "assets/img/treino/chakra-06.jpg"],
    ["07", "Prancha + abdominal máquina", "assets/img/treino/chakra-07.jpg"]
  ];
  const halt = [
    ["01", "Agachamento goblet", "assets/img/treino/halter-a.jpg"],
    ["02", "Terra romeno", "assets/img/treino/halter-b.jpg"],
    ["03", "Supino com halteres", "assets/img/treino/halter-c.jpg"],
    ["04", "Remada curvada", "assets/img/treino/halter-a.jpg"],
    ["05", "Desenvolvimento com halteres", "assets/img/treino/halter-b.jpg"],
    ["06", "Rosca + tríceps testa", "assets/img/treino/halter-c.jpg"],
    ["07", "Farmers walk + prancha", "assets/img/treino/halter-a.jpg"]
  ];
  const card = (n, nome, src, tipo) => `<div class="mat-card"><img class="shop-ph-img" src="${src}" alt="">
    <h4>${n} · ${esc(nome)}</h4><p>${tipo}</p>
    <p class="notes-hint">1ª 12 reps carga X · 2ª 10 reps +peso · 3ª 8 reps +peso. Forma quebrou = mantém. Fechou as 3 = +2–5% na semana.</p></div>`;
  return `<div class="view active">${back()}
    <p class="hero-line">Complementar</p>
    <h2 class="hero-title">Treino e exercícios</h2>
    <p class="hero-sub">Dois protocolos. Execução acima de ego.</p>
    <div class="stat-card" style="margin:12px 0">
      <div class="lbl">Respiração · 2 ciclos por repetição</div>
      <div class="hint" style="margin-top:8px;line-height:1.7">Inspira → faz a força expirando → inspira ao finalizar → retorna devagar expirando → inspira e inicia de novo.</div>
    </div>
    <h3 class="section-h">Treino nas máquinas</h3>
    <div class="mat-grid">${maq.map((x) => card(x[0], x[1], x[2], "Máquina")).join("")}</div>
    <h3 class="section-h">Treino com halteres</h3>
    <div class="mat-grid">${halt.map((x) => card(x[0], x[1], x[2], "Halter")).join("")}</div>
  </div>`;
}

function viewYoga() {
  const slots = [
    ["01", "Série Raiz", "Slot imagem + posturas de estabilidade. 396 Hz."],
    ["02", "Série Sacral", "Slot imagem + fluxo de quadril. 417 Hz."],
    ["03", "Série Plexo", "Slot imagem + core suave. 528 Hz."],
    ["04", "Série Cardíaco", "Slot imagem + abertura peitoral. 639 Hz."],
    ["05", "Série Garganta", "Slot imagem + cervical e hum. 741 Hz."],
    ["06", "Série Frontal", "Slot imagem + criança / testa. 852 Hz."],
    ["07", "Série Coronário", "Slot imagem + savasana. 963 Hz."],
    ["08", "Série integrada", "Os 7 vetores em 12–15 min. Slot vídeo."],
    ["09", "Saudação ao sol", "Slot sequência + vídeo. Manhã."],
    ["10", "Saudação à lua", "Slot sequência + vídeo. Noite."]
  ];
  return `<div class="view active">${back()}
    <p class="hero-line">Estrutura pronta</p>
    <h2 class="hero-title">Yoga operacional</h2>
    <p class="hero-sub">Quando você enviar imagens, série, vídeo e faixa — cada slot recebe o arquivo sem redesenhar a página.</p>
    <div class="module-list">${slots.map(([n,t,d]) => `<div class="mod-row"><div class="mod-num">${n}</div><div class="mod-body"><h3>${esc(t)}</h3><p>${esc(d)}</p></div><div class="slot-flag">IMG · ÁUDIO · VÍDEO</div></div>`).join("")}</div>
  </div>`;
}

function viewEtiqueta() {
  const cards = [
    {
      n: "01",
      title: "Base · Presença",
      visual: "◇",
      do: "Chegue 5 min antes. Celular no silencioso, fora da mesa em reuniões presenciais.",
      dont: "Não entre na call com a casa em caos no fundo e o microfone no máximo.",
      tip: "Estabilidade visual = estabilidade de percepção de valor."
    },
    {
      n: "02",
      title: "Criativo · Apresentação",
      visual: "◈",
      do: "Uma peça de personalidade (relógio, lapela, cor discreta). Higiene e corte impecáveis.",
      dont: "Não use perfume forte em ambiente fechado ou call longa.",
      tip: "Diferenciação sem gritar — o mesmo princípio do produto premium."
    },
    {
      n: "03",
      title: "Execução · Pontualidade",
      visual: "▶",
      do: "Confirme horário e link no dia anterior. Termine 2 min antes se o próximo compromisso for de quem te recebe.",
      dont: "Não “já estou chegando” repetidas vezes. Ou chega, ou reagenda.",
      tip: "Tempo é a moeda que a etiqueta protege."
    },
    {
      n: "04",
      title: "Relacional · Mesa e acolhimento",
      visual: "○",
      do: "Cumprimente pelo nome. Ofereça água. Escute o pedido completo antes de responder.",
      dont: "Não interrompa para “já sei o que você vai dizer”.",
      tip: "Reciprocidade começa no respeito ao turno de fala."
    },
    {
      n: "05",
      title: "Comunicação · Call e voz",
      visual: "◎",
      do: "Olhe para a câmera ao fechar o ponto. Fale em blocos curtos. Confirme o próximo passo em voz alta.",
      dont: "Não diga “tá me ouvindo?” a cada frase. Teste áudio antes.",
      tip: "Etiqueta de voz = parte do pitch (módulo 5)."
    },
    {
      n: "06",
      title: "Visão · Ambiente e longo prazo",
      visual: "▣",
      do: "Fundo neutro ou blur. Luz na frente do rosto. Mesa limpa no enquadramento.",
      dont: "Não deixe documentos de outros clientes visíveis atrás de você.",
      tip: "O cenário conta a história da sua governança."
    },
    {
      n: "07",
      title: "Governança · Legado de trato",
      visual: "★",
      do: "Agradeça por escrito após reunião importante. Cumpra o que prometeu no follow-up.",
      dont: "Não some depois do “vamos alinhar”.",
      tip: "Reputação é patrimônio composto — etiqueta é a taxa de juros."
    }
  ];

  const scenes = [
    { title: "Primeiro encontro", items: ["Aperto firme, 2 segundos", "Cartão ou link só se pedirem", "Não fale de preço nos primeiros 30s"] },
    { title: "Call de fechamento", items: ["Câmera na altura dos olhos", "Água perto, sem canudo barulhento", "Silêncio depois da proposta — não preencha o vazio com desconto"] },
    { title: "Mesa / almoço de negócios", items: ["Espere o anfitrião indicar o lugar", "Celular virado para baixo", "Não peça a conta se você convidou — você conduz"] }
  ];

  return `<div class="view active">${back()}
    <p class="hero-line">Complementar</p>
    <h2 class="hero-title">Etiqueta</h2>
    <p class="hero-sub">Protocolo de presença — mesma arquitetura dos 7 vetores. Visual, prático, mensurável.</p>

    <h3 class="section-h">Os 7 protocolos</h3>
    <div class="etiq-grid">
      ${cards
        .map(
          (c) => `<div class="etiq-card">
        <div class="etiq-visual">${c.visual}</div>
        <div class="etiq-num">${c.n}</div>
        <h4>${esc(c.title)}</h4>
        <p class="etiq-do"><span>Fazer</span>${esc(c.do)}</p>
        <p class="etiq-dont"><span>Evitar</span>${esc(c.dont)}</p>
        <p class="etiq-tip">${esc(c.tip)}</p>
      </div>`
        )
        .join("")}
    </div>

    <h3 class="section-h">Cenas reais</h3>
    <div class="mat-grid">
      ${scenes
        .map(
          (s) => `<div class="mat-card">
        <h4>${esc(s.title)}</h4>
        <ul class="etiq-list">${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      </div>`
        )
        .join("")}
    </div>

    <h3 class="section-h">Checklist rápido (antes de sair de casa / entrar na call)</h3>
    <div class="stat-card" style="max-width:560px">
      <div class="hint" style="margin-top:4px;line-height:1.85">
        □ Higiene e roupa alinhadas ao contexto<br>
        □ Fundo e luz ok<br>
        □ Áudio testado<br>
        □ Nome do interlocutor anotado<br>
        □ Um objetivo claro para a conversa<br>
        □ Próximo passo que você pode oferecer
      </div>
    </div>
    <p class="notes-hint" style="margin-top:14px">Imagens de referência e vídeos curtos: você pode colar links no grupo; a estrutura já está pronta para receber mídia.</p>
  </div>`;
}

function viewLifeOS() {
  const tools = [
    { id: "cashflow", name: "Cash-flow", mod: "01" },
    { id: "ideation", name: "Ideação", mod: "02" },
    { id: "execution", name: "Execução", mod: "03" },
    { id: "network", name: "Rede", mod: "04" },
    { id: "pitch", name: "Pitch", mod: "05" },
    { id: "fono", name: "Fono", mod: "05" },
    { id: "vision", name: "Visão", mod: "06" },
    { id: "legacy", name: "Legado", mod: "07" }
  ];
  return `<div class="view active">${back()}
    <p class="hero-line">Life OS</p>
    <h2 class="hero-title">Sistema operacional</h2>
    <p class="hero-sub">Só as ferramentas já existentes — organizadas num único painel. Sem apps duplicados.</p>
    <div class="mat-grid">${tools
      .map(
        (x) => `<div class="mat-card"><h4>${esc(x.name)}</h4><p>Módulo ${x.mod}</p>
      <button class="tool-btn" type="button" data-tool="${x.id}">Abrir em segundo plano</button></div>`
      )
      .join("")}</div>
  </div>`;
}

function viewLoja() {
  return `<div class="view active">${back()}
    <p class="hero-line">Lojinha</p>
    <h2 class="hero-title">Akasha</h2>
    <p class="hero-sub">Top: 3 cores. Demais: peça única. Pedido → dados → WhatsApp 71 98344-8621.</p>
    <div class="mat-grid">${LOJA.map((p) => {
      const colors = (p.colors || [])
        .map((c, i) => {
          const img = p.id === "top" ? ["assets/img/loja/top-amarelo.jpg","assets/img/loja/top-creme.jpg","assets/img/loja/top-mostarda.jpg"][i] : p.img;
          return `<button type="button" class="swatch" onclick="window.afPickCor('${p.id}','${esc(c)}','${img}')">${esc(c)}</button>`;
        })
        .join("");
      return `<div class="mat-card shop-card">
      <img class="shop-ph-img" id="img-${p.id}" src="${p.img}" alt="${esc(p.name)}">
      <h4>${esc(p.name)}</h4>
      <p>${esc(p.price)}</p>
      ${p.colors ? `<div class="swatch-row">${colors}</div><p class="notes-hint" id="cor-${p.id}">Cor: Cru</p>` : ""}
      <div class="cash-row"><input id="qty-${p.id}" type="number" min="1" value="1" style="max-width:90px"><button class="tool-btn" type="button" onclick="window.afAbrirPedido('${p.id}')">Fazer pedido</button></div>
    </div>`;
    }).join("")}</div>
    <div id="shopModal" class="shop-modal" hidden>
      <div class="shop-modal-card">
        <h3>Dados do pedido</h3>
        <p class="notes-hint" id="shopResumo">—</p>
        <label>Nome</label><input id="pedNome" placeholder="Seu nome">
        <label>E-mail</label><input id="pedEmail" type="email" placeholder="voce@email.com">
        <label>CEP</label><input id="pedCep" placeholder="00000-000">
        <div class="modal-f" style="border:0;padding:12px 0 0">
          <button class="btn btn-inline" type="button" onclick="window.afEnviarPedido()">Enviar no WhatsApp</button>
          <button class="btn-ghost" type="button" onclick="document.getElementById('shopModal').hidden=true">Cancelar</button>
        </div>
      </div>
    </div>
  </div>`;
}

function defaultHabits() {
  return [
    { id: "h1", name: "Reserva / auditoria 10 min", on: false },
    { id: "h2", name: "Bloco de execução 45 min", on: false },
    { id: "h3", name: "1 entrega de valor na rede", on: false },
    { id: "h4", name: "Água + proteína no almoço", on: false },
    { id: "h5", name: "Dormir no horário", on: false }
  ];
}

function viewHabitos() {
  const data = Store.get(uidKey("habits"), { items: defaultHabits() });
  const today = new Date().toISOString().slice(0, 10);
  const done = data.items.filter((h) => h.on).length;
  const pct = Math.round((done / Math.max(data.items.length, 1)) * 100);
  return `<div class="view active">${back()}
    <p class="hero-line">Complementar · novo</p>
    <h2 class="hero-title">Hábitos</h2>
    <p class="hero-sub">Consistência que transforma. Grava neste aparelho.</p>
    <div class="stat-card" style="margin-bottom:16px">
      <div class="lbl">Hoje · ${today}</div>
      <div class="val">${pct}%</div>
      <div class="hint">${done}/${data.items.length} concluídos</div>
      <div class="track"><div class="track-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="habit-list">${data.items.map((h) => `<label class="habit-row"><input type="checkbox" ${h.on ? "checked" : ""} onchange="window.afToggleHabito('${h.id}')"><span>${esc(h.name)}</span></label>`).join("")}</div>
    <div class="cash-row" style="margin-top:16px">
      <input id="habNew" placeholder="Novo hábito">
      <button class="tool-btn" type="button" onclick="window.afAddHabito()">Adicionar</button>
    </div>
  </div>`;
}

function viewMetas() {
  const data = Store.get(uidKey("goals"), { items: [] });
  return `<div class="view active">${back()}
    <p class="hero-line">Não existia no AF</p>
    <h2 class="hero-title">Metas</h2>
    <p class="hero-sub">Não substitui a Visão 1 página do módulo 6.</p>
    <div class="cash-row"><input id="gTitle" placeholder="Nova meta"><input id="gWhen" type="date"></div>
    <div class="cash-row"><input id="gMetric" placeholder="Métrica (ex: R$ 8.000 reserva)"><button class="tool-btn" type="button" onclick="window.afAddMeta()">⬡ Nova Meta</button></div>
    <div class="mat-grid" style="margin-top:16px">${data.items.length ? data.items.map((g) => `<div class="mat-card"><h4>${esc(g.title)}</h4><p>${esc(g.metric || "—")}</p><p class="notes-hint">Prazo ${esc(g.when || "—")} · ${g.done ? "concluída" : "aberta"}</p><button class="tool-btn" type="button" onclick="window.afToggleMeta('${g.id}')">${g.done ? "Reabrir" : "Concluir"}</button></div>`).join("") : "<p class='empty'>Nenhuma meta ainda.</p>"}</div>
  </div>`;
}

function viewRotina() {
  const today = new Date().toISOString().slice(0, 10);
  const data = Store.get(uidKey("routine"), { day: today, tasks: [] });
  return `<div class="view active">${back()}
    <p class="hero-line">Não existia no AF</p>
    <h2 class="hero-title">Rotina</h2>
    <p class="hero-sub">Tarefas do dia. A Execução semanal do módulo 3 continua nas Ferramentas.</p>
    <div class="stat-card" style="margin-bottom:14px"><div class="lbl">Hoje</div><div class="val" style="font-size:1.3rem">${today}</div></div>
    <div class="cash-row"><input id="rTask" placeholder="Tarefa de hoje"><button class="tool-btn" type="button" onclick="window.afAddRotina()">Adicionar</button></div>
    <div class="habit-list" style="margin-top:12px">${data.tasks.length ? data.tasks.map((t) => `<label class="habit-row"><input type="checkbox" ${t.on ? "checked" : ""} onchange="window.afToggleRotina('${t.id}')"><span>${esc(t.name)}</span></label>`).join("") : "<p class='empty'>Sem tarefas neste dia.</p>"}</div>
  </div>`;
}

function viewMindZone() {
  return `<div class="view active">${back()}
    <p class="hero-line">MindZone</p>
    <h2 class="hero-title">Respiração · Foco</h2>
    <div class="mind-box">
      <div class="breath-orb" id="breathOrb">INSPIRA</div>
      <div class="hint" style="text-align:center;margin-top:10px">4s inspira · 4s segura · 4s expira · 4s vazia</div>
      <button class="tool-btn" type="button" onclick="window.afBreath()">Iniciar 2 minutos</button>
    </div>
    <div class="mat-grid">
      <div class="mat-card"><h4>Meditação</h4><p>Slots na aba Meditação guiada.</p><button class="tool-btn" type="button" data-nav="comp:meditacao">Abrir slots</button></div>
      <div class="mat-card"><h4>Jogo de foco</h4><p>12 toques no ritmo.</p><button class="tool-btn" type="button" onclick="window.afFocusGame()">Jogar</button><p class="notes-hint" id="focusScore">Pontos: 0</p></div>
    </div>
  </div>`;
}

function viewSono() {
  const F = [
    [396,"Raiz"],[417,"Sacral"],[528,"Plexo"],[639,"Cardíaco"],[741,"Garganta"],[852,"Frontal"],[963,"Coronário"]
  ];
  return `<div class="view active">${back()}
    <p class="hero-line">Modo sono</p>
    <h2 class="hero-title">Dinheiro entra enquanto você descansa</h2>
    <p class="hero-sub">Saldo em R$ / € / US$ no lugar das ovelhas. 7 frequências = 7 vetores.</p>
    <div class="freq-row">${F.map((x,i)=>`<button class="freq-btn" type="button" onclick="window.afFreq(${x[0]},'${x[1]}')">${String(i+1).padStart(2,"0")}<small>${x[0]} Hz</small></button>`).join("")}</div>
    <div class="cash-row" style="margin-top:14px">
      <select id="sleepCur"><option value="BRL">Real (R$)</option><option value="EUR">Euro (€)</option><option value="USD">Dólar (US$)</option></select>
      <select id="sleepMin"><option value="15">15 min</option><option value="30" selected>30 min</option><option value="45">45 min</option><option value="60">60 min</option></select>
    </div>
    <button class="btn" type="button" style="margin-top:12px" onclick="window.afOpenSleep()">Entrar no modo sono</button>
    <p class="notes-hint">Use fone. Volume baixo. Não substitui tratamento clínico.</p>
  </div>`;
}

function viewCoach() {
  return `<div class="view active">${back()}
    <p class="hero-line">IA desligada</p>
    <h2 class="hero-title">AF Coach ★</h2>
    <p class="hero-sub">Estrutura pronta. A IA não responde até você ligar a camada.</p>
    <div class="stat-card">
      <div class="lbl">Status</div>
      <div class="val" style="font-size:1.2rem">○ Offline</div>
      <textarea class="notes-area" id="coachQ" placeholder="O que você perguntaria ao coach hoje?"></textarea>
      <button class="tool-btn" type="button" onclick="window.afCoachNote()">Guardar pergunta</button>
    </div>
  </div>`;
}

function viewEncontros() {
  return `<div class="view active">${back()}
    <p class="hero-line">Mentoria · anamnese</p>
    <h2 class="hero-title">26 Encontros</h2>
    <p class="hero-sub">O HTML que você anexou vive como página irmã para não quebrar o AF.</p>
    <a class="tool-btn" href="encontros.html" target="_blank" rel="noopener">Abrir Encontros / Anamnese</a>
  </div>`;
}

function viewMeditacao() {
  const F = [
    ["01","Raiz",396,"Segurança"],["02","Sacral",417,"Criar"],["03","Plexo",528,"Execução"],
    ["04","Cardíaco",639,"Rede"],["05","Garganta",741,"Voz"],["06","Frontal",852,"Visão"],["07","Coronário",963,"Propósito"]
  ];
  return `<div class="view active">${back()}
    <p class="hero-line">Camada de áudio</p>
    <h2 class="hero-title">Meditação guiada</h2>
    <p class="hero-sub">Aguardando os arquivos que você vai enviar.</p>
    <div class="mat-grid">${F.map((f)=>`<div class="mat-card"><h4>${f[0]} · ${f[1]} · ${f[2]} Hz</h4><p>${f[3]}</p><div class="audio-slot">▶ Áudio guiado — aguardando arquivo</div></div>`).join("")}</div>
  </div>`;
}

window.afPedirLivro = function (nome) {
  const who = session.name || "Membro AF";
  const msg = "✦ PEDIDO DE LIVRO (membro AF)\n" + who + "\nLivro: " + nome + "\n━━━━━━━━━━━━━━━━\nakashahub · bônus de plataforma";
  window.open("https://wa.me/" + WPP + "?text=" + encodeURIComponent(msg), "_blank");
};

window._shop = { id: "top", cor: "Cru", qty: 1, name: "Top macramê" };

window.afPickCor = function (id, cor, img) {
  window._shop.id = id;
  window._shop.cor = cor;
  const im = document.getElementById("img-" + id);
  if (im && img) im.src = img;
  const lab = document.getElementById("cor-" + id);
  if (lab) lab.textContent = "Cor: " + cor;
};

window.afAbrirPedido = function (id) {
  const p = LOJA.find((x) => x.id === id);
  if (!p) return;
  const qty = parseInt(document.getElementById("qty-" + id)?.value, 10) || 1;
  window._shop = { id, cor: window._shop.cor || (p.colors ? "Cru" : "—"), qty, name: p.name };
  document.getElementById("shopResumo").textContent = p.name + " · cor " + window._shop.cor + " · qtd " + qty;
  document.getElementById("pedNome").value = session.name || "";
  document.getElementById("pedEmail").value = session.email || "";
  document.getElementById("shopModal").hidden = false;
};

window.afEnviarPedido = function () {
  const nome = document.getElementById("pedNome")?.value.trim();
  const email = document.getElementById("pedEmail")?.value.trim();
  const cep = document.getElementById("pedCep")?.value.trim();
  if (!nome || !email || !cep) { alert("Preencha nome, e-mail e CEP."); return; }
  const s = window._shop;
  const msg = "✦ PEDIDO LOJINHA AKASHA\nProduto: " + s.name + "\nCor: " + s.cor + "\nQuantidade: " + s.qty + "\nNome: " + nome + "\nE-mail: " + email + "\nCEP: " + cep + "\n━━━━━━━━━━━━━━━━\nPagamento, frete e endereço final no WhatsApp.";
  window.open("https://wa.me/" + WPP + "?text=" + encodeURIComponent(msg), "_blank");
  document.getElementById("shopModal").hidden = true;
};

window.afToggleHabito = function (id) {
  const data = Store.get(uidKey("habits"), { items: defaultHabits() });
  data.items = data.items.map((h) => (h.id === id ? { ...h, on: !h.on } : h));
  Store.set(uidKey("habits"), data);
};
window.afAddHabito = function () {
  const name = (document.getElementById("habNew")?.value || "").trim();
  if (!name) return;
  const data = Store.get(uidKey("habits"), { items: defaultHabits() });
  data.items.push({ id: "h" + Date.now(), name, on: false });
  Store.set(uidKey("habits"), data);
  document.getElementById("content").innerHTML = viewHabitos();
};
window.afAddMeta = function () {
  const title = document.getElementById("gTitle")?.value.trim();
  if (!title) return;
  const data = Store.get(uidKey("goals"), { items: [] });
  data.items.unshift({ id: "g" + Date.now(), title, metric: document.getElementById("gMetric")?.value.trim() || "", when: document.getElementById("gWhen")?.value || "", done: false });
  Store.set(uidKey("goals"), data);
  document.getElementById("content").innerHTML = viewMetas();
};
window.afToggleMeta = function (id) {
  const data = Store.get(uidKey("goals"), { items: [] });
  data.items = data.items.map((g) => (g.id === id ? { ...g, done: !g.done } : g));
  Store.set(uidKey("goals"), data);
  document.getElementById("content").innerHTML = viewMetas();
};
window.afAddRotina = function () {
  const name = document.getElementById("rTask")?.value.trim();
  if (!name) return;
  const today = new Date().toISOString().slice(0, 10);
  const data = Store.get(uidKey("routine"), { day: today, tasks: [] });
  data.tasks.push({ id: "t" + Date.now(), name, on: false });
  Store.set(uidKey("routine"), data);
  document.getElementById("content").innerHTML = viewRotina();
};
window.afToggleRotina = function (id) {
  const today = new Date().toISOString().slice(0, 10);
  const data = Store.get(uidKey("routine"), { day: today, tasks: [] });
  data.tasks = data.tasks.map((t) => (t.id === id ? { ...t, on: !t.on } : t));
  Store.set(uidKey("routine"), data);
};
window.afBreath = function () {
  const orb = document.getElementById("breathOrb");
  if (!orb) return;
  const seq = ["INSPIRA", "SEGURA", "EXPIRA", "VAZIA"];
  let i = 0, n = 0;
  const tick = () => {
    orb.textContent = seq[i % 4];
    orb.classList.toggle("on", i % 4 < 2);
    i++; n++;
    if (n < 32) setTimeout(tick, 4000);
    else orb.textContent = "✦";
  };
  tick();
};
window.afFocusGame = function () {
  const el = document.getElementById("focusScore");
  if (!el) return;
  let s = 0;
  const play = () => { s++; el.textContent = "Pontos: " + s + (s >= 12 ? " · ritmo ok" : ""); if (s < 12) setTimeout(play, 520); };
  play();
};
window.afCoachNote = function () {
  const q = document.getElementById("coachQ")?.value.trim();
  if (!q) return;
  const data = Store.get(uidKey("coach"), { notes: [] });
  data.notes.unshift({ q, at: Date.now() });
  Store.set(uidKey("coach"), data);
  alert("Pergunta guardada. A IA responde quando você ligar a camada.");
};

let _sleep = { ctx: null, osc: null, timer: null, money: null, total: 0 };
window.afFreq = function (hz, nome) {
  try {
    if (!_sleep.ctx) _sleep.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (_sleep.osc) { try { _sleep.osc.stop(); } catch (e) {} }
    const osc = _sleep.ctx.createOscillator();
    const g = _sleep.ctx.createGain();
    osc.type = "sine"; osc.frequency.value = hz; g.gain.value = 0.04;
    osc.connect(g); g.connect(_sleep.ctx.destination); osc.start();
    _sleep.osc = osc;
    const lab = document.getElementById("sleepFreqLab");
    if (lab) lab.textContent = nome + " · " + hz + " Hz";
  } catch (e) { console.warn(e); }
};
window.afOpenSleep = function () {
  const overlay = document.getElementById("sleepOverlay");
  if (!overlay) return;
  overlay.classList.add("open");
  const cur = document.getElementById("sleepCur")?.value || "BRL";
  const mins = parseInt(document.getElementById("sleepMin")?.value, 10) || 30;
  const fmt = (n) => cur === "EUR" ? "€ " + n.toLocaleString("pt-BR") : cur === "USD" ? "US$ " + n.toLocaleString("en-US") : "R$ " + n.toLocaleString("pt-BR");
  _sleep.total = 0;
  const bal = document.getElementById("sleepBal");
  const list = document.getElementById("sleepTx");
  if (list) list.innerHTML = "";
  const labels = ["Receita passiva", "Royalties", "Dividendo", "Afiliado", "Renda digital", "Consultoria"];
  clearInterval(_sleep.money);
  _sleep.money = setInterval(() => {
    const add = (Math.floor(Math.random() * 9) + 1) * 100;
    _sleep.total += add;
    if (bal) bal.textContent = fmt(_sleep.total);
    if (list) {
      const row = document.createElement("div");
      row.className = "sleep-tx";
      row.textContent = "+" + fmt(add) + " · " + labels[Math.floor(Math.random() * labels.length)];
      list.insertBefore(row, list.firstChild);
      while (list.children.length > 6) list.removeChild(list.lastChild);
    }
  }, 1200);
  window.afFreq(396, "Raiz");
  clearTimeout(_sleep.timer);
  _sleep.timer = setTimeout(() => window.afCloseSleep(), mins * 60 * 1000);
};
window.afCloseSleep = function () {
  document.getElementById("sleepOverlay")?.classList.remove("open");
  clearInterval(_sleep.money);
  clearTimeout(_sleep.timer);
  try { _sleep.osc && _sleep.osc.stop(); } catch (e) {}
  _sleep.osc = null;
};

