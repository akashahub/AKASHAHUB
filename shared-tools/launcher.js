import { auth } from "/login/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const TOOLS = [
  { id: "cashflow", icon: "↗", title: "Cash-Flow", description: "Receitas e despesas" },
  { id: "sono", icon: "☾", title: "Modo Sono", description: "Seu espaço de descanso" },
  { id: "metas", icon: "◎", title: "Metas", description: "Objetivos e prazos" },
  { id: "ideation", icon: "✧", title: "Ideias / Ideation", description: "Registre insights" },
  { id: "network", icon: "⌘", title: "Mapa de Rede", description: "Contatos e oportunidades" },
  { id: "tasks", icon: "☷", title: "Lista de tarefas", description: "Prioridades do dia" },
  { id: "audio-pack", icon: "♫", title: "Pack de áudios", description: "Ouça os áudios comprados" }
];

const style = document.createElement("style");
style.textContent = `
#ah-tools-launch{position:fixed;right:20px;bottom:20px;z-index:180;width:56px;height:56px;border:1px solid #d7b65e;border-radius:50%;background:#17111f;color:#f2d88d;box-shadow:0 10px 32px #0003;display:none;place-items:center;font:700 25px/1 system-ui;cursor:pointer}
#ah-tools-launch:hover{transform:translateY(-2px);box-shadow:0 14px 36px #0005}
#ah-tools-layer{position:fixed;inset:0;z-index:1000;background:rgba(9,7,13,.68);backdrop-filter:blur(10px);display:none;align-items:center;justify-content:center;padding:16px}
#ah-tools-layer.is-open{display:flex}
#ah-tools-panel{width:min(620px,100%);max-height:min(82vh,760px);overflow:auto;background:#faf8f2;color:#19151e;border:1px solid #d5b75f;border-radius:22px;padding:22px;box-shadow:0 30px 90px #0006;font-family:Jost,system-ui,sans-serif}
#ah-tools-panel *{box-sizing:border-box}
#ah-tools-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}
#ah-tools-head h2{font:700 25px/1.15 'Playfair Display',Georgia,serif;margin:0 0 6px}
#ah-tools-head p{margin:0;color:#665e6d;font-size:14px}
#ah-tools-close{width:38px;height:38px;border:1px solid #ddd4c3;border-radius:50%;background:#fff;color:#2a2330;font-size:24px;cursor:pointer;flex-shrink:0}
#ah-tools-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.ah-tool-item{display:flex;align-items:center;gap:12px;padding:15px;border:1px solid #e4dccb;border-radius:15px;background:#fff;color:inherit;text-decoration:none;min-width:0;transition:border-color .2s,transform .2s}
.ah-tool-item:hover{border-color:#c9a227;transform:translateY(-1px)}
.ah-tool-icon{display:grid;place-items:center;width:42px;height:42px;flex-shrink:0;border-radius:12px;background:#f4edda;color:#80611b;font-size:23px}
.ah-tool-item strong{display:block;font-size:15px;font-weight:600}
.ah-tool-item small{display:block;color:#756d79;font-size:12px;margin-top:3px}
@media(max-width:480px){#ah-tools-launch{right:14px;bottom:14px;width:52px;height:52px}#ah-tools-panel{padding:17px;border-radius:18px}#ah-tools-grid{grid-template-columns:1fr;gap:8px}.ah-tool-item{padding:12px}}
`;
style.textContent += "\n#ah-tools-transition{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:0;padding:24px;text-align:center;background:radial-gradient(ellipse at 50% 42%,rgba(93,49,130,.30),transparent 43%),radial-gradient(ellipse at 50% 100%,rgba(184,143,47,.11),transparent 50%),#09070f;color:#f7f1e5;font-family:Inter,system-ui,sans-serif;opacity:1;transition:opacity .2s ease}\n#ah-tools-transition .aht-orb{width:100px;height:100px;position:relative;display:grid;place-items:center;margin-bottom:26px}\n#ah-tools-transition .aht-ring{position:absolute;inset:2px;border:1px solid rgba(219,184,94,.8);border-right-color:transparent;border-radius:50%;animation:aht-spin 2.4s linear infinite;box-shadow:0 0 25px rgba(211,177,89,.12)}\n#ah-tools-transition .aht-ring:after{content:\"\";position:absolute;inset:10px;border:1px solid rgba(171,119,219,.8);border-left-color:transparent;border-radius:50%;animation:aht-spin 3.2s linear infinite reverse}\n#ah-tools-transition .aht-core{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;font:600 29px/1 Georgia,serif;color:#f4d68b;background:radial-gradient(circle,#4c2b61,#17101f 75%);box-shadow:0 0 30px rgba(183,132,224,.28);animation:aht-glow 2s ease-in-out infinite}\n#ah-tools-transition .aht-brand{font-size:10px;letter-spacing:.34em;color:#d8c69d;margin-bottom:24px}#ah-tools-transition .aht-brand span{color:#c9a1ed}\n#ah-tools-transition h2{font:500 clamp(27px,5vw,38px)/1.15 Georgia,serif;margin:0 0 10px;color:#fff7e8}\n#ah-tools-transition p{font-size:14px;line-height:1.6;color:#b9afc5;margin:0;max-width:330px}\n#ah-tools-transition .aht-progress{width:200px;height:2px;margin:28px 0 14px;background:#302537;overflow:hidden}\n#ah-tools-transition .aht-progress span{display:block;width:42%;height:100%;background:linear-gradient(90deg,#a47ad1,#e2c16b);animation:aht-progress 1.4s ease-in-out infinite}\n#ah-tools-transition small{font-size:9px;letter-spacing:.24em;color:#82768d}\n@keyframes aht-spin{to{transform:rotate(360deg)}}@keyframes aht-glow{50%{transform:scale(1.06)}}@keyframes aht-progress{0%{transform:translateX(-120%)}100%{transform:translateX(360%)}}\n@media(prefers-reduced-motion:reduce){#ah-tools-transition *{animation:none!important}#ah-tools-transition .aht-progress span{width:100%}}\n";
document.head.appendChild(style);

