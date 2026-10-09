import { auth, isMentor, hasPack, rememberPack } from "/login/firebase.js";

export const API = "https://jsonmxbuzagmwuucruem.supabase.co/functions/v1/akashaConversa";
export const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzb25teGJ1emFnbXd1dWNydWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0ODAzMTMsImV4cCI6MjA5NjA1NjMxM30.qqBI_AUm_AnP4D830QNUd3JIbPE6o54yzwej0utJ6rQ";
export const PACK = [
  { title: "O código secreto do universo", file: "/audios/codigo.mp3" },
  { title: "Cura das feridas invisíveis", file: "/audios/feridas.mp3" },
  { title: "Mente crística", file: "/audios/mente.mp3" },
];

export function ownedLocal() {
  return !!localStorage.getItem("akasha-pack");
}

export function markOwned(id) {
  localStorage.setItem("akasha-pack", id || "1");
}

export async function ownsPack() {
  const user = auth.currentUser;
  if (user && (isMentor(user.email) || await hasPack(user))) {
    markOwned(isMentor(user.email) ? "mentor" : localStorage.getItem("akasha-pack") || "conta");
    return true;
  }
  return ownedLocal();
}

export async function checkout(email) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: KEY, Authorization: "Bearer " + KEY },
    body: JSON.stringify({ action: "pack", email: email || "" }),
  });
  const data = await res.json();
  if (!data.url) throw new Error("sem");
  return data.url;
}

export async function confirm(sessionId) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: KEY, Authorization: "Bearer " + KEY },
    body: JSON.stringify({ action: "pack_confirm", session_id: sessionId }),
  });
  const data = await res.json().catch(() => ({}));
  return data.paid === true;
}

export function fillPlayer(host, { download }) {
  host.replaceChildren();
  const audio = document.createElement("audio");
  audio.controls = true;
  audio.preload = "none";
  if (!download) audio.controlsList = "nodownload noplaybackrate";
  let limit = 0;
  if (!download) {
    const stop = () => {
      if (!limit || audio.currentTime < limit) return;
      audio.pause();
      audio.currentTime = Math.max(0, limit - 0.05);
    };
    audio.onloadedmetadata = () => { limit = (audio.duration || 0) / 3; };
    audio.ontimeupdate = stop;
    audio.onseeking = stop;
  }
  host.appendChild(audio);
  PACK.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "ah-track";
    const play = document.createElement("button");
    play.type = "button";
    play.textContent = item.title;
    play.onclick = () => {
      if (audio.src.indexOf(item.file) < 0) {
        audio.src = item.file;
        limit = 0;
      }
      audio.play().catch(() => {});
    };
    row.appendChild(play);
    if (download) {
      const a = document.createElement("a");
      a.href = item.file;
      a.download = "";
      a.textContent = "Baixar";
      row.appendChild(a);
    }
    host.appendChild(row);
    if (i === 0 && !download) {
      audio.src = item.file;
    }
  });
  return audio;
}

export async function saveIfLogged() {
  const user = auth.currentUser;
  if (user && !isMentor(user.email)) await rememberPack(user);
}
