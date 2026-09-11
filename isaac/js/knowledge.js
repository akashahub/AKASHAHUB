/**
 * Base operacional extraída dos materiais da pasta
 * C:\Users\lomab\OneDrive\Área de Trabalho\isaac
 *
 * Tudo aqui é CONFIRMADO pelos materiais, salvo quando marcado HIPÓTESE.
 * Números de decks diferentes NÃO foram fundidos.
 */

export const SOURCES = {
  treino: "Capacitação/Treinamento Parceiros.pdf",
  ssa: "Escolas parceiras isaac - SSA.html",
  superior: "Para ás Faculdades/Onepager_Associados_Ensino Superior_V2.pdf",
  videoAbordagem: "Como abordar a instituição.mp4",
  videoConte: "Conte com o isaac.mp4",
  videoPerfil: "Perfil de associados.mp4"
};

export const WHAT_ISAAC_IS = {
  oneLiner:
    "A maior plataforma de soluções financeiras feita para escolas.",
  source: SOURCES.treino,
  forWhom: "Instituições de ensino privadas — educação básica e, em material separado, ensino superior.",
  job:
    "Ajudar a instituição a ter previsibilidade de caixa, reduzir o peso da inadimplência e da cobrança, e devolver tempo ao pedagógico.",
  not:
    "Não é mentoria de estudos, não é Isaac Teirson, não é produto da Akasha, não é Alinhamento Financeiro."
};

export const DELIVERS = [
  {
    id: "previsibilidade",
    title: "Previsibilidade financeira",
    text: "Garantia de 100% das mensalidades na data combinada, todo mês.",
    source: SOURCES.treino
  },
  {
    id: "gestao",
    title: "Gestão na palma da mão",
    text: "Mais controle e visibilidade da gestão financeira.",
    source: SOURCES.treino
  },
  {
    id: "familias",
    title: "Suporte e facilidade às famílias",
    text: "Aplicativo para famílias: múltiplos meios de pagamento, negociação de pendências, faturas e comprovantes, segurança nos dados.",
    source: SOURCES.treino
  },
  {
    id: "crescimento",
    title: "Crescimento",
    text: "Soluções financeiras de apoio ao crescimento: isaac crédito, diagnóstico (em piloto), isaac gestão, plataforma de pagamentos, isaac seguros.",
    source: SOURCES.treino
  }
];

export const PRODUCTS = [
  {
    id: "receita",
    name: "Receita / repasse na data combinada",
    note: "Promessa oficial do treino: 100% das mensalidades na data combinada. Condições comerciais saem na análise do time isaac — SDR não fecha taxa.",
    source: SOURCES.treino
  },
  {
    id: "app-familias",
    name: "App para famílias",
    note: "Pix, boleto e cartão. Lembretes, horários estendidos, negociação.",
    source: SOURCES.treino
  },
  {
    id: "credito",
    name: "isaac crédito / antecipação de repasse",
    note: "Material cita taxas a partir de 1,99% a.m. (antecipação) e 2,99% a.m. (crédito), elegibilidade por tempo de parceria, até 70% do próximo repasse. SUJEITO À APROVAÇÃO. Não prometer crédito nem taxa.",
    source: SOURCES.treino
  },
  {
    id: "diagnostico",
    name: "isaac Diagnóstico",
    note: "Em piloto. Relatório de receita, folha, impostos, custos, extras; comparação regional.",
    source: SOURCES.treino
  },
  {
    id: "seguro",
    name: "Seguro Familiar isaac (Porto Seguro)",
    note: "Benefício da parceria. Cobre mensalidades em perda de emprego, perda de renda por incapacidade temporária e falecimento, com condições (idade, carência, CLT etc.). Não vender como seguro avulso na call de SDR.",
    source: SOURCES.treino
  },
  {
    id: "gestao",
    name: "isaac gestão / plataforma de pagamentos",
    note: "Citado no ecossistema do treino. Detalhe operacional fica com o time isaac.",
    source: SOURCES.treino
  },
  {
    id: "meu-arco",
    name: "Meu Arco (ensino superior)",
    note: "No onepager de faculdades: pagamentos, negociações, comunicação e matrícula digital. Não usar esse nome em call de escola básica sem confirmar.",
    source: SOURCES.superior
  }
];

