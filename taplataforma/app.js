import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, collection, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4",
  authDomain: "hub-akasha.firebaseapp.com",
  projectId: "hub-akasha",
  storageBucket: "hub-akasha.firebasestorage.app",
  messagingSenderId: "370851875474",
  appId: "1:370851875474:web:29b1ba3a76b0fed7d9344b"
});
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const MENTOR_UID = "1GO7dRdFUFg2NwYwzOwjvtWfpAS2";
const MENTOR_EMAILS = ["yanfili.simon@gmail.com", "plmacramo@gmail.com", "sendatantrica@gmail.com", "opatricksimon@gmail.com"];

const PLANS = {
  vip: { mentee: "Individual", mentor: "Individual VIP 1:1", floor: 39000, note: "Piso. Pode fechar acima. Não ler o número na call." },
  metade: { mentee: "Grupo", mentor: "Grupo · metade", floor: 19500, note: "Metade do piso individual." },
  terco: { mentee: "Grupo", mentor: "Grupo · um terço", floor: 13000, note: "Um terço do piso individual." }
};

const CYCLE = [
  { id: "p1", n: "01", title: "Fundamentos", line: "Antes de convencer alguém, a pessoa se observa.", steps: ["Três minutos de leitura de campo, sem explicar.", "Três momentos do dia: automação ou escolha.", "No domingo: uma crença herdada e a frase que fica no lugar."], tool: "p1-check" },
  { id: "p2", n: "02", title: "Autoestima", line: "A força não pede plateia.", steps: ["Cinco minutos observando o que sente, sem corrigir.", "Uma afirmação dita como fato, não como pedido.", "Antes de entrar numa sala: a energia fica com você."], tool: "p2-check" },
  { id: "p3", n: "03", title: "Energia", line: "A força vital vira trabalho, não vazamento.", inner: true, steps: ["Cinco a dez minutos de respiração, energia no baixo ventre.", "Um vazamento fechado por semana.", "Um ritual curto antes de mudar de tarefa."], tool: "p3-check" },
  { id: "p4", n: "04", title: "Presença", line: "O corpo fala antes da frase.", steps: ["Cinco minutos de postura e olhar.", "Uma leitura de voz: tom, pausa, volume.", "Numa conversa, olhar o corpo mais do que a palavra. Confirmar, não inventar."], tool: "p4-check" },
  { id: "p5", n: "05", title: "Integração", line: "O dia não espera motivação.", steps: ["Cinco códigos em menos de cinco minutos cada: coerência, presença, energia, ação, obra.", "Uma meta de 90 dias quebrada em ação da semana.", "Uma visualização curta, no domingo."], tool: "p5-check" }
];

const DAYS = [["seg", "Seg"], ["ter", "Ter"], ["qua", "Qua"], ["qui", "Qui"], ["sex", "Sex"], ["sab", "Sáb"], ["dom", "Dom"]];

const session = { uid: "", email: "", name: "", role: "mentee", plan: "" };
let view = "home";
let toolId = "";
let data = emptyData();
let cloudOk = true;
let requests = [];
let grants = [];
let unsubReq = null;
let unsubGrants = null;

