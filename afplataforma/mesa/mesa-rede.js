/* Mesa Redes · a casa da Academy em outra empresa. Não é a call da Flui. */
const PACK_REDE = {
  id: "rede",
  hidePit: true,
  hideMoney: true,
  hideClose: true,
  hero: {
    kicker: "Academy · outra empresa · não é a Flui",
    title: "Quem abre a agenda",
    lede: "Primeiro a pessoa que marca. O dono entra na call seguinte. Não pergunta se faz sentido. Não fala preço nesta mesa."
  },
  person: {
    name: "Redes · Academy",
    role: "A mesma casa. Outra empresa.",
    facts: [
      "O produto é o da Flui: a casa do que a empresa já ensina. Unidade, colaborador, professor, aluno, dono.",
      "Rede grande: você não fala com o CEO no WhatsApp do aluno.",
      "Casa de bairro: o Zap da recepção pode ser quem decide. Aí a call é direta.",
      "Lifestyle já está no Matinê. Não é frio. Smart ainda não tem porta de venda."
    ],
    posture: [
      "Uma cena. Uma casa. Trinta minutos na tela.",
      "Não pedir emprego.",
      "Não abrir com Convergência, Hotmart ou app.",
      "Não ler número."
    ]
  },
  neverGlobal: [
    "Não usar o WhatsApp de aluno da Smart Fit.",
    "Não mandar proposta para imprensa nem para o RI.",
    "Não perguntar se faz sentido.",
    "Não copiar o valor da Flui para uma casinha.",
    "Não prometer dez anos nem todas as unidades em dezembro."
  ],
  acts: [
    { id: "agenda", n: 1, label: "Quem agenda", minutes: "0–5 min", intent: "Descobrir se essa pessoa decide ou só marca.",
      script: [
        "Eu vou ser direto. Não vim vender um aplicativo.",
        "A empresa de vocês já ensina. Isso se perde quando a pessoa sai ou quando o aluno não foi.",
        "Eu construo a casa disso. Quero mostrar na tela, trinta minutos.",
        "Você decide, ou você marca com quem decide?"
      ],
      questions: ["Quem cuida do treinamento da rede, ou desta casa?"],
      never: ["Não explicar a casa inteira no WhatsApp.", "Não falar preço."],
      nextIfCold: "Repetir: você decide ou você marca? E calar." },
    { id: "diag", n: 2, label: "Diagnóstico", minutes: "com quem decide", intent: "Ele nomeia a perda. Você receita.",
      script: [
        "Quando entra gente nova, o padrão ainda depende de uma pessoa explicar de novo.",
        "Quando o professor dá a aula e o aluno não foi, o dia acaba e o conteúdo acaba.",
        "Isso aqui resolve. A casa guarda. Quem não foi assiste depois. A rede vê a mesma versão."
      ],
      questions: ["Onde isso dói mais: gente nova, aula que não fica, ou unidade que não recebe o padrão?"],
      never: ["Não perguntar se faz sentido.", "Não abrir a tela da Flui."],
      nextIfCold: "Ficar na perda que ele acabou de falar." },
    { id: "casa", n: 3, label: "A casa", minutes: "na tela", intent: "Cinco portas, no nome deles. Sem preço.",
      script: [
        "Vou te mostrar a casa. É isso aqui.",
        "Cinco portas. Unidade, colaborador, professor, aluno, dono.",
        "Acontece uma vez. Fica. Quem não foi assiste depois. Cada um vê só o dele.",
        "O conteúdo é de vocês."
      ],
      questions: [],
      never: ["Não mostrar a mesa.", "Não falar a palavra Flui como se fosse o cliente deles.", "Não falar número com a tela aberta."],
      nextIfCold: "Apontar uma porta, a que ele citou. Parar." },
    { id: "fecha", n: 4, label: "Próximo passo", minutes: "de volta no notebook", intent: "Ou marca o dono, ou ele diz o valor. Não os dois misturados.",
      script: [
        "Se você marca: qual dia o dono entra com a gente? A gente espera.",
        "Se você decide: qual valor você tem disponível agora para a gente começar?",
        "Pode ser o total ou um sinal. A condição fica escrita antes de pagar."
      ],
      questions: [],
      never: ["Não perguntar se faz sentido.", "Não preencher o silêncio."],
      nextIfCold: "Repetir só a pergunta que cabe: a data, ou o valor. Uma. Calar." }
  ]
};

