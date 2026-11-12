# Experiência do mentorando · Arquitetura de Legado na AF Plataforma

Atualizado em 12/11/2026.

## Princípio da experiência

A AF Plataforma é o ambiente de execução e acompanhamento da Arquitetura de Legado. As cinco fases são a estrutura do método; os três ciclos organizam o ritmo pedagógico; os encontros coletivos e individuais orientam a condução. A pessoa deve conseguir entender o trabalho principal, abrir a ferramenta certa, registrar respostas/decisões, salvar e compartilhar com o mentor.

Não criar uma ferramenta nova quando uma existente já cumpre a função. Não duplicar perguntas. Conectar os resultados ao dossiê/jornada da pessoa.

## Atalhos rápidos adicionados

Camada aditiva em `afplataforma/assets/js/phase-launcher.js`, carregada em `afplataforma/index.html` e conectada a `app.js`. Aparece somente para usuários autenticados dentro de `/afplataforma/`. Preserva o botão global Minhas ferramentas.

- Fase 1 · Essência
- Fase 2 · Império Digital
- Fase 3 · Alinhamento Financeiro
- Fase 4 · Expansão
- Fase 5 · Legado
- Apoio transversal (atalho geral; não é uma sexta fase)

Os modais apontam para páginas, ferramentas e rotas já existentes. O Catálogo de Capacidades permanece na Gestão do Mentor e não foi incluído nos atalhos do mentorando.

## Fase 1 · instrumentos existentes e diferença

### 1. Roteiro em Sessões — `/sessoes/`
- Página com 26 encontros da antiga trilha Arquitetura de Essência & Império.
- Cada encontro tem perguntas, mergulho, tarefas e campo de anotações.
- Respostas têm autosave após digitação (janela de 1,5 segundo) para Firestore em `mentoria_respostas/{uid}/dados/tudo`.
- O botão de WhatsApp envia o encontro atual com as respostas para o WhatsApp do mentor.
- A página não apresenta um botão explícito de copiar no fluxo inspecionado.
- Acesso exige usuário autenticado; confirmar separadamente se as regras e a Gestão do Mentor permitem leitura administrativa de todos os documentos.

### 2. Mesa da Essência — view `fase1-jogo`
- Oito estações: perguntas e conversas; identidade/família/visão de mundo; dossiê; capacidades/valores/possibilidades; marca; objetivos pessoais e empresariais; leitura inicial do dinheiro; entrega/direção estratégica.
- Três perguntas por estação, mais um campo de fechamento por estação.
- Salva no localStorage deste aparelho (`afMesaEssenciaV2`), permite copiar todas as respostas e abrir WhatsApp com o conjunto.
- É instrumento de condução e síntese de conversa; não é o roteiro de 26 encontros.

### 3. Formulário de Marca / Identidade — view `fase1-marca`
- Sete campos: origem da marca/projeto; história que conta; tom de voz/linguagem; símbolos/palavras/elementos visuais; para quem é; para quem não é; frase que outra pessoa consegue repetir.
- Salva no localStorage deste aparelho (`afMarcaIdentidadeV1`), permite copiar e enviar ao WhatsApp.
- É específico para traduzir a essência em direção de marca; não investiga toda a história pessoal/familiar.

### 4. Anamnese · Arquitetura de Essência — `/afplataforma/complementar/anamnese.html`
- Sete campos: nome; o que constrói; onde o dinheiro trava; reserva em meses; história familiar/dinheiro; o que precisa ser verdade em 90 dias; para quem o legado deve servir.
- Salva apenas no localStorage; não tem cópia/WhatsApp no código inspecionado.
- É uma triagem curta de entrada/diagnóstico, não substitui as 26 sessões nem a Mesa.

### 5. Dossiê vivo — view `fase1-dossie`
- Dez áreas com etiqueta fato/hipótese/decisão e comentário do mentor.
- Tem salvar local, copiar e gerar PDF.
- A nota da tela distingue material do mentorando e comentário/registro reservado do mentor; validar as permissões e a persistência antes de tratar como repositório oficial.

**Fluxo recomendado:** Sessões (coleta extensa, opcional antes da call) → Mesa (investigação guiada durante a conversa) → Dossiê vivo (síntese factual, hipóteses e decisões) → Formulário de Marca (tradução para identidade do projeto) → objetivos e plano de ação. A Anamnese curta pode ser usada como porta de entrada, sem repetir as 26 sessões.

## Ferramentas atuais por fase (atalhos)

### Fase 1
- Sessões (26 encontros)
- Mesa da Essência
- Formulário de Marca / Identidade
- Dossiê vivo
- Visão 1 página
- Ideação / Insights

### Fase 2
- Construtor de oferta
- Diagnóstico de ativos
- Pitch 60 segundos
- Oratória
- Mapa de rede
- Biblioteca de soluções do Império Digital

### Fase 3
- Dashboard AF
- Módulos
- Ferramentas
- Call
- Complementar
- Quitei
- Crianças
- Empresas
- Preço mínimo

### Fase 4
- Divulgação
- O que depende de mim
- Execução semanal
- SDR OS
- Treinamento de vendedores
- Closers OS

