/**
 * Gestão de acessos AF — interface.
 * Segurança real = Firestore Rules.
 */
import { session } from "./auth.js";
import { MENTOR_UID } from "../../firebase/firebase-config.js";
import {
  listenAfAccessBoard,
  grantFullAfAccess,
  pauseAfAccess,
  reactivateAfAccess,
  updateAfModules,
  denyAfAccess,
  blockAfAccess,
  markAfRequestPending,
  fullAfModules,
  countAfModules,
  afAccessStatus
} from "../../firebase/firestore.js";
import { MODULES } from "../../data/modules.js";
import { esc } from "./navigation.js";

const STATUS_LABEL = {
  none: "SEM ACESSO",
  pending: "AGUARDANDO APROVAÇÃO",
  paused: "PAUSADO",
  active: "ATIVO",
  denied: "NEGADO",
  blocked: "BLOQUEADO"
};

let cache = [];
let q = "";
let busy = false;
let pendingMods = {};
let cssOn = false;
let unsub = null;

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
.af-search-row{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 8px;align-items:center}
.af-search-row input{flex:1;min-width:200px;padding:10px 12px;border:1px solid var(--line);border-radius:4px;background:#fff;color:#1a1714;font-size:13px}
.af-badge-new{display:none;font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:6px 10px;border-radius:20px;border:1px solid rgba(201,162,39,.45);color:#8B6914;background:rgba(201,162,39,.12)}
.af-badge-new.show{display:inline-block}
.af-user-list{display:flex;flex-direction:column;gap:10px;margin-top:12px}
.af-user-card{border:1px solid var(--line);background:#fff;border-radius:6px;padding:14px;display:grid;gap:12px}
.af-user-card.is-pending{border-color:rgba(201,162,39,.55);box-shadow:0 0 0 1px rgba(201,162,39,.12)}
@media(min-width:720px){.af-user-card{grid-template-columns:1fr auto;align-items:center}}
.af-user-main{display:flex;gap:12px;align-items:flex-start;min-width:0}
.af-av{width:40px;height:40px;border-radius:50%;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-family:var(--font-d);color:var(--gold);flex-shrink:0;background:#f7f3eb}
.af-user-main h4{font-size:14px;font-weight:400;margin:0 0 2px}
.af-user-main p{font-size:12px;color:var(--muted);margin:0;word-break:break-all}
.af-uid{font-size:10px;color:var(--muted2);margin-top:4px;word-break:break-all}
.af-time{font-size:11px;color:var(--muted);margin-top:2px}
.af-user-meta{display:flex;flex-direction:column;gap:6px;align-items:flex-start}
.af-mods{font-size:11px;color:var(--muted)}
.af-user-actions{display:flex;flex-wrap:wrap;gap:6px}
.af-pill{display:inline-block;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;padding:4px 8px;border-radius:20px;border:1px solid var(--line)}
.af-pill-active{border-color:rgba(94,201,138,.5);color:#2d6a4f;background:rgba(94,201,138,.12)}
.af-pill-paused{border-color:rgba(201,162,39,.5);color:var(--gold);background:rgba(201,162,39,.1)}
.af-pill-pending{border-color:rgba(201,162,39,.55);color:#8B6914;background:rgba(201,162,39,.12)}
.af-pill-denied,.af-pill-blocked{border-color:rgba(224,85,85,.35);color:var(--red)}
.af-pill-none{color:var(--muted)}
.af-btn-warn{border-color:rgba(224,85,85,.35)!important;color:var(--red)!important}
.af-mod-list{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.af-mod-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px;border:1px solid var(--line);border-radius:4px;font-size:13px}
.af-mod-row input{width:18px;height:18px}`;
  document.head.appendChild(s);
}

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

function fmtWhen(ms) {
  if (!ms) return "sem horário";
  try {
    return new Date(ms).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch (e) {
    return "sem horário";
  }
}

export function renderAccessAdminPanel() {
  if (!isAfAdminUi()) return "";
  return `<section class="af-admin" id="afAdmin">
    <p class="hero-line">Operação administrativa</p>
    <h3 class="section-h" style="margin-top:8px">Gestão de acessos AF</h3>
    <p class="hero-sub">Quem tenta entrar aparece aqui sozinho. Você libera, nega, pausa ou bloqueia.</p>
    <div class="af-search-row">
      <input id="afUserSearch" type="search" placeholder="Buscar por nome ou e-mail" autocomplete="off">
      <span class="af-badge-new" id="afNewBadge"></span>
    </div>
    <p class="notes-hint" id="afAdminHint">Aguardando tentativas de login…</p>
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
  document.getElementById("afUserList")?.addEventListener("click", onListClick);
  if (session.mode === "local") {
    const hint = document.getElementById("afAdminHint");
    if (hint) hint.textContent = "Entre com o login Firebase do mentor para ver as tentativas reais.";
    return;
  }
  if (unsub) unsub();
  unsub = listenAfAccessBoard(
    (rows) => { cache = rows || []; paintList(); },
    (e) => {
      const hint = document.getElementById("afAdminHint");
      if (hint) hint.textContent = e?.message || "Não foi possível carregar a lista.";
      toast(e?.message || "Falha ao ouvir acessos.", true);
    }
  );
}

function filtered() {
  const s = q.trim().toLowerCase();
  if (!s) return cache;
  return cache.filter((u) =>
    String(u.name || "").toLowerCase().includes(s) ||
    String(u.email || "").toLowerCase().includes(s) ||
    String(u.uid || "").toLowerCase().includes(s)
  );
}

function pendingCount() {
  return cache.filter((u) => u.status === "pending").length;
}

function paintList() {
  const hint = document.getElementById("afAdminHint");
  const list = document.getElementById("afUserList");
  const badge = document.getElementById("afNewBadge");
  if (!list) return;
  const nNew = pendingCount();
  if (badge) {
    badge.textContent = nNew === 1 ? "1 nova solicitação de acesso" : nNew + " novas solicitações de acesso";
    badge.classList.toggle("show", nNew > 0);
  }
  const rows = filtered();
  if (hint) {
    hint.textContent = rows.length
      ? rows.length + " registro(s)" + (q.trim() ? " na busca" : "")
      : q.trim()
        ? "Nenhum usuário com esse nome ou e-mail."
        : "Nenhuma tentativa ainda. Quando alguém fizer login, aparece aqui.";
  }
  list.innerHTML = rows.map((u) => {
    const st = u.status || "none";
    let actions = "";
    if (st === "active") {
      actions = `<button type="button" class="tool-btn" data-af="mods" data-uid="${esc(u.uid)}">Gerenciar</button>
        <button type="button" class="tool-btn" data-af="pause" data-uid="${esc(u.uid)}">Pausar</button>
        <button type="button" class="tool-btn af-btn-warn" data-af="block" data-uid="${esc(u.uid)}">Bloquear</button>`;
    } else if (st === "paused") {
      actions = `<button type="button" class="tool-btn" data-af="reactivate" data-uid="${esc(u.uid)}">Reativar</button>
        <button type="button" class="tool-btn" data-af="mods" data-uid="${esc(u.uid)}">Gerenciar</button>
        <button type="button" class="tool-btn af-btn-warn" data-af="block" data-uid="${esc(u.uid)}">Bloquear</button>`;
    } else if (st === "blocked") {
      actions = `<button type="button" class="tool-btn" data-af="pending" data-uid="${esc(u.uid)}">Deixar pendente</button>`;
    } else if (st === "denied") {
      actions = `<button type="button" class="tool-btn" data-af="grant" data-uid="${esc(u.uid)}">Liberar acesso</button>
        <button type="button" class="tool-btn" data-af="pending" data-uid="${esc(u.uid)}">Deixar pendente</button>
        <button type="button" class="tool-btn af-btn-warn" data-af="block" data-uid="${esc(u.uid)}">Bloquear</button>`;
    } else {
      actions = `<button type="button" class="tool-btn" data-af="grant" data-uid="${esc(u.uid)}">Liberar acesso</button>
        <button type="button" class="tool-btn" data-af="deny" data-uid="${esc(u.uid)}">Negar</button>
        <button type="button" class="tool-btn" data-af="pending" data-uid="${esc(u.uid)}">Pendente</button>
        <button type="button" class="tool-btn af-btn-warn" data-af="block" data-uid="${esc(u.uid)}">Bloquear</button>`;
    }
    return `<article class="af-user-card${st === "pending" ? " is-pending" : ""}" data-uid="${esc(u.uid)}">
      <div class="af-user-main">
        <div class="af-av">${esc((u.name || "?").charAt(0).toUpperCase())}</div>
        <div>
          <h4>${esc(u.name || u.uid)}</h4>
          <p>${esc(u.email || "sem e-mail")}</p>
          <p class="af-uid">UID ${esc(u.uid)}</p>
          <p class="af-time">Tentativa: ${esc(fmtWhen(u.attemptedAt))}${u.provider ? " · " + esc(u.provider) : ""}</p>
        </div>
      </div>
      <div>
        <div class="af-user-meta" style="margin-bottom:8px">
          <span class="af-pill af-pill-${st}">${STATUS_LABEL[st] || st}</span>
          <span class="af-mods">${st === "active" || st === "paused" ? u.modulesOn + "/7 módulos" : "—"}</span>
        </div>
        <div class="af-user-actions">${actions}</div>
      </div>
    </article>`;
  }).join("");
}

function findUser(uid) { return cache.find((u) => u.uid === uid); }

async function runAction(btn, fn, okMsg) {
  if (busy) return;
  busy = true;
  const prev = btn?.textContent;
  if (btn) { btn.disabled = true; btn.textContent = "Salvando..."; }
  try {
    await fn();
    toast(okMsg);
  } catch (e) {
    toast(e.message || "Não foi possível concluir a operação. Tente novamente.", true);
  } finally {
    busy = false;
    if (btn) { btn.disabled = false; btn.textContent = prev; }
  }
}

function onListClick(e) {
  const btn = e.target.closest("[data-af]");
  if (!btn || busy) return;
  const u = findUser(btn.dataset.uid);
  if (!u) return toast("Usuário não encontrado.", true);
  const act = btn.dataset.af;
  if (act === "grant") confirmAct(u, "Liberar acesso", `Liberar AF completa para <strong>${esc(u.name)}</strong> (${esc(u.email || u.uid)})?`, "Confirmar liberação", () => grantFullAfAccess(u.uid), "Acesso AF liberado.");
  else if (act === "deny") confirmAct(u, "Negar acesso", `Negar ${esc(u.name)}? A pessoa continua sem entrar.`, "Confirmar negação", () => denyAfAccess(u.uid), "Acesso negado.");
  else if (act === "block") confirmAct(u, "Bloquear usuário", `Bloquear ${esc(u.name)}? Novas tentativas não reabrem o pedido.`, "Confirmar bloqueio", () => blockAfAccess(u.uid), "Usuário bloqueado.");
  else if (act === "pending") confirmAct(u, "Deixar pendente", `Mover ${esc(u.name)} para Aguardando aprovação?`, "Confirmar", () => markAfRequestPending(u.uid), "Marcado como pendente.");
  else if (act === "pause") confirmAct(u, "Pausar acesso", `Pausar AF de ${esc(u.name)}? Módulos permanecem.`, "Confirmar pausa", () => pauseAfAccess(u.uid), "Acesso pausado.");
  else if (act === "reactivate") confirmAct(u, "Reativar acesso", `Reativar AF de ${esc(u.name)}?`, "Confirmar reativação", () => reactivateAfAccess(u.uid), "Acesso reativado.");
  else if (act === "mods") openModules(u);
}

function confirmAct(u, title, html, okLabel, fn, okMsg) {
  openModal(title, `<p>${html}</p>`,
    `<button class="tool-btn" type="button" id="afCancel">Cancelar</button>
     <button class="tool-btn" type="button" id="afOk">${okLabel}</button>`);
  document.getElementById("afCancel").onclick = closeModal;
  document.getElementById("afOk").onclick = () => {
    runAction(document.getElementById("afOk"), async () => {
      await fn();
      closeModal();
    }, okMsg);
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
      await updateAfModules(u.uid, pendingMods);
      closeModal();
    }, "Módulos atualizados.");
  };
}
