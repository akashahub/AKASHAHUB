/**
 * Call — mídia local + preparação afCalls
 * WebRTC 1:1 completo = fase seguinte (afCalls/{callId})
 */
import { session, isMentorSession } from "./auth.js";
import { Store } from "./storage.js";
import { getMenteeNotes, saveMenteeNotes, getMentorPrivateNotes, saveMentorPrivateNotes } from "../../firebase/firestore.js";
import { openTeleprompter } from "./teleprompter.js";
import { esc } from "./navigation.js";

let localStream = null;
let micOn = true;
let camOn = true;

function toast(msg, err = false) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast show" + (err ? " err" : "");
  clearTimeout(window._tt);
  window._tt = setTimeout(() => (el.className = "toast"), 2800);
}

function openModal(title, body, foot) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalBody").innerHTML = body;
  document.getElementById("modalFoot").innerHTML = foot || "";
  document.getElementById("overlay")?.classList.add("open");
  document.getElementById("modalBox")?.classList.add("open");
}

export function renderCallView() {
  const mentor = isMentorSession();
  return `<div class="view active">
    <p class="hero-line">Encontro ao vivo</p>
    <h2 class="hero-title">Call de mentoria</h2>
    <p class="hero-sub">1 mentor + 1 mentorando. Use o painel de roteiro ao lado da call (mentor).</p>
    <div class="call-layout">
      <div class="video-stage">
        <div class="v-tile self"><div class="v-ph" id="localPh">Você</div><video id="localVideo" autoplay playsinline muted></video><span class="v-label">Você</span></div>
        <div class="v-tile"><div class="v-ph">Remoto</div><span class="v-label">Participante</span></div>
      </div>
      <div class="call-bar">
        <button class="ctrl" type="button" id="btnMic" title="Microfone">🎙</button>
        <button class="ctrl" type="button" id="btnCam" title="Câmera">📷</button>
        <button class="ctrl" type="button" id="btnStartCam">Iniciar câmera</button>
        ${
          mentor
            ? `<button class="ctrl tool" type="button" id="btnRoteiro">Roteiro</button>
               <button class="ctrl tool" type="button" id="btnMentorNotes">Notas privadas</button>`
            : `<button class="ctrl tool" type="button" id="btnNotes">Notas</button>`
        }
        <button class="ctrl leave" type="button" id="btnLeaveCall">Sair</button>
      </div>
    </div>
    <p class="call-hint">MVP: mídia local. Pareamento WebRTC em afCalls/&#123;callId&#125; na próxima fase.</p>
  </div>`;
}

export function bindCallControls(navigate) {
  document.getElementById("btnStartCam")?.addEventListener("click", startLocalMedia);
  document.getElementById("btnMic")?.addEventListener("click", toggleMic);
  document.getElementById("btnCam")?.addEventListener("click", toggleCam);
  document.getElementById("btnLeaveCall")?.addEventListener("click", () => {
    stopMedia();
    if (navigate) navigate("dashboard");
  });
  document.getElementById("btnRoteiro")?.addEventListener("click", () => openTeleprompter());
  document.getElementById("btnNotes")?.addEventListener("click", openMenteeNotes);
  document.getElementById("btnMentorNotes")?.addEventListener("click", openMentorPrivateNotes);
}

export async function startLocalMedia() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      audio: { echoCancellation: true, noiseSuppression: true }
    });
    const v = document.getElementById("localVideo");
    if (v) {
      v.srcObject = localStream;
      const ph = document.getElementById("localPh");
      if (ph) ph.style.display = "none";
    }
    toast("Câmera ativa");
  } catch (e) {
    toast("Sem permissão de câmera/mic", true);
  }
}

export function stopMedia() {
  if (localStream) localStream.getTracks().forEach((t) => t.stop());
  localStream = null;
}

export function toggleMic() {
  if (!localStream) return;
  micOn = !micOn;
  localStream.getAudioTracks().forEach((t) => (t.enabled = micOn));
  const b = document.getElementById("btnMic");
  if (b) {
    b.classList.toggle("off", !micOn);
    b.textContent = micOn ? "🎙" : "🔇";
  }
}

export function toggleCam() {
  if (!localStream) return;
  camOn = !camOn;
  localStream.getVideoTracks().forEach((t) => (t.enabled = camOn));
  const b = document.getElementById("btnCam");
  if (b) {
    b.classList.toggle("off", !camOn);
    b.textContent = camOn ? "📷" : "🚫";
  }
}

async function openMenteeNotes() {
  let text = "";
  let meta = "—";
  if (session.mode === "firebase") {
    try {
      const n = await getMenteeNotes(session.uid, "default");
      if (n) {
        text = n.content || "";
        meta = n.updatedAt ? "Cloud" : "—";
      }
    } catch (e) {
      console.warn(e);
    }
  }
  if (!text) {
    const local = Store.getNotes(session.uid);
    text = local.text || "";
    if (local.updatedAt) meta = new Date(local.updatedAt).toLocaleString("pt-BR");
  }

  openModal(
    "Notas da call",
    `<textarea class="notes-area" id="notesArea" placeholder="Anote insights…">${esc(text)}</textarea>
     <p class="notes-meta" id="notesMeta">${esc(meta)}</p>`,
    `<button class="btn btn-inline" type="button" id="btnSaveNotes">Salvar</button>
     <button class="btn btn-ghost btn-inline" type="button" id="btnCopyNotes">Copiar tudo</button>`
  );

  let timer;
  document.getElementById("notesArea").oninput = () => {
    clearTimeout(timer);
    timer = setTimeout(() => saveNotes(false), 1500);
  };
  document.getElementById("btnSaveNotes").onclick = () => saveNotes(true);
  document.getElementById("btnCopyNotes").onclick = async () => {
    try {
      await navigator.clipboard.writeText(document.getElementById("notesArea").value || "");
      toast("Copiado");
    } catch {
      toast("Falha ao copiar", true);
    }
  };
}

async function saveNotes(manual) {
  const text = document.getElementById("notesArea")?.value ?? "";
  Store.saveNotes(session.uid, text);
  if (session.mode === "firebase") {
    try {
      await saveMenteeNotes(session.uid, "default", text);
    } catch (e) {
      console.warn(e);
    }
  }
  const meta = document.getElementById("notesMeta");
  if (meta) meta.textContent = (manual ? "Salvo · " : "Auto · ") + new Date().toLocaleTimeString("pt-BR");
  if (manual) toast("Notas salvas");
}

async function openMentorPrivateNotes() {
  let text = "";
  openModal(
    "Notas privadas do mentor",
    `<p class="notes-hint">Não visíveis ao mentorando.</p>
     <textarea class="notes-area" id="mNotes" placeholder="Observações privadas…">${esc(text)}</textarea>`,
    `<button class="btn btn-inline" type="button" id="btnSaveMN">Salvar</button>`
  );
  document.getElementById("btnSaveMN").onclick = async () => {
    const content = document.getElementById("mNotes").value;
    Store.saveMentorNote("current", content);
    if (session.mode === "firebase") {
      try {
        await saveMentorPrivateNotes("current", "default", content);
      } catch (e) {
        console.warn(e);
      }
    }
    toast("Salvo");
  };
}
