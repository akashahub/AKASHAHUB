# AF Plataforma — camada Investimentos & Mercados

**Status:** protótipo isolado / primeira camada de trabalho  
**Ponto de entrada previsto:** Fase 3 — Alinhamento Financeiro, sem substituir os recursos atuais da AF.

## Objetivo

Adicionar ao ecossistema AF um laboratório de análise de mercados e investimentos: criptomoedas, ações, ETFs, FIIs e cenários macroeconômicos. A camada deve ajudar a estudar, comparar, registrar hipóteses, compreender exposição e visualizar riscos. Não deve prometer rentabilidade nem recomendar automaticamente compra ou venda.

## O que o protótipo já inclui

- Calculadora matemática de dimensionamento de posição e orçamento de risco, sem taxas ou estimativa de execução.
- Diário de teses: ativo, categoria, hipótese e risco/evidência contrária.
- Mapa inicial das ferramentas a construir.
- Salvamento local no navegador, separado por usuário quando há UID disponível, ainda sem sincronização entre dispositivos.

## Ferramentas candidatas

1. **Radar cripto:** preço e variação, volume, capitalização, oferta, desbloqueios e métricas de rede — depois de escolher fontes e limites confiáveis.
2. **Radar de bolsa, ETFs e FIIs:** filtros, liquidez, indicadores, proventos e calendário de resultados.
3. **Comparador:** períodos equivalentes, volatilidade, drawdown, custos e fundamentos.
4. **Carteira e cenários:** alocação, concentração, correlação aproximada e sensibilidade a quedas; somente acompanhamento, sem movimentar ativos.
5. **Calendário macroeconômico:** Selic, inflação, decisões de bancos centrais, resultados e eventos de cripto, sempre com fonte e data.
6. **Diário de operações e simulador:** registrar hipóteses e testar estratégias hipotéticas antes de qualquer integração sensível.
7. **Alertas configuráveis:** somente após definir fontes, frequência, custos, confiabilidade e prevenção de alertas enganosos.

## Ordem sugerida

- **P0 — Base:** protótipo, experiência de uso e diário de teses.
- **P1 — Dados:** escolher provedores/API, registrar fonte, moeda, horário da cotação, limites e tratamento de falhas.
- **P2 — Persistência e análise:** sincronização autorizada com a conta do usuário, comparador e visão de carteira.
- **P3 — Simulação:** backtest auditável, cenários e alertas controlados.
- **Fora do escopo inicial:** custódia, integração de chaves privadas, conexão a corretoras, execução de ordens, alavancagem automática ou sinais de compra/venda.

## Regras de integridade

- Não remover, renomear ou substituir módulos, ferramentas, arquivos, dados ou acessos existentes da AF.
- Não duplicar os conteúdos e ferramentas de educação financeira já presentes; reutilizar integrações somente quando fizer sentido.
- Não exibir preço ou indicador sem fonte e horário; distinguir dado observado, cálculo, hipótese e opinião.
- Não tratar a primeira versão como fonte de cotação em tempo real: atualmente ela não tem integração de mercado.
- Manter desenvolvimento em branch próprio e revisar as alterações antes de integrar à versão publicada.

## Biblioteca de cursos e aulas

A tela Investimentos & Mercados inclui uma biblioteca compartilhada em Firestore. O mentor autorizado cadastra cursos e adiciona aulas por link ou ID do YouTube. O catálogo armazena o ID do vídeo, não mostra o link como texto na área do aluno e abre a aula em um modal com botão de fechar, clique fora e tecla Escape. O acesso é regido por Firestore Rules: leitura para mentor e contas AF aprovadas/ativas; gravação e remoção somente pelo mentor. O vídeo e a permissão de incorporação continuam sob controle do proprietário no YouTube.

**Nota de implantação:** o arquivo afplataforma/firestore.rules do repositório adiciona as regras da coleção afLearningCourses e da subcoleção videos. Para que a biblioteca funcione em produção, essas Rules precisam ser publicadas no projeto Firebase correto junto com o código. Criar ou atualizar arquivos no GitHub não publica automaticamente as Rules.

## Ferramentas funcionais acrescentadas

- **Deal Lens:** estima EBITDA a partir de receita e margem informadas, múltiplo pedido, EV pelo múltiplo de referência, equity value indicativo e diferença entre pedido e cenário.
- **Equity Studio:** simula valuation pré-money/pós-money e participação percentual após um aporte simples.
- **Glossário vivo:** pesquisa termos de negócios, M&A, mercados, cripto e gestão com definições curtas e limitações indicadas.
