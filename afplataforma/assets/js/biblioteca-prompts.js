import { session, isMentorSession } from "./auth.js";
import { activeHubContext, loadAuthorizedMentees } from "./hub-context.js?v=etapa4-1";
import { db } from "../../firebase/firebase-config.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { CATALOG, DEPT_CODES, DEPT_PHASES, CAPABILITY_PHASES } from "./catalogo-capacidades-data.js?v=20261127-catalogo-167-1";
import { getCapabilityContextScope, getContextKeysForScope, getContextScopeMeta, contextScopeInstruction } from "./biblioteca-contexto-data.js?v=context-scope-20261127-1";
import { SPECIALIZED_PROMPTS, buildSpecializedPrompt } from "./biblioteca-prompts-especializados.js?v=context-scope-20261127-1";
import { readHubDossieSnapshot } from "./hub-dossie.js?v=dossier-cadastro-20261127-v1";

const PHASES = [
  {
    id:"AE", number:"01", name:"Arquitetura de Essência", short:"Essência, identidade e direção",
    objective:"Compreender trajetória, identidade, história familiar, visão de mundo, capacidades, valores e direção inicial do projeto.",
    deliverable:"Dossiê de Essência e Direção Estratégica",
    work:["Conduzir perguntas e conversas","Investigar identidade, história familiar e visão de mundo","Organizar o Dossiê de Essência","Identificar capacidades, valores, objetivos e possibilidades","Definir a direção inicial da marca","Estabelecer objetivos pessoais e empresariais","Fazer uma leitura inicial da situação financeira"],
    apps:[
      ["Essência OS","/afplataforma/essencia/"],["Identity Studio","/afplataforma/identity-studio/"],["Marketing Pessoal OS",""],
      ["Branding Pessoal","/afplataforma/branding-pessoal/"],["Constelação Familiar",""],["Registros Akáshicos","/afplataforma/registros-akashicos/"],
      ["Liderança",""],["Comunicação",""],["Authority & Leadership OS",""]
    ],
    support:["Sessões e roteiro original","Mesa da Essência","Formulário de Marca / Identidade","Dossiê de Essência","Dossiê vivo","Visão 1 página","Ideação / Insights"],
    next:"ID · transformar direção e identidade em posicionamento, ofertas e ativos digitais.",
    notes:"Constelação e Registros entram como leitura e recurso reflexivo, não como prova factual. O dossiê separa relato, fato, hipótese e decisão."
  },
  {
    id:"ID", number:"02", name:"Império Digital", short:"Posicionamento, ativos e infraestrutura",
    objective:"Converter direção e proposta de valor em posicionamento, linguagem, ofertas, presença, ativos e infraestrutura digital.",
    deliverable:"Mapa de Ativos Digitais e Arquitetura de Presença e Oferta",
    work:["Definir o posicionamento estratégico","Desenvolver a identidade de linguagem","Planejar a presença digital","Organizar a estrutura da marca e a comunicação","Definir os ativos digitais necessários","Estruturar a oferta de produtos e serviços","Organizar a arquitetura comercial do negócio","Planejar a aquisição e o relacionamento com clientes","Estruturar soluções B2B","Desenvolver soluções para empresas","Organizar as possibilidades de monetização","Planejar a integração dos ativos digitais ao ecossistema Akasha Hub"],
    apps:[
      ["Website Studio","/afplataforma/website-studio/"],["App Builder","/afplataforma/app-builder/"],["Funil Builder","/afplataforma/funil-builder/"],
      ["CRM Inteligente","/afplataforma/crm-inteligente/"],["SDR OS","/afplataforma/sdr-os/"],["IA Studio","/afplataforma/ia-studio/"],
      ["Produtos Digitais","/afplataforma/produtos-digitais/"],["Central de Ativos","/afplataforma/central-de-ativos/"]
    ],
    support:["Construtor de oferta","Diagnóstico de ativos","Pitch de 60 segundos","Oratória","Mapa de rede","Biblioteca de soluções / portfólio do Império Digital"],
    next:"AF · organizar números, caixa, preço, metas e sustentabilidade econômica.",
    notes:"A lista de pontos de trabalho é uma síntese operacional da plataforma, não uma declaração de pilares oficiais. Registrar titularidade, permissão, acesso e localização das fontes dos ativos quando relevante."
  },
  {
    id:"AF", number:"03", name:"Alinhamento Financeiro", short:"Organização, capital e sustentabilidade",
    objective:"Compreender e organizar a situação financeira pessoal e empresarial, o capital, o fluxo, as metas e a sustentabilidade das ofertas.",
    deliverable:"Diagnóstico Financeiro e Plano de Organização e Sustentabilidade",
    work:["Sustentar o projeto por meio de decisões financeiras e comerciais","Organizar o fluxo de caixa","Acompanhar indicadores financeiros","Estruturar a precificação","Definir metas financeiras e comerciais","Revisar receitas, despesas e custos","Organizar o planejamento financeiro","Avaliar a sustentabilidade econômica das ofertas","Organizar as decisões comerciais da consolidação","Acompanhar os resultados e revisar a estratégia"],
    apps:[
      ["Fluxo de Caixa OS","/afplataforma/fluxo-de-caixa/"],["Precificação","/afplataforma/precificacao/"],["Indicadores Financeiros","/afplataforma/indicadores-financeiros/"],
      ["Metas Financeiras","/afplataforma/metas-financeiras/"],["Planejamento Financeiro","/afplataforma/planejamento-financeiro/"],
      ["Sustentabilidade das Ofertas","/afplataforma/sustentabilidade-ofertas/"],["Decisões Comerciais","/afplataforma/decisoes-comerciais/"],["Acompanhamento de Resultados","/afplataforma/acompanhamento-resultados/"]
    ],
    support:["Cash-Flow","Modo Sono","Metas","Ideias / Ideation","Mapa de Rede","Tarefas","QuiteI e ferramentas complementares"],
    next:"EX · estruturar processos, responsabilidades, aquisição e expansão sustentável.",
    notes:"Faturamento, lucro, caixa e patrimônio são conceitos distintos. Projeções devem ser identificadas como projeções e usar apenas dados fornecidos. Não duplicar cálculos e registros dos aplicativos existentes."
  },
  {
    id:"EX", number:"04", name:"Expansão", short:"Processos, operação e crescimento",
    objective:"Reduzir dependências do fundador, organizar a operação, estruturar responsabilidades, aquisição, marketing e crescimento sustentável.",
    deliverable:"Mapa Operacional, Processos Prioritários e Plano de Expansão",
    work:["Identificar o que depende diretamente do fundador","Organizar os processos operacionais","Estruturar responsabilidades e funções","Identificar o que pode ser padronizado","Documentar processos e procedimentos","Organizar fluxos de trabalho","Definir como a operação é acompanhada","Estruturar a distribuição de responsabilidades","Melhorar a previsibilidade operacional","Definir onde o projeto aparece","Organizar o que se publica nesta semana","Separar divulgação orgânica e tráfego pago","Olhar o que foi publicado, não o que foi prometido"],
    apps:[
      ["Dependências do Fundador","/afplataforma/dependencias-fundador/"],["Processos Operacionais","/afplataforma/processos-operacionais/"],
      ["Responsabilidades e Funções","/afplataforma/responsabilidades/"],["Padronização","/afplataforma/padronizacao/"],["Documentação","/afplataforma/documentacao/"],
      ["Fluxos de Trabalho","/afplataforma/fluxos-trabalho/"],["Acompanhamento da Operação","/afplataforma/acompanhamento-operacao/"],["Divulgação e Presença","/afplataforma/divulgacao/"]
    ],
    support:["SDR OS","Treinamento","Closers OS (validar disponibilidade do app independente)","CRM Inteligente","Funil Builder","Acompanhamento de Resultados"],
    next:"LG · preservar conhecimento, estruturar governança, patrimônio e continuidade.",
    notes:"SDR, Treinamento e Closers continuam módulos específicos. A matriz não declara esses módulos completos; validar disponibilidade e estado funcional antes de prometer execução."
  },
  {
    id:"LG", number:"05", name:"Legado", short:"Patrimônio, transmissão e continuidade",
    objective:"Organizar a transmissão da metodologia, os princípios, a comunidade, a continuidade e a preservação do que foi construído.",
    deliverable:"Mapa de Legado e Plano de Continuidade e Transmissão",
    work:["Estruturar a comunidade","Organizar a transmissão da metodologia","Sistematizar os princípios do ecossistema","Estruturar mecanismos de continuidade","Organizar o relacionamento de longo prazo","Criar uma estrutura para preservar e transmitir o que foi desenvolvido","Organizar a participação contínua no ecossistema","Planejar a evolução da comunidade","Estabelecer o acompanhamento da continuidade","Ligar a comunidade às outras fases","Documentar o que continua funcionando sem o fundador","Ler o negócio como quem compra ou como quem vende","Nomear a comunidade, o movimento e a doutrina"],
    apps:[
      ["Comunidade","/afplataforma/comunidade/"],["Transmissão da Metodologia","/afplataforma/transmissao-metodologia/"],
      ["Princípios do Ecossistema","/afplataforma/principios-ecossistema/"],["Continuidade","/afplataforma/continuidade/"],
      ["Relacionamento de Longo Prazo","/afplataforma/relacionamento-longo-prazo/"],["Preservação e Transmissão","/afplataforma/preservacao/"],
      ["Evolução da Comunidade","/afplataforma/evolucao-comunidade/"],["Legado sem o Fundador","/afplataforma/legado-sem-fundador/"]
    ],
    support:["Declaração de Legado","Livro do Método","Zen Negócios","Akasha Trading","Legacy Vault","Mapa Patrimonial"],
    next:"Ciclo contínuo · revisar a direção, atualizar capacidades e transmitir conhecimento.",
    notes:"Registros históricos não são apagados ou renomeados. Serviços jurídicos, contábeis, sucessórios e regulados exigem validação de profissionais habilitados."
  }
];

