/**
 * Biblioteca operacional — Zero ao 100 Negócios / Zero ao Zen Negócios
 * Mantém o rótulo Zero ao 100 para o material atual solicitado.
 * Aulas-base: reserva, renda fixa, CDI/CDB, Tesouro, FGC, liquidez, FIIs, bolsa e ordens.
 */
export const CONTENT_SCRIPTS = {
  zero100_carrosseis: {
    title: "Zero ao 100 Negócios · 9 carrosséis financeiros",
    duration: 22,
    content: `CARROSSEL 1 — O PRIMEIRO PASSO PARA INVESTIR
1. Antes de investir, entenda sua vida financeira.
2. Quanto entra por mês?
3. Quanto sai?
4. Existem dívidas caras?
5. Você tem uma reserva para imprevistos?
6. Dinheiro de curto prazo não deve ficar exposto a riscos que você não consegue suportar.
7. Defina objetivo, prazo, liquidez e tolerância a risco.
8. Só depois compare alternativas.
9. Investir não é apostar nem seguir promessa de rendimento.
10. Salve este checklist e comece pelo diagnóstico.

CARROSSEL 2 — POR QUE UMA RESERVA FINANCEIRA IMPORTA
1. Um imprevisto não deveria obrigar você a vender investimentos na pior hora.
2. Reserva serve para emergências, não para buscar o maior retorno.
3. Primeiro calcule despesas essenciais mensais.
4. Multiplique pelo número de meses de proteção que faz sentido para sua realidade.
5. Considere estabilidade da renda, dependentes e compromissos.
6. Priorize acesso fácil e baixo risco.
7. Confira liquidez, regras e emissor do produto.
8. Não confunda reserva com dinheiro para objetivos de longo prazo.
9. A reserva compra tempo para decidir com mais calma.
10. Comece com uma meta realista e revise conforme a vida muda.

CARROSSEL 3 — CDI, CDB E TESOURO SELIC
1. CDI, CDB e Tesouro Selic não são a mesma coisa.
2. CDI é uma taxa de referência do mercado interbancário.
3. CDB é um título emitido por um banco para captar dinheiro.
4. Um CDB pode pagar um percentual do CDI, uma taxa prefixada ou uma taxa ligada à inflação.
5. Tesouro Selic é um título público federal cuja remuneração acompanha a taxa Selic.
6. CDB depende do banco emissor e das condições do título.
7. Tesouro Direto é um programa de compra e venda de títulos públicos para pessoas físicas.
8. Compare rentabilidade líquida, prazo, liquidez, impostos e riscos.
9. CDB elegível pode ter cobertura do FGC dentro das regras e limites; Tesouro Direto não é coberto pelo FGC.
10. Não escolha só pela taxa anunciada: leia as condições.

CARROSSEL 4 — PREFIXADO, PÓS-FIXADO E IPCA+
1. Prefixado: a taxa é definida na compra, se você mantiver até o vencimento conforme as regras.
2. Pós-fixado: o rendimento acompanha um indicador, como CDI ou Selic, segundo o contrato.
3. IPCA+: combina uma taxa contratada com a variação do índice de inflação.
4. O prefixado pode ser interessante para objetivo com prazo compatível, mas o preço pode oscilar antes do vencimento.
5. O pós-fixado acompanha melhor a mudança do indicador, mas o retorno futuro não é conhecido de antemão.
6. IPCA+ busca preservar poder de compra no longo prazo, mas pode oscilar bastante no caminho.
7. Vender antes do vencimento pode gerar resultado diferente do esperado.
8. Prazo, objetivo e necessidade de liquidez importam.
9. Não existe um título ideal para todas as situações.
10. Escolha entendendo o risco, não apenas o nome.

CARROSSEL 5 — O QUE É O FGC?
1. FGC significa Fundo Garantidor de Créditos.
2. Ele oferece garantia para determinados produtos financeiros elegíveis, respeitando regras e limites.
3. Nem todo investimento é coberto.
4. Ações, fundos de investimento e títulos públicos do Tesouro Direto não têm cobertura do FGC.
5. Produtos bancários elegíveis podem incluir CDB, LCI e LCA, conforme as regras vigentes.
6. A cobertura tem limites por CPF/CNPJ, instituição ou conglomerado e período.
7. Confirme sempre as regras atuais diretamente nas fontes oficiais.
8. FGC não elimina todos os riscos nem garante acesso imediato ao dinheiro em qualquer cenário.
9. Não concentre decisões apenas na existência de garantia.
10. Entenda o produto, o emissor, a liquidez e os limites.

CARROSSEL 6 — FIIs, COTAS E DIVIDENDOS
1. Um fundo imobiliário reúne recursos de investidores para investir em ativos ou estratégias imobiliárias.
2. Ao comprar uma cota, você passa a ter participação no fundo, não propriedade direta de um imóvel específico.
3. Alguns fundos investem em imóveis; outros, em títulos e recebíveis imobiliários.
4. Rendimentos distribuídos podem variar e não são garantidos.
5. O preço da cota também pode subir ou cair.
6. Vacância, inadimplência, juros, gestão, concentração e qualidade dos ativos afetam resultados.
7. Dividend yield é uma relação entre rendimentos distribuídos e preço da cota em determinado período; não prevê o futuro.
8. Liquidez varia de fundo para fundo.
9. Analise relatórios, custos, riscos e estratégia.
10. Não compre apenas porque o rendimento passado parece alto.

CARROSSEL 7 — COMO FUNCIONA A BOLSA
1. A bolsa é um ambiente organizado para negociar ativos financeiros.
2. Investidores enviam ordens por meio de corretoras.
3. O preço depende de ofertas de compra e venda e das condições de mercado.
4. Ações representam participação societária em empresas.
5. ETFs buscam acompanhar índices ou estratégias conforme suas regras.
6. FIIs são fundos com cotas negociadas em bolsa.
7. Preço pode oscilar por resultados, juros, notícias, expectativas e liquidez.
8. Rentabilidade não é garantida e perdas são possíveis.
9. Antes de operar, conheça custos, tributação e riscos.
10. Investir é diferente de tentar adivinhar movimentos diários.

CARROSSEL 8 — ORDEM A MERCADO E ORDEM LIMITADA
1. Uma ordem é uma instrução enviada ao mercado para comprar ou vender um ativo.
2. Ordem a mercado busca executar ao melhor preço disponível, mas o preço final pode variar.
3. Ordem limitada define o preço máximo de compra ou mínimo de venda aceito.
4. Uma ordem limitada pode não ser executada se o mercado não alcançar o preço.
5. Quantidade e valor total são campos diferentes: confira o que a corretora está solicitando.
6. Liquidez baixa pode ampliar a diferença entre preços de compra e venda.
7. Revise ativo, lado, quantidade, preço e validade antes de confirmar.
8. Não confunda ordem enviada com ordem executada.
9. Entenda as opções da plataforma antes de usar dinheiro real.
10. Se estiver aprendendo, pratique em simulador quando disponível.

CARROSSEL 9 — RENDIMENTO, VALORIZAÇÃO E RISCO
1. Ganhar dinheiro investindo pode acontecer de formas diferentes.
2. Rendimentos periódicos são pagamentos ou distribuições, quando previstos e efetivamente realizados.
3. Valorização acontece quando o preço de um ativo sobe.
4. Um ativo pode distribuir rendimentos e ainda assim perder valor de mercado.
5. Um ativo que valorizou no passado pode cair depois.
6. Rentabilidade passada não garante rentabilidade futura.
7. Considere custos, impostos, inflação, prazo e risco.
8. Desconfie de promessa de lucro diário garantido.
9. Diversificação reduz concentração, mas não elimina perdas.
10. Aprender a avaliar é mais importante do que perseguir promessa.`
  },
  zero100_reels: {
    title: "Zero ao 100 Negócios · 6 Reels financeiros",
    duration: 12,
    content: `REEL 1 — ANTES DE INVESTIR, FAÇA ESTA PERGUNTA
Você sabe quanto custa manter sua vida por um mês? Antes de escolher um investimento, conheça suas despesas essenciais, dívidas, objetivos e prazo. Dinheiro que pode ser necessário amanhã não deve ser tratado como dinheiro de longo prazo. Primeiro organize a base, depois compare liquidez, risco e rentabilidade. Investir começa com clareza, não com uma promessa. Salve para revisar seu ponto de partida.

REEL 2 — CDI NÃO É UM INVESTIMENTO
Muita gente fala que investiu no CDI, mas CDI é uma taxa de referência, não um produto que você compra diretamente. Um CDB pode pagar, por exemplo, um percentual do CDI. Já o Tesouro Selic é um título público ligado à taxa Selic. São produtos diferentes, com emissores, regras, riscos e condições próprias. Compare sempre o rendimento líquido, a liquidez e as regras antes de decidir.

REEL 3 — CDB E FGC: O QUE VOCÊ PRECISA SABER
CDB é um título emitido por um banco para captar recursos. Alguns CDBs elegíveis contam com cobertura do FGC, dentro das regras e limites vigentes. Isso não significa que todo investimento seja garantido, nem que o dinheiro esteja disponível imediatamente em qualquer situação. Confira emissor, prazo, liquidez, rentabilidade e limites de cobertura. Não escolha um produto apenas porque ouviu que é seguro.

REEL 4 — FIIs: DIVIDENDO NÃO É LUCRO GARANTIDO
Fundos imobiliários negociam cotas em bolsa e podem distribuir rendimentos, mas os valores variam e não são garantidos. O preço da cota pode cair, e fatores como vacância, juros, inadimplência, gestão e qualidade dos ativos fazem diferença. Dividend yield mostra uma relação com pagamentos passados ou recentes; não prevê o futuro. Antes de comprar, entenda a estratégia e os riscos do fundo.

REEL 5 — ORDEM A MERCADO OU LIMITADA?
A ordem a mercado busca executar pelo melhor preço disponível, mas o preço final pode variar. A ordem limitada estabelece um preço máximo para comprar ou mínimo para vender, mas pode não executar. Antes de confirmar, confira ativo, quantidade, preço e validade. E lembre: ordem enviada não significa ordem executada. Se você está começando, aprenda a interface e os riscos antes de operar.

REEL 6 — DESCONFIE DO LUCRO GARANTIDO
Investimento envolve risco, prazo e incerteza. Um ativo pode valorizar, cair, distribuir rendimentos ou deixar de distribuí-los. Promessas de lucro diário garantido são um sinal de alerta. Antes de colocar dinheiro, pergunte: como funciona, de onde vem o retorno, quais são os riscos, quais são os custos e como posso sair? Educação financeira começa com perguntas melhores, não com atalhos.`
  },
  zero100_stories: {
    title: "Zero ao 100 Negócios · 3 sequências de Stories",
    duration: 10,
    content: `SEQUÊNCIA 1 — PRIMEIROS PASSOS
STORY 1: Você investe ou ainda está tentando entender por onde começar?
STORY 2: Antes do produto, vem o objetivo: reserva, compra futura ou longo prazo?
STORY 3: Você sabe quanto entra e sai por mês?
STORY 4: Reserva financeira serve para emergências e precisa considerar sua realidade.
STORY 5: Liquidez é a facilidade e o prazo para transformar um investimento em dinheiro disponível.
STORY 6: Enquete: você já tem reserva? SIM / AINDA NÃO.
STORY 7: Amanhã vamos diferenciar CDI, CDB e Tesouro Selic.

SEQUÊNCIA 2 — RENDA FIXA
STORY 8: CDI é uma taxa de referência, não um produto comprado diretamente.
STORY 9: CDB é emitido por banco; Tesouro Selic é título público federal.
STORY 10: Prefixado define uma taxa contratada; pós-fixado acompanha um indicador.
STORY 11: IPCA+ combina taxa contratada com inflação medida pelo IPCA.
STORY 12: Vender antes do vencimento pode produzir resultado diferente do esperado.
STORY 13: FGC cobre apenas produtos elegíveis e dentro de limites; não cobre todo investimento.
STORY 14: Caixa de perguntas: qual diferença entre esses produtos ainda ficou confusa?

SEQUÊNCIA 3 — BOLSA E FIIs
STORY 15: FII é um fundo com cotas negociadas em bolsa; não é o mesmo que comprar um imóvel diretamente.
STORY 16: Rendimentos podem variar e não são garantidos.
STORY 17: O preço da cota também sobe e desce.
STORY 18: Dividend yield não prevê o que o fundo vai pagar no futuro.
STORY 19: Ordem a mercado busca executar ao preço disponível; ordem limitada define um limite.
STORY 20: Enquete: você já sabia que uma ordem limitada pode não executar? SIM / NÃO.
STORY 21: Não existe lucro diário garantido. Aprenda o produto, o risco, os custos e as regras antes de investir. CTA: envie sua dúvida para a próxima aula.`
  }
};
