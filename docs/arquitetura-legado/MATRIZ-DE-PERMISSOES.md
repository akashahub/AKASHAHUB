# Matriz de permissões e segurança

**Arquivo-base:** `afplataforma/firestore.rules` (SHA na base: `0f70c0734f672bd665adb8830365fe37b521cceb`).

## 1. Papéis previstos

| Papel | Pode ver | Não pode ver |
|---|---|---|
| Mentorando | Perfil próprio, respostas próprias, notas próprias, decisões/entregas compartilhadas | dados de outros mentorandos; notas privadas do mentor; prompts internos |
| Mentor autorizado | dados dos mentorandos autorizados pela política vigente, notas e ferramentas operacionais previstas | credenciais e dados sem necessidade; administração global se não for admin |
| Administrador | gestão e configurações administrativas conforme papel explicitamente concedido | segredos de autenticação/infraestrutura que não sejam necessários |
| Visitante sem login | apenas conteúdo público explicitamente destinado ao público | AF Plataforma, respostas, ferramentas privadas e Central do Expert restrita |

## 2. Regras existentes relevantes

- `isAfMentor()` reconhece o UID principal e os quatro Gmail configurados no arquivo de regras.
- `hasAfAccess(uid)` exige que o usuário seja o próprio UID e tenha `afAccess/{uid}` aprovado e ativo.
- `afTools/{uid}/**`: dono com acesso AF e mentor AF podem ler/escrever.
- `afMenteeNotes/{uid}/**`: dono com acesso AF lê/escreve; mentor AF lê.
- `afMentorNotes/**` e `afMentorScripts/**`: somente mentor AF.
- Coleções próprias de alguns aplicativos autorizam leitura/escrita do próprio UID e leitura pelo mentor AF.
- `mentoria_respostas/{uid}/dados/{doc}`: dono lê/escreve; mentor AF lê.

## 3. Riscos e incompatibilidades encontrados

### Crítico — sinalização WebRTC aberta
`calls/{roomId}`, `callerCandidates/{c}` e `calleeCandidates/{c}` permitem leitura e escrita públicas (`if true`). Não alterar sem teste de compatibilidade, mas tratar como prioridade de segurança. Restringir a participantes/autorizados e validar payloads.

### Alto — Central do Expert sem gate verificado
`al/central/index.html` contém `noindex,nofollow`, mas não foi encontrado Firebase Auth, verificação de mentor ou gate de servidor no arquivo. Noindex é apenas orientação a robôs de busca; não impede acesso direto por URL. Confirmar hosting e restringir conteúdo interno.

### Alto — perfis Legado
`legado_profiles/{uid}` permite leitura por qualquer usuário autenticado. Confirmar se os documentos contêm informações pessoais e alterar para dono/mentor/admin com teste de regressão.

### Alto — declaração de privacidade inconsistente
`af-apoio.js` injeta a mensagem “Só você tem acesso”, enquanto regras permitem leitura do mentor AF em várias coleções. O texto não descreve o acesso real. Usar mensagem transparente: “Suas respostas ficam vinculadas à sua conta. Você e os mentores/administradores autorizados podem acessá-las conforme as permissões da plataforma.”

### Alto — sessões individuais
O app `sessoes/mentoria/index.html` usa `encontros/{clienteUID}/sessoes/{num}`; não foi encontrada regra correspondente em `afplataforma/firestore.rules`. Testar a leitura/escrita e decidir a regra correta antes de integrar o histórico.

### Médio — leitura ampla de filas/presença
Revisar `matchQueue`, `presence`, `salas_live/participantes`, `legacyVault` e documentos de perfil para garantir que os dados expostos sejam estritamente necessários.

## 4. Requisitos obrigatórios para a nova camada do mentor

1. Não confiar em Gmail digitado no frontend, variável JavaScript ou componente oculto.
2. Usar identidade Firebase verificada e autorização no Firestore Rules/backend.
3. Separar `mentee`, `mentor` e `admin` em claims ou fonte confiável controlada pelo servidor.
4. Se a política continuar baseada em allowlist Gmail, manter uma única fonte de verdade e validar e-mail verificado; não duplicar listas divergentes em vários arquivos.
5. Notas privadas do mentor em caminho separado, inacessível ao mentorando.
6. Decisões compartilhadas explicitamente marcadas.
7. Validar UID, tipo, tamanho e campos permitidos em create/update.
8. Testar acesso permitido e negado com Firebase Emulator.
9. Revisar todos os caminhos existentes antes de adicionar regras; lembrar que regras Firestore são aditivas quando múltiplos matches concedem acesso.
10. Não publicar prompts, documentos internos ou dados de outros mentorandos no HTML estático.

## 5. Matriz mínima de testes

| Cenário | Resultado esperado |
|---|---|
| Mentorando A lê resposta A | permitir |
| Mentorando A lê resposta B | negar |
| Mentorando A altera nota privada do mentor | negar |
| Mentorando A consulta prompt interno | negar |
| Mentor autorizado lê resposta do mentorando atribuído | permitir conforme política |
| Gmail não autorizado tenta abrir painel do mentor | negar no backend e nas regras |
| Usuário deslogado consulta qualquer dado privado | negar |
| Admin altera configuração administrativa | permitir somente com papel admin |
| Participante não autorizado lê sinal WebRTC | negar após correção das regras |