function emptyData() {
  return { checks: {}, cosmos: blankRows(["Dinheiro", "Sucesso", "Relacionamentos", "Corpo"]), affirms: blankRows(["Autoestima", "Valor", "Confiança", "Limites"]), leaks: blankRows(["Físico", "Emocional", "Mental", "Relacional"]), reads: [], goals: [], notes: "", callNote: "" };
}
function blankRows(areas) {
  return areas.map((area) => ({ area, a: "", b: "", c: "", d: "" }));
}
function isMentor(uid, email) {
  if (uid && uid === MENTOR_UID) return true;
  return MENTOR_EMAILS.includes(String(email || "").trim().toLowerCase());
}
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}
function money(n) {
  return "R$ " + Number(n || 0).toLocaleString("pt-BR");
}
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast show";
  clearTimeout(window._tt);
  window._tt = setTimeout(() => { el.className = "toast"; }, 2400);
}
function key() { return "ta-platform:" + (session.uid || "local"); }
function saveLocal() { localStorage.setItem(key(), JSON.stringify(data)); }
async function saveCloud() {
  saveLocal();
  if (!session.uid || session.uid.startsWith("demo")) return;
  try {
    await setDoc(doc(db, "taTools", session.uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
  } catch { cloudOk = false; }
}
function loadLocal() {
  try { data = { ...emptyData(), ...(JSON.parse(localStorage.getItem(key()) || "{}")) }; }
  catch { data = emptyData(); }
}

function navItems() {
  const items = [
    ["home", "Início"], ["ciclo", "Primeiro ciclo"], ["ferramentas", "Ferramentas"],
    ["call", "Call"], ["notas", "Notas"], ["audios", "Áudios"]
  ];
  if (session.role === "mentor") items.push(["gestao", "Gestão"]);
  return items;
}
function closeSide() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sideBackdrop").classList.remove("open");
}
function paintNav() {
  document.getElementById("navMain").innerHTML = navItems().map(([id, label]) =>
    `<a class="nav-item${view === id || (view === "tool" && id === "ferramentas") || (view === "ciclo-item" && id === "ciclo") ? " active" : ""}" href="#" data-view="${id}">${label}</a>`
  ).join("");
  const titles = { home: "Início", ciclo: "Primeiro ciclo", "ciclo-item": "Prática", ferramentas: "Ferramentas", tool: "Ferramenta", call: "Call", notas: "Notas", audios: "Áudios", gestao: "Gestão" };
  document.getElementById("topTitle").textContent = titles[view] || "TA";
  document.getElementById("userName").textContent = session.name || "—";
  document.getElementById("userRole").textContent = session.role === "mentor" ? "Mentor" : "Mentoria";
  document.getElementById("userAv").textContent = (session.name || "A").charAt(0).toUpperCase();
  const plan = PLANS[session.plan];
  document.getElementById("planBadge").textContent = session.role === "mentor" ? "Mentor" : (plan ? plan.mentee : "Acesso");
}

function render() {
  paintNav();
  const root = document.getElementById("content");
  const map = { home: viewHome, ciclo: viewCiclo, "ciclo-item": viewCicloItem, ferramentas: viewTools, tool: viewTool, call: viewCall, notas: viewNotes, audios: viewAudios, gestao: viewGestao };
  root.innerHTML = `<div class="wrap">${(map[view] || viewHome)()}</div>`;
  bind(root);
}

function viewHome() {
  return `<p class="kicker">Dentro da mentoria</p>
    <h2 class="display">O milagre não está longe. Está em você. E dá para operar.</h2>
    <p class="lead">A ação mais alta é meditar. A força mais poderosa é a energia vital. O resto é treino: comunicar, vender, realizar. Isto não é um livro. É a sala onde a prática acontece.</p>
    <div class="grid">
      <article class="card"><p class="lbl">Meditação</p><h3>Ação mais alta</h3><p>Antes da técnica, a pessoa senta. Sem isso, o resto vira discurso.</p></article>
      <article class="card"><p class="lbl">Energia</p><h3>Força vital</h3><p>Sexual, criativa, a mesma corrente. Fica nesta sala. Não vai para a página aberta.</p></article>
      <article class="card"><p class="lbl">Ciclo</p><h3>Primeiro, não único</h3><p>Cinco práticas para começar. A mentoria não cabe nelas.</p></article>
    </div>
    <div class="stack">
      <div class="row" data-view="ciclo"><span class="num">01</span><div><b>Abrir o primeiro ciclo</b><span class="muted">Presença, energia, comunicação. Na prática.</span></div></div>
      <div class="row" data-view="ferramentas"><span class="num">02</span><div><b>Marcar o dia na ferramenta</b><span class="muted">Checklist e mapa. Não é PDF parado.</span></div></div>
    </div>
    <p class="muted" style="margin-top:18px">Arquitetura de Essência e Alinhamento Financeiro seguem nos endereços delas. Aqui é o treino que faz as duas saírem do conceito.</p>`;
}
function viewCiclo() {
  return `<p class="kicker">Primeiro ciclo</p><h2 class="display">Cinco práticas. A mentoria continua depois delas.</h2>
    <div class="stack">${CYCLE.map((c) => `<div class="row" data-cycle="${c.id}"><span class="num">${c.n}</span><div><b>${esc(c.title)}</b><span class="muted">${esc(c.line)}</span></div></div>`).join("")}</div>`;
}
function viewCicloItem() {
  const c = CYCLE.find((x) => x.id === toolId) || CYCLE[0];
  return `<button class="back" data-view="ciclo" type="button">← Ciclo</button>
    <p class="kicker">${c.n}${c.inner ? " · só nesta sala" : ""}</p>
    <h2 class="display">${esc(c.title)}</h2>
    <p class="lead">${esc(c.line)}</p>
    <ol class="steps">${c.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    <p style="margin-top:18px"><button class="btn btn-inline" type="button" data-tool="${c.tool}">Abrir a ferramenta</button></p>`;
}
function viewTools() {
  const list = [
    ["p1-check", "Checklist · fundamentos"], ["p1-cosmos", "Mapa · cosmologia pessoal"],
    ["p2-check", "Checklist · autoestima"], ["p2-affirm", "Mapa · autoafirmação"],
    ["p3-check", "Checklist · energia"], ["p3-leaks", "Mapa · vazamentos"],
    ["p4-check", "Checklist · presença"], ["p4-read", "Mapa · leitura de campo"],
    ["p5-check", "Checklist · integração"], ["p5-goal", "Mapa · 90 dias"]
  ];
  return `<p class="kicker">Ferramentas</p><h2 class="display">Marca. Preenche. Revisa.</h2>
    <div class="stack">${list.map(([id, title], i) => `<div class="row" data-tool="${id}"><span class="num">${String(i + 1).padStart(2, "0")}</span><div><b>${esc(title)}</b></div></div>`).join("")}</div>`;
}

function weekTool(id, cols) {
  let html = `<button class="back" data-view="ferramentas" type="button">← Ferramentas</button><h2 class="display">Duas semanas</h2>`;
  for (let w = 1; w <= 2; w++) {
    html += `<table class="tool-table"><thead><tr><th>Semana ${w}</th>${cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>`;
    for (const [d, label] of DAYS) {
      html += `<tr><td>${label}</td>${cols.map((c, i) => {
        const k = `${id}:${w}:${d}:${i}`;
        return `<td><input class="check" type="checkbox" data-check="${k}" ${data.checks[k] ? "checked" : ""}></td>`;
      }).join("")}</tr>`;
    }
    html += `</tbody></table>`;
  }
  return html;
}
function rowsTool(title, store, heads, backView) {
  const rows = data[store] || [];
  return `<button class="back" data-view="${backView || "ferramentas"}" type="button">← Ferramentas</button>
    <h2 class="display">${esc(title)}</h2>
    <table class="tool-table"><thead><tr>${heads.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>
    ${rows.map((row, ri) => `<tr>${heads.map((h, ci) => {
      const val = ci === 0 && row.area && !row.a && heads[0] !== "Data" ? row.area : (row[["area", "a", "b", "c", "d"][ci]] || "");
      const field = ["area", "a", "b", "c", "d"][ci];
      return `<td><input data-row="${store}:${ri}:${field}" value="${esc(ci === 0 ? (row.area || row.a || "") : (row[field] || ""))}" placeholder="${esc(h)}"></td>`;
    }).join("")}</tr>`).join("")}
    </tbody></table>
    <button class="btn btn-small" type="button" data-add="${store}">Acrescentar linha</button>`;
}
function viewTool() {
  const weeks = {
    "p1-check": ["Leitura de campo", "Ação consciente"],
    "p2-check": ["Observar sem julgar", "Afirmação", "Blindagem"],
    "p3-check": ["Respiração", "Recarga", "Vazamento fechado", "Transição"],
    "p4-check": ["Presença", "Olhar", "Voz", "Leitura aplicada"],
    "p5-check": ["Cinco códigos", "90 dias", "Visualização"]
  };
  if (weeks[toolId]) return weekTool(toolId, weeks[toolId]);
  if (toolId === "p1-cosmos") return rowsTool("Cosmologia pessoal", "cosmos", ["Área", "Crença de origem", "De onde veio", "O que faz hoje", "Frase que fica"]);
  if (toolId === "p2-affirm") return rowsTool("Autoafirmação", "affirms", ["Área", "Frase velha", "Frase que você sustenta", "Quando repete"]);
  if (toolId === "p3-leaks") return rowsTool("Vazamentos", "leaks", ["Tipo", "O que drena", "Efeito", "Ação", "Prazo"]);
  if (toolId === "p4-read") return rowsTool("Leitura de campo", "reads", ["Data", "Situação", "O que o corpo mostrou", "O que você leu", "Como confirmou"]);
  if (toolId === "p5-goal") return rowsTool("Plano de 90 dias", "goals", ["Meta", "Ação da semana", "Prazo", "Estado", "Ajuste"]);
  return viewTools();
}
function viewCall() {
  return `<p class="kicker">Ao vivo</p><h2 class="display">A sessão não é um vídeo gravado.</h2>
    <p class="lead">A entrevista decide se a pessoa entra. O número não aparece nesta sala.</p>
    <div class="field"><label>Combinado da próxima sessão</label><textarea id="callNote">${esc(data.callNote || "")}</textarea></div>
    <button class="btn btn-inline" id="saveCall" type="button">Guardar</button>
    <p style="margin-top:16px"><a class="btn btn-inline" href="https://wa.me/5571983448621" target="_blank" rel="noopener">WhatsApp</a></p>`;
}
function viewNotes() {
  return `<p class="kicker">Notas</p><h2 class="display">O que ficou da prática.</h2>
    <div class="field"><textarea id="notes">${esc(data.notes || "")}</textarea></div>
    <button class="btn btn-inline" id="saveNotes" type="button">Guardar</button>`;
}
function viewAudios() {
  const slots = ["Meditação", "Respiração", "Visualização"];
  return `<p class="kicker">Áudios</p><h2 class="display">O lugar está aberto.</h2>
    <p class="lead">O arquivo ainda não entrou. A prática não espera por ele.</p>
    <div class="stack">${slots.map((s) => `<div class="card"><p class="lbl">Vazio</p><h3>${s}</h3><p>Áudio ainda não publicado.</p></div>`).join("")}</div>`;
}
function viewGestao() {
  if (session.role !== "mentor") return `<p class="empty">Acesso do mentor.</p>`;
  return `<p class="internal">Interno. Estes números não aparecem para o mentorado e não vão para a página pública.</p>
    <p class="kicker">Piso da mentoria</p>
    <div class="grid">
      ${Object.entries(PLANS).map(([id, p]) => `<article class="card"><p class="lbl">${esc(p.mentor)}</p><p class="price">${money(p.floor)}</p><p>${esc(p.note)}</p></article>`).join("")}
    </div>
    <h3 class="display" style="margin:22px 0 8px;font-size:1.6rem">Liberar acesso</h3>
    <div class="split">
      <form id="grantForm" class="card">
        <div class="field"><label>UID</label><input name="uid" required placeholder="uid do Firebase"></div>
        <div class="field"><label>Nome</label><input name="name" placeholder="Nome"></div>
        <div class="field"><label>E-mail</label><input name="email" type="email" placeholder="email"></div>
        <div class="field"><label>Formato</label><select name="plan">${Object.entries(PLANS).map(([id, p]) => `<option value="${id}">${esc(p.mentor)} · piso ${money(p.floor)}</option>`).join("")}</select></div>
        <div class="field"><label>Valor fechado</label><input name="value" type="number" min="13000" step="1" value="39000"></div>
        <button class="btn" type="submit">Liberar</button>
        <p class="muted" style="margin-top:8px">${cloudOk ? "Grava em taAccess. O valor fica só em taComercial." : "A nuvem recusou. A liberação ficou neste aparelho até as regras do Firebase serem publicadas."}</p>
      </form>
      <div>
        <p class="lbl" style="color:var(--gold);font-size:10px;letter-spacing:2px;text-transform:uppercase">Pedidos</p>
        <div class="stack">${requests.length ? requests.map((r) => `<div class="card"><b>${esc(r.name || r.email || r.id)}</b><p>${esc(r.email || "")}</p><p class="muted">${esc(r.id)}</p><button class="btn btn-small" type="button" data-fill="${esc(r.id)}" data-name="${esc(r.name || "")}" data-email="${esc(r.email || "")}">Usar este UID</button></div>`).join("") : `<p class="muted">Ninguém pediu acesso ainda.</p>`}</div>
        <p class="lbl" style="color:var(--gold);font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-top:16px">Liberados</p>
        <div class="stack">${grants.length ? grants.map((g) => `<div class="card"><b>${esc(g.name || g.email || g.id)}</b><p>${esc(PLANS[g.plan]?.mentor || g.plan || "Acesso")}${g.active === false ? " · pausado" : ""}</p><button class="btn btn-small" type="button" data-pause="${esc(g.id)}">${g.active === false ? "Reativar" : "Pausar"}</button></div>`).join("") : `<p class="muted">Nenhum acesso liberado.</p>`}</div>
      </div>
    </div>`;
}

function bind(root) {
  root.querySelectorAll("[data-view]").forEach((el) => el.addEventListener("click", (e) => {
    e.preventDefault();
    view = el.dataset.view;
    closeSide();
    render();
  }));
  root.querySelectorAll("[data-cycle]").forEach((el) => el.addEventListener("click", () => {
    toolId = el.dataset.cycle;
    view = "ciclo-item";
    render();
  }));
  root.querySelectorAll("[data-tool]").forEach((el) => el.addEventListener("click", () => {
    toolId = el.dataset.tool;
    view = "tool";
    render();
  }));
  root.querySelectorAll("[data-check]").forEach((el) => el.addEventListener("change", () => {
    data.checks[el.dataset.check] = el.checked;
    saveCloud();
  }));
  root.querySelectorAll("[data-row]").forEach((el) => el.addEventListener("input", () => {
    const [store, ri, field] = el.dataset.row.split(":");
    if (!data[store][ri]) data[store][ri] = {};
    data[store][ri][field] = el.value;
    if (field === "area") data[store][ri].area = el.value;
    saveCloud();
  }));
  root.querySelectorAll("[data-add]").forEach((el) => el.addEventListener("click", () => {
    const store = el.dataset.add;
    data[store] = data[store] || [];
    data[store].push({ area: "", a: "", b: "", c: "", d: "" });
    saveCloud();
    render();
  }));
  root.querySelector("#saveNotes")?.addEventListener("click", () => { data.notes = root.querySelector("#notes").value; saveCloud(); toast("Nota guardada"); });
  root.querySelector("#saveCall")?.addEventListener("click", () => { data.callNote = root.querySelector("#callNote").value; saveCloud(); toast("Combinado guardado"); });
  const grantForm = root.querySelector("#grantForm");
  grantForm?.plan?.addEventListener("change", (e) => {
    const floor = PLANS[e.target.value]?.floor || 39000;
    grantForm.value.min = String(floor);
    grantForm.value.value = String(floor);
  });
  grantForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const uid = String(fd.get("uid") || "").trim();
    const plan = String(fd.get("plan") || "vip");
    const floor = PLANS[plan].floor;
    let value = Number(fd.get("value") || floor);
    if (value < floor) value = floor;
    const grant = { id: uid, name: String(fd.get("name") || "").trim(), email: String(fd.get("email") || "").trim().toLowerCase(), plan, active: true };
    const comercial = { value, plan, floor };
    grants = grants.filter((g) => g.id !== uid).concat(grant);
    localStorage.setItem("ta-grants", JSON.stringify(grants));
    localStorage.setItem("ta-comercial:" + uid, JSON.stringify(comercial));
    try {
      await setDoc(doc(db, "taAccess", uid), { ...grant, uid, approved: true, active: true, updatedAt: serverTimestamp() }, { merge: true });
      await setDoc(doc(db, "taComercial", uid), { ...comercial, updatedAt: serverTimestamp() }, { merge: true });
      await setDoc(doc(db, "taAccessRequests", uid), { status: "approved" }, { merge: true });
      cloudOk = true;
      toast("Acesso liberado");
    } catch {
      cloudOk = false;
      toast("Guardado neste aparelho. A nuvem ainda não aceita taAccess.");
    }
    render();
  });
  root.querySelectorAll("[data-fill]").forEach((el) => el.addEventListener("click", () => {
    const form = root.querySelector("#grantForm");
    form.uid.value = el.dataset.fill;
    form.name.value = el.dataset.name || "";
    form.email.value = el.dataset.email || "";
  }));
  root.querySelectorAll("[data-pause]").forEach((el) => el.addEventListener("click", async () => {
    const uid = el.dataset.pause;
    const g = grants.find((x) => x.id === uid);
    if (!g) return;
    g.active = g.active === false;
    localStorage.setItem("ta-grants", JSON.stringify(grants));
    try { await setDoc(doc(db, "taAccess", uid), { active: g.active, approved: g.active }, { merge: true }); } catch { cloudOk = false; }
    render();
  }));
}

