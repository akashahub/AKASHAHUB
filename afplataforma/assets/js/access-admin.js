/**
 * Gestão de acessos AF — só interface.
 * Segurança real = Firestore Rules (afAccess + isAfMentor).
 */
import { session } from "./auth.js";
import { MENTOR_UID } from "../../firebase/firebase-config.js";
import {
  getAllUsersForAf,
  grantFullAfAccess,
  pauseAfAccess,
  reactivateAfAccess,
  updateAfModules,
  fullAfModules,
  countAfModules,
  afAccessStatus
} from "../../firebase/firestore.js";
import { MODULES } from "../../data/modules.js";
import { esc } from "./navigation.js";

const STATUS_LABEL = { none: "SEM ACESSO", pending: "PENDENTE", paused: "PAUSADO", active: "ATIVO" };

let cache = [];
let q = "";
let busy = false;
let pendingMods = {};
let cssOn = false;

function toast(msg, err = false) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast show" + (err ? " err" : "");
  clearTimeout(window._tt);
  window._tt = setTimeout(() => (el.className = "toast"), 2800);
}

function injectCss() {
  if (cssOn) return;
  cssOn = true;
  const s = document.createElement("style");
  s.textContent = `
.af-admin{margin-top:28px;padding-top:8px;border-top:1px solid var(--line)}
.af-search-row{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 8px}
.af-search-row input{flex:1;min-width:200px;padding:10px 12px;border:1px solid var(--line);border-radius:4px;background:#fff;color:#1a1714;font-size:13px}
.af-user-list{display:flex;flex-direction:column;gap:10px;margin-top:12px}
.af-user-card{border:1px solid var(--line);background:#fff;border-radius:6px;padding:14px;display:grid;gap:12px}
@media(min-width:720px){.af-user-card{grid-template-columns:1fr auto auto;align-items:center}}
.af-user-main{display:flex;gap:12px;align-items:center;min-width:0}
.af-av{width:40px;height:40px;border-radius:50%;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-family:var(--font-d);color:var(--gold);flex-shrink:0;background:#f7f3eb}
.af-user-main h4{font-size:14px;font-weight:400;margin:0 0 2px}
.af-user-main p{font-size:12px;color:var(--muted);margin:0;word-break:break-all}
.af-user-meta{display:flex;flex-direction:column;gap:6px;align-items:flex-start}
.af-mods{font-size:11px;color:var(--muted)}
.af-user-actions{display:flex;flex-wrap:wrap;gap:6px}
.af-pill{display:inline-block;font-size:9px;letter-spacing:1.4px;text-transform:uppercase;padding:4px 8px;border-radius:20px;border:1px solid var(--line)}
.af-pill-active{border-color:rgba(94,201,138,.5);color:#2d6a4f;background:rgba(94,201,138,.12)}
.af-pill-paused{border-color:rgba(201,162,39,.5);color:var(--gold);background:rgba(201,162,39,.1)}
.af-pill-pending{border-color:rgba(224,85,85,.35);color:var(--red)}
.af-pill-none{color:var(--muted)}
.af-btn-warn{border-color:rgba(224,85,85,.35)!important;color:var(--red)!important}
.af-mod-list{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.af-mod-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px;border:1px solid var(--line);border-radius:4px;font-size:13px}
.af-mod-row input{width:18px;height:18px}`;
  document.head.appendChild(s);
}

/** Só a interface. Segurança real = Firestore Rules. */
export function isAfAdminUi() {
  return session.uid === MENTOR_UID;
}

function openModal(title, body, foot) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalBody").innerHTML = body;
  document.getElementById("modalFoot").innerHTML = foot || "";
  document.getElementById("overlay")?.classList.add("open");
  document.getElementById("modalBox")?.classList.add("open");
}

function closeModal() {
  document.getElementById("overlay")?.classList.remove("open");
  document.getElementById("modalBox")?.classList.remove("open");
}

export function renderAccessAdminPanel() {
  if (!isAfAdminUi()) return "";
  return `<section class="af-admin" id="afAdmin">
    <p class="hero-line">Operação administrativa</p>
    <h3 class="section-h" style="margin-top:8px">Gestão de acessos AF</h3>
    <p class="hero-sub">Libera, pausa e módulos em <code>afAccess/{uid}</code>. A collection <code>users</code> não é alterada.</p>
    <div class="af-search-row">
      <input id="afUserSearch" type="search" placeholder="Buscar por nome ou e-mail" autocomplete="off">
      <button class="tool-btn" type="button" id="afReloadUsers">Atualizar lista</button>
    </div>
    <p class="notes-hint" id="afAdminHint">Carregando usuários…</p>
    <div id="afUserList" class="af-user-list"></div>
  </section>`;
}

