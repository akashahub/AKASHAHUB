#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Roteiros novos do ecossistema. Não é a vitrine antiga da academia."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont("DejaVu", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DejaVuB", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DejaVuSB", "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"))

INK = HexColor("#14110E")
MUTED = HexColor("#5C564C")
GOLD = HexColor("#9A7420")
VIOLET = HexColor("#4A2170")
CREAM = HexColor("#F6F3EC")
DIR = HexColor("#6B4A12")
W, H = A4
ML, MR, MT, MB = 16 * mm, 16 * mm, 14 * mm, 16 * mm


def S(**k):
    return k


VITRINE = [
S(n="V01", lote="VITRINE AF", produto="Alinhamento Financeiro", q="Dinheiro como comportamento",
  cta="MAPA", dur="25s", cena="Mesa. Sem tela de sistema.", e="6/10",
  who="Estrategista.", avoid="Preço. Plano. Módulo. Palavra caixa.",
  h="NÃO É FALTA DE DINHEIRO", g="Você não tem problema de dinheiro. Tem problema de estrutura.",
  vis="Olho na lente. Pausa depois da primeira frase.",
  voz="Firme. Silêncio no gancho.",
  tele="""Você não tem problema de dinheiro.

Tem problema de estrutura.

Ganha.

Gasta.

Não sabe quanto custa a sua vida.

Não sabe o que está construindo.

O número no fim do mês
só confirma a rotina.

Comenta MAPA.""",
  leg="Não é falta de dinheiro. É estrutura. Comenta MAPA."),

S(n="V02", lote="VITRINE AF", produto="Alinhamento Financeiro", q="Sistemas",
  cta="MAPA", dur="25s", cena="Rua ou carro parado.", e="7/10",
  who="Provocador calmo.", avoid="Humilhar. Preço. Plano.",
  h="NO DIA 28 SOME", g="Tem gente que trabalha o mês inteiro e no dia 28 some o que entrou.",
  vis="Olhar direto. Pouco gesto.",
  voz="Soco. Depois baixo.",
  tele="""Tem gente que trabalha o mês inteiro

e no dia 28
some o que entrou.

Não foi o mercado.

Não foi o universo.

Foi a falta de ordem
no que já passou pela mão.

Eu não pergunto primeiro
quanto você quer ganhar.

Eu pergunto
o que acontece
com o que já entra.

Comenta MAPA.""",
  leg="O que entra some. Comenta MAPA."),

S(n="V03", lote="VITRINE AF", produto="Alinhamento Financeiro", q="Sistemas",
  cta="ALINHADO", dur="30s", cena="Parede simples.", e="7/10",
  who="Estoico.", avoid="Plano. Preço. Motivação.",
  h="LUCRO É OXIGÊNIO", g="Falar que dinheiro não importa é fácil quando a conta ainda aguenta.",
  vis="Parado. Olho na lente.",
  voz="Pausa longa depois do gancho.",
  tele="""Falar que dinheiro não importa

é fácil
quando a conta ainda aguenta.

Lucro não é ganância.

Lucro é oxigênio
do que você diz que constrói.

Sem oxigênio,
o propósito morre no discurso.

Alinhamento financeiro
não é ficar rico no vídeo.

É parar de se trair
no que já está na sua mão.

Escreve ALINHADO.""",
  leg="Lucro é oxigênio. Escreve ALINHADO."),

S(n="V04", lote="VITRINE AF", produto="Alinhamento Financeiro", q="Execução",
  cta="MAPA", dur="22s", cena="Notebook fechado.", e="5/10",
  who="Construtor.", avoid="Abrir plataforma. Plano.",
  h="DICA VOCÊ ESQUECE", g="Dica você esquece. Lugar você volta.",
  vis="Mão no notebook fechado.",
  voz="Calmo.",
  tele="""Dica você esquece.

Lugar você volta.

Eu não ensino alinhamento
em frase solta.

Eu coloquei isso
num lugar
onde a pessoa entra,

vê o que fazer agora,

e volta amanhã.

Sem depender
da emoção da live.

Comenta MAPA.""",
  leg="Dica você esquece. Lugar você volta. Comenta MAPA."),

S(n="V05", lote="VITRINE AF", produto="Alinhamento Financeiro", q="Execução",
  cta="MAPA", dur="25s", cena="Relógio ou rotina da manhã.", e="5/10",
  who="Mentor.", avoid="Vender yoga. Vender academia.",
  h="TIMING", g="Não é só o que você faz. É quando você faz.",
  vis="Olhar o relógio. Depois a câmera.",
  voz="Médio-lento.",
  tele="""Não é só o que você faz.

É quando você faz.

Tem decisão certa
na hora errada.

Tem trabalho duro
no ciclo errado.

Alinhamento também é timing.

Hora de construir.

Hora de cortar.

Hora de não mexer.

Comenta MAPA.""",
  leg="Alinhamento também é timing. Comenta MAPA."),

S(n="V06", lote="VITRINE AF", produto="Sessão de Alinhamento", q="Execução",
  cta="CALL", dur="22s", cena="Caminhando.", e="5/10",
  who="Conversa com uma pessoa.", avoid="Preço. Plano. Promessa de ganho.",
  h="ANTES DO MÉTODO, O MAPA", g="Talvez você não precise de mais um curso. Precisa de alguém que veja o mapa.",
  vis="Para. Olha.",
  voz="Baixa.",
  tele="""Talvez você não precise
de mais um curso.

Precisa de alguém que veja o mapa.

O que está funcionando.

O que está te atrasando.

Qual é o próximo movimento.

Isso eu faço
numa conversa.

Sem teatro.

Escreve CALL.""",
  leg="Antes do método, o mapa. Escreve CALL."),

S(n="V07", lote="VITRINE LEGADO", produto="Legado Digital", q="Execução",
  cta="LEGADO", dur="28s", cena="Caderno.", e="5/10",
  who="Construtor.", avoid="Jargão. Quinta dimensão.",
  h="ESSÊNCIA SEM ESTRUTURA SOME", g="Essência sem estrutura some. Estrutura sem essência não serve.",
  vis="Fecha o caderno. Olha.",
  voz="Calma.",
  tele="""Essência sem estrutura some.

Estrutura sem essência não serve.

Eu junto as duas.

Marca.

Método.

Página.

Sistema.

Acompanhamento.

Isso é legado digital.

Não é post.

É o que continua
se o aplicativo fechar.

Comenta LEGADO.""",
  leg="Essência sem estrutura some. Comenta LEGADO."),

S(n="V08", lote="VITRINE LEGADO", produto="Arquitetura e Ciência", q="Execução",
  cta="LEGADO", dur="30s", cena="Três dedos na mesa.", e="6/10",
  who="Arquiteto. Uma camada por frase.",
  avoid="Aula de constelação. Ritual. Preço.",
  h="TRÊS CAMADAS", g="Eu não construo só página. Eu construo três camadas.",
  vis="Mostra 1, 2, 3 com a mão. Sem teatro.",
  voz="Clara. Como pra criança.",
  tele="""Eu não construo só página.

Eu construo três camadas.

Uma: o que o mundo vê.
Marca. Conteúdo. Sistema.

Duas: o padrão que se repete
na família e na decisão.

Três: o registro.
O que você faz
quando ninguém está vendo.

Página sem isso
é vitrine vazia.

Comenta LEGADO.""",
  leg="Três camadas. Comenta LEGADO."),

S(n="V09", lote="VITRINE LEGADO", produto="Império Digital", q="Execução",
  cta="LEGADO", dur="22s", cena="Celular na mão, tela apagada.", e="6/10",
  who="Visionário.", avoid="Hate de Instagram. Vender site.",
  h="POST NÃO É IMPÉRIO", g="Post não é império. Império é o que sobra quando o post some.",
  vis="Vira o celular. Tela preta.",
  voz="Seco.",
  tele="""Post não é império.

Império é o que sobra
quando o post some.

Lista.

Método.

Página.

Produto.

Gente que volta.

Se tudo que você tem
é o algoritmo,
você não tem império.

Tem aluguel.

Comenta LEGADO.""",
  leg="Post não é império. Comenta LEGADO."),

S(n="V10", lote="VITRINE TECH", produto="Tech Hub", q="Execução",
  cta="CODIGO", dur="20s", cena="Notebook fechado.", e="5/10",
  who="Quem explica pra criança de doze anos.",
  avoid="Lista de linguagens. Palavra difícil primeiro.",
  h="PORTA, CHAVE, QUARTO", g="Tecnologia não é mágica. É porta, chave e quarto.",
  vis="Três toques na mesa: porta, chave, quarto.",
  voz="Simples.",
  tele="""Tecnologia não é mágica.

É porta.

Chave.

Quarto.

Quem tem a chave entra.

Quem não tem, não entra.

O quarto é onde as coisas ficam.

Eu ensino isso
do jeito que uma criança entende

e um adulto usa.

Comenta CODIGO.""",
  leg="Porta, chave, quarto. Comenta CODIGO."),

S(n="V11", lote="VITRINE TECH", produto="Tech Hub", q="Sistemas",
  cta="CODIGO", dur="22s", cena="Tela de lado, sem código.", e="6/10",
  who="Construtor.", avoid="IA milagrosa.",
  h="IA SEM ORDEM", g="IA sem ordem só faz bagunça mais rápido.",
  vis="Olhar câmera.",
  voz="Provocador calmo.",
  tele="""IA sem ordem
só faz bagunça mais rápido.

Ferramenta nova
em vida velha
continua vida velha.

Primeiro a porta.

Depois a chave.

Depois o quarto.

Aí a IA trabalha
dentro de um lugar.

Não no vazio.

Comenta CODIGO.""",
  leg="IA sem ordem é bagunça rápida. Comenta CODIGO."),

S(n="V12", lote="VITRINE MAG", produto="Magnetismo Pessoal", q="Presença",
  cta="PRESENÇA", dur="18s", cena="Rosto. Silêncio real.", e="4/10",
  who="Magnético. Menos palavra.",
  avoid="Sedução. Teatro.",
  h="UM SEGUNDO", g="Um segundo de silêncio muda a conversa inteira.",
  vis="Pausa real de 1s no vídeo.",
  voz="Deixa o vazio.",
  tele="""Um segundo de silêncio
muda a conversa inteira.

Quando a outra pessoa termina,

não corre.

Espera.

Respira.

Depois fala.

Sete dias.

Só isso.

Comenta PRESENÇA.""",
  leg="Um segundo. Sete dias. Comenta PRESENÇA."),

S(n="V13", lote="VITRINE MAG", produto="Tecnologia da Alma", q="Presença",
  cta="PRESENÇA", dur="22s", cena="WhatsApp fechado.", e="4/10",
  who="Baixo. Quase frio.",
  avoid="Expor conversa.",
  h="RESPONDER RÁPIDO", g="Responder rápido não é presença. Às vezes é desespero.",
  vis="Celular na mão. Não abre.",
  voz="Baixa.",
  tele="""Responder rápido
não é presença.

Às vezes é desespero.

Presença também é
não responder agora.

É terminar o que você está fazendo.

É chegar inteiro.

Não pela metade.

Comenta PRESENÇA.""",
  leg="Responder rápido às vezes é desespero. Comenta PRESENÇA."),

S(n="V14", lote="VITRINE MAG", produto="Fascinação", q="Presença",
  cta="PRESENÇA", dur="22s", cena="Corredor. Pouco movimento.", e="4/10",
  who="Provocador magnético.",
  avoid="Cara de sedução.",
  h="GENTE LINDA VOCÊ ESQUECE", g="Tem gente linda que você esquece em cinco minutos.",
  vis="Quase sem gesto.",
  voz="Lento no gancho.",
  tele="""Tem gente linda
que você esquece em cinco minutos.

E tem gente que entra
e a sala muda.

Não é beleza.

É presença.

É voz.

É escuta.

Fascinação não é obrigar o olhar.

É ser interessante o bastante
pra atenção acontecer.

Comenta PRESENÇA.""",
  leg="Gente linda você esquece. Comenta PRESENÇA."),

S(n="V15", lote="VITRINE LIVRO", produto="Códigos de Origem", q="Mandala",
  cta="LIVRO", dur="28s", cena="Andando. Sem livro de capa genérica se não for o seu.", e="5/10",
  who="História sua.",
  avoid="Místico demais. Promessa mágica.",
  h="VOCÊ JÁ TEM CÓDIGOS", g="Várias decisões da minha vida pareciam diferentes. Repetiam o mesmo padrão.",
  vis="Caminha. Vira.",
  voz="Humana.",
  tele="""Várias decisões da minha vida
pareciam diferentes.

Repetiam o mesmo padrão.

Lugar mudava.

Pessoa mudava.

Trabalho mudava.

Corpo.

Mente.

Campo.

Isso virou livro.

Não pra dizer quem você é.

Pra você enxergar
o que constrói quem você é.

Comenta LIVRO.""",
  leg="Você já tem códigos. Comenta LIVRO."),

S(n="V16", lote="VITRINE LIVRO", produto="Biblioteca Akasha", q="Mandala",
  cta="LIVRO", dur="20s", cena="Estante ou mão vazia.", e="5/10",
  who="Mentor.",
  avoid="Preço. Gratuito falso.",
  h="PDF SOLTO NÃO É BIBLIOTECA", g="PDF solto não é biblioteca. Biblioteca é ordem.",
  vis="Olhar câmera.",
  voz="Objetiva.",
  tele="""PDF solto não é biblioteca.

Biblioteca é ordem.

O que ler primeiro.

O que não misturar.

O que praticar.

Conhecimento sem ordem
vira coleção.

Coleção não muda vida.

Comenta LIVRO.""",
  leg="PDF solto não é biblioteca. Comenta LIVRO."),

S(n="V17", lote="VITRINE PALADIM", produto="Paladim", q="Mandala",
  cta="CARATER", dur="25s", cena="Caminhada.", e="6/10",
  who="Sério. Sem palanque.",
  avoid="Religião de palco. Magia no gancho. Preço.",
  h="CARÁTER NÃO É MORALISMO", g="Curso de caráter quase não existe. Porque caráter não é pose.",
  vis="Para no gancho.",
  voz="Firme.",
  tele="""Curso de caráter
quase não existe.

Porque caráter não é pose.

Não é ética de vitrine.

Não é moralismo.

É o que você faz
quando ninguém está vendo

e o dinheiro está em jogo.

Prosperar sem isso
é construção oca.

Comenta CARATER.""",
  leg="Caráter não é moralismo. Comenta CARATER."),

S(n="V18", lote="VITRINE PALADIM", produto="Paladim", q="Mandala",
  cta="CARATER", dur="22s", cena="Rosto.", e="6/10",
  who="Liderança dos bons. Sem super-herói.",
  avoid="Política. Inimigo.",
  h="LIDERANÇA DOS BONS", g="Poder sem caráter vira abuso. Caráter sem poder vira discurso.",
  vis="Olho na lente.",
  voz="Uma ideia.",
  tele="""Poder sem caráter
vira abuso.

Caráter sem poder
vira discurso.

Eu trabalho os dois.

Quem você é
quando pode.

Não quando está sendo visto.

Comenta CARATER.""",
  leg="Poder sem caráter vira abuso. Comenta CARATER."),

S(n="V19", lote="VITRINE MEMBROS", produto="Área de membros", q="Mandala",
  cta="BASE", dur="22s", cena="Simples.", e="5/10",
  who="Iniciado falando com iniciado. Sem hierarquia de deus no gancho.",
  avoid="Despejar Anúbis Ísis Hórus Rá. Ritual completo.",
  h="COMEÇA PELA BASE", g="Tem gente querendo colapso de realidade sem ter base.",
  vis="Olhar.",
  voz="Calmo.",
  tele="""Tem gente querendo
colapso de realidade

sem ter base.

Sem frequência.

Sem padrão.

Sem prática de vinte minutos.

A casa não começa pelo telhado.

Começa pelo chão.

Comenta BASE.""",
  leg="A casa começa pelo chão. Comenta BASE."),

S(n="V20", lote="VITRINE HUB", produto="Akasha Hub", q="Execução",
  cta="HUB", dur="25s", cena="Logo ou mandala no fim, não no gancho.", e="5/10",
  who="Dono do campo. Sem catálogo.",
  avoid="Listar todos os produtos. Preço.",
  h="NÃO É UM CURSO", g="Akasha não é um curso. É um campo com várias portas.",
  vis="Olhar. Sem slide.",
  voz="Clara.",
  tele="""Akasha não é um curso.

É um campo com várias portas.

Dinheiro.

Legado.

Presença.

Caráter.

Sistema.

Você não precisa entrar em todas.

Precisa entrar na certa
agora.

Comenta HUB.""",
  leg="Várias portas. Uma agora. Comenta HUB."),

S(n="V21", lote="VITRINE HUB", produto="Akasha Hub", q="Sistemas",
  cta="HUB", dur="20s", cena="Rosto.", e="7/10",
  who="Autoridade. Sem grito.",
  avoid="Eu sou milionário. Meta de 39 mil. Flex.",
  h="REFERÊNCIA", g="Referência não é quem fala alto. É quem tem lugar pra pessoa voltar.",
  vis="Parado.",
  voz="Baixo e seguro.",
  tele="""Referência não é quem fala alto.

É quem tem lugar
pra pessoa voltar.

Método.

Plataforma.

Livro.

Acompanhamento.

Quem só tem opinião
não é referência.

É barulho.

Comenta HUB.""",
  leg="Referência é lugar pra voltar. Comenta HUB."),

S(n="V22", lote="VITRINE CALL", produto="Leitura Call", q="Execução",
  cta="CALL", dur="20s", cena="Café.", e="4/10",
  who="Íntimo.",
  avoid="Pitch. Preço.",
  h="MAIS CONTEÚDO NÃO RESOLVE", g="Talvez você não precise aprender mais nada agora.",
  vis="Como falando com uma pessoa na mesa.",
  voz="Baixa.",
  tele="""Talvez você não precise
aprender mais nada agora.

Você já tem informação demais.

Falta alguém de fora
mostrar o que você
não está vendo.

O que funciona.

O que atrasa.

O próximo movimento.

Escreve CALL.""",
  leg="Mais conteúdo não resolve. Escreve CALL."),

S(n="V23", lote="VITRINE AF", produto="Alinhamento Financeiro", q="Comportamento",
  cta="MAPA", dur="24s", cena="Casa.", e="6/10",
  who="Investigador.",
  avoid="Julgar família. Preço.",
  h="QUEM DECIDE O DINHEIRO", g="Na sua casa, quem decide o dinheiro de verdade?",
  vis="Pergunta. Espera.",
  voz="Pergunta real.",
  tele="""Na sua casa,
quem decide o dinheiro de verdade?

Você?

O impulso?

A outra pessoa?

O medo?

Alinhamento começa aí.

Não na planilha.

Na decisão.

Comenta MAPA.""",
  leg="Quem decide o dinheiro? Comenta MAPA."),

S(n="V24", lote="VITRINE AF", produto="Alinhamento Financeiro", q="Sistemas",
  cta="MAPA", dur="22s", cena="Academia só se estiver lá. Senão casa.", e="6/10",
  who="Homem comum.",
  avoid="Motivação de gym.",
  h="EMOÇÃO NÃO CARREGA O MÊS", g="Emoção carrega um dia. Sistema carrega o mês.",
  vis="Olhar.",
  voz="Conversa.",
  tele="""Emoção carrega um dia.

Sistema carrega o mês.

Você não precisa
acordar inspirado.

Precisa saber
o que fazer
quando não estiver.

Dinheiro.

Treino.

Conteúdo.

Mesma lógica.

Comenta MAPA.""",
  leg="Emoção carrega um dia. Sistema carrega o mês. Comenta MAPA."),
]


