/* 01.4 documental e 01.5 prático. Não substituem o reel, o íntimo nem o TikTok curto.
   A linha lilás (lesson), o "na tela" (screen) e a imagem (roll) não são falados. */
const CASA = "Em casa. Sentado, rosto perto, fundo quieto, luz da janela de lado. Sem estúdio. Se variar, a varanda, ainda em casa.";
const EXTRA = {
  "A palavra que sobra é a profissão": {
    doc: {
      title: "O nome sobreviveu fora do cargo",
      dur: "95s",
      gesture: "Comenta: CASA",
      caption: "Van Gogh morre em 1890. O cargo não segurou o nome. Quem organizou a casa foi Johanna.\n\nComenta CASA.",
      beats: [
        {t:"Gancho", say:"O nome de Van Gogh não ficou de pé por causa do cargo. Ficou porque alguém organizou a casa.", lesson:"Não abrir com a frase de três partes. Esse vídeo é outra história.", screen:"Não foi o cargo"},
        {t:"Fato", say:"Vinte e nove de julho de 1890. Vincent morre. O irmão, Theo, morre no janeiro seguinte. Quem fica com os quadros e com as cartas é Johanna van Gogh-Bonger.", lesson:"Theo morre em 25 de janeiro de 1891. Não romantizar.", screen:"1890", roll:"Tela cheia: retrato de Vincent, depois uma carta manuscrita. Wikimedia Commons: Vincent van Gogh self-portrait e Letter by Vincent van Gogh. Sem filme biográfico."},
        {t:"O que ela fez", say:"Ela não inventou o pintor. Ela publicou as cartas, emprestou os quadros, fez a exposição. Tirou o trabalho de dentro de uma família e pôs num lugar que outro conseguia ver.", lesson:"A edição mais citada das cartas é de 1914. As exposições começam antes. Não dizer que ela foi a única pessoa do mundo.", screen:"Cartas. Exposição.", roll:"Tela cheia: capa de catálogo ou sala de museu antiga. Wikimedia: Johanna van Gogh-Bonger. Se não achar foto boa, fica na carta. Não usar cena de filme."},
        {t:"Virada", say:"O cargo dele, enquanto vivo, não convencia quase ninguém. O que viajou foi a estrutura em volta do trabalho.", lesson:"Pausa. Rosto de volta aqui.", screen:"O cargo não viajou"},
        {t:"Leitura", say:"Eu leio isso assim. Experiência sem casa fica história de família. A casa é o que outra pessoa encontra quando você não está na sala.", lesson:"Leitura. Não é a ciência provando legado.", screen:"Quando você não está"},
        {t:"Pergunta", say:"O que você faz hoje ainda só existe se você estiver explicando?", screen:"Só se você explicar?"},
        {t:"CTA", say:"Se você quer olhar a casa do nome, e não o cargo, comenta CASA.", screen:"Comenta CASA"}
      ]
    },
    prac: {
      title: "Apaga o cargo",
      dur: "45s",
      gesture: "Comenta: SOBROU",
      caption: "Grava vinte segundos dizendo o que você faz. Apaga todo cargo. O que sobrou é o material.\n\nComenta SOBROU.",
      beats: [
        {t:"Corte", say:"Não escreve a frase bonita. Primeiro apaga o cargo.", screen:"Apaga o cargo"},
        {t:"1", say:"Grava vinte segundos, aqui em casa, dizendo o que você faz. Sem ensaio.", screen:"1 · Vinte segundos"},
        {t:"2", say:"Assiste. Corta toda palavra que for profissão, diploma ou anos de estrada.", screen:"2 · Corta"},
        {t:"3", say:"O que sobrou, mesmo torto, é o material. Se não sobrou nada, o vídeo de hoje era só o cargo.", screen:"3 · O que sobrou"},
        {t:"Chave", say:"Faz uma vez. Comenta SOBROU com a primeira palavra que restou.", screen:"Comenta SOBROU"}
      ]
    }
  },
  "Alguém te apresenta e inventa você": {
    doc: {
      title: "O mesmo debate, dois vencedores",
      dur: "90s",
      gesture: "Comenta: MEIO",
      caption: "26 de setembro de 1960. O mesmo debate. A tela mudou a leitura. A lenda do rádio é mais fraca do que repetem.\n\nComenta MEIO.",
      beats: [
        {t:"Gancho", say:"Em 1960, o mesmo debate teve dois vencedores. Dependia de quem fazia a ponte.", lesson:"Não começar pela lenda do rádio.", screen:"Dois vencedores"},
        {t:"Fato", say:"Vinte e seis de setembro. Chicago. Kennedy e Nixon. Nixon tinha saído do hospital. Chegou pálido. Recusou maquiagem. Kennedy tinha tomado sol.", screen:"26 set 1960", roll:"Tela cheia: foto do debate, os dois no púlpito, preto e branco. Wikimedia Commons: Kennedy Nixon debate 1960. É arquivo de imprensa, domínio público nos Estados Unidos."},
        {t:"A lenda", say:"Quem viu na televisão saiu achando que Kennedy tinha ganhado. A frase pronta diz que o rádio deu a vitória ao Nixon. Essa segunda parte é fraca. O levantamento é pequeno. Historiadores discutem até hoje.", lesson:"Não citar Sindlinger como prova. A autoridade é recusar a lenda.", screen:"A lenda é fraca"},
        {t:"Virada", say:"O que ficou firme é isto. O conteúdo era o mesmo. O meio que entregou o conteúdo mudou a leitura.", screen:"O meio mudou a leitura"},
        {t:"Leitura", say:"Quem te apresenta é um meio. Se a pessoa só tem o seu cargo, ela entrega outro candidato. Eu não chamo isso de marketing. Chamo de tradução.", screen:"Quem te apresenta é o meio"},
        {t:"Pergunta", say:"Se tirassem você da sala, a frase que sobra ainda era a sua?", screen:"A frase ainda era a sua?"},
        {t:"CTA", say:"Comenta MEIO se você for olhar quem está te traduzindo.", screen:"Comenta MEIO"}
      ]
    },
    prac: {
      title: "A frase que ela não achou",
      dur: "42s",
      gesture: "Comenta a palavra que faltou",
      caption: "Pede um áudio de uma frase. Não corrige. Marca a palavra que a pessoa não achou.\n\nNão manda o reel. Ainda não.",
      beats: [
        {t:"Corte", say:"Não manda vídeo nenhum hoje. Pede um áudio.", screen:"Um áudio"},
        {t:"1", say:"Uma pessoa que te apresentaria esta semana. Um áudio de uma frase. Só uma.", screen:"1 · Uma frase"},
        {t:"2", say:"Você não corrige. Anota a palavra que ela não achou. Cargo não conta.", screen:"2 · A palavra que faltou"},
        {t:"3", say:"Essa palavra é o buraco. O reel pede para mandar o vídeo. Aqui você ainda não manda. Você olha o buraco.", screen:"3 · Ainda não manda"},
        {t:"Chave", say:"Comenta essa palavra. A que ela não achou.", screen:"A palavra"}
      ]
    }
  },
  "Quando você sai, o negócio senta": {
    doc: {
      title: "O hambúrguer já existia",
      dur: "85s",
      gesture: "Comenta: ETAPA",
      caption: "1954. Ray Kroc visita os irmãos McDonald em San Bernardino. O que viajou não foi a receita. Foi a etapa escrita.\n\nComenta ETAPA.",
      beats: [
        {t:"Gancho", say:"O hambúrguer já existia. O que viajou foi uma etapa escrita.", screen:"Não foi a receita"},
        {t:"Fato", say:"San Bernardino, na Califórnia. Os irmãos Richard e Maurice McDonald tinham um sistema. Em 1954, Ray Kroc visita. Ele não leva uma ideia nova de comida. Ele vê uma operação que outro conseguia repetir.", lesson:"Não fazer aula de franquia nem vilão de cinema.", screen:"1954 · San Bernardino", roll:"Tela cheia: foto antiga do primeiro restaurante, ou da fachada com os arcos. Wikimedia Commons: McDonald's San Bernardino. Sem cena do filme The Founder."},
        {t:"Virada", say:"Enquanto a receita morava na cabeça, o negócio sentava quando o dono saía. Quando a etapa estava no papel, a cozinha andava sem o autor do lado.", screen:"Sem o autor do lado"},
        {t:"Leitura", say:"Eu não estou te vendendo franquia. Eu estou te mostrando a diferença. Presença não é sistema. Sistema é entrada, o que acontece, e saída. Outra pessoa vê.", screen:"Entrada. Acontece. Saída."},
        {t:"Pergunta", say:"Qual parte do seu dia ainda senta quando você sai da sala?", screen:"O que senta?"},
        {t:"CTA", say:"Comenta ETAPA se for escrever uma. Uma só.", screen:"Comenta ETAPA"}
      ]
    },
    prac: {
      title: "Quem responde amanhã",
      dur: "40s",
      gesture: "Comenta o primeiro nome",
      caption: "Amanhã de manhã, a primeira pergunta. Quem responde se você não estiver?\n\nUm nome. Não o processo inteiro.",
      beats: [
        {t:"Corte", say:"Não desenha a empresa. Escolhe a primeira pergunta de amanhã.", screen:"A primeira de amanhã"},
        {t:"1", say:"Escreve a pergunta que sempre volta para você. Uma.", screen:"1 · A pergunta"},
        {t:"2", say:"Do lado, o nome de quem poderia responder. Se o nome não existe, o buraco é esse. Não é falta de talento.", screen:"2 · O nome"},
        {t:"3", say:"Você não delega hoje. Você só vê que a manhã ainda tem um único endereço.", screen:"3 · Ainda não delega"},
        {t:"Chave", say:"Comenta o primeiro nome. Ou a palavra NINGUÉM, se for o caso.", screen:"O nome, ou NINGUÉM"}
      ]
    }
  },
  "Você chama de ambição": {
    doc: {
      title: "O número da loteria que não existe",
      dur: "90s",
      gesture: "Comenta: PEÇA",
      caption: "“Setenta por cento dos ganhadores quebram” não tem estudo. 1978. Vinte e duas pessoas. A amostra é pequena.\n\nComenta PEÇA.",
      beats: [
        {t:"Gancho", say:"O número que circula sobre ganhador de loteria quebrando não existe. O estudo que existe diz outra coisa.", screen:"O número não existe"},
        {t:"Fato", say:"1978. Brickman e dois colegas acompanham vinte e dois ganhadores. Comparados com quem não ganhou, eles não ficam mais felizes. E o gosto pelas coisas pequenas cai.", lesson:"Brickman, Coates e Janoff-Bulman, Journal of Personality and Social Psychology, 1978. Não arredondar para “todo ganhador”.", screen:"1978 · 22 pessoas", roll:"Tela cheia: não use foto de cheque gigante de banco, isso é propaganda. Um bilhete genérico, sem marca, ou só a tarja 1978. Se quiser imagem: Pexels, busca lottery ticket, confere se não tem logo. Melhor a tarja do que um anúncio."},
        {t:"Limite", say:"Vinte e duas pessoas não provam um país. Também não provam que dinheiro estraga. Provam que o saldo, sozinho, não reorganizou o dia daquela amostra.", screen:"Amostra pequena"},
        {t:"Leitura", say:"Eu não leio isso como “dinheiro é mau”. Eu leio como peça. Sem a peça, a pessoa chama de ambição o que ainda é fuga.", screen:"Sem a peça"},
        {t:"Pergunta", say:"Se o saldo dobrasse amanhã, qual decisão sua continuaria igual?", screen:"O que não mudaria?"},
        {t:"CTA", say:"Comenta PEÇA se a pergunta for a estrutura, não o prêmio.", screen:"Comenta PEÇA"}
      ]
    },
    prac: {
      title: "Três portas antes do sim",
      dur: "48s",
      gesture: "Comenta: PORTA",
      caption: "Antes do sim para dinheiro: corpo, mente, campo. Uma torta, espera.\n\nComenta PORTA.",
      beats: [
        {t:"Corte", say:"Antes de dizer sim para dinheiro, três portas. Uma torta, o sim espera.", screen:"Três portas"},
        {t:"1", say:"Corpo. Dormiu. Comeu. Decisão no cansaço é outra pessoa falando.", screen:"1 · Corpo"},
        {t:"2", say:"Mente. A frase que está mandando. Eu mereço. Eu sempre perco. A frase é o operador.", screen:"2 · Mente"},
        {t:"3", say:"Campo. Com quem você está decidindo. Se a sala estiver gritando, sai e decide de novo.", screen:"3 · Campo"},
        {t:"Chave", say:"Não é para ganhar mais. É para não assinar cedo. Comenta PORTA.", screen:"Comenta PORTA"}
      ]
    }
  },
  "Quem vende extintor mostra o fogo": {
    doc: {
      title: "Primeiro o fogo ficou visível",
      dur: "90s",
      gesture: "Comenta: FOGO",
      caption: "2 de setembro de 1666. Londres. A regra da cidade nova veio depois do fogo visível. Não antes.\n\nComenta FOGO.",
      beats: [
        {t:"Gancho", say:"Londres não ganhou uma cidade nova porque alguém vendeu a planta. Primeiro o fogo ficou visível.", screen:"Primeiro o fogo"},
        {t:"Fato", say:"Dois de setembro de 1666. Uma padaria na Pudding Lane. O fogo dura até o dia seis. A conta mais citada fala em cerca de treze mil casas. E dezenas de igrejas, inclusive a catedral.", lesson:"Cerca de 13.200 casas e 87 igrejas é a faixa dos relatos. Dizer “cerca de”. Thomas Farriner, a padaria.", screen:"2 set 1666", roll:"Tela cheia: gravura do incêndio de Londres, não filme. Wikimedia Commons: Great Fire of London. Tem pintura e mapa da área queimada. Internet Archive também tem gravura antiga."},
        {t:"Depois", say:"A lei de reconstrução vem no ano seguinte. Rua mais larga. Casa de tijolo. A regra chegou depois que a cidade viu o que estava queimando.", lesson:"Rebuilding of London Act, 1667. Não dizer que o incêndio foi planejado.", screen:"A regra veio depois", roll:"Tela cheia: mapa da área queimada, ou fachada de tijolo do século seguinte. Wikimedia: Great Fire of London map."},
        {t:"Virada", say:"Sem o fogo visível, a planta parece aula. Com o fogo visível, a planta vira alívio.", screen:"Sem o fogo, parece aula"},
        {t:"Leitura", say:"Eu não vendo três casas. Eu mostro onde a experiência já virou fumaça. Método é o que vem depois, não o cartaz do primeiro segundo.", screen:"Primeiro a fumaça"},
        {t:"Pergunta", say:"O que está queimando no seu trabalho que você ainda apresenta como se fosse um curso?", screen:"O que está queimando?"},
        {t:"CTA", say:"Comenta FOGO. Uma palavra. O incêndio, não o extintor.", screen:"Comenta FOGO"}
      ]
    },
    prac: {
      title: "Uma frase sem solução",
      dur: "40s",
      gesture: "Manda a frase para alguém e não explica",
      caption: "Uma frase. Só o fogo. Nenhuma palavra de solução.\n\nSe a pessoa perguntar “e o curso?”, o fogo não ficou visível.",
      beats: [
        {t:"Corte", say:"Escreve uma frase sobre o seu trabalho. Proibido usar a solução.", screen:"Sem solução"},
        {t:"1", say:"Sem método. Sem oferta. Sem nome de curso. Só o que está queimando.", screen:"1 · Só o fogo"},
        {t:"2", say:"Lê para uma pessoa, em casa, agora. Para. Não completa.", screen:"2 · Não completa"},
        {t:"3", say:"Se ela perguntar “e o curso?”, a frase ainda era extintor. Reescreve até ela ficar em silêncio.", screen:"3 · Até o silêncio"},
        {t:"Chave", say:"A frase que calou, você guarda. Não publica hoje.", screen:"Não publica hoje"}
      ]
    }
  },
  "Mais um curso, ou a casa": {
    doc: {
      title: "Ele parou de comprar estante",
      dur: "80s",
      gesture: "Comenta: ESTANTE",
      caption: "1731. Benjamin Franklin e o grupo dele param de cada um comprar mais um livro. Fundam uma biblioteca compartilhada.\n\nComenta ESTANTE.",
      beats: [
        {t:"Gancho", say:"Em 1731, um grupo para de comprar mais um livro e faz uma casa para os livros que já tinham.", screen:"Para de comprar"},
        {t:"Fato", say:"Filadélfia. Benjamin Franklin e o círculo chamado Junto. Cada um tinha livro em casa. O que faltava não era mais volume. Era um lugar onde o outro também lesse. Nasce a Library Company.", lesson:"Library Company of Philadelphia, 1731. Não transformar Franklin em guru.", screen:"1731 · Filadélfia", roll:"Tela cheia: fachada antiga da Library Company, ou um retrato de Franklin em domínio público. Wikimedia Commons: Library Company of Philadelphia. Sem documentário de streaming."},
        {t:"Virada", say:"Mais um livro na estante particular não mudou o ofício. A estrutura compartilhada, sim. Outra pessoa conseguia chegar no que já estava sabido.", screen:"A estante não era a casa"},
        {t:"Leitura", say:"Curso resolve falta de competência. Se a competência já está aí, o próximo curso é estante. A casa é o que fica quando a formação termina.", screen:"Quando a formação termina"},
        {t:"Pergunta", say:"O último curso que você comprou te deu algo que você já sabia fazer?", screen:"Você já sabia?"},
        {t:"CTA", say:"Comenta ESTANTE se for olhar a compra antes de repetir.", screen:"Comenta ESTANTE"}
      ]
    },
    prac: {
      title: "O que o curso repetiu",
      dur: "40s",
      gesture: "Comenta: JÁ",
      caption: "Abre o último curso. Escreve a linha que você já fazia antes de comprar.\n\nEssa linha não é um curso novo. É inventário.",
      beats: [
        {t:"Corte", say:"Abre o último curso que você comprou. Não assiste. Inventaria.", screen:"Não assiste"},
        {t:"1", say:"Uma linha. O que esse curso repete e você já fazia antes de pagar.", screen:"1 · O que você já fazia"},
        {t:"2", say:"Se a linha existe, a compra foi estante. Não é vergonha. É dado.", screen:"2 · Foi estante"},
        {t:"3", say:"Não cancela a vida. Não compra outro. A linha fica no papel até amanhã.", screen:"3 · Até amanhã"},
        {t:"Chave", say:"Comenta JÁ se a linha apareceu.", screen:"Comenta JÁ"}
      ]
    }
  },
  "Antes da ferramenta": {
    doc: {
      title: "A web foi um memorando",
      dur: "85s",
      gesture: "Comenta: PAPEL",
      caption: "Março de 1989. Um memorando no CERN. Na capa, o chefe escreve: vago, mas empolgante.\n\nA ferramenta veio depois da decisão.\n\nComenta PAPEL.",
      beats: [
        {t:"Gancho", say:"A web não nasceu num aplicativo. Nasceu numa margem de papel.", screen:"Uma margem"},
        {t:"Fato", say:"Março de 1989. CERN, na Suíça. Tim Berners-Lee entrega um memorando. O título é uma proposta de gestão da informação. O chefe, Mike Sendall, escreve na capa: vago, mas empolgante.", lesson:"Information Management: A Proposal. Vague but exciting. Falar em português.", screen:"Março 1989", roll:"Tela cheia: a capa do memorando, com a anotação. O CERN publica essa imagem. Busca: CERN Berners-Lee proposal 1989. Wikimedia Commons tem a capa. Não usar tela de código genérico."},
        {t:"O problema", say:"O problema dele não era ficar famoso. Era achar um documento, de outra pessoa, em outro prédio, sem pedir favor.", screen:"Achar o documento", roll:"Tela cheia: corredor de laboratório antigo, papel, não hacker de capuz. Pexels ou Pixabay: archive corridor, paper files. Confere se não tem marca."},
        {t:"Virada", say:"A ferramenta entrou depois. Endereço, ligação, página. Antes, a decisão já existia. Sem a decisão, o aplicativo só publicava a confusão mais rápido.", screen:"A decisão já existia"},
        {t:"Leitura", say:"Eu leio ferramenta assim. Ela guarda uma escolha. Não cria a escolha.", screen:"Ela guarda. Não cria."},
        {t:"Pergunta", say:"A próxima ferramenta que você quer assinar guardaria qual decisão que já está escrita?", screen:"Qual decisão?"},
        {t:"CTA", say:"Se a linha estiver vazia, não assina. Comenta PAPEL.", screen:"Comenta PAPEL"}
      ]
    },
    prac: {
      title: "O nome da ferramenta, embaixo",
      dur: "38s",
      gesture: "Comenta: VAZIO se a linha não existir",
      caption: "O nome da ferramenta fica embaixo. Em cima, a decisão que ela teria que guardar.\n\nLinha vazia, fecha a aba.",
      beats: [
        {t:"Corte", say:"Pega um papel. Embaixo, o nome da ferramenta que você quer abrir.", screen:"O nome embaixo"},
        {t:"1", say:"Em cima, uma linha. A decisão que essa ferramenta teria que guardar. Quem. O quê. Onde para.", screen:"1 · A decisão"},
        {t:"2", say:"Se a linha não sai, a ferramenta não tem o que guardar. Fecha a aba.", screen:"2 · Fecha a aba"},
        {t:"3", say:"Se a linha sai, a ferramenta pode esperar. A decisão já é o trabalho de hoje.", screen:"3 · A decisão fica"},
        {t:"Chave", say:"Comenta a primeira palavra da linha. Ou VAZIO.", screen:"A palavra, ou VAZIO"}
      ]
    }
  },
  "Uma etapa, não o método inteiro": {
    doc: {
      title: "Doze segundos, não o mapa",
      dur: "80s",
      gesture: "Comenta: DOZE",
      caption: "17 de dezembro de 1903. O primeiro voo fica no ar cerca de doze segundos. Não era o mapa da aviação. Era uma etapa.\n\nComenta DOZE.",
      beats: [
        {t:"Gancho", say:"O primeiro voo não entregou a aviação. Entregou doze segundos no ar.", screen:"Doze segundos"},
        {t:"Fato", say:"Dezessete de dezembro de 1903. Kill Devil Hills, na Carolina do Norte. Orville Wright. Cerca de doze segundos. Cerca de trinta e sete metros. No mesmo dia tem voo mais longo. O primeiro não era o mapa.", lesson:"12 segundos e 120 pés é o primeiro. O quarto, com Wilbur, fica perto de 59 segundos. Não misturar.", screen:"17 dez 1903", roll:"Tela cheia: a foto do primeiro voo, o avião e os homens na areia. Wikimedia Commons: First flight Wright brothers. É uma das fotos mais livres que existem. Não usar filme."},
        {t:"Virada", say:"Eles não sentaram para escrever o futuro do transporte. Sentaram um problema. Controle. Uma etapa. O resto do século veio depois, e não naquela tarde.", screen:"Um problema. Controle."},
        {t:"Leitura", say:"Método inteiro é um ano. Uma etapa é uma tarde. Quem espera o mapa não escreve os doze segundos.", screen:"A tarde, não o mapa"},
        {t:"Pergunta", say:"Qual é o problema único que o seu método ainda não escreveu?", screen:"Um problema"},
        {t:"CTA", say:"Comenta DOZE se for fazer uma etapa, não o ano.", screen:"Comenta DOZE"}
      ]
    },
    prac: {
      title: "Doze minutos, uma etapa",
      dur: "40s",
      gesture: "Comenta: TARDE",
      caption: "Timer de doze minutos. Um caso do mês passado. Três linhas. Entrou. Eu fiz. Saiu.\n\nPara quando o timer acaba.",
      beats: [
        {t:"Corte", say:"Doze minutos. Não doze páginas.", screen:"Doze minutos"},
        {t:"1", say:"Um caso que você resolveu no mês passado. Só esse.", screen:"1 · Um caso"},
        {t:"2", say:"Três linhas. O que entrou. O que você fez. O que saiu. Se não tem saída, não é etapa.", screen:"2 · Entrou. Fiz. Saiu."},
        {t:"3", say:"O timer acaba, você para. Feio e escrito ganha de bonito e na cabeça.", screen:"3 · Para"},
        {t:"Chave", say:"Comenta TARDE quando as três linhas existirem.", screen:"Comenta TARDE"}
      ]
    }
  },
  "A empresa que só vive em você": {
    doc: {
      title: "A cozinha saiu da cabeça dela",
      dur: "80s",
      gesture: "Comenta: RECEITA",
      caption: "1961. Julia Child publica o livro com duas cozinheiras. A cozinha deixa de precisar dela na sala.\n\nComenta RECEITA.",
      beats: [
        {t:"Gancho", say:"A cozinha francesa não precisava de mais uma cozinheira famosa. Precisava de uma receita que outro seguisse.", screen:"Outro seguisse"},
        {t:"Fato", say:"1961. Julia Child, com Simone Beck e Louisette Bertholle, publica Mastering the Art of French Cooking. O ponto não é o programa de televisão. O ponto é o livro. A etapa fica no papel. A cozinha anda sem ela na sala.", lesson:"Não dizer que ela inventou a cozinha francesa. O livro é de 1961. A TV vem depois.", screen:"1961", roll:"Tela cheia: capa da primeira edição, ou foto dela na cozinha em domínio público. Wikimedia Commons: Julia Child e Mastering the Art of French Cooking. Sem episódio de série, sem Netflix."},
        {t:"Virada", say:"Enquanto o gesto morava nela, a casa parava quando ela saía. Quando o gesto virou passo, outra pessoa jantava sem a autora do lado.", screen:"Sem a autora do lado"},
        {t:"Leitura", say:"Empresa que só vive em você não é lealdade. É um risco sem nome. Legado, aqui, é a parte que se repete saindo da cabeça.", screen:"Saindo da cabeça"},
        {t:"Pergunta", say:"Qual receita do seu negócio ainda não existe se você não estiver na cozinha?", screen:"Qual receita?"},
        {t:"CTA", say:"Comenta RECEITA. Uma. A que a segunda-feira pede.", screen:"Comenta RECEITA"}
      ]
    },
    prac: {
      title: "A decisão que voltou",
      dur: "42s",
      gesture: "Comenta: VOLTOU",
      caption: "Uma decisão que voltou para você esta semana. Quem mais poderia ter tomado. O que faltou para essa pessoa.\n\nNão delega hoje.",
      beats: [
        {t:"Corte", say:"Uma decisão que voltou para você esta semana. Uma.", screen:"Uma decisão"},
        {t:"1", say:"Escreve o que foi. Sem discurso.", screen:"1 · O que foi"},
        {t:"2", say:"Do lado, quem mais poderia ter tomado. Se ninguém, escreve ninguém.", screen:"2 · Quem mais"},
        {t:"3", say:"Uma frase. O que faltou para essa pessoa. Informação, limite, ou coragem sua de soltar.", screen:"3 · O que faltou"},
        {t:"Chave", say:"Não passa a decisão hoje. Só nomeia. Comenta VOLTOU.", screen:"Comenta VOLTOU"}
      ]
    }
  },
  "O livro não é a mentoria": {
    doc: {
      title: "O livro era a linguagem",
      dur: "85s",
      gesture: "Comenta: LER",
      caption: "1946. A Autobiografia de um Iogue. Yogananda já estava nos Estados Unidos desde 1920. Ler não era praticar.\n\nComenta LER.",
      beats: [
        {t:"Gancho", say:"Tem livro que as pessoas tratam como se a leitura fosse a prática. Não é.", screen:"Ler não é praticar"},
        {t:"Fato", say:"1946. Paramahansa Yogananda publica a Autobiografia de um Iogue. Ele tinha chegado aos Estados Unidos em 1920. O livro viajou mais do que a sala. Muita gente parou na página e achou que a página era o treino.", lesson:"Chegada em 1920, Boston. O livro é 1946. Não inventar citação dele.", screen:"1946", roll:"Tela cheia: capa antiga da autobiografia, edição que esteja em Wikimedia Commons. Busca: Autobiography of a Yogi 1946 cover. Se a capa tiver direito de editora, não usa. Nesse caso, só a tarja 1946 e você no quadro. Não filma o miolo de um livro com copyright de perto para publicar como se fosse seu."},
        {t:"Virada", say:"A linguagem cabe num livro. O gesto, não. Quem lê e não pratica fica com frase boa e corpo no mesmo lugar.", screen:"Frase boa. Corpo parado."},
        {t:"Leitura", say:"Eu uso o livro assim. Códigos de Origem é vocabulário. A casa é outra coisa. Uma não substitui a outra. Ler é adulto. Confundir leitura com construção, não.", screen:"Vocabulário não é a casa"},
        {t:"Pergunta", say:"O que você entendeu no livro e ainda não virou um gesto nesta semana?", screen:"Entendeu. Não fez."},
        {t:"CTA", say:"Comenta LER se você for separar as duas coisas.", screen:"Comenta LER"}
      ]
    },
    prac: {
      title: "Duas colunas",
      dur: "40s",
      gesture: "Comenta: COLUNA",
      caption: "O livro na mesa. Duas colunas. Linguagem. Construção. Uma linha em cada.\n\nSe tudo cair em linguagem, você ainda não começou a casa.",
      beats: [
        {t:"Corte", say:"Põe o livro na mesa. Abre um papel com duas colunas.", screen:"Duas colunas"},
        {t:"1", say:"Linguagem. Uma linha que o livro te deu e você consegue dizer.", screen:"1 · Linguagem"},
        {t:"2", say:"Construção. Uma coisa que teria que sair da página e virar etapa. Se não tiver, a coluna fica vazia. O vazio é o dado.", screen:"2 · Construção"},
        {t:"3", say:"Não compra a casa por causa do papel. Não despreza o livro. Só para de chamar os dois pelo mesmo nome.", screen:"3 · Dois nomes"},
        {t:"Chave", say:"Comenta COLUNA e diz qual das duas ficou vazia.", screen:"Qual ficou vazia"}
      ]
    }
  },
  "Três cômodos, uma casa": {
    doc: {
      title: "O inverno que ninguém lembra",
      dur: "100s",
      gesture: "Comenta: CORPO",
      caption: "1944–45. O oeste da Holanda passa fome. Décadas depois, o corpo de quem estava na barriga ainda carregava uma marca pequena.\n\nFato e leitura não são a mesma coisa.\n\nComenta CORPO.",
      beats: [
        {t:"Gancho", say:"Em 1945, milhares de bebês nasceram carregando um inverno de que nenhum deles se lembra.", screen:"Um inverno que não lembram"},
        {t:"Fato", say:"Holanda. Inverno de 1944 para 1945. O oeste do país fica sem comida. A ração, no fim, fica na faixa das quinhentas a setecentas calorias. Chamaram de Hongerwinter.", lesson:"Heijmans e colegas, PNAS 2008, descrevem médias em torno de 667 kcal. Abril de 1945 é citado perto de 500. Não escolher um número só e tratar como certidão.", screen:"1944–45", roll:"Tela cheia: mapa da Holanda e foto de racionamento da época. Wikimedia Commons e Nationaal Archief: Hongerwinter. Busca também Dutch famine 1944. Sem filme de guerra."},
        {t:"A conta", say:"A estimativa mais citada fala em torno de vinte mil mortos. Não é um número de certidão. E, no meio disso, mulheres grávidas continuaram gerando.", screen:"~20 mil", roll:"Tela cheia: cartão de racionamento, fila, documento. Nationaal Archief. Se a imagem for pesada demais, fica no mapa. Sem corpo, sem criança passando fome em close de stock moderno."},
        {t:"O estudo", say:"Décadas depois, dois achados, não um. Quem passou a fome no começo da gestação apareceu, adulto, com mais problema de peso e de coração. Em 2008, um trabalho comparou irmãos. Quem foi concebido na fome tinha, sessenta anos depois, um pouco menos de metilação num trecho do gene IGF2. Cerca de cinco por cento. É associação. Não é prova de que a marca causou a doença.", lesson:"Não dizer que a epigenética provou o campo. Não falar de neto.", screen:"2008 · irmãos · ~5%"},
        {t:"Virada", say:"A guerra acabou. A comida voltou. O corpo de alguns ainda carregava o cômodo de um inverno que a mente não viveu.", screen:"A mente não viveu"},
        {t:"Leitura", say:"Eu não junto isso em três cursos. Corpo, mente e campo são cômodos da mesma casa. Tem padrão que não nasceu de uma escolha sua. Nasceu de um ambiente.", lesson:"Aqui é leitura. Separar da frase do estudo.", screen:"Três cômodos"},
        {t:"Pergunta", say:"Qual dos três você trata como se fosse outra vida? Corpo, mente, ou o lugar onde você decide?", screen:"Qual você separou?"},
        {t:"CTA", say:"Comenta CORPO se o cômodo que você esqueceu foi esse.", screen:"Comenta CORPO"}
      ]
    },
    prac: {
      title: "Três papéis na parede",
      dur: "42s",
      gesture: "Comenta o papel que ficou vazio",
      caption: "Três papéis. Essência. Alma. Valor. Embaixo de cada um, uma coisa desta semana.\n\nO vazio é o cômodo. Não preenche hoje.",
      beats: [
        {t:"Corte", say:"Três papéis na parede, aqui em casa. Essência. Alma. Valor.", screen:"Três papéis"},
        {t:"1", say:"Embaixo de cada um, uma coisa que aconteceu esta semana. Concreta. Não um plano.", screen:"1 · Esta semana"},
        {t:"2", say:"O papel que ficar vazio é o cômodo que você está tratando como outra vida.", screen:"2 · O vazio"},
        {t:"3", say:"Não preenche hoje. Não compra um curso para o papel. Olha o vazio até amanhã.", screen:"3 · Até amanhã"},
        {t:"Chave", say:"Comenta o nome do papel vazio.", screen:"O nome do vazio"}
      ]
    }
  },
  "Quem te indica traduz no escuro": {
    doc: {
      title: "Durante séculos, no escuro",
      dur: "85s",
      gesture: "Comenta: PEDRA",
      caption: "1799. Uma pedra com o mesmo decreto em três escritas. Até 1822, a tradução era no escuro.\n\nComenta PEDRA.",
      beats: [
        {t:"Gancho", say:"Durante séculos, gente traduziu um texto no escuro. Faltava a frase ao lado.", screen:"Faltava a frase ao lado"},
        {t:"Fato", say:"1799. Perto de Rashid, no Egito. Soldados da campanha de Napoleão acham uma pedra. O mesmo decreto está em três escritas. Hieróglifos, demótico e grego.", lesson:"Pedra de Roseta. Não precisar do nome inglês.", screen:"1799", roll:"Tela cheia: a Pedra de Roseta, o objeto, não um filme de museu com narrador. Wikimedia Commons: Rosetta Stone. O original está no British Museum. A foto do objeto é o que serve."},
        {t:"O tempo", say:"O grego era a escrita que já se lia. As outras, não. Em 1822, Champollion apresenta a leitura. Vinte e três anos com a pedra na mão, e ainda assim a tradução esperou o texto paralelo.", lesson:"Lettre à M. Dacier, 1822. Não dizer que ele fez sozinho numa tarde.", screen:"1822", roll:"Tela cheia: detalhe das três faixas de texto, se a foto permitir. A mesma busca. Sem reconstituição de Hollywood."},
        {t:"Virada", say:"Sem a frase ao lado, cada um inventava o sentido. Com a frase ao lado, outro conseguia repetir.", screen:"A frase ao lado"},
        {t:"Leitura", say:"Quem te indica sem a sua frase está nesse intervalo. Não é má vontade. É tradução no escuro. A frase não é marketing. É o texto paralelo.", screen:"Não é má vontade"},
        {t:"Pergunta", say:"Qual palavra sua a pessoa que te indica ainda não tem ao lado?", screen:"Qual palavra falta?"},
        {t:"CTA", say:"Comenta PEDRA se você for escrever essa palavra. Uma.", screen:"Comenta PEDRA"}
      ]
    },
    prac: {
      title: "A frase que você desejou",
      dur: "40s",
      gesture: "Comenta a palavra marcada",
      caption: "Escreve a frase que você gostaria que tivessem dito. Marca a palavra que a pessoa não sabe.\n\nNão manda ainda.",
      beats: [
        {t:"Corte", say:"Não liga para ninguém. Escreve a frase que você gostaria que tivessem dito ao te apresentar.", screen:"A frase que você desejou"},
        {t:"1", say:"Uma frase. Sem cargo.", screen:"1 · Sem cargo"},
        {t:"2", say:"Marca a palavra que essa pessoa, hoje, não saberia. Essa é a tradução no escuro.", screen:"2 · A palavra"},
        {t:"3", say:"Não manda hoje. O reel pede para mandar. Aqui o trabalho é ver a palavra antes.", screen:"3 · Não manda hoje"},
        {t:"Chave", say:"Comenta a palavra marcada.", screen:"A palavra"}
      ]
    }
  },
  "Você diz que quer legado": {
    doc: {
      title: "Ele leu o próprio obituário",
      dur: "90s",
      gesture: "Comenta: NOME",
      caption: "1888. Um jornal anuncia a morte de Alfred Nobel por engano. Era o irmão. O nome que ia ficar não era o que ele dizia querer.\n\nA frase exata do título é disputada.\n\nComenta NOME.",
      beats: [
        {t:"Gancho", say:"Alfred Nobel leu, em vida, o nome que ia ficar. Não era o nome que ele dizia querer.", screen:"O nome que ia ficar"},
        {t:"Fato", say:"1888. O irmão, Ludvig, morre. Um jornal francês troca as pessoas e anuncia Alfred. O texto trata o nome como quem vende morte. A frase exata do título é disputada. O efeito circula desde então. Ele ainda estava vivo.", lesson:"Não cravar “le marchand de la mort” como se a página estivesse na mesa. Dizer que a frase exata é disputada.", screen:"1888", roll:"Tela cheia: retrato de Alfred Nobel em domínio público, e se achar o jornal, só se for arquivo verificável. Wikimedia Commons: Alfred Nobel. Se não achar o jornal, não inventa a primeira página. Fica no retrato."},
        {t:"Depois", say:"O testamento de 1895 muda o que o nome carrega. Os prêmios. Isso é estrutura. Não é um discurso de domingo.", lesson:"Testamento de 27 de novembro de 1895.", screen:"1895 · o testamento", roll:"Tela cheia: a primeira página do testamento, se estiver no Nobel Prize site ou na Wikimedia. Busca: Alfred Nobel will. Não usar reconstituição de ator."},
        {t:"Virada", say:"Ler o nome que ia ficar é um susto. O dia seguinte é que decide se era discurso ou arquitetura.", screen:"O dia seguinte"},
        {t:"Leitura", say:"Você pode dizer que quer deixar algo de pé. Se o dia que você repete não produz uma frase, uma etapa e um limite, o legado ainda é o obituário que você não leu.", screen:"Discurso não é testamento"},
        {t:"Pergunta", say:"Se o seu nome parasse hoje, o que já estaria escrito fora da sua boca?", screen:"Fora da sua boca"},
        {t:"CTA", say:"Comenta NOME se for olhar isso sem teatro.", screen:"Comenta NOME"}
      ]
    },
    prac: {
      title: "O que ainda existe amanhã",
      dur: "38s",
      gesture: "Comenta: AMANHÃ",
      caption: "Uma linha. Hoje eu fiz. E uma coisa que ainda existe amanhã sem você falar.\n\nSe não tiver, o legado de hoje foi discurso.",
      beats: [
        {t:"Corte", say:"Abre a nota do telefone. Duas linhas. Só duas.", screen:"Duas linhas"},
        {t:"1", say:"Hoje eu fiz. Uma coisa. Sem adjetivo.", screen:"1 · Hoje eu fiz"},
        {t:"2", say:"Ainda existe amanhã, sem eu falar. Se não existir, escreve não existe.", screen:"2 · Amanhã"},
        {t:"3", say:"Não transforma em plano de doze meses. O não existe já é o diagnóstico do dia.", screen:"3 · Sem plano"},
        {t:"Chave", say:"Comenta AMANHÃ se a segunda linha tiver alguma coisa. Ou NÃO, se ficou vazia.", screen:"AMANHÃ ou NÃO"}
      ]
    }
  },
  "O ciclo, dito uma vez": {
    doc: {
      title: "Não eram três produtos",
      dur: "80s",
      gesture: "Comenta: LISTA",
      caption: "20 de julho de 1969. A missão não era três produtos. Era um ciclo. O que outra pessoa segurava na mão era a lista.\n\nComenta LISTA.",
      beats: [
        {t:"Gancho", say:"A ida à Lua não foi vendida como três cursos. Era um ciclo. Com lista.", screen:"Um ciclo"},
        {t:"Fato", say:"Vinte de julho de 1969. Apollo 11. Subir, orbitar, pousar, voltar. Cada pedaço tinha entrada e saída. O que o astronauta segurava não era um discurso. Era a lista. Outra pessoa, em terra, segurava a mesma lista.", lesson:"Não inventar frase de checklist. Não transformar a NASA em metáfora de mentoria por mais de uma linha.", screen:"20 jul 1969", roll:"Tela cheia: a foto da Terra a partir da Lua, ou o módulo, arquivo da NASA. images.nasa.gov, busca Apollo 11. É uso livre, com crédito na legenda se você quiser. Sem filme Apollo 13."},
        {t:"Virada", say:"Três foguetes separados não teriam voltado. O que voltou foi a sequência. Um ciclo. A lista era a estrutura que outro entendia.", screen:"A lista, não o discurso"},
        {t:"Leitura", say:"Eu digo o ciclo uma vez, desse tamanho. Não são três produtos. É uma casa. Se não for a hora, a frase e a etapa já são trabalho. A lista não é pressa.", screen:"Não são três produtos"},
        {t:"Pergunta", say:"O que você chama de ciclo hoje ainda são três compras que não se falam?", screen:"Três compras?"},
        {t:"CTA", say:"Comenta LISTA se for olhar a sequência, não o cartaz.", screen:"Comenta LISTA"}
      ]
    },
    prac: {
      title: "Duas linhas, sem porta",
      dur: "40s",
      gesture: "Comenta: CEDO",
      caption: "Linha um: o que você já tem. Frase, ou uma etapa.\n\nLinha dois: o que ainda não tem.\n\nSe as duas forem “não sei”, você não está atrasado. Está cedo.",
      beats: [
        {t:"Corte", say:"Não abre página de aplicação. Abre duas linhas.", screen:"Sem porta"},
        {t:"1", say:"O que você já tem. Uma frase, ou uma etapa. Se não tem, escreve não tenho.", screen:"1 · Já tenho"},
        {t:"2", say:"O que ainda falta para outra pessoa entender o seu trabalho sem você do lado.", screen:"2 · Ainda falta"},
        {t:"3", say:"Se as duas linhas forem não sei, você não está atrasado. Está cedo. Cedo não se resolve com pressa.", screen:"3 · Cedo"},
        {t:"Chave", say:"Comenta CEDO se for esse o caso. Ou TENHO, se a primeira linha existir.", screen:"CEDO ou TENHO"}
      ]
    }
  },
  "Eu penso daqui": {
    doc: {
      title: "O livro só existe porque ele foi",
      dur: "85s",
      gesture: "Comenta: CHÃO",
      caption: "1897. Euclides da Cunha é mandado a Canudos. Os Sertões sai em 1902. O livro não nasceu num palco alugado.\n\nComenta CHÃO.",
      beats: [
        {t:"Gancho", say:"Tem livro que não nasceria num estúdio. Nasceu porque o homem foi até o chão.", screen:"Até o chão"},
        {t:"Fato", say:"1897. Euclides da Cunha vai a Canudos como correspondente. O jornal é O Estado de S. Paulo. Ele não escreve de ouvido. Em 1902 sai Os Sertões. O chão entra no livro. O palco, não.", lesson:"Não resumir a guerra. O fato aqui é a ida e a data do livro. Sem exploração do sofrimento como gancho bonito.", screen:"1897 · 1902", roll:"Tela cheia: retrato de Euclides da Cunha e, se couber, a capa antiga de Os Sertões. Wikimedia Commons: Euclides da Cunha. A capa da primeira edição, se estiver em arquivo público. Sem filme recente de Canudos. Sem imagem de corpo."},
        {t:"Virada", say:"Autoridade de palco alugado dura um story. Autoridade de quem mostra o próprio chão fica, porque o outro consegue ir até a fonte.", screen:"O outro vai até a fonte"},
        {t:"Leitura", say:"Eu gravo daqui. Vilas. A praia fica aqui. Não é cenário. É o endereço. O trabalho é o mesmo em qualquer cidade. A voz não precisa mentir o CEP.", screen:"O endereço não é cenário"},
        {t:"Pergunta", say:"Se tirassem o seu cenário emprestado, a sua frase ainda se sustentava no cômodo onde você está agora?", screen:"Nesse cômodo?"},
        {t:"CTA", say:"Comenta CHÃO se for gravar do lugar onde você realmente está.", screen:"Comenta CHÃO"}
      ]
    },
    prac: {
      title: "Uma frase, nesse cômodo",
      dur: "35s",
      gesture: "Não comenta. Assiste uma vez.",
      caption: "Uma frase. O cômodo onde você está. Sem skyline, sem sala alugada.\n\nSe o vídeo pudesse ter sido gravado em qualquer coworking, grava de novo.",
      beats: [
        {t:"Corte", say:"Não sai de casa. Uma frase. O cômodo em que você está agora entra no quadro.", screen:"Esse cômodo"},
        {t:"1", say:"A frase é onde você trabalha. Não é o manifesto. É o chão.", screen:"1 · O chão"},
        {t:"2", say:"Assiste uma vez. Se esse vídeo poderia ter sido gravado em qualquer coworking, apaga.", screen:"2 · Se for qualquer lugar, apaga"},
        {t:"3", say:"Grava de novo, com uma coisa do cômodo que só existe aí. A cadeira. A janela. A mesa.", screen:"3 · Uma coisa que só existe aí"},
        {t:"Chave", say:"Não publica se ainda parecer cenário. Publica quando parecer endereço.", screen:"Endereço, não cenário"}
      ]
    }
  }
};

