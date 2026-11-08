import { esc, navigate, getCurrentView } from "./navigation.js";
import { session } from "./auth.js";
import { Store } from "./storage.js";

const EXERCISES = [
  { id:"agachamento", name:"Agachamento livre", group:"Peso do corpo", muscles:"Quadríceps, glúteos e core", cue:"Pés firmes, joelhos acompanhando a direção dos pés e amplitude confortável.", level:"Iniciante" },
  { id:"flexao", name:"Flexão de braços", group:"Peso do corpo", muscles:"Peitoral, tríceps e ombros", cue:"Corpo alinhado; adapte apoiando os joelhos ou elevando as mãos.", level:"Iniciante" },
  { id:"prancha", name:"Prancha", group:"Peso do corpo", muscles:"Core e estabilizadores", cue:"Mantenha respiração contínua e coluna neutra; encerre antes de perder a posição.", level:"Iniciante" },
  { id:"afundo", name:"Afundo", group:"Peso do corpo", muscles:"Quadríceps e glúteos", cue:"Use apoio se necessário e controle a descida.", level:"Intermediário" },
  { id:"remada-halter", name:"Remada unilateral", group:"Halteres", muscles:"Costas e bíceps", cue:"Apoie o tronco, mantenha coluna neutra e conduza o cotovelo para trás.", level:"Iniciante" },
  { id:"supino-halter", name:"Supino com halteres", group:"Halteres", muscles:"Peitoral, tríceps e ombros", cue:"Pés apoiados, punhos neutros e amplitude sem desconforto.", level:"Intermediário" },
  { id:"terra-halter", name:"Levantamento terra romeno", group:"Halteres", muscles:"Posterior de coxa e glúteos", cue:"Leve o quadril para trás, halteres próximos às pernas e coluna neutra.", level:"Intermediário" },
  { id:"desenvolvimento", name:"Desenvolvimento sentado", group:"Halteres", muscles:"Ombros e tríceps", cue:"Evite compensar com a lombar; use carga controlável.", level:"Intermediário" },
  { id:"leg-press", name:"Leg press", group:"Máquinas", muscles:"Quadríceps e glúteos", cue:"Não trave os joelhos; ajuste o banco e use amplitude confortável.", level:"Iniciante" },
  { id:"puxada", name:"Puxada frontal", group:"Máquinas", muscles:"Dorsais e bíceps", cue:"Puxe à frente do corpo sem balanço ou tração atrás da nuca.", level:"Iniciante" },
  { id:"remada-maquina", name:"Remada sentada", group:"Máquinas", muscles:"Costas e bíceps", cue:"Peito aberto, ombros longe das orelhas e retorno controlado.", level:"Iniciante" },
  { id:"cadeira-ext", name:"Cadeira extensora", group:"Máquinas", muscles:"Quadríceps", cue:"Ajuste o eixo da máquina ao joelho e evite impulso.", level:"Iniciante" },
  { id:"mesa-flex", name:"Mesa flexora", group:"Máquinas", muscles:"Posterior de coxa", cue:"Ajuste o rolo e controle a volta sem soltar a carga.", level:"Iniciante" },
  { id:"panturrilha", name:"Elevação de panturrilha", group:"Halteres / máquinas", muscles:"Panturrilhas", cue:"Faça amplitude confortável e pausa breve no topo.", level:"Iniciante" },
  { id:"ponte", name:"Ponte de glúteos", group:"Peso do corpo", muscles:"Glúteos e core", cue:"Suba sem hiperestender a lombar e mantenha controle.", level:"Iniciante" }
];

