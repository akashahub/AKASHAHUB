/* Convergência OS — ADD em /convergenciaos777. Não altera /legado-os. */
const EVENT = { id: "convergencia-os", name: "Convergência", edition: "OS-777", city: "Território + rede" };
const CEO_EMAILS = ["yanfili.simon@gmail.com", "plmacramo@gmail.com", "sendatantrica@gmail.com", "opatricksimon@gmail.com"];
const CEO_UIDS = ["1GO7dRdFUFg2NwYwzOwjvtWfpAS2"];
const LS = "convergencia.os777.v1";
const WORKER = "https://akasha.yanfili-simon.workers.dev";
const LK_URL = "wss://akashahub-vlya29kl.livekit.cloud";
const CATS = ["Business", "Technology", "Mindset", "Wellness", "Culture", "Music", "Sport", "Hospitality", "Digital", "Community"];
const PERMS = [
  ["can_post_content", "Publicar"],
  ["can_create_live", "Criar live"],
  ["can_schedule_live", "Agendar"],
  ["can_upload_video", "Enviar vídeo"],
  ["can_go_live_now", "Abrir live agora"],
  ["can_create_story", "Atualização"],
  ["can_appear_featured", "Destaque"],
  ["can_access_creator_dashboard", "Studio"]
];
const CHAIN = [
  ["ticket", "Ingressos", "eu"],
  ["id", "Identidade", "eu"],
  ["access", "Acesso", "admin"],
  ["stay", "Hospedagem", "os"],
  ["program", "Programação", "os"],
  ["rooms", "Salas", "vivo"],
  ["stream", "Streaming", "vivo"],
  ["sec", "Segurança operacional", "admin"],
  ["game", "Gamificação", "jogo"],
  ["net", "Networking", "mesa"],
  ["market", "Marketplace", "mesa"],
  ["content", "Conteúdo", "now"],
  ["pay", "Pagamentos", "os"],
  ["data", "Dados", "admin"],
  ["replay", "Replay", "library"],
  ["community", "Comunidade", "mesa"],
  ["next", "Próxima edição", "os"]
];

let firebaseReady = false;
try {
  firebase.initializeApp({
    apiKey: "AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4",
    authDomain: "hub-akasha.firebaseapp.com",
    projectId: "hub-akasha",
    storageBucket: "hub-akasha.firebasestorage.app",
    messagingSenderId: "370851875474",
    appId: "1:370851875474:web:29b1ba3a76b0fed7d9344b"
  });
  firebaseReady = true;
} catch (e) { firebaseReady = false; }

const state = { route: "boot", roomId: null, filter: "Tudo", q: "", persona: "ops", toast: "" };
let session = null;
let lkRoom = null;
let toastTimer = null;

function load() {
  try { return JSON.parse(localStorage.getItem(LS)) || null; } catch (e) { return null; }
}
function blank() {
  return {
    seeded: false, users: {}, perms: {}, posts: [], follows: [], schedules: [], sessions: [],
    replays: [], notes: [], reminders: [], likes: {}, comments: {}, tx: [],
    config: {
      liveApproval: "auto",
      globalRooms: true,
      retention: "MANUAL",
      quality: { official: "1080p", creator: "720p", mobile: "otimizada" },
      storage: ["OFFICIAL_EVENT_CONTENT", "CREATOR_CONTENT", "USER_CONTENT", "REPLAYS"]
    }
  };
}
let C = load() || blank();
if (!C.seeded) seed();

function save() { localStorage.setItem(LS, JSON.stringify(C)); }
function rid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function iso() { return new Date().toISOString(); }
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function plusMin(min) { return new Date(Date.now() + min * 60000).toISOString(); }
function user(id) { return C.users[id] || null; }
function me() { return session ? user(session.uid) : null; }
function isCeo(u) {
  if (!u) return false;
  return CEO_UIDS.indexOf(u.uid) >= 0 || CEO_EMAILS.indexOf(String(u.email || "").toLowerCase()) >= 0;
}
function isAdmin() {
  const u = me();
  return !!(u && (u.role === "ADMIN" || isCeo(u)));
}
function can(key) {
  if (!session) return false;
  if (isAdmin()) return true;
  const p = C.perms[session.uid] || {};
  return !!p[key];
}
function initials(name) {
  return String(name || "?").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}
function whenLocal(stamp) {
  return new Date(stamp).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
function whenZone(stamp, tz) {
  try { return new Date(stamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: tz }); }
  catch (e) { return whenLocal(stamp); }
}
function minsUntil(stamp) { return (new Date(stamp) - Date.now()) / 60000; }
function liveLabel(stamp) {
  const m = minsUntil(stamp);
  if (m <= 0) return "LIVE NOW";
  if (m <= 5) return "LIVE IN 5 MIN";
  if (m <= 30) return "LIVE IN 30 MIN";
  if (m <= 120) return "LIVE IN 2H";
  return "COMING LIVE";
}
function toast(text) {
  state.toast = text;
  clearTimeout(toastTimer);
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  document.body.appendChild(el);
  toastTimer = setTimeout(() => { el.remove(); state.toast = ""; }, 2400);
}
function go(route) {
  state.route = route;
  try { history.replaceState(null, "", "#" + route); } catch (e) {}
  render();
}
function note(uid, text, dest) {
  C.notes.unshift({ id: rid(), uid, text, dest: dest || "now", at: iso(), read: false });
  if (C.notes.length > 80) C.notes.length = 80;
}
function xp() {
  if (!session) return 0;
  return C.tx.filter((t) => t.uid === session.uid).reduce((s, t) => s + t.amount, 0);
}
function hasTx(action) { return C.tx.some((t) => t.uid === session.uid && t.action === action); }
function grantXp(action, amount) {
  if (hasTx(action)) return;
  C.tx.push({ uid: session.uid, action, amount, at: iso() });
}

