/**
 * Operações Firestore — AF Plataforma
 * users/{uid} = perfil
 * afAccess/{uid} = autorização
 * afAccessRequests/{uid} = tentativa de login / fila de aprovação
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
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

export function afAccessStatus(access, request) {
  const rst = request?.status;
  if (rst === "blocked") return "blocked";
  if (rst === "denied") return "denied";
  if (!access) {
    if (rst === "granted") return "pending";
    return rst === "pending" || request ? "pending" : "none";
  }
  if (access.approved !== true) return rst === "denied" ? "denied" : "pending";
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

function tsToMs(v) {
  if (!v) return 0;
  if (typeof v.toMillis === "function") return v.toMillis();
  if (v.seconds) return v.seconds * 1000;
  const n = Date.parse(v);
  return Number.isNaN(n) ? 0 : n;
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

function mergeBoard(usersMap, accessMap, reqMap) {
  const ids = new Set([...Object.keys(usersMap), ...Object.keys(accessMap), ...Object.keys(reqMap)]);
  const list = [];
  ids.forEach((uid) => {
    const u = usersMap[uid] || {};
    const req = reqMap[uid] || null;
    const access = accessMap[uid] || null;
    const name = pickUserName({ ...req, ...u }, uid);
    const email = pickUserEmail({ ...u, ...req });
    list.push({
      uid,
      name,
      email,
      photo: u.photo || u.photoURL || req?.photo || "",
      provider: req?.provider || u.provider || "",
      access,
      request: req,
      attemptedAt: tsToMs(req?.lastAttemptAt || req?.attemptedAt || u.lastLoginAt),
      status: afAccessStatus(access, req),
      modulesOn: countAfModules(access?.modules)
    });
  });
  list.sort((a, b) => (b.attemptedAt || 0) - (a.attemptedAt || 0) || String(a.name).localeCompare(String(b.name), "pt-BR"));
  return list;
}

export async function getAllUsersForAf() {
  try {
    const [usersSnap, accessSnap, reqSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "afAccess")),
      getDocs(collection(db, "afAccessRequests"))
    ]);
    const usersMap = {};
    const accessMap = {};
    const reqMap = {};
    usersSnap.forEach((d) => { usersMap[d.id] = d.data() || {}; });
    accessSnap.forEach((d) => { accessMap[d.id] = d.data() || {}; });
    reqSnap.forEach((d) => { reqMap[d.id] = d.data() || {}; });
    return mergeBoard(usersMap, accessMap, reqMap);
  } catch (e) {
    mapAfError(e);
  }
}

/** Tempo real: users + afAccess + afAccessRequests. Retorna unsubscribe. */
export function listenAfAccessBoard(onData, onError) {
  const usersMap = {};
  const accessMap = {};
  const reqMap = {};
  const emit = () => {
    try { onData(mergeBoard(usersMap, accessMap, reqMap)); }
    catch (e) { if (onError) onError(e); }
  };
  const fill = (map, snap) => {
    Object.keys(map).forEach((k) => delete map[k]);
    snap.forEach((d) => { map[d.id] = d.data() || {}; });
  };
  const u1 = onSnapshot(collection(db, "users"), (s) => { fill(usersMap, s); emit(); }, onError);
  const u2 = onSnapshot(collection(db, "afAccess"), (s) => { fill(accessMap, s); emit(); }, onError);
  const u3 = onSnapshot(collection(db, "afAccessRequests"), (s) => { fill(reqMap, s); emit(); }, onError);
  return () => { u1(); u2(); u3(); };
}

/**
 * Chamado no login. Mentorando grava o próprio users/{uid}
 * e afAccessRequests/{uid}. Não escreve afAccess.
 */
export async function registerAfLoginAttempt(user) {
  if (!user?.uid || user.uid === MENTOR_UID) return;
  const name = user.displayName || (user.email ? user.email.split("@")[0] : "") || "";
  const email = user.email || "";
  const provider = user.providerData?.[0]?.providerId || "password";
  try {
    await setDoc(doc(db, "users", user.uid), {
      email,
      name,
      displayName: name,
      lastLoginAt: serverTimestamp(),
      provider
    }, { merge: true });
  } catch (e) {
    console.warn("[AF] users write", e?.code || e?.message || e);
  }
  const ref = doc(db, "afAccessRequests", user.uid);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        email,
        name,
        provider,
        status: "pending",
        attemptedAt: serverTimestamp(),
        lastAttemptAt: serverTimestamp(),
        seenByMentor: false
      });
      return;
    }
    const st = snap.data()?.status;
    if (st === "blocked") return;
    await updateDoc(ref, {
      email,
      name,
      provider,
      lastAttemptAt: serverTimestamp()
    });
  } catch (e) {
    console.warn("[AF] request write", e?.code || e?.message || e);
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
    await setDoc(doc(db, "afAccessRequests", uid), {
      status: "granted",
      seenByMentor: true,
      decidedAt: serverTimestamp(),
      decidedBy: actorUid()
    }, { merge: true });
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
    await setDoc(doc(db, "afAccessRequests", uid), {
      status: "granted",
      seenByMentor: true,
      decidedAt: serverTimestamp(),
      decidedBy: actorUid()
    }, { merge: true });
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

export async function denyAfAccess(uid) {
  if (!uid) throw new Error("Usuário não encontrado.");
  try {
    await setDoc(doc(db, "afAccessRequests", uid), {
      status: "denied",
      seenByMentor: true,
      decidedAt: serverTimestamp(),
      decidedBy: actorUid()
    }, { merge: true });
    const acc = await getDoc(doc(db, "afAccess", uid));
    if (acc.exists()) {
      await updateDoc(doc(db, "afAccess", uid), {
        approved: false,
        active: false,
        updatedAt: serverTimestamp(),
        updatedBy: actorUid()
      });
    }
    return { uid, status: "denied" };
  } catch (e) {
    mapAfError(e);
  }
}

export async function blockAfAccess(uid) {
  if (!uid) throw new Error("Usuário não encontrado.");
  try {
    await setDoc(doc(db, "afAccessRequests", uid), {
      status: "blocked",
      seenByMentor: true,
      decidedAt: serverTimestamp(),
      decidedBy: actorUid()
    }, { merge: true });
    const acc = await getDoc(doc(db, "afAccess", uid));
    if (acc.exists()) {
      await updateDoc(doc(db, "afAccess", uid), {
        approved: false,
        active: false,
        updatedAt: serverTimestamp(),
        updatedBy: actorUid()
      });
    }
    return { uid, status: "blocked" };
  } catch (e) {
    mapAfError(e);
  }
}

export async function markAfRequestPending(uid) {
  if (!uid) throw new Error("Usuário não encontrado.");
  try {
    await setDoc(doc(db, "afAccessRequests", uid), {
      status: "pending",
      seenByMentor: true,
      decidedAt: serverTimestamp(),
      decidedBy: actorUid()
    }, { merge: true });
    return { uid, status: "pending" };
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
