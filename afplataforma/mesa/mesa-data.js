/* Mesa Francesca — dados da call. Só o mentor carrega esta página. */
const FECHAMENTO_ACTS = [
  {
    id: "conexao",
    n: 1,
    label: "Conexão",
    minutes: "0–8 min",
    intent: "Peer para peer. Não closer para lead.",
    script: [
      "A primeira call foi de escuta. Hoje eu quero te mostrar a casa — e entender a sua.",
      "Teve uma fase em que eu ganhava, mas a estrutura me cobrava trabalhar sem parar. Reduzi complexidade para aumentar liberdade.",
      "Foi nessa transição que o Akasha deixou de ser um conjunto de trabalhos e virou um organismo.",
    ],
    questions: [
      "Depois da nossa primeira conversa, o que ficou mais forte para você?",
      "O que você quer materializar nos próximos 90 dias?",
    ],
    never: [
      "Não desabafar sobre o relacionamento.",
      "Não falar valor.",
      "Não empurrar mentoria.",
    ],
    nextIfCold: "Voltar para o que ela falou na primeira call. Escutar mais 3 minutos.",
  },
  {
    id: "diagnostico",
    n: 2,
    label: "Diagnóstico",
    minutes: "8–25 min",
    intent: "Mapa do Mapa dela. Dor visível. Sem solução ainda.",
    script: [
      "Antes de eu abrir o Akasha, quero desenhar o seu campo: Freedom eE, Beautiful Living, Colabocracy, operação, conteúdo, dinheiro, equipe.",
      "Você já constrói em 67 países e 10 mil conversas. O gargalo raramente é visão. Quase sempre é tradução de visão em organismo executável.",
      "Colaborocracia de longo prazo precisa de uma entrada que gere atenção, sistema e caixa — senão vira conversa eterna.",
    ],
    questions: [
      "Qual é hoje o maior gargalo entre a visão e a execução?",
      "Onde o seu sistema ainda depende de você pessoalmente?",
      "O que a Colabocracy precisa existir de concreto nos próximos 12 meses?",
      "O que não pode continuar no improviso?",
    ],
    never: [
      "Não apresentar Convergência ainda.",
      "Não abrir o blueprint inteiro.",
      "Não perguntar quanto ela tem.",
    ],
    nextIfCold: "Desenhar no papel: visão × operação × caixa × conteúdo × evento. Deixar ela ver o vazamento.",
  },
  {
    id: "pit",
    n: 3,
    label: "PIT 01",
    minutes: "25–32 min",
    intent: "Ela compra o diagnóstico antes de ver a solução. 0 a 10. Só avança no 10.",
    script: [
      "Deixa eu te devolver o que eu estou vendo — em uma frase.",
      "Você tem um paraíso de conexão e uma economia colabocrática desenhada. O que ainda não está vivo o suficiente é o organismo que faz isso acontecer no digital e no presencial ao mesmo tempo.",
      "Se a gente não resolver isso, a Colabocracy continua brilhante e lenta.",
    ],
    questions: [
      "De 0 a 10, o quanto você quer resolver isso agora — não em tese, agora?",
      "O que falta para ser 10?",
      "Se a gente sair daqui só com outra conversa incrível, o que isso custa para o seu ano?",
    ],
    never: [
      "Não avançar no 8. Ir até o 10.",
      "Não apresentar produto se a energia estiver baixa.",
      "Não preencher o silêncio.",
    ],
    nextIfCold:
      "Se for 7 ou 8: ‘Você entende que isso está impactando mais do que você admitia. O que trava o 10?’",
  },
  {
    id: "visao",
    n: 4,
    label: "Visão / prova",
    minutes: "32–48 min",
    intent: "Tour da casa. AF como prova. Convergência em altitude de arquitetura.",
    script: [
      "Olha o que eu construí. Não para você fazer a minha mentoria. Para você ver como eu estruturo.",
      "Essência → Código → Método → Marca → Produto → Sistema → Legado.",
      "A AF Plataforma é o exemplo vivo: sessão, dossiê, 7 módulos, dashboard, call, notas. A execução não mora em PDF.",
      "Convergência é o primeiro projeto em que quase todo o DNA do Akasha cabe numa arquitetura só.",
    ],
    questions: [
      "Onde você acha que meu trabalho se conecta melhor com o seu?",
      "Você me enxerga mais estrategicamente ou realmente construindo uma parte disso contigo?",
    ],
    never: [
      "Não entregar o blueprint completo da plataforma.",
      "Não prometer vitalício.",
      "Não dizer ‘eu construo até o ano que vem por um preço fixo’ sem Definition of Done.",
    ],
    nextIfCold: "Mostrar 2 telas da AF, não 20. Uma prova vale mais que o mapa inteiro.",
  },
  {
    id: "papel",
    n: 5,
    label: "Papel",
    minutes: "48–58 min",
    intent: "Cocriadora, não convidada. Descobrir o nível de responsabilidade.",
    script: [
      "Você pode transformar muita coisa na Convergência. Nome, curadoria, network, Beautiful Living, internacionalização.",
      "O que eu não abro mão: híbrido real, plataforma própria, gamificação, participação, audiovisual, streaming, permanência digital.",
      "Eu posso ser o arquiteto do software e da engenharia. Você pode ser a arquiteta comercial e de curadoria. Isso só existe se houver compromisso.",
    ],
    questions: [
      "Você se enxerga participando disso em que nível?",
      "O que você conseguiria colocar nessa construção — além de conhecimento e conexões?",
      "Você gostaria de cocriar esse projeto, ou prefere outro recorte?",
    ],
    never: ["Não aceitar ‘vamos vendo’ como papel.", "Não oferecer colaborocracia sem entrada."],
    nextIfCold:
      "Se ela quiser só indicação: agradecer e redirecionar para sessão de alinhamento, não abrir o ecossistema.",
  },
  {
    id: "recurso",
    n: 6,
    label: "Recurso",
    minutes: "58–70 min",
    intent: "Skin in the game. Descobrir a faixa. Não anunciar o piso.",
    script: [
      "Existe uma diferença entre conversar e abrir o meu ecossistema e assumir responsabilidade.",
      "Para a segunda camada, eu preciso de reciprocidade econômica. Não é pedido de ajuda. É skin in the game.",
      "Não é mensalidade. É uma contribuição de ativação. O que vier depois — extras, produção, viagem — é outro acordo.",
    ],
    questions: [
      "Se a gente decidir sair da conversa e começar uma primeira fase real agora, que nível de recurso você se sente confortável em comprometer nessa ativação?",
    ],
    never: [
      "Não falar 5 mil, 7 mil, 17 mil primeiro.",
      "Não perguntar ‘quanto dinheiro você tem?’",
      "Não inventar urgência.",
    ],
    nextIfCold:
      "Se ela perguntar o preço: ‘Depende do nível em que você quer que eu entre. Uma coisa é alinhamento e mapa. Outra é abrir o Akasha e construir a Convergência.’",
  },
  {
    id: "escopo",
    n: 7,
    label: "Escopo",
    minutes: "70–80 min",
    intent: "Casar o número dela com uma obra definida. Empreiteiro, não escravo.",
    script: [
      "O valor não compra o meu tempo infinito. Compra uma obra com começo e fim.",
      "Se for plataforma, existe uma V1 com checklist de aceite. Feature nova depois disso é nova construção.",
      "Você também se beneficia do Roteiro da Ascensão — a mesma engenharia da AF — aplicada ao seu campo.",
    ],
    questions: [
      "Faz sentido a gente congelar o que entra nessa primeira obra, por escrito, hoje?",
    ],
    never: [
      "Não vender ‘até ficar pronto’ sem definir pronto.",
      "Não misturar mentoria recorrente com ativação.",
    ],
    nextIfCold: "Abrir a tabela de faixas internamente e nomear o recorte em uma frase.",
  },
  {
    id: "fechar",
    n: 8,
    label: "Fechar",
    minutes: "80–90 min",
    intent: "Próxima ação na call. Pix, acesso, primeira sessão, 72h.",
    script: [
      "O fechamento ideal não é ‘vendi uma mentoria’. É ‘decidimos transformar conexão em execução’.",
      "Se avançamos: entrada agora, acesso proporcional, sessão de alinhamento, dossiê em 72h.",
      "Não quero que essa seja só mais uma conversa incrível.",
    ],
    questions: [
      "A gente fecha essa primeira ativação agora, e eu já te coloco no AF e no mapa operacional ainda hoje?",
    ],
    never: [
      "Não deixar em ‘me manda um resumo’.",
      "Não abrir o mapa-mãe completo sem entrada.",
    ],
    nextIfCold:
      "Se não fechar o grande: oferecer a Call de Entrada — Sessão de Alinhamento, 1h30, R$ 350. Ela ainda entra no campo, sem abrir o ecossistema.",
  },
];
const ENTRADA_ACTS = [
  {
    id: "e-abertura",
    n: 1,
    label: "Abertura",
    minutes: "0–8 min",
    intent: "Sessão de Alinhamento. 1h30. Diagnóstico, não parceria total.",
    script: [
      "Essa sessão existe para enxergar o que está acontecendo no seu campo — caixa, decisão, execução — e sair com a próxima decisão organizada.",
      "Não é mentoria de 90 dias. A continuidade só existe se fizer sentido depois.",
    ],
    questions: ["O que te fez aceitar essa sessão agora?"],
    never: ["Não abrir Convergência completa.", "Não vender plataforma V1 nesta sessão."],
    nextIfCold: "Voltar para o motivo dela ter chegado — livro, conteúdo, conversa anterior.",
  },
  {
    id: "e-vazamento",
    n: 2,
    label: "Vazamento",
    minutes: "8–35 min",
    intent: "Mapear vazamento de caixa e de decisão.",
    script: [
      "A AF não diz onde investir. Ela organiza caixa, regra, ritmo e decisão.",
      "Quero ver 90 dias: o que entra, o que vaza, o que é essencial, o que é lifestyle se passando por operação.",
    ],
    questions: [
      "Onde o dinheiro vaza sem você perceber?",
      "Que decisão você vem adiando?",
      "Se você parar de trabalhar 30 dias, o que quebra?",
    ],
    never: ["Não moralizar gasto.", "Não parecer terapeuta financeiro regulado."],
    nextIfCold: "Usar os 7 módulos como espelho, um vazamento por vez.",
  },
  {
    id: "e-dossie",
    n: 3,
    label: "Dossiê",
    minutes: "35–60 min",
    intent: "Primeiro alinhamento prático na hora.",
    script: [
      "Uma alavanca por vetor. Não são 40 tarefas.",
      "Vamos sair com: o que para esta semana, a regra de caixa, a próxima oferta.",
    ],
    questions: ["Qual é a única decisão desta semana que muda o trimestre?"],
    never: ["Não entregar 12 frentes."],
    nextIfCold: "Forçar uma decisão. Sessão sem decisão é conversa.",
  },
  {
    id: "e-continuidade",
    n: 4,
    label: "Continuidade",
    minutes: "60–90 min",
    intent: "Avaliar se a mentoria de 8–12 semanas cabe. Ou se a parceria maior despertou.",
    script: [
      "A mentoria de ~3 meses só abre depois desta sessão.",
      "Se o que você precisa é organismo — evento, plataforma, rede — isso já é outro nível, e a gente trata com clareza.",
    ],
    questions: [
      "Faz sentido continuar no protocolo de 90 dias, ou o que você precisa é uma construção maior?",
    ],
    never: ["Não empurrar 17 mil numa sessão de 350.", "Não recusar se a parceria maior nascer — transicionar com ética."],
    nextIfCold: "Fechar a sessão com dossiê. Convite claro, sem pressão.",
  },
];
const CADERNO = [
  {
    id: "reconnect",
    n: 1,
    title: "Reconectar pessoalmente",
    speak:
      "Casa, mudanças, momento atual, liberdade, viagem, família. Não transformar em desabafo.",
    note: "Beautiful Living conversa com essa história.",
  },
  {
    id: "transition",
    n: 2,
    title: "Contar a transição",
    speak:
      "Casa grande → custo/pressão → redução de estrutura → mais liberdade → digital → Akasha.",
  },
  {
    id: "origin",
    n: 3,
    title: "Origem do Akasha",
    speak:
      "Não nasceu como marca genérica. Nasceu da reorganização da própria vida + conhecimento acumulado.",
  },
  {
    id: "mapa",
    n: 4,
    title: "Mostrar o Mapa Mãe",
    speak: "Essência → Código → Método → Marca → Produto → Sistema → Legado.",
    note: "Menos de dois minutos.",
  },
  {
    id: "tour",
    n: 5,
    title: "Tour pela minha casa",
    speak:
      "Arquitetura de Essência + Alinhamento/Elementos Financeiros + plataforma + produtos + IA + sistemas.",
    note: "Prova de arquitetura, não catálogo.",
  },
  {
    id: "not-mentee",
    n: 6,
    title: "Ela não é mentoranda comum",
    speak:
      "Não quero colocá-la como cliente de mentoria. Quero que ela veja como eu estruturo.",
  },
  {
    id: "mapa-dela",
    n: 7,
    title: "Fazer o Mapa do Mapa dela",
    speak:
      "Francesca + Freedom eE + Beautiful Living + Colabocracy + vida + projetos + dinheiro + equipe + conteúdo.",
  },
  {
    id: "where",
    n: 8,
    title: "Onde ela realmente precisa de mim",
    speak:
      "Conteúdo? Software? Arquitetura? Evento? Mentoria? Distribuição? IA?",
  },
  {
    id: "convergencia",
    n: 9,
    title: "Apresentar Convergência",
    speak:
      "Essa é a grande construção concreta. Evento + software + rede + streaming + gamificação + biblioteca.",
  },
  {
    id: "locked",
    n: 10,
    title: "O que é inegociável",
    speak:
      "Híbrido real + plataforma + gamificação + participação ativa + streaming + audiovisual + replay.",
  },
  {
    id: "open",
    n: 11,
    title: "O que pode ser cocriado",
    speak:
      "Tema, nome, marcas, convidados, conteúdo, formato das salas, internacionalização, parceiros.",
  },
  {
    id: "role",
    n: 12,
    title: "Posicionar como cocriadora",
    speak: "Não apenas convidada. Peer + CEO + estruturadora.",
  },
  {
    id: "ask-role",
    n: 13,
    title: "Perguntar o nível",
    speak: "Você se enxerga participando disso em que nível?",
  },
  {
    id: "engenharia",
    n: 14,
    title: "Engenharia de fechamento",
    speak: "Desejo → prioridade → compromisso → recursos. Diagnóstico antes da oferta.",
  },
  {
    id: "pit",
    n: 15,
    title: "PIT 01 — 0 a 10",
    speak:
      "Só avança solução se ela comprar o diagnóstico. Não revelar o piso.",
  },
  {
    id: "money",
    n: 16,
    title: "Descobrir o recurso da primeira ativação",
    speak:
      "Que nível de recurso você se sente confortável em comprometer agora?",
    note: "Cala. Deixa ela responder.",
  },
  {
    id: "scope",
    n: 17,
    title: "Definir o que ela acessa",
    speak:
      "Se houver avanço financeiro, definir exatamente o que entra. V1 tem Definition of Done.",
  },
  {
    id: "next",
    n: 18,
    title: "Fechar próxima ação NA CALL",
    speak: "Entrada + acesso + primeira sessão + primeiro entregável.",
  },
  {
    id: "ops",
    n: 19,
    title: "Depois do fechamento",
    speak: "Mapa visual + definição de escopo + plano operacional + Roteiro da Ascensão.",
  },
  {
    id: "close-line",
    n: 20,
    title: "Encerrar com execução",
    speak:
      "Não quero que essa seja só mais uma conversa incrível. Quero transformar em execução.",
  },
];
const FAIXAS = [
  {
    id: "sessao",
    range: "R$ 350",
    min: 0,
    max: 1999,
    name: "Call de Entrada",
    opens: [
      "Sessão de Alinhamento 1h30",
      "Dossiê de ação",
      "Mapa mínimo",
      "Avaliação de continuidade",
    ],
    closed: [
      "Mapa-mãe completo",
      "Plataforma Convergência",
      "Abertura profunda do Akasha",
      "Mentoria dentro da casa dela",
    ],
    done: "Sessão feita + dossiê entregue.",
    color: "muted",
  },
  {
    id: "minimo",
    range: "R$ 2–5 mil",
    min: 2000,
    max: 4999,
    name: "Arquitetura limitada",
    opens: [
      "Alinhamento estendido",
      "Mapa do mapa dela",
      "Algumas sessões",
      "Orientação, pouca execução",
    ],
    closed: [
      "DNA completo do Akasha",
      "V1 da Convergência",
      "Geração de conteúdo em escala",
    ],
    done: "Mapa visual + 2 sessões + recorte escrito.",
    color: "warn",
  },
  {
    id: "entrada",
    range: "R$ 5–7 mil",
    min: 5000,
    max: 6999,
    name: "Entrada estratégica",
    opens: [
      "Acesso relevante ao Akasha",
      "Mapa-mãe proporcional",
      "AF Plataforma",
      "Estrutura e criação inicial",
      "Colaboração real",
      "Roteiro da Ascensão aplicado a ela",
    ],
    closed: [
      "Plataforma Convergência até o fim",
      "Palestras no ecossistema dela no ano que vem",
    ],
    done: "Acesso + kickoff + primeiro entregável em 72h.",
    color: "ok",
  },
  {
    id: "v1",
    range: "R$ 7–17 mil",
    min: 7000,
    max: 17000,
    name: "Obra V1 Convergência",
    opens: [
      "Abertura profunda da arquitetura",
      "Construção da V1 acordada da plataforma",
      "Integração, prototipagem, estrutura",
      "Participação operacional inicial",
      "AF + Ascensão como benefício",
      "Mapa-mãe completo",
    ],
    closed: [
      "Feature infinita até o ano que vem",
      "Audiovisual, hotel, equipe, cloud",
      "Palestras em inglês no evento dela (custo extra)",
      "Sociedade jurídica automática",
    ],
    done: "V1 com Definition of Done assinada. Empreiteiro: a casa custa X, não o calendário.",
    color: "accent",
  },
];
const PIT_RECOVERY = {
  0: "Ela ainda não comprou o problema. Voltar ao mapa. Não apresentar nada.",
  1: "Ela ainda não comprou o problema. Voltar ao mapa. Não apresentar nada.",
  2: "Ela ainda não comprou o problema. Voltar ao mapa. Não apresentar nada.",
  3: "Ela ainda não comprou o problema. Voltar ao mapa. Não apresentar nada.",
  4: "Ela ainda não comprou o problema. Voltar ao mapa. Não apresentar nada.",
  5: "Meio termo. ‘Você entende que isso está impactando — inclusive mais do que estava visível. O que te deixa no 5 e não no 10?’",
  6: "Meio termo. Nomear o custo de permanecer. Ainda não apresentar Convergência.",
  7: "Quase. ‘Sete é entendimento. Dez é decisão. O que falta para ser decisão?’",
  8: "Não avançar no 8. ‘Você tem um problema sério e já vê. Oito ainda deixa uma porta de fuga. O que é a porta?’",
  9: "Quase compromisso. ‘Nove é quase. Qual é o 10% que ainda não está dito?’",
  10: "Avançar. Visão, papel, recurso. Energia alta. Não enrolar."
};
const POSTURE = [
  "Peer + CEO + estruturadora. Nunca mentoranda comum.",
  "Ela tem T. Você carrega C — código, sistema, execução.",
  "Ela chegou pelo livro. Você não pediu ajuda.",
  "Primeira call foi escuta. Esta é a call de compromisso.",
  "Não descer para salvar. Frequência parecida, campo fechado."
];
const VALUES = [350, 2000, 5000, 7000, 10000, 15000, 17000];


