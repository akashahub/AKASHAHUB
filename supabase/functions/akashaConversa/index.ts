import Stripe from "https://esm.sh/stripe@16.12.0?target=deno";

const SESSION_CENTS = 4500;
const CREDIT_CENTS = 4500;
const HOLD_MINUTES = 15;
const TIMES = ["10:00", "11:00", "15:00", "16:00", "19:00"];
const SERVICES = ["conversar", "alinhamento", "sessao"];
const CHANNELS = ["whatsapp-audio", "whatsapp-video", "zoom", "meet"];
const WA_HUB = Deno.env.get("HUB_WHATSAPP") || "5571983448621";
const WA_MENTOR = Deno.env.get("MENTOR_WHATSAPP") || "5571983448621";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "yanfili.simon@gmail.com";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-akasha-admin",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const raw = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (signature) return webhook(raw, signature);
  let body: Record<string, unknown> = {};
  try { body = raw ? JSON.parse(raw) : {}; } catch { return json({ error: "invalid_json" }, 400); }
  await expireHolds();
  const action = String(body.action || "");
  if (action === "config") return json(publicConfig());
  if (action === "slots") return json(await slots(String(body.from || "")));
  if (action === "hold") return hold(body);
  if (action === "details") return details(body);
  if (action === "checkout") return checkout(body);
  if (action === "status") return status(body);
  if (action === "lookup") return lookup(body);
  if (action === "event") return track(body);
  if (action === "admin") return admin(req, body);
  return json({ error: "unknown_action" }, 400);
});

function publicConfig() {
  return {
    cents: SESSION_CENTS,
    credit_cents: CREDIT_CENTS,
    currency: "brl",
    minutes: 15,
    refund_hours: 48,
    channels: CHANNELS,
    services: SERVICES,
  };
}

function dayKey(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function brtNow() {
  return new Date(Date.now() - 3 * 60 * 60 * 1000);
}

async function slots(from: string) {
  const start = brtNow();
  start.setUTCHours(0, 0, 0, 0);
  const days: string[] = [];
  for (let i = 0; i < 16 && days.length < 12; i++) {
    const date = new Date(start.getTime() + i * 86400000);
    if (date.getUTCDay() === 0) continue;
    days.push(dayKey(date));
  }
  const first = from && /^\d{4}-\d{2}-\d{2}$/.test(from) ? from : days[0];
  const rows = await rest("akasha_appointments?select=date,start_time,status&date=gte." + first + "&status=in.(held,pending_payment,confirmed)", { method: "GET" });
  if (rows && rows.error) return { error: rows.error, days: [] };
  const blocks = await rest("akasha_availability?select=date,start_time,status&date=gte." + first, { method: "GET" });
  const taken = new Set((Array.isArray(rows) ? rows : []).map((r) => r.date + " " + r.start_time));
  const closed = new Set((Array.isArray(blocks) ? blocks : []).filter((r) => r.status === "closed").map((r) => r.date + " " + r.start_time));
  const extra = (Array.isArray(blocks) ? blocks : []).filter((r) => r.status === "open");
  const today = dayKey(brtNow());
  const hour = brtNow().getUTCHours();
  const minute = brtNow().getUTCMinutes();
  const out = days.map((date) => {
    const times = TIMES.filter((time) => {
      const key = date + " " + time;
      if (taken.has(key) || closed.has(key)) return false;
      if (date === today) {
        const [h, m] = time.split(":").map(Number);
        if (h < hour || (h === hour && m <= minute)) return false;
      }
      return true;
    });
    extra.filter((r) => r.date === date && !taken.has(date + " " + r.start_time)).forEach((r) => {
      if (!times.includes(r.start_time)) times.push(r.start_time);
    });
    times.sort();
    return { date, times };
  }).filter((d) => d.times.length);
  return { days: out };
}

async function hold(body: Record<string, unknown>) {
  const service = String(body.service || "");
  const date = String(body.date || "");
  const start = String(body.start_time || "");
  if (!SERVICES.includes(service)) return json({ error: "service" }, 400);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(start)) return json({ error: "slot" }, 400);
  const open = await slots(date);
  const day = (open.days || []).find((d: { date: string }) => d.date === date);
  if (!day || !day.times.includes(start)) return json({ error: "unavailable" }, 409);
  const code = String(100000 + Math.floor(Math.random() * 900000));
  const end = addMinutes(start, 15);
  const row = {
    service,
    objective: clip(body.objective, 280),
    date,
    start_time: start,
    end_time: end,
    status: "held",
    payment_status: "unpaid",
    amount_cents: SESSION_CENTS,
    session_credit_cents: CREDIT_CENTS,
    access_code: code,
    expires_at: new Date(Date.now() + HOLD_MINUTES * 60000).toISOString(),
    recording_consent: false,
    recording_status: "pending",
  };
  const created = await rest("akasha_appointments", { method: "POST", body: JSON.stringify(row) });
  if (created && created.error === "supabase_not_configured") return json({ error: "supabase_not_configured" }, 503);
  if (created && (created.error || created.code === "23505")) return json({ error: "unavailable" }, 409);
  const item = Array.isArray(created) ? created[0] : created;
  await event(item.id, "time_selected", { date, start });
  return json({ id: item.id, access_code: code, expires_at: item.expires_at, cents: SESSION_CENTS });
}

