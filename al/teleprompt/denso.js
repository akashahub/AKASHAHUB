/* TikTok denso + operação. A linha lilás (lesson) e o "na tela" (screen) não são falados. */
const DENSO = [
  {
    kind:"denso", who:"yan", day:"Denso 01", format:"TikTok denso", dur:"110s",
    title:"O inverno que ninguém lembra",
    place:"Rosto perto, fundo neutro. Sem sorriso no hook. Você volta no quadro no gancho e no CTA.",
    gesture:"Comenta: CÓDIGO",
    eixo:"Códigos de Origem · corpo, mente, campo",
    caption:"Em 1944–45, o oeste da Holanda passou fome. Décadas depois, o corpo de quem estava na barriga ainda carregava marca.\n\nFato e leitura não são a mesma coisa.\n\nComenta CÓDIGO.",
    beats:[
      {t:"Hook", say:"Em 1945, milhares de bebês nasceram carregando um inverno de que nenhum deles se lembra.",
        lesson:"Back-end: tarja vermelha “O inverno que ninguém lembra”. Olhar direto. Não explica ainda.",
        screen:"O inverno que ninguém lembra"},
      {t:"Objeto", say:"Holanda. Inverno de 1944 para 1945. O oeste do país fica sem comida. A ração oficial média fica em torno de seiscentas e setenta calorias por dia. Em abril, chega perto de quinhentas.",
        lesson:"Fonte: Heijmans e colegas, PNAS, 2008, descrevem a média de 667 kcal. Outras fontes do mesmo evento citam cerca de 500 kcal em abril de 1945. Não arredondar para “cem”.",
        screen:"B-roll: mapa da Holanda, cartão de racionamento, fila"},
      {t:"História", say:"Chamaram de Hongerwinter. Inverno da fome. A estimativa mais citada fica em torno de vinte mil mortos. E, no meio disso, mulheres grávidas continuaram gerando.",
        lesson:"Pausa antes de “gerando”. Vinte mil é a faixa citada, não um número de certidão. Se quiser mais preciso na edição: entre dezoito e vinte e dois mil.",
        screen:"Hongerwinter · ~20 mil"},
      {t:"Virada", say:"A guerra acaba. A comida volta. Aqueles bebês crescem. Décadas depois, pesquisadores passam a seguir essa geração.",
        lesson:"Nome de estudo, se couber na tarja: Dutch Hunger Winter Families. Não precisa falar o inglês.",
        screen:"Décadas depois"},
      {t:"Tensão", say:"São dois achados, não um. Quem passou a fome no começo da gestação apareceu, adulto, com mais obesidade e mais doença do coração. E, em 2008, um outro trabalho comparou irmãos. Quem foi concebido durante a fome tinha, sessenta anos depois, um pouco menos de metilação num trecho do gene IGF2. A diferença é de cerca de cinco por cento. É associação. Não é prova de que a marca causou a doença.",
        lesson:"Fontes: coorte da fome holandesa (Roseboom e outros) para saúde adulta; Heijmans et al., PNAS 2008, para IGF2, exposição periconcepcional, irmãos do mesmo sexo. Não dizer “a epigenética provou o campo”. Transmissão para neto é debatida: não entra.",
        screen:"2008 · irmãos · IGF2"},
      {t:"Gancho", say:"A parte que mais me interessa não é o exame.",
        lesson:"Aproxima o quadro. Convite mudo: manda para quem diz que “é só psicológico”.",
        screen:"Não é o exame"},
      {t:"Decodificação", say:"O corpo guardou um ambiente que a mente não viveu. Eu não leio isso como destino. Eu leio como corpo, mente e campo. Tem padrão seu que não nasceu de uma escolha. Nasceu de um inverno que você nem sabe nomear.",
        lesson:"Aqui começa a leitura do método. Falar “eu leio”. Não falar “a ciência provou”.",
        screen:"Corpo. Mente. Campo."},
      {t:"Pergunta", say:"Quantos dos seus “eu sempre fui assim” são um inverno que você não viveu?",
        lesson:"Pausa. Deixa a pergunta no ar.",
        screen:"Eu sempre fui assim?"},
      {t:"CTA", say:"Se você quer olhar o padrão, e não só o sintoma, comenta CÓDIGO.",
        lesson:"Uma palavra. Sem preço. Sem nome de mentoria.",
        screen:"Comenta CÓDIGO"}
    ]
  },
  {
    kind:"denso", who:"yan", day:"Denso 02", format:"TikTok denso", dur:"100s",
    title:"O mesmo debate, dois vencedores",
    place:"Rosto perto. Você some no meio e volta na correção da lenda.",
    gesture:"Comenta: PRESENÇA",
    eixo:"Tecnologia da Alma · presença",
    caption:"26 de setembro de 1960. O primeiro debate na televisão. A lenda do rádio é mais fraca do que repetem. A presença, não.\n\nComenta PRESENÇA.",
    beats:[
      {t:"Hook", say:"Em 1960, o mesmo debate teve duas leituras. Dependia de onde você estava.",
        lesson:"Não abrir com “Nixon perdeu no rádio”. Essa frase é a lenda, e a gente corrige ela no meio.",
        screen:"Dois vencedores"},
      {t:"Objeto", say:"Vinte e seis de setembro. Chicago. O primeiro debate presidencial transmitido pela televisão nos Estados Unidos. De um lado, Kennedy. Do outro, Nixon.",
        lesson:"Estúdio da CBS em Chicago. Não precisa do nome da emissora se apertar o tempo.",
        screen:"26 set 1960 · Chicago"},
      {t:"História", say:"Nixon tinha saído do hospital. Infecção no joelho. Chegou pálido. Recusou maquiagem. Kennedy tinha tomado sol. Na tela, um parecia vivo. O outro, doente.",
        lesson:"Fato de bastidor, documentado nas crônicas do debate. B-roll: foto do debate, preto e branco, os dois no púlpito.",
        screen:"B-roll: o debate, 1960"},
      {t:"Virada", say:"Quem viu pela televisão saiu achando que Kennedy tinha ganhado. A lenda completa diz outra coisa. Que quem ouviu pelo rádio deu a vitória ao Nixon.",
        lesson:"Tom de quem vai corrigir, não de quem confirma a lenda.",
        screen:"Televisão · rádio"},
      {t:"Tensão", say:"Essa segunda parte é mais fraca do que repetem. O levantamento que sustenta a história do rádio é pequeno, e historiadores discutem ele até hoje. O que ficou firme é o outro lado. Na tela, a presença mudou a leitura do mesmo conteúdo.",
        lesson:"Não citar Sindlinger como prova. Dizer que o dado é fraco. A autoridade do Akasha aqui é recusar a lenda bonita.",
        screen:"A lenda é mais fraca"},
      {t:"Gancho", say:"E é isso que quase ninguém leva para a própria vida.",
        lesson:"Quadro perto.",
        screen:"Quase ninguém"},
      {t:"Decodificação", say:"As palavras eram as mesmas. O campo em volta delas, não. Presença não é carisma de palco. É o que o corpo faz antes da primeira frase. Eu treino isso como tecnologia. Não como dom.",
        lesson:"Leitura: Tecnologia da Alma. Não vender o curso.",
        screen:"Antes da primeira frase"},
      {t:"Pergunta", say:"Se tirassem a sua imagem e deixassem só a sua voz, a sua frase ainda se sustentava?",
        lesson:"Pergunta prática. Não é ataque.",
        screen:"Só a voz."},
      {t:"CTA", say:"Se você quer treinar presença sem teatro, comenta PRESENÇA.",
        lesson:"Uma palavra.",
        screen:"Comenta PRESENÇA"}
    ]
  },
  {
    kind:"denso", who:"yan", day:"Denso 03", format:"TikTok denso", dur:"100s",
    title:"O nome sobreviveu por causa dela",
    place:"Rosto perto. Tom seco. Sem trilha emotiva de “gênio incompreendido”.",
    gesture:"Comenta: LEGADO",
    eixo:"Arquitetura de Legado",
    caption:"Van Gogh morreu em 1890. A estrutura que segurou o nome foi construída por Johanna van Gogh-Bonger.\n\nTalento sem casa desaparece.\n\nComenta LEGADO.",
    beats:[
      {t:"Hook", say:"O pintor morreu pobre. O nome não. E não foi o talento que segurou o nome.",
        lesson:"Não falar “gênio”. A história é de estrutura.",
        screen:"Não foi o talento"},
      {t:"Objeto", say:"Vincent van Gogh morre em vinte e nove de julho de 1890. A venda de quadro documentada que todo mundo cita, em vida, é uma. A Vinha Vermelha. Quatrocentos francos. Para Anna Boch.",
        lesson:"Há debate se houve outras vendas pequenas. Por isso: “a venda documentada que todo mundo cita”, não “a única da história”.",
        screen:"29 jul 1890 · 400 francos"},
      {t:"História", say:"O irmão, Theo, morre seis meses depois. O que sobra — quadros, desenhos, cartas — vai para a viúva. Johanna van Gogh-Bonger.",
        lesson:"Theo morre em 25 de janeiro de 1891. B-roll: retrato dela, se a imagem for de domínio público. Se não, capa das cartas.",
        screen:"Johanna van Gogh-Bonger"},
      {t:"Virada", say:"Ela não leiloa tudo de uma vez. Organiza. Traduz carta. Empresta com critério. Segura a coleção até o nome existir sem o pintor na sala.",
        lesson:"Esse é o gesto de arquitetura. Devagar na frase “não leiloa tudo”.",
        screen:"Não leiloa tudo"},
      {t:"Tensão", say:"Sem essa casa, o talento vira estoque de família. Com essa casa, vira patrimônio que atravessa século.",
        lesson:"Não inventar valor de mercado atual. Não precisa.",
        screen:"Estoque ou patrimônio"},
      {t:"Gancho", say:"A parte incômoda é que isso não é sobre pintura.",
        lesson:"Quadro perto.",
        screen:"Não é sobre pintura"},
      {t:"Decodificação", say:"Obra sem estrutura desaparece com a pessoa. Eu chamo isso de arquitetura de legado. Não é posteridade. É entrada, guarda e saída. Alguém que não seja você precisa conseguir carregar aquilo.",
        lesson:"Leitura do método. Uma frase de operação, sem abrir a mentoria.",
        screen:"Entrada. Guarda. Saída."},
      {t:"Pergunta", say:"Se você saísse da sala amanhã, o que você construiu ainda teria nome?",
        lesson:"Pergunta. Sem pressão de compra.",
        screen:"Ainda teria nome?"},
      {t:"CTA", say:"Se você quer ver a sua obra como casa, e não como talento solto, comenta LEGADO.",
        lesson:"Uma palavra.",
        screen:"Comenta LEGADO"}
    ]
  },
  {
    kind:"denso", who:"yan", day:"Denso 04", format:"TikTok denso", dur:"105s",
    title:"Sexta-feira treze não nasceu ali",
    place:"Rosto perto. Sem estética de terror. Isto é história de poder.",
    gesture:"Comenta: CARÁTER",
    eixo:"Paladins · caráter e poder",
    caption:"13 de outubro de 1307. Filipe IV prende os Templários. A superstição da sexta-feira 13 foi colada nessa data muito depois.\n\nPoder reescreve a história. Caráter é outra coisa.\n\nComenta CARÁTER.",
    beats:[
      {t:"Hook", say:"Sexta-feira treze não nasceu de um azar. Nasceu de uma operação. E depois a operação foi mal contada.",
        lesson:"O hook é verdadeiro na primeira metade e já avisa a correção na segunda. Não afirmar que a superstição medieval começou nesse dia.",
        screen:"Não foi azar"},
      {t:"Objeto", say:"Treze de outubro de 1307. Uma sexta-feira. Filipe IV, rei da França, manda prender os Templários ao mesmo tempo. De madrugada.",
        lesson:"Ordem executada com Guillaume de Nogaret. B-roll: mapa de Paris, selo real, não filme de cavaleiro.",
        screen:"13 out 1307"},
      {t:"História", say:"A Ordem era credora da coroa. Tinha terra. Tinha caixa. O rei devia. A prisão resolve o caixa e a narrativa. Vem tortura. Vem confissão. Em 1312 a Ordem é dissolvida. Em 1314, Jacques de Molay é queimado em Paris.",
        lesson:"Datas firmes: bula e Concílio de Vienne, 1312; execução de Molay, 18 de março de 1314. Não detalhar tortura.",
        screen:"1312 · 1314"},
      {t:"Virada", say:"Séculos depois, alguém cola essa sexta-feira no medo popular do número treze. A cola pega. A operação some. Fica o azar.",
        lesson:"A ligação Templários–sexta-feira 13 é popularização moderna, não registro medieval. Dizer “séculos depois”.",
        screen:"A cola pega"},
      {t:"Tensão", say:"É assim que poder sem caráter trabalha. Não só toma. Reescreve o calendário, até a violência virar superstição.",
        lesson:"Aqui é leitura, já anunciada pelo gancho histórico. Tom seco.",
        screen:"Reescreve o calendário"},
      {t:"Gancho", say:"E o detalhe que muda a história é este.",
        lesson:"Pausa.",
        screen:"O detalhe"},
      {t:"Decodificação", say:"Poder não cria caráter. Amplifica o que já estava lá. Num rei, vira prisão em massa. Numa pessoa comum, vira atalho quando ninguém está olhando. Paladino, no jeito que eu uso a palavra, é o oposto do atalho.",
        lesson:"Não abrir Franz Bardon neste corte. Um conceito só.",
        screen:"Poder amplifica"},
      {t:"Pergunta", say:"Quando ninguém registra, você ainda faz o que faria em público?",
        lesson:"A pergunta é o teste de caráter. Sem moralismo.",
        screen:"Quando ninguém registra"},
      {t:"CTA", say:"Se você quer estudar caráter como prática, e não como discurso, comenta CARÁTER.",
        lesson:"Uma palavra.",
        screen:"Comenta CARÁTER"}
    ]
  },
  {
    kind:"denso", who:"yan", day:"Denso 05", format:"TikTok denso", dur:"95s",
    title:"O número da loteria que não existe",
    place:"Rosto perto. Você desmente o número antes de contar o estudo.",
    gesture:"Comenta: VETOR",
    eixo:"Alinhamento Financeiro",
    caption:"“Setenta por cento dos ganhadores quebram.” Esse número circula sem estudo.\n\nO estudo que existe é menor, e diz outra coisa.\n\nComenta VETOR.",
    beats:[
      {t:"Hook", say:"Setenta por cento dos ganhadores de loteria quebram. Esse número não tem estudo embaixo.",
        lesson:"Desmentir primeiro. A autoridade começa na recusa. Não repetir 70% como fato em nenhum quadro.",
        screen:"Esse número não existe"},
      {t:"Objeto", say:"Ele circula há anos, atribuído a uma fundação de educação financeira. A fundação não publicou essa pesquisa. O dado é lenda com cara de planilha.",
        lesson:"NEFE é a instituição citada na lenda. Não alongar o nome se a fala apertar: “uma fundação americana”.",
        screen:"Lenda com cara de planilha"},
      {t:"História", say:"O estudo que existe é outro. 1978. Brickman, Coates e Janoff-Bulman. Vinte e dois ganhadores de loteria, comparados com gente que não ganhou.",
        lesson:"Journal of Personality and Social Psychology, 1978. Amostra pequena: falar o vinte e dois.",
        screen:"1978 · 22 ganhadores"},
      {t:"Virada", say:"Os ganhadores não ficaram mais felizes do que o grupo de controle. E passaram a sentir menos prazer nas coisas comuns. O prêmio chegou. O cotidiano, não.",
        lesson:"Não dizer que “quebraram”. O achado é adaptação e prazer cotidiano, não falência.",
        screen:"O prêmio chegou. O cotidiano, não."},
      {t:"Tensão", say:"Vinte e dois casos não explicam um país. Explicam um mecanismo. Dinheiro novo entra numa relação antiga com a falta. A falta não se aposenta porque o saldo mudou.",
        lesson:"Limite do n pequeno, falado. Isso protege o vídeo.",
        screen:"Vinte e dois não são um país"},
      {t:"Gancho", say:"É por isso que eu não começo alinhamento pelo extrato.",
        lesson:"Primeira pessoa. Sem oferecer sessão.",
        screen:"Não começa pelo extrato"},
      {t:"Decodificação", say:"Extrato mostra o rastro. Não mostra o vetor. Corpo, decisão e campo em volta do dinheiro continuam operando a mesma peça. Mudar o saldo sem mudar a peça é trocar o cenário e deixar o personagem.",
        lesson:"Leitura de Alinhamento Financeiro. Não listar os sete vetores aqui. Um princípio.",
        screen:"O saldo não é a peça"},
      {t:"Pergunta", say:"Se o seu saldo dobrasse amanhã, qual decisão sua continuaria exatamente igual?",
        lesson:"Pergunta de diagnóstico. A pessoa se vê.",
        screen:"O que não mudaria?"},
      {t:"CTA", say:"Se você quer olhar a peça, e não só o saldo, comenta VETOR.",
        lesson:"Uma palavra.",
        screen:"Comenta VETOR"}
    ]
  },
  {
    kind:"denso", who:"yan", day:"Denso 06", format:"TikTok denso", dur:"90s",
    title:"A web foi um memorando",
    place:"Rosto perto. Sem tomada de código na tela. A história é o papel.",
    gesture:"Comenta: SISTEMA",
    eixo:"Tech Hub · Império Digital",
    caption:"Março de 1989. Tim Berners-Lee entrega um memorando no CERN. O chefe escreve na capa: vago, mas empolgante.\n\nSistema nasce de uma frase, não de um aplicativo.\n\nComenta SISTEMA.",
    beats:[
      {t:"Hook", say:"A web não nasceu num aplicativo. Nasceu numa margem de papel, com quatro palavras de um chefe.",
        lesson:"As quatro palavras entram já no objeto, para o hook não entregar tudo.",
        screen:"Quatro palavras"},
      {t:"Objeto", say:"Março de 1989. CERN, na Suíça. Tim Berners-Lee entrega um memorando. O título é proposta de gestão da informação. O chefe, Mike Sendall, escreve na capa: vago, mas empolgante.",
        lesson:"“Information Management: A Proposal”. “Vague but exciting”. Falar em português.",
        screen:"Março 1989 · CERN"},
      {t:"História", say:"O problema dele não era ficar famoso. Era achar um documento, escrito por outra pessoa, em outro prédio, sem pedir favor. Cientista perdia tempo caçando papel.",
        lesson:"B-roll: corredor de laboratório, papel, não stock de hacker com capuz.",
        screen:"Achar o documento"},
      {t:"Virada", say:"A proposta podia ter morrido na gaveta. Não morreu porque virou sistema. Endereço, ligação, página. Uma coisa que outro conseguia usar sem o autor do lado.",
        lesson:"Não fazer aula de HTML.",
        screen:"Sem o autor do lado"},
      {t:"Tensão", say:"A maior parte de quem “está no digital” faz o contrário. Publica peça. Não constrói a casa onde a peça mora. Aí o alcance sobe e o patrimônio continua zero.",
        lesson:"Ligação com Império Digital / legado. Sem atacar profissão.",
        screen:"Peça não é casa"},
      {t:"Gancho", say:"Vago, mas empolgante, não é elogio. É prazo.",
        lesson:"Frase de corte. Pode voltar como texto final.",
        screen:"É prazo"},
      {t:"Decodificação", say:"Ideia sem sistema é humor interno. Sistema é o que outra pessoa opera na segunda-feira. Eu leio código assim. Não como dom de programador. Como arquitetura.",
        lesson:"Tech Hub em linguagem de doze anos, sem lista de linguagens.",
        screen:"Outra pessoa. Segunda-feira."},
      {t:"Pergunta", say:"O que você sabe fazer hoje ainda precisa de você na sala para existir?",
        lesson:"Pergunta.",
        screen:"Precisa de você na sala?"},
      {t:"CTA", say:"Se você quer ver o digital como sistema, e não como poste, comenta SISTEMA.",
        lesson:"Uma palavra.",
        screen:"Comenta SISTEMA"}
    ]
  }
];

