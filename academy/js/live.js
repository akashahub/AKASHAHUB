/** Live adapter — Worker signs JWT. UI only calls join/leave. */
const WORKER = 'https://akasha.yanfili-simon.workers.dev';
const FALLBACK = 'wss://akashahub-vlya29kl.livekit.cloud';

export async function joinLive(opts) {
  const box = opts.el;
  if (!box) throw new Error('no-mount');
  box.textContent = 'Pedindo token…';
  const res = await fetch(WORKER, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      identity: (opts.uid || opts.role || 'guest') + '-' + Date.now().toString(36),
      room: opts.room,
      name: opts.name || 'Fluir',
      mentor: opts.role === 'matriz'
    })
  });
  const data = await res.json();
  if (!data.token) throw new Error(data.error || 'sem token');
  if (!window.LivekitClient) throw new Error('sdk');
  const room = new LivekitClient.Room();
  await room.connect(data.url || FALLBACK, data.token);
  await room.localParticipant.setMicrophoneEnabled(true);
  await room.localParticipant.setCameraEnabled(true);
  box.innerHTML = '';
  room.on(LivekitClient.RoomEvent.TrackSubscribed, function (track) {
    box.appendChild(track.attach());
  });
  room.localParticipant.videoTrackPublications.forEach(function (pub) {
    if (pub.track) box.appendChild(pub.track.attach());
  });
  return room;
}
