/**
 * LifeOS — painel central da pessoa, do negócio e do processo de mentoria.
 * Esta camada organiza acessos existentes; não duplica nem remove ferramentas.
 */
import { session } from "./auth.js";
import { esc, unlockedCount, nextModule } from "./navigation.js";
import { MODULES } from "../../data/modules.js";
import { Store } from "./storage.js";
import { getAfTool, saveAfTool } from "../../firebase/firestore.js";

const PLAN_TOOL_ID = "lifeos-weekly-plan";

function emptyWeeklyPlan() {
  return { focus: "", tasks: [] };
}

function cleanWeeklyPlan(raw) {
  const plan = raw && typeof raw === "object" ? raw : {};
  const sourceTasks = Array.isArray(plan.tasks) ? plan.tasks : [];
  const tasks = sourceTasks.slice(0, 100).map((task) => {
    const item = task && typeof task === "object" ? task : {};
    const due = String(item.due || "");
    return {
      id: String(item.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 8))),
      text: String(item.text || "").slice(0, 160),
      due: /^\\d{4}-\\d{2}-\\d{2}$/.test(due) ? due : "",
      done: item.done === true
    };
  });
  return { focus: String(plan.focus || "").slice(0, 180), tasks };
}

function storedWeeklyPlan() {
  try {
    return cleanWeeklyPlan(Store.get("lifeos_weekly_plan_" + (session.uid || "anon"), emptyWeeklyPlan()));
  } catch {
    return emptyWeeklyPlan();
  }
}

function taskRow(task, i) {
  return `<article class="lifeos-plan-task${task.done ? " is-done" : ""}" data-task-row="${esc(task.id)}">
    <label class="lifeos-plan-done" title="Marcar como concluída">
      <input data-plan-done="${esc(task.id)}" type="checkbox" ${task.done ? "checked" : ""}>
    </label>
    <div class="lifeos-plan-task-main">
      <label class="sr-only" for="lifeosTask${esc(task.id)}">Descrição da tarefa ${i + 1}</label>
      <input id="lifeosTask${esc(task.id)}" data-plan-task="${esc(task.id)}" maxlength="160" value="${esc(task.text)}" placeholder="O que precisa ser feito?">
      <div class="lifeos-plan-task-meta">
        <label for="lifeosDue${esc(task.id)}">Prazo</label>
        <input id="lifeosDue${esc(task.id)}" data-plan-due="${esc(task.id)}" type="date" value="${esc(task.due)}">
      </div>
    </div>
    <button class="lifeos-task-remove" type="button" data-task-remove="${esc(task.id)}" aria-label="Remover tarefa">×</button>
  </article>`;
}

function renderWeeklyPlan(plan) {
  return `<section class="lifeos-plan" id="lifeosPlan" aria-label="Lista de tarefas">
    <div class="lifeos-plan-head">
      <div>
        <p class="eyebrow">Organização e execução</p>
        <h3>Minhas tarefas</h3>
        <p>Adicione tarefas, defina prazos e marque o que já concluiu.</p>
      </div>
      <span class="lifeos-plan-count" id="lifeosPlanCount">0/0 concluídas</span>
    </div>
    <div class="lifeos-plan-focus">
      <label for="lifeosPlanFocus">Prioridade principal</label>
      <input id="lifeosPlanFocus" maxlength="180" value="${esc(plan.focus)}" placeholder="Qual é a prioridade mais importante agora?">
    </div>
    <div class="lifeos-plan-add">
      <input id="lifeosNewTask" maxlength="160" placeholder="Digite uma tarefa e pressione Enter">
      <button class="tool-btn primary" type="button" id="lifeosPlanAdd">+ Adicionar</button>
    </div>
    <div class="lifeos-plan-tasks" id="lifeosPlanTasks">
      ${plan.tasks.map((task, i) => taskRow(task, i)).join("") || '<p class="lifeos-plan-empty">Sua lista está vazia. Adicione a primeira tarefa acima.</p>'}
    </div>
    <div class="lifeos-plan-footer">
      <p id="lifeosPlanStatus" role="status" aria-live="polite">Suas tarefas ficam salvas nesta conta quando a sincronização está disponível.</p>
      <button class="tool-btn primary" type="button" id="lifeosPlanSave">Salvar tarefas</button>
    </div>
  </section>`;
}

