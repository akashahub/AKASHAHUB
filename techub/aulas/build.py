#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, shutil
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont("DejaVu", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DejaVuB", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DejaVuSB", "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"))

def A(id,m,t,dur,mix,edit,tele):
    return dict(id=id,m=m,t=t,dur=dur,mix=mix,edit=edit,tele=tele.strip()+"\n")

AULAS=[
# M1
A("M1.1","M1 Código","O que é informação","8 min","CAM + CARD",
"CARD no gancho: INFORMAÇÃO É FORMA. Aos 2 min CARD: DADO NÃO É INFORMAÇÃO. Sem tela de código.",
"""Informação não é dado.

Dado é pedra bruta.

Informação é pedra cortada.
Tem forma.
Dá pra usar.

A palavra informação
vem de dar forma.

Se não forma nada na sua vida,
não era informação.
Era ruído.

Hoje você vai sair
sabendo separar os dois.

Olha o celular.
Mil avisos.
Quase nenhum forma decisão.

Isso é dado.
Não é informação.

No site é igual.
Texto bonito
que não muda o que a pessoa faz
é ruído com serifa.

Teste de criança:

Se eu contar isso
pra alguém de doze anos,
ela sabe o que fazer depois?

Se não sabe,
ainda é dado.

Sua ação:
pega uma frase do seu Instagram.
Pergunta: isso forma o quê?
Uma decisão.
Uma porta.
Ou só um like.

Próxima aula:
como a realidade é programada.
Não com magia.
Com atenção e repetição."""),

A("M1.2","M1 Código","Como a realidade é programada","8 min","CAM + DIAG",
"DIAG: seta ATENÇÃO → REPETIÇÃO → PADRÃO. Não falar algoritmo de rede ainda. Isso é a aula 6.",
"""A realidade não é só o que acontece.

É o que você repete
com atenção.

Atenção é o cursor.

Onde o cursor fica,
o sistema destaca.

Se o cursor fica no medo,
a vida programa medo.

Se o cursor fica na ordem,
a vida programa ordem.

Isso não substitui trabalho.
Isso decide
o que o trabalho constrói.

Programar
é escolher o que entra
e o que se repete.

Código de computador
é isso com letra.

Código da sua semana
é isso com hora.

Desenho:

Atenção.
Repetição.
Padrão.

O padrão vira o chão
que você chama de vida.

Ação:
escreve onde seu cursor
ficou ontem
a maior parte do tempo.

Celular.
Preocupação.
Obra.

Aí você viu o programa
que está rodando.

Próxima:
o que é código.
Do corpo até a página."""),

A("M1.3","M1 Código","O que é código","8 min","CAM + DIAG",
"DIAG três faixas: CORPO / PÁGINA / HÁBITO. CARD: CÓDIGO É RECEITA.",
"""Código é receita.

Não é mistério.

Bolo:
ovo, farinha, forno, tempo.

Página:
título, bloco, botão, cor.

Corpo:
sono, treino, comida, hora.

Se a receita muda,
o bolo muda.

As pessoas temem código
porque alguém ensinou
como se fosse templo.

Não é templo.
É receita escrita
pra máquina repetir
sem cansar.

DNA é receita do corpo.
HTML é receita da página.
Rotina é receita do dia.

Três códigos.
Mesma lógica.

Você não precisa
decorar linguagem hoje.

Precisa ver receita.

Ação:
escreve a receita
do seu café da manhã.
Passo um.
Passo dois.
Passo três.

Isso já é pensar em código.

Próxima:
a internet.
Como os papéis se conversam."""),

A("M1.4","M1 Código","A arquitetura da internet","9 min","CAM + DIAG + TELA curta",
"DIAG: VOCÊ → SITE → SERVIDOR → GAVETA. TELA 20s: barra do navegador, só a URL. PIP não precisa.",
"""A internet não é nuvem mágica.

É papel
em casas distantes.

Você pede.
O site responde.
O servidor é a casa.
A gaveta é o banco.

Você.
Site.
Casa.
Gaveta.

Se a casa cai,
o site some.
Por isso backup.
Por isso domínio seu.

Quando você abre uma página,
seu aparelho pergunta:
cadê esse endereço?

Um guia aponta a casa.
A casa manda o papel.
Seu aparelho desenha o papel.

Isso é a arquitetura.

Sem jargão:

Endereço.
Casa.
Papel.
Desenho.

Ação:
abre qualquer site.
Olha a barrinha em cima.
Aquilo é o endereço da casa.

Próxima:
o mapa de quem organiza informação."""),

A("M1.5","M1 Código","Engenharia da informação","8 min","CAM + CARD",
"CARD: ORDEM ANTES DE FERRAMENTA. Não abrir AF.",
"""Engenharia da informação
é a arte de não perder
o que importa.

Não é ter app.

É saber:

O que entra.
Onde fica.
Quem vê.
O que sai.

Sem isso,
você tem pasta bagunçada
com nome bonito.

Ferramenta nova
em vida velha
continua vida velha.

Ordem primeiro.
Ferramenta depois.

Porta.
Chave.
Quarto.

A porta é o que se vê.
A chave é quem entra.
O quarto é onde guarda.

Ação:
pega um projeto seu.
Diz em voz alta
as três peças.

Se faltar uma,
você achou o furo.

Próxima:
como as redes
seguram sua atenção."""),

A("M1.6","M1 Código","Como Instagram, TikTok e YouTube funcionam","9 min","CAM + TELA 40s",
"TELA: abrir o próprio feed 10s, voltar pra CAM. CARD: ATENÇÃO É O PRODUTO. Não ensinar hack.",
"""Essas redes
não vendem vídeo.

Vendem atenção.

O produto é o seu olhar
parado mais um segundo.

Elas medem:
você parou.
Você voltou.
Você falou.
Você mandou pra alguém.

O que segura o olhar
sobe.
O que não segura
some.

Por isso o gancho
nos três primeiros segundos.

Não é frescura.
É a porta da casa.

Você pode odiar isso.
Ainda assim
é o campo onde as pessoas estão.

Quem constrói
aprende o campo
sem virar escravo dele.

Ação:
abre o feed.
Conta quantos vídeos
você passou
antes de parar.

Aquilo é o padrão
que a máquina reforça.

Próxima:
sua mente como sistema."""),

A("M1.7","M1 Código","Sua mente como sistema operacional","8 min","CAM",
"Sem slide. Um CARD: SISTEMA CARREGA O DIA FRACO.",
"""Sistema operacional
é o que roda
antes dos programas.

Na mente
é o conjunto de regras
que decide
antes de você perceber.

Se a regra é
eu só faço se estiver a fim,
o dia fraco ganha.

Se a regra é
horário, ambiente, sequência,
o dia fraco ainda anda.

Você não precisa
acordar inspirado.

Precisa de sistema
que carrega o dia
em que a emoção não carrega.

Isso vale pra código.
Vale pra dinheiro.
Vale pra treino.

Ação:
escreve uma regra
que já roda em você
sem pedir licença.

Troca uma.
Só uma.
Por sete dias.

Próxima:
palavra como ferramenta."""),

A("M1.8","M1 Código","Palavra cria realidade","8 min","CAM + CARD",
"CARD: PALAVRA É FERRAMENTA. Evitar PNL de palco.",
"""Palavra não é enfeite.

É ferramenta.

Dizer eu não sei de tecnologia
fecha a porta.

Dizer eu ainda não montei a porta
deixa a obra aberta.

A criança entende:

O nome que você dá
muda o que você faz.

Chamar bagunça de processo criativo
não organiza a gaveta.

Chamar medo de prudência
não vira prudência.

Fale preciso.

No site é igual.
Botão que diz clique aqui
é preguiça.
Botão que diz a porta
é direção.

Ação:
troca uma frase
que você usa contra você.
Escreve a nova.
Usa sete dias.

Próxima:
o que civilizações já sabiam
de código, sem chamar de código."""),

A("M1.9","M1 Código","Tecnologia ancestral","8 min","CAM + BROLL suave",
"BROLL 20%: pedra, templo, céu, sem misticismo barato. CARD: RECEITA ANTIGA.",
"""Ancestral não é museu.

É receita que durou
porque funcionava.

Calendário.
Medida.
Escrita.
Mito como mapa.
Rito como repetição.

Eles não tinham JavaScript.
Tinham ordem.

Ordem é tecnologia.

O erro de hoje
é achar que o novo
apaga o que dura.

O erro inverso
é achar que o antigo
substitui o que constrói agora.

A gente junta.

Receita antiga.
Ferramenta nova.

Atenção.
Repetição.
Padrão.
Registro.

Ação:
escolhe um rito pequeno.
Mesma hora.
Mesma mesa.
Sete dias.
Isso é tecnologia.

Módulo dois:
as linguagens da página."""),

# M2
A("M2.1","M2 Linguagens","HTML: a estrutura","10 min","CAM abre + TELA + PIP",
"0:00-0:40 CAM. TELA: bloco de notas ou CodePen, só HTML cru: h1, p, button. PIP canto inferior direito, 25%. CARD: HTML É OSSO.",
"""HTML é o osso.

Sem osso,
a roupa não tem onde cair.

Título.
Parágrafo.
Botão.
Imagem.

Isso é a página nua.

Você não precisa
decorar cem tags hoje.

Precisa ver osso.

Eu vou escrever
três linhas.
Só três.

Um título.
Um texto.
Um botão.

Se a pessoa entende
o que fazer,
o osso está certo.

Se não entende,
bonito depois não salva.

Ação:
escreve no papel
o osso da sua página.
Três linhas.

Próxima:
a roupa.
CSS."""),

A("M2.2","M2 Linguagens","CSS: a aparência","10 min","CAM + TELA + PIP",
"TELA: o mesmo HTML, mudar cor e espaço. CARD: CSS É ROUPA. Não Figma ainda.",
"""CSS é a roupa.

O osso continua o mesmo.
A roupa muda
como a pessoa se sente
quando chega.

Cor.
Espaço.
Tamanho.
Celular ou computador.

Espaço demais
a pessoa se perde.
Espaço de menos
a pessoa sufoca.

Cor não é gosto só.
Cor é hierarquia.
O que brilha primeiro
é o que você escolheu.

Erro comum:
enfeitar o osso torto.

Primeiro o osso claro.
Depois a roupa.

Ação:
escolhe duas cores.
Uma de fundo.
Uma de botão.
Só duas.

Próxima:
o cérebro da página."""),

A("M2.3","M2 Linguagens","JavaScript: o cérebro","10 min","CAM + TELA + PIP",
"TELA: um botão que esconde e mostra um texto. CARD: JS É O QUE ACONTECE.",
"""JavaScript é o que acontece
quando a pessoa mexe.

Clicou.
Apareceu.
Somou.
Mandou.

Sem isso,
a página é cartaz.

Com isso,
a página responde.

Hoje você não vira engenheiro.

Você vê um botão
fazer uma coisa.

Uma coisa.

Criança entende:
eu aperto.
O quarto acende.

Isso é o cérebro.

Ação:
escreve um acontece
que a sua página precisa.
Só um.
Exemplo: quando clicar, abrir o WhatsApp.

Próxima:
o que se vê
e o que não se vê."""),

A("M2.4","M2 Linguagens","O que se vê e o que não se vê","8 min","CAM + DIAG",
"DIAG: FRENTE / FUNDO. Porta e quarto.",
"""O que se vê
é a frente.

O que não se vê
é o fundo.

A frente é a porta.
O fundo é o quarto
e a chave.

Login.
Gaveta.
Quem pode ver o quê.

Se só existe frente,
qualquer um entra
e não tem o que guardar.

Se só existe fundo,
ninguém acha a casa.

Os dois.

Não misture os nomes agora.
Guarde os dois lugares.

Ação:
no seu negócio,
o que a pessoa vê.
O que precisa existir
sem ela ver.

Próxima:
seu primeiro site. Do zero."""),

A("M2.5","M2 Linguagens","Seu primeiro site do zero","12 min","TELA 80% + CAM abre e fecha",
"TELA: criar index.html simples, abrir no navegador. PIP pequeno. Não React. CARD: NO AR NA SUA MÁQUINA.",
"""Hoje a gente faz
um site de verdade
na sua máquina.

Não na escola.
Não no Wix.

Um arquivo.
Um título.
Um texto.
Um botão.

Você abre no navegador.
Está no ar.
Pra você.

Isso já é site.

Depois a gente põe
em casa pública.
Agora é a cozinha.

Errou a letra.
A página quebra.
Ótimo.
Erro é o professor.

Ação:
salva o arquivo.
Abre de novo amanhã.
Se abrir, você construiu.

Próxima:
como não perder o trabalho."""),

A("M2.6","M2 Linguagens","Git e GitHub","10 min","CAM + TELA",
"TELA: commit simples, sem despejar git flow. CARD: CÓPIA COM DATA.",
"""Git é cópia com data.

Você não reza
pra não perder.

Você registra.

GitHub é a casa
onde essa cópia mora
e outras pessoas
podem ver, se você deixar.

Salvar no computador
não é a mesma coisa.
Computador quebra.

Cópia com data
em outra casa
é adulto.

Hoje:
uma cópia.
Uma frase do que mudou.

Não precisa da religião
de dezenas de comandos.

Ação:
uma frase:
o que eu mudei hoje.

Próxima:
login e gaveta."""),

A("M2.7","M2 Linguagens","Login e gaveta","12 min","CAM + TELA + PIP",
"TELA: tela de login da AF ou Firebase console SEM dados de aluno. CARD: CHAVE E QUARTO. Não citar plano.",
"""Login é a chave.

Gaveta é o quarto.

Sem chave,
a casa é praça.

Sem quarto,
a chave não guarda nada.

A pessoa entra
com o próprio nome.
O sistema pergunta:
essa chave abre?

Se abre,
mostra o quarto dela.
Não o de outra pessoa.

Isso é respeito.
Isso é segurança.
Isso é produto.

Eu construí isso
em plataforma real.
A lógica é essa.
Não vou abrir o cofre.
Vou mostrar a porta.

Ação:
escreve o que,
no seu projeto,
só o dono pode ver.

Próxima:
IA como ajudante. Não como dono."""),

A("M2.8","M2 Linguagens","IA como ajudante de código","10 min","CAM + TELA",
"TELA: um prompt pedindo HTML de três linhas. Mostrar lixo vs pedido claro. CARD: PEDIDO CLARO.",
"""IA escreve código.

IA também escreve lixo
com confiança.

Se o pedido é vago,
o lixo vem vestido de ouro.

Pedido claro:
três linhas.
Título, texto, botão.
Fundo claro.
Letra escura.

Pedido vago:
faz um site incrível.

Incrível não é receita.

Você manda.
A IA ajuda.
Você testa.
Você decide.

Ação:
escreve um pedido
de cinco linhas
pra uma página sua.
Sem adjetivo vazio.

Próxima:
colocar no ar de verdade."""),

A("M2.9","M2 Linguagens","Colocar no ar","10 min","CAM + TELA",
"TELA: domínio ou GitHub Pages, o que você usar. CARD: CASA PÚBLICA. Não vender hospedagem.",
"""No ar
é quando outra pessoa
abre o endereço
sem sentar na sua cadeira.

Sua máquina é cozinha.
O endereço é a casa na rua.

Domínio é o nome da casa.
Hospedagem é o chão da casa.

Sem nome,
ninguém acha.
Sem chão,
o nome aponta pro vazio.

Hoje você vê o caminho.
Não precisa de dez empresas.

Um caminho.
Um endereço.
Um arquivo que já existe.

Ação:
escreve o nome da casa
que você quer.
Uma palavra.
Sua.

Módulo três:
o fundo da casa.
O sistema."""),

# M3
A("M3.1","M3 Sistemas","O que é o fundo","8 min","CAM + DIAG",
"DIAG: FRENTE / FUNDO. CARD: O FUNDO TRABALHA SEM PALCO.",
"""O fundo
é o que trabalha
sem palco.

Guarda.
Confere chave.
Conta.
Avisa.

Você não vê o fundo
quando está bom.
Você vê
quando quebra.

Por isso gente
só valoriza a porta.
A porta é foto.

O fundo é a vida
do produto.

Se você quer
algo que a pessoa volte,
você precisa de fundo.

Ação:
uma frase:
o que precisa acontecer
quando eu não estou olhando.

Próxima:
a gaveta."""),

A("M3.2","M3 Sistemas","A gaveta","9 min","CAM + TELA 30s",
"TELA: lista simples (nome, data) num papel ou planilha, depois dizer: no sistema isso vira gaveta. Não abrir Firestore de aluno.",
"""Gaveta
é onde as coisas ficam.

Nome.
Data.
O que a pessoa fez.

Se não tem gaveta,
você depende da memória.
Memória mente.
Memória some.

Papel é gaveta lenta.
Sistema é gaveta rápida.

A pergunta não é
qual banco famoso.
É:

O que eu guardo.
Por quanto tempo.
Quem pode ler.

Ação:
três campos
que o seu projeto precisa guardar.
Só três.

Próxima:
a chave por dentro."""),

A("M3.3","M3 Sistemas","A chave por dentro","9 min","CAM + DIAG",
"DIAG: PEDIDO → CHAVE CERTA? → SIM/NÃO. CARD: NÃO MISTURAR QUARTOS.",
"""Por dentro,
a chave é uma pergunta.

Essa pessoa
é quem diz ser?
Esse quarto
é o dela?

Se misturar quarto,
você quebrou confiança.
Às vezes a lei.
Sempre o produto.

Mentor vê uma coisa.
Aluno vê outra.
Visitante vê outra.

Isso não é frescura.
É respeito.

Ação:
escreve três papéis.
Visitante.
Cliente.
Você.

O que cada um vê.

Próxima:
quando duas casas conversam."""),

A("M3.4","M3 Sistemas","Quando duas casas conversam","8 min","CAM + DIAG",
"DIAG: APP A → RECADO → APP B. CARD: RECADO COM FORMA.",
"""API
é recado com forma.

A casa A manda.
A casa B entende.
Porque o recado
tem forma combinada.

Sem forma,
é grito no corredor.

WhatsApp.
Pagamento.
Mapa.
Tudo isso
são casas conversando.

Você não precisa
construir todas as casas.
Precisa saber
quando está mandando recado
e quando está gritando.

Ação:
um recado
que seu projeto
precisa mandar
pra outra casa.

Próxima:
o primeiro app que faz uma coisa."""),

A("M3.5","M3 Sistemas","O primeiro app que faz uma coisa","12 min","TELA + CAM",
"TELA: uma lista que salva um nome. Uma coisa. CARD: UMA COISA.",
"""App não é dezena de botão.

É uma coisa
que a pessoa faz
e não perde.

Hoje:
escrever um nome.
Achar o nome depois.

Se isso funciona,
você tem app.

O resto é vontade
de parecer grande.

Grande demais
no primeiro dia
não nasce.
Aborta.

Uma coisa.
Feita.
Guardada.

Ação:
qual é a uma coisa
do seu primeiro app.

Próxima:
o chão público.
Hospedagem."""),

A("M3.6","M3 Sistemas","Hospedagem e domínio","8 min","CAM + TELA curta",
"TELA: akashahub.com.br na barra, 5s. CARD: NOME DA CASA.",
"""Domínio é o nome.
Hospedagem é o chão.

Nome seu
não é vaidade.
É soberania.

Se o nome é de outro,
você mora de aluguel
na própria cara.

O chão pode mudar.
O nome deve ser seu.

Ação:
escreve o nome
que você quer
nas próximas décadas.
Não o da moda.

Próxima:
o que é um produto que cobra
sem eu estar na sala."""),

A("M3.7","M3 Sistemas","Produto que vive sem você na sala","9 min","CAM",
"Não citar preço de mentoria. CARD: A PESSOA ENTRA SOZINHA.",
"""SaaS
é um nome difícil
pra uma coisa simples.

A pessoa entra.
Usa.
Volta.
Paga se for o acordo.
Você não precisa
estar na sala
cada minuto.

Não é a única forma
de viver.

Mas é a forma
de o sistema trabalhar
enquanto você dorme.

Mentoria não é só isso.
Mentoria é acompanhamento.

Produto digital
pode ser as duas coisas:
lugar
e gente.

Não misture
na primeira frase
pro cliente.

Ação:
seu produto
precisa de você na sala
sempre?
Ou tem um pedaço
que vive sozinho.

Próxima:
celular sem reinventar o osso."""),

A("M3.8","M3 Sistemas","Celular sem reinventar o osso","8 min","CAM + TELA 20s site no celular",
"TELA: a própria página no telefone. CARD: MESMA CASA, TELA MENOR.",
"""App de loja
não é a primeira porta.

Primeiro
a casa precisa funcionar
no telefone
como página.

A pessoa abre o endereço.
Consegue.
O botão cabe no dedo.
O texto se lê.

Depois,
se precisar de loja,
a gente fala.

Muita gente
gasta o ano
no app
e não tem porta no telefone.

Ação:
abre sua página no celular.
O botão cabe?
Se não cabe,
essa é a aula.

Próxima:
jogo. Lógica. Uma regra."""),

A("M3.9","M3 Sistemas","Jogo: uma regra","8 min","CAM + TELA opcional",
"Se TELA: um contador +1. CARD: REGRA CLARA.",
"""Jogo é regra
que a pessoa sente no corpo.

Aperta.
Ganha ponto.
Perde.
Tenta de novo.

Isso ensina sistema
melhor que discurso.

Uma regra.
Não um universo.

Se a regra é clara,
a criança joga.
O adulto entende código.

Ação:
inventa um jogo de um minuto.
Uma regra.
Escreve.

Módulo quatro:
IA. Ferramenta. Não dono."""),

# M4
A("M4.1","M4 IA","O mapa das IAs","8 min","CAM + CARD",
"CARD três: TEXTO / IMAGEM / CÓDIGO. Sem ranking de marca como religião.",
"""IA não é uma coisa só.

Tem a que escreve.
Tem a que desenha.
Tem a que lê arquivo.
Tem a que ajuda código.
Tem a que gera voz.

Mapa primeiro.
Ferramenta depois.

Se você usa uma
pra tudo,
você usa mal.

Criança:
lápis não é tesoura.

Ação:
escreve três tarefas suas.
Do lado,
texto, imagem ou código.

Próxima:
como pedir."""),

A("M4.2","M4 IA","Como pedir","10 min","CAM + TELA",
"TELA: prompt vago vs prompt com forma. CARD: FORMA NO PEDIDO.",
"""Pedir
é o ofício agora.

Quem pede vago
recebe vago.

Quem pede com forma
recebe forma.

Forma:

O que é.
Pra quem.
O que não é.
Tamanho.
Tom.
Exemplo.

Sem isso,
a máquina inventa
o que você não pediu
e ainda parece certa.

Ação:
reescreve um pedido seu
com as seis linhas.

Próxima:
site com IA. Sem entregar o volante."""),

A("M4.3","M4 IA","Site com IA, você no volante","10 min","TELA + CAM",
"TELA: gerar uma página simples e CORRIGIR uma coisa na mão. CARD: VOCÊ TESTA.",
"""Dá pra gerar um site
em minutos.

Também dá pra gerar
um site que mente,
que quebra no celular,
que não é seu.

O ofício:
gerar.
Ler.
Corrigir.
Testar no telefone.

Se você não testa,
você não construiu.
Você colou.

Ação:
gera.
Abre no telefone.
Anota um erro.
Corrige um.

Próxima:
imagem, vídeo, áudio."""),

A("M4.4","M4 IA","Imagem, vídeo, áudio","9 min","CAM + TELA de uma imagem sua já aprovada",
"Não gerar rosto novo ao vivo se for arriscado. CARD: REFERÊNCIA PRIMEIRO.",
"""Imagem boa
começa com referência.

Sem referência,
a máquina mistura
cem pessoas
e chama de você.

No Akasha
a gente trava rosto,
corpo,
luz.

Vídeo e áudio
a mesma lei:
identidade primeiro.
Geração depois.

Ação:
escolhe uma foto
que é lei.
Toda geração futura
compara com ela.

Próxima:
automação. Sem virar máquina oca."""),

A("M4.5","M4 IA","Automatizar sem ficar oco","8 min","CAM",
"CARD: AUTOMATIZA O REPETIDO. NÃO O CRITÉRIO.",
"""Automatiza o repetido.

Não automatiza o critério.

Responder sempre a mesma coisa:
pode.

Decidir se a pessoa entra:
cuidado.

Cobrar o que você não olhou:
não.

A máquina acelera.
Você continua dono
do sim e do não.

Ação:
uma tarefa repetida
que pode sair da sua mão.
Uma decisão
que não pode.

Próxima:
IA dentro do produto."""),

A("M4.6","M4 IA","IA dentro do produto","9 min","CAM + DIAG",
"DIAG: PESSOA → SEU SISTEMA → IA → RESPOSTA. Não abrir DNA/prompts internos.",
"""IA dentro do produto
não é colar ChatGPT na bio.

É:

A pessoa pergunta
no seu lugar.
Seu sistema manda
o recado com forma.
A IA responde
dentro da sua regra.
Você registra.

Sem regra,
a IA fala o que não deve.
Preço.
Dado de outro.
Tom que não é o seu.

Ação:
uma pergunta
que seu produto
poderia responder sozinho.
Escreve a regra
do que ela nunca pode dizer.

Próxima:
campo e máquina. Sem misturar templo."""),

A("M4.7","M4 IA","Campo e máquina","8 min","CAM",
"Tom sóbrio. CARD: OS DOIS EXISTEM. NÃO SÃO O MESMO.",
"""Tem gente
que chama IA de espírito.

Tem gente
que chama espírito de lixo.

Os dois erram.

Máquina
repete padrão
em velocidade.

Campo
é outra conversa.
Atenção.
Presença.
O que não cabe em arquivo.

Usar máquina
não te tira do campo.
Entregar o critério
talvez tire.

Ação:
hoje usa a máquina
pra uma tarefa.
E faz um silêncio
sem tela.
Os dois.

Próxima:
um agente. Uma tarefa."""),

A("M4.8","M4 IA","Um agente, uma tarefa","10 min","CAM + TELA",
"TELA: lista de um agente que só resume um texto. CARD: UMA TAREFA.",
"""Agente
não é geniozinho.

É um empregado
com uma ficha.

Nome.
Tarefa.
O que não faz.
Onde pega o papel.
Onde devolve.

Um agente
que faz vinte coisas
faz vinte pela metade.

Um que resume
e devolve em cinco linhas
é útil.

Ação:
escreve a ficha
de um empregado só.

Próxima:
o futuro. Sem filme."""),

A("M4.9","M4 IA","O futuro sem filme","8 min","CAM",
"Não prometer AGI. CARD: SOBERANIA É TER CÓPIA E CRITÉRIO.",
"""Ninguém aqui
precisa do filme
pra trabalhar amanhã.

Amanhã
quem tem critério
manda.
Quem só cola
depende.

Soberania
é ter cópia.
Ter nome da casa.
Ter regra.
Ter o sim e o não.

A máquina vai ficar
mais rápida.
A pergunta continua:

Quem decide.

Ação:
uma cópia
do que é seu
fora da moda da semana.

Módulo cinco:
atenção. A porta da casa pública."""),

# M5
A("M5.1","M5 Atenção","Bernays: consentimento","8 min","CAM",
"Não virar aula de conspiração. CARD: CONSENTIMENTO É CONSTRUÍDO.",
"""Bernays mostrou
que consentimento
é construído.

Não sempre com verdade.
Às vezes com imagem.
Com medo.
Com desejo.
Com o que a turma faz.

Saber disso
não é pra enganar.

É pra não ser
o último a perceber.

Você constrói consentimento
quando a pessoa
entende e escolhe.

Ou você empurra
e chama de escolha.

A diferença é caráter.

Ação:
um anúncio que te pegou.
O que ele mexeu.
Medo, desejo ou turma.

Próxima:
os gatilhos. Sem receitinha suja."""),

A("M5.2","M5 Atenção","Gatilhos com caráter","9 min","CAM + CARD",
"CARD: PROVA. RECIPROCIDADE. AUTORIDADE. ESCASSEZ VERDADEIRA. Não ensinar falsa escassez.",
"""Gatilho
é mola.

Prova.
Reciprocidade.
Autoridade.
Escassez verdadeira.

A mola suja
é mentir a mola.

Falsa vaga.
Falso relógio.
Falsa intimidade.

Isso vende uma vez
e queima o campo.

No Akasha
escassez
é limite real.
Doze por ano
só se for doze.
Se não for,
não fala.

Ação:
um gatilho seu
que é verdade.
Um que você precisa aposentar.

Próxima:
atenção. O recurso."""),

A("M5.3","M5 Atenção","Economia da atenção","8 min","CAM",
"CARD: ATENÇÃO É COMIDA DO SISTEMA.",
"""Atenção
é comida do sistema.

Se você dá toda
pro feed,
não sobra
pra obra.

Se você pede toda
sem entregar forma,
a pessoa foge.

Três segundos.
A porta.
Se a porta é fraca,
o resto não existe.

Por isso o gancho
não é frescura.
É respeito
pelo tempo do outro.

Ação:
um conteúdo seu.
Os três primeiros segundos
explicam sozinhos?
No mudo.

Próxima:
o caminho mental
até o sim."""),

A("M5.4","M5 Atenção","O caminho até o sim","9 min","CAM + DIAG",
"DIAG 4 pedras: PARA · ENTENDE · CONFIA · CAMINHA. Não 7 nomes internos. Não preço.",
"""A pessoa não compra
no primeiro grito.

Ela para.
Entende.
Confia.
Caminha.

Se você pula
pra caminha,
vira pedinte.

Se você nunca
abre a porta,
vira palestra.

O caminho
é uma pedra de cada vez.

Sim.
Faz sentido.
Quero entender.
Esse cara construiu.
Quero a porta.

Ação:
em qual pedra
seu conteúdo está parado.

Próxima:
palavra que vende sem gritar."""),

A("M5.5","M5 Atenção","Palavra que vende","8 min","CAM + TELA de um texto curto",
"TELA: uma headline. CARD: UMA FRASE. UMA PORTA.",
"""Copy
é palavra com destino.

Não é poesia solta.
Não é grito.

Uma frase.
Uma porta.

Você não tem problema de dinheiro.
Tem problema de estrutura.

A pessoa sabe
o que veio fazer ali.

Se a frase precisa
de três parágrafos
pra ser entendida,
ainda não é a frase.

Ação:
escreve uma frase
que uma criança
repete depois.

Próxima:
o post que para o scroll."""),

A("M5.6","M5 Atenção","O post que para","8 min","CAM",
"CARD: GANCHO. VIRADA. UMA PALAVRA.",
"""Gancho.
Virada.
Uma palavra.

Gancho: conclusão. Não introdução.
Virada: o princípio.
Palavra: MAPA. PRESENÇA. Uma só.

Duas palavras
é duas portas.
A pessoa não entra.

No mudo,
o texto do topo
já dá o soco.

Ação:
escreve o topo
de um vídeo
em quatro palavras.

Próxima:
venda com presença. Sem desespero."""),

A("M5.7","M5 Atenção","Venda com presença","8 min","CAM",
"Não preço de mentoria. CARD: NÃO DISPUTAR O SEGUNDO.",
"""Venda
não é correr
atrás da pessoa.

É presença
com porta.

Escuta.
Devolve o mapa.
Se existe caminho,
abre.
Se não existe,
não força.

Desespero
se sente
antes da frase.

A pessoa foge
do desespero
mesmo quando o produto é bom.

Ação:
numa conversa,
espera um segundo
antes de oferecer qualquer coisa.

Próxima:
lançamento. Ordem. Sem teatro de foguete."""),

A("M5.8","M5 Atenção","Lançamento com ordem","9 min","CAM + DIAG",
"DIAG: AQUECER · ABRIR · SERVIR. CARD: NÃO ABRE O QUE NÃO ESTÁ PRONTO.",
"""Lançar
não é postar um link
no desespero de domingo.

Aquecer.
Abrir.
Servir.

Se o lugar não está pronto,
não abre.

Se a palavra não está clara,
não abre.

Se você não aguenta
o que vem depois,
não abre.

Ação:
o que falta
pra sua porta
estar de pé.
Uma lista de três.
Não quinze.

Próxima:
preço. Princípio. Sem tabela."""),

A("M5.9","M5 Atenção","Preço é posição","8 min","CAM",
"PROIBIDO: valores da mentoria, planos, 17 mil, 39 mil. CARD: PREÇO DIZ LUGAR. A CONVERSA DIZ NÚMERO.",
"""Preço
não se grita
no vídeo
antes da conversa.

Preço diz lugar.
Barato demais
ensina a não respeitar.
Caro sem entrega
ensina a não voltar.

O número
mora na conversa.
Quando a pessoa
já viu o mapa.

Aqui a aula é o princípio.

Você não se humilha
no palco
pra parecer acessível.

Você é claro
na porta certa.

Ação:
escreve o que seu preço
precisa proteger.
Tempo.
Obra.
Campo.
Não o número.

Módulo seis:
o tempero.
Atenção. Lei. Padrão.
Sem virar filme."""),

# M6
A("M6.1","M6 Ancestral","O observador","8 min","CAM",
"CARD: ONDE VOCÊ OLHA, O SISTEMA DESTACA. Sem física de lousa.",
"""Onde você olha,
o sistema destaca.

Isso a física discute.
Isso a vida prova.

Olhar o furo
o dia inteiro
aumenta o furo
na sua decisão.

Olhar a obra
não apaga o furo.
Muda o que você constrói
depois de vê-lo.

Atenção não é magia.
É cursor.

Ação:
uma hora hoje
sem olhar o furo
que você já conhece.
Olha a próxima peça.

Próxima:
padrão que se espalha."""),

A("M6.2","M6 Ancestral","Padrão que se espalha","8 min","CAM",
"Sheldrake em uma frase. CARD: PADRÃO SE CONTAGIA.",
"""Padrão se contagia.

Casa.
Equipe.
Feed.
Família.

Não precisa
aceitar teoria inteira
pra ver o óbvio:

O que se repete
fica mais fácil
de repetir.

Por isso ordem
é proteção.
Por isso bagunça
também é.

Ação:
um padrão
que você está
contagiando alguém.
Serve.
Ou fura.

Próxima:
o corpo lembra."""),

A("M6.3","M6 Ancestral","O corpo lembra","8 min","CAM",
"Sem diagnóstico médico. CARD: CORPO É ARQUIVO.",
"""O corpo é arquivo.

Sono.
Tensão.
Fome.
Sexo.
Treino.

Você pode contar
uma história linda
e o corpo
contar outra.

Alinhamento
que ignora o corpo
é discurso.

Por isso treino.
Por isso hora.
Por isso não é só planilha.

Ação:
uma dívida
que o corpo
está cobrando.
Nomeia.
Não resolve no vídeo.

Próxima:
registro. Sem teatro de oráculo."""),

A("M6.4","M6 Ancestral","Registro","8 min","CAM",
"CARD: REGISTRO É O QUE VOCÊ FAZ. NÃO O QUE VOCÊ AFIRMA.",
"""Registro
não é teatro de oráculo.

É o que fica
do que você faz.

Afirmar no story
não registra.
Repetir na vida
registra.

O nome akasha
aqui
é campo de registro.
Não é atalho
pra fugir da obra.

Ação:
o que você afirmou
este mês
que a semana
não registrou.

Próxima:
padrão de família como furo no sistema."""),

A("M6.5","M6 Ancestral","Padrão de família","9 min","CAM",
"Não aula clínica. CARD: MESMO BURACO. NOMES NOVOS.",
"""Às vezes
você constrói império
em cima do mesmo buraco
da casa antiga.

Dinheiro.
Escolha de gente.
Jeito de sair.
Jeito de ficar.

Nomes novos.
Buraco velho.

Olhar isso
não é culpar pai.
É parar de fingir
que é coincidência.

Ação:
um buraco
que já teve
três nomes na sua vida.

Próxima:
lei. Causa. Efeito."""),

A("M6.6","M6 Ancestral","Causa e efeito","8 min","CAM",
"CARD: EFEITO NÃO MENTE.",
"""Efeito não mente.

Você pode
poeticar a causa.

O fim do mês
não poesia.

Causa:
impulso.
Efeito:
some.

Causa:
ordem.
Efeito:
dá pra ver.

Lei aqui
não é slogan.
É o que volta.

Ação:
um efeito
que você ainda
está culpando o universo.

Próxima:
vidas. Hipótese. Sem dogma."""),

A("M6.7","M6 Ancestral","Vidas, hipótese, obra","7 min","CAM",
"Leve. CARD: MESMO SEM ACEITAR, A OBRA CONTINUA.",
"""Tem quem viva
como se viesse de longe.

Tem quem viva
como se só houvesse isto.

Os dois
ainda têm que
fazer a obra de hoje.

Hipótese
não substitui
o arquivo do corpo
nem a gaveta do dinheiro.

Ação:
independente da hipótese,
qual é a obra de hoje.
Uma.

Próxima:
palavra profunda. Já começamos. Agora o corte."""),

A("M6.8","M6 Ancestral","A palavra que corta","8 min","CAM",
"CARD: NOME CERTO. FERIDA CERTA.",
"""Nome certo
abre.
Nome errado
encobre.

Dizer processo
quando é fuga.
Dizer alinhamento
quando é medo de olhar o número.

Corta.

A palavra
é tecnologia de criação
quando é verdadeira.
É maquiagem
quando não é.

Ação:
uma palavra sua
que está encobrindo.
Troca.

Próxima:
o que foi esquecido. Sem alienígena."""),

A("M6.9","M6 Ancestral","O que foi esquecido","8 min","CAM + BROLL 15%",
"BROLL: mão, pedra, caderno. CARD: MEDIDA. RITO. TRANSMISSÃO.",
"""Esqueceram
medida.
Rito.
Transmissão.

Medida: saber quanto.
Rito: repetir o que sustenta.
Transmissão: ensinar o próximo
sem esconder o ofício.

Tecnologia antiga
não é nave.
É não perder
o que leva gerações
pra aprender.

Ação:
o que você sabe
que ainda não ensinou
em ordem.

Módulo sete:
juntar. Ecossistema. Soberania."""),

# M7
A("M7.1","M7 Ecossistema","Desenhar o campo","10 min","CAM + DIAG",
"DIAG: portas do Hub SEM listar preço. CARD: UMA PORTA AGORA.",
"""Ecossistema
não é dezena de curso
jogado na bio.

É campo
com portas.

Dinheiro.
Legado.
Presença.
Caráter.
Sistema.
Livro.

A pessoa não precisa
de todas agora.
Precisa da certa.

Se você oferece todas
ao mesmo tempo,
é feira.
Não é campo.

Ação:
qual porta
você está
chamando agora.
Uma.

Próxima:
o caminho até pagar
sem gritar número."""),

A("M7.2","M7 Ecossistema","Página, caminho, pagamento","9 min","CAM + DIAG",
"DIAG: PÁGINA → CONVERSA → PAGAMENTO. Não Hotmart como religião. Não valor.",
"""Página
explica a porta.

Conversa
vê o mapa.

Pagamento
fecha o acordo.

Se a página
já grita número,
você perdeu
a conversa.

Se não tem página,
a conversa
cansa de explicar.

Os três.

Ação:
qual dos três
está oco
no seu campo.

Próxima:
produto digital. Lugar. Não só arquivo."""),

A("M7.3","M7 Ecossistema","Produto é lugar","8 min","CAM",
"Não citar Kiwify/Hotmart como único caminho. CARD: ARQUIVO NÃO É LUGAR.",
"""PDF solto
não é produto.

Produto
é lugar
com ordem.

O que vem primeiro.
O que não misturar.
Onde perguntar.
Onde voltar.

Arquivo
é tijolo.
Lugar
é casa.

Ação:
seu produto
é tijolo
ou casa.

Próxima:
marca. Voz. Sem logotipo de ego."""),

A("M7.4","M7 Ecossistema","Marca da essência","8 min","CAM",
"CARD: VOZ. COR. PROMESSA. UMA.",
"""Marca
não é logo no começo.

É voz.
É cor.
É uma promessa
que você aguenta.

Se a voz muda
toda semana,
não é marca.
É humor.

Akasha
é claro.
Pausa.
Sem guru.
Sem professor.
Sem personagem rico.

Ação:
três coisas
que sua marca
nunca faz.
Escreve.

Próxima:
lugar sem concorrência. Sem filme de dimensão."""),

A("M7.5","M7 Ecossistema","Lugar sem concorrência","8 min","CAM",
"Reescrever 'quinta dimensão' como lugar que só você ocupa porque é o seu cruzamento. CARD: SEU CRUZAMENTO.",
"""Concorrência
existe no genérico.

No cruzamento seu,
não.

O seu cruzamento
é o que só você
junta de verdade.

Método.
Vida.
Obra.
Tom.

Não é filme de dimensão.
É honestidade
sobre o que você
realmente constrói.

Ação:
escreve o cruzamento
em uma linha.
Se parecer de qualquer um,
ainda está genérico.

Próxima:
cópia. Soberania."""),

A("M7.6","M7 Ecossistema","A cópia é sua","8 min","CAM + TELA 15s pasta/backup",
"CARD: CÓPIA FORA DA MODA.",
"""Se a ferramenta fechar
e você perder a obra,
a obra não era sua.
Era aluguel.

Cópia.
Fora da moda da semana.
Com data.

Código.
Texto.
Lista.
Imagem lei.

Soberania
é chato
até o dia
em que deixa de ser.

Ação:
uma cópia hoje.
Não amanhã.

Próxima:
quem segura a internet. Uma ideia. Sem palestra de duas horas.""",),

A("M7.7","M7 Ecossistema","Quem segura a casa grande","8 min","CAM",
"Leve. CARD: ALUGUEL. NOME SEU.",
"""A casa grande
não é sua.

Cabo.
Nuvem.
Loja.
Rede.

Saber isso
não é paranoia.
É adulto.

Por isso
nome seu.
Lista sua.
Cópia sua.
Relação sua.

A rede pode tremer.
O que é seu
treme menos.

Ação:
o que hoje
está só no aluguel
de uma rede.

Próxima:
o novo. Sem token de salvação."""),

A("M7.8","M7 Ecossistema","O novo sem salvação","7 min","CAM",
"Web3 em uma analogia. CARD: NÃO COMPRE SALVAÇÃO.",
"""Toda época
vende salvação nova.

Token.
DAO.
Nome da moda.

Às vezes serve.
Às vezes é bezerro.

A pergunta
continua a mesma.

Porta.
Chave.
Quarto.
Quem decide.

Se o novo
não responde isso,
é fantasia
com vocabulário.

Ação:
um novo
que você estava
usando pra fugir
da obra velha.

Próxima:
o manifesto. Fecha o curso."""),

A("M7.9","M7 Ecossistema","Manifesto do criador","10 min","CAM. Fecha com silêncio 3s",
"Sem CTA de preço. CARD final: PORTA. CHAVE. QUARTO. Silêncio verdadeiro no fim.",
"""Fecha.

Você não virou mago.

Você viu receita.

Informação é forma.
Código é receita.
Internet é casa.
Atenção é cursor.
IA é ajudante.
Venda é presença com porta.
Caráter segura o que a técnica constrói.

Porta.
Chave.
Quarto.

Essência com estrutura.
Estrutura com essência.

A criança entende.
O adulto constrói.

Sua ação
não é assistir de novo.

É fazer
uma porta.
Hoje.

Silêncio.

Fim do curso.
Começo da obra.""",),
]

