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

const CAIXA_ZONAS = [
  { id: "vilas", t: "Vilas" },
  { id: "abrantes", t: "Abrantes" }
];
function zonaOf(s) { return (s && s.zona) || "vilas"; }
function zonaLabel(s) {
  const id = typeof s === "string" ? s : zonaOf(s);
  const z = CAIXA_ZONAS.find((x) => x.id === id);
  return z ? z.t : id;
}

const CAIXA_SHOPS = [
  { id: "seplante", name: "Se Plante Dispensário", cat: "tabacaria", where: "Vilas do Atlântico", hot: true, insta: "@seplantedispensarioofc", demo: "/caixa-rapido/seplante/index.html", relation: "Matinê já existe. Collab Lifestyle × Se Plante. Porta quente, não frio.", wa: "557197210220", waNote: "confirmado", ajuda: "Site", ajudaLinha: "A casa nova não tem casa no celular. A ajuda é o site: catálogo, Google e botão no WhatsApp. O demo já está pronto.", recado: "Oi. Passei no Se Plante. A casa ficou clara na rua — no celular, quem não está aí ainda não acha. Posso te mostrar em 40 segundos?", gap: "Era tabacaria e cachimbo. Virou Se Plante. Tinha site. Depois da mudança, a casa nova não tem casa no celular.", build: ["site", "logo", "id", "google", "posts", "whats"], next: "Sentar. Pedir suco ou café. Abrir o demo no notebook. Não construir na hora." },
  { id: "loungevilas", name: "Lounge Vilas", cat: "tabacaria", where: "Av. Praia de Itapuã, 1750", hot: true, demo: "/caixa-rapido/lounge/index.html", relation: "Inbound. Eles pediram pra seguir. Camada em cima, nunca substituição.", wa: "5571981874815", waNote: "catálogo Kyte · confirmar se ainda é o da casa", ajuda: "SEO", ajudaLinha: "Já tem catálogo no Kyte. Não é site novo. É ser achado no Google, com a mesma cara, e collab de movimento com a rua.", recado: "Oi. Passei no Lounge Vilas. O que vocês já têm funciona. Queria mostrar uma camada em cima, sem trocar o catálogo. 40 segundos.", gap: "Já pediu pra seguir. Já tem ecossistema. Não trocar. Pôr a camada que falta: Google certo, botão, mesma cara.", build: ["google", "whats", "id", "posts"], next: "Honrar o que já funciona. Mostrar a camada, não um site novo." },
  { id: "donana", name: "Donana", cat: "restaurante", where: "Av. Praia de Itapuã, Qd 04", since: "1987", tel: "7133794364", ajuda: "SEO", ajudaLinha: "Já tem site (donanarestaurante.com.br). A unidade Vilas precisa ser achada na busca local. Conteúdo semanal só se o Google já estiver certo. O público é fixo — pedir o WhatsApp.", gap: "Casa histórica. A rua já conhece. O celular do turista talvez não.", build: ["google", "posts", "seo"], next: "Pedir o dono. 90 segundos. Olhar o Google da unidade, não oferecer outro site." },
  { id: "kimukeka", name: "Ki-Mukeka", cat: "restaurante", where: "R. Praia do Tubarão, 70", tel: "7133695381", ajuda: "Conteúdo", ajudaLinha: "A moqueca já é famosa e o Google acha esta casa. Fixo da unidade. Não usar o WhatsApp de Itapuã nem o de Armação. Ajuda: prato do dia e collab com a orla, não outro site.", gap: "Moqueca famosa. Precisa da mesma fama no Google.", build: ["posts", "id"], next: "Entrar fora do pico. Pedir o Zap desta unidade. Não falar em site da rede." },
  { id: "casapalha", name: "Casa de Palha", cat: "restaurante", where: "Estrada do Coco, km 5 · Pitangueiras", since: "2008", wa: "5571991680888", waNote: "publicado", tel: "7133691151", ajuda: "SEO", ajudaLinha: "Já tem site (casadepalha.com.br) e WhatsApp. Ajuda: um cardápio só, que cai no Zap, e busca ‘restaurante Estrada do Coco / Vilas’. Não construir outra casa.", gap: "Cardápio enorme. Precisa de um caminho único no celular.", build: ["seo", "whats", "posts"], next: "Mostrar o caminho único. Não abrir um site novo." },
  { id: "camaraovilas", name: "Camarão Vilas", cat: "restaurante", where: "Av. Praia de Itapuã, 805", wa: "5571982005212", waNote: "publicado · reserva", ajuda: "Conteúdo", ajudaLinha: "Já reserva no WhatsApp. Ajuda: conteúdo do prato e collab de movimento na avenida. SEO só se, na porta, a busca ‘camarão Vilas’ não cair neles.", gap: "Frutos do mar. Pedido e reserva têm que caber no telefone.", build: ["posts", "whats"], next: "Almoço de terça. Dono ou gerente. Não vender site se a reserva já fecha." },
  { id: "caranguejo", name: "Boteco do Caranguejo", cat: "bar", where: "Av. Praia de Itapuã, 893", insta: "@botecodocaranguejo", wa: "5571997098380", waNote: "pedido publicado · confirmar na porta", tel: "7133635151", ajuda: "Collab", ajudaLinha: "Já está no Google, tem Instagram e pedido no Zap. Ajuda: collab de movimento — noite ao vivo com a orla. Conteúdo da semana se quiserem ritmo. Não é site novo.", gap: "Petisco de orla. Turista pesquisa ‘caranguejo Vilas’.", build: ["posts"], next: "Fim de tarde, antes da noite. Falar de movimento, não de obra." },
  { id: "buona", name: "Cantina Buona Amici", cat: "restaurante", where: "R. Praia de Pajussara, 656", ajuda: "SEO", ajudaLinha: "A unidade da Pajussara aparece no mapa, sem telefone público. Pedir o WhatsApp na porta. Ajuda: SEO desta unidade e reserva no botão. Não usar o telefone da Pituba.", gap: "Italiano de bairro. Jantar se decide no celular.", build: ["seo", "google", "whats"], next: "Confirmar que é a casa de Vilas. Mostrar o Google com o endereço certo." },
  { id: "gelaguela", name: "Gelaguela", cat: "restaurante", where: "Av. Praia de Tramandaí, 5", ajuda: "SEO", ajudaLinha: "Telefone não achei. Pedir WhatsApp na porta. Primeiro olhar o Google na frente deles: se não aparece, a ajuda é SEO. Site só se não existir casa nenhuma.", gap: "Nome bom. Precisa aparecer quando alguém pesquisa.", build: ["google", "seo"], next: "Confirmar dono. Mapear Instagram na hora. Não prometer site antes de olhar o Google." },
  { id: "dashi", name: "Dashi Sushi Bar", cat: "sushi", where: "Av. Luiz Tarquínio Pontes, 3024 · Buraquinho", cel: "71981754413", ajuda: "Conteúdo", ajudaLinha: "Já tem site (restaurantedashi.com) e entrega. O celular público não está marcado como WhatsApp — confirmar. Não usar o número do CNPJ. Ajuda: conteúdo do combo e collab em Buraquinho, não outro cardápio.", gap: "Sushi vive de pedido. Cardápio + botão.", build: ["posts"], next: "Pedir o WhatsApp oficial. Mostrar ritmo de conteúdo, não um site novo." },
  { id: "picui", name: "Restaurante Picui", cat: "restaurante", where: "Vilas", ajuda: "SEO", ajudaLinha: "Número não achei. Pedir na porta. Ajuda: Google com endereço e horário certos. Site só se a ficha estiver vazia.", gap: "Casa local. Precisa de endereço e horário certos no Google.", build: ["google", "seo"], next: "Olhar o perfil do Google na frente deles." },
  { id: "salmarinho", name: "Sal Marinho", cat: "bar", where: "Vilas", ajuda: "SEO", ajudaLinha: "Sem telefone público. Pedir WhatsApp na porta. Ajuda: mapa, foto e ‘aberto agora’. Conteúdo de noite só se o Google já estiver certo.", gap: "Bar de orla. Foto + mapa + ‘aberto agora’.", build: ["google", "posts"], next: "Noite de semana, não sábado." },
  { id: "health", name: "Health Valley", cat: "restaurante", where: "Av. Praia de Itapuã, 1053", tel: "7141130152", ajuda: "SEO", ajudaLinha: "O telefone publicado não é o WhatsApp do delivery — pedir esse número na porta. Ajuda: ser achado em ‘comida saudável Vilas’. Conteúdo limpo se o Google já entrega a casa.", gap: "Comida com cara de saúde. Identidade tem que ser limpa.", build: ["seo", "posts", "id"], next: "Falar de clareza. Pedir o Zap do delivery. Não chamar de marketing." },
  { id: "mareblu", name: "Barraca Maré Blu", cat: "barraca", where: "R. Praia de Búzios · orla", insta: "@marebluvillas", cel: "71996414181", ajuda: "SEO", ajudaLinha: "Tem Instagram, sem site achado. O celular não está marcado como WhatsApp — confirmar. Ajuda: Google com horário, mapa e foto de manhã. Site só se o perfil não bastar.", gap: "Quem já vai, vai. Quem pesquisa praia, precisa te achar.", build: ["google", "posts"], next: "Manhã de semana na barraca. Olhar o Google no celular, na frente." },
  { id: "buraco", name: "Barraca Buraco da Velha", cat: "barraca", where: "Orla de Vilas", ajuda: "SEO", ajudaLinha: "Tradição, ficha em guia, telefone não achei. Pedir WhatsApp na porta. Ajuda: nome certo no Google. Sem falar rebranding. Conteúdo da família se a busca já cair neles.", gap: "Tradição de família. O nome tem que estar no Google certo.", build: ["google", "seo"], next: "Honrar a história. Não falar ‘rebranding’." },
  { id: "odoya", name: "Barraca Odoyá Iemanjá", cat: "barraca", where: "Orla de Vilas", ajuda: "SEO", ajudaLinha: "Nome forte, sem telefone público. Pedir na caixa. Ajuda: foto, mapa e horário no Google. Site não é o primeiro passo de barraca.", gap: "Nome forte. Precisa de foto, mapa e horário.", build: ["google", "posts"], next: "Conversar com quem está na caixa." },
  { id: "mariajudith", name: "Maria Judith", cat: "bar", where: "Vilas / Lauro", ajuda: "Site", ajudaLinha: "Não achei site nem WhatsApp. Na porta: se não tem casa no celular, a ajuda é um caminho só — site curto e botão. Se já tem e some, vira SEO.", gap: "Bar e restaurante. Um só caminho no celular.", build: ["site", "google", "whats"], next: "Confirmar endereço na porta antes de prometer peça." },
  { id: "docepao", name: "Doce Pão Vilas", cat: "padaria", where: "Vilas do Atlântico", since: "2013", insta: "@docepaovilas", ajuda: "SEO", ajudaLinha: "Tem Instagram, telefone não achei. Pedir o Zap de encomenda na porta. Ajuda: ser achado de manhã no Google. Site só se a padaria não tiver casa nenhuma.", gap: "Abre cedo, vende o dia. O sofá também precisa achar o pão.", build: ["google", "seo", "whats"], next: "Depois das 9h. Olhar a busca ‘padaria Vilas’ na frente deles." },
  { id: "vilasfitness", name: "Vilas Fitness", cat: "academia", where: "R. Praia de Ondina, 50", tel: "7133794659", ajuda: "Academy", ajudaLinha: "Já tem site (academiavilasfitness.com) e o Google acha. Fixo, não WhatsApp. Ajuda: comunidade no molde da Fluir Academy (akashahub.com.br/academy) — horário, aula, conteúdo. Collab com a orla. Convergência só depois, como porta do app, não na primeira frase.", gap: "Avaliação alta. Matrícula tem que ser um toque, não uma fila.", build: ["posts", "id"], next: "Recepção. Pedir o gestor. Não oferecer site." },
  { id: "andreamaestri", name: "Andrea Maestri", cat: "academia", where: "Av. Praia de Itapuã, 1146", insta: "@andreamaestriacademia", wa: "5571988197660", waNote: "publicado", tel: "7133791513", ajuda: "Academy", ajudaLinha: "Já tem WhatsApp, Instagram e Wellhub. Ajuda: comunidade de alunas no molde da Fluir Academy. Conteúdo de aula e collab com outras casas de Vilas. Convergência entra depois, não como abertura.", recado: "Oi. Passei na Andrea Maestri. Vi a casa clara pra quem já treina aí. Queria te mostrar um jeito de a aluna continuar perto, sem trocar o que já funciona. 40 segundos.", gap: "Academia de mulheres. Identidade clara. Horário e aula no site.", build: ["posts", "id"], next: "Falar com a frente. Cuidado, não funil. Não abrir com app." },
  { id: "alpha1", name: "Alpha Fitness Vilas 1", cat: "academia", where: "Av. Praia de Itapuã, 805", tel: "7133795928", ajuda: "Conteúdo", ajudaLinha: "A rede já tem site. O mapa mistura o 805 com o Camarão — confirmar a porta. Ajuda da unidade: conteúdo local e collab no bairro. Gerente, não a holding. Fixo — pedir o WhatsApp.", gap: "Rede com unidade local. Unidade precisa de cara de Vilas.", build: ["posts"], next: "Gerente da unidade, não a holding." },
  { id: "kore", name: "Studio Kore", cat: "academia", where: "Av. Praia de Itapuã, 1808", ajuda: "Academy", ajudaLinha: "Número não achei. Pedir WhatsApp entre as aulas. Se já tem Instagram e Google, a ajuda é comunidade de turma no molde da Academy. Site só se não existir página de horário.", gap: "Funcional. Turma e horário no celular.", build: ["posts", "whats"], next: "Entre aulas. Olhar se o horário já está no Google antes de falar em site." },
  { id: "acquanova", name: "Acqua Nova", cat: "academia", where: "R. Praia de Pajussara, 29", insta: "@acquanovanatacao", cel: "71994016891", ajuda: "SEO", ajudaLinha: "Pai pesquisa horário da criança de noite. Celular do Wellhub — confirmar se é WhatsApp. Ajuda: horários acháveis. Se isso já existe, comunidade de pais no molde da Academy.", gap: "Natação. Pai pesquisa horário da criança de noite.", build: ["google", "seo", "posts"], next: "Mostrar a busca de horário. Pedir o Zap. Academy só se o Google já entrega." },
  { id: "santana", name: "Farmácia Sant'Ana", cat: "farmacia", where: "Av. Praia de Itapuã, Qd. 4", ajuda: "SEO", ajudaLinha: "Urgência: horário errado no Google manda a pessoa pra outra. Número desta unidade não achei — pedir na farmácia. Ajuda: ficha certa. Site da rede não substitui o horário da porta.", gap: "Urgência. Se o Google erra o horário, a pessoa vai na outra.", build: ["google", "seo"], next: "Farmacêutico responsável. 60 segundos. Olhar o horário no celular, juntos." },
  { id: "labchecap", name: "Labchecap", cat: "laboratorio", where: "Av. Praia de Tramandaí, 412", tel: "7133458200", ajuda: "SEO", ajudaLinha: "Rede. O número público é call center, não WhatsApp da unidade. Há conflito de endereço (Tramandaí 412 ou Itapuã). Ajuda local: endereço, jejum e horário claros. Não vender site da rede.", gap: "Exame pede endereço, jejum, horário. Página clara vende confiança.", build: ["google", "seo"], next: "Recepção. Confirmar qual porta é a de Vilas. Pedir quem decide a ficha local." },
  { id: "mastogin", name: "Mastogin", cat: "clinica", where: "Av. Luiz Tarquínio, 2580", ajuda: "Site", ajudaLinha: "Não achei site nem WhatsApp. Na porta: se não tem casa, a ajuda é um site com cara de consultório e Google. Se já tem, vira SEO e conteúdo de confiança — sem banner.", gap: "Clínica de confiança. Site tem que parecer consultório, não banner.", build: ["site", "id", "google"], next: "Secretária → médico dono. Não prometer antes de ver o que já existe." },
  { id: "malibu", name: "Hotel Malibu", cat: "hotel", where: "Av. Praia de Itapuã, Qd 19 · Malibu Plaza", tel: "7130264444", ajuda: "Conteúdo", ajudaLinha: "Já está no Google e nas OTAs. Recepção é fixo. Ajuda: reserva direta no botão e conteúdo da orla pra quem escolhe antes de chegar. Não um site de hotel do zero. Pedir o WhatsApp da gerência.", gap: "Marco da avenida. Hóspede escolhe no Google antes de chegar.", build: ["posts", "whats"], next: "Recepção / gerência. Fora do check-in." },
  { id: "map-padaria", name: "Padaria da rua (a mapear)", cat: "padaria", where: "Vilas · avenida e alamedas", draft: true, ajuda: "Mapear", ajudaLinha: "Ainda sem fachada. Na porta: nome, se tem site, se o Google acha, e o WhatsApp. Sem site → site. Tem site e some → SEO. Já é achado → conteúdo ou collab.", gap: "Entrar, anotar o nome da fachada, o Instagram da caixa.", build: ["google", "posts", "site"], next: "Caminhar Av. Praia de Itapuã de manhã." },
  { id: "map-acougue", name: "Açougue da rua (a mapear)", cat: "acougue", where: "Vilas e Buraquinho", draft: true, ajuda: "Mapear", ajudaLinha: "Ainda sem fachada. Anotar vitrine, WhatsApp da caixa e se o Google acha. Pedido no Zap é o caminho. Site só se não houver casa nenhuma.", gap: "Foto da vitrine + pedido no WhatsApp.", build: ["posts", "whats", "google"], next: "Final da manhã, antes do almoço." },
  { id: "map-tabacaria", name: "Outra tabacaria (a mapear)", cat: "tabacaria", where: "Av. Praia de Itapuã", draft: true, ajuda: "Mapear", ajudaLinha: "Se Plante e Lounge já estão no topo. Nas outras fachadas: anotar se tem site. Sem site → site. Com site → SEO ou collab, sem copiar a conversa das duas portas quentes.", gap: "Se Plante e Lounge já estão no topo. Anotar as outras fachadas.", build: ["google", "id", "posts"], next: "Anotar fachada e quem atende." },
  { id: "map-salao", name: "Salão / barbearia (a mapear)", cat: "salao", where: "Vilas", draft: true, ajuda: "Mapear", ajudaLinha: "Ainda sem nome. Agenda vive de foto. Se não tem site, site curto com botão. Se já posta e o Google acha, a ajuda é comunidade de cliente — molde da Academy — ou collab.", gap: "Agenda vive de foto. Identidade + posts + botão.", build: ["id", "posts", "whats", "site"], next: "Meio de tarde, cadeira vazia." },
  { id: "map-pet", name: "Pet shop / vet (a mapear)", cat: "pet", where: "Vilas", draft: true, ajuda: "Mapear", ajudaLinha: "Ainda sem nome. Tutor pesquisa de madrugada. Sem ficha no Google → SEO. Sem casa nenhuma → site com horário e WhatsApp.", gap: "Tutor pesquisa de madrugada. Horário e WhatsApp.", build: ["google", "site", "whats"], next: "Pedir o nome oficial na nota fiscal." },
  { id: "map-loja", name: "Loja de rua (a mapear)", cat: "loja", where: "Vilas · comércio da avenida", draft: true, ajuda: "Mapear", ajudaLinha: "Ainda sem fachada. Vitrine física primeiro. Sem site → site com a mesma cara. Já tem site e não aparece → SEO. Já aparece → conteúdo.", gap: "Vitrine física + vitrine no celular, mesma cara.", build: ["id", "site", "posts", "google"], next: "Entrar, elogiar a loja, mostrar a tela." },
  { id: "map-portao", name: "Comércio Portão (a mapear)", cat: "loja", where: "Portão · Lauro de Freitas", draft: true, ajuda: "Mapear", ajudaLinha: "Rota, não uma porta. Mesma escada: sem site → site. Some no Google → SEO. Já é achado → conteúdo, collab ou comunidade.", gap: "Região. Mesma oferta, outro quarteirão.", build: ["google", "site", "posts"], next: "Um dia de rota Portão." },
  { id: "map-buraquinho", name: "Comércio Buraquinho (a mapear)", cat: "loja", where: "Buraquinho", draft: true, ajuda: "Mapear", ajudaLinha: "Bairro crescendo. Quem não tem casa digital: site. Quem já tem e não é achado: SEO. Dashi já está no mapa — não repetir a conversa.", gap: "Bairro crescendo. Quem chega agora ainda não tem casa digital.", build: ["site", "google", "id"], next: "Um dia de rota Buraquinho." },

  { id: "ab-farmaciapraca", zona: "abrantes", name: "Farmácia da Praça", cat: "farmacia", where: "Av. Tiradentes · Vila de Abrantes", insta: "Facebook Farmácia da Praça Abrantes", wa: "5571986253708", waNote: "botão do Facebook · confirmar na porta", ajuda: "SEO", ajudaLinha: "Sem site próprio achado. Tem página e WhatsApp no Facebook. Ajuda: horário e delivery certos no Google — urgência não espera site. Casa curta só se a ficha estiver vazia.", recado: "Oi. Passei na Farmácia da Praça, em Abrantes. Vi um ponto simples: quem precisa de noite pesquisa no celular. Posso te mostrar em 40 segundos, sem trocar o que já funciona?", gap: "Delivery na região. O Google da farmácia precisa dizer horário e se entrega.", build: ["google", "seo", "whats"], next: "Manhã, fora da fila. Olhar a busca ‘farmácia Abrantes’ na frente do balcão." },
  { id: "ab-centralfarma", zona: "abrantes", name: "Central Farma Abrantes", cat: "farmacia", where: "Av. Tiradentes, 15-D", tel: "7130830008", ajuda: "Site", ajudaLinha: "Tem Facebook e e-mail. O público é fixo, não WhatsApp. Sem site achado. Ajuda: uma casa no celular com horário e botão. Pedir o Zap na porta.", gap: "Segunda farmácia da mesma avenida. Não repetir a conversa da Praça.", build: ["site", "google", "whats"], next: "Confirmar que é outra porta, não a da Praça. 60 segundos com o farmacêutico." },
  { id: "ab-alphafarma", zona: "abrantes", name: "Alphafarma Litoral", cat: "farmacia", where: "BA-099 · dentro do NovoMix", cel: "71996477629", ajuda: "SEO", ajudaLinha: "Já tem site (alphafarmalitoral.com) e pede pra ligar: (71) 99647-7629 e (71) 99999-7704. Nenhum está marcado como WhatsApp — confirmar qual é o Zap. Ajuda: ser a primeira em ‘farmácia Abrantes / Estrada do Coco’. Não construir outro site.", gap: "Rede do litoral norte, dentro do mercado. A busca local ainda pode cair em outra farmácia.", build: ["seo", "google"], next: "Falar com o gerente do balcão, não com o caixa do NovoMix." },
  { id: "ab-paladar", zona: "abrantes", name: "Paladar do Pão", cat: "padaria", where: "Av. Tiradentes, 12 · perto do Rilse", cel: "71996564296", ajuda: "SEO", ajudaLinha: "Encomenda, sem site achado. O guia traz (71) 99656-4296 e a matéria do Portal escreveu outro dígito (99656-4696). Confirmar na porta. Não tratei como WhatsApp. Ajuda: ser achada de manhã no Google e botão de encomenda.", gap: "Pão cedo e encomenda pra orla. O sofá de Abrantes precisa achar a fornada.", build: ["google", "seo", "whats"], next: "Depois das 9h. Olhar ‘padaria Abrantes’ no celular, juntos. Pedir o Zap certo." },
  { id: "ab-recanto", zona: "abrantes", name: "Recanto da Pizza", cat: "restaurante", where: "Vila de Abrantes · rua não publicada", insta: "@recantodapizza.oficial · confirmar se ainda é esta casa", cel: "71982753147", ajuda: "SEO", ajudaLinha: "Matéria de 2024: Instagram e delivery no (71) 98275-3147. Não está marcado como WhatsApp. Existe outra Recanto da Pizza em Divinópolis — não misturar. Ajuda: Google com endereço, horário e ‘pizza Abrantes’. Site só se quiserem casa além do Instagram.", gap: "Casa nova na época. Jantar se decide no celular.", build: ["google", "seo", "whats"], next: "Fim de tarde, antes do forno. Confirmar a rua e se o número ainda é o deles." },
  { id: "ab-reserva", zona: "abrantes", name: "Reserva Pizzaria", cat: "restaurante", where: "Canaã Business Center · R. Col. Boa União, 7", ajuda: "Conteúdo", ajudaLinha: "Forno a lenha, entrega, centenas de avaliações. Telefone não achei. Pedir o WhatsApp na porta. Se o Google já acha, a ajuda é conteúdo do forno e um botão de pedido — não um site novo.", gap: "A busca ‘pizza Abrantes’ pode cair aqui. O pedido ainda precisa de um caminho só.", build: ["posts", "whats"], next: "A partir das 17h30, antes de lotar. Não oferecer obra." },
  { id: "ab-olympus", zona: "abrantes", name: "Academia Olympus", cat: "academia", where: "Av. Antônio Elias Duarte, 102 · Fonte da Caixa", cel: "71999509975", ajuda: "Academy", ajudaLinha: "Já está no Wellhub, 300 m da Praça. O celular saiu do cadastro, não de um botão de WhatsApp — confirmar. Ajuda: comunidade de aluno no molde da Fluir Academy (akashahub.com.br/academy). Conteúdo de horário morto. Convergência só depois, não na primeira frase.", gap: "Musculação, funcional, zumba. Matrícula ainda pede balcão.", build: ["posts", "id"], next: "Recepção, entre aulas. Não oferecer site de rede." },
  { id: "ab-planeta", zona: "abrantes", name: "Planeta Fitness", cat: "academia", where: "Av. Tiradentes · número da porta não publicado", insta: "Facebook academiaplanetafitness", cel: "71999177977", ajuda: "Site", ajudaLinha: "Tem Facebook e celular de guia. Akademias marca zero WhatsApp — confirmar na porta. Sem site achado. Ajuda: página curta de horário e matrícula. Se a grade já enche, vira comunidade no molde da Academy. Há uma ficha Wellhub ‘Fitness’ na Tiradentes 460 — confirmar se é a mesma porta.", gap: "Achar a fachada primeiro. Sem número da porta no guia.", build: ["site", "google", "whats"], next: "Caminhar a Tiradentes até a placa. Não ligar antes de ver a casa." },
  { id: "ab-hercules", zona: "abrantes", name: "Hércules Academia", cat: "academia", where: "Vieira de Melo, 16", cel: "71997335267", ajuda: "Site", ajudaLinha: "Guia não reivindicado, sem site achado. Celular (71) 99733-5267 — não é WhatsApp confirmado. Não usar outro número de academia da cidade. Ajuda: site curto com horário e matrícula. Se o Google já achar, vira conteúdo de turma.", gap: "Academia de rua. Turma e horário no celular.", build: ["site", "google", "whats"], next: "Entre um treino e outro. Pedir quem decide." },
  { id: "ab-outlet", zona: "abrantes", name: "Academia Outlet Abrantes", cat: "academia", where: "BA-099 · Estrada do Coco", ajuda: "Academy", ajudaLinha: "Cross na Estrada do Coco. Telefone não achei — pedir na porta. Se não tem casa no celular, a ajuda é site com horário. Se já aparece no Google, comunidade de turma no molde da Academy. Não confundir com a Alphafarma do NovoMix.", gap: "Unidade na rodovia. Quem passa de carro pesquisa antes de parar.", build: ["site", "google", "posts"], next: "Parar na placa. Anotar o Zap da recepção." },
  { id: "ab-jl", zona: "abrantes", name: "JL Marmita Express", cat: "restaurante", where: "Fonte da Caixa · rua Quinta do Campo", cel: "71997327920", insta: "iFood · JL Marmita Express", ajuda: "Site", ajudaLinha: "Já vende no iFood. O (71) 99732-7920 está na página, sem botão de WhatsApp confirmado. Ajuda: casa própria — cardápio e botão — pra não ficar só no app. SEO de ‘marmita Abrantes’ junto.", gap: "Marmita de bairro. O app fica com o cliente.", build: ["site", "whats", "google"], next: "Fora do pico do almoço. Mostrar um cardápio no nome deles, não o iFood." },
  { id: "ab-cabana", zona: "abrantes", name: "Cabana do Swell", cat: "restaurante", where: "R. do Piruí, 109 · praia de Abrantes", tel: "7136243732", ajuda: "Conteúdo", ajudaLinha: "Barraca de praia com avaliação no Google. O público é fixo (71) 3624-3732, não WhatsApp. Ajuda: prato da casa (pititinga, caranguejo) e collab com a orla. Pedir o Zap. Não um site de praia do zero se a ficha já fecha.", gap: "Quem já vai, vai. Quem pesquisa praia de Abrantes precisa ver o prato.", build: ["posts"], next: "Manhã de semana. Falar com quem está na caixa, não no rush do almoço." },
  { id: "ab-maraberto", zona: "abrantes", name: "Mar Aberto", cat: "restaurante", where: "R. Direta de Arembepe, 44 · divisa Abrantes", cel: "71991344410", ajuda: "Conteúdo", ajudaLinha: "Já tem site (marabertorestaurante.com.br). Celular público, não marcado como WhatsApp. A casa é Arembepe, na divisa — rota de orla, não a Tiradentes. Ajuda: conteúdo da moqueca e collab Abrantes × Arembepe. Não reconstruir o site.", gap: "Turista acha pelo nome. A camada é movimento, não obra.", build: ["posts"], next: "Antes das 14h. Honrar o site. Pedir o Zap se o celular não for." },
  { id: "ab-seabras", zona: "abrantes", name: "Seabras Bar e Restaurante", cat: "bar", where: "R. Direta de Arembepe · Abrantes", cel: "71987231334", ajuda: "SEO", ajudaLinha: "Guia cita entrega e o celular (71) 98723-1334. Sem site achado, sem WhatsApp confirmado. Ajuda: Google com horário e ‘aberto agora’. Site curto só se a ficha estiver vazia. Mesma rua do Mar Aberto — não misturar as duas conversas.", gap: "Bar da divisa. Noite se decide no celular.", build: ["google", "seo", "whats"], next: "Fim de tarde. Confirmar se o número ainda atende." },
  { id: "ab-acougue", zona: "abrantes", name: "Açougue Litoral", cat: "acougue", where: "R. da Mangueira, 94", ajuda: "Site", ajudaLinha: "Fachada no guia, telefone não achei. Pedir o WhatsApp na porta. Sem casa no celular: site curto com foto da vitrine e pedido. Se o Google já acha, vira botão, não obra.", gap: "Carne de bairro. Pedido de quem não saiu de casa.", build: ["site", "whats", "posts"], next: "Final da manhã, antes do almoço. Anotar o nome da placa." },
  { id: "ab-oliveiras", zona: "abrantes", name: "Oliveira's Delicatessen", cat: "padaria", where: "Estrada do Coco · Vila de Abrantes", tel: "7131253443", ajuda: "Site", ajudaLinha: "Guia antigo: fixo (71) 3125-3443 e um site (oliveirasdelicatessen.com.br). Confirmar se a porta ainda abre. Se o site morreu, a ajuda é site. Se vive e some no Google, vira SEO. Não é WhatsApp.", gap: "Pode ser casa antiga. Não insistir se a placa não estiver mais lá.", build: ["site", "google"], next: "Passar na Estrada do Coco. Se fechou, risca e segue." }
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
      "Segunda rota: Vila de Abrantes, Camaçari. Tiradentes, Fonte da Caixa, Estrada do Coco, divisa com Arembepe.",
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
      { name: "Corpo", body: "Academia, clínica, laboratório, pet." },
      { name: "Abrantes", body: "Outra rua. Farmácia, padaria, academia, pizza e a orla da divisa. Mesma escada." }
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
