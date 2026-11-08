import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider,sendPasswordResetEmail,signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore,collection,doc,setDoc,deleteDoc,onSnapshot,query,where} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ADMIN_UID="1GO7dRdFUFg2NwYwzOwjvtWfpAS2";
const CONFIG={apiKey:"AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4",authDomain:"hub-akasha.firebaseapp.com",projectId:"hub-akasha",storageBucket:"hub-akasha.firebasestorage.app",messagingSenderId:"370851875474",appId:"1:370851875474:web:29b1ba3a76b0fed7d9344b"};

const app=initializeApp(CONFIG),auth=getAuth(app),db=getFirestore(app);
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=t=>String(t??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)};

/* ===== CONTEÚDO DO MÉTODO (M.A.P.A.) ===== */
const ETAPAS=[
{t:"Abertura",min:5,obj:"Dar contexto, gerar confiança e combinar o formato.",
 chk:["Apresentei quem sou e a Akasha Hub","Disse a duração (60–75 min) e o resultado: Mapa de Direção","Pedi autorização para registrar/gravar","Disse com transparência que no final posso apresentar uma proposta, sem obrigação"],
 perg:["Como você chegou até aqui?","O que você espera levar desta conversa?"],
 fala:["Hoje você sai com uma leitura organizada da sua realidade e um próximo passo claro.","Vou te escutar bastante. Se fizer sentido, no final te mostro como posso ajudar.","Pode me corrigir a qualquer momento: o mapa é seu."],
 nao:"Prometer resultado financeiro ou esconder que existe uma proposta.",av:"Pessoa confirmou o formato e autorizou o registro."},
{t:"Investigação",min:15,obj:"Entender história, negócio, ativos, objetivos e gargalos.",
 chk:["Profissão/negócio e tempo de atuação","Ativos que já existem (conteúdo, clientes, livro, site)","Objetivo dos próximos 12 meses","Principal gargalo, nas palavras dela","Quem mais participa das decisões"],
 perg:["O que você já construiu até hoje?","O que depende só de você?","O que te impede de dar o próximo passo?","Se nada mudar em 12 meses, como fica?"],
 fala:["Antes de decidir o que construir, precisamos entender o que em você já tem valor.","Sua história pode ser matéria-prima de um método.","Deixa eu repetir como entendi, me diga se está certo."],
 nao:"Oferecer solução antes de entender o problema.",av:"Tenho história, ativos, objetivo e gargalo registrados."},
{t:"Mapa mental",min:10,obj:"Construir a leitura visual junto com a pessoa.",
 chk:["Escolhi o mapa certo (Pessoal, Negócios ou Legado)","Ativei só os vetores que fazem sentido","Preenchi com as palavras dela","Marquei o vetor mais crítico"],
 perg:["Qual dessas áreas mais pesa hoje?","Onde você sente que perde mais energia?"],
 fala:["Não vamos mexer em tudo. Só no que faz sentido para você.","Veja sua realidade organizada numa tela só.","Qual desses pontos, se resolvido, destrava os outros?"],
 nao:"Preencher todos os vetores por obrigação.",av:"Mapa validado e vetor prioritário definido."},
{t:"Devolutiva",min:10,obj:"Separar fatos, hipóteses e oportunidades e fixar a prioridade.",
 chk:["Resumi em 3 pontos","Separei fato, hipótese e oportunidade","Ela confirmou que a leitura está certa","Preenchi padrão, número e gesto","Defini a ação de 7 dias"],
 perg:["Essa leitura faz sentido?","O que eu deixei de fora?","Qual seria o primeiro movimento?"],
 fala:["O que vejo é um padrão: você já tem a matéria-prima, falta estrutura.","Isso é fato, isso é hipótese minha. Me corrija.","Esse é o seu Mapa de Direção, ele é seu mesmo se não contratar nada."],
 nao:"Diagnosticar problema que a pessoa não reconhece.",av:"Ela disse com as próprias palavras que precisa de estrutura."},
{t:"Apresentação",min:15,obj:"Mostrar as 5 fases e o que pode ser construído em cada uma.",
 chk:["Mostrei as 5 fases em tela compartilhada (sem notas privadas)","Liguei cada fase ao gargalo dela","Diferenciei mentoria x processo executivo","Deixei claro o que é exemplo e o que é escopo"],
 perg:["Qual fase te chamou mais atenção?","O que aqui você já tem e o que falta?"],
 fala:["Conhecimento que só existe na sua cabeça ainda depende da sua presença.","Não criamos ferramenta por vaidade. Construímos o que resolve o gargalo.","Legado é o que continua gerando valor quando você não está presente."],
 nao:"Prometer tudo do catálogo em qualquer contrato.",av:"Ela explica com as próprias palavras o que precisa construir."},
{t:"Qualificação",min:5,obj:"Verificar encaixe antes de falar de preço. Interesse ≠ capacidade ≠ prontidão.",
 chk:[],perg:["De 0 a 10, quão pronta você está para começar? O que faltaria para subir um ponto?","Quem mais participa dessa decisão? Podemos chamar para a call?","Você tem agenda para encontros e execução?"],
 fala:["A escala é para eu entender o seu momento, não para pressionar.","Se não for o momento, eu te digo com honestidade.","Só falo de investimento se fizer sentido para os dois lados."],
 nao:"Presumir capacidade pela profissão ou aparência. Falar preço antes do portão.",av:"Portão de aptidão liberado (5 critérios)."},
{t:"Proposta e decisão",min:10,obj:"Recomendar o formato, explicar escopo e investimento, e definir o próximo passo.",
 chk:["Recomendei UM formato com motivo","Expliquei escopo, encontros e limites","Disse o investimento com clareza","Respondi dúvidas e objeções","Quem decide junto participou","Defini próximo passo com data (contrato, pagamento ou retomada)"],
 perg:["O que falta para você decidir hoje?","Quer que eu chame quem decide junto?"],
 fala:["Pelo que você me mostrou, o formato mais coerente é este, e por quê.","Se a decisão precisar de mais alguém, vamos fazer essa conversa juntos.","Se precisar de tempo, combinamos exatamente o que falta e quando retomamos."],
 nao:"Urgência falsa, culpa, pressão ou impedir consulta a terceiros.",av:"Sim, não ou retomada com data e pendência registradas."}];

