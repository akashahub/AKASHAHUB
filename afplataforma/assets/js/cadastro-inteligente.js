/* Cadastro Inteligente · Perfil central e Dossiê progressivo do participante. */
import { session, isMentorSession } from "./auth.js";
import { db } from "../../firebase/firebase-config.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COLLECTION = "users";
const ROOT_FIELD = "afDossier";
let dossier = emptyDossier();
let activeBusinessId = null;
let welcomeShown = false;

const PERSONAL_FIELDS = [
  ["fullName","Nome completo"],["preferredName","Como prefere ser chamado"],
  ["phone","Telefone / WhatsApp"],["city","Cidade"],["country","País"],
  ["languages","Idiomas"],["education","Formação e estudos",true],
  ["trajectory","Trajetória pessoal e profissional",true],
  ["competencies","Competências e experiências",true],
  ["goals","Objetivos pessoais e profissionais",true]
];

const BUSINESS_GROUPS = [
  {id:"identity",title:"2 · Identidade da empresa",fields:[
    ["name","Nome do negócio"],["legalName","Razão social"],["taxId","CNPJ / registro (opcional)"],
    ["website","Site"],["country","País"],["city","Cidade"],["sector","Setor de atuação"],
    ["businessModel","Modelo de negócio"],["stage","Estágio atual"],
    ["description","O que a empresa faz",true]
  ]},
  {id:"brand",title:"3 · Posicionamento e marca",fields:[
    ["positioning","Como deseja ser percebida",true],["valueProposition","Proposta de valor",true],
    ["audience","Público e cliente ideal",true],["differentiators","Diferenciais",true],
    ["channels","Canais de comunicação"]
  ]},
  {id:"operations",title:"4 · Operação e equipe",fields:[
    ["teamSize","Tamanho da equipe"],["roles","Pessoas e responsabilidades",true],
    ["processes","Processos principais",true],["systems","Sistemas e ferramentas"]
  ]},
  {id:"finance",title:"5 · Estrutura financeira",private:true,fields:[
    ["revenueBand","Faixa de receita mensal"],["costsBand","Faixa de custos mensais"],
    ["cashflowStatus","Situação do fluxo de caixa"],["debtStatus","Dívidas e compromissos (opcional)",true],
    ["capitalBand","Capital disponível (opcional)"],["financialGoals","Metas financeiras",true]
  ]},
  {id:"digital",title:"6 · Império digital",fields:[
    ["website","Site / domínio"],["socialProfiles","Redes e perfis"],["crm","CRM / atendimento"],
    ["channels","Canais digitais"],["tools","Plataformas e ferramentas",true]
  ]},
  {id:"commercial",title:"7 · Produtos e comercial",fields:[
    ["productsServices","Produtos e serviços",true],["pricing","Preços e formatos de oferta",true],
    ["averageTicket","Ticket médio (se conhecido)"],["salesCycle","Como acontece a venda",true],
    ["salesChannels","Canais de venda"]
  ]},
  {id:"expansion",title:"8 · Expansão e oportunidades",fields:[
    ["targetMarkets","Mercados que deseja alcançar"],["opportunities","Oportunidades identificadas",true],
    ["partnerships","Parcerias desejadas",true],["constraints","Limites e obstáculos",true]
  ]},
  {id:"legacy",title:"9 · Patrimônio e legado",fields:[
    ["assets","Ativos relevantes (opcional)",true],["governance","Governança e responsabilidades",true],
    ["succession","Continuidade e sucessão (opcional)",true],["longTermGoals","Visão de longo prazo",true]
  ]}
];

function emptyDossier() {
  return {
    schemaVersion:1,
    onboarding:{status:"not_started",currentStep:"personal"},
    personal:{},
    businesses:[],
    projects:[],
    sharing:{enabled:false,profileName:false,city:false,companyName:false,sector:false,website:false,offer:false}
  };
}

function newId(prefix) {
  const raw = globalThis.crypto?.randomUUID?.() || (Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9));
  return prefix+"-"+raw;
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

function normalizeDossier(value) {
  const base=emptyDossier(), src=value&&typeof value==="object"?value:{};
  return {
    ...base,...src,schemaVersion:1,
    onboarding:{...base.onboarding,...(src.onboarding||{})},
    personal:{...base.personal,...(src.personal||{})},
    businesses:Array.isArray(src.businesses)?src.businesses:[],
    projects:Array.isArray(src.projects)?src.projects:[],
    sharing:{...base.sharing,...(src.sharing||{})}
  };
}