YOUTUBE = [
S(n="YT01", lote="YOUTUBE AULA", produto="Alinhamento Financeiro", q="Arquitetura",
  cta="MAPA", dur="6–8 min", cena="Câmera parada. Rosto. Sem tour de plataforma.",
  e="5/10", who="Mentor claro. Criança de doze anos entende.",
  avoid="Preço. Plano. Sete módulos pelo nome. Ferramentas uma a uma.",
  h="ARQUITETURA DO ALINHAMENTO FINANCEIRO",
  g="Alinhamento financeiro não é ganhar mais. É parar de destruir o que já passa na sua mão.",
  vis="Rosto nítido. Frame real. Sem IA.",
  voz="Gancho seco. Meio conversa. Pausa entre blocos.",
  tele="""Alinhamento financeiro
não é ganhar mais.

É parar de destruir
o que já passa na sua mão.

Hoje eu desenho a arquitetura.
Não o método inteiro.
A planta.

Três peças.

Uma: o mapa.
Quanto custa a sua vida.
O que entra.
O que sai.
O que você está construindo.

Sem mapa,
você rema forte
e não sabe o porto.

Duas: o sistema.
Horário.
Ambiente.
Sequência.
O que fazer quando a emoção não vem.

Emoção carrega um dia.
Sistema carrega o mês.

Três: o lugar.
Onde você volta amanhã.
Não a dica da live.
O lugar.

Dica você esquece.
Lugar você volta.

O que isso não é.

Não é planilha milagrosa.
Não é mantra de riqueza.
Não é humilhar quem está apertado.
Não é te vender um número neste vídeo.

É ordem.

Corpo entra.
Treino.
Sono.
Horário.

Porque dinheiro
copia a vida.

Se a vida está no impulso,
o dinheiro fica no impulso.

Sua ação de hoje:
escreve em um papel
três linhas.

O que entra.
O que sai.
O que você diz que está construindo.

Se as três linhas não conversam,
você achou o começo.

Comenta MAPA
que eu te mando o próximo passo.
Sem teatro.""",
  leg="Arquitetura do alinhamento. Comenta MAPA."),

S(n="YT02", lote="YOUTUBE AULA", produto="Alinhamento Financeiro", q="Arquitetura",
  cta="MAPA", dur="6 min", cena="Mesa. Papel.",
  e="5/10", who="Investigador.",
  avoid="Promessa de renda. Plano.",
  h="ARQUITETURA DO COMPORTAMENTO COM DINHEIRO",
  g="O dinheiro não é o problema. Ele é o espelho.",
  vis="Papel na mesa. Não precisa mostrar o que escreveu.",
  voz="Calmo. Exemplos palpáveis.",
  tele="""O dinheiro não é o problema.

Ele é o espelho.

Se você gasta no impulso,
a vida está no impulso.

Se você não sabe o que está construindo,
o dinheiro também não sabe pra onde ir.

Arquitetura do comportamento.

Quatro portas.

Porta um: impulso.
Você decide na hora.
A loja. O iFood. O sim pra não desagradar.

Porta dois: medo.
Você segura tudo.
E chama isso de prudência.
Às vezes é só medo com nome bonito.

Porta três: imagem.
Você gasta pra parecer.
Não pra construir.

Porta quatro: ordem.
Você sabe o papel daquele valor
antes de ele sair.

Ninguém vive só na porta quatro.
O trabalho é ver
qual porta está mandando
na sua casa.

Pergunta:
na sua casa,
quem decide o dinheiro de verdade?

Você.
O impulso.
A outra pessoa.
O medo.

Responde isso
antes de qualquer planilha.

Comenta MAPA.""",
  leg="Dinheiro é espelho. Comenta MAPA."),

S(n="YT03", lote="YOUTUBE AULA", produto="Alinhamento Financeiro", q="Arquitetura",
  cta="MAPA", dur="6 min", cena="Pode ser academia ou casa.",
  e="6/10", who="Treinador estratégico.",
  avoid="Motivação. Grito.",
  h="ARQUITETURA DE UMA ROTINA QUE CARREGA O DIA",
  g="Se você precisa estar motivado todo dia, o sistema está errado.",
  vis="Mesma estética que o Reel. Aula alonga o princípio.",
  voz="Gancho igual ao Reel. Depois aprofunda.",
  tele="""Se você precisa estar motivado todo dia,
o sistema está errado.

Eu não acordo apaixonado
por academia todos os dias.

Eu tenho horário.
Ambiente.
Sequência.
E sei o que eu vim fazer.

Dinheiro é igual.
Conteúdo é igual.
Trabalho é igual.

Arquitetura da rotina.

Três peças.

Horário.
Não é quando der.
É quando acontece.

Ambiente.
O lugar já puxa o comportamento.
Academia. Mesa. Porta fechada.

Sequência.
O que vem primeiro.
O que vem depois.
Pra cabeça não decidir de novo
todo santo dia.

O dia fraco
é o dia que prova o sistema.

Se só funciona no dia forte,
você não tem sistema.
Tem sorte.

Ação:
escolhe UMA coisa.
Treino.
Ou o primeiro bloco de trabalho.
Ou olhar o que entrou e o que saiu.

Horário. Ambiente. Sequência.
Sete dias.
Sem negociar com a emoção.

Comenta MAPA.""",
  leg="Rotina que carrega o dia. Comenta MAPA."),

S(n="YT04", lote="YOUTUBE AULA", produto="Legado Digital", q="Arquitetura",
  cta="LEGADO", dur="7 min", cena="Caderno. Sem dashboard interno.",
  e="5/10", who="Construtor.",
  avoid="Tour de GitHub. Preço.",
  h="ARQUITETURA DE UM LEGADO DIGITAL",
  g="Se o Instagram desaparecer amanhã, o que continua existindo?",
  vis="Pergunta. Espera. Responde.",
  voz="Serena.",
  tele="""Se o Instagram desaparecer amanhã,
o que continua existindo?

Método.
Site.
Livro.
Cliente.
Comunidade.
Conhecimento organizado.

Ou você começa do zero.

Isso é a diferença
entre conteúdo
e legado.

Conteúdo gera atenção.
Legado deixa estrutura.

Arquitetura do legado.

Cinco andares.

Andar um: essência.
O que você realmente faz.
Não o que a bio promete.

Andar dois: método.
A ordem.
O que a pessoa faz primeiro.

Andar três: lugar.
Página. Plataforma. Livro.
Onde a pessoa entra
sem depender do feed.

Andar quatro: acompanhamento.
Alguém volta.
Alguém é corrigido.
Alguém executa.

Andar cinco: patrimônio.
O que permanece
se você dormir.

Essência sem estrutura some.
Estrutura sem essência não serve.

Eu junto as duas.

Ação:
escreve três coisas suas
que continuariam existindo
se o aplicativo fechasse.

Se a lista estiver vazia,
você achou o trabalho.

Comenta LEGADO.""",
  leg="Arquitetura de um legado. Comenta LEGADO."),

S(n="YT05", lote="YOUTUBE AULA", produto="Arquitetura e Ciência", q="Arquitetura",
  cta="LEGADO", dur="7 min", cena="Três papéis na mesa.",
  e="5/10", who="Arquiteto. Uma camada por vez.",
  avoid="Aula de constelação. Ritual akáshico completo. Preço.",
  h="ARQUITETURA DAS TRÊS CAMADAS",
  g="Página bonita sem as três camadas é vitrine vazia.",
  vis="Três papéis. Um por camada.",
  voz="Como pra criança. Profundo no exemplo.",
  tele="""Página bonita
sem as três camadas
é vitrine vazia.

Eu trabalho três camadas.

Camada um.
O que o mundo vê.

Marca.
Conteúdo.
Sistema.
Funil.
O império digital.
Não o post.
O que sobra quando o post some.

Camada dois.
O padrão que se repete.

Decisão.
Família.
O jeito que você escolhe
a mesma história
com nomes novos.

Sem olhar isso,
você constrói um império
em cima do mesmo buraco.

Camada três.
O registro.

O que você faz
quando ninguém está vendo.
Frequência.
Prática.
Caráter.

As três juntas
viram construção.

Uma sozinha
vira pose.

Não vou te ensinar
o método inteiro aqui.

Vou te dar o teste.

Olha o que você está construindo.
Qual camada está oca.

Se a um está forte
e a dois está oca,
o sucesso vai repetir o padrão.

Se a três está oca,
o sucesso não segura.

Comenta LEGADO.""",
  leg="Três camadas. Comenta LEGADO."),

S(n="YT06", lote="YOUTUBE AULA", produto="Tech Hub", q="Arquitetura",
  cta="CODIGO", dur="7 min", cena="Notebook fechado. Sem código na tela.",
  e="5/10", who="Professor de doze anos.",
  avoid="HTML CSS React Firebase. Lista. Palavra difícil primeiro.",
  h="ARQUITETURA DE UM SISTEMA",
  g="Tecnologia não é mágica. É porta, chave e quarto.",
  vis="Três toques na mesa.",
  voz="Devagar. Repete as três palavras.",
  tele="""Tecnologia não é mágica.

É porta.
Chave.
Quarto.

Porta.
O que a pessoa vê.
O site. O app. A tela.

Chave.
Quem entra.
Login. Permissão.
Quem pode e quem não pode.

Quarto.
Onde as coisas ficam.
Os dados. O histórico.
O que não pode se perder.

Se você só faz porta bonita,
qualquer um entra
e não tem o que guardar.

Se você só faz quarto,
ninguém acha.

Se você só faz chave,
é cadeado sem casa.

A IA entra depois.

IA sem ordem
faz bagunça mais rápido.

Eu ensino a construir
nessa ordem.

Primeiro entender.
Depois fazer.
Depois acelerar com IA.

Ação de hoje:
pega o que você tem.
Uma página. Um perfil. Um negócio.

Onde está a porta.
Onde está a chave.
Onde está o quarto.

Se uma falta,
você achou a aula.

Comenta CODIGO.""",
  leg="Porta, chave, quarto. Comenta CODIGO."),

S(n="YT07", lote="YOUTUBE AULA", produto="Magnetismo Pessoal", q="Arquitetura",
  cta="PRESENÇA", dur="6 min", cena="Rosto. Silêncio de verdade.",
  e="4/10", who="Magnético. Sem tentar.",
  avoid="Técnica de sedução. Curso no meio.",
  h="ARQUITETURA DA PRESENÇA",
  g="Antes de você falar, o corpo já falou.",
  vis="Pausa de um segundo visível duas vezes.",
  voz="Baixa. O silêncio ensina.",
  tele="""Antes de você falar,
o corpo já falou.

Postura.
Respiração.
Velocidade.
Olhar.

Arquitetura da presença.

Três andares.

Andar um: estado.
Você chega inteiro
ou pela metade.

Andar dois: escuta.
Quando o outro termina,
você espera um segundo.
Respira.
Depois responde.

Isso em sete dias
muda a comunicação.

Andar três: atenção.
Você não disputa a sala.
A sala vem
quando você não está desesperado.

Responder rápido
às vezes é desespero.

Presença também é
não responder agora.

Gente linda
você esquece em cinco minutos.

Gente presente
muda a sala.

Ação:
sete dias.
Um segundo de silêncio
antes de responder.

Não é truque.
É treino.

Comenta PRESENÇA.""",
  leg="Arquitetura da presença. Comenta PRESENÇA."),

S(n="YT08", lote="YOUTUBE AULA", produto="Tecnologia da Alma", q="Arquitetura",
  cta="PRESENÇA", dur="6 min", cena="Rosto.",
  e="4/10", who="Quem entende fascinação sem vender charme.",
  avoid="Manipulação. PNL de palco. Preço.",
  h="ARQUITETURA DA FASCINAÇÃO",
  g="Fascinação não é obrigar alguém a olhar. É ser interessante o bastante pra atenção acontecer.",
  vis="Pouquíssimo gesto.",
  voz="Lenta.",
  tele="""Fascinação não é obrigar alguém a olhar.

É ser interessante o bastante
pra atenção acontecer.

Isso vale pra conversa.
Pra venda.
Pra palco.
Pra relação.

Arquitetura.

Base: estado.
Se o corpo está desesperado,
a fala fica desesperada.

Meio: escuta.
Quem não escuta
não fascina.
Interrompe.
Compete.
Perde.

Topo: direção.
Você sabe o que veio fazer
naquela conversa.
Não fica pescando validação.

Tecnologia da alma
não é truque de filme.

É comunicação
com corpo, voz e atenção
no mesmo lugar.

Ação:
numa conversa hoje,
não dispute o segundo.
Escuta até o fim.
Um segundo.
Aí fala.

Comenta PRESENÇA.""",
  leg="Arquitetura da fascinação. Comenta PRESENÇA."),

S(n="YT09", lote="YOUTUBE AULA", produto="Paladim", q="Arquitetura",
  cta="CARATER", dur="6 min", cena="Caminhada ou rosto.",
  e="6/10", who="Sério. Sem moralismo.",
  avoid="Magia no gancho. Inimigo político. Preço.",
  h="ARQUITETURA DO CARÁTER",
  g="Curso de caráter quase não existe. Porque caráter não é pose.",
  vis="Para no gancho.",
  voz="Firme. Sem palanque.",
  tele="""Curso de caráter
quase não existe.

Porque caráter não é pose.

Não é ética de vitrine.
Não é moralismo.

É o que você faz
quando ninguém está vendo
e o dinheiro está em jogo.

Arquitetura.

Poder sem caráter
vira abuso.

Caráter sem poder
vira discurso.

Os dois juntos
viram liderança dos bons.

Prosperar sem isso
é construção oca.

Você pode ter sistema.
Pode ter marca.
Pode ter palco.

Se a terceira camada está oca,
tudo isso racha.

Ação:
uma decisão esta semana
em que ninguém vai saber
se você foi reto.

Faz reto mesmo assim.

Isso é o curso.
O resto é conversa.

Comenta CARATER.""",
  leg="Arquitetura do caráter. Comenta CARATER."),

S(n="YT10", lote="YOUTUBE AULA", produto="Códigos de Origem", q="Arquitetura",
  cta="LIVRO", dur="7 min", cena="Simples. História sua.",
  e="5/10", who="Você. Sem guru.",
  avoid="Promessa mágica. Diagnóstico de terceiro.",
  h="ARQUITETURA DE CORPO, MENTE E CAMPO",
  g="Minhas decisões pareciam diferentes. Repetiam o mesmo padrão.",
  vis="Humano. Sem slide de chakra.",
  voz="História. Depois o tripé.",
  tele="""Minhas decisões
pareciam diferentes.

Repetiam o mesmo padrão.

Lugar mudava.
Pessoa mudava.
Trabalho mudava.

O padrão não.

Eu organizei isso
em três.

Corpo.
O que você faz
com sono, treino, sexo, comida, ritmo.

Mente.
O que você conta
sobre você.
A decisão.
O mapa.

Campo.
O que se repete
quando você acha que é coincidência.
Relação. Dinheiro. Porta que volta.

Os três conversam.

Se o corpo está destruído,
a mente mente.
Se a mente está no impulso,
o campo copia o impulso.

O livro não diz quem você é.
Ele te ajuda a ver
o que vem construindo quem você é.

Ação:
escreve um padrão
que já se repetiu
em três fases da sua vida.

Não resolve hoje.
Enxerga.

Comenta LIVRO.""",
  leg="Corpo, mente, campo. Comenta LIVRO."),

S(n="YT11", lote="YOUTUBE AULA", produto="Leitura Call / Sessão", q="Arquitetura",
  cta="CALL", dur="5–6 min", cena="Como uma conversa.",
  e="4/10", who="Íntimo. Sem pitch.",
  avoid="Preço. Plano. Garantia.",
  h="ARQUITETURA DE UMA CONVERSA QUE VÊ O MAPA",
  g="Talvez você não precise aprender mais nada agora.",
  vis="Olho. Como mesa de café.",
  voz="Baixa.",
  tele="""Talvez você não precise
aprender mais nada agora.

Você já tem informação demais.

Falta alguém de fora
mostrar o que você não está vendo.

Arquitetura dessa conversa.

Não é aula.
Não é desabafo sem fim.
Não é venda no primeiro minuto.

É mapa.

O que está funcionando.
O que está atrasando.
Qual é o próximo movimento.

Eu escuto.
Devolvo o mapa melhor
do que você falou.
Aí a gente vê
se existe caminho junto.

Se não existir,
a conversa ainda valeu.
Porque você saiu com ordem.

Se existir,
aí sim
a gente fala de porta.

Não neste vídeo.

Ação:
escreve agora
o que está funcionando
e o que está atrasando.

Duas listas.
Cinco linhas cada.

Escreve CALL
se quiser essa conversa.""",
  leg="Conversa que vê o mapa. Escreve CALL."),

S(n="YT12", lote="YOUTUBE AULA", produto="Akasha Hub", q="Arquitetura",
  cta="HUB", dur="7–8 min", cena="Rosto. Sem catálogo na tela.",
  e="5/10", who="Dono do campo. Uma porta por vez.",
  avoid="Listar tudo. Preço. Flex milionário falso.",
  h="ARQUITETURA DA AKASHA HUB",
  g="Akasha não é um curso. É um campo com várias portas.",
  vis="Sem slide de organograma. Fala.",
  voz="Clara. Criança entende.",
  tele="""Akasha não é um curso.

É um campo com várias portas.

Você não precisa entrar em todas.
Precisa entrar na certa agora.

Eu desenho o campo.

Porta do dinheiro.
Alinhamento financeiro.
Mapa. Sistema. Lugar pra voltar.
Corpo junto. Rotina junto.

Porta do legado.
O que continua
se o aplicativo fechar.
Essência com estrutura.
Três camadas.

Porta da presença.
Magnetismo.
Fascinação.
O corpo fala antes da boca.

Porta do caráter.
Paladim.
Quem você é
quando pode
e ninguém está vendo.

Porta do sistema.
Tech Hub.
Porta. Chave. Quarto.
Construir com ordem.
IA depois.

Porta do livro.
Corpo. Mente. Campo.
Código que já está na sua história.

Referência
não é quem fala alto.

É quem tem lugar
pra pessoa voltar.

Método.
Plataforma.
Livro.
Acompanhamento.

Quem só tem opinião
é barulho.

Você escolhe UMA porta.
A de agora.

Não colecione.

Comenta HUB
e escreve a porta.
Dinheiro. Legado. Presença. Caráter. Sistema. Livro.""",
  leg="Várias portas. Uma agora. Comenta HUB."),
]


