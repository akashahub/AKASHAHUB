import { isMentorSession } from "./auth.js";
import { CATALOG } from "./catalogo-capacidades-data.js?v=20261110-1";

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

const DEPT_PHASES = {
  essencia:["AE"], branding:["AE","ID"], tecnologia:["ID"], financeiro:["AF"],
  marketing:["ID","EX"], comercial:["ID","AF","EX"], internacional:["AF","EX","LG"],
  automacao:["ID","EX","LG"], educacao:["ID","LG"], legado:["LG"]
};
const DEPT_CODES = {
  essencia:"0101", branding:"0202", tecnologia:"0303", financeiro:"0404", marketing:"0505",
  comercial:"0606", internacional:"0707", automacao:"0808", educacao:"0909", legado:"1010"
};
const DEPT_PHASE_REASON = {
  essencia:"A investigação de identidade e direção inicia a jornada.",
  branding:"A identidade começa na essência e se materializa em marca e comunicação no Império Digital.",
  tecnologia:"A infraestrutura e os produtos digitais são construídos na fase Império Digital.",
  financeiro:"Organização financeira, capital e sustentabilidade são o núcleo da fase AF.",
  marketing:"Posicionamento e aquisição começam na estrutura digital e continuam na expansão.",
  comercial:"Oferta, relacionamento e vendas atravessam estruturação, alinhamento financeiro e expansão.",
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
      return {
        id: DEPT_CODES[dept.id] + "-C" + String(n).padStart(2,"0"),
        departmentId:dept.id, departmentCode:DEPT_CODES[dept.id], department:dept.name,
        group, title, phases:DEPT_PHASES[dept.id] || [], phase: (DEPT_PHASES[dept.id] || [])[0] || "",
        reason:DEPT_PHASE_REASON[dept.id] || ""
      };
    }));
  });
}
const CAPABILITIES = flattenCatalog();

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
  return rows.map(c => '<article class="pm-cap-row"><div class="pm-cap-code">'+esc(c.id)+'</div><div class="pm-cap-main"><strong>'+esc(c.title)+'</strong><small>'+esc(c.department.replace(/^\d+ · /,""))+' · '+esc(c.group)+'</small><p>'+esc(c.reason)+'</p></div><div class="pm-cap-meta">'+phasePills(c.phases)+'<span class="pm-unclassified">Estado a classificar</span></div></article>').join("");
}
function renderMatrixView() {
  const deptCards = CATALOG.map(d => {
    const caps = CAPABILITIES.filter(c => c.departmentId === d.id);
    const phases = [...new Set(caps.flatMap(c => c.phases))];
    return '<article class="pm-dept-card"><div class="pm-dept-head"><span>'+DEPT_CODES[d.id]+'</span><div><h3>'+esc(d.name.replace(/^\d+ · /,""))+'</h3><p>'+esc(d.summary)+'</p></div><b>'+caps.length+'</b></div><div class="pm-dept-phases">'+phasePills(phases)+'</div><details><summary>Ver '+caps.length+' capacidades</summary><div class="pm-dept-cap-list">'+caps.map(c => '<div><code>'+esc(c.id)+'</code>'+esc(c.title)+'</div>').join("")+'</div></details></article>';
  }).join("");
  return '<div class="pm-dept-grid">'+deptCards+'</div>';
}
function renderPhaseDetail(id) {
  const p = PHASES.find(x => x.id === id);
  if (!p) return "";
  const depts = CATALOG.filter(d => (DEPT_PHASES[d.id] || []).includes(id));
  const caps = CAPABILITIES.filter(c => c.phases.includes(id));
  return '<section class="pm-phase-detail"><button class="pm-back" type="button" data-pm-back>← Mapa mestre</button><div class="pm-phase-heading"><span>FASE '+p.number+' · '+p.id+'</span><h2>'+esc(p.name)+'</h2><p>'+esc(p.objective)+'</p></div><div class="pm-deliverable pm-deliverable-large"><small>ENTREGÁVEL CENTRAL</small><strong>'+esc(p.deliverable)+'</strong></div><div class="pm-detail-grid"><section><h3>Trabalho principal</h3><ol>'+p.work.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol></section><section><h3>Aplicativos da fase</h3><div class="pm-app-list">'+appMarkup(p.apps)+'</div><h3>Ferramentas e apoios relacionados</h3><div class="pm-app-list">'+p.support.map(x=>'<span class="pm-app pm-app-pending">'+esc(x)+'</span>').join("")+'</div></section></div><div class="pm-related"><h3>Departamentos conectados</h3><div class="pm-related-depts">'+depts.map(d=>'<span>'+DEPT_CODES[d.id]+' · '+esc(d.name.replace(/^\d+ · /,""))+'</span>').join("")+'</div><h3>Capacidades relacionadas · '+caps.length+'</h3><div class="pm-related-cap-list">'+caps.map(c=>'<div><code>'+esc(c.id)+'</code>'+esc(c.title)+'</div>').join("")+'</div></div><div class="pm-next"><small>CONEXÃO SEGUINTE</small><p>'+esc(p.next)+'</p></div><p class="pm-note">'+esc(p.notes)+'</p></section>';
}

