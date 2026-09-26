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
    id: "business", mark: "◈", name: "Business", onAir: true,
    desc: "O universo de negócio. Comunicação, venda e empresa moram aqui, não na lupa.",
    live: "Call de Business. Grupo pequeno. Quem entra escuta e comenta.",
    cats: [
      { id: "business-comunicacao", mark: "✎", name: "Comunicação", niche: "Quem fala, marca e conduz a narrativa." },
      { id: "business-rapport", mark: "◎", name: "Rapport", niche: "O contato antes da oferta." },
      { id: "business-vendas", mark: "→", name: "Vendas", niche: "Quem fecha, oferece e converte." },
      { id: "business-marketing", mark: "▣", name: "Marketing", niche: "Inclui o digital. Não é outra categoria." },
      { id: "business-trafego", mark: "↗", name: "Tráfego", niche: "Tráfego pago, ao lado do marketing." },
      { id: "business-empreender", mark: "▲", name: "Empreendedorismo", niche: "Quem constrói o negócio e o caixa." },
      { id: "business-empresas", mark: "⌂", name: "Empresas", niche: "A casa que já opera." }
    ]
  },
  {
    id: "tech", mark: "⌬", name: "Tetic", onAir: true,
    desc: "Startups, inteligências, hubs, software, games e robótica.",
    live: "Call de Tetic. Grupo pequeno. Quem entra escuta e comenta.",
    cats: [
      { id: "tech-startups", mark: "▲", name: "Startups", niche: "Começo de empresa de tecnologia." },
      { id: "tech-ias", mark: "✶", name: "IAs", niche: "Inteligências artificiais." },
      { id: "tech-hubs", mark: "◎", name: "Hubs", niche: "Pontos onde a tecnologia se encontra." },
      { id: "tech-softwares", mark: "□", name: "Softwares", niche: "Programas de uso contínuo." },
      { id: "tech-programas", mark: "▣", name: "Programas", niche: "Ao lado de software. Não é a mesma porta." },
      { id: "tech-apps", mark: "▢", name: "Aplicativos", niche: "O que se abre no telefone." },
      { id: "tech-games", mark: "▶", name: "Games", niche: "Jogos e quem joga." },
      { id: "tech-robotica", mark: "⚙", name: "Robótica", niche: "Máquina que age no mundo." }
    ]
  },
  {
    id: "mindset", mark: "✶", name: "Mindset", onAir: true,
    desc: "Mente, identidade, comportamento, consciência e conhecimento humano.",
    live: "Call de Mindset. Grupo pequeno. Quem entra escuta e comenta.",
    cats: [
      { id: "mindset-pnl", mark: "✎", name: "PNL", niche: "Programação neurolinguística." },
      { id: "mindset-psicologia", mark: "○", name: "Psicologia", niche: "Comportamento e escuta." },
      { id: "mindset-autoconhecimento", mark: "◉", name: "Autoconhecimento", niche: "Quem a pessoa é." },
      { id: "mindset-quantica", mark: "✧", name: "Física quântica", niche: "A leitura de campo. Não é outra ciência solta." },
      { id: "mindset-mentores", mark: "▲", name: "Mentores", niche: "Mentores e mentorias. Uma porta só." },
      { id: "mindset-cultura", mark: "▣", name: "Cultura", niche: "O que um povo pratica." },
      { id: "mindset-antropologia", mark: "◎", name: "Antropologia", niche: "O humano em grupo." },
      { id: "mindset-filosofia", mark: "∞", name: "Filosofia", niche: "A pergunta que organiza o resto." }
    ]
  },
  {
    id: "gastronomia", mark: "♨", name: "Gastronomia", onAir: false, play: false, mesa: true,
    desc: "Acontece no evento. Não é live. Mesa, cozinha e o que se come.",
    live: "",
    cats: [
      { id: "gastro-mesa", mark: "♨", name: "Mesa", niche: "Onde as pessoas se sentam." },
      { id: "gastro-cozinha", mark: "△", name: "Cozinha", niche: "Quem prepara." },
      { id: "gastro-natural", mark: "✿", name: "Natural", niche: "Alimento natural, dentro da gastronomia." }
    ]
  },
  {
    id: "holistic", mark: "☾", name: "Holistic", onAir: false,
    desc: "Experiência holística. No app e no que estiver acontecendo no hotel.",
    live: "Call de Holistic. Também cabe a atividade presencial deste universo.",
    cats: []
  },
  {
    id: "wellness", mark: "❀", name: "Wellness", onAir: false,
    desc: "Bem-estar. As categorias internas entram depois.",
    live: "Call de Wellness. Também cabe a atividade presencial deste universo.",
    cats: []
  },
  {
    id: "terapias", mark: "✚", name: "Terapias", onAir: false,
    desc: "Terapias. As categorias internas entram depois.",
    live: "Call de Terapias. Também cabe a atividade presencial deste universo.",
    cats: []
  },
  {
    id: "entretenimento", mark: "♫", name: "Entretenimento", onAir: false,
    desc: "Três portas. Música. Arte, dança e shows. Humor.",
    live: "Call de Entretenimento. Música, apresentação ou humor.",
    cats: [
      { id: "entre-musica", mark: "♫", name: "Música", niche: "Som, ao vivo ou gravado." },
      { id: "entre-arte", mark: "✿", name: "Arte", niche: "Arte, dança e shows. Uma porta só." },
      { id: "entre-humor", mark: "☺", name: "Humor", niche: "Quem faz rir." }
    ]
  },
  {
    id: "fitness", mark: "⬆", name: "Fitness", onAir: false, play: false,
    desc: "Treino, esporte e saúde. Área complementar. Aprofunda depois.",
    live: "Call de Fitness, quando houver programação.",
    cats: [
      { id: "fit-treinos", mark: "⬆", name: "Treinos", niche: "A prática." },
      { id: "fit-esportes", mark: "●", name: "Esportes", niche: "O jogo e a disputa." },
      { id: "fit-saude", mark: "✚", name: "Saúde", niche: "Cuidado, alimento natural e também psicologia." }
    ]
  }
];
/* Gastronomia é pilar, outra cor, e não entra no Play. */
const CAP = 12;
const EVENTS = [
  { id: "e1", name: "Business", when: "Hoje · no hotel", now: true },
  { id: "e2", name: "Tetic", when: "Hoje · sala técnica", now: true },
  { id: "e3", name: "Mindset", when: "Hoje · sala", now: true },
  { id: "e4", name: "Holistic", when: "Amanhã cedo", now: false },
  { id: "e5", name: "Entretenimento", when: "Amanhã à noite", now: false }
];
const DEMO = [
  { email: "luna@convergencia.live", name: "Luna", live: true, socio: false },
  { email: "nara@convergencia.live", name: "Nara", live: false, socio: true },
  { email: "caio@convergencia.live", name: "Caio", live: false, socio: true },
  { email: "rita@convergencia.live", name: "Rita", live: false, socio: false },
  { email: "dino@convergencia.live", name: "Dino", live: false, socio: false },
  { email: "olga@convergencia.live", name: "Olga", live: false, socio: false },
  { email: "ivan@convergencia.live", name: "Ivan", live: false, socio: false },
  { email: "bia@convergencia.live", name: "Bia", live: false, socio: false }
];
function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "") || fallback; } catch (e) { return fallback; }
}
function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function loadPosts() { return loadJson("os777-posts", []); }
function loadEssence(who) {
  const all = loadJson("os777-essencia", {});
  return all[(who || email() || "").toLowerCase()] || null;
}
function seatsOf(roomId) { return Number(loadJson("os777-seats", {})[roomId] || 0); }
function setSeats(roomId, n) {
  const all = loadJson("os777-seats", {});
  all[roomId] = Math.max(0, Math.min(CAP, n));
  saveJson("os777-seats", all);
}

