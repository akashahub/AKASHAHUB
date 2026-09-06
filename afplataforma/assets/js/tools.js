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

/** Oratória — 7 músculos. Não é dom. */
async function openFono() {
  const saved = (await loadToolData("fono")) || { notes: "", reps: 0, done: [] };
  const drills = [
    { id: "vel", name: "Velocidade", now: "Uma palavra por batida. Nem disparo, nem arrasto." },
    { id: "pau", name: "Pausas", now: "Frase. Conte 2 no peito. Próxima frase." },
    { id: "vol", name: "Volume", now: "A mesma frase: baixo, médio, alto limpo." },
    { id: "cla", name: "Clareza", now: "PA TA KA. MA ME MI MO MU. Lábios e língua." },
    { id: "pal", name: "Palavras", now: "Pitch 40s. Ouça. Risque uma muletilla." },
    { id: "pos", name: "Postura", now: "Pés no chão. Ombro baixo. Quatro frases." },
    { id: "esc", name: "Escuta", now: "Ouça 20s. Repita o ponto em uma frase." }
  ];
  const done = new Set(saved.done || []);
  openFloat(
    "Oratória · 7 músculos",
    `<p class="notes-hint">Falar bem é musculação. Todo mundo melhora treinando. Não substitui fonoaudiólogo clínico.</p>
     <div class="fono-grid" id="fonoGrid">${drills.map((d) =>
       `<button type="button" class="fono-tile${done.has(d.id) ? " ok" : ""}" data-fono="${d.id}"><b>${d.name}</b><span>${d.now}</span></button>`
     ).join("")}</div>
     <div class="fono-block">
       <p class="fono-label" id="fonoNowName">Clareza</p>
       <p class="fono-line" id="fonoNowLine">PA TA KA. MA ME MI MO MU. Lábios e língua.</p>
       <p class="notes-meta" id="fonoTimer">60s</p>
       <button class="tool-btn" type="button" id="btnFonoTimer">Começar 60s</button>
     </div>
     <label class="notes-hint">Anotação da sessão</label>
     <textarea class="notes-area" id="fonoNotes">${esc(saved.notes || "")}</textarea>
     <p class="notes-meta">Sessões: <strong id="fonoReps">${saved.reps || 0}</strong></p>`,
    `<button class="btn btn-inline" type="button" id="btnFonoSave">Salvar</button>
     <button class="btn btn-ghost" type="button" id="btnFonoDone">Marquei este músculo</button>`
  );

  let current = "cla";
  const persistFono = async () => {
    await persistToolData("fono", {
      notes: document.getElementById("fonoNotes").value,
      reps: parseInt(document.getElementById("fonoReps").textContent, 10) || 0,
      done: [...done]
    });
  };
  document.getElementById("fonoGrid").onclick = (e) => {
    const b = e.target.closest("[data-fono]");
    if (!b) return;
    current = b.dataset.fono;
    const d = drills.find((x) => x.id === current);
    document.getElementById("fonoNowName").textContent = d.name;
    document.getElementById("fonoNowLine").textContent = d.now;
  };
  document.getElementById("btnFonoTimer").onclick = () => {
    const el = document.getElementById("fonoTimer");
    let n = 60;
    el.textContent = "60s";
    const id = setInterval(() => {
      n--;
      el.textContent = n > 0 ? n + "s" : "Fechou. Ouça o que saiu.";
      if (n <= 0) clearInterval(id);
    }, 1000);
  };
  document.getElementById("btnFonoSave").onclick = async () => { await persistFono(); toast("Oratória salva"); };
  document.getElementById("btnFonoDone").onclick = async () => {
    done.add(current);
    const el = document.getElementById("fonoReps");
    el.textContent = String((parseInt(el.textContent, 10) || 0) + 1);
    document.querySelectorAll("[data-fono]").forEach((n) => {
      if (n.dataset.fono === current) n.classList.add("ok");
    });
    await persistFono();
    toast("Músculo marcado");
  };
}