function extraCards(parent, i){
  if(parent.who!=="yan") return [];
  const pack = EXTRA[parent.title];
  if(!pack) return [];
  const n = String(i+1).padStart(2,"0");
  function piece(kind, src){
    return {
      kind: kind,
      who: "yan",
      parent: parent.title,
      day: parent.day,
      title: src.title,
      place: CASA,
      dur: src.dur,
      format: kind==="denso" ? "TikTok documental" : "TikTok prático",
      gesture: src.gesture,
      caption: src.caption,
      beats: src.beats
    };
  }
  function card(s, num, klass, when){
    const el = document.createElement("button");
    el.type = "button";
    el.className = "card " + klass;
    el.dataset.who = "yan";
    el.innerHTML = '<div class="num">'+num+'</div><div><div class="tag">'+esc(when)+'</div><h2>'+esc(s.title)+'</h2><div class="meta">'+esc(s.dur)+' · em casa<br>'+esc(s.gesture)+'</div></div><div class="open meta">Abrir</div>';
    el.onclick = ()=>openScript(s);
    return el;
  }
  return [
    card(piece("denso", pack.doc), n+".4", "denso", n+".4 · TikTok documental · outro tema"),
    card(piece("ops", pack.prac), n+".5", "ops", n+".5 · TikTok prático · outro tema")
  ];
}
window.extraCards = extraCards;
render("todos");
