/**
 * Contexto de navegação do hub.
 * Guarda qual mentorando o mentor escolheu olhar.
 * Não é permissão e não é lido pelos apps nesta etapa.
 */
import { session, isMentorSession } from "./auth.js";
import { resolveContext, selectionAllowed } from "./hub-context-rules.js?v=etapa3-1";

const KEY = "akasha.hub.context.v1";

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

export function ensureHubContext() {
  const ctx = resolveContext(actor(), readStored());
  writeStored(ctx);
  publish(ctx);
  return ctx;
}

export function selectHubMentee(person) {
  const who = actor();
  const uid = person && person.uid;
  if (!selectionAllowed(who, uid)) return ensureHubContext();
  const ctx = {
    uid,
    name: person.name || "",
    email: person.email || "",
    source: uid === who.uid ? "self" : "mentor-selection"
  };
  writeStored(ctx);
  publish(ctx);
  paintHubContext();
  return ctx;
}

export function clearHubContext() {
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
