/**
 * Call nativa AF
 * WebRTC mesh via salas_live (rules ja existentes)
 * Dock persistente + PIP ao navegar
 */
import { session, isMentorSession } from "./auth.js";
import { Store } from "./storage.js";
import {
  getMenteeNotes,
  saveMenteeNotes,
  saveMentorPrivateNotes,
  joinLiveRoom,
  leaveLiveRoom,
  listenLivePeers,
  sendLiveSignal,
  listenLiveSignalsToMe
} from "../../firebase/firestore.js";
import { openTeleprompter } from "./teleprompter.js";
import { esc } from "./navigation.js";
import { pageHead } from "./covers.js";
import {
  onPresence,
  getPresenceSnapshot,
  setInCall,
  roomOfSession,
  setSessionRoom
} from "./presence.js";
import { allowedRoomIds, roomName, canEnterRoom, accessOfSession } from "./plans.js";
import { LIVEKIT_TOKEN_URL, LIVEKIT_WS_URL } from "../../firebase/firebase-config.js";
import { Room, RoomEvent, Track, VideoPresets } from "https://esm.sh/livekit-client@2.15.4";

const ICE = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "turn:openrelay.metered.ca:80", username: "openrelayproject", credential: "openrelayproject" },
    { urls: "turn:openrelay.metered.ca:443", username: "openrelayproject", credential: "openrelayproject" },
    { urls: "turns:openrelay.metered.ca:443", username: "openrelayproject", credential: "openrelayproject" }
  ]
};

let localStream = null;
let micOn = true;
let camOn = true;
let sharing = false;
let unsubPres = null;
let unsubPeers = null;
let unsubSignals = null;
let inCall = false;
const peers = new Map();
let lkRoom = null;
let usingLivekit = false;

function toast(msg, err = false) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast show" + (err ? " err" : "");
  clearTimeout(window._tt);
  window._tt = setTimeout(() => (el.className = "toast"), 2800);
}

function openModal(title, body, foot) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalBody").innerHTML = body;
  document.getElementById("modalFoot").innerHTML = foot || "";
  document.getElementById("overlay")?.classList.add("open");
  document.getElementById("modalBox")?.classList.add("open");
}

function statusLabel(st) {
  if (st === "incall") return "Na call";
  if (st === "online") return "Online";
  return "Offline";
}

function renderPeople(list) {
  const box = document.getElementById("callPeople");
  const count = document.getElementById("callOnlineCount");
  const inCallN = document.getElementById("callInCallCount");
  if (!box) return;
  const room = roomOfSession();
  const here = list.filter((p) => !p.roomId || p.roomId === room);
  const online = here.filter((p) => p.online);
  const incall = here.filter((p) => p.status === "incall");
  if (count) count.textContent = String(online.length);
  if (inCallN) inCallN.textContent = String(incall.length);
  box.innerHTML = here
    .map((p) => {
      const dot = p.status === "incall" ? "incall" : p.online ? "on" : "off";
      const role = p.role === "mentor" ? " · MENTOR" : "";
      const photo = p.photo
        ? `<img src="${esc(p.photo)}" alt="">`
        : `<span>${esc((p.name || "?").charAt(0))}</span>`;
      return `<div class="pres-row">
        <div class="pres-av">${photo}<i class="${dot}"></i></div>
        <div class="pres-meta">
          <strong>${esc(p.name || "Participante")}${role}</strong>
          <em>${statusLabel(p.status)}</em>
        </div>
      </div>`;
    })
    .join("") || `<p class="empty">Ninguem visivel ainda.</p>`;
}

function pipVideoEl() {
  const remotes = [...document.querySelectorAll("#callStage .v-tile:not(.self) video")];
  const live = remotes.find((v) => v.srcObject);
  if (live) return live;
  return document.getElementById("localVideo");
}

export async function enterSystemPip() {
  if (!inCall) return;
  const v = pipVideoEl();
  if (!v || !v.srcObject) return;
  try {
    if (document.pictureInPictureElement) return;
    if (document.pictureInPictureEnabled && typeof v.requestPictureInPicture === "function") {
      await v.requestPictureInPicture();
    }
  } catch (e) {
    console.warn("pip", e);
  }
}