export function renderMasterPromptMap() {
  if (!isMentorSession()) return '<div class="view active"><p class="hero-line">Biblioteca</p><h2 class="hero-title">Prompts liberados</h2><p class="hero-sub">Nenhum prompt foi liberado para o mentorando nesta etapa. Roteiro interno do mentor não aparece aqui.</p></div>';
  const total = CAPABILITIES.length;
  return '<div class="view active pm-view"><div class="pm-hero"><div class="pm-eyebrow">AKASHA HUB · INTELIGÊNCIA OPERACIONAL</div><h1>Mapa Mestre da Biblioteca de Prompts</h1><p>Uma matriz única para conectar capacidades do ecossistema, cinco fases da Arquitetura de Legado, aplicativos existentes e entregáveis. Esta etapa organiza a estrutura; os prompts serão criados depois, encaixados nesta matriz.</p><div class="pm-stats"><div><strong>10</strong><span>departamentos</span></div><div><strong>'+total+'</strong><span>capacidades catalogadas</span></div><div><strong>5</strong><span>fases conectadas</span></div><div><strong>0</strong><span>prompts inventados</span></div></div></div><div class="pm-principle"><strong>Princípio de construção</strong><p>O Catálogo de Capacidades define o que o ecossistema pode compreender, estruturar, desenvolver e coordenar. As cinco fases organizam a jornada do cliente. A Biblioteca conecta os dois, sem duplicar aplicativos, ferramentas ou processos.</p></div><div class="pm-tabs" role="tablist"><button type="button" class="pm-tab is-active" data-pm-tab="phases">Cinco fases</button><button type="button" class="pm-tab" data-pm-tab="departments">10 departamentos</button><button type="button" class="pm-tab" data-pm-tab="capabilities">Matriz de capacidades</button><button type="button" class="pm-tab" data-pm-tab="rules">Regras da biblioteca</button></div><div id="pmPanel" class="pm-panel"><div class="pm-phase-grid">'+renderPhaseCards()+'</div></div><div class="pm-footer-note">Matriz estrutural inicial · catálogo de origem preservado · sem gravação ou alteração de dados dos aplicativos nesta etapa.</div></div>';
}

