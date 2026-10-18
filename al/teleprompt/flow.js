/* Talking heads do Flow. Camada extra. Não altera reel, story, TikTok, live nem boas-vindas.
   Sem a sala. A linha lilás e o "na tela" não são falados. */
const COMO = "Talking head. Celular em pé, na altura do olho, encostado em algo firme. Você do peito para cima. Luz na cara, não atrás. Olha a bolinha da câmera. Lê devagar. Cada ponto é uma pausa. Se errar uma frase, repete só aquele pedaço. Sem música por cima. Sem mostrar a sala do Flow. Sem criança no quadro. Sem placa de loja em close.";

const FLOW_REELS = [
  {
    kind:"flow", who:"yan", day:"Flow 1", format:"Talking head", title:"Como agendar",
    place:"Em casa. Sentado. Janela de lado, luz na cara. Fundo quieto. " + COMO,
    dur:"70s", gesture:"Convite: akashahub.com.br/flow. Sem preço.",
    caption:"A sala eu gravo quando ela estiver pronta.\nO caminho já está no ar.\n\n26 sessões no ano.\nVocê escolhe a intensidade, paga, e marca o dia.\n\nakashahub.com.br/flow",
    beats:[
      {t:"Abre", say:"Eu não vou te mostrar a sala hoje. Ela existe. Eu ainda não gravo lá.", lesson:"Sem desculpa longa. Um fato.", screen:"Sem a sala, por enquanto."},
      {t:"Caminho", say:"O que eu posso te mostrar é o caminho. Você abre o Flow. Escolhe a sessão.", lesson:"Devagar.", screen:"Abre o Flow."},
      {t:"Intensidade", say:"Tem intensidade mais leve. Tem intensidade mais profunda. Eu sei guiar as duas.", lesson:"Não descreva o que acontece na maca.", screen:"Leve ou profunda."},
      {t:"Limite", say:"Isso não quer dizer que é para qualquer pessoa. São vinte e seis sessões no ano. Depois disso, não tem.", lesson:"26 é real. Sem contagem falsa.", screen:"26 no ano."},
      {t:"Agenda", say:"Você paga no cartão ou no Pix. Aí escolhe o dia. Se preferir falar comigo, o WhatsApp está na mesma página.", lesson:"Não fale valor.", screen:"Paga. Depois o dia."},
      {t:"Fecha", say:"O link está na bio.", lesson:"Para. Não acrescente.", screen:"Link na bio."}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 2", format:"Talking head", title:"A força",
    place:"Na praia. Sol na sua frente, não atrás de você. Mar pode aparecer. Sem apontar para banhista. " + COMO,
    dur:"75s", gesture:"Não prometa que o sonho se realiza. Convite para a sessão.",
    caption:"A energia sexual não é só desejo.\nNo Kaula, ela é matéria de vida.\nUma sessão pode abrir outra perspectiva. Não é garantia.\n\nakashahub.com.br/flow",
    beats:[
      {t:"Abre", say:"Tem uma força que a maioria usa sem olhar. A energia sexual.", lesson:"Tom baixo. Sem sorriso de anúncio.", screen:"A força."},
      {t:"Kaula", say:"No Kaula, essa força não é só desejo. É matéria de vida.", lesson:"Se travar no nome, fala devagar: Kau-la.", screen:"Kaula."},
      {t:"Perspectiva", say:"Uma experiência dessas pode te dar outra perspectiva do que você precisa viver.", lesson:"Pode. Não é vai.", screen:"Outra perspectiva."},
      {t:"Limite", say:"Não é mágica. Não é o sonho caindo no colo. É um corpo mais presente. E uma decisão mais limpa.", lesson:"Não prometa manifestação.", screen:"Não é mágica."},
      {t:"Fecha", say:"Se você quer sentir isso, e não só ouvir, a sessão está no link da bio.", screen:"Link na bio."}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 3", format:"Talking head", title:"A libido também cria",
    place:"Jardim botânico. Sombra de árvore, luz no rosto. Você parado. Sem filmar outras pessoas. " + COMO,
    dur:"80s", gesture:"Caminho, não cura. Sem julgamento.",
    caption:"A libido continua sexual.\nE também pode ser criativa. Espiritual.\nIsso não é promessa de largar a pornografia.\nÉ um caminho de consciência.\n\nakashahub.com.br/flow",
    beats:[
      {t:"Abre", say:"Muita gente prende essa energia num lugar só. A tela. A pornografia.", lesson:"Sem nojo. Sem piada.", screen:"A tela."},
      {t:"Olhar", say:"Eu não vou te xingar por isso. Eu vou te dizer o que eu vejo.", lesson:"Olho na câmera.", screen:"Sem julgamento."},
      {t:"Expansão", say:"Quando a consciência expande, a libido deixa de ser só consumo.", lesson:"Pausa.", screen:"Não é só consumo."},
      {t:"Três", say:"Ela continua sexual. E também fica criativa. Espiritual.", lesson:"As três. Não apague a primeira.", screen:"Sexual. Criativa. Espiritual."},
      {t:"Uso", say:"Você para de gastar a força inteira numa imagem. E começa a usar uma parte dela para criar a vida.", lesson:"Uma parte. Não diga que acaba com o hábito.", screen:"Criar a vida."},
      {t:"Limite", say:"Isso não é cura garantida. É um caminho. A sessão é um dia nesse caminho.", lesson:"Não prometa libertação.", screen:"Um dia no caminho."},
      {t:"Fecha", say:"O link está na bio.", screen:"Link na bio."}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 4", format:"Talking head", title:"Magnetismo",
    place:"Padaria. Do lado de fora, ou numa mesa sem fila atrás de você. Sem filmar o balcão em close. Sem logo grande. " + COMO,
    dur:"70s", gesture:"Convite para viver, não para uma aula de balcão.",
    caption:"Magnetismo é presença.\nTecnologia da Alma estuda corpo, mente e campo.\nFascinação, aqui, não é manipular.\nA sessão é onde isso se vive.\n\nakashahub.com.br/flow",
    beats:[
      {t:"Abre", say:"Magnetismo não é truque. É presença que o outro sente antes da frase.", lesson:"Sem gesto de mágico.", screen:"Presença."},
      {t:"Alma", say:"Tecnologia da Alma é o estudo disso. Corpo. Mente. Campo.", lesson:"Três palavras. Pausa em cada uma.", screen:"Corpo. Mente. Campo."},
      {t:"Fascinação", say:"Fascinação, no meu trabalho, não é manipular. É a pessoa ficar. Porque algo nela reconheceu.", lesson:"Não ensine técnica de influência.", screen:"Não é manipular."},
      {t:"Sessão", say:"A sessão de Flow é onde isso se vive. Não onde eu explico no balcão. Da mais leve à mais profunda.", lesson:"Não descreva a sessão.", screen:"Leve ou profunda."},
      {t:"Fecha", say:"Se fizer sentido, o link está na bio.", screen:"Link na bio."}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 5", format:"Talking head", title:"Por que só vinte e seis",
    place:"Posto. Na calçada da conveniência, longe da bomba. Sem placa de preço. Sem carro em movimento no fundo. " + COMO,
    dur:"110s", gesture:"Duas portas. Flow na bio. Legado em akashahub.com.br/al. Sem preço.",
    caption:"26 sessões de Flow no ano.\nPorque o outro trabalho é a Arquitetura de Legado.\nUm ano. Essência, oferta, dinheiro e ativo.\n24 encontros em grupo. 3 imersões. 3 individuais.\n\nSessão: akashahub.com.br/flow\nAno: akashahub.com.br/al",
    beats:[
      {t:"Abre", say:"Eu só faço vinte e seis sessões de Flow por ano. Porque eu tenho outro trabalho, do mesmo tamanho.", lesson:"Sem tom de quem pede desculpa.", screen:"26. E outro trabalho."},
      {t:"Nome", say:"Arquitetura de Legado. Não é curso solto. É um ano.", lesson:"Casa. Um ano.", screen:"Um ano."},
      {t:"Essência", say:"A gente começa pela essência. Quem você é. A história. A frase que outra pessoa consegue repetir.", lesson:"Sem pressa na lista.", screen:"Essência."},
      {t:"Império", say:"Aí isso vira oferta. Projeto digital. Empresa. Ativo. O que continua quando você sai da sala.", lesson:"Não prometa faturamento.", screen:"O que continua."},
      {t:"Dinheiro", say:"No mesmo ano entra o dinheiro. Precificar. Empacotar. Organizar o que entra e o que vaza.", lesson:"Três verbos.", screen:"Preço. Pacote. Caixa."},
      {t:"Números", say:"Vinte e quatro encontros em grupo. Três imersões presenciais. Três encontros individuais. Neles eu crio com você os ativos.", lesson:"Se travar, olha o /al. Não invente outro número.", screen:"24. 3. 3."},
      {t:"Não é conversa", say:"Não fica só na conversa. Tem condução. Tem entrega.", lesson:"Não detalhe a plataforma aqui. O próximo vídeo faz isso.", screen:"Não fica na conversa."},
      {t:"Fecha", say:"Se você quer o dia, o Flow está na bio. Se você quer o ano, me chama no /al. Não é a mesma porta.", screen:"Duas portas."}
    ]
  },
  {
    kind:"flow", who:"yan", day:"Flow 6", format:"Talking head", title:"Escolhe o caminho",
    place:"No condomínio. Portaria ao longe, sem placa de apartamento. Ou o jardim interno. Você parado. " + COMO,
    dur:"100s", gesture:"Três portas. Sem dizer que uma é melhor. Sem prometer viral.",
    caption:"Flow, Arquitetura de Legado e a área de membros não se contradizem.\nVocê escolhe a porta.\n\nA plataforma acompanha o ano. O grupo estuda presença, marca, venda, automação e o mundo em volta.\nEu não prometo viral.\n\nSessão: akashahub.com.br/flow\nAno: akashahub.com.br/al",
    beats:[
      {t:"Abre", say:"Nada disso se contradiz. Flow. Arquitetura de Legado. A área de membros. É a mesma ressonância. Em portas diferentes.", lesson:"Três nomes. Pausa.", screen:"Três portas."},
      {t:"Plataforma", say:"Na mentoria tem uma plataforma. Ela acompanha o ano. Você vê o que vem. Pode adiantar o que já está pronto para você.", lesson:"Não diga que o jogo faz a empresa sozinho.", screen:"A plataforma acompanha."},
      {t:"Grupo", say:"Tem grupo. Lá a gente estuda como aparecer. E como não aparecer, e ainda assim criar audiência.", lesson:"Os dois. Aparecer e não aparecer.", screen:"Aparecer. Ou não."},
      {t:"Estudo", say:"Marca. Venda. Automação. Inteligência artificial. Finanças. E o mundo em volta. Sociologia. Política.", lesson:"Lista curta. Sem virar grade de curso.", screen:"Marca. Venda. Mundo."},
      {t:"Limite", say:"Eu não prometo viral. Eu prometo clareza, e um lugar para praticar.", lesson:"Rosto sério nesta frase.", screen:"Sem promessa de viral."},
      {t:"Escolha", say:"Você escolhe o caminho. A sessão. O ano. Ou o estudo.", lesson:"Não empurre uma porta.", screen:"Você escolhe."},
      {t:"Fecha", say:"O link do Flow e o link do /al estão na bio.", lesson:"Para.", screen:"Dois links."}
    ]
  }
];

function mountFlow(list){
  const note = document.createElement("p");
  note.className = "note";
  note.textContent = "Flow. Seis talking heads. Sem a sala. Casa, praia, jardim botânico, padaria, posto e condomínio. A linha lilás não entra na fala. 26 sessões é limite real. Legado é o ano: 24 em grupo, 3 imersões, 3 individuais. Sem preço. Sem promessa de cura, de manifestação ou de viral.";
  list.append(note);
  FLOW_REELS.forEach((s, i)=>{
    const el = document.createElement("button");
    el.type = "button";
    el.className = "card flow";
    el.dataset.who = "yan";
    el.innerHTML = '<div class="num">F'+(i+1)+'</div><div><div class="tag">Flow · Talking head · '+esc(s.dur)+'</div><h2>'+esc(s.title)+'</h2><div class="meta">'+esc(s.place.split(". ")[0])+'<br>'+esc(s.gesture)+'</div></div><div class="open meta">Abrir</div>';
    el.onclick = ()=>openScript(s);
    list.append(el);
  });
}
window.mountFlow = mountFlow;
