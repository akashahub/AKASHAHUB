import { session } from "./auth.js";
import { Store } from "./storage.js";
import { esc } from "./navigation.js";
import { PHASE_GUIDANCE } from "./phase-guidance.js";
import { db } from "../../firebase/firebase-config.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const STATUS = { not_started: "Ainda não iniciado", in_progress: "Em desenvolvimento", done: "Registrado" };
const PHASE_OPTIONS = Object.values(PHASE_GUIDANCE).map((phase) => [phase.id, phase.title]);

export const MIND_MAPS = [
  {
    id: "pessoal",
    title: "Alinhamento Pessoal",
    eyebrow: "Referência: Roteiro da Ascensão",
    center: "NOME · MAPA DE ALINHAMENTO",
    note: "Mapa de leitura e ação. Os vetores aparecem conforme a vida da pessoa; não force bolhas vazias nem apresente interpretação psicológica como diagnóstico.",
    branches: [
      ["rotina", "Rotina", "Como o dia começa e termina; compromissos e padrões observáveis.", "Qual rotina sustenta ou atrapalha a próxima ação?"],
      ["tempo", "Tempo", "Onde o tempo está comprometido ou desaparece.", "Qual bloco de tempo precisa de dono?"],
      ["financeiro", "Financeiro", "Entradas, saídas, reserva, dívidas e decisões — somente com dados fornecidos.", "Qual número precisa ser visto antes de opinar?"],
      ["trabalho", "Trabalho e renda", "De onde vem o dinheiro e quais possibilidades já existem.", "O que é renda atual e o que ainda é hipótese?"],
      ["saude", "Saúde prática", "Sono, corpo e consultas pendentes, sem conselho médico.", "Qual cuidado observável precisa de agenda?"],
      ["objetivos", "Objetivos", "O que precisa estar verdadeiro em 7 dias, 90 dias e 1 ano.", "Qual resultado tem prazo e evidência?"],
      ["projetos", "Projetos", "Começados, parados e merecedores de continuidade.", "Qual projeto continua e qual pode esperar?"],
      ["tarefas", "Tarefas", "Pendências com dono e prazo.", "Qual tarefa libera o próximo movimento?"],
      ["compras", "Compras e investimentos", "Urgente, necessário, desejável e futuro.", "Qual compra tem decisão registrada?"],
      ["ambiente", "Ambiente", "Casa, trabalho, treino e deslocamento.", "O ambiente facilita ou cobra energia demais?"],
      ["conteudo", "Conteúdo", "Só quando a pessoa já produz ou precisa aparecer.", "Que conteúdo serve a um objetivo real?"],
      ["familia", "Família e dinheiro", "Padrões relatados pela pessoa, sem conclusão automática.", "O que se repete e precisa ser nomeado como hipótese?"],
      ["padrao", "Padrão · número · gesto", "Um ponto de atenção, seu número e o gesto que o sustenta.", "Qual é o furo prioritário agora?"],
      ["acao", "Ação de 7 dias", "Uma prioridade observável para o primeiro ciclo.", "O que já poderá ser visto amanhã? "]
    ]
  },
  {
    id: "zero-zen",
    title: "Zero ao Zen Negócios",
    eyebrow: "Estrutura-base proposta · validar com a metodologia específica",
    center: "NEGÓCIO · DO ZERO AO PRÓXIMO PASSO",
    note: "Este mapa organiza uma proposta de entrada e reorganização. Não afirma pilares oficiais que não foram localizados nos arquivos.",
    branches: [
      ["ideia", "Ideia e contexto", "O que existe, em que estágio e por que vale investigar.", "Qual é a menor pergunta que precisa ser respondida?"],
      ["publico", "Pessoa ou grupo servido", "Quem é afetado, sem presumir canal ou tamanho de mercado.", "Quem consegue descrever o problema com as próprias palavras?"],
      ["problema", "Problema atendido", "Situação concreta que merece uma solução.", "O que acontece hoje e qual custo produz?"],
      ["valor", "Proposta de valor", "Como a solução ajuda e em que se diferencia.", "Que resultado é buscado e que evidência existe?"],
      ["oferta", "Oferta e entrega", "O que é vendido, formato, limites e condições.", "O cliente sabe o que recebe e o que não recebe?"],
      ["aquisicao", "Aquisição e relacionamento", "Caminhos compatíveis com o negócio para encontrar e manter clientes.", "Qual canal pode ser mantido com a capacidade atual?"],
      ["operacao", "Operação", "Recursos, processos, responsáveis e qualidade.", "O que precisa acontecer para entregar sem improviso?"],
      ["financas", "Finanças", "Receitas, custos, caixa, preço e prioridade do ciclo.", "Qual número impede uma escolha cega?"],
      ["proximo", "Próximo passo", "Uma ação pequena, com dono, prazo e critério.", "O que move o projeto sem abrir dez frentes? "]
    ]
  },
  {
    id: "arquitetura-legado",
    title: "Arquitetura de Legado",
    eyebrow: "Conecta as cinco fases da jornada",
    center: "ARQUITETURA DE LEGADO · UM CICLO",
    note: "O mapa aponta para as cinco fases, seus checklists e entregáveis. Ele não substitui os registros de cada fase.",
    branches: [
      ["fase1", "01 · Arquitetura de Essência", "Identidade, história, capacidades, valores e direção.", "O que precisa orientar decisões?", "fase1"],
      ["fase2", "02 · Império Digital", "Posicionamento, marca, oferta, canais e ativos.", "O que precisa ganhar forma e acesso?", "fase2"],
      ["fase3", "03 · Alinhamento Financeiro", "Dinheiro, caixa, preço, margem, metas e prioridades.", "Qual número informa a próxima escolha?", "fase3"],
      ["fase4", "04 · Processos de Execução e Expansão", "Processos, responsáveis, qualidade, operação e crescimento sustentável.", "O que pode ser repetido com mais previsibilidade?", "fase4"],
      ["fase5", "05 · Comunidade, Movimento, Doutrina", "Conhecimento, formação, cultura, comunidade e continuidade.", "O que permanece sem depender de uma única pessoa?", "fase5"],
      ["entregas", "Entregas que conectam fases", "Ativos e decisões que passam de uma etapa para a seguinte.", "Qual entregável autoriza o próximo passo?"],
      ["evidencias", "Evidências de progresso", "Links, arquivos, registros, tarefas e decisões verificáveis.", "O que mostra que avançou de verdade?"],
      ["ciclo", "Próximo ciclo", "Revisão, ajuste e continuidade do trabalho.", "O que será revisado e quando?"]
    ]
  },
  {
    id: "financeiro",
    title: "Alinhamento Financeiro",
    eyebrow: "Referência: sete módulos e ferramentas existentes",
    center: "ALINHAMENTO FINANCEIRO · DECISÃO",
    note: "Finanças pessoais e empresariais podem ser separadas dentro das anotações. O mapa não calcula nem inventa números.",
    branches: [
      ["base", "Base e cash-flow", "Reserva, entradas, saídas, custos, despesas e caixa.", "Qual número está faltando para decidir?"],
      ["criativo", "Criatividade e validação", "Ideias, recursos e testes antes de construir demais.", "Que hipótese pode ser validada com três pessoas?"],
      ["execucao", "Execução", "Ação, prioridade, accountability e revisão.", "Qual ação financeira está sendo adiada?"],
      ["rede", "Rede e reciprocidade", "Conexões, entrega de valor e próximos contatos.", "Que entrega pode ser feita antes do pedido?"],
      ["voz", "Comunicação e negociação", "Pitch, limites, proposta e clareza de valor.", "O que precisa ser dito sem pedir desculpa?"],
      ["visao", "Visão e cenários", "Metas, planejamento, cenários e margem de segurança.", "Qual horizonte precisa de um número?"],
      ["legado", "Governança e legado", "Critérios, valores, documentação e continuidade.", "Que decisão precisa continuar válida quando o humor mudar?"],
      ["pessoal", "Finanças pessoais", "Contas, rotina, obrigações e objetivos da pessoa.", "O que é pessoal e não deve ser confundido com o caixa da empresa?"],
      ["empresa", "Finanças empresariais", "Receita, custo, margem, caixa e patrimônio do negócio.", "Qual decisão pertence à empresa e qual pertence à vida pessoal?"],
      ["prioridade", "Plano e revisão", "Uma prioridade, uma ação e uma data de revisão.", "Qual gesto torna o número observável?"]
    ]
  },
  {
    id: "tecnologia-alma",
    title: "Tecnologia da Alma",
    eyebrow: "Referência: Tecnologia-da-Alma-Formacao.md e transcrição existente",
    center: "MENTE · CORPO · CAMPO",
    note: "A fonte descreve uma prática e premissas de trabalho. O mapa não apresenta crenças ou conceitos metafísicos como resultados cientificamente comprovados.",
    branches: [
      ["mente", "Mente", "Atenção, palavra, crenças e repetição consciente.", "Que pensamento precisa ser observado sem tratá-lo como fato?"],
      ["corpo", "Corpo", "Presença, postura, respiração e práticas sem toque descritas na formação.", "O corpo confirma ou desmente a frase?"],
      ["campo", "Campo", "Ambiente, relação e contexto em que a ação acontece.", "Que contexto facilita uma ação coerente?"],
      ["meditacao", "Meditação", "Descrita na fonte como ação elevada e prática de atenção, não como fuga ou prova de evolução.", "O que o silêncio permite notar hoje?"],
      ["energia", "Energia sexual", "Premissa de trabalho da fonte, tratada como energia a direcionar para vida, obra e presença — sem vulgaridade nem promessa.", "Que direção prática será escolhida para essa energia?"],
      ["fascinacao", "Fascinação e magnetismo", "Inteireza, escuta e comunicação não verbal; não manipulação nem truque.", "O corpo comunica confiança, abertura e responsabilidade?"],
      ["escrita", "Escrita, crenças e soltar", "Registro breve para observar, nomear e ajustar padrões.", "Qual frase é repetida e que ação pode testar outra forma?"],
      ["registros", "Experiência e reflexão", "Sessão com mentor e registro posterior do que foi visto, ouvido, sentido e decidido.", "O que é experiência relatada e o que é interpretação?"],
      ["simbolos", "Mapas e símbolos", "Elementos, runas e símbolos como ferramentas de foco da formação, não como amuletos ou prova.", "Qual símbolo ajuda a lembrar a ação escolhida?"],
      ["ritmo", "Ritmo da prática", "Mente, corpo, escrita, revisão e call conforme a organização descrita na fonte.", "Qual prática cabe na semana real da pessoa?"],
      ["fronteiras", "Limites e segurança", "A prática não substitui cuidado médico, jurídico ou financeiro especializado.", "Que apoio externo é necessário antes de continuar?"]
    ]
  }
];

