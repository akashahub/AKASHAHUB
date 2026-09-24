const TYPE_LABEL = {
  hook: "Gancho 3s",
  open: "Abertura",
  dev: "Desenvolvimento",
  micro: "Micro-gancho",
  apply: "Aplicação",
  payoff: "Payoff",
  close: "Ponte",
};

const state = {
  series: null,
  ep: -1,
  line: 0,
  reading: false,
  started: 0,
  elapsed: 0,
  timer: 0,
  mirror: localStorage.getItem("akasha-tp-mirror") === "1",
  size: Number(localStorage.getItem("akasha-tp-size")) || (matchMedia("(max-width:700px)").matches ? 34 : 52),
};

const app = document.getElementById("app");

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rich(value) {
  return esc(value)
    .split("*")
    .map((part, index) => (index % 2 ? "<em class=\"em\">" + part + "</em>" : part))
    .join("");
}

function linesOf(ep) {
  const out = [];
  (ep.blocks || []).forEach((block) => {
    (block.lines || []).forEach((line) => out.push(line));
  });
  return out;
}

function analyze(ep) {
  const lines = linesOf(ep);
  const words = lines.join(" ").replace(/\*/g, " ").trim().split(/\s+/).filter(Boolean);
  const sec = Math.round((words.length / 120) * 60 + Math.max(0, lines.length - 1) * 0.55);
  return { words: words.length, lines: lines.length, sec };
}

function clock(sec) {
  const m = Math.floor(Math.max(0, sec) / 60);
  const s = Math.max(0, sec) % 60;
  return m + ":" + String(s).padStart(2, "0");
}

function episode() {
  return state.series.episodes[state.ep];
}

function gravadoKey(id) {
  return "akasha-gravado:" + state.series.slug + ":" + id;
}

function routeFromHash() {
  const id = decodeURIComponent(location.hash.replace("#", ""));
  const index = state.series.episodes.findIndex((ep) => ep.id === id);
  state.ep = index;
  paint();
}

function setHash() {
  const next = state.ep < 0 ? "#visao" : "#" + episode().id;
  if (location.hash !== next) history.replaceState(null, "", next);
}

function paint() {
  if (state.reading) return;
  const series = state.series;
  const nav = [
    "<button data-act=\"ep\" data-id=\"visao\" class=\"" + (state.ep < 0 ? "on" : "") + "\">Visão geral</button>",
  ];
  series.episodes.forEach((ep) => {
    const on = state.ep >= 0 && episode().id === ep.id;
    const done = localStorage.getItem(gravadoKey(ep.id)) === "1";
    nav.push("<button data-act=\"ep\" data-id=\"" + esc(ep.id) + "\" class=\"" + (on ? "on" : "") + (done ? " done" : "") + "\">" + esc(ep.code || ep.id) + "</button>");
  });
  const read = state.ep < 0 ? "" : "<button class=\"go\" data-act=\"read\">Ler no teleprompter</button>";
  const header = state.ep < 0
    ? "<header class=\"top\">" +
      "<a class=\"back\" href=\"/roteiros/\">Biblioteca gratuita</a>" +
      "<p class=\"kicker\">" + esc(series.kicker || "Akasha Hub") + "</p>" +
      "<h1>" + esc(series.title || "") + "</h1>" +
      "<p class=\"sub\">" + esc(series.subtitle || "") + "</p>" +
      "<div class=\"pills\">" + (series.pills || []).map((pill) => "<span class=\"pill\">" + esc(pill) + "</span>").join("") + "</div>" +
      "</header>"
    : "<header class=\"top top-compact\">" +
      "<a class=\"back\" href=\"/roteiros/\">Biblioteca gratuita</a>" +
      "<p class=\"kicker\">" + esc(String(series.title || "").replace(/\n/g, " ")) + "</p>" +
      "</header>";
  app.innerHTML =
    header +
    "<nav class=\"ep-nav\"><div class=\"ep-scroll\">" + nav.join("") + "</div>" + read + "</nav>" +
    "<main class=\"main\">" + (state.ep < 0 ? overview() : studio()) + "</main>";
  setHash();
}

