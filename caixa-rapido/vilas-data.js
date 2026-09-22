/* Caixa Rápido · Vilas do Atlântico e região. Oferta: Legado. */
const LEGADO_URL = "https://akashahub.com.br/legado";

const CAIXA_OFFER = {
  name: "Legado",
  kid: "A gente constrói a loja no celular. Site, cara da marca, Google, fotos e um botão para te chamar. Assim quem está em casa também compra.",
  one: "Você não está comprando um site. Está construindo o patrimônio digital do negócio.",
  pieces: [
    { id: "site", t: "Site", kid: "Uma casa na internet com o nome da loja. Abre no celular, rápido." },
    { id: "logo", t: "Logo e cara", kid: "O desenho e as cores iguais na placa, no site e no Instagram." },
    { id: "id", t: "Identidade", kid: "Tudo parece a mesma loja. Não três lojas diferentes." },
    { id: "google", t: "Google", kid: "Quando alguém procura ‘perto de mim’, aparece você." },
    { id: "posts", t: "Posts", kid: "Fotos e recados prontos, toda semana, sem você inventar." },
    { id: "whats", t: "Botão de pedir", kid: "A pessoa aperta: quero. Cai no seu WhatsApp." },
    { id: "velo", t: "Velocidade", kid: "Mudou o preço, a gente muda. Não espera um mês." },
    { id: "seo", t: "Ser achado", kid: "Nome, endereço, horário e mapa certos. Sem mistério." }
  ],
  not: [
    "Não é postar por postar.",
    "Não é jogar o que já funciona no lixo.",
    "Não é um site bonito que ninguém acha.",
    "Não é preço nesta tela. Primeiro a gente olha o que você já tem."
  ],
  script90: [
    "Sua loja é clara na rua. No celular, muita gente não te acha.",
    "A gente constrói isso: site, Google, cara da marca, posts e um botão para pedir.",
    "Um ciclo. Uma prioridade. Uma evolução. Sem enrolação.",
    "Posso te mostrar em 40 segundos o que ficaria no seu nome?"
  ],
  close: "Se fizer sentido, marcamos um diagnóstico. Se não fizer, a gente se cumprimenta e segue."
};

const CAIXA_PITCH = {
  restaurante: "Quem passa na rua come. Quem está no sofá pesquisa. Se o Google não mostra a mesa, a mesa da concorrência enche.",
  padaria: "Pão quente de manhã. À tarde, alguém no celular procura ‘padaria perto’. Se você não aparece, o outro aparece.",
  academia: "Treino pede cara, horário e um botão de matrícula. Sem isso, a pessoa pergunta no balcão e desiste.",
  clinica: "Saúde é urgência e confiança. Site limpo + Google certo = a pessoa marca sem medo.",
  farmacia: "Remédio urgente. A pessoa pesquisa agora. Quem não está no mapa, perde a rua.",
  laboratorio: "Exame pede clareza: endereço, horário, o que fazer. Sem página, vira fila de pergunta.",
  barraca: "Orla vive de quem já conhece. Site e Google pegam o turista que ainda não te viu.",
  sushi: "Pedido no celular. Cardápio visível. Botão de WhatsApp. Sem isso, só entra quem já é freguês.",
  salao: "Antes de marcar, a pessoa olha foto. Identidade + posts + botão. Agenda enche fora da cadeira.",
  pet: "Tutor pesquisa de madrugada. Google + site com horário e WhatsApp. Simples assim.",
  acougue: "Carne boa se conta. Foto, pedido, retirada. Quem só tem balcão, perde o jantar de quem não saiu de casa.",
  tabacaria: "Cliente de hábito. Casa nova precisa de casa no celular. Google certo traz quem passa na avenida e ainda não parou.",
  loja: "Vitrine na rua, vitrine no celular. As duas precisam ter a mesma cara.",
  hotel: "Hóspede escolhe no Google antes de chegar. Foto, endereço, botão. Sem isso, o outro hotel ganha.",
  bar: "Noite se decide no celular. Cardápio, mapa, ‘estou aberto’."
};

