# AF Plataforma · CORPO
## Documento mestre de arquitetura funcional

**Status:** arquitetura aprovada para implementação gradual  
**Local:** dentro de `/afplataforma`, como frente independente e transversal  
**Regra estrutural:** CORPO fica fora das cinco fases da Arquitetura de Legado. As cinco fases permanecem integralmente como estão.

---

## 1. Decisão de arquitetura

CORPO é uma frente independente dentro da AF Plataforma, posicionada na navegação global abaixo das cinco fases da Arquitetura de Legado. Não pertence exclusivamente à Fase 3 nem deve ser incorporada como conteúdo de uma fase.

As cinco fases, seus nomes, conteúdos, rotas, ferramentas, dados, permissões e fluxos devem permanecer preservados. CORPO terá navegação, identidade, módulos e evolução próprios.

A implementação será incremental: primeiro criar a estrutura funcional e a navegação de todos os ambientes; depois preencher e aperfeiçoar cada área individualmente. Não construir todo o conteúdo de uma só vez.

## 2. Princípio de preservação

O código existente é ponto de partida, não algo a substituir.

- Não apagar ferramentas, dados, vídeos, áudios, slots, permissões ou integrações existentes.
- Reaproveitar e evoluir Alimentação, Treino, Yoga e Meditação.
- Integrar Modo Sono e MindZone sem duplicá-los.
- Manter autenticação, sessões, planos e liberações individuais do mentor.
- Isolar CORPO das rotas e estados das cinco fases.
- Antes de qualquer migração, mapear dependências, chaves de armazenamento e dados já publicados.
- Quando uma ferramenta existente mudar de lugar na interface, preservar seus identificadores e dados sempre que possível.

## 3. Auditoria de procedência: lógica existente

### 3.1 Treino atual

Arquivo principal: `assets/js/complementar.js`, função `viewTreino()`.

A implementação atual organiza duas coleções paralelas de sete treinos:

1. Máquinas: `maq-01` a `maq-07`.
2. Halteres: `halter-01` a `halter-07`.

Cada coleção é associada aos sete centros/chakras:

| Ordem | Correspondência atual | Cor atual |
|---|---|---|
| 01 | Muladhara · Base | #8B1E1E |
| 02 | Svadhishthana · Sacral | #C45A12 |
| 03 | Manipura · Plexo solar | #C9A227 |
| 04 | Anahata · Cardíaco | #2D6A4F |
| 05 | Vishuddha · Laríngeo | #2B5F8A |
| 06 | Ajna · Frontal | #3D3A8A |
| 07 | Sahasrara · Coronário | #6B3FA0 |

A lógica de treino atualmente registrada na interface:

- Pirâmide: primeira série de 12 repetições, segunda de 10 com aumento de carga, terceira de 8 com novo aumento de carga.
- Respiração descrita no código: inspirar, expirar durante a força, inspirar ao final e retornar expirando.
- Progressão: aumentar carga somente se amplitude e controle forem mantidos; se houver tremor/perda de controle, manter ou reduzir.
- Cada cartão declara sete exercícios.
- A coleção de máquinas é apresentada como treino em máquinas.
- A coleção de halteres é descrita como halteres e peso do corpo.

Essas regras são a procedência histórica do método e devem ser preservadas como referência. Na evolução, revisar a prescrição de séries, repetições, respiração, carga, descanso e adequação individual com critérios de treinamento e segurança. Não aplicar automaticamente a mesma pirâmide ou padrão respiratório a todos os exercícios e pessoas.

### 3.2 Estrutura de mídia do treino

Arquivo de referência: `assets/video/treino/LEIA-ME.txt`.

O documento prevê, para cada um dos 14 treinos:

- sete vídeos curtos de exercícios, com seis segundos cada;
- um vídeo completo do treino;
- nomes de arquivos padronizados como `maq-01-ex-01.mp4` e `maq-01-full.mp4`;
- 98 cortes curtos no primeiro lote e 14 vídeos completos em lote posterior;
- possibilidade de usar arquivos locais ou links do Cloudinary inseridos pelo mentor.

