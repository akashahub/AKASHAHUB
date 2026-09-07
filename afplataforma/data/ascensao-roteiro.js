/** Roteiro privado: Ascensão de Alinhamento. Só o mentor vê. */
export const ASCENSAO = {
  title: "Ascensão de Alinhamento",
  time: "1h30 · 1:1 · R$ 350 · gravada",
  principle:
    "Estado de espírito não conduz a call. O protocolo conduz. Você chega cansado, eufórico ou vazio: a ordem é a mesma."
};

export function renderAscensaoRoteiro() {
  return `
  <div class="view active af-asc">
    <div class="back-link" data-nav="mentor">← Gestão</div>
    <p class="hero-line">Roteiro privado · mentor</p>
    <h2 class="hero-title">Ascensão de Alinhamento</h2>
    <p class="hero-sub">1h30 · 1:1 · R$ 350 · gravada · mapa + dossiê. Mentorando não vê esta página.</p>

    <article class="af-asc-card gold">
      <p class="lvl">Regra de ouro</p>
      <p>Motivação não é método. Se a energia cair, volta para a próxima pergunta. Número. Padrão. Mapa. Uma ação de 7 dias. Porta da mentoria só se o diagnóstico pediu continuidade.</p>
      <p>O mapa mostra o território. A ação de 7 dias mostra o primeiro passo. Não diagnostica dez furos. Um.</p>
    </article>

    <h3 class="section-h">Antes de ligar a câmera</h3>
    <ol class="af-asc-ol">
      <li>Água. Banheiro. Celular no silencioso. Gravação pronta.</li>
      <li>Esta página aberta. Bloco do mapa no fim da tela. Relógio visível.</li>
      <li>Landing e WhatsApp à mão. Não abrir Instagram no meio.</li>
      <li>Frase de chão: “Hoje eu só faço o protocolo.”</li>
      <li>Se estiver mal: sessenta segundos de respiração. Depois entra. Não desmarca por humor.</li>
    </ol>

    <h3 class="section-h">Os 90 minutos</h3>

    <article class="af-asc-card"><p class="lvl">0–8 min · Porta</p>
      <p>Agradece. Confirma o tempo. Confirma a gravação. Diz, em uma linha:</p>
      <p><em>“Primeiro eu entendo como sua vida funciona: dinheiro, trabalho, rotina, saúde, projetos e pendências. Depois nomeio o ponto que trava o movimento agora. No fim você sai com um mapa e uma ação de 7 dias. Mentoria é outro assunto, só se fizer sentido.”</em></p>
      <p>Não promete transformação. Não aquece com história longa.</p>
    </article>

    <article class="af-asc-card"><p class="lvl">8–30 min · Extração</p>
      <p>Pergunta e anota no bloco do mapa. Não corrige no meio. Pula o que não existir na vida dela. O mapa se adapta à pessoa.</p>
      <ol>
        <li>Nome como quer ser chamada.</li>
        <li>O que está construindo agora.</li>
        <li>Onde o dinheiro trava. Quanto entra. Quanto sai. Reserva em meses. Dívida. Último valor que saiu sem decisão.</li>
        <li>Trabalho e renda: CLT, empresa, autônomo? De onde vem o dinheiro? O que mais poderia entrar?</li>
        <li>Rotina: como começa e termina o dia. Compromissos fixos. Onde o tempo some.</li>
        <li>Saúde prática: sono, corpo, consultas pendentes. Sem conselho médico.</li>
        <li>O que precisa estar verdadeiro em 7 dias, 90 dias, 1 ano.</li>
        <li>Projetos começados, parados, que merecem continuar.</li>
        <li>Pendências que ficam na cabeça.</li>
        <li>Compras e investimentos: urgente, necessário, desejável, futuro.</li>
        <li>Onde mora, trabalha, treina. Tempo e dinheiro no deslocamento. O que existe ao redor.</li>
        <li>Família e dinheiro: o que se repete.</li>
        <li>Para quem isso serve além dela.</li>
        <li>Conteúdo ou comunicação: só se ela já produz ou precisa aparecer.</li>
        <li>Fecha a extração: “O que está ocupando espaço na sua cabeça que eu ainda não perguntei?”</li>
      </ol>
      <p>Se divagar: “Me dá o número.” Se teatralizar: “Isso é o sentimento. Qual foi o último valor que saiu sem decisão?”</p>
    </article>

    <article class="af-asc-card"><p class="lvl">30–48 min · Mapa</p>
      <p>Classifica o que ouviu. Centro: NOME · MAPA DE ALINHAMENTO. Em volta só os vetores que existirem.</p>
      <p>Vetores possíveis: Rotina. Tempo. Financeiro. Trabalho e renda. Saúde. Objetivos. Projetos. Tarefas. Compras. Ambiente. Conteúdo. Família.</p>
      <p>Cada bolha leva ação, não slogan. Saúde não fica “cuidar da saúde”. Fica “consulta X neste mês. Treino 3x. Sono neste horário.”</p>
      <p>Empresário, CLT, mãe, criador: mapas diferentes. Não force bolha vazia.</p>
    </article>

    <article class="af-asc-card"><p class="lvl">48–60 min · Diagnóstico financeiro</p>
      <p>O mapa pode ter 40 linhas. Você nomeia um furo. O que segura o dinheiro agora.</p>
      <p><em>“O padrão que eu ouvi é X. O número que falta é Y. O gesto que sustenta isso é Z.”</em></p>
      <p>Espelha. Espera. Não consola. Não debate identidade.</p>
    </article>

    <article class="af-asc-card"><p class="lvl">60–72 min · Sistema simples</p>
      <p>Ensina a regra. Não cria dez aplicativos.</p>
      <p><strong>Tem hora → Agenda.</strong> Rotina, consulta, treino, recorrência.</p>
      <p><strong>Tem que fazer → Tarefas.</strong> Pendência com dono e prazo.</p>
      <p><strong>Precisa lembrar → Nota ou um grupo só dela no WhatsApp.</strong> Projeto, objetivo, ideia, trabalho.</p>
      <p><strong>Move dinheiro → Financeiro.</strong> Entrada, saída, reserva, dívida.</p>
      <p>Algumas pessoas rendem com um grupo por tema. Outras viram caos. Escolhe o mínimo para aquela vida.</p>
    </article>

    <article class="af-asc-card"><p class="lvl">72–78 min · Uma prioridade</p>
      <p>De tudo no mapa, um movimento para os próximos 7 dias. Observável. Amanhã de manhã já dá para ver.</p>
      <p>Pode abrir Quitei 3 minutos se o furo for dívida. Pode abrir cash-flow 3 minutos se o furo for vazamento. Não abre a plataforma inteira. Não dá aula dos 7 módulos.</p>
    </article>

    <article class="af-asc-card"><p class="lvl">78–88 min · Porta da mentoria</p>
      <p>Só abre se o diagnóstico pediu continuidade. Se não pediu: mapa + dossiê + sessão já paga. Sem pressão.</p>
      <p><em>“Esse mapa você executa sozinha. Não precisa de mentoria para usar. Se quiser a mesma arquitetura num só lugar, com caixa, módulos e acompanhamento, aí existe a plataforma e a mentoria de Alinhamento Financeiro.”</em></p>
      <p>Se pediu: “Três chaves. Essencial 3.900, 8 semanas. Premium 6.500, 12 semanas. VIP 13.000, 1:1. Os 7 módulos são os mesmos. Muda o acompanhamento. Você não escolhe agora se estiver nublada. Pensa. Me chama no WhatsApp.”</p>
      <p>Não fecha no susto. Não dá desconto por pena. Não mistura Flow.</p>
    </article>

    <article class="af-asc-card"><p class="lvl">88–90 min · Encerramento</p>
      <p>Repete a ação de 7 dias. Confirma envio do mapa e do dossiê no WhatsApp. Agradece. Encerra no horário.</p>
      <p><em>“O mapa é o território. Os 7 dias são o primeiro passo.”</em></p>
    </article>

    <h3 class="section-h">Como falar</h3>
    <ul class="af-asc-ul">
      <li>Frase curta. Uma ideia por vez.</li>
      <li>Número antes de opinião.</li>
      <li>Silêncio depois da pergunta.</li>
      <li>Voz baixa. Sem palco.</li>
      <li>Se irritar: volta na próxima pergunta.</li>
      <li>Se chorar: água, tempo, o mesmo ponto. Choro não cancela o número.</li>
    </ul>

    <h3 class="section-h">Pode fazer</h3>
    <ul class="af-asc-ul">
      <li>Preencher o bloco do mapa nesta página e copiar para o WhatsApp no fim.</li>
      <li>Gravar e mandar o recorte combinado.</li>
      <li>Dossiê no mesmo dia: padrão, número, ação de 7 dias, vetores do mapa.</li>
      <li>Abrir Quitei ou auditoria por 3 minutos se for o furo.</li>
      <li>Mandar a landing e o PDF público de precificação.</li>
      <li>Marcar retorno pago, se ela pedir.</li>
      <li>Encaminhar Bibliotheca R$ 97 se ainda não está pronta para mentoria.</li>
      <li>Encerrar 5 minutos mais cedo se o ponto já fechou.</li>
    </ul>

    <h3 class="section-h">Não fazer</h3>
    <ul class="af-asc-ul no">
      <li>Não virar terapia, constelação clínica ou confissão de 2 horas.</li>
      <li>Não vender mentoria por medo, tesão da call ou pena.</li>
      <li>Não inventar desconto para fechar hoje.</li>
      <li>Não misturar Flow, sessão antiga de R$ 700, Magnetismo ou livros como se fossem a mesma oferta.</li>
      <li>Não prometer renda, cura, relacionamento ou resultado garantido.</li>
      <li>Não mostrar teleprompter, gestão, Volume Zero nem este roteiro.</li>
      <li>Não liberar a plataforma antes do pagamento e da chave combinada.</li>
      <li>Não alongar de graça. A sessão acaba no minuto 90.</li>
      <li>Não diagnosticar dez furos. Um.</li>
      <li>Não usar humor (dela ou o seu) como bússola.</li>
      <li>Não gravar escondido. Não expor a gravação.</li>
      <li>Não dar conselho jurídico, de investimento regulado ou de saúde.</li>
      <li>Não copiar a vida de outra pessoa para o mapa desta.</li>
    </ul>

    <article class="af-asc-card">
      <p class="lvl">Se a call descarrilar</p>
      <p>“Vamos voltar para o número.” Se insistir no drama: “Isso entra no mapa como padrão. Agora eu preciso do valor.” Se ofender: encerra com respeito. Sessão prestada.</p>
    </article>

    <h3 class="section-h">Depois da sessão · o que já existe no Complementar</h3>
    <p class="hero-sub">Se ela entrar na mentoria, o mapa não começa do zero. Encaminha cada bolha para a ferramenta que já está na plataforma.</p>
    <ul class="af-asc-ul">
      <li>Rotina → Complementar · Rotina</li>
      <li>Tempo / foco → Produtividade, Hábitos, Metas</li>
      <li>Saúde → Alimentação, Treino, Yoga, Meditação, Modo sono</li>
      <li>Financeiro → Quitei + Auditoria de cash-flow nas Ferramentas</li>
      <li>Objetivos → Metas</li>
      <li>Corpo e mente no intervalo → MindZone</li>
    </ul>
    <p>Ainda não tem ferramenta própria de Compras, Projetos soltos ou “onde trabalhar”. Não inventa isso no meio da call. Vai para Agenda + nota, como no sistema simples.</p>

    <h3 class="section-h">Bloco do mapa · preenche na call</h3>
    <p class="hero-sub">Só o que ela falou. Bolha vazia some do texto copiado.</p>
    <div class="asc-map">
      ${field("ascNome", "Nome")}
      ${field("ascRotina", "Rotina")}
      ${field("ascTempo", "Tempo")}
      ${field("ascFin", "Financeiro")}
      ${field("ascTrab", "Trabalho e renda")}
      ${field("ascSaude", "Saúde")}
      ${field("ascObj", "Objetivos")}
      ${field("ascProj", "Projetos")}
      ${field("ascTar", "Tarefas")}
      ${field("ascComp", "Compras")}
      ${field("ascAmb", "Ambiente")}
      ${field("ascCont", "Conteúdo (se houver)")}
      ${field("ascFam", "Família e dinheiro")}
      ${field("ascPadrao", "Padrão · número · gesto")}
      ${field("ascAcao", "Ação de 7 dias")}
      <div class="rt-acts">
        <button class="tool-btn" type="button" data-act="afAscCopy">Copiar mapa para o WhatsApp</button>
        <button class="tool-btn" type="button" data-act="afAscClear">Limpar bloco</button>
      </div>
    </div>
  </div>`;
}

