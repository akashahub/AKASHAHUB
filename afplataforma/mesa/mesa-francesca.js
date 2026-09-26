/* Mesa Francesca · teleprompter. Só esta call. Não é a Flui, não é o Zé. */
const FRANCESCA_FIO = [
  {
    id: "abre",
    chip: "Abre",
    lines: [
      "A primeira call foi de escuta. Hoje eu quero te mostrar a casa e entender a sua.",
      "Isso aqui eu garanto que vai resolver."
    ],
    dir: "Devagar. Sem sorriso de vendedor."
  },
  {
    id: "conexao",
    chip: "Conexão",
    lines: [
      "Teve uma fase em que eu trabalhava muito e no fim do mês não sobrava. A casa cobrava. Energia e dinheiro vazavam.",
      "Eu saí do presencial pro digital pra parar de vazar.",
      "Nessa transição o Akasha virou um organismo. Nasceu da reorganização da vida, não de um aplicativo."
    ],
    pode: ["A casa grande, o quarto de terapia, o atelier. Só se ela puxar a sua história. Não abre com isso."],
    nao: ["Quanto você ganhava.", "Bugar o algoritmo.", "O nome da mentoria. Ainda não."],
    dir: "Conexão curta. Aí volta pra ela."
  },
  {
    id: "escuta",
    chip: "Escuta",
    lines: [
      "Na nossa última conversa, o que ficou mais forte pra você?",
      "O que você quer materializar em 90 dias?"
    ],
    pode: [
      "Qual é o maior gargalo entre a visão e a execução?",
      "Onde o sistema ainda depende de você?",
      "O que a Colaborocracia precisa ter de concreto em 6, 9 ou 12 meses?",
      "O que não pode continuar no improviso?"
    ],
    dir: "Anota calado. Não completa a frase dela."
  },
  {
    id: "campo",
    chip: "O campo",
    lines: [
      "Antes de eu abrir o Akasha, eu desenho o seu campo.",
      "Freedom (liberdade como campo de vida e negócio). Beautiful Living (viver bonito: casa, corpo, relação). Beeter (o seu projeto nesse mesmo campo). Operação. Conteúdo. Dinheiro. Equipe.",
      "Você já constrói em 67 países e 10 mil conversas. O gargalo raramente é visão. Quase sempre é a visão virar um organismo que executa.",
      "Colaborocracia (quem entra na obra vira sócio, não plateia) de longo prazo precisa de uma entrada que gere atenção, sistema e caixa. Senão vira conversa eterna."
    ],
    abrir: [{ t: "Abrir o mapa na tela dela", href: "francesca-mapa.html", share: true }],
    dir: "Compartilha só o mapa. Esta conversa fica no notebook."
  },
  {
    id: "frase",
    chip: "A frase",
    lines: [
      "Deixa eu te devolver o que eu estou vendo. Em uma frase.",
      "Você tem um paraíso de conexão e uma economia de Colaborocracia já desenhada. O que ainda não está vivo é o organismo que faz isso acontecer no digital e no presencial ao mesmo tempo.",
      "Se a gente não resolver isso, continua brilhante e lento. Se a gente resolve, vira um ecossistema que se sustenta sem você repetir tudo.",
      "Se a gente terminar esta chamada só com uma conversa incrível, o que isso vai te custar?",
      "Se isso não sair do papel e ficar só em ideia, o que isso significa pra você?"
    ],
    pode: ["Você quer muito resolver isso? Só se ela esfriar. Melhor não pedir licença."],
    nao: ["Faz sentido?", "De zero a dez.", "Qualquer produto, app ou mentoria."],
    dir: "Médico. O diagnóstico já está feito. Na pergunta do custo, cala."
  },
  {
    id: "imagina",
    chip: "Imagina",
    lines: [
      "Daqui a uns meses. Não sou eu. É uma mulher que ainda não te conhece.",
      "Ela vê o que você fala. Se reconhece. Chega junto. Quer entrar. Quer fazer negócio.",
      "Outra ouve o evento. Entende o que pode acontecer. Investe. Entra como sócia. O evento acontece, e a marca de vocês está nele.",
      "No evento, a fala em inglês acontece. Quem assiste associa isso ao campo dela, não a um convidado solto.",
      "A casa guarda o que foi dito. Quem não estava na sala vê depois. Ela não explica tudo de novo."
    ],
    nao: ["Alinhamento Financeiro, módulos, dashboard, PDF, blueprint (a planta da obra), app, percentual, patente."],
    dir: "Hipótese. Terceira pessoa. Futuro. Se ela pegar uma cena, fica nela."
  },
  {
    id: "valor",
    chip: "O valor",
    lines: [
      "Existe uma diferença entre uma conversa incrível e assumir a obra.",
      "Não é mensalidade. É a entrada que liga a máquina. O que vier depois é outro acordo.",
      "Qual valor você tem disponível agora pra gente começar? Pode ser o total ou uma parcela. Você fala."
    ],
    valor: true,
    nao: ["Não anuncia valor. Nem o que você ganhava antes. Nem percentual. Nem doze meses."],
    dir: "Ela fala o número. Você espera."
  },
  {
    id: "entra",
    chip: "Como entra",
    lines: [
      "Beleza. Como isso entra agora?",
      "Você está na Finlândia. Em euro, em real, ou uma parte em cada?",
      "Transferência, cartão, Pix (pagamento instantâneo no Brasil), ou os dois?"
    ],
    pode: ["Qual banco. Limite do cartão. Conta no Brasil ou em outro país. Boleto numa parte, cartão na outra. Só se a primeira resposta travar."],
    cobra: true,
    dir: "Uma pergunta. Espera. Não faz entrevista de banco."
  },
  {
    id: "mostra",
    chip: "Agora mostra",
    lines: [
      "Olha o que eu construí. Não pra você fazer a minha mentoria. Pra você ver como eu estruturo.",
      "Você entra como peer (colega, não aluna). Eu te mostro o que pode entrar no seu sistema, e o que não entra.",
      "Essência vira código. Código vira método. Método vira marca. Marca vira produto. Produto vira sistema. Sistema vira legado.",
      "A execução não mora em PDF.",
      "Tu entendeu? Isso aqui resolve. A gente começa."
    ],
    abrir: [
      { t: "Alinhamento · página 1", href: "/alinhamentofinanceiro/", share: true },
      { t: "Alinhamento · página 2", href: "/alinhamentofinanceirov2/", share: true },
      { t: "Mapa mãe · notebook", href: "index.html#mapa", share: false },
      { t: "Convergência · notebook", href: "index.html#convergencia", share: false }
    ],
    nao: ["Não decide percentual nesta call. Não promete patente. Não fala de madrugada."],
    dir: "Só depois que ela falou o valor. Uma aba por vez. Esta conversa não vai pra tela dela."
  },
  {
    id: "obra",
    chip: "A obra",
    lines: [
      "Na prática, eu começo a construir agora.",
      "Dois encontros por semana. Um de alinhamento financeiro (caixa, decisão e legado). Um de arquitetura de essência (a estrutura da sua obra, não uma aula solta).",
      "A primeira versão da casa do evento sai o quanto antes. O que passar dessa obra é outra obra."
    ],
    pode: ["O conteúdo do Beeter, do Beautiful Living e do Freedom entra nessa construção. A palestra em inglês, se o evento estiver marcado. Só se ela perguntar o que cabe."],
    nao: ["Percentual. Patente. Ligação de madrugada. Outdoor. Nome de bilionário. Custo de live dentro do ingresso. Black box."],
    dir: "Só se ela já fechou. Curto. A obra tem começo e fim."
  }
];

const FRANCESCA_GLOSS = [
  ["Freedom", "liberdade como campo de vida e negócio"],
  ["Beautiful Living", "viver bonito: casa, corpo, relação"],
  ["Beeter", "o projeto dela nesse campo"],
  ["Colaborocracia", "quem entra vira sócio, não plateia"],
  ["peer", "colega, não aluna"],
  ["essência", "a estrutura da obra, não uma aula solta"],
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

  const pode = (beat.pode || []).map((t) => `<p class="fpode">${esc(t)}</p>`).join("");
  const nao = (beat.nao || []).map((t) => `<p class="fnao">${esc(t)}</p>`).join("");

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
      <p class="fk gold">Fala · ${esc(beat.chip)} · ${line + 1}/${beat.lines.length}</p>
      <p class="fsay">${esc(big)}</p>
      <p class="fdir">${esc(dir)}</p>
      ${pode}
      ${nao}
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
