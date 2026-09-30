import {
  TENANT, UNITS, WORKSPACES, JOBS, EVENTS, NOTICE,
  workspaceById, unitById, grantedWorkspaces, jobOf,
  canManagePeople, canEnter, isMonitored, areasFor, coursesFor, eventsFor, vaultFor,
  progressOf, normEmail, ytEmbed, whenLabel, isCeoEmail,
  canSeeDirectory, directoryUnitsFor, directoryMembersFor, directoryRoleLabel
} from './domain.js?v=20260929e';


const FLUIR_LOGO = 'data:image/webp;base64,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';

const AREA_VISUALS = {
  pilates: {
    img: 'https://redefluir.com.br/wp-content/uploads/2019/05/img-servico-pilates.png',
    desc: 'Forca, mobilidade, postura e sequencias para praticar com orientacao.'
  },
  ginastica: {
    img: 'https://redefluir.com.br/wp-content/uploads/2019/05/img-servico-hidroginastica-ok.png',
    desc: 'Aulas aquáticas de condicionamento, forca e mobilidade com baixo impacto.'
  },
  fisio: {
    img: 'https://redefluir.com.br/wp-content/uploads/2019/05/img-servico-hidroterapia-ok-.png',
    desc: 'Conteudos de fisioterapia aquatica, mobilidade e cuidado funcional.'
  },
  natacao: {
    img: 'https://redefluir.com.br/wp-content/uploads/2019/03/NATA%C3%87%C3%83O-ADULTO.png',
    desc: 'Tecnica, respiracao, resistencia e evolucao na natacao para adultos.'
  },
  infantil: {
    img: 'https://redefluir.com.br/wp-content/uploads/2019/05/img-servico-natacao-infantil-ok.png',
    desc: 'Aprendizado, seguranca aquatica, jogos e desenvolvimento infantil.'
  },
  bebe: {
    img: 'https://redefluir.com.br/wp-content/uploads/2019/05/img-servico-natacao-para-bebes-ok.png',
    desc: 'Adaptacao, vinculo, ritmo e seguranca para bebe e acompanhante.'
  },
  gestantes: {
    img: 'https://redefluir.com.br/wp-content/uploads/2019/03/Programas-para-Gestantes.png',
    desc: 'Movimento e bem-estar na gestacao, no solo e na agua, com orientacao.'
  }
};

export function esc(s) {
  return String(s || '').split('&').join('&').split('<').join('<').split('>').join('>').split('"').join('"');
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
    '<img class="gate-logo" src="' + FLUIR_LOGO + '" alt="Rede Fluir"/>' +
    '<p class="eyebrow">' + TENANT.name + '</p>' +
    '<h1>Bem-vindo a Fluir.</h1>' +
    '<p class="lead">Cada pessoa entra no proprio card. Aluno ve as areas livres. Professor, equipe, franqueado e socio entram so onde foram liberados.</p>' +
    '<button class="btn" id="glogin">Entrar com Google</button>' +
    '<button class="btn ghost" id="localin">Entrar sem Google (demo)</button>' +
    '<p class="hint">Video fica no YouTube, sem storage. Area fechada avisa que o acesso e monitorado.</p>' +
    '</section>';
}

