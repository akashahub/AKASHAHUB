# Matriz de contexto — Biblioteca de Prompts

**Status:** classificação inicial implementada em branch de revisão; não publicada na produção.  
**Objetivo:** definir quais fontes de informação cada capacidade ou receita especializada pode consultar na Ficha Única do Projeto.

## Regras

- **Pessoal:** usa o perfil individual, trajetória, identidade, competências, experiências, valores e objetivos da pessoa.
- **Empresarial:** usa o dossiê do negócio selecionado, incluindo modelo, mercado, clientes, ofertas, operação, indicadores, recursos e ativos.
- **Híbrido:** combina perfil pessoal e dossiê empresarial somente quando ambos forem pertinentes. A origem de cada informação deve permanecer identificável.
- A classificação não torna nenhum campo obrigatório no cadastro. Campos ausentes continuam sendo lacunas a confirmar na execução.
- O escopo é independente da fase da Arquitetura de Legado e do estado operacional da capacidade.
- Não inferir fatos empresariais a partir da biografia pessoal, nem fatos pessoais a partir de dados da empresa.
- Classificações são uma primeira revisão editorial e devem poder ser ajustadas pelo mentor após testar cada prompt.

## Resumo da classificação

| Escopo | Capacidades | Receitas especializadas |
|---|---:|---:|
| Pessoal | 28 | 13 |
| Empresarial | 85 | 34 |
| Híbrido | 47 | 23 |
| **Total** | **160** | **70** |

## Exemplos de decisão

| Capacidade/receita | Escopo | Motivo |
|---|---|---|
| Diagnóstico comercial e organização de ofertas | Empresarial | Precisa conhecer ofertas, clientes, vendas, preços e operação do negócio. |
| Biografia estratégica, currículo e portfólio | Pessoal | Precisa da trajetória, competências e experiências da pessoa. |
| Posicionamento de empresários, especialistas e profissionais liberais | Híbrido | Combina identidade e autoridade da pessoa com mercado, público e marca profissional. |
| Diagnóstico estratégico de negócios | Empresarial | Avalia modelo, mercado, oferta, operação, finanças e gestão. |
| Roteiro com Identidade Pessoal | Pessoal | Depende da voz, história e experiências reais da pessoa. |
| Business Model Validator | Empresarial | Valida problema, cliente, solução e viabilidade do negócio. |

## Catálogo de capacidades — 160

