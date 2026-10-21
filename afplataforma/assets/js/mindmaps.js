import { session, isMentorSession } from "./auth.js";
import { Store } from "./storage.js";
import { esc } from "./navigation.js";
import { PHASE_GUIDANCE } from "./phase-guidance.js?v=rt46";
import { phaseProgress, readPhaseChecklist } from "./phase-checklists.js?v=rt46";
import { db } from "../../firebase/firebase-config.js";
import { doc, getDoc, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const STATUS = { not_started: "Ainda não iniciado", in_progress: "Em desenvolvimento", done: "Registrado" };
const CHECKLIST_STATUS = { not_started: "Ainda não iniciado", in_progress: "Em andamento", done: "Concluído" };
const PHASE_OPTIONS = Object.values(PHASE_GUIDANCE).map((phase) => [phase.id, phase.title]);

export const MIND_MAPS = [
  {
    id: "pessoal",
    title: "Alinhamento Pessoal",
    eyebrow: "Referência: Roteiro da Ascensão",
    center: "NOME · MAPA DE ALINHAMENTO",
    note: "Referência: Roteiro da Ascensão, etapa Mapa. O roteiro original é restrito ao mentor; este mapa é uma ferramenta de trabalho e não o substitui. Os 12 vetores-base só aparecem quando existem na vida da pessoa. Padrão/número/gesto e ação de 7 dias são etapas de diagnóstico e prioridade, não bolhas extras; registros antigos nessas duas áreas continuam preservados abaixo.",
    branches: [
      ["rotina", "Rotina", "Como o dia começa e termina; compromissos e padrões observáveis.", "Qual rotina sustenta ou atrapalha a próxima ação?"],
      ["tempo", "Tempo", "Onde o tempo está comprometido ou desaparece.", "Qual bloco de tempo precisa de dono?"],
      ["financeiro", "Financeiro", "Entradas, saídas, reserva, dívidas e decisões — somente com dados fornecidos.", "Qual número precisa ser visto antes de opinar?", "", "cashflow", "Abrir Cash-flow", "quitei", "Abrir Quitei"],
      ["trabalho", "Trabalho e renda", "De onde vem o dinheiro e quais possibilidades já existem.", "O que é renda atual e o que ainda é hipótese?", "", "cashflow", "Abrir Cash-flow"],
      ["saude", "Saúde prática", "Sono, corpo e consultas pendentes, sem conselho médico.", "Qual cuidado observável precisa de agenda?"],
      ["objetivos", "Objetivos", "O que precisa estar verdadeiro em 7 dias, 90 dias e 1 ano.", "Qual resultado tem prazo e evidência?", "", "vision", "Abrir Visão em 1 página"],
      ["projetos", "Projetos", "Começados, parados e merecedores de continuidade.", "Qual projeto continua e qual pode esperar?", "", "execution", "Abrir Execução semanal"],
      ["tarefas", "Tarefas", "Pendências com dono e prazo.", "Qual tarefa libera o próximo movimento?", "", "execution", "Abrir Execução semanal"],
      ["compras", "Compras e investimentos", "Urgente, necessário, desejável e futuro.", "Qual compra tem decisão registrada?"],
      ["ambiente", "Ambiente", "Casa, trabalho, treino e deslocamento.", "O ambiente facilita ou cobra energia demais?"],
      ["conteudo", "Conteúdo", "Só quando a pessoa já produz ou precisa aparecer.", "Que conteúdo serve a um objetivo real?"],
      ["familia", "Família e dinheiro", "Padrões relatados pela pessoa, sem conclusão automática.", "O que se repete e precisa ser nomeado como hipótese?"]
    ]
  },
  {
    id: "zero-zen",
    title: "Zero ao Zen Negócios",
    eyebrow: "Fonte: Zero ao Zen, pp. 8–12; complemento Códigos de Origem, § 08",
    center: "NEGÓCIO · DO ZERO AO PRÓXIMO PASSO",
    note: "A fonte distingue Zero ao Zen como guarda-chuva de comunidade/movimento/livro e Zen Negócios como aplicação numa empresa; Rá é apresentado como estágio de maturidade. Este roteiro de negócio é uma aplicação proposta, não uma lista de pilares oficiais. Os temas de caráter/autoridade, competição que cria, dinheiro como infraestrutura e cooperação são referências do material; os campos operacionais abaixo são perguntas práticas de trabalho.",
    sourceUrl: "/members/livros/zero-ao-zen.pdf",
    sourceUrlLabel: "Abrir o livro Zero ao Zen (PDF)",
    sourceThemes: [
      { title: "Poder, autoridade e caráter · p. 8", text: "A fonte distingue poder de autoridade e relaciona caráter à execução responsável; aplicação proposta no negócio: explicitar limites, responsabilidades e formas de liderança sem humilhação." },
      { title: "Competição que cria · p. 9", text: "A obra diferencia competir para melhorar do esforço para impedir o outro; use como pergunta de reflexão, não como diagnóstico automático." },
      { title: "Dinheiro como infraestrutura · p. 10", text: "Alinhamento Financeiro é descrito como comportamento e dinheiro como suporte à produção e à obra, não prova de iluminação." },
      { title: "Tecnologia da Alma · p. 11", text: "A obra apresenta a pergunta sobre atenção, respiração, corpo, linguagem, presença, ritual, memória, relação e ambiente; não afirma equivalência científica entre metáfora e tecnologia." },
      { title: "Quinta dimensão e Rá · p. 12", text: "Quinta dimensão é nome interno da obra, não laboratório; Rá aparece como estágio de caráter, prosperidade, liderança, cooperação e legado." }
    ],
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
    note: "Finanças pessoais e empresariais podem ser separadas dentro das anotações. Use os atalhos para consultar as ferramentas já existentes; registre decisões e referências, sem duplicar valores. O mapa não calcula nem inventa números.",
    branches: [
      ["base", "Base e cash-flow", "Reserva, entradas, saídas, custos, despesas e caixa.", "Qual número está faltando para decidir?", "", "cashflow", "Abrir Auditoria de Cash-Flow"],
      ["criativo", "Criatividade e validação", "Ideias, recursos e testes antes de construir demais.", "Que hipótese pequena pode ser validada com os recursos disponíveis?", "", "ideation", "Abrir Diário de insights"],
      ["execucao", "Execução", "Ação, prioridade, accountability e revisão.", "Qual ação financeira está sendo adiada?", "", "execution", "Abrir Execução semanal"],
      ["rede", "Rede e reciprocidade", "Conexões, entrega de valor e próximos contatos.", "Que entrega pode ser feita antes do pedido?", "", "network", "Abrir Rede"],
      ["voz", "Comunicação e negociação", "Pitch, limites, proposta e clareza de valor.", "O que precisa ser dito sem pedir desculpa?", "", "pitch", "Abrir Pitch 60 segundos"],
      ["visao", "Visão e cenários", "Metas, planejamento, cenários e margem de segurança.", "Qual horizonte precisa de um número?", "", "vision", "Abrir Visão em 1 página"],
      ["legado", "Governança e legado", "Critérios, valores, documentação e continuidade.", "Que decisão precisa continuar válida quando o humor mudar?", "", "legacy", "Abrir Declaração de Legado"],
      ["pessoal", "Finanças pessoais", "Contas, rotina, obrigações e objetivos da pessoa.", "O que é pessoal e não deve ser confundido com o caixa da empresa?"],
      ["dividas", "Dívidas e obrigações", "Compromissos, parcelas e prioridades pessoais que já são acompanhados na ferramenta existente.", "Qual obrigação requer atenção e qual registro deve ser consultado?", "", "quitei", "Abrir Quitei"],
      ["empresa", "Finanças empresariais", "Receita, custo, margem, caixa e patrimônio do negócio.", "Qual decisão pertence à empresa e qual pertence à vida pessoal?"],
      ["prioridade", "Plano e revisão", "Uma prioridade, uma ação e uma data de revisão.", "Qual gesto torna o número observável?"]
    ]
  },
  {
    id: "tecnologia-alma",
    title: "Tecnologia da Alma",
    eyebrow: "Referência: Tecnologia-da-Alma-Formacao.md e transcrição existente",
    center: "MENTE · CORPO · CAMPO",
    note: "Fonte: Tecnologia-da-Alma-Formacao.md e transcrição existente. A fonte diz que Tecnologia da Alma não é um quinto pilar fechado: escuta, corpo, vulnerabilidade, energia e presença são portas, não uma jaula. Mente, Corpo e Campo organizam esta versão do mapa; afirmações espirituais/metafísicas não são apresentadas como resultados científicos.",
    sourceThemes: [
      { title: "Cinco pontos de conexão", text: "Escuta, corpo, vulnerabilidade, energia e presença são portas de entrada na formação, não uma lista exaustiva de pilares." },
      { title: "Três premissas da formação", text: "A fonte enuncia meditação como ação elevada, energia sexual como força a direcionar e prática antes da teoria; registre-as como premissas do material, não como consenso científico." },
      { title: "Limite de aplicação", text: "A formação descreve autodomínio e convite a uma troca real; não manipulação ou tentativa de dobrar a outra pessoa." }
    ],
    branches: [
      ["mente", "Mente", "Atenção, palavra, crenças e repetição consciente.", "Que pensamento precisa ser observado sem tratá-lo como fato?"],
      ["corpo", "Corpo", "Presença, postura, respiração e práticas sem toque descritas na formação.", "O corpo confirma ou desmente a frase?"],
      ["campo", "Campo", "Ambiente, relação e contexto em que a ação acontece.", "Que contexto facilita uma ação coerente?"],
      ["pontos-conexao", "Escuta, corpo, vulnerabilidade, energia e presença", "Cinco portas de conexão descritas na formação; não representam todos os conteúdos nem um quinto pilar fechado.", "Qual porta ajuda a pessoa a praticar autodomínio e uma troca real?"],
      ["meditacao", "Meditação", "Descrita na fonte como ação elevada e prática de atenção, não como fuga ou prova de evolução.", "O que o silêncio permite notar hoje?"],
      ["energia", "Energia sexual", "Premissa de trabalho da fonte, tratada como energia a direcionar para vida, obra e presença — sem vulgaridade nem promessa.", "Que direção prática será escolhida para essa energia?"],
      ["fascinacao", "Fascinação e magnetismo", "Inteireza, escuta e comunicação não verbal; não manipulação nem truque.", "O corpo comunica confiança, abertura e responsabilidade?"],
      ["escrita", "Escrita, crenças e soltar", "Registro breve para observar, nomear e ajustar padrões.", "Qual frase é repetida e que ação pode testar outra forma?"],
      ["registros", "Experiência e reflexão", "Sessão com mentor e registro posterior do que foi visto, ouvido, sentido e decidido.", "O que é experiência relatada e o que é interpretação?"],
      ["simbolos", "Mapas e símbolos", "Elementos, runas e símbolos como ferramentas de foco da formação, não como amuletos ou prova.", "Qual símbolo ajuda a lembrar a ação escolhida?"],
      ["ritmo", "Prática antes da teoria", "Repetição, registro e revisão para que a prática venha antes da explicação, conforme a fonte.", "Qual prática cabe na semana real da pessoa?"],
      ["fronteiras", "Limites e segurança", "A prática não substitui cuidado médico, jurídico ou financeiro especializado.", "Que apoio externo é necessário antes de continuar?"]
    ]
  }
];

const PERSONAL_LEGACY_NODES = [
  ["padrao", "Síntese de diagnóstico · padrão, número e gesto", "Síntese da etapa de diagnóstico do roteiro; não é vetor-base do mapa.", "Qual padrão foi observado, qual dado falta e que gesto o sustenta?"],
  ["acao", "Prioridade de 7 dias", "Uma ação observável definida depois da leitura do mapa; não é vetor-base.", "Qual movimento pequeno terá evidência dentro do próximo ciclo?"]
];

function mapById(id) { return MIND_MAPS.find((map) => map.id === id) || MIND_MAPS[0]; }
function storageKey(uid = session.uid || "anon") { return "mindmaps_v1_" + uid; }
function loadState(uid = session.uid || "anon") { const raw = Store.get(storageKey(uid), { active: "pessoal", maps: {} }); return raw && typeof raw === "object" ? raw : { active: "pessoal", maps: {} }; }
function mapState(id) { return loadState().maps?.[id] || { nodes: {} }; }
function hasNodeData(node = {}) { return !!(node.notes?.trim() || node.reference?.trim() || node.phase || node.checklistItem || (node.status && node.status !== "not_started")); }
function visibleBranches(map, state = mapState(map.id)) {
  return map.branches.filter(([id]) => {
    if (map.id !== "pessoal") return true;
    const node = state.nodes?.[id] || {};
    return node.visible === true || (node.visible !== false && hasNodeData(node));
  });
}

function personalVectorPicker(map, state) {
  if (map.id !== "pessoal") return "";
  const visible = new Set(visibleBranches(map, state).map(([id]) => id));
  const hidden = map.branches.filter(([id]) => !visible.has(id));
  if (!hidden.length) return `<p class="mindmap-link-note">Todos os vetores-base existentes estão visíveis; não há bolhas vazias pendentes.</p>`;
  return `<details class="mindmap-add-vector"><summary>Adicionar vetor se ele existir nesta vida</summary><p>O roteiro diz para não forçar bolhas vazias. Escolha um vetor antes de preencher; ocultar depois preserva os registros.</p><div class="mindmap-add-vector-row"><select data-map-add-vector-select aria-label="Escolha um vetor pessoal">${hidden.map(([id, title]) => `<option value="${esc(id)}">${esc(title)}</option>`).join("")}</select><button class="tool-btn" type="button" data-map-add-vector-action>Adicionar ao mapa</button></div></details>`;
}

function savedPersonalExtras(map, state) {
  if (map.id !== "pessoal") return "";
  const saved = PERSONAL_LEGACY_NODES.filter(([id]) => hasNodeData(state.nodes?.[id]));
  if (!saved.length) return "";
  return `<details class="mindmap-legacy-records"><summary>Registros adicionais preservados · fora dos vetores-base</summary><p>Esses dados foram gravados anteriormente e continuam editáveis; não são bolhas definidas pelo roteiro de Ascensão.</p><div class="mindmap-branches">${saved.map((branch, index) => branchHtml(map, branch, index, true)).join("")}</div></details>`;
}

function persist(all) {
  const uid = session.uid || "anon";
  all.updatedAtMs = Date.now();
  Store.set(storageKey(uid), all);
  if (session.mode !== "firebase" || !session.uid) return;
  syncMapState(uid, all).catch((error) => {
    console.warn("[AF mapas] sincronização indisponível:", error?.code || error?.message || error);
    const note = document.querySelector("[data-map-status-note]");
    if (note) note.textContent = "O registro está salvo neste navegador, mas a sincronização remota falhou. Reconecte e altere/salve novamente.";
  });
}
function nodeData(id, nodeId) { return mapState(id).nodes?.[nodeId] || {}; }

function checklistOptions(phaseId, selectedId) {
  const phase = PHASE_GUIDANCE[phaseId];
  if (!phase) return '<option value="">Escolha uma fase primeiro</option>';
  return `<option value="">Sem tarefa vinculada</option>${phase.checklist.map((item) => `<option value="${esc(item.id)}" ${selectedId === item.id ? "selected" : ""}>${esc(item.action)}</option>`).join("")}`;
}
function mapSummary(map, root = null) {
  const state = mapState(map.id);
  const lines = [`${map.center}`];
  visibleBranches(map, state).forEach(([id, title, , , link]) => {
    const node = state.nodes?.[id] || {};
    const draft = (selector, dataKey) => [...(root?.querySelectorAll(selector) || [])].find((control) => control.dataset[dataKey] === id)?.value;
    const value = (draft("[data-map-notes]", "mapNotes") ?? node.notes ?? "").trim();
    if (value) lines.push(`${title}: ${value}`);
    const nodeStatus = draft("[data-map-status]", "mapStatus") ?? node.status;
    if (nodeStatus && STATUS[nodeStatus]) lines.push(`${title} · Estado: ${STATUS[nodeStatus]}`);
    const phaseId = draft("[data-map-phase]", "mapPhase") ?? node.phase ?? (PHASE_GUIDANCE[link] ? link : "");
    if (phaseId) {
      const phase = PHASE_GUIDANCE[phaseId];
      const taskId = draft("[data-map-task]", "mapTask") ?? node.checklistItem;
      const task = phase?.checklist?.find((item) => item.id === taskId);
      const progress = phase ? phaseProgress(phaseId) : null;
      const taskState = task ? readPhaseChecklist(phaseId)[task.id] : null;
      lines.push(`${title} · Fase: ${phase?.title || phaseId}${progress ? ` · Checklist: ${progress.done}/${progress.total}` : ""}${task ? ` · Tarefa: ${task.action}${taskState?.status ? ` (${CHECKLIST_STATUS[taskState.status] || taskState.status})` : ""}` : ""}`);
    }
    const reference = (draft("[data-map-reference]", "mapReference") ?? node.reference ?? "").trim();
    if (reference) lines.push(`${title} · Referência: ${reference}`);
  });
  if (map.id === "pessoal") {
    map.branches.filter(([id]) => state.nodes?.[id]?.visible === false && hasNodeData(state.nodes[id])).forEach(([id, title]) => {
      const value = state.nodes[id].notes?.trim();
      lines.push(`${title} · Vetor oculto do mapa; registro preservado${value ? `: ${value}` : ""}`);
    });
    PERSONAL_LEGACY_NODES.filter(([id]) => hasNodeData(state.nodes?.[id])).forEach(([id, title]) => {
      const value = state.nodes[id].notes?.trim();
      lines.push(`${title} · Registro adicional preservado${value ? `: ${value}` : ""}`);
    });
  }
  return lines.join("\n");
}
function refreshMapSummary(root) {
  const pre = root.querySelector(".mindmap-summary pre");
  if (pre) pre.textContent = mapSummary(mapById(loadState().active || "pessoal"), root);
}
function toolButton(toolId, toolLabel) {
  if (!toolId) return "";
  if (toolId === "quitei") return `<button class="tool-btn" type="button" data-nav="quitei">${esc(toolLabel || "Abrir Quitei")}</button>`;
  return `<button class="tool-btn" type="button" data-tool="${esc(toolId)}">${esc(toolLabel || "Abrir ferramenta")}</button>`;
}
function updateLivePhaseLinks(card, phaseId, taskId = "") {
  const phase = PHASE_GUIDANCE[phaseId];
  const note = card?.querySelector("[data-map-phase-note]");
  const button = card?.querySelector("[data-map-open-phase]");
  if (note) {
    note.hidden = !phase;
    if (phase) {
      const progress = phaseProgress(phaseId);
      const task = phase.checklist.find((item) => item.id === taskId);
      const taskState = task ? readPhaseChecklist(phaseId)[task.id] : null;
      note.textContent = `Fase relacionada: ${phase.title} · checklist ${progress.done}/${progress.total}${task ? ` · ${task.action}: ${CHECKLIST_STATUS[taskState?.status] || CHECKLIST_STATUS.not_started}` : ""}`;
    }
  }
  if (button) {
    button.hidden = !phase;
    if (phase) button.dataset.nav = phaseId;
  }
}
function branchHtml(map, branch, index, archived = false) {
  const [id, title, description, prompt, link, toolId, toolLabel, extraToolId, extraToolLabel] = branch;
  const data = nodeData(map.id, id);
  const status = STATUS[data.status] ? data.status : "not_started";
  const phaseId = data.phase || (PHASE_GUIDANCE[link] ? link : "");
  const phase = PHASE_GUIDANCE[phaseId];
  const progress = phase ? phaseProgress(phaseId) : null;
  const linkedTask = phase?.checklist?.find((item) => item.id === data.checklistItem);
  const linkedTaskState = linkedTask ? readPhaseChecklist(phaseId)[linkedTask.id] : null;
  const phaseNote = `<p class="mindmap-link-note" data-map-phase-note ${progress ? "" : "hidden"}>${progress ? `Fase relacionada: ${esc(phase.title)} · checklist ${progress.done}/${progress.total}${linkedTask ? ` · ${esc(linkedTask.action)}: ${esc(CHECKLIST_STATUS[linkedTaskState?.status] || linkedTaskState?.status || CHECKLIST_STATUS.not_started)}` : ""}` : ""}</p>`;
  const financeNote = map.id === "financeiro" && (toolId || extraToolId) ? '<p class="mindmap-link-note">Abra a ferramenta de origem e registre aqui a decisão ou o caminho do registro; não replique valores financeiros.</p>' : "";
  const phaseAction = `<button class="tool-btn" type="button" data-map-open-phase data-nav="${esc(phaseId)}" ${phase ? "" : "hidden"}>Abrir fase relacionada</button>`;
  const toolActions = `${toolButton(toolId, toolLabel)}${toolButton(extraToolId, extraToolLabel)}`;
  const hideAction = map.id === "pessoal" && !archived && map.branches.some(([branchId]) => branchId === id) ? `<button class="tool-btn" type="button" data-map-hide-vector="${esc(id)}">Ocultar vetor sem apagar o registro</button>` : "";
  return `<article class="mindmap-node ${status}" data-map-node="${esc(id)}"><div class="mindmap-node-head"><span class="mindmap-branch-number">${String(index + 1).padStart(2, "0")}</span><div><h4>${esc(title)}</h4><p>${esc(description)}</p></div></div><details><summary>Abrir nó</summary><p class="mindmap-prompt">${esc(prompt)}</p>${phaseNote}${financeNote}<div class="mindmap-actions">${phaseAction}${toolActions}${hideAction}</div><label>Estado<select data-map-status="${esc(id)}"><option value="not_started" ${status === "not_started" ? "selected" : ""}>${STATUS.not_started}</option><option value="in_progress" ${status === "in_progress" ? "selected" : ""}>${STATUS.in_progress}</option><option value="done" ${status === "done" ? "selected" : ""}>${STATUS.done}</option></select></label><label>Registro, reflexão ou evidência<textarea data-map-notes="${esc(id)}" rows="3" placeholder="Escreva a sua resposta; não é uma interpretação automática.">${esc(data.notes || "")}</textarea></label><label>Conectar a fase<select data-map-phase="${esc(id)}"><option value="">Sem fase específica</option>${PHASE_OPTIONS.map(([idOption, phaseTitle]) => `<option value="${esc(idOption)}" ${phaseId === idOption ? "selected" : ""}>${esc(phaseTitle)}</option>`).join("")}</select></label><label>Vincular a um item do checklist<select data-map-task="${esc(id)}">${checklistOptions(phaseId, data.checklistItem)}</select></label><label>Referência para tarefa, ativo ou entrega (opcional)<input data-map-reference="${esc(id)}" value="${esc(data.reference || "")}" maxlength="500" placeholder="Ex.: tarefa, arquivo ou link já existente"></label></details></article>`;
}

export function renderMindMaps() {
  const all = loadState();
  const active = mapById(all.active || "pessoal");
  const state = mapState(active.id);
  const branches = visibleBranches(active, state);
  const filled = branches.filter(([id]) => state.nodes?.[id]?.notes?.trim()).length;
  const branchCards = branches.length ? branches.map((branch, index) => branchHtml(active, branch, index)).join("") : '<p class="mindmap-empty">Nenhum vetor foi registrado ainda. Adicione somente os que existem na realidade da pessoa.</p>';
  const sourceThemes = active.sourceThemes?.length ? `<details class="mindmap-source-themes"><summary>Temas da fonte e limites de interpretação</summary><ul>${active.sourceThemes.map((item) => `<li><strong>${esc(item.title)}:</strong> ${esc(item.text)}</li>`).join("")}</ul></details>` : "";
  const sourceAction = active.sourceUrl ? `<div class="mindmap-actions"><a class="tool-btn" href="${esc(active.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(active.sourceUrlLabel || "Abrir material de referência")}</a></div>` : active.sourceView ? `<div class="mindmap-actions"><button class="tool-btn" type="button" data-nav="${esc(active.sourceView)}">${esc(active.sourceViewLabel || "Abrir material de referência")}</button></div>` : "";
  const ascensionAction = active.id === "pessoal" && isMentorSession() ? `<button class="tool-btn" type="button" data-nav="ascensao">Abrir roteiro da Sessão de Ascensão</button>` : "";
  return `<div class="view active mindmaps-view"><div class="mindmaps-hero"><div><p class="hero-line">MAPAS MENTAIS · AKASHA</p><h2 class="hero-title">Ver o território antes de escolher o próximo movimento.</h2><p class="hero-sub">Escolha um mapa, expanda os nós e registre somente o que faz sentido para a sua realidade. O mapa é uma ferramenta de trabalho, não um diagnóstico automático.</p></div><div class="mindmap-center"><span>centro</span><strong>${esc(active.center)}</strong><small>${filled}/${branches.length} vetores visíveis com registro</small></div></div><div class="mindmap-tabs" role="tablist" aria-label="Escolher mapa">${MIND_MAPS.map((map) => `<button type="button" class="tool-btn ${map.id === active.id ? "active" : ""}" data-mindmap="${esc(map.id)}" role="tab" aria-selected="${map.id === active.id}">${esc(map.title)}</button>`).join("")}</div><div class="mindmap-source"><strong>${esc(active.eyebrow)}</strong><p>${esc(active.note)}</p>${sourceThemes}${sourceAction}</div>${personalVectorPicker(active, state)}<div class="mindmap-branches">${branchCards}</div>${savedPersonalExtras(active, state)}<details class="mindmap-summary" open><summary>Resumo textual acessível</summary><pre>${esc(mapSummary(active))}</pre></details><div class="mindmap-actions"><button class="tool-btn" type="button" data-map-copy>Copiar resumo do mapa</button>${ascensionAction}<button class="tool-btn" type="button" data-nav="arquitetura-legado">Voltar para Arquitetura de Legado</button></div><p class="notes-hint" data-map-status-note role="status">Alterações são salvas por usuário neste navegador e, quando a sessão Firebase está ativa, sincronizadas no registro privado da jornada.</p></div>`;
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
    const addVector = event.target.closest("[data-map-add-vector-action]");
    if (addVector) {
      const select = root.querySelector("[data-map-add-vector-select]");
      const id = select?.value;
      if (!id) {
        const note = root.querySelector("[data-map-status-note]");
        if (note) note.textContent = "Escolha um vetor antes de adicioná-lo.";
        return;
      }
      updateMindMap("pessoal", id, { visible: true, status: "in_progress" });
      document.querySelector('#navMain [data-view="mapas-mentais"]')?.click();
      return;
    }
    const hideVector = event.target.closest("[data-map-hide-vector]");
    if (hideVector) {
      updateMindMap("pessoal", hideVector.dataset.mapHideVector, { visible: false });
      document.querySelector('#navMain [data-view="mapas-mentais"]')?.click();
      return;
    }
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
      const text = mapSummary(active, root);
      try { await navigator.clipboard.writeText(text); } catch { window.prompt("Copie o resumo do mapa", text); }
      const note = root.querySelector("[data-map-status-note]"); if (note) note.textContent = "Resumo copiado. Use-o como referência, não como resposta pronta.";
    }
  });
  root.addEventListener("input", (event) => {
    if (event.target.closest("[data-map-notes], [data-map-reference]")) refreshMapSummary(root);
  });
  root.addEventListener("change", (event) => {
    const statusControl = event.target.closest("[data-map-status]");
    const phaseControl = event.target.closest("[data-map-phase]");
    const taskControl = event.target.closest("[data-map-task]");
    const control = statusControl || phaseControl || taskControl;
    if (!control) return;
    const active = loadState().active || "pessoal";
    const id = statusControl?.dataset.mapStatus || phaseControl?.dataset.mapPhase || taskControl?.dataset.mapTask;
    const card = control.closest("[data-map-node]");
    const data = nodeData(active, id);
    if (statusControl) {
      updateMindMap(active, id, { status: control.value });
      if (card) { card.classList.remove("not_started", "in_progress", "done"); card.classList.add(control.value); }
    } else if (phaseControl) {
      const chosenPhase = control.value;
      const taskSelect = [...(card?.querySelectorAll("[data-map-task]") || [])].find((select) => select.dataset.mapTask === id);
      const stillValid = !!PHASE_GUIDANCE[chosenPhase]?.checklist?.some((item) => item.id === data.checklistItem);
      const patch = { phase: chosenPhase, ...(data.checklistItem && !stillValid ? { checklistItem: "" } : {}) };
      updateMindMap(active, id, patch);
      if (taskSelect) taskSelect.innerHTML = checklistOptions(chosenPhase, stillValid ? data.checklistItem : "");
      updateLivePhaseLinks(card, chosenPhase, stillValid ? data.checklistItem : "");
    } else {
      updateMindMap(active, id, { checklistItem: control.value });
      const branch = mapById(active).branches.find(([branchId]) => branchId === id);
      updateLivePhaseLinks(card, data.phase || branch?.[4] || "", control.value);
    }
    const note = root.querySelector("[data-map-status-note]"); if (note) note.textContent = statusControl ? "Estado do nó salvo." : "Vínculo com fase ou checklist salvo.";
    refreshMapSummary(root);
  });
  root.addEventListener("change", (event) => {
    const notes = event.target.closest("[data-map-notes]");
    const reference = event.target.closest("[data-map-reference]");
    const control = notes || reference;
    if (!control) return;
    const id = notes?.dataset.mapNotes || reference?.dataset.mapReference;
    updateMindMap(loadState().active || "pessoal", id, notes ? { notes: control.value.slice(0, 2000) } : { reference: control.value.trim().slice(0, 500) });
    const note = root.querySelector("[data-map-status-note]"); if (note) note.textContent = notes ? "Registro salvo." : "Referência vinculada.";
    refreshMapSummary(root);
  });
}

