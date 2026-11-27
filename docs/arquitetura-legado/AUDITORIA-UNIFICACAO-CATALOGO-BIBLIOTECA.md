# Auditoria e unificação — Catálogo de Capacidades + Biblioteca de Prompts

**Branch:** `feat/unificacao-catalogo-biblioteca-fases`  
**Data:** 26/11/2026  
**Status:** implementação em revisão; não publicar antes dos testes de integração.

## 1. Resultado da conciliação

- Catálogo anterior: **160 capacidades**, em 10 departamentos e 39 grupos.
- Receitas especializadas preservadas: **70**, em 7 categorias.
- Novas capacidades identificadas e adicionadas: **7**.
- Catálogo unificado após a inclusão: **167 capacidades**.
- Receitas especializadas vinculadas a IDs oficiais: **70 de 70**.
- Referências a IDs inexistentes: **0** na validação estática.
- IDs antigos: preservados; as novas capacidades foram acrescentadas ao final dos grupos existentes.

## 2. Novas capacidades incorporadas

| Novo ID | Departamento | Capacidade | Fase(s) |
|---|---|---|---|
| 0404-C32 | Alinhamento Financeiro | Análise técnica de gráficos, tendências e indicadores de mercado | AF |
| 0404-C33 | Alinhamento Financeiro | Pesquisa de mercados criptoativos e análise de dados públicos de exchanges | AF |
| 0404-C34 | Alinhamento Financeiro | Gestão de risco por operação, exposição e dimensionamento de posição em trading | AF |
| 0404-C35 | Alinhamento Financeiro | Backtesting de estratégias de trading, custos e métricas históricas | AF |
| 0404-C36 | Alinhamento Financeiro | Análise de diário de operações, disciplina e desempenho em trading | AF |
| 0505-C16 | Marketing, Publicidade e Aquisição | Monitoramento de tendências, sinais emergentes e oportunidades de mercado | ID, EX |
| 0707-C13 | Estruturação Empresarial e Internacional | Pesquisa comparativa de requisitos jurídicos, tributários, trabalhistas e regulatórios internacionais para validação por especialistas locais | LG |

**Limites:** as novas capacidades de trading são educacionais/analíticas; não executam ordens nem prometem rentabilidade. A pesquisa jurídico-tributária internacional organiza questões e fontes para revisão; não substitui parecer de advogado, contador ou especialista habilitado na jurisdição.

## 3. Regra de conciliação

Uma receita especializada é um método/instrução operacional, não uma capacidade automaticamente nova. Por isso:

1. Cada receita aponta para uma ou mais capacidades existentes por meio de `capabilityIds`.
2. Só foi criada nova capacidade quando a missão descreve uma competência/entrega específica que não estava suficientemente representada no catálogo.
3. Ferramentas específicas (por exemplo, Binance e TradingView) continuam sendo contextos de uso dos prompts, não capacidades duplicadas.
4. Uma capacidade pode ser usada em mais de uma fase; o departamento continua identificando sua origem e a fase indica onde se aplica.
5. As fases e códigos ficam na fonte compartilhada `catalogo-capacidades-data.js`; a Biblioteca importa a mesma taxonomia.

## 4. Distribuição das 70 receitas por fase principal

| Fase | Receitas |
|---|---:|
| AE · Arquitetura de Essência | 8 |
| ID · Império Digital | 33 |
| AF · Alinhamento Financeiro | 17 |
| EX · Expansão | 10 |
| LG · Legado | 2 |
| **Total** | **70** |

## 5. Matriz completa — receita especializada → capacidade(s)

