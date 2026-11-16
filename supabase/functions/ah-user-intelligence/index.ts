const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FIREBASE_API_KEY = "AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4";
const ALLOWED_EVENTS = new Set(["session_start", "page_view", "department_view", "heartbeat", "logout"]);

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

async function verifyFirebaseToken(token: string) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    },
  );
  if (!response.ok) return null;
  const data = await response.json();
  const user = data?.users?.[0];
  if (!user?.localId || user.disabled === true) return null;
  return user;
}

async function supabaseRequest(path: string, method: string, body?: unknown, prefer?: string) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Database request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  return response;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return json(401, { error: "missing_firebase_token" });

    const firebaseUser = await verifyFirebaseToken(token);
    if (!firebaseUser) return json(401, { error: "invalid_firebase_token" });

    const input = await req.json();
    const eventType = String(input?.eventType || "");
    const sessionId = String(input?.sessionId || "");
    if (!ALLOWED_EVENTS.has(eventType)) return json(400, { error: "invalid_event_type" });
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
      return json(400, { error: "invalid_session_id" });
    }

    const uid = String(firebaseUser.localId);
    const rawPath = String(input?.path || "/").split("?")[0].slice(0, 300);
    const path = rawPath.startsWith("/") ? rawPath : "/";
    const department = String(input?.department || "").slice(0, 80) || null;
    const userAgent = String(req.headers.get("user-agent") || "").slice(0, 300);
    const now = new Date().toISOString();

    if (eventType === "logout") {
      await supabaseRequest(
        `ah_user_sessions?session_id=eq.${encodeURIComponent(sessionId)}&firebase_uid=eq.${encodeURIComponent(uid)}`,
        "PATCH",
        { ended_at: now, last_seen_at: now },
        "return=minimal",
      );
    } else {
      await supabaseRequest(
        "ah_user_sessions?on_conflict=session_id",
        "POST",
        {
          session_id: sessionId,
          firebase_uid: uid,
          last_seen_at: now,
          current_path: path,
          current_department: department,
          user_agent: userAgent,
          ...(eventType === "session_start" ? { started_at: now, ended_at: null } : {}),
        },
        "resolution=merge-duplicates,return=minimal",
      );
    }

    if (eventType !== "heartbeat") {
      await supabaseRequest(
        "ah_user_activity",
        "POST",
        {
          firebase_uid: uid,
          session_id: sessionId,
          event_type: eventType,
          page_path: path,
          department,
          occurred_at: now,
          metadata: {},
        },
        "return=minimal",
      );
    }

    return json(200, { ok: true });
  } catch (error) {
    console.error("[ah-user-intelligence]", error);
    return json(500, { error: "tracking_failed" });
  }
});
