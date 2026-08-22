/**
 * Área Complementar + LifeOS (organizado) + Lojinha
 * Sem duplicar ferramentas já existentes — só organiza e adiciona hubs
 */
import { esc } from "./navigation.js";

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
    desc: "Práticas curtas com a mesma lógica de protocolo da mentoria."
  },
  {
    id: "etiqueta",
    name: "Etiqueta",
    desc: "Presença, mesa, call e networking — protocolo visual alinhado aos 7 vetores."
  },
  {
    id: "lifeos",
    name: "Life OS",
    desc: "Painel único das ferramentas já existentes — sem apps repetidos."
  },
  {
    id: "loja",
    name: "Lojinha Akasha",
    desc: "Mini vitrine: canetas, gravatas, joias e artigos selecionados."
  }
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
  { t: "Sunk cost", d: "Custo já irrecuperável — não deve guiar a próxima decisão sozinho." }
];

const LOJA = [
  { id: "caneta", name: "Caneta de grife", price: "Sob consulta", note: "Imagem e link em breve" },
  { id: "gravata", name: "Gravata", price: "Sob consulta", note: "Imagem e link em breve" },
  { id: "joia", name: "Joia / acessório", price: "Sob consulta", note: "Imagem e link em breve" },
  { id: "outro", name: "Artigo selecionado", price: "Sob consulta", note: "Espaço para novos itens" }
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
  if (id === "etiqueta") return viewEtiqueta();
  if (id === "lifeos") return viewLifeOS();
  if (id === "loja") return viewLoja();
  return renderComplementarHome();
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
  return `<div class="view active">${back()}
    <p class="hero-line">Complementar</p>
    <h2 class="hero-title">Constelação familiar</h2>
    <p class="hero-sub">Camada sistêmica paralela à mentoria. Não substitui terapia clínica.</p>
    <div class="stat-card" style="max-width:560px;margin-bottom:16px">
      <div class="lbl">Como opera</div>
      <div class="hint" style="margin-top:10px;line-height:1.75">
        · Sessões complementares com o mentor (agenda no grupo)<br>
        · Material paralelo enviado no WhatsApp<br>
        · Roteiros de sessão ficam no painel do mentor (Firestore)<br>
        · Foco: lealdades invisíveis que travam ativo financeiro
      </div>
    </div>
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
    <p class="hero-line">Complementar</p>
    <h2 class="hero-title">Livros dos 7 vetores</h2>
    <p class="hero-sub">Leitura dentro da plataforma. PDFs completos no grupo quando aplicável.</p>
    <div class="mat-grid">
      ${[1, 2, 3, 4, 5, 6, 7]
        .map(
          (n) => `<div class="mat-card"><h4>Vetor 0${n}</h4>
        <p>Conteúdo HTML do grimório correspondente — em expansão.</p>
        <button class="tool-btn" type="button" data-nav="module:module0${n}">Ir ao módulo 0${n}</button></div>`
        )
        .join("")}
    </div>
  </div>`;
}

function viewTreino() {
  return `<div class="view active">${back()}
    <p class="hero-line">Complementar</p>
    <h2 class="hero-title">Treino e exercícios</h2>
    <p class="hero-sub">Fundamentos: consistência &gt; intensidade esporádica.</p>
    <div class="mat-grid">
      <div class="mat-card"><h4>Mobilidade 10 min</h4><p>Coluna, quadril, ombros — antes de bloco de execução.</p></div>
      <div class="mat-card"><h4>Caminhada de decisão</h4><p>20–30 min sem fone para processar uma decisão estratégica.</p></div>
      <div class="mat-card"><h4>Postura de call</h4><p>Pés no chão, peito aberto, queixo paralelo — presença na negociação.</p></div>
    </div>
  </div>`;
}

function viewYoga() {
  return `<div class="view active">${back()}
    <p class="hero-line">Complementar</p>
    <h2 class="hero-title">Yoga operacional</h2>
    <p class="hero-sub">Protocolo curto — mesma lógica da mentoria: tempo, intenção, devolução.</p>
    <div class="module-list">
      <div class="mod-row"><div class="mod-num">01</div><div class="mod-body"><h3>Raiz · estabilidade</h3><p>5 min respiração + postura de montanha.</p></div></div>
      <div class="mod-row"><div class="mod-num">02</div><div class="mod-body"><h3>Fluxo criativo</h3><p>Abertura de quadril leve + respiração lateral.</p></div></div>
      <div class="mod-row"><div class="mod-num">03</div><div class="mod-body"><h3>Centro de ação</h3><p>Core suave + foco no plexo (sem forçar).</p></div></div>
      <div class="mod-row"><div class="mod-num">05</div><div class="mod-body"><h3>Voz e garganta</h3><p>Alongamento cervical + hum curto antes do pitch.</p></div></div>
    </div>
    <p class="notes-hint">Séries guiadas e vídeos: liberação no grupo.</p>
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
    <p class="hero-line">Lógico</p>
    <h2 class="hero-title">Lojinha Akasha</h2>
    <p class="hero-sub">Mini vitrine. Imagens e checkout entram quando você enviar os arquivos.</p>
    <div class="mat-grid">${LOJA.map(
      (p) => `<div class="mat-card shop-card">
      <div class="shop-ph">◇</div>
      <h4>${esc(p.name)}</h4>
      <p>${esc(p.price)}</p>
      <p class="notes-hint">${esc(p.note)}</p>
    </div>`
    ).join("")}</div>
  </div>`;
}
