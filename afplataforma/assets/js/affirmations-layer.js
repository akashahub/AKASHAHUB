/**
 * Akasha Hub · Afirmações integradas à experiência da AF Plataforma.
 * Camada aditiva: não altera fases, dados, rotas, autenticação ou ferramentas.
 */
(() => {
  const GROUPS = {
    fase1: [
      ["Identidade", "Reconheço meu valor e desenvolvo minhas capacidades todos os dias."],
      ["Merecimento", "Posso desejar uma vida plena e construir, com responsabilidade, o caminho até ela."],
      ["Sucesso", "Assumo a responsabilidade pelo meu potencial e pelo legado que construo."]
    ],
    fase2: [
      ["Criatividade", "Minha criatividade encontra caminhos para transformar ideias em resultados."],
      ["Realização", "Minhas ideias ganham forma por meio de clareza, planejamento e ação."],
      ["Contribuição", "Desenvolvo soluções que geram valor real para as pessoas que alcanço."]
    ],
    fase3: [
      ["Consciência financeira", "Meu relacionamento com o dinheiro é consciente, saudável e construtivo."],
      ["Liberdade", "Desenvolvo a capacidade de gerar renda, preservar recursos e ampliar minhas possibilidades."],
      ["Prosperidade responsável", "Administro meus recursos com sabedoria e visão de longo prazo."]
    ],
    fase4: [
      ["Fé e confiança", "Mesmo diante do desconhecido, posso encontrar clareza para dar o próximo passo."],
      ["Abundância", "Permaneço aberto a reconhecer oportunidades e transformá-las em ações concretas."],
      ["Provisão", "Confio na minha capacidade de encontrar soluções, aprender e seguir em frente."],
      ["Gratidão", "Agradeço pelos recursos que já existem em minha vida e pelas oportunidades que estou construindo."]
    ],
    fase5: [
      ["Proteção", "Preservo minha clareza e ajo de acordo com meus valores."],
      ["Limites", "Estabeleço limites saudáveis e protejo aquilo que é essencial para minha evolução."],
      ["Domínio interior", "Direciono minha atenção ao que posso escolher, cuidar e transformar."]
    ],
    geral: [
      ["Expressão", "Coloco beleza, significado e excelência naquilo que crio."],
      ["Contribuição", "Meus talentos podem inspirar, apoiar e contribuir para a vida de outras pessoas."],
      ["Legado", "Faço do meu trabalho uma expressão de criatividade, cuidado e contribuição."]
    ]
  };

  function card(item, index) {
    const [label, quote] = item;
    return '<aside class="af-affirmation" data-af-affirmation="' + index + '">' +
      '<span class="af-affirmation-mark" aria-hidden="true">✦</span>' +
      '<div><span class="af-affirmation-label">' + label + '</span>' +
      '<p>' + quote + '</p></div></aside>';
  }

  function getGroup(root) {
    if (root.querySelector(".lifeos-home")) return "geral";
    const line = root.querySelector(".hero-line");
    const title = root.querySelector(".hero-title");
    const text = ((line?.textContent || "") + " " + (title?.textContent || "")).toLowerCase();
    if (/fase\s*1|arquitetura de essência/.test(text)) return "fase1";
    if (/fase\s*2|império digital/.test(text)) return "fase2";
    if (/fase\s*3|alinhamento financeiro|preço mínimo/.test(text)) return "fase3";
    if (/fase\s*4|expansão|processos de execução/.test(text)) return "fase4";
    if (/fase\s*5|legado|continuidade/.test(text)) return "fase5";
    return "";
  }

  function decorate() {
    const root = document.getElementById("content");
    if (!root) return;
    root.querySelectorAll("[data-af-affirmation]").forEach((el) => el.remove());
    const group = getGroup(root);
    if (!group) return;
    const items = GROUPS[group];
    const headings = Array.from(root.querySelectorAll(".section-h"));
    if (group === "geral") {
      const targets = headings.length
        ? [headings[0], headings[Math.floor((headings.length - 1) / 2)], headings[headings.length - 1]].filter(Boolean)
        : [];
      targets.forEach((heading, i) => heading.insertAdjacentHTML("afterend", card(items[i % items.length], i)));
      if (!targets.length) root.insertAdjacentHTML("beforeend", card(items[0], 0));
      return;
    }
    if (!headings.length) {
      root.insertAdjacentHTML("beforeend", items.map(card).join(""));
      return;
    }
    const placements = Math.min(items.length, Math.max(1, headings.length - 1));
    for (let i = 0; i < placements; i++) {
      const index = Math.min(headings.length - 1, Math.round(((i + 1) * headings.length) / (placements + 1)));
      headings[index].insertAdjacentHTML("afterend", card(items[i], i));
    }
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      decorate();
    });
  }

  const start = () => {
    const root = document.getElementById("content");
    if (!root) return;
    new MutationObserver(schedule).observe(root, { childList: true, subtree: true });
    schedule();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