const FRANCESCA = {
  name: "Francesca Giobbi",
  role: "Founder & Architect · Freedom eE · Beautiful Living · Colabocracy",
  facts: [
    "Brasileiro-italiana. 35+ anos em comércio internacional de alta costura e lifestyle.",
    "Made in Italy com Prada, Gucci, Armani, Versace. Made in Germany com Jil Sander. Marca própria de sapatos no Brasil.",
    "Sapatos de noiva acima de 2 mil. 64–67 países. 10.200–10.400 conversas com empreendedores desde 2014.",
    "Quebra em 2012. Reconstruiu. Condição atual: sólida, visão à frente, não é mentoranda típica.",
    "Salas: House of Lords, SPIEF/BRICS 2023, embaixadas, CC Forum Paris, Cidades: Paris, London, Rome, Helsinki + co-host."
  ],
  ecosystems: [
    { name: "Freedom eE", body: "Economia de energia empreendedora. Four flows, nine revenue streams, one wallet. Membership €250/mês ou €750/4 meses." },
    { name: "Colabocracy", body: "CO + LABOR + CRACY. Colaboração comercial com mérito. B2B, B2C, B2B2C. Campanhas PHYgital 90–120 dias." },
    { name: "Beautiful Living", body: "Dez pilares: spaces, body, mind, relationships, work, wealth, experiences, technology, planet, legacy. Harmonia, não estética vazia." },
    { name: "Made in HappineEss", body: "Selo finlandês de produtos que somam à vida. Bonded table, endosso em câmera, link rastreado." }
  ],
  overlap: [
    { her: "Beautiful Wealth", you: "Alinhamento Financeiro / 7 módulos" },
    { her: "Beautiful Technology + eE.app", you: "Tech Hub, IA, plataformas, Atlas" },
    { her: "Campanhas 90–120 dias", you: "Protocolo de 90 dias + Caminho da Energia 8 semanas" },
    { her: "PHYgital", you: "Convergência híbrida real" },
    { her: "Bonded table / creators", you: "Rede de streamers, participação ativa" },
    { her: "Beautiful Legacy", you: "Sistema → legado. A plataforma não morre." },
    { her: "Colabocracy", you: "Ativação com skin in the game, depois revenue share" },
    { her: "Conteúdo que digitaliza sabedoria", you: "Geração de conteúdo, AF, lives, teleprompter" }
  ],
  posture: [
    "Peer + CEO + estruturadora. Nunca mentoranda comum.",
    "Ela tem T. Você carrega C — código, sistema, execução.",
    "Ela chegou pelo livro. Você não pediu ajuda.",
    "Primeira call foi escuta. Esta é a call de compromisso.",
    "Não descer para salvar. Frequência parecida, campo fechado."
  ]
};
const DEALS = [
  {
    id: "francesca",
    name: "Francesca",
    person: "Francesca Giobbi",
    range: "R$ 2–17 mil",
    status: "ativa",
    blurb: "Convergência · AF · smart money. Peer, não mentoranda.",
    tags: ["Fechamento", "Convergência", "Colabocracy"]
  }
];
const FUTURE_SLOT = {
  title: "Próximo fechamento",
  body: "Quando houver outro deal de 2 a 17 mil, entra aqui. Mesmo motor, outro dossiê. A AF do aluno não muda."
};
const STORY_KEEP = [
  "Viveu abundância operacional sem liberdade.",
  "Casa de quatro suítes, ateliê, gatos, vinho, viagens, vendas.",
  "Quanto mais trabalhava, mais o custo e o consumo cobravam.",
  "Se eu parar, essa estrutura começa a me cobrar.",
  "Reduzi estrutura sem reduzir ambição.",
  "Hoje: ganhar muito sem uma vida que obrigue gastar muito para existir.",
  "Isso liberou legado, tecnologia, conteúdo, Akasha, Convergência."
];
const STORY_CUT = [
  "Não entrar no documentário da fase difícil na casa da família dela.",
  "Resumo: houve uma fase pessoal difícil, o relacionamento encerrou, virou amizade e alguns projetos. Acabou.",
  "Francesca precisa da transformação, não do trauma."
];
const ABOVE_17 = {
  title: "Acima de R$ 17 mil",
  body: "Não aceitar como ‘me compra para sempre’. Recortar uma segunda obra ou um segundo acordo (produção, audiovisual, evento físico). O teto desta ativação existe para você transbordar com qualidade."
};
function formatHint() {
  return "Aguarde o número dela. Se perguntar o preço, recorte o nível — não o piso.";
}