const PORTAO=["Necessidade real","Capacidade financeira confirmada (por ela)","Disponibilidade de agenda","Autoridade de decisão (ou decisor presente)","Compatibilidade com o formato"];
const OFERTAS=[["AL em grupo",39000,"12 meses · 24 encontros em grupo · 3 imersões · 3 individuais"],["AL individual",69000,"12 meses · base: 6 encontros individuais (definir)"],["Alinhamento Financeiro",5000,"~3 meses · downsell, oferta complementar"],["Essência + Império Digital",null,"Projeto delimitado · preço pendente de decisão"]];
const FASES=[["Arquitetura de Essência","Dossiê, narrativa, posicionamento, método próprio"],["Império Digital","Site, plataforma, produtos, CRM, pagamentos, conteúdo"],["Alinhamento Financeiro","Cash-flow, precificação, metas, processo comercial"],["Expansão","Aquisição, SDR, equipe, processos, indicadores"],["Legado e Continuidade","Documentação, comunidade, governança, formação"]];
const OBJ=[
["Está caro / quero desconto","Valor ainda não ficou claro, ou o caixa aperta.","O que exatamente pesa: o valor total ou o fluxo? Comparado a quê?","Retomo o que você disse que precisa construir e o que cada fase resolve.","Acesso Estratégico (só se autorizado) ou formato menor com escopo próprio."],
["Preciso falar com cônjuge/sócio/contador","Decisão compartilhada, legítima.","Quer chamar essa pessoa agora para eu explicar junto?","Conversa conjunta ainda hoje ou retomada com data.","Nunca impedir a consulta."],
["Quero pensar","Falta de clareza ou confiança.","O que ainda não ficou claro para decidir?","Registro o que falta e marco retomada objetiva.","Se a resposta é vaga, não avançar."],
["Não tenho tempo","Prioridade ou medo de não executar.","Quantas horas por semana são realistas?","Mostro o ritmo real: encontros + execução comigo.","Se não há agenda, não recomendar agora."],
["Já tenho equipe/agência/site","Medo de duplicar.","O que essa estrutura entrega hoje e o que falta?","Posiciono como direção, não substituição.","Escopo só nas lacunas."],
["Já investi em outra mentoria","Desconfiança.","O que faltou naquela experiência?","Mostro critérios de entrega verificáveis e escopo por escrito.","Sem promessa de faturamento."],
["Quero garantia","Segurança.","Que garantia te deixaria seguro?","Garantia de execução do escopo contratado, nunca de resultado de mercado.","Revisão jurídica do contrato."],
["Quero só o financeiro / só a Essência","Necessidade menor ou receio.","Esse recorte resolve seu gargalo principal?","Ofereço o projeto menor com resultado e limites próprios.","Não empurrar o ciclo completo sem necessidade."],
["Moro longe / não vou ao presencial","Logística.","O que impede: custo, agenda ou distância?","Imersões têm calendário prévio; individual pode ter formato adaptado.","Custos de deslocamento em contrato."]];
const V12=["Rotina","Tempo","Financeiro","Trabalho e renda","Saúde prática","Objetivos","Projetos","Tarefas","Compras e investimentos","Ambiente","Conteúdo","Família e dinheiro"];
const MAPAS={pessoal:["Alinhamento Pessoal",V12],negocios:["Zero ao Zen Negócios",["Ideia","Público","Problema","Valor","Oferta","Aquisição","Operação","Finanças","Próximo passo"]],legado:["Arquitetura de Legado",FASES.map(f=>f[0])]};
const brl=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

