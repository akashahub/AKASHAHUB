import { session } from "./auth.js";
import { Store } from "./storage.js";
import { esc } from "./navigation.js";
import { PHASE_GUIDANCE } from "./phase-guidance.js";
import { db } from "../../firebase/firebase-config.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const STATUS_LABELS = {
  not_started: "Ainda não iniciado",
  in_progress: "Em andamento",
  done: "Concluído"
};

function key() {
  return "phase_checklists_v1_" + (session.uid || "anon");
}

function legacyKey() {
  return "fase2_ativos_" + (session.uid || "anon");
}

function loadAll() {
  const raw = Store.get(key(), {});
  return raw && typeof raw === "object" ? raw : {};
}

function migratedState() {
  const all = loadAll();
  if (!all.fase2 || !Object.keys(all.fase2).length) {
    const legacy = Store.get(legacyKey(), {});
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
      Store.set(key(), all);
    }
  }
  return all;
}

function phaseState(phaseId) {
  const all = migratedState();
  return all[phaseId] && typeof all[phaseId] === "object" ? all[phaseId] : {};
}

function persist(all) {
  all._updatedAtMs = Date.now();
  Store.set(key(), all);
  if (session.mode !== "firebase" || !session.uid) return;
  setDoc(doc(db, "mentorias", session.uid, "checklists", "fases"), {
    data: all,
    updatedAtMs: all._updatedAtMs,
    updatedAt: serverTimestamp(),
    uid: session.uid
  }, { merge: true }).catch((error) => {
    console.warn("[AF checklists] sincronização indisponível:", error?.code || error?.message || error);
  });
}

export function readPhaseChecklist(phaseId) {
  return phaseState(phaseId);
}

export function phaseProgress(phaseId) {
  const items = PHASE_GUIDANCE[phaseId]?.checklist || [];
  const state = phaseState(phaseId);
  const done = items.filter((item) => state[item.id]?.status === "done").length;
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
  return `<section class="phase-checklist" data-phase-checklist="${esc(phaseId)}" aria-labelledby="checklist-${esc(phaseId)}">
    <div class="phase-checklist-head">
      <div><p class="hero-line">CHECKLIST DE CONCLUSÃO</p><h3 id="checklist-${esc(phaseId)}">O que precisa estar verdadeiro para avançar</h3><p class="notes-hint">Uma tarefa iniciada não é uma tarefa concluída. Marque “Concluído” somente quando houver a evidência ou o entregável indicado.</p></div>
      <div class="phase-progress" aria-label="${progress.done} de ${progress.total} itens concluídos"><strong data-checklist-progress>${progress.percent}%</strong><span data-checklist-count>${progress.done}/${progress.total}</span></div>
    </div>
    <div class="phase-progress-bar" aria-hidden="true"><i data-checklist-bar style="width:${progress.percent}%"></i></div>
    <div class="phase-checklist-items">
      ${phase.checklist.map((item, index) => {
        const current = state[item.id] || {};
        const status = itemStatus(state, item.id);
        return `<article class="phase-check-item ${status}" data-check-item="${esc(item.id)}">
          <div class="phase-check-item-top"><span class="mod-num">${String(index + 1).padStart(2, "0")}</span><div><h4>${esc(item.action)}</h4><p>${esc(item.explain)}</p></div></div>
          <details><summary>Exemplo de concluído</summary><p>${esc(item.example)}</p></details>
          <div class="phase-check-fields"><label>Estado<select data-checklist-status="${esc(item.id)}"><option value="not_started" ${status === "not_started" ? "selected" : ""}>${STATUS_LABELS.not_started}</option><option value="in_progress" ${status === "in_progress" ? "selected" : ""}>${STATUS_LABELS.in_progress}</option><option value="done" ${status === "done" ? "selected" : ""}>${STATUS_LABELS.done}</option></select></label><label>Registro ou referência<input data-checklist-ref="${esc(item.id)}" value="${esc(current.reference || "")}" placeholder="${esc(item.field)}"></label></div>
        </article>`;
      }).join("")}
    </div>
    <p class="phase-checklist-note" data-checklist-note role="status">${progress.done === progress.total ? "Fase registrada como concluída." : "Registre o arquivo, link, tarefa ou decisão que prova cada item."}</p>
  </section>`;
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
    const status = phaseState(phaseId)[card.dataset.checkItem]?.status || "not_started";
    card.classList.remove("not_started", "in_progress", "done");
    card.classList.add(status);
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
    updatePhaseChecklist(phaseId, itemId, {
      status: statusControl ? control.value : (current.status || "not_started"),
      reference: refControl ? control.value.trim().slice(0, 500) : (current.reference || "")
    });
    refreshProgress(checklist, phaseId);
  });
}

let hydrationUid = null;
let hydrationPromise = null;

export async function hydratePhaseChecklists(onUpdated) {
  if (session.mode !== "firebase" || !session.uid || hydrationUid === session.uid || hydrationPromise) return;
  hydrationPromise = (async () => {
    try {
      const snap = await getDoc(doc(db, "mentorias", session.uid, "checklists", "fases"));
      const remote = snap.exists() ? snap.data() || {} : null;
      const local = migratedState();
      if (remote?.data && Number(remote.updatedAtMs || 0) > Number(local._updatedAtMs || 0)) {
        Store.set(key(), remote.data);
        if (onUpdated) onUpdated();
      }
      hydrationUid = session.uid;
    } catch (error) {
      console.warn("[AF checklists] leitura indisponível:", error?.code || error?.message || error);
    } finally {
      hydrationPromise = null;
    }
  })();
  return hydrationPromise;
}

export function bindFase2Checklist() {
  bindPhaseChecklist();
}