Atenção: no código de Fase 4, SDR OS, Treinamento de Vendedores e Closers OS ainda mostram conteúdo placeholder/“em construção”. O menu facilita o acesso, mas não transforma esses módulos em produtos concluídos.

### Fase 5
- Declaração de legado (ferramenta global)
- Livro do método
- Zen Negócios (laboratório complementar)

O inventário estratégico de serviços/capacidades continua na Gestão do Mentor, com acesso restrito ao mentor. Não duplicar no menu do mentorando.

## Inventário dos aplicativos do ecossistema

| Aplicativo | Situação identificada |
|---|---|
| Client Intelligence | Parcial: perfil, diagnóstico, Sessões e Dossiê existem em partes; falta um histórico único do cliente |
| Strategic Inventory | Existente: Catálogo de Capacidades na Gestão do Mentor; catálogo mestre com 10 departamentos, 39 grupos e 160 capacidades, segundo o roadmap do Growth Engine |
| Research Lab | Planejado; pesquisa e fontes aparecem como necessidade, mas não foi confirmado um app integrado completo |
| Architecture Studio | Planejado; precisa transformar diagnóstico em blueprint e plano de solução |
| Asset Factory | Parcial: biblioteca/portfólio de soluções e páginas de serviços do Império Digital; falta fluxo unificado de produção e aprovação |
| Executive OS | Parcial: Arquitetura de Legado, checklists, tarefas, sessões e notas executivas; falta centralizar responsáveis, prazos, entregas e validação |
| AI Agents Hub | Parcial: área de programação de agentes no Projeto Abundância e primeira integração do agente Gemini; teste ponta a ponta ainda não confirmado |
| Financial Intelligence | Parcial/operacional: Dashboard AF, Cash-Flow, Metas, Quitei e ferramentas financeiras; falta unificação do painel estratégico entre pessoa e empresa |
| Mentorship Academy | Parcial: Academy e central de roteiros do mentor existem; integração completa da trilha do mentorando precisa ser validada |
| Validation Center | Planejado: critérios de aceite, evidências, revisão e aprovação de entregas |
| Legacy Vault | Planejado: repositório de ativos, documentos, decisões, versões, acessos e conhecimento do cliente |

## Ferramentas novas a prospectar por trabalho principal

Não construir todas de uma vez. Primeiro validar se uma ferramenta existente já atende; depois criar somente as lacunas.

### Fase 1 · Essência
1. Mapa de capacidades e valores — consolida talentos, competências, valores, evidências e oportunidades.
2. Blueprint de direção pessoal e empresarial — transforma visão em objetivos separados, prioridades e indicadores.
3. Leitura financeira inicial — triagem de receitas, despesas, reserva e riscos; encaminha para AF sem duplicar o Cash-Flow.
4. Integração automática Sessões + Mesa + Marca + Dossiê — evitar redigitação e preservar origem de cada informação.

### Fase 2 · Império Digital
1. Posicionamento e proposta de valor.
2. Identidade verbal e guia de comunicação.
3. Diagnóstico de presença e ativos digitais.
4. Arquitetura de oferta e monetização.
5. Mapa comercial e jornada do cliente.
6. Blueprint de ecossistema digital (sites, apps, plataformas e integrações).

### Fase 3 · Alinhamento Financeiro
1. Diagnóstico financeiro consolidado pessoa/empresa.
2. Planejamento financeiro e cenários.
3. Painel de indicadores e sustentabilidade das ofertas.
4. Precificação, margem e viabilidade — aproveitar Preço mínimo e expandir sem duplicar.
5. Plano de decisões e revisão financeira periódica.

### Fase 4 · Expansão
1. Mapeador de processos e fluxos.
2. Matriz de responsabilidades e delegação.
3. Construtor de procedimentos/SOPs.
4. Planejador de aquisição (orgânico e pago).
5. Painel de experimentos, canais e resultados.
6. Integração e conclusão dos módulos SDR, treinamento e Closers.

### Fase 5 · Legado
1. Livro vivo do método e princípios.
2. Mapa de comunidade, movimento e relacionamento.
3. Plano de governança, continuidade e sucessão.
4. Avaliação de ativos e prontidão para venda/transição.
5. Legacy Vault com busca, versões, permissões, exportação e trilha de auditoria.

## Próxima frente: Legacy Vault

O Vault deve reunir o que foi produzido durante a jornada: dossiê, respostas, decisões, objetivos, documentos, marcas, ofertas, ativos digitais, entregas, contratos, fontes, responsáveis, permissões e histórico de versões. Separar:
- área do mentorando: seus materiais e entregas compartilhadas;
- área do mentor: notas privadas, hipóteses internas e avaliações;
- área compartilhada: decisões e documentos aprovados por ambos.

Requisitos fundamentais: Firestore com regras por UID/organização/papel; arquivos em Storage com permissões; registro de origem e data; busca; versionamento; exportação; consentimento e minimização de dados. Não usar localStorage como repositório oficial de dados de clientes.

## Limites da implementação dos atalhos

A camada dos menus foi gravada no branch padrão do GitHub. Isso confirma a publicação do código no repositório, não a implantação no domínio. Ainda é necessário validar no navegador, em desktop e mobile, com contas de mentor e mentorando, e confirmar o fluxo de deploy/hosting.
