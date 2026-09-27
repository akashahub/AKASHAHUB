# Akasha Store · Stripe

Loja: https://akashahub.com.br/store/
Checkout: https://akashahub.com.br/store/checkout/?sku=energia-sexual
Pós-venda: https://akashahub.com.br/store/sucesso/
Pós-venda da sala (já existia): https://akashahub.com.br/members/sucesso/

WhatsApp da loja: +55 71 98344-8621

## Ligar o Stripe de verdade

1. No Supabase do projeto `jsonmxbuzagmwuucruem`:
   - criar a function `createStoreCheckout` com `supabase/functions/createStoreCheckout/index.ts`
   - secret: `STRIPE_SECRET_KEY`
2. Success URL: `https://akashahub.com.br/store/sucesso/?sku={SKU}&session_id={CHECKOUT_SESSION_ID}`
3. Cancel URL: `https://akashahub.com.br/store/`
4. Atalho: cole um Payment Link no campo `paymentLink` de `store/catalog.js`
