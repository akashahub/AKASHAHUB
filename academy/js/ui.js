import {
  TENANT, WORKSPACES, JOBS, ALUNO_TRACKS, EVENTS,
  workspaceById, unitById, grantedWorkspaces, jobOf,
  canManagePeople, canManageEvents, coursesFor, eventsFor, vaultFor,
  progressOf, normEmail
} from './domain.js';

export function esc(s) {
  return String(s || '').split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
}

function toast(t) {
  const e = document.createElement('div');
  e.className = 'toast';
  e.textContent = t;
  document.body.appendChild(e);
  setTimeout(function () { e.remove(); }, 2200);
}

function first(state) {
  return (state.name || 'voce').split(' ')[0];
}

export function viewGate() {
  return '<section class="gate">' +
    '<p class="eyebrow">' + TENANT.name + '</p>' +
    '<h1>Bem-vindo a Fluir.</h1>' +
    '<p class="lead">A Hotmart da rede: cada pessoa entra no proprio card. Aluno nao ve aula de piscineiro. CEO libera quem libera.</p>' +
    '<button class="btn" id="glogin">Entrar com Google</button>' +
    '<button class="btn ghost" id="localin">Entrar sem Google (demo)</button>' +
    '<p class="hint">Depois do login aparece a capa com os cards do seu acesso.</p>' +
    '</section>';
}

function shell(state, route, inner) {
  const unit = unitById(state.unitId);
  const ws = state.workspace ? workspaceById(state.workspace) : null;
  const admin = canManagePeople(state);
  return '<div class="app">' +
    '<aside class="rail">' +
      '<div class="logo"><i>F</i><div><b>Fluir</b><small>Academy</small></div></div>' +
      '<button class="nav-i' + (route === 'capa' ? ' on' : '') + '" data-go="capa">Capa</button>' +
      (state.workspace ? '<button class="nav-i' + (route.indexOf('ws-') === 0 ? ' on' : '') + '" data-go="ws-' + state.workspace + '">' + esc(ws.title) + '</button>' : '') +
      '<button class="nav-i' + (route === 'eventos' ? ' on' : '') + '" data-go="eventos">Eventos</button>' +
      (admin ? '<button class="nav-i' + (route === 'gestao' ? ' on' : '') + '" data-go="gestao">Gestao</button>' : '') +
      '<div class="rail-foot"><span class="chip dim">' + esc(unit.name) + '</span></div>' +
    '</aside>' +
    '<section class="stage">' + inner + '</section>' +
    '<nav class="dock">' +
      '<button class="nav-i' + (route === 'capa' ? ' on' : '') + '" data-go="capa">Capa</button>' +
      '<button class="nav-i" data-go="eventos">Eventos</button>' +
      (admin ? '<button class="nav-i" data-go="gestao">Gestao</button>' : '<button class="nav-i" data-go="capa">Hub</button>') +
    '</nav>' +
  '</div>';
}

export function viewCapa(state) {
  const rooms = grantedWorkspaces(state);
  const cards = WORKSPACES.filter(function (w) { return rooms.indexOf(w.id) >= 0; });
  const show = cards.length ? cards : WORKSPACES;
  const demo = !rooms.length;
  return shell(state, 'capa',
    '<p class="eyebrow">capa · ' + TENANT.id + '</p>' +
    '<h1>Ola, ' + esc(first(state)) + '.</h1>' +
    '<p class="lead">Escolhe o card do seu lugar na rede. Cada porta abre so o que aquele papel pode ver.</p>' +
    (demo ? '<p class="hint">Demo: toca num card para entrar naquele mundo. O CEO depois trava por e-mail.</p>' : '') +
    '<div class="ws-grid">' + show.map(function (w) {
      return '<button class="ws-card" data-ws="' + w.id + '"><span class="tag">' + esc(w.tag) + '</span><b>' + esc(w.title) + '</b><span>' + esc(w.desc) + '</span></button>';
    }).join('') + '</div>' +
    (canManagePeople(state) ? '<button class="btn ghost" data-go="gestao">Abrir gestao de acessos</button>' : '') +
    '<p class="muted"><button class="btn ghost slim" id="out">encerrar sessao</button></p>'
  );
}