export async function leaveSystemPip() {
  try {
    if (document.pictureInPictureElement) await document.exitPictureInPicture();
  } catch (e) {}
}

export function isCallActive() {
  return inCall;
}

function liveRoomName() {
  return String(roomOfSession() || "mentoria-principal").replace(/[^a-zA-Z0-9_\-.]/g, "-").slice(0, 80);
}

async function mintLivekitToken() {
  if (!LIVEKIT_TOKEN_URL) throw new Error("sem worker");
  const res = await fetch(LIVEKIT_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      identity: session.uid,
      room: liveRoomName(),
      name: session.name || "Participante",
      mentor: isMentorSession()
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) throw new Error(data.error || "token");
  return { token: data.token, url: data.url || LIVEKIT_WS_URL };
}

function bindLivekitEvents(room) {
  room.on(RoomEvent.TrackSubscribed, (track, _pub, participant) => {
    if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
      const el = attachRemote(participant.identity, null, participant.name || participant.identity);
      track.attach(el);
    }
  });
  room.on(RoomEvent.TrackUnsubscribed, (track, _pub, participant) => {
    track.detach();
    const tile = document.getElementById("tile-" + participant.identity);
    if (tile && !participant.videoTrackPublications.size) tile.querySelector("video")?.removeAttribute("src");
  });
  room.on(RoomEvent.ParticipantDisconnected, (p) => {
    document.getElementById("tile-" + p.identity)?.remove();
    layoutGrid();
  });
  room.on(RoomEvent.Reconnecting, () => toast("Reconectando a call..."));
  room.on(RoomEvent.Reconnected, () => toast("Call reconectada"));
  room.on(RoomEvent.Disconnected, () => {
    if (inCall && usingLivekit) toast("Sinal da call caiu. Entre de novo.", true);
  });
  room.on(RoomEvent.LocalTrackPublished, () => attachLocalFromLivekit());
}

function attachLocalFromLivekit() {
  ensureLocalTile();
  const v = document.getElementById("localVideo");
  const cam = lkRoom?.localParticipant?.getTrackPublication(Track.Source.Camera);
  if (v && cam?.track) {
    cam.track.attach(v);
    v.muted = true;
    const ph = document.getElementById("localPh");
    if (ph) ph.style.display = "none";
  }
}

function attachRemote(uid, stream, label) {
  const st = stage();
  if (!st) return document.createElement("video");
  const id = "tile-" + uid;
  let tile = document.getElementById(id);
  if (!tile) {
    tile = document.createElement("article");
    tile.id = id;
    tile.className = "v-tile";
    tile.innerHTML = `<span class="v-label">${esc(label || uid)}</span>`;
    st.appendChild(tile);
  }
  let v = tile.querySelector("video");
  if (!v) {
    v = document.createElement("video");
    v.autoplay = true;
    v.playsInline = true;
    tile.appendChild(v);
  }
  if (stream && v.srcObject !== stream) v.srcObject = stream;
  v.muted = false;
  v.play?.().catch(() => {});
  layoutGrid();
  return v;
}

async function connectLivekit() {
  const minted = await mintLivekitToken();
  if (lkRoom) {
    try { await lkRoom.disconnect(); } catch (e) {}
  }
  lkRoom = new Room({
    adaptiveStream: true,
    dynacast: true,
    disconnectOnPageLeave: false,
    publishDefaults: {
      simulcast: true,
      videoEncoding: { maxBitrate: 900000, maxFramerate: 24 },
      screenShareEncoding: { maxBitrate: 1200000, maxFramerate: 15 },
      dtx: true,
      red: true
    },
    videoCaptureDefaults: {
      resolution: VideoPresets.h720.resolution,
      facingMode: "user"
    },
    audioCaptureDefaults: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  });
  bindLivekitEvents(lkRoom);
  await lkRoom.connect(minted.url || LIVEKIT_WS_URL, minted.token, { autoSubscribe: true });
  await lkRoom.localParticipant.setMicrophoneEnabled(micOn);
  await lkRoom.localParticipant.setCameraEnabled(camOn);
  usingLivekit = true;
  attachLocalFromLivekit();
  lkRoom.remoteParticipants.forEach((p) => {
    p.trackPublications.forEach((pub) => {
      if (pub.track) {
        const el = attachRemote(p.identity, null, p.name || p.identity);
        pub.track.attach(el);
      }
    });
  });
}