function shell(state, route, inner) {
  const unit = unitById(state.unitId);
  const ws = state.workspace ? workspaceById(state.workspace) : null;
  const admin = canManagePeople(state);
  return '<div class="app">' +
    '<aside class="rail">' +
      '<div class="logo"><img src="' + FLUIR_LOGO + '" alt="Rede Fluir"/><div><b>Fluir</b><small>Academy</small></div></div>' +
      '<button class="nav-i' + (route === 'capa' ? ' on' : '') + '" data-go="capa">Capa</button>' +
      (state.workspace ? '<button class="nav-i' + (route.indexOf('ws-') === 0 ? ' on' : '') + '" data-go="ws-' + state.workspace + '">' + esc(ws.title) + '</button>' : '') +
      '<button class="nav-i' + (route === 'eventos' ? ' on' : '') + '" data-go="eventos">Eventos</button>' +
      (admin ? '<button class="nav-i' + (route === 'gestao' ? ' on' : '') + '" data-go="gestao">Gestao</button>' : '') +
      (canSeeDirectory(state) ? '<div class="rail-foot"><span class="muted" style="width:100%;margin-bottom:4px">Unidades Fluir</span>' +
        directoryUnitsFor(state).map(function (u) {
          return '<button class="unit-chip' + (route === 'membros-' + u.id ? ' on' : '') + '" data-unit="' + u.id + '">' + esc(u.name) + '</button>';
        }).join('') +
      '</div>' : '') +
    '</aside>' +
    '<section class="stage">' + inner + '</section>' +
    '<nav class="dock">' +
      '<button class="nav-i' + (route === 'capa' ? ' on' : '') + '" data-go="capa">Capa</button>' +
      '<button class="nav-i" data-go="eventos">Eventos</button>' +
      (admin ? '<button class="nav-i" data-go="gestao">Gestao</button>' : '<button class="nav-i" data-go="capa">Hub</button>') +
    '</nav>' +
  '</div>';
}

function visibleCards(state) {
  if (!state.email || state.role === 'ceo' || isCeoEmail(state.email)) return WORKSPACES;
  const rooms = grantedWorkspaces(state);
  const ids = rooms.indexOf('aluno') >= 0 ? rooms : ['aluno'].concat(rooms);
  const uniq = [];
  ids.forEach(function (id) { if (uniq.indexOf(id) < 0) uniq.push(id); });
  return WORKSPACES.filter(function (w) { return uniq.indexOf(w.id) >= 0; });
}

export function viewCapa(state) {
  const show = visibleCards(state);
  const demo = !state.email;
  return shell(state, 'capa',
    '<p class="eyebrow">capa · ' + TENANT.id + '</p>' +
    '<h1>Ola, ' + esc(first(state)) + '.</h1>' +
    '<p class="lead">Escolhe o card. Aluno e livre. As outras portas so abrem se a gestao liberou aquele e-mail.</p>' +
    (demo ? '<p class="hint">Demo neste aparelho: da para abrir os cards e ver o registro na gestao.</p>' : '') +
    '<div class="ws-grid">' + show.map(function (w) {
      return '<button class="ws-card" data-ws="' + w.id + '"><span class="tag">' + esc(w.tag) + '</span><b>' + esc(w.title) + '</b><span>' + esc(w.desc) + '</span></button>';
    }).join('') + '</div>' +
    (canManagePeople(state) ? '<button class="btn ghost" data-go="gestao">Abrir gestao de acessos</button>' : '') +
    '<p class="muted"><button class="btn ghost slim" id="out">encerrar sessao</button></p>'
  );
}

function musicPlaceholder(area) {
  if (!area || (area.id !== 'infantil' && area.id !== 'bebe')) return '';
  return '<div class="music-box">' +
    '<div class="spread"><div><p class="eyebrow">musicas da aula</p><h3>Ouvir em casa tambem faz parte.</h3></div><span class="chip dim">em breve</span></div>' +
    '<p class="muted">Espaco preparado para a Fluir publicar as musicas usadas com as criancas. Depois, pais e responsaveis poderao ouvir ou baixar o material autorizado.</p>' +
    '<div class="music-grid">' +
      '<div class="music-item"><b>Boas-vindas e adaptacao</b><span class="muted">playlist da turma</span><div class="music-actions"><span class="mini-disabled">ouvir</span><span class="mini-disabled">baixar</span></div></div>' +
      '<div class="music-item"><b>Ritmo e movimento</b><span class="muted">musicas de atividade</span><div class="music-actions"><span class="mini-disabled">ouvir</span><span class="mini-disabled">baixar</span></div></div>' +
      '<div class="music-item"><b>Volta a calma</b><span class="muted">encerramento da aula</span><div class="music-actions"><span class="mini-disabled">ouvir</span><span class="mini-disabled">baixar</span></div></div>' +
    '</div></div>';
}