function mergeMapStates(local, remote) {
  const merged = { ...remote, ...local, active: local.active || remote.active || "pessoal", maps: {} };
  const mapIds = new Set([...Object.keys(remote.maps || {}), ...Object.keys(local.maps || {})]);
  for (const mapId of mapIds) {
    const localMap = local.maps?.[mapId] || {};
    const remoteMap = remote.maps?.[mapId] || {};
    const nodes = {};
    const nodeIds = new Set([...Object.keys(remoteMap.nodes || {}), ...Object.keys(localMap.nodes || {})]);
    for (const nodeId of nodeIds) {
      const localNode = localMap.nodes?.[nodeId];
      const remoteNode = remoteMap.nodes?.[nodeId];
      nodes[nodeId] = !localNode ? remoteNode : !remoteNode ? localNode : Number(localNode.updatedAtMs || 0) >= Number(remoteNode.updatedAtMs || 0) ? localNode : remoteNode;
    }
    merged.maps[mapId] = { ...remoteMap, ...localMap, nodes };
  }
  merged.updatedAtMs = Math.max(Number(local.updatedAtMs || 0), Number(remote.updatedAtMs || 0));
  return merged;
}

const hydratedUids = new Set();
const hydrationPromises = new Map();
const mapSyncPromises = new Map();

