# Plano de implementação — execução segura por lotes

## Princípios não negociáveis

- Integridade primeiro; mudanças aditivas.
- Não substituir apps existentes por formulários genéricos.
- Não apagar funcionalidades, regras, rotas ou coleções.
- Não fazer deploy nem alterar produção durante a fase de auditoria.
- Cada lote termina com diff revisado, teste e registro de rollback.
- Distinguir código publicado no GitHub de código efetivamente implantado no domínio.

## Lote 0 — Concluir inventário (em andamento)
- [x] Árvore completa do repositório e contagem de arquivos.
- [x] Inspeção dos arquivos centrais AF/Firebase.
- [x] Inspeção dirigida de ferramentas representativas das cinco fases.
- [x] Revisão inicial das regras Firestore.
- [ ] Inspecionar todos os HTML/JS restantes e mapear dependências.
- [x] Preparar piloto de hidratação em Essência OS, sem alterar schema/coleção.
- [ ] Testar piloto com conta real/Emulator antes de replicar nos outros 19 apps.
- [ ] Confirmar cobertura do helper AfApoio por aplicativo.
- [ ] Verificar deploy/hosting e fluxos reais no navegador.

**Saída:** mapa funcional por ferramenta, estado real, persistência, permissão e dependências.

## Lote 1 — Segurança antes de centralizar
- Revisar regras abertas de WebRTC e testar com Emulator.
- Conferir no Console se as regras publicadas correspondem ao arquivo versionado.
- Resolver as 11 coleções de apps sem `match` explícito antes de considerar os formulários confiáveis para autosave.
- Proteger Central do Expert se for conteúdo interno.
- Corrigir leitura ampla de perfis e filas após confirmar necessidade.
- Alinhar texto de privacidade com regras reais.
- Verificar regras de `encontros`.
- Criar testes automatizados de leitura/escrita permitida e negada.

## Lote 2 — Recuperação de dados e contrato comum
- Criar piloto de hidratação Firestore em um app existente, começando por Essência OS.
- Ler `COL/{uid}` após login, mesclar campos conhecidos e manter timestamps fora do formulário.
- Testar reabertura, atualização, offline, conta A/B e mentor autorizado.
- Replicar somente após aprovação do piloto nos demais módulos com o mesmo padrão.
- Definir schema de resposta, decisão, nota privada, projeto e ativo.
- Definir schema de resposta, decisão, nota privada, projeto e ativo.
- Mapear cada app para sua coleção atual.
- Criar adaptadores sem mover dados existentes.
- Definir UID, empresa, jornada, fase, ferramenta e origem.
- Criar plano de migração para localStorage com idempotência e rollback.

## Lote 3 — Experiência do mentorando
- Padronizar aviso de privacidade verdadeiro.
- Garantir autosave cloud e estado de sincronização.
- Retomar de outro dispositivo.
- Exportar pacote completo por ferramenta.
- Preservar respostas e permitir texto livre.

## Lote 4 — Quiz e orientação
- Corrigir o ciclo de vida de `AfApoio.mount` para inserir privacidade uma vez e avaliar o gate do mentor a cada render autenticado.
- Corrigir/resetar o marcador `data-af-quiz` quando o conteúdo do modal for reconstruído; testar abrir e fechar várias descobertas em sequência.
- Auditar AfApoio e os apps que o chamam.
- Melhorar perguntas complexas com alternativas simples e exemplos.
- Preservar a pergunta original.
- Incluir “já decidi”, “não sei” e “quero conversar”.
- Testar teclado, acessibilidade, mobile e respostas já preenchidas.

## Lote 5 — Painel real do mentor
- Criar lista de mentorandos atribuídos.
- Consultar respostas Firestore autorizadas.
- Separar dados originais, hipóteses, notas privadas e decisões compartilhadas.
- Não depender de pacote WhatsApp como fonte de verdade.
- Registrar auditoria de acesso e alterações relevantes.

## Lote 6 — Motor executivo e biblioteca de prompts
- Catálogo de prompts com versão e permissões.
- Interpretação assistida e plano de execução.
- Projetos, tarefas, dependências, critérios de aceite e status.
- Aprovação humana obrigatória.
- Vincular resultados aos aplicativos de origem.

## Lote 7 — Central do Expert
- Distinguir biblioteca de conteúdo de painel operacional.
- Adicionar gate de acesso se necessário.
- Integrar visão de mentorando, fases, diagnósticos, projetos e entregas.
- Preservar materiais e documentos já existentes.

## Lote 8 — Ativos e Drive
- Definir OAuth/integração segura.
- Criar metadados e permissões de arquivos.
- Organizar por mentorando, fase e projeto.
- Testar criação, leitura, compartilhamento e revogação.

## Lote 9 — Validação ponta a ponta
- Mentorando A e B, mentor autorizado, admin e usuário não autorizado.
- Testes de isolamento de dados.
- Testes em desktop e mobile.
- Teste de falha/offline e retomada.
- Teste de cópia/WhatsApp.
- Teste de projeto e entrega.
- Teste de regressão em todas as rotas afetadas.

## Critério de conclusão

Um lote só pode ser marcado como concluído quando houver:
1. arquivos e funções identificados;
2. alteração mínima e revisável;
3. testes executados e resultados registrados;
4. nenhuma regressão conhecida;
5. documentação atualizada;
6. autorização explícita para deploy quando houver impacto em produção.