export const NUMBER_DIVERGENCE = {
  warning:
    "Decks oficiais discordam nos totais. Não fundir. Não citar número se a conversa não for do segmento do material.",
  escola: {
    source: SOURCES.treino,
    facts: ["+1.900 escolas parceiras", "+650 mil alunos impactados", "+50% de escolas indicadas"]
  },
  superior: {
    source: SOURCES.superior,
    facts: [
      "R$ 7 bi de receita garantida",
      "16% a mais de crescimento",
      "9% a mais de retenção",
      "R$ 430 mi em crédito concedido",
      "+50 instituições abriram novas unidades com apoio do isaac",
      "+2.800 instituições parceiras",
      "97% de retenção",
      "NPS 89",
      "1 nova instituição parceira a cada 24h",
      "Grupo Arco; Top Educação 2024 e 2025 — Gestão Financeira"
    ]
  }
};

export const POSITIONING = {
  more: [
    "segurança", "previsibilidade", "organização", "tempo para o pedagógico",
    "controle", "tecnologia", "tranquilidade", "crescimento"
  ],
  less: [
    "inadimplência", "cobrança manual", "imprevisibilidade", "retrabalho",
    "planilha", "preocupação de caixa"
  ],
  question:
    "Como podemos tornar esta instituição mais previsível, organizada, segura e capaz de crescer?",
  neverPromise: [
    "percentual de redução de inadimplência inventado",
    "ROI, ganho ou economia garantidos",
    "crédito aprovado",
    "taxa ou preço",
    "comissão",
    "NPS / reputação de fonte que não seja o material em uso",
    "aprovação, vaga, nota (isso é outro isaac — Teirson — e não entra aqui)"
  ]
};

export const APPROACH = {
  source: SOURCES.ssa,
  tips: [
    "Personalize. Gestores prezam relacionamento local. Mencione previsibilidade, inadimplência, sazonalidade de rematrícula.",
    "Não venda só 'plataforma financeira'. Fale em devolver tempo ao pedagógico.",
    "Para mantenedor, o gatilho citado no material é previsibilidade de caixa / inadimplência zero — use como hipótese de dor, não como diagnóstico.",
    "WhatsApp ou e-mail sem resposta em 48h → ligação rápida de acompanhamento."
  ],
  template:
    "Olá, [Nome do Mantenedor / Gestor / Diretor], tudo bem?\n\nSou o [Seu Nome], moro próximo à [escola], e resolvi te chamar porque acompanho o mercado educacional. Inclusive recentemente me tornei parceiro do isaac (plataforma de soluções para escolas) que acredito ser uma solução bem interessante pra você.\n\nGestão financeira e controle de inadimplência demandam tempo precioso da direção das escolas em Salvador. O isaac apoia mantenedores garantindo a receita das mensalidades em dia e cuidando de toda a régua de cobrança de forma humanizada, além de apoio à expansão por meio de crédito e outras facilidades. Me avise se fizer sentido te conectar com eles que posso fazer essa ponte :)"
};

export const VIDEO_NOTES = [
  {
    source: SOURCES.videoAbordagem,
    text: "Comece simples, reconheça o trabalho da instituição. Se já têm solução financeira, pergunte se atende, se houve inadimplência ou falta de previsibilidade."
  },
  {
    source: SOURCES.videoConte,
    text: "Associado tem material, treino, eventos, régua de comunicação. Bonificação cai em cartão de associado. Não inventar percentual."
  },
  {
    source: SOURCES.videoPerfil,
    text: "Melhor indicação nasce de relação de confiança. Instituição precisa confiar no olhar de quem indica."
  }
];

export const PIPELINE = [
  { id: "prospect", label: "Prospects" },
  { id: "tentativa", label: "Tentativa de contato" },
  { id: "contato", label: "Contato realizado" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "interessado", label: "Interessado" },
  { id: "followup", label: "Follow-up" },
  { id: "call_agendada", label: "Call agendada" },
  { id: "encaminhado", label: "Encaminhado ao time isaac" },
  { id: "call_realizada", label: "Call realizada" },
  { id: "aguardando", label: "Aguardando resultado" },
  { id: "parceiro", label: "Ganho / parceiro" },
  { id: "nao_avancou", label: "Não avançou" },
  { id: "reativacao", label: "Reativação" },
  { id: "perdido", label: "Perdido" }
];

