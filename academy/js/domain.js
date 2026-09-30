/** Domain - Hotmart-like catalog + policy. No DOM. Videos are YouTube ids. Storage off. */
export const TENANT = {
  id: 'fluir',
  name: 'Fluir Academy',
  sector: 'franchise-lms',
  version: '0.6.0'
};

export const UNITS = [
  { id: 'pituba', name: 'Pituba', city: 'Salvador' },
  { id: 'pituba-ville', name: 'Pituba Ville', city: 'Salvador' },
  { id: 'vilas', name: 'Vilas', city: 'Lauro de Freitas' },
  { id: 'stella', name: 'Stella', city: 'Salvador' },
  { id: 'colina', name: 'Colina', city: 'Salvador' },
  { id: 'busca-vida', name: 'Busca Vida', city: 'Camaçari' },
  { id: 'caminho-das-arvores', name: 'Caminho das Árvores', city: 'Salvador' },
  { id: 'aquarios', name: 'Aquários', city: 'Salvador' },
  { id: 'rio-vermelho', name: 'Rio Vermelho', city: 'Salvador' },
  { id: 'paralela', name: 'Paralela', city: 'Salvador' },
  { id: 'patamares', name: 'Patamares', city: 'Salvador' },
  { id: 'litoral-norte', name: 'Litoral Norte', city: 'Bahia' }
];


const DEMO_FIRST = ['Ana','Bruno','Camila','Daniel','Elisa','Felipe','Gabriela','Henrique','Isabela','Joao','Karina','Lucas','Marina','Nicolas','Olivia','Paulo','Rafaela','Samuel','Tatiana','Vinicius'];
const DEMO_LAST = ['Almeida','Barbosa','Costa','Dias','Ferreira','Gomes','Lima','Mendes','Nascimento','Oliveira','Pereira','Rocha','Santos','Silva','Souza','Teixeira'];

export const DEMO_MEMBERS = [];
UNITS.forEach(function (unit, unitIndex) {
  const roles = ['aluno','aluno','aluno','professor','professor','colaborador','colaborador','franqueado'];
  const jobs = ['', '', '', 'Natacao', 'Pilates', 'Recepcao', 'Gestao', 'Franqueado'];
  roles.forEach(function (role, i) {
    const first = DEMO_FIRST[(unitIndex * 3 + i) % DEMO_FIRST.length];
    const last = DEMO_LAST[(unitIndex * 5 + i * 2) % DEMO_LAST.length];
    DEMO_MEMBERS.push({
      id: 'demo-' + unit.id + '-' + (i + 1),
      name: first + ' ' + last,
      email: first.toLowerCase() + '.' + last.toLowerCase() + '@demo.fluir',
      role: role,
      unitId: unit.id,
      job: jobs[i],
      status: 'ativo',
      demo: true
    });
  });
});

function profileRole(profile) {
  if (!profile) return '';
  if (isCeoEmail(profile.email)) return 'ceo';
  return profile.role || profile.workspace || '';
}

export function directoryUnitsFor(profile) {
  const role = profileRole(profile);
  if (role === 'ceo') return UNITS.slice();
  if (role === 'franqueado' || role === 'colaborador' || role === 'professor') {
    return UNITS.filter(function (u) { return u.id === (profile.unitId || 'pituba'); });
  }
  return [];
}

export function canSeeDirectory(profile) {
  return directoryUnitsFor(profile).length > 0;
}

export function directoryMembersFor(profile, unitId, source) {
  const role = profileRole(profile);
  const ownUnit = profile && profile.unitId ? profile.unitId : 'pituba';
  if (role !== 'ceo' && unitId !== ownUnit) return [];
  let list = (source && source.length ? source : DEMO_MEMBERS).filter(function (m) {
    return (m.unitId || 'pituba') === unitId;
  });
  if (role === 'ceo' || role === 'franqueado') return list;
  if (role === 'colaborador' || role === 'professor') {
    return list.filter(function (m) { return m.role === 'colaborador' || m.role === 'professor'; });
  }
  return [];
}