const DEPT_PHASE_REASON = {
  essencia:"A investigação de identidade e direção inicia a jornada.",
  branding:"A identidade começa na essência e se materializa em marca e comunicação no Império Digital.",
  tecnologia:"A infraestrutura e os produtos digitais são construídos na fase Império Digital.",
  financeiro:"Organização financeira, capital e sustentabilidade são o núcleo da fase AF.",
  marketing:"Posicionamento e aquisição começam na estrutura digital e continuam na expansão.",
  comercial:"Vendas são resultado sistêmico: identidade e valor percebido, marca e comunicação, ativos digitais, preço e margem, aquisição, processo comercial, entrega e continuidade influenciam o resultado ao longo das cinco fases.",
  internacional:"A estrutura empresarial prepara expansão e continuidade em novos mercados.",
  automacao:"Sistemas e automações apoiam ativos digitais, operação e continuidade.",
  educacao:"Conhecimento vira ativo digital, método transmissível e formação para continuidade.",
  legado:"Patrimônio, governança e continuidade sustentam a fase Legado."
};
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const STATUS = ["Existente","Estruturado","Em desenvolvimento","Sob demanda"];
const norm = (v) => String(v || "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();

function flattenCatalog() {
  return CATALOG.flatMap(dept => {
    let n = 0;
    return dept.groups.flatMap(([group, items]) => items.map(title => {
      n++;
      const id = DEPT_CODES[dept.id] + "-C" + String(n).padStart(2,"0");
      const phases = CAPABILITY_PHASES[id] || DEPT_PHASES[dept.id] || [];
      return {
        id,
        departmentId:dept.id, departmentCode:DEPT_CODES[dept.id], department:dept.name,
        group, title, phases, phase: phases[0] || "",
        contextScope:getCapabilityContextScope(id, dept.id),
        reason:DEPT_PHASE_REASON[dept.id] || ""
      };
    }));
  });
}
const CAPABILITIES = flattenCatalog();
const PROMPT_VARIABLES = [["NOME_DO_CLIENTE_OU_EMPRESA","Nome da pessoa, marca ou empresa atendida."],["SEGMENTO_E_MODELO_DE_NEGOCIO","Setor, atividade, como vende e como gera receita."],["PAIS_CIDADE_E_MERCADO","País, cidade, região e mercado em que atua."],["ESTAGIO_ATUAL_E_HISTORICO","Momento atual, trajetória e acontecimentos relevantes."],["OBJETIVO_PRINCIPAL_E_RESULTADO_ESPERADO","O que deseja alcançar e como reconhecer o resultado."],["PROBLEMA_OU_OPORTUNIDADE","Desafio central ou oportunidade que deseja aproveitar."],["PUBLICO_E_CLIENTE_IDEAL","Pessoas ou empresas que deseja atender."],["OFERTA_PRODUTO_SERVICO","Produtos, serviços, pacotes, preços e diferenciais conhecidos."],["DADOS_E_INDICADORES_DISPONIVEIS","Números e indicadores já registrados nas ferramentas."],["RECURSOS_ORCAMENTO_E_RESTRICOES","Equipe, tempo, orçamento, limites e recursos disponíveis."],["PRAZO_E_PRIORIDADE","Prazo desejado e nível de prioridade."],["ATIVOS_FERRAMENTAS_E_PROCESSOS_EXISTENTES","Sites, sistemas, canais, ferramentas e processos já utilizados."],["DECISOES_JA_TOMADAS_E_PREFERENCIAS","Decisões confirmadas, preferências e coisas que não devem mudar."],["FONTES_DOCUMENTOS_E_REFERENCIAS_AUTORIZADAS","Links e documentos que podem ser consultados."],["FORMATO_DO_ENTREGAVEL","Formato esperado: diagnóstico, plano, roteiro, tabela, código etc."],["RESPONSAVEL_PELA_VALIDACAO","Pessoa que revisa e aprova o resultado."]];


const AKASHA_HUB_EXAMPLE = {
  NOME_DO_CLIENTE_OU_EMPRESA: "Akasha Hub",
  SEGMENTO_E_MODELO_DE_NEGOCIO: "Ecossistema de tecnologia e estratégia empresarial: desenvolvimento web e full-stack, sites, aplicativos, plataformas digitais, produtos digitais, integrações, automação e inteligência artificial aplicada. Modelo de negócio com serviços e processo executivo premium, produtos digitais e plano de assinaturas recorrentes para acesso à plataforma.",
  PAIS_CIDADE_E_MERCADO: "Base no Brasil. Expansão planejada para Europa, Estados Unidos e mercados de língua portuguesa, espanhola e italiana.",
  ESTAGIO_ATUAL_E_HISTORICO: "Operação em estruturação, consolidação e expansão. A marca já possui domínio próprio, repositório de código, plataforma digital, catálogo de capacidades, Biblioteca de Prompts e processo executivo em desenvolvimento.",
  OBJETIVO_PRINCIPAL_E_RESULTADO_ESPERADO: "Consolidar a Arquitetura de Legado e construir um ecossistema integrado e internacional, com produtos digitais, serviços premium, plataforma própria e receitas recorrentes por assinatura.",
  PROBLEMA_OU_OPORTUNIDADE: "Organizar e conectar as frentes já existentes em uma operação clara e escalável; consolidar a Arquitetura de Legado; estruturar uma modalidade de assinatura independente da mentoria; integrar um Academy com vídeos e aulas; preparar a expansão internacional.",
  PUBLICO_E_CLIENTE_IDEAL: "Empresários, investidores e empreendedores. Prioridade para pessoas com negócios estabelecidos e alta capacidade de investimento, sem excluir empreendedores em fase de crescimento que se encaixem nos produtos e serviços adequados.",
  OFERTA_PRODUTO_SERVICO: "Oferta premium: Arquitetura de Legado, processo executivo de 12 meses, valor de referência R$ 39.000, organizado em cinco fases: Arquitetura de Essência, Império Digital, Alinhamento Financeiro, Expansão e Legado. Outras frentes: desenvolvimento de sites, aplicativos e plataformas; soluções digitais; produtos digitais; posicionamento; automação; IA aplicada; Alinhamento Financeiro e Zen Negócios. Oferta futura: assinatura independente para acesso à plataforma e ao Academy.",
  DADOS_E_INDICADORES_DISPONIVEIS: "Condição comercial de referência da Arquitetura de Legado: R$ 39.000 por 12 meses. Catálogo de Capacidades: 10 departamentos e 167 capacidades. Biblioteca de Prompts: 70 receitas especializadas cadastradas. Esses números descrevem estrutura e oferta, não faturamento ou resultados financeiros realizados. Indicadores financeiros reais ainda devem ser informados a partir dos registros da empresa.",
  RECURSOS_ORCAMENTO_E_RESTRICOES: "Recursos conhecidos: domínio akashahub.com.br, repositório GitHub, Firebase, Google Drive, plataforma própria, catálogo de capacidades, Biblioteca de Prompts e conhecimento estratégico e técnico. Orçamento disponível, tamanho da equipe e limites financeiros não foram definidos neste exemplo e não devem ser presumidos.",
  PRAZO_E_PRIORIDADE: "Curto prazo: consolidar a Arquitetura de Legado e a operação interna. Médio prazo: estruturar Academy, assinaturas e permissões de acesso. Longo prazo: expansão internacional, crescimento das receitas recorrentes e desenvolvimento de ativos empresariais e patrimoniais.",
  ATIVOS_FERRAMENTAS_E_PROCESSOS_EXISTENTES: "Site akashahub.com.br; repositório GitHub akashahub/AKASHAHUB; Firebase/Firestore; Google Drive; AF Plataforma; Catálogo de Capacidades; Biblioteca de Prompts; Dossiê; Gestão do Mentor; Arquitetura de Legado; frentes Alinhamento Financeiro e Zen Negócios. A existência de um módulo não significa que toda integração esteja concluída ou validada.",
  DECISOES_JA_TOMADAS_E_PREFERENCIAS: "A Arquitetura de Legado é a oferta premium central, com valor de referência de R$ 39.000 e duração de 12 meses. O ecossistema terá uma assinatura de plataforma separada da mentoria. A assinatura não inclui chamadas, mentoria, processo executivo, materiais extras exclusivos, biblioteca de conteúdos exclusiva nem Biblioteca de Prompts. O Academy será integrado para oferecer vídeos e aulas conforme o plano. Separar permissões de assinantes, mentorandos e mentores. Preservar sistemas, dados e funcionalidades existentes; não presumir automações ou integrações não testadas.",
  FONTES_DOCUMENTOS_E_REFERENCIAS_AUTORIZADAS: "Site oficial: https://akashahub.com.br/ . Repositório: https://github.com/akashahub/AKASHAHUB . Documentação e arquivos internos do projeto, registros do Firebase/Firestore e materiais fornecidos pelo responsável, respeitando as permissões de acesso.",
  FORMATO_DO_ENTREGAVEL: "Diagnósticos, estratégias práticas, planos de execução, arquitetura de sistemas, páginas e aplicativos funcionais, documentação, processos operacionais, materiais executivos e entregáveis aplicáveis ao negócio.",
  RESPONSAVEL_PELA_VALIDACAO: "Fundador e direção estratégica do Akasha Hub."
};

const SHARED_CONTEXT_BY_SCOPE = { personal:Object.create(null), business:Object.create(null), hybrid:Object.create(null) };
let activeSharedContextScope = "hybrid";
let SHARED_CONTEXT = SHARED_CONTEXT_BY_SCOPE.hybrid;
let sharedContextCloudState = "idle";
function selectedContextUid() {
  const context = activeHubContext();
  return context?.uid || session.uid || "";
}
function applySharedContext(prompt, scope="hybrid") {
  const allowed = new Set(getContextKeysForScope(scope));
  const source = SHARED_CONTEXT_BY_SCOPE[scope] || {};
  return PROMPT_VARIABLES.reduce((text,[key])=>{
    const value=allowed.has(key) ? String(source[key]||"").trim() : "";
    const replacement = value || (allowed.has(key) ? "{{"+key+"}}" : "[Não aplicável ao escopo "+getContextScopeMeta(scope).label.toLowerCase()+"]");
    return text.replaceAll("{{"+key+"}}",replacement);
  },String(prompt||""));
}

function sharedContextMarkup() {
  const count=PROMPT_VARIABLES.filter(([key])=>String(SHARED_CONTEXT[key]||"").trim()).length;
  return '<div class="pm-context-panel"><div class="pm-context-head"><div><div class="pm-eyebrow">AKASHA HUB · CONTEXTO DO PROJETO</div><h2>Ficha Única do Projeto</h2><p>Contextos pessoal, empresarial e híbrido ficam separados. Cada prompt usa somente o escopo correspondente.</p></div><button type="button" class="pm-copy-prompt" data-pm-open-context>Revisar e preencher variáveis</button></div><div class="pm-context-summary"><strong>'+count+' de '+PROMPT_VARIABLES.length+' variáveis preenchidas · '+esc(getContextScopeMeta(activeSharedContextScope).label)+'</strong><span id="pmContextCloudStatus">Os dados compartilhados serão carregados da conta selecionada.</span></div><div class="pm-context-list">'+PROMPT_VARIABLES.map(([key,desc],i)=>'<article><span>'+String(i+1).padStart(2,"0")+'</span><div><strong>'+esc(key.replaceAll("_"," ").toLowerCase())+'</strong><p>'+esc(desc)+'</p><small>'+(String(SHARED_CONTEXT[key]||"").trim()?"Preenchida":"Ainda não preenchida")+'</small></div></article>').join("")+'</div></div>';
}

function sharedContextModalMarkup() {
  return '<div class="pm-context-overlay" data-pm-context-overlay hidden><section class="pm-context-modal" role="dialog" aria-modal="true" aria-labelledby="pmContextTitle"><div class="pm-context-modal-head"><div><div class="pm-eyebrow">FICHA ÚNICA DO PROJETO</div><h2 id="pmContextTitle">Revisar contexto compartilhado</h2><p>Escolha o escopo e a fonte. A importação preenche apenas campos vazios e preserva a origem de cada informação.</p><button type="button" class="pm-back" data-pm-load-akasha-example>Preencher com exemplo do Akasha Hub</button></div><button type="button" class="pm-context-close" data-pm-close-context aria-label="Fechar">×</button></div><div class="pm-context-fields"><label class="pm-context-field"><span>Escopo desta ficha</span><select id="pmContextScopeSelect" data-pm-context-scope><option value="personal">Pessoal</option><option value="business">Empresarial</option><option value="hybrid" selected>Híbrido · pessoal + empresa</option></select></label><div class="pm-context-field"><span>Importar do Cadastro Inteligente</span><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px"><select id="pmDossierBusiness"><option value="">Selecione um negócio</option></select><select id="pmDossierProject"><option value="">Sem projeto específico</option></select></div><button type="button" class="pm-back" data-pm-import-dossier style="margin-top:8px">Importar dados selecionados</button><small>Os dados importados ficam como rascunho nesta ficha até você salvar. Valores já preenchidos são preservados.</small></div>'+PROMPT_VARIABLES.map(([key,desc],i)=>'<label class="pm-context-field"><span>'+String(i+1).padStart(2,"0")+' · '+esc(key.replaceAll("_"," ").toLowerCase())+'</span><small>'+esc(desc)+'</small><textarea rows="2" data-pm-context-key="'+esc(key)+'" placeholder="">'+esc(SHARED_CONTEXT[key]||"")+'</textarea></label>').join("")+'</div><div class="pm-context-modal-actions"><span id="pmContextStatus">Campos opcionais. Revise a origem e confirme antes de salvar.</span><button type="button" class="pm-back" data-pm-close-context>Cancelar</button><button type="button" class="pm-copy-prompt" data-pm-save-context>Salvar contexto compartilhado</button></div></section></div>';
}

function loadAkashaHubExample(root) {
  const overlay=root.querySelector("[data-pm-context-overlay]");
  if(!overlay) return;
  overlay.querySelectorAll("[data-pm-context-key]").forEach(field=>{
    field.value=AKASHA_HUB_EXAMPLE[field.dataset.pmContextKey]||"";
  });
  const status=overlay.querySelector("#pmContextStatus");
  if(status) status.textContent="Exemplo completo do Akasha Hub carregado nesta ficha. Ainda não foi salvo no Firestore.";
  const button=overlay.querySelector("[data-pm-save-context]");
  if(button) button.textContent="Salvar contexto compartilhado";
}
async function populateDossierSelectors(root) {
  const uid=selectedContextUid(), overlay=root.querySelector("[data-pm-context-overlay]");
  const businessSelect=overlay?.querySelector("#pmDossierBusiness"), projectSelect=overlay?.querySelector("#pmDossierProject");
  if(!uid||!businessSelect||!projectSelect)return;
  try{
    const snap=await getDoc(doc(db,"users",uid));
    const d=snap.exists()?snap.data()?.afDossier||{}:{};
    const businesses=Array.isArray(d.businesses)?d.businesses.filter(x=>!x.archivedAt):[];
    const projects=Array.isArray(d.projects)?d.projects.filter(x=>!x.archivedAt):[];
    const oldBusiness=businessSelect.value,oldProject=projectSelect.value;
    businessSelect.innerHTML='<option value="">Selecione um negócio</option>'+businesses.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name||"Negócio sem nome")+'</option>').join("");
    projectSelect.innerHTML='<option value="">Sem projeto específico</option>'+projects.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name||"Projeto sem nome")+'</option>').join("");
    if(businesses.some(x=>x.id===oldBusiness))businessSelect.value=oldBusiness;
    if(projects.some(x=>x.id===oldProject))projectSelect.value=oldProject;
  }catch(error){console.warn("[Biblioteca] Não consegui carregar as opções do Dossiê:",error?.code||error?.message||error);}
}
async function openSharedContext(root) {
  const overlay=root.querySelector("[data-pm-context-overlay]");
  if(!overlay) return;
  if(sharedContextCloudState!=="loaded") {
    const cloudStatus=root.querySelector("#pmContextCloudStatus");
    if(cloudStatus) cloudStatus.textContent="Aguarde o carregamento do contexto salvo antes de editar.";
    return;
  }
  const selector=overlay.querySelector("#pmContextScopeSelect");
  activeSharedContextScope=selector?.value||activeSharedContextScope;
  SHARED_CONTEXT=SHARED_CONTEXT_BY_SCOPE[activeSharedContextScope];
  overlay.querySelectorAll("[data-pm-context-key]").forEach(field=>field.value=SHARED_CONTEXT[field.dataset.pmContextKey]||"");
  overlay.hidden=false;
  await populateDossierSelectors(root);
  const first=overlay.querySelector("textarea");
  if(first) first.focus();
}

