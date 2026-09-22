const SHOP = {
  name: "Se Plante",
  full: "Se Plante Dispensário",
  bio: "Cultura · Informação · Redução de danos",
  line: "Loja da Cabeça",
  where: "Vilas do Atlântico · Lauro de Freitas · BA",
  ig: "seplantedispensarioofc",
  wa: "557197210220",
  hours: "Horário na porta. Confirma no WhatsApp antes de cruzar a orla.",
  note: "O balcão confirma o que tem hoje. O pedido cai no WhatsApp da casa."
};

const CATS = [
  { id: "all", t: "Tudo" },
  { id: "cafe", t: "Café" },
  { id: "tabacaria", t: "Tabacaria" },
  { id: "dispensario", t: "Dispensário" },
  { id: "adega", t: "Adega" },
  { id: "fit", t: "FIT" }
];

const PRODUCTS = [
  { id: "espresso", cat: "cafe", name: "Espresso", kid: "Curto, crema, sem enrolação.", price: 8, img: "img/produtos/espresso.jpg" },
  { id: "cappuccino", cat: "cafe", name: "Cappuccino", kid: "Copo largo. A casa acordando.", price: 12, img: "img/produtos/cappuccino.jpg" },
  { id: "gelado", cat: "cafe", name: "Café gelado", kid: "Suor de Vilas. Copo frio.", price: 14, img: "img/produtos/gelado.jpg" },
  { id: "suco", cat: "cafe", name: "Suco da casa", kid: "Fruta da estação. Sem nome de laboratório.", price: 12, img: "img/produtos/shake-verde.jpg" },
  { id: "shake", cat: "cafe", name: "Shake verde", kid: "Hortelã, gelo, senta.", price: 18, img: "img/produtos/shake-verde.jpg" },

  { id: "cachimbo", cat: "tabacaria", name: "Cachimbo clássico", kid: "Madeira. O ofício que a casa já conhece.", price: 180, img: "img/produtos/cachimbo.jpg" },
  { id: "tabaco", cat: "tabacaria", name: "Tabaco para cachimbo", kid: "Pergunta no balcão o blend do dia.", price: 42, img: "img/produtos/cachimbo.jpg" },
  { id: "dichava", cat: "tabacaria", name: "Dichavador de madeira", kid: "Quatro peças. Cabe no bolso.", price: 65, img: "img/produtos/dichava.jpg" },
  { id: "seda", cat: "tabacaria", name: "Seda e piteira", kid: "O básico que não pode faltar.", price: 8, img: "img/produtos/seda.jpg" },
  { id: "piteira", cat: "tabacaria", name: "Piteira de vidro", kid: "Soprada. Reutiliza.", price: 35, img: "img/produtos/piteira.jpg" },

  { id: "cha", cat: "dispensario", name: "Chá da casa", kid: "Infusão. Pede o blend do dia.", price: 14, img: "img/produtos/cha.jpg" },
  { id: "ervas", cat: "dispensario", name: "Ervas a granel", kid: "O que a lei permite. O balcão explica.", price: 28, img: "img/produtos/ervas.jpg" },
  { id: "calma", cat: "dispensario", name: "Blend calma", kid: "Camomila, erva-doce, hortelã.", price: 32, img: "img/produtos/ervas.jpg" },
  { id: "incenso", cat: "dispensario", name: "Incenso da casa", kid: "A loja também cheira a casa.", price: 18, img: "img/produtos/cha.jpg" },

  { id: "tinto", cat: "adega", name: "Tinto da casa", kid: "Copo. Confirma o rótulo no balcão.", price: 22, img: "img/produtos/vinho.jpg" },
  { id: "branco", cat: "adega", name: "Branco gelado", kid: "Fim de tarde. Orla ainda clara.", price: 22, img: "img/produtos/branco.jpg" },
  { id: "garrafa", cat: "adega", name: "Garrafa para levar", kid: "O que estiver aberto na adega.", price: 68, img: "img/produtos/vinho.jpg" },

  { id: "fitshake", cat: "fit", name: "Shake FIT", kid: "Proteína, gelo, sem drama de academia.", price: 22, img: "img/produtos/fit-shake.jpg" },
  { id: "nuts", cat: "fit", name: "Mix de nuts", kid: "Castanha, cacau, fruta seca.", price: 16, img: "img/produtos/nuts.jpg" },
  { id: "kombucha", cat: "fit", name: "Kombucha", kid: "Frio. Lima. Sem refrigerante.", price: 14, img: "img/produtos/kombucha.jpg" },
  { id: "agua", cat: "fit", name: "Água com gás", kid: "O básico que o treino pede.", price: 6, img: "img/produtos/kombucha.jpg" }
];