function overview() {
  const series = state.series;
  const look = (series.look || []).map((item) => "<p><strong>" + esc(item.k) + ".</strong> " + esc(item.v) + "</p>").join("");
  const cards = series.episodes.map((ep) => {
    const stat = analyze(ep);
    return "<button class=\"grid-card\" data-act=\"ep\" data-id=\"" + esc(ep.id) + "\"><b>" + esc(ep.code || "") + "</b><span><strong>" + esc(ep.title) + "</strong><em>" + esc(ep.hook || "") + " · " + clock(stat.sec) + "</em></span></button>";
  }).join("");
  return (
    "<p class=\"ep-num\">Visão geral da série</p>" +
    "<h2 class=\"ep-title\">" + series.episodes.length + " vídeos.\nUma leitura só.</h2>" +
    "<div class=\"panel\"><p class=\"label\">" + esc(series.logicTitle || "A lógica da série") + "</p><p>" + esc(series.logic || "") + "</p></div>" +
    (look ? "<div class=\"panel look\"><p class=\"label\">Olhar da série</p>" + look + "</div>" : "") +
    "<div class=\"cards\">" + cards + "</div>"
  );
}

function dockTime() {
  const stat = analyze(episode());
  const inside = stat.sec >= 180 && stat.sec <= 360;
  return clock(stat.sec) + " · " + stat.words + " palavras" + (inside ? " · dentro de 3 a 6 min" : " · fora da faixa");
}

function studio() {
  const ep = episode();
  const stat = analyze(ep);
  const tags = (ep.tags || []).map((tag) => "<span class=\"tag " + esc(tag.k || "") + "\">" + esc(tag.t) + "</span>").join("");
  const rail = (ep.blocks || []).map((block) => "<span><b>" + esc(block.time || "") + "</b>" + esc(block.label || TYPE_LABEL[block.type] || block.type) + "</span>").join("");
  const blocks = (ep.blocks || []).map((block) => {
    const say = (block.lines || []).map((line) => "<p>" + rich(line) + "</p>").join("");
    return "<article class=\"block " + esc(block.type || "") + "\"><header><span>" + esc(block.label || TYPE_LABEL[block.type] || "") + "</span><span>" + esc(block.time || "") + "</span></header><div class=\"say\">" + say + "</div>" + (block.dir ? "<p class=\"dir\">" + esc(block.dir) + "</p>" : "") + "</article>";
  }).join("");
  const visual = (ep.visual || []).map((item) => "<p><strong>" + esc(item.k) + ".</strong> " + esc(item.v) + "</p>").join("");
  const titles = (ep.titles || []).map((item) => "<p>" + esc(item) + "</p>").join("");
  const fontes = (ep.fontes || []).map((item) => "<p>" + esc(item) + "</p>").join("");
  const extra =
    (titles ? "<div class=\"panel\"><p class=\"label\">Três títulos</p>" + titles + "</div>" : "") +
    (ep.short ? "<div class=\"panel\"><p class=\"label\">Corte curto</p><p>" + esc(ep.short) + "</p></div>" : "") +
    (fontes ? "<div class=\"panel\"><p class=\"label\">Fontes</p>" + fontes + "</div>" : "");
  const done = localStorage.getItem(gravadoKey(ep.id)) === "1";
  return (
    "<p class=\"ep-num\">" + esc(ep.num || "") + "</p>" +
    "<h2 class=\"ep-title\">" + esc(ep.title || "") + "</h2>" +
    "<p class=\"deck\">" + esc(ep.hook || "") + "</p>" +
    "<div class=\"tags\">" + tags + "</div>" +
    "<p class=\"runtime\">" + dockTime() + "</p>" +
    "<div class=\"panel\"><p class=\"label\">Conceito central</p><p>" + esc(ep.concept || "") + "</p></div>" +
    "<div class=\"panel thumb\"><p class=\"label\">Thumbnail e título</p><p><strong>Título.</strong> " + esc(ep.thumb?.title || "") + "</p><p><strong>Imagem.</strong> " + esc(ep.thumb?.visual || "") + "</p><p><strong>Texto.</strong> " + esc(ep.thumb?.text || "") + "</p></div>" +
    "<div class=\"panel\"><p class=\"label\">Descrição para colar</p><p>" + esc(ep.desc || "") + "</p></div>" +
    "<div class=\"actions\">" +
    "<button class=\"ghost\" data-act=\"copy\">Copiar fala</button>" +
    "<button class=\"ghost\" data-act=\"copy-desc\">Copiar descrição</button>" +
    "<button class=\"ghost" + (done ? " on" : "") + "\" data-act=\"gravado\">" + (done ? "Marcado como gravado" : "Marcar como gravado") + "</button>" +
    "</div>" +
    "<div class=\"panel\"><p class=\"label\">Mapa de retenção · " + clock(stat.sec) + "</p><div class=\"rail\">" + rail + "</div></div>" +
    "<p class=\"script-label\">Fala por pilares · a direção não entra na boca</p>" +
    blocks +
    extra +
    "<aside class=\"phrase\"><p class=\"label\">Frase salva</p><p>«" + esc(ep.phrase || "") + "»</p></aside>" +
    "<div class=\"panel look\"><p class=\"label\">Direção visual</p>" + visual + "</div>"
  );
}

