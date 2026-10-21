import { session } from "./auth.js";
import { Store } from "./storage.js";
import { esc } from "./navigation.js";
import { EXECUTIVE_GUIDANCE, ASSET_GUIDANCE, ASSET_TYPE_GUIDANCE, PHASE_GUIDANCE } from "./phase-guidance.js?v=rt45";
import { saveExecutiveNoteDraft } from "./arquitetura-legado.js?v=rt40";
import { db } from "../../firebase/firebase-config.js";
import { doc, getDoc, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const INDIVIDUAL_SESSION_GUIDANCE = [
  { title: "Sessão individual 01 · Marco Executivo 01", objective: "Confirmar diagnóstico, prioridade e escopo até haver um plano executivo acordado.", prepare: "Traga estágio atual, problema prioritário, fatos/evidências disponíveis e o resultado que deseja construir.", record: "Separe hipótese a testar, decisão tomada e pergunta ainda pendente. Depois, registre ação, responsável, prazo e evidência no campo Preparação e decisões deste marco.", example: "Hipótese: clientes não entendem a proposta. Decisão: entrevistar cinco clientes antes de refazer a página. Pendente: confirmar quem fará as entrevistas e até quando." },
  { title: "Sessão individual 02 · Marco Executivo 02", objective: "Trabalhar os ativos prioritários, revisar versões e registrar as decisões de construção/validação.", prepare: "Abra a versão atual do ativo, o critério de qualidade combinado, as dependências e o retorno recebido.", record: "Diferencie a alternativa ainda em teste da decisão aprovada e da tarefa pendente; registre revisão, responsável e data no campo deste marco.", example: "Um escritório testa o novo roteiro de atendimento com três clientes; a alteração aprovada entra na próxima versão, enquanto a integração ao sistema continua pendente." },
  { title: "Sessão individual 03 · Marco Executivo 03", objective: "Revisar entregas, organizar acesso e registrar como o trabalho continua após a sessão.", prepare: "Reúna links/arquivos finais, evidências de validação, responsáveis pela manutenção e pendências que precisam de decisão.", record: "Marque o que está entregue, o que ainda precisa de ajuste e o próximo ciclo; dê a cada ação um responsável e prazo no campo deste marco.", example: "A loja recebeu o procedimento de envio e a equipe consegue executá-lo; falta nomear quem revisa o estoque mensal e marcar a primeira revisão." },
  { title: "Sessão individual 04 · Marco Executivo 04", objective: "Revisar o que foi executado, avaliar evidências e aprendizados, registrar ajustes e fechar o próximo ciclo.", prepare: "Traga tarefas realizadas e não realizadas, evidências observáveis, retorno recebido e mudanças de contexto desde a sessão anterior.", record: "Separe fato de interpretação; anote ajuste, responsável e data de revisão. Use os campos existentes de execução/evidência/próximo passo no Marco 04.", example: "Fato: quatro de seis clientes testaram o fluxo. Aprendizado: a etapa de pagamento gerou dúvida. Ajuste: revisar a instrução; responsável: operação; prazo: antes do próximo teste." }
];

function guideDetails(guide) {
  return `<details class="alx-guide"><summary>Como preencher este marco</summary><div class="alx-guide-grid"><p><b>Pergunta:</b> ${esc(guide.question)}</p><p><b>O que se espera:</b> ${esc(guide.expected)}</p><p><b>Exemplo:</b> ${esc(guide.example)}</p><p><b>Estrutura:</b> ${esc(guide.structure)}</p><p><b>Evite:</b> ${esc(guide.avoid)}</p><p><b>Está bom quando:</b> ${esc(guide.criterion)}</p></div></details>`;
}

function enhanceDashboard(root) {
  const anchor = root.querySelector(".alx-grid2");
  if (!anchor || root.querySelector("[data-af-architecture-guide]")) return;
  const section = document.createElement("section");
  section.dataset.afArchitectureGuide = "1";
  section.className = "alx-card alx-practical-guide";
  section.innerHTML = `<div class="alx-kicker">ORIENTAÇÃO PRÁTICA</div><h3>O que fazer em cada fase</h3><p>Use os briefings e checklists para transformar conceito em referência, decisão, ação e evidência. Eles orientam o trabalho sem bloquear o acesso às outras áreas.</p><div class="alx-guide-phase-grid">${Object.values(PHASE_GUIDANCE).map((phase) => `<article><span class="alx-num">${esc(phase.number)}</span><h4>${esc(phase.title)}</h4><p>${esc(phase.what)}</p><button type="button" class="tool-btn" data-nav="fase${phase.number.replace(/^0/, "")}">Abrir fase</button></article>`).join("")}</div><div class="alx-actions"><button type="button" class="tool-btn" data-nav="mapas-mentais">Abrir mapas mentais</button></div></section>`;
  anchor.parentNode.insertBefore(section, anchor.nextSibling);
}

function enhanceJourney(root) {
  const anchor = root.querySelector(".alx-stack");
  if (!anchor || root.querySelector("[data-af-journey-briefings]")) return;
  const wrap = document.createElement("section");
  wrap.dataset.afJourneyBriefings = "1";
  wrap.className = "alx-card alx-practical-guide";
  wrap.innerHTML = `<div class="alx-kicker">BRIEFINGS DAS FASES</div><h3>Antes de marcar, entenda o resultado</h3><p>Os textos abaixo combinam o que já aparece no código e materiais com orientações didáticas adicionais, identificadas como aplicação.</p><div class="alx-briefing-list">${Object.values(PHASE_GUIDANCE).map((phase) => `<details><summary>${esc(phase.number)} · ${esc(phase.title)}</summary><p><b>O que é:</b> ${esc(phase.what)}</p><p><b>Entregável:</b> ${esc(phase.deliverable)}</p><p><b>Avanço:</b> ${esc(phase.advance)}</p><p><b>Ponte:</b> ${esc(phase.connection)}</p></details>`).join("")}</div>`;
  anchor.parentNode.insertBefore(wrap, anchor);
}

function addFieldHint(label, config) {
  if (!label || label.querySelector(".alx-field-hint")) return;
  const hint = document.createElement("small");
  hint.className = "alx-field-hint";
  hint.innerHTML = `<b>O que é:</b> ${esc(config.what)} <b>Serve para:</b> ${esc(config.purpose)} <b>Exemplo ilustrativo:</b> ${esc(config.example)} <b>Como produzir:</b> ${esc(config.how)} <b>Pronto quando:</b> ${esc(config.ready)} <b>Onde acessar/entregar:</b> ${esc(config.where)}`;
  label.appendChild(hint);
}

function loadExtraMarco(uid = session.uid || "anon") {
  return Store.get("executive_extension_v1_" + uid, { status: "not_started", context: "", evidence: "", next: "" }) || { status: "not_started", context: "", evidence: "", next: "" };
}

const extraMarcoHydratedUids = new Set();
const extraMarcoHydrations = new Map();

async function hydrateExtraMarco(card) {
  const uid = session.uid;
  if (session.mode !== "firebase" || !uid || extraMarcoHydratedUids.has(uid)) return;
  if (extraMarcoHydrations.has(uid)) return extraMarcoHydrations.get(uid);
  const promise = (async () => {
    try {
      const snap = await getDoc(doc(db, "mentorias", uid, "arquitetura_legado", "jornada"));
      if (session.uid !== uid || session.mode !== "firebase") return;
      const remote = snap.exists() ? snap.data()?.executiveExtension : null;
      const local = loadExtraMarco(uid);
      if (remote && card?.dataset.dirty !== "1" && Number(remote.updatedAtMs || 0) > Number(local.updatedAtMs || 0)) {
        Store.set("executive_extension_v1_" + uid, remote);
        if (card?.isConnected) {
          for (const field of ["context", "evidence", "next", "status"]) {
            const control = card.querySelector(`[data-extra-exec="${field}"]`);
            if (control) control.value = remote[field] || (field === "status" ? "not_started" : "");
          }
          const note = card.querySelector("[data-extra-exec-note]");
          if (note) note.textContent = "Marco 04 recuperado da sua conta.";
        }
      } else if (card?.dataset.dirty !== "1" && Number(local.updatedAtMs || 0) > Number(remote?.updatedAtMs || 0)) {
        saveExtraMarco(local, uid);
      }
      extraMarcoHydratedUids.add(uid);
    } catch (error) {
      console.warn("[Arquitetura de Legado] Marco 04 não recuperado:", error?.code || error?.message || error);
    }
  })();
  extraMarcoHydrations.set(uid, promise);
  try { return await promise; }
  finally { if (extraMarcoHydrations.get(uid) === promise) extraMarcoHydrations.delete(uid); }
}

function saveExtraMarco(value, expectedUid = session.uid || "anon") {
  if ((session.uid || "anon") !== expectedUid) return false;
  const uid = expectedUid;
  const payload = { ...value, updatedAtMs: Date.now() };
  Store.set("executive_extension_v1_" + uid, payload);
  if (session.mode === "firebase" && session.uid) {
    const ref = doc(db, "mentorias", uid, "arquitetura_legado", "jornada");
    runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      const remote = snap.exists() ? snap.data()?.executiveExtension : null;
      if (remote && Number(remote.updatedAtMs || 0) >= Number(payload.updatedAtMs || 0)) {
        const preserveBoth = (field) => {
          const localText = String(payload[field] || "");
          const remoteText = String(remote[field] || "");
          if (!localText) return remoteText;
          if (!remoteText || localText === remoteText) return localText;
          return `${remoteText}\n\n--- RASCUNHO LOCAL PRESERVADO PARA REVISÃO ---\n${localText}`.slice(0, 7000);
        };
        const merged = { ...remote, context: preserveBoth("context"), evidence: preserveBoth("evidence"), next: preserveBoth("next"), updatedAtMs: Math.max(Date.now(), Number(remote.updatedAtMs || 0)) };
        transaction.set(ref, { executiveExtension: merged, executiveExtensionUpdatedAt: serverTimestamp() }, { merge: true });
        return { value: merged, saved: false };
      }
      transaction.set(ref, { executiveExtension: payload, executiveExtensionUpdatedAt: serverTimestamp() }, { merge: true });
      return { value: payload, saved: true };
    }).then((result) => {
      if (session.uid !== uid) return;
      Store.set("executive_extension_v1_" + uid, result.value);
      if (!result.saved) {
        const card = document.querySelector("[data-af-extra-executive]");
        if (card?.dataset.dirty === "1") return;
        for (const field of ["context", "evidence", "next", "status"]) {
          const control = card?.querySelector(`[data-extra-exec="${field}"]`);
          if (control) control.value = result.value[field] || (field === "status" ? "not_started" : "");
        }
        const note = card?.querySelector("[data-extra-exec-note]");
        if (note) note.textContent = "Havia uma versão remota mais recente. Textos divergentes foram preservados juntos para revisão.";
      }
    }).catch((error) => console.warn("[Arquitetura de Legado] Marco 04 não sincronizado:", error?.code || error?.message || error));
  }
  return true;
}

