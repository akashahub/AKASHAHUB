/**
 * Auth — login e-mail, Google, sessão, afAccess
 * Segurança real = Firestore Rules
 */
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth, MENTOR_UID, DEV_MODE, isDemoEnabled, isMentorIdentity } from "../../firebase/firebase-config.js";
import { getAfAccess, registerAfLoginAttempt } from "../../firebase/firestore.js";
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

function buildSessionFromUser(user, access, mode = "firebase") {
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

  if (!access) {
    return { denied: true, reason: "no_af_access" };
  }
  if (access.approved !== true || access.active !== true) {
    return { denied: true, reason: "not_active" };
  }

  return {
    mode,
    uid: user.uid,
    email: user.email || "",
    name: user.displayName || user.email?.split("@")[0] || "Mentorado",
    role: "mentee",
    approved: true,
    active: true,
    modules: access.modules || defaultModulesMap(0),
    plan: access.plan || "essential",
    features: access.features || {},
    extraRooms: access.extraRooms || [],
    roomsBlocked: access.roomsBlocked || [],
    roomId: session.roomId || "mentoria-principal",
    mentorshipEndsAt: access.mentorshipEndsAt || "",
    supportEndsAt: access.supportEndsAt || "",
    contentEndsAt: access.contentEndsAt || "",
    lifetime: access.lifetime === true,
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
  const result = buildSessionFromUser(user, access, "firebase");
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
