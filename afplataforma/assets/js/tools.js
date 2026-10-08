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
  document.getElementById("toolPanel")?.classList.remove("open", "cfx-on");
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
  const today = new Date().toISOString().slice(0, 10);
  const norm = (it) => ({
    desc: it.desc || "",
    val: Number(it.val || 0),
    tipo: it.tipo === "entrada" ? "entrada" : "saida",
    cat: it.cat || "Outro",
    act: it.act || "manter",
    ess: it.ess || "sim",
    date: /^\d{4}-\d{2}-\d{2}/.test(String(it.date || "")) ? String(it.date).slice(0, 10) : today,
    status: it.status === "previsto" ? "previsto" : "pago",
    recur: it.recur === "fixo" ? "fixo" : "unico",
    paidMonths: Array.isArray(it.paidMonths) ? it.paidMonths.slice() : []
  });
  window._cash = (saved.items || []).map(norm);
  window._cashMonth = (saved.month && /^\d{4}-\d{2}$/.test(saved.month))
    ? saved.month
    : today.slice(0, 7);

  const monthKey = (d) => String(d || "").slice(0, 7);
  const lastDay = (ym) => {
    const [y, m] = ym.split("-").map(Number);
    return new Date(y, m, 0).getDate();
  };
  const instanceDate = (it, ym) => {
    if (it.recur !== "fixo") return it.date;
    const day = Math.min(parseInt(String(it.date).slice(8, 10), 10) || 1, lastDay(ym));
    return ym + "-" + String(day).padStart(2, "0");
  };
  const inMonth = (it, ym) => {
    if (it.recur === "fixo") return monthKey(it.date) <= ym;
    return monthKey(it.date) === ym;
  };
  const instStatus = (it, ym) => {
    if (it.recur === "fixo") return (it.paidMonths || []).includes(ym) ? "pago" : "previsto";
    return it.status === "previsto" ? "previsto" : "pago";
  };

  const brl = (n) => Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const monthLabel = (ym) => {
    const [y, m] = ym.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };
  const shiftMonth = (ym, delta) => {
    const [y, m] = ym.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
  };
  const CATS = [
    ["Moradia", "#5b7cfa"],
    ["Alimentação", "#f5a524"],
    ["Transporte", "#3db8a0"],
    ["Assinaturas", "#a06bff"],
    ["Receita", "#2f9e5b"],
    ["Reserva", "#2a6fdb"],
    ["Outro", "#8b93a7"]
  ];
  const catColor = (name) => (CATS.find((c) => c[0] === name) || ["", "#8b93a7"])[1];

  openFloat(
    "Cash-Flow",
    `<style>
      #toolPanel.cfx-on{height:min(88vh,780px);width:min(420px,calc(100vw - 16px))}
      .cfx{color:#1c2430;font-family:system-ui,sans-serif}
      .cfx-month{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
      .cfx-month b{font-size:16px;text-transform:capitalize}
      .cfx-month button{width:36px;height:36px;border-radius:999px;border:1px solid #d9deea;background:#fff;font-size:18px;cursor:pointer}
      .cfx-hero{background:#1c2430;color:#fff;border-radius:16px;padding:14px 16px;margin-bottom:10px}
      .cfx-hero small{opacity:.7;font-size:11px;letter-spacing:.08em;text-transform:uppercase}
      .cfx-hero strong{display:block;font-size:28px;margin:4px 0 10px}
      .cfx-split{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .cfx-split div{background:rgba(255,255,255,.08);border-radius:10px;padding:8px 10px;font-size:11px}
      .cfx-split b{display:block;font-size:14px;margin-top:2px}
      .cfx-in{color:#8ee0b0}.cfx-out{color:#ffb4b4}
      .cfx-cats{display:flex;flex-direction:column;gap:6px;margin:0 0 12px}
      .cfx-cat{display:grid;grid-template-columns:86px 1fr auto;gap:8px;align-items:center;font-size:12px}
      .cfx-barline{height:8px;background:#e6eaf2;border-radius:99px;overflow:hidden}
      .cfx-barline i{display:block;height:100%;border-radius:99px}
      .cfx-day{margin:12px 0 4px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#6b7385}
      .cfx-tx{display:flex;gap:10px;align-items:center;background:#fff;border:1px solid #e6eaf2;border-radius:12px;padding:10px;margin-bottom:6px}
      .cfx-dot{width:10px;height:10px;border-radius:99px;flex:none}
      .cfx-tx b{display:block;font-size:14px}
      .cfx-tx small{color:#6b7385}
      .cfx-amt{margin-left:auto;font-weight:700;white-space:nowrap}
      .cfx-amt.entrada{color:#1f8a4c}
      .cfx-amt.saida{color:#d64545}
      .cfx-amt.prev{opacity:.55}
      .cfx-mini{display:flex;gap:6px;margin-top:6px}
      .cfx-mini button{border:0;background:#f1f3f8;border-radius:99px;padding:4px 8px;font-size:11px;cursor:pointer}
      .cfx-add{position:sticky;bottom:0;display:flex;justify-content:center;padding-top:8px}
      .cfx-add > button{width:56px;height:56px;border:0;border-radius:999px;background:#1c2430;color:#fff;font-size:28px;cursor:pointer;box-shadow:0 8px 20px rgba(28,36,48,.25)}
      .cfx-sheet{background:#fff;border:1px solid #e6eaf2;border-radius:16px;padding:12px;margin-bottom:10px}
      .cfx-types{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px}
      .cfx-types button{min-height:40px;border-radius:10px;border:1px solid #d9deea;background:#fff;cursor:pointer}
      .cfx-types button.on{background:#1c2430;color:#fff;border-color:#1c2430}
      .cfx-sheet input,.cfx-sheet select{width:100%;min-height:42px;margin-bottom:8px;border:1px solid #d9deea;border-radius:10px;padding:0 10px;background:#fff;color:#1c2430}
      .cfx-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
      .cfx-chips button{border:1px solid #d9deea;background:#fff;border-radius:99px;padding:6px 10px;font-size:12px;cursor:pointer}
      .cfx-chips button.on{color:#fff;border-color:transparent}
      .cfx-go{width:100%;min-height:46px;border:0;border-radius:12px;background:#1c2430;color:#fff;font-weight:700;cursor:pointer}
      .cfx details{font-size:12px;color:#6b7385;margin-bottom:8px}
      .cfx-empty{text-align:center;color:#6b7385;padding:18px 8px}
    </style>
    <div class="cfx">
      <div class="cfx-month">
        <button type="button" id="cPrev" aria-label="Mês anterior">‹</button>
        <b id="cLabel"></b>
        <button type="button" id="cNext" aria-label="Próximo mês">›</button>
      </div>
      <input id="cMonth" type="hidden" value="${esc(window._cashMonth)}">
      <div class="cfx-hero" id="cashKpis"></div>
      <div class="cfx-cats" id="cashCats"></div>
      <div id="cashSheet" class="cfx-sheet" hidden>
        <div class="cfx-types">
          <button type="button" id="cTipoOut" class="on">Despesa</button>
          <button type="button" id="cTipoIn">Receita</button>
        </div>
        <input id="cVal" type="number" step="0.01" inputmode="decimal" placeholder="0,00">
        <input id="cDesc" placeholder="Descrição">
        <div class="cfx-chips" id="cChips"></div>
        <input id="cDate" type="date" value="${today}">
        <details>
          <summary>Auditoria deste lançamento</summary>
          <select id="cAct"><option>manter</option><option>reduzir</option><option>cancelar</option><option>aumentar</option></select>
          <select id="cEss"><option value="sim">Essencial</option><option value="nao">Não essencial</option></select>
          <select id="cStatus"><option value="pago">Pago</option><option value="previsto">Previsto</option></select>
          <select id="cRecur"><option value="unico">Uma vez</option><option value="fixo">Todo mês</option></select>
        </details>
        <button class="cfx-go" type="button" id="btnAddCash">Adicionar</button>
      </div>
      <div id="cashList"></div>
      <div class="cfx-add"><button type="button" id="cPlus" aria-label="Novo lançamento">+</button></div>
    </div>`,
    `<button class="btn btn-inline" type="button" id="btnSaveCash">Salvar</button>`
  );
  document.getElementById("toolPanel")?.classList.add("cfx-on");

  let tipo = "saida";
  let cat = "Alimentação";
  const chips = document.getElementById("cChips");
  const paintChips = () => {
    chips.innerHTML = CATS.map(([name, color]) =>
      `<button type="button" data-cat="${esc(name)}" class="${name === cat ? "on" : ""}" style="${name === cat ? "background:" + color : ""}">${esc(name)}</button>`
    ).join("");
    chips.querySelectorAll("[data-cat]").forEach((b) => {
      b.onclick = () => { cat = b.dataset.cat; paintChips(); };
    });
  };
  paintChips();
  const setTipo = (next) => {
    tipo = next;
    document.getElementById("cTipoOut").classList.toggle("on", next === "saida");
    document.getElementById("cTipoIn").classList.toggle("on", next === "entrada");
    if (next === "entrada" && cat !== "Receita" && cat !== "Reserva") { cat = "Receita"; paintChips(); }
  };
  document.getElementById("cTipoOut").onclick = () => setTipo("saida");
  document.getElementById("cTipoIn").onclick = () => setTipo("entrada");
  document.getElementById("cPlus").onclick = () => {
    const sheet = document.getElementById("cashSheet");
    sheet.hidden = !sheet.hidden;
    if (!sheet.hidden) document.getElementById("cVal").focus();
  };

  const saveNow = async () => {
    await persistToolData("cashflow", { items: window._cash, month: window._cashMonth });
  };

  const render = () => {
    const el = document.getElementById("cashList");
    const kpis = document.getElementById("cashKpis");
    const catsEl = document.getElementById("cashCats");
    if (!el) return;
    const ym = document.getElementById("cMonth").value || window._cashMonth;
    window._cashMonth = ym;
    document.getElementById("cLabel").textContent = monthLabel(ym);

    const rows = window._cash
      .map((it, i) => ({ it, i }))
      .filter((x) => inMonth(x.it, ym))
      .sort((a, b) => instanceDate(b.it, ym).localeCompare(instanceDate(a.it, ym)));

    let ent = 0, prev = 0, pago = 0;
    const byCat = {};
    rows.forEach(({ it }) => {
      const v = Number(it.val || 0);
      const st = instStatus(it, ym);
      if (it.tipo === "entrada") ent += v;
      else if (st === "pago") pago += v;
      else prev += v;
      if (it.tipo !== "entrada") byCat[it.cat] = (byCat[it.cat] || 0) + v;
    });
    const maxCat = Math.max(1, ...Object.values(byCat));
    if (kpis) {
      kpis.innerHTML = `<small>Saldo do mês</small><strong>${brl(ent - pago)}</strong>
        <div class="cfx-split">
          <div>Receitas <b class="cfx-in">${brl(ent)}</b></div>
          <div>Despesas <b class="cfx-out">${brl(pago)}</b></div>
        </div>`;
    }
    if (catsEl) {
      const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
      catsEl.innerHTML = entries.map(([name, v]) => `<div class="cfx-cat"><span>${esc(name)}</span><div class="cfx-barline"><i style="width:${Math.round(v / maxCat * 100)}%;background:${catColor(name)}"></i></div><b>${brl(v)}</b></div>`).join("");
    }

    const groups = new Map();
    rows.forEach((row) => {
      const d = instanceDate(row.it, ym);
      if (!groups.has(d)) groups.set(d, []);
      groups.get(d).push(row);
    });
    el.innerHTML = rows.length ? [...groups.entries()].map(([d, list]) => {
      const when = new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
      return `<div class="cfx-day">${esc(when)}</div>` + list.map(({ it, i }) => {
        const st = instStatus(it, ym);
        const sign = it.tipo === "entrada" ? "entrada" : "saida";
        return `<article class="cfx-tx">
          <i class="cfx-dot" style="background:${catColor(it.cat)}"></i>
          <div><b>${esc(it.desc || "Lançamento")}</b><small>${esc(it.cat)}${it.recur === "fixo" ? " · todo mês" : ""}${st === "previsto" ? " · previsto" : ""}</small>
            <div class="cfx-mini"><button type="button" data-pay="${i}">${st === "pago" ? "Marcar previsto" : "Marcar pago"}</button><button type="button" data-rm="${i}">Apagar</button></div>
          </div>
          <span class="cfx-amt ${sign}${st === "previsto" ? " prev" : ""}">${it.tipo === "entrada" ? "+" : "−"} ${brl(it.val)}</span>
        </article>`;
      }).join("");
    }).join("") : `<p class="cfx-empty">Nenhum lançamento neste mês. Toque no + para começar.</p>`;

    el.querySelectorAll("[data-rm]").forEach((b) => {
      b.onclick = async () => {
        window._cash.splice(+b.dataset.rm, 1);
        render();
        await saveNow();
      };
    });
    el.querySelectorAll("[data-pay]").forEach((b) => {
      b.onclick = async () => {
        const it = window._cash[+b.dataset.pay];
        if (!it) return;
        if (it.recur === "fixo") {
          const set = new Set(it.paidMonths || []);
          if (set.has(ym)) set.delete(ym); else set.add(ym);
          it.paidMonths = [...set];
        } else {
          it.status = it.status === "pago" ? "previsto" : "pago";
        }
        render();
        await saveNow();
      };
    });
    const note = document.getElementById("toolMeta");
    if (note) note.textContent = prev ? `Ainda previsto ${brl(prev)}` : "";
  };

  render();
  document.getElementById("cPrev").onclick = () => {
    document.getElementById("cMonth").value = shiftMonth(window._cashMonth, -1);
    render();
  };
  document.getElementById("cNext").onclick = () => {
    document.getElementById("cMonth").value = shiftMonth(window._cashMonth, 1);
    render();
  };
  document.getElementById("btnAddCash").onclick = async () => {
    const date = document.getElementById("cDate").value || today;
    const val = parseFloat(document.getElementById("cVal").value);
    const desc = document.getElementById("cDesc").value.trim();
    if (!desc || !val) return;
    const status = document.getElementById("cStatus").value;
    const recur = document.getElementById("cRecur").value;
    window._cash.push({
      desc,
      val,
      tipo,
      cat,
      act: document.getElementById("cAct").value,
      ess: document.getElementById("cEss").value,
      date,
      status,
      recur,
      paidMonths: recur === "fixo" && status === "pago" ? [monthKey(date)] : []
    });
    document.getElementById("cDesc").value = "";
    document.getElementById("cVal").value = "";
    document.getElementById("cashSheet").hidden = true;
    render();
    await saveNow();
    toast("Lançamento salvo");
  };
  document.getElementById("btnSaveCash").onclick = async () => {
    await saveNow();
    toast("Cash-flow salvo");
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
