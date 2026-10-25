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
    new MutationObserver(schedule).observe(root, { childList: true });
    schedule();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();

  const MENTAL_LIBRARY = [
    { id:1, title:"Abundância e prosperidade", subtitle:"Recursos · Oportunidades · Gratidão", symbol:"∞", cover:"abundance", affirmations:[
      "Tenho dentro de mim recursos para criar, aprender e prosperar.",
      "Minhas necessidades encontram soluções por meio da minha inteligência, das minhas ações e das oportunidades que reconheço.",
      "Deus é minha fonte de inspiração, sabedoria e provisão.",
      "Estou no caminho da vitória, da realização e da prosperidade.",
      "Construo uma vida rica em recursos, experiências, liberdade e felicidade.",
      "As riquezas fazem parte da minha vida, e aprendo a administrá-las com sabedoria.",
      "Estou aberto a reconhecer e aproveitar oportunidades de crescimento.",
      "Agradeço pelas riquezas que já existem em minha vida e pelas que estou construindo."
    ]},
    { id:2, title:"Fé, confiança e segurança interior", subtitle:"Fé · Coragem · Equilíbrio", symbol:"✧", cover:"faith", affirmations:[
      "Deus está presente para me orientar nas dificuldades.",
      "Confio na minha capacidade de enfrentar situações novas com coragem e discernimento.",
      "Mesmo diante do desconhecido, posso encontrar clareza para dar o próximo passo.",
      "Minha mente está aberta à sabedoria, à inspiração e à compreensão.",
      "Cultivo a paz interior e não permito que pensamentos passageiros determinem minhas decisões.",
      "Minha força interior cresce quando ajo com consciência, fé e responsabilidade.",
      "Escolho alimentar pensamentos que fortaleçam minha presença, minha serenidade e minha determinação."
    ]},
    { id:3, title:"Inteligência, criatividade e realização", subtitle:"Ideias · Invenção · Contribuição", symbol:"✦", cover:"creation", affirmations:[
      "Minha inteligência está a serviço das minhas melhores ideias.",
      "Tenho capacidade de aprender, criar, desenvolver e aperfeiçoar soluções.",
      "Minha criatividade encontra caminhos para transformar ideias em resultados.",
      "Meu trabalho é uma expressão de inspiração, dedicação e contribuição.",
      "Desenvolvo soluções que geram valor para mim e para as pessoas que alcanço.",
      "Minhas ideias se tornam realidade por meio da clareza, do planejamento e da ação.",
      "Busco criar produtos e serviços que promovam satisfação, harmonia e benefícios reais.",
      "Cada desafio pode revelar uma nova oportunidade de aprender e evoluir."
    ]},
    { id:4, title:"Dinheiro, inteligência financeira e liberdade", subtitle:"Consciência · Gestão · Patrimônio", symbol:"◈", cover:"money", affirmations:[
      "Meu relacionamento com o dinheiro é consciente, saudável e construtivo.",
      "Reconheço o dinheiro como um instrumento de troca, realização e criação de valor.",
      "Recebo, administro e utilizo meus recursos com sabedoria e responsabilidade.",
      "Desenvolvo a capacidade de gerar renda, preservar patrimônio e ampliar minhas possibilidades.",
      "O dinheiro pode ser utilizado para construir liberdade, segurança e benefícios para a humanidade.",
      "Aprendo a reconhecer oportunidades sem abrir mão dos meus princípios.",
      "Minhas decisões financeiras são orientadas por clareza, estratégia e visão de longo prazo.",
      "Sou grato pelos recursos que possuo e responsável pela forma como os utilizo."
    ]},
    { id:5, title:"Proteção, limites e domínio interior", subtitle:"Presença · Disciplina · Integridade", symbol:"⛨", cover:"protection", affirmations:[
      "Eu fortaleço meu centro e preservo minha clareza diante das influências externas.",
      "Sou responsável pelos meus pensamentos, minhas escolhas e minhas atitudes.",
      "Estabeleço limites saudáveis e protejo aquilo que é essencial para minha evolução.",
      "Minha presença é firme, serena e consciente.",
      "Liberto minha atenção do que não posso controlar e a direciono ao que posso transformar.",
      "Caminho com confiança, mantendo meus valores e minha integridade.",
      "Minha proteção começa na consciência, no discernimento e nas escolhas que faço."
    ]},
    { id:6, title:"Beleza, expressão e contribuição", subtitle:"Arte · Inspiração · Serviço", symbol:"❋", cover:"beauty", affirmations:[
      "A sabedoria e a criatividade encontram expressão por meu intermédio.",
      "Minha mente está aberta à beleza, à ordem, à harmonia e à proporção.",
      "Minhas mãos transformam ideias em criações concretas.",
      "Aquilo que crio pode inspirar, emocionar e contribuir para a vida de outras pessoas.",
      "Busco colocar beleza, significado e excelência em tudo o que realizo.",
      "Sou parte de algo maior e posso contribuir com meus talentos para o mundo.",
      "Minha expressão se fortalece quando uno inspiração, prática e dedicação."
    ]},
    { id:7, title:"Identidade, merecimento e sucesso", subtitle:"Autoconfiança · Potencial · Vitória", symbol:"◎", cover:"identity", affirmations:[
      "Nasci para aprender, crescer e realizar coisas significativas.",
      "Reconheço meu valor e desenvolvo minhas capacidades todos os dias.",
      "Sou capaz de construir uma vida plena, próspera e feliz.",
      "Eu me permito desejar mais e me comprometo a agir de acordo com meus objetivos.",
      "Sou grato por manifestar meus objetivos por meio das minhas escolhas e ações.",
      "Não preciso ser perfeito para avançar; preciso estar presente e continuar evoluindo.",
      "Assumo a responsabilidade pelo meu potencial e pelo legado que construo.",
      "Sou uma pessoa excepcional naquilo que escolho desenvolver com consciência e dedicação."
    ]}
  ];

  function mentalCover(group) {
    return '<div class="af-mental-cover af-mental-cover-' + group.cover + '" aria-hidden="true"><span class="af-mental-orbit"></span><span class="af-mental-symbol">' + group.symbol + '</span><span class="af-mental-cover-number">0' + group.id + '</span></div>';
  }

  function openMentalLibrary(groupId) {
    const overlay = document.getElementById("overlay");
    const modal = document.getElementById("modalBox");
    const title = document.getElementById("modalTitle");
    const body = document.getElementById("modalBody");
    const foot = document.getElementById("modalFoot");
    if (!overlay || !modal || !title || !body || !foot) return;
    const group = MENTAL_LIBRARY.find((item) => item.id === groupId);
    if (!group) {
      title.textContent = "Fortalecimento mental";
      body.innerHTML = '<p class="af-mental-intro">Escolha uma categoria para abrir suas afirmações.</p><div class="af-mental-grid">' + MENTAL_LIBRARY.map((item) =>
        '<button type="button" class="af-mental-category" data-mental-category="' + item.id + '">' +
          mentalCover(item) + '<span class="af-mental-card-copy"><small> CATEGORIA 0' + item.id + '</small><strong>' + item.title + '</strong><span>' + item.subtitle + '</span><i>Ver afirmações ↗</i></span></button>'
      ).join("") + '</div>';
      foot.innerHTML = '<span class="af-mental-footnote">Escolha a categoria que conversa com seu momento.</span>';
    } else {
      title.textContent = "0" + group.id + " · " + group.title;
      body.innerHTML = '<button type="button" class="af-mental-back" data-mental-back>← Todas as categorias</button>' +
        '<div class="af-mental-detail-head">' + mentalCover(group) + '<div><p class="af-mental-intro">' + group.subtitle + '</p><p class="af-mental-guidance">Leia devagar. Escolha uma frase para levar à prática hoje.</p></div></div>' +
        '<ol class="af-mental-list">' + group.affirmations.map((quote, index) => '<li><span class="af-mental-index">' + String(index + 1).padStart(2, "0") + '</span><p>' + quote + '</p><button type="button" class="af-mental-copy" data-mental-copy="' + index + '" aria-label="Copiar afirmação">Copiar</button></li>').join("") + '</ol>';
      foot.innerHTML = '<span class="af-mental-footnote">A afirmação ganha força quando acompanha escolhas e ações conscientes.</span>';
    }
    overlay.classList.add("open");
    modal.classList.add("open");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "modalTitle");
    body.scrollTop = 0;
  }

  window.addEventListener("af:open-mental-library", () => openMentalLibrary(null));
  document.addEventListener("click", (event) => {
    const category = event.target.closest("[data-mental-category]");
    if (category) {
      openMentalLibrary(Number(category.dataset.mentalCategory));
      return;
    }
    if (event.target.closest("[data-mental-back]")) {
      openMentalLibrary(null);
      return;
    }
    const copyButton = event.target.closest("[data-mental-copy]");
    if (copyButton) {
      const modalTitle = document.getElementById("modalTitle")?.textContent || "";
      const group = MENTAL_LIBRARY.find((item) => modalTitle.includes(item.title));
      const quote = group?.affirmations[Number(copyButton.dataset.mentalCopy)];
      if (quote && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(quote).then(() => {
          copyButton.textContent = "Copiada";
          window.setTimeout(() => { if (copyButton.isConnected) copyButton.textContent = "Copiar"; }, 1400);
        }).catch(() => {});
      }
    }
  });

})();