A implementação futura deve auditar a correspondência entre esses slots documentados e o player atualmente renderizado, sem presumir que todos os 112 vídeos já estejam publicados ou conectados.

### 3.3 Alimentação atual

Arquivo: `assets/js/complementar.js`, função `viewAlimentacao()`.

A ferramenta já organiza sete vetores:

1. Estabilidade: refeições regulares, proteína e hidratação.
2. Variedade: cores e texturas.
3. Combustível: escolhas alimentares relacionadas à rotina de foco.
4. Mesa: refeição consciente e convivência.
5. Voz: hidratação e atenção a irritantes.
6. Planejar: lista de compras como planejamento semanal.
7. Ritmo: sono e limite de cafeína.

Essa lógica é uma base conceitual e comportamental. Deve ser ampliada para nutrição, compras, preparo, segurança alimentar e planejamento, sem descartar os sete vetores.

### 3.4 Yoga e meditação atuais

Yoga já possui dez slots:

- sete séries associadas aos sete vetores;
- uma série integrada;
- Saudação ao Sol;
- Saudação à Lua.

Meditação já prevê sete slots de áudio, associados aos sete vetores. O código informa nomes de arquivos de áudio e frequências de referência. Não tratar frequências específicas como terapia ou efeito fisiológico comprovado sem evidência.

### 3.5 Mapeamento de chakras também presente nos módulos

`data/modules.js` associa os sete módulos da Arquitetura de Legado aos mesmos sete nomes de chakras, de Muladhara a Sahasrara. Essa correspondência pertence à lógica simbólica já utilizada pelo ecossistema, mas CORPO deve possuir sua própria interpretação corporal e pedagógica, sem alterar a estrutura das cinco fases ou dos sete módulos.

## 4. Método CORPO: princípios de organização

A metodologia poderá cruzar quatro camadas, sempre identificadas:

1. **Ciência e evidência:** anatomia, fisiologia, biomecânica, treinamento, nutrição, sono, neurociência e estudos revisados.
2. **Tradição e linhagem:** Yoga, Kriya Yoga, Tantra, Puja, Kaula, práticas contemplativas e conhecimentos culturais, contextualizados historicamente.
3. **Modelo simbólico dos sete centros:** linguagem de organização de atenção, intenção e experiência corporal. Chakras não serão apresentados como estruturas anatômicas comprovadas.
4. **Perspectivas e hipóteses:** pesquisas emergentes e interpretações, explicitamente separadas de resultados estabelecidos. Física quântica não será usada como explicação genérica de efeitos de treino, cura ou energia corporal.

Cada conteúdo deverá indicar sua natureza: evidência científica, prática tradicional, hipótese ou interpretação metodológica Akasha.

## 5. Mapa funcional CORPO

### 01 · Movimento e Treinamento
- Treino com peso do corpo.
- Treino com halteres.
- Treino em academia com máquinas.
- Yoga, mobilidade, flexibilidade e condicionamento.
- Biblioteca de exercícios com execução, músculos envolvidos, erros comuns, adaptações e progressões.
- Videoaulas tradicionais e vídeos demonstrativos gerados com IA.
- Treinos orientados por IA, calendário, séries, repetições, cargas, descanso e evolução.
- Metodologia dos sete centros como camada simbólica complementar, não substituta da programação física baseada em objetivos, capacidade e segurança.

