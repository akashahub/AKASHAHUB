# Projeto Akasha Trading · Zen Negócios

**Localização estratégica:** AF Plataforma → Fase 5 · Legado → Zen Negócios  
**Status:** especificação arquitetural em revisão; implementação funcional ainda não iniciada.  
**Fase de origem:** Akasha Trading · Fase 2.

## Objetivo

Registrar e conduzir, dentro do Zen Negócios, a arquitetura técnica do Akasha Trading. O Zen Negócios funciona como espaço de governança, documentação, continuidade e acompanhamento do projeto. A aplicação Akasha Trading será implementada em sua própria área, integrada à identidade do Akasha Hub e sem comprometer a AF Plataforma.

## Decisões já aprovadas

- Nome: **Akasha Trading**.
- Acesso: **híbrido**.
- Escopo: **todos os territórios**.
- Territórios: Trading, Criptoativos, Economia e Investimentos.
- Identidade: autenticação compartilhada com o ecossistema Akasha/AF, após validação técnica.
- Preservação obrigatória do Diário de Operações existente.
- Nenhuma execução de ordens de compra ou venda nesta etapa arquitetural.
- Não armazenar senhas de corretoras, chaves privadas ou frases de recuperação.

## Fase 2 · Especificações

| Etapa | Entrega | Estado |
|---|---|---|
| 2.1 | Inventário técnico e arquitetura | Concluída em nível de inspeção inicial; pendente validação runtime |
| 2.2 | Mapa de telas e navegação | Definido |
| 2.3 | Modelo de dados e permissões | Especificado neste projeto; requer revisão antes de schema |
| 2.4 | Estratégia de integração do Diário | Especificada; migração ainda não executada |
| 2.5 | Segurança e migração | Plano especificado; controles ainda não implementados/testados |
| 2.6 | Critérios de testes e validação | Definidos como critérios de aceite |

## Documentos

- [2.3 · Modelo de dados e permissões](./2.3-modelo-dados-permissoes.md)
- [2.4 · Estratégia de integração do Diário](./2.4-integracao-diario.md)
- [2.5 · Plano de segurança e migração](./2.5-seguranca-migracao.md)
- [2.6 · Critérios de testes e validação](./2.6-testes-validacao.md)
- [Backlog de implementação](./backlog.md)

## Sistemas existentes a preservar

- [Diário de Operações](../../../../diario-de-operacoes/index.html): mantém as chaves locais legadas `diario-operacoes-v1` e `diario-notas-v1`.
- [Zen Mercado](../../../../zen-mercado/index.html): conteúdo educacional e calculadora existentes.
- [AF Plataforma](../../index.html): identidade, autenticação, permissões e estrutura institucional.

## Regra de governança

Documentação e especificações podem evoluir por pull request. Alterações em autenticação, regras do Firestore, dados existentes, armazenamento local, rotas compartilhadas ou funcionalidades da AF exigem revisão específica, plano de rollback e validação antes de merge/publicação.

**Este projeto não declara que a plataforma esteja implementada ou publicada.** O conteúdo registra decisões e critérios para orientar a implementação.
