/**
 * Área Complementar + Lojinha
 * LifeOS removido da interface. Funções de hábitos/rotina/etc. permanecem.
 */
import { esc } from "./navigation.js";
import { MODULES } from "../../data/modules.js";
import {
  viewHabitos,
  viewMetas,
  viewRotina,
  viewMindZone,
  viewProdutividade,
  viewCoach,
  viewSono,
  WA
} from "./lifeos-layer.js";
import {
  pageHead,
  editImg,
  coverUrl,
  getExtraProducts,
  canEditCovers,
  pickNewProductImage,
  removeProduct,
  COVER_SLOTS
} from "./covers.js";
import { materialButton } from "./materials.js";
import { renderVideoFrame, getVideoUrl, setVideoUrl, parseVideo } from "./media.js";
import { canFeature, featureLockPlan, planLabel } from "./plans.js";
import { isMentorSession } from "./auth.js";

const COMP_APPS = [
  { id: "alimentacao", name: "Alimentação saudável", desc: "Base corporal alinhada aos 7 vetores." },
  { id: "constelacao", name: "Constelação familiar", desc: "6 etapas: investigação → segredo. Material paralelo." },
  { id: "dicionario", name: "Dicionário", desc: "Termos de finanças, marketing, startups e operação." },
  { id: "livros", name: "Livros dos 7 vetores", desc: "Bônus de membro — pedir cada um no WhatsApp." },
  { id: "audiolivros", name: "Áudiolivros autorizados", desc: "Slots para obras próprias, licenciadas ou domínio público." },
  { id: "treino", name: "Treino e exercícios", desc: "Máquinas + halteres · pirâmide · respiração." },
  { id: "yoga", name: "Yoga operacional", desc: "Slots prontos: 7 vetores, integrado, sol, lua, áudio." },
  { id: "meditacao", name: "Meditação guiada", desc: "Camada de áudio — arquivos entram depois." },
  { id: "etiqueta", name: "Etiqueta", desc: "Presença, mesa, call e networking." },
  { id: "habitos", name: "Hábitos", desc: "Consistência que transforma." },
  { id: "rotina", name: "Rotina", desc: "Calendário e tarefas do dia." },
  { id: "metas", name: "Metas", desc: "Objetivos e resultados." },
  { id: "mindzone", name: "MindZone", desc: "Respiração · meditação · jogos de foco." },
  { id: "produtividade", name: "Produtividade", desc: "Foco, tempo e performance." },
  { id: "sono", name: "Modo sono", desc: "Depósitos + 7 frequências dos vetores." },
  { id: "coach", name: "AF Coach", desc: "IA Life Coach — desligada até você ativar." },
  { id: "anamnese", name: "Anamnese · Essência", desc: "Arquitetura de essência (HTML complementar)." },
  { id: "encontros", name: "Encontros da mentoria", desc: "26 encontros · página complementar." },
  { id: "loja", name: "Lojinha Akasha", desc: "Pedido: produto → cor → dados → WhatsApp." }
];

const DICT = [
  { t: "Bootstrapping", d: "Construir com capital próprio, sem rodada externa no início." },
  { t: "Cash-flow", d: "Fluxo de caixa: entradas menos saídas em um período." },
  { t: "Deal flow", d: "Fluxo de oportunidades de negócio ou investimento." },
  { t: "Lean Canvas", d: "Mapa de uma página do modelo de negócio para validação rápida." },
  { t: "MVP", d: "Produto mínimo viável — menor versão que testa a hipótese." },
  { t: "BATNA", d: "Melhor alternativa se a negociação falhar." },
  { t: "Runway", d: "Quanto tempo o caixa atual sustenta a operação." },
  { t: "LTV / CAC", d: "Valor do cliente no tempo versus custo de aquisição." },
  { t: "Pitch", d: "Narrativa curta do problema, solução e pedido." },
  { t: "Sunk cost", d: "Custo já irrecuperável — não deve guiar a próxima decisão sozinho." },
  { t: "Reserva de emergência", d: "3–6 meses de despesas essenciais em liquidez." },
  { t: "Pay yourself first", d: "Separar 10–20% da receita líquida antes do restante." },
  { t: "Unidade econômica", d: "Quanto sobra em cada venda depois dos custos variáveis." },
  { t: "Churn", d: "Taxa de clientes que deixam de pagar no período." },
  { t: "Ticket médio", d: "Receita ÷ número de transações." },
  { t: "Funil", d: "Etapas de atenção → interesse → decisão → compra." },
  { t: "High-ticket", d: "Oferta de valor alto com diagnóstico e acompanhamento." },
  { t: "Ascensão de Alinhamento", d: "Sessão anterior à mentoria completa de 90 dias." },
  { t: "7 vetores", d: "Camadas operacionais da mentoria AF (fundação → legado)." },
  { t: "Accountability", d: "Prestação de contas observável, não intenção." },
  { t: "Stewardship", d: "Governar recurso como administrador, não dono absoluto." },
  { t: "Lealdade invisível", d: "Contrato inconsciente com o destino familiar que trava ativo." },
  { t: "Ordem do pertencimento", d: "Ninguém do sistema pode ser excluído sem custo no fluxo." },
  { t: "Equilíbrio dar-tomar", d: "Troca justa — cobrar de menos ou receber de mais desequilibra." },
  { t: "PSI / ADP / POC", d: "Estruturas de pitch: problema-solução-impacto; atenção-desejo-prova; prova-oferta-chamada." },
  { t: "Mínimo viável diário", d: "A menor ação que, se feita hoje, mantém o sistema vivo." },
  { t: "Reciprocidade estratégica", d: "Entregar valor real sem comprar afeto." },
  { t: "Roadmap reverso", d: "Partir do futuro desejado e voltar aos próximos 90 dias." }
];

