const STEPS = [
  {
    id: "chao", n: "00", t: "Antes da câmera",
    obj: "Chegar no protocolo, não no humor.",
    avancar: "Água, silêncio, esta página, relógio, frase de chão.",
    sair: "Se estiver impossível de gravar ou de ouvir, remarque. Humor baixo não desmarca.",
    speak: ["Hoje eu só faço o protocolo."],
    body: `<ol class="ol">
      <li>Água. Banheiro. Celular no silencioso. Gravação pronta.</li>
      <li>Esta página aberta. Bloco do mapa à direita. Relógio visível.</li>
      <li>Landing e WhatsApp à mão. Não abrir Instagram no meio.</li>
      <li>Frase de chão: “Hoje eu só faço o protocolo.”</li>
      <li>Se estiver mal: sessenta segundos de respiração. Depois entra. Não desmarca por humor.</li>
    </ol>`,
    plus: "Transcrição 02: closer controla o diagnóstico. Controle, aqui, é esta lista. Não é palco."
  },
  {
    id: "porta", n: "01", t: "0–8 min · Porta",
    obj: "Combinar o que esta hora é. Sem aquecer com história longa.",
    avancar: "Tempo, gravação e formato aceitos.",
    sair: "Não quer ser gravada e não há combinado. Encerrar.",
    speak: [
      "Primeiro eu entendo como sua vida funciona: dinheiro, trabalho, rotina, saúde, projetos e pendências. Depois nomeio o ponto que trava o movimento agora. No fim você sai com um mapa e uma ação de 7 dias. Mentoria é outro assunto, só se fizer sentido."
    ],
    body: `<p>Agradece. Confirma o tempo. Confirma a gravação. Diz, em uma linha, a fala ao lado. Não promete transformação. Não aquece com história longa.</p>`,
    plus: "Sandler / abertura AF: contrato no começo. Transcrição 02: o objetivo não é mostrar nada. Se ela já pagou os R$ 350, não revenda a sessão. Entregue o mapa."
  },
  {
    id: "extracao", n: "02", t: "8–30 min · Extração",
    obj: "Perguntar e anotar. Não corrigir no meio. Pular o que não existir na vida dela.",
    avancar: "Você tem número, rotina e o que ocupa a cabeça.",
    sair: "Ela recusa qualquer número. Sessão prestada, mapa mínimo, encerrar.",
    speak: ["Me dá o número.", "Isso é o sentimento. Qual foi o último valor que saiu sem decisão?", "O que está ocupando espaço na sua cabeça que eu ainda não perguntei?"],
    body: `<p>Pergunta e anota no bloco da direita. O mapa se adapta à pessoa.</p>
    <ol class="ol">
      <li>Nome como quer ser chamada.</li>
      <li>O que está construindo agora.</li>
      <li>Onde o dinheiro trava. Quanto entra. Quanto sai. Reserva em meses. Dívida. Último valor que saiu sem decisão.</li>
      <li>Trabalho e renda: CLT, empresa, autônomo? De onde vem o dinheiro? O que mais poderia entrar?</li>
      <li>Rotina: como começa e termina o dia. Compromissos fixos. Onde o tempo some.</li>
      <li>Saúde prática: sono, corpo, consultas pendentes. Sem conselho médico.</li>
      <li>O que precisa estar verdadeiro em 7 dias, 90 dias, 1 ano.</li>
      <li>Projetos começados, parados, que merecem continuar.</li>
      <li>Pendências que ficam na cabeça.</li>
      <li>Compras e investimentos: urgente, necessário, desejável, futuro.</li>
      <li>Onde mora, trabalha, treina. Tempo e dinheiro no deslocamento. O que existe ao redor.</li>
      <li>Família e dinheiro: o que se repete.</li>
      <li>Para quem isso serve além dela.</li>
      <li>Conteúdo ou comunicação: só se ela já produz ou precisa aparecer.</li>
      <li>Fecha a extração com a terceira fala.</li>
    </ol>
    <p>Se divagar: primeira fala. Se teatralizar: segunda fala.</p>`,
    plus: "Transcrição 02: diagnóstico de avançar/não avançar começa aqui, nos números. Transcrição 01: não colete 40 linhas para ter margem de erro. Colete para achar UM furo."
  },
  {
    id: "mapa", n: "03", t: "30–48 min · Mapa",
    obj: "Classificar o que ouviu. Centro: NOME · MAPA DE ALINHAMENTO.",
    avancar: "As bolhas que existem estão preenchidas. Bolha vazia some.",
    sair: "—",
    speak: ["Isso entra no mapa como padrão. Agora eu preciso do valor."],
    body: `<p>Em volta só os vetores que existirem: Rotina. Tempo. Financeiro. Trabalho e renda. Saúde. Objetivos. Projetos. Tarefas. Compras. Ambiente. Conteúdo. Família.</p>
    <p>Cada bolha leva ação, não slogan. Saúde não fica “cuidar da saúde”. Fica “consulta X neste mês. Treino 3x. Sono neste horário.”</p>
    <p>Empresário, CLT, mãe, criador: mapas diferentes. Não force bolha vazia.</p>`,
    plus: "Transcrição 01: jornada inteira, não um funil de uma venda. O mapa é o território. A mentoria, se vier, usa este mesmo mapa — não recomeça do zero."
  },
  {
    id: "diag", n: "04", t: "48–60 min · Diagnóstico",
    obj: "O mapa pode ter 40 linhas. Você nomeia um furo.",
    avancar: "Ela ouviu o padrão, o número e o gesto. Espelhou. Não debateu identidade no lugar do número.",
    sair: "O problema some quando ela corrige o espelho. Entregue o mapa. Não force mentoria.",
    speak: ["O padrão que eu ouvi é X. O número que falta é Y. O gesto que sustenta isso é Z."],
    body: `<p>O que segura o dinheiro agora. Espelha. Espera. Não consola. Não debate identidade.</p>
    <p>Se a call descarrilar: “Vamos voltar para o número.” Se insistir no drama: a fala de padrão. Se ofender: encerra com respeito. Sessão prestada.</p>`,
    plus: "Transcrição 02: esta frase é a regra de avançar ou não. Transcrição 04: diagnóstico longo antes de solução. AF: um furo. Não dez."
  },
  {
    id: "sistema", n: "05", t: "60–72 min · Sistema simples",
    obj: "Ensinar a regra. Não criar dez aplicativos.",
    avancar: "Ela sabe onde cai hora, tarefa, lembrete e dinheiro.",
    sair: "—",
    speak: [
      "Tem hora → Agenda.",
      "Tem que fazer → Tarefas. Pendência com dono e prazo.",
      "Precisa lembrar → Nota ou um grupo só dela no WhatsApp.",
      "Move dinheiro → Financeiro. Entrada, saída, reserva, dívida."
    ],
    body: `<p>Algumas pessoas rendem com um grupo por tema. Outras viram caos. Escolhe o mínimo para aquela vida.</p>`,
    plus: "Arquitetura de receita, em linguagem de 10 anos: cada coisa tem uma casa. Se tudo mora no mesmo chat, o dinheiro some."
  },
  {
    id: "7dias", n: "06", t: "72–78 min · Uma prioridade",
    obj: "De tudo no mapa, um movimento para os próximos 7 dias. Observável amanhã de manhã.",
    avancar: "Ação escrita no bloco. Ela repete com as palavras dela.",
    sair: "—",
    speak: ["Amanhã de manhã já dá para ver isto."],
    body: `<p>Pode abrir Quitei 3 minutos se o furo for dívida. Pode abrir cash-flow 3 minutos se o furo for vazamento. Não abre a plataforma inteira. Não dá aula dos 7 módulos.</p>`,
    plus: "Transcrição 01: compromisso, não tiro único. Os 7 dias são o primeiro passo do compromisso. Sem isso, mentoria vira conteúdo."
  },
  {
    id: "mentoria", n: "07", t: "78–88 min · Porta da mentoria",
    obj: "Só abre se o diagnóstico pediu continuidade.",
    avancar: "Ela ouviu os dois caminhos. Sem pressão. Sem desconto.",
    sair: "Diagnóstico não pediu. Mapa + dossiê + sessão já paga. Fim.",
    speak: [
      "Esse mapa você executa sozinha. Não precisa de mentoria para usar. Se quiser a mesma arquitetura num só lugar, com caixa, módulos e acompanhamento, aí existe a plataforma e a mentoria de Alinhamento Financeiro.",
      "Três chaves. Essencial 3.900, 8 semanas. Premium 6.500, 12 semanas. VIP 13.000, 1:1. Os 7 módulos são os mesmos. Muda o acompanhamento. Você não escolhe agora se estiver nublada. Pensa. Me chama no WhatsApp."
    ],
    body: `<p>Não fecha no susto. Não dá desconto por pena. Não mistura Flow.</p>
    <p>Se o vendedor nesta call ainda é SDR: a porta da mentoria é convite + WhatsApp do mentor. Ele não fecha VIP sozinho no primeiro mês. Usa o mapa de fechamento só depois do treinamento avançado.</p>`,
    plus: "Transcrição 02: avançar ou não é regra. Transcrição 04: Pix na reunião só se ela decidiu. AF: o copo desta etapa é opcional. Recusar é opção."
  },
  {
    id: "fim", n: "08", t: "88–90 min · Encerramento",
    obj: "Repetir a ação de 7 dias. Enviar mapa e dossiê. Encerrar no horário.",
    avancar: "WhatsApp enviado. Relógio respeitado.",
    sair: "—",
    speak: ["O mapa é o território. Os 7 dias são o primeiro passo."],
    body: `<p>Confirma envio do mapa e do dossiê no WhatsApp. Agradece. Encerra no horário.</p>`,
    plus: "Se ela pediu mentoria com clareza, o próximo mapa é Fechamento de Call — outra call, outro mapa."
  }
];