function seed() {
  const zone = (Intl.DateTimeFormat().resolvedOptions().timeZone) || "America/Sao_Paulo";
  C = blank();
  C.seeded = true;
  const people = [
    { uid: "ops", name: "Operação", email: "ops@local", role: "ADMIN", bio: "Gestão de acessos e programação.", place: "Brasil", cat: "Digital", interests: ["Business", "Technology"] },
    { uid: "hotel", name: "Casa", email: "casa@local", role: "CREATOR", bio: "Bastidores do território físico.", place: "Hotel", cat: "Hospitality", interests: ["Hospitality", "Wellness"] },
    { uid: "canada", name: "Creator Canadá", email: "canada@local", role: "CREATOR", bio: "Entra de longe, no mesmo organismo.", place: "Canadá", cat: "Digital", interests: ["Digital"] },
    { uid: "dj", name: "DJ", email: "dj@local", role: "CREATOR", bio: "Preparação do som.", place: "Território", cat: "Music", interests: ["Music"] },
    { uid: "well", name: "Wellness", email: "well@local", role: "CREATOR", bio: "Atividade de corpo e foco.", place: "Território", cat: "Wellness", interests: ["Wellness"] },
    { uid: "tokyo", name: "Creator Tóquio", email: "tokyo@local", role: "CREATOR", bio: "Live global. Não precisa viajar.", place: "Tokyo, Japan", cat: "Mindset", interests: ["Mindset"], tz: "Asia/Tokyo" }
  ];
  people.forEach((p) => { C.users[p.uid] = p; C.perms[p.uid] = {}; });
  PERMS.forEach((pair) => { C.perms.ops[pair[0]] = true; });
  C.perms.hotel.can_post_content = true;
  C.perms.hotel.can_create_story = true;
  C.perms.hotel.can_access_creator_dashboard = true;
  ["canada", "dj", "well", "tokyo"].forEach((id) => {
    C.perms[id].can_post_content = true;
    C.perms[id].can_create_live = true;
    C.perms[id].can_schedule_live = true;
    C.perms[id].can_go_live_now = true;
    C.perms[id].can_access_creator_dashboard = true;
    C.perms[id].can_appear_featured = true;
  });
  C.sessions.push(
    { id: "st-bus", official: true, state: "live", title: "Business", category: "Business", creatorId: "ops", creatorName: "Operação", storage: "OFFICIAL_EVENT_CONTENT", quality: "1080p", startedAt: iso(), comments: [], viewers: 1280 },
    { id: "st-tech", official: true, state: "live", title: "Technology", category: "Technology", creatorId: "ops", creatorName: "Operação", storage: "OFFICIAL_EVENT_CONTENT", quality: "1080p", startedAt: iso(), comments: [], viewers: 860 }
  );
  C.schedules.push(
    { id: "sch-mind", official: true, status: "approved", state: "scheduled", title: "Mindset", category: "Mindset", creatorId: "ops", creatorName: "Operação", start: plusMin(10), durationMin: 40, tz: zone, reveal: "full", teaser: "", place: "Território", storage: "OFFICIAL_EVENT_CONTENT" },
    { id: "sch-tokyo", official: false, status: "approved", state: "scheduled", title: "Future of Human Creativity", category: "Mindset", creatorId: "tokyo", creatorName: "Creator Tóquio", start: plusMin(120), durationMin: 30, tz: "Asia/Tokyo", reveal: "teaser", teaser: "Algo novo está chegando.", place: "Tokyo, Japan", storage: "CREATOR_CONTENT" }
  );
  const posts = [
    { uid: "ops", name: "Operação", text: "A programação de Business e Technology está no ar. Mindset abre em seguida.", cat: "Business", official: true, kind: "update" },
    { uid: "hotel", name: "Casa", text: "Bastidores do hotel. A fila do credenciamento anda pelo ingresso digital.", cat: "Hospitality", official: false, kind: "post" },
    { uid: "canada", name: "Creator Canadá", text: "Vídeo curto de lá: a fronteira digital não pede passagem.", cat: "Digital", official: false, kind: "video" },
    { uid: "dj", name: "DJ", text: "Preparação do show. O som entra quando a sala abrir.", cat: "Music", official: false, kind: "post" },
    { uid: "well", name: "Wellness", text: "Atividade de foco em 40 minutos. Corpo no território, aviso no Now.", cat: "Wellness", official: false, kind: "update" }
  ];
  posts.forEach((p, i) => {
    C.posts.push(Object.assign({ id: "p" + i, at: new Date(Date.now() - (i + 1) * 600000).toISOString(), hidden: false, pinned: false, featured: false, boost: 0, storage: p.official ? "OFFICIAL_EVENT_CONTENT" : "CREATOR_CONTENT" }, p));
  });
  C.posts[0].pinned = true;
  save();
}

function feedItems() {
  const items = [];
  C.sessions.filter((s) => s.state === "live" && !s.hidden).forEach((s) => items.push({
    id: s.id, kind: "live", title: s.title, sub: s.official ? "Palco oficial" : "Global live",
    category: s.category, at: s.startedAt, official: !!s.official, creatorId: s.creatorId, creatorName: s.creatorName,
    stamp: null, dest: s.id, place: s.place || "", hidden: !!s.hidden, pinned: !!s.pinned, featured: !!s.featured, boost: s.boost || 0
  }));
  C.schedules.filter((s) => s.state === "scheduled" && s.status === "approved" && !s.hidden).forEach((s) => {
    const mystery = s.reveal === "mystery";
    const teaser = s.reveal === "teaser";
    items.push({
      id: s.id, kind: "upcoming", title: mystery ? "Um convidado especial entra ao vivo." : (teaser ? (s.teaser || s.title) : s.title),
      sub: (s.place ? s.place + " · " : "") + whenLocal(s.start) + " no seu horário · " + whenZone(s.start, s.tz) + " em " + s.tz,
      category: s.category, at: s.start, official: !!s.official, creatorId: mystery ? "" : s.creatorId, creatorName: mystery ? "" : s.creatorName,
      stamp: s.start, dest: "", place: s.place || "", hidden: !!s.hidden, pinned: !!s.pinned, featured: !!s.featured, boost: s.boost || 0, schedule: s
    });
  });
  C.posts.filter((p) => !p.hidden).forEach((p) => items.push({
    id: p.id, kind: p.kind || "post", title: p.text, sub: p.name, category: p.cat, at: p.at, official: !!p.official,
    creatorId: p.uid, creatorName: p.name, stamp: null, dest: p.uid, place: "", hidden: false, pinned: !!p.pinned, featured: !!p.featured, boost: p.boost || 0, post: p
  }));
  C.replays.slice(0, 3).forEach((r) => items.push({
    id: r.id, kind: "replay", title: r.title, sub: "Replay · " + (user(r.creatorId) || {}).name, category: r.category, at: r.at,
    official: !!r.official, creatorId: r.creatorId, creatorName: (user(r.creatorId) || {}).name || "", stamp: null, dest: "library",
    place: "", hidden: false, pinned: false, featured: false, boost: 0
  }));
  const interests = (me() && me().interests) || [];
  return items.map((item) => {
    let score = 0;
    if (item.kind === "live") score += 100;
    if (item.official) score += 40;
    if (item.pinned) score += 80;
    if (item.featured) score += 30;
    score += item.boost || 0;
    const age = (Date.now() - new Date(item.at)) / 60000;
    score += Math.max(0, 24 - age / 30);
    if (interests.indexOf(item.category) >= 0) score += 18;
    score += (C.likes[item.id] || 0) * 2;
    if (item.stamp) {
      const m = minsUntil(item.stamp);
      if (m <= 10) score += 55;
      else if (m <= 30) score += 35;
      else if (m <= 120) score += 15;
    }
    item.score = score;
    return item;
  }).sort((a, b) => b.score - a.score);
}

