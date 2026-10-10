/* Lives. Camada nova. Não altera reel, story, TikTok 01.3, 01.4 nem 01.5.
   O bloco "Zoom" não é lido na live aberta. */
const LIVES = [
  {
    kind: "live",
    who: "yan",
    day: "Mês 1",
    format: "Live",
    title: "A casa não é mais um curso",
    place: "Em casa. Câmera fixa. Luz da janela de lado. Papel e caneta no quadro na prática.",
    dur: "25–35 min",
    gesture: "Palavra da aula fechada: PLANTA",
    caption: "Arquitetura de Legado não é mais um curso e não são três mentorias empilhadas.\n\nNa live a gente desenha a casa: quem você ajuda, qual problema, por qual caminho.\n\nQuem quiser a aula fechada comenta PLANTA. Não é inscrição na mentoria.",
    beats: [
      {t:"Abertura", say:"Hoje eu não vou te vender uma formação. Vou te mostrar por que tanta gente competente continua explicando o próprio trabalho do zero.", lesson:"Não abre com oferta. Não fala preço.", screen:"Sem oferta"},
      {t:"Diagnóstico", say:"O padrão é este. A pessoa sabe fazer. Aí separa a vida em três compras. Uma para se achar. Outra para aguentar o emocional. Outra para cobrar. Nenhuma conversa com a outra.", lesson:"Três compras. Uma vida.", screen:"Três compras"},
      {t:"Espelho", say:"No post, ela fala de propósito. Na call, ela fala de planilha. No story, ela fala de ferramenta. Quem assiste não sabe em qual porta entrar. Quem entra pergunta de novo o que ela faz.", lesson:"O público vê a emenda antes dela.", screen:"Qual porta?"},
      {t:"O que é", say:"Arquitetura de Legado é uma casa. Essência, Tecnologia da Alma e Alinhamento Financeiro não são três produtos. São três cômodos. A essência diz quem é o trabalho. A tecnologia da alma organiza a atenção, o hábito e a decisão. O alinhamento financeiro organiza o que entra, o que fica e o que não se promete.", lesson:"Cômodo, não vitrine.", screen:"Três cômodos"},
      {t:"Exemplo", say:"Pensa num arquiteto que também dá aula e também vende um aplicativo. Se cada um tem um nome, um preço e uma promessa, o cliente contrata um pedaço e cobra a casa inteira. Se os três cabem numa frase, a pessoa sabe o que está comprando antes de sentar.", lesson:"Exemplo de ofício. Não é caso de aluno. Não inventar resultado.", screen:"Um pedaço, ou a casa"},
      {t:"Tensão", say:"Mais um curso não corrige isso. Curso serve quando falta competência. Aqui a competência já está. O que falta é a planta. Sem planta, cada conteúdo novo publica a confusão mais rápido.", lesson:"Não atacar estudo. Separar estudo de estrutura.", screen:"Falta a planta"},
      {t:"Virada", say:"A frase cabe em três partes. Quem você ajuda. Qual problema. Por qual caminho. Não precisa ficar bonita. Precisa ser a mesma na segunda-feira e no story.", lesson:"A frase é o corredor da casa.", screen:"Quem. Problema. Caminho."},
      {t:"Prática", say:"Pega o papel. Escreve as três partes agora. Se você travar na segunda, o problema não é audiência. É que o problema ainda não tem nome. Lê uma vez em voz alta. Se precisou de mais de uma respiração, corta.", lesson:"Pausa. Espera eles escreverem. Não preenche por eles.", screen:"Escreve agora"},
      {t:"Palavra", say:"Quem quiser ver essa planta com mais tempo, numa aula fechada no Zoom, comenta a palavra PLANTA. Eu respondo com o horário. Não é a mentoria. Não é pagamento. É a aula em que a gente desce um cômodo.", lesson:"Uma vez. Sem contagem regressiva.", screen:"Comenta PLANTA"},
      {t:"Zoom", say:"Na aula fechada, a pessoa traz a frase que escreveu. A gente olha só três coisas. A frase nomeia uma pessoa real. O problema é o que dói, não o cargo. O caminho é uma etapa, não um adjetivo. Quem sair do Zoom sai com a frase reescrita. Não sai com proposta.", lesson:"Não ler na live aberta. Só no Zoom, com quem comentou PLANTA.", screen:"Só no Zoom"},
      {t:"Alívio", say:"Se você não comentar, o trabalho de hoje já está feito. Uma frase. Três partes. Isso já muda a próxima conversa.", lesson:"O não também é adulto.", screen:"A frase já é o trabalho"},
      {t:"Chave", say:"Se depois da aula ainda ficar uma pergunta que só se responde numa mesa, essa conversa tem nome. Leitura Call. Serve para ver se o que você precisa e o que eu conduzo são a mesma coisa. Se não forem, a gente se despede com a frase no papel.", lesson:"Uma frase. Sem preço. Sem urgência.", screen:"Leitura Call, se fizer sentido"}
    ]
  },
  {
    kind: "live",
    who: "yan",
    day: "Mês 2",
    format: "Live",
    title: "Quando você sai, a casa senta",
    place: "Em casa. Mesma câmera. Um caderno aberto, não um slide.",
    dur: "25–35 min",
    gesture: "Palavra da aula fechada: ETAPA",
    caption: "Quando você sai da sala, o negócio continua ou senta e espera você voltar?\n\nHoje a gente escreve uma etapa. Entrada e saída.\n\nAula fechada: comenta ETAPA.",
    beats: [
      {t:"Abertura", say:"Na live passada a gente escreveu a frase. Hoje eu vou falar de uma coisa menos bonita. O que acontece com o seu trabalho quando você não está na sala.", lesson:"Não resume a mentoria. Continua a aula.", screen:"Quando você não está"},
      {t:"Diagnóstico", say:"Tem negócio que parece sólido enquanto o dono está falando. O cliente pede ele. A equipe chama ele. O combinado foi de boca. O arquivo está na cabeça.", lesson:"Quatro sinais. Devagar.", screen:"Pede você. Chama você."},
      {t:"Espelho", say:"A pessoa chama isso de padrão de qualidade. Eu também já chamei. No fundo é um trabalho que ainda não sabe andar sem a voz de quem criou.", lesson:"Eu, como experiência. Não como troféu.", screen:"Anda sem a sua voz?"},
      {t:"Como eu conduzo", say:"Eu não conduzo por frase motivacional. Eu leio a história da pessoa, separo o que é fato do que é interpretação, e transformo o que se repete numa etapa escrita. Entrada. O que acontece. Saída. Uma. A que volta toda semana.", lesson:"O método, em uma frase. Sem listar os doze meses.", screen:"Entrada. Acontece. Saída."},
      {t:"Exemplo", say:"Uma consultora que eu escuto o tempo todo faz a mesma coisa toda segunda. Recebe o áudio do cliente, responde de cabeça, e na sexta ninguém sabe o que ficou combinado. A etapa não é um software. É o papel que diz: o áudio entra, a resposta tem três linhas, a saída é um combinado que outra pessoa consegue ler.", lesson:"Exemplo composto. Não citar cliente real. Não prometer que a semana seguinte fatura.", screen:"Três linhas"},
      {t:"Tensão", say:"Enquanto isso só existe na sua boca, você não tem padrão. Tem presença. Presença não tira férias. Presença não passa o trabalho. Presença não vira legado.", lesson:"Pausa. Não sorri nessa frase.", screen:"Presença não tira férias"},
      {t:"Virada", say:"Autoridade, do jeito que eu uso, não é palco. É a outra pessoa conseguir repetir a etapa sem você do lado. Se ela não consegue, a autoridade ainda está emprestada da sua voz.", lesson:"Autoridade como repetição, não como fama.", screen:"Sem você do lado"},
      {t:"Prática", say:"Escolhe um processo que se repetiu esta semana. Escreve a entrada numa linha. Escreve a saída noutra. Se a saída for “eu explico”, ainda não é saída. Saída é o que fica no papel quando você levanta.", lesson:"Pausa para escrever. Caminha o exemplo de uma pessoa, sem corrigir a vida dela.", screen:"Entrada. Saída."},
      {t:"Palavra", say:"Quem quiser trazer essa etapa para a aula fechada no Zoom, comenta ETAPA. Eu olho a entrada e a saída com você. Continua de graça. Continua sem ser a mentoria.", lesson:"Uma vez.", screen:"Comenta ETAPA"},
      {t:"Zoom", say:"No Zoom eu não ensino o ano inteiro. Eu pego a etapa escrita e pergunto três coisas. Outra pessoa entenderia a entrada sem você? A saída é verificável? O que você ainda está guardando na cabeça porque tem medo de escrever torto? A pessoa sai com a etapa reescrita. Não sai com contrato.", lesson:"Não ler na live aberta.", screen:"Só no Zoom"},
      {t:"Alívio", say:"Uma etapa não organiza o ano. Organiza a segunda-feira. Isso já é o começo de uma casa que não senta quando você sai.", lesson:"Não prometer escala.", screen:"A segunda-feira"},
      {t:"Chave", say:"Se a etapa ficou clara e a pergunta que sobrou é se esse trabalho cabe numa condução de doze meses, a conversa se chama Leitura Call. É uma mesa para ver o encaixe. Não é um fechamento disfarçado de aula.", lesson:"Sem preço.", screen:"Leitura Call, se a etapa já existe"}
    ]
  },
  {
    kind: "live",
    who: "yan",
    day: "Mês 3",
    format: "Live",
    title: "Essência sem caixa é diário",
    place: "Em casa. Três folhas na mesa, uma para cada cômodo. Sem deck.",
    dur: "25–35 min",
    gesture: "Palavra da aula fechada: MESA",
    caption: "Essência sem caixa vira diário. Caixa sem essência vira campanha. Ferramenta sem as duas só publica a confusão.\n\nAula fechada: comenta MESA.",
    beats: [
      {t:"Abertura", say:"Nas duas lives anteriores você escreveu a frase e uma etapa. Hoje eu junto o que a maioria separa. Identidade, dinheiro e ferramenta. Não como três cursos. Como uma planta só.", lesson:"Recapitula em duas frases. Não refaz as aulas.", screen:"Uma planta só"},
      {t:"Diagnóstico", say:"Tem gente com história linda e caixa furada. Tem gente com caixa cheia e uma marca que poderia ser de qualquer um. Tem gente com aplicativo novo e as duas coisas confusas. Os três sofrem de um jeito diferente. A causa é a mesma. Os cômodos não se falam.", lesson:"Três retratos. Nenhum é vilão.", screen:"Os cômodos não se falam"},
      {t:"Espelho", say:"Você posta todo dia. A bio está bonita. A ferramenta está paga. Aí alguém te pergunta o que muda quando entra com você, e você volta para o cargo, para o ano de estrada, para o nome do aplicativo.", lesson:"O espelho é a pergunta, não a falha moral.", screen:"O que muda?"},
      {t:"Desenvolvimento", say:"Essência sem alinhamento financeiro vira diário. Você se entende e não sabe o que cobra, o que recusa e o que não promete. Alinhamento financeiro sem essência vira campanha. O número sobe e a casa não fica reconhecível. Tecnologia sem as duas só acelera. Publica mais rápido uma oferta que ainda não cabe numa frase.", lesson:"Três consequências. Devagar.", screen:"Diário. Campanha. Confusão."},
      {t:"Exemplo", say:"Um profissional de saúde posta todo dia um conceito. Não diz para quem é. Não diz onde o trabalho para. Não diz o que a pessoa leva na primeira sessão. O conteúdo educa. A conversa recomeça. O problema não é constância. É que a constância não tem porta.", lesson:"Ofício genérico. Sem nome de aluno. Sem faturamento.", screen:"Conteúdo sem porta"},
      {t:"O que dá para construir", say:"No arco de um ano, o que eu conduzo não é um pacote de posts. É a história virar dossiê. O dossiê virar frase. A frase virar limite de oferta. O limite virar um lugar onde o trabalho mora quando você não está. Ferramenta entra depois da decisão, para segurar. Não para inventar.", lesson:"Quatro passagens. Não prometer que todo mundo chega nas quatro.", screen:"História. Frase. Limite. Lugar."},
      {t:"Prática", say:"Três folhas. Na primeira, uma frase: quem você ajuda e com o quê. Na segunda, uma linha de dinheiro: o que você recusa cobrar, ou o que você cobra sem conseguir explicar. Na terceira, a ferramenta que você queria comprar antes de ter as duas primeiras. Se a terceira veio primeiro, essa é a aula.", lesson:"Pausa. Três folhas de verdade, se couber no quadro.", screen:"Três folhas"},
      {t:"Palavra", say:"Quem quiser trazer as três folhas para o Zoom, comenta MESA. A aula fechada é para ver se os cômodos se falam. Não é para eu te empurrar um plano.", lesson:"Uma vez.", screen:"Comenta MESA"},
      {t:"Zoom", say:"No Zoom a pessoa lê as três folhas. Eu só pergunto: a frase sobrevive sem o cargo? O dinheiro que você recusou tem motivo, ou é medo? A ferramenta guarda uma decisão que já existe? Se a resposta da terceira for não, a tarefa é não assinar nada esta semana.", lesson:"Não ler na live aberta.", screen:"Só no Zoom"},
      {t:"Alívio", say:"Você pode sair daqui sem Zoom e sem mesa. As três folhas já mostram onde a casa está rachada. Ver a rachadura é o trabalho. Comprar alguma coisa não é.", lesson:"Tira o peso da compra.", screen:"Ver a rachadura"},
      {t:"Chave", say:"Se as três folhas conversarem e você quiser saber se isso cabe numa condução comigo, a próxima conversa é a Leitura Call. Uma mesa. A gente vê se há alinhamento. Se não houver, você fica com as folhas. Elas já valem mais do que mais um conteúdo.", lesson:"Convite curto. Para.", screen:"Leitura Call, ou as folhas"}
    ]
  }
];

function mountLives(list){
  const note = document.createElement("p");
  note.className = "note";
  note.style.marginTop = "28px";
  note.textContent = "Lives. Camada nova, cor bronze. Não substitui o que está acima. Uma aula por mês. O bloco Zoom fica no teleprompter e não é lido na live aberta.";
  list.append(note);
  LIVES.forEach((s, i)=>{
    const el = document.createElement("button");
    el.type = "button";
    el.className = "card live";
    el.dataset.who = "yan";
    el.innerHTML = '<div class="num">L'+(i+1)+'</div><div><div class="tag">'+esc(s.day)+' · Live · aula gratuita</div><h2>'+esc(s.title)+'</h2><div class="meta">'+esc(s.dur)+' · em casa<br>'+esc(s.gesture)+'</div></div><div class="open meta">Abrir</div>';
    el.onclick = ()=>openScript(s);
    list.append(el);
  });
}
window.mountLives = mountLives;
render("todos");