function faixaFor(v) {
  if (v == null || Number.isNaN(v)) return null;
  if (v < 2000) return FAIXAS[0];
  if (v < 5000) return FAIXAS[1];
  if (v < 7000) return FAIXAS[2];
  return FAIXAS[3];
}
function formatBRL(n) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

/* páginas oficiais da mesa — copiado dos data/*.ts */

const AF_HEADLINE =
  "Sistema privado de 8 a 12 semanas para quem já fatura e ainda vive no improviso: caixa, decisão, execução e legado no mesmo protocolo.";

const AF_ENTRY = {
  name: "Sessão de Alinhamento · Ascensão de Alinhamento",
  duration: "1h30 ao vivo · 1:1",
  price: 350,
  includes: [
    "Diagnóstico de caixa e de decisão",
    "Leitura de padrões",
    "Alinhamento prático na hora",
    "Dossiê de ação",
    "Gravação da sessão",
    "Avaliação se a mentoria de ~3 meses cabe",
  ],
  rule: "A mentoria de ~3 meses só abre depois da sessão. Não é curso solto.",
};

const AF_PROCESS = [
  {
    n: "01",
    title: "Diagnóstico",
    body: "Mapear realidade, vazamentos e o que trava a evolução.",
  },
  {
    n: "02",
    title: "Estratégia",
    body: "Prioridades, reserva, caixa e regras de decisão.",
  },
  {
    n: "03",
    title: "Execução",
    body: "Plano vira ação: acompanhamento, ferramentas e cadência.",
  },
];

