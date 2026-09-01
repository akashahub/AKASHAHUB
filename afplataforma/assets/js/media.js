/**
 * Vídeos de Yoga / Treino — mesmo player.
 * Mentor cadastra URL (YouTube ou Cloudinary) no frontend.
 * Persistência: localStorage + Firestore afMedia/{slotId} quando as rules permitirem.
 */
import { session, isMentorSession } from "./auth.js";
import { Store } from "./storage.js";
import { esc } from "./navigation.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "../../firebase/firebase-config.js";

const KEY = "media_videos";
const cache = {};
let loadedRemote = false;

function localMap() {
  return Store.get(KEY, {}) || {};
}

export function getVideoUrl(slotId) {
  const over = localMap()[slotId];
  if (over) return over;
  return cache[slotId] || "";
}

export async function hydrateMedia() {
  if (loadedRemote || session.mode !== "firebase") return;
  loadedRemote = true;
  try {
    const snap = await getDoc(doc(db, "afMedia", "_index"));
    if (snap.exists()) {
      const urls = snap.data()?.urls || {};
      Object.assign(cache, urls);
    }
  } catch {
    /* rules ainda não publicadas — localStorage continua válido neste aparelho */
  }
}

export async function setVideoUrl(slotId, url) {
  if (!isMentorSession()) return;
  const clean = String(url || "").trim();
  const all = localMap();
  if (clean) all[slotId] = clean;
  else delete all[slotId];
  Store.set(KEY, all);
  if (clean) cache[slotId] = clean;
  else delete cache[slotId];
  if (session.mode === "firebase") {
    try {
      const snap = await getDoc(doc(db, "afMedia", "_index"));
      const urls = { ...(snap.exists() ? snap.data()?.urls || {} : {}), ...all };
      if (!clean) delete urls[slotId];
      await setDoc(
        doc(db, "afMedia", "_index"),
        { urls, updatedAt: serverTimestamp(), updatedBy: session.uid },
        { merge: true }
      );
    } catch (e) {
      console.warn("[media] firestore", e?.code || e?.message);
    }
  }
}

export function parseVideo(url) {
  const raw = String(url || "").trim();
  if (!raw) return { kind: "empty" };
  const yt =
    raw.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/) ||
    raw.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (yt) {
    return {
      kind: "youtube",
      id: yt[1],
      embed: "https://www.youtube-nocookie.com/embed/" + yt[1] + "?rel=0&modestbranding=1"
    };
  }
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(raw) || /res\.cloudinary\.com\/.+\/video\//i.test(raw) || /player\.cloudinary\.com/i.test(raw)) {
    return { kind: "file", src: raw };
  }
  if (/^https?:\/\//i.test(raw)) return { kind: "iframe", src: raw };
  return { kind: "invalid" };
}

export function renderVideoFrame(slotId, { caption } = {}) {
  const url = getVideoUrl(slotId);
  const parsed = parseVideo(url);
  const mentor = isMentorSession();
  let stage = "";
  if (parsed.kind === "youtube") {
    stage = `<iframe class="media-el" src="${esc(parsed.embed)}" title="${esc(caption || "Vídeo")}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  } else if (parsed.kind === "file") {
    stage = `<video class="media-el" controls playsinline preload="metadata" src="${esc(parsed.src)}"></video>`;
  } else if (parsed.kind === "iframe") {
    stage = `<iframe class="media-el" src="${esc(parsed.src)}" title="${esc(caption || "Vídeo")}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  } else if (parsed.kind === "invalid") {
    stage = `<div class="media-empty">Link inválido. Use YouTube ou Cloudinary.</div>`;
  } else {
    stage = `<div class="media-empty">${mentor ? "Cole a URL do vídeo abaixo." : "Vídeo ainda não publicado nesta série."}</div>`;
  }
  const edit = mentor
    ? `<form class="media-edit" data-media-form="${esc(slotId)}">
        <input type="url" inputmode="url" placeholder="https://youtu.be/… ou Cloudinary" value="${esc(url)}" data-media-input="${esc(slotId)}" autocomplete="off">
        <button class="tool-btn" type="submit">Salvar vídeo</button>
      </form>`
    : "";
  return `<div class="media-frame" data-media-slot="${esc(slotId)}">
    <div class="media-ratio" data-media-stage="${esc(slotId)}">${stage}</div>
    <div class="media-bar">
      <button type="button" class="media-fs" data-media-fs="${esc(slotId)}">Tela cheia</button>
      ${caption ? `<span>${esc(caption)}</span>` : ""}
    </div>
    ${edit}
  </div>`;
}

export function bindMediaUI() {
  if (document.documentElement.dataset.mediaBound) return;
  document.documentElement.dataset.mediaBound = "1";
  document.addEventListener("submit", async (e) => {
    const form = e.target.closest("[data-media-form]");
    if (!form) return;
    e.preventDefault();
    if (!isMentorSession()) return;
    const slot = form.dataset.mediaForm;
    const input = form.querySelector("[data-media-input]");
    const url = input?.value?.trim() || "";
    await setVideoUrl(slot, url);
    const host = form.closest("[data-media-slot]");
    if (host) {
      const cap = host.querySelector(".media-bar span")?.textContent || "";
      const wrap = document.createElement("div");
      wrap.innerHTML = renderVideoFrame(slot, { caption: cap });
      const next = wrap.firstElementChild;
      host.replaceWith(next);
    }
    const t = document.getElementById("toast");
    if (t) {
      t.textContent = url ? "Vídeo salvo" : "Vídeo removido";
      t.className = "toast show";
      clearTimeout(window._tt);
      window._tt = setTimeout(() => (t.className = "toast"), 2200);
    }
  });
  document.addEventListener("click", (e) => {
    const fs = e.target.closest("[data-media-fs]");
    if (!fs) return;
    const slot = fs.dataset.mediaFs;
    const stage = document.querySelector(`[data-media-stage="${slot}"]`);
    if (!stage) return;
    e.preventDefault();
    if (!document.fullscreenElement) stage.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  });
}
