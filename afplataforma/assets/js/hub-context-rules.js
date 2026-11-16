/**
 * Regras puras do contexto de navegação.
 * Não autorizam leitura e não trocam o UID do login.
 * Um UID só entra no contexto se estiver na lista já carregada.
 */

export function resolveContext(actor, stored, allowedUids) {
  if (!actor || !actor.uid) return null;
  const self = {
    uid: actor.uid,
    name: actor.name || "",
    email: actor.email || "",
    source: "self"
  };
  if (actor.role !== "mentor") return self;
  if (!stored || stored.uid === actor.uid) return self;
  if (!selectionAllowed(actor, stored.uid, allowedUids)) return self;
  return {
    uid: stored.uid,
    name: stored.name || "",
    email: stored.email || "",
    source: "mentor-selection"
  };
}

export function selectionAllowed(actor, targetUid, allowedUids) {
  if (!actor || actor.role !== "mentor") return false;
  if (typeof targetUid !== "string" || !targetUid) return false;
  if (targetUid === actor.uid) return true;
  return Boolean(allowedUids && typeof allowedUids.has === "function" && allowedUids.has(targetUid));
}

export function contextFromSelection(actor, targetUid, allowedUids, directory) {
  if (!selectionAllowed(actor, targetUid, allowedUids)) return null;
  if (targetUid === actor.uid) {
    return {
      uid: actor.uid,
      name: actor.name || "",
      email: actor.email || "",
      source: "self"
    };
  }
  const row = directory && typeof directory.get === "function" ? directory.get(targetUid) : null;
  if (!row || row.status !== "active") return null;
  return {
    uid: targetUid,
    name: row.name || "",
    email: row.email || "",
    source: "mentor-selection"
  };
}
