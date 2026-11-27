/**
 * Dossiê de leitura.
 * Mostra o que as ferramentas já salvaram. Não cria coleção e não grava.
 */
import { session, isMentorSession } from "./auth.js";
import { activeHubContext, loadAuthorizedMentees } from "./hub-context.js?v=etapa4-1";
import { db } from "../../firebase/firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { readableFields, subjectOf, copyText } from "./hub-dossie-rules.js?v=etapa5-1";

export const DOSSIE_TOOLS = [
  ["Fase 1 · Essência", "Essência", "afEssencia", "/afplataforma/essencia/"],
  ["Fase 1 · Essência", "Identity Studio", "afIdentityStudio", "/afplataforma/identity-studio/"],
  ["Fase 1 · Essência", "Marketing Pessoal", "afMarketingPessoal", "/afplataforma/marketing-pessoal/"],
  ["Fase 1 · Essência", "Branding Pessoal", "afBrandingPessoal", "/afplataforma/branding-pessoal/"],
  ["Fase 1 · Essência", "Liderança", "afLideranca", "/afplataforma/lideranca/"],
  ["Fase 1 · Essência", "Comunicação", "afComunicacao", "/afplataforma/comunicacao/"],
  ["Fase 1 · Essência", "Authority & Leadership", "afAuthorityLeadership", "/afplataforma/authority-leadership-os/"],
  ["Fase 1 · Essência", "Constelação Familiar", "afConstelacaoFamiliar", "/afplataforma/constelacao-familiar/"],
  ["Fase 1 · Essência", "Registros Akáshicos", "afRegistrosAkashicos", "/afplataforma/registros-akashicos/"],
  ["Fase 2 · Império", "SDR OS", "afSdrOs", "/afplataforma/sdr-os/"],
  ["Fase 2 · Império", "IA Studio", "afIaStudio", "/afplataforma/ia-studio/"],
  ["Fase 2 · Império", "App Builder", "afAppBuilder", "/afplataforma/app-builder/"],
  ["Fase 2 · Império", "Funil Builder", "afFunilBuilder", "/afplataforma/funil-builder/"],
  ["Fase 2 · Império", "Website Studio", "afWebsiteStudio", "/afplataforma/website-studio/"],
  ["Fase 2 · Império", "CRM Inteligente", "afCrmInteligente", "/afplataforma/crm-inteligente/"],
  ["Fase 2 · Império", "Produtos Digitais", "afProdutosDigitais", "/afplataforma/produtos-digitais/"],
  ["Fase 2 · Império", "Central de Ativos", "afCentralAtivos", "/afplataforma/central-de-ativos/"],
  ["Fase 3 · Financeiro", "Precificação", "afPrecificacao", "/afplataforma/precificacao/"],
  ["Fase 3 · Financeiro", "Fluxo de Caixa", "afFluxoDeCaixa", "/afplataforma/fluxo-de-caixa/"],
  ["Fase 3 · Financeiro", "Indicadores Financeiros", "afIndicadoresFinanceiros", "/afplataforma/indicadores-financeiros/"],
  ["Fase 3 · Financeiro", "Metas Financeiras", "afMetasFinanceiras", "/afplataforma/metas-financeiras/"],
  ["Fase 3 · Financeiro", "Planejamento Financeiro", "afPlanejamentoFinanceiro", "/afplataforma/planejamento-financeiro/"],
  ["Fase 3 · Financeiro", "Decisões Comerciais", "afDecisoesComerciais", "/afplataforma/decisoes-comerciais/"],
  ["Fase 3 · Financeiro", "Sustentabilidade das Ofertas", "afSustentabilidadeOfertas", "/afplataforma/sustentabilidade-ofertas/"],
  ["Fase 3 · Financeiro", "Acompanhamento de Resultados", "afAcompanhamentoResultados", "/afplataforma/acompanhamento-resultados/"],
  ["Fase 4 · Expansão", "Responsabilidades", "afResponsabilidades", "/afplataforma/responsabilidades/"],
  ["Fase 4 · Expansão", "Padronização", "afPadronizacao", "/afplataforma/padronizacao/"],
  ["Fase 4 · Expansão", "Documentação", "afDocumentacao", "/afplataforma/documentacao/"],
  ["Fase 4 · Expansão", "Divulgação", "afDivulgacao", "/afplataforma/divulgacao/"],
  ["Fase 4 · Expansão", "Processos Operacionais", "afProcessosOperacionais", "/afplataforma/processos-operacionais/"],
  ["Fase 4 · Expansão", "Fluxos de Trabalho", "afFluxosTrabalho", "/afplataforma/fluxos-trabalho/"],
  ["Fase 4 · Expansão", "Dependências do Fundador", "afDependenciasFundador", "/afplataforma/dependencias-fundador/"],
  ["Fase 4 · Expansão", "Acompanhamento da Operação", "afAcompanhamentoOperacao", "/afplataforma/acompanhamento-operacao/"],
  ["Fase 5 · Legado", "Comunidade", "afComunidade", "/afplataforma/comunidade/"],
  ["Fase 5 · Legado", "Continuidade", "afContinuidade", "/afplataforma/continuidade/"],
  ["Fase 5 · Legado", "Preservação", "afPreservacao", "/afplataforma/preservacao/"],
  ["Fase 5 · Legado", "Princípios do Ecossistema", "afPrincipiosEcossistema", "/afplataforma/principios-ecossistema/"],
  ["Fase 5 · Legado", "Evolução da Comunidade", "afEvolucaoComunidade", "/afplataforma/evolucao-comunidade/"],
  ["Fase 5 · Legado", "Relacionamento de Longo Prazo", "afRelacionamentoLongoPrazo", "/afplataforma/relacionamento-longo-prazo/"],
  ["Fase 5 · Legado", "Transmissão da Metodologia", "afTransmissaoMetodologia", "/afplataforma/transmissao-metodologia/"],
  ["Fase 5 · Legado", "Legado sem o Fundador", "afLegadoSemFundador", "/afplataforma/legado-sem-fundador/"]
].map(([phase, title, col, href]) => ({ phase, title, col, href }));

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