const sb = supabase.createClient(SB_URL, SB_ANON);
try {
  firebase.initializeApp({
    apiKey: "AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4",
    authDomain: "hub-akasha.firebaseapp.com",
    projectId: "hub-akasha",
    appId: "1:370851875474:web:29b1ba3a76b0fed7d9344b",
  });
} catch (e) {}
const state = { route: "boot", pillar: "business", cat: "", piece: null, playFilter: "all", room: null, reel: 0, q: "", liked: {}, chat: {}, people: [], presenters: [], ticket: null, emailDraft: "", busy: "", loginError: "", more: 6, who: "", inRoom: false };
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
  if (String(id).indexOf("perfil-") === 0) {
    const who = id.slice(7);
    const prof = profiles().find((p) => p.email === who);
    return { id: id, kind: "live", name: prof ? prof.name : who.split("@")[0], mark: (prof ? prof.name : who).slice(0, 1).toUpperCase(), pillar: "perfis", livekit: "os-live-p-" + who.replace(/[^a-z0-9]/g, "").slice(0, 20), cap: CAP, owner: who };
  }
  for (const pillar of PILLARS) {
    if (pillar.id === id) return { ...pillar, kind: pillar.mesa ? "mesa" : "live", pillar: pillar.id, livekit: "os-live-" + pillar.id };
    const stage = (pillar.cats || []).find((s) => s.id === id);
    if (stage) return { ...stage, kind: "stage", pillar: pillar.id, livekit: "os-stage-" + stage.id };
  }
  return null;
}
function profiles() {
  const map = {};
  DEMO.forEach((p) => { map[p.email] = Object.assign({}, p); });
  loadPosts().forEach((p) => {
    if (!map[p.email]) map[p.email] = { email: p.email, name: p.email.split("@")[0], live: false, socio: false };
  });
  const me = email();
  if (me) {
    const row = person();
    map[me] = { email: me, name: me.split("@")[0], live: !!(row && row.role === "live" && state.myLive), socio: false, mine: true };
  }
  return Object.values(map);
}
function playList() {
  const all = PILLARS.filter((p) => p.play !== false);
  if (!state.playFilter || state.playFilter === "all") return all;
  return all.filter((p) => p.id === state.playFilter);
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
  if (room.owner && room.owner === email()) return true;
  if (presenterEmail(room.id) === email()) return true;
  const p = person();
  return !!(p && p.status === "in" && p.role === "recorder");
}
function canEnter(room) {
  if (!room) return false;
  const p = person();
  if (p && p.status === "out") return false;
  if (isAdmin()) return true;
  if (p && p.status === "in" && (p.role === "guest" || p.role === "recorder" || p.role === "presenter" || p.role === "live")) return true;
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
  if (state.route === "explore" || state.route === "perfis" || state.route === "socios") return "explore";
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
  return '<div class="stories">' + PILLARS.map((p) => '<button class="story" data-act="open-pillar" data-id="' + p.id + '"><span class="ring"><i>' + p.mark + '</i></span><small>' + esc(p.name) + "</small></button>").join("") + "</div>";
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
  const people = profiles();
  const liveFirst = people.filter((p) => p.live);
  const bubbles = liveFirst.map((p) => '<button class="story" data-act="open-room" data-id="perfil-' + esc(p.email) + '"><span class="ring"><i>' + esc(p.name.slice(0, 1).toUpperCase()) + '</i></span><small>em live</small></button>').join("");
  const fixed = ["business", "tech", "mindset"].map((id) => {
    const p = PILLARS.find((x) => x.id === id);
    return '<button class="story" data-act="open-pillar" data-id="' + p.id + '"><span class="ring"><i>' + p.mark + '</i></span><small>' + esc(p.name) + "</small></button>";
  }).join("");
  const now = EVENTS.filter((e) => e.now).slice(0, 3).map((e) => '<article class="card"><div class="k">Agora</div><h3>' + esc(e.name) + '</h3><p class="m">' + esc(e.when) + '</p><button class="btn" data-act="open-pillar" data-id="' + esc(e.name.toLowerCase() === "tetic" ? "tech" : e.name.toLowerCase()) + '">Abrir</button></article>').join("");
  const shown = people.slice(0, state.more || 6);
  const cards = shown.map((p) => '<button class="card" data-act="open-perfil" data-id="' + esc(p.email) + '"><div class="row"><span class="mark">' + esc(p.name.slice(0, 1).toUpperCase()) + '</span><div><h3>' + esc(p.name) + '</h3><div class="m">' + (p.live ? "Em live" : "Perfil") + "</div></div></div></button>").join("");
  const mineLive = people.filter((p) => p.mine && p.live);
  const squares = mineLive.map((p) => post("perfil-" + p.email, p.name.slice(0, 1).toUpperCase(), p.name, "Sala dela", "Esta pessoa está em live.", "perfil-" + p.email)).join("");
  const feed = PILLARS.filter((p) => p.onAir).map((p) => post(p.id, p.mark, p.name, "Apresenta " + presenterName(p.id), p.live, p.id)).join("");
  return shell(
    '<div class="stories">' + bubbles + fixed + '</div>' +
    '<article class="card ad"><div class="k">Anúncio</div><h3>Patrocínio</h3><p class="m">O lugar do anúncio fica aqui.</p></article>' +
    '<div class="pad"><div class="k">Fixos</div>' + now + '</div>' +
    '<div class="pad"><div class="k">Perfis</div>' + cards +
    (shown.length < people.length ? '<button class="btn btn2" data-act="more">Ver mais perfis</button>' : "") +
    '<button class="btn" data-act="go" data-id="eventos">Próximos eventos</button>' +
    '<button class="btn btn3" data-act="go" data-id="game">Gamificação · jogue e ganhe pontos</button></div>' +
    squares + feed
  );
}
function viewExplore() {
  const q = state.q.trim().toLowerCase();
  const list = PILLARS.filter((p) => {
    if (!q) return true;
    if (p.name.toLowerCase().includes(q)) return true;
    return (p.cats || []).some((c) => c.name.toLowerCase().includes(q));
  });
  const cards = list.map((p) => {
    const inside = q && !p.name.toLowerCase().includes(q)
      ? (p.cats || []).filter((c) => c.name.toLowerCase().includes(q)).map((c) => c.name).join(", ")
      : "";
    const sub = inside ? inside + " fica dentro de " + p.name : p.desc;
    const cls = p.mesa ? "card gastro" : "card";
    return '<button class="' + cls + '" data-act="open-pillar" data-id="' + p.id + '"><div class="row"><span class="mark">' + p.mark + '</span><div><h3>' + esc(p.name) + '</h3><div class="m">' + esc(sub) + "</div></div></div></button>";
  }).join("");
  return shell('<div style="padding:12px 14px 0"><div class="k">Descoberta</div><input id="q" data-bind="q" value="' + esc(state.q) + '" placeholder="Buscar universo"></div><div style="padding:0 14px 12px">' + (cards || '<p class="q">Nada com esse nome.</p>') + '<button class="card" data-act="go" data-id="socios"><h3>Sócios e colaboradores</h3><div class="m">Quem constrói com a casa.</div></button><button class="card" data-act="go" data-id="perfis"><h3>Perfis</h3><div class="m">Abrir só os perfis.</div></button></div>');
}
function viewCreate() {
  const doors = ["holistic", "wellness", "terapias", "entretenimento"].map((id) => {
    const p = PILLARS.find((x) => x.id === id);
    return '<button class="card" data-act="open-pillar" data-id="' + id + '"><div class="row"><span class="mark">' + p.mark + '</span><div><h3>' + esc(p.name) + '</h3><div class="m">Experiência deste universo.</div></div></div></button>';
  }).join("");
  const lives = PILLARS.filter((p) => !p.mesa).map((p) => '<button class="card" data-act="open-room" data-id="' + p.id + '"><div class="row"><span class="mark">' + p.mark + '</span><div><h3>Call de ' + esc(p.name) + '</h3><div class="m">' + (canPublish(roomById(p.id)) ? "Sua câmera publica para quem assiste." : "Você entra assistindo.") + "</div></div></div></button>").join("");
  return shell('<div style="padding:16px"><div class="k">Entrar</div><h1>O que você abre.</h1><p class="q">Experiência ou call. A transmissão com muita gente usa a mesma porta, depois.</p>' + doors + '<button class="card" data-act="cursos"><div class="row"><span class="mark">≡</span><div><h3>Cursos</h3><div class="m">A porta fica aqui. A grade entra depois.</div></div></div></button><div class="k" style="margin-top:18px">Calls</div>' + lives + "</div>");
}
function viewReel() {
  const list = playList();
  const pillar = list[state.reel] || list[0] || PILLARS[0];
  const chips = '<div class="filters"><button class="' + (state.playFilter === "all" ? "on" : "") + '" data-act="play-filter" data-id="all">Tudo</button>' + PILLARS.filter((p) => p.play !== false).map((p) => '<button class="' + (state.playFilter === p.id ? "on" : "") + '" data-act="play-filter" data-id="' + p.id + '">' + esc(p.name) + "</button>").join("") + "</div>";
  const now = PILLARS.filter((p) => p.onAir).slice(0, 3).map((p) => '<button class="card" data-act="open-room" data-id="' + p.id + '"><span class="pill hot"><i class="dot"></i> ao vivo</span> ' + esc(p.name) + "</button>").join("");
  const badge = pillar.onAir ? '<span class="pill hot"><i class="dot"></i> ao vivo</span>' : '<span class="pill">programação</span>';
  return shell(chips + '<section class="reel">' + badge + '<div class="mark" style="width:84px;height:84px;font-size:40px;margin:16px 0">' + pillar.mark + '</div><h1>' + esc(pillar.name) + '</h1><p class="q">Apresenta ' + esc(presenterName(pillar.id)) + '. ' + esc(pillar.live) + '</p><div class="row" style="margin-top:16px"><button class="btn inline btn2" data-act="reel" data-id="-1">Anterior</button><button class="btn inline" data-act="open-room" data-id="' + pillar.id + '">Entrar</button><button class="btn inline btn2" data-act="reel" data-id="1">Próxima</button></div><div class="k" style="margin-top:22px">Agora</div>' + now + '</section>', '<header class="top"><b>Play</b><span class="m">' + ((list.indexOf(pillar) + 1) || 1) + " / " + list.length + "</span></header>");
}
function viewPillar() {
  const pillar = PILLARS.find((p) => p.id === state.pillar) || PILLARS[0];
  const live = roomById(pillar.id);
  const cats = pillar.cats || [];
  const shown = state.cat ? cats.filter((c) => c.id === state.cat) : cats;
  const highlights = cats.map((c) => '<button class="story" data-act="focus-cat" data-id="' + c.id + '"><span class="ring"><i>' + c.mark + '</i></span><small>' + esc(c.name) + "</small></button>").join("");
  const piece = state.piece && state.piece.pillar === pillar.id
    ? '<article class="card"><div class="k">' + esc(state.piece.type) + "</div><h3>" + esc(state.piece.title) + '</h3><p class="q">Peça deste universo. Imagem, vídeo ou carrossel. O arquivo definitivo entra neste lugar.</p></article>'
    : "";
  const rows = shown.length
    ? shown.map((c) => {
      const cells = [1, 2, 3].map((n) => {
        const type = n === 2 ? "vídeo" : n === 3 ? "carrossel" : "imagem";
        return '<button data-act="open-piece" data-id="' + c.id + '" data-n="' + n + '"><span>' + c.mark + '<br><small>' + type + "</small></span></button>";
      }).join("");
      return '<p class="k" style="padding:14px 14px 0">' + esc(c.name) + '</p><div class="grid">' + cells + '</div><div class="pad"><button class="btn btn2" data-act="open-cursos" data-id="' + c.id + '">Cursos de ' + esc(c.name) + "</button></div>";
    }).join("")
    : '<p class="q" style="padding:16px">As categorias deste universo entram depois. A call, no topo, já abre. O que acontecer no hotel deste pilar também aparece aqui.</p>';
  const air = pillar.mesa
    ? '<p class="q" style="margin-top:12px">Isto acontece no evento. Não é transmissão.</p>'
    : pillar.onAir
    ? '<button class="livebar" data-act="open-room" data-id="' + pillar.id + '"><span class="pill hot"><i class="dot"></i> ao vivo agora</span><span>' + (canEnter(live) ? "Entrar na call" : "Ver ingresso") + "</span></button>"
    : '<button class="livebar" data-act="open-room" data-id="' + pillar.id + '"><span class="pill">call</span><span>Abrir a sala</span></button>';
  return shell('<div style="padding:16px 16px 0"><div class="row"><span class="ring"><i>' + pillar.mark + '</i></span><div><h1>' + esc(pillar.name) + '</h1><p class="q">' + esc(pillar.desc) + "</p></div></div>" + air + "</div>" + (highlights ? '<div class="stories">' + highlights + "</div>" : "") + piece + rows);
}
function viewRoom() {
  const room = roomById(state.room);
  if (!room) return viewHome();
  if (!canEnter(room)) {
    return shell('<div class="pad"><div class="k">Acesso</div><h1>Este lugar pede o ingresso certo.</h1><p class="q">' + (room.kind === "stage" ? "Palco é do ingresso presencial, ou de quem a gestão colocou para dentro." : "A live pede um ingresso.") + '</p><button class="btn" data-act="go" data-id="ticket">Ver ingressos</button></div>');
  }
  const publish = canPublish(room);
  return shell('<div class="pad"><div class="k">' + (room.kind === "live" ? "Live" : "Palco") + " · " + esc(presenterName(room.kind === "live" ? room.id : room.pillar)) + '</div><h1>' + room.mark + " " + esc(room.name) + '</h1><p class="q">' + (publish ? "Sua câmera pode entrar. A direção e o audiovisual autorizado publicam. O restante assiste." : "Você assiste. A câmera fica com o apresentador e com quem está liberado para gravar.") + '</p><p class="m">Nesta sala cabem ' + CAP + '. Agora: ' + seatsOf(room.id) + '. Se alguém sai, abre uma vaga.</p><div class="stage" id="stage"></div><div class="tiles" id="tiles"></div><div class="chat"><div class="k">Comentários</div><div class="chatlog" id="chatlog"></div><div class="row"><input id="chatline" placeholder="Comentar"><button class="btn inline" data-act="chat">Enviar</button></div></div><button class="btn" data-act="join">' + (publish ? "Entrar publicando" : "Entrar assistindo") + '</button><button class="btn btn2" data-act="leave">Sair da sala</button></div>');
}
function viewEu() {
  const t = myTicket();
  const label = t === "admin" ? "Gestão" : t === "presencial" ? "Presencial" : t === "digital" ? "Digital" : "Sem ingresso";
  const note = email() === "sendatantrica@gmail.com" ? "Grava em qualquer sala." : isAdmin() ? "Coloca gente para dentro e para fora." : "O ingresso decide a live e os palcos.";
  const mine = loadPosts().filter((p) => p.email === email());
  const grid = mine.map((p) => '<button data-act="open-slides" data-id="' + esc(p.type) + '" data-n="' + esc(p.email) + '"><span>' + esc(p.type.slice(0, 1).toUpperCase()) + "<br><small>" + esc(p.type) + "</small></span></button>").join("");
  const row = person();
  const unlocked = isAdmin() || (row && row.role === "live" && loadEssence());
  const liveBtn = unlocked
    ? '<button class="btn" data-act="my-live">' + (state.myLive ? "Encerrar a minha live" : "Fazer a minha live") + "</button>"
    : '<button class="btn btn2" data-act="go" data-id="game">Fazer a minha live · completa a essência. A gestão libera.</button>';
  return shell('<div style="padding:16px 16px 0"><div class="row"><span class="ring"><i>' + esc((email() || "?").slice(0, 1).toUpperCase()) + '</i></span><div><h1 style="font-size:22px">' + esc(email()) + '</h1><p class="q">' + note + " · " + esc(label) + "</p></div></div>" +
    '<button class="btn" data-act="go" data-id="game">Participar do evento</button>' +
    '<button class="btn btn2" data-act="go" data-id="perfis">Procurar perfil</button>' +
    liveBtn +
    (t ? "" : '<button class="btn" data-act="go" data-id="ticket">Comprar ingresso</button>') +
    (isAdmin() ? '<button class="btn btn3" data-act="go" data-id="gestao">Gestão</button>' : "") +
    '<button class="btn btn2" data-act="out">Sair</button>' +
    '<div class="k" style="margin-top:18px">Publicar</div><select id="postType"><option>imagem</option><option>vídeo</option><option>carrossel</option></select><input id="postCap" placeholder="Uma linha sobre o post"><button class="btn" data-act="publish">Publicar no perfil</button></div><div class="grid">' + (grid || "") + "</div>");
}
function viewGestao() {
  if (!isAdmin()) return viewEu();
  const rows = state.people.filter((p) => !ADMINS.includes(p.email)).map((p) => '<article class="card"><strong>' + esc(p.email) + '</strong><div class="m">' + esc(p.status) + " · " + esc(p.role) + '</div><div class="row" style="margin-top:8px"><button class="btn inline btn3" data-act="set-in" data-id="' + esc(p.email) + '">Entra</button><button class="btn inline btn2" data-act="set-out" data-id="' + esc(p.email) + '">Sai</button><button class="btn inline btn2" data-act="set-rec" data-id="' + esc(p.email) + '">Grava</button><button class="btn inline btn3" data-act="set-live" data-id="' + esc(p.email) + '">Liberar live</button></div></article>').join("");
  const lives = PILLARS.map((p) => '<article class="card"><div class="k">' + p.name + '</div><label class="m">Apresentador da live</label><input id="pres-' + p.id + '" value="' + esc(presenterEmail(p.id)) + '" placeholder="email do apresentador"><button class="btn" data-act="set-pres" data-id="' + p.id + '">Salvar apresentador</button></article>').join("");
  return shell('<div class="pad"><div class="k">Gestão</div><h1>Quem entra e quem sai.</h1><p class="q">yanfili.simon@gmail.com e sendatantrica@gmail.com entram sem pagar. sendatantrica grava em qualquer sala.</p><article class="card"><label class="m">E-mail</label><input id="who" placeholder="pessoa@gmail.com"><button class="btn" data-act="add-in">Colocar para dentro</button></article>' + rows + lives + "</div>");
}

