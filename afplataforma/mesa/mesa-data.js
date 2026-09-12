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
