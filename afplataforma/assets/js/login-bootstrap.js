/**
 * Entrada leve da AF Plataforma.
 * Arma os botões de autenticação sem esperar o carregamento dos módulos grandes
 * do painel. O app.js continua responsável por renderizar toda a plataforma.
 */
import {
  session,
  setAuthCallbacks,
  startAuthListener,
  loginEmail,
  loginGoogle,
  resetPassword,
  enterDemo
} from "./auth.js?v=20261118-temp-bypass-1";

const byId = (id) => document.getElementById(id);

function showMessage(message, kind = "") {
  const el = byId("authMsg");
  if (!el) return;
  el.className = "auth-msg" + (kind ? " " + kind : "");
  el.textContent = message;
}

function friendlyAuthError(error) {
  switch (error?.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "E-mail ou senha não conferem.";
    case "auth/user-disabled":
      return "Esta conta está desativada. Fale com seu mentor.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Aguarde um pouco e tente novamente.";
    case "auth/network-request-failed":
      return "Sem conexão. Verifique sua internet e tente de novo.";
    case "auth/unauthorized-domain":
      return "Este domínio ainda não está autorizado no sistema de acesso.";
    case "auth/operation-not-allowed":
      return "Este método de acesso não está habilitado no Firebase Auth.";
    default:
      return "Não foi possível entrar. Confira os dados e tente novamente.";
  }
}

async function handleEmailLogin() {
  const email = String(byId("loginEmail")?.value || "").trim();
  const password = String(byId("loginPass")?.value || "");
  const button = byId("btnLogin");

  if (!email || !password) {
    showMessage("Preencha e-mail e senha.", "err");
    return;
  }

  showMessage("Conectando…");
  if (button) button.disabled = true;
  try {
    await loginEmail(email, password);
  } catch (error) {
    showMessage(friendlyAuthError(error), "err");
  } finally {
    if (button) button.disabled = false;
  }
}

async function handleGoogleLogin() {
  const button = byId("btnGoogle");
  showMessage("Abrindo Google…");
  if (button) button.disabled = true;
  try {
    await loginGoogle();
  } catch (error) {
    showMessage(
      error?.code === "auth/popup-closed-by-user"
        ? "Popup fechado."
        : friendlyAuthError(error),
      "err"
    );
  } finally {
    if (button) button.disabled = false;
  }
}

async function handlePasswordReset() {
  const email = String(byId("loginEmail")?.value || "").trim();
  const button = byId("btnResetPassword");

  if (!email) {
    showMessage("Digite seu e-mail no campo acima para receber o link.", "err");
    byId("loginEmail")?.focus();
    return;
  }

  showMessage("Solicitando instruções...");
  if (button) button.disabled = true;
  let result = "ok";
  try {
    await resetPassword(email);
  } catch (error) {
    if (error?.code === "auth/invalid-email") result = "invalid";
    else if (error?.code !== "auth/user-not-found") result = "error";
  } finally {
    if (button) button.disabled = false;
  }

  if (result === "invalid") {
    showMessage("Confira o formato do e-mail e tente novamente.", "err");
  } else if (result === "ok") {
    showMessage("Se esse e-mail estiver cadastrado, você receberá um link. Confira também a caixa de spam.", "ok");
  } else {
    showMessage("Não foi possível solicitar agora. Verifique sua conexão e tente novamente.", "err");
  }
}

function bindOnce(id, eventName, handler) {
  const element = byId(id);
  if (!element || element.dataset.afAuthBound === "1") return;
  element.addEventListener(eventName, handler);
  element.dataset.afAuthBound = "1";
}

bindOnce("btnLogin", "click", handleEmailLogin);
bindOnce("btnGoogle", "click", handleGoogleLogin);
bindOnce("btnResetPassword", "click", handlePasswordReset);
bindOnce("loginPass", "keydown", (event) => {
  if (event.key === "Enter") handleEmailLogin();
});
bindOnce("btnDemoMentor", "click", () => enterDemo("mentor"));
bindOnce("btnDemoMentee", "click", () => enterDemo("mentee"));

const loginButton = byId("btnLogin");
if (loginButton) loginButton.dataset.ready = "1";

// Mantém o listener ativo mesmo enquanto o painel principal termina de carregar.
// app.js substituirá estes callbacks quando estiver pronto.
setAuthCallbacks({
  onReady: () => {
    window.__AF_AUTH_READY = true;
    window.__AF_AUTH_DENIED = null;
  },
  onDenied: (reason) => {
    window.__AF_AUTH_READY = false;
    window.__AF_AUTH_DENIED = reason || "not_active";
  },
  onLogout: () => {
    window.__AF_AUTH_READY = false;
    window.__AF_AUTH_DENIED = null;
  }
});
startAuthListener();

// Se a sessão já estava autenticada, informa ao app.js que deve abrir o painel.
if (session.ready) window.__AF_AUTH_READY = true;
