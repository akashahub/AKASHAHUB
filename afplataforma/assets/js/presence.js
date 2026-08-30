/**
 * Presenca AF — online / offline / na call
 */
import { session } from "./auth.js";
import { Store } from "./storage.js";
import {
  upsertPresence,
  listenPresenceList,
  setPresenceOffline
} from "../../firebase/firestore.js";

const ONLINE_MS = 45000;
let beat = null;
let unsub = null;
let cache = [];
const listeners = new Set();
let inCallFlag = false;

function photoOf() {
  try {
    const raw = localStorage.getItem("afplataforma_v1_profile_" + (session.uid || "anon"));
    return raw ? (JSON.parse(raw).photo || "") : "";
  } catch {
    return "";
  }
}

export function roomOfSession() {
  return session.roomId || "mentoria-principal";
}

export function isFresh(p) {
  const t = p?.lastSeenMs || 0;
  return Date.now() - t < ONLINE_MS && p?.online === true;
}

function emit() {
  listeners.forEach((fn) => {
    try { fn(getPresenceSnapshot()); } catch (e) { console.warn(e); }
  });
}

export function getPresenceSnapshot() {
  const list = cache.map((p) => {
    const online = isFresh(p);
    return {
      ...p,
      online,
      status: !online ? "offline" : p.inCall ? "incall" : "online"
    };
  });
  list.sort((a, b) => {
    if (a.role === "mentor" && b.role !== "mentor") return -1;
    if (b.role === "mentor" && a.role !== "mentor") return 1;
    if (a.status === "incall" && b.status !== "incall") return -1;
    if (b.status === "incall" && a.status !== "incall") return 1;
    if (a.online && !b.online) return -1;
    if (b.online && !a.online) return 1;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
  return list;
}

export function onPresence(fn) {
  listeners.add(fn);
  fn(getPresenceSnapshot());
  return () => listeners.delete(fn);
}

export async function startPresence() {
  if (!session.uid) return;
  await beatOnce(inCallFlag);
  clearInterval(beat);
  beat = setInterval(() => beatOnce(inCallFlag), 25000);
  window.addEventListener("beforeunload", onLeave);
  if (session.mode === "firebase") {
    if (unsub) unsub();
    unsub = listenPresenceList((rows) => {
      cache = rows;
      emit();
    });
  }
}

async function beatOnce(inCall) {
  if (!session.uid) return;
  inCallFlag = !!inCall;
  const payload = {
    uid: session.uid,
    name: session.name || "Participante",
    email: session.email || "",
    photo: photoOf(),
    role: session.role || "mentee",
    roomId: roomOfSession(),
    online: true,
    inCall: !!inCall,
    lastSeenMs: Date.now()
  };
  if (session.mode !== "firebase") {
    const all = Store.get("presence_local", {});
    all[session.uid] = payload;
    Store.set("presence_local", all);
    cache = Object.values(all);
    emit();
    return;
  }
  try {
    await upsertPresence(session.uid, payload);
  } catch (e) {
    console.warn("presence", e);
  }
}

export async function setInCall(flag) {
  await beatOnce(!!flag);
}

async function onLeave() {
  try {
    if (session.mode === "firebase" && session.uid) {
      setPresenceOffline(session.uid);
    }
  } catch (e) {}
}

export async function stopPresence() {
  clearInterval(beat);
  beat = null;
  window.removeEventListener("beforeunload", onLeave);
  if (unsub) {
    unsub();
    unsub = null;
  }
  await onLeave();
}