function paintWeeklyPlan(root, plan) {
  const focus = root.querySelector("#lifeosPlanFocus");
  if (focus) focus.value = plan.focus;
  const list = root.querySelector("#lifeosPlanTasks");
  if (list) list.innerHTML = plan.tasks.map((task, i) => taskRow(task, i)).join("") || '<p class="lifeos-plan-empty">Sua lista está vazia. Adicione a primeira tarefa acima.</p>';
  updateWeeklyPlanCount(root);
}

function collectWeeklyPlan(root) {
  const tasks = [...root.querySelectorAll("[data-plan-task]")].map((field) => {
    const id = field.dataset.planTask;
    return {
      id,
      text: field.value || "",
      due: root.querySelector('[data-plan-due="' + id + '"]')?.value || "",
      done: root.querySelector('[data-plan-done="' + id + '"]')?.checked === true
    };
  });
  return cleanWeeklyPlan({ focus: root.querySelector("#lifeosPlanFocus")?.value || "", tasks });
}

function updateWeeklyPlanCount(root) {
  const count = root.querySelector("#lifeosPlanCount");
  if (!count) return;
  const plan = collectWeeklyPlan(root);
  const filled = plan.tasks.filter((task) => task.text.trim()).length;
  const done = plan.tasks.filter((task) => task.text.trim() && task.done).length;
  count.textContent = done + "/" + filled + " concluídas";
  root.querySelectorAll("[data-task-row]").forEach((row) => {
    const checkbox = row.querySelector("[data-plan-done]");
    row.classList.toggle("is-done", checkbox?.checked === true);
  });
}

export function bindLifeOsDashboard() {
  const root = document.getElementById("content");
  const section = root?.querySelector("#lifeosPlan");
  if (!root || !section || section.dataset.bound === "1") return;
  section.dataset.bound = "1";
  const status = section.querySelector("#lifeosPlanStatus");
  const button = section.querySelector("#lifeosPlanSave");
  const addButton = section.querySelector("#lifeosPlanAdd");
  const newTask = section.querySelector("#lifeosNewTask");

  const persistLocal = (data) => {
    try { Store.set("lifeos_weekly_plan_" + (session.uid || "anon"), data); } catch {}
  };
  const addTask = () => {
    const text = String(newTask?.value || "").trim();
    if (!text) { newTask?.focus(); return; }
    const plan = collectWeeklyPlan(section);
    if (plan.tasks.length >= 100) {
      if (status) status.textContent = "Você chegou ao limite de 100 tarefas nesta lista.";
      return;
    }
    plan.tasks.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), text: text.slice(0, 160), due: "", done: false });
    paintWeeklyPlan(section, plan);
    if (newTask) { newTask.value = ""; newTask.focus(); }
    persistLocal(collectWeeklyPlan(section));
  };
  addButton?.addEventListener("click", addTask);
  newTask?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { event.preventDefault(); addTask(); }
  });
  section.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-task-remove]");
    if (!remove) return;
    remove.closest("[data-task-row]")?.remove();
    if (!section.querySelector("[data-task-row]")) {
      section.querySelector("#lifeosPlanTasks").innerHTML = '<p class="lifeos-plan-empty">Sua lista está vazia. Adicione a primeira tarefa acima.</p>';
    }
    persistLocal(collectWeeklyPlan(section));
    updateWeeklyPlanCount(section);
  });
  section.addEventListener("input", () => updateWeeklyPlanCount(section));
  section.addEventListener("change", () => {
    updateWeeklyPlanCount(section);
    persistLocal(collectWeeklyPlan(section));
  });

  button?.addEventListener("click", async () => {
    const current = collectWeeklyPlan(section);
    persistLocal(current);
    button.disabled = true;
    button.textContent = "Salvando...";
    if (status) status.textContent = "Salvando suas tarefas...";
    try {
      if (session.mode === "firebase" && session.uid) {
        await saveAfTool(session.uid, PLAN_TOOL_ID, current);
        if (status) status.textContent = "Tarefas salvas na sua conta e sincronizadas entre dispositivos.";
      } else {
        if (status) status.textContent = "Tarefas salvas neste navegador. Entre com sua conta para sincronizar entre dispositivos.";
      }
      if (status) status.dataset.state = "saved";
    } catch (error) {
      console.warn("[LifeOS] Não foi possível sincronizar as tarefas:", error?.code || error?.message || error);
      if (status) status.textContent = "Rascunho guardado neste navegador, mas a sincronização não concluiu. Tente novamente.";
      if (status) status.dataset.state = "local";
    } finally {
      button.disabled = false;
      button.textContent = "Salvar tarefas";
    }
  });

  if (session.mode === "firebase" && session.uid) {
    if (status) status.textContent = "Carregando suas tarefas...";
    getAfTool(session.uid, PLAN_TOOL_ID).then((remote) => {
      if (!root.contains(section) || !remote) {
        if (root.contains(section) && status) status.textContent = "Nenhuma tarefa sincronizada ainda. Adicione sua primeira tarefa.";
        return;
      }
      const loaded = cleanWeeklyPlan(remote);
      paintWeeklyPlan(section, loaded);
      persistLocal(loaded);
      if (status) status.textContent = "Tarefas carregadas da sua conta.";
    }).catch((error) => {
      console.warn("[LifeOS] Não foi possível carregar as tarefas:", error?.code || error?.message || error);
      if (root.contains(section) && status) status.textContent = "Não consegui carregar da nuvem agora. Você ainda pode salvar um rascunho local.";
    });
  } else if (status) {
    status.textContent = "Modo local: as tarefas ficam salvas neste navegador, sem sincronização entre dispositivos.";
  }
  updateWeeklyPlanCount(section);
}