const AF_MODULES = [
  {
    n: "01",
    axis: "Fundação",
    title: "Raiz e Cash-Flow",
    leak: "Viver sem saber para onde o caixa foi.",
    body: "Auditoria de 90 dias, essencialidade, vazamento, reserva de 3 a 6 meses.",
    forFran:
      "Mesmo com patrimônio e 67 países, a pergunta é: o organismo gera caixa sem te sugar.",
  },
  {
    n: "02",
    axis: "Oferta",
    title: "Criatividade Lucrativa",
    leak: "Ideia linda que não vira oferta testável.",
    body: "Ideação forçada, validação e velocidade de teste.",
    forFran:
      "Colabocracy e Beautiful Living precisam de ofertas concretas, não só de filosofia.",
  },
  {
    n: "03",
    axis: "Ritmo",
    title: "Execução",
    leak: "Muitas frentes, nenhuma alavanca.",
    body: "Priorização, constância e uma alavanca clara por vez.",
    forFran: "Campanhas de 90–120 dias já são o ritmo dela. Falta o software que segura o ritmo.",
  },
  {
    n: "04",
    axis: "Relação",
    title: "Rede e Reciprocidade",
    leak: "Network sem reciprocidade econômica.",
    body: "Relações de alto valor construídas com intenção e troca real.",
    forFran:
      "Ela tem 10.400 conversas. A tese da call: conexão sem entrada não constrói organismo.",
  },
  {
    n: "05",
    axis: "Presença",
    title: "Voz e Comunicação",
    leak: "Visão rica, conteúdo irregular.",
    body: "Autoridade, clareza de proposta e comunicação financeira madura.",
    forFran: "Você pode gerar conteúdo, sistema e IA para o universo dela — isso tem preço.",
  },
  {
    n: "06",
    axis: "Direção",
    title: "Visão e Fortuna",
    leak: "Decidir sob incerteza sem critério.",
    body: "Visão em uma página e critérios para decidir.",
    forFran: "Convergência pode ser a visão em uma página dos dois ecossistemas.",
  },
  {
    n: "07",
    axis: "Transmissão",
    title: "Conexão e Legado",
    leak: "Tudo depende do fundador.",
    body: "Governança do que você constrói e do que deseja transmitir.",
    forFran: "Beautiful Legacy. A plataforma sobrevive ao evento. Esse é o ponto gigante.",
  },
];

