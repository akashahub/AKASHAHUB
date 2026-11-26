// Receitas especializadas da Biblioteca de Prompts Akasha Hub.
// Camada estática: não grava dados, não chama APIs e não altera aplicativos existentes.
const SPECIALIZED_PROMPT_ROWS = [
["IMG-01","Imagem e Fotografia","Photo Enhancement Pro","Melhorar luz, nitidez, contraste, cores e resolução sem criar detalhes falsos.","ID","foto, imagem, nitidez, resolução"],
["IMG-02","Imagem e Fotografia","Restauração Fotográfica Realista","Recuperar fotografias antigas, riscadas, desbotadas ou danificadas preservando sua aparência documental.","ID","foto antiga, restauração, danos"],
["IMG-03","Imagem e Fotografia","Preservação de Identidade Facial","Editar uma fotografia sem alterar identidade, formato do rosto, idade aparente ou traços individuais.","ID","rosto, identidade, retrato"],
["IMG-04","Imagem e Fotografia","Retrato Executivo Premium","Criar um retrato profissional coerente com setor, posicionamento, personalidade e uso pretendido.","ID","retrato, executivo, profissional"],
["IMG-05","Imagem e Fotografia","Image Creator Studio","Transformar uma ideia ou briefing em uma imagem com composição, estilo, cenário e finalidade definidos.","ID","criar imagem, arte, visual"],
["IMG-06","Imagem e Fotografia","Character Creator","Desenvolver personagem com aparência, personalidade, história, referências visuais e ficha de consistência.","ID","personagem, avatar, identidade"],
["IMG-07","Imagem e Fotografia","Consistent Character Studio","Manter o mesmo personagem reconhecível em diferentes poses, roupas, expressões e cenários.","ID","personagem consistente, poses"],
["IMG-08","Imagem e Fotografia","Product Photography Studio","Planejar fotografia de produto com iluminação, ângulos, fundo, escala e foco comercial.","ID","produto, fotografia, catálogo"],
["IMG-09","Imagem e Fotografia","AI Campaign Creator","Criar conceito e conjunto de peças visuais coerentes para campanha, anúncio ou lançamento.","ID","campanha, anúncio, criativo"],
["IMG-10","Imagem e Fotografia","Logo Creator & Redesign","Criar ou modernizar logotipo com briefing, legibilidade, diferenciação e aplicações práticas.","ID","logo, logotipo, redesign"],
["IMG-11","Imagem e Fotografia","Brand Identity Visual Kit","Construir sistema visual com paleta, tipografia, grafismos, aplicações e regras de uso.","ID","identidade visual, marca"],
["IMG-12","Imagem e Fotografia","Social Media Design Kit","Planejar kit visual de posts, carrosséis, Stories, capas e thumbnails com unidade visual.","ID","redes sociais, posts, carrossel"],
["VID-01","Conteúdo e Vídeo","Roteirista de Vídeos Virais","Criar roteiro curto com gancho, retenção, desenvolvimento, prova, ritmo e chamada para ação sem prometer viralização.","ID","roteiro, reels, shorts, vídeo"],
["VID-02","Conteúdo e Vídeo","Roteiro com Identidade Pessoal","Escrever com base na história, vocabulário, personalidade, posicionamento e experiências reais da pessoa.","AE","voz, identidade, história, roteiro"],
["VID-03","Conteúdo e Vídeo","Script Improver","Melhorar clareza, ritmo e força de um roteiro preservando intenção, voz e ideias originais.","ID","melhorar roteiro, edição"],
["VID-04","Conteúdo e Vídeo","Storytelling de Autoridade","Transformar experiências e aprendizados reais em narrativas úteis, humanas e relevantes para o público.","AE","storytelling, autoridade, história"],
["VID-05","Conteúdo e Vídeo","Content Repurposing Engine","Converter um conteúdo principal em formatos adaptados para diferentes canais sem repetir mecanicamente o texto.","ID","reaproveitar conteúdo, multicanal"],
["VID-06","Conteúdo e Vídeo","YouTube Script Architect","Estruturar vídeo longo com promessa honesta, abertura, capítulos, exemplos, transições e encerramento.","ID","youtube, vídeo longo, roteiro"],
["VID-07","Conteúdo e Vídeo","Personal Brand Builder","Organizar posicionamento pessoal, bio, mensagem central, pilares de conteúdo e presença pública.","AE","marca pessoal, posicionamento"],
["VID-08","Conteúdo e Vídeo","Creator Content Calendar","Criar calendário editorial realista conectado a objetivos, formatos, capacidade de produção e métricas.","ID","calendário editorial, conteúdo"],
["VID-09","Conteúdo e Vídeo","AI Video Director","Converter ideia em plano de cenas, enquadramentos, movimentos, continuidade, áudio e instruções de produção.","ID","direção de vídeo, cenas, produção"],
["NEG-01","Negócios e Produtos","Business in a Box","Estruturar um negócio desde a ideia até a primeira oferta testável, com etapas e decisões explícitas.","ID","negócio do zero, empresa"],
["NEG-02","Negócios e Produtos","Business Model Validator","Testar hipóteses de problema, cliente, solução, disposição a pagar e viabilidade antes de investir pesado.","AF","validar negócio, modelo"],
["NEG-03","Negócios e Produtos","Market Research Pro","Pesquisar mercado, demanda, concorrentes, tendências, segmentos e oportunidades com fontes verificáveis.","ID","pesquisa de mercado, demanda"],
["NEG-04","Negócios e Produtos","Competitor Intelligence","Comparar concorrentes por oferta, preço, posicionamento, canais, experiência e diferenciais observáveis.","ID","concorrentes, benchmark"],
["NEG-05","Negócios e Produtos","Niche Finder","Identificar nichos e segmentos promissores cruzando demanda, capacidade, concorrência e acesso ao público.","ID","nicho, segmento, público"],
["NEG-06","Negócios e Produtos","Offer Builder","Transformar capacidade em oferta clara com público, resultado, escopo, formato, preço a validar e prova.","ID","oferta, produto, serviço"],
["NEG-07","Negócios e Produtos","Website Architect","Planejar arquitetura, páginas, conteúdo, navegação, conversão, requisitos e critérios de aceite de um site.","ID","site, website, páginas"],
["NEG-08","Negócios e Produtos","Landing Page Conversion Pro","Construir estrutura de landing page com mensagem, prova, objeções, CTA e hipóteses de teste.","ID","landing page, conversão"],
["NEG-09","Negócios e Produtos","App & SaaS Idea Builder","Transformar uma ideia de aplicativo em problema, usuários, funcionalidades, fluxos, MVP e especificação.","ID","aplicativo, app, saas"],
["NEG-10","Negócios e Produtos","E-commerce Launch Kit","Planejar loja virtual, catálogo, categorias, jornada, checkout, atendimento e operação de pedidos.","ID","ecommerce, loja virtual"],
["PES-01","Pesquisa e Decisão","Deep Research Analyst","Investigar um tema com perguntas de pesquisa, fontes primárias, evidências, divergências e síntese citada.","AE","pesquisa profunda, fontes"],
["PES-02","Pesquisa e Decisão","Trend Radar","Identificar tendências e sinais emergentes, separar evidência de especulação e avaliar relevância comercial.","EX","tendências, sinais, oportunidades"],
["PES-03","Pesquisa e Decisão","Idea Validator","Avaliar uma ideia por problema, usuário, viabilidade, riscos, evidências e experimento de baixo custo.","AF","validar ideia, hipótese"],
["PES-04","Pesquisa e Decisão","Strategic Decision Maker","Comparar alternativas por critérios, cenários, riscos, reversibilidade e custo de oportunidade.","AF","decisão, alternativas"],
["PES-05","Pesquisa e Decisão","Business Diagnosis Pro","Diagnosticar modelo, operação, vendas, finanças e gargalos sem confundir sintomas com causas.","AF","diagnóstico empresarial"],
["FIN-01","Finanças e Trading","Financial Intelligence Analyst","Organizar receitas, custos, margens, caixa e cenários a partir de dados fornecidos, explicitando premissas.","AF","financeiro, custos, margens"],
["FIN-02","Finanças e Trading","Crypto Market Research","Pesquisar criptoativos, fundamentos, liquidez, notícias, riscos e cenários sem recomendar retorno garantido.","AF","cripto, crypto, mercado"],
["FIN-03","Finanças e Trading","TradingView Chart Analyst","Descrever tendência, estrutura, suportes, resistências e indicadores visíveis, distinguindo observação de hipótese.","AF","tradingview, gráfico, análise"],
["FIN-04","Finanças e Trading","Technical Analysis Tutor","Ensinar conceitos de análise técnica com exemplos simples, exercícios e alertas sobre limitações.","AF","análise técnica, aprender"],
["FIN-05","Finanças e Trading","Crypto Risk Manager","Estruturar controles educacionais de exposição, perda máxima, tamanho de posição e disciplina de risco.","AF","risco, posição, cripto"],
["FIN-06","Finanças e Trading","Trading Strategy Backtester","Converter regras de estratégia em protocolo de teste histórico, custos, métricas e prevenção de overfitting.","AF","backtest, estratégia, histórico"],
["FIN-07","Finanças e Trading","Trading Journal Analyst","Analisar diário de operações para encontrar padrões, aderência às regras, erros e melhorias de processo.","AF","diário de trading, operações"],
["FIN-08","Finanças e Trading","Binance Market Research Assistant","Organizar pesquisa sobre mercados e dados públicos da Binance, com horário, par, fonte e limitações.","AF","binance, mercado, dados"],
["FIN-09","Finanças e Trading","Macro & Crypto Intelligence","Relacionar juros, inflação, liquidez, câmbio, eventos macroeconômicos e mercados cripto com cenários.","AF","macroeconomia, cripto, juros"],
["EST-01","Estratégia e Execução","Arquiteto de Soluções Estratégicas","Converter um desafio amplo em diagnóstico, opções, arquitetura de solução, etapas e critérios de sucesso.","AE","soluções, estratégia"],
["EST-02","Estratégia e Execução","Pesquisador de Inteligência Atualizada","Pesquisar informação recente, priorizar fontes confiáveis, registrar datas e apontar o que ainda é incerto.","AE","pesquisa atualizada, inteligência"],
["EST-03","Estratégia e Execução","Analista Crítico e Verificador de Informações","Verificar afirmações, rastrear evidências, testar coerência e classificar conclusões por grau de confiança.","AE","verificação, checagem, fatos"],
["EST-04","Estratégia e Execução","Consultor de Decisões Complexas","Estruturar decisões com múltiplos interesses, dependências, cenários, riscos e consequências.","AF","decisão complexa, cenários"],
["EST-05","Estratégia e Execução","Organizador de Conhecimento e Documentos","Classificar documentos, extrair informações, criar índice, apontar lacunas e preservar referências de origem.","AE","documentos, organização, conhecimento"],
["EST-06","Estratégia e Execução","Diagnóstico Estratégico de Negócios","Avaliar estratégia, mercado, oferta, operação, finanças e gestão e priorizar os gargalos relevantes.","AF","diagnóstico, estratégia empresarial"],
["EST-07","Estratégia e Execução","Estrategista de Crescimento e Escala","Desenhar caminhos de crescimento considerando capacidade, aquisição, retenção, margem e qualidade.","EX","crescimento, escala"],
["EST-08","Estratégia e Execução","Analista Financeiro e de Viabilidade","Avaliar viabilidade com dados, custos, receitas, cenários, ponto de equilíbrio e sensibilidade.","AF","viabilidade, projeções"],
["EST-09","Estratégia e Execução","Arquiteto de Produtos e Ofertas","Estruturar portfólio, jornada, escopo, níveis de oferta, entregáveis e hipóteses de monetização.","ID","produto, portfólio, oferta"],
["EST-10","Estratégia e Execução","Estrategista de Marketing e Aquisição","Planejar posicionamento, canais, campanhas, funil, orçamento de teste e indicadores de aquisição.","ID","marketing, aquisição, funil"],
["EST-11","Estratégia e Execução","Engenheiro de Software e Auditor de Código","Analisar requisitos e código, mapear dependências, propor mudanças mínimas, testes e riscos de regressão.","ID","software, código, auditoria"],
["EST-12","Estratégia e Execução","Arquiteto de Automação e Agentes de IA","Mapear tarefas, gatilhos, dados, permissões, integrações e pontos de validação humana antes de automatizar.","EX","automação, agentes, IA"],
["EST-13","Estratégia e Execução","Criador de Conteúdo Multicanal","Planejar uma peça-mãe e suas adaptações por canal, mantendo mensagem, identidade e objetivo consistentes.","ID","conteúdo, canais"],
["EST-14","Estratégia e Execução","Especialista em Vendas e Negociação","Preparar diagnóstico comercial, reunião, proposta, objeções e follow-up sem pressão enganosa.","EX","vendas, negociação"],
["EST-15","Estratégia e Execução","Gerente de Projetos e Execução","Converter objetivos em escopo, tarefas, responsáveis, dependências, marcos, riscos e acompanhamento.","EX","projeto, execução, gestão"],
["GLO-01","Internacionalização e Expansão Global","Global Business Diagnostician","Avaliar prontidão internacional: produto, operação, equipe, finanças, propriedade intelectual, clientes e capacidade de entrega.","EX","internacionalização, expansão global"],
["GLO-02","Internacionalização e Expansão Global","International Market Finder","Comparar países e segmentos por demanda, concorrência, poder de compra, barreiras, custo de entrada e acesso comercial.","EX","países, mercados, exterior"],
["GLO-03","Internacionalização e Expansão Global","Global Business Model Architect","Adaptar proposta de valor, receita, distribuição, atendimento e entrega para operar em mais de um país.","ID","modelo global, negócio internacional"],
["GLO-04","Internacionalização e Expansão Global","Internationalization Roadmap","Criar roteiro faseado de entrada em mercado estrangeiro com hipóteses, marcos, orçamento e critérios de avanço.","EX","roadmap, plano internacional"],
["GLO-05","Internacionalização e Expansão Global","Global Brand Positioning","Adaptar posicionamento, linguagem, marca, conteúdo e experiência ao contexto cultural de cada mercado.","ID","marca global, localização"],
["GLO-06","Internacionalização e Expansão Global","International Revenue Architect","Desenhar ofertas, modelos de cobrança, preços por mercado, moeda, recorrência e cenários de receita internacional.","AF","dólar, euro, receita internacional"],
["GLO-07","Internacionalização e Expansão Global","Cross-Border Operations Planner","Planejar atendimento, equipe, fornecedores, pagamentos, logística, suporte e operação entre países.","EX","operação internacional, cross-border"],
["GLO-08","Internacionalização e Expansão Global","Global Legal & Tax Researcher","Mapear perguntas jurídicas, fiscais, societárias, trabalhistas, imigração e compliance para revisão por especialistas locais.","LG","tributação internacional, jurídico, compliance"],
["GLO-09","Internacionalização e Expansão Global","International Partnership Builder","Mapear e qualificar parceiros, distribuidores, canais, clientes-âncora e potenciais investidores por país.","EX","parcerias, distribuidores, investidores"],
["GLO-10","Internacionalização e Expansão Global","Global Valuation Strategist","Analisar fatores que podem influenciar valuation: receita recorrente, margem, crescimento, governança, ativos e dependência do fundador.","LG","valuation, valor de empresa, escala"]
];
 
