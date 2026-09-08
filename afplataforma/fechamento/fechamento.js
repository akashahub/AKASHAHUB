const STEPS = [
  {
    id: "abertura",
    n: "01",
    t: "Abertura",
    obj: "Combinar tempo, objetivo e o jeito da conversa.",
    avancar: "A pessoa aceitou o formato e o tempo.",
    sair: "Não quer conversa agora. Encerrar educado.",
    speak: [
      "Obrigado por entrar. Vamos usar este tempo pra entender a tua situação, ver se o que eu faço cabe, e só então falar de caminho.",
      "Se não couber, eu te falo. Sem teatro.",
      "Quanto tempo você tem agora?"
    ],
    qs: ["Quanto tempo você tem?", "O que te fez aceitar esta conversa?", "Se esta call servir, o que você gostaria de sair sabendo?"],
    hint: "Interno: não apresente plano. Só alinhe. Fonte adaptada: diagnóstico antes da oferta (Ads Cast #132, descrição e trecho ~2:05)."
  },
  {
    id: "diagnostico",
    n: "02",
    t: "Diagnóstico",
    obj: "Entender agora, desejado, tentativas, prioridade e o custo de continuar igual.",
    avancar: "Você consegue repetir a situação com as palavras dela e ela confirma.",
    sair: "Não há problema real, ou ela só quer curiosidade.",
    speak: [
      "Me conta como está o dinheiro na prática hoje. O que entra, o que some, o que te tira o sono.",
      "O que você quer que esteja diferente daqui 8 a 16 semanas?",
      "O que você já tentou? O que funcionou um pouco e o que travou?",
      "Se nada mudar nos próximos 90 dias, o que acontece?"
    ],
    qs: [
      "Como está hoje, no concreto?",
      "Qual resultado você quer?",
      "O que já tentou?",
      "Isso é prioridade agora ou está no fundo da fila?",
      "Qual o custo de continuar assim?"
    ],
    hint: "Interno: desça camadas. Dor na superfície, depois o que ela ainda não nomeou. Verificado: diagnóstico em camadas e presença total (Ads Cast #132 ~41:00–54:00). Não use mapa de calor dele. Use perguntas e anote."
  },
  {
    id: "qualificacao",
    n: "03",
    t: "Qualificação",
    obj: "Ver perfil, execução, decisão e condição. Sem inventar renda mínima.",
    avancar: "Há problema real, ela pode executar, e quem decide está na conversa ou será chamado.",
    sair: "Sem autonomia, sem tempo de executar, ou pediu algo que você não entrega.",
    speak: [
      "Além de você, alguém entra nessa decisão?",
      "Nas próximas semanas, você consegue abrir um tempo real pra treinar, não só assistir?",
      "Se existir um caminho que faça sentido, você está em posição de decidir nesta conversa, ou precisa de outra pessoa?"
    ],
    qs: [
      "Quem decide?",
      "Consegue executar semana a semana?",
      "O que você busca é mentoria com aplicativo e call, ou só um conselho solto?",
      "Tem sessão de alinhamento feita? Pagou a sessão?"
    ],
    hint: "Interno: se sócio ou parceiro decide, não empurre proposta final. Marque call conjunta. Adaptação nossa a partir de 'preciso falar com sócio/esposa' (Ads Cast #132 ~19:00 e 22:00). Critério de dinheiro: campo editável, não chute de renda."
  },
  {
    id: "pit",
    n: "04",
    t: "Antes da proposta",
    obj: "Medir vontade de resolver e antecipar as saídas clássicas, sem tratar toda dúvida como mentira.",
    avancar: "Ela quer resolver e aceita olhar um caminho. Dúvidas podem existir.",
    sair: "Nota baixa de vontade, ou impedimento honesto (sem dinheiro nenhum, sem decisor, sem tempo).",
    speak: [
      "Numa escala de 0 a 10, o quanto você quer resolver isso agora?",
      "Por que essa nota, e não menor?",
      "Antes de eu te mostrar o caminho: tem alguém com quem você precise falar? Tem algum bloqueio de dinheiro ou de agenda que já está claro?"
    ],
    qs: ["Nota 0 a 10 de vontade?", "Por que avançar comigo, se avançar?", "O que te faria recuar depois de ouvir o número?"],
    hint: "Interno: isto é o Pit 01 adaptado. Verificado: antecipar objeção antes do preço e escala de vontade (Ads Cast #132 ~18:59–30:46 e ~52:32). NÃO usar a tese 'toda objeção é mentira' do ROI Hunters 358 como regra da AF. Aqui a gente investiga."
  },
  {
    id: "validacao",
    n: "05",
    t: "Espelho",
    obj: "Repetir o diagnóstico e pedir correção. Só então perguntar se quer ver solução.",
    avancar: "Ela confirma o espelho e pede pra ver o caminho.",
    sair: "Ela corrige tudo e o problema some. Ou não quer solução agora.",
    speak: [
      "Deixa eu devolver o que eu ouvi. Você me corrige.",
      "Se eu entendi certo: hoje está assim. Você quer aquilo. O que trava é isto. Continuar igual custa aquilo.",
      "Fechei ou errei alguma peça?",
      "Você quer que eu te mostre um caminho pra essa situação, ou prefere encerrar aqui?"
    ],
    qs: ["O resumo está certo?", "Quer ver um caminho agora?"],
    hint: "Interno: sem confirmação, não apresente plano. Adaptação nossa."
  },
  {
    id: "caminho",
    n: "06",
    t: "Dois caminhos",
    obj: "Sessão primeiro ou mentoria direta. Sessão não é obrigatória pra todo mundo.",
    avancar: "Ela escolheu um caminho. Você sabe se abate sessão.",
    sair: "Nem sessão nem mentoria. Encerrar.",
    speak: [
      "Tem dois jeitos. Um: sessão de 1h30, diagnóstico ao vivo, e só depois a gente vê se a mentoria cabe. Dois: se o que você já me contou está claro, a gente olha a mentoria agora.",
      "A sessão não é pedágio. É pra quem ainda precisa ver se o método cola na pele.",
      "Qual desses dois faz mais sentido pra você hoje?"
    ],
    qs: ["Sessão primeiro ou mentoria agora?", "Já pagou sessão? Quer abater se contratar?"],
    hint: "Interno: sessão R$ 350 é oferta pública. Mentoria: use os campos de preço. Abatimento só se configurado e pago de fato."
  },
  {
    id: "proposta",
    n: "07",
    t: "Proposta",
    obj: "Ligar entrega ao que ela falou. Escopo, tempo, investimento.",
    avancar: "Entendeu o que compra. Preço foi dito.",
    sair: "Não cabe. Ofereça sessão ou encerre.",
    speak: [
      "Pelo que você falou, o trabalho é este: ordem no dia a dia do dinheiro, no aplicativo, com condução.",
      "Sete etapas. Call. Você treina. Eu conduzo.",
      "Três tempos. Essencial, 8 semanas. Premium, 12. VIP, 16, mais perto.",
      "O número do plano que cabe pra você é este que está na ficha. Sem desconto de teatro."
    ],
    qs: ["Qual plano ela reconheceu?", "O preço foi entendido?", "Quer Pix, outro meio, ou tempo?"],
    hint: "Interno: conecte cada entrega a uma frase DELA. Verificado: vender resultado, não lista de recurso (ROI Hunters 358, fala de customizar). Preencha o preço antes de falar."
  },
  {
    id: "decisao",
    n: "08",
    t: "Decisão",
    obj: "Tirar dúvida depois do preço. Contratar com liberdade. Pix na call se ela decidir.",
    avancar: "Sim com pagamento, ou retorno marcado, ou não consciente.",
    sair: "Não. Agradeça. Não persiga.",
    speak: [
      "O que ficou em aberto depois do número?",
      "Se fizer sentido agora, eu te mando o Pix e a gente conclui aqui. Se quiser tempo, a gente marca o retorno. Você escolhe.",
      "Recusar é opção. Eu não seguro a call no constrangimento."
    ],
    qs: ["Aceite verbal ou pagamento?", "Pix enviado? Compensou?", "Retorno quando?"],
    hint: "Interno: verificado que ele privilegia pagamento na call (Ads Cast #132; ROI 358). Adaptação AF: facilitar Pix, preservar o não. Diferencie aceite verbal de Pix confirmado."
  },
  {
    id: "fim",
    n: "09",
    t: "Encerramento",
    obj: "Registrar resultado e próximo passo.",
    avancar: "Ficha salva.",
    sair: "—",
    speak: [
      "Combinado. Próximo passo é este que anotei.",
      "Obrigado pelo tempo."
    ],
    qs: ["Contratação, retorno, sessão, ou encerrado sem venda?"],
    hint: "Interno: salve a ficha. Aceite verbal ≠ pago."
  }
];

