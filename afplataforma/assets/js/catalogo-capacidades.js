import { isMentorSession } from "./auth.js";
import { CATALOG } from "./catalogo-capacidades-data.js?v=20261110-1";



const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const statusOptions = ["Existente","Estruturado","Em desenvolvimento","Sob demanda"];

export function renderCatalogoCapacidades() {
  if (!isMentorSession()) return '<div class="view active"><p class="empty">Acesso restrito ao mentor.</p></div>';
  const cards = CATALOG.map((dept) => {
    const groups = dept.groups.map(([heading, items]) =>
      '<section class="cap-group"><h4>'+esc(heading)+'</h4><ul>'+items.map((item) => '<li>'+esc(item)+'</li>').join("")+'</ul></section>'
    ).join("");
    return '<details class="cap-dept" data-search="'+esc((dept.name+" "+dept.summary+" "+dept.groups.flat().join(" ")).toLowerCase())+'"><summary><span class="cap-num">'+esc(dept.name.slice(0,2))+'</span><span class="cap-title"><strong>'+esc(dept.name)+'</strong><small>'+esc(dept.summary)+'</small></span><span class="cap-count">'+dept.groups.reduce((n,g)=>n+g[1].length,0)+' capacidades</span></summary><div class="cap-content">'+groups+'</div></details>';
  }).join("");
  return '<div class="view active cap-view"><div class="back-link" data-nav="mentor">← Gestão do mentor</div><p class="hero-line">Akasha Hub · uso interno</p><h2 class="hero-title">Catálogo de Capacidades</h2><p class="hero-sub">Inventário mestre do que o ecossistema pode compreender, estruturar, desenvolver e coordenar. Não representa promessa de execução automática nem itens incluídos em todo contrato.</p><div class="cap-toolbar"><input id="capSearch" type="search" placeholder="Buscar serviço, competência ou entrega..." aria-label="Buscar no catálogo"><span id="capResultCount">'+CATALOG.length+' departamentos</span></div><div class="cap-status-note"><strong>Classificação operacional</strong><p>Use os estados para distinguir o que já existe, o que está estruturado, o que exige desenvolvimento e o que depende de parceiros ou especialistas.</p><div class="cap-statuses">'+statusOptions.map((s)=>'<span>'+esc(s)+'</span>').join("")+'</div></div><div class="cap-list">'+cards+'</div><div class="cap-footnote">Serviços jurídicos, contábeis, regulados, imigração, consultoria de investimentos e atividades técnicas especializadas exigem profissionais habilitados e validação na jurisdição aplicável. Escopo, prazos, preço e responsabilidades são definidos por projeto.</div></div>';
}

export function bindCatalogoCapacidades() {
  if (!isMentorSession()) return;
  const root = document.querySelector(".cap-view");
  if (!root || root.dataset.capBound === "1") return;
  root.dataset.capBound = "1";
  const input = root.querySelector("#capSearch");
  const items = Array.from(root.querySelectorAll(".cap-dept"));
  const count = root.querySelector("#capResultCount");
  input?.addEventListener("input", () => {
    const q = String(input.value || "").trim().toLowerCase();
    let visible = 0;
    items.forEach((item) => {
      const match = !q || item.dataset.search.includes(q);
      item.hidden = !match;
      if (match) visible++;
      if (q && match) item.open = true;
      if (!q) item.open = false;
    });
    if (count) count.textContent = visible+" de "+items.length+" departamentos";
  });
}
