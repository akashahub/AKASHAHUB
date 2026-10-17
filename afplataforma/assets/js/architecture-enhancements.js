import { session } from "./auth.js";
import { Store } from "./storage.js";
import { esc } from "./navigation.js";
import { EXECUTIVE_GUIDANCE, ASSET_GUIDANCE, PHASE_GUIDANCE } from "./phase-guidance.js";
import { db } from "../../firebase/firebase-config.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
  hint.innerHTML = `<b>${esc(config.what)}</b> Ex.: ${esc(config.example)} · Pronto quando: ${esc(config.ready)}`;
  label.appendChild(hint);
}

function loadExtraMarco() {
  return Store.get("executive_extension_v1_" + (session.uid || "anon"), { status: "not_started", context: "", evidence: "", next: "" }) || { status: "not_started", context: "", evidence: "", next: "" };
}

let extraMarcoHydratedUid = null;
let extraMarcoHydration = null;

async function hydrateExtraMarco(card) {
  const uid = session.uid;
  if (session.mode !== "firebase" || !uid || extraMarcoHydratedUid === uid || extraMarcoHydration) return;
  extraMarcoHydration = (async () => {
    try {
      const snap = await getDoc(doc(db, "mentorias", uid, "arquitetura_legado", "jornada"));
      if (session.uid !== uid || session.mode !== "firebase") return;
      const remote = snap.exists() ? snap.data()?.executiveExtension : null;
      const local = loadExtraMarco();
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
      }
      extraMarcoHydratedUid = uid;
    } catch (error) {
      console.warn("[Arquitetura de Legado] Marco 04 não recuperado:", error?.code || error?.message || error);
    } finally {
      extraMarcoHydration = null;
    }
  })();
  return extraMarcoHydration;
}

function saveExtraMarco(value) {
  const payload = { ...value, updatedAtMs: Date.now() };
  Store.set("executive_extension_v1_" + (session.uid || "anon"), payload);
  if (session.mode === "firebase" && session.uid) {
    setDoc(doc(db, "mentorias", session.uid, "arquitetura_legado", "jornada"), {
      executiveExtension: payload,
      executiveExtensionUpdatedAt: serverTimestamp()
    }, { merge: true }).catch((error) => console.warn("[Arquitetura de Legado] Marco 04 não sincronizado:", error?.code || error?.message || error));
  }
}

function enhanceExecutive(root) {
  const grid = root.querySelector(".alx-grid3");
  if (!grid || root.querySelector("[data-af-extra-executive]")) return;
  const existingCards = Array.from(grid.querySelectorAll(".alx-card"));
  existingCards.slice(0, 3).forEach((card, index) => {
    const guide = EXECUTIVE_GUIDANCE[index];
    if (guide && !card.querySelector(".alx-guide")) card.insertAdjacentHTML("beforeend", guideDetails(guide));
  });
  const value = loadExtraMarco();
  const extra = document.createElement("article");
  extra.className = "alx-card alx-extra-executive";
  extra.dataset.afExtraExecutive = "1";
  extra.innerHTML = `<div class="alx-kicker">MARCO EXECUTIVO 04 · EXTENSÃO OPERACIONAL</div><h3>Revisão, avaliação e próximos passos</h3><p>Checkpoint adicional para registrar o que foi executado, a evidência, o aprendizado e o próximo movimento. Não substitui os três marcos já existentes.</p>${guideDetails(EXECUTIVE_GUIDANCE[3])}<label>O que foi executado e qual evidência existe<textarea data-extra-exec="context" placeholder="Ex.: link publicado, teste realizado, reunião registrada">${esc(value.context || "")}</textarea></label><label>O que aprendemos ou precisamos ajustar<textarea data-extra-exec="evidence" placeholder="Separe fato observado de interpretação">${esc(value.evidence || "")}</textarea></label><label>Próximo passo, responsável e prazo<textarea data-extra-exec="next" placeholder="Ação pequena, dono e data">${esc(value.next || "")}</textarea></label><label>Estado<select data-extra-exec="status"><option value="not_started" ${value.status === "not_started" ? "selected" : ""}>Ainda não iniciado</option><option value="in_progress" ${value.status === "in_progress" ? "selected" : ""}>Em andamento</option><option value="done" ${value.status === "done" ? "selected" : ""}>Registrado</option></select></label><button type="button" class="tool-btn" data-extra-exec-save>Salvar marco 04</button><p class="notes-hint" data-extra-exec-note role="status">Este registro fica separado dos três marcos históricos existentes.</p>`;
  grid.appendChild(extra);
  extra.querySelectorAll("[data-extra-exec]").forEach((control) => {
    control.addEventListener("input", () => { extra.dataset.dirty = "1"; });
    control.addEventListener("change", () => { extra.dataset.dirty = "1"; });
  });
  extra.querySelector("[data-extra-exec-save]")?.addEventListener("click", () => {
    const next = { status: extra.querySelector('[data-extra-exec="status"]')?.value || "not_started", context: extra.querySelector('[data-extra-exec="context"]')?.value.trim().slice(0, 3000) || "", evidence: extra.querySelector('[data-extra-exec="evidence"]')?.value.trim().slice(0, 3000) || "", next: extra.querySelector('[data-extra-exec="next"]')?.value.trim().slice(0, 3000) || "" };
    saveExtraMarco(next);
    delete extra.dataset.dirty;
    const note = extra.querySelector("[data-extra-exec-note]"); if (note) note.textContent = "Marco 04 salvo neste usuário e neste navegador.";
  });
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
  const guide = document.createElement("details");
  guide.dataset.afAssetGuidance = "1";
  guide.className = "alx-guide alx-asset-guide";
  guide.innerHTML = `<summary>Referência rápida para Ativos e Entregas</summary><div class="alx-guide-grid"><p><b>Posicionamento:</b> frase que explica público, problema e diferencial.</p><p><b>Oferta:</b> o que é vendido, para quem, resultado buscado, formato e condições.</p><p><b>Conteúdo:</b> material reutilizável de comunicação, educação ou aquisição.</p><p><b>Processo operacional:</b> sequência documentada para executar uma atividade recorrente com qualidade previsível.</p><p><b>Ativo financeiro:</b> controle, indicador ou projeção identificada como projeção.</p><p><b>Metodologia:</b> manual, mapa, roteiro ou princípios que permitem reproduzir uma prática.</p><p><b>Estados:</b> ideia ainda não desenvolvida → em desenvolvimento → concluído → revisado/validado → entregue/publicado, quando aplicável.</p></div>`;
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
