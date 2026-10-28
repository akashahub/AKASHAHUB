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
    "#ah-pack-bar{position:fixed;z-index:80;left:12px;right:12px;bottom:max(12px,env(safe-area-inset-bottom));display:grid;grid-template-columns:1fr auto;grid-template-areas:'copy close' 'cta cta';gap:10px 8px;align-items:center;box-sizing:border-box;max-width:calc(100vw - 24px);padding:14px 14px 12px;background:linear-gradient(112deg,transparent 0 18%,rgba(176,140,206,.1) 23%,transparent 29%),linear-gradient(98deg,transparent 54%,rgba(255,255,255,.06) 59%,transparent 65%),radial-gradient(90% 140% at 0% 120%,rgba(58,22,96,.5),transparent 52%),radial-gradient(80% 120% at 100% 0%,rgba(72,36,110,.28),transparent 50%),linear-gradient(160deg,#100a18 0%,#1c122c 40%,#140e20 100%);color:#f4efe8;border:1px solid rgba(214,186,236,.16);border-radius:16px;box-shadow:0 16px 40px rgba(8,4,14,.5);font:500 14px/1.4 Jost,system-ui,sans-serif}",
    "#ah-pack-bar > div{grid-area:copy;min-width:0}",
    "#ah-pack-bar strong{font-weight:650;color:#fff}",
    "#ah-pack-bar button{font:650 14px/1.2 Jost,system-ui,sans-serif;border:0;border-radius:999px;min-height:44px;padding:0 16px;cursor:pointer}",
    "#ah-pack-open{grid-area:cta;width:100%;background:#e7d7a8;color:#161513}",
    "#ah-pack-x{grid-area:close;background:transparent;color:#f4efe8;width:44px;min-width:44px;padding:0}",
    "@media(min-width:760px){#ah-pack-bar{left:50%;right:auto;width:min(920px,calc(100% - 48px));max-width:none;transform:translateX(-50%);grid-template-columns:1fr auto auto;grid-template-areas:'copy cta close';align-items:center;gap:16px;padding:14px 16px;font-size:15px}#ah-pack-open{width:auto;white-space:nowrap}}",
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
  openBtn.textContent = "Ouvir Áudios";
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
    h.textContent = "Mude a frequência. Eleve o seu dia.";
    const p = document.createElement("p");
    p.textContent = "Uma pausa para respirar, renovar o foco e entrar numa sintonia mais leve. Explore áudios com atmosfera quântica e sonora, uma energia acolhedora e aquele impulso gostoso de começar de novo. Coloque os fones, escolha uma faixa e aproveite o momento.";
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
        pay.textContent = "Ouvir todos os áudios";
        trial.hidden = true;
      } else {
        pay.textContent = "☕ Apoie com um café e desbloqueie os áudios · R$ 27";
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
      pay.disabled = true;
      pay.textContent = "Abrindo o pagamento seguro…";
      try {
        // Permite comprar sem login. Após o pagamento, a página de confirmação
        // oferece o login para guardar o pack na conta do cliente.
        await payNow();
      } catch (e) {
        pay.disabled = false;
        paint();
        p.textContent = "O pagamento não abriu agora. Tente novamente.";
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
      pay.textContent = "☕ Desbloquear áudios · R$ 27";
      p.textContent = "Você pode pagar sem criar conta agora. Depois do pagamento, entre ou crie sua conta para guardar o pack e acessar em outros aparelhos.";
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
