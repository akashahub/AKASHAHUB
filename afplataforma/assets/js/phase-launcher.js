import { auth } from "/login/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* Atalhos das cinco fases + apoio transversal. A camada é aditiva e só aparece na AF Plataforma. */
const GROUPS = [
 {id:"fase1",icon:"✧",title:"Fase 1 · Essência",desc:"Identidade, história e direção",items:[
  ["Abrir roteiro em Sessões","26 formulários e roteiros","url","/sessoes/"],
  ["Mesa da Essência","8 estações de aprofundamento","view","fase1-jogo"],
  ["Formulário de Marca / Identidade","Direção da marca e do projeto","view","fase1-marca"],
  ["Dossiê vivo","Fatos, hipóteses e decisões","view","fase1-dossie"],
  ["Visão 1 página","Organizar visão e direção","tool","vision"],
  ["Ideação / Insights","Registrar possibilidades","tool","ideation"]
 ]},
 {id:"fase2",icon:"◈",title:"Fase 2 · Império Digital",desc:"Marca, oferta e ativos digitais",items:[
  ["Construtor de oferta","Estruturar produtos e serviços","view","fase2-oferta"],
  ["Diagnóstico de ativos","Mapear ativos digitais","view","fase2-ativos"],
  ["Pitch 60 segundos","Comunicar a proposta","tool","pitch"],
  ["Oratória","Comunicação e apresentação","tool","fono"],
  ["Mapa de rede","Contatos e oportunidades","tool","network"],
  ["Biblioteca de soluções","Sites, aplicações e plataformas","url","/afplataforma/imperio/"]
 ]},
 {id:"fase3",icon:"◎",title:"Fase 3 · Alinhamento Financeiro",desc:"Caixa, metas e decisões financeiras",items:[
  ["Dashboard AF","Visão financeira central","view","af-dashboard"],
  ["Módulos","Conteúdos e módulos financeiros","view","modules"],
  ["Ferramentas","Ferramentas financeiras","view","tools"],
  ["Call","Sala de acompanhamento","view","call"],
  ["Complementar","Recursos complementares","view","complementar"],
  ["Quitei","Organização de compromissos","view","quitei"],
  ["Crianças","Educação financeira familiar","view","criancas"],
  ["Empresas","Frente de educação empresarial","view","empresas"],
  ["Preço mínimo","Calcular referência de preço","view","fase3-preco"]
 ]},
 {id:"fase4",icon:"↗",title:"Fase 4 · Expansão",desc:"Execução, aquisição e crescimento",items:[
  ["Divulgação","Planejar presença e publicação","view","fase4-divulga"],
  ["O que depende de mim","Identificar gargalos do fundador","view","fase4-depende"],
  ["Execução semanal","Organizar a execução","tool","execution"],
  ["SDR OS","Prospecção e qualificação","view","fase4-sdr"],
  ["Treinamento de vendedores","Preparar equipe comercial","view","fase4-treinamento"],
  ["Closers OS","Condução de calls e fechamento","view","fase4-closers"]
 ]},
 {id:"fase5",icon:"⌂",title:"Fase 5 · Legado",desc:"Conhecimento, comunidade e continuidade",items:[
  ["Declaração de legado","Registrar princípios e continuidade","tool","legacy"],
  ["Livro do método","Organizar a metodologia","view","fase5-livro"],
  ["Zen Negócios","Capital, risco, estrutura e continuidade","url","/afplataforma/zen-negocios/"]
 ]},
 {id:"apoio",icon:"⌘",title:"Apoio transversal",desc:"Ferramentas úteis em qualquer fase · não é uma sexta fase",items:[
  ["Cash-Flow","Receitas e despesas","tool","cashflow"],
  ["Modo Sono","Espaço de descanso","tool","sono"],
  ["Metas","Objetivos e prazos","tool","metas"],
  ["Ideias / Ideation","Registrar insights","tool","ideation"],
  ["Mapa de Rede","Contatos e oportunidades","tool","network"],
  ["Lista de tarefas","Prioridades e execução","tool","tasks"],
  ["Pack de áudios","Biblioteca de áudios","url","/audios/"],
  ["Catálogo de Capacidades","Inventário estratégico · acesso do mentor","view","catalogo-capacidades"]
 ]}
];