function shell(html) {
  const u = me();
  const unread = session ? C.notes.filter((n) => n.uid === session.uid && !n.read).length : 0;
  const items = [["now", "Now"], ["vivo", "Vivo"], ["jogo", "Jogo"], ["mesa", "Mesa"], ["eu", "Eu" + (unread ? " ·" + unread : "")]];
  const nav = '<nav class="nav">' + items.map((it) => '<button class="' + (state.route === it[0] ? "on" : "") + '" data-act="go" data-id="' + it[0] + '">' + it[1] + "</button>").join("") + "</nav>";
  return '<div class="wrap"><div class="row"><div class="brand">Convergência</div><div class="m">' + esc(u ? u.name : "OS") + "</div></div>" + html + nav + "</div>";
}
function cardPerson(id) {
  const u = user(id);
  if (!u) return "";
  const live = C.sessions.some((s) => s.state === "live" && s.creatorId === id);
  const following = session && C.follows.some((f) => f.uid === session.uid && f.creatorId === id);
  return '<div class="who"><div class="av">' + esc(initials(u.name)) + '</div><div class="grow"><strong>' + esc(u.name) + "</strong><div class=\"m\">" + esc(u.place || "") + (live ? " · no ar" : "") + '</div></div><button class="btn inline ' + (following ? "btn2" : "btn3") + '" data-act="follow" data-id="' + esc(id) + '">' + (id === (session && session.uid) ? "Você" : following ? "Seguindo" : "Seguir") + "</button></div>";
}