const AF_PLATFORM = {
  nav: ["Início", "Módulos", "Ferramentas", "Call", "Notas", "Complementares"],
  promise:
    "Dashboard, módulos, ferramentas, call, notas e complementares numa experiência só. Planejamento vira acompanhamento visível.",
  extras: [
    "21+ materiais de execução",
    "7 módulos do protocolo",
    "Sessão 1:1 de entrada",
    "90 dias auditados no início",
    "Máquina comercial: SDR, negociação, objeção, fechamento, AF → Mentoria",
    "Lives, teleprompters, rotina, timing, yoga, academia",
  ],
  not: [
    "Não é promessa de enriquecimento rápido",
    "Não vende ativo, retorno garantido ou fórmula mágica",
    "Não substitui assessoria regulada de investimentos",
    "Não é curso gravado solto",
  ],
};

const AF_SHOW_ON_CALL = [
  "Uma tela do dashboard — progresso visível.",
  "Módulo 01 Cash-Flow: auditoria, reserva, execução semanal.",
  "A lógica da sessão de 1h30 → dossiê → continuidade.",
  "Que a plataforma é a prova: conhecimento não mora em PDF.",
];


const IGOR_PRINCIPLES = [
  {
    title: "Diagnóstico antes da oferta",
    body: "O processo tradicional falha ao empurrar o produto antes da hora. A mesa se ganha no diagnóstico profundo — visual, que faz a dor arder.",
  },
  {
    title: "PIT invertido",
    body: "Quebrar objeções antes do preço. Se a pessoa não compra o que não precisa pagar (o diagnóstico), ela não vai mandar Pix no fim da call.",
  },
  {
    title: "0 a 10 — só avança no 10",
    body: "Depois do diagnóstico: ‘de 0 a 10, o quanto você quer resolver isso?’. Oito não avança. Vai até o 10. Energia baixa? Não apresenta produto.",
  },
  {
    title: "Decisão é emocional",
    body: "Quem entra na loja já sabe se vai comprar. A razão só justifica. O PIT antecipa a objeção enquanto a emoção ainda está quente.",
  },
  {
    title: "Fechar na reunião",
    body: "Cultura de elite: fechar 50–80% sem follow-up morno no WhatsApp. ‘Vou falar com meu sócio’ se desarma antes, no PIT 01.",
  },
  {
    title: "Condição única com cuidado",
    body: "Se criar uma condição especial demais, a pessoa desacredita o preço original. Preferir recorte de escopo a desconto.",
  },
];



