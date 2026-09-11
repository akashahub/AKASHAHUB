const STEPS = [
  {
    id: "quem", n: "01", t: "Quem é você aqui",
    obj: "Combinar o papel. Sem tempo fixo. A call acaba quando ele está apto.",
    avancar: "Ele aceitou: primeiro conversa e diagnóstico. Número só depois da certeza.",
    sair: "Quer só link de afiliado, sem mapa e sem treino. Não é família.",
    speak: [
      "Aqui não é um link para você sair vendendo sozinho. É um time.",
      "Você leva gente para uma conversa de alinhamento. O Yan realiza a sessão. Você não precisa conhecer módulo nem plataforma.",
      "Mentoria só entra quando a pessoa já quer avançar. Número não é o primeiro assunto."
    ],
    qs: ["Por que você quer vender isto?", "Você aguenta seguir um mapa, ou quer improvisar tudo?"],
    hint: "Fome de resultado é bem-vinda. Desespero como desculpa para pressionar o cliente, não.",
    plus: "Perfil: determinação, paixão por venda, vontade de ganhar dinheiro. Preferência por quem precisa do resultado. O sistema ensina a fechar por diagnóstico, valor e confiança — não por ‘não saio da call sem a venda’ a qualquer custo."
  },
  {
    id: "oquee", n: "02", t: "O que a AF vende",
    obj: "Três frases. Se ele não consegue repetir, não avançou.",
    avancar: "Ele repetiu as três frases com as palavras dele.",
    sair: "Confunde AF com Flow, livro, constelação clínica ou curso de tráfego.",
    speak: [
      "Um: ordem no dinheiro. O que entra, o que some, o que cobra, o que recusa.",
      "Dois: toda semana tem call. O Yan conduz. Ela vê o hoje no aplicativo.",
      "Três: se fizer sentido, marca uma conversa. Sem textão. Sem cardápio."
    ],
    qs: ["Me fala as três frases.", "O que você responde se ela pedir o preço no Direct?"],
    hint: "Linguagem de 10 anos. Se a frase precisa de dicionário, está errada.",
    plus: "Transcrição 01: não é funil de um tiro. É compromisso. Sessão já entrega. Mentoria continua."
  },
  {
    id: "nao", n: "03", t: "O que você nunca vende",
    obj: "Lista curta. Ele decora.",
    avancar: "Ele citou pelo menos cinco itens da lista.",
    sair: "Quer vender ‘qualquer coisa que feche’.",
    speak: [
      "Você não promete renda, cura, namoro nem resultado garantido.",
      "Você não fala preço no Direct. Não fala plano. Não fala promoção como isca.",
      "Você não mistura Flow, Magnetismo, livro, como se fosse a mesma coisa.",
      "Você não mostra a gestão do mentor para o cliente."
    ],
    qs: ["Me fala três coisas que você não pode prometer.", "O que você faz se ela pedir desconto?"],
    hint: "Resposta certa para preço no Direct: a gente olha na conversa. Sem tabela.",
    plus: "Original da Ascensão. Intacta. Treinamento só ensina a obedecer."
  },
  {
    id: "caminho", n: "04", t: "O caminho da pessoa",
    obj: "SDR → conversa → possível mentoria. Sem número no começo.",
    avancar: "Ele desenhou o caminho em voz alta, na ordem certa.",
    sair: "Quer mandar tabela de preço no primeiro Direct.",
    speak: [
      "Você conversa. Diagnóstico. Quem decide. Nota 0 a 10. Espelho. Quer caminho?",
      "Se não quiser, agradece e encerra. Sem perseguir.",
      "Se quiser e ainda faltar peça, não fala número. Marca retorno ou chama o Yan.",
      "Se já decidiu avançar, aí existe número. Campanha é recompensa, não isca."
    ],
    qs: ["O que você vende na primeira mensagem?", "Quando o número entra?"],
    hint: "Comissão da sessão (30, 40 ou 50%) ainda não está cravada. Não fale percentual para o cliente. Não invente o seu na call.",
    plus: "Transcrição 03: não escala funil furado. Iniciante que fecha VIP no escuro fura a arquitetura."
  },
  {
    id: "falar", n: "05", t: "Como falar",
    obj: "Uma ideia por vez. Número antes de opinião. Silêncio depois da pergunta.",
    avancar: "Ele fez uma pergunta e ficou quieto 5 segundos sem completar a frase dela.",
    sair: "Não aguenta silêncio. Enche de história.",
    speak: [
      "Frase curta.",
      "Me dá o número.",
      "Isso é o sentimento. Qual foi o último valor que saiu sem decisão?"
    ],
    qs: ["Faz uma pergunta de dinheiro e espera.", "O que você faz se ela chorar?"],
    hint: "Choro: água, tempo, o mesmo ponto. Choro não cancela o número. Original da Ascensão.",
    plus: "Transcrição 02: closer controla o diagnóstico. Controle = protocolo. Não é gritar."
  },
  {
    id: "sessao", n: "06", t: "A sessão de 350",
    obj: "Ele sabe que o Yan realiza a sessão. Ele marca e qualifica.",
    avancar: "Ele repetiu: eu vendo a conversa. O Yan conduz a sessão.",
    sair: "Quer improvisar a sessão no feeling.",
    speak: [
      "A sessão é do Yan. Você não precisa do mapa dos 90 minutos no dia 1.",
      "Você marca. Você qualifica. Você avisa o Yan: nome, WhatsApp, pagou ou não.",
      "Campanha: 1 pessoa a 150 reais. Esse valor é 100% seu. Só 1. Depois volta para a casa."
    ],
    qs: ["Quem realiza a sessão?", "Quantas pessoas entram a 150?"],
    hint: "Cento e cinquenta não é isca. Só quem já quer a conversa.",
    plus: "Abra o mapa da Ascensão nesta call e ande um ciclo com ele, como se ele fosse o cliente."
  },
  {
    id: "tela", n: "07", t: "Tela compartilhada",
    obj: "Ele sabe o que o cliente pode ver.",
    avancar: "Ele listou 3 coisas que pode mostrar e 3 que não pode.",
    sair: "Quer ‘dar um tour na plataforma pra fechar’.",
    speak: [
      "Para o cliente: mapa dela, Quitei 3 minutos se for dívida, landing se a porta da mentoria abriu.",
      "Nunca: gestão, lista de alunos, este treino, teleprompter."
    ],
    qs: ["O que você mostra se o furo for dívida?", "O que você nunca mostra?"],
    hint: "Aba ‘O que mostrar na tela’ deste arquivo. Decore.",
    plus: "Transcrição 02: objetivo da call não é mostrar coisa. Tela prova. Fala diagnostica."
  },
  {
    id: "obj", n: "08", t: "Quando ela trava",
    obj: "Quatro travas da sessão. Uma pergunta cada.",
    avancar: "Ele respondeu as quatro sem inventar desconto.",
    sair: "A resposta dele para tudo é ‘baixa o preço’.",
    speak: [
      "Está caro: caro comparado com o quê?",
      "Vou pensar: o que ainda não olhamos?",
      "Preciso falar com alguém: essa pessoa decide de verdade? Chama agora ou marca os três.",
      "Não tenho tempo: o método pede poucas horas. Cabe ou a vida não abre agora?"
    ],
    qs: ["Me encena ‘vou pensar’.", "Me encena ‘está caro’."],
    hint: "Mapa de fechamento tem o mesmo quadro. Sessão usa a versão curta.",
    plus: "AF não trata toda objeção como mentira. Investiga. Se for não, encerra."
  },
  {
    id: "avanco", n: "09", t: "Avançar para mentoria",
    obj: "Ele sabe a diferença entre convite e fechamento.",
    avancar: "Ele repetiu: SDR convida. Closer treinado fecha. Mentor pode entrar na call.",
    sair: "Acha que 350 e 13 mil são a mesma conversa.",
    speak: [
      "Se o diagnóstico pediu continuidade e ela já quer avançar, aí existe o número da mentoria.",
      "Casa: a partir de 5.000. Campanha deste vendedor: 2.000 para exatamente 3 pessoas.",
      "Só fala 2.000 se ela já decidiu. Dúvida não ganha promoção. Quarta pessoa: volta pro Yan."
    ],
    qs: ["Quando você fala 2.000?", "O que você faz na quarta pessoa?"],
    hint: "Frase: como você já decidiu avançar, nesta campanha a casa abre três vagas neste valor.",
    plus: "Transcrição 02 e 04. AF adapta o timing, não o tom pitbull."
  },
  {
    id: "familia", n: "10", t: "Família e dinheiro",
    obj: "Combinar como ele ganha. Sem percentual cravado ainda.",
    avancar: "Ele entendeu: percentual em aberto. Cliente nunca ouve a comissão.",
    sair: "Quer discutir comissão na frente do cliente.",
    speak: [
      "Sessão a 150: 100% seu. Presente. Só 1 pessoa. O Yan realiza.",
      "Mentoria a 2.000: a comissão sua o Yan fala na call de treino. Cliente nunca ouve split.",
      "Isaac, colégio, lista de telefone: material na sequência. Hoje o jogo é Alinhamento Financeiro."
    ],
    qs: ["O cliente pergunta quanto você ganha. O que você responde?", "Isaac entra hoje?"],
    hint: "Resposta ao cliente: eu trabalho nesta operação. O valor a gente olha quando fizer sentido. Ponto.",
    plus: "Espírito família foi o pedido original. Comissão em aberto foi o pedido original. Não feche um dos dois neste arquivo."
  },
  {
    id: "amanha", n: "11", t: "Amanhã de manhã",
    obj: "Uma ação observável, igual a sessão pede para o cliente.",
    avancar: "Ele tem nome de 3 pessoas para chamar e o link da sessão na cabeça.",
    sair: "‘Vou ver no fim de semana’.",
    speak: [
      "Amanhã você chama três pessoas. Não cem. Três.",
      "Você marca sessão. Você abre o mapa. Você pede o número.",
      "Se travar, você me chama. A call de treino acabou. O resto é dúvida e prática."
    ],
    qs: ["Quais são as três pessoas?", "Que horas você manda a primeira mensagem?"],
    hint: "Ação de 7 dias também vale para o vendedor.",
    plus: "Critério de sucesso da call de treino: ele sair apto a marcar e conduzir a sessão, não ‘inspirado’."
  }
];

