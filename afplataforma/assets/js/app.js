/**
 * AF Plataforma — orquestrador
 */
import { DEV_MODE } from "../../firebase/firebase-config.js";
import {
  session,
  setAuthCallbacks,
  startAuthListener,
  loginEmail,
  loginGoogle,
  logout,
  enterDemo,
  isMentorSession
} from "./auth.js";
import {
  buildNav,
  navigate,
  openSide,
  closeSide,
  setLang,
  unlockedCount,
  nextModule,
  registerRenderers,
  onAfterNavigate,
  esc
} from "./navigation.js";
import { MODULES } from "../../data/modules.js";
import { t } from "../../data/translations.js";
import { renderToolsView, openTool, closeToolsModal, bindToolPanelUI } from "./tools.js";
import { renderCallView, bindCallControls, stopMedia, leaveCall } from "./call.js";
import { startPresence, stopPresence } from "./presence.js";
import { bindTeleprompterUI, closeTeleprompter } from "./teleprompter.js";
import { renderComplementarHome, renderComplementarApp } from "./complementar.js";
import { bindLifeOsLayer } from "./lifeos-layer.js";
import { Store } from "./storage.js";
import { pageHead, bindCoverEditor, handleCoverClick, pickNewProductImage } from "./covers.js";
import { renderAccessAdminPanel, bindAccessAdmin } from "./access-admin.js";

function toast(msg, err = false) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast show" + (err ? " err" : "");
  clearTimeout(window._tt);
  window._tt = setTimeout(() => (el.className = "toast"), 2800);
}

function showAuth() {
  document.getElementById("authShell")?.classList.remove("hidden");
  document.getElementById("appShell")?.classList.remove("show");
  document.getElementById("accessDenied")?.classList.remove("show");
  const msg = document.getElementById("authMsg");
  if (msg) {
    msg.textContent = "";
    msg.className = "auth-msg";
  }
}

function showApp() {
  document.getElementById("authShell")?.classList.add("hidden");
  document.getElementById("accessDenied")?.classList.remove("show");
  document.getElementById("appShell")?.classList.add("show");
  document.getElementById("userName").textContent = session.name || "—";
  document.getElementById("userRole").textContent = session.role || "—";
  const av = document.getElementById("userAv");
  const prof = Store.getProfile(session.uid);
  const photo = prof?.photo || (session.role === "mentor" ? "assets/img/mentor/yan.jpg" : "");
  if (av) {
    if (photo) {
      av.style.backgroundImage = `url(${photo})`;
      av.style.backgroundSize = "cover";
      av.textContent = "";
    } else {
      av.style.backgroundImage = "";
      av.textContent = (session.name || "A").charAt(0).toUpperCase();
    }
  }
  const badge = document.getElementById("modeBadge");
  if (badge) {
    badge.textContent = session.mode === "firebase" ? "Firebase" : "MVP local";
    badge.className = "badge-mode" + (session.mode === "firebase" ? " live" : "");
  }
  const langSel = document.getElementById("langSel");
  if (langSel) langSel.value = session.lang || "pt-BR";
  buildNav();
  startPresence();
  if (location.hash.indexOf("treino") >= 0) navigate("comp:treino");
  else if (location.hash.indexOf("loja") >= 0) navigate("comp:loja");
  else navigate("dashboard");
}

function showAccessDenied() {
  document.getElementById("authShell")?.classList.add("hidden");
  document.getElementById("appShell")?.classList.remove("show");
  document.getElementById("accessDenied")?.classList.add("show");
}

function openModal(title, body, foot) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalBody").innerHTML = body;
  document.getElementById("modalFoot").innerHTML = foot || "";
  document.getElementById("overlay")?.classList.add("open");
  document.getElementById("modalBox")?.classList.add("open");
}

function closeModals() {
  closeToolsModal();
  document.getElementById("modalBox")?.classList.remove("open");
  document.getElementById("overlay")?.classList.remove("open");
}

function showLocked() {
  const lang = session.lang || "pt-BR";
  openModal(
    t(lang, "locked"),
    `<p style="color:var(--muted);line-height:1.6">${esc(t(lang, "locked"))}</p>`,
    `<button class="btn btn-inline" type="button" id="btnLockedOk">Entendi</button>`
  );
  document.getElementById("btnLockedOk")?.addEventListener("click", closeModals);
}