const execDraftTimers = new Map();
let execDraftLifecycleBound = false;
let extraMarcoAutosaveTimer = null;

function flushExecutiveDrafts() {
  for (const [control, job] of execDraftTimers) {
    clearTimeout(job.timer);
    const saved = saveExecutiveNoteDraft(job.id, job.value, job.uid);
    const note = control.nextElementSibling?.matches("[data-exec-autosave]") ? control.nextElementSibling : null;
    if (note) note.textContent = saved ? "Rascunho salvo localmente; sincronização iniciada quando a sessão Firebase está ativa." : "A conta mudou; rascunho não enviado para evitar misturar dados entre usuários.";
    execDraftTimers.delete(control);
  }
}

function bindExecutiveDraftAutosave(root) {
  root.querySelectorAll(".alx-grid3 textarea[data-al-exec]").forEach((control) => {
    if (control.nextElementSibling?.matches("[data-exec-autosave]")) return;
    const note = document.createElement("p");
    note.className = "notes-hint alx-autosave-note";
    note.dataset.execAutosave = "1";
    note.setAttribute("role", "status");
    note.textContent = "Rascunho salvo automaticamente após uma breve pausa.";
    control.insertAdjacentElement("afterend", note);
  });
  if (root.dataset.executiveDraftAutosave === "1") return;
  root.dataset.executiveDraftAutosave = "1";
  root.addEventListener("input", (event) => {
    const control = event.target.closest(".alx-grid3 textarea[data-al-exec]");
    if (!control) return;
    const previous = execDraftTimers.get(control);
    if (previous) clearTimeout(previous.timer);
    const job = { id: control.dataset.alExec, value: control.value, uid: session.uid || "anon", timer: null };
    const note = control.nextElementSibling?.matches("[data-exec-autosave]") ? control.nextElementSibling : null;
    if (note) note.textContent = "Salvando rascunho…";
    job.timer = window.setTimeout(() => {
      const saved = saveExecutiveNoteDraft(job.id, job.value, job.uid);
      if (note) note.textContent = saved ? "Rascunho salvo localmente; sincronização iniciada quando a sessão Firebase está ativa." : "A conta mudou; rascunho não enviado para evitar misturar dados entre usuários.";
      execDraftTimers.delete(control);
    }, 800);
    execDraftTimers.set(control, job);
  });
  if (!execDraftLifecycleBound) {
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushExecutiveDrafts(); });
    window.addEventListener("pagehide", flushExecutiveDrafts);
    execDraftLifecycleBound = true;
  }
}

