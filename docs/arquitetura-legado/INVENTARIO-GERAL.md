# Inventário geral — Arquitetura de Legado

**Auditoria:** 16/11/2026  
**Repositório:** `akashahub/AKASHAHUB`  
**Branch de auditoria:** `audit/arquitetura-legado-2026-11-16`  
**Base examinada:** `main` em `09e223a5ae83978adf0e2d00ecb1aa89d089b0c4`

## 1. Escopo e método

Foi lida a árvore completa do repositório (1.583 arquivos; árvore sem truncamento) e feita inspeção dirigida dos arquivos centrais de AF Plataforma, Firebase, cinco fases, ferramentas independentes, apoio de UX e Central do Expert. Esta é uma auditoria estática de repositório; não equivale a teste de navegador, teste de regras no Emulator, teste com contas reais nem confirmação de deploy.

### Contagem da pasta `afplataforma/`

| Tipo | Quantidade |
|---|---:|
| Arquivos totais | 656 |
| HTML | 174 |
| JavaScript | 113 |
| CSS | 52 |
| Markdown | 11 |
| TXT | 16 |
| PDF | 51 |
| Imagens JPG | 121 |
| Imagens WEBP | 75 |
| SVG | 6 |
| TSX | 15 |
| TS | 15 |
| JSON | 3 |
| Outros | 4 |

A pasta `al/` contém 64 arquivos. Os números incluem páginas de catálogo/serviços, materiais e mídia; não representam 656 aplicativos.

## 2. Estrutura principal identificada

- `afplataforma/index.html`: entrada e shell principal da plataforma.
- `afplataforma/assets/js/app.js`: orquestrador de interface, sessão, dashboard, navegação e área do mentor.
- `afplataforma/assets/js/auth.js`: sessão, autenticação e identificação de mentor.
- `afplataforma/firebase/firestore.js`: operações Firestore centralizadas para acesso, perfis, ferramentas, notas e chamadas.
- `afplataforma/firestore.rules`: regras Firestore da AF e de outras áreas do projeto.
- `afplataforma/assets/js/fases.js`: renderização de páginas/views das cinco fases e algumas views legadas.
- `afplataforma/assets/js/phase-launcher.js`: atalhos das cinco fases e apoio transversal.
- `afplataforma/assets/js/phase-guidance.js`: conteúdo orientador e critérios por fase.
- `afplataforma/assets/js/phase-checklists.js`: checklists com sincronização Firestore e estado local.
- `afplataforma/assets/js/af-apoio.js`: camada transversal de linguagem simples, quiz sequencial, cópia de pacote e painel/prompt do mentor em páginas que a carregam e chamam.
- `afplataforma/assets/js/catalogo-capacidades-data.js` + `catalogo-capacidades.js`: catálogo operacional restrito ao mentor.
- `al/central/index.html`: Central do Expert, arquivo HTML extenso de conteúdo e navegação de materiais. A inspeção não encontrou autenticação Firebase/gate de mentor nesse arquivo.
- `afplataforma/assets/js/access-admin.js`: painel administrativo de solicitações e liberação de acesso AF; a função observada é gestão de acesso, não consulta centralizada de respostas diagnósticas.
- `sessoes/index.html`: roteiro de 26 encontros e respostas.
- `sessoes/mentoria/index.html`: área de consulta/registro de sessões individuais.

## 3. O que já existe e deve ser preservado

1. Autenticação Firebase e controle de acesso AF.
2. Cinco fases com navegação, orientações, checklists e atalhos.
3. Ferramentas independentes por domínio, com identidade e fluxo próprios.
4. Coleção `afTools/{uid}/tools/{toolId}` para ferramentas operacionais compartilhadas.
5. Coleções próprias por aplicativo, por exemplo `afEssencia/{uid}`, `afIdentityStudio/{uid}`, `afBrandingPessoal/{uid}`, `afFluxoDeCaixa/{uid}`, `afSdrOs/{uid}` e outras.
6. Separação de notas do mentorando e notas privadas do mentor em coleções distintas.
7. Roteiros privados em `afMentorScripts`.
8. Camada `AfApoio`, que já fornece orientação, quiz em perguntas existentes, cópia e prompt contextual do mentor em páginas integradas.
9. Catálogo de Capacidades para uso interno do mentor.
10. Legacy Vault e organização de materiais por fase.
11. Ferramentas e conteúdos existentes de Zen Negócios e Akasha Trading.

