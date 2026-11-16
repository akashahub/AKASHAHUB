/**
 * Menus novos do hub. Só organiza o que já existe.
 * Não grava coleção, não lê o app do mentorando e não troca o UID de login.
 */
import { session, isMentorSession } from "./auth.js";
import { esc } from "./navigation.js?v=etapa4-1";
import { getAllUsersForAf } from "../../firebase/firestore.js";
import { activeHubContext, selectHubMentee, setAuthorizedMentees } from "./hub-context.js?v=etapa4-1";

function statusLabel(status) {
  if (status === "active") return "Acesso ativo";
  if (status === "paused") return "Acesso pausado";
  if (status === "pending") return "Sem aprovação";
  return "Sem ficha de acesso";
}

export function renderMentorandos() {
  if (!isMentorSession()) {
    return `<div class="view active"><p class="empty">A lista de mentorandos fica só com o mentor.</p></div>`;
  }
  const ctx = activeHubContext();
  return `<div class="view active">
    <p class="hero-line">Cadastro existente</p>
    <h2 class="hero-title">Mentorandos</h2>
    <p class="hero-sub">A lista vem de <code>users</code> e <code>afAccess</code>, que o mentor já pode ler. Escolher alguém só marca a navegação. Não abre o documento dessa pessoa e não muda o seu login.</p>
    <p class="notes-hint" id="hubContextNow">Contexto atual: ${esc(ctx?.name || ctx?.email || "você")} · ${esc(ctx?.uid || "")}</p>
    <button class="tool-btn" type="button" id="hubContextSelf">Voltar o contexto para mim</button>
    <div class="field" style="max-width:420px;margin-top:14px">
      <label for="hubMenteeFilter">Buscar por nome, e-mail ou UID</label>
      <input id="hubMenteeFilter" type="search" placeholder="Digite para filtrar a lista já carregada">
    </div>
    <div id="hubMenteeList"><p class="empty">Carregando cadastros…</p></div>
  </div>`;
}

export async function bindMentorandos() {
  const root = document.getElementById("hubMenteeList");
  if (!root || !isMentorSession()) return;
  document.getElementById("hubContextSelf")?.addEventListener("click", () => {
    selectHubMentee({ uid: session.uid, name: session.name, email: session.email });
    const note = document.getElementById("hubContextNow");
    if (note) note.textContent = `Contexto atual: ${session.name || "você"} · ${session.uid}`;
  });
  let rows = [];
  try {
    rows = await getAllUsersForAf();
    setAuthorizedMentees(rows);
  } catch (error) {
    setAuthorizedMentees([]);
    root.innerHTML = `<p class="empty">${esc(error?.message || "Não foi possível ler os cadastros.")}</p>`;
    return;
  }
  if (!rows?.length) {
    root.innerHTML = `<p class="empty">Nenhum cadastro em users ou afAccess.</p>`;
    return;
  }
  const draw = () => {
    const q = (document.getElementById("hubMenteeFilter")?.value || "").trim().toLowerCase();
    const visible = rows.filter((row) => {
      const blob = `${row.name || ""} ${row.email || ""} ${row.uid || ""}`.toLowerCase();
      return !q || blob.includes(q);
    });
    if (!visible.length) {
      root.innerHTML = `<p class="empty">Nenhum cadastro com esse texto.</p>`;
      return;
    }
    root.innerHTML = `<div class="module-list">${visible.map((row) => `
      <div class="mod-row">
        <div class="mod-body">
          <h3>${esc(row.name || row.email || row.uid)}</h3>
          <p class="notes-hint">${esc(row.email || "sem e-mail")} · ${esc(statusLabel(row.status))}<br><code>${esc(row.uid)}</code></p>
          ${row.status === "active"
            ? `<button class="tool-btn" type="button" data-hub-uid="${esc(row.uid)}">Usar como contexto</button>`
            : `<p class="notes-hint">Sem acesso ativo. Este UID não entra no contexto.</p>`}
        </div>
      </div>`).join("")}</div>`;
    root.querySelectorAll("[data-hub-uid]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const wanted = btn.getAttribute("data-hub-uid");
        const ctx = selectHubMentee({ uid: wanted });
        const note = document.getElementById("hubContextNow");
        if (!note) return;
        if (!ctx || ctx.uid !== wanted) {
          note.textContent = "Este UID não está na lista autorizada. O contexto não mudou.";
          return;
        }
        note.textContent = `Contexto atual: ${ctx.name || ctx.email || "mentorando"} · ${ctx.uid}`;
      });
    });
  };
  document.getElementById("hubMenteeFilter")?.addEventListener("input", draw);
  draw();
}

function linkRow(href, label, note) {
  return `<a class="tool-btn" href="${href}">${esc(label)}</a>${note ? `<p class="notes-hint">${esc(note)}</p>` : ""}`;
}

export function renderHubDossie() {
  if (!isMentorSession()) {
    return `<div class="view active"><p class="empty">O índice do dossiê, nesta etapa, fica com o mentor.</p></div>`;
  }
  const ctx = activeHubContext();
  return `<div class="view active">
    <p class="hero-line">Índice · ainda não consolida</p>
    <h2 class="hero-title">Diagnóstico e dossiê</h2>
    <p class="hero-sub">Isto não é o Dossiê Vivo. Ele entra na etapa 6. Aqui só estão os caminhos que já guardam informação, sem copiar nada.</p>
    <p class="notes-hint">Contexto de navegação: ${esc(ctx?.name || "você")} · ${esc(ctx?.uid || "")}. Os botões abaixo não levam o UID na URL.</p>
    <p style="display:flex;flex-wrap:wrap;gap:8px">
      <a class="tool-btn" href="/sessoes/">Captura de Essência</a>
      <button class="tool-btn" type="button" data-nav="fase1-dossie">Dossiê da Fase 1</button>
      <button class="tool-btn" type="button" data-nav="fase1">Fase 1</button>
      <button class="tool-btn" type="button" data-nav="fase2">Fase 2</button>
      <button class="tool-btn" type="button" data-nav="fase3">Fase 3</button>
      <button class="tool-btn" type="button" data-nav="fase4">Fase 4</button>
      <button class="tool-btn" type="button" data-nav="fase5">Fase 5</button>
    </p>
  </div>`;
}