export function directoryRoleLabel(role) {
  const labels = {
    aluno: 'Aluno',
    professor: 'Professor',
    colaborador: 'Colaborador',
    franqueado: 'Franqueado',
    ceo: 'CEO / socio'
  };
  return labels[role] || role || 'Membro';
}

export const WORKSPACES = [
  { id: 'aluno', title: 'Aluno', tag: 'Eu sou aluno', desc: 'Areas livres com aulas de Pilates, hidro, natacao, infantil, bebe e gestantes.' },
  { id: 'professor', title: 'Professor', tag: 'Eu sou professor', desc: 'Metodologia e as areas que voce ministra.' },
  { id: 'colaborador', title: 'Colaborador', tag: 'Eu sou da equipe', desc: 'Cursos fechados da funcao. Acesso monitorado.' },
  { id: 'franqueado', title: 'Franqueado', tag: 'Eu sou franqueado', desc: 'Cultura, operacao e venda de franquia. Acesso monitorado.' },
  { id: 'ceo', title: 'CEO / socio', tag: 'Eu sou da matriz', desc: 'Rede, acessos, eventos e o que cada papel ve.' }
];

export const JOBS = [
  { id: 'recepcao', title: 'Recepcao' },
  { id: 'piscineiro', title: 'Piscineiro' },
  { id: 'manobrista', title: 'Manobrista' },
  { id: 'vendas', title: 'Vendas' },
  { id: 'gestor', title: 'Gestor / gerente' },
  { id: 'rh', title: 'RH' }
];

export const NOTICE = 'Este acesso e restrito a voce. Nao compartilhe com ninguem. Seu acesso esta sendo monitorado.';

const YT = 'jNQXAC9IVRw';

export function ytEmbed(id) {
  return 'https://www.youtube-nocookie.com/embed/' + (id || YT) + '?rel=0&modestbranding=1';
}

const TRACK_TITLE = {
  pilates: 'Pilates',
  ginastica: 'Hidroginastica',
  fisio: 'Hidroterapia',
  natacao: 'Natacao adulto',
  infantil: 'Natacao infantil',
  bebe: 'Natacao bebe',
  gestantes: 'Programa para gestantes',
  metodologia: 'Metodologia',
  todos: 'Cultura da rede',
  recepcao: 'Recepcao',
  piscineiro: 'Piscina',
  manobrista: 'Estacionamento',
  vendas: 'Vendas',
  gestor: 'Gestao',
  rh: 'RH',
  cultura: 'Cultura do franqueado',
  'vendas-franquia': 'Vender a franquia',
  rede: 'Rede'
};

export function trackTitle(id) {
  return TRACK_TITLE[id] || id;
}

function lesson(id, ws, track, title, minutes, job) {
  const row = { id: id, ws: ws, track: track, title: title, minutes: minutes, yt: YT };
  if (job) row.job = job;
  return row;
}