function refreshOpenPrompt(root) {
  const active=root.querySelector("#pmPanel");
  const generic=active?.querySelector("[data-pm-capability]");
  const specialized=active?.querySelector("[data-pm-specialized-source]");
  if(generic){const c=CAPABILITIES.find(x=>x.id===generic.dataset.pmCapability);if(c)generic.value=applySharedContext(promptForCapability(c),c.contextScope);}
  if(specialized){const item=SPECIALIZED_PROMPTS.find(x=>x.id===specialized.dataset.pmSpecializedSource);if(item)specialized.value=applySharedContext(buildSpecializedPrompt(item),item.contextScope);}
}
async function loadSharedContext(root) {
  const uid=selectedContextUid(), status=root.querySelector("#pmContextCloudStatus");
  for(const scope of ["personal","business","hybrid"])PROMPT_VARIABLES.forEach(([key])=>{SHARED_CONTEXT_BY_SCOPE[scope][key]="";});
  if(!uid||session.mode!=="firebase"){
    sharedContextCloudState="unavailable";
    refreshOpenPrompt(root);
    if(status)status.textContent="Entre com a conta da plataforma para carregar o contexto salvo.";
    return;
  }
  sharedContextCloudState="loading";
  if(status)status.textContent="Carregando contextos pessoal, empresarial e híbrido...";
  try{
    const [personalSnap,businessSnap,hybridSnap,legacySnap]=await Promise.all([
      getDoc(doc(db,"afProjectContexts",uid,"projects","principal-personal")),
      getDoc(doc(db,"afProjectContexts",uid,"projects","principal-business")),
      getDoc(doc(db,"afProjectContexts",uid,"projects","principal-hybrid")),
      getDoc(doc(db,"afProjectContexts",uid,"projects","principal"))
    ]);
    const snaps={personal:personalSnap,business:businessSnap,hybrid:hybridSnap};
    for(const scope of ["personal","business","hybrid"]){
      let snap=snaps[scope];
      if(scope==="hybrid"&&!snap.exists()&&legacySnap.exists())snap=legacySnap;
      if(snap.exists()){
        const saved=snap.data()?.context&&typeof snap.data().context==="object"?snap.data().context:{};
        PROMPT_VARIABLES.forEach(([key])=>{SHARED_CONTEXT_BY_SCOPE[scope][key]=typeof saved[key]==="string"?saved[key]:"";});
      }
    }
    activeSharedContextScope="hybrid";
    SHARED_CONTEXT=SHARED_CONTEXT_BY_SCOPE.hybrid;
    sharedContextCloudState="loaded";
    const any=personalSnap.exists()||businessSnap.exists()||hybridSnap.exists()||legacySnap.exists();
    const cloudMessage=any?"Contextos carregados da conta de "+(activeHubContext()?.name||session.name||"cliente selecionado")+".":"Ainda não existem fichas salvas. Você pode importar o Cadastro Inteligente ou preencher manualmente.";
    if(status)status.textContent=cloudMessage;
    if(root.querySelector('[data-pm-tab="context"]')?.classList.contains("is-active")){
      const panel=root.querySelector("#pmPanel");
      if(panel){panel.innerHTML=sharedContextMarkup();const refreshed=panel.querySelector("#pmContextCloudStatus");if(refreshed)refreshed.textContent=cloudMessage;}
    }else refreshOpenPrompt(root);
  }catch(error){
    console.error("[Biblioteca de Prompts] Falha ao carregar contexto:",error);
    sharedContextCloudState="error";refreshOpenPrompt(root);
    if(status)status.textContent="Não consegui carregar os contextos. Confira o acesso e tente novamente.";
  }
}

async function saveSharedContext(root) {
  const overlay=root.querySelector("[data-pm-context-overlay]");
  if(!overlay)return;
  const uid=selectedContextUid(),status=overlay.querySelector("#pmContextStatus");
  if(!uid||session.mode!=="firebase"){if(status)status.textContent="Entre com a conta da plataforma antes de salvar.";return;}
  activeSharedContextScope=overlay.querySelector("#pmContextScopeSelect")?.value||activeSharedContextScope;
  SHARED_CONTEXT=SHARED_CONTEXT_BY_SCOPE[activeSharedContextScope];
  const next=Object.create(null);
  overlay.querySelectorAll("[data-pm-context-key]").forEach(field=>{next[field.dataset.pmContextKey]=field.value.trim().slice(0,5000);});
  const button=overlay.querySelector("[data-pm-save-context]");
  if(button){button.disabled=true;button.textContent="Salvando...";}
  if(status)status.textContent="Salvando ficha "+getContextScopeMeta(activeSharedContextScope).label.toLowerCase()+"...";
  try{
    await setDoc(doc(db,"afProjectContexts",uid,"projects","principal-"+activeSharedContextScope),{
      ownerUid:uid,context:next,schemaVersion:1,updatedBy:session.uid,updatedAt:serverTimestamp()
    });
    PROMPT_VARIABLES.forEach(([key])=>{SHARED_CONTEXT_BY_SCOPE[activeSharedContextScope][key]=next[key]||"";});
    SHARED_CONTEXT=SHARED_CONTEXT_BY_SCOPE[activeSharedContextScope];
    sharedContextCloudState="loaded";overlay.hidden=true;
    const panel=root.querySelector("#pmPanel");
    if(panel&&root.querySelector('[data-pm-tab="context"]')?.classList.contains("is-active"))panel.innerHTML=sharedContextMarkup();
    refreshOpenPrompt(root);
    const cloudStatus=root.querySelector("#pmContextCloudStatus");
    if(cloudStatus)cloudStatus.textContent="Ficha "+getContextScopeMeta(activeSharedContextScope).label.toLowerCase()+" salva para o cliente selecionado.";
  }catch(error){
    console.error("[Biblioteca de Prompts] Falha ao salvar contexto:",error);
    if(status)status.textContent="Não foi possível salvar. Verifique as permissões do Firestore e tente novamente.";
  }finally{if(button){button.disabled=false;button.textContent="Salvar contexto compartilhado";}}
}

