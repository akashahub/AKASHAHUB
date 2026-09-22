/* Caixa Rápido entra no Mesa como um deal. Não mexe no dossiê da Francesca. */
(function () {
  if (typeof DEALS !== "undefined") {
    DEALS.push({
      id: "vilas",
      name: "Vilas",
      person: "Caixa Rápido · Legado",
      range: "Diagnóstico → ciclo",
      status: "ativa",
      blurb: "Comércios de Vilas. Portas quentes: Se Plante e Lounge. Oferta clara. Porta a porta.",
      tags: ["Legado", "Vilas", "Caixa"]
    });
  }
})();

function renderCaixaVilas() {
  return `
    ${typeof head === "function" ? head("Caixa rápido · não é a call da Francesca", "Vilas. Porta. Legado.", "Mapa dos comércios. Oferta que uma criança entende. O quadro vive neste deal.") : ""}
    <section class="panel">
      <p class="muted">O quadro da rua está no Caixa Rápido: mapa, status, fala de 90 segundos, modo mostrar ao dono. Francesca, Zé e Artur continuam nos outros deals.</p>
      <p class="muted" style="margin-top:8px">Hoje na rua: Se Plante Dispensário (demo pronto) e Lounge Vilas (camada, não substituição). Recorte de ciclo, nunca 50% off.</p>
      <p style="margin-top:12px" class="row">
        <a class="btn btn-primary" href="/caixa-rapido/">Abrir o quadro da rua</a>
        <a class="btn" href="/caixa-rapido/seplante/index.html">Demo Se Plante</a>
        <a class="btn" href="/caixa-rapido/lounge/index.html">Camada Lounge</a>
      </p>
    </section>
    <iframe title="Caixa Rápido Vilas" src="/caixa-rapido/index.html" style="width:100%;height:78vh;border:1px solid var(--border);margin-top:16px;background:#0b0c0c"></iframe>
  `;
}
