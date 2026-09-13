/* Páginas oficiais da mesa — mesmo conteúdo da primeira versão. */
function head(kicker, title, lede) {
  return `<div class="hero"><div>
    <p class="kicker">${esc(kicker)}</p>
    <h1>${esc(title)}</h1>
    ${lede ? `<p class="lede">${esc(lede)}</p>` : ""}
  </div></div>`;
}
function chips(arr) {
  return `<ul class="pill-row">${arr.map((s, i) => `<li class="pill"><span class="mono">${String(i + 1).padStart(2, "0")}</span> ${esc(s)}</li>`).join("")}</ul>`;
}
function raisedList(arr, danger) {
  return `<ul class="raised-list">${arr.map((s) => `<li class="${danger ? "danger" : ""}">${esc(s)}</li>`).join("")}</ul>`;
}

function renderIgor() {
  return `
    ${head("Gestão do mentor · Igor Mello", "Engenharia da mesa.", "Não reinventar o comercial. Adaptar: diagnóstico profundo, PIT invertido, fechar na reunião, sem follow-up morno.")}
    <div class="grid-3">${IGOR_PRINCIPLES.map((p) => `<section class="panel"><h2 class="display">${esc(p.title)}</h2><p class="muted">${esc(p.body)}</p></section>`).join("")}</div>
    <section class="panel" style="margin-top:24px">
      <h2 class="display">Sequência desta call</h2>
      ${chips(SEQUENCE)}
    </section>
    <div class="grid" style="margin-top:24px">
      <section class="panel">
        <h2 class="display">Se ela pergunta o preço</h2>
        ${line(IF_SHE_ASKS_PRICE, true)}
        <p class="muted" style="margin-top:12px">Depois definir o nível. O fechamento ideal não é “vendi uma mentoria”. É “decidimos transformar conexão em execução”.</p>
      </section>
      <section class="panel">
        <h2 class="display">PIT agora · ${state.pit}</h2>
        <div class="pit">${Array.from({ length: 11 }, (_, n) => `<button type="button" data-pit="${n}" class="${state.pit === n ? "on" : ""}">${n}</button>`).join("")}</div>
        <p class="hint">${esc(PIT_RECOVERY[state.pit] || PIT_RECOVERY[0])}</p>
      </section>
    </div>
  `;
}

function renderAfBrief() {
  return `
    ${head("Alinhamento Financeiro · plataforma viva", "A prova de que o método mora em sistema.", AF_HEADLINE)}
    <div class="grid">
      <section class="panel">
        <p class="kicker">Porta de entrada</p>
        <h2 class="display">${esc(AF_ENTRY.name)}</h2>
        <p class="muted">${esc(AF_ENTRY.duration)}</p>
        <p class="display" style="font-size:2.4rem;margin-top:12px">${formatBRL(AF_ENTRY.price)}</p>
        <p class="intent" style="margin-top:12px">${esc(AF_ENTRY.rule)}</p>
      </section>
      <section class="panel">
        <h2 class="display">O que a sessão entrega</h2>
        ${raisedList(AF_ENTRY.includes)}
      </section>
    </div>
    <div class="grid-3" style="margin-top:16px">${AF_PROCESS.map((p) => `<section class="panel"><p class="mono accent">${esc(p.n)}</p><h3 class="display">${esc(p.title)}</h3><p class="muted">${esc(p.body)}</p></section>`).join("")}</div>
    <h2 class="display page-h">Sete módulos. Uma governança.</h2>
    <div class="stack">${AF_MODULES.map((m) => `<section class="panel">
      <div class="mod-grid">
        <div><p class="mono accent">${esc(m.n)}</p><p class="kicker">${esc(m.axis)}</p><h3 class="display">${esc(m.title)}</h3></div>
        <div><p class="lbl">Vazamento</p><p>${esc(m.leak)}</p><p class="muted" style="margin-top:8px">${esc(m.body)}</p></div>
        <div><p class="kicker" style="color:var(--accent)">Para a Francesca</p><p style="margin-top:6px">${esc(m.forFran)}</p></div>
      </div>
    </section>`).join("")}</div>
    <div class="grid" style="margin-top:24px">
      <section class="panel">
        <h2 class="display">AF Plataforma</h2>
        <p class="muted">${esc(AF_PLATFORM.promise)}</p>
        <div class="pill-row" style="margin:12px 0">${AF_PLATFORM.nav.map((n) => `<span class="pill">${esc(n)}</span>`).join("")}</div>
        <ul class="posture">${AF_PLATFORM.extras.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
      </section>
      <section class="panel">
        <h2 class="display">Mostrar na call · não o mapa inteiro</h2>
        ${AF_SHOW_ON_CALL.map((s) => line(s, false)).join("")}
        <p class="flag danger" style="margin-top:16px">Isto o AF não vende</p>
        <ul class="posture">${AF_PLATFORM.not.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
      </section>
    </div>
  `;
}

