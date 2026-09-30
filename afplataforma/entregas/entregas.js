(function () {
  "use strict";
  var LS_KEY = "af-entregas-state-v1";
  var GRUPOS = [
    { key: "pre-call", label: "Notificação pré-call", icon: "🔔" },
    { key: "call", label: "Conteúdo da call (registro)", icon: "🎙️" },
    { key: "protocolo", label: "Protocolo pós-call", icon: "✅" },
    { key: "complementar", label: "Complementar", icon: "🙏" },
    { key: "video", label: "Vídeo da call", icon: "🎥" }
  ];
  var CAMADA_ORDER = ["base", "premium", "vip"];
  var CAMADA_LABEL = { base: "Essencial + Premium", premium: "Só Premium", vip: "Só VIP (individual)" };
  var FILTERS = [["todos", "Todos"], ["essencial", "Grupo Essencial"], ["premium", "Grupo Premium"], ["vip", "Grupo VIP"]];
  var PLANOS = [
    { nome: "Essencial", preco: "R$ 3.900", tag: "turma · ticket interno · 8 semanas", desc: "Método completo. Complementar leve. Call da turma / sala Essencial.", extra: "7 módulos · biblioteca 30 dias\nDicionário · Etiqueta · Lojinha · Anamnese · Essência" },
    { nome: "Premium", preco: "R$ 6.500", tag: "grupo reduzido · ticket interno · 12 semanas", desc: "Método + corpo, livros, áudio autorizado, encontros. Sala Premium.", extra: "7 módulos · biblioteca 180 dias\nAlimentação · Constelação familiar · Livros dos 7 vetores · Áudiolivros autorizados · Treino e exercícios · Yoga operacional · Meditação guiada · Hábitos · Rotina · Metas · Produtividade · Encontros da mentoria" },
    { nome: "VIP", preco: "R$ 13.000", tag: "1:1 · ticket interno · 16 semanas", desc: "Tudo aberto + acompanhamento 1:1. Sala VIP e Geral.", extra: "7 módulos · biblioteca 365 dias\nMindZone · Modo sono · AF Coach" }
  ];
  var GRUPOS_NOTE = "Grupo Essencial — turma, conteúdo base do método (camada “Essencial + Premium”).\nGrupo Premium — grupo reduzido, método + complementar completo (camadas “Essencial + Premium” e “Premium”).\nGrupo VIP (individual) — mentor + suporte Akasha Hub + mentorando, conteúdo exclusivo (camada “VIP”).\n\nQuem é VIP participa também do Grupo Essencial e do Grupo Premium ao mesmo tempo — por isso o conteúdo dessas camadas não precisa ser repetido no grupo individual.";

  var state = { modulos: [] };
  var ui = { moduloAtivo: "m1", planoFiltro: "todos", editingId: null, adding: {}, addingDiaria: {} };
  var saveTimer = null;

  function h(tag, attrs) {
    var el = document.createElement(tag);
    var children = Array.prototype.slice.call(arguments, 2);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (v == null) continue;
        if (k === "class") el.className = v;
        else if (k === "style") el.style.cssText = v;
        else if (k.indexOf("on") === 0 && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
        else el.setAttribute(k, v);
      }
    }
    children.forEach(function (c) {
      if (c == null) return;
      if (Array.isArray(c)) c.forEach(function (cc) { if (cc) el.appendChild(cc); });
      else if (typeof c === "string" || typeof c === "number") el.appendChild(document.createTextNode(String(c)));
      else el.appendChild(c);
    });
    return el;
  }
  function newId(prefix) { return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function findModulo(id) {
    for (var i = 0; i < state.modulos.length; i++) if (state.modulos[i].id === id) return state.modulos[i];
    return state.modulos[0];
  }
  function camadaVisible(camada, filtro) {
    if (filtro === "todos") return true;
    if (filtro === "essencial") return camada === "base";
    if (filtro === "premium") return camada === "base" || camada === "premium";
    if (filtro === "vip") return camada === "vip";
    return true;
  }
  function defaultCamadaForFiltro() {
    if (ui.planoFiltro === "vip") return "vip";
    if (ui.planoFiltro === "premium") return "premium";
    return "base";
  }
  function progressOf(mod) {
    var total = (mod.blocos || []).length + (mod.diarias || []).length;
    var done = 0;
    (mod.blocos || []).forEach(function (b) { if (b.enviado) done++; });
    (mod.diarias || []).forEach(function (d) { if (d.enviado) done++; });
    return done + "/" + total;
  }
  function showToast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { t.classList.remove("show"); }, 1600);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text || "").then(function () { showToast("Copiado!"); }).catch(fallback);
    } else fallback();
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text || "";
        ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast("Copiado!");
      } catch (e) { showToast("Não foi possível copiar"); }
    }
  }
  function setStatus(text) {
    var s = document.getElementById("save-status");
    if (s) s.textContent = text;
  }
  function scheduleSave() {
    setStatus("Alterações pendentes…");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(state));
        setStatus("Salvo neste navegador · " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      } catch (e) { setStatus("Não foi possível salvar"); }
    }, 800);
  }
  function removeButton(onConfirm) {
    var armed = false, timer = null;
    var btn = h("button", { class: "btn danger ghost" }, "Remover");
    btn.addEventListener("click", function () {
      if (!armed) {
        armed = true; btn.textContent = "Confirmar?";
        timer = setTimeout(function () { armed = false; btn.textContent = "Remover"; }, 2500);
      } else { clearTimeout(timer); onConfirm(); }
    });
    return btn;
  }
  function camadaPill(item) {
    var cls = "pill" + (item.camada === "premium" ? " premium" : item.camada === "vip" ? " vip" : "");
    return h("button", {
      class: cls, title: "Clique para mudar o grupo de destino",
      onClick: function () {
        item.camada = CAMADA_ORDER[(CAMADA_ORDER.indexOf(item.camada) + 1) % CAMADA_ORDER.length];
        scheduleSave(); render();
      }
    }, CAMADA_LABEL[item.camada]);
  }
  function itemCard(mod, item, kind) {
    var isEditing = ui.editingId === item.id;
    var title = kind === "diaria"
      ? h("div", { class: "card-title" }, h("span", { class: "day" }, "Dia " + item.dia))
      : h("div", { class: "card-title" }, item.titulo);
    var top = h("div", { class: "card-top" }, title, camadaPill(item));
    if (isEditing) {
      var ta = h("textarea", {}); ta.value = item.texto || "";
      return h("div", { class: "card" }, top, h("div", { class: "card-body" }, ta),
        h("div", { class: "card-bottom" },
          h("div", { class: "card-actions" },
            h("button", { class: "btn primary", onClick: function () { item.texto = ta.value; ui.editingId = null; scheduleSave(); render(); } }, "Salvar"),
            h("button", { class: "btn ghost", onClick: function () { ui.editingId = null; render(); } }, "Cancelar")
          ), h("span")
        )
      );
    }
    var body = h("div", { class: "card-body" + (item.texto ? "" : " empty") }, item.texto || "Sem conteúdo ainda — toque em Editar para escrever.");
    var sendRow = h("label", { class: "sendrow" + (item.enviado ? " sent" : "") },
      h("input", { type: "checkbox", checked: item.enviado ? "checked" : undefined, onChange: function (e) { item.enviado = e.target.checked; scheduleSave(); render(); } }),
      item.enviado ? "Enviado" : "Marcar como enviado"
    );
    var actions = h("div", { class: "card-actions" },
      h("button", { class: "btn", onClick: function () { copyText(item.texto || ""); } }, "Copiar"),
      h("button", { class: "btn ghost", onClick: function () { ui.editingId = item.id; render(); } }, "Editar"),
      removeButton(function () {
        if (kind === "diaria") mod.diarias = mod.diarias.filter(function (x) { return x.id !== item.id; });
        else mod.blocos = mod.blocos.filter(function (b) { return b.id !== item.id; });
        scheduleSave(); render();
      })
    );
    return h("div", { class: "card" }, top, body, h("div", { class: "card-bottom" }, actions, sendRow));
  }
  function addBlockToggle(mod, grupoKey) {
    var key = mod.id + ":" + grupoKey;
    if (!ui.adding[key]) return h("button", { class: "addbtn", onClick: function () { ui.adding[key] = true; render(); } }, "+ Adicionar bloco");
    var titleInput = h("input", { type: "text", placeholder: "Título do bloco" });
    var textArea = h("textarea", { placeholder: "Texto pronto para colar no WhatsApp…" });
    return h("div", { class: "addbox" }, titleInput, textArea,
      h("div", { class: "card-actions" },
        h("button", { class: "btn primary", onClick: function () {
          mod.blocos.push({ id: newId(mod.id + "-b"), grupo: grupoKey, titulo: titleInput.value || "Bloco", camada: defaultCamadaForFiltro(), enviado: false, texto: textArea.value });
          ui.adding[key] = false; scheduleSave(); render();
        } }, "Adicionar"),
        h("button", { class: "btn ghost", onClick: function () { ui.adding[key] = false; render(); } }, "Cancelar")
      )
    );
  }
  function addDiariaToggle(mod) {
    if (!ui.addingDiaria[mod.id]) return h("button", { class: "addbtn", onClick: function () { ui.addingDiaria[mod.id] = true; render(); } }, "+ Adicionar notificação diária");
    var maxDia = 0;
    (mod.diarias || []).forEach(function (d) { if (d.dia > maxDia) maxDia = d.dia; });
    var textArea = h("textarea", { placeholder: "Texto da notificação do dia " + (maxDia + 1) + "…" });
    return h("div", { class: "addbox" }, textArea,
      h("div", { class: "card-actions" },
        h("button", { class: "btn primary", onClick: function () {
          if (!mod.diarias) mod.diarias = [];
          mod.diarias.push({ id: newId(mod.id + "-d"), dia: maxDia + 1, camada: defaultCamadaForFiltro(), enviado: false, texto: textArea.value });
          ui.addingDiaria[mod.id] = false; scheduleSave(); render();
        } }, "Adicionar"),
        h("button", { class: "btn ghost", onClick: function () { ui.addingDiaria[mod.id] = false; render(); } }, "Cancelar")
      )
    );
  }
  function section(mod, grupoDef) {
    var items = (mod.blocos || []).filter(function (b) { return b.grupo === grupoDef.key && camadaVisible(b.camada, ui.planoFiltro); });
    return h("div", { class: "sec" },
      h("div", { class: "sec-h" }, h("span", { class: "lbl" }, grupoDef.icon + " " + grupoDef.label)),
      items.map(function (b) { return itemCard(mod, b, "bloco"); }),
      addBlockToggle(mod, grupoDef.key)
    );
  }
  function diariaSection(mod) {
    var items = (mod.diarias || []).filter(function (d) { return camadaVisible(d.camada, ui.planoFiltro); }).slice().sort(function (a, b) { return a.dia - b.dia; });
    return h("div", { class: "sec" },
      h("div", { class: "sec-h" }, h("span", { class: "lbl" }, "📅 Notificações diárias")),
      items.map(function (d) { return itemCard(mod, d, "diaria"); }),
      addDiariaToggle(mod)
    );
  }
  function fichaCard(mod) {
    var children = [
      h("div", { class: "ficha-eyebrow" }, "Módulo " + mod.numero),
      h("div", { class: "ficha-nome" }, mod.nome),
      h("div", { class: "ficha-meta" },
        h("span", {}, h("b", {}, mod.chakra || "")),
        h("span", {}, h("b", {}, mod.duracao || "")),
        h("span", {}, "Ferramenta: ", h("b", {}, mod.ferramenta || ""))
      ),
      h("div", { class: "card-body", style: "padding:0;border:0;color:var(--ink-dim);" }, mod.objetivo || "")
    ];
    if (mod.frase) children.push(h("div", { class: "ficha-frase" }, "“" + mod.frase + "”"));
    return h("div", { class: "ficha", style: "--accent:" + (mod.cor || "#C79A44") }, children);
  }
  function moduloView(mod) {
    if (!mod) return h("p", {}, "Nenhum módulo.");
    return h("div", {}, fichaCard(mod), GRUPOS.map(function (g) { return section(mod, g); }), diariaSection(mod));
  }
  function planosView() {
    return h("div", {},
      h("div", { class: "sec" },
        h("div", { class: "sec-h" }, h("span", { class: "lbl" }, "💳 Planos")),
        h("div", { class: "planos-grid" }, PLANOS.map(function (p) {
          return h("div", { class: "plano-card" }, h("h3", {}, p.nome), h("div", { class: "plano-preco" }, p.preco), h("div", { class: "plano-tag" }, p.tag), h("div", { class: "plano-desc" }, p.desc), h("div", { class: "plano-extra" }, p.extra));
        }))
      ),
      h("div", { class: "sec" },
        h("div", { class: "sec-h" }, h("span", { class: "lbl" }, "🗂️ Grupos no WhatsApp"), h("button", { class: "btn ghost", onClick: function () { copyText(GRUPOS_NOTE); } }, "Copiar")),
        h("div", { class: "note-card" }, GRUPOS_NOTE)
      )
    );
  }
  function filterChips() {
    var row = h("div", { class: "chiprow" });
    FILTERS.forEach(function (f) {
      row.appendChild(h("button", { class: "chip" + (ui.planoFiltro === f[0] ? " active" : ""), onClick: function () { ui.planoFiltro = f[0]; render(); } }, f[1]));
    });
    return row;
  }
  function modNav() {
    var row = h("div", { class: "modnav" });
    state.modulos.forEach(function (mod) {
      row.appendChild(h("button", {
        class: "modbtn" + (ui.moduloAtivo === mod.id ? " active" : ""),
        style: "--accent:" + (mod.cor || "#C79A44"),
        onClick: function () { ui.moduloAtivo = mod.id; ui.editingId = null; render(); }
      }, h("span", { class: "n" }, "Módulo " + mod.numero), h("span", { class: "nm" }, mod.nome), h("span", { class: "pg" }, progressOf(mod) + " enviados")));
    });
    row.appendChild(h("button", {
      class: "modbtn" + (ui.moduloAtivo === "planos" ? " active" : ""),
      onClick: function () { ui.moduloAtivo = "planos"; render(); }
    }, h("span", { class: "n" }, "Referência"), h("span", { class: "nm" }, "Planos & grupos")));
    return row;
  }
  function render() {
    var root = document.getElementById("app-body");
    if (!root) return;
    root.innerHTML = "";
    root.appendChild(filterChips());
    root.appendChild(modNav());
    root.appendChild(ui.moduloAtivo === "planos" ? planosView() : moduloView(findModulo(ui.moduloAtivo)));
  }
  function boot(data) {
    state = data && data.modulos ? data : { modulos: [] };
    ui.moduloAtivo = (state.modulos[0] && state.modulos[0].id) || "m1";
    render();
    setStatus("Pronto · só mentor");
  }
  try {
    var raw = localStorage.getItem(LS_KEY);
    if (raw) { boot(JSON.parse(raw)); return; }
  } catch (e) {}
  fetch("./entregas-state.json")
    .then(function (r) { return r.json(); })
    .then(boot)
    .catch(function () { boot({ modulos: [] }); });
})();
