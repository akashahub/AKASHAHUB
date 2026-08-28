/**
 * Ferramentas operacionais — painel flutuante (segundo plano)
 * Pode ficar aberto junto com Call + Roteiro
 */
import { session } from "./auth.js";
import { Store } from "./storage.js";
import { getAfTool, saveAfTool } from "../../firebase/firestore.js";
import { esc } from "./navigation.js";
import { pageHead, editImg } from "./covers.js";

function toast(msg, err = false) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast show" + (err ? " err" : "");
  clearTimeout(window._tt);
  window._tt = setTimeout(() => (el.className = "toast"), 2800);
}

/** Painel flutuante de ferramenta (não bloqueia a página) */
function openFloat(title, body, foot) {
  const panel = document.getElementById("toolPanel");
  if (!panel) return;
  document.getElementById("toolTitle").textContent = title;
  document.getElementById("toolBody").innerHTML = body;
  document.getElementById("toolFoot").innerHTML = foot || "";
  panel.classList.add("open");
  document.body.classList.add("tool-open");
}

export function closeToolsModal() {
  document.getElementById("toolPanel")?.classList.remove("open");
  document.body.classList.remove("tool-open");
  // modal clássico (locked etc.)
  document.getElementById("modalBox")?.classList.remove("open");
  if (!document.getElementById("tpPanel")?.classList.contains("open")) {
    document.getElementById("overlay")?.classList.remove("open");
  }
}

export function bindToolPanelUI() {
  document.getElementById("toolClose")?.addEventListener("click", closeToolsModal);
}

async function loadToolData(toolId) {
  if (session.mode === "firebase" && session.uid) {
    try {
      const remote = await getAfTool(session.uid, toolId);
      if (remote) return remote;
    } catch (e) {
      console.warn("[tools] firestore", e);
    }
  }
  return Store.getUserToolData(session.uid, toolId) || null;
}

async function persistToolData(toolId, data) {
  Store.saveUserToolData(session.uid, toolId, data);
  if (session.mode === "firebase" && session.uid) {
    try {
      await saveAfTool(session.uid, toolId, data);
    } catch (e) {
      console.warn("[tools] save remote", e);
    }
  }
}

export async function openTool(id) {
  if (id === "cashflow") return openCashflow();
  if (id === "pitch") return openTextTool(id, "Pitch 60 segundos", "Escreva seu pitch PSI / ADP / POC…");
  if (id === "legacy") return openTextTool(id, "Declaração de Legado", "Quem sou · O que construí · Por quê · Para quem · O que quero que reste…");
  if (id === "vision") return openTextTool(id, "Visão em 1 página", "Horizonte 10 anos · 3 anos · 90 dias…");
  if (id === "network") return openNetwork();
  if (id === "ideation") return openTextTool(id, "Diário de insights", "Ideias, problemas de cliente, validações…");
  if (id === "execution") return openTextTool(id, "Execução semanal", "Prioridade do dia · bloqueios · revisão…");
  if (id === "fono") return openFono();
  openFloat("Ferramenta", "<p class='empty'>Em breve.</p>", "");
}

async function openTextTool(id, title, ph) {
  const saved = await loadToolData(id);
  openFloat(
    title,
    `<textarea class="notes-area" id="toolText" placeholder="${esc(ph)}">${esc(saved?.text || "")}</textarea>
     <p class="notes-meta" id="toolMeta">${saved?.updatedAt ? "Salvo · " + new Date(saved.updatedAt).toLocaleString("pt-BR") : "—"}</p>`,
    `<button class="btn btn-inline" type="button" id="btnSaveTool">Salvar</button>`
  );
  document.getElementById("btnSaveTool").onclick = async () => {
    const text = document.getElementById("toolText").value;
    await persistToolData(id, { text });
    document.getElementById("toolMeta").textContent = "Salvo · " + new Date().toLocaleString("pt-BR");
    toast("Salvo");
  };
}