const REDE_ALVOS = [
  {
    id: "smart",
    tier: "Rede",
    name: "Smart Fit",
    where: "Rede nacional · não é uma unidade",
    quem: "Quem agenda o treinamento da rede. Não é o CEO. Não é o atendente do aluno.",
    porta: "Ainda não achei porta de venda. O que existe publicado é atendimento e imprensa.",
    nao: "Não ligar no WhatsApp de assuntos gerais (11) 99807-9600. Isso é aluno. Não mandar proposta para imprensa@smartfit.com.br. Isso é jornalista. Não mandar para ri@smartfit.com. Isso é investidor.",
    ajuda: "Academy, se um dia a porta for a de treinamento.",
    fala: "",
    next: "Não mandar mensagem hoje. A porta ainda não é essa."
  },
  {
    id: "lifestyle",
    tier: "Casa",
    name: "Studio Life Style · a Casinha",
    where: "R. Itamaraju, 214 · Pitangueiras, Lauro de Freitas",
    quem: "Quem responde o WhatsApp da Casinha. Casa pequena: pode ser quem decide.",
    porta: "WhatsApp no site. Instagram @studiolifestyle.com.br. Site studiolifestyle.com.br.",
    wa: "5571986269085",
    relacao: "Não é frio. O Matinê já treina na Casinha e desce no Se Plante.",
    ajuda: "A casa do que a Lifestyle já ensina. Professor, aluno, colaborador. Sem vender outro app.",
    fala: "Fala. Aqui é o Yan. A Casinha já é o treino do Matinê. Quero te mostrar uma coisa na tela, 30 minutos: a casa do que a Lifestyle já ensina, pra não morrer na cabeça de um professor. Não cabe em áudio. Qual dia essa semana?",
    next: "Mandar o texto. Não mandar o link da Academy. A casa se mostra na call."
  },
  {
    id: "vilasfit",
    tier: "Casa",
    name: "Vilas Fitness",
    where: "Alameda Praia de Ondina, 50 · Vilas do Atlântico",
    quem: "adm@vilasfitness.com.br é a administração. Pede quem decide o treinamento. Não tratei como dono.",
    porta: "Tem site academiavilasfitness.com. E-mail publicado. WhatsApp não está no bloco de contato que eu li.",
    email: "adm@vilasfitness.com.br",
    ajuda: "Já tem site. A ajuda é a casa da aula e da comunidade, não outro site.",
    fala: "Assunto: treinamento da Vilas Fitness\n\nOi. Aqui é o Yan, de Vilas. Vi a casa de vocês no ar. Quero falar com quem decide o treinamento, não com o comercial de matrícula. É uma coisa de 30 minutos na tela: a aula que já existe parar de ficar só na cabeça do professor. Pode me dizer com quem eu marco?",
    next: "E-mail curto. Se responder o comercial, pedir o nome de quem cuida da aula."
  },
  {
    id: "aktkd",
    tier: "Bairro",
    name: "AKTKD · artes marciais",
    where: "Vilas do Atlântico",
    quem: "Quem marca a aula experimental. Pode ser o professor dono.",
    porta: "WhatsApp publicado no Facebook da casa.",
    wa: "5571993027458",
    ajuda: "Turma de criança e adulto. A aula experimental já é no Zap. A casa guarda a faixa e quem faltou.",
    fala: "Oi. Aqui é o Yan, de Vilas. Vi o WhatsApp da AKTKD. A aula experimental já marca por aqui. Queria te mostrar, em 30 minutos na tela, a casa do que a academia já ensina. Aluno novo e quem falta. Qual dia?",
    next: "Mensagem curta. Se for a recepção, pedir quem dá a direção da casa."
  },
  {
    id: "skyfit",
    tier: "Unidade de rede",
    name: "Skyfit · Lauro de Freitas",
    where: "Av. Luiz Tarquínio Pontes, 1220 · Pitangueiras",
    quem: "E-mail da unidade. O balcão não compra a casa da rede. Pede o gerente, e quem na rede cuida de treinamento.",
    porta: "Ficha pública da unidade: laurodefreitas@skyfitacademia.com.br e (71) 98189-3981. A palavra WhatsApp não está nessa ficha.",
    email: "laurodefreitas@skyfitacademia.com.br",
    tel: "71981893981",
    ajuda: "Unidade de rede. Não vender o site da Skyfit. Perguntar quem padroniza a aula.",
    fala: "Assunto: gerente da unidade Lauro de Freitas\n\nOi. Aqui é o Yan. Quero falar com o gerente desta unidade, não fazer matrícula. É sobre o treinamento que a rede repete em toda casa nova. Pode me passar quem agenda isso?",
    next: "Não ligar como se o número fosse Zap. E-mail primeiro. Uma frase."
  }
];