function viewLogin() {
  return '<div class="gate"><div class="k">Convergência OS</div><h1>A experiência inteira num sistema.</h1><p class="q">Território físico e rede global no mesmo lugar. Business, tecnologia, mindset, wellness, cultura, música, esporte, hospitalidade, digital e comunidade.</p><button class="btn" data-act="google">Continuar com Google</button><button class="btn btn2" data-act="local">Sessão deste aparelho</button><p class="m" style="text-align:center;margin-top:16px">A sessão deste aparelho guarda o fluxo aqui. A conta Google é a porta real da operação.</p></div>';
}
function viewNow() {
  const chips = ["Tudo"].concat(CATS).map((c) => '<button class="chip' + (state.filter === c ? " on" : "") + '" data-act="filter" data-id="' + esc(c) + '">' + esc(c) + "</button>").join("");
  const list = feedItems().filter((item) => state.filter === "Tudo" || item.category === state.filter);
  const cards = list.map((item) => {
    const label = item.kind === "live" ? "LIVE NOW" : item.stamp ? liveLabel(item.stamp) : item.kind === "replay" ? "REPLAY" : item.official ? "OFICIAL" : "AGORA";
    const hot = item.kind === "live" || (item.stamp && minsUntil(item.stamp) <= 30);
    let actions = "";
    if (item.kind === "live") actions = '<button class="btn" data-act="enter" data-id="' + item.id + '">Entrar</button>';
    else if (item.schedule) actions = '<button class="btn btn3" data-act="remind" data-id="' + item.schedule.id + '">Avisar-me</button>';
    else if (item.kind === "replay") actions = '<button class="btn btn2" data-act="go" data-id="library">Abrir biblioteca</button>';
    else actions = '<button class="btn btn2 inline" data-act="like" data-id="' + item.id + '">Útil · ' + (C.likes[item.id] || 0) + "</button>";
    const who = item.creatorId ? cardPerson(item.creatorId) : "";
    return '<article class="card"><div class="row"><span class="pill ' + (hot ? "hot" : "") + '">' + (hot && item.kind === "live" ? '<i class="dot"></i> ' : "") + '<span data-when="' + esc(item.stamp || "") + '">' + esc(label) + '</span></span><span class="pill">' + esc(item.category) + '</span></div><h3 style="margin-top:10px">' + esc(item.title) + '</h3><p class="q">' + esc(item.sub) + "</p>" + who + actions + "</article>";
  }).join("");
  const studio = can("can_access_creator_dashboard") ? '<button class="btn btn3" data-act="go" data-id="studio">Abrir Studio</button>' : "";
  return shell('<div class="k">Now</div><h1>O organismo desta hora.</h1><p class="q">Palco, creator e aviso no mesmo feed. O horário mostrado é o do seu aparelho.</p><div class="chips">' + chips + "</div>" + studio + cards);
}
function viewVivo() {
  const lives = C.sessions.filter((s) => s.state === "live");
  const upcoming = C.schedules.filter((s) => s.state === "scheduled" && s.status === "approved");
  const blocks = CATS.filter((c) => c === "Business" || c === "Technology" || c === "Mindset" || c === "Music" || c === "Wellness").map((cat) => {
    const here = lives.filter((s) => s.category === cat);
    const glob = C.config.globalRooms ? '<div class="m">Global room aberta para creator desta categoria.</div>' : "";
    return '<article class="card"><div class="k">' + esc(cat) + '</div><h3>' + (here.length ? here.map((s) => esc(s.title)).join(" · ") : "Sem palco no ar") + "</h3>" + glob + (here[0] ? '<button class="btn" data-act="enter" data-id="' + here[0].id + '">Entrar na sala</button>' : "") + "</article>";
  }).join("");
  const next = upcoming.map((s) => '<article class="card"><span class="pill" data-when="' + esc(s.start) + '">' + esc(liveLabel(s.start)) + '</span><h3 style="margin-top:8px">' + esc(s.reveal === "mystery" ? "Convidado especial" : s.title) + '</h3><p class="q">' + esc(whenLocal(s.start)) + " no seu horário</p></article>").join("");
  return shell('<div class="k">Ao vivo</div><h1>Palco e global room.</h1><p class="q">Uma live pode nascer no território ou em qualquer cidade. O sinal oficial tenta o LiveKit. A sala da plataforma abre mesmo assim.</p>' + blocks + '<div class="k" style="margin-top:18px">Chegando</div>' + next);
}
function viewJogo() {
  const items = [
    ["perfil", "Complete a identidade", 20],
    ["conexao", "Siga um creator", 20],
    ["presenca", "Entre numa sala ao vivo", 20],
    ["replay", "Abra um replay", 20]
  ];
  const cards = items.map((it) => '<article class="card"><div class="row"><h3>' + it[1] + '</h3><span class="pill ' + (hasTx(it[0]) ? "ok" : "") + '">' + (hasTx(it[0]) ? "feita" : "+" + it[2]) + "</span></div></article>").join("");
  const pts = xp();
  return shell('<div class="k">Jogo</div><h1>Presença que abre caminho.</h1><div class="card"><div class="row"><h3>' + pts + " pts</h3><span class=\"pill\">" + Math.min(100, pts) + '%</span></div><div class="xp"><i style="--w:' + Math.min(100, pts) + '%"></i></div></div>' + cards);
}
function viewMesa() {
  const people = Object.keys(C.users).filter((id) => id !== "ops" || true).map((id) => '<article class="card">' + cardPerson(id) + '<p class="q">' + esc(C.users[id].bio || "") + '</p><button class="btn btn2" data-act="profile" data-id="' + id + '">Ver perfil</button></article>').join("");
  const offers = [
    ["doc", "PROCURA", "Ponte para um documentário", "Quem está no território apresenta quem entra de longe."],
    ["min", "OFERECE", "12 minutos numa sala", "Uma fala curta. A operação confirma na programação."]
  ].map((o) => '<article class="card"><span class="pill">' + o[1] + '</span><h3 style="margin-top:8px">' + o[2] + '</h3><p class="q">' + o[3] + '</p><button class="btn btn3" data-act="offer" data-id="' + o[0] + '">Entrar</button></article>').join("");
  return shell('<div class="k">Mesa</div><h1>Quem entra junto.</h1><p class="q">Seguir um creator traz o aviso quando a live abre.</p>' + people + '<div class="k" style="margin-top:18px">Oportunidades</div>' + offers);
}
function viewEu() {
  const u = me();
  const pts = xp();
  const code = btoa(unescape(encodeURIComponent(session.uid + "|" + EVENT.id))).slice(0, 28);
  const unread = C.notes.filter((n) => n.uid === session.uid && !n.read).length;
  const personas = session.local ? '<label>Entrar como</label><select id="persona">' + ["ops", "hotel"].map((id) => '<option value="' + id + '"' + (session.uid === id ? " selected" : "") + ">" + esc(C.users[id].name) + "</option>").join("") + "</select>" : "";
  const links = [
    can("can_access_creator_dashboard") ? '<button class="btn" data-act="go" data-id="studio">Creator Studio</button>' : "",
    isAdmin() ? '<button class="btn btn3" data-act="go" data-id="admin">Gestão de acessos</button>' : "",
    '<button class="btn btn2" data-act="go" data-id="library">Biblioteca</button>',
    '<button class="btn btn2" data-act="go" data-id="os">Infraestrutura</button>',
    '<button class="btn btn2" data-act="go" data-id="notify">Avisos' + (unread ? " · " + unread : "") + "</button>"
  ].join("");
  return shell('<div class="k">Identidade</div><h1>' + esc(u.name) + '</h1><p class="q">' + esc(u.bio || u.email || "") + "</p>" + personas + '<div class="card"><div class="m">Ingresso · ' + esc(u.role) + '</div><div class="qr">' + esc(code) + '</div><p class="m">' + pts + " pts · " + esc(EVENT.edition) + '</p></div><div class="card"><label>O que você oferece</label><input id="offer" value="' + esc(u.offer || "") + '"><label>O que você busca</label><input id="seek" value="' + esc(u.seek || "") + '"><button class="btn" data-act="saveid">Guardar identidade</button></div>' + links + '<button class="btn btn2" data-act="logout">Sair</button>');
}
function viewStudio() {
  if (!can("can_access_creator_dashboard") && !can("can_post_content") && !can("can_schedule_live")) {
    return shell('<div class="k">Studio</div><h1>Studio fechado.</h1><p class="q">A gestão de acessos ainda não liberou este perfil para publicar ou abrir live.</p>');
  }
  const minePosts = C.posts.filter((p) => p.uid === session.uid);
  const mineLives = C.schedules.filter((s) => s.creatorId === session.uid);
  const mineReplay = C.replays.filter((r) => r.creatorId === session.uid);
  const cats = CATS.map((c) => "<option>" + esc(c) + "</option>").join("");
  return shell('<div class="k">Creator Studio</div><h1>Publicar e abrir ao vivo.</h1><article class="card"><div class="k">Post</div><label>Texto</label><textarea id="postText"></textarea><label>Categoria</label><select id="postCat">' + cats + '</select><button class="btn" data-act="publish">Publicar no Now</button></article><article class="card"><div class="k">Agendar live</div><label>Título</label><input id="lvTitle"><label>Tema</label><input id="lvTheme"><label>Descrição</label><textarea id="lvDesc"></textarea><label>Categoria</label><select id="lvCat">' + cats + '</select><label>Começa</label><input id="lvWhen" type="datetime-local"><label>Duração em minutos</label><input id="lvDur" value="30"><label>Lugar, se quiser</label><input id="lvPlace" placeholder="Tokyo, Japan"><label>Chamada</label><select id="lvReveal"><option value="full">Revelar tudo</option><option value="teaser">Teaser</option><option value="mystery">Mistério</option></select><button class="btn" data-act="schedule">Agendar</button></article><article class="card"><div class="k">Agora</div><p class="q">Abre uma live neste minuto, se a permissão estiver ligada.</p><button class="btn" data-act="golive">Entrar ao vivo agora</button></article><div class="k" style="margin-top:16px">Seus conteúdos</div>' + minePosts.map((p) => '<article class="card"><p class="q">' + esc(p.text) + "</p></article>").join("") + mineLives.map((s) => '<article class="card"><div class="row"><h3>' + esc(s.title) + '</h3><span class="pill">' + esc(s.state === "live" ? "no ar" : s.status) + '</span></div><p class="m">' + esc(whenLocal(s.start)) + '</p>' + (s.state === "scheduled" && s.status === "approved" ? '<button class="btn" data-act="start" data-id="' + s.id + '">Iniciar esta live</button>' : "") + "</article>").join("") + mineReplay.map((r) => '<article class="card"><h3>' + esc(r.title) + '</h3><p class="m">Replay na biblioteca</p></article>').join(""));
}
function viewAdmin() {
  if (!isAdmin()) return viewEu();
  const rows = Object.keys(C.users).map((id) => {
    const u = C.users[id];
    const p = C.perms[id] || {};
    const toggles = PERMS.map((pair) => '<button class="chip' + (p[pair[0]] ? " on" : "") + '" data-act="perm" data-id="' + id + '" data-key="' + pair[0] + '">' + pair[1] + "</button>").join("");
    return '<article class="card"><div class="row"><strong>' + esc(u.name) + '</strong><span class="pill">' + esc(u.role) + '</span></div><p class="m">' + esc(u.place || "") + '</p><div class="chips wrap">' + toggles + "</div></article>";
  }).join("");
  const pending = C.schedules.filter((s) => s.status === "pending").map((s) => '<article class="card"><h3>' + esc(s.title) + '</h3><p class="q">' + esc(s.creatorName) + " · " + esc(whenLocal(s.start)) + '</p><button class="btn" data-act="approve" data-id="' + s.id + '">Aprovar</button></article>').join("");
  const content = feedItems().slice(0, 8).map((item) => '<article class="card"><h3>' + esc(item.title).slice(0, 80) + '</h3><div class="chips wrap"><button class="chip" data-act="pin" data-id="' + item.id + '">Fixar</button><button class="chip" data-act="feature" data-id="' + item.id + '">Destacar</button><button class="chip" data-act="boost" data-id="' + item.id + '">Impulsionar</button><button class="chip" data-act="hide" data-id="' + item.id + '">Ocultar</button></div></article>').join("");
  const lives = C.sessions.filter((s) => s.state === "live").map((s) => '<div class="row" style="margin-top:8px"><span>' + esc(s.title) + '</span><button class="btn inline btn2" data-act="end" data-id="' + s.id + '">Encerrar</button></div>').join("");
  return shell('<div class="k">Gestão de acessos</div><h1>Quem pode criar.</h1><p class="q">Participante comum não publica e não abre live. Creator só entra com a permissão ligada. Aprovação de pauta: ' + (C.config.liveApproval === "auto" ? "automática" : "manual") + '.</p><button class="btn btn3" data-act="approval">' + (C.config.liveApproval === "auto" ? "Exigir aprovação" : "Aprovar sozinho") + "</button>" + rows + '<div class="k" style="margin-top:18px">Pautas pendentes</div>' + (pending || '<p class="m">Nenhuma.</p>') + '<div class="k" style="margin-top:18px">Lives no ar</div><article class="card">' + (lives || '<p class="m">Nenhuma.</p>') + '</article><div class="k" style="margin-top:18px">Controle de conteúdo</div>' + content + '<article class="card"><div class="k">Retenção e qualidade</div><p class="q">Nada é apagado sozinho. Política atual: ' + esc(C.config.retention) + ". Oficial " + esc(C.config.quality.official) + " · creator " + esc(C.config.quality.creator) + " · móvel " + esc(C.config.quality.mobile) + ".</p><div class=\"chips wrap\">" + ["MANUAL", "KEEP FOREVER", "KEEP 365 DAYS", "KEEP 90 DAYS", "KEEP 30 DAYS", "DELETE AFTER EVENT"].map((k) => '<button class="chip' + (C.config.retention === k ? " on" : "") + '" data-act="retention" data-id="' + k + '">' + k + "</button>").join("") + "</div></article>");
}
function viewLibrary() {
  const q = state.q.trim().toLowerCase();
  const list = C.replays.filter((r) => !q || (r.title + " " + r.category + " " + r.theme).toLowerCase().indexOf(q) >= 0);
  const cards = list.length ? list.map((r) => '<article class="card"><div class="k">' + esc(r.category) + " · " + esc(r.storage) + '</div><h3>' + esc(r.title) + '</h3><p class="q">' + esc((user(r.creatorId) || {}).name || "") + " · " + esc(whenLocal(r.at)) + " · " + esc(r.durationMin) + ' min</p><button class="btn btn2" data-act="seen" data-id="' + r.id + '">Marcar como visto</button></article>').join("") : '<p class="q">Ainda não há replay com esse termo. Encerre uma live para criar o primeiro.</p>';
  return shell('<div class="k">Master</div><h1>Biblioteca da edição.</h1><input class="search" id="q" data-bind="q" value="' + esc(state.q) + '" placeholder="Buscar replay, tema, categoria" style="margin-top:12px"><div style="margin-top:8px">' + cards + "</div>");
}
function viewOs() {
  const rows = CHAIN.map((step, i) => '<button class="card" data-act="go" data-id="' + step[2] + '"><div class="row"><span class="m">' + String(i + 1).padStart(2, "0") + "</span><strong>" + step[1] + "</strong></div></button>").join("");
  return shell('<div class="k">Infraestrutura</div><h1>Um sistema, da entrada à próxima edição.</h1><p class="q">A V1 cabe neste aparelho. A sequência já é a de uma operação que pode crescer sem trocar de ossatura. Pagamento real fica desligado.</p><article class="card"><div class="k">Hospedagem</div><p class="q">Interesse em quarto integrado à credencial. Sem reserva cobrada.</p><button class="btn btn3" data-act="stay">' + (me().stay ? "Interesse registrado" : "Quero hospedagem") + '</button></article>' + rows);
}
function viewNotify() {
  C.notes.forEach((n) => { if (n.uid === session.uid) n.read = true; });
  save();
  const list = C.notes.filter((n) => n.uid === session.uid);
  const cards = list.length ? list.map((n) => '<button class="card" data-act="open-note" data-id="' + n.id + '"><strong>' + esc(n.text) + '</strong><div class="m">' + esc(whenLocal(n.at)) + "</div></button>").join("") : '<p class="q">Nenhum aviso ainda. Marque Avisar-me numa live que está chegando.</p>';
  return shell('<div class="k">Avisos</div><h1>Dentro da plataforma.</h1><p class="q">Push, e-mail, WhatsApp e SMS ficam para quando houver serviço. Agora o aviso nasce aqui.</p>' + cards);
}
function viewProfile(id) {
  const u = user(id);
  if (!u) return viewMesa();
  const posts = C.posts.filter((p) => p.uid === id && !p.hidden);
  const next = C.schedules.filter((s) => s.creatorId === id && s.state === "scheduled");
  const reps = C.replays.filter((r) => r.creatorId === id);
  const live = C.sessions.find((s) => s.creatorId === id && s.state === "live");
  return shell('<div class="k">Creator</div>' + cardPerson(id) + '<p class="q" style="margin-top:12px">' + esc(u.bio || "") + "</p>" + (live ? '<button class="btn" data-act="enter" data-id="' + live.id + '">No ar agora</button>' : "") + '<div class="k" style="margin-top:16px">Próximas</div>' + (next.map((s) => '<article class="card"><h3>' + esc(s.reveal === "mystery" ? "Convidado especial" : s.title) + '</h3><p class="m">' + esc(whenLocal(s.start)) + "</p></article>").join("") || '<p class="m">Sem pauta.</p>') + '<div class="k" style="margin-top:16px">Posts</div>' + posts.map((p) => '<article class="card"><p class="q">' + esc(p.text) + "</p></article>").join("") + '<div class="k" style="margin-top:16px">Replays</div>' + (reps.map((r) => '<article class="card"><h3>' + esc(r.title) + "</h3></article>").join("") || '<p class="m">Nenhum.</p>'));
}
function viewRoom() {
  const s = C.sessions.find((x) => x.id === state.roomId);
  if (!s) return viewVivo();
  const comments = (s.comments || []).map((c) => '<div class="q"><strong>' + esc(c.name) + "</strong> " + esc(c.text) + "</div>").join("");
  const owner = s.creatorId === session.uid || isAdmin();
  return shell('<div class="k">' + (s.official ? "Palco oficial" : "Global live") + '</div><h1>' + esc(s.title) + '</h1><p class="q">' + esc(s.creatorName) + (s.place ? " · " + esc(s.place) : "") + " · " + esc(s.quality || C.config.quality.creator) + " · " + esc(s.storage || "CREATOR_CONTENT") + '</p><article class="card"><span class="pill hot"><i class="dot"></i> LIVE NOW</span><p class="q">Pergunta da sala sai daqui para quem está no ar, no território ou longe.</p>' + comments + '<label>Comentário</label><input id="comment"><button class="btn" data-act="comment" data-id="' + s.id + '">Enviar</button></article>' + (owner ? '<button class="btn btn2" data-act="end" data-id="' + s.id + '">Encerrar e gerar replay</button>' : "") + (s.official ? '<button class="btn btn3" data-act="signal" data-id="' + s.id + '">Conectar sinal</button>' : ""));
}

