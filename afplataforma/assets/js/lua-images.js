/* Catálogo central da Lua. Troca o arquivo aqui, não caça path no HTML. */
window.LUA_IMAGES = {
  geral: [
    "assets/img/lua/geral/lua-geral-01.webp",
    "assets/img/lua/geral/lua-geral-02.webp",
    "assets/img/lua/geral/lua-geral-03.webp"
  ],
  hero: [
    "assets/img/lua/hero/lua-hero-03.webp",
    "assets/img/lua/hero/lua-hero-01.webp",
    "assets/img/lua/hero/lua-hero-04.webp",
    "assets/img/lua/hero/lua-hero-02.webp"
  ],
  dados: [
    "assets/img/lua/dados/lua-dados-01.webp",
    "assets/img/lua/dados/lua-dados-02.webp"
  ],
  estrategia: ["assets/img/lua/estrategia/lua-estrategia-01.webp"],
  leitura: [
    "assets/img/lua/leitura/lua-leitura-01.webp",
    "assets/img/lua/leitura/lua-leitura-03.webp"
  ],
  intuicao: ["assets/img/lua/intuicao/lua-intuicao-01.webp"],
  atencao: [
    "assets/img/lua/atencao/lua-atencao-01.webp",
    "assets/img/lua/atencao/lua-atencao-02.webp"
  ],
  sensualidade: ["assets/img/lua/sensualidade/lua-sensualidade-01.webp"],
  carao: [
    "assets/img/lua/carao/lua-carao-02.webp",
    "assets/img/lua/carao/lua-carao-03.webp",
    "assets/img/lua/carao/lua-carao-01.webp"
  ],
  macro: ["assets/img/lua/macro/lua-macro-rosto-01.webp"],
  rosto: [
    "assets/img/lua/rosto/lua-rosto-01.webp",
    "assets/img/lua/rosto/lua-rosto-02.webp"
  ],
  corpo: [
    "assets/img/lua/corpo/lua-corpo-01.webp",
    "assets/img/lua/corpo/lua-corpo-02.webp"
  ],
  perfil: ["assets/img/lua/perfil/lua-perfil-01.webp"],
  ferramentas: ["assets/img/lua/ferramentas/lua-ferramentas-01.webp"],
  dashboard: ["assets/img/lua/dashboard/lua-dashboard-01.webp"],
  referencias: [
    "assets/img/lua/referencias/lua-ref-master.webp",
    "assets/img/lua/referencias/lua-ref-rosto-01.webp",
    "assets/img/lua/referencias/lua-ref-presenca-01.webp",
    "assets/img/lua/referencias/lua-ref-corpo-01.webp"
  ]
};

window.luaImg = function luaImg(cat, i) {
  var pack = (window.LUA_IMAGES && window.LUA_IMAGES[cat]) || [];
  if (!pack.length) return "";
  var n = (i == null ? 0 : i) % pack.length;
  return pack[n];
};