export function bindMasterPromptMap() {
  const root = document.querySelector(".pm-view");
  if (!root || root.dataset.pmBound === "1" || !isMentorSession()) return;
  root.dataset.pmBound = "1";
  const panel = root.querySelector("#pmPanel");
  const searchMarkup = () => '<div class="pm-filters"><input id="pmSearch" type="search" placeholder="Buscar capacidade, departamento ou grupo..."><select id="pmPhaseFilter"><option value="">Todas as fases</option>'+PHASES.map(p=>'<option value="'+p.id+'">'+p.id+' · '+esc(p.name)+'</option>').join("")+'</select><select id="pmDeptFilter"><option value="">Todos os departamentos</option>'+CATALOG.map(d=>'<option value="'+d.id+'">'+esc(d.name)+'</option>').join("")+'</select><span id="pmCount"></span></div><div id="pmRows" class="pm-cap-list">'+renderCapabilityRows(CAPABILITIES)+'</div>';
  const rulesMarkup = () => '<div class="pm-rules-grid"><article><h3>O prompt não é o aplicativo</h3><p>O aplicativo registra e executa sua função. O prompt orienta análise, planejamento, criação ou revisão usando dados autorizados, sem duplicar registros ou cálculos.</p></article><article><h3>Contexto com autorização</h3><p>Usar somente dados necessários do UID e do projeto selecionado. Nunca misturar dados de mentorandos. O mentor confirma decisões antes de registrar ou executar ações.</p></article><article><h3>Estados operacionais</h3><p>'+STATUS.map(s=>'<span class="pm-state">'+esc(s)+'</span>').join(" ")+'<br><small>O estado pertence à capacidade operacional, não ao prompt. As capacidades começam como “A classificar” até validação do mentor.</small></p></article><article><h3>Governança dos prompts</h3><p>Prompt oficial com versão, autor, revisão e histórico. Mentor pode duplicar e personalizar sem alterar o original. Visibilidade e publicação são explícitas.</p></article><article><h3>Qualidade da resposta</h3><p>Separar fatos, hipóteses e recomendações; citar dados que sustentam inferências; sinalizar lacunas; informar limites e propor próximos passos verificáveis.</p></article><article><h3>Limites profissionais</h3><p>Atividades jurídicas, contábeis, reguladas, investimentos e imigração exigem validação de profissionais habilitados. IA não comprova fatos nem substitui responsabilidade técnica.</p></article></div>';
  function showTab(tab) {
    root.querySelectorAll("[data-pm-tab]").forEach(b=>b.classList.toggle("is-active",b.dataset.pmTab===tab));
    if (tab==="phases") panel.innerHTML='<div class="pm-phase-grid">'+renderPhaseCards()+'</div>';
    if (tab==="departments") panel.innerHTML=renderMatrixView();
    if (tab==="capabilities") panel.innerHTML=searchMarkup();
    if (tab==="rules") panel.innerHTML=rulesMarkup();
    if (tab==="capabilities") bindFilters();
  }
  function bindFilters() {
    const search=panel.querySelector("#pmSearch"), phase=panel.querySelector("#pmPhaseFilter"), dept=panel.querySelector("#pmDeptFilter");
    const rows=panel.querySelector("#pmRows"), count=panel.querySelector("#pmCount");
    const draw=()=>{
      const q=norm(search?.value), p=phase?.value||"", d=dept?.value||"";
      const filtered=CAPABILITIES.filter(c=>(!q||norm([c.title,c.department,c.group,c.id].join(" ")).includes(q))&&(!p||c.phases.includes(p))&&(!d||c.departmentId===d));
      rows.innerHTML=renderCapabilityRows(filtered);
      count.textContent=filtered.length+" de "+CAPABILITIES.length+" capacidades";
    };
    [search,phase,dept].forEach(el=>el?.addEventListener("input",draw));
    draw();
  }
  root.addEventListener("click",e=>{
    const tab=e.target.closest("[data-pm-tab]");
    if(tab){showTab(tab.dataset.pmTab);return;}
    const phase=e.target.closest("[data-pm-phase]");
    if(phase){panel.innerHTML=renderPhaseDetail(phase.dataset.pmPhase);return;}
    if(e.target.closest("[data-pm-back]")){showTab("phases");return;}
  });
}