function ensureReader() {
  let reader = document.getElementById("reader");
  if (reader) return reader;
  reader = document.createElement("div");
  reader.id = "reader";
  reader.hidden = true;
  reader.innerHTML =
    "<div class=\"reader-bar\">" +
    "<button class=\"icon-btn\" data-act=\"close\">Fechar</button>" +
    "<div class=\"reader-title\"></div>" +
    "<div class=\"reader-clock\"></div>" +
    "<button class=\"icon-btn\" data-act=\"smaller\">A−</button>" +
    "<button class=\"icon-btn\" data-act=\"larger\">A+</button>" +
    "<button class=\"icon-btn\" data-act=\"mirror\">Espelho</button>" +
    "<button class=\"icon-btn\" data-act=\"restart\">Recomeçar</button>" +
    "</div>" +
    "<div class=\"reader-scroll\" tabindex=\"0\"></div>" +
    "<div class=\"reader-foot\">Espaço ou seta avança o bloco. A linha acesa fica no terço de cima, perto da lente. Não leia o rodapé. A direção ficou no estúdio.</div>";
  document.body.appendChild(reader);
  return reader;
}

function openReader() {
  if (state.ep < 0) return;
  const reader = ensureReader();
  const ep = episode();
  const lines = linesOf(ep);
  reader.querySelector(".reader-title").textContent = ep.title || "";
  const scroll = reader.querySelector(".reader-scroll");
  scroll.classList.toggle("mirror", state.mirror);
  scroll.style.setProperty("--read", state.size + "px");
  scroll.innerHTML = lines.map((line, index) => "<p class=\"reader-line" + (index === 0 ? " on" : index === 1 ? " next" : "") + "\" data-i=\"" + index + "\">" + rich(line) + "</p>").join("");
  reader.hidden = false;
  document.body.style.overflow = "hidden";
  state.reading = true;
  state.line = 0;
  state.elapsed = 0;
  state.started = performance.now();
  clearInterval(state.timer);
  state.timer = setInterval(tick, 250);
  tick();
  requestAnimationFrame(() => focusLine(0, false));
  scroll.focus();
}

function closeReader() {
  const reader = document.getElementById("reader");
  if (reader) reader.hidden = true;
  document.body.style.overflow = "";
  state.reading = false;
  clearInterval(state.timer);
  paint();
}

function tick() {
  const reader = document.getElementById("reader");
  if (!reader || reader.hidden) return;
  state.elapsed = Math.floor((performance.now() - state.started) / 1000);
  const stat = analyze(episode());
  const node = reader.querySelector(".reader-clock");
  node.textContent = "take " + clock(state.elapsed) + " · roteiro " + clock(stat.sec);
  node.classList.toggle("long", state.elapsed > 360);
}

