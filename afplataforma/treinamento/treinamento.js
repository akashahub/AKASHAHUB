const STEPS = [
  {
    id: "papel", n: "01", t: "Papel e responsabilidade",
    obj: "Entender que vender Legado é orientar uma decisão, não pressionar alguém.",
    avancar: "A pessoa explica seu papel e aceita respeitar o momento e a decisão do potencial cliente.",
    sair: "Acredita que precisa fechar a qualquer custo ou promete o que não controla.",
    speak: [
      "Você não está aqui para empurrar uma mentoria. Está aqui para compreender a pessoa e explicar com clareza se a Arquitetura de Legado pode fazer sentido para ela.",
      "Venda consultiva começa com escuta, contexto e honestidade. Um não também pode ser o resultado correto.",
      "Você representa uma metodologia integrada e precisa saber o que conhece, o que ainda precisa confirmar e quando chamar o mentor."
    ],
    qs: ["Como você explica seu papel em uma frase?", "O que faz quando a pessoa não tem alinhamento com a proposta?"],
    hint: "Confiança vem de clareza, competência e respeito à decisão — não de pressão.",
    plus: "A qualidade da venda começa antes da oferta: começa na postura de quem conduz a conversa."
  },
  {
    id: "metodo", n: "02", t: "O que é a Arquitetura de Legado",
    obj: "Explicar a proposta integrada sem reduzi-la a marketing, finanças ou espiritualidade.",
    avancar: "Explica a jornada com palavras próprias e sem inventar entregas.",
    sair: "Apresenta Legado como se fosse apenas a antiga AF Plataforma ou promete resultados garantidos.",
    speak: [
      "A Arquitetura de Legado é uma jornada de desenvolvimento e construção que conecta a essência da pessoa à forma como ela se posiciona, organiza seu negócio e constrói algo que possa continuar gerando valor.",
      "Ela integra quatro frentes: Arquitetura de Essência, Império Digital, Alinhamento Financeiro e Tecnologia da Alma.",
      "O trabalho combina investigação, estratégia, ferramentas e execução. O percurso concreto depende do contexto e das prioridades de cada pessoa."
    ],
    qs: ["Quais são as quatro frentes integradas?", "Por que Legado não é apenas uma mentoria de marketing?"],
    hint: "Explique a ideia central primeiro. Só entre em detalhes quando entender o que a pessoa precisa saber.",
    plus: "A oferta principal é Arquitetura de Legado. A AF Plataforma passa a ser tratada como parte do ecossistema, não como produto principal vendido isoladamente."
  },
  {
    id: "essencia", n: "03", t: "Arquitetura de Essência",
    obj: "Entender como história, valores, talentos e identidade orientam as decisões.",
    avancar: "Explica a investigação de essência sem apresentar interpretações como fatos absolutos.",
    sair: "Faz diagnósticos psicológicos, afirmações espirituais como certezas ou expõe informações privadas.",
    speak: [
      "A jornada começa por compreender a pessoa: sua história, os valores que considera importantes, seus talentos, aspirações e a forma como apresenta a própria trajetória.",
      "Também podem ser investigados padrões familiares e crenças sobre dinheiro, trabalho, sucesso e pertencimento, sempre com respeito e sem impor conclusões.",
      "As descobertas são organizadas para orientar decisões. Relatos, interpretações e hipóteses precisam permanecer claramente diferenciados."
    ],
    qs: ["Que tipo de informação ajuda a compreender a identidade de alguém?", "Como você diferencia um relato de uma interpretação?"],
    hint: "Escuta, consentimento e privacidade são parte do método.",
    plus: "O Dossiê Estratégico deve transformar conversas relevantes em registros úteis, sem expor dados íntimos além do necessário."
  },
  {
    id: "imperio", n: "04", t: "Império Digital",
    obj: "Mostrar como a identidade pode orientar uma presença digital coerente.",
    avancar: "Conecta essência a posicionamento e ativos digitais sem prometer que todos receberão as mesmas entregas.",
    sair: "Garante viralização, faturamento ou entregáveis que não foram acordados.",
    speak: [
      "O Império Digital transforma a clareza sobre a pessoa e sua proposta em decisões de posicionamento, identidade, comunicação e presença digital.",
      "Conforme o projeto, isso pode envolver conteúdo, produtos, páginas, sites, aplicativos, comunidades ou outras estruturas digitais.",
      "A prioridade é construir um ecossistema coerente com a pessoa e seus objetivos, e não criar ferramentas só porque a tecnologia permite."
    ],
    qs: ["Como a identidade influencia o posicionamento?", "Por que os ativos digitais precisam responder a uma estratégia?"],
    hint: "Diferencie possibilidades do método de entregas específicas contratadas.",
    plus: "A promessa comercial deve corresponder ao escopo acordado. Direitos, acessos, manutenção e responsabilidades precisam estar claros no contrato."
  },
  {
    id: "financeiro", n: "05", t: "Alinhamento Financeiro",
    obj: "Explicar a dimensão financeira como parte integrada da construção de legado.",
    avancar: "Relaciona comportamento, organização financeira, vendas e indicadores sem garantir renda.",
    sair: "Promete enriquecimento, retorno financeiro certo ou apresenta uma ferramenta como solução universal.",
    speak: [
      "O Alinhamento Financeiro ajuda a observar a relação com o dinheiro e a trabalhar aspectos práticos como organização, hábitos, metas, vendas, negociação e indicadores.",
      "As ferramentas financeiras existentes podem apoiar a jornada. Elas não substituem decisões responsáveis nem garantem um resultado específico.",
      "A questão não é apenas quanto entra. É como a pessoa toma decisões, organiza recursos e transforma objetivos em ações sustentáveis."
    ],
    qs: ["Que temas práticos podem ser trabalhados nessa frente?", "O que você jamais deve prometer sobre dinheiro?"],
    hint: "Não prometa renda, retorno ou resultados garantidos.",
    plus: "A AF Plataforma continua sendo um conjunto de recursos importante dentro do ecossistema, mesmo que a oferta comercial principal passe a ser Legado."
  },
  {
    id: "alma", n: "06", t: "Tecnologia da Alma",
    obj: "Apresentar a frente de consciência e prática sem confundir crenças com fatos científicos.",
    avancar: "Explica a frente com respeito, sem impor crenças ou exagerar alegações científicas.",
    sair: "Promete cura ou apresenta conceitos espirituais como comprovação científica.",
    speak: [
      "Tecnologia da Alma reúne práticas de reflexão e desenvolvimento pessoal que podem ajudar a pessoa a observar sua experiência, suas escolhas e a relação entre corpo, mente e contexto.",
      "Podem existir exercícios de visualização, escrita, meditação e outras experiências guiadas, conforme a metodologia for estruturada.",
      "Conceitos espirituais e interpretações subjetivas devem ser apresentados como tais. Não se promete cura nem se transforma metáfora em prova científica."
    ],
    qs: ["Como explicar uma prática de visualização de forma responsável?", "Qual é a diferença entre uma crença e uma afirmação cientificamente comprovada?"],
    hint: "A linguagem deve ser acolhedora, clara e responsável.",
    plus: "Esta frente ainda está em desenvolvimento e seus módulos e ferramentas serão definidos progressivamente."
  },
  {
    id: "jornada", n: "07", t: "A jornada e as prioridades",
    obj: "Explicar que as frentes se conectam e podem avançar em paralelo.",
    avancar: "Explica a lógica da jornada sem tratar o calendário indicativo como promessa rígida.",
    sair: "Apresenta meses e etapas como cronograma universal garantido.",
    speak: [
      "A jornada pode começar pela investigação de essência, avançar para identidade e construção digital e trabalhar finanças em paralelo.",
      "Depois, conforme as necessidades, podem ganhar força expansão, automação, equipe, comunidade e continuidade.",
      "O desenho de um ano é uma referência de organização. As prioridades reais são ajustadas ao contexto, ao escopo e ao ritmo de cada cliente."
    ],
    qs: ["Por que algumas frentes podem acontecer em paralelo?", "Como explicar a duração sem transformar a previsão em garantia?"],
    hint: "Fale em jornada orientativa; confirme o formato e o escopo comercial vigentes.",
    plus: "A plataforma deve ajudar a conectar etapas, registros, ferramentas e próximas ações, sem obrigar todos a seguirem um roteiro idêntico."
  },
  {
    id: "diagnostico", n: "08", t: "Escuta e qualificação",
    obj: "Investigar a necessidade antes de apresentar a oferta.",
    avancar: "Faz perguntas abertas, escuta e resume a necessidade antes de explicar a solução.",
    sair: "Interrompe, presume o problema ou usa vulnerabilidade para pressionar a compra.",
    speak: [
      "Antes de apresentar a proposta, entenda o que a pessoa está tentando construir e o que hoje está dificultando esse caminho.",
      "Pergunte sobre objetivos, contexto, tentativas anteriores, prioridades e capacidade de se comprometer com o processo.",
      "Depois, resuma o que ouviu e confirme se compreendeu corretamente. Não é preciso compartilhar tudo o que foi dito para demonstrar que escutou."
    ],
    qs: ["O que você quer construir nos próximos meses?", "O que está dificultando isso hoje?", "O que seria uma mudança útil e realista para você?"],
    hint: "Não transforme a conversa em interrogatório. Pergunte, escute e confirme.",
    plus: "Qualificação serve para verificar alinhamento entre necessidade, proposta, momento e condições — não para fabricar urgência."
  },
  {
    id: "convite", n: "09", t: "Apresentar a proposta e convidar",
    obj: "Conectar a necessidade ouvida à proposta adequada e ao próximo passo.",
    avancar: "Explica por que a proposta pode ser relevante e convida sem pressão.",
    sair: "Oculta condições, inventa escassez ou força uma decisão imediata.",
    speak: [
      "Pelo que você compartilhou, parece que vale explorar se a Arquitetura de Legado faz sentido para o que deseja construir.",
      "Posso explicar como funciona a jornada, o que está incluído no formato atual e quais são as condições para você avaliar com calma.",
      "Se ainda houver dúvidas ou se não for o momento, podemos reconhecer isso e combinar um próximo passo adequado."
    ],
    qs: ["Que parte da proposta se conecta ao que a pessoa descreveu?", "Quais dúvidas precisam ser respondidas antes de decidir?"],
    hint: "Preço, condições, duração e entregas devem ser confirmados nos materiais comerciais vigentes.",
    plus: "Não invente preço, desconto, bônus, prazo, garantia ou entrega. Se não souber, confirme com o mentor."
  },
  {
    id: "objecoes", n: "10", t: "Dúvidas, objeções e limites",
    obj: "Responder dúvidas com clareza e respeitar a autonomia da pessoa.",
    avancar: "Investiga a dúvida real, responde com precisão e aceita um não.",
    sair: "Usa culpa, medo, pressão emocional ou informações falsas para fechar.",
    speak: [
      "Quando a pessoa diz que precisa pensar, pergunte se existe alguma dúvida que ainda possamos esclarecer.",
      "Quando diz que está caro, procure entender se a questão é orçamento, prioridade, valor percebido ou outro fator.",
      "Se a resposta for não, agradeça e encerre com respeito. Não transforme toda objeção em algo que precisa ser vencido."
    ],
    qs: ["O que ainda precisa ficar claro para você?", "Faz sentido retomar isso em outro momento ou prefere encerrar por aqui?"],
    hint: "Objeção é informação para compreender, não autorização para pressionar.",
    plus: "A confiança na marca vale mais do que uma venda inadequada."
  },
  {
    id: "proximo", n: "11", t: "Próxima ação e passagem ao mentor",
    obj: "Terminar a conversa com um próximo passo explícito e um registro mínimo.",
    avancar: "Registra apenas o necessário, confirma a ação combinada e sabe quando envolver o mentor.",
    sair: "Promete condições sem autorização ou compartilha informações privadas sem consentimento.",
    speak: [
      "Vamos resumir: o que você está buscando, o que ficou claro e qual é o próximo passo que faz sentido.",
      "Se houver alinhamento, podemos organizar uma Leitura Call ou a conversa indicada pelo processo comercial vigente.",
      "Se a pergunta exigir uma decisão de escopo, preço, contrato ou método que você não está autorizado a tomar, registre a dúvida e encaminhe ao mentor."
    ],
    qs: ["Qual é o próximo passo combinado?", "O que precisa ser confirmado pelo mentor antes de avançar?"],
    hint: "Registre informações relevantes com consentimento e acesso restrito.",
    plus: "O critério de sucesso não é sair com uma venda a qualquer custo. É conduzir uma conversa íntegra e chegar a uma decisão clara."
  }
];

