import { auth } from "/login/firebase.js";
import {
  signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  GoogleAuthProvider, updateProfile, onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { checkout } from "/audios/player.js";

const SKIP = "akasha-login-gate";
const AFTER = "akasha-pack-after-login";
const home = location.pathname === "/" || location.pathname === "/index.html";
const provider = new GoogleAuthProvider();
let opened = false;
let user = null;

const style = document.createElement("style");
style.textContent = `
#ah-gate{position:fixed;inset:0;z-index:200;background:rgba(8,6,12,.72);display:flex;align-items:flex-end;justify-content:center;padding:12px}
#ah-gate-card{width:min(440px,100%);max-height:min(92vh,760px);overflow:auto;background:#140c1c;color:#f7f4ee;border-radius:22px;padding:22px 18px 18px;border:1px solid rgba(212,175,106,.45);box-shadow:0 24px 60px rgba(0,0,0,.45);font:15px/1.4 Jost,system-ui,sans-serif}
#ah-gate-card h2{margin:0 0 8px;font-family:"Playfair Display",Georgia,serif;font-weight:600;font-size:28px;line-height:1.05}
#ah-gate-card .lead{margin:0 0 14px;color:#e7dcc8}
#ah-gate-card label{display:block;margin-top:10px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#d4af6a}
#ah-gate-card input{width:100%;margin-top:6px;background:#0e0a14;border:1px solid rgba(244,237,224,.16);border-radius:12px;padding:12px;color:#f7f4ee;font:16px/1.2 inherit}
#ah-gate-go,#ah-gate-mode,#ah-gate-google{display:block;width:100%;min-height:48px;margin-top:12px;border-radius:999px;cursor:pointer;font:600 15px/1 inherit}
#ah-gate-go{background:#f0d078;color:#1a1408;border:0}
#ah-gate-mode,#ah-gate-google{background:transparent;color:#f7f4ee;border:1px solid rgba(244,237,224,.25)}
#ah-gate-x{background:transparent;color:#f7f4ee;border:0;min-height:44px;cursor:pointer;font:600 14px/1 inherit}
#ah-gate-err{min-height:1.2em;color:#f0b2ac;font-size:14px;margin-top:8px}
#ah-legado{display:flex;align-items:center;justify-content:center;width:100%;min-height:72px;margin-top:16px;padding:14px 18px;border-radius:16px;text-decoration:none;color:#fff;font-family:"Playfair Display",Georgia,serif;font-size:22px;letter-spacing:.02em;text-align:center;
  background:
    linear-gradient(180deg, rgba(255,236,190,.55), rgba(255,236,190,0) 32%),
    linear-gradient(165deg, #4a2a6a 0%, #1a0c28 48%, #2c1844 100%);
  border:1px solid #e8c872;
  box-shadow:inset 0 1px 0 rgba(255,236,180,.8), inset 0 -12px 20px rgba(0,0,0,.28), 0 10px 24px rgba(0,0,0,.35)}
@media(min-width:720px){#ah-gate{align-items:center}}
`;
document.head.appendChild(style);

function card(reason) {
  const root = document.createElement("div");
  root.id = "ah-gate";
  root.innerHTML = `
    <div id="ah-gate-card" role="dialog" aria-modal="true" aria-labelledby="ah-gate-title">
      <h2 id="ah-gate-title">Entre no Akasha Hub</h2>
      <p class="lead" id="ah-gate-lead"></p>
      <label>E-mail<input id="ah-gate-email" type="email" autocomplete="email" placeholder="seu@email.com"></label>
      <label>Senha<input id="ah-gate-pass" type="password" autocomplete="current-password" placeholder="mínimo 6 caracteres"></label>
      <button type="button" id="ah-gate-go">Entrar</button>
      <button type="button" id="ah-gate-mode">Não tenho conta. Criar.</button>
      <button type="button" id="ah-gate-google">Continuar com Google</button>
      <p id="ah-gate-err"></p>
      <button type="button" id="ah-gate-x">Ver o site sem entrar</button>
      <a id="ah-legado" href="/legado/">Arquitetura de Legado</a>
    </div>`;
  document.body.appendChild(root);
  const lead = root.querySelector("#ah-gate-lead");
  lead.textContent = reason === "pack"
    ? "Entre agora. O pagamento de R$ 27 abre em seguida e o pack fica neste e-mail."
    : "Entre para o que você compra ficar no seu acesso. Ou feche e veja o site.";
  const err = root.querySelector("#ah-gate-err");
  const email = root.querySelector("#ah-gate-email");
  const pass = root.querySelector("#ah-gate-pass");
  const go = root.querySelector("#ah-gate-go");
  let mode = "in";
  root.querySelector("#ah-gate-mode").onclick = () => {
    mode = mode === "in" ? "up" : "in";
    go.textContent = mode === "in" ? "Entrar" : "Criar conta";
    root.querySelector("#ah-gate-mode").textContent = mode === "in" ? "Não tenho conta. Criar." : "Já tenho conta. Entrar.";
  };
  const fail = (e) => {
    err.textContent = e && e.code === "auth/invalid-credential" ? "E-mail ou senha incorretos." : "Não entrou agora. Tente de novo.";
  };
  async function done(cred) {
    err.textContent = "";
    if (sessionStorage.getItem(AFTER) === "1") {
      sessionStorage.removeItem(AFTER);
      try {
        location.href = await checkout(cred.user.email || "");
        return;
      } catch (e) {
        err.textContent = "A conta entrou. O pagamento não abriu. Toque de novo em Ouvir o pack.";
      }
    }
    close(false);
  }
  root.querySelector("#ah-gate-go").onclick = async () => {
    err.textContent = "";
    try {
      if (mode === "up") {
        const cred = await createUserWithEmailAndPassword(auth, email.value.trim(), pass.value);
        await updateProfile(cred.user, { displayName: "" });
        await done(cred);
      } else {
        await done(await signInWithEmailAndPassword(auth, email.value.trim(), pass.value));
      }
    } catch (e) { fail(e); }
  };
  root.querySelector("#ah-gate-google").onclick = async () => {
    try { await done(await signInWithPopup(auth, provider)); }
    catch (e) { if (e.code !== "auth/popup-closed-by-user") fail(e); }
  };
  root.querySelector("#ah-gate-x").onclick = () => close(true);
  root.addEventListener("click", (e) => { if (e.target === root) close(true); });
}

function close(dismissed) {
  const root = document.getElementById("ah-gate");
  if (root) root.remove();
  opened = false;
  if (dismissed) {
    sessionStorage.setItem(SKIP, "off");
    if (sessionStorage.getItem(AFTER) === "1") {
      sessionStorage.removeItem(AFTER);
      window.dispatchEvent(new Event("akasha-pack-pay-here"));
    }
  }
}

function open(opts) {
  if (document.getElementById("ah-gate")) return;
  if (user && !(opts && opts.reason === "pack")) return;
  opened = true;
  card(opts && opts.reason);
}

window.AkashaGate = { open, close };

onAuthStateChanged(auth, (next) => {
  user = next;
  if (next && document.getElementById("ah-gate") && sessionStorage.getItem(AFTER) !== "1") close(false);
});

if (home && location.search.indexOf("pack=1") < 0) {
  setTimeout(() => {
    if (user || sessionStorage.getItem(SKIP) === "off" || document.getElementById("ah-gate")) return;
    open();
  }, 3000);
}
