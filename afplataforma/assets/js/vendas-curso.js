const DOCS = {
  plano: "/afplataforma/interno/vendas/plano-producao.html",
  mapa: "/afplataforma/interno/vendas/mapa-mental.svg",
  teleprompter: "/afplataforma/interno/vendas/teleprompters.html",
  livro: "/members/livros/arte-da-conquista.html"
};

export function renderVendasCurso() {
  return `
  <div class="view active">
    <div class="back-link" data-nav="mentor">← Gestão do mentor</div>
    <p class="hero-line">Projeto editorial e comercial · Hórus</p>
    <h2 class="hero-title">A Arte da Conquista</h2>
    <p class="hero-sub">Curso de vendas ensinado pela analogia dos encontros: do primeiro contato à entrega, retenção e continuidade.</p>
    <div class="grid-2" style="margin-top:22px">
      <section class="panel">
        <h3 class="section-h">Plano de produção</h3>
        <p>Livro ilustrado + mini curso + slides + mapas mentais + estratégia comercial.</p>
        <p style="margin-top:12px"><a class="tool-btn" href="${DOCS.plano}" target="_blank" rel="noopener">Abrir plano de produção</a></p>
      </section>
      <section class="panel">
        <h3 class="section-h">Mapa mental</h3>
        <p>Visão geral do processo, das etapas de aquisição à continuidade da relação comercial.</p>
        <p style="margin-top:12px"><a class="tool-btn" href="${DOCS.mapa}" target="_blank" rel="noopener">Abrir mapa mental ilustrado</a></p>
      </section>
      <section class="panel">
        <h3 class="section-h">Teleprompters</h3>
        <p>Rascunhos iniciais das cinco aulas, prontos para revisão e gravação posterior.</p>
        <p style="margin-top:12px"><a class="tool-btn" href="${DOCS.teleprompter}" target="_blank" rel="noopener">Abrir roteiros das aulas</a></p>
      </section>
      <section class="panel">
        <h3 class="section-h">Livro do curso</h3>
        <p>Versão inicial ilustrável, com capítulos, exemplos, exercícios e mapa de continuidade. Pode ser impressa ou salva como PDF pelo navegador.</p>
        <p style="margin-top:12px"><a class="tool-btn" href="${DOCS.livro}" target="_blank" rel="noopener">Abrir livro em desenvolvimento</a></p>
      </section>
    </div>
    <section class="panel" style="margin-top:22px">
      <h3 class="section-h">Decisões atuais</h3>
      <ul style="line-height:1.9;padding-left:20px;color:var(--muted)">
        <li>Formato inicial: cinco aulas de 3 a 6 minutos, sujeito a validação.</li>
        <li>Produto: livro ilustrado + mini curso + slides + mapas e ferramentas.</li>
        <li>Preço de R$ 700: hipótese para testar, não preço publicado.</li>
        <li>Área de membros: Hórus, com curso e livro listados como materiais em desenvolvimento.</li>
        <li>Ética: uma objeção comercial pode ser esclarecida; uma recusa pessoal deve ser respeitada.</li>
      </ul>
    </section>
  </div>`;
}
