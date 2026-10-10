/* AL Plataforma. Não move nem apaga a AF.
   ACESSO é o método da central. Os meses são indicativos. */
const KEY = "al-plataforma-v1";
const ACESSO = [
  ["A", "Anamnese", "Origem. Onde a história trava."],
  ["C", "Codificação", "O que se repete vira etapa."],
  ["E", "Essência", "O que é dela. Para quem serve."],
  ["S", "Síntese", "Mensagem, método e oferta."],
  ["S", "Sistema", "O ativo ganha forma."],
  ["O", "Operação", "Usar, medir, continuar."]
];
const PHASES = [
  { id:"essencia", n:"01", when:"Meses 1–3", name:"Essência", href:"/alplataforma/essencia/", acesso:"A · E", line:"A conversa vira dossiê. Relato, hipótese e decisão não se misturam." },
  { id:"imperio", n:"02", when:"Meses 3–6", name:"Império Digital", href:"/alplataforma/imperio/", acesso:"S · S", line:"A essência vira frase, marca, oferta e um lugar onde o trabalho mora." },
  { id:"financeiro", n:"03", when:"Meses 4–8", name:"Alinhamento", href:"/alplataforma/financeiro/", acesso:"S · O", line:"A AF continua inteira. Aqui ela entra na fase, sem virar outra mentoria." },
  { id:"expansao", n:"04", when:"Meses 7–10", name:"Expansão", href:"/alplataforma/expansao/", acesso:"O", line:"Uma etapa escrita. Entrada, saída, e quem faz quando você sai." },
  { id:"legado", n:"05", when:"Meses 10–12", name:"Continuidade", href:"/alplataforma/legado/", acesso:"O", line:"Doutrina, movimento e comunidade. O que fica sem o fundador na sala." },
  { id:"alma", n:"06", when:"O ano inteiro", name:"Tecnologia da Alma", href:"/alplataforma/alma/", acesso:"E · S", line:"Corpo, mente e campo. Prática. Não é a quarta mentoria e não é prova científica." }
];

function load(){
  try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch{ return {}; }
}
function save(data){ localStorage.setItem(KEY, JSON.stringify(data)); }
function db(){
  const d = load();
  d.notes ||= [];
  d.checks ||= {};
  d.fields ||= {};
  d.mentorado ||= "";
  return d;
}
function uid(){ return Math.random().toString(36).slice(2, 9); }
function esc(s){
  return String(s ?? "")
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}

function shell(active){
  const links = PHASES.map(p => `<a class="${p.id===active?"on":""}" href="${p.href}">${p.n} ${esc(p.name)}</a>`).join("");
  return `<header><a class="brand" href="/alplataforma/">AL <em>Plataforma</em></a><nav><a href="/al/central/">Central</a>${links}</nav></header>`;
}
function acessoBar(){
  return `<div class="acesso">${ACESSO.map(([l,n,d])=>`<div><b>${l}</b><span>${esc(n)}. ${esc(d)}</span></div>`).join("")}</div>`;
}
function nameField(){
  const d = db();
  return `<div class="field"><label>Mentorado</label><input id="who" value="${esc(d.mentorado)}" placeholder="Nome de quem está na jornada"></div>`;
}
function bindName(){
  const input = document.getElementById("who");
  if(!input) return;
  input.oninput = ()=>{ const d = db(); d.mentorado = input.value; save(d); };
}
function addNote(phase, bucket, kind, text){
  const d = db();
  d.notes.unshift({ id:uid(), phase, bucket, kind, text:text.trim(), at:new Date().toISOString() });
  save(d);
}
function notes(phase, bucket){
  return db().notes.filter(n => n.phase===phase && (!bucket || n.bucket===bucket));
}
function removeNote(id){
  const d = db();
  d.notes = d.notes.filter(n => n.id!==id);
  save(d);
}
function setCheck(id, value){
  const d = db();
  d.checks[id] = value;
  save(d);
}
function setField(id, value){
  const d = db();
  d.fields[id] = value;
  save(d);
}

function renderNotes(host, phase){
  host.innerHTML = notes(phase).map(n => `<article class="item"><b>${esc(n.kind)} · ${esc(n.bucket)}</b><p>${esc(n.text)}</p><button class="ghost" type="button" data-del="${n.id}">Apagar</button></article>`).join("") || `<p class="warn">Nada registrado ainda.</p>`;
  host.querySelectorAll("[data-del]").forEach(btn => btn.onclick = ()=>{ removeNote(btn.dataset.del); renderNotes(host, phase); });
}

