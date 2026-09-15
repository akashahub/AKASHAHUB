/* Comunicação do Diagnóstico · material de consulta.
   Sem gerador, sem formulário, sem ligação com anotações da call.
   Evolução futura (IA, treino ao vivo, perfil automático): não implementar aqui. */
const DIAGNOSTICO = {
  kicker: "Estratégia · consulta",
  title: "Comunicação do Diagnóstico",
  lede: "Transformar o que a conversa revelou em uma devolutiva clara. Depois, se fizer sentido, uma proposta ligada ao problema. Não é etapa obrigatória da mesa.",
  what: "Diagnóstico, aqui, é leitura estratégica da situação relatada. Não é diagnóstico clínico. Não é afirmação de intenção oculta.",
  use: [
    "Negociação",
    "Mentoria",
    "Vídeo",
    "Áudio",
    "Texto",
    "Apresentação"
  ],
  pieces: [
    "Fala direta em segunda pessoa",
    "Exemplos concretos da realidade da pessoa",
    "Comportamentos repetidos",
    "Contraste entre objetivo declarado e ação atual",
    "Consequência",
    "Mudança de perspectiva",
    "Saída prática",
    "Oferta pertinente, quando houver"
  ],
  kinds: [
    { t: "Fato relatado", d: "O que a pessoa descreveu como aconteceu." },
    { t: "Citação literal", d: "A redação original, quando você anotou." },
    { t: "Interpretação", d: "Sua hipótese. Dizer que é hipótese." },
    { t: "Ausente", d: "O que ainda não foi confirmado. Perguntar antes de concluir." }
  ],
  never: [
    "Inventar fala, valor, causa, perda ou intenção",
    "Tratar discordância como negação ou resistência",
    "Aumentar certeza só porque o tom ficou mais firme",
    "Trocar o fato quando troca o estilo",
    "Usar PNL ou “perfil psicológico” como prova"
  ],
  seq: [
    {
      id: "A",
      t: "Retomar o objetivo",
      f: "Mostrar que você ouviu o que ela pretende alcançar.",
      ex: "Você me disse que quer aumentar as vendas sem continuar dependendo de indicação."
    },
    {
      id: "B",
      t: "Apresentar as evidências",
      f: "Dois ou três exemplos concretos da conversa.",
      ex: "Hoje você responde quando aparece alguém interessado, mas não tem rotina de prospecção e não acompanha as propostas depois do envio."
    },
    {
      id: "C",
      t: "Mostrar a contradição",
      f: "Relacionar o objetivo à operação atual.",
      ex: "Você quer previsibilidade, mas sua operação comercial ainda depende de alguém tomar a iniciativa por você."
    },
    {
      id: "D",
      t: "Explicar a consequência",
      f: "Usar o que já foi relatado. Se for possibilidade, dizer que é possibilidade.",
      ex: "Isso ajuda a explicar a oscilação que você descreveu: semanas com movimento e semanas em que você não sabe de onde virá a próxima venda."
    },
    {
      id: "E",
      t: "Oferecer uma leitura",
      f: "Interpretação com firmeza proporcional às evidências.",
      ex: "Pelo que você trouxe, minha leitura é que falta uma rotina comercial que você consiga executar e acompanhar."
    },
    {
      id: "F",
      t: "Validar",
      f: "Antes de avançar. Sempre. Discordância abre pergunta, não prova de resistência.",
      ex: "Isso descreve bem o que acontece, ou tem alguma coisa importante que eu ainda não considerei?"
    },
    {
      id: "G",
      t: "Apresentar o caminho",
      f: "O que precisa mudar, em termos concretos.",
      ex: "O próximo passo seria organizar quem você aborda, como apresenta a oferta e quando retoma cada proposta."
    },
    {
      id: "H",
      t: "Conectar à oferta",
      f: "Só depois da validação. Só com escopo, prazo e condições reais cadastrados.",
      ex: "É nessa parte que meu trabalho pode ajudar. A proposta inclui estruturar essa rotina com você, organizar o acompanhamento e revisar a execução."
    },
    {
      id: "I",
      t: "Combinar o próximo passo",
      f: "Uma decisão clara. Sem pressão artificial.",
      ex: "Quer que eu te mostre o escopo e o investimento para avaliar se isso faz sentido agora?"
    }
  ],
  styles: [
    {
      id: "consultivo",
      t: "Consultivo",
      d: "Investigativo, claro, colaborativo.",
      ex: "Você busca previsibilidade, mas ainda não estabeleceu uma rotina de prospecção."
    },
    {
      id: "direto",
      t: "Direto",
      d: "Objetivo, firme, pouca ornamentação.",
      ex: "Sem uma rotina de prospecção, você continua dependendo das oportunidades que aparecem."
    },
    {
      id: "acido",
      t: "Ácido",
      d: "Provocativo, contraste forte. Confronta o comportamento. Não humilha a pessoa.",
      ex: "Você cobra previsibilidade do faturamento, mas deixa a prospecção para quando sobra tempo."
    },
    {
      id: "acolhedor",
      t: "Acolhedor",
      d: "Reconhece a dificuldade. Mantém firmeza sobre o que precisa mudar.",
      ex: "Com tanta coisa concentrada em você, a prospecção ficou sem espaço. Precisamos criar uma rotina que caiba na sua realidade."
    },
    {
      id: "executivo",
      t: "Executivo",
      d: "Processo, impacto, prioridade, decisão, resultado.",
      ex: "O gargalo identificado é a ausência de uma rotina comercial. A prioridade é definir frequência, responsáveis e acompanhamento."
    }
  ],
  factLock: "Os cinco estilos acima usam o mesmo fato. Trocar o tom não inventa evidência nem aumenta a certeza.",
  acido: {
    levels: [
      { t: "Leve", d: "Contraste curto. Pouca repetição." },
      { t: "Moderado", d: "Contraste nítido. Uma repetição ritmada, se o fato aguentar." },
      { t: "Forte", d: "Mais conciso. Pausa antes da consequência. Ainda sem insulto." }
    ],
    tools: [
      "Você diz que quer X, mas mantém Y.",
      "Você adia, você reorganiza, você espera.",
      "Exemplo real da conversa, não tipo genérico.",
      "Pergunta que evidencia a contradição.",
      "Pausa antes da consequência e da virada."
    ],
    avoid: [
      "Generalização sobre pobres, ricos ou qualquer grupo",
      "Preguiça, hipocrisia ou medo como fato sem evidência",
      "Dificuldade financeira como falha de caráter",
      "Vulnerabilidade virando pressão de fechamento",
      "Criar dependência da sua solução",
      "Escolher ácido por “temperamento”"
    ]
  },
  outputs: [
    { t: "Mapa da leitura", d: "Objetivo, evidências, gargalo, consequência, hipótese, pergunta de validação, caminho, oferta se houver." },
    { t: "Devolutiva curta", d: "Cerca de 30 a 45 segundos. Não encher de invenção para caber no relógio." },
    { t: "Devolutiva completa", d: "Cerca de 1 a 2 minutos. Mesma regra: só o que a conversa sustentou." },
    { t: "Roteiro guiado", d: "Frases curtas e palavras-chave. Não ler um texto inteiro na call." },
    { t: "Mensagem pós-call", d: "O que foi validado, recomendação, próximo passo combinado." },
    { t: "Transição para proposta", d: "Problema validado → objetivo → entregas reais." },
    { t: "Perguntas pendentes", d: "O que falta esclarecer antes de concluir ou ofertar." }
  ],
  offer: [
    "Problema validado",
    "Objetivo",
    "Caminho recomendado",
    "Entregas",
    "O que depende da pessoa",
    "Limites do escopo",
    "Prazo realista",
    "Investimento e condições cadastrados",
    "Como o progresso será acompanhado",
    "Próximo passo"
  ],
  offerRules: [
    "Usar somente preço, prazo, prova, garantia e condição que você cadastrou.",
    "Compatibilidade parcial: dizer quais partes a oferta atende.",
    "Sem compatibilidade: outro próximo passo. Não forçar a venda."
  ],
  study: [
    { t: "Observação versus julgamento", d: "“Não acompanha proposta depois do envio” é observação. “Não quer crescer” é julgamento." },
    { t: "Fato versus interpretação", d: "Fato: o que foi dito ou mostrado. Interpretação: a leitura. Nomeie a diferença na boca." },
    { t: "Contradição sem presunção", d: "Objetivo X e ação Y podem coexistir por cansaço, falta de método ou escolha. Pergunte. Não decida o motivo sozinho." },
    { t: "Exemplos concretos", d: "Nome, frequência, o que aconteceu na semana. “Você não é comercial” não serve." },
    { t: "Ritmo em segunda pessoa", d: "Você. Você. Você. Só quando cada frase aponta para um fato da conversa." },
    { t: "Desconforto sem humilhação", d: "O impacto vem da precisão. Não do volume. Não do apelido." },
    { t: "Validar a leitura", d: "A pergunta F vem antes da oferta. Sempre." },
    { t: "Corrigir leitura incompleta", d: "“O que eu ainda não considerei?” Depois revisa o mapa. Não insiste no texto original." },
    { t: "Proposta depois da validação", d: "Oferta é consequência da leitura aceita, não o motor da leitura." }
  ],
  cases: [
    {
      t: "Negócio · vendas",
      data: "Quer previsibilidade. Só atende quem chega. Não retoma proposta.",
      read: "Falta rotina comercial executável.",
      limit: "Não sabemos se é tempo, método ou recusa de papel comercial."
    },
    {
      t: "Trabalho · execução",
      data: "Quer entregar o projeto neste trimestre. Toda semana reabre o escopo.",
      read: "O gargalo é recorte, não esforço.",
      limit: "Pode haver um decisor externo. Ainda não perguntamos."
    },
    {
      t: "Hábito",
      data: "Quer treinar de manhã. Relatou três alarmes e o celular na cama.",
      read: "O ambiente ganha do plano.",
      limit: "Não atribuir preguiça. O fato é o ambiente."
    },
    {
      t: "Posicionamento",
      data: "Quer ser visto como referência. Publica quando sobra ânimo. Sem tese repetida.",
      read: "Falta uma frase e uma cadência, não um palco maior.",
      limit: "Não afirmar “medo de se expor” sem ela ter dito."
    }
  ],
  replies: [
    { hear: "Sim, é isso.", do: "Agradece a correção zero. Segue para o caminho. Só então, se couber, a oferta." },
    { hear: "Você entendeu errado.", do: "“O que eu li torto?” Anota. Revisa a leitura. Não defende o texto." },
    { hear: "Isso é só parte do problema.", do: "“Qual a outra parte?” Incorpora. Não trata como objeção a vencer." },
    { hear: "Já tentei esse caminho.", do: "“O que tentou, por quanto tempo, o que quebrou?” Pode ser método, dose ou apoio. Ainda não sabemos." },
    { hear: "Agora não tenho orçamento.", do: "Confirma o dado. Não diagnostica caráter. Oferece próximo passo honesto: recorte, prazo, ou encerrar." },
    { hear: "Quero pensar.", do: "Combina o que ela vai pensar e até quando vocês se falam. Não transforma pausa em guerra." }
  ],
  later: [
    "Gerar devolutiva a partir das anotações da negociação",
    "Comparar estilos com um clique sobre os mesmos fatos",
    "Treino com caso fictício e avaliação",
    "Salvar leitura validada no histórico da call",
    "Análise assistida por IA de preferências declaradas"
  ],
  bonus: {
    title: "Leitura de Perfil",
    blurb: "Observe como a pessoa prefere conversar, avaliar e decidir. Use para adaptar a comunicação. Não para cravar uma personalidade.",
    future: "Análise assistida por IA: melhoria futura. Nesta versão não existe botão que analise sozinho.",
    q: [
      "Você prefere que eu comece pelo resumo ou pelos detalhes?",
      "O que você precisa entender para avaliar se isso faz sentido?",
      "Qual critério mais pesa na sua decisão?",
      "Você prefere ver um exemplo, os números ou uma demonstração?",
      "Como costuma avaliar uma contratação desse tipo?",
      "Além de você, alguém participa dessa decisão?",
      "Você prefere conversar sobre a proposta agora ou receber um resumo para analisar?",
      "O que funcionou e o que incomodou nas suas experiências anteriores?"
    ],
    qNote: "Duas ou três perguntas pertinentes. O que ela já revelou espontaneamente vale mais do que um teste.",
    dims: [
      { t: "Apresentação", items: ["Prefere resumo", "Prefere detalhes", "Depende do assunto", "Ainda não observado"] },
      { t: "Formato (pode ser mais de um)", items: ["Exemplos", "Números e evidências", "Demonstração", "Conversa e perguntas", "Resumo escrito", "Ainda não observado"] },
      { t: "Ritmo", items: ["Quer avançar nesta conversa", "Quer tempo para analisar", "Depende de informações adicionais", "Ainda não definido"] },
      { t: "Decisão", items: ["Decide sozinha, conforme informado", "Decide com outras pessoas", "Processo ainda não esclarecido"] }
    ],
    source: ["Declarado pela pessoa", "Observado por mim", "Hipótese a confirmar"],
    card: [
      { t: "Como prefere receber a proposta", ex: "Resumo inicial, seguido dos números." },
      { t: "O que pesa na decisão", ex: "Prazo e suporte após a implementação." },
      { t: "O que ainda falta esclarecer", ex: "Quem aprova o investimento." },
      { t: "Como adaptar minha comunicação", ex: "Três pontos principais, cronograma, espaço para perguntas." },
      { t: "Base da leitura", ex: "Pediu objetividade e perguntou duas vezes sobre suporte." }
    ],
    adapt: [
      "Pediu objetividade: versão curta.",
      "Pediu detalhes: evidências junto da leitura.",
      "Precisa consultar outra pessoa: resumo compartilhável com escopo e condições.",
      "O resumo não muda fato, preço, condição real nem o conteúdo essencial da proposta.",
      "O tom continua sendo escolha sua. O sistema não escolhe ácido por temperamento."
    ],
    instead: [
      { bad: "Prolixo", good: "Deu respostas longas e abriu vários assuntos nesta conversa." },
      { bad: "Instável", good: "Mudou a prioridade declarada durante a conversa. Motivo ainda não esclarecido." },
      { bad: "Indeciso", good: "Ainda precisa comparar duas alternativas." },
      { bad: "Difícil", good: "Questionou o prazo e pediu evidências sobre a entrega." }
    ],
    temp: {
      note: "Colérico, sanguíneo, melancólico e fleumático são modelos antigos de estudo. Não são diagnóstico. Não são classificação científica de um lead. Não atribuir a partir de duas respostas.",
      split: [
        "Temperamento: referência de estudo, opcional, nunca obrigatória.",
        "Comportamento nesta conversa: o que se viu hoje.",
        "Condição momentânea: cansaço, pressa, contexto. Não é o caráter da pessoa."
      ]
    }
  }
};

