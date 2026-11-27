import { isMentorSession } from "./auth.js";
import { CATALOG, DEPT_CODES, DEPT_PHASES, CAPABILITY_PHASES } from "./catalogo-capacidades-data.js?v=20261127-catalogo-167-1";



const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const statusOptions = ["Existente","Estruturado","Em desenvolvimento","Sob demanda"];

export function renderCatalogoCapacidades() {
  if (!isMentorSession()) return '<div class="view active"><p class="empty">Acesso restrito ao mentor.</p></div>';
  let totalCapabilities = 0;
  const phaseNames = {AE:"Arquitetura de Essência",ID:"Império Digital",AF:"Alinhamento Financeiro",EX:"Expansão",LG:"Legado"};
  const cards = CATALOG.map((dept) => {
    let n = 0;
    const groups = dept.groups.map(([heading, items]) => {
      const rows = items.map(item => {
        n++;
        totalCapabilities++;
        const id = DEPT_CODES[dept.id] + "-C" + String(n).padStart(2,"0");
        const phases = CAPABILITY_PHASES[id] || DEPT_PHASES[dept.id] || [];
        const phaseTags = phases.map(phase => '<span class="cap-phase-tag" style="display:inline-block;margin:3px 4px 0 0;padding:2px 7px;border:1px solid rgba(205,174,94,.35);border-radius:999px;font-size:10px;color:var(--gold)">'+esc(phase)+' · '+esc(phaseNames[phase] || phase)+'</span>').join(" ");
        return '<li><strong class="cap-id" style="font-size:10px;color:var(--muted);margin-right:5px">'+esc(id)+'</strong> '+esc(item)+'<small class="cap-phase-tags" style="display:block;margin:3px 0 8px 0">'+phaseTags+'</small></li>';
      }).join("");
      return '<section class="cap-group"><h4>'+esc(heading)+'</h4><ul>'+rows+'</ul></section>';
    }).join("");
    return '<details class="cap-dept" data-search="'+esc((dept.name+" "+dept.summary+" "+dept.groups.flat().join(" ")).toLowerCase())+'"><summary><span class="cap-num">'+esc(dept.name.slice(0,2))+'</span><span class="cap-title"><strong>'+esc(dept.name)+'</strong><small>'+esc(dept.summary)+'</small></span><span class="cap-count">'+n+' capacidades</span></summary><div class="cap-content">'+groups+'</div></details>';
  }).join("");
  return '<div class="view active cap-view"><div class="back-link" data-nav="mentor">← Gestão do mentor</div><p class="hero-line">Akasha Hub · uso interno</p><h2 class="hero-title">Catálogo de Capacidades</h2><p class="hero-sub">Inventário mestre do que o ecossistema pode compreender, estruturar, desenvolver e coordenar. Não representa promessa de execução automática nem itens incluídos em todo contrato.</p><div class="cap-toolbar"><input id="capSearch" type="search" placeholder="Buscar serviço, competência ou entrega..." aria-label="Buscar no catálogo"><span id="capResultCount">'+totalCapabilities+' capacidades · '+CATALOG.length+' departamentos</span></div><div class="cap-status-note"><strong>Classificação operacional</strong><p>Use os estados para distinguir o que já existe, o que está estruturado, o que exige desenvolvimento e o que depende de parceiros ou especialistas.</p><div class="cap-statuses">'+statusOptions.map((s)=>'<span>'+esc(s)+'</span>').join("")+'</div></div><div class="cap-list">'+cards+'</div><div class="cap-footnote"><strong>'+totalCapabilities+' capacidades catalogadas.</strong> Cada item possui ID estável e fase(s) de aplicação; a mesma capacidade pode aparecer em mais de uma fase sem ser duplicada. Serviços jurídicos, contábeis, regulados, imigração, consultoria de investimentos e atividades técnicas especializadas exigem profissionais habilitados e validação na jurisdição aplicável. Escopo, prazos, preço e responsabilidades são definidos por projeto.</div></div>';
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
