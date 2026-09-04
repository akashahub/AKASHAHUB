const EVENT_ID='legado-001';
const LS='legado-os.v011';
const CEO_EMAILS=['yanfili.simon@gmail.com','plmacramo@gmail.com','sendatantrica@gmail.com','opatricksimon@gmail.com'];
const CEO_UIDS=['1GO7dRdFUFg2NwYwzOwjvtWfpAS2'];
const TICKETS={
  digital:{label:'Digital',ents:['digital','chat','replay']},
  presencial:{label:'Presencial',ents:['digital','presencial','chat','stage_eligible','replay']},
  presencial_hotel:{label:'Presencial + Hotel',ents:['digital','presencial','hotel','chat','stage_eligible','replay']},
  all_inclusive:{label:'All Inclusive',ents:['digital','presencial','hotel','food','after','chat','stage_eligible','replay']},
  after_addon:{label:'After (add-on)',ents:['after']}
};
const CULTURES=['Brasileira','Africanas','Europeias','Indianas','Japonesas','Nórdicas','Povos originários','Xamânicas','Mediterrâneas','Outra'];
const POINT={identity:20,photo:15,history:25,culture:15,purpose:25,business:20,essence:40};
const MISSIONS=[
  {id:'identity',title:'Complete sua identidade',xp:20},
  {id:'history',title:'Conte de onde você vem',xp:25},
  {id:'essence',title:'Arquitetura de Essência',xp:40},
  {id:'purpose',title:'Declare seu propósito',xp:25},
  {id:'business',title:'Diga o que oferece e o que busca',xp:20},
  {id:'photo',title:'Coloque uma foto',xp:15}
];

firebase.initializeApp({
  apiKey:'AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4',
  authDomain:'hub-akasha.firebaseapp.com',
  projectId:'hub-akasha',
  storageBucket:'hub-akasha.firebasestorage.app',
  messagingSenderId:'370851875474',
  appId:'1:370851875474:web:29b1ba3a76b0fed7d9344b'
});
const auth=firebase.auth();
const db=firebase.firestore();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

function loadLS(){try{return JSON.parse(localStorage.getItem(LS))||{users:{},access:{},logs:[],tx:[]}}catch(e){return {users:{},access:{},logs:[],tx:[]}}}
function saveLS(){localStorage.setItem(LS,JSON.stringify(cache))}
let cache=loadLS();
let me=null;
let route='boot';
let cloud='checking';
let step=1;
let draft={};

function isCeo(u){
  if(!u)return false;
  const em=(u.email||'').toLowerCase();
  return CEO_UIDS.includes(u.uid)||CEO_EMAILS.includes(em);
}
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2200)}
function go(r){route=r;render()}
function first(n){return (n||'Você').split(' ')[0]}
function level(xp){return xp>=280?5:xp>=180?4:xp>=100?3:xp>=40?2:1}
function ltitle(xp){return ['','Chegada','Presença','Participação','Criação','Conexão'][level(xp)]}
function now(){return Date.now()}
function iso(){return new Date().toISOString()}

async function tryCloud(fn){
  try{await fn();cloud='ok';return true}
  catch(err){
    const code=err&&err.code;
    if(String(code).includes('permission')||String(err).includes('permission')) cloud='rules';
    else cloud='err';
    return false;
  }
}