/* ===== ESTADO ===== */
const S={user:null,list:[],cur:null,view:"dashboard",stage:0,unsub:null};
let timer;const save=()=>{if(!S.cur)return;S.cur.atualizado=Date.now();clearTimeout(timer);timer=setTimeout(()=>setDoc(doc(db,"mapaSessoes",S.cur.id),S.cur).catch(e=>toast("Erro ao salvar: "+e.code)),500)};
const nova=()=>({id:crypto.randomUUID(),owner:S.user.uid,nome:"",origem:"",perfil:"",mapa:"pessoal",etapa:0,check:{},vet:{},sint:{padrao:"",numero:"",gesto:"",sete:""},pront:null,portao:{},notas:"",status:"andamento",resultado:"",criado:Date.now(),atualizado:Date.now()});
const setView=v=>{S.view=v;$$(".nav").forEach(b=>b.classList.toggle("active",b.dataset.view===v));$$(".view").forEach(e=>e.classList.add("hidden"));$("#"+v+"View").classList.remove("hidden");render()};

/* ===== AUTH ===== */
const autorizado=u=>u.uid===ADMIN_UID;
$("#loginBtn").onclick=()=>signInWithEmailAndPassword(auth,$("#email").value,$("#password").value).catch(e=>$("#authMessage").textContent="Não foi possível entrar: "+e.code);
$("#googleBtn").onclick=()=>signInWithPopup(auth,new GoogleAuthProvider()).catch(e=>$("#authMessage").textContent=e.code);
$("#resetBtn").onclick=()=>$("#email").value?sendPasswordResetEmail(auth,$("#email").value).then(()=>$("#authMessage").textContent="E-mail de redefinição enviado."):$("#authMessage").textContent="Digite seu e-mail.";
$("#logoutBtn").onclick=()=>signOut(auth);
onAuthStateChanged(auth,u=>{
 S.unsub&&S.unsub();
 if(u&&autorizado(u)){S.user=u;$("#authView").classList.add("hidden");$("#appView").classList.remove("hidden");$("#logoutBtn").classList.remove("hidden");$("#userLabel").textContent=u.email;
  S.unsub=onSnapshot(query(collection(db,"mapaSessoes"),where("owner","==",u.uid)),s=>{S.list=s.docs.map(d=>d.data()).sort((a,b)=>b.atualizado-a.atualizado);if(S.cur){const f=S.list.find(x=>x.id===S.cur.id);if(f&&f.atualizado>S.cur.atualizado)S.cur=f}if(!document.activeElement||!/INPUT|TEXTAREA/.test(document.activeElement.tagName))render()});setView("dashboard")}
 else{if(u){signOut(auth);$("#authMessage").textContent="Conta sem acesso de mentor."}S.user=null;$("#authView").classList.remove("hidden");$("#appView").classList.add("hidden");$("#logoutBtn").classList.add("hidden")}});
