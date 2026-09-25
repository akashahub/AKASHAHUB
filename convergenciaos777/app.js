const SB_URL = "https://jsonmxbuzagmwuucruem.supabase.co";
const SB_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzb25teGJ1emFnbXd1dWNydWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0ODAzMTMsImV4cCI6MjA5NjA1NjMxM30.qqBI_AUm_AnP4D830QNUd3JIbPE6o54yzwej0utJ6rQ";
const FN = SB_URL + "/functions/v1/os-ticket";
const FN_GOOGLE = SB_URL + "/functions/v1/os-google";
const WORKER = "https://akasha.yanfili-simon.workers.dev";
const ADMINS = ["yanfili.simon@gmail.com", "sendatantrica@gmail.com"];
const TICKETS = [
  { id: "digital", name: "Digital", price: "R$ 97", text: "Assiste as três lives: Business, Tech e Mindset." },
  { id: "presencial", name: "Presencial", price: "R$ 497", text: "As três lives e os nove palcos. Cada palco é uma call de direção." }
];
const PILLARS = [
  {
    id: "business", mark: "◈", name: "Business",
    live: "A live de Business. Um apresentador. O público assiste.",
    stages: [
      { id: "business-comunicacao", mark: "✎", name: "Comunicação", niche: "Quem fala, marca e conduz a narrativa." },
      { id: "business-empreender", mark: "▲", name: "Empreendedorismo", niche: "Quem constrói o negócio e o caixa." },
      { id: "business-vendas", mark: "→", name: "Vendas", niche: "Quem fecha, oferece e converte." }
    ]
  },
  {
    id: "tech", mark: "⌬", name: "Tech",
    live: "A live de Tech. Um apresentador. O público assiste.",
    stages: [
      { id: "tech-produto", mark: "□", name: "Produto", niche: "O que se entrega e como se usa." },
      { id: "tech-audiovisual", mark: "●", name: "Audiovisual", niche: "Quem grava, dirige a imagem e o som." },
      { id: "tech-plataforma", mark: "▣", name: "Plataforma", niche: "A sala técnica do sistema." }
    ]
  },
  {
    id: "mindset", mark: "✶", name: "Mindset",
    live: "A live de Mindset. Um apresentador. O público assiste.",
    stages: [
      { id: "mindset-foco", mark: "○", name: "Foco", niche: "Atenção antes de entrar." },
      { id: "mindset-corpo", mark: "+", name: "Corpo", niche: "Presença física e ritmo." },
      { id: "mindset-legado", mark: "∞", name: "Legado", niche: "O que fica depois do dia." }
    ]
  }
];

const sb = supabase.createClient(SB_URL, SB_ANON);
try {
  firebase.initializeApp({
    apiKey: "AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4",
    authDomain: "hub-akasha.firebaseapp.com",
    projectId: "hub-akasha",
    appId: "1:370851875474:web:29b1ba3a76b0fed7d9344b",
  });
} catch (e) {}
const state = { route: "boot", pillar: "business", room: null, reel: 0, q: "", liked: {}, people: [], presenters: [], ticket: null, emailDraft: "", busy: "", loginError: "" };
const LIVE_URL = "wss://akashahub-vlya29kl.livekit.cloud";
let session = null;
let lk = null;

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function email() { return session && session.user && session.user.email ? session.user.email.toLowerCase() : ""; }
function isAdmin() { return ADMINS.includes(email()); }
function person() { return state.people.find((p) => p.email === email()) || null; }
function myTicket() {
  if (isAdmin()) return "admin";
  return state.ticket;
}
function roomById(id) {
  for (const pillar of PILLARS) {
    if (pillar.id === id) return { ...pillar, kind: "live", pillar: pillar.id, livekit: "os-live-" + pillar.id };
    const stage = pillar.stages.find((s) => s.id === id);
    if (stage) return { ...stage, kind: "stage", pillar: pillar.id, livekit: "os-stage-" + stage.id };
  }
  return null;
}
function presenterEmail(roomId) {
  const row = state.presenters.find((p) => p.room_id === roomId);
  return row ? row.email : "";
}
function presenterName(roomId) {
  const who = presenterEmail(roomId);
  if (!who) return "Direção a confirmar";
  return who.split("@")[0];
}
function canPublish(room) {
  if (!room) return false;
  if (email() === "sendatantrica@gmail.com") return true;
  if (isAdmin()) return true;
  if (presenterEmail(room.id) === email()) return true;
  const p = person();
  return !!(p && p.status === "in" && p.role === "recorder");
}
function canEnter(room) {
  if (!room) return false;
  const p = person();
  if (p && p.status === "out") return false;
  if (isAdmin()) return true;
  if (p && p.status === "in" && (p.role === "guest" || p.role === "recorder" || p.role === "presenter")) return true;
  if (!state.ticket) return false;
  if (room.kind === "live") return true;
  return state.ticket === "presencial";
}
function toast(text) {
  document.querySelectorAll(".toast").forEach((el) => el.remove());
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = text;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 2600);
}
function go(route) { state.route = route; render(); }