function showApp() {
  document.getElementById("authShell").classList.add("hidden");
  document.getElementById("accessDenied").classList.remove("show");
  document.getElementById("appShell").classList.add("show");
  loadLocal();
  view = "home";
  render();
  if (session.uid) {
    getDoc(doc(db, "taTools", session.uid)).then((snap) => {
      if (!snap.exists()) return;
      data = { ...emptyData(), ...snap.data() };
      saveLocal();
      render();
    }).catch(() => {});
  }
  if (session.role === "mentor") listenBoard();
}
function showDenied() {
  document.getElementById("authShell").classList.add("hidden");
  document.getElementById("appShell").classList.remove("show");
  document.getElementById("accessDenied").classList.add("show");
}
function showAuth() {
  document.getElementById("authShell").classList.remove("hidden");
  document.getElementById("appShell").classList.remove("show");
  document.getElementById("accessDenied").classList.remove("show");
}
async function enterUser(user) {
  session.uid = user.uid;
  session.email = user.email || "";
  session.name = user.displayName || (user.email || "").split("@")[0] || "Mentoria";
  if (isMentor(user.uid, user.email)) {
    session.role = "mentor";
    session.plan = "vip";
    showApp();
    return;
  }
  session.role = "mentee";
  try {
    await setDoc(doc(db, "taAccessRequests", user.uid), {
      uid: user.uid, email: session.email, name: session.name, status: "pending", at: serverTimestamp()
    }, { merge: true });
  } catch { /* regras ainda não publicadas */ }
  try {
    const snap = await getDoc(doc(db, "taAccess", user.uid));
    const acc = snap.exists() ? snap.data() : null;
    if (!acc || acc.approved !== true || acc.active !== true) { showDenied(); return; }
    session.plan = acc.plan || "";
    session.name = acc.name || session.name;
    showApp();
  } catch { showDenied(); }
}
function listenBoard() {
  try { grants = JSON.parse(localStorage.getItem("ta-grants") || "[]"); } catch { grants = []; }
  try {
    unsubReq = onSnapshot(collection(db, "taAccessRequests"), (snap) => {
      requests = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((r) => r.status === "pending");
      if (view === "gestao") render();
    }, () => { cloudOk = false; });
    unsubGrants = onSnapshot(collection(db, "taAccess"), (snap) => {
      const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (remote.length) grants = remote;
      if (view === "gestao") render();
    }, () => { cloudOk = false; });
  } catch { cloudOk = false; }
}

