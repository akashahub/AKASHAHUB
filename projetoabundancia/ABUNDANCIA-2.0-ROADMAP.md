# Projeto Abundância 2.0 — Auditoria e plano de execução

## Auditoria inicial — 10/11/2026

Repositório: akashahub/AKASHAHUB  
Branch-base: main  
Área existente: projetoabundancia/  
Arquivo principal: projetoabundancia/index.html  
SHA inicial do arquivo: 77d8b4f814627e21e66fe435136b00be1eb81400

### O que foi confirmado

- 118 itens originais.
- 14 categorias originais.
- Capas de categoria referenciadas em Cloudinary e imagens locais em projetoabundancia/img/.
- Busca, filtros de prioridade/status, preço unitário, quantidade, status, notas, subtotais, CSV e impressão.
- A meta patrimonial inicial de R$ 100.000 é calculada a partir de itens comprados na categoria Patrimônio e Investimentos.
- Persistência original exclusivamente em localStorage: abundancia_state, abundancia_monthly, abundancia_goal e abundancia_months.
- A página original não continha autenticação Firebase nem sincronização entre dispositivos.
- O rótulo "Área exclusiva do mentor" no rodapé não constituía controle efetivo de acesso.

### Cash Flow existente

A AF Plataforma já possui autenticação Firebase e grava o Cash Flow em:

afTools/{uid}/tools/cashflow

O acesso passa por getAfTool(uid, "cashflow") em afplataforma/firebase/firestore.js. O Projeto Abundância deve consultar esses dados somente em leitura; não deve editar nem duplicar os lançamentos.

Firebase existente: projeto hub-akasha, configuração compartilhada em afplataforma/firebase/firebase-config.js.

### Restrições de integridade

1. Não remover ou substituir os 118 itens, categorias, capas, imagens ou recursos originais.
2. Preservar as chaves antigas do localStorage e oferecer migração sem sobrescrever silenciosamente dados locais ou remotos.
3. Não alterar a Gestão do Mentor além do botão de acesso já definido pelo usuário.
4. Restringir a página e os dados ao e-mail autorizado yanfili.simon@gmail.com.
5. Cash Flow em modo somente leitura.
6. Alterações no Firestore devem ser aditivas e ter regras próprias.
7. Não publicar regras Firebase automaticamente sem validação do projeto correto.

## Primeira entrega — Fundação

- Adicionar autenticação Firebase ao Projeto Abundância, restrita ao e-mail autorizado e com e-mail verificado.
- Criar caminho Firestore independente projetoAbundancia/{uid}/state/main.
- Preservar o estado local original e apresentar escolha explícita quando os dados locais divergirem dos dados da nuvem.
- Preparar sincronização dos dados novos.
- Adicionar leitura do Cash Flow existente sem escrita.
- Adotar fundo claro e cards com tonalidades suaves distintas.
- Adicionar as primeiras áreas do Centro de Comando: Visão 360°, Financeiro, Money Engine, Execução, Instagram e Integrações.

## Próximas fases

1. Inventário: preços sugeridos pesquisáveis, preço real, prioridade editável, quantidades adquiridas, links, datas e orçamento por categoria.
2. Engenharia financeira: despesas recorrentes, receitas, reservas, recebimentos, custos e projeções de 3, 6 e 12 meses.
3. Money Engine: ofertas, margem, pipeline comercial, leads, reuniões, propostas, conversões e simulador conservador/realista/agressivo.
4. Social Intelligence: análise do Instagram baseada em dados fornecidos ou integração autorizada, calendário e métricas.
5. Execução: tarefas recorrentes, hábitos, metas e revisões.
6. Progresso 360°: pesos editáveis e indicadores calculados com dados verificáveis.
7. Integrações adicionais: auditar uma a uma antes de conectar.

## Pendências de publicação e validação

- Publicar as novas regras Firestore no projeto Firebase correto após revisão.
- Testar login autorizado, login não autorizado, e-mail não verificado, persistência e isolamento.
- Testar migração local/nuvem em cópia de dados.
- Testar Cash Flow com dados reais do usuário, sem modificá-los.
- Testar desktop e mobile.
- Confirmar deploy estático e ausência de regressões.

A implementação desta branch não deve ser considerada produção até essas validações.