function renderDashboard() {
  const lang = session.lang || "pt-BR";
  const u = unlockedCount();
  const next = nextModule();
  return `
  <div class="view active">
    ${pageHead("dash", "Alinhamento Financeiro", esc(t(lang, "welcome")), esc(session.name) + " · " + (session.role === "mentee" ? "Mentorado" : "Mentor"))}
    <div class="grid-3">
      <div class="stat-card"><div class="lbl">${esc(t(lang, "progress"))}</div><div class="val">${u}/7</div><div class="hint">módulos liberados</div></div>
      <div class="stat-card"><div class="lbl">Materiais</div><div class="val">${u * 3}/21</div><div class="hint">estimativa por liberação</div></div>
      <div class="stat-card"><div class="lbl">${esc(t(lang, "next"))}</div><div class="val" style="font-size:1.1rem;padding-top:8px">${next ? esc(next.num + " · " + next.title.split(" ")[0]) : "Completo"}</div><div class="hint">${next ? esc(next.title) : "—"}</div></div>
    </div>
    <h3 class="section-h">Jornada das 7 camadas</h3>
    <div class="module-list">
      ${MODULES.map((m) => {
        const open = !!session.modules[m.id];
        return `<div class="mod-row ${open ? "" : "locked"}" data-nav="${open ? "module:" + m.id : ""}" ${open ? "" : "data-locked=\"1\""}>
          <div class="mod-num">${m.num}</div>
          <div class="mod-body"><h3>${esc(m.title)}</h3><p>${esc(m.subtitle)}</p></div>
          <div class="mod-lock">${open ? "🔓" : "🔒"}</div>
        </div>`;
      }).join("")}
    </div>
  </div>`;
}

function renderModules() {
  return `<div class="view active">
    ${pageHead("modules", "Conteúdo", "7 módulos · 21 materiais", "Conteúdo em HTML. PDFs externos no WhatsApp.")}
    <div class="module-list">${MODULES.map((m) => {
      const open = !!session.modules[m.id];
      return `<div class="mod-row ${open ? "" : "locked"}" data-nav="${open ? "module:" + m.id : ""}" ${open ? "" : "data-locked=\"1\""}>
        <div class="mod-num">${m.num}</div>
        <div class="mod-body"><h3>${esc(m.title)}</h3><p>${m.materials.length} materiais · ${m.tools.length} ferramenta(s)</p></div>
        <div class="mod-lock">${open ? "🔓" : "🔒"}</div>
      </div>`;
    }).join("")}</div>
  </div>`;
}

function renderModuleDetail(id) {
  const m = MODULES.find((x) => x.id === id);
  if (!m || !session.modules[id]) return renderModules();
  return `<div class="view active">
    <div class="back-link" data-nav="modules">← Módulos</div>
    ${pageHead(m.id, "Camada " + m.num, esc(m.title), esc(m.subtitle))}
    <h3 class="section-h">Materiais</h3>
    <div class="mat-grid">${m.materials
      .map((mat) => `<div class="mat-card"><h4>${esc(mat.title)}</h4><p>${esc(mat.body)}</p></div>`)
      .join("")}</div>
    <h3 class="section-h">Ferramentas</h3>
    ${m.tools.map((tid) => `<button class="tool-btn" type="button" data-tool="${tid}">Abrir ferramenta · ${esc(tid)}</button> `).join("")}
    <h3 class="section-h">Preparação para call</h3>
    <p style="color:var(--muted);font-size:13px;line-height:1.6;margin-bottom:12px">Revise o diagnóstico e leve 1 pergunta objetiva.</p>
    <button class="tool-btn" type="button" data-nav="call">Ir para Call</button>
  </div>`;
}

function renderMentor() {
  if (!isMentorSession()) {
    return `<div class="view active"><p class="empty">Acesso restrito ao mentor.</p></div>`;
  }
  return `<div class="view active">
    <p class="hero-line">Controle</p>
    <h2 class="hero-title">Dashboard do mentor</h2>
    <div class="mentor-head">
      <img src="assets/img/mentor/yan.jpg" alt="Yan · Mentor" class="mentor-photo">
      <div>
        <p class="hero-sub" style="margin:0">Yan Filipe · Engenheiro de performance sistêmica</p>
        <p class="notes-hint">Liberação no Firestore: afAccess/{uid} com approved, active e modules.</p>
      </div>
    </div>
    <div class="stat-card" style="max-width:480px">
      <div class="lbl">Operação</div>
      <div class="hint" style="margin-top:10px;line-height:1.8">
        1. Aluno entra com e-mail ou Google<br>
        2. Você cria <strong>afAccess/{uid do aluno}</strong><br>
        3. approved: true · active: true · module01: true…<br>
        4. Roteiros privados: <strong>afMentorScripts/module01</strong><br>
        &nbsp;&nbsp;&nbsp;{ title, content, duration }<br>
        5. Gestão de acessos abaixo — Firestore afAccess. Interface apenas; rules no Firebase.
      </div>
    </div>
    ${renderAccessAdminPanel()}
  </div>`;
}

function renderProfile() {
  const prof = Store.getProfile(session.uid) || {};
  const name = prof.name || session.name || "";
  const photo = prof.photo || (session.role === "mentor" ? "assets/img/mentor/yan.jpg" : "");
  return `<div class="view active">
    ${pageHead("profile", "Conta", "Perfil", esc(session.email) + " · " + esc(session.role))}
    <div class="stat-card" style="max-width:440px">
      ${photo ? `<img src="${esc(photo)}" alt="" class="mentor-photo" style="margin-bottom:12px">` : ""}
      <div class="field"><label>Nome de exibição</label><input id="pfName" value="${esc(name)}"></div>
      <div class="field"><label>URL da foto (Cloudinary / img)</label><input id="pfPhoto" value="${esc(photo)}" placeholder="https://…"></div>
      <button class="tool-btn" type="button" id="btnSaveProfile">Salvar perfil</button>
      <div class="hint" style="margin-top:12px;line-height:1.7">
        approved: ${session.approved ? "sim" : "não"}<br>
        active: ${session.active ? "sim" : "não"}<br>
        módulos: ${unlockedCount()}/7<br>
        uid: ${esc(session.uid)}
      </div>
    </div>
  </div>`;
}

