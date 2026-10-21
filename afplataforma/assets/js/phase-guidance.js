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
    assetTaxonomy: {
      definition: "Ativo é um recurso identificável que pode apoiar aquisição, entrega, operação ou continuidade. Pode ser físico ou digital; nem todo negócio precisa de todos os tipos.",
      types: ["Marca e identidade", "Conteúdo e comunicação", "Relacionamento, clientes e comunidade", "Conhecimento e metodologia", "Propriedade intelectual e direitos", "Canais e distribuição", "Produtos e ofertas", "Processos e rotinas", "Ferramentas, sistemas e tecnologia", "Estoque, equipamentos e outros ativos físicos"],
      note: "Taxonomia didática da plataforma, não declaração de categorias oficiais. Registre titularidade, permissão, acesso e localização da fonte quando isso for relevante."
    },
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
    example: "Exemplo didático sem valores: um prestador separa as vendas do período, custos e despesas, obrigações, retiradas e saldo disponível. A análise de preço só avança depois de confirmar período, fonte e premissas; faturamento, lucro e caixa não são sinônimos.",
    deliverable: "Leitura financeira atual, prioridades e um conjunto de números acompanháveis para o próximo ciclo.",
    advance: "A pessoa sabe qual número está observando, qual decisão ele informa e qual ação acontece quando o resultado muda.",
    connection: "A Fase 4 transforma prioridades financeiras e comerciais em processos, responsáveis, rotinas e revisão contínua.",
    sourceNote: "A linguagem financeira é didática; projeções devem permanecer identificadas como projeções e usar somente dados fornecidos.",
    financeGlossary: [
      { term: "Faturamento", definition: "Valor bruto das vendas ou serviços atribuídos ao período, conforme o critério contábil adotado; não é o mesmo que dinheiro recebido nem lucro." },
      { term: "Lucro", definition: "Resultado depois de considerar receitas e custos/despesas segundo o regime e os critérios usados. Não equivale ao saldo da conta." },
      { term: "Caixa", definition: "Disponibilidade e movimentação de dinheiro ao longo do tempo; recebimentos e pagamentos podem ocorrer em datas diferentes da venda ou da contratação." },
      { term: "Patrimônio", definition: "Posição de ativos e obrigações em uma data; não é faturamento nem fluxo de caixa. Use a definição contábil apropriada à situação." }
    ],
    financeContexts: [
      { label: "Serviço/profissional liberal", text: "Separe serviço contratado, valor faturado, recebimento, horas/custos de entrega e obrigações do período." },
      { label: "Comércio/produto físico", text: "Considere vendas, custo do produto, estoque, taxas, tributos, logística e momento do recebimento." },
      { label: "Produto digital/consultoria", text: "Distinga venda, parcelas/recorrência, taxas de plataforma, suporte prometido, cancelamentos e caixa recebido." },
      { label: "Empresa com equipe", text: "Separe centros de custo, folha e obrigações, capacidade operacional, resultado e datas de entrada/saída." }
    ],
    checklist: [
      { id: "situacao", action: "Registrar a situação financeira atual", explain: "Separe faturamento, lucro, caixa e patrimônio com o período de referência.", example: "Caixa disponível em 30/09; faturamento do mês; custos e despesas pagos; patrimônio não estimado.", field: "Planilha, relatório ou referência do período" },
      { id: "receitas", action: "Mapear fontes de receita e sua previsibilidade", explain: "Identifique origem, frequência, concentração e condição de recebimento.", example: "Venda avulsa, recorrência e produto digital aparecem separados, com fonte, período e condição de recebimento registrados.", field: "Mapa de receitas" },
      { id: "custos", action: "Classificar custos, despesas e obrigações", explain: "Uma lista bruta não mostra prioridade; classifique o que sustenta ou pode ser revisto.", example: "Custo direto por entrega separado de ferramenta administrativa mensal.", field: "Controle de custos e despesas" },
      { id: "preco", action: "Revisar preço, margem e rentabilidade", explain: "Preço não é só o valor anunciado; registre premissas e capacidade de entrega.", example: "Preço mínimo calculado com horas e custos diretos; a margem-alvo está identificada como hipótese e ligada à fonte dos dados.", field: "Tabela ou cálculo de preço" },
      { id: "indicadores", action: "Escolher indicadores para revisão", explain: "Acompanhe poucos números que mudam decisões, não um painel ornamental.", example: "Caixa, margem por oferta, prazo médio de recebimento e conversão de propostas registrados com período e fonte.", field: "Painel ou rotina de revisão" },
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
    activities: "Mapeamento de processos, critérios de pronto, ferramentas de acompanhamento, atendimento e revisão. SDR OS, Treinamento e Closers OS são áreas em construção nesta plataforma; sua menção não significa que os módulos estejam operacionais. Crescimento de volume não é automaticamente expansão sustentável.",
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
    title: "Legado",
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

const BUSINESS_MODEL_GUIDANCE = [
  { label: "Serviço e profissional liberal", text: "Adapte oferta, agenda, escopo, capacidade de entrega, relacionamento e recebimento; não procure estoque se ele não existe." },
  { label: "Produto físico e comércio", text: "Considere catálogo, estoque, fornecedores, logística, atendimento e pós-venda quando forem parte real da operação." },
  { label: "Produto digital e consultoria", text: "Esclareça acesso, formato, suporte, limites, propriedade intelectual e continuidade da entrega." },
  { label: "Empresa tradicional ou com equipe", text: "Torne explícitos papéis, processos, controles, dependências, qualidade e decisões compartilhadas." },
  { label: "Especialista ou negócio em validação", text: "Trate interesse, público, canal e modelo como hipótese até haver evidência; adapte o próximo passo ao estágio real." }
];

export const EXECUTIVE_GUIDANCE = [
  { id: 1, question: "O que precisa ser entendido e decidido agora?", expected: "Contexto, problema prioritário, hipótese e resultado desejado.", example: "A oferta existe, mas ninguém consegue explicar para quem é; a decisão é testar uma frase com cinco pessoas.", structure: "Contexto → problema → evidência → hipótese → decisão pendente.", avoid: "Escrever um texto institucional sem declarar o problema que a sessão precisa resolver.", criterion: "Outra pessoa consegue dizer qual decisão precisa sair da sessão?" },
  { id: 2, question: "Quais decisões viram construção?", expected: "Escolhas de posicionamento, oferta, ativo, canal ou processo que podem ser revisadas.", example: "Escolher uma página de oferta e uma conversa de triagem antes de abrir três canais novos.", structure: "Decisão → motivo → limite → primeira versão → critério de revisão.", avoid: "Listar desejos como se já fossem ativos ou decisões aprovadas.", criterion: "Existe uma escolha concreta e um critério para avaliá-la?" },
  { id: 3, question: "O que será produzido e como saberemos que está pronto?", expected: "Entregáveis, atividades, responsável, prazo e critério observável.", example: "Página publicada, testada no celular, revisada por alguém externo e ligada ao próximo passo.", structure: "Entregável → atividades → responsável → prazo → critério → dependências.", avoid: "Usar 'melhorar', 'organizar' ou 'divulgar' sem definir evidência.", criterion: "Há um arquivo, link, registro, tarefa ou marco que pode ser conferido?" },
  { id: 4, question: "O que foi executado, o que aprendemos e qual é o próximo passo?", expected: "Revisão da entrega, evidência, ajustes e continuidade. Este é um checkpoint operacional adicional, não uma substituição dos três marcos existentes.", example: "A proposta foi enviada a oito pessoas, três responderam; ajustar a promessa e repetir o teste com um público definido.", structure: "Feito → evidência → aprendizado → ajuste → responsável → próxima data.", avoid: "Confundir atividade realizada com resultado garantido ou esconder o que não foi feito.", criterion: "O próximo passo é pequeno, observável e tem dono?" }
];

export const ASSET_GUIDANCE = {
  name: { label: "Nome", what: "O que está sendo construído.", purpose: "Permite localizar o item em conversas e revisões.", example: "Página da oferta de consultoria; catálogo de uma loja; roteiro de atendimento.", how: "Use um nome curto, específico e reconhecível.", ready: "Outra pessoa identifica o ativo sem abrir vários arquivos.", where: "O nome fica nesta lista; informe o local do material final em Escopo, dependências e observações." },
  goal: { label: "Objetivo", what: "O resultado que o ativo deve apoiar, sem prometer resultado garantido.", purpose: "Conecta a produção a uma decisão, cliente ou etapa operacional.", example: "Explicar o serviço e facilitar uma conversa de triagem.", how: "Descreva a mudança observável que o material deve apoiar.", ready: "O objetivo pode ser relacionado a uma decisão, evidência ou indicador.", where: "Registre a finalidade aqui; mantenha dados de desempenho na ferramenta que já é a fonte oficial." },
  owner: { label: "Responsável", what: "Quem conduz o próximo passo e responde pelo combinado.", purpose: "Evita que a tarefa fique sem dono entre sessões.", example: "Pessoa responsável pelo negócio; equipe de marketing; mentorando com revisão do mentor.", how: "Escolha a pessoa ou função que fará a próxima ação e combine prazo na observação.", ready: "A pessoa sabe o que fazer e até quando.", where: "O responsável fica visível neste registro; tarefas detalhadas continuam no sistema de tarefas usado pela equipe." },
  status: { label: "Status", what: "A etapa real do trabalho, da ideia à entrega.", purpose: "Distingue trabalho planejado, produzido, validado e disponibilizado.", example: "Em produção; Concluído; Em validação; Validado; Entregue.", how: "Escolha o estado que corresponde à evidência atual, não ao formulário aberto.", ready: "Há uma evidência compatível com o estado selecionado.", where: "O status fica nesta lista; links ou caminhos do material final entram em Escopo, dependências e observações." },
  notes: { label: "Escopo e evidências", what: "O que será feito, o que depende de outra coisa e onde o resultado pode ser consultado.", purpose: "Ajuda a revisar o combinado e acessar a entrega sem copiar dados para cá.", example: "URL publicada; teste em celular concluído; revisão de fotos autorizadas pendente.", how: "Inclua limites do escopo, dependências, data e link/caminho com permissão adequada; não inclua senhas ou chaves.", ready: "A entrega pode ser aberta e o que falta está explícito.", where: "Registre um link, nome do arquivo ou localização do sistema original; o arquivo permanece na sua fonte autorizada." }
};

export const ASSET_TYPE_GUIDANCE = [
  { name: "Posicionamento", what: "Frase que identifica quem é atendido, qual problema é resolvido e o diferencial da solução.", purpose: "Ajuda clientes, equipe e parceiros a entenderem para quem o negócio existe.", example: "Para pequenos escritórios contábeis que perdem tempo com documentos dispersos, organizamos a rotina financeira em um processo simples acompanhado por uma pessoa responsável.", how: "Complete: 'Ajudamos [público] a [resolver problema/obter resultado] por meio de [abordagem/diferencial]'. Teste se o público se reconhece; adapte a serviços, loja ou indústria.", ready: "Público, problema e diferencial estão claros e foram revisados com alguém do público.", where: "Registre a versão aprovada em Nome/Observações e aponte o documento de marca ou oferta onde a frase será usada." },
  { name: "Oferta", what: "Descrição do produto ou serviço, de quem pode se beneficiar e do que a entrega inclui.", purpose: "Alinha expectativa, escopo, formato e condições antes da venda.", example: "Consultoria de 4 encontros para mapear o atendimento, entregar um fluxo revisado e treinar a equipe; não inclui suporte contínuo.", how: "Declare público, necessidade, resultado buscado, conteúdo, formato, limites, preço/condições quando aprovados e próximo passo.", ready: "A pessoa sabe o que recebe, o que não recebe, como acessa e quais são as condições combinadas.", where: "Mantenha a oferta final no catálogo, proposta ou página já usada pela operação; salve aqui seu link/caminho." },
  { name: "Conteúdo reutilizável", what: "Material que pode ser usado mais de uma vez para informar, educar ou apresentar o trabalho.", purpose: "Apoia comunicação e relacionamento sem depender de criar tudo de novo a cada contato.", example: "Guia de manutenção de um produto, artigo de orientação, vídeo de demonstração ou FAQ de serviço.", how: "Defina público e objetivo, use fontes autorizadas, indique responsável/revisão e escolha o canal compatível com a capacidade real.", ready: "O conteúdo é correto, acessível, autorizado e tem uma próxima ação ou propósito identificável.", where: "Acesse a peça no site, biblioteca ou sistema de conteúdo da equipe e registre aqui o link/caminho." },
  { name: "Processo operacional", what: "Sequência documentada para executar uma atividade recorrente.", purpose: "Reduz improviso e ajuda a manter qualidade e continuidade entre pessoas.", example: "Receber pedido → conferir estoque → separar item → revisar endereço → despachar → registrar código de envio.", how: "Registre gatilho, etapas, responsável, exceções, padrão de qualidade e forma de revisão; adapte a uma prestação de serviço ou operação com equipe.", ready: "Outra pessoa consegue executar uma ocorrência real e sabe onde pedir ajuda quando algo foge do padrão.", where: "Guarde o procedimento na base de conhecimento ou sistema operacional já adotado e indique o link/caminho." },
  { name: "Ativo financeiro", what: "Controle, indicador ou projeção usada para apoiar uma escolha financeira.", purpose: "Torna receitas, custos, caixa, margem ou obrigações mais legíveis para decisão.", example: "Relatório mensal de entradas e saídas; margem por linha de produto; cenário de caixa identificado como projeção.", how: "Use os registros financeiros de origem, defina período e unidade, separe fatos de projeções e não copie números para este campo.", ready: "Fonte, período, responsável e decisão que o indicador apoia estão claros; os conceitos não confundem faturamento, lucro, caixa e patrimônio.", where: "Abra a ferramenta financeira de origem e registre somente o nome do relatório ou link autorizado; não replique valores pessoais ou empresariais." },
  { name: "Documentação de metodologia", what: "Manual, mapa, roteiro ou princípios que permitem repetir uma prática com clareza.", purpose: "Preserva conhecimento e facilita formação, revisão e continuidade.", example: "Roteiro de integração de uma pessoa nova, checklist de qualidade ou mapa de etapas de atendimento.", how: "Declare objetivo e limites, descreva etapas observáveis, indique materiais de referência e registre a data/responsável por revisão.", ready: "Outra pessoa entende quando usar, como aplicar, quais limites respeitar e onde consultar a versão vigente.", where: "Mantenha a versão vigente na biblioteca oficial do projeto; registre o link/caminho e evite criar cópias concorrentes." },
  { name: "Projeto ou iniciativa", what: "Esforço com objetivo, escopo, responsável, dependências, prazo e critério de conclusão.", purpose: "Torna o trabalho coordenável e separa intenção de entrega verificável.", example: "Implantar um novo processo de onboarding, com etapas, pessoa responsável e evidência de conclusão.", how: "Descreva resultado, limites, entregáveis, responsáveis, datas acordadas, riscos e decisões pendentes; não invente prazo ou orçamento.", ready: "O escopo foi aceito, o entregável pode ser conferido e pendências/dependências têm dono.", where: "Mantenha o projeto no sistema de gestão já usado pela equipe; registre aqui apenas o link ou caminho autorizado." },
  { name: "Campanha ou ativo de marketing", what: "Conjunto coordenado de mensagens e peças para uma oferta, público e ação definidos.", purpose: "Alinha mensagem, canal, página, atendimento e forma de avaliar a resposta.", example: "Divulgação de uma oficina com página, convite, lembrete e mensagem de acompanhamento revisados.", how: "Defina objetivo, público, oferta aprovada, canais que a equipe consegue atender, CTA, responsáveis, permissões de imagem e medida de acompanhamento.", ready: "Links e peças foram revisados, o destino funciona, o atendimento sabe responder e a campanha tem responsável e critério de revisão.", where: "Acesse as peças no site, biblioteca de conteúdo ou ferramenta de campanhas vigente; guarde o link/caminho neste registro." },
  { name: "Roteiro, script ou conversa", what: "Estrutura de apoio para uma interação recorrente, sem transformar a conversa em fala automática.", purpose: "Ajuda a manter clareza, escuta, limites e registro em atendimento, vendas ou suporte.", example: "Roteiro de triagem com abertura, perguntas, critérios de encaminhamento e encerramento respeitoso.", how: "Escreva propósito e público, perguntas abertas, opções de resposta, limites, escalonamento e próxima ação; teste e revise com quem usa.", ready: "A equipe sabe adaptar a fala, registrar o resultado e encaminhar situações fora do escopo.", where: "Mantenha a versão aprovada na base de conhecimento ou sistema de atendimento e registre o link/caminho." },
  { name: "Treinamento ou trilha de formação", what: "Sequência de aprendizagem com objetivos, prática, feedback, avaliação e limites de atuação.", purpose: "Prepara pessoas para executar ou ensinar uma atividade com qualidade e segurança.", example: "Trilha de onboarding com material de referência, exercício prático, feedback e critério para atuar sem supervisão.", how: "Defina público, competências observáveis, materiais, prática acompanhada, avaliação, suporte e data de revisão.", ready: "A pessoa consegue demonstrar a prática, explicar os limites e sabe quando pedir ajuda.", where: "Use o LMS, biblioteca ou pasta oficial da equipe; registre o caminho da versão vigente e evite duplicar materiais." },
  { name: "Software ou plataforma", what: "Sistema, ferramenta configurada ou solução de software que apoia uma atividade real.", purpose: "Dá suporte a processos e acesso controlado a informações e entregas.", example: "CRM configurado com etapas de atendimento, papéis de acesso e instruções de uso.", how: "Defina requisito, responsável, permissões mínimas, fonte dos dados, integração, backup, teste e plano de suporte; não registre senhas ou chaves.", ready: "O fluxo foi testado com dados apropriados, acessos revisados, suporte definido e documentação disponível.", where: "O software permanece na plataforma autorizada; registre URL interna/caminho sem credenciais ou dados sensíveis." },
  { name: "Marca e identidade", what: "Elementos visuais e verbais que orientam reconhecimento e comunicação.", purpose: "Mantém consistência entre oferta, atendimento, conteúdo e experiência.", example: "Guia com logotipo, cores, tipografia, tom de voz, usos permitidos e exemplos de aplicação.", how: "Consolide decisões aprovadas, versões dos arquivos, acessibilidade, formatos e direitos de uso; registre o responsável pela aprovação.", ready: "A equipe encontra os arquivos corretos e consegue aplicar o guia sem distorcer a marca.", where: "Aponte a biblioteca de marca ou pasta-mestre; não espalhe cópias sem controle de versão." },
  { name: "Propriedade intelectual e permissões", what: "Registro de autoria, titularidade, licença, consentimento e limites de uso de materiais.", purpose: "Reduz risco de uso indevido e esclarece o que pode ser publicado, adaptado ou compartilhado.", example: "Imagem com licença registrada e autorização de uso arquivada junto ao ativo correspondente.", how: "Registre fonte, titular, licença/consentimento, escopo permitido, prazo e restrições; busque revisão especializada quando houver dúvida.", ready: "Permissão e atribuição estão documentadas e cobrem o canal, formato e finalidade pretendidos.", where: "Guarde a licença/autorização na fonte oficial do projeto e registre o link/caminho acessível, nunca dados de autenticação." }
];

export function renderPhaseBriefing(phaseId) {
  const phase = PHASE_GUIDANCE[phaseId];
  if (!phase) return "";
  return `<details class="phase-fold">
    <summary>Briefing da fase</summary>
    <section class="phase-briefing" aria-labelledby="briefing-${phase.id}">
    <div class="phase-briefing-lead"><p class="hero-line">BRIEFING DA FASE ${esc(phase.number)}</p><h3 id="briefing-${phase.id}">Fase ${esc(phase.number)} · ${esc(phase.title)}</h3><p class="phase-briefing-subtitle">Como usar esta etapa</p><p>${esc(phase.sourceNote)}</p><p class="phase-source-classification"><strong>Natureza do conteúdo:</strong> os materiais consultados orientam esta síntese. A lista de pontos de trabalho e os exemplos foram reescritos para a interface e não são apresentados como transcrição exaustiva ou pilares oficiais. As adaptações a seguir são sugestões; confirme a fonte específica quando uma decisão depender dela.</p></div>
    <div class="phase-briefing-grid">
      <details><summary>O que é</summary><p>${esc(phase.what)}</p></details>
      <details><summary>Por que existe</summary><p>${esc(phase.why)}</p></details>
      <details><summary>Que problema resolve</summary><p>${esc(phase.problem)}</p></details>
      <details><summary>Pontos de trabalho · síntese da plataforma</summary><p>Organização didática dos materiais disponíveis; não implica que cada item seja uma categoria oficial.</p><ul>${phase.pillars.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></details>
      <details><summary>Atividades e ferramentas</summary><p>${esc(phase.activities)}</p></details>
      <details><summary>Exemplo ilustrativo</summary><p>${esc(phase.example)}</p></details>
      <details><summary>Entregável</summary><p>${esc(phase.deliverable)}</p></details>
      <details><summary>Como reconhecer avanço</summary><p>${esc(phase.advance)}</p></details>
      <details><summary>Conexão seguinte</summary><p>${esc(phase.connection)}</p></details>
      <details><summary>Adaptação a diferentes modelos de negócio · sugestões</summary><ul>${BUSINESS_MODEL_GUIDANCE.map((item) => `<li><strong>${esc(item.label)}:</strong> ${esc(item.text)}</li>`).join("")}</ul></details>
      ${phase.assetTaxonomy ? `<details><summary>O que pode ser um ativo</summary><p>${esc(phase.assetTaxonomy.definition)}</p><p><strong>Exemplos:</strong> ${phase.assetTaxonomy.types.map(esc).join(" · ")}</p><p>${esc(phase.assetTaxonomy.note)}</p></details>` : ""}
      ${phase.financeGlossary ? `<details><summary>Termos financeiros e contextos</summary><ul>${phase.financeGlossary.map((item) => `<li><strong>${esc(item.term)}:</strong> ${esc(item.definition)}</li>`).join("")}</ul><p>Adaptações por modelo — exemplos didáticos, sem substituir registros ou orientação contábil:</p><ul>${phase.financeContexts.map((item) => `<li><strong>${esc(item.label)}:</strong> ${esc(item.text)}</li>`).join("")}</ul></details>` : ""}
    </div>
  </section>
  </details>`;
}