function capture(phase, buckets){
  const opts = buckets.map(([id,label])=>`<option value="${id}">${esc(label)}</option>`).join("");
  return `<form id="cap">
    <div class="field"><label>Lugar no dossiê</label><select id="bucket">${opts}</select></div>
    <div class="kind" id="kinds">
      <button type="button" class="on" data-kind="relato">Relato</button>
      <button type="button" data-kind="hipótese">Hipótese</button>
      <button type="button" data-kind="decisão">Decisão</button>
    </div>
    <div class="field"><label>O que ficou</label><textarea id="text" placeholder="O que a pessoa disse, o que você leu, ou o que ficou decidido."></textarea></div>
    <button class="btn" type="submit">Guardar</button>
  </form><div class="list" id="notes"></div>`;
}
function bindCapture(phase){
  let kind = "relato";
  document.querySelectorAll("#kinds button").forEach(btn=>{
    btn.onclick = ()=>{ kind = btn.dataset.kind; document.querySelectorAll("#kinds button").forEach(b=>b.classList.toggle("on", b===btn)); };
  });
  document.getElementById("cap").onsubmit = (e)=>{
    e.preventDefault();
    const text = document.getElementById("text").value;
    if(!text.trim()) return;
    addNote(phase, document.getElementById("bucket").value, kind, text);
    document.getElementById("text").value = "";
    renderNotes(document.getElementById("notes"), phase);
  };
  renderNotes(document.getElementById("notes"), phase);
}

function checklist(items){
  const d = db();
  return items.map(([id,label])=>{
    const v = d.checks[id] || "não começou";
    return `<div class="check"><div><b>${esc(label)}</b></div><select data-check="${id}">
      ${["não começou","em obra","entregue"].map(o=>`<option ${o===v?"selected":""}>${o}</option>`).join("")}
    </select></div>`;
  }).join("");
}
function bindChecks(){
  document.querySelectorAll("[data-check]").forEach(sel=>{
    sel.onchange = ()=> setCheck(sel.dataset.check, sel.value);
  });
}
function area(id, label, placeholder){
  const v = db().fields[id] || "";
  return `<div class="field"><label>${esc(label)}</label><textarea data-field="${id}" placeholder="${esc(placeholder)}">${esc(v)}</textarea></div>`;
}
function bindAreas(){
  document.querySelectorAll("[data-field]").forEach(el=>{
    el.oninput = ()=> setField(el.dataset.field, el.value);
  });
}

