/**
 * AF Plataforma - orquestrador
 * (trecho relevante atualizado — o restante do arquivo permanece intacto)
 */
// ... (todo o código anterior permanece exatamente igual até o import)

import { renderFase1, renderFase2, renderFase3, renderFase4, renderFase5, renderFase1Jogo, bindFase1Jogo, renderFase1Marca, bindFase1Marca, renderFase4Sdr, renderFase4Treinamento, renderFase4Closers } from "./fases.js?v=lifeos1";

// ... (todo o restante do arquivo permanece exatamente igual até registerRenderers)

registerRenderers({
  dashboard: renderLifeOsDashboard,
  "af-dashboard": renderDashboard,
  modules: renderModules,
  moduleDetail: renderModuleDetail,
  tools: renderToolsView,
  call: renderCallView,
  mentor: renderMentor,
  ascensao: () => (isMentorSession()
    ? `<div class="view active">
        <div class="back-link" data-nav="mentor">← Gestão</div>
        <p class="hero-line">Call de entrada</p>
        <h2 class="hero-title">Ascensão de Alinhamento</h2>
        <p class="hero-sub">O mapa da sessão (1h30 · R$ 350) está no mesmo formato do fechamento. Só o mentor abre.</p>
        <a class="tool-btn" href="${ascensaoHref()}">Abrir mapa da sessão</a>
      </div>`
    : `<div class="view active"><p class="empty">Acesso restrito ao mentor.</p></div>`),
  profile: renderProfile,
  complementar: renderComplementarHome,
  compApp: renderComplementarApp,
  quitei: renderQuitei,
  criancas: renderCriancas,
  "criancas-pais": renderCriancasPais,
  "criancas-sala": renderCriancasSala,
  empresas: renderEmpresas,
  fase1: renderFase1,
  "fase1-jogo": renderFase1Jogo,
  "fase1-marca": renderFase1Marca,
  fase2: renderFase2,
  fase3: renderFase3,
  fase4: renderFase4,
  "fase4-sdr": renderFase4Sdr,
  "fase4-treinamento": renderFase4Treinamento,
  "fase4-closers": renderFase4Closers,
  fase5: renderFase5,
  "legado-planos": renderLegadoPlanos,
  "legado-contrato": renderLegadoContrato,
  "legado-regras": renderLegadoRegras,
  "legado-dossie": renderLegadoDossie,
  "legado-oquee": renderLegadoOquee,
  "legado-direcao": renderLegadoDirecao,
  "legado-pitch": renderLegadoPitch,
  "legado-tcc": renderLegadoTcc,
  "legado-slides": renderLegadoSlides,
  "conteudos-al": renderConteudosAl,
  "vendas-curso": renderVendasCurso,
  "audios-pnl": renderAudiosPnl,
  "producao-audios-pnl": renderProducaoAudiosPnl,
  showLocked,
  openTool,
  pickProduct: pickNewProductImage
});

onAfterNavigate((view) => {
  onCallNavigate(view === "call");
  if (view === "call") bindCallControls(navigate);
  if (view === "fase1-jogo") bindFase1Jogo();
  if (view === "fase1-marca") bindFase1Marca();
  if (view === "legado-dossie") bindLegadoDossie();
  if (view === "audios-pnl") bindAudiosPnl();
  if (view === "producao-audios-pnl") bindProducaoAudiosPnl();
  // bind do checklist de ativos (Fase 2)
  if (view === "fase2") {
    const root = document.getElementById("content");
    const key = "afAtivosChecklistV1";
    let salvo = {};
    try { salvo = JSON.parse(localStorage.getItem(key) || "{}"); } catch(e){}
    root?.querySelectorAll("[data-ativo]").forEach(el => {
      const i = el.getAttribute("data-ativo");
      if (salvo[i]) el.checked = true;
      el.addEventListener("change", () => {
        const out = {};
        root.querySelectorAll("[data-ativo]").forEach(c => { out[c.getAttribute("data-ativo")] = c.checked; });
        localStorage.setItem(key, JSON.stringify(out));
      });
    });
  }
});