function peopleGrowth(wsId) {
  if (wsId !== 'professor' && wsId !== 'colaborador') return '';
  return '<section class="growth">' +
    '<p class="eyebrow">sessao especial para colaboradores</p>' +
    '<h3>Alinhamento Financeiro + Direitos & Deveres</h3>' +
    '<p class="muted">Uma area permanente para professores e colaboradores organizarem melhor a vida financeira e terem clareza sobre direitos, deveres e boas praticas profissionais.</p>' +
    '<div class="life-grid">' +
      '<article class="life-card"><span class="life-icon">R$</span><b>Alinhamento Financeiro</b><span class="copy">Organizacao financeira, contas, planejamento, reserva, prioridades e caminhos praticos para prosperar com mais clareza.</span><span class="chip dim" style="margin-top:12px">conteudos em breve</span></article>' +
      '<article class="life-card"><span class="life-icon">§</span><b>Direitos & Deveres</b><span class="copy">Orientacoes simples sobre responsabilidades, direitos, deveres, beneficios e boas praticas na relacao profissional.</span><span class="chip dim" style="margin-top:12px">conteudos em breve</span></article>' +
    '</div></section>';
}

function areaModal(area, state, playId) {
  if (!area) return '';
  const lesson = area.lessons.filter(function (c) { return c.id === playId; })[0] || null;
  const visual = AREA_VISUALS[area.id] || null;
  return '<div class="modal" id="areaModal">' +
    '<div class="sheet">' +
      '<div class="spread"><p class="eyebrow">' + area.lessons.length + ' videos · YouTube</p><button class="btn ghost slim" id="closeArea">fechar</button></div>' +
      '<h2>' + esc(area.title) + '</h2>' +
      (visual ? '<img class="area-hero" src="' + esc(visual.img) + '" alt="' + esc(area.title) + '" referrerpolicy="no-referrer"/><p class="muted">' + esc(visual.desc) + '</p>' : '') +
      (isMonitored(state.workspace) ? '<p class="notice">' + NOTICE + '</p>' : '') +
      area.lessons.map(function (c) {
        const on = lesson && lesson.id === c.id;
        return '<button class="vrow' + (on ? ' on' : '') + '" data-play="' + c.id + '"><span>' + esc(c.title) + '</span><span class="chip' + (state.done[c.id] ? ' ok' : '') + '">' + (state.done[c.id] ? 'visto' : c.minutes + ' min') + '</span></button>';
      }).join('') +
      (lesson ? '<div class="player"><iframe src="' + esc(ytEmbed(lesson.yt)) + '" title="' + esc(lesson.title) + '" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div>' +
        (state.done[lesson.id] ? '' : '<button class="btn" data-done="' + lesson.id + '">Marcar concluida</button>') : '<p class="muted">Escolhe um video. Nada carrega antes do clique.</p>') +
      musicPlaceholder(area) +
    '</div></div>';
}