async function importDossierIntoContext(root) {
  const uid=selectedContextUid(),overlay=root.querySelector("[data-pm-context-overlay]"),status=overlay?.querySelector("#pmContextStatus");
  if(!uid||session.mode!=="firebase"){if(status)status.textContent="Entre com a conta da plataforma antes de importar.";return;}
  const scope=overlay.querySelector("#pmContextScopeSelect")?.value||"hybrid";
  const businessId=overlay.querySelector("#pmDossierBusiness")?.value||"";
  const projectId=overlay.querySelector("#pmDossierProject")?.value||"";
  if(scope!=="personal"&&!businessId){if(status)status.textContent="Selecione um negócio para importar contexto empresarial ou híbrido.";return;}
  if(status)status.textContent="Lendo o Cadastro Inteligente...";
  try{
    const snap=await getDoc(doc(db,"users",uid)),d=snap.exists()?snap.data()?.afDossier||{}:{};
    const personal=d.personal||{};
    const biz=(d.businesses||[]).find(x=>x.id===businessId&&!x.archivedAt)||null;
    const project=(d.projects||[]).find(x=>x.id===projectId&&!x.archivedAt)||null;
    if(scope!=="personal"&&!biz){if(status)status.textContent="O negócio selecionado não foi encontrado. Atualize a lista.";return;}
    const allowed=new Set(getContextKeysForScope(scope)),mapped={};
    const source=(name,value)=>String(value||"").trim()?{source:name,text:String(value).trim()}:null;
    const combine=(key,parts)=>{
      if(!allowed.has(key))return;
      const valid=parts.filter(Boolean);
      if(valid.length)mapped[key]=valid.map(x=>"Fonte: Cadastro Inteligente · "+x.source+"\n"+x.text).join("\n\n");
    };
    const pName=source("Perfil pessoal · Identidade do empreendedor",[personal.fullName,personal.preferredName].filter(Boolean).join(" · "));
    const bName=source("Dossiê empresarial · "+(biz?.name||"Empresa"),biz?.name);
    combine("NOME_DO_CLIENTE_OU_EMPRESA",[pName,bName]);
    combine("SEGMENTO_E_MODELO_DE_NEGOCIO",[source("Empresa · Identidade",biz?[biz.sector,biz.businessModel].filter(Boolean).join(" · "):"")]);
    combine("PAIS_CIDADE_E_MERCADO",[
      source("Perfil pessoal · Localização",[personal.city,personal.country].filter(Boolean).join(" · ")),
      source("Empresa · Localização",[biz?.city,biz?.country,biz?.expansion?.targetMarkets].filter(Boolean).join(" · "))
    ]);
    combine("ESTAGIO_ATUAL_E_HISTORICO",[
      source("Perfil pessoal · Trajetória",[personal.trajectory,personal.education].filter(Boolean).join("\n")),
      source("Empresa · Estágio e descrição",[biz?.stage,biz?.description].filter(Boolean).join("\n"))
    ]);
    combine("OBJETIVO_PRINCIPAL_E_RESULTADO_ESPERADO",[
      source("Perfil pessoal · Objetivos",personal.goals),
      source("Projeto · Objetivo",project?.objective)
    ]);
    combine("PROBLEMA_OU_OPORTUNIDADE",[
      source("Projeto · Contexto",project?.notes),
      source("Empresa · Expansão",[biz?.expansion?.opportunities,biz?.expansion?.constraints].filter(Boolean).join("\n"))
    ]);
    combine("PUBLICO_E_CLIENTE_IDEAL",[source("Empresa · Posicionamento",biz?.brand?.audience)]);
    combine("OFERTA_PRODUTO_SERVICO",[source("Empresa · Comercial",[biz?.commercial?.productsServices,biz?.commercial?.pricing].filter(Boolean).join("\n"))]);
    combine("DADOS_E_INDICADORES_DISPONIVEIS",[source("Empresa · Financeiro",[biz?.finance?.revenueBand,biz?.finance?.costsBand,biz?.finance?.cashflowStatus,biz?.commercial?.averageTicket].filter(Boolean).join("\n"))]);
    combine("RECURSOS_ORCAMENTO_E_RESTRICOES",[source("Empresa · Operação e financeiro",[biz?.operations?.teamSize,biz?.operations?.roles,biz?.operations?.processes,biz?.finance?.capitalBand].filter(Boolean).join("\n"))]);
    combine("PRAZO_E_PRIORIDADE",[source("Projeto · Prazo e status",[project?.deadline,project?.status].filter(Boolean).join(" · "))]);
    combine("ATIVOS_FERRAMENTAS_E_PROCESSOS_EXISTENTES",[source("Empresa · Ativos digitais",[biz?.digital?.website,biz?.digital?.socialProfiles,biz?.digital?.crm,biz?.digital?.channels,biz?.digital?.tools,biz?.operations?.systems].filter(Boolean).join("\n"))]);
    combine("DECISOES_JA_TOMADAS_E_PREFERENCIAS",[
      source("Perfil pessoal · Competências",personal.competencies),
      source("Empresa · Marca",[biz?.brand?.positioning,biz?.brand?.valueProposition,biz?.brand?.differentiators].filter(Boolean).join("\n"))
    ]);
    combine("FONTES_DOCUMENTOS_E_REFERENCIAS_AUTORIZADAS",[source("Empresa · Referências",[biz?.website,biz?.digital?.website,biz?.digital?.socialProfiles].filter(Boolean).join("\n"))]);
    combine("RESPONSAVEL_PELA_VALIDACAO",[source("Sessão",session.name||session.email||"Mentor e participante")]);
    activeSharedContextScope=scope;SHARED_CONTEXT=SHARED_CONTEXT_BY_SCOPE[scope];
    let added=0;
    for(const [key,value] of Object.entries(mapped)){
      if(!String(SHARED_CONTEXT[key]||"").trim()){SHARED_CONTEXT[key]=value;added++;}
    }
    overlay.querySelectorAll("[data-pm-context-key]").forEach(field=>field.value=SHARED_CONTEXT[field.dataset.pmContextKey]||"");
    if(status)status.textContent=added+" variáveis importadas. Campos já preenchidos foram preservados. Revise as origens e salve a ficha.";
    const selector=overlay.querySelector("#pmContextScopeSelect");if(selector)selector.value=scope;
  }catch(error){
    console.error("[Biblioteca] Falha ao importar Cadastro Inteligente:",error);
    if(status)status.textContent="Não foi possível importar. Verifique as permissões do perfil selecionado.";
  }
}