$$(".nav").forEach(b=>b.onclick=()=>setView(b.dataset.view));
$("#newSessionBtn").onclick=()=>{S.cur=nova();S.stage=0;save();setView("session")};

/* ===== RENDER ===== */
const needS=()=>S.cur?"":`<div class="card"><p>Abra ou crie uma sessão no Painel.</p></div>`;
function render(){
 if(S.view==="dashboard"){const L=S.list;$("#totalSessions").textContent=L.length;$("#activeSessions").textContent=L.filter(s=>s.status==="andamento").length;$("#doneSessions").textContent=L.filter(s=>s.status!=="andamento").length;
  $("#sessionList").innerHTML=L.map(s=>`<div class="card row"><div><b>${esc(s.nome||"Sem nome")}</b><br><small>${esc(s.origem||"origem?")} · etapa ${s.etapa+1}/7 · ${esc(s.status)}${s.resultado?" · "+esc(s.resultado):""}</small></div><div><button class="secondary" data-open="${s.id}">Abrir</button> <button class="ghost" data-del="${s.id}">✕</button></div></div>`).join("")||`<div class="card">Nenhuma sessão ainda.</div>`;
  $$("[data-open]").forEach(b=>b.onclick=()=>{S.cur=S.list.find(x=>x.id===b.dataset.open);S.stage=S.cur.etapa;setView("session")});
  $$("[data-del]").forEach(b=>b.onclick=()=>confirm("Apagar sessão?")&&deleteDoc(doc(db,"mapaSessoes",b.dataset.del)))}
 else if(S.view==="session")sessao();else if(S.view==="map")mapa();else if(S.view==="guide")roteiro();else resumo()}

const bind=(root,obj)=>root.querySelectorAll("[data-k]").forEach(el=>{const p=el.dataset.k.split(".");const get=()=>p.reduce((o,k)=>o?.[k],obj);el.value=get()??"";el.oninput=()=>{let o=obj;p.slice(0,-1).forEach(k=>o=o[k]??={});o[p.at(-1)]=el.type==="number"?(el.value===""?null:+el.value):el.value;save()}});

