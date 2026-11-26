# Mapa Mestre da Biblioteca de Prompts

**Status:** estrutura inicial implementada na AF Plataforma; criação dos prompts ainda não iniciada.  
**Princípio:** a Biblioteca não é um catálogo genérico de textos. É a camada de inteligência operacional que conecta capacidades, jornada, aplicativos, processos, bases de conhecimento, entregáveis e especialistas.

## 1. Duas dimensões que se conectam

- **Catálogo de Capacidades:** 10 departamentos e 167 capacidades do Akasha Hub. Define o que o ecossistema pode compreender, estruturar, desenvolver e coordenar.
- **Arquitetura de Legado:** cinco fases AE, ID, AF, EX e LG. Organiza a jornada do cliente e os entregáveis centrais.
- **Biblioteca de Prompts:** relaciona capacidades e fases e, em uma etapa posterior, oferecerá instruções operacionais para diagnóstico, pesquisa, estratégia, criação, execução assistida, auditoria e documentação.

A mesma capacidade pode atender mais de uma fase. A fase indica o momento de aplicação; o departamento indica a origem da competência. Nenhum dos dois vínculos é exclusivo. Vendas não são tratadas como um silo: um problema comercial pode ter origem na essência, na proposta de valor, na comunicação, nos ativos digitais, no preço, na aquisição, nos processos, na entrega ou na continuidade. A análise deve investigar o sistema antes de recomendar scripts, anúncios ou mudanças isoladas.

## 2. Departamentos e códigos

| Código | Departamento | Capacidades |
|---|---|---:|
| 0101 | Arquitetura de Essência | 16 |
| 0202 | Branding, Imagem e Comunicação | 16 |
| 0303 | Império Digital e Tecnologia | 18 |
| 0404 | Alinhamento Financeiro | 36 |
| 0505 | Marketing, Publicidade e Aquisição | 16 |
| 0606 | Comercial, Vendas e Negócios | 14 |
| 0707 | Estruturação Empresarial e Internacional | 13 |
| 0808 | Gestão, Automação e Inteligência Artificial | 13 |
| 0909 | Educação, Conhecimento e Propriedade Intelectual | 11 |
| 1010 | Expansão Patrimonial e Legado | 14 |
| | **Total** | **167** |

A fonte dos nomes e das capacidades é `afplataforma/assets/js/catalogo-capacidades-data.js`. A Biblioteca importa esse catálogo, evitando duplicar ou manter uma segunda lista divergente.

## 3. Matriz inicial departamento × fase

| Departamento | Fases relacionadas | Justificativa resumida |
|---|---|---|
| 0101 · Arquitetura de Essência | AE | Investiga identidade, trajetória, valores e direção inicial. |
| 0202 · Branding, Imagem e Comunicação | AE, ID | Traduz identidade em marca, linguagem e comunicação. |
| 0303 · Império Digital e Tecnologia | ID | Constrói produtos, ativos e infraestrutura digital. |
| 0404 · Alinhamento Financeiro | AF | Organiza capital, caixa, preço e sustentabilidade. |
| 0505 · Marketing, Publicidade e Aquisição | ID, EX | Estrutura presença, conteúdo, aquisição e distribuição. |
| 0606 · Comercial, Vendas e Negócios | AE, ID, AF, EX, LG | Vendas são sistêmicas: identidade, valor percebido, marca, ativos digitais, preço, aquisição, atendimento, operação, entrega e continuidade influenciam o resultado em toda a jornada. |
| 0707 · Estruturação Empresarial e Internacional | AF, EX, LG | Organiza negócios, mercados, parcerias e governança. |
| 0808 · Gestão, Automação e IA | ID, EX, LG | Conecta sistemas, processos, produtividade e continuidade. |
| 0909 · Educação, Conhecimento e PI | ID, LG | Transforma conhecimento em ativos, métodos e transmissão. |
| 1010 · Expansão Patrimonial e Legado | LG | Organiza patrimônio, governança e continuidade. |

Essa matriz é uma classificação inicial para navegação e planejamento. Não declara que uma capacidade só possa ser usada nessas fases. A associação deve ser revisada quando o método ou o projeto concreto exigir.

## 4. Cinco fases e seus entregáveis

