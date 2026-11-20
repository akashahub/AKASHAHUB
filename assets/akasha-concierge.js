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
        <span class="ah-headcopy"><strong>Akasha Hub</strong><small>Assistente online</small></span>
        <button class="ah-close" type="button" aria-label="Fechar conversa">×</button>
      </header>
      <div class="ah-progress"><span></span></div>
      <div class="ah-chat" aria-live="polite" aria-relevant="additions"></div>
      <div class="ah-foot">Seus dados só serão enviados quando você escolher continuar pelo WhatsApp.</div>
    </section>
    <button class="ah-launcher" type="button" aria-label="Abrir conversa com Akasha Hub"><img src="${LOGO}" alt=""></button>`;
  document.body.appendChild(root);
  const chat=root.querySelector(".ah-chat"), progress=root.querySelector(".ah-progress span");
  const answers={goal:"",name:"",business:"",segment:"",instagram:"",stage:"",challenge:"",outcome:"",whatsapp:"",availability:""};
  let step=0;
  const steps=["goal","name","business","segment","instagram","stage","challenge","outcome","whatsapp","availability"];

  function open(){
    root.classList.add("ah-open");
    root.querySelector(".ah-launcher").setAttribute("aria-expanded","true");
    setTimeout(()=>chat.scrollTop=chat.scrollHeight,30);
  }
  function close(){
    root.classList.remove("ah-open");
    root.querySelector(".ah-launcher").setAttribute("aria-expanded","false");
  }
  root.querySelector(".ah-launcher").addEventListener("click",open);
  root.querySelector(".ah-close").addEventListener("click",close);
  function scroll(){chat.scrollTop=chat.scrollHeight;}

  function typing(){
    const row=document.createElement("div");
    row.className="ah-line ah-typing";
    row.innerHTML='<span class="ah-mini"><img src="'+LOGO+'" alt=""></span><div class="ah-bubble"><span></span><span></span><span></span></div>';
    chat.appendChild(row);
    scroll();
    return row;
  }
  function bot(html,done,delay){
    const indicator=typing();
    setTimeout(()=>{
      indicator.remove();
      const row=document.createElement("div");
      row.className="ah-line";
      row.innerHTML='<span class="ah-mini"><img src="'+LOGO+'" alt=""></span><div class="ah-bubble">'+html+'</div>';
      chat.appendChild(row);
      scroll();
      if(done) done();
    },delay===undefined?2300:delay);
  }
  function user(value){
    const row=document.createElement("div");
    row.className="ah-line ah-user";
    const bubble=document.createElement("div");
    bubble.className="ah-bubble";
    bubble.textContent=value;
    row.appendChild(bubble);
    chat.appendChild(row);
    scroll();
  }
  function choices(items,callback){
    const wrap=document.createElement("div");
    wrap.className="ah-options";
    items.forEach(item=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="ah-option";
      b.textContent=item;
      b.addEventListener("click",()=>{
        wrap.remove();
        user(item);
        callback(item);
      });
      wrap.appendChild(b);
    });
    chat.appendChild(wrap);
    scroll();
  }
  function input(placeholder,key,opts){
    const wrap=document.createElement("div");
    wrap.className="ah-entry";
    const field=document.createElement(opts&&opts.multiline?"textarea":"input");
    if(field.tagName==="INPUT") field.type=(opts&&opts.type)||"text";
    field.placeholder=placeholder;
    field.maxLength=(opts&&opts.max)||500;
    field.setAttribute("aria-label",placeholder);
    const send=document.createElement("button");
    send.className="ah-send";
    send.type="button";
    send.textContent="Enviar";
    function submit(){
      const value=field.value.trim();
      if(!value){field.focus();return;}
      wrap.remove();
      user(value);
      answers[key]=value;
      next();
    }
    send.addEventListener("click",submit);
    field.addEventListener("keydown",e=>{
      if(e.key==="Enter"&&!(opts&&opts.multiline)){e.preventDefault();submit();}
    });
    wrap.append(field,send);
    chat.appendChild(wrap);
    field.focus();
    scroll();
  }
  function setProgress(){progress.style.width=Math.round((step/steps.length)*100)+"%";}
  function next(){step++;setProgress();ask();}

  function ask(){
    switch(steps[step]){
      case "goal":
        bot("O que você quer melhorar ou construir?",()=>{
          choices([
            "Meu negócio ou empresa",
            "Minha presença na internet",
            "Um projeto ou produto novo",
            "Organizar melhor minhas finanças",
            "Ainda não sei por onde começar"
          ],v=>{answers.goal=v;next();});
        });
        break;
      case "name":
        bot("Legal! Como você se chama?",()=>input("Seu nome","name",{max:80}));
        break;
      case "business":
        bot("Você tem uma empresa ou está começando um projeto?",()=>input("Nome da empresa ou projeto","business",{max:120}));
        break;
      case "segment":
        bot("Com o que você trabalha?",()=>choices([
          "Serviços profissionais","Saúde ou bem-estar","Cursos ou educação",
          "Comércio ou indústria","Tecnologia ou internet","Outra área"
        ],v=>{answers.segment=v;next();}));
        break;
      case "instagram":
        bot("Qual é o seu Instagram? Quero conhecer um pouco do seu trabalho antes da nossa conversa.",()=>{
          choices(["Vou informar","Prefiro não informar"],v=>{
            if(v==="Prefiro não informar"){answers.instagram="Não informado";next();}
            else input("@seuperfil","instagram",{max:100});
          });
        });
        break;
      case "stage":
        bot("Como está seu negócio hoje?",()=>choices([
          "Estou começando","Já tenho clientes","Quero fazer meu negócio crescer",
          "Minha empresa já está estruturada"
        ],v=>{answers.stage=v;next();}));
        break;
      case "challenge":
        bot("Qual é a maior dificuldade que você quer resolver?",()=>input("Conte um pouco","challenge",{multiline:true,max:700}));
        break;
      case "outcome":
        bot("O que você gostaria de conquistar?",()=>input("Quero alcançar...","outcome",{multiline:true,max:700}));
        break;
      case "whatsapp":
        bot("Qual é o seu WhatsApp com DDD?",()=>input("(DDD) 9 0000-0000","whatsapp",{type:"tel",max:25}));
        break;
      case "availability":
        bot("Qual dia ou horário costuma ser melhor para você?",()=>input("Ex.: terça à tarde","availability",{max:120}));
        break;
      default:
        finish();
    }
  }

  function finish(){
    progress.style.width="100%";
    bot("Obrigado, "+escapeHtml(answers.name)+"! Agora já conhecemos um pouco melhor o seu negócio.",()=>{
      bot("Vamos preparar uma conversa para entender o que você precisa e encontrar um bom caminho.",()=>{
        const consent=document.createElement("div");
        consent.className="ah-consent";
        consent.innerHTML='<label><input type="checkbox"> <span>Autorizo o envio destas informações para a Akasha Hub entrar em contato.</span></label>';
        chat.appendChild(consent);
        const actions=document.createElement("div");
        actions.className="ah-actions";
        const send=document.createElement("button");
        send.type="button";
        send.className="ah-primary";
        send.textContent="Enviar e combinar a conversa";
        const details=document.createElement("a");
        details.className="ah-secondary";
        details.href="/leituracall/";
        details.textContent="Conhecer a sessão";
        send.addEventListener("click",()=>{
          if(!consent.querySelector("input").checked){
            consent.style.color="#a22";
            consent.querySelector("span").textContent="Marque a autorização para continuar.";
            return;
          }
          const msg=[
            "Olá! Quero conversar com a Akasha Hub.",
            "Nome: "+answers.name,
            "Negócio ou projeto: "+answers.business,
            "Área: "+answers.segment,
            "O que procuro: "+answers.goal,
            "Instagram: "+answers.instagram,
            "Momento atual: "+answers.stage,
            "Minha dificuldade: "+answers.challenge,
            "O que quero alcançar: "+answers.outcome,
            "Meu WhatsApp: "+answers.whatsapp,
            "Melhor horário: "+answers.availability,
            "Gostaria de combinar uma sessão de diagnóstico."
          ].join("\n");
          window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(msg),"_blank","noopener");
        });
        actions.append(send,details);
        chat.appendChild(actions);
        scroll();
      },2600);
    },2400);
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }

  setTimeout(()=>{
    open();
    bot("Olá! Que bom ter você aqui.",()=>{
      bot("Vou fazer algumas perguntas rápidas para conhecer seu negócio e entender como podemos ajudar.",ask,3000);
    },0);
  },2000);
})();