/* Akasha Sales OS · cadastro único entre Sala, Teleprompt e Gerador.
   Persistência local imediata + sincronização privada no Firestore para mentores.
   O navegador continua funcionando sem login; a nuvem exige identidade de mentor. */
(function(){
 const ACTIVE="akasha-sales-active-session-v2", PREFIX="akasha-sales-record-v2:";
 const legacy="akasha-sales-session-v1";
 const COLLECTION="alCommercialSessions";
 const id=()=>( "AS-"+(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9)) ).toUpperCase();
 const clone=value=>JSON.parse(JSON.stringify(value===undefined?null:value));
 let sessionId=localStorage.getItem(ACTIVE);
 if(!sessionId){sessionId=id();localStorage.setItem(ACTIVE,sessionId)}
 const fields={
  client:["clientName","client"],contact:["contactName","contact"],segment:["businessArea","segment"],
  contactChannel:["contactChannel","salesContactChannel"],email:["email"],declaredNeed:["declaredNeed"],
  openingReason:["openingReason"],desiredClarification:["desiredClarification"],openingAgreement:["openingAgreement"],proposalFeedback:["proposalFeedback"],requestedSolution:["requestedSolution"],
  scenario:["currentScenario","scenario"],bottleneck:["painPoints","bottleneck"],impact:["impact"],
  goal:["desiredOutcome","goal"],priority:["priority"],timing:["timing"],evidence:["evidence"],
  diagnosisSummary:["diagnosisSummary"],needStatus:["needStatus"],decisionMakers:["decisionMakers"],
  solutionIdeas:["solutionIdeas"],openQuestions:["openQuestions"],diagnosisConfirmed:["diagnosisConfirmed"],
  decision:["decision"],followDate:["followDate"],nextStep:["nextStep"],nextOwner:["nextOwner"],callNotes:["callNotes"],
  deadline:["deadline"],validity:["validity"],offer:["offer"],capacityStatus:["capacity"],
  deliverables:["deliverables"],exclusions:["exclusions"],support:["support"],margin:["margin"],
  manualPrice:["manualPrice"],installments:["installments"],payment:["payment"],proposalStatus:["proposalStatus"]
 };
 const read=()=>{try{return JSON.parse(localStorage.getItem(PREFIX+sessionId)||"{}")}catch(e){return {}}};
 const stored=read();
 let state={version:2,sessionId,fields:{},selectedProblems:[],selectedCapabilities:[],updatedAt:null,...stored};
 state.fields=state.fields||{};
 if(!stored.fields){
  try{
   const old=JSON.parse(localStorage.getItem(legacy)||"null");
   if(old){
    state.selectedProblems=Array.isArray(old.selectedProblems)?old.selectedProblems:[];
    state.selectedCapabilities=Array.isArray(old.selectedCapabilities)?old.selectedCapabilities:[];
    Object.assign(state.fields,{client:old.client||"",contact:old.contact||"",segment:old.segment||"",scenario:old.scenario||"",bottleneck:old.bottleneck||"",goal:old.goal||""});
   }
  }catch(e){}
 }
 let channel=null,cloudApi=null,cloudUser=null,cloudAuthorized=false,cloudTimer=null;
 let cloudSessions=[];
 function status(msg){document.querySelectorAll("[data-akasha-sync-status]").forEach(el=>el.textContent=msg)}
 function hasMeaningfulData(snapshot){
  const s=snapshot||state, f=s.fields||{};
  return Object.values(f).some(v=>typeof v==="string"&&v.trim()) ||
   (s.selectedProblems||[]).length>0 || (s.selectedCapabilities||[]).length>0;
 }
 function localSessions(){
  const rows=[];
  for(let i=0;i<localStorage.length;i++){
   const key=localStorage.key(i);
   if(!key||!key.startsWith(PREFIX))continue;
   try{
    const x=JSON.parse(localStorage.getItem(key)||"{}");
    rows.push({id:x.sessionId||key.slice(PREFIX.length),client:x.fields?.client||"Cadastro sem nome",updatedAt:x.updatedAt||"",source:"local"});
   }catch(e){}
  }
  return rows.sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
 }
 function renderSessionList(){
  const merged=new Map();
  localSessions().forEach(row=>merged.set(row.id,row));
  cloudSessions.forEach(row=>merged.set(row.id,{...merged.get(row.id),...row,source:"cloud"}));
  const rows=[...merged.values()].sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")));
  document.querySelectorAll("[data-akasha-saved-sessions]").forEach(el=>{
   const current=el.value;
   el.innerHTML="";
   const placeholder=document.createElement("option");
   placeholder.value="";placeholder.textContent="Abrir cadastro salvo…";el.appendChild(placeholder);
   rows.forEach(row=>{
    const option=document.createElement("option");
    option.value=row.id;
    const source=row.source==="cloud"?"nuvem":"neste navegador";
    const when=row.updatedAt?new Date(row.updatedAt).toLocaleString("pt-BR"):"sem data";
    option.textContent=(row.client||"Cadastro sem nome")+" · "+when+" · "+source;
    el.appendChild(option);
   });
   if(rows.some(row=>row.id===current))el.value=current;
  });
 }
 function paint(){
  Object.entries(fields).forEach(([key,ids])=>{
   if(!Object.prototype.hasOwnProperty.call(state.fields,key))return;
   ids.forEach(fieldId=>{
    const el=document.getElementById(fieldId);
    if(!el||document.activeElement===el)return;
    const value=state.fields[key];
    if(el.type==="checkbox")el.checked=!!value;
    else if(value!==undefined&&value!==null)el.value=String(value);
   });
  });
  document.querySelectorAll("[data-akasha-session-id]").forEach(el=>el.textContent=sessionId);
  renderSessionList();
  window.dispatchEvent(new CustomEvent("akasha-sales-sync:remote",{detail:clone(state)}));
 }
 function cloudTimestamp(value){
  if(value&&typeof value.toDate==="function")return value.toDate().toISOString();
  if(typeof value==="string")return value;
  return new Date().toISOString();
 }
 async function saveCloud(targetId,snapshot){
  if(!cloudApi||!cloudAuthorized||!cloudUser||!hasMeaningfulData(snapshot))return;
  try{
   const payload={
    sessionId:targetId,
    schemaVersion:2,
    fields:snapshot.fields||{},
    selectedProblems:Array.isArray(snapshot.selectedProblems)?snapshot.selectedProblems:[],
    selectedCapabilities:Array.isArray(snapshot.selectedCapabilities)?snapshot.selectedCapabilities:[],
    clientName:snapshot.fields?.client||"Cadastro sem nome",
    contactName:snapshot.fields?.contact||"",
    segment:snapshot.fields?.segment||"",
    updatedBy:cloudUser.uid,
    updatedAt:cloudApi.serverTimestamp()
   };
   await cloudApi.setDoc(cloudApi.doc(cloudApi.db,COLLECTION,targetId),payload,{merge:true});
   const now=new Date().toISOString();
   cloudSessions=cloudSessions.filter(row=>row.id!==targetId);
   cloudSessions.unshift({id:targetId,client:payload.clientName,updatedAt:now,source:"cloud"});
   renderSessionList();
   if(targetId===sessionId)status("Salvo na nuvem · "+new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}));
  }catch(error){
   console.warn("[Akasha Sales OS] Sincronização na nuvem indisponível:",error);
   if(targetId===sessionId)status("Salvo neste navegador · falha na nuvem ("+(error.code||"verifique conexão/permissões")+")");
  }
 }
 function scheduleCloudSave(delay){
  if(cloudTimer)clearTimeout(cloudTimer);
  const target=sessionId,snapshot=clone(state);
  cloudTimer=setTimeout(()=>saveCloud(target,snapshot),typeof delay==="number"?delay:850);
 }
 async function loadCloudSessions(){
  if(!cloudApi||!cloudAuthorized)return;
  try{
   const q=cloudApi.query(cloudApi.collection(cloudApi.db,COLLECTION),cloudApi.orderBy("updatedAt","desc"),cloudApi.limit(100));
   const snap=await cloudApi.getDocs(q);
   cloudSessions=snap.docs.map(d=>{
    const data=d.data();
    return {id:d.id,client:data.clientName||data.fields?.client||"Cadastro sem nome",updatedAt:cloudTimestamp(data.updatedAt),source:"cloud"};
   });
   renderSessionList();
  }catch(error){
   console.warn("[Akasha Sales OS] Não foi possível carregar os cadastros da nuvem:",error);
   status("Cadastros locais preservados · histórico da nuvem indisponível");
  }
 }
 async function openSession(next){
  if(!next)return;
  if(cloudTimer)clearTimeout(cloudTimer);
  sessionId=next;
  localStorage.setItem(ACTIVE,sessionId);
  let loaded=false;
  if(cloudApi&&cloudAuthorized){
   try{
    const snap=await cloudApi.getDoc(cloudApi.doc(cloudApi.db,COLLECTION,next));
    if(snap.exists()){
     const data=snap.data();
     state={version:2,sessionId,fields:data.fields||{},selectedProblems:Array.isArray(data.selectedProblems)?data.selectedProblems:[],selectedCapabilities:Array.isArray(data.selectedCapabilities)?data.selectedCapabilities:[],updatedAt:cloudTimestamp(data.updatedAt)};
     localStorage.setItem(PREFIX+sessionId,JSON.stringify(state));
     loaded=true;
    }
   }catch(error){console.warn("[Akasha Sales OS] Leitura da nuvem falhou:",error)}
  }
  if(!loaded){state={version:2,sessionId,fields:{},selectedProblems:[],selectedCapabilities:[],updatedAt:null,...read()};state.fields=state.fields||{}}
  paint();
  status(loaded?"Cadastro recuperado da nuvem · "+sessionId:"Cadastro aberto neste navegador · "+sessionId);
 }
 function persist(broadcast){
  state.version=2;state.sessionId=sessionId;state.updatedAt=new Date().toISOString();
  try{
   localStorage.setItem(PREFIX+sessionId,JSON.stringify(state));
   localStorage.setItem(ACTIVE,sessionId);
   const old={version:1,sessionId,updatedAt:Date.now(),client:state.fields.client||"",contact:state.fields.contact||"",segment:state.fields.segment||"",scenario:state.fields.scenario||state.fields.declaredNeed||"",bottleneck:state.fields.bottleneck||"",goal:state.fields.goal||"",selectedProblems:state.selectedProblems||[],selectedCapabilities:state.selectedCapabilities||[]};
   localStorage.setItem(legacy,JSON.stringify(old));
   if(broadcast!==false&&channel)channel.postMessage({type:"state",sessionId,state:clone(state)});
   renderSessionList();
   status(cloudAuthorized?"Salvo neste navegador · sincronizando nuvem…":"Salvo neste navegador · login de mentor habilita a nuvem");
   scheduleCloudSave(900);
  }catch(e){status("Não foi possível salvar neste navegador. Verifique o espaço disponível.")}
 }
 function publish(patch){
  if(patch&&typeof patch==="object"){
   if(patch.fields)Object.assign(state.fields,patch.fields);
   ["selectedProblems","selectedCapabilities"].forEach(key=>{if(Array.isArray(patch[key]))state[key]=patch[key]});
   Object.entries(fields).forEach(([key,ids])=>{
    for(const fieldId of ids){
     const el=document.getElementById(fieldId);
     if(el&&document.activeElement===el){state.fields[key]=el.type==="checkbox"?el.checked:el.value;break}
    }
   });
  }
  persist(true);
 }
 function capture(el){
  for(const [key,ids] of Object.entries(fields)){
   if(ids.includes(el.id)){state.fields[key]=el.type==="checkbox"?el.checked:el.value;break}
  }
  persist(true);
 }
 document.addEventListener("input",event=>{
  const el=event.target;
  if(el&&el.id&&Object.values(fields).some(ids=>ids.includes(el.id)))capture(el);
 });
 document.addEventListener("change",event=>{
  const el=event.target;
  if(el&&el.id&&Object.values(fields).some(ids=>ids.includes(el.id)))capture(el);
 });
 window.addEventListener("storage",event=>{
  if(event.key===ACTIVE&&event.newValue&&event.newValue!==sessionId){
   sessionId=event.newValue;
   state={version:2,sessionId,fields:{},selectedProblems:[],selectedCapabilities:[],...read()};
   paint();return;
  }
  if(event.key===PREFIX+sessionId&&event.newValue){
   try{state=JSON.parse(event.newValue);paint();status("Sincronizado entre as janelas")}catch(error){}
  }
  if(event.key===legacy&&event.newValue){
   try{
    const old=JSON.parse(event.newValue);
    if(old.sessionId&&old.sessionId!==sessionId)return;
    state.selectedProblems=Array.isArray(old.selectedProblems)?old.selectedProblems:state.selectedProblems;
    state.selectedCapabilities=Array.isArray(old.selectedCapabilities)?old.selectedCapabilities:state.selectedCapabilities;
    Object.assign(state.fields,{client:old.client,contact:old.contact,segment:old.segment,scenario:old.scenario,bottleneck:old.bottleneck,goal:old.goal});
    state.updatedAt=new Date().toISOString();
    try{localStorage.setItem(PREFIX+sessionId,JSON.stringify(state))}catch(error){}
    paint();
   }catch(error){}
  }
 });
 try{
  channel=new BroadcastChannel("akasha-sales-os-v2");
  channel.onmessage=event=>{
   if(event.data?.type==="state"&&event.data.sessionId===sessionId){
    state=event.data.state;
    try{localStorage.setItem(PREFIX+sessionId,JSON.stringify(state))}catch(error){}
    paint();status("Sincronizado em tempo real entre as janelas");
   }
  };
 }catch(error){}
 document.addEventListener("change",event=>{
  if(event.target.matches("[data-akasha-saved-sessions]")&&event.target.value)openSession(event.target.value);
 });
 window.AkashaSalesSync={
  getState:()=>clone(state),
  publish,listSessions:localSessions,
  openSession,
  setSession(next){
   sessionId=next||id();localStorage.setItem(ACTIVE,sessionId);
   state={version:2,sessionId,fields:{},selectedProblems:[],selectedCapabilities:[],updatedAt:null,...read()};
   state.fields=state.fields||{};paint();persist(true);
  },
  newSession(){this.setSession(id())}
 };
 async function initializeCloud(){
  try{
   const modules=await Promise.all([
    import("/login/firebase.js"),
    import("/afplataforma/firebase/firebase-config.js"),
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js")
   ]);
   const firebase=modules[0],config=modules[1],firestore=modules[2];
   cloudApi={db:firebase.db,collection:firestore.collection,doc:firestore.doc,getDoc:firestore.getDoc,getDocs:firestore.getDocs,query:firestore.query,orderBy:firestore.orderBy,limit:firestore.limit,setDoc:firestore.setDoc,serverTimestamp:firestore.serverTimestamp};
   firebase.onAuthStateChanged(firebase.auth,async user=>{
    cloudUser=user||null;
    cloudAuthorized=!!(user&&config.isMentorIdentity(user.uid,user.email));
    if(cloudAuthorized){
     status("Mentor conectado · carregando histórico comercial…");
     await loadCloudSessions();
     if(hasMeaningfulData(state))scheduleCloudSave(250);
    }else{
     status("Salvo neste navegador · entre como mentor para sincronizar na nuvem");
    }
   });
  }catch(error){
   console.warn("[Akasha Sales OS] Firebase indisponível; modo local mantido:",error);
   status("Modo local · sincronização na nuvem indisponível");
  }
 }
 paint();
 status("Cadastro ativo · salvamento local automático");
 initializeCloud();
})();