function field(id, label) {
  return `<label class="asc-field">${label}<textarea id="${id}" rows="2" placeholder=""></textarea></label>`;
}

window.afAscCopy = () => {
  const read = (id, title) => {
    const v = document.getElementById(id)?.value.trim();
    return v ? title.toUpperCase() + "\n" + v + "\n" : "";
  };
  const nome = document.getElementById("ascNome")?.value.trim() || "Mapa de Alinhamento";
  const txt = [
    nome.toUpperCase() + " · MAPA DE ALINHAMENTO",
    "",
    read("ascRotina", "Rotina"),
    read("ascTempo", "Tempo"),
    read("ascFin", "Financeiro"),
    read("ascTrab", "Trabalho e renda"),
    read("ascSaude", "Saúde"),
    read("ascObj", "Objetivos"),
    read("ascProj", "Projetos"),
    read("ascTar", "Tarefas"),
    read("ascComp", "Compras"),
    read("ascAmb", "Ambiente"),
    read("ascCont", "Conteúdo"),
    read("ascFam", "Família e dinheiro"),
    read("ascPadrao", "Diagnóstico"),
    read("ascAcao", "Ação de 7 dias"),
    "Tem hora → Agenda. Tem ação → Tarefas. Tem ideia → Nota. Move dinheiro → Financeiro."
  ].filter((x, i, a) => x !== "" || a[i - 1] !== "").join("\n").replace(/\n{3,}/g, "\n\n");
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt);
  else window.prompt("Copie o mapa", txt);
  alert("Mapa copiado. Cola no WhatsApp dela.");
};

window.afAscClear = () => {
  document.querySelectorAll(".asc-map textarea").forEach((el) => { el.value = ""; });
};
