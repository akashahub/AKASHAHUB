# Histórico de alterações — auditoria Arquitetura de Legado

## 16/11/2026 — início da auditoria estruturada

- Identificado repositório `akashahub/AKASHAHUB`.
- Base de auditoria: commit `09e223a5ae83978adf0e2d00ecb1aa89d089b0c4` da branch `main`.
- Criada branch isolada `audit/arquitetura-legado-2026-11-16`.
- Lida árvore completa: 1.583 arquivos no repositório; 656 em `afplataforma/`; 64 em `al/`.
- Inspecionados: mapa de experiência do mentorando, regras Firestore, auth, storage, Firestore helper, app.js, fases.js, phase-launcher.js, phase-guidance.js, phase-checklists.js, AfApoio, catálogo de capacidades, ferramentas de Essência/Identidade/Branding, Website Studio, CRM, Fluxo de Caixa, SDR OS, Treinamento, Zen Negócios, Sessões e Central do Expert.
- Confirmado que `af-apoio.js` já oferece orientação, quiz sequencial, cópia de pacote e prompt contextual do mentor em 20 apps que chamam `AfApoio.mount`.
- Confirmado que a persistência varia entre coleções Firestore por app, `afTools`, `mentoria_respostas`, checklists em `mentorias` e localStorage.
- Confirmado que o Dashboard do Mentor atual possui administração de acesso, mas não um navegador central de diagnósticos/respostas por mentorando.
- Identificados riscos para revisão: regras abertas de `calls`/candidatos WebRTC; Central do Expert sem gate de autenticação identificado no HTML; leitura ampla de `legado_profiles`; aviso de privacidade incompatível com permissões; caminho `encontros` sem regra correspondente localizada.
- Foi preparado um piloto aditivo em `afplataforma/essencia/essencia.js`: após autenticação, lê `afEssencia/{uid}` com `getDoc` e reidrata somente as chaves já existentes no objeto `data`; não muda coleção nem formato do documento.
- O piloto ainda não foi testado em navegador/Firebase Emulator e permanece somente na branch de auditoria.
- Nenhuma regra Firebase foi alterada.
- Nenhum deploy foi realizado.

## Próximo registro

Adicionar aqui cada lote com data, arquivos, commit, testes, resultados, riscos remanescentes e decisão de deploy. Não registrar tarefa como concluída apenas porque o código foi enviado ao GitHub.