const LIVROS = [
  { id: "raiz", name: "A Raiz da Riqueza", vetor: "01 Base", archetype: "Guardião da Base · Muladhara", pdf: "assets/materials/livros/01-raiz.pdf" },
  { id: "criativo", name: "A Criatividade Lucrativa", vetor: "02 Criativo", archetype: "Criador · Svadhisthana", pdf: "assets/materials/livros/02-criatividade.pdf" },
  { id: "poder", name: "O Poder da Prosperidade", vetor: "03 Execução", archetype: "Executor · Manipura", pdf: "assets/materials/livros/03-poder.pdf" },
  { id: "amor", name: "Amor pelo Sucesso Financeiro", vetor: "04 Relacional", archetype: "Tecelão da Rede · Anahata", pdf: "assets/materials/livros/04-amor.pdf" },
  { id: "voz", name: "A Voz da Abundância", vetor: "05 Comunicação", archetype: "Mensageiro · Vishuddha", pdf: "assets/materials/livros/05-voz.pdf" },
  { id: "visao", name: "A Visão da Fortuna", vetor: "06 Visão", archetype: "Visionário · Ajna", pdf: "assets/materials/livros/06-visao.pdf" },
  { id: "conexao", name: "A Conexão Divina com a Opulência", vetor: "07 Governança", archetype: "Guardião do Legado · Sahasrara", pdf: "assets/materials/livros/07-conexao.pdf" }
];

const LOJA = [
  { id: "top", name: "Top macramê", price: "Sob consulta", kind: "top", note: "3 cores", img: "assets/img/loja/top-creme.jpg" },
  { id: "colar", name: "Colar", price: "Peça única", kind: "unica", note: "Assinatura", img: "assets/img/loja/colar.jpg" },
  { id: "caneta", name: "Caneta de grife", price: "Peça única", kind: "unica", note: "Escrita e presença", img: "assets/img/loja/caneta.jpg" },
  { id: "gravata", name: "Gravata", price: "Peça única", kind: "unica", note: "Autoridade visual", img: "assets/img/loja/gravata.jpg" },
  { id: "joia", name: "Joias", price: "Peça única", kind: "unica", note: "Detalhe high-ticket", img: "assets/img/loja/joia.jpg" }
];

const TOP_COLORS = [
  { id: "amarelo", label: "Amarelo", img: "assets/img/loja/top-amarelo.jpg" },
  { id: "cru", label: "Cru", img: "assets/img/loja/top-creme.jpg" },
  { id: "bege", label: "Bege", img: "assets/img/loja/top-mostarda.jpg" }
];

export function renderComplementarHome() {
  const apps = COMP_APPS.slice();
  if (canEditCovers()) apps.push({ id: "imagens", name: "Imagens da plataforma", desc: "Só mentor: trocar capas e fotos." });
  return `<div class="view active">
    ${pageHead("complementar", "Complementar", "Camada paralela", "Alimentação, constelação, livros, corpo, yoga e loja — no mesmo ecossistema AF.")}
    <div class="mat-grid">
      ${apps.map((a) => cardForApp(a)).join("")}
    </div>
    <article class="q-feature" data-nav="quitei">
      <p class="hero-line">Ferramenta</p>
      <h3>Quitei</h3>
      <p>Estratégia de quitação nativa — avalanche ou bola de neve — com plano, pagamentos e previsão. Abaixo da camada complementar, com o mesmo peso da operação.</p>
      <button class="tool-btn" type="button" data-nav="quitei">Abrir Quitei</button>
    </article>
  </div>`;
}