const CAMPO_CLOSE = {
  kicker: "Mesa da rua · Igor adaptado",
  title: "Não é 50% off. É recorte de ciclo.",
  beats: [
    { n: "01", t: "Honra", d: "Entra. Pede suco ou café. Olha a casa. Não abre o notebook nos primeiros minutos." },
    { n: "02", t: "Olhar o que tem", d: "Instagram, Google, o site antigo se existir. O que funciona fica. A gente não joga nada no lixo." },
    { n: "03", t: "Espelho", d: "Na rua vocês estão claros. No celular, quem ainda não te conhece não acha a casa nova." },
    { n: "04", t: "PIT", d: "De 0 a 10, isso importa agora? Só mostra o recorte no 10. No 7, pergunta o que falta." },
    { n: "05", t: "Mostra", d: "Vira o notebook. Demo com o nome deles. 40 segundos. Não o Mesa inteiro. Não codear 4 horas no wifi." },
    { n: "06", t: "Recorte", d: "Ciclo 1 da vizinhança: casa no celular, Google, cara, botão. Agência cobra 8 a 12 mil pela obra. Aqui não é desconto. É um ciclo, não a obra infinita." },
    { n: "07", t: "Fecha", d: "PIX do diagnóstico ou do ciclo. Se não for 10, agradece e segue. Sem follow-up morno." }
  ],
  recorte: {
    market: "Agência local cobra 8 a 12 mil por site + identidade + Google.",
    ciclo: "Ciclo 1 · Casa: site, cara, Google, botão de pedir. Faixa 2,5 a 4,5 mil.",
    line: "Não falo 50% off. Falo recorte. Você não está comprando a agência. Está comprando o primeiro ciclo da casa no celular."
  },
  never: [
    "Não falar 50% abaixo do mercado.",
    "Não construir 4 horas no wifi deles.",
    "Não vender cannabis, SKU ilegal, delivery de erva.",
    "Não falar Francesca, AF mentoria, tantra, frequência, magnetismo.",
    "Não xingar o Instagram atual nem o site antigo.",
    "Não reconstruir o Lounge. Camada em cima.",
    "Não caçar esse fechamento no Instagram, Facebook ou TikTok. A porta é a rua."
  ]
};

const CAIXA_HOJE = [
  {
    id: "seplante",
    label: "Porta 1 · quente",
    name: "Se Plante Dispensário",
    why: "Collab Matinê já existe. Era tabacaria/cachimbo. Virou casa nova. Tinha site. Agora não tem.",
    act: "Sentar. Suco ou café. Abrir o demo. Não codear na hora.",
    demo: "/caixa-rapido/seplante/index.html",
    tone: "Casa nova precisa de casa no celular. O que já era, honra. O que mudou, a gente constrói."
  },
  {
    id: "loungevilas",
    label: "Porta 2 · inbound",
    name: "Lounge Vilas",
    why: "Pediu pra seguir. Já tem ecossistema. Não trocar.",
    act: "Honrar o que já funciona. Mostrar a camada, não um site novo.",
    demo: "/caixa-rapido/lounge/index.html",
    tone: "Camada em cima: Google certo, botão de pedir, mesma cara. O que já vende, fica."
  }
];

const CAIXA_STATUS = [
  { id: "mapa", t: "Mapa" },
  { id: "porta", t: "Ir na porta" },
  { id: "falou", t: "Falou" },
  { id: "mostrou", t: "Mostrou" },
  { id: "proposta", t: "Proposta" },
  { id: "sim", t: "Fechou" },
  { id: "nao", t: "Não" }
];

const CAIXA_CATS = [
  { id: "restaurante", t: "Restaurante" },
  { id: "padaria", t: "Padaria" },
  { id: "academia", t: "Academia" },
  { id: "clinica", t: "Clínica" },
  { id: "farmacia", t: "Farmácia" },
  { id: "laboratorio", t: "Laboratório" },
  { id: "barraca", t: "Barraca" },
  { id: "sushi", t: "Sushi" },
  { id: "salao", t: "Salão" },
  { id: "pet", t: "Pet" },
  { id: "acougue", t: "Açougue" },
  { id: "tabacaria", t: "Tabacaria" },
  { id: "loja", t: "Loja" },
  { id: "hotel", t: "Hotel" },
  { id: "bar", t: "Bar" }
];

function caixaKid(cat) {
  return CAIXA_PITCH[cat] || CAIXA_OFFER.kid;
}

