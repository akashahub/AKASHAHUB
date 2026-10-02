(function(){ var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; var header = document.getElementById('siteHeader'); var progress = document.getElementById('progress'); var bar = document.getElementById('bottomBar'); var pathLinks = document.querySelectorAll('.path-list a'); var cycles = document.querySelectorAll('.cycle'); if('IntersectionObserver' in window && !reduced){ var els = document.querySelectorAll('.reveal'); var io = new IntersectionObserver(function(entries){ entries.forEach(function(entry){ if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); } }); },{threshold:.14,rootMargin:'0px 0px -8% 0px'}); els.forEach(function(el){ io.observe(el); }); } else { document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); }); } if('IntersectionObserver' in window){ var cio = new IntersectionObserver(function(entries){ entries.forEach(function(entry){ if(!entry.isIntersecting) return; var id = entry.target.id; pathLinks.forEach(function(a){ var on = a.getAttribute('data-cycle') === id; a.classList.toggle('is-active', on); if(on) a.scrollIntoView({inline:'center',block:'nearest',behavior:reduced?'auto':'smooth'}); }); cycles.forEach(function(c){ c.classList.toggle('is-on', c.id === id); }); }); },{threshold:.45,rootMargin:'-12% 0px -40% 0px'}); cycles.forEach(function(el){ cio.observe(el); }); } var lastY = window.scrollY; var ticking = false; function onScroll(){ var y = window.scrollY; var max = document.documentElement.scrollHeight - window.innerHeight; var pct = max > 0 ? Math.min(1, y / max) : 0; if(progress) progress.style.width = (pct * 100).toFixed(2) + '%'; if(y > lastY && y > 140){ header.classList.add('hide'); document.body.classList.add('header-hidden'); } else { header.classList.remove('hide'); document.body.classList.remove('header-hidden'); } if(bar) bar.classList.toggle('nudge', pct > 0.38); lastY = y; ticking = false; } window.addEventListener('scroll', function(){ if(!ticking){ window.requestAnimationFrame(onScroll); ticking = true; } }, {passive:true}); onScroll(); })();
(function(){
  var box = document.getElementById('quizBox');
  if(!box) return;
  var WA = '5571983448621';
  var state = { who:'', kind:'', needs:[] };
  var kinds = {
    pessoa:['Especialista','Terapeuta','Produtor / Criador','Mentor','Outro'],
    empresa:['Barbearia','Clínica','Salão','Academia','Escola / Educação','Empresa','Outro']
  };
  var needs = [
    'organizar minha operação',
    'conseguir mais agendamentos',
    'melhorar atendimento',
    'criar um aplicativo',
    'criar uma plataforma',
    'organizar meus conteúdos',
    'automatizar processos',
    'criar uma área para clientes ou alunos',
    'transformar meu conhecimento em produto digital',
    'criar um sistema próprio',
    'ainda não sei'
  ];
  function esc(s){
    return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/"/g,'"');
  }
  function step(){
    if(!state.who) return 1;
    if(!state.kind) return 2;
    return 3;
  }
  function chip(label, on){
    return '<button type="button" class="q-chip'+(on?' on':'')+'" data-v="'+esc(label)+'">'+esc(label)+'</button>';
  }
  function render(){
    var n = step();
    var html = '<p class="q-step">0'+n+' / 03</p>';
    if(n===1){
      html += '<h3>Você chega como pessoa ou como negócio?</h3><div class="q-row">';
      html += '<button type="button" class="q-chip" data-who="pessoa">Sou uma pessoa / profissional</button>';
      html += '<button type="button" class="q-chip" data-who="empresa">Tenho uma empresa / negócio</button>';
      html += '</div>';
    } else if(n===2){
      html += '<h3>Qual é o seu caso?</h3><div class="q-row">';
      kinds[state.who].forEach(function(k){ html += chip(k, state.kind===k); });
      html += '</div><div class="q-actions"><button type="button" class="q-back" data-back="1">Voltar</button></div>';
    } else {
      html += '<h3>O que você gostaria de melhorar?</h3><div class="q-needs">';
      needs.forEach(function(k){ html += chip(k, state.needs.indexOf(k)>=0); });
      html += '</div><div class="q-actions"><button type="button" class="q-back" data-back="2">Voltar</button>';
      html += '<a class="btn btn-gold" id="quizGo" href="#" target="_blank" rel="noopener">Quero entender qual solução faria sentido</a></div>';
      html += '<p class="ready" id="quizReady"></p>';
    }
    box.innerHTML = html;
    bind();
  }
  function message(){
    var lista = state.needs.length ? state.needs.join(', ') : 'ainda não sei por onde começar';
    if(state.who==='empresa'){
      return 'Olá, sou uma empresa do segmento '+state.kind+' e estou buscando uma solução para '+lista+'. Gostaria de entender o que poderia ser desenvolvido para o meu negócio.';
    }
    return 'Olá, sou um profissional de '+state.kind+' e estou buscando uma solução para '+lista+'. Gostaria de entender o que poderia ser desenvolvido para o meu trabalho.';
  }
  function bind(){
    box.querySelectorAll('[data-who]').forEach(function(b){
      b.onclick = function(){ state.who = b.getAttribute('data-who'); state.kind=''; state.needs=[]; render(); };
    });
    box.querySelectorAll('.q-chip[data-v]').forEach(function(b){
      b.onclick = function(){
        var v = b.getAttribute('data-v');
        if(step()===2){ state.kind = v; render(); return; }
        if(v==='ainda não sei'){ state.needs = ['ainda não sei']; }
        else {
          state.needs = state.needs.filter(function(x){ return x!=='ainda não sei'; });
          var i = state.needs.indexOf(v);
          if(i>=0) state.needs.splice(i,1); else state.needs.push(v);
        }
        render();
      };
    });
    var back = box.querySelector('[data-back]');
    if(back) back.onclick = function(){
      if(back.getAttribute('data-back')==='1'){ state.who=''; state.kind=''; state.needs=[]; }
      else { state.kind=''; state.needs=[]; }
      render();
    };
    var go = document.getElementById('quizGo');
    var ready = document.getElementById('quizReady');
    if(go){
      var text = message();
      go.href = 'https://wa.me/'+WA+'?text='+encodeURIComponent(text);
      if(!state.needs.length){ go.setAttribute('aria-disabled','true'); go.style.opacity='.45'; go.onclick=function(e){ e.preventDefault(); }; }
      if(ready && state.needs.length) ready.textContent = text;
    }
  }
  render();
})();