### AE · Arquitetura de Essência
**Objetivo:** compreender identidade, história familiar, visão de mundo, capacidades, valores e direção inicial. Constelação e Registros Akáshicos entram como leitura reflexiva, não como prova factual.  
**Entregável central:** Dossiê de Essência e Direção Estratégica.  
**Trabalho:** conduzir conversas; investigar identidade e história; organizar o dossiê; identificar capacidades, valores e objetivos; definir direção inicial da marca; estabelecer objetivos pessoais e empresariais; fazer leitura inicial da situação financeira.  
**Apps:** Essência OS, Identity Studio, Marketing Pessoal OS, Branding Pessoal, Constelação Familiar, Registros Akáshicos, Liderança, Comunicação e Authority & Leadership OS.  
**Apoios:** Sessões, Mesa da Essência, Formulário de Marca/Identidade, Dossiê vivo, Visão 1 página e Ideação/Insights.  
**Conexão seguinte:** ID.

### ID · Império Digital
**Objetivo:** converter direção e proposta de valor em posicionamento, linguagem, ofertas, presença e ativos digitais.  
**Entregável central:** Mapa de Ativos Digitais e Arquitetura de Presença e Oferta.  
**Trabalho:** posicionamento; linguagem; presença digital; marca e comunicação; ativos necessários; oferta; arquitetura comercial; aquisição e relacionamento; soluções B2B; soluções empresariais; monetização; integração dos ativos ao ecossistema.  
**Apps:** Website Studio, App Builder, Funil Builder, CRM Inteligente, SDR OS, IA Studio, Produtos Digitais e Central de Ativos.  
**Apoios:** Construtor de oferta, Diagnóstico de ativos, Pitch de 60 segundos, Oratória, Mapa de rede e biblioteca de soluções do Império Digital.  
**Conexão seguinte:** AF.

### AF · Alinhamento Financeiro
**Objetivo:** compreender e organizar finanças pessoais e empresariais, capital, fluxo, metas e sustentabilidade.  
**Entregável central:** Diagnóstico Financeiro e Plano de Organização e Sustentabilidade.  
**Trabalho:** decisões financeiras e comerciais; fluxo de caixa; indicadores; precificação; metas; receitas, despesas e custos; planejamento; sustentabilidade das ofertas; decisões comerciais; acompanhamento e revisão.  
**Apps:** Fluxo de Caixa OS, Precificação, Indicadores Financeiros, Metas Financeiras, Planejamento Financeiro, Sustentabilidade das Ofertas, Decisões Comerciais e Acompanhamento de Resultados.  
**Apoios:** Cash-Flow, Modo Sono, Metas, Ideias/Ideation, Mapa de Rede, tarefas, Quitei e ferramentas complementares.  
**Regra:** não duplicar registros ou cálculos dos apps existentes. Faturamento, lucro, caixa e patrimônio são conceitos distintos. Projeções devem ser identificadas e usar dados fornecidos.  
**Conexão seguinte:** EX.

### EX · Expansão
**Objetivo:** organizar processos, responsabilidades, aquisição, marketing, operação e crescimento sustentável.  
**Entregável central:** Mapa Operacional, Processos Prioritários e Plano de Expansão.  
**Trabalho:** dependências do fundador; processos; responsabilidades; padronização; documentação; fluxos; acompanhamento; delegação; previsibilidade; presença; publicação semanal; orgânico e tráfego pago; avaliação do que foi efetivamente publicado.  
**Apps:** Dependências do Fundador, Processos Operacionais, Responsabilidades e Funções, Padronização, Documentação, Fluxos de Trabalho, Acompanhamento da Operação e Divulgação e Presença.  
**Apoios:** SDR OS, Treinamento, Closers OS (disponibilidade independente a validar), CRM Inteligente, Funil Builder e Acompanhamento de Resultados.  
**Regra:** não apresentar módulos em construção como completos; validar estado funcional antes de assumir escopo.  
**Conexão seguinte:** LG.

### LG · Legado
**Objetivo:** organizar transmissão da metodologia, princípios, comunidade, continuidade, patrimônio e preservação.  
**Entregável central:** Mapa de Legado e Plano de Continuidade e Transmissão.  
**Trabalho:** comunidade; transmissão da metodologia; princípios; mecanismos de continuidade; relacionamento de longo prazo; preservação; participação; evolução da comunidade; acompanhamento; conexão entre fases; funcionamento sem o fundador; leitura do negócio como comprador/vendedor; nomear comunidade, movimento e doutrina.  
**Apps:** Comunidade, Transmissão da Metodologia, Princípios do Ecossistema, Continuidade, Relacionamento de Longo Prazo, Preservação e Transmissão, Evolução da Comunidade e Legado sem o Fundador.  
**Apoios:** Declaração de Legado, Livro do Método, Zen Negócios, Akasha Trading, Legacy Vault e Mapa Patrimonial.  
**Regra:** registros históricos não são apagados ou renomeados. Atividades jurídicas, contábeis, reguladas, sucessórias e de investimento dependem de profissionais habilitados.

