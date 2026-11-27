// Classificação inicial de contexto da Biblioteca de Prompts.
// Escopo define quais fontes podem alimentar a Ficha Única: pessoal, empresarial ou híbrido.
// Não altera dados do Firestore, permissões, IDs ou o catálogo original.
export const CONTEXT_SCOPE = Object.freeze({
  PERSONAL: "personal",
  BUSINESS: "business",
  HYBRID: "hybrid"
});

export const CONTEXT_SCOPE_META = Object.freeze({
  personal: { label: "Pessoal", shortLabel: "Pessoal", sourceLabel: "Perfil pessoal" },
  business: { label: "Empresarial", shortLabel: "Empresa", sourceLabel: "Dossiê empresarial" },
  hybrid: { label: "Híbrido", shortLabel: "Pessoal + empresa", sourceLabel: "Perfil pessoal e dossiê empresarial" }
});

// Padrão por departamento, com exceções explícitas por capacidade.
// Toda capacidade atual recebe uma classificação; IDs novos devem ser revisados.
const DEPARTMENT_DEFAULT_SCOPE = Object.freeze({
  essencia: "personal",
  branding: "business",
  tecnologia: "business",
  financeiro: "business",
  marketing: "business",
  comercial: "business",
  internacional: "business",
  automacao: "business",
  educacao: "business",
  legado: "business"
});

const CAPABILITY_SCOPE_OVERRIDES = Object.freeze({
  // Arquitetura de Essência: identidade pessoal; posicionamento de fundador cruza as duas fontes.
  "0101-C08": "hybrid",
  "0101-C16": "hybrid",

  // Branding e comunicação: retrato e marca pessoal; aplicações amplas podem ser híbridas.
  "0202-C05": "personal",
  "0202-C07": "hybrid",
  "0202-C08": "hybrid",
  "0202-C11": "hybrid",
  "0202-C13": "hybrid",
  "0202-C14": "hybrid",
  "0202-C15": "hybrid",
  "0202-C16": "hybrid",

  // Ativos digitais que podem representar tanto uma pessoa quanto uma empresa.
  "0303-C01": "hybrid",
  "0303-C02": "hybrid",
  "0303-C07": "hybrid",

  // Finanças pessoais e familiares; temas de comportamento que também afetam negócios.
  "0404-C01": "personal",
  "0404-C02": "personal",
  "0404-C03": "hybrid",
  "0404-C04": "personal",
  "0404-C05": "personal",
  "0404-C06": "personal",
  "0404-C07": "personal",
  "0404-C08": "personal",
  "0404-C17": "hybrid",
  "0404-C18": "hybrid",
  "0404-C19": "personal",
  "0404-C20": "personal",
  "0404-C21": "personal",
  "0404-C22": "personal",
  "0404-C26": "hybrid",
  "0404-C27": "hybrid",
  "0404-C28": "hybrid",
  "0404-C29": "personal",
  "0404-C30": "hybrid",
  "0404-C31": "hybrid",
  "0404-C32": "personal",
  "0404-C33": "personal",
  "0404-C34": "personal",
  "0404-C35": "personal",
  "0404-C36": "personal",

  // Marketing de marca pessoal e criação de conteúdo individual ou corporativo.
  "0505-C03": "hybrid",
  "0505-C05": "hybrid",
  "0505-C06": "hybrid",
  "0505-C07": "hybrid",
  "0505-C08": "hybrid",

  // Gestão e produtividade: ferramentas pessoais, empresariais e agentes generalistas.
  "0808-C02": "hybrid",
  "0808-C07": "hybrid",
  "0808-C09": "hybrid",
  "0808-C10": "hybrid",
  "0808-C11": "personal",
  "0808-C12": "hybrid",
  "0808-C13": "hybrid",

  // Conhecimento pode ser pessoal ou institucional.
  "0909-C01": "hybrid",
  "0909-C02": "hybrid",
  "0909-C04": "hybrid",
  "0909-C05": "hybrid",
  "0909-C06": "hybrid",
  "0909-C10": "hybrid",
  "0909-C11": "hybrid",

  // Patrimônio, sucessão, comunidade e legado podem envolver pessoa e empresa.
  "1010-C01": "hybrid",
  "1010-C02": "hybrid",
  "1010-C03": "hybrid",
  "1010-C04": "hybrid",
  "1010-C09": "hybrid",
  "1010-C11": "hybrid",
  "1010-C12": "hybrid",
  "1010-C13": "hybrid",
  "1010-C14": "hybrid"
});

