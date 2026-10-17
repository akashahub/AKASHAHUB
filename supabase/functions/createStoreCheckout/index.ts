import Stripe from "https://esm.sh/stripe@16.12.0?target=deno";

const CATALOG = {
  "energia-sexual": { name: "Mini curso Energia Sexual", cents: 9700 },
  "zero-ao-zen": { name: "Zero ao Zen - primeira edição", cents: 4700 },
  "codigos-de-origem": { name: "Códigos de Origem", cents: 9700 },
};
const AREA_CENTS = { anubis: 17717, horus: 33870, isis: 269398, amon: 537755 };
const COURSE_PRICES: Record<string, number> = {
  "anubis:alinhamento": 18900, "anubis:7-dias": 18000,
  "anubis:alinhamento-akasha": 18900, "anubis:desafio-7-dias": 18000,
  "horus:techub": 6300, "horus:arte-da-analogia": 7200, "horus:arte-da-conquista": 7200,
  "horus:senda": 77700, "horus:despertar": 30000, "horus:prosperidade": 77700,
  "horus:senda-tantrica": 77700, "horus:tantra-prosperidade": 77700, "horus:despertar-magnetismo": 30000,
  "isis:paladins": 250000, "isis:jornada": 60000, "isis:jornada-transformacao": 60000, "amon:zero": 516300, "amon:zero-ao-zen": 516300,
};
const BOOK_PRICES: Record<string, number> = {
  "anubis:Código Secreto do Universo": 2500, "anubis:O Código Secreto do Universo": 2500,
  "anubis:Código Quântico": 4700, "anubis:Revelações Quânticas": 1500, "anubis:O Fim das Trevas": 1800,
  "horus:Código de Conduta dos que Despertam": 4200, "horus:Código de Conduta": 4200,
  "horus:O Que é Tantra?": 2500, "horus:Shiva, Shakti e Shava": 2500, "horus:Honrar a Deusa": 4200,
  "horus:Tantra Descomplicado": 2500, "horus:Mini Curso de Energia Sexual": 2500,
  "horus:A Arte da Conquista · Livro de Vendas": 3000,
  "isis:Paladin": 18700, "isis:Paladins": 18700, "isis:Tecnologia da Alma": 8700,
  "isis:Autoestima Blindada": 4300, "isis:Kemet": 3990, "isis:Triplex na Mente": 3990,
  "isis:Como Blindar Sua Mente?": 4300,
  "amon:Coletânea Alinhamento Financeiro": 9900, "amon:Toth, Hermes e Enoque": 1800,
  "amon:Do Zero ao Zen Negócios": 9900, "amon:Códigos de Origem": 9000,
};
const ITENS: Record<string, Record<string, string[]>> = {
  anubis: {
    curso: ["alinhamento", "7-dias", "casais", "tantra", "fascinacao", "alinhamento-akasha", "desafio-7-dias"],
    livro: ["Código Secreto do Universo", "O Código Secreto do Universo", "Código Quântico", "Revelações Quânticas", "O Fim das Trevas"],
    audio: ["Mente Crística", "Pai Nosso", "Avê Maria", "Cura das Feridas Invisíveis", "O Código Secreto do Universo"],
  },
  horus: {
    curso: ["techub", "arte-da-analogia", "arte-da-conquista", "senda", "prosperidade", "despertar", "senda-tantrica", "tantra-prosperidade", "despertar-magnetismo"],
    livro: ["Código de Conduta dos que Despertam", "Código de Conduta", "O Que é Tantra?", "Shiva, Shakti e Shava", "Honrar a Deusa", "Tantra Descomplicado", "Mini Curso de Energia Sexual", "A Arte da Conquista · Livro de Vendas"],
    audio: [],
  },
  isis: {
    curso: ["paladins", "jornada", "jornada-transformacao"],
    livro: ["Paladin", "Paladins", "Tecnologia da Alma", "Autoestima Blindada", "Kemet", "Triplex na Mente", "Como Blindar Sua Mente?"],
    audio: [],
  },
  amon: {
    curso: ["zero", "zero-ao-zen"],
    livro: ["Coletânea Alinhamento Financeiro", "Toth, Hermes e Enoque", "Do Zero ao Zen Negócios", "Códigos de Origem"],
    audio: [],
  },
};
const NOMES: Record<string, string> = {
  alinhamento: "Código de Alinhamento Akasha", "7-dias": "Desafio 7 Dias de Magnetismo",
  casais: "Ritual para Casais", tantra: "Tantra Diferente de Sexo", fascinacao: "O Poder da Fascinação",
  techub: "Techub", "arte-da-analogia": "A Arte da Analogia", "arte-da-conquista": "A Arte da Analogia",
  senda: "Senda Tântrica", prosperidade: "Tantra é Quântico e Prosperidade", despertar: "Despertar do Magnetismo",
  "senda-tantrica": "A Senda Tântrica", "tantra-prosperidade": "Tantra é Quântico e Prosperidade", "despertar-magnetismo": "Despertar do Magnetismo",
  paladins: "Paladins: A Liderança dos Bons", jornada: "Jornada de Transformação", "jornada-transformacao": "Jornada de Transformação", zero: "Do Zero ao Zen Negócios", "zero-ao-zen": "Do Zero ao Zen Negócios",
};
const FAIXA: Record<string, string> = { anubis: "Anúbis", horus: "Hórus", isis: "Ísis", amon: "Rá" };

