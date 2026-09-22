const STORE = "ah-caixa-vilas-v1";

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE) || "{}"); }
  catch { return {}; }
}
function saveStore(s) { localStorage.setItem(STORE, JSON.stringify(s)); }

const db = loadStore();
if (!db.status) db.status = {};
if (!db.extra) db.extra = [];
if (!db.notes) db.notes = {};

function shops() {
  const all = CAIXA_SHOPS.concat(db.extra);
  return all.slice().sort((a, b) => {
    const ha = a.hot ? 1 : 0;
    const hb = b.hot ? 1 : 0;
    if (hb !== ha) return hb - ha;
    return 0;
  });
}
function statusOf(id) { return db.status[id] || "mapa"; }
function setStatus(id, st) { db.status[id] = st; saveStore(db); render(); }
function catLabel(id) {
  const c = CAIXA_CATS.find((x) => x.id === id);
  return c ? c.t : id;
}
function stLabel(id) {
  const s = CAIXA_STATUS.find((x) => x.id === id);
  return s ? s.t : id;
}
function pieceOf(id) {
  return CAIXA_OFFER.pieces.find((p) => p.id === id) || { t: id, kid: "" };
}

let filterCat = "all";
let filterSt = "all";
let q = "";
let openId = null;
let showMode = false;

function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.hidden = false;
  t.textContent = msg;
  clearTimeout(toast._);
  toast._ = setTimeout(() => { t.hidden = true; }, 1400);
}
function copy(text) {
  navigator.clipboard.writeText(text).then(() => toast("Copiado"), () => toast("Não copiou"));
}

function counts() {
  const list = shops();
  const c = { total: list.length, sim: 0, porta: 0, falou: 0 };
  list.forEach((s) => {
    const st = statusOf(s.id);
    if (st === "sim") c.sim += 1;
    if (st === "porta" || st === "falou" || st === "mostrou") c.porta += 1;
    if (st === "falou" || st === "mostrou" || st === "proposta") c.falou += 1;
  });
  return c;
}

function visible() {
  const query = q.trim().toLowerCase();
  return shops().filter((s) => {
    if (filterCat !== "all" && s.cat !== filterCat) return false;
    if (filterSt !== "all" && statusOf(s.id) !== filterSt) return false;
    if (!query) return true;
    return (s.name + " " + s.where + " " + s.cat).toLowerCase().includes(query);
  });
}

function renderHoje() {
  const doors = document.getElementById("hojeDoors");
  const recorte = document.getElementById("hojeRecorte");
  const beats = document.getElementById("hojeBeats");
  const never = document.getElementById("hojeNever");
  if (!doors || typeof CAIXA_HOJE === "undefined") return;
  doors.innerHTML = CAIXA_HOJE.map((d) =>
    `<article class="door">
      <p class="meta">${esc(d.label)}</p>
      <h3>${esc(d.name)}</h3>
      <p>${esc(d.why)}</p>
      <p class="act"><strong>Agora:</strong> ${esc(d.act)}</p>
      <p>${esc(d.tone)}</p>
      <div class="row">
        <a class="btn gold" href="${esc(d.demo)}">Abrir demo</a>
        <button type="button" class="btn" data-open="${esc(d.id)}">Ficha</button>
      </div>
    </article>`
  ).join("");
  if (recorte && typeof CAMPO_CLOSE !== "undefined") {
    recorte.innerHTML = `<b>${esc(CAMPO_CLOSE.title)}</b>
      <p>${esc(CAMPO_CLOSE.recorte.line)}</p>
      <p>${esc(CAMPO_CLOSE.recorte.market)} ${esc(CAMPO_CLOSE.recorte.ciclo)}</p>
      <div class="row">
        <button type="button" class="btn" data-copy-recorte>Copiar recorte</button>
      </div>`;
  }
  if (beats && CAMPO_CLOSE) {
    beats.innerHTML = CAMPO_CLOSE.beats.map((b) =>
      `<li><span class="n">${esc(b.n)}</span><div><strong>${esc(b.t)}</strong><span>${esc(b.d)}</span></div></li>`
    ).join("");
  }
  if (never && CAMPO_CLOSE) {
    never.innerHTML = CAMPO_CLOSE.never.map((n) => `<li>${esc(n)}</li>`).join("");
  }
}

