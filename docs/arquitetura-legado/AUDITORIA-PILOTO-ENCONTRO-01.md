# Auditoria-piloto — ferramentas do Encontro 01

**Data da inspeção documental:** 22/11/2026  
**Escopo:** leitura de código e regras no repositório. Não foram executados testes de navegador, contas reais ou deploy do Firebase. Este documento separa o que o código demonstra do que ainda precisa de teste funcional.

## Objetivo do Encontro 01

Produzir um diagnóstico do ponto A que diferencie fatos e dados fornecidos, percepções e narrativas, hipóteses a validar, gargalos observáveis, recursos e capacidades, decisões e prioridades.

Não queremos fazer a pessoa preencher a mesma história em cinco formulários. A experiência deve conduzir uma conversa, reaproveitar respostas existentes e construir um mapa executivo.

## Ferramentas encontradas

### 1. Essência OS — /afplataforma/essencia/

**Estado observado no código**
- Coleção: afEssencia/{uid}.
- Campos iniciais: historia, valores, crencas, posicionamento, proposito e observacoes.
- Tem módulos de história, valores/crenças, posicionamento e propósito/direção.
- Possui descoberta guiada por opções e campos de texto, que gera uma sugestão editável.
- Salva no Firestore com setDoc e merge.
- Na autenticação, busca o documento com getDoc e reidrata apenas os campos conhecidos.
- Há bloqueio de escrita quando o mentor está visualizando as respostas de outra pessoa, por meio de AkashaSubject.writingLocked().

**Pontos positivos**
- Persistência remota e hidratação estão implementadas no código.
- Mescla campos existentes sem substituir o documento inteiro.
- Sugestões podem ser editadas antes de salvar.

**Limitações identificadas**
- O conteúdo de descoberta é genérico e não adapta perguntas por profissão, modelo de negócio ou maturidade.
- A ferramenta registra narrativa e identidade, mas não é, sozinha, um diagnóstico operacional do negócio.
- O progresso é calculado por tamanho de texto em cinco campos; não mede qualidade, evidência ou conclusão real.
- A sugestão gerada é uma formulação textual, não uma análise validada. Deve ser apresentada como rascunho para revisão humana.
- O botão de salvar depende de ação explícita; não foi comprovado teste real de recuperação entre dispositivos.

**Evolução proposta**
1. Preservar coleção e campos existentes.
2. Adicionar camada de contexto profissional e empresarial: profissão, modelo de receita, tipo de cliente, equipe, estágio, oferta e objetivo.
3. Permitir que a IA sugira perguntas complementares, sempre identificando hipótese e pedindo confirmação.
4. Criar síntese com fatos, evidências, hipóteses, forças, gargalos e lacunas.
5. Permitir revisão do mentorando e aprovação antes de transformar uma hipótese em decisão.
6. Registrar a origem de cada informação e data da última confirmação.

### 2. Mesa da Essência — view fase1-jogo

**Estado observado**
- A função renderFase1Jogo() mostra uma tela explicativa curta.
- bindFase1Jogo() está vazio.
- O código da tela informa que os dados ficam locais, mas a versão atualmente inspecionada não contém os campos/estações interativos descritos em documentação anterior.

**Conclusão**
- A rota/view existe, mas o fluxo interativo não está implementado nesta versão do arquivo.
- Não prescrever a Mesa como ferramenta obrigatória do Encontro 01 até reconstruir e testar sua experiência.

**Evolução proposta**
- Transformar em entrevista guiada por etapas, não em questionário extenso.
- Exibir uma pergunta por vez, com exemplos e opção “não sei ainda”.
- Adaptar perguntas conforme profissão, estágio e resposta anterior.
- Permitir registrar evidência, hipótese e observação.
- Salvar no Firestore com recuperação entre dispositivos; localStorage pode ser rascunho/cache, não fonte oficial.
- Gerar síntese para revisão, sem diagnóstico automático de pessoas ou terceiros.

### 3. Dossiê vivo — view fase1-dossie

**Estado observado**
- A função renderFase1Dossie() mostra apenas uma mensagem e aponta para o Essência OS.
- bindFase1Dossie() está vazio.
- Portanto, essa view não é atualmente um dossiê editável completo.

**Ferramenta relacionada, mas diferente: Hub Dossiê**
- hub-dossie.js lê dados de diversas coleções de aplicativos para o mentor.
- A própria implementação declara que é uma tela de leitura: não cria coleção e não grava.
- O código tenta ler o documento de cada ferramenta e classifica vazio, preenchido, bloqueado ou erro.
- A autorização depende do contexto de mentorando e das regras Firestore; o acesso real precisa ser testado com contas autorizadas e não autorizadas.

**Evolução proposta**
- Não duplicar a coleta do Essência OS nem criar outra coleção concorrente.
- Construir uma síntese que referencie as fontes originais e diferencie: dado do participante, hipótese de trabalho, decisão compartilhada e nota privada do mentor.
- Permitir que o mentor aprove quais conclusões podem ser compartilhadas.
- Manter nota privada separada e inacessível ao mentorando.

### 4. Mapas Mentais — mindmaps.js