function renderConv() {
  return `
    ${head("Convergência", "Não resumir a evento.", CONVERGENCIA_ONE_LINER)}
    <section class="panel">${line(CONVERGENCIA_ONE_LINER, true)}</section>
    <h2 class="display page-h">DNA que não muda</h2>
    <div class="grid">${LOCKED.map((l, i) => `<section class="panel"><p class="mono accent">${String(i + 1).padStart(2, "0")}</p><h3 class="display">${esc(l.title)}</h3><p class="muted">${esc(l.body)}</p></section>`).join("")}</div>
    <div class="grid" style="margin-top:16px">
      <section class="panel"><h2 class="display">Pode cocriar com ela</h2>${raisedList(OPEN_WITH_HER)}</section>
      <section class="panel"><h2 class="display">Ordem de engenharia</h2><ol class="posture">${ENGINEERING_ORDER.map((s, i) => `<li><span class="mono accent">${String(i + 1).padStart(2, "0")}</span> ${esc(s)}</li>`).join("")}</ol><p class="muted" style="margin-top:12px">Primeiro o videogame. Depois o mundo físico. Não contratar audiovisual de nove salas sem organismo.</p></section>
    </div>
    <h2 class="display page-h">Jornada</h2>
    <div class="grid">${JOURNEY.map((j) => `<section class="panel"><h3 class="display">${esc(j.act)}</h3><p class="muted">${esc(j.body)}</p></section>`).join("")}</div>
    <h2 class="display page-h">Ingressos</h2>
    <div class="grid-3">${TICKETS.map((t) => `<section class="panel"><h3 class="display">${esc(t.name)}</h3><p class="muted">${esc(t.body)}</p></section>`).join("")}</div>
    <section class="panel" style="margin-top:24px">
      <h2 class="display">V1 · Definition of Done</h2>
      <p class="muted">R$ 7–17 mil compra esta obra. Não compra “tudo que surgir até o ano que vem”. Feature nova = nova construção.</p>
      ${raisedList(V1_DOD)}
    </section>
    <div class="grid" style="margin-top:16px">
      <section class="panel"><h2 class="display">Antes do pagamento</h2><ul class="posture">${SHOW_BEFORE.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></section>
      <section class="panel"><h2 class="display">Só depois do compromisso</h2><ul class="posture">${SHOW_AFTER.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></section>
    </div>
  `;
}

function renderObj() {
  const list = objecoesOf();
  return `
    ${head("PIT invertido · quebrar antes do preço", "O que pode aparecer.", "Não argumentar. Devolver clareza. Preferir recorte de escopo a desconto. Preço só depois.")}
    <div class="stack">${list.map((o, i) => `<section class="panel">
      <p class="mono accent">${String(i + 1).padStart(2, "0")}</p>
      <h2 class="display">${esc(o.title)}</h2>
      <p class="display italic muted" style="font-size:1.15rem;margin-top:8px">“${esc(o.hear)}”</p>
      <div style="margin-top:12px">${o.break.map((b) => line(b, true)).join("")}</div>
    </section>`).join("")}</div>
  `;
}