function cardForApp(a) {
  const open = canFeature(a.id);
  if (open) {
    return `<div class="mat-card">
        <h4>${esc(a.name)}</h4>
        <p>${esc(a.desc)}</p>
        <button class="tool-btn" type="button" data-nav="comp:${a.id}">Abrir</button>
      </div>`;
  }
  const need = planLabel(featureLockPlan(a.id));
  return `<div class="mat-card is-locked">
        <h4>${esc(a.name)}</h4>
        <p>${esc(a.desc)}</p>
        <p class="lock-note">🔒 ${esc(need)} — existe no método; o seu plano não abre esta porta.</p>
        <button class="tool-btn" type="button" data-act="afUpgrade" data-upgrade="${a.id}">Conhecer o ${esc(need)}</button>
      </div>`;
}

function viewLockedFeature(id) {
  const need = planLabel(featureLockPlan(id));
  return `<div class="view active">${back()}
    ${pageHead(id, "Recurso", "🔒 " + need, "O método dos 7 módulos continua inteiro. Esta porta é extra.")}
    <div class="mat-card">
      <h4>Não é o método pela metade</h4>
      <p>Os 7 módulos e o Quitei já são seus. Este recurso entra no ${esc(need)}. O mentor pode liberar só ele, sem mudar o plano.</p>
      <button class="tool-btn" type="button" data-act="afUpgrade" data-upgrade="${esc(id)}">Falar no WhatsApp</button>
    </div>
  </div>`;
}

export function renderComplementarApp(id) {
  if (id !== "imagens" && !canFeature(id)) return viewLockedFeature(id);
  const map = {
    alimentacao: viewAlimentacao,
    constelacao: viewConstelacao,
    dicionario: viewDicionario,
    livros: viewLivros,
    audiolivros: viewAudiolivros,
    treino: viewTreino,
    yoga: viewYoga,
    imagens: viewImagens,
    meditacao: viewMeditacao,
    etiqueta: viewEtiqueta,
    habitos: viewHabitos,
    rotina: viewRotina,
    metas: viewMetas,
    mindzone: viewMindZone,
    produtividade: viewProdutividade,
    sono: viewSono,
    coach: viewCoach,
    anamnese: viewAnamnese,
    encontros: viewEncontros,
    loja: viewLoja
  };
  return (map[id] || renderComplementarHome)();
}

function back() {
  return `<div class="back-link" data-nav="complementar">← Complementar</div>`;
}

function viewAlimentacao() {
  const vetores = [
    { n: "01", t: "Estabilidade", d: "Refeições regulares. Proteína e hidratação antes de decisões pesadas." },
    { n: "02", t: "Variedade", d: "Cores e texturas — mente aberta sem caos de excesso." },
    { n: "03", t: "Combustível", d: "Evitar pico de açúcar antes de blocos de foco." },
    { n: "04", t: "Mesa", d: "Uma refeição consciente por semana com alguém de valor." },
    { n: "05", t: "Voz", d: "Hidratação e menos irritantes antes de pitch/call." },
    { n: "06", t: "Planejar", d: "Lista de compras = roadmap semanal do corpo." },
    { n: "07", t: "Ritmo", d: "Sono e limite de cafeína como política, não humor." }
  ];
  return `<div class="view active">${back()}
    ${pageHead("alimentacao", "Complementar", "Alimentação saudável", "Mesma lógica dos 7 vetores — corpo como infraestrutura de performance.")}
    <div class="cover-list">${vetores
      .map(
        (v) => `<article class="cover-row">
      ${editImg("ali-" + v.n, v.t, "cover-thumb")}
      <div class="mod-num">${v.n}</div>
      <div class="mod-body"><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p></div>
    </article>`
      )
      .join("")}</div>
  </div>`;
}

