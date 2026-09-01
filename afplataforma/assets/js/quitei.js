/**
 * QUITEI — ferramenta nativa AF de quitação de dívidas.
 * Fonte funcional: index Quitei (avalanche / bola de neve, plano, pagamentos).
 * Persistência: Store local + Firestore afTools/{uid}/tools/quitei (mesmo padrão das outras ferramentas).
 * Sem Firebase quitei777. Sem login paralelo. Usa a sessão AF.
 */
import { session } from "./auth.js";
import { Store } from "./storage.js";
import { getAfTool, saveAfTool } from "../../firebase/firestore.js";
import { esc } from "./navigation.js";
import { pageHead } from "./covers.js";

const AFFIRMATIONS = [
  "Eu tenho capacidade de resolver qualquer situação financeira — uma de cada vez.",
  "Minha situação atual não define quem eu serei. Ela define de onde eu parto.",
  "Cada real que pago hoje é um tijolo na fundação da minha liberdade.",
  "Eu não sou irresponsável. Eu estava sem estratégia. Agora eu tenho uma.",
  "A abundância é o meu estado natural. Estou removendo os obstáculos para ela fluir.",
  "Eu escolho encarar minha realidade financeira com coragem e clareza.",
  "Cada dívida que quito é uma corrente a menos. Estou ficando mais leve.",
  "Eu mereço prosperar. E eu estou construindo isso, hoje, com este passo.",
  "Paciência é a arma dos vencedores. Estou jogando o jogo longo.",
  "Dinheiro é uma ferramenta. Estou aprendendo a usá-la com maestria.",
  "Meu passado financeiro não tem poder sobre meu futuro financeiro.",
  "Enquanto sigo meu plano, minha mente pode descansar. A estratégia está no papel.",
  "Cada mês seguindo o plano é um mês de crescimento, não de sofrimento.",
  "Eu sou maior que qualquer número numa planilha. Os números obedecem ao plano.",
  "Simplicidade + consistência = liberdade."
];

const Q = {
  debts: [],
  history: [],
  budget: 0,
  method: "avalanche",
  tab: "painel",
  loaded: false,
  uid: null,
  editingId: null,
  affirm: Math.floor(Math.random() * AFFIRMATIONS.length)
};

function toast(msg, err = false) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast show" + (err ? " err" : "");
  clearTimeout(window._tt);
  window._tt = setTimeout(() => (el.className = "toast"), 2600);
}

