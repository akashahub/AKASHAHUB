/** Áreas das cinco fases. Não cria login, não grava dossiê, não copia o roteiro. */
import { session, isMentorSession } from "./auth.js";
import { renderPhaseBriefing } from "./phase-guidance.js?v=rt40";
import { renderPhaseChecklist, bindPhaseChecklist } from "./phase-checklists.js?v=rt40";

function lista(itens) {
  return `<div class="module-list">${itens.map((texto, i) =>
    `<div class="mod-row"><div class="mod-num">${i + 1}</div><div class="mod-body"><h3>${texto}</h3></div></div>`
  ).join("")}</div>`;
}

function pagina(numero, titulo, sigla, texto, corpo) {
  return `<div class="view active">
    <p class="hero-line">Fase ${numero}${sigla ? " · " + sigla : ""}</p>
    <h2 class="hero-title">${titulo}</h2>
    <p class="hero-sub">${texto}</p>
    ${corpo}
  </div>`;
}

const FASE1 = [
  "Conduzir o processo de perguntas e conversas.",
  "Investigar identidade, história familiar e visão de mundo.",
  "Organizar o Dossiê de Essência.",
  "Identificar capacidades, valores, objetivos e possibilidades.",
  "Definir a direção inicial da marca.",
  "Estabelecer objetivos pessoais e empresariais.",
  "Fazer uma leitura inicial da situação financeira."
];

const FASE2 = [
  "Definir o posicionamento estratégico.",
  "Desenvolver a identidade de linguagem.",
  "Planejar a presença digital.",
  "Organizar a estrutura da marca e a comunicação.",
  "Definir os ativos digitais necessários.",
  "Estruturar a oferta de produtos e serviços.",
  "Organizar a arquitetura comercial do negócio.",
  "Planejar a aquisição e o relacionamento com clientes.",
  "Estruturar soluções B2B.",
  "Desenvolver soluções para empresas.",
  "Organizar as possibilidades de monetização.",
  "Planejar a integração dos ativos digitais ao ecossistema Akasha Hub."
];

const FASE3 = [
  "Sustentar o projeto por meio de decisões financeiras e comerciais.",
  "Organizar o fluxo de caixa.",
  "Acompanhar indicadores financeiros.",
  "Estruturar a precificação.",
  "Definir metas financeiras e comerciais.",
  "Revisar receitas, despesas e custos.",
  "Organizar o planejamento financeiro.",
  "Avaliar a sustentabilidade econômica das ofertas.",
  "Organizar as decisões comerciais da consolidação.",
  "Acompanhar os resultados e revisar a estratégia."
];

const FASE4 = [
  "Identificar o que depende diretamente do fundador.",
  "Organizar os processos operacionais.",
  "Estruturar responsabilidades e funções.",
  "Identificar o que pode ser padronizado.",
  "Documentar processos e procedimentos.",
  "Organizar fluxos de trabalho.",
  "Definir como a operação é acompanhada.",
  "Estruturar a distribuição de responsabilidades.",
  "Melhorar a previsibilidade operacional.",
  "Preparar a operação para crescer com mais organização."
];

const FASE5 = [
  "Estruturar a comunidade.",
  "Organizar a transmissão da metodologia.",
  "Sistematizar os princípios do ecossistema.",
  "Estruturar mecanismos de continuidade.",
  "Organizar o relacionamento de longo prazo.",
  "Criar uma estrutura para preservar e transmitir o que foi desenvolvido.",
  "Organizar a participação contínua no ecossistema.",
  "Planejar a evolução da comunidade.",
  "Estabelecer o acompanhamento da continuidade.",
  "Ligar a comunidade às outras fases."
];

const DOSSIE = [
  "História e contexto",
  "Perguntas e respostas",
  "Narrativas importantes",
  "Padrões identificados",
  "Valores e símbolos",
  "Talentos e capacidades",
  "Ideias e possibilidades",
  "Decisões tomadas",
  "Pendências",
  "Aplicações práticas"
];