function buildLauncher() {
  if (document.getElementById("ah-tools-launch")) return;
  const button = document.createElement("button");
  button.id = "ah-tools-launch";
  button.type = "button";
  button.setAttribute("aria-label", "Abrir minhas ferramentas");
  button.title = "Minhas ferramentas";
  button.innerHTML = "⌘";

  const layer = document.createElement("div");
  layer.id = "ah-tools-layer";
  layer.innerHTML = `<section id="ah-tools-panel" role="dialog" aria-modal="true" aria-labelledby="ah-tools-title">
    <header id="ah-tools-head"><div><h2 id="ah-tools-title">Minhas ferramentas</h2><p>Seu espaço de trabalho, em qualquer página do Akasha Hub.</p></div><button id="ah-tools-close" type="button" aria-label="Fechar">×</button></header>
    <div id="ah-tools-grid">${TOOLS.map(tool => `<a class="ah-tool-item" href="${tool.id === "audio-pack" ? "/audios/" : "/afplataforma/?quicktool=" + encodeURIComponent(tool.id)}"><span class="ah-tool-icon" aria-hidden="true">${tool.icon}</span><span><strong>${tool.title}</strong><small>${tool.description}</small></span></a>`).join("")}</div>
  </section>`;
  document.body.append(button, layer);
  const close = () => { layer.classList.remove("is-open"); button.focus(); };
  button.addEventListener("click", () => layer.classList.add("is-open"));
  layer.querySelector("#ah-tools-close").addEventListener("click", close);
  layer.querySelectorAll(".ah-tool-item").forEach(link => {
    link.addEventListener("click", event => {
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || link.href.includes("/audios/")) return;
      event.preventDefault();
      if (!document.getElementById("ah-tools-transition")) {
        const transition = document.createElement("div");
        transition.id = "ah-tools-transition";
        transition.setAttribute("role", "status");
        transition.setAttribute("aria-live", "polite");
        transition.innerHTML = '<div class="aht-orb" aria-hidden="true"><span class="aht-ring"></span><span class="aht-core">A</span></div><div class="aht-brand">AKASHA <span>HUB</span></div><h2>Preparando seu espaço</h2><p>Estamos abrindo sua ferramenta com segurança.</p><div class="aht-progress" aria-hidden="true"><span></span></div><small>CARREGANDO EXPERIÊNCIA</small>';
        document.body.appendChild(transition);
      }
      window.setTimeout(() => window.location.assign(destination.href), 100);
    });
  });

  layer.addEventListener("click", event => { if (event.target === layer) close(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
}

onAuthStateChanged(auth, user => {
  if (user) {
    buildLauncher();
    document.getElementById("ah-tools-launch").style.display = "grid";
  } else {
    document.getElementById("ah-tools-launch")?.remove();
    document.getElementById("ah-tools-layer")?.remove();
  }
});