| ID | Departamento/grupo | Capacidade | Contexto |
|---|---|---|---|
| 0101-C01 | Investigação e diagnóstico pessoal | Leitura de trajetória pessoal e profissional | Pessoal |
| 0101-C02 | Investigação e diagnóstico pessoal | Mapeamento de história de vida, talentos, competências e experiências | Pessoal |
| 0101-C03 | Investigação e diagnóstico pessoal | Mapeamento de valores, princípios, interesses e aptidões | Pessoal |
| 0101-C04 | Investigação e diagnóstico pessoal | Investigação de objetivos, aspirações e oportunidades | Pessoal |
| 0101-C05 | Investigação e diagnóstico pessoal | Mapeamento de habilidades comercializáveis | Pessoal |
| 0101-C06 | Investigação e diagnóstico pessoal | Construção de visão de futuro e dossiê de essência | Pessoal |
| 0101-C07 | Identidade e posicionamento pessoal | Identidade profissional e perfil executivo | Pessoal |
| 0101-C08 | Identidade e posicionamento pessoal | Posicionamento de empresários, especialistas e profissionais liberais | Híbrido |
| 0101-C09 | Identidade e posicionamento pessoal | Construção de autoridade e narrativa pessoal | Pessoal |
| 0101-C10 | Identidade e posicionamento pessoal | Biografia estratégica, currículo e portfólio | Pessoal |
| 0101-C11 | Identidade e posicionamento pessoal | Apresentações pessoais e comunicação de competências | Pessoal |
| 0101-C12 | Comportamento e desenvolvimento humano | Mapeamento de crenças, hábitos e padrões de decisão | Pessoal |
| 0101-C13 | Comportamento e desenvolvimento humano | Investigação de padrões familiares e relação com dinheiro | Pessoal |
| 0101-C14 | Comportamento e desenvolvimento humano | Autoconhecimento, meditação e visualização orientada | Pessoal |
| 0101-C15 | Comportamento e desenvolvimento humano | Presença, disciplina, consistência e liderança pessoal | Pessoal |
| 0101-C16 | Comportamento e desenvolvimento humano | Integração entre vida pessoal e profissional | Híbrido |
| 0202-C01 | Identidade visual | Criação e redesign de logotipos e símbolos | Empresarial |
| 0202-C02 | Identidade visual | Manual de identidade, paleta, tipografia e direção de arte | Empresarial |
| 0202-C03 | Identidade visual | Identidade de produtos, campanhas, eventos e projetos | Empresarial |
| 0202-C04 | Identidade visual | Aplicações institucionais e sistemas gráficos | Empresarial |
| 0202-C05 | Imagem e fotografia | Retratos profissionais e fotografia corporativa | Pessoal |
| 0202-C06 | Imagem e fotografia | Fotografia de produtos e imagens institucionais | Empresarial |
| 0202-C07 | Imagem e fotografia | Imagens para perfis, redes sociais, sites e campanhas | Híbrido |
| 0202-C08 | Imagem e fotografia | Tratamento, edição, restauração e composição visual | Híbrido |
| 0202-C09 | Imagem e fotografia | Criação de imagens com IA, avatares e bancos personalizados | Empresarial |
| 0202-C10 | Imagem e fotografia | Direção de ensaios e padronização de imagens de equipe | Empresarial |
| 0202-C11 | Comunicação e audiovisual | Proposta de valor, narrativa, storytelling e tom de voz | Híbrido |
| 0202-C12 | Comunicação e audiovisual | Manifestos, pitch, textos comerciais e páginas de venda | Empresarial |
| 0202-C13 | Comunicação e audiovisual | Roteiros, vídeos institucionais, publicitários e educativos | Híbrido |
| 0202-C14 | Comunicação e audiovisual | Reels, Shorts, mini documentários, animação e motion graphics | Híbrido |
| 0202-C15 | Comunicação e audiovisual | Edição, legendagem, tradução, locução e direção audiovisual | Híbrido |
| 0202-C16 | Comunicação e audiovisual | Apresentações, e-books, catálogos, relatórios e infográficos | Híbrido |
| 0303-C01 | Desenvolvimento web | Sites institucionais, empresariais e pessoais | Híbrido |
| 0303-C02 | Desenvolvimento web | Portfólios, landing pages, páginas de venda e captura | Híbrido |
| 0303-C03 | Desenvolvimento web | Sites multilíngues, blogs, portais, diretórios e catálogos | Empresarial |
| 0303-C04 | Desenvolvimento web | Lojas virtuais, sites de agendamento e sites profissionais | Empresarial |
| 0303-C05 | Aplicativos e plataformas | Aplicativos web e sistemas de gestão | Empresarial |
| 0303-C06 | Aplicativos e plataformas | Plataformas educacionais, áreas de membros e assinaturas | Empresarial |
| 0303-C07 | Aplicativos e plataformas | Bibliotecas digitais, portais de clientes e comunidades | Híbrido |
| 0303-C08 | Aplicativos e plataformas | Sistemas de atendimento, reservas, projetos e acompanhamento | Empresarial |
| 0303-C09 | Aplicativos e plataformas | Marketplaces, afiliados, comércio e produtos SaaS | Empresarial |
| 0303-C10 | Engenharia e infraestrutura | Arquitetura de sistemas, front-end e back-end | Empresarial |
| 0303-C11 | Engenharia e infraestrutura | APIs, bancos de dados, autenticação e controle de acesso | Empresarial |
| 0303-C12 | Engenharia e infraestrutura | Painéis administrativos, pagamentos e integrações | Empresarial |
| 0303-C13 | Engenharia e infraestrutura | Firebase, Supabase, hospedagem, DNS, SSL e e-mail profissional | Empresarial |
| 0303-C14 | Engenharia e infraestrutura | GitHub, deploy, backups, segurança, monitoramento e documentação | Empresarial |
| 0303-C15 | Engenharia e infraestrutura | Otimização, responsividade, manutenção, migração e auditoria técnica | Empresarial |
| 0303-C16 | Comércio digital | Catálogos, pedidos, checkout e pagamentos | Empresarial |
| 0303-C17 | Comércio digital | Gestão de produtos, assinaturas e fidelidade | Empresarial |
| 0303-C18 | Comércio digital | Integração com WhatsApp, fornecedores e distribuição | Empresarial |
| 0404-C01 | Comportamento e fundamentos | Crenças financeiras, história familiar e relação com riqueza | Pessoal |
| 0404-C02 | Comportamento e fundamentos | Comportamento de consumo, disciplina e tomada de decisão | Pessoal |
| 0404-C03 | Comportamento e fundamentos | Medo de cobrar, vender e negociar; valor percebido | Híbrido |
| 0404-C04 | Comportamento e fundamentos | Fundamentos do dinheiro, inflação, juros simples e compostos | Pessoal |
| 0404-C05 | Organização financeira pessoal e familiar | Diagnóstico, receitas, despesas e orçamento | Pessoal |
| 0404-C06 | Organização financeira pessoal e familiar | Controle de gastos, contas e planejamento mensal/anual | Pessoal |
| 0404-C07 | Organização financeira pessoal e familiar | Gestão de dívidas, reserva, metas e grandes aquisições | Pessoal |
| 0404-C08 | Organização financeira pessoal e familiar | Educação financeira para crianças, adolescentes e famílias | Pessoal |
| 0404-C09 | Gestão financeira empresarial | Fluxo de caixa, contas a pagar e receber | Empresarial |
| 0404-C10 | Gestão financeira empresarial | Capital de giro, projeção de caixa e inadimplência | Empresarial |
| 0404-C11 | Gestão financeira empresarial | Orçamento, custos fixos e variáveis e indicadores | Empresarial |
| 0404-C12 | Gestão financeira empresarial | Planejamento de receitas, despesas, expansão e sustentabilidade | Empresarial |
| 0404-C13 | Precificação, receita e rentabilidade | Formação de preços, custos e margem de contribuição | Empresarial |
| 0404-C14 | Precificação, receita e rentabilidade | Margem de lucro, ponto de equilíbrio e rentabilidade | Empresarial |
| 0404-C15 | Precificação, receita e rentabilidade | Precificação de produtos, serviços, pacotes e recorrência | Empresarial |
| 0404-C16 | Precificação, receita e rentabilidade | Negociação, cobrança e desenvolvimento de fontes de receita | Empresarial |
| 0404-C17 | Economia, mercados e investimentos | Economia brasileira e internacional, política monetária e fiscal | Híbrido |
| 0404-C18 | Economia, mercados e investimentos | Câmbio, geopolítica econômica e ciclos de mercado | Híbrido |
| 0404-C19 | Economia, mercados e investimentos | Renda fixa, Tesouro Direto, CDB, fundos e fundos imobiliários | Pessoal |
| 0404-C20 | Economia, mercados e investimentos | Ações, ETFs, dividendos e fundamentos de bolsa | Pessoal |
| 0404-C21 | Economia, mercados e investimentos | Criptoativos, volatilidade, liquidez, diversificação e risco | Pessoal |
| 0404-C22 | Economia, mercados e investimentos | Perfil de risco, horizonte e educação sobre investimentos | Pessoal |
| 0404-C23 | Inteligência empresarial e patrimônio | Leitura de balanços, EBITDA, endividamento e geração de caixa | Empresarial |
| 0404-C24 | Inteligência empresarial e patrimônio | Valuation introdutório, modelos de negócio e viabilidade | Empresarial |
| 0404-C25 | Inteligência empresarial e patrimônio | Análise de oportunidades, aquisições e cenários | Empresarial |
| 0404-C26 | Inteligência empresarial e patrimônio | Mapeamento de ativos e passivos e planejamento de longo prazo | Híbrido |
| 0404-C27 | Inteligência empresarial e patrimônio | Educação sobre holdings, governança e sucessão | Híbrido |
| 0404-C28 | Ferramentas e laboratórios | Cashflow e controle de despesas | Híbrido |
| 0404-C29 | Ferramentas e laboratórios | Simuladores de juros compostos, metas e investimentos | Pessoal |
| 0404-C30 | Ferramentas e laboratórios | Calculadora de precificação e planejador financeiro | Híbrido |
| 0404-C31 | Ferramentas e laboratórios | Diário financeiro, mapa patrimonial e painéis de indicadores | Híbrido |
| 0505-C01 | Estratégia de marketing | Diagnóstico, pesquisa de público e segmentação | Empresarial |
| 0505-C02 | Estratégia de marketing | Análise de mercado, concorrentes e jornada do cliente | Empresarial |
| 0505-C03 | Estratégia de marketing | Proposta de valor, calendário editorial e estratégia de lançamento | Híbrido |
| 0505-C04 | Redes sociais e conteúdo | Criação e estruturação de perfis e biografias | Empresarial |
| 0505-C05 | Redes sociais e conteúdo | Instagram, TikTok, YouTube e LinkedIn | Híbrido |
| 0505-C06 | Redes sociais e conteúdo | Calendários, Reels, carrosséis, Stories e Shorts | Híbrido |
| 0505-C07 | Redes sociais e conteúdo | Conteúdo institucional, educativo, comercial e comunidades | Híbrido |
| 0505-C08 | Publicidade e anúncios | Criação de peças, imagens, vídeos e copy de anúncios | Híbrido |
| 0505-C09 | Publicidade e anúncios | Meta Ads, Google Ads, YouTube Ads e TikTok Ads | Empresarial |
| 0505-C10 | Publicidade e anúncios | Estrutura de campanhas, públicos, testes A/B e remarketing | Empresarial |
| 0505-C11 | Publicidade e anúncios | Análise de desempenho, otimização e relatórios | Empresarial |
| 0505-C12 | Aquisição e presença digital | Landing pages, formulários, iscas digitais e funis | Empresarial |
| 0505-C13 | Aquisição e presença digital | Captação, nutrição, automação e reativação de leads | Empresarial |
| 0505-C14 | Aquisição e presença digital | SEO técnico, local, palavras-chave e otimização de páginas | Empresarial |
| 0505-C15 | Aquisição e presença digital | Google Business Profile, autoridade e monitoramento de tráfego | Empresarial |
| 0606-C01 | Estrutura comercial | Diagnóstico comercial e organização de ofertas | Empresarial |
| 0606-C02 | Estrutura comercial | Proposta de valor, pacotes, recorrência e políticas comerciais | Empresarial |
| 0606-C03 | Estrutura comercial | Jornada de compra e estruturação de atendimento | Empresarial |
| 0606-C04 | SDR e prospecção | Definição de cliente ideal e mapeamento de oportunidades | Empresarial |
| 0606-C05 | SDR e prospecção | Prospecção ativa e passiva e pesquisa de empresas | Empresarial |
| 0606-C06 | SDR e prospecção | Scripts, mensagens, qualificação, follow-up e agendamento | Empresarial |
| 0606-C07 | SDR e prospecção | Pipeline, CRM e registro de oportunidades | Empresarial |
| 0606-C08 | Negociação e fechamento | Roteiros de reunião, apresentações e propostas | Empresarial |
| 0606-C09 | Negociação e fechamento | Negociação, tratamento de objeções e fechamento | Empresarial |
| 0606-C10 | Negociação e fechamento | Pós-venda, retenção, indicação e expansão de contas | Empresarial |
| 0606-C11 | Equipes e documentação | Formação de SDRs, closers e atendimento | Empresarial |
| 0606-C12 | Equipes e documentação | Roleplay, simulações, avaliação e indicadores | Empresarial |
| 0606-C13 | Equipes e documentação | Escopos, briefings, propostas, onboarding e pós-venda | Empresarial |
| 0606-C14 | Equipes e documentação | Modelos contratuais sujeitos à revisão jurídica | Empresarial |
| 0707-C01 | Estruturação de negócios e organizações | Modelos de negócio, planejamento e estudos de viabilidade | Empresarial |
| 0707-C02 | Estruturação de negócios e organizações | Departamentos, funções, responsabilidades e processos | Empresarial |
| 0707-C03 | Estruturação de negócios e organizações | Planejamento de implantação, operação e expansão | Empresarial |
| 0707-C04 | Estruturação de negócios e organizações | Governança, documentação e gestão organizacional | Empresarial |
| 0707-C05 | Internacionalização | Pesquisa de mercados estrangeiros e oportunidades | Empresarial |
| 0707-C06 | Internacionalização | Posicionamento, sites multilíngues e comunicação internacional | Empresarial |
| 0707-C07 | Internacionalização | Localização de conteúdo e adaptação cultural | Empresarial |
| 0707-C08 | Internacionalização | Pesquisa de fornecedores, parceiros e canais de distribuição | Empresarial |
| 0707-C09 | Internacionalização | Plano de entrada em novos países e atendimento internacional | Empresarial |
| 0707-C10 | Parcerias e desenvolvimento | Mapeamento de parceiros, investidores e oportunidades | Empresarial |
| 0707-C11 | Parcerias e desenvolvimento | Apresentações institucionais e propostas de colaboração | Empresarial |
| 0707-C12 | Parcerias e desenvolvimento | Alianças estratégicas, programas de parceiros e reuniões | Empresarial |
| 0808-C01 | Gestão operacional | Mapeamento de processos e fluxogramas | Empresarial |
| 0808-C02 | Gestão operacional | Rotinas, procedimentos, tarefas e projetos | Híbrido |
| 0808-C03 | Gestão operacional | Prazos, indicadores, relatórios e gestão de equipes | Empresarial |
| 0808-C04 | Automação e integração | Formulários, e-mails, atendimento e agendamentos | Empresarial |
| 0808-C05 | Automação e integração | Vendas, pagamentos, relatórios e notificações | Empresarial |
| 0808-C06 | Automação e integração | Integração de plataformas, sincronização e onboarding | Empresarial |
| 0808-C07 | Inteligência artificial | Assistentes personalizados e agentes de IA | Híbrido |
| 0808-C08 | Inteligência artificial | Agentes comerciais, atendimento, pesquisa e conteúdo | Empresarial |
| 0808-C09 | Inteligência artificial | Assistentes administrativos e financeiros educacionais | Híbrido |
| 0808-C10 | Inteligência artificial | Bases de conhecimento, RAG e análise documental | Híbrido |
| 0808-C11 | Produtividade | Sistemas de gestão pessoal e painéis de produtividade | Pessoal |
| 0808-C12 | Produtividade | Gestão de ideias, prioridades, reuniões e conhecimento | Híbrido |
| 0808-C13 | Produtividade | Mapas de rede, teleprompters e acompanhamento | Híbrido |
| 0909-C01 | Estruturação educacional | Cursos, módulos, trilhas e planejamento pedagógico | Híbrido |
| 0909-C02 | Estruturação educacional | Aulas, apostilas, exercícios, questionários e avaliações | Híbrido |
| 0909-C03 | Estruturação educacional | Certificados, treinamentos empresariais e capacitação | Empresarial |
| 0909-C04 | Publicações e métodos | Livros, e-books, manuais, guias e relatórios | Híbrido |
| 0909-C05 | Publicações e métodos | Extração e documentação de conhecimento tácito | Híbrido |
| 0909-C06 | Publicações e métodos | Frameworks, metodologias, processos autorais e nomenclaturas | Híbrido |
| 0909-C07 | Publicações e métodos | Preparação documental para proteção de direitos e marcas | Empresarial |
| 0909-C08 | Produtos de conhecimento | Cursos online, bibliotecas e assinaturas | Empresarial |
| 0909-C09 | Produtos de conhecimento | Comunidades, mentorias, programas e plataformas Academy | Empresarial |
| 0909-C10 | Produtos de conhecimento | Laboratórios, simuladores e jogos educacionais | Híbrido |
| 0909-C11 | Produtos de conhecimento | Palestras, workshops, seminários, podcasts e eventos | Híbrido |
| 1010-C01 | Estratégia patrimonial | Mapeamento de ativos e passivos | Híbrido |
| 1010-C02 | Estratégia patrimonial | Planejamento de aquisição e diversificação | Híbrido |
| 1010-C03 | Estratégia patrimonial | Educação sobre preservação de capital e cenários | Híbrido |
| 1010-C04 | Estratégia patrimonial | Organização documental e planejamento de longo prazo | Híbrido |
| 1010-C05 | Expansão empresarial | Novos mercados, produtos, unidades e marcas | Empresarial |
| 1010-C06 | Expansão empresarial | Parcerias, canais de distribuição e crescimento | Empresarial |
| 1010-C07 | Expansão empresarial | Estudos de aquisição e preparação para venda de empresas | Empresarial |
| 1010-C08 | Governança e continuidade | Governança, responsabilidades e formação de lideranças | Empresarial |
| 1010-C09 | Governança e continuidade | Planejamento sucessório e preparação para delegação | Híbrido |
| 1010-C10 | Governança e continuidade | Documentação de processos, cultura e conhecimento institucional | Empresarial |
| 1010-C11 | Governança e continuidade | Proteção de propriedade intelectual e indicadores de continuidade | Híbrido |
| 1010-C12 | Movimento e comunidade | Manifestos, princípios, causas e movimentos | Híbrido |
| 1010-C13 | Movimento e comunidade | Comunidades, redes de colaboração e participação | Híbrido |
| 1010-C14 | Movimento e comunidade | Eventos, encontros e formação de lideranças | Híbrido |