function activeBusiness() {
  return dossier.businesses.find(x=>x.id===activeBusinessId&&!x.archivedAt) || null;
}

function field(label, scope, key, value="", multiline=false, group="", hint="") {
  const attrs='data-scope="'+scope+'" data-key="'+key+'"'+(group?' data-group="'+group+'"':'')+(scope==="project"&&hint?' data-id="'+hint+'"':'');
  const control=multiline
    ? '<textarea '+attrs+' rows="3" maxlength="1500" placeholder="Preencha se já souber...">'+esc(value)+'</textarea>'
    : '<input '+attrs+' type="text" maxlength="250" value="'+esc(value)+'" placeholder="Preencha se já souber...">';
  return '<label class="ci-field"><span>'+esc(label)+'</span>'+control+(hint&&scope!=="project"?'<small>'+esc(hint)+'</small>':'')+'</label>';
}

function renderFields(fields, values, scope, group="") {
  return fields.map(([key,label,multiline])=>field(label,scope,key,values?.[key]||"",!!multiline,group)).join("");
}

function businessMarkup() {
  const biz=activeBusiness();
  const available=dossier.businesses.filter(x=>!x.archivedAt);
  const selector=available.length
    ? '<select id="ciBusinessSelect">'+available.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===activeBusinessId?'selected':'')+'>'+esc(x.name||"Negócio sem nome")+'</option>').join("")+'</select>'
    : '<p class="ci-empty">Ainda não há negócios cadastrados. Você pode começar pelo botão “Adicionar negócio”.</p>';
  if(!biz) return '<section class="ci-panel"><div class="ci-panel-head"><div><span class="ci-kicker">DOSSIÊ EMPRESARIAL</span><h3>Seus negócios</h3></div><button type="button" class="ci-btn" data-action="add-business">＋ Adicionar negócio</button></div>'+selector+'</section>';
  let html='<section class="ci-panel"><div class="ci-panel-head"><div><span class="ci-kicker">DOSSIÊ EMPRESARIAL</span><h3>Negócios e empresas</h3><p>Cadastre mais de um negócio. As informações de cada empresa ficam separadas.</p></div><button type="button" class="ci-btn" data-action="add-business">＋ Adicionar negócio</button></div><div class="ci-business-switch">'+selector+'<button type="button" class="ci-btn ci-btn-muted" data-action="archive-business">Arquivar este negócio</button></div>';
  for(const group of BUSINESS_GROUPS){
    const values=group.id==="identity"?biz:biz[group.id]||{};
    html+='<details class="ci-section" '+(group.id==="identity"?'open':'')+'><summary>'+esc(group.title)+(group.private?'<em>Privado</em>':'')+'</summary><div class="ci-fields">'+renderFields(group.fields,values,"business",group.id)+'</div>'+(group.private?'<p class="ci-private-note">Informações financeiras são opcionais e permanecem privadas, visíveis somente conforme as permissões da plataforma.</p>':'')+'</details>';
  }
  html+='</section>';
  return html;
}

