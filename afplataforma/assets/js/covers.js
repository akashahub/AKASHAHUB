/**
 * Capas e imagens editáveis — só o mentor troca no frontend.
 * Override fica neste aparelho (localStorage). Padrão = arquivos em assets/img/.
 */
import { isMentorSession } from "./auth.js";
import { Store } from "./storage.js";

const KEY = "covers_v2";
const LOJA_KEY = "loja_extra";

export const COVER_SLOTS = [
  { id: "dash", label: "Dashboard · head", fallback: "assets/img/lua/hero/lua-banner-dash.webp" },
  { id: "modules", label: "Módulos · head", fallback: "assets/img/lua/hero/lua-banner-leitura.webp" },
  { id: "module01", label: "Camada 1 · Fundação", fallback: "assets/img/capas/module01.jpg" },
  { id: "module02", label: "Camada 2 · Criativo", fallback: "assets/img/capas/module02.jpg" },
  { id: "module03", label: "Camada 3 · Execução", fallback: "assets/img/capas/module03.jpg" },
  { id: "module04", label: "Camada 4 · Relacional", fallback: "assets/img/capas/module04.jpg" },
  { id: "module05", label: "Camada 5 · Comunicação", fallback: "assets/img/capas/module05.jpg" },
  { id: "module06", label: "Camada 6 · Visão", fallback: "assets/img/capas/module06.jpg" },
  { id: "module07", label: "Camada 7 · Governança", fallback: "assets/img/capas/module07.jpg" },
  { id: "tools", label: "Ferramentas · head", fallback: "assets/img/lua/hero/lua-banner-tools.webp" },
  { id: "tool-cashflow", label: "Auditoria de Cash-Flow", fallback: "assets/img/lua/rosto/lua-face-01.webp" },
  { id: "tool-ideation", label: "Ideação / Insights", fallback: "assets/img/lua/rosto/lua-face-02.webp" },
  { id: "tool-execution", label: "Execução semanal", fallback: "assets/img/lua/rosto/lua-face-03.webp" },
  { id: "tool-network", label: "Mapa de rede", fallback: "assets/img/lua/rosto/lua-face-04.webp" },
  { id: "tool-pitch", label: "Pitch 60s", fallback: "assets/img/lua/rosto/lua-face-05.webp" },
  { id: "tool-fono", label: "Fono · Dicção", fallback: "assets/img/lua/rosto/lua-face-06.webp" },
  { id: "tool-vision", label: "Visão 1 página", fallback: "assets/img/lua/rosto/lua-face-02.webp" },
  { id: "tool-legacy", label: "Declaração de legado", fallback: "assets/img/lua/rosto/lua-face-01.webp" },
  { id: "call", label: "Call · head", fallback: "assets/img/lua/hero/lua-banner-tools.webp" },
  { id: "profile", label: "Perfil · head", fallback: "assets/img/lua/perfil/lua-perfil-01.webp" },
  { id: "complementar", label: "Complementar · head", fallback: "assets/img/lua/hero/lua-banner-comp.webp" },
  { id: "quitei", label: "Quitei · head", fallback: "assets/img/lua/hero/lua-banner-quitei.webp" },
  { id: "alimentacao", label: "Alimentação · head", fallback: "assets/img/capas/alimentacao.jpg" },
  { id: "ali-01", label: "Alimentação 01 · Estabilidade", fallback: "assets/img/capas/ali-01.jpg" },
  { id: "ali-02", label: "Alimentação 02 · Variedade", fallback: "assets/img/capas/ali-02.jpg" },
  { id: "ali-03", label: "Alimentação 03 · Combustível", fallback: "assets/img/capas/ali-03.jpg" },
  { id: "ali-04", label: "Alimentação 04 · Mesa", fallback: "assets/img/capas/ali-04.jpg" },
  { id: "ali-05", label: "Alimentação 05 · Voz", fallback: "assets/img/capas/ali-05.jpg" },
  { id: "ali-06", label: "Alimentação 06 · Planejar", fallback: "assets/img/capas/ali-06.jpg" },
  { id: "ali-07", label: "Alimentação 07 · Ritmo", fallback: "assets/img/capas/ali-07.jpg" },
  { id: "constelacao", label: "Constelação · head", fallback: "assets/img/capas/constelacao.jpg" },
  { id: "dicionario", label: "Dicionário · head", fallback: "assets/img/capas/dicionario.jpg" },
  { id: "livros", label: "Livros · head", fallback: "assets/img/capas/livros.jpg" },
  { id: "treino", label: "Treino · head", fallback: "assets/img/capas/treino.jpg" },
  { id: "treino-maq", label: "Treino com máquina · faixa", fallback: "assets/img/capas/treino-maq.jpg" },
  { id: "treino-halter", label: "Treino com halteres · faixa", fallback: "assets/img/capas/treino-halter.jpg" },
  { id: "maq-01", label: "Máquina · Base", fallback: "assets/img/treino/chakra-01.jpg" },
  { id: "maq-02", label: "Máquina · Sacral", fallback: "assets/img/treino/chakra-02.jpg" },
  { id: "maq-03", label: "Máquina · Plexo", fallback: "assets/img/treino/chakra-03.jpg" },
  { id: "maq-04", label: "Máquina · Cardíaco", fallback: "assets/img/treino/chakra-04.jpg" },
  { id: "maq-05", label: "Máquina · Laríngeo", fallback: "assets/img/treino/chakra-05.jpg" },
  { id: "maq-06", label: "Máquina · Frontal", fallback: "assets/img/treino/chakra-06.jpg" },
  { id: "maq-07", label: "Máquina · Coronário", fallback: "assets/img/treino/chakra-07.jpg" },
  { id: "halter-01", label: "Halteres · Base", fallback: "assets/img/treino/halter-01.jpg" },
  { id: "halter-02", label: "Halteres · Sacral", fallback: "assets/img/treino/halter-02.jpg" },
  { id: "halter-03", label: "Halteres · Plexo", fallback: "assets/img/treino/halter-03.jpg" },
  { id: "halter-04", label: "Halteres · Cardíaco", fallback: "assets/img/treino/halter-04.jpg" },
  { id: "halter-05", label: "Halteres · Laríngeo", fallback: "assets/img/treino/halter-05.jpg" },
  { id: "halter-06", label: "Halteres · Frontal", fallback: "assets/img/treino/halter-06.jpg" },
  { id: "halter-07", label: "Halteres · Coronário", fallback: "assets/img/treino/halter-07.jpg" },
  { id: "yoga", label: "Yoga · head", fallback: "assets/img/capas/yoga.jpg" },
  { id: "yoga-01", label: "Yoga série 1", fallback: "assets/img/capas/yoga-01.jpg" },
  { id: "yoga-02", label: "Yoga série 2", fallback: "assets/img/capas/yoga-02.jpg" },
  { id: "yoga-03", label: "Yoga série 3", fallback: "assets/img/capas/yoga-03.jpg" },
  { id: "yoga-04", label: "Yoga série 4", fallback: "assets/img/capas/yoga-04.jpg" },
  { id: "yoga-05", label: "Yoga série 5", fallback: "assets/img/capas/yoga-05.jpg" },
  { id: "yoga-06", label: "Yoga série 6", fallback: "assets/img/capas/yoga-06.jpg" },
  { id: "yoga-07", label: "Yoga série 7", fallback: "assets/img/capas/yoga-07.jpg" },
  { id: "yoga-08", label: "Yoga série integração", fallback: "assets/img/capas/yoga-08.jpg" },
  { id: "yoga-09", label: "Saudação ao sol", fallback: "assets/img/capas/yoga-09.jpg" },
  { id: "yoga-10", label: "Saudação à lua", fallback: "assets/img/capas/yoga-10.jpg" },
  { id: "etiqueta", label: "Etiqueta · head", fallback: "assets/img/capas/etiqueta.jpg" },
  { id: "eti-01", label: "Etiqueta · Presença", fallback: "assets/img/capas/eti-01.jpg" },
  { id: "eti-02", label: "Etiqueta · Apresentação", fallback: "assets/img/capas/eti-02.jpg" },
  { id: "eti-03", label: "Etiqueta · Pontualidade", fallback: "assets/img/capas/eti-03.jpg" },
  { id: "eti-04", label: "Etiqueta · Mesa", fallback: "assets/img/capas/eti-04.jpg" },
  { id: "eti-05", label: "Etiqueta · Call e voz", fallback: "assets/img/capas/eti-05.jpg" },
  { id: "eti-06", label: "Etiqueta · Ambiente", fallback: "assets/img/capas/eti-06.jpg" },
  { id: "eti-07", label: "Etiqueta · Legado de trato", fallback: "assets/img/capas/eti-07.jpg" },
  { id: "loja", label: "Lojinha · head", fallback: "assets/img/capas/loja.jpg" },
  { id: "loja-top", label: "Produto · Top", fallback: "assets/img/loja/top-creme.jpg" },
  { id: "loja-colar", label: "Produto · Colar", fallback: "assets/img/loja/colar.jpg" },
  { id: "loja-caneta", label: "Produto · Caneta", fallback: "assets/img/loja/caneta.jpg" },
  { id: "loja-gravata", label: "Produto · Gravata", fallback: "assets/img/loja/gravata.jpg" },
  { id: "loja-joia", label: "Produto · Joias", fallback: "assets/img/loja/joia.jpg" }
];