export function bindAccessAdmin() {
  if (!isAfAdminUi()) return;
  injectCss();
  const search = document.getElementById("afUserSearch");
  if (search) {
    search.value = q;
    search.addEventListener("input", () => { q = search.value || ""; paintList(); });
  }
  document.getElementById("afReloadUsers")?.addEventListener("click", loadUsers);
  document.getElementById("afUserList")?.addEventListener("click", onListClick);
  loadUsers();
}

async function loadUsers() {
  const hint = document.getElementById("afAdminHint");
  const list = document.getElementById("afUserList");
  if (!list) return;
  if (session.mode === "local") {
    hint.textContent = "Entre com o login Firebase do mentor para gerir acessos reais. O modo demo não grava no Firestore.";
    list.innerHTML = "";
    return;
  }
  hint.textContent = "Carregando usuários…";
  try {
    cache = await getAllUsersForAf();
    paintList();
  } catch (e) {
    hint.textContent = e.message || "Não foi possível concluir a operação. Tente novamente.";
    list.innerHTML = "";
    toast(e.message, true);
  }
}

function filtered() {
  const s = q.trim().toLowerCase();
  if (!s) return cache;
  return cache.filter((u) => String(u.name || "").toLowerCase().includes(s) || String(u.email || "").toLowerCase().includes(s));
}

function paintList() {
  const hint = document.getElementById("afAdminHint");
  const list = document.getElementById("afUserList");
  if (!list) return;
  const rows = filtered();
  hint.textContent = rows.length
    ? rows.length + " usuário(s)" + (q.trim() ? " na busca" : " no ecossistema")
    : q.trim() ? "Nenhum usuário com esse nome ou e-mail." : "Nenhum usuário encontrado.";
  list.innerHTML = rows.map((u) => {
    const st = u.status || "none";
    const actions = st === "active"
      ? `<button type="button" class="tool-btn" data-af="mods" data-uid="${esc(u.uid)}">Gerenciar</button>
         <button type="button" class="tool-btn af-btn-warn" data-af="pause" data-uid="${esc(u.uid)}">Pausar</button>`
      : st === "paused"
        ? `<button type="button" class="tool-btn" data-af="mods" data-uid="${esc(u.uid)}">Gerenciar</button>
           <button type="button" class="tool-btn" data-af="reactivate" data-uid="${esc(u.uid)}">Reativar</button>`
        : `<button type="button" class="tool-btn" data-af="grant" data-uid="${esc(u.uid)}">Liberar AF completa</button>`;
    return `<article class="af-user-card" data-uid="${esc(u.uid)}">
      <div class="af-user-main">
        <div class="af-av">${esc((u.name || "?").charAt(0).toUpperCase())}</div>
        <div><h4>${esc(u.name || u.uid)}</h4><p>${esc(u.email || "sem e-mail")}</p></div>
      </div>
      <div class="af-user-meta">
        <span class="af-pill af-pill-${st}">${STATUS_LABEL[st]}</span>
        <span class="af-mods">${st === "none" ? "—" : u.modulesOn + "/7 módulos"}</span>
      </div>
      <div class="af-user-actions">${actions}</div>
    </article>`;
  }).join("");
}

function findUser(uid) { return cache.find((u) => u.uid === uid); }

function patchCache(uid, access) {
  const u = findUser(uid);
  if (!u) return;
  u.access = { ...(u.access || {}), ...access };
  if (access.modules) u.access.modules = access.modules;
  u.status = afAccessStatus(u.access);
  u.modulesOn = countAfModules(u.access.modules);
}

async function runAction(btn, fn, okMsg) {
  if (busy) return;
  busy = true;
  const prev = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Salvando...";
  try {
    await fn();
    toast(okMsg);
    paintList();
  } catch (e) {
    toast(e.message || "Não foi possível concluir a operação. Tente novamente.", true);
  } finally {
    busy = false;
    btn.disabled = false;
    btn.textContent = prev;
  }
}

function onListClick(e) {
  const btn = e.target.closest("[data-af]");
  if (!btn || busy) return;
  const u = findUser(btn.dataset.uid);
  if (!u) return toast("Usuário não encontrado.", true);
  const act = btn.dataset.af;
  if (act === "grant") confirmGrant(u);
  else if (act === "pause") confirmPause(u);
  else if (act === "reactivate") confirmReactivate(u);
  else if (act === "mods") openModules(u);
}