if (typeof DEALS !== "undefined") {
  DEALS.push({
    id: "rede",
    name: "Redes",
    person: "Academy · outras casas",
    range: "agenda antes do dono",
    status: "ativa",
    blurb: "A mesma casa da Flui, em outra empresa. Lifestyle é a Casinha. Smart ainda não tem porta.",
    tags: ["Academy", "Agenda", "Casa"]
  });
}

function redeTel(d) {
  let n = String(d || "").replace(/\D/g, "");
  if (!n) return "";
  if (!n.startsWith("55")) n = "55" + n;
  if (n.length < 12) return "";
  return "tel:+" + n;
}
function redeWa(n) {
  let d = String(n || "").replace(/\D/g, "");
  if (!d.startsWith("55")) d = "55" + d;
  return "https://wa.me/" + d;
}

function renderRede() {
  const cards = REDE_ALVOS.map((a) => {
    const tel = a.wa ? redeTel(a.wa) : "";
    const wa = a.wa && a.fala ? redeWa(a.wa) + "?text=" + encodeURIComponent(a.fala) : "";
    return `<article class="panel">
      <p class="kicker">${esc(a.tier)}</p>
      <h2>${esc(a.name)}</h2>
      <p class="muted">${esc(a.where)}</p>
      <p><strong>Quem abre.</strong> ${esc(a.quem)}</p>
      <p>${esc(a.porta)}</p>
      ${a.relacao ? `<p>${esc(a.relacao)}</p>` : ""}
      <p><strong>A casa.</strong> ${esc(a.ajuda)}</p>
      ${a.nao ? `<p class="flag danger">${esc(a.nao)}</p>` : ""}
      ${a.fala ? `<p class="lbl">Primeira mensagem</p><button type="button" class="line" data-copy="${esc(a.fala)}"><span>${esc(a.fala)}</span></button>` : ""}
      <p class="hint">${esc(a.next)}</p>
      <div class="row" style="margin-top:10px">
        ${wa ? `<a class="btn btn-primary" href="${esc(wa)}" target="_blank" rel="noopener">Abrir WhatsApp</a>` : ""}
        ${tel ? `<a class="btn btn-outline" href="${esc(tel)}">Ligar</a>` : ""}
        ${a.email ? `<button type="button" class="btn btn-outline" data-copy="${esc(a.email)}">Copiar e-mail</button>` : ""}
      </div>
    </article>`;
  }).join("");
  return `<div class="hero">
      <div>
        <p class="kicker">Mesa · Redes</p>
        <h1>A casa, em outra empresa.</h1>
        <p class="lede">Mesma coisa da Flui. Outro dono. Primeiro quem marca a call. O número de aluno não é porta. O roteiro da conversa está no ato, quando o deal Redes estiver selecionado.</p>
      </div>
    </div>
    <div class="stack">${cards}</div>`;
}