export function renderLifeOsDashboard() {
  const nome = String(session.name || "").trim().split(/\s+/)[0];
  const abertos = unlockedCount();
  const proximo = nextModule();
  const primeiroLiberado = MODULES.find((m) => session.modules[m.id]) || null;
  const totalModulos = MODULES.length || 7;
  const acessoPercentual = Math.round((abertos / totalModulos) * 100);
  const fases = [
    ["fase1", "01", "Essência", "Identidade, história, capacidades e direção."],
    ["fase2", "02", "Império Digital", "Posicionamento, marca, ativos e estrutura comercial."],
    ["fase3", "03", "Alinhamento Financeiro", "Caixa, indicadores, preço, metas e decisões."],
    ["fase4", "04", "Processos de Execução e Expansão", "Processos, responsabilidades, qualidade e crescimento sustentável."],
    ["fase5", "05", "Legado", "Conhecimento, formação, comunidade, movimento e continuidade."]
  ];
  return `<div class="view active lifeos-home">
    <style>
      .lifeos-home .lifeos-kicker{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
      .lifeos-home .lifeos-intro{max-width:760px;color:var(--muted);line-height:1.7;margin:10px 0 24px}
      .lifeos-home .lifeos-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:12px;margin:14px 0 28px}
      .lifeos-home .lifeos-card{border:1px solid var(--line);background:var(--bg2);padding:18px;min-height:168px;display:flex;flex-direction:column;align-items:flex-start;gap:9px}
      .lifeos-home .lifeos-card h3{font-family:var(--font-d);font-size:1.45rem;font-weight:400}
      .lifeos-home .lifeos-card p{color:var(--muted);font-size:12px;line-height:1.65}
      .lifeos-home .lifeos-mark{font-size:10px;letter-spacing:.15em;color:var(--gold)}
      .lifeos-home .lifeos-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:8px}
      .lifeos-home .lifeos-phases{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,205px),1fr));gap:10px;margin:14px 0 22px}
      .lifeos-home .lifeos-phase{border:1px solid var(--line);padding:14px;background:var(--surface);cursor:pointer}
      .lifeos-home .lifeos-phase .num{color:var(--gold);font-size:11px;letter-spacing:.12em}
      .lifeos-home .lifeos-phase h4{font-size:13px;font-weight:500;margin:8px 0}
      .lifeos-home .lifeos-phase p{font-size:11px;color:var(--muted);line-height:1.6}
      .lifeos-home .lifeos-plan{margin:28px 0;padding:22px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(145deg,rgba(255,255,255,.86),rgba(248,244,252,.95));box-shadow:0 14px 38px rgba(30,18,40,.07)}
      .lifeos-home .lifeos-plan-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px}
      .lifeos-home .lifeos-plan .eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin-bottom:8px}
      .lifeos-home .lifeos-plan h3{font-size:clamp(1.2rem,2.5vw,1.55rem);margin:0 0 8px}
      .lifeos-home .lifeos-plan p{color:var(--muted);font-size:12px;line-height:1.6;margin:0}
      .lifeos-home .lifeos-plan-count{white-space:nowrap;font-size:11px;color:#725b2d;border:1px solid rgba(185,154,74,.45);padding:7px 10px;border-radius:99px;background:rgba(226,199,119,.12)}
      .lifeos-home .lifeos-plan-focus{display:grid;gap:7px;margin-bottom:14px}
      .lifeos-home .lifeos-plan label{font-size:11px;color:var(--text,#29222f)}
      .lifeos-home .lifeos-plan input:not([type=checkbox]){box-sizing:border-box;width:100%;min-width:0;padding:11px 12px;border:1px solid var(--line);border-radius:9px;background:#fff;color:#211c29;font:inherit;font-size:13px}
      .lifeos-home .lifeos-plan-tasks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      .lifeos-home .lifeos-plan-task{padding:14px;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.8);min-width:0}
      .lifeos-home .lifeos-plan-task-title{display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:12px}
      .lifeos-home .lifeos-plan-task-title span{font-size:10px;letter-spacing:.12em;color:var(--gold)}
      .lifeos-home .lifeos-plan-task-meta{display:grid;grid-template-columns:1fr;gap:7px;margin-top:10px}
      .lifeos-home .lifeos-plan-task-meta input[type=date]{max-width:100%}
      .lifeos-home .lifeos-plan-done{display:flex!important;align-items:center;gap:8px;margin-top:2px}
      .lifeos-home .lifeos-plan-done input{accent-color:#76509a}
      .lifeos-home .lifeos-plan-add{display:flex;gap:8px;margin:14px 0}
      .lifeos-home .lifeos-plan-add input{flex:1;min-width:0;border:1px solid var(--line);border-radius:10px;padding:12px;background:#fff;color:#20212a}
      .lifeos-home .lifeos-plan-task{display:flex;align-items:flex-start;gap:10px}
      .lifeos-home .lifeos-plan-task-main{flex:1;min-width:0}
      .lifeos-home .lifeos-plan-task.is-done [data-plan-task]{text-decoration:line-through;opacity:.65}
      .lifeos-home .lifeos-task-remove{border:0;background:transparent;font-size:22px;cursor:pointer;color:var(--muted);padding:0 8px}
      .lifeos-home .lifeos-plan-empty{padding:16px;border:1px dashed var(--line);border-radius:10px;color:var(--muted);font-size:13px}
      .lifeos-home .lifeos-plan-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:16px}
      .lifeos-home .lifeos-plan-footer p{max-width:620px}
      .lifeos-home .lifeos-plan .tool-btn{cursor:pointer}
      .lifeos-home .lifeos-plan .tool-btn:disabled{opacity:.6;cursor:wait}
      .lifeos-home .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
      @media(max-width:850px){.lifeos-home .lifeos-plan-tasks{grid-template-columns:1fr}}
      .lifeos-home .lifeos-note{border-left:2px solid var(--gold);padding:12px 15px;color:var(--muted);font-size:12px;line-height:1.7;margin:12px 0 24px}
      .lifeos-home .lifeos-start{position:relative;overflow:hidden;display:grid;grid-template-columns:minmax(0,1.4fr) minmax(220px,.8fr);gap:20px;padding:22px;margin:22px 0 28px;border:1px solid rgba(185,154,74,.3);border-radius:18px;background:radial-gradient(ellipse at 100% 0%,rgba(130,83,177,.16),transparent 52%),linear-gradient(135deg,rgba(35,22,51,.97),rgba(17,12,27,.98));color:#f7f0ff;box-shadow:0 18px 48px rgba(31,18,46,.15)}
      .lifeos-home .lifeos-start .eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#e2c777;margin-bottom:8px}
      .lifeos-home .lifeos-start h3{font-size:clamp(1.1rem,2.5vw,1.45rem);line-height:1.3;margin-bottom:8px;color:#fff}
      .lifeos-home .lifeos-start p{font-size:12px;line-height:1.7;color:#d0c3df;max-width:620px}
      .lifeos-home .lifeos-start .lifeos-actions{margin-top:14px}
      .lifeos-home .lifeos-start .tool-btn{background:rgba(255,255,255,.08);border-color:rgba(226,199,119,.35);color:#fff4d0}
      .lifeos-home .lifeos-start .tool-btn.primary{background:linear-gradient(135deg,#8a64b4,#624183);border-color:#c8a96a}
      .lifeos-home .lifeos-access{align-self:center;padding:16px;border:1px solid rgba(226,199,119,.2);border-radius:14px;background:rgba(255,255,255,.045)}
      .lifeos-home .lifeos-access .line{display:flex;justify-content:space-between;gap:12px;font-size:11px;color:#e4d9f0}
      .lifeos-home .lifeos-access .line strong{color:#f0d58a}
      .lifeos-home .lifeos-access .track{height:6px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden;margin:12px 0 8px}
      .lifeos-home .lifeos-access .fill{height:100%;width:var(--access,0%);border-radius:99px;background:linear-gradient(90deg,#9b74d0,#e2c777)}
      .lifeos-home .lifeos-access small{font-size:10px;line-height:1.5;color:#bcaed0}
      @media(max-width:680px){.lifeos-home .lifeos-start{grid-template-columns:1fr;padding:17px}.lifeos-home .lifeos-access{width:100%}}
    </style>
    <p class="lifeos-kicker">LifeOS · Central de comando</p>
    <h2 class="hero-title">Organizar a vida. Conduzir o negócio. Executar o que importa.</h2>
    <p class="lifeos-intro">Bem-vindo${nome ? ", " + esc(nome) : ""}. Aqui você encontra seu próximo passo, os acessos liberados e as ferramentas para transformar as decisões da mentoria em execução real.</p>
    <section class="lifeos-start" aria-label="Comece sua jornada">
      <div>
        <p class="eyebrow">Seu ponto de partida</p>
        <h3>${primeiroLiberado ? "Comece pelo módulo " + esc(primeiroLiberado.num) + " · " + esc(primeiroLiberado.title) : "Defina seu ponto de partida"}</h3>
        <p>${primeiroLiberado
          ? "Este módulo está liberado para sua conta. Abra o conteúdo e avance no seu ritmo. O painel mostra acessos, não presume conclusão."
          : "Sua conta ainda não tem módulos liberados. Abra um encontro com seu mentor para combinar o ponto de partida e confirmar as próximas liberações."}</p>
        <div class="lifeos-actions">
          <button class="tool-btn primary" type="button" data-nav="${primeiroLiberado ? "module:" + primeiroLiberado.id : "call"}">${primeiroLiberado ? "Começar módulo " + esc(primeiroLiberado.num) : "Alinhar ponto de partida"}</button>
          <button class="tool-btn" type="button" data-nav="modules">Ver todos os módulos</button>
          <button class="tool-btn" type="button" data-nav="call">${primeiroLiberado ? "Preparar encontro" : "Abrir encontro com mentor"}</button>
        </div>
      </div>
      <div class="lifeos-access">
        <div class="line"><span>Acessos a módulos</span><strong>${abertos}/${totalModulos}</strong></div>
        <div class="track" role="progressbar" aria-label="Percentual de módulos com acesso liberado" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${acessoPercentual}"><div class="fill" style="--access:${acessoPercentual}%"></div></div>
        <small>Este indicador mostra permissões de acesso, não conclusão de atividades ou resultados.</small>
      </div>
    </section>
    ${renderWeeklyPlan(storedWeeklyPlan())}
    <div class="grid-3">
      <div class="stat-card"><div class="lbl">Módulos liberados</div><div class="val">${abertos}/${totalModulos}</div><div class="hint">Acesso atual da sua conta</div></div>
      <div class="stat-card"><div class="lbl">Próxima liberação na trilha</div><div class="val" style="font-size:.98rem;line-height:1.4;padding-top:8px">${proximo ? esc(proximo.num + " · " + proximo.title) : "Trilha liberada"}</div><div class="hint">${proximo ? "Se precisar deste conteúdo, alinhe a liberação com seu mentor." : "Todos os módulos estão liberados para sua conta."}</div></div>
      <div class="stat-card"><div class="lbl">Seu processo</div><div class="val" style="font-size:1.1rem;padding-top:8px">Mentoria + execução</div><div class="hint">Decisões, ferramentas, prática e revisão</div></div>
    </div>
    <h3 class="section-h">As três dimensões do LifeOS</h3>
    <div class="lifeos-grid">
      <article class="lifeos-card"><span class="lifeos-mark">DIMENSÃO 01</span><h3>Corpo</h3><p>Energia, rotina, hábitos, sono e consistência para sustentar o que precisa ser feito.</p><div class="lifeos-actions"><button class="tool-btn" type="button" data-nav="complementar">Explorar ferramentas</button><button class="tool-btn" type="button" data-nav="tools">Abrir ferramentas</button></div></article>
      <article class="lifeos-card"><span class="lifeos-mark">DIMENSÃO 02</span><h3>Mente</h3><p>Clareza, foco, aprendizagem, identidade, escolhas e preparação para agir com intenção.</p><div class="lifeos-actions"><button class="tool-btn" type="button" data-nav="fase1">Essência</button><button class="tool-btn" type="button" data-nav="modules">Módulos e materiais</button></div></article>
      <article class="lifeos-card"><span class="lifeos-mark">DIMENSÃO 03</span><h3>Campo</h3><p>Aplicação no mundo real: negócio, dinheiro, posicionamento, relações, entregas e resultados.</p><div class="lifeos-actions"><button class="tool-btn" type="button" data-nav="fase2">Estratégia</button><button class="tool-btn" type="button" data-nav="af-dashboard">Dashboard AF</button><button class="tool-btn" type="button" data-nav="empresas">Empresas</button></div></article>
    </div>
    <h3 class="section-h">Mentoria e execução · acompanhamento do processo</h3>
    <p class="lifeos-intro">A mentoria continua sendo um processo próprio, conduzido em conjunto. Este painel conecta cada etapa às ferramentas e à execução — não transforma a mentoria em uma simples lista automática de tarefas.</p>
    <div class="lifeos-phases">${fases.map(([id, num, titulo, descricao]) => `<div class="lifeos-phase" data-nav="${id}"><div class="num">FASE ${num}</div><h4>${titulo}</h4><p>${descricao}</p></div>`).join("")}</div>
    <div class="lifeos-note">O painel mostra os acessos e o progresso de módulos que a plataforma já conhece. Não presume que uma etapa da mentoria foi concluída nem inventa atividades, marcos ou resultados. O registro detalhado de decisões e acompanhamento pode evoluir sem mexer no conteúdo original das fases.</div>
    <h3 class="section-h">Acesso rápido</h3>
    <div class="lifeos-actions" style="margin:0 0 28px"><button class="tool-btn" type="button" data-nav="call">Call / encontro</button><button class="tool-btn" type="button" data-nav="complementar">Ferramentas complementares</button><button class="tool-btn" type="button" data-nav="quitei">Quitei</button><button class="tool-btn" type="button" data-nav="fase3">Fase 3 · Alinhamento Financeiro</button></div>
  </div>`;
}
