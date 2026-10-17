import { esc } from "./navigation.js";

/**
 * Conteúdo orientador da jornada. Os textos distinguem o que já aparece na
 * plataforma de propostas de aplicação, para não transformar hipótese em
 * pilar oficial.
 */
export const PHASE_GUIDANCE = {
  fase1: {
    id: "fase1",
    number: "01",
    title: "Arquitetura de Essência",
    what: "Uma investigação orientada para organizar identidade, história, capacidades, valores, visão e direção antes de transformar isso em marca ou oferta.",
    why: "Existe para evitar que o negócio seja construído apenas em cima de urgência, cópia ou improviso. A essência dá critérios para escolher o que construir e o que não construir.",
    problem: "Resolve a confusão entre relato, hipótese, capacidade, ideia e decisão — confusão que costuma produzir posicionamentos genéricos e ofertas difíceis de sustentar.",
    pillars: ["Perguntas e conversas", "Identidade e história", "Dossiê de Essência", "Capacidades, valores e possibilidades", "Direção inicial da marca", "Objetivos pessoais e empresariais", "Leitura inicial do dinheiro"],
    activities: "Sessões, Mesa da Essência, Formulário de Marca / Identidade e organização do dossiê. Relato, hipótese e decisão devem permanecer distinguíveis.",
    example: "Uma profissional de alimentação registra que já é reconhecida por organizar rotinas de famílias. A frase é uma observação; transformar isso em serviço é uma decisão posterior, ainda a validar.",
    deliverable: "Dossiê de Essência e Direção Estratégica — com referências, decisões e pendências identificadas.",
    advance: "Há uma base estratégica que outra pessoa consegue ler, questionar e usar para orientar posicionamento, oferta e comunicação.",
    connection: "A Fase 2 usa essa matéria para construir posicionamento, marca, oferta, canais e ativos — sem apagar a origem.",
    sourceNote: "Baseada no conteúdo já existente da Mesa da Essência, do Dossiê e dos materiais internos. Novas interpretações são sugestões de aplicação.",
    checklist: [
      { id: "contexto", action: "Registrar o contexto e o que está sendo construído", explain: "Descreva situação, momento e projeto sem tentar resolver tudo na primeira resposta.", example: "Negócio de consultoria em operação há dois anos, com demanda irregular e oferta pouco clara.", field: "Diagnóstico, ata ou referência da conversa" },
      { id: "identidade", action: "Separar fatos, interpretações e perguntas sobre identidade", explain: "A história pode orientar, mas uma interpretação ainda precisa ser tratada como hipótese.", example: "Fato: atendeu 40 clientes. Hipótese: sua força é simplificar decisões complexas.", field: "Trecho do Dossiê de Essência" },
      { id: "capacidades", action: "Listar capacidades e valores observáveis", explain: "Talento só entra como base quando há evidência, prática ou reconhecimento real.", example: "Conduz reuniões difíceis e recebe indicações por essa habilidade.", field: "Inventário de capacidades" },
      { id: "direcao", action: "Escrever uma direção inicial para a marca", explain: "A frase deve orientar escolhas, não ser um slogan bonito sem consequência.", example: "Ajudar equipes pequenas a decidir com clareza antes de contratar mais ferramentas.", field: "Frase de direção" },
      { id: "objetivos", action: "Distinguir objetivo pessoal de objetivo do negócio", explain: "Os dois podem se relacionar, mas não são o mesmo resultado.", example: "Pessoal: reduzir viagens. Negócio: criar uma oferta entregue remotamente.", field: "Registro de objetivos" },
      { id: "entrega", action: "Fechar o que a essência leva para a Fase 2", explain: "Marque a ponte e deixe pendente o que ainda não foi decidido.", example: "A Fase 2 recebe três palavras de marca, público prioritário e limites de comunicação.", field: "Decisão de passagem" }
    ]
  },
  fase2: {
    id: "fase2",
    number: "02",
    title: "Império Digital",
    what: "A transformação da identidade em posicionamento, marca, proposta de valor, oferta, comunicação, canais e ativos utilizáveis.",
    why: "Existe para que a essência possa ser reconhecida, encontrada, comprada e entregue sem depender de explicação improvisada em cada conversa.",
    problem: "Resolve a distância entre saber fazer algo e ter uma estrutura comercial coerente com público, capacidade operacional e forma real de entrega.",
    pillars: ["Posicionamento e linguagem", "Marca e comunicação", "Público e proposta de valor", "Oferta e modelo de negócio", "Canais e relacionamento", "Ativos de conteúdo, processo e tecnologia"],
    activities: "Perfil do Cliente & Conteúdo, calendário editorial, construção de oferta, presença digital e priorização de ativos. Nem todo negócio precisa dos mesmos canais.",
    example: "Uma loja local pode priorizar catálogo, atendimento e retirada; um especialista pode priorizar uma página de oferta, prova de trabalho e agenda. Ambos podem avançar sem copiar o mesmo funil.",
    deliverable: "Mapa de marca, oferta e negócio, acompanhado dos ativos prioritários e de suas referências.",
    advance: "O público entende para quem a oferta é, qual problema aborda, como a entrega acontece e qual próximo passo faz sentido.",
    connection: "A Fase 3 testa se a estrutura escolhida é financeiramente viável e quais números devem orientar decisões.",
    sourceNote: "Preserva o checklist visual de ativos que já existia e o amplia com explicação, exemplo, referência e estado.",
    checklist: [
      { id: "identidade", action: "Consolidar a identidade visual e verbal necessária", explain: "Registre o que foi definido e onde está a referência utilizável.", example: "Guia curto com cores, tom, palavras permitidas e palavras a evitar.", field: "Link ou arquivo da identidade" },
      { id: "presenca", action: "Escolher a presença digital compatível com a capacidade", explain: "Escolha canais que o negócio consiga manter; não marque presença genérica como concluída.", example: "Página principal e WhatsApp comercial revisados; rede social secundária fica em espera.", field: "URLs e decisão de canal" },
      { id: "oferta", action: "Descrever a oferta e sua forma de entrega", explain: "Deixe claro o que é vendido, para quem, resultado buscado, formato e condições relevantes.", example: "Diagnóstico de 90 minutos para pequenos comércios, com mapa e uma ação de 7 dias.", field: "Página, proposta ou documento da oferta" },
      { id: "conteudo", action: "Registrar um ativo de conteúdo reutilizável", explain: "O conteúdo deve educar, comunicar ou ajudar aquisição; não é apenas uma ideia de post.", example: "Checklist público que prepara o cliente para uma conversa de diagnóstico.", field: "Link ou arquivo do ativo" },
      { id: "operacao", action: "Definir a arquitetura comercial mínima", explain: "Conecte oferta, aquisição, atendimento e entrega ao que o time consegue executar.", example: "Indicação → conversa de triagem → proposta → entrega → pedido de referência.", field: "Mapa do fluxo" },
      { id: "primeiro-ativo", action: "Entregar e revisar o primeiro ativo prioritário", explain: "Iniciado não é concluído: revise uso, acesso, clareza e próximo responsável.", example: "Landing publicada, testada no celular e revisada por uma pessoa que não participou da criação.", field: "URL, arquivo, tarefa ou marco" }
    ]
  },
  fase3: {
    id: "fase3",
    number: "03",
    title: "Alinhamento Financeiro",
    what: "A dimensão que organiza dinheiro, receitas, custos, despesas, caixa, preço, margem, metas, reservas, investimentos e priorização.",
    why: "Existe para que decisões de marca, oferta e operação possam ser comparadas com a realidade financeira, sem confundir faturamento, lucro, caixa e patrimônio.",
    problem: "Resolve decisões tomadas por sensação, falta de visibilidade sobre vazamentos e escolhas de preço ou investimento sem relação com capacidade e margem.",
    pillars: ["Organização financeira", "Receitas, custos e despesas", "Fluxo de caixa", "Preço, margem e rentabilidade", "Metas e indicadores", "Reservas, obrigações e investimentos", "Prioridade comercial"],
    activities: "Cash-flow, precificação, metas, revisão de receitas e despesas, indicadores e as ferramentas dos sete módulos. A leitura pode ser pessoal, empresarial ou separada em duas camadas.",
    example: "Um prestador fatura R$ 20 mil no mês, mas identifica R$ 14 mil de custos e despesas, R$ 3 mil de impostos e R$ 2 mil de retiradas. Faturamento, lucro e caixa não são tratados como sinônimos.",
    deliverable: "Leitura financeira atual, prioridades e um conjunto de números acompanháveis para o próximo ciclo.",
    advance: "A pessoa sabe qual número está observando, qual decisão ele informa e qual ação acontece quando o resultado muda.",
    connection: "A Fase 4 transforma prioridades financeiras e comerciais em processos, responsáveis, rotinas e revisão contínua.",
    sourceNote: "A linguagem financeira é didática; projeções devem permanecer identificadas como projeções e usar somente dados fornecidos.",
    checklist: [
      { id: "situacao", action: "Registrar a situação financeira atual", explain: "Separe faturamento, lucro, caixa e patrimônio com o período de referência.", example: "Caixa disponível em 30/09; faturamento do mês; custos e despesas pagos; patrimônio não estimado.", field: "Planilha, relatório ou referência do período" },
      { id: "receitas", action: "Mapear fontes de receita e sua previsibilidade", explain: "Identifique origem, frequência, concentração e condição de recebimento.", example: "60% de projetos avulsos, 30% de recorrência, 10% de produtos digitais.", field: "Mapa de receitas" },
      { id: "custos", action: "Classificar custos, despesas e obrigações", explain: "Uma lista bruta não mostra prioridade; classifique o que sustenta ou pode ser revisto.", example: "Custo direto por entrega separado de ferramenta administrativa mensal.", field: "Controle de custos e despesas" },
      { id: "preco", action: "Revisar preço, margem e rentabilidade", explain: "Preço não é só o valor anunciado; registre premissas e capacidade de entrega.", example: "Preço mínimo calculado com horas, custos diretos e margem-alvo identificada como hipótese.", field: "Tabela ou cálculo de preço" },
      { id: "indicadores", action: "Escolher indicadores para revisão", explain: "Acompanhe poucos números que mudam decisões, não um painel ornamental.", example: "Caixa, margem por oferta, prazo médio de recebimento e conversão de propostas.", field: "Painel ou rotina de revisão" },
      { id: "prioridade", action: "Definir uma prioridade financeira para o ciclo", explain: "Transforme o número mais importante em ação, responsável e prazo.", example: "Reduzir o prazo de recebimento de 35 para 20 dias sem prometer um resultado garantido.", field: "Plano de ação e revisão" }
    ]
  },
  fase4: {
    id: "fase4",
    number: "04",
    title: "Processos de Execução e Expansão",
    what: "A passagem de decisões para ações recorrentes, entregas observáveis, responsabilidades, padrões de qualidade e indicadores.",
    why: "Existe para reduzir dependência de improviso e permitir crescimento compatível com capacidade, caixa, pessoas e qualidade.",
    problem: "Resolve tarefas sem dono, processos que só o fundador conhece e expansão que aumenta volume antes de aumentar previsibilidade.",
    pillars: ["Prioridades e rotinas", "Responsabilidades e delegação", "Processos e padrões", "Aquisição e atendimento", "Indicadores operacionais", "Melhoria contínua e expansão sustentável"],
    activities: "Mapeamento de processos, critérios de pronto, ferramentas de acompanhamento, SDR, treinamento, closers, atendimento e revisão. Crescimento de volume não é automaticamente expansão sustentável.",
    example: "Uma clínica documenta triagem, confirmação, atendimento e pós-atendimento; cada etapa tem responsável, prazo e critério de qualidade antes de contratar mais aquisição.",
    deliverable: "Plano executável com responsáveis, prazos, critérios de qualidade, indicadores e dependências.",
    advance: "Outra pessoa consegue executar uma parte do processo com menos perguntas e a liderança consegue enxergar onde a operação precisa de ajuste.",
    connection: "A Fase 5 documenta princípios, conhecimento e formas de continuidade para que a obra não dependa exclusivamente da atuação diária do fundador.",
    sourceNote: "Os módulos SDR, Treinamento e Closers continuam áreas específicas; o checklist orienta o avanço sem fingir que esses módulos já estão completos.",
    checklist: [
      { id: "prioridades", action: "Escolher prioridades operacionais do ciclo", explain: "Conecte a prioridade a um resultado observável e a uma capacidade real.", example: "Reduzir retrabalho na entrega de propostas antes de abrir um novo canal.", field: "Plano semanal ou roadmap" },
      { id: "processo", action: "Documentar um processo recorrente", explain: "Descreva gatilho, etapas, responsável, entrada, saída e exceções conhecidas.", example: "Receber lead → triagem → proposta → follow-up → encerramento ou venda.", field: "Roteiro, mapa ou procedimento" },
      { id: "qualidade", action: "Definir critério de qualidade e pronto", explain: "Sem critério, concluído vira apenas sensação de esforço.", example: "Proposta revisada, escopo aprovado, prazo e condição registrados antes do envio.", field: "Checklist de qualidade" },
      { id: "responsavel", action: "Nomear responsável e prazo", explain: "Delegar é transferir responsabilidade com contexto, limite e acompanhamento.", example: "Pessoa responsável por confirmar agenda até 16h; escalonamento definido.", field: "Tarefa, quadro ou ata" },
      { id: "indicadores", action: "Acompanhar indicadores de execução", explain: "Registre frequência e decisão associada a cada indicador.", example: "Tempo de ciclo e taxa de retrabalho revisados toda sexta-feira.", field: "Painel ou ritual de revisão" },
      { id: "expansao", action: "Validar se a expansão é sustentável", explain: "Compare demanda com caixa, capacidade, qualidade e dependências antes de aumentar volume.", example: "Só adicionar campanha após comprovar que a entrega comporta mais três clientes.", field: "Decisão de expansão" }
    ]
  },
  fase5: {
    id: "fase5",
    number: "05",
    title: "COMUNIDADE, MOVIMENTO, DOUTRINA",
    what: "A consolidação do que foi construído em identidade compartilhada, cultura, conhecimento, comunidade, movimento e continuidade.",
    why: "Existe para que o valor continue circulando, seja documentado e possa formar pessoas sem depender exclusivamente do fundador.",
    problem: "Resolve a perda de conhecimento, a cultura que fica apenas na cabeça de uma pessoa e a confusão entre comunidade, movimento e doutrina.",
    pillars: ["Comunidade: pessoas conectadas por interesses, valores ou objetivos", "Movimento: participação ativa em uma visão ou causa compartilhada", "Doutrina: princípios, ideias e práticas organizados", "Documentação e formação", "Continuidade e preservação cultural"],
    activities: "Declaração de Legado, documentação de metodologia, formação de pessoas, rituais de revisão, relacionamento e critérios de continuidade. Doutrina aqui não exige conotação religiosa nem adesão ideológica.",
    example: "Uma escola documenta princípios de ensino, forma novos facilitadores, registra decisões da comunidade e mantém espaço de participação sem depender de uma única fala do fundador.",
    deliverable: "Legado documentado, com princípios, conhecimento, responsabilidades, formas de participação e próximo ciclo.",
    advance: "Outra pessoa consegue explicar, aplicar e revisar parte da metodologia sem transformar a cultura em cópia cega ou em promessa garantida.",
    connection: "O resultado volta ao ciclo: a continuidade preserva a essência, aprende com a operação e orienta novos ativos e decisões.",
    sourceNote: "A apresentação usa a nomenclatura solicitada. Registros históricos não são renomeados nem apagados; a mudança é de experiência e rótulo atual.",
    checklist: [
      { id: "principios", action: "Registrar princípios e limites da metodologia", explain: "Diferencie princípio, exemplo, prática e hipótese; não transforme metáfora em prova científica.", example: "Princípio de revisar decisões com evidência; exemplo de ritual semanal; hipótese ainda aberta.", field: "Documento de princípios" },
      { id: "conhecimento", action: "Organizar conhecimento reutilizável", explain: "Crie manual, mapa, roteiro ou referência que alguém consiga consultar.", example: "Manual de onboarding com contexto, prática observável e critério de qualidade.", field: "Manual, mapa ou biblioteca" },
      { id: "formacao", action: "Definir como pessoas são formadas", explain: "Formação inclui prática, acompanhamento, feedback e limites de atuação.", example: "Facilitador observa duas sessões, conduz uma parte e recebe revisão registrada.", field: "Trilha de formação" },
      { id: "comunidade", action: "Descrever a comunidade e sua participação", explain: "Nomeie quem se conecta, por que participa e quais espaços existem.", example: "Clientes e ex-clientes trocam práticas mensais com regras de convivência claras.", field: "Mapa de relacionamento" },
      { id: "continuidade", action: "Definir responsabilidades e continuidade", explain: "Registre o que precisa continuar, quem cuida e como a revisão acontece.", example: "A biblioteca é revisada trimestralmente por uma pessoa responsável e uma pessoa da comunidade.", field: "Plano de continuidade" },
      { id: "legado", action: "Fechar a declaração de Legado e o próximo ciclo", explain: "O legado é demonstrado por documentação, prática e continuidade, não por uma frase isolada.", example: "Declaração ligada a três ativos publicados e a uma revisão marcada para o próximo trimestre.", field: "Declaração, evidências e próximo ciclo" }
    ]
  }
};