**Estado observado**
- Há mapas estruturados, incluindo Alinhamento Pessoal, Zero ao Zen Negócios e Arquitetura de Legado.
- Usa cache local por usuário e sincronização com Firestore.
- O caminho observado é mentorias/{uid}/mapas_mentais/state.
- A hidratação lê estado remoto e mescla com estado local.
- A sincronização usa transação Firestore para reconciliar os estados.
- O bloco de regras match /mentorias/{uid}/{rest=**} permite leitura/escrita do próprio UID e leitura por mentor AF.

**Pontos positivos**
- É a ferramenta mais próxima de um mapa vivo de contexto e relações entre dimensões.
- Já tem mecanismos de hidratação e sincronização transacional.
- Pode ajudar a transformar respostas em visão conectada, em vez de campos isolados.

**Limitações**
- A existência de sincronização no código não substitui teste real de conflito, dispositivo, conta e permissão.
- Os mapas existentes não devem ser reescritos ou substituídos; adicionar um mapa específico de diagnóstico do negócio deve ser aditivo.
- O mapa deve mostrar origem e grau de confiança das informações, para não transformar hipótese em fato.

**Evolução proposta**
- Criar um mapa do negócio com trilhas configuráveis por profissão: cliente, oferta, aquisição, entrega, equipe, caixa, ativos, risco e continuidade.
- Nós podem ser classificados como fato, hipótese, gargalo, recurso, decisão ou oportunidade.
- Conectar nós a ferramentas e entregas sem copiar os dados originais.
- Exibir progresso por evidência e não apenas por preenchimento.

### 5. Visão 1 página e Ideação / Insights

**Estado observado**
- São ferramentas textuais do painel flutuante tools.js.
- O texto é carregado por getAfTool quando há sessão Firebase, com fallback para Store local.
- O salvamento grava localmente e tenta persistir em afTools/{uid}/tools/{toolId}.
- Visão é um texto livre com referência a horizontes de 10 anos, 3 anos e 90 dias.
- Ideação é um diário de insights em texto livre.

**Limitações**
- São espaços de anotação, não motores de diagnóstico.
- Não há estrutura nativa de hipótese, evidência, prioridade, responsável e indicador.
- O salvamento remoto é tentado, mas o código captura erro e segue; o usuário pode não perceber uma falha remota se a mensagem de sucesso for exibida.

**Evolução proposta**
- Manter os campos livres e acrescentar metadados estruturados.
- Para Ideação: problema observado, para quem, evidência, hipótese, solução possível, teste e resultado.
- Para Visão: cenário atual, horizonte, resultado desejado, indicadores, restrições e decisões.
- Tornar explícito o estado de sincronização: salvo no dispositivo, sincronizando, salvo na conta ou falhou.

### 6. Roteiro em Sessões — /sessoes/

**Estado documental**
- Trilha anterior com 26 encontros, perguntas, tarefas e anotações.
- Respostas no caminho mentoria_respostas/{uid}/dados/tudo.
- É uma fonte histórica e pode conter material útil, mas não deve ser confundida com a nova trilha dos 24 encontros.
- As regras encontradas permitem ao dono ler/escrever e ao mentor AF ler.

**Evolução proposta**
- Fazer inventário do conteúdo antes de reutilizar perguntas.
- Mapear cada pergunta existente para a nova matriz: manter, adaptar, fundir ou arquivar como legado.
- Não apagar nem renumerar a trilha antiga durante essa etapa.

## Desenho recomendado para a experiência do Encontro 01

1. **Entrada contextual:** profissão, tipo de negócio, estágio, modelo de receita e objetivo atual.
2. **Entrevista guiada:** uma pergunta por vez, com opção de resposta curta, texto livre ou “não sei”.
3. **Mapa visual:** cliente, oferta, aquisição, entrega, caixa, equipe, ativos e continuidade.
4. **Detecção assistida:** destacar possíveis gargalos e relações, sempre como hipóteses a confirmar.
5. **Revisão:** participante confirma, corrige ou descarta cada insight.
6. **Priorização:** escolher três gargalos por impacto, urgência, evidência e capacidade de ação.
7. **Síntese:** gerar um resumo do ponto A com fonte, data, confiança e pendências.
8. **Plano imediato:** uma ação em 48 horas e uma investigação para o próximo encontro.

## Critério para considerar a auditoria funcional concluída

- Teste com conta de mentorando: abrir, preencher, salvar, sair e recuperar.
- Teste de recuperação em outro dispositivo ou navegador.
- Teste com outra conta: confirmar isolamento por UID.
- Teste com mentor autorizado: leitura correta sem sobrescrever dados.
- Teste com usuário não autorizado: acesso negado.
- Teste de perda de conexão e retorno.
- Confirmar se as regras publicadas no Firebase correspondem ao arquivo auditado no repositório.
- Confirmar que nenhum dado privado do mentor aparece no ambiente do mentorando.

## Decisão desta auditoria

**Reaproveitar:** Essência OS, Mapas Mentais, Visão 1 página, Ideação e o histórico da trilha Sessões.

**Não tratar como pronto:** Mesa da Essência e view Dossiê vivo; ambas aparecem como telas-placeholder no código inspecionado.

**Evoluir antes de exigir como entrega:** síntese do ponto A, contexto profissional, mapa de gargalos, priorização por evidências e estado confiável de sincronização.

**Não foi feita alteração nos aplicativos nem nas regras.** Esta auditoria é documental; testes de navegador, Firestore publicado e permissões reais permanecem pendentes.