function readExtraMarcoForm(extra) {
  return { status: extra.querySelector('[data-extra-exec="status"]')?.value || "not_started", context: extra.querySelector('[data-extra-exec="context"]')?.value.trim().slice(0, 3000) || "", evidence: extra.querySelector('[data-extra-exec="evidence"]')?.value.trim().slice(0, 3000) || "", next: extra.querySelector('[data-extra-exec="next"]')?.value.trim().slice(0, 3000) || "" };
}

function enhanceExecutive(root) {
  const grid = root.querySelector(".alx-grid3");
  if (!grid || root.querySelector("[data-af-extra-executive]")) return;
  const existingCards = Array.from(grid.querySelectorAll(".alx-card"));
  existingCards.slice(0, 3).forEach((card, index) => {
    const guide = EXECUTIVE_GUIDANCE[index];
    if (guide && !card.querySelector(".alx-guide")) card.insertAdjacentHTML("beforeend", guideDetails(guide));
    const sessionGuide = INDIVIDUAL_SESSION_GUIDANCE[index];
    if (sessionGuide && !card.querySelector(`[data-session-guidance="${index + 1}"]`)) {
      card.insertAdjacentHTML("beforeend", `<details class="alx-guide alx-session-card-guide" data-session-guidance="${index + 1}"><summary>${esc(sessionGuide.title)} · preparar, registrar e avançar</summary><div class="alx-guide-grid"><p><b>Objetivo:</b> ${esc(sessionGuide.objective)}</p><p><b>Antes:</b> ${esc(sessionGuide.prepare)}</p><p><b>Durante/depois:</b> ${esc(sessionGuide.record)}</p><p><b>Exemplo:</b> ${esc(sessionGuide.example)}</p></div></details>`);
    }
  });
  bindExecutiveDraftAutosave(root);
  const value = loadExtraMarco();
  const extra = document.createElement("article");
  extra.className = "alx-card alx-extra-executive";
  extra.dataset.afExtraExecutive = "1";
  extra.innerHTML = `<div class="alx-kicker">MARCO EXECUTIVO 04 · EXTENSÃO OPERACIONAL</div><h3>Revisão, avaliação e próximos passos</h3><p>Checkpoint adicional para registrar o que foi executado, a evidência, o aprendizado e o próximo movimento. Não substitui os três marcos já existentes.</p>${guideDetails(EXECUTIVE_GUIDANCE[3])}<label>O que foi executado e qual evidência existe<textarea data-extra-exec="context" placeholder="Ex.: link publicado, teste realizado, reunião registrada">${esc(value.context || "")}</textarea></label><label>O que aprendemos ou precisamos ajustar<textarea data-extra-exec="evidence" placeholder="Separe fato observado de interpretação">${esc(value.evidence || "")}</textarea></label><label>Próximo passo, responsável e prazo<textarea data-extra-exec="next" placeholder="Ação pequena, dono e data">${esc(value.next || "")}</textarea></label><label>Estado<select data-extra-exec="status"><option value="not_started" ${value.status === "not_started" ? "selected" : ""}>Ainda não iniciado</option><option value="in_progress" ${value.status === "in_progress" ? "selected" : ""}>Em andamento</option><option value="done" ${value.status === "done" ? "selected" : ""}>Registrado</option></select></label><button type="button" class="tool-btn" data-extra-exec-save>Salvar marco 04</button><p class="notes-hint" data-extra-exec-note role="status">Este registro fica separado dos três marcos históricos existentes.</p>`;
  const fourthSession = INDIVIDUAL_SESSION_GUIDANCE[3];
  extra.insertAdjacentHTML("beforeend", `<details class="alx-guide alx-session-card-guide" data-session-guidance="4"><summary>${esc(fourthSession.title)} · preparar, registrar e avançar</summary><div class="alx-guide-grid"><p><b>Objetivo:</b> ${esc(fourthSession.objective)}</p><p><b>Antes:</b> ${esc(fourthSession.prepare)}</p><p><b>Durante/depois:</b> ${esc(fourthSession.record)}</p><p><b>Exemplo:</b> ${esc(fourthSession.example)}</p></div></details>`);
  grid.appendChild(extra);
  extra.querySelectorAll("[data-extra-exec]").forEach((control) => {
    const scheduleSave = () => {
      extra.dataset.dirty = "1";
      const note = extra.querySelector("[data-extra-exec-note]");
      if (note) note.textContent = "Salvando rascunho…";
      if (extraMarcoAutosaveTimer) clearTimeout(extraMarcoAutosaveTimer);
      const uid = session.uid || "anon";
      extraMarcoAutosaveTimer = window.setTimeout(() => {
        if (!saveExtraMarco(readExtraMarcoForm(extra), uid)) return;
        delete extra.dataset.dirty;
        if (note) note.textContent = "Rascunho salvo localmente; sincronização iniciada quando a sessão Firebase está ativa.";
      }, 800);
    };
    control.addEventListener("input", scheduleSave);
    control.addEventListener("change", scheduleSave);
  });
  extra.querySelector("[data-extra-exec-save]")?.addEventListener("click", () => {
    if (extraMarcoAutosaveTimer) clearTimeout(extraMarcoAutosaveTimer);
    const next = readExtraMarcoForm(extra);
    saveExtraMarco(next);
    delete extra.dataset.dirty;
    const note = extra.querySelector("[data-extra-exec-note]"); if (note) note.textContent = "Marco 04 salvo neste usuário e neste navegador.";
  });
  const sessionGuide = document.createElement("details");
  sessionGuide.className = "alx-guide alx-session-guide";
  sessionGuide.innerHTML = `<summary>Como preparar e fechar cada sessão individual</summary><div class="alx-guide-grid"><p><b>Antes:</b> abra o marco correspondente e registre contexto, evidências e a decisão que precisa de apoio.</p><p><b>Durante:</b> separe hipótese a testar, decisão realmente tomada e dúvida ainda pendente; não registre hipótese como fato.</p><p><b>Depois:</b> transforme decisões em próximos passos pequenos, cada um com responsável e prazo, no campo de preparação do marco.</p><p><b>Continuidade:</b> volte ao mesmo marco para atualizar o que foi feito e leve evidências à sessão seguinte; as respostas continuam editáveis e privadas na jornada.</p></div>`;
  grid.parentNode.insertBefore(sessionGuide, grid.nextSibling);
  hydrateExtraMarco(extra);
}