function viewGame() {
  const ess = loadEssence() || {};
  const ticket = myTicket();
  const presential = ticket === "presencial" || ticket === "admin";
  const hotel = loadJson("os777-hotel", {})[email()] ? "feito" : "aberto";
  return shell('<div class="pad"><div class="k">Gamificação</div><h1>Arquitetura de Essência.</h1><p class="q">Versão curta, para você se apresentar no evento. Não é um site. Não é a mentoria inteira.</p>' +
    '<article class="card"><label class="m">Como você se apresenta</label><input id="ap" value="' + esc(ess.apresenta || "") + '"><label class="m">Posicionamento</label><input id="po" value="' + esc(ess.posicionamento || "") + '"><label class="m">Idade</label><input id="id" value="' + esc(ess.idade || "") + '"><label class="m">Profissão</label><input id="pr" value="' + esc(ess.profissao || "") + '"><label class="m">Um pouco da história</label><input id="hi" value="' + esc(ess.historia || "") + '"><label class="m">Se você imaginasse uma civilização antiga, qual seria?</label><input id="ci" value="' + esc(ess.civilizacao || "") + '"><button class="btn" data-act="save-essencia">Salvar essência</button></article>' +
    '<article class="card"><h3>Apresentação no digital</h3><p class="m">Vale para quem tem ingresso digital e para quem está no presencial. ' + (ess.apresenta ? "Feito." : "Abre quando a essência estiver salva.") + '</p><button class="btn btn2" data-act="go" data-id="reel">Lives acontecendo</button></article>' +
    (presential ? '<article class="card"><h3>Presença no hotel</h3><p class="m">Só o presencial. ' + hotel + '.</p><button class="btn" data-act="hotel">Marcar presença</button></article>' : '<p class="m">O jogo do hotel é só de quem está no presencial.</p>') +
    "</div>");
}
function viewPerfis() {
  const q = state.q.trim().toLowerCase();
  const list = profiles().filter((p) => !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
  const cards = list.map((p) => '<button class="card" data-act="open-perfil" data-id="' + esc(p.email) + '"><div class="row"><span class="mark">' + esc(p.name.slice(0, 1).toUpperCase()) + '</span><div><h3>' + esc(p.name) + '</h3><div class="m">' + (p.live ? "Em live" : p.socio ? "Colabora" : "Perfil") + "</div></div></div></button>").join("");
  return shell('<div class="pad"><div class="k">Perfis</div><h1>Quem está na casa.</h1><input id="q" data-bind="q" value="' + esc(state.q) + '" placeholder="Procurar pelo nome"></div><div style="padding:0 14px 12px">' + cards + '<p class="m">O critério fino da busca fica para depois.</p></div>');
}
function viewSocios() {
  const cards = profiles().filter((p) => p.socio).map((p) => '<button class="card" data-act="open-perfil" data-id="' + esc(p.email) + '"><h3>' + esc(p.name) + '</h3><div class="m">Colabora</div></button>').join("");
  return shell('<div class="pad"><div class="k">Casa</div><h1>Sócios e colaboradores.</h1>' + (cards || '<p class="q">Ainda sem lista fechada.</p>') + "</div>");
}
function viewEventos() {
  const cards = EVENTS.filter((e) => !e.now).map((e) => '<article class="card"><h3>' + esc(e.name) + '</h3><p class="m">' + esc(e.when) + "</p></article>").join("");
  return shell('<div class="pad"><div class="k">Depois</div><h1>Próximos eventos.</h1><p class="q">Os três que estão rolando ficam fixos na casinha. Aqui é o que vem.</p>' + cards + "</div>");
}
function viewCursos() {
  const catId = state.cat;
  let name = "Cursos";
  PILLARS.forEach((p) => (p.cats || []).forEach((c) => { if (c.id === catId) name = c.name; }));
  const shelves = ["Pedaço de live", "Videoaula", "E-book", "Livro"].map((t) => '<article class="card"><h3>' + t + '</h3><p class="m">O lugar está pronto. O arquivo entra depois.</p></article>').join("");
  return shell('<div class="pad"><button class="btn btn2" data-act="back-pillar">Voltar</button><div class="k">Academy</div><h1>Cursos de ' + esc(name) + ".</h1><p class=\"q\">O que foi gravado antes, durante e depois do evento fica aqui.</p>" + shelves + "</div>");
}
function viewSlides() {
  const type = state.piece && state.piece.type ? state.piece.type : "imagem";
  const items = [1, 2, 3].map((n) => '<article class="card"><div class="k">' + esc(type) + " " + n + '</div><h3>' + esc(type) + '</h3><p class="m">Desliza. O arquivo definitivo entra neste slide.</p></article>').join("");
  return shell('<div class="pad"><button class="btn btn2" data-act="back-pillar">Voltar</button><div class="k">Post</div><h1>' + esc(type) + ".</h1>" + items + "</div>");
}
function viewPerfil() {
  const who = profiles().find((p) => p.email === state.who) || { email: state.who, name: state.who, live: false };
  const posts = loadPosts().filter((p) => p.email === who.email);
  const grid = posts.map((p) => '<button><span>' + esc(p.type.slice(0, 1).toUpperCase()) + "<br><small>" + esc(p.caption || p.type) + "</small></span></button>").join("");
  const live = who.live ? '<button class="btn" data-act="open-room" data-id="perfil-' + esc(who.email) + '">Entrar na live</button>' : "";
  return shell('<div class="pad"><div class="row"><span class="ring"><i>' + esc((who.name || "?").slice(0, 1).toUpperCase()) + '</i></span><div><h1>' + esc(who.name) + '</h1><p class="q">' + (who.live ? "Esta pessoa está em live." : "Perfil.") + "</p></div></div>" + live + "</div><div class=\"grid\">" + grid + "</div>");
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
  else if (session && state.route === "game") html = viewGame();
  else if (session && state.route === "perfis") html = viewPerfis();
  else if (session && state.route === "socios") html = viewSocios();
  else if (session && state.route === "eventos") html = viewEventos();
  else if (session && state.route === "cursos") html = viewCursos();
  else if (session && state.route === "slides") html = viewSlides();
  else if (session && state.route === "perfil") html = viewPerfil();
  else if (session && state.route === "gestao") html = viewGestao();
  else if (session) html = myTicket() ? viewHome() : viewTickets();
  root.innerHTML = html;
  document.title = "Convergência OS";
  paintChat();
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

function paintChat() {
  const log = document.getElementById("chatlog");
  if (!log) return;
  const lines = state.chat[state.room] || [];
  log.innerHTML = lines.length
    ? lines.map((line) => '<p class="m"><strong>' + esc(line.who) + "</strong> " + esc(line.text) + "</p>").join("")
    : '<p class="m">Os comentários da call aparecem aqui.</p>';
}
function sendChat() {
  const input = document.getElementById("chatline");
  const text = (input && input.value || "").trim();
  if (!text || !state.room) return;
  const bucket = state.chat[state.room] || [];
  bucket.push({ who: (email().split("@")[0] || "você"), text: text });
  state.chat[state.room] = bucket.slice(-40);
  if (input) input.value = "";
  paintChat();
}
async function joinRoom() {
  const room = roomById(state.room);
  if (!room || room.kind === "mesa" || !window.LivekitClient) { toast("A sala ainda está carregando."); return; }
  if (seatsOf(room.id) >= CAP) { toast("A sala está cheia. Quando alguém sair, abre uma vaga."); return; }
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
    setSeats(room.id, seatsOf(room.id) + 1);
    state.inRoom = true;
    toast(publish ? "Você está publicando." : "Você está assistindo.");
  } catch (err) {
    const stage = document.getElementById("stage");
    const message = err && err.message ? err.message : "sinal indisponível";
    if (stage) stage.innerHTML = '<p class="q">A sala não conectou: ' + esc(message) + "</p>";
    toast("A sala não conectou.");
  }
}
async function leaveRoom() {
  const room = roomById(state.room);
  try { if (lk) await lk.disconnect(); } catch (e) {}
  lk = null;
  if (state.inRoom && room) { setSeats(room.id, seatsOf(room.id) - 1); state.inRoom = false; }
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
    const list = playList();
    const n = list.length || 1;
    state.reel = (state.reel + Number(id) + n) % n;
    state.route = "reel";
    render();
    return;
  }
  if (act === "play-filter") { state.playFilter = id; state.reel = 0; state.route = "reel"; render(); return; }
  if (act === "buy") return buy(id);
  if (act === "out") { await sb.auth.signOut(); return; }
  if (act === "open-pillar") { state.pillar = id; state.cat = ""; state.piece = null; state.route = "pillar"; render(); return; }
  if (act === "focus-cat") { state.cat = state.cat === id ? "" : id; render(); return; }
  if (act === "cursos" || act === "open-cursos") { state.cat = id || state.cat; state.route = "cursos"; render(); return; }
  if (act === "open-piece" || act === "open-slides") {
    const pillar = PILLARS.find((p) => p.id === state.pillar);
    const cat = pillar && (pillar.cats || []).find((c) => c.id === id);
    const n = button.dataset.n || "1";
    const type = act === "open-slides" ? id : (n === "2" ? "vídeo" : n === "3" ? "carrossel" : "imagem");
    state.piece = { pillar: state.pillar, title: (cat ? cat.name : "Peça") + " " + n, type: type };
    state.route = "slides";
    render();
    return;
  }
  if (act === "back-pillar") { state.route = state.pillar ? "pillar" : "home"; render(); return; }
  if (act === "more") { state.more = (state.more || 6) + 6; render(); return; }
  if (act === "open-perfil") { state.who = id; state.route = "perfil"; render(); return; }
  if (act === "publish") {
    const typeEl = document.getElementById("postType");
    const capEl = document.getElementById("postCap");
    const type = typeEl ? typeEl.value : "imagem";
    const caption = (capEl && capEl.value || "").trim();
    if (!email()) return;
    const all = loadPosts();
    all.unshift({ id: Date.now().toString(), email: email(), type: type, caption: caption });
    saveJson("os777-posts", all.slice(0, 60));
    toast("Publicado no seu perfil.");
    render();
    return;
  }
  if (act === "save-essencia") {
    const all = loadJson("os777-essencia", {});
    all[email()] = {
      apresenta: (document.getElementById("ap").value || "").trim(),
      posicionamento: (document.getElementById("po").value || "").trim(),
      idade: (document.getElementById("id").value || "").trim(),
      profissao: (document.getElementById("pr").value || "").trim(),
      historia: (document.getElementById("hi").value || "").trim(),
      civilizacao: (document.getElementById("ci").value || "").trim()
    };
    saveJson("os777-essencia", all);
    toast("Essência salva.");
    render();
    return;
  }
  if (act === "hotel") {
    const all = loadJson("os777-hotel", {});
    all[email()] = true;
    saveJson("os777-hotel", all);
    toast("Presença marcada.");
    render();
    return;
  }
  if (act === "my-live") {
    state.myLive = !state.myLive;
    if (state.myLive) { state.room = "perfil-" + email(); state.route = "room"; }
    render();
    return;
  }
  if (act === "set-live") return setPerson(id, "in", "live");
  if (act === "chat") return sendChat();
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