const DNA = [
  { tipo: "verificado", src: "Instagram @igormelloeu", txt: "Posiciona venda consultiva. Regra visível: em serviço caro, não esteja mais interessado que o cliente, sobretudo em mercado cético. Call descrita como 80/20. Reuniões viram negociação, não slide." },
  { tipo: "verificado", src: "Ads Cast #132 · youtube.com/watch?v=gtjOozD3NQw", txt: "Diagnóstico profundo antes de empurrar produto. Diagnóstico com presença, camadas, metáfora médica. Pit invertido / Pit 01 antecipa objeção antes do preço (sócio, dinheiro). Escala 0-10. Por que avançar com você. Pix. Meta citada de ~50% após lead aprovado. Título do episódio fala em 80% sem follow-up: tratar como título, não como sua taxa." },
  { tipo: "verificado", src: "ROI Hunters 358 · youtube.com/watch?v=UhHMv5AxBsI", txt: "Igor é convidado. Diagnóstico 40–60 min. Cita perfil Challenger (Gartner). Customiza. Pit 01 antes da solução. Pagamento na call. Evita follow-up. Falas controversas no episódio (objeção como fuga; framing do título). Transcript incompleto." },
  { tipo: "pendente", src: "Materiais futuros", txt: "Aulas, calls gravadas e anotações que você enviar. Esta base cresce. Não atribuir frase nova a ele sem fonte." },
  { tipo: "interpretacao", src: "Padrão observado nos dois episódios", txt: "Quem quer resolver decide na reunião. Follow-up vira exceção. Qualificação de dinheiro aparece no diagnóstico, não só no fim." },
  { tipo: "adaptacao", src: "Operação AF / Yan", txt: "Tom calmo. Não humilhar. Não tratar toda objeção como mentira. Sessão R$ 350 pode anteceder mentoria. Preços da mentoria ficam na ficha. Liberdade de recusar. Dois caminhos." },
  { tipo: "complementar", src: "Gartner Challenger Sale (origem, citada por ele)", txt: "Pesquisa de perfil de vendedor. Não é método AF. Não ensinar Challenger como se fosse seu." }
];