async function disconnectLivekit() {
  if (!lkRoom) return;
  try { await lkRoom.disconnect(); } catch (e) {}
  lkRoom = null;
  usingLivekit = false;
}

function dock() {
  return document.getElementById("callDock");
}

function stage() {
  return document.getElementById("callStage");
}

function ensureLocalTile() {
  const st = stage();
  if (!st || document.getElementById("tileSelf")) return;
  const art = document.createElement("article");
  art.className = "v-tile self";
  art.id = "tileSelf";
  art.innerHTML = `<div class="v-ph" id="localPh">Voce</div>
    <video id="localVideo" autoplay playsinline muted></video>
    <span class="v-label">${esc(session.name || "Voce")}</span>`;
  st.prepend(art);
}

function attachLocal() {
  ensureLocalTile();
  const v = document.getElementById("localVideo");
  if (v && localStream) {
    if (v.srcObject !== localStream) v.srcObject = localStream;
    v.play?.().catch(() => {});
    const ph = document.getElementById("localPh");
    if (ph) ph.style.display = "none";
  }
}

function layoutGrid() {
  const st = stage();
  if (!st) return;
  const n = st.querySelectorAll(".v-tile").length;
  st.className = "call-stage " + (n <= 1 ? "g1" : n === 2 ? "g2" : n <= 4 ? "g4" : "g6");
}

export function onCallNavigate(onCallPage) {
  const el = dock();
  if (!el) return;
  if (!inCall) {
    el.classList.add("hidden");
    el.classList.remove("pip", "expanded", "pip-min");
    return;
  }
  el.classList.remove("hidden");
  const host = document.getElementById("callStageHost");
  if (onCallPage && host) {
    el.classList.remove("pip");
    el.classList.add("expanded");
    if (el.parentElement !== host) host.appendChild(el);
  } else {
    el.classList.remove("expanded");
    el.classList.add("pip");
    if (el.parentElement !== document.body) document.body.appendChild(el);
  }
  attachLocal();
  document.getElementById("callDockTitle") && (document.getElementById("callDockTitle").textContent = "Call · ao vivo");
}

export function renderCallView() {
  const mentor = isMentorSession();
  const room = roomOfSession();
  const rooms = allowedRoomIds(accessOfSession(), mentor);
  const opts = rooms.map((id) => {
    const label = roomName(id);
    return `<option value="${esc(id)}" ${id === room ? "selected" : ""}>${esc(label)}</option>`;
  }).join("");
  return `<div class="view active">
    ${pageHead("call", "Sala ao vivo", "Call da mentoria", "Servidor LiveKit. Salvador com Japão, 6 pessoas, em movimento. Sair da página não encerra. O vídeo flutua.")}
    <div class="call-shell">
      <aside class="call-roster">
        <p class="call-kicker">${esc(roomName(room))}</p>
        <h3>Presenca</h3>
        <p class="notes-meta"><span id="callOnlineCount">0</span> online · <span id="callInCallCount">0</span> na call</p>
        <label class="notes-hint" for="callRoomSelect">Sala</label>
        <select id="callRoomSelect">${opts}</select>
        ${mentor ? `<div class="field" style="margin-top:8px"><label>Nova sala / turma</label>
          <input id="callNewRoom" placeholder="turma-setembro">
          <button class="tool-btn" type="button" id="btnAddRoom">Usar esta sala</button></div>` : ""}
        <div id="callPeople" class="pres-list"></div>
      </aside>
      <section class="call-main">
        <div id="callStageHost" class="call-stage-host"></div>
        <div class="call-bar">
          <button class="ctrl primary" type="button" id="btnJoinCall">Entrar na call</button>
          <button class="ctrl" type="button" id="btnMic">Mic</button>
          <button class="ctrl" type="button" id="btnCam">Cam</button>
          <button class="ctrl" type="button" id="btnShare">Tela</button>
          ${mentor ? `<button class="ctrl tool" type="button" id="btnRoteiro">Roteiro</button>
             <button class="ctrl tool" type="button" id="btnMentorNotes">Notas</button>`
            : `<button class="ctrl tool" type="button" id="btnNotes">Notas</button>`}
          <button class="ctrl leave" type="button" id="btnLeaveCall">Sair</button>
        </div>
        <p class="call-hint" id="callHint">${inCall ? "Call ativa. Você pode navegar — o vídeo fica flutuando." : "Escolha a sala e entre. Camera e microfone ligam aqui."}</p>
      </section>
    </div>
  </div>`;
}

