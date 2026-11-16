# Projeto Abundância 2.0 — Auditoria e plano de execução

## Auditoria inicial — 10/11/2026

Repositório: akashahub/AKASHAHUB  
Branch-base: main  
Área existente: projetoabundancia/  
Arquivo principal: projetoabundancia/index.html  
SHA inicial do arquivo: 77d8b4f814627e21e66fe435136b00be1eb81400

### O que foi confirmado

- 118 itens originais.
- 14 categorias originais.
- Capas de categoria referenciadas em Cloudinary e imagens locais em projetoabundancia/img/.
- Busca, filtros de prioridade/status, preço unitário, quantidade, status, notas, subtotais, CSV e impressão.
- A meta patrimonial inicial de R$ 100.000 é calculada a partir de itens comprados na categoria Patrimônio e Investimentos.
- Persistência original exclusivamente em localStorage: abundancia_state, abundancia_monthly, abundancia_goal e abundancia_months.
- A página original não continha autenticação Firebase nem sincronização entre dispositivos.
- O rótulo "Área exclusiva do mentor" no rodapé não constituía controle efetivo de acesso.

### Cash Flow existente

A AF Plataforma já possui autenticação Firebase e grava o Cash Flow em:

afTools/{uid}/tools/cashflow

O acesso passa por getAfTool(uid, "cashflow") em afplataforma/firebase/firestore.js. O Projeto Abundância deve consultar esses dados somente em leitura; não deve editar nem duplicar os lançamentos.

Firebase existente: projeto hub-akasha, configuração compartilhada em afplataforma/firebase/firebase-config.js.

### Restrições de integridade

1. Não remover ou substituir os 118 itens, categorias, capas, imagens ou recursos originais.
2. Preservar as chaves antigas do localStorage e oferecer migração sem sobrescrever silenciosamente dados locais ou remotos.
3. Não alterar a Gestão do Mentor além do botão de acesso já definido pelo usuário.
4. Restringir a página e os dados ao e-mail autorizado yanfili.simon@gmail.com.
5. Cash Flow em modo somente leitura.
6. Alterações no Firestore devem ser aditivas e ter regras próprias.
7. Não publicar regras Firebase automaticamente sem validação do projeto correto.

## Primeira entrega — Fundação

- Adicionar autenticação Firebase ao Projeto Abundância, restrita ao e-mail autorizado e com e-mail verificado.
- Criar caminho Firestore independente projetoAbundancia/{uid}/state/main.
- Preservar o estado local original e apresentar escolha explícita quando os dados locais divergirem dos dados da nuvem.
- Preparar sincronização dos dados novos.
- Adicionar leitura do Cash Flow existente sem escrita.
- Adotar fundo claro e cards com tonalidades suaves distintas.
- Adicionar as primeiras áreas do Centro de Comando: Visão 360°, Financeiro, Money Engine, Execução, Instagram e Integrações.

## Próximas fases

1. Inventário: preços sugeridos pesquisáveis, preço real, prioridade editável, quantidades adquiridas, links, datas e orçamento por categoria.
2. Engenharia financeira: despesas recorrentes, receitas, reservas, recebimentos, custos e projeções de 3, 6 e 12 meses.
3. Money Engine: ofertas, margem, pipeline comercial, leads, reuniões, propostas, conversões e simulador conservador/realista/agressivo.
4. Social Intelligence: análise do Instagram baseada em dados fornecidos ou integração autorizada, calendário e métricas.
5. Execução: tarefas recorrentes, hábitos, metas e revisões.
6. Progresso 360°: pesos editáveis e indicadores calculados com dados verificáveis.
7. Integrações adicionais: auditar uma a uma antes de conectar.

## Pendências de publicação e validação

- Publicar as novas regras Firestore no projeto Firebase correto após revisão.
- Testar login autorizado, login não autorizado, e-mail não verificado, persistência e isolamento.
- Testar migração local/nuvem em cópia de dados.
- Testar Cash Flow com dados reais do usuário, sem modificá-los.
- Testar desktop e mobile.
- Confirmar deploy estático e ausência de regressões.

A implementação desta branch não deve ser considerada produção até essas validações.


## Implementação financeira e comercial — 10/11/2026

### Fases executadas no código principal

- Adicionados preços de referência editáveis aos 118 itens originais, com faixa baixa/alta indicativa e classificação do tipo de estimativa.
- Migração aditiva para dados locais já existentes: injeta referências ausentes sem substituir preço final, quantidade, status, prioridade, notas ou IDs.
- Restauração da nuvem mescla referências de preço do inventário local quando snapshots antigos ainda não as contêm.
- Nova aba Plano 2.0 com orçamento por categoria, recorte de prioridades, projeção de despesas para 3, 6 e 12 meses, combinações de faturamento, quantidade de vendas por oferta e metas do funil.
- Engenharia financeira ampliada com campos editáveis para moradia/contas, alimentação, transporte, saúde, ferramentas/IA, assinaturas, impostos provisionados, lazer/extras e outras despesas.
- Funil comercial com metas mensais e campos de realizado para contatos, conversas, reuniões, propostas, vendas e receita recebida.
- Cash Flow permanece consultado pela função existente getAfTool(uid, "cashflow"), no documento afTools/{uid}/tools/cashflow, sem operações de escrita.

### Orçamento de referência calculado

Valores unitários iniciais inseridos no inventário, quantidade padrão 1:

- Soma dos 118 registros, incluindo a meta de aporte patrimonial: R$ 388.470.
- Itens, serviços e experiências sem a meta patrimonial: R$ 288.470.
- Recorte Crítica + Alta, incluindo a meta patrimonial: R$ 118.990.
- Recorte Crítica + Alta sem a meta patrimonial: R$ 18.990.
- Meta patrimonial de R$ 100.000 permanece separada como objetivo de aporte, não compra.

Os preços são valores centrais de planejamento com intervalos indicativos; não são 118 cotações verificadas. Viagens, veículos, projetos personalizados e itens sem especificação têm incerteza maior. Rapés ficaram sem estimativa de compra (R$ 0) por exigir reavaliação de legalidade e riscos. A consulta médica e a revisão profissional foram orçadas como serviço de referência, não como compra de medicamento.

### Despesas-base e fôlego

Com os valores iniciais informados pelo usuário (moradia/contas R$ 2.000 e alimentação R$ 700), e as demais categorias em zero até preenchimento:

- Base mensal: R$ 2.700.
- 3 meses: R$ 8.100; mais reserva desejada de R$ 12.000 = R$ 20.100.
- 6 meses: R$ 16.200; mais reserva desejada = R$ 28.200.
- 12 meses: R$ 32.400; mais reserva desejada = R$ 44.400.

### Simulação comercial inicial

Referências de preço editáveis no Money Engine:
- Arquitetura de Legado: R$ 39.000.
- Mentoria/projeto executivo: R$ 1.000.
- Site institucional simples: R$ 1.000.
- Consultoria/diagnóstico: R$ 350.
- Sessão de alinhamento: gratuita.

Combinações ilustrativas para R$ 39.000 brutos:
- 1 contrato de Arquitetura de Legado.
- 20 sites + 19 mentorias a R$ 1.000.
- 15 sites + 15 mentorias + 26 consultorias a R$ 350 = R$ 39.100.

Funil inicial sugerido, editável: 100 contatos qualificados/mês, 20 conversas, 10 reuniões, 5 propostas e 20% de conversão proposta-venda. Isso representa 1 venda esperada por ciclo mensal se as taxas se confirmarem; ainda é hipótese, não histórico validado. O painel agora permite registrar realizado e recalibrar taxas.

### Fontes de referência para alguns grupos

- Tablets e celulares: catálogos de medianas de preço atualizados em novembro de 2026.
- Webcams e microfones: comparadores e guias de mercado.
- Ferramentas domésticas, kits de segurança e equipamento de jiu-jitsu: guias de preços nacionais.

### Validação pendente antes de considerar produção

- Verificar sintaxe e comportamento no navegador em desktop e mobile.
- Testar migração com cópia de dados reais, incluindo conflito local/nuvem.
- Testar leitura Cash Flow com o usuário autenticado.
- Confirmar regras Firestore publicadas e isolamento de acesso.
- Confirmar deploy do site público. O commit na branch main, isoladamente, não comprova publicação no hosting.
- Validar valores unitários e faixas com pesquisa específica antes de compras de alto valor.


## Akasha Growth Engine — integração do inventário de serviços

- Exportado o catálogo mestre da Gestão do Mentor como fonte compartilhada, sem duplicar os 10 departamentos, 39 grupos e 160 capacidades.
- Criado `projetoabundancia/abundancia-growth.js` com aba Growth Engine, calendário de 365 dias, rotação por serviço, cinco ângulos editoriais, funil por serviço, checklist de prontidão e prompts para programação de agentes.
- Integrado o estado do Growth Engine ao snapshot sincronizado do Projeto Abundância.
- Adicionados cinco rascunhos-base por serviço selecionado: problema, educação, processo, prova e oferta; precisam de revisão e personalização antes da publicação.
- Documentação detalhada em `projetoabundancia/GROWTH-ENGINE-365.md`, com estratégia de aquisição, rotina semanal, modelo de dados, arquitetura de seis agentes e checklists.
- Limite atual: não há CRM individual completo, conexão com Instagram/Meta Ads, publicação automática, disparo de WhatsApp/e-mail ou execução dos agentes. A interface prepara pautas, rascunhos e processos; a automação externa será uma fase separada com aprovação humana e auditoria.
- Validação de produção continua pendente: testar importação do catálogo, renderização, clipboard, sincronização, desktop/mobile e regressões no navegador.


## Programação dos agentes de IA — 10/11/2026

- Mantida a área existente dentro do Growth Engine; não foi criada uma central paralela.
- Adicionado `abundancia-agents.js` com dez prompts departamentais completos e individualizados: Essência e Posicionamento, Branding, Arquitetura Digital, Inteligência Financeira, Growth, Comercial, Expansão Empresarial, Automação e IA, Conhecimento, Patrimônio e Legado.
- Cada prompt possui missão, escopo, método, entregáveis, limites, regras de segurança, colaboração e formato de resposta.
- Interface com editor por agente, salvamento individual e cópia do prompt.
- Os seis agentes anteriores do Growth Engine foram preservados e identificados como agentes operacionais existentes.
- Os prompts são armazenados no objeto `departmentAgents` dentro de `abundancia_growth_state`; o snapshot já sincroniza o objeto `growth` com `projetoAbundancia/{uid}/state/main`.
- Inicialização aditiva: preenche somente agentes ausentes e preserva prompts já existentes. A inicialização ocorre após carregar o estado remoto; quando a nuvem está disponível, solicita sincronização.
- Cache dos módulos atualizado para a nova versão.
- Limite: cadastro e persistência de prompts não ativam automaticamente chamadas de modelo, ferramentas ou execução autônoma. Homologação de navegador e confirmação de sincronização Firestore ainda precisam ser verificadas na sessão autenticada.