async function loadAccess() {
  if (!session) return;
  if (isAdmin()) state.ticket = "admin";
  else {
    const { data } = await sb.from("os_tickets").select("ticket").eq("email", email()).maybeSingle();
    state.ticket = data ? data.ticket : null;
  }
  const people = await sb.from("os_people").select("email,status,role");
  state.people = people.data || [];
  const presenters = await sb.from("os_presenters").select("room_id,email");
  state.presenters = presenters.data || [];
}

async function api(body) {
  const res = await fetch(FN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SB_ANON,
      Authorization: "Bearer " + session.access_token,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "falha");
  return data;
}

function svg(body) {
  return '<svg viewBox="0 0 24 24" aria-hidden="true">' + body + "</svg>";
}
function tab() {
  if (state.route === "explore") return "explore";
  if (state.route === "create") return "create";
  if (state.route === "reel" || state.route === "room") return "reel";
  if (state.route === "eu" || state.route === "gestao" || state.route === "ticket") return "eu";
  return "home";
}
function shell(html, top) {
  const active = tab();
  const nav = [
    ["home", svg('<path d="M4 11 12 4l8 7"/><path d="M6 10.5V20h12v-9.5"/>')],
    ["explore", svg('<circle cx="11" cy="11" r="6"/><path d="m20 20-3.2-3.2"/>')],
    ["create", svg('<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>')],
    ["reel", svg('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m10 8 6 4-6 4z"/>')],
    ["eu", '<span class="me">' + esc((email() || "?").slice(0, 1).toUpperCase()) + "</span>"]
  ].map((item) => '<button class="' + (active === item[0] ? "on" : "") + '" data-act="go" data-id="' + item[0] + '" aria-label="' + item[0] + '">' + item[1] + "</button>").join("");
  const bar = top || '<header class="top"><b>Convergência</b><div class="icons"><button data-act="go" data-id="eu" aria-label="Atividade">' + svg('<path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"/>') + "</button></div></header>";
  return '<div class="wrap">' + bar + html + '<nav class="nav">' + nav + "</nav></div>";
}
function stories() {
  const circles = PILLARS.map((p) => '<button class="story" data-act="open-pillar" data-id="' + p.id + '"><span class="ring"><i>' + p.mark + '</i></span><small>' + esc(p.name) + "</small></button>").join("");
  const stages = PILLARS.flatMap((p) => p.stages).map((s) => '<button class="story" data-act="open-room" data-id="' + s.id + '"><span class="ring"><i>' + s.mark + '</i></span><small>' + esc(s.name) + "</small></button>").join("");
  return '<div class="stories">' + circles + stages + "</div>";
}
function post(id, mark, name, sub, caption, roomId) {
  const on = state.liked[id] ? " color:var(--hot)" : "";
  return '<article class="post"><div class="post-h"><button data-act="open-pillar" data-id="' + id + '"><span class="mark">' + mark + '</span></button><button data-act="open-pillar" data-id="' + id + '"><strong>' + esc(name) + '</strong><div class="m">' + esc(sub) + '</div></button></div><button class="media" data-act="open-room" data-id="' + roomId + '"><span class="mark">' + mark + '</span><span class="pill hot"><i class="dot"></i> ao vivo</span></button><div class="actions"><button class="iconbtn" data-act="like" data-id="' + id + '" aria-label="Curtir" style="' + on + '">' + svg('<path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"/>') + '</button><button class="iconbtn" data-act="open-pillar" data-id="' + id + '" aria-label="Palcos">' + svg('<path d="M5 6h14v9H8l-3 3z"/>') + '</button><button class="iconbtn sp" data-act="go" data-id="eu" aria-label="Guardar">' + svg('<path d="M7 4h10v16l-5-3-5 3z"/>') + "</button></div><p class=\"caption\"><strong>" + esc(name.toLowerCase()) + "</strong> " + esc(caption) + "</p></article>";
}

