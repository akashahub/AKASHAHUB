/* Akasha Sales OS · fonte única de dados comerciais compartilhados. */
import { CATALOG } from "/afplataforma/assets/js/catalogo-capacidades-data.js";

export { CATALOG };
export const catalogCapabilities = CATALOG.flatMap(dept =>
  dept.groups.flatMap(group => group[1].map(name => ({
    id: dept.id + "::" + name, name, department: dept.name, group: group[0]
  })))
);

export const SALES_WORKFLOW = [
  { id:"cliente", number:"01", title:"Cliente e contexto", objective:"Entender quem é o cliente, sua atividade e o pedido inicial." },
  { id:"diagnostico", number:"02", title:"Diagnóstico e problemas", objective:"Investigar cenário, problemas reconhecidos, impactos e prioridade." },
  { id:"capacidades", number:"03", title:"Capacidades e escopo", objective:"Conectar problemas confirmados às capacidades e entregáveis adequados." },
  { id:"investimento", number:"04", title:"Investimento e condições", objective:"Calcular custos, preço, margem, prazo e condições comerciais." },
  { id:"proposta", number:"05", title:"Proposta e decisão", objective:"Revisar a proposta, esclarecer dúvidas e combinar a próxima ação." }
];

export const TELEPROMPT_FLOW = [
  { number:"01", title:"Abertura", stage:"cliente" },
  { number:"02", title:"Pedido inicial", stage:"cliente" },
  { number:"03", title:"Cenário atual", stage:"diagnostico" },
  { number:"04", title:"Problemas e impacto", stage:"diagnostico" },
  { number:"05", title:"Resultado e prioridade", stage:"diagnostico" },
  { number:"06", title:"Diagnóstico e confirmação", stage:"diagnostico" },
  { number:"07", title:"Solução e capacidades", stage:"capacidades" },
  { number:"08", title:"Proposta e investimento", stage:"investimento" },
  { number:"09", title:"Dúvidas e decisão", stage:"proposta" },
  { number:"10", title:"Encerramento e próximo passo", stage:"proposta" }
];

export const CAPABILITY_BASE = {essencia:1200,branding:1500,tecnologia:2400,financeiro:1600,marketing:1500,comercial:1600,internacional:2000,automacao:2300,educacao:1400,legado:2400};
export function suggestedCapabilityPrice(deptId, group, name) {
  let value = CAPABILITY_BASE[deptId] || 1500;
  const g=String(group||"").toLocaleLowerCase("pt-BR");
  const n=String(name||"").toLocaleLowerCase("pt-BR");
  const all=g+" "+n;
  if(/diagnóstico|investigação|mapeamento|análise|pesquisa|planejamento|estratégia|arquitetura/.test(all)) value*=1.25;
  if(/plataforma|aplicativo|sistema|marketplace|saas|integração|automação|agentes de ia|banco de dados|api|back-end|front-end/.test(n)) value*=1.8;
  if(/livro|e-book|curso|treinamento|formação|workshop|palestra|seminário|evento|documentação|manual|relatório|apresentação/.test(n)) value*=1.2;
  if(/fundamentos|crenças|hábitos|rotinas|tarefas|controle|edição|legendagem|tradução/.test(n)) value*=.85;
  if(/holdings|sucessão|valuation|aquisições|governança|segurança|auditoria|internacionalização/.test(n)) value*=1.4;
  return Math.max(400,Math.round(value/100)*100);
}
export function normalizeSalesText(value) {
  return String(value||"").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toLocaleLowerCase("pt-BR");
}

