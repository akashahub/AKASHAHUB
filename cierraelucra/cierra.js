const STORE = "ah-cierra-lucra-v1";

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE) || "{}"); }
  catch { return {}; }
}
function saveStore(s) { localStorage.setItem(STORE, JSON.stringify(s)); }
const db = loadStore();
if (!db.status) db.status = {};

let filterCountry = "all";
let filterCity = "all";
let filterSistema = "all";
let q = "";
let openId = null;
let limpia = false;
let notas = true;

function digits(s) { return String(s || "").replace(/\D/g, ""); }
function pretty(d) {
  d = digits(d);
  if (d.startsWith("34") && d.length === 11) {
    const n = d.slice(2);
    return "+34 " + n.slice(0, 3) + " " + n.slice(3, 6) + " " + n.slice(6);
  }
  if (d.startsWith("521") && d.length === 13) {
    const n = d.slice(3);
    return "+52 " + n.slice(0, 2) + " " + n.slice(2, 6) + " " + n.slice(6);
  }
  if (d.startsWith("52") && d.length === 12) {
    const n = d.slice(2);
    return "+52 " + n.slice(0, 2) + " " + n.slice(2, 6) + " " + n.slice(6);
  }
  if (d.startsWith("56") && d.length === 11) {
    const n = d.slice(2);
    return "+56 " + n.slice(0, 1) + " " + n.slice(1, 5) + " " + n.slice(5);
  }
  return d ? "+" + d : "";
}
function waLink(d) {
  let n = digits(d);
  return "https://wa.me/" + n;
}
function foneLine(p) {
  if (p.wa) return "WhatsApp " + pretty(p.wa) + (p.waNote ? " · " + p.waNote : "");
  if (p.cel) return "Móvil " + pretty(p.cel) + " · no confirmé WhatsApp";
  if (p.tel) return "Teléfono " + pretty(p.tel) + " · no es WhatsApp";
  if (p.email) return "Sin WhatsApp público · " + p.email;
  return "Sin número público";
}
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;");
}
function toast(msg) {
  const t = document.getElementById("toast");
  t.hidden = false;
  t.textContent = msg;
  clearTimeout(toast._);
  toast._ = setTimeout(() => { t.hidden = true; }, 1400);
}
function copy(text) {
  navigator.clipboard.writeText(text).then(() => toast("Copiado"), () => toast("No copió"));
}
function statusOf(id) { return db.status[id] || "mapa"; }
function setStatus(id, st) { db.status[id] = st; saveStore(db); render(); }
function stLabel(id) {
  const s = CIERRA_STATUS.find((x) => x.id === id);
  return s ? s.t : id;
}
function uniq(list) {
  return list.filter((x, i) => list.indexOf(x) === i);
}
function piezaHref(o) {
  const q = new URLSearchParams({
    nombre: o.nombre || "",
    ciudad: o.ciudad || "",
    sistema: o.sistema || "academy",
    falta: o.falta || "",
    has: o.has || ""
  });
  return "pieza/index.html?" + q.toString();
}
function visible() {
  const query = q.trim().toLowerCase();
  return CIERRA_PLACES.filter((p) => {
    if (filterCountry !== "all" && p.country !== filterCountry) return false;
    if (filterCity !== "all" && p.city !== filterCity) return false;
    if (filterSistema !== "all" && p.sistema !== filterSistema) return false;
    if (!query) return true;
    return (p.name + " " + p.city + " " + p.country + " " + p.where + " " + p.cat).toLowerCase().includes(query);
  });
}
function counts() {
  const c = { total: CIERRA_PLACES.length, llame: 0, cerro: 0 };
  CIERRA_PLACES.forEach((p) => {
    const st = statusOf(p.id);
    if (st === "llame" || st === "mostre" || st === "propuesta") c.llame += 1;
    if (st === "cerro") c.cerro += 1;
  });
  return c;
}