| ID da receita | Receita | Fase principal | Capacidade(s) oficiais relacionadas |
|---|---|---|---|
| IMG-01 | Photo Enhancement Pro | ID · Império Digital | 0202-C08 |
| IMG-02 | Restauração Fotográfica Realista | ID · Império Digital | 0202-C08 |
| IMG-03 | Preservação de Identidade Facial | ID · Império Digital | 0202-C05, 0202-C08 |
| IMG-04 | Retrato Executivo Premium | ID · Império Digital | 0202-C05, 0101-C07 |
| IMG-05 | Image Creator Studio | ID · Império Digital | 0202-C09 |
| IMG-06 | Character Creator | ID · Império Digital | 0202-C09 |
| IMG-07 | Consistent Character Studio | ID · Império Digital | 0202-C09 |
| IMG-08 | Product Photography Studio | ID · Império Digital | 0202-C06 |
| IMG-09 | AI Campaign Creator | ID · Império Digital | 0202-C03, 0505-C08 |
| IMG-10 | Logo Creator & Redesign | ID · Império Digital | 0202-C01 |
| IMG-11 | Brand Identity Visual Kit | ID · Império Digital | 0202-C02 |
| IMG-12 | Social Media Design Kit | ID · Império Digital | 0202-C07, 0505-C06 |
| VID-01 | Roteirista de Vídeos Virais | ID · Império Digital | 0202-C13, 0202-C14, 0505-C06 |
| VID-02 | Roteiro com Identidade Pessoal | AE · Arquitetura de Essência | 0101-C09, 0202-C11, 0202-C13 |
| VID-03 | Script Improver | ID · Império Digital | 0202-C13 |
| VID-04 | Storytelling de Autoridade | AE · Arquitetura de Essência | 0101-C09, 0202-C11 |
| VID-05 | Content Repurposing Engine | ID · Império Digital | 0505-C06, 0505-C07, 0202-C16 |
| VID-06 | YouTube Script Architect | ID · Império Digital | 0202-C13, 0202-C14, 0505-C05 |
| VID-07 | Personal Brand Builder | AE · Arquitetura de Essência | 0101-C08, 0101-C09, 0101-C10, 0202-C11 |
| VID-08 | Creator Content Calendar | ID · Império Digital | 0505-C03, 0505-C06 |
| VID-09 | AI Video Director | ID · Império Digital | 0202-C13, 0202-C14 |
| NEG-01 | Business in a Box | ID · Império Digital | 0707-C01, 0707-C03, 0606-C01 |
| NEG-02 | Business Model Validator | AF · Alinhamento Financeiro | 0707-C01, 0404-C24, 0606-C01 |
| NEG-03 | Market Research Pro | ID · Império Digital | 0505-C01, 0505-C02, 0707-C05 |
| NEG-04 | Competitor Intelligence | ID · Império Digital | 0505-C02, 0606-C05 |
| NEG-05 | Niche Finder | ID · Império Digital | 0505-C01, 0606-C04 |
| NEG-06 | Offer Builder | ID · Império Digital | 0606-C01, 0606-C02, 0202-C12, 0404-C15 |
| NEG-07 | Website Architect | ID · Império Digital | 0303-C01, 0303-C10 |
| NEG-08 | Landing Page Conversion Pro | ID · Império Digital | 0303-C02, 0505-C12 |
| NEG-09 | App & SaaS Idea Builder | ID · Império Digital | 0303-C05, 0303-C09, 0303-C10 |
| NEG-10 | E-commerce Launch Kit | ID · Império Digital | 0303-C04, 0303-C16 |
| PES-01 | Deep Research Analyst | AE · Arquitetura de Essência | 0808-C10, 0909-C05, 0505-C02, 0707-C05 |
| PES-02 | Trend Radar | EX · Expansão | 0505-C16 |
| PES-03 | Idea Validator | AF · Alinhamento Financeiro | 0707-C01, 0404-C24 |
| PES-04 | Strategic Decision Maker | AF · Alinhamento Financeiro | 0101-C12, 0404-C22, 0808-C12 |
| PES-05 | Business Diagnosis Pro | AF · Alinhamento Financeiro | 0606-C01, 0707-C01, 0808-C01 |
| FIN-01 | Financial Intelligence Analyst | AF · Alinhamento Financeiro | 0404-C09, 0404-C11, 0404-C12, 0404-C23, 0404-C28, 0404-C31 |
| FIN-02 | Crypto Market Research | AF · Alinhamento Financeiro | 0404-C33, 0404-C21 |
| FIN-03 | TradingView Chart Analyst | AF · Alinhamento Financeiro | 0404-C32 |
| FIN-04 | Technical Analysis Tutor | AF · Alinhamento Financeiro | 0404-C32 |
| FIN-05 | Crypto Risk Manager | AF · Alinhamento Financeiro | 0404-C34, 0404-C22 |
| FIN-06 | Trading Strategy Backtester | AF · Alinhamento Financeiro | 0404-C35 |
| FIN-07 | Trading Journal Analyst | AF · Alinhamento Financeiro | 0404-C36 |
| FIN-08 | Binance Market Research Assistant | AF · Alinhamento Financeiro | 0404-C33 |
| FIN-09 | Macro & Crypto Intelligence | AF · Alinhamento Financeiro | 0404-C17, 0404-C18, 0404-C21, 0404-C33 |
| EST-01 | Arquiteto de Soluções Estratégicas | AE · Arquitetura de Essência | 0101-C04, 0101-C06, 0707-C01, 0808-C01 |
| EST-02 | Pesquisador de Inteligência Atualizada | AE · Arquitetura de Essência | 0808-C10, 0505-C02, 0707-C05 |
| EST-03 | Analista Crítico e Verificador de Informações | AE · Arquitetura de Essência | 0808-C10, 0707-C04, 0303-C15 |
| EST-04 | Consultor de Decisões Complexas | AF · Alinhamento Financeiro | 0101-C12, 0404-C22, 0808-C12 |
| EST-05 | Organizador de Conhecimento e Documentos | AE · Arquitetura de Essência | 0909-C05, 0909-C04, 0808-C10 |
| EST-06 | Diagnóstico Estratégico de Negócios | AF · Alinhamento Financeiro | 0606-C01, 0707-C01, 0808-C01 |
| EST-07 | Estrategista de Crescimento e Escala | EX · Expansão | 1010-C05, 1010-C06, 0707-C03 |
| EST-08 | Analista Financeiro e de Viabilidade | AF · Alinhamento Financeiro | 0404-C23, 0404-C24, 0404-C25 |
| EST-09 | Arquiteto de Produtos e Ofertas | ID · Império Digital | 0606-C01, 0606-C02, 0909-C08 |
| EST-10 | Estrategista de Marketing e Aquisição | ID · Império Digital | 0505-C01, 0505-C03, 0505-C09, 0505-C10, 0505-C12 |
| EST-11 | Engenheiro de Software e Auditor de Código | ID · Império Digital | 0303-C10, 0303-C14, 0303-C15 |
| EST-12 | Arquiteto de Automação e Agentes de IA | EX · Expansão | 0808-C06, 0808-C07, 0808-C08 |
| EST-13 | Criador de Conteúdo Multicanal | ID · Império Digital | 0505-C06, 0505-C07, 0202-C16 |
| EST-14 | Especialista em Vendas e Negociação | EX · Expansão | 0606-C08, 0606-C09, 0606-C11 |
| EST-15 | Gerente de Projetos e Execução | EX · Expansão | 0808-C02, 0808-C03, 0707-C02 |
| GLO-01 | Global Business Diagnostician | EX · Expansão | 0707-C03, 0707-C05, 1010-C05 |
| GLO-02 | International Market Finder | EX · Expansão | 0707-C05, 0707-C09 |
| GLO-03 | Global Business Model Architect | ID · Império Digital | 0707-C01, 0707-C05, 0505-C01 |
| GLO-04 | Internationalization Roadmap | EX · Expansão | 0707-C03, 0707-C09 |
| GLO-05 | Global Brand Positioning | ID · Império Digital | 0707-C06, 0707-C07, 0202-C11 |
| GLO-06 | International Revenue Architect | AF · Alinhamento Financeiro | 0404-C15, 0404-C16, 0707-C01 |
| GLO-07 | Cross-Border Operations Planner | EX · Expansão | 0707-C03, 0707-C08, 0707-C09 |
| GLO-08 | Global Legal & Tax Researcher | LG · Legado | 0707-C13 |
| GLO-09 | International Partnership Builder | EX · Expansão | 0707-C10, 0707-C12 |
| GLO-10 | Global Valuation Strategist | LG · Legado | 0404-C24, 1010-C07 |

