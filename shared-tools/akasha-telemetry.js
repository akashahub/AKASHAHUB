const ENDPOINT = "https://jsonmxbuzagmwuucruem.supabase.co/functions/v1/ah-user-intelligence";
const SUPABASE_PUBLIC_KEY = "sb_publishable_cZOBLAGhZVoJ5w8aZxfHjQ_3zZbr-II";
const SESSION_KEY = "ah_intelligence_session_v1";
const HEARTBEAT_MS = 60_000;

let activeUser = null;
let heartbeatTimer = null;
let currentSessionId = null;

function sessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function pageContext() {
  const path = location.pathname || "/";
  const parts = path.split("/").filter(Boolean);
  const department = parts.length ? parts[0].slice(0, 80) : "home";
  return { path: path.slice(0, 300), department };
}

async function send(eventType, user = activeUser) {
  if (!user) return;
  try {
    const token = await user.getIdToken();
    const context = pageContext();
    await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "apikey": SUPABASE_PUBLIC_KEY
      },
      body: JSON.stringify({
        eventType,
        sessionId: currentSessionId || sessionId(),
        path: context.path,
        department: context.department
      }),
      keepalive: eventType === "logout"
    });
  } catch (error) {
    console.debug("[Akasha Intelligence] Evento não enviado:", error?.message || error);
  }
}

export function startAkashaTracking(user) {
  if (!user) return;
  if (activeUser?.uid === user.uid && heartbeatTimer) return;

  stopHeartbeat();
  activeUser = user;
  currentSessionId = sessionId();

  const firstPageInTab = !sessionStorage.getItem("ah_intelligence_started_v1");
  if (firstPageInTab) {
    sessionStorage.setItem("ah_intelligence_started_v1", "1");
    void send("session_start", user);
  }
  void send("page_view", user);

  heartbeatTimer = setInterval(() => {
    if (document.visibilityState === "visible") void send("heartbeat", activeUser);
  }, HEARTBEAT_MS);
}

function stopHeartbeat() {
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

export function stopAkashaTracking() {
  stopHeartbeat();
  activeUser = null;
}
