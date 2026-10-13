/* Boas-vindas da hero do /al. Não altera reel, story, TikTok nem live. */
const BOAS_VINDAS = {
  kind: "al",
  who: "yan",
  day: "Hero /al",
  format: "Talking head",
  title: "Bem-vindo à casa",
  place: "Em casa. Câmera na altura dos olhos. Luz da janela de lado. Peito para cima. Sem slide.",
  dur: "4 min a 4 min 30",
  gesture: "Quem se reconheceu, aplica para a sessão. Sem preço na fala.",
  caption: "Arquitetura de Legado é uma casa de um ano.\n\nPode ser o ofício que só a sua mão faz. Pode ser a academia que já tem catraca e não tem cultura digital. Pode ser a festa e o passeio que perdem o detalhe.\n\nA primeira sessão é para ver se faz sentido. Não confirma entrada.",
  beats: [
    {t:"Chegada", say:"Oi. Eu sou o Yan. Se você chegou aqui sem saber direito o que é isso, fica. Eu explico do jeito que eu conduzo. Sem pressa.", lesson:"Sorri. Não apresenta currículo."},
    {t:"O que é", say:"Arquitetura de Legado é uma casa de um ano. Não é um curso. Não são três mentorias empilhadas. É uma condução para quem já sabe fazer alguma coisa, e ainda não transformou isso numa estrutura que outra pessoa entende. E que continua quando você sai da sala.", lesson:"Casa. Um ano. Não é curso."},
    {t:"Como começa", say:"A gente começa pela essência. Quem você é. A história que o trabalho carrega. O que você aprendeu sobre dinheiro, autoridade e merecimento. O que você honra, e o que você encerra. Isso vira um dossiê. O que você contou fica separado do que eu li. E os dois ficam separados do que a gente decidiu. A entrega dessa parte é o dossiê, e uma frase que outra pessoa consegue repetir.", lesson:"Devagar em relato, hipótese, decisão. Não use essas palavras se travar. Diga: o que você contou, o que eu li, o que a gente decidiu."},
    {t:"O que se constrói", say:"Aí a essência vira a casa digital. Não no sentido de palco. Posicionamento. Linguagem. Uma oferta com começo, meio e fim. O primeiro ativo. Um, não dez. Um lugar onde a pessoa entende o que você faz antes de sentar com você.", lesson:"Uma oferta. Um ativo."},
    {t:"O dinheiro", say:"No mesmo ano entra o dinheiro. Não como promessa. Como leitura. O que entra. O que vaza. O que é essencial. O que é gosto. Como você cobra sem pedir desculpa no fim da frase. Como você fecha sem empurrar. Isso não espera o site ficar pronto. Se o projeto precisa vender no segundo mês, a gente olha a venda no segundo mês.", lesson:"Sem número. Sem meta."},
    {t:"Corpo e atenção", say:"Tem uma camada que atravessa o ano. Corpo, mente e o lugar onde você decide. A tensão que escolhe antes de você. A crença que você trata como fato. O ambiente que puxa a semana. Isso não é um terceiro produto. É o que impede a casa de ficar só no papel.", lesson:"Não diga que a ciência provou. É prática."},
    {t:"Quando você sai", say:"E tem a parte em que o trabalho deixa de morar só na sua voz. Uma etapa escrita. Entrada e saída. Uma rotina. Alguém que consegue repetir. No fim, a visão, as pessoas, e o que permanece quando você não está.", lesson:"Pausa antes de permanece."},
    {t:"Não é uma caixa", say:"Não é uma caixa rígida. A ordem organiza. Não prende. A solução não é uma só. Em um ano pode existir a frase, a oferta, a casa digital, a leitura do dinheiro e uma etapa que não depende de você o tempo todo. Nem todo mundo chega em tudo. A gente começa pelo que já está travando.", lesson:"Várias soluções. Um limite honesto."},
    {t:"Antes das imagens", say:"Deixa eu te dar umas imagens. Não são clientes meus. Não são resultado. São jeitos de chegar, para você se ver dentro.", lesson:"Dizer isso antes. Sem pressa."},
    {t:"Ofício", say:"Imagina que você tem uma marca. Vende uma peça que só você sabe fazer. Decoração, acessório, macramê, crochê, ou outra arte. Não precisa ser artesanato. A demanda chegou. A sua mão não chega. Você trava.", lesson:"Pausa em trava."},
    {t:"Academia do ofício", say:"Agora imagina uma academia do seu ofício. O padrão e o valor da marca ficam fáceis de ensinar. Outras mãos trabalham com você. O combinado é claro, justo, e lucrativo para os dois lados. Você também pode cobrar pela aula. Quem aprende pode virar a sua produção. Uma comunidade que lucra. Dá para crescer aqui e fora do país. E o sistema não fica preso em você.", lesson:"Justo para os dois. Não é fábrica explorando gente."},
    {t:"O que a casa guarda", say:"A cultura da empresa passa por uma área de membros. Curso salvo. Gravação. Roteiro. Até o jeito de gravar. A engenharia digital, a arquitetura, os ativos. A gente desenha isso para o império funcionar como legado. Você sai da mesa. O padrão continua.", lesson:"Lista curta. Não vira catálogo."},
    {t:"Academia com catraca", say:"Ou imagina uma academia. Ou uma escola de arte marcial. Você já tem catraca. O aluno entra no prédio. A cultura da empresa não entra com ele. Falta uma casa digital. Ali o dono reforça a política. O professor posta o detalhe técnico. O funcionário vê uma orientação de dinheiro. E só dono, sócio ou franqueado controla quem acessa o quê.", lesson:"Não citar marca de catraca. Não prometer integração."},
    {t:"Salas e eventos", say:"Imagina as lives dos eventos grandes salvas. Quem foi e quem não foi assiste depois. Só quem é da casa. Uma sala para franqueado. Outra para sócio. Outra para aluno e professor. Isso ajuda o treino. Ajuda o RH. Ajuda o alinhamento da cultura. E o vendedor não perde a informação que foi dita uma vez.", lesson:"Três salas. Devagar."},
    {t:"Festa e passeio", say:"Imagina um negócio de festa, passeio, turismo. O evento acontece. O detalhe se perde. Cada processo mora num login diferente. Imagina a sua própria casa digital, com um jogo claro. O que a pessoa faz. O que ela ganha. O que fica registrado. Pagamento dentro da casa, com menos porta solta e mais clareza de quem entrou. A engenharia a gente desenha com o que o negócio pede. Não é taxa zero. Não é um aplicativo mágico no primeiro mês.", lesson:"Não prometa fim de API nem taxa menor como garantia."},
    {t:"Imagem um", say:"Tem outras portas, do mesmo tamanho. Imagina uma clínica. Anos de sala. O método está na sua cabeça. Cada pessoa ouve uma versão. No ano, o método ganha nome, a frase fica repetível, e a primeira oferta deixa de ser hora solta.", lesson:"As três de antes continuam. Mais curtas."},
    {t:"Imagem dois", say:"Imagina um escritório que já trabalha, já recebe, e ainda se explica mal. Quem indica não sabe repetir o que vocês fazem. A gente tira a frase, e o limite do que vocês não fazem. Aí a indicação para de inventar vocês.", lesson:"Sem faturamento."},
    {t:"Imagem três", say:"Imagina uma empresa de família. Quando você sai, a operação senta. Não falta talento. Falta uma etapa no papel, e alguém que consiga seguir sem te ligar. Pode ser também um livro que ainda não conversa com a mentoria. Ou aula avulsa que pede um ciclo. Ou um conhecimento que hoje só anda de boca em boca. A casa é a mesma. A porta muda.", lesson:"Três portas. Uma casa."},
    {t:"O que eu não faço", say:"O que eu não faço. Eu não prometo faturamento, seguidor ou cura. Eu não invento um produto se o seu já existe. Eu não trato uma leitura espiritual como se fosse prova.", lesson:"Rosto sério. Sem sorriso aqui."},
    {t:"Convite", say:"Se fez sentido, o próximo passo é uma sessão de arquitetura. A gente vê o que você já tem, e se a minha condução cabe. Aplicar não confirma a entrada. A primeira conversa é para organizar. Não tem cobrança.", lesson:"Uma vez. Sem urgência."},
    {t:"Chave", say:"Se não fizer sentido, você já sai com uma imagem. Uma frase. Quem você ajuda. Qual problema. Por qual caminho. Eu te espero.", lesson:"Sorri de novo. Para."}
  ]
};

function mountWelcome(list){
  const note = document.createElement("p");
  note.className = "note";
  note.textContent = "Boas-vindas. Só para a hero do /al. Talking head. Não substitui reel, story, TikTok nem live. Sem preço. Os exemplos são imagens, não cases. Ofício, academia e festa vêm primeiro.";
  list.append(note);
  const s = BOAS_VINDAS;
  const el = document.createElement("button");
  el.type = "button";
  el.className = "card welcome";
  el.dataset.who = "yan";
  el.innerHTML = '<div class="num">AL</div><div><div class="tag">Hero do /al · Talking head</div><h2>'+esc(s.title)+'</h2><div class="meta">'+esc(s.dur)+' · em casa<br>'+esc(s.gesture)+'</div></div><div class="open meta">Abrir</div>';
  el.onclick = ()=>openScript(s);
  list.append(el);
}
window.mountWelcome = mountWelcome;
