/**
 * Operações Firestore — AF Plataforma
 * users/{uid} = perfil (NÃO alterar para liberar AF)
 * afAccess/{uid} = autorização AF
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db, auth, MENTOR_UID } from "./firebase-config.js";

export function fullAfModules() {
  return {
    module01: true, module02: true, module03: true, module04: true,
    module05: true, module06: true, module07: true
  };
}

export function countAfModules(modules) {
  if (!modules || typeof modules !== "object") return 0;
  let n = 0;
  for (let i = 1; i <= 7; i++) if (modules["module0" + i] === true) n++;
  return n;
}

export function afAccessStatus(access) {
  if (!access) return "none";
  if (access.approved !== true) return "pending";
  if (access.active !== true) return "paused";
  return "active";
}

function mapAfError(e) {
  const code = e?.code || "";
  let msg = e?.message || "Não foi possível concluir a operação. Tente novamente.";
  if (code === "permission-denied") msg = "Você não possui permissão administrativa para realizar esta ação.";
  else if (code === "not-found") msg = "Usuário não encontrado.";
  else if (code === "unavailable" || code === "deadline-exceeded") msg = "Não foi possível concluir a operação. Tente novamente.";
  const err = new Error(msg);
  err.code = code;
  throw err;
}

function actorUid() {
  return auth?.currentUser?.uid || MENTOR_UID;
}

function pickUserName(u, uid) {
  return u.name || u.displayName || u.nome || u.fullName || u.nomeCompleto || (u.email ? String(u.email).split("@")[0] : "") || uid;
}

function pickUserEmail(u) {
  return u.email || u.mail || u.eMail || "";
}

export async function getAfAccess(uid) {
  if (!uid) return null;
  try {
    const snap = await getDoc(doc(db, "afAccess", uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    mapAfError(e);
  }
}

/** Lista users + cruza com afAccess. Não altera users. */
export async function getAllUsersForAf() {
  try {
    const [usersSnap, accessSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "afAccess"))
    ]);
    const accessMap = {};
    accessSnap.forEach((d) => { accessMap[d.id] = d.data() || {}; });
    const list = [];
    const seen = new Set();
    usersSnap.forEach((d) => {
      seen.add(d.id);
      const u = d.data() || {};
      const access = accessMap[d.id] || null;
      list.push({
        uid: d.id,
        name: pickUserName(u, d.id),
        email: pickUserEmail(u),
        photo: u.photo || u.photoURL || u.foto || "",
        access,
        status: afAccessStatus(access),
        modulesOn: countAfModules(access?.modules)
      });
    });
    accessSnap.forEach((d) => {
      if (seen.has(d.id)) return;
      const access = d.data() || {};
      list.push({
        uid: d.id,
        name: d.id,
        email: "",
        photo: "",
        access,
        status: afAccessStatus(access),
        modulesOn: countAfModules(access.modules)
      });
    });
    list.sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));
    return list;
  } catch (e) {
    mapAfError(e);
  }
}

export async function grantFullAfAccess(uid) {
  if (!uid) throw new Error("Usuário não encontrado.");
  try {
    const existing = await getDoc(doc(db, "afAccess", uid));
    const payload = {
      approved: true,
      active: true,
      modules: fullAfModules(),
      updatedAt: serverTimestamp(),
      updatedBy: actorUid()
    };
    if (!existing.exists() || !existing.data()?.grantedAt) {
      payload.grantedAt = serverTimestamp();
      payload.grantedBy = actorUid();
    }
    await setDoc(doc(db, "afAccess", uid), payload, { merge: true });
    return { uid, approved: true, active: true, modules: fullAfModules() };
  } catch (e) {
    mapAfError(e);
  }
}

export async function pauseAfAccess(uid) {
  if (!uid) throw new Error("Usuário não encontrado.");
  try {
    const ref = doc(db, "afAccess", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw Object.assign(new Error("Usuário não encontrado."), { code: "not-found" });
    await updateDoc(ref, {
      active: false,
      pausedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: actorUid()
    });
    return { uid, active: false };
  } catch (e) {
    mapAfError(e);
  }
}

export async function reactivateAfAccess(uid) {
  if (!uid) throw new Error("Usuário não encontrado.");
  try {
    const ref = doc(db, "afAccess", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw Object.assign(new Error("Usuário não encontrado."), { code: "not-found" });
    await updateDoc(ref, {
      active: true,
      reactivatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: actorUid()
    });
    return { uid, active: true };
  } catch (e) {
    mapAfError(e);
  }
}

export async function updateAfModules(uid, modules) {
  if (!uid) throw new Error("Usuário não encontrado.");
  const next = {};
  for (let i = 1; i <= 7; i++) {
    const k = "module0" + i;
    next[k] = modules?.[k] === true;
  }
  try {
    const ref = doc(db, "afAccess", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw Object.assign(new Error("Usuário não encontrado."), { code: "not-found" });
    await updateDoc(ref, {
      modules: next,
      updatedAt: serverTimestamp(),
      updatedBy: actorUid()
    });
    return { uid, modules: next };
  } catch (e) {
    mapAfError(e);
  }
}

export async function getAfTool(uid, toolId) {
  if (!uid || !toolId) return null;
  const snap = await getDoc(doc(db, "afTools", uid, "tools", toolId));
  return snap.exists() ? snap.data() : null;
}

export async function saveAfTool(uid, toolId, data) {
  if (!uid || !toolId) throw new Error("uid/toolId obrigatórios");
  await setDoc(doc(db, "afTools", uid, "tools", toolId), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getMenteeNotes(uid, callId = "default") {
  if (!uid) return null;
  const snap = await getDoc(doc(db, "afMenteeNotes", uid, "calls", callId));
  return snap.exists() ? snap.data() : null;
}

export async function saveMenteeNotes(uid, callId = "default", content = "") {
  if (!uid) throw new Error("uid obrigatório");
  await setDoc(doc(db, "afMenteeNotes", uid, "calls", callId), { content, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getMentorPrivateNotes(menteeUid, callId = "default") {
  if (!menteeUid) return null;
  const snap = await getDoc(doc(db, "afMentorNotes", menteeUid, "calls", callId));
  return snap.exists() ? snap.data() : null;
}

export async function saveMentorPrivateNotes(menteeUid, callId = "default", content = "") {
  if (!menteeUid) throw new Error("menteeUid obrigatório");
  await setDoc(doc(db, "afMentorNotes", menteeUid, "calls", callId), { content, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getMentorScript(moduleId) {
  if (!moduleId) return null;
  const snap = await getDoc(doc(db, "afMentorScripts", moduleId));
  return snap.exists() ? snap.data() : null;
}

export async function getAfCall(callId) {
  if (!callId) return null;
  const snap = await getDoc(doc(db, "afCalls", callId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createAfCall(data) {
  const id = data.id || `call_${Date.now()}`;
  await setDoc(doc(db, "afCalls", id), {
    mentorId: data.mentorId || null,
    menteeId: data.menteeId || null,
    moduleId: data.moduleId || null,
    status: data.status || "scheduled",
    createdAt: serverTimestamp(),
    startedAt: null,
    endedAt: null
  });
  return id;
}

export async function updateAfCall(callId, data) {
  if (!callId) throw new Error("callId obrigatório");
  await updateDoc(doc(db, "afCalls", callId), { ...data, updatedAt: serverTimestamp() });
}
