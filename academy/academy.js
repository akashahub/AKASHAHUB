const LS = 'academy-os.v01';
const TENANT = 'fluir';
const WORKER = 'https://akasha.yanfili-simon.workers.dev';
const LIVE_URL = 'wss://akashahub-vlya29kl.livekit.cloud';
const CEO = ['yanfili.simon@gmail.com', 'plmacramo@gmail.com', 'sendatantrica@gmail.com', 'opatricksimon@gmail.com'];

const UNITS = [
  { id: 'pituba', name: 'Pituba' },
  { id: 'rio-vermelho', name: 'Rio Vermelho' },
  { id: 'lauro', name: 'Lauro de Freitas' }
];

const ROLES = [
  { id: 'matriz', title: 'Matriz / CEO', desc: 'Ve a rede inteira, presenca e o cofre.' },
  { id: 'franqueado', title: 'Franqueado', desc: 'Unidade, DRE e equipe local.' },
  { id: 'staff', title: 'Staff', desc: 'Trilhas, quiz e presenca no evento.' },
  { id: 'aluno', title: 'Aluno', desc: 'Aulas em casa e bonus da mensalidade.' },
  { id: 'parceiro', title: 'Parceiro', desc: 'Conteudo tecnico B2B.' }
];

const TRACKS = [
  { id: 'piscineiros', group: 'Piscineiros', title: 'Tratamento de piscinas', audience: ['staff', 'franqueado', 'matriz'], lessons: [
    { id: 'p1', title: 'Quimica da agua', url: 'https://www.youtube.com/embed/jNQXAC9IVRw', min: 8 },
    { id: 'p2', title: 'Checklist diario da raia', url: 'https://www.youtube.com/embed/jNQXAC9IVRw', min: 6 }
  ]},
  { id: 'natacao', group: 'Staff', title: 'Metodologia natacao infantil', audience: ['staff', 'franqueado', 'matriz'], lessons: [
    { id: 'n1', title: 'Metodo Lucas Oliveira — base', url: 'https://www.youtube.com/embed/jNQXAC9IVRw', min: 12 }
  ]},
  { id: 'recepcao', group: 'Recepcao', title: 'Onboarding da recepcao', audience: ['staff', 'franqueado', 'matriz'], lessons: [
    { id: 'r1', title: 'Atendimento e EVO no dia a dia', url: 'https://www.youtube.com/embed/jNQXAC9IVRw', min: 9 }
  ]},
  { id: 'casa', group: 'Alunos', title: 'Treino em casa e respiracao', audience: ['aluno', 'matriz'], lessons: [
    { id: 'c1', title: 'Respiracao para natacao', url: 'https://www.youtube.com/embed/jNQXAC9IVRw', min: 7 }
  ]},
  { id: 'parceiros', group: 'Parceiros', title: 'Protocolo aquatico para fisio', audience: ['parceiro', 'matriz'], lessons: [
    { id: 'x1', title: 'Hidroterapia — alinhamento', url: 'https://www.youtube.com/embed/jNQXAC9IVRw', min: 10 }
  ]}
];