function contextPill(scope) {
  const meta=getContextScopeMeta(scope);
  return '<span class="pm-phase-pill pm-context-pill" title="Fonte de contexto: '+esc(meta.sourceLabel)+'">'+esc(meta.shortLabel)+'</span>';
}
function phasePills(ids) {
  return ids.map(id => {
    const p = PHASES.find(x => x.id === id);
    return p ? '<span class="pm-phase-pill">'+p.id+'</span>' : "";
  }).join("");
}
function appMarkup(apps) {
  return apps.map(([name,url]) => url
    ? '<a class="pm-app" href="'+esc(url)+'" target="_self">'+esc(name)+' <span>↗</span></a>'
    : '<span class="pm-app pm-app-pending">'+esc(name)+' <small>rota a confirmar</small></span>'
  ).join("");
}
function renderPhaseCards() {
  return PHASES.map(p => '<article class="pm-phase-card" data-phase-card="'+p.id+'"><div class="pm-card-top"><span>FASE '+p.number+'</span><b>'+p.id+'</b></div><h3>'+esc(p.name)+'</h3><p>'+esc(p.objective)+'</p><div class="pm-deliverable"><small>ENTREGÁVEL CENTRAL</small><strong>'+esc(p.deliverable)+'</strong></div><button type="button" class="pm-open-phase" data-pm-phase="'+p.id+'">Ver fase e aplicativos <span>→</span></button></article>').join("");
}
function renderCapabilityRows(rows) {
  if (!rows.length) return '<div class="pm-empty">Nenhuma capacidade corresponde aos filtros atuais.</div>';
  return rows.map(c => '<article class="pm-cap-row"><div class="pm-cap-code">'+esc(c.id)+'</div><div class="pm-cap-main"><strong>'+esc(c.title)+'</strong><small>'+esc(c.department.replace(/^\d+ · /,""))+' · '+esc(c.group)+'</small><p>'+esc(c.reason)+'</p><button type="button" class="pm-build-prompt" data-pm-prompt="'+esc(c.id)+'">Construir prompt <span>↗</span></button></div><div class="pm-cap-meta">'+contextPill(c.contextScope)+phasePills(c.phases)+'<span class="pm-unclassified">Estado a classificar</span></div></article>').join("");
}
function renderMatrixView() {
  const deptCards = CATALOG.map(d => {
    const caps = CAPABILITIES.filter(c => c.departmentId === d.id);
    const phases = [...new Set(caps.flatMap(c => c.phases))];
    return '<article class="pm-dept-card"><div class="pm-dept-head"><span>'+DEPT_CODES[d.id]+'</span><div><h3>'+esc(d.name.replace(/^\d+ · /,""))+'</h3><p>'+esc(d.summary)+'</p></div><b>'+caps.length+'</b></div><div class="pm-dept-phases">'+phasePills(phases)+'</div><details><summary>Ver '+caps.length+' capacidades</summary><div class="pm-dept-cap-list">'+caps.map(c => '<div><code>'+esc(c.id)+'</code>'+contextPill(c.contextScope)+' '+esc(c.title)+'</div>').join("")+'</div></details></article>';
  }).join("");
  return '<div class="pm-dept-grid">'+deptCards+'</div>';
}
function phaseDocumentation(p) {
  const depts = CATALOG.filter(d => (DEPT_PHASES[d.id] || []).includes(p.id));
  const caps = CAPABILITIES.filter(c => c.phases.includes(p.id));
  return [
    'AKASHA HUB · DOCUMENTAÇÃO DA FASE',
    'FASE ' + p.number + ' · ' + p.id + ' · ' + p.name,
    '', 'OBJETIVO', p.objective, '', 'ENTREGÁVEL CENTRAL', p.deliverable, '',
    'TRABALHO PRINCIPAL', ...p.work.map((x,i) => (i+1)+'. '+x), '',
    'APLICATIVOS CADASTRADOS', ...p.apps.map(([name,url]) => '- '+name+(url ? ' · https://akashahub.com.br'+url : ' · rota a confirmar')), '',
    'FERRAMENTAS E APOIOS (integração não presumida)', ...p.support.map(x => '- '+x), '',
    'DEPARTAMENTOS CONECTADOS', ...depts.map(d => '- '+d.name), '',
    'CAPACIDADES RELACIONADAS', ...caps.map(c => '- '+c.id+' · '+c.title), '',
    'CONEXÃO SEGUINTE', p.next, '', 'OBSERVAÇÕES', p.notes, '',
    'NOTA: este mapa documenta relações planejadas/cadastradas. Não comprova que cada aplicativo esteja ativo ou sincronizado.'
  ].join('\n');
}
function copyText(text, status) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => { if(status) status.textContent='Copiado. Agora é só colar onde quiser.'; }, () => { if(status) status.textContent='Não foi possível copiar automaticamente. Selecione o texto e use Ctrl+C.'; });
  } else if(status) status.textContent='Cópia automática indisponível neste navegador.';
}
function renderPhaseDetail(id) {
  const p = PHASES.find(x => x.id === id); if (!p) return '';
  const depts = CATALOG.filter(d => (DEPT_PHASES[d.id] || []).includes(id));
  const caps = CAPABILITIES.filter(c => c.phases.includes(id));
  return '<section class="pm-phase-detail"><button class="pm-back" type="button" data-pm-back>← Mapa mestre</button><div class="pm-phase-heading"><span>FASE '+p.number+' · '+p.id+'</span><h2>'+esc(p.name)+'</h2><p>'+esc(p.objective)+'</p></div><div class="pm-deliverable pm-deliverable-large"><small>ENTREGÁVEL CENTRAL</small><strong>'+esc(p.deliverable)+'</strong></div><div style="display:flex;flex-wrap:wrap;gap:8px;margin:16px 0"><button type="button" class="pm-copy-prompt" data-pm-copy-phase="'+p.id+'">Copiar documentação completa da fase</button><button type="button" class="pm-copy-prompt" data-pm-copy-apps="'+p.id+'">Copiar mapa de aplicativos</button><span id="pmPhaseCopyStatus" role="status" aria-live="polite"></span></div><div class="pm-detail-grid"><section><h3>Trabalho principal</h3><ol>'+p.work.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></section><section><h3>Aplicativos da fase</h3><div class="pm-app-list">'+appMarkup(p.apps)+'</div><h3>Ferramentas e apoios relacionados</h3><div class="pm-app-list">'+p.support.map(x=>'<span class="pm-app pm-app-pending">'+esc(x)+'</span>').join('')+'</div></section></div><div class="pm-related"><h3>Departamentos conectados</h3><div class="pm-related-depts">'+depts.map(d=>'<span>'+DEPT_CODES[d.id]+' · '+esc(d.name.replace(/^\\d+ · /,''))+'</span>').join('')+'</div><h3>Capacidades relacionadas · '+caps.length+'</h3><div class="pm-related-cap-list">'+caps.map(c=>'<div><code>'+esc(c.id)+'</code>'+esc(c.title)+'</div>').join('')+'</div></div><div class="pm-next"><small>CONEXÃO SEGUINTE</small><p>'+esc(p.next)+'</p></div><p class="pm-note">'+esc(p.notes)+'</p></section>';
}


function promptForCapability(c) {
 const phases=c.phases.map(id=>PHASES.find(p=>p.id===id)).filter(Boolean);
 const phaseContext=phases.length?phases.map(p=>p.id+" · "+p.name+": "+p.objective).join("\n"):"Fase ainda não classificada; confirmar com o mentor.";
 const deliverables=phases.map(p=>p.deliverable).join("; ")||"Definir com o mentor";
 return `# PROMPT OPERACIONAL AKASHA HUB
## ${c.id} · ${c.title}

### PAPEL E MISSÃO
Atue como especialista sênior em ${c.department.replace(/^\d+ · /,"")}, com visão sistêmica, rigor analítico e comunicação clara. Apoie a capacidade "${c.title}" no ecossistema Akasha Hub. Investigue o contexto, identifique o problema real e produza um resultado utilizável, não uma resposta genérica.

### ENQUADRAMENTO
- Departamento: ${c.department}
- Grupo: ${c.group}
- ID estável: ${c.id}
- Fases: ${c.phases.join(", ")||"A classificar"}
- Contexto das fases: ${phaseContext}
- Entregáveis relacionados: ${deliverables}
- Relação estratégica: ${c.reason}
- Escopo de contexto: ${getContextScopeMeta(c.contextScope).label}
- Fonte recomendada: ${getContextScopeMeta(c.contextScope).sourceLabel}
- Regra de contexto: ${contextScopeInstruction(c.contextScope)}

### VARIÁVEIS DE ENTRADA
Use os dados disponíveis. Se faltar variável essencial, pergunte antes de concluir. Nunca invente.
{{NOME_DO_CLIENTE_OU_EMPRESA}}
{{SEGMENTO_E_MODELO_DE_NEGOCIO}}
{{PAIS_CIDADE_E_MERCADO}}
{{ESTAGIO_ATUAL_E_HISTORICO}}
{{OBJETIVO_PRINCIPAL_E_RESULTADO_ESPERADO}}
{{PROBLEMA_OU_OPORTUNIDADE}}
{{PUBLICO_E_CLIENTE_IDEAL}}
{{OFERTA_PRODUTO_SERVICO}}
{{DADOS_E_INDICADORES_DISPONIVEIS}}
{{RECURSOS_ORCAMENTO_E_RESTRICOES}}
{{PRAZO_E_PRIORIDADE}}
{{ATIVOS_FERRAMENTAS_E_PROCESSOS_EXISTENTES}}
{{DECISOES_JA_TOMADAS_E_PREFERENCIAS}}
{{FONTES_DOCUMENTOS_E_REFERENCIAS_AUTORIZADAS}}
{{FORMATO_DO_ENTREGAVEL}}
{{RESPONSAVEL_PELA_VALIDACAO}}

### PROTOCOLO DE DESCOBERTA
1. Leia o contexto e separe fatos, relatos, hipóteses, estimativas e decisões.
2. Resuma o cenário em até cinco linhas.
3. Liste lacunas que alteram materialmente a qualidade. Faça no máximo cinco perguntas por rodada; aceite "não sei".
4. Se houver dados suficientes, avance sem perguntas redundantes.
5. Identifique dependências, riscos, conflitos e impactos nas outras áreas.
6. Não trate correlação como causalidade nem opinião como evidência.

### MÉTODO
A. Diagnóstico: situação atual, evidências, causas prováveis, gargalos e maturidade.
B. Direção: objetivo mensurável, escopo, prioridades e critérios de sucesso.
C. Estratégia: alternativas, trade-offs, recursos, sequência e recomendação justificada.
D. Construção: entregue material ou plano pronto para uso, com exemplos concretos.
E. Validação: revise consistência, viabilidade, clareza, riscos e premissas.
F. Continuidade: defina responsável, próxima ação, prazo, indicador e revisão.

### PADRÃO DE EXCELÊNCIA
- Adapte ao segmento, mercado, estágio e recursos reais.
- Seja específico, claro, profundo e prático; elimine conselhos intercambiáveis.
- Use números apenas quando fornecidos ou calculáveis; mostre fórmulas e premissas.
- Apresente opções quando houver trade-offs e recomende uma com justificativa.
- Transforme abstrações em ações, exemplos, modelos e decisões.
- Não prometa resultados, integrações ou funcionalidades não verificadas.
- Não duplique dados, cálculos ou funções dos aplicativos existentes.

### FORMATO DA ENTREGA
1. Síntese executiva e objetivo.
2. Diagnóstico: fatos, lacunas e hipóteses separados.
3. Estratégia recomendada e justificativa.
4. Plano priorizado: ação, responsável, prazo e dependência.
5. Entregável principal pronto para uso.
6. Indicadores e critérios de aceite.
7. Riscos, limites e validação humana.
8. Próxima decisão mais importante.

### SEGURANÇA E GOVERNANÇA
Use apenas dados autorizados e necessários deste cliente/projeto; nunca misture clientes. Minimize dados pessoais. Não peça senhas, tokens ou credenciais. Não publique, envie, grave, altere sistemas ou execute transações sem autorização explícita. Não afirme ter consultado fontes que não consultou. Em temas jurídicos, tributários, contábeis, médicos, investimentos, crédito ou imigração, sinalize limites e exija validação profissional habilitada.

### CONTROLE DE QUALIDADE
Antes de entregar, revise aderência ao contexto, precisão, profundidade, aplicabilidade, clareza e completude. Dê nota de 0 a 10 para cada critério. Se algum ficar abaixo de 9, revise; não infle notas nem esconda limitações.

### INÍCIO
Identifique as variáveis já fornecidas. Pergunte apenas o indispensável. Execute a missão de "${c.title}" com padrão de consultoria sênior e entregue para validação do mentor.`;
}
function renderPromptDetail(id) {
 const c=CAPABILITIES.find(x=>x.id===id); if(!c)return '<div class="pm-empty">Capacidade não encontrada.</div>';
 return '<section class="pm-prompt-detail"><button class="pm-back" type="button" data-pm-back>← Voltar à matriz</button><div class="pm-prompt-kicker">PROMPT OPERACIONAL · '+esc(c.id)+'</div><h2>'+esc(c.title)+'</h2><p class="pm-prompt-intro">Modelo-base contextualizado. Consulte as variáveis compartilhadas antes de preencher e copiar. Nesta etapa, a lista é um guia; ainda não salva respostas automaticamente.</p><details class="pm-variable-guide" style="margin:12px 0;padding:12px;border:1px solid var(--line,#39342d);border-radius:10px"><summary style="cursor:pointer">Revisar as 16 variáveis do contexto</summary><p>Lista padrão usada pelos prompts:</p><ol><li><strong>nome do cliente ou empresa</strong> — Nome da pessoa, marca ou empresa atendida.</li><li><strong>segmento e modelo de negocio</strong> — Setor, atividade, como vende e como gera receita.</li><li><strong>pais cidade e mercado</strong> — País, cidade, região e mercado em que atua.</li><li><strong>estagio atual e historico</strong> — Momento atual, trajetória e acontecimentos relevantes.</li><li><strong>objetivo principal e resultado esperado</strong> — O que deseja alcançar e como reconhecer o resultado.</li><li><strong>problema ou oportunidade</strong> — Desafio central ou oportunidade que deseja aproveitar.</li><li><strong>publico e cliente ideal</strong> — Pessoas ou empresas que deseja atender.</li><li><strong>oferta produto servico</strong> — Produtos, serviços, pacotes, preços e diferenciais conhecidos.</li><li><strong>dados e indicadores disponiveis</strong> — Números e indicadores já registrados nas ferramentas.</li><li><strong>recursos orcamento e restricoes</strong> — Equipe, tempo, orçamento, limites e recursos disponíveis.</li><li><strong>prazo e prioridade</strong> — Prazo desejado e nível de prioridade.</li><li><strong>ativos ferramentas e processos existentes</strong> — Sites, sistemas, canais, ferramentas e processos já utilizados.</li><li><strong>decisoes ja tomadas e preferencias</strong> — Decisões confirmadas, preferências e coisas que não devem mudar.</li><li><strong>fontes documentos e referencias autorizadas</strong> — Links e documentos que podem ser consultados.</li><li><strong>formato do entregavel</strong> — Formato esperado: diagnóstico, plano, roteiro, tabela, código etc.</li><li><strong>responsavel pela validacao</strong> — Pessoa que revisa e aprova o resultado.</li></ol><button type="button" class="pm-copy-prompt" data-pm-copy-vars>Copiar lista de variáveis</button><span id="pmVariableCopyStatus" role="status" aria-live="polite"></span></details><div class="pm-prompt-meta"><span>'+esc(c.department)+'</span><span>'+esc(c.group)+'</span>'+contextPill(c.contextScope)+phasePills(c.phases)+'</div><p class="pm-prompt-intro">Contexto '+esc(getContextScopeMeta(c.contextScope).label.toLowerCase())+': '+esc(contextScopeInstruction(c.contextScope))+'</p><div class="pm-prompt-actions"><button type="button" class="pm-copy-prompt" data-pm-open-context>Revisar contexto compartilhado</button><button type="button" class="pm-copy-prompt" data-pm-load-dossier>Carregar contexto do Dossiê</button><span id="pmDossierStatus" role="status" aria-live="polite">Lê as respostas já salvas do cliente selecionado e mostra as fontes.</span></div><label class="pm-prompt-label" for="pmPromptText">Prompt completo e editável</label><textarea id="pmPromptText" data-pm-capability="'+esc(c.id)+'" spellcheck="false">'+esc(applySharedContext(promptForCapability(c),c.contextScope))+'</textarea><div class="pm-prompt-actions"><button type="button" class="pm-copy-prompt" data-pm-copy>Copiar prompt completo</button><span id="pmCopyStatus" role="status" aria-live="polite">Personalize as variáveis antes de usar.</span></div><div class="pm-prompt-quality"><strong>Critérios incorporados</strong><ul><li>Diagnóstico com evidências e contexto real.</li><li>Perguntas somente para lacunas relevantes.</li><li>Plano executável, prioridades e indicadores.</li><li>Revisão crítica, riscos e validação humana.</li><li>Privacidade e limites profissionais.</li></ul></div></section>';
}



