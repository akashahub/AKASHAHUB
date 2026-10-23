import { auth } from "/login/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const TOOLS = [
  { id: "cashflow", icon: "↗", title: "Cash-Flow", description: "Receitas e despesas" },
  { id: "sono", icon: "☾", title: "Modo Sono", description: "Seu espaço de descanso" },
  { id: "metas", icon: "◎", title: "Metas", description: "Objetivos e prazos" },
  { id: "ideation", icon: "✧", title: "Ideias / Ideation", description: "Registre insights" },
  { id: "network", icon: "⌘", title: "Mapa de Rede", description: "Contatos e oportunidades" },
  { id: "tasks", icon: "☷", title: "Lista de tarefas", description: "Prioridades do dia" }
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
    <div id="ah-tools-grid">${TOOLS.map(tool => `<a class="ah-tool-item" href="/afplataforma/?quicktool=${encodeURIComponent(tool.id)}"><span class="ah-tool-icon" aria-hidden="true">${tool.icon}</span><span><strong>${tool.title}</strong><small>${tool.description}</small></span></a>`).join("")}</div>
  </section>`;
  document.body.append(button, layer);
  const close = () => { layer.classList.remove("is-open"); button.focus(); };
  button.addEventListener("click", () => layer.classList.add("is-open"));
  layer.querySelector("#ah-tools-close").addEventListener("click", close);
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