export function renderFase1() {
  const nota = isMentorSession()
    ? "Modelo de trabalho do mentor. O material do mentorando ainda não é uma entrega separada. O contrato continua na gestão."
    : "Estrutura do dossiê. O preenchimento com o mentor vem depois. Nada aqui é gravado ainda.";
  return pagina(
    "1",
    "Arquitetura de Essência",
    "AE",
    "Identidade, história familiar, visão de mundo e a direção inicial do projeto. Entrega desta fase: Dossiê de Essência e Direção Estratégica.",
    `${renderPhaseBriefing("fase1")}
    <h3 class="section-h">Trabalho principal da fase</h3>
    ${lista(FASE1)}
    <h3 class="section-h">Roteiro de sessões</h3>
    <p class="notes-hint">O roteiro original continua em Sessões. A mesa ao lado segue a ordem do ano: conversa, identidade, dossiê, capacidades, marca, objetivos e a leitura de dinheiro.</p>
    <p style="display:flex;flex-wrap:wrap;gap:8px">
      <a class="tool-btn" href="/sessoes/">Abrir o roteiro em Sessões</a>
      <button class="tool-btn" type="button" data-nav="fase1-jogo">Mesa da Essência</button>
      <button class="tool-btn" type="button" data-nav="fase1-marca">Formulário de Marca / Identidade</button>
    </p>
    <h3 class="section-h">Dossiê de Essência</h3>
    <p class="notes-hint">${nota} O modelo preenchido, com relato, hipótese e decisão, fica só na gestão do mentor.</p>
    ${lista(DOSSIE)}
    ${renderPhaseChecklist("fase1")}`
  );
}