function viewLogin() {
  return '<div class="gate"><div class="k">Convergência · teste aberto</div><h1>Entra com Google.</h1><p class="q">Depois do Google a plataforma abre nos três pilares. Gestor entra sem ingresso.</p><button class="btn" data-act="google">' + (state.busy === "google" ? "Abrindo a plataforma..." : "Continuar com Google") + '</button>' + (state.loginError ? '<p class="q" style="color:#f0b2ac">' + esc(state.loginError) + "</p>" : "") + '<p class="m" style="margin-top:18px">Se o Google não abrir, entra com o código do e-mail.</p><label class="m">E-mail</label><input id="mail" type="email" value="' + esc(state.emailDraft) + '" placeholder="voce@gmail.com"><button class="btn btn2" data-act="send">Receber código</button><input id="code" inputmode="numeric" placeholder="000000"><button class="btn btn2" data-act="code">Entrar com o código</button></div>';
}
function viewTickets() {
  const cards = TICKETS.map((t) => '<article class="card"><div class="row"><h3>' + t.name + '</h3><span class="pill">' + t.price + '</span></div><p class="q">' + t.text + '</p><button class="btn" data-act="buy" data-id="' + t.id + '">Pagar ' + t.price + '</button></article>').join("");
  return shell('<div class="pad"><div class="k">Ingresso</div><h1>Escolhe como entra.</h1><p class="q">O Stripe deste projeto ainda está em teste. Use o cartão 4242 4242 4242 4242, uma data futura e qualquer CVC. Nada disso vira cobrança real.</p>' + cards + (isAdmin() ? '<button class="btn btn3" data-act="go" data-id="gestao">Gestão de quem entra</button>' : "") + "</div>");
}
function viewHome() {
  const feed = PILLARS.map((p) => post(p.id, p.mark, p.name, "Apresenta " + presenterName(p.id), p.live, p.id)).join("");
  return shell(stories() + feed);
}
function viewExplore() {
  const q = state.q.trim().toLowerCase();
  const cells = PILLARS.flatMap((p) => [{ id: p.id, mark: p.mark, name: p.name }].concat(p.stages.map((s) => ({ id: s.id, mark: s.mark, name: s.name }))))
    .filter((item) => !q || item.name.toLowerCase().includes(q));
  const grid = cells.map((item) => '<button data-act="open-room" data-id="' + item.id + '" title="' + esc(item.name) + '">' + item.mark + "</button>").join("");
  return shell('<div style="padding:12px 14px 0"><input id="q" data-bind="q" value="' + esc(state.q) + '" placeholder="Buscar pilar ou palco"></div><div class="grid">' + grid + "</div>");
}
function viewCreate() {
  const lives = PILLARS.map((p) => '<button class="card" data-act="open-room" data-id="' + p.id + '"><div class="row"><span class="mark">' + p.mark + '</span><div><h3>Ir ao vivo em ' + esc(p.name) + '</h3><div class="m">' + (canPublish(roomById(p.id)) ? "Sua câmera publica para quem assiste." : "Você entra assistindo.") + "</div></div></div></button>").join("");
  return shell('<div style="padding:16px"><div class="k">Criar</div><h1>O que vai para o feed.</h1><p class="q">A live do pilar é o que todo mundo vê. O palco é a call menor, dentro do perfil daquele pilar.</p>' + lives + "</div>");
}
function viewReel() {
  const pillar = PILLARS[state.reel] || PILLARS[0];
  return shell('<section class="reel"><span class="pill hot"><i class="dot"></i> ao vivo</span><div class="mark" style="width:84px;height:84px;font-size:40px;margin:16px 0">' + pillar.mark + '</div><h1>' + esc(pillar.name) + '</h1><p class="q">Apresenta ' + esc(presenterName(pillar.id)) + '. ' + esc(pillar.live) + '</p><div class="row" style="margin-top:16px"><button class="btn inline btn2" data-act="reel" data-id="-1">Anterior</button><button class="btn inline" data-act="open-room" data-id="' + pillar.id + '">Entrar</button><button class="btn inline btn2" data-act="reel" data-id="1">Próxima</button></div></section>', '<header class="top"><b>Live</b><span class="m">' + (state.reel + 1) + " / 3</span></header>");
}
function viewPillar() {
  const pillar = PILLARS.find((p) => p.id === state.pillar) || PILLARS[0];
  const live = roomById(pillar.id);
  const grid = pillar.stages.map((s) => '<button data-act="open-room" data-id="' + s.id + '">' + s.mark + "</button>").join("");
  return shell('<div style="padding:16px 16px 0"><div class="row"><span class="ring"><i>' + pillar.mark + '</i></span><div class="row" style="flex:1;justify-content:space-around"><div><strong>1</strong><div class="m">live</div></div><div><strong>3</strong><div class="m">palcos</div></div><div><strong>' + esc(presenterName(pillar.id).slice(0, 8)) + '</strong><div class="m">apresenta</div></div></div></div><h1 style="margin-top:14px">' + esc(pillar.name) + '</h1><p class="q">' + esc(pillar.live) + '</p><button class="btn" data-act="open-room" data-id="' + pillar.id + '">' + (canEnter(live) ? "Entrar na live" : "Ver ingresso") + '</button></div><div class="grid">' + grid + "</div>");
}
function viewRoom() {
  const room = roomById(state.room);
  if (!room) return viewHome();
  if (!canEnter(room)) {
    return shell('<div class="pad"><div class="k">Acesso</div><h1>Este lugar pede o ingresso certo.</h1><p class="q">' + (room.kind === "stage" ? "Palco é do ingresso presencial, ou de quem a gestão colocou para dentro." : "A live pede um ingresso.") + '</p><button class="btn" data-act="go" data-id="ticket">Ver ingressos</button></div>');
  }
  const publish = canPublish(room);
  return shell('<div class="pad"><div class="k">' + (room.kind === "live" ? "Live" : "Palco") + " · " + esc(presenterName(room.kind === "live" ? room.id : room.pillar)) + '</div><h1>' + room.mark + " " + esc(room.name) + '</h1><p class="q">' + (publish ? "Sua câmera pode entrar. A direção e o audiovisual autorizado publicam. O restante assiste." : "Você assiste. A câmera fica com o apresentador e com quem está liberado para gravar.") + '</p><div class="stage" id="stage"></div><div class="tiles" id="tiles"></div><button class="btn" data-act="join">' + (publish ? "Entrar publicando" : "Entrar assistindo") + '</button><button class="btn btn2" data-act="leave">Sair da sala</button></div>');
}
function viewEu() {
  const t = myTicket();
  const label = t === "admin" ? "Gestão" : t === "presencial" ? "Presencial" : t === "digital" ? "Digital" : "Sem ingresso";
  const note = email() === "sendatantrica@gmail.com" ? "Grava em qualquer sala." : isAdmin() ? "Coloca gente para dentro e para fora." : "O ingresso decide a live e os palcos.";
  const grid = PILLARS.map((p) => '<button data-act="open-pillar" data-id="' + p.id + '">' + p.mark + "</button>").join("");
  return shell('<div style="padding:16px 16px 0"><div class="row"><span class="ring"><i>' + esc((email() || "?").slice(0, 1).toUpperCase()) + '</i></span><div class="row" style="flex:1;justify-content:space-around"><div><strong>3</strong><div class="m">lives</div></div><div><strong>9</strong><div class="m">palcos</div></div><div><strong>' + esc(label) + '</strong><div class="m">acesso</div></div></div></div><h1 style="font-size:22px;margin-top:14px">' + esc(email()) + '</h1><p class="q">' + note + '</p>' + (t ? "" : '<button class="btn" data-act="go" data-id="ticket">Comprar ingresso</button>') + (isAdmin() ? '<button class="btn btn3" data-act="go" data-id="gestao">Gestão</button>' : "") + '<button class="btn btn2" data-act="out">Sair</button></div><div class="grid">' + grid + "</div>");
}
function viewGestao() {
  if (!isAdmin()) return viewEu();
  const rows = state.people.filter((p) => !ADMINS.includes(p.email)).map((p) => '<article class="card"><strong>' + esc(p.email) + '</strong><div class="m">' + esc(p.status) + " · " + esc(p.role) + '</div><div class="row" style="margin-top:8px"><button class="btn inline btn3" data-act="set-in" data-id="' + esc(p.email) + '">Entra</button><button class="btn inline btn2" data-act="set-out" data-id="' + esc(p.email) + '">Sai</button><button class="btn inline btn2" data-act="set-rec" data-id="' + esc(p.email) + '">Grava</button></div></article>').join("");
  const lives = PILLARS.map((p) => '<article class="card"><div class="k">' + p.name + '</div><label class="m">Apresentador da live</label><input id="pres-' + p.id + '" value="' + esc(presenterEmail(p.id)) + '" placeholder="email do apresentador"><button class="btn" data-act="set-pres" data-id="' + p.id + '">Salvar apresentador</button></article>').join("");
  return shell('<div class="pad"><div class="k">Gestão</div><h1>Quem entra e quem sai.</h1><p class="q">yanfili.simon@gmail.com e sendatantrica@gmail.com entram sem pagar. sendatantrica grava em qualquer sala.</p><article class="card"><label class="m">E-mail</label><input id="who" placeholder="pessoa@gmail.com"><button class="btn" data-act="add-in">Colocar para dentro</button></article>' + rows + lives + "</div>");
}

