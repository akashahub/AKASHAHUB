/**
 * Leitura do dossiê. Não grava e não escolhe quem pode ver.
 * O UID já chegou decidido. Aqui só se organiza o que o banco devolveu.
 */

const SKIP = new Set(["uid", "updatedAt", "createdAt", "ownerId", "ownerUid"]);

export function readableFields(data) {
  if (!data || typeof data !== "object") return [];
  const fields = [];
  for (const [key, value] of Object.entries(data)) {
    if (SKIP.has(key)) continue;
    if (typeof value === "string" && value.trim()) fields.push({ key, text: value.trim() });
    else if (typeof value === "number" && Number.isFinite(value)) fields.push({ key, text: String(value) });
    else if (Array.isArray(value) && value.length) fields.push({ key, text: value.map(String).join(", ") });
  }
  return fields;
}

export function subjectOf({ sessionUid, mentor, context }) {
  if (!sessionUid) return null;
  if (mentor && context && context.source === "mentor-selection" && context.uid && context.uid !== sessionUid) {
    return { uid: context.uid, name: context.name || context.email || "mentorando", own: false };
  }
  return { uid: sessionUid, name: "você", own: true };
}

export function copyText(personName, blocks) {
  const lines = [`Dossiê de ${personName}`, "Leitura do que já está salvo. Nada aqui foi alterado.", ""];
  for (const block of blocks) {
    lines.push(`${block.phase} · ${block.title}`);
    if (block.status === "vazio") lines.push("Nada preenchido.");
    else if (block.status === "bloqueado") lines.push("Ainda não dá para ler daqui.");
    else if (block.status === "erro") lines.push("Não foi possível ler agora.");
    else for (const field of block.fields) lines.push(`${field.key}: ${field.text}`);
    lines.push("");
  }
  return lines.join("\n").trim();
}
