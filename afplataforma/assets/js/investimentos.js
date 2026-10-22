/**
 * AF Plataforma — nova camada experimental de Investimentos & Mercados.
 * Ferramentas iniciais sem cotação externa, sem ordens e sem recomendação de compra/venda.
 */
import { session } from "./auth.js";
import { esc } from "./navigation.js?v=rt47";
import { renderCursos, bindCursos } from "./investimentos-cursos.js?v=1";

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

    <h3 class="section-h">01 · Cursos, aulas e biblioteca Zero ao Zen</h3>
    <p class="notes-hint">Área de conteúdos da formação. O mentor cadastra os cursos e as aulas; o aluno abre o vídeo em um player simples, sem exibir o endereço como texto.</p>
    ${renderCursos()}

    <h3 class="section-h">02 · Calculadora de posição e risco</h3>
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

    <h3 class="section-h">03 · Diário de teses e ativos em observação</h3>
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

    <h3 class="section-h">04 · Deal Lens — análise preliminar de compra de empresa</h3>
    <p class="notes-hint">Um primeiro filtro para estudar uma aquisição. Use valores anuais e trate o múltiplo como hipótese de cenário, não como valuation definitivo ou preço justo.</p>
    <section class="mat-card" id="dealLens">
      <div class="grid-3">
        <div class="field"><label for="dealRevenue">Receita anual</label><input id="dealRevenue" type="number" min="0" step="any" placeholder="Ex.: 2000000"></div>
        <div class="field"><label for="dealMargin">Margem EBITDA estimada (%)</label><input id="dealMargin" type="number" min="0" max="100" step="any" placeholder="Ex.: 18"></div>
        <div class="field"><label for="dealAskingEV">Valor pedido pela operação (EV)</label><input id="dealAskingEV" type="number" min="0" step="any" placeholder="Ex.: 1500000"></div>
        <div class="field"><label for="dealNetDebt">Dívida líquida (dívida − caixa)</label><input id="dealNetDebt" type="number" step="any" placeholder="Ex.: 250000"></div>
        <div class="field"><label for="dealMultiple">Múltiplo de referência (EV/EBITDA)</label><input id="dealMultiple" type="number" min="0" step="any" placeholder="Ex.: 4"></div>
      </div>
      <div class="grid-3">
        <div class="stat-card"><div class="lbl">EBITDA aproximado</div><div class="val" id="dealEbitda">—</div><div class="hint">Receita × margem informada</div></div>
        <div class="stat-card"><div class="lbl">Múltiplo implícito pedido</div><div class="val" id="dealImpliedMultiple">—</div><div class="hint">Valor pedido ÷ EBITDA aproximado</div></div>
        <div class="stat-card"><div class="lbl">EV pelo múltiplo de referência</div><div class="val" id="dealReferenceEV">—</div><div class="hint">EBITDA × múltiplo escolhido</div></div>
        <div class="stat-card"><div class="lbl">Equity value indicativo</div><div class="val" id="dealEquityValue">—</div><div class="hint">EV pedido − dívida líquida</div></div>
        <div class="stat-card"><div class="lbl">Diferença para referência</div><div class="val" id="dealDifference">—</div><div class="hint">Pedido − EV pelo múltiplo</div></div>
      </div>
      <p class="notes-hint" id="dealStatus" role="status" aria-live="polite">Preencha os dados para comparar o pedido com um cenário de múltiplo.</p>
    </section>

    <h3 class="section-h">05 · Equity Studio — participação e diluição</h3>
    <p class="notes-hint">Simule uma rodada de investimento pré-money/pós-money. Não representa contrato, proposta ou recomendação societária.</p>
    <section class="mat-card" id="equityStudio">
      <div class="grid-3">
        <div class="field"><label for="eqPreMoney">Valuation pré-money</label><input id="eqPreMoney" type="number" min="0" step="any" placeholder="Ex.: 3000000"></div>
        <div class="field"><label for="eqInvestment">Novo investimento</label><input id="eqInvestment" type="number" min="0" step="any" placeholder="Ex.: 500000"></div>
        <div class="field"><label for="eqFounderPct">Participação inicial do fundador (%)</label><input id="eqFounderPct" type="number" min="0" max="100" step="any" value="100"></div>
      </div>
      <div class="grid-3">
        <div class="stat-card"><div class="lbl">Valuation pós-money</div><div class="val" id="eqPostMoney">—</div></div>
        <div class="stat-card"><div class="lbl">Participação do novo investidor</div><div class="val" id="eqInvestorPct">—</div></div>
        <div class="stat-card"><div class="lbl">Participação do fundador após a rodada</div><div class="val" id="eqFounderPostPct">—</div></div>
      </div>
      <p class="notes-hint" id="eqStatus" role="status" aria-live="polite">Informe o valuation pré-money, o aporte e a participação inicial.</p>
    </section>

    <h3 class="section-h">06 · Glossário vivo de negócios e mercados</h3>
    <p class="notes-hint">Pesquise um termo para entender a linguagem usada por gestores, investidores, analistas e compradores de empresas.</p>
    <div class="field"><label for="invGlossarySearch">Pesquisar o vocabulário</label><input id="invGlossarySearch" type="search" placeholder="Ex.: EBITDA, drawdown, due diligence..."></div>
    <div class="module-list" id="invGlossaryResults"></div>

    <h3 class="section-h">07 · Mapa de ferramentas a construir</h3>
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

  bindCursos();

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

  const dealInputs = ["dealRevenue", "dealMargin", "dealAskingEV", "dealNetDebt", "dealMultiple"]
    .map((id) => page.querySelector("#" + id));
  const dealOutputs = {
    ebitda: page.querySelector("#dealEbitda"),
    implied: page.querySelector("#dealImpliedMultiple"),
    reference: page.querySelector("#dealReferenceEV"),
    equity: page.querySelector("#dealEquityValue"),
    difference: page.querySelector("#dealDifference"),
    status: page.querySelector("#dealStatus")
  };
  const updateDealLens = () => {
    const revenue = numberValue(dealInputs[0]?.value);
    const margin = numberValue(dealInputs[1]?.value);
    const ask = numberValue(dealInputs[2]?.value);
    const netDebt = numberValue(dealInputs[3]?.value);
    const multiple = numberValue(dealInputs[4]?.value);
    if (!(revenue > 0) || !(margin >= 0 && margin <= 100) || !(ask >= 0) || !(multiple > 0)) {
      Object.values(dealOutputs).slice(0, 5).forEach((el) => { if (el) el.textContent = "—"; });
      if (dealOutputs.status) dealOutputs.status.textContent = "Informe receita positiva, margem entre 0 e 100%, valor pedido e múltiplo de referência. Dívida líquida pode ser negativa se houver caixa líquido.";
      return;
    }
    const ebitda = revenue * margin / 100;
    const implied = ebitda > 0 ? ask / ebitda : null;
    const referenceEv = ebitda * multiple;
    const equity = ask - netDebt;
    const difference = ask - referenceEv;
    if (dealOutputs.ebitda) dealOutputs.ebitda.textContent = fmt(ebitda);
    if (dealOutputs.implied) dealOutputs.implied.textContent = implied === null ? "N/A" : fmt(implied) + "×";
    if (dealOutputs.reference) dealOutputs.reference.textContent = fmt(referenceEv);
    if (dealOutputs.equity) dealOutputs.equity.textContent = fmt(equity);
    if (dealOutputs.difference) dealOutputs.difference.textContent = fmt(difference);
    if (dealOutputs.status) dealOutputs.status.textContent = "Cálculo preliminar. EBITDA informado não foi auditado; múltiplos comparáveis, capital de giro, impostos, passivos, dependência do fundador e contingências podem mudar radicalmente uma avaliação.";
  };
  dealInputs.forEach((field) => field?.addEventListener("input", updateDealLens));
  updateDealLens();

  const eqPre = page.querySelector("#eqPreMoney");
  const eqInvestment = page.querySelector("#eqInvestment");
  const eqFounder = page.querySelector("#eqFounderPct");
  const eqPost = page.querySelector("#eqPostMoney");
  const eqInvestorPct = page.querySelector("#eqInvestorPct");
  const eqFounderPostPct = page.querySelector("#eqFounderPostPct");
  const eqStatus = page.querySelector("#eqStatus");
  const updateEquityStudio = () => {
    const pre = numberValue(eqPre?.value);
    const invest = numberValue(eqInvestment?.value);
    const founder = numberValue(eqFounder?.value);
    if (!(pre > 0) || !(invest >= 0) || !(founder >= 0 && founder <= 100)) {
      if (eqPost) eqPost.textContent = "—";
      if (eqInvestorPct) eqInvestorPct.textContent = "—";
      if (eqFounderPostPct) eqFounderPostPct.textContent = "—";
      if (eqStatus) eqStatus.textContent = "Informe valuation pré-money maior que zero, investimento não negativo e participação inicial entre 0 e 100%.";
      return;
    }
    const post = pre + invest;
    const investor = invest / post * 100;
    const founderAfter = founder * pre / post;
    if (eqPost) eqPost.textContent = fmt(post);
    if (eqInvestorPct) eqInvestorPct.textContent = fmt(investor) + "%";
    if (eqFounderPostPct) eqFounderPostPct.textContent = fmt(founderAfter) + "%";
    if (eqStatus) eqStatus.textContent = "Simulação simplificada, sem opções, classes de ações, preferências, conversíveis, aportes secundários, impostos ou condições contratuais.";
  };
  [eqPre, eqInvestment, eqFounder].forEach((field) => field?.addEventListener("input", updateEquityStudio));
  updateEquityStudio();

  const glossary = [
    ["Valuation", "Estimativa do valor econômico de um negócio ou ativo, baseada em premissas e métodos que precisam ser explicitados."],
    ["Enterprise Value (EV)", "Valor da operação, antes do ajuste pela estrutura líquida de dívida e caixa para chegar ao valor do capital próprio."],
    ["Equity value", "Valor estimado pertencente aos acionistas, considerando os ajustes aplicáveis entre EV, dívida líquida e outros itens."],
    ["EBITDA", "Resultado antes de juros, impostos, depreciação e amortização; não é caixa livre nem substitui análise de fluxo de caixa."],
    ["Margem EBITDA", "EBITDA dividido pela receita, normalmente expresso em percentual."],
    ["Due diligence", "Investigação financeira, tributária, jurídica, trabalhista, operacional, comercial e tecnológica antes de uma transação."],
    ["M&A", "Mergers and Acquisitions: fusões e aquisições de empresas."],
    ["LOI", "Letter of Intent: documento que registra a intenção e parâmetros iniciais de uma possível transação; efeitos dependem de suas cláusulas."],
    ["Term sheet", "Resumo dos principais termos econômicos e societários de uma negociação de investimento."],
    ["Earn-out", "Parcela de preço condicionada a resultados ou metas futuras definidos no acordo."],
    ["Cap table", "Quadro que mostra quem detém as participações societárias e como elas se distribuem."],
    ["Diluição", "Redução percentual da participação de sócios existentes após novas emissões ou operações societárias."],
    ["Pré-money", "Valuation acordado antes da entrada do novo capital em uma rodada."],
    ["Pós-money", "Valuation pré-money somado ao investimento primário da rodada, no modelo simples."],
    ["Fluxo de caixa", "Registro e projeção das entradas e saídas de dinheiro ao longo do tempo."],
    ["Capital de giro", "Recursos necessários para sustentar o ciclo operacional, considerando recebimentos, pagamentos e estoques."],
    ["CAC", "Custo de Aquisição de Cliente: custo atribuído a conquistar clientes em um período e contexto definidos."],
    ["LTV", "Lifetime Value: estimativa do valor econômico gerado por cliente ao longo do relacionamento, dependente das premissas."],
    ["Churn", "Taxa de cancelamento ou perda de clientes/receita recorrente no período analisado."],
    ["Runway", "Tempo estimado até acabar o caixa disponível, dadas as premissas de consumo líquido de caixa."],
    ["Burn rate", "Ritmo de consumo de caixa em um período."],
    ["ROI", "Retorno sobre o investimento; a utilidade depende de como retorno, custos e horizonte são medidos."],
    ["ROIC", "Retorno sobre o capital investido na operação, segundo uma metodologia explicitada."],
    ["Múltiplo EV/EBITDA", "Relação entre valor da operação e EBITDA; comparação exige negócios, períodos e ajustes compatíveis."],
    ["Drawdown", "Queda de um pico até um fundo posterior de valor ou patrimônio ao longo de uma série."],
    ["Volatilidade", "Medida de dispersão das variações de preço ou retorno; não descreve sozinha todos os riscos."],
    ["Liquidez", "Facilidade de comprar ou vender sem provocar grande impacto no preço; inclui dimensões de mercado e caixa."],
    ["Spread", "Diferença entre preços de compra e venda, ou entre taxas, conforme o contexto."],
    ["Slippage", "Diferença entre o preço esperado e o preço efetivamente obtido em uma execução."],
    ["Ordem limitada", "Ordem com limite de preço; pode não ser executada."],
    ["Ordem a mercado", "Ordem para executar ao melhor preço disponível, sem garantir um preço específico."],
    ["Market cap", "Preço de mercado multiplicado pela quantidade de unidades ou ações em circulação considerada pela fonte."],
    ["Stablecoin", "Criptoativo projetado para acompanhar uma referência, como moeda fiduciária; há riscos de emissor, reservas e paridade."],
    ["Staking", "Participação em mecanismos de prova de participação ou serviços que podem envolver bloqueios, riscos técnicos e de contraparte."],
    ["Custódia própria", "Controle direto das chaves de acesso aos ativos; transfere ao usuário responsabilidades de segurança e recuperação."],
    ["Holding", "Sociedade que detém participações em outras empresas e/ou ativos conforme sua estrutura e finalidade."],
    ["Governança", "Princípios, controles, papéis e processos que orientam decisões e prestação de contas."],
    ["Exit", "Saída total ou parcial de um investimento, por venda, recompra, oferta pública ou outra transação."],
    ["Alocação de ativos", "Distribuição de recursos entre classes e posições, de acordo com objetivos, horizonte e risco."]
  ];
  const glossaryResults = page.querySelector("#invGlossaryResults");
  const glossarySearch = page.querySelector("#invGlossarySearch");
  const paintGlossary = () => {
    const q = String(glossarySearch?.value || "").trim().toLocaleLowerCase("pt-BR");
    const list = glossary.filter(([term, definition]) => (term + " " + definition).toLocaleLowerCase("pt-BR").includes(q));
    if (glossaryResults) glossaryResults.innerHTML = list.length
      ? list.map(([term, definition]) => '<article class="mod-row"><div class="mod-body"><h3>' + esc(term) + '</h3><p>' + esc(definition) + '</p></div></article>').join("")
      : '<p class="notes-hint">Nenhum termo encontrado. Experimente outra palavra.</p>';
  };
  glossarySearch?.addEventListener("input", paintGlossary);
  paintGlossary();

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
