// Fundo de partículas: um único sistema de pontos em WebGL que se transforma
// entre formas (poeira, esfera, onda, anel, texto) conforme a rolagem.
// Cada <section data-forma="..."> diz qual forma vale quando ela está no meio da tela.

const VERTICE = `
attribute vec3 aPoeira;
attribute vec3 aEsfera;
attribute vec3 aOnda;
attribute vec3 aAnel;
attribute vec3 aTexto;
attribute vec4 aSorte;

uniform float uTempo;
uniform float uAspecto;
uniform float uPixel;
uniform float uTamanho;
uniform vec4 uPeso;       // poeira, esfera, onda, anel
uniform float uPesoTexto;
uniform float uDobra;     // quanto a poeira já "viajou" em z
uniform vec2 uMouse;
uniform float uForca;
uniform float uRaio;
uniform float uEscalaTexto;
uniform float uTextoY;

varying float vAlfa;
varying float vDestaque;

vec3 girarY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
vec3 girarX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }

void main() {
  float t = uTempo;
  float fase = aSorte.z * 6.2831;

  // Poeira: flutua devagar e corre em z quando a página rola (passa por você e volta do fundo).
  vec3 po = aPoeira;
  po.x *= uAspecto;
  po.xy += 0.03 * vec2(sin(t * 0.2 * aSorte.w + fase), cos(t * 0.16 * aSorte.w + fase * 1.3));
  po.z = mod(po.z + 1.0 - uDobra * (0.6 + aSorte.w), 2.6) - 1.0;

  vec3 es = girarX(girarY(aEsfera, t * 0.14), 0.32) * uRaio;

  vec3 on = aOnda;
  on.x *= uAspecto * 1.1;
  on.y += 0.08 * sin(on.x * 2.4 + t * 0.8) * cos(on.z * 3.0 + t * 0.55);

  vec3 an = girarY(girarX(aAnel, 1.15), t * 0.22) * uRaio * 1.15;

  vec3 tx = aTexto * uEscalaTexto;
  tx.y += uTextoY; // acima do meio: o título da seção fica embaixo, legível
  tx.z += 0.05 * sin(t * 0.9 + fase);

  vec3 p = po * uPeso.x + es * uPeso.y + on * uPeso.z + an * uPeso.w + tx * uPesoTexto;

  // No meio da troca de forma os pontos se soltam: parece matéria se reorganizando.
  float firme = max(max(max(uPeso.x, uPeso.y), max(uPeso.z, uPeso.w)), uPesoTexto);
  float caos = (1.0 - firme) * 1.2;
  p += caos * 0.3 * vec3(sin(fase * 7.0 + t * 0.6), cos(fase * 5.0 + t * 0.5), sin(fase * 3.0 + t * 0.4));

  float k = 1.0 / max(0.25, 1.0 + 0.55 * p.z);
  vec2 tela = p.xy * k;

  // Mouse: empurra os pontos próximos para fora e faz um leve redemoinho.
  vec2 rel = tela - uMouse;
  float dist = length(rel);
  float f = uForca * smoothstep(0.32, 0.0, dist);
  vec2 dir = dist > 0.0001 ? rel / dist : vec2(0.0);
  tela += dir * f * 0.12 + vec2(-dir.y, dir.x) * f * 0.05;

  gl_Position = vec4(tela.x / uAspecto, tela.y, 0.0, 1.0);
  gl_PointSize = uTamanho * uPixel * (0.45 + aSorte.x * 1.1) * k * (1.0 + f * 1.5);

  vDestaque = step(aSorte.y, 0.22);
  float brilho = 0.7 + 0.3 * sin(t * (0.7 + aSorte.w * 1.3) + fase);
  vAlfa = brilho * clamp(k, 0.35, 1.4) * (0.5 + aSorte.x * 0.6) * (1.0 + f * 1.4);
}`;