// Vínculo explícito entre cada receita especializada e capacidades oficiais.
// A receita continua sendo um prompt; não cria uma capacidade duplicada.
const SPECIALIZED_CAPABILITY_LINKS = {
  "IMG-01": [
    "0202-C08"
  ],
  "IMG-02": [
    "0202-C08"
  ],
  "IMG-03": [
    "0202-C05",
    "0202-C08"
  ],
  "IMG-04": [
    "0202-C05",
    "0101-C07"
  ],
  "IMG-05": [
    "0202-C09"
  ],
  "IMG-06": [
    "0202-C09"
  ],
  "IMG-07": [
    "0202-C09"
  ],
  "IMG-08": [
    "0202-C06"
  ],
  "IMG-09": [
    "0202-C03",
    "0505-C08"
  ],
  "IMG-10": [
    "0202-C01"
  ],
  "IMG-11": [
    "0202-C02"
  ],
  "IMG-12": [
    "0202-C07",
    "0505-C06"
  ],
  "VID-01": [
    "0202-C13",
    "0202-C14",
    "0505-C06"
  ],
  "VID-02": [
    "0101-C09",
    "0202-C11",
    "0202-C13"
  ],
  "VID-03": [
    "0202-C13"
  ],
  "VID-04": [
    "0101-C09",
    "0202-C11"
  ],
  "VID-05": [
    "0505-C06",
    "0505-C07",
    "0202-C16"
  ],
  "VID-06": [
    "0202-C13",
    "0202-C14",
    "0505-C05"
  ],
  "VID-07": [
    "0101-C08",
    "0101-C09",
    "0101-C10",
    "0202-C11"
  ],
  "VID-08": [
    "0505-C03",
    "0505-C06"
  ],
  "VID-09": [
    "0202-C13",
    "0202-C14"
  ],
  "NEG-01": [
    "0707-C01",
    "0707-C03",
    "0606-C01"
  ],
  "NEG-02": [
    "0707-C01",
    "0404-C24",
    "0606-C01"
  ],
  "NEG-03": [
    "0505-C01",
    "0505-C02",
    "0707-C05"
  ],
  "NEG-04": [
    "0505-C02",
    "0606-C05"
  ],
  "NEG-05": [
    "0505-C01",
    "0606-C04"
  ],
  "NEG-06": [
    "0606-C01",
    "0606-C02",
    "0202-C12",
    "0404-C15"
  ],
  "NEG-07": [
    "0303-C01",
    "0303-C10"
  ],
  "NEG-08": [
    "0303-C02",
    "0505-C12"
  ],
  "NEG-09": [
    "0303-C05",
    "0303-C09",
    "0303-C10"
  ],
  "NEG-10": [
    "0303-C04",
    "0303-C16"
  ],
  "PES-01": [
    "0808-C10",
    "0909-C05",
    "0505-C02",
    "0707-C05"
  ],
  "PES-02": [
    "0505-C16"
  ],
  "PES-03": [
    "0707-C01",
    "0404-C24"
  ],
  "PES-04": [
    "0101-C12",
    "0404-C22",
    "0808-C12"
  ],
  "PES-05": [
    "0606-C01",
    "0707-C01",
    "0808-C01"
  ],
  "FIN-01": [
    "0404-C09",
    "0404-C11",
    "0404-C12",
    "0404-C23",
    "0404-C28",
    "0404-C31"
  ],
  "FIN-02": [
    "0404-C33",
    "0404-C21"
  ],
  "FIN-03": [
    "0404-C32"
  ],
  "FIN-04": [
    "0404-C32"
  ],
  "FIN-05": [
    "0404-C34",
    "0404-C22"
  ],
  "FIN-06": [
    "0404-C35"
  ],
  "FIN-07": [
    "0404-C36"
  ],
  "FIN-08": [
    "0404-C33"
  ],
  "FIN-09": [
    "0404-C17",
    "0404-C18",
    "0404-C21",
    "0404-C33"
  ],
  "EST-01": [
    "0101-C04",
    "0101-C06",
    "0707-C01",
    "0808-C01"
  ],
  "EST-02": [
    "0808-C10",
    "0505-C02",
    "0707-C05"
  ],
  "EST-03": [
    "0808-C10",
    "0707-C04",
    "0303-C15"
  ],
  "EST-04": [
    "0101-C12",
    "0404-C22",
    "0808-C12"
  ],
  "EST-05": [
    "0909-C05",
    "0909-C04",
    "0808-C10"
  ],
  "EST-06": [
    "0606-C01",
    "0707-C01",
    "0808-C01"
  ],
  "EST-07": [
    "1010-C05",
    "1010-C06",
    "0707-C03"
  ],
  "EST-08": [
    "0404-C23",
    "0404-C24",
    "0404-C25"
  ],
  "EST-09": [
    "0606-C01",
    "0606-C02",
    "0909-C08"
  ],
  "EST-10": [
    "0505-C01",
    "0505-C03",
    "0505-C09",
    "0505-C10",
    "0505-C12"
  ],
  "EST-11": [
    "0303-C10",
    "0303-C14",
    "0303-C15"
  ],
  "EST-12": [
    "0808-C06",
    "0808-C07",
    "0808-C08"
  ],
  "EST-13": [
    "0505-C06",
    "0505-C07",
    "0202-C16"
  ],
  "EST-14": [
    "0606-C08",
    "0606-C09",
    "0606-C11"
  ],
  "EST-15": [
    "0808-C02",
    "0808-C03",
    "0707-C02"
  ],
  "GLO-01": [
    "0707-C03",
    "0707-C05",
    "1010-C05"
  ],
  "GLO-02": [
    "0707-C05",
    "0707-C09"
  ],
  "GLO-03": [
    "0707-C01",
    "0707-C05",
    "0505-C01"
  ],
  "GLO-04": [
    "0707-C03",
    "0707-C09"
  ],
  "GLO-05": [
    "0707-C06",
    "0707-C07",
    "0202-C11"
  ],
  "GLO-06": [
    "0404-C15",
    "0404-C16",
    "0707-C01"
  ],
  "GLO-07": [
    "0707-C03",
    "0707-C08",
    "0707-C09"
  ],
  "GLO-08": [
    "0707-C13"
  ],
  "GLO-09": [
    "0707-C10",
    "0707-C12"
  ],
  "GLO-10": [
    "0404-C24",
    "1010-C07"
  ]
};