export function viewWorkspace(state, wsId) {
  const ws = workspaceById(wsId);
  const list = coursesFor(wsId, state);
  const ev = eventsFor(state, wsId);
  const files = vaultFor(wsId);
  const p = progressOf(state.done, list);
  let extra = '';
  if (wsId === 'colaborador') {
    extra = '<label>Minha funcao na unidade</label><select id="job">' +
      JOBS.map(function (j) {
        return '<option value="' + j.id + '"' + (jobOf(state) === j.id ? ' selected' : '') + '>' + j.title + '</option>';
      }).join('') + '</select><p class="muted">Aula de manobrista nao aparece para recepcao. Aluno nunca ve isso.</p>';
  }
  if (wsId === 'aluno') {
    extra = '<div class="chips">' + ALUNO_TRACKS.map(function (t) {
      return '<span class="chip' + (state.alunoTrack === t.id ? '' : ' dim') + '">' + t.title + '</span>';
    }).join('') + '</div>';
  }
  return shell(state, 'ws-' + wsId,
    '<button class="btn ghost slim" data-go="capa">Voltar a capa</button>' +
    '<p class="eyebrow">' + esc(ws.tag) + '</p>' +
    '<h1>' + esc(ws.title) + '</h1>' +
    '<p class="lead">' + esc(ws.desc) + '</p>' + extra +
    '<div class="spread"><h3>Cursos gravados</h3><span class="chip">' + p.done + '/' + p.total + '</span></div>' +
    '<div class="bar"><i style="width:' + p.pct + '%"></i></div>' +
    list.map(function (c) {
      const ok = !!state.done[c.id];
      return '<article class="card"><div class="spread"><h3>' + esc(c.title) + '</h3><span class="chip' + (ok ? ' ok' : '') + '">' + (ok ? 'visto' : c.minutes + ' min') + '</span></div>' +
        '<div class="player"><iframe src="' + esc(c.url) + '" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>' +
        (ok ? '' : '<button class="btn" data-done="' + c.id + '">Marcar concluida</button>') +
        '</article>';
    }).join('') +
    '<h3>Eventos deste mundo</h3>' +
    ev.map(function (e) {
      return '<article class="card spread"><div><b>' + esc(e.title) + '</b><p class="muted">' + esc(e.when) + ' · ' + esc(e.place) + '</p></div>' +
        '<button class="btn ghost slim" data-live="' + e.id + '">Ao vivo</button></article>';
    }).join('') +
    (files.length ? '<h3>Manuais</h3>' + files.map(function (v) {
      return '<div class="line"><span>' + esc(v.title) + '</span><a href="' + esc(v.url) + '" target="_blank" rel="noopener">abrir</a></div>';
    }).join('') : '')
  );
}

export function viewEventos(state) {
  const list = eventsFor(state, state.workspace);
  return shell(state, 'eventos',
    '<p class="eyebrow">salas</p>' +
    '<h1>Eventos da Fluir.</h1>' +
    '<p class="lead">Sala para todos, sala de aluno, equipe, franqueado e council. CEO escolhe quem administra.</p>' +
    list.map(function (e) {
      return '<article class="card"><div class="spread"><div><h3>' + esc(e.title) + '</h3><p class="muted">' + esc(e.when) + ' · ' + esc(e.place) + '</p></div>' +
        '<span class="chip">' + (e.audience[0] === 'all' ? 'todos' : e.audience.join(' · ')) + '</span></div>' +
        '<button class="btn" data-live="' + e.id + '">Entrar na live</button></article>';
    }).join('')
  );
}

export function viewLive(state, ctx) {
  const ev = EVENTS.filter(function (e) { return e.id === ctx.liveEventId; })[0] || EVENTS[0];
  return shell(state, 'live',
    '<button class="btn ghost slim" data-go="eventos">Voltar</button>' +
    '<p class="eyebrow">livekit · ' + esc(ev.liveRoom) + '</p>' +
    '<h1>' + esc(ev.title) + '</h1>' +
    '<article class="card"><div id="livebox" class="player grid-center">Ainda nao conectado</div>' +
    '<button class="btn" id="golive">Conectar camera</button></article>'
  );
}

