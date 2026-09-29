(function () {
  'use strict';

  var PATH = window.location.pathname.replace(/\/+$/, '') || '/';
  if (PATH !== '/' && PATH !== '/index.html') return;

  var WHATSAPP = '5571983448621';
  var ASSET = '/img/experiencias/';

  var profiles = {
    person: [
      { id:'P01', name:'O Desperto', symbol:'◉', line:'Você está percebendo que existe um padrão por trás do que vive — e quer enxergá-lo com mais clareza.' },
      { id:'P02', name:'O Autor', symbol:'✦', line:'Sua próxima fase pede autoria: separar o que é seu do que foi herdado, repetido ou simplesmente aceito.' },
      { id:'P03', name:'O Guardião', symbol:'◇', line:'Seu campo pede limite, estabilidade e uma presença que não se desfaz quando o mundo aperta.' },
      { id:'P04', name:'O Encarnado', symbol:'△', line:'A transformação precisa descer da cabeça para o corpo: presença, intimidade e experiência real.' },
      { id:'P05', name:'O Magnetista', symbol:'⌁', line:'Você está num ciclo de presença, comunicação e influência — quer ser percebido sem precisar forçar.' },
      { id:'P06', name:'O Vínculo', symbol:'∞', line:'Sua atenção está na qualidade da conexão: consigo, com o outro e com aquilo que mantém a relação viva.' },
      { id:'P07', name:'O Alquimista', symbol:'☿', line:'Você busca integrar mente, corpo e campo em uma prática que mude estado, percepção e ação.' },
      { id:'P08', name:'O Estrategista', symbol:'⟐', line:'Você não precisa de mais intenção: precisa organizar decisão, dinheiro, rotina e execução.' },
      { id:'P09', name:'O Construtor', symbol:'⬡', line:'Você tem algo para materializar. A pergunta agora é como transformar visão em estrutura que exista fora da sua cabeça.' },
      { id:'P10', name:'O Líder', symbol:'✧', line:'Seu próximo passo envolve conduzir pessoas, sustentar padrão e transformar influência em responsabilidade.' },
      { id:'P11', name:'O Integrador', symbol:'⊕', line:'Seu desafio não está em uma única área. Você precisa enxergar como as peças da vida se conectam antes de escolher o próximo movimento.' },
      { id:'P12', name:'O Visionário', symbol:'☾', line:'Você já olha para além do problema imediato. Seu foco é futuro, obra, direção e algo que permaneça.' }
    ],
    business: [
      { id:'E01', name:'A Empresa-Farol', symbol:'✧', line:'Existe valor, mas o mercado ainda não entende rápido o suficiente o que vocês representam.' },
      { id:'E02', name:'A Empresa-Academia', symbol:'▤', line:'Conhecimento importante vive espalhado em pessoas, arquivos e treinamentos que precisam ser repetidos.' },
      { id:'E03', name:'A Empresa-Relógio', symbol:'◷', line:'Agenda, operação e tarefas repetitivas estão consumindo tempo que deveria virar crescimento.' },
      { id:'E04', name:'A Empresa-Radar', symbol:'◎', line:'Existem oportunidades, mas prospecção, follow-up e visão do pipeline ainda dependem demais de esforço manual.' },
      { id:'E05', name:'A Empresa-Portal', symbol:'◫', line:'Eventos, experiências ou ativações podem continuar vivos antes, durante e depois do encontro presencial.' },
      { id:'E06', name:'A Empresa-Rede', symbol:'⌘', line:'Pessoas já orbitam a marca, mas ainda falta transformar audiência em comunidade, participação e recorrência.' },
      { id:'E07', name:'A Empresa-Estúdio', symbol:'◈', line:'Há repertório e autoridade, mas o conteúdo ainda nasce solto e morre rápido demais.' },
      { id:'E08', name:'A Empresa-Motor', symbol:'⚙', line:'A operação cresceu e tarefas repetidas já pedem automação, integração e inteligência aplicada.' },
      { id:'E09', name:'A Empresa-Cofre', symbol:'▣', line:'Decisão, caixa, indicadores e governança precisam conversar para a empresa avançar com mais clareza.' },
      { id:'E10', name:'A Empresa-Ponte', symbol:'⌒', line:'O cliente entra, mas a experiência entre descoberta, compra, entrega e retorno ainda tem rupturas.' },
      { id:'E11', name:'A Empresa-Laboratório', symbol:'⚗', line:'O que vocês precisam não cabe em ferramenta genérica: pede software, produto digital ou sistema sob medida.' },
      { id:'E12', name:'A Empresa-Ecossistema', symbol:'✺', line:'Já existem muitas peças. O próximo salto é fazê-las conversar como um sistema único e evolutivo.' }
    ]
  };

  var questions = {
    person: [
      {
        q:'Onde você sente que a vida está pedindo mais atenção agora?',
        a:[
          ['Identidade — quem eu sou e o que realmente é meu', {P02:3,P12:1,P11:1}],
          ['Dinheiro, decisão e execução', {P08:3,P09:1,P11:1}],
          ['Mente, limites e estabilidade emocional', {P03:3,P01:1,P07:1}],
          ['Corpo, intimidade e presença', {P04:3,P06:2}]
        ]
      },
      {
        q:'Se uma coisa mudasse primeiro, qual teria mais impacto?',
        a:[
          ['Eu me comunicar com mais presença e magnetismo', {P05:3,P10:1}],
          ['Parar de repetir padrões que nem parecem meus', {P02:3,P01:2}],
          ['Criar uma estrutura real para algo que quero construir', {P09:3,P12:2}],
          ['Sentir mais conexão comigo e com quem está perto', {P06:3,P04:2}]
        ]
      },
      {
        q:'Qual frase parece mais com o seu momento?',
        a:[
          ['“Eu entendo muita coisa, mas ainda não vivo tudo isso.”', {P07:3,P04:2}],
          ['“Quando o mundo aperta, eu me perco de mim.”', {P03:3,P11:1}],
          ['“Eu trabalho e penso muito, mas ainda falta direção.”', {P08:3,P09:2}],
          ['“Eu sei que posso influenciar mais, só não quero virar personagem.”', {P05:3,P10:2}]
        ]
      },
      {
        q:'Como você prefere transformar uma questão importante?',
        a:[
          ['Entendendo a raiz e mudando a forma de enxergar', {P01:3,P02:2}],
          ['Praticando no corpo e sentindo a mudança acontecer', {P04:3,P07:2}],
          ['Com acompanhamento, perguntas e um mapa claro', {P11:3,P08:2}],
          ['Construindo algo concreto que continue funcionando', {P09:3,P12:2}]
        ]
      },
      {
        q:'Qual resultado teria mais valor numa terça-feira comum?',
        a:[
          ['Abrir o banco sem entrar em guerra comigo', {P08:3,P03:1}],
          ['Dizer “não” ou me posicionar sem me desmontar', {P03:3,P10:1}],
          ['Entrar numa conversa e ser percebido com naturalidade', {P05:3,P06:1}],
          ['Tomar uma decisão importante sentindo que ela realmente é minha', {P02:3,P01:1}]
        ]
      },
      {
        q:'Hoje, qual dessas forças mais quer espaço?',
        a:[
          ['Curiosidade e consciência', {P01:3,P07:1}],
          ['Desejo, vínculo e presença', {P04:2,P06:3}],
          ['Ambição com estrutura', {P08:2,P09:3}],
          ['Visão, liderança e obra', {P10:2,P12:3}]
        ]
      },
      {
        q:'Em qual estágio você se reconhece mais?',
        a:[
          ['Estou começando a enxergar o que antes passava batido', {P01:3,P03:1}],
          ['Já enxerguei. Agora preciso incorporar e sustentar', {P04:2,P07:3}],
          ['Já tenho eixo. Quero construir, liderar e organizar', {P09:2,P10:3}],
          ['Tenho muitas peças e preciso integrá-las numa direção única', {P11:3,P12:2}]
        ]
      }
    ],
    business: [
      {
        q:'Hoje, qual gargalo mais trava o crescimento?',
        a:[
          ['As pessoas não entendem rápido o nosso valor', {E01:3,E07:1}],
          ['Treinamento e conhecimento ficam espalhados', {E02:3,E12:1}],
          ['Operação, agenda e tarefas repetidas consomem tempo', {E03:3,E08:2}],
          ['Vendas e follow-up ainda dependem demais de esforço manual', {E04:3,E10:1}]
        ]
      },
      {
        q:'O que mais se repete desnecessariamente na empresa?',
        a:[
          ['Explicar a mesma coisa para equipe, alunos ou franqueados', {E02:3,E07:1}],
          ['Responder, agendar, confirmar e organizar manualmente', {E03:3,E08:2}],
          ['Procurar leads e lembrar quem precisa de follow-up', {E04:3,E10:1}],
          ['Criar conteúdo do zero sem reaproveitar o que já sabemos', {E07:3,E12:1}]
        ]
      },
      {
        q:'Qual oportunidade vocês mais querem abrir?',
        a:[
          ['Transformar conhecimento em produto, treinamento ou receita', {E02:2,E07:3}],
          ['Criar uma experiência de evento/comunidade que continue viva', {E05:3,E06:2}],
          ['Ter um aplicativo, plataforma ou sistema próprio', {E11:3,E12:2}],
          ['Fazer clientes voltarem e circularem melhor pelo ecossistema', {E10:3,E06:1}]
        ]
      },
      {
        q:'Como está a relação entre marca e público?',
        a:[
          ['Temos valor, mas falta posicionamento claro', {E01:3,E07:1}],
          ['Temos audiência, mas pouca participação recorrente', {E06:3,E05:1}],
          ['Temos clientes, mas a jornada é quebrada', {E10:3,E03:1}],
          ['Temos várias frentes, mas parecem negócios separados', {E12:3,E01:1}]
        ]
      },
      {
        q:'Qual descrição tecnológica mais parece com vocês?',
        a:[
          ['Temos site e redes, mas quase nenhum sistema por trás', {E08:2,E11:2,E12:1}],
          ['Usamos várias ferramentas que não conversam', {E08:3,E12:2}],
          ['Já temos software, mas ele precisa evoluir ou ganhar novas camadas', {E11:3,E12:2}],
          ['Ainda fazemos quase tudo por WhatsApp, planilha e memória', {E03:2,E04:2,E08:3}]
        ]
      },
      {
        q:'Onde a empresa depende demais de uma pessoa?',
        a:[
          ['No conhecimento e treinamento', {E02:3,E07:1}],
          ['Nas vendas e relacionamento com clientes', {E04:3,E10:2}],
          ['Na operação e nas decisões do dia a dia', {E03:2,E09:3}],
          ['Na visão de produto e em como tudo se conecta', {E11:2,E12:3}]
        ]
      },
      {
        q:'Se os próximos 90 dias dessem muito certo, o que estaria diferente?',
        a:[
          ['A equipe aprenderia e operaria num ambiente próprio', {E02:3,E09:1}],
          ['Teríamos mais automação e menos trabalho repetido', {E08:3,E03:2}],
          ['Nosso evento/comunidade teria vida digital contínua', {E05:3,E06:2}],
          ['Teríamos um sistema sob medida ligando operação, clientes e crescimento', {E11:2,E12:3}]
        ]
      }
    ]
  };

  var images = {
    route: ASSET + 'lua-route.webp',
    person: ASSET + 'lua-person.webp',
    business: ASSET + 'lua-business.webp',
    writing: ASSET + 'lua-writing.webp',
    digital: ASSET + 'lua-digital.webp'
  };

  var state = { mode:null, step:0, score:{}, answers:[] };

  function injectCss() {
    if (document.getElementById('ah-xp-css')) return;
    var link = document.createElement('link');
    link.id = 'ah-xp-css';
    link.rel = 'stylesheet';
    link.href = '/css/experiencias-transcendentais.css?v=1';
    document.head.appendChild(link);
  }

  function track(action, detail) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event:'experiencias_transcendentais', xp_action:action, xp_detail:detail || '' });
    } catch(e) {}
  }

  function button() {
    var target = document.querySelector('.hero-ctas');
    if (!target || document.getElementById('xpEntry')) return;
    var a = document.createElement('button');
    a.id = 'xpEntry';
    a.type = 'button';
    a.className = 'btn-xp btn-premium';
    a.innerHTML = '<span class="xp-mini-mark">✦</span><span>EXPERIÊNCIAS TRANSCENDENTAIS</span>';
    a.addEventListener('click', open);
    target.insertBefore(a, target.firstChild);
  }

  function shell() {
    if (document.getElementById('xpOverlay')) return;
    var root = document.createElement('div');
    root.id = 'xpOverlay';
    root.className = 'xp-overlay';
    root.setAttribute('aria-hidden','true');
    root.innerHTML = [
      '<div class="xp-stage" role="dialog" aria-modal="true" aria-labelledby="xpTitle">',
        '<button class="xp-close" type="button" aria-label="Fechar">×</button>',
        '<div class="xp-visual">',
          '<img id="xpImage" alt="Lua · Akasha Hub" src="'+images.route+'">',
          '<div class="xp-visual-shade"></div>',
          '<div class="xp-visual-copy">',
            '<span class="xp-kicker">AKASHA HUB</span>',
            '<strong>Mente · Corpo · Campo</strong>',
            '<small>Código de Origem</small>',
          '</div>',
        '</div>',
        '<div class="xp-panel" id="xpPanel"></div>',
      '</div>'
    ].join('');
    document.body.appendChild(root);
    root.querySelector('.xp-close').addEventListener('click', close);
    root.addEventListener('click', function(e){ if(e.target === root) close(); });
  }

  function open() {
    injectCss(); shell(); state={mode:null,step:0,score:{},answers:[]};
    var o=document.getElementById('xpOverlay');
    o.classList.add('is-open'); o.setAttribute('aria-hidden','false');
    document.body.dataset.xpOverflow = document.body.style.overflow || '';
    document.body.style.overflow='hidden';
    renderRoute();
    track('open','home_hero');
  }

  function close() {
    var o=document.getElementById('xpOverlay');
    if (!o) return;
    o.classList.remove('is-open'); o.setAttribute('aria-hidden','true');
    document.body.style.overflow = document.body.dataset.xpOverflow || '';
    track('close', state.mode || 'route');
  }

  function setImage(src) {
    var img=document.getElementById('xpImage');
    if (!img || img.getAttribute('src') === src) return;
    img.classList.add('is-changing');
    setTimeout(function(){
      img.src=src;
      img.onload=function(){ img.classList.remove('is-changing'); };
    },150);
  }

  function renderRoute() {
    setImage(images.route);
    var p=document.getElementById('xpPanel');
    p.innerHTML=[
      '<div class="xp-head">',
        '<span class="xp-overline">experiências transcendentais</span>',
        '<h2 id="xpTitle">Onde essa experiência precisa acontecer agora?</h2>',
        '<p>Responda poucas perguntas. No final, você recebe um arquétipo — uma leitura de contexto, não um diagnóstico clínico.</p>',
      '</div>',
      '<div class="xp-route-grid">',
        '<button class="xp-route" data-mode="person" type="button"><span class="xp-route-symbol">◉</span><b>Em mim</b><small>Pessoa · identidade · corpo · dinheiro · direção</small></button>',
        '<button class="xp-route" data-mode="business" type="button"><span class="xp-route-symbol">✺</span><b>Na empresa ou evento</b><small>Negócio · equipe · sistema · vendas · experiência</small></button>',
      '</div>',
      '<div class="xp-trust"><span>7 perguntas</span><span>≈ 90 segundos</span><span>resultado privado</span></div>'
    ].join('');
    p.querySelectorAll('.xp-route').forEach(function(el){
      el.addEventListener('click',function(){
        state.mode=el.dataset.mode; state.step=0; state.score={}; state.answers=[];
        track('choose_mode',state.mode);
        renderQuestion();
      });
    });
  }

  function renderQuestion() {
    var list=questions[state.mode], item=list[state.step], total=list.length;
    setImage(state.mode==='business' ? (state.step%3===0 ? images.business : state.step%3===1 ? images.digital : images.writing) : (state.step%3===0 ? images.person : state.step%3===1 ? images.digital : images.writing));
    var pct=Math.round((state.step/total)*100);
    var p=document.getElementById('xpPanel');
    p.innerHTML=[
      '<div class="xp-progress-wrap"><div class="xp-progress-meta"><span>'+(state.mode==='business'?'EMPRESA / EVENTO':'PESSOA')+'</span><span>'+(state.step+1)+' / '+total+'</span></div><div class="xp-progress"><i style="width:'+pct+'%"></i></div></div>',
      '<div class="xp-question">',
        '<span class="xp-overline">escolha a resposta mais próxima</span>',
        '<h2 id="xpTitle">'+item.q+'</h2>',
        '<div class="xp-options">',
          item.a.map(function(ans,i){return '<button class="xp-option" type="button" data-i="'+i+'"><span>'+String(i+1).padStart(2,'0')+'</span><b>'+ans[0]+'</b></button>';}).join(''),
        '</div>',
      '</div>',
      '<div class="xp-bottom-actions"><button class="xp-back" type="button">← Voltar</button><small>Não existe resposta certa.</small></div>'
    ].join('');
    p.querySelectorAll('.xp-option').forEach(function(el){
      el.addEventListener('click',function(){ choose(Number(el.dataset.i)); });
    });
    p.querySelector('.xp-back').addEventListener('click',function(){
      if(state.step===0){ renderRoute(); return; }
      var last=state.answers.pop();
      if(last){
        Object.keys(last.scores).forEach(function(k){state.score[k]=(state.score[k]||0)-last.scores[k];});
      }
      state.step--;
      renderQuestion();
    });
  }

  function choose(index) {
    var item=questions[state.mode][state.step], picked=item.a[index], scores=picked[1];
    Object.keys(scores).forEach(function(k){ state.score[k]=(state.score[k]||0)+scores[k]; });
    state.answers.push({question:state.step,index:index,scores:scores});
    track('answer',state.mode+'_'+(state.step+1)+'_'+(index+1));
    state.step++;
    if(state.step>=questions[state.mode].length) renderResult();
    else renderQuestion();
  }

  function resultProfile() {
    var list=profiles[state.mode];
    var ranked=list.map(function(p){ return {p:p, score:state.score[p.id]||0}; })
      .sort(function(a,b){ return b.score-a.score || a.p.id.localeCompare(b.p.id); });
    return ranked[0].p;
  }

  function renderResult() {
    var r=resultProfile();
    setImage(state.mode==='business'?images.business:images.person);
    var p=document.getElementById('xpPanel');
    var message = [
      'Olá. Concluí o quiz Experiências Transcendentais no Akasha Hub.',
      '',
      'Rota: '+(state.mode==='business'?'Empresa / Evento':'Pessoa'),
      'Meu arquétipo: '+r.name,
      'Código: '+r.id,
      '',
      'Quero entender qual próximo movimento faz sentido para este perfil.'
    ].join('\n');
    var wa='https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(message);
    p.innerHTML=[
      '<div class="xp-result">',
        '<span class="xp-overline">seu arquétipo de contexto</span>',
        '<div class="xp-symbol">'+r.symbol+'</div>',
        '<p class="xp-code">'+r.id+'</p>',
        '<h2 id="xpTitle">'+r.name+'</h2>',
        '<p class="xp-result-line">'+r.line+'</p>',
        '<p class="xp-result-note">Isso não tenta encaixar você num produto. Serve para escolher a próxima conversa com mais contexto.</p>',
        '<a class="xp-whatsapp" href="'+wa+'" target="_blank" rel="noopener">CONTINUAR NO WHATSAPP <span>→</span></a>',
        '<button class="xp-restart" type="button">Refazer experiência</button>',
      '</div>'
    ].join('');
    p.querySelector('.xp-whatsapp').addEventListener('click',function(){ track('whatsapp',r.id); });
    p.querySelector('.xp-restart').addEventListener('click',function(){ state={mode:null,step:0,score:{},answers:[]}; renderRoute(); track('restart',r.id); });
    track('result',r.id);
  }

  function boot() {
    injectCss();
    button();
    shell();
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape' && document.getElementById('xpOverlay') && document.getElementById('xpOverlay').classList.contains('is-open')) close();
    });
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();