function viewConstelacao() {
  const etapas = [
    { n: "1", t: "Investigação", d: "Diagnóstico sistêmico: o bloqueio é proporcional à vida atual ou é herança? Árvore financeira, perguntas de sondagem, corpo diante das figuras parentais." },
    { n: "2", t: "Resolução", d: "Honrar o sistema sem repetir o sofrimento. O bloqueio deixa de ser fraqueza pessoal e vira lealdade que se escolhe soltar." },
    { n: "3", t: "Solução", d: "Tomar o lugar de adulto que recebe e dá. Aceitar o que os pais puderam dar. Limites com quem drena. Cobrar o justo." },
    { n: "4", t: "Revisão", d: "Monitorar retorno à lealdade: sabotagem após sucesso, culpa ao receber, justificar escassez." },
    { n: "5", t: "Reflexão complementar", d: "Carta (não enviada) à geração que mais sofreu. Prosperar é realizar o desejo da linhagem, não traí-la." },
    { n: "6", t: "Segredo", d: "Nomear o oculto (falência, exclusão, dívida). Reintegrar o excluído. Discrição absoluta." }
  ];
  const ordens = [
    { t: "Pertencimento", d: "Julgar ancestral pobre é se excluir do sistema de prosperidade." },
    { t: "Hierarquia", d: "Recusar receber dos pais bloqueia a entrada (fluxo)." },
    { t: "Dar–tomar", d: "Cobrar menos do que vale ou receber demais afasta o dinheiro." }
  ];
  const frases = [
    ["01", "Eu tomo o que vocês me deram. É o suficiente para começar. O resto eu construo."],
    ["02", "Eu vejo que vocês não puderam sonhar. Eu sonho por vocês."],
    ["03", "Eu tomo a vida que vocês me deram. Agora eu assumo a responsabilidade."],
    ["04", "Eu dou o que posso. Eu recebo o que posso. O equilíbrio honra a todos."],
    ["05", "Eu tenho voz. Eu cobro o que é justo."],
    ["06", "Eu construo algo maior, que honra o passado."],
    ["07", "O dinheiro serve a vida. Eu governo com responsabilidade."]
  ];
  return `<div class="view active">${back()}
    ${pageHead("constelacao", "Chave mestra", "Constelação familiar", "Camada paralela aos 7 módulos. O mentor não se torna terapeuta clínico — engenheiro de performance sistêmica.")}
    <div class="mat-card" style="margin-bottom:16px">
      <h4>Material do módulo</h4>
      <p>Ciclo de 6 etapas, ordens do dinheiro e frases de força — documento completo, sem cortes.</p>
      ${materialButton("Constelação familiar · Chave mestra", "assets/materials/constelacao-chave-mestra.pdf")}
    </div>
    <div class="stat-card" style="margin-bottom:16px">
      <div class="lbl">Metáfora operacional</div>
      <div class="hint" style="margin-top:8px;line-height:1.7">Mãe = dinheiro (receber, fluxo). Pai = riqueza (construir, patrimônio). Rejeitar a figura é rejeitar o fluxo correspondente.</div>
    </div>
    <h3 class="section-h">3 ordens aplicadas ao dinheiro</h3>
    <div class="mat-grid">${ordens.map((o) => `<div class="mat-card"><h4>${esc(o.t)}</h4><p>${esc(o.d)}</p></div>`).join("")}</div>
    <h3 class="section-h">Ciclo de 6 etapas</h3>
    <div class="module-list">${etapas
      .map(
        (e) => `<div class="mod-row full">
      <div class="mod-num">${e.n}</div>
      <div class="mod-body"><h3>${esc(e.t)}</h3><p>${esc(e.d)}</p></div>
    </div>`
      )
      .join("")}</div>
    <h3 class="section-h">Frases de força por módulo</h3>
    <div class="mat-grid">${frases
      .map(([n, f]) => `<div class="mat-card"><h4>Módulo ${n}</h4><p>${esc(f)}</p></div>`)
      .join("")}</div>
    <button class="tool-btn" type="button" data-nav="call">Ir para Call</button>
  </div>`;
}

function viewDicionario() {
  return `<div class="view active">${back()}
    ${pageHead("dicionario", "Referência", "Dicionário", DICT.length + " termos · finanças · marketing · operação · sistêmico")}
    <div class="mat-card" style="margin-bottom:16px">
      <h4>Mini dicionário (PDF)</h4>
      <p>Versão completa para leitura e consulta durante os módulos.</p>
      ${materialButton("Mini dicionário de startups", "assets/materials/dicionario-startups.pdf")}
    </div>
    <div class="mat-grid">${DICT.map((x) => `<div class="mat-card"><h4>${esc(x.t)}</h4><p>${esc(x.d)}</p></div>`).join("")}</div>
  </div>`;
}