## Receitas especializadas — 70

| ID | Categoria | Receita | Contexto |
|---|---|---|---|
| IMG-01 | Imagem e Fotografia | Photo Enhancement Pro | Híbrido |
| IMG-02 | Imagem e Fotografia | Restauração Fotográfica Realista | Pessoal |
| IMG-03 | Imagem e Fotografia | Preservação de Identidade Facial | Pessoal |
| IMG-04 | Imagem e Fotografia | Retrato Executivo Premium | Pessoal |
| IMG-05 | Imagem e Fotografia | Image Creator Studio | Híbrido |
| IMG-06 | Imagem e Fotografia | Character Creator | Híbrido |
| IMG-07 | Imagem e Fotografia | Consistent Character Studio | Híbrido |
| IMG-08 | Imagem e Fotografia | Product Photography Studio | Empresarial |
| IMG-09 | Imagem e Fotografia | AI Campaign Creator | Empresarial |
| IMG-10 | Imagem e Fotografia | Logo Creator & Redesign | Empresarial |
| IMG-11 | Imagem e Fotografia | Brand Identity Visual Kit | Empresarial |
| IMG-12 | Imagem e Fotografia | Social Media Design Kit | Híbrido |
| VID-01 | Conteúdo e Vídeo | Roteirista de Vídeos Virais | Híbrido |
| VID-02 | Conteúdo e Vídeo | Roteiro com Identidade Pessoal | Pessoal |
| VID-03 | Conteúdo e Vídeo | Script Improver | Híbrido |
| VID-04 | Conteúdo e Vídeo | Storytelling de Autoridade | Pessoal |
| VID-05 | Conteúdo e Vídeo | Content Repurposing Engine | Híbrido |
| VID-06 | Conteúdo e Vídeo | YouTube Script Architect | Híbrido |
| VID-07 | Conteúdo e Vídeo | Personal Brand Builder | Pessoal |
| VID-08 | Conteúdo e Vídeo | Creator Content Calendar | Híbrido |
| VID-09 | Conteúdo e Vídeo | AI Video Director | Híbrido |
| NEG-01 | Negócios e Produtos | Business in a Box | Empresarial |
| NEG-02 | Negócios e Produtos | Business Model Validator | Empresarial |
| NEG-03 | Negócios e Produtos | Market Research Pro | Empresarial |
| NEG-04 | Negócios e Produtos | Competitor Intelligence | Empresarial |
| NEG-05 | Negócios e Produtos | Niche Finder | Empresarial |
| NEG-06 | Negócios e Produtos | Offer Builder | Empresarial |
| NEG-07 | Negócios e Produtos | Website Architect | Empresarial |
| NEG-08 | Negócios e Produtos | Landing Page Conversion Pro | Empresarial |
| NEG-09 | Negócios e Produtos | App & SaaS Idea Builder | Empresarial |
| NEG-10 | Negócios e Produtos | E-commerce Launch Kit | Empresarial |
| PES-01 | Pesquisa e Decisão | Deep Research Analyst | Híbrido |
| PES-02 | Pesquisa e Decisão | Trend Radar | Empresarial |
| PES-03 | Pesquisa e Decisão | Idea Validator | Híbrido |
| PES-04 | Pesquisa e Decisão | Strategic Decision Maker | Híbrido |
| PES-05 | Pesquisa e Decisão | Business Diagnosis Pro | Empresarial |
| FIN-01 | Finanças e Trading | Financial Intelligence Analyst | Empresarial |
| FIN-02 | Finanças e Trading | Crypto Market Research | Pessoal |
| FIN-03 | Finanças e Trading | TradingView Chart Analyst | Pessoal |
| FIN-04 | Finanças e Trading | Technical Analysis Tutor | Pessoal |
| FIN-05 | Finanças e Trading | Crypto Risk Manager | Pessoal |
| FIN-06 | Finanças e Trading | Trading Strategy Backtester | Pessoal |
| FIN-07 | Finanças e Trading | Trading Journal Analyst | Pessoal |
| FIN-08 | Finanças e Trading | Binance Market Research Assistant | Pessoal |
| FIN-09 | Finanças e Trading | Macro & Crypto Intelligence | Híbrido |
| EST-01 | Estratégia e Execução | Arquiteto de Soluções Estratégicas | Híbrido |
| EST-02 | Estratégia e Execução | Pesquisador de Inteligência Atualizada | Híbrido |
| EST-03 | Estratégia e Execução | Analista Crítico e Verificador de Informações | Híbrido |
| EST-04 | Estratégia e Execução | Consultor de Decisões Complexas | Híbrido |
| EST-05 | Estratégia e Execução | Organizador de Conhecimento e Documentos | Híbrido |
| EST-06 | Estratégia e Execução | Diagnóstico Estratégico de Negócios | Empresarial |
| EST-07 | Estratégia e Execução | Estrategista de Crescimento e Escala | Empresarial |
| EST-08 | Estratégia e Execução | Analista Financeiro e de Viabilidade | Empresarial |
| EST-09 | Estratégia e Execução | Arquiteto de Produtos e Ofertas | Empresarial |
| EST-10 | Estratégia e Execução | Estrategista de Marketing e Aquisição | Empresarial |
| EST-11 | Estratégia e Execução | Engenheiro de Software e Auditor de Código | Empresarial |
| EST-12 | Estratégia e Execução | Arquiteto de Automação e Agentes de IA | Híbrido |
| EST-13 | Estratégia e Execução | Criador de Conteúdo Multicanal | Híbrido |
| EST-14 | Estratégia e Execução | Especialista em Vendas e Negociação | Empresarial |
| EST-15 | Estratégia e Execução | Gerente de Projetos e Execução | Híbrido |
| GLO-01 | Internacionalização e Expansão Global | Global Business Diagnostician | Empresarial |
| GLO-02 | Internacionalização e Expansão Global | International Market Finder | Empresarial |
| GLO-03 | Internacionalização e Expansão Global | Global Business Model Architect | Empresarial |
| GLO-04 | Internacionalização e Expansão Global | Internationalization Roadmap | Empresarial |
| GLO-05 | Internacionalização e Expansão Global | Global Brand Positioning | Empresarial |
| GLO-06 | Internacionalização e Expansão Global | International Revenue Architect | Empresarial |
| GLO-07 | Internacionalização e Expansão Global | Cross-Border Operations Planner | Empresarial |
| GLO-08 | Internacionalização e Expansão Global | Global Legal & Tax Researcher | Empresarial |
| GLO-09 | Internacionalização e Expansão Global | International Partnership Builder | Empresarial |
| GLO-10 | Internacionalização e Expansão Global | Global Valuation Strategist | Empresarial |

## Compatibilidade com a Ficha Única atual

A Ficha Única atual ainda armazena 16 variáveis planas em `afProjectContexts/{uid}/projects/principal`. Nesta entrega, a aplicação usa o escopo para limitar quais variáveis genéricas são injetadas nos prompts pessoais e empresariais. Isso é uma camada de compatibilidade, não a arquitetura final do Dossiê Inteligente.

A próxima evolução deve separar explicitamente:
1. Perfil pessoal do participante.
2. Dossiê de cada empresa/negócio.
3. Contexto específico de cada projeto.
4. Fontes e documentos autorizados por negócio/projeto.

A Ficha Única deverá montar uma visão de execução a partir das fontes relevantes, sem copiar indiscriminadamente todos os dados do perfil.

## Limites desta entrega

- Não altera autenticação, Firestore Rules, coleções ou dados existentes.
- Não implementa onboarding obrigatório.
- Não altera permissões, CRM, precificação ou ferramentas das cinco fases.
- Não torna campos obrigatórios; a classificação orienta apenas a seleção de contexto.
- A implementação precisa passar por revisão visual e teste autenticado antes de merge/publicação.