function render() {
  const root = document.getElementById("app");
  let html = viewLogin();
  if (session && state.route === "home") html = viewHome();
  else if (session && state.route === "explore") html = viewExplore();
  else if (session && state.route === "create") html = viewCreate();
  else if (session && state.route === "reel") html = viewReel();
  else if (session && state.route === "pillar") html = viewPillar();
  else if (session && state.route === "room") html = viewRoom();
  else if (session && state.route === "ticket") html = myTicket() ? viewEu() : viewTickets();
  else if (session && state.route === "eu") html = viewEu();
  else if (session && state.route === "gestao") html = viewGestao();
  else if (session) html = myTicket() ? viewHome() : viewTickets();
  root.innerHTML = html;
  document.title = "Convergência OS";
}

async function loginGoogle() {
  state.busy = "google";
  state.loginError = "";
  render();
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    await exchangeGoogle(result.user);
  } catch (err) {
    state.busy = "";
    if (err && err.code === "auth/popup-blocked") {
      await firebase.auth().signInWithRedirect(provider);
      return;
    }
    state.loginError = err && err.message ? err.message : "Google não abriu.";
    render();
  }
}
async function exchangeGoogle(user) {
  if (!user) return;
  const token = await user.getIdToken();
  const res = await fetch(FN_GOOGLE, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SB_ANON },
    body: JSON.stringify({ token }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Não abri a sessão.");
  let error = null;
  if (data.email_otp) {
    const otp = await sb.auth.verifyOtp({ email: data.email || user.email, token: data.email_otp, type: "email" });
    error = otp.error;
  }
  if (error && data.token_hash) {
    const hash = await sb.auth.verifyOtp({ token_hash: data.token_hash, type: "magiclink" });
    error = hash.error;
  }
  if (!data.email_otp && data.token_hash && !error) {
    const hash = await sb.auth.verifyOtp({ token_hash: data.token_hash, type: "magiclink" });
    error = hash.error;
  }
  if (error) throw new Error(error.message);
  state.busy = "";
  await loadAccess();
  state.route = myTicket() ? "home" : "ticket";
  render();
}
async function sendCode() {
  const mail = (document.getElementById("mail").value || "").trim().toLowerCase();
  if (!mail.includes("@")) { toast("Coloca um e-mail."); return; }
  state.emailDraft = mail;
  const { error } = await sb.auth.signInWithOtp({ email: mail });
  if (error) { toast(error.message); return; }
  toast("Código enviado. Olha o e-mail.");
  render();
}
async function verifyCode() {
  const mail = (document.getElementById("mail").value || state.emailDraft || "").trim().toLowerCase();
  const code = (document.getElementById("code").value || "").trim();
  if (!mail || code.length < 6) { toast("E-mail e código de 6 dígitos."); return; }
  const { error } = await sb.auth.verifyOtp({ email: mail, token: code, type: "email" });
  if (error) { toast(error.message); return; }
}
async function buy(ticket) {
  try {
    const data = await api({ action: "checkout", ticket });
    if (data.waived) { state.ticket = "admin"; render(); return; }
    if (!data.url) throw new Error("sem link");
    location.href = data.url;
  } catch (err) { toast(err.message || "Pagamento não abriu."); }
}
async function confirmPaid() {
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");
  if (!session || !sessionId) return;
  try {
    const data = await api({ action: "confirm", sessionId });
    state.ticket = data.ticket || state.ticket;
    history.replaceState(null, "", location.pathname);
    toast("Ingresso confirmado.");
  } catch (err) { toast(err.message || "Não confirmei o pagamento."); }
}
async function setPerson(who, status, role) {
  const emailTo = who.trim().toLowerCase();
  if (!emailTo.includes("@")) { toast("E-mail inválido."); return; }
  if (ADMINS.includes(emailTo) && status === "out") { toast("Gestor não sai por aqui."); return; }
  const { error } = await sb.from("os_people").upsert({ email: emailTo, status, role, updated_at: new Date().toISOString() });
  if (error) { toast(error.message); return; }
  await loadAccess();
  toast(status === "out" ? "Saiu." : "Entrou.");
  render();
}
async function setPresenter(roomId) {
  const input = document.getElementById("pres-" + roomId);
  const who = (input && input.value || "").trim().toLowerCase();
  if (!who.includes("@")) { toast("E-mail do apresentador."); return; }
  const { error } = await sb.from("os_presenters").upsert({ room_id: roomId, email: who });
  if (error) { toast(error.message); return; }
  await loadAccess();
  toast("Apresentador salvo.");
  render();
}

async function joinRoom() {
  const room = roomById(state.room);
  if (!room || !window.LivekitClient) { toast("A sala ainda está carregando."); return; }
  const publish = canPublish(room);
  try {
    const res = await fetch(WORKER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: email(), room: room.livekit, name: email().split("@")[0], mentor: publish })
    });
    const data = await res.json();
    if (!data.token) throw new Error("sem sinal");
    const liveUrl = data.url || LIVE_URL;
    if (lk) { try { await lk.disconnect(); } catch (e) {} }
    lk = new LivekitClient.Room();
    const placeVideo = (el) => {
      const stage = document.getElementById("stage");
      if (stage && !stage.querySelector("video")) stage.appendChild(el);
      else {
        const box = document.getElementById("tiles");
        if (box) box.appendChild(el);
      }
    };
    lk.on(LivekitClient.RoomEvent.TrackSubscribed, (track) => {
      const el = track.attach();
      if (track.kind === "audio") { el.style.display = "none"; document.body.appendChild(el); return; }
      placeVideo(el);
    });
    lk.on(LivekitClient.RoomEvent.LocalTrackPublished, (pub) => {
      if (pub.track && pub.track.kind === "video") placeVideo(pub.track.attach());
    });
    await lk.connect(liveUrl, data.token);
    if (publish) await lk.localParticipant.enableCameraAndMicrophone();
    toast(publish ? "Você está publicando." : "Você está assistindo.");
  } catch (err) {
    const stage = document.getElementById("stage");
    const message = err && err.message ? err.message : "sinal indisponível";
    if (stage) stage.innerHTML = '<p class="q">A sala não conectou: ' + esc(message) + "</p>";
    toast("A sala não conectou.");
  }
}
async function leaveRoom() {
  try { if (lk) await lk.disconnect(); } catch (e) {}
  lk = null;
  const room = roomById(state.room);
  state.route = room && room.kind === "stage" ? "pillar" : "home";
  if (room && room.kind === "stage") state.pillar = room.pillar;
  render();
}