def wrap(c, text, font, size, maxw):
    words = text.split()
    if not words:
        return [""]
    lines, cur = [], words[0]
    for w in words[1:]:
        trial = cur + " " + w
        if c.stringWidth(trial, font, size) <= maxw:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    return lines


class Doc:
    def __init__(self, path):
        self.c = canvas.Canvas(path, pagesize=A4)
        self.c.setTitle("Akasha Hub · Roteiros do ecossistema")
        self.c.setAuthor("Yan Filipe")
        self.y = H - MT
        self.page = 0

    def new(self, footer=True):
        if self.page:
            if footer:
                self.foot()
            self.c.showPage()
        self.page += 1
        self.c.setFillColor(CREAM)
        self.c.rect(0, 0, W, H, fill=1, stroke=0)
        self.y = H - MT

    def foot(self):
        self.c.setFillColor(GOLD)
        self.c.rect(0, 0, W, 9 * mm, fill=1, stroke=0)
        self.c.setFillColor(white)
        self.c.setFont("DejaVu", 8)
        self.c.drawString(ML, 3.5 * mm, "Akasha Hub  ·  roteiros novos  ·  @akasha.hub")
        self.c.drawRightString(W - MR, 3.5 * mm, str(self.page))

    def need(self, h):
        if self.y - h < MB + 5 * mm:
            self.new()

    def text(self, s, font="DejaVu", size=11, color=INK, leading=None):
        leading = leading or size + 5
        for raw in s.split("\n"):
            lines = wrap(self.c, raw, font, size, W - ML - MR) if raw else [""]
            for ln in lines:
                self.need(leading)
                self.c.setFillColor(color)
                self.c.setFont(font, size)
                self.c.drawString(ML, self.y, ln)
                self.y -= leading

    def kicker(self, s):
        self.need(14)
        self.c.setFillColor(GOLD)
        self.c.setFont("DejaVuB", 8)
        self.c.drawString(ML, self.y, s.upper())
        self.y -= 14

    def h1(self, s):
        self.c.setFillColor(INK)
        self.c.setFont("DejaVuSB", 20)
        for ln in wrap(self.c, s, "DejaVuSB", 20, W - ML - MR):
            self.need(24)
            self.c.drawString(ML, self.y, ln)
            self.y -= 24
        self.y -= 2

    def cover(self):
        self.new(footer=False)
        self.c.setFillColor(INK)
        self.c.rect(0, 0, W, H, fill=1, stroke=0)
        self.c.setFillColor(GOLD)
        self.c.rect(0, H - 16 * mm, W, 16 * mm, fill=1, stroke=0)
        self.c.setFillColor(white)
        self.c.setFont("DejaVuB", 9)
        self.c.drawString(ML, H - 10 * mm, "AKASHA HUB  ·  NÃO É O PDF ANTIGO DA ACADEMIA")
        y = H - 48 * mm
        self.c.setFillColor(GOLD)
        self.c.setFont("DejaVuB", 11)
        self.c.drawString(ML, y, "ECOSSISTEMA COMPLETO")
        y -= 30
        self.c.setFillColor(white)
        self.c.setFont("DejaVuSB", 28)
        for ln in ["Vitrine nova.", "Videoaula.", "Arquitetura."]:
            self.c.drawString(ML, y, ln)
            y -= 34
        self.c.setFillColor(HexColor("#D4CAB8"))
        self.c.setFont("DejaVu", 12)
        for ln in wrap(self.c, "24 virais novos pra Instagram, TikTok e Facebook. 12 videoaulas de YouTube. Uma porta do Hub por vez. Direção dourada não vai pra câmera.", "DejaVu", 12, W - ML - MR):
            self.c.drawString(ML, y, ln)
            y -= 16
        self.c.setFillColor(GOLD)
        self.c.rect(0, 0, W, 12 * mm, fill=1, stroke=0)

    def intro(self):
        self.new()
        self.kicker("Leia isto uma vez")
        self.h1("O PDF antigo era academia. Este é o campo.")
        self.text("Você já tinha os Reels de Smart Fit e shopping. Aqui não repetimos.")
        self.text("V01 a V24: vitrine. 15 a 30 segundos. TikTok, Instagram, Facebook, Shorts.")
        self.text("YT01 a YT12: videoaula. Arquitetura de cada universo. YouTube. 6 a 8 minutos. Ensinam a planta. Não entregam o método pago.")
        self.text("Uma ideia por viral. Uma arquitetura por aula. Sem preço. Sem plano. Sem Mesa. Sem listar as sete ferramentas.")
        self.y -= 8
        self.kicker("Mapa das portas")
        for t in [
            "Dinheiro: Alinhamento Financeiro + sessão (sem valor no vídeo)",
            "Legado: Arquitetura e Ciência, Império, três camadas",
            "Sistema: Tech Hub. Porta, chave, quarto",
            "Presença: Magnetismo, fascinação, Tecnologia da Alma",
            "Caráter: Paladim",
            "Livro: Códigos de Origem, biblioteca",
            "Campo: Akasha Hub",
            "Senda e Flow: fora da vitrine agora",
        ]:
            self.text("·  " + t)
        self.y -= 8
        self.kicker("Hoje")
        self.text("Vitrine: V01, V07, V10, V12. Um só no ar.")
        self.text("YouTube: grava YT01 ou YT12. Um só.")
        self.text("CTA ativos: MAPA, PRESENÇA. Ativar depois: LEGADO, LIVRO, CALL, CODIGO, CARATER, HUB, BASE, ALINHADO.")

    def box_dir(self, body):
        lines = []
        for raw in body.split("\n"):
            lines += wrap(self.c, raw, "DejaVu", 9, W - ML - MR - 14) if raw else [""]
        h = 16 + len(lines) * 12 + 8
        self.need(h)
        self.c.setFillColor(HexColor("#F3EBD8"))
        self.c.roundRect(ML, self.y - h + 6, W - ML - MR, h, 5, fill=1, stroke=0)
        y = self.y - 8
        self.c.setFillColor(DIR)
        self.c.setFont("DejaVuB", 8)
        self.c.drawString(ML + 7, y, "DIREÇÃO  ·  NÃO LER")
        y -= 13
        self.c.setFont("DejaVu", 9)
        for ln in lines:
            self.c.drawString(ML + 7, y, ln)
            y -= 12
        self.y -= h + 6

    def tele(self, body, size=15):
        self.need(22)
        self.c.setFillColor(GOLD)
        self.c.setFont("DejaVuB", 8)
        self.c.drawString(ML, self.y, "TELEPROMPT  ·  só isto no Edits")
        self.y -= 6
        self.c.setStrokeColor(GOLD)
        self.c.line(ML, self.y, ML + 62 * mm, self.y)
        self.y -= 20
        for p in body.strip().split("\n"):
            t = p.strip()
            if not t:
                self.y -= 12
                continue
            for ln in wrap(self.c, t, "DejaVuB", size, W - ML - MR):
                self.need(size + 8)
                self.c.setFillColor(INK)
                self.c.setFont("DejaVuB", size)
                self.c.drawString(ML, self.y, ln)
                self.y -= size + 6
            self.y -= 10

    def script(self, s, yt=False):
        self.new()
        self.kicker(f"{s['n']}   ·   {s['lote']}   ·   CTA {s['cta']}   ·   {s['dur']}")
        self.h1(s["h"])
        meta = f"{s['produto']}  ·  {s['q']}"
        self.text(meta, size=10, color=MUTED)
        self.box_dir(
            f"Encarnar: {s['who']}\nVoz: {s['voz']}\nCena: {s['cena']}\nVisual: {s['vis']}\nEvitar: {s['avoid']}\nGancho: {s['g']}"
        )
        self.tele(s["tele"], size=14 if yt else 16)
        self.need(20)
        self.c.setFillColor(MUTED)
        self.c.setFont("DejaVu", 9)
        for ln in wrap(self.c, "LEGENDA: " + s["leg"], "DejaVu", 9, W - ML - MR):
            self.need(12)
            self.c.drawString(ML, self.y, ln)
            self.y -= 12
        self.c.setFillColor(VIOLET)
        self.c.setFont("DejaVuB", 9)
        self.need(14)
        self.c.drawString(ML, self.y, "Tela final: preto · mandala · Comenta " + s["cta"])

    def save(self):
        self.foot()
        self.c.save()


def main():
    out = "/workspace/artifacts/akasha-roteiros-ecossistema.pdf"
    out2 = "/tmp/akasha/AKASHAHUB/afplataforma/interno/akasha-roteiros-ecossistema.pdf"
    d = Doc(out)
    d.cover()
    d.intro()
    for s in VITRINE:
        d.script(s, yt=False)
    for s in YOUTUBE:
        d.script(s, yt=True)
    d.save()
    import shutil
    shutil.copy(out, out2)
    print("ok pages", d.page, "vitrine", len(VITRINE), "yt", len(YOUTUBE))


if __name__ == "__main__":
    main()
