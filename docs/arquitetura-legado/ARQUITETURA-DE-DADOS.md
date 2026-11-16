# Arquitetura de dados — estado observado e direção

## 1. Estado observado

A AF Plataforma usa Firebase Authentication e Firestore. O código contém vários padrões de persistência e não há um único registro consolidado que reúna, de forma demonstrada, todas as respostas e decisões de cada mentorando.

### Coleções/caminhos observados no código e nas regras

| Caminho | Uso observado | Acesso observado nas regras |
|---|---|---|
| `users/{uid}` | Perfil do usuário | próprio usuário lê/escreve; mentor AF lê |
| `afAccess/{uid}` | Liberação de acesso AF | próprio usuário e mentor leem; mentor escreve |
| `afAccessRequests/{uid}` | Solicitação/status de acesso | próprio usuário e mentor leem; regras de criação/atualização específicas |
| `afTools/{uid}/tools/{toolId}` | Ferramentas operacionais | usuário com acesso AF lê/escreve seus dados; mentor AF lê/escreve |
| `afMenteeNotes/{uid}/calls/{callId}` | Notas do mentorando por call | mentorando com acesso lê/escreve; mentor lê |
| `afMentorNotes/{menteeUid}/calls/{callId}` | Notas privadas do mentor | mentor AF apenas |
| `afMentorScripts/{moduleId}` | Roteiros privados | mentor AF apenas |
| `afCalls/{callId}` | Registro de chamadas | mentor cria/atualiza; mentor e participantes autorizados leem |
| `afPresence/{uid}` | Presença | regras por UID/acesso AF |
| `mentoria_respostas/{uid}/dados/{doc}` | Respostas do roteiro de Sessões | dono lê/escreve; mentor AF lê |
| `mentorias/{uid}/checklists/fases` | Checklists das fases | caminho usado pelo helper; regra de mentoria permite dono e leitura do mentor |
| `afEssencia/{uid}`, `afIdentityStudio/{uid}`, `afBrandingPessoal/{uid}`, `afFluxoDeCaixa/{uid}`, `afCrmInteligente/{uid}`, `afSdrOs/{uid}` e coleções similares | Dados de aplicativos independentes | dono lê/escreve; mentor AF lê nos blocos correspondentes |
| `visionStudioProjects/{uid}/projects/{projectId}` | Projetos Vision Studio | dono conforme UID |
| `encontros/{clienteUID}/sessoes/{num}` | Sessões individuais, caminho usado em `sessoes/mentoria/index.html` | não foi localizada regra correspondente `match /encontros` no arquivo inspecionado; verificar bloqueio/ambiente |

### Persistência local observada

- `afplataforma/assets/js/storage.js` encapsula localStorage para cache/fallback e dados locais.
- `tools.js` salva localmente e tenta persistir em `afTools`.
- `phase-checklists.js` faz hidratação/mesclagem com Firestore em `mentorias/{uid}/checklists/fases`.
- Mesa da Essência e Formulário de Marca possuem chaves locais próprias conforme `EXPERIENCIA-DO-MENTORANDO-MAPA.md`.
- Dossiê vivo de gestão do mentor declara armazenamento local, sem gravação no servidor.
- Zen Negócios declara explicitamente rascunhos e progresso no navegador.
- A ferramenta Entregas declara estado local em `localStorage`.

LocalStorage pode continuar como cache/rascunho temporário, mas não pode ser a fonte oficial de respostas que o usuário espera recuperar em outro dispositivo.

## 2. Coleções de aplicativos sem regra explícita encontrada

Na amostra dos 20 apps, 11 usam `setDoc` em coleções próprias que não aparecem como `match` no arquivo `afplataforma/firestore.rules`: `afSdrOs`, `afIaStudio`, `afAppBuilder`, `afPrecificacao`, `afFunilBuilder`, `afFluxoDeCaixa`, `afWebsiteStudio`, `afCrmInteligente`, `afProdutosDigitais`, `afCentralAtivos` e `afIndicadoresFinanceiros`. Não presumir que o salvamento funcione: Firestore nega por padrão quando não há regra correspondente. Confirmar se o arquivo no repositório é o mesmo publicado no Console e se existe alguma regra externa. Se não existir, decidir entre adicionar regras de proprietário + mentor ou adaptar o app ao caminho `afTools/{uid}/tools/{toolId}` sem perder dados.

## 3. Achado de hidratação em aplicativos com coleção própria