function map() {
  return Store.get(KEY, {}) || {};
}

export function coverUrl(id) {
  const over = map()[id];
  if (over) return over;
  const slot = COVER_SLOTS.find((s) => s.id === id);
  return slot ? slot.fallback : "";
}

export function setCover(id, dataUrl) {
  const all = map();
  all[id] = dataUrl;
  Store.set(KEY, all);
}

export function resetCover(id) {
  const all = map();
  delete all[id];
  Store.set(KEY, all);
}

const VIDEO_KEY = "treino_videos";

/** URL do vídeo do treino: override do mentor ou arquivo padrão no GitHub. */
export function videoSrc(id) {
  const over = (Store.get(VIDEO_KEY, {}) || {})[id];
  if (over) return over;
  return "assets/video/treino/" + id + ".mp4";
}

export function setVideoSrc(id, url) {
  const all = Store.get(VIDEO_KEY, {}) || {};
  if (url) all[id] = url;
  else delete all[id];
  Store.set(VIDEO_KEY, all);
}

export function canEditCovers() {
  return isMentorSession();
}

function escAttr(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/** Capa de página (16:9) */
export function pageHead(id, line, title, sub) {
  const src = coverUrl(id);
  const edit = canEditCovers()
    ? `<button type="button" class="cover-pen" data-cover="${escAttr(id)}" title="Trocar imagem">Trocar</button>`
    : "";
  return `<div class="page-head">
    <div class="page-head-img" data-cover="${escAttr(id)}">
      <img src="${escAttr(src)}" alt="" decoding="async" fetchpriority="high">
      ${edit}
    </div>
    <p class="hero-line">${line}</p>
    <h2 class="hero-title">${title}</h2>
    ${sub ? `<p class="hero-sub">${sub}</p>` : ""}
  </div>`;
}

/** Imagem de card com lápis do mentor */
export function editImg(id, alt, cls) {
  const src = coverUrl(id);
  const pen = canEditCovers()
    ? `<button type="button" class="cover-pen cover-pen-sm" data-cover="${escAttr(id)}">Trocar</button>`
    : "";
  return `<div class="img-slot ${cls || ""}" data-cover="${escAttr(id)}">
    <img src="${escAttr(src)}" alt="${escAttr(alt)}" loading="lazy" decoding="async">
    ${pen}
  </div>`;
}

export function getExtraProducts() {
  return Store.get(LOJA_KEY, []) || [];
}

export function addProduct({ title, img, price }) {
  const list = getExtraProducts();
  list.push({
    id: "x" + Date.now(),
    name: title,
    price: price || "Sob consulta",
    kind: "unica",
    note: "Adicionado pelo mentor",
    img
  });
  Store.set(LOJA_KEY, list);
}

export function removeProduct(id) {
  Store.set(
    LOJA_KEY,
    getExtraProducts().filter((p) => p.id !== id)
  );
}

let pendingSlot = null;

export function bindCoverEditor() {
  const input = document.getElementById("coverFile");
  if (!input || input.dataset.bound) return;
  input.dataset.bound = "1";
  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    input.value = "";
    if (!file || !pendingSlot || !canEditCovers()) return;
    if (file.size > 4.5 * 1024 * 1024) {
      const t = document.getElementById("toast");
      if (t) {
        t.textContent = "Imagem grande demais (máx 4,5 MB)";
        t.className = "toast show err";
      }
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const slot = pendingSlot;
      pendingSlot = null;
      if (slot === "__new_product__") {
        const title = window.prompt("Título do produto") || "Novo produto";
        addProduct({ title, img: reader.result, price: "Sob consulta" });
      } else {
        setCover(slot, reader.result);
      }
      document.dispatchEvent(new CustomEvent("af-covers-changed"));
    };
    reader.readAsDataURL(file);
  });
}

export function handleCoverClick(e) {
  if (!canEditCovers()) return false;
  const btn = e.target.closest("[data-cover]");
  if (!btn) return false;
  e.preventDefault();
  e.stopPropagation();
  pendingSlot = btn.dataset.cover;
  document.getElementById("coverFile")?.click();
  return true;
}

export function pickNewProductImage() {
  if (!canEditCovers()) return;
  pendingSlot = "__new_product__";
  document.getElementById("coverFile")?.click();
}
