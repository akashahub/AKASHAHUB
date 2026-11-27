# Cadastro Inteligente · Especificação da primeira entrega

## Objetivo

Criar um perfil central do participante, conectado ao AF Plataforma, que reúna dados pessoais, negócios e projetos sem misturar contextos automaticamente. O preenchimento é progressivo: campos opcionais, salvamento de rascunho e edição posterior.

## Experiência entregue

- No primeiro acesso autorizado à AF Plataforma, o participante recebe um convite para começar o cadastro.
- Pode começar ou escolher “Fazer depois”; se adiar, o convite não reaparece automaticamente, mas a área continua disponível no menu.
- A nova área “Meu cadastro” fica no menu da plataforma.
- O perfil básico existente continua preservado.
- O formulário organiza nove áreas:
  1. Identidade do empreendedor.
  2. Identidade da empresa.
  3. Posicionamento e marca.
  4. Operação e equipe.
  5. Estrutura financeira.
  6. Império digital.
  7. Produtos e comercial.
  8. Expansão e oportunidades.
  9. Patrimônio e legado.
- O participante pode manter até 10 negócios ativos e 25 projetos ativos nesta primeira versão. Arquivar preserva os dados.
- Cada projeto pode ser vinculado a um negócio ou permanecer independente.

## Persistência V1

Por compatibilidade com o perfil e as permissões já existentes, a primeira versão grava o objeto `afDossier` dentro de `users/{uid}`, usando atualização com merge. Não substitui os campos de perfil existentes.

Estrutura lógica:

- `afDossier.personal`
- `afDossier.businesses[]`
- `afDossier.projects[]`
- `afDossier.sharing`
- `afDossier.onboarding`
- `afDossier.schemaVersion`

Limites iniciais: 250 caracteres para campos curtos e 1.500 para campos longos. O cadastro não armazena arquivos ou imagens pesadas.

## Ficha Única do Projeto

A Biblioteca de Prompts mantém os três escopos separados:

- Pessoal.
- Empresarial.
- Híbrido.

Os contextos são gravados em documentos distintos na subcoleção já utilizada pela Ficha Única:

- `principal-personal`, `principal-business`, `principal-hybrid`.
- `business-{businessId}-{scope}` para contexto ligado a um negócio.
- `project-{projectId}-{scope}` para contexto específico de um projeto.

O documento legado `principal` continua sendo lido como fallback do escopo híbrido. Não é apagado.

A importação do Cadastro Inteligente:
- exige seleção explícita do escopo;
- permite escolher negócio e projeto;
- impede combinar um projeto com negócio diferente daquele ao qual está vinculado;
- preenche somente variáveis vazias, preservando o que foi digitado manualmente;
- inclui a origem do dado no texto importado;
- não salva automaticamente: o usuário revisa e confirma.

Ao carregar dados do Dossiê em um prompt, as fontes são filtradas por escopo. Dados de projeto permanecem como contexto específico; dados pessoais e empresariais só se combinam no escopo híbrido.

## Privacidade

- O compartilhamento começa desativado.
- As preferências de compartilhamento são registradas, mas não publicam dados nem ativam uma rede.
- Informações financeiras são opcionais.
- A primeira versão não cria perfis públicos, páginas de rede ou divulgação automática.
- A leitura do Dossiê do participante foi conectada à visão do mentor e à Ficha Única, respeitando a seleção do participante/UID já utilizada pela plataforma.

## Integração administrativa

- `/admin/perfis/` mostra status do cadastro e quantidade de negócios e projetos.
- A visão “Diagnóstico e dossiê” passa a incluir as informações pessoais, empresariais e de projeto do Cadastro Inteligente.

## Fora do escopo desta primeira entrega

- Publicação de perfil na rede social do Akasha Hub.
- Permissões públicas por campo com aplicação em endpoints de compartilhamento.
- Upload e gestão documental.
- Migração de negócios e projetos para subcoleções independentes.
- Edição administrativa dos campos do participante.
- Sincronização de dados com serviços externos.

## Próxima validação

1. Entrar com uma conta autorizada e confirmar o convite no primeiro acesso.
2. Criar perfil pessoal, dois negócios e projetos vinculados a cada negócio.
3. Salvar, sair, entrar em outro dispositivo e conferir persistência.
4. Testar arquivo de negócio/projeto sem perda de histórico.
5. Testar importação pessoal, empresarial e híbrida na Ficha Única.
6. Confirmar que um projeto não recebe dados de outro negócio.
7. Verificar o Dossiê do mentor e o resumo em `/admin/perfis/`.
8. Auditar as regras Firestore antes de migrar o armazenamento para subcoleções ou ampliar permissões.