async function syncMapState(uid, localState) {
  const localSnapshot = JSON.parse(JSON.stringify(localState));
  const previous = mapSyncPromises.get(uid) || Promise.resolve();
  const ref = doc(db, "mentorias", uid, "mapas_mentais", "state");
  const operation = previous.catch(() => {}).then(() => runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    const remoteData = snap.exists() ? snap.data()?.data || {} : {};
    const merged = mergeMapStates(localSnapshot, remoteData);
    merged.updatedAtMs = Math.max(Date.now(), Number(merged.updatedAtMs || 0));
    transaction.set(ref, { data: merged, updatedAtMs: merged.updatedAtMs, updatedAt: serverTimestamp(), uid }, { merge: true });
    return merged;
  }));
  mapSyncPromises.set(uid, operation);
  try {
    const synced = await operation;
    if (session.uid === uid && session.mode === "firebase") {
      const reconciled = mergeMapStates(loadState(uid), synced);
      Store.set(storageKey(uid), reconciled);
      if (JSON.stringify(reconciled) !== JSON.stringify(synced) && mapSyncPromises.get(uid) === operation) {
        window.setTimeout(() => { syncMapState(uid, reconciled).catch(() => {}); }, 0);
      }
    }
    return synced;
  } finally {
    if (mapSyncPromises.get(uid) === operation) mapSyncPromises.delete(uid);
  }
}

