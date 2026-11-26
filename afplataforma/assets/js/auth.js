/**
 * Auth - login e-mail, Google, sessão, afAccess
 * Segurança real = Firestore Rules
 */
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth, MENTOR_UID, DEV_MODE, isDemoEnabled, isMentorIdentity } from "../../firebase/firebase-config.js";
import { getAfAccess, getLegacyAccess, getAccessManagerGrant, registerAfLoginAttempt } from "../../firebase/firestore.js";
import { defaultModulesMap } from "../../data/modules.js";
import { Store } from "./storage.js";

export const session = {
  mode: null,
  uid: null,
  email: null,
  name: null,
  role: null,
  approved: false,
  active: false,
  modules: {},
  legacyPhases: {},
  canManageLegacyAccess: false,
  plan: "essential",
  features: {},
  extraRooms: [],
  roomsBlocked: [],
  roomId: "mentoria-principal",
  mentorshipEndsAt: "",
  supportEndsAt: "",
  contentEndsAt: "",
  lifetime: false,
  lang: Store.getLang(),
  ready: false
};

let onSessionReady = null;
let onAccessDenied = null;
let onLoggedOut = null;
let authListening = false;

export function setAuthCallbacks({ onReady, onDenied, onLogout }) {
  onSessionReady = onReady;
  onAccessDenied = onDenied;
  onLoggedOut = onLogout;
}

export function isMentorSession() {
  return session.role === "mentor" || isMentorIdentity(session.uid, session.email);
}

const ALL_LEGACY_PHASES = {
  phase01: true, phase02: true, phase03: true, phase04: true, phase05: true
};

function resolveLegacyPhases(legacyAccess, afAccess) {
  if (legacyAccess && legacyAccess.phases && typeof legacyAccess.phases === "object") {
    const phases = {};
    Object.keys(ALL_LEGACY_PHASES).forEach((key) => {
      phases[key] = legacyAccess.phases[key] === true;
    });
    // A fase 3 continua dependendo também da autorização específica do AF.
    phases.phase03 = phases.phase03 && afAccess?.approved === true && afAccess?.active === true;
    return phases;
  }
  // Compatibilidade: clientes AF ativos antes da nova camada mantêm a jornada completa.
  if (afAccess?.approved === true && afAccess?.active === true) return { ...ALL_LEGACY_PHASES };
  return { phase01: false, phase02: false, phase03: false, phase04: false, phase05: false };
}

function buildSessionFromUser(user, access, legacyAccess, mode = "firebase") {
  const isMentor = isMentorIdentity(user.uid, user.email);
  if (isMentor) {
    return {
      mode,
      uid: user.uid,
      email: user.email || "",
      name: user.displayName || user.email?.split("@")[0] || "Mentor",
      role: "mentor",
      approved: true,
      active: true,
      modules: access?.modules || defaultModulesMap(7),
      legacyPhases: { ...ALL_LEGACY_PHASES },
      canManageLegacyAccess: user.uid === MENTOR_UID,
      plan: "vip",
      features: {},
      extraRooms: [],
      roomsBlocked: [],
      roomId: session.roomId || "mentoria-principal",
      lifetime: true,
      lang: session.lang,
      ready: true
    };
  }

  const legacyPhases = resolveLegacyPhases(legacyAccess, access);
  const hasAnyPhase = Object.values(legacyPhases).some(Boolean);
  const afActive = access?.approved === true && access?.active === true;
  if (!hasAnyPhase) {
    return { denied: true, reason: access ? "not_active" : "no_af_access" };
  }

  return {
    mode,
    uid: user.uid,
    email: user.email || "",
    name: user.displayName || user.email?.split("@")[0] || "Mentorado",
    role: "mentee",
    approved: true,
    active: true,
    modules: afActive ? (access.modules || defaultModulesMap(0)) : defaultModulesMap(0),
    legacyPhases,
    plan: access?.plan || "essential",
    features: afActive ? (access.features || {}) : {},
    extraRooms: afActive ? (access.extraRooms || []) : [],
    roomsBlocked: afActive ? (access.roomsBlocked || []) : [],
    roomId: session.roomId || "mentoria-principal",
    mentorshipEndsAt: access?.mentorshipEndsAt || "",
    supportEndsAt: access?.supportEndsAt || "",
    contentEndsAt: access?.contentEndsAt || "",
    lifetime: afActive && access?.lifetime === true,
    lang: session.lang,
    ready: true
  };
}