const style=document.createElement("style");
style.textContent=`
#ah-phase-stack{position:fixed;right:20px;bottom:88px;z-index:179;display:none;flex-direction:column;gap:9px;align-items:center}
.ah-phase-launch{width:48px;height:48px;border-radius:50%;border:1px solid rgba(215,182,94,.85);background:#17111f;color:#f2d88d;box-shadow:0 8px 25px #0004;display:grid;place-items:center;font:600 21px/1 system-ui;cursor:pointer;transition:transform .18s,background .18s}
.ah-phase-launch:hover{transform:translateY(-2px);background:#2a1c35}
#ah-phase-layer{position:fixed;inset:0;z-index:1001;background:rgba(9,7,13,.72);backdrop-filter:blur(10px);display:none;align-items:center;justify-content:center;padding:16px}
#ah-phase-layer.is-open{display:flex}
#ah-phase-panel{width:min(650px,100%);max-height:min(84vh,780px);overflow:auto;background:#faf8f2;color:#19151e;border:1px solid #d5b75f;border-radius:22px;padding:22px;box-shadow:0 30px 90px #0006;font-family:Jost,system-ui,sans-serif}
#ah-phase-panel *{box-sizing:border-box}
#ah-phase-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}
#ah-phase-head h2{font:700 25px/1.15 'Playfair Display',Georgia,serif;margin:0 0 6px}
#ah-phase-head p{margin:0;color:#665e6d;font-size:14px}
#ah-phase-close{width:38px;height:38px;border:1px solid #ddd4c3;border-radius:50%;background:#fff;color:#2a2330;font-size:24px;cursor:pointer;flex-shrink:0}
#ah-phase-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.ah-phase-item{display:flex;align-items:center;gap:12px;padding:13px;border:1px solid #e4dccb;border-radius:14px;background:#fff;color:inherit;text-decoration:none;min-width:0;text-align:left;cursor:pointer;font:inherit}
.ah-phase-item:hover{border-color:#c9a227}
.ah-phase-item .ico{display:grid;place-items:center;width:38px;height:38px;flex-shrink:0;border-radius:11px;background:#f4edda;color:#80611b;font-size:20px}
.ah-phase-item strong{display:block;font-size:14px;font-weight:650}
.ah-phase-item small{display:block;color:#756d79;font-size:12px;margin-top:3px;line-height:1.35}
#ah-phase-note{font-size:12px;color:#766e78;margin:16px 0 0}
@media(max-width:480px){#ah-phase-stack{right:14px;bottom:78px;gap:7px}.ah-phase-launch{width:43px;height:43px;font-size:19px}#ah-phase-panel{padding:16px;border-radius:18px}#ah-phase-grid{grid-template-columns:1fr;gap:8px}.ah-phase-item{padding:11px}}
`;
document.head.appendChild(style);

function build(){
 if(document.getElementById("ah-phase-stack"))return;
 const stack=document.createElement("div");stack.id="ah-phase-stack";stack.setAttribute("aria-label","Atalhos das fases");
 stack.innerHTML=GROUPS.map(g=>`<button class="ah-phase-launch" type="button" data-phase-group="${g.id}" title="${g.title}" aria-label="Abrir ${g.title}">${g.icon}</button>`).join("");
 const layer=document.createElement("div");layer.id="ah-phase-layer";
 layer.innerHTML=`<section id="ah-phase-panel" role="dialog" aria-modal="true" aria-labelledby="ah-phase-title">
 <header id="ah-phase-head"><div><h2 id="ah-phase-title">Ferramentas da fase</h2><p id="ah-phase-desc"></p></div><button id="ah-phase-close" type="button" aria-label="Fechar">×</button></header>
 <div id="ah-phase-grid"></div><p id="ah-phase-note">Os atalhos abrem recursos já existentes. Itens em desenvolvimento serão identificados como tal dentro de suas páginas.</p></section>`;
 document.body.append(stack,layer);
 const close=()=>{layer.classList.remove("is-open");};
 stack.addEventListener("click",e=>{
  const btn=e.target.closest("[data-phase-group]");if(!btn)return;
  const group=GROUPS.find(g=>g.id===btn.dataset.phaseGroup);if(!group)return;
  layer.querySelector("#ah-phase-title").textContent=group.title;
  layer.querySelector("#ah-phase-desc").textContent=group.desc;
  layer.querySelector("#ah-phase-grid").innerHTML=group.items.map(([title,desc,type,value])=>{
   const tag=type==="url"?"a":"button";const href=type==="url"?` href="${value}"`:" type=\"button\"";
   const attrs=type==="url"?"":" data-phase-action=\""+type+"\" data-phase-value=\""+value+"\"";
   return `<${tag} class="ah-phase-item"${href}${attrs}><span class="ico" aria-hidden="true">${group.icon}</span><span><strong>${title}</strong><small>${desc}</small></span></${tag}>`;
  }).join("");
  layer.classList.add("is-open");
 });
 layer.querySelector("#ah-phase-close").addEventListener("click",close);
 layer.addEventListener("click",e=>{if(e.target===layer)close();});
 layer.querySelector("#ah-phase-grid").addEventListener("click",e=>{
  const item=e.target.closest("[data-phase-action]");if(!item)return;
  const {phaseAction,phaseValue}=item.dataset;
  if(phaseAction==="view")window.dispatchEvent(new CustomEvent("af:phase-navigate",{detail:{view:phaseValue}}));
  if(phaseAction==="tool")window.dispatchEvent(new CustomEvent("af:phase-tool",{detail:{tool:phaseValue}}));
  close();
 });
 document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
}
onAuthStateChanged(auth,user=>{
 const onAf=location.pathname.startsWith("/afplataforma");
 if(user&&onAf){build();const stack=document.getElementById("ah-phase-stack");if(stack)stack.style.display="flex";}
 else{document.getElementById("ah-phase-stack")?.remove();document.getElementById("ah-phase-layer")?.remove();}
});