function render() {
  const root = document.getElementById("app");
  if (!root) return;
  const keep = document.activeElement && document.activeElement.id;
  const pos = keep && document.activeElement.selectionStart;
  const y = document.querySelector(".wrap");
  const top = y ? y.scrollTop : 0;
  let html = "";
  if (!session) html = viewLogin();
  else if (state.route === "vivo") html = viewVivo();
  else if (state.route === "jogo") html = viewJogo();
  else if (state.route === "mesa") html = viewMesa();
  else if (state.route === "eu") html = viewEu();
  else if (state.route === "studio") html = viewStudio();
  else if (state.route === "admin") html = viewAdmin();
  else if (state.route === "library") html = viewLibrary();
  else if (state.route === "os") html = viewOs();
  else if (state.route === "notify") html = viewNotify();
  else if (state.route === "profile") html = viewProfile(state.profileId);
  else if (state.route === "room") html = viewRoom();
  else html = viewNow();
  root.innerHTML = html;
  document.title = "Convergência OS · " + (session ? state.route : "entrada");
  const wrap = document.querySelector(".wrap");
  if (wrap) wrap.scrollTop = top;
  if (keep) {
    const el = document.getElementById(keep);
    if (el) {
      el.focus();
      if (typeof pos === "number" && el.setSelectionRange) { try { el.setSelectionRange(pos, pos); } catch (e) {} }
    }
  }
}

