/**
 * Base operacional extraída dos materiais da pasta
 * C:\Users\lomab\OneDrive\Área de Trabalho\isaac
 *
 * Tudo aqui é CONFIRMADO pelos materiais, salvo quando marcado HIPÓTESE.
 * Números de apresentações diferentes NÃO foram fundidos.
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
    note: "Promessa oficial do treino: 100% das mensalidades na data combinada. Condições comerciais saem na análise do time isaac — a pessoa do primeiro contato não fecha taxa.",
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
    note: "Benefício da parceria. Cobre mensalidades em perda de emprego, perda de renda por incapacidade temporária e falecimento, com condições (idade, carência, CLT (emprego formal com carteira assinada) etc.). Não vender como seguro avulso na ligação do primeiro contato.",
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
    note: "No resumo de uma página de faculdades: pagamentos, negociações, comunicação e matrícula digital. Não usar esse nome em call de escola básica sem confirmar.",
    source: SOURCES.superior
  }
];

export const NUMBER_DIVERGENCE = {
  warning:
    "Apresentações oficiais discordam nos totais. Não fundir. Não citar número se a conversa não for do segmento do material.",
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
      "NPS 89 (nota de recomendação dos clientes)",
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
    "ROI (retorno financeiro do investimento), ganho ou economia garantidos",
    "crédito aprovado",
    "taxa ou preço",
    "comissão",
    "NPS (nota de recomendação dos clientes) / reputação de fonte que não seja o material em uso",
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
  { id: "radar", label: "Lista inicial" },
  { id: "pesquisado", label: "Pesquisado" },
  { id: "prospect", label: "Ainda não contatado" },
  { id: "tentativa", label: "Tentativa de contato" },
  { id: "contato", label: "Contato realizado" },
  { id: "conversa", label: "Conversa" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "qualificado", label: "Qualificado" },
  { id: "interessado", label: "Interessado" },
  { id: "followup", label: "Retorno marcado" },
  { id: "call_agendada", label: "Reunião agendada" },
  { id: "encaminhado", label: "Encaminhado ao time isaac" },
  { id: "call_realizada", label: "Reunião realizada" },
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
  { id: "conversou_sem_call", label: "Já conversou, não marcou reunião" },
  { id: "call_agendada_antes", label: "Reunião agendada anteriormente" },
  { id: "nao_compareceu", label: "Não compareceu" },
  { id: "participou_call", label: "Participou de reunião" },
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
    reflection: [
      "Ótimo — então a pergunta deixa de ser “como corrigir atraso?” e passa a ser: o caixa já é tão previsível quanto poderia ser?",
      "Não é preciso esperar um problema aparecer para avaliar se existe uma forma mais eficiente de operar.",
      "Quem olha o processo antes da dor crescer preserva mais escolhas para a instituição."
    ],
    booking: [
      "Ótimo. Então a reunião não precisa partir de um problema: pode apenas verificar se existe algum ganho operacional real. Faz sentido reservar um horário com o time?",
      "Se a análise não mostrar valor, vocês encerram com clareza. Tenho disponibilidade a partir da semana que vem; qual dia funciona melhor?"
    ],
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
    reflection: [
      "Autonomia não é precisar fazer tudo sozinho; é continuar decidindo sem ficar refém da operação.",
      "Se uma solução retirasse peso operacional sem retirar poder de decisão, isso seria perda de autonomia ou ganho de controle?",
      "Controle real é escolher conscientemente o que permanece com a escola e o que pode ser otimizado."
    ],
    booking: [
      "Então vamos usar a reunião justamente para esclarecer o que continua sob decisão da escola. Qual horário permite que você leve essa pergunta ao time?",
      "Você não precisa decidir nada agora; apenas confirmar se o modelo preserva a autonomia. Prefere conversar no começo ou no fim da próxima semana?"
    ],
    advance: "Se a autonomia de precificação permanece com vocês, vale ouvir como o repasse entra na prática?",
    stop: "Se o medo for jurídico/contratual fundo, encaminhe ao time isaac — a pessoa do primeiro contato não interpreta contrato.",
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
    reflection: [
      "Proteger o relacionamento com as famílias não significa que a direção precise carregar sozinha toda a fricção da cobrança.",
      "Talvez a pergunta não seja “terceirizar a família”, mas separar o vínculo pedagógico do desgaste financeiro.",
      "Se a cobrança desgasta o vínculo, melhorar o processo também pode ser uma forma de preservar o relacionamento."
    ],
    booking: [
      "A melhor forma de não presumir é levar essa preocupação diretamente ao time. Podemos marcar um horário para eles explicarem onde termina a cobrança e começa o relacionamento da escola?",
      "Se a conversa mostrar que o vínculo seria prejudicado, não faz sentido avançar. Qual dia você consegue avaliar isso com calma?"
    ],
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
    value: "A taxa é personalizada. Sai de análise profunda dos relatórios financeiros. a pessoa do primeiro contato não inventa número.",
    proof: SOURCES.treino,
    reflection: [
      "Taxa isolada diz pouco; a decisão precisa comparar custo atual, risco, tempo e impacto operacional.",
      "Antes de perguntar apenas quanto custa mudar, vale entender quanto custa continuar exatamente como está.",
      "O menor número nem sempre representa o menor custo total — por isso a análise precisa ser feita sobre a operação real."
    ],
    booking: [
      "Para não te dar um número solto ou incorreto, o melhor é o time analisar o cenário e explicar as condições aplicáveis. Qual horário funciona para essa conversa?",
      "Essa pergunta merece uma resposta exata, não uma estimativa minha. Posso te colocar com o time a partir da semana que vem; qual é sua disponibilidade?"
    ],
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
    reflection: [
      "Caro em comparação com o quê: com a alternativa, com o tempo da equipe ou com o custo de manter o cenário atual?",
      "Algo só é caro ou barato quando é comparado ao problema que deveria resolver.",
      "Se não fizer sentido econômico para a instituição, a decisão correta é não avançar; a conversa serve justamente para descobrir isso."
    ],
    booking: [
      "Antes de decidir pelo preço, vale comparar o modelo com o custo do cenário atual. Faz sentido reservar uma conversa curta para fazer essa comparação?",
      "Se a conta não fizer sentido, vocês não avançam. Qual dia da próxima semana seria melhor para avaliar com o time?"
    ],
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
    reflection: [
      "Ter sido abordado antes não significa que o cenário de hoje seja igual ao daquela conversa.",
      "A conversa anterior realmente esclareceu o modelo ou apenas apresentou uma solução?",
      "Às vezes não é necessária uma solução nova, mas uma leitura mais precisa do momento atual."
    ],
    booking: [
      "Perfeito. Então não precisamos começar do zero: podemos marcar uma conversa focada apenas no que ficou sem resposta. Qual foi o ponto principal?",
      "Se o cenário mudou ou ainda existe uma dúvida, vale uma revisão objetiva. Você prefere um horário no começo ou no fim da próxima semana?"
    ],
    advance: "O que precisaria ser diferente desta vez para valer uma conversa curta com o time?",
    stop: "Se a pessoa pedir para não ligarem mais, respeite e marque perdido/não avançou."
  },
  {
    id: "ja_reuniao",
    said: "Já fiz reunião.",
    kind: "framework",
    means: "Conhece o produto. A objeção real está depois da reunião.",
    ask: "O que travou depois — taxa, momento, sócio, ou a proposta em si?",
    value: "Reativação é descobrir a objeção verdadeira, não repetir o apresentação.",
    proof: "",
    reflection: [
      "Uma reunião anterior não encerra o assunto; ela mostra o que ainda não ficou claro ou não fez sentido.",
      "O ponto mais útil agora é entender exatamente o que impediu o avanço naquela ocasião.",
      "Se nada mudou, não precisamos repetir a conversa; se o cenário mudou, vale comparar com honestidade."
    ],
    booking: [
      "Então a próxima conversa só faz sentido se resolver exatamente o que impediu o avanço anterior. Posso deixar o time preparado para isso; qual horário funciona?",
      "Não quero repetir apresentação. Quero marcar uma conversa focada no ponto que ficou aberto. Qual é sua disponibilidade na próxima semana?"
    ],
    advance: "Se a trava mudou, o time isaac retoma a partir dali. Posso encaminhar com esse contexto?",
    stop: "Não remarque reunião só para 'apresentar de novo'."
  },
  {
    id: "agora_nao",
    said: "Agora não.",
    kind: "framework",
    means: "Momento, cansaço, ou recusa educada.",
    ask: "É 'agora não' de calendário (rematrícula, obra, sócio) ou de prioridade?",
    value: "Agendar retorno concreto. Data na agenda, não 'depois'.",
    proof: "",
    reflection: [
      "Entendo. Quando alguém diz “agora não”, normalmente o ponto é momento ou prioridade — qual dos dois pesa mais aqui?",
      "Adiar também é uma decisão; o importante é saber por que estamos adiando e quando o tema deve ser revisto.",
      "Se este não é o momento, qual mudança mostraria que o momento chegou?"
    ],
    booking: [
      "Entendo. Em vez de deixar indefinido, podemos escolher agora uma data futura que respeite seu momento. A partir de quando sua agenda melhora?",
      "Qual semana faria mais sentido para revisitar isso? Eu registro o horário e o time chega sabendo por que vocês adiaram."
    ],
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
    reflection: [
      "Estar satisfeito é um ótimo sinal; a pergunta é se o sistema atual também sustenta o próximo estágio da instituição.",
      "Não precisamos substituir o que funciona — precisamos apenas verificar se existe alguma lacuna relevante.",
      "Satisfação com o presente e preparação para o futuro são perguntas diferentes."
    ],
    booking: [
      "Ótimo. A reunião pode servir apenas para comparar, sem compromisso de trocar o que já funciona. Faz sentido reservar esse diagnóstico?",
      "Se não aparecer nenhuma vantagem concreta, vocês mantêm o sistema atual com ainda mais segurança. Qual horário funciona melhor?"
    ],
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
    reflection: [
      "A questão não é apenas se vocês conseguem cobrar, mas o que a direção deixa de fazer enquanto cuida da cobrança.",
      "Fazer internamente pode funcionar; ainda assim, vale medir o custo invisível em tempo, energia e foco.",
      "Se a cobrança ocupasse menos espaço na agenda, onde esse tempo produziria mais valor para a instituição?"
    ],
    booking: [
      "Então a conversa pode medir se existe algum ganho em retirar parte desse peso sem perder controle. Vale colocar essa pergunta para o time?",
      "Se o processo interno já for a melhor opção, a análise vai deixar isso claro. Qual dia você consegue conversar por alguns minutos?"
    ],
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
    reflection: [
      "Perfeito — eu não preciso que você decida sozinho; preciso entender quem deve participar para a conversa ser útil.",
      "Uma decisão bem conduzida começa colocando as pessoas certas na mesma conversa.",
      "Se você enxergar sentido, pode me ajudar a levar o contexto correto para quem decide?"
    ],
    booking: [
      "Perfeito. Vamos colocar quem decide na conversa desde o início para ninguém precisar retransmitir informação. Qual horário funciona para vocês?",
      "Quem mais precisa participar? Me diga duas possibilidades de agenda e eu deixo a reunião organizada."
    ],
    advance: "Posso te ajudar a levar um resumo objetivo para o sócio, ou marcamos os dois?",
    stop: "Não peça para a secretária 'fechar'."
  },
  {
    id: "manda_material",
    said: "Me manda material.",
    kind: "framework",
    means: "Pode ser interesse real ou adiamento.",
    ask: "O que você gostaria de ver primeiro — previsibilidade, app da família, ou como funciona o repasse?",
    value: "Portal do associado / Associadoteca existe. a pessoa do primeiro contato pode mandar o que for público e marcar um horário para tirar dúvida.",
    proof: "https://olaisaac.my.site.com/Associados/s/login/",
    reflection: [
      "Material sem contexto costuma virar mais um arquivo esquecido; qual resposta você precisa encontrar nele?",
      "Para eu não mandar algo genérico, qual ponto decidiria se vale ou não conversar?",
      "Informação ajuda quando responde uma pergunta real — vamos identificar essa pergunta primeiro."
    ],
    booking: [
      "Eu envio o material certo, mas já podemos deixar um horário curto marcado para responder o que o documento não explica. Qual dia funciona?",
      "Para o material não virar só mais um arquivo, marcamos um retorno com o time. Prefere começo ou fim da próxima semana?"
    ],
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
    reflection: [
      "Essa é uma pergunta essencial: sem confiança sobre os dados, nenhuma solução financeira deveria avançar.",
      "Você não precisa aceitar uma resposta vaga; esse ponto deve ser esclarecido pelo time responsável com precisão.",
      "Segurança de dados não é detalhe técnico — é condição para uma decisão consciente."
    ],
    booking: [
      "Essa dúvida merece resposta técnica do time oficial. Posso marcar uma conversa focada em dados e segurança para você avaliar com precisão?",
      "Você não precisa avançar sem essa resposta. Qual horário permite colocar essa pergunta diretamente para quem domina o assunto?"
    ],
    advance: "Anoto a pergunta para o time responder com precisão na reunião. Seguimos?",
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
    reflection: [
      "Essa é uma pergunta central, e a resposta precisa considerar como a operação de vocês funciona hoje.",
      "Antes de explicar o mecanismo, vale entender como e quando o dinheiro entra atualmente.",
      "A utilidade do repasse só pode ser avaliada quando ligada ao problema real de previsibilidade da instituição."
    ],
    booking: [
      "Essa é justamente uma das perguntas que o time precisa responder olhando a operação de vocês. Qual horário funciona para essa análise?",
      "Em vez de eu simplificar demais, posso te conectar com quem explica o repasse aplicado ao cenário da instituição. Prefere qual dia?"
    ],
    advance: "Essa é exatamente a conversa da reunião com o time isaac. Posso encaminhar?",
    stop: "Não descreva fluxo bancário que você não viu no contrato."
  },
  {
    id: "sem_tempo",
    said: "Estou sem tempo.",
    kind: "framework",
    means: "Pode ser agenda cheia, baixa prioridade ou tentativa educada de encerrar.",
    ask: "Sem problema. É melhor eu ser breve agora ou reservarmos 20 minutos em outro dia?",
    value: "Respeitar a agenda e chegar direto ao diagnóstico, sem apresentação longa.",
    proof: "Framework operacional — nenhuma promessa comercial.",
    reflection: [
      "Justamente porque o tempo é escasso, vale medir quanto tempo o processo atual já consome sem aparecer na agenda.",
      "Não quero tomar seu tempo agora; quero apenas saber se existe motivo suficiente para reservar um horário certo.",
      "Quando nunca existe tempo para revisar um processo, é o próprio processo que continua definindo a agenda."
    ],
    booking: [
      "Vou respeitar seu tempo: não precisamos continuar agora. Me diga apenas um dia e horário em que o time possa falar objetivamente com você.",
      "Posso deixar uma conversa curta marcada para a próxima semana. Funciona melhor pela manhã ou pela tarde?"
    ],
    advance: "Tenho [opção A] ou [opção B]. Qual pesa menos na sua agenda?",
    phone: "Entendo. Prefere dois minutos agora só para ver se há aderência, ou marcamos 20 minutos com o time?",
    whatsapp: "Se for melhor, organizo dois horários objetivos e você escolhe sem troca longa de mensagens.",
    email: "Posso sugerir dois horários de 20 minutos para uma avaliação objetiva?",
    stop: "Se pedir para encerrar ou não houver prioridade, agradeça e agende retorno somente com permissão."
  },
  {
    id: "sociedade",
    said: "Preciso falar com meu sócio.",
    kind: "framework",
    means: "Existe outro decisor ou a pessoa ainda não formou opinião.",
    ask: "O que seu sócio precisaria entender para decidir se vale a conversa?",
    value: "Levar os decisores certos para o diagnóstico e evitar informação pela metade.",
    proof: "Encaminhamento organizado para o time isaac.",
    reflection: [
      "Uma decisão compartilhada não precisa virar atraso; pode virar uma conversa objetiva com todos os envolvidos.",
      "Em vez de você tentar traduzir tudo depois, podemos colocar as duas pessoas na mesma conversa.",
      "Qual dúvida seu sócio precisaria ver respondida para avaliar isso com seriedade?"
    ],
    booking: [
      "Então o melhor é marcar com vocês dois, evitando informação pela metade. Quais dois horários funcionam para o sócio participar?",
      "Podemos transformar o “preciso falar com meu sócio” em uma conversa conjunta e objetiva. Qual é a disponibilidade de vocês?"
    ],
    advance: "Marcamos os dois e deixo a pergunta principal registrada para o time?",
    phone: "Perfeito. Quem mais precisa estar e qual dúvida precisa ser respondida?",
    whatsapp: "Posso mandar um resumo curto e marcar um horário em que vocês dois participem.",
    email: "Sugiro incluir os decisores financeiros para a conversa ser conclusiva.",
    stop: "Não use o contato para contornar ou pressionar o sócio ausente."
  },
  {
    id: "nao_responsavel",
    said: "Não sou a pessoa responsável.",
    kind: "framework",
    means: "Contato útil para direcionamento, mas não para qualificação final.",
    ask: "Quem acompanha financeiro, cobrança e previsibilidade por aí?",
    value: "Chegar ao responsável correto sem forçar pitch para recepção ou secretaria.",
    proof: "Guia operacional.",
    reflection: [
      "Perfeito — então o melhor resultado desta conversa é chegar à pessoa certa, não tentar convencer a pessoa errada.",
      "Quem conhece a operação pode não assinar a decisão, mas pode indicar quem precisa participar.",
      "Para eu respeitar seu tempo, quem é a pessoa adequada e qual é a melhor forma de abordá-la?"
    ],
    booking: [
      "Perfeito. Não quero ocupar seu tempo nem apresentar para a pessoa errada. Quem deve participar e qual é o melhor horário?",
      "Se você me indicar o responsável, eu preparo uma abordagem curta e já proponho a reunião com o time. Quem seria?"
    ],
    advance: "Você consegue me indicar o nome e o melhor horário para falar com essa pessoa?",
    phone: "Obrigado. Quem é a pessoa certa e quando costuma estar disponível?",
    whatsapp: "Pode me indicar o responsável por financeiro/cobrança? Prometo ser objetivo.",
    email: "Poderia encaminhar ou indicar o responsável por essa área?",
    stop: "Não pressione por contato pessoal privado; aceite o canal institucional."
  },
  {
    id: "agendou_nao_deu",
    said: "Já agendamos antes e não deu certo.",
    kind: "framework",
    means: "Pode ser no-show, experiência ruim, horário inadequado ou falta de clareza.",
    ask: "O que impediu a conversa — agenda, formato ou falta de clareza sobre o objetivo?",
    value: "Corrigir a causa anterior antes de remarcar.",
    proof: "Histórico registrado e âncora de compromisso.",
    reflection: [
      "Uma reunião que não aconteceu não invalida a oportunidade; mostra que o compromisso ainda não estava bem ancorado.",
      "O problema foi apenas agenda ou o valor da conversa não ficou claro o suficiente?",
      "Desta vez só faz sentido marcar se motivo, expectativa e participantes estiverem claros."
    ],
    booking: [
      "Desta vez só vamos marcar se horário, motivo e participantes estiverem claros. Qual janela realmente funciona para você?",
      "Vamos corrigir a causa da última tentativa. Prefere remarcar para o começo ou para o fim da próxima semana?"
    ],
    advance: "Se resolvermos esse ponto e o time já chegar preparado, vale remarcar?",
    phone: "Quero evitar repetir o erro. O que precisamos mudar desta vez?",
    whatsapp: "Registro o que aconteceu e remarco só se o novo formato fizer sentido.",
    email: "Podemos retomar do ponto exato em que parou, sem repetir a apresentação.",
    stop: "Não remarque sem entender a causa do encontro anterior ter falhado."
  },
  {
    id: "sem_interesse",
    said: "Não tivemos interesse.",
    kind: "framework",
    means: "A proposta pode não ter aderido, o momento pode ter mudado ou a pessoa pode querer encerrar.",
    ask: "O que especificamente não fez sentido naquela época?",
    value: "Descobrir se houve mudança real; não repetir pitch.",
    proof: "Histórico anterior informado pelo responsável.",
    reflection: [
      "Sem problema. Para eu registrar corretamente: faltou necessidade, prioridade ou clareza sobre a proposta da conversa?",
      "Um “não” claro é melhor do que um retorno artificial; quero apenas compreender a razão real.",
      "Se o cenário mudar, qual mudança faria este tema voltar a merecer atenção?"
    ],
    booking: [
      "Entendo. Se existir uma única dúvida que ainda valha esclarecer, podemos fazer uma conversa focada apenas nela. Existe alguma?",
      "Se hoje não há motivo real, não marcamos. Mas se faltar clareza, qual horário permitiria uma avaliação objetiva com o time?"
    ],
    advance: "Se esse ponto mudou, retomamos; se não mudou, eu encerro por aqui.",
    phone: "O que não aderiu: solução, momento, investimento ou prioridade?",
    whatsapp: "Só retomo se algo tiver mudado; qual foi a trava principal?",
    email: "Para não insistir sem sentido, poderia indicar o principal motivo da decisão anterior?",
    stop: "Diante de recusa clara ou pedido para não contatar, marque perdido e pare."
  },
  {
    id: "outra_reuniao",
    said: "Não quero outra reunião comercial.",
    kind: "framework",
    means: "Cansaço de pitches, baixa confiança ou falta de valor percebido.",
    ask: "O que faria essa conversa ser útil em vez de só mais uma apresentação?",
    value: "Diagnóstico breve focado no cenário da instituição, sem negociação no primeiro contato.",
    proof: "Agenda e handoff registram dores e perguntas antes da reunião.",
    reflection: [
      "Concordo: ninguém precisa de mais uma apresentação comercial genérica.",
      "Se for apenas um pitch, não vale seu tempo; se for uma análise da operação, a conversa pode ter outra utilidade.",
      "O que precisaria acontecer para esta conversa merecer espaço na sua agenda?"
    ],
    booking: [
      "Concordo. Por isso não proponho uma apresentação genérica, mas uma conversa focada no cenário que você mencionou. Isso faria sentido?",
      "Se houver uma pergunta concreta para responder, marcamos; se não houver, encerramos por aqui. Qual pergunta justificaria a reunião?"
    ],
    advance: "Se o time entrar já respondendo sua pergunta principal, vale 20 minutos?",
    phone: "Não quero te colocar em apresentação genérica. Qual resposta justificaria a conversa?",
    whatsapp: "A conversa só é marcada se houver uma pergunta real para o time responder.",
    email: "O encontro será preparado a partir do contexto registrado, não uma apresentação genérica.",
    stop: "Se não existir pergunta, problema ou curiosidade real, não agende."
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
    id: "permissao",
    title: "Permissão e rapport",
    why: "Ganhar atenção sem prender a pessoa.",
    ask: "Peguei você num momento possível para dois minutos, ou prefere que eu ligue em outro horário?",
    watch: "Tom calmo. Se estiver ocupado, marque horário. Não acelere o pitch.",
    quick: ["Pode falar", "Só 2 minutos", "Ligar depois", "Sem disponibilidade"]
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
    id: "momento_prioridade",
    title: "Prioridade e momento",
    why: "Entender se o problema merece ação agora.",
    ask: "Isso é algo que vocês querem resolver neste semestre ou ficou para depois de algum marco?",
    watch: "Registre evento, prazo e prioridade nas palavras do responsável.",
    quick: ["Agora", "Neste semestre", "Após rematrícula", "Sem prioridade"]
  },
  {
    id: "valor",
    title: "Valor",
    why: "Ligar a dor ao que o material realmente entrega.",
    ask: "Se a mensalidade entrasse inteira na data combinada e a cobrança saísse da mesa de vocês, o que mudaria no próximo trimestre?",
    watch: "Fale só o que o treino confirma: previsibilidade, gestão, app da família, crescimento. Sem taxa, sem retorno financeiro inventado.",
    quick: ["Previsibilidade chamou", "Tempo chamou", "Família/app chamou", "Crédito/crescimento chamou", "Frio"]
  },
  {
    id: "objecao",
    title: "Objeção",
    why: "Descobrir a objeção verdadeira.",
    ask: "O que te faria dizer não agora?",
    watch: "Abra o mapa de objeções. Investigue antes de responder.",
    quick: ["Taxa", "Autonomia", "Relação com família", "Momento", "Já viram", "Não se encaixa"]
  },
  {
    id: "interesse",
    title: "Interesse",
    why: "Separar educação de avanço.",
    ask: "Faz sentido uma conversa curta com o time da isaac sobre a operação de vocês?",
    watch: "Se sim, encaminhe. Você não substitui o fechamento.",
    quick: ["Sim, encaminhar", "Talvez, retorno", "Não"]
  },
  {
    id: "ponte",
    title: "Ponte para o time isaac",
    why: "Explicar a reunião antes de pedir agenda.",
    ask: "O time pode analisar esse cenário com você, responder [dúvida] e verificar aderência sem eu negociar taxa ou contrato. Isso seria útil?",
    watch: "O responsável precisa saber o que será analisado e por que vale participar.",
    quick: ["Entendeu o objetivo", "Quer tirar dúvida", "Quer incluir sócio", "Ainda sem valor"]
  },
  {
    id: "agendamento",
    title: "Agendamento",
    why: "Sair com data, hora e participantes.",
    ask: "Funciona melhor [opção A] ou [opção B]? Quem mais precisa participar?",
    watch: "Preencha o bloco Agendar reunião. Data sem horário não é reunião agendada.",
    quick: ["Data e hora definidas", "Aguardando confirmação", "Precisa consultar agenda", "Remarcar"]
  },
  {
    id: "compromisso",
    title: "Confirmação do compromisso",
    why: "Proteger comparecimento com valor real, não pressão.",
    ask: "Qual é a principal pergunta que você quer sair dessa reunião tendo respondida?",
    watch: "Registre problema, impacto, resultado desejado, motivo e pergunta.",
    quick: ["Pergunta registrada", "Problema reconhecido", "Motivo claro", "Compromisso fraco"]
  },
  {
    id: "handoff",
    title: "Handoff",
    why: "Entregar contexto e encerrar com clareza.",
    ask: "Perfeito. Vou encaminhar este contexto ao time para vocês não começarem do zero. Posso confirmar seu melhor contato?",
    watch: "Confirme contatos, participantes e horário. Gere o resumo; não negocie taxa, contrato ou crédito.",
    quick: ["Contato confirmado", "Participantes confirmados", "Resumo pronto", "Encaminhado"]
  },
  {
    id: "proximo",
    title: "Próximo passo",
    why: "Nada de 'depois a gente se fala'.",
    ask: "Qual o melhor dia e o melhor recado para o time isaac chegar preparado?",
    watch: "Data, responsável, canal. Sem isso, a call morreu.",
    quick: ["Reunião agendada", "Retorno com data", "Encaminhado", "Não avançou"]
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

export const FAST_CALL_STEPS = [
  {
    id: "rapida_abertura",
    title: "Direto ao ponto · 15 segundos",
    why: "Respeitar quem disse que está sem tempo.",
    ask: "Vou direto ao ponto: sou Felipe, parceiro do isaac, e meu papel é verificar se vale conectar sua instituição ao time especializado. Posso resumir em 30 segundos?",
    watch: "Se a pessoa disser sim, informe com calma. Se disser não, peça apenas um horário melhor.",
    quick: ["Pode resumir", "Ligar depois", "Não é o responsável"]
  },
  {
    id: "rapida_contexto",
    title: "O que é · 30 segundos",
    why: "Informar antes de perguntar.",
    ask: "O isaac é uma plataforma de soluções financeiras para instituições de ensino. O time analisa a operação e explica possibilidades ligadas a previsibilidade, cobrança, pagamentos e experiência das famílias, conforme o caso. Eu não negocio taxa ou contrato.",
    watch: "Se pedirem comprovação ou números, abra o Proof Vault. Se perguntarem como funciona, abra a Base isaac.",
    quick: ["Entendeu", "Pediu prova", "Perguntou como funciona", "Já conhece"]
  },
  {
    id: "rapida_relevancia",
    title: "Uma pergunta · 30 segundos",
    why: "Descobrir rapidamente se existe motivo para a reunião.",
    ask: "Hoje existe algum ponto em inadimplência, cobrança, previsibilidade de caixa ou tempo da equipe que vocês gostariam de melhorar?",
    watch: "Não faça interrogatório. Escolha somente o ponto que a pessoa mencionar.",
    quick: ["Inadimplência", "Cobrança", "Previsibilidade", "Tempo", "Sem dor"]
  },
  {
    id: "rapida_ponte",
    title: "Conectar o ponto · 20 segundos",
    why: "Mostrar por que a reunião pode ser útil.",
    ask: "Entendi. É justamente esse cenário que vale colocar para o time isaac analisar. A reunião serve para vocês entenderem a aplicação no caso da instituição e decidirem se existe aderência.",
    watch: "Se surgir objeção, selecione-a no bloco de Objeções, use uma frase e volte imediatamente ao convite.",
    quick: ["Viu sentido", "Teve objeção", "Quer material", "Sem interesse"]
  },
  {
    id: "rapida_convite",
    title: "Convite · 15 segundos",
    why: "Pedir a reunião sem prolongar a ligação.",
    ask: "Faz sentido uma conversa objetiva com o time da isaac para avaliar isso sem compromisso de avançar?",
    watch: "Se disser sim ou talvez, pare o roteiro e vá direto para Agendar reunião.",
    quick: ["Sim", "Talvez", "Não", "Precisa incluir outra pessoa"]
  },
  {
    id: "rapida_agenda",
    title: "Fechar o horário · 10 segundos",
    why: "O objetivo real desta ligação é sair com dia e horário.",
    ask: "Tenho possibilidade a partir da próxima semana. Funciona melhor no começo ou no fim da semana? E pela manhã ou pela tarde?",
    watch: "Abra Agendar reunião. Registre somente data, horário, responsável e pergunta principal. O restante é opcional.",
    quick: ["Data definida", "Consultar agenda", "Remarcar", "Agendado"]
  }
];


export const PROOF_VAULT = [
  { id:"repasse", claim:"100% das mensalidades na data combinada", segment:"Educação básica", product:"Receita", source:SOURCES.treino, status:"aprovado", use:"Previsibilidade e repasse", restriction:"Condições comerciais e análise ficam com o time isaac." },
  { id:"familias", claim:"App para famílias com pix, boleto, cartão, negociação, faturas e comprovantes", segment:"Educação básica", product:"App das famílias", source:SOURCES.treino, status:"aprovado", use:"Experiência das famílias e operação de cobrança", restriction:"Não prometer integração não documentada." },
  { id:"escolas", claim:"+1.900 escolas parceiras e +650 mil alunos impactados", segment:"Educação básica", product:"Institucional", source:SOURCES.treino, status:"aprovado", use:"Prova institucional para escolas", restriction:"Não somar com números do apresentação superior." },
  { id:"superior", claim:"+2.800 instituições parceiras, 97% de retenção e NPS 89 (nota de recomendação dos clientes)", segment:"Ensino superior", product:"Institucional", source:SOURCES.superior, status:"aprovado", use:"Somente em conversa de ensino superior", restriction:"Não usar em escola básica nem fundir com outro apresentação." },
  { id:"credito", claim:"Crédito e antecipação existem no ecossistema", segment:"Educação básica", product:"Crédito", source:SOURCES.treino, status:"revisar", use:"Somente como possibilidade a ser avaliada", restriction:"Sujeito a aprovação; a pessoa do primeiro contato não promete crédito nem taxa." }
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
    body: "Instituições privadas. Fase 1 da operação: Salvador — BA, educação básica. Ensino superior tem material próprio (resumo de uma página). Não misturar argumentos dos dois apresentações."
  },
  {
    id: "como-funciona",
    title: "Como funciona para quem faz o primeiro contato",
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
    body: "Template oficial do HTML de SSA. Local, curto, oferece ponte. Não despeje números do apresentação de faculdade numa escola de bairro."
  },
  {
    id: "discovery",
    title: "Como descobrir as necessidades",
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
    body: "Objetivo da sua ligação: o responsável pensar 'isso parece interessante, quero entender melhor' e chegar no time isaac consciente do problema, com objeção mapeada e dados organizados."
  },
  {
    id: "follow",
    title: "Como fazer retorno",
    body: "Material SSA: 48h sem resposta → ligação. No app: data concreta. 'Me liga em 15 dias' vira retorno com dia."
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
    body: "Taxa, retorno financeiro, crédito aprovado, redução percentual de inadimplência, NPS, 'sem Reclame Aqui', comissão, integração mágica. Se o apresentação de escolas e o de faculdade discordam no número, não some os dois."
  },
  {
    id: "confianca",
    title: "Como passar confiança",
    body: "Calma, domínio, ouvir. Você verifica se existe oportunidade real de ajudar a instituição. Fechar muitas operações é consequência de gerar valor — não o texto da abertura."
  }
];


export const PROSPECT_STARTER = [
  {
    name: "Colégio Anchieta",
    city: "Salvador", state: "BA", type: "educacao_basica", priority: "A",
    phone: "(71) 2107-9000", whatsapp: "(71) 98792-7034", email: "anchieta@anchietaba.com.br",
    site: "https://www.anchietaba.com.br/", sourceUrl: "https://www.anchietaba.com.br/",
    sourceLabel: "site oficial", verifiedAt: "2026-09-17"
  },
  {
    name: "Colégio Oficina",
    city: "Salvador", state: "BA", type: "educacao_basica", priority: "A",
    phone: "(71) 3270-4131", email: "secretaria@colegiooficina.com.br",
    site: "https://colegiooficina.com.br/", sourceUrl: "https://colegiooficina.com.br/",
    sourceLabel: "site oficial", verifiedAt: "2026-09-17"
  },
  {
    name: "Pan American School of Bahia",
    city: "Salvador", state: "BA", type: "educacao_basica", priority: "A",
    phone: "(71) 3368-8400",
    site: "https://pasb.com.br/", sourceUrl: "https://pasb.com.br/",
    sourceLabel: "site oficial", verifiedAt: "2026-09-17"
  },
  {
    name: "Sartre Escola SEB — Itaigara",
    city: "Salvador", state: "BA", type: "educacao_basica", priority: "A",
    phone: "(71) 2201-2100", whatsapp: "(71) 2201-2100",
    site: "https://sartre-itaigara-salvador.escolaseb.com.br/", sourceUrl: "https://sartre-itaigara-salvador.escolaseb.com.br/",
    sourceLabel: "site oficial", verifiedAt: "2026-09-17"
  },
  {
    name: "Sartre Escola SEB — Monet",
    city: "Lauro de Freitas", state: "BA", type: "educacao_basica", priority: "A",
    phone: "(71) 2201-2100", whatsapp: "(71) 2201-2100",
    site: "https://sartre-monet-salvador.escolaseb.com.br/", sourceUrl: "https://sartre-monet-salvador.escolaseb.com.br/",
    sourceLabel: "site oficial", verifiedAt: "2026-09-17"
  },
  {
    name: "Colégio Bernoulli — Caminho das Árvores",
    city: "Salvador", state: "BA", type: "educacao_basica", priority: "A",
    phone: "(71) 3415-4199", whatsapp: "(71) 99298-0213",
    site: "https://www.bernoulli.com.br/", sourceUrl: "https://www.bernoulli.com.br/",
    sourceLabel: "site oficial", verifiedAt: "2026-09-17"
  },
  {
    name: "Colégio Marista Salvador",
    city: "Salvador", state: "BA", type: "educacao_basica", priority: "A",
    phone: "(71) 3114-6350",
    site: "https://colegiosmaristas.com.br/salvador/", sourceUrl: "https://maristabrasil.org/",
    sourceLabel: "rede oficial Marista", verifiedAt: "2026-09-17"
  },
  {
    name: "Escola Concept Salvador",
    city: "Salvador", state: "BA", type: "educacao_basica", priority: "A",
    whatsapp: "(71) 99617-7472", email: "visitsal@escolaconcept.com.br",
    site: "https://www.escolaconcept.com.br/", sourceUrl: "https://www.escolaconcept.com.br/",
    sourceLabel: "site oficial", verifiedAt: "2026-09-17"
  },
  {
    name: "Centro Universitário Jorge Amado — UNIJORGE",
    city: "Salvador", state: "BA", type: "ensino_superior", priority: "A",
    phone: "(71) 3206-8000",
    site: "https://www.unijorge.edu.br/", sourceUrl: "https://www.unijorge.edu.br/",
    sourceLabel: "site oficial", verifiedAt: "2026-09-17"
  },
  {
    name: "Universidade Salvador — UNIFACS",
    city: "Salvador", state: "BA", type: "ensino_superior", priority: "A",
    phone: "(71) 3021-2800",
    site: "https://www.unifacs.br/", sourceUrl: "https://servidores.rhbahia.ba.gov.br/",
    sourceLabel: "página pública do Governo da Bahia", verifiedAt: "2026-09-17"
  },
  {
    name: "UNIME — Lauro de Freitas",
    city: "Lauro de Freitas", state: "BA", type: "ensino_superior", priority: "A",
    whatsapp: "(71) 9998-8655",
    site: "https://www.unime.edu.br/medicina", sourceUrl: "https://www.unime.edu.br/medicina",
    sourceLabel: "site oficial", verifiedAt: "2026-09-17"
  },
  {
    name: "Escola Bahiana de Medicina e Saúde Pública",
    city: "Salvador", state: "BA", type: "ensino_superior", priority: "A",
    phone: "(71) 2101-1900", whatsapp: "(71) 99957-4138",
    site: "https://www.bahiana.edu.br/", sourceUrl: "https://www.bahiana.edu.br/secretarias/",
    sourceLabel: "site oficial", verifiedAt: "2026-09-17"
  },
  {
    name: "Faculdade Baiana de Direito e Gestão",
    city: "Salvador", state: "BA", type: "ensino_superior", priority: "A",
    phone: "(71) 3205-7700", whatsapp: "(71) 99931-2023",
    site: "https://faculdadebaianadedireito.com.br/", sourceUrl: "https://faculdadebaianadedireito.com.br/",
    sourceLabel: "site oficial e contato público", verifiedAt: "2026-09-17"
  },
  {
    name: "Centro Universitário UniRuy — Wyden",
    city: "Salvador", state: "BA", type: "ensino_superior", priority: "A",
    phone: "0800 771 5001",
    site: "https://www.wyden.com.br/unidades/uniruy", sourceUrl: "https://www.wyden.com.br/unidades/uniruy",
    sourceLabel: "site oficial", verifiedAt: "2026-09-17"
  }
];

export const PORTAL_ASSOCIADO = "https://olaisaac.my.site.com/Associados/s/login/";
export const SITE_ISAAC = "https://isaac.com.br";
