# VISION STUDIO — Fundação

Módulo independente do Akasha Hub, acessado inicialmente pela área **Meditação** da AF Plataforma.

## Arquivos

- `index.html`: entrada independente em `/vision-studio/`.
- `app.js`: autenticação compartilhada, dashboard, CRUD de projetos e registros de referência.
- `styles.css`: interface responsiva.
- A entrada da área Meditação fica em `afplataforma/assets/js/complementar.js`.
- Regras propostas ficam no arquivo-fonte `afplataforma/firestore.rules`.

## Integração

- Reutiliza a instância Firebase exportada por `afplataforma/firebase/firebase-config.js`.
- Reutiliza o Firebase Authentication já existente. Não cria um segundo provedor de identidade.
- Persiste os dados em coleções próprias do Vision Studio, sem misturar com coleções da AF.
- Os projetos são isolados por UID.

## Modelo inicial de dados

```
visionStudioProjects/{uid}/
  settings/profile
  projects/{projectId}
    references/{referenceId}
```

Campos principais do projeto:
- `ownerUid`, `name`, `category`, `description`
- `country`, `region`, `location`, `landArea`, `dimensions`, `terrain`
- `environments`, `goals`, `features`
- `budget`, `deadline`, `status`, `modules`
- `createdAt`, `updatedAt`, `isDemo`, `dataSchemaVersion`
- `futureIntegrations.meditationGeneration` e `futureIntegrations.voiceNarration` (reservados como integrações futuras)

Campos principais das referências:
- `ownerUid`, `type`, `item`, `value`, `unit`, `region`
- `source`, `referenceDate`, `confidence`
- `createdAt`, `updatedAt`

Valores de preço não são importados nem apresentados como cotação real nesta fundação. Cada referência precisa de fonte, unidade, região, data e nível de confiabilidade.

## Projeto de referência REFÚGIO 777

Na primeira entrada de uma conta sem projetos, o sistema cria uma estrutura demonstrativa sem localização, dimensões ou preços inventados. Um marcador de inicialização impede que o projeto seja recriado se o usuário decidir excluí-lo.

## Segurança e publicação

1. Publicar as regras Firestore atualizadas antes de liberar gravações em produção.
2. Confirmar que o domínio `akashahub.com.br` está autorizado no Firebase Authentication.
3. Testar login por e-mail e Google, criação/edição/exclusão de projeto e isolamento entre duas contas.
4. Confirmar que a hospedagem está publicando a pasta `vision-studio/` na rota `/vision-studio/`.

A cópia das regras neste repositório é uma fonte de configuração; a alteração do arquivo, por si só, não publica as regras no projeto Firebase.