function ensureGoogleUser(fb) {
  const id = fb.uid;
  const prev = C.users[id] || {};
  const ceo = isCeo(fb);
  C.users[id] = Object.assign({
    uid: id, email: fb.email || "", name: prev.name || fb.displayName || "Você", role: ceo ? "ADMIN" : (prev.role || "PARTICIPANTE"),
    bio: prev.bio || "", place: prev.place || "", cat: prev.cat || "Community", interests: prev.interests || ["Business", "Mindset"], offer: prev.offer || "", seek: prev.seek || ""
  }, prev, { email: fb.email || prev.email || "", uid: id });
  if (ceo) C.users[id].role = "ADMIN";
  if (!C.perms[id]) C.perms[id] = {};
  if (ceo) PERMS.forEach((pair) => { C.perms[id][pair[0]] = true; });
  save();
}

function publishPost() {
  if (!can("can_post_content") && !can("can_create_story")) { toast("Sem permissão para publicar."); return; }
  const text = (document.getElementById("postText").value || "").trim();
  if (text.length < 2) { toast("Escreve o post."); return; }
  const cat = document.getElementById("postCat").value;
  C.posts.unshift({ id: rid(), uid: session.uid, name: me().name, text, cat, official: isAdmin(), kind: "post", at: iso(), hidden: false, pinned: false, featured: false, boost: 0, storage: isAdmin() ? "OFFICIAL_EVENT_CONTENT" : "CREATOR_CONTENT" });
  save();
  toast("Post no Now.");
  go("now");
}
function scheduleLive() {
  if (!can("can_schedule_live") && !can("can_create_live")) { toast("Sem permissão para agendar."); return; }
  const title = (document.getElementById("lvTitle").value || "").trim();
  const when = document.getElementById("lvWhen").value;
  if (!title || !when) { toast("Título e horário."); return; }
  const status = C.config.liveApproval === "auto" || isAdmin() ? "approved" : "pending";
  const item = {
    id: rid(), official: false, status, state: "scheduled", title,
    theme: (document.getElementById("lvTheme").value || "").trim(),
    description: (document.getElementById("lvDesc").value || "").trim(),
    category: document.getElementById("lvCat").value,
    creatorId: session.uid, creatorName: me().name,
    start: new Date(when).toISOString(),
    durationMin: Number(document.getElementById("lvDur").value) || 30,
    tz: (Intl.DateTimeFormat().resolvedOptions().timeZone) || "America/Sao_Paulo",
    reveal: document.getElementById("lvReveal").value,
    teaser: "Algo novo está chegando.",
    place: (document.getElementById("lvPlace").value || "").trim(),
    storage: "CREATOR_CONTENT"
  };
  C.schedules.unshift(item);
  save();
  toast(status === "approved" ? "Live na programação." : "Pauta enviada para aprovação.");
  go("now");
}
function openLive(partial) {
  if (!can("can_go_live_now") && !can("can_create_live")) { toast("Sem permissão para abrir live."); return; }
  const sessionLive = {
    id: rid(), official: !!partial.official, state: "live", title: partial.title, category: partial.category || "Digital",
    creatorId: session.uid, creatorName: me().name, place: partial.place || "", storage: partial.official ? "OFFICIAL_EVENT_CONTENT" : "CREATOR_CONTENT",
    quality: partial.official ? C.config.quality.official : C.config.quality.creator, startedAt: iso(), comments: [], viewers: 1, scheduleId: partial.scheduleId || ""
  };
  C.sessions.unshift(sessionLive);
  if (partial.scheduleId) {
    const sch = C.schedules.find((s) => s.id === partial.scheduleId);
    if (sch) sch.state = "live";
  }
  const targets = {};
  C.follows.filter((f) => f.creatorId === session.uid).forEach((f) => { targets[f.uid] = true; });
  C.reminders.filter((r) => r.scheduleId && r.scheduleId === partial.scheduleId).forEach((r) => { targets[r.uid] = true; });
  Object.keys(targets).forEach((id) => note(id, me().name + " está ao vivo: " + sessionLive.title, sessionLive.id));
  if (session.uid !== "ops") note("ops", me().name + " abriu live.", sessionLive.id);
  save();
  state.roomId = sessionLive.id;
  if (!hasTx("presenca")) grantXp("presenca", 20);
  toast("Você está no ar.");
  go("room");
}
function endLive(id) {
  const s = C.sessions.find((x) => x.id === id);
  if (!s || s.state !== "live") return;
  if (s.creatorId !== session.uid && !isAdmin()) { toast("Só quem abriu, ou a operação, encerra."); return; }
  s.state = "ended";
  s.endedAt = iso();
  const sch = C.schedules.find((x) => x.id === s.scheduleId);
  if (sch) sch.state = "ended";
  C.replays.unshift({
    id: rid(), sessionId: s.id, creatorId: s.creatorId, title: s.title, category: s.category, theme: s.theme || s.title,
    at: s.startedAt, durationMin: s.scheduleId && sch ? sch.durationMin : 20, official: !!s.official, eventId: EVENT.id,
    edition: EVENT.edition, storage: "REPLAYS", retention: C.config.retention
  });
  note(s.creatorId, "Replay disponível: " + s.title, "library");
  save();
  toast("Replay na biblioteca e no perfil.");
  go("library");
}
function findContent(id) {
  return C.posts.find((p) => p.id === id) || C.sessions.find((s) => s.id === id) || C.schedules.find((s) => s.id === id) || null;
}