const VAULT = [
  { id: 'onboard', title: 'Manual de Onboarding Geral v2.1', kind: 'pdf', audience: ['franqueado', 'matriz', 'staff'], url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'abertura', title: 'Checklist de Abertura (Recepcao)', kind: 'pdf', audience: ['staff', 'franqueado', 'matriz'], url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'marca', title: 'Identidade visual e contratos', kind: 'pdf', audience: ['franqueado', 'matriz'], url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
];

const EVENT = {
  id: 'pisc-2026',
  title: 'Treinamento Tecnico — Tratamento de Piscinas',
  place: 'Unidade Pituba',
  when: 'Sabado, 10h',
  qr: 'FLUIR-PISC-2026',
  liveRoom: 'fluir-demo'
};

function esc(s) {
  return String(s || '').split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
}

function load() {
  try { return JSON.parse(localStorage.getItem(LS)) || seed(); }
  catch (e) { return seed(); }
}
function save() { localStorage.setItem(LS, JSON.stringify(state)); }
function seed() {
  return { tenant: TENANT, role: null, unit: 'pituba', name: '', email: '', uid: '', done: {}, attend: {}, dre: '', cloud: 'local' };
}

let state = load();
let route = 'gate';
let liveRoom = null;
let me = null;

try {
  firebase.initializeApp({
    apiKey: 'AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4',
    authDomain: 'hub-akasha.firebaseapp.com',
    projectId: 'hub-akasha',
    storageBucket: 'hub-akasha.firebasestorage.app',
    messagingSenderId: '370851875474',
    appId: '1:370851875474:web:29b1ba3a76b0fed7d9344b'
  });
} catch (e) {}

const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
const db = (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore() : null;
if (auth) auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

function toast(t) {
  const e = document.createElement('div');
  e.className = 'toast';
  e.textContent = t;
  document.body.appendChild(e);
  setTimeout(function () { e.remove(); }, 2200);
}

function isCeoMail(em) { return CEO.indexOf(String(em || '').toLowerCase()) >= 0; }
function canSee(aud) { return !aud || aud.indexOf(state.role) >= 0 || state.role === 'matriz'; }
function tracks() { return TRACKS.filter(function (t) { return canSee(t.audience); }); }
function vault() { return VAULT.filter(function (v) { return canSee(v.audience); }); }
function progress() {
  const ls = tracks().reduce(function (a, t) { return a.concat(t.lessons); }, []);
  const n = ls.filter(function (l) { return state.done[l.id]; }).length;
  return { n: n, t: ls.length, pct: ls.length ? Math.round(n * 100 / ls.length) : 0 };
}
function unitName() {
  const u = UNITS.filter(function (x) { return x.id === state.unit; })[0];
  return u ? u.name : 'Pituba';
}
function first() { return (state.name || 'Voce').split(' ')[0]; }

function go(r) { route = r; location.hash = r; render(); }

async function persistCloud() {
  if (!db || !state.uid) return;
  try {
    await db.collection('academy_profiles').doc(state.uid).set({
      tenant: TENANT, role: state.role, unit: state.unit, name: state.name, email: state.email,
      done: state.done, attend: state.attend, dre: state.dre, at: new Date().toISOString()
    }, { merge: true });
    state.cloud = 'ok';
  } catch (e) {
    state.cloud = 'local';
  }
  save();
}

function enter(role, unit) {
  state.role = role;
  state.unit = unit || state.unit || 'pituba';
  if (!state.name) state.name = role === 'matriz' ? 'Artur' : first();
  save();
  persistCloud();
  go('inicio');
}

async function loginGoogle() {
  if (!auth) { toast('Google indisponivel neste preview'); return; }
  const p = new firebase.auth.GoogleAuthProvider();
  p.setCustomParameters({ prompt: 'select_account' });
  try {
    const cred = await auth.signInWithPopup(p);
    const u = cred.user;
    me = u;
    state.uid = u.uid;
    state.email = u.email || '';
    state.name = u.displayName || state.name;
    if (isCeoMail(u.email)) state.role = state.role || 'matriz';
    save();
    persistCloud();
    toast('Login Google ok');
    if (!state.role) go('gate'); else go('inicio');
  } catch (e) {
    if (e.code === 'auth/popup-blocked') { await auth.signInWithRedirect(p); return; }
    toast(e.message || 'Falha no Google');
  }
}

function logout() {
  state.role = null;
  save();
  if (auth) auth.signOut();
  go('gate');
}

function markLesson(id) {
  state.done[id] = true;
  save();
  persistCloud();
  toast('Aula registrada');
  render();
}

function attend(code) {
  const c = String(code || '').trim().toUpperCase();
  if (c !== EVENT.qr) { toast('QR invalido'); return; }
  state.attend[EVENT.id] = { at: new Date().toISOString(), unit: state.unit, role: state.role, name: state.name, mode: 'presencial' };
  save();
  persistCloud();
  toast('Presenca presencial salva');
  render();
}

function presentList() {
  const mine = state.attend[EVENT.id] ? [state.attend[EVENT.id]] : [];
  return mine;
}

async function startLive() {
  const box = document.getElementById('livebox');
  if (!box) return;
  box.textContent = 'Pedindo token...';
  try {
    const identity = (state.uid || state.role || 'guest') + '-' + Date.now().toString(36);
    const res = await fetch(WORKER, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ identity: identity, room: EVENT.liveRoom, name: state.name || 'Fluir', mentor: state.role === 'matriz' })
    });
    const data = await res.json();
    const url = data.url || LIVE_URL;
    if (!data.token) throw new Error(data.error || 'sem token');
    if (!window.LivekitClient) throw new Error('LiveKit client ausente');
    liveRoom = new LivekitClient.Room();
    await liveRoom.connect(url, data.token);
    await liveRoom.localParticipant.setMicrophoneEnabled(true);
    await liveRoom.localParticipant.setCameraEnabled(true);
    box.innerHTML = '';
    liveRoom.remoteParticipants.forEach(attachPart);
    liveRoom.on(LivekitClient.RoomEvent.TrackSubscribed, function (track) {
      box.appendChild(track.attach());
    });
    const local = liveRoom.localParticipant.videoTrackPublications;
    local.forEach(function (pub) { if (pub.track) box.appendChild(pub.track.attach()); });
    toast('Sala ao vivo');
  } catch (e) {
    box.textContent = 'Live ainda demo: ' + (e.message || e);
  }
}

