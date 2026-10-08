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
    "#ah-pack-bar{position:fixed;left:12px;right:12px;bottom:12px;z-index:80;display:flex;gap:12px;align-items:center;justify-content:space-between;padding:12px 14px;background:#161513;color:#f7f4ee;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);font:500 14px/1.35 system-ui,sans-serif}",
    "#ah-pack-bar strong{font-weight:650}",
    "#ah-pack-bar button{font:650 14px/1 system-ui,sans-serif;border:0;border-radius:999px;min-height:44px;padding:0 16px;cursor:pointer}",
    "#ah-pack-open{background:#e7d7a8;color:#161513;white-space:nowrap}",
    "#ah-pack-x{background:transparent;color:#f7f4ee;min-width:44px;padding:0}",
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
  const text = document.createElement("div");
  text.innerHTML = "<strong>A sociedade te programa o tempo todo, sem você perceber.</strong> Reprograme a sua mente para o que você quer.";
  const openBtn = document.createElement("button");
  openBtn.id = "ah-pack-open";
  openBtn.type = "button";
  openBtn.textContent = "Ouvir o pack";
  const closeBtn = document.createElement("button");
  closeBtn.id = "ah-pack-x";
  closeBtn.type = "button";
  closeBtn.textContent = "×";
  closeBtn.setAttribute("aria-label", "Fechar aviso");
  bar.append(text, openBtn, closeBtn);
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
