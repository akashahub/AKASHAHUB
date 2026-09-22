const STORE = "sp-cart-v1";
const WA = "https://wa.me/" + SHOP.wa;

function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORE) || "{}"); }
  catch { return {}; }
}
function saveCart(c) { localStorage.setItem(STORE, JSON.stringify(c)); }

let cart = loadCart();
let filter = "all";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;");
}

function brl(n) {
  return "R$ " + Number(n).toFixed(0);
}

function lines() {
  return Object.entries(cart).map(([id, q]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return p && q > 0 ? { ...p, q } : null;
  }).filter(Boolean);
}

function count() { return lines().reduce((a, x) => a + x.q, 0); }
function total() { return lines().reduce((a, x) => a + x.q * x.price, 0); }

function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(toast._);
  toast._ = setTimeout(() => t.classList.remove("on"), 1400);
}

function add(id, d) {
  const n = (cart[id] || 0) + d;
  if (n <= 0) delete cart[id];
  else cart[id] = n;
  saveCart(cart);
  render();
  if (d > 0) toast("Entrou no pedido");
}

function waPedido() {
  const list = lines();
  if (!list.length) return;
  const body = [
    "Oi, Se Plante. Pedido pela casa digital:",
    "",
    ...list.map((x) => "• " + x.q + "× " + x.name + " (" + brl(x.price) + ")"),
    "",
    "Total: " + brl(total()),
    "",
    "Retiro na loja. Confirma o que tiver hoje no balcão."
  ].join("\n");
  window.open(WA + "?text=" + encodeURIComponent(body), "_blank", "noopener");
}

function waAgenda(ev) {
  ev.preventDefault();
  const f = ev.target;
  const body = [
    "Oi, Se Plante. Quero uma mesa.",
    "",
    "Nome: " + f.nome.value.trim(),
    "Quando: " + f.quando.value,
    "Pessoas: " + f.pessoas.value,
    "Pra quê: " + f.pra.value,
    f.nota.value.trim() ? "Nota: " + f.nota.value.trim() : ""
  ].filter(Boolean).join("\n");
  window.open(WA + "?text=" + encodeURIComponent(body), "_blank", "noopener");
}

function renderCatalog() {
  const root = document.getElementById("catalog");
  const list = PRODUCTS.filter((p) => filter === "all" || p.cat === filter);
  if (!list.length) {
    root.innerHTML = "<p class='empty'>Nada nesta prateleira hoje.</p>";
    return;
  }
  root.innerHTML = list.map((p) => `
    <article class="card">
      <img src="${esc(p.img)}" alt="${esc(p.name)}" width="640" height="640"/>
      <div class="body">
        <p class="meta">${esc((CATS.find((c) => c.id === p.cat) || {}).t || p.cat)}</p>
        <h3>${esc(p.name)}</h3>
        <p class="kid">${esc(p.kid)}</p>
        <div class="buy">
          <span class="price">${brl(p.price)}</span>
          <button type="button" class="plus" data-add="${esc(p.id)}" aria-label="Pôr ${esc(p.name)} no pedido">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const n = count();
  const badge = document.getElementById("cartN");
  if (badge) {
    badge.textContent = n ? String(n) : "";
    badge.setAttribute("data-n", String(n));
  }
  const box = document.getElementById("cartItems");
  const list = lines();
  if (!box) return;
  if (!list.length) {
    box.innerHTML = "<p class='empty'>O pedido ainda está vazio. Escolhe no catálogo.</p>";
  } else {
    box.innerHTML = list.map((x) => `
      <div class="item">
        <img src="${esc(x.img)}" alt=""/>
        <div>
          <b>${esc(x.name)}</b>
          <i>${brl(x.price)}</i>
        </div>
        <div class="qty">
          <button type="button" data-add="${esc(x.id)}" data-d="-1" aria-label="menos">−</button>
          <span>${x.q}</span>
          <button type="button" data-add="${esc(x.id)}" data-d="1" aria-label="mais">+</button>
        </div>
      </div>
    `).join("");
  }
  const tot = document.getElementById("cartTotal");
  if (tot) tot.textContent = brl(total());
  const go = document.getElementById("cartGo");
  if (go) go.disabled = !list.length;
}

function render() {
  renderCatalog();
  renderCart();
}

function setDrawer(on) {
  document.getElementById("drawer").classList.toggle("on", on);
}

document.addEventListener("DOMContentLoaded", () => {
  const chips = document.getElementById("cats");
  chips.innerHTML = CATS.map((c) =>
    `<button type="button" class="chip${c.id === "all" ? " on" : ""}" data-cat="${c.id}">${esc(c.t)}</button>`
  ).join("");
  const wa = document.getElementById("waFloat");
  if (wa) wa.href = WA + "?text=" + encodeURIComponent("Oi, Se Plante. Vim pela casa digital.");
  render();
});

document.addEventListener("click", (e) => {
  const cat = e.target.closest("[data-cat]");
  if (cat) {
    filter = cat.getAttribute("data-cat");
    document.querySelectorAll("#cats .chip").forEach((n) => n.classList.toggle("on", n === cat));
    renderCatalog();
    return;
  }
  const addBtn = e.target.closest("[data-add]");
  if (addBtn) {
    const d = Number(addBtn.getAttribute("data-d") || "1");
    add(addBtn.getAttribute("data-add"), d);
    return;
  }
  if (e.target.closest("[data-open-cart]")) { setDrawer(true); return; }
  if (e.target.closest("[data-close-cart]") || e.target.id === "drawer") { setDrawer(false); return; }
  if (e.target.closest("#cartGo")) { waPedido(); return; }
});

document.addEventListener("submit", (e) => {
  if (e.target.id === "agendaForm") waAgenda(e);
});