function projectsMarkup() {
  const projects=dossier.projects.filter(x=>!x.archivedAt);
  const allBusinesses=dossier.businesses;
  return '<section class="ci-panel"><div class="ci-panel-head"><div><span class="ci-kicker">CONTEXTO DE PROJETO</span><h3>Projetos vinculados</h3><p>Um projeto pode pertencer a um negócio ou ficar independente. Cada projeto terá sua própria Ficha Única.</p></div><button type="button" class="ci-btn" data-action="add-project">＋ Adicionar projeto</button></div>'+
    (projects.length?projects.map(p=>{
      const options=allBusinesses.map(x=>'<option value="'+esc(x.id)+'" '+(p.businessId===x.id?'selected':'')+'>'+esc(x.name||"Negócio sem nome")+(x.archivedAt?' · Arquivado':'')+'</option>').join("");
      return '<article class="ci-project"><div class="ci-project-head"><strong>'+esc(p.name||"Projeto sem nome")+'</strong><button type="button" class="ci-text-btn" data-action="archive-project" data-id="'+esc(p.id)+'">Arquivar</button></div><div class="ci-fields">'+
        field("Nome do projeto","project","name",p.name||"",false,"",p.id)+
        '<label class="ci-field"><span>Negócio relacionado</span><select data-scope="project" data-key="businessId" data-id="'+esc(p.id)+'"><option value="" '+(!p.businessId?'selected':'')+'>Independente</option>'+options+'</select></label>'+
        field("Tipo / área","project","type",p.type||"",false,"",p.id)+
        field("Objetivo principal","project","objective",p.objective||"",true,"",p.id)+
        '<label class="ci-field"><span>Fase da Arquitetura de Legado</span><select data-scope="project" data-key="phase" data-id="'+esc(p.id)+'"><option value="">A definir</option>'+["AE","ID","AF","EX","LG"].map(v=>'<option value="'+v+'" '+(p.phase===v?'selected':'')+'>'+v+'</option>').join("")+'</select></label>'+
        '<label class="ci-field"><span>Status</span><select data-scope="project" data-key="status" data-id="'+esc(p.id)+'">'+["Em diagnóstico","Planejado","Em andamento","Pausado","Concluído"].map(v=>'<option value="'+v+'" '+((p.status||"Em diagnóstico")===v?'selected':'')+'>'+v+'</option>').join("")+'</select></label>'+
        field("Prazo desejado","project","deadline",p.deadline||"",false,"",p.id)+
        field("Notas e contexto específico","project","notes",p.notes||"",true,"",p.id)+
        '</div></article>';
    }).join(""):'<p class="ci-empty">Nenhum projeto cadastrado. Você pode criar projetos depois.</p>')+'</section>';
}

function sharingMarkup() {
  const s=dossier.sharing||{};
  const checks=[["profileName","Nome de exibição"],["city","Cidade"],["companyName","Nome do negócio"],["sector","Setor"],["website","Site"],["offer","Oferta / serviço"]];
  return '<section class="ci-panel"><div class="ci-panel-head"><div><span class="ci-kicker">PRIVACIDADE E REDE</span><h3>O que você autoriza compartilhar?</h3><p>Por padrão, tudo fica privado. Marcar opções registra sua preferência, mas não publica dados nem ativa uma rede nesta etapa.</p></div></div><label class="ci-toggle"><input type="checkbox" data-scope="sharing" data-key="enabled" '+(s.enabled?'checked':'')+'><span>Autorizo considerar dados selecionados para uma futura rede do Akasha Hub.</span></label><div class="ci-share-grid">'+checks.map(([key,label])=>'<label><input type="checkbox" data-scope="sharing" data-key="'+key+'" '+(s[key]?'checked':'')+'><span>'+label+'</span></label>').join("")+'</div><p class="ci-private-note">Nenhum campo será divulgado automaticamente. O compartilhamento efetivo exigirá uma etapa de confirmação e controles próprios.</p></section>';
}

function progressMarkup() {
  const groups=[dossier.personal,...dossier.businesses.filter(x=>!x.archivedAt)];
  const filled=groups.reduce((n,x)=>n+(Object.values(x||{}).some(v=>typeof v==="string"&&v.trim())?1:0),0);
  return '<div class="ci-progress"><div><strong>'+filled+'</strong><span> áreas com informações iniciadas</span></div><span>Preenchimento livre · sem campos obrigatórios</span></div>';
}

function renderForm() {
  const p=dossier.personal||{};
  return '<div class="ci-shell"><div class="ci-hero"><span class="ci-kicker">AKASHA HUB · PERFIL 360°</span><h2>Cadastro Inteligente</h2><p>Organize suas informações pessoais, seus negócios e seus projetos em um único lugar. Você pode preencher aos poucos e voltar quando quiser.</p><div class="ci-meta"><span>Conta: '+esc(session.email||"")+'</span><span>Seus dados começam privados</span></div></div>'+
    progressMarkup()+
    '<section class="ci-panel"><div class="ci-panel-head"><div><span class="ci-kicker">PERFIL PESSOAL</span><h3>1 · Identidade do empreendedor</h3><p>Comece por você. Não precisa preencher tudo agora.</p></div></div><div class="ci-fields">'+renderFields(PERSONAL_FIELDS,p,"personal")+'</div></section>'+
    businessMarkup()+projectsMarkup()+sharingMarkup()+
    '<div class="ci-actions"><span id="ciStatus" role="status">As alterações só serão gravadas quando você salvar.</span><div><button type="button" class="ci-btn ci-btn-muted" data-action="save-draft">Salvar rascunho</button><button type="button" class="ci-btn ci-btn-primary" data-action="complete">Concluir esta etapa</button></div></div>'+
    '<p class="ci-footnote">Você poderá editar o cadastro depois. Concluir esta etapa não bloqueia alterações futuras nem libera automaticamente o acesso a produtos ou ferramentas.</p></div>';
}

