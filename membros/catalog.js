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
  area: { anubis: 4700, horus: 9700, isis: 14700, amon: 19700 },
  curso: 2700,
  livro: 1700,
  audio: 700
};

window.AKASHA_ITENS = {
  anubis: {
    cursos: ["alinhamento", "7-dias", "casais", "tantra", "fascinacao"],
    livros: ["O Código Secreto do Universo", "Código Quântico", "Revelações Quânticas"],
    audios: ["Mente Crística", "Pai Nosso", "Avê Maria", "Cura das Feridas Invisíveis", "O Código Secreto do Universo"]
  },
  horus: {
    cursos: ["senda", "prosperidade", "despertar"],
    livros: ["Código de Conduta", "O Que é Tantra?", "Shiva, Shakti e Shava", "Honrar a Deusa", "Tantra Descomplicado"],
    audios: []
  },
  isis: {
    cursos: ["paladins", "jornada"],
    livros: ["Autoestima Blindada", "Como Blindar Sua Mente?", "Triplex na Mente"],
    audios: []
  },
  amon: {
    cursos: ["zero"],
    livros: ["Coletânea Alinhamento Financeiro", "Códigos de Origem"],
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
  var valor = window.AKASHA_PRECO[kind];
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
  return { ref: kind + ":" + area + ":" + item, nome: titulo, cents: valor, label: window.akashaReais(valor) };
};

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