function enhanceAssets(root) {
  const form = root.querySelector("#alAssetForm");
  if (!form || root.querySelector("[data-af-asset-guidance]")) return;
  form.querySelectorAll("label").forEach((label) => {
    const field = label.querySelector("input, select, textarea");
    const config = field && ASSET_GUIDANCE[field.name];
    if (config) addFieldHint(label, config);
  });
  const status = form.querySelector('select[name="status"]');
  if (status) {
    ["Concluído", "Validado"].forEach((label) => {
      if (!Array.from(status.options).some((option) => option.value === label)) {
        const option = document.createElement("option");
        option.value = label;
        option.textContent = label;
        status.appendChild(option);
      }
    });
  }
  const guide = document.createElement("details");
  guide.dataset.afAssetGuidance = "1";
  guide.className = "alx-guide alx-asset-guide";
  guide.innerHTML = `<summary>Referência didática: tipos de ativo, produção e entrega</summary><p class="alx-asset-intro">Exemplos ilustrativos para adaptar ao seu negócio; não criam nem renomeiam categorias existentes. O arquivo permanece na fonte autorizada: registre aqui apenas o link ou caminho que a equipe pode acessar.</p><div class="alx-asset-types">${ASSET_TYPE_GUIDANCE.map((item) => `<details><summary>${esc(item.name)}</summary><div class="alx-guide-grid"><p><b>O que é:</b> ${esc(item.what)}</p><p><b>Para que serve:</b> ${esc(item.purpose)}</p><p><b>Exemplo ilustrativo:</b> ${esc(item.example)}</p><p><b>Como produzir:</b> ${esc(item.how)}</p><p><b>Pronto quando:</b> ${esc(item.ready)}</p><p><b>Onde registrar/acessar/entregar:</b> ${esc(item.where)}</p></div></details>`).join("")}<p><b>Fluxo de estado:</b> Planejado (ideia ainda não desenvolvida) → Em produção (em desenvolvimento) → Concluído → Em validação/Validado → Entregue, quando aplicável. Não marque validação ou entrega sem evidência.</p></div>`;
  form.appendChild(guide);
}

export function enhanceArchitectureView() {
  const root = document.getElementById("content");
  if (!root || !root.querySelector(".alx-view")) return;
  if (root.querySelector(".alx-hero")) enhanceDashboard(root);
  if (root.querySelector("[data-al-phase]")) enhanceJourney(root);
  if (root.querySelector("[data-al-save-exec]")) enhanceExecutive(root);
  if (root.querySelector("#alAssetForm")) enhanceAssets(root);
}
