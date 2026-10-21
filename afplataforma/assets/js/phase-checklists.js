import { session } from "./auth.js";
import { Store } from "./storage.js";
import { esc } from "./navigation.js";
import { PHASE_GUIDANCE } from "./phase-guidance.js?v=rt45";
import { db } from "../../firebase/firebase-config.js";
import { doc, getDoc, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const STATUS_LABELS = {
  not_started: "Ainda não iniciado",
  in_progress: "Em andamento",
  done: "Concluído"
};

function key(uid = session.uid || "anon") {
  return "phase_checklists_v1_" + uid;
}

function legacyKey(uid = session.uid || "anon") {
  return "fase2_ativos_" + uid;
}

function loadAll(uid = session.uid || "anon") {
  const raw = Store.get(key(uid), {});
  return raw && typeof raw === "object" ? raw : {};
}

function migratedState(uid = session.uid || "anon") {
  const all = loadAll(uid);
  if (!all.fase2 || !Object.keys(all.fase2).length) {
    const legacy = Store.get(legacyKey(uid), {});
    if (legacy && typeof legacy === "object" && Object.keys(legacy).length) {
      all.fase2 = {};
      // O checklist antigo era visual e indexado. Preserve cada significado
      // explicitamente, inclusive os dois itens de presença que agora vivem
      // em um só registro, em vez de deslocar silenciosamente os índices.
      const migrated = {
        identidade: [[0, "identidade visual"]],
        presenca: [[1, "site ou landing"], [2, "redes sociais"]],
        oferta: [[3, "oferta estruturada"]],
        operacao: [[4, "aplicativo ou sistema"]],
        conteudo: [[5, "calendário editorial"]],
        "primeiro-ativo": [[6, "primeiro ativo digital entregue"]]
      };
      Object.entries(migrated).forEach(([id, entries]) => {
        const checked = entries.filter(([index]) => !!legacy[String(index)]);
        if (checked.length) {
          all.fase2[id] = {
            status: "done",
            reference: `Migrado do checklist anterior: ${checked.map(([, label]) => label).join("; ")}`,
            updatedAtMs: Date.now()
          };
        }
      });
      all._updatedAtMs = Date.now();
      Store.set(key(uid), all);
    }
  }
  return all;
}

function phaseState(phaseId) {
  const all = migratedState();
  return all[phaseId] && typeof all[phaseId] === "object" ? all[phaseId] : {};
}

function persist(all) {
  const uid = session.uid || "anon";
  all._updatedAtMs = Date.now();
  Store.set(key(uid), all);
  if (session.mode !== "firebase" || !session.uid) return;
  syncChecklistState(uid, all).catch((error) => {
    console.warn("[AF checklists] sincronização indisponível:", error?.code || error?.message || error);
    document.querySelectorAll("[data-checklist-note]").forEach((note) => { note.textContent = "O registro está salvo neste navegador, mas a sincronização remota falhou. Reconecte e altere/salve novamente."; });
  });
}

export function readPhaseChecklist(phaseId) {
  return phaseState(phaseId);
}

export function phaseProgress(phaseId) {
  const items = PHASE_GUIDANCE[phaseId]?.checklist || [];
  const state = phaseState(phaseId);
  const done = items.filter((item) => state[item.id]?.status === "done" && !!state[item.id]?.reference?.trim()).length;
  return { done, total: items.length, percent: items.length ? Math.round(done / items.length * 100) : 0 };
}

function itemStatus(state, itemId) {
  return STATUS_LABELS[state[itemId]?.status] ? state[itemId].status : "not_started";
}

export function renderPhaseChecklist(phaseId) {
  const phase = PHASE_GUIDANCE[phaseId];
  if (!phase) return "";
  const state = phaseState(phaseId);
  const progress = phaseProgress(phaseId);
  return `<details class="phase-fold">
    <summary>Checklist da fase</summary>
    <section class="phase-checklist" data-phase-checklist="${esc(phaseId)}" aria-labelledby="checklist-${esc(phaseId)}">
    <div class="phase-checklist-head">
      <div><p class="hero-line">CHECKLIST DE CONCLUSÃO</p><h3 id="checklist-${esc(phaseId)}">O que precisa estar verdadeiro para avançar</h3><p class="notes-hint">Uma tarefa iniciada não é uma tarefa concluída. Marque “Concluído” somente quando houver a evidência ou o entregável indicado.</p></div>
      <div class="phase-progress" aria-label="${progress.done} de ${progress.total} itens concluídos"><strong data-checklist-progress>${progress.percent}%</strong><span data-checklist-count>${progress.done}/${progress.total}</span></div>
    </div>
    <div class="phase-progress-bar" aria-hidden="true"><i data-checklist-bar style="width:${progress.percent}%"></i></div>
    <div class="phase-checklist-items">
      ${phase.checklist.map((item, index) => {
        const current = state[item.id] || {};
        const status = itemStatus(state, item.id);
        const needsEvidence = status === "done" && !current.reference?.trim();
        return `<article class="phase-check-item ${status}${needsEvidence ? " needs-evidence" : ""}" data-check-item="${esc(item.id)}">
          <div class="phase-check-item-top"><span class="mod-num">${String(index + 1).padStart(2, "0")}</span><div><h4>${esc(item.action)}</h4><p>${esc(item.explain)}</p></div></div>
          <details><summary>Exemplo ilustrativo de conclusão</summary><p>${esc(item.example)}</p></details>
          ${needsEvidence ? '<p class="checklist-evidence-warning">Registro histórico marcado como concluído sem evidência. Adicione uma referência para que conte no progresso.</p>' : ""}
          <div class="phase-check-fields"><label>Estado<select data-checklist-status="${esc(item.id)}"><option value="not_started" ${status === "not_started" ? "selected" : ""}>${STATUS_LABELS.not_started}</option><option value="in_progress" ${status === "in_progress" ? "selected" : ""}>${STATUS_LABELS.in_progress}</option><option value="done" ${status === "done" ? "selected" : ""}>${STATUS_LABELS.done}</option></select></label><label>Registro ou referência<input data-checklist-ref="${esc(item.id)}" value="${esc(current.reference || "")}" placeholder="${esc(item.field)}"></label></div>
        </article>`;
      }).join("")}
    </div>
    <p class="phase-checklist-note" data-checklist-note role="status">${progress.done === progress.total ? "Fase registrada como concluída." : "Registre o arquivo, link, tarefa ou decisão que prova cada item."}</p>
  </section>
  </details>`;
}

function refreshProgress(root, phaseId) {
  const progress = phaseProgress(phaseId);
  const percent = root.querySelector("[data-checklist-progress]");
  const count = root.querySelector("[data-checklist-count]");
  const bar = root.querySelector("[data-checklist-bar]");
  const note = root.querySelector("[data-checklist-note]");
  if (percent) percent.textContent = progress.percent + "%";
  if (count) count.textContent = `${progress.done}/${progress.total}`;
  if (bar) bar.style.width = progress.percent + "%";
  if (note) note.textContent = progress.done === progress.total ? "Fase registrada como concluída." : "Registro salvo. Concluído exige uma evidência ou entregável.";
  root.querySelectorAll("[data-check-item]").forEach((card) => {
    const itemState = phaseState(phaseId)[card.dataset.checkItem] || {};
    const status = itemState.status || "not_started";
    card.classList.remove("not_started", "in_progress", "done");
    card.classList.add(status);
    card.classList.toggle("needs-evidence", status === "done" && !itemState.reference?.trim());
  });
}

export function updatePhaseChecklist(phaseId, itemId, patch) {
  const all = migratedState();
  const current = all[phaseId]?.[itemId] || {};
  all[phaseId] = all[phaseId] || {};
  all[phaseId][itemId] = { ...current, ...patch, updatedAtMs: Date.now() };
  persist(all);
}

export function bindPhaseChecklist() {
  const root = document.getElementById("content");
  if (!root || root.dataset.phaseChecklistBound === "1") return;
  root.dataset.phaseChecklistBound = "1";
  root.addEventListener("change", (event) => {
    const statusControl = event.target.closest("[data-checklist-status]");
    const refControl = event.target.closest("[data-checklist-ref]");
    const control = statusControl || refControl;
    if (!control) return;
    const checklist = control.closest("[data-phase-checklist]");
    if (!checklist) return;
    const phaseId = checklist.dataset.phaseChecklist;
    const itemId = statusControl?.dataset.checklistStatus || refControl?.dataset.checklistRef;
    const current = phaseState(phaseId)[itemId] || {};
    const referenceInput = [...checklist.querySelectorAll("[data-checklist-ref]")].find((input) => input.dataset.checklistRef === itemId);
    const reference = refControl ? control.value.trim() : (referenceInput?.value.trim() || current.reference || "");
    if (statusControl && control.value === "done" && !reference) {
      statusControl.value = current.status || "not_started";
      const note = checklist.querySelector("[data-checklist-note]");
      if (note) note.textContent = "Para concluir, registre primeiro uma evidência, referência ou entregável deste item.";
      referenceInput?.focus();
      return;
    }
    updatePhaseChecklist(phaseId, itemId, {
      status: statusControl ? control.value : (current.status || "not_started"),
      reference: reference.slice(0, 500)
    });
    refreshProgress(checklist, phaseId);
  });
}

function mergeChecklistStates(local, remote) {
  const merged = { ...remote, ...local };
  const phaseIds = new Set([...Object.keys(remote || {}), ...Object.keys(local || {})].filter((id) => !!PHASE_GUIDANCE[id]));
  for (const phaseId of phaseIds) {
    const localPhase = local?.[phaseId] && typeof local[phaseId] === "object" ? local[phaseId] : {};
    const remotePhase = remote?.[phaseId] && typeof remote[phaseId] === "object" ? remote[phaseId] : {};
    const mergedPhase = { ...remotePhase, ...localPhase };
    const itemIds = new Set([...Object.keys(remotePhase), ...Object.keys(localPhase)]);
    for (const itemId of itemIds) {
      const localItem = localPhase[itemId];
      const remoteItem = remotePhase[itemId];
      if (!localItem) mergedPhase[itemId] = remoteItem;
      else if (!remoteItem) mergedPhase[itemId] = localItem;
      else mergedPhase[itemId] = Number(localItem.updatedAtMs || 0) >= Number(remoteItem.updatedAtMs || 0) ? localItem : remoteItem;
    }
    merged[phaseId] = mergedPhase;
  }
  merged._updatedAtMs = Math.max(Number(local?._updatedAtMs || 0), Number(remote?._updatedAtMs || remote?.updatedAtMs || 0));
  return merged;
}

const hydratedUids = new Set();
const hydrationPromises = new Map();
const checklistSyncPromises = new Map();

async function syncChecklistState(uid, localState) {
  const localSnapshot = JSON.parse(JSON.stringify(localState));
  const previous = checklistSyncPromises.get(uid) || Promise.resolve();
  const ref = doc(db, "mentorias", uid, "checklists", "fases");
  const operation = previous.catch(() => {}).then(() => runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    const remoteData = snap.exists() ? snap.data()?.data || {} : {};
    const merged = mergeChecklistStates(localSnapshot, remoteData);
    merged._updatedAtMs = Math.max(Date.now(), Number(merged._updatedAtMs || 0));
    transaction.set(ref, { data: merged, updatedAtMs: merged._updatedAtMs, updatedAt: serverTimestamp(), uid }, { merge: true });
    return merged;
  }));
  checklistSyncPromises.set(uid, operation);
  try {
    const synced = await operation;
    if (session.uid === uid && session.mode === "firebase") {
      const reconciled = mergeChecklistStates(loadAll(uid), synced);
      Store.set(key(uid), reconciled);
      if (JSON.stringify(reconciled) !== JSON.stringify(synced) && checklistSyncPromises.get(uid) === operation) {
        window.setTimeout(() => { syncChecklistState(uid, reconciled).catch(() => {}); }, 0);
      }
    }
    return synced;
  } finally {
    if (checklistSyncPromises.get(uid) === operation) checklistSyncPromises.delete(uid);
  }
}