async function openCashflow() {
  const saved = (await loadToolData("cashflow")) || { items: [] };
  window._cash = saved.items || [];
  openFloat(
    "Controle financeiro · Cash-Flow",
    `<div class="cash-row">
      <input id="cDesc" placeholder="Descrição">
      <input id="cVal" type="number" step="0.01" placeholder="Valor">
    </div>
    <div class="cash-row">
      <select id="cTipo"><option value="saida">Saída</option><option value="entrada">Entrada</option></select>
      <select id="cCat"><option>Moradia</option><option>Alimentação</option><option>Transporte</option><option>Assinaturas</option><option>Receita</option><option>Reserva</option><option>Outro</option></select>
    </div>
    <div class="cash-row">
      <select id="cAct"><option>manter</option><option>reduzir</option><option>cancelar</option><option>aumentar</option></select>
      <select id="cEss"><option value="sim">Essencial</option><option value="nao">Não essencial</option></select>
    </div>
    <button class="tool-btn" type="button" id="btnAddCash">+ Adicionar</button>
    <div class="cash-list" id="cashList"></div>
    <p class="notes-meta" id="cashTotal"></p>`,
    `<button class="btn btn-inline" type="button" id="btnSaveCash">Salvar auditoria</button>`
  );
  const render = () => {
    const el = document.getElementById("cashList");
    if (!el) return;
    el.innerHTML =
      window._cash
        .map((it, i) => {
          const sign = it.tipo === "entrada" ? "+" : "−";
          return `<div class="cash-item"><span>${sign} ${esc(it.desc)} · ${esc(it.cat)} · R$ ${Number(it.val).toFixed(2)}</span>
        <button type="button" data-rm="${i}">remover</button></div>`;
        })
        .join("") || "<p class='empty'>Nenhum item</p>";
    el.querySelectorAll("[data-rm]").forEach((b) => {
      b.onclick = () => {
        window._cash.splice(+b.dataset.rm, 1);
        render();
      };
    });
    const inT = window._cash.filter((i) => i.tipo === "entrada").reduce((s, i) => s + Number(i.val || 0), 0);
    const outT = window._cash.filter((i) => i.tipo !== "entrada").reduce((s, i) => s + Number(i.val || 0), 0);
    document.getElementById("cashTotal").textContent =
      `Entradas R$ ${inT.toFixed(2)} · Saídas R$ ${outT.toFixed(2)} · Saldo R$ ${(inT - outT).toFixed(2)}`;
  };
  render();
  document.getElementById("btnAddCash").onclick = () => {
    window._cash.push({
      desc: document.getElementById("cDesc").value || "—",
      val: parseFloat(document.getElementById("cVal").value) || 0,
      tipo: document.getElementById("cTipo").value,
      cat: document.getElementById("cCat").value,
      act: document.getElementById("cAct").value,
      ess: document.getElementById("cEss").value,
      date: new Date().toISOString().slice(0, 10)
    });
    document.getElementById("cDesc").value = "";
    document.getElementById("cVal").value = "";
    render();
  };
  document.getElementById("btnSaveCash").onclick = async () => {
    await persistToolData("cashflow", { items: window._cash });
    toast("Auditoria salva");
  };
}

/** Fonoaudiologia — módulo 5 · treino simples de dicção */
async function openFono() {
  const saved = (await loadToolData("fono")) || { notes: "", reps: 0 };
  openFloat(
    "Fono · Dicção e clareza",
    `<p class="notes-hint">Treino operacional de articulação (não substitui fonoaudiólogo clínico).</p>
     <div class="fono-block">
       <p class="fono-label">1 · Aquecimento (30s)</p>
       <p class="fono-line">Ma · me · mi · mo · mu — devagar, depois rápido.</p>
       <p class="fono-line">Pa · ta · ka · pa · ta · ka — precisão na ponta da língua.</p>
     </div>
     <div class="fono-block">
       <p class="fono-label">2 · Frase de pitch (ler em voz alta 3×)</p>
       <p class="fono-line">“Eu resolvo [problema] para [público] com [método], gerando [resultado mensurável].”</p>
     </div>
     <div class="fono-block">
       <p class="fono-label">3 · Gravação mental</p>
       <p class="fono-line">Grave no celular 60s. Ouça. Marque 1 vício de linguagem para cortar.</p>
     </div>
     <label class="notes-hint">Anotações desta sessão</label>
     <textarea class="notes-area" id="fonoNotes" placeholder="Vícios notados · melhorias · próxima meta…">${esc(saved.notes || "")}</textarea>
     <p class="notes-meta">Sessões registradas: <strong id="fonoReps">${saved.reps || 0}</strong></p>`,
    `<button class="btn btn-inline" type="button" id="btnFonoSave">Salvar treino</button>
     <button class="btn btn-ghost" type="button" id="btnFonoDone">+1 sessão concluída</button>`
  );
  document.getElementById("btnFonoSave").onclick = async () => {
    const notes = document.getElementById("fonoNotes").value;
    const reps = parseInt(document.getElementById("fonoReps").textContent, 10) || 0;
    await persistToolData("fono", { notes, reps });
    toast("Fono salvo");
  };
  document.getElementById("btnFonoDone").onclick = async () => {
    const notes = document.getElementById("fonoNotes").value;
    let reps = (parseInt(document.getElementById("fonoReps").textContent, 10) || 0) + 1;
    document.getElementById("fonoReps").textContent = String(reps);
    await persistToolData("fono", { notes, reps });
    toast("Sessão +1");
  };
}

