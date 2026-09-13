/* Lote 1 — call Francesca. Motor reutilizável. Playbook específico. */
const MESA_CORE_STEPS = [
  { id: "conexao", t: "Conexão" },
  { id: "validacao", t: "Validar 1ª call" },
  { id: "visao", t: "Visão dela agora" },
  { id: "diagnostico", t: "Diagnóstico" },
  { id: "tour", t: "Tour controlado" },
  { id: "convergencia", t: "Convergência" },
  { id: "papel-dela", t: "Papel dela" },
  { id: "papel-meu", t: "Meu papel" },
  { id: "obra", t: "Primeira obra" },
  { id: "conteudo", t: "Conteúdo" },
  { id: "mentoria", t: "Mentoria" },
  { id: "ip", t: "Propriedade" },
  { id: "compromisso", t: "Compromisso" },
  { id: "investimento", t: "Investimento" },
  { id: "fechamento", t: "Fechamento" },
  { id: "proxima", t: "Próxima ação" }
];

const MESA_PRIVATE = {
  floor: 5000,
  offer: 17000,
  session: 350,
  note: "Piso e proposta: só você vê. Não ler em voz alta. Ela nomeia o número primeiro."
};

const SHOW_TABLE = {
  before: [
    "Landing pública do Akasha e do AF",
    "AF Plataforma: 2 telas, não 20",
    "Que existe método, call, aplicativo, condução",
    "Que Convergência é híbrido: plataforma + live + permanência",
    "Sua frase de identidade: ordem no dinheiro, aplicativo, legado"
  ],
  partial: [
    "Mapa Mãe em altitude (essência → sistema → legado), sem o arquivo inteiro",
    "Arquitetura de Essência: o que é, não o dossiê",
    "Faixa de obra (ativação vs sessão), sem tabela de piso",
    "Colabocracia na voz dela, confirmada, não explicada por você"
  ],
  after: [
    "DNA / prompts / código",
    "Volume Zero, gestão, teleprompt, lista de alunos",
    "Blueprint completo da Convergência",
    "Estratégia comercial interna, playbooks, Mesa",
    "Acesso de mentoranda / planos / preços de mentoria AF"
  ]
};

const CALL_QS = {
  visao: [
    "O que ficou mais forte depois da primeira call?",
    "O que o Beautiful Living precisa existir de concreto em 12 meses?",
    "Colabocracia, numa frase tua, o que é? Me dá um exemplo que já aconteceu."
  ],
  situacao: [
    "O que já existe na plataforma e o que ainda é ideia?",
    "Onde o sistema ainda depende só de você?",
    "Qual o maior gargalo entre visão e execução hoje?"
  ],
  execucao: [
    "Quem executa conteúdo, tech e comercial hoje?",
    "O que não pode continuar no improviso?"
  ],
  convergencia: [
    "Onde o meu trabalho se conecta melhor com o seu?",
    "Você me vê mais como arquiteto de sistema ou como parceiro de obra?"
  ],
  papel: [
    "Em que nível você entra: conversa, indicação, ou construção?",
    "O que você coloca além de conhecimento e rede?"
  ],
  ip: [
    "O que já é teu e precisa permanecer teu?",
    "O que a gente criar junto: como você imagina a autoria?"
  ],
  dinheiro: [
    "Se a gente sair da conversa e começar uma fase real agora, que nível de recurso você se sente confortável em comprometer nessa ativação?",
    "Isso é decisão sua nesta mesa, ou tem outra pessoa?"
  ],
  fechamento: [
    "A gente fecha a primeira ativação agora e eu já te coloco no mapa operacional?",
    "Qual é a próxima ação desta semana, com data?"
  ]
};

const ONE_PAGE = {
  title: "Founding Activation",
  sub: "12 meses de construção conjunta",
  value: "R$ 17.000",
  what: "Uma fase paga para mapear, integrar e ativar os dois ecossistemas. Colaborocracia é o destino. Esta entrada constrói a máquina.",
  includes: [
    "Arquitetura dos dois DNAs (o que converge, o que permanece de cada um)",
    "Protótipo visual da Convergência em menos de 30 dias",
    "V1 funcional até o fim de 2026: login, perfil, criar live, assistir, chat, encerrar, replay",
    "Mentoria aplicada ao teu campo (não como aluna comum)",
    "Conteúdo: estrutura editorial, não fábrica infinita",
    "Um primeiro recorte de fala internacional, se o evento estiver definido",
    "Testes, documentos e entrega das chaves"
  ],
  not: [
    "Tempo ilimitado",
    "Feature nova depois da V1 (nova obra)",
    "Cloud, anúncio, passagem, hotel, equipe extra",
    "Sociedade jurídica automática",
    "Abrir o Akasha inteiro antes do compromisso"
  ],
  done: "V1 usa: uma pessoa entra, cria live, outra assiste, fica replay. Isso está pronto."
};

const IP_SPLIT = [
  { who: "Freedom eE / Francesca", keep: "Conceitos, marca, Colabocracy, Beautiful Living, 13 saúdes, rede, conteúdo dela." },
  { who: "Akasha / Filipe", keep: "Método AF, plataforma AF, Mesa, código, prompts, Volume Zero, Arquitetura de Essência." },
  { who: "Cocriação", keep: "O que nascer desta obra. Acordo específico depois do pagamento. Não decidir percentual nesta call." }
];

const LOTE_LATER = [
  "Lote 2: decompor R$ 17.000 em marcos que somam 17.000 + garantia por entrega + incluído/não incluído.",
  "Lote 3: blueprint de conteúdo, mentoria Freedom eE, Convergência V1 técnica, speaker roadmap.",
  "Lote 4: termo para advogado, IP detalhado, revenue share (tudo [A DEFINIR]).",
  "Com ela: evento, idioma, tempo de palco, quem decide o dinheiro, o que aconteceu em 2012 (só se parceria financeira).",
  "Números dela (10 mil entrevistas, investimento próprio): claim público, não auditado. Não repetir como fato seu."
];