function attachPart(p) {
  p.trackPublications.forEach(function (pub) {
    if (pub.track) {
      const el = document.getElementById('livebox');
      if (el) el.appendChild(pub.track.attach());
    }
  });
}

function navBtn(id, label) {
  return '<button class="' + (route.indexOf(id) === 0 ? 'on' : '') + '" data-go="' + id + '">' + label + '</button>';
}

function viewGate() {
  return '<div class="gate">' +
    '<div class="k">Academy OS · tenant Fluir</div>' +
    '<h1>O conhecimento da rede fica na nuvem.</h1>' +
    '<p class="q">Nao e catraca. Nao e EVO. E a Hotmart privada da Fluir: trilhas, presenca hibrida e cofre da franquia.</p>' +
    '<div class="card"><div class="k">Entrar como</div><div class="roles">' +
    ROLES.map(function (r) {
      return '<button data-role="' + r.id + '"><b>' + r.title + '</b><span class="m">' + r.desc + '</span></button>';
    }).join('') +
    '</div><button class="btn btn2" id="glogin">Entrar com Google</button>' +
    '<p class="m">Google e opcional neste V0. Papel define o que aparece. Dados ficam neste aparelho; Firestore so se as rules academy_* existirem.</p></div></div>';
}

function shell(inner) {
  const p = progress();
  return '<div class="wrap">' +
    '<div class="top"><div class="brand"><div class="mark">F</div><div><b>Fluir Academy</b><small>' + esc(state.role) + ' · ' + esc(unitName()) + '</small></div></div>' +
    '<div class="row"><span class="pill">' + p.n + '/' + p.t + ' aulas</span>' +
    '<span class="avatar">' + esc((state.name || 'A').slice(0, 1).toUpperCase()) + '</span></div></div>' +
    '<div class="grid"><aside class="side">' +
    '<button data-go="inicio" class="' + (route === 'inicio' ? 'on' : '') + '">Inicio</button>' +
    '<button data-go="trilhas" class="' + (route === 'trilhas' || route.indexOf('trilha-') === 0 ? 'on' : '') + '">Trilhas EAD</button>' +
    '<button data-go="eventos" class="' + (route.indexOf('evento') === 0 || route === 'live' ? 'on' : '') + '">Eventos e Lives</button>' +
    (state.role === 'matriz' || state.role === 'franqueado' ? '<button data-go="franqueados" class="' + (route === 'franqueados' ? 'on' : '') + '">Franqueados</button>' : '') +
    '<button data-go="eu" class="' + (route === 'eu' ? 'on' : '') + '">Eu</button>' +
    '</aside><main>' + inner + '</main></div></div>' +
    '<nav class="nav">' +
    navBtn('inicio', 'Inicio') + navBtn('trilhas', 'Trilhas') + navBtn('eventos', 'Eventos') +
    navBtn('live', 'Ao vivo') +
    ((state.role === 'matriz' || state.role === 'franqueado') ? navBtn('franqueados', 'Cofre') : navBtn('eu', 'Eu')) +
    navBtn('eu', 'Perfil') +
    '</nav>';
}

