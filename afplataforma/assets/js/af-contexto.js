/**
 * Liga a ferramenta ao mentorando escolhido no hub.
 * A escolha vem do navegador. O documento continua no banco, no UID da pessoa.
 * Olhar outra pessoa não permite salvar por cima.
 */
import { subjectUid, writingLocked } from "./af-subject-rules.js?v=etapa4-1";

const KEY = "akasha.hub.context.v1";
const MENTOR_UID = "1GO7dRdFUFg2NwYwzOwjvtWfpAS2";
const MENTORS = [
  "yanfili.simon@gmail.com",
  "plmacramo@gmail.com",
  "sendatantrica@gmail.com",
  "opatricksimon@gmail.com"
];

function readStored() {
  try {
    const data = JSON.parse(sessionStorage.getItem(KEY) || "null");
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

function actorFrom(user) {
  if (!user) return null;
  const email = String(user.email || "").trim().toLowerCase();
  const mentor = user.uid === MENTOR_UID || MENTORS.indexOf(email) !== -1;
  return { uid: user.uid, role: mentor ? "mentor" : "mentee" };
}

function banner(user) {
  let el = document.getElementById("afSubjectBanner");
  const who = actorFrom(user);
  const stored = readStored();
  if (!writingLocked(who, stored)) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("div");
    el.id = "afSubjectBanner";
    el.setAttribute("role", "status");
    el.style.cssText = "margin:12px 0;padding:12px 14px;border:1px solid rgba(205,174,94,.5);border-radius:12px;color:#f4ead2;background:rgba(20,16,24,.72)";
    const host = document.getElementById("content") || document.body;
    host.prepend(el);
  }
  const name = stored.name || stored.email || "esta pessoa";
  el.textContent = "Vendo as respostas de " + name + ". Só essa conta pode salvar. Isto não muda o seu login.";
}

const api = {
  uidFor(user) {
    return subjectUid(actorFrom(user), readStored()) || (user && user.uid) || "";
  },
  writingLocked(user) {
    return writingLocked(actorFrom(user), readStored());
  },
  async hydrate(db, col, user, data) {
    const uid = api.uidFor(user);
    if (!db || !col || !uid || !data) return uid;
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap = await getDoc(doc(db, col, uid));
    if (snap.exists()) {
      const saved = snap.data() || {};
      Object.keys(data).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(saved, key)) data[key] = saved[key];
      });
    }
    banner(user);
    return uid;
  }
};

window.AkashaSubject = api;
