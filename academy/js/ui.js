import {
  TENANT, UNITS, ROLES, ACTION, EVENT,
  can, tracksFor, vaultFor, unitById, roleById, progressOf
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

function navItem(route, id, label) {
  return '<button class="nav-i' + (route === id || (id === 'trilhas' && route.indexOf('trilha-') === 0) ? ' on' : '') + '" data-go="' + id + '">' + label + '</button>';
}

export function viewGate() {
  return '<section class="gate">' +
    '<p class="eyebrow">' + TENANT.name + ' · tenant ' + TENANT.id + '</p>' +
    '<h1>O sistema operacional da rede.</h1>' +
    '<p class="lead">EVO abre a catraca. Aqui mora o conhecimento: trilha, presenca hibrida e cofre da franquia.</p>' +
    '<div class="role-grid">' + ROLES.map(function (r) {
      return '<button class="role-card" data-role="' + r.id + '"><span class="tag">' + r.id + '</span><b>' + r.title + '</b><span>' + r.desc + '</span></button>';
    }).join('') + '</div>' +
    '<button class="btn ghost" id="glogin">Entrar com Google</button>' +
    '<p class="hint">Papel define entitlement. Google e identidade.</p>' +
    '</section>';
}

function shell(state, route, inner) {
  const role = roleById(state.role);
  const unit = unitById(state.unitId);
  const p = progressOf(state.done, state.role);
  const vaultOk = can(state.role, ACTION.VIEW_VAULT);
  return '<div class="app">' +
    '<aside class="rail">' +
      '<div class="logo"><i>F</i><div><b>Fluir</b><small>Academy OS</small></div></div>' +
      navItem(route, 'inicio', 'Hub') +
      navItem(route, 'trilhas', 'Trilhas') +
      navItem(route, 'eventos', 'Eventos') +
      navItem(route, 'live', 'Ao vivo') +
      (vaultOk ? navItem(route, 'cofre', 'Cofre') : '') +
      navItem(route, 'sistema', 'Sistema') +
      '<div class="rail-foot">' +
        '<span class="chip">' + esc(role.title) + '</span>' +
        '<span class="chip dim">' + esc(unit.name) + '</span>' +
      '</div>' +
    '</aside>' +
    '<section class="stage">' +
      '<header class="top">' +
        '<div><p class="eyebrow">tenant/' + TENANT.id + ' · ' + esc(state.cloud) + '</p><h2>' + esc(role.title) + '</h2></div>' +
        '<div class="top-r"><span class="meter"><i style="width:' + p.pct + '%"></i></span><b>' + p.done + '/' + p.total + '</b>' +
        '<span class="ava">' + esc((state.name || 'A').slice(0, 1).toUpperCase()) + '</span></div>' +
      '</header>' +
      inner +
      '<footer class="layers">identidade → papel → unidade → conteudo → presenca → live</footer>' +
    '</section>' +
    '<nav class="dock">' +
      navItem(route, 'inicio', 'Hub') +
      navItem(route, 'trilhas', 'Trilhas') +
      navItem(route, 'eventos', 'Eventos') +
      navItem(route, 'live', 'Live') +
      navItem(route, vaultOk ? 'cofre' : 'sistema', vaultOk ? 'Cofre' : 'OS') +
    '</nav>' +
  '</div>';
}

export function viewInicio(state) {
  const p = progressOf(state.done, state.role);
  const att = state.attend[EVENT.id];
  const files = vaultFor(state.role);
  return shell(state, 'inicio',
    '<p class="eyebrow">destaque da semana</p>' +
    '<h1>Rapport e comunicacao nao-verbal.</h1>' +
    '<p class="lead">Replay da matriz. URL, sem Storage.</p>' +
    '<div class="player"><iframe src="https://www.youtube.com/embed/jNQXAC9IVRw" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>' +
    '<div class="duo">' +
      '<article class="card"><p class="eyebrow">presencial</p><h3>' + esc(EVENT.title) + '</h3><p class="muted">' + esc(EVENT.place) + ' · ' + esc(EVENT.when) + '</p>' +
      '<button class="btn" data-go="eventos">Abrir evento</button></article>' +
      '<article class="card"><p class="eyebrow">live</p><h3>Alinhamento geral</h3><p class="muted">sala ' + EVENT.liveRoom + '</p>' +
      '<button class="btn ghost" data-go="live">Entrar na live</button></article>' +
    '</div>' +
    '<article class="card"><div class="spread"><h3>Progresso neste papel</h3><span class="chip">' + p.pct + '%</span></div>' +
    '<div class="bar"><i style="width:' + p.pct + '%"></i></div>' +
    '<p class="muted">' + (att ? 'Presenca presencial ja marcada.' : 'Ainda sem presenca presencial.') + '</p></article>' +
    (files.length ? '<article class="card"><p class="eyebrow">processos visiveis</p>' + files.map(function (v) {
      return '<div class="line"><span>' + esc(v.title) + '</span><a href="' + esc(v.url) + '" target="_blank" rel="noopener">abrir</a></div>';
    }).join('') + '</article>' : '')
  );
}

export function viewTrilhas(state, route) {
  if (route.indexOf('trilha-') === 0) {
    const id = route.slice(7);
    const t = tracksFor(state.role).filter(function (x) { return x.id === id; })[0];
    if (!t) return viewTrilhas(state, 'trilhas');
    return shell(state, 'trilhas',
      '<button class="btn ghost slim" data-go="trilhas">Voltar</button>' +
      '<p class="eyebrow">' + esc(t.group) + '</p><h1>' + esc(t.title) + '</h1>' +
      t.lessons.map(function (l) {
        const ok = !!state.done[l.id];
        return '<article class="card"><div class="spread"><h3>' + esc(l.title) + '</h3><span class="chip ' + (ok ? 'ok' : '') + '">' + (ok ? 'visto' : l.minutes + ' min') + '</span></div>' +
          '<div class="player"><iframe src="' + esc(l.url) + '" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>' +
          (ok ? '<p class="muted">Registrado.</p>' : '<button class="btn" data-done="' + l.id + '">Marcar como concluida</button>') +
          '</article>';
      }).join('')
    );
  }
  return shell(state, 'trilhas',
    '<p class="eyebrow">catalogo filtrado pelo papel</p>' +
    '<h1>O que este cargo precisa saber.</h1>' +
    tracksFor(state.role).map(function (t) {
      const d = t.lessons.filter(function (l) { return state.done[l.id]; }).length;
      return '<article class="card"><div class="spread"><div><span class="chip">' + esc(t.group) + '</span><h3>' + esc(t.title) + '</h3></div><span class="muted">' + d + '/' + t.lessons.length + '</span></div>' +
        '<button class="btn ghost" data-go="trilha-' + t.id + '">Abrir trilha</button></article>';
    }).join('')
  );
}

export function viewEventos(state) {
  const att = state.attend[EVENT.id];
  const list = att ? [att] : [];
  return shell(state, 'eventos',
    '<p class="eyebrow">evento hibrido</p>' +
    '<h1>' + esc(EVENT.title) + '</h1>' +
    '<p class="lead">Presencial em ' + esc(EVENT.place) + '. Quem nao vai entra na live.</p>' +
    '<article class="card">' +
      '<div class="spread"><span class="chip">' + esc(EVENT.when) + '</span><span class="chip ' + (att ? 'ok' : '') + '">' + (att ? 'compareceu' : 'pendente') + '</span></div>' +
      '<div class="qr">QR · ' + EVENT.qr + '</div>' +
      (can(state.role, ACTION.SCAN_PRESENCE) ?
        '<label>Codigo do telao</label><input id="qrcode" placeholder="' + EVENT.qr + '"/>' +
        '<button class="btn" id="scan">Validar presenca</button>' : '<p class="muted">Seu papel nao valida presenca.</p>') +
      '<button class="btn ghost" data-go="live">Entrar na live</button>' +
    '</article>' +
    (can(state.role, ACTION.VIEW_ATTENDANCE) ?
      '<article class="card"><h3>Presenca neste aparelho</h3>' +
      (list.length ? list.map(function (a) {
        return '<div class="line"><span>' + esc(a.name || 'Participante') + ' · ' + esc(a.role) + '</span><span class="muted">' + esc(a.unitId) + '</span></div>';
      }).join('') : '<p class="muted">Ninguem validou neste browser.</p>') + '</article>' : '')
  );
}

export function viewLive(state) {
  return shell(state, 'live',
    '<p class="eyebrow">adapter livekit</p>' +
    '<h1>Sala ' + EVENT.liveRoom + '</h1>' +
    '<p class="lead">O Worker assina o JWT. Este app so monta o player.</p>' +
    '<article class="card"><div id="livebox" class="player grid-center">Ainda nao conectado</div>' +
    (can(state.role, ACTION.GO_LIVE) ? '<button class="btn" id="golive">Conectar camera</button>' : '<p class="muted">Sem permissao de live.</p>') +
    '</article>'
  );
}

export function viewCofre(state) {
  if (!can(state.role, ACTION.VIEW_VAULT)) return viewInicio(state);
  return shell(state, 'cofre',
    '<p class="eyebrow">cofre da franquia</p>' +
    '<h1>Manuais, cultura, DRE.</h1>' +
    '<article class="card"><label>Unidade</label><select id="unit">' +
    UNITS.map(function (u) {
      return '<option value="' + u.id + '"' + (u.id === state.unitId ? ' selected' : '') + '>' + u.name + ' · ' + u.city + '</option>';
    }).join('') + '</select></article>' +
    vaultFor(state.role).map(function (v) {
      return '<article class="card spread"><div><h3>' + esc(v.title) + '</h3><p class="muted">' + v.kind + ' · url</p></div>' +
        '<a class="btn ghost slim" href="' + esc(v.url) + '" target="_blank" rel="noopener">Abrir</a></article>';
    }).join('') +
    (can(state.role, ACTION.WRITE_DRE) ?
      '<article class="card"><h3>DRE do mes (URL)</h3>' +
      '<input id="dre" placeholder="https://" value="' + esc(state.dreUrl) + '"/>' +
      '<button class="btn" id="savedre">Guardar URL</button></article>' : '')
  );
}

export function viewSistema(state) {
  return shell(state, 'sistema',
    '<p class="eyebrow">arquitetura</p>' +
    '<h1>Camadas do Academy OS.</h1>' +
    '<div class="stack">' +
      '<article class="card"><b>domain.js</b><p>Tenant, papeis, units, catalogo, policy. Sem DOM.</p></article>' +
      '<article class="card"><b>store.js</b><p>Um state tree. localStorage sempre. Firestore se uid + rule.</p></article>' +
      '<article class="card"><b>live.js</b><p>Adapter do Worker. UI nao assina JWT.</p></article>' +
      '<article class="card"><b>ui.js</b><p>Views. So le state + domain.can().</p></article>' +
    '</div>' +
    '<article class="card">' +
      '<label>Nome</label><input id="nm" value="' + esc(state.name) + '"/>' +
      '<label>Papel</label><select id="rl">' + ROLES.map(function (r) {
        return '<option value="' + r.id + '"' + (r.id === state.role ? ' selected' : '') + '>' + r.title + '</option>';
      }).join('') + '</select>' +
      '<label>Unidade</label><select id="un">' + UNITS.map(function (u) {
        return '<option value="' + u.id + '"' + (u.id === state.unitId ? ' selected' : '') + '>' + u.name + '</option>';
      }).join('') + '</select>' +
      '<button class="btn" id="savep">Salvar perfil</button>' +
      '<button class="btn ghost" id="out">Sair</button>' +
      '<p class="muted">email ' + esc(state.email || 'local') + ' · nao toca AF nem /legado-os</p>' +
    '</article>'
  );
}

export function render(root, ctx) {
  const state = ctx.store.get();
  const route = ctx.route;
  if (!state.role) root.innerHTML = viewGate();
  else if (route === 'inicio') root.innerHTML = viewInicio(state);
  else if (route === 'trilhas' || route.indexOf('trilha-') === 0) root.innerHTML = viewTrilhas(state, route);
  else if (route === 'eventos') root.innerHTML = viewEventos(state);
  else if (route === 'live') root.innerHTML = viewLive(state);
  else if (route === 'cofre') root.innerHTML = viewCofre(state);
  else if (route === 'sistema') root.innerHTML = viewSistema(state);
  else root.innerHTML = viewInicio(state);
  bind(ctx);
}

function bind(ctx) {
  const store = ctx.store;
  document.querySelectorAll('[data-go]').forEach(function (b) {
    b.onclick = function () { ctx.go(b.getAttribute('data-go')); };
  });
  document.querySelectorAll('[data-role]').forEach(function (b) {
    b.onclick = function () {
      const role = b.getAttribute('data-role');
      store.patch({ role: role, name: store.get().name || (role === 'matriz' ? 'Artur' : 'Participante') });
      ctx.go('inicio');
    };
  });
  document.querySelectorAll('[data-done]').forEach(function (b) {
    b.onclick = function () { store.markLesson(b.getAttribute('data-done')); toast('Aula registrada'); ctx.draw(); };
  });
  const g = document.getElementById('glogin'); if (g) g.onclick = ctx.loginGoogle;
  const s = document.getElementById('scan');
  if (s) s.onclick = function () {
    const code = String((document.getElementById('qrcode') || {}).value || '').trim().toUpperCase();
    if (code !== EVENT.qr) { toast('QR invalido'); return; }
    const st = store.get();
    store.markAttend(EVENT.id, { at: new Date().toISOString(), unitId: st.unitId, role: st.role, name: st.name, mode: 'presencial' });
    toast('Presenca presencial');
    ctx.draw();
  };
  const l = document.getElementById('golive'); if (l) l.onclick = ctx.startLive;
  const out = document.getElementById('out');
  if (out) out.onclick = function () { store.resetRole(); ctx.go('gate'); };
  const un = document.getElementById('unit');
  if (un) un.onchange = function () { store.patch({ unitId: un.value }); toast('Unidade atualizada'); };
  const dre = document.getElementById('savedre');
  if (dre) dre.onclick = function () { store.patch({ dreUrl: (document.getElementById('dre') || {}).value || '' }); toast('URL da DRE salva'); };
  const sv = document.getElementById('savep');
  if (sv) sv.onclick = function () {
    store.patch({
      name: (document.getElementById('nm') || {}).value || store.get().name,
      role: (document.getElementById('rl') || {}).value || store.get().role,
      unitId: (document.getElementById('un') || {}).value || store.get().unitId
    });
    toast('Perfil salvo');
    ctx.draw();
  };
}