const CAIXA_SHOPS = [
  { id: "seplante", name: "Se Plante Dispensário", cat: "tabacaria", where: "Vilas do Atlântico", hot: true, insta: "@seplantedispensarioofc", demo: "/caixa-rapido/seplante/index.html", relation: "Matinê já existe. Collab Lifestyle × Se Plante. Porta quente, não frio.", gap: "Era tabacaria e cachimbo. Virou Se Plante. Tinha site. Depois da mudança, a casa nova não tem casa no celular.", build: ["site", "logo", "id", "google", "posts", "whats"], next: "Sentar. Pedir suco ou café. Abrir o demo no notebook. Não construir na hora." },
  { id: "loungevilas", name: "Lounge Vilas", cat: "tabacaria", where: "Vilas do Atlântico", hot: true, demo: "/caixa-rapido/lounge/index.html", relation: "Inbound. Eles pediram pra seguir. Camada em cima, nunca substituição.", gap: "Já pediu pra seguir. Já tem ecossistema. Não trocar. Pôr a camada que falta: Google certo, botão, mesma cara.", build: ["google", "whats", "id", "posts"], next: "Honrar o que já funciona. Mostrar a camada, não um site novo." },
  { id: "donana", name: "Donana", cat: "restaurante", where: "Vilas do Atlântico", since: "1987", gap: "Casa histórica. A rua já conhece. O celular do turista talvez não.", build: ["site", "google", "posts", "whats"], next: "Pedir o dono. 90 segundos. Mostrar a tela clara." },
  { id: "kimukeka", name: "Ki-Mukeka", cat: "restaurante", where: "Vilas do Atlântico", gap: "Moqueca famosa. Precisa da mesma fama no Google.", build: ["site", "google", "id", "posts"], next: "Entrar fora do pico. Falar com quem manda." },
  { id: "casapalha", name: "Casa de Palha", cat: "restaurante", where: "Vilas do Atlântico", since: "2008", gap: "Cardápio enorme. Precisa de um caminho único no celular.", build: ["site", "logo", "posts", "whats"], next: "Mostrar: um botão, um cardápio, um Google." },
  { id: "camaraovilas", name: "Camarão Vilas", cat: "restaurante", where: "Av. Praia de Itapuã, 805", gap: "Frutos do mar. Pedido e reserva têm que caber no telefone.", build: ["site", "google", "whats", "posts"], next: "Almoço de terça. Dono ou gerente." },
  { id: "caranguejo", name: "Boteco do Caranguejo", cat: "bar", where: "R. Praia de Itamaracá, 317", gap: "Petisco de orla. Turista pesquisa ‘caranguejo Vilas’.", build: ["google", "site", "posts", "whats"], next: "Fim de tarde, antes da noite." },
  { id: "buona", name: "Cantina Buona Amici", cat: "restaurante", where: "R. Praia de Pajussara, 656", gap: "Italiano de bairro. Jantar se decide no celular.", build: ["site", "id", "google", "posts"], next: "Mostrar cara única: massa + reserva." },
  { id: "gelaguela", name: "Gelaguela", cat: "restaurante", where: "Av. Praia de Tramandaí, 5", gap: "Nome bom. Precisa aparecer quando alguém pesquisa.", build: ["google", "site", "posts"], next: "Confirmar dono. Mapear Instagram na hora." },
  { id: "dashi", name: "Dashi Sushi Bar", cat: "sushi", where: "Vilas do Atlântico", gap: "Sushi vive de pedido. Cardápio + botão.", build: ["site", "whats", "posts", "google"], next: "Pedir o cardápio atual e o WhatsApp oficial." },
  { id: "picui", name: "Restaurante Picui", cat: "restaurante", where: "Vilas", gap: "Casa local. Precisa de endereço e horário certos no Google.", build: ["google", "site", "id"], next: "Olhar o perfil do Google na frente deles." },
  { id: "salmarinho", name: "Sal Marinho", cat: "bar", where: "Vilas", gap: "Bar de orla. Foto + mapa + ‘aberto agora’.", build: ["posts", "google", "site"], next: "Noite de semana, não sábado." },
  { id: "health", name: "Health Valley", cat: "restaurante", where: "Vilas", gap: "Comida com cara de saúde. Identidade tem que ser limpa.", build: ["id", "site", "posts", "google"], next: "Falar de clareza, não de ‘marketing’." },
  { id: "mareblu", name: "Barraca Maré Blu", cat: "barraca", where: "Orla de Vilas", gap: "Quem já vai, vai. Quem pesquisa praia, precisa te achar.", build: ["google", "posts", "whats"], next: "Manhã de semana na barraca." },
  { id: "buraco", name: "Barraca Buraco da Velha", cat: "barraca", where: "Orla de Vilas", gap: "Tradição de família. O nome tem que estar no Google certo.", build: ["google", "site", "posts"], next: "Honrar a história. Não falar ‘rebranding’." },
  { id: "odoya", name: "Barraca Odoyá Iemanjá", cat: "barraca", where: "Orla de Vilas", gap: "Nome forte. Precisa de foto, mapa e horário.", build: ["google", "posts", "id"], next: "Conversar com quem está na caixa." },
  { id: "mariajudith", name: "Maria Judith", cat: "bar", where: "Vilas / Lauro", gap: "Bar e restaurante. Um só caminho no celular.", build: ["site", "google", "whats"], next: "Confirmar endereço na porta." },
  { id: "docepao", name: "Doce Pão Vilas", cat: "padaria", where: "Vilas do Atlântico", since: "2013", gap: "Abre cedo, vende o dia. O sofá também precisa achar o pão.", build: ["google", "posts", "site", "whats"], next: "Depois das 9h. Mostrar o botão de encomenda." },
  { id: "vilasfitness", name: "Vilas Fitness", cat: "academia", where: "R. Praia de Ondina, 50", gap: "Avaliação alta. Matrícula tem que ser um toque, não uma fila.", build: ["site", "whats", "posts", "id"], next: "Recepção. Pedir o gestor." },
  { id: "andreamaestri", name: "Andrea Maestri", cat: "academia", where: "Av. Praia de Itapuã, 1146", gap: "Academia de mulheres. Identidade clara. Horário e aula no site.", build: ["id", "site", "google", "posts"], next: "Falar com a frente. Linguagem de cuidado, não de funil." },
  { id: "alpha1", name: "Alpha Fitness Vilas 1", cat: "academia", where: "Av. Praia de Itapuã, 805", gap: "Rede com unidade local. Unidade precisa de cara de Vilas.", build: ["site", "posts", "google"], next: "Gerente da unidade, não a holding." },
  { id: "kore", name: "Studio Kore", cat: "academia", where: "Av. Praia de Itapuã, 1808", gap: "Funcional. Turma e horário no celular.", build: ["site", "whats", "posts"], next: "Entre aulas." },
  { id: "acquanova", name: "Acqua Nova", cat: "academia", where: "R. Praia de Pajussara, 29", gap: "Natação. Pai pesquisa horário da criança de noite.", build: ["site", "google", "whats", "posts"], next: "Mostrar: horários + botão de matrícula." },
  { id: "santana", name: "Farmácia Sant'Ana", cat: "farmacia", where: "Av. Praia de Itapuã, Qd. 4", gap: "Urgência. Se o Google erra o horário, a pessoa vai na outra.", build: ["google", "seo", "whats", "site"], next: "Farmacêutico responsável. 60 segundos." },
  { id: "labchecap", name: "Labchecap", cat: "laboratorio", where: "Av. Praia de Tramandaí, 412", gap: "Exame pede endereço, jejum, horário. Página clara vende confiança.", build: ["site", "google", "id"], next: "Recepção. Pedir quem decide comunicação." },
  { id: "mastogin", name: "Mastogin", cat: "clinica", where: "Av. Luiz Tarquínio, 2580", gap: "Clínica de confiança. Site tem que parecer consultório, não banner.", build: ["site", "id", "google", "seo"], next: "Secretária → médico dono." },
  { id: "malibu", name: "Hotel Malibu", cat: "hotel", where: "Av. Praia de Itapuã · marco de Vilas", gap: "Marco da avenida. Hóspede escolhe no Google antes de chegar.", build: ["google", "site", "posts", "id"], next: "Recepção / gerência. Fora do check-in." },
  { id: "map-padaria", name: "Padaria da rua (a mapear)", cat: "padaria", where: "Vilas · avenida e alamedas", gap: "Entrar, anotar o nome da fachada, o Instagram da caixa.", build: ["google", "posts", "site"], next: "Caminhar Av. Praia de Itapuã de manhã.", draft: true },
  { id: "map-acougue", name: "Açougue da rua (a mapear)", cat: "acougue", where: "Vilas e Buraquinho", gap: "Foto da vitrine + pedido no WhatsApp.", build: ["posts", "whats", "google"], next: "Final da manhã, antes do almoço.", draft: true },
  { id: "map-tabacaria", name: "Outra tabacaria (a mapear)", cat: "tabacaria", where: "Av. Praia de Itapuã", gap: "Se Plante e Lounge já estão no topo. Anotar as outras fachadas.", build: ["google", "id", "posts"], next: "Anotar fachada e quem atende.", draft: true },
  { id: "map-salao", name: "Salão / barbearia (a mapear)", cat: "salao", where: "Vilas", gap: "Agenda vive de foto. Identidade + posts + botão.", build: ["id", "posts", "whats", "site"], next: "Meio de tarde, cadeira vazia.", draft: true },
  { id: "map-pet", name: "Pet shop / vet (a mapear)", cat: "pet", where: "Vilas", gap: "Tutor pesquisa de madrugada. Horário e WhatsApp.", build: ["google", "site", "whats"], next: "Pedir o nome oficial na nota fiscal.", draft: true },
  { id: "map-loja", name: "Loja de rua (a mapear)", cat: "loja", where: "Vilas · comércio da avenida", gap: "Vitrine física + vitrine no celular, mesma cara.", build: ["id", "site", "posts", "google"], next: "Entrar, elogiar a loja, mostrar a tela.", draft: true },
  { id: "map-portao", name: "Comércio Portão (a mapear)", cat: "loja", where: "Portão · Lauro de Freitas", gap: "Região. Mesma oferta, outro quarteirão.", build: ["google", "site", "posts"], next: "Um dia de rota Portão.", draft: true },
  { id: "map-buraquinho", name: "Comércio Buraquinho (a mapear)", cat: "loja", where: "Buraquinho", gap: "Bairro crescendo. Quem chega agora ainda não tem casa digital.", build: ["site", "google", "id"], next: "Um dia de rota Buraquinho.", draft: true }
];