export const SPECIALIZED_PROMPTS = SPECIALIZED_PROMPT_ROWS.map(([id, category, title, mission, phase, keywords]) => ({
  id, category, title, mission, phase, keywords,
  capabilityIds: SPECIALIZED_CAPABILITY_LINKS[id] || []
}));

const CATEGORY_METHODS = {
  "Imagem e Fotografia": {
    inputs:["Imagem original ou referência autorizada","O que deve melhorar e o que precisa permanecer intacto","Uso final, formato, proporção e nível de realismo"],
    steps:["Inspecionar a referência e descrever o estado atual","Separar mudanças permitidas de elementos que não podem mudar","Definir instrução visual objetiva e verificável","Produzir ou orientar a edição em etapas","Comparar resultado com a referência e apontar artefatos"],
    outputs:["Briefing visual pronto para ferramenta de imagem","Instrução final de criação ou edição","Checklist de fidelidade, qualidade e exportação"],
    limits:"Não inventar detalhes como se fossem reais. Em fotos de pessoas, preservar identidade e não alterar traços sem pedido explícito."
  },
  "Conteúdo e Vídeo": {
    inputs:["Público e canal","Objetivo do conteúdo e ação desejada","Voz, história, exemplos e fatos que podem ser usados"],
    steps:["Identificar mensagem central e público","Criar ângulo e gancho coerentes","Estruturar começo, desenvolvimento e conclusão","Adaptar ritmo e linguagem ao canal","Revisar autenticidade, clareza e CTA"],
    outputs:["Roteiro completo","Sugestões de cenas, textos na tela e CTA","Versões ou cortes por canal e checklist de gravação"],
    limits:"Não inventar histórias, depoimentos, resultados ou dados. Não prometer viralização."
  },
  "Negócios e Produtos": {
    inputs:["Problema e cliente que pretende atender","Oferta ou ideia atual","Recursos, orçamento, prazo e capacidade de execução"],
    steps:["Definir problema, cliente e hipótese de valor","Pesquisar alternativas e concorrência","Desenhar modelo, jornada e oferta","Priorizar MVP ou experimento de validação","Definir métricas, custos e plano de execução"],
    outputs:["Diagnóstico e hipótese principal","Modelo ou especificação da solução","Plano de validação com tarefas, responsáveis e métricas"],
    limits:"Diferenciar dados verificados de estimativas. Não apresentar projeções como garantias."
  },
  "Pesquisa e Decisão": {
    inputs:["Pergunta central e decisão que a pesquisa deve apoiar","Recorte geográfico e temporal","Fontes permitidas e profundidade desejada"],
    steps:["Definir pergunta e critérios de evidência","Buscar fontes primárias e independentes quando possível","Comparar dados, datas e divergências","Separar fatos, inferências e incertezas","Concluir com recomendação proporcional às evidências"],
    outputs:["Síntese executiva com fontes e datas","Tabela de evidências, lacunas e riscos","Recomendação e próximos passos verificáveis"],
    limits:"Não inventar fontes, citações ou atualidade. Informar quando não foi possível verificar."
  },
  "Finanças e Trading": {
    inputs:["Ativo, mercado e período analisado","Dados ou gráficos fornecidos e sua origem","Objetivo educacional, horizonte e limites de risco"],
    steps:["Identificar dados disponíveis e sua data","Explicar método e premissas","Analisar cenários e riscos sem certeza artificial","Calcular apenas com dados suficientes e mostrar fórmula","Definir controles, invalidação e revisão"],
    outputs:["Leitura estruturada ou análise educacional","Premissas, cálculos e cenários","Checklist de risco e pontos que exigem validação"],
    limits:"Não prometer rentabilidade nem emitir ordem de compra ou venda. Trading e cripto envolvem risco elevado; validar dados e decisões com profissional habilitado quando aplicável."
  },
  "Estratégia e Execução": {
    inputs:["Situação atual e resultado desejado","Pessoas, sistemas, orçamento e restrições","Decisões já tomadas e prazo"],
    steps:["Resumir contexto e confirmar objetivo","Mapear causas, dependências e alternativas","Escolher prioridade e justificar trade-offs","Converter estratégia em plano executável","Definir responsáveis, marcos e critérios de aceite"],
    outputs:["Diagnóstico e recomendação","Plano priorizado com responsáveis e prazos","Indicadores, riscos e próxima decisão"],
    limits:"Não executar alterações em sistemas, enviar comunicações ou assumir compromissos sem autorização."
  },
  "Internacionalização e Expansão Global": {
    inputs:["País de origem e países de interesse","Produto, serviço, clientes e modelo de receita","Faturamento, margem, recursos e capacidade de entrega, se disponíveis","Clientes, parceiros ou presença internacional já existentes"],
    steps:["Diagnosticar prontidão e ativos transferíveis","Comparar mercados com critérios explícitos e fontes atuais","Adaptar oferta, preço, marca, canais e operação","Mapear estrutura societária, fiscal, jurídica e regulatória como questões para especialistas locais","Construir plano-piloto, orçamento, indicadores e critérios de expansão"],
    outputs:["Diagnóstico de prontidão internacional","Matriz comparativa de países e mercados","Modelo de entrada e adaptação","Roadmap de 90 dias e plano de 12 meses com premissas","Lista de validações profissionais e riscos"],
    limits:"Não recomendar constituição de empresa, residência fiscal, visto, estrutura tributária ou captação como parecer jurídico. Exigir validação de advogados, contadores e especialistas locais. Valuation é estimativa condicionada a dados, não promessa."
  }
};

