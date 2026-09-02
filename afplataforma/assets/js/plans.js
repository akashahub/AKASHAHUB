/**
 * Planos AF — Essencial / Premium / VIP
 * Módulos 1–7 são iguais nos três. Diferença = complementar, tempo, salas.
 * Override do mentor (features[id] true/false) ganha do pacote.
 */
import { session, isMentorSession } from "./auth.js";

export const PLAN_ORDER = ["essential", "premium", "vip"];

export const PLANS = {
  essential: {
    id: "essential",
    label: "Essencial",
    weeks: 8,
    libraryDays: 30,
    blurb: "Método completo. Complementar leve. Call da turma / sala Essencial."
  },
  premium: {
    id: "premium",
    label: "Premium",
    weeks: 12,
    libraryDays: 180,
    blurb: "Método + corpo, livros, áudio autorizado, encontros. Sala Premium."
  },
  vip: {
    id: "vip",
    label: "VIP",
    weeks: 16,
    libraryDays: 365,
    blurb: "Tudo aberto + acompanhamento 1:1. Sala VIP e Geral."
  }
};

/** min = plano mínimo para o recurso no pacote padrão */
export const FEATURES = [
  { id: "dicionario", name: "Dicionário", min: "essential", group: "comp" },
  { id: "etiqueta", name: "Etiqueta", min: "essential", group: "comp" },
  { id: "loja", name: "Lojinha", min: "essential", group: "comp" },
  { id: "anamnese", name: "Anamnese · Essência", min: "essential", group: "comp" },
  { id: "quitei", name: "Quitei", min: "essential", group: "core" },
  { id: "alimentacao", name: "Alimentação", min: "premium", group: "comp" },
  { id: "constelacao", name: "Constelação familiar", min: "premium", group: "comp" },
  { id: "livros", name: "Livros dos 7 vetores", min: "premium", group: "comp" },
  { id: "audiolivros", name: "Áudiolivros autorizados", min: "premium", group: "comp" },
  { id: "treino", name: "Treino e exercícios", min: "premium", group: "comp" },
  { id: "yoga", name: "Yoga operacional", min: "premium", group: "comp" },
  { id: "meditacao", name: "Meditação guiada", min: "premium", group: "comp" },
  { id: "habitos", name: "Hábitos", min: "premium", group: "comp" },
  { id: "rotina", name: "Rotina", min: "premium", group: "comp" },
  { id: "metas", name: "Metas", min: "premium", group: "comp" },
  { id: "produtividade", name: "Produtividade", min: "premium", group: "comp" },
  { id: "encontros", name: "Encontros da mentoria", min: "premium", group: "comp" },
  { id: "mindzone", name: "MindZone", min: "vip", group: "comp" },
  { id: "sono", name: "Modo sono", min: "vip", group: "comp" },
  { id: "coach", name: "AF Coach", min: "vip", group: "comp" }
];

export const DEFAULT_ROOMS = [
  { id: "mentoria-principal", name: "Sala Geral", kind: "geral" },
  { id: "sala-essencial", name: "Sala Essencial", kind: "essential" },
  { id: "sala-premium", name: "Sala Premium", kind: "premium" },
  { id: "sala-vip", name: "Sala VIP", kind: "vip" }
];

export function planRank(plan) {
  const i = PLAN_ORDER.indexOf(plan);
  return i < 0 ? 1 : i + 1;
}

export function normalizePlan(plan) {
  return PLANS[plan] ? plan : "essential";
}

export function planLabel(plan) {
  return PLANS[normalizePlan(plan)].label;
}

export function featureMeta(id) {
  return FEATURES.find((f) => f.id === id) || null;
}

export function defaultOnForPlan(featureId, plan) {
  const f = featureMeta(featureId);
  if (!f) return false;
  return planRank(plan) >= planRank(f.min);
}

export function accessOfSession() {
  return {
    plan: session.plan || "essential",
    features: session.features || {},
    extraRooms: session.extraRooms || [],
    roomsBlocked: session.roomsBlocked || []
  };
}

/** true se o recurso está liberado para esta sessão */
export function canFeature(featureId, access) {
  if (isMentorSession()) return true;
  const acc = access || accessOfSession();
  const ov = acc.features && acc.features[featureId];
  if (ov === true) return true;
  if (ov === false) return false;
  return defaultOnForPlan(featureId, normalizePlan(acc.plan));
}

export function featureLockPlan(featureId) {
  const f = featureMeta(featureId);
  return f ? f.min : "premium";
}

export function allowedRoomIds(access, mentor) {
  if (mentor) {
    const extra = (access && access.extraRooms) || [];
    return DEFAULT_ROOMS.map((r) => r.id).concat(extra.filter(Boolean));
  }
  const acc = access || accessOfSession();
  const plan = normalizePlan(acc.plan);
  const set = new Set(["mentoria-principal", "sala-" + (plan === "essential" ? "essencial" : plan)]);
  (acc.extraRooms || []).forEach((id) => { if (id) set.add(id); });
  (acc.roomsBlocked || []).forEach((id) => set.delete(id));
  return Array.from(set);
}

export function canEnterRoom(roomId, access, mentor) {
  if (mentor) return true;
  return allowedRoomIds(access, false).includes(roomId);
}

export function roomName(id) {
  const hit = DEFAULT_ROOMS.find((r) => r.id === id);
  return hit ? hit.name : id;
}
