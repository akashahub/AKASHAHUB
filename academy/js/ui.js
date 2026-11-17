import {
  TENANT, UNITS, WORKSPACES, JOBS, EVENTS, NOTICE,
  workspaceById, unitById, grantedWorkspaces, jobOf,
  canManagePeople, canEnter, isMonitored, areasFor, coursesFor, eventsFor, vaultFor,
  progressOf, normEmail, ytEmbed, whenLabel, isCeoEmail,
  canSeeDirectory, directoryUnitsFor, directoryMembersFor, directoryRoleLabel
} from './domain.js?v=20260929e';


const ACADEMY_MARK = 'data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='28' fill='%230d2a30'/%3E%3Ccircle cx='60' cy='60' r='35' fill='none' stroke='%233ee0c8' stroke-width='4'/%3E%3Cpath d='M42 74 60 36 78 74' fill='none' stroke='%239ff3e6' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E';

const AREA_VISUALS = {
  pilates: {
    img: 'data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%230d2a30'/%3E%3Cstop offset='1' stop-color='%23041014'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Ccircle cx='320' cy='180' r='94' fill='none' stroke='%233ee0c8' stroke-opacity='.55' stroke-width='2'/%3E%3Ccircle cx='320' cy='180' r='62' fill='none' stroke='%239ff3e6' stroke-opacity='.35' stroke-width='2'/%3E%3C/svg%3E',
    desc: 'Forca, mobilidade, postura e sequencias para praticar com orientacao.'
  },
  ginastica: {
    img: 'data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%230d2a30'/%3E%3Cstop offset='1' stop-color='%23041014'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Ccircle cx='320' cy='180' r='94' fill='none' stroke='%233ee0c8' stroke-opacity='.55' stroke-width='2'/%3E%3Ccircle cx='320' cy='180' r='62' fill='none' stroke='%239ff3e6' stroke-opacity='.35' stroke-width='2'/%3E%3C/svg%3E',
    desc: 'Aulas aquáticas de condicionamento, forca e mobilidade com baixo impacto.'
  },
  fisio: {
    img: 'data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%230d2a30'/%3E%3Cstop offset='1' stop-color='%23041014'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Ccircle cx='320' cy='180' r='94' fill='none' stroke='%233ee0c8' stroke-opacity='.55' stroke-width='2'/%3E%3Ccircle cx='320' cy='180' r='62' fill='none' stroke='%239ff3e6' stroke-opacity='.35' stroke-width='2'/%3E%3C/svg%3E',
    desc: 'Conteudos de fisioterapia aquatica, mobilidade e cuidado funcional.'
  },
  natacao: {
    img: 'data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%230d2a30'/%3E%3Cstop offset='1' stop-color='%23041014'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Ccircle cx='320' cy='180' r='94' fill='none' stroke='%233ee0c8' stroke-opacity='.55' stroke-width='2'/%3E%3Ccircle cx='320' cy='180' r='62' fill='none' stroke='%239ff3e6' stroke-opacity='.35' stroke-width='2'/%3E%3C/svg%3E',
    desc: 'Tecnica, respiracao, resistencia e evolucao na natacao para adultos.'
  },
  infantil: {
    img: 'data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%230d2a30'/%3E%3Cstop offset='1' stop-color='%23041014'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Ccircle cx='320' cy='180' r='94' fill='none' stroke='%233ee0c8' stroke-opacity='.55' stroke-width='2'/%3E%3Ccircle cx='320' cy='180' r='62' fill='none' stroke='%239ff3e6' stroke-opacity='.35' stroke-width='2'/%3E%3C/svg%3E',
    desc: 'Aprendizado, seguranca aquatica, jogos e desenvolvimento infantil.'
  },
  bebe: {
    img: 'data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%230d2a30'/%3E%3Cstop offset='1' stop-color='%23041014'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Ccircle cx='320' cy='180' r='94' fill='none' stroke='%233ee0c8' stroke-opacity='.55' stroke-width='2'/%3E%3Ccircle cx='320' cy='180' r='62' fill='none' stroke='%239ff3e6' stroke-opacity='.35' stroke-width='2'/%3E%3C/svg%3E',
    desc: 'Adaptacao, vinculo, ritmo e seguranca para bebe e acompanhante.'
  },
  gestantes: {
    img: 'data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%230d2a30'/%3E%3Cstop offset='1' stop-color='%23041014'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Ccircle cx='320' cy='180' r='94' fill='none' stroke='%233ee0c8' stroke-opacity='.55' stroke-width='2'/%3E%3Ccircle cx='320' cy='180' r='62' fill='none' stroke='%239ff3e6' stroke-opacity='.35' stroke-width='2'/%3E%3C/svg%3E',
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
    '<img class="gate-logo" src="' + ACADEMY_MARK + '" alt="Marca da academia"/>' +
    '<p class="eyebrow">' + TENANT.name + '</p>' +
    '<h1>Bem-vindo à Academia.</h1>' +
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
      '<div class="logo"><img src="' + ACADEMY_MARK + '" alt="Marca da academia"/><div><b>Fluir</b><small>Academy</small></div></div>' +
      '<button class="nav-i' + (route === 'capa' ? ' on' : '') + '" data-go="capa">Capa</button>' +
      (state.workspace ? '<button class="nav-i' + (route.indexOf('ws-') === 0 ? ' on' : '') + '" data-go="ws-' + state.workspace + '">' + esc(ws.title) + '</button>' : '') +
      '<button class="nav-i' + (route === 'eventos' ? ' on' : '') + '" data-go="eventos">Eventos</button>' +
      (admin ? '<button class="nav-i' + (route === 'gestao' ? ' on' : '') + '" data-go="gestao">Gestao</button>' : '') +
      (canSeeDirectory(state) ? '<div class="rail-foot"><span class="muted" style="width:100%;margin-bottom:4px">Unidades</span>' +
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
    (canSeeDirectory(state) ? '<button class="btn" data-go="rede">Abrir unidades e membros</button>' : '') +
    (canManagePeople(state) ? '<button class="btn ghost" data-go="gestao">Abrir gestao de acessos</button>' : '') +
    '<p class="muted"><button class="btn ghost slim" id="out">encerrar sessao</button></p>'
  );
}

function musicPlaceholder(area) {
  if (!area || (area.id !== 'infantil' && area.id !== 'bebe')) return '';
  return '<div class="music-box">' +
    '<div class="spread"><div><p class="eyebrow">musicas da aula</p><h3>Ouvir em casa tambem faz parte.</h3></div><span class="chip dim">em breve</span></div>' +
    '<p class="muted">Espaço preparado para a academia publicar as musicas usadas com as criancas. Depois, pais e responsaveis poderao ouvir ou baixar o material autorizado.</p>' +
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
    '<p class="eyebrow">academia · diretório</p>' +
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
    '<h1>Eventos da academia.</h1>' +
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
      '<label>E-mail</label><input id="g-mail" placeholder="pessoa@exemplo.com"/>' +
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
