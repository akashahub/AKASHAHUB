/**
 * Call nativa AF
 * Firebase = presença, sala, permissão
 * LiveKit = áudio/vídeo (quando LIVEKIT_TOKEN_URL existir)
 */
import { session, isMentorSession } from "./auth.js";
import { Store } from "./storage.js";
import { LIVEKIT_TOKEN_URL, LIVEKIT_WS_URL } from "../../firebase/firebase-config.js";
import {
  getMenteeNotes,
  saveMenteeNotes,
  saveMentorPrivateNotes,
  ensureAfRoom,
  listenAfRoom,
  updateAfRoom
} from "../../firebase/firestore.js";
import { openTeleprompter } from "./teleprompter.js";
import { esc } from "./navigation.js";
import { pageHead } from "./covers.js";
import {
  onPresence,
  getPresenceSnapshot,
  setInCall,
  roomOfSession
} from "./presence.js";

let localStream = null;
let micOn = true;
let camOn = true;
let sharing = false;
let liveRoom = null;
let unsubRoom = null;
let unsubPres = null;
let currentRoomMeta = { maxParticipants: 12, locked: false, ended: false, kicked: [], muted: [] };

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
  const online = list.filter((p) => p.online);
  const incall = list.filter((p) => p.status === "incall");
  if (count) count.textContent = String(online.length);
  if (inCallN) inCallN.textContent = String(incall.length);
  box.innerHTML = list
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
    .join("") || `<p class="empty">Ninguém visível ainda.</p>`;
}

export function renderCallView() {
  const mentor = isMentorSession();
  const room = roomOfSession();
  const live = !!(LIVEKIT_TOKEN_URL && LIVEKIT_WS_URL);
  return `<div class="view active">
    ${pageHead("call", "Sala ao vivo", "Call da mentoria", "Sem código. Sem Meet. Quem tem acesso entra na sala da turma.")}
    <div class="call-shell">
      <aside class="call-roster">
        <p class="call-kicker">${esc(room)}</p>
        <h3>Presença</h3>
        <p class="notes-meta"><span id="callOnlineCount">0</span> online · <span id="callInCallCount">0</span> na call</p>
        <div id="callPeople" class="pres-list"></div>
        ${mentor ? `<div class="mentor-admin">
          <button class="tool-btn" type="button" id="btnLockRoom">Travar / abrir sala</button>
          <button class="tool-btn" type="button" id="btnEndRoom">Encerrar sala</button>
        </div>` : ""}
      </aside>
      <section class="call-main">
        <div id="callGrid" class="call-grid g1">
          <article class="v-tile self" id="tileSelf">
            <div class="v-ph" id="localPh">Você</div>
            <video id="localVideo" autoplay playsinline muted></video>
            <span class="v-label">${esc(session.name || "Você")}</span>
          </article>
        </div>
        <div class="call-bar">
          <button class="ctrl primary" type="button" id="btnJoinCall">Entrar na call</button>
          <button class="ctrl" type="button" id="btnMic">Mic</button>
          <button class="ctrl" type="button" id="btnCam">Câm</button>
          <button class="ctrl" type="button" id="btnShare">Tela</button>
          ${mentor ? `<button class="ctrl tool" type="button" id="btnRoteiro">Roteiro</button>
             <button class="ctrl tool" type="button" id="btnMentorNotes">Notas</button>`
            : `<button class="ctrl tool" type="button" id="btnNotes">Notas</button>`}
          <button class="ctrl leave" type="button" id="btnLeaveCall">Sair</button>
        </div>
        <p class="call-hint" id="callHint">${live
          ? "LiveKit configurado. Ao entrar, a sala conecta sozinha."
          : "Presença já é ao vivo. Vídeo de grupo liga quando o token LiveKit for configurado (veja CALL-LIVEKIT.txt)."}</p>
      </section>
    </div>
  </div>`;
}

export function bindCallControls(navigate) {
  unsubPres = onPresence(renderPeople);
  const room = roomOfSession();
  ensureAfRoom(room).catch(() => {});
  if (session.mode === "firebase") {
    if (unsubRoom) unsubRoom();
    unsubRoom = listenAfRoom(room, (meta) => { currentRoomMeta = meta; });
  }
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
  document.getElementById("btnLockRoom")?.addEventListener("click", async () => {
    const next = !currentRoomMeta.locked;
    await updateAfRoom(room, { locked: next, ended: false });
    toast(next ? "Sala travada" : "Sala aberta");
  });
  document.getElementById("btnEndRoom")?.addEventListener("click", async () => {
    await updateAfRoom(room, { ended: true, locked: true });
    toast("Sala encerrada");
    await leaveCall();
  });
}

