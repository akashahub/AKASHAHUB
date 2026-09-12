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
  return `
    ${head("PIT invertido · quebrar antes do preço", "O que ela pode dizer.", "Não argumentar. Devolver clareza. Preferir recorte de escopo a desconto.")}
    <div class="stack">${OBJECOES.map((o, i) => `<section class="panel">
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
  const f = FRANCESCA;
  return `
    ${head("Antes e depois do Pix", "Abrir a casa na medida do compromisso.", "Call atual: visão, algumas provas, diagnóstico. Entrada: reciprocidade. Depois: arquitetura proporcional.")}
    <div class="grid">
      <section class="panel">
        <p class="kicker" style="color:var(--ok)">Mostrar agora</p>
        <h2 class="display">Antes</h2>
        ${raisedList(SHOW_BEFORE)}
        <ul class="posture" style="margin-top:12px">
          <li>Uma ou duas telas da AF — não o login dela.</li>
          <li>A cadeia Essência → Legado em voz alta.</li>
          <li>Quem você é nesta mesa: arquiteto, não pedinte.</li>
        </ul>
      </section>
      <section class="panel">
        <p class="kicker" style="color:var(--danger)">Travar</p>
        <h2 class="display">Depois</h2>
        ${raisedList(SHOW_AFTER, true)}
      </section>
    </div>
    <h2 class="display page-h">Dossiê Francesca</h2>
    <section class="panel">
      <p class="kicker">${esc(f.role)}</p>
      <h3 class="display">${esc(f.name)}</h3>
      <ul class="posture" style="margin-top:16px">${f.facts.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </section>
    <div class="grid" style="margin-top:12px">${f.ecosystems.map((e) => `<section class="panel"><h3 class="display">${esc(e.name)}</h3><p class="muted">${esc(e.body)}</p></section>`).join("")}</div>
    <section class="panel" style="margin-top:16px">
      <h2 class="display">Postura na mesa</h2>
      ${f.posture.map((p) => line(p, false)).join("")}
    </section>
  `;
}

function renderFaixasFull() {
  const current = faixaFor(state.named);
  const lang = typeof SMART_MONEY_LANG !== "undefined" ? SMART_MONEY_LANG : null;
  return `
    ${head("Interno · nunca ler em voz alta como tabela", "O número compra responsabilidade.", "R$ 3 mil não é R$ 17 mil de obra. Descubra o nível. Depois case com o recorte. Não anuncie o piso.")}
    <div class="grid">${FAIXAS.map((f) => {
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
};

function render() {
  renderShell();
  const page = document.getElementById("page");
  if (!page) return;
  const fn = VIEWS[view] || renderMesa;
  page.innerHTML = fn();
  save();
}

render();