const OBJS = [
  {
    k: "caro",
    t: "Está caro",
    significados: ["Não tem o valor agora", "Não viu valor ainda", "Comparou com curso barato", "Pedido de desconto"],
    pergunta: "Caro comparado com o quê? E o que você consegue colocar hoje pra resolver isso?",
    caminhos: "Se não tem o valor: sessão ou encerrar. Se não viu valor: volte ao espelho. Se quer desconto: não invente. Repita o número da ficha."
  },
  {
    k: "pensar",
    t: "Vou pensar",
    significados: ["Precisa de tempo real", "Fuga", "Falta uma informação", "Outra pessoa decide"],
    pergunta: "O que exatamente você precisa pensar que a gente ainda não olhou aqui?",
    caminhos: "Se for informação: responde e volta. Se for decisor: marca conjunto. Se for tempo honesto: agenda retorno. Se for não: encerra."
  },
  {
    k: "alguem",
    t: "Preciso falar com alguém",
    significados: ["Decisor real", "Desculpa", "Quer validar medo"],
    pergunta: "Essa pessoa entra na decisão de verdade? Dá pra chamar agora ou marcar os três juntos?",
    caminhos: "Decisor real: não feche sozinho. Desculpa: volte à nota 0-10. Adaptação nossa. Não ataque o sócio."
  },
  {
    k: "tempo",
    t: "Não tenho tempo",
    significados: ["Agenda lotada de verdade", "Não é prioridade", "Medo de compromisso"],
    pergunta: "Se o método pede poucas horas por semana, isso cabe, ou a vida não abre agora?",
    caminhos: "Se não cabe: não venda. Sessão ou encerrar é mais honesto que VIP lotado."
  }
];

