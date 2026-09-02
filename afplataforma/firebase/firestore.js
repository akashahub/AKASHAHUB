/**
 * Operações Firestore centralizadas — AF Plataforma
 * Coleção de acesso: afAccess/{uid}
 * Tentativas de login: afAccessRequests/{uid}
 * Presença/call: afPresence + salas_live
 * Roteiros privados: afMentorScripts/{moduleId}
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db, auth, MENTOR_UID } from "./firebase-config.js";

export function fullAfModules() {
  return {
    module01: true,
    module02: true,
    module03: true,
    module04: true,
    module05: true,
    module06: true,
    module07: true
  };
}

export function countAfModules(modules) {
  if (!modules || typeof modules !== "object") return 0;
  let n = 0;
  for (let i = 1; i <= 7; i++) {
    if (modules["module0" + i] === true) n++;
  }
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
  if (code === "permission-denied") {
    const err = new Error("Você não possui permissão administrativa para realizar esta ação.");
    err.code = code;
    throw err;
  }
  if (code === "not-found") {
    const err = new Error("Usuário não encontrado.");
    err.code = code;
    throw err;
  }
  if (code === "unavailable" || code === "deadline-exceeded" || code === "resource-exhausted") {
    const err = new Error("Não foi possível concluir a operação. Tente novamente.");
    err.code = code;
    throw err;
  }
  const err = new Error(e?.message || "Não foi possível concluir a operação. Tente novamente.");
  err.code = code;
  throw err;
}

function actorUid() {
  return auth?.currentUser?.uid || MENTOR_UID;
}

function pickUserName(u, uid) {
  return (
    u.name ||
    u.displayName ||
    u.nome ||
    u.fullName ||
    u.nomeCompleto ||
    (u.email ? String(u.email).split("@")[0] : "") ||
    uid
  );
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

/**
 * Lista users/{uid} + cruza com afAccess/{uid}.
 * Não altera a collection users.
 */
export async function getAllUsersForAf() {
  try {
    const [usersSnap, accessSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "afAccess"))
    ]);
    const accessMap = {};
    accessSnap.forEach((d) => {
      accessMap[d.id] = d.data() || {};
    });
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
      plan: existing.exists() && existing.data()?.plan ? existing.data().plan : "essential",
      updatedAt: serverTimestamp(),
      updatedBy: actorUid()
    };
    if (!existing.exists() || !existing.data()?.grantedAt) {
      payload.grantedAt = serverTimestamp();
      payload.grantedBy = actorUid();
    }
    await setDoc(doc(db, "afAccess", uid), payload, { merge: true });
    await setDoc(
      doc(db, "afAccessRequests", uid),
      { status: "granted", updatedAt: serverTimestamp(), updatedBy: actorUid() },
      { merge: true }
    );
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
    await setDoc(
      doc(db, "afAccessRequests", uid),
      { status: "granted", updatedAt: serverTimestamp() },
      { merge: true }
    );
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