const FRAGMENTO = `
precision mediump float;
varying float vAlfa;
varying float vDestaque;
uniform vec3 uCor;
uniform vec3 uCorDestaque;
uniform float uAlfa;
void main() {
  float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
  a *= a * vAlfa * uAlfa;
  gl_FragColor = vec4(mix(uCor, uCorDestaque, vDestaque) * a, a);
}`;

const FORMAS = ['poeira', 'esfera', 'onda', 'anel', 'texto'];

function gerarFormas(n) {
  const poeira = new Float32Array(3 * n), esfera = new Float32Array(3 * n);
  const onda = new Float32Array(3 * n), anel = new Float32Array(3 * n), sorte = new Float32Array(4 * n);
  const ouro = Math.PI * (3 - Math.sqrt(5));
  const colunas = Math.ceil(Math.sqrt(2.4 * n)), linhas = Math.ceil(n / colunas);
  for (let i = 0; i < n; i++) {
    poeira.set([(Math.random() * 2 - 1) * 1.15, (Math.random() * 2 - 1) * 1.15, Math.random() * 2.6 - 1], 3 * i);

    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), a = ouro * i, j = 0.98 + Math.random() * 0.04;
    esfera.set([Math.cos(a) * r * j, y * j, Math.sin(a) * r * j], 3 * i);

    const c = i % colunas, l = Math.floor(i / colunas);
    onda.set([(c / (colunas - 1)) * 2 - 1, -0.42 + (Math.random() - 0.5) * 0.01, (l / Math.max(1, linhas - 1)) * 1.9 - 0.5], 3 * i);

    const u = Math.random() * 6.2831, v = Math.random() * 6.2831, R = 0.55, rr = 0.17 * Math.sqrt(Math.random());
    anel.set([(R + rr * Math.cos(v)) * Math.cos(u), rr * Math.sin(v), (R + rr * Math.cos(v)) * Math.sin(u)], 3 * i);

    sorte.set([Math.random(), Math.random(), Math.random(), 0.5 + Math.random()], 4 * i);
  }
  return { poeira, esfera, onda, anel, sorte };
}

function amostrarTexto(texto, n, fonte) {
  const L = 600, A = 240, cv = document.createElement('canvas');
  cv.width = L; cv.height = A;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let tam = 210;
  do { ctx.font = `800 ${tam}px ${fonte}`; tam -= 10; } while (ctx.measureText(texto).width > L * 0.92 && tam > 40);
  ctx.fillText(texto, L / 2, A / 2 + 8);
  const px = ctx.getImageData(0, 0, L, A).data, pontos = [];
  for (let y = 0; y < A; y += 2) for (let x = 0; x < L; x += 2) if (px[(y * L + x) * 4 + 3] > 128) pontos.push(x, y);
  const saida = new Float32Array(3 * n), total = pontos.length / 2;
  if (!total) return saida;
  for (let i = 0; i < n; i++) {
    const k = 2 * Math.floor(Math.random() * total);
    saida.set([((pontos[k] + Math.random() * 2) / L - 0.5) * 2, (0.5 - (pontos[k + 1] + Math.random() * 2) / A) * 2 * (A / L), (Math.random() - 0.5) * 0.08], 3 * i);
  }
  return saida;
}

// Forma a partir de uma imagem (logo em PNG/SVG com fundo transparente): cada ponto cai num pixel visível
function amostrarImagem(img, n) {
  const L = 600, cv = document.createElement('canvas');
  cv.width = cv.height = L;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const w = img.naturalWidth || 300, h = img.naturalHeight || 300, esc = (L * 0.92) / Math.max(w, h);
  ctx.drawImage(img, (L - w * esc) / 2, (L - h * esc) / 2, w * esc, h * esc);
  const px = ctx.getImageData(0, 0, L, L).data, pontos = [];
  for (let y = 0; y < L; y += 2) for (let x = 0; x < L; x += 2) if (px[(y * L + x) * 4 + 3] > 128) pontos.push(x, y);
  const saida = new Float32Array(3 * n), total = pontos.length / 2;
  if (!total) return saida;
  for (let i = 0; i < n; i++) {
    const k = 2 * Math.floor(Math.random() * total);
    saida.set([((pontos[k] + Math.random() * 2) / L - 0.5) * 1.6, (0.5 - (pontos[k + 1] + Math.random() * 2) / L) * 1.6, (Math.random() - 0.5) * 0.08], 3 * i);
  }
  return saida;
}

