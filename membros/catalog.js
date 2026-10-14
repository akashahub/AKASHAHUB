window.AKASHA_AREAS = [
  {
    id: "anubis",
    name: "Anúbis",
    tag: "Faixa azul",
    img: "https://res.cloudinary.com/dcbarseus/image/upload/v1780452806/IMG-20260415-WA0001_dkra3y.jpg",
    courses: [
      ["alinhamento-akasha", "Código de Alinhamento Akasha"],
      ["desafio-7-dias", "Desafio 7 Dias de Magnetismo"],
      ["ritual-casais", "Ritual para Casais: Intimidade"],
      ["tantra-nao-e-sexo", "Tantra é Diferente de Sexo"],
      ["poder-fascinacao", "O Poder da Fascinação"]
    ],
    books: ["O Código Secreto do Universo", "Código Quântico", "Revelações Quânticas"],
    audios: ["Pack de frequências"]
  },
  {
    id: "horus",
    name: "Hórus",
    tag: "Faixa roxa",
    img: "https://res.cloudinary.com/dcbarseus/image/upload/v1780452806/IMG-20260415-WA0002_udbfpg.jpg",
    courses: [
      ["senda-tantrica", "A Senda Tântrica"],
      ["tantra-prosperidade", "Tantra Quântico e Prosperidade"],
      ["despertar-magnetismo", "Despertar do Magnetismo"]
    ],
    books: ["Código de Conduta", "O Que é Tantra?", "Shiva, Shakti e Shava", "Honrar a Deusa", "Tantra Descomplicado"],
    audios: []
  },
  {
    id: "isis",
    name: "Ísis",
    tag: "Faixa marrom",
    img: "https://res.cloudinary.com/dcbarseus/image/upload/v1780452806/IMG-20260415-WA0003_ueh0c4.jpg",
    courses: [
      ["paladins", "Paladins: A Liderança dos Bons"],
      ["jornada-transformacao", "Jornada de Transformação"]
    ],
    books: ["Autoestima Blindada", "Como Blindar Sua Mente?", "Triplex na Mente"],
    audios: []
  },
  {
    id: "amon",
    name: "Amon-Rá",
    tag: "Faixa preta",
    img: "https://res.cloudinary.com/dcbarseus/image/upload/v1780452806/IMG-20260415-WA0004_xn5dod.jpg",
    courses: [
      ["zero-ao-zen", "Do Zero ao Zen e Negócios"]
    ],
    books: ["Coletânea Alinhamento Financeiro", "Códigos de Origem"],
    audios: []
  }
];

window.AKASHA_PRECO = {
  area: { anubis: 17717, horus: 33870, isis: 269398, amon: 537755 },
  curso: {
    "anubis:alinhamento":18900,"anubis:7-dias":18000,
    "horus:techub":6300,"horus:arte-da-analogia":7200,"horus:senda":77700,"horus:despertar":30000,"horus:prosperidade":77700,
    "isis:paladins":250000,"isis:jornada":60000,"amon:zero":516300
  },
  livro: {
    "anubis:Código Secreto do Universo":2500,"anubis:O Código Secreto do Universo":2500,"anubis:Código Quântico":4700,"anubis:Revelações Quânticas":1500,"anubis:O Fim das Trevas":1800,
    "horus:Código de Conduta dos que Despertam":4200,"horus:Código de Conduta":4200,"horus:O Que é Tantra?":2500,"horus:Shiva, Shakti e Shava":2500,"horus:Honrar a Deusa":4200,"horus:Tantra Descomplicado":2500,"horus:Mini Curso de Energia Sexual":2500,"horus:A Arte da Conquista · Livro de Vendas":3000,
    "isis:Paladin":18700,"isis:Paladins":18700,"isis:Tecnologia da Alma":8700,"isis:Autoestima Blindada":4300,"isis:Kemet":3990,"isis:Triplex na Mente":3990,"isis:Como Blindar Sua Mente?":4300,
    "amon:Coletânea Alinhamento Financeiro":9900,"amon:Toth, Hermes e Enoque":1800,"amon:Do Zero ao Zen Negócios":9900,"amon:Códigos de Origem":9000
  },
  audio: 700
};

window.AKASHA_ITENS = {
  anubis: {
    cursos: ["alinhamento", "7-dias", "casais", "tantra", "fascinacao"],
    livros: ["Código Secreto do Universo", "O Código Secreto do Universo", "Código Quântico", "Revelações Quânticas", "O Fim das Trevas"],
    audios: ["Mente Crística", "Pai Nosso", "Avê Maria", "Cura das Feridas Invisíveis", "O Código Secreto do Universo"]
  },
  horus: {
    cursos: ["techub", "arte-da-analogia", "senda", "prosperidade", "despertar"],
    livros: ["Código de Conduta dos que Despertam", "Código de Conduta", "O Que é Tantra?", "Shiva, Shakti e Shava", "Honrar a Deusa", "Tantra Descomplicado", "Mini Curso de Energia Sexual", "A Arte da Conquista · Livro de Vendas"],
    audios: []
  },
  isis: {
    cursos: ["paladins", "jornada"],
    livros: ["Paladin", "Paladins", "Tecnologia da Alma", "Autoestima Blindada", "Kemet", "Triplex na Mente", "Como Blindar Sua Mente?"],
    audios: []
  },
  amon: {
    cursos: ["zero"],
    livros: ["Coletânea Alinhamento Financeiro", "Toth, Hermes e Enoque", "Do Zero ao Zen Negócios", "Códigos de Origem"],
    audios: []
  }
};