function styles() {
  return '<style id="ciStyles">.ci-shell{max-width:1080px;margin:0 auto;padding:10px 0 40px;color:var(--text,#f5f1e8)}.ci-hero{padding:24px;border:1px solid rgba(205,174,94,.24);border-radius:16px;background:linear-gradient(135deg,rgba(205,174,94,.08),rgba(100,70,130,.06));margin-bottom:16px}.ci-kicker{display:block;font-size:10px;letter-spacing:2px;color:var(--gold,#cdae5e);text-transform:uppercase}.ci-hero h2{font-size:30px;margin:8px 0}.ci-hero p,.ci-panel-head p{color:var(--muted,#aaa);line-height:1.6;margin:6px 0 0}.ci-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.ci-meta span,.ci-progress{font-size:12px;padding:8px 11px;border:1px solid rgba(205,174,94,.16);border-radius:9px}.ci-progress{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px;color:var(--muted,#aaa)}.ci-progress strong{color:var(--gold,#cdae5e);font-size:17px}.ci-panel{padding:20px;margin:14px 0;border:1px solid var(--line,rgba(255,255,255,.12));border-radius:14px;background:var(--surface,rgba(255,255,255,.025))}.ci-panel-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:14px}.ci-panel-head h3{margin:6px 0;font-size:19px}.ci-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.ci-field{display:flex;flex-direction:column;gap:6px;font-size:13px;color:var(--muted,#bbb)}.ci-field input,.ci-field textarea,.ci-field select,.ci-business-switch select{width:100%;padding:11px 12px;border:1px solid var(--line,rgba(255,255,255,.16));border-radius:9px;background:var(--bg,#111);color:var(--text,#f5f1e8);font:inherit;min-width:0}.ci-field textarea{min-height:82px;resize:vertical}.ci-field small{font-size:11px;opacity:.7}.ci-section{border-top:1px solid var(--line,rgba(255,255,255,.1));padding:13px 0}.ci-section summary{cursor:pointer;font-weight:600;padding:4px 0}.ci-section summary em{font-size:10px;font-style:normal;color:var(--gold,#cdae5e);margin-left:8px}.ci-section .ci-fields{padding-top:14px}.ci-business-switch{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:12px 0}.ci-business-switch select{max-width:360px}.ci-btn{padding:10px 14px;border:1px solid rgba(205,174,94,.4);border-radius:9px;background:transparent;color:var(--text,#f5f1e8);cursor:pointer;font:inherit}.ci-btn-primary{background:rgba(205,174,94,.16);color:var(--gold,#e4c879)}.ci-btn-muted{border-color:var(--line,rgba(255,255,255,.16));color:var(--muted,#bbb)}.ci-text-btn{border:0;background:none;color:var(--gold,#cdae5e);cursor:pointer}.ci-private-note,.ci-footnote{font-size:12px;line-height:1.6;color:var(--muted,#aaa)}.ci-project{padding:14px;margin:12px 0;border:1px solid var(--line,rgba(255,255,255,.12));border-radius:10px}.ci-project-head{display:flex;justify-content:space-between;gap:12px;margin-bottom:12px}.ci-empty{padding:12px;color:var(--muted,#aaa);border:1px dashed var(--line,rgba(255,255,255,.15));border-radius:10px}.ci-toggle,.ci-share-grid label{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--muted,#bbb)}.ci-share-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}.ci-actions{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:14px 0}.ci-actions>div{display:flex;gap:8px;flex-wrap:wrap}#ciStatus{font-size:12px;color:var(--muted,#aaa)}@media(max-width:700px){.ci-fields{grid-template-columns:1fr}.ci-share-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ci-panel{padding:14px}.ci-hero{padding:18px}}</style>';
}