export function renderFase2() {
  const trabalho = FASE2.map((texto, i) => `
    <div class="mod-row">
      <div class="mod-num">${i + 1}</div>
      <div class="mod-body">
        <h3>${texto}</h3>
        ${i === 2 ? `
          <p>Use o laboratório para mapear o perfil do público, validar hipóteses e organizar um calendário de conteúdo conectado ao ecossistema Akasha Hub.</p>
          <p style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">
            <a class="tool-btn" href="/al/central/perfil-conteudo/" target="_blank" rel="noopener">Abrir formulário digital de Perfil do Cliente & Conteúdo</a>
            <a class="tool-btn" href="/afplataforma/interno/plano-editorial-2027.html" target="_blank" rel="noopener">Abrir calendário editorial 2027</a>
          </p>
        ` : ""}
      </div>
    </div>`).join("");
  return pagina(
    "2",
    "Império Digital",
    "ID",
    "Posicionamento, linguagem, ativos digitais e a estrutura de negócios do projeto.",
    `${renderPhaseBriefing("fase2")}
    <h3 class="section-h">Trabalho principal da fase</h3>
    <div class="module-list">${trabalho}</div>
    <section class="id-lib">
    <div class="id-ai-entry">
      <div class="id-ai-entry-copy">
        <p class="id-ai-eyebrow">Biblioteca de soluções</p>
        <h3>Sites, apps e o que a casa digital precisa</h3>
        <p>O portfólio e o laboratório de anúncios continuam. Em volta, uma página para cada solução. O resumo se copia. Quem envia ao mentor é a pessoa.</p>
      </div>
      <p style="display:flex;flex-wrap:wrap;gap:8px;margin:0">
        <a class="tool-btn" href="/afplataforma/imperio/index.html">Abrir a biblioteca</a>
        <a class="tool-btn" href="/afplataforma/imperio/portfolio-plataformas.html" target="_blank" rel="noopener">Abrir portfólio de plataformas ↗</a>
        <a class="tool-btn" href="/afplataforma/imperio/anuncios-ia.html" target="_blank" rel="noopener">Ver anúncios com IA ↗</a>
      </p>
    </div>
    <div class="id-lib-pages">
<h3 class="section-h">Sites e experiência visual</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/site-institucional.html">Site institucional</a>
<a class="tool-btn" href="/afplataforma/imperio/s/landing-page.html">Landing page</a>
<a class="tool-btn" href="/afplataforma/imperio/s/redesign-de-site.html">Redesign de site</a>
<a class="tool-btn" href="/afplataforma/imperio/s/pagina-de-captura.html">Página de captura</a>
<a class="tool-btn" href="/afplataforma/imperio/s/portfolio-visual.html">Portfólio visual</a>
</p>
<h3 class="section-h">Sites funcionais e aplicações web</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/area-de-membros.html">Área de membros</a>
<a class="tool-btn" href="/afplataforma/imperio/s/painel-do-cliente.html">Painel do cliente</a>
<a class="tool-btn" href="/afplataforma/imperio/s/aplicacao-web.html">Aplicação web sob medida</a>
<a class="tool-btn" href="/afplataforma/imperio/s/portal-com-login.html">Portal com login</a>
<a class="tool-btn" href="/afplataforma/imperio/s/ferramenta-interativa.html">Ferramenta interativa</a>
</p>
<h3 class="section-h">Agendamento e gestão de horários</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/agenda-online.html">Agenda online</a>
<a class="tool-btn" href="/afplataforma/imperio/s/lembretes-de-horario.html">Lembretes de horário</a>
<a class="tool-btn" href="/afplataforma/imperio/s/pagamento-na-reserva.html">Pagamento na reserva</a>
<a class="tool-btn" href="/afplataforma/imperio/s/agenda-de-equipe.html">Agenda de equipe</a>
<a class="tool-btn" href="/afplataforma/imperio/s/lista-de-espera.html">Lista de espera</a>
</p>
<h3 class="section-h">Comércio digital e pagamentos</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/loja.html">Loja</a>
<a class="tool-btn" href="/afplataforma/imperio/s/checkout.html">Checkout</a>
<a class="tool-btn" href="/afplataforma/imperio/s/pix-e-cartao.html">Pix e cartão</a>
<a class="tool-btn" href="/afplataforma/imperio/s/assinatura-recorrente.html">Assinatura recorrente</a>
<a class="tool-btn" href="/afplataforma/imperio/s/catalogo-de-produtos.html">Catálogo de produtos</a>
</p>
<h3 class="section-h">Publicidade e criativos com IA</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/criativos-de-anuncio.html">Criativos para anúncio</a>
<a class="tool-btn" href="/afplataforma/imperio/s/videos-de-anuncio.html">Vídeos para anúncio</a>
<a class="tool-btn" href="/afplataforma/imperio/s/campanha-no-crm.html">Campanha ligada ao CRM</a>
<a class="tool-btn" href="/afplataforma/imperio/s/teste-de-criativos.html">Teste de criativos</a>
<a class="tool-btn" href="/afplataforma/imperio/s/calendario-de-anuncios.html">Calendário de anúncios</a>
</p>
<h3 class="section-h">Vendas e CRM</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/funil-de-vendas.html">Funil de vendas</a>
<a class="tool-btn" href="/afplataforma/imperio/s/crm-de-contatos.html">CRM de contatos</a>
<a class="tool-btn" href="/afplataforma/imperio/s/acompanhamento-de-vendedores.html">Acompanhamento de vendedores</a>
<a class="tool-btn" href="/afplataforma/imperio/s/propostas.html">Propostas</a>
<a class="tool-btn" href="/afplataforma/imperio/s/pipeline.html">Pipeline</a>
</p>
<h3 class="section-h">Atendimento e relacionamento</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/whatsapp-organizado.html">WhatsApp organizado</a>
<a class="tool-btn" href="/afplataforma/imperio/s/central-de-atendimento.html">Central de atendimento</a>
<a class="tool-btn" href="/afplataforma/imperio/s/scripts-de-resposta.html">Scripts de resposta</a>
<a class="tool-btn" href="/afplataforma/imperio/s/pos-venda.html">Pós-venda</a>
<a class="tool-btn" href="/afplataforma/imperio/s/base-de-perguntas.html">Base de perguntas</a>
</p>
<h3 class="section-h">Automação e integrações</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/automacao-de-tarefas.html">Automação de tarefas</a>
<a class="tool-btn" href="/afplataforma/imperio/s/integracao-de-ferramentas.html">Integração entre ferramentas</a>
<a class="tool-btn" href="/afplataforma/imperio/s/fluxos-de-notificacao.html">Fluxos de notificação</a>
<a class="tool-btn" href="/afplataforma/imperio/s/formulario-que-vira-tarefa.html">Formulário que vira tarefa</a>
</p>
<h3 class="section-h">Gestão e inteligência empresarial</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/painel-de-indicadores.html">Painel de indicadores</a>
<a class="tool-btn" href="/afplataforma/imperio/s/relatorio-do-negocio.html">Relatório do negócio</a>
<a class="tool-btn" href="/afplataforma/imperio/s/metas.html">Metas e acompanhamento</a>
<a class="tool-btn" href="/afplataforma/imperio/s/leitura-de-numeros.html">Leitura de números</a>
</p>
<h3 class="section-h">Segurança digital e infraestrutura</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/revisao-de-acessos.html">Revisão de acessos</a>
<a class="tool-btn" href="/afplataforma/imperio/s/backup.html">Backup</a>
<a class="tool-btn" href="/afplataforma/imperio/s/vulnerabilidades.html">Vulnerabilidades</a>
<a class="tool-btn" href="/afplataforma/imperio/s/monitoramento.html">Monitoramento</a>
<a class="tool-btn" href="/afplataforma/imperio/s/continuidade.html">Continuidade</a>
</p>
<h3 class="section-h">Educação e treinamento</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/area-de-aulas.html">Área de aulas</a>
<a class="tool-btn" href="/afplataforma/imperio/s/trilhas.html">Trilhas de treinamento</a>
<a class="tool-btn" href="/afplataforma/imperio/s/certificado.html">Certificado</a>
<a class="tool-btn" href="/afplataforma/imperio/s/biblioteca-de-materiais.html">Biblioteca de materiais</a>
</p>
<h3 class="section-h">Comunidades e assinaturas</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/comunidade-fechada.html">Comunidade fechada</a>
<a class="tool-btn" href="/afplataforma/imperio/s/assinatura-de-conteudo.html">Assinatura de conteúdo</a>
<a class="tool-btn" href="/afplataforma/imperio/s/membros-recorrente.html">Área de membros recorrente</a>
<a class="tool-btn" href="/afplataforma/imperio/s/niveis-de-acesso.html">Níveis de acesso</a>
</p>
<h3 class="section-h">RH, recrutamento e seleção</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/pagina-de-vagas.html">Página de vagas</a>
<a class="tool-btn" href="/afplataforma/imperio/s/triagem.html">Triagem</a>
<a class="tool-btn" href="/afplataforma/imperio/s/banco-de-talentos.html">Banco de talentos</a>
<a class="tool-btn" href="/afplataforma/imperio/s/onboarding.html">Onboarding</a>
</p>
<h3 class="section-h">Restaurantes, bares e gastronomia</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/cardapio-digital.html">Cardápio digital</a>
<a class="tool-btn" href="/afplataforma/imperio/s/pedidos.html">Pedidos</a>
<a class="tool-btn" href="/afplataforma/imperio/s/reservas.html">Reservas</a>
<a class="tool-btn" href="/afplataforma/imperio/s/delivery.html">Delivery</a>
<a class="tool-btn" href="/afplataforma/imperio/s/fidelidade.html">Fidelidade</a>
<a class="tool-btn" href="/afplataforma/imperio/s/painel-da-casa.html">Painel da casa</a>
</p>
<h3 class="section-h">Criadores, streamers e entretenimento</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/pagina-do-criador.html">Página do criador</a>
<a class="tool-btn" href="/afplataforma/imperio/s/lives-e-replay.html">Lives e replay</a>
<a class="tool-btn" href="/afplataforma/imperio/s/loja-do-criador.html">Loja do criador</a>
<a class="tool-btn" href="/afplataforma/imperio/s/comunidade-de-fas.html">Comunidade de quem acompanha</a>
</p>
<h3 class="section-h">Eventos e experiências</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/pagina-do-evento.html">Página do evento</a>
<a class="tool-btn" href="/afplataforma/imperio/s/inscricao.html">Inscrição</a>
<a class="tool-btn" href="/afplataforma/imperio/s/credenciamento.html">Credenciamento</a>
<a class="tool-btn" href="/afplataforma/imperio/s/grade-do-evento.html">Grade do evento</a>
</p>
<h3 class="section-h">Imobiliário e gestão de propriedades</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/vitrine-de-imoveis.html">Vitrine de imóveis</a>
<a class="tool-btn" href="/afplataforma/imperio/s/ficha-do-imovel.html">Ficha do imóvel</a>
<a class="tool-btn" href="/afplataforma/imperio/s/agenda-de-visitas.html">Agenda de visitas</a>
<a class="tool-btn" href="/afplataforma/imperio/s/gestao-de-propriedades.html">Gestão de propriedades</a>
</p>
<h3 class="section-h">Logística, distribuição e operações</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/acompanhamento-de-pedido.html">Acompanhamento de pedido</a>
<a class="tool-btn" href="/afplataforma/imperio/s/rotas.html">Rotas</a>
<a class="tool-btn" href="/afplataforma/imperio/s/estoque-operacional.html">Estoque operacional</a>
<a class="tool-btn" href="/afplataforma/imperio/s/painel-de-entregas.html">Painel de entregas</a>
</p>
<h3 class="section-h">Saúde, clínicas e serviços profissionais</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/site-de-clinica.html">Site de clínica</a>
<a class="tool-btn" href="/afplataforma/imperio/s/agenda-de-consulta.html">Agenda de consulta</a>
<a class="tool-btn" href="/afplataforma/imperio/s/area-do-paciente.html">Área do paciente</a>
<a class="tool-btn" href="/afplataforma/imperio/s/ficha-de-atendimento.html">Ficha de atendimento</a>
</p>
<h3 class="section-h">SaaS, plataformas multiempresa e produtos próprios</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/plataforma-multiempresa.html">Plataforma multiempresa</a>
<a class="tool-btn" href="/afplataforma/imperio/s/painel-do-assinante.html">Painel do assinante</a>
<a class="tool-btn" href="/afplataforma/imperio/s/cobranca-do-software.html">Cobrança do software</a>
<a class="tool-btn" href="/afplataforma/imperio/s/area-do-administrador.html">Área do administrador</a>
</p>
<h3 class="section-h">Edição profissional de vídeos e pós-produção</h3>
<p class="id-lib-btns">
<a class="tool-btn" href="/afplataforma/imperio/s/edicao-de-videos.html">Edição profissional de vídeos</a>
<a class="tool-btn" href="/afplataforma/imperio/s/reels-shorts-tiktok.html">Reels, Shorts e TikTok</a>
<a class="tool-btn" href="/afplataforma/imperio/s/cortes-de-videos-longos.html">Cortes de vídeos longos e podcasts</a>
<a class="tool-btn" href="/afplataforma/imperio/s/video-institucional.html">Vídeo institucional e comercial</a>
<a class="tool-btn" href="/afplataforma/imperio/s/video-publicitario.html">Vídeo publicitário</a>
<a class="tool-btn" href="/afplataforma/imperio/s/legendas-e-titulos.html">Legendas, títulos e gráficos</a>
<a class="tool-btn" href="/afplataforma/imperio/s/motion-graphics.html">Motion graphics e animação</a>
<a class="tool-btn" href="/afplataforma/imperio/s/cor-audio-ritmo.html">Cor, áudio e ritmo</a>
<a class="tool-btn" href="/afplataforma/imperio/s/videos-para-cursos.html">Vídeos para cursos e áreas de membros</a>
<a class="tool-btn" href="/afplataforma/imperio/s/montagem-com-material-do-cliente.html">Montagem com material do cliente</a>
<a class="tool-btn" href="/afplataforma/imperio/s/adaptacao-de-formatos.html">Adaptação de formatos</a>
<a class="tool-btn" href="/afplataforma/imperio/s/pos-producao.html">Pós-produção e acabamento</a>
<a class="tool-btn" href="/afplataforma/imperio/s/lotes-de-videos.html">Lotes e produção recorrente</a>
</p>
</div>
    </section>
    ${renderPhaseChecklist("fase2")}
    <p class="notes-hint">O calendário é uma hipótese estratégica que deve ser validada com dados, capacidade de produção e resposta real do público. O ecossistema inteiro aparece ao longo do ano, mesmo quando cada conteúdo aprofunda um tema específico.</p>`
  );
}