const SEQUENCE = [
  "Conexão",
  "Diagnóstico",
  "Visão",
  "Sinergia",
  "Prova",
  "Papel",
  "Compromisso",
  "Recurso",
  "Escopo",
  "Fechamento",
];

const IF_SHE_ASKS_PRICE =
  "Depende do nível em que você quer que eu entre. Uma coisa é eu abrir o mapa, fazer o alinhamento e estruturar contigo. Outra é eu abrir profundamente o Akasha e assumir a construção da plataforma e da Convergência contigo.";


const CONVERGENCIA_ONE_LINER =
  "O primeiro projeto em que praticamente todo o DNA do Akasha aparece dentro de uma única arquitetura: evento + software + rede + streaming + gamificação + conteúdo + biblioteca + comunidade + economia.";

const LOCKED = [
  {
    title: "Híbrido de verdade",
    body: "Não é presencial + uma câmera. Presencial ↔ digital o tempo inteiro.",
  },
  {
    title: "Plataforma própria",
    body: "Casa digital do evento. Não é só página de ingresso.",
  },
  {
    title: "Identidade de participante",
    body: "Quem entra precisa existir: perfil, interesses, propósito, conteúdos, conexões.",
  },
  {
    title: "Participação ativa",
    body: "Não existe sentar no canto. Acessos e experiências se desbloqueiam pela participação — sem usar a palavra obrigar.",
  },
  {
    title: "Gamificação",
    body: "Missões, pontuação, conexões, desbloqueios, salas, conteúdo, recompensas.",
  },
  {
    title: "Streaming distribuído",
    body: "Transmissão oficial + participantes criando perspectiva. Referência Twitch, sem ser só Twitch.",
  },
  {
    title: "Várias salas",
    body: "Hipótese: 3 / 6 / até 9. Conteúdos simultâneos, não só business.",
  },
  {
    title: "Audiovisual como infraestrutura",
    body: "Direção sincronizada com software e cronograma. Não é ‘contratar um cara para filmar’.",
  },
  {
    title: "Biblioteca / replay",
    body: "O que merece permanência é gravado. Vira replay, corte, documentário, produto.",
  },
  {
    title: "A plataforma não morre",
    body: "Depois do evento: rede, streams, comunidade, membership, próximos ciclos.",
  },
];

const OPEN_WITH_HER = [
  "Tema e nome",
  "Marcas e Beautiful Living",
  "Convidados e network internacional",
  "Curadoria das salas",
  "Internacionalização e inglês",
  "Parceiros, hotel, produtos",
  "Colabocracy como camada comercial",
];

const JOURNEY = [
  {
    act: "Ato 1 — Convergência",
    body: "Salas + palco + digital + audiovisual + conteúdo + networking + comida + experiências + gamificação.",
  },
  {
    act: "After",
    body: "Sai o conteúdo estruturado. Entra música, dança, lifestyle, documentário, backstage. Digital segue vivo, lógica muda.",
  },
  {
    act: "Ato 2 — Celebração / saúde",
    body: "Manhã mais aberta, eventualmente gratuita. Café, zero álcool, música, bike, corrida, praia, produtos, comunidade.",
  },
  {
    act: "VIP privado",
    body: "Cocriadores e equipe. Sem app, sem cronograma. Não precisa definir agora.",
  },
];

const TICKETS = [
  {
    name: "Presencial",
    body: "Inclui digital incondicionalmente. Quarto/hotel vira estúdio. Participante é também creator.",
  },
  {
    name: "Digital Live",
    body: "Participa enquanto acontece. Tem sala própria, pode transmitir, entra nas salas oficiais.",
  },
  {
    name: "Digital Library",
    body: "Acesso posterior ao gravado. Não prometer vitalício antes de calcular storage, direitos e custo.",
  },
];

const ENGINEERING_ORDER = [
  "Papel / mapa",
  "Software",
  "Regras",
  "Gamificação",
  "Simulação",
  "Audiovisual",
  "Cronograma físico",
  "Local",
  "Evento",
];

const V1_DOD = [
  "Login e cadastro",
  "Perfis / identidade",
  "Ingresso e Event Hub",
  "Agenda e programação",
  "Salas",
  "Live Hub / streaming",
  "Missões e pontuação",
  "Recompensas V1",
  "Connect / matchmaking",
  "Feed / rede",
  "Espaço de creator / stream individual",
  "Biblioteca / replay",
  "Painel administrativo",
  "Analytics e moderação",
];