function viewLivros() {
  return `<div class="view active">${back()}
    ${pageHead("livros", "Bônus de membro", "Livros dos 7 vetores", "Edição oficial atual. Leitura na plataforma. Última página: marca do autor + ação de 7 dias.")}
    <div class="mat-grid">${LIVROS.map(
      (l, i) => `<div class="mat-card"><h4>${esc(l.name)}</h4><p>${esc(l.vetor)}</p><p>${esc(l.archetype)}</p>
      <p class="notes-hint">${esc(MODULES[i]?.cena || "")}</p>
      ${materialButton(l.name, l.pdf)}
      <button class="tool-btn" type="button" data-act="afPedirLivro" data-livro="${esc(l.name)}">Pedir no WhatsApp</button></div>`
    ).join("")}</div>
  </div>`;
}

function viewAudiolivros() {
  const slots = [
    { id: "audio-vetor-01", name: "Vetor 01 · Base", hint: "Obra autorizada ligada à fundação." },
    { id: "audio-vetor-02", name: "Vetor 02 · Criativo", hint: "Obra autorizada ligada à ideação." },
    { id: "audio-vetor-03", name: "Vetor 03 · Execução", hint: "Obra autorizada ligada ao ritmo." },
    { id: "audio-vetor-04", name: "Vetor 04 · Relacional", hint: "Obra autorizada ligada à rede." },
    { id: "audio-vetor-05", name: "Vetor 05 · Voz", hint: "Obra autorizada ligada à expressão." },
    { id: "audio-vetor-06", name: "Vetor 06 · Visão", hint: "Obra autorizada ligada ao horizonte." },
    { id: "audio-vetor-07", name: "Vetor 07 · Legado", hint: "Obra autorizada ligada à governança." },
    { id: "audio-extra-1", name: "Extra autorizado 1", hint: "Domínio público, próprio ou licenciado." },
    { id: "audio-extra-2", name: "Extra autorizado 2", hint: "Domínio público, próprio ou licenciado." }
  ];
  const mentor = isMentorSession();
  const cards = slots.map((s) => {
    const url = getVideoUrl(s.id);
    const parsed = parseVideo(url);
    let player = `<p class="notes-hint">Slot vazio. O mentor cola um link autorizado.</p>`;
    if (parsed.kind === "youtube") {
      player = `<div class="media-frame"><iframe src="${esc(parsed.embed)}" allow="autoplay; encrypted-media" allowfullscreen title="${esc(s.name)}"></iframe></div>`;
    } else if (url) {
      player = `<audio controls preload="none" src="${esc(url)}" style="width:100%"></audio>`;
    }
    const edit = mentor
      ? `<div class="field"><label>URL autorizada (mp3, Cloudinary ou YouTube)</label>
           <input data-audio-slot="${esc(s.id)}" value="${esc(url)}" placeholder="https://…"></div>
         <button class="tool-btn" type="button" data-act="afSaveAudioSlot" data-slot="${esc(s.id)}">Salvar slot</button>`
      : "";
    return `<div class="mat-card"><h4>${esc(s.name)}</h4><p>${esc(s.hint)}</p>${player}${edit}</div>`;
  }).join("");
  return `<div class="view active">${back()}
    ${pageHead("audiolivros", "Complementar", "Áudiolivros autorizados", "Só o que você tem direito de hospedar. Obra de terceiros sem licença não entra aqui.")}
    <div class="mat-card" style="margin-bottom:16px">
      <h4>Regra</h4>
      <p>Não use esta aba para Deepak Chopra ou qualquer título protegido sem autorização. O roteiro pode <em>citar</em> o livro. A plataforma só toca arquivo próprio, licenciado ou de domínio público.</p>
    </div>
    <div class="mat-grid">${cards}</div>
  </div>`;
}

window.afSaveAudio = async (slot, url) => {
  await setVideoUrl(slot, url);
};

window.afSaveAudioSlot = async (el) => {
  const slot = el.dataset.slot;
  const inp = document.querySelector(`[data-audio-slot="${slot}"]`);
  await setVideoUrl(slot, inp?.value || "");
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = "Slot salvo.";
    toast.className = "toast show";
  }
};

window.afUpgrade = (el) => {
  const id = el.dataset.upgrade || "premium";
  const need = planLabel(featureLockPlan(id));
  const txt = encodeURIComponent(`Olá, estou na AF Plataforma e quero conhecer o plano ${need} (recurso: ${id}).`);
  window.open(`https://wa.me/${WA}?text=${txt}`, "_blank");
};

window.afPedirLivro = (el) => {
  const livro = el.dataset.livro || "livro da coletânea";
  const txt = encodeURIComponent(
    `Olá, sou membro da AF Plataforma e quero o PDF bônus: ${livro}.`
  );
  window.open(`https://wa.me/${WA}?text=${txt}`, "_blank");
};