function fmt(n) {
  if (!n && n !== 0) return "—";
  return "R$ " + Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function estimarMeses(total, budget, debts) {
  if (!budget || !total) return 0;
  const active = (debts || []).filter((d) => d.saldo > 0);
  if (!active.length) return 0;
  const avgJuros = active.reduce((a, d) => a + (d.juros || 0), 0) / active.length / 100;
  if (budget <= total * avgJuros) return 999;
  if (avgJuros === 0) return Math.ceil(total / budget);
  const m = Math.log(budget / (budget - total * avgJuros)) / Math.log(1 + avgJuros);
  return Math.ceil(Number.isFinite(m) ? m : total / budget);
}

function getSorted() {
  const active = Q.debts.filter((d) => d.saldo > 0 && d.status !== "Quitada");
  const paid = Q.debts.filter((d) => d.saldo <= 0 || d.status === "Quitada");
  if (Q.method === "avalanche") active.sort((a, b) => b.juros - a.juros);
  else active.sort((a, b) => a.saldo - b.saldo);
  return [...active, ...paid];
}

async function loadQ() {
  const uid = session.uid || "anon";
  if (Q.loaded && Q.uid === uid) return;
  Q.uid = uid;
  let data = Store.getUserToolData(uid, "quitei") || null;
  if (session.mode === "firebase" && session.uid) {
    try {
      const remote = await getAfTool(session.uid, "quitei");
      if (remote) data = remote;
    } catch (e) {
      console.warn("[quitei] firestore", e);
    }
  }
  Q.debts = data?.debts || [];
  Q.history = data?.history || [];
  Q.budget = Number(data?.budget || 0);
  Q.method = data?.method === "bola" ? "bola" : "avalanche";
  Q.loaded = true;
}

async function persistQ() {
  const payload = {
    debts: Q.debts,
    history: Q.history,
    budget: Q.budget,
    method: Q.method
  };
  Store.saveUserToolData(session.uid, "quitei", payload);
  if (session.mode === "firebase" && session.uid) {
    try {
      await saveAfTool(session.uid, "quitei", payload);
    } catch (e) {
      console.warn("[quitei] save", e);
    }
  }
}

function badge(idx, paid) {
  if (paid) return `<span class="q-badge q-paid">Quitada</span>`;
  if (idx === 0) return `<span class="q-badge q-p1">Foco total</span>`;
  if (idx === 1) return `<span class="q-badge q-p2">Próxima</span>`;
  return `<span class="q-badge q-p3">Na fila</span>`;
}

function renderPainel() {
  const active = Q.debts.filter((d) => d.saldo > 0);
  const totalDevido = active.reduce((a, d) => a + d.saldo, 0);
  const totalOriginal = Q.debts.reduce((a, d) => a + (d.saldoOriginal || d.saldo), 0);
  const totalPago = Q.debts.reduce((a, d) => a + (d.pago || 0), 0);
  const pct = totalOriginal > 0 ? Math.min(100, (totalPago / totalOriginal) * 100) : 0;
  const meses = estimarMeses(totalDevido, Q.budget, Q.debts);
  const name = (session.name || "").split(" ")[0] || "você";
  const subs = [
    name + ", cada dívida cadastrada é um passo de coragem.",
    "Os primeiros passos são os mais difíceis — e você já os deu.",
    "Você já quitou mais de um quarto. A jornada está acontecendo.",
    "Metade do caminho. A liberdade está mais perto do que a dívida.",
    "Você está quase lá. A linha de chegada é real.",
    "Parabéns. Você eliminou suas dívidas. Agora é hora de construir riqueza."
  ];
  const subIdx = pct === 0 ? 0 : pct < 25 ? 1 : pct < 50 ? 2 : pct < 75 ? 3 : pct < 100 ? 4 : 5;
  const sorted = getSorted();
  const top = sorted.find((d) => d.saldo > 0);
  const overview =
    sorted
      .map((d) => {
        const paid = d.saldo <= 0 || d.status === "Quitada";
        const p2 = d.saldoOriginal > 0 ? Math.min(100, ((d.saldoOriginal - d.saldo) / d.saldoOriginal) * 100) : 100;
        const activeIdx = sorted.filter((x) => x.saldo > 0).indexOf(d);
        return `<div class="q-row ${paid ? "is-paid" : ""}">
          <div class="q-idx">${paid ? "✓" : activeIdx + 1}</div>
          <div class="q-row-body">
            <strong>${esc(d.nome)}</strong>
            <div class="q-track"><div class="q-fill ${p2 > 66 ? "ok" : p2 > 33 ? "mid" : "low"}" style="width:${p2}%"></div></div>
          </div>
          <div class="q-row-amt">${fmt(d.saldo)}<small>${p2.toFixed(0)}% pago</small></div>
        </div>`;
      })
      .join("") || `<p class="empty">Sem dívidas cadastradas. Abra a aba Dívidas para começar.</p>`;

  return `
    <div class="grid-3">
      <div class="stat-card"><div class="lbl">Quitado</div><div class="val">${pct.toFixed(0)}%</div><div class="hint">${esc(subs[subIdx])}</div></div>
      <div class="stat-card"><div class="lbl">Saldo em aberto</div><div class="val" style="font-size:1.35rem">${fmt(totalDevido)}</div><div class="hint">já pago ${fmt(totalPago)}</div></div>
      <div class="stat-card"><div class="lbl">Previsão</div><div class="val">${meses > 0 && meses < 999 ? meses : "—"}</div><div class="hint">meses com orçamento de ${fmt(Q.budget)}</div></div>
    </div>
    ${
      top
        ? `<div class="q-next">
        <div class="lbl">Próxima ação</div>
        <h3>Atacar: ${esc(top.nome)}</h3>
        <p>Pague o mínimo nas outras e concentre o restante aqui. Saldo ${fmt(top.saldo)}${top.juros > 0 ? " · " + top.juros + "% ao mês" : ""}.</p>
      </div>`
        : ""
    }
    <h3 class="section-h">Fila de quitação</h3>
    ${overview}
    <blockquote class="q-aff" id="qAff">“${esc(AFFIRMATIONS[Q.affirm])}”</blockquote>
    <button class="tool-btn" type="button" data-q="nextAffirm">Outra afirmação</button>
  `;
}

function renderDebts() {
  const sorted = getSorted();
  const cards =
    sorted
      .map((d) => {
        const paid = d.saldo <= 0 || d.status === "Quitada";
        const pct = d.saldoOriginal > 0 ? Math.min(100, ((d.saldoOriginal - d.saldo) / d.saldoOriginal) * 100) : 100;
        const activeIdx = sorted.filter((x) => x.saldo > 0).indexOf(d);
        const fill = pct > 66 ? "ok" : pct > 33 ? "mid" : "low";
        return `<article class="q-card ${paid ? "is-paid" : "p" + Math.min(activeIdx + 1, 3)}">
          <div class="q-card-h">
            <div>
              ${badge(activeIdx, paid)}
              <h4>${esc(d.nome)}</h4>
              <p>${esc(d.tipo || "—")}${d.venc && d.venc !== "—" ? " · venc. dia " + esc(String(d.venc)) : ""}</p>
            </div>
            <div class="q-amt">${fmt(d.saldo)}<small>saldo</small></div>
          </div>
          <div class="q-prog-lab"><span>Progresso</span><span>${pct.toFixed(0)}%</span></div>
          <div class="q-track"><div class="q-fill ${fill}" style="width:${pct}%"></div></div>
          <div class="q-meta">
            <div><span>Juros/mês</span><b class="${d.juros > 10 ? "bad" : d.juros > 5 ? "warn" : ""}">${d.juros > 0 ? d.juros + "%" : "—"}</b></div>
            <div><span>Mínimo</span><b>${d.minimo > 0 ? fmt(d.minimo) : "—"}</b></div>
            <div><span>Status</span><b class="${d.status === "Em atraso" ? "bad" : ""}">${esc(d.status || "Em dia")}</b></div>
          </div>
          ${d.obs ? `<p class="notes-hint">${esc(d.obs)}</p>` : ""}
          <div class="q-acts">
            <button class="tool-btn" type="button" data-q="editDebt" data-id="${d.id}">Editar</button>
            <button class="btn-ghost q-rm" type="button" data-q="rmDebt" data-id="${d.id}">Remover</button>
          </div>
        </article>`;
      })
      .join("") || `<p class="empty">Nenhuma dívida cadastrada. Adicione para ver a estratégia.</p>`;

  const ed = Q.debts.find((x) => x.id === Q.editingId) || null;

  return `
    <div class="q-form card-like">
      <h3 class="section-h" style="margin-top:0">${ed ? "Editar dívida" : "Nova dívida"}</h3>
      <div class="form-row cols-2">
        <div class="field"><label>Nome</label><input id="qNome" placeholder="Cartão, financiamento…" value="${ed ? esc(ed.nome) : ""}"></div>
        <div class="field"><label>Tipo</label>
          <select id="qTipo">${["Cartão", "Empréstimo", "Financiamento", "Cheque especial", "Outro"].map((t) => `<option${ed && ed.tipo === t ? " selected" : ""}>${t}</option>`).join("")}</select>
        </div>
      </div>
      <div class="form-row cols-3">
        <div class="field"><label>Saldo (R$)</label><input id="qSaldo" type="number" step="0.01" min="0" value="${ed ? ed.saldo : ""}"></div>
        <div class="field"><label>Juros % ao mês</label><input id="qJuros" type="number" step="0.01" min="0" value="${ed ? ed.juros || "" : ""}"></div>
        <div class="field"><label>Mínimo (R$)</label><input id="qMin" type="number" step="0.01" min="0" value="${ed ? ed.minimo || "" : ""}"></div>
      </div>
      <div class="form-row cols-2">
        <div class="field"><label>Vencimento (dia)</label><input id="qVenc" type="number" min="1" max="31" placeholder="10" value="${ed && ed.venc && ed.venc !== "—" ? esc(String(ed.venc)) : ""}"></div>
        <div class="field"><label>Status</label>
          <select id="qStatus">${["Em dia", "Em atraso", "Negociada", "Quitada"].map((s) => `<option${ed && ed.status === s ? " selected" : ""}>${s}</option>`).join("")}</select>
        </div>
      </div>
      <div class="field"><label>Observação</label><input id="qObs" placeholder="opcional" value="${ed ? esc(ed.obs || "") : ""}"></div>
      <div class="q-acts" style="border:0;padding:0;margin:0">
        <button class="btn btn-inline" type="button" data-q="addDebt">${ed ? "Salvar alteração" : "Adicionar dívida"}</button>
        ${ed ? `<button class="btn-ghost" type="button" data-q="cancelEdit">Cancelar</button>` : ""}
      </div>
    </div>
    <div class="q-list">${cards}</div>
  `;
}

function renderPlan() {
  const sorted = getSorted();
  const active = sorted.filter((d) => d.saldo > 0);
  const total = active.reduce((a, d) => a + d.saldo, 0);
  const meses = estimarMeses(total, Q.budget, Q.debts);
  const rows =
    sorted
      .map((d) => {
        const paid = d.saldo <= 0 || d.status === "Quitada";
        const idx = active.indexOf(d);
        return `<div class="q-plan ${!paid && idx === 0 ? "focus" : ""} ${paid ? "is-paid" : ""}">
          <div class="q-step">${paid ? "✓" : idx + 1}</div>
          <div>
            <strong>${esc(d.nome)}</strong>
            <p>${esc(d.tipo || "")} · ${d.juros > 0 ? d.juros + "%/mês" : "sem juros"} · mínimo ${d.minimo > 0 ? fmt(d.minimo) : "—"}</p>
          </div>
          <div class="q-plan-amt">${paid ? "<em>Quitada</em>" : fmt(d.saldo)}${!paid && idx === 0 ? "<small>Atacar agora</small>" : ""}</div>
        </div>`;
      })
      .join("") || `<p class="empty">Cadastre dívidas primeiro.</p>`;

  const hist =
    [...Q.history]
      .reverse()
      .slice(0, 20)
      .map(
        (h) => `<div class="q-hist">
        <div><strong>${esc(h.nome)}</strong><span>${esc(h.data)}</span></div>
        <b>${fmt(h.valor)}</b>
      </div>`
      )
      .join("") || `<p class="empty">Nenhum pagamento registrado.</p>`;

  const opts = active.map((d) => `<option value="${d.id}">${esc(d.nome)} (${fmt(d.saldo)})</option>`).join("") || `<option value="">Nenhuma dívida ativa</option>`;

  return `
    <div class="q-methods">
      <button type="button" class="q-method ${Q.method === "avalanche" ? "on" : ""}" data-q="method" data-m="avalanche">
        <strong>Avalanche</strong>
        <span>Maior juros primeiro. Menos dinheiro pago ao sistema.</span>
      </button>
      <button type="button" class="q-method ${Q.method === "bola" ? "on" : ""}" data-q="method" data-m="bola">
        <strong>Bola de neve</strong>
        <span>Menor saldo primeiro. Vitórias rápidas, impulso psicológico.</span>
      </button>
    </div>
    <div class="form-row cols-2">
      <div class="field"><label>Orçamento mensal para dívidas</label>
        <input id="qBudget" type="number" step="0.01" min="0" value="${Q.budget || ""}">
      </div>
      <div class="stat-card"><div class="lbl">Estimativa</div><div class="val" style="font-size:1.4rem">${meses > 0 && meses < 999 ? meses + " meses" : "—"}</div></div>
    </div>
    <button class="tool-btn" type="button" data-q="saveBudget">Salvar orçamento</button>
    <h3 class="section-h">Ordem do plano</h3>
    ${rows}
    <h3 class="section-h">Registrar pagamento</h3>
    <div class="form-row cols-2">
      <div class="field"><label>Dívida</label><select id="qPaySel">${opts}</select></div>
      <div class="field"><label>Valor pago</label><input id="qPayAmt" type="number" step="0.01" min="0"></div>
    </div>
    <button class="btn btn-inline" type="button" data-q="pay">Registrar</button>
    <h3 class="section-h">Simular extra</h3>
    <div class="form-row cols-2">
      <div class="field"><label>Aporte extra (R$)</label><input id="qExtra" type="number" step="0.01" min="0"></div>
      <div class="stat-card" id="qSimBox"><div class="lbl">Impacto</div><div class="hint" id="qSimTxt">Informe um extra para ver quantos meses você antecipa.</div></div>
    </div>
    <button class="tool-btn" type="button" data-q="sim">Simular</button>
    <h3 class="section-h">Histórico</h3>
    ${hist}
  `;
}

function paint() {
  const root = document.getElementById("qBody");
  if (!root) return;
  if (Q.tab === "dividas") root.innerHTML = renderDebts();
  else if (Q.tab === "plano") root.innerHTML = renderPlan();
  else root.innerHTML = renderPainel();
  document.querySelectorAll("[data-q-tab]").forEach((b) => {
    b.classList.toggle("on", b.dataset.qTab === Q.tab);
  });
}

export async function renderQuitei() {
  await loadQ();
  return `<div class="view active" id="qView">
    ${pageHead("quitei", "Ferramenta", "Quitei", "Estratégia de quitação nativa da AF. Avalanche ou bola de neve. Sempre sério, sempre no seu ritmo.")}
    <div class="q-tabs">
      <button type="button" data-q-tab="painel" class="${Q.tab === "painel" ? "on" : ""}">Painel</button>
      <button type="button" data-q-tab="dividas" class="${Q.tab === "dividas" ? "on" : ""}">Dívidas</button>
      <button type="button" data-q-tab="plano" class="${Q.tab === "plano" ? "on" : ""}">Plano</button>
    </div>
    <div id="qBody">${Q.tab === "dividas" ? renderDebts() : Q.tab === "plano" ? renderPlan() : renderPainel()}</div>
  </div>`;
}

export function bindQuitei() {
  if (document.documentElement.dataset.quiteiBound) return;
  document.documentElement.dataset.quiteiBound = "1";
  document.addEventListener("click", onQClick);
}

async function onQClick(e) {
  const tab = e.target.closest("[data-q-tab]");
  if (tab && document.getElementById("qView")) {
    Q.tab = tab.dataset.qTab;
    paint();
    return;
  }
  const btn = e.target.closest("[data-q]");
  if (!btn || !document.getElementById("qView")) return;
  const act = btn.dataset.q;

  if (act === "nextAffirm") {
    Q.affirm = (Q.affirm + 1) % AFFIRMATIONS.length;
    const el = document.getElementById("qAff");
    if (el) el.textContent = "“" + AFFIRMATIONS[Q.affirm] + "”";
    return;
  }
  if (act === "method") {
    Q.method = btn.dataset.m === "bola" ? "bola" : "avalanche";
    await persistQ();
    paint();
    toast("Método " + (Q.method === "avalanche" ? "Avalanche" : "Bola de neve") + " ativo");
    return;
  }
  if (act === "saveBudget") {
    Q.budget = parseFloat(document.getElementById("qBudget")?.value) || 0;
    await persistQ();
    paint();
    toast("Orçamento salvo");
    return;
  }
  if (act === "addDebt") {
    const nome = document.getElementById("qNome")?.value.trim();
    const saldo = parseFloat(document.getElementById("qSaldo")?.value) || 0;
    if (!nome || saldo < 0 || (!Q.editingId && saldo <= 0)) {
      toast("Informe nome e saldo", true);
      return;
    }
    const payload = {
      nome,
      tipo: document.getElementById("qTipo")?.value || "Outro",
      saldo,
      juros: parseFloat(document.getElementById("qJuros")?.value) || 0,
      minimo: parseFloat(document.getElementById("qMin")?.value) || 0,
      venc: document.getElementById("qVenc")?.value || "—",
      status: document.getElementById("qStatus")?.value || "Em dia",
      obs: document.getElementById("qObs")?.value.trim() || ""
    };
    if (payload.status === "Quitada") payload.saldo = 0;
    const existing = Q.editingId ? Q.debts.find((d) => d.id === Q.editingId) : null;
    if (existing) {
      Object.assign(existing, payload);
      if (existing.saldo === 0) existing.status = "Quitada";
      Q.editingId = null;
      await persistQ();
      paint();
      toast("Dívida atualizada");
      return;
    }
    Q.debts.push({
      id: Date.now(),
      ...payload,
      saldoOriginal: saldo,
      pago: 0
    });
    await persistQ();
    paint();
    toast("Dívida adicionada");
    return;
  }
  if (act === "cancelEdit") {
    Q.editingId = null;
    paint();
    return;
  }
  if (act === "rmDebt") {
    const id = +btn.dataset.id;
    Q.debts = Q.debts.filter((d) => d.id !== id);
    await persistQ();
    paint();
    toast("Removida");
    return;
  }
  if (act === "editDebt") {
    Q.editingId = +btn.dataset.id;
    Q.tab = "dividas";
    paint();
    document.getElementById("qNome")?.focus();
    return;
  }
  if (act === "pay") {
    const id = parseInt(document.getElementById("qPaySel")?.value, 10);
    const valor = parseFloat(document.getElementById("qPayAmt")?.value);
    const d = Q.debts.find((x) => x.id === id);
    if (!d || !valor || valor <= 0) {
      toast("Selecione a dívida e o valor", true);
      return;
    }
    d.pago = (d.pago || 0) + valor;
    d.saldo = Math.max(0, d.saldo - valor);
    if (d.saldo === 0) d.status = "Quitada";
    Q.history.push({
      id: Date.now(),
      debtId: id,
      nome: d.nome,
      valor,
      data: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    });
    await persistQ();
    paint();
    toast(d.saldo === 0 ? "Quitada: " + d.nome : "Pagamento registrado");
    return;
  }
  if (act === "sim") {
    const extra = parseFloat(document.getElementById("qExtra")?.value) || 0;
    const total = Q.debts.filter((d) => d.saldo > 0).reduce((a, d) => a + d.saldo, 0);
    const el = document.getElementById("qSimTxt");
    if (!el) return;
    if (!Q.budget || !total) {
      el.textContent = "Defina o orçamento e cadastre dívidas.";
      return;
    }
    const m1 = estimarMeses(total, Q.budget, Q.debts);
    const m2 = estimarMeses(total, Q.budget + extra, Q.debts);
    const ganho = m1 - m2;
    el.textContent =
      ganho > 0
        ? `Sem extra: ${m1} meses. Com extra: ${m2} meses. Você antecipa ${ganho} mês(es).`
        : `Sem extra: ${m1} meses. O extra informado ainda não muda o prazo.`;
  }
}