function mapById(id) { return MIND_MAPS.find((map) => map.id === id) || MIND_MAPS[0]; }
function storageKey() { return "mindmaps_v1_" + (session.uid || "anon"); }
function loadState() { const raw = Store.get(storageKey(), { active: "pessoal", maps: {} }); return raw && typeof raw === "object" ? raw : { active: "pessoal", maps: {} }; }
function mapState(id) { const all = loadState(); return all.maps?.[id] || { nodes: {} }; }
function persist(all) {
  all.updatedAtMs = Date.now();
  Store.set(storageKey(), all);
  if (session.mode !== "firebase" || !session.uid) return;
  setDoc(doc(db, "mentorias", session.uid, "mapas_mentais", "state"), { data: all, updatedAtMs: all.updatedAtMs, updatedAt: serverTimestamp(), uid: session.uid }, { merge: true }).catch((error) => console.warn("[AF mapas] sincronização indisponível:", error?.code || error?.message || error));
}
function nodeData(id, nodeId) { return mapState(id).nodes?.[nodeId] || {}; }
function mapSummary(map) {
  const state = mapState(map.id);
  const lines = [`${map.center}`];
  map.branches.forEach(([id, title]) => {
    const value = state.nodes?.[id]?.notes?.trim();
    if (value) lines.push(`${title}: ${value}`);
  });
  return lines.join("\n");
}
function branchHtml(map, branch, index) {
  const [id, title, description, prompt, link] = branch;
  const data = nodeData(map.id, id);
  const status = STATUS[data.status] ? data.status : "not_started";
  return `<article class="mindmap-node ${status}" data-map-node="${esc(id)}"><div class="mindmap-node-head"><span class="mindmap-branch-number">${String(index + 1).padStart(2, "0")}</span><div><h4>${esc(title)}</h4><p>${esc(description)}</p></div></div><details><summary>Abrir nó</summary><p class="mindmap-prompt">${esc(prompt)}</p><label>Estado<select data-map-status="${esc(id)}"><option value="not_started" ${status === "not_started" ? "selected" : ""}>${STATUS.not_started}</option><option value="in_progress" ${status === "in_progress" ? "selected" : ""}>${STATUS.in_progress}</option><option value="done" ${status === "done" ? "selected" : ""}>${STATUS.done}</option></select></label><label>Registro, reflexão ou evidência<textarea data-map-notes="${esc(id)}" rows="3" placeholder="Escreva a sua resposta; não é uma interpretação automática.">${esc(data.notes || "")}</textarea></label><label>Conectar a fase<select data-map-phase="${esc(id)}"><option value="">Sem fase específica</option>${PHASE_OPTIONS.map(([phaseId, phaseTitle]) => `<option value="${esc(phaseId)}" ${data.phase === phaseId || link === phaseId ? "selected" : ""}>${esc(phaseTitle)}</option>`).join("")}</select></label></details></article>`;
}