function renderAsc() {
  return `
    ${head("Roteiro da Ascensão", "Se ela fecha, ela também sobe.", ASCENSAO_INTRO)}
    <div class="grid-3">${H72.map((h) => `<section class="panel"><p class="mono accent">${esc(h.t)}</p><h2 class="display">${esc(h.title)}</h2><ul class="posture" style="margin-top:12px">${h.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></section>`).join("")}</div>
    <div class="grid" style="margin-top:16px">
      <section class="panel"><h2 class="display">30 dias</h2><ol class="posture">${D30.map((d, i) => `<li><span class="mono accent">${String(i + 1).padStart(2, "0")}</span> ${esc(d)}</li>`).join("")}</ol></section>
      <section class="panel"><h2 class="display">90 dias</h2><ul class="posture">${D90.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></section>
    </div>
    <h2 class="display page-h">Os 7 vetores nela</h2>
    <div class="stack">${ASCENSAO_TRACK.map((t) => `<section class="panel track"><p class="mono accent">${esc(t.n)}</p><h3 class="display">${esc(t.title)}</h3><p class="muted">${esc(t.hers)}</p></section>`).join("")}</div>
    <section class="panel" style="margin-top:24px">
      <h2 class="display">${esc(IF_NO_CLOSE.title)}</h2>
      <p class="muted">${esc(IF_NO_CLOSE.body)}</p>
      <p class="display" style="margin-top:12px">${esc(AF_ENTRY.name)} · ${formatBRL(AF_ENTRY.price)}</p>
    </section>
  `;
}

function renderMapa() {
  return `
    ${head("Mapa Mãe · Akasha Hub", "Dois minutos. Não é catálogo.", "Essência vira código, código vira método, método vira marca, marca vira produto, produto vira sistema, sistema vira legado.")}
    <ol class="chain">${MAPA_CHAIN.map((c, i) => `<li><span class="pill display">${esc(c)}</span>${i < MAPA_CHAIN.length - 1 ? `<span class="arrow">→</span>` : ""}</li>`).join("")}</ol>
    <div class="grid-3">${MAPA_BRANCHES.map((b) => `<section class="panel"><p class="mono accent">${esc(b.id)}</p><h2 class="display">${esc(b.title)}</h2><ul class="posture" style="margin-top:12px">${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></section>`).join("")}</div>
    <h2 class="display page-h">Fila de gravação</h2>
    <div class="grid-3">${FILA_GRAVACAO.map((f) => `<section class="panel"><p class="mono accent">Fase ${esc(f.fase)}</p><h3 class="display">${esc(f.title)}</h3><p class="muted">${esc(f.body)}</p></section>`).join("")}</div>
  `;
}

function renderAcesso() {
  const f = personOf();
  const never = pack().neverGlobal || [];
  const wa = pack().whatsapp || "";
  return `
    ${head("Antes e depois · " + (deal().name || ""), "Abrir na medida do compromisso.", "Call: visão e diagnóstico. Entrada: reciprocidade. Depois: arquitetura proporcional. Cofre fechado até o fit.")}
    ${wa ? `<section class="panel"><p class="kicker">WhatsApp · só a porta</p><div>${line(wa, false)}</div></section>` : ""}
    ${never.length ? `<section class="panel" style="margin-top:12px"><p class="kicker" style="color:var(--danger)">Não fazer</p><ul class="posture">${never.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></section>` : ""}
    <div class="grid" style="margin-top:16px">
      <section class="panel">
        <p class="kicker" style="color:var(--ok)">Mostrar agora</p>
        <h2 class="display">Antes</h2>
        ${raisedList(typeof SHOW_BEFORE !== "undefined" ? SHOW_BEFORE : [])}
      </section>
      <section class="panel">
        <p class="kicker" style="color:var(--danger)">Travar</p>
        <h2 class="display">Depois</h2>
        ${raisedList(typeof SHOW_AFTER !== "undefined" ? SHOW_AFTER : [], true)}
      </section>
    </div>
    <h2 class="display page-h">Dossiê · ${esc(f.name || deal().name)}</h2>
    <section class="panel">
      <p class="kicker">${esc(f.role || "")}</p>
      <h3 class="display">${esc(f.name || "")}</h3>
      <ul class="posture" style="margin-top:16px">${(f.facts || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </section>
    <div class="grid" style="margin-top:12px">${(f.ecosystems || []).map((e) => `<section class="panel"><h3 class="display">${esc(e.name)}</h3><p class="muted">${esc(e.body)}</p></section>`).join("")}</div>
    <section class="panel" style="margin-top:16px">
      <h2 class="display">Postura na mesa</h2>
      ${(f.posture || postureOf()).map((p) => line(p, false)).join("")}
    </section>
    ${closePanel()}
  `;
}

function renderPagamento() {
  const engine = typeof CLOSE_ENGINE !== "undefined" ? CLOSE_ENGINE : { steps: [], lede: "", title: "Pagamento" };
  return `
    ${head("Igor · fechar na reunião", engine.title, engine.lede)}
    <div class="stack">${(engine.steps || []).map((s) => `<section class="panel">
      <p class="mono accent">${esc(s.n)}</p>
      <h2 class="display">${esc(s.title)}</h2>
      <div style="margin-top:12px">${line(s.speak, true)}</div>
    </section>`).join("")}</div>
    ${closePanel()}
    <section class="panel" style="margin-top:16px">
      <h2 class="display">Recurso nomeado</h2>
      <div class="vals">${valuesList().map((v) => `<button type="button" class="btn ${state.named === v ? "btn-primary" : "btn-outline"}" data-val="${v}">${formatBRL(v)}</button>`).join("")}</div>
      <div class="pit" style="margin-top:16px">${Array.from({ length: 11 }, (_, n) => `<button type="button" data-pit="${n}" class="${state.pit === n ? "on" : ""}">${n}</button>`).join("")}</div>
    </section>
  `;
}

function renderFaixasFull() {
  const current = faixaForDeal(state.named);
  const list = faixasList();
  const lang = dealId === "francesca" && typeof SMART_MONEY_LANG !== "undefined" ? SMART_MONEY_LANG : null;
  return `
    ${head("Interno · nunca ler em voz alta como tabela", "O número compra responsabilidade.", "R$ 3 mil não é R$ 17 mil de obra. Descubra o nível. Depois case com o recorte. Não anuncie o piso.")}
    <div class="grid">${list.map((f) => {
      const active = current && current.id === f.id;
      const pick = f.max === 17000 ? 12000 : f.min || 350;
      return `<button type="button" class="deal ${active ? "on-deal" : ""}" data-val="${pick}">
        <p class="mono accent">${esc(f.range)}</p>
        <h2>${esc(f.name)}</h2>
        <p class="muted">${esc(f.done)}</p>
        <div class="cols" style="margin-top:16px">
          <div><p class="lbl" style="color:var(--ok)">Abre</p><ul class="posture">${f.opens.map((o) => `<li>${esc(o)}</li>`).join("")}</ul></div>
          <div><p class="lbl">Não abre</p><ul class="posture">${f.closed.map((o) => `<li>${esc(o)}</li>`).join("")}</ul></div>
        </div>
      </button>`;
    }).join("")}</div>
    <section class="panel" style="margin-top:16px"><h2 class="display">${esc(ABOVE_17.title)}</h2><p class="muted">${esc(ABOVE_17.body)}</p></section>
    ${lang ? `<div class="grid" style="margin-top:16px">
      <section class="panel"><h2 class="display">Linguagem</h2><p class="muted">Interno: ${esc(lang.internal)}</p><p class="kicker" style="margin-top:12px;color:var(--accent)">Para ela</p><ul class="posture">${lang.external.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></section>
      <section class="panel"><h2 class="display">Por quê</h2><p class="muted">${esc(lang.why)}</p></section>
    </div>` : ""}
  `;
}

const VIEWS = {
  mesa: () => renderMesa(),
  caderno: () => renderCaderno(),
  fechamento: () => renderIgor(),
  af: () => renderAfBrief(),
  convergencia: () => renderConv(),
  faixas: () => renderFaixasFull(),
  objecoes: () => renderObj(),
  ascensao: () => renderAsc(),
  mapa: () => renderMapa(),
  acesso: () => renderAcesso(),
  dossie: () => renderAcesso(),
  fechamentos: () => renderFechamentos(),
  pagamento: () => renderPagamento(),
  guia: () => renderGuiaV3(),
  mostrar: () => renderMostrar(),
  proposta: () => renderProposta17(),
  entrega: () => renderEntrega(),
  garantia: () => renderGarantia(),
  pos: () => renderPosSim()
};

function brl(n) {
  return typeof formatBRL === "function" ? formatBRL(n) : "R$ " + n;
}

function renderEntrega() {
  const list = typeof MARCOS_17K !== "undefined" ? MARCOS_17K : [];
  const sum = typeof marcosSoma === "function" ? marcosSoma() : 0;
  const inc = typeof INCLUIDO !== "undefined" ? INCLUIDO : { in: [], out: [], extra: "" };
  const tl = typeof TIMELINE_12 !== "undefined" ? TIMELINE_12 : [];
  const tpl = typeof DEAL_TEMPLATE !== "undefined" ? DEAL_TEMPLATE : null;
  const fran = dealId === "francesca";
  return `
    ${head(fran ? "Francesca · soma R$ 17.000" : "Mesmo esqueleto · outra obra", "Dinheiro → entrega → pronto.", fran ? "Cada marco tem valor, o que é, e quando está pronto." : "Não copiar os 17 mil da Francesca. Preencher a obra deste deal.")}
    ${fran ? `<div class="stack">${list.map((m) => `<section class="panel">
      <p class="mono accent">${esc(m.n)} · ${brl(m.v)}</p>
      <h3 class="display">${esc(m.name)}</h3>
      <p>${esc(m.what)}</p>
      <p class="muted" style="margin-top:8px">Pronto: ${esc(m.done)}</p>
    </section>`).join("")}
    <section class="panel"><p class="flag ${sum === 17000 ? "ok" : "danger"}">Soma: ${brl(sum)} ${sum === 17000 ? "· fecha 17.000" : "· conferir"}</p></section>
    </div>
    <div class="grid" style="margin-top:16px">
      <section class="panel"><p class="kicker" style="color:var(--ok)">Incluído</p><ul class="posture">${inc.in.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>
      <section class="panel"><p class="kicker" style="color:var(--danger)">Não incluído</p><ul class="posture">${inc.out.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><p class="muted" style="margin-top:12px">${esc(inc.extra)}</p></section>
    </div>
    <h2 class="display page-h">12 meses</h2>
    <div class="grid-3">${tl.map((t) => `<section class="panel"><p class="kicker">${esc(t.when)}</p><p>${esc(t.what)}</p></section>`).join("")}</div>` : ""}
    ${tpl ? `<section class="panel" style="margin-top:16px">
      <h3>${esc(tpl.title)}</h3>
      <p class="muted">${esc(tpl.use)}</p>
      <ul class="posture">${tpl.slots.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    </section>` : ""}
  `;
}

function renderGarantia() {
  const g = typeof GARANTIA !== "undefined" ? GARANTIA : null;
  if (!g) return head("Garantia", "Carregue lote 2", "");
  return `
    ${head("Comercial · advogado revisa depois", "Garantia por marco.", g.rule)}
    <section class="panel">
      <p class="lede">${esc(g.example)}</p>
    </section>
    <section class="panel" style="margin-top:16px">
      <p class="kicker">Cláusula para colar no termo</p>
      ${line(g.clause, true)}
    </section>
  `;
}

function renderPosSim() {
  const h = typeof H72 !== "undefined" ? H72 : [];
  const a = typeof MSG_FECHEI !== "undefined" ? MSG_FECHEI : "";
  const b = typeof MSG_MARCOS !== "undefined" ? MSG_MARCOS : "";
  return `
    ${head("Ela disse show. Fechei.", "O que mandar agora.", "Não mandar piso. Não mandar Mesa. Não mandar DNA.")}
    <section class="panel">
      <h3>72 horas</h3>
      <ul class="posture">${h.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </section>
    <div class="grid" style="margin-top:16px">
      <section class="panel">
        <p class="kicker">WhatsApp 1 · fechou</p>
        ${line(a, true)}
      </section>
      <section class="panel">
        <p class="kicker">WhatsApp 2 · marcos</p>
        ${line(b, true)}
      </section>
    </div>
  `;
}

function qBlock(title, arr) {
  return `<section class="panel"><p class="kicker">${esc(title)}</p>${arr.map((q) => line(q, false)).join("")}</section>`;
}

function renderGuiaV3() {
  const steps = typeof MESA_CORE_STEPS !== "undefined" ? MESA_CORE_STEPS : [];
  const qs = typeof CALL_QS !== "undefined" ? CALL_QS : {};
  const later = typeof LOTE_LATER !== "undefined" ? LOTE_LATER : [];
  const priv = typeof MESA_PRIVATE !== "undefined" ? MESA_PRIVATE : { floor: 5000, offer: 17000 };
  return `
    ${head("Mesa Core · playbook Francesca", "Guia da call. Um olho.", "Não é teleprompt. Risca. Anota. Copia no fim.")}
    <section class="panel">
      <p class="kicker">Interno</p>
      <p>Piso R$ ${priv.floor.toLocaleString("pt-BR")} · proposta R$ ${priv.offer.toLocaleString("pt-BR")}. Ela nomeia primeiro.</p>
    </section>
    <ol class="v3">
      ${steps.map((s, i) => `<li>
        <button type="button" class="cad-item ${state.caderno["v3-"+s.id] ? "on" : ""}" data-cad="${esc("v3-"+s.id)}">
          <span class="check ${state.caderno["v3-"+s.id] ? "on" : ""}">${state.caderno["v3-"+s.id] ? svg("check") : ""}</span>
          <span><strong>${String(i + 1).padStart(2, "0")} ${esc(s.t)}</strong></span>
        </button>
        <textarea data-v3-note="${esc(s.id)}" placeholder="nota…">${esc((state.actNotes && state.actNotes["v3-"+s.id]) || "")}</textarea>
      </li>`).join("")}
    </ol>
    <p style="margin:12px 0"><button type="button" class="btn btn-primary" data-copy-notes>Copiar todas as anotações</button></p>
    <h2 class="display page-h">Perguntas (essenciais)</h2>
    <div class="grid">
      ${qBlock("Visão", qs.visao || [])}
      ${qBlock("Situação", qs.situacao || [])}
      ${qBlock("Execução", qs.execucao || [])}
      ${qBlock("Convergência", qs.convergencia || [])}
      ${qBlock("Papel", qs.papel || [])}
      ${qBlock("Propriedade", qs.ip || [])}
      ${qBlock("Dinheiro", qs.dinheiro || [])}
      ${qBlock("Fechamento", qs.fechamento || [])}
    </div>
    <section class="panel" style="margin-top:16px">
      <h3>Depois desta call (não agora)</h3>
      <ul class="posture">${later.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </section>
  `;
}

function renderMostrar() {
  const t = typeof SHOW_TABLE !== "undefined" ? SHOW_TABLE : { before: [], partial: [], after: [] };
  const ip = typeof IP_SPLIT !== "undefined" ? IP_SPLIT : [];
  return `
    ${head("Prova sem entregar a casa", "O que mostrar. O que guardar.", "Antes do pagamento: capacidade. Depois: propriedade.")}
    <div class="grid-3">
      <section class="panel">
        <p class="kicker" style="color:var(--ok)">Antes do fechamento</p>
        <ul class="posture">${t.before.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </section>
      <section class="panel">
        <p class="kicker" style="color:var(--warn)">Parcial</p>
        <ul class="posture">${t.partial.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </section>
      <section class="panel">
        <p class="kicker" style="color:var(--danger)">Só depois</p>
        <ul class="posture">${t.after.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </section>
    </div>
    <h2 class="display page-h">Fonte de verdade</h2>
    <div class="grid-3">${ip.map((x) => `<section class="panel"><p class="kicker">${esc(x.who)}</p><p>${esc(x.keep)}</p></section>`).join("")}</div>
  `;
}

function renderProposta17() {
  const o = typeof ONE_PAGE !== "undefined" ? ONE_PAGE : null;
  if (!o) return head("Proposta", "Carregue mesa-lote1.js", "");
  return `
    ${head("Não compartilhar tela até ela pedir o caminho", o.title, o.sub + " · " + o.value)}
    <section class="panel">
      <p class="lede">${esc(o.what)}</p>
    </section>
    <div class="grid">
      <section class="panel">
        <p class="kicker" style="color:var(--ok)">Entra</p>
        <ul class="posture">${o.includes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </section>
      <section class="panel">
        <p class="kicker" style="color:var(--danger)">Não entra</p>
        <ul class="posture">${o.not.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <p class="flag ok" style="margin-top:16px">${esc(o.done)}</p>
      </section>
    </div>
    <section class="panel" style="margin-top:16px">
      <h3>Como falar o número</h3>
      <p>Colaborocracia é o longo prazo. Para eu entrar com estrutura, sistema, conteúdo e execução, existe uma fase inicial financiada. São ${esc(o.value)} por 12 meses de construção conjunta, com obra definida. O que passar disso é outra obra.</p>
      <p class="muted" style="margin-top:12px">Decomposição em marcos que somam 17.000: lote 2. Não inventar agora.</p>
    </section>
  `;
}

function render() {
  renderShell();
  const page = document.getElementById("page");
  if (!page) return;
  const fn = VIEWS[view] || renderMesa;
  page.innerHTML = fn();
  save();
}

render();