export function viewWorkspace(state, wsId, ctx) {
  const ws = workspaceById(wsId);
  const areas = areasFor(wsId, state);
  const list = coursesFor(wsId, state);
  const ev = eventsFor(state, wsId);
  const files = vaultFor(wsId);
  const p = progressOf(state.done, list);
  const open = areas.filter(function (a) { return a.id === ctx.openArea; })[0] || null;
  let extra = '';
  if (wsId === 'colaborador') {
    extra = '<label>Minha funcao na unidade</label><select id="job">' +
      JOBS.map(function (j) {
        return '<option value="' + j.id + '"' + (jobOf(state) === j.id ? ' selected' : '') + '>' + j.title + '</option>';
      }).join('') + '</select><p class="muted">So aparece a area da funcao, mais a cultura geral.</p>';
  }
  return shell(state, 'ws-' + wsId,
    '<button class="btn ghost slim" data-go="capa">Voltar a capa</button>' +
    '<p class="eyebrow">' + esc(ws.tag) + '</p>' +
    '<h1>' + esc(ws.title) + '</h1>' +
    '<p class="lead">' + esc(ws.desc) + '</p>' +
    (isMonitored(wsId) ? '<p class="notice">' + NOTICE + '</p>' : '') +
    extra +
    '<div class="spread"><h3>Areas</h3><span class="chip">' + p.done + '/' + p.total + '</span></div>' +
    '<div class="bar"><i style="width:' + p.pct + '%"></i></div>' +
    '<div class="areas">' + areas.map(function (a) {
      const seen = a.lessons.filter(function (c) { return state.done[c.id]; }).length;
      const visual = AREA_VISUALS[a.id] || null;
      return '<button class="area" data-area="' + a.id + '">' +
        (visual ? '<span class="area-media"><img src="' + esc(visual.img) + '" alt="' + esc(a.title) + '" loading="lazy" referrerpolicy="no-referrer"/></span>' : '<span class="area-media"></span>') +
        '<span class="area-copy"><span class="tag">area</span><b>' + esc(a.title) + '</b>' +
        '<span class="area-desc">' + esc((visual && visual.desc) || 'Conteudos e aulas desta area.') + '</span>' +
        '<span class="area-count">' + a.lessons.length + ' videos · ' + seen + ' vistos</span></span></button>';
    }).join('') + '</div>' +
    peopleGrowth(wsId) +
    '<h3>Eventos deste mundo</h3>' +
    ev.map(function (e) {
      return '<article class="card spread"><div><b>' + esc(e.title) + '</b><p class="muted">' + esc(e.when) + ' · ' + esc(e.place) + '</p></div>' +
        '<button class="btn ghost slim" data-live="' + e.id + '">Ao vivo</button></article>';
    }).join('') +
    (files.length ? '<h3>Manuais</h3>' + files.map(function (v) {
      return '<div class="line"><span>' + esc(v.title) + '</span><a href="' + esc(v.url) + '" target="_blank" rel="noopener">abrir</a></div>';
    }).join('') : '') +
    areaModal(open, state, ctx.playId)
  );
}


function mergeDirectorySource(ctx) {
  const cloud = (ctx.cloudProfiles || []).filter(function (m) { return m && (m.name || m.email); });
  const seen = {};
  const out = [];
  cloud.forEach(function (m) {
    const key = String(m.email || m.id || '').toLowerCase();
    if (key) seen[key] = 1;
    out.push(m);
  });
  return out;
}

function roleCounts(list) {
  const counts = { aluno: 0, professor: 0, colaborador: 0, franqueado: 0 };
  list.forEach(function (m) {
    if (counts[m.role] !== undefined) counts[m.role] += 1;
  });
  return counts;
}

export function viewRede(state, ctx) {
  if (!canSeeDirectory(state)) return viewCapa(state);
  const units = directoryUnitsFor(state);
  const cloud = mergeDirectorySource(ctx);
  return shell(state, 'rede',
    '<p class="eyebrow">rede fluir · diretorio</p>' +
    '<h1>Pessoas por unidade.</h1>' +
    '<p class="lead">A visao muda conforme o cadastro. CEO ve a rede inteira. Franqueado ve apenas a propria franquia. Professor e colaborador veem somente colegas de equipe e professores da propria unidade — alunos ficam ocultos.</p>' +
    '<div class="unit-grid">' + units.map(function (u) {
      const real = directoryMembersFor(state, u.id, cloud);
      const simulated = directoryMembersFor(state, u.id, null);
      const visible = real.length ? real : simulated;
      const c = roleCounts(visible);
      return '<button class="unit-card" data-unit="' + u.id + '">' +
        '<span class="tag">' + esc(u.city) + '</span><b>' + esc(u.name) + '</b>' +
        '<span>' + visible.length + ' membros visiveis</span>' +
        ((state.role === 'ceo' || isCeoEmail(state.email)) ? '<small>' + c.aluno + ' alunos · ' + (c.professor + c.colaborador) + ' equipe</small>' : '<small>acesso conforme seu perfil</small>') +
      '</button>';
    }).join('') + '</div>' +
    '<p class="hint">' + (cloud.length ? 'Cadastros reais encontrados no app aparecem quando disponiveis; onde ainda nao ha dados, a tela usa membros simulados para demonstracao.' : 'Modo demonstracao: membros simulados ate existirem cadastros reais suficientes no app.') + '</p>'
  );
}

