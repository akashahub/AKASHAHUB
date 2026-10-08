(function () {
  const API = "https://jsonmxbuzagmwuucruem.supabase.co/functions/v1/akashaConversa";
  const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzb25teGJ1emFnbXd1dWNydWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0ODAzMTMsImV4cCI6MjA5NjA1NjMxM30.qqBI_AUm_AnP4D830QNUd3JIbPE6o54yzwej0utJ6rQ";
  const PACK = [
    { title: "O código secreto do universo", file: "/audios/codigo.mp3" },
    { title: "Cura das feridas invisíveis", file: "/audios/feridas.mp3" },
    { title: "Mente crística", file: "/audios/mente.mp3" },
  ];
  if (sessionStorage.getItem("akasha-pack-bar") === "off" && location.search.indexOf("pack=1") < 0) return;

  const style = document.createElement("style");
  style.textContent = [
    "#ah-pack-bar{position:fixed;left:12px;right:12px;bottom:12px;z-index:80;display:flex;gap:12px;align-items:center;justify-content:space-between;padding:11px 14px;background:linear-gradient(115deg,#2a1644 0%,#4c2d68 58%,#5c3d78 100%);color:#fbf8f2;border:1px solid rgba(198,161,74,.42);border-radius:16px;box-shadow:0 14px 42px rgba(42,22,68,.34);font:500 14px/1.35 system-ui,sans-serif}",
    "#ah-pack-brand{display:flex;align-items:center;gap:8px;flex:0 0 auto}",
    "#ah-pack-brand img{display:block;width:30px;height:30px;border-radius:8px;box-shadow:0 0 0 1px rgba(198,161,74,.55)}",
    "#ah-pack-brand .label{display:none;color:#f0dfad;font:650 10px/1 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}",
    "#ah-pack-bar strong{font-weight:650;color:#fffaf0}",
    "#ah-pack-bar button{font:650 14px/1 system-ui,sans-serif;border:0;border-radius:999px;min-height:44px;padding:0 16px;cursor:pointer}",
    "#ah-pack-bar>div:nth-child(2){flex:1;min-width:0}",
    "#ah-pack-open{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#e7d7a8;color:#2a1644;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.15)}",
    "#ah-pack-open:hover{background:#f1e5bd;transform:translateY(-1px)}",
    "#ah-pack-open .coffee{display:inline-grid;place-items:center;width:18px;height:18px}",
    "#ah-pack-open .coffee svg{display:block;width:18px;height:18px}",
    "#ah-pack-x{background:transparent;color:#f7f4ee;min-width:44px;padding:0}",
    "#ah-pack-x:hover{color:#f0dfad}",
    "@media(min-width:720px){#ah-pack-brand .label{display:block}}",
    "@media(max-width:560px){#ah-pack-bar{left:8px;right:8px;bottom:8px;gap:8px;padding:9px 10px;font-size:12px}#ah-pack-brand img{width:27px;height:27px}#ah-pack-open{min-height:40px;padding:0 12px;font-size:12px}#ah-pack-x{min-width:34px}}",
    "#ah-pack-modal{position:fixed;inset:0;z-index:90;background:rgba(22,21,19,.62);display:flex;align-items:flex-end;justify-content:center;padding:12px}",
    "#ah-pack-sheet{width:min(520px,100%);background:#f7f4ee;color:#161513;border-radius:20px;padding:22px 18px 18px;font:16px/1.45 Georgia,serif}",
    "#ah-pack-sheet h2{margin:0 0 10px;font-weight:500;font-size:32px;line-height:1}",
    "#ah-pack-sheet p{margin:0 0 14px;font:15px/1.45 system-ui,sans-serif}",
    "#ah-pack-sheet .go{display:block;width:100%;min-height:56px;margin-top:8px;border-radius:999px;font:650 15px/1.2 system-ui,sans-serif;cursor:pointer}",
    "#ah-pack-pay{background:#161513;color:#f7f4ee;border:0}",
    "#ah-pack-try{background:#fff;color:#161513;border:1px solid #161513}",
    "#ah-pack-player{margin-top:14px;padding:12px;background:#fff;border:1px solid #161513;border-radius:12px}",
    "#ah-pack-player audio{width:100%;margin-top:8px}",
    "@media(min-width:720px){#ah-pack-modal{align-items:center}}",
  ].join("");
  document.head.appendChild(style);

  const bar = document.createElement("div");
  bar.id = "ah-pack-bar";
  const brand = document.createElement("div");
  brand.id = "ah-pack-brand";
  brand.innerHTML = '<img src="/favicon.svg" alt="Akasha Hub"><span class="label">Akasha Hub</span>';
  const text = document.createElement("div");
  text.innerHTML = "<strong>A sociedade te programa o tempo todo, sem você perceber.</strong> Reprograme a sua mente para o que você quer.";
  const openBtn = document.createElement("button");
  openBtn.id = "ah-pack-open";
  openBtn.type = "button";
  openBtn.innerHTML = '<span class="coffee" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 9h10v5.5A4.5 4.5 0 0 1 10.5 19h-1A4.5 4.5 0 0 1 5 14.5V9Z" stroke="currentColor" stroke-width="1.8"/><path d="M15 11h1.8a2.7 2.7 0 0 1 0 5.4H15M4 21h14M8 5.5c0-1 1-1.3 1-2.5M11 5.5c0-1 1-1.3 1-2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span><span>Ouvir o pack</span>';
  const closeBtn = document.createElement("button");
  closeBtn.id = "ah-pack-x";
  closeBtn.type = "button";
  closeBtn.textContent = "×";
  closeBtn.setAttribute("aria-label", "Fechar aviso");
  bar.append(brand, text, openBtn, closeBtn);
  document.body.appendChild(bar);
  closeBtn.onclick = () => {
    sessionStorage.setItem("akasha-pack-bar", "off");
    bar.remove();
  };

  let audio;
  function modal() {
    const old = document.getElementById("ah-pack-modal");
    if (old) old.remove();
    const root = document.createElement("div");
    root.id = "ah-pack-modal";
    const sheet = document.createElement("div");
    sheet.id = "ah-pack-sheet";
    const h = document.createElement("h2");
    h.textContent = "Reprograme a sua mente para o que você quer.";
    const p = document.createElement("p");
    p.textContent = "Notícia, rede, conversa, anúncio. Isso entra em você o dia inteiro, sem pedir licença. Este pack é o contrário: áudios para colocar prosperidade, desejo e presença no lugar dessa programação.";
    const pay = document.createElement("button");
    pay.className = "go";
    pay.id = "ah-pack-pay";
    pay.type = "button";
    pay.textContent = localStorage.getItem("akasha-pack") ? "Ouvir o pack inteiro" : "Me pague um café e ouça o pack inteiro · R$ 27";
    const trial = document.createElement("button");
    trial.className = "go";
    trial.id = "ah-pack-try";
    trial.type = "button";
    trial.textContent = "Não tenho agora. Quero ouvir um pedaço.";
    const player = document.createElement("div");
    player.id = "ah-pack-player";
    player.hidden = true;
    sheet.append(h, p, pay, trial, player);
    root.appendChild(sheet);
    root.addEventListener("click", (e) => { if (e.target === root) root.remove(); });
    document.body.appendChild(root);

    pay.onclick = async () => {
      if (localStorage.getItem("akasha-pack")) { location.href = "/audios/"; return; }
      pay.disabled = true;
      pay.textContent = "Abrindo o pagamento…";
      try {
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: KEY, Authorization: "Bearer " + KEY },
          body: JSON.stringify({ action: "pack" }),
        });
        const data = await res.json();
        if (!data.url) throw new Error("sem");
        location.href = data.url;
      } catch (e) {
        pay.disabled = false;
        pay.textContent = "Me pague um café e ouça o pack inteiro · R$ 27";
        p.textContent = "O pagamento não abriu agora. Tente de novo.";
      }
    };
    trial.onclick = () => {
      const pick = PACK[Math.floor(Math.random() * PACK.length)];
      player.hidden = false;
      player.replaceChildren();
      const title = document.createElement("strong");
      title.textContent = pick.title;
      const note = document.createElement("p");
      note.textContent = "Um terço deste áudio. Sem download. O resto abre com o café.";
      audio = document.createElement("audio");
      audio.controls = true;
      audio.controlsList = "nodownload noplaybackrate";
      audio.preload = "metadata";
      audio.src = pick.file;
      audio.oncontextmenu = (e) => e.preventDefault();
      let limit = 0;
      const stop = () => {
        if (!limit || audio.currentTime < limit) return;
        audio.pause();
        audio.currentTime = Math.max(0, limit - 0.05);
        note.textContent = "O trecho acabou. O restante abre com o café de R$ 27.";
      };
      audio.onloadedmetadata = () => { limit = (audio.duration || 0) / 3; };
      audio.ontimeupdate = stop;
      audio.onseeking = stop;
      player.append(title, note, audio);
      audio.play().catch(() => {});
    };
  }
  openBtn.onclick = modal;
  if (location.search.indexOf("pack=1") >= 0) modal();
})();
