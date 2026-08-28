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
import { renderCallView, bindCallControls, stopMedia } from "./call.js";
import { bindTeleprompterUI, closeTeleprompter } from "./teleprompter.js";
import { renderComplementarHome, renderComplementarApp } from "./complementar.js";

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

function profileData() {
  try {
    const raw = localStorage.getItem("afplataforma_v1_profile_" + (session.uid || "anon"));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function applyProfileUI() {
  const p = profileData();
  const name = p.name || session.name || "—";
  const elN = document.getElementById("userName");
  const elR = document.getElementById("userRole");
  if (elN) elN.textContent = name;
  if (elR) elR.textContent = session.role || "—";
  const av = document.getElementById("userAv");
  if (av) {
    if (p.photo) {
      av.style.backgroundImage = "url(" + p.photo + ")";
      av.style.backgroundSize = "cover";
      av.textContent = "";
    } else {
      av.style.backgroundImage = "";
      av.textContent = String(name).charAt(0).toUpperCase();
    }
  }
}

function showApp() {
  document.getElementById("authShell")?.classList.add("hidden");
  document.getElementById("accessDenied")?.classList.remove("show");
  document.getElementById("appShell")?.classList.add("show");
  applyProfileUI();
  const badge = document.getElementById("modeBadge");
  if (badge) {
    badge.textContent = session.mode === "firebase" ? "Firebase" : "MVP local";
    badge.className = "badge-mode" + (session.mode === "firebase" ? " live" : "");
  }
  const langSel = document.getElementById("langSel");
  if (langSel) langSel.value = session.lang || "pt-BR";
  buildNav();
  navigate("dashboard");
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
    <img class="hero-photo" src="assets/img/auth/dashboard-bg.jpg" alt="">
    <p class="hero-line">Alinhamento Financeiro</p>
    <h2 class="hero-title">${esc(t(lang, "welcome"))}</h2>
    <p class="hero-sub">${esc(session.name)} · ${session.role === "mentee" ? "Mentorado" : "Mentor"} · acesso ${session.active ? "ativo" : "pendente"}</p>
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
    <p class="hero-line">Conteúdo</p>
    <h2 class="hero-title">7 módulos · 21 materiais</h2>
    <p class="hero-sub">Conteúdo em HTML. PDFs externos no WhatsApp.</p>
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
    <p class="hero-line">Camada ${m.num}</p>
    <h2 class="hero-title">${esc(m.title)}</h2>
    <p class="hero-sub">${esc(m.subtitle)}</p>
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
    <p class="hero-sub">Liberação no Firestore: <code>afAccess/{uid}</code> com approved, active e modules.</p>
    <div class="mentor-hero">
      <img src="assets/img/mentor/yan.jpg" alt="Mentor">
      <div>
        <div class="lbl">Mentor</div>
        <h3 class="mentor-name">Yan · Akasha Hub</h3>
        <p class="notes-hint">Foto do painel. Pode ser trocada no próximo ciclo se você enviar outro arquivo.</p>
      </div>
    </div>
    <div class="stat-card" style="max-width:480px">
      <div class="lbl">Operação</div>
      <div class="hint" style="margin-top:10px;line-height:1.8">
        1. Aluno entra com e-mail ou Google<br>
        2. Você cria <strong>afAccess/{uid do aluno}</strong><br>
        3. approved: true · active: true · module01: true…<br>
        4. Roteiros privados: <strong>afMentorScripts/module01</strong><br>
        &nbsp;&nbsp;&nbsp;{ title, content, duration }
      </div>
    </div>
  </div>`;
}

function renderProfile() {
  const p = profileData();
  const name = p.name || session.name || "";
  const photo = p.photo || "";
  return `<div class="view active">
    <p class="hero-line">Conta</p>
    <h2 class="hero-title">Perfil</h2>
    <p class="hero-sub">${esc(session.email)} · ${esc(session.role)} · ${esc(session.mode)}</p>
    <div class="profile-edit">
      <div class="profile-av-wrap">
        <div class="profile-av" id="profileAvPreview" ${photo ? `style="background-image:url('${photo}')"` : ""}>${photo ? "" : esc((name || "A").charAt(0).toUpperCase())}</div>
        <label class="tool-btn">Trocar foto<input type="file" id="profPhoto" accept="image/*" hidden></label>
      </div>
      <div class="field"><label>Nome de exibição</label><input id="profName" value="${esc(name)}" placeholder="Seu nome"></div>
      <div class="field"><label>Cidade</label><input id="profCity" value="${esc(p.city || "")}" placeholder="Cidade"></div>
      <div class="field"><label>Instagram</label><input id="profIg" value="${esc(p.ig || "")}" placeholder="@usuario"></div>
      <div class="field"><label>WhatsApp</label><input id="profWpp" value="${esc(p.wpp || "")}" placeholder="71 9xxxx-xxxx"></div>
      <div class="field"><label>Uma linha de posicionamento</label><input id="profBio" value="${esc(p.bio || "")}" placeholder="Ex: mentorado AF · operação em andamento"></div>
      <button class="btn" type="button" id="btnSaveProfile">Salvar perfil</button>
      <p class="notes-hint">Foto e nome ficam neste aparelho (localStorage). Sugestão próxima camada: sincronizar no Firestore em afProfiles/{uid}.</p>
    </div>
    <div class="stat-card" style="max-width:400px;margin-top:18px">
      <div class="lbl">Acesso</div>
      <div class="hint" style="margin-top:8px;line-height:1.7">
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
  if (view === "call") bindCallControls(navigate);
  if (view === "profile") bindProfileEdit();
});

function bindProfileEdit() {
  const file = document.getElementById("profPhoto");
  file?.addEventListener("change", () => {
    const f = file.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        const max = 360;
        const scale = Math.min(max / img.width, max / img.height, 1);
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        const data = c.toDataURL("image/jpeg", 0.78);
        window._profPhoto = data;
        const prev = document.getElementById("profileAvPreview");
        if (prev) {
          prev.style.backgroundImage = "url(" + data + ")";
          prev.style.backgroundSize = "cover";
          prev.textContent = "";
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(f);
  });
  document.getElementById("btnSaveProfile")?.addEventListener("click", () => {
    const cur = profileData();
    const next = {
      name: document.getElementById("profName")?.value.trim() || session.name,
      city: document.getElementById("profCity")?.value.trim() || "",
      ig: document.getElementById("profIg")?.value.trim() || "",
      wpp: document.getElementById("profWpp")?.value.trim() || "",
      bio: document.getElementById("profBio")?.value.trim() || "",
      photo: window._profPhoto || cur.photo || ""
    };
    localStorage.setItem("afplataforma_v1_profile_" + (session.uid || "anon"), JSON.stringify(next));
    if (next.name) session.name = next.name;
    applyProfileUI();
    toast("Perfil salvo neste aparelho");
  });
}

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
  const demoWrap = document.getElementById("demoButtons");
  if (demoWrap) demoWrap.style.display = DEV_MODE ? "block" : "none";

  document.getElementById("btnLogin")?.addEventListener("click", onLoginEmail);
  document.getElementById("btnGoogle")?.addEventListener("click", onLoginGoogle);
  document.getElementById("loginPass")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") onLoginEmail();
  });
  document.getElementById("btnDemoMentor")?.addEventListener("click", () => enterDemo("mentor"));
  document.getElementById("btnDemoMentee")?.addEventListener("click", () => enterDemo("mentee"));
  document.getElementById("btnLogout")?.addEventListener("click", async () => {
    stopMedia();
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

  setAuthCallbacks({
    onReady: () => showApp(),
    onDenied: () => showAccessDenied(),
    onLogout: () => showAuth()
  });

  startAuthListener();
}

init();