export function viewMembers(state, unitId, ctx) {
  if (!canSeeDirectory(state)) return viewCapa(state);
  const allowedUnits = directoryUnitsFor(state);
  const unit = allowedUnits.filter(function (u) { return u.id === unitId; })[0];
  if (!unit) return viewRede(state, ctx);
  const cloud = mergeDirectorySource(ctx);
  let list = directoryMembersFor(state, unit.id, cloud);
  let demoMode = false;
  if (!list.length) {
    list = directoryMembersFor(state, unit.id, null);
    demoMode = true;
  }
  const counts = roleCounts(list);
  const isCeo = state.role === 'ceo' || isCeoEmail(state.email);
  return shell(state, 'membros-' + unit.id,
    '<button class="btn ghost slim" data-go="rede">Voltar para unidades</button>' +
    '<p class="eyebrow">unidade · ' + esc(unit.city) + '</p>' +
    '<div class="spread"><div><h1>' + esc(unit.name) + '</h1><p class="lead">' +
      (isCeo ? 'Visao completa da unidade: alunos, professores, colaboradores e franqueado.' : (state.role === 'franqueado' ? 'Visao da sua franquia: alunos e equipe desta unidade.' : 'Sua equipe: professores e colaboradores desta unidade. Alunos nao aparecem para este perfil.')) +
    '</p></div><span class="chip' + (demoMode ? ' dim' : ' ok') + '">' + (demoMode ? 'simulacao' : 'cadastros reais') + '</span></div>' +
    '<div class="member-stats">' +
      (isCeo || state.role === 'franqueado' ? '<div><b>' + counts.aluno + '</b><span>alunos</span></div>' : '') +
      '<div><b>' + counts.professor + '</b><span>professores</span></div>' +
      '<div><b>' + counts.colaborador + '</b><span>colaboradores</span></div>' +
      (isCeo || state.role === 'franqueado' ? '<div><b>' + counts.franqueado + '</b><span>franqueados</span></div>' : '') +
    '</div>' +
    '<article class="card"><div class="spread"><h3>Membros visiveis</h3><span class="chip">' + list.length + '</span></div>' +
      (list.length ? list.map(function (m) {
        return '<div class="member-row"><span class="avatar">' + esc((m.name || m.email || '?').slice(0,1).toUpperCase()) + '</span><span class="member-main"><b>' + esc(m.name || 'Sem nome') + '</b><small>' + esc(directoryRoleLabel(m.role)) + (m.job ? ' · ' + esc(m.job) : '') + '</small></span><span class="member-side">' + (m.demo ? 'demo' : 'cadastrado') + '</span></div>';
      }).join('') : '<p class="muted">Nenhum membro visivel para este perfil.</p>') +
    '</article>'
  );
}