const CHECK = [
  ["frase","Repete o que a AF vende em 3 frases, sem preço"],
  ["nunca","Não fala número no Direct. Não usa promoção como isca"],
  ["mapa","Sabe o caminho: conversa → certeza → número"],
  ["tela","Sabe o que o cliente pode ver"],
  ["nao","Aceita encerrar sem venda"],
  ["campanha","3 mentorias a 2000. 1 sessão a 150. Yan realiza a sessão"],
  ["duvida","Avisa o Yan na hora: nome, WhatsApp, pagou ou não"]
];

const COPY_VEND = `Você vende ordem no dinheiro.
A pessoa para de ganhar e some.
Treina o que entra, o que some, o que cobra, o que recusa.
Toda semana tem call. O Yan conduz.
Ela vê o que fazer hoje no aplicativo.
Você não vende módulo. Não vende ferramenta. Não vende tour.

Três linhas.
1. Você treina o que entra, o que some, o que cobra, o que recusa.
2. Toda semana tem call. O Yan conduz.
3. Se fizer sentido, a gente marca uma conversa. Sem textão.

Se pedirem preço no Direct:
Preço a gente olha na conversa, quando eu entender a tua situação. Se não couber, eu te falo.

Número só quando ela já quer avançar, quem decide está na mesa, e a objeção já foi olhada.

Campanha. Não anuncia. Não usa como isca.
Mentoria da casa: a partir de 5.000.
3 pessoas a 2.000. Só se já decidiu avançar.
Frase: Como você já decidiu avançar, nesta campanha de vendedor a casa abre três vagas neste valor.
Quarta pessoa: volta pro Yan.

Sessão: 1 pessoa a 150. 100% seu. Yan realiza. Só 1.
Não usa o 150 pra puxar quem não quer.

Depois de fechar: avisa o Yan na hora. Nome. WhatsApp. Pagou ou não.
Você não libera plataforma.

Isaac: depois. Hoje o jogo é Alinhamento Financeiro.`;

