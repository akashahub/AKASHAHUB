(function () {
  const API = "https://jsonmxbuzagmwuucruem.supabase.co/functions/v1/akashaConversa";
  const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzb25teGJ1emFnbXd1dWNydWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0ODAzMTMsImV4cCI6MjA5NjA1NjMxM30.qqBI_AUm_AnP4D830QNUd3JIbPE6o54yzwej0utJ6rQ";
  const WA = "5571983448621";
  const state = { step: 0, service: "", intent: "", days: [], date: "", time: "", id: "", code: "", cents: 4500, name: "", phone: "", email: "", channel: "whatsapp-audio", consent: false, busy: false };
  const labels = { conversar: "Conversar", alinhamento: "Fazer um alinhamento", sessao: "Reservar uma sessão" };
  const intents = {
    entender: "Quero entender o que está acontecendo",
    direcao: "Quero um direcionamento",
    alinhamento: "Quero fazer um alinhamento",
    sessao: "Quero reservar uma sessão"
  };

  function root() {
    let el = document.getElementById("akashaConversa");
    if (el) return el;
    el = document.createElement("div");
    el.id = "akashaConversa";
    el.className = "cv-root";
    el.innerHTML = '<div class="cv-sheet" role="dialog" aria-modal="true" aria-labelledby="cvTitle"><div class="cv-bar"><b id="cvTitle">CONVERSE COMIGO</b><button type="button" id="cvClose">Fechar</button></div><div class="cv-progress" id="cvProgress"></div><div class="cv-log" id="cvLog"></div><div class="cv-actions" id="cvActions"></div></div>';
    document.body.appendChild(el);
    el.addEventListener("click", (e) => { if (e.target === el) close(); });
    el.querySelector("#cvClose").onclick = close;
    return el;
  }
  function open() {
    root().classList.add("on");
    document.body.style.overflow = "hidden";
    track("modal_opened");
    state.step = 0;
    draw();
  }
  function close() {
    const el = document.getElementById("akashaConversa");
    if (el) el.classList.remove("on");
    document.body.style.overflow = "";
  }
  function log() { return document.getElementById("cvLog"); }
  function actions() { return document.getElementById("cvActions"); }
  function say(text, who) {
    const p = document.createElement("div");
    p.className = "cv-msg " + (who || "hub");
    p.textContent = text;
    log().appendChild(p);
  }
  function setProgress(n) {
    const bar = document.getElementById("cvProgress");
    bar.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const mark = document.createElement("i");
      if (i <= n) mark.className = "on";
      bar.appendChild(mark);
    }
  }
  function button(label, fn, primary) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    if (primary) b.className = "primary";
    b.onclick = fn;
    actions().appendChild(b);
    return b;
  }
  function field(label, id, type) {
    const wrap = document.createElement("label");
    wrap.className = "cv-field";
    wrap.textContent = label;
    const input = document.createElement(type === "area" ? "textarea" : "input");
    input.id = id;
    if (type !== "area") input.type = type || "text";
    wrap.appendChild(input);
    actions().appendChild(wrap);
    return input;
  }
  function reais(cents) { return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

  async function api(body) {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: KEY, Authorization: "Bearer " + KEY },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.error || "rede"), { status: res.status, data });
    return data;
  }
  function track(name) {
    try { if (window.dataLayer) window.dataLayer.push({ event: name }); } catch (e) {}
    api({ action: "event", name, appointment_id: state.id || "" }).catch(() => {});
  }

  function draw() {
    log().innerHTML = "";
    actions().innerHTML = "";
    const steps = [intro, intent, explain, dates, times, notice, contact, pay];
    setProgress(Math.min(state.step, 5));
    steps[state.step]();
    log().scrollTop = log().scrollHeight;
  }

  function intro() {
    say("Alguns minutos podem organizar aquilo que você está tentando entender há muito tempo.");
    say("Você pode conversar diretamente com o Akasha Hub para entender o próximo passo, solicitar um alinhamento ou reservar uma sessão individual.");
    button("Conversar", () => chooseService("conversar"));
    button("Fazer um alinhamento", () => chooseService("alinhamento"));
    button("Reservar uma sessão", () => chooseService("sessao"));
    const link = document.createElement("button");
    link.type = "button";
    link.textContent = "Meu agendamento";
    link.onclick = () => { location.href = "/converse/"; };
    actions().appendChild(link);
  }
  function chooseService(service) {
    state.service = service;
    track("conversation_started");
    track("service_selected");
    say(labels[service], "me");
    state.step = 1;
    draw();
  }
  function intent() {
    say("Vamos organizar isso em poucos passos.");
    say("Primeiro, o que você está buscando hoje?");
    Object.keys(intents).forEach((key) => button(intents[key], () => {
      state.intent = intents[key];
      say(intents[key], "me");
      state.step = 2;
      draw();
    }));
    button("Voltar", () => { state.step = 0; draw(); });
  }
  function explain() {
    say("Em 15 minutos, você pode organizar aquilo que está tentando entender há muito tempo. Você traz o que está acontecendo agora. O mentor escuta. A partir dessa conversa, ele identifica o ponto central e escolhe a melhor ferramenta para aquele momento.");
    say("Essa conversa acontece em uma sessão individual de aproximadamente 15 minutos.");
    button("Escolher o dia", () => loadDays());
    button("Voltar", () => { state.step = 1; draw(); });
  }
  async function loadDays() {
    actions().innerHTML = "";
    say("Vou olhar os horários que ainda estão livres.");
    try {
      const data = await api({ action: "slots" });
      state.days = data.days || [];
      if (!state.days.length) throw new Error(data.error || "vazio");
      state.step = 3;
      track("date_selected");
      draw();
    } catch (e) {
      say("A agenda ao vivo não respondeu agora. Dá para seguir pelo WhatsApp com o que você já escolheu, sem reserva falsa.");
      button("Falar pelo WhatsApp", openWhatsapp);
    }
  }
  function dates() {
    say("Qual é o melhor dia para você?");
    if (!state.days.length) say("Não há horário livre nesta janela. Fale pelo WhatsApp que a gente acha outro dia.");
    const grid = document.createElement("div");
    grid.className = "cv-grid";
    state.days.forEach((day) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = prettyDate(day.date);
      b.onclick = () => { state.date = day.date; say(prettyDate(day.date), "me"); state.step = 4; draw(); };
      grid.appendChild(b);
    });
    actions().appendChild(grid);
    button("Voltar", () => { state.step = 2; draw(); });
  }
  function times() {
    const day = state.days.find((d) => d.date === state.date) || { times: [] };
    say("E qual horário funciona melhor? Só aparecem horários ainda livres.");
    const grid = document.createElement("div");
    grid.className = "cv-grid";
    day.times.forEach((time) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = time;
      b.onclick = () => reserve(time, b);
      grid.appendChild(b);
    });
    actions().appendChild(grid);
    button("Voltar", () => { state.step = 3; draw(); });
  }
  async function reserve(time, buttonEl) {
    if (state.busy) return;
    state.busy = true;
    buttonEl.disabled = true;
    try {
      const data = await api({ action: "hold", service: state.service, objective: state.intent, date: state.date, start_time: time });
      state.time = time;
      state.id = data.id;
      state.code = data.access_code;
      state.cents = data.cents || 4500;
      sessionStorage.setItem("akashaConversa", JSON.stringify({ id: state.id, code: state.code, email: "" }));
      say(time, "me");
      state.step = 5;
      draw();
    } catch (e) {
      say("Esse horário acabou de ser reservado por outra pessoa. Escolhe outro.");
      await loadDays();
    } finally { state.busy = false; }
  }
  function notice() {
    say("Perfeito. Antes de confirmar, preciso te informar uma coisa.");
    say("É uma sessão individual de 15 minutos, gravada com sua autorização, na qual o mentor utiliza a leitura da conversa para escolher a melhor ferramenta para aquele momento: diagnóstico, mapa mental, alinhamento ou direcionamento do próximo passo.");
    say("Você não precisa chegar sabendo exatamente o que precisa. A dinâmica da sessão permite identificar o ponto principal e escolher a melhor forma de trabalhar aquilo nos minutos disponíveis.");
    const price = document.createElement("p");
    price.className = "cv-price";
    price.textContent = "Investimento: " + reais(state.cents);
    actions().appendChild(price);
    const note = document.createElement("p");
    note.className = "cv-note";
    note.textContent = "Você investe " + reais(state.cents) + " pela reserva do horário e pelo tempo do mentor. Depois da sessão, a gravação fica disponível para você. Reembolso incondicional em até 48 horas após o pagamento. Quando fizer sentido continuar, esse valor pode ser considerado numa mentoria elegível. Não é desconto automático.";
    actions().appendChild(note);
    const check = document.createElement("label");
    check.className = "cv-check";
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = state.consent;
    box.onchange = () => { state.consent = box.checked; };
    check.appendChild(box);
    check.appendChild(document.createTextNode(" Estou ciente e autorizo a gravação da sessão."));
    actions().appendChild(check);
    button("Continuar", () => {
      if (!state.consent) { say("A gravação precisa da sua autorização para a sessão seguir."); return; }
      state.step = 6;
      draw();
    }, true);
    button("Voltar", () => { state.step = 4; draw(); });
  }
  function contact() {
    say("Como você prefere ser chamado, e por onde a sessão acontece?");
    field("Nome", "cvName").value = state.name;
    field("WhatsApp", "cvPhone", "tel").value = state.phone;
    field("E-mail", "cvEmail", "email").value = state.email;
    const select = document.createElement("select");
    select.id = "cvChannel";
    [["whatsapp-audio", "WhatsApp áudio"], ["whatsapp-video", "WhatsApp vídeo"], ["zoom", "Zoom"], ["meet", "Google Meet"]].forEach((pair) => {
      const o = document.createElement("option");
      o.value = pair[0];
      o.textContent = pair[1];
      if (pair[0] === state.channel) o.selected = true;
      select.appendChild(o);
    });
    const wrap = document.createElement("label");
    wrap.className = "cv-field";
    wrap.textContent = "Canal";
    wrap.appendChild(select);
    actions().appendChild(wrap);
    button("Seguir para a confirmação", saveDetails, true);
    button("Voltar", () => { state.step = 5; draw(); });
  }
  async function saveDetails() {
    state.name = document.getElementById("cvName").value.trim();
    state.phone = document.getElementById("cvPhone").value.trim();
    state.email = document.getElementById("cvEmail").value.trim();
    state.channel = document.getElementById("cvChannel").value;
    try {
      await api({
        action: "details", id: state.id, access_code: state.code,
        name: state.name, phone: state.phone, email: state.email,
        channel: state.channel, objective: state.intent, recording_consent: true
      });
      sessionStorage.setItem("akashaConversa", JSON.stringify({ id: state.id, code: state.code, email: state.email }));
      state.step = 7;
      draw();
    } catch (e) {
      const map = { contact: "Confere nome, WhatsApp e e-mail.", consent: "A autorização da gravação é obrigatória.", expired: "O horário expirou. Escolhe outro.", closed: "Esse horário não está mais em aberto." };
      say(map[e.message] || "Não consegui guardar agora. Tenta de novo.");
    }
  }
  function pay() {
    say("Como você prefere confirmar?");
    button("Pagar online · cartão ou Pix", payOnline, true);
    button("Falar com o Akasha Hub no WhatsApp", () => { track("whatsapp_selected"); openWhatsapp(); });
    button("Pagar diretamente com o mentor", () => { track("manual_payment_selected"); openWhatsapp("Quero pagar diretamente com o mentor."); });
    const note = document.createElement("p");
    note.className = "cv-note";
    note.textContent = "Pagar online segura o horário. WhatsApp e pagamento com o mentor não confirmam sozinhos: alguém da casa registra depois. O valor de " + reais(state.cents) + " é definido no servidor, não nesta tela.";
    actions().appendChild(note);
    const mine = document.createElement("button");
    mine.type = "button";
    mine.textContent = "Meu agendamento";
    mine.onclick = () => { location.href = "/converse/"; };
    actions().appendChild(mine);
  }
  async function payOnline() {
    try {
      const data = await api({ action: "checkout", id: state.id, access_code: state.code });
      if (!data.url) throw new Error("url");
      location.href = data.url;
    } catch (e) {
      say(e.message === "stripe_not_configured" || e.message === "supabase_not_configured"
        ? "O pagamento online ainda não está ligado nesta conta. Dá para seguir pelo WhatsApp sem marcar o horário como pago."
        : "O checkout não abriu. O horário continua reservado por alguns minutos, ou você fala pelo WhatsApp.");
      button("Falar pelo WhatsApp", openWhatsapp);
    }
  }
  function openWhatsapp(extra) {
    const text = [
      "Olá, Akasha Hub. Quero uma sessão de 15 minutos.",
      "Caminho: " + (labels[state.service] || ""),
      "Busca: " + (state.intent || ""),
      state.date ? "Data: " + state.date : "",
      state.time ? "Horário: " + state.time : "",
      state.name ? "Nome: " + state.name : "",
      state.phone ? "WhatsApp: " + state.phone : "",
      state.email ? "E-mail: " + state.email : "",
      state.channel ? "Canal: " + state.channel : "",
      extra || ""
    ].filter(Boolean).join("\n");
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(text), "_blank", "noopener");
  }
  function prettyDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", timeZone: "UTC" });
  }

  document.addEventListener("click", (e) => {
    const hit = e.target.closest && e.target.closest("[data-converse-open]");
    if (!hit) return;
    e.preventDefault();
    open();
  });
  window.akashaConversa = { open, close };
})();