export async function updateAfPlan(uid, plan) {
  if (!uid) throw new Error("Usuário não encontrado.");
  const next = ["essential", "premium", "vip"].includes(plan) ? plan : "essential";
  try {
    const ref = doc(db, "afAccess", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw Object.assign(new Error("Usuário não encontrado."), { code: "not-found" });
    await updateDoc(ref, {
      plan: next,
      updatedAt: serverTimestamp(),
      updatedBy: actorUid()
    });
    return { uid, plan: next };
  } catch (e) {
    mapAfError(e);
  }
}

export async function updateAfFeatures(uid, features) {
  if (!uid) throw new Error("Usuário não encontrado.");
  const clean = {};
  Object.keys(features || {}).forEach((k) => {
    if (features[k] === true) clean[k] = true;
    else if (features[k] === false) clean[k] = false;
  });
  try {
    const ref = doc(db, "afAccess", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw Object.assign(new Error("Usuário não encontrado."), { code: "not-found" });
    await updateDoc(ref, {
      features: clean,
      updatedAt: serverTimestamp(),
      updatedBy: actorUid()
    });
    return { uid, features: clean };
  } catch (e) {
    mapAfError(e);
  }
}

export async function updateAfRoomAccess(uid, extraRooms, roomsBlocked) {
  if (!uid) throw new Error("Usuário não encontrado.");
  const extra = (extraRooms || []).map((s) => String(s).trim()).filter(Boolean);
  const blocked = (roomsBlocked || []).map((s) => String(s).trim()).filter(Boolean);
  try {
    const ref = doc(db, "afAccess", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw Object.assign(new Error("Usuário não encontrado."), { code: "not-found" });
    await updateDoc(ref, {
      extraRooms: extra,
      roomsBlocked: blocked,
      updatedAt: serverTimestamp(),
      updatedBy: actorUid()
    });
    return { uid, extraRooms: extra, roomsBlocked: blocked };
  } catch (e) {
    mapAfError(e);
  }
}

export async function updateAfDates(uid, fields) {
  if (!uid) throw new Error("Usuário não encontrado.");
  const patch = {
    updatedAt: serverTimestamp(),
    updatedBy: actorUid()
  };
  ["mentorshipEndsAt", "supportEndsAt", "contentEndsAt"].forEach((k) => {
    if (fields[k] === "" || fields[k] == null) patch[k] = "";
    else if (fields[k]) patch[k] = String(fields[k]);
  });
  if (typeof fields.lifetime === "boolean") patch.lifetime = fields.lifetime;
  try {
    const ref = doc(db, "afAccess", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw Object.assign(new Error("Usuário não encontrado."), { code: "not-found" });
    await updateDoc(ref, patch);
    return { uid, ...fields };
  } catch (e) {
    mapAfError(e);
  }
}

export async function denyAfAccess(uid) {
  if (!uid) throw new Error("Usuário não encontrado.");
  try {
    await setDoc(
      doc(db, "afAccessRequests", uid),
      { status: "denied", updatedAt: serverTimestamp(), updatedBy: actorUid() },
      { merge: true }
    );
    const acc = doc(db, "afAccess", uid);
    const snap = await getDoc(acc);
    if (snap.exists()) {
      await updateDoc(acc, {
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
    await setDoc(
      doc(db, "afAccessRequests", uid),
      { status: "blocked", updatedAt: serverTimestamp(), updatedBy: actorUid() },
      { merge: true }
    );
    const acc = doc(db, "afAccess", uid);
    const snap = await getDoc(acc);
    if (snap.exists()) {
      await updateDoc(acc, {
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
    await setDoc(
      doc(db, "afAccessRequests", uid),
      { status: "pending", updatedAt: serverTimestamp(), updatedBy: actorUid() },
      { merge: true }
    );
    return { uid, status: "pending" };
  } catch (e) {
    mapAfError(e);
  }
}

/**
 * Chamado no login (e-mail ou Google).
 * auth.js importa este nome — se faltar, a plataforma inteira deixa de carregar.
 */
export async function registerAfLoginAttempt(user) {
  if (!user?.uid) return;
  const ref = doc(db, "afAccessRequests", user.uid);
  const now = Date.now();
  const base = {
    uid: user.uid,
    email: user.email || "",
    name: user.displayName || (user.email ? String(user.email).split("@")[0] : "") || "",
    photo: user.photoURL || "",
    lastAttemptAt: serverTimestamp(),
    lastAttemptMs: now
  };
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      ...base,
      status: "pending",
      createdAt: serverTimestamp(),
      createdMs: now
    });
    return;
  }
  await setDoc(ref, base, { merge: true });
}

export function listenAfAccessBoard(onRows, onErr) {
  let reqs = [];
  let accessMap = {};
  let usersMap = {};

  function emit() {
    const byUid = {};
    reqs.forEach((r) => {
      byUid[r.uid] = {
        uid: r.uid,
        name: r.name || r.uid,
        email: r.email || "",
        photo: r.photo || "",
        status: r.status || "pending",
        lastAttemptMs: r.lastAttemptMs || 0,
        request: r,
        access: accessMap[r.uid] || null,
        modulesOn: countAfModules(accessMap[r.uid]?.modules)
      };
    });
    Object.keys(accessMap).forEach((uid) => {
      if (byUid[uid]) {
        const acc = accessMap[uid];
        byUid[uid].access = acc;
        byUid[uid].modulesOn = countAfModules(acc?.modules);
        if (acc?.approved === true && acc?.active === true && byUid[uid].status !== "blocked") {
          byUid[uid].status = "active";
        } else if (acc?.approved === true && acc?.active === false && byUid[uid].status !== "blocked") {
          byUid[uid].status = "paused";
        }
      } else {
        const acc = accessMap[uid];
        const u = usersMap[uid] || {};
        byUid[uid] = {
          uid,
          name: pickUserName(u, uid),
          email: pickUserEmail(u),
          photo: u.photo || u.photoURL || "",
          status: afAccessStatus(acc),
          lastAttemptMs: 0,
          request: null,
          access: acc,
          modulesOn: countAfModules(acc?.modules)
        };
      }
    });
    Object.keys(usersMap).forEach((uid) => {
      if (byUid[uid]) {
        const u = usersMap[uid];
        if (!byUid[uid].email) byUid[uid].email = pickUserEmail(u);
        if (!byUid[uid].photo) byUid[uid].photo = u.photo || u.photoURL || "";
        if (byUid[uid].name === uid) byUid[uid].name = pickUserName(u, uid);
      }
    });
    const rows = Object.values(byUid).sort((a, b) => {
      const order = { pending: 0, active: 1, paused: 2, denied: 3, blocked: 4, none: 5 };
      const da = order[a.status] ?? 9;
      const dbv = order[b.status] ?? 9;
      if (da !== dbv) return da - dbv;
      return (b.lastAttemptMs || 0) - (a.lastAttemptMs || 0);
    });
    try { onRows(rows); } catch (e) { console.warn(e); }
  }

  const u1 = onSnapshot(collection(db, "afAccessRequests"), (snap) => {
    reqs = snap.docs.map((d) => ({ id: d.id, uid: d.id, ...d.data() }));
    emit();
  }, onErr);
  const u2 = onSnapshot(collection(db, "afAccess"), (snap) => {
    accessMap = {};
    snap.forEach((d) => { accessMap[d.id] = d.data() || {}; });
    emit();
  }, onErr);
  const u3 = onSnapshot(collection(db, "users"), (snap) => {
    usersMap = {};
    snap.forEach((d) => { usersMap[d.id] = d.data() || {}; });
    emit();
  }, () => {});

  return () => {
    try { u1(); } catch (e) {}
    try { u2(); } catch (e) {}
    try { u3(); } catch (e) {}
  };
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
