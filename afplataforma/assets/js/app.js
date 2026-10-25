/**
 * AF Plataforma - orquestrador
 */
import { isDemoEnabled } from "../../firebase/firebase-config.js";
import {
  session,
  setAuthCallbacks,
  startAuthListener,
  loginEmail,
  loginGoogle,
  resetPassword,
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
  getCurrentView,
  esc
} from "./navigation.js?v=rt46";
import { MODULES } from "../../data/modules.js";
import { getUserProfile, saveUserProfile } from "../../firebase/firestore.js";
import { t } from "../../data/translations.js";
import { renderToolsView, openTool, closeToolsModal, bindToolPanelUI } from "./tools.js?v=rt48";
import { renderCallView, bindCallControls, forceStopMedia, bindPersistentCallUI, onCallNavigate } from "./call.js?v=ux1";
import { startPresence, stopPresence } from "./presence.js";
import { bindTeleprompterUI, closeTeleprompter } from "./teleprompter.js";
import { renderComplementarHome, renderComplementarApp } from "./complementar.js";
import { renderAccessAdminPanel, bindAccessAdmin } from "./access-admin.js?v=rt14";
import { renderSessoesAccess, bindSessoesAccess } from "./sessoes-access.js?v=1";
import { renderQuitei, bindQuitei } from "./quitei.js";
import { bindMaterialViewer } from "./materials.js";
import { bindMediaUI, hydrateMedia } from "./media.js";
import { bindCoverEditor, pickNewProductImage, pageHead } from "./covers.js?v=rt40";
import { bindLifeOsLayer, viewMetas, viewSono } from "./lifeos-layer.js?v=rt5";
import { renderFase1, renderFase2, renderFase3, renderFase4, renderFase5, renderFase1Jogo, bindFase1Jogo, renderFase1Marca, bindFase1Marca, renderFase1Dossie, bindFase1Dossie, renderFase2Oferta, bindFase2Oferta, renderFase2Ativos, bindFase2Ativos, renderFase3Preco, bindFase3Preco, renderFase4Sdr, renderFase4Treinamento, renderFase4Closers, renderFase4Depende, bindFase4Depende, renderFase4Divulga, bindFase4Divulga, renderFase5Livro, bindFase5Livro } from "./fases.js?v=rt46";
import { bindPhaseChecklist, hydratePhaseChecklists } from "./phase-checklists.js?v=rt46";
import { renderMindMaps, bindMindMaps, hydrateMindMaps } from "./mindmaps.js?v=rt46";
import { enhanceArchitectureView } from "./architecture-enhancements.js?v=rt46";
import {
  renderLegadoPlanos,
  renderLegadoContrato,
  renderLegadoRegras,
  renderLegadoDossie,
  bindLegadoDossie,
  renderLegadoOquee,
  renderLegadoDirecao,
  renderLegadoPitch,
  renderLegadoTcc,
  renderLegadoSlides,
  renderConteudosAl
} from "./legado-mentor.js?v=rt25";
import { renderAudiosPnl, bindAudiosPnl } from "./audios-pnl.js?v=rt23";
import { renderProducaoAudiosPnl, bindProducaoAudiosPnl } from "./producao-audios-pnl.js?v=1";
import { renderVendasCurso } from "./vendas-curso.js?v=1";
import { renderLifeOsDashboard, bindLifeOsDashboard } from "./lifeos-dashboard.js?v=rt47";
import { renderArquiteturaLegado, bindArquiteturaLegado } from "./arquitetura-legado.js?v=rt46";

function toast(msg, err = false) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast show" + (err ? " err" : "");
  clearTimeout(window._tt);
  window._tt = setTimeout(() => (el.className = "toast"), 2800);
}

function showAuth() {
  document.documentElement.classList.remove("quicktool-start");
  document.getElementById("authShell")?.classList.remove("hidden");
  document.getElementById("appShell")?.classList.remove("show");
  document.getElementById("accessDenied")?.classList.remove("show");
  const msg = document.getElementById("authMsg");
  if (msg) {
    msg.textContent = "";
    msg.className = "auth-msg";
  }
}

function profileStorageKey() {
  return "afplataforma_v1_profile_" + (session.uid || "anon");
}