Foi inspecionada uma amostra de 20 módulos que integram `AfApoio.mount`: Essência, Identity Studio, Branding Pessoal, Marketing Pessoal, Liderança, Comunicação, Constelação Familiar, Registros Akáshicos, Authority Leadership OS, Website Studio, App Builder, IA Studio, CRM Inteligente, Funil Builder, Produtos Digitais, Central de Ativos, Fluxo de Caixa, Precificação, Indicadores Financeiros e SDR OS. Os módulos usam `setDoc(doc(db, COL, currentUser.uid), ...)` para gravar, mas a leitura de seus scripts não revelou `getDoc`/`onSnapshot` nem rotina de hidratação equivalente. O callback de autenticação atribui `currentUser` e chama `render()`; o objeto `data` começa vazio. Tratar como provável falha de retomada entre sessões até teste real confirmar.

**Correção recomendada:** adicionar leitura do mesmo documento por UID após autenticação, mesclar apenas campos conhecidos, lidar com erro/offline e só então renderizar os dados. Fazer primeiro em um app piloto, testar conta própria, conta de outro usuário e mentor autorizado; depois replicar com revisão individual. Não mudar a coleção nem o formato dos documentos existentes.

## 4. Arquitetura-alvo recomendada (aditiva)

Criar um envelope comum de registro, sem obrigar a migração imediata de todos os apps:

```text
mentorandos/{menteeUid}
  perfil
  empresas/{companyId}
  jornadas/{journeyId}
    respostas/{responseId}
    decisoes/{decisionId}
    projetos/{projectId}
    entregaveis/{assetId}
    timeline/{eventId}
```

Separar conteúdo e permissão:
- **Resposta do mentorando:** resposta original, pergunta, opção escolhida, texto livre, estado de conclusão, origem da ferramenta e timestamp.
- **Nota privada do mentor:** leitura, hipótese, observação e preparação interna, sem aparecer para o mentorando.
- **Decisão compartilhada:** decisão aprovada pelo mentorando/mentor, com responsável, data e contexto.
- **Projeto executivo:** necessidade, escopo, prioridade, etapas, dependências, entregáveis, critérios de aceite, status e histórico.
- **Ativo entregue:** metadados, versão, link seguro, fase, projeto, data e visibilidade.

O envelope comum deve referenciar o registro original e não copiar indiscriminadamente todo o conteúdo sensível para várias coleções.

## 5. Identificadores e rastreabilidade

Todo registro novo deve conter, quando aplicável:
- `menteeUid` (UID autenticado, nunca recebido cegamente do cliente);
- `companyId`;
- `journeyId`;
- `phaseId` (fase 1–5);
- `toolId`;
- `sourceCollection` e `sourceDocumentId`;
- `createdAt`, `updatedAt`;
- `createdByUid`, `updatedByUid`;
- `visibility` (mentee, mentor_private, shared);
- `schemaVersion`.

Não colocar credenciais, senhas, tokens, dados bancários completos ou segredos de infraestrutura em formulários ou documentos de diagnóstico.

## 6. Salvamento e sincronização

1. Salvar no caminho existente do aplicativo, respeitando seu contrato atual.
2. Adicionar sincronização com um índice/resumo consolidado somente depois de definir idempotência e origem.
3. Não fazer dual-write silencioso sem estratégia de recuperação.
4. Manter fila local de rascunho apenas como contingência, com estado claro de sincronização.
5. Mostrar “Salvo na nuvem”, “Salvando” ou “Não foi possível salvar”; nunca indicar sucesso antes da confirmação do Firestore.
6. O botão copiar deve exportar a pergunta original, a resposta, as escolhas, observações e resultado; copiar não substitui persistência.

## 7. Arquivos e Google Drive

O Firestore deve guardar metadados e permissões, não binários grandes. Arquivos devem usar Firebase Storage ou Google Drive com integração OAuth/backend validada. Não simular upload. Cada ativo precisa de proprietário, visibilidade, versão, projeto, fase e URL/caminho controlado.

## 8. Migração

- Inventariar chaves locais e coleções existentes.
- Definir transformadores idempotentes por ferramenta.
- Não apagar localStorage após uma tentativa de envio.
- Verificar igualdade de contagem/hash/estrutura antes de marcar migração concluída.
- Manter backup e plano de rollback.
- Migrar em lotes pequenos, com validação por usuário e ferramenta.
