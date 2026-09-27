import Stripe from "https://esm.sh/stripe@16.12.0?target=deno";

const CATALOG = {
  "teste-stripe": { name: "Teste Stripe", cents: 500 },
  "energia-sexual": { name: "Mini curso Energia Sexual", cents: 9700 },
  "zero-ao-zen": { name: "Zero ao Zen — primeira edição", cents: 4700 },
  "codigos-de-origem": { name: "Códigos de Origem", cents: 9700 },
  "camiseta-akasha": { name: "Camiseta Akasha", cents: 1000 },
  "banheira-go-arctic": { name: "Banheira de Imersão em Gelo Go Arctic", cents: 1000 },
  "cafeteira-hyllis": { name: "Cafeteira Portátil Hyllis", cents: 1000 },
  "escultura-anubis": { name: "Escultura Decorativa Anubis", cents: 1000 },
  "kit-cristais-chakras": { name: "Kit 7 Cristais Brutos dos Chakras", cents: 1000 },
  "oleos-essenciais": { name: "Coleção Óleos Essenciais Vitalize Aromas", cents: 1000 },
  "kit-ritual-limpeza": { name: "Kit Ritual de Limpeza", cents: 1000 },
  "incensario-nirvana": { name: "Incensário de Vidro Nirvana", cents: 1000 },
  "japamala-sagrado": { name: "Japamala Sagrado", cents: 1000 }
};

const cors = {
  "Access-Control-Allow-Origin": "https://akashahub.com.br",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const key = Deno.env.get("STRIPE_SECRET_KEY") || "";
  if (!key) return json({ error: "stripe_not_configured" }, 503);
  let body = {};
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const product = CATALOG[String(body.sku || "")];
  if (!product) return json({ error: "unknown_sku" }, 400);
  const stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  const success = body.success_url || "https://akashahub.com.br/store/sucesso/";
  const cancel = body.cancel_url || "https://akashahub.com.br/store/";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "brl",
        unit_amount: product.cents,
        product_data: { name: product.name }
      }
    }],
    success_url: success,
    cancel_url: cancel,
    customer_email: body.email || undefined,
    metadata: { sku: String(body.sku), source: "akasha-store", name: body.name || "" },
    payment_method_types: ["card"],
    allow_promotion_codes: true
  });
  return json({ url: session.url, id: session.id });
});

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" }
  });
}