async function details(body: Record<string, unknown>) {
  const id = String(body.id || "");
  const code = String(body.access_code || "");
  const email = cleanEmail(body.email);
  const phone = digits(body.phone);
  const name = clip(body.name, 80);
  const channel = String(body.channel || "");
  if (!name || !email.includes("@") || phone.length < 10) return json({ error: "contact" }, 400);
  if (!CHANNELS.includes(channel)) return json({ error: "channel" }, 400);
  if (body.recording_consent !== true) return json({ error: "consent" }, 400);
  const current = await one(id);
  if (!current || current.access_code !== code) return json({ error: "not_found" }, 404);
  if (!["held", "pending_payment"].includes(current.status)) return json({ error: "closed" }, 409);
  if (new Date(current.expires_at).getTime() < Date.now()) return json({ error: "expired" }, 409);
  const customer = await upsertCustomer(name, email, phone);
  const patch = {
    customer_id: customer?.id || null,
    customer_name: name,
    customer_email: email,
    customer_phone: phone,
    channel,
    meeting_type: channel,
    note: clip(body.note, 500),
    objective: clip(body.objective, 280) || current.objective,
    recording_consent: true,
    updated_at: new Date().toISOString(),
  };
  const saved = await rest("akasha_appointments?id=eq." + id, { method: "PATCH", body: JSON.stringify(patch) });
  if (saved.error) return json({ error: "save" }, 500);
  return json({ ok: true, id });
}

async function checkout(body: Record<string, unknown>) {
  const key = Deno.env.get("STRIPE_SECRET_KEY") || "";
  if (!key) return json({ error: "stripe_not_configured" }, 503);
  const id = String(body.id || "");
  const code = String(body.access_code || "");
  const current = await one(id);
  if (!current || current.access_code !== code) return json({ error: "not_found" }, 404);
  if (!current.customer_email || !current.recording_consent) return json({ error: "details" }, 400);
  if (!["held", "pending_payment"].includes(current.status)) return json({ error: "closed" }, 409);
  if (new Date(current.expires_at).getTime() < Date.now()) {
    await rest("akasha_appointments?id=eq." + id, { method: "PATCH", body: JSON.stringify({ status: "expired" }) });
    return json({ error: "expired" }, 409);
  }
  const stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  const metadata = { source: "akasha-converse", appointment_id: id };
  const session = await openCheckout(stripe, {
    mode: "payment",
    customer_email: current.customer_email,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "brl",
        unit_amount: SESSION_CENTS,
        product_data: { name: "Sessão individual Akasha Hub · 15 min" },
      },
    }],
    success_url: "https://akashahub.com.br/converse/?appointment=" + id,
    cancel_url: "https://akashahub.com.br/converse/?appointment=" + id + "&cancel=1",
    metadata,
    payment_intent_data: { metadata },
  });
  await rest("akasha_appointments?id=eq." + id, {
    method: "PATCH",
    body: JSON.stringify({
      status: "pending_payment",
      payment_method: "stripe",
      stripe_checkout_session_id: session.id,
      expires_at: new Date(Date.now() + 30 * 60000).toISOString(),
      updated_at: new Date().toISOString(),
    }),
  });
  await event(id, "checkout_started", { session: session.id });
  return json({ url: session.url });
}