function dossierSnapshotText(snapshot, scope="hybrid") {
  const all=snapshot.blocks||[];
  const blocks=all.filter(b=>b.sourceScope==="project"||b.sourceScope==="hybrid"||scope==="hybrid"||b.sourceScope===scope||!b.sourceScope);
  const filled=blocks.filter(b=>b.status==="cheio"),empty=blocks.filter(b=>b.status==="vazio"),blocked=blocks.filter(b=>b.status==="bloqueado"||b.status==="erro");
  const lines=[
    "### CONTEXTO LIDO DO DOSSIÊ DO AKASHA HUB",
    "Cliente selecionado: "+(snapshot.person||"não identificado"),
    "Escopo aplicado: "+getContextScopeMeta(scope).label+". Fontes pessoais e empresariais foram filtradas por classificação; projetos vinculados permanecem como contexto específico.",
    "Origem: Cadastro Inteligente e ferramentas autorizadas das cinco fases. Leitura somente; nenhum dado foi alterado.",
    "Resumo: "+filled.length+" fontes com respostas; "+empty.length+" sem respostas; "+blocked.length+" sem leitura disponível.",
    "Preserve a origem de cada campo e não trate ausência de resposta como resposta negativa.",""
  ];
  for(const b of blocks){
    lines.push("FONTE · "+b.phase+" · "+b.title+" · escopo "+(b.sourceScope||"não classificado"));
    if(b.status==="vazio")lines.push("Sem respostas registradas nesta ferramenta.");
    else if(b.status==="bloqueado")lines.push("Leitura bloqueada pelas permissões atuais.");
    else if(b.status==="erro")lines.push("Falha ao ler esta fonte nesta tentativa.");
    else for(const field of b.fields||[])lines.push(field.key+": "+field.text);
    lines.push("");
  }
  lines.push("### LACUNAS DE CONTEXTO IDENTIFICADAS");
  if(empty.length)lines.push("Ferramentas sem respostas: "+empty.map(b=>b.title).join(", "));
  if(blocked.length)lines.push("Fontes sem leitura: "+blocked.map(b=>b.title+" ("+b.status+")").join(", "));
  if(!empty.length&&!blocked.length)lines.push("Nenhuma ferramenta sem leitura foi identificada; isso não significa que todos os dados necessários estejam preenchidos.");
  lines.push("Antes de concluir, identifique os dados específicos ainda ausentes e pergunte somente o indispensável.");
  return lines.join("\n");
}
async function attachDossierContext(area,status,scope="hybrid") {
  if(!area)return;
  if(status)status.textContent="Lendo as fontes do Dossiê para o escopo "+getContextScopeMeta(scope).label.toLowerCase()+"...";
  try{
    const snapshot=await readHubDossieSnapshot();
    if(!snapshot.ok){if(status)status.textContent="Não encontrei um cliente selecionado ou uma sessão válida para ler o Dossiê.";return;}
    const marker="### CONTEXTO LIDO DO DOSSIÊ DO AKASHA HUB";
    const clean=area.value.split(marker)[0].trimEnd();
    const relevant=(snapshot.blocks||[]).filter(b=>b.sourceScope==="project"||b.sourceScope==="hybrid"||scope==="hybrid"||b.sourceScope===scope||!b.sourceScope);
    const filtered={...snapshot,blocks:relevant};
    area.value=clean+"\n\n"+dossierSnapshotText(filtered,scope);
    if(status)status.textContent="Contexto anexado: "+relevant.filter(b=>b.status==="cheio").length+" fontes relevantes. Confira as origens e lacunas.";
  }catch(error){
    console.error("[Biblioteca de Prompts] Falha ao ler o Dossiê:",error);
    if(status)status.textContent="Não consegui ler o Dossiê. Verifique a seleção do cliente e as permissões.";
  }
}
function handleContextScopeChange(root,event) {
  if(!event.target.matches("[data-pm-context-scope]"))return;
  activeSharedContextScope=event.target.value;
  SHARED_CONTEXT=SHARED_CONTEXT_BY_SCOPE[activeSharedContextScope]||SHARED_CONTEXT_BY_SCOPE.hybrid;
  const overlay=root.querySelector("[data-pm-context-overlay]");
  overlay?.querySelectorAll("[data-pm-context-key]").forEach(field=>field.value=SHARED_CONTEXT[field.dataset.pmContextKey]||"");
  const status=overlay?.querySelector("#pmContextStatus");
  if(status)status.textContent="Escopo "+getContextScopeMeta(activeSharedContextScope).label.toLowerCase()+" selecionado. Os outros contextos permanecem separados.";
}

function renderSpecializedRows(items) {
  if (!items.length) return '<div class="pm-empty">Nenhum prompt corresponde aos filtros.</div>';
  return items.map(item => {
    const linked = (item.capabilityIds || []).map(id => CAPABILITIES.find(c => c.id === id)).filter(Boolean);
    const linkedText = linked.length ? linked.map(c => c.id + " · " + c.title).join("; ") : "Vínculo pendente de revisão";
    return '<article class="pm-cap-row"><div class="pm-cap-code">'+esc(item.id)+'</div><div class="pm-cap-main"><strong>'+esc(item.title)+'</strong><small>'+esc(item.category)+' · Fase '+esc(item.phase)+'</small><p>'+esc(item.mission)+'</p><small class="pm-linked-capabilities">Capacidades do catálogo: '+esc(linkedText)+'</small><button type="button" class="pm-build-prompt" data-pm-specialized="'+esc(item.id)+'">Abrir prompt completo <span>↗</span></button></div><div class="pm-cap-meta">'+contextPill(item.contextScope)+'<span class="pm-phase-pill">'+esc(item.phase)+'</span></div></article>';
  }).join('');
}
function renderSpecializedIndex() {
  const cats = [...new Set(SPECIALIZED_PROMPTS.map(x=>x.category))];
  return '<div class="pm-specialized-intro"><h2>Receitas práticas e especializadas</h2><p>Prompts prontos para tarefas concretas. Cada receita tem missão, entradas específicas, método, entregáveis e limites. O contexto geral é reaproveitado sem pedir os mesmos dados novamente.</p><div class="pm-stats"><div><strong>'+SPECIALIZED_PROMPTS.length+'</strong><span>prompts especializados</span></div><div><strong>'+cats.length+'</strong><span>categorias práticas</span></div><div><strong>5</strong><span>fases conectadas</span></div></div></div><div class="pm-filters"><input id="pmSpecialSearch" type="search" placeholder="Buscar por nome, tarefa ou palavra-chave..."><select id="pmSpecialCategory"><option value="">Todas as categorias</option>'+cats.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join('')+'</select><select id="pmSpecialPhase"><option value="">Todas as fases</option>'+PHASES.map(p=>'<option value="'+p.id+'">'+p.id+' · '+esc(p.name)+'</option>').join('')+'</select><select id="pmSpecialContext"><option value="">Todos os contextos</option><option value="personal">Pessoal</option><option value="business">Empresarial</option><option value="hybrid">Híbrido</option></select><span id="pmSpecialCount"></span></div><div id="pmSpecialRows" class="pm-cap-list">'+renderSpecializedRows(SPECIALIZED_PROMPTS)+'</div>';
}
function renderSpecializedDetail(id) {
  const item=SPECIALIZED_PROMPTS.find(x=>x.id===id);
  if(!item) return '<div class="pm-empty">Prompt especializado não encontrado.</div>';
  return '<section class="pm-prompt-detail"><button class="pm-back" type="button" data-pm-back-special>← Voltar aos prompts especializados</button><div class="pm-prompt-kicker">RECEITA ESPECIALIZADA · '+esc(item.id)+'</div><h2>'+esc(item.title)+'</h2><p class="pm-prompt-intro">'+esc(item.mission)+'</p><div class="pm-prompt-meta"><span>'+esc(item.category)+'</span><span>Fase '+esc(item.phase)+'</span>'+contextPill(item.contextScope)+'<span>'+esc(item.keywords)+'</span></div><p class="pm-prompt-intro">Contexto '+esc(getContextScopeMeta(item.contextScope).label.toLowerCase())+': '+esc(contextScopeInstruction(item.contextScope))+'</p><div class="pm-prompt-actions"><button type="button" class="pm-copy-prompt" data-pm-open-context>Revisar contexto compartilhado</button><button type="button" class="pm-copy-prompt" data-pm-load-dossier-special>Carregar contexto do Dossiê</button><span id="pmSpecialDossierStatus" role="status" aria-live="polite">Lê as respostas já salvas do cliente selecionado e mostra as fontes.</span></div><label class="pm-prompt-label" for="pmSpecialPromptText">Prompt completo e editável</label><textarea id="pmSpecialPromptText" data-pm-specialized-source="'+esc(item.id)+'" spellcheck="false">'+esc(applySharedContext(buildSpecializedPrompt(item),item.contextScope))+'</textarea><div class="pm-prompt-actions"><button type="button" class="pm-copy-prompt" data-pm-copy-special>Copiar prompt completo</button><span id="pmSpecialCopyStatus" role="status" aria-live="polite">Revise o contexto e personalize o que estiver entre chaves antes de usar.</span></div><div class="pm-prompt-quality"><strong>Como usar</strong><ul><li>O mentor conduz e valida o projeto.</li><li>O prompt reaproveita as variáveis gerais e pede apenas entradas específicas que faltarem.</li><li>O resultado deve ser revisado antes de virar entregável oficial.</li><li>As ferramentas relacionadas são sugestões de apoio; integração automática não é presumida.</li></ul></div></section>';
}

