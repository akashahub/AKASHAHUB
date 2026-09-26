/* Mesa Francesca · teleprompter. Só esta call. Não é a Flui, não é o Zé. */
const FRANCESCA_FIO = [
  {
    id: "abre",
    chip: "Abre",
    lines: ["A primeira call foi de escuta. Hoje eu quero te mostrar a casa e entender a sua."],
    dir: "Olha pra ela. Não explica ferramenta."
  },
  {
    id: "garante",
    chip: "Garante",
    lines: ["Isso aqui eu garanto que vai resolver."],
    dir: "Devagar. Sem sorriso de vendedor."
  },
  {
    id: "diag",
    chip: "Diagnóstico",
    lines: [
      "Deixa eu te devolver o que eu estou vendo. Em uma frase.",
      "Você tem um paraíso de conexão. E uma Colaborocracia (quem entra na obra vira sócio, não plateia) já desenhada.",
      "O que ainda não está vivo é o organismo que faz isso acontecer no digital e no presencial ao mesmo tempo.",
      "Se a gente não resolver isso, continua brilhante e lento. Se a gente resolve, deixa de depender da sua cabeça."
    ],
    dir: "Médico. O diagnóstico já está feito. Não pergunta se faz sentido."
  },
  {
    id: "mapa",
    chip: "O mapa",
    lines: [
      "Antes de eu abrir qualquer casa, olha o seu campo.",
      "Freedom (liberdade como campo de vida e negócio). Beautiful Living (viver bonito: casa, corpo, relação). Beeter (o seu projeto nesse mesmo campo). Operação. Conteúdo. Dinheiro. Equipe."
    ],
    abrir: [{ t: "Abrir o mapa na tela dela", href: "francesca-mapa.html", share: true }],
    escuta: ["Na nossa última conversa, o que ficou mais forte pra você?", "O que você quer materializar em 90 dias?"],
    dir: "Compartilha só o mapa. Esta conversa fica no notebook. Ela responde. Você anota e cala."
  },
  {
    id: "cena",
    chip: "A solução",
    lines: [
      "Imagina isso.",
      "Uma pessoa vê o que você fala. Ela se reconhece. Chega junto. Quer entrar. Quer fazer negócio.",
      "Outra ouve o evento. Entende o que pode acontecer. Investe. Entra como sócia. O evento sai do papel.",
      "Você dentro da mentoria, como peer (colega, não aluna). E, se você quiser, outras pessoas fazendo mentoria dentro do seu negócio.",
      "Eu no palco, se o evento estiver marcado. Inclusive em inglês.",
      "Isso é a solução. É isso acontecendo. Não é uma lista do que eu vendo."
    ],
    dir: "Uma cena. Se ela pegar uma, fica nela. Não abre produto."
  },
  {
    id: "custo",
    chip: "O custo",
    lines: [
      "Se a gente terminar esta chamada só com uma conversa incrível, o que isso vai te custar?",
      "Se isso não sair do papel e ficar só em ideia, o que isso significa pra você?"
    ],
    dir: "Cala. Não completa a frase dela."
  },
  {
    id: "valor",
    chip: "O valor",
    lines: [
      "Você quer resolver isso.",
      "Qual valor você tem disponível agora pra gente começar?",
      "Pode ser o total. Pode ser uma parcela. Você fala."
    ],
    valor: true,
    dir: "Não fala número nenhum antes dela. Nem 5 mil, nem 17 mil, nem euro."
  },
  {
    id: "entra",
    chip: "Como entra",
    lines: [
      "Beleza. Como isso entra agora?",
      "Você está na Finlândia. Recebe em euro? Tem cartão? Tem conta no Brasil também?",
      "Transferência, cartão, Pix (pagamento instantâneo no Brasil), ou uma parte em euro e outra em real?"
    ],
    cobra: true,
    dir: "Uma pergunta. Espera a resposta. Não faz entrevista."
  },
  {
    id: "mostra",
    chip: "Agora mostra",
    lines: [
      "Então olha como isso se resolve.",
      "Tu entendeu?",
      "Isso aqui resolve. A gente começa."
    ],
    abrir: [
      { t: "Alinhamento · página 1", href: "/alinhamentofinanceiro/", share: true },
      { t: "Alinhamento · página 2", href: "/alinhamentofinanceirov2/", share: true },
      { t: "Mapa mãe · notebook", href: "index.html#mapa", share: false },
      { t: "Convergência · notebook", href: "index.html#convergencia", share: false }
    ],
    dir: "Só agora. Uma aba por vez. Esta conversa não vai pra tela dela."
  }
];

