/**
 * Firebase — projeto PRINCIPAL hub-akasha
 * NÃO usar akashahubaf
 */
import { app, auth, db } from "/login/firebase.js";
export { app, auth, db };

/** UID mentor/admin principal AF (Yan) */
export const MENTOR_UID = "1GO7dRdFUFg2NwYwzOwjvtWfpAS2";

/** Contas com o mesmo poder de mentor: gestão de acesso, roteiro, call, livro. */
export const MENTOR_EMAILS = [
  "yanfili.simon@gmail.com",
  "plmacramo@gmail.com",
  "sendatantrica@gmail.com",
  "opatricksimon@gmail.com"
];

export function isMentorIdentity(uid, email) {
  if (uid && uid === MENTOR_UID) return true;
  const mail = String(email || "").trim().toLowerCase();
  return MENTOR_EMAILS.includes(mail);
}

/**
 * DEV_MODE = true  → mostra botões Demo Mentor / Demo Mentorado
 * DEV_MODE = false → versão oficial (sem demo)
 */
export const DEV_MODE = false;

/** Preview local ou ?demo=1 — não liga demo na produção. */
export function isDemoEnabled() {
  if (DEV_MODE) return true;
  try {
    const q = new URLSearchParams(location.search);
    if (q.get("demo")) return true;
    if (/localhost|127\.0\.0\.1/.test(location.hostname)) return true;
  } catch {
    /* ignore */
  }
  return false;
}


/** URL do backend que assina o token LiveKit. Vazio = lobby + presença funcionam; vídeo de grupo espera o token. */
export const LIVEKIT_TOKEN_URL = "https://akasha.yanfili-simon.workers.dev";
export const LIVEKIT_WS_URL = "wss://akashahub-vlya29kl.livekit.cloud";