const KEY = "afFechamento";
const defOferta = () => ({
  sessao: "350",
  essencial: "",
  premium: "",
  vip: "",
  abater: false,
  abaterDias: "30",
  abaterValor: "350",
  pix: "",
  outro: "Cartão / combinado"
});

const state = {
  step: 0,
  notes: {},
  ready: {
    problema: "d", objetivo: "d", prioridade: "d", adequacao: "d",
    execucao: "d", investimento: "d", decisores: "d", duvidas: "d"
  },
  readyNote: {},
  obj: "",
  result: "em_andamento",
  person: "",
  oferta: defOferta(),
  log: [],
  tpSize: 28,
  tpSpeed: 0
};

function loadOferta() {
  try {
    const o = JSON.parse(localStorage.getItem(KEY + ":oferta") || "null");
    if (o) state.oferta = { ...defOferta(), ...o };
  } catch (e) {}
}
function saveOferta() {
  localStorage.setItem(KEY + ":oferta", JSON.stringify(state.oferta));
}

function el(id) { return document.getElementById(id); }

function renderMap() {
  el("map").innerHTML = STEPS.map((s, i) =>
    `<button type="button" class="${i === state.step ? "on" : ""} ${state.notes[s.id] ? "done" : ""}" data-go="${i}">
      <b>${s.n} ${s.t}</b><small>${s.obj}</small>
    </button>`
  ).join("");
}

function renderMain() {
  const s = STEPS[state.step];
  const speak = s.speak.map((t) => `<div class="speak">${t}</div>`).join("");
  const qs = s.qs.map((t) => `<div class="q">${t}</div>`).join("");
  el("main").innerHTML = `
    <p class="kicker">Etapa ${s.n} · ${s.t}</p>
    <h2>${s.obj}</h2>
    <p class="hint">${s.hint}</p>
    <p class="kicker">Falar</p>
    ${speak}
    <p class="kicker">Perguntar</p>
    ${qs}
    <p class="kicker">Avançar se</p>
    <p>${s.avancar}</p>
    <p class="kicker">Encerrar se</p>
    <p>${s.sair}</p>
    <label class="f">Anotação desta etapa
      <textarea id="note">${state.notes[s.id] || ""}</textarea>
    </label>
    <div class="row">
      <button class="btn" type="button" data-act="prev">Voltar</button>
      <button class="btn btn-a" type="button" data-act="next">Avançar</button>
      <button class="btn" type="button" data-act="tp">Teleprompt</button>
    </div>
  `;
  el("note").oninput = (e) => { state.notes[s.id] = e.target.value; };
}

function readyLabel(v) {
  return v === "c" ? "confirmado" : v === "n" ? "não se aplica" : "precisa aprofundar";
}