export const EXECUTIVE_GUIDANCE = [
  { id: 1, question: "O que precisa ser entendido e decidido agora?", expected: "Contexto, problema prioritário, hipótese e resultado desejado.", example: "A oferta existe, mas ninguém consegue explicar para quem é; a decisão é testar uma frase com cinco pessoas.", structure: "Contexto → problema → evidência → hipótese → decisão pendente.", avoid: "Escrever um texto institucional sem declarar o problema que a sessão precisa resolver.", criterion: "Outra pessoa consegue dizer qual decisão precisa sair da sessão?" },
  { id: 2, question: "Quais decisões viram construção?", expected: "Escolhas de posicionamento, oferta, ativo, canal ou processo que podem ser revisadas.", example: "Escolher uma página de oferta e uma conversa de triagem antes de abrir três canais novos.", structure: "Decisão → motivo → limite → primeira versão → critério de revisão.", avoid: "Listar desejos como se já fossem ativos ou decisões aprovadas.", criterion: "Existe uma escolha concreta e um critério para avaliá-la?" },
  { id: 3, question: "O que será produzido e como saberemos que está pronto?", expected: "Entregáveis, atividades, responsável, prazo e critério observável.", example: "Página publicada, testada no celular, revisada por alguém externo e ligada ao próximo passo.", structure: "Entregável → atividades → responsável → prazo → critério → dependências.", avoid: "Usar 'melhorar', 'organizar' ou 'divulgar' sem definir evidência.", criterion: "Há um arquivo, link, registro, tarefa ou marco que pode ser conferido?" },
  { id: 4, question: "O que foi executado, o que aprendemos e qual é o próximo passo?", expected: "Revisão da entrega, evidência, ajustes e continuidade. Este é um checkpoint operacional adicional, não uma substituição dos três marcos existentes.", example: "A proposta foi enviada a oito pessoas, três responderam; ajustar a promessa e repetir o teste com um público definido.", structure: "Feito → evidência → aprendizado → ajuste → responsável → próxima data.", avoid: "Confundir atividade realizada com resultado garantido ou esconder o que não foi feito.", criterion: "O próximo passo é pequeno, observável e tem dono?" }
];