export const COURSES = [
  lesson('a-pil-1', ['aluno', 'professor'], 'pilates', 'Respiracao e core', 12),
  lesson('a-pil-2', ['aluno', 'professor'], 'pilates', 'Mobilidade de coluna', 9),
  lesson('a-pil-3', ['aluno', 'professor'], 'pilates', 'Forca de centro em casa', 11),
  lesson('a-pil-4', ['aluno', 'professor'], 'pilates', 'Sequencia curta de 15 minutos', 15),
  lesson('a-gin-1', ['aluno', 'professor'], 'ginastica', 'Aquecimento e mobilidade na agua', 10),
  lesson('a-gin-2', ['aluno', 'professor'], 'ginastica', 'Forca e resistencia com baixo impacto', 12),
  lesson('a-gin-3', ['aluno', 'professor'], 'ginastica', 'Volta a calma e alongamento', 8),
  lesson('a-fis-1', ['aluno', 'professor'], 'fisio', 'Alinhamento e mobilidade na agua', 11),
  lesson('a-fis-2', ['aluno', 'professor'], 'fisio', 'Respiracao e cuidado da lombar', 9),
  lesson('a-nat-1', ['aluno', 'professor'], 'natacao', 'Respiracao na borda', 8),
  lesson('a-nat-2', ['aluno', 'professor'], 'natacao', 'Pernada e alinhamento', 10),
  lesson('a-nat-3', ['aluno', 'professor'], 'natacao', 'Treino curto de resistencia', 12),
  lesson('a-inf-1', ['aluno', 'professor'], 'infantil', 'Aula simples na raia', 8),
  lesson('a-inf-2', ['aluno', 'professor'], 'infantil', 'Jogo de adaptacao', 7),
  lesson('a-beb-1', ['aluno', 'professor'], 'bebe', 'Adaptacao do bebe com acompanhante', 7),
  lesson('a-beb-2', ['aluno', 'professor'], 'bebe', 'Ritmo, contato e seguranca na agua', 8),
  lesson('a-ges-1', ['aluno', 'professor'], 'gestantes', 'Mobilidade segura na gestacao', 10),
  lesson('a-ges-2', ['aluno', 'professor'], 'gestantes', 'Respiracao e exercicios na agua', 9),
  lesson('p-met-1', ['professor', 'ceo'], 'metodologia', 'Metodo Lucas Oliveira - base', 14),
  lesson('p-met-2', ['professor', 'ceo'], 'metodologia', 'Como conduzir a turma', 10),
  lesson('c-all-1', ['colaborador', 'franqueado', 'ceo'], 'todos', 'Cultura Fluir para toda a equipe', 9, 'todos'),
  lesson('c-rec-1', ['colaborador', 'ceo'], 'recepcao', 'Rapport e atendimento', 11, 'recepcao'),
  lesson('c-rec-2', ['colaborador', 'ceo'], 'recepcao', 'Tecnicas de venda no balcao', 10, 'recepcao'),
  lesson('c-pis-1', ['colaborador', 'ceo'], 'piscineiro', 'Quimica da agua', 13, 'piscineiro'),
  lesson('c-pis-2', ['colaborador', 'ceo'], 'piscineiro', 'Checklist da raia', 8, 'piscineiro'),
  lesson('c-man-1', ['colaborador', 'ceo'], 'manobrista', 'Fluxo do estacionamento', 7, 'manobrista'),
  lesson('c-ven-1', ['colaborador', 'franqueado', 'ceo'], 'vendas', 'Script de conversao da unidade', 12, 'vendas'),
  lesson('c-ges-1', ['colaborador', 'franqueado', 'ceo'], 'gestor', 'Gestao de equipe na ponta', 15, 'gestor'),
  lesson('c-rh-1', ['colaborador', 'ceo'], 'rh', 'Contratacao e cultura', 10, 'rh'),
  lesson('f-cul-1', ['franqueado', 'ceo'], 'cultura', 'Onboarding do franqueado', 16),
  lesson('f-cul-2', ['franqueado', 'ceo'], 'cultura', 'Padrao da unidade', 9),
  lesson('f-ven-1', ['franqueado', 'ceo'], 'vendas-franquia', 'Como vender a franquia Fluir', 14),
  lesson('e-ges-1', ['ceo'], 'rede', 'Visao da rede e DRE', 12)
];

export const EVENTS = [
  { id: 'ev-todos', title: 'Encontro da rede', when: 'Todo mes', audience: ['all'], liveRoom: 'fluir-demo', place: 'Digital + unidades' },
  { id: 'ev-aluno', title: 'Festival dos alunos', when: 'Sabado', audience: ['aluno', 'professor', 'ceo'], liveRoom: 'fluir-alunos', place: 'Pituba' },
  { id: 'ev-colab', title: 'Treinamento de equipe', when: 'Segunda 7h', audience: ['colaborador', 'ceo'], liveRoom: 'fluir-equipe', place: 'Cada unidade' },
  { id: 'ev-franq', title: 'Imersao de franqueados', when: 'Trimestral', audience: ['franqueado', 'ceo'], liveRoom: 'fluir-franquia', place: 'Matriz' },
  { id: 'ev-ceo', title: 'Council da matriz', when: 'Sob convite', audience: ['ceo'], liveRoom: 'fluir-council', place: 'Fechado' }
];

