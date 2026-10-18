/* Nove reels do Flow. Camada extra. Não altera reel, story, TikTok, live nem boas-vindas. */
const FLOW_REELS = [
  {
    kind:"flow", who:"yan", day:"Flow 1", format:"Reel", title:"A sala",
    place:"Na sala de verdade. Celular em pé, andando bem devagar. Você só aparece no fim.",
    dur:"20s", gesture:"Link na bio: akashahub.com.br/flow",
    caption:"A sala está pronta.\nUma pessoa de cada vez.\n\nakashahub.com.br/flow",
    beats:[
      {t:"Imagem", say:"", lesson:"Não fala nestes 12 segundos. Mostra a cama, a luz, a porta fechando. Sem música alta.", screen:"A sala."},
      {t:"Fala", say:"A sala está pronta. Uma pessoa de cada vez. Salvador. O caminho está no link da bio.", lesson:"Olha a câmera só aqui. Pausa depois de pronta.", screen:"Link na bio"}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 2", format:"Reel", title:"Vinte e seis",
    place:"Em casa ou na sala. Do peito para cima. Fundo escuro. Luz na cara.",
    dur:"22s", gesture:"Não invente contagem. 26 é o teto do ano.",
    caption:"26 sessões no ano. Depois, acabou.\n\nakashahub.com.br/flow",
    beats:[
      {t:"Corte", say:"Eu faço 26 sessões por ano. Só 26.", lesson:"Sem oi. A primeira frase é o corte.", screen:"26 no ano."},
      {t:"Limite", say:"Quando essas 26 fecham, acabou. Não tem lista infinita.", lesson:"Pausa em acabou.", screen:"Depois, acabou."},
      {t:"Porta", say:"Se você quer a sua, o link está na bio.", lesson:"Não peça para seguir.", screen:"Link na bio"}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 3", format:"Reel", title:"Paga e o dia fica seu",
    place:"Mostra o celular aberto em akashahub.com.br/flow, nos quatro cards. Depois o rosto.",
    dur:"25s", gesture:"O dia só depois do pagamento. Não marque horário no direct.",
    caption:"Você escolhe. Paga. O dia fica seu.\nCartão ou Pix. Quem prefere, fala comigo no WhatsApp.\n\nakashahub.com.br/flow",
    beats:[
      {t:"Card", say:"Quatro sessões. Você escolhe uma.", lesson:"Primeiro a tela do site. Depois você.", screen:"Quatro sessões."},
      {t:"Pagamento", say:"Paga no cartão ou no Pix. Aí escolhe o dia. Esse dia fica bloqueado para você.", lesson:"Não fale preço. O preço está no card.", screen:"Paga e o dia fica seu."},
      {t:"Saída", say:"Se não quiser pagar pelo site, fala comigo no WhatsApp. O link está na bio.", lesson:"Uma vez. Sem insistir.", screen:"Link na bio"}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 4", format:"Reel", title:"Não é um spa",
    place:"Sentado na sala, rosto perto. Sem vela na frente da lente.",
    dur:"18s", gesture:"Tom firme. Sem sorriso de anúncio.",
    caption:"Não é spa. Não é fila. É uma sessão.\n\nakashahub.com.br/flow",
    beats:[
      {t:"Corte", say:"Não é um spa.", lesson:"Para um segundo.", screen:"Não é um spa."},
      {t:"O que é", say:"É uma sessão. Massagem tântrica. Meditação. Terapia de alinhamento. Uma sala. Um terapeuta.", lesson:"Não descreva o toque.", screen:"Uma sessão."},
      {t:"Limite", say:"Toque terapêutico não é serviço sexual. Se é isso que você procura, esta porta não é a sua.", lesson:"Rosto sério. Sem piada.", screen:"Não é serviço sexual."}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 5", format:"Reel", title:"Uma pessoa",
    place:"A porta da sala, você de lado, fechando. Uma tomada.",
    dur:"16s", gesture:"Sem pressa. O silêncio vende.",
    caption:"Uma pessoa. Um dia. A agenda não divide você com mais ninguém nesse horário.\n\nakashahub.com.br/flow",
    beats:[
      {t:"Corte", say:"Uma pessoa de cada vez.", lesson:"Fecha a porta devagar enquanto fala.", screen:"Uma pessoa."},
      {t:"Dia", say:"Nesse dia, a agenda fica para você. Por você. Com você.", lesson:"Pausa entre as três frases.", screen:"O dia é seu."},
      {t:"Porta", say:"O link está na bio.", screen:"Link na bio"}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 6", format:"Reel", title:"O corpo lembra",
    place:"Em casa. Sentado. Mãos quietas. Sem gesto largo.",
    dur:"20s", gesture:"Não vire aula. Não vire promessa.",
    caption:"O corpo lembra. A presença organiza. O resto não se explica. Se vive.\n\nakashahub.com.br/flow",
    beats:[
      {t:"Corte", say:"O corpo lembra.", lesson:"Baixo. Quase sem mexer.", screen:"O corpo lembra."},
      {t:"Meio", say:"A presença organiza. O resto não se explica. Se vive.", lesson:"Pausa antes de se vive.", screen:"Se vive."},
      {t:"Porta", say:"Se isso fez sentido, a sala está no link.", screen:"Link na bio"}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 7", format:"Reel", title:"Duas casas",
    place:"Em casa. Rosto. Sem slide da mentoria. Sem preço.",
    dur:"28s", gesture:"Este é o reel que separa Flow e Legado. Não misture.",
    caption:"Flow é a sala. Um dia.\nArquitetura de Legado é a casa do ano. O trabalho, a oferta, o que fica quando você sai.\nNão é o mesmo produto.\n\nSessão: akashahub.com.br/flow\nCasa do ano: akashahub.com.br/al",
    beats:[
      {t:"Corte", say:"Isso não é a mentoria.", lesson:"Direto. Sem pedir desculpa.", screen:"Não é a mentoria."},
      {t:"Flow", say:"Flow é uma sessão. Uma sala. Um dia. Você entra, vive, sai.", lesson:"Não descreva técnica.", screen:"Uma sala. Um dia."},
      {t:"Legado", say:"Arquitetura de Legado é outra casa. É o ano. A essência, a oferta, o dinheiro, o que continua quando você sai da sala.", lesson:"Não venda a mentoria aqui.", screen:"A casa do ano."},
      {t:"Chave", say:"Se você quer o dia, o link do Flow está na bio. Se você quer o ano, é outra porta.", lesson:"Duas portas. Não junte.", screen:"Duas portas."}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 8", format:"Reel", title:"Quatro portas",
    place:"Tela do site nos quatro cards, devagar. Sem ler o preço em voz alta.",
    dur:"20s", gesture:"A pessoa escolhe na página. Você não explica o card inteiro.",
    caption:"Contemplação. Flow. Magnetismo Soberano. Pack Elite Flow.\nO preço está na página. Você escolhe.\n\nakashahub.com.br/flow",
    beats:[
      {t:"Corte", say:"Tem quatro portas. Não dez.", lesson:"Mostra os cards. Não lê o valor.", screen:"Quatro portas."},
      {t:"Nomes", say:"Contemplação. Flow. Magnetismo Soberano. Pack Elite Flow.", lesson:"Um nome, uma pausa.", screen:"Você escolhe."},
      {t:"Porta", say:"O preço está na página. Você escolhe. O link está na bio.", screen:"Link na bio"}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 9", format:"Reel", title:"A página não dorme",
    place:"Noite. Luz baixa. Você de camisa escura. Celular na mão, página aberta.",
    dur:"22s", gesture:"Este reel pode ir ao ar de madrugada. A página recebe. Você não.",
    caption:"Você pode pagar agora. O dia você escolhe depois.\nSe quiser falar comigo, deixa o nome. Eu respondo de manhã.\n\nakashahub.com.br/flow",
    beats:[
      {t:"Corte", say:"Eu posso estar dormindo. A página não.", lesson:"Meio sorriso. Sem piada.", screen:"A página não dorme."},
      {t:"Caminho", say:"Você escolhe a sessão. Paga. Depois escolhe o dia. Se precisar remarcar, a gente alinha.", lesson:"Não prometa horário na mesma hora.", screen:"Paga. Depois o dia."},
      {t:"Manhã", say:"Se preferir falar comigo, deixa o nome. Eu respondo de manhã. O link está na bio.", lesson:"Para. Não acrescente.", screen:"Link na bio"}
    ]
  }
];

function mountFlow(list){
  const note = document.createElement("p");
  note.className = "note";
  note.textContent = "Flow. Nove reels. Camada extra. Não substitui o que está acima e não vende a Arquitetura de Legado. A Legado é a casa do ano. O Flow é a sala, um dia. 26 sessões no ano é limite real. Sem descrição da sessão. O preço fica na página.";
  list.append(note);
  const shot = document.createElement("img");
  shot.className = "flow-shot";
  shot.src = "/al/teleprompt/flow-reels.jpg?v=1";
  shot.alt = "Três reels do Flow, como ficam no Instagram: a sala, as 26 vagas, e paga e o dia fica seu.";
  list.append(shot);
  FLOW_REELS.forEach((s, i)=>{
    const el = document.createElement("button");
    el.type = "button";
    el.className = "card flow";
    el.dataset.who = "yan";
    el.innerHTML = '<div class="num">F'+(i+1)+'</div><div><div class="tag">Flow · Reel · '+esc(s.dur)+'</div><h2>'+esc(s.title)+'</h2><div class="meta">'+esc(s.place)+'<br>'+esc(s.gesture)+'</div></div><div class="open meta">Abrir</div>';
    el.onclick = ()=>openScript(s);
    list.append(el);
  });
}
window.mountFlow = mountFlow;