export const PRIOR_HISTORY = [
  { id: "desconhecido", label: "Desconhecido" },
  { id: "nunca_contatado", label: "Responsável disse que nunca foi contatado" },
  { id: "ja_recebeu_contato", label: "Já recebeu contato" },
  { id: "conversou_sem_call", label: "Já conversou, não marcou call" },
  { id: "call_agendada_antes", label: "Call agendada anteriormente" },
  { id: "nao_compareceu", label: "Não compareceu" },
  { id: "participou_call", label: "Participou de call" },
  { id: "recebeu_proposta", label: "Recebeu proposta" },
  { id: "nao_avancou", label: "Não avançou" },
  { id: "reativacao", label: "Precisa de reativação" },
  { id: "parceiro", label: "Já parceiro" }
];

export const CONTEXT_MODE = [
  { id: "novo", label: "Novo contato" },
  { id: "ouviu", label: "Já ouviu falar" },
  { id: "contatado", label: "Já foi contatado" },
  { id: "reuniao", label: "Já fez reunião" },
  { id: "nao_fechou", label: "Não fechou" },
  { id: "reativacao", label: "Reativação" },
  { id: "parceiro", label: "Já parceiro — não prospectar" }
];

export const INST_TYPES = [
  { id: "educacao_basica", label: "Educação básica" },
  { id: "ensino_superior", label: "Ensino superior" },
  { id: "grupo", label: "Grupo educacional" },
  { id: "outro", label: "Outro" }
];

/** Lista oficial do HTML de parceiras SSA. Fonte: Escolas parceiras isaac - SSA.html */
export const PARTNERS_SSA = [
  "Aliança Colégio",
  "Cemj Ensino Médio",
  "Centro Educacional ABC",
  "Centro Educacional Alzemira Borges",
  "Centro Educacional Aparecida Pinheiro",
  "Centro Educacional Evolução Infantil",
  "Centro Educacional Maria Consuelo",
  "Centro Educacional Pirâmide",
  "Centro Educacional Recanto das Ilhas",
  "CMCS Colégio Maria Câncio de Souza",
  "Colégio Acadêmico",
  "Colégio Aguiar",
  "Colégio Antônio de Pádua",
  "Colégio Aprendiz",
  "Colégio Carvalho",
  "Colégio Cooperativa Instituto Cultural",
  "Colégio Educare",
  "Colégio Integral",
  "Colégio Maanaim",
  "Colégio Novo Educar",
  "Colégio Parque",
  "Colégio Ramo da Videira",
  "Colégio São Gabriel",
  "Colégio São José",
  "Colégio Sophia",
  "Colégio Visão",
  "Complexo Educacional Damasceno",
  "Duette",
  "Educandário Pedacinho do Céu",
  "Educandário Sodré",
  "Escola A Pequena Sereia",
  "Escola Adonai",
  "Escola Arco Íris",
  "Escola Atlantis",
  "Escola Bem Me Quer",
  "Escola Cordeirinho do Céu",
  "Escola Espaço Interativo",
  "Escola Gênesis",
  "Escola Geração",
  "Escola Miquele",
  "Escola Pequena Estrela",
  "Escola Plural",
  "Escola Professor Bernardino Moreira",
  "Escola Sistema Solar",
  "Escola Sulamericana",
  "Maria Helena",
  "Maria de Lourdes",
  "Pirlilim",
  "Ponto de Partida",
  "Recanto da Emília",
  "São Bento / Colégio de São Bento",
  "Se Chamará Nova Era",
  "Silva e Brito",
  "Sinai Criarte",
  "Sistema Educacional Planeta",
  "Turma da Mônica"
];

/**
 * Objeções.
 * kind: material = resposta do treino oficial
 * kind: framework = arquitetura de investigação (não é argumento factual inventado)
 */