export function renderMasterPromptMap() {
  if (!isMentorSession()) return '<div class="view active pm-view"><div class="pm-hero"><div class="pm-eyebrow">AKASHA HUB · ARQUITETURA DE LEGADO</div><h1>Meu contexto do projeto</h1><p>Esta ficha reúne informações do seu projeto para que o mentor e você trabalhem com a mesma referência. Preencha apenas o que já souber; os campos podem ser atualizados ao longo do processo.</p></div><div id="pmPanel" class="pm-panel">'+sharedContextMarkup()+'</div>'+sharedContextModalMarkup()+'</div>';
  const total = CAPABILITIES.length;
  return '<div class="view active pm-view"><div class="pm-hero"><div class="pm-eyebrow">AKASHA HUB · INTELIGÊNCIA OPERACIONAL</div><h1>Mapa Mestre da Biblioteca de Prompts</h1><p>Uma matriz única para conectar capacidades do ecossistema, cinco fases da Arquitetura de Legado, aplicativos existentes e entregáveis. Cada capacidade pode gerar um prompt operacional adaptado. A biblioteca também reúne receitas especializadas para tarefas práticas, com entradas, método, entregáveis e validação humana.</p><div class="pm-stats"><div><strong>10</strong><span>departamentos</span></div><div><strong>'+total+'</strong><span>capacidades catalogadas</span></div><div><strong>5</strong><span>fases conectadas</span></div><div><strong>'+total+'</strong><span>modelos-base geráveis</span></div><div><strong>70</strong><span>receitas especializadas</span></div></div></div><div class="pm-principle"><strong>Princípio de construção</strong><p>O Catálogo de Capacidades define o que o ecossistema pode compreender, estruturar, desenvolver e coordenar. As cinco fases organizam a jornada do cliente. A Biblioteca conecta os dois, sem duplicar aplicativos, ferramentas ou processos.</p></div><div class="pm-tabs" role="tablist"><button type="button" class="pm-tab is-active" data-pm-tab="phases">Cinco fases</button><button type="button" class="pm-tab" data-pm-tab="context">Contexto compartilhado</button><button type="button" class="pm-tab" data-pm-tab="specialized">Receitas práticas</button><button type="button" class="pm-tab" data-pm-tab="departments">10 departamentos</button><button type="button" class="pm-tab" data-pm-tab="capabilities">Matriz de capacidades</button><button type="button" class="pm-tab" data-pm-tab="rules">Regras da biblioteca</button></div><div id="pmPanel" class="pm-panel"><div class="pm-phase-grid">'+renderPhaseCards()+'</div></div>'+sharedContextModalMarkup()+'<div class="pm-footer-note">Matriz estrutural inicial · catálogo de origem preservado · sem gravação ou alteração de dados dos aplicativos nesta etapa.</div></div>';
}