function collectForm(root) {
  root.querySelectorAll("[data-scope]").forEach(el=>{
    const scope=el.dataset.scope,key=el.dataset.key;
    const value=el.type==="checkbox"?el.checked:String(el.value||"").slice(0,el.tagName==="TEXTAREA"?1500:250);
    if(scope==="personal") dossier.personal[key]=value;
    if(scope==="sharing") dossier.sharing[key]=value;
    if(scope==="business"){
      const biz=activeBusiness();if(!biz)return;
      const group=el.dataset.group||"identity";
      if(group==="identity")biz[key]=value;
      else {biz[group]=biz[group]||{};biz[group][key]=value;}
    }
    if(scope==="project"){
      const item=dossier.projects.find(x=>x.id===el.dataset.id);
      if(item)item[key]=value;
    }
  });
}

async function persist(status) {
  if(!session.uid||session.mode!=="firebase") throw new Error("Entre com sua conta para sincronizar o cadastro.");
  dossier.schemaVersion=1;
  dossier.ownerUid=session.uid;
  dossier.onboarding={...(dossier.onboarding||{}),status,currentStep:"profile",updatedAt:new Date().toISOString()};
  await setDoc(doc(db,COLLECTION,session.uid),{[ROOT_FIELD]:dossier,afDossierUpdatedAt:serverTimestamp()},{merge:true});
}

export function renderCadastroInteligente() {
  return '<div class="view active" id="cadastroInteligenteRoot">'+styles()+'<p class="notes-hint">Carregando seu cadastro…</p></div>';
}

export async function bindCadastroInteligente() {
  const root=document.getElementById("cadastroInteligenteRoot");
  if(!root||root.dataset.bound==="1")return;
  root.dataset.bound="1";
  const status=root.querySelector("#ciStatus");
  try{
    if(!session.uid||session.mode!=="firebase") throw new Error("Entre com sua conta autorizada para abrir o cadastro.");
    const snap=await getDoc(doc(db,COLLECTION,session.uid));
    dossier=normalizeDossier(snap.exists()?snap.data()?.[ROOT_FIELD]:null);
    activeBusinessId=dossier.businesses.find(x=>!x.archivedAt)?.id||null;
    root.innerHTML=styles()+renderForm();
  }catch(error){
    root.innerHTML=styles()+'<div class="ci-panel"><h2>Não foi possível carregar o cadastro</h2><p class="ci-private-note">'+esc(error?.message||"Verifique sua conexão e tente novamente.")+'</p><button class="ci-btn" data-action="reload">Tentar novamente</button></div>';
  }
  root.addEventListener("change",e=>{
    if(e.target.id==="ciBusinessSelect"){
      collectForm(root);activeBusinessId=e.target.value;root.innerHTML=styles()+renderForm();
    }
  });
  root.addEventListener("click",async e=>{
    const btn=e.target.closest("[data-action]");if(!btn)return;
    const action=btn.dataset.action;
    if(action==="reload"){root.dataset.bound="";bindCadastroInteligente();return;}
    if(action==="add-business"){
      collectForm(root);
      if(dossier.businesses.filter(x=>!x.archivedAt).length>=10){const st=root.querySelector("#ciStatus");if(st)st.textContent="Limite inicial de 10 negócios ativos. Arquive um negócio antes de adicionar outro.";return;}
      const item={id:newId("biz"),name:"",identity:{},brand:{},operations:{},finance:{},digital:{},commercial:{},expansion:{},legacy:{}};
      dossier.businesses.push(item);activeBusinessId=item.id;root.innerHTML=styles()+renderForm();return;
    }
    if(action==="archive-business"){
      collectForm(root);const biz=activeBusiness();if(!biz)return;
      if(!confirm("Arquivar este negócio? Os dados e projetos vinculados serão preservados."))return;
      biz.archivedAt=new Date().toISOString();activeBusinessId=dossier.businesses.find(x=>!x.archivedAt)?.id||null;root.innerHTML=styles()+renderForm();return;
    }
    if(action==="add-project"){
      collectForm(root);
      if(dossier.projects.filter(x=>!x.archivedAt).length>=25){const st=root.querySelector("#ciStatus");if(st)st.textContent="Limite inicial de 25 projetos ativos.";return;}
      dossier.projects.push({id:newId("proj"),name:"",businessId:activeBusinessId||"",type:"",objective:"",phase:"",status:"Em diagnóstico",deadline:"",notes:""});
      root.innerHTML=styles()+renderForm();return;
    }
    if(action==="archive-project"){
      collectForm(root);const p=dossier.projects.find(x=>x.id===btn.dataset.id);if(p)p.archivedAt=new Date().toISOString();root.innerHTML=styles()+renderForm();return;
    }
    if(action==="save-draft"||action==="complete"){
      collectForm(root);btn.disabled=true;
      const label=btn.textContent;btn.textContent="Salvando…";
      const statusEl=root.querySelector("#ciStatus");if(statusEl)statusEl.textContent="Sincronizando com sua conta…";
      try{
        await persist(action==="complete"?"completed":"in_progress");
        if(statusEl)statusEl.textContent=action==="complete"?"Etapa concluída. Você poderá editar tudo depois.":"Rascunho salvo na sua conta.";
      }catch(error){if(statusEl)statusEl.textContent=error?.message||"Não foi possível salvar. Tente novamente.";}
      finally{btn.disabled=false;btn.textContent=label;}
    }
  });
}

