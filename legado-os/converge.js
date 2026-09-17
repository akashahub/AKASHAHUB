const EVENT={id:"converge-01",name:"Convergencia 01",city:"Florianopolis",hint:"Campeche / Rio Tavares / Morro das Pedras"};
const CEO_EMAILS=["yanfili.simon@gmail.com","plmacramo@gmail.com","sendatantrica@gmail.com","opatricksimon@gmail.com"];
const CEO_UIDS=["1GO7dRdFUFg2NwYwzOwjvtWfpAS2"];
const LS="converge.mini.v2";
const WORKER="https://akasha.yanfili-simon.workers.dev";
const LK_URL="wss://akashahub-vlya29kl.livekit.cloud";
firebase.initializeApp({apiKey:"AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4",authDomain:"hub-akasha.firebaseapp.com",projectId:"hub-akasha",storageBucket:"hub-akasha.firebasestorage.app",messagingSenderId:"370851875474",appId:"1:370851875474:web:29b1ba3a76b0fed7d9344b"});
const auth=firebase.auth();
const db=firebase.firestore();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
function load(){try{return JSON.parse(localStorage.getItem(LS))||{users:{},access:{},tx:[],posts:[],cons:[],logs:[]};}catch(e){return{users:{},access:{},tx:[],posts:[],cons:[],logs:[]};}}
function save(){localStorage.setItem(LS,JSON.stringify(C));}
var C=load();
var me=null,route="boot",cloud="checking";
function isCeo(u){return u&&(CEO_UIDS.indexOf(u.uid)>=0||CEO_EMAILS.indexOf((u.email||"").toLowerCase())>=0);}
function toast(t){var e=document.createElement("div");e.className="toast";e.textContent=t;document.body.appendChild(e);setTimeout(function(){e.remove();},2200);}
function go(r){route=r;render();}
function iso(){return new Date().toISOString();}
function esc(s){return String(s||"").split("&").join("&").split("<").join("<").split(">").join(">");}
function nav(){var items=[["home","Ingresso"],["play","Missoes"],["live","Vivo"],["people","Gente"],["me","Eu"]];return '<nav class="nav">'+items.map(function(it){return '<button class="'+(route===it[0]?"on":"")+'" onclick="go(\''+it[0]+'\')">'+it[1]+'</button>';}).join("")+"</nav>";}
function shell(html){return '<div class="wrap"><div class="row"><div class="brand">Convergencia</div><div class="m">Mini 01</div></div>'+html+nav()+"</div>";}
function persistUser(u){C.users[u.uid]=Object.assign(C.users[u.uid]||{},u);save();}
function persistAccess(uid,a){C.access[uid]=Object.assign(C.access[uid]||{},a,{uid:uid});save();}
function acc(uid){return C.access[uid]||null;}
function mine(){return me&&C.users[me.uid];}
function entitled(){if(!me)return false;if(isCeo(me))return true;var a=acc(me.uid);return a&&a.status==="active";}
function xp(uid){return (C.tx||[]).filter(function(t){return t.userId===uid;}).reduce(function(s,t){return s+t.amount;},0);}
function has(uid,id){return (C.tx||[]).some(function(t){return t.userId===uid&&t.action===id;});}
function grant(uid,action,amount){if(has(uid,action))return false;C.tx.push({id:uid+"_"+action,userId:uid,action:action,amount:amount,at:iso()});save();return true;}
function ensure(fb){var old=C.users[fb.uid]||{};persistUser({uid:fb.uid,email:fb.email||"",name:old.name||fb.displayName||"",photo:old.photo||fb.photoURL||"",onboardingDone:!!old.onboardingDone,public:old.public||{},video:old.video||"",conexao:old.conexao||"",momento:old.momento||"",preComment:old.preComment||""});if(isCeo(fb)&&!acc(fb.uid))persistAccess(fb.uid,{status:"active",ticket:"founder"});}
auth.onAuthStateChanged(function(u){me=u?{uid:u.uid,email:u.email,displayName:u.displayName,photoURL:u.photoURL}:null;if(!me){route="login";render();return;}ensure(me);if(!entitled()){route="pending";render();return;}if(!mine().onboardingDone){route="onboard";render();return;}if(route==="boot"||route==="login"||route==="pending"||route==="onboard")route="home";render();});
async function loginGoogle(){var p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:"select_account"});try{await auth.signInWithPopup(p);}catch(e){if(e.code==="auth/popup-blocked"){await auth.signInWithRedirect(p);return;}toast(e.message||"Falha no Google");}}
function logout(){auth.signOut();}
function viewLogin(){return '<div class="gate"><div class="k">'+EVENT.name+' · Mini</div><h1>Um dia. Presenca. Gente.</h1><p class="q">'+EVENT.city+'. '+EVENT.hint+'.</p><p class="q">Presencial R$497 · Online live + 90 dias.</p><button class="btn" onclick="loginGoogle()">Continuar com Google</button><p class="m" style="text-align:center;margin-top:16px">O evento comeca no celular.</p></div>';}
function viewPending(){var u=mine()||{};return '<div class="gate"><div class="k">Ingresso</div><h1>Conta criada.<br>Aguardando liberacao.</h1><p class="q">'+esc(u.email)+'</p><div class="card"><div class="m">UID</div><div style="word-break:break-all;font-size:12px">'+(u.uid||"")+'</div></div><button class="btn btn2" onclick="logout()">Sair</button></div>';}
function viewOnboard(){var u=mine();return '<div class="wrap"><div class="brand">Convergencia</div><div class="k">Missao 1</div><h1>Como voce chega.</h1><label>Nome</label><input id="n" value="'+esc(u.name||"")+'"><label>O que voce faz</label><input id="d" value="'+esc((u.public||{}).does||"")+'"><label>O que busca</label><textarea id="s">'+esc((u.public||{}).seek||"")+'</textarea><button class="btn" onclick="saveOnboard()">Entrar</button></div>';}
function saveOnboard(){var u=mine();u.name=(document.getElementById("n").value||"").trim();u.public={does:document.getElementById("d").value.trim(),seek:document.getElementById("s").value.trim(),share:""};if(u.name.length<2||!u.public.does||!u.public.seek){toast("Completa o perfil");return;}u.onboardingDone=true;persistUser(u);grant(u.uid,"perfil",20);go("home");}
function viewHome(){var u=mine();var pts=xp(u.uid);return shell('<div class="k">'+EVENT.city+'</div><h1>'+esc(u.name||"")+ ', o dia comeca no app.</h1><div class="card"><div class="row"><h3>'+(pts>=100?"PLAYER TOP":"Padrao")+'</h3><span class="pill">'+pts+' / 100</span></div><div class="xp"><i style="width:'+Math.min(100,pts)+'%"></i></div></div><div class="card"><div class="m">Meu ingresso</div><div class="qr">'+btoa(u.uid+"|"+EVENT.id).slice(0,24)+'</div></div><div class="card"><h3>Grelha</h3><p class="q">10h chegada · 11h abertura · 15h live encerra · 16h piscina sem transmissao · 22h despedida</p></div>');}
function viewPlay(){var u=mine();var items=[["perfil","Perfil"],["video","Video Quem Sou"],["pre","Pre-encontro"],["conexao","Conexao"],["momento","Momento"]];var html=items.map(function(it){return '<div class="card"><div class="row"><h3>'+it[1]+'</h3><span class="pill '+(has(u.uid,it[0])?"ok":"")+'">'+(has(u.uid,it[0])?"feita":"+20")+'</span></div>'+(it[0]==="video"||it[0]==="conexao"||it[0]==="momento"?'<label>URL</label><input id="'+it[0]+'"><button class="btn" onclick="saveUrl(\''+it[0]+'\')">Enviar</button>':'')+(it[0]==="pre"?'<button class="btn" onclick="doPre()">Marcar presenca</button>':'')+'</div>';}).join("");return shell('<div class="k">Missoes</div><h1>Cem pontos ate a vespera.</h1>'+html);}
function saveUrl(key){var url=(document.getElementById(key).value||"").trim();if(url.indexOf("http")!==0){toast("Cole uma URL");return;}var u=mine();u[key]=url;persistUser(u);grant(u.uid,key,20);toast("+20");render();}
function doPre(){grant(me.uid,"pre",20);toast("+20");render();}
function viewPeople(){return shell('<div class="k">Gente</div><h1>Quem esta neste piloto.</h1><div class="card"><textarea id="post"></textarea><button class="btn" onclick="addPost()">Publicar</button></div>'+(C.posts||[]).map(function(p){return '<div class="card"><strong>'+esc(p.name)+'</strong><p class="q">'+esc(p.text)+'</p></div>';}).join(""));}
function addPost(){var t=(document.getElementById("post").value||"").trim();if(!t)return;C.posts=C.posts||[];C.posts.unshift({name:mine().name,text:t,at:iso()});save();render();}
var lkRoom=null;
function viewLive(){return shell('<div class="k">Ao vivo</div><h1>Sala do mentor</h1><p class="q">Live oficial ate 15h.</p><div class="card"><button class="btn" onclick="joinLive()">Entrar</button><button class="btn btn2" onclick="leaveLive()">Sair</button></div>');}
async function joinLive(){if(!window.LivekitClient){toast("LiveKit carregando");return;}try{var res=await fetch(WORKER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identity:me.uid,room:"converge-mentor",name:mine().name,mentor:isCeo(me)})});var data=await res.json();if(!data.token)throw new Error("token");lkRoom=new LivekitClient.Room();await lkRoom.connect(data.url||LK_URL,data.token);if(isCeo(me))await lkRoom.localParticipant.enableCameraAndMicrophone();toast("Conectado");}catch(e){toast(e.message||"Falha");}}
async function leaveLive(){try{if(lkRoom)await lkRoom.disconnect();}catch(e){}toast("Saiu");}
function viewMe(){var u=mine();return shell('<div class="k">Eu</div><h1>'+esc(u.name||"")+'</h1><p class="q">'+esc(u.email)+'</p><div class="card">'+xp(u.uid)+' pts</div>'+(isCeo(me)?'<button class="btn btn3" onclick="go(\'staff\')">Painel staff</button>':'')+'<button class="btn btn2" onclick="logout()">Sair</button>');}
function viewStaff(){if(!isCeo(me))return viewMe();var list=Object.keys(C.users).map(function(k){return C.users[k];}).map(function(u){return '<div class="card"><strong>'+esc(u.name||u.email)+'</strong><p class="m">'+esc(u.email)+'</p><button class="btn btn3" onclick="setAcc(\''+u.uid+'\')">Liberar</button></div>';}).join("");return shell('<div class="k">Staff</div><h1>Acesso</h1><div class="card"><label>Email</label><input id="gem"><button class="btn" onclick="grantEmail()">Liberar email</button></div>'+list);}
function setAcc(uid){persistAccess(uid,{status:"active",ticket:"presencial"});toast("Liberado");render();}
function grantEmail(){var email=(document.getElementById("gem").value||"").trim().toLowerCase();if(email.indexOf("@")<0){toast("Email");return;}var fake="email_"+email.replace(/[^a-z0-9]/g,"_");persistUser({uid:fake,email:email,name:email,onboardingDone:false,public:{}});persistAccess(fake,{status:"active",ticket:"presencial",email:email});toast("Pre-liberado");render();}
function render(){var el=document.getElementById("app");var map={boot:function(){return '<div class="gate"><p class="q">Abrindo...</p></div>';},login:viewLogin,pending:viewPending,onboard:viewOnboard,home:viewHome,play:viewPlay,people:viewPeople,live:viewLive,me:viewMe,staff:viewStaff};el.innerHTML=(map[route]||viewHome)();}
render();
