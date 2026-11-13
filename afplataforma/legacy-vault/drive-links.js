export const DRIVE_VAULT = {
  title: "Legacy Vault",
  subtitle: "Biblioteca viva da Arquitetura de Legado",
  general: {
    title: "Biblioteca Geral",
    description: "Conteúdos transversais, referências e materiais que apoiam mais de uma fase.",
    folderUrl: "",
    pillars: [
      { id: "metodologia", title: "Metodologia e visão geral", description: "Princípios, mapa do processo e orientações gerais.", icon: "✧", url: "" },
      { id: "modelos", title: "Modelos e documentos", description: "Modelos reutilizáveis, fichas e documentos de apoio.", icon: "▤", url: "" },
      { id: "midias", title: "Mídias e conteúdos", description: "Vídeos, áudios, imagens e materiais complementares.", icon: "▶", url: "" }
    ]
  },
  phases: [
    { id: "1", name: "Arquitetura de Essência", short: "Essência", icon: "✧", description: "Identidade, história, valores e direção inicial.", folderUrl: "", pillars: [
      { id: "historia", title: "Identidade e história", description: "História pessoal, familiar, referências e visão de mundo.", icon: "◉", url: "" },
      { id: "valores", title: "Valores e capacidades", description: "Valores, talentos, competências e possibilidades.", icon: "◇", url: "" },
      { id: "consciencia", title: "Consciência e desenvolvimento", description: "Exercícios, leituras, práticas e conteúdos de aprofundamento.", icon: "✧", url: "" },
      { id: "marca", title: "Marca e posicionamento inicial", description: "Identidade, narrativa, símbolos e direção de marca.", icon: "◈", url: "" },
      { id: "objetivos", title: "Objetivos e direção", description: "Objetivos pessoais, empresariais e visão de futuro.", icon: "◎", url: "" },
      { id: "leitura-financeira", title: "Leitura financeira inicial", description: "Materiais de introdução à realidade financeira e às prioridades.", icon: "⌁", url: "" }
    ] },
    { id: "2", name: "Império Digital", short: "Império Digital", icon: "◈", description: "Posicionamento, marca, oferta e ativos digitais.", folderUrl: "", pillars: [
      { id: "estrategia", title: "Estratégia e posicionamento", description: "Pesquisa, diferenciação, público e proposta de valor.", icon: "◎", url: "" },
      { id: "branding", title: "Branding e comunicação", description: "Identidade visual, verbal, narrativa e materiais.", icon: "✧", url: "" },
      { id: "ofertas", title: "Produtos, serviços e ofertas", description: "Modelos de negócio, ofertas, precificação inicial e monetização.", icon: "◇", url: "" },
      { id: "ativos-digitais", title: "Sites, apps e plataformas", description: "Arquitetura digital, aplicações, sites e integrações.", icon: "▣", url: "" },
      { id: "marketing", title: "Marketing e aquisição", description: "Conteúdo, canais, campanhas e relacionamento.", icon: "↗", url: "" },
      { id: "jornada-comercial", title: "Jornada comercial", description: "Experiência do cliente, processo de venda e materiais comerciais.", icon: "⇢", url: "" }
    ] },
    { id: "3", name: "Alinhamento Financeiro", short: "Alinhamento Financeiro", icon: "◎", description: "Organização financeira, indicadores, capital e decisões.", folderUrl: "", pillars: [
      { id: "educacao-financeira", title: "Educação financeira", description: "Fundamentos, hábitos e tomada de decisão.", icon: "▤", url: "" },
      { id: "cashflow", title: "Fluxo de caixa", description: "Entradas, saídas, previsibilidade e organização do caixa.", icon: "⇄", url: "" },
      { id: "planejamento", title: "Planejamento e metas", description: "Orçamento, metas, cenários e revisões.", icon: "◎", url: "" },
      { id: "precificacao", title: "Precificação e margem", description: "Custos, preço mínimo, margem e sustentabilidade das ofertas.", icon: "◇", url: "" },
      { id: "capital", title: "Capital e investimentos", description: "Capital, risco, liquidez e decisões de investimento.", icon: "↗", url: "" },
      { id: "patrimonio", title: "Organização patrimonial", description: "Visão de patrimônio, proteção e estruturação.", icon: "⌂", url: "" }
    ] },
    { id: "4", name: "Expansão", short: "Expansão", icon: "↗", description: "Processos, aquisição, pessoas e crescimento sustentável.", folderUrl: "", pillars: [
      { id: "processos", title: "Processos e procedimentos", description: "Fluxos, SOPs, padrões e rotinas operacionais.", icon: "▤", url: "" },
      { id: "gestao", title: "Gestão e liderança", description: "Papéis, responsabilidades, delegação e liderança.", icon: "♙", url: "" },
      { id: "canais", title: "Marketing e canais", description: "Aquisição, distribuição, conteúdo e campanhas.", icon: "↗", url: "" },
      { id: "comercial", title: "Comercial, SDR e Closers", description: "Prospecção, qualificação, vendas e fechamento.", icon: "⇢", url: "" },
      { id: "indicadores", title: "Indicadores e performance", description: "Métricas, experimentos, análise e melhoria contínua.", icon: "▥", url: "" },
      { id: "internacionalizacao", title: "Internacionalização", description: "Mercados, preparação e expansão geográfica.", icon: "◎", url: "" }
    ] },
    { id: "5", name: "Legado", short: "Legado", icon: "⌂", description: "Continuidade, patrimônio, governança e transmissão.", folderUrl: "", pillars: [
      { id: "zen-negocios", title: "Zen Negócios", description: "Consciência, contexto, estratégia, capital, risco, estrutura e continuidade.", icon: "✧", url: "" },
      { id: "governanca", title: "Governança e estrutura", description: "Governança, organização societária e mecanismos de decisão.", icon: "⌘", url: "" },
      { id: "patrimonio-legado", title: "Patrimônio e proteção", description: "Organização patrimonial, ativos e visão de longo prazo.", icon: "⌂", url: "" },
      { id: "sucessao", title: "Sucessão e continuidade", description: "Transição, sucessão, continuidade e redução de dependências.", icon: "⇢", url: "" },
      { id: "livro-metodo", title: "Livro do método", description: "Conhecimento, princípios, método e propriedade intelectual.", icon: "▤", url: "" },
      { id: "comunidade", title: "Comunidade e transmissão", description: "Comunidade, movimento, formação e transmissão do conhecimento.", icon: "◎", url: "" }
    ] }
  ]
};