window.akashaReais = function (cents) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

window.akashaOferta = function (ref) {
  var parts = String(ref || "").split(":");
  var kind = parts[0];
  var area = parts[1];
  var item = parts.slice(2).join(":");
  var faixa = window.akashaArea(area);
  if (!faixa) return null;
  if (kind === "area") {
    var cents = window.AKASHA_PRECO.area[area];
    return { ref: "area:" + area, nome: "Faixa " + faixa.name, cents: cents, label: window.akashaReais(cents) };
  }
  var lista = kind === "curso" ? window.AKASHA_ITENS[area].cursos : kind === "livro" ? window.AKASHA_ITENS[area].livros : kind === "audio" ? window.AKASHA_ITENS[area].audios : null;
  if (!lista || lista.indexOf(item) < 0) return null;
  var valor = kind === "curso" ? (window.AKASHA_PRECO.curso[area + ":" + item] || 0) : kind === "livro" ? (window.AKASHA_PRECO.livro[area + ":" + item] || 0) : window.AKASHA_PRECO.audio;
  var titulo = item;
  if (kind === "curso") {
    for (var i = 0; i < faixa.courses.length; i++) {
      if (faixa.courses[i][0] === item || window.AKASHA_ITENS[area].cursos.indexOf(item) >= 0) titulo = item;
    }
    var nomes = {
      alinhamento: "Código de Alinhamento",
      "7-dias": "Desafio 7 Dias de Magnetismo",
      casais: "Ritual para Casais",
      tantra: "Tantra Diferente de Sexo",
      fascinacao: "O Poder da Fascinação",
      senda: "A Senda Tântrica",
      prosperidade: "Tantra Quântico e Prosperidade",
      despertar: "Despertar do Magnetismo",
      paladins: "Paladins: A Liderança dos Bons",
      jornada: "Jornada de Transformação",
      zero: "Do Zero ao Zen e Negócios"
    };
    titulo = nomes[item] || item;
  }
  var capas = {"alinhamento":"/members/capas/codigo-de-alinhamento.jpg?v=ca5","7-dias":"/members/capas/sete-dias-magnetismo.jpg?v=m2","techub":"/members/capas/techub.jpg?v=t3","arte-da-analogia":"/members/capas/arte-da-analogia.jpg","senda":"/members/capas/senda-tantrica.jpg?v=s2","prosperidade":"/members/capas/tantra-prosperidade.jpg","despertar":"/members/capas/despertar-magnetismo.jpg","paladins":"/members/capas/paladins-curso.jpg?v=pc2","jornada":"/members/capas/jornada-transformacao.jpg?v=j1","zero":"/members/capas/zero-ao-zen.jpg?v=z2"};
  return { ref: kind + ":" + area + ":" + item, nome: titulo, cents: valor, label: window.akashaReais(valor), capa: kind === "curso" ? (capas[item] || "") : "" };
};

window.AKASHA_LINKS = {};

window.AKASHA_YAN = "yanfili.simon@gmail.com";

window.akashaArea = function (id) {
  return window.AKASHA_AREAS.find(function (area) { return area.id === id; }) || null;
};

window.akashaCourse = function (id) {
  for (var i = 0; i < window.AKASHA_AREAS.length; i++) {
    var area = window.AKASHA_AREAS[i];
    for (var j = 0; j < area.courses.length; j++) {
      if (area.courses[j][0] === id) return { area: area, id: id, title: area.courses[j][1] };
    }
  }
  return null;
};

window.akashaRead = function () {
  try { return JSON.parse(localStorage.getItem("akashaMembros") || "{}"); } catch (e) { return {}; }
};

window.akashaGrant = function (email, areaId) {
  var data = window.akashaRead();
  data.email = (email || data.email || "").toLowerCase();
  data.areas = data.areas || [];
  if (areaId && data.areas.indexOf(areaId) < 0) data.areas.push(areaId);
  localStorage.setItem("akashaMembros", JSON.stringify(data));
  return data;
};

window.akashaOwns = function (areaId, email) {
  var mail = (email || "").toLowerCase();
  if (mail === window.AKASHA_YAN) return true;
  var data = window.akashaRead();
  if ((data.email || "") === window.AKASHA_YAN) return true;
  return (data.areas || []).indexOf(areaId) >= 0;
};