const FIELDS = [
  ["ascNome","Nome"],["ascRotina","Rotina"],["ascTempo","Tempo"],["ascFin","Financeiro"],
  ["ascTrab","Trabalho e renda"],["ascSaude","Saúde"],["ascObj","Objetivos"],["ascProj","Projetos"],
  ["ascTar","Tarefas"],["ascComp","Compras"],["ascAmb","Ambiente"],["ascCont","Conteúdo (se houver)"],
  ["ascFam","Família e dinheiro"],["ascPadrao","Padrão · número · gesto"],["ascAcao","Ação de 7 dias"]
];

const KEY = "afAscensao";
const state = { step: 0, notes: {}, tpSize: 28, fields: {} };
try { Object.assign(state.fields, JSON.parse(localStorage.getItem(KEY+":mapa")||"{}")); } catch (e) {}
try { Object.assign(state.notes, JSON.parse(localStorage.getItem(KEY+":notas")||"{}")); } catch (e) {}
const el = (id) => document.getElementById(id);

function persistNotes() {
  localStorage.setItem(KEY+":notas", JSON.stringify(state.notes));
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
    <p class="kicker">Original da Ascensão · ${s.n}</p>
    <h2>${s.obj}</h2>
    ${s.body}
    <p class="kicker">Falar</p>
    ${s.speak.map((t) => `<div class="speak">${t}</div>`).join("")}
    <div class="plus"><span class="lbl">Complemento · estudo IM + operação</span>${s.plus}</div>
    <p class="kicker">Avançar se</p><p>${s.avancar}</p>
    <p class="kicker">Encerrar se</p><p>${s.sair}</p>
    <label class="f">Anotação desta etapa<textarea id="note">${state.notes[s.id]||""}</textarea></label>
    <div class="row">
      <button class="btn" data-act="prev">Voltar</button>
      <button class="btn btn-a" data-act="next">Avançar</button>
      <button class="btn" data-act="tp">Teleprompt</button>
    </div>`;
  el("note").oninput = (e) => { state.notes[s.id] = e.target.value; persistNotes(); };
}
function renderSide() {
  const fields = FIELDS.map(([id, label]) =>
    `<label class="f">${label}<textarea data-map="${id}" rows="2">${state.fields[id]||""}</textarea></label>`
  ).join("");
  el("side").innerHTML = `
    <p class="kicker">Bloco do mapa</p>
    <p class="hint">Só o que ela falou. Bolha vazia some do texto copiado.</p>
    ${fields}
    <div class="row">
      <button class="btn btn-a" data-act="copy">Copiar para o WhatsApp</button>
      <button class="btn" data-act="clear">Limpar bloco</button>
    </div>`;
}
function persistMap() {
  localStorage.setItem(KEY+":mapa", JSON.stringify(state.fields));
}
function copyMap() {
  const read = (id, title) => {
    const v = (state.fields[id]||"").trim();
    return v ? title.toUpperCase()+"\n"+v+"\n" : "";
  };
  const nome = (state.fields.ascNome||"").trim() || "Mapa de Alinhamento";
  const txt = [
    nome.toUpperCase()+" · MAPA DE ALINHAMENTO","",
    read("ascRotina","Rotina"), read("ascTempo","Tempo"), read("ascFin","Financeiro"),
    read("ascTrab","Trabalho e renda"), read("ascSaude","Saúde"), read("ascObj","Objetivos"),
    read("ascProj","Projetos"), read("ascTar","Tarefas"), read("ascComp","Compras"),
    read("ascAmb","Ambiente"), read("ascCont","Conteúdo"), read("ascFam","Família e dinheiro"),
    read("ascPadrao","Diagnóstico"), read("ascAcao","Ação de 7 dias"),
    "Tem hora → Agenda. Tem ação → Tarefas. Tem ideia → Nota. Move dinheiro → Financeiro."
  ].filter((x, i, a) => x!=="" || a[i-1]!=="").join("\n").replace(/\n{3,}/g,"\n\n");
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt);
  else window.prompt("Copie o mapa", txt);
  alert("Mapa copiado. Cola no WhatsApp dela.");
}
function go(i) {
  state.step = Math.max(0, Math.min(STEPS.length-1, i));
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
    if (a==="copy") copyMap();
    if (a==="clear") { state.fields = {}; persistMap(); renderSide(); }
    if (a==="closeTp") el("tp").classList.remove("on");
  }
  const tab = e.target.closest("[data-tab]");
  if (tab) {
    document.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b===tab));
    const t = tab.dataset.tab;
    el("viewCall").classList.toggle("hidden", t!=="call");
    el("viewRegras").classList.toggle("hidden", t!=="regras");
    el("viewTela").classList.toggle("hidden", t!=="tela");
    el("viewDna").classList.toggle("hidden", t!=="dna");
  }
});
document.body.addEventListener("input", (e) => {
  if (e.target.dataset.map) { state.fields[e.target.dataset.map] = e.target.value; persistMap(); }
});
el("tpSize").oninput = (e) => { state.tpSize = +e.target.value; el("tpBody").style.fontSize = state.tpSize+"px"; };
renderMap();
renderMain();
renderSide();