function sessao(){
 const el=$("#sessionView");if(!S.cur){el.innerHTML=needS();return}
 const s=S.cur,e=ETAPAS[S.stage],ok=PORTAO.every((_,i)=>s.portao[i]);
 let extra="";
 if(S.stage===5)extra=`<div class="card"><h3>Portão de aptidão</h3>${PORTAO.map((p,i)=>`<label class="chk"><input type="checkbox" data-p="${i}" ${s.portao[i]?"checked":""}> ${p}</label>`).join("")}<label>Prontidão 0–10 (avalia, não exige 10)<input type="number" min="0" max="10" data-k="pront"></label><p class="gate ${ok?"open":""}">${ok?"✓ Portão liberado: pode apresentar proposta.":"Portão fechado: não falar preço. Ofereça retomada ou encerre com o Mapa de Direção."}</p></div>`;
 if(S.stage===6)extra=ok?`<div class="card"><h3>Ofertas (visão privada)</h3>${OFERTAS.map(o=>`<div class="row"><span><b>${o[0]}</b><br><small>${o[2]}</small></span><span>${o[1]?brl(o[1]):"a definir"}${o[1]?`<br><small>Acesso Estratégico 10%: ${brl(o[1]*.1)} + saldo ${brl(o[1]*.9)}</small>`:""}</span></div>`).join("")}<small>Acesso Estratégico: condição interna, só se autorizada por você. Contrato e prazos escritos.</small></div>
 <div class="card"><h3>Objeções</h3>${OBJ.map(o=>`<details><summary>${o[0]}</summary><p><b>Pode significar:</b> ${o[1]}<br><b>Investigar:</b> ${o[2]}<br><b>Resposta:</b> ${o[3]}<br><b>Alternativa / limite:</b> ${o[4]}</p></details>`).join("")}</div>
 <div class="card"><h3>Resultado</h3><select data-k="resultado"><option value="">Em aberto</option><option>Fechou</option><option>Retomada marcada</option><option>Não é o momento</option><option>Sem encaixe</option></select></div>`:`<div class="card gate">Preço e proposta bloqueados até liberar o portão na etapa 6.</div>`;
 el.innerHTML=`<div class="card"><div class="grid3"><label>Nome<input data-k="nome"></label><label>Origem (Reel, live, indicação…)<input data-k="origem"></label><label>Perfil/profissão<input data-k="perfil"></label></div></div>
 <div class="steps">${ETAPAS.map((x,i)=>`<button class="step ${i===S.stage?"on":""}" data-s="${i}">${i+1}<small>${x.t}</small></button>`).join("")}</div>
 <div class="card"><div class="row"><h2>${S.stage+1}. ${e.t} <small>· ${e.min} min</small></h2><button class="primary" id="tele">▶ Teleprompter</button></div><p>${e.obj}</p>
 ${e.chk.length?`<h3>Checklist</h3>${e.chk.map((c,i)=>`<label class="chk"><input type="checkbox" data-c="${S.stage}.${i}" ${s.check[S.stage+"."+i]?"checked":""}> ${c}</label>`).join("")}`:""}
 <h3>Perguntas</h3><ul>${e.perg.map(p=>`<li>${p}</li>`).join("")}</ul><h3>Frases-chave</h3><ul class="quote">${e.fala.map(p=>`<li>${p}</li>`).join("")}</ul>
 <p class="warn"><b>Não dizer:</b> ${e.nao}</p><p><b>Avançar quando:</b> ${e.av}</p></div>${extra}
 <div class="card"><label>Notas privadas (nunca aparecem no compartilhamento)<textarea data-k="notas" rows="4"></textarea></label></div>
 <div class="row"><button class="secondary" id="prev">← Anterior</button><button class="primary" id="next">Próxima →</button></div>`;
 bind(el,s);
 el.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>go(+b.dataset.s));
 el.querySelectorAll("[data-c]").forEach(b=>b.onchange=()=>{s.check[b.dataset.c]=b.checked;save()});
 el.querySelectorAll("[data-p]").forEach(b=>b.onchange=()=>{s.portao[b.dataset.p]=b.checked;save();sessao()});
 el.querySelectorAll("[data-k=resultado]").forEach(b=>b.onchange=()=>{s.status=b.value?"concluida":"andamento"});
 $("#prev").onclick=()=>go(S.stage-1);$("#next").onclick=()=>go(S.stage+1);$("#tele").onclick=tele;
}
function go(i){if(i<0||i>6)return;S.stage=i;S.cur.etapa=i;save();sessao()}
function tele(){const e=ETAPAS[S.stage],o=document.createElement("div");o.className="tele";let k=0;const L=[...e.fala,...e.perg];
 const draw=()=>o.innerHTML=`<button class="ghost" id="x">✕ Fechar</button><small>${S.stage+1}. ${e.t} · ${k+1}/${L.length}</small><p>${L[k]}</p><div class="row"><button class="secondary" id="a">←</button><button class="primary" id="b">→</button></div>`;
 draw();document.body.append(o);o.onclick=ev=>{const id=ev.target.id;if(id==="x")o.remove();if(id==="a"&&k>0){k--;draw()}if(id==="b"&&k<L.length-1){k++;draw()}}}

