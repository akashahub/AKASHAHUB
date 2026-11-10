import { isMentorSession } from "./auth.js";

export const CATALOG = [
{ id:"essencia", name:"01 · Arquitetura de Essência", summary:"Identidade, trajetória, autoconhecimento, capacidades e direção.", groups:[
["Investigação e diagnóstico pessoal",["Leitura de trajetória pessoal e profissional","Mapeamento de história de vida, talentos, competências e experiências","Mapeamento de valores, princípios, interesses e aptidões","Investigação de objetivos, aspirações e oportunidades","Mapeamento de habilidades comercializáveis","Construção de visão de futuro e dossiê de essência"]],
["Identidade e posicionamento pessoal",["Identidade profissional e perfil executivo","Posicionamento de empresários, especialistas e profissionais liberais","Construção de autoridade e narrativa pessoal","Biografia estratégica, currículo e portfólio","Apresentações pessoais e comunicação de competências"]],
["Comportamento e desenvolvimento humano",["Mapeamento de crenças, hábitos e padrões de decisão","Investigação de padrões familiares e relação com dinheiro","Autoconhecimento, meditação e visualização orientada","Presença, disciplina, consistência e liderança pessoal","Integração entre vida pessoal e profissional"]]
]},
{ id:"branding", name:"02 · Branding, Imagem e Comunicação", summary:"Transformar identidade em representação visual e comunicação reconhecível.", groups:[
["Identidade visual",["Criação e redesign de logotipos e símbolos","Manual de identidade, paleta, tipografia e direção de arte","Identidade de produtos, campanhas, eventos e projetos","Aplicações institucionais e sistemas gráficos"]],
["Imagem e fotografia",["Retratos profissionais e fotografia corporativa","Fotografia de produtos e imagens institucionais","Imagens para perfis, redes sociais, sites e campanhas","Tratamento, edição, restauração e composição visual","Criação de imagens com IA, avatares e bancos personalizados","Direção de ensaios e padronização de imagens de equipe"]],
["Comunicação e audiovisual",["Proposta de valor, narrativa, storytelling e tom de voz","Manifestos, pitch, textos comerciais e páginas de venda","Roteiros, vídeos institucionais, publicitários e educativos","Reels, Shorts, mini documentários, animação e motion graphics","Edição, legendagem, tradução, locução e direção audiovisual","Apresentações, e-books, catálogos, relatórios e infográficos"]]
]},
{ id:"tecnologia", name:"03 · Império Digital e Tecnologia", summary:"Construir infraestrutura digital, produtos, sistemas e plataformas.", groups:[
["Desenvolvimento web",["Sites institucionais, empresariais e pessoais","Portfólios, landing pages, páginas de venda e captura","Sites multilíngues, blogs, portais, diretórios e catálogos","Lojas virtuais, sites de agendamento e sites profissionais"]],
["Aplicativos e plataformas",["Aplicativos web e sistemas de gestão","Plataformas educacionais, áreas de membros e assinaturas","Bibliotecas digitais, portais de clientes e comunidades","Sistemas de atendimento, reservas, projetos e acompanhamento","Marketplaces, afiliados, comércio e produtos SaaS"]],
["Engenharia e infraestrutura",["Arquitetura de sistemas, front-end e back-end","APIs, bancos de dados, autenticação e controle de acesso","Painéis administrativos, pagamentos e integrações","Firebase, Supabase, hospedagem, DNS, SSL e e-mail profissional","GitHub, deploy, backups, segurança, monitoramento e documentação","Otimização, responsividade, manutenção, migração e auditoria técnica"]],
["Comércio digital",["Catálogos, pedidos, checkout e pagamentos","Gestão de produtos, assinaturas e fidelidade","Integração com WhatsApp, fornecedores e distribuição"]]
]},
{ id:"financeiro", name:"04 · Alinhamento Financeiro", summary:"Educação financeira, comportamento, gestão, mercados e construção patrimonial.", groups:[
["Comportamento e fundamentos",["Crenças financeiras, história familiar e relação com riqueza","Comportamento de consumo, disciplina e tomada de decisão","Medo de cobrar, vender e negociar; valor percebido","Fundamentos do dinheiro, inflação, juros simples e compostos"]],
["Organização financeira pessoal e familiar",["Diagnóstico, receitas, despesas e orçamento","Controle de gastos, contas e planejamento mensal/anual","Gestão de dívidas, reserva, metas e grandes aquisições","Educação financeira para crianças, adolescentes e famílias"]],
["Gestão financeira empresarial",["Fluxo de caixa, contas a pagar e receber","Capital de giro, projeção de caixa e inadimplência","Orçamento, custos fixos e variáveis e indicadores","Planejamento de receitas, despesas, expansão e sustentabilidade"]],
["Precificação, receita e rentabilidade",["Formação de preços, custos e margem de contribuição","Margem de lucro, ponto de equilíbrio e rentabilidade","Precificação de produtos, serviços, pacotes e recorrência","Negociação, cobrança e desenvolvimento de fontes de receita"]],
["Economia, mercados e investimentos",["Economia brasileira e internacional, política monetária e fiscal","Câmbio, geopolítica econômica e ciclos de mercado","Renda fixa, Tesouro Direto, CDB, fundos e fundos imobiliários","Ações, ETFs, dividendos e fundamentos de bolsa","Criptoativos, volatilidade, liquidez, diversificação e risco","Perfil de risco, horizonte e educação sobre investimentos"]],
["Inteligência empresarial e patrimônio",["Leitura de balanços, EBITDA, endividamento e geração de caixa","Valuation introdutório, modelos de negócio e viabilidade","Análise de oportunidades, aquisições e cenários","Mapeamento de ativos e passivos e planejamento de longo prazo","Educação sobre holdings, governança e sucessão"]],
["Ferramentas e laboratórios",["Cashflow e controle de despesas","Simuladores de juros compostos, metas e investimentos","Calculadora de precificação e planejador financeiro","Diário financeiro, mapa patrimonial e painéis de indicadores"]]
]},
{ id:"marketing", name:"05 · Marketing, Publicidade e Aquisição", summary:"Posicionamento, conteúdo, campanhas, distribuição e captação.", groups:[
["Estratégia de marketing",["Diagnóstico, pesquisa de público e segmentação","Análise de mercado, concorrentes e jornada do cliente","Proposta de valor, calendário editorial e estratégia de lançamento"]],
["Redes sociais e conteúdo",["Criação e estruturação de perfis e biografias","Instagram, TikTok, YouTube e LinkedIn","Calendários, Reels, carrosséis, Stories e Shorts","Conteúdo institucional, educativo, comercial e comunidades"]],
["Publicidade e anúncios",["Criação de peças, imagens, vídeos e copy de anúncios","Meta Ads, Google Ads, YouTube Ads e TikTok Ads","Estrutura de campanhas, públicos, testes A/B e remarketing","Análise de desempenho, otimização e relatórios"]],
["Aquisição e presença digital",["Landing pages, formulários, iscas digitais e funis","Captação, nutrição, automação e reativação de leads","SEO técnico, local, palavras-chave e otimização de páginas","Google Business Profile, autoridade e monitoramento de tráfego"]]
]},
{ id:"comercial", name:"06 · Comercial, Vendas e Negócios", summary:"Organizar ofertas, relacionamento, prospecção, negociação e receita.", groups:[
["Estrutura comercial",["Diagnóstico comercial e organização de ofertas","Proposta de valor, pacotes, recorrência e políticas comerciais","Jornada de compra e estruturação de atendimento"]],
["SDR e prospecção",["Definição de cliente ideal e mapeamento de oportunidades","Prospecção ativa e passiva e pesquisa de empresas","Scripts, mensagens, qualificação, follow-up e agendamento","Pipeline, CRM e registro de oportunidades"]],
["Negociação e fechamento",["Roteiros de reunião, apresentações e propostas","Negociação, tratamento de objeções e fechamento","Pós-venda, retenção, indicação e expansão de contas"]],
["Equipes e documentação",["Formação de SDRs, closers e atendimento","Roleplay, simulações, avaliação e indicadores","Escopos, briefings, propostas, onboarding e pós-venda","Modelos contratuais sujeitos à revisão jurídica"]]
]},
{ id:"internacional", name:"07 · Estruturação Empresarial e Internacional", summary:"Organizar negócios, organizações e operações em diferentes mercados.", groups:[
["Estruturação de negócios e organizações",["Modelos de negócio, planejamento e estudos de viabilidade","Departamentos, funções, responsabilidades e processos","Planejamento de implantação, operação e expansão","Governança, documentação e gestão organizacional"]],
["Internacionalização",["Pesquisa de mercados estrangeiros e oportunidades","Posicionamento, sites multilíngues e comunicação internacional","Localização de conteúdo e adaptação cultural","Pesquisa de fornecedores, parceiros e canais de distribuição","Plano de entrada em novos países e atendimento internacional"]],
["Parcerias e desenvolvimento",["Mapeamento de parceiros, investidores e oportunidades","Apresentações institucionais e propostas de colaboração","Alianças estratégicas, programas de parceiros e reuniões"]]
]},
{ id:"automacao", name:"08 · Gestão, Automação e Inteligência Artificial", summary:"Conectar sistemas, automatizar rotinas e ampliar inteligência operacional.", groups:[
["Gestão operacional",["Mapeamento de processos e fluxogramas","Rotinas, procedimentos, tarefas e projetos","Prazos, indicadores, relatórios e gestão de equipes"]],
["Automação e integração",["Formulários, e-mails, atendimento e agendamentos","Vendas, pagamentos, relatórios e notificações","Integração de plataformas, sincronização e onboarding"]],
["Inteligência artificial",["Assistentes personalizados e agentes de IA","Agentes comerciais, atendimento, pesquisa e conteúdo","Assistentes administrativos e financeiros educacionais","Bases de conhecimento, RAG e análise documental"]],
["Produtividade",["Sistemas de gestão pessoal e painéis de produtividade","Gestão de ideias, prioridades, reuniões e conhecimento","Mapas de rede, teleprompters e acompanhamento"]]
]},
{ id:"educacao", name:"09 · Educação, Conhecimento e Propriedade Intelectual", summary:"Transformar conhecimento em métodos, materiais e ativos intelectuais.", groups:[
["Estruturação educacional",["Cursos, módulos, trilhas e planejamento pedagógico","Aulas, apostilas, exercícios, questionários e avaliações","Certificados, treinamentos empresariais e capacitação"]],
["Publicações e métodos",["Livros, e-books, manuais, guias e relatórios","Extração e documentação de conhecimento tácito","Frameworks, metodologias, processos autorais e nomenclaturas","Preparação documental para proteção de direitos e marcas"]],
["Produtos de conhecimento",["Cursos online, bibliotecas e assinaturas","Comunidades, mentorias, programas e plataformas Academy","Laboratórios, simuladores e jogos educacionais","Palestras, workshops, seminários, podcasts e eventos"]]
]},
{ id:"legado", name:"10 · Expansão Patrimonial e Legado", summary:"Preparar estruturas para crescer, preservar valor e continuar.", groups:[
["Estratégia patrimonial",["Mapeamento de ativos e passivos","Planejamento de aquisição e diversificação","Educação sobre preservação de capital e cenários","Organização documental e planejamento de longo prazo"]],
["Expansão empresarial",["Novos mercados, produtos, unidades e marcas","Parcerias, canais de distribuição e crescimento","Estudos de aquisição e preparação para venda de empresas"]],
["Governança e continuidade",["Governança, responsabilidades e formação de lideranças","Planejamento sucessório e preparação para delegação","Documentação de processos, cultura e conhecimento institucional","Proteção de propriedade intelectual e indicadores de continuidade"]],
["Movimento e comunidade",["Manifestos, princípios, causas e movimentos","Comunidades, redes de colaboração e participação","Eventos, encontros e formação de lideranças"]]
]}
];

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const statusOptions = ["Existente","Estruturado","Em desenvolvimento","Sob demanda"];