const PACK_VILAS = {
  id: "vilas",
  hero: {
    kicker: "Caixa rápido · Vilas e região",
    title: "Mapa. Porta. Mostra. Fecha.",
    lede: "Oferta Legado, linguagem de criança. Um comércio por vez. Sem enrolação."
  },
  values: [1500, 2500, 4500, 7000],
  faixas: [
    { id: "v1", min: 0, max: 2000, name: "Porta", range: "Diagnóstico", done: "Olhar o que existe. Dizer o que falta. Uma página.", opens: ["Mapa do que já tem"], closed: ["Site inteiro"] },
    { id: "v2", min: 2001, max: 4500, name: "Casa", range: "Primeiro ciclo", done: "Site + Google + cara. Um botão de pedir.", opens: ["Patrimônio digital mínimo"], closed: ["App", "Tráfego pago infinito"] },
    { id: "v3", min: 4501, max: 9000, name: "Ritmo", range: "Casa + conteúdo", done: "Identidade, posts, velocidade de atualização.", opens: ["Calendário", "SEO vivo"], closed: ["Obra infinita"] }
  ],
  person: {
    name: "Vilas · Caixa Rápido",
    role: "Comércios locais · Legado",
    facts: [
      "Vilas do Atlântico, Lauro de Freitas. Região: Buraquinho, Portão, Ipitanga.",
      "Duas portas quentes agora: Se Plante Dispensário (Matinê) e Lounge Vilas (inbound).",
      "Oferta única: akashahub.com.br/legado",
      "Falar como se tivesse 7 anos na frente: o que a loja ganha, não o jargão.",
      "Não empurrar Francesca, AF mentoria, Convergência, tantra.",
      "Instagram, Facebook e TikTok desligados. A porta é a rua. Demo no notebook."
    ],
    ecosystems: [
      { name: "Quente", body: "Se Plante. Lounge Vilas. Relação já existe." },
      { name: "Rua", body: "Padaria, farmácia, açougue, salão, tabacaria." },
      { name: "Orla", body: "Restaurante, barraca, bar, hotel." },
      { name: "Corpo", body: "Academia, clínica, laboratório, pet." }
    ],
    posture: [
      "Dono para dono. Sem guru.",
      "Mostrar a tela. Não explicar nuvem.",
      "Um ciclo. Uma prioridade.",
      "Se não for 10, não força.",
      "Recorte, nunca 50% off."
    ]
  },
  whatsapp: "Oi. Passei na loja e vi uma coisa simples: na rua vocês estão claros. No celular, muita gente ainda não acha. Eu construo isso — site, Google, cara da marca, posts e um botão para pedir. Sem enrolação. Posso te mostrar em 40 segundos?",
  neverGlobal: [
    "Não falar mentoria, frequência, magnetismo, Convergência.",
    "Não falar preço na porta se a pessoa não pediu.",
    "Não xingar o Instagram atual.",
    "Não prometer ‘vamos viralizar’.",
    "Não falar 50% abaixo do mercado. Recorte de ciclo.",
    "Não construir 4 horas no wifi deles. Demo já existe.",
    "Não vender cannabis nem SKU ilegal.",
    "Não caçar fechamento no Instagram, Facebook ou TikTok."
  ],
  acts: [
    { id: "olho", n: 1, label: "Olho", minutes: "0–20 s", intent: "Ver a fachada. Nome certo. Quem atende.",
      script: ["Anotar o nome da placa, não o apelido.", "Ver se tem QR, Instagram na caixa, Google na porta."],
      questions: ["Qual é o nome oficial?"],
      never: ["Não filmar sem pedir."],
      nextIfCold: "Sair. Voltar em outro horário." },
    { id: "porta", n: 2, label: "Porta", minutes: "20–90 s", intent: "Pedir quem manda. 90 segundos.",
      script: CAIXA_OFFER.script90,
      questions: ["Você é quem decide a frente da loja?"],
      never: ["Não despejar SEO, funil, tráfego."],
      nextIfCold: "Deixar o recado e o link do Legado." },
    { id: "mostra", n: 3, label: "Mostra", minutes: "40 s", intent: "Virar o notebook. Demo com o nome deles.",
      script: [CAIXA_OFFER.kid, "Site, cara, Google, posts, botão de pedir.", "Isto já está no seu nome. Não é um rascunho de 4 horas."],
      questions: ["Isso, no seu nome, faria sentido agora?"],
      never: ["Não abrir o Mesa inteiro.", "Não codear na mesa do café."],
      nextIfCold: "Fechar o notebook. Agradecer." },
    { id: "fecha", n: 4, label: "Fecha", minutes: "se for 10", intent: "Recorte de ciclo. Não desconto. Não obra infinita.",
      script: [
        "A gente olha o que você já tem. O que funciona fica. O que falta, a gente constrói.",
        CAMPO_CLOSE.recorte.line,
        "akashahub.com.br/legado"
      ],
      questions: ["Amanhã ou hoje, 20 minutos?", "De 0 a 10, isso importa agora?"],
      never: ["Não inventar desconto na calçada.", "Não falar 50% off."],
      nextIfCold: "WhatsApp do script. Sem perseguir." }
  ],
  objecoes: [
    { title: "Já tenho Instagram", hear: "A gente já posta.", break: ["Instagram é a rua. Site e Google são a casa. Se a rua fecha, a casa continua."] },
    { title: "Está caro", hear: "Não é prioridade.", break: ["Não é um site. É a loja no celular. A gente recorta um ciclo, não desconto vazio."] },
    { title: "Meu sobrinho faz", hear: "Tem alguém da família.", break: ["Ótimo. A gente não compete com família. A gente deixa pronto o que a família não termina."] },
    { title: "Depois", hear: "Me chama semana que vem.", break: ["Pode. O que não faço é conversa fria. Hoje eu mostro. Você decide."] },
    { title: "Já tem site / app", hear: "A gente já tem um ecossistema.", break: ["Perfeito. Não vou reconstruir. Mostro a camada que falta no celular de quem ainda não parou na porta."] }
  ],
  posture: [
    "Clareza. Uma criança de 7 anos entende o benefício.",
    "Um comércio por vez.",
    "Legado é a oferta. Mesa é o quadro. Rua é o campo.",
    "Recorte. Nunca 50% off."
  ]
};