export const OBJECTIONS = [
  {
    id: "sem_inadimplencia",
    said: "Minha escola não tem inadimplência.",
    kind: "material",
    means: "Pode estar orgulhoso do controle, ou medindo só atraso visível, ou fechando a conversa.",
    ask: "Como vocês acompanham isso hoje — e o que aconteceria no caixa se um ciclo de rematrícula viesse mais fraco?",
    value: "Mesmo sem dor aguda de atraso, o isaac fala de previsibilidade, tempo e dados. Crescimento e gestão na palma da mão continuam no material oficial.",
    proof: "Treinamento Parceiros.pdf — resposta oficial: o isaac pode levar a escola a crescimento, tempo de qualidade e dados.",
    advance: "Faz sentido olhar juntos se a previsibilidade de caixa de vocês está no nível que o mantenedor gostaria?",
    stop: "Se o responsável for claro que não há espaço e não há decisor, não force reunião.",
    source: SOURCES.treino
  },
  {
    id: "autonomia",
    said: "Não quero perder minha autonomia no financeiro.",
    kind: "material",
    means: "Medo de perder controle de preço, contrato, relação com a família.",
    ask: "O que, exatamente, vocês não abririam mão de decidir?",
    value: "O isaac não toma decisão pela escola. O gestor continua com autonomia na precificação e na gestão de contratos.",
    proof: SOURCES.treino,
    advance: "Se a autonomia de precificação permanece com vocês, vale ouvir como o repasse entra na prática?",
    stop: "Se o medo for jurídico/contratual fundo, encaminhe ao time isaac — SDR não interpreta contrato.",
    source: SOURCES.treino
  },
  {
    id: "terceirizar",
    said: "Não vou terceirizar o relacionamento com minhas famílias.",
    kind: "material",
    means: "A escola se define pela proximidade. Cobrança parece agressão à relação.",
    ask: "Hoje, quem fala com a família quando o boleto atrasa — e como isso afeta a relação pedagógica?",
    value: "Cobrança e negociação ficam com o isaac, com atendimento humanizado. A escola pode construir relação ainda melhor no pedagógico.",
    proof: SOURCES.treino,
    advance: "Se a cobrança sair da mesa da direção, o que vocês fariam com esse tempo?",
    stop: "Não discuta 'terceirizar o cuidado'. Separe cobrança de vínculo.",
    source: SOURCES.treino
  },
  {
    id: "taxa",
    said: "Qual é a taxa do isaac?",
    kind: "material",
    means: "Quer âncora de preço antes de valor. Ou já está comparando.",
    ask: "Posso te devolver com precisão depois da análise dos relatórios. O que mais pesa hoje: taxa, previsibilidade ou tempo da equipe?",
    value: "A taxa é personalizada. Sai de análise profunda dos relatórios financeiros. SDR não inventa número.",
    proof: SOURCES.treino,
    advance: "Quer que o time isaac olhe os números e volte com a conta real da operação de vocês?",
    stop: "Não chute taxa. Não cite 1,99% / 2,99% de crédito como se fosse taxa da operação escolar.",
    source: SOURCES.treino
  },
  {
    id: "caro",
    said: "O isaac é caro.",
    kind: "material",
    means: "Comparou com boleto próprio, ou ouviu de alguém, ou está testando desconto.",
    ask: "Comparando com o quê — o custo visível do boleto ou o custo invisível de atraso, retrabalho e tempo da direção?",
    value: "A taxa reflete os dados dos relatórios e inclui os custos de operação dos eventos financeiros.",
    proof: SOURCES.treino,
    advance: "Se a gente colocar lado a lado o que vocês gastam hoje para receber, faz sentido uma conversa com o time?",
    stop: "Não barganhe taxa. Encaminhe.",
    source: SOURCES.treino
  },
  {
    id: "ja_falaram",
    said: "Já falaram comigo sobre isso.",
    kind: "framework",
    means: "Histórico existe. Pode ser lead queimado ou só ruído.",
    ask: "Com quem foi, faz tempo, e o que ficou pendente naquela conversa?",
    value: "Registrar histórico. Não recomeçar o pitch do zero.",
    proof: "Não há case obrigatório — use o que a pessoa contar.",
    advance: "O que precisaria ser diferente desta vez para valer uma conversa curta com o time?",
    stop: "Se a pessoa pedir para não ligarem mais, respeite e marque perdido/não avançou."
  },
  {
    id: "ja_reuniao",
    said: "Já fiz reunião.",
    kind: "framework",
    means: "Conhece o produto. A objeção real está depois da reunião.",
    ask: "O que travou depois — taxa, timing, sócio, ou a proposta em si?",
    value: "Reativação é descobrir a objeção verdadeira, não repetir o deck.",
    proof: "",
    advance: "Se a trava mudou, o time isaac retoma a partir dali. Posso encaminhar com esse contexto?",
    stop: "Não remarque reunião só para 'apresentar de novo'."
  },
  {
    id: "agora_nao",
    said: "Agora não.",
    kind: "framework",
    means: "Timing, cansaço, ou recusa educada.",
    ask: "É 'agora não' de calendário (rematrícula, obra, sócio) ou de prioridade?",
    value: "Agendar follow-up concreto. Data na agenda, não 'depois'.",
    proof: "",
    advance: "Posso te ligar em que semana, depois de qual marco?",
    stop: "Se for recusa, não insista no mesmo dia."
  },
  {
    id: "satisfeitos",
    said: "Estamos satisfeitos / já temos sistema.",
    kind: "framework",
    means: "Podem ter boleto, ERP, outro financeiro.",
    ask: "Esse sistema cobre previsibilidade de caixa, cobrança humanizada e a experiência da família — ou só emite cobrança?",
    value: "Material oficial: se já têm solução, perguntar se atende todas as necessidades, inadimplência e previsibilidade.",
    proof: SOURCES.videoAbordagem,
    advance: "Tem alguma ponta (atraso, tempo da secretaria, família reclamando) que ainda dói?",
    stop: "Não ataque o sistema atual."
  },
  {
    id: "cobramos",
    said: "Nós mesmos fazemos a cobrança.",
    kind: "framework",
    means: "Identidade + medo de perder o jeito da casa.",
    ask: "Quem cobra, quanto tempo por semana, e como fica quando a família é próxima da escola?",
    value: "Cobrança humanizada no material. Escola não precisa ser o banco.",
    proof: SOURCES.treino,
    advance: "Se a cobrança sair do colo da direção, o que vocês fariam com as manhãs?",
    stop: "Não humilhe o processo interno."
  },
  {
    id: "nao_decido",
    said: "Não sou quem decide / preciso falar com meu sócio.",
    kind: "framework",
    means: "Você pode estar no influenciador, não no mantenedor.",
    ask: "Quem assina o financeiro — e essa pessoa entra numa conversa de 20 minutos com o time isaac?",
    value: "Mapear autoridade. Não pressionar o não-decisor a fingir que decide.",
    proof: "",
    advance: "Posso te ajudar a levar um resumo objetivo para o sócio, ou marcamos os dois?",
    stop: "Não peça para a secretária 'fechar'."
  },
  {
    id: "manda_material",
    said: "Me manda material.",
    kind: "framework",
    means: "Pode ser interesse real ou adiamento.",
    ask: "O que você gostaria de ver primeiro — previsibilidade, app da família, ou como funciona o repasse?",
    value: "Portal do associado / Associadoteca existe. SDR pode mandar o que for público e marcar um horário para tirar dúvida.",
    proof: "https://olaisaac.my.site.com/Associados/s/login/",
    advance: "Te mando o recorte e te ligo quinta para ver se fez sentido. Qual horário?",
    stop: "Não despeje PDF e suma. Sem data = lead morto."
  },
  {
    id: "dados",
    said: "Como ficam os dados?",
    kind: "framework",
    means: "LGPD, medo de vazar família.",
    ask: "O receio é cadastro das famílias, financeiro, ou os dois?",
    value: "Treino cita segurança nos dados. Detalhe jurídico é do time isaac — não inventar certificação.",
    proof: SOURCES.treino,
    advance: "Anoto a pergunta para o time responder com precisão na call. Seguimos?",
    stop: "Não dê garantia jurídica."
  },
  {
    id: "repasse",
    said: "Como funciona o repasse?",
    kind: "framework",
    means: "Pergunta boa. É o coração do produto.",
    ask: "Hoje o dinheiro entra quando — e o que quebra o mês de vocês quando atrasa?",
    value: "Treino: garantia de 100% das mensalidades na data combinada. Mecânica contratual é do time.",
    proof: SOURCES.treino,
    advance: "Essa é exatamente a conversa da call com o isaac. Posso encaminhar?",
    stop: "Não descreva fluxo bancário que você não viu no contrato."
  }
];

