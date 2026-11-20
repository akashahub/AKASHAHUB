(function(){
  "use strict";
  if(document.getElementById("ah-concierge")) return;
  const LOGO="https://res.cloudinary.com/dcbarseus/image/upload/v1771197016/IMG_20260104_135834_828_etfko2.png";
  const WA="5571983448621";
  const root=document.createElement("div");
  root.id="ah-concierge";
  root.innerHTML=`
    <section class="ah-panel" role="dialog" aria-modal="false" aria-label="Assistente Akasha Hub">
      <header class="ah-head">
        <span class="ah-avatar"><img src="${LOGO}" alt="Logo Akasha Hub"></span>
        <span class="ah-headcopy"><strong>Akasha Hub | Assistente</strong><small>Online · direcionamento inicial</small></span>
        <button class="ah-close" type="button" aria-label="Fechar conversa">×</button>
      </header>
      <div class="ah-progress"><span></span></div>
      <div class="ah-chat" aria-live="polite" aria-relevant="additions"></div>
      <div class="ah-foot">Conversa inicial · seus dados só serão enviados quando você escolher continuar pelo WhatsApp.</div>
    </section>
    <button class="ah-launcher" type="button" aria-label="Abrir conversa com Akasha Hub"><img src="${LOGO}" alt=""></button>`;
  document.body.appendChild(root);
  const chat=root.querySelector(".ah-chat"), progress=root.querySelector(".ah-progress span");
  const panel=root.querySelector(".ah-panel");
  const answers={goal:"",name:"",business:"",segment:"",instagram:"",stage:"",challenge:"",outcome:"",whatsapp:"",availability:""};
  let step=0,consented=false;
  const steps=["goal","name","business","segment","instagram","stage","challenge","outcome","whatsapp","availability"];
  function open(){root.classList.add("ah-open");root.querySelector(".ah-launcher").setAttribute("aria-expanded","true");setTimeout(()=>chat.scrollTop=chat.scrollHeight,30)}
  function close(){root.classList.remove("ah-open");root.querySelector(".ah-launcher").setAttribute("aria-expanded","false")}
  root.querySelector(".ah-launcher").addEventListener("click",open);
  root.querySelector(".ah-close").addEventListener("click",close);
  function scroll(){chat.scrollTop=chat.scrollHeight}
  function bot(html){const row=document.createElement("div");row.className="ah-line";row.innerHTML='<span class="ah-mini"><img src="'+LOGO+'" alt=""></span><div class="ah-bubble">'+html+'</div>';chat.appendChild(row);scroll()}
  function user(value){const row=document.createElement("div");row.className="ah-line ah-user";const bubble=document.createElement("div");bubble.className="ah-bubble";bubble.textContent=value;row.appendChild(bubble);chat.appendChild(row);scroll()}
  function choices(items,callback){const wrap=document.createElement("div");wrap.className="ah-options";items.forEach(item=>{const b=document.createElement("button");b.type="button";b.className="ah-option";b.textContent=item;b.addEventListener("click",()=>{wrap.remove();user(item);callback(item)});wrap.appendChild(b)});chat.appendChild(wrap);scroll()}
  function input(placeholder,key,opts){const wrap=document.createElement("div");wrap.className="ah-entry";const field=document.createElement(opts&&opts.multiline?"textarea":"input");if(field.tagName==="INPUT")field.type=(opts&&opts.type)||"text";field.placeholder=placeholder;field.maxLength=(opts&&opts.max)||500;field.setAttribute("aria-label",placeholder);const send=document.createElement("button");send.className="ah-send";send.type="button";send.textContent="Enviar";function submit(){const value=field.value.trim();if(!value){field.focus();return}wrap.remove();user(value);answers[key]=value;next()}send.addEventListener("click",submit);field.addEventListener("keydown",e=>{if(e.key==="Enter"&&!(opts&&opts.multiline)){e.preventDefault();submit()} });wrap.append(field,send);chat.appendChild(wrap);field.focus();scroll()}
  function setProgress(){progress.style.width=Math.round((step/steps.length)*100)+"%"}
  function next(){step++;setProgress();ask()}
  function ask(){
    switch(steps[step]){
      case "goal":
        bot("Para começar, quero entender o que você deseja construir ou organizar. Qual caminho mais se aproxima do seu momento?");
        choices(["Estruturar ou expandir meu negócio","Transformar meu conhecimento em um serviço, método ou oferta","Criar ou melhorar minha presença digital","Desenvolver um site, sistema ou automação","Ainda preciso entender o que faz sentido"],v=>{answers.goal=v;next()});break;
      case "name": bot("Perfeito. Como você se chama?");input("Seu nome","name",{max:80});break;
      case "business": bot("Você representa uma empresa ou está desenvolvendo um projeto próprio? Se já tiver um nome, pode me contar.");input("Nome do negócio ou projeto (ou 'ainda não tenho')","business",{max:120});break;
      case "segment": bot("Em qual área você atua?");choices(["Serviços profissionais","Saúde, clínica ou bem-estar","Educação, cursos ou mentorias","Comércio, varejo ou indústria","Tecnologia ou negócios digitais","Outro segmento"],v=>{answers.segment=v;next()});break;
      case "instagram": bot("Qual é o Instagram do negócio ou o seu perfil profissional? Assim, o responsável poderá conhecer melhor sua comunicação e posicionamento antes da conversa. <br><small>Se preferir, você pode pular esta etapa.</small>");choices(["Informar Instagram","Prefiro não informar"],v=>{if(v==="Prefiro não informar"){answers.instagram="Não informado";next()}else input("@seuperfil","instagram",{max:100})});break;
      case "stage": bot("Em que momento o negócio está hoje?");choices(["Estou começando ou validando a ideia","Já tenho clientes e quero organizar a operação","Já tenho uma estrutura e quero crescer","Tenho uma empresa consolidada e preciso evoluir sistemas/processos"],v=>{answers.stage=v;next()});break;
      case "challenge": bot("Qual é o principal desafio que mais precisa de atenção agora? Pode explicar com suas palavras.");input("Conte brevemente o que está acontecendo…","challenge",{multiline:true,max:700});break;
      case "outcome": bot("E o que você gostaria que estivesse diferente depois de resolver isso? Qual resultado seria valioso para você?");input("O que você quer alcançar?","outcome",{multiline:true,max:700});break;
      case "whatsapp": bot("Qual número com DDD podemos usar para retornar e combinar a conversa?");input("(DDD) 9 0000-0000","whatsapp",{type:"tel",max:25});break;
      case "availability": bot("Para facilitar, quais dias ou períodos costumam funcionar melhor para você? Isso é uma preferência inicial; o horário será confirmado diretamente.");input("Ex.: terça à tarde ou quinta de manhã","availability",{max:120});break;
      default: finish();
    }
  }
  function finish(){
    progress.style.width="100%";
    bot("Obrigado, "+escapeHtml(answers.name)+". Já temos um primeiro panorama do seu negócio. <strong>O próximo passo é solicitar a Sessão de Diagnóstico</strong>, para compreender o cenário e direcionar a construção mais adequada — sem presumir uma solução antes de analisar suas necessidades.");
    bot("Ao continuar, você autoriza o envio destas informações à Akasha Hub pelo WhatsApp para tratar da conversa solicitada. A análise do Instagram será feita pela equipe, não automaticamente por este assistente.");
    const consent=document.createElement("div");consent.className="ah-consent";consent.innerHTML='<label><input type="checkbox"> <span>Concordo em compartilhar estas informações para receber contato sobre a sessão de diagnóstico.</span></label>';chat.appendChild(consent);
    const actions=document.createElement("div");actions.className="ah-actions";
    const send=document.createElement("button");send.type="button";send.className="ah-primary";send.textContent="Enviar briefing e combinar a sessão →";
    const details=document.createElement("a");details.className="ah-secondary";details.href="/leituracall/";details.textContent="Conhecer a sessão de diagnóstico";
    send.addEventListener("click",()=>{if(!consent.querySelector("input").checked){consent.style.color="#a22";consent.querySelector("span").textContent="Marque a autorização para continuar.";return}const msg=[
      "Olá! Quero solicitar uma Sessão de Diagnóstico com o Akasha Hub.",
      "Nome: "+answers.name,"Negócio/projeto: "+answers.business,"Segmento: "+answers.segment,
      "Objetivo: "+answers.goal,"Instagram: "+answers.instagram,"Momento atual: "+answers.stage,
      "Principal desafio: "+answers.challenge,"Resultado desejado: "+answers.outcome,
      "Meu WhatsApp: "+answers.whatsapp,"Disponibilidade: "+answers.availability,
      "Envio estas informações para preparar a conversa. Aguardo confirmação do horário."
    ].join("\n");window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(msg),"_blank","noopener")});
    actions.append(send,details);chat.appendChild(actions);scroll();
  }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  bot("Olá! Seja bem-vindo ao <strong>Akasha Hub</strong>. Vou fazer algumas perguntas rápidas para entender seu negócio e preparar melhor uma conversa de diagnóstico.");
  bot("A ideia é conhecer seu momento antes da call — inclusive seu Instagram, se você quiser compartilhar.");
  ask();
  try{if(!sessionStorage.getItem("ahConciergeSeen")){setTimeout(()=>{if(!root.classList.contains("ah-open"))open();sessionStorage.setItem("ahConciergeSeen","1")},6500)}}catch(e){}
})();