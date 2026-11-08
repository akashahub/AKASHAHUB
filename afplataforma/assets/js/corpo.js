import { esc } from "./navigation.js?v=corpo2";
import { isMentorSession } from "./auth.js";

const AREAS = [
  {
    id: "movimento",
    number: "01",
    title: "Movimento e Treinamento",
    subtitle: "Força, mobilidade, condicionamento e movimento consciente.",
    icon: "✦",
    intro: "Ambiente para treinos com peso do corpo, halteres, máquinas, Yoga, biblioteca de exercícios, videoaulas e acompanhamento.",
    spaces: [
      ["Peso do corpo", "Calistenia, força relativa, equilíbrio, mobilidade e progressões.", "Estrutura preparada"],
      ["Halteres", "Treinos por objetivo, grupos musculares, séries, cargas e progressão.", "Ferramenta existente"],
      ["Academia e máquinas", "Exercícios guiados, execução, adaptações e acompanhamento.", "Ferramenta existente"],
      ["Biblioteca de exercícios", "Demonstrações, músculos envolvidos, técnica, erros comuns e variações.", "Espaço preparado"],
      ["Treinamento com IA", "Planos ajustados a objetivos, experiência, disponibilidade e equipamentos.", "Espaço preparado"],
      ["Yoga e movimento consciente", "Séries, mobilidade, flexibilidade, respiração e práticas guiadas.", "Ferramenta existente"],
      ["Biblioteca de exercícios", "Técnica, grupos musculares, execução e adaptações.", "Funcional"],
      ["Planejamento de treino", "Organização semanal por objetivo, disponibilidade e modalidade.", "Funcional"],
      ["Diário de treino", "Registro de séries, repetições, cargas e esforço percebido.", "Funcional"],
      ["Evolução e progressão", "Histórico de sessões, consistência e acompanhamento de cargas.", "Funcional"],
      ["Treinamento com IA", "Planejador assistido por objetivos, experiência e equipamentos.", "Planejador assistido"]
    ],
    links: [
      ["Abrir Treino existente", "comp:treino"],
      ["Abrir Yoga existente", "comp:yoga"]
    ]
  },
  {
    id: "nutricao",
    number: "02",
    title: "Nutrição e Autonomia Alimentar",
    subtitle: "Escolher, comprar, preparar, cultivar e conservar alimentos.",
    icon: "✧",
    intro: "Ambiente para alimentação natural, listas de compras, fichas nutricionais, marmitas, economia doméstica e autonomia alimentar.",
    spaces: [
      ["Alimentação essencial", "Nutrição básica, variedade, alimentos naturais e minimamente processados.", "Ferramenta existente"],
      ["Ganho de massa e emagrecimento", "Planejamento alimentar orientado a objetivos e contexto individual.", "Espaço preparado"],
      ["Listas de compras inteligentes", "Compras por objetivo, orçamento, região, estação e preferências.", "Espaço preparado"],
      ["Alimentos e propriedades", "Frutas, hortaliças, temperos, nutrientes, safra, origem e substituições.", "Espaço preparado"],
      ["Marmita Inteligente", "Cardápio, porções, preparo em lote, refrigeração e congelamento.", "Espaço preparado"],
      ["Economia alimentar", "Compras econômicas, aproveitamento integral e redução de desperdício.", "Espaço preparado"],
      ["Horta em Casa", "Mini, média e grande: cultivo, luminosidade, calendário e compostagem.", "Espaço preparado"],
      ["Conservação e armazenamento", "Geladeira, congelador, despensa, validade e segurança alimentar.", "Espaço preparado"]
    ],
    links: [["Abrir Alimentação existente", "comp:alimentacao"]]
  },
  {
    id: "consciencia",
    number: "03",
    title: "Consciência e Práticas",
    subtitle: "Meditação, atenção, Yoga contemplativa e tradições iniciáticas.",
    icon: "◉",
    intro: "Biblioteca de práticas e estudos com trilhas graduais, contexto histórico e distinção entre tradição, experiência e evidência.",
    spaces: [
      ["Meditação guiada", "Áudios, práticas silenciosas, atenção e concentração.", "Ferramenta existente"],
      ["Respiração e presença", "Práticas respiratórias, consciência corporal e foco, com orientações de segurança.", "Espaço preparado"],
      ["Visualização e realização", "Ensaio mental, definição de objetivos e ações concretas.", "Espaço preparado"],
      ["Kriya Yoga", "História, linhagens, fundamentos e práticas com orientação apropriada.", "Espaço preparado"],
      ["Tantra, Puja e Kaula", "Filosofia, contexto cultural, rituais e tradições.", "Espaço preparado"],
      ["Saúde mental e hábitos", "Autoconhecimento, regulação do estresse e recursos educativos.", "Espaço preparado"]
    ],
    links: [["Abrir Meditação existente", "comp:meditacao"], ["Abrir Yoga existente", "comp:yoga"]]
  },
  {
    id: "regeneracao",
    number: "04",
    title: "Recuperação e Regeneração",
    subtitle: "Sono, ritmo circadiano, descanso e wellness em casa.",
    icon: "☾",
    intro: "Ambiente para educação sobre sono, recuperação muscular, descanso, rotinas restaurativas e experiências de wellness doméstico.",
    spaces: [
      ["Sono e ritmo circadiano", "Luz, rotina, higiene do sono e regularidade.", "Ferramenta existente"],
      ["Melatonina e fisiologia do sono", "Produção, regulação, evidências, limites e segurança.", "Espaço preparado"],
      ["Recuperação muscular", "Descanso, mobilidade restaurativa, Yoga e organização de cargas.", "Espaço preparado"],
      ["Wellness em casa", "Ambiente de relaxamento, sauna e rotinas de recuperação.", "Espaço preparado"],
      ["Banheira de gelo", "Projeto, materiais, higiene, controle térmico e contraindicações.", "Espaço preparado"],
      ["Áudios e relaxamento", "Meditações, conteúdos motivacionais e áudio de autoria/licença verificada.", "Espaço preparado"]
    ],
    links: [["Abrir Modo Sono existente", "sono"], ["Abrir MindZone existente", "comp:mindzone"]]
  },
  {
    id: "longevidade",
    number: "05",
    title: "Longevidade e Conhecimentos Ancestrais",
    subtitle: "Tradições, civilizações, pesquisas contemporâneas e cognição.",
    icon: "∞",
    intro: "Biblioteca de estudos sobre padrões alimentares, hábitos tradicionais, envelhecimento saudável, cognição e nootrópicos.",
    spaces: [
      ["Civilizações e padrões tradicionais", "Okinawa, Mediterrâneo, Japão, Ayurveda e conhecimentos indígenas contextualizados.", "Espaço preparado"],
      ["Ciência da longevidade", "Envelhecimento, metabolismo, saúde cardiovascular, microbiota e massa muscular.", "Espaço preparado"],
      ["Cognição e nootrópicos", "Compostos, mecanismos propostos, qualidade da evidência, riscos e interações.", "Espaço preparado"],
      ["Plantas e alimentos tradicionais", "Origem, identificação, usos históricos, toxicidade e segurança.", "Espaço preparado"],
      ["Biblioteca de fontes", "Estudos, referências, data de revisão e classificação da evidência.", "Espaço preparado"]
    ],
    links: []
  }
];