function viewTreino() {
  const CH = [
    { n: "01", nome: "Muladhara · Base", cor: "#8B1E1E" },
    { n: "02", nome: "Svadhishthana · Sacral", cor: "#C45A12" },
    { n: "03", nome: "Manipura · Plexo solar", cor: "#C9A227" },
    { n: "04", nome: "Anahata · Cardíaco", cor: "#2D6A4F" },
    { n: "05", nome: "Vishuddha · Laríngeo", cor: "#2B5F8A" },
    { n: "06", nome: "Ajna · Frontal", cor: "#3D3A8A" },
    { n: "07", nome: "Sahasrara · Coronário", cor: "#6B3FA0" }
  ];
  const card = (kind, i) => {
    const c = CH[i];
    const id = kind === "maq" ? `maq-0${i + 1}` : `halter-0${i + 1}`;
    return `<article class="treino-card">
      ${editImg(id, c.nome, "treino-photo")}
      <div class="treino-meta">
        <span class="treino-chip" style="--chip:${c.cor}">${c.n}</span>
        <h4>${esc(c.nome)}</h4>
        <p>7 exercícios · ${kind === "maq" ? "máquinas" : "halteres e peso do corpo"}</p>
      </div>
      ${renderVideoFrame(id, { caption: "Série guiada" })}
    </article>`;
  };
  return `<div class="view active">${back()}
    ${pageHead("treino", "Corpo a serviço da execução", "Treino e exercícios", "Duas coleções iguais: 7 treinos de máquina (um por vetor) e 7 treinos de halteres (um por vetor).")}
    <div class="treino-proto">
      <div>
        <strong>Pirâmide</strong>
        <p>1ª 12 reps · 2ª 10 reps (+ carga) · 3ª 8 reps (+ carga)</p>
      </div>
      <div>
        <strong>Respiração · 2 ciclos / repetição</strong>
        <p>inspira → força expirando → inspira no fim → retorna expirando.</p>
      </div>
      <div>
        <strong>Progressão</strong>
        <p>Sobe carga só se amplitude e controle permanecerem. Tremeu? Mantém ou reduz.</p>
      </div>
    </div>
    <div class="treino-block-head">
      ${editImg("treino-maq", "Máquinas", "treino-band")}
      <div>
        <h3 class="section-h">Treino nas máquinas</h3>
        <p class="hero-sub" style="margin:0">Smart Fit / Bluefit · 1 imagem = 1 vetor = 7 exercícios</p>
      </div>
    </div>
    <div class="treino-grid">${CH.map((_, i) => card("maq", i)).join("")}</div>
    <div class="treino-block-head">
      ${editImg("treino-halter", "Halteres", "treino-band")}
      <div>
        <h3 class="section-h">Treino com halteres</h3>
        <p class="hero-sub" style="margin:0">Livres e peso do corpo · mesmo template das máquinas</p>
      </div>
    </div>
    <div class="treino-grid">${CH.map((_, i) => card("halter", i)).join("")}</div>
  </div>`;
}

function viewYoga() {
  const slots = [
    { n: "01", t: "Série 1 · vetor base", id: "yoga-01" },
    { n: "02", t: "Série 2 · vetor criativo", id: "yoga-02" },
    { n: "03", t: "Série 3 · vetor execução", id: "yoga-03" },
    { n: "04", t: "Série 4 · vetor relacional", id: "yoga-04" },
    { n: "05", t: "Série 5 · vetor comunicação", id: "yoga-05" },
    { n: "06", t: "Série 6 · vetor visão", id: "yoga-06" },
    { n: "07", t: "Série 7 · vetor governança", id: "yoga-07" },
    { n: "08", t: "Série integração", id: "yoga-08" },
    { n: "09", t: "Saudação ao sol", id: "yoga-09" },
    { n: "10", t: "Saudação à lua", id: "yoga-10" }
  ];
  return `<div class="view active">${back()}
    ${pageHead("yoga", "Corpo e presença", "Yoga operacional", "Cada série tem imagem + vídeo guiado. O mentor cola o link (YouTube ou Cloudinary) no próprio cartão.")}
    <div class="yoga-grid">${slots
      .map(
        (s) => `<article class="yoga-card">
      ${editImg(s.id, s.t, "cover-thumb")}
      <div class="mod-num">${s.n}</div>
      <h3>${esc(s.t)}</h3>
      ${renderVideoFrame(s.id, { caption: s.t })}
    </article>`
      )
      .join("")}</div>
    <p class="notes-hint">Música: 396–963 Hz + batida baixa. Arquivos em assets/audio/yoga/.</p>
  </div>`;
}