## 6. Alterações técnicas nesta branch

- `catalogo-capacidades-data.js`: inclui 7 capacidades novas e exporta `DEPT_CODES`, `DEPT_PHASES` e `CAPABILITY_PHASES` como taxonomia compartilhada.
- `biblioteca-prompts.js`: importa a taxonomia única; gera IDs estáveis; aplica fases por capacidade quando houver exceção; exibe capacidades relacionadas às receitas especializadas.
- `biblioteca-prompts-especializados.js`: transforma as 70 linhas em objetos com propriedades nomeadas e adiciona `capabilityIds`. Isso corrige a incompatibilidade existente entre o formato de exportação (arrays) e o formato esperado pela interface (objetos).
- `catalogo-capacidades.js`: exibe ID estável e fase(s) em cada item na Gestão do Mentor.
- Cache-busting atualizado na Biblioteca, no Catálogo do Mentor, no carregador principal e no Gerador de Propostas, para garantir que todos leiam a versão atual do catálogo.

## 7. Preservação e não-escopo

- Não remover, renomear ou reordenar capacidades antigas.
- Não duplicar prompts, ferramentas, apps, coleções Firestore ou dados por UID.
- Não alterar autenticação, permissões, regras Firestore, contratos ou registros de mentorandos.
- Preservar a lógica e a precificação do Gerador de Propostas integrada no PR #111; nesta branch, somente a chave de cache da importação do catálogo foi atualizada para disponibilizar as sete novas capacidades.
- A associação por departamento permanece como padrão histórico; as sete novas capacidades têm classificação explícita por ID.
- A validação estática de IDs e referências foi executada. Ainda faltam revisão de sintaxe/imports, teste de interface autenticada, filtros por fase, cópia/geração de prompts e regressão das demais telas antes de integrar à main.