export function bindCallControls(navigate) {
  if (unsubPres) unsubPres();
  unsubPres = onPresence(renderPeople);
  document.getElementById("btnJoinCall")?.addEventListener("click", joinCall);
  document.getElementById("btnMic")?.addEventListener("click", toggleMic);
  document.getElementById("btnCam")?.addEventListener("click", toggleCam);
  document.getElementById("btnShare")?.addEventListener("click", toggleShare);
  document.getElementById("btnLeaveCall")?.addEventListener("click", async () => {
    await leaveCall();
    if (navigate) navigate("dashboard");
  });
  document.getElementById("btnRoteiro")?.addEventListener("click", () => openTeleprompter());
  document.getElementById("btnNotes")?.addEventListener("click", openMenteeNotes);
  document.getElementById("btnMentorNotes")?.addEventListener("click", openMentorPrivateNotes);
  document.getElementById("callRoomSelect")?.addEventListener("change", async (e) => {
    await switchRoom(e.target.value);
  });
  document.getElementById("btnAddRoom")?.addEventListener("click", async () => {
    const raw = (document.getElementById("callNewRoom")?.value || "").trim().toLowerCase().replace(/\s+/g, "-");
    if (!raw) return toast("Escreva o id da sala.", true);
    await switchRoom(raw);
    const sel = document.getElementById("callRoomSelect");
    if (sel && ![...sel.options].some((o) => o.value === raw)) {
      sel.appendChild(new Option(raw, raw, true, true));
    }
  });
  onCallNavigate(true);
  bindDockButtons(navigate);
}

function bindDockButtons(navigate) {
  const expand = document.getElementById("callDockExpand");
  if (expand) {
    expand.onclick = () => {
      const el = dock();
      if (el?.classList.contains("pip-min")) el.classList.remove("pip-min");
      if (navigate) navigate("call");
    };
  }
  const leave = document.getElementById("callDockLeave");
  if (leave) leave.onclick = () => leaveCall();
  const mic = document.getElementById("callDockMic");
  if (mic) mic.onclick = () => toggleMic();
  const min = document.getElementById("callDockMin");
  if (min) {
    min.onclick = () => {
      dock()?.classList.toggle("pip-min");
    };
  }
  const size = document.getElementById("callDockSize");
  if (size) {
    size.onclick = () => {
      const el = dock();
      if (!el) return;
      if (el.classList.contains("pip-l")) {
        el.classList.remove("pip-l");
        el.classList.add("pip-s");
      } else if (el.classList.contains("pip-s")) {
        el.classList.remove("pip-s");
      } else {
        el.classList.add("pip-l");
      }
    };
  }
  const pipBtn = document.getElementById("callDockPip");
  if (pipBtn) pipBtn.onclick = () => enterSystemPip();
}

