/** Domain — Hotmart-like catalog + policy. No DOM. */
export const TENANT = {
  id: 'fluir',
  name: 'Fluir Academy',
  sector: 'franchise-lms',
  version: '0.3.0'
};

export const UNITS = [
  { id: 'pituba', name: 'Pituba', city: 'Salvador' },
  { id: 'rio-vermelho', name: 'Rio Vermelho', city: 'Salvador' },
  { id: 'lauro', name: 'Lauro de Freitas', city: 'RMS' }
];

export const WORKSPACES = [
  { id: 'aluno', title: 'Aluno', tag: 'Eu sou aluno', desc: 'Pilates, ginastica, fisio e infantil. Sem treinamento de equipe.' },
  { id: 'professor', title: 'Professor', tag: 'Eu sou professor', desc: 'Metodologia e as aulas que voce ministra para o aluno.' },
  { id: 'colaborador', title: 'Colaborador', tag: 'Eu sou da equipe', desc: 'Recepcao, piscina, manobrista, vendas, RH e gestao.' },
  { id: 'franqueado', title: 'Franqueado', tag: 'Eu sou franqueado', desc: 'Cultura, operacao e venda de franquia.' },
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

export const ALUNO_TRACKS = [
  { id: 'pilates', title: 'Pilates' },
  { id: 'ginastica', title: 'Ginastica' },
  { id: 'fisio', title: 'Fisioterapia' },
  { id: 'infantil', title: 'Aluno crianca' }
];

const YT = 'https://www.youtube.com/embed/jNQXAC9IVRw';

export const COURSES = [
  { id: 'a-pil-1', ws: ['aluno', 'professor'], track: 'pilates', title: 'Pilates — respiracao e core', minutes: 12, url: YT },
  { id: 'a-gin-1', ws: ['aluno', 'professor'], track: 'ginastica', title: 'Ginastica — mobilidade em casa', minutes: 10, url: YT },
  { id: 'a-fis-1', ws: ['aluno', 'professor'], track: 'fisio', title: 'Fisio aquatica — alinhamento', minutes: 11, url: YT },
  { id: 'a-inf-1', ws: ['aluno', 'professor'], track: 'infantil', title: 'Natacao infantil — aula simples', minutes: 8, url: YT },
  { id: 'p-met-1', ws: ['professor', 'ceo'], track: 'metodologia', title: 'Metodo Lucas Oliveira — base', minutes: 14, url: YT },
  { id: 'c-all-1', ws: ['colaborador', 'franqueado', 'ceo'], track: 'todos', job: 'todos', title: 'Cultura Fluir para toda a equipe', minutes: 9, url: YT },
  { id: 'c-rec-1', ws: ['colaborador', 'ceo'], track: 'recepcao', job: 'recepcao', title: 'Rapport e atendimento na recepcao', minutes: 11, url: YT },
  { id: 'c-rec-2', ws: ['colaborador', 'ceo'], track: 'recepcao', job: 'recepcao', title: 'Tecnicas de venda no balcao', minutes: 10, url: YT },
  { id: 'c-pis-1', ws: ['colaborador', 'ceo'], track: 'piscineiro', job: 'piscineiro', title: 'Quimica da agua e checklist da raia', minutes: 13, url: YT },
  { id: 'c-man-1', ws: ['colaborador', 'ceo'], track: 'manobrista', job: 'manobrista', title: 'Fluxo do estacionamento e acolhimento', minutes: 7, url: YT },
  { id: 'c-ven-1', ws: ['colaborador', 'franqueado', 'ceo'], track: 'vendas', job: 'vendas', title: 'Script de conversao da unidade', minutes: 12, url: YT },
  { id: 'c-ges-1', ws: ['colaborador', 'franqueado', 'ceo'], track: 'gestor', job: 'gestor', title: 'Gestao de equipe na ponta', minutes: 15, url: YT },
  { id: 'c-rh-1', ws: ['colaborador', 'ceo'], track: 'rh', job: 'rh', title: 'RH: contratacao e cultura', minutes: 10, url: YT },
  { id: 'f-cul-1', ws: ['franqueado', 'ceo'], track: 'cultura', title: 'Onboarding do franqueado', minutes: 16, url: YT },
  { id: 'f-ven-1', ws: ['franqueado', 'ceo'], track: 'vendas-franquia', title: 'Como vender a franquia Fluir', minutes: 14, url: YT },
  { id: 'e-ges-1', ws: ['ceo'], track: 'rede', title: 'Visao da rede e DRE', minutes: 12, url: YT }
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

export function workspaceById(id) {
  return WORKSPACES.filter(function (w) { return w.id === id; })[0] || WORKSPACES[0];
}

export function unitById(id) {
  return UNITS.filter(function (u) { return u.id === id; })[0] || UNITS[0];
}

export function grantedWorkspaces(profile) {
  if (!profile) return [];
  if (profile.role === 'ceo' || isCeoEmail(profile.email)) return WORKSPACES.map(function (w) { return w.id; });
  const extra = (profile.grants && profile.grants[normEmail(profile.email)]) || null;
  if (extra && extra.workspaces && extra.workspaces.length) return extra.workspaces;
  if (profile.role) return [profile.role];
  return [];
}

export function jobOf(profile) {
  const extra = profile.grants && profile.grants[normEmail(profile.email)];
  return (extra && extra.job) || profile.job || 'recepcao';
}

export function canManagePeople(profile) {
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
    if (ws === 'colaborador' && c.job && c.job !== 'todos' && c.job !== job && profile.role !== 'ceo') return false;
    return true;
  });
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
  return VAULT.filter(function (v) { return v.ws.indexOf(ws) >= 0 || (v.ws.indexOf('ceo') >= 0 && ws === 'ceo'); });
}

export function normEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function progressOf(done, list) {
  const n = list.filter(function (c) { return done[c.id]; }).length;
  return { done: n, total: list.length, pct: list.length ? Math.round(n * 100 / list.length) : 0 };
}