document.getElementById("app").addEventListener("input", (event) => {
  if (event.target.dataset.bind !== "q") return;
  state.q = event.target.value;
  const pos = event.target.selectionStart;
  render();
  const field = document.getElementById("q");
  if (field) { field.focus(); try { field.setSelectionRange(pos, pos); } catch (e) {} }
});
document.getElementById("app").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-act]");
  if (!button) return;
  const act = button.dataset.act;
  const id = button.dataset.id || "";
  if (act === "google") return loginGoogle();
  if (act === "send") return sendCode();
  if (act === "code") return verifyCode();
  if (!session) return;
  if (act === "go") { state.route = id; render(); return; }
  if (act === "like") { state.liked[id] = !state.liked[id]; render(); return; }
  if (act === "reel") {
    state.reel = (state.reel + Number(id) + PILLARS.length) % PILLARS.length;
    state.route = "reel";
    render();
    return;
  }
  if (act === "buy") return buy(id);
  if (act === "out") { await sb.auth.signOut(); return; }
  if (act === "open-pillar") { state.pillar = id; state.route = "pillar"; render(); return; }
  if (act === "open-room") { state.room = id; state.route = "room"; render(); return; }
  if (act === "join") return joinRoom();
  if (act === "leave") return leaveRoom();
  if (act === "add-in") return setPerson(document.getElementById("who").value, "in", "guest");
  if (act === "set-in") return setPerson(id, "in", "guest");
  if (act === "set-out") return setPerson(id, "out", "audience");
  if (act === "set-rec") return setPerson(id, "in", "recorder");
  if (act === "set-pres") return setPresenter(id);
});

firebase.auth().getRedirectResult().then((result) => {
  if (result && result.user) exchangeGoogle(result.user).catch((err) => toast(err.message || "Google não concluiu."));
}).catch(() => {});
sb.auth.onAuthStateChange(async (_event, next) => {
  session = next;
  if (!session) { state.route = "boot"; render(); return; }
  await loadAccess();
  await confirmPaid();
  if (state.route === "boot" || state.route === "ticket") state.route = myTicket() ? "home" : "ticket";
  render();
});
render();