export const CALL_STEPS = [
  {
    id: "abertura",
    title: "Abertura",
    why: "Entrar como gente, não como script.",
    ask: "Posso falar 2 minutos com quem acompanha o financeiro da instituição?",
    watch: "Se cair na secretaria, peça o nome e o melhor horário do mantenedor/diretor. Não faça pitch longo para quem não decide.",
    quick: ["Falei com decisor", "Falei com secretaria", "Não atendeu", "Pediu para ligar depois"]
  },
  {
    id: "contexto",
    title: "Contexto",
    why: "Saber com quem você está e se a escola já é parceira.",
    ask: "Você acompanha caixa e mensalidade aí — é diretor, mantenedor, ou financeiro?",
    watch: "Se o nome bater na lista de parceiras SSA, PARE de prospectar. Agradeça e saia.",
    quick: ["Mantenedor", "Diretor", "Financeiro", "Secretaria", "Já é parceira"]
  },
  {
    id: "historico",
    title: "Histórico com a isaac",
    why: "Salvador provavelmente já foi abordada. Não invente o passado — pergunte.",
    ask: "Vocês já conversaram com a isaac, ou isso é novo para vocês?",
    watch: "Grave a resposta no campo de histórico. A conversa muda a partir daqui.",
    quick: ["Nunca ouviu", "Já ouviu", "Já ligaram", "Já fez reunião", "Recebeu proposta", "Não fechou"]
  },
  {
    id: "descoberta",
    title: "Descoberta",
    why: "Dor real, não slide.",
    ask: "O que mais toma tempo de vocês hoje: atraso de mensalidade, cobrança, previsibilidade de caixa, ou a família reclamando de boleto?",
    watch: "Silêncio. Deixa a pessoa falar. Anote a dor com as palavras dela.",
    quick: ["Inadimplência", "Previsibilidade", "Cobrança consome tempo", "Família reclama", "Sem dor declarada"]
  },
  {
    id: "diagnostico",
    title: "Diagnóstico",
    why: "Entender o sistema atual sem atacar.",
    ask: "Como vocês recebem hoje — boleto próprio, outro sistema, planilha? E isso atende?",
    watch: "Material: se já têm solução, pergunte se atende, se houve inadimplência ou falta de previsibilidade.",
    quick: ["Boleto próprio", "Outro sistema", "Misto", "Não ficou claro"]
  },
  {
    id: "impacto",
    title: "Impacto",
    why: "Saber se a dor mexe no mês.",
    ask: "Quando atrasa, o que quebra primeiro — folha, fornecedor, obra, ou o humor da direção?",
    watch: "Se não houver impacto, não force. Talvez o ganho seja tempo, não caixa.",
    quick: ["Quebra caixa", "Quebra tempo", "Quebra relação com família", "Impacto baixo"]
  },
  {
    id: "valor",
    title: "Valor",
    why: "Ligar a dor ao que o material realmente entrega.",
    ask: "Se a mensalidade entrasse inteira na data combinada e a cobrança saísse da mesa de vocês, o que mudaria no próximo trimestre?",
    watch: "Fale só o que o treino confirma: previsibilidade, gestão, app da família, crescimento. Sem taxa, sem ROI inventado.",
    quick: ["Previsibilidade chamou", "Tempo chamou", "Família/app chamou", "Crédito/crescimento chamou", "Frio"]
  },
  {
    id: "objecao",
    title: "Objeção",
    why: "Descobrir a objeção verdadeira.",
    ask: "O que te faria dizer não agora?",
    watch: "Abra o mapa de objeções. Investigue antes de responder.",
    quick: ["Taxa", "Autonomia", "Relação com família", "Timing", "Já viram", "Não é fit"]
  },
  {
    id: "interesse",
    title: "Interesse",
    why: "Separar educação de avanço.",
    ask: "Faz sentido uma conversa curta com o time da isaac sobre a operação de vocês?",
    watch: "Se sim, encaminhe. Você não substitui o fechamento.",
    quick: ["Sim, encaminhar", "Talvez, follow-up", "Não"]
  },
  {
    id: "proximo",
    title: "Próximo passo",
    why: "Nada de 'depois a gente se fala'.",
    ask: "Qual o melhor dia e o melhor recado para o time isaac chegar preparado?",
    watch: "Data, responsável, canal. Sem isso, a call morreu.",
    quick: ["Call agendada", "Follow-up com data", "Encaminhado", "Não avançou"]
  },
  {
    id: "indicacao",
    title: "Indicação",
    why: "Rede, sem pressão.",
    ask: "Você conhece algum mantenedor, diretor ou instituição que talvez esteja passando por uma situação parecida?",
    watch: "Só depois de conversa positiva. Sem percentual na boca.",
    quick: ["Indicou", "Não indicou", "Pediu para não perguntar"]
  }
];