export const ASSET_GUIDANCE = {
  name: { label: "Nome", what: "Identificador curto do ativo ou entregável.", example: "Página de oferta do diagnóstico", ready: "Outra pessoa reconhece o material sem precisar abrir todos os arquivos." },
  goal: { label: "Objetivo", what: "Resultado que o ativo deve apoiar, não uma promessa garantida.", example: "Explicar a oferta e levar a uma conversa de triagem", ready: "O objetivo pode ser relacionado a uma decisão ou indicador." },
  owner: { label: "Responsável", what: "Pessoa que conduz o próximo passo e responde pelo combinado.", example: "Mentorado, com revisão do mentor", ready: "O responsável sabe o que precisa fazer e até quando." },
  status: { label: "Status", what: "Estado real do trabalho: ideia, desenvolvimento, conclusão, validação ou publicação.", example: "Em validação", ready: "O estado corresponde a uma evidência, não apenas a um formulário aberto." },
  notes: { label: "Escopo e evidências", what: "Registre escopo, dependências, link, arquivo, tarefa, marco e observações.", example: "URL publicada; revisão no celular pendente; dependência: fotos autorizadas", ready: "O registro aponta onde acessar o resultado e o que ainda falta." }
};

export function renderPhaseBriefing(phaseId) {
  const phase = PHASE_GUIDANCE[phaseId];
  if (!phase) return "";
  return `<section class="phase-briefing" aria-labelledby="briefing-${phase.id}">
    <div class="phase-briefing-lead"><p class="hero-line">BRIEFING DA FASE ${esc(phase.number)}</p><h3 id="briefing-${phase.id}">Como usar esta etapa</h3><p>${esc(phase.sourceNote)}</p></div>
    <div class="phase-briefing-grid">
      <details open><summary>O que é</summary><p>${esc(phase.what)}</p></details>
      <details><summary>Por que existe</summary><p>${esc(phase.why)}</p></details>
      <details><summary>Que problema resolve</summary><p>${esc(phase.problem)}</p></details>
      <details><summary>Pilares observados</summary><ul>${phase.pillars.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></details>
      <details><summary>Atividades e ferramentas</summary><p>${esc(phase.activities)}</p></details>
      <details><summary>Exemplo concreto</summary><p>${esc(phase.example)}</p></details>
      <details><summary>Entregável</summary><p>${esc(phase.deliverable)}</p></details>
      <details><summary>Como reconhecer avanço</summary><p>${esc(phase.advance)}</p></details>
      <details><summary>Conexão seguinte</summary><p>${esc(phase.connection)}</p></details>
    </div>
  </section>`;
}