function viewInicio() {
  const p = progress();
  const att = state.attend[EVENT.id];
  return shell(
    '<div class="k">Destaque da semana</div><h1>Palestra de rapport e comunicacao.</h1>' +
    '<p class="q">Replay do alinhamento da matriz. Quem nao foi ao presencial assiste aqui.</p>' +
    '<div class="card"><div class="row"><div><h3>Replay · Comunicacao nao-verbal</h3><p class="m">Gravado · URL, sem Storage</p></div><span class="pill">Replay</span></div>' +
    '<div class="player"><iframe src="https://www.youtube.com/embed/jNQXAC9IVRw" allow="autoplay; encrypted-media" allowfullscreen></iframe></div></div>' +
    '<div class="cards">' +
    '<div class="card"><div class="k">Proximo presencial</div><h3>' + esc(EVENT.title) + '</h3><p class="m">' + esc(EVENT.place) + ' · ' + esc(EVENT.when) + '</p>' +
    '<button class="btn" data-go="eventos">Abrir evento</button></div>' +
    '<div class="card"><div class="k">Live estrategica</div><h3>Alinhamento geral</h3><p class="m">Sala fluir-demo · LiveKit</p>' +
    '<button class="btn btn3" data-go="live">Entrar na live</button></div>' +
    '</div>' +
    '<div class="card"><div class="row"><h3>Seu progresso</h3><span class="pill">' + p.pct + '%</span></div>' +
    '<div class="prog"><i style="width:' + p.pct + '%"></i></div>' +
    '<p class="m">' + (att ? 'Presenca presencial ja marcada neste evento.' : 'Ainda sem presenca presencial neste ciclo.') + '</p></div>' +
    '<div class="card"><div class="k">Processos</div>' + vault().map(function (v) {
      return '<div class="item row"><span>' + esc(v.title) + '</span><a class="pill" href="' + esc(v.url) + '" target="_blank" rel="noopener">Abrir</a></div>';
    }).join('') + '</div>'
  );
}

function viewTrilhas() {
  return shell(
    '<div class="k">Trilhas do seu papel</div><h1>O que voce precisa saber para operar.</h1>' +
    tracks().map(function (t) {
      const d = t.lessons.filter(function (l) { return state.done[l.id]; }).length;
      return '<div class="card"><div class="row"><div><span class="pill">' + esc(t.group) + '</span><h3 style="margin-top:8px">' + esc(t.title) + '</h3></div><span class="m">' + d + '/' + t.lessons.length + '</span></div>' +
        '<button class="btn btn3" data-go="trilha-' + t.id + '">Abrir trilha</button></div>';
    }).join('')
  );
}