function profileData() {
  try {
    const raw = localStorage.getItem(profileStorageKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function cacheProfileLocally(profile) {
  try {
    localStorage.setItem(profileStorageKey(), JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

let profilePhotoDraft = null;


function applyProfileUI(profileOverride = null) {
  const p = profileOverride || profileData();
  const name = p.name || session.name || "-";
  const elN = document.getElementById("userName");
  const elR = document.getElementById("userRole");
  if (elN) elN.textContent = name;
  if (elR) elR.textContent = session.role || "-";
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

function populateProfileForm(root, profile) {
  const fields = {
    profName: profile.name || "",
    profCity: profile.city || "",
    profIg: profile.ig || "",
    profWpp: profile.wpp || "",
    profBio: profile.bio || ""
  };
  Object.entries(fields).forEach(([id, value]) => {
    const field = root.querySelector("#" + id);
    if (field) field.value = value;
  });
  const preview = root.querySelector("#profileAvPreview");
  if (preview) {
    if (profile.photo) {
      preview.style.backgroundImage = "url(" + profile.photo + ")";
      preview.style.backgroundSize = "cover";
      preview.textContent = "";
    } else {
      preview.style.backgroundImage = "";
      preview.textContent = String(profile.name || session.name || "A").charAt(0).toUpperCase();
    }
  }
}

function compressProfilePhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file || !String(file.type || "").startsWith("image/")) {
      reject(new Error("Escolha um arquivo de imagem."));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error("A imagem precisa ter menos de 10 MB."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não consegui ler essa imagem."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Esse arquivo não parece ser uma imagem válida."));
      img.onload = () => {
        const maxSide = 380;
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        const scale = Math.min(1, maxSide / Math.max(width, height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não consegui preparar a imagem."));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let data = canvas.toDataURL("image/webp", 0.7);
        if (!data.startsWith("data:image/webp")) data = canvas.toDataURL("image/jpeg", 0.66);
        if (data.length > 190000) {
          canvas.width = Math.max(1, Math.round(canvas.width * 0.8));
          canvas.height = Math.max(1, Math.round(canvas.height * 0.8));
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          data = canvas.toDataURL("image/jpeg", 0.55);
        }
        if (data.length > 190000) {
          reject(new Error("A imagem continuou muito grande após a compressão. Escolha outra foto."));
          return;
        }
        resolve(data);
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });
}

async function refreshProfileCacheFromCloud() {
  if (session.mode !== "firebase" || !session.uid) return;
  try {
    const profile = await getUserProfile(session.uid);
    if (profile) {
      cacheProfileLocally(profile);
      applyProfileUI(profile);
    }
  } catch (error) {
    console.warn("[AF perfil] Não consegui carregar o perfil da nuvem:", error?.code || error?.message || error);
  }
}

function bindProfileForm() {
  const root = document.getElementById("content");
  const button = root?.querySelector("#btnSaveProfile");
  if (!root || !button || button.dataset.bound === "1") return;
  button.dataset.bound = "1";
  const status = root.querySelector("#profileStatus");
  const photoInput = root.querySelector("#profPhoto");
  profilePhotoDraft = null;

  photoInput?.addEventListener("change", async () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    photoInput.disabled = true;
    if (status) status.textContent = "Preparando a foto...";
    try {
      profilePhotoDraft = await compressProfilePhoto(file);
      const preview = root.querySelector("#profileAvPreview");
      if (preview) {
        preview.style.backgroundImage = "url(" + profilePhotoDraft + ")";
        preview.style.backgroundSize = "cover";
        preview.textContent = "";
      }
      if (status) status.textContent = "Foto preparada. Salve o perfil para aplicar.";
    } catch (error) {
      if (status) status.textContent = error?.message || "Não consegui preparar a foto.";
      photoInput.value = "";
    } finally {
      photoInput.disabled = false;
    }
  });

  button.addEventListener("click", async () => {
    const profile = {
      name: String(root.querySelector("#profName")?.value || "").trim().slice(0, 100),
      city: String(root.querySelector("#profCity")?.value || "").trim().slice(0, 100),
      ig: String(root.querySelector("#profIg")?.value || "").trim().slice(0, 100),
      wpp: String(root.querySelector("#profWpp")?.value || "").trim().slice(0, 40),
      bio: String(root.querySelector("#profBio")?.value || "").trim().slice(0, 240),
      photo: profilePhotoDraft !== null ? profilePhotoDraft : (profileData().photo || "")
    };
    if (!profile.name) {
      if (status) status.textContent = "Digite seu nome de exibição antes de salvar.";
      root.querySelector("#profName")?.focus();
      return;
    }

    const locallySaved = cacheProfileLocally(profile);
    button.disabled = true;
    button.textContent = "Salvando...";
    if (status) status.textContent = "Salvando seu perfil...";
    try {
      if (session.mode === "firebase" && session.uid) {
        await saveUserProfile(session.uid, profile);
        if (status) status.textContent = "Perfil salvo e sincronizado na sua conta.";
      } else if (locallySaved) {
        if (status) status.textContent = "Perfil salvo neste navegador. Entre com sua conta para sincronizar entre dispositivos.";
      } else {
        if (status) status.textContent = "Não consegui salvar o perfil neste navegador.";
      }
      applyProfileUI(profile);
    } catch (error) {
      console.warn("[AF perfil] A sincronização falhou:", error?.code || error?.message || error);
      if (status) status.textContent = locallySaved
        ? "Rascunho salvo neste navegador, mas a sincronização falhou. Tente novamente."
        : "Não consegui salvar o perfil. Verifique sua conexão e tente novamente.";
      applyProfileUI(profile);
    } finally {
      button.disabled = false;
      button.textContent = "Salvar perfil";
    }
  });

  if (session.mode === "firebase" && session.uid) {
    const controls = Array.from(root.querySelectorAll("#profileEdit input, #btnSaveProfile"));
    controls.forEach((control) => { control.disabled = true; });
    if (status) status.textContent = "Carregando perfil da sua conta...";
    getUserProfile(session.uid).then((remote) => {
      if (!root.contains(button) || !remote) return;
      profilePhotoDraft = null;
      cacheProfileLocally(remote);
      populateProfileForm(root, remote);
      applyProfileUI(remote);
      if (status) status.textContent = "Perfil carregado da sua conta.";
    }).catch((error) => {
      console.warn("[AF perfil] Não consegui carregar o perfil:", error?.code || error?.message || error);
      if (root.contains(button) && status) status.textContent = "Não consegui carregar o perfil da nuvem. Você ainda pode editar e tentar salvar.";
    }).finally(() => {
      if (root.contains(button)) controls.forEach((control) => { control.disabled = false; });
    });
  } else if (status) {
    status.textContent = "Modo local: seu perfil fica salvo somente neste navegador.";
  }
}

function showApp() {
  document.documentElement.classList.remove("quicktool-start");
  document.getElementById("authShell")?.classList.add("hidden");
  document.getElementById("accessDenied")?.classList.remove("show");
  document.getElementById("appShell")?.classList.add("show");
  applyProfileUI();
  refreshProfileCacheFromCloud();
  hydrateMedia();
  const badge = document.getElementById("modeBadge");
  if (badge) badge.hidden = true;
  const langSel = document.getElementById("langSel");
  if (langSel) langSel.value = session.lang || "pt-BR";
  buildNav();
  bindPersistentCallUI(navigate);
  startPresence();
  const room = (location.hash || "").replace("#", "");
  const rooms = ["criancas", "criancas-pais", "criancas-sala", "empresas"];
  const params = new URLSearchParams(location.search);
  const quickTool = params.get("quicktool");
  const quickTools = ["cashflow", "ideation", "network", "vision", "pitch", "legacy", "execution", "fono"];
  if (quickTools.includes(quickTool)) {
    navigate("dashboard");
    requestAnimationFrame(() => openTool(quickTool));
  } else if (quickTool === "metas" || quickTool === "sono") {
    navigate(quickTool);
  } else {
    navigate(quickTool === "tasks" ? "dashboard" : (rooms.includes(room) ? room : "dashboard"));
    if (quickTool === "tasks") window.setTimeout(() => document.getElementById("lifeosNewTask")?.focus(), 550);
  }
}

function showAccessDenied() {
  // Acesso às ferramentas via atalho: se a gestão do mentor não liberou
  // a conta para a AF Plataforma, encaminha para Arquitetura de Legado.
  const params = new URLSearchParams(location.search);
  const requestedTool = params.get("quicktool");
  if (requestedTool) {
    location.replace("/al");
    return;
  }
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
  const primeiroLiberado = MODULES.find((m) => session.modules[m.id]) || null;
  const materiaisLiberados = MODULES.reduce(
    (total, m) => total + (session.modules[m.id] ? (m.materials || []).length : 0),
    0
  );
  const totalMateriais = MODULES.reduce((total, m) => total + (m.materials || []).length, 0);
  return `
  <div class="view active">
    ${pageHead("dash", "Alinhamento Financeiro", esc(t(lang, "welcome")), `${esc(session.name)} · ${session.role === "mentee" ? "Mentorado" : "Mentor"} · acesso ${session.active ? "ativo" : "pendente"}`)}
    <div class="grid-3">
      <div class="stat-card"><div class="lbl">Acessos à trilha</div><div class="val">${u}/${MODULES.length}</div><div class="hint">módulos liberados para sua conta</div></div>
      <div class="stat-card"><div class="lbl">Materiais disponíveis</div><div class="val">${materiaisLiberados}/${totalMateriais}</div><div class="hint">materiais vinculados aos módulos liberados</div></div>
      <div class="stat-card"><div class="lbl">Próxima liberação</div><div class="val" style="font-size:.96rem;line-height:1.4;padding-top:8px">${next ? esc(next.num + " · " + next.title) : "Trilha liberada"}</div><div class="hint">${next ? "Alinhe a liberação deste conteúdo com seu mentor." : "Todos os módulos estão liberados para sua conta."}</div></div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 22px">
      <button class="tool-btn primary" type="button" data-nav="${primeiroLiberado ? "module:" + primeiroLiberado.id : "call"}">${primeiroLiberado ? "Abrir módulo " + esc(primeiroLiberado.num) : "Alinhar ponto de partida"}</button>
      <button class="tool-btn" type="button" data-nav="modules">Ver trilha completa</button>
      <button class="tool-btn" type="button" data-nav="call">Abrir encontro</button>
    </div>
    <h3 class="section-h">Jornada das 7 camadas</h3>
    <div class="module-list">
      ${MODULES.map((m) => {
        const open = !!session.modules[m.id];
        return `<div class="mod-row ${open ? "" : "locked"}" data-nav="${open ? "module:" + m.id : ""}" ${open ? "" : "data-locked=\"1\""}>
          <div class="mod-num">${m.num}</div>
          <div class="mod-body"><h3>${esc(m.title)}</h3><p>${esc(m.archetype)} · ${esc(m.chakra)}</p><p>${esc(m.subtitle)}</p></div>
          <div class="mod-lock">${open ? "🔓" : "🔒"}</div>
        </div>`;
      }).join("")}
    </div>
  </div>`;
}

function renderModules() {
  return `<div class="view active">
    ${pageHead("modules", "Conteúdo", "7 módulos · 21 materiais", "Material completo em PDF, lido na própria plataforma.")}
    <div class="module-list">${MODULES.map((m) => {
      const open = !!session.modules[m.id];
      return `<div class="mod-row ${open ? "" : "locked"}" data-nav="${open ? "module:" + m.id : ""}" ${open ? "" : "data-locked=\"1\""}>
        <div class="mod-num">${m.num}</div>
        <div class="mod-body"><h3>${esc(m.title)}</h3><p>${esc(m.archetype)} · ${esc(m.chakra)}</p><p>${m.materials.length} materiais · ${m.tools.length} ferramenta(s)</p></div>
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
    <p class="hero-line">Camada ${m.num} · ${esc(m.archetype)}</p>
    <h2 class="hero-title">${esc(m.title)}</h2>
    <p class="hero-sub">${esc(m.chakra)} · ${esc(m.subtitle)}</p>
    <article class="af-asc-card" style="margin:12px 0 18px"><p class="lvl">Como incorporar</p><p>${esc(m.cena)}</p></article>
    <h3 class="section-h">Materiais</h3>
    <div class="mat-grid">${m.materials
      .map(
        (mat) => `<div class="mat-card">
      <h4>${esc(mat.title)}</h4>
      <p>${esc(mat.body)}</p>
      ${
        mat.pdf
          ? `<button class="tool-btn mat-open-btn" type="button" data-open-pdf="${esc(mat.pdf)}" data-pdf-title="${esc(mat.title)}">Abrir material</button>`
          : ""
      }
    </div>`
      )
      .join("")}</div>
    <h3 class="section-h">Ferramentas</h3>
    ${m.tools.map((tid) => `<button class="tool-btn" type="button" data-tool="${tid}">Abrir ferramenta · ${esc(tid)}</button> `).join("")}
    <h3 class="section-h">Preparação para call</h3>
    <p style="color:var(--muted);font-size:13px;line-height:1.6;margin-bottom:12px">Revise o diagnóstico e leve 1 pergunta objetiva.</p>
    <button class="tool-btn" type="button" data-nav="call">Ir para Call</button>
  </div>`;
}

function mentorHref(path) {
  const q = session.mode === "local" && isMentorSession() ? "?demo=mentor" : "";
  return path + q;
}
function fechamentoHref() {
  return mentorHref("fechamento/index.html");
}
function ascensaoHref() {
  return mentorHref("ascensao/index.html");
}
function treinoHref() {
  return mentorHref("treinamento/index.html");
}
function mesaHref() {
  return mentorHref("mesa/index.html");
}
function livroHref() {
  return mentorHref("interno/livro.html");
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
        1. Mentorando tenta entrar com e-mail ou Google<br>
        2. A solicitação aparece abaixo automaticamente<br>
        3. Você libera, pausa, gerencia módulos ou bloqueia<br>
        4. Roteiros privados: <strong>afMentorScripts/module01</strong>
      </div>
    </div>
    <article class="q-feature livro-entry">
      <p class="hero-line">Uso interno</p>
      <h3>Livro Operacional</h3>
      <p>Volume 0 · auditoria e mapa do sistema. Só esta conta abre. Mentorados não veem este botão.</p>
      <a class="tool-btn" href="${livroHref()}">Abrir livro</a>
    </article>
    <article class="q-feature livro-entry">
      <p class="hero-line">Call de entrada</p>
      <h3>Roteiro da Ascensão</h3>
      <p>Mapa da sessão de 1h30 · R$ 350. Original intacto. Complemento das transcrições em roxo. Só o mentor vê.</p>
      <a class="tool-btn" href="${ascensaoHref()}">Abrir mapa da sessão</a>
    </article>
    <article class="q-feature livro-entry">
      <p class="hero-line">Call comercial</p>
      <h3>Fechamento de Call</h3>
      <p>Mapa, diagnóstico, qualificação, teleprompt, DNA e o que mostrar na tela. Só o mentor vê. Mentorado não entra.</p>
      <a class="tool-btn" href="${fechamentoHref()}">Abrir fechamento</a>
    </article>
    <article class="q-feature livro-entry">
      <p class="hero-line">Call Francesca</p>
      <h3>Mesa</h3>
      <p>Cockpit de negociação: Core + playbook. Francesca, Zé, Artur. Guia V3, o que mostrar, proposta 17k. Não compartilhar tela.</p>
      <a class="tool-btn" href="${mesaHref()}">Abrir mesa</a>
    </article>
    <article class="q-feature livro-entry">
      <p class="hero-line">Equipe</p>
      <h3>Treinamento do vendedor</h3>
      <p>Call sem tempo fixo até o checklist ficar verde. SDR vende a sessão. Mentoria cara não é o dia 1. Só o mentor vê.</p>
      <a class="tool-btn" href="${treinoHref()}">Abrir treinamento</a>
    </article>
    <article class="q-feature livro-entry">
      <p class="hero-line">Operação comercial</p>
      <h3>SDR · Akasha Hub</h3>
      <p>CRM leve, pipeline, radar de oportunidades, abordagem realista, diagnóstico breve, objeções e retornos. Acesso exclusivo ao mentor.</p>
      <a class="tool-btn" href="sdr/index.html">Abrir cockpit SDR</a>
    </article>
    <article class="q-feature livro-entry">
      <p class="hero-line">Império Digital · planejamento 2027</p>
      <h3>Perfil do Cliente & Calendário Editorial</h3>
      <p>Documento revisado com temas múltiplos por mês, conteúdos transversais do ecossistema e análise da meta de 90 publicações por dia. A página permite imprimir ou salvar como PDF.</p>
      <a class="tool-btn" href="interno/plano-editorial-2027.html" target="_blank" rel="noopener">Abrir plano editorial 2027 / Salvar em PDF</a>
      <a class="tool-btn" href="/al/central/perfil-conteudo/" target="_blank" rel="noopener">Abrir formulário digital de perfil e conteúdo</a>
    </article>
    <article class="q-feature livro-entry">
      <p class="hero-line">Arquitetura de Legado · só o mentor</p>
      <h3>Casa, contrato e apresentações</h3>
      <p>O mapa antigo dos planos do AF continua abaixo, com o nome exclusivo dele. Estes botões são a casa de R$ 39 mil e R$ 60 mil.</p>
      <a class="tool-btn" href="interno/documento-mestre-arquitetura-de-legado.pdf" target="_blank" rel="noopener">Documento-mestre</a>
      <button class="tool-btn" type="button" data-nav="legado-planos">Mapa dos planos do Legado</button>
      <button class="tool-btn" type="button" data-nav="legado-contrato">Contrato</button>
      <button class="tool-btn" type="button" data-nav="legado-regras">Regras</button>
      <button class="tool-btn" type="button" data-nav="legado-dossie">Modelo de dossiê</button>
      <button class="tool-btn" type="button" data-nav="legado-oquee">O que é a mentoria</button>
      <button class="tool-btn" type="button" data-nav="legado-direcao">Roteiro de direcionamento</button>
      <button class="tool-btn" type="button" data-nav="legado-pitch">Pitch</button>
      <button class="tool-btn" type="button" data-nav="legado-tcc">Apresentação TCC</button>
      <button class="tool-btn" type="button" data-nav="legado-slides">Lâminas</button>
      <button class="tool-btn" type="button" data-nav="producao-audios-pnl">PRODUÇÃO ÁUDIOS PNL</button>
      <button class="tool-btn" type="button" data-nav="audios-pnl">Biblioteca antiga de áudios</button>
      <button class="tool-btn" type="button" data-nav="conteudos-al">Conteúdos estratégicos para AL YouTube/TikTok</button>
      <a class="tool-btn" href="interno/apresentacao-curta-al.pdf" target="_blank" rel="noopener">Apresentação curta · AL</a>
      <a class="tool-btn" href="interno/palestra-legado-teleprompt.pdf" target="_blank" rel="noopener">Palestra · teleprompt</a>
      <a class="tool-btn" href="interno/palestra-legado-decorar.pdf" target="_blank" rel="noopener">Palestra · como decorar</a>
      <a class="tool-btn" href="interno/palestra-legado-mapa.png" target="_blank" rel="noopener">Palestra · mapa</a>
      <a class="tool-btn" href="interno/palestra-legado-slides.pdf" target="_blank" rel="noopener">Palestra · lâminas</a>
      <a class="tool-btn" href="interno/patrocinadores-b2b.pdf" target="_blank" rel="noopener">Patrocinadores · B2B</a>
    </article>
    <article class="q-feature livro-entry">
      <p class="hero-line">Boas-vindas · uso interno</p>
      <h3>Roteiro do vídeo de boas-vindas</h3>
      <p>Storytelling completo sobre a trajetória do mentor, os mais de 2 mil atendimentos, o livro Códigos de Origem e a evolução até o Arquitetura de Legado. Acesso exclusivo ao mentor.</p>
      <a class="tool-btn" href="${mentorHref("interno/roteiro-boas-vindas.html")}">Abrir roteiro de boas-vindas</a>
    </article>
    ${renderSessoesAccess()}
    ${renderAccessAdminPanel()}
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
    <div class="profile-edit" id="profileEdit">
      <div class="profile-av-wrap">
        <div class="profile-av" id="profileAvPreview" ${photo ? `style="background-image:url('${photo}')"` : ""}>${photo ? "" : esc((name || "A").charAt(0).toUpperCase())}</div>
        <label class="tool-btn">Trocar foto<input type="file" id="profPhoto" accept="image/*" hidden></label>
      </div>
      <div class="field"><label>Nome de exibição</label><input id="profName" value="${esc(name)}" placeholder="Seu nome"></div>
      <div class="field"><label>Cidade</label><input id="profCity" value="${esc(p.city || "")}" placeholder="Cidade"></div>
      <div class="field"><label>Instagram</label><input id="profIg" value="${esc(p.ig || "")}" placeholder="@usuario"></div>
      <div class="field"><label>WhatsApp</label><input id="profWpp" value="${esc(p.wpp || "")}" placeholder="71 9xxxx-xxxx"></div>
      <div class="field"><label>Uma linha sobre você</label><input id="profBio" value="${esc(p.bio || "")}" placeholder="Uma frase"></div>
      <button class="btn btn-inline" type="button" id="btnSaveProfile">Salvar perfil</button>
      <p class="notes-hint" id="profileStatus" role="status" aria-live="polite">Seu perfil fica vinculado a esta conta.</p>
    </div>
  </div>`;
}

function renderCriancas() {
  return `<div class="view active">
    <p class="hero-line">Dentro do acesso</p>
    <h2 class="hero-title">Crianças</h2>
    <p class="hero-sub">Duas salas. A fala do adulto não entra na sala da criança.</p>
    <div class="grid-3">
      <div class="stat-card" data-nav="criancas-pais" style="cursor:pointer">
        <div class="lbl">Adulto</div>
        <div class="val" style="font-size:1.35rem">Pais</div>
        <div class="hint">Orientação para acompanhar o filho. A criança não lê isto sozinha.</div>
      </div>
      <div class="stat-card" data-nav="criancas-sala" style="cursor:pointer">
        <div class="lbl">Criança</div>
        <div class="val" style="font-size:1.35rem">Sala</div>
        <div class="hint">Dinheiro, guardar, gastar, escolher, esperar.</div>
      </div>
    </div>
  </div>`;
}

function renderCriancasPais() {
  return `<div class="view active">
    <div class="back-link" data-nav="criancas">← Crianças</div>
    <p class="hero-line">Orientação dos pais</p>
    <h2 class="hero-title">Você acompanha. Não faz no lugar.</h2>
    <p class="hero-sub">Esta sala é para quem vai sentar junto. Não leve patrimônio, caixa, protocolo ou investimento para a conversa com a criança.</p>
    <div class="module-list">
      <div class="mod-row"><div class="mod-num">1</div><div class="mod-body"><h3>Antes de abrir a sala dela</h3><p>Você entra primeiro. A criança entra na outra sala, com você por perto.</p></div></div>
      <div class="mod-row"><div class="mod-num">2</div><div class="mod-body"><h3>Como falar</h3><p>Dinheiro. Guardar. Gastar. Escolher. Esperar.</p></div></div>
    </div>
  </div>`;
}

function renderCriancasSala() {
  return `<div class="view active">
    <div class="back-link" data-nav="criancas">← Crianças</div>
    <h2 class="hero-title">Aqui é com você.</h2>
    <p class="hero-sub">A gente fala de dinheiro com poucas palavras. Um adulto fica junto.</p>
    <div class="module-list">
      <div class="mod-row"><div class="mod-num">1</div><div class="mod-body"><h3>Olhar o dinheiro.</h3></div></div>
      <div class="mod-row"><div class="mod-num">2</div><div class="mod-body"><h3>Escolher.</h3></div></div>
      <div class="mod-row"><div class="mod-num">3</div><div class="mod-body"><h3>Guardar um pouco.</h3></div></div>
      <div class="mod-row"><div class="mod-num">4</div><div class="mod-body"><h3>Esperar.</h3></div></div>
    </div>
  </div>`;
}

function renderEmpresas() {
  return `<div class="view active">
    <p class="hero-line">Dentro do acesso</p>
    <h2 class="hero-title">Empresas</h2>
    <p class="hero-sub">Camada para a empresa desenvolver o colaborador. Não é a mentoria individual.</p>
    <div class="module-list">
      ${["Educação financeira", "Comunicação", "Atendimento", "Vendas", "Cultura", "Outros treinamentos"]
        .map((name, i) => `<div class="mod-row"><div class="mod-num">${i + 1}</div><div class="mod-body"><h3>${name}</h3></div></div>`)
        .join("")}
    </div>
  </div>`;
}


registerRenderers({
  dashboard: renderLifeOsDashboard,
  "arquitetura-legado": renderArquiteturaLegado,
  "mapas-mentais": renderMindMaps,
  "af-dashboard": renderDashboard,
  metas: viewMetas,
  sono: viewSono,
  modules: renderModules,
  moduleDetail: renderModuleDetail,
  tools: renderToolsView,
  call: renderCallView,
  mentor: renderMentor,
  ascensao: () => (isMentorSession()
    ? `<div class="view active">
        <div class="back-link" data-nav="mentor">← Gestão</div>
        <p class="hero-line">Call de entrada</p>
        <h2 class="hero-title">Ascensão de Alinhamento</h2>
        <p class="hero-sub">O mapa da sessão (1h30 · R$ 350) está no mesmo formato do fechamento. Só o mentor abre.</p>
        <a class="tool-btn" href="${ascensaoHref()}">Abrir mapa da sessão</a>
      </div>`
    : `<div class="view active"><p class="empty">Acesso restrito ao mentor.</p></div>`),
  profile: renderProfile,
  complementar: renderComplementarHome,
  compApp: renderComplementarApp,
  quitei: renderQuitei,
  criancas: renderCriancas,
  "criancas-pais": renderCriancasPais,
  "criancas-sala": renderCriancasSala,
  empresas: renderEmpresas,
  fase1: renderFase1,
  "fase1-jogo": renderFase1Jogo,
  "fase1-marca": renderFase1Marca,
  "fase1-dossie": renderFase1Dossie,
  fase2: renderFase2,
  "fase2-oferta": renderFase2Oferta,
  "fase2-ativos": renderFase2Ativos,
  fase3: renderFase3,
  "fase3-preco": renderFase3Preco,
  fase4: renderFase4,
  "fase4-sdr": renderFase4Sdr,
  "fase4-treinamento": renderFase4Treinamento,
  "fase4-closers": renderFase4Closers,
  "fase4-depende": renderFase4Depende,
  "fase4-divulga": renderFase4Divulga,
  fase5: renderFase5,
  "fase5-livro": renderFase5Livro,
  "legado-planos": renderLegadoPlanos,
  "legado-contrato": renderLegadoContrato,
  "legado-regras": renderLegadoRegras,
  "legado-dossie": renderLegadoDossie,
  "legado-oquee": renderLegadoOquee,
  "legado-direcao": renderLegadoDirecao,
  "legado-pitch": renderLegadoPitch,
  "legado-tcc": renderLegadoTcc,
  "legado-slides": renderLegadoSlides,
  "conteudos-al": renderConteudosAl,
  "vendas-curso": renderVendasCurso,
  "audios-pnl": renderAudiosPnl,
  "producao-audios-pnl": renderProducaoAudiosPnl,
  showLocked,
  openTool,
  pickProduct: pickNewProductImage
});

onAfterNavigate((view) => {
  onCallNavigate(view === "call");
  if (view === "dashboard") bindLifeOsDashboard();
  if (view === "profile") bindProfileForm();
  if (view === "mentor") {
    bindAccessAdmin();
    bindSessoesAccess();
  }
  if (view === "call") bindCallControls(navigate);
  if (view === "fase1-jogo") bindFase1Jogo();
  if (["fase1", "fase2", "fase3", "fase4", "fase5"].includes(view)) {
    bindPhaseChecklist();
    hydratePhaseChecklists(() => { if (getCurrentView() === view) navigate(view); });
  }
  if (view === "fase1-marca") bindFase1Marca();
  if (view === "fase1-dossie") bindFase1Dossie();
  if (view === "fase2-oferta") bindFase2Oferta();
  if (view === "fase2-ativos") bindFase2Ativos();
  if (view === "fase3-preco") bindFase3Preco();
  if (view === "fase4-depende") bindFase4Depende();
  if (view === "fase4-divulga") bindFase4Divulga();
  if (view === "fase5-livro") bindFase5Livro();
  if (view === "legado-dossie") bindLegadoDossie();
  if (view === "arquitetura-legado") {
    bindArquiteturaLegado();
    enhanceArchitectureView();
  }
  if (view === "mapas-mentais") {
    bindMindMaps();
    hydrateMindMaps(() => { if (getCurrentView() === view) navigate(view); });
  }
  if (view === "audios-pnl") bindAudiosPnl();
  if (view === "producao-audios-pnl") bindProducaoAudiosPnl();
});

function friendlyAuthError(error, fallback = "Não foi possível entrar. Tente novamente.") {
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
    default:
      return fallback;
  }
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
    msg.textContent = friendlyAuthError(e, "Não foi possível entrar. Confira os dados e tente novamente.");
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
    else msg.textContent = friendlyAuthError(e, "Não foi possível entrar com Google. Tente novamente.");
  } finally {
    document.getElementById("btnGoogle").disabled = false;
  }
}

async function onResetPassword() {
  const emailField = document.getElementById("loginEmail");
  const email = String(emailField?.value || "").trim();
  const msg = document.getElementById("authMsg");
  const btn = document.getElementById("btnResetPassword");

  if (!email) {
    msg.className = "auth-msg err";
    msg.textContent = "Digite seu e-mail no campo acima para receber o link.";
    emailField?.focus();
    return;
  }

  msg.className = "auth-msg";
  msg.textContent = "Solicitando instruções...";
  if (btn) btn.disabled = true;
  let state = "ok";
  try {
    await resetPassword(email);
  } catch (e) {
    if (e?.code === "auth/invalid-email") state = "invalid";
    else if (e?.code === "auth/user-not-found") state = "ok";
    else {
      state = "error";
      console.warn("[AF auth] password reset request:", e?.code || e?.message || e);
    }
  } finally {
    if (btn) btn.disabled = false;
  }

  if (state === "invalid") {
    msg.className = "auth-msg err";
    msg.textContent = "Confira o formato do e-mail e tente novamente.";
  } else if (state === "ok") {
    msg.className = "auth-msg ok";
    msg.textContent = "Se esse e-mail estiver cadastrado, você receberá um link. Confira também a caixa de spam.";
  } else {
    msg.className = "auth-msg err";
    msg.textContent = "Não foi possível solicitar agora. Verifique sua conexão e tente novamente.";
  }
}

function init() {
  const demoWrap = document.getElementById("demoButtons");
  if (demoWrap) demoWrap.style.display = isDemoEnabled() ? "block" : "none";

  document.getElementById("btnLogin")?.addEventListener("click", onLoginEmail);
  const loginBtn = document.getElementById("btnLogin");
  if (loginBtn) loginBtn.dataset.ready = "1";
  document.getElementById("btnGoogle")?.addEventListener("click", onLoginGoogle);
  document.getElementById("btnResetPassword")?.addEventListener("click", onResetPassword);
  document.getElementById("loginPass")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") onLoginEmail();
  });
  document.getElementById("btnDemoMentor")?.addEventListener("click", () => enterDemo("mentor"));
  document.getElementById("btnDemoMentee")?.addEventListener("click", () => enterDemo("mentee"));
  document.getElementById("btnLogout")?.addEventListener("click", async () => {
    forceStopMedia();
    closeTeleprompter();
    await stopPresence();
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
  bindMaterialViewer();
  bindMediaUI();
  bindCoverEditor();
  bindLifeOsLayer();
  bindQuitei();

  document.addEventListener("af-covers-changed", () => {
    const v = getCurrentView();
    if (v) navigate(v);
  });

  setAuthCallbacks({
    onReady: () => showApp(),
    onDenied: () => showAccessDenied(),
    onLogout: () => showAuth()
  });

  startAuthListener();
}

init();
