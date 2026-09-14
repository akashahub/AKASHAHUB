#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Akasha Hub — PDF de teleprompt para divulgação. Execução hoje."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont("DejaVu", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DejaVuB", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DejaVuS", "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"))
pdfmetrics.registerFont(TTFont("DejaVuSB", "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"))

INK = HexColor("#14110E")
MUTED = HexColor("#5C564C")
GOLD = HexColor("#9A7420")
VIOLET = HexColor("#4A2170")
CREAM = HexColor("#F6F3EC")
PAPER = HexColor("#FFFDF8")
LINE = HexColor("#E4DCCB")
DIR = HexColor("#6B4A12")

W, H = A4
ML, MR = 18 * mm, 18 * mm
MT, MB = 16 * mm, 18 * mm


SCRIPTS = [
# ——— HOJE ———
dict(
    n="001", lote="HOJE", produto="Alinhamento Financeiro", quadrante="Sistemas > motivação",
    cta="MAPA", dur="30–35s", cena="Academia · Smart Fit", energia="7/10",
    personagem="Treinador estratégico. Não coach.",
    evitar="Gritar. Motivação. Sorriso de anúncio.",
    headline="ORGANIZAÇÃO > MOTIVAÇÃO",
    gancho="Se você precisa estar motivado todo dia, o seu sistema está errado.",
    visual="Caminhando para a máquina ou iniciando a esteira. Olhar na câmera.",
    dir_voz="Objetiva. Como quem corrige uma ideia errada. Médio-rápido.",
    tele="""Se você precisa estar motivado todo dia,

o seu sistema está errado.

Eu não preciso acordar apaixonado
por academia todos os dias.

Eu preciso ter horário,

ambiente,

uma sequência

e saber o que eu vim fazer aqui.

Pra dinheiro é igual.

Pra trabalho é igual.

Pra conteúdo é igual.

Quanto menos sua vida depende
da emoção do momento,

mais fácil fica executar.

Organização vence motivação
na maior parte dos dias.

Comenta MAPA
que eu te mando o sistema.""",
    legenda="Organização vence motivação na maior parte dos dias. Comenta MAPA que eu te mando o sistema.",
    plat="IG · TikTok · Reels Facebook. YouTube Shorts: mesma peça.",
),
dict(
    n="002", lote="HOJE", produto="Magnetismo Pessoal", quadrante="Presença > reação",
    cta="PRESENÇA", dur="20–25s", cena="Academia · fim de série", energia="6/10",
    personagem="Mentor dando um experimento.",
    evitar="Explicar demais. Cara de sedução.",
    headline="PRESENÇA > REAÇÃO",
    gancho="Durante sete dias, faz uma coisa: para de responder imediatamente.",
    visual="Terminar série. Respirar. Olhar câmera.",
    dir_voz="Curiosa e firme. Como: faz e depois você me diz.",
    tele="""Durante sete dias,

faz uma coisa:

para de responder imediatamente.

Quando alguém terminar de falar,

espera um segundo.

Respira.

Pensa.

Depois responde.

Parece pequeno.

Mas você começa a sair da reação

e entrar em presença.

Experimenta durante sete dias

e observa como muda
a sua comunicação.

Comenta PRESENÇA.""",
    legenda="Experimenta sete dias. Comenta PRESENÇA.",
    plat="IG · TikTok. Não alongar no YouTube.",
),
dict(
    n="003", lote="HOJE", produto="Alinhamento Financeiro", quadrante="Execução",
    cta="MAPA", dur="25–30s", cena="Academia · colocando peso", energia="6/10",
    personagem="Mentor que viu um erro óbvio.",
    evitar="Voz motivacional de academia.",
    headline="DISCIPLINA NÃO RESOLVE TUDO",
    gancho="Tem gente extremamente disciplinada construindo a vida errada.",
    visual="Ajustar o peso. Depois olhar.",
    dir_voz="Firme e tranquila. Seco. Sem sorrir no gancho.",
    tele="""Tem gente extremamente disciplinada…

construindo a vida errada.

Acorda cedo.

Treina.

Trabalha.

Corre o dia inteiro.

Mas nunca parou pra decidir
o que realmente está construindo.

Disciplina sem direção

só faz você chegar mais rápido
no lugar errado.

É por isso que antes de falar de dinheiro,

eu gosto de olhar a vida inteira.

Rotina.

Trabalho.

Projetos.

Objetivos.

Porque dinheiro é só uma parte do mapa.

Comenta MAPA.""",
    legenda="Disciplina sem direção chega mais rápido no lugar errado. Comenta MAPA.",
    plat="IG · TikTok · Facebook.",
),
dict(
    n="004", lote="HOJE", produto="Magnetismo Pessoal", quadrante="Presença > reação",
    cta="PRESENÇA", dur="20–25s", cena="Academia · espelho ou respiração", energia="4/10",
    personagem="Magnético sem tentar ser magnético.",
    evitar="Cara de sedução. Pressa.",
    headline="SEU CORPO FALA PRIMEIRO",
    gancho="Antes de você falar qualquer coisa, o seu corpo já falou por você.",
    visual="Respirar fundo. Postura reta. Olhar direto.",
    dir_voz="Baixa e segura. Como se não tivesse pressa nenhuma.",
    tele="""Antes de você falar qualquer coisa…

o seu corpo já falou por você.

Sua postura.

Sua respiração.

A velocidade dos seus movimentos.

O jeito que você olha.

Magnetismo não começa
em uma frase bonita.

Começa no estado
que você leva pra interação.

Quando o corpo está desesperado,

a comunicação também fica desesperada.

Presença começa antes da fala.

Comenta PRESENÇA.""",
    legenda="Presença começa antes da fala. Comenta PRESENÇA.",
    plat="IG · TikTok.",
),
dict(
    n="005", lote="HOJE", produto="Alinhamento Financeiro", quadrante="Dinheiro como comportamento",
    cta="MAPA", dur="25–30s", cena="Shopping · andando", energia="5/10",
    personagem="Investigador. Conversa normal.",
    evitar="Julgar quem compra. Palavra caixa.",
    headline="O PROBLEMA COMEÇOU ANTES",
    gancho="O seu problema financeiro provavelmente não começa quando você compra alguma coisa.",
    visual="Andando entre lojas. Café ou sacola. Vira pra câmera.",
    dir_voz="Como quem acabou de perceber andando.",
    tele="""O seu problema financeiro
provavelmente não começa
quando você compra alguma coisa.

Começa antes.

Quando você não sabe
quanto custa a sua vida.

Não sabe o que está construindo.

Não tem uma prioridade.

E cada decisão acontece
no impulso do momento.

Comprar não é o problema.

O problema é gastar
sem saber o papel daquele dinheiro
na sua própria vida.

Por isso eu não começo
um alinhamento financeiro
olhando só pra conta.

Comenta MAPA.""",
    legenda="O problema começou antes da compra. Comenta MAPA.",
    plat="IG · TikTok · Facebook.",
),
dict(
    n="006", lote="HOJE", produto="Legado Digital", quadrante="Execução",
    cta="LEGADO", dur="20–30s", cena="Shopping · área bonita", energia="5/10",
    personagem="Visionário. Pergunta de verdade.",
    evitar="Dramatizar. Vender no primeiro segundo.",
    headline="SEU INSTAGRAM NÃO É SEU LEGADO",
    gancho="Se o seu Instagram desaparecesse amanhã, o que continuaria existindo?",
    visual="Sentado ou caminhando. Olhar direto.",
    dir_voz="Serena. Lento no gancho. Médio depois.",
    tele="""Se o seu Instagram
desaparecesse amanhã…

o que continuaria existindo?

Seu método?

Seu site?

Seu livro?

Seus clientes?

Sua comunidade?

Seu conhecimento organizado?

Ou você teria que começar
tudo de novo?

Uma coisa gera atenção.

A outra deixa estrutura.

Conteúdo passa.

Legado permanece.

Comenta LEGADO.""",
    legenda="Se o Instagram sumir, o que continua? Comenta LEGADO.",
    plat="IG · YouTube Shorts · Facebook.",
),
dict(
    n="007", lote="HOJE", produto="Magnetismo Pessoal", quadrante="Presença > reação",
    cta="PRESENÇA", dur="20–25s", cena="Shopping · corredor", energia="4/10",
    personagem="Provocador magnético. Não precisa convencer.",
    evitar="Sedução artificial.",
    headline="MAGNETISMO NÃO É BELEZA",
    gancho="Tem gente linda que você esquece em cinco minutos.",
    visual="Parado. Pouco movimento. Quase frio.",
    dir_voz="Baixa, firme. Lento no gancho.",
    tele="""Tem gente linda
que você esquece em cinco minutos.

E tem gente que entra num lugar

e alguma coisa muda.

Não é só beleza.

É presença.

É voz.

É postura.

É atenção.

É saber ouvir.

É não precisar disputar
cada segundo da conversa.

Fascinação não é obrigar alguém
a olhar pra você.

É se tornar interessante o bastante
pra atenção acontecer.

Comenta PRESENÇA.""",
    legenda="Magnetismo não é beleza. Comenta PRESENÇA.",
    plat="IG · TikTok.",
),
dict(
    n="008", lote="HOJE", produto="Legado Digital", quadrante="Execução",
    cta="LEGADO", dur="25–30s", cena="Academia · guardar o peso", energia="5/10",
    personagem="Construtor. Já vive isso.",
    evitar="Vender no início.",
    headline="LEGADO TAMBÉM É REPETIÇÃO",
    gancho="Você não constrói um corpo em um treino. E também não constrói um legado em um post.",
    visual="Guardar o peso. Termina na câmera.",
    dir_voz="Calma e convicta. Médio-lento.",
    tele="""Você não constrói um corpo
em um treino.

E também não constrói
um legado em um post.

Um vídeo.

Um livro.

Uma página.

Um método.

Uma aula.

Um sistema.

Tudo isso parece pequeno sozinho.

Mas quando você organiza,

conecta

e continua construindo…

vira patrimônio.

Conteúdo passa.

Legado permanece.

Comenta LEGADO.""",
    legenda="Legado também é repetição. Comenta LEGADO.",
    plat="IG · Facebook · YouTube Shorts.",
),
# ——— AF ———
dict(
    n="009", lote="AF", produto="Alinhamento Financeiro", quadrante="Dinheiro como comportamento",
    cta="MAPA", dur="25–35s", cena="Casa · café da manhã ou mesa", energia="6/10",
    personagem="Estrategista. Erro óbvio.",
    evitar="Prometer resultado de dinheiro. Falar plano ou preço.",
    headline="NÃO É FALTA DE DINHEIRO",
    gancho="Você não tem problema de dinheiro. Tem problema de estrutura.",
    visual="Olhar câmera. Sem sorriso de anúncio.",
    dir_voz="Tranquila e firme. Pausa depois da primeira frase.",
    tele="""Você não tem problema de dinheiro.

Tem problema de estrutura.

Ganha.

Gasta.

Não sabe quanto custa a sua vida.

Não sabe o que está construindo.

E no fim do mês
a conta conta a história
que a rotina já estava contando.

Alinhamento financeiro
não é dica.

É olhar o mapa inteiro
antes de empurrar o número.

Comenta MAPA.""",
    legenda="Não é falta de dinheiro. É falta de estrutura. Comenta MAPA.",
    plat="IG · TikTok · Facebook · Shorts.",
),
dict(
    n="010", lote="AF", produto="Alinhamento Financeiro", quadrante="Sistemas > motivação",
    cta="MAPA", dur="25–30s", cena="Carro parado ou rua", energia="7/10",
    personagem="Provocador inteligível. Sem ódio.",
    evitar="Humilhar pobre. Falar preço. Falar plano.",
    headline="TRABALHAR MUITO NÃO BASTA",
    gancho="Tem gente que trabalha o mês inteiro e no dia 28 some o que entrou.",
    visual="Olhar direto. Pouco gesto.",
    dir_voz="Soco no gancho. Depois explica calmo.",
    tele="""Tem gente que trabalha o mês inteiro

e no dia 28
some o que entrou.

Não foi o mercado.

Não foi o universo.

Foi a falta de ordem
no que já passou pela mão.

Eu não começo perguntando
quanto você quer ganhar.

Eu começo perguntando
o que acontece
com o que já entra.

Comenta MAPA.""",
    legenda="Trabalhar muito não basta se o que entra some. Comenta MAPA.",
    plat="IG · TikTok.",
),
dict(
    n="011", lote="AF", produto="Alinhamento Financeiro", quadrante="Dinheiro como comportamento",
    cta="ALINHADO", dur="30–35s", cena="Estúdio ou parede simples", energia="7/10",
    personagem="Estoico. Sem palanque.",
    evitar="Plano. Preço. Motivar. Palavra caixa.",
    headline="LUCRO É OXIGÊNIO",
    gancho="Falar que dinheiro não importa é fácil quando a conta ainda aguenta.",
    visual="Parado. Olho na lente.",
    dir_voz="Pausa depois do gancho. Segunda frase mais baixa.",
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
    legenda="Lucro é oxigênio. Escreve ALINHADO.",
    plat="IG · YouTube Shorts. Serve de corte de live.",
),
dict(
    n="012", lote="AF", produto="Alinhamento Financeiro", quadrante="Sistemas > motivação",
    cta="MAPA", dur="20–25s", cena="Academia ou casa", energia="6/10",
    personagem="Homem comum. Café. Pensou numa coisa.",
    evitar="Professor. Três princípios fundamentais.",
    headline="MESMA LÓGICA",
    gancho="Treino e dinheiro usam a mesma lógica. Horário, ambiente, sequência.",
    visual="Pode estar no aparelho. Corta pra câmera.",
    dir_voz="Conversa. Médio.",
    tele="""Treino e dinheiro
usam a mesma lógica.

Horário.

Ambiente.

Sequência.

Se você só treina quando sente vontade,

o corpo não muda.

Se você só olha o dinheiro
quando aperta,

a vida não muda.

O sistema carrega
o dia em que a emoção não carrega.

Comenta MAPA.""",
    legenda="Treino e dinheiro: mesma lógica. Comenta MAPA.",
    plat="IG · TikTok · Facebook.",
),
dict(
    n="013", lote="AF", produto="Alinhamento Financeiro", quadrante="Execução",
    cta="MAPA", dur="25–30s", cena="Notebook aberto, sem mostrar tela interna", energia="5/10",
    personagem="Construtor. Mostra que existe sistema. Não mostra a casa.",
    evitar="Mostrar Mesa, preço, plano, login de mentor.",
    headline="NÃO É DICA. É LUGAR.",
    gancho="Dica você esquece. Lugar você volta.",
    visual="Mão no notebook fechado ou de lado. Rosto nítido.",
    dir_voz="Calmo. Sem demonstração de app.",
    tele="""Dica você esquece.

Lugar você volta.

Eu não ensino alinhamento financeiro
em frase solta.

Eu coloquei isso
num lugar
onde a pessoa entra,

vê o que fazer agora,

e volta no dia seguinte.

Sem depender
da emoção da live.

Comenta MAPA.""",
    legenda="Dica você esquece. Lugar você volta. Comenta MAPA.",
    plat="IG · Facebook. Não abrir a plataforma no vídeo.",
),
dict(
    n="014", lote="AF", produto="Sessão de Alinhamento", quadrante="Execução",
    cta="CALL", dur="20–25s", cena="Caminhando. Sem fundo de guru.", energia="5/10",
    personagem="Conversa íntima. Uma pessoa só.",
    evitar="Preço. Plano. Promessa de ganho.",
    headline="ANTES DO MÉTODO, O MAPA",
    gancho="Talvez você não precise de mais um curso. Precisa de alguém que veja o mapa.",
    visual="Andando. Para. Olha.",
    dir_voz="Baixa. Próxima.",
    tele="""Talvez você não precise
de mais um curso.

Precisa de alguém que veja o mapa.

O que está funcionando.

O que está te atrasando.

E qual é o próximo movimento.

Isso eu faço
numa conversa.

Sem teatro.

Sem preço no vídeo.

Se fizer sentido,
escreve CALL.""",
    legenda="Antes do método, o mapa. Escreve CALL.",
    plat="IG. Uma por semana no máximo.",
),
# ——— MAG ———
dict(
    n="015", lote="MAG", produto="Desafio 7 Dias", quadrante="Presença > reação",
    cta="PRESENÇA", dur="15–20s", cena="Qualquer. Rosto nítido.", energia="6/10",
    personagem="Mentor. Experimento.",
    evitar="Vender o desafio inteiro. Preço.",
    headline="UM SEGUNDO",
    gancho="Um segundo de silêncio muda a conversa inteira.",
    visual="Olhar. Pausa real de um segundo no vídeo.",
    dir_voz="Deixa o silêncio existir. Não preencha.",
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
    legenda="Um segundo. Sete dias. Comenta PRESENÇA.",
    plat="IG · TikTok. Deixar o silêncio no corte.",
),
dict(
    n="016", lote="MAG", produto="Tecnologia da Alma / Magnetismo", quadrante="Presença > reação",
    cta="PRESENÇA", dur="20–25s", cena="WhatsApp no silêncio (não mostrar conversa)", energia="4/10",
    personagem="Magnético. Menos palavras.",
    evitar="Ler mensagem dos outros. Expor chat.",
    headline="PRESENÇA TAMBÉM É NÃO RESPONDER AGORA",
    gancho="Responder rápido não é presença. Às vezes é desespero.",
    visual="Celular na mão. Não abre a conversa.",
    dir_voz="Baixa. Quase frio.",
    tele="""Responder rápido
não é presença.

Às vezes é desespero.

Presença também é
não responder agora.

É terminar o que você está fazendo.

É chegar inteiro na conversa.

Não pela metade.

Comenta PRESENÇA.""",
    legenda="Responder rápido às vezes é desespero. Comenta PRESENÇA.",
    plat="IG · TikTok.",
),
# ——— LEGADO / TECH / LIVRO / PALADIM ———
dict(
    n="017", lote="LEGADO", produto="Arquitetura e Ciência / Legado", quadrante="Execução",
    cta="LEGADO", dur="25–35s", cena="Mesa com caderno. Sem tela de sistema interno.", energia="5/10",
    personagem="Construtor.",
    evitar="Jargão. Império. Quinta dimensão.",
    headline="ESSÊNCIA SEM ESTRUTURA SOME",
    gancho="Essência sem estrutura some. Estrutura sem essência não serve.",
    visual="Caderno. Fecha. Olha.",
    dir_voz="Calma. Uma ideia.",
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
    legenda="Essência sem estrutura some. Comenta LEGADO.",
    plat="IG · YouTube Shorts · Facebook.",
),
dict(
    n="018", lote="TECH", produto="Tech Hub", quadrante="Execução",
    cta="CODIGO", dur="20–25s", cena="Notebook de lado. Não abrir código ilegível.", energia="5/10",
    personagem="Quem constrói e explica pra criança.",
    evitar="Lista de linguagens. Palavra difícil primeiro.",
    headline="TECNOLOGIA NÃO É MÁGICA",
    gancho="Tecnologia não é mágica. É porta, chave e quarto.",
    visual="Uma mão no notebook fechado.",
    dir_voz="Simples. Como pra alguém de doze anos.",
    tele="""Tecnologia não é mágica.

É porta,

chave

e quarto.

Quem tem a chave entra.

Quem não tem, não entra.

O quarto é onde as coisas ficam.

Eu ensino isso
do jeito que uma criança entende

e um adulto usa.

Comenta CODIGO.""",
    legenda="Porta, chave e quarto. Comenta CODIGO.",
    plat="IG · YouTube. CTA pra ativar no Manychat depois.",
),
dict(
    n="019", lote="LIVRO", produto="Biblioteca / Códigos de Origem", quadrante="Mandala / prática",
    cta="LIVRO", dur="25–35s", cena="Shopping ou mão no livro físico se tiver", energia="5/10",
    personagem="Contador de história. A sua.",
    evitar="Esotérico demais. Promessa mágica.",
    headline="VOCÊ JÁ TEM CÓDIGOS",
    gancho="Várias decisões da minha vida pareciam diferentes. Repetiam o mesmo padrão.",
    visual="Caminhando. Vira pra câmera.",
    dir_voz="Curiosa. Humana.",
    tele="""Várias decisões da minha vida
pareciam diferentes.

Mas repetiam o mesmo padrão.

Os lugares mudavam.

As pessoas mudavam.

O trabalho mudava.

Corpo.

Mente.

Campo.

Isso virou livro.

Não pra dizer quem você é.

Pra você enxergar
o que vem construindo quem você é.

Comenta LIVRO.""",
    legenda="Você já tem códigos. Comenta LIVRO.",
    plat="IG · Facebook.",
),
dict(
    n="020", lote="PALADIM", produto="Paladim", quadrante="Mandala / prática",
    cta="CARATER", dur="25–30s", cena="Caminhada. Sem símbolo forçado.", energia="6/10",
    personagem="Sério. Sem moralismo.",
    evitar="Religião de palco. Magia no gancho. Preço.",
    headline="CARÁTER NÃO É MORALISMO",
    gancho="Curso de caráter quase não existe. Porque caráter não é pose.",
    visual="Andando. Para no gancho.",
    dir_voz="Firme. Sem palanque.",
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
    legenda="Caráter não é moralismo. Comenta CARATER.",
    plat="IG. Pouca frequência. Autoridade, não volume.",
),
# ——— YOUTUBE 60s ———
dict(
    n="Y01", lote="YOUTUBE", produto="Alinhamento Financeiro", quadrante="Sistemas > motivação",
    cta="MAPA", dur="55–70s", cena="Câmera parada. Rosto. Depois pode cortar academia.", energia="6/10",
    personagem="Estrategista. Uma história, um princípio.",
    evitar="Preço. Plano. Módulos. Tour da plataforma.",
    headline="ORGANIZAÇÃO > MOTIVAÇÃO",
    gancho="Se você precisa estar motivado todo dia, o seu sistema está errado.",
    visual="Rosto nítido. Óculos se estiver usando. Sem IA no rosto.",
    dir_voz="Gancho seco. Meio conversa. Fecha com uma linha.",
    tele="""Se você precisa estar motivado todo dia,

o seu sistema está errado.

Eu treino assim.

Horário.

Ambiente.

Sequência.

O que eu vim fazer aqui.

Dinheiro é igual.

Se a sua vida só anda
quando a emoção anda,

no dia fraco
tudo para.

Eu construí um lugar
pra pessoa não depender
da emoção do vídeo.

Ela entra.

Vê o que fazer agora.

Volta amanhã.

Não é dica.

É ordem.

Se isso te tocou,
comenta MAPA.""",
    legenda="Organização vence motivação. Comenta MAPA.",
    plat="YouTube Shorts e corte vertical. Não virar aula.",
),
dict(
    n="Y02", lote="YOUTUBE", produto="Magnetismo Pessoal", quadrante="Presença > reação",
    cta="PRESENÇA", dur="50–65s", cena="Rosto. Silêncio real no meio.", energia="4/10",
    personagem="Magnético. Deixa espaço.",
    evitar="Teatro. Sedução. Curso no meio.",
    headline="PRESENÇA > REAÇÃO",
    gancho="Antes de você falar, o corpo já falou.",
    visual="Pausa de um segundo visível.",
    dir_voz="Baixa. O silêncio é o truque.",
    tele="""Antes de você falar,

o corpo já falou.

Postura.

Respiração.

Olhar.

Gente linda
você esquece em cinco minutos.

Gente presente
muda a sala.

Durante sete dias,

quando a outra pessoa terminar,

espera um segundo.

Respira.

Depois responde.

Você sai da reação.

Entra em presença.

Comenta PRESENÇA.""",
    legenda="Presença começa antes da fala. Comenta PRESENÇA.",
    plat="YouTube Shorts · IG.",
),
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
        self.c.setTitle("Akasha Hub · Teleprompt de divulgação")
        self.c.setAuthor("Yan Filipe · Akasha Hub")
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
        self.c.rect(0, 0, W, 10 * mm, fill=1, stroke=0)
        self.c.setFillColor(white)
        self.c.setFont("DejaVu", 8)
        self.c.drawString(ML, 4 * mm, "Akasha Hub  ·  uso interno  ·  @akasha.hub")
        self.c.drawRightString(W - MR, 4 * mm, str(self.page))

    def need(self, h):
        if self.y - h < MB + 6 * mm:
            self.new()

    def gap(self, h=8):
        self.y -= h

    def rule(self):
        self.need(8)
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(0.6)
        self.c.line(ML, self.y, W - MR, self.y)
        self.y -= 10

    def text(self, s, font="DejaVu", size=11, color=INK, leading=None, extra=0):
        leading = leading or size + 5
        maxw = W - ML - MR
        for raw in s.split("\n"):
            lines = wrap(self.c, raw, font, size, maxw) if raw else [""]
            for ln in lines:
                self.need(leading + extra)
                self.c.setFillColor(color)
                self.c.setFont(font, size)
                self.c.drawString(ML, self.y, ln)
                self.y -= leading + extra

    def kicker(self, s):
        self.need(16)
        self.c.setFillColor(GOLD)
        self.c.setFont("DejaVuB", 9)
        self.c.drawString(ML, self.y, s.upper())
        self.y -= 16

    def h1(self, s):
        self.need(28)
        self.c.setFillColor(INK)
        self.c.setFont("DejaVuSB", 22)
        for ln in wrap(self.c, s, "DejaVuSB", 22, W - ML - MR):
            self.need(26)
            self.c.drawString(ML, self.y, ln)
            self.y -= 26
        self.y -= 4

    def h2(self, s):
        self.need(22)
        self.c.setFillColor(VIOLET)
        self.c.setFont("DejaVuSB", 14)
        self.c.drawString(ML, self.y, s)
        self.y -= 20

    def meta(self, rows):
        self.need(12 * len(rows) + 8)
        x0, x1 = ML, ML + 38 * mm
        for k, v in rows:
            self.c.setFillColor(GOLD)
            self.c.setFont("DejaVuB", 8)
            self.c.drawString(x0, self.y, k.upper())
            self.c.setFillColor(INK)
            self.c.setFont("DejaVu", 10)
            for i, ln in enumerate(wrap(self.c, v, "DejaVu", 10, W - MR - x1)):
                self.c.drawString(x1, self.y, ln)
                self.y -= 12
                if i:
                    pass
            self.y -= 2

    def box_dir(self, title, body):
        lines = []
        for raw in body.split("\n"):
            lines += wrap(self.c, raw, "DejaVu", 10, W - ML - MR - 16) if raw else [""]
        h = 18 + len(lines) * 13 + 10
        self.need(h)
        self.c.setFillColor(HexColor("#F3EBD8"))
        self.c.roundRect(ML, self.y - h + 8, W - ML - MR, h, 6, fill=1, stroke=0)
        y = self.y - 6
        self.c.setFillColor(DIR)
        self.c.setFont("DejaVuB", 8)
        self.c.drawString(ML + 8, y, title.upper())
        y -= 14
        self.c.setFont("DejaVu", 10)
        self.c.setFillColor(DIR)
        for ln in lines:
            self.c.drawString(ML + 8, y, ln)
            y -= 13
        self.y -= h + 6

    def tele(self, body):
        parts = [p for p in body.strip().split("\n")]
        self.need(30)
        self.c.setFillColor(GOLD)
        self.c.setFont("DejaVuB", 8)
        self.c.drawString(ML, self.y, "TELEPROMPT  ·  só isto vai no Edits")
        self.y -= 8
        self.c.setStrokeColor(GOLD)
        self.c.setLineWidth(1.2)
        self.c.line(ML, self.y, ML + 70 * mm, self.y)
        self.y -= 22
        for p in parts:
            t = p.strip()
            if not t:
                self.y -= 14
                continue
            size = 16
            leading = 22
            wrapped = wrap(self.c, t, "DejaVuB", size, W - ML - MR)
            for ln in wrapped:
                self.need(leading + 10)
                self.c.setFillColor(INK)
                self.c.setFont("DejaVuB", size)
                self.c.drawString(ML, self.y, ln)
                self.y -= leading
            self.y -= 14  # pausa visual entre frases

    def script(self, s):
        self.new()
        self.kicker(f"Roteiro {s['n']}   ·   {s['lote']}   ·   CTA {s['cta']}")
        self.h1(s["headline"])
        self.meta([
            ("Produto", s["produto"]),
            ("Quadrante", s["quadrante"]),
            ("Duração", s["dur"]),
            ("Cena", s["cena"]),
            ("Plataforma", s["plat"]),
            ("Energia", s["energia"]),
        ])
        self.gap(4)
        self.box_dir(
            "Direção  ·  não ler na câmera",
            f"Encarnar: {s['personagem']}\nVoz: {s['dir_voz']}\nVisual 0–3s: {s['visual']}\nEvitar: {s['evitar']}\nGancho falado: {s['gancho']}",
        )
        self.tele(s["tele"])
        self.gap(6)
        self.c.setFillColor(MUTED)
        self.c.setFont("DejaVu", 9)
        for ln in wrap(self.c, "LEGENDA DO POST: " + s["legenda"], "DejaVu", 9, W - ML - MR):
            self.need(12)
            self.c.drawString(ML, self.y, ln)
            self.y -= 12
        self.need(16)
        self.c.setFillColor(VIOLET)
        self.c.setFont("DejaVuB", 9)
        self.c.drawString(ML, self.y, "Tela final 3s: fundo preto · mandala · Comenta " + s["cta"])
        self.y -= 14

    def cover(self):
        self.new(footer=False)
        self.c.setFillColor(INK)
        self.c.rect(0, 0, W, H, fill=1, stroke=0)
        self.c.setFillColor(GOLD)
        self.c.rect(0, H - 18 * mm, W, 18 * mm, fill=1, stroke=0)
        self.c.setFillColor(white)
        self.c.setFont("DejaVuB", 9)
        self.c.drawString(ML, H - 11 * mm, "AKASHA HUB  ·  USO INTERNO  ·  14 SET 2026")
        self.y = H - 50 * mm
        self.c.setFillColor(GOLD)
        self.c.setFont("DejaVuB", 11)
        self.c.drawString(ML, self.y, "TELEPROMPT DE DIVULGAÇÃO")
        self.y -= 28
        self.c.setFillColor(white)
        self.c.setFont("DejaVuSB", 32)
        for ln in ["Fala. Pausa.", "Uma ideia.", "Autoridade."]:
            self.c.drawString(ML, self.y, ln)
            self.y -= 36
        self.y -= 8
        self.c.setFillColor(HexColor("#D4CAB8"))
        self.c.setFont("DejaVu", 12)
        for ln in wrap(self.c, "Instagram, TikTok, Facebook e YouTube. Yan lê só o bloco preto grande. Direção fica na faixa dourada. Não vai pra câmera.", "DejaVu", 12, W - ML - MR):
            self.c.drawString(ML, self.y, ln)
            self.y -= 16
        self.y -= 20
        self.c.setFillColor(GOLD)
        self.c.setFont("DejaVuB", 10)
        self.c.drawString(ML, self.y, "@akasha.hub   ·   Yan Filipe")
        self.y = 28 * mm
        self.c.setFillColor(HexColor("#D4CAB8"))
        self.c.setFont("DejaVu", 9)
        self.c.drawString(ML, self.y, "Não anunciar preço. Não anunciar plano. Um CTA por vídeo.")
        self.c.setFillColor(GOLD)
        self.c.rect(0, 0, W, 12 * mm, fill=1, stroke=0)

    def intro(self):
        self.new()
        self.kicker("Como usar")
        self.h1("Você lê o preto. A dourada não entra no Edits.")
        self.text("Cada roteiro tem duas camadas. A faixa dourada é direção: quem você é na cena, o que evitar, o gancho. O bloco preto grande é o teleprompt. Copia só ele. Linha curta. Três espaços entre frases. Silêncio onde o papel está vazio.")
        self.gap(6)
        self.h2("Os 4 blocos")
        self.text("1. Soco (0–3s). Conclusão. Nunca “hoje eu vou falar”.\n2. Contexto (4–15s). Sua vida. Academia, dinheiro, rotina.\n3. Princípio (16–26s). Leva pra outras áreas.\n4. Fecha + uma palavra (27–34s). MAPA, PRESENÇA, LEGADO, LIVRO, CALL, CODIGO, CARATER, ALINHADO.")
        self.gap(6)
        self.h2("Voz")
        self.text("Calmo, não morto. Seguro, não arrogante. Profundo, simples. Provocador, inteligível. Uma ideia por vídeo. Clareza de criança. Adulto sente o peso. Sem guru. Sem professor. Sem personagem rico. Sem preço. Sem plano. Sem Mesa. Sem tour da plataforma.")
        self.gap(6)
        self.h2("Edição")
        self.text("9:16. Headline serif no topo. Legenda no peito, nunca na boca, nunca no rodapé. Capa: frame real, segundo 0.4. Mandala 3s no fim. Comenta PALAVRA. 1 Reels por dia. Alternar quadrante. Mudo: o topo já explica.")
        self.gap(6)
        self.h2("Hoje")
        self.text("Grave 001, 003, 005 e 006. Se der, 002 e 007. Poste um. Guarde os outros. Intervalo 18–24h. Horários: 07:30, 12:00, 18:30–19:30, 21:00.")
        self.gap(8)
        self.h2("Índice")
        toc = [
            "001–008  lote HOJE (academia e shopping)",
            "009–014  Alinhamento Financeiro e sessão (sem preço)",
            "015–016  Magnetismo e desafio",
            "017  Legado",
            "018  Tech Hub (porta, chave, quarto)",
            "019  Biblioteca / Códigos de Origem",
            "020  Paladim (caráter, sem palanque)",
            "Y01–Y02  YouTube até 70s",
        ]
        for t in toc:
            self.text("·  " + t, size=11, color=INK)

    def save(self):
        self.foot()
        self.c.save()


def main():
    out1 = "/workspace/artifacts/akasha-teleprompt-divulgacao.pdf"
    out2 = "/tmp/akasha/AKASHAHUB/afplataforma/interno/akasha-teleprompt-divulgacao.pdf"
    d = Doc(out1)
    d.cover()
    d.intro()
    for s in SCRIPTS:
        d.script(s)
    d.save()
    import shutil
    shutil.copy(out1, out2)
    print("pages", d.page, "scripts", len(SCRIPTS), "->", out1)


if __name__ == "__main__":
    main()