### 02 · Nutrição e Autonomia Alimentar
- Alimentação natural e minimamente processada.
- Listas de compras por objetivo, região, estação e orçamento.
- Ganho de massa, emagrecimento, alimentação equilibrada e longevidade.
- Fichas de alimentos: nutrientes, propriedades, safra, origem, preparo, conservação e substituições.
- Frutas, temperos, ervas, hortaliças e alimentos regionais brasileiros.
- Marmitas: planejamento semanal, porções, preparo em lote, refrigeração e congelamento.
- Economia: comparação de custo, aproveitamento integral e redução de desperdício.
- Preferências por alimentos orgânicos e não transgênicos, com distinção entre certificação, rastreabilidade e ausência de informação.
- Segurança alimentar e armazenamento com referências sanitárias confiáveis.

### 03 · Consciência e Práticas
- Meditação guiada e silenciosa.
- Respiração consciente e práticas de atenção.
- Yoga contemplativa.
- Visualização, ensaio mental, metas e realização por ações concretas.
- Saúde mental, gestão do estresse e hábitos, sem substituir cuidado psicológico ou médico.
- Biblioteca contextualizada de Kriya Yoga, Tantra, Puja, Kaula e outras tradições.
- Trilhas por nível, contexto histórico, preparação, limites e orientação qualificada para práticas avançadas.

### 04 · Recuperação e Regeneração
- Sono, ritmo circadiano e higiene do sono.
- Melatonina: fisiologia, evidências, limites e segurança.
- Recuperação muscular, descanso, mobilidade restaurativa e Yoga.
- Wellness em casa: espaço de relaxamento, sauna e banheira de gelo.
- Construção e manutenção de banheira de gelo com materiais, higiene, temperatura e segurança.
- Áudios de relaxamento, meditações, conteúdos motivacionais e audiolivros próprios, licenciados ou em domínio público.
- PNL e ferramentas de rotina como conteúdo de desenvolvimento, sem promessas clínicas.

### 05 · Longevidade e Conhecimentos Ancestrais
- Padrões alimentares e hábitos de civilizações e populações tradicionais.
- Okinawa, Mediterrâneo, tradições japonesas, Ayurveda e conhecimentos indígenas, com contexto e fontes.
- Pesquisas contemporâneas sobre envelhecimento, metabolismo, saúde cardiovascular, cognição, massa muscular e microbiota.
- Plantas e alimentos tradicionais, com atenção a identificação, toxicidade e interações.
- Nootrópicos e cognição: origem, mecanismos propostos, qualidade da evidência, riscos, interações e situação regulatória.
- Separar tradição histórica, hipótese e evidência clínica.

## 6. Ferramentas transversais

- CORPO IA: assistente de planejamento e consulta à biblioteca.
- Perfil CORPO: objetivos, preferências, restrições, experiência e disponibilidade.
- Planejador semanal: treino, alimentação, sono e práticas.
- Lista de compras inteligente: quantidades, categorias, orçamento e substituições.
- Marmita Inteligente: cardápio, preparo e conservação.
- Horta em Casa: mini, média e grande, com espaço, luminosidade, clima, calendário e cultivo.
- Diário de evolução: treinos, medidas opcionais, hábitos e consistência.
- Biblioteca de mídia: vídeos, áudios, fontes, licenças e autoria.

A IA deve explicar limites, pedir contexto suficiente, não diagnosticar nem prescrever medicamentos, suplementos ou protocolos arriscados. Recomendações de saúde devem respeitar restrições, contraindicações e encaminhamento profissional quando necessário.

## 7. Experiência e navegação

Criar uma entrada principal **CORPO** na navegação global da AF Plataforma, abaixo das cinco fases da Arquitetura de Legado e em seção própria.

CORPO terá uma home com cinco áreas principais e uma entrada transversal para CORPO IA. Cada área terá páginas e ferramentas internas próprias.

A navegação atual em `assets/js/navigation.js` trata Complementar e `comp:*` como parte da Fase 3 por meio de `fase3Aberta()`. A implementação de CORPO deverá desacoplar sua rota e estado ativo dessa regra. Não alterar a navegação ou o conteúdo das cinco fases além do estritamente necessário para preservar sua integridade.

