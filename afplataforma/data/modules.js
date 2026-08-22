/**
 * Conteúdo público dos 7 módulos (sem roteiros de call)
 */
export const MODULES = [
  {
    id: "module01",
    num: "01",
    title: "Fundação de Capital de Segurança",
    subtitle: "Eliminar escassez cognitiva · reserva e cash-flow",
    materials: [
      { id: "m1a", title: "Protocolo de Execução", body: "Rotina de auditoria, ancoragem de estado e automatização de reserva (10–20% da receita líquida)." },
      { id: "m1b", title: "Checklist de Accountability", body: "Lista de verificação diária/semanal para manter a base financeira ativa." },
      { id: "m1c", title: "Template de Auditoria de Cash-Flow", body: "Registro de entradas/saídas com classificação essencial e ação (manter/reduzir/cancelar)." }
    ],
    tools: ["cashflow"]
  },
  {
    id: "module02",
    num: "02",
    title: "Capital Criativo e Inovação Lucrativa",
    subtitle: "Ideação forçada · validação · empacotamento",
    materials: [
      { id: "m2a", title: "Protocolo de Validação de Ideias", body: "Teste rápido com 3 potenciais clientes antes de construir." },
      { id: "m2b", title: "Cronograma de Ideação Forçada", body: "Bloco semanal de 45 minutos com restrição e método." },
      { id: "m2c", title: "Diário de Insights", body: "Captura de oportunidades e combinações úteis." }
    ],
    tools: ["ideation"]
  },
  {
    id: "module03",
    num: "03",
    title: "Motor de Execução e Determinação",
    subtitle: "Mínimo viável diário · priorização · anti-procrastinação",
    materials: [
      { id: "m3a", title: "Protocolo de Accountability", body: "Compromisso público e revisão de entrega." },
      { id: "m3b", title: "Matriz de Priorização", body: "80% no importante não urgente." },
      { id: "m3c", title: "Checklist de Procrastinação", body: "Identificar mecanismos de fuga e substituir por microtarefas." }
    ],
    tools: ["execution"]
  },
  {
    id: "module04",
    num: "04",
    title: "Capital Relacional e Reciprocidade",
    subtitle: "Mapa de rede · entrega de valor · ativação",
    materials: [
      { id: "m4a", title: "Template de Mapa de Rede", body: "5–10 conexões de alto valor e próximos passos." },
      { id: "m4b", title: "Guia de Reciprocidade", body: "Generosidade estratégica sem compra de afeto." },
      { id: "m4c", title: "Checklist de Entrega de Valor", body: "Uma entrega por semana, rastreável." }
    ],
    tools: ["network"]
  },
  {
    id: "module05",
    num: "05",
    title: "Comunicação, Negociação e Expressão de Valor",
    subtitle: "Pitch · BATNA · clareza de mensagem",
    materials: [
      { id: "m5a", title: "Estruturas de Pitch", body: "PSI · ADP · POC em 60–90 segundos." },
      { id: "m5b", title: "Checklist de Negociação", body: "Pré e pós: objetivos, limites, próximo passo." },
      { id: "m5c", title: "Guia de Liberação Vocal", body: "Clareza física da mensagem e presença." }
    ],
    tools: ["pitch"]
  },
  {
    id: "module06",
    num: "06",
    title: "Visão Estratégica e Planejamento de Longo Prazo",
    subtitle: "Visão 1 página · roadmap reverso · cenários",
    materials: [
      { id: "m6a", title: "Template de Planejamento de Longo Prazo", body: "Documento vivo de 10 anos traduzido em próximos 90 dias." },
      { id: "m6b", title: "Matriz de Cenários", body: "Otimista / base / pessimista com respostas preparadas." },
      { id: "m6c", title: "Guia de Modelos Mentais", body: "Inversão, segunda ordem, margem de segurança, círculo de competência." }
    ],
    tools: ["vision"]
  },
  {
    id: "module07",
    num: "07",
    title: "Governança de Consciência e Opulência Sistêmica",
    subtitle: "Legado · stewardship · alinhamento valores-dinheiro",
    materials: [
      { id: "m7a", title: "Guia de Governança de Consciência", body: "Critérios de decisão e revisão periódica do sistema." },
      { id: "m7b", title: "Modelo de Declaração de Legado", body: "Quem sou · o que construí · por quê · para quem · o que resta." },
      { id: "m7c", title: "Checklist Final de Accountability", body: "Integração dos sete vetores e prova observável." }
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