export function bindMasterPromptMap() {
  const root = document.querySelector(".pm-view");
  if (!root || root.dataset.pmBound === "1") return;
  root.dataset.pmBound = "1";
  const panel = root.querySelector("#pmPanel");
  if (isMentorSession()) {
    // Confirma a lista de mentorandos antes de resolver o UID do contexto.
    // Isso evita carregar o contexto do próprio mentor durante a inicialização assíncrona.
    loadAuthorizedMentees()
      .then(() => loadSharedContext(root))
      .catch(error => {
        console.error("[Biblioteca de Prompts] Falha ao confirmar mentorandos:", error);
        sharedContextCloudState = "error";
        const status = root.querySelector("#pmContextCloudStatus");
        if (status) status.textContent = "Não consegui confirmar a lista de mentorandos. Atualize a página e tente novamente antes de editar.";
      });
  } else {
    loadSharedContext(root);
  }
  if (!isMentorSession()) {
    root.addEventListener("click",e=>{
      if(e.target.closest("[data-pm-open-context]")){openSharedContext(root);return;}
    if(e.target.closest("[data-pm-load-akasha-example]")){loadAkashaHubExample(root);return;}
      
      if(e.target.closest("[data-pm-close-context]")){const overlay=root.querySelector("[data-pm-context-overlay]");if(overlay)overlay.hidden=true;return;}
      if(e.target.closest("[data-pm-save-context]")){saveSharedContext(root);return;}
    if(e.target.closest("[data-pm-import-dossier]")){importDossierIntoContext(root);return;}
      if(e.target.closest("[data-pm-import-dossier]")){importDossierIntoContext(root);return;}
      if(e.target.matches("[data-pm-context-overlay]")){e.target.hidden=true;return;}
    });
    root.addEventListener("change",e=>handleContextScopeChange(root,e));
    return;
  }
  const searchMarkup = () => '<div class="pm-filters"><input id="pmSearch" type="search" placeholder="Buscar capacidade, departamento ou grupo..."><select id="pmPhaseFilter"><option value="">Todas as fases</option>'+PHASES.map(p=>'<option value="'+p.id+'">'+p.id+' · '+esc(p.name)+'</option>').join("")+'</select><select id="pmDeptFilter"><option value="">Todos os departamentos</option>'+CATALOG.map(d=>'<option value="'+d.id+'">'+esc(d.name)+'</option>').join("")+'</select><select id="pmContextFilter"><option value="">Todos os contextos</option><option value="personal">Pessoal</option><option value="business">Empresarial</option><option value="hybrid">Híbrido</option></select><span id="pmCount"></span></div><div id="pmRows" class="pm-cap-list">'+renderCapabilityRows(CAPABILITIES)+'</div>';
  const rulesMarkup = () => '<div class="pm-rules-grid"><article><h3>O prompt não é o aplicativo</h3><p>O aplicativo registra e executa sua função. O prompt orienta análise, planejamento, criação ou revisão usando dados autorizados, sem duplicar registros ou cálculos.</p></article><article><h3>Vendas são sistêmicas</h3><p>Um resultado comercial pode depender de identidade, valor percebido, comunicação, ativos digitais, preço, margem, aquisição, atendimento, operação, entrega e continuidade. O diagnóstico deve investigar o ecossistema, não presumir que todo problema de venda se resolve com script ou tráfego.</p></article><article><h3>Contexto com autorização</h3><p>Usar somente dados necessários do UID e do projeto selecionado. Nunca misturar dados de mentorandos. O mentor confirma decisões antes de registrar ou executar ações.</p></article><article><h3>Estados operacionais</h3><p>'+STATUS.map(s=>'<span class="pm-state">'+esc(s)+'</span>').join(" ")+'<br><small>O estado pertence à capacidade operacional, não ao prompt. As capacidades começam como “A classificar” até validação do mentor.</small></p></article><article><h3>Governança dos prompts</h3><p>Prompt oficial com versão, autor, revisão e histórico. Mentor pode duplicar e personalizar sem alterar o original. Visibilidade e publicação são explícitas.</p></article><article><h3>Qualidade da resposta</h3><p>Separar fatos, hipóteses e recomendações; citar dados que sustentam inferências; sinalizar lacunas; informar limites e propor próximos passos verificáveis.</p></article><article><h3>Limites profissionais</h3><p>Atividades jurídicas, contábeis, reguladas, investimentos e imigração exigem validação de profissionais habilitados. IA não comprova fatos nem substitui responsabilidade técnica.</p></article></div>';
  function showTab(tab) {
    root.querySelectorAll("[data-pm-tab]").forEach(b=>b.classList.toggle("is-active",b.dataset.pmTab===tab));
    if (tab==="context") panel.innerHTML=sharedContextMarkup();
    if (tab==="phases") panel.innerHTML='<div class="pm-phase-grid">'+renderPhaseCards()+'</div>';
    if (tab==="departments") panel.innerHTML=renderMatrixView();
    if (tab==="specialized") { panel.innerHTML=renderSpecializedIndex(); bindSpecializedFilters(); }
    if (tab==="capabilities") panel.innerHTML=searchMarkup();
    if (tab==="rules") panel.innerHTML=rulesMarkup();
    if (tab==="capabilities") bindFilters();
  }
  function bindSpecializedFilters() {
    const search=panel.querySelector("#pmSpecialSearch"), category=panel.querySelector("#pmSpecialCategory"), phase=panel.querySelector("#pmSpecialPhase"), context=panel.querySelector("#pmSpecialContext");
    const rows=panel.querySelector("#pmSpecialRows"), count=panel.querySelector("#pmSpecialCount");
    const draw=()=>{ const q=norm(search?.value), c=category?.value||"", p=phase?.value||"", s=context?.value||""; const filtered=SPECIALIZED_PROMPTS.filter(x=>(!q||norm([x.id,x.title,x.category,x.mission,x.keywords].join(" ")).includes(q))&&(!c||x.category===c)&&(!p||x.phase===p)&&(!s||x.contextScope===s)); rows.innerHTML=renderSpecializedRows(filtered); count.textContent=filtered.length+" de "+SPECIALIZED_PROMPTS.length+" prompts"; };
    [search,category,phase,context].forEach(el=>el?.addEventListener("input",draw)); draw();
  }
  function bindFilters() {
    const search=panel.querySelector("#pmSearch"), phase=panel.querySelector("#pmPhaseFilter"), dept=panel.querySelector("#pmDeptFilter"), context=panel.querySelector("#pmContextFilter");
    const rows=panel.querySelector("#pmRows"), count=panel.querySelector("#pmCount");
    const draw=()=>{
      const q=norm(search?.value), p=phase?.value||"", d=dept?.value||"", s=context?.value||"";
      const filtered=CAPABILITIES.filter(c=>(!q||norm([c.title,c.department,c.group,c.id].join(" ")).includes(q))&&(!p||c.phases.includes(p))&&(!d||c.departmentId===d)&&(!s||c.contextScope===s));
      rows.innerHTML=renderCapabilityRows(filtered);
      count.textContent=filtered.length+" de "+CAPABILITIES.length+" capacidades";
    };
    [search,phase,dept,context].forEach(el=>el?.addEventListener("input",draw));
    draw();
  }
  root.addEventListener("click",e=>{
    const tab=e.target.closest("[data-pm-tab]");
    if(tab){showTab(tab.dataset.pmTab);return;}
    if(e.target.closest("[data-pm-open-context]")){openSharedContext(root);return;}
    if(e.target.closest("[data-pm-load-akasha-example]")){loadAkashaHubExample(root);return;}
    if(e.target.closest("[data-pm-close-context]")){const ov=root.querySelector("[data-pm-context-overlay]");if(ov)ov.hidden=true;return;}
    if(e.target.closest("[data-pm-save-context]")){saveSharedContext(root);return;}
    if(e.target.matches("[data-pm-context-overlay]")){e.target.hidden=true;return;}
    if(e.target.closest("[data-pm-back-special]")){showTab("specialized");return;}
    const specialized=e.target.closest("[data-pm-specialized]");
    if(specialized){panel.innerHTML=renderSpecializedDetail(specialized.dataset.pmSpecialized);return;}
    if(e.target.closest("[data-pm-load-dossier-special]")){const item=SPECIALIZED_PROMPTS.find(x=>x.id===panel.querySelector("#pmSpecialPromptText")?.dataset.pmSpecializedSource);attachDossierContext(panel.querySelector("#pmSpecialPromptText"),panel.querySelector("#pmSpecialDossierStatus"),item?.contextScope||"hybrid");return;}
    if(e.target.closest("[data-pm-load-dossier]")){const c=CAPABILITIES.find(x=>x.id===panel.querySelector("#pmPromptText")?.dataset.pmCapability);attachDossierContext(panel.querySelector("#pmPromptText"),panel.querySelector("#pmDossierStatus"),c?.contextScope||"hybrid");return;}
    if(e.target.closest("[data-pm-copy-special]")){const area=panel.querySelector("#pmSpecialPromptText"),status=panel.querySelector("#pmSpecialCopyStatus");if(area)copyText(area.value,status);return;}
    const phase=e.target.closest("[data-pm-phase]");
    if(phase){panel.innerHTML=renderPhaseDetail(phase.dataset.pmPhase);return;}
    if(e.target.closest("[data-pm-back]")){showTab("capabilities");return;}
    const promptBtn=e.target.closest("[data-pm-prompt]");
    if(promptBtn){panel.innerHTML=renderPromptDetail(promptBtn.dataset.pmPrompt);return;}
    if(e.target.closest("[data-pm-copy-vars]")){const text=PROMPT_VARIABLES.map(([key,desc],i)=>(i+1)+". {{"+key+"}}\n"+desc).join("\n\n");copyText(text,panel.querySelector("#pmVariableCopyStatus"));return;}
    const cp=e.target.closest("[data-pm-copy-phase]"); if(cp){const p=PHASES.find(x=>x.id===cp.dataset.pmCopyPhase);if(p)copyText(phaseDocumentation(p),panel.querySelector("#pmPhaseCopyStatus"));return;}
    const ca=e.target.closest("[data-pm-copy-apps]"); if(ca){const p=PHASES.find(x=>x.id===ca.dataset.pmCopyApps);if(p){const text=["MAPA DE APLICATIVOS · "+p.id+" · "+p.name,...p.apps.map(([name,url])=>"- "+name+(url?" · https://akashahub.com.br"+url:" · rota a confirmar")),"","APOIOS (integração não presumida)",...p.support.map(x=>"- "+x)].join("\n");copyText(text,panel.querySelector("#pmPhaseCopyStatus"));}return;}
    if(e.target.closest("[data-pm-copy]")){const area=panel.querySelector("#pmPromptText"),status=panel.querySelector("#pmCopyStatus");if(!area)return;copyText(area.value,status);return;}
  });
  root.addEventListener("change",e=>handleContextScopeChange(root,e));
}


// Acesso contextual aos prompts dentro da jornada das cinco fases.
// Os prompts são gerados a partir do Catálogo de Capacidades existente;
// nenhum aplicativo, registro de negócio ou coleção Firestore é duplicado.
export function renderPhasePromptAccess(phaseId) {
  const phase = PHASES.find(p => p.id === String(phaseId || "").toUpperCase());
  if (!phase) return "";
  const capabilities = CAPABILITIES.filter(c => c.phases.includes(phase.id));
  const specialized = SPECIALIZED_PROMPTS.filter(item => String(item.phase).toUpperCase() === phase.id);
  return '<section class="pm-journey-prompts" style="margin:26px 0;padding:18px;border:1px solid var(--line,rgba(205,174,94,.35));border-radius:14px;background:var(--surface,rgba(255,255,255,.02))">' +
    '<div class="pm-eyebrow">AKASHA HUB · BIBLIOTECA OPERACIONAL</div>' +
    '<h3 class="section-h">Prompts desta fase</h3>' +
    '<p class="notes-hint">Acesse os prompts no próprio percurso. Cada modelo é construído a partir da capacidade original; revise o contexto, personalize e só então envie à IA. Os aplicativos existentes continuam sendo a fonte oficial dos registros e operações.</p>' +
    '<p class="notes-hint"><strong>' + capabilities.length + '</strong> capacidades relacionadas · <strong>' + specialized.length + '</strong> receitas especializadas cadastradas nesta fase.</p>' +
    '<div class="pm-phase-prompt-list">' + capabilities.map(c =>
      '<details style="margin:10px 0;padding:12px;border:1px solid var(--line,#39342d);border-radius:10px">' +
      '<summary style="cursor:pointer"><strong>' + esc(c.id) + ' · ' + esc(c.title) + '</strong><small style="display:block;color:var(--muted);margin-top:4px">' + contextPill(c.contextScope) + ' · ' + esc(c.department.replace(/^[0-9]+ · /,"")) + ' · ' + esc(c.group) + '</small></summary>' +
      '<p class="notes-hint">' + esc(c.reason) + '</p>' +
      '<textarea data-journey-prompt="' + esc(c.id) + '" spellcheck="false" style="width:100%;min-height:260px;margin:10px 0;padding:12px;box-sizing:border-box">' + esc(applySharedContext(promptForCapability(c),c.contextScope)) + '</textarea>' +
      '<button class="tool-btn" type="button" data-copy-journey-prompt="' + esc(c.id) + '">Copiar prompt</button>' +
      '<span data-journey-prompt-status="' + esc(c.id) + '" role="status" aria-live="polite" style="margin-left:10px"></span>' +
      '</details>'
    ).join("") + '</div>' +
    (specialized.length ? '<h4 class="section-h" style="margin-top:24px">Receitas especializadas desta fase</h4><div class="pm-phase-prompt-list">' + specialized.map(item => {
      const key = "specialized-" + item.id;
      const linked = (item.capabilityIds || []).map(id => CAPABILITIES.find(c => c.id === id)).filter(Boolean);
      const linkedText = linked.length ? linked.map(c => c.id + " · " + c.title).join("; ") : "Vínculo pendente de revisão";
      return '<details style="margin:10px 0;padding:12px;border:1px solid var(--line,#39342d);border-radius:10px">' +
        '<summary style="cursor:pointer"><strong>' + esc(item.id) + ' · ' + esc(item.title) + '</strong><small style="display:block;color:var(--muted);margin-top:4px">' + contextPill(item.contextScope) + ' · ' + esc(item.category) + ' · Capacidades: ' + esc(linkedText) + '</small></summary>' +
        '<p class="notes-hint">' + esc(item.mission) + '</p>' +
        '<textarea data-journey-prompt="' + esc(key) + '" spellcheck="false" style="width:100%;min-height:260px;margin:10px 0;padding:12px;box-sizing:border-box">' + esc(applySharedContext(buildSpecializedPrompt(item),item.contextScope)) + '</textarea>' +
        '<button class="tool-btn" type="button" data-copy-journey-prompt="' + esc(key) + '">Copiar prompt especializado</button>' +
        '<span data-journey-prompt-status="' + esc(key) + '" role="status" aria-live="polite" style="margin-left:10px"></span>' +
        '</details>';
    }).join("") + '</div>' : '') +
    '<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--line,#39342d)">' +
    '<button class="tool-btn" type="button" data-nav="hub-prompts">Abrir Mapa Mestre da Biblioteca ↗</button>' +
    '</div></section>';
}

export function bindPhasePromptAccess() {
  const root = document.getElementById("content");
  if (!root || root.dataset.phasePromptAccessBound === "1") return;
  root.dataset.phasePromptAccessBound = "1";
  root.addEventListener("click", event => {
    const button = event.target.closest("[data-copy-journey-prompt]");
    if (!button) return;
    const id = button.dataset.copyJourneyPrompt;
    const area = [...root.querySelectorAll("[data-journey-prompt]")].find(el => el.dataset.journeyPrompt === id);
    const status = [...root.querySelectorAll("[data-journey-prompt-status]")].find(el => el.dataset.journeyPromptStatus === id);
    if (area) copyText(area.value, status);
  });
}