function onClick(e) {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const act = b.dataset.act;
  const id = b.dataset.id;
  if (act === "google") { loginGoogle(); return; }
  if (act === "local") {
    session = { uid: "ops", local: true };
    state.route = "now";
    save();
    render();
    return;
  }
  if (act === "logout") {
    session = null;
    if (firebaseReady) { try { firebase.auth().signOut(); } catch (err) {} }
    render();
    return;
  }
  if (!session) return;
  if (act === "go") { go(id); return; }
  if (act === "filter") { state.filter = id; render(); return; }
  if (act === "publish") { publishPost(); return; }
  if (act === "schedule") { scheduleLive(); return; }
  if (act === "golive") { openLive({ title: "Ao vivo · " + me().name, category: me().cat || "Digital", place: me().place || "" }); return; }
  if (act === "start") {
    const sch = C.schedules.find((s) => s.id === id);
    if (!sch) return;
    if (sch.status !== "approved") { toast("Esta pauta ainda espera aprovação."); return; }
    openLive({ title: sch.title, category: sch.category, place: sch.place, scheduleId: sch.id, official: sch.official });
    return;
  }
  if (act === "enter") {
    state.roomId = id;
    if (!hasTx("presenca")) grantXp("presenca", 20);
    save();
    go("room");
    return;
  }
  if (act === "end") { endLive(id); return; }
  if (act === "comment") {
    const s = C.sessions.find((x) => x.id === id);
    const input = document.getElementById("comment");
    const text = input ? input.value.trim() : "";
    if (!s || !text) return;
    s.comments = s.comments || [];
    s.comments.push({ name: me().name, text, at: iso() });
    save();
    render();
    return;
  }
  if (act === "remind") {
    if (!C.reminders.some((r) => r.uid === session.uid && r.scheduleId === id)) C.reminders.push({ uid: session.uid, scheduleId: id, at: iso() });
    const sch = C.schedules.find((s) => s.id === id);
    save();
    flushReminders();
    toast(sch && minsUntil(sch.start) <= 30 ? "Aviso marcado. Ele entra nos seus avisos agora." : "Aviso marcado. Ele aparece quando faltarem 30 minutos.");
    return;
  }
  if (act === "like") {
    C.likes[id] = (C.likes[id] || 0) + 1;
    save();
    render();
    return;
  }
  if (act === "follow") {
    if (id === session.uid) return;
    const i = C.follows.findIndex((f) => f.uid === session.uid && f.creatorId === id);
    if (i >= 0) C.follows.splice(i, 1);
    else {
      C.follows.push({ uid: session.uid, creatorId: id, at: iso() });
      if (!hasTx("conexao")) grantXp("conexao", 20);
    }
    save();
    toast(i >= 0 ? "Deixou de seguir." : "Seguindo. O aviso de live chega aqui.");
    render();
    return;
  }
  if (act === "profile") { state.profileId = id; go("profile"); return; }
  if (act === "perm") {
    if (!isAdmin()) return;
    const key = b.dataset.key;
    C.perms[id] = C.perms[id] || {};
    C.perms[id][key] = !C.perms[id][key];
    if (C.perms[id][key] && id !== "ops") C.users[id].role = "CREATOR";
    save();
    toast(C.users[id].name + (C.perms[id][key] ? " recebeu " : " perdeu ") + key);
    render();
    return;
  }
  if (act === "approval") {
    C.config.liveApproval = C.config.liveApproval === "auto" ? "review" : "auto";
    save();
    render();
    return;
  }
  if (act === "approve") {
    const sch = C.schedules.find((s) => s.id === id);
    if (sch) sch.status = "approved";
    save();
    toast("Pauta aprovada.");
    render();
    return;
  }
  if (act === "pin" || act === "feature" || act === "boost" || act === "hide") {
    if (!isAdmin()) return;
    const item = findContent(id);
    if (!item) { toast("Este card não se edita."); return; }
    if (act === "pin") item.pinned = !item.pinned;
    if (act === "feature") item.featured = !item.featured;
    if (act === "boost") item.boost = (item.boost || 0) + 20;
    if (act === "hide") item.hidden = !item.hidden;
    save();
    render();
    return;
  }
  if (act === "retention") { C.config.retention = id; save(); render(); return; }
  if (act === "saveid") {
    const u = me();
    u.offer = document.getElementById("offer").value.trim();
    u.seek = document.getElementById("seek").value.trim();
    if (!hasTx("perfil")) grantXp("perfil", 20);
    save();
    toast("Identidade guardada.");
    render();
    return;
  }
  if (act === "stay") { me().stay = !me().stay; save(); render(); return; }
  if (act === "offer") { toast("Interesse registrado na mesa. Sem cobrança."); return; }
  if (act === "seen") { if (!hasTx("replay")) grantXp("replay", 20); save(); toast("Replay visto."); go("jogo"); return; }
  if (act === "open-note") {
    const n = C.notes.find((x) => x.id === id);
    if (n && C.sessions.some((s) => s.id === n.dest)) { state.roomId = n.dest; go("room"); return; }
    go(n && n.dest && n.dest.indexOf("library") === 0 ? "library" : "now");
    return;
  }
  if (act === "signal") { connectSignal(); return; }
}
function onInput(e) {
  if (e.target.dataset.bind !== "q") return;
  state.q = e.target.value;
  render();
}
function onChange(e) {
  if (e.target.id !== "persona" || !session || !session.local) return;
  session.uid = e.target.value;
  toast("Agora você é " + me().name + ".");
  render();
}