registerRenderers({
  dashboard: renderDashboard,
  modules: renderModules,
  moduleDetail: renderModuleDetail,
  tools: renderToolsView,
  call: renderCallView,
  mentor: renderMentor,
  profile: renderProfile,
  complementar: renderComplementarHome,
  compApp: renderComplementarApp,
  showLocked,
  openTool
});

onAfterNavigate((view) => {
  document.getElementById("btnAddProd")?.addEventListener("click", pickNewProductImage);
  if (view === "mentor") bindAccessAdmin();
  if (view === "call") bindCallControls(navigate);
  if (view === "profile") {
    document.getElementById("btnSaveProfile")?.addEventListener("click", () => {
      const name = document.getElementById("pfName")?.value?.trim() || session.name;
      const photo = document.getElementById("pfPhoto")?.value?.trim() || "";
      Store.setProfile(session.uid, { name, photo });
      session.name = name;
      document.getElementById("userName").textContent = name;
      const av = document.getElementById("userAv");
      if (av && photo) {
        av.style.backgroundImage = `url(${photo})`;
        av.style.backgroundSize = "cover";
        av.textContent = "";
      }
      toast("Perfil salvo");
    });
  }
});

async function onLoginEmail() {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPass").value;
  const msg = document.getElementById("authMsg");
  if (!email || !pass) {
    msg.className = "auth-msg err";
    msg.textContent = "Preencha e-mail e senha.";
    return;
  }
  msg.className = "auth-msg";
  msg.textContent = "Conectando…";
  document.getElementById("btnLogin").disabled = true;
  try {
    await loginEmail(email, pass);
  } catch (e) {
    msg.className = "auth-msg err";
    msg.textContent = e.code || e.message || "Falha no login";
  } finally {
    document.getElementById("btnLogin").disabled = false;
  }
}

async function onLoginGoogle() {
  const msg = document.getElementById("authMsg");
  msg.className = "auth-msg";
  msg.textContent = "Abrindo Google…";
  document.getElementById("btnGoogle").disabled = true;
  try {
    await loginGoogle();
  } catch (e) {
    msg.className = "auth-msg err";
    if (e.code === "auth/popup-closed-by-user") msg.textContent = "Popup fechado.";
    else if (e.code === "auth/unauthorized-domain") msg.textContent = "Domínio não autorizado no Firebase Auth.";
    else msg.textContent = e.code || e.message || "Falha Google";
  } finally {
    document.getElementById("btnGoogle").disabled = false;
  }
}

function init() {
  bindCoverEditor();
  document.addEventListener("click", (e) => handleCoverClick(e), true);
  document.addEventListener("af-covers-changed", () => navigate(window.__afView || "dashboard"));
  const demoWrap = document.getElementById("demoButtons");
  const demoQ = new URLSearchParams(location.search).get("demo");
  if (demoWrap) demoWrap.style.display = DEV_MODE || demoQ ? "block" : "none";

  document.getElementById("btnLogin")?.addEventListener("click", onLoginEmail);
  document.getElementById("btnGoogle")?.addEventListener("click", onLoginGoogle);
  document.getElementById("loginPass")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") onLoginEmail();
  });
  document.getElementById("btnDemoMentor")?.addEventListener("click", () => enterDemo("mentor"));
  document.getElementById("btnDemoMentee")?.addEventListener("click", () => enterDemo("mentee"));
  document.getElementById("btnLogout")?.addEventListener("click", async () => {
    await leaveCall();
    stopMedia();
    await stopPresence();
    closeTeleprompter();
    await logout();
  });
  document.getElementById("btnDeniedBack")?.addEventListener("click", async () => {
    await logout();
    showAuth();
  });
  document.getElementById("menuToggle")?.addEventListener("click", openSide);
  document.getElementById("sideBackdrop")?.addEventListener("click", closeSide);
  document.getElementById("langSel")?.addEventListener("change", (e) => setLang(e.target.value));
  document.getElementById("overlay")?.addEventListener("click", closeModals);
  document.getElementById("modalX")?.addEventListener("click", closeModals);

  bindTeleprompterUI();
  bindToolPanelUI();
  bindLifeOsLayer();

  setAuthCallbacks({
    onReady: () => showApp(),
    onDenied: () => showAccessDenied(),
    onLogout: () => showAuth()
  });

  startAuthListener();
  const auto = new URLSearchParams(location.search).get("demo");
  if (auto === "mentor" || auto === "mentee") {
    setTimeout(() => enterDemo(auto), 80);
  }
}

init();