export function renderMindMaps() {
  const all = loadState();
  const active = mapById(all.active || "pessoal");
  const state = mapState(active.id);
  const filled = active.branches.filter(([id]) => state.nodes?.[id]?.notes?.trim()).length;
  return `<div class="view active mindmaps-view"><div class="mindmaps-hero"><div><p class="hero-line">MAPAS MENTAIS · AKASHA</p><h2 class="hero-title">Ver o território antes de escolher o próximo movimento.</h2><p class="hero-sub">Escolha um mapa, expanda os nós e registre somente o que faz sentido para a sua realidade. O mapa é uma ferramenta de trabalho, não um diagnóstico automático.</p></div><div class="mindmap-center"><span>centro</span><strong>${esc(active.center)}</strong><small>${filled}/${active.branches.length} nós com registro</small></div></div><div class="mindmap-tabs" role="tablist" aria-label="Escolher mapa">${MIND_MAPS.map((map) => `<button type="button" class="tool-btn ${map.id === active.id ? "active" : ""}" data-mindmap="${esc(map.id)}" role="tab" aria-selected="${map.id === active.id}">${esc(map.title)}</button>`).join("")}</div><div class="mindmap-source"><strong>${esc(active.eyebrow)}</strong><p>${esc(active.note)}</p></div><div class="mindmap-branches">${active.branches.map((branch, index) => branchHtml(active, branch, index)).join("")}</div><details class="mindmap-summary" open><summary>Resumo textual acessível</summary><pre>${esc(mapSummary(active))}</pre></details><div class="mindmap-actions"><button class="tool-btn" type="button" data-map-copy>Copiar resumo do mapa</button><button class="tool-btn" type="button" data-nav="arquitetura-legado">Voltar para Arquitetura de Legado</button></div><p class="notes-hint" data-map-status-note role="status">Alterações são salvas por usuário neste navegador e, quando a sessão Firebase está ativa, sincronizadas no registro privado da jornada.</p></div>`;
}