function renderSide() {
  const r = Object.entries(state.ready).map(([k, v]) => {
    const names = {
      problema: "Problema", objetivo: "Objetivo", prioridade: "Prioridade",
      adequacao: "Cabe a oferta", execucao: "Consegue executar",
      investimento: "Condição de investir", decisores: "Quem decide", duvidas: "Dúvidas abertas"
    };
    return `<div class="panel" style="margin-bottom:8px">
      <b>${names[k]}</b>
      <span class="${v}">${readyLabel(v)}</span>
      <div class="row">
        <button class="btn" data-ready="${k}" data-v="c">ok</button>
        <button class="btn" data-ready="${k}" data-v="d">aprofundar</button>
        <button class="btn" data-ready="${k}" data-v="n">n/a</button>
      </div>
      <input data-rn="${k}" placeholder="nota" value="${state.readyNote[k] || ""}">
    </div>`;
  }).join("");
  const o = state.oferta;
  el("side").innerHTML = `
    <p class="kicker">Pessoa</p>
    <input id="person" placeholder="Nome" value="${state.person}">
    <p class="kicker" style="margin-top:14px">Prontidão</p>
    <p class="hint">Não prevê compra. Apoia o teu julgamento.</p>
    ${r}
    <p class="kicker">Oferta (edite)</p>
    <label class="f">Sessão R$ <input id="os" value="${o.sessao}"></label>
    <label class="f">Essencial 8 sem. R$ <input id="oe" value="${o.essencial}" placeholder="preencher"></label>
    <label class="f">Premium 12 sem. R$ <input id="op" value="${o.premium}" placeholder="preencher"></label>
    <label class="f">VIP 16 sem. R$ <input id="ov" value="${o.vip}" placeholder="preencher"></label>
    <label class="f">Chave Pix <input id="ox" value="${o.pix}" placeholder="preencher"></label>
    <label class="f"><input type="checkbox" id="oa" ${o.abater ? "checked" : ""}> Abater sessão na mentoria</label>
    <label class="f">Prazo do abatimento (dias) <input id="od" value="${o.abaterDias}"></label>
    <label class="f">Valor a abater R$ <input id="oav" value="${o.abaterValor}"></label>
    <p class="kicker">Objeção na mesa</p>
    <select id="obj">${OBJS.map((x) => `<option value="${x.k}" ${state.obj === x.k ? "selected" : ""}>${x.t}</option>`).join("")}<option value="">Nenhuma agora</option></select>
    <div id="objBox"></div>
    <p class="kicker">Resultado</p>
    <select id="res">
      <option value="em_andamento">Em andamento</option>
      <option value="pago">Pagamento confirmado</option>
      <option value="verbal">Aceite verbal, Pix pendente</option>
      <option value="retorno">Retorno marcado</option>
      <option value="sessao">Caminho: sessão</option>
      <option value="nao">Encerrado sem venda</option>
    </select>
    <div class="row">
      <button class="btn btn-a" data-act="save">Salvar ficha</button>
      <button class="btn" data-act="pdf">Exportar</button>
    </div>
  `;
  el("person").oninput = (e) => { state.person = e.target.value; };
  el("res").value = state.result;
  el("res").onchange = (e) => { state.result = e.target.value; };
  ["os","oe","op","ov","ox","od","oav"].forEach((id) => {
    el(id).oninput = syncOferta;
  });
  el("oa").onchange = syncOferta;
  el("obj").onchange = (e) => { state.obj = e.target.value; renderObj(); };
  renderObj();
}

function syncOferta() {
  state.oferta.sessao = el("os").value;
  state.oferta.essencial = el("oe").value;
  state.oferta.premium = el("op").value;
  state.oferta.vip = el("ov").value;
  state.oferta.pix = el("ox").value;
  state.oferta.abater = el("oa").checked;
  state.oferta.abaterDias = el("od").value;
  state.oferta.abaterValor = el("oav").value;
  saveOferta();
}

