const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const FIREBASE_API_KEY = "AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4";
const ADMIN_UID = "1GO7dRdFUFg2NwYwzOwjvtWfpAS2";
const cors = {
  "Access-Control-Allow-Origin": "https://akashahub.com.br",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "no-store"
};
function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}
async function firebaseUser(token: string) {
  if (!token) return null;
  const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + FIREBASE_API_KEY, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token })
  });
  if (!response.ok) return null;
  const data = await response.json();
  const user = data?.users?.[0];
  if (!user?.localId || user.disabled === true) return null;
  return user;
}
async function db(path: string, method: string, body?: unknown, prefer?: string) {
  const response = await fetch(SUPABASE_URL + "/rest/v1/" + path, {
    method,
    headers: {
      apikey: SERVICE_KEY, Authorization: "Bearer " + SERVICE_KEY,
      "Content-Type": "application/json", Accept: "application/json",
      ...(prefer ? { Prefer: prefer } : {})
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
  const raw = await response.text();
  if (!response.ok) throw new Error("database_" + response.status + ":" + raw.slice(0, 200));
  return raw ? JSON.parse(raw) : null;
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });
  if (!SUPABASE_URL || !SERVICE_KEY) return json(503, { error: "database_not_configured" });
  try {
    const auth = req.headers.get("Authorization") || "";
    const user = await firebaseUser(auth.startsWith("Bearer ") ? auth.slice(7) : "");
    if (!user) return json(401, { error: "invalid_firebase_token" });
    const body = await req.json();
    const action = String(body?.action || "");
    const uid = String(user.localId);
    if (action === "claim") {
      if (user.emailVerified !== true || !user.email) return json(403, { error: "verified_email_required" });
      const email = String(user.email).trim().toLowerCase();
      const candidates = await db("store_purchase_events?select=session_id,firebase_uid&buyer_email=eq." + encodeURIComponent(email), "GET") || [];
      let claimed = 0, alreadyOwned = 0, assignedElsewhere = 0;
      for (const row of candidates) {
        const existing = row.firebase_uid;
        if (existing === uid) { alreadyOwned++; continue; }
        if (existing !== null && existing !== "") { assignedElsewhere++; continue; }
        const session = String(row.session_id || "");
        if (!session) continue;
        const conditions = existing === null ? "&firebase_uid=is.null" : "&firebase_uid=eq.";
        const changed = await db("store_purchase_events?session_id=eq." + encodeURIComponent(session) + conditions, "PATCH", { firebase_uid: uid }, "return=representation") || [];
        if (Array.isArray(changed) && changed.length) claimed++;
      }
      return json(200, { ok: true, claimed, alreadyOwned, assignedElsewhere, verifiedEmail: email });
    }
    if (action === "my_purchases") {
      if (user.emailVerified !== true) return json(403, { error: "verified_email_required" });
      const rows = await db(
        "store_purchase_events?select=session_id,product_item,amount_cents,currency,payment_status,created_at,email_status&firebase_uid=eq." + encodeURIComponent(uid) + "&order=created_at.desc&limit=100",
        "GET"
      ) || [];
      return json(200, { ok: true, purchases: rows });
    }
    if (action === "admin_purchases") {
      if (uid !== ADMIN_UID) return json(403, { error: "admin_only" });
      const targetUid = String(body.uid || "").trim();
      if (!targetUid || targetUid.length > 160) return json(400, { error: "invalid_uid" });
      const rows = await db(
        "store_purchase_events?select=session_id,payment_id,buyer_email,product_kind,product_area,product_item,amount_cents,currency,payment_status,created_at,granted_at,email_status&firebase_uid=eq." + encodeURIComponent(targetUid) + "&order=created_at.desc&limit=100",
        "GET"
      ) || [];
      return json(200, { ok: true, purchases: rows });
    }
    return json(400, { error: "unknown_action" });
  } catch (error) {
    console.error("[storeAccount]", error);
    return json(500, { error: "store_account_failed" });
  }
});