document.getElementById("navMain").addEventListener("click", (e) => {
  const a = e.target.closest("[data-view]");
  if (!a) return;
  e.preventDefault();
  view = a.dataset.view;
  closeSide();
  render();
});
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("sideBackdrop").classList.add("open");
});
document.getElementById("sideBackdrop").addEventListener("click", closeSide);
document.getElementById("btnLogin").addEventListener("click", async () => {
  const msg = document.getElementById("authMsg");
  msg.className = "auth-msg";
  try {
    await signInWithEmailAndPassword(auth, document.getElementById("loginEmail").value.trim(), document.getElementById("loginPass").value);
  } catch (err) {
    msg.textContent = "Não entrou. Confira e-mail e senha.";
    msg.className = "auth-msg err";
  }
});
document.getElementById("btnGoogle").addEventListener("click", async () => {
  try { await signInWithPopup(auth, new GoogleAuthProvider()); }
  catch { const msg = document.getElementById("authMsg"); msg.textContent = "O Google não concluiu."; msg.className = "auth-msg err"; }
});
document.getElementById("btnLogout").addEventListener("click", () => signOut(auth));
document.getElementById("btnDeniedBack").addEventListener("click", () => signOut(auth));
onAuthStateChanged(auth, (user) => { if (user) enterUser(user); else showAuth(); });