function renderDiagnostico() {
  const D = DIAGNOSTICO;
  const h = typeof head === "function" ? head : function (k, t, l) {
    return `<div class="hero"><div><p class="kicker">${esc(k)}</p><h1>${esc(t)}</h1><p class="lede">${esc(l)}</p></div></div>`;
  };
  return `
    ${h(D.kicker, D.title, D.lede)}
    <section class="panel">
      <p class="lede">${esc(D.what)}</p>
      <p class="flag ok" style="margin-top:12px">Consulta. Não interrompe a mesa. Não precisa preencher nada para avançar a call.</p>
    </section>
    <div class="grid" style="margin-top:16px">
      <section class="panel">
        <p class="kicker">Serve para</p>
        <ul class="pill-row">${D.use.map((s) => `<li class="pill">${esc(s)}</li>`).join("")}</ul>
        <p class="lbl">Peças da linguagem</p>
        <ul class="posture">${D.pieces.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      </section>
      <section class="panel">
        <p class="kicker" style="color:var(--warn)">Distinguir internamente</p>
        <div class="stack">${D.kinds.map((k) => `<div><p class="kicker">${esc(k.t)}</p><p class="muted">${esc(k.d)}</p></div>`).join("")}</div>
        <p class="flag danger" style="margin-top:16px">Não inventar</p>
        <ul class="posture">${D.never.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      </section>
    </div>

    <h2 class="display page-h">Sequência da devolutiva</h2>
    <p class="muted" style="margin:-8px 0 16px">Base flexível. Validar (F) vem antes da oferta (H). Toque para copiar o exemplo.</p>
    <div class="stack">${D.seq.map((s) => `<section class="panel">
      <p class="mono accent">${esc(s.id)}</p>
      <h2 class="display">${esc(s.t)}</h2>
      <p class="muted" style="margin:8px 0 12px">${esc(s.f)}</p>
      ${line(s.ex, true)}
    </section>`).join("")}</div>

    <h2 class="display page-h">Estilos · o mesmo fato</h2>
    <p class="muted" style="margin:-8px 0 16px">${esc(D.factLock)}</p>
    <div class="grid-3">${D.styles.map((s) => `<section class="panel">
      <p class="kicker">${esc(s.t)}</p>
      <p class="muted" style="margin:8px 0 12px">${esc(s.d)}</p>
      ${line(s.ex, true)}
    </section>`).join("")}</div>

    <h2 class="display page-h">Modo ácido</h2>
    <div class="grid">
      <section class="panel">
        <p class="kicker">Intensidade</p>
        <p class="muted" style="margin-bottom:12px">Muda concisão, contraste e ritmo. Não aumenta insulto, ameaça, constrangimento ou acusação.</p>
        ${D.acido.levels.map((x) => `<p class="lbl">${esc(x.t)}</p><p class="muted">${esc(x.d)}</p>`).join("")}
        <p class="lbl">Recursos, se o fato aguentar</p>
        ${D.acido.tools.map((t) => line(t, false)).join("")}
      </section>
      <section class="panel">
        <p class="kicker" style="color:var(--danger)">Evitar</p>
        <ul class="posture">${D.acido.avoid.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        <p class="flag ok" style="margin-top:16px">O impacto vem da precisão da observação.</p>
      </section>
    </div>

    <h2 class="display page-h">Saídas · o que escrever depois</h2>
    <div class="grid-3">${D.outputs.map((o) => `<section class="panel"><h3 class="display">${esc(o.t)}</h3><p class="muted">${esc(o.d)}</p></section>`).join("")}</div>
    <div class="grid" style="margin-top:16px">
      <section class="panel">
        <p class="kicker">Construção da oferta</p>
        <ol class="posture">${D.offer.map((s, i) => `<li><span class="mono accent">${String(i + 1).padStart(2, "0")}</span> ${esc(s)}</li>`).join("")}</ol>
      </section>
      <section class="panel">
        <p class="kicker">Regras</p>
        <ul class="posture">${D.offerRules.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      </section>
    </div>

    <h2 class="display page-h">Estudar</h2>
    <div class="stack">${D.study.map((s) => `<section class="panel"><h3 class="display">${esc(s.t)}</h3><p class="muted">${esc(s.d)}</p></section>`).join("")}</div>
    <h3 class="display page-h">Exemplos comentados</h3>
    <div class="grid">${D.cases.map((c) => `<section class="panel">
      <p class="kicker">${esc(c.t)}</p>
      <p class="lbl">Dados</p><p>${esc(c.data)}</p>
      <p class="lbl">Leitura</p><p>${esc(c.read)}</p>
      <p class="lbl">Limite</p><p class="muted">${esc(c.limit)}</p>
    </section>`).join("")}</div>

    <h2 class="display page-h">Treinar a resposta</h2>
    <p class="muted" style="margin:-8px 0 16px">Não transformar toda resposta em objeção a vencer. Continuar com pergunta e revisão da leitura.</p>
    <div class="stack">${D.replies.map((r) => `<section class="panel">
      <p class="display italic muted" style="font-size:1.15rem">“${esc(r.hear)}”</p>
      <p class="muted" style="margin-top:10px">${esc(r.do)}</p>
    </section>`).join("")}</div>

    <details class="panel" style="margin-top:40px">
      <summary style="cursor:pointer">
        <p class="kicker">Bônus opcional</p>
        <h2 class="display" style="margin-top:6px">${esc(D.bonus.title)}</h2>
        <p class="muted" style="margin-top:8px">${esc(D.bonus.blurb)}</p>
      </summary>
      <p class="flag" style="margin:16px 0;color:var(--warn)">${esc(D.bonus.future)}</p>
      <p class="lbl">Perguntas rápidas · sugestão, não roteiro obrigatório</p>
      <p class="muted" style="margin-bottom:8px">${esc(D.bonus.qNote)}</p>
      ${D.bonus.q.map((q) => line(q, false)).join("")}
      <h3 class="display" style="margin:24px 0 12px">Marcações manuais</h3>
      <p class="muted" style="margin-bottom:12px">Nesta versão: leia e anote no caderno se quiser. Nada aqui grava sozinho. Nenhum campo trava a mesa.</p>
      <div class="grid-3">${D.bonus.dims.map((d) => `<section class="box">
        <p class="lbl" style="color:var(--accent)">${esc(d.t)}</p>
        <ul>${d.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      </section>`).join("")}</div>
      <p class="lbl">Ao lado da marcação, indicar a base</p>
      <ul class="pill-row">${D.bonus.source.map((s) => `<li class="pill">${esc(s)}</li>`).join("")}</ul>
      <h3 class="display" style="margin:24px 0 12px">Resumo prático</h3>
      <div class="stack">${D.bonus.card.map((c) => `<section class="box">
        <p class="lbl" style="color:var(--accent)">${esc(c.t)}</p>
        <p>${esc(c.ex)}</p>
      </section>`).join("")}</div>
      <h3 class="display" style="margin:24px 0 12px">Como adaptar a devolutiva</h3>
      <ul class="posture">${D.bonus.adapt.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      <h3 class="display" style="margin:24px 0 12px">Em vez de rótulo, o que se viu</h3>
      <div class="stack">${D.bonus.instead.map((x) => `<section class="box">
        <p class="lbl">Não: ${esc(x.bad)}</p>
        <p>${esc(x.good)}</p>
      </section>`).join("")}</div>
      <section class="box warn" style="margin-top:16px">
        <p class="lbl">Temperamentos · só estudo</p>
        <p>${esc(D.bonus.temp.note)}</p>
        <ul style="margin-top:12px">${D.bonus.temp.split.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      </section>
    </details>

    <section class="panel" style="margin-top:16px">
      <p class="kicker">Reservado para depois</p>
      <ul class="posture">${D.later.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      <p class="muted" style="margin-top:12px">Cada sugestão futura deverá trazer trecho que a sustenta, se é declaração, observação ou hipótese, o que falta confirmar, e uma adaptação prática. Sem percentual fictício de certeza. Sem inferir saúde mental, honestidade, capacidade financeira ou disposição de compra.</p>
    </section>
  `;
}