export function viewGestao(state) {
  if (!canManagePeople(state)) return viewCapa(state);
  const rows = Object.keys(state.grants || {});
  return shell(state, 'gestao',
    '<p class="eyebrow">gestao · referencia AF, isolada</p>' +
    '<h1>Quem entra em qual card.</h1>' +
    '<p class="lead">CEO libera aluno, professor, colaborador, franqueado e diretores. Nao edita regra da AF.</p>' +
    '<article class="card"><h3>Liberar pessoa por e-mail</h3>' +
      '<label>E-mail</label><input id="g-mail" placeholder="pessoa@fluir.com"/>' +
      '<label>Card principal</label><select id="g-ws">' +
        WORKSPACES.map(function (w) { return '<option value="' + w.id + '">' + w.title + '</option>'; }).join('') +
      '</select>' +
      '<label>Funcao (se for colaborador)</label><select id="g-job">' +
        JOBS.map(function (j) { return '<option value="' + j.id + '">' + j.title + '</option>'; }).join('') +
      '</select>' +
      '<label class="chk"><input type="checkbox" id="g-ev"/> Pode administrar eventos</label>' +
      '<label class="chk"><input type="checkbox" id="g-ad"/> Pode administrar acessos</label>' +
      '<button class="btn" id="g-save">Salvar acesso</button>' +
    '</article>' +
    '<article class="card"><h3>Pessoas liberadas neste aparelho</h3>' +
    (rows.length ? rows.map(function (em) {
      const g = state.grants[em];
      return '<div class="line"><span>' + esc(em) + ' · ' + esc((g.workspaces || []).join(', ')) + '</span><button class="btn ghost slim" data-ungrant="' + esc(em) + '">tirar</button></div>';
    }).join('') : '<p class="muted">Ninguem alem do CEO local.</p>') +
    '</article>' +
    '<article class="card"><h3>O que cada card ve</h3>' +
    '<div class="line"><span>Aluno</span><span class="muted">pilates, ginastica, fisio, infantil</span></div>' +
    '<div class="line"><span>Professor</span><span class="muted">metodologia + aulas do aluno</span></div>' +
    '<div class="line"><span>Colaborador</span><span class="muted">so a funcao + cultura geral</span></div>' +
    '<div class="line"><span>Franqueado</span><span class="muted">cultura e vender franquia</span></div>' +
    '<div class="line"><span>CEO</span><span class="muted">rede, grants, todos os eventos</span></div>' +
    '</article>'
  );
}

export function render(root, ctx) {
  const state = ctx.store.get();
  const route = ctx.route;
  if (!state.signed && route !== 'gate') ctx.route = 'gate';
  if (!state.signed) { root.innerHTML = viewGate(); bind(ctx); return; }
  if (route === 'capa' || route === 'inicio') root.innerHTML = viewCapa(state);
  else if (route.indexOf('ws-') === 0) root.innerHTML = viewWorkspace(state, route.slice(3));
  else if (route === 'eventos') root.innerHTML = viewEventos(state);
  else if (route === 'live') root.innerHTML = viewLive(state, ctx);
  else if (route === 'gestao') root.innerHTML = viewGestao(state);
  else root.innerHTML = viewCapa(state);
  bind(ctx);
}

function bind(ctx) {
  const store = ctx.store;
  document.querySelectorAll('[data-go]').forEach(function (b) {
    b.onclick = function () { ctx.go(b.getAttribute('data-go')); };
  });
  document.querySelectorAll('[data-ws]').forEach(function (b) {
    b.onclick = function () {
      const id = b.getAttribute('data-ws');
      store.patch({ workspace: id, role: store.get().role || id });
      ctx.go('ws-' + id);
    };
  });
  document.querySelectorAll('[data-done]').forEach(function (b) {
    b.onclick = function () { store.markLesson(b.getAttribute('data-done')); toast('Aula registrada'); ctx.draw(); };
  });
  document.querySelectorAll('[data-live]').forEach(function (b) {
    b.onclick = function () { ctx.liveEventId = b.getAttribute('data-live'); ctx.go('live'); };
  });
  document.querySelectorAll('[data-ungrant]').forEach(function (b) {
    b.onclick = function () { store.removeGrant(b.getAttribute('data-ungrant')); toast('Acesso removido'); ctx.draw(); };
  });
  const g = document.getElementById('glogin'); if (g) g.onclick = ctx.loginGoogle;
  const loc = document.getElementById('localin'); if (loc) loc.onclick = ctx.enterLocal;
  const out = document.getElementById('out'); if (out) out.onclick = function () { store.signOut(); ctx.go('gate'); };
  const live = document.getElementById('golive'); if (live) live.onclick = ctx.startLive;
  const job = document.getElementById('job');
  if (job) job.onchange = function () { store.patch({ job: job.value }); ctx.draw(); };
  const save = document.getElementById('g-save');
  if (save) save.onclick = function () {
    const email = normEmail((document.getElementById('g-mail') || {}).value);
    if (!email || email.indexOf('@') < 0) { toast('E-mail invalido'); return; }
    const ws = (document.getElementById('g-ws') || {}).value || 'aluno';
    store.setGrant(email, {
      workspaces: ws === 'ceo' ? WORKSPACES.map(function (w) { return w.id; }) : [ws],
      job: (document.getElementById('g-job') || {}).value,
      eventAdmin: !!(document.getElementById('g-ev') && document.getElementById('g-ev').checked),
      admin: !!(document.getElementById('g-ad') && document.getElementById('g-ad').checked)
    });
    toast('Acesso salvo');
    ctx.draw();
  };
}