export function getCapabilityContextScope(id, departmentId) {
  return CAPABILITY_SCOPE_OVERRIDES[id] || DEPARTMENT_DEFAULT_SCOPE[departmentId] || "hybrid";
}

const SPECIALIZED_PREFIX_DEFAULT = Object.freeze({
  IMG: "hybrid",
  VID: "hybrid",
  NEG: "business",
  PES: "hybrid",
  FIN: "personal",
  EST: "hybrid",
  GLO: "business"
});

const SPECIALIZED_SCOPE_OVERRIDES = Object.freeze({
  "IMG-02": "personal",
  "IMG-03": "personal",
  "IMG-04": "personal",
  "IMG-08": "business",
  "IMG-09": "business",
  "IMG-10": "business",
  "IMG-11": "business",
  "VID-02": "personal",
  "VID-04": "personal",
  "VID-07": "personal",
  "PES-02": "business",
  "PES-05": "business",
  "FIN-01": "business",
  "FIN-09": "hybrid",
  "EST-06": "business",
  "EST-07": "business",
  "EST-08": "business",
  "EST-09": "business",
  "EST-10": "business",
  "EST-11": "business",
  "EST-14": "business"
});

export function getSpecializedContextScope(id) {
  return SPECIALIZED_SCOPE_OVERRIDES[id] || SPECIALIZED_PREFIX_DEFAULT[String(id || "").split("-")[0]] || "hybrid";
}

export function getContextScopeMeta(scope) {
  return CONTEXT_SCOPE_META[scope] || CONTEXT_SCOPE_META.hybrid;
}

// Compatibilidade temporária com a Ficha Única atual (16 variáveis planas).
// O futuro Dossiê terá fontes pessoais, empresariais e de projeto separadas.
export const PERSONAL_CONTEXT_KEYS = Object.freeze([
  "NOME_DO_CLIENTE_OU_EMPRESA",
  "ESTAGIO_ATUAL_E_HISTORICO",
  "OBJETIVO_PRINCIPAL_E_RESULTADO_ESPERADO",
  "PROBLEMA_OU_OPORTUNIDADE",
  "PRAZO_E_PRIORIDADE",
  "DECISOES_JA_TOMADAS_E_PREFERENCIAS",
  "FONTES_DOCUMENTOS_E_REFERENCIAS_AUTORIZADAS",
  "FORMATO_DO_ENTREGAVEL",
  "RESPONSAVEL_PELA_VALIDACAO"
]);

export const BUSINESS_CONTEXT_KEYS = Object.freeze([
  "NOME_DO_CLIENTE_OU_EMPRESA",
  "SEGMENTO_E_MODELO_DE_NEGOCIO",
  "PAIS_CIDADE_E_MERCADO",
  "ESTAGIO_ATUAL_E_HISTORICO",
  "OBJETIVO_PRINCIPAL_E_RESULTADO_ESPERADO",
  "PROBLEMA_OU_OPORTUNIDADE",
  "PUBLICO_E_CLIENTE_IDEAL",
  "OFERTA_PRODUTO_SERVICO",
  "DADOS_E_INDICADORES_DISPONIVEIS",
  "RECURSOS_ORCAMENTO_E_RESTRICOES",
  "PRAZO_E_PRIORIDADE",
  "ATIVOS_FERRAMENTAS_E_PROCESSOS_EXISTENTES",
  "DECISOES_JA_TOMADAS_E_PREFERENCIAS",
  "FONTES_DOCUMENTOS_E_REFERENCIAS_AUTORIZADAS",
  "FORMATO_DO_ENTREGAVEL",
  "RESPONSAVEL_PELA_VALIDACAO"
]);

export function getContextKeysForScope(scope) {
  if (scope === "personal") return PERSONAL_CONTEXT_KEYS;
  if (scope === "business") return BUSINESS_CONTEXT_KEYS;
  return [...new Set([...PERSONAL_CONTEXT_KEYS, ...BUSINESS_CONTEXT_KEYS])];
}

export function contextScopeInstruction(scope) {
  if (scope === "personal") return "Use prioritariamente o perfil pessoal: trajetória, identidade, habilidades, experiências, valores, objetivos e preferências. Não incorpore dados empresariais específicos, salvo quando a própria tarefa exigir.";
  if (scope === "business") return "Use prioritariamente o dossiê empresarial do negócio selecionado: modelo, mercado, clientes, ofertas, operação, indicadores, recursos e ativos. Não transforme dados pessoais do responsável em dados da empresa.";
  return "Combine perfil pessoal e dossiê empresarial somente quando cada fonte for relevante. Identifique a origem de cada informação e não misture fatos da pessoa com fatos da empresa.";
}