async function status(body: Record<string, unknown>) {
  const current = await one(String(body.id || ""));
  const email = cleanEmail(body.email);
  const code = String(body.access_code || "");
  if (!current) return json({ error: "not_found" }, 404);
  const allowed = (email && email === current.customer_email) || (code && code === current.access_code);
  if (!allowed) return json({ error: "not_found" }, 404);
  return json(publicView(current));
}

async function lookup(body: Record<string, unknown>) {
  const email = cleanEmail(body.email);
  const code = String(body.code || "");
  if (!email || code.length < 4) return json({ error: "lookup" }, 400);
  const rows = await rest("akasha_appointments?select=*&customer_email=eq." + encodeURIComponent(email) + "&access_code=eq." + encodeURIComponent(code) + "&order=created_at.desc&limit=1", { method: "GET" });
  const current = Array.isArray(rows) ? rows[0] : null;
  if (!current) return json({ error: "not_found" }, 404);
  return json(publicView(current));
}

async function webhook(raw: string, signature: string) {
  const key = Deno.env.get("STRIPE_SECRET_KEY") || "";
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
  if (!key || !secret) return json({ error: "webhook_not_configured" }, 503);
  const stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  let eventObj;
  try { eventObj = await stripe.webhooks.constructEventAsync(raw, signature, secret); }
  catch { return json({ error: "bad_signature" }, 400); }
  if (eventObj.type === "checkout.session.completed" || eventObj.type === "checkout.session.async_payment_succeeded") {
    const session = eventObj.data.object;
    if (session.metadata?.source !== "akasha-converse") return json({ ignored: true });
    if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") return json({ waiting: true });
    const id = String(session.metadata.appointment_id || "");
    const current = await one(id);
    if (!current) return json({ error: "missing_appointment" }, 404);
    if (current.status === "confirmed" && current.stripe_checkout_session_id === session.id) return json({ duplicate: true });
    if (session.amount_total !== SESSION_CENTS) return json({ error: "amount" }, 400);
    await rest("akasha_appointments?id=eq." + id, {
      method: "PATCH",
      body: JSON.stringify({
        status: "confirmed",
        payment_status: "paid",
        payment_method: "stripe",
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : current.stripe_payment_intent_id,
        expires_at: null,
        updated_at: new Date().toISOString(),
      }),
    });
    await event(id, "appointment_confirmed", { session: session.id });
    const fresh = await one(id);
    if (fresh) await notify(fresh);
    return json({ confirmed: true });
  }
  if (eventObj.type === "checkout.session.expired") {
    const session = eventObj.data.object;
    const id = String(session.metadata?.appointment_id || "");
    if (id) {
      await rest("akasha_appointments?id=eq." + id + "&status=eq.pending_payment", {
        method: "PATCH",
        body: JSON.stringify({ status: "expired", updated_at: new Date().toISOString() }),
      });
    }
  }
  if (eventObj.type === "charge.refunded") {
    const charge = eventObj.data.object;
    const intent = String(charge.payment_intent || "");
    if (intent) {
      await rest("akasha_appointments?stripe_payment_intent_id=eq." + encodeURIComponent(intent), {
        method: "PATCH",
        body: JSON.stringify({ status: "refunded", payment_status: "refunded", refund_status: "completed", updated_at: new Date().toISOString() }),
      });
    }
  }
  return json({ ok: true });
}

