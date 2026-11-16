# Fluxo do mentorando ao processo executivo

## 1. Princípio de experiência

A pessoa não precisa conhecer termos técnicos para identificar uma necessidade. Cada ferramenta explica o que faz, apresenta exemplos, permite resposta guiada ou livre e salva o progresso. O mentor interpreta as respostas; a IA sugere hipóteses e possibilidades, mas o mentor valida o plano.

## 2. Fluxo desejado

1. **Entrada:** login, perfil e empresa/projeto.
2. **Orientação:** pessoa vê fase, objetivo da ferramenta e explicação simples.
3. **Diagnóstico:** perguntas com alternativas, campo livre e opção “não sei / quero ajuda”.
4. **Registro:** respostas e decisões são salvas na conta.
5. **Compartilhamento:** botão copia pacote completo (pergunta + resposta + escolhas + observações + resultado) para WhatsApp; cópia não substitui o registro na nuvem.
6. **Análise do mentor:** painel interno recupera os dados da conta por autorização real, sem depender apenas do texto enviado no WhatsApp.
7. **Leitura assistida:** IA separa fatos relatados, hipóteses, lacunas e possíveis oportunidades.
8. **Decisão:** mentor valida e registra prioridade, escopo e próximo passo.
9. **Projeto executivo:** necessidades aprovadas viram projetos com responsável, cronograma, dependências e critérios de aceite.
10. **Desenvolvimento:** mentor usa IA e ferramentas de desenvolvimento; cada execução tem revisão humana.
11. **Entrega:** documentos, aplicações, links e ativos digitais organizados por fase/projeto.
12. **Acompanhamento:** mentorando vê status e entregas compartilhadas; notas privadas continuam privadas.

## 3. Padrão por ferramenta

### Área do mentorando
- Título e propósito em linguagem simples.
- Aviso de privacidade preciso e próximo ao título.
- Perguntas originais preservadas.
- Quiz/ajuda apenas em perguntas que realmente exigem decisão.
- Campo “já decidi” e campo “quero conversar com o mentor”.
- Autosave com confirmação visual.
- Retomar depois.
- Copiar tudo, com formatação legível para WhatsApp.
- Histórico de alterações e data do último salvamento.

### Área do mentor
- Respostas originais, sem edição silenciosa.
- Histórico e origem do dado.
- Nota privada.
- Hipóteses claramente rotuladas.
- Perguntas pendentes para a próxima call.
- Possibilidades de execução, não ordens automáticas.
- Prompt contextual que usa somente dados autorizados.
- Plano de trabalho com validação humana.
- Registro de decisão compartilhada.

## 4. O que já existe na camada AfApoio

`afplataforma/assets/js/af-apoio.js` já contém:
- Dicionário de ferramentas e perguntas orientadoras por app.
- Aviso de privacidade.
- Botão de cópia do pacote para WhatsApp.
- Identificação visual “Só mentor e admin · Gmail autorizado”.
- Prompt do mentor copiável.
- Quiz sequencial de perguntas (uma por vez), com navegação anterior/próxima e opções de decisão.

A busca no repositório encontrou chamadas `AfApoio.mount` em 20 aplicativos e chamadas `quizify()` em 20 aplicativos além do próprio helper. Portanto, não começar do zero: auditar a cobertura e a fidelidade do estado coletado em cada app.

### Limitações observadas
- O helper declara que não grava dados novos; a persistência continua sendo responsabilidade do app.
- Em 20 módulos inspecionados que chamam o helper, o código grava em coleção própria com `setDoc`, mas não foi localizada leitura/hidratação do documento após `onAuthStateChanged`. A tela pode voltar vazia ao reabrir mesmo que o documento exista na nuvem; validar em navegador e corrigir com piloto antes de replicar.
- A cópia usa `window.__AF` ou o estado entregue ao helper. É necessário validar se cada app entrega o estado completo e atualizado.
- O painel de mentor montado no frontend não equivale a um painel central que consulta os registros Firestore de vários mentorandos. A própria nota do helper orienta o mentor a ler o que a pessoa enviou pelo WhatsApp.
- A checagem de Gmail/UID dentro do helper controla a exibição do bloco no navegador; não é autorização de segurança. O backend/Firestore Rules deve continuar sendo a autoridade.
- O texto gerado no pacote diz “Só eu acesso eles no app”, embora as regras permitam leitura do mentor AF em coleções específicas.
- O pacote atual lista os rótulos das perguntas e opções, mas serializa uma resposta genérica por campo de formulário. Não garante que todas as alternativas escolhidas em cada pergunta do quiz, textos auxiliares e campos dinâmicos sejam exportados individualmente.
- O quiz organiza campos existentes em sequência e usa regras de texto para sugerir alternativas; não é ainda um quiz semântico customizado para todas as perguntas de todos os apps.

## 5. Cadência dos encontros

A Central do Expert e os documentos de oferta consultados indicam 12 meses, 24 encontros coletivos online, 3 encontros individuais e 3 imersões presenciais de dois dias. Distribuição individual documentada:
1. Essência e Império Digital.
2. Alinhamento Financeiro e Expansão.
3. Legado, treinamento, vendas e automações.

Há também a trilha histórica de 26 encontros em `/sessoes/`. Não confundir os 26 roteiros antigos com os 24 encontros coletivos do formato atual. Não alterar números sem validar a versão comercial vigente.

## 6. Comunicação e arquivos

- WhatsApp: canal de envio voluntário e comunicação; abrir com texto pronto, nunca alegar envio automático.
- AF Plataforma: fonte oficial de respostas, decisões e status.
- Google Drive: repositório de arquivos e ativos entregues, com permissão controlada.
- Não guardar senha, token ou credencial em formulário, prompt, WhatsApp ou Drive compartilhado.
