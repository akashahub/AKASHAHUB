const ENDPOINT = "https://jsonmxbuzagmwuucruem.supabase.co/functions/v1/ah-user-intelligence";
const SUPABASE_PUBLIC_KEY = "sb_publishable_cZOBLAGhZVoJ5w8aZxfHjQ_3zZbr-II";
const SESSION_KEY = "ah_intelligence_session_v1";
const HEARTBEAT_MS = 60_000;

let activeUser = null;
let heartbeatTimer = null;
let currentSessionId = null;
let lastTrackedPath = null;
let historyHooksInstalled = false;

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

async function send(eventType, user = activeUser, pathOverride = null) {
  if (!user) return;
  try {
    const token = await user.getIdToken();
    const context = pageContext();
    const path = pathOverride || context.path;
    const parts = path.split("/").filter(Boolean);
    const department = parts.length ? parts[0].slice(0, 80) : "home";
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
        path,
        department
      }),
      keepalive: eventType === "logout" || eventType === "page_view"
    });
  } catch (error) {
    console.debug("[Akasha Intelligence] Evento não enviado:", error?.message || error);
  }
}

function trackCurrentPage() {
  if (!activeUser) return;
  const path = pageContext().path;
  if (path === lastTrackedPath) return;
  lastTrackedPath = path;
  void send("page_view", activeUser, path);
}

function installNavigationTracking() {
  if (historyHooksInstalled) return;
  historyHooksInstalled = true;
  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);
  history.pushState = function(...args) {
    const result = originalPushState(...args);
    queueMicrotask(trackCurrentPage);
    return result;
  };
  history.replaceState = function(...args) {
    const result = originalReplaceState(...args);
    queueMicrotask(trackCurrentPage);
    return result;
  };
  window.addEventListener("popstate", trackCurrentPage);
  window.addEventListener("hashchange", trackCurrentPage);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") trackCurrentPage();
  });
}

export function startAkashaTracking(user) {
  if (!user) return;
  installNavigationTracking();
  if (activeUser?.uid === user.uid && heartbeatTimer) {
    trackCurrentPage();
    return;
  }

  stopHeartbeat();
  activeUser = user;
  currentSessionId = sessionId();
  lastTrackedPath = null;

  void send("session_start", user);
  trackCurrentPage();

  heartbeatTimer = setInterval(() => {
    if (document.visibilityState === "visible") void send("heartbeat", activeUser);
  }, HEARTBEAT_MS);
}

function stopHeartbeat() {
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

export function stopAkashaTracking() {
  if (activeUser) void send("logout", activeUser);
  stopHeartbeat();
  activeUser = null;
  currentSessionId = null;
  lastTrackedPath = null;
}