export const VAULT = [
  { id: 'onboard', title: 'Manual de Onboarding Geral v2.1', ws: ['franqueado', 'ceo', 'colaborador'], url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'marca', title: 'Identidade visual e contratos', ws: ['franqueado', 'ceo'], url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
];

export const CEO_EMAILS = [
  'yanfili.simon@gmail.com',
  'plmacramo@gmail.com',
  'sendatantrica@gmail.com',
  'opatricksimon@gmail.com'
];

export function isCeoEmail(email) {
  return CEO_EMAILS.indexOf(String(email || '').toLowerCase()) >= 0;
}

export function isMonitored(wsId) {
  return wsId && wsId !== 'aluno';
}

export function workspaceById(id) {
  return WORKSPACES.filter(function (w) { return w.id === id; })[0] || WORKSPACES[0];
}

export function unitById(id) {
  return UNITS.filter(function (u) { return u.id === id; })[0] || UNITS[0];
}

export function normEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function grantedWorkspaces(profile) {
  if (!profile) return [];
  if (profile.role === 'ceo' || isCeoEmail(profile.email)) return WORKSPACES.map(function (w) { return w.id; });
  const extra = (profile.grants && profile.grants[normEmail(profile.email)]) || null;
  if (extra && extra.workspaces && extra.workspaces.length) return extra.workspaces.slice();
  if (profile.role) return [profile.role];
  return [];
}

export function canEnter(profile, wsId) {
  if (!wsId) return false;
  if (wsId === 'aluno') return true;
  if (!profile || !profile.email) return true;
  if (profile.role === 'ceo' || isCeoEmail(profile.email)) return true;
  return grantedWorkspaces(profile).indexOf(wsId) >= 0;
}

export function jobOf(profile) {
  const extra = profile.grants && profile.grants[normEmail(profile.email)];
  return (extra && extra.job) || profile.job || 'recepcao';
}

export function canManagePeople(profile) {
  if (!profile) return false;
  if (!profile.email) return true;
  return profile.role === 'ceo' || isCeoEmail(profile.email) || !!(profile.grants && profile.grants[normEmail(profile.email)] && profile.grants[normEmail(profile.email)].admin);
}

export function canManageEvents(profile) {
  if (canManagePeople(profile)) return true;
  const extra = profile.grants && profile.grants[normEmail(profile.email)];
  return !!(extra && extra.eventAdmin);
}

export function coursesFor(ws, profile) {
  const job = jobOf(profile);
  return COURSES.filter(function (c) {
    if (c.ws.indexOf(ws) < 0 && c.ws.indexOf('all') < 0) return false;
    if (ws === 'colaborador' && c.job && c.job !== 'todos' && c.job !== job && profile.role !== 'ceo' && !isCeoEmail(profile.email)) return false;
    return true;
  });
}

export function areasFor(ws, profile) {
  const list = coursesFor(ws, profile);
  const map = {};
  const order = [];
  list.forEach(function (c) {
    const key = c.track || 'geral';
    if (!map[key]) {
      map[key] = { id: key, title: trackTitle(key), lessons: [] };
      order.push(key);
    }
    map[key].lessons.push(c);
  });
  return order.map(function (k) { return map[k]; });
}

export function eventsFor(profile, ws) {
  const rooms = grantedWorkspaces(profile);
  return EVENTS.filter(function (e) {
    if (e.audience.indexOf('all') >= 0) return true;
    if (ws && e.audience.indexOf(ws) >= 0) return true;
    return e.audience.some(function (a) { return rooms.indexOf(a) >= 0; });
  });
}

export function vaultFor(ws) {
  return VAULT.filter(function (v) { return v.ws.indexOf(ws) >= 0; });
}

export function progressOf(done, list) {
  const n = list.filter(function (c) { return done[c.id]; }).length;
  return { done: n, total: list.length, pct: list.length ? Math.round(n * 100 / list.length) : 0 };
}

export function whenLabel(iso) {
  try {
    return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return String(iso || '');
  }
}
