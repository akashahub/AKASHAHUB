import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs,
  serverTimestamp, writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  firebaseConfig, SUPER_ADMINS, COL_ACCESS, COL_INST, COL_REF,
  emailKey, isSuperAdmin
} from "./config.js";
import * as KB from "./knowledge.js?v=20260917i";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const VIEWS = [
  ["dash", "Hoje"],
  ["directory", "Lista de instituições"],
  ["crm", "Contatos"],
  ["pipe", "Etapas"],
  ["cockpit", "Ligação"],
  ["follow", "Agenda"],
  ["react", "Retomar"],
  ["ind", "Indicações"],
  ["play", "Guia"],
  ["obj", "Objeções"],
  ["proof", "Provas"],
  ["base", "Como funciona"],
  ["parc", "Já parceiras"],
  ["equipe", "Equipe"],
  ["access", "Acessos"]
];

const session = {
  user: null,
  email: "",
  name: "",
  role: "",
  admin: false,
  allowed: false
};

let inst = [];
let refs = [];
let users = [];
let view = "dash";
let currentId = null;
let callStep = 0;
let callMode = "fast";
let directoryTypeFilter = "all";
let directoryStatusFilter = "all";
let directoryCityFilter = "all";
let directoryEditId = null;
let directoryLoadError = "";
let filterQ = "";
let callStartedAt = null;
let callTimerHandle = null;
let callPanelOpen = false;
let callPanelMinimized = false;
let callPanelExpanded = false;
let callPanelLocked = window.matchMedia("(max-width:720px)").matches ? localStorage.getItem("isaacCallPanelMobileMode") !== "free" : false;

const $ = (id) => document.getElementById(id);
const el = {
  gate: $("gate"),
  app: $("app"),
  view: $("view"),
  nav: $("nav"),
  bottom: $("bottom"),
  who: $("who"),
  toast: $("toast")
};

function toast(msg) {
  el.toast.textContent = msg;
  el.toast.className = "toast on";
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.toast.className = "toast"; }, 2400);
}
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
function norm(s) {
  return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}