const CHECK = [
  ["metodo","Explica a Arquitetura de Legado e suas quatro frentes"],
  ["essencia","Explica a investigação de essência com responsabilidade"],
  ["digital","Conecta identidade a posicionamento e ativos digitais"],
  ["financeiro","Explica a frente financeira sem prometer renda"],
  ["alma","Distingue práticas subjetivas de afirmações científicas"],
  ["diagnostico","Escuta, qualifica e confirma a necessidade"],
  ["proposta","Apresenta escopo e condições vigentes sem inventar"],
  ["etica","Respeita a decisão, privacidade e limites comerciais"],
  ["proximo","Registra o próximo passo e sabe quando chamar o mentor"]
];

const KEY = "alTreinoComercial";
const state = { step: 0, notes: {}, check: {}, nome: "", tpSize: 28 };
try {
  const s = JSON.parse(localStorage.getItem(KEY)||"null");
  if (s) Object.assign(state, s, { step: s.step||0 });
} catch (e) {}
const el = (id) => document.getElementById(id);
function persist() {
  localStorage.setItem(KEY, JSON.stringify({ step:state.step, notes:state.notes, check:state.check, nome:state.nome }));
}

function renderMap() {
  el("map").innerHTML = STEPS.map((s, i) =>
    `<button type="button" class="${i===state.step?"on":""} ${state.notes[s.id]?"done":""}" data-go="${i}">
      <b>${s.n} ${s.t}</b><small>${s.obj}</small>
    </button>`).join("");
}
function renderMain() {
  const s = STEPS[state.step];
  el("main").innerHTML = `
    <p class="kicker">Etapa ${s.n} · ${s.t}</p>
    <h2>${s.obj}</h2>
    <p class="hint">${s.hint}</p>
    <p class="kicker">Falar</p>
    ${s.speak.map((t) => `<div class="speak">${t}</div>`).join("")}
    <p class="kicker">Perguntar / treinar</p>
    ${s.qs.map((t) => `<div class="q">${t}</div>`).join("")}
    <div class="plus"><span class="lbl">Por que isto existe</span>${s.plus}</div>
    <p class="kicker">Avançar se</p><p>${s.avancar}</p>
    <p class="kicker">Encerrar este bloco se</p><p>${s.sair}</p>
    <label class="f">Anotação<textarea id="note">${state.notes[s.id]||""}</textarea></label>
    <div class="row">
      <button class="btn" data-act="prev">Voltar</button>
      <button class="btn btn-a" data-act="next">Avançar</button>
      <button class="btn" data-act="tp">Teleprompt</button>
    </div>`;
  el("note").oninput = (e) => { state.notes[s.id]=e.target.value; persist(); };
}
function renderSide() {
  const boxes = CHECK.map(([k, t]) =>
    `<label class="f" style="display:flex;gap:8px;align-items:flex-start">
      <input type="checkbox" data-ck="${k}" ${state.check[k]?"checked":""} style="width:auto;margin-top:3px">
      <span>${t}</span>
    </label>`).join("");
  const n = CHECK.filter(([k]) => state.check[k]).length;
  el("side").innerHTML = `
    <p class="kicker">Vendedor em treino</p>
    <input id="nome" placeholder="Nome" value="${state.nome||""}">
    <p class="kicker">Apto a vender sessão?</p>
    <p class="hint">${n}/${CHECK.length} · a call de treino acaba quando isto está verde.</p>
    ${boxes}
    <p class="kicker">Lembrete</p>
    <p class="hint">Comissão 30 / 40 / 50 ainda em aberto. Cliente nunca ouve percentual. Mentoria cara não é o produto do dia 1.</p>`;
  el("nome").oninput = (e) => { state.nome = e.target.value; persist(); };
}
function go(i) {
  state.step = Math.max(0, Math.min(STEPS.length-1, i));
  persist();
  renderMap();
  renderMain();
}
function openTp() {
  const s = STEPS[state.step];
  el("tpBody").innerHTML = s.speak.map((t) => `<p>${t}</p>`).join("");
  el("tp").classList.add("on");
  el("tpBody").style.fontSize = state.tpSize+"px";
}
document.body.addEventListener("click", (e) => {
  const goBtn = e.target.closest("[data-go]");
  if (goBtn) go(+goBtn.dataset.go);
  const act = e.target.closest("[data-act]");
  if (act) {
    const a = act.dataset.act;
    if (a==="next") go(state.step+1);
    if (a==="prev") go(state.step-1);
    if (a==="tp") openTp();
    if (a==="closeTp") el("tp").classList.remove("on");
  }
  const tab = e.target.closest("[data-tab]");
  if (tab) {
    document.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b===tab));
    const t = tab.dataset.tab;
    el("viewCall").classList.toggle("hidden", t!=="call");
    el("viewTela").classList.toggle("hidden", t!=="tela");
    el("viewRefs").classList.toggle("hidden", t!=="refs");
    el("viewApto").classList.toggle("hidden", t!=="apto");
    el("viewFormacao").classList.toggle("hidden", t!=="formacao");
  }
});
document.body.addEventListener("change", (e) => {
  if (e.target.dataset.ck) { state.check[e.target.dataset.ck] = e.target.checked; persist(); renderSide(); }
});
el("tpSize").oninput = (e) => { state.tpSize=+e.target.value; el("tpBody").style.fontSize = state.tpSize+"px"; };
renderMap();
renderMain();
renderSide();
