/**
 * Firebase — projeto PRINCIPAL hub-akasha
 * NÃO usar akashahubaf
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4",
  authDomain: "hub-akasha.firebaseapp.com",
  projectId: "hub-akasha",
  storageBucket: "hub-akasha.firebasestorage.app",
  messagingSenderId: "370851875474",
  appId: "1:370851875474:web:29b1ba3a76b0fed7d9344b"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/** UID mentor/admin principal AF */
export const MENTOR_UID = "1GO7dRdFUFg2NwYwzOwjvtWfpAS2";

/**
 * DEV_MODE = true  → mostra botões Demo Mentor / Demo Mentorado
 * DEV_MODE = false → versão oficial (sem demo)
 */
export const DEV_MODE = false;


/** URL do backend que assina o token LiveKit. Vazio = lobby + presença funcionam; vídeo de grupo espera o token. */
export const LIVEKIT_TOKEN_URL = "https://akasha.yanfili-simon.workers.dev";
export const LIVEKIT_WS_URL = "wss://akashahub-vlya29kl.livekit.cloud";