async function switchRoom(id) {
  const next = String(id || "").trim() || "mentoria-principal";
  if (!isMentorSession() && !canEnterRoom(next, accessOfSession(), false)) {
    toast("Esta sala não está no seu plano.", true);
    const sel = document.getElementById("callRoomSelect");
    if (sel) sel.value = roomOfSession();
    return;
  }
  const prev = roomOfSession();
  if (prev === next) return;
  if (inCall && session.mode === "firebase") {
    try { await leaveLiveRoom(prev, session.uid); } catch (e) {}
    if (usingLivekit) {
      await disconnectLivekit();
    } else {
      if (unsubPeers) { unsubPeers(); unsubPeers = null; }
      if (unsubSignals) { unsubSignals(); unsubSignals = null; }
      for (const [uid, state] of peers) {
        try { state.pc.close(); } catch (e) {}
      }
      peers.clear();
    }
    document.querySelectorAll("#callStage .v-tile:not(#tileSelf)").forEach((el) => el.remove());
  }
  setSessionRoom(next);
  const kick = document.querySelector(".call-kicker");
  if (kick) kick.textContent = roomName(next);
  if (inCall && session.mode === "firebase") {
    try {
      await joinLiveRoom(next, session.uid, {
        name: session.name || "Participante",
        role: session.role || "mentee"
      });
      try {
        await connectLivekit();
      } catch (lk) {
        console.warn("livekit room", lk);
        unsubPeers = listenLivePeers(next, onPeers);
        unsubSignals = listenLiveSignalsToMe(next, session.uid, onSignal);
      }
    } catch (e) {
      toast("Sala trocada. Sinal: " + (e.message || e), true);
    }
  }
  await setInCall(inCall);
  toast("Sala: " + roomName(next));
}

export async function joinCall() {
  if (inCall && (localStream || usingLivekit)) {
    toast("Voce ja esta na call");
    onCallNavigate(!!document.getElementById("callStageHost"));
    return;
  }
  inCall = true;
  const el = dock();
  el?.classList.remove("hidden");
  ensureLocalTile();
  onCallNavigate(!!document.getElementById("callStageHost"));
  await setInCall(true);

  const room = roomOfSession();
  if (session.mode === "firebase") {
    try {
      await joinLiveRoom(room, session.uid, {
        name: session.name || "Participante",
        role: session.role || "mentee"
      });
    } catch (e) {
      console.warn(e);
    }
    try {
      await connectLivekit();
      toast("Call no servidor. Pode estar em movimento.");
      return;
    } catch (lk) {
      console.warn("livekit", lk);
      toast("Servidor de mídia ainda não publicado. Usando conexão direta.", true);
    }
  }

  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 720 } },
      audio: { echoCancellation: true, noiseSuppression: true }
    });
  } catch (e) {
    inCall = false;
    await setInCall(false);
    return toast("Autorize camera e microfone.", true);
  }
  attachLocal();
  if (session.mode === "firebase") {
    try {
      if (unsubPeers) unsubPeers();
      unsubPeers = listenLivePeers(room, onPeers);
      if (unsubSignals) unsubSignals();
      unsubSignals = listenLiveSignalsToMe(room, session.uid, onSignal);
    } catch (e) {
      console.warn(e);
      toast("Presenca ok. Sinal falhou: " + (e.message || e), true);
    }
  }
  toast("Voce entrou na sala");
}

function onPeers(list) {
  if (!inCall || !localStream) return;
  const others = list.filter((p) => p.id && p.id !== session.uid);
  const live = new Set(others.map((p) => p.id));
  for (const [uid] of peers) {
    if (!live.has(uid)) closePeer(uid);
  }
  others.forEach((p) => ensurePeer(p.id, p.name));
}