function accessOf(uid){return cache.access[uid]||null}
function userOf(uid){return cache.users[uid]||null}
function myUser(){return me&&cache.users[me.uid]}
function xpOf(uid){return (cache.tx||[]).filter(t=>t.userId===uid).reduce((s,t)=>s+t.amount,0)}
function hasTx(uid,action){return (cache.tx||[]).some(t=>t.userId===uid&&t.action===action)}
function grantPoints(uid,action,amount,source,by){
  if(hasTx(uid,action)) return false;
  cache.tx.push({id:uid+'_'+action,userId:uid,eventId:EVENT_ID,action,amount,source,sourceId:action,at:iso(),validatedBy:by||'system'});
  if(cache.users[uid]) cache.users[uid].xp=xpOf(uid);
  saveLS();
  log('points',uid,action+': +'+amount,by);
  tryCloud(()=>db.collection('legado_points').doc(uid+'_'+action).set({userId:uid,eventId:EVENT_ID,action,amount,source,at:iso(),validatedBy:by||'system'}));
  return true;
}
function log(kind,target,detail,actor){
  cache.logs.unshift({id:now()+'_'+Math.random().toString(16).slice(2),kind,target,detail,actor:actor|| (me&&me.email)||'system',at:iso()});
  cache.logs=cache.logs.slice(0,80);
  saveLS();
  tryCloud(()=>db.collection('legado_logs').add({kind,target,detail,actor:actor|| (me&&me.email),at:iso()}));
}
function persistUser(u){
  cache.users[u.uid]=Object.assign(cache.users[u.uid]||{},u);
  saveLS();
  tryCloud(()=>db.collection('legado_users').doc(u.uid).set(u,{merge:true}));
}
function persistAccess(uid,acc){
  cache.access[uid]=Object.assign(cache.access[uid]||{},acc,{uid});
  saveLS();
  tryCloud(()=>db.collection('legado_access').doc(uid).set(cache.access[uid],{merge:true}));
}
async function pullCloud(uid){
  return tryCloud(async()=>{
    const u=await db.collection('legado_users').doc(uid).get();
    if(u.exists) cache.users[uid]=Object.assign(cache.users[uid]||{},u.data());
    const a=await db.collection('legado_access').doc(uid).get();
    if(a.exists) cache.access[uid]=Object.assign(cache.access[uid]||{},a.data());
    if(isCeo({uid,email:auth.currentUser&&auth.currentUser.email})){
      const us=await db.collection('legado_users').get();
      us.forEach(d=>{cache.users[d.id]=Object.assign(cache.users[d.id]||{},d.data())});
      const as=await db.collection('legado_access').get();
      as.forEach(d=>{cache.access[d.id]=Object.assign(cache.access[d.id]||{},d.data())});
    }
    saveLS();
  });
}
async function claimInvite(fb){
  const email=(fb.email||'').toLowerCase();
  const invite=Object.values(cache.access).find(a=>a.email&&a.email.toLowerCase()===email&&a.status==='active');
  if(invite && !accessOf(fb.uid)){
    persistAccess(fb.uid,{status:'active',ticket:invite.ticket,ents:invite.ents,grantedBy:invite.grantedBy,at:iso(),email});
  }
  await tryCloud(async()=>{
    const inv=await db.collection('legado_invites').doc(email).get();
    if(inv.exists && inv.data().status==='active'){
      persistAccess(fb.uid,{status:'active',ticket:inv.data().ticket,ents:inv.data().ents||[],grantedBy:inv.data().grantedBy,at:iso(),email});
    }
  });
}
function ensureUser(fb){
  const existing=cache.users[fb.uid];
  const base={
    uid:fb.uid,email:fb.email||'',name:existing&&existing.name||fb.displayName||'',photo:existing&&existing.photo||fb.photoURL||'',
    createdAt:existing&&existing.createdAt||iso(),lastLogin:iso(),status:existing&&existing.status||'active',
    role:isCeo(fb)?'CEO':(existing&&existing.role)||'PARTICIPANTE',eventId:EVENT_ID,ticket:existing&&existing.ticket||null,
    onboardingDone:!!(existing&&existing.onboardingDone),public:existing&&existing.public||{},private:existing&&existing.private||{},xp:existing&&existing.xp||0
  };
  persistUser(base);
  if(isCeo(fb) && !accessOf(fb.uid)){
    persistAccess(fb.uid,{status:'active',ticket:'all_inclusive',ents:TICKETS.all_inclusive.ents,grantedBy:'bootstrap',at:iso()});
  }
}
function entitled(){
  if(!me) return false;
  if(isCeo(me)) return true;
  const a=accessOf(me.uid);
  return a && a.status==='active';
}
auth.onAuthStateChanged(async(u)=>{
  me=u?{uid:u.uid,email:u.email,displayName:u.displayName,photoURL:u.photoURL}:null;
  if(!me){route='login';render();return}
  ensureUser(me);
  await pullCloud(me.uid);
  await claimInvite(me);
  ensureUser(me);
  if(!entitled()){route='pending';render();return}
  const usr=myUser();
  if(!usr.onboardingDone){route='onboard';step=nextStep();render();return}
  if(route==='boot'||route==='login'||route==='pending'||route==='onboard') route='home';
  render();
});
async function loginGoogle(){
  const provider=new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt:'select_account'});
  try{await auth.signInWithPopup(provider)}
  catch(e){
    if(e.code==='auth/popup-blocked'||e.code==='auth/cancelled-popup-request'){await auth.signInWithRedirect(provider);return}
    toast(e.message||'Falha no Google');
  }
}
function logout(){auth.signOut()}
function nextStep(){
  const u=myUser()||{}; const p=u.public||{}, pr=u.private||{};
  if(!p.called && !p.headline) return 1;
  if(!pr.origin && !pr.story) return 2;
  if(!(p.cultures||[]).length) return 3;
  if(!p.purpose) return 4;
  if(!p.offer && !p.seek) return 5;
  return 6;
}
function completeOnboarding(){
  const u=myUser(); u.onboardingDone=true; persistUser(u); go('home'); toast('Cadastro vivo. Bem-vindo.');
}
function awardStep(id){
  const u=myUser();
  if(grantPoints(u.uid,id,POINT[id],'onboarding')) toast('+'+POINT[id]+' pts');
}
function saveDraftToUser(){
  const u=myUser();
  u.name=draft.name||u.name; u.photo=draft.photo||u.photo;
  u.public=Object.assign({},u.public,{called:draft.called||u.public.called||'',age:draft.age||u.public.age||'',job:draft.job||u.public.job||'',city:draft.city||u.public.city||'',headline:draft.headline||u.public.headline||'',cultures:draft.cultures||u.public.cultures||[],purpose:draft.purpose||u.public.purpose||'',company:draft.company||u.public.company||'',offer:draft.offer||u.public.offer||'',seek:draft.seek||u.public.seek||''});
  u.private=Object.assign({},u.private,{story:draft.story||u.private.story||'',origin:draft.origin||u.private.origin||'',family:draft.family||u.private.family||'',essenceId:draft.essenceId||u.private.essenceId||'',essenceOrigin:draft.essenceOrigin||u.private.essenceOrigin||'',essenceWorld:draft.essenceWorld||u.private.essenceWorld||''});
  persistUser(u);
}