/** Mapa de rede — contatos com telefone e e-mail */
async function openNetwork() {
  const saved = (await loadToolData("network")) || { contacts: [] };
  window._net = saved.contacts || [];
  openFloat(
    "Mapa de rede · contatos",
    `<div class="net-form">
      <input id="nName" placeholder="Nome">
      <input id="nPhone" type="tel" placeholder="Telefone">
      <input id="nEmail" type="email" placeholder="E-mail">
      <input id="nVal" placeholder="Por que é alto valor">
      <input id="nNext" placeholder="Próxima entrega">
      <input id="nWhen" type="date">
    </div>
    <div class="cash-row">
      <button class="tool-btn" type="button" id="btnAddNet">+ Contato</button>
      <button class="tool-btn" type="button" id="btnSaveEditNet" hidden>Salvar edição</button>
    </div>
    <input type="hidden" id="nEdit" value="">
    <div class="net-list" id="netList"></div>`,
    `<button class="btn btn-inline" type="button" id="btnSaveNet">Salvar mapa</button>`
  );
  const clearForm = () => {
    ["nName","nPhone","nEmail","nVal","nNext","nWhen"].forEach((id) => { document.getElementById(id).value = ""; });
    document.getElementById("nEdit").value = "";
    document.getElementById("btnSaveEditNet").hidden = true;
  };
  const readForm = () => ({
    name: document.getElementById("nName").value.trim() || "—",
    phone: document.getElementById("nPhone").value.trim(),
    email: document.getElementById("nEmail").value.trim(),
    val: document.getElementById("nVal").value.trim(),
    next: document.getElementById("nNext").value.trim(),
    when: document.getElementById("nWhen").value || ""
  });
  const render = () => {
    const el = document.getElementById("netList");
    el.innerHTML = window._net.map((c, i) => `
      <article class="net-card">
        <h4>${esc(c.name)}</h4>
        <p>${esc(c.val || "—")}</p>
        <p class="net-meta">${esc(c.phone || "sem telefone")} · ${esc(c.email || "sem e-mail")}</p>
        <p class="net-meta">Próxima: ${esc(c.next || "—")} · ${esc(c.when || "sem data")}</p>
        <div class="net-actions">
          <button type="button" data-ed="${i}">Editar</button>
          <button type="button" data-rm="${i}">Remover</button>
        </div>
      </article>`).join("") || "<p class='empty'>Nenhum contato ainda.</p>";
    el.querySelectorAll("[data-rm]").forEach((b) => {
      b.onclick = () => { window._net.splice(+b.dataset.rm, 1); render(); };
    });
    el.querySelectorAll("[data-ed]").forEach((b) => {
      b.onclick = () => {
        const c = window._net[+b.dataset.ed];
        document.getElementById("nName").value = c.name || "";
        document.getElementById("nPhone").value = c.phone || "";
        document.getElementById("nEmail").value = c.email || "";
        document.getElementById("nVal").value = c.val || "";
        document.getElementById("nNext").value = c.next || "";
        document.getElementById("nWhen").value = c.when || "";
        document.getElementById("nEdit").value = b.dataset.ed;
        document.getElementById("btnSaveEditNet").hidden = false;
      };
    });
  };
  render();
  document.getElementById("btnAddNet").onclick = () => {
    window._net.push(readForm());
    clearForm();
    render();
  };
  document.getElementById("btnSaveEditNet").onclick = () => {
    const i = document.getElementById("nEdit").value;
    if (i === "") return;
    window._net[+i] = readForm();
    clearForm();
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
    { id: "fono", name: "Oratória · 7 músculos", mod: "05" },
    { id: "vision", name: "Visão 1 página", mod: "06" },
    { id: "legacy", name: "Declaração de legado", mod: "07" }
  ];
  return `<div class="view active">
    ${pageHead("tools", "Operação", "Ferramentas", "Abrem em segundo plano — pode usar junto com Call e Roteiro.")}
    <div class="mat-grid">${list
      .map(
        (x) => `
      <div class="mat-card tool-card">
      ${editImg("tool-" + x.id, x.name, "cover-thumb")}
      <h4>${esc(x.name)}</h4><p>Módulo ${x.mod}</p>
      <button class="tool-btn" type="button" data-tool="${x.id}">Abrir</button></div>`
      )
      .join("")}</div>
  </div>`;
}