const OPS = [
  {
    kind:"ops", who:"yan", day:"Op 01", format:"Operação", dur:"55s",
    title:"Três portas antes do dinheiro",
    place:"Rosto perto. Um dedo por item. Sem gráfico.",
    gesture:"Comenta: PORTA",
    eixo:"Códigos de Origem",
    caption:"Antes de decidir dinheiro, três portas. Corpo. Mente. Campo.\n\nSe uma estiver torta, o sim sai cedo.\n\nComenta PORTA.",
    beats:[
      {t:"Corte", say:"Antes de dizer sim para dinheiro, eu passo por três portas. Se uma estiver torta, o sim é cedo.",
        lesson:"Não é os sete vetores. É o tripé do livro. Não abrir os vetores.",
        screen:"Três portas"},
      {t:"1", say:"Corpo. Dormiu. Comeu. Está decidindo no cansaço ou na pressa. Decisão financeira em corpo cansado é outra pessoa falando.",
        lesson:"Gesto 1 na tela.",
        screen:"1 · Corpo"},
      {t:"2", say:"Mente. Qual frase está mandando. “Eu mereço.” “Eu sempre perco.” “Todo mundo tem.” A frase não é detalhe. É o operador.",
        lesson:"Uma frase, não terapia.",
        screen:"2 · Mente"},
      {t:"3", say:"Campo. Com quem você está decidindo. O ambiente empurra gasto, prova e comparação. Se o campo estiver gritando, sai da sala e decide de novo.",
        lesson:"Campo aqui é ambiente e relação, não entidade.",
        screen:"3 · Campo"},
      {t:"Chave", say:"Três portas. Uma torta, o sim espera. Comenta PORTA se você for fazer isso na próxima decisão.",
        lesson:"CTA de uma palavra.",
        screen:"Comenta PORTA"}
    ]
  },
  {
    kind:"ops", who:"yan", day:"Op 02", format:"Operação", dur:"50s",
    title:"A frase que outra pessoa repete",
    place:"Rosto perto. Você fala a estrutura devagar, uma vez.",
    gesture:"Comenta a sua frase em três linhas",
    eixo:"Arquitetura de Legado · identidade",
    caption:"Quem você ajuda. Qual problema. Por qual caminho.\n\nSe a outra pessoa não consegue repetir, a frase ainda é sua.",
    beats:[
      {t:"Corte", say:"Se alguém te apresenta e inventa você, a frase ainda não existe. Ela tem três linhas. Só três.",
        lesson:"Operação já usada na vitrine. Aqui é a versão lista, para quem não viu o reel.",
        screen:"Três linhas"},
      {t:"1", say:"Quem você ajuda. Gente concreta. Não “pessoas que querem evoluir”.",
        lesson:"Cortar abstrato.",
        screen:"1 · Quem"},
      {t:"2", say:"Qual problema acaba, ou diminui, quando entram com você. Um problema. Não o catálogo.",
        lesson:"Um problema.",
        screen:"2 · Problema"},
      {t:"3", say:"Por qual caminho. O nome do processo, não o seu diploma.",
        lesson:"Caminho, não cargo.",
        screen:"3 · Caminho"},
      {t:"Chave", say:"Manda as três linhas para uma pessoa hoje. Se ela travar ao repetir, a frase ainda está grande.",
        lesson:"O teste é a repetição por outro. Sem link.",
        screen:"Manda as três linhas"}
    ]
  },
  {
    kind:"ops", who:"yan", day:"Op 03", format:"Operação", dur:"50s",
    title:"Uma etapa. Não o ano inteiro.",
    place:"Rosto perto. Pode ter papel na mão. Não mostra nome de cliente.",
    gesture:"Comenta: ETAPA",
    eixo:"Arquitetura de Legado · operação",
    caption:"Uma etapa que hoje só existe na sua cabeça.\n\nEntrada. O que acontece. Saída.\n\nComenta ETAPA.",
    beats:[
      {t:"Corte", say:"Não escreve o negócio inteiro. Escreve a etapa que, se você sai, a segunda-feira para.",
        lesson:"Uma. A que se repete.",
        screen:"A que a segunda para"},
      {t:"1", say:"Entrada. O que chega. De quem. Em que forma. Se não tem entrada, não é etapa. É favor.",
        lesson:"Entrada visível.",
        screen:"1 · Entrada"},
      {t:"2", say:"O que acontece no meio. Três verbos. Não um discurso.",
        lesson:"Três verbos.",
        screen:"2 · Três verbos"},
      {t:"3", say:"Saída. O que a outra pessoa recebe, e como sabe que acabou.",
        lesson:"Critério de acabou.",
        screen:"3 · Saída"},
      {t:"Chave", say:"Uma etapa hoje. O resto espera. Comenta ETAPA quando escrever a entrada e a saída.",
        lesson:"Não pedir o processo todo.",
        screen:"Comenta ETAPA"}
    ]
  },
  {
    kind:"ops", who:"yan", day:"Op 04", format:"Operação", dur:"50s",
    title:"Antes da primeira frase",
    place:"Rosto perto. Você faz cada gesto uma vez, devagar, sem aula de palco.",
    gesture:"Comenta: ANTES",
    eixo:"Tecnologia da Alma",
    caption:"Pé. Ar. Olho. Primeira frase.\n\nPresença é o que acontece antes de você falar.\n\nComenta ANTES.",
    beats:[
      {t:"Corte", say:"Presença não começa na frase. Começa no que o corpo faz nos três segundos anteriores.",
        lesson:"Quatro gestos. Não é curso de oratória.",
        screen:"Três segundos antes"},
      {t:"1", say:"Pé. Os dois no chão. Se um está fugindo, a voz foge junto.",
        lesson:"Demonstra. Não explica anatomia.",
        screen:"1 · Pé"},
      {t:"2", say:"Ar. Uma saída mais longa do que a entrada. Sem teatro.",
        lesson:"Uma respiração, visível.",
        screen:"2 · Ar"},
      {t:"3", say:"Olho. Escolhe um ponto. Não varre a sala procurando licença.",
        lesson:"Um ponto.",
        screen:"3 · Olho"},
      {t:"4", say:"Aí a primeira frase. Curta. Sem oi, sem pedido de desculpa, sem “então”.",
        lesson:"A frase é consequência.",
        screen:"4 · A frase"},
      {t:"Chave", say:"Pé, ar, olho, frase. Faz uma vez hoje, antes de uma conversa que importa. Comenta ANTES.",
        lesson:"Uma palavra.",
        screen:"Comenta ANTES"}
    ]
  },
  {
    kind:"ops", who:"yan", day:"Op 05", format:"Operação", dur:"45s",
    title:"A pergunta de quando ninguém vê",
    place:"Rosto perto. Sem cruz, sem símbolo, sem trilha solene.",
    gesture:"Comenta: OLHO",
    eixo:"Paladins",
    caption:"Antes de fechar qualquer coisa: eu faria isso se ninguém fosse saber?\n\nNão é moralismo. É teste de caráter.\n\nComenta OLHO.",
    beats:[
      {t:"Corte", say:"Antes de eu fechar qualquer coisa, tem uma pergunta. Uma. Não é sobre ética de slide.",
        lesson:"Caráter como operação, não como sermão.",
        screen:"Uma pergunta"},
      {t:"1", say:"Eu venderia isto se ninguém fosse saber que fui eu?",
        lesson:"Pausa depois da pergunta.",
        screen:"Se ninguém fosse saber"},
      {t:"2", say:"Se a resposta demora, o fechamento está cedo. Não é objeção do cliente. É objeção sua, e ela está certa.",
        lesson:"Não ensinar script de venda.",
        screen:"Está cedo"},
      {t:"3", say:"Caráter, do jeito que eu uso, não é discurso. É a decisão que permanece quando o aplauso sai da sala.",
        lesson:"Definição curta. Sem Franz Bardon neste corte.",
        screen:"Quando o aplauso sai"},
      {t:"Chave", say:"Usa a pergunta uma vez esta semana, numa coisa pequena. Comenta OLHO.",
        lesson:"Uma palavra.",
        screen:"Comenta OLHO"}
    ]
  }
];

