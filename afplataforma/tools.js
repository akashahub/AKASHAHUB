/**
 * Ferramentas operacionais (mini apps)
 */
import { session } from "./auth.js";
import { Store } from "./storage.js";
import { getAfTool, saveAfTool } from "../../firebase/firestore.js";
import { esc } from "./navigation.js";

function toast(msg, err = false) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast show" + (err ? " err" : "");
  clearTimeout(window._tt);
  window._tt = setTimeout(() => (el.className = "toast"), 2800);
}

function openModal(title, body, foot) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalBody").innerHTML = body;
  document.getElementById("modalFoot").innerHTML = foot || "";
  document.getElementById("overlay")?.classList.add("open");
  document.getElementById("modalBox")?.classList.add("open");
}

export function closeToolsModal() {
  document.getElementById("modalBox")?.classList.remove("open");
  if (!document.getElementById("tpPanel")?.classList.contains("open")) {
    document.getElementById("overlay")?.classList.remove("open");
  }
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
  if (id === "pitch") return openTextTool(id, "Pitch 60 segundos", "Escreva seu pitch PSI/ADP/POC…");
  if (id === "legacy") return openTextTool(id, "Declaração de Legado", "Quem sou · O que construí · Por quê · Para quem · O que quero que reste…");
  if (id === "vision") return openTextTool(id, "Visão em 1 página", "Horizonte 10 anos · 3 anos · 90 dias…");
  if (id === "network") return openTextTool(id, "Mapa de rede", "Liste 5–10 contatos de alto valor e a próxima entrega de valor…");
  if (id === "ideation") return openTextTool(id, "Diário de insights", "Ideias, problemas de cliente, validações…");
  if (id === "execution") return openTextTool(id, "Execução semanal", "Prioridade do dia · bloqueios · revisão…");
  openModal("Ferramenta", "<p>Em breve.</p>", "");
}

async function openTextTool(id, title, ph) {
  const saved = await loadToolData(id);
  openModal(
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
  openModal(
    "Auditoria de Cash-Flow",
    `<div class="cash-row">
      <input id="cDesc" placeholder="Descrição">
      <input id="cVal" type="number" step="0.01" placeholder="Valor">
    </div>
    <div class="cash-row">
      <select id="cCat"><option>Moradia</option><option>Alimentação</option><option>Transporte</option><option>Assinaturas</option><option>Receita</option><option>Outro</option></select>
      <select id="cAct"><option>manter</option><option>reduzir</option><option>cancelar</option></select>
    </div>
    <div class="cash-row">
      <select id="cRec"><option value="nao">Não recorrente</option><option value="sim">Recorrente</option></select>
      <select id="cEss"><option value="sim">Essencial</option><option value="nao">Não essencial</option></select>
    </div>
    <button class="tool-btn" type="button" id="btnAddCash">+ Adicionar item</button>
    <div class="cash-list" id="cashList"></div>
    <p class="notes-meta" id="cashTotal"></p>`,
    `<button class="btn btn-inline" type="button" id="btnSaveCash">Salvar auditoria</button>`
  );
  const render = () => {
    const el = document.getElementById("cashList");
    if (!el) return;
    el.innerHTML =
      window._cash
        .map(
          (it, i) =>
            `<div class="cash-item"><span>${esc(it.desc)} · ${esc(it.cat)} · R$ ${Number(it.val).toFixed(2)} · ${esc(it.act)}</span>
        <button type="button" data-rm="${i}">remover</button></div>`
        )
        .join("") || "<p class='empty'>Nenhum item</p>";
    el.querySelectorAll("[data-rm]").forEach((b) => {
      b.onclick = () => {
        window._cash.splice(+b.dataset.rm, 1);
        render();
      };
    });
    const total = window._cash.reduce((s, i) => s + Number(i.val || 0), 0);
    document.getElementById("cashTotal").textContent = "Soma registrada: R$ " + total.toFixed(2);
  };
  render();
  document.getElementById("btnAddCash").onclick = () => {
    window._cash.push({
      desc: document.getElementById("cDesc").value || "—",
      val: parseFloat(document.getElementById("cVal").value) || 0,
      cat: document.getElementById("cCat").value,
      act: document.getElementById("cAct").value,
      rec: document.getElementById("cRec").value,
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

export function renderToolsView() {
  const list = [
    { id: "cashflow", name: "Auditoria de Cash-Flow", mod: "01" },
    { id: "ideation", name: "Ideação / Insights", mod: "02" },
    { id: "execution", name: "Execução semanal", mod: "03" },
    { id: "network", name: "Mapa de rede", mod: "04" },
    { id: "pitch", name: "Pitch 60s", mod: "05" },
    { id: "vision", name: "Visão 1 página", mod: "06" },
    { id: "legacy", name: "Declaração de legado", mod: "07" }
  ];
  return `<div class="view active">
    <p class="hero-line">Operação</p>
    <h2 class="hero-title">Ferramentas</h2>
    <p class="hero-sub">Mini apps com dados na conta (Firestore quando autenticado).</p>
    <div class="mat-grid">${list
      .map(
        (x) => `
      <div class="mat-card"><h4>${esc(x.name)}</h4><p>Módulo ${x.mod}</p>
      <button class="tool-btn" type="button" data-tool="${x.id}">Abrir</button></div>`
      )
      .join("")}</div>
  </div>`;
}