function render() {
  document.body.classList.toggle("show", showMode);
  const c = counts();
  document.getElementById("statTotal").textContent = String(c.total);
  document.getElementById("statPorta").textContent = String(c.porta);
  document.getElementById("statSim").textContent = String(c.sim);
  document.getElementById("btnShow").classList.toggle("on", showMode);

  const list = visible();
  const root = document.getElementById("list");
  if (!list.length) {
    root.innerHTML = `<p class="empty">Nada neste filtro. Muda a categoria ou adiciona um comércio.</p>`;
  } else {
    root.innerHTML = list.map((s) => {
      const st = statusOf(s.id);
      return `<button type="button" class="card${s.hot ? " hot" : ""}" data-open="${s.id}">
        <div class="meta">${s.hot ? "Porta quente · " : ""}${catLabel(s.cat)} · ${s.where}</div>
        <h3>${esc(s.name)}</h3>
        <p class="where">${s.draft ? "Ainda sem nome de fachada — completar na rua." : esc(s.gap)}</p>
        <p class="kid">${esc(caixaKid(s.cat))}</p>
        <span class="st ${st}">${esc(stLabel(st))}</span>
      </button>`;
    }).join("");
  }
  renderSheet();
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;");
}

function renderSheet() {
  const d = document.getElementById("drawer");
  const s = shops().find((x) => x.id === openId);
  if (!s) { d.classList.remove("on"); return; }
  d.classList.add("on");
  const st = statusOf(s.id);
  const build = (s.build || []).map((id) => {
    const p = pieceOf(id);
    return `<span>${esc(p.t)}</span>`;
  }).join("");
  const kids = (s.build || []).map((id) => {
    const p = pieceOf(id);
    return `<li><strong>${esc(p.t)}.</strong> ${esc(p.kid)}</li>`;
  }).join("");
  const statuses = CAIXA_STATUS.map((x) =>
    `<button type="button" class="btn ${st === x.id ? "gold" : "ghost"}" data-st="${x.id}">${esc(x.t)}</button>`
  ).join("");
  const extra = [
    s.relation ? `<p class="hint"><strong>Relação:</strong> ${esc(s.relation)}</p>` : "",
    s.insta ? `<p class="hint">${esc(s.insta)}</p>` : "",
    s.demo ? `<div class="row"><a class="btn gold" href="${esc(s.demo)}">Abrir demo no notebook</a></div>` : ""
  ].join("");
  document.getElementById("sheet").innerHTML = `
    <p class="kicker">${s.hot ? "Porta quente · " : ""}${esc(catLabel(s.cat))} · ${esc(s.where)}</p>
    <h2>${esc(s.name)}</h2>
    <p class="kid">${esc(caixaKid(s.cat))}</p>
    <p class="hint">${esc(s.gap)}</p>
    ${extra}
    <div class="build">${build}</div>
    ${showMode ? `<ol class="script" style="list-style:decimal;padding-left:18px;gap:10px">${kids}</ol>
      <p class="hint">${esc(CAIXA_OFFER.not[1])} ${esc(CAIXA_OFFER.not[3])}</p>` : `
      <p class="hint"><strong>Próximo:</strong> ${esc(s.next)}</p>
      <p class="kicker" style="margin-top:18px">Andamento</p>
      <div class="row">${statuses}</div>
      <div class="row">
        <button type="button" class="btn gold" data-copy-script>Copiar fala de 90s</button>
        <button type="button" class="btn" data-copy-wa>Copiar WhatsApp</button>
        <a class="btn" href="${LEGADO_URL}" target="_blank" rel="noopener">Abrir Legado</a>
      </div>`}
    <div class="row"><button type="button" class="btn ghost" data-close>Fechar</button></div>
  `;
}

