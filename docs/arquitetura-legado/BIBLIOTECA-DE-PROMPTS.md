# Biblioteca de prompts — especificação funcional

## 1. Objetivo

Organizar prompts operacionais para o mentor transformar dados autorizados dos aplicativos em análise, planejamento e execução. A biblioteca não substitui julgamento profissional nem autoriza execução automática.

## 2. Hierarquia

- Fase (1 a 5).
- Aplicativo/ferramenta.
- Categoria (diagnóstico, pesquisa, estratégia, produto, desenvolvimento, validação, documentação).
- Prompt oficial.
- Versão personalizada do mentor.
- Projeto/mentorando associado.

## 3. Campos obrigatórios de cada prompt

| Campo | Descrição |
|---|---|
| `promptId` | identificador estável |
| `title` | nome claro |
| `phaseId` | fase de origem |
| `toolId` | ferramenta de origem |
| `category` | categoria de trabalho |
| `purpose` | o que resolve |
| `whenToUse` | quando usar |
| `requiredInputs` | dados necessários |
| `template` | texto integral do prompt |
| `expectedOutput` | resultado esperado |
| `acceptanceCriteria` | como validar |
| `nextStep` | etapa seguinte |
| `version` | versão |
| `visibility` | mentor/admin |
| `status` | draft, approved, archived |

## 4. Categorias por fase

### Fase 1 — Essência
- Entrevista e síntese de trajetória.
- Separação fato, hipótese e decisão.
- Mapeamento de capacidades e valores.
- Posicionamento, narrativa e identidade.
- Marca, voz e autoridade.

### Fase 2 — Império Digital
- Diagnóstico de presença e ativos digitais.
- Arquitetura de oferta e jornada do cliente.
- Briefing de site, app, SaaS ou plataforma.
- Arquitetura de dados, autenticação e integrações.
- Academy empresarial e sistemas de equipe/vendedores.
- Desenvolvimento, revisão de código, QA e documentação.

### Fase 3 — Alinhamento Financeiro
- Diagnóstico de fluxo e compromissos.
- Organização de cenários e indicadores.
- Precificação, margem e viabilidade.
- Plano de caixa e prioridades.
- Educação e planejamento, sem recomendar investimento individual sem qualificação profissional.

### Fase 4 — Expansão
- Pesquisa de mercado e canais.
- Estratégia de aquisição e growth.
- CRM, funil e processo comercial.
- SOPs, delegação e responsabilidades.
- Treinamento de equipe e métricas.
- Experimentos e avaliação de resultados.

### Fase 5 — Legado
- Mapa de ativos e dependências.
- Documentação de método e governança.
- Continuidade operacional.
- Plano de sucessão e perguntas para especialistas habilitados.
- Organização do Legacy Vault.

## 5. Prompt contextual padrão do mentor

Cada prompt específico deve receber contexto estruturado:
- respostas originais selecionadas;
- fase, app e data de origem;
- perfil/empresa apenas no limite necessário;
- decisões já aprovadas;
- hipóteses não confirmadas;
- lacunas e perguntas pendentes;
- escopo contratado e restrições.

A instrução base deve exigir que a IA:
1. não invente dados;
2. cite quais respostas sustentam cada inferência;
3. separe fatos, hipóteses e recomendações;
4. sinalize lacunas;
5. ofereça alternativas com prós/contras;
6. proponha entregáveis e critérios de aceite;
7. peça confirmação do mentor antes de registrar decisões ou executar ações.

## 6. Operação e governança

- Prompts oficiais editados somente por administradores autorizados.
- Mentor pode duplicar e personalizar sem alterar o original.
- Guardar versão, autor, data e histórico.
- Não incluir dados sensíveis no texto do prompt se não forem necessários.
- Não usar respostas de um mentorando como contexto de outro.
- Não publicar a biblioteca interna na interface do mentorando.
