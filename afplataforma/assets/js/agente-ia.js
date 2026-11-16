import { auth } from "../../firebase/firebase-config.js";
import { session, isMentorSession } from "./auth.js";

const ENDPOINT = "https://jsonmxbuzagmwuucruem.supabase.co/functions/v1/agente-gemini";
const PUBLIC_KEY = "sb_publishable_cZOBLAGhZVoJ5w8aZxfHjQ_3zZbr-II";
const INVENTORY = [
  "01 Arquitetura de Essência: trajetória, identidade, competências e direção.",
  "02 Branding, Imagem e Comunicação: marca, imagem, narrativa, conteúdo e audiovisual.",
  "03 Império Digital e Tecnologia: sites, aplicativos, plataformas, sistemas e infraestrutura.",
  "04 Alinhamento Financeiro: organização financeira, gestão empresarial, precificação e educação sobre mercados.",
  "05 Marketing, Publicidade e Aquisição: posicionamento, campanhas, conteúdo, canais e geração de demanda.",
  "06 Comercial, Vendas e Negócios: oferta, prospecção, negociação, processos comerciais e parcerias.",
  "07 Estruturação Empresarial e Internacional: modelos de negócio, processos, governança e internacionalização.",
  "08 Gestão, Automação e Inteligência Artificial: processos, integrações, automações e agentes de IA.",
  "09 Educação, Conhecimento e Propriedade Intelectual: cursos, métodos, publicações e ativos de conhecimento.",
  "10 Expansão Patrimonial e Legado: ativos, expansão, governança, continuidade e sucessão."
];

export function renderAgenteIA() {
  if (!isMentorSession()) return "";
  return `
    <article class="q-feature livro-entry akasha-ai-card">
      <p class="hero-line">Inteligência executiva · uso interno</p>
      <h3>Agente de Inteligência Akasha</h3>
      <p>Analise o contexto do cliente, identifique oportunidades no Inventário Estratégico e receba recomendações iniciais para o próximo passo.</p>
      <label for="akashaAiContext" class="lbl">Contexto do cliente</label>
      <textarea id="akashaAiContext" rows="5" maxlength="10000" placeholder="Descreva o negócio, momento atual, objetivos, dificuldades, recursos disponíveis e informações relevantes do cliente. Não inclua senhas, documentos pessoais ou dados sensíveis desnecessários."></textarea>
      <div class="hint" style="margin:8px 0 14px">A análise considera os dez departamentos do Inventário Estratégico. Quanto melhor o contexto, mais úteis serão as recomendações.</div>
      <button class="tool-btn" id="akashaAiRun" type="button">Gerar diagnóstico com IA</button>
      <div id="akashaAiStatus" class="hint" role="status" aria-live="polite" style="margin-top:12px"></div>
      <section id="akashaAiResult" class="akasha-ai-result" hidden aria-live="polite"></section>
    </article>`;
}

export function bindAgenteIA() {
  if (!isMentorSession()) return;
  const button = document.getElementById("akashaAiRun");
  const field = document.getElementById("akashaAiContext");
  const status = document.getElementById("akashaAiStatus");
  const result = document.getElementById("akashaAiResult");
  if (!button || button.dataset.bound === "1") return;
  button.dataset.bound = "1";

  button.addEventListener("click", async () => {
    if (button.disabled) return;
    if (!auth.currentUser || session.mode !== "firebase") {
      status.textContent = "Entre com sua conta real de mentor. O modo de demonstração não libera chamadas de IA.";
      return;
    }
    const context = String(field?.value || "").trim();
    if (!context) {
      status.textContent = "Adicione o contexto do cliente antes de gerar o diagnóstico.";
      field?.focus();
      return;
    }
    const instruction = [
      "Você é o Agente de Inteligência Executiva Akasha Hub, assistente interno do mentor.",
      "Analise o contexto com pensamento estratégico e linguagem clara. Não invente fatos.",
      "Inventário Estratégico:", ...INVENTORY,
      "Entregue: 1) síntese do momento; 2) três capacidades prioritárias e justificativas; 3) oportunidades complementares; 4) plano de ação inicial em etapas; 5) informações que precisam ser confirmadas.",
      "Não prometa resultados nem presuma orçamento, capital disponível ou capacidade de investimento. Diferencie fatos de hipóteses. Atividades reguladas devem ser encaminhadas a profissionais habilitados.",
      "Cliente: " + String(session.name || "Não informado"),
      "Contexto fornecido pelo mentor:\n" + context
    ].join("\n\n");

    button.disabled = true;
    button.textContent = "Analisando...";
    status.textContent = "Consultando o agente de inteligência...";
    result.hidden = true;
    result.replaceChildren();
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": PUBLIC_KEY, "Authorization": "Bearer " + token },
        body: JSON.stringify({ instrucao: instruction })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.erro || "Não foi possível concluir a análise.");
      if (typeof payload?.resposta !== "string" || !payload.resposta.trim()) throw new Error("A IA não retornou uma resposta válida.");
      const pre = document.createElement("pre");
      pre.className = "akasha-ai-answer";
      pre.textContent = payload.resposta;
      result.replaceChildren(pre);
      result.hidden = false;
      status.textContent = "Diagnóstico concluído.";
    } catch (error) {
      status.textContent = error?.message || "Falha ao consultar o agente. Verifique sua conexão.";
    } finally {
      button.disabled = false;
      button.textContent = "Gerar diagnóstico com IA";
    }
  });
}