export function iniciarParticulas(canvas, opcoes = {}) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
  if (!gl) { canvas.style.display = 'none'; return null; }
  const fonte = opcoes.fonte ?? 'sans-serif';
  const parado = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const n = innerWidth < 760 ? 6000 : 14000;

  const compilar = (tipo, fonteGlsl) => {
    const s = gl.createShader(tipo);
    gl.shaderSource(s, fonteGlsl);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compilar(gl.VERTEX_SHADER, VERTICE));
  gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, FRAGMENTO));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buffer = (nome, dados, tam) => {
    const loc = gl.getAttribLocation(prog, nome), b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, dados, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, tam, gl.FLOAT, false, 0, 0);
    return b;
  };
  const f = gerarFormas(n);
  buffer('aPoeira', f.poeira, 3);
  buffer('aEsfera', f.esfera, 3);
  buffer('aOnda', f.onda, 3);
  buffer('aAnel', f.anel, 3);
  buffer('aSorte', f.sorte, 4);
  const bufTexto = buffer('aTexto', f.esfera, 3);

  const U = {};
  for (const nome of ['uTempo', 'uAspecto', 'uPixel', 'uTamanho', 'uPeso', 'uPesoTexto', 'uDobra', 'uMouse', 'uForca', 'uRaio', 'uEscalaTexto', 'uTextoY', 'uCor', 'uCorDestaque', 'uAlfa']) U[nome] = gl.getUniformLocation(prog, nome);
  gl.uniform3fv(U.uCor, opcoes.cor ?? [0.949, 0.945, 0.925]);
  gl.uniform3fv(U.uCorDestaque, opcoes.destaque ?? [0.29, 0.48, 1.0] /* #4A7BFF */);
  gl.uniform1f(U.uTamanho, opcoes.tamanho ?? 3.2);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE); // somar luz: onde junta ponto, brilha mais
  gl.clearColor(0, 0, 0, 0);

  let aspecto = 1;
  const ajustar = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const caixa = canvas.getBoundingClientRect();
    canvas.width = Math.round(caixa.width * dpr);
    canvas.height = Math.round(caixa.height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspecto = caixa.width / caixa.height;
    gl.uniform1f(U.uAspecto, aspecto);
    gl.uniform1f(U.uPixel, dpr);
    gl.uniform1f(U.uRaio, Math.min(0.62, aspecto * 0.72));
    gl.uniform1f(U.uEscalaTexto, Math.min(0.95, aspecto * 0.85));
    gl.uniform1f(U.uTextoY, aspecto < 1 ? 0.5 : 0.26); // celular em pé: texto de partículas mais alto
  };
  ajustar();
  addEventListener('resize', ajustar);

  // O anel do mouse fica mesmo com o cursor parado; só some quando o cursor sai da janela.
  const mouse = { x: 0, y: 0, alvoX: 0, alvoY: 0, forca: 0, dentro: false };
  addEventListener('pointermove', (e) => {
    const caixa = canvas.getBoundingClientRect();
    mouse.alvoX = ((e.clientX - caixa.left) / caixa.width * 2 - 1) * aspecto;
    mouse.alvoY = -((e.clientY - caixa.top) / caixa.height * 2 - 1);
    if (!mouse.dentro) { mouse.x = mouse.alvoX; mouse.y = mouse.alvoY; }
    mouse.dentro = true;
  }, { passive: true });
  document.addEventListener('pointerout', (e) => { if (!e.relatedTarget) mouse.dentro = false; });
  addEventListener('blur', () => { mouse.dentro = false; });

  const secoes = [...document.querySelectorAll('[data-forma]')];
  // data-imagem="logo.png" numa seção com data-forma="texto": os pontos montam a imagem em vez de um texto
  const imagens = {};
  for (const s of secoes) {
    const url = s.dataset.imagem;
    if (!url || url in imagens) continue;
    imagens[url] = null;
    const img = new Image();
    img.onload = () => { imagens[url] = amostrarImagem(img, n); };
    img.src = url;
  }
  const alfaBase = opcoes.alfa ?? 0.85;
  const estado = { pesos: [1, 0, 0, 0, 0], alfa: alfaBase, texto: null, pendente: null, dobra: 0, velocidade: 0, ultimoScroll: scrollY };

  const alvos = () => {
    const alvo = [0, 0, 0, 0, 0], meio = innerHeight / 2;
    let turbo = 0, alfa = 0, pesoAlfa = 0;
    for (const s of secoes) {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - meio) / (Math.max(r.height, innerHeight) * 0.7);
      const w = Math.max(0, 1 - d) ** 2;
      if (!w) continue;
      let i = FORMAS.indexOf(s.dataset.forma);
      const formaTexto = s.dataset.imagem ? `img:${s.dataset.imagem}` : s.dataset.texto;
      if (i === 4 && formaTexto !== estado.texto) { i = 0; estado.pendente = formaTexto; } // forma nova: dispersa antes
      alvo[Math.max(0, i)] += w;
      if (s.dataset.turbo !== undefined) turbo += w;
      alfa += w * (s.dataset.alfa !== undefined ? Number(s.dataset.alfa) : 1); // data-alfa: densidade visível da seção
      pesoAlfa += w;
    }
    const soma = alvo.reduce((a, b) => a + b, 0) || 1;
    if (soma === 1 && !alvo.some(Boolean)) alvo[0] = 1;
    return { alvo: alvo.map((v) => v / soma), turbo, alfa: alfaBase * (pesoAlfa ? alfa / pesoAlfa : 1) };
  };

  let visivel = true;
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }).observe(canvas);
  const quadro = (ms) => {
    if (!visivel) { requestAnimationFrame(quadro); return; }
    const t = parado ? 0 : ms / 1000;
    const { alvo, turbo, alfa } = alvos();
    for (let i = 0; i < 5; i++) estado.pesos[i] += (alvo[i] - estado.pesos[i]) * 0.06;
    estado.alfa += (alfa - estado.alfa) * 0.06;

    if (estado.pendente && estado.pesos[4] < 0.05) {
      const k = estado.pendente;
      const dados = k.startsWith('img:') ? imagens[k.slice(4)] : amostrarTexto(k, n, fonte); // imagem ainda carregando: espera
      if (dados) {
        gl.bindBuffer(gl.ARRAY_BUFFER, bufTexto);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, dados);
        estado.texto = k;
        estado.pendente = null;
      }
    }

    const dy = scrollY - estado.ultimoScroll;
    estado.ultimoScroll = scrollY;
    estado.velocidade += (Math.abs(dy) * 0.0009 * (1 + turbo * 2.5) - estado.velocidade) * 0.1;
    if (!parado) estado.dobra += estado.velocidade + 0.0005;

    // Atraso do anel: segue o cursor devagar, deixando rastro quando ele corre.
    mouse.x += (mouse.alvoX - mouse.x) * 0.07;
    mouse.y += (mouse.alvoY - mouse.y) * 0.07;
    mouse.forca += ((mouse.dentro ? 1 : 0) - mouse.forca) * 0.06;

    gl.uniform1f(U.uAlfa, estado.alfa);
    gl.uniform1f(U.uTempo, t);
    gl.uniform4f(U.uPeso, estado.pesos[0], estado.pesos[1], estado.pesos[2], estado.pesos[3]);
    gl.uniform1f(U.uPesoTexto, estado.pesos[4]);
    gl.uniform1f(U.uDobra, estado.dobra);
    gl.uniform2f(U.uMouse, mouse.x, mouse.y);
    gl.uniform1f(U.uForca, mouse.forca);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
    requestAnimationFrame(quadro);
  };
  requestAnimationFrame(quadro);
  return { n, estado };
}
