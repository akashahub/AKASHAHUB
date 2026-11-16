/**
 * Contexto de navegação do hub.
 * A escolha não autoriza leitura e não altera o UID autenticado.
 * UID fora da lista real é recusado.
 */
import { session, isMentorSession } from "./auth.js";
import { getAllUsersForAf } from "../../firebase/firestore.js";
import { resolveContext, contextFromSelection } from "./hub-context-rules.js?v=etapa3-2";

const KEY = "akasha.hub.context.v1";
let authorized = null;
let directory = new Map();

function actor() {
  return {
    uid: session.uid || "",
    name: session.name || "",
    email: session.email || "",
    role: isMentorSession() ? "mentor" : (session.role || "")
  };
}

function readStored() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.uid !== "string") return null;
    return data;
  } catch {
    return null;
  }
}

function writeStored(ctx) {
  try {
    if (!ctx) sessionStorage.removeItem(KEY);
    else sessionStorage.setItem(KEY, JSON.stringify(ctx));
  } catch {
    /* navegador sem storage: o contexto fica só na memória da função */
  }
}

export function setAuthorizedMentees(rows) {
  const next = new Set();
  const book = new Map();
  for (const row of rows || []) {
    if (!row || typeof row.uid !== "string" || !row.uid) continue;
    book.set(row.uid, {
      name: row.name || "",
      email: row.email || "",
      status: row.status || ""
    });
    if (row.status === "active") next.add(row.uid);
  }
  authorized = next;
  directory = book;
  return ensureHubContext();
}

export async function loadAuthorizedMentees() {
  if (!isMentorSession()) {
    return setAuthorizedMentees([]);
  }
  const rows = await getAllUsersForAf();
  return setAuthorizedMentees(rows || []);
}

export function ensureHubContext() {
  let ctx = resolveContext(actor(), readStored(), authorized);
  if (ctx && ctx.source === "mentor-selection") {
    const row = directory.get(ctx.uid);
    if (!row || row.status !== "active") ctx = resolveContext(actor(), null, authorized);
    else ctx = { ...ctx, name: row.name || "", email: row.email || "" };
  }
  writeStored(ctx);
  publish(ctx);
  return ctx;
}

export function selectHubMentee(person) {
  const who = actor();
  const picked = contextFromSelection(who, person && person.uid, authorized, directory);
  if (!picked) return ensureHubContext();
  writeStored(picked);
  publish(picked);
  paintHubContext();
  return picked;
}

export function clearHubContext() {
  authorized = null;
  directory = new Map();
  writeStored(null);
  publish(null);
  const el = document.getElementById("menteeContextChip");
  if (el) {
    el.hidden = true;
    el.textContent = "";
  }
}

export function activeHubContext() {
  return ensureHubContext();
}

function publish(ctx) {
  const api = {
    get: activeHubContext,
    note: "Referência de navegação. Não autoriza leitura de outro UID."
  };
  try {
    Object.defineProperty(api, "current", { get: activeHubContext });
  } catch {
    api.current = ctx;
  }
  window.AkashaHubContext = api;
}

export function paintHubContext() {
  const el = document.getElementById("menteeContextChip");
  if (!el || !session.uid) return;
  const ctx = ensureHubContext();
  if (!ctx) {
    el.hidden = true;
    return;
  }
  const own = ctx.uid === session.uid;
  el.hidden = false;
  el.textContent = own
    ? "Seus dados · só este login"
    : `Navegando: ${ctx.name || ctx.email || "mentorando"} · referência, não é permissão`;
}