function renderStatic() {
  document.getElementById("sistemas").innerHTML = CIERRA_SISTEMAS.map((s) =>
    `<button type="button" class="sys${filterSistema === s.id ? " on" : ""}" data-sys="${s.id}">
      <b>${esc(s.t)}</b><span>${esc(s.kid)}</span>
    </button>`
  ).join("");
  document.getElementById("beats").innerHTML = CIERRA_BEATS.map((b) =>
    `<li><span class="n">${esc(b.n)}</span><strong>${esc(b.t)}</strong><span>${esc(b.d)}</span></li>`
  ).join("");
  document.getElementById("prueba").innerHTML = CIERRA_PRUEBA.map((p) =>
    `<a href="${esc(p.href)}" target="_blank" rel="noopener"><b>${esc(p.t)}</b><span>${esc(p.d)}</span></a>`
  ).join("");
  const countries = uniq(CIERRA_PLACES.map((p) => p.country));
  document.getElementById("paises").innerHTML =
    `<button type="button" class="chip${filterCountry === "all" ? " on" : ""}" data-country="all">Todo</button>` +
    countries.map((c) => `<button type="button" class="chip${filterCountry === c ? " on" : ""}" data-country="${esc(c)}">${esc(c)}</button>`).join("");
  const cities = uniq(CIERRA_PLACES.filter((p) => filterCountry === "all" || p.country === filterCountry).map((p) => p.city));
  document.getElementById("ciudades").innerHTML =
    `<button type="button" class="chip${filterCity === "all" ? " on" : ""}" data-city="all">Ciudades</button>` +
    cities.map((c) => `<button type="button" class="chip${filterCity === c ? " on" : ""}" data-city="${esc(c)}">${esc(c)}</button>`).join("");
  const sel = document.getElementById("sysSel");
  sel.innerHTML = CIERRA_SISTEMAS.map((s) => `<option value="${s.id}">${esc(s.t)}</option>`).join("");
  document.getElementById("faixaGrid").innerHTML = CIERRA_FAIXAS.map((f) =>
    `<article>
      <h3>${esc(f.t)}</h3>
      <p class="num">${esc(f.eur)} · ${esc(f.usd)}</p>
      <p>${esc(f.es)}</p>
      <p class="nota">${esc(f.nota)}</p>
    </article>`
  ).join("");
  document.getElementById("nunca").innerHTML = CIERRA_NUNCA.map((n) => `<li>${esc(n)}</li>`).join("");
  document.getElementById("lineaPrecio").textContent = CIERRA_LINEA_PRECIO;
}

function render() {
  document.body.classList.toggle("limpia", limpia);
  document.body.classList.toggle("notas", notas && !limpia);
  document.getElementById("btnLimpia").classList.toggle("on", limpia);
  document.getElementById("btnNotas").classList.toggle("on", notas);
  const c = counts();
  document.getElementById("statTotal").textContent = String(c.total);
  document.getElementById("statLlame").textContent = String(c.llame);
  document.getElementById("statCerro").textContent = String(c.cerro);
  renderStatic();
  const list = visible();
  const root = document.getElementById("list");
  if (!list.length) root.innerHTML = `<p class="empty">Nada en este filtro.</p>`;
  else {
    root.innerHTML = list.map((p) => {
      const sys = cierraSistema(p.sistema);
      const st = statusOf(p.id);
      return `<button type="button" class="card" data-open="${esc(p.id)}">
        <div class="meta">${esc(p.city)} · ${esc(p.country)}</div>
        <h3>${esc(p.name)}</h3>
        <p class="falta"><b class="tag">${esc(sys.t)}</b>${esc(p.falta)}</p>
        <p class="fone">${esc(foneLine(p))}</p>
        <span class="st ${st}">${esc(stLabel(st))}</span>
      </button>`;
    }).join("");
  }
  renderSheet();
}