function renderObj() {
  const box = el("objBox");
  const o = OBJS.find((x) => x.k === state.obj);
  if (!o) { box.innerHTML = ""; return; }
  box.innerHTML = `<div class="hint">
    <b>${o.t}</b>
    <p>Pode significar: ${o.significados.join("; ")}.</p>
    <p class="speak">${o.pergunta}</p>
    <p>${o.caminhos}</p>
  </div>`;
}

function renderDna() {
  el("dnaList").innerHTML = DNA.map((d) =>
    `<article class="speak"><span class="tag tag-${d.tipo[0]}">${d.tipo}</span><small>${d.src}</small><p>${d.txt}</p></article>`
  ).join("");
}

function go(i) {
  state.step = Math.max(0, Math.min(STEPS.length - 1, i));
  renderMap();
  renderMain();
}

function saveFicha() {
  const list = JSON.parse(localStorage.getItem(KEY + ":fichas") || "[]");
  const row = {
    at: new Date().toISOString(),
    person: state.person,
    result: state.result,
    notes: state.notes,
    ready: state.ready,
    readyNote: state.readyNote,
    oferta: state.oferta,
    step: STEPS[state.step].id,
    verbalNaoEPago: state.result === "verbal"
  };
  list.unshift(row);
  localStorage.setItem(KEY + ":fichas", JSON.stringify(list.slice(0, 80)));
  el("saved").textContent = "Ficha salva neste aparelho. Aceite verbal não conta como pago.";
}

function exportPdf() {
  const s = STEPS.map((st) => `<h3>${st.n} ${st.t}</h3><p>${state.notes[st.id] || ""}</p>`).join("");
  const w = window.open("", "_blank");
  w.document.write(`<html><head><title>Ficha ${state.person}</title></head><body>
    <h1>Fechamento AF · ${state.person || "sem nome"}</h1>
    <p>Resultado: ${state.result} · ${new Date().toLocaleString("pt-BR")}</p>
    <p>Oferta na ficha: sessão ${state.oferta.sessao} · E ${state.oferta.essencial} · P ${state.oferta.premium} · V ${state.oferta.vip}</p>
    ${s}
    <p>Aceite verbal ≠ pagamento confirmado.</p>
  </body></html>`);
  w.document.close();
  w.print();
}

function openTp() {
  const s = STEPS[state.step];
  el("tpBody").innerHTML = s.speak.map((t) => `<p>${t}</p>`).join("");
  el("tp").classList.add("on");
  applyTp();
}
function applyTp() {
  el("tpBody").style.fontSize = state.tpSize + "px";
}

function bind() {
  document.body.addEventListener("click", (e) => {
    const goBtn = e.target.closest("[data-go]");
    if (goBtn) go(+goBtn.dataset.go);
    const act = e.target.closest("[data-act]");
    if (act) {
      const a = act.dataset.act;
      if (a === "next") go(state.step + 1);
      if (a === "prev") go(state.step - 1);
      if (a === "tp") openTp();
      if (a === "save") saveFicha();
      if (a === "pdf") exportPdf();
      if (a === "closeTp") el("tp").classList.remove("on");
    }
    const rd = e.target.closest("[data-ready]");
    if (rd) {
      state.ready[rd.dataset.ready] = rd.dataset.v;
      renderSide();
    }
    const tab = e.target.closest("[data-tab]");
    if (tab) {
      document.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b === tab));
      el("viewCall").classList.toggle("hidden", tab.dataset.tab !== "call");
      el("viewDna").classList.toggle("hidden", tab.dataset.tab !== "dna");
    }
  });
  document.body.addEventListener("input", (e) => {
    if (e.target.dataset.rn) state.readyNote[e.target.dataset.rn] = e.target.value;
  });
  el("tpSize").oninput = (e) => { state.tpSize = +e.target.value; applyTp(); };
}

loadOferta();
renderMap();
renderMain();
renderSide();
renderDna();
bind();