const SHOW_BEFORE = [
  "A tese em uma frase",
  "Os 10 fundamentos inegociáveis, em altitude",
  "A ordem de engenharia (videogame antes do hotel)",
  "Que presencial inclui digital",
  "Que a plataforma sobrevive ao evento",
];

const SHOW_AFTER = [
  "Blueprint de salas e cronograma",
  "Modelo de revenue share / sociedade",
  "Gamificação detalhada (missões, termos)",
  "Arquitetura técnica, stack, repositório",
  "Lista de fundadores de plataformas para fusão",
  "Mapa-mãe completo do Akasha",
  "Contratos, splits, tokens",
];


const OBJECOES = [
  {
    id: "colabocracy",
    title: "Colaborocracia agora, dinheiro depois",
    hear: "A longo prazo a gente colabora. A entrada de dinheiro vem depois.",
    break: [
      "Concordo com o longo prazo. O que eu não faço é abrir o organismo inteiro sem skin in the game.",
      "Colaborocracia sem entrada vira conversa. Entrada sem recorrência já é a minha concessão — porque eu acredito em você.",
      "O dinheiro aqui não é ‘eu preciso’. É o rito que transforma conexão em construção.",
    ],
  },
  {
    id: "vendo",
    title: "Vamos vendo / sem prazo",
    hear: "A gente vai andando, sem tempo determinado.",
    break: [
      "Eu também acredito. Por isso a ativação não é mensalidade.",
      "Mas ‘vamos vendo’ não constrói plataforma. Constrói expectativa.",
      "A gente congela uma V1. Quando ela existir, a gente conversa o próximo andar.",
    ],
  },
  {
    id: "mentoria",
    title: "Mentoria não é para o meu nível",
    hear: "Eu já tenho T. Eu já viajei 70 países. Mentoria fica pequeno.",
    break: [
      "Concordo. Por isso você não entra como mentoranda.",
      "A mentoria, para você, é prova de arquitetura. Eu te mostro a casa. Você decide se construímos juntos.",
      "O C que eu carrego — código, sistema, conteúdo, execução — é o complemento do T que você já tem.",
    ],
  },
  {
    id: "pensar",
    title: "Preciso pensar / falar com alguém",
    hear: "Me manda um resumo. Depois eu vejo.",
    break: [
      "Pensar é justo. O que eu não faço é deixar a decisão para um WhatsApp frio.",
      "O que ainda não está claro: o papel, o recorte ou o recurso?",
      "A gente pode fechar a sessão de alinhamento hoje e deixar a obra maior para um segundo sim — com data.",
    ],
  },
  {
    id: "preco",
    title: "Quanto custa?",
    hear: "Me fala o valor.",
    break: [
      "Depende do nível em que você quer que eu entre.",
      "Uma coisa é mapa e alinhamento. Outra é abrir o Akasha e construir a Convergência.",
      "Me diz o nível de responsabilidade que você quer comprar. Aí o recorte fica honesto.",
    ],
  },
  {
    id: "barato",
    title: "Abaixo de 2 mil para a obra grande",
    hear: "Consigo X agora, bem abaixo.",
    break: [
      "Por esse valor eu faço a sessão e o mapa. Não abro a casa e não assumo a plataforma.",
      "Menos de 2 mil não gera a convergência. Eu não entrego a plataforma de mão beijada.",
      "A gente pode honrar o que cabe hoje e deixar a obra com data — sem fingir que é a mesma coisa.",
    ],
  },
  {
    id: "gratis",
    title: "Eu já te ajudei / você já me mostrou bastante",
    hear: "Isso pode ser de graça, já geramos valor.",
    break: [
      "A sessão de alinhamento eu poderia fazer até de graça, porque você já gerou valor.",
      "Mostrar o futuro, gerar conteúdo, construir sistema — isso não. Aí precisa de ativação.",
      "Eu não cheguei pedindo ajuda. Você chegou interessada no que eu produzi. A reciprocidade começa agora.",
    ],
  },
  {
    id: "indicacao",
    title: "Eu te indico pessoas",
    hear: "Meus 10 mil empreendedores compram de você.",
    break: [
      "Indicação é um segundo acordo, quando a economia existir.",
      "Não substitui a entrada. Substitui, no futuro, recorrência.",
      "Se for para isso, a gente escreve: o que é indicação, o que é comissão, o que não é sociedade.",
    ],
  },
  {
    id: "tempo",
    title: "Ano que vem / três meses",
    hear: "A gente faz o evento no ano que vem, sem pressa.",
    break: [
      "Um ano é muito tempo para construir se a gente começar. É pouco se a gente só conversar.",
      "Em 90 dias dá para ter V1 rodando em teste. O evento físico vem quando o videogame existir.",
      "A ordem é mapa → software → regras → gamificação → audiovisual → local.",
    ],
  },
  {
    id: "marca-roupa",
    title: "Voltar para marca / roupa / caixa",
    hear: "Podemos vender produtos físicos, artesanato, caixa.",
    break: [
      "Faz sentido e fica no ecossistema — loja seletiva, poucas peças, feito à mão.",
      "Isso é um braço, não a obra. A obra desta call é organismo + Convergência.",
      "Produto físico entra como parceria de marketplace depois, com percentual claro.",
    ],
  },
];


const ASCENSAO_INTRO =
  "Se ela fecha a ativação, ela não entra só na Convergência. Ela também se beneficia do Roteiro da Ascensão — o mesmo protocolo da AF — aplicado ao campo dela. Se ela não fecha a obra grande, a Call de Entrada continua existindo.";

