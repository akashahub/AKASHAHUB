/* Akasha Sales OS · cadastro único entre Sala, Teleprompt e Gerador. */
(function(){
 const ACTIVE="akasha-sales-active-session-v2", PREFIX="akasha-sales-record-v2:";
 const legacy="akasha-sales-session-v1";
 const id=()=>("AS-"+(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9))).toUpperCase();
 let sessionId=localStorage.getItem(ACTIVE);
 if(!sessionId){sessionId=id();localStorage.setItem(ACTIVE,sessionId)}
 const fields={
  client:["clientName","client"],contact:["contactName","contact"],segment:["businessArea","segment"],
  contactChannel:["contactChannel","salesContactChannel"],email:["email"],declaredNeed:["declaredNeed"],
  openingReason:["openingReason"],desiredClarification:["desiredClarification"],requestedSolution:["requestedSolution"],
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
  try{const old=JSON.parse(localStorage.getItem(legacy)||"null");if(old){state.selectedProblems=Array.isArray(old.selectedProblems)?old.selectedProblems:[];state.selectedCapabilities=Array.isArray(old.selectedCapabilities)?old.selectedCapabilities:[];Object.assign(state.fields,{client:old.client||"",contact:old.contact||"",segment:old.segment||"",scenario:old.scenario||"",bottleneck:old.bottleneck||"",goal:old.goal||""})}}catch(e){}
 }
 function status(msg){document.querySelectorAll("[data-akasha-sync-status]").forEach(el=>el.textContent=msg)}
 function listSessions(){
  const rows=[];for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!key||!key.startsWith(PREFIX))continue;try{const x=JSON.parse(localStorage.getItem(key)||"{}");rows.push({id:x.sessionId||key.slice(PREFIX.length),client:x.fields?.client||"Cadastro sem nome",updatedAt:x.updatedAt||""})}catch(e){}}
  return rows.sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
 }
 function renderSessionList(){
  const rows=listSessions();document.querySelectorAll("[data-akasha-saved-sessions]").forEach(el=>{const current=el.value;el.innerHTML='<option value="">Abrir cadastro salvo…</option>'+rows.map(x=>'<option value="'+x.id.replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'">'+String(x.client).replace(/&/g,"&amp;").replace(/</g,"&lt;")+' · '+(x.updatedAt?new Date(x.updatedAt).toLocaleString("pt-BR"):"sem data")+'</option>').join("");if(rows.some(x=>x.id===current))el.value=current});
 }
 function paint(){
  Object.entries(fields).forEach(([key,ids])=>{
   if(!Object.prototype.hasOwnProperty.call(state.fields,key))return;
   ids.forEach(fieldId=>{const el=document.getElementById(fieldId);if(!el||document.activeElement===el)return;
    const v=state.fields[key];if(el.type==="checkbox")el.checked=!!v;else if(v!==undefined&&v!==null)el.value=String(v);
   });
  });
  document.querySelectorAll("[data-akasha-session-id]").forEach(el=>el.textContent=sessionId);renderSessionList();
  window.dispatchEvent(new CustomEvent("akasha-sales-sync:remote",{detail:structuredClone(state)}));
 }
 function persist(broadcast=true){
  state.version=2;state.sessionId=sessionId;state.updatedAt=new Date().toISOString();
  try{localStorage.setItem(PREFIX+sessionId,JSON.stringify(state));localStorage.setItem(ACTIVE,sessionId);
   const old={version:1,sessionId,updatedAt:Date.now(),client:state.fields.client||"",contact:state.fields.contact||"",segment:state.fields.segment||"",scenario:state.fields.scenario||state.fields.declaredNeed||"",bottleneck:state.fields.bottleneck||"",goal:state.fields.goal||"",selectedProblems:state.selectedProblems||[],selectedCapabilities:state.selectedCapabilities||[]};
   localStorage.setItem(legacy,JSON.stringify(old));
   if(broadcast&&channel)channel.postMessage({type:"state",sessionId,state});
   renderSessionList();status("Salvo automaticamente · "+new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}));
  }catch(e){status("Não foi possível salvar neste navegador.")}
 }
 function publish(patch){
  if(patch&&typeof patch==="object"){
   if(patch.fields)Object.assign(state.fields,patch.fields);
   ["selectedProblems","selectedCapabilities"].forEach(k=>{if(Array.isArray(patch[k]))state[k]=patch[k]});
   Object.entries(fields).forEach(([key,ids])=>{for(const fieldId of ids){const el=document.getElementById(fieldId);if(el&&document.activeElement===el){state.fields[key]=el.type==="checkbox"?el.checked:el.value;break}}});
  }
  persist(true);
 }
 function capture(el){
  for(const [key,ids] of Object.entries(fields)){if(ids.includes(el.id)){state.fields[key]=el.type==="checkbox"?el.checked:el.value;break}}
  persist(true);
 }
 document.addEventListener("input",e=>{if(e.target&&e.target.id&&Object.values(fields).some(ids=>ids.includes(e.target.id)))capture(e.target)});
 document.addEventListener("change",e=>{if(e.target&&e.target.id&&Object.values(fields).some(ids=>ids.includes(e.target.id)))capture(e.target)});
 window.addEventListener("storage",e=>{
  if(e.key===ACTIVE&&e.newValue&&e.newValue!==sessionId){sessionId=e.newValue;state={version:2,sessionId,fields:{},selectedProblems:[],selectedCapabilities:[],...read()};paint();return}
  if(e.key===PREFIX+sessionId&&e.newValue){try{state=JSON.parse(e.newValue);paint();status("Sincronizado entre as janelas")}catch(err){}}
  if(e.key===legacy&&e.newValue){try{const old=JSON.parse(e.newValue);if(old.sessionId&&old.sessionId!==sessionId)return;
   state.selectedProblems=Array.isArray(old.selectedProblems)?old.selectedProblems:state.selectedProblems;
   state.selectedCapabilities=Array.isArray(old.selectedCapabilities)?old.selectedCapabilities:state.selectedCapabilities;
   Object.assign(state.fields,{client:old.client,contact:old.contact,segment:old.segment,scenario:old.scenario,bottleneck:old.bottleneck,goal:old.goal});
   state.updatedAt=new Date().toISOString();try{localStorage.setItem(PREFIX+sessionId,JSON.stringify(state))}catch(err){}paint();
  }catch(err){}}
 });
 let channel=null;try{channel=new BroadcastChannel("akasha-sales-os-v2");channel.onmessage=e=>{if(e.data?.type==="state"&&e.data.sessionId===sessionId){state=e.data.state;try{localStorage.setItem(PREFIX+sessionId,JSON.stringify(state))}catch(err){}paint();status("Sincronizado em tempo real")}}}catch(e){}
 document.addEventListener("change",e=>{if(e.target.matches("[data-akasha-saved-sessions]")&&e.target.value){sessionId=e.target.value;localStorage.setItem(ACTIVE,sessionId);state={version:2,sessionId,fields:{},selectedProblems:[],selectedCapabilities:[],updatedAt:null,...read()};state.fields=state.fields||{};paint();status("Cadastro aberto · "+sessionId)}});
 window.AkashaSalesSync={
  getState:()=>structuredClone(state),publish,listSessions,openSession(next){if(!next)return;sessionId=next;localStorage.setItem(ACTIVE,sessionId);state={version:2,sessionId,fields:{},selectedProblems:[],selectedCapabilities:[],updatedAt:null,...read()};state.fields=state.fields||{};paint();status("Cadastro aberto · "+sessionId)},
  setSession(next){sessionId=next||id();localStorage.setItem(ACTIVE,sessionId);state={version:2,sessionId,fields:{},selectedProblems:[],selectedCapabilities:[],updatedAt:null,...read()};state.fields=state.fields||{};paint();persist(true)},
  newSession(){this.setSession(id())}
 };
 paint();
 status("Cadastro ativo · salvamento automático");
})();