function focusLine(index, smooth) {
  const scroll = document.querySelector(".reader-scroll");
  if (!scroll) return;
  const nodes = [...scroll.querySelectorAll(".reader-line")];
  if (!nodes.length) return;
  state.line = Math.max(0, Math.min(index, nodes.length - 1));
  nodes.forEach((node, i) => {
    node.classList.toggle("on", i === state.line);
    node.classList.toggle("next", i === state.line + 1);
  });
  const el = nodes[state.line];
  const top = el.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop - scroll.clientHeight * 0.22;
  scroll.scrollTo({ top, behavior: smooth === false ? "auto" : "smooth" });
}

function step(delta) {
  focusLine(state.line + delta, true);
}

function copyText(text) {
  const done = () => {
    const button = document.querySelector("[data-act=\"copy\"], [data-act=\"copy-desc\"]");
    if (!button) return;
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
  flash("Copiado");
}

function fallbackCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

function flash(message) {
  const dock = document.querySelector(".runtime");
  if (!dock || state.reading) return;
  const previous = dock.textContent;
  dock.textContent = message;
  setTimeout(() => { if (dock.textContent === message) dock.textContent = previous; }, 1200);
}

function spoken() {
  return linesOf(episode()).map((line) => line.replace(/\*/g, "")).join("\n\n");
}

function description() {
  const ep = episode();
  return (ep.thumb?.title || ep.title) + "\n\n" + (ep.desc || "") + "\n\n" + (ep.phrase || "");
}

function setSize(next) {
  state.size = Math.max(28, Math.min(84, next));
  localStorage.setItem("akasha-tp-size", String(state.size));
  const scroll = document.querySelector(".reader-scroll");
  if (scroll) scroll.style.setProperty("--read", state.size + "px");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-act]");
  if (!target) return;
  const act = target.dataset.act;
  if (act === "ep") {
    const id = target.dataset.id;
    state.ep = id === "visao" ? -1 : state.series.episodes.findIndex((ep) => ep.id === id);
    if (state.reading) closeReader();
    else paint();
    window.scrollTo(0, 0);
  }
  if (act === "read") openReader();
  if (act === "close") closeReader();
  if (act === "copy") copyText(spoken());
  if (act === "copy-desc") copyText(description());
  if (act === "gravado") {
    const key = gravadoKey(episode().id);
    localStorage.setItem(key, localStorage.getItem(key) === "1" ? "0" : "1");
    paint();
  }
  if (act === "smaller") setSize(state.size - 4);
  if (act === "larger") setSize(state.size + 4);
  if (act === "mirror") {
    state.mirror = !state.mirror;
    localStorage.setItem("akasha-tp-mirror", state.mirror ? "1" : "0");
    document.querySelector(".reader-scroll")?.classList.toggle("mirror", state.mirror);
  }
  if (act === "restart") {
    state.started = performance.now();
    focusLine(0, false);
    tick();
  }
});

document.addEventListener("keydown", (event) => {
  if (!state.reading) return;
  const key = event.key;
  if (key === " " || key === "ArrowDown" || key === "ArrowRight") {
    event.preventDefault();
    step(event.shiftKey ? -1 : 1);
  } else if (key === "ArrowUp" || key === "ArrowLeft" || key === "Backspace") {
    event.preventDefault();
    step(-1);
  } else if (key === "Escape") {
    closeReader();
  } else if (key === "+" || key === "=") {
    setSize(state.size + 4);
  } else if (key === "-" || key === "_") {
    setSize(state.size - 4);
  } else if (key === "m" || key === "M") {
    document.querySelector("[data-act=\"mirror\"]")?.click();
  } else if (key === "Home") {
    event.preventDefault();
    focusLine(0, false);
  }
});

async function boot() {
  const url = document.body.dataset.series;
  if (!url) return;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(String(response.status));
    state.series = await response.json();
  } catch (error) {
    app.innerHTML = "<p class=\"fail\">Não abri o roteiro. Confere se o arquivo da série está em /roteiros/series.</p>";
    return;
  }
  routeFromHash();
  window.addEventListener("hashchange", routeFromHash);
}

boot();