async function loginGoogle() {
  if (!firebaseReady) { toast("Google indisponível neste carregamento."); return; }
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try { await firebase.auth().signInWithPopup(provider); }
  catch (e) {
    if (e.code === "auth/popup-blocked") { await firebase.auth().signInWithRedirect(provider); return; }
    toast(e.message || "Falha no Google");
  }
}
async function connectSignal() {
  if (!window.LivekitClient || !session) { toast("Sinal ainda carregando."); return; }
  try {
    const res = await fetch(WORKER, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identity: session.uid, room: "convergencia-os", name: me().name, mentor: isAdmin() }) });
    const data = await res.json();
    if (!data.token) throw new Error("sem token");
    lkRoom = new LivekitClient.Room();
    await lkRoom.connect(data.url || LK_URL, data.token);
    if (isAdmin()) await lkRoom.localParticipant.enableCameraAndMicrophone();
    toast("Sinal conectado.");
  } catch (e) { toast("A sala segue aberta. O sinal externo não respondeu."); }
}

function flushReminders() {
  let changed = false;
  C.reminders.forEach((r) => {
    const sch = C.schedules.find((s) => s.id === r.scheduleId);
    if (!sch || sch.state !== "scheduled") return;
    const m = minsUntil(sch.start);
    if (m <= 30 && m > -1 && !r.sent) {
      note(r.uid, (sch.reveal === "mystery" ? "Um convidado especial" : sch.creatorName) + " está prestes a entrar ao vivo.", "now");
      r.sent = true;
      changed = true;
      if (session && session.uid === r.uid) toast("Aviso: live em menos de 30 minutos.");
    }
  });
  if (changed) save();
}

document.getElementById("app").addEventListener("click", onClick);
document.getElementById("app").addEventListener("input", onInput);
document.getElementById("app").addEventListener("change", onChange);
if (firebaseReady) {
  firebase.auth().onAuthStateChanged((u) => {
    if (!u) {
      if (!session || !session.local) { session = null; render(); }
      return;
    }
    session = { uid: u.uid, email: u.email, local: false };
    ensureGoogleUser({ uid: u.uid, email: u.email, displayName: u.displayName });
    if (state.route === "boot") state.route = "now";
    render();
  });
}
const boot = (location.hash || "").replace("#", "");
if (["now", "vivo", "jogo", "mesa", "eu", "studio", "admin", "library", "os", "notify"].indexOf(boot) >= 0) state.route = boot;
render();
setInterval(() => {
  document.querySelectorAll("[data-when]").forEach((el) => {
    if (!el.dataset.when) return;
    const label = liveLabel(el.dataset.when);
    if (el.textContent !== label) el.textContent = label;
  });
  const before = C.notes.length;
  flushReminders();
  if (C.notes.length !== before && session && state.route === "now") render();
}, 15000);