export function renderCatalogoCapacidades() {
  if (!isMentorSession()) return '<div class="view active"><p class="empty">Acesso restrito ao mentor.</p></div>';
  const cards = CATALOG.map((dept) => {
    const groups = dept.groups.map(([heading, items]) =>
      '<section class="cap-group"><h4>'+esc(heading)+'</h4><ul>'+items.map((item) => '<li>'+esc(item)+'</li>').join("")+'</ul></section>'
    ).join("");
    return '<details class="cap-dept" data-search="'+esc((dept.name+" "+dept.summary+" "+dept.groups.flat().join(" ")).toLowerCase())+'"><summary><span class="cap-num">'+esc(dept.name.slice(0,2))+'</span><span class="cap-title"><strong>'+esc(dept.name)+'</strong><small>'+esc(dept.summary)+'</small></span><span class="cap-count">'+dept.groups.reduce((n,g)=>n+g[1].length,0)+' capacidades</span></summary><div class="cap-content">'+groups+'</div></details>';
  }).join("");
  return '<div class="view active cap-view"><div class="back-link" data-nav="mentor">← Gestão do mentor</div><p class="hero-line">Akasha Hub · uso interno</p><h2 class="hero-title">Catálogo de Capacidades</h2><p class="hero-sub">Inventário mestre do que o ecossistema pode compreender, estruturar, desenvolver e coordenar. Não representa promessa de execução automática nem itens incluídos em todo contrato.</p><div class="cap-toolbar"><input id="capSearch" type="search" placeholder="Buscar serviço, competência ou entrega..." aria-label="Buscar no catálogo"><span id="capResultCount">'+CATALOG.length+' departamentos</span></div><div class="cap-status-note"><strong>Classificação operacional</strong><p>Use os estados para distinguir o que já existe, o que está estruturado, o que exige desenvolvimento e o que depende de parceiros ou especialistas.</p><div class="cap-statuses">'+statusOptions.map((s)=>'<span>'+esc(s)+'</span>').join("")+'</div></div><div class="cap-list">'+cards+'</div><div class="cap-footnote">Serviços jurídicos, contábeis, regulados, imigração, consultoria de investimentos e atividades técnicas especializadas exigem profissionais habilitados e validação na jurisdição aplicável. Escopo, prazos, preço e responsabilidades são definidos por projeto.</div></div>';
}

export function bindCatalogoCapacidades() {
  if (!isMentorSession()) return;
  const root = document.querySelector(".cap-view");
  if (!root || root.dataset.capBound === "1") return;
  root.dataset.capBound = "1";
  const input = root.querySelector("#capSearch");
  const items = Array.from(root.querySelectorAll(".cap-dept"));
  const count = root.querySelector("#capResultCount");
  input?.addEventListener("input", () => {
    const q = String(input.value || "").trim().toLowerCase();
    let visible = 0;
    items.forEach((item) => {
      const match = !q || item.dataset.search.includes(q);
      item.hidden = !match;
      if (match) visible++;
      if (q && match) item.open = true;
      if (!q) item.open = false;
    });
    if (count) count.textContent = visible+" de "+items.length+" departamentos";
  });
}