function renderSheet() {
  const d = document.getElementById("drawer");
  const p = CIERRA_PLACES.find((x) => x.id === openId);
  if (!p) { d.classList.remove("on"); return; }
  d.classList.add("on");
  const sys = cierraSistema(p.sistema);
  const st = statusOf(p.id);
  const statuses = CIERRA_STATUS.map((x) =>
    `<button type="button" class="btn ${st === x.id ? "gold" : "ghost"}" data-st="${x.id}">${esc(x.t)}</button>`
  ).join("");
  const href = piezaHref({
    nombre: p.name, ciudad: p.city, sistema: p.sistema, falta: p.falta, has: p.has
  });
  const wa = p.wa
    ? `<a class="btn gold" href="${esc(waLink(p.wa) + "?text=" + encodeURIComponent(p.recado))}" target="_blank" rel="noopener">Abrir WhatsApp</a>`
    : "";
  const callNum = p.tel || p.cel || "";
  const call = callNum
    ? `<a class="btn" href="tel:+${digits(callNum)}">Llamar</a>`
    : "";
  const mail = p.email
    ? `<a class="btn" href="mailto:${esc(p.email)}?subject=${encodeURIComponent(p.name)}">Correo</a>`
    : "";
  document.getElementById("sheet").innerHTML = `
    <p class="kicker">${esc(p.city)} · ${esc(p.country)} · ${esc(p.cat)}</p>
    <h2>${esc(p.name)}</h2>
    <p class="hint">${esc(p.where)}</p>
    <p class="abre">${esc(p.abre)}</p>
    <p class="silencio">Silencio. Luego: ${esc(CIERRA_PREGUNTA)}</p>
    <p class="hint"><strong>Ya tienen:</strong> ${esc(p.has)}</p>
    <p class="hint"><strong>Falta:</strong> ${esc(p.falta)}</p>
    <p class="hint"><strong>Sistema:</strong> ${esc(sys.t)}. ${esc(sys.kid)}</p>
    <p class="fone">${esc(foneLine(p))}</p>
    <p class="nota">${esc(p.nota)}</p>
    ${limpia ? "" : `
      <div class="row">${statuses}</div>
      <div class="row">
        <button type="button" class="btn" data-copy-abre>Copiar lo que dices</button>
        <button type="button" class="btn" data-copy-preg>Copiar la pregunta</button>
        ${wa}${call}${mail}
        <a class="btn gold" href="${esc(href)}" target="_blank" rel="noopener">Abrir pieza con su nombre</a>
      </div>`}
    ${limpia ? `<div class="row"><a class="btn gold" href="${esc(href)}" target="_blank" rel="noopener">Abrir pieza</a></div>` : ""}
    <div class="row"><button type="button" class="btn ghost" data-close>Cerrar</button></div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pregunta").textContent = CIERRA_PREGUNTA;
  render();
});

document.addEventListener("click", (e) => {
  const country = e.target.closest("[data-country]");
  if (country) {
    filterCountry = country.getAttribute("data-country");
    filterCity = "all";
    render();
    return;
  }
  const city = e.target.closest("[data-city]");
  if (city) { filterCity = city.getAttribute("data-city"); render(); return; }
  const sys = e.target.closest("[data-sys]");
  if (sys) {
    const id = sys.getAttribute("data-sys");
    filterSistema = filterSistema === id ? "all" : id;
    render();
    return;
  }
  if (e.target.closest("#btnLimpia")) { limpia = !limpia; render(); return; }
  if (e.target.closest("#btnNotas")) { notas = !notas; render(); return; }
  if (e.target.closest("#pregunta")) { copy(CIERRA_PREGUNTA); return; }
  if (e.target.closest("[data-copy-precio]")) { copy(CIERRA_LINEA_PRECIO); return; }
  const open = e.target.closest("[data-open]");
  if (open) { openId = open.getAttribute("data-open"); render(); return; }
  if (e.target.closest("[data-close]") || e.target.id === "drawer") { openId = null; render(); return; }
  const st = e.target.closest("#sheet [data-st]");
  if (st && openId) { setStatus(openId, st.getAttribute("data-st")); return; }
  if (e.target.closest("[data-copy-abre]") && openId) {
    const p = CIERRA_PLACES.find((x) => x.id === openId);
    if (p) copy(p.abre);
    return;
  }
  if (e.target.closest("[data-copy-preg]")) { copy(CIERRA_PREGUNTA); return; }
});

document.addEventListener("input", (e) => {
  if (e.target.id === "q") { q = e.target.value; render(); }
});

document.addEventListener("submit", (e) => {
  if (e.target.id !== "armar") return;
  e.preventDefault();
  const f = e.target;
  const href = piezaHref({
    nombre: f.nombre.value.trim(),
    ciudad: f.ciudad.value.trim(),
    sistema: f.sistema.value,
    falta: f.falta.value.trim(),
    has: f.has.value.trim()
  });
  window.open(href, "_blank", "noopener");
});
