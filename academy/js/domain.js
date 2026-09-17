/** Domain — rules only. No DOM, no Firebase, no LiveKit. */
export const TENANT = {
  id: 'fluir',
  name: 'Fluir Academy',
  sector: 'franchise-lms',
  version: '0.2.0'
};

export const UNITS = [
  { id: 'pituba', name: 'Pituba', city: 'Salvador' },
  { id: 'rio-vermelho', name: 'Rio Vermelho', city: 'Salvador' },
  { id: 'lauro', name: 'Lauro de Freitas', city: 'RMS' }
];

export const ROLES = [
  { id: 'matriz', title: 'Matriz', desc: 'Rede, presenca, cofre, DRE.' },
  { id: 'franqueado', title: 'Franqueado', desc: 'Unidade, equipe e auditoria.' },
  { id: 'staff', title: 'Staff', desc: 'Trilha, quiz e QR do evento.' },
  { id: 'aluno', title: 'Aluno', desc: 'Aulas em casa e replay.' },
  { id: 'parceiro', title: 'Parceiro', desc: 'Conteudo tecnico B2B.' }
];

export const ACTION = {
  VIEW_HUB: 'view.hub',
  VIEW_TRACKS: 'view.tracks',
  VIEW_VAULT: 'view.vault',
  VIEW_DRE: 'view.dre',
  WRITE_DRE: 'write.dre',
  VIEW_ATTENDANCE: 'view.attendance',
  SCAN_PRESENCE: 'scan.presence',
  GO_LIVE: 'live.join',
  SWITCH_UNIT: 'unit.switch',
  MANAGE_ROLES: 'roles.manage'
};

const POLICY = {
  matriz: Object.values(ACTION),
  franqueado: [
    ACTION.VIEW_HUB, ACTION.VIEW_TRACKS, ACTION.VIEW_VAULT, ACTION.VIEW_DRE,
    ACTION.WRITE_DRE, ACTION.VIEW_ATTENDANCE, ACTION.SCAN_PRESENCE,
    ACTION.GO_LIVE, ACTION.SWITCH_UNIT
  ],
  staff: [ACTION.VIEW_HUB, ACTION.VIEW_TRACKS, ACTION.SCAN_PRESENCE, ACTION.GO_LIVE],
  aluno: [ACTION.VIEW_HUB, ACTION.VIEW_TRACKS, ACTION.GO_LIVE],
  parceiro: [ACTION.VIEW_HUB, ACTION.VIEW_TRACKS]
};

export const TRACKS = [
  {
    id: 'piscineiros', group: 'Piscineiros', title: 'Tratamento de piscinas',
    audience: ['staff', 'franqueado', 'matriz'],
    lessons: [
      { id: 'p1', title: 'Quimica da agua', minutes: 8, url: 'https://www.youtube.com/embed/jNQXAC9IVRw' },
      { id: 'p2', title: 'Checklist diario da raia', minutes: 6, url: 'https://www.youtube.com/embed/jNQXAC9IVRw' }
    ]
  },
  {
    id: 'natacao', group: 'Staff', title: 'Metodologia natacao infantil',
    audience: ['staff', 'franqueado', 'matriz'],
    lessons: [
      { id: 'n1', title: 'Metodo Lucas Oliveira - base', minutes: 12, url: 'https://www.youtube.com/embed/jNQXAC9IVRw' }
    ]
  },
  {
    id: 'recepcao', group: 'Recepcao', title: 'Onboarding da recepcao',
    audience: ['staff', 'franqueado', 'matriz'],
    lessons: [
      { id: 'r1', title: 'Atendimento e EVO no dia a dia', minutes: 9, url: 'https://www.youtube.com/embed/jNQXAC9IVRw' }
    ]
  },
  {
    id: 'casa', group: 'Alunos', title: 'Treino em casa e respiracao',
    audience: ['aluno', 'matriz'],
    lessons: [
      { id: 'c1', title: 'Respiracao para natacao', minutes: 7, url: 'https://www.youtube.com/embed/jNQXAC9IVRw' }
    ]
  },
  {
    id: 'parceiros', group: 'Parceiros', title: 'Protocolo aquatico para fisio',
    audience: ['parceiro', 'matriz'],
    lessons: [
      { id: 'x1', title: 'Hidroterapia - alinhamento', minutes: 10, url: 'https://www.youtube.com/embed/jNQXAC9IVRw' }
    ]
  }
];

export const VAULT = [
  { id: 'onboard', title: 'Manual de Onboarding Geral v2.1', kind: 'pdf', audience: ['franqueado', 'matriz', 'staff'], url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'abertura', title: 'Checklist de Abertura (Recepcao)', kind: 'pdf', audience: ['staff', 'franqueado', 'matriz'], url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'marca', title: 'Identidade visual e contratos', kind: 'pdf', audience: ['franqueado', 'matriz'], url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
];

export const EVENT = {
  id: 'pisc-2026',
  title: 'Treinamento Tecnico - Tratamento de Piscinas',
  place: 'Unidade Pituba',
  when: 'Sabado · 10h',
  qr: 'FLUIR-PISC-2026',
  liveRoom: 'fluir-demo'
};

export const CEO_EMAILS = [
  'yanfili.simon@gmail.com',
  'plmacramo@gmail.com',
  'sendatantrica@gmail.com',
  'opatricksimon@gmail.com'
];

export function can(role, action) {
  return (POLICY[role] || []).indexOf(action) >= 0;
}

export function tracksFor(role) {
  return TRACKS.filter(function (t) {
    return role === 'matriz' || t.audience.indexOf(role) >= 0;
  });
}

export function vaultFor(role) {
  return VAULT.filter(function (v) {
    return role === 'matriz' || v.audience.indexOf(role) >= 0;
  });
}

export function unitById(id) {
  return UNITS.filter(function (u) { return u.id === id; })[0] || UNITS[0];
}

export function roleById(id) {
  return ROLES.filter(function (r) { return r.id === id; })[0] || ROLES[2];
}

export function progressOf(done, role) {
  const lessons = tracksFor(role).reduce(function (a, t) { return a.concat(t.lessons); }, []);
  const n = lessons.filter(function (l) { return done[l.id]; }).length;
  return { done: n, total: lessons.length, pct: lessons.length ? Math.round(n * 100 / lessons.length) : 0 };
}

export function isCeoEmail(email) {
  return CEO_EMAILS.indexOf(String(email || '').toLowerCase()) >= 0;
}
