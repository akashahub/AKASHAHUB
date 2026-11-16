# VISION STUDIO — fundação

## Entrada e autenticação
- A entrada aparece dentro de Complementar → Meditação.
- O módulo usa a sessão já autenticada da AF Plataforma (`session.uid`).
- Não cria um segundo login nem altera permissões de acesso da AF.

## Persistência Firestore
Projetos por usuário:
- `visionStudioProjects/{uid}/projects/{projectId}`
- Cada documento contém `ownerId`, nome, tipo, objetivo, prazo, localização, orçamento, terreno, ambientes, características e timestamps.
- O primeiro acesso cria um projeto de referência `REFÚGIO 777` para aquele usuário, sem localização ou preço inventado.

Catálogos preparados por usuário:
- `visionStudioUsers/{uid}/catalogs/regionalPrices`
- `visionStudioUsers/{uid}/catalogs/landListings`
- `visionStudioUsers/{uid}/catalogs/materials`
- `visionStudioUsers/{uid}/catalogs/constructionCosts`

Os catálogos começam vazios e incluem campos para fonte, data de referência e confiabilidade. Nenhuma cotação fictícia é exibida.

## Segurança
O arquivo `firestore.rules` contém regras para permitir leitura e escrita apenas ao UID proprietário nos caminhos do Vision Studio. As regras não concedem acesso às coleções da AF e não alteram regras existentes.

**Atenção para publicação:** este repositório não contém um `firebase.json` de implantação de regras. Depois de revisar/mesclar a branch, publicar o conteúdo atualizado de `afplataforma/firestore.rules` nas regras do Firestore do projeto Firebase `hub-akasha`. Até a publicação das regras, a interface pode carregar, mas a persistência será recusada pelas regras atualmente ativas.

## Limites desta entrega
- Dashboard, cadastro, edição e exclusão de projetos.
- Projeto de referência protegido contra exclusão.
- Seis módulos apresentados como estrutura preparada, ainda sem motores especializados.
- Sem consulta de preços, geoprocessamento, editor de plantas ou renderização 3D nesta etapa.
- A meditação permanece intacta; apenas recebe um cartão de entrada para o novo ambiente.

## Validação antes de produção
1. Entrar com conta autorizada na AF.
2. Abrir Complementar → Meditação → Vision Studio.
3. Confirmar criação do REFÚGIO 777 e dos quatro catálogos.
4. Criar, editar e excluir um projeto de teste.
5. Entrar com outro UID e confirmar que não consegue ler os projetos do primeiro.
6. Publicar as regras Firestore e repetir os testes em produção.
