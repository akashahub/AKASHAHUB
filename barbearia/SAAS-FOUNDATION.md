# Akasha Hub Barbearia — fundação SaaS

## Estado atual

A rota `/barbearia/` continua sendo uma aplicação demonstrativa estática. A interface foi preparada para mobile, tablet e desktop. O estado da demonstração é salvo no armazenamento local do navegador, sem sincronização entre dispositivos ou usuários.

**Não estão ativos ainda:** autenticação, isolamento real de tenants no runtime, cobrança recorrente, webhooks, envio de WhatsApp, banco de dados em produção ou deploy de infraestrutura backend.

## Arquitetura alvo

- **Frontend:** aplicação web responsiva em `/barbearia/`.
- **Autenticação:** Supabase Auth.
- **Banco:** Supabase Postgres com Row Level Security (RLS).
- **Isolamento:** toda entidade operacional pertence a um `tenant_id`; nenhuma consulta do cliente deve escolher livremente outro tenant.
- **Pagamentos:** Stripe ou provedor compatível, integrado exclusivamente por backend/Edge Functions e webhooks assinados.
- **Operação:** Edge Functions para provisionamento de barbearia, gestão de membros, checkout, cancelamento, reconciliação de pagamentos e notificações.
- **Deploy:** o commit no branch padrão atualiza o repositório; a publicação do site depende do workflow/hosting já configurado.

## Modelo de dados inicial

O arquivo `supabase/schema.sql` define a base para:

- barbearias e membros com papéis;
- profissionais, clientes e serviços;
- planos e assinaturas;
- agendamentos com referências compostas limitadas ao mesmo tenant;
- produtos, vendas e itens de venda;
- trilha de auditoria.

As funções `is_tenant_member` e `has_tenant_role` apoiam as políticas de acesso. O provisionamento de tenants e memberships deve ser feito por backend confiável com service role. A chave service role nunca pode chegar ao navegador.

## Regras de produto que precisam ser fechadas antes de ativar cobrança

1. Definir limites de cada plano (visitas por semana/mês, serviços cobertos, dependentes e regras de uso).
2. Definir fuso horário, tolerância de atraso, cancelamento, falta e reagendamento.
3. Definir política de estorno, inadimplência, pausa e cancelamento de assinatura.
4. Definir comissão, repasse e fechamento de caixa por profissional.
5. Definir consentimento e retenção para dados pessoais e mensagens de marketing.

## Sequência recomendada de implementação

1. Criar projeto Supabase de produção e aplicar a migration revisada.
2. Implementar autenticação e onboarding: criar tenant + primeiro owner no backend.
3. Criar camada de acesso a dados com tenant derivado da sessão, nunca de um campo livre do browser.
4. Migrar agenda, clientes, serviços e planos para Postgres; adicionar validação de conflito de horário no backend.
5. Integrar checkout e portal de assinatura; confirmar estado somente por webhook assinado.
6. Adicionar permissões por papel, logs, testes RLS e testes de isolamento entre duas barbearias.
7. Implementar indicadores e alertas de gargalos com dados reais.
8. Configurar backups, monitoramento, política de privacidade e processo de suporte.

## Critérios mínimos de aceite

- Um usuário da Barbearia A não consegue ler, alterar ou inferir dados da Barbearia B.
- Um cliente não consegue confirmar pagamento apenas alterando estado no navegador.
- Dois agendamentos não podem ocupar o mesmo profissional no mesmo intervalo.
- Cancelamentos, faltas e créditos de assinatura são calculados no backend.
- Layout validado em 320 px, 360 px, 390 px, 768 px, 1024 px e 1440 px.
- Teclado, foco visível, contraste, mensagens de erro e estados vazios testados.

## Observação sobre o schema

O SQL é uma fundação inicial, não uma declaração de que o backend já está ativo. Revise-o em ambiente de staging, valide políticas RLS com usuários de tenants diferentes e acrescente constraints/transações específicas antes de processar dados ou pagamentos reais.
