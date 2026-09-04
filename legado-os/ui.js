function viewLogin(){
  return `<div class="gate"><div class="k">LEGADO OS · Evento Zero</div><h1>O ingresso é o login.</h1><p class="q">Comprou. Entrou com o Gmail. O evento começa agora — antes do hotel.</p><button class="btn" onclick="loginGoogle()">Continuar com Google</button><p class="m" style="text-align:center;margin-top:16px">Firebase Hub · hub-akasha · coleções legado_* · AF intocada</p></div>`;
}
function viewPending(){
  const u=myUser()||{};
  return `<div class="gate"><div class="k">Acesso</div><h1>Conta criada.<br>Aguardando liberação.</h1><p class="q">${u.email||''}</p><div class="card"><div class="m">UID</div><div style="word-break:break-all;font-size:12px">${u.uid}</div><p class="q" style="margin-top:10px">O CEO libera o ingresso neste aplicativo. Sem Firebase Console.</p></div><button class="btn btn2" onclick="logout()">Sair</button>${cloud==='rules'?`<div class="banner">Firestore ainda sem regras legado_*. Cole RULES-LEGADO-ACCESS.txt no console para o acesso valer em qualquer aparelho.</div>`:''}</div>`;
}
function viewOnboard(){
  const u=myUser()||{public:{},private:{}};
  draft=Object.assign({name:u.name,photo:u.photo,called:(u.public||{}).called,age:(u.public||{}).age,job:(u.public||{}).job,city:(u.public||{}).city,headline:(u.public||{}).headline,cultures:(u.public||{}).cultures||[],purpose:(u.public||{}).purpose,company:(u.public||{}).company,offer:(u.public||{}).offer,seek:(u.public||{}).seek,story:(u.private||{}).story,origin:(u.private||{}).origin,family:(u.private||{}).family,essenceId:(u.private||{}).essenceId,essenceOrigin:(u.private||{}).essenceOrigin,essenceWorld:(u.private||{}).essenceWorld},draft);
  const bars=[1,2,3,4,5,6].map(n=>`<i class="${n<=step?'on':''}"></i>`).join('');
  let body='';
  if(step===1) body=`<div class="k">Etapa 1 · Identidade · pública</div><h1>Como você se apresenta.</h1><div class="row" style="margin-top:14px"><div class="av">${draft.photo?`<img src="${draft.photo}">`:(draft.name||'?')[0]}</div><div class="q">Foto do Google. Pode trocar o nome.</div></div><label>Nome</label><input id="f_name" value="${esc(draft.name||'')}"><label>Como quer ser chamado</label><input id="f_called" value="${esc(draft.called||'')}"><label>Faixa etária</label><select id="f_age">${['','18–24','25–34','35–44','45–54','55+'].map(a=>`<option ${draft.age===a?'selected':''}>${a}</option>`).join('')}</select><label>Profissão</label><input id="f_job" value="${esc(draft.job||'')}"><label>Cidade</label><input id="f_city" value="${esc(draft.city||'')}"><label>Headline</label><input id="f_headline" value="${esc(draft.headline||'')}" placeholder="Ex.: Construo marcas que duram">`;
  if(step===2) body=`<div class="k">Etapa 2 · História · privada</div><h1>De onde você veio.</h1><p class="q">Não aparece no perfil público. Só você e o CEO.</p><label>Trajetória</label><textarea id="f_story">${esc(draft.story||'')}</textarea><label>Origem</label><textarea id="f_origin">${esc(draft.origin||'')}</textarea><label>Família (opcional)</label><textarea id="f_family">${esc(draft.family||'')}</textarea>`;
  if(step===3) body=`<div class="k">Etapa 3 · Afinidade cultural · pública</div><h1>Com o que você se identifica.</h1><p class="q">Afinidade declarada. Não é raça nem DNA. Várias escolhas.</p><div class="chips" id="cults">${CULTURES.map(c=>`<button type="button" class="chip ${(draft.cultures||[]).includes(c)?'on':''}" data-c="${c}">${c}</button>`).join('')}</div>`;
  if(step===4) body=`<div class="k">Etapa 4 · Propósito · pública</div><h1>O que você quer deixar no mundo.</h1><label>Considerando sua história, qual impacto deseja gerar?</label><textarea id="f_purpose">${esc(draft.purpose||'')}</textarea>`;
  if(step===5) body=`<div class="k">Etapa 5 · Business · pública</div><h1>O que você troca.</h1><label>Empresa / projeto</label><input id="f_company" value="${esc(draft.company||'')}"><label>O que você oferece</label><textarea id="f_offer">${esc(draft.offer||'')}</textarea><label>O que você procura</label><textarea id="f_seek">${esc(draft.seek||'')}</textarea>`;
  if(step===6) body=`<div class="k">Arquitetura de Essência · privada</div><h1>Três camadas.</h1><p class="q">Referência da mentoria AE. Só você e o CEO.</p><label>Identidade — o que você constrói hoje?</label><textarea id="f_eid">${esc(draft.essenceId||'')}</textarea><label>Origem — que padrão veio antes de você?</label><textarea id="f_eor">${esc(draft.essenceOrigin||'')}</textarea><label>Expressão — o que precisa estar verdadeiro em 90 dias, e para quem?</label><textarea id="f_ewo">${esc(draft.essenceWorld||'')}</textarea>`;
  return `<div class="wrap"><div class="row"><div class="brand">Legado OS</div><button class="pill" onclick="logout()">Sair</button></div><div class="steps">${bars}</div>${body}<button class="btn" onclick="advanceOnboard()">${step===6?'Concluir cadastro':'Continuar'}</button>${step>1?`<button class="btn btn2" onclick="step--;render()">Voltar</button>`:''}<p class="m">Etapa ${step} de 6 · pontos uma vez por missão</p></div>`;
}
function collectFields(){
  const g=id=>document.getElementById(id);
  if(g('f_name')) draft.name=g('f_name').value.trim();
  if(g('f_called')) draft.called=g('f_called').value.trim();
  if(g('f_age')) draft.age=g('f_age').value;
  if(g('f_job')) draft.job=g('f_job').value.trim();
  if(g('f_city')) draft.city=g('f_city').value.trim();
  if(g('f_headline')) draft.headline=g('f_headline').value.trim();
  if(g('f_story')) draft.story=g('f_story').value.trim();
  if(g('f_origin')) draft.origin=g('f_origin').value.trim();
  if(g('f_family')) draft.family=g('f_family').value.trim();
  if(g('f_purpose')) draft.purpose=g('f_purpose').value.trim();
  if(g('f_company')) draft.company=g('f_company').value.trim();
  if(g('f_offer')) draft.offer=g('f_offer').value.trim();
  if(g('f_seek')) draft.seek=g('f_seek').value.trim();
  if(g('f_eid')) draft.essenceId=g('f_eid').value.trim();
  if(g('f_eor')) draft.essenceOrigin=g('f_eor').value.trim();
  if(g('f_ewo')) draft.essenceWorld=g('f_ewo').value.trim();
}
function advanceOnboard(){
  collectFields();
  if(step===3 && !(draft.cultures||[]).length){toast('Escolha ao menos uma afinidade');return}
  saveDraftToUser();
  if(step===1){awardStep('identity'); if(myUser().photo) awardStep('photo')}
  if(step===2) awardStep('history');
  if(step===3) awardStep('culture');
  if(step===4) awardStep('purpose');
  if(step===5) awardStep('business');
  if(step===6){awardStep('essence'); completeOnboarding(); return}
  step++; render();
}
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('#cults .chip');
  if(!b) return;
  const c=b.getAttribute('data-c');
  draft.cultures=draft.cultures||[];
  if(draft.cultures.includes(c)) draft.cultures=draft.cultures.filter(x=>x!==c);
  else draft.cultures.push(c);
  render();
});
function acc(){return accessOf(me.uid)||{ticket:'digital',ents:TICKETS.digital.ents,status:'active'}}
function viewHome(){
  const u=myUser(); const xp=xpOf(u.uid); const a=acc();
  const next=MISSIONS.find(m=>!hasTx(u.uid,m.id));
  const ticket=TICKETS[a.ticket]||TICKETS.digital;
  return shell(`<div class="k">${EVENT_ID} · ${ticket.label}</div><h1>${first(u.public.called||u.name)}, você está dentro.</h1><p class="q">${u.public.headline||'Complete o perfil. Pontos viram lugar, produto, after — quando o evento definir.'}</p><div class="card"><div class="row"><div><div class="m">Nível ${level(xp)}</div><h3>${ltitle(xp)}</h3></div><span class="pill">${xp} pts</span></div><div class="xp"><i style="width:${Math.min(100,xp/2.8)}%"></i></div></div>${next?`<div class="card"><div class="m">Próxima missão</div><h2 style="margin-top:6px">${next.title}</h2><button class="btn" onclick="go('play')">Continuar</button></div>`:''}<div class="card"><h3>Ingresso</h3><p class="q">${ticket.label}</p><div class="chips" style="margin-top:8px">${(a.ents||[]).map(x=>`<span class="chip on">${x}</span>`).join('')}</div></div>${cloud==='rules'?`<div class="banner">Regras legado_* ainda não estão no Firestore. Login Google já vale. Acesso entre aparelhos precisa do bloco RULES-LEGADO-ACCESS.txt.</div>`:''}`);
}
function viewPlay(){
  const u=myUser();
  return shell(`<div class="k">Missões</div><h1>Preparação</h1>${MISSIONS.map(m=>`<div class="card"><div class="row"><h3>${m.title}</h3><span class="pill ${hasTx(u.uid,m.id)?'ok':''}">${hasTx(u.uid,m.id)?'feita':'+'+m.xp}</span></div></div>`).join('')}<button class="btn btn2" onclick="route='onboard';step=1;draft={};render()">Revisar cadastro</button>`);
}
function viewPeople(){
  const list=Object.values(cache.users).filter(u=>u.onboardingDone);
  return shell(`<div class="k">Comunidade</div><h1>Quem já se apresentou</h1>${list.length?list.map(u=>`<div class="card"><div class="person"><div class="av">${u.photo?`<img src="${u.photo}">`:(u.name||'?')[0]}</div><div><strong>${esc(u.public&&u.public.called||u.name)}</strong><div class="m">${esc((u.public&&u.public.job)||'')} · ${esc((u.public&&u.public.city)||'')}</div></div></div><p class="q">${esc((u.public&&u.public.headline)||'')}</p>${u.public&&u.public.offer?`<p class="q">Oferece: ${esc(u.public.offer)}</p>`:''}${u.public&&u.public.seek?`<p class="q">Procura: ${esc(u.public.seek)}</p>`:''}</div>`).join(''):`<div class="card"><p class="q">Ainda só você neste aparelho. Quando as rules subirem, a lista cruza dispositivos.</p></div>`}`);
}
function viewMe(){
  const u=myUser(); const xp=xpOf(u.uid); const a=acc();
  return shell(`<div class="k">Legado ID</div><div class="person"><div class="av">${u.photo?`<img src="${u.photo}">`:(u.name||'?')[0]}</div><div><h1>${esc(u.public.called||u.name)}</h1><p class="q">${esc(u.email)}</p></div></div><div class="card">Nível ${level(xp)} · ${xp} pts · ${(TICKETS[a.ticket]||{}).label||'—'}</div><div class="card"><div class="m">Público</div><p class="q">${esc(u.public.headline||'—')}</p><p class="q">${esc(u.public.purpose||'')}</p></div><div class="card"><div class="m">Privado (você + CEO)</div><p class="q">${esc(u.private.origin||u.private.story||'vazio')}</p></div>${isCeo(me)?`<button class="btn btn3" onclick="go('admin')">Painel CEO</button>`:''}<button class="btn btn2" onclick="logout()">Sair</button>`);
}
function viewAdmin(){
  if(!isCeo(me)) return viewMe();
  const users=Object.values(cache.users);
  return shell(`<div class="k">Event OS · CEO</div><h1>Gestão de acesso</h1><p class="q">Libera quem pagou. Troca ingresso. Vê progresso. Sem console Firebase.</p><div class="card"><label>E-mail de quem pagou</label><input id="grant_email" placeholder="pessoa@gmail.com"><label>Ingresso</label><select id="grant_ticket">${Object.entries(TICKETS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select><button class="btn" onclick="grantByEmail()">Liberar acesso</button></div>${users.map(u=>{const a=accessOf(u.uid)||{status:'none',ticket:'—'};return `<div class="card"><div class="row"><strong>${esc(u.name||u.email)}</strong><span class="pill ${a.status==='active'?'ok':a.status==='blocked'?'no':'wait'}">${a.status}</span></div><p class="m">${esc(u.email)} · ${xpOf(u.uid)} pts · ${(TICKETS[a.ticket]||{}).label||a.ticket}</p><p class="m" style="word-break:break-all">UID ${u.uid}</p><div class="row" style="margin-top:8px"><button class="btn btn3" style="margin:0" onclick="setAccess('${u.uid}','active')">Liberar</button><button class="btn danger" style="margin:0" onclick="setAccess('${u.uid}','blocked')">Bloquear</button></div><label>Ingresso</label><select onchange="setTicket('${u.uid}',this.value)">${Object.entries(TICKETS).map(([k,v])=>`<option value="${k}" ${a.ticket===k?'selected':''}>${v.label}</option>`).join('')}</select><label>Pontos manuais</label><div class="row"><input id="pts_${u.uid}" placeholder="50 ou -20" type="number"><button class="btn btn2" style="margin:0;width:auto" onclick="manualPts('${u.uid}')">Aplicar</button></div></div>`}).join('')}<div class="card"><h3>Audit log</h3>${(cache.logs||[]).slice(0,12).map(l=>`<p class="m">${l.at.slice(11,16)} · ${esc(l.actor)} · ${esc(l.kind)} · ${esc(l.detail)}</p>`).join('')||'<p class="m">vazio</p>'}</div>${cloud==='rules'?`<div class="banner">Para a liberação valer no celular da outra pessoa, cole RULES-LEGADO-ACCESS.txt em Firestore → Rules.</div>`:''}`);
}
function grantByEmail(){
  const email=(document.getElementById('grant_email').value||'').trim().toLowerCase();
  const ticket=document.getElementById('grant_ticket').value;
  if(!email.includes('@')){toast('E-mail inválido');return}
  const found=Object.values(cache.users).find(u=>(u.email||'').toLowerCase()===email);
  if(!found){
    const fake='email_'+email.replace(/[^a-z0-9]/g,'_');
    persistUser({uid:fake,email,name:email,photo:'',createdAt:iso(),lastLogin:'',status:'invited',role:'PARTICIPANTE',eventId:EVENT_ID,ticket,onboardingDone:false,public:{},private:{},xp:0});
    persistAccess(fake,{status:'active',ticket,ents:TICKETS[ticket].ents,grantedBy:me.email,at:iso(),email});
    tryCloud(()=>db.collection('legado_invites').doc(email).set({email,status:'active',ticket,ents:TICKETS[ticket].ents,grantedBy:me.email,at:iso()}));
    log('access',email,'pré-liberado '+ticket,me.email);
    toast('Pré-liberado. Quando essa pessoa entrar com o mesmo Gmail, o acesso entra.');
    render(); return;
  }
  setAccess(found.uid,'active',ticket);
}
function setAccess(uid,status,ticket){
  const prev=accessOf(uid)||{}; const t=ticket||prev.ticket||'digital';
  persistAccess(uid,{status,ticket:t,ents:(TICKETS[t]||TICKETS.digital).ents,grantedBy:me.email,at:iso(),email:(userOf(uid)||{}).email});
  const u=userOf(uid); if(u){u.ticket=t;persistUser(u)}
  log('access',uid,status+' / '+t,me.email);
  toast(status==='active'?'Liberado':'Bloqueado');
  render();
}
function setTicket(uid,ticket){setAccess(uid,(accessOf(uid)||{}).status||'active',ticket)}
function manualPts(uid){
  const n=Number(document.getElementById('pts_'+uid).value);
  if(!n){toast('Valor');return}
  const action='manual_'+now();
  cache.tx.push({id:uid+'_'+action,userId:uid,eventId:EVENT_ID,action,amount:n,source:'ceo',sourceId:action,at:iso(),validatedBy:me.email});
  saveLS(); log('points',uid,'ajuste '+n,me.email); toast((n>0?'+':'')+n+' pts'); render();
}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[c]))}
function nav(){
  const items=[['home','●','Home'],['play','✦','Missões'],['people','◎','Pessoas'],['me','○','Eu'],['admin','▣','CEO']];
  const show=isCeo(me)?items:items.slice(0,4);
  return `<nav class="nav" style="grid-template-columns:repeat(${show.length},1fr)">${show.map(([id,i,l])=>`<button class="${route===id?'on':''}" onclick="go('${id}')"><div>${i}</div>${l}</button>`).join('')}</nav>`;
}
function shell(html){return `<div class="wrap"><div class="row"><div class="brand">Legado OS</div><div class="m">${EVENT_ID}</div></div>${html}${nav()}</div>`}
function render(){
  const el=document.getElementById('app');
  if(route==='boot'){el.innerHTML='<div class="gate"><p class="q">Abrindo…</p></div>';return}
  if(route==='login'){el.innerHTML=viewLogin();return}
  if(route==='pending'){el.innerHTML=viewPending();return}
  if(route==='onboard'){el.innerHTML=viewOnboard();return}
  const map={home:viewHome,play:viewPlay,people:viewPeople,me:viewMe,admin:viewAdmin};
  el.innerHTML=(map[route]||viewHome)();
}
render();
