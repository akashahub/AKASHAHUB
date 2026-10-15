# Auditoria operacional inicial — Arquitetura de Legado
Data: 2026-10-15
Escopo: primeira varredura estrutural do repositório AKASHAHUB, com foco em AF Plataforma e AL Plataforma.
Status: inventário inicial; não declarar auditoria completa até testar cada tela, formulário, persistência e permissões.

## Modelo operacional em validação
- Jornada de 12 meses.
- 24 encontros coletivos online em ciclos recorrentes.
- 3 encontros executivos individuais: (1) Essência + definição e início do Império Digital; (2) revisão de entregas + alinhamento financeiro + plano de expansão; (3) vendas, processos, automação, equipe e legado.
- 3 imersões presenciais de 2 dias, com objetivos e entregáveis ainda a detalhar.
- As cinco fases ficam disponíveis desde a entrada; diagnóstico individual determina prioridade.
- O processo executivo inclui trabalho entre reuniões e precisa de escopo, prazo, aprovação e limites de entrega por projeto.

## Arquivos e módulos identificados
- `afplataforma/index.html`: autenticação e entrada da plataforma, título já apresentado como AL Plataforma, mas texto de login ainda descreve a área operacional de Alinhamento Financeiro.
- `afplataforma/data/modules.js`: sete módulos e materiais da AF.
- `afplataforma/data/mentor-scripts.js`: roteiros de mentor para os módulos.
- `afplataforma/firebase/firestore.js` e `afplataforma/firestore.rules`: operações de Firestore, acessos e regras; revisar toda coleção de formulários antes de ampliar acesso.
- `afplataforma/complementar/anamnese.html`: anamnese de Arquitetura de Essência; explicitamente salva em localStorage, sem envio automático.
- `afplataforma/complementar/encontros.html`: biblioteca de encontros e roteiros; precisa ser classificada por audiência, tema, duração, saída e privacidade.
- `afplataforma/entregas/`: Central de Entregas do mentor.
- `afplataforma/fechamento/`: roteiro de fechamento de call e material comercial.
- `afplataforma/ascensao/`, `oratoria/`, `treinamento/`, `sdr/`, `mesa/`: recursos complementares para diagnóstico, expressão, treinamento, prospecção, negociação e decisões.
- `afplataforma/interno/`: modelo de dossiê de essência, documento mestre, contrato, roteiros, teleprompters, apresentações, pitch, plano editorial e materiais de vendas.
- `alplataforma/app.js`: cinco fases + Tecnologia da Alma; registros, notas e checklists são atualmente armazenados no localStorage local do navegador.
- `alplataforma/{essencia,imperio,financeiro,expansao,legado,alma}/`: páginas das fases.

## Lacunas confirmadas nesta primeira leitura
1. Formulários que usam localStorage não são automaticamente visíveis ao mentor ou sincronizados entre dispositivos.
2. Ainda não existe uma regra universal demonstrada para copiar perguntas + respostas e preparar mensagem de WhatsApp em todos os formulários.
3. Não assumir que a AL Plataforma local seja um prontuário compartilhado: registros locais não são backend compartilhado.
4. A execução precisa conectar formulário → síntese do mentor (relato/hipótese/decisão) → escopo → entrega → aprovação → próximos passos.
5. Os três encontros individuais são um desenho operacional novo a validar contra contrato/documento mestre, sem apagar a estrutura contratual existente até revisão.
6. Diferenciar material de aluno, roteiro privado do mentor e ferramenta de uso durante a call.
7. Catalogar o escopo executivo por categoria de negócio: serviços, produtos, mentoria/infoprodutos, terapias e empresas com equipe.

## Matriz de auditoria a preencher por ferramenta
- Nome, URL e fase.
- Usuário: mentorando, mentor ou ambos.
- Objetivo e entradas necessárias.
- Saída/entrega esperada.
- Persistência: localStorage, Firestore ou apenas estático.
- Acesso/permissões.
- Exportação/cópia/WhatsApp.
- Relação com outros módulos.
- Duplicidade ou conflito.
- Estado: manter, corrigir, integrar, criar ou arquivar.
- Teste real e resultado.

## Padrão proposto para formulários
Cada formulário deve informar claramente onde os dados ficam. Se local-only, mostrar: “O mentor não consegue ver essas respostas automaticamente. Elas ficam neste dispositivo/navegador. Copie ou prepare uma mensagem para enviar ao mentor.”
Ações: salvar localmente, copiar título + perguntas + respostas, preparar WhatsApp para o número oficial após revisão do usuário. Não colocar dados pessoais/sensíveis em query strings sem consentimento explícito; WhatsApp deve abrir mensagem para revisão e envio manual.

## Próxima sequência de execução
1. Completar inventário arquivo por arquivo.
2. Testar todos os formulários e persistência.
3. Definir arquitetura de dados e permissões.
4. Integrar Central Operacional visual.
5. Padronizar botões de cópia/WhatsApp nos formulários.
6. Fechar o fluxo executivo individual.
7. Escrever roteiro dos 24 encontros coletivos cíclicos.
8. Definir roteiros das 3 imersões presenciais.
9. Produzir mini-aulas; depois fragmentar em reels, posts, carrosséis, imagens e teleprompters.