export function renderHubPrompts() {
  if (!isMentorSession()) {
    return `<div class="view active">
      <p class="hero-line">Biblioteca</p>
      <h2 class="hero-title">Prompts liberados</h2>
      <p class="hero-sub">Nenhum prompt foi liberado para o mentorando nesta etapa. Roteiro interno do mentor não aparece aqui.</p>
    </div>`;
  }
  return `<div class="view active">
    <p class="hero-line">O que já existe</p>
    <h2 class="hero-title">Biblioteca de Prompts</h2>
    <p class="hero-sub">A biblioteca com versão, permissão e execução entra na etapa 7. Até lá, os roteiros reais continuam onde já estão: na gestão do mentor e no teleprompter.</p>
    <p style="display:flex;flex-wrap:wrap;gap:8px">
      <button class="tool-btn" type="button" data-nav="mentor">Abrir gestão do mentor</button>
    </p>
    <p class="notes-hint">Nada aqui cria, executa ou versiona prompt.</p>
  </div>`;
}

export function renderHubSessoes() {
  const mentor = isMentorSession();
  return `<div class="view active">
    <p class="hero-line">Caminhos atuais</p>
    <h2 class="hero-title">${mentor ? "Sessões e acompanhamento" : "Captura e sessões"}</h2>
    <p class="hero-sub">O formulário de /sessoes/ não foi alterado. Estes botões só abrem as páginas que já existiam.</p>
    <p style="display:flex;flex-wrap:wrap;gap:8px">
      <a class="tool-btn" href="/sessoes/">Abrir Captura de Essência</a>
      <a class="tool-btn" href="/afplataforma/complementar/encontros.html">Encontros</a>
      <button class="tool-btn" type="button" data-nav="call">Call</button>
      ${mentor ? `<a class="tool-btn" href="/afplataforma/ascensao/">Ascensão</a>
      <a class="tool-btn" href="/afplataforma/entregas/">Central de Entregas</a>
      <a class="tool-btn" href="/afplataforma/fechamento/">Fechamento</a>` : ""}
    </p>
  </div>`;
}

export function renderHubIntel() {
  if (!isMentorSession()) {
    return `<div class="view active"><p class="empty">A Inteligência Central fica com o mentor e ainda não cruza as fases.</p></div>`;
  }
  return `<div class="view active">
    <p class="hero-line">Ainda sem cruzamento</p>
    <h2 class="hero-title">Inteligência Central</h2>
    <p class="hero-sub">Nesta etapa ela não lê as ferramentas, não calcula e não cria hipótese. A etapa 6 faz isso. Abaixo, só a porta de cada fase.</p>
    <p style="display:flex;flex-wrap:wrap;gap:8px">
      <button class="tool-btn" type="button" data-nav="fase1">Fase 1</button>
      <button class="tool-btn" type="button" data-nav="fase2">Fase 2</button>
      <button class="tool-btn" type="button" data-nav="fase3">Fase 3</button>
      <button class="tool-btn" type="button" data-nav="fase4">Fase 4</button>
      <button class="tool-btn" type="button" data-nav="fase5">Fase 5</button>
      <button class="tool-btn" type="button" data-nav="hub-dossie">Índice do dossiê</button>
    </p>
  </div>`;
}

export function renderHubAcervo() {
  const mentor = isMentorSession();
  const comum = `
    <a class="tool-btn" href="/afplataforma/imperio/">Império · biblioteca</a>
    <a class="tool-btn" href="/afplataforma/oratoria/">Oratória</a>
    <a class="tool-btn" href="/afplataforma/zen-negocios/">Zen Negócios</a>
    <a class="tool-btn" href="/afplataforma/complementar/anamnese.html">Anamnese</a>
    <button class="tool-btn" type="button" data-nav="corpo">CORPO</button>
  `;
  const interno = mentor ? `
    <a class="tool-btn" href="/afplataforma/mesa/">Mesa</a>
    <a class="tool-btn" href="/afplataforma/sdr/">SDR antigo</a>
    <a class="tool-btn" href="/afplataforma/interno/livro.html">Livro operacional</a>
  ` : "";
  return `<div class="view active">
    <p class="hero-line">Páginas que já existiam</p>
    <h2 class="hero-title">Acervo e frentes</h2>
    <p class="hero-sub">Nenhuma destas ferramentas foi reescrita. O mentor vê também o que já era interno.</p>
    <p style="display:flex;flex-wrap:wrap;gap:8px">${comum}${interno}</p>
  </div>`;
}

export function renderHubConfig() {
  return `<div class="view active">
    <p class="hero-line">Conta</p>
    <h2 class="hero-title">Configurações</h2>
    <p class="hero-sub">O login, o afAccess e o UID continuam os mesmos.</p>
    <p style="display:flex;flex-wrap:wrap;gap:8px">
      <button class="tool-btn" type="button" data-nav="profile">Meu perfil</button>
      ${isMentorSession() ? `<button class="tool-btn" type="button" data-nav="mentor">Gestão e liberação de acesso</button>` : ""}
    </p>
  </div>`;
}
