/**
 * Portão das páginas privadas do mentor (Ascensão, Fechamento, Treinamento).
 */
import {
  setAuthCallbacks,
  startAuthListener,
  isMentorSession,
  session
} from "./auth.js";

function deny(msg) {
  document.body.classList.remove("fc-ok");
  document.body.classList.add("fc-deny");
  const lock = document.getElementById("fcLock");
  if (lock) lock.hidden = false;
  const p = document.querySelector("[data-lock-msg]");
  if (p) p.textContent = msg || "Acesso restrito ao mentor.";
}

function allow() {
  if (!isMentorSession()) {
    deny("Acesso restrito ao mentor.");
    return;
  }
  document.body.classList.add("fc-ok");
  document.body.classList.remove("fc-deny");
  const lock = document.getElementById("fcLock");
  if (lock) lock.hidden = true;
  const q = session.mode === "local" ? "?demo=mentor" : "";
  const back = document.getElementById("fcBack");
  if (back) back.href = "../index.html" + q;
  document.querySelectorAll("[data-mentor-href]").forEach((a) => {
    a.href = a.getAttribute("data-mentor-href") + q;
  });
}

setAuthCallbacks({
  onReady: allow,
  onDenied: () => deny("Acesso restrito ao mentor."),
  onLogout: () => deny("Entre com a conta do mentor.")
});

startAuthListener();
