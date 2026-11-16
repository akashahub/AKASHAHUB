# Mapa de aplicativos — cinco fases

**Base:** `afplataforma/assets/js/phase-launcher.js`, `fases.js`, `phase-guidance.js` e `EXPERIENCIA-DO-MENTORANDO-MAPA.md`.

## Princípio

As cinco fases são a estrutura metodológica. O apoio transversal não é uma sexta fase. Cada ferramenta mantém seu propósito e autonomia; os dados devem alimentar o histórico do mentorando sem duplicar perguntas ou funções.

## Fase 1 — Arquitetura de Essência

**Objetivo:** compreender trajetória, identidade, valores, capacidades, posicionamento e direção.

Ferramentas mapeadas:
- Roteiro em Sessões — `/sessoes/` — 26 encontros da trilha anterior, perguntas, mergulho, tarefas e anotações; respostas em `mentoria_respostas/{uid}/dados/tudo`.
- Mesa da Essência — view `fase1-jogo` — oito estações; armazenamento local `afMesaEssenciaV2`; cópia do conjunto disponível.
- Formulário de Marca/Identidade — view `fase1-marca` — sete campos; armazenamento local `afMarcaIdentidadeV1`.
- Dossiê vivo — view `fase1-dossie` — relato/fato, hipótese e decisão; armazenamento local e exportação/cópia conforme o mapa existente.
- Anamnese curta — `/afplataforma/complementar/anamnese.html` — triagem de entrada; armazenamento local no estado documentado.
- Essência OS — `/afplataforma/essencia/` — coleção `afEssencia/{uid}`.
- Identity Studio — `/afplataforma/identity-studio/` — coleção `afIdentityStudio/{uid}`.
- Branding Pessoal — `/afplataforma/branding-pessoal/` — coleção `afBrandingPessoal/{uid}`.
- Marketing Pessoal, Liderança, Comunicação, Constelação Familiar, Registros Akáshicos e Authority Leadership OS — aplicativos próprios; validar cada fluxo e coleção no teste funcional.

**Fluxo proposto:** triagem/anamnese → investigação (Sessões/Mesa) → síntese com distinção fato/hipótese/decisão → identidade/posicionamento → plano de ação. Evitar perguntas duplicadas.

## Fase 2 — Império Digital

**Objetivo:** converter direção e proposta de valor em ativos, ofertas, presença e infraestrutura digital.

Ferramentas já mapeadas:
- Construtor de oferta.
- Diagnóstico de ativos.
- Pitch de 60 segundos.
- Oratória.
- Mapa de rede.
- Biblioteca de soluções/portfólio do Império Digital.
- Website Studio — `/afplataforma/website-studio/` — coleção `afWebsiteStudio/{uid}`.
- App Builder — `/afplataforma/app-builder/`.
- IA Studio — `/afplataforma/ia-studio/`.
- CRM Inteligente — `/afplataforma/crm-inteligente/` — coleção `afCrmInteligente/{uid}`.
- Produtos Digitais, Funil Builder, Identity Studio e Central de Ativos.

**Saídas possíveis:** site, landing page, plataforma com login, portal de clientes, academy, CRM, sistema de vendedores, automação, integrações e documentação técnica. O mentor valida escopo, orçamento, dependências e aceite antes de transformar uma ideia em entrega.

## Fase 3 — Alinhamento Financeiro

**Objetivo:** compreender e organizar a vida financeira pessoal/empresarial, capital, fluxo, metas e sustentabilidade.

Ferramentas mapeadas:
- Dashboard AF e módulos.
- Ferramentas transversais: Cash-Flow, Modo Sono, Metas, Ideias/Ideation, Mapa de Rede e tarefas.
- Fluxo de Caixa OS — `/afplataforma/fluxo-de-caixa/` — coleção `afFluxoDeCaixa/{uid}`.
- Planejamento Financeiro — `/afplataforma/planejamento-financeiro/`.
- Indicadores Financeiros — `/afplataforma/indicadores-financeiros/`.
- Precificação — `/afplataforma/precificacao/`.
- Quitei e ferramentas complementares.

**Regra:** não duplicar Cash-Flow, Quitei ou cálculos existentes. A camada executiva deve conectar os resultados e apontar lacunas.

## Fase 4 — Expansão

**Objetivo:** melhorar aquisição, marketing, vendas, processos, operação, equipe e crescimento sustentável.

Ferramentas mapeadas:
- Divulgação e Presença — `/afplataforma/divulgacao/`.
- Dependências do Fundador — `/afplataforma/dependencias-fundador/`.
- Processos Operacionais — `/afplataforma/processos-operacionais/`.
- SDR OS — `/afplataforma/sdr-os/`.
- Treinamento — `/afplataforma/treinamento/`.
- Closers OS aparece como destino/view na documentação e em views legadas; a existência de um app independente completo ainda não foi confirmada.
- CRM Inteligente, Funil Builder, Comunicação, Acompanhamento de Operação e Acompanhamento de Resultados.

**Inconsistência:** `fases.js` contém renderizadores de SDR/treinamento/closers com conteúdo simplificado, e `phase-guidance.js` ainda descreve áreas como em construção. Ao mesmo tempo, páginas independentes de SDR OS e Treinamento existem. Testar e reconciliar o acesso antes de substituir qualquer módulo.

## Fase 5 — Legado

**Objetivo:** continuidade, documentação de método, governança, patrimônio, sucessão e estrutura de longo prazo.

Ferramentas mapeadas:
- Declaração de Legado.
- Livro do Método / Transmissão da Metodologia.
- Zen Negócios — `/afplataforma/zen-negocios/`.
- Akasha Trading — `/afplataforma/zen-negocios/akasha-trading/`.
- Continuidade — `/afplataforma/continuidade/`.
- Legacy Vault — `/afplataforma/legacy-vault/`.

**Limite confirmado:** a página Zen Negócios declara que exercícios, checklist, lista de observação e calculadora desta versão ficam no navegador; cotações ao vivo não estão conectadas e a plataforma não executa ordens.

## Apoio transversal

Não é uma fase adicional. Inclui Cash-Flow, Modo Sono, Metas, Ideias, Mapa de Rede, tarefas, biblioteca de materiais e outros instrumentos que podem apoiar várias fases.

## Camada do mentor existente

O Dashboard do Mentor em `afplataforma/assets/js/app.js` reúne links para materiais internos, roteiros e ferramentas operacionais. Também incorpora `renderAccessAdminPanel()` de `access-admin.js`. Esse painel acompanha tentativas de login e permite liberar, pausar, bloquear e ajustar plano/módulos. Não foi encontrado nele um fluxo para selecionar um mentorando e abrir suas respostas de Essência, Império Digital, AF, Expansão ou Legado. Isso é uma lacuna de operação, não motivo para duplicar os formulários.

## Ferramentas operacionais transversais

- Central de Ativos.
- Entregas.
- Acompanhamento de Operação e Resultados.
- Comunidade e Evolução da Comunidade.
- Documentação e Fluxos de Trabalho.
- Catálogo de Capacidades (uso interno do mentor).

## Regra de manutenção do mapa

Este documento é um mapa de navegação e responsabilidade, não uma autorização para construir tudo de novo. Antes de criar uma ferramenta, confirmar se uma rota ou aplicativo existente já cumpre a função. Registrar fonte, status funcional, coleção, responsável e dependências após cada teste.
