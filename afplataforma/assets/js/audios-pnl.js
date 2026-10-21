/** Mapa para gravar. Só o mentor vê. Ainda não é o áudio publicado. */
import { isMentorSession } from "./auth.js";

const CASA = [
  {
    id: "vida",
    nome: "Vida da pessoa",
    linha: "Paladins · Códigos de Origem · Tecnologia da Alma",
    texto: "Não fala da mentoria. Fala da casa, do corpo, da palavra e da origem. A obra fica melhor quando a vida não está em guerra com ela.",
    audios: [
      ["A palavra que você cumpre", "Paladins. Uma promessa pequena, dita em voz alta, e cumprida hoje. Sem discurso de herói."],
      ["Coragem sem teatro", "Paladins. A coragem aqui é ficar na conversa difícil. Pausa. Uma cena real, não um filme."],
      ["Liderar sem esmagar", "Paladins. Força a serviço. A pessoa imagina uma decisão em que ninguém precisa ser diminuído."],
      ["O limite que protege", "Paladins. Um não dito com calma. O limite não é rejeição. É cuidado da obra e da casa."],
      ["O dia comum de quem escolhe o bem", "Paladins. Sem plateia. Um gesto de hoje: a refeição, a resposta, a conta paga."],
      ["O que você recebeu antes de escolher", "Códigos de Origem. Honrar sem virar sentença. Fato da família. Depois, o que a pessoa decide manter."],
      ["O padrão que não é seu e ainda manda", "Códigos de Origem. Nomear o padrão. Não culpar a casa inteira. Uma frase: isto eu encerro."],
      ["A linhagem como matéria", "Códigos de Origem. Talento, ofício, jeito de trabalhar. Matéria para a marca. Não é destino."],
      ["O código que você decide continuar", "Códigos de Origem. Um só. Escrito. O resto espera."],
      ["O nome da sua origem", "Códigos de Origem. De onde a força veio, em uma imagem. Sem inventar vida passada como fato."],
      ["Corpo antes da decisão", "Tecnologia da Alma. Onde aperta. Respirar. Só então a frase. Sensação não é prova."],
      ["A atenção que volta", "Tecnologia da Alma. Três respirações. Um objeto na sala. A mente volta para o que está na frente."],
      ["O campo da casa", "Tecnologia da Alma. A mesa, a luz, quem entra. O ambiente puxa a decisão. Arrumar um canto já é prática."],
      ["Sono como parte da obra", "Tecnologia da Alma. O corpo que dorme decide melhor. Sem culpa por parar."],
      ["Intenção de manhã", "Tecnologia da Alma. Uma intenção. Uma ação no mesmo dia. Não uma lista."],
      ["Integração da noite", "Tecnologia da Alma. O que foi relato. O que foi leitura. O que virou decisão. Três linhas."],
      ["A casa em ordem o bastante", "Vida. Não a casa perfeita. O chão em que dá para trabalhar amanhã."],
      ["A relação que não compete com a obra", "Vida. Uma conversa curta com quem vive junto. A obra não come a casa."],
      ["Descanso sem culpa", "Vida. Parar não é abandonar o projeto. É o que permite continuar."],
      ["Alegria antes do resultado", "Vida. Um gosto de hoje. A prosperidade não começa no extrato."]
    ]
  },
  {
    id: "dinheiro",
    nome: "Dinheiro",
    linha: "Alinhamento Financeiro · um áudio por módulo, e depois o resto",
    texto: "Começa no módulo 1 e vai até o 7. Número é número. Crença é crença. Não misturar. Sem promessa de faturamento.",
    audios: [
      ["O número existe antes do sonho", "Módulo 1 · Fundação de Capital de Segurança. Pés no chão. Entrada, saída, o que sobra. O sonho espera o papel."],
      ["A reserva que não se negocia", "Módulo 1. Uma parte que sai primeiro. Pequena. Repetida. Escassez cognitiva baixa quando a base existe."],
      ["Essencial e gosto", "Módulo 1. Dois montes. O que mantém o trabalho. O que é vontade. Sem moralismo."],
      ["A ideia feia vale a tentativa", "Módulo 2 · Capital Criativo. Uma versão pequena em 48 horas. A ideia perfeita não paga conta."],
      ["Três pessoas, antes de construir", "Módulo 2. Validar com gente real. Ouvir a frase delas, não a sua."],
      ["Uma entrega visível hoje", "Módulo 3 · Motor de Execução. Feito ou não feito. Sem ensaio longo. O corpo levanta e termina uma coisa."],
      ["A fuga tem nome", "Módulo 3. A procrastinação vira uma microtarefa. A mente para de discutir com o relógio."],
      ["O nome do outro primeiro", "Módulo 4 · Capital Relacional. Chegar oferecendo. Uma entrega concreta. Sair sem pedir palco."],
      ["Rede não é plateia", "Módulo 4. Cinco pessoas. Um próximo passo com cada uma. Reciprocidade sem comprar afeto."],
      ["O preço sem desculpa no fim", "Módulo 5 · Comunicação e negociação. Sessenta segundos. Um pedido. Pausa. Não descontar a própria frase."],
      ["A objeção ouvida até o fim", "Módulo 5. Repetir o que a pessoa disse. Só então responder. Voz baixa."],
      ["Noventa dias, não só dez anos", "Módulo 6 · Visão estratégica. A visão longa cabe numa página. A ação cabe nesta estação."],
      ["Três cenários, uma resposta", "Módulo 6. Se for bem. Se for o esperado. Se apertar. Nenhum cenário é sentença."],
      ["O dinheiro alinhado ao que você não vende", "Módulo 7 · Governança de consciência. O que fica de fora da oferta. O critério que a equipe consegue repetir."],
      ["A permissão de ser pago", "Além dos módulos. A voz antiga que cobra no seu lugar. A pessoa escreve: eu posso receber por isto."],
      ["O vazamento que você já sabe o nome", "Além dos módulos. Um só. Cortar ou reduzir. Sem planilha infinita."],
      ["Receber sem encolher", "Além dos módulos. O valor entra. O corpo não pede desculpa. Uma respiração antes de agradecer."],
      ["Guardar não é medo", "Além dos módulos. Reserva é continuidade. Não é desconfiança da vida."]
    ]
  },
  {
    id: "escada",
    nome: "Essência, identidade e marca",
    linha: "Do mais superficial ao mais profundo",
    texto: "Cada áudio desce um degrau. Reflexão primeiro. Sugestão depois, no presente, sem ordem. A marca só aparece quando a pessoa já se reconhece.",
    audios: [
      ["A foto e a frase da bio", "Superfície. O que a imagem promete. O que a frase esconde. Sem trocar a foto ainda."],
      ["Como você entra numa sala", "Corpo visto de fora. Ombro, voz, pressa. Uma sugestão: entrar um segundo mais devagar."],
      ["O que você responde quando perguntam o que você faz", "A frase automática. Repetir. Notar onde ela fica pequena."],
      ["A história de dois minutos", "A história que você conta. O que fica de fora. Não corrigir ainda."],
      ["O que as pessoas já reconhecem", "Três frases que outros já disseram. Isto é matéria. Não é vaidade."],
      ["Quem você acredita ser, e quem você apresenta", "A distância. Sem julgamento. Uma ponte de uma frase."],
      ["A identidade que você defende", "O que não pode sair, senão deixa de ser você. Escrever uma linha."],
      ["A família: o que honra, o que encerra", "Códigos de Origem. Dois lados. Honra não é repetir. Encerrar não é rejeitar a casa."],
      ["O corpo quando você fala de si", "Tecnologia da Alma. Onde aperta ao dizer o próprio nome profissional. Respirar ali."],
      ["A frase que você repete sozinho", "A crença de bastidor. Dizer em voz alta. Marcar: isto é leitura, não fato."],
      ["Com quem essa identidade cresce", "Campo. As pessoas que aumentam a voz. As que encolhem. Uma escolha de proximidade."],
      ["O código que a marca pode carregar", "Só agora a marca. Um símbolo, uma palavra, um tom. O que não entra."],
      ["A frase que outra pessoa consegue repetir", "Se só você entende, ainda não é direção. Encurtar até caber na boca de outro."],
      ["Para quem é. Para quem não é.", "O limite deixa a marca mais nítida. Sem servir todo mundo."],
      ["Você quando ninguém está olhando", "O degrau fundo. O gesto sem plateia. A prosperidade começa aí, não no anúncio."],
      ["A marca como consequência", "A identidade já estava. A marca só organiza. Sugestão: não inventar um personagem."]
    ]
  },
  {
    id: "ano",
    nome: "O ano da Arquitetura de Legado",
    linha: "Para quem está dentro da casa",
    texto: "Estes títulos seguem o documento-mestre. Servem para a pessoa entender o processo e querer continuar. Não vendem no meio do áudio.",
    audios: [
      ["Isto é uma incubadora", "Visão. Pessoa, negócio, ideia e movimento no mesmo ano. Sem preço."],
      ["Quem você é, o que você cria, o que permanece", "A frase-mãe. Três tempos. Pausa entre eles."],
      ["A marca não começa no logotipo", "Começa na pessoa. O símbolo espera."],
      ["Relato, hipótese e decisão", "Três gavetas. A pessoa aprende a não misturar."],
      ["A ordem do ano não é uma caixa", "Se precisa vender no mês um, vende. A fase organiza. Não prende."],
      ["Quem você é quando alguém pergunta", "Fase 1. Identidade falada."],
      ["O que a família ensinou sobre dinheiro", "Fase 1. Fato, depois leitura."],
      ["Crença de merecimento", "Fase 1. Nomear. Não tratar como verdade eterna."],
      ["Talento ainda não é produto", "Fase 1. Capacidade primeiro. Oferta depois."],
      ["A matéria que o império pode carregar", "Passagem da Fase 1 para a 2. O que está autorizado a sair."],
      ["Para quem é a oferta", "Fase 2. Uma pessoa real."],
      ["O primeiro ativo. Um só.", "Fase 2. Não a casa inteira."],
      ["A oferta com começo, meio e fim", "Fase 2. Sem reexplicar toda vez."],
      ["O que entra, o que vaza, o que é essencial", "Fase 3. Leitura, não plano completo."],
      ["Fechar sem empurrar", "Fase 3. O não permanece possível."],
      ["O que já pode sair da sua mão", "Fase 4. Uma função. Um nome. Um combinado."],
      ["Documentar enquanto ainda está na cabeça", "Fase 4. O processo vira texto antes de virar equipe."],
      ["A visão que a equipe repete", "Fase 5. Doutrina em uma frase."],
      ["Comunidade não é plateia", "Fase 5. Gente que participa."],
      ["O que permanece depois de você", "Fase 5. Continuidade. Sem drama."],
      ["Ver o projeto de pé, sem inventar número", "Visualização. Um dia comum daqui a doze meses. Sem faturamento mágico."],
      ["A próxima decisão, já escrita", "Fecha qualquer fase. Uma decisão. Uma data."]
    ]
  },
  {
    id: "conduz",
    nome: "Quem conduz a sessão",
    linha: "Treino do mentor e de quem grava",
    texto: "Não vai para o cliente. É o seu ensaio antes de abrir o microfone ou a call.",
    audios: [
      ["A call é conversa, não formulário", "Perguntar. Esperar. Anotar relato separado da sua leitura."],
      ["Capturar primeiro", "Não transformar a sessão em entrega na mesma hora."],
      ["Hipótese não vira verdade do cliente", "Dizer: isto é uma leitura minha. A pessoa confirma ou não."],
      ["O que não se promete", "Sem faturamento, cura, seguidor ou execução infinita."],
      ["Devolver ao dossiê", "No fim, uma linha em relato, uma em hipótese, uma em decisão."],
      ["Como gravar a sugestão", "Voz mais baixa que a fala. Presente do indicativo. Pausa de três segundos. Uma imagem. Uma ação hoje. Sem 'você vai ficar rico'."]
    ]
  }
];

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => "&#" + c.charCodeAt(0) + ";");
}