async function updateOnboardingStatus(status) {
  if(!session.uid||session.mode!=="firebase")return;
  const ref=doc(db,COLLECTION,session.uid),snap=await getDoc(ref);
  const current=normalizeDossier(snap.exists()?snap.data()?.[ROOT_FIELD]:null);
  current.onboarding={...current.onboarding,status,updatedAt:new Date().toISOString()};
  await setDoc(ref,{[ROOT_FIELD]:current,afDossierUpdatedAt:serverTimestamp()},{merge:true});
}

export async function maybePromptCadastroInteligente(navigate) {
  if(welcomeShown||isMentorSession()||!session.uid||session.mode!=="firebase")return;
  welcomeShown=true;
  try{
    const snap=await getDoc(doc(db,COLLECTION,session.uid));
    const current=normalizeDossier(snap.exists()?snap.data()?.[ROOT_FIELD]:null);
    const status=current.onboarding.status;
    if(status==="completed"||status==="skipped")return;
    const overlay=document.createElement("div");
    overlay.id="ciWelcome";
    overlay.style.cssText="position:fixed;inset:0;z-index:9999;background:rgba(5,5,9,.78);display:grid;place-items:center;padding:20px";
    overlay.innerHTML='<section style="max-width:520px;width:100%;padding:26px;border:1px solid rgba(205,174,94,.4);border-radius:16px;background:#15121d;color:#f4efe5;box-shadow:0 20px 80px rgba(0,0,0,.45)"><span style="font-size:10px;letter-spacing:2px;color:#cdae5e">AKASHA HUB · PRIMEIRO ACESSO</span><h2 style="margin:10px 0;font:26px Georgia">Vamos organizar seu contexto.</h2><p style="line-height:1.65;color:#bdb5c4">O Cadastro Inteligente reúne seu perfil, seus negócios e seus projetos. Você pode preencher apenas o que souber, salvar e continuar depois. Nada é público por padrão.</p><div style="display:flex;gap:9px;justify-content:flex-end;flex-wrap:wrap;margin-top:20px"><button type="button" data-ci-later style="padding:10px 14px;border:1px solid #51475d;border-radius:8px;background:transparent;color:#d9d1df">Fazer depois</button><button type="button" data-ci-start style="padding:10px 14px;border:1px solid #cdae5e;border-radius:8px;background:rgba(205,174,94,.14);color:#e6ce8d">Começar cadastro</button></div><p id="ciWelcomeStatus" style="font-size:11px;color:#bdb5c4;margin-top:12px"></p></section>';
    document.body.appendChild(overlay);
    overlay.querySelector("[data-ci-start]").addEventListener("click",async()=>{
      const btn=overlay.querySelector("[data-ci-start]");btn.disabled=true;
      try{await updateOnboardingStatus("in_progress");overlay.remove();navigate("cadastro-inteligente");}
      catch(error){const el=overlay.querySelector("#ciWelcomeStatus");if(el)el.textContent="Não consegui registrar agora. Tente novamente.";btn.disabled=false;}
    });
    overlay.querySelector("[data-ci-later]").addEventListener("click",async()=>{
      const btn=overlay.querySelector("[data-ci-later]");btn.disabled=true;
      try{await updateOnboardingStatus("skipped");overlay.remove();}
      catch(error){const el=overlay.querySelector("#ciWelcomeStatus");if(el)el.textContent="Não consegui registrar sua escolha. Tente novamente.";btn.disabled=false;}
    });
  }catch(error){console.warn("[Cadastro Inteligente] Não foi possível verificar o primeiro acesso:",error?.code||error?.message||error);}
}