async function admin(req: Request, body: Record<string, unknown>) {
  const token = Deno.env.get("AKASHA_ADMIN_TOKEN") || "";
  if (!token) return json({ error: "admin_not_configured" }, 503);
  if (req.headers.get("x-akasha-admin") !== token) return json({ error: "forbidden" }, 403);
  const op = String(body.op || "list");
  if (op === "list") {
    const filter = String(body.status || "");
    const query = filter ? "&status=eq." + encodeURIComponent(filter) : "";
    const rows = await rest("akasha_appointments?select=*&order=date.asc,start_time.asc&limit=200" + query, { method: "GET" });
    return json({ rows: Array.isArray(rows) ? rows : [] });
  }
  const id = String(body.id || "");
  const current = await one(id);
  if (!current) return json({ error: "not_found" }, 404);
  if (op === "confirm_manual") {
    const method = body.payment_method === "mentor" ? "mentor" : "whatsapp";
    await rest("akasha_appointments?id=eq." + id, {
      method: "PATCH",
      body: JSON.stringify({ status: "confirmed", payment_status: "paid", payment_method: method, expires_at: null, updated_at: new Date().toISOString() }),
    });
    const fresh = await one(id);
    if (fresh) await notify(fresh);
    return json({ ok: true });
  }
  if (op === "cancel") {
    await rest("akasha_appointments?id=eq." + id, { method: "PATCH", body: JSON.stringify({ status: "cancelled", updated_at: new Date().toISOString() }) });
    await event(id, "appointment_cancelled", {});
    return json({ ok: true });
  }
  if (op === "reschedule") {
    const date = String(body.date || "");
    const start = String(body.start_time || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(start)) return json({ error: "slot" }, 400);
    const saved = await rest("akasha_appointments?id=eq." + id, {
      method: "PATCH",
      body: JSON.stringify({ date, start_time: start, end_time: addMinutes(start, 15), updated_at: new Date().toISOString() }),
    });
    if (saved.code === "23505" || saved.error) return json({ error: "unavailable" }, 409);
    return json({ ok: true });
  }
  if (op === "note" || op === "link" || op === "recording") {
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (op === "note") patch.note = clip(body.note, 500);
    if (op === "link") patch.meeting_link = clip(body.meeting_link, 300);
    if (op === "recording") {
      patch.recording_url = clip(body.recording_url, 400);
      patch.recording_status = "ready";
      await event(id, "recording_ready", {});
    }
    await rest("akasha_appointments?id=eq." + id, { method: "PATCH", body: JSON.stringify(patch) });
    return json({ ok: true });
  }
  if (op === "refund") {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    if (current.stripe_payment_intent_id && stripeKey) {
      const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
      await stripe.refunds.create({ payment_intent: current.stripe_payment_intent_id });
    }
    await rest("akasha_appointments?id=eq." + id, {
      method: "PATCH",
      body: JSON.stringify({ status: "refunded", payment_status: "refunded", refund_status: "completed", updated_at: new Date().toISOString() }),
    });
    await event(id, "refund_completed", {});
    return json({ ok: true });
  }
  if (op === "block") {
    await rest("akasha_availability?on_conflict=date,start_time,mentor_id", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: JSON.stringify({ date: body.date, start_time: body.start_time, end_time: addMinutes(String(body.start_time || "00:00"), 15), status: "closed", mentor_id: "yan" }),
    });
    return json({ ok: true });
  }
  return json({ error: "unknown_op" }, 400);
}

