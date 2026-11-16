import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, arrayUnion, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { startAkashaTracking, stopAkashaTracking } from "/shared-tools/akasha-telemetry.js";

export const MENTOR = "yanfili.simon@gmail.com";
const app = initializeApp({
  apiKey: "AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4",
  authDomain: "hub-akasha.firebaseapp.com",
  projectId: "hub-akasha",
  storageBucket: "hub-akasha.firebasestorage.app",
  messagingSenderId: "370851875474",
  appId: "1:370851875474:web:29b1ba3a76b0fed7d9344b",
});
export const auth = getAuth(app);
export const db = getFirestore(app);

let trackedUid = null;
onAuthStateChanged(auth, (user) => {
  if (user) {
    trackedUid = user.uid;
    startAkashaTracking(user);
  } else {
    stopAkashaTracking();
    trackedUid = null;
  }
});

export function isMentor(email) {
  return String(email || "").trim().toLowerCase() === MENTOR;
}

/** Registra o login no próprio perfil do usuário, sem criar uma coleção ou exigir novas regras. */
export async function recordLogin(user) {
  if (!user) return;
  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const previous = snap.exists() ? snap.data() : {};
    await setDoc(ref, {
      uid: user.uid,
      email: user.email || "",
      nome: previous.nome || user.displayName || "",
      createdAt: previous.createdAt || serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      loginCount: increment(1),
      lastLoginProvider: user.providerData?.[0]?.providerId || "password"
    }, { merge: true });
  } catch (error) {
    console.warn("[Akasha Hub] Não foi possível registrar o login:", error);
  }
}

export async function hasPack(user) {
  if (!user) return false;
  if (isMentor(user.email)) return true;
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    const list = snap.exists() ? snap.data().produtos || [] : [];
    return list.includes("pack-audios");
  } catch (e) {
    return false;
  }
}

export async function rememberPack(user) {
  if (!user || isMentor(user.email)) return;
  try {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email || "",
      produtos: arrayUnion("pack-audios"),
    }, { merge: true });
  } catch (e) {}
}
