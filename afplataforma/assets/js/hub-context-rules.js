/**
 * Regras puras do contexto de navegação.
 * Não autorizam leitura. Não conhecem Firebase.
 * O mentorando nunca herda um UID guardado por outra sessão.
 */

export function resolveContext(actor, stored) {
  if (!actor || !actor.uid) return null;
  const self = {
    uid: actor.uid,
    name: actor.name || "",
    email: actor.email || "",
    source: "self"
  };
  if (actor.role !== "mentor") return self;
  if (stored && typeof stored.uid === "string" && stored.uid && stored.uid !== actor.uid) {
    return {
      uid: stored.uid,
      name: stored.name || "",
      email: stored.email || "",
      source: "mentor-selection"
    };
  }
  return self;
}

export function selectionAllowed(actor, targetUid) {
  return Boolean(actor && actor.role === "mentor" && typeof targetUid === "string" && targetUid);
}