export async function hydratePhaseChecklists(onUpdated) {
  const uid = session.uid;
  if (session.mode !== "firebase" || !uid || hydratedUids.has(uid)) return;
  if (hydrationPromises.has(uid)) return hydrationPromises.get(uid);
  const promise = (async () => {
    try {
      const snap = await getDoc(doc(db, "mentorias", uid, "checklists", "fases"));
      if (session.uid !== uid || session.mode !== "firebase") return;
      const remote = snap.exists() ? snap.data() || {} : null;
      const local = migratedState(uid);
      const remoteData = remote?.data || {};
      const merged = mergeChecklistStates(local, remoteData);
      if (JSON.stringify(merged) !== JSON.stringify(local)) Store.set(key(uid), merged);
      const hasChecklistData = Object.keys(merged).some((id) => !!PHASE_GUIDANCE[id]);
      if (hasChecklistData && JSON.stringify(merged) !== JSON.stringify(remoteData)) {
        await syncChecklistState(uid, merged);
      }
      if (JSON.stringify(merged) !== JSON.stringify(local) && session.uid === uid && onUpdated) {
        onUpdated();
      }
      hydratedUids.add(uid);
    } catch (error) {
      console.warn("[AF checklists] leitura indisponível:", error?.code || error?.message || error);
    }
  })();
  hydrationPromises.set(uid, promise);
  try { return await promise; }
  finally { if (hydrationPromises.get(uid) === promise) hydrationPromises.delete(uid); }
}

export function bindFase2Checklist() {
  bindPhaseChecklist();
}