function spaceSlug(value) { return String(value || "").normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function shellHead(kicker, title, subtitle) {
  return `<p class="hero-line">${esc(kicker)}</p><h2 class="hero-title">${esc(title)}</h2><p class="hero-sub">${esc(subtitle)}</p>`;
}

function areaCard(area) {
  return `<a class="corpo-area-card" href="#" data-nav="corpo:${area.id}">
    <span class="corpo-area-icon" aria-hidden="true">${area.icon}</span>
    <span class="corpo-area-number">${area.number}</span>
    <h3>${esc(area.title)}</h3>
    <p>${esc(area.subtitle)}</p>
    <span class="corpo-card-cta">Explorar ambiente →</span>
  </a>`;
}

export function renderCorpoHome() {
  return `<div class="view active corpo-view">
    <section class="corpo-hero">
      <p class="corpo-kicker">AKASHA HUB · AF PLATAFORMA</p>
      <h1>CORPO</h1>
      <p class="corpo-tagline">Vitalidade · Consciência · Performance · Longevidade</p>
      <p class="corpo-lead">Um centro integrado para desenvolver autonomia física, alimentar e mental, conectar práticas tradicionais e acompanhar a própria evolução.</p>
      <div class="corpo-hero-meta"><span>05 AMBIENTES</span><span>·</span><span>UMA JORNADA INTEGRADA</span></div>
    </section>
    <div class="corpo-section-heading"><div><span>EXPLORE</span><h2>Os cinco ambientes</h2></div><p>Estrutura criada para evoluir individualmente. Os espaços ainda não publicados permanecem preparados para receber conteúdo.</p></div>
    <div class="corpo-area-grid">${AREAS.map(areaCard).join("")}</div>
    <section class="corpo-ai-placeholder">
      <div class="corpo-ai-mark">✧</div><div><span>CAMADA TRANSVERSAL</span><h2>CORPO IA</h2><p>Espaço reservado para perfil individual, planejamento integrado, biblioteca inteligente e acompanhamento da evolução.</p></div>
      <span class="corpo-status">ESTRUTURA PREPARADA</span>
    </section>
    <p class="corpo-footnote">Os conteúdos científicos, tradicionais, hipóteses e interpretações metodológicas serão identificados separadamente. A experiência não substitui avaliação ou acompanhamento profissional.</p>
  </div>`;
}

export function renderCorpoArea(id) {
  const area = AREAS.find((item) => item.id === id);
  if (!area) return `<div class="view active corpo-view"><p class="empty">Ambiente não encontrado.</p><button class="tool-btn" data-nav="corpo">Voltar para CORPO</button></div>`;
  const spaces = area.spaces.map(([title, desc, status], index) => `
    <article class="corpo-space-card">
      <span class="corpo-space-index">${String(index + 1).padStart(2, "0")}</span>
      <div class="corpo-space-copy"><h3>${esc(title)}</h3><p>${esc(desc)}</p><button type="button" class="corpo-open-space" data-nav="corpo:${area.id}:${spaceSlug(title)}">Abrir espaço →</button></div>
      <span class="corpo-space-status">${esc(status)}</span>
    </article>`).join("");
  const links = area.links.map(([label, view]) => `<button type="button" class="tool-btn" data-nav="${esc(view)}">${esc(label)}</button>`).join("");
  return `<div class="view active corpo-view">
    <button type="button" class="corpo-back" data-nav="corpo">← CORPO</button>
    <section class="corpo-area-hero"><span>${area.number} / 05 · ${esc(area.icon)}</span><h1>${esc(area.title)}</h1><p>${esc(area.subtitle)}</p><div>${esc(area.intro)}</div></section>
    <div class="corpo-section-heading"><div><span>MAPA DO AMBIENTE</span><h2>Espaços internos</h2></div><p>Os módulos estão criados como estrutura. O desenvolvimento de conteúdo será feito por área, em etapas próprias.</p></div>
    <div class="corpo-space-list">${spaces}</div>
    ${links ? `<section class="corpo-legacy-links"><h2>Ferramentas já existentes</h2><p>Atalhos para os recursos atuais da AF. Seus identificadores, mídias e dados permanecem nos módulos originais.</p><div>${links}</div></section>` : ""}
    <p class="corpo-footnote">Conteúdo em preparação. Orientações de saúde e segurança serão revisadas antes da publicação.</p>
  </div>`;
}


export function renderCorpoSpace(areaId, slug) {
  const area = AREAS.find((item) => item.id === areaId);
  const space = area?.spaces.find(([title]) => spaceSlug(title) === slug);
  if (!area || !space) return `<div class="view active corpo-view"><p class="empty">Espaço não encontrado.</p><button class="tool-btn" data-nav="corpo">Voltar para CORPO</button></div>`;
  const [title, description, status] = space;
  const functionalSpaces = ["biblioteca-de-exercicios", "planejamento-de-treino", "diario-de-treino", "evolucao-e-progressao", "treinamento-com-ia"];
  if (area.id === "movimento" && functionalSpaces.includes(slug)) {
    return import("./corpo-treino.js?v=1").then((mod) => mod.renderCorpoTrainingSpace(slug));
  }
  return `<div class="view active corpo-view">
    <button type="button" class="corpo-back" data-nav="corpo:${area.id}">← ${esc(area.title)}</button>
    <section class="corpo-area-hero"><span>${area.number} / 05 · ESPAÇO INTERNO</span><h1>${esc(title)}</h1><p>${esc(area.title)}</p><div>${esc(description)}</div></section>
    <section class="corpo-doc-callout"><strong>${esc(status)}</strong><p>Este espaço já possui endereço e estrutura próprios. O conteúdo será desenvolvido em uma etapa individual, sem alterar as ferramentas existentes.</p></section>
    <div class="corpo-space-grid">
      <article><span>01 · CONTEÚDO</span><h2>Biblioteca e aulas</h2><p>Área reservada para textos, videoaulas, guias, protocolos educativos e materiais revisados.</p><small>Preparado para conteúdo</small></article>
      <article><span>02 · MÍDIA</span><h2>Vídeos, áudios e imagens</h2><p>Área reservada para mídia publicada pelo mentor, com autoria, fonte e identificação de licença.</p><small>Preparado para mídia</small></article>
      <article><span>03 · INTELIGÊNCIA</span><h2>Assistente e ferramentas IA</h2><p>Espaço reservado para recursos inteligentes contextualizados a este ambiente.</p><small>Integração futura</small></article>
      <article><span>04 · REFERÊNCIAS</span><h2>Fontes e materiais</h2><p>Área para referências, data de revisão, classificação da evidência e contexto tradicional quando aplicável.</p><small>Preparado para referências</small></article>
    </div>
    <p class="corpo-footnote">Nenhum conteúdo clínico ou prescrição é gerado nesta estrutura vazia. A publicação será feita após revisão específica.</p>
  </div>`;
}

export function renderCorpoMentorGuide() {
  if (!isMentorSession()) return `<div class="view active"><p class="empty">Acesso restrito ao mentor.</p></div>`;
  const phases = ["Essência", "Império Digital", "Alinhamento Financeiro", "Expansão", "Legado"];
  return `<div class="view active corpo-view">
    <button type="button" class="corpo-back" data-nav="mentor">← Gestão do mentor</button>
    ${shellHead("DOCUMENTO MESTRE · USO INTERNO", "CORPO · Arquitetura funcional", "Especificação oficial da frente independente dentro da AF Plataforma.")}
    <section class="corpo-doc-callout"><strong>Regra estrutural inegociável</strong><p>CORPO aparece abaixo das cinco fases e fora delas. As cinco fases permanecem integralmente como estão: nomes, conteúdo, rotas, ferramentas, dados, permissões e fluxos.</p></section>
    <section class="corpo-doc-section"><h2>Posicionamento</h2><p>Uma frente independente e transversal dentro de <code>/afplataforma</code>. A estrutura é criada agora; o conteúdo completo será desenvolvido e validado individualmente em ciclos posteriores.</p><p><strong>Cinco fases preservadas:</strong> ${phases.join(" · ")}.</p></section>
    <section class="corpo-doc-section"><h2>Os cinco ambientes</h2><div class="corpo-doc-list">${AREAS.map(a => `<article><span>${a.number}</span><div><h3>${esc(a.title)}</h3><p>${esc(a.intro)}</p><small>${a.spaces.length} espaços internos preparados</small></div></article>`).join("")}</div></section>
    <section class="corpo-doc-section"><h2>Integração com o que já existe</h2><ul><li>Treino: preservar coleções `maq-01..07` e `halter-01..07`, seus sete centros e os slots de mídia.</li><li>Alimentação: preservar os sete vetores existentes.</li><li>Yoga: preservar os dez slots existentes.</li><li>Meditação: preservar os sete slots de áudio.</li><li>Modo Sono e MindZone: integrar por atalhos, sem duplicar ou mover suas bases.</li><li>Manter Firebase Auth, Firestore, permissões e liberação individual existentes.</li></ul></section>
    <section class="corpo-doc-section"><h2>Metodologia e classificação</h2><p>Ciência e evidência; tradição e linhagem; modelo simbólico dos sete centros; hipóteses e perspectivas emergentes. Chakras são usados como mapa simbólico, não como estruturas anatômicas comprovadas. Física quântica não será apresentada como explicação genérica de efeitos fisiológicos.</p></section>
    <section class="corpo-doc-section"><h2>Regras de implementação</h2><ol><li>Não editar as cinco fases para encaixar CORPO.</li><li>Não apagar, sobrescrever ou migrar dados e mídias existentes sem compatibilidade verificada.</li><li>Preservar rotas antigas e permissões.</li><li>Construir páginas e espaços vazios, preparados para vídeo, áudio, imagem, IA e conteúdo.</li><li>Desenvolver e testar cada ambiente separadamente.</li><li>Executar regressão nas cinco fases, autenticação, mídia e permissões antes de publicar.</li></ol></section>
    <section class="corpo-doc-section"><h2>Ordem de trabalho</h2><p>1. Entrada e home CORPO. 2. Cinco ambientes e espaços internos. 3. Atalhos para ferramentas existentes. 4. Evolução individual de cada área. 5. Integração futura do CORPO IA.</p></section>
    <section class="corpo-doc-actions"><a class="tool-btn" href="CORPO/ARQUITETURA-MESTRE.md" target="_blank" rel="noopener">Abrir documento mestre completo (Markdown)</a><a class="tool-btn" href="https://github.com/akashahub/AKASHAHUB/blob/main/afplataforma/CORPO/ARQUITETURA-MESTRE.md" target="_blank" rel="noopener">Ver versão no GitHub</a></section>
  </div>`;
}