const KEY = "afTreino";
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
      <button class="btn" data-act="copyStep">Copiar esta etapa</button>
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
    <p class="kicker">Copiar</p>
    <button class="btn btn-a" type="button" data-act="copyVend">Copiar texto do vendedor</button>
    <p class="hint" style="margin-top:8px">Este é o botão. Manda o texto copiado no WhatsApp dele. Não manda PDF pro cliente.</p>
    <p class="kicker">Lembrete</p>
    <p class="hint">3 mentorias a 2.000. 1 sessão a 150 (100% dele). Yan realiza a sessão. Número só depois da certeza. Isaac depois.</p>`;
  el("nome").oninput = (e) => { state.nome = e.target.value; persist(); };
}
function go(i) {
  state.step = Math.max(0, Math.min(STEPS.length-1, i));
  persist();
  renderMap();
  renderMain();
}
function copyTxt(t, btn) {
  const run = async () => {
    try { await navigator.clipboard.writeText(t); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    if (btn) {
      const old = btn.textContent;
      btn.textContent = "Copiado";
      setTimeout(() => { btn.textContent = old; }, 1600);
    }
  };
  run();
}
function copyStep() {
  const s = STEPS[state.step];
  copyTxt(s.speak.join("\n\n\n"), document.querySelector("[data-act=copyStep]"));
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
    if (a==="copyStep") copyStep();
    if (a==="copyVend") copyTxt(COPY_VEND, act);
  }
  const tab = e.target.closest("[data-tab]");
  if (tab) {
    document.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b===tab));
    const t = tab.dataset.tab;
    el("viewCall").classList.toggle("hidden", t!=="call");
    el("viewTela").classList.toggle("hidden", t!=="tela");
    el("viewRefs").classList.toggle("hidden", t!=="refs");
    el("viewApto").classList.toggle("hidden", t!=="apto");
  }
});
document.body.addEventListener("change", (e) => {
  if (e.target.dataset.ck) { state.check[e.target.dataset.ck] = e.target.checked; persist(); renderSide(); }
});
el("tpSize").oninput = (e) => { state.tpSize=+e.target.value; el("tpBody").style.fontSize = state.tpSize+"px"; };
renderMap();
renderMain();
renderSide();
