import { session, isMentorSession } from "./auth.js";
import { Store } from "./storage.js";
import { esc, navigate, getCurrentView } from "./navigation.js?v=legado1";
import { db } from "../../firebase/firebase-config.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAllUsersForAf } from "../../firebase/firestore.js";

const PHASES = [
  {id:1,title:"Arquitetura de Essência",desc:"História, identidade, valores, capacidades e direção.",deliverable:"Dossiê de Essência e direção inicial",topics:["História e contexto","Valores e capacidades","Visão de futuro","Direção estratégica"]},
  {id:2,title:"Arquitetura de Marca e Negócio",desc:"Posicionamento, oferta, identidade e arquitetura comercial.",deliverable:"Mapa de marca, oferta e negócio",topics:["Posicionamento e narrativa","Público e proposta de valor","Oferta e modelo de negócio","Ativos digitais prioritários"]},
  {id:3,title:"Construção e Consolidação",desc:"Ativos, processos, operação e sustentação econômica.",deliverable:"Plano de construção e operação",topics:["Plano de ativos","Processos e operação","Indicadores e finanças","Validação e consolidação"]},
  {id:4,title:"Expansão e Escala",desc:"Aquisição, distribuição, relacionamento e crescimento sustentável.",deliverable:"Plano de expansão priorizado",topics:["Aquisição e relacionamento","Conteúdo e distribuição","Canais e parcerias","Experimentos de crescimento"]},
  {id:5,title:"Governança e Legado",desc:"Autonomia, documentação, continuidade e transmissão.",deliverable:"Mapa de continuidade do legado",topics:["Documentação e governança","Responsabilidades e autonomia","Comunidade e transmissão","Plano de continuidade"]}
];
const MEETINGS = [
["Essência: ponto de partida","Mapear contexto, expectativas e o resultado que precisa mudar.",1],
["História, identidade e repertório","Transformar experiências e capacidades em matéria-prima estratégica.",1],
["Valores, critérios e visão de futuro","Definir princípios que orientam decisões e limites.",1],
["Capacidades e oportunidades","Identificar forças, ativos existentes e lacunas prioritárias.",1],
["Direção estratégica do legado","Consolidar a primeira leitura e definir as perguntas do próximo ciclo.",1],
["Posicionamento e diferenciação","Explicar para quem o projeto existe e por que importa.",2],
["Público e proposta de valor","Relacionar necessidades reais, valor entregue e evidências.",2],
["Narrativa, marca e comunicação","Organizar linguagem, mensagem e consistência da marca.",2],
["Oferta e modelo de negócio","Estruturar produtos, serviços, entrega e lógica comercial.",2],
["Arquitetura comercial e ativos","Priorizar presença digital e os ativos que sustentam a oferta.",2],
["Plano de construção priorizado","Transformar objetivos em entregas, responsáveis e dependências.",3],
["Ativos digitais e experiência","Definir como os ativos se conectam à jornada do cliente.",3],
["Operação, processos e sistemas","Reduzir improviso e tornar a execução repetível.",3],
["Indicadores e sustentabilidade","Escolher métricas úteis para acompanhar saúde e progresso.",3],
["Consolidação e revisão de decisões","Revisar evidências, gargalos e próximos movimentos.",3],
["Aquisição e relacionamento","Desenhar caminhos para atrair, converter e manter clientes.",4],
["Conteúdo e distribuição","Conectar mensagem, canais, frequência e objetivos.",4],
["Parcerias e oportunidades","Mapear relações que podem ampliar alcance e capacidade.",4],
["Experimentos de crescimento","Testar hipóteses com critérios claros e custo controlado.",4],
["Expansão sem perder essência","Ajustar capacidade, processos e prioridades antes de escalar.",4],
["Governança e documentação","Registrar como o projeto funciona e como as decisões são tomadas.",5],
["Autonomia e responsabilidades","Diminuir dependências desnecessárias do fundador.",5],
["Transmissão, comunidade e continuidade","Organizar conhecimento, relações e formas de perpetuar o legado.",5],
["Mapa do legado e próximo ciclo","Consolidar aprendizados, resultados e plano de continuidade.",5]
];
const EXEC = [
 {id:1,title:"Diagnóstico e definição",desc:"Revisar contexto, validar prioridades e definir o escopo de produção executiva.",out:"Plano executivo acordado"},
 {id:2,title:"Construção e validação",desc:"Trabalhar nos ativos prioritários, revisar versões e tomar decisões em conjunto.",out:"Versões e decisões registradas"},
 {id:3,title:"Consolidação e continuidade",desc:"Revisar entregas, organizar acessos e registrar próximos movimentos.",out:"Entregas e plano de continuidade"}
];
const fresh = () => ({project:{name:"Meu projeto de legado",stage:"Ainda estou definindo",goal:"",audience:"",strengths:"",priority:"",notes:""},meetings:{},execNotes:{},assets:[]});
function key(){return "legado_jornada_"+(session.uid||"anon");}
function load(){return {...fresh(),...(Store.get(key(),{})||{})};}
let state=load();
let tab="dashboard";
let phaseFilter=0;
let hydratedUid = null;
let hydrateInFlight = null;
function save(){
  state._updatedAtMs = Date.now();
  Store.set(key(),state);
  if (!session.uid || session.mode !== "firebase") return;
  const payload = { data: state, updatedAtMs: state._updatedAtMs, updatedAt: serverTimestamp(), uid: session.uid, name: session.name || "", email: session.email || "" };
  setDoc(doc(db,"mentorias",session.uid,"arquitetura_legado","jornada"),payload,{merge:true})
    .catch(e=>console.warn("[Arquitetura de Legado] sincronização Firestore indisponível:",e?.code||e?.message||e));
}
async function hydrateCloud(){
  const uid = session.uid;
  if (!uid || session.mode !== "firebase" || hydratedUid === uid || hydrateInFlight === uid) return;
  hydrateInFlight = uid;
  try {
    const snap = await getDoc(doc(db,"mentorias",uid,"arquitetura_legado","jornada"));
    if (snap.exists()) {
      const remote = snap.data() || {};
      if (remote.data && Number(remote.updatedAtMs || 0) > Number(state._updatedAtMs || 0)) {
        state = { ...fresh(), ...remote.data };
        Store.set(key(),state);
      }
    }
    hydratedUid = uid;
    if (getCurrentView() === "arquitetura-legado") navigate("arquitetura-legado");
  } catch(e) {
    console.warn("[Arquitetura de Legado] leitura Firestore indisponível:",e?.code||e?.message||e);
  } finally {
    hydrateInFlight = null;
  }
}
function pct(){const a=Object.values(state.meetings).filter(Boolean).length;return Math.round(a/24*70+Math.min(state.assets.filter(x=>x.status==="Entregue").length,3)/3*15+(state.project.goal?15:0));}
function statusClass(v){return v==="Entregue"?"done":v==="Em produção"||v==="Em validação"?"current":"";}
function head(k,t,s){return '<div class="alx-head"><div class="alx-kicker">'+k+'</div><h2 class="hero-title">'+t+'</h2><p class="hero-sub">'+s+'</p></div>';}
function card(title,body,extra=""){return '<article class="alx-card '+extra+'"><h3>'+title+'</h3>'+body+'</article>';}
function phaseCards(){return PHASES.map(p=>{const list=MEETINGS.map((m,i)=>({m,i})).filter(x=>x.m[2]===p.id);const done=list.filter(x=>state.meetings[x.i+1]).length;return '<button type="button" class="alx-phase" data-al-tab="jornada"><span class="alx-num">0'+p.id+'</span><b>'+p.title+'</b><p>'+p.desc+'</p><span class="alx-bar"><i style="width:'+(done/list.length*100)+'%"></i></span><small>'+done+'/'+list.length+' encontros marcados</small></button>'}).join("");}
function dashboard(){return '<div class="alx-hero"><div><div class="alx-kicker">ARQUITETURA DE LEGADO · SUA JORNADA</div><h2 class="hero-title">'+esc(state.project.name||"Seu legado")+'</h2><p class="hero-sub">Um ecossistema de clareza, estratégia e construção. O tema do grupo orienta a conversa; suas prioridades e seu estágio orientam a aplicação individual.</p><div class="alx-actions"><button class="tool-btn" data-al-tab="projeto">Continuar meu projeto</button><button class="tool-btn" data-al-tab="encontros">Ver os encontros</button></div></div><div class="alx-ring"><b>'+pct()+'%</b><span>PROGRESSO REGISTRADO</span></div></div><div class="alx-stats"><div><small>Encontros coletivos</small><b>'+Object.values(state.meetings).filter(Boolean).length+' / 24</b></div><div><small>Duração</small><b>12 meses</b></div><div><small>Fases conectadas</small><b>05</b></div><div><small>Ativos registrados</small><b>'+state.assets.length+'</b></div></div><div class="alx-section"><div><h3>As cinco fases</h3><p>Uma visão integrada, com aplicação adaptada à sua realidade.</p></div><button class="tool-btn" data-al-tab="jornada">Abrir jornada</button></div><div class="alx-phases">'+phaseCards()+'</div><div class="alx-grid2">'+card("Seu projeto",'<p>Registre seu objetivo, o estágio atual e a prioridade que precisa avançar primeiro.</p><button class="tool-btn" data-al-tab="projeto">Abrir diagnóstico inicial</button>')+card("Produção executiva",'<p>Acompanhe escopo, ativos, decisões e entregas combinadas nas sessões individuais.</p><button class="tool-btn" data-al-tab="executivo">Abrir produção executiva</button>')+'</div><div class="alx-note"><b>Como avançar:</b> prepare-se → participe → registre decisões → execute → valide → revise. Marcar um encontro como concluído aqui é um registro pessoal, não comprovação oficial de presença.</div>';}
function journey(){return head("MAPA DA JORNADA","Cinco fases, um ecossistema","O tema coletivo não determina a etapa individual. A sequência abaixo é uma estrutura inicial de trabalho, que pode ser ajustada conforme diagnóstico e decisões.")+'<div class="alx-stack">'+PHASES.map(p=>{const list=MEETINGS.map((m,i)=>({m,i})).filter(x=>x.m[2]===p.id);const done=list.filter(x=>state.meetings[x.i+1]).length;return '<article class="alx-card alx-phase-row"><span class="alx-num">0'+p.id+'</span><div><h3>'+p.title+'</h3><p>'+p.desc+'</p><p class="alx-muted"><b>Entrega orientadora:</b> '+p.deliverable+'</p><div class="alx-tags">'+p.topics.map(t=>'<span>'+t+'</span>').join("")+'</div></div><div><span class="alx-status '+(done===list.length?"done":done?"current":"")+'">'+(done===list.length?"Concluída":done?"Em andamento":"Planejada")+'</span><p class="alx-muted">'+done+'/'+list.length+' encontros</p><button class="tool-btn" data-al-phase="'+p.id+'">Ver encontros</button></div></article>'}).join("")+'</div><div class="alx-note"><b>Regra de aplicação:</b> em cada encontro, conecte o tema central à essência, à marca, ao negócio, aos ativos, à operação, às finanças, à expansão e à continuidade. A profundidade muda conforme a necessidade de cada projeto.</div>';}
function meetings(){return head("RITMO COLETIVO","24 encontros · 12 meses","Temas provisórios para estruturar o percurso. Datas, chamadas, gravações e materiais oficiais devem ser ligados ao calendário real da mentoria.")+'<div class="alx-actions alx-filters"><button class="tool-btn" data-al-filter="0">Todos</button>'+PHASES.map(p=>'<button class="tool-btn" data-al-filter="'+p.id+'">'+p.id+'. '+p.title+'</button>').join("")+'</div><div class="alx-stack">'+MEETINGS.map((m,i)=>({m,i})).filter(x=>!phaseFilter||x.m[2]===phaseFilter).map(({m,i})=>'<article class="alx-card alx-meeting"><div class="alx-meetingnum">'+String(i+1).padStart(2,"0")+'</div><div><h3>'+m[0]+'</h3><p>'+m[1]+'</p><div class="alx-tags"><span>Mês '+Math.ceil((i+1)/2)+'</span><span>Fase '+m[2]+' · '+PHASES[m[2]-1].title+'</span><span>Preparação + aplicação + próximo passo</span></div></div><button class="tool-btn" data-al-meeting="'+(i+1)+'">'+(state.meetings[i+1]?"✓ Marcado como concluído":"Marcar concluído")+'</button></article>').join("")+'</div>';}
function project(){const p=state.project;return head("DIAGNÓSTICO INICIAL","O projeto por trás do legado","Comece pelo que já sabe. Respostas são editáveis ao longo da jornada e servem para preparar a conversa com o mentor.")+'<form id="alProjectForm" class="alx-card"><div class="alx-formgrid"><label>Nome do projeto<input name="name" value="'+esc(p.name)+'" required></label><label>Estágio atual<select name="stage">'+["Ainda estou definindo","Ideia inicial","Marca ou oferta em construção","Negócio em operação","Negócio em expansão","Reorganização ou reposicionamento"].map(x=>'<option '+(p.stage===x?"selected":"")+'>'+x+'</option>').join("")+'</select></label><label class="wide">Qual resultado deseja construir nos próximos 12 meses?<textarea name="goal">'+esc(p.goal)+'</textarea></label><label>Quem deseja servir ou impactar?<textarea name="audience">'+esc(p.audience)+'</textarea></label><label>Quais capacidades ou ativos já possui?<textarea name="strengths">'+esc(p.strengths)+'</textarea></label><label class="wide">Qual é a prioridade mais importante neste momento?<textarea name="priority">'+esc(p.priority)+'</textarea></label><label class="wide">Contexto, dúvidas e decisões pendentes<textarea name="notes">'+esc(p.notes)+'</textarea></label></div><div class="alx-actions"><button class="tool-btn" type="submit">Salvar diagnóstico</button></div></form><div class="alx-note"><b>Nota de armazenamento:</b> as respostas são guardadas localmente de imediato e sincronizadas com o Firestore quando a sessão Firebase está ativa e a conexão permite. Se a sincronização falhar, a cópia local permanece neste dispositivo; confira a conexão e salve novamente.</div>';}
function assets(){return state.assets.length?state.assets.map((a,i)=>'<div class="alx-asset"><div><b>'+esc(a.name)+'</b><p>'+esc(a.goal||"Objetivo não informado")+' · '+esc(a.owner)+' · <span class="alx-status '+statusClass(a.status)+'">'+esc(a.status)+'</span></p><p class="alx-muted">'+esc(a.notes||"")+'</p></div><button class="tool-btn" data-al-remove="'+i+'">Remover</button></div>').join(""):'<p class="alx-muted">Nenhum ativo registrado. Adicione apenas itens discutidos e combinados no escopo do projeto.</p>';}
async function management(){
 if(!isMentorSession()) return head("GESTÃO","Acesso restrito","Esta área é exclusiva do mentor.");
 try {
  const users = await getAllUsersForAf();
  const rows = await Promise.all(users.map(async u=>{
   try {
    const snap = await getDoc(doc(db,"mentorias",u.uid,"arquitetura_legado","jornada"));
    if(!snap.exists()) return null;
    const d=snap.data()||{}, s=d.data||{};
    const meets=Object.values(s.meetings||{}).filter(Boolean).length;
    const project=s.project||{};
    return {uid:u.uid,name:u.name||d.name||u.email||u.uid,email:u.email||d.email||"",project,meets,assets:(s.assets||[]).length,updatedAtMs:d.updatedAtMs||0};
   } catch(e){return null;}
  }));
  const list=rows.filter(Boolean).sort((a,b)=>b.updatedAtMs-a.updatedAtMs);
  return head("OPERAÇÃO DO MENTOR","Jornadas dos mentorandos","Resumo das jornadas que já sincronizaram seus dados com o Firestore. O painel só mostra dados enviados pela plataforma; ainda não representa presença oficial nem avaliação do mentor.")+
   (list.length?'<div class="alx-stack">'+list.map(x=>'<article class="alx-card"><div class="alx-kicker">'+esc(x.stage||"JORNADA ATIVA")+'</div><h3>'+esc(x.project.name||x.name)+'</h3><p>'+esc(x.name)+(x.email?' · '+esc(x.email):'')+'</p><div class="alx-tags"><span>'+x.meets+'/24 encontros marcados</span><span>'+x.assets+' ativos registrados</span><span>'+esc(x.project.stage||"Estágio não definido")+'</span></div>'+(x.project.goal?'<p><b>Objetivo:</b> '+esc(x.project.goal)+'</p>':'')+(x.project.priority?'<p><b>Prioridade:</b> '+esc(x.project.priority)+'</p>':'')+'<p class="alx-muted">Última sincronização: '+(x.updatedAtMs?new Date(x.updatedAtMs).toLocaleString("pt-BR"):"sem data")+'</p></article>').join("")+'</div>':'<div class="alx-card"><p>Nenhuma jornada sincronizada encontrada ainda. Quando um mentorando salvar seu projeto na plataforma com a conta conectada, o registro aparecerá aqui.</p></div>');
 } catch(e) {
  return head("OPERAÇÃO DO MENTOR","Não foi possível carregar as jornadas","Confira o acesso à base de dados e tente novamente.")+'<div class="alx-note">'+esc(e?.message||"Erro ao consultar os registros.")+'</div>';
 }
}
function executive(){return head("SESSÕES INDIVIDUAIS","Produção executiva","Três marcos individuais para transformar diagnóstico em decisões, decisões em ativos e ativos em continuidade. O escopo é combinado por projeto; nenhum ativo específico é presumido.")+'<div class="alx-grid3">'+EXEC.map(e=>'<article class="alx-card"><div class="alx-kicker">MARCO EXECUTIVO 0'+e.id+'</div><h3>'+e.title+'</h3><p>'+e.desc+'</p><div class="alx-note"><b>Resultado esperado:</b> '+e.out+'</div><label>Preparação e decisões<textarea data-al-exec="'+e.id+'" placeholder="Contexto, dúvidas, decisões e informações que faltam">'+esc(state.execNotes[e.id]||"")+'</textarea></label><button class="tool-btn" data-al-save-exec="'+e.id+'">Salvar preparação</button></article>').join("")+'</div><div class="alx-section"><div><h3>Ativos e entregas</h3><p>Registre escopo, responsável, status e validação.</p></div></div><form id="alAssetForm" class="alx-card"><div class="alx-formgrid"><label>Nome do ativo<input name="name" required placeholder="Ex.: site institucional"></label><label>Objetivo<input name="goal" placeholder="Resultado esperado"></label><label>Responsável<select name="owner"><option>Definir em conjunto</option><option>Mentor</option><option>Mentorando</option><option>Terceiro</option></select></label><label>Status<select name="status"><option>Planejado</option><option>Aguardando informações</option><option>Em produção</option><option>Em validação</option><option>Entregue</option></select></label><label class="wide">Escopo, dependências e observações<textarea name="notes"></textarea></label></div><div class="alx-actions"><button class="tool-btn" type="submit">Adicionar ativo</button></div><div class="alx-assets">'+assets()+'</div></form>';}
function injectCss(){if(document.getElementById("alxStyle"))return;const s=document.createElement("style");s.id="alxStyle";s.textContent=`
.alx-head{margin-bottom:22px}.alx-kicker{font-size:10px;letter-spacing:.17em;color:var(--gold);text-transform:uppercase;margin-bottom:8px}.alx-hero{display:grid;grid-template-columns:minmax(0,1fr) 150px;gap:24px;align-items:center;padding:clamp(20px,3vw,32px);border:1px solid var(--line);background:linear-gradient(120deg,var(--bg2),var(--surface));margin-bottom:15px}.alx-ring{width:132px;height:132px;border-radius:50%;background:conic-gradient(var(--gold) ${pct()}%,var(--line) 0);display:grid;place-content:center;text-align:center;position:relative}.alx-ring:before{content:"";position:absolute;inset:8px;border-radius:50%;background:var(--bg2)}.alx-ring b,.alx-ring span{position:relative}.alx-ring b{font:600 32px var(--font-d)}.alx-ring span{font-size:8px;color:var(--muted);max-width:95px}.alx-actions{display:flex;gap:8px;flex-wrap:wrap;margin:15px 0}.alx-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:14px 0 28px}.alx-stats>div{border:1px solid var(--line);padding:14px;background:var(--surface)}.alx-stats small{display:block;color:var(--muted);font-size:10px}.alx-stats b{display:block;font:600 25px var(--font-d);margin-top:5px}.alx-section{display:flex;justify-content:space-between;align-items:end;gap:12px;margin:25px 0 13px}.alx-section h3{font:500 1.55rem var(--font-d);margin:0}.alx-section p,.alx-card p{color:var(--muted);font-size:12px;line-height:1.6}.alx-phases{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.alx-phase{display:flex;flex-direction:column;align-items:start;text-align:left;gap:9px;border:1px solid var(--line);background:var(--surface);padding:15px;color:var(--text);cursor:pointer;min-width:0}.alx-phase:hover{border-color:var(--gold)}.alx-num{font:600 26px var(--font-d);color:var(--gold)}.alx-phase b{font-size:12px;line-height:1.4}.alx-phase p{color:var(--muted);font-size:11px;line-height:1.5;margin:0}.alx-bar{width:100%;height:4px;background:var(--line);display:block;margin-top:auto}.alx-bar i{display:block;height:100%;background:var(--gold)}.alx-phase small{font-size:9px;color:var(--muted)}.alx-grid2,.alx-grid3{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}.alx-grid3{grid-template-columns:repeat(3,minmax(0,1fr))}.alx-card{border:1px solid var(--line);background:var(--surface);padding:18px;min-width:0}.alx-card h3{font:500 1.35rem var(--font-d);margin:5px 0 8px}.alx-note{border-left:2px solid var(--gold);background:var(--surface);padding:12px 14px;margin:17px 0;color:var(--muted);font-size:11px;line-height:1.7}.alx-note b{color:var(--gold)}.alx-stack{display:grid;gap:11px}.alx-phase-row{display:grid;grid-template-columns:40px minmax(0,1fr) 150px;gap:14px;align-items:start}.alx-muted{color:var(--muted);font-size:11px}.alx-tags{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}.alx-tags span{font-size:9px;border:1px solid var(--line);padding:4px 7px;color:var(--muted)}.alx-status{display:inline-block;border:1px solid var(--line);padding:4px 7px;border-radius:20px;font-size:9px;color:var(--muted)}.alx-status.done{color:#7ed6ac;border-color:#7ed6ac55}.alx-status.current{color:var(--gold);border-color:#d6b45d55}.alx-meeting{display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:12px;align-items:start}.alx-meetingnum{font:600 25px var(--font-d);color:var(--gold)}.alx-meeting h3{margin:0}.alx-meeting p{margin:4px 0}.alx-formgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.alx-formgrid label,.alx-card label{display:grid;gap:6px;color:var(--muted);font-size:11px;margin-bottom:12px}.alx-formgrid .wide{grid-column:1/-1}.alx-formgrid input,.alx-formgrid textarea,.alx-formgrid select,.alx-card textarea,.alx-card input,.alx-card select{width:100%;padding:10px;border:1px solid var(--line);background:var(--bg);color:var(--text);border-radius:4px}.alx-formgrid textarea,.alx-card textarea{min-height:85px;resize:vertical}.alx-asset{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;padding:13px 0;border-top:1px solid var(--line)}.alx-asset b{font-size:12px}.alx-asset p{margin:4px 0}.alx-assets{margin-top:14px}.alx-filters{margin-top:0}.alx-filters .tool-btn{font-size:10px}
@media(max-width:1050px){.alx-phases{grid-template-columns:repeat(2,minmax(0,1fr))}.alx-grid3{grid-template-columns:1fr 1fr}.alx-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.alx-hero{grid-template-columns:1fr}.alx-ring{width:110px;height:110px}.alx-stats{gap:7px}.alx-phases,.alx-grid2,.alx-grid3,.alx-formgrid{grid-template-columns:1fr}.alx-phase-row{grid-template-columns:32px minmax(0,1fr)}.alx-phase-row>div:last-child{grid-column:2}.alx-meeting{grid-template-columns:32px minmax(0,1fr)}.alx-meeting>button{grid-column:2;justify-self:start}.alx-formgrid .wide{grid-column:auto}.alx-section{align-items:start;flex-direction:column}}
`;document.head.appendChild(s);}
export async function renderArquiteturaLegado(){
 state=load();injectCss();hydrateCloud();
 const views={dashboard,jornada:journey,encontros:meetings,projeto:project,executivo:executive,gestao:management};
 const tabs=[{id:"dashboard",t:"Visão geral"},{id:"jornada",t:"Minha jornada"},{id:"encontros",t:"24 encontros"},{id:"projeto",t:"Meu projeto"},{id:"executivo",t:"Produção executiva"}];
 if(isMentorSession()) tabs.push({id:"gestao",t:"Gestão do mentor"});
 const content=await (views[tab]||dashboard)();
 return '<div class="view active alx-view"><div class="alx-tabs">'+tabs.map(x=>'<button class="tool-btn" data-al-tab="'+x.id+'">'+x.t+'</button>').join("")+'</div>'+content+'</div>';
}
export function bindArquiteturaLegado(){const root=document.getElementById("content");if(!root)return;root.querySelectorAll("[data-al-tab]").forEach(b=>b.addEventListener("click",()=>{tab=b.dataset.alTab;phaseFilter=0;navigate("arquitetura-legado")}));root.querySelectorAll("[data-al-phase]").forEach(b=>b.addEventListener("click",()=>{phaseFilter=Number(b.dataset.alPhase);tab="encontros";navigate("arquitetura-legado")}));root.querySelectorAll("[data-al-filter]").forEach(b=>b.addEventListener("click",()=>{phaseFilter=Number(b.dataset.alFilter);navigate("arquitetura-legado")}));root.querySelectorAll("[data-al-meeting]").forEach(b=>b.addEventListener("click",()=>{const id=b.dataset.alMeeting;state.meetings[id]=!state.meetings[id];save();navigate("arquitetura-legado")}));root.querySelectorAll("[data-al-save-exec]").forEach(b=>b.addEventListener("click",()=>{state.execNotes[b.dataset.alSaveExec]=root.querySelector('[data-al-exec="'+b.dataset.alSaveExec+'"]').value;save();navigate("arquitetura-legado")}));root.querySelectorAll("[data-al-remove]").forEach(b=>b.addEventListener("click",()=>{state.assets.splice(Number(b.dataset.alRemove),1);save();navigate("arquitetura-legado")}));const pf=root.querySelector("#alProjectForm");if(pf)pf.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(pf);Object.keys(state.project).forEach(k=>state.project[k]=d.get(k)||"");save();tab="dashboard";navigate("arquitetura-legado")} );const af=root.querySelector("#alAssetForm");if(af)af.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(af);state.assets.push(Object.fromEntries(d.entries()));save();navigate("arquitetura-legado")});}
