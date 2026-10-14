/**
 * LifeOS — painel central da pessoa, do negócio e do processo de mentoria.
 * Esta camada organiza acessos existentes; não duplica nem remove ferramentas.
 */
import { session } from "./auth.js";
import { esc, unlockedCount, nextModule } from "./navigation.js";

export function renderLifeOsDashboard() {
  const nome = String(session.name || "").trim().split(/\s+/)[0];
  const abertos = unlockedCount();
  const proximo = nextModule();
  const fases = [
    ["fase1", "01", "Essência", "Identidade, história, capacidades e direção."],
    ["fase2", "02", "Império Digital", "Posicionamento, marca, ativos e estrutura comercial."],
    ["fase3", "03", "Alinhamento Financeiro", "Caixa, indicadores, preço, metas e decisões."],
    ["fase4", "04", "Expansão", "Processos, responsabilidades e operação."],
    ["fase5", "05", "Comunidade e Continuidade", "Metodologia, comunidade e legado."]
  ];
  return `<div class="view active lifeos-home">
    <style>
      .lifeos-home .lifeos-kicker{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
      .lifeos-home .lifeos-intro{max-width:760px;color:var(--muted);line-height:1.7;margin:10px 0 24px}
      .lifeos-home .lifeos-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:12px;margin:14px 0 28px}
      .lifeos-home .lifeos-card{border:1px solid var(--line);background:var(--bg2);padding:18px;min-height:168px;display:flex;flex-direction:column;align-items:flex-start;gap:9px}
      .lifeos-home .lifeos-card h3{font-family:var(--font-d);font-size:1.45rem;font-weight:400}
      .lifeos-home .lifeos-card p{color:var(--muted);font-size:12px;line-height:1.65}
      .lifeos-home .lifeos-mark{font-size:10px;letter-spacing:.15em;color:var(--gold)}
      .lifeos-home .lifeos-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:8px}
      .lifeos-home .lifeos-phases{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,205px),1fr));gap:10px;margin:14px 0 22px}
      .lifeos-home .lifeos-phase{border:1px solid var(--line);padding:14px;background:var(--surface);cursor:pointer}
      .lifeos-home .lifeos-phase .num{color:var(--gold);font-size:11px;letter-spacing:.12em}
      .lifeos-home .lifeos-phase h4{font-size:13px;font-weight:500;margin:8px 0}
      .lifeos-home .lifeos-phase p{font-size:11px;color:var(--muted);line-height:1.6}
      .lifeos-home .lifeos-note{border-left:2px solid var(--gold);padding:12px 15px;color:var(--muted);font-size:12px;line-height:1.7;margin:12px 0 24px}
    </style>
    <p class="lifeos-kicker">LifeOS · Central de comando</p>
    <h2 class="hero-title">Organizar a vida. Conduzir o negócio. Executar o que importa.</h2>
    <p class="lifeos-intro">Bem-vindo${nome ? ", " + esc(nome) : ""}. Este é o ponto central para conectar Corpo, Mente e Campo à jornada de mentoria e à execução real. As ferramentas continuam nos seus espaços atuais; este painel organiza os caminhos sem apagar, duplicar ou substituir o que já existe.</p>
    <div class="grid-3">
      <div class="stat-card"><div class="lbl">Módulos liberados</div><div class="val">${abertos}/7</div><div class="hint">Acesso atual da sua conta</div></div>
      <div class="stat-card"><div class="lbl">Próximo módulo disponível</div><div class="val" style="font-size:1.1rem;padding-top:8px">${proximo ? esc(proximo.num + " · " + proximo.title.split(" ")[0]) : "Completo"}</div><div class="hint">${proximo ? esc(proximo.title) : "Todos os módulos estão liberados"}</div></div>
      <div class="stat-card"><div class="lbl">Processo</div><div class="val" style="font-size:1.1rem;padding-top:8px">Mentoria + execução</div><div class="hint">Decisões, ferramentas, prática e revisão</div></div>
    </div>
    <h3 class="section-h">As três dimensões do LifeOS</h3>
    <div class="lifeos-grid">
      <article class="lifeos-card"><span class="lifeos-mark">DIMENSÃO 01</span><h3>Corpo</h3><p>Energia, rotina, hábitos, sono e consistência para sustentar o que precisa ser feito.</p><div class="lifeos-actions"><button class="tool-btn" type="button" data-nav="complementar">Explorar ferramentas</button><button class="tool-btn" type="button" data-nav="tools">Abrir ferramentas</button></div></article>
      <article class="lifeos-card"><span class="lifeos-mark">DIMENSÃO 02</span><h3>Mente</h3><p>Clareza, foco, aprendizagem, identidade, escolhas e preparação para agir com intenção.</p><div class="lifeos-actions"><button class="tool-btn" type="button" data-nav="fase1">Essência</button><button class="tool-btn" type="button" data-nav="modules">Módulos e materiais</button></div></article>
      <article class="lifeos-card"><span class="lifeos-mark">DIMENSÃO 03</span><h3>Campo</h3><p>Aplicação no mundo real: negócio, dinheiro, posicionamento, relações, entregas e resultados.</p><div class="lifeos-actions"><button class="tool-btn" type="button" data-nav="fase2">Estratégia</button><button class="tool-btn" type="button" data-nav="af-dashboard">Dashboard AF</button><button class="tool-btn" type="button" data-nav="empresas">Empresas</button></div></article>
    </div>
    <h3 class="section-h">Mentoria e execução · acompanhamento do processo</h3>
    <p class="lifeos-intro">A mentoria continua sendo um processo próprio, conduzido em conjunto. Este painel conecta cada etapa às ferramentas e à execução — não transforma a mentoria em uma simples lista automática de tarefas.</p>
    <div class="lifeos-phases">${fases.map(([id, num, titulo, descricao]) => `<div class="lifeos-phase" data-nav="${id}"><div class="num">FASE ${num}</div><h4>${titulo}</h4><p>${descricao}</p></div>`).join("")}</div>
    <div class="lifeos-note">O painel mostra os acessos e o progresso de módulos que a plataforma já conhece. Não presume que uma etapa da mentoria foi concluída nem inventa atividades, marcos ou resultados. O registro detalhado de decisões e acompanhamento pode evoluir sem mexer no conteúdo original das fases.</div>
    <h3 class="section-h">Acesso rápido</h3>
    <div class="lifeos-actions" style="margin:0 0 28px"><button class="tool-btn" type="button" data-nav="call">Call / encontro</button><button class="tool-btn" type="button" data-nav="complementar">Ferramentas complementares</button><button class="tool-btn" type="button" data-nav="quitei">Quitei</button><button class="tool-btn" type="button" data-nav="fase3">Fase 3 · AF</button></div>
  </div>`;
}