function slot(base, extra){
  return {
    kind: extra.kind,
    who: "yan",
    eixo: extra.eixo || base.eixo,
    title: extra.title || base.title,
    place: extra.place,
    dur: extra.dur,
    format: extra.format,
    day: extra.day || "",
    gesture: extra.gesture,
    caption: extra.caption,
    beats: extra.beats
  };
}
function slotCard(s, num, klass, when){
  const el = document.createElement("button");
  el.type = "button";
  el.className = "card " + klass;
  el.dataset.who = "yan";
  el.innerHTML = '<div class="num">'+num+'</div><div><div class="tag">'+esc(when)+'</div><h2>'+esc(s.title)+'</h2><div class="meta"><strong>'+esc(s.eixo||"")+'</strong><br>'+esc(s.place)+'<br>'+esc(s.dur)+' · '+esc(s.gesture)+'</div></div><div class="open meta">Abrir</div>';
  el.onclick = ()=>openScript(s);
  return el;
}

const DAY = [
  {
    ig: {
      title: "O inverno que ninguém lembra",
      place: "Rosto perto. Sem sorriso. Texto no primeiro quadro.",
      dur: "35s", format: "Instagram", gesture: "Comenta: CÓDIGO",
      caption: "1945. Bebês nasceram carregando um inverno que não lembram.\n\nA marca existe. O destino, não.\n\nComenta CÓDIGO.",
      beats: [
        {t:"Corte", say:"Em 1945, milhares de bebês nasceram carregando um inverno de que nenhum deles se lembra.", screen:"O inverno que ninguém lembra"},
        {t:"Fato", say:"Holanda. A comida foi cortada. A ração média ficou em torno de seiscentas e setenta calorias. Em abril, perto de quinhentas.", screen:"1944–45 · Holanda"},
        {t:"Marca", say:"Em 2008, um estudo comparou irmãos. Quem foi concebido na fome tinha, sessenta anos depois, uma marca pequena num gene. Cerca de cinco por cento. É associação. Não é destino.", screen:"2008 · ~5%"},
        {t:"Leitura", say:"Eu não leio isso como sentença. Eu leio como corpo, mente e campo. Tem padrão seu que não nasceu de uma escolha.", screen:"Corpo. Mente. Campo."},
        {t:"CTA", say:"Se você quer olhar o padrão, e não só o sintoma, comenta CÓDIGO.", screen:"Comenta CÓDIGO"}
      ]
    },
    story: {
      place: "Rosto perto. Uma pausa por bloco. Sem pressa de vender.",
      dur: "50s", gesture: "Comenta: CÓDIGO",
      caption: "O fato é a fome. A leitura é o método. Os dois não são a mesma frase.\n\nComenta CÓDIGO.",
      beats: [
        {t:"O que é", say:"Esse corte se chama o inverno que ninguém lembra. De manhã é a vitrine. Aqui é a engenharia.", screen:"A engenharia"},
        {t:"Fato", say:"Hongerwinter. Oeste da Holanda, 1944 para 1945. A estimativa mais citada fica em torno de vinte mil mortos. Não é um número de certidão.", screen:"~20 mil"},
        {t:"O estudo", say:"Em 2008, pesquisadores compararam irmãos. Quem foi concebido durante a fome tinha um pouco menos de metilação num trecho do gene IGF2. Cerca de cinco por cento. Isso não prova que a marca causou a doença.", screen:"Irmãos · IGF2"},
        {t:"A leitura", say:"A leitura começa agora, e ela é minha. O corpo pode guardar um ambiente que a mente não viveu. Isso não é a ciência provando o campo.", screen:"Eu leio assim"},
        {t:"Convite", say:"Se você quer olhar o padrão, comenta CÓDIGO. A conversa é sobre o padrão. Não sobre o exame.", screen:"Comenta CÓDIGO"}
      ]
    },
    tik: {
      place: "Rosto perto. Sem oi. Uma tomada.",
      dur: "20s", gesture: "Comenta: CÓDIGO",
      caption: "O corpo guardou o que a mente não viveu.\n\nComenta CÓDIGO.",
      beats: [
        {t:"Corte", say:"Em 1945, bebês nasceram carregando um inverno que não lembram.", screen:"Um inverno que não lembram"},
        {t:"Fato", say:"Holanda. Fome. Décadas depois, uma marca no DNA. Pequena. Real.", screen:"Marca pequena. Real."},
        {t:"CTA", say:"O corpo guardou o que a mente não viveu. Comenta CÓDIGO.", screen:"Comenta CÓDIGO"}
      ]
    },
    op: {
      title: "Nomeia o inverno",
      place: "Rosto perto. Sem trilha. Um dedo por item.",
      dur: "45s", gesture: "Comenta: INVERNO",
      eixo: "Códigos de Origem",
      caption: "Um “eu sempre fui assim”.\n\nSe você não acha o ano, o padrão pode ser mais velho do que você.\n\nComenta INVERNO.",
      beats: [
        {t:"Corte", say:"Pega um “eu sempre fui assim”. Um só.", screen:"Um só"},
        {t:"1", say:"Escreve quando isso começou. Se você não acha o ano, o padrão pode ser mais velho do que você.", screen:"1 · O ano"},
        {t:"2", say:"Não interpreta. Nomeia. Corpo, mente ou campo. Um dos três está repetindo.", screen:"2 · Um dos três"},
        {t:"3", say:"Se for campo, olha a casa, não a culpa. Quem estava em volta quando isso virou normal.", screen:"3 · A casa"},
        {t:"Chave", say:"Um nome. Um inverno. Comenta INVERNO quando escrever.", screen:"Comenta INVERNO"}
      ]
    }
  },
  {
    ig: {
      title: "O mesmo debate, dois vencedores",
      place: "Rosto perto. Sem sorriso no corte.",
      dur: "35s", format: "Instagram", gesture: "Comenta: PRESENÇA",
      caption: "26 de setembro de 1960. O mesmo debate. Duas leituras.\n\nA lenda do rádio é mais fraca do que repetem.\n\nComenta PRESENÇA.",
      beats: [
        {t:"Corte", say:"Em 1960, o mesmo debate teve duas leituras. Dependia de onde você estava.", screen:"Dois vencedores"},
        {t:"Fato", say:"Vinte e seis de setembro. Chicago. Kennedy e Nixon. Nixon tinha saído do hospital. Chegou pálido. Recusou maquiagem. Kennedy tinha tomado sol.", screen:"26 set 1960"},
        {t:"Correção", say:"A lenda de que o rádio deu a vitória ao Nixon é mais fraca do que repetem. O dado é pequeno. O que ficou firme é a tela. A presença mudou a leitura do mesmo conteúdo.", screen:"A lenda é mais fraca"},
        {t:"Leitura", say:"Presença não é dom. É o que o corpo faz antes da primeira frase. Eu treino isso. Não herdo.", screen:"Antes da frase"},
        {t:"CTA", say:"Se você quer treinar presença sem teatro, comenta PRESENÇA.", screen:"Comenta PRESENÇA"}
      ]
    },
    story: {
      place: "Rosto perto. Tom de quem corrige, não de quem confirma a lenda.",
      dur: "45s", gesture: "Comenta: PRESENÇA",
      caption: "Não repete a lenda do rádio. O que sustenta é a tela.\n\nComenta PRESENÇA.",
      beats: [
        {t:"O que é", say:"O reel da manhã fala de dois vencedores. Aqui está o que não cabe no corte.", screen:"O que não cabe"},
        {t:"Fato", say:"Primeiro debate presidencial na televisão americana. Chicago. Nixon pálido, sem maquiagem. Kennedy com sol na pele. Quem viu na tela saiu achando que Kennedy tinha ganhado.", screen:"Na tela, Kennedy"},
        {t:"A lenda", say:"A frase pronta é que o rádio deu a vitória ao Nixon. Essa parte é discutida até hoje. O levantamento é fraco. Eu não uso lenda como prova.", screen:"Não usa a lenda"},
        {t:"A leitura", say:"O conteúdo era o mesmo. O campo em volta, não. Presença é anterior à frase. Isso é tecnologia da alma, não truque de palco.", screen:"Antes da frase"},
        {t:"Convite", say:"Comenta PRESENÇA se você quiser treinar o que acontece antes de falar.", screen:"Comenta PRESENÇA"}
      ]
    },
    tik: {
      place: "Rosto perto. Sem oi.",
      dur: "18s", gesture: "Comenta: PRESENÇA",
      caption: "Mesmo debate. A tela mudou a leitura.\n\nComenta PRESENÇA.",
      beats: [
        {t:"Corte", say:"O mesmo debate. Dois vencedores. Dependia de onde você estava.", screen:"Dois vencedores"},
        {t:"Correção", say:"A lenda do rádio é fraca. A tela, não.", screen:"A tela, não"},
        {t:"CTA", say:"Presença muda o mesmo conteúdo. Comenta PRESENÇA.", screen:"Comenta PRESENÇA"}
      ]
    },
    op: {
      title: "Antes da primeira frase",
      eixo: "Tecnologia da Alma",
      place: "Rosto perto. Cada gesto uma vez, devagar.",
      dur: "50s", gesture: "Comenta: ANTES",
      caption: "Pé. Ar. Olho. Primeira frase.\n\nComenta ANTES.",
      beats: [
        {t:"Corte", say:"Presença não começa na frase. Começa nos três segundos anteriores.", screen:"Três segundos antes"},
        {t:"1", say:"Pé. Os dois no chão. Se um está fugindo, a voz foge junto.", screen:"1 · Pé"},
        {t:"2", say:"Ar. Uma saída mais longa do que a entrada. Sem teatro.", screen:"2 · Ar"},
        {t:"3", say:"Olho. Um ponto. Não varre a sala procurando licença.", screen:"3 · Olho"},
        {t:"4", say:"Aí a primeira frase. Curta. Sem oi, sem desculpa, sem “então”.", screen:"4 · A frase"},
        {t:"Chave", say:"Pé, ar, olho, frase. Uma vez hoje, antes de uma conversa que importa. Comenta ANTES.", screen:"Comenta ANTES"}
      ]
    }
  },
  {
    ig: {
      title: "O nome sobreviveu por causa dela",
      place: "Rosto perto. Tom seco. Sem trilha de gênio.",
      dur: "35s", format: "Instagram", gesture: "Comenta: LEGADO",
      caption: "Van Gogh morre em 1890. O nome não morre com ele.\n\nQuem segurou a casa foi Johanna.\n\nComenta LEGADO.",
      beats: [
        {t:"Corte", say:"O nome de Van Gogh sobreviveu. Não foi só por causa do quadro.", screen:"Não foi só o quadro"},
        {t:"Fato", say:"Ele morre em vinte e nove de julho de 1890. Quem organiza as cartas, as exposições e a casa do nome, nos anos seguintes, é Johanna van Gogh-Bonger.", screen:"29 jul 1890"},
        {t:"Limite", say:"Não foi ela sozinha no mundo. Foi ela segurando o que o talento, sozinho, não organiza. Carta, catálogo, venda, a frase que outro consegue repetir.", screen:"Carta. Catálogo. Venda."},
        {t:"Leitura", say:"Talento sem estrutura desaparece. Eu chamo isso de legado. Não de inspiração.", screen:"Talento não é casa"},
        {t:"CTA", say:"Se você quer que o seu nome não dependa de você na sala, comenta LEGADO.", screen:"Comenta LEGADO"}
      ]
    },
    story: {
      place: "Rosto perto. Sem romantizar o sofrimento.",
      dur: "45s", gesture: "Comenta: LEGADO",
      caption: "O quadro existia. A casa do nome, não. Johanna construiu a casa.\n\nComenta LEGADO.",
      beats: [
        {t:"O que é", say:"O corte da manhã diz que o nome sobreviveu por causa dela. Aqui está o limite dessa frase.", screen:"O limite da frase"},
        {t:"Fato", say:"Vincent morre em 1890. Theo, o irmão, morre no ano seguinte. Johanna, mulher de Theo, fica com a coleção. Ela publica as cartas e empurra a obra para fora da casa.", screen:"Johanna · as cartas"},
        {t:"O que não é", say:"Isso não apaga o pintor. Também não transforma ela em detalhe. Sem quem organiza, o talento fica história de família.", screen:"Não é detalhe"},
        {t:"A leitura", say:"Legado, do jeito que eu uso, é o que outra pessoa consegue operar quando você sai. Não é o aplauso do dia.", screen:"Quando você sai"},
        {t:"Convite", say:"Comenta LEGADO se você quiser olhar a casa, e não só a peça.", screen:"Comenta LEGADO"}
      ]
    },
    tik: {
      place: "Rosto perto. Sem oi.",
      dur: "18s", gesture: "Comenta: LEGADO",
      caption: "O nome não morreu com o pintor.\n\nComenta LEGADO.",
      beats: [
        {t:"Corte", say:"Van Gogh morre em 1890. O nome não morre com ele.", screen:"1890"},
        {t:"Fato", say:"Quem segurou a casa foi Johanna. Não o mito do gênio sozinho.", screen:"Johanna"},
        {t:"CTA", say:"Talento sem estrutura some. Comenta LEGADO.", screen:"Comenta LEGADO"}
      ]
    },
    op: {
      title: "O que continua sem você",
      eixo: "Arquitetura de Legado",
      place: "Rosto perto. Pode ter papel. Sem nome de cliente.",
      dur: "45s", gesture: "Comenta: SEGUNDA",
      caption: "Uma coisa que hoje para se você sai.\n\nEntrada. Três verbos. Saída.\n\nComenta SEGUNDA.",
      beats: [
        {t:"Corte", say:"Escolhe uma coisa que, se você sai, a segunda-feira para.", screen:"A segunda para"},
        {t:"1", say:"Entrada. O que chega, de quem, em que forma. Se não tem entrada, não é etapa. É favor.", screen:"1 · Entrada"},
        {t:"2", say:"O meio. Três verbos. Não um discurso.", screen:"2 · Três verbos"},
        {t:"3", say:"Saída. O que a outra pessoa recebe, e como sabe que acabou.", screen:"3 · Saída"},
        {t:"Chave", say:"Uma etapa. O resto espera. Comenta SEGUNDA quando a saída existir sem você na sala.", screen:"Comenta SEGUNDA"}
      ]
    }
  },
  {
    ig: {
      title: "Sexta-feira treze não nasceu ali",
      place: "Rosto perto. Sem cruz, sem capa, sem trilha solene.",
      dur: "35s", format: "Instagram", gesture: "Comenta: CARÁTER",
      caption: "13 de outubro de 1307. A prisão é real. A superstição foi colada depois.\n\nComenta CARÁTER.",
      beats: [
        {t:"Corte", say:"Sexta-feira treze não nasceu no dia em que prenderam os Templários. A prisão, sim.", screen:"A prisão, sim"},
        {t:"Fato", say:"Treze de outubro de 1307. Filipe IV, rei da França, manda prender a Ordem do Templo. Isso está nos documentos. A superstição do dia, não.", screen:"13 out 1307"},
        {t:"Virada", say:"A ideia de que o azar nasceu ali foi colada séculos depois. Poder reescreve o calendário quando lhe serve.", screen:"Colada depois"},
        {t:"Leitura", say:"Caráter, do jeito que eu uso, é o que permanece quando a história oficial muda de dono. Não é o símbolo. É a decisão.", screen:"Não é o símbolo"},
        {t:"CTA", say:"Se você quer olhar poder sem fantasia, comenta CARÁTER.", screen:"Comenta CARÁTER"}
      ]
    },
    story: {
      place: "Rosto perto. Separar documento de lenda.",
      dur: "45s", gesture: "Comenta: CARÁTER",
      caption: "O documento é a prisão. A sexta-feira treze, como azar, é outra camada.\n\nComenta CARÁTER.",
      beats: [
        {t:"O que é", say:"O corte diz que sexta-feira treze não nasceu ali. Aqui está a separação.", screen:"Separar"},
        {t:"Documento", say:"Em treze de outubro de 1307, o rei da França prende os Templários. Data, nome, ordem. Isso fica.", screen:"1307 · Filipe IV"},
        {t:"Lenda", say:"Dizer que o medo do dia nasceu nessa manhã é uma cola posterior. Eu não uso cola como fonte.", screen:"Cola não é fonte"},
        {t:"A leitura", say:"Quem tem poder escolhe qual data vira aviso. Caráter é perceber a cola sem precisar de inimigo secreto.", screen:"Ver a cola"},
        {t:"Convite", say:"Comenta CARÁTER. A conversa é sobre decisão, não sobre ordem secreta.", screen:"Comenta CARÁTER"}
      ]
    },
    tik: {
      place: "Rosto perto. Sem oi.",
      dur: "18s", gesture: "Comenta: CARÁTER",
      caption: "A prisão é fato. O azar do dia é cola.\n\nComenta CARÁTER.",
      beats: [
        {t:"Corte", say:"Sexta-feira treze não nasceu com os Templários.", screen:"Não nasceu ali"},
        {t:"Fato", say:"A prisão, em 1307, é real. O azar do dia foi colado depois.", screen:"1307 · colado depois"},
        {t:"CTA", say:"Poder reescreve o calendário. Comenta CARÁTER.", screen:"Comenta CARÁTER"}
      ]
    },
    op: {
      title: "A pergunta de quando ninguém vê",
      eixo: "Paladins",
      place: "Rosto perto. Sem símbolo.",
      dur: "40s", gesture: "Comenta: OLHO",
      caption: "Eu faria isso se ninguém fosse saber?\n\nComenta OLHO.",
      beats: [
        {t:"Corte", say:"Antes de eu fechar qualquer coisa, tem uma pergunta. Não é ética de slide.", screen:"Uma pergunta"},
        {t:"1", say:"Eu faria isso se ninguém fosse saber que fui eu?", screen:"Se ninguém fosse saber"},
        {t:"2", say:"Se a resposta demora, está cedo. Não é objeção do outro. É a sua, e ela está certa.", screen:"Está cedo"},
        {t:"3", say:"Caráter, aqui, é a decisão que fica quando o aplauso sai da sala.", screen:"Quando o aplauso sai"},
        {t:"Chave", say:"Usa uma vez esta semana, numa coisa pequena. Comenta OLHO.", screen:"Comenta OLHO"}
      ]
    }
  },
  {
    ig: {
      title: "O número da loteria que não existe",
      place: "Rosto perto. Sem nota de dinheiro na mão.",
      dur: "35s", format: "Instagram", gesture: "Comenta: VETOR",
      caption: "“Setenta por cento dos ganhadores quebram” não tem estudo.\n\nO que existe é outro achado. Menor. Mais interessante.\n\nComenta VETOR.",
      beats: [
        {t:"Corte", say:"O número que circula sobre ganhador de loteria quebrando não existe. O estudo que existe diz outra coisa.", screen:"O número não existe"},
        {t:"Fato", say:"Em 1978, Brickman e colegas acompanharam vinte e dois ganhadores. Não ficaram mais felizes do que o grupo de comparação. E o prazer das coisas pequenas caiu.", screen:"1978 · 22 pessoas"},
        {t:"Limite", say:"Vinte e duas pessoas não provam o país. Também não provam que dinheiro estraga. Provam que o saldo, sozinho, não reorganiza o dia.", screen:"Amostra pequena"},
        {t:"Leitura", say:"Eu não leio isso como “dinheiro é mau”. Eu leio como peça. Sem vetor, o número sobe e a vida continua no mesmo desenho.", screen:"Sem vetor"},
        {t:"CTA", say:"Se você quer olhar a peça, e não só o saldo, comenta VETOR.", screen:"Comenta VETOR"}
      ]
    },
    story: {
      place: "Rosto perto. Recusar o número falso em voz alta.",
      dur: "45s", gesture: "Comenta: VETOR",
      caption: "Recusa o setenta por cento. Fica com 1978 e com o limite da amostra.\n\nComenta VETOR.",
      beats: [
        {t:"O que é", say:"Tem uma frase pronta. Setenta por cento dos ganhadores quebram. Eu não uso. Não achei o estudo.", screen:"Não achei o estudo"},
        {t:"O que existe", say:"1978. Vinte e dois ganhadores. A felicidade não subiu como a história promete. O gosto pelo cotidiano desceu. Amostra pequena. Serve como aviso, não como lei.", screen:"22 · aviso, não lei"},
        {t:"A leitura", say:"Dinheiro amplifica a estrutura que já estava ali. Sem estrutura, o saldo é barulho.", screen:"Amplifica a estrutura"},
        {t:"Convite", say:"Comenta VETOR se a pergunta for a peça, não o prêmio.", screen:"Comenta VETOR"}
      ]
    },
    tik: {
      place: "Rosto perto. Sem oi.",
      dur: "18s", gesture: "Comenta: VETOR",
      caption: "O setenta por cento é lenda. O estudo de 1978 é pequeno, e diz outra coisa.\n\nComenta VETOR.",
      beats: [
        {t:"Corte", say:"Setenta por cento dos ganhadores quebram. Esse número não tem estudo.", screen:"Não tem estudo"},
        {t:"Fato", say:"O que existe, em 1978, são vinte e duas pessoas. Não ficaram mais felizes. Amostra pequena.", screen:"1978 · 22"},
        {t:"CTA", say:"Saldo não reorganiza o dia. Comenta VETOR.", screen:"Comenta VETOR"}
      ]
    },
    op: {
      title: "Três portas antes do dinheiro",
      eixo: "Alinhamento Financeiro",
      place: "Rosto perto. Um dedo por porta. Sem gráfico.",
      dur: "50s", gesture: "Comenta: PORTA",
      caption: "Corpo. Mente. Campo. Uma torta, o sim espera.\n\nComenta PORTA.",
      beats: [
        {t:"Corte", say:"Antes de dizer sim para dinheiro, eu passo por três portas. Se uma estiver torta, o sim é cedo.", screen:"Três portas"},
        {t:"1", say:"Corpo. Dormiu. Comeu. Decisão financeira em corpo cansado é outra pessoa falando.", screen:"1 · Corpo"},
        {t:"2", say:"Mente. Qual frase está mandando. “Eu mereço.” “Eu sempre perco.” A frase é o operador.", screen:"2 · Mente"},
        {t:"3", say:"Campo. Com quem você está decidindo. Se a sala estiver gritando, sai e decide de novo.", screen:"3 · Campo"},
        {t:"Chave", say:"Uma porta torta, o sim espera. Comenta PORTA na próxima decisão.", screen:"Comenta PORTA"}
      ]
    }
  },
  {
    ig: {
      title: "A web foi um memorando",
      place: "Rosto perto. Sem tela de código.",
      dur: "35s", format: "Instagram", gesture: "Comenta: SISTEMA",
      caption: "Março de 1989. Um memorando no CERN. Na capa: vago, mas empolgante.\n\nComenta SISTEMA.",
      beats: [
        {t:"Corte", say:"A web não nasceu num aplicativo. Nasceu numa margem de papel.", screen:"Uma margem"},
        {t:"Fato", say:"Março de 1989. CERN. Tim Berners-Lee entrega um memorando. O chefe, Mike Sendall, escreve na capa: vago, mas empolgante.", screen:"Março 1989"},
        {t:"Virada", say:"O problema não era fama. Era achar um documento, de outra pessoa, em outro prédio, sem pedir favor.", screen:"Achar o documento"},
        {t:"Leitura", say:"Peça não é casa. Sistema é o que outra pessoa opera na segunda-feira. Eu leio código assim. Como arquitetura.", screen:"Peça não é casa"},
        {t:"CTA", say:"Se você quer ver o digital como sistema, e não como poste, comenta SISTEMA.", screen:"Comenta SISTEMA"}
      ]
    },
    story: {
      place: "Rosto perto. Sem aula de programação.",
      dur: "40s", gesture: "Comenta: SISTEMA",
      caption: "Quatro palavras na capa. O resto foi sistema.\n\nComenta SISTEMA.",
      beats: [
        {t:"O que é", say:"O corte da manhã para numa margem. Aqui está o que a margem pedia.", screen:"O que a margem pedia"},
        {t:"Fato", say:"O título do papel é uma proposta de gestão da informação. As quatro palavras do chefe não são elogio. São um prazo disfarçado de educação.", screen:"Vago, mas empolgante"},
        {t:"A leitura", say:"Quem só publica peça fica refém do alcance. Quem faz o endereço, a ligação e a página constrói a casa.", screen:"Endereço. Ligação. Página."},
        {t:"Convite", say:"Comenta SISTEMA se a pergunta for o que continua sem você na sala.", screen:"Comenta SISTEMA"}
      ]
    },
    tik: {
      place: "Rosto perto. Sem oi.",
      dur: "18s", gesture: "Comenta: SISTEMA",
      caption: "Quatro palavras na capa de um memorando.\n\nComenta SISTEMA.",
      beats: [
        {t:"Corte", say:"A web nasceu numa margem. Quatro palavras. Vago, mas empolgante.", screen:"Vago, mas empolgante"},
        {t:"Fato", say:"Março de 1989. CERN. Não foi um aplicativo. Foi um sistema.", screen:"1989 · CERN"},
        {t:"CTA", say:"Peça não é casa. Comenta SISTEMA.", screen:"Comenta SISTEMA"}
      ]
    },
    op: {
      title: "Uma etapa. Não o ano inteiro.",
      eixo: "Tech Hub · Império Digital",
      place: "Rosto perto. Papel na mão, se quiser. Sem código na tela.",
      dur: "45s", gesture: "Comenta: ETAPA",
      caption: "Entrada. Três verbos. Saída.\n\nComenta ETAPA.",
      beats: [
        {t:"Corte", say:"Não desenha o ecossistema. Desenha a etapa que hoje só existe na sua cabeça.", screen:"Uma etapa"},
        {t:"1", say:"Entrada. O que chega. Se não tem entrada, não é sistema. É memória sua.", screen:"1 · Entrada"},
        {t:"2", say:"Três verbos no meio. O que acontece sem discurso.", screen:"2 · Três verbos"},
        {t:"3", say:"Saída. Outra pessoa recebe, e sabe que acabou, sem te chamar.", screen:"3 · Sem te chamar"},
        {t:"Chave", say:"Uma etapa hoje. Comenta ETAPA quando a saída não precisar de você.", screen:"Comenta ETAPA"}
      ]
    }
  }
];

