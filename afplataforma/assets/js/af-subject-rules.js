/**
 * Quem a ferramenta está mostrando.
 * Não autoriza leitura e não troca o login.
 * Mentorando: sempre o próprio UID.
 * Mentor: o UID escolhido no hub, só se foi gravado para esta mesma conta.
 */

export function subjectUid(actor, stored) {
  if (!actor || !actor.uid) return "";
  if (actor.role !== "mentor") return actor.uid;
  if (!stored || stored.actorUid !== actor.uid) return actor.uid;
  if (stored.source !== "mentor-selection") return actor.uid;
  if (typeof stored.uid !== "string" || !stored.uid || stored.uid === actor.uid) return actor.uid;
  return stored.uid;
}

export function writingLocked(actor, stored) {
  const uid = subjectUid(actor, stored);
  return Boolean(actor && actor.uid && uid && uid !== actor.uid);
}
