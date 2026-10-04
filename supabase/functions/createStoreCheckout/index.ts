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
  "japamala-sagrado": { name: "Japamala Sagrado", cents: 1000 },
};

const AREA_CENTS = { anubis: 17717, horus: 33870, isis: 269398, amon: 537755 };
const ITEM_CENTS = { curso: 2700, livro: 1700, audio: 700 };
const ITENS = {
  anubis: {
    curso: ["alinhamento", "7-dias", "casais", "tantra", "fascinacao"],
    livro: ["O Código Secreto do Universo", "Código Quântico", "Revelações Quânticas"],
    audio: ["Mente Crística", "Pai Nosso", "Avê Maria", "Cura das Feridas Invisíveis", "O Código Secreto do Universo"],
  },
  horus: {
    curso: ["senda", "prosperidade", "despertar"],
    livro: ["Código de Conduta", "O Que é Tantra?", "Shiva, Shakti e Shava", "Honrar a Deusa", "Tantra Descomplicado"],
    audio: [],
  },
  isis: {
    curso: ["paladins", "jornada"],
    livro: ["Autoestima Blindada", "Como Blindar Sua Mente?", "Triplex na Mente"],
    audio: [],
  },
  amon: {
    curso: ["zero"],
    livro: ["Coletânea Alinhamento Financeiro", "Códigos de Origem"],
    audio: [],
  },
};
const NOMES = {
  alinhamento: "Código de Alinhamento",
  "7-dias": "Desafio 7 Dias de Magnetismo",
  casais: "Ritual para Casais",
  tantra: "Tantra Diferente de Sexo",
  fascinacao: "O Poder da Fascinação",
  senda: "A Senda Tântrica",
  prosperidade: "Tantra Quântico e Prosperidade",
  despertar: "Despertar do Magnetismo",
  paladins: "Paladins: A Liderança dos Bons",
  jornada: "Jornada de Transformação",
  zero: "Do Zero ao Zen e Negócios",
};
const FAIXA = { anubis: "Anúbis", horus: "Hórus", isis: "Ísis", amon: "Rá" };

const cors = {
  "Access-Control-Allow-Origin": "https://akashahub.com.br",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const key = Deno.env.get("STRIPE_SECRET_KEY") || "";
  if (!key) return json({ error: "stripe_not_configured" }, 503);
  let body = {};
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const stripe = new Stripe(key, { apiVersion: "2024-06-20" });

  if (body.action === "grants") return json(await grants(stripe, body));

  const member = memberProduct(String(body.ref || ""));
  const product = member || CATALOG[String(body.sku || "")];
  if (!product) return json({ error: member === null && body.ref ? "unknown_ref" : "unknown_sku" }, 400);

  const success = safeUrl(body.success_url, "https://akashahub.com.br/store/sucesso/");
  const cancel = safeUrl(body.cancel_url, "https://akashahub.com.br/store/");
  const email = String(body.email || "").trim().toLowerCase();
  const metadata = member
    ? { source: "akasha-members", kind: member.kind, area: member.area, item: member.item, buyer: email }
    : { sku: String(body.sku || ""), source: "akasha-store", name: body.name || "" };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "brl",
        unit_amount: product.cents,
        product_data: { name: product.name },
      },
    }],
    success_url: success,
    cancel_url: cancel,
    customer_email: email || undefined,
    metadata,
    payment_intent_data: { metadata },
    payment_method_types: ["card"],
    allow_promotion_codes: true,
  });
  return json({ url: session.url, id: session.id });
});

function memberProduct(ref) {
  const parts = ref.split(":");
  const kind = parts[0];
  const area = parts[1];
  const item = parts.slice(2).join(":");
  if (!ITENS[area]) return null;
  if (kind === "area") {
    return { name: "Faixa " + (FAIXA[area] || area), cents: AREA_CENTS[area], kind, area, item: "" };
  }
  const lista = ITENS[area][kind];
  if (!lista || lista.indexOf(item) < 0) return null;
  const nome = kind === "curso" ? (NOMES[item] || item) : item;
  return { name: nome, cents: ITEM_CENTS[kind], kind, area, item };
}

function safeUrl(url, fallback) {
  try {
    const parsed = new URL(String(url || ""));
    if (parsed.hostname === "akashahub.com.br") return parsed.toString();
  } catch { /* ignore */ }
  return fallback;
}

async function emailFromToken(idToken) {
  const apiKey = "AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4";
  const res = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + apiKey, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) return "";
  const data = await res.json();
  return String(data.users?.[0]?.email || "").toLowerCase();
}

function addGrant(out, meta) {
  if (!meta || !meta.kind || !meta.area) return;
  if (meta.kind === "area" && !out.areas.includes(meta.area)) out.areas.push(meta.area);
  const key = meta.area + ":" + (meta.item || "");
  if (meta.kind === "curso" && meta.item && !out.cursos.includes(key)) out.cursos.push(key);
  if (meta.kind === "livro" && meta.item && !out.livros.includes(key)) out.livros.push(key);
  if (meta.kind === "audio" && meta.item && !out.audios.includes(key)) out.audios.push(key);
}

async function grants(stripe, body) {
  const email = await emailFromToken(String(body.idToken || ""));
  if (!email) return { error: "login", areas: [], cursos: [], livros: [], audios: [] };
  const out = { areas: [], cursos: [], livros: [], audios: [] };
  const sessions = Array.isArray(body.sessions) ? body.sessions.slice(0, 20) : [];
  for (const id of sessions) {
    if (!String(id).startsWith("cs_")) continue;
    try {
      const session = await stripe.checkout.sessions.retrieve(String(id));
      const buyer = String(session.metadata?.buyer || session.customer_email || "").toLowerCase();
      if (session.payment_status === "paid" && buyer === email) addGrant(out, session.metadata);
    } catch { /* sessão inválida */ }
  }
  try {
    const found = await stripe.paymentIntents.search({
      query: "status:'succeeded' AND metadata['buyer']:'" + email.replace(/'/g, "") + "'",
      limit: 100,
    });
    for (const pi of found.data || []) addGrant(out, pi.metadata);
  } catch { /* busca pode atrasar; a sessão acima cobre a volta do pagamento */ }
  return out;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}