export async function hydrateMindMaps(onUpdated) {
  const uid = session.uid;
  if (session.mode !== "firebase" || !uid || hydratedUids.has(uid)) return;
  if (hydrationPromises.has(uid)) return hydrationPromises.get(uid);
  const promise = (async () => {
    try {
      const snap = await getDoc(doc(db, "mentorias", uid, "mapas_mentais", "state"));
      if (session.uid !== uid || session.mode !== "firebase") return;
      const remote = snap.exists() ? snap.data() || {} : null;
      const local = loadState(uid);
      const remoteData = remote?.data || {};
      const merged = mergeMapStates(local, remoteData);
      if (JSON.stringify(merged) !== JSON.stringify(local)) Store.set(storageKey(uid), merged);
      if (Object.keys(merged.maps || {}).length && JSON.stringify(merged) !== JSON.stringify(remoteData)) {
        await syncMapState(uid, merged);
      }
      if (JSON.stringify(merged) !== JSON.stringify(local) && session.uid === uid && onUpdated) {
        onUpdated();
      }
      hydratedUids.add(uid);
    } catch (error) {
      console.warn("[AF mapas] leitura indisponível:", error?.code || error?.message || error);
    }
  })();
  hydrationPromises.set(uid, promise);
  try { return await promise; }
  finally { if (hydrationPromises.get(uid) === promise) hydrationPromises.delete(uid); }
}
