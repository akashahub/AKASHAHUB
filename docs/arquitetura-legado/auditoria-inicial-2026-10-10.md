# Auditoria inicial — Arquitetura de Legado e Plataforma AL

Data da auditoria: 2026-10-10  
Repositório: `akashahub/AKASHAHUB`  
Base inspecionada: `main`  
Branch de trabalho: `plan/arquitetura-legado-central-zoom`

## Estado observado nos arquivos consultados

### Central do Expert — `al/central/index.html`
- Página HTML extensa, com conteúdo de método, oferta/pitch, preparação de calls, objeções, prospecção, conteúdo, treinamento e operação.
- A navegação já contém um módulo **Zoom Secreto** com roteiro de 90 minutos, preparação, falas, captação e pós-aula.
- A Central também inclui links para a apresentação de vendas, teleprompter e outros recursos.
- O código da Central monta os módulos a partir de dados JavaScript e atualiza a visualização por hash.
- Alguns conteúdos da Central descrevem ofertas, preços e condições específicos. Não foram alterados nesta etapa.

### Arquitetura de Legado — `al/index.html`
- A página já apresenta a Arquitetura de Legado como integração e inclui referência à jornada de doze meses.
- A página contém uma seção de apresentação e encaminha para `al/apresentacao/`.
- Não foi feita alteração na página pública nesta etapa.

### Teleprompter — `al/teleprompt/index.html`
- Página própria com script externo `./denso.js`.
- O arquivo contém estrutura de conteúdo dinâmica; a inspeção inicial não autoriza substituir ou reescrever os roteiros existentes.
- Não foi alterado nesta etapa.

### Treinamento comercial — `afplataforma/treinamento/index.html`
- Já contém as áreas Mapa da call, O que mostrar na tela, Referências, Está apto? e Formação do operador.
- Carrega scripts e estilos do sistema de fechamento e treinamento.
- Não foi alterado nesta etapa.

## Decisões de segurança

- A transição AF → AL deve ser progressiva. Não renomear diretórios, tabelas, chaves de armazenamento, APIs ou identificadores sem mapa de dependências.
- O acervo AF deve continuar acessível enquanto a navegação AL é organizada.
- A jornada de 12 meses é uma referência de organização e deve ser confrontada com os materiais autorais antes de ser fixada como cronograma universal.
- Conteúdo de clientes, dossiês e notas não deve ser exposto publicamente.
- Alegações, números, preços, depoimentos e referências devem ser confirmados antes de apresentações externas.

## Primeira entrega implementada nesta branch

- Criada a página `al/central/apresentacoes/index.html` com oito modelos iniciais:
  1. Apresentação institucional curta.
  2. Pitch de vendas.
  3. Palestra para universidades.
  4. Estrutura acadêmica/TCC.
  5. Apresentação para parceiros.
  6. Apresentação para patrocinadores.
  7. Apresentação-mãe da Arquitetura de Legado.
  8. Roteiro de aula ao vivo/Zoom.
- Cada modelo inclui público, objetivo e estrutura-base de slides.
- Os roteiros são editáveis no navegador, podem ser exportados em Markdown e impressos/salvos em PDF.
- Rascunhos são armazenados apenas no `localStorage` do navegador; não há sincronização remota nesta versão.
- Adicionado link da biblioteca à navegação da Central do Expert.

## Limitações ainda não verificadas

- Não foi executado teste visual em navegador nem confirmação de deploy.
- A biblioteca não gera arquivo PowerPoint (.pptx) nesta versão.
- O salvamento é local ao navegador, não compartilhado entre mentor e equipe.
- A auditoria ainda não cobre cada rota, função, integração, permissão ou recurso da plataforma AF.
- A definição do método A.C.E.S.S.O. e a sequência final da jornada devem ser comparadas com os materiais originais antes de alterar páginas de venda ou módulos de operação.

## Próxima sequência recomendada

1. Revisar a biblioteca de apresentações e validar a apresentação-mãe.
2. Auditar os diretórios e dependências da Plataforma AF antes de propor a nova navegação AL.
3. Comparar o roteiro existente de Zoom Secreto com a necessidade de uma biblioteca de aulas reutilizável, evitando duplicar funções.
4. Auditar os dados e a estrutura do teleprompter antes de acrescentar novos formatos.
5. Implementar as próximas mudanças em PRs pequenos, com testes documentados.