## 5. Identificação das capacidades

Cada capacidade recebe um identificador estável derivado do código do departamento e de sua posição no catálogo:

- `0101-C01` — primeira capacidade do departamento 0101.
- `0303-C07` — sétima capacidade do departamento 0303.
- O identificador não muda quando o título é refinado; mudanças estruturais devem preservar o ID ou registrar migração explícita.

Cada capacidade possui departamento, grupo temático, fases relacionadas, justificativa da relação e estado operacional.

## 6. Estados operacionais

Usar exatamente os quatro estados oficiais:

- **Existente:** recurso ou capacidade disponível e verificável.
- **Estruturado:** método ou procedimento documentado, sem pressupor automação.
- **Em desenvolvimento:** exige implementação, testes ou consolidação.
- **Sob demanda:** depende do escopo do projeto, parceiro ou especialista.

Na implantação inicial, as capacidades aparecem como **A classificar** até validação do mentor. Não inferir o estado a partir da existência de um prompt ou de uma página.

## 7. Estrutura futura de cada prompt

Campos previstos: ID estável; título; departamento; capacidade; fase(s) de aplicação; app relacionado; tipo; missão; quando usar; perfil/papel da IA; contexto autorizado; entradas obrigatórias; variáveis; método; restrições; template integral; resultado esperado; critérios de aceite; próxima ação; versão; autor; revisor; status editorial; visibilidade; histórico.

Tipos sugeridos: investigação, diagnóstico, pesquisa, estratégia, planejamento, criação, execução assistida, auditoria, otimização e documentação.

## 8. Governança e segurança

1. Prompts oficiais só podem ser alterados por administradores autorizados.
2. Mentor pode duplicar e personalizar sem sobrescrever o original.
3. Toda alteração oficial registra versão, autor, data e histórico.
4. A visibilidade é explícita: interno do mentor, compartilhado com grupo ou liberado a um mentorando.
5. O contexto usa somente dados autorizados e necessários do UID/projeto selecionado.
6. Nunca misturar dados de mentorandos.
7. A IA separa relato/fato, hipótese e decisão; informa lacunas e não inventa dados.
8. O mentor confirma decisões antes de gravar ou executar ações.
9. O prompt orienta; o aplicativo registra e executa sua própria função. Não duplicar ferramentas, dados, cálculos ou fluxos.
10. Não prometer execução automática. Distinguir orientação, execução técnica realizada e serviço dependente de especialista habilitado.\n11. Tratar resultados comerciais de forma sistêmica: investigar causas relacionadas às cinco fases antes de recomendar uma intervenção isolada de vendas ou aquisição.

## 9. Implementação atual da interface

A navegação existente `hub-prompts` abre o Mapa Mestre na AF Plataforma, restrito ao mentor. A tela oferece:
- visão das cinco fases e entregáveis;
- dez departamentos e contagem de capacidades;
- matriz pesquisável por capacidade, fase e departamento;
- vínculos entre departamentos e fases;
- aplicativos e ferramentas relacionados, com rotas confirmadas e itens sem rota marcada para validação;
- princípios, estados e regras de governança.

A primeira entrega é estrutural e de consulta. Ainda não cria, executa, publica, versiona ou persiste prompts. Não altera as coleções UID dos aplicativos, as regras Firestore, o login ou os dados existentes. A próxima etapa será validar a matriz e então construir os prompts por prioridade.

## 10. Geração de prompts por capacidade

A matriz agora permite gerar sob demanda um modelo-base operacional para cada capacidade, preservando ID, departamento, grupo, fases e justificativa. Cada modelo inclui variáveis editáveis, protocolo de descoberta, método de diagnóstico e estratégia, construção do entregável, validação, critérios de excelência, privacidade, limites profissionais e confirmação humana.

**Importante:** são modelos-base dinâmicos contextualizados, não 160 metodologias finais validadas individualmente. O refinamento especializado deve ocorrer por capacidade, com revisão do mentor e versionamento antes de qualquer publicação para mentorandos.