window.renderExtra = function(filter){
  const box = document.getElementById("dia-denso");
  const list = document.getElementById("denso-list");
  if(!box || !list) return;
  const show = filter !== "outra";
  box.hidden = !show;
  list.innerHTML = "";
  if(!show) return;
  DENSO.forEach((full, i)=>{
    const pack = DAY[i];
    if(!pack) return;
    const n = String(i+1).padStart(2,"0");
    const pair = document.createElement("div");
    pair.className = "pair";
    const ig = slot(full, Object.assign({kind:"ig", format:"Instagram"}, pack.ig));
    const story = slot(full, Object.assign({kind:"story", format:"Story", title:"Story · "+(pack.ig.title||full.title)}, pack.story));
    const tik = slot(full, Object.assign({kind:"tiktok", format:"TikTok", title:"TikTok · "+(pack.ig.title||full.title)}, pack.tik));
    const op = slot(full, Object.assign({kind:"ops", format:"Operação"}, pack.op));
    pair.append(slotCard(ig, n, "ig", n+" · manhã · Instagram"));
    pair.append(slotCard(story, n+".2", "story", n+".2 · manhã · Story"));
    pair.append(slotCard(tik, n+".3", "tiktok", n+".3 · tarde · TikTok"));
    pair.append(slotCard(full, n+".4", "denso", n+".4 · noite · TikTok denso"));
    pair.append(slotCard(op, n+".5", "ops", n+".5 · manhã ou noite · operação"));
    list.append(pair);
  });
};
renderExtra("todos");