const FRANCESCA_GLOSS = [
  ["Freedom", "liberdade como campo de vida e negócio"],
  ["Beautiful Living", "viver bonito: casa, corpo, relação"],
  ["Beeter", "o projeto dela nesse campo"],
  ["Colaborocracia", "quem entra vira sócio, não plateia"],
  ["peer", "colega, não aluna"],
  ["Pix", "pagamento instantâneo no Brasil"],
  ["blueprint", "a planta da obra, antes de construir"]
];

const FRANCESCA_OBJ = {
  preco: "Eu não abro o preço. Você me diz o que tem disponível agora.",
  pensar: "O diagnóstico não muda pensando. O que trava é o recurso, ou é a decisão?",
  resumo: "Resumo não opera. Ou a gente começa agora, ou você me diz o que tem disponível.",
  socio: "Quem decide entra agora. Liga. A gente espera."
};

function fcMoney(n, moeda) {
  const v = Number(n) || 0;
  return v.toLocaleString("pt-BR", { style: "currency", currency: moeda === "EUR" ? "EUR" : "BRL" });
}

function fcBanda(n, moeda) {
  const v = Number(n);
  if (!v) return "";
  if (moeda === "EUR") {
    if (v >= 3000) return "fecha";
    if (v >= 1500) return "cabe";
    return "baixo";
  }
  if (v >= 17000) return "fecha";
  if (v >= 5000) return "cabe";
  return "baixo";
}

function fcFalaBanda(banda) {
  if (banda === "baixo") {
    return "Pô. Eu tenho como te ajudar a partir de 5 mil reais, ou 1.500 euros. Pra ficar melhor, o meio é 17 mil reais, uns 3 mil euros. O meio é onde a primeira fase fica inteira.";
  }
  if (banda === "cabe") {
    return "É esse valor mesmo que você tem agora? Se for, beleza. A gente fecha por esse valor. Eu consigo resolver isso pra você com esse valor. Tranquilo?";
  }
  if (banda === "fecha") {
    return "É esse valor. A gente fecha. Eu resolvo isso com esse valor. Tranquilo?";
  }
  return "";
}

function fcStep(d) {
  if (typeof FRANCESCA_FIO === "undefined") return;
  const onFrancesca = typeof dealId === "undefined" || dealId === "francesca";
  const onMesa = typeof view === "undefined" || view === "mesa";
  if (!onFrancesca || !onMesa) return;
  const beat = FRANCESCA_FIO[state.act] || FRANCESCA_FIO[0];
  const n = (beat.lines || []).length;
  const line = state.fcLine || 0;
  if (d > 0) {
    if (line < n - 1) state.fcLine = line + 1;
    else if (state.act < FRANCESCA_FIO.length - 1) {
      state.act += 1;
      state.fcLine = 0;
      state.fcObj = "";
    }
  } else if (line > 0) state.fcLine = line - 1;
  else if (state.act > 0) {
    state.act -= 1;
    const prev = FRANCESCA_FIO[state.act];
    state.fcLine = Math.max(0, (prev.lines || []).length - 1);
    state.fcObj = "";
  }
  if (typeof save === "function") save();
  render();
}