export function buildSpecializedPrompt(item) {
  const pack = CATEGORY_METHODS[item.category] || CATEGORY_METHODS["Estratégia e Execução"];
  const inputs = pack.inputs.map((x,i)=>(i+1)+". "+x).join("\n");
  const steps = pack.steps.map((x,i)=>(i+1)+". "+x).join("\n");
  const outputs = pack.outputs.map((x,i)=>(i+1)+". "+x).join("\n");
  return `# AKASHA HUB · PROMPT ESPECIALIZADO
## ${item.id} · ${item.title}

### MISSÃO
${item.mission}

Atue como especialista sênior nesta tarefa. O mentor é o protagonista do projeto: conduz a relação com o cliente, valida decisões e aprova entregáveis. Você é copiloto de pesquisa, análise, criação e planejamento. Seja didático, objetivo e prático: explique termos difíceis em linguagem simples e transforme cada recomendação em uma próxima ação.

### CONTEXTO COMPARTILHADO
Use as variáveis gerais da Biblioteca quando estiverem disponíveis. Não peça novamente o que já foi informado. Consulte somente dados autorizados do cliente e do projeto selecionado.
- Cliente/empresa: {{NOME_DO_CLIENTE_OU_EMPRESA}}
- Segmento/modelo: {{SEGMENTO_E_MODELO_DE_NEGOCIO}}
- Mercado/localização: {{PAIS_CIDADE_E_MERCADO}}
- Estágio/histórico: {{ESTAGIO_ATUAL_E_HISTORICO}}
- Objetivo: {{OBJETIVO_PRINCIPAL_E_RESULTADO_ESPERADO}}
- Problema/oportunidade: {{PROBLEMA_OU_OPORTUNIDADE}}
- Público: {{PUBLICO_E_CLIENTE_IDEAL}}
- Oferta: {{OFERTA_PRODUTO_SERVICO}}
- Dados: {{DADOS_E_INDICADORES_DISPONIVEIS}}
- Recursos/restrições: {{RECURSOS_ORCAMENTO_E_RESTRICOES}}
- Prazo: {{PRAZO_E_PRIORIDADE}}
- Ativos/processos: {{ATIVOS_FERRAMENTAS_E_PROCESSOS_EXISTENTES}}
- Decisões/preferências: {{DECISOES_JA_TOMADAS_E_PREFERENCIAS}}
- Fontes autorizadas: {{FONTES_DOCUMENTOS_E_REFERENCIAS_AUTORIZADAS}}
- Formato: {{FORMATO_DO_ENTREGAVEL}}
- Validador: {{RESPONSAVEL_PELA_VALIDACAO}}

### ENTRADAS ESPECÍFICAS DESTA TAREFA
${inputs}

### MÉTODO DE TRABALHO
${steps}

### ENTREGÁVEIS
${outputs}

### REGRAS DE QUALIDADE
- Comece com uma síntese curta do que entendeu.
- Separe fatos fornecidos, dados verificados, hipóteses e recomendações.
- Faça no máximo cinco perguntas essenciais por rodada; aceite "não sei".
- Se já houver contexto suficiente, avance sem perguntas redundantes.
- Não invente dados, fontes, funcionalidades, clientes, resultados ou credenciais.
- Dê exemplos concretos e explique como executar cada etapa.
- Quando houver alternativas, compare prós, contras, custos, riscos e recomende uma.
- Indique o que depende de ferramenta externa, especialista ou decisão do mentor.
- Termine com próximos passos, responsável sugerido, prazo e critério de conclusão.

### LIMITES E GOVERNANÇA
${pack.limits}
Não misture informações de clientes diferentes. Não solicite senhas, tokens ou credenciais. Não grave, publique, envie, contrate, transacione ou altere sistemas sem autorização expressa do mentor.

### CONEXÃO COM O AKASHA HUB
- Departamento: ${item.category}
- Fase principal: ${item.phase}
- Capacidades relacionadas: ${item.keywords}
- A relação com aplicativos é consultiva: primeiro identifique quais ferramentas cadastradas podem apoiar a tarefa; não afirme que há integração automática nem duplique formulários, cálculos ou registros existentes.
- O mentor valida o resultado e decide se ele se torna entregável do projeto.

### INÍCIO
Leia o contexto disponível, informe o que já está claro e identifique somente as lacunas indispensáveis. Depois execute a missão de ${item.title} e entregue o material para revisão do mentor.`;
}
