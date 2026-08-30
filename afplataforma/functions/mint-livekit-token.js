/**
 * Cloudflare Worker — assina token LiveKit.
 * Nunca coloque API Secret no frontend.
 *
 * wrangler secret put LIVEKIT_API_KEY
 * wrangler secret put LIVEKIT_API_SECRET
 * wrangler secret put LIVEKIT_WS_URL
 */
export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: cors() });
    }
    if (req.method !== "POST") {
      return new Response("method", { status: 405, headers: cors() });
    }
    const body = await req.json();
    const identity = String(body.identity || "").slice(0, 80);
    const room = String(body.room || "mentoria-principal").slice(0, 80);
    const name = String(body.name || "Participante").slice(0, 80);
    if (!identity || !env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET) {
      return Response.json({ error: "config" }, { status: 400, headers: cors() });
    }
    const token = await signLivekit(env, { identity, room, name, mentor: !!body.mentor });
    return Response.json(
      { token, url: env.LIVEKIT_WS_URL },
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

async function signLivekit(env, { identity, room, name, mentor }) {
  // Use livekit-server-sdk no Worker real.
  // Este arquivo é o contrato. Instale:
  //   npm i livekit-server-sdk
  // e troque o corpo por:
  //   import { AccessToken } from "livekit-server-sdk";
  //   const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, { identity, name });
  //   at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true, roomAdmin: mentor });
  //   return await at.toJwt();
  throw new Error("Instale livekit-server-sdk no Worker e gere o JWT. Não assine no browser.");
}