const H72 = [
  {
    t: "0–2h",
    title: "Rito de entrada",
    items: [
      "Confirmar Pix / transferência",
      "Mensagem de honra: conexão virou construção",
      "Criar pasta da obra com escopo congelado",
      "Liberar AF Plataforma no nível combinado",
    ],
  },
  {
    t: "24h",
    title: "Dossiê",
    items: [
      "Mapa do mapa dela (Freedom eE × Akasha)",
      "O que ficou inegociável / o que é dela",
      "Faixa, escopo, Definition of Done se V1",
      "Primeira alavanca da semana",
    ],
  },
  {
    t: "72h",
    title: "Kickoff",
    items: [
      "Call curta de alinhamento operacional",
      "Acesso às telas certas — não a tudo",
      "Calendário dos 30 dias",
      "Se V1: quadro da plataforma, não do evento físico",
    ],
  },
];

const D30 = [
  "Semana 1 — Fundação: caixa, papéis, recorte da obra",
  "Semana 2 — Mapa visual da Convergência em altitude acordada",
  "Semana 3 — Software: login, perfil, esqueleto do Event Hub (se V1)",
  "Semana 4 — Primeira simulação jogável ou primeiro ciclo de conteúdo",
];

const D90 = [
  "V1 jogável se a faixa for 7–17",
  "Gamificação mínima rodando em teste",
  "Biblioteca de conteúdo de entrada",
  "Modelo econômico em papel (ainda sem sociedade jurídica)",
  "Decisão go/no-go do evento físico",
  "Ela operando o Roteiro da Ascensão nos 7 módulos no próprio campo",
];

const ASCENSAO_TRACK = [
  {
    n: "01",
    title: "Raiz",
    hers: "O que no Freedom eE ainda vaza energia e caixa.",
  },
  {
    n: "02",
    title: "Oferta",
    hers: "Uma campanha PHYgital testável em 90 dias — não 26 setores de uma vez.",
  },
  {
    n: "03",
    title: "Ritmo",
    hers: "Uma alavanca: plataforma, conteúdo ou bonded table. Não as três.",
  },
  {
    n: "04",
    title: "Relação",
    hers: "Reciprocidade escrita com você. Indicação vira acordo, não promessa.",
  },
  {
    n: "05",
    title: "Presença",
    hers: "Conteúdo gerado com sistema, não com heroísmo.",
  },
  {
    n: "06",
    title: "Direção",
    hers: "Visão em uma página: Beautiful Living × Convergência.",
  },
  {
    n: "07",
    title: "Legado",
    hers: "A rede que sobrevive ao evento e à fundadora.",
  },
];

const IF_NO_CLOSE = {
  title: "Se a obra grande não fechar",
  body: "Não forçar. Oferecer a Call de Entrada — Sessão de Alinhamento, 1h30, R$ 350. Ela continua no campo. O mapa-mãe e a V1 permanecem fechados. Marcar data. Não virar follow-up eterno.",
};


const MAPA_CHAIN = [
  "Essência",
  "Código",
  "Método",
  "Marca",
  "Produto",
  "Sistema",
  "Legado",
];

const MAPA_BRANCHES = [
  {
    id: "A",
    title: "Fundamentos / livros",
    items: [
      "Códigos de Origem — corpo, mente, campo",
      "Revelações Quânticas",
      "Seu Código Quântico",
      "Deus é Quântico e está no DNA",
      "Autoestima Blindada",
      "Biblioteca de referências",
    ],
  },
  {
    id: "B",
    title: "Área de membros Akasha Hub",
    items: [
      "N1 Anubis — o iniciado",
      "N2 Horus — despertar",
      "N3 Isis — domínio",
      "N4 Ra — magnetismo supremo",
    ],
  },
  {
    id: "C",
    title: "Mentorias",
    items: [
      "Arquitetura & Ciência / Legado Digital",
      "Caminho da Energia — 8 semanas, 1ª a gravar",
      "Mentoria Discípulo — pessoal, bônus depois",
    ],
  },
  {
    id: "D",
    title: "Alinhamento Financeiro",
    items: [
      "7 módulos / vetores",
      "Sessão de Alinhamento (Ascensão)",
      "AF Plataforma",
      "Máquina comercial",
    ],
  },
  {
    id: "E",
    title: "Tecnologia da Alma",
    items: ["Comunicação, fascinação, magnetismo, não-verbal"],
  },
  {
    id: "F",
    title: "Masterclass",
    items: ["O Poder da Fascinação — criar do zero, depois"],
  },
  {
    id: "G",
    title: "Paladins — Liderança dos Bons",
    items: ["10 módulos + legado + bônus. Grade antes de gravar."],
  },
  {
    id: "H",
    title: "Senda Tântrica",
    items: ["Conteúdo existe. Ordenar, gravar. Sem sexualizar a tese na call."],
  },
  {
    id: "I",
    title: "Já gravado",
    items: ["Ritual para casais", "Desafio 7 dias — magnetismo"],
  },
  {
    id: "J",
    title: "Tech Hub",
    items: ["Sites, apps, IA, sistemas, Atlas"],
  },
  {
    id: "K",
    title: "Distribuição",
    items: ["Conteúdo gratuito nasce do pago. Lua é frente visual oficial."],
  },
];

const FILA_GRAVACAO = [
  { fase: "1", title: "Caminho da Energia", body: "8 fundamentos. Primeiro a gravar." },
  { fase: "2", title: "Área de membros", body: "Anubis → Horus → Isis → Ra." },
  { fase: "3", title: "Paladins", body: "Fechar grade, depois gravar." },
  { fase: "4", title: "Senda Tântrica", body: "Ordenar e gravar o que já existe." },
  { fase: "5", title: "Fascinação", body: "Só depois. Conteúdo ainda inexistente." },
];


const SMART_MONEY_LANG = {
  internal: "smart money / founding activation",
  external: [
    "Contribuição de ativação",
    "Founding activation",
    "Strategic build-in",
  ],
  why: "‘Smart money’ soa investimento com equity. Revenue share, percentual e sociedade são um segundo acordo, quando a economia existir.",
};