function applySession(s) {
  Object.assign(session, s);
  if (onSessionReady) onSessionReady(session);
}

export async function resolveUserAccess(user) {
  try {
    await registerAfLoginAttempt(user);
  } catch (e) {
    console.warn("[AF] register attempt", e?.code || e?.message || e);
  }

  let access = null;
  try {
    access = await getAfAccess(user.uid);
  } catch (e) {
    console.warn("[AF] getAfAccess:", e?.code || e?.message || e);
    if (!isMentorIdentity(user.uid, user.email)) {
      if (onAccessDenied) onAccessDenied("error");
      return false;
    }
  }
  let legacyAccess = null;
  try {
    legacyAccess = await getLegacyAccess(user.uid);
  } catch (e) {
    // Compatibilidade durante a implantação: se as regras novas ainda não estiverem
    // publicadas, clientes AF ativos continuam entrando com o acesso legado.
    console.warn("[AF] getLegacyAccess (fallback compatível):", e?.code || e?.message || e);
    legacyAccess = null;
  }
  let managerGrant = null;
  try {
    managerGrant = await getAccessManagerGrant(user.uid);
  } catch (e) {
    console.warn("[AF] getAccessManagerGrant:", e?.code || e?.message || e);
  }
  const result = buildSessionFromUser(user, access, legacyAccess, "firebase");
  if (!result.denied) {
    result.canManageLegacyAccess = user.uid === MENTOR_UID || managerGrant?.active === true;
  }
  if (result.denied) {
    if (onAccessDenied) onAccessDenied(result.reason);
    return false;
  }
  applySession(result);
  return true;
}

export function startAuthListener() {
  if (authListening) return;
  authListening = true;

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      const q = new URLSearchParams(location.search).get("demo");
      if (q === "mentor" || q === "mentee") {
        enterDemo(q);
        return;
      }
      Object.assign(session, {
        mode: null,
        uid: null,
        email: null,
        name: null,
        role: null,
        approved: false,
        active: false,
        modules: {},
        legacyPhases: {},
        canManageLegacyAccess: false,
        ready: false
      });
      if (onLoggedOut) onLoggedOut();
      return;
    }
    try {
      await resolveUserAccess(user);
    } catch (e) {
      console.error("[AF auth]", e);
      if (onAccessDenied) onAccessDenied("error");
    }
  });
}

export async function loginEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  return resolveUserAccess(cred.user);
}

export async function loginGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const cred = await signInWithPopup(auth, provider);
  return resolveUserAccess(cred.user);
}

export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, String(email || "").trim().toLowerCase());
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn(e);
  }
  Object.assign(session, {
    mode: null,
    uid: null,
    role: null,
    legacyPhases: {},
    canManageLegacyAccess: false,
    ready: false
  });
  if (onLoggedOut) onLoggedOut();
}

export function enterDemo(role) {
  const q = new URLSearchParams(location.search).get("demo");
  if (!isDemoEnabled()) return;
  if (role === "mentor") {
    applySession({
      mode: "local",
      uid: MENTOR_UID,
      email: "yanfili.simon@gmail.com",
      name: "Yan · Mentor",
      role: "mentor",
      approved: true,
      active: true,
      modules: defaultModulesMap(7),
      legacyPhases: { ...ALL_LEGACY_PHASES },
      canManageLegacyAccess: false,
      plan: "vip",
      features: {},
      extraRooms: [],
      roomsBlocked: [],
      roomId: "mentoria-principal",
      lifetime: true,
      lang: session.lang,
      ready: true
    });
  } else {
    applySession({
      mode: "local",
      uid: "demo_mentee",
      email: "aluno@demo.com",
      name: "Mentorado Demo",
      role: "mentee",
      approved: true,
      active: true,
      modules: defaultModulesMap(2),
      legacyPhases: { ...ALL_LEGACY_PHASES },
      canManageLegacyAccess: false,
      plan: "essential",
      features: {},
      extraRooms: [],
      roomsBlocked: [],
      roomId: "sala-essencial",
      lang: session.lang,
      ready: true
    });
  }
}

export { DEV_MODE, MENTOR_UID };