function addShop(ev) {
  ev.preventDefault();
  const f = ev.target;
  const name = f.name.value.trim();
  if (!name) return;
  const item = {
    id: "x-" + Date.now(),
    name,
    cat: f.cat.value,
    where: f.where.value.trim() || "Vilas do Atlântico",
    gap: f.gap.value.trim() || "Mapear na porta: nome oficial, Instagram, quem decide.",
    build: ["site", "google", "posts", "whats"],
    next: "Entrar. Pedir quem manda. Mostrar a tela."
  };
  db.extra.push(item);
  db.status[item.id] = "mapa";
  saveStore(db);
  f.reset();
  openId = item.id;
  toast("Comércio no mapa");
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  const catBox = document.getElementById("cats");
  catBox.innerHTML = `<button type="button" class="chip on" data-cat="all">Tudo</button>` +
    CAIXA_CATS.map((c) => `<button type="button" class="chip" data-cat="${c.id}">${esc(c.t)}</button>`).join("");
  const stBox = document.getElementById("sts");
  stBox.innerHTML = `<button type="button" class="chip on" data-st="all">Qualquer status</button>` +
    CAIXA_STATUS.map((s) => `<button type="button" class="chip" data-st="${s.id}">${esc(s.t)}</button>`).join("");
  const sel = document.getElementById("newCat");
  sel.innerHTML = CAIXA_CATS.map((c) => `<option value="${c.id}">${esc(c.t)}</option>`).join("");
  document.getElementById("offerPieces").innerHTML = CAIXA_OFFER.pieces.map((p) =>
    `<div class="piece"><b>${esc(p.t)}</b><p>${esc(p.kid)}</p></div>`
  ).join("");
  document.getElementById("offerScript").innerHTML = CAIXA_OFFER.script90.map((l) =>
    `<button type="button" class="line" data-copy="${esc(l)}"><span>${esc(l)}</span><i>copiar</i></button>`
  ).join("");
  renderHoje();
  render();
});

document.addEventListener("click", (e) => {
  const cat = e.target.closest("[data-cat]");
  if (cat) {
    filterCat = cat.getAttribute("data-cat");
    document.querySelectorAll("#cats .chip").forEach((n) => n.classList.toggle("on", n === cat));
    render();
    return;
  }
  const stf = e.target.closest("#sts [data-st]");
  if (stf && !stf.closest("#sheet")) {
    filterSt = stf.getAttribute("data-st");
    document.querySelectorAll("#sts .chip").forEach((n) => n.classList.toggle("on", n === stf));
    render();
    return;
  }
  if (e.target.closest("[data-copy-recorte]") && typeof CAMPO_CLOSE !== "undefined") {
    copy(CAMPO_CLOSE.recorte.line + "\n" + CAMPO_CLOSE.recorte.ciclo);
    return;
  }
  const open = e.target.closest("[data-open]");
  if (open) { openId = open.getAttribute("data-open"); render(); return; }
  if (e.target.closest("[data-close]") || e.target.id === "drawer") { openId = null; render(); return; }
  const st = e.target.closest("#sheet [data-st]");
  if (st && openId) { setStatus(openId, st.getAttribute("data-st")); return; }
  if (e.target.closest("[data-copy-script]")) { copy(CAIXA_OFFER.script90.join("\n")); return; }
  if (e.target.closest("[data-copy-wa]")) { copy(PACK_VILAS.whatsapp); return; }
  const line = e.target.closest("[data-copy]");
  if (line) { copy(line.getAttribute("data-copy")); return; }
  if (e.target.closest("#btnShow")) { showMode = !showMode; render(); return; }
});

document.addEventListener("input", (e) => {
  if (e.target.id === "q") { q = e.target.value; render(); }
});

document.addEventListener("submit", (e) => {
  if (e.target.id === "addForm") addShop(e);
});