function person() {
  return subjectOf({
    sessionUid: session.uid,
    mentor: isMentorSession(),
    context: activeHubContext()
  });
}

export function renderHubDossie() {
  const who = person();
  if (!who) return `<div class="view active"><p class="empty">Entre para ver o que já foi salvo.</p></div>`;
  const looking = who.own ? "as suas respostas" : `as respostas de ${esc(who.name)}`;
  return `<div class="view active" id="hubDossieRoot">
    <p class="hero-line">Leitura · nada é copiado para outro lugar</p>
    <h2 class="hero-title">${who.own ? "Meu dossiê" : "Dossiê de " + esc(who.name)}</h2>
    <p class="hero-sub">Aqui aparecem ${looking}. O que está salvo continua na ferramenta. Esta tela não altera nada.</p>
    <p style="display:flex;flex-wrap:wrap;gap:8px">
      <button class="tool-btn" type="button" id="hubDossieCopy">Copiar o que foi lido</button>
    </p>
    <p class="notes-hint" id="hubDossieStatus">Lendo as ferramentas…</p>
    <div id="hubDossieList"></div>
  </div>`;
}

async function readTool(tool, uid) {
  try {
    const snap = await getDoc(doc(db, tool.col, uid));
    if (!snap.exists()) return { ...tool, status: "vazio", fields: [] };
    const fields = readableFields(snap.data());
    const sourceScope = tool.phase.startsWith("Fase 1") ? "personal" : tool.phase.startsWith("Fase 3") || tool.phase.startsWith("Fase 5") ? "hybrid" : "business";
    return { ...tool, sourceScope, status: fields.length ? "cheio" : "vazio", fields };
  } catch (error) {
    const denied = error && (error.code === "permission-denied" || String(error.message || "").includes("permission"));
    return { ...tool, status: denied ? "bloqueado" : "erro", fields: [] };
  }
}


function dossierTextFields(value, prefix="", depth=0) {
  const fields=[];
  if(!value||typeof value!=="object"||depth>2)return fields;
  for(const [key,item] of Object.entries(value)){
    if(["id","ownerUid","schemaVersion","updatedAt","archivedAt","status"].includes(key))continue;
    const label=(prefix?prefix+" · ":"")+key.replace(/([A-Z])/g," $1").replaceAll("_"," ");
    if(typeof item==="string"&&item.trim())fields.push({key:label,text:item.trim()});
    else if(Array.isArray(item)){
      const text=item.filter(x=>typeof x==="string"&&x.trim()).join(", ");
      if(text)fields.push({key:label,text});
    } else if(item&&typeof item==="object")fields.push(...dossierTextFields(item,label,depth+1));
  }
  return fields;
}