async function ensurePeer(remoteUid, label) {
  if (!remoteUid || remoteUid === session.uid || !localStream) return;
  if (peers.has(remoteUid)) return peers.get(remoteUid);

  const pc = new RTCPeerConnection(ICE);
  const state = {
    pc,
    polite: session.uid > remoteUid,
    makingOffer: false,
    ignoreOffer: false,
    label: label || remoteUid
  };
  peers.set(remoteUid, state);

  localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

  pc.onicecandidate = (e) => {
    if (!e.candidate) return;
    sendLiveSignal(roomOfSession(), {
      de: session.uid,
      para: remoteUid,
      type: "ice",
      candidate: e.candidate.toJSON()
    }).catch(() => {});
  };

  pc.ontrack = (e) => {
    const stream = e.streams[0] || new MediaStream([e.track]);
    attachRemote(remoteUid, stream, state.label);
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === "failed") {
      try { pc.restartIce(); } catch (e) {}
    }
    if (pc.connectionState === "disconnected" || pc.connectionState === "closed") {
      // keep tile; ice restart may recover
    }
  };

  pc.onnegotiationneeded = async () => {
    try {
      state.makingOffer = true;
      await pc.setLocalDescription(await pc.createOffer());
      await sendLiveSignal(roomOfSession(), {
        de: session.uid,
        para: remoteUid,
        type: "offer",
        sdp: { type: pc.localDescription.type, sdp: pc.localDescription.sdp }
      });
    } catch (e) {
      console.warn("offer", e);
    } finally {
      state.makingOffer = false;
    }
  };

  return state;
}

async function onSignal(sig) {
  if (!sig || sig.de === session.uid) return;
  const state = await ensurePeer(sig.de);
  if (!state) return;
  const pc = state.pc;
  try {
    if (sig.type === "offer" && sig.sdp) {
      const offerCollision = state.makingOffer || pc.signalingState !== "stable";
      state.ignoreOffer = !state.polite && offerCollision;
      if (state.ignoreOffer) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sig.sdp));
      await pc.setLocalDescription(await pc.createAnswer());
      await sendLiveSignal(roomOfSession(), {
        de: session.uid,
        para: sig.de,
        type: "answer",
        sdp: { type: pc.localDescription.type, sdp: pc.localDescription.sdp }
      });
    } else if (sig.type === "answer" && sig.sdp) {
      if (pc.signalingState === "have-local-offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(sig.sdp));
      }
    } else if (sig.type === "ice" && sig.candidate) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(sig.candidate));
      } catch (e) {}
    } else if (sig.type === "bye") {
      closePeer(sig.de);
    }
  } catch (e) {
    console.warn("signal", e);
  }
}

function closePeer(uid) {
  const state = peers.get(uid);
  if (state) {
    try { state.pc.close(); } catch (e) {}
    peers.delete(uid);
  }
  document.getElementById("tile-" + uid)?.remove();
  layoutGrid();
}

export async function leaveCall() {
  inCall = false;
  await leaveSystemPip();
  const room = roomOfSession();
  if (unsubPeers) { unsubPeers(); unsubPeers = null; }
  if (unsubSignals) { unsubSignals(); unsubSignals = null; }
  await disconnectLivekit();
  for (const [uid, state] of peers) {
    try {
      await sendLiveSignal(room, { de: session.uid, para: uid, type: "bye" });
    } catch (e) {}
    try { state.pc.close(); } catch (e) {}
  }
  peers.clear();
  if (session.mode === "firebase") {
    try { await leaveLiveRoom(room, session.uid); } catch (e) {}
  }
  await setInCall(false);
  stopMedia();
  const st = stage();
  if (st) {
    st.querySelectorAll(".v-tile:not(#tileSelf)").forEach((el) => el.remove());
  }
  const el = dock();
  el?.classList.add("hidden");
  el?.classList.remove("pip", "expanded");
  layoutGrid();
}

export function stopMedia() {
  if (inCall) return;
  if (localStream) localStream.getTracks().forEach((t) => t.stop());
  localStream = null;
  sharing = false;
  const v = document.getElementById("localVideo");
  if (v) v.srcObject = null;
}

export function forceStopMedia() {
  inCall = false;
  disconnectLivekit();
  if (localStream) localStream.getTracks().forEach((t) => t.stop());
  localStream = null;
  sharing = false;
}

export async function toggleMic() {
  micOn = !micOn;
  if (usingLivekit && lkRoom) {
    try { await lkRoom.localParticipant.setMicrophoneEnabled(micOn); } catch (e) {}
  } else if (localStream) {
    localStream.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }
  document.getElementById("btnMic")?.classList.toggle("off", !micOn);
  document.getElementById("callDockMic")?.classList.toggle("off", !micOn);
}