Ferramentas existentes de Alimentação, Treino, Yoga e Meditação deverão ser migradas visualmente ou incorporadas à nova central com compatibilidade de rotas e dados. As demais ferramentas de Complementar permanecem onde estão, salvo decisão futura explícita.

## 8. Dados, mídia e permissões

- Reutilizar autenticação e sessão existentes.
- Preservar os planos Essencial, Premium e VIP e as liberações individuais do mentor na primeira etapa.
- Não alterar permissões sem uma decisão específica posterior.
- Dados pessoais de cada mentorando devem permanecer isolados por usuário.
- Não depender exclusivamente de armazenamento local para dados que precisam acompanhar o usuário entre dispositivos.
- Auditar `assets/js/media.js`, `assets/js/covers.js`, `assets/js/storage.js` e a camada Firebase antes de definir persistência e publicação.
- Preservar os identificadores de mídia já usados: `maq-01..07`, `halter-01..07`, `yoga-01..10` e slots de meditação.
- Respeitar direitos autorais e licenças de vídeos, áudios, livros e cursos.

## 9. Plano de implementação gradual

**Etapa 0 · Auditoria e documento mestre**
- Confirmar rotas, renderers, chaves de armazenamento, permissões e dependências.
- Registrar a lógica original e os ativos existentes.
- Não alterar as cinco fases.

**Etapa 1 · Estrutura e navegação**
- Criar home CORPO e cinco áreas.
- Criar rotas próprias e navegação independente.
- Criar estados vazios, cards e espaços para conteúdo futuro.
- Integrar as ferramentas existentes sem perda de dados.

**Etapa 2 · Evolução individual das áreas**
- Movimento: ampliar biblioteca, modalidades, vídeos e acompanhamento.
- Nutrição: listas, fichas, marmitas, horta e armazenamento.
- Consciência: meditação, Yoga e biblioteca tradicional.
- Regeneração: sono, recuperação e Wellness.
- Longevidade: pesquisas, civilizações e cognição.

**Etapa 3 · Integração CORPO IA**
- Conectar perfil, objetivos e dados permitidos.
- Gerar planejamento integrado e relatórios.
- Implementar controles de segurança, privacidade e consentimento.

## 10. Critérios de aceite

- As cinco fases continuam visual e funcionalmente intactas.
- CORPO aparece como frente independente na navegação global.
- A navegação de CORPO não marca a Fase 3 como ativa.
- As ferramentas e conteúdos existentes continuam acessíveis.
- Nenhum dado, slot de vídeo, áudio ou imagem é perdido.
- O mentor mantém capacidade de editar e publicar mídia conforme as permissões existentes.
- A experiência funciona em dispositivos móveis e desktop.
- Cada área pode ser desenvolvida e validada separadamente.
- Conteúdos de saúde, tradição e hipótese estão claramente diferenciados.
- A publicação ocorre somente após testes de regressão nas cinco fases, autenticação, permissões e ferramentas complementares.

---

## Referências internas auditadas

- `assets/js/complementar.js`: ferramentas Complementar, Alimentação, Treino, Yoga e Meditação.
- `assets/js/covers.js`: slots de capas, identificadores de treinos e Yoga.
- `assets/video/treino/LEIA-ME.txt`: convenção de nomes e plano de vídeos.
- `CAMADAS.txt`: histórico de decisões e camadas existentes.
- `data/modules.js`: sete módulos e correspondências simbólicas.
- `assets/js/navigation.js`: navegação atual e regra que associa Complementar à Fase 3.
- `assets/js/plans.js`: planos, permissões e liberações individuais.

**Princípio final:** construir a estrutura inteira de CORPO primeiro; preencher, aprofundar e aperfeiçoar cada ambiente em ciclos independentes, preservando integralmente o que já existe na Arquitetura de Legado.


---

## 11. Implementação estrutural · primeira entrega

**Status:** estrutura adicionada ao repositório; preenchimento editorial e funcional profundo permanece planejado por área.