async function track(body: Record<string, unknown>) {
  const name = String(body.name || "").slice(0, 60);
  const allowed = ["modal_opened", "conversation_started", "service_selected", "date_selected", "whatsapp_selected", "manual_payment_selected", "refund_requested"];
  if (!allowed.includes(name)) return json({ ok: true });
  await event(String(body.appointment_id || "") || null, name, {});
  return json({ ok: true });
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

function publicView(row: Record<string, unknown>) {
  return {
    id: row.id,
    service: row.service,
    date: row.date,
    start_time: row.start_time,
    end_time: row.end_time,
    status: row.status,
    payment_status: row.payment_status,
    payment_method: row.payment_method,
    channel: row.channel,
    meeting_link: row.status === "confirmed" ? row.meeting_link : "",
    recording_status: row.recording_status,
    recording_url: row.recording_status === "ready" || row.recording_status === "sent" ? row.recording_url : "",
    amount_cents: row.amount_cents,
    session_credit_cents: row.session_credit_cents,
    refund_status: row.refund_status,
  };
}

async function notify(row: Record<string, string>) {
  const text = [
    "Olá, " + (row.customer_name || "") + ".",
    "Seu horário no Akasha Hub foi confirmado.",
    "Sessão: Alinhamento / Leitura estratégica",
    "Data: " + row.date,
    "Horário: " + row.start_time,
    "Investimento: R$ 45",
    "Sua sessão será realizada por " + (row.channel || "canal a combinar") + ".",
    row.meeting_link ? "Link: " + row.meeting_link : "",
    "A sessão é gravada com a autorização que você deu. A gravação aparece em Meu agendamento quando estiver pronta.",
    "Reembolso incondicional em até 48 horas após o pagamento.",
    "Suporte: https://wa.me/" + WA_HUB,
  ].filter(Boolean).join("\n");
  const internal = [
    "NOVO AGENDAMENTO CONFIRMADO",
    row.customer_name, row.customer_phone, row.customer_email,
    row.objective || "", row.date + " " + row.start_time,
    row.payment_method + " " + row.payment_status,
    row.stripe_checkout_session_id || "sem stripe",
    row.channel || "", row.note || "",
  ].join("\n");
  await event(row.id, "notify_queued", { client: text, internal });
  await sendMail(row.customer_email, "Seu alinhamento foi confirmado", text);
  await sendMail(ADMIN_EMAIL, "Novo agendamento confirmado · Akasha Hub", internal);
  await sendWhatsapp(row.customer_phone, text);
  await sendWhatsapp(WA_MENTOR, internal);
  if (WA_HUB !== WA_MENTOR) await sendWhatsapp(WA_HUB, internal);
}

async function sendMail(to: string, subject: string, text: string) {
  const key = Deno.env.get("RESEND_API_KEY") || "";
  const from = Deno.env.get("MAIL_FROM") || "";
  if (!key || !from || !to) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text }),
  });
}

async function sendWhatsapp(to: string, text: string) {
  const token = Deno.env.get("WHATSAPP_TOKEN") || "";
  const phoneId = Deno.env.get("WHATSAPP_PHONE_ID") || "";
  const number = digits(to);
  if (!token || !phoneId || number.length < 10) return;
  await fetch("https://graph.facebook.com/v20.0/" + phoneId + "/messages", {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: number, type: "text", text: { body: text } }),
  });
}

async function upsertCustomer(name: string, email: string, phone: string) {
  const rows = await rest("akasha_customers?on_conflict=email", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: JSON.stringify({ name, email, phone, updated_at: new Date().toISOString() }),
  });
  return Array.isArray(rows) ? rows[0] : rows;
}

async function one(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await rest("akasha_appointments?select=*&id=eq." + id + "&limit=1", { method: "GET" });
  return Array.isArray(rows) ? rows[0] : null;
}

async function expireHolds() {
  const now = new Date().toISOString();
  await rest("akasha_appointments?status=in.(held,pending_payment)&expires_at=lt." + now, {
    method: "PATCH",
    body: JSON.stringify({ status: "expired", updated_at: now }),
  });
}

async function event(appointmentId: string | null, name: string, payload: Record<string, unknown>) {
  await rest("akasha_events", { method: "POST", body: JSON.stringify({ appointment_id: appointmentId, name, payload }) });
}

async function rest(path: string, opts: { method: string; body?: string; prefer?: string }) {
  const url = Deno.env.get("SUPABASE_URL") || "";
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !key) return { error: "supabase_not_configured" };
  const res = await fetch(url + "/rest/v1/" + path, {
    method: opts.method,
    headers: {
      apikey: key,
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      Prefer: opts.prefer || "return=representation",
    },
    body: opts.body,
  });
  const text = await res.text();
  if (!text) return res.ok ? [] : { error: res.status };
  try {
    const data = JSON.parse(text);
    if (!res.ok) return { error: data.message || data.code || res.status, code: data.code };
    return data;
  } catch { return { error: text }; }
}

function addMinutes(hhmm: string, minutes: number) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return String(Math.floor(total / 60)).padStart(2, "0") + ":" + String(total % 60).padStart(2, "0");
}
function clip(value: unknown, max: number) { return String(value || "").trim().slice(0, max); }
function cleanEmail(value: unknown) { return String(value || "").trim().toLowerCase(); }
function digits(value: unknown) { return String(value || "").replace(/\D/g, ""); }

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
