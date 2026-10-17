# Akasha Store · Stripe

Loja: https://akashahub.com.br/store/
Checkout: https://akashahub.com.br/store/checkout/?sku=energia-sexual
Pós-venda: https://akashahub.com.br/store/sucesso/
Pós-venda da sala: https://akashahub.com.br/members/sucesso/
WhatsApp da loja: +55 71 98344-8621

## Catálogo público e valores

Estes valores são a fonte exibida na vitrine. A Edge Function `createStoreCheckout` precisa manter os mesmos valores:

- Mini curso Energia Sexual: R$ 97,00
- Zero ao Zen - primeira edição: R$ 47,00
- Códigos de Origem: R$ 97,00

Os produtos físicos sem preço aprovado aparecem como **sob encomenda**, com consulta pelo WhatsApp. Não os recolocar no catálogo de checkout até ter preço, frete e condições reais definidos.

## Requisitos para produção

O site estático no GitHub Pages **não publica as Edge Functions do Supabase**. Configure e publique as duas funções abaixo no projeto Supabase `jsonmxbuzagmwuucruem`:

1. `createStoreCheckout` usando `supabase/functions/createStoreCheckout/index.ts`.
2. `stripeWebhook` usando `supabase/functions/stripeWebhook/index.ts`.

Configure os segredos no Supabase, sem colar valores secretos em conversas ou em arquivos versionados:

- `STRIPE_SECRET_KEY`: chave **live** da conta Stripe correta.
- `STRIPE_WEBHOOK_SECRET`: segredo de assinatura do endpoint live que aponta para `https://jsonmxbuzagmwuucruem.supabase.co/functions/v1/stripeWebhook`.
- `RESEND_API_KEY` e `MAIL_FROM`: envio e-mail da entrega digital.
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `FIREBASE_SERVICE_ACCOUNT`: necessários às rotinas de registro e aos acessos da área de membros.

O código lê segredos de ambiente e, para os que precisam, usa a tabela privada `app_secrets` como alternativa. Não armazene chaves secretas no frontend.

No painel da Stripe, registre o endpoint de webhook e habilite estes eventos usados pelo handler:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`
- `charge.refunded`

Success URL: `https://akashahub.com.br/store/sucesso/?sku={SKU}&session_id={CHECKOUT_SESSION_ID}`
Cancel URL: `https://akashahub.com.br/store/`

## Critérios antes de aceitar pagamentos live

- Confirme no painel da Stripe que a chave e o webhook são da mesma conta e estão em modo live.
- Confirme que a function `stripeWebhook` verifica a assinatura com o segredo do endpoint live.
- Confirme que `store_purchase_events` está disponível para registrar a compra e o status do e-mail.
- Faça uma compra real de baixo valor e verifique pagamento, e-mail, link do PDF e registro; reembolse o teste depois.
- Confirme que o checkout público rejeita e-mail inválido e não oferece pagamento para itens sob encomenda.

**Status do código:** preço vitrine/servidor alinhado; checkout da loja aceita comprador por e-mail, e a entrega digital exige configuração de e-mail. Isso não significa que as Edge Functions estejam publicadas no Supabase ou que a conta já tenha mudado para live.