export function bindFase2Checklist() {
  bindPhaseChecklist();
  const root = document.querySelector(".view.active");
  if (!root || root.dataset.idRevealBound === "1") return;
  root.dataset.idRevealBound = "1";
  const items = root.querySelectorAll(".module-list .mod-row, .id-ai-entry, .id-lib, .section-h, .notes-hint");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("id-scroll-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("id-scroll-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
  items.forEach((item, index) => {
    item.classList.add("id-scroll-reveal");
    item.style.setProperty("--id-reveal-delay", Math.min(index % 6, 5) * 55 + "ms");
    observer.observe(item);
  });
}
export function renderFase3() {
  const recursos = [
    ["af-dashboard", "Dashboard AF atual"],
    ["modules", "Módulos"],
    ["tools", "Ferramentas"],
    ["call", "Call"],
    ["complementar", "Complementar"],
    ["quitei", "Quitei"],
    ["criancas", "Crianças"],
    ["empresas", "Empresas"]
  ];
  return pagina(
    "3",
    "Alinhamento Financeiro",
    "AF",
    "Consolidação comercial e financeira. As ferramentas de sempre continuam aqui, sem cópia.",
    `${renderPhaseBriefing("fase3")}
    <h3 class="section-h">Trabalho principal da fase</h3>
    ${lista(FASE3)}
    <h3 class="section-h">Ferramentas e recursos do AF</h3>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${recursos.map(([id, nome]) => `<button class="tool-btn" type="button" data-nav="${id}">${nome}</button>`).join("")}
    </div>
    ${renderPhaseChecklist("fase3")}`
  );
}

export function renderFase4() {
  return pagina(
    "4",
    "Processos de Execução e Expansão",
    "",
    "A operação fica mais organizada e menos dependente do fundador em cada passo.",
    `${renderPhaseBriefing("fase4")}
    <h3 class="section-h">Trabalho principal da fase</h3>${lista(FASE4)}
    <h3 class="section-h">Ferramentas de expansão</h3>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
      <button class="tool-btn" type="button" data-nav="fase4-sdr">SDR OS</button>
      <button class="tool-btn" type="button" data-nav="fase4-treinamento">Treinamento de Vendedores</button>
      <button class="tool-btn" type="button" data-nav="fase4-closers">Closers OS</button>
    </div>
    <p class="notes-hint" style="margin-top:12px">Essas ferramentas ajudam a estruturar prospecção, treinamento do time e fechamento em call. Os dados ficam no aparelho até serem copiados ou enviados.</p>
    ${renderPhaseChecklist("fase4")}`
  );
}

export function renderFase5() {
  return pagina(
    "5",
    "COMUNIDADE, MOVIMENTO, DOUTRINA",
    "Legado",
    "Comunidade, transmissão da metodologia e o que permanece depois do ciclo.",
    `${renderPhaseBriefing("fase5")}
    <h3 class="section-h">Trabalho principal da fase</h3>${lista(FASE5)}
    ${renderPhaseChecklist("fase5")}`
  );
}

const MESA = [
  {
    id: "conversas",
    titulo: "Perguntas e conversas",
    texto: "A pergunta abre a história. A história não é um formulário.",
    perguntas: [
      "O que você já faz e alguém já pagou, mesmo sem nome de produto?",
      "Qual história você conta quando explica o seu trabalho?",
      "O que ainda não foi perguntado e precisa ser?"
    ],
    fecha: "O que a conversa revelou, em uma frase."
  },
  {
    id: "identidade",
    titulo: "Identidade, família e visão de mundo",
    texto: "Fato é o que aconteceu. Leitura é o que a pessoa concluiu. Não misture os dois.",
    perguntas: [
      "Como você se apresenta hoje, e o que disso é fato?",
      "O que você recebeu da família e decide manter? O que decide transformar?",
      "Qual visão de mundo orienta o que você quer construir? Marque o que é experiência, não prova."
    ],
    fecha: "Quem é. O que honra. O que transforma."
  },
  {
    id: "dossie",
    titulo: "Organizar o dossiê",
    texto: "O dossiê guarda a matéria. Relato, hipótese e decisão não ocupam a mesma linha.",
    perguntas: [
      "Qual história merece ficar guardada?",
      "Qual padrão apareceu, e ainda é hipótese?",
      "O que já virou decisão, e o que continua pendente?"
    ],
    fecha: "Entra no dossiê. Fica pendente."
  },
  {
    id: "capacidades",
    titulo: "Capacidades, valores e possibilidades",
    texto: "Talento, valor e ideia ainda não são produto.",
    perguntas: [
      "O que você sabe fazer e outra pessoa já reconhece?",
      "Qual valor não pode sair da marca?",
      "Qual possibilidade apareceu e ainda não é oferta?"
    ],
    fecha: "Capacidade. Valor. Possibilidade."
  },
  {
    id: "marca",
    titulo: "Direção inicial da marca",
    texto: "Outra pessoa tem que conseguir repetir. Se só você entende, ainda não é direção.",
    perguntas: [
      "Qual frase outra pessoa consegue repetir sobre o seu trabalho?",
      "Para quem isso é, em uma pessoa real? Para quem não é?",
      "Qual símbolo, palavra ou tom já pertence a esta marca?"
    ],
    fecha: "Frase. Para quem. Limite."
  },
  {
    id: "objetivos",
    titulo: "Objetivos pessoais e empresariais",
    texto: "Os dois objetivos existem. Não são a mesma frase.",
    perguntas: [
      "O que você quer para a sua vida neste ano, em uma frase?",
      "O que a obra precisa estar de pé em doze meses, em uma frase?",
      "Onde um objetivo está empurrando o outro?"
    ],
    fecha: "Pessoal. Empresarial. Onde se cruzam."
  },
  {
    id: "dinheiro",
    titulo: "Leitura inicial do dinheiro",
    texto: "Nesta fase é leitura, não plano. O plano mora no Alinhamento Financeiro.",
    perguntas: [
      "O que entra, em uma frase, sem planilha?",
      "O que vaza e você já sabe o nome?",
      "O que é essencial para o trabalho continuar, e o que é gosto?"
    ],
    fecha: "A leitura, em uma frase."
  },
  {
    id: "entrega",
    titulo: "Dossiê e direção estratégica",
    texto: "A entrega da fase é esta. Não é site. Não é funil.",
    perguntas: [
      "Qual matéria da essência o império digital está autorizado a carregar?",
      "O que espera a próxima fase?",
      "Qual é a próxima decisão, já escrita?"
    ],
    fecha: "Leva. Espera. Próxima decisão."
  }
];

function campo(id, rotulo) {
  return `<label class="field">${rotulo}<textarea data-mesa="${id}" rows="3" style="width:100%;min-height:72px;margin-top:6px;padding:10px 12px;border:1px solid rgba(201,162,75,.35);border-radius:8px;background:transparent;color:inherit;font:inherit;line-height:1.45"></textarea></label>`;
}

export function renderFase1Jogo() {
  const corpo = MESA.map((estacao, i) => `
    <article class="q-feature">
      <p class="hero-line">Estação ${i + 1} de ${MESA.length}</p>
      <h3>${estacao.titulo}</h3>
      <p>${estacao.texto}</p>
      ${estacao.perguntas.map((q, qi) => campo(estacao.id + "-" + qi, q)).join("")}
      ${campo(estacao.id + "-fecha", "Fecha assim · " + estacao.fecha)}
    </article>`).join("");
  return pagina(
    "1",
    "Mesa da Essência",
    "AE",
    "As oito estações seguem o ano do documento-mestre: conversa, identidade, dossiê, capacidades, marca, objetivos, leitura de dinheiro e a entrega. O roteiro de 26 encontros continua em Sessões.",
    `<p><button class="tool-btn" type="button" data-nav="fase1">← Fase 1</button></p>
    ${corpo}
    <div class="row" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px">
      <button class="tool-btn" type="button" id="mesaSalvar">Guardar neste aparelho</button>
      <button class="tool-btn" type="button" id="mesaCopiar">Copiar as respostas</button>
      <button class="tool-btn" type="button" id="mesaWhatsApp">Enviar para WhatsApp do mentor</button>
    </div>
    <p class="notes-hint" id="mesaAviso">As respostas ficam somente neste aparelho. O mentor não tem acesso automático a elas. Copie ou envie pelo WhatsApp quando quiser compartilhar.</p>`
  );
}

const MESA_KEY = "afMesaEssenciaV2";

export function bindFase1Jogo() {
  const root = document.getElementById("content");
  if (!root || !root.querySelector("[data-mesa]")) return;
  let salvo = {};
  try { salvo = JSON.parse(localStorage.getItem(MESA_KEY) || "{}"); } catch (e) { salvo = {}; }
  root.querySelectorAll("[data-mesa]").forEach((el) => {
    if (salvo[el.getAttribute("data-mesa")]) el.value = salvo[el.getAttribute("data-mesa")];
  });
  const ler = () => {
    const out = {};
    root.querySelectorAll("[data-mesa]").forEach((el) => { out[el.getAttribute("data-mesa")] = el.value; });
    return out;
  };
  const gerarTexto = () => {
    const dados = ler();
    return MESA.map((estacao, i) => {
      const linhas = estacao.perguntas.map((q, qi) => q + "\n" + (dados[estacao.id + "-" + qi] || "—")).join("\n\n");
      return (i + 1) + ". " + estacao.titulo + "\n" + linhas + "\n\nFecha: " + (dados[estacao.id + "-fecha"] || "—");
    }).join("\n\n");
  };
  document.getElementById("mesaSalvar")?.addEventListener("click", () => {
    localStorage.setItem(MESA_KEY, JSON.stringify(ler()));
    const aviso = document.getElementById("mesaAviso");
    if (aviso) aviso.textContent = "Guardado neste aparelho.";
  });
  document.getElementById("mesaCopiar")?.addEventListener("click", async () => {
    const texto = "Mesa da Essência\n\n" + gerarTexto();
    try { await navigator.clipboard.writeText(texto); } catch (e) {}
    const aviso = document.getElementById("mesaAviso");
    if (aviso) aviso.textContent = "Copiado. Cole no dossiê ou envie para o mentor.";
  });
  document.getElementById("mesaWhatsApp")?.addEventListener("click", () => {
    const texto = encodeURIComponent("Mesa da Essência\n\n" + gerarTexto());
    window.open(`https://wa.me/?text=${texto}`, "_blank");
  });
}

// === Formulário de Marca / Identidade ===
const MARCA_CAMPOS = [
  { id: "origem", label: "Origem da marca / projeto" },
  { id: "historia", label: "História que a marca conta" },
  { id: "tom", label: "Tom de voz e linguagem" },
  { id: "simbolos", label: "Símbolos, palavras ou elementos visuais que já pertencem" },
  { id: "paraquem", label: "Para quem é (pessoa real)" },
  { id: "paraquemnao", label: "Para quem não é" },
  { id: "frase", label: "Frase que outra pessoa consegue repetir" }
];

export function renderFase1Marca() {
  const campos = MARCA_CAMPOS.map(c => campo("marca-" + c.id, c.label)).join("");
  return pagina(
    "1",
    "Formulário de Marca / Identidade",
    "AE",
    "Estrutura específica para captar a identidade da marca ou do projeto, complementar ao dossiê pessoal.",
    `<p><button class="tool-btn" type="button" data-nav="fase1">← Fase 1</button></p>
    ${campos}
    <div class="row" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px">
      <button class="tool-btn" type="button" id="marcaSalvar">Guardar neste aparelho</button>
      <button class="tool-btn" type="button" id="marcaCopiar">Copiar as respostas</button>
      <button class="tool-btn" type="button" id="marcaWhatsApp">Enviar para WhatsApp do mentor</button>
    </div>
    <p class="notes-hint" id="marcaAviso">As respostas ficam somente neste aparelho. O mentor não tem acesso automático a elas. Copie ou envie pelo WhatsApp quando quiser compartilhar.</p>`
  );
}

const MARCA_KEY = "afMarcaIdentidadeV1";

export function bindFase1Marca() {
  const root = document.getElementById("content");
  if (!root || !root.querySelector("[data-mesa^=\"marca-\"]")) return;
  let salvo = {};
  try { salvo = JSON.parse(localStorage.getItem(MARCA_KEY) || "{}"); } catch (e) { salvo = {}; }
  root.querySelectorAll("[data-mesa^=\"marca-\"]").forEach((el) => {
    const id = el.getAttribute("data-mesa");
    if (salvo[id]) el.value = salvo[id];
  });
  const ler = () => {
    const out = {};
    root.querySelectorAll("[data-mesa^=\"marca-\"]").forEach((el) => { out[el.getAttribute("data-mesa")] = el.value; });
    return out;
  };
  const gerarTexto = () => {
    const dados = ler();
    return MARCA_CAMPOS.map(c => c.label + "\n" + (dados["marca-" + c.id] || "—")).join("\n\n");
  };
  document.getElementById("marcaSalvar")?.addEventListener("click", () => {
    localStorage.setItem(MARCA_KEY, JSON.stringify(ler()));
    const aviso = document.getElementById("marcaAviso");
    if (aviso) aviso.textContent = "Guardado neste aparelho.";
  });
  document.getElementById("marcaCopiar")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("Formulário de Marca / Identidade\n\n" + gerarTexto()); } catch (e) {}
    const aviso = document.getElementById("marcaAviso");
    if (aviso) aviso.textContent = "Copiado.";
  });
  document.getElementById("marcaWhatsApp")?.addEventListener("click", () => {
    const texto = encodeURIComponent("Formulário de Marca / Identidade\n\n" + gerarTexto());
    window.open(`https://wa.me/?text=${texto}`, "_blank");
  });
}