assert len(AULAS)==63, len(AULAS)

def wrap(c, text, font, size, maxw):
    words=text.split()
    if not words: return [""]
    lines,cur=[],words[0]
    for w in words[1:]:
        t=cur+" "+w
        if c.stringWidth(t,font,size)<=maxw: cur=t
        else:
            lines.append(cur); cur=w
    lines.append(cur)
    return lines

class Doc:
    def __init__(self, path):
        self.c=canvas.Canvas(path,pagesize=A4)
        self.c.setTitle("Tech Hub · 63 aulas")
        self.y=A4[1]-14*mm; self.page=0
        self.W,self.H=A4
        self.ML,self.MR,self.MB=16*mm,16*mm,16*mm
    def new(self, foot=True):
        if self.page:
            if foot: self.foot()
            self.c.showPage()
        self.page+=1
        self.c.setFillColor(HexColor("#F6F3EC")); self.c.rect(0,0,self.W,self.H,fill=1,stroke=0)
        self.y=self.H-14*mm
    def foot(self):
        self.c.setFillColor(HexColor("#9A7420")); self.c.rect(0,0,self.W,9*mm,fill=1,stroke=0)
        self.c.setFillColor(white); self.c.setFont("DejaVu",8)
        self.c.drawString(self.ML,3.5*mm,"Tech Hub · 63 aulas · produção")
        self.c.drawRightString(self.W-self.MR,3.5*mm,str(self.page))
    def need(self,h):
        if self.y-h<self.MB+6*mm: self.new()
    def cover(self):
        self.new(False)
        self.c.setFillColor(HexColor("#14110E")); self.c.rect(0,0,self.W,self.H,fill=1,stroke=0)
        self.c.setFillColor(HexColor("#9A7420")); self.c.rect(0,self.H-16*mm,self.W,16*mm,fill=1,stroke=0)
        self.c.setFillColor(white); self.c.setFont("DejaVuB",9)
        self.c.drawString(self.ML,self.H-10*mm,"AKASHA TECH HUB  ·  TELEPROMPT DAS 63 AULAS")
        y=self.H-50*mm
        self.c.setFont("DejaVuSB",28); self.c.setFillColor(white)
        for ln in ["Grava o preto.","Edita com a dourada.","Uma aula por dia."]:
            self.c.drawString(self.ML,y,ln); y-=34
        self.c.setFillColor(HexColor("#9A7420")); self.c.rect(0,0,self.W,12*mm,fill=1,stroke=0)
    def intro(self):
        self.new()
        self.c.setFillColor(HexColor("#9A7420")); self.c.setFont("DejaVuB",9)
        self.c.drawString(self.ML,self.y,"COMO GRAVAR E EDITAR"); self.y-=18
        self.c.setFillColor(HexColor("#14110E")); self.c.setFont("DejaVuSB",20)
        self.c.drawString(self.ML,self.y,"Dois passos. Só dois."); self.y-=28
        txt=("1. Grava lendo o teleprompt. Celular no olho. Notebook na tela quando a aula pedir TELA.\n"
             "2. Edita depois. Simples. Clareza. Sem efeito de guru.\n\n"
             "CAM: seu rosto. TELA: o que você clica. PIP: seu rosto pequeno no canto inferior direito, uns 25 por cento, nunca por cima da boca se o rosto estiver grande.\n"
             "CARD: uma frase, letra grande, não no rodapé.\n"
             "DIAG: três caixas. Porta. Chave. Quarto.\n"
             "BROLL: imagem por baixo, pouca. 15 a 25 por cento do tempo. Não estoque de sucesso.\n\n"
             "Corte o erro. Não corte o silêncio que o texto pediu.\n"
             "Legenda no peito, nunca na boca.\n"
             "Capa: frame real. Sem IA no seu rosto.\n"
             "Uma aula. Um arquivo. Nome: M1-1-informacao.mp4")
        self.c.setFont("DejaVu",11)
        for raw in txt.split("\n"):
            if not raw: self.y-=8; continue
            for ln in wrap(self.c,raw,"DejaVu",11,self.W-self.ML-self.MR):
                self.need(15); self.c.setFillColor(HexColor("#14110E")); self.c.drawString(self.ML,self.y,ln); self.y-=15
    def lesson(self,a):
        self.new()
        self.c.setFillColor(HexColor("#9A7420")); self.c.setFont("DejaVuB",8)
        self.c.drawString(self.ML,self.y,f"{a['id']}  ·  {a['m']}  ·  {a['dur']}  ·  {a['mix']}")
        self.y-=16
        self.c.setFillColor(HexColor("#14110E")); self.c.setFont("DejaVuSB",18)
        for ln in wrap(self.c,a["t"],"DejaVuSB",18,self.W-self.ML-self.MR):
            self.need(22); self.c.drawString(self.ML,self.y,ln); self.y-=22
        self.y-=6
        lines=[]
        for raw in a["edit"].split("\n"):
            lines += wrap(self.c,raw,"DejaVu",10,self.W-self.ML-self.MR-12) if raw else [""]
        h=16+len(lines)*13+8
        self.need(h)
        self.c.setFillColor(HexColor("#F3EBD8"))
        self.c.roundRect(self.ML,self.y-h+8,self.W-self.ML-self.MR,h,5,fill=1,stroke=0)
        y=self.y-6
        self.c.setFillColor(HexColor("#6B4A12")); self.c.setFont("DejaVuB",8)
        self.c.drawString(self.ML+7,y,"EDIÇÃO  ·  NÃO LER"); y-=14
        self.c.setFont("DejaVu",10)
        for ln in lines:
            self.c.drawString(self.ML+7,y,ln); y-=13
        self.y-=h+8
        self.c.setFillColor(HexColor("#9A7420")); self.c.setFont("DejaVuB",8)
        self.need(12); self.c.drawString(self.ML,self.y,"TELEPROMPT"); self.y-=18
        for p in a["tele"].strip().split("\n"):
            t=p.strip()
            if not t: self.y-=10; continue
            for ln in wrap(self.c,t,"DejaVuB",14,self.W-self.ML-self.MR):
                self.need(20)
                self.c.setFillColor(HexColor("#14110E")); self.c.setFont("DejaVuB",14)
                self.c.drawString(self.ML,self.y,ln); self.y-=18
            self.y-=8
    def save(self):
        self.foot(); self.c.save()

def main():
    root=Path("/tmp/akasha/AKASHAHUB/techub/aulas")
    js="const AULAS = "+json.dumps(AULAS,ensure_ascii=False,indent=2)+";\n"
    (root/"aulas.js").write_text(js,encoding="utf-8")
    pdf_path="/workspace/artifacts/techub-63-aulas.pdf"
    d=Doc(pdf_path)
    d.cover(); d.intro()
    for a in AULAS: d.lesson(a)
    d.save()
    shutil.copy(pdf_path, "/tmp/akasha/AKASHAHUB/afplataforma/interno/techub-63-aulas.pdf")
    print("lessons",len(AULAS),"pages",d.page,"js",len(js))

if __name__=="__main__":
    main()
