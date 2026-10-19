(function () {
  const bib = window.AKASHA_BIB;
  if (!bib) return;

  function esc(s) {
    return String(s || "").replace(/[&<>\"]/g, function (c) {
      return {"&": "&" + "amp;", "<": "&" + "lt;", ">": "&" + "gt;", '"': "&" + "quot;"}[c];
    });
  }

  function marca(it) {
    const h = it.hue || 40;
    const n = (it.id || it.nome || "").length + h;
    const kind = n % 6;
    const shape = [
      '<rect x="18" y="16" width="44" height="32" rx="4" fill="none" stroke="#f4e7bf" stroke-width="1.4"/>',
      '<circle cx="40" cy="32" r="16" fill="none" stroke="#f4e7bf" stroke-width="1.4"/>',
      '<path d="M40 14 L58 48 H22 Z" fill="none" stroke="#f4e7bf" stroke-width="1.4"/>',
      '<path d="M16 40 H64 M40 14 V50" stroke="#f4e7bf" stroke-width="1.4"/>',
      '<rect x="24" y="18" width="14" height="28" fill="none" stroke="#f4e7bf"/><rect x="42" y="26" width="14" height="20" fill="none" stroke="#f4e7bf"/>',
      '<path d="M22 46 C30 18 50 18 58 46" fill="none" stroke="#f4e7bf" stroke-width="1.4"/>'
    ][kind];
    return '<svg viewBox="0 0 80 64" aria-hidden="true"><defs><linearGradient id="g' + h + '" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(' + h + ',45%,18%)"/><stop offset="1" stop-color="hsl(' + ((h + 40) % 360) + ',35%,8%)"/></linearGradient></defs><rect width="80" height="64" fill="url(#g' + h + ')"/><g>' + shape + '</g></svg>';
  }

  function itemById(id) {
    return bib.itens.find(function (it) { return it.id === id; });
  }

  function renderCatalog() {
    const root = document.getElementById("grade");
    if (!root) return;
    const q = document.getElementById("q");
    const cat = document.getElementById("cat");
    const count = document.getElementById("count");
    const params = new URLSearchParams(location.search);
    if (params.get("cat") && cat) cat.value = params.get("cat");

    function cards() {
      const text = (q.value || "").trim().toLowerCase();
      const categoria = cat.value;
      const lista = bib.itens.filter(function (it) {
        if (categoria && it.cat !== categoria) return false;
        if (!text) return true;
        const bolo = (it.nome + " " + it.problema + " " + it.catNome + " " + it.dores.join(" ") + " " + it.quer.join(" ")).toLowerCase();
        return bolo.indexOf(text) >= 0;
      });
      const especiais = bib.originais.filter(function (it) {
        if (categoria && it.catId && it.catId !== categoria) return false;
        if (!text) return true;
        return (it.nome + " " + it.problema + " " + it.cat).toLowerCase().indexOf(text) >= 0;
      });
      const todos = especiais.concat(lista);
      count.textContent = todos.length + (todos.length === 1 ? " solução" : " soluções");
      root.innerHTML = todos.map(function (it) {
        const href = it.href || ("s/" + it.id + ".html");
        return '<a class="card" href="' + href + '"><div class="mark">' + marca(it) + '</div><span class="tag">' + esc(it.catNome || it.cat) + '</span><h2>' + esc(it.nome) + '</h2><p>' + esc(it.problema) + '</p><span class="btn">Abrir</span></a>';
      }).join("") || '<p class="lead">Nenhuma solução com esse filtro.</p>';
    }
    q.oninput = cards;
    cat.onchange = cards;
    cards();
  }

  function checks(name, list) {
    return '<fieldset class="block" style="padding:12px"><legend class="tag">' + esc(name) + '</legend><div class="opts">' +
      list.map(function (op, i) {
        return '<label class="opt"><input type="checkbox" name="' + esc(name) + '" value="' + esc(op) + '"> <span>' + esc(op) + '</span></label>';
      }).join("") + '</div></fieldset>';
  }

  function renderPage() {
    const id = document.body.getAttribute("data-solucao");
    if (!id) return;
    const it = itemById(id);
    const main = document.getElementById("app");
    if (!it) {
      main.innerHTML = '<p class="lead">Esta solução não está no catálogo.</p>';
      return;
    }
    document.title = it.nome + " · Império Digital";
    const video = it.cat === "video" ? '<p class="note">Três jeitos de trabalhar, sem misturar: edição tradicional, recurso assistido por IA e produção audiovisual completa. O mentor confirma o que cabe neste caso. A página não afirma que os três estão disponíveis para qualquer material.</p>' : "";
    main.innerHTML =
      '<header class="top"><a class="brand" href="../index.html">Império Digital</a><a class="back" href="../index.html">Biblioteca</a></header>' +
      '<div class="wrap page"><article data-forma="esfera" data-alfa="0.7"><p class="eyebrow">' + esc(it.catNome) + '</p><h1>' + esc(it.nome) + '</h1><p class="lead">' + esc(it.problema) + '</p>' + video +
      '<div class="mark" style="margin-top:18px;border-radius:16px">' + marca(it) + '</div>' +
      '<section class="block" style="margin-top:16px"><h2>O que isso resolve</h2><ul>' + it.dores.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join("") + '</ul></section>' +
      '<section class="block"><h2>O que pode entrar</h2><ul>' + it.faz.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join("") + '</ul></section>' +
      '</article><aside data-forma="anel" data-alfa="0.55"><section class="block"><h2>Exemplos</h2><ul>' + it.exemplos.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join("") + '</ul></section>' +
      '<section class="block"><h2>Com o que conversa</h2><p>' + esc(it.integracoes) + '</p></section>' +
      '<section class="block"><h2>O que precisa existir antes</h2><p>' + esc(it.depende) + '</p></section>' +
      (it.nota ? '<p class="note">' + esc(it.nota) + '</p>' : '') +
      '</aside></div>';

    const modo = it.cat === "video"
      ? '<fieldset class="block" style="padding:12px"><legend class="tag">Jeito de produzir</legend><div class="opts">' +
        '<label class="opt"><input type="radio" name="modo" value="Edição tradicional"> <span>Edição tradicional</span></label>' +
        '<label class="opt"><input type="radio" name="modo" value="Recurso assistido por IA"> <span>Recurso assistido por IA</span></label>' +
        '<label class="opt"><input type="radio" name="modo" value="Produção audiovisual completa"> <span>Produção audiovisual completa</span></label>' +
        '</div><p class="note">O mentor confirma qual destes cabe. Marcar aqui não garante execução.</p></fieldset>'
      : "";

    const panel = document.createElement("div");
    panel.className = "panel";
    panel.id = "painel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-labelledby", "painelTitulo");
    panel.innerHTML =
      '<button class="x" type="button" id="fechar" aria-label="Fechar">×</button>' +
      '<h2 id="painelTitulo">O que sua empresa precisa?</h2>' +
      '<p class="sub">Selecione o que você já possui, o que está faltando e quais soluções gostaria de construir.</p>' +
      '<form id="ficha">' +
      checks("O que você já possui?", it.ja) +
      checks("O que deseja resolver?", it.dores) +
      checks("O que gostaria de construir?", it.quer) +
      modo +
      '<label class="f" style="margin-top:12px">Negócio ou segmento, se quiser dizer<input name="negocio" maxlength="160" autocomplete="organization"></label>' +
      '<label class="f" style="margin-top:12px">Observação<input name="obs" maxlength="500"></label>' +
      '<p style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px"><button class="btn" type="submit">Gerar resumo para o mentor</button></p>' +
      '<p class="ok" id="erro" role="status"></p>' +
      '<label class="f" id="caixaResumo" hidden style="margin-top:12px">Resumo<textarea id="resumo"></textarea></label>' +
      '<p id="copias" hidden style="display:flex;flex-wrap:wrap;gap:8px"><button class="btn" type="button" id="copiar">Copiar resumo</button><button class="btn ghost" type="button" id="copiar2">Selecionar e copiar de novo</button></p>' +
      '<p class="ok" id="pronto" hidden>Pronto! Agora envie este resumo ao seu mentor para que ele avalie suas necessidades e defina os próximos passos do seu Processo Executivo.</p>' +
      '</form>';
    document.body.appendChild(panel);

    const botao = document.createElement("button");
    botao.className = "float";
    botao.type = "button";
    botao.id = "abrir";
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-controls", "painel");
    botao.textContent = "✎";
    botao.setAttribute("aria-label", "O que sua empresa precisa?");
    document.body.appendChild(botao);

    function abrir(v) {
      panel.hidden = !v;
      botao.setAttribute("aria-expanded", v ? "true" : "false");
      if (v) panel.querySelector("input").focus();
    }
    botao.onclick = function () { abrir(panel.hidden); };
    panel.querySelector("#fechar").onclick = function () { abrir(false); };
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) abrir(false);
    });

    function marcados(nome) {
      return Array.prototype.map.call(panel.querySelectorAll('input[name="' + nome + '"]:checked'), function (el) { return el.value; });
    }

    function texto() {
      const modoEl = panel.querySelector('input[name="modo"]:checked');
      const linhas = [
        "Biblioteca de Soluções · Império Digital",
        "Especialidade: " + it.nome,
        "Categoria: " + it.catNome,
        "",
        "Negócio ou segmento: " + (panel.querySelector('[name="negocio"]').value.trim() || "não informado"),
        "",
        "O que já possui:",
        marcados("O que você já possui?").map(function (x) { return "- " + x; }).join("\n") || "- não marcado",
        "",
        "O que deseja resolver:",
        marcados("O que deseja resolver?").map(function (x) { return "- " + x; }).join("\n") || "- não marcado",
        "",
        "O que gostaria de construir:",
        marcados("O que gostaria de construir?").map(function (x) { return "- " + x; }).join("\n") || "- não marcado",
        "",
        modoEl ? "Jeito de produzir: " + modoEl.value : "",
        "Observações: " + (panel.querySelector('[name="obs"]').value.trim() || "nenhuma"),
        "",
        "Próximo passo: avaliar as necessidades dentro do Processo Executivo.",
        "Este texto foi copiado pela pessoa. Nada foi enviado sozinho."
      ];
      return linhas.filter(function (x) { return x !== ""; }).join("\n");
    }

    panel.querySelector("#ficha").onsubmit = function (e) {
      e.preventDefault();
      const tem = marcados("O que deseja resolver?").length + marcados("O que gostaria de construir?").length;
      const erro = panel.querySelector("#erro");
      if (!tem) {
        erro.textContent = "Marque pelo menos um problema ou uma solução.";
        return;
      }
      erro.textContent = "";
      const box = panel.querySelector("#resumo");
      box.value = texto();
      panel.querySelector("#caixaResumo").hidden = false;
      panel.querySelector("#copias").hidden = false;
      box.focus();
    };

    async function copiar() {
      const box = panel.querySelector("#resumo");
      const valor = box.value;
      try {
        await navigator.clipboard.writeText(valor);
      } catch (err) {
        box.focus();
        box.select();
        document.execCommand("copy");
      }
      panel.querySelector("#pronto").hidden = false;
    }
    panel.querySelector("#copiar").onclick = copiar;
    panel.querySelector("#copiar2").onclick = function () {
      const box = panel.querySelector("#resumo");
      box.focus();
      box.select();
      copiar();
    };
  }

  function ligarEfeitos() {
    if (document.getElementById("akasha-fundo")) return;
    const c = document.createElement("canvas");
    c.id = "akasha-fundo";
    c.setAttribute("aria-hidden", "true");
    const cur = document.createElement("div");
    cur.className = "akasha-cursor";
    cur.setAttribute("aria-hidden", "true");
    document.body.prepend(cur);
    document.body.prepend(c);
    import("/efeitos/camada.js");
  }

  if (document.body.getAttribute("data-solucao")) renderPage();
  else renderCatalog();
  ligarEfeitos();
})();