// Placeholders simples para Fase 4 (podem ser expandidos depois)
export function renderFase4Sdr() {
  return pagina("4", "SDR OS", "", "Estrutura de prospecção, scripts e pipeline.",
    `<p><button class="tool-btn" type="button" data-nav="fase4">← Fase 4</button></p>
     <p>Esta área está sendo estruturada. Em breve scripts adaptados, pipeline e chatbot.</p>
     <p class="notes-hint">Dados ficam no aparelho. Use Copiar ou WhatsApp para compartilhar com o mentor.</p>`);
}
export function renderFase4Treinamento() {
  return pagina("4", "Treinamento de Vendedores", "", "Módulos, scripts e materiais para o time.",
    `<p><button class="tool-btn" type="button" data-nav="fase4">← Fase 4</button></p>
     <p>Estrutura de treinamento em construção.</p>
     <p class="notes-hint">Dados ficam no aparelho. Use Copiar ou WhatsApp para compartilhar com o mentor.</p>`);
}
export function renderFase4Closers() {
  return pagina("4", "Closers OS", "", "Teleprompter, quebra de objeções e mesa de negociação.",
    `<p><button class="tool-btn" type="button" data-nav="fase4">← Fase 4</button></p>
     <p>Ferramentas de fechamento em call em construção.</p>
     <p class="notes-hint">Dados ficam no aparelho. Use Copiar ou WhatsApp para compartilhar com o mentor.</p>`);
}