function viewTrilha(id) {
  const t = TRACKS.filter(function (x) { return x.id === id; })[0];
  if (!t) return viewTrilhas();
  return shell(
    '<button class="btn btn2" data-go="trilhas">Voltar</button>' +
    '<div class="k">' + esc(t.group) + '</div><h1>' + esc(t.title) + '</h1>' +
    t.lessons.map(function (l) {
      const ok = !!state.done[l.id];
      return '<div class="card"><div class="row"><h3>' + esc(l.title) + '</h3><span class="pill ' + (ok ? 'ok' : 'wait') + '">' + (ok ? 'visto' : l.min + ' min') + '</span></div>' +
        '<div class="player"><iframe src="' + esc(l.url) + '" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>' +
        (ok ? '<p class="m">Registrado neste aparelho.</p>' : '<button class="btn" data-done="' + l.id + '">Marcar como concluida</button>') +
        '</div>';
    }).join('')
  );
}

function viewEventos() {
  const att = state.attend[EVENT.id];
  return shell(
    '<div class="k">Evento hibrido</div><h1>' + esc(EVENT.title) + '</h1>' +
    '<p class="q">Presencial em ' + esc(EVENT.place) + '. Quem nao vai assiste a live e o replay. Quem vai le o QR e fica marcado como presencial.</p>' +
    '<div class="card"><div class="row"><span class="pill">' + esc(EVENT.when) + '</span><span class="pill ' + (att ? 'ok' : 'wait') + '">' + (att ? 'compareceu' : 'ainda nao') + '</span></div>' +
    '<div class="qr">QR · ' + EVENT.qr + '</div>' +
    '<label>Validar presenca (digite o codigo do telao)</label>' +
    '<input id="qrcode" placeholder="' + EVENT.qr + '" value=""/>' +
    '<button class="btn" id="scan">Validar presenca</button>' +
    '<button class="btn btn3" data-go="live">Entrar na live da sala</button>' +
    '<p class="m">Camera real de QR entra na proxima versao. Neste V0 o codigo do telao prova o fluxo.</p></div>' +
    (state.role === 'matriz' || state.role === 'franqueado' ?
      '<div class="card"><h3>Quem compareceu neste aparelho</h3>' +
      (presentList().length ? presentList().map(function (a) {
        return '<div class="item">' + esc(a.name || 'Participante') + ' · ' + esc(a.role) + ' · ' + esc(a.unit) + '</div>';
      }).join('') : '<p class="m">Ninguem validou neste browser ainda.</p>') + '</div>' : '')
  );
}

function viewLive() {
  return shell(
    '<div class="k">Sala fluir-demo</div><h1>Live estrategica</h1>' +
    '<p class="q">Mesmo Worker LiveKit do Hub.</p>' +
    '<div class="card"><div id="livebox" class="player" style="display:grid;place-items:center;color:#9bb7b6">Ainda nao conectado</div>' +
    '<button class="btn" id="golive">Conectar camera e microfone</button>' +
    '<p class="m">Se o Worker falhar, a sala continua visivel como demo. Replay usa URL.</p></div>'
  );
}

function viewFranqueados() {
  if (state.role !== 'matriz' && state.role !== 'franqueado') return viewInicio();
  return shell(
    '<div class="k">Cofre da franquia</div><h1>Manuais, cultura e DRE.</h1>' +
    '<div class="card"><label>Unidade</label><select id="unit">' +
    UNITS.map(function (u) { return '<option value="' + u.id + '"' + (u.id === state.unit ? ' selected' : '') + '>' + u.name + '</option>'; }).join('') +
    '</select></div>' +
    vault().map(function (v) {
      return '<div class="card row"><div><h3>' + esc(v.title) + '</h3><p class="m">' + v.kind.toUpperCase() + ' · URL</p></div><a class="btn btn3" style="width:auto;padding:10px 16px" href="' + esc(v.url) + '" target="_blank" rel="noopener">Abrir</a></div>';
    }).join('') +
    '<div class="card"><h3>Enviar DRE do mes (URL do PDF)</h3>' +
    '<input id="dre" placeholder="https://..." value="' + esc(state.dre) + '"/>' +
    '<button class="btn" id="savedre">Guardar URL da DRE</button>' +
    '<p class="m">Arquivo nao sobe para o Firebase Storage. So o link.</p></div>'
  );
}