const PROBLEM_MAP=[
 {category:"Clientes e vendas",items:[
  ["Poucas pessoas conhecem a empresa ou seus serviços","marketing comercial branding","público segmentação aquisição presença digital"],
  ["As pessoas demonstram interesse, mas não viram clientes","comercial marketing automacao","jornada atendimento prospecção negociação funis"],
  ["A empresa depende demais de indicação ou de poucos clientes","marketing comercial","aquisição prospecção canais distribuição"],
  ["A equipe não sabe explicar o valor do que vende","branding comercial","proposta de valor narrativa comunicação ofertas"],
  ["As propostas demoram para ser feitas ou não convencem","comercial automacao branding","propostas escopos negociação documentos"],
  ["Não existe um processo claro para acompanhar contatos e oportunidades","comercial automacao","crm pipeline prospecção atendimento"]
 ]},
 {category:"Marca, imagem e comunicação",items:[
  ["A marca parece amadora, antiga ou não combina com a qualidade da empresa","branding","identidade visual imagem fotografia direção de arte"],
  ["A empresa não consegue explicar claramente o que a torna diferente","branding marketing comercial","proposta de valor posicionamento narrativa segmentação"],
  ["O conteúdo é feito sem plano e sem consistência","marketing branding","calendário editorial redes sociais conteúdo"],
  ["A empresa precisa melhorar sua presença digital e ser encontrada","marketing tecnologia","seo presença digital sites landing pages"]
 ]},
 {category:"Organização e operação",items:[
  ["Muitas tarefas dependem de uma única pessoa","automacao internacional","processos procedimentos documentação responsabilidades"],
  ["A equipe perde tempo com tarefas repetidas e trabalho manual","automacao tecnologia","automação integração formulários relatórios"],
  ["Informações ficam espalhadas e são difíceis de encontrar","automacao tecnologia","bases de conhecimento gestão conhecimento documentação"],
  ["A empresa não tem processos, responsabilidades ou indicadores claros","internacional automacao","processos fluxogramas indicadores gestão equipes"]
 ]},
 {category:"Tecnologia e estrutura digital",items:[
  ["A empresa não tem site, ou o site não gera contatos","tecnologia marketing","sites landing pages formulários captura"],
  ["Os sistemas não conversam entre si e os dados ficam duplicados","tecnologia automacao","api integração bancos de dados sincronização"],
  ["A empresa precisa de uma área do cliente, plataforma ou aplicativo","tecnologia","aplicativos plataformas portais sistemas gestão"],
  ["Pagamentos, pedidos ou agendamentos dão trabalho e geram erros","tecnologia automacao","checkout pagamentos agendamentos comércio digital"]
 ]},
 {category:"Dinheiro e gestão financeira",items:[
  ["A empresa vende, mas não sabe exatamente quanto sobra","financeiro","fluxo caixa custos margem rentabilidade"],
  ["Os preços podem estar errados ou a margem está muito baixa","financeiro comercial","precificação formação preços margem negociação"],
  ["Falta controle de contas, dívidas, orçamento ou capital de giro","financeiro","orçamento contas dívidas capital giro"],
  ["A empresa quer crescer, mas não sabe quanto pode investir","financeiro legado","projeção caixa viabilidade capital risco patrimônio"]
 ]},
 {category:"Crescimento e futuro",items:[
  ["A empresa quer entrar em novos mercados ou países","internacional marketing","internacionalização mercados estrangeiros localização"],
  ["O conhecimento da empresa está na cabeça das pessoas e não documentado","educacao automacao","conhecimento tácito documentação métodos processos"],
  ["A empresa precisa transformar seu conhecimento em cursos, produtos ou treinamentos","educacao tecnologia","cursos trilhas treinamentos produtos conhecimento"],
  ["O negócio depende demais do fundador e precisa preparar a continuidade","legado internacional essencia","governança sucessão delegação liderança processos"],
  ["A empresa quer organizar patrimônio, expansão ou sucessão","legado financeiro","patrimônio ativos passivos governança sucessão"]
 ]}
];

export function getProblemCapabilitySuggestions(selectedProblems) {
  const chosen=PROBLEM_MAP.flatMap(category=>category.items).filter(item=>selectedProblems.includes(item[0]));
  const deptIds=[...new Set(chosen.flatMap(item=>item[1].split(" ")))];
  const terms=chosen.flatMap(item=>item[2].split(" "));
  const matches=catalogCapabilities.filter(cap=>{
    if(!deptIds.includes(cap.id.split("::")[0])) return false;
    const hay=normalizeSalesText(cap.department+" "+cap.group+" "+cap.name);
    return terms.some(term=>hay.includes(normalizeSalesText(term)));
  });
  const fallback=catalogCapabilities.filter(cap=>deptIds.includes(cap.id.split("::")[0]));
  return [...new Map((matches.length?matches:fallback).map(cap=>[cap.id,cap])).values()].slice(0,18)
    .map(cap=>({...cap,suggestedPrice:suggestedCapabilityPrice(cap.id.split("::")[0],cap.group,cap.name)}));
}
