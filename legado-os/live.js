const LK_WORKER = "https://akasha.yanfili-simon.workers.dev";
const LK_FALLBACK = "wss://akashahub-vlya29kl.livekit.cloud";
const LK_ROOMS = [
  { id: "legado-oficial", title: "Live oficial", kind: "broadcast" },
  { id: "legado-business", title: "Sala Business", kind: "room" },
  { id: "legado-comunicacao", title: "Sala Comunicação", kind: "room" },
  { id: "legado-musica", title: "Sala Música", kind: "room" },
  { id: "legado-entretenimento", title: "Sala Entretenimento", kind: "room" }
];
let lkRoom = null;
let lkCurrent = null;
function canPublishLive() {
  if (!me) return false;
  if (isCeo(me)) return true;
  const a = accessOf(me.uid) || {};
  const ents = a.ents || [];
  return ents.includes("stage_eligible") || ents.includes("presencial") || a.ticket === "all_inclusive";
}
async function mintLiveToken(roomId) {
  const u = myUser() || {};
  const res = await fetch(LK_WORKER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identity: me.uid,
      room: roomId,
      name: (u.public && u.public.called) || u.name || "Participante",
      mentor: isCeo(me)
    })
  });
  const data = await res.json();
  if (!data.token) throw new Error(data.error || "token");
  return { token: data.token, url: data.url || LK_FALLBACK };
}
async function joinLive(roomId) {
  if (!window.LivekitClient) { toast("LiveKit ainda carregando"); return; }
  try {
    if (lkRoom) await leaveLive(true);
    const minted = await mintLiveToken(roomId);
    const Room = LivekitClient.Room;
    const RoomEvent = LivekitClient.RoomEvent;
    lkRoom = new Room({ adaptiveStream: true, dynacast: true });
    lkCurrent = roomId;
    lkRoom.on(RoomEvent.TrackSubscribed, (track, pub, participant) => attachLiveTrack(track, participant.identity));
    lkRoom.on(RoomEvent.TrackUnsubscribed, (track) => track.detach().forEach((el) => el.remove()));
    lkRoom.on(RoomEvent.ParticipantDisconnected, (p) => { const box = document.getElementById("lk-" + p.identity); if (box) box.remove(); });
    lkRoom.on(RoomEvent.Disconnected, () => { lkRoom = null; lkCurrent = null; if (route === "live") render(); });
    await lkRoom.connect(minted.url, minted.token);
    if (canPublishLive()) await lkRoom.localParticipant.enableCameraAndMicrophone();
    toast(canPublishLive() ? "No palco" : "Assistindo");
    render();
    restoreLiveTiles();
  } catch (err) {
    toast(err.message || "Falha na sala");
    lkRoom = null; lkCurrent = null; render();
  }
}
function attachLiveTrack(track, id, local) {
  const grid = document.getElementById("lk-grid");
  if (!grid) return;
  let box = document.getElementById("lk-" + id);
  if (!box) {
    box = document.createElement("div");
    box.id = "lk-" + id;
    box.className = "lk-tile";
    const tag = document.createElement("span");
    tag.className = "lk-tag";
    tag.textContent = local ? "você" : String(id).slice(0, 8);
    box.appendChild(tag);
    grid.appendChild(box);
  }
  const el = track.attach();
  el.playsInline = true;
  el.autoplay = true;
  el.muted = !!local;
  box.appendChild(el);
}
function restoreLiveTiles() {
  if (!lkRoom || !me) return;
  lkRoom.localParticipant.trackPublications.forEach((pub) => { if (pub.track) attachLiveTrack(pub.track, me.uid, true); });
  lkRoom.remoteParticipants.forEach((p) => { p.trackPublications.forEach((pub) => { if (pub.track) attachLiveTrack(pub.track, p.identity); }); });
}
async function leaveLive(silent) {
  try { if (lkRoom) await lkRoom.disconnect(); } catch (e) {}
  lkRoom = null; lkCurrent = null;
  if (!silent) render();
}
function nav(){
  const items=[['home','\u25cf','Home'],['play','\u2726','Miss\u00f5es'],['live','\u25ce','Live'],['people','\u25cb','Pessoas'],['me','\u25cc','Eu']];
  return `<nav class="nav" style="grid-template-columns:repeat(5,1fr)">${items.map(([id,i,l])=>`<button class="${route===id?'on':''}" onclick="go('${id}')"><div>${i}</div>${l}</button>`).join('')}</nav>`;
}
function viewLive() {
  const publishing = canPublishLive();
  const connected = !!(lkRoom && lkCurrent);
  return shell(`
    <div class="k">Salas \u00b7 LiveKit</div>
    <h1>O evento ao vivo</h1>
    <p class="q">${publishing ? "Seu ingresso permite c\u00e2mera e microfone." : "Seu plano assiste. Palco s\u00f3 com ingresso presencial ou convite."}</p>
    ${LK_ROOMS.map((r) => `
      <div class="card"><div class="row"><div><h3>${r.title}</h3><p class="m">${r.id}${lkCurrent === r.id ? " \u00b7 conectado" : ""}</p></div>${lkCurrent === r.id ? `<button class="btn danger" style="margin:0;width:auto" onclick="leaveLive()">Sair</button>` : `<button class="btn btn3" style="margin:0;width:auto" onclick="joinLive('${r.id}')">Entrar</button>`}</div></div>`).join("")}
    <div class="card"><div class="m">${connected ? "Sala " + lkCurrent : "Nenhuma sala aberta neste aparelho"}</div><div id="lk-grid" class="lk-grid"></div></div>
    <p class="m">Token no Worker. V\u00eddeo no LiveKit Cloud. Sem Storage.</p>`);
}
function render(){
  const el=document.getElementById('app');
  if(route==='boot'){el.innerHTML='<div class="gate"><p class="q">Abrindo\u2026</p></div>';return}
  if(route==='login'){el.innerHTML=viewLogin();return}
  if(route==='pending'){el.innerHTML=viewPending();return}
  if(route==='onboard'){el.innerHTML=viewOnboard();return}
  const map={home:viewHome,play:viewPlay,people:viewPeople,me:viewMe,admin:viewAdmin,live:viewLive};
  el.innerHTML=(map[route]||viewHome)();
  if(route==='live') restoreLiveTiles();
}