function slugInst(name, city) {
  return (norm(name) + "|" + norm(city || "salvador"))
    .replace(/[\\/#?]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 180);
}
function nowIso() { return new Date().toISOString(); }
function fmt(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
function activeCallSteps() {
  return callMode === "fast" && Array.isArray(KB.FAST_CALL_STEPS) ? KB.FAST_CALL_STEPS : KB.CALL_STEPS;
}
function callStepAsk(step, row) {
  return row && row.type === "ensino_superior" && step.askHigher ? step.askHigher : step.ask;
}
function objectionGroups() {
  const byId = new Map(KB.OBJECTIONS.map((o) => [o.id, o]));
  const flow = Array.isArray(KB.OBJECTION_FLOW) ? KB.OBJECTION_FLOW : [{ id:"todas", title:"Objeções", help:"", stepIds:[], objectionIds:KB.OBJECTIONS.map((o)=>o.id) }];
  return flow.map((group) => ({ ...group, items: group.objectionIds.map((id) => byId.get(id)).filter(Boolean) }));
}

const LOG_ACTION_LABELS = {
  create: "Instituição cadastrada",
  directory_import: "Adicionada à lista",
  directory_edit: "Informações editadas",
  directory_promoted: "Colocada nos contatos em andamento",
  directory_novo: "Marcada como ainda não tentada",
  directory_tentei: "Tentativa de contato marcada",
  directory_falei: "Conversa realizada marcada",
  directory_reuniao: "Reunião marcada",
  directory_nao_abordar: "Marcada para não abordar",
  attempt: "Tentativa de contato registrada",
  responsavel_alcancado: "Responsável alcançado",
  call_step: "Etapa da ligação registrada",
  status: "Etapa alterada",
  objection: "Objeção registrada",
  historico: "Histórico anterior atualizado",
  meeting_scheduled: "Reunião agendada",
  meeting_rescheduled: "Reunião remarcada",
  end_call: "Ligação encerrada",
  encaminhar: "Encaminhada ao time isaac",
  nao_fit: "Marcada como não adequada",
  indicacao: "Indicação registrada",
  import_parceiro_ssa: "Parceira oficial importada"
};
function logActionLabel(action) {
  return LOG_ACTION_LABELS[action] || String(action || "").replace(/_/g, " ");
}
const DIRECTORY_STATUS = {
  novo: { label: "Ainda não tentei", short: "Novo" },
  tentei: { label: "Já tentei contato", short: "Tentei" },
  falei: { label: "Já falei com alguém", short: "Falei" },
  reuniao: { label: "Reunião marcada", short: "Reunião" },
  nao_abordar: { label: "Não abordar", short: "Não abordar" }
};

function directoryStatusOf(row) {
  return DIRECTORY_STATUS[row.directoryStatus] || DIRECTORY_STATUS.novo;
}
function digits(value) { return String(value || "").replace(/\D/g, ""); }
function telLink(value) {
  const d = digits(value);
  if (!d) return "";
  if (d.startsWith("0800")) return "tel:" + d;
  return "tel:+" + (d.length <= 11 ? "55" : "") + d;
}
function whatsappLink(value) { const d = digits(value); return d ? "https://wa.me/" + (d.length <= 11 ? "55" : "") + d : ""; }
function institutionTypeLabel(type) {
  return type === "ensino_superior" ? "Faculdade ou universidade" : "Escola ou colégio";
}
function recordProgress(row) {
  const fields = [row.phone || row.whatsapp, row.email, row.contactName, row.pain, row.nextAction || row.meetingAt];
  return Math.round(fields.filter(Boolean).length / fields.length * 100);
}

function pipeLabel(id) {
  return (KB.PIPELINE.find((p) => p.id === id) || { label: id }).label;
}
function histLabel(id) {
  return (KB.PRIOR_HISTORY.find((p) => p.id === id) || { label: id }).label;
}

function contactability(row) {
  const parts = [];
  let score = 0;
  if (row.whatsapp) { score += 30; parts.push("WhatsApp +30"); }
  if (row.phone) { score += 20; parts.push("telefone +20"); }
  if (row.email) { score += 20; parts.push("email +20"); }
  if (row.site) { score += 10; parts.push("site +10"); }
  if (row.contactName || row.role) { score += 10; parts.push("responsável +10"); }
  if (row.activeConfirmed === true) { score += 10; parts.push("ativa confirmada +10"); }
  return { score, grade: score >= 80 ? "A" : score >= 55 ? "B" : score >= 30 ? "C" : "D", parts };
}

function sameLocalDay(value) {
  if (!value) return false;
  const d = value.toDate ? value.toDate() : new Date(value);
  const now = new Date();
  return !Number.isNaN(d.getTime()) && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function loggedToday(row, actions) {
  return (row.log || []).some((l) => sameLocalDay(l.at) && actions.includes(l.action));
}

function validHttpUrl(value) {
  if (!value) return "";
  try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : ""; }
  catch { return ""; }
}

function formatDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function updateCallTimer() {
  const node = $("callTimer");
  if (node) node.textContent = callStartedAt ? formatDuration(Date.now() - callStartedAt) : "00:00";
}

function navHtml(target) {
  return VIEWS.filter(([id]) => id !== "access" || session.admin)
    .map(([id, label]) => `<button type="button" data-view="${id}" class="${view === id ? "on" : ""}">${label}</button>`)
    .join("");
}

function showApp() {
  el.gate.hidden = true;
  el.app.hidden = false;
  el.who.textContent = `${session.name} · ${session.role}`;
  el.nav.innerHTML = navHtml("nav");
  el.bottom.innerHTML = [
    ["dash", "Hoje"], ["crm", "Contatos"], ["cockpit", "Ligação"], ["follow", "Agenda"], ["more", "Mais"]
  ].map(([id, l]) => `<button type="button" data-view="${id}" class="${view === id ? "on" : ""}">${l}</button>`).join("");
  render();
}

function showGate(msg, denied) {
  el.app.hidden = true;
  el.gate.hidden = false;
  $("gateMsg").textContent = msg || $("gateMsg").textContent;
  if (denied) $("gateMsg").className = "bad";
}

async function googleIn() {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    $("gateMsg").textContent = e.message || "Falha no Google.";
  }
}

async function resolveAccess(user) {
  const email = emailKey(user.email);
  session.user = user;
  session.email = email;
  session.name = user.displayName || email.split("@")[0];
  session.admin = isSuperAdmin(email);
  if (session.admin) {
    session.role = "admin";
    session.allowed = true;
    await setDoc(doc(db, COL_ACCESS, email), {
      email,
      uid: user.uid,
      name: session.name,
      role: "admin",
      active: true,
      createdAt: serverTimestamp(),
      createdBy: email,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    }, { merge: true });
    return true;
  }
  const snap = await getDoc(doc(db, COL_ACCESS, email));
  if (!snap.exists() || snap.data().active !== true) {
    session.allowed = false;
    session.role = "none";
    return false;
  }
  const d = snap.data();
  session.role = d.role === "admin" ? "admin" : "operator";
  session.admin = session.role === "admin" && session.admin;
  session.allowed = true;
  await updateDoc(doc(db, COL_ACCESS, email), {
    uid: user.uid,
    name: session.name,
    lastLoginAt: serverTimestamp()
  }).catch(() => {});
  return true;
}

async function loadAll() {
  const [a, b, c] = await Promise.all([
    getDocs(collection(db, COL_INST)),
    getDocs(collection(db, COL_REF)),
    session.admin ? getDocs(collection(db, COL_ACCESS)) : Promise.resolve({ docs: [] })
  ]);
  inst = a.docs.map((d) => ({ id: d.id, ...d.data() }));
  refs = b.docs.map((d) => ({ id: d.id, ...d.data() }));
  users = c.docs ? c.docs.map((d) => ({ id: d.id, ...d.data() })) : [];
  inst.sort((x, y) => String(x.name || "").localeCompare(String(y.name || ""), "pt"));
}

async function seedPartnersIfNeeded() {
  const missing = KB.PARTNERS_SSA.filter((name) => {
    const row = inst.find((i) => norm(i.name) === norm(name) && norm(i.city || "Salvador") === "salvador");
    return !row || row.partnerIsaac !== true;
  });
  if (!missing.length) return 0;
  const batch = writeBatch(db);
  const at = nowIso();
  missing.forEach((name) => {
    const id = slugInst(name, "Salvador");
    const ref = doc(db, COL_INST, id);
    batch.set(ref, {
      name,
      city: "Salvador",
      state: "BA",
      region: "Nordeste",
      country: "Brasil",
      type: "educacao_basica",
      status: "parceiro",
      partnerIsaac: true,
      directoryOnly: false,
      priorHistory: "parceiro",
      origin: "lista oficial SSA",
      sourceFile: KB.SOURCES.ssa,
      ownerEmail: "",
      createdBy: session.email,
      createdAt: at,
      updatedAt: at,
      log: [{ at, by: session.email, action: "import_parceiro_ssa", note: "Fonte: Escolas parceiras isaac - SSA.html" }]
    }, { merge: true });
  });
  await batch.commit();
  await loadAll();
  toast(missing.length + " parceiras de Salvador sincronizadas.");
  return missing.length;
}

async function seedStarterDirectory() {
  directoryLoadError = "";
  const existing = new Set(inst.map((i) => slugInst(i.name, i.city)));
  const missing = KB.PROSPECT_STARTER.filter((item) => !existing.has(slugInst(item.name, item.city)));
  if (!missing.length) return 0;
  const batch = writeBatch(db);
  const at = nowIso();
  missing.forEach((item) => {
    const id = slugInst(item.name, item.city);
    batch.set(doc(db, COL_INST, id), {
      ...item,
      id,
      country: "Brasil",
      region: item.region || ({ BA: "Nordeste", SP: "Sudeste", RJ: "Sudeste", DF: "Centro-Oeste", SC: "Sul", RS: "Sul", AM: "Norte" }[item.state] || ""),
      status: "prospect",
      directoryStatus: "novo",
      directoryOnly: true,
      partnerIsaac: false,
      priorHistory: "desconhecido",
      contactSource: item.sourceUrl,
      origin: "pesquisa pública verificada",
      createdBy: session.email,
      createdAt: at,
      updatedAt: at,
      log: [{ at, by: session.email, action: "directory_import", note: item.sourceLabel }]
    });
  });
  await batch.commit();
  await loadAll();
  toast(missing.length + " instituições adicionadas à lista.");
  return missing.length;
}

function findDup(name, city, exceptId) {
  const s = slugInst(name, city);
  return inst.find((i) => i.id !== exceptId && (i.id === s || slugInst(i.name, i.city) === s));
}

function current() {
  return inst.find((i) => i.id === currentId) || null;
}

function filtered() {
  const q = norm(filterQ);
  if (!q) return inst;
  return inst.filter((i) => {
    const blob = [i.name, i.city, i.contactName, i.phone, i.whatsapp, i.email, i.ownerEmail, i.ownerName]
      .map(norm).join(" ");
    return blob.includes(q);
  });
}

async function saveInst(partial, logNote) {
  const row = current();
  if (!row) return;
  const next = { ...row, ...partial, updatedAt: nowIso() };
  if (logNote) {
    const log = Array.isArray(row.log) ? row.log.slice(0, 79) : [];
    log.unshift({ at: nowIso(), by: session.email, action: logNote, note: partial.status ? pipeLabel(partial.status) : "" });
    next.log = log;
  }
  await setDoc(doc(db, COL_INST, row.id), next, { merge: true });
  const i = inst.findIndex((x) => x.id === row.id);
  if (i >= 0) inst[i] = next;
  render();
}

async function createInst(data) {
  const dup = findDup(data.name, data.city);
  if (dup) return { dup };
  const id = slugInst(data.name, data.city);
  const row = {
    ...data,
    id,
    country: data.country || "Brasil",
    state: data.state || "BA",
    region: data.region || "Nordeste",
    status: data.status || "prospect",
    partnerIsaac: false,
    priorHistory: data.priorHistory || "desconhecido",
    createdBy: session.email,
    ownerEmail: data.ownerEmail || session.email,
    ownerName: data.ownerName || session.name,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    log: [{ at: nowIso(), by: session.email, action: "create", note: "cadastro" }]
  };
  await setDoc(doc(db, COL_INST, id), row);
  inst.unshift(row);
  currentId = id;
  return { row };
}

function signalsOf(row) {
  return {
    fit: row.fit || "?",
    dor: row.pain ? "sim" : "?",
    impacto: row.impact || "?",
    autoridade: row.authority || "?",
    interesse: row.interest || "?",
    timing: row.timing || "?",
    historico: row.priorHistory || "desconhecido"
  };
}

const SIGNAL_LABELS = { fit:"Perfil adequado", dor:"Problema identificado", impacto:"Impacto percebido", autoridade:"Pessoa que decide", interesse:"Interesse demonstrado", timing:"Momento de decidir", historico:"Histórico com a isaac" };
function signalFilled(value) { return Boolean(value && !["?", "desconhecido"].includes(String(value).toLowerCase())); }

function preCall(row) {
  const hist = histLabel(row.priorHistory);
  const obj = row.partnerIsaac
    ? "Não prospectar. Já parceira da isaac."
    : "Descobrir histórico + situação atual + interesse + chegar no responsável certo.";
  return [
    `Instituição: ${row.name}`,
    `Cidade: ${row.city || "—"} · ${row.type || ""}`,
    `Status: ${pipeLabel(row.status)}`,
    `Histórico anterior: ${hist}`,
    `Responsável: ${row.contactName || "—"} (${row.role || "—"})`,
    `Dono interno: ${row.ownerName || row.ownerEmail || "—"}`,
    `Última interação: ${fmt(row.updatedAt)}`,
    `Dor: ${row.pain || "ainda não mapeada"}`,
    `Objeção: ${row.objection || "—"}`,
    row.partnerIsaac ? "CUIDADO: já parceira." : (row.priorHistory && row.priorHistory !== "desconhecido" && row.priorHistory !== "nunca_contatado" ? "CUIDADO: já existe histórico." : ""),
    `Objetivo desta ligação: ${obj}`
  ].filter(Boolean).join("\n");
}

function summaryOf(row) {
  return [
    "Resumo da ligação — ISAAC SDR OS",
    `Instituição: ${row.name}`,
    `Cidade: ${row.city || ""} / ${row.state || ""}`,
    `Pessoa: ${row.contactName || "—"} · ${row.role || "—"}`,
    `Telefone: ${row.phone || "—"} · WhatsApp: ${row.whatsapp || "—"} · Email: ${row.email || "—"}`,
    `Cenário: ${pipeLabel(row.status)}`,
    `Histórico isaac: ${histLabel(row.priorHistory)}`,
    `Dores: ${row.pain || "—"}`,
    `Interesse: ${row.interest || "—"}`,
    `Objeções: ${row.objection || "—"}`,
    `O que chamou atenção: ${row.valueHook || "—"}`,
    `Autoridade: ${row.authority || "—"}`,
    `Momento para decidir: ${row.timing || "—"}`,
    `Reunião: ${row.meetingAt ? fmt(row.meetingAt) : "—"} · ${row.meetingStatus || "—"}`,
    `Participantes: ${row.meetingParticipants || "—"}`,
    `Pergunta para o time: ${row.teamQuestion || row.commitmentQuestion || "—"}`,
    `Razão para participar: ${row.commitmentReason || "—"}`,
    `Próximo passo: ${row.nextAction || "—"} ${row.nextActionAt ? "em " + row.nextActionAt : ""}`,
    `Indicação: ${row.lastReferral || "—"}`,
    `Obs: ${row.notes || "—"}`,
    `Operador: ${session.name} <${session.email}>`
  ].join("\n");
}

function followMsg(row) {
  const nome = (row.contactName || "").split(" ")[0] || "olá";
  return `Olá, ${nome}, tudo bem?\nPassando para retomar o que conversamos sobre previsibilidade financeira da ${row.name}. Quando for um bom momento, te conecto com o time da isaac para olhar a operação de vocês com calma.\nPosso te ligar quando?`;
}

function teamMsg(row) {
  return [
    "Encaminhamento para o time isaac",
    summaryOf(row),
    "",
    `Fontes usadas: ${row.contactSource || row.sourceUrl || "não registradas"}`,
    "Pedido: conversa de diagnóstico/fechamento. A pessoa que fez o primeiro contato NÃO negociou taxa, contrato ou aprovação de crédito."
  ].join("\n");
}

function meetingConfirmMsg(row) {
  const first = (row.contactName || "Olá").split(" ")[0];
  return `Olá, ${first}! Confirmando nossa conversa com o time isaac sobre a ${row.name}:\n\n📅 ${row.meetingAt ? fmt(row.meetingAt) : "data a confirmar"}\n🎯 Objetivo: ${row.meetingExpectation || row.pain || "entender o cenário e avaliar aderência"}\n❓ Pergunta principal: ${row.teamQuestion || row.commitmentQuestion || "a definir"}\n${row.meetingLink ? `🔗 ${row.meetingLink}\n` : ""}\nSe surgir algum imprevisto, me avise para remarcarmos. Nenhuma mensagem foi enviada automaticamente por este sistema.`;
}

function meetingEmail(row) {
  return `Assunto: Confirmação de diagnóstico — ${row.name}\n\nOlá, ${row.contactName || "responsável"},\n\nConfirmo a conversa com o time isaac em ${row.meetingAt ? fmt(row.meetingAt) : "data a confirmar"}.\n\nObjetivo: ${row.meetingExpectation || row.pain || "analisar o cenário da instituição e verificar aderência"}.\nPergunta que levaremos ao time: ${row.teamQuestion || row.commitmentQuestion || "a definir"}.\nParticipantes: ${row.meetingParticipants || "a confirmar"}.\n${row.meetingLink ? `Link: ${row.meetingLink}\n` : ""}\nCaso haja um imprevisto, podemos remarcar.\n\nAtenciosamente,\n${session.name}`;
}

function reminderMsg(row) {
  const first = (row.contactName || "Olá").split(" ")[0];
  return `Olá, ${first}! Passando para lembrar nossa conversa com o time isaac em ${row.meetingAt ? fmt(row.meetingAt) : "horário combinado"}. Vamos focar em: ${row.teamQuestion || row.commitmentQuestion || row.pain || "seu cenário atual"}. ${row.meetingLink ? `Link: ${row.meetingLink}` : "Se precisar do link, me avise."}`;
}

function rescheduleMsg(row) {
  const first = (row.contactName || "Olá").split(" ")[0];
  return `Olá, ${first}. Vi que não conseguimos realizar nossa conversa. Como o ponto sobre ${row.commitmentProblem || row.pain || "a operação da instituição"} continua relevante, posso reorganizar com o time isaac. Funciona melhor [opção A] ou [opção B]?`;
}

function downloadIcs(row) {
  if (!row.meetingAt) return toast("Defina data e horário antes de baixar o convite.");
  const start = new Date(row.meetingAt);
  if (Number.isNaN(start.getTime())) return toast("Data da reunião inválida.");
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const stamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const clean = (s) => String(s || "").replace(/[\\,;]/g, " ").replace(/\n/g, "\\n");
  const body = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//ISAAC SDR OS//PT-BR","BEGIN:VEVENT",`UID:${row.id}-${start.getTime()}@akashahub.com.br`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${clean(`Diagnóstico isaac — ${row.name}`)}`,`DESCRIPTION:${clean(row.meetingExpectation || row.pain || "Diagnóstico com o time isaac")}`,row.meetingLink ? `LOCATION:${clean(row.meetingLink)}` : "","END:VEVENT","END:VCALENDAR"].filter(Boolean).join("\r\n");
  const blob = new Blob([body], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `reuniao-isaac-${norm(row.name).replace(/[^a-z0-9]+/g,"-")}.ics`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Arquivo de calendário (.ics) baixado. Nada foi enviado.");
}

function dashStats() {
  const f = inst.filter((i) => !i.partnerIsaac && i.directoryOnly !== true);
  const count = (st) => f.filter((i) => i.status === st).length;
  const today = new Date().toISOString().slice(0, 10);
  const follows = f.filter((i) => i.nextActionAt);
  return {
    total: f.length,
    contatosHoje: f.filter((i) => loggedToday(i, ["attempt", "responsavel_alcancado", "call_step", "status"])).length,
    alcancados: f.filter((i) => loggedToday(i, ["responsavel_alcancado"])).length,
    qualificadas: f.filter((i) => ["qualificado","interessado","call_agendada","encaminhado"].includes(i.status) && sameLocalDay(i.updatedAt)).length,
    calls: f.filter((i) => i.meetingAt && !["cancelada","no_show"].includes(i.meetingStatus)).length,
    callsHoje: f.filter((i) => sameLocalDay(i.meetingAt) && !["cancelada","no_show"].includes(i.meetingStatus)).length,
    ganhos: f.filter((i) => i.status === "parceiro").length,
    remarcacoes: f.reduce((n, i) => n + Number(i.meetingRescheduleCount || 0), 0),
    followToday: follows.filter((i) => String(i.nextActionAt).slice(0, 10) === today).length,
    atrasados: follows.filter((i) => String(i.nextActionAt).slice(0, 10) < today && !["parceiro", "perdido"].includes(i.status)).length,
    parceiros: f.filter((i) => i.partnerIsaac).length,
    semAcao: f.filter((i) => !i.nextActionAt && !["parceiro", "perdido"].includes(i.status)).length
  };
}

function renderDash() {
  const s = dashStats();
  const eligible = inst.filter((i) => !i.partnerIsaac && i.directoryOnly !== true && !["perdido","parceiro"].includes(i.status));
  const ranked = (rows) => rows.slice().sort((a,b) => contactability(b).score - contactability(a).score || String(a.nextActionAt || "").localeCompare(String(b.nextActionAt || ""))).slice(0,6);
  const queues = [
    ["Ligar agora", ranked(eligible.filter((i) => i.phone)), "phone"],
    ["WhatsApp agora", ranked(eligible.filter((i) => i.whatsapp)), "whatsapp"],
    ["E-mail agora", ranked(eligible.filter((i) => i.email)), "email"],
    ["Reativar agora", ranked(eligible.filter((i) => i.status === "reativacao" || ["conversou_sem_call","nao_compareceu","nao_avancou"].includes(i.priorHistory))), "react"]
  ];
  const progress = Math.min(100, Math.round((s.contatosHoje / 15) * 100));
  const winProgress = Math.min(100, Math.round((s.ganhos / 90) * 100));
  return `
    <section class="today-hero">
      <p class="kicker">HOJE · CENTRAL DE EXECUÇÃO</p>
      <h1>Abra uma ficha, alcance o responsável e saia com a reunião marcada.</h1>
      <p>Seu papel é qualificar e preparar a ponte. Taxa, contrato e crédito ficam com o time isaac.</p>
      <div class="goal-line"><strong>${s.contatosHoje}/15 contatos</strong><div class="progress"><i style="width:${progress}%"></i></div><span>${s.ganhos}/90 ganhos até 31/12</span></div>
    </section>
    <div class="metric-grid">
      ${[["Contatos hoje",s.contatosHoje],["Responsáveis alcançados",s.alcancados],["Conversas qualificadas",s.qualificadas],["Reuniões agendadas",s.calls],["Reuniões hoje",s.callsHoje],["Retornos atrasados",s.atrasados],["Remarcações",s.remarcacoes],["Sem próxima ação",s.semAcao]].map(([l,n])=>`<article class="metric"><strong>${n}</strong><span>${l}</span></article>`).join("")}
    </div>
    <div class="card" style="margin-bottom:12px"><div class="goal-line"><strong>Progresso da meta de 90</strong><div class="progress"><i style="width:${winProgress}%"></i></div><span>${winProgress}%</span></div></div>
    <div class="queue-grid">${queues.map(([title,rows,kind])=>`<section class="queue"><div class="queue-head"><h3>${title}</h3><span>${rows.length} prioridade(s)</span></div>${rows.map((i)=>{const c=contactability(i);return `<div class="queue-item"><div><strong>${esc(i.name)}</strong><small>${esc(i.city||"")} · ${c.grade} ${c.score}/100 · ${esc((kind==="phone"?i.phone:kind==="whatsapp"?i.whatsapp:kind==="email"?i.email:histLabel(i.priorHistory))||"")}</small></div><button class="btn" data-call="${esc(i.id)}" type="button">Abrir</button></div>`}).join("")||`<div class="empty">Nenhuma ação disponível com dados reais.</div>`}</section>`).join("")}</div>
    <p class="safe-note">As filas usam contatos existentes, histórico e score transparente. Parceiras oficiais são sempre excluídas.</p>
  `;
}

function renderCrm() {
  const rows = filtered().filter((i) => i.directoryOnly !== true && !i.partnerIsaac);
  const withMeeting = rows.filter((i) => i.meetingAt).length;
  const needAction = rows.filter((i) => !i.nextActionAt && !i.meetingAt).length;
  return `
    <p class="kicker">CONTATOS EM ANDAMENTO</p>
    <h2>Registros fáceis de acompanhar</h2>
    <p class="plain-help">Aqui ficam somente as instituições que você decidiu trabalhar. “CRM” significa apenas organização dos contatos e das conversas.</p>
    <div class="record-overview">
      <div><b>${rows.length}</b><span>em andamento</span></div>
      <div><b>${withMeeting}</b><span>com reunião</span></div>
      <div><b>${needAction}</b><span>precisam de próximo passo</span></div>
    </div>
    <details class="card new-record">
      <summary>＋ Cadastrar uma instituição manualmente</summary>
      <form id="newInst" style="margin-top:14px">
        <label>Nome da instituição <input name="name" required placeholder="Nome da escola ou faculdade"></label>
        <div class="duo">
          <label>Cidade <input name="city" value="Salvador"></label>
          <label>Tipo <select name="type">${KB.INST_TYPES.map((t) => `<option value="${t.id}">${t.label}</option>`).join("")}</select></label>
        </div>
        <div class="duo">
          <label>Nome do responsável <input name="contactName"></label>
          <label>Função dessa pessoa <input name="role" placeholder="Diretor, mantenedor, financeiro..."></label>
        </div>
        <div class="duo">
          <label>WhatsApp <input name="whatsapp" inputmode="tel"></label>
          <label>Telefone <input name="phone" inputmode="tel"></label>
        </div>
        <div class="duo">
          <label>E-mail da instituição <input name="email" type="email"></label>
          <label>Site oficial <input name="site" type="url" placeholder="https://"></label>
        </div>
        <label>Onde você encontrou o contato <input name="contactSource" placeholder="Site oficial, indicação..."></label>
        <label>Como chegou até ela <input name="origin" placeholder="Indicação, pesquisa, visita..."></label>
        <div class="row"><button class="btn btn-p" type="submit">Salvar e abrir registro</button></div>
        <p class="muted" id="dupWarn" style="margin-top:8px"></p>
      </form>
    </details>
    <div class="record-list">
      ${rows.map((i) => {
        const c = contactability(i);
        const progress = recordProgress(i);
        const next = i.meetingAt ? `Reunião: ${fmt(i.meetingAt)}` : i.nextActionAt ? `${i.nextAction || "Próximo contato"}: ${i.nextActionAt}` : "Defina o próximo passo";
        return `<article class="record-card">
          <div class="record-head">
            <div><span class="record-kind">${esc(institutionTypeLabel(i.type))}</span><h3>${esc(i.name)}</h3><p>${esc(i.city || "")} / ${esc(i.state || "")}</p></div>
            <span class="st ${esc(i.status)}">${esc(pipeLabel(i.status))}</span>
          </div>
          <div class="record-progress"><span style="width:${progress}%"></span></div>
          <div class="record-grid">
            <p><small>Contato</small><b>${esc(i.contactName || "Ainda não identificado")}</b></p>
            <p><small>Facilidade de contato</small><b>Prioridade ${c.grade} · ${c.score}/100</b></p>
            <p class="${i.nextActionAt || i.meetingAt ? "ok-text" : "attention-text"}"><small>Próximo movimento</small><b>${esc(next)}</b></p>
            <p><small>Última atualização</small><b>${esc(fmt(i.updatedAt))}</b></p>
          </div>
          <div class="record-actions">
            ${i.phone ? `<a class="btn" href="${esc(telLink(i.phone))}">Ligar</a>` : ""}
            ${i.whatsapp ? `<a class="btn" href="${esc(whatsappLink(i.whatsapp))}" target="_blank" rel="noopener">Abrir WhatsApp</a>` : ""}
            <button class="btn" data-open="${esc(i.id)}" type="button">Ver e editar</button>
            <button class="btn btn-p" data-call="${esc(i.id)}" type="button">Abrir ligação</button>
          </div>
        </article>`;
      }).join("") || '<div class="empty">Nenhum contato em andamento. Escolha uma instituição na Lista de instituições.</div>'}
    </div>`;
}

function renderPipe() {
  const cols = KB.PIPELINE.map((p) => {
    const items = filtered().filter((i) => i.directoryOnly !== true && !i.partnerIsaac && i.status === p.id);
    return `<div class="col"><h4>${p.label} · ${items.length}</h4>${items.map((i) =>
      `<button class="pill" data-open="${esc(i.id)}" type="button">${esc(i.name)}<br><small class="muted">${esc(i.city || "")}</small></button>`
    ).join("")}</div>`;
  }).join("");
  return `<p class="kicker">ETAPAS</p><h2>Onde está cada conversa</h2><p class="plain-help">As colunas mostram o avanço de cada instituição, do primeiro contato até a reunião.</p><div class="kanban">${cols}</div>`;
}

function renderFollow() {
  const today = new Date().toISOString().slice(0, 10);
  const list = filtered().filter((i) => i.directoryOnly !== true && !i.partnerIsaac && !["parceiro", "perdido"].includes(i.status));
  const buckets = [
    ["Reuniões agendadas", list.filter((i) => i.meetingAt && !["realizada","cancelada","no_show"].includes(i.meetingStatus))],
    ["Hoje", list.filter((i) => String(i.nextActionAt || "").slice(0, 10) === today)],
    ["Atrasados", list.filter((i) => i.nextActionAt && String(i.nextActionAt).slice(0, 10) < today)],
    ["Próximos", list.filter((i) => i.nextActionAt && String(i.nextActionAt).slice(0, 10) > today)],
    ["Sem próxima ação", list.filter((i) => !i.nextActionAt)]
  ];
  return `<p class="kicker">RETORNOS E REUNIÕES</p><h2>Agenda</h2><p class="plain-help">“Retorno” é o dia combinado para falar novamente com a instituição.</p>` + buckets.map(([t, rows]) => `
    <div class="card" style="margin-bottom:10px">
      <h2>${t} · ${rows.length}</h2>
      <div class="list">${rows.map((i) => `
        <article class="item">
          <strong>${esc(i.name)}</strong>
          <p class="muted">${esc(i.meetingAt ? `Reunião · ${fmt(i.meetingAt)} · ${i.meetingStatus || "aguardando confirmação"}` : `${i.nextAction || "—"} · ${i.nextActionAt || ""}`)}</p>
          <button class="btn" data-open="${esc(i.id)}" type="button">Abrir</button>
        </article>`).join("") || "<p class='muted'>Vazio.</p>"}</div>
    </div>`).join("");
}

function renderDirectory() {
  const all = filtered().filter((i) => i.directoryOnly === true && !i.partnerIsaac);
  const cities = [...new Set(all.map((i) => i.city).filter(Boolean))].sort((a,b) => a.localeCompare(b, "pt-BR"));
  const rows = all.filter((i) =>
    (directoryTypeFilter === "all" || i.type === directoryTypeFilter) &&
    (directoryStatusFilter === "all" || (i.directoryStatus || "novo") === directoryStatusFilter) &&
    (directoryCityFilter === "all" || i.city === directoryCityFilter)
  ).sort((a, b) => contactability(b).score - contactability(a).score || String(a.name).localeCompare(String(b.name), "pt-BR"));
  const untouched = all.filter((i) => (i.directoryStatus || "novo") === "novo").length;
  const schools = all.filter((i) => i.type === "educacao_basica").length;
  const colleges = all.filter((i) => i.type === "ensino_superior").length;
  return `
    <p class="kicker">LISTA DE INSTITUIÇÕES</p>
    <h2>Escolha, contate e marque o resultado</h2>
    <p class="plain-help">Esta lista é separada dos contatos em andamento. Escolha uma instituição e toque em “Começar contato” para levá-la ao seu trabalho diário. As que têm mais telefone, WhatsApp e e-mail aparecem primeiro.</p>
    ${directoryLoadError ? `<div class="warn"><b>A lista não carregou:</b> ${esc(directoryLoadError)}. Toque em “Carregar/atualizar lista” ou peça para conferir as regras do banco.</div>` : ""}
    <div class="row" style="margin:12px 0"><button class="btn btn-p" id="seedDirectoryBtn" type="button">Carregar/atualizar lista</button><span class="muted">Não apaga nem muda os contatos que você já trabalhou.</span></div>
    <details class="card" style="margin-bottom:12px"><summary><b>Adicionar escola ou faculdade manualmente</b></summary><form id="newDirectory" style="margin-top:12px"><div class="duo"><label>Nome da instituição <input name="name" required></label><label>Cidade <input name="city" required></label></div><div class="duo"><label>Estado <input name="state" maxlength="2" placeholder="BA" required></label><label>Tipo <select name="type">${KB.INST_TYPES.map((t)=>`<option value="${t.id}">${esc(t.label)}</option>`).join("")}</select></label></div><div class="duo"><label>WhatsApp <input name="whatsapp"></label><label>Telefone <input name="phone"></label></div><div class="duo"><label>E-mail <input name="email" type="email"></label><label>Site oficial <input name="site" type="url"></label></div><label>Fonte pública dos dados <input name="contactSource" placeholder="Link do site ou nome da fonte"></label><button class="btn btn-ok" type="submit">Adicionar à lista</button><p class="muted">Você pode preencher só nome, cidade, estado e tipo. Complete os contatos depois em “Editar informações”.</p></form></details>
    <div class="directory-summary">
      <div><b>${all.length}</b><span>verificadas</span></div>
      <div><b>${schools}</b><span>escolas</span></div>
      <div><b>${colleges}</b><span>faculdades</span></div>
      <div><b>${untouched}</b><span>ainda não tentadas</span></div>
    </div>
    <div class="directory-toolbar">
      <div class="segmented">
        <button type="button" data-dir-type="all" class="${directoryTypeFilter === "all" ? "on" : ""}">Todas</button>
        <button type="button" data-dir-type="educacao_basica" class="${directoryTypeFilter === "educacao_basica" ? "on" : ""}">Escolas</button>
        <button type="button" data-dir-type="ensino_superior" class="${directoryTypeFilter === "ensino_superior" ? "on" : ""}">Faculdades</button>
      </div>
      <label>Cidade
        <select id="directoryCity"><option value="all">Todas</option>${cities.map((c)=>`<option value="${esc(c)}" ${directoryCityFilter === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
      </label>
      <label>Situação do contato
        <select id="directoryStatus"><option value="all">Todas</option>${Object.entries(DIRECTORY_STATUS).map(([id,s])=>`<option value="${id}" ${directoryStatusFilter === id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}</select>
      </label>
    </div>
    <p class="result-count">${rows.length} instituições visíveis</p>
    <div class="directory-list">${rows.map((i) => {
      const c = contactability(i);
      const ds = i.directoryStatus || "novo";
      const done = ds !== "novo";
      const editing = directoryEditId === i.id;
      const source = validHttpUrl(i.sourceUrl || i.contactSource);
      return `<article class="directory-card status-${esc(ds)} ${done ? "done" : ""}">
        <div class="directory-main">
          <div class="directory-title">
            <span class="record-kind">${esc(institutionTypeLabel(i.type))}</span>
            <h3 class="dir-name">${esc(i.name)}</h3>
            <p>${esc(i.city || "")} / ${esc(i.state || "")} · prioridade ${esc(i.priority || c.grade)}</p><p class="verified-line">Contato conferido em ${esc(i.verifiedAt ? i.verifiedAt.split("-").reverse().join("/") : "data não informada")} · ${esc(i.sourceLabel || "fonte pública")}</p>
          </div>
          <span class="directory-state">${esc(directoryStatusOf(i).short)}</span>
        </div>
        <div class="contact-chips">
          ${i.whatsapp ? `<a href="${esc(whatsappLink(i.whatsapp))}" target="_blank" rel="noopener"><small>WhatsApp</small><b>${esc(i.whatsapp)}</b></a>` : ""}
          ${i.phone ? `<a href="${esc(telLink(i.phone))}"><small>Telefone</small><b>${esc(i.phone)}</b></a>` : ""}
          ${i.email ? `<a href="mailto:${esc(i.email)}"><small>E-mail</small><b>${esc(i.email)}</b></a>` : ""}
          ${i.site ? `<a href="${esc(i.site)}" target="_blank" rel="noopener"><small>Site</small><b>Abrir site oficial</b></a>` : ""}
        </div>
        <div class="directory-check">
          <span>Marque o que aconteceu:</span>
          ${Object.entries(DIRECTORY_STATUS).map(([id,s])=>`<button type="button" data-dir-status="${id}" data-id="${esc(i.id)}" class="${ds === id ? "on" : ""}">${esc(s.short)}</button>`).join("")}
        </div>
        <div class="directory-actions">
          <button class="btn" data-dir-edit="${esc(i.id)}" type="button">${editing ? "Fechar edição" : "Editar informações"}</button>
          ${source ? `<a class="btn" href="${esc(source)}" target="_blank" rel="noopener">Ver fonte pública</a>` : ""}
          <button class="btn btn-p" data-promote="${esc(i.id)}" type="button">Começar contato</button>
        </div>
        ${editing ? `<form class="directory-edit" data-directory-form>
          <input type="hidden" name="id" value="${esc(i.id)}">
          <div class="duo"><label>Nome <input name="name" value="${esc(i.name || "")}" required></label><label>Cidade <input name="city" value="${esc(i.city || "")}"></label></div>
          <div class="duo"><label>Tipo <select name="type">${KB.INST_TYPES.map((t)=>`<option value="${t.id}" ${t.id===i.type?"selected":""}>${esc(t.label)}</option>`).join("")}</select></label><label>Estado <input name="state" value="${esc(i.state || "BA")}" maxlength="2"></label></div>
          <div class="duo"><label>WhatsApp <input name="whatsapp" value="${esc(i.whatsapp || "")}"></label><label>Telefone <input name="phone" value="${esc(i.phone || "")}"></label></div>
          <div class="duo"><label>E-mail <input name="email" type="email" value="${esc(i.email || "")}"></label><label>Site oficial <input name="site" type="url" value="${esc(i.site || "")}"></label></div>
          <label>Fonte pública <input name="contactSource" value="${esc(i.contactSource || i.sourceUrl || "")}"></label>
          <button class="btn btn-ok" type="submit">Salvar alterações</button>
        </form>` : ""}
      </article>`;
    }).join("") || '<div class="empty">Nenhuma instituição combina com os filtros escolhidos.</div>'}</div>`;
}

function renderReact() {
  const rows = filtered().filter((i) => i.directoryOnly !== true && !i.partnerIsaac && (i.status === "reativacao" || ["ja_recebeu_contato","conversou_sem_call","nao_compareceu","participou_call","recebeu_proposta","nao_avancou"].includes(i.priorHistory)));
  return `<p class="kicker">Reativação</p><h2>Retomar do ponto certo</h2><div class="list">${rows.map((i)=>`<article class="item"><div class="row" style="justify-content:space-between"><strong>${esc(i.name)}</strong><span class="st reativacao">${esc(histLabel(i.priorHistory))}</span></div><p class="muted">Último contato: ${esc(fmt(i.updatedAt))} · tentativas: ${Number(i.attemptCount||0)} · remarcações: ${Number(i.meetingRescheduleCount||0)}</p><p><b>Última objeção:</b> ${esc(i.objection||"—")}</p><p><b>O que interessou:</b> ${esc(i.valueHook||"—")}</p><p><b>Próxima pergunta:</b> ${esc(i.teamQuestion||"O que mudou desde a última conversa?")}</p><div class="row"><button class="btn btn-p" data-call="${esc(i.id)}" type="button">Abrir reativação</button></div></article>`).join("")||`<div class="empty">Nenhuma reativação identificada no histórico atual.</div>`}</div>`;
}

function renderProof() {
  return `<p class="kicker">PROVAS E DADOS CONFIRMADOS</p><h2>Informações seguras para usar na conversa</h2><p class="warn">Deck de escolas e deck de ensino superior permanecem separados. Se o status for “revisar”, não trate como promessa.</p><div class="proof-grid" style="margin-top:12px">${KB.PROOF_VAULT.map((p)=>`<article class="proof-card"><span class="${p.status === "aprovado" ? "approved" : "review"}">${esc(p.status.toUpperCase())}</span><h3>${esc(p.claim)}</h3><p>${esc(p.segment)} · ${esc(p.product)}</p><small>Fonte: ${esc(p.source)}</small><small>Usar em: ${esc(p.use)}</small><small><b>Restrição:</b> ${esc(p.restriction)}</small></article>`).join("")}</div>`;
}

function renderMore() {
  const items = VIEWS.filter(([id]) => !["dash","crm","cockpit","follow","more"].includes(id) && (id !== "access" || session.admin));
  return `<p class="kicker">MAIS</p><h2>Ferramentas da operação</h2><div class="cards">${items.map(([id,label])=>`<button class="card" style="color:inherit;text-align:left" data-view="${id}" type="button"><strong>${esc(label)}</strong><span>Abrir área</span></button>`).join("")}</div><div class="card glossary"><h3>Palavras do aplicativo</h3><p><b>CRM:</b> organização dos contatos e das conversas.</p><p><b>Etapas:</b> caminho desde o primeiro contato até a reunião.</p><p><b>SDR:</b> pessoa que pesquisa, conversa, identifica interesse e agenda a reunião.</p><p><b>Provas e dados:</b> informações confirmadas que podem ser usadas na conversa.</p><p><b>Retorno:</b> dia marcado para falar novamente.</p><p><b>Prioridade A, B, C ou D:</b> mostra quantas formas de contato foram encontradas. A tem mais informações; D tem menos.</p></div>`;
}

function renderCockpit() {
  const row = current();
  if (!row) {
    const recent = filtered().filter((i) => i.directoryOnly !== true && !i.partnerIsaac).slice(0, 12);
    return `<p class="kicker">ROTEIRO DA LIGAÇÃO</p><h2>Escolha uma instituição</h2>
      <div class="list">${recent.map((i) => `<article class="item"><strong>${esc(i.name)}</strong>
        <span class="st ${esc(i.status)}">${esc(pipeLabel(i.status))}</span>
        <div class="row"><button class="btn btn-p" data-call="${esc(i.id)}" type="button">Entrar na ligação</button></div>
      </article>`).join("")}</div>`;
  }
  if (row.partnerIsaac) {
    return `<div class="warn"><b>Já parceira da isaac.</b> ${esc(row.name)} está na lista oficial de Salvador. Não prospectar. Fonte: ${esc(KB.SOURCES.ssa)}</div>
      <div class="row" style="margin-top:12px"><button class="btn" data-view="parc" type="button">Ver parceiras</button></div>`;
  }
  const callSteps = activeCallSteps();
  const step = callSteps[Math.min(callStep, callSteps.length - 1)];
  const sig = signalsOf(row);
  const qualificationDone = Object.values(sig).filter(signalFilled).length;
  const cscore = contactability(row);
  const obj = KB.OBJECTIONS.find((o) => o.id === row.objectionId);
  return `
    <div class="call-mode-switch"><button type="button" data-call-mode="fast" class="${callMode === "fast" ? "on" : ""}">Rápido · 2 min</button><button type="button" data-call-mode="complete" class="${callMode === "complete" ? "on" : ""}">Completo</button><button type="button" class="btn" id="openCallPanel">Abrir roteiro flutuante</button></div><p class="safe-note">Você não precisa terminar o roteiro. Surgiu interesse, dor clara ou objeção resolvida? Vá direto para o horário.</p><div class="call-topline"><p class="kicker">ROTEIRO DA LIGAÇÃO · ${callMode === "fast" ? "RÁPIDO" : "COMPLETO"} · ${callStep + 1}/${callSteps.length}</p><div class="row"><span class="timer" id="callTimer">${callStartedAt ? formatDuration(Date.now()-callStartedAt) : "00:00"}</span><button class="btn" id="timerToggle" type="button">${callStartedAt ? "Pausar" : "Iniciar"}</button><button class="btn" data-act="attempt" type="button">Registrar tentativa</button><button class="btn btn-ok" data-act="reached" type="button">Responsável alcançado</button></div></div>
    <div class="cols cols-2">
      <div>
        <div class="card">
          <h2>${esc(row.name)}</h2>
          <p class="muted">${esc(row.city || "")} · ${esc((KB.INST_TYPES.find((t) => t.id === row.type) || {}).label || "")} · ${esc(row.contactName || "sem nome")} (${esc(row.role || "—")})</p>
           <p><span class="st ${esc(row.status)}">${esc(pipeLabel(row.status))}</span></p>
          <p class="safe-note">Facilidade de contato: prioridade ${cscore.grade} · ${cscore.score}/100 · ${esc(cscore.parts.join(" · ") || "dados insuficientes")}</p>
          <pre class="pre hint" style="margin-top:10px">${esc(preCall(row))}</pre>
          <label>Status
            <select id="stSel">${KB.PIPELINE.map((p) => `<option value="${p.id}" ${p.id === row.status ? "selected" : ""}>${p.label}</option>`).join("")}</select>
          </label>
          <label>Histórico anterior com a isaac
            <select id="histSel">${KB.PRIOR_HISTORY.map((p) => `<option value="${p.id}" ${p.id === row.priorHistory ? "selected" : ""}>${p.label}</option>`).join("")}</select>
          </label>
          <div class="duo">
            <label>Responsável <input id="cName" value="${esc(row.contactName || "")}"></label>
            <label>Cargo <input id="cRole" value="${esc(row.role || "")}"></label>
          </div>
          <div class="duo">
            <label>WhatsApp <input id="cWa" value="${esc(row.whatsapp || "")}"></label>
            <label>Telefone <input id="cPhone" value="${esc(row.phone || "")}"></label>
          </div>
          <div class="duo">
            <label>Email institucional <input id="cEmail" type="email" value="${esc(row.email || "")}"></label>
            <label>Site oficial <input id="cSite" type="url" value="${esc(row.site || "")}"></label>
          </div>
          <label>Fonte pública do contato <input id="contactSource" value="${esc(row.contactSource || row.sourceUrl || "")}" placeholder="URL ou nome da fonte"></label>
          <label>Dono interno
              <select id="cOwner">${(users.length ? users : [{ email: session.email, name: session.name }]).map((u) => {
                const em = u.email || u.id;
                return `<option value="${esc(em)}" ${em === row.ownerEmail ? "selected" : ""}>${esc(u.name || em)}</option>`;
              }).join("")}</select>
            </label>
        </div>
        <div class="call-stage" style="margin-top:10px">
          <p class="step">${esc(step.title)} · por que: ${esc(step.why)}</p>
          <p class="call-question">${esc(callStepAsk(step, row))}</p>
          <p class="intent"><b>Sinais para observar:</b> ${esc(step.watch)}</p>
          <div class="row">${step.quick.map((q) => `<button class="btn" data-quick="${esc(q)}" type="button">${esc(q)}</button>`).join("")}</div>
          <div class="booking-strip"><div><b>Percebeu abertura?</b><span>Pare o roteiro e marque o horário. O restante dos dados é opcional.</span></div><button class="btn btn-ok" data-act="jumpSchedule" type="button">Agendar agora</button></div>
          <div class="call-support"><p><b>Apoio interno:</b> se pedirem números ou comprovação, abra Provas e dados; se perguntarem o que é ou como funciona, abra Como funciona; se resistirem, use Objeções. Para voltar, toque em Ligação.</p><div class="row"><button class="btn" data-view="proof" type="button">Abrir Provas e dados</button><button class="btn" data-view="base" type="button">Abrir Como funciona</button><button class="btn" data-view="obj" type="button">Abrir Objeções</button></div></div>
          <label>Anotação desta etapa <textarea id="stepNote" placeholder="o que a pessoa disse">${esc((row.answers && row.answers[step.id]) || "")}</textarea></label>
          <div class="row">
            <button class="btn" id="prevStep" type="button">Voltar</button>
            <button class="btn btn-p" id="nextStep" type="button">Registrar e avançar</button>
          </div>
        </div>
      </div>
      <div>
        <div class="card qualification-card">
          <div class="qualification-title"><div><p class="kicker">QUALIFICAÇÃO</p><h2>O que já ficou claro</h2><p>Preencha durante a conversa, sem transformar a ligação em interrogatório.</p></div><div class="qualification-score"><b>${qualificationDone}/7</b><span>pontos entendidos</span></div></div>
          <div class="qualification-signals">${Object.entries(sig).map(([key,value]) => `<div class="${signalFilled(value) ? "is-ready" : ""}"><small>${esc(SIGNAL_LABELS[key] || key)}</small><b>${esc(signalFilled(value) ? value : "Ainda não")}</b></div>`).join("")}</div>
          <div class="qualification-fields">
            <label><span>Dor principal</span><small>Qual problema mais pesa?</small><input id="pain" value="${esc(row.pain || "")}" placeholder="Ex.: atraso afeta o caixa"></label>
            <label><span>Interesse</span><small>O que ela quer entender?</small><input id="interest" value="${esc(row.interest || "")}" placeholder="Ex.: previsibilidade"></label>
            <label><span>Autoridade</span><small>Quem participa da decisão?</small><input id="authority" value="${esc(row.authority || "")}" placeholder="Ex.: mantenedor e financeiro"></label>
            <label><span>Momento para decidir</span><small>Agora, semestre ou rematrícula?</small><input id="timing" value="${esc(row.timing || "")}" placeholder="Ex.: depois da rematrícula"></label>
            <label class="wide"><span>O que chamou atenção</span><small>Use as palavras da própria pessoa.</small><input id="valueHook" value="${esc(row.valueHook || "")}" placeholder="Ex.: receber na data combinada"></label>
            <label class="wide"><span>Notas importantes</span><small>Somente o necessário para o time de fechamento.</small><textarea id="notes" placeholder="Resumo curto da conversa">${esc(row.notes || "")}</textarea></label>
          </div>
        </div>
        <div class="card" style="margin-top:10px">
          <p class="kicker">Objeção</p>
          <select id="objSel">
            <option value="">— selecionar —</option>
            ${objectionGroups().map((group) => `<optgroup label="${esc(group.title)}">${group.items.map((o) => `<option value="${o.id}" ${row.objectionId === o.id ? "selected" : ""}>${esc(o.said)}</option>`).join("")}</optgroup>`).join("")}
          </select>
          ${obj ? `<div class="hint obj-live" style="margin-top:8px"><p><b>Pode querer dizer:</b> ${esc(obj.means)}</p><p class="obj-ask"><b>PERGUNTE:</b> ${esc(obj.ask)}</p><p><b>Valor:</b> ${esc(obj.value)}</p><p><b>Prova:</b> ${esc(obj.proof || "—")}</p>${obj.reflection && obj.reflection.length ? `<p><b>Frases de impacto — escolha uma:</b><br>${obj.reflection.map((phrase, index) => `${index + 1}. ${esc(phrase)}`).join("<br>")}</p>` : ""}${obj.booking && obj.booking.length ? `<div class="booking-lines"><b>FECHAR O HORÁRIO AGORA:</b><br>${obj.booking.map((phrase, index) => `${index + 1}. ${esc(phrase)}`).join("<br>")}</div>` : ""}<p class="obj-advance"><b>AVANÇO:</b> ${esc(obj.advance)}</p><p><b>Não insistir:</b> ${esc(obj.stop)}</p><button class="btn btn-ok" data-act="jumpSchedule" type="button">Ir direto para agendamento</button></div>` : ""}
        </div>
        <div class="card meeting-box" id="meetingBox" style="margin-top:10px">
          <p class="kicker">CONVERSÃO PRINCIPAL</p><h2>Agendar reunião</h2>
          <div class="duo"><label>Data e horário <input id="meetingAt" type="datetime-local" value="${esc(row.meetingAt ? new Date(new Date(row.meetingAt).getTime()-new Date(row.meetingAt).getTimezoneOffset()*60000).toISOString().slice(0,16) : "")}"></label><label>Fuso horário <select id="meetingTimezone"><option value="America/Bahia" ${(row.meetingTimezone||"America/Bahia") === "America/Bahia" ? "selected" : ""}>Bahia / Brasília</option><option value="Europe/Helsinki" ${row.meetingTimezone === "Europe/Helsinki" ? "selected" : ""}>Helsinque</option></select></label></div>
          <div class="duo"><label>Status <select id="meetingStatus">${["aguardando_confirmacao","confirmada","realizada","no_show","remarcada","cancelada"].map((s)=>`<option value="${s}" ${s === row.meetingStatus ? "selected" : ""}>${s.replaceAll("_"," ")}</option>`).join("")}</select></label><label>Closer/time isaac <input id="isaacCloser" value="${esc(row.isaacCloser||"")}" placeholder="se conhecido"></label></div>
          <label>Participantes necessários <input id="meetingParticipants" value="${esc(row.meetingParticipants||"")}" placeholder="responsável, sócio, financeiro..."></label>
          <label>Link da reunião <input id="meetingLink" type="url" value="${esc(row.meetingLink||"")}" placeholder="somente se fornecido"></label>
          <label>Expectativa para a reunião <input id="meetingExpectation" value="${esc(row.meetingExpectation||"")}" placeholder="o que será analisado"></label>
          <label>Dúvida que o time isaac precisa responder <input id="teamQuestion" value="${esc(row.teamQuestion||"")}"></label>
          <div class="anchor-box"><p class="kicker">ÂNCORA DE COMPROMISSO</p><label>Problema reconhecido <input id="commitmentProblem" value="${esc(row.commitmentProblem||row.pain||"")}"></label><label>Impacto percebido <input id="commitmentImpact" value="${esc(row.commitmentImpact||row.impact||"")}"></label><label>Resultado que deseja entender <input id="commitmentDesired" value="${esc(row.commitmentDesired||"")}"></label><label>Principal motivo para participar <input id="commitmentReason" value="${esc(row.commitmentReason||"")}"></label><label>Pergunta que deseja fazer <input id="commitmentQuestion" value="${esc(row.commitmentQuestion||"")}"></label></div>
          <div class="row"><button class="btn btn-ok" data-act="schedule" type="button">Agendar reunião</button><button class="btn" data-act="copyConfirm" type="button">Copiar WhatsApp</button><button class="btn" data-act="copyEmail" type="button">Copiar email</button><button class="btn" data-act="copyReminder" type="button">Copiar lembrete</button><button class="btn" data-act="reschedule" type="button">Remarcar</button><button class="btn" data-act="ics" type="button">Baixar calendário (.ics)</button></div>
          <p class="safe-note">Nenhum botão envia mensagem. Copiar e baixar são ações locais.</p>
        </div>
        <div class="card" style="margin-top:10px">
          <p class="kicker">Próximo passo</p>
          <label>Ação <input id="nextAction" value="${esc(row.nextAction || "")}" placeholder="ligar, encaminhar, material..."></label>
          <label>Quando <input id="nextActionAt" type="date" value="${esc(String(row.nextActionAt || "").slice(0, 10))}"></label>
          <div class="row">
            <button class="btn" data-act="save" type="button">Salvar ficha</button>
            <button class="btn btn-ok" data-act="end" type="button">Encerrar ligação</button>
            <button class="btn btn-p" data-act="fwd" type="button">Encaminhar</button>
            <button class="btn" data-act="copySum" type="button">Copiar resumo</button>
            <button class="btn" data-act="copyFollow" type="button">Copiar mensagem de retorno</button>
            <button class="btn" data-act="copyTeam" type="button">Copiar para o time isaac</button>
            <button class="btn" data-act="ref" type="button">Registrar indicação</button>
            <button class="btn btn-bad" data-act="nofit" type="button">Não se encaixa</button>
          </div>
        </div>
        <div class="activity-log"><h3>Últimos registros</h3>${(row.log || []).slice(0, 8).map((l) => `<div><span></span><p><b>${esc(logActionLabel(l.action))}</b><small>${esc(fmt(l.at))} · ${esc(l.by || "usuário")}</small></p></div>`).join("") || "<p class='muted'>Nenhum registro ainda.</p>"}</div>
      </div>
    </div>`;
}

function renderInd() {
  return `<p class="kicker">Indicações</p><h2>Rede</h2>
    <form id="newRef" class="card">
      <div class="duo">
        <label>Quem indicou <input name="from" required></label>
        <label>Instituição indicada <input name="name" required></label>
      </div>
      <div class="duo">
        <label>Contato (se passou) <input name="contact"></label>
        <label>Relação <input name="rel" placeholder="amigo, outro diretor..."></label>
      </div>
      <label>Contexto <textarea name="ctx"></textarea></label>
      <button class="btn btn-p" type="submit">Salvar indicação</button>
    </form>
    <div class="list" style="margin-top:12px">${refs.map((r) => `<article class="item"><strong>${esc(r.name)}</strong><p class="muted">via ${esc(r.from)} · ${esc(r.rel || "")}</p><p>${esc(r.ctx || "")}</p></article>`).join("") || "<p class='muted'>Nenhuma ainda.</p>"}</div>`;
}

function renderPlay() {
  return `<p class="kicker">GUIA</p><h2>Treino interno explicado</h2>
    ${KB.PLAYBOOK.map((p) => `<article class="card" style="margin-bottom:8px"><h2>${esc(p.title)}</h2><p>${esc(p.body)}</p></article>`).join("")}
    <article class="card">
      <h2>Template de WhatsApp (SSA)</h2>
      <pre class="pre">${esc(KB.APPROACH.template)}</pre>
      <button class="btn" id="copyTpl" type="button">Copiar template</button>
      <p class="muted" style="margin-top:8px">Fonte: ${esc(KB.SOURCES.ssa)}</p>
    </article>`;
}

function renderObj() {
  const steps = activeCallSteps();
  const activeStep = steps[Math.min(callStep, steps.length - 1)];
  const selectedId = (current() || {}).objectionId;
  return `<p class="kicker">OBJEÇÕES NA ORDEM DA CONVERSA</p><h2>Encontre sem procurar</h2>
    <p class="plain-help">As objeções seguem a sequência do roteiro. A etapa mais provável agora fica destacada.</p>
    ${objectionGroups().map((group) => {
      const active = (group.stepIds || []).includes(activeStep && activeStep.id);
      return `<section class="objection-group ${active ? "is-current" : ""}">
        <header><div><p class="kicker">${esc(group.title)}</p><h3>${esc(group.help)}</h3></div>${active ? "<span>ETAPA ATUAL</span>" : ""}</header>
        ${group.items.map((o) => `<article class="card objection-card ${selectedId === o.id ? "is-selected" : ""}" id="objection-${esc(o.id)}">
          <p class="kicker">${o.kind === "material" ? "Material oficial" : "Investigação"}</p><h2>${esc(o.said)}</h2>
          <p><b>Pode querer dizer:</b> ${esc(o.means)}</p><p class="obj-ask"><b>PERGUNTE:</b> ${esc(o.ask)}</p><p><b>Valor:</b> ${esc(o.value)}</p>
          ${o.reflection?.length ? `<div class="hint" style="margin:10px 0"><b>Frases de impacto — escolha uma:</b><br>${o.reflection.map((p,n)=>`${n+1}. ${esc(p)}`).join("<br>")}</div>` : ""}
          ${o.booking?.length ? `<div class="booking-lines"><b>FECHAR O HORÁRIO:</b><br>${o.booking.map((p,n)=>`${n+1}. ${esc(p)}`).join("<br>")}</div>` : ""}
          <p class="obj-advance"><b>AVANÇO:</b> ${esc(o.advance)}</p><p class="muted">Quando não insistir: ${esc(o.stop)} · ${esc(o.source || "")}</p>
        </article>`).join("")}
      </section>`;
    }).join("")}`;
}

function renderBase() {
  return `<p class="kicker">COMO FUNCIONA</p><h2>O que está confirmado nos materiais</h2>
    <div class="hint">${esc(KB.WHAT_ISAAC_IS.oneLiner)} · Fonte: ${esc(KB.WHAT_ISAAC_IS.source)}</div>
    <p style="margin:10px 0">${esc(KB.WHAT_ISAAC_IS.job)}</p>
    <div class="warn">${esc(KB.NUMBER_DIVERGENCE.warning)}</div>
    <div class="cols cols-2" style="margin-top:10px">
      <article class="card"><h2>Deck escolas</h2><p class="muted">${esc(KB.NUMBER_DIVERGENCE.escola.source)}</p><ul>${KB.NUMBER_DIVERGENCE.escola.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></article>
      <article class="card"><h2>Deck ensino superior</h2><p class="muted">${esc(KB.NUMBER_DIVERGENCE.superior.source)}</p><ul>${KB.NUMBER_DIVERGENCE.superior.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></article>
    </div>
    <h2 style="margin-top:16px">Entregas</h2>
    ${KB.DELIVERS.map((d) => `<article class="card" style="margin-bottom:8px"><h2>${esc(d.title)}</h2><p>${esc(d.text)}</p><p class="muted">${esc(d.source)}</p></article>`).join("")}
    <h2 style="margin-top:16px">Produtos</h2>
    ${KB.PRODUCTS.map((d) => `<article class="card" style="margin-bottom:8px"><h2>${esc(d.name)}</h2><p>${esc(d.note)}</p><p class="muted">${esc(d.source)}</p></article>`).join("")}
    <p class="muted" style="margin-top:12px">Portal do associado: <a href="${KB.PORTAL_ASSOCIADO}" target="_blank" rel="noopener">Associadoteca</a> · <a href="${KB.SITE_ISAAC}" target="_blank" rel="noopener">isaac.com.br</a></p>
    <p class="warn" style="margin-top:8px">Não promete taxa, crédito, ROI nem mistura os dois decks.</p>`;
}

function renderParc() {
  const official = KB.PARTNERS_SSA.map((name) => {
    const saved = inst.find((i) => i.partnerIsaac && norm(i.name) === norm(name));
    return saved || { name, pendingSync: true };
  });
  const officialNames = new Set(KB.PARTNERS_SSA.map(norm));
  const extras = inst.filter((i) => i.partnerIsaac && !officialNames.has(norm(i.name)));
  const rows = [...official, ...extras];
  const synced = official.filter((i) => !i.pendingSync).length;
  return `<p class="kicker">Parceiros</p><h2>Já fechadas em Salvador</h2>
    <p class="hint">Fonte: ${esc(KB.SOURCES.ssa)} · ${KB.PARTNERS_SSA.length} escolas da lista que você enviou. Não prospectar.</p>
    <div class="row" style="margin-top:12px"><button class="btn btn-p" id="seedBtn" type="button">Sincronizar lista de parceiras</button><span class="muted">${synced}/${KB.PARTNERS_SSA.length} salvas no banco.</span></div>
    <div class="list" style="margin-top:10px">${rows.map((i) => `<div class="item"><strong>${esc(i.name)}</strong> <span class="st parceiro">parceira</span>${i.pendingSync ? ` <small class="muted">aguardando sincronização</small>` : ""}</div>`).join("")}</div>`;
}

function renderEquipe() {
  const ops = users.filter((u) => u.active);
  return `<p class="kicker">Equipe</p><h2>Responsáveis</h2>
    <div class="list">${ops.map((u) => `<article class="item"><strong>${esc(u.name || u.email)}</strong><p class="muted">${esc(u.email)} · ${esc(u.role)}</p>
      <p>${inst.filter((i) => i.ownerEmail === u.email).length} oportunidades</p></article>`).join("") || "<p class='muted'>Só você nesta sessão. Libere gente em Acessos.</p>"}</div>`;
}

function renderAccess() {
  if (!session.admin) return `<p class="warn">Só super admin libera acesso.</p>`;
  return `<p class="kicker">GESTÃO DE ACESSOS</p><h2>Quem pode entrar no aplicativo</h2>
    <form id="grant" class="card">
      <label>Gmail <input name="email" type="email" required placeholder="pessoa@gmail.com"></label>
      <label>Função <select name="role"><option value="operator">operator</option><option value="admin">admin</option></select></label>
      <button class="btn btn-p" type="submit">Adicionar acesso</button>
    </form>
    <div class="list" style="margin-top:12px">${users.map((u) => `
      <article class="item">
        <strong>${esc(u.email)}</strong>
        <p class="muted">${esc(u.role)} · ${u.active ? "ativo" : "bloqueado"} · ${esc(u.name || "")}</p>
        <div class="row">
          ${u.active
            ? `<button class="btn btn-bad" data-block="${esc(u.email)}" type="button">Bloquear</button>`
            : `<button class="btn btn-ok" data-on="${esc(u.email)}" type="button">Reativar</button>`}
        </div>
      </article>`).join("")}</div>
    <p class="muted" style="margin-top:10px">Super admins fixos: ${SUPER_ADMINS.join(" · ")}. Cole também o arquivo RULES-ISAAC.txt no Firestore.</p>`;
}

function renderFloatingCallPanel() {
  const row = current();
  if (!callPanelOpen || !row || row.partnerIsaac) return "";
  const steps = activeCallSteps();
  const step = steps[Math.min(callStep, steps.length - 1)];
  const answer = (row.answers && row.answers[step.id]) || "";
  const likelyObjections = (step.objectionIds || []).map((id) => KB.OBJECTIONS.find((o) => o.id === id)).filter(Boolean);
  return `<aside id="callFloat" class="call-float ${callPanelMinimized ? "is-minimized" : ""} ${callPanelExpanded ? "is-expanded" : ""} ${callPanelLocked ? "is-locked" : "is-free"}" aria-label="Roteiro flutuante da ligação">
    <header class="call-float-head" id="callFloatDrag">
      <div><small>ROTEIRO ATIVO · ${callMode === "fast" ? "RÁPIDO" : "COMPLETO"}</small><b>${esc(row.name)}</b></div>
      <div class="call-float-window">
        <button type="button" id="callFloatLock" title="${callPanelLocked ? "Liberar para mover" : "Travar posição"}">${callPanelLocked ? "🔒" : "🔓"}</button>
        <button type="button" id="callFloatMin" title="Minimizar">${callPanelMinimized ? "▢" : "—"}</button>
        <button type="button" id="callFloatExpand" title="Expandir ou restaurar">${callPanelExpanded ? "↙" : "↗"}</button>
        <button type="button" id="callFloatClose" title="Fechar">×</button>
      </div>
    </header>
    <div class="call-float-body">
      <div class="call-float-progress"><span>Etapa ${callStep + 1} de ${steps.length}</span><span>${callPanelLocked ? "Posição travada · toque no cadeado para liberar" : "Arraste pelo topo · redimensione pelo canto"}</span></div>
      <h3>${esc(step.title)}</h3>
      <p class="call-float-question">${esc(callStepAsk(step, row))}</p>
      <p class="call-float-watch"><b>Observe:</b> ${esc(step.watch)}</p>
      ${likelyObjections.length ? `<div class="call-float-objections"><b>Se a pessoa responder com uma objeção:</b><div>${likelyObjections.map((o) => `<button type="button" data-pick-objection="${esc(o.id)}">${esc(o.said)}</button>`).join("")}</div></div>` : ""}
      <div class="row">${step.quick.map((q) => `<button class="btn ${String(answer).split(" · ").includes(q) ? "is-picked" : ""}" data-float-quick="${esc(q)}" type="button">${esc(q)}</button>`).join("")}</div>
      <label>O que a pessoa respondeu<textarea id="floatStepNote" placeholder="Anote aqui sem perder o roteiro">${esc(answer)}</textarea></label>
      <div class="call-float-nav">
        <button class="btn" id="floatPrev" type="button">Voltar</button>
        <button class="btn btn-p" id="floatNext" type="button">Salvar e avançar</button>
        <button class="btn btn-ok" id="floatSchedule" type="button">Agendar agora</button>
      </div>
      <div class="call-float-tools">
        <button class="btn" data-view="proof" type="button">Provas e dados</button>
        <button class="btn" data-view="base" type="button">Como funciona</button>
        <button class="btn" data-view="obj" type="button">Objeções</button>
        <button class="btn" data-view="cockpit" type="button">Ligação completa</button>
      </div>
    </div>
    <button type="button" id="callFloatResize" class="call-float-resize" title="Arraste para mudar o tamanho" aria-label="Redimensionar roteiro">↘</button>
  </aside>`;
}

async function saveStepAnswer(textareaId) {
  const row = current();
  const field = document.getElementById(textareaId);
  if (!row || !field) return;
  const steps = activeCallSteps();
  const step = steps[Math.min(callStep, steps.length - 1)];
  const answers = { ...(row.answers || {}) };
  answers[step.id] = field.value.trim();
  await saveInst({ answers }, "call_step");
}

function setupFloatingCallPanel() {
  const panel = document.getElementById("callFloat");
  const head = document.getElementById("callFloatDrag");
  const resizeHandle = document.getElementById("callFloatResize");
  if (!panel || !head || callPanelExpanded || callPanelMinimized || callPanelLocked) return;
  const mobile = window.matchMedia("(max-width:720px)").matches;
  const storageKey = mobile ? "isaacCallPanelBoxMobile" : "isaacCallPanelBox";
  const setBoxStyle = (name, value) => panel.style.setProperty(name, value, mobile ? "important" : "");
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    const box = saved || (mobile ? {
      left: 12, top: Math.max(70, Math.round(window.innerHeight * .24)),
      width: window.innerWidth - 24, height: Math.round(window.innerHeight * .58)
    } : null);
    if (box) {
      const minWidth = mobile ? 270 : 340;
      const minHeight = mobile ? 220 : 280;
      setBoxStyle("left", Math.max(8, Math.min(box.left, window.innerWidth - minWidth - 8)) + "px");
      setBoxStyle("top", Math.max(8, Math.min(box.top, window.innerHeight - minHeight - 8)) + "px");
      setBoxStyle("width", Math.max(minWidth, Math.min(box.width, window.innerWidth - 16)) + "px");
      setBoxStyle("height", Math.max(minHeight, Math.min(box.height, window.innerHeight - 16)) + "px");
      setBoxStyle("right", "auto");
      setBoxStyle("bottom", "auto");
    }
  } catch {}
  const saveBox = () => {
    const r = panel.getBoundingClientRect();
    localStorage.setItem(storageKey, JSON.stringify({ left:r.left, top:r.top, width:r.width, height:r.height }));
  };
  if (window.ResizeObserver && !mobile) new ResizeObserver(saveBox).observe(panel);
  const beginPointerOperation = (event, mode) => {
    if (mode === "move" && event.target.closest("button")) return;
    event.preventDefault();
    const r = panel.getBoundingClientRect();
    const startX = event.clientX, startY = event.clientY;
    const move = (ev) => {
      if (mode === "move") {
        setBoxStyle("left", Math.max(8, Math.min(r.left + ev.clientX - startX, window.innerWidth - panel.offsetWidth - 8)) + "px");
        setBoxStyle("top", Math.max(8, Math.min(r.top + ev.clientY - startY, window.innerHeight - panel.offsetHeight - 8)) + "px");
        setBoxStyle("right", "auto"); setBoxStyle("bottom", "auto");
      } else {
        const minWidth = mobile ? 270 : 340, minHeight = mobile ? 220 : 280;
        setBoxStyle("width", Math.max(minWidth, Math.min(r.width + ev.clientX - startX, window.innerWidth - r.left - 8)) + "px");
        setBoxStyle("height", Math.max(minHeight, Math.min(r.height + ev.clientY - startY, window.innerHeight - r.top - 8)) + "px");
      }
    };
    const up = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
      saveBox();
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", up);
  };
  head.addEventListener("pointerdown", (event) => beginPointerOperation(event, "move"));
  resizeHandle?.addEventListener("pointerdown", (event) => beginPointerOperation(event, "resize"));
}

function render() {
  const map = {
    dash: renderDash, directory: renderDirectory, crm: renderCrm, pipe: renderPipe, cockpit: renderCockpit,
    follow: renderFollow, react: renderReact, ind: renderInd, play: renderPlay, obj: renderObj,
    proof: renderProof, base: renderBase, parc: renderParc, equipe: renderEquipe, access: renderAccess, more: renderMore
  };
  el.view.innerHTML = (map[view] || renderDash)() + renderFloatingCallPanel();
  el.nav.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("on", b.dataset.view === view));
  el.bottom.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("on", b.dataset.view === view));
  setupFloatingCallPanel();
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast("Copiado."); }
  catch { window.prompt("Copie", text); }
}

async function persistFicha() {
  const row = current();
  if (!row) return;
  const ownerEmail = emailKey(($("cOwner") && $("cOwner").value) || row.ownerEmail);
  const owner = users.find((u) => emailKey(u.email) === ownerEmail);
  const transferred = ownerEmail && ownerEmail !== row.ownerEmail;
  await saveInst({
    status: $("stSel") ? $("stSel").value : row.status,
    priorHistory: $("histSel") ? $("histSel").value : row.priorHistory,
    contactName: $("cName") ? $("cName").value.trim() : row.contactName,
    role: $("cRole") ? $("cRole").value.trim() : row.role,
    whatsapp: $("cWa") ? $("cWa").value.trim() : row.whatsapp,
    phone: $("cPhone") ? $("cPhone").value.trim() : row.phone,
    email: $("cEmail") ? $("cEmail").value.trim() : row.email,
    site: $("cSite") ? validHttpUrl($("cSite").value.trim()) : row.site,
    contactSource: $("contactSource") ? $("contactSource").value.trim() : row.contactSource,
    ownerEmail,
    ownerName: owner ? (owner.name || ownerEmail) : ownerEmail,
    pain: $("pain") ? $("pain").value.trim() : row.pain,
    interest: $("interest") ? $("interest").value.trim() : row.interest,
    authority: $("authority") ? $("authority").value.trim() : row.authority,
    timing: $("timing") ? $("timing").value.trim() : row.timing,
    valueHook: $("valueHook") ? $("valueHook").value.trim() : row.valueHook,
    notes: $("notes") ? $("notes").value.trim() : row.notes,
    objectionId: $("objSel") ? $("objSel").value : row.objectionId,
    objection: $("objSel") && $("objSel").value
      ? (KB.OBJECTIONS.find((o) => o.id === $("objSel").value) || {}).said
      : row.objection,
    nextAction: $("nextAction") ? $("nextAction").value.trim() : row.nextAction,
    nextActionAt: $("nextActionAt") ? $("nextActionAt").value : row.nextActionAt,
    meetingAt: $("meetingAt") && $("meetingAt").value ? new Date($("meetingAt").value).toISOString() : row.meetingAt,
    meetingTimezone: $("meetingTimezone") ? $("meetingTimezone").value : row.meetingTimezone,
    meetingStatus: $("meetingStatus") ? $("meetingStatus").value : row.meetingStatus,
    isaacCloser: $("isaacCloser") ? $("isaacCloser").value.trim() : row.isaacCloser,
    meetingParticipants: $("meetingParticipants") ? $("meetingParticipants").value.trim() : row.meetingParticipants,
    meetingLink: $("meetingLink") ? validHttpUrl($("meetingLink").value.trim()) : row.meetingLink,
    meetingExpectation: $("meetingExpectation") ? $("meetingExpectation").value.trim() : row.meetingExpectation,
    teamQuestion: $("teamQuestion") ? $("teamQuestion").value.trim() : row.teamQuestion,
    commitmentProblem: $("commitmentProblem") ? $("commitmentProblem").value.trim() : row.commitmentProblem,
    commitmentImpact: $("commitmentImpact") ? $("commitmentImpact").value.trim() : row.commitmentImpact,
    commitmentDesired: $("commitmentDesired") ? $("commitmentDesired").value.trim() : row.commitmentDesired,
    commitmentReason: $("commitmentReason") ? $("commitmentReason").value.trim() : row.commitmentReason,
    commitmentQuestion: $("commitmentQuestion") ? $("commitmentQuestion").value.trim() : row.commitmentQuestion
  }, transferred ? "transfer" : "update");
}

el.nav.addEventListener("click", (e) => {
  const b = e.target.closest("[data-view]");
  if (!b) return;
  view = b.dataset.view === "play" && e.currentTarget.id === "bottom" ? "play" : b.dataset.view;
  render();
});
el.bottom.addEventListener("click", (e) => {
  const b = e.target.closest("[data-view]");
  if (!b) return;
  view = b.dataset.view;
  render();
});

$("q").addEventListener("input", (e) => { filterQ = e.target.value; render(); });
$("btnGoogle").addEventListener("click", googleIn);
$("btnOut").addEventListener("click", () => signOut(auth));

el.view.addEventListener("click", async (e) => {
  if (e.target.id === "openCallPanel") {
    callPanelOpen = true; callPanelMinimized = false; render(); return;
  }
  if (e.target.id === "callFloatLock") {
    callPanelLocked = !callPanelLocked;
    if (window.matchMedia("(max-width:720px)").matches) {
      localStorage.setItem("isaacCallPanelMobileMode", callPanelLocked ? "locked" : "free");
    }
    callPanelExpanded = false;
    callPanelMinimized = false;
    render();
    toast(callPanelLocked ? "Roteiro travado na tela." : "Roteiro livre: arraste pelo topo e pelo canto.");
    return;
  }
  if (e.target.id === "callFloatClose") {
    callPanelOpen = false; render(); return;
  }
  if (e.target.id === "callFloatMin") {
    callPanelMinimized = !callPanelMinimized; callPanelExpanded = false; render(); return;
  }
  if (e.target.id === "callFloatExpand") {
    callPanelExpanded = !callPanelExpanded; callPanelMinimized = false; render(); return;
  }
  const objectionPick = e.target.closest("[data-pick-objection]");
  if (objectionPick) {
    if (document.getElementById("floatStepNote")) await saveStepAnswer("floatStepNote");
    const picked = KB.OBJECTIONS.find((o) => o.id === objectionPick.dataset.pickObjection);
    if (picked) {
      await saveInst({ objectionId: picked.id, objection: picked.said }, "objection");
      view = "obj"; callPanelOpen = true; render();
      setTimeout(() => document.getElementById("objection-" + picked.id)?.scrollIntoView({ behavior:"smooth", block:"start" }), 60);
      toast("Objeção aberta na ordem do roteiro.");
    }
    return;
  }
  const floatQuick = e.target.closest("[data-float-quick]");
  if (floatQuick) {
    const ta = document.getElementById("floatStepNote");
    const choice = floatQuick.dataset.floatQuick;
    if (ta) {
      const parts = ta.value.split(" · ").map((part) => part.trim()).filter(Boolean);
      if (!parts.includes(choice)) parts.push(choice);
      ta.value = parts.join(" · ");
      await saveStepAnswer("floatStepNote");
      toast("Registrado: " + choice);
    }
    return;
  }
  if (e.target.id === "floatPrev") {
    await saveStepAnswer("floatStepNote");
    callStep = Math.max(0, callStep - 1);
    render(); return;
  }
  if (e.target.id === "floatNext") {
    await saveStepAnswer("floatStepNote");
    const steps = activeCallSteps();
    callStep = Math.min(steps.length - 1, callStep + 1);
    const row = current();
    if (row && ["prospect", "tentativa"].includes(row.status)) await saveInst({ status: "contato" }, "status");
    render(); return;
  }
  if (e.target.id === "floatSchedule") {
    await saveStepAnswer("floatStepNote");
    view = "cockpit";
    callPanelMinimized = true;
    render();
    setTimeout(() => document.getElementById("meetingBox")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    toast("Escolha agora a data e o horário.");
    return;
  }
  if (e.target.id === "seedDirectoryBtn") {
    const btn = e.target;
    btn.disabled = true;
    btn.textContent = "Carregando…";
    try {
      const added = await seedStarterDirectory();
      await loadAll();
      directoryLoadError = "";
      render();
      toast(added ? added + " instituições adicionadas." : "Lista já está atualizada.");
    } catch (err) {
      console.error("directory seed", err);
      directoryLoadError = err.code || err.message || "erro desconhecido";
      render();
      toast("Não foi possível carregar a lista.");
    }
    return;
  }
  const dirType = e.target.closest("[data-dir-type]");
  if (dirType) { directoryTypeFilter = dirType.dataset.dirType || "all"; render(); return; }
  const dirEdit = e.target.closest("[data-dir-edit]");
  if (dirEdit) { directoryEditId = directoryEditId === dirEdit.dataset.dirEdit ? null : dirEdit.dataset.dirEdit; render(); return; }
  const dirStatus = e.target.closest("[data-dir-status]");
  if (dirStatus) {
    currentId = dirStatus.dataset.id;
    const status = dirStatus.dataset.dirStatus;
    await saveInst({ directoryStatus: status }, "directory_" + status);
    toast("Lista atualizada: " + directoryStatusOf({ directoryStatus: status }).label + ".");
    return;
  }
  const promote = e.target.closest("[data-promote]");
  if (promote) {
    currentId = promote.dataset.promote;
    await saveInst({ directoryOnly: false, status: "prospect", nextAction: "fazer primeiro contato" }, "directory_promoted");
    view = "cockpit"; callStep = 0; callPanelOpen = true; callPanelMinimized = false; render();
    toast("Instituição colocada nos contatos em andamento.");
    return;
  }

  const open = e.target.closest("[data-open]");
  const call = e.target.closest("[data-call]");
  const v = e.target.closest("[data-view]");
  if (open) { currentId = open.dataset.open; view = "cockpit"; callStep = 0; callPanelOpen = true; callPanelMinimized = false; render(); return; }
  if (call) { currentId = call.dataset.call; view = "cockpit"; callStep = 0; callPanelOpen = true; callPanelMinimized = false; render(); return; }
  if (v) {
    if (document.getElementById("floatStepNote")) await saveStepAnswer("floatStepNote");
    else if (view === "cockpit" && document.getElementById("stepNote")) await saveStepAnswer("stepNote");
    if (["proof", "base", "obj"].includes(v.dataset.view)) callPanelOpen = true;
    view = v.dataset.view;
    render();
    return;
  }

  if (e.target.id === "copyTpl") return copy(KB.APPROACH.template);
  if (e.target.id === "seedBtn") {
    const btn = e.target;
    btn.disabled = true;
    btn.textContent = "Sincronizando…";
    try {
      const added = await seedPartnersIfNeeded();
      await loadAll();
      render();
      toast(added ? added + " parceiras sincronizadas." : "As 56 parceiras já estão sincronizadas.");
    } catch (err) {
      console.error("partner seed", err);
      render();
      toast("Não foi possível sincronizar: " + (err.code || err.message || "erro desconhecido"));
    }
    return;
  }
  if (e.target.id === "prevStep") { callStep = Math.max(0, callStep - 1); render(); return; }
  if (e.target.id === "nextStep") {
    const row = current();
    if (!row) return;
    const callSteps = activeCallSteps();
    const step = callSteps[callStep];
    const answers = { ...(row.answers || {}) };
    answers[step.id] = ($("stepNote") && $("stepNote").value.trim()) || answers[step.id] || "";
    await saveInst({ answers }, "call_step");
    callStep = Math.min(callSteps.length - 1, callStep + 1);
    if (row.status === "prospect" || row.status === "tentativa") await saveInst({ status: "contato" }, "status");
    render();
    return;
  }
  if (e.target.id === "timerToggle") {
    if (callStartedAt) {
      clearInterval(callTimerHandle); callTimerHandle = null; callStartedAt = null; e.target.textContent = "Iniciar"; updateCallTimer();
    } else {
      callStartedAt = Date.now(); e.target.textContent = "Pausar"; updateCallTimer(); callTimerHandle = setInterval(updateCallTimer, 1000);
    }
    return;
  }
  const qbtn = e.target.closest("[data-quick]");
  if (qbtn) {
    const ta = $("stepNote");
    if (ta) ta.value = (ta.value ? ta.value + " · " : "") + qbtn.dataset.quick;
    return;
  }
  const block = e.target.closest("[data-block]");
  const on = e.target.closest("[data-on]");
  if (block && session.admin) {
    await updateDoc(doc(db, COL_ACCESS, emailKey(block.dataset.block)), { active: false, updatedAt: serverTimestamp() });
    await loadAll(); render(); toast("Bloqueado."); return;
  }
  if (on && session.admin) {
    await updateDoc(doc(db, COL_ACCESS, emailKey(on.dataset.on)), { active: true, updatedAt: serverTimestamp() });
    await loadAll(); render(); toast("Reativado."); return;
  }

  const modeBtn = e.target.closest("[data-call-mode]");
  if (modeBtn) {
    callMode = modeBtn.dataset.callMode === "complete" ? "complete" : "fast";
    callStep = 0;
    render();
    return;
  }

  const act = e.target.closest("[data-act]");
  if (!act) return;
  const row = current();
  if (!row) return;
  await persistFicha();
  const fresh = current();
  if (act.dataset.act === "attempt") {
    await saveInst({ status: fresh.status === "prospect" ? "tentativa" : fresh.status, attemptCount: Number(fresh.attemptCount || 0) + 1 }, "attempt");
    toast("Tentativa registrada. Nenhuma mensagem foi enviada."); return;
  }
  if (act.dataset.act === "reached") {
    await saveInst({ status: ["prospect","tentativa"].includes(fresh.status) ? "contato" : fresh.status }, "responsavel_alcancado");
    toast("Responsável alcançado registrado."); return;
  }
  if (act.dataset.act === "jumpSchedule") {
    document.getElementById("meetingBox")?.scrollIntoView({ behavior: "smooth", block: "start" });
    toast("Agora escolha data e horário. O restante é opcional.");
    return;
  }
  if (act.dataset.act === "save") { toast("Ficha salva."); return; }
  if (act.dataset.act === "copySum") return copy(summaryOf(fresh));
  if (act.dataset.act === "copyFollow") return copy(followMsg(fresh));
  if (act.dataset.act === "copyTeam") return copy(teamMsg(fresh));
  if (act.dataset.act === "schedule") {
    if (!fresh.meetingAt) { toast("Informe data e horário completos."); return; }
    await saveInst({ status: "call_agendada", meetingStatus: fresh.meetingStatus || "aguardando_confirmacao", nextAction: "confirmar reunião", nextActionAt: String(fresh.meetingAt).slice(0,10) }, "meeting_scheduled");
    toast("Reunião registrada. Agora copie a confirmação."); return;
  }
  if (act.dataset.act === "copyConfirm") return copy(meetingConfirmMsg(fresh));
  if (act.dataset.act === "copyEmail") return copy(meetingEmail(fresh));
  if (act.dataset.act === "copyReminder") return copy(reminderMsg(fresh));
  if (act.dataset.act === "ics") return downloadIcs(fresh);
  if (act.dataset.act === "reschedule") {
    await saveInst({ status: "call_agendada", meetingStatus: "remarcada", meetingRescheduleCount: Number(fresh.meetingRescheduleCount || 0) + 1 }, "meeting_rescheduled");
    return copy(rescheduleMsg(current()));
  }
  if (act.dataset.act === "end") {
    await saveInst({ status: fresh.nextActionAt ? "followup" : "contato" }, "end_call");
    toast("Ligação encerrada. Resumo pronto para copiar.");
    return;
  }
  if (act.dataset.act === "fwd") {
    await saveInst({ status: "encaminhado", nextAction: "time isaac" }, "encaminhar");
    copy(teamMsg(current()));
    return;
  }
  if (act.dataset.act === "nofit") {
    await saveInst({ status: "nao_avancou", nextAction: "" }, "nao_fit");
    toast("Marcado como não avançou.");
    return;
  }
  if (act.dataset.act === "ref") {
    view = "ind";
    render();
  }
});

el.view.addEventListener("change", async (e) => {
  if (e.target.id === "directoryCity") { directoryCityFilter = e.target.value; render(); return; }
  if (e.target.id === "directoryStatus") { directoryStatusFilter = e.target.value; render(); return; }
  if (e.target.id === "objSel") {
    const o = KB.OBJECTIONS.find((x) => x.id === e.target.value);
    await saveInst({ objectionId: e.target.value, objection: o ? o.said : "" }, "objection");
  }
  if (e.target.id === "stSel") await saveInst({ status: e.target.value }, "status");
  if (e.target.id === "histSel") {
    const h = e.target.value;
    const extra = {};
    if (h === "parceiro") { extra.partnerIsaac = true; extra.status = "parceiro"; }
    await saveInst({ priorHistory: h, ...extra }, "historico");
  }
});

el.view.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (e.target.matches("[data-directory-form]")) {
    const data = Object.fromEntries(new FormData(e.target).entries());
    currentId = data.id;
    delete data.id;
    data.state = String(data.state || "BA").toUpperCase();
    data.sourceUrl = data.contactSource || "";
    directoryEditId = null;
    await saveInst(data, "directory_edit");
    toast("Informações atualizadas.");
    return;
  }
  if (e.target.id === "newDirectory") {
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.state = String(data.state || "").toUpperCase();
    data.directoryOnly = true;
    data.directoryStatus = "novo";
    data.sourceUrl = data.contactSource || data.site || "";
    data.sourceLabel = data.contactSource ? "fonte informada no cadastro manual" : "cadastro manual; contato a conferir";
    const res = await createInst(data);
    if (res.dup) {
      currentId = res.dup.id;
      toast("Essa instituição já está cadastrada.");
    } else {
      toast("Instituição adicionada à lista.");
    }
    view = "directory";
    render();
    return;
  }
  if (e.target.id === "newInst") {
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    const res = await createInst(data);
    if (res.dup) {
      $("dupWarn").textContent = "Já existe: " + res.dup.name + " em " + (res.dup.city || "") + ". Abrindo o registro.";
      currentId = res.dup.id;
      view = "cockpit";
      render();
      return;
    }
    view = "cockpit";
    render();
    toast("Cadastrada.");
    return;
  }
  if (e.target.id === "newRef") {
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    const id = "r-" + Date.now();
    const row = { ...data, id, by: session.email, at: nowIso() };
    await setDoc(doc(db, COL_REF, id), row);
    refs.unshift(row);
    if (current()) await saveInst({ lastReferral: data.name }, "indicacao");
    e.target.reset();
    render();
    toast("Indicação salva.");
    return;
  }
  if (e.target.id === "grant" && session.admin) {
    const fd = new FormData(e.target);
    const email = emailKey(fd.get("email"));
    const role = fd.get("role") === "admin" ? "admin" : "operator";
    await setDoc(doc(db, COL_ACCESS, email), {
      email, role, active: true, createdAt: serverTimestamp(), createdBy: session.email, updatedAt: serverTimestamp()
    }, { merge: true });
    await loadAll();
    render();
    toast("Acesso liberado.");
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    session.user = null;
    session.allowed = false;
    showGate("Acesso só com Gmail liberado. Admin: yanfili.simon@gmail.com e srklehn@gmail.com.");
    return;
  }
  try {
    const ok = await resolveAccess(user);
    if (!ok) {
      showGate("Conta sem acesso. Peça liberação para yanfili.simon@gmail.com ou srklehn@gmail.com.", true);
      await signOut(auth);
      return;
    }
    await loadAll();
    try {
      await seedPartnersIfNeeded();
      await seedStarterDirectory();
    } catch (e) {
      console.warn("seed", e);
      directoryLoadError = e.code || e.message || "erro desconhecido";
    }
    showApp();
  } catch (e) {
    console.error(e);
    showGate(
      "Login ok, mas o Firestore recusou. Cole isaac/RULES-ISAAC.txt nas regras do Firebase (projeto hub-akasha) e recarregue. " +
      (e.code || e.message || ""),
      true
    );
  }
});
