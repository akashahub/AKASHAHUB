(function () {
  const KEY = "circuito.v01";
  const TENANT = { id: "amsterdam-san", house: "Amsterdam / San Sebastian", owner: "Ze Augusto" };
  const ROUTES = ["casa", "lives", "circuito", "feed", "bau"];
  const BALIZAS = [
    { id: "b1", title: "Porta", job: "5s da fila. Energia de quem acabou de entrar." },
    { id: "b2", title: "Pista", job: "Video curto no drop. Sem tela preta." },
    { id: "b3", title: "Bar", job: "Foto do drink com a luz da casa." },
    { id: "b4", title: "Camarote", job: "Encontre alguem e some os QRs." },
    { id: "b5", title: "Back", job: "Spoiler de 10s. Sem flash no artista." },
    { id: "b6", title: "After", job: "Um still do fim. Nostalgia ja na noite." }
  ];
  const FEED = [
    { who: "Livia", txt: "Pista 02:14" },
    { who: "Rafa", txt: "Bar premium" },
    { who: "Nalu", txt: "Camarote leste" },
    { who: "Theo", txt: "Drop do guest" }
  ];

  function load() {
    try { return Object.assign({ done: {}, pts: 120, route: "gate", role: "guest" }, JSON.parse(localStorage.getItem(KEY) || "null") || {}); }
    catch (e) { return { done: {}, pts: 120, route: "gate", role: "guest" }; }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
  let S = load();

  function esc(t) {
    return String(t || "").split("&").join("&").split("<").join("<").split('"').join(""");
  }
  function go(r) { S.route = r; save(S); draw(); }
  function toast(t) {
    const e = document.createElement("div");
    e.style.cssText = "position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#2a1510;border:1px solid #e8c37a55;color:#f6efe6;padding:10px 14px;border-radius:999px;z-index:40;font-size:13px";
    e.textContent = t;
    document.body.appendChild(e);
    setTimeout(function () { e.remove(); }, 1800);
  }

  function shell(inner) {
    const dock = S.route === "gate" || S.route === "qg" ? "" :
      '<nav class="dock">' + ROUTES.map(function (r) {
        return '<button class="' + (S.route === r ? "on" : "") + '" data-go="' + r + '">' + r + '</button>';
      }).join("") + '</nav>';
    return '<div class="wrap"><div class="top"><div class="brand"><i class="mark"></i><div><b>CIRCUITO</b><div class="mute">' + esc(TENANT.house) + '</div></div></div><span class="chip">demo</span></div>' + inner + dock + '</div>';
  }

  function viewGate() {
    return '<section class="wrap hero"><p class="k">casa de festa · nao e app de ingresso</p><h1>Quem nao veio<br/>ainda esta na casa.</h1><p class="lead">Passaporte digital, bau da reliquia, live de palco e de camarim, circuito de balizas e uma carteira que devolve o que a ficha nao bebeu.</p><p class="mute">Primeira pele: Amsterdam e San Sebastian. A proxima pode ser Warung, Green Valley, Pacha.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:22px"><button class="btn" data-go="casa">Entrar na casa</button><button class="btn ghost" data-go="qg">QG da moderacao</button></div></section>';
  }

  function viewCasa() {
    return shell(
      '<p class="k">esta noite</p><h1>San Sebastian<br/>abre o circuito.</h1><p class="lead">Quem esta na pista joga. Quem ficou em casa compra o passaporte e assiste palco + backstage. O UGC aprovado vira o feed da marca.</p>' +
      '<div class="duo"><div class="stage"><span class="tag">ao vivo</span><iframe src="https://www.youtube.com/embed/jNQXAC9IVRw?autoplay=0" allow="autoplay;encrypted-media" allowfullscreen></iframe></div>' +
      '<div class="mini"><p class="k">spoiler camarim</p><div class="cd">04:12</div><p class="mute">X manda recado. 10 minutos.</p><button class="btn rose" data-go="lives">Abrir lives</button></div></div>' +
      '<div class="card row"><div><b>Passaporte digital</b><p class="mute">Multicamera para quem nao embarcou.</p></div><button class="btn ghost" id="pass">ativar demo</button></div>' +
      '<div class="card row"><div><b>Carteira</b><p class="mute">' + S.pts + ' pts</p></div><span class="wallet">' + S.pts + '</span></div>'
    );
  }

  function viewLives() {
    return shell(
      '<p class="k">transmissao</p><h1>Duas salas.<br/>Uma ansiedade.</h1>' +
      '<div class="stage"><span class="tag">palco</span><iframe src="https://www.youtube.com/embed/jNQXAC9IVRw" allow="autoplay;encrypted-media" allowfullscreen></iframe></div>' +
      '<div class="card"><div class="row"><div><p class="k">backstage</p><h2>Spoiler no camarim</h2><p class="mute">Nao e o show. E o recado.</p></div><div class="cd">live</div></div><button class="btn" id="join">Pedir token LiveKit</button><div id="box" class="mute" style="margin-top:8px">Worker do Hub. Sala circuito-demo.</div></div>'
    );
  }

  function viewCircuito() {
    const n = BALIZAS.filter(function (b) { return S.done[b.id]; }).length;
    return shell(
      '<p class="k">orientacao da noite</p><h1>Seis balizas.<br/>Um premio.</h1><p class="lead">Nao e corrida de rua. E roteiro. Escaneia, sobe foto ou video de 5s, o QG aprova.</p>' +
      '<p class="mute">' + n + '/6 no aparelho</p>' +
      '<div class="grid3">' + BALIZAS.map(function (b) {
        const on = S.done[b.id];
        return '<article class="baliza' + (on ? ' on' : '') + '"><b>0' + b.id.slice(1) + '</b><strong>' + esc(b.title) + '</strong><p class="mute">' + esc(b.job) + '</p>' +
          (on ? '<span class="chip">ok</span>' : '<button class="btn ghost" data-baliza="' + b.id + '">cumprir</button>') + '</article>';
      }).join('') + '</div>' +
      (n >= 6 ? '<div class="card"><h2>Circuito fechado.</h2><p class="lead">VIP relampago nesta demo.</p></div>' : '')
    );
  }

  function viewFeed() {
    return shell(
      '<p class="k">moments</p><h1>A festa posta<br/>para a casa.</h1>' +
      '<div class="feed">' + FEED.map(function (f) {
        return '<div class="shot"><div><b>' + esc(f.who) + '</b><div class="mute">' + esc(f.txt) + '</div></div></div>';
      }).join('') + '</div>'
    );
  }

  function viewBau() {
    return shell(
      '<p class="k">reliquia</p><h1>O aftermovie<br/>nao some.</h1>' +
      '<article class="card"><p class="k">2019 · San Sebastian</p><h2>Aftermovie oficial</h2><div class="stage"><iframe src="https://www.youtube.com/embed/jNQXAC9IVRw" allowfullscreen></iframe></div></article>'
    );
  }

  function viewQg() {
    return shell(
      '<p class="k">qg · 2 notebooks</p><h1>Tinder da noite.</h1>' +
      '<div class="qg"><div class="swipe"><p class="k">fila</p><h2>Pista · 5s</h2><p class="mute">Livia · baliza 02</p><div style="display:flex;gap:8px"><button class="btn rose" id="no">rejeitar</button><button class="btn" id="yes">aprovar</button></div></div>' +
      '<div class="card"><b>Regra da noite</b><p class="mute">QR lido. Arquivo enviado. Moderador humano.</p><button class="btn ghost" data-go="casa">voltar a casa</button></div></div>'
    );
  }

  function draw() {
    const root = document.getElementById("app");
    const map = { gate: viewGate, casa: viewCasa, lives: viewLives, circuito: viewCircuito, feed: viewFeed, bau: viewBau, qg: viewQg };
    root.innerHTML = (map[S.route] || viewGate)();
    root.querySelectorAll("[data-go]").forEach(function (b) {
      b.onclick = function () { go(b.getAttribute("data-go")); };
    });
    root.querySelectorAll("[data-baliza]").forEach(function (b) {
      b.onclick = function () {
        S.done[b.getAttribute("data-baliza")] = true;
        S.pts += 40;
        save(S);
        toast("Baliza cumprida · +40");
        draw();
      };
    });
    const pass = document.getElementById("pass");
    if (pass) pass.onclick = function () { toast("Passaporte demo ativo"); };
    const yes = document.getElementById("yes");
    if (yes) yes.onclick = function () { toast("No feed da casa"); };
    const no = document.getElementById("no");
    if (no) no.onclick = function () { toast("Manda de novo"); };
    const join = document.getElementById("join");
    if (join) join.onclick = async function () {
      const box = document.getElementById("box");
      try {
        const res = await fetch("https://akasha.yanfili-simon.workers.dev", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ identity: "circuito-" + Date.now().toString(36), room: "circuito-demo", name: "Pista" })
        });
        const data = await res.json();
        box.textContent = data.token ? "Token ok." : ("Worker: " + (data.error || "sem token"));
      } catch (e) {
        box.textContent = "Worker offline nesta sessao. A tela ja esta no lugar.";
      }
    };
  }

  draw();
})();