export const PLAYBOOK = [
  {
    id: "o-que-e",
    title: "O que é a isaac",
    body: "Plataforma de soluções financeiras feita para escolas. Faz parte do Grupo Arco no material de ensino superior. Não é a Akasha. Não é mentoria de estudos."
  },
  {
    id: "para-quem",
    title: "Para quem é",
    body: "Instituições privadas. Fase 1 da operação: Salvador — BA, educação básica. Ensino superior tem material próprio (onepager). Não misturar argumentos dos dois decks."
  },
  {
    id: "como-funciona",
    title: "Como funciona (o que o SDR precisa saber)",
    body: "Você encontra a instituição, conversa, diagnostica, aquece e encaminha para o time de fechamento da isaac. Você não fecha taxa, crédito nem contrato."
  },
  {
    id: "solucoes",
    title: "Principais soluções",
    body: "Repasse na data combinada, gestão, app das famílias (pix/boleto/cartão), crédito e antecipação (sujeito a aprovação), diagnóstico em piloto, seguro familiar com a Porto Seguro."
  },
  {
    id: "abrir",
    title: "Como abrir uma conversa",
    body: "Template oficial do HTML de SSA. Local, curto, oferece ponte. Não despeje números do deck de faculdade numa escola de bairro."
  },
  {
    id: "discovery",
    title: "Como fazer discovery",
    body: "Uma pergunta por vez. Histórico → dor → sistema atual → impacto. O Call Cockpit guia. Não leia 50 perguntas."
  },
  {
    id: "decisor",
    title: "Como identificar o decisor",
    body: "Mantenedor, diretor, financeiro. Secretaria agenda, não decide. Se precisar de sócio, marque os dois."
  },
  {
    id: "agendar",
    title: "Como agendar / encaminhar",
    body: "Objetivo da sua call: o responsável pensar 'isso parece interessante, quero entender melhor' e chegar no time isaac consciente do problema, com objeção mapeada e dados organizados."
  },
  {
    id: "follow",
    title: "Como fazer follow-up",
    body: "Material SSA: 48h sem resposta → ligação. No app: data concreta. 'Me liga em 15 dias' vira follow-up com dia."
  },
  {
    id: "indicacao",
    title: "Como pedir indicação",
    body: "Só em conversa boa. 'Você conhece algum mantenedor ou instituição numa situação parecida?' Sem pressão, sem falar comissão."
  },
  {
    id: "nao-insistir",
    title: "Quando não insistir",
    body: "Já é parceira. Pediu para não ligar. Não-decisor sem caminho ao decisor. Recusa clara. Você não é cobrador da isaac."
  },
  {
    id: "nao-prometer",
    title: "O que não prometer",
    body: "Taxa, ROI, crédito aprovado, redução percentual de inadimplência, NPS, 'sem Reclame Aqui', comissão, integração mágica. Se o deck de escolas e o de faculdade discordam no número, não some os dois."
  },
  {
    id: "confianca",
    title: "Como passar confiança",
    body: "Calma, domínio, ouvir. Você verifica se existe oportunidade real de ajudar a instituição. Fechar muitas operações é consequência de gerar valor — não o texto da abertura."
  }
];

export const PORTAL_ASSOCIADO = "https://olaisaac.my.site.com/Associados/s/login/";
export const SITE_ISAAC = "https://isaac.com.br";
