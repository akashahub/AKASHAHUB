/**
 * Cruza as fases pelo que está preenchido ou vazio.
 * Não aconselha, não calcula nota e não inventa causa.
 */

export const INTEL_PHASES = [
  "Fase 1 · Essência",
  "Fase 2 · Império",
  "Fase 3 · Financeiro",
  "Fase 4 · Expansão",
  "Fase 5 · Legado"
];

export function phaseReport(blocks) {
  return INTEL_PHASES.map((phase) => {
    const rows = (blocks || []).filter((row) => row.phase === phase);
    return {
      phase,
      total: rows.length,
      filled: rows.filter((row) => row.status === "cheio").length,
      empty: rows.filter((row) => row.status === "vazio").length,
      blocked: rows.filter((row) => row.status === "bloqueado").length,
      error: rows.filter((row) => row.status === "erro").length
    };
  });
}

export function bridges(report) {
  const rows = report || [];
  if (!rows.length) return ["Ainda não há o que cruzar."];
  if (rows.every((row) => row.filled === 0 && row.blocked === 0 && row.error === 0)) {
    return ["Nenhuma ferramenta tem resposta ainda."];
  }
  const lines = [];
  if (rows.every((row) => row.filled > 0)) {
    lines.push("As cinco fases já têm pelo menos uma resposta.");
  }
  for (let i = 1; i < rows.length; i += 1) {
    const previous = rows[i - 1];
    const current = rows[i];
    const readable = current.total - current.blocked - current.error;
    if (previous.filled > 0 && current.filled === 0 && readable > 0) {
      lines.push(`${previous.phase} já tem texto. ${current.phase} ainda não tem resposta.`);
    }
  }
  for (const row of rows) {
    if (row.total > 0 && row.blocked === row.total) {
      lines.push(`${row.phase} ainda não deixa ler daqui.`);
    }
  }
  if (!lines.length) lines.push("Dá para ler as fases. O cruzamento não achou um buraco entre uma fase com texto e a seguinte vazia.");
  return lines;
}