/** Mapa de rede — contatos estruturados (módulo 4) */
async function openNetwork() {
  const saved = (await loadToolData("network")) || { contacts: [] };
  window._net = saved.contacts || [];
  openFloat(
    "Mapa de rede · contatos",
    `<div class="cash-row">
      <input id="nName" placeholder="Nome">
      <input id="nVal" placeholder="Por que é alto valor">
    </div>
    <div class="cash-row">
      <input id="nNext" placeholder="Próxima entrega">
      <input id="nWhen" type="date">
    </div>
    <button class="tool-btn" type="button" id="btnAddNet">+ Contato</button>
    <div class="cash-list" id="netList"></div>`,
    `<button class="btn btn-inline" type="button" id="btnSaveNet">Salvar mapa</button>`
  );
  const render = () => {
    const el = document.getElementById("netList");
    el.innerHTML =
      window._net
        .map(
          (c, i) =>
            `<div class="cash-item"><span>${esc(c.name)} · ${esc(c.next)} · ${esc(c.when || "")}</span>
        <button type="button" data-rm="${i}">remover</button></div>`
        )
        .join("") || "<p class='empty'>Nenhum contato</p>";
    el.querySelectorAll("[data-rm]").forEach((b) => {
      b.onclick = () => {
        window._net.splice(+b.dataset.rm, 1);
        render();
      };
    });
  };
  render();
  document.getElementById("btnAddNet").onclick = () => {
    window._net.push({
      name: document.getElementById("nName").value || "—",
      val: document.getElementById("nVal").value || "",
      next: document.getElementById("nNext").value || "",
      when: document.getElementById("nWhen").value || ""
    });
    document.getElementById("nName").value = "";
    document.getElementById("nVal").value = "";
    document.getElementById("nNext").value = "";
    render();
  };
  document.getElementById("btnSaveNet").onclick = async () => {
    await persistToolData("network", { contacts: window._net });
    toast("Rede salva");
  };
}

export function renderToolsView() {
  const list = [
    { id: "cashflow", name: "Auditoria de Cash-Flow", mod: "01" },
    { id: "ideation", name: "Ideação / Insights", mod: "02" },
    { id: "execution", name: "Execução semanal", mod: "03" },
    { id: "network", name: "Mapa de rede", mod: "04" },
    { id: "pitch", name: "Pitch 60s", mod: "05" },
    { id: "fono", name: "Fono · Dicção", mod: "05" },
    { id: "vision", name: "Visão 1 página", mod: "06" },
    { id: "legacy", name: "Declaração de legado", mod: "07" }
  ];
  return `<div class="view active">
    ${pageHead("tools", "Operação", "Ferramentas", "Abrem em segundo plano — pode usar junto com Call e Roteiro.")}
    <div class="mat-grid">${list
      .map(
        (x) => `
      <div class="mat-card">
      ${editImg("tool-" + x.id, x.name, "cover-thumb")}
      <h4>${esc(x.name)}</h4><p>Módulo ${x.mod}</p>
      <button class="tool-btn" type="button" data-tool="${x.id}">Abrir</button></div>`
      )
      .join("")}</div>
  </div>`;
}
