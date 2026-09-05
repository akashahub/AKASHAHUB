/**
 * Conteúdo público dos 7 módulos (sem roteiros de call)
 * pdf = material do MENTORANDO. Roteiro do mentor vive só em afMentorScripts.
 */
export const MODULES = [
  {
    id: "module01",
    num: "01",
    title: "Fundação de Capital de Segurança",
    subtitle: "Eliminar escassez cognitiva · reserva e cash-flow",
    archetype: "Guardião da Base",
    chakra: "Muladhara · Raiz",
    materials: [
      { id: "m1a", title: "Protocolo de Execução", body: "Rotina de auditoria, ancoragem de estado e automatização de reserva (10–20% da receita líquida).", pdf: "assets/materials/01-protocolo-execucao.pdf" },
      { id: "m1b", title: "Checklist de Accountability", body: "Lista de verificação diária/semanal para manter a base financeira ativa.", pdf: "assets/materials/02-checklist-accountability.pdf" },
      { id: "m1c", title: "Template de Auditoria de Cash-Flow", body: "Registro de entradas/saídas com classificação essencial e ação (manter/reduzir/cancelar).", pdf: "assets/materials/03-template-cashflow.pdf" }
    ],
    tools: ["cashflow"]
  },
  {
    id: "module02",
    num: "02",
    title: "Capital Criativo e Inovação Lucrativa",
    subtitle: "Ideação forçada · validação · empacotamento",
    archetype: "Criador",
    chakra: "Svadhisthana · Sacral",
    materials: [
      { id: "m2a", title: "Protocolo de Validação de Ideias", body: "Teste rápido com 3 potenciais clientes antes de construir.", pdf: "assets/materials/04-protocolo-validacao.pdf" },
      { id: "m2b", title: "Cronograma de Ideação Forçada", body: "Bloco semanal de 45 minutos com restrição e método.", pdf: "assets/materials/05-cronograma-ideacao.pdf" },
      { id: "m2c", title: "Diário de Insights", body: "Captura de oportunidades e combinações úteis.", pdf: "assets/materials/06-diario-insights.pdf" }
    ],
    tools: ["ideation"]
  },
  {
    id: "module03",
    num: "03",
    title: "Motor de Execução e Determinação",
    subtitle: "Mínimo viável diário · priorização · anti-procrastinação",
    archetype: "Executor",
    chakra: "Manipura · Plexo solar",
    materials: [
      { id: "m3a", title: "Protocolo de Accountability", body: "Compromisso público e revisão de entrega.", pdf: "assets/materials/07-protocolo-accountability.pdf" },
      { id: "m3b", title: "Matriz de Priorização", body: "80% no importante não urgente.", pdf: "assets/materials/08-matriz-priorizacao.pdf" },
      { id: "m3c", title: "Checklist de Procrastinação", body: "Identificar mecanismos de fuga e substituir por microtarefas.", pdf: "assets/materials/09-checklist-procrastinacao.pdf" }
    ],
    tools: ["execution"]
  },
  {
    id: "module04",
    num: "04",
    title: "Capital Relacional e Reciprocidade",
    subtitle: "Mapa de rede · entrega de valor · ativação",
    archetype: "Tecelão da Rede",
    chakra: "Anahata · Cardíaco",
    materials: [
      { id: "m4a", title: "Template de Mapa de Rede", body: "5–10 conexões de alto valor e próximos passos.", pdf: "assets/materials/10-mapa-rede.pdf" },
      { id: "m4b", title: "Guia de Reciprocidade", body: "Generosidade estratégica sem compra de afeto.", pdf: "assets/materials/11-guia-reciprocidade.pdf" },
      { id: "m4c", title: "Checklist de Entrega de Valor", body: "Uma entrega por semana, rastreável.", pdf: "assets/materials/12-checklist-entrega.pdf" }
    ],
    tools: ["network"]
  },
  {
    id: "module05",
    num: "05",
    title: "Comunicação, Negociação e Expressão de Valor",
    subtitle: "Pitch · BATNA · clareza de mensagem",
    archetype: "Mensageiro",
    chakra: "Vishuddha · Laríngeo",
    materials: [
      { id: "m5a", title: "Estruturas de Pitch", body: "PSI · ADP · POC em 60–90 segundos.", pdf: "assets/materials/13-estruturas-pitch.pdf" },
      { id: "m5b", title: "Checklist de Negociação", body: "Pré e pós: objetivos, limites, próximo passo.", pdf: "assets/materials/14-checklist-negociacao.pdf" },
      { id: "m5c", title: "Guia de Liberação Vocal", body: "Clareza física da mensagem e presença.", pdf: "assets/materials/15-guia-liberacao-vocal.pdf" }
    ],
    tools: ["pitch", "fono"]
  },
  {
    id: "module06",
    num: "06",
    title: "Visão Estratégica e Planejamento de Longo Prazo",
    subtitle: "Visão 1 página · roadmap reverso · cenários",
    archetype: "Visionário",
    chakra: "Ajna · Frontal",
    materials: [
      { id: "m6a", title: "Template de Planejamento de Longo Prazo", body: "Documento vivo de 10 anos traduzido em próximos 90 dias.", pdf: "assets/materials/16-planejamento-estrategico.pdf" },
      { id: "m6b", title: "Matriz de Cenários", body: "Otimista / base / pessimista com respostas preparadas.", pdf: "assets/materials/17-matriz-cenarios.pdf" },
      { id: "m6c", title: "Guia de Modelos Mentais", body: "Inversão, segunda ordem, margem de segurança, círculo de competência.", pdf: "assets/materials/18-modelos-mentais.pdf" }
    ],
    tools: ["vision"]
  },
  {
    id: "module07",
    num: "07",
    title: "Governança de Consciência e Opulência Sistêmica",
    subtitle: "Legado · stewardship · alinhamento valores-dinheiro",
    archetype: "Guardião do Legado",
    chakra: "Sahasrara · Coronário",
    materials: [
      { id: "m7a", title: "Guia de Governança de Consciência", body: "Critérios de decisão e revisão periódica do sistema.", pdf: "assets/materials/19-governanca-consciencia.pdf" },
      { id: "m7b", title: "Modelo de Declaração de Legado", body: "Quem sou · o que construí · por quê · para quem · o que resta.", pdf: "assets/materials/20-declaracao-legado.pdf" },
      { id: "m7c", title: "Checklist Final de Accountability", body: "Integração dos sete vetores e prova observável.", pdf: "assets/materials/21-checklist-final.pdf" }
    ],
    tools: ["legacy"]
  }
];

export function defaultModulesMap(unlockedCount = 0) {
  const m = {};
  MODULES.forEach((mod, i) => {
    m[mod.id] = i < unlockedCount;
  });
  return m;
}