## 4. Achados prioritários

### P0 — Segurança e exposição
- Em `firestore.rules`, `calls/{roomId}` e as subcoleções `callerCandidates` e `calleeCandidates` permitem leitura e escrita com `if true`. A regra precisa de revisão urgente e teste de compatibilidade com a chamada WebRTC antes de qualquer alteração.
- `al/central/index.html` contém `noindex,nofollow`, mas a inspeção não encontrou autenticação Firebase nem gate de mentor nessa página. Noindex não é controle de acesso. Confirmar exposição real no hosting e proteger o conteúdo interno se a rota for restrita.
- `legado_profiles/{uid}` permite leitura a qualquer usuário autenticado, não apenas ao dono/mentor. Confirmar se os campos armazenados podem ser privados.
- O texto e o pacote de privacidade injetados por `af-apoio.js` afirmam que somente o usuário acessa os dados, enquanto as regras autorizam mentores AF a ler várias coleções de respostas. O texto deve refletir a permissão real.
- O pacote de cópia atual inclui rótulos/opções e uma resposta por campo, mas ainda precisa ser testado contra todos os campos dinâmicos e seleções individuais para cumprir o requisito de exportar integralmente perguntas e respostas.

### P1 — Integridade e persistência
- Mesa da Essência, Formulário de Marca e Anamnese curta usam armazenamento local conforme o mapa de experiência; não são ainda um histórico portátil/centralizado no Firestore.
- Dossiê vivo do mentor em `legado-mentor.js` declara explicitamente que não grava no servidor e guarda no aparelho.
- Zen Negócios informa na própria página que exercícios, checklist, lista de observação e calculadora ficam no navegador; dados de diagnóstico/mapa/continuidade são rascunhos locais.
- `sessoes/mentoria/index.html` grava em `encontros/{clienteUID}/sessoes/{num}`; não foi localizada regra `match /encontros` no arquivo de regras examinado. Validar se esse caminho está negado pelas regras atuais ou se existe outra política/ambiente.
- O fluxo de ferramentas tem mais de um padrão de persistência: coleção própria por app, `afTools`, `mentorias/{uid}/checklists/fases`, `mentoria_respostas` e localStorage. É necessário consolidar sem migração destrutiva.

### P1 — Coerência funcional
- `fases.js` contém renderizadores legados com conteúdo simplificado/“Em evolução” e binders vazios em várias views. Isso não prova que a ferramenta independente equivalente esteja quebrada; é preciso ligar menu, view e rota independente corretamente.
- O Dashboard do Mentor em `app.js` apresenta ferramentas internas e inclui `renderAccessAdminPanel()`. O painel `access-admin.js` acompanha tentativas e administra acesso/plano/módulos, mas não foi encontrado ali um seletor de mentorando com leitura dos diagnósticos das ferramentas.
- A orientação de Fase 4 em `phase-guidance.js` declara SDR OS, Treinamento e Closers OS em construção; há páginas independentes SDR OS e Treinamento, enquanto Closers OS completo não foi confirmado na árvore examinada. Atualizar a documentação após teste funcional, não apenas por existência de arquivo.
- `/al/central` é uma biblioteca de conteúdo do expert, não foi confirmada como painel operacional conectado a dados de mentorandos.

## 5. Limites e próximos testes

Ainda faltam: inspeção de todos os 174 HTML e 113 JS; teste de cada rota; teste de login com mentor/mentorando; testes automatizados de Firestore Rules; verificação de deploy/hosting; validação real do Google Drive; e teste ponta a ponta da IA. Não declarar a auditoria completa até concluir esses itens.
