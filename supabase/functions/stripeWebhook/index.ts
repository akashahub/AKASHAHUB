const PRICE_ENV: Record<string, string> = {
  STRIPE_PRICE_ANUBIS: "anubis",
  STRIPE_PRICE_HORUS: "horus",
  STRIPE_PRICE_ISIS: "isis",
  STRIPE_PRICE_AMONRA: "amonra",
};

const PLAN_NIVEL: Record<string, number> = {
  anubis: 1,
  horus: 2,
  isis: 3,
  amonra: 4,
};

function planFromPrice(priceId: string | undefined, sec: Record<string, string>) {
  if (!priceId) return null;
  for (const [env, id] of Object.entries(PRICE_ENV)) {
    if (sec[env] === priceId) return { id, nivel: PLAN_NIVEL[id] };
  }
  return null;
}

function planFromMeta(planId: string | undefined) {
  const id = String(planId || "").toLowerCase();
  if (!PLAN_NIVEL[id]) return null;
  return { id, nivel: PLAN_NIVEL[id] };
}

async function stripeGet(path: string, key: string) {
  const res = await fetch("https://api.stripe.com/v1" + path, {
    headers: { Authorization: "Bearer " + key },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "stripe_error");
  return data;
}

function hex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function verifyStripe(raw: string, header: string, secret: string) {
  const parts = Object.fromEntries(header.split(",").map((p) => {
    const i = p.indexOf("=");
    return [p.slice(0, i), p.slice(i + 1)];
  }));
  if (!parts.t || !parts.v1) throw new Error("missing signature");
  const age = Math.floor(Date.now() / 1000) - Number(parts.t);
  if (!Number.isFinite(age) || age > 300 || age < -300) throw new Error("stale signature");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${parts.t}.${raw}`));
  if (!safeEqual(hex(mac), parts.v1)) throw new Error("bad signature");
}

function b64url(input: string | ArrayBuffer) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
  let str = btoa(String.fromCharCode(...bytes));
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function googleAccessToken(sa: { client_email: string; private_key: string }) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const pem = sa.private_key.replace(/\\n/g, "\n");
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToDer(pem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${b64url(sig)}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || "google_token_failed");
  return data.access_token as string;
}

function pemToDer(pem: string) {
  const body = pem.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\s+/g, "");
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

function strField(v: string | null) {
  return v == null ? { nullValue: null } : { stringValue: v };
}

async function loadSecrets() {
  const url = Deno.env.get("SUPABASE_URL") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !serviceKey) throw new Error("supabase_env_missing");
  const res = await fetch(url + "/rest/v1/app_secrets?select=name,value", {
    headers: {
      apikey: serviceKey,
      Authorization: "Bearer " + serviceKey,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("secrets_read_" + res.status);
  const rows = await res.json();
  const map: Record<string, string> = {};
  for (const row of rows) map[row.name] = row.value;
  return map;
}

async function writeNivel(uid: string, fields: Record<string, unknown>, raw: string) {
  if (!raw) throw new Error("firebase_service_account_missing");
  const sa = JSON.parse(raw);
  const token = await googleAccessToken(sa);
  const name = `projects/hub-akasha/databases/(default)/documents/users/${uid}`;
  const paths = Object.keys(fields);
  const mask = paths.map((p) => "updateMask.fieldPaths=" + encodeURIComponent(p)).join("&");
  const res = await fetch(
    "https://firestore.googleapis.com/v1/" + name + "?" + mask,
    {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, fields }),
    },
  );
  if (res.status === 404) {
    const created = await fetch(
      "https://firestore.googleapis.com/v1/projects/hub-akasha/databases/(default)/documents/users?documentId=" + encodeURIComponent(uid),
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      },
    );
    if (!created.ok) throw new Error("firestore_create_" + created.status);
    return;
  }
  if (!res.ok) throw new Error("firestore_patch_" + res.status);
}

function firestoreArray(doc: any, key: string): string[] {
  return (doc?.fields?.[key]?.arrayValue?.values || []).map((v: any) => String(v.stringValue || "")).filter(Boolean);
}
async function grantIndividualProduct(email: string, meta: Record<string, string>, saRaw: string) {
  if (!email || !meta.kind || !meta.area || !saRaw) throw new Error("individual_grant_missing_fields");
  const sa = JSON.parse(saRaw);
  const token = await googleAccessToken(sa);
  const docUrl = "https://firestore.googleapis.com/v1/projects/hub-akasha/databases/(default)/documents/membrosAcessos/" + encodeURIComponent(email);
  const currentRes = await fetch(docUrl, { headers: { Authorization: "Bearer " + token } });
  let current: any = {};
  if (currentRes.ok) current = await currentRes.json();
  else if (currentRes.status !== 404) throw new Error("firestore_grant_read_" + currentRes.status);
  const areas = firestoreArray(current, "areas"), cursos = firestoreArray(current, "cursos"), livros = firestoreArray(current, "livros"), audios = firestoreArray(current, "audios");
  const key = meta.area + ":" + (meta.item || "");
  const add = (arr: string[], value: string) => { if (value && !arr.includes(value)) arr.push(value); };
  if (meta.kind === "area") add(areas, meta.area);
  else if (meta.kind === "curso") add(cursos, key);
  else if (meta.kind === "livro") add(livros, key);
  else if (meta.kind === "audio") add(audios, key);
  else throw new Error("unknown_product_kind");
  const arr = (values: string[]) => ({ arrayValue: { values: values.map((v) => ({ stringValue: v })) } });
  const fields = { areas: arr(areas), cursos: arr(cursos), livros: arr(livros), audios: arr(audios), email: { stringValue: email }, updatedAt: { timestampValue: new Date().toISOString() } };
  const mask = ["areas", "cursos", "livros", "audios", "email", "updatedAt"].map((p) => "updateMask.fieldPaths=" + encodeURIComponent(p)).join("&");
  const write = await fetch(docUrl + "?" + mask, { method: "PATCH", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify({ fields }) });
  if (write.status === 404) {
    const create = await fetch("https://firestore.googleapis.com/v1/projects/hub-akasha/databases/(default)/documents/membrosAcessos?documentId=" + encodeURIComponent(email), {
      method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify({ fields }),
    });
    if (!create.ok) throw new Error("firestore_grant_create_" + create.status);
  } else if (!write.ok) throw new Error("firestore_grant_write_" + write.status);
}
async function recordIndividualPurchase(session: any, meta: Record<string, string>, emailStatus = "receipt_via_stripe") {
  const url = Deno.env.get("SUPABASE_URL") || "", serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !serviceKey) throw new Error("supabase_env_missing");
  const paymentId = typeof session.payment_intent === "string" ? session.payment_intent : session.id;
  const body = { session_id: String(session.id), payment_id: paymentId, firebase_uid: String(meta.firebaseUid || ""), buyer_email: String(meta.buyer || session.customer_details?.email || session.customer_email || "").trim().toLowerCase(), product_kind: String(meta.kind || ""), product_area: String(meta.area || ""), product_item: String(meta.item || ""), amount_cents: Number(session.amount_total || 0), currency: String(session.currency || "brl"), payment_status: "paid", granted_at: new Date().toISOString(), email_status: emailStatus };
  const res = await fetch(url + "/rest/v1/store_purchase_events?on_conflict=session_id", { method: "POST", headers: { apikey: serviceKey, Authorization: "Bearer " + serviceKey, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error("purchase_record_" + res.status);
}

const STORE_DIGITAL_DELIVERY: Record<string, { name: string; url: string }> = {
  "energia-sexual": {
    name: "Mini curso Energia Sexual",
    url: "https://akashahub.com.br/members/livros/energia-sexual.pdf",
  },
  "zero-ao-zen": {
    name: "Zero ao Zen - primeira edição",
    url: "https://akashahub.com.br/members/livros/zero-ao-zen.pdf",
  },
  "codigos-de-origem": {
    name: "Códigos de Origem",
    url: "https://akashahub.com.br/members/livros/codigos-de-origem.pdf",
  },
};

async function storeDeliveryAlreadySent(sessionId: string) {
  const url = Deno.env.get("SUPABASE_URL") || "", serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !serviceKey) throw new Error("supabase_env_missing");
  const res = await fetch(url + "/rest/v1/store_purchase_events?session_id=eq." + encodeURIComponent(sessionId) + "&select=email_status&limit=1", {
    headers: { apikey: serviceKey, Authorization: "Bearer " + serviceKey, Accept: "application/json" },
  });
  if (!res.ok) throw new Error("purchase_status_" + res.status);
  const rows = await res.json();
  return Array.isArray(rows) && rows[0]?.email_status === "sent";
}

async function deliverStoreDigitalProduct(session: any, meta: Record<string, string>, sec: Record<string, string>) {
  const sku = String(meta.sku || "");
  const product = STORE_DIGITAL_DELIVERY[sku];
  const email = String(meta.buyer || session.customer_details?.email || session.customer_email || "").trim().toLowerCase();
  if (!product) throw new Error("store_delivery_unknown_sku");
  if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) throw new Error("store_delivery_email_invalid");
  if (!sec.RESEND_API_KEY || !sec.MAIL_FROM) throw new Error("store_email_not_configured");
  if (await storeDeliveryAlreadySent(String(session.id))) return;

  const storeMeta = { ...meta, kind: "store", area: "akasha-store", item: sku, buyer: email };
  await recordIndividualPurchase(session, storeMeta, "pending_delivery");

  const text = [
    "Olá!",
    "",
    "Seu pagamento na Akasha Store foi confirmado.",
    "Produto: " + product.name,
    "Acesse o arquivo digital neste link: " + product.url,
    "",
    "Guarde este e-mail para consultar o acesso novamente.",
    "Se precisar de ajuda, fale com a equipe pelo WhatsApp: https://wa.me/5571983448621",
  ].join("\\n");
  const html = "<p>Olá!</p><p>Seu pagamento na <strong>Akasha Store</strong> foi confirmado.</p><p>Produto: <strong>" + product.name + "</strong></p><p><a href=\"" + product.url + "\">Abrir e baixar o produto digital</a></p><p>Guarde este e-mail para consultar o acesso novamente.</p><p>Suporte: <a href=\"https://wa.me/5571983448621\">WhatsApp Akasha</a></p>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + sec.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ from: sec.MAIL_FROM, to: [email], subject: "Seu produto digital · Akasha Store", text, html }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error("store_email_send_" + response.status + (detail ? ":" + detail.slice(0, 160) : ""));
  }
  await recordIndividualPurchase(session, storeMeta, "sent");
}

async function applyEntitlement(uid: string, plan: { id: string; nivel: number } | null, status: string, sub: { id?: string; customer?: string | { id?: string } } | null, sa: string) {
  const nivel = status === "active" || status === "trialing" || status === "past_due" ? (plan?.nivel || 0) : 0;
  const customer = typeof sub?.customer === "string" ? sub.customer : sub?.customer?.id || null;
  await writeNivel(uid, {
    nivel: { integerValue: String(nivel) },
    planId: strField(plan?.id || null),
    subscriptionStatus: { stringValue: status || "none" },
    accessSource: { stringValue: "stripe" },
    stripeSubscriptionId: strField(sub?.id || null),
    stripeCustomerId: strField(customer),
  }, sa);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method_not_allowed", { status: 405 });
  const sec = await loadSecrets();
  const key = sec.STRIPE_SECRET_KEY || "";
  const secret = sec.STRIPE_WEBHOOK_SECRET || "";
  const sa = sec.FIREBASE_SERVICE_ACCOUNT || "";
  if (!key || !secret || secret.includes("placeholder")) {
    return new Response("payments_not_configured", { status: 503 });
  }
  const raw = await req.text();
  try {
    await verifyStripe(raw, req.headers.get("stripe-signature") || "", secret);
  } catch (err) {
    return new Response("bad signature", { status: 400 });
  }
  const event = JSON.parse(raw);
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.mode === "payment" && session.payment_status === "paid" && session.metadata?.source === "akasha-members") {
        const meta = session.metadata || {};
        const email = String(meta.buyer || session.customer_details?.email || session.customer_email || "").trim().toLowerCase();
        await grantIndividualProduct(email, meta, sa);
        await recordIndividualPurchase(session, meta);
      } else if (session.mode === "payment" && session.payment_status === "paid" && session.metadata?.source === "akasha-store") {
        await deliverStoreDigitalProduct(session, session.metadata || {}, sec);
      } else if (session.mode === "subscription") {
        const uid = session.metadata?.firebaseUid || session.client_reference_id;
        const plan = planFromMeta(session.metadata?.planId);
        if (uid && plan && session.subscription) {
          const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          const sub = await stripeGet("/subscriptions/" + subId, key);
          await applyEntitlement(uid, plan, sub.status || "active", sub, sa);
        }
      }
    } else if (event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;
      if (session.mode === "payment" && session.payment_status === "paid" && session.metadata?.source === "akasha-members") {
        const meta = session.metadata || {};
        const email = String(meta.buyer || session.customer_details?.email || session.customer_email || "").trim().toLowerCase();
        await grantIndividualProduct(email, meta, sa);
        await recordIndividualPurchase(session, meta);
      } else if (session.mode === "payment" && session.payment_status === "paid" && session.metadata?.source === "akasha-store") {
        await deliverStoreDigitalProduct(session, session.metadata || {}, sec);
      }
    } else if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object;
      if (!sub.metadata?.purpose || sub.metadata.purpose === "akasha_membership") {
        const uid = sub.metadata?.firebaseUid;
        const plan = planFromMeta(sub.metadata?.planId) || planFromPrice(sub.items?.data?.[0]?.price?.id, sec);
        if (uid) await applyEntitlement(uid, plan, sub.status, sub, sa);
      }
    } else if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
      const invoice = event.data.object;
      const subId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
      if (subId) {
        const sub = await stripeGet("/subscriptions/" + subId, key);
        const uid = sub.metadata?.firebaseUid;
        const plan = planFromMeta(sub.metadata?.planId) || planFromPrice(sub.items?.data?.[0]?.price?.id, sec);
        if (uid) {
          await applyEntitlement(uid, plan, event.type === "invoice.payment_failed" ? "past_due" : (sub.status || "active"), sub, sa);
        }
      }
    } else if (event.type === "charge.refunded" && event.data.object.refunded === true) {
      const customerId = typeof event.data.object.customer === "string"
        ? event.data.object.customer
        : event.data.object.customer?.id;
      if (customerId) {
        const found = await stripeGet("/customers/" + customerId, key);
        const uid = found.metadata?.firebaseUid;
        if (uid) {
          await writeNivel(uid, {
            nivel: { integerValue: "0" },
            subscriptionStatus: { stringValue: "refunded" },
          }, sa);
        }
      }
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[stripeWebhook]", event.type, err instanceof Error ? err.message : err);
    return new Response("webhook_handler_failed", { status: 500 });
  }
});