function viewMeditacao() {
  const tracks = [
    "01-base-396.mp3",
    "02-criativo-417.mp3",
    "03-execucao-528.mp3",
    "04-relacional-639.mp3",
    "05-voz-741.mp3",
    "06-visao-852.mp3",
    "07-governanca-963.mp3"
  ];
  return `<div class="view active">${back()}
    <p class="hero-line">Camada de áudio</p>
    <h2 class="hero-title">Meditação guiada</h2>
    <p class="hero-sub">Players prontos. Quando você enviar os MP3, coloque em assets/audio/meditacao/ com estes nomes.</p>
    ${tracks
      .map(
        (f) => `<div class="mat-card" style="margin-bottom:8px"><h4>${esc(f)}</h4>
      <audio controls preload="none" src="assets/audio/meditacao/${f}"></audio></div>`
      )
      .join("")}
  </div>`;
}

function viewEtiqueta() {
  const cards = [
    { n: "01", title: "Base · Presença", do: "Chegue 5 min antes. Celular no silencioso.", dont: "Não entre na call com a casa em caos.", tip: "Estabilidade visual = percepção de valor." },
    { n: "02", title: "Criativo · Apresentação", do: "Uma peça de personalidade discreta.", dont: "Não use perfume forte em ambiente fechado.", tip: "Diferenciação sem gritar." },
    { n: "03", title: "Execução · Pontualidade", do: "Confirme horário no dia anterior.", dont: "Não “já estou chegando” repetidas vezes.", tip: "Tempo é a moeda que a etiqueta protege." },
    { n: "04", title: "Relacional · Mesa e acolhimento", do: "Cumprimente pelo nome. Escute o pedido completo.", dont: "Não interrompa para “já sei”.", tip: "Reciprocidade começa no turno de fala." },
    { n: "05", title: "Comunicação · Call e voz", do: "Olhe a câmera ao fechar o ponto.", dont: "Não diga “tá me ouvindo?” a cada frase.", tip: "Etiqueta de voz = parte do pitch." },
    { n: "06", title: "Visão · Ambiente e longo prazo", do: "Fundo neutro. Luz na frente do rosto.", dont: "Não deixe documento de cliente visível.", tip: "O cenário conta a governança." },
    { n: "07", title: "Governança · Legado de trato", do: "Agradeça por escrito. Cumpra o follow-up.", dont: "Não some depois do “vamos alinhar”.", tip: "Reputação é patrimônio composto." }
  ];
  return `<div class="view active">${back()}
    ${pageHead("etiqueta", "Complementar", "Etiqueta", "Presença, mesa, call e networking — 7 vetores.")}
    <div class="etiq-grid">${cards
      .map(
        (c) => `<div class="etiq-card">
        ${editImg("eti-" + c.n, c.title, "etiq-photo")}
        <div class="etiq-num">${c.n}</div>
        <h4>${esc(c.title)}</h4>
        <p class="etiq-do"><span>Fazer</span>${esc(c.do)}</p>
        <p class="etiq-dont"><span>Evitar</span>${esc(c.dont)}</p>
        <p class="etiq-tip">${esc(c.tip)}</p>
      </div>`
      )
      .join("")}</div>
  </div>`;
}

function viewAnamnese() {
  return `<div class="view active">${back()}
    <p class="hero-line">Arquitetura de essência</p>
    <h2 class="hero-title">Anamnese</h2>
    <p class="hero-sub">Formulário operacional da sessão de alinhamento. Salva neste aparelho (e no Firestore quando a sessão estiver em Firebase).</p>
    <p><a class="tool-btn" href="complementar/anamnese.html" target="_blank" rel="noopener">Abrir Anamnese completa</a></p>
  </div>`;
}

function viewEncontros() {
  return `<div class="view active">${back()}
    <p class="hero-line">Mentoria</p>
    <h2 class="hero-title">Encontros</h2>
    <p class="hero-sub">Página dos 26 encontros — anexa e independente, mesmo visual.</p>
    <p><a class="tool-btn" href="complementar/encontros.html" target="_blank" rel="noopener">Abrir Encontros</a></p>
  </div>`;
}