async function readParticipantDossier(uid) {
  try {
    const snap=await getDoc(doc(db,"users",uid));
    const data=snap.exists()?snap.data()?.afDossier:null;
    if(!data)return [];
    const blocks=[];
    const personalFields=dossierTextFields(data.personal,"Perfil pessoal");
    if(personalFields.length)blocks.push({phase:"Perfil 360° · Pessoal",title:"Identidade do empreendedor",sourceScope:"personal",href:"/afplataforma/?view=cadastro-inteligente",status:"cheio",fields:personalFields});
    for(const business of Array.isArray(data.businesses)?data.businesses:[]){
      if(business.archivedAt)continue;
      const fields=dossierTextFields(business,"Empresa · "+(business.name||"Negócio sem nome"));
      if(fields.length)blocks.push({phase:"Perfil 360° · Empresarial",title:business.name||"Negócio sem nome",sourceScope:"business",href:"/afplataforma/?view=cadastro-inteligente",status:"cheio",fields});
    }
    for(const project of Array.isArray(data.projects)?data.projects:[]){
      if(project.archivedAt)continue;
      const fields=dossierTextFields(project,"Projeto · "+(project.name||"Projeto sem nome"));
      if(fields.length)blocks.push({phase:"Perfil 360° · Projeto",title:project.name||"Projeto sem nome",sourceScope:"project",href:"/afplataforma/?view=cadastro-inteligente",status:"cheio",fields});
    }
    return blocks;
  } catch(error) {
    const denied=error&&(error.code==="permission-denied"||String(error.message||"").includes("permission"));
    return [{phase:"Perfil 360°",title:"Cadastro Inteligente",sourceScope:"hybrid",href:"/afplataforma/?view=cadastro-inteligente",status:denied?"bloqueado":"erro",fields:[]}];
  }
}

function card(block) {
  const label = block.status === "cheio"
    ? `${block.fields.length} resposta${block.fields.length === 1 ? "" : "s"}`
    : block.status === "vazio" ? "Nada preenchido"
    : block.status === "bloqueado" ? "Ainda não dá para ler daqui"
    : "Não foi possível ler agora";
  const body = block.fields.slice(0, 4).map((field) =>
    `<p style="margin:8px 0 0"><strong>${esc(field.key)}</strong><br>${esc(field.text.slice(0, 280))}</p>`
  ).join("");
  return `<article class="mat-card" style="margin:0 0 10px;padding:14px">
    <p class="hero-line">${esc(block.phase)}</p>
    <h3 style="margin:4px 0">${esc(block.title)}</h3>
    <p class="notes-hint">${label}</p>
    ${body}
    <p style="margin-top:10px"><a class="tool-btn" href="${esc(block.href)}">Abrir a ferramenta</a></p>
  </article>`;
}

export async function bindHubDossie() {
  const root = document.getElementById("hubDossieRoot");
  if (!root) return;
  if (isMentorSession()) {
    try { await loadAuthorizedMentees(); } catch { /* a leitura segue com o próprio UID se a lista falhar */ }
  }
  const who = person();
  const list = document.getElementById("hubDossieList");
  const status = document.getElementById("hubDossieStatus");
  if (!who || !list) return;
  const blocks = await Promise.all(DOSSIE_TOOLS.map((tool) => readTool(tool, who.uid)));
  const filled = blocks.filter((block) => block.status === "cheio").length;
  if (status) status.textContent = `${filled} de ${blocks.length} ferramentas com resposta.`;
  const phases = [];
  for (const block of blocks) if (!phases.includes(block.phase)) phases.push(block.phase);
  list.innerHTML = phases.map((phase, index) => {
    const phaseBlocks = blocks.filter((block) => block.phase === phase);
    return `<section class="dossie-phase" style="margin:18px 0">
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin:0 0 10px">
        <h3 style="margin:0">${esc(phase)}</h3>
        <button class="tool-btn" type="button" data-dossie-phase="${index}">Copiar respostas desta fase</button>
      </div>
      ${phaseBlocks.map(card).join("")}
    </section>`;
  }).join("");
  async function copyBlocks(selectedBlocks, successMessage) {
    try {
      await navigator.clipboard.writeText(copyText(who.own ? "você" : who.name, selectedBlocks));
      if (status) status.textContent = successMessage;
    } catch {
      if (status) status.textContent = "Não consegui copiar daqui. Selecione o texto manualmente.";
    }
  }
  document.getElementById("hubDossieCopy")?.addEventListener("click", () => {
    copyBlocks(blocks, "Dossiê completo copiado. Pode colar na conversa.");
  });
  list.querySelectorAll("[data-dossie-phase]").forEach((button) => {
    button.addEventListener("click", () => {
      const phase = phases[Number(button.dataset.dossiePhase)];
      const phaseBlocks = blocks.filter((block) => block.phase === phase);
      copyBlocks(phaseBlocks, `${phase}: respostas copiadas. Pode colar na conversa.`);
    });
  });
}


/**
 * Retorna uma leitura do Dossiê para contextualizar prompts.
 * Reutiliza a mesma seleção autorizada e as mesmas ferramentas do Dossiê.
 * Não grava, não altera e não amplia permissões.
 */
export async function readHubDossieSnapshot() {
  if (isMentorSession()) {
    try { await loadAuthorizedMentees(); } catch { /* a leitura individual ainda pode ser exibida como falha */ }
  }
  const who = person();
  if (!who) return { ok: false, reason: "no-person", blocks: [] };
  const blocks = await Promise.all(DOSSIE_TOOLS.map((tool) => readTool(tool, who.uid)));
  return { ok: true, person: who.name, own: who.own, blocks };
}
