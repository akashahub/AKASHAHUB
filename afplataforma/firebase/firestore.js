/**
 * Operações Firestore centralizadas — AF Plataforma
 * Coleção de acesso: afAccess/{uid}
 * Roteiros privados: afMentorScripts/{moduleId}
 */
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

export async function getAfAccess(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, "afAccess", uid));
  return snap.exists() ? snap.data() : null;
}

/** Paths alinhados às Firestore Rules: afTools, afMenteeNotes, afMentorNotes */
export async function getAfTool(uid, toolId) {
  if (!uid || !toolId) return null;
  const snap = await getDoc(doc(db, "afTools", uid, "tools", toolId));
  return snap.exists() ? snap.data() : null;
}

export async function saveAfTool(uid, toolId, data) {
  if (!uid || !toolId) throw new Error("uid/toolId obrigatórios");
  await setDoc(
    doc(db, "afTools", uid, "tools", toolId),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function getMenteeNotes(uid, callId = "default") {
  if (!uid) return null;
  const snap = await getDoc(doc(db, "afMenteeNotes", uid, "calls", callId));
  return snap.exists() ? snap.data() : null;
}

export async function saveMenteeNotes(uid, callId = "default", content = "") {
  if (!uid) throw new Error("uid obrigatório");
  await setDoc(
    doc(db, "afMenteeNotes", uid, "calls", callId),
    { content, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function getMentorPrivateNotes(menteeUid, callId = "default") {
  if (!menteeUid) return null;
  const snap = await getDoc(doc(db, "afMentorNotes", menteeUid, "calls", callId));
  return snap.exists() ? snap.data() : null;
}

export async function saveMentorPrivateNotes(menteeUid, callId = "default", content = "") {
  if (!menteeUid) throw new Error("menteeUid obrigatório");
  await setDoc(
    doc(db, "afMentorNotes", menteeUid, "calls", callId),
    { content, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

/**
 * Roteiro PRIVADO — só mentor (Rules)
 * Nunca colocar conteúdo real no front como fallback
 */
export async function getMentorScript(moduleId) {
  if (!moduleId) return null;
  const snap = await getDoc(doc(db, "afMentorScripts", moduleId));
  if (!snap.exists()) return null;
  return snap.data();
}

export async function getAfCall(callId) {
  if (!callId) return null;
  const snap = await getDoc(doc(db, "afCalls", callId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createAfCall(data) {
  const id = data.id || `call_${Date.now()}`;
  const payload = {
    mentorId: data.mentorId || null,
    menteeId: data.menteeId || null,
    moduleId: data.moduleId || null,
    status: data.status || "scheduled",
    createdAt: serverTimestamp(),
    startedAt: null,
    endedAt: null
  };
  await setDoc(doc(db, "afCalls", id), payload);
  return id;
}

export async function updateAfCall(callId, data) {
  if (!callId) throw new Error("callId obrigatório");
  await updateDoc(doc(db, "afCalls", callId), { ...data, updatedAt: serverTimestamp() });
}

export async function upsertPresence(uid, data) {
  if (!uid) return;
  await setDoc(
    doc(db, "afPresence", uid),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export function listenPresenceList(cb) {
  return onSnapshot(collection(db, "afPresence"), (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, (err) => console.warn("listenPresence", err));
}

export async function setPresenceOffline(uid) {
  if (!uid) return;
  await setDoc(doc(db, "afPresence", uid), { online: false, inCall: false, lastSeenMs: Date.now() }, { merge: true });
}

export async function joinLiveRoom(roomId, uid, data) {
  await setDoc(
    doc(db, "salas_live", roomId, "participantes", uid),
    { ...data, uid, joinedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function leaveLiveRoom(roomId, uid) {
  if (!roomId || !uid) return;
  try { await deleteDoc(doc(db, "salas_live", roomId, "participantes", uid)); } catch (e) {}
}

export function listenLivePeers(roomId, cb) {
  return onSnapshot(collection(db, "salas_live", roomId, "participantes"), (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, (err) => console.warn("listenLivePeers", err));
}

export async function sendLiveSignal(roomId, payload) {
  await addDoc(collection(db, "salas_live", roomId, "sinais"), {
    ...payload,
    createdAt: Date.now()
  });
}

export function listenLiveSignalsToMe(roomId, uid, cb) {
  const q = query(
    collection(db, "salas_live", roomId, "sinais"),
    where("para", "==", uid)
  );
  return onSnapshot(q, (snap) => {
    snap.docChanges().forEach((ch) => {
      if (ch.type === "added") cb({ id: ch.doc.id, ...ch.doc.data() });
    });
  }, (err) => console.warn("listenLiveSignals", err));
}