function viewEu() {
  return shell(
    '<div class="k">Perfil</div><h1>' + esc(state.name || 'Participante') + '</h1>' +
    '<div class="card"><label>Nome</label><input id="nm" value="' + esc(state.name) + '"/>' +
    '<label>Papel</label><select id="rl">' + ROLES.map(function (r) { return '<option value="' + r.id + '"' + (r.id === state.role ? ' selected' : '') + '>' + r.title + '</option>'; }).join('') + '</select>' +
    '<label>Unidade</label><select id="un">' + UNITS.map(function (u) { return '<option value="' + u.id + '"' + (u.id === state.unit ? ' selected' : '') + '>' + u.name + '</option>'; }).join('') + '</select>' +
    '<button class="btn" id="savep">Salvar</button>' +
    '<button class="btn btn2" id="out">Sair</button>' +
    '<p class="m">Tenant ' + TENANT + ' · nuvem ' + state.cloud + ' · e-mail ' + esc(state.email || 'local') + '</p>' +
    '<p class="m">AF Plataforma e /legado-os nao sao alterados por este app.</p></div>'
  );
}

function render() {
  const app = document.getElementById('app');
  if (!state.role && route !== 'gate') route = 'gate';
  if (route === 'gate') app.innerHTML = viewGate();
  else if (route === 'inicio') app.innerHTML = viewInicio();
  else if (route === 'trilhas') app.innerHTML = viewTrilhas();
  else if (route.indexOf('trilha-') === 0) app.innerHTML = viewTrilha(route.slice(7));
  else if (route === 'eventos') app.innerHTML = viewEventos();
  else if (route === 'live') app.innerHTML = viewLive();
  else if (route === 'franqueados') app.innerHTML = viewFranqueados();
  else if (route === 'eu') app.innerHTML = viewEu();
  else app.innerHTML = viewInicio();
  bind();
}

function bind() {
  document.querySelectorAll('[data-go]').forEach(function (b) {
    b.onclick = function () { go(b.getAttribute('data-go')); };
  });
  document.querySelectorAll('[data-role]').forEach(function (b) {
    b.onclick = function () { enter(b.getAttribute('data-role')); };
  });
  document.querySelectorAll('[data-done]').forEach(function (b) {
    b.onclick = function () { markLesson(b.getAttribute('data-done')); };
  });
  const g = document.getElementById('glogin'); if (g) g.onclick = loginGoogle;
  const s = document.getElementById('scan'); if (s) s.onclick = function () { attend((document.getElementById('qrcode') || {}).value); };
  const l = document.getElementById('golive'); if (l) l.onclick = startLive;
  const out = document.getElementById('out'); if (out) out.onclick = logout;
  const un = document.getElementById('unit');
  if (un) un.onchange = function () { state.unit = un.value; save(); toast('Unidade: ' + unitName()); };
  const dre = document.getElementById('savedre');
  if (dre) dre.onclick = function () { state.dre = (document.getElementById('dre') || {}).value || ''; save(); persistCloud(); toast('DRE URL salva'); };
  const sv = document.getElementById('savep');
  if (sv) sv.onclick = function () {
    state.name = (document.getElementById('nm') || {}).value || state.name;
    state.role = (document.getElementById('rl') || {}).value || state.role;
    state.unit = (document.getElementById('un') || {}).value || state.unit;
    save(); persistCloud(); toast('Perfil salvo'); render();
  };
}

if (auth) {
  auth.onAuthStateChanged(function (u) {
    if (!u) return;
    me = u;
    state.uid = u.uid;
    state.email = u.email || state.email;
    if (!state.name) state.name = u.displayName || '';
    if (isCeoMail(u.email) && !state.role) state.role = 'matriz';
    save();
  });
}

window.addEventListener('hashchange', function () {
  const h = (location.hash || '').replace('#', '');
  if (h) { route = h; render(); }
});

route = (location.hash || '').replace('#', '') || (state.role ? 'inicio' : 'gate');
render();