export function viewEventos(state) {
  const list = eventsFor(state, state.workspace);
  return shell(state, 'eventos',
    '<p class="eyebrow">salas</p>' +
    '<h1>Eventos da Fluir.</h1>' +
    '<p class="lead">Sala para todos, sala de aluno, equipe, franqueado e council.</p>' +
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

function mergedLog(state, cloud) {
  const rows = (state.accessLog || []).concat(cloud || []);
  const seen = {};
  const out = [];
  rows.forEach(function (r) {
    const k = (r.at || '') + '|' + (r.email || r.name || '') + '|' + (r.what || '');
    if (seen[k]) return;
    seen[k] = 1;
    out.push(r);
  });
  out.sort(function (a, b) { return String(b.at).localeCompare(String(a.at)); });
  return out.slice(0, 20);
}

export function viewGestao(state, ctx) {
  if (!canManagePeople(state)) return viewCapa(state);
  const rows = Object.keys(state.grants || {});
  const log = mergedLog(state, ctx.cloudLog);
  return shell(state, 'gestao',
    '<p class="eyebrow">gestao de acessos</p>' +
    '<h1>Quem entra, quando e onde.</h1>' +
    '<p class="lead">Aluno nao e monitorado. Professor, colaborador, franqueado e socio deixam horario, o que abriram e local se a pessoa permitir.</p>' +
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
    '<article class="card"><h3>Acessos recentes</h3>' +
    '<p class="muted">So o ultimo passo de cada pessoa. Sem arquivo de video, sem historico pesado.</p>' +
    (log.length ? log.map(function (r) {
      const who = r.email || r.name || 'local';
      return '<div class="line"><span>' + esc(whenLabel(r.at)) + ' · ' + esc(who) + '<br><span class="muted">' + esc(r.what || r.ws) + '</span></span><span class="muted">' + esc(r.loc || 'sem local') + '</span></div>';
    }).join('') : '<p class="muted">Nenhum acesso restrito ainda. Abre Professor, Colaborador ou Franqueado para registrar.</p>') +
    '</article>' +
    '<article class="card"><h3>O que cada card ve</h3>' +
    '<div class="line"><span>Aluno</span><span class="muted">areas livres, sem monitoramento</span></div>' +
    '<div class="line"><span>Professor</span><span class="muted">metodologia + areas do aluno</span></div>' +
    '<div class="line"><span>Colaborador</span><span class="muted">so a funcao + cultura</span></div>' +
    '<div class="line"><span>Franqueado</span><span class="muted">cultura e vender franquia</span></div>' +
    '<div class="line"><span>Socio</span><span class="muted">rede, grants e acessos</span></div>' +
    '</article>'
  );
}

export function render(root, ctx) {
  const state = ctx.store.get();
  const route = ctx.route;
  if (!state.signed && route !== 'gate') ctx.route = 'gate';
  if (!state.signed) { root.innerHTML = viewGate(); bind(ctx); return; }
  if (route === 'capa' || route === 'inicio') root.innerHTML = viewCapa(state);
  else if (route.indexOf('ws-') === 0) root.innerHTML = viewWorkspace(state, route.slice(3), ctx);
  else if (route === 'rede') root.innerHTML = viewRede(state, ctx);
  else if (route.indexOf('membros-') === 0) root.innerHTML = viewMembers(state, route.slice(8), ctx);
  else if (route === 'eventos') root.innerHTML = viewEventos(state);
  else if (route === 'live') root.innerHTML = viewLive(state, ctx);
  else if (route === 'gestao') root.innerHTML = viewGestao(state, ctx);
  else root.innerHTML = viewCapa(state);
  bind(ctx);
}

function bind(ctx) {
  const store = ctx.store;
  document.querySelectorAll('[data-go]').forEach(function (b) {
    b.onclick = function () { ctx.go(b.getAttribute('data-go')); };
  });
  document.querySelectorAll('[data-unit]').forEach(function (b) {
    b.onclick = function () {
      const id = b.getAttribute('data-unit');
      ctx.go('membros-' + id);
    };
  });
  document.querySelectorAll('[data-ws]').forEach(function (b) {
    b.onclick = function () {
      const id = b.getAttribute('data-ws');
      const st = store.get();
      if (!canEnter(st, id)) { toast('Esta area precisa de liberacao na gestao'); return; }
      store.patch({ workspace: id, role: st.role || id });
      if (ctx.note) ctx.note(id, 'entrou em ' + workspaceById(id).title);
      ctx.openArea = null;
      ctx.playId = null;
      ctx.go('ws-' + id);
    };
  });
  document.querySelectorAll('[data-area]').forEach(function (b) {
    b.onclick = function () {
      const id = b.getAttribute('data-area');
      const st = store.get();
      ctx.openArea = id;
      ctx.playId = null;
      if (ctx.note && isMonitored(st.workspace)) ctx.note(st.workspace, 'abriu area ' + id);
      ctx.draw();
    };
  });
  document.querySelectorAll('[data-play]').forEach(function (b) {
    b.onclick = function () {
      const id = b.getAttribute('data-play');
      const st = store.get();
      ctx.playId = id;
      if (ctx.note && isMonitored(st.workspace)) ctx.note(st.workspace, 'abriu video ' + id);
      ctx.draw();
    };
  });
  const close = document.getElementById('closeArea');
  if (close) close.onclick = function () { ctx.openArea = null; ctx.playId = null; ctx.draw(); };
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
  if (job) job.onchange = function () { store.patch({ job: job.value }); ctx.openArea = null; ctx.draw(); };
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
