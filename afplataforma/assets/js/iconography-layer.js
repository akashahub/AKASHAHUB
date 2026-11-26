/* AF Plataforma · camada aditiva de iconografia
 * Apenas apresentação: não altera rotas, handlers, atributos de dados,
 * autenticação, permissões, estado ou persistência.
 */
(() => {
  "use strict";
  if (window.__AF_ICONOGRAPHY_LAYER__) return;
  window.__AF_ICONOGRAPHY_LAYER__ = true;

  const icons = [
    [/ess[eê]ncia|identidade|marca|dossi[eê]|hist[oó]ria|origem|perfil/i, "fingerprint"],
    [/imp[eé]rio|site|digital|plataforma|aplica[cç][aã]o|biblioteca de solu[cç][oõ]es/i, "globe"],
    [/financeir|cash.?flow|fluxo|caixa|saldo|conta|pre[cç]o|receita|despesa|dinheiro|capital/i, "wallet"],
    [/expans[aã]o|crescimento|divulga[cç][aã]o|marketing|sdr|closer|vendedor|prospec[cç][aã]o|pitch/i, "trending"],
    [/legado|continuidade|patrim[oô]nio|sucess[aã]o|zen neg[oó]cios/i, "landmark"],
    [/vis[aã]o|planejamento|estrat[eé]gia|mapa|dire[cç][aã]o/i, "compass"],
    [/ideia|insight|ideation|criativ/i, "lightbulb"],
    [/rede|contato|network|conex[aã]o/i, "network"],
    [/tarefa|execu[cç][aã]o|checklist|prioridade/i, "check"],
    [/meta|objetivo|alvo/i, "target"],
    [/call|sess[aã]o|reuni[aã]o|sala|encontro/i, "video"],
    [/roteiro|teleprompt|livro|conte[uú]do|texto|escrever/i, "book"],
    [/treino|corpo|sa[uú]de|alimenta[cç][aã]o/i, "activity"],
    [/sono|descanso|respirar|medita[cç][aã]o/i, "moon"],
    [/config|ajuste|prefer[eê]ncia/i, "settings"],
    [/editar|alterar|personalizar/i, "edit"],
    [/salvar|guardar|concluir|confirmar|enviar/i, "save"],
    [/adicionar|novo|criar|incluir/i, "plus"],
    [/excluir|remover|apagar|deletar/i, "trash"],
    [/buscar|pesquisar|filtrar/i, "search"],
    [/baixar|download|exportar/i, "download"],
    [/abrir|acessar|entrar|continuar|iniciar/i, "arrow"],
    [/voltar|retornar/i, "back"],
    [/fechar|cancelar|sair/i, "close"],
    [/ajuda|suporte|orienta[cç][aã]o/i, "help"],
    [/seguran[cç]a|acesso|permiss[aã]o|usu[aá]rio/i, "shield"],
    [/relat[oó]rio|an[aá]lise|diagn[oó]stico|indicador/i, "chart"],
    [/material|arquivo|documento|anexo/i, "file"],
    [/imagem|foto|capa|m[ií]dia/i, "image"],
    [/comunidade|grupo|equipe/i, "users"],
    [/pre[cç]o|oferta|produto|servi[cç]o/i, "tag"]
  ];

  const paths = {
    fingerprint: '<path d="M12 11a2 2 0 0 0-2 2c0 3-1 5-2 6"/><path d="M14 13c0 4-.7 6-2 8"/><path d="M8 9a5 5 0 0 1 8 4c0 2-.2 3.5-.6 5"/><path d="M6 13c0-4 2-7 6-7s6 3 6 7"/><path d="M4 12a8 8 0 0 1 16 0"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M16 14h2"/>',
    trending: '<path d="m3 17 6-6 4 3 8-8"/><path d="M15 6h6v6"/>',
    landmark: '<path d="m3 9 9-6 9 6M4 10h16M6 10v9m4-9v9m4-9v9m4-9v9M3 21h18"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/>',
    lightbulb: '<path d="M9 18h6m-5 4h4m-5-8a6 6 0 1 1 6 0c-.8.7-1 1.3-1 2h-4c0-.7-.2-1.3-1-2Z"/>',
    network: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="m11 7-5 9m7-9 5 9M7 18h10"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z"/><path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20"/>',
    activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    moon: '<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.6-1.4-2.4 1.4-1.1a8 8 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1 0 1.8Z"/>',
    edit: '<path d="m4 16.5-.8 4.3 4.3-.8L20 7.5 16.5 4 4 16.5Z"/><path d="m14.5 6 3.5 3.5"/>',
    save: '<path d="M5 3h12l4 4v14H3V3h2Z"/><path d="M7 3v6h10V3M7 21v-8h10v8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    back: '<path d="M20 12H5m6 6-6-6 6-6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-1 .9-1.8 1.3-1.8 2.8m0 3h.01"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    chart: '<path d="M4 19V5m0 14h17M8 15l4-4 3 2 5-6"/>',
    file: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7m-7 4h7"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 20"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-7.5a4 4 0 0 1 0 7.7M20 15a4 4 0 0 1 2 3.5V21"/>',
    tag: '<path d="M20 13 13 20 3 10V3h7l10 10Z"/><circle cx="7.5" cy="7.5" r="1"/>'
  };

  function pick(label) {
    const text = String(label || "").replace(/\s+/g, " ").trim();
    if (!text) return null;
    for (const [pattern, name] of icons) if (pattern.test(text)) return name;
    return null;
  }
  function svg(name) {
    return '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths[name] + '</svg>';
  }
  function labelOf(el) {
    return [el.getAttribute("aria-label"), el.getAttribute("title"), el.innerText, el.textContent]
      .filter(Boolean).join(" ").slice(0, 220);
  }
  function decorate(root) {
    const nodes = root.matches?.("button,a[role=button],.btn,[data-tool],.tool-card,.ah-phase-item")
      ? [root] : [];
    nodes.push(...(root.querySelectorAll?.("button,a[role=button],.btn,[data-tool],.tool-card,.ah-phase-item") || []));
    for (const el of nodes) {
      if (!el.isConnected || el.closest("#authShell") || el.closest("#quickToolLoader")) continue;
      const name = pick(labelOf(el));
      if (!name) continue;
      if (el.classList.contains("ah-phase-item")) {
        const slot = el.querySelector(".ico");
        if (slot && slot.dataset.afIcon !== name) {
          slot.innerHTML = svg(name);
          slot.dataset.afIcon = name;
        }
        continue;
      }
      if (el.querySelector(":scope > .af-ui-icon") || el.querySelector(":scope > svg, :scope > img")) continue;
      const icon = document.createElement("span");
      icon.className = "af-ui-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = svg(name);
      el.prepend(icon);
    }
  }
  const style = document.createElement("style");
  style.textContent = `
    body .af-ui-icon{display:inline-flex;align-items:center;justify-content:center;flex:0 0 17px;width:17px;height:17px;margin-right:7px;vertical-align:middle;opacity:.88;pointer-events:none}
    body .af-ui-icon svg{display:block;width:17px;height:17px}
    body .ah-phase-item .ico{display:grid;place-items:center}
    body .ah-phase-item .ico svg{width:21px;height:21px}
    body button:has(> .af-ui-icon),body a:has(> .af-ui-icon){align-items:center}
    @media(prefers-reduced-motion:reduce){body .af-ui-icon{transition:none}}
  `;
  document.head.appendChild(style);

  const start = () => {
    const app = document.body;
    if (!app) return;
    decorate(app);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) if (node.nodeType === 1) decorate(node);
      }
      if (records.some(record => record.type === "characterData" || record.type === "attributes")) decorate(app);
    });
    observer.observe(app, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:["aria-label","title"]});
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, {once:true});
  else start();
})();