function confirmGrant(u) {
  const who = u.name + (u.email ? " · " + u.email : "");
  openModal("Confirmar liberação",
    `<p>Confirmar liberação completa da AF Plataforma para <strong>${esc(who)}</strong>?</p>
     <p class="notes-hint">Cria ou atualiza afAccess com approved, active e os 7 módulos.</p>`,
    `<button class="tool-btn" type="button" id="afCancel">Cancelar</button>
     <button class="tool-btn" type="button" id="afOk">Confirmar liberação</button>`);
  document.getElementById("afCancel").onclick = closeModal;
  document.getElementById("afOk").onclick = () => {
    runAction(document.getElementById("afOk"), async () => {
      const res = await grantFullAfAccess(u.uid);
      patchCache(u.uid, { approved: true, active: true, modules: res.modules || fullAfModules() });
      closeModal();
    }, "Acesso AF liberado.");
  };
}

function confirmPause(u) {
  openModal("Pausar acesso",
    `<p>Pausar AF para <strong>${esc(u.name)}</strong>? Módulos e histórico permanecem.</p>`,
    `<button class="tool-btn" type="button" id="afCancel">Cancelar</button>
     <button class="tool-btn af-btn-warn" type="button" id="afOk">Confirmar pausa</button>`);
  document.getElementById("afCancel").onclick = closeModal;
  document.getElementById("afOk").onclick = () => {
    runAction(document.getElementById("afOk"), async () => {
      await pauseAfAccess(u.uid);
      patchCache(u.uid, { active: false });
      closeModal();
    }, "Acesso pausado.");
  };
}

function confirmReactivate(u) {
  openModal("Reativar acesso",
    `<p>Reativar AF para <strong>${esc(u.name)}</strong>? Os módulos atuais são preservados.</p>`,
    `<button class="tool-btn" type="button" id="afCancel">Cancelar</button>
     <button class="tool-btn" type="button" id="afOk">Confirmar reativação</button>`);
  document.getElementById("afCancel").onclick = closeModal;
  document.getElementById("afOk").onclick = () => {
    runAction(document.getElementById("afOk"), async () => {
      await reactivateAfAccess(u.uid);
      patchCache(u.uid, { active: true });
      closeModal();
    }, "Acesso reativado.");
  };
}

function openModules(u) {
  pendingMods = {};
  const mods = { ...(u.access?.modules || {}) };
  for (let i = 1; i <= 7; i++) pendingMods["module0" + i] = mods["module0" + i] === true;
  const rows = MODULES.map((m) => `<label class="af-mod-row"><span>Módulo ${esc(m.num)} · ${esc(m.title)}</span>
    <input type="checkbox" data-mod="${m.id}" ${pendingMods[m.id] ? "checked" : ""}></label>`).join("");
  openModal("Gerenciar módulos",
    `<p class="notes-hint">${esc(u.name)} · ${esc(u.email || u.uid)}</p><div class="af-mod-list">${rows}</div>`,
    `<button class="tool-btn" type="button" id="afAllOn">Liberar todos</button>
     <button class="tool-btn" type="button" id="afAllOff">Bloquear todos</button>
     <button class="tool-btn" type="button" id="afCancel">Cancelar</button>
     <button class="tool-btn" type="button" id="afSaveMods">Salvar alterações</button>`);
  const body = document.getElementById("modalBody");
  body.querySelectorAll("[data-mod]").forEach((inp) => {
    inp.addEventListener("change", () => { pendingMods[inp.dataset.mod] = inp.checked; });
  });
  document.getElementById("afCancel").onclick = closeModal;
  document.getElementById("afAllOn").onclick = () => {
    pendingMods = fullAfModules();
    body.querySelectorAll("[data-mod]").forEach((inp) => { inp.checked = true; });
  };
  document.getElementById("afAllOff").onclick = () => {
    pendingMods = { module01: false, module02: false, module03: false, module04: false, module05: false, module06: false, module07: false };
    body.querySelectorAll("[data-mod]").forEach((inp) => { inp.checked = false; });
  };
  document.getElementById("afSaveMods").onclick = () => {
    runAction(document.getElementById("afSaveMods"), async () => {
      const res = await updateAfModules(u.uid, pendingMods);
      patchCache(u.uid, { modules: res.modules });
      closeModal();
    }, "Módulos atualizados.");
  };
}