const PAGES = {
  home(){
    return `${shell("")}<main>
      <p class="kicker">Uma jornada · seis portas</p>
      <h1>AL Plataforma.</h1>
      <p class="lead">A Arquitetura de Legado não é três mentorias empilhadas. É uma casa. O método que atravessa a casa já tem nome na central: ACESSO. Os meses abaixo são indicativos. Não substituem o que está na oferta.</p>
      ${acessoBar()}
      <p class="note">Oferta pública: mentoria em grupo, R$ 39 mil, doze meses, vinte e quatro encontros, três imersões, três individuais. Consultoria de R$ 60 mil, com seis individuais, só quando o diagnóstico pedir. Os planos antigos da AF não aparecem aqui como produto.</p>
      <div class="grid">${PHASES.map(p=>`<a class="card" href="${p.href}"><div class="when">${esc(p.when)} · ${esc(p.acesso)}</div><h3>${esc(p.n)} ${esc(p.name)}</h3><p>${esc(p.line)}</p></a>`).join("")}</div>
      <h2>O que não foi mexido</h2>
      <p class="lead">A AF Plataforma segue em <a href="/afplataforma/">/afplataforma/</a>. Login, ferramentas e acessos continuam lá. Esta porta só organiza a fase em que cada uma entra.</p>
      <div class="row"><button class="btn" id="exp" type="button">Baixar o dossiê</button><a class="ghost" href="/al/central/">Voltar à central</a></div>
    </main>`;
  },
  essencia(){
    const buckets = [["historia","História"],["perguntas","Perguntas"],["narrativas","Narrativas"],["padroes","Padrões"],["valores","Valores e símbolos"],["talentos","Talentos"],["ideias","Ideias"],["decisoes","Decisões"],["pendencias","Pendências"],["aplicacao","Aplicação"]];
    return `${shell("essencia")}<main>
      <p class="kicker">Meses 1–3 · A e E</p>
      <h1>Essência.</h1>
      <p class="lead">Protocolo de leitura. Uma pergunta abre uma história. A história pode virar padrão, valor ou oferta. O que a pessoa contou é relato. O que você leu é hipótese. O que os dois fecharam é decisão.</p>
      ${nameField()}
      ${capture("essencia", buckets)}
    </main>`;
  },
  imperio(){
    const items = [["frase","Frase: quem, problema, caminho"],["posicao","Posicionamento"],["linguagem","Linguagem da marca"],["visual","Identidade visual"],["oferta","Oferta e o limite dela"],["canais","Canais escolhidos"],["site","Site ou casa digital"],["produto","Primeiro produto"]];
    return `${shell("imperio")}<main>
      <p class="kicker">Meses 3–6 · Síntese e Sistema</p>
      <h1>Império Digital.</h1>
      <p class="lead">A essência vira ativo. Não é decoração. O que for construído pertence ao cliente quando o contrato, a conta e o acesso disserem isso. Sem essa frase, a promessa é só fala.</p>
      ${nameField()}
      ${checklist(items)}
      ${area("imperio-nota","O que está sendo construído agora","Um ativo. Não a lista inteira.")}
    </main>`;
  },
  financeiro(){
    return `${shell("financeiro")}<main>
      <p class="kicker">Meses 4–8 · pode começar antes</p>
      <h1>Alinhamento.</h1>
      <p class="lead">Duas camadas. A relação com o dinheiro, e a estrutura que sustenta o negócio. A operação continua na AF. Esta página não copia o caixa e não cria um preço novo.</p>
      <p class="note">Os valores de 8, 12 ou 16 semanas, e qualquer plano antigo dentro da AF, não são a Arquitetura de Legado. A oferta pública segue a central: R$ 39 mil. R$ 60 mil só no diagnóstico.</p>
      ${nameField()}
      <h2>Comportamento</h2>
      ${capture("financeiro", [["crenca","Crença"],["cobranca","Cobrar e vender"],["habito","Hábito"],["decisao","Decisão de dinheiro"]])}
      <h2>O que já existe na AF</h2>
      <div class="grid">
        <a class="card" href="/afplataforma/"><div class="when">Operação</div><h3>AF Plataforma</h3><p>Login, módulos, call, Quitei, rotina e complementares. Nada disso foi movido.</p></a>
        <a class="card" href="/afplataforma/fechamento/"><div class="when">Comercial</div><h3>Fechamento</h3><p>Roteiro da call. Orienta a conversa. Não obriga o mesmo caminho para todo mundo.</p></a>
        <a class="card" href="/afplataforma/oratoria/"><div class="when">Voz</div><h3>Oratória</h3><p>A fala da oferta, ainda dentro da casa, não como curso solto.</p></a>
        <a class="card" href="/afplataforma/complementar/encontros.html"><div class="when">Sessões</div><h3>Encontros</h3><p>O roteiro que já existia, agora lido como sessão da jornada.</p></a>
      </div>
    </main>`;
  },
  expansao(){
    return `${shell("expansao")}<main>
      <p class="kicker">Meses 7–10 · Operação</p>
      <h1>Expansão.</h1>
      <p class="lead">Uma etapa que se repete. Entrada, o que acontece, saída. Se a saída for “eu explico”, ainda não é etapa.</p>
      ${nameField()}
      ${checklist([["rotina","Rotina de publicação"],["venda","Processo de venda"],["auto","O que pode ser automático"],["gente","O que outra pessoa já consegue fazer"]])}
      ${area("etapa-entrada","Entrada","O que chega.")}
      ${area("etapa-saida","Saída","O que fica no papel quando você levanta.")}
    </main>`;
  },
  legado(){
    return `${shell("legado")}<main>
      <p class="kicker">Meses 10–12 · continuidade</p>
      <h1>O que permanece.</h1>
      <p class="lead">Doutrina é o princípio que faz o negócio ser ele. Movimento é a ideia que outra pessoa reconhece. Comunidade é quem fica em volta, com um motivo para existir. Nenhum dos três é um grupo de seguidores.</p>
      ${nameField()}
      ${area("doutrina","Doutrina","Quais princípios fazem este negócio ser o que ele é?")}
      ${area("movimento","Movimento","O que as pessoas passam a defender junto?")}
      ${area("comunidade","Comunidade","Quem entra, e o que recebe?")}
      ${checklist([["acessos","Acessos entregues"],["docs","Processos escritos"],["indicador","Um indicador de continuidade"],["ciclo","Próximo ciclo decidido"]])}
    </main>`;
  },
  alma(){
    return `${shell("alma")}<main>
      <p class="kicker">Atravessa o ano · não é a quarta mentoria</p>
      <h1>Tecnologia da Alma.</h1>
      <p class="lead">Serve para a pessoa perceber corpo, mente e campo, e transformar uma intenção em ação. O que se sente aqui é experiência. Não é medida de laboratório e não prova a oferta.</p>
      ${nameField()}
      ${area("corpo","Corpo","Sensação, hábito, cuidado. O que o corpo estava fazendo na hora da decisão?")}
      ${area("mente","Mente","O pensamento que repetiu. Crença, não sentença.")}
      ${area("campo","Campo","Com quem, em que lugar, sob qual clima a decisão aconteceu?")}
      ${area("intencao","Intenção e ação","Uma intenção. Uma ação desta semana. Sem a ação, fica frase.")}
    </main>`;
  }
};

function mount(page){
  document.body.innerHTML = PAGES[page]();
  bindName();
  if(page==="essencia" || page==="financeiro") bindCapture(page);
  bindChecks();
  bindAreas();
  const exp = document.getElementById("exp");
  if(exp) exp.onclick = ()=>{
    const blob = new Blob([JSON.stringify(db(), null, 2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "dossie-al-plataforma.json";
    a.click();
  };
}
window.AL = { mount };