function mapa(){
 const el=$("#mapView");if(!S.cur){el.innerHTML=needS();return}
 const s=S.cur,[nm,V]=MAPAS[s.mapa];
 el.innerHTML=`<div class="row"><h2>Mapa mental</h2><select id="mp">${Object.entries(MAPAS).map(([k,v])=>`<option value="${k}" ${k===s.mapa?"selected":""}>${v[0]}</option>`).join("")}</select></div><p class="muted">Ative só o que faz sentido para a pessoa. Escreva com as palavras dela.</p>
 <div class="tree"><div class="root">${esc(s.nome||"Pessoa")}</div><div class="nodes">${V.map((v,i)=>{const k=s.mapa+i,d=s.vet[k]||{};return `<div class="node ${d.on?"on":""} ${d.pri?"pri":""}"><div class="row"><label class="chk"><input type="checkbox" data-on="${k}" ${d.on?"checked":""}> <b>${String(i+1).padStart(2,"0")} ${v}</b></label><button class="ghost" data-pri="${k}">★</button></div>${d.on?`<textarea rows="3" data-t="${k}" placeholder="O que ela disse…">${esc(d.txt||"")}</textarea>`:""}</div>`}).join("")}</div></div>`;
 $("#mp").onchange=e=>{s.mapa=e.target.value;save();mapa()};
 const g=k=>s.vet[k]??={};
 el.querySelectorAll("[data-on]").forEach(b=>b.onchange=()=>{g(b.dataset.on).on=b.checked;save();mapa()});
 el.querySelectorAll("[data-pri]").forEach(b=>b.onclick=()=>{g(b.dataset.pri).pri=!g(b.dataset.pri).pri;save();mapa()});
 el.querySelectorAll("[data-t]").forEach(b=>b.oninput=()=>{g(b.dataset.t).txt=b.value;save()});
}

function roteiro(){$("#guideView").innerHTML=`<h2>Roteiro completo</h2><p class="muted">Sessão de 60–75 min · M.A.P.A.: Mapeamento, Análise, Projeção, Avanço</p>`+ETAPAS.map((e,i)=>`<details class="card"><summary><b>${i+1}. ${e.t}</b> · ${e.min} min</summary><p>${e.obj}</p><ul>${e.chk.map(c=>`<li>${c}</li>`).join("")}</ul><p><b>Perguntas:</b></p><ul>${e.perg.map(c=>`<li>${c}</li>`).join("")}</ul><ul class="quote">${e.fala.map(c=>`<li>${c}</li>`).join("")}</ul><p class="warn">Não dizer: ${e.nao}</p></details>`).join("")+`<h2>As 5 fases</h2>${FASES.map((f,i)=>`<div class="card"><b>${i+1}. ${f[0]}</b><br><small>${f[1]}</small></div>`).join("")}`}

function resumo(){
 const el=$("#summaryView");if(!S.cur){el.innerHTML=needS();return}
 const s=S.cur,[nm,V]=MAPAS[s.mapa];
 const txt=()=>`MAPA DE DIREÇÃO · ${s.nome||""}\n\nPadrão: ${s.sint.padrao}\nNúmero: ${s.sint.numero}\nGesto: ${s.sint.gesto}\n\nÁreas (${nm}):\n`+V.map((v,i)=>({v,d:s.vet[s.mapa+i]})).filter(x=>x.d?.on&&x.d.txt).map(x=>`${x.d.pri?"★ ":"• "}${x.v}: ${x.d.txt}`).join("\n")+`\n\nPróximos 7 dias: ${s.sint.sete}`;
 el.innerHTML=`<h2>Síntese e direção</h2><div class="card"><label>Padrão<textarea rows="2" data-k="sint.padrao"></textarea></label><label>Número<input data-k="sint.numero"></label><label>Gesto<input data-k="sint.gesto"></label><label>Ação de 7 dias (uma ação, um responsável, um critério)<textarea rows="2" data-k="sint.sete"></textarea></label></div><div class="card"><h3>Prévia compartilhável</h3><p class="muted">Só os campos acima e o mapa. Notas privadas e preços nunca entram.</p><pre id="pv"></pre><div class="row"><button class="primary" id="cp">Copiar</button><button class="secondary" id="pr">Imprimir / PDF</button></div></div>`;
 bind(el,s);const pv=$("#pv"),up=()=>pv.textContent=txt();up();el.addEventListener("input",up);
 $("#cp").onclick=()=>navigator.clipboard.writeText(txt()).then(()=>toast("Copiado"));$("#pr").onclick=()=>window.print();
}
