/**
 * Portão do Livro Operacional — só a conta do mentor lê.
 * Mentorados (mesmo com afAccess) não passam.
 */
import {
  setAuthCallbacks,
  startAuthListener,
  isMentorSession,
  session
} from "./auth.js";

function deny(msg) {
  document.body.classList.remove("livro-ok");
  document.body.classList.add("livro-deny");
  const lock = document.getElementById("livroLock");
  if (lock) lock.hidden = false;
  const p = document.querySelector("[data-lock-msg]");
  if (p) p.textContent = msg || "Acesso restrito ao mentor.";
}

function allow() {
  if (!isMentorSession()) {
    deny("Acesso restrito ao mentor.");
    return;
  }
  document.body.classList.add("livro-ok");
  document.body.classList.remove("livro-deny");
  const lock = document.getElementById("livroLock");
  if (lock) lock.hidden = true;
  const back = document.getElementById("livroBack");
  if (back) {
    back.href = session.mode === "local" ? "../index.html?demo=mentor" : "../index.html";
  }
}

setAuthCallbacks({
  onReady: allow,
  onDenied: () => deny("Acesso restrito ao mentor."),
  onLogout: () => deny("Entre com a conta do mentor para abrir este livro.")
});

startAuthListener();
