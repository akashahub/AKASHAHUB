/**
 * AF Plataforma — nova camada experimental de Investimentos & Mercados.
 * Ferramentas iniciais sem cotação externa, sem ordens e sem recomendação de compra/venda.
 */
import { session } from "./auth.js";
import { esc } from "./navigation.js?v=rt46";

const STORE_PREFIX = "af_investimentos_lab_v1:";

function storageKey() {
  return STORE_PREFIX + String(session.uid || "local");
}

function readTheses() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey()) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeTheses(items) {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

function numberValue(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const normalized = String(value || "").trim().replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function fmt(value, digits = 2) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

function renderTheses() {
  const items = readTheses();
  if (!items.length) {
    return '<p class="notes-hint">Nenhuma tese registrada ainda. Use o formulário para guardar o que está analisando.</p>';
  }
  return items.map((item) => `
    <article class="mod-row">
      <div class="mod-num">${esc(item.assetType || "—").slice(0, 3).toUpperCase()}</div>
      <div class="mod-body">
        <h3>${esc(item.symbol)} <small>· ${esc(item.assetType)}</small></h3>
        <p><strong>Tese:</strong> ${esc(item.thesis)}</p>
        <p><strong>Risco / o que pode invalidar:</strong> ${esc(item.risk)}</p>
        <p class="notes-hint">Rascunho local · ${esc(item.createdAt)}</p>
        <button class="tool-btn" type="button" data-remove-investment="${esc(item.id)}">Excluir rascunho</button>
      </div>
    </article>
  `).join("");
}

export function renderInvestimentos() {
  return `<div class="view active" id="investimentosView">
    <div class="back-link" data-nav="fase3">← Fase 3 · Alinhamento Financeiro</div>
    <p class="hero-line">Camada nova · em construção</p>
    <h2 class="hero-title">Investimentos & Mercados</h2>
    <p class="hero-sub">Um laboratório de análise para cripto, bolsa, ETFs, FIIs e cenários econômicos — sem remover nem substituir ferramentas da AF.</p>
    <p class="notes-hint">Esta primeira versão não consulta cotações em tempo real, não conecta corretoras e não envia ordens. As anotações ficam neste navegador. A proposta é construir e validar as ferramentas por etapas.</p>

    <h3 class="section-h">O que já dá para testar</h3>
    <div class="grid-3">
      <article class="stat-card">
        <div class="lbl">Ferramenta funcional</div>
        <div class="val" style="font-size:1.15rem">Calculadora de risco</div>
        <div class="hint">Estima orçamento de risco, quantidade teórica e exposição a partir dos números que você informar.</div>
      </article>
      <article class="stat-card">
        <div class="lbl">Ferramenta funcional</div>
        <div class="val" style="font-size:1.15rem">Diário de teses</div>
        <div class="hint">Registra por que um ativo está sendo estudado e o que poderia invalidar a hipótese.</div>
      </article>
      <article class="stat-card">
        <div class="lbl">Próxima integração</div>
        <div class="val" style="font-size:1.15rem">Radar de mercado</div>
        <div class="hint">A definir a fonte de dados, os custos, os limites e a atualização das cotações antes de conectar uma API.</div>
      </article>
    </div>

    <h3 class="section-h">01 · Calculadora de posição e risco</h3>
    <p class="notes-hint">Preencha todos os valores na mesma moeda. A quantidade é teórica; lote mínimo, taxas, spread, slippage, liquidez, impostos e regras da corretora não estão incluídos.</p>
    <section class="mat-card" id="invCalculator">
      <div class="grid-3">
        <div class="field"><label for="invCapital">Capital de referência</label><input id="invCapital" type="number" min="0" step="any" placeholder="Ex.: 10000"></div>
        <div class="field"><label for="invRiskPct">Risco planejado (%)</label><input id="invRiskPct" type="number" min="0" max="100" step="any" placeholder="Ex.: 1"></div>
        <div class="field"><label for="invEntry">Preço de entrada</label><input id="invEntry" type="number" min="0" step="any" placeholder="Ex.: 100"></div>
        <div class="field"><label for="invStop">Preço de saída / invalidação</label><input id="invStop" type="number" min="0" step="any" placeholder="Ex.: 95"></div>
      </div>
      <div class="grid-3">
        <div class="stat-card"><div class="lbl">Orçamento de risco</div><div class="val" id="invRiskAmount">—</div><div class="hint">Capital × percentual escolhido</div></div>
        <div class="stat-card"><div class="lbl">Quantidade teórica</div><div class="val" id="invQuantity">—</div><div class="hint">Orçamento de risco ÷ distância até a invalidação</div></div>
        <div class="stat-card"><div class="lbl">Exposição estimada</div><div class="val" id="invExposure">—</div><div class="hint">Quantidade × preço de entrada</div></div>
      </div>
      <p class="notes-hint" id="invCalcStatus" role="status" aria-live="polite">Informe os valores para fazer a estimativa.</p>
    </section>

    <h3 class="section-h">02 · Diário de teses e ativos em observação</h3>
    <p class="notes-hint">Registre uma hipótese e também seu contraponto. A anotação não é uma indicação para comprar ou vender.</p>
    <form class="mat-card" id="invIdeaForm">
      <div class="grid-3">
        <div class="field"><label for="invSymbol">Ativo / ticker</label><input id="invSymbol" maxlength="32" required placeholder="Ex.: BTC, ETH, PETR4, IVVB11"></div>
        <div class="field"><label for="invAssetType">Categoria</label>
          <select id="invAssetType" required>
            <option value="Criptomoeda">Criptomoeda</option>
            <option value="Ação">Ação</option>
            <option value="ETF">ETF</option>
            <option value="FII">FII</option>
            <option value="Índice">Índice</option>
            <option value="Macro / outro">Macro / outro</option>
          </select>
        </div>
      </div>
      <div class="field"><label for="invThesis">Por que vale estudar?</label><textarea id="invThesis" maxlength="1200" required placeholder="Tese, dados a verificar, horizonte e o que você ainda não sabe."></textarea></div>
      <div class="field"><label for="invRisk">Risco / evidência contrária / o que invalidaria a tese</label><textarea id="invRisk" maxlength="1200" required placeholder="O que pode dar errado? Que dado faria você rever a hipótese?"></textarea></div>
      <button class="tool-btn primary" type="submit" id="invSaveThesis">Guardar tese neste navegador</button>
      <p class="notes-hint" id="invSaveStatus" role="status" aria-live="polite">Não sincroniza entre dispositivos nesta versão.</p>
    </form>
    <div class="module-list" id="invThesisList" aria-live="polite"></div>

    <h3 class="section-h">03 · Mapa de ferramentas a construir</h3>
    <div class="module-list">
      <article class="mod-row"><div class="mod-num">P1</div><div class="mod-body"><h3>Radar cripto</h3><p>Preço e variação com fonte e horário visíveis; capitalização, volume, oferta circulante, desbloqueios de tokens e dados da rede quando confiáveis.</p></div></article>
      <article class="mod-row"><div class="mod-num">P1</div><div class="mod-body"><h3>Radar de bolsa, ETFs e FIIs</h3><p>Filtros por setor, liquidez, indicadores, proventos e datas de divulgação — com fonte, data-base e limites de cobertura identificados.</p></div></article>
      <article class="mod-row"><div class="mod-num">P2</div><div class="mod-body"><h3>Comparador de ativos</h3><p>Comparar desempenho em períodos equivalentes, volatilidade, drawdown, custos e fundamentos; separar dado observado de hipótese.</p></div></article>
      <article class="mod-row"><div class="mod-num">P2</div><div class="mod-body"><h3>Carteira, concentração e cenários</h3><p>Distribuição por classe e ativo, correlação aproximada, cenários de queda e exposição total, sem movimentar dinheiro.</p></div></article>
      <article class="mod-row"><div class="mod-num">P2</div><div class="mod-body"><h3>Calendário macroeconômico</h3><p>Selic, inflação, decisões de bancos centrais, resultados de empresas e eventos de cripto; cada evento ligado à fonte original.</p></div></article>
      <article class="mod-row"><div class="mod-num">P3</div><div class="mod-body"><h3>Simulador e diário de operações</h3><p>Backtest e operações hipotéticas antes de pensar em integrações mais sensíveis. Nada de execução automática nesta etapa.</p></div></article>
    </div>
    <p class="notes-hint">Princípio da camada: educar, comparar e tornar o risco visível. Sem prometer rentabilidade, sem sinais automáticos de compra/venda e sem duplicar as ferramentas de educação financeira que já existem na AF.</p>
  </div>`;
}

export function bindInvestimentos() {
  const page = document.getElementById("investimentosView");
  if (!page || page.dataset.bound === "1") return;
  page.dataset.bound = "1";

  const capital = page.querySelector("#invCapital");
  const riskPct = page.querySelector("#invRiskPct");
  const entry = page.querySelector("#invEntry");
  const stop = page.querySelector("#invStop");
  const riskAmount = page.querySelector("#invRiskAmount");
  const quantity = page.querySelector("#invQuantity");
  const exposure = page.querySelector("#invExposure");
  const calcStatus = page.querySelector("#invCalcStatus");

  const updateCalculator = () => {
    const c = numberValue(capital?.value);
    const p = numberValue(riskPct?.value);
    const e = numberValue(entry?.value);
    const s = numberValue(stop?.value);

    if (!(c > 0) || !(p > 0 && p <= 100) || !(e > 0) || !(s > 0) || e === s) {
      if (riskAmount) riskAmount.textContent = "—";
      if (quantity) quantity.textContent = "—";
      if (exposure) exposure.textContent = "—";
      if (calcStatus) calcStatus.textContent = "Informe capital, risco entre 0 e 100%, entrada e uma invalidação diferente da entrada. Todos os valores devem usar a mesma moeda.";
      return;
    }
    const risk = c * p / 100;
    const qty = risk / Math.abs(e - s);
    const position = qty * e;
    if (riskAmount) riskAmount.textContent = fmt(risk);
    if (quantity) quantity.textContent = fmt(qty, 8);
    if (exposure) exposure.textContent = fmt(position);
    if (calcStatus) calcStatus.textContent = "Estimativa matemática, não uma recomendação. Não inclui taxas, slippage, gaps, alavancagem, impostos ou diferenças entre preço de referência e execução.";
  };

  [capital, riskPct, entry, stop].forEach((field) => field?.addEventListener("input", updateCalculator));
  updateCalculator();

  const list = page.querySelector("#invThesisList");
  const status = page.querySelector("#invSaveStatus");
  const paintList = () => {
    if (list) list.innerHTML = renderTheses();
  };
  paintList();

  page.querySelector("#invIdeaForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const symbol = String(page.querySelector("#invSymbol")?.value || "").trim().toUpperCase();
    const assetType = String(page.querySelector("#invAssetType")?.value || "").trim();
    const thesis = String(page.querySelector("#invThesis")?.value || "").trim();
    const risk = String(page.querySelector("#invRisk")?.value || "").trim();
    if (!symbol || !assetType || !thesis || !risk) {
      if (status) status.textContent = "Preencha o ativo, a tese e o risco antes de guardar.";
      return;
    }
    const items = readTheses();
    items.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      symbol: symbol.slice(0, 32),
      assetType: assetType.slice(0, 50),
      thesis: thesis.slice(0, 1200),
      risk: risk.slice(0, 1200),
      createdAt: new Date().toLocaleString("pt-BR")
    });
    const saved = writeTheses(items);
    if (status) status.textContent = saved
      ? "Tese guardada neste navegador. Ainda não há sincronização entre dispositivos."
      : "O navegador não permitiu salvar; copie a anotação antes de sair.";
    if (saved) {
      page.querySelector("#invIdeaForm")?.reset();
      paintList();
    }
  });

  page.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-investment]");
    if (!button) return;
    const id = button.getAttribute("data-remove-investment");
    const remaining = readTheses().filter((item) => item.id !== id);
    const saved = writeTheses(remaining);
    if (status) status.textContent = saved
      ? "Rascunho removido deste navegador."
      : "Não foi possível atualizar o armazenamento local.";
    if (saved) paintList();
  });
}