function renderFrancescaMesa() {
  const i = Math.max(0, Math.min(FRANCESCA_FIO.length - 1, state.act || 0));
  const beat = FRANCESCA_FIO[i];
  const line = Math.max(0, Math.min((beat.lines.length || 1) - 1, state.fcLine || 0));
  const moeda = state.fcMoeda === "EUR" ? "EUR" : "BRL";
  const banda = state.named ? fcBanda(state.named, moeda) : "";
  const obj = state.fcObj && FRANCESCA_OBJ[state.fcObj] ? FRANCESCA_OBJ[state.fcObj] : "";
  const falaValor = beat.valor && banda && line === beat.lines.length - 1;
  const big = obj || (falaValor ? fcFalaBanda(banda) : beat.lines[line]);
  let dir = beat.dir || "";
  if (obj) dir = "Quebra. Depois volta pra pergunta dela.";
  else if (falaValor) dir = "Uma vez. Depois cala.";
  const past = [];
  FRANCESCA_FIO.slice(0, i).forEach((b) => {
    (b.lines || []).forEach((t) => past.push(t));
  });
  beat.lines.slice(0, line).forEach((t) => past.push(t));

  const chips = FRANCESCA_FIO.map((b, n) => {
    const on = n === i ? " on" : "";
    return `<button type="button" class="fchip${on}" data-act="${n}">${esc(b.chip)}</button>`;
  }).join("");

  const thread = past.slice(-4).map((t) => `<p class="fbub">${esc(t)}</p>`).join("");

  const abrir = (beat.abrir || [])
    .map((a) => {
      const cls = a.share ? "fopen fopen-share" : "fopen";
      const sub = a.share ? "na tela dela" : "no notebook";
      return `<a class="${cls}" href="${esc(a.href)}" target="_blank" rel="noopener"><b>${esc(a.t)}</b><small>${sub}</small></a>`;
    })
    .join("");

  const escuta = (beat.escuta || []).map((q) => `<p class="fher">${esc(q)}</p>`).join("");

  const valorBox = beat.valor
    ? `<div class="fvalor">
        <div class="fmoeda">
          <button type="button" data-fc-moeda="BRL" class="${moeda === "BRL" ? "on" : ""}">Real</button>
          <button type="button" data-fc-moeda="EUR" class="${moeda === "EUR" ? "on" : ""}">Euro</button>
        </div>
        <label>Ela disse<input id="fcValor" inputmode="decimal" value="${state.named ? String(state.named).replace(".", ",") : ""}" placeholder="espera ela falar"></label>
        ${state.named ? `<p class="fband">${esc(banda === "baixo" ? "Abaixo do chão. Sobe pro meio." : banda === "cabe" ? "Cabe. Confirma se é isso mesmo. Aí fecha." : "É o valor. Fecha.")}</p>` : `<p class="fband">Silêncio. Ela fala o número.</p>`}
        <div class="fobj">
          <button type="button" data-fc-obj="preco">Se pedir o preço</button>
          <button type="button" data-fc-obj="pensar">Se for pensar</button>
          <button type="button" data-fc-obj="resumo">Se pedir resumo</button>
          <button type="button" data-fc-obj="socio">Se tiver sócio</button>
        </div>
      </div>`
    : "";

  const cobra = beat.cobra
    ? `<ul class="fcobra">
        <li>Euro na Finlândia, ou real</li>
        <li>Cartão, transferência, Pix, ou os dois</li>
        <li>Conta no Brasil, ou só aí</li>
        <li>Se for parcela: qual parcela entra hoje</li>
      </ul>`
    : "";

  return `<div class="fmesa">
    <aside class="fside">
      <img class="flua" src="../assets/img/lua/atencao/lua-atencao-01.webp" alt="Lua">
      <p class="fk">Francesca · não compartilhar esta tela</p>
      <div class="fthread">${thread || `<p class="fbub mute">A conversa começa na mesa.</p>`}</div>
      <ul class="fgloss">${FRANCESCA_GLOSS.map((g) => `<li><b>${esc(g[0])}</b> ${esc(g[1])}</li>`).join("")}</ul>
    </aside>
    <section class="ftable">
      <img class="fwash" src="../assets/img/lua/hero/lua-hero-02.webp" alt="">
      <div class="fchips">${chips}</div>
      <p class="fk gold">${esc(beat.chip)} · ${line + 1}/${beat.lines.length}</p>
      <p class="fsay">${esc(big)}</p>
      <p class="fdir">${esc(dir)}</p>
      ${escuta}
      ${abrir ? `<div class="fopens">${abrir}</div>` : ""}
      ${valorBox}
      ${cobra}
      <div class="fnav">
        <button type="button" data-fc-dir="-1">Fala anterior</button>
        <button type="button" class="gold" data-fc-dir="1">Próxima fala</button>
      </div>
    </section>
  </div>`;
}

document.addEventListener("click", (e) => {
  const act = e.target.closest(".fchip");
  if (act) {
    state.act = Number(act.getAttribute("data-act"));
    state.fcLine = 0;
    state.fcObj = "";
    if (typeof save === "function") save();
    render();
    return;
  }
  const dir = e.target.closest("[data-fc-dir]");
  if (dir) {
    fcStep(Number(dir.getAttribute("data-fc-dir")));
    return;
  }
  const moeda = e.target.closest("[data-fc-moeda]");
  if (moeda) {
    state.fcMoeda = moeda.getAttribute("data-fc-moeda");
    if (typeof save === "function") save();
    render();
    return;
  }
  const obj = e.target.closest("[data-fc-obj]");
  if (obj) {
    const id = obj.getAttribute("data-fc-obj");
    state.fcObj = state.fcObj === id ? "" : id;
    if (typeof save === "function") save();
    render();
  }
});

document.addEventListener("input", (e) => {
  if (e.target.id !== "fcValor") return;
  const raw = String(e.target.value).trim().replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(raw);
  state.named = Number.isFinite(n) && n > 0 ? n : null;
  if (typeof save === "function") save();
  const pos = e.target.selectionStart;
  render();
  const again = document.getElementById("fcValor");
  if (again) {
    again.focus();
    const at = pos == null ? again.value.length : pos;
    again.setSelectionRange(at, at);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.target && e.target.matches && e.target.matches("input, textarea")) return;
  if (typeof dealId !== "undefined" && dealId !== "francesca") return;
  if (typeof view !== "undefined" && view !== "mesa") return;
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") e.preventDefault();
  if (e.key === "ArrowRight") fcStep(1);
  if (e.key === "ArrowLeft") fcStep(-1);
});