export function updateMindMap(mapId, nodeId, patch) {
  const all = loadState();
  all.maps = all.maps || {};
  all.maps[mapId] = all.maps[mapId] || { nodes: {} };
  const current = all.maps[mapId].nodes?.[nodeId] || {};
  all.maps[mapId].nodes = all.maps[mapId].nodes || {};
  all.maps[mapId].nodes[nodeId] = { ...current, ...patch, updatedAtMs: Date.now() };
  persist(all);
}

export function bindMindMaps() {
  const root = document.getElementById("content");
  if (!root || root.dataset.mindmapsBound === "1") return;
  root.dataset.mindmapsBound = "1";
  root.addEventListener("click", async (event) => {
    const tab = event.target.closest("[data-mindmap]");
    if (tab) {
      const all = loadState();
      all.active = tab.dataset.mindmap;
      persist(all);
      // O shell principal é o dono do roteador. Reutilize seu item de
      // navegação em vez de criar uma segunda tabela de renderizadores.
      document.querySelector('#navMain [data-view="mapas-mentais"]')?.click();
      return;
    }
    const copy = event.target.closest("[data-map-copy]");
    if (copy) {
      const active = mapById(loadState().active || "pessoal");
      const text = mapSummary(active);
      try { await navigator.clipboard.writeText(text); } catch { window.prompt("Copie o resumo do mapa", text); }
      const note = root.querySelector("[data-map-status-note]"); if (note) note.textContent = "Resumo copiado. Use-o como referência, não como resposta pronta.";
    }
  });
  root.addEventListener("change", (event) => {
    const control = event.target.closest("[data-map-status], [data-map-phase]");
    if (!control) return;
    const active = loadState().active || "pessoal";
    const id = control.dataset.mapStatus || control.dataset.mapPhase;
    const data = nodeData(active, id);
    updateMindMap(active, id, control.dataset.mapStatus ? { status: control.value } : { phase: control.value });
    const card = control.closest("[data-map-node]");
    if (card && control.dataset.mapStatus) { card.classList.remove("not_started", "in_progress", "done"); card.classList.add(control.value); }
    const note = root.querySelector("[data-map-status-note]"); if (note) note.textContent = "Estado do nó salvo.";
  });
  root.addEventListener("change", (event) => {
    const notes = event.target.closest("[data-map-notes]");
    if (!notes) return;
    updateMindMap(loadState().active || "pessoal", notes.dataset.mapNotes, { notes: notes.value.slice(0, 2000) });
    const note = root.querySelector("[data-map-status-note]"); if (note) note.textContent = "Registro salvo.";
  });
}

let hydrationUid = null;
let hydrationPromise = null;
export async function hydrateMindMaps(onUpdated) {
  if (session.mode !== "firebase" || !session.uid || hydrationUid === session.uid || hydrationPromise) return;
  hydrationPromise = (async () => {
    try {
      const snap = await getDoc(doc(db, "mentorias", session.uid, "mapas_mentais", "state"));
      const remote = snap.exists() ? snap.data() || {} : null;
      const local = loadState();
      if (remote?.data && Number(remote.updatedAtMs || 0) > Number(local.updatedAtMs || 0)) {
        Store.set(storageKey(), remote.data);
        if (onUpdated) onUpdated();
      }
      hydrationUid = session.uid;
    } catch (error) {
      console.warn("[AF mapas] leitura indisponível:", error?.code || error?.message || error);
    } finally { hydrationPromise = null; }
  })();
  return hydrationPromise;
}
