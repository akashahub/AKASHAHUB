import { auth } from "/login/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { PACK, checkout, ownsPack, fillPlayer } from "/audios/player.js";

const home = location.pathname === "/" || location.pathname === "/index.html";
if (!home) {
  /* a barra vive na entrada do site */
} else if (!(sessionStorage.getItem("akasha-pack-bar") === "off" && location.search.indexOf("pack=1") < 0)) {
  mount();
}

function mount() {
  const style = document.createElement("style");
  style.textContent = [
    "#ah-pack-bar{position:fixed;left:12px;right:12px;bottom:12px;z-index:80;display:flex;gap:12px;align-items:center;justify-content:space-between;padding:12px 14px;background:#161513;color:#f7f4ee;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);font:500 14px/1.35 Jost,system-ui,sans-serif}",
    "#ah-pack-bar strong{font-weight:650}",
    "#ah-pack-bar button{font:650 14px/1 inherit;border:0;border-radius:999px;min-height:44px;padding:0 16px;cursor:pointer}",
    "#ah-pack-open{background:#e7d7a8;color:#161513;white-space:nowrap}",
    "#ah-pack-x{background:transparent;color:#f7f4ee;min-width:44px;padding:0}",
    "#ah-pack-modal{position:fixed;inset:0;z-index:90;background:rgba(22,21,19,.62);display:flex;align-items:flex-end;justify-content:center;padding:12px}",
    "#ah-pack-sheet{width:min(520px,100%);max-height:min(88vh,720px);overflow:auto;background:#f7f4ee;color:#161513;border-radius:20px;padding:22px 18px 18px;font:16px/1.45 Georgia,serif}",
    "#ah-pack-sheet h2{margin:0 0 10px;font-weight:500;font-size:32px;line-height:1}",
    "#ah-pack-sheet p{margin:0 0 14px;font:15px/1.45 Jost,system-ui,sans-serif}",
    "#ah-pack-sheet .go{display:block;width:100%;min-height:56px;margin-top:8px;border-radius:999px;font:650 15px/1.2 Jost,system-ui,sans-serif;cursor:pointer}",
    "#ah-pack-pay{background:#161513;color:#f7f4ee;border:0}",
    "#ah-pack-try{background:#fff;color:#161513;border:1px solid #161513}",
    "#ah-pack-player{margin-top:14px}",
    ".ah-track{display:flex;gap:8px;align-items:center;margin-top:8px}",
    ".ah-track button{flex:1;text-align:left;min-height:48px;border-radius:12px;border:1px solid #161513;background:#fff;padding:0 12px;cursor:pointer;font:600 15px/1.2 Jost,system-ui,sans-serif}",
    ".ah-track a{color:#161513;font:600 13px/1 Jost,system-ui,sans-serif}",
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

  let owned = false;
  async function refresh() {
    owned = await ownsPack();
  }
  onAuthStateChanged(auth, () => { refresh(); });
  refresh();

  async function payNow() {
    const email = auth.currentUser ? auth.currentUser.email : "";
    location.href = await checkout(email || "");
  }

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

    function paint() {
      if (owned) {
        pay.textContent = "Ouvir o pack inteiro";
        trial.hidden = true;
      } else {
        pay.textContent = "Me pague um café e ouça o pack inteiro · R$ 27";
        trial.hidden = false;
      }
    }
    paint();

    pay.onclick = async () => {
      if (owned) {
        player.hidden = false;
        fillPlayer(player, { download: true });
        return;
      }
      if (!auth.currentUser) {
        sessionStorage.setItem("akasha-pack-after-login", "1");
        if (window.AkashaGate) window.AkashaGate.open({ reason: "pack" });
        p.textContent = "Entre no acesso. O pagamento abre em seguida e o pack fica no seu e-mail. Se fechar, dá para pagar só neste aparelho.";
        return;
      }
      pay.disabled = true;
      pay.textContent = "Abrindo o pagamento…";
      try { await payNow(); }
      catch (e) {
        pay.disabled = false;
        paint();
        p.textContent = "O pagamento não abriu agora. Tente de novo.";
      }
    };
    window.addEventListener("akasha-pack-pay-here", () => {
      pay.onclick = async () => {
        pay.disabled = true;
        pay.textContent = "Abrindo o pagamento…";
        try { await payNow(); }
        catch (e) {
          pay.disabled = false;
          pay.textContent = "Me pague um café e ouça o pack inteiro · R$ 27";
        }
      };
      pay.textContent = "Pagar agora neste aparelho · R$ 27";
      p.textContent = "O pack abre aqui. Para ouvir em outro aparelho, entre depois com o mesmo e-mail.";
    }, { once: true });
    trial.onclick = () => {
      const pick = PACK[Math.floor(Math.random() * PACK.length)];
      player.hidden = false;
      const audio = fillPlayer(player, { download: false });
      const note = document.createElement("p");
      note.textContent = "Um terço de “" + pick.title + "”. Sem download. O resto abre com o café.";
      player.prepend(note);
      audio.src = pick.file;
      audio.play().catch(() => {});
    };
  }
  openBtn.onclick = async () => { await refresh(); modal(); };
  if (location.search.indexOf("pack=1") >= 0) refresh().then(modal);
}
