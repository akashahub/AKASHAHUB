export const CONTINENTS = [
  { id: "tesao", name: "TESÃO", metric: "Retenção média", color: "#7C3AED" },
  { id: "alegria", name: "ALEGRIA", metric: "Comentários vivos", color: "#D4AF37" },
  { id: "libido", name: "LIBIDO", metric: "Views / dia", color: "#A78BFA" },
  { id: "obsessao", name: "OBSESSÃO", metric: "Voltas ao perfil", color: "#E8D48B" }
];

export const DAY_TASKS = [
  { hour: 6, task: "Corpo + 10 min de silêncio antes do feed" },
  { hour: 9, task: "Bloco de execução AF / oferta (45 min)" },
  { hour: 12, task: "Uma entrega de valor na rede (sem pedir)" },
  { hour: 15, task: "Gravar 15–30s de presença (suor ou fala)" },
  { hour: 18, task: "Responder DMs quentes com script certo" },
  { hour: 21, task: "Postar ritual / conteúdo âncora do dia" },
  { hour: 23, task: "Diário de bordo: 5 linhas do que foi feito" }
];

export const TECHNICAS = [
  { name: "Polêmica fria", desc: "Afirmação forte sem xingar. Gera comentário, não cancelamento barato." },
  { name: "Prova extrema", desc: "Mostre o processo (madrugada, suor, número) — não só o discurso." },
  { name: "Ritual horário", desc: "Mesmo horário, mesma estética. O humano aprende a esperar." },
  { name: "Estética de poder", desc: "Ângulo baixo, preto, concreto, respiração. Visual masculino." },
  { name: "Som que vicia", desc: "Einaudi / sussurro / grave controlado. Áudio feminino." },
  { name: "História com tesão", desc: "Arco curto: dor → decisão → ritual → resultado." },
  { name: "Silêncio estratégico", desc: "Pausa no corte. O cérebro completa e fica." },
  { name: "Chamado CAIXA", desc: "Palavra-gatilho única. Rastreável. Treinável." },
  { name: "Espelho civilizacional", desc: "Egito, Viking, Maia — autoridade sem didatismo." },
  { name: "Loop de obsessão", desc: "Série de 3 posts que se respondem." }
];

export const SCRIPTS = {
  alegre: [
    "E aí 🔥 vi teu “CAIXA”. Respira — vamos com leveza. Me conta: o que te puxou primeiro, o conteúdo ou a ideia de legado?",
    "Chegou no lugar certo. Sem pressão. Me fala em uma frase o que você quer organizar na sua vida financeira agora.",
    "Rs — gosto quando a pessoa chega curiosa. Posso te mostrar o próximo passo em 2 minutos. Topa?"
  ],
  tesao: [
    "Imagina você com clareza de caixa, rotina e presença — não improvisando o mês. É isso que o sistema estrutura.",
    "Tem gente que só consome. Tem gente que executa. Se você sentiu o puxão, não ignora. Me fala onde dói hoje: dinheiro, foco ou ambos.",
    "O visual é poder. O áudio é presença. Juntos viram obsessão saudável por resultado. Quer o mapa?"
  ],
  obsessao: [
    "Eu só entro fundo com quem está disposto a ritual, não a like. Se for só curiosidade, tudo bem — mas o legado pede presença.",
    "CAIXA não é grito. É frequência. Se você voltou 3x, já sabe. Próximo passo: resposta objetiva do que você quer em 90 dias.",
    "Quem brinca não fecha. Quem fecha treina. Me manda: ‘quero o protocolo’ se for sério."
  ]
};

export const ACERVO = [
  { tags: ["egito", "visão"], source: "Egito Antigo", text: "Sete anos de fartura e sete de escassez — quem estoca na alta sustenta a baixa.", use: "Planejamento" },
  { tags: ["biblia", "visão"], source: "Provérbios 29:18", text: "Onde não há visão, o povo se dispersa.", use: "Hook de visão" },
  { tags: ["nietzsche", "proposito"], source: "Nietzsche", text: "Quem tem um porquê enfrenta quase qualquer como.", use: "Reprogramação" },
  { tags: ["jung", "sombra"], source: "Jung", text: "Aquilo a que você resiste persiste — o que você integra se torna força.", use: "Transformação" },
  { tags: ["osho", "presenca"], source: "Osho", text: "Seja total naquilo que faz. A mediocridade nasce da divisão.", use: "Corpo / dança" },
  { tags: ["fisica", "atencao"], source: "Observação", text: "O observador altera o observado. Atenção é força de campo.", use: "Arsenal" },
  { tags: ["viking", "disciplina"], source: "Nórdicos", text: "O inverno não pede motivação — pede preparação.", use: "Execução" },
  { tags: ["maia", "valor"], source: "Maia / Asteca", text: "Semente de cacau virou moeda: valor nasce de reinterpretação.", use: "Produto" },
  { tags: ["akasha"], source: "Akasha Hub", text: "Akasha: tudo que existe, existiu e vai existir. Todos os códigos.", use: "Assinatura" },
  { tags: ["mateus", "legado"], source: "Mateus 6:21", text: "Onde está o vosso tesouro, aí estará o vosso coração.", use: "Vendas alinhadas" },
  { tags: ["hill", "clareza"], source: "Napoleon Hill", text: "Riqueza começa como alvo específico, não como desejo vago.", use: "Oferta" },
  { tags: ["habacuque", "documento"], source: "Habacuque 2:2", text: "Escreve a visão e torna-a legível — para quem passa correndo ainda ler.", use: "Documentar plano" }
];

export function tasksNow() {
  const h = new Date().getHours();
  const sorted = [...DAY_TASKS].sort((a, b) => a.hour - b.hour);
  const up = sorted.filter((t) => t.hour >= h).slice(0, 3);
  return up.length >= 3 ? up : [...up, ...sorted].slice(0, 3);
}

export function legends(theme) {
  const t = (theme || "legado").trim();
  const tag = t.replace(/\s+/g, "");
  return [
    `🔥 ${t.toUpperCase()} não é post — é ritual.\nEnquanto o feed grita, quem constrói império respira e entrega.\n“Onde não há visão, o povo se dispersa.”\n#${tag} #AkashaHub #CAIXA #legado`,
    `Visual de concreto. Áudio que entra na pele.\n${t}: a alegria sobre-humano nasce do suor, não do like.\nEgito estocava na fartura. Você estoca disciplina.\n#eros #disciplina #${tag} #fogo`,
    `Jung: integre a sombra. Nietzsche: tenha um porquê.\nVocê: execute ${t} hoje — não amanhã.\nComenta CAIXA se a obsessão for real.\n#CAIXA #obsessao #akasha #${tag}`
  ];
}

export function hooks(theme) {
  const t = (theme || "atenção").trim();
  return [
    `Ninguém te ignora quando você fala de ${t} assim.`,
    `Pare de pedir atenção. Construa ${t} que vicia.`,
    `A verdade sobre ${t} que o feed não aguenta.`,
    `Eu testei ${t} por 30 dias. O resultado doeu.`,
    `Se ${t} fosse fácil, todo mundo teria império.`,
    `Isso aqui é ${t} com engenharia — não motivação.`,
    `3 sinais de que seu ${t} ainda é amador.`,
    `O ritual de ${t} que eu faço todo dia às 21h.`,
    `${t} + silêncio = obsessão. Explico.`,
    `Quem riu do meu ${t} agora pergunta o método.`
  ];
}
