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
    <p class="hero-sub">1h30 · 1:1 · R$ 350 · gravada · dossiê. Mentorando não vê esta página.</p>

    <article class="af-asc-card gold">
      <p class="lvl">Regra de ouro</p>
      <p>Motivação não é método. Se a energia cair, você não improvisa um show. Volta para a próxima pergunta do roteiro. Número. Padrão. Um ajuste agora. Porta da mentoria só se fizer sentido.</p>
    </article>

    <h3 class="section-h">Antes de ligar a câmera</h3>
    <ol class="af-asc-ol">
      <li>Água. Banheiro. Celular no silencioso. Gravação pronta.</li>
      <li>Anamnese aberta (7 campos). Caderno. Relógio visível.</li>
      <li>Landing e WhatsApp à mão. Não abrir Instagram no meio.</li>
      <li>Frase de chão, baixa: “Hoje eu só faço o protocolo.”</li>
      <li>Se estiver mal: sessenta segundos de respiração. Depois entra. Não desmarca por humor.</li>
    </ol>

    <h3 class="section-h">Os 90 minutos</h3>
    <article class="af-asc-card"><p class="lvl">0–8 min · Porta</p>
      <p>Agradece. Confirma o tempo. Confirma a gravação. Diz o que vai acontecer, em uma linha: “Vou entender o número, o padrão e o que dá para ajustar hoje. No fim você sai com um dossiê. Mentoria é outro assunto, só se fizer sentido.”</p>
      <p>Não promete transformação. Não aquece com história longa.</p>
    </article>
    <article class="af-asc-card"><p class="lvl">8–25 min · Os 7 campos</p>
      <p>Pergunta e anota. Não corrige a pessoa no meio.</p>
      <ol>
        <li>Nome como quer ser chamada.</li>
        <li>O que está construindo agora.</li>
        <li>Onde o dinheiro trava (fato, não sentimento).</li>
        <li>Reserva em meses.</li>
        <li>Família e dinheiro: o que se repete.</li>
        <li>O que precisa estar verdadeiro em 90 dias.</li>
        <li>Para quem isso serve além dela.</li>
      </ol>
      <p>Se divagar: “Me dá o número.” Se teatralizar: “Isso é o sentimento. Qual foi o último valor que saiu sem decisão?”</p>
    </article>
    <article class="af-asc-card"><p class="lvl">25–50 min · Diagnóstico</p>
      <p>Nomeia o furo em voz alta, curto. Um. Não dez.</p>
      <p>Exemplos de frase: “O padrão que eu ouvi é X. O número que falta é Y. O gesto que sustenta isso é Z.”</p>
      <p>Espelha. Espera. Não consola. Não debate identidade.</p>
    </article>
    <article class="af-asc-card"><p class="lvl">50–75 min · Um ajuste agora</p>
      <p>Uma ação observável para os próximos 7 dias. Só uma.</p>
      <p>Pode abrir Quitei se houver dívida. Pode abrir cash-flow se o furo for vazamento. Não abre a plataforma inteira. Não dá aula dos 7 módulos.</p>
      <p>A pessoa precisa sair sabendo o que faz amanhã de manhã.</p>
    </article>
    <article class="af-asc-card"><p class="lvl">75–88 min · Porta da mentoria</p>
      <p>Só abre se o diagnóstico pediu continuidade. Se não pediu: fecha com o dossiê e o valor da sessão já pago. Sem pressão.</p>
      <p>Se pediu: “Existem três chaves. Essencial 3.900, 8 semanas. Premium 6.500, 12 semanas. VIP 13.000, 1:1. Os 7 módulos são os mesmos. Muda o acompanhamento. Você não escolhe agora se estiver nublada. Pensa. Me chama no WhatsApp.”</p>
      <p>Não fecha mentoria no susto. Não dá desconto por pena. Não mistura Flow.</p>
    </article>
    <article class="af-asc-card"><p class="lvl">88–90 min · Encerramento</p>
      <p>Repete a ação de 7 dias. Confirma como o dossiê chega (WhatsApp). Agradece. Encerra no horário.</p>
    </article>

    <h3 class="section-h">Como falar, sempre</h3>
    <ul class="af-asc-ul">
      <li>Frase curta. Uma ideia por vez.</li>
      <li>Pergunta número antes de opinião.</li>
      <li>Silêncio depois da pergunta. Quem preenche o vazio primeiro perde o eixo.</li>
      <li>Voz baixa. Sem palco. Sem “vamos juntas mudar sua vida”.</li>
      <li>Se você se irritar: volta ao caderno. Lê a próxima pergunta.</li>
      <li>Se a pessoa chorar: água, tempo, depois o mesmo ponto. Choro não cancela o número.</li>
    </ul>

    <h3 class="section-h">Pode fazer (extras)</h3>
    <ul class="af-asc-ul">
      <li>Gravar e mandar o recorte combinado.</li>
      <li>Dossiê escrito no mesmo dia: padrão, número, ação de 7 dias.</li>
      <li>Abrir Quitei ou auditoria por 3 minutos se for o furo.</li>
      <li>Mandar a landing e o PDF público de precificação.</li>
      <li>Marcar retorno pago, se ela pedir.</li>
      <li>Encaminhar para Bibliotheca R$ 97 se ainda não está pronta para mentoria.</li>
      <li>Encerrar 5 minutos mais cedo se o ponto já fechou.</li>
    </ul>

    <h3 class="section-h">Não fazer de jeito nenhum</h3>
    <ul class="af-asc-ul no">
      <li>Não virar terapia, constelação clínica ou confissão espiritual de 2 horas.</li>
      <li>Não vender mentoria por medo, tesão da call ou pena.</li>
      <li>Não inventar desconto para “fechar hoje”.</li>
      <li>Não misturar Flow, sessão antiga de R$ 700, Magnetismo ou livros como se fossem a mesma oferta.</li>
      <li>Não prometer renda, cura, relacionamento ou resultado garantido.</li>
      <li>Não mostrar teleprompter, gestão, Volume Zero nem este roteiro.</li>
      <li>Não liberar a plataforma antes do pagamento e da chave combinada.</li>
      <li>Não alongar de graça “só mais uma”. A sessão acabou no minuto 90.</li>
      <li>Não diagnosticar dez furos. Um. O que segura o dinheiro agora.</li>
      <li>Não usar o estado de espírito dela (ou o seu) como bússola. O protocolo é a bússola.</li>
      <li>Não gravar escondido. Não expor a gravação.</li>
      <li>Não dar conselho jurídico, de investimento regulado ou de saúde.</li>
    </ul>

    <article class="af-asc-card">
      <p class="lvl">Se a call descarrilar</p>
      <p>“Vamos voltar para o número.” Se insistir no drama: “Isso entra no dossiê como padrão. Agora eu preciso do valor.” Se ofender: encerra com respeito. Sessão prestada. Sem segunda hora de briga.</p>
    </article>
  </div>`;
}