export async function toggleCam() {
  camOn = !camOn;
  if (usingLivekit && lkRoom) {
    try { await lkRoom.localParticipant.setCameraEnabled(camOn); } catch (e) {}
  } else if (localStream) {
    localStream.getVideoTracks().forEach((t) => (t.enabled = camOn));
  }
  document.getElementById("btnCam")?.classList.toggle("off", !camOn);
}

async function toggleShare() {
  try {
    if (usingLivekit && lkRoom) {
      sharing = !sharing;
      await lkRoom.localParticipant.setScreenShareEnabled(sharing);
      toast(sharing ? "Compartilhando tela" : "Tela encerrada");
      return;
    }
    if (sharing) {
      sharing = false;
      toast("Tela encerrada");
      return;
    }
    const ds = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    sharing = true;
    const screenTrack = ds.getVideoTracks()[0];
    for (const [, state] of peers) {
      const sender = state.pc.getSenders().find((s) => s.track && s.track.kind === "video");
      if (sender) sender.replaceTrack(screenTrack);
    }
    screenTrack.onended = () => {
      sharing = false;
      const cam = localStream?.getVideoTracks()[0];
      if (cam) {
        for (const [, state] of peers) {
          const sender = state.pc.getSenders().find((s) => s.track && s.track.kind === "video");
          if (sender) sender.replaceTrack(cam);
        }
      }
    };
    toast("Compartilhando tela");
  } catch (e) {
    sharing = false;
    toast("Tela nao autorizada", true);
  }
}

async function openMenteeNotes() {
  let text = "";
  if (session.mode === "firebase") {
    try {
      const n = await getMenteeNotes(session.uid, "default");
      if (n) text = n.content || "";
    } catch (e) {}
  }
  if (!text) text = Store.getNotes(session.uid)?.text || "";
  openModal(
    "Notas da call",
    `<textarea class="notes-area" id="notesArea">${esc(text)}</textarea>`,
    `<button class="btn btn-inline" type="button" id="btnSaveNotes">Salvar</button>`
  );
  document.getElementById("btnSaveNotes").onclick = async () => {
    const val = document.getElementById("notesArea").value;
    Store.saveNotes(session.uid, val);
    if (session.mode === "firebase") {
      try { await saveMenteeNotes(session.uid, "default", val); } catch (e) {}
    }
    toast("Notas salvas");
  };
}

async function openMentorPrivateNotes() {
  openModal(
    "Notas privadas do mentor",
    `<p class="notes-hint">Nao visiveis ao mentorando.</p><textarea class="notes-area" id="mNotes"></textarea>`,
    `<button class="btn btn-inline" type="button" id="btnSaveMN">Salvar</button>`
  );
  document.getElementById("btnSaveMN").onclick = async () => {
    const content = document.getElementById("mNotes").value;
    Store.saveMentorNote("current", content);
    if (session.mode === "firebase") {
      try { await saveMentorPrivateNotes("current", "default", content); } catch (e) {}
    }
    toast("Notas privadas salvas");
  };
}

export function disposeCallView() {
  if (unsubPres) unsubPres();
  unsubPres = null;
}

export function bindPersistentCallUI(navigate) {
  bindDockButtons(navigate);
  let ox = 0, oy = 0, dragging = false;
  const el = dock();
  if (!el) return;
  const bar = document.getElementById("callDockBar");
  bar?.addEventListener("pointerdown", (e) => {
    if (!el.classList.contains("pip")) return;
    dragging = true;
    ox = e.clientX - el.getBoundingClientRect().left;
    oy = e.clientY - el.getBoundingClientRect().top;
    bar.setPointerCapture(e.pointerId);
  });
  bar?.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    el.style.left = Math.max(8, e.clientX - ox) + "px";
    el.style.top = Math.max(8, e.clientY - oy) + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";
  });
  bar?.addEventListener("pointerup", () => { dragging = false; });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && inCall) enterSystemPip();
  });
}