Arquivos novos:
- `assets/js/corpo.js`: home CORPO, cinco ambientes, espaços internos e visão de gestão do mentor.
- `assets/css/corpo.css`: identidade visual responsiva e componentes da frente.
- `CORPO/ARQUITETURA-MESTRE.md`: este documento mestre.

Arquivos de integração alterados:
- `index.html`: inclusão do CSS CORPO e atualização de versão do app para cache.
- `assets/js/navigation.js`: entrada CORPO abaixo das cinco fases, estado ativo próprio e roteamento dos ambientes/espaços.
- `assets/js/app.js`: registro das páginas CORPO e inclusão de acesso ao documento mestre no Dashboard do mentor.

Rotas internas:
- `corpo`: home da frente.
- `corpo:movimento`, `corpo:nutricao`, `corpo:consciencia`, `corpo:regeneracao`, `corpo:longevidade`: páginas dos cinco ambientes.
- `corpo:<ambiente>:<espaco>`: página individual de cada espaço interno.
- `corpo-gestao`: visão do documento mestre, restrita à sessão do mentor.

Integrações sem migração de dados:
- Movimento aponta para os recursos atuais `comp:treino` e `comp:yoga`.
- Nutrição aponta para `comp:alimentacao`.
- Consciência aponta para `comp:meditacao` e `comp:yoga`.
- Regeneração aponta para `sono` e `comp:mindzone`.

Os atalhos abrem os módulos originais. Não foram renomeados IDs de mídia, alteradas chaves de armazenamento, migradas coleções, modificadas permissões nem removidos recursos antigos.

A gestão do mentor ganhou uma entrada para o documento mestre e uma página interna de referência. A versão integral deste documento continua disponível em Markdown e no GitHub.

**Limite de validação:** a integração foi gravada no branch `main`. Antes de considerar a publicação validada em produção, executar testes reais de login mentor/mentorado, navegação mobile/desktop, cinco fases, rotas antigas `comp:*`, players e edição de mídia.

## 12. Movimento e Treinamento · primeira implementação funcional

**Status:** primeira camada funcional gravada no branch `main`.

Novos recursos:
- Biblioteca inicial com 15 exercícios, grupos musculares, dicas de execução e nível de referência.
- Planejamento semanal com dia, foco e modalidade, incluindo remoção de itens.
- Diário de treino com data, exercício, séries, repetições, carga, esforço percebido e observações.
- Painel de evolução com sessões registradas, volume estimado, exercícios acompanhados e melhores cargas registradas.
- Planejador assistido com objetivo, experiência, disponibilidade semanal e equipamentos; gera uma estrutura editável de dias e focos, sem se apresentar como IA generativa.

Preservação:
- As coleções originais `maq-01..07` e `halter-01..07`, capas, slots de vídeo e rotas `comp:treino` e `comp:yoga` permanecem intactas.
- A nova funcionalidade é carregada sob demanda dentro dos espaços do ambiente Movimento.
- Nenhuma das cinco fases foi alterada em sua arquitetura ou conteúdo.

Persistência e limites:
- Os registros novos usam armazenamento local já existente na plataforma, com chave separada por UID da sessão.
- Nesta entrega, os dados ficam neste navegador/dispositivo; sincronização Firestore entre dispositivos ainda não foi implementada.
- A biblioteca inicial é educativa. A seleção e progressão de exercícios devem considerar experiência, técnica, limitações individuais e orientação profissional quando necessária.
- O planejador é baseado em regras simples e não substitui avaliação individual nem representa integração com um modelo de IA.

**Validação pendente:** testar login com mentor e mentorado, salvamento e recuperação após recarregar, adição/remoção de dias, registro de sessão, visualização de evolução, responsividade e regressão das cinco fases e dos módulos antigos. A gravação no GitHub não comprova, por si só, a publicação ou validação em produção.