async function joinCall() {
  const room = roomOfSession();
  const meta = currentRoomMeta || {};
  if (meta.ended) return toast("Sala encerrada.", true);
  if (meta.locked && !isMentorSession()) return toast("Sala fechada pelo mentor.", true);
  if ((meta.kicked || []).includes(session.uid)) return toast("Você foi removido desta sala.", true);
  const inCallNow = getPresenceSnapshot().filter((p) => p.status === "incall").length;
  const max = meta.maxParticipants || 12;
  if (inCallNow >= max && !isMentorSession()) return toast("Sala cheia (" + max + ").", true);

  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 720 } },
      audio: { echoCancellation: true, noiseSuppression: true }
    });
  } catch (e) {
    return toast("Autorize câmera e microfone.", true);
  }
  const v = document.getElementById("localVideo");
  if (v) {
    v.srcObject = localStream;
    document.getElementById("localPh") && (document.getElementById("localPh").style.display = "none");
  }
  await setInCall(true);
  toast("Você entrou na sala");

  if (LIVEKIT_TOKEN_URL && LIVEKIT_WS_URL) {
    try {
      await connectLiveKit(room);
    } catch (e) {
      console.warn(e);
      toast("Presença ok. LiveKit falhou: " + (e.message || e), true);
    }
  }
}

async function connectLiveKit(roomName) {
  const tokenRes = await fetch(LIVEKIT_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      room: roomName,
      identity: session.uid,
      name: session.name || "Participante",
      mentor: isMentorSession()
    })
  });
  if (!tokenRes.ok) throw new Error("token " + tokenRes.status);
  const { token, url } = await tokenRes.json();
  const lk = await import("https://cdn.jsdelivr.net/npm/livekit-client@2.9.1/dist/livekit-client.esm.mjs");
  liveRoom = new lk.Room({ adaptiveStream: true, dynacast: true });
  liveRoom.on(lk.RoomEvent.TrackSubscribed, (track, pub, participant) => {
    attachRemote(track, participant);
    layoutGrid();
  });
  liveRoom.on(lk.RoomEvent.ParticipantDisconnected, (p) => {
    document.getElementById("tile-" + p.identity)?.remove();
    layoutGrid();
  });
  liveRoom.on(lk.RoomEvent.ActiveSpeakersChanged, (speakers) => {
    document.querySelectorAll(".v-tile").forEach((el) => el.classList.remove("talking"));
    speakers.forEach((sp) => document.getElementById("tile-" + sp.identity)?.classList.add("talking"));
  });
  await liveRoom.connect(url || LIVEKIT_WS_URL, token);
  await liveRoom.localParticipant.publishTracks(
    localStream.getTracks().map((t) => t)
  );
}

function attachRemote(track, participant) {
  const id = "tile-" + participant.identity;
  let tile = document.getElementById(id);
  if (!tile) {
    tile = document.createElement("article");
    tile.id = id;
    tile.className = "v-tile";
    tile.innerHTML = `<span class="v-label">${esc(participant.name || participant.identity)}</span>`;
    document.getElementById("callGrid").appendChild(tile);
  }
  const el = track.attach();
  el.playsInline = true;
  el.autoplay = true;
  tile.appendChild(el);
}

function layoutGrid() {
  const grid = document.getElementById("callGrid");
  if (!grid) return;
  const n = grid.querySelectorAll(".v-tile").length;
  grid.className = "call-grid " + (n <= 1 ? "g1" : n === 2 ? "g2" : n <= 4 ? "g4" : n <= 6 ? "g6" : "g12");
}

export async function leaveCall() {
  await setInCall(false);
  if (liveRoom) {
    try { await liveRoom.disconnect(); } catch (e) {}
    liveRoom = null;
  }
  stopMedia();
}

export function stopMedia() {
  if (localStream) localStream.getTracks().forEach((t) => t.stop());
  localStream = null;
  if (sharing) sharing = false;
}

export function toggleMic() {
  if (!localStream) return;
  micOn = !micOn;
  localStream.getAudioTracks().forEach((t) => (t.enabled = micOn));
  const b = document.getElementById("btnMic");
  if (b) b.classList.toggle("off", !micOn);
}

export function toggleCam() {
  if (!localStream) return;
  camOn = !camOn;
  localStream.getVideoTracks().forEach((t) => (t.enabled = camOn));
  const b = document.getElementById("btnCam");
  if (b) b.classList.toggle("off", !camOn);
}

async function toggleShare() {
  try {
    if (sharing) {
      sharing = false;
      toast("Tela encerrada");
      return;
    }
    const ds = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    sharing = true;
    toast("Compartilhando tela");
    ds.getVideoTracks()[0].onended = () => { sharing = false; };
  } catch (e) {
    toast("Tela não autorizada", true);
  }
}

async function openMenteeNotes() {
  let text = "";
  let meta = "—";
  if (session.mode === "firebase") {
    try {
      const n = await getMenteeNotes(session.uid, "default");
      if (n) text = n.content || "";
    } catch (e) {}
  }
  if (!text) text = Store.getNotes(session.uid)?.text || "";
  openModal(
    "Notas da call",
    `<textarea class="notes-area" id="notesArea">${esc(text)}</textarea><p class="notes-meta" id="notesMeta">${esc(meta)}</p>`,
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
    `<p class="notes-hint">Não visíveis ao mentorando.</p><textarea class="notes-area" id="mNotes"></textarea>`,
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
  if (unsubRoom) unsubRoom();
  unsubPres = null;
  unsubRoom = null;
}
