# ISAAC SDR OS — validação do MVP de calls

Data: 17/09/2026

## Escopo entregue

- Painel Hoje com meta de 15 contatos, progresso de 90 ganhos e filas por canal.
- Score de contatabilidade A–D com critérios transparentes.
- CRM compatível com registros antigos e novos campos institucionais.
- Pipeline ampliado sem remover status existentes.
- Call Cockpit com cronômetro, uma pergunta por etapa e anotações.
- Registro interno de tentativa e responsável alcançado.
- Agendamento com data, horário, fuso, participantes, closer, link e status.
- Âncora de compromisso, handoff, confirmação, lembrete e remarcação.
- Mensagens somente copiáveis e convite `.ics` somente por download local.
- Reativação por histórico e Proof Vault segmentado por fonte.
- Navegação mobile com cinco ações principais e menu Mais.

## Validações executadas

- `node --check isaac/js/app.js`
- `node --check isaac/js/knowledge.js`
- Busca estática por chamadas de envio automático, `wa.me`, `mailto:` e `window.open`.
- Alterações restritas a `/isaac/**`.
- Nenhuma coleção foi removida ou renomeada.
- `isaacAccess`, `isaacInstitutions` e `isaacReferrals` foram preservadas.
- Regras existentes do Firestore não foram alteradas: novos campos usam os documentos atuais.
- Bloqueio de `partnerIsaac === true` permanece no cockpit e nas filas.

## Pendências deliberadas

- Diretório nacional e enriquecimento Salvador/Lauro exigem importação verificável de INEP/e-MEC e fontes públicas. Nenhum contato foi inventado.
- A validação autenticada final depende do login Google e das regras publicadas no projeto `hub-akasha`.
- O importador nacional por UF deve entrar em fase separada para não atrasar o uso imediato das calls.

## Regra operacional

O SDR pesquisa, alcança, qualifica, aquece e agenda. Taxa, contrato e aprovação de crédito ficam com o time isaac.
