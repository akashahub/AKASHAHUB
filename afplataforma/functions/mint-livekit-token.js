/**
 * Cloudflare Worker — assina JWT LiveKit (HS256).
 * Cole este arquivo no Worker akasha.yanfili-simon.workers.dev
 *
 * wrangler secret put LIVEKIT_API_KEY
 * wrangler secret put LIVEKIT_API_SECRET
 * wrangler secret put LIVEKIT_WS_URL
 *
 * LIVEKIT_WS_URL exemplo: wss://akashahub-vlya29kl.livekit.cloud
 */
export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: cors() });
    }
    if (req.method !== "POST") {
      return new Response("method", { status: 405, headers: cors() });
    }
    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const identity = String(body.identity || "").slice(0, 80);
    const room = String(body.room || "mentoria-principal").replace(/[^a-zA-Z0-9_\-.]/g, "-").slice(0, 80);
    const name = String(body.name || "Participante").slice(0, 80);
    if (!identity) {
      return Response.json({ error: "identity" }, { status: 400, headers: cors() });
    }
    if (!env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET) {
      return Response.json({ error: "config" }, { status: 500, headers: cors() });
    }
    const token = await signLivekit(env, { identity, room, name, mentor: !!body.mentor });
    return Response.json(
      { token, url: env.LIVEKIT_WS_URL || "" },
      { headers: cors() }
    );
  }
};

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
  };
}

function b64url(bytes) {
  let str;
  if (typeof bytes === "string") {
    str = btoa(bytes);
  } else {
    let bin = "";
    const u8 = new Uint8Array(bytes);
    for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
    str = btoa(bin);
  }
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function signLivekit(env, { identity, room, name, mentor }) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify({
    iss: env.LIVEKIT_API_KEY,
    sub: identity,
    name,
    nbf: now - 10,
    exp: now + 60 * 60 * 6,
    jti: identity + "-" + now,
    video: {
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: !!mentor
    }
  }));
  const data = header + "." + payload;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.LIVEKIT_API_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return data + "." + b64url(sig);
}