const cors = {
  "Access-Control-Allow-Origin": "https://akashahub.com.br",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const key = await readAppSecret("STRIPE_SECRET_KEY");
  if (!key) return json({ error: "stripe_not_configured" }, 503);
  let body = {};
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const stripe = new Stripe(key, { apiVersion: "2024-06-20" });

  const identity = await firebaseIdentity(String(body.idToken || ""));
  if (body.action === "grants") {
    if (!identity.email || !identity.uid) return json({ error: "auth_required" }, 401);
    return json(await grants(stripe, body));
  }

  const member = memberProduct(String(body.ref || ""));
  const product = member || CATALOG[String(body.sku || "")];
  if (!product) return json({ error: member === null && body.ref ? "unknown_ref" : "unknown_sku" }, 400);
  if (member && (!identity.email || !identity.uid)) return json({ error: "auth_required" }, 401);

  const success = safeUrl(body.success_url, "https://akashahub.com.br/store/sucesso/");
  const cancel = safeUrl(body.cancel_url, "https://akashahub.com.br/store/");
  const submittedEmail = String(body.email || "").trim().toLowerCase().slice(0, 254);
  const email = member ? identity.email : (identity.email || submittedEmail);
  if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    return json({ error: "valid_email_required" }, 400);
  }
  if (!member) {
    const mailKey = await readAppSecret("RESEND_API_KEY");
    const mailFrom = await readAppSecret("MAIL_FROM");
    if (!mailKey || !mailFrom) return json({ error: "store_delivery_not_configured" }, 503);
  }
  const displayName = String(body.name || "").trim().slice(0, 120);
  const metadata = member
    ? { source: "akasha-members", kind: member.kind, area: member.area, item: member.item, buyer: email, firebaseUid: identity.uid }
    : { sku: String(body.sku || ""), source: "akasha-store", kind: "store", area: "akasha-store", item: String(body.sku || ""), name: displayName, buyer: email, firebaseUid: identity.uid || "" };

  const session = await openCheckout(stripe, {
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
    payment_intent_data: { metadata, receipt_email: email || undefined },
    allow_promotion_codes: true,
  });
  return json({ url: session.url, id: session.id });
});

function memberProduct(ref: string) {
  const parts = ref.split(":");
  const kind = parts[0];
  const area = parts[1];
  const item = parts.slice(2).join(":");
  if (kind === "area") {
    if (!AREA_CENTS[area]) return null;
    return { name: "Faixa " + FAIXA[area], cents: AREA_CENTS[area], kind, area, item: "" };
  }
  if (!ITENS[area] || !["curso", "livro", "audio"].includes(kind)) return null;
  if (!(ITENS[area][kind] || []).includes(item)) return null;
  const key = area + ":" + item;
  const cents = kind === "curso" ? COURSE_PRICES[key] : kind === "livro" ? BOOK_PRICES[key] : 700;
  if (!Number.isInteger(cents) || cents <= 0) return null;
  return { name: NOMES[item] || item, cents, kind, area, item };
}

async function openCheckout(stripe, fields) {
  try {
    return await stripe.checkout.sessions.create({
      ...fields,
      payment_method_types: ["card", "pix"],
      payment_method_options: { pix: { expires_after_seconds: 1800 } },
    });
  } catch (err) {
    const message = String(err && err.message || "");
    if (!/pix/i.test(message)) throw err;
    return stripe.checkout.sessions.create({
      ...fields,
      payment_method_types: ["card"],
    });
  }
}

function safeUrl(url, fallback) {
  try {
    const parsed = new URL(String(url || ""));
    if (parsed.hostname === "akashahub.com.br") return parsed.toString();
  } catch { /* ignore */ }
  return fallback;
}

async function readAppSecret(name: string) {
  const direct = Deno.env.get(name) || "";
  if (direct) return direct;
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!supabaseUrl || !serviceKey) return "";
  try {
    const res = await fetch(supabaseUrl + "/rest/v1/app_secrets?name=eq." + encodeURIComponent(name) + "&select=value", {
      headers: { apikey: serviceKey, Authorization: "Bearer " + serviceKey, Accept: "application/json" },
    });
    if (!res.ok) return "";
    const rows = await res.json();
    return String(rows?.[0]?.value || "");
  } catch {
    return "";
  }
}

async function firebaseIdentity(idToken: string) {
  if (!idToken) return { email: "", uid: "" };
  const apiKey = "AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4";
  const res = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + apiKey, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) return { email: "", uid: "" };
  const data = await res.json();
  const u = data.users?.[0] || {};
  return { email: String(u.email || "").trim().toLowerCase(), uid: String(u.localId || "") };
}

async function emailFromToken(idToken: string) {
  return (await firebaseIdentity(idToken)).email;
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