const KEY = "corpo_training_v1";
function state() {
  const uid = session.uid || "local";
  return Store.get(KEY + "_" + uid, { plan: [], logs: [], profile: {} });
}
function save(data) {
  const uid = session.uid || "local";
  Store.set(KEY + "_" + uid, data);
}
function today() { return new Date().toISOString().slice(0,10); }
function field(label, name, type="text", value="", extra="") {
  return `<label class="ct-field"><span>${label}</span><input name="${name}" type="${type}" value="${esc(value)}" ${extra}></label>`;
}
function navHead(kicker,title,sub,area="movimento") {
  return `<button class="corpo-back" type="button" data-nav="corpo:${area}">← Movimento e Treinamento</button><section class="corpo-area-hero"><span>${kicker}</span><h1>${title}</h1><p>${sub}</p></section>`;
}
function libraryMarkup() {
  return `<div class="ct-library">${EXERCISES.map((e)=>`<article class="ct-exercise"><span>${esc(e.group)} · ${esc(e.level)}</span><h3>${esc(e.name)}</h3><p><b>Grupos musculares:</b> ${esc(e.muscles)}</p><p>${esc(e.cue)}</p></article>`).join("")}</div>`;
}
function plannerMarkup(data) {
  return `<div class="ct-layout"><section class="ct-panel"><h2>Montar semana</h2><p>Organize os dias e o foco. Ajuste volume e descanso à sua experiência e recuperação.</p>
    <form id="ctPlanForm" class="ct-form">
      <label class="ct-field"><span>Dia</span><select name="day"><option>Segunda</option><option>Terça</option><option>Quarta</option><option>Quinta</option><option>Sexta</option><option>Sábado</option><option>Domingo</option></select></label>
      <label class="ct-field"><span>Foco do treino</span><select name="focus"><option>Corpo inteiro</option><option>Membros inferiores</option><option>Membros superiores</option><option>Empurrar</option><option>Puxar</option><option>Core e estabilidade</option><option>Mobilidade e condicionamento</option></select></label>
      <label class="ct-field"><span>Modalidade</span><select name="mode"><option>Peso do corpo</option><option>Halteres</option><option>Máquinas</option><option>Misto</option><option>Yoga e mobilidade</option></select></label>
      <button class="tool-btn" type="submit">Adicionar à semana</button>
    </form></section>
    <section class="ct-panel"><h2>Minha semana</h2>${data.plan.length ? data.plan.map((p,i)=>`<article class="ct-plan-row"><div><b>${esc(p.day)} · ${esc(p.focus)}</b><small>${esc(p.mode)}</small></div><button type="button" class="ct-remove" data-remove-plan="${i}" aria-label="Remover treino">Remover</button></article>`).join("") : '<p class="ct-empty">Sua semana ainda está vazia. Adicione os dias que deseja organizar.</p>'}</section></div>`;
}
function logMarkup(data) {
  return `<div class="ct-layout"><section class="ct-panel"><h2>Registrar sessão</h2><p>Registre o que foi realizado, não apenas o que estava planejado.</p>
    <form id="ctLogForm" class="ct-form">
      <label class="ct-field"><span>Data</span><input name="date" type="date" value="${today()}" required></label>
      <label class="ct-field"><span>Exercício</span><select name="exercise">${EXERCISES.map(e=>`<option value="${e.id}">${esc(e.name)} · ${esc(e.group)}</option>`).join("")}</select></label>
      <div class="ct-form-grid"><label class="ct-field"><span>Séries</span><input name="sets" type="number" min="1" max="20" value="3" required></label><label class="ct-field"><span>Repetições</span><input name="reps" type="number" min="1" max="100" value="10" required></label><label class="ct-field"><span>Carga (kg)</span><input name="load" type="number" min="0" max="1000" step="0.5" value="0"></label></div>
      <label class="ct-field"><span>Esforço percebido (1 a 10)</span><input name="effort" type="number" min="1" max="10" value="7"></label>
      <label class="ct-field"><span>Observações</span><textarea name="notes" rows="2" placeholder="Execução, energia, desconfortos ou adaptações"></textarea></label>
      <button class="tool-btn" type="submit">Salvar registro</button>
    </form></section>
    <section class="ct-panel"><h2>Histórico recente</h2>${data.logs.length ? [...data.logs].reverse().slice(0,12).map((l)=>{const ex=EXERCISES.find(e=>e.id===l.exercise);return `<article class="ct-log-row"><b>${esc(ex?.name || l.exercise)}</b><small>${esc(l.date)} · ${l.sets} × ${l.reps} · ${l.load} kg · esforço ${l.effort}/10</small>${l.notes?`<p>${esc(l.notes)}</p>`:""}</article>`;}).join("") : '<p class="ct-empty">Nenhuma sessão registrada ainda.</p>'}</section></div>`;
}
function progressMarkup(data) {
  const total = data.logs.length;
  const volume = data.logs.reduce((s,l)=>s+(Number(l.sets)||0)*(Number(l.reps)||0)*(Number(l.load)||0),0);
  const best = {};
  data.logs.forEach(l=>{best[l.exercise]=Math.max(best[l.exercise]||0,Number(l.load)||0);});
  return `<div class="ct-stats"><article><span>SESSÕES REGISTRADAS</span><strong>${total}</strong></article><article><span>VOLUME ACUMULADO*</span><strong>${Math.round(volume).toLocaleString("pt-BR")} kg</strong></article><article><span>EXERCÍCIOS ACOMPANHADOS</span><strong>${Object.keys(best).length}</strong></article></div>
    <section class="ct-panel"><h2>Melhores cargas registradas</h2>${Object.keys(best).length ? Object.entries(best).map(([id,load])=>`<div class="ct-progress-row"><span>${esc(EXERCISES.find(e=>e.id===id)?.name || id)}</span><b>${load} kg</b></div>`).join("") : '<p class="ct-empty">Os indicadores aparecerão conforme você registrar suas sessões.</p>'}<p class="ct-note">*Estimativa simples: séries × repetições × carga informada. Não representa gasto calórico nem medida clínica.</p></section>
    <section class="ct-panel"><h2>Histórico completo</h2>${data.logs.length ? [...data.logs].reverse().map(l=>`<div class="ct-progress-row"><span>${esc(l.date)} · ${esc(EXERCISES.find(e=>e.id===l.exercise)?.name || l.exercise)}</span><b>${l.sets}×${l.reps} · ${l.load} kg</b></div>`).join("") : '<p class="ct-empty">Ainda não há dados para comparar.</p>'}</section>`;
}
function generatorMarkup(data) {
  return `<section class="ct-panel ct-generator"><h2>Planejador assistido</h2><p>Monte uma sugestão inicial a partir dos seus objetivos, disponibilidade e equipamentos. É um modelo de organização, não uma prescrição médica nem uma IA generativa.</p>
    <form id="ctGeneratorForm" class="ct-form">
      <label class="ct-field"><span>Objetivo principal</span><select name="goal"><option>Condicionamento geral</option><option>Força</option><option>Hipertrofia</option><option>Mobilidade e flexibilidade</option><option>Retorno gradual à atividade</option></select></label>
      <label class="ct-field"><span>Experiência</span><select name="level"><option>Iniciante</option><option>Intermediário</option><option>Avançado</option></select></label>
      <label class="ct-field"><span>Dias disponíveis por semana</span><select name="days"><option value="2">2 dias</option><option value="3" selected>3 dias</option><option value="4">4 dias</option><option value="5">5 dias</option></select></label>
      <label class="ct-field"><span>Equipamentos</span><select name="equipment"><option>Misto</option><option>Peso do corpo</option><option>Halteres</option><option>Máquinas</option></select></label>
      <button class="tool-btn" type="submit">Gerar estrutura semanal</button>
    </form>
    <div id="ctGenerated" class="ct-generated">${data.profile?.generated ? `<h3>Estrutura salva · ${esc(data.profile.goal)}</h3>${data.profile.generated.map(x=>`<article class="ct-plan-row"><div><b>${esc(x.day)} · ${esc(x.focus)}</b><small>${esc(x.mode)} · ${esc(x.note)}</small></div></article>`).join("")}` : '<p class="ct-empty">Preencha os campos para gerar uma estrutura semanal inicial.</p>'}</div></section>`;
}
export function renderCorpoTrainingSpace(slug) {
  const data = state();
  const pages = {
    "biblioteca-de-exercicios": [navHead("MOVIMENTO · BIBLIOTECA","Biblioteca de exercícios","Técnica, grupos musculares e orientações de execução."),libraryMarkup()],
    "planejamento-de-treino": [navHead("MOVIMENTO · PLANEJAMENTO","Planejamento semanal","Organize seus treinos e distribua os estímulos ao longo da semana."),plannerMarkup(data)],
    "diario-de-treino": [navHead("MOVIMENTO · DIÁRIO","Diário de treino","Registre séries, repetições, carga e percepção de esforço."),logMarkup(data)],
    "evolucao-e-progressao": [navHead("MOVIMENTO · EVOLUÇÃO","Evolução e progressão","Acompanhe consistência, cargas e histórico de sessões."),progressMarkup(data)],
    "treinamento-com-ia": [navHead("MOVIMENTO · PLANEJADOR","Planejador assistido","Uma estrutura inicial configurável, revisável e ajustável."),generatorMarkup(data)]
  };
  const page = pages[slug];
  if (!page) return null;
  return `<div class="view active corpo-view ct-view">${page.join("")}<p class="ct-note">Seus registros são salvos neste navegador e vinculados à sessão atual neste dispositivo. Sincronização entre dispositivos ainda não está ativada. Interrompa o exercício diante de dor aguda, tontura ou falta de ar incomum; procure orientação profissional para restrições ou condições de saúde.</p></div>`;
}
export function bindCorpoTraining() {
  const root = document.getElementById("content");
  if (!root || !root.querySelector(".ct-view")) return;
  const rerender = () => navigate(getCurrentView());
  root.querySelector("#ctPlanForm")?.addEventListener("submit",(e)=>{
    e.preventDefault(); const f=new FormData(e.currentTarget); const d=state();
    d.plan.push({day:f.get("day"),focus:f.get("focus"),mode:f.get("mode")}); save(d); rerender();
  });
  root.querySelectorAll("[data-remove-plan]").forEach(btn=>btn.addEventListener("click",()=>{
    const d=state(); d.plan.splice(Number(btn.dataset.removePlan),1); save(d); rerender();
  }));
  root.querySelector("#ctLogForm")?.addEventListener("submit",(e)=>{
    e.preventDefault(); const f=new FormData(e.currentTarget); const d=state();
    d.logs.push({date:f.get("date"),exercise:f.get("exercise"),sets:Number(f.get("sets")),reps:Number(f.get("reps")),load:Number(f.get("load")),effort:Number(f.get("effort")),notes:String(f.get("notes")||"").slice(0,500)});
    save(d); rerender();
  });
  root.querySelector("#ctGeneratorForm")?.addEventListener("submit",(e)=>{
    e.preventDefault(); const f=new FormData(e.currentTarget); const d=state();
    const days=Number(f.get("days")); const mode=f.get("equipment"); const goal=f.get("goal");
    const focuses=days===2?["Corpo inteiro","Corpo inteiro"]:days===3?["Corpo inteiro","Membros inferiores","Membros superiores"]:days===4?["Membros inferiores","Membros superiores","Membros inferiores","Membros superiores"]:["Membros inferiores","Membros superiores","Core e estabilidade","Condicionamento geral","Mobilidade e recuperação"];
    const labels=["Segunda","Terça","Quarta","Quinta","Sexta"];
    d.profile={goal,level:f.get("level"),days,equipment:mode,generated:focuses.map((focus,i)=>({day:labels[i],focus,mode,note:goal+" · ajustar conforme recuperação"}))};
    d.plan=d.profile.generated.map(x=>({day:x.day,focus:x.focus,mode:x.mode})); save(d); rerender();
  });
}