function viewLoja() {
  const extras = getExtraProducts();
  const all = LOJA.map((p) => ({
    ...p,
    img: coverUrl("loja-" + p.id) || p.img,
    coverId: "loja-" + p.id
  })).concat(extras);
  const mentorAdd = canEditCovers()
    ? `<div class="mat-card shop-card shop-add">
        <h4>Adicionar produto</h4>
        <p>Título + imagem. Só o mentor vê este cartão.</p>
        <button class="tool-btn" type="button" id="btnAddProd">Escolher foto e título</button>
      </div>`
    : "";
  return `<div class="view active">${back()}
    ${pageHead("loja", "Lógico", "Lojinha Akasha", "Fluxo: produto → cor (se Top) → nome, e-mail, CEP → WhatsApp (71) 98344-8621.")}
    <div class="mat-grid">${all.map((p) => `<div class="mat-card shop-card">
      ${p.coverId ? editImg(p.coverId, p.name, "shop-ph") : `<div class="img-slot shop-ph"><img src="${p.img}" alt="${esc(p.name)}"></div>`}
      <h4>${esc(p.name)}</h4>
      <p>${esc(p.price)}</p>
      <p class="notes-hint">${esc(p.note || "")}</p>
      ${
        p.kind === "top"
          ? `<div class="swatches">${TOP_COLORS.map(
              (c) => `<button type="button" class="swatch" data-act="afAbrirPedido" data-prod="Top macramê" data-cor="${c.label}">${esc(c.label)}</button>`
            ).join("")}</div>`
          : `<button class="tool-btn" type="button" data-act="afAbrirPedido" data-prod="${esc(p.name)}" data-cor="">Fazer pedido</button>`
      }
      ${p.id && String(p.id).startsWith("x") && canEditCovers()
        ? `<button class="link-rm" type="button" data-act="afRmProd" data-id="${p.id}">Remover</button>`
        : ""}
    </div>`).join("")}${mentorAdd}</div>
  </div>`;
}

function viewImagens() {
  if (!canEditCovers()) {
    return `<div class="view active">${back()}<p class="empty">Só o mentor edita imagens.</p></div>`;
  }
  return `<div class="view active">${back()}
    <p class="hero-line">Mentor</p>
    <h2 class="hero-title">Imagens da plataforma</h2>
    <p class="hero-sub">Toque em Trocar em qualquer capa. A foto fica neste aparelho até você publicar o arquivo no GitHub.</p>
    <div class="cover-admin">${COVER_SLOTS.map((s) => `
      <article class="cover-admin-card">
        ${editImg(s.id, s.label, "cover-admin-img")}
        <p>${esc(s.label)}</p>
      </article>`).join("")}</div>
  </div>`;
}

window.afRmProd = (el) => {
  removeProduct(el.dataset.id);
  document.dispatchEvent(new CustomEvent("af-covers-changed"));
};

window.afAbrirPedido = (el) => {
  const prod = el.dataset.prod || "";
  const cor = el.dataset.cor || "";
  const box = document.getElementById("modalBox");
  const overlay = document.getElementById("overlay");
  document.getElementById("modalTitle").textContent = "Pedido · " + prod;
  document.getElementById("modalBody").innerHTML = `
    <form id="pedidoForm">
      <input type="hidden" id="pProd" value="${esc(prod)}">
      <input type="hidden" id="pCor" value="${esc(cor)}">
      <p class="notes-hint">${cor ? "Cor: " + esc(cor) : "Peça única"}</p>
      <div class="field"><label>Nome</label><input id="pNome" required></div>
      <div class="field"><label>E-mail</label><input id="pEmail" type="email" required></div>
      <div class="field"><label>CEP</label><input id="pCep" required placeholder="00000-000"></div>
      <div class="field"><label>Qtd</label><input id="pQtd" type="number" min="1" value="1"></div>
    </form>`;
  document.getElementById("modalFoot").innerHTML = `<button class="btn btn-inline" type="button" id="btnSendPedido">Enviar ao WhatsApp</button>`;
  overlay?.classList.add("open");
  box?.classList.add("open");
  document.getElementById("btnSendPedido").onclick = () => window.afEnviarPedido();
};

window.afEnviarPedido = () => {
  const prod = document.getElementById("pProd")?.value || "";
  const cor = document.getElementById("pCor")?.value || "—";
  const nome = document.getElementById("pNome")?.value?.trim();
  const email = document.getElementById("pEmail")?.value?.trim();
  const cep = document.getElementById("pCep")?.value?.trim();
  const qtd = document.getElementById("pQtd")?.value || "1";
  if (!nome || !email || !cep) return;
  const msg = encodeURIComponent(
    `Pedido Lojinha Akasha%0AProduto: ${prod}%0ACor: ${cor}%0AQtd: ${qtd}%0ANome: ${nome}%0AE-mail: ${email}%0ACEP: ${cep}%0A%0A(Pagamento, endereço e frete fechamos aqui.)`
  );
  window.open(`https://wa.me/${WA}?text=${msg}`, "_blank");
};
