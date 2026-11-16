/* Apoio para quem está começando. Não grava dados novos e não mexe nas regras. */
(function () {
  var MENTORS = [
    "yanfili.simon@gmail.com",
    "plmacramo@gmail.com",
    "sendatantrica@gmail.com",
    "opatricksimon@gmail.com"
  ];
  var MENTOR_UID = "1GO7dRdFUFg2NwYwzOwjvtWfpAS2";

  var APPS = {
    essencia: app("Essência OS", "Fase 1 · Arquitetura de Essência", "Ler a história como relato. Separar o que aconteceu, o que a pessoa imagina e o que ela já decidiu.", ["De onde ela veio e o que ainda pesa", "Um valor que ela não abre mão", "Uma frase de quem ela ajuda", "Um passo de 7 dias"]),
    "identity-studio": app("Identity Studio", "Fase 1 · Arquitetura de Essência", "Transformar o relato em identidade organizada: atributos, linguagem e limites.", ["3 palavras que definem", "O que a marca nunca faz", "Como ela quer ser reconhecida", "O que ainda está confuso"]),
    "marketing-pessoal": app("Marketing Pessoal OS", "Fase 1 · Arquitetura de Essência", "Sair da biografia e chegar numa mensagem que outra pessoa entende.", ["Para quem ela fala", "Qual problema ela resolve em uma frase", "Onde essa pessoa já aparece", "O que publicar nesta semana"]),
    "branding-pessoal": app("Branding Pessoal", "Fase 1 · Arquitetura de Essência", "Ver se a voz, o tom e os diferenciais combinam com a essência já escrita.", ["Tom de voz em 3 adjetivos", "O que parece a pessoa e o que parece moda", "Uma prova concreta de diferenciação", "O que aplicar no perfil agora"]),
    "constelacao-familiar": app("Constelação Familiar", "Fase 1 · Arquitetura de Essência", "Tratar como leitura reflexiva, não como diagnóstico. Procurar padrão, não culpa.", ["Qual relação ainda organiza decisões", "Qual padrão se repete no negócio", "O que é hipótese e o que é fato", "O que não deve ser exposto em público"]),
    "registros-akashicos": app("Registros Akáshicos", "Fase 1 · Arquitetura de Essência", "Acolher a reflexão e traduzir o insight em uma decisão prática, sem mística vazia.", ["O que a pessoa queria entender", "Qual frase ficou", "O que isso muda numa escolha real", "O que fica só entre mentor e mentorado"]),
    lideranca: app("Liderança", "Fase 1 · Arquitetura de Essência", "Ver o estilo real, não o estilo desejado. Cruzar com o que a equipe sente.", ["Como decide sob pressão", "O que delega e o que segura", "Qual valor de liderança é visível", "Um ajuste de comunicação esta semana"]),
    comunicacao: app("Comunicação", "Fase 1 · Arquitetura de Essência", "Checar se a mensagem cabe na boca da pessoa e na cabeça de quem escuta.", ["Estilo natural", "3 mensagens que ela repetiria", "Onde a presença trava", "Um texto curto para testar"]),
    "authority-leadership-os": app("Authority & Leadership OS", "Fase 1 · Arquitetura de Essência", "Juntar reputação, competência e voz. Autoridade aqui é prova, não volume.", ["O que ela já fez que sustenta autoridade", "Onde a fama está na frente da entrega", "Quem já confia nela", "Uma peça de autoridade para os próximos 15 dias"]),
    "website-studio": app("Website Studio", "Fase 2 · Império Digital", "Ver se o site tem uma função, não só páginas. Começar pela primeira tela e pelo pedido claro.", ["Para quem é o site", "Qual ação a visita deve fazer", "O que não pode faltar na primeira dobra", "O que publicar primeiro"]),
    "app-builder": app("App Builder", "Fase 2 · Império Digital", "Impedir que vire uma lista de telas. Exigir usuário, tarefa e dado.", ["Qual tarefa o app resolve", "Quem usa toda semana", "Qual dado precisa guardar", "O que fica de fora na primeira versão"]),
    "funil-builder": app("Funil Builder", "Fase 2 · Império Digital", "Desenhar a jornada, não um monte de páginas. Uma entrada, uma oferta, um próximo passo.", ["De onde a pessoa chega", "O que ela entende em 10 segundos", "Qual oferta está no meio", "Onde a conversa vira pedido"]),
    "crm-inteligente": app("CRM Inteligente", "Fase 2 · Império Digital", "Olhar relação e próximo contato, não só nome na lista.", ["Quem são os 10 contatos que importam", "Em que etapa cada um está", "Qual conversa está parada", "Qual mensagem sai hoje"]),
    "sdr-os": app("SDR OS", "Fase 2 · Império Digital", "Separar prospecção de insistência. Qualificar antes de oferecer.", ["Quem vale abordar", "Qual pergunta abre a conversa", "O que desqualifica", "Um roteiro de 5 linhas"]),
    "ia-studio": app("IA Studio", "Fase 2 · Império Digital", "Exigir um caso de uso real. Sem isso, o prompt é enfeite.", ["Qual tarefa humana vai diminuir", "Qual entrada e qual saída", "Onde a pessoa ainda revisa", "Um prompt testável esta semana"]),
    "produtos-digitais": app("Produtos Digitais", "Fase 2 · Império Digital", "Ver se existe oferta ou só ideia. Preço, entrega e para quem.", ["O que a pessoa compra", "Como recebe", "O que está incluído e o que não está", "Qual versão mínima vende agora"]),
    "central-de-ativos": app("Central de Ativos", "Fase 2 · Império Digital", "Inventariar o que já existe antes de criar coisa nova.", ["O que já está no ar", "O que está pela metade", "O que depende só do fundador", "O que organizar primeiro"]),
    "fluxo-de-caixa": app("Fluxo de Caixa OS", "Fase 3 · Alinhamento Financeiro", "Traduzir texto em entradas, saídas e prazo. Sem número, ainda não é caixa.", ["De onde entra dinheiro", "O que sai todo mês", "Por quantos dias o caixa aguenta", "O que olhar toda semana"]),
    precificacao: app("Precificação", "Fase 3 · Alinhamento Financeiro", "Não discutir preço antes de custo, margem e o que a conta precisa pagar.", ["O que entra no custo", "Qual margem mínima", "O que o preço atual não cobre", "Um preço mínimo para testar"]),
    "indicadores-financeiros": app("Indicadores Financeiros", "Fase 3 · Alinhamento Financeiro", "Escolher poucos números que a pessoa entende e consegue ver todo mês.", ["3 números que importam agora", "O que cada um significa em frase simples", "Qual está cego", "Onde anotar daqui para frente"]),
    "metas-financeiras": app("Metas Financeiras", "Fase 3 · Alinhamento Financeiro", "Meta boa cabe no calendário e no caixa. O resto é desejo.", ["Valor e data", "O que precisa acontecer antes", "O que é meta e o que é esperança", "O primeiro marco de 30 dias"]),
    "planejamento-financeiro": app("Planejamento Financeiro", "Fase 3 · Alinhamento Financeiro", "Organizar reserva, gasto fixo e o que pode esperar.", ["O que é fixo", "O que é reserva", "O que pode ser adiado", "Uma regra simples para o mês"]),
    "sustentabilidade-ofertas": app("Sustentabilidade das Ofertas", "Fase 3 · Alinhamento Financeiro", "Ver se a oferta paga o tempo e o custo, ou só parece bonita.", ["Qual oferta cansa", "Qual oferta sobra dinheiro", "O que falta para ela se pagar", "O que manter, ajustar ou pausar"]),
    "decisoes-comerciais": app("Decisões Comerciais", "Fase 3 · Alinhamento Financeiro", "Cada sim comercial tem efeito no caixa. Fazer a pessoa ver o custo do sim.", ["Qual decisão está na mesa", "O que ela muda na entrada e na saída", "O que acontece se disser não", "A decisão desta semana"]),
    "acompanhamento-resultados": app("Acompanhamento de Resultados", "Fase 3 · Alinhamento Financeiro", "Comparar o que foi previsto com o que aconteceu, sem enfeitar.", ["O que foi combinado", "O que aconteceu", "A diferença em uma frase", "O ajuste do próximo ciclo"]),
    "dependencias-fundador": app("Dependências do Fundador", "Fase 4 · Expansão", "Achar o que para se a pessoa sair dois dias. Sem drama, com nome e dono.", ["O que só ela sabe", "O que só ela autoriza", "O risco se ela faltar", "A primeira coisa para ensinar a alguém"]),
    "processos-operacionais": app("Processos Operacionais", "Fase 4 · Expansão", "Transformar 'a gente se vira' em entrada, passos e pronto.", ["Qual processo se repete", "Quem começa e quem termina", "Onde trava", "O processo que vale escrever primeiro"]),
    responsabilidades: app("Responsabilidades e Funções", "Fase 4 · Expansão", "Um nome por entrega. Função compartilhada demais vira função de ninguém.", ["Quem decide", "Quem executa", "Quem confere", "O que está sem dono"]),
    padronizacao: app("Padronização", "Fase 4 · Expansão", "Padrão é o que outra pessoa consegue repetir sem perguntar.", ["O que já tem jeito certo", "O que cada um faz de um modo", "Qual padrão economiza erro", "Um checklist curto"]),
    documentacao: app("Documentação", "Fase 4 · Expansão", "Documento serve para alguém agir sem a pessoa na sala.", ["O que está só na cabeça", "Quem vai ler", "O que o texto precisa permitir fazer", "O primeiro documento útil"]),
    "fluxos-trabalho": app("Fluxos de Trabalho", "Fase 4 · Expansão", "Ver a sequência real, não o organograma bonito.", ["Qual pedido entra", "Por quais mãos passa", "Onde espera", "O que simplificar"]),
    "acompanhamento-operacao": app("Acompanhamento da Operação", "Fase 4 · Expansão", "Olhar o que foi feito, não o que foi prometido na reunião.", ["O que estava previsto", "O que andou", "O que travou e quem vê", "O ritual semanal de 20 minutos"]),
    divulgacao: app("Divulgação e Presença", "Fase 4 · Expansão", "Separar presença orgânica de anúncio pago. Olhar o que saiu, não o plano.", ["Onde a marca aparece", "O que sai esta semana", "O que é orgânico e o que é pago", "Como saber se alguém viu"]),
    comunidade: app("Comunidade", "Fase 5 · Legado", "Comunidade é ritmo e pertencimento, não um grupo parado.", ["Quem faz parte", "O que as pessoas vêm buscar", "Qual encontro ou rito existe", "O que falta para não depender do fundador"]),
    "transmissao-metodologia": app("Transmissão da Metodologia", "Fase 5 · Legado", "Método que só o fundador explica ainda não foi transmitido.", ["Quais princípios são inegociáveis", "Qual exemplo ensina melhor", "Quem mais consegue ensinar", "O módulo que precisa ser escrito"]),
    "principios-ecossistema": app("Princípios do Ecossistema", "Fase 5 · Legado", "Princípio bom cabe numa regra que outra pessoa aplica.", ["O que não se negocia", "O que é só gosto do fundador", "Como um princípio vira decisão", "Qual princípio escrever primeiro"]),
    continuidade: app("Continuidade", "Fase 5 · Legado", "Perguntar o que continua funcionando se o fundador não estiver na sala.", ["O que já anda sozinho", "O que para", "Quem assume", "O plano mínimo de continuidade"]),
    "relacionamento-longo-prazo": app("Relacionamento de Longo Prazo", "Fase 5 · Legado", "Relação longa tem cadência, não só carinho.", ["Quem fica depois da venda", "De quanto em quanto tempo há contato", "O que se entrega nesse contato", "O próximo ciclo"]),
    preservacao: app("Preservação e Transmissão", "Fase 5 · Legado", "O que não está registrado se perde com a pessoa.", ["O que precisa ser guardado", "Onde está hoje", "Quem pode acessar", "O que transmitir neste mês"]),
    "evolucao-comunidade": app("Evolução da Comunidade", "Fase 5 · Legado", "Evoluir é mudar o rito com critério, não inventar novidade toda semana.", ["O que a comunidade já sustenta", "O que pediu para mudar", "O que não pode quebrar", "Um experimento pequeno"]),
    "legado-sem-fundador": app("Legado sem o Fundador", "Fase 5 · Legado", "Escrever a casa sem o dono dentro. Nomear o que fica, quem conduz e o que se encerra.", ["O que continua", "O que se encerra", "Quem decide no lugar", "A frase que outra pessoa conseguiria ler e seguir"])
  };

  function app(title, phase, fazer, explorar) {
    return { title: title, phase: phase, fazer: fazer, explorar: explorar };
  }

  function appId() {
    var parts = location.pathname.split("/").filter(Boolean);
    var i = parts.indexOf("afplataforma");
    if (i >= 0 && parts[i + 1]) return parts[i + 1];
    return parts[parts.length - 1] || "";
  }

  function isMentor(user) {
    if (!user) return false;
    if (user.uid && user.uid === MENTOR_UID) return true;
    var email = String(user.email || "").trim().toLowerCase();
    return email.endsWith("@gmail.com") && MENTORS.indexOf(email) !== -1;
  }

  function guide() {
    return APPS[appId()] || {
      title: document.title || "App",
      phase: "AF Plataforma",
      fazer: "Ler as respostas com calma e devolver um próximo passo simples.",
      explorar: ["O que já está claro", "O que ainda é hipótese", "O que fazer em 7 dias"]
    };
  }

  function ensureStyle() {
    if (document.getElementById("af-apoio-style")) return;
    var css = document.createElement("style");
    css.id = "af-apoio-style";
    css.textContent = [
      ".af-privacy{margin:8px 0 18px;padding:12px 14px;border-left:3px solid var(--gold,#e0c27a);background:#ffffff08;border-radius:12px}",
      ".af-privacy p{margin:0;color:var(--muted,#c4b8ce);font-size:13px}",
      ".af-privacy .btn,.af-mentor .btn{margin-top:10px}",
      ".af-mentor{margin-top:22px;padding:16px;border:1px solid #c4b5fd66;border-radius:16px;background:#161022cc}",
      ".af-mentor h3{margin:6px 0 8px;font:600 26px 'Cormorant Garamond',serif}",
      ".af-mentor p,.af-mentor li{color:var(--text,#f7f3ee);font-size:14px}",
      ".af-mentor .af-note{color:var(--muted,#c4b8ce);font-size:12.5px}",
      ".af-quizbar{margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid var(--line,#3a2e47)}",
      ".af-quizmeta{color:var(--gold2,#f4e4b4);font-size:12px;letter-spacing:.08em;text-transform:uppercase}",
      ".af-quizhint{color:var(--muted,#c4b8ce);font-size:13px;margin:6px 0 8px}",
      ".af-quiznav{display:flex;gap:8px}",
      ".af-quiznav button{border:1px solid var(--line,#3a2e47);background:#ffffff10;color:inherit;border-radius:999px;padding:7px 12px;cursor:pointer}",
      ".af-quiznav button:disabled{opacity:.4}",
      ".af-chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}",
      ".af-chip{border:1px solid var(--line,#3a2e47);background:#ffffff0c;color:inherit;border-radius:999px;padding:7px 12px;cursor:pointer;font-size:13px}",
      ".af-chip.on{background:var(--gold,#e0c27a);color:#1b1420;border-color:transparent}"
    ].join("");
    document.head.appendChild(css);
  }

  function note(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("hidden");
    clearTimeout(window.__afToast);
    window.__afToast = setTimeout(function () { el.classList.add("hidden"); }, 2800);
  }

  function copyText(text, ok) {
    function done() { note(ok); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallback(); });
    } else fallback();
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { note("Não consegui copiar. Selecione o texto manualmente."); }
      ta.remove();
    }
  }

  function clean(v) {
    if (v == null) return "";
    if (Array.isArray(v)) return v.filter(Boolean).join(", ");
    if (typeof v === "object") return "";
    return String(v).trim();
  }

  function buildPacket(state) {
    var g = guide();
    var data = (state && state.data) || {};
    var disc = (state && state.discovery) || {};
    var lines = [];
    lines.push("*" + g.title + "*");
    lines.push(g.phase);
    lines.push("");
    lines.push("Cópia para o mentor.");
    lines.push("Estes dados são meus. Só eu acesso eles no app, salvos no meu login. Estou enviando esta cópia por escolha minha.");
    lines.push("");
    var keys = Object.keys(disc);
    Object.keys(data).forEach(function (k) {
      if (k === "uid" || k === "updatedAt") return;
      if (keys.indexOf(k) === -1) keys.push(k);
    });
    if (!keys.length) {
      lines.push("(Ainda não há respostas salvas.)");
    }
    keys.forEach(function (k) {
      if (k === "uid" || k === "updatedAt") return;
      var block = disc[k] || {};
      lines.push("*" + (block.title || k) + "*");
      if (block.questions && block.questions.length) {
        block.questions.forEach(function (q, i) {
          lines.push("Pergunta " + (i + 1) + ": " + q.label);
          if (q.options && q.options.length) lines.push("Opções: " + q.options.join(" | "));
        });
      }
      var saved = clean(data[k]);
      lines.push("Resposta salva: " + (saved || "(ainda vazio)"));
      lines.push("");
    });
    return lines.join("\n").trim();
  }

  function mentorPrompt(state) {
    var g = guide();
    var packet = buildPacket(state);
    return [
      "Você é o mentor da AF Plataforma, dentro de " + g.title + " (" + g.phase + ").",
      "A pessoa preencheu sozinha e enviou as respostas. Ela pode ser leiga. Não corrija o jeito dela falar.",
      "",
      "O que fazer com esta informação:",
      g.fazer,
      "",
      "Possibilidades para explorar ou executar:",
      g.explorar.map(function (item, i) { return (i + 1) + ". " + item; }).join("\n"),
      "",
      "Devolva em mensagem curta de WhatsApp:",
      "1. O que você entendeu, em duas frases.",
      "2. O que é fato, o que é hipótese e o que já é decisão.",
      "3. Três caminhos possíveis, em linguagem simples.",
      "4. Um próximo passo que cabe em 7 dias.",
      "",
      "Respostas da pessoa:",
      packet
    ].join("\n");
  }

  function button(label, cls) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = cls || "btn secondary";
    b.textContent = label;
    return b;
  }

  function mount(state) {
    ensureStyle();
    var content = document.getElementById("content");
    if (!content) return;
    var g = guide();

    // A camada de privacidade é criada uma vez, mas o gate do mentor é
    // reavaliado em cada render, pois o primeiro render pode ocorrer antes do Auth.
    var privacy = content.querySelector(".af-privacy");
    if (!privacy) {
      privacy = document.createElement("div");
      privacy.className = "af-privacy";
      var p = document.createElement("p");
      p.textContent = "Suas respostas ficam vinculadas à sua conta. Você e mentores ou administradores autorizados podem acessá-las conforme as permissões da plataforma. Você também pode copiar e enviar uma cópia pelo WhatsApp.";
      privacy.appendChild(p);
      var copyBtn = button("Copiar tudo para o WhatsApp do mentor");
      copyBtn.addEventListener("click", function () {
        copyText(buildPacket(window.__AF || state || {}), "Copiado. Pode colar no WhatsApp do mentor.");
      });
      privacy.appendChild(copyBtn);
      var title = content.querySelector(".title");
      if (title) title.insertAdjacentElement("afterend", privacy);
      else content.insertBefore(privacy, content.firstChild);
    }

    var user = (state && state.user) || (window.__AF && window.__AF.user) || null;
    var mentor = isMentor(user);
    var existingMentorPanel = content.querySelector(".af-mentor");
    if (!mentor) {
      if (existingMentorPanel) existingMentorPanel.remove();
      return;
    }
    if (existingMentorPanel) return;

    var box = document.createElement("section");
    box.className = "af-mentor";
    var eye = document.createElement("div");
    eye.className = "eyebrow";
    eye.textContent = "Só mentor e admin · Gmail autorizado";
    var h = document.createElement("h3");
    h.textContent = "O que fazer com as respostas de " + g.title;
    var noteP = document.createElement("p");
    noteP.className = "af-note";
    noteP.textContent = "Este bloco apresenta orientação e um prompt de apoio. A leitura dos dados de cada mentorando depende de acesso autorizado ao registro dele; esta área ainda não substitui o painel central de respostas.";
    var fazer = document.createElement("p");
    fazer.textContent = g.fazer;
    var ul = document.createElement("ul");
    g.explorar.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
    var promptBtn = button("Copiar prompt do mentor", "btn");
    promptBtn.addEventListener("click", function () {
      copyText(mentorPrompt(window.__AF || state || {}), "Prompt do mentor copiado.");
    });
    box.appendChild(eye);
    box.appendChild(h);
    box.appendChild(noteP);
    box.appendChild(fazer);
    box.appendChild(ul);
    box.appendChild(promptBtn);
    content.appendChild(box);
  }

  var QUIZ = [
    { test: /por que|porque|importa|motivo/i, options: [
      ["Porque quero clareza para decidir", "Quero clareza para decidir sem me perder."],
      ["Porque isso sustenta o que eu faço", "Isso sustenta o trabalho que eu quero continuar fazendo."],
      ["Porque quero algo que dure", "Quero construir algo que continue mesmo sem eu estar o tempo todo."]
    ]},
    { test: /pr[oó]ximo passo|concreto|esta semana/i, options: [
      ["Escrever com calma", "Meu próximo passo é escrever isso com calma, do meu jeito."],
      ["Mostrar para o mentor", "Meu próximo passo é enviar isso para o mentor e ouvir uma leitura."],
      ["Fazer uma coisa pequena", "Meu próximo passo é uma ação pequena ainda esta semana."]
    ]},
    { test: /diferenc|destaque|único|unica/i, options: [
      ["Uno essência com prática", "Eu me diferencio porque uno quem eu sou com um jeito prático de fazer."],
      ["Vou devagar e deixo claro", "Eu me diferencio porque prefiro clareza a promessa grande."],
      ["Fico perto de quem eu ajudo", "Eu me diferencio porque acompanho de perto, sem sumir depois."]
    ]},
    { test: /resultado|12 meses|quero ver/i, options: [
      ["Ter uma base organizada", "Em um ano quero ter uma base organizada, não só ideias soltas."],
      ["Atender melhor poucas pessoas", "Quero atender melhor um grupo menor, com mais clareza."],
      ["Ter algo funcionando sem mim o dia todo", "Quero que uma parte já funcione sem eu carregar tudo."]
    ]}
  ];

  function chipsFor(label) {
    for (var i = 0; i < QUIZ.length; i++) {
      if (QUIZ[i].test.test(label || "")) return QUIZ[i].options;
    }
    return [
      ["Ainda estou entendendo", "Ainda estou entendendo isso. Quero ir com calma."],
      ["Tenho uma ideia simples", "Tenho uma ideia simples e quero organizar em poucas frases."],
      ["Quero decidir com o mentor", "Ainda não fechei isso. Quero decidir com a ajuda do mentor."]
    ];
  }

  function enhanceField(field) {
    if (field.querySelector(".options") || field.querySelector(".af-chips")) return;
    var ta = field.querySelector("textarea");
    if (!ta) return;
    var label = field.querySelector("label");
    var wrap = document.createElement("div");
    wrap.className = "af-chips";
    var hint = document.createElement("p");
    hint.className = "af-quizhint";
    hint.textContent = "Resposta rápida, se essa pergunta travar. Se você já souber, escreva direto.";
    chipsFor(label ? label.textContent : "").forEach(function (pair) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "af-chip";
      b.textContent = pair[0];
      b.addEventListener("click", function () {
        wrap.querySelectorAll(".af-chip").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        ta.value = pair[1];
        ta.focus();
      });
      wrap.appendChild(b);
    });
    var own = document.createElement("button");
    own.type = "button";
    own.className = "af-chip";
    own.textContent = "Já sei, vou escrever";
    own.addEventListener("click", function () {
      wrap.querySelectorAll(".af-chip").forEach(function (x) { x.classList.remove("on"); });
      own.classList.add("on");
      ta.focus();
    });
    wrap.appendChild(own);
    field.appendChild(hint);
    field.appendChild(wrap);
  }

  function quizify() {
    var box = document.getElementById("modalQuestions");
    if (!box) return;
    // Os aplicativos substituem o conteúdo do modal a cada nova descoberta.
    // Remover a navegação anterior permite configurar novamente a próxima sequência.
    var previousBar = box.querySelector(".af-quizbar");
    if (previousBar) previousBar.remove();
    var fields = Array.prototype.slice.call(box.querySelectorAll(":scope > .field"));
    if (!fields.length) return;
    box.dataset.afQuiz = "1";
    fields.forEach(enhanceField);
    var i = 0;
    var bar = document.createElement("div");
    bar.className = "af-quizbar";
    bar.innerHTML = '<div class="af-quizmeta"></div><p class="af-quizhint">Uma pergunta de cada vez. Se já tiver decidido, é só escolher ou escrever.</p><div class="af-quiznav"><button type="button" data-af="prev">Anterior</button><button type="button" data-af="next">Próxima</button></div>';
    box.insertBefore(bar, box.firstChild);
    var meta = bar.querySelector(".af-quizmeta");
    var prev = bar.querySelector("[data-af=prev]");
    var next = bar.querySelector("[data-af=next]");
    function show() {
      fields.forEach(function (f, idx) { f.style.display = idx === i ? "" : "none"; });
      meta.textContent = "Pergunta " + (i + 1) + " de " + fields.length;
      prev.disabled = i === 0;
      next.textContent = i === fields.length - 1 ? "Ver todas" : "Próxima";
    }
    prev.addEventListener("click", function () { if (i > 0) { i--; show(); } });
    next.addEventListener("click", function () {
      if (i < fields.length - 1) { i++; show(); return; }
      fields.forEach(function (f) { f.style.display = ""; });
      meta.textContent = "Pode revisar e gerar a sugestão.";
      next.disabled = true;
    });
    show();
  }

  window.AfApoio = { mount: mount, quizify: quizify, isMentor: isMentor };
})();