export function renderAudiosPnl() {
  if (!isMentorSession()) {
    return `<div class="view active"><p class="empty">Acesso restrito ao mentor.</p></div>`;
  }
  const indice = CASA.map((c) => `<button class="tool-btn" type="button" data-pnl="${c.id}">${esc(c.nome)}</button>`).join("");
  const corpo = CASA.map((c) => `
    <section id="${c.id}">
      <p class="hero-line">${esc(c.linha)}</p>
      <h3 class="section-h">${esc(c.nome)}</h3>
      <p class="hero-sub">${esc(c.texto)}</p>
      ${c.audios.map(([titulo, estrategia], i) => `
        <article class="q-feature">
          <p class="hero-line">${String(i + 1).padStart(2, "0")}</p>
          <h3>${esc(titulo)}</h3>
          <p>${esc(estrategia)}</p>
        </article>`).join("")}
    </section>`).join("");
  return `<div class="view active">
    <div class="back-link" data-nav="mentor">← Gestão</div>
    <p class="hero-line">Para gravar</p>
    <h2 class="hero-title">Áudios PNL</h2>
    <p class="hero-sub">Títulos, categorias e a estratégia de cada gravação. Vida da pessoa, dinheiro por módulo, essência do superficial ao fundo, e o ano do Legado. Experiência espiritual fica como leitura, não como prova.</p>
    <article class="q-feature">
      <h3>Como gravar qualquer um</h3>
      <p>Uma imagem concreta. Uma pausa. A sugestão no presente: “você pode notar”. Fecha com uma ação pequena no mesmo dia. Não diga que a ciência provou. Não prometa dinheiro, cura ou seguidor.</p>
    </article>
    <div class="row">${indice}</div>
    ${corpo}
  </div>`;
}

export function bindAudiosPnl() {
  document.querySelectorAll("[data-pnl]").forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.getAttribute("data-pnl");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
