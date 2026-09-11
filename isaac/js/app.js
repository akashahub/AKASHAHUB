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
import * as KB from "./knowledge.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const VIEWS = [
  ["dash", "Painel"],
  ["crm", "Instituições"],
  ["pipe", "Pipeline"],
  ["cockpit", "Call"],
  ["follow", "Follow-ups"],
  ["ind", "Indicações"],
  ["play", "Playbook"],
  ["obj", "Objeções"],
  ["base", "Base isaac"],
  ["parc", "Parceiros"],
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
let filterQ = "";

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
  return (norm(name) + "|" + norm(city || "salvador")).slice(0, 180);
}
function nowIso() { return new Date().toISOString(); }
function fmt(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
function pipeLabel(id) {
  return (KB.PIPELINE.find((p) => p.id === id) || { label: id }).label;
}
function histLabel(id) {
  return (KB.PRIOR_HISTORY.find((p) => p.id === id) || { label: id }).label;
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
    ["dash", "Painel"], ["crm", "CRM"], ["cockpit", "Call"], ["follow", "Follow"], ["play", "Mais"]
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
  const has = inst.some((i) => i.partnerIsaac === true);
  if (has) return;
  const batch = writeBatch(db);
  const at = nowIso();
  KB.PARTNERS_SSA.forEach((name) => {
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
  toast("56 parceiras de Salvador importadas da lista oficial.");
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
    `Objetivo desta call: ${obj}`
  ].filter(Boolean).join("\n");
}

function summaryOf(row) {
  return [
    "Resumo de call — ISAAC SDR OS",
    `Instituição: ${row.name}`,
    `Cidade: ${row.city || ""} / ${row.state || ""}`,
    `Pessoa: ${row.contactName || "—"} · ${row.role || "—"}`,
    `WhatsApp: ${row.whatsapp || row.phone || "—"}`,
    `Cenário: ${pipeLabel(row.status)}`,
    `Histórico isaac: ${histLabel(row.priorHistory)}`,
    `Dores: ${row.pain || "—"}`,
    `Interesse: ${row.interest || "—"}`,
    `Objeções: ${row.objection || "—"}`,
    `O que chamou atenção: ${row.valueHook || "—"}`,
    `Autoridade: ${row.authority || "—"}`,
    `Timing: ${row.timing || "—"}`,
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
    "Encaminhamento SDR → time isaac",
    summaryOf(row),
    "",
    "Pedido: conversa de diagnóstico/fechamento. SDR não negociou taxa."
  ].join("\n");
}

function dashStats() {
  const f = inst;
  const count = (st) => f.filter((i) => i.status === st).length;
  const today = new Date().toISOString().slice(0, 10);
  const follows = f.filter((i) => i.nextActionAt);
  return {
    total: f.length,
    novos: count("prospect"),
    tentativa: count("tentativa"),
    contato: count("contato"),
    interessado: count("interessado"),
    calls: count("call_agendada"),
    enc: count("encaminhado"),
    followToday: follows.filter((i) => String(i.nextActionAt).slice(0, 10) === today).length,
    atrasados: follows.filter((i) => String(i.nextActionAt).slice(0, 10) < today && !["parceiro", "perdido"].includes(i.status)).length,
    parceiros: f.filter((i) => i.partnerIsaac).length,
    semAcao: f.filter((i) => !i.nextActionAt && !["parceiro", "perdido"].includes(i.status)).length
  };
}

function renderDash() {
  const s = dashStats();
  const byOwner = {};
  inst.forEach((i) => {
    const k = i.ownerEmail || "(sem dono)";
    byOwner[k] = (byOwner[k] || 0) + 1;
  });
  return `
    <p class="kicker">Dashboard</p>
    <h2>Operação</h2>
    <div class="cards">
      ${[
        ["Instituições", s.total], ["Parceiras SSA", s.parceiros], ["Prospects", s.novos],
        ["Tentativas", s.tentativa], ["Contatos", s.contato], ["Interessados", s.interessado],
        ["Calls agendadas", s.calls], ["Encaminhados", s.enc],
        ["Follows hoje", s.followToday], ["Atrasados", s.atrasados], ["Sem próxima ação", s.semAcao]
      ].map(([l, n]) => `<article class="card"><b>${n}</b><span>${l}</span></article>`).join("")}
    </div>
    <div class="card">
      <h2>Por responsável interno</h2>
      <div class="list">${Object.entries(byOwner).map(([k, n]) => `<div class="item">${esc(k)} · ${n}</div>`).join("") || "<p class='muted'>Nada ainda.</p>"}</div>
    </div>
    <p class="hint" style="margin-top:12px">Fase 1: Salvador. Parceiras oficiais não entram como lead. Números de produto estão na Base isaac, com fonte.</p>
  `;
}

function renderCrm() {
  const rows = filtered();
  return `
    <div class="cols cols-2">
      <div>
        <p class="kicker">CRM</p>
        <h2>Instituições</h2>
        <form id="newInst" class="card">
          <p class="kicker">Nova oportunidade</p>
          <label>Instituição <input name="name" required placeholder="Nome da escola"></label>
          <div class="duo">
            <label>Cidade <input name="city" value="Salvador"></label>
            <label>Tipo <select name="type">${KB.INST_TYPES.map((t) => `<option value="${t.id}">${t.label}</option>`).join("")}</select></label>
          </div>
          <div class="duo">
            <label>Responsável <input name="contactName"></label>
            <label>Cargo <input name="role" placeholder="Mantenedor, diretor..."></label>
          </div>
          <div class="duo">
            <label>WhatsApp <input name="whatsapp" inputmode="tel"></label>
            <label>Telefone <input name="phone" inputmode="tel"></label>
          </div>
          <label>Origem <input name="origin" placeholder=" indicação, mapa, visita..."></label>
          <div class="row"><button class="btn btn-p" type="submit">Cadastrar</button></div>
          <p class="muted" id="dupWarn" style="margin-top:8px"></p>
        </form>
      </div>
      <div>
        <p class="muted">${rows.length} registros</p>
        <div class="list" style="margin-top:8px">
          ${rows.map((i) => `
            <article class="item">
              <div class="row" style="justify-content:space-between">
                <h3>${esc(i.name)}</h3>
                <span class="st ${esc(i.status)}">${esc(pipeLabel(i.status))}</span>
              </div>
              <p class="muted">${esc(i.city || "")} · ${esc(i.contactName || "sem contato")} · ${esc(i.ownerName || i.ownerEmail || "")}</p>
              ${i.partnerIsaac ? "<p class='ok'>Já parceira da isaac — não prospectar.</p>" : ""}
              <div class="row">
                <button class="btn" data-open="${esc(i.id)}" type="button">Abrir</button>
                <button class="btn btn-p" data-call="${esc(i.id)}" type="button">Call</button>
              </div>
            </article>`).join("") || "<p class='muted'>Nenhuma instituição.</p>"}
        </div>
      </div>
    </div>`;
}

function renderPipe() {
  const cols = KB.PIPELINE.map((p) => {
    const items = filtered().filter((i) => i.status === p.id);
    return `<div class="col"><h4>${p.label} · ${items.length}</h4>${items.map((i) =>
      `<button class="pill" data-open="${esc(i.id)}" type="button">${esc(i.name)}<br><small class="muted">${esc(i.city || "")}</small></button>`
    ).join("")}</div>`;
  }).join("");
  return `<p class="kicker">Pipeline</p><h2>Oportunidades</h2><div class="kanban">${cols}</div>`;
}

function renderFollow() {
  const today = new Date().toISOString().slice(0, 10);
  const list = filtered().filter((i) => !["parceiro", "perdido"].includes(i.status));
  const buckets = [
    ["Hoje", list.filter((i) => String(i.nextActionAt || "").slice(0, 10) === today)],
    ["Atrasados", list.filter((i) => i.nextActionAt && String(i.nextActionAt).slice(0, 10) < today)],
    ["Próximos", list.filter((i) => i.nextActionAt && String(i.nextActionAt).slice(0, 10) > today)],
    ["Sem próxima ação", list.filter((i) => !i.nextActionAt)]
  ];
  return `<p class="kicker">Follow-up</p><h2>Agenda</h2>` + buckets.map(([t, rows]) => `
    <div class="card" style="margin-bottom:10px">
      <h2>${t} · ${rows.length}</h2>
      <div class="list">${rows.map((i) => `
        <article class="item">
          <strong>${esc(i.name)}</strong>
          <p class="muted">${esc(i.nextAction || "—")} · ${esc(i.nextActionAt || "")}</p>
          <button class="btn" data-open="${esc(i.id)}" type="button">Abrir</button>
        </article>`).join("") || "<p class='muted'>Vazio.</p>"}</div>
    </div>`).join("");
}

function renderCockpit() {
  const row = current();
  if (!row) {
    const recent = filtered().slice(0, 12);
    return `<p class="kicker">Call cockpit</p><h2>Escolha uma instituição</h2>
      <div class="list">${recent.map((i) => `<article class="item"><strong>${esc(i.name)}</strong>
        <span class="st ${esc(i.status)}">${esc(pipeLabel(i.status))}</span>
        <div class="row"><button class="btn btn-p" data-call="${esc(i.id)}" type="button">Entrar na call</button></div>
      </article>`).join("")}</div>`;
  }
  if (row.partnerIsaac) {
    return `<div class="warn"><b>Já parceira da isaac.</b> ${esc(row.name)} está na lista oficial de Salvador. Não prospectar. Fonte: ${esc(KB.SOURCES.ssa)}</div>
      <div class="row" style="margin-top:12px"><button class="btn" data-view="parc" type="button">Ver parceiras</button></div>`;
  }
  const step = KB.CALL_STEPS[Math.min(callStep, KB.CALL_STEPS.length - 1)];
  const sig = signalsOf(row);
  const obj = KB.OBJECTIONS.find((o) => o.id === row.objectionId);
  return `
    <p class="kicker">Call cockpit · ${callStep + 1}/${KB.CALL_STEPS.length}</p>
    <div class="cols cols-2">
      <div>
        <div class="card">
          <h2>${esc(row.name)}</h2>
          <p class="muted">${esc(row.city || "")} · ${esc((KB.INST_TYPES.find((t) => t.id === row.type) || {}).label || "")} · ${esc(row.contactName || "sem nome")} (${esc(row.role || "—")})</p>
          <p><span class="st ${esc(row.status)}">${esc(pipeLabel(row.status))}</span></p>
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
            <label>Dono interno
              <select id="cOwner">${(users.length ? users : [{ email: session.email, name: session.name }]).map((u) => {
                const em = u.email || u.id;
                return `<option value="${esc(em)}" ${em === row.ownerEmail ? "selected" : ""}>${esc(u.name || em)}</option>`;
              }).join("")}</select>
            </label>
          </div>
        </div>
        <div class="card" style="margin-top:10px">
          <p class="step">${esc(step.title)} · por que: ${esc(step.why)}</p>
          <p class="speak">${esc(step.ask)}</p>
          <p class="muted">${esc(step.watch)}</p>
          <div class="row">${step.quick.map((q) => `<button class="btn" data-quick="${esc(q)}" type="button">${esc(q)}</button>`).join("")}</div>
          <label>Anotação desta etapa <textarea id="stepNote" placeholder="o que a pessoa disse">${esc((row.answers && row.answers[step.id]) || "")}</textarea></label>
          <div class="row">
            <button class="btn" id="prevStep" type="button">Voltar</button>
            <button class="btn btn-p" id="nextStep" type="button">Registrar e avançar</button>
          </div>
        </div>
      </div>
      <div>
        <div class="card">
          <p class="kicker">Qualificação</p>
          <div class="sig">
            ${Object.entries(sig).map(([k, v]) => `<i>${esc(k)}: ${esc(v)}</i>`).join("")}
          </div>
          <label>Dor principal <input id="pain" value="${esc(row.pain || "")}"></label>
          <label>Interesse <input id="interest" value="${esc(row.interest || "")}"></label>
          <label>Autoridade <input id="authority" value="${esc(row.authority || "")}"></label>
          <label>Timing <input id="timing" value="${esc(row.timing || "")}"></label>
          <label>O que chamou atenção <input id="valueHook" value="${esc(row.valueHook || "")}"></label>
          <label>Notas <textarea id="notes">${esc(row.notes || "")}</textarea></label>
        </div>
        <div class="card" style="margin-top:10px">
          <p class="kicker">Objeção</p>
          <select id="objSel">
            <option value="">— selecionar —</option>
            ${KB.OBJECTIONS.map((o) => `<option value="${o.id}" ${row.objectionId === o.id ? "selected" : ""}>${esc(o.said)}</option>`).join("")}
          </select>
          ${obj ? `<p class="hint" style="margin-top:8px"><b>Pode querer dizer:</b> ${esc(obj.means)}<br><b>Pergunte:</b> ${esc(obj.ask)}<br><b>Valor:</b> ${esc(obj.value)}<br><b>Prova:</b> ${esc(obj.proof || "—")}<br><b>Avanço:</b> ${esc(obj.advance)}<br><b>Não insistir:</b> ${esc(obj.stop)}</p>` : ""}
        </div>
        <div class="card" style="margin-top:10px">
          <p class="kicker">Próximo passo</p>
          <label>Ação <input id="nextAction" value="${esc(row.nextAction || "")}" placeholder="ligar, encaminhar, material..."></label>
          <label>Quando <input id="nextActionAt" type="date" value="${esc(String(row.nextActionAt || "").slice(0, 10))}"></label>
          <div class="row">
            <button class="btn" data-act="save" type="button">Salvar ficha</button>
            <button class="btn btn-ok" data-act="end" type="button">Encerrar call</button>
            <button class="btn btn-p" data-act="fwd" type="button">Encaminhar</button>
            <button class="btn" data-act="copySum" type="button">Copiar resumo</button>
            <button class="btn" data-act="copyFollow" type="button">Copiar follow-up</button>
            <button class="btn" data-act="copyTeam" type="button">Copiar p/ time isaac</button>
            <button class="btn" data-act="ref" type="button">Registrar indicação</button>
            <button class="btn btn-bad" data-act="nofit" type="button">Não é fit</button>
          </div>
        </div>
        <div class="log">${(row.log || []).slice(0, 8).map((l) => `<div>${esc(l.at || "")} · ${esc(l.by || "")} · ${esc(l.action || "")}</div>`).join("")}</div>
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
  return `<p class="kicker">Playbook</p><h2>Treino interno</h2>
    ${KB.PLAYBOOK.map((p) => `<article class="card" style="margin-bottom:8px"><h2>${esc(p.title)}</h2><p>${esc(p.body)}</p></article>`).join("")}
    <article class="card">
      <h2>Template de WhatsApp (SSA)</h2>
      <pre class="pre">${esc(KB.APPROACH.template)}</pre>
      <button class="btn" id="copyTpl" type="button">Copiar template</button>
      <p class="muted" style="margin-top:8px">Fonte: ${esc(KB.SOURCES.ssa)}</p>
    </article>`;
}

function renderObj() {
  return `<p class="kicker">Objeções</p><h2>Mapa</h2>
    ${KB.OBJECTIONS.map((o) => `<article class="card" style="margin-bottom:8px">
      <p class="kicker">${o.kind === "material" ? "Material oficial" : "Investigação"}</p>
      <h2>${esc(o.said)}</h2>
      <p><b>Pode querer dizer:</b> ${esc(o.means)}</p>
      <p><b>Pergunte:</b> ${esc(o.ask)}</p>
      <p><b>Valor:</b> ${esc(o.value)}</p>
      <p><b>Avanço:</b> ${esc(o.advance)}</p>
      <p class="muted">Quando não insistir: ${esc(o.stop)} · ${esc(o.source || "")}</p>
    </article>`).join("")}`;
}

function renderBase() {
  return `<p class="kicker">Base isaac</p><h2>O que está confirmado nos materiais</h2>
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
  const rows = inst.filter((i) => i.partnerIsaac);
  return `<p class="kicker">Parceiros</p><h2>Já fechadas em Salvador</h2>
    <p class="hint">Fonte: ${esc(KB.SOURCES.ssa)} · ${rows.length} no CRM. Não prospectar.</p>
    <div class="list" style="margin-top:10px">${rows.map((i) => `<div class="item"><strong>${esc(i.name)}</strong> <span class="st parceiro">parceira</span></div>`).join("")}</div>
    ${session.admin ? `<div class="row" style="margin-top:12px"><button class="btn" id="seedBtn" type="button">Reimportar lista SSA (merge)</button></div>` : ""}`;
}

function renderEquipe() {
  const ops = users.filter((u) => u.active);
  return `<p class="kicker">Equipe</p><h2>Responsáveis</h2>
    <div class="list">${ops.map((u) => `<article class="item"><strong>${esc(u.name || u.email)}</strong><p class="muted">${esc(u.email)} · ${esc(u.role)}</p>
      <p>${inst.filter((i) => i.ownerEmail === u.email).length} oportunidades</p></article>`).join("") || "<p class='muted'>Só você nesta sessão. Libere gente em Acessos.</p>"}</div>`;
}

function renderAccess() {
  if (!session.admin) return `<p class="warn">Só super admin libera acesso.</p>`;
  return `<p class="kicker">Gestão de acessos</p><h2>Quem entra no SDR OS</h2>
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

function render() {
  const map = {
    dash: renderDash, crm: renderCrm, pipe: renderPipe, cockpit: renderCockpit,
    follow: renderFollow, ind: renderInd, play: renderPlay, obj: renderObj,
    base: renderBase, parc: renderParc, equipe: renderEquipe, access: renderAccess
  };
  el.view.innerHTML = (map[view] || renderDash)();
  el.nav.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("on", b.dataset.view === view));
  el.bottom.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("on", b.dataset.view === view));
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
    nextActionAt: $("nextActionAt") ? $("nextActionAt").value : row.nextActionAt
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
  const open = e.target.closest("[data-open]");
  const call = e.target.closest("[data-call]");
  const v = e.target.closest("[data-view]");
  if (open) { currentId = open.dataset.open; view = "cockpit"; callStep = 0; render(); return; }
  if (call) { currentId = call.dataset.call; view = "cockpit"; callStep = 0; render(); return; }
  if (v) { view = v.dataset.view; render(); return; }

  if (e.target.id === "copyTpl") return copy(KB.APPROACH.template);
  if (e.target.id === "seedBtn") {
    inst = inst.filter((i) => !i.partnerIsaac);
    await seedPartnersIfNeeded();
    return;
  }
  if (e.target.id === "prevStep") { callStep = Math.max(0, callStep - 1); render(); return; }
  if (e.target.id === "nextStep") {
    const row = current();
    if (!row) return;
    const step = KB.CALL_STEPS[callStep];
    const answers = { ...(row.answers || {}) };
    answers[step.id] = ($("stepNote") && $("stepNote").value.trim()) || answers[step.id] || "";
    await saveInst({ answers }, "call_step");
    callStep = Math.min(KB.CALL_STEPS.length - 1, callStep + 1);
    if (row.status === "prospect" || row.status === "tentativa") await saveInst({ status: "contato" }, "status");
    render();
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

  const act = e.target.closest("[data-act]");
  if (!act) return;
  const row = current();
  if (!row) return;
  await persistFicha();
  const fresh = current();
  if (act.dataset.act === "save") { toast("Ficha salva."); return; }
  if (act.dataset.act === "copySum") return copy(summaryOf(fresh));
  if (act.dataset.act === "copyFollow") return copy(followMsg(fresh));
  if (act.dataset.act === "copyTeam") return copy(teamMsg(fresh));
  if (act.dataset.act === "end") {
    await saveInst({ status: fresh.nextActionAt ? "followup" : "contato" }, "end_call");
    toast("Call encerrada. Resumo pronto para copiar.");
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
    try { await seedPartnersIfNeeded(); }
    catch (e) { console.warn("seed", e); }
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
