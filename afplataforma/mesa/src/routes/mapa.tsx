import { createFileRoute } from "@tanstack/react-router";
import { FILA_GRAVACAO, MAPA_BRANCHES, MAPA_CHAIN } from "@/data/mapa";
import { FRANCESCA } from "@/data/francesca";
import { SectionHead } from "@/components/section-head";
import { Panel } from "@/components/panel";
import { CopyLine } from "@/components/copy-line";

export const Route = createFileRoute("/mapa")({ component: MapaPage });

function MapaPage() {
  return (
    <div>
      <SectionHead
        kicker="Mapa Mãe · Akasha Hub"
        title="Dois minutos. Não é catálogo."
        lede="Essência vira código, código vira método, método vira marca, marca vira produto, produto vira sistema, sistema vira legado."
      />

      <ol className="mb-8 flex flex-wrap gap-2">
        {MAPA_CHAIN.map((c, i) => (
          <li key={c} className="flex items-center gap-2">
            <span className="rounded-full bg-surface px-3 py-1.5 font-display text-lg">{c}</span>
            {i < MAPA_CHAIN.length - 1 ? <span className="text-subtle">→</span> : null}
          </li>
        ))}
      </ol>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {MAPA_BRANCHES.map((b) => (
          <Panel key={b.id}>
            <p className="font-mono text-xs text-accent">{b.id}</p>
            <h2 className="mt-1 font-display text-2xl leading-tight">{b.title}</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {b.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      <h2 className="mb-4 mt-10 font-display text-3xl">Fila de gravação</h2>
      <div className="grid gap-3 md:grid-cols-5">
        {FILA_GRAVACAO.map((f) => (
          <Panel key={f.fase}>
            <p className="font-mono text-xs text-accent">Fase {f.fase}</p>
            <h3 className="mt-1 font-display text-xl leading-tight">{f.title}</h3>
            <p className="mt-2 text-sm text-muted">{f.body}</p>
          </Panel>
        ))}
      </div>

      <h2 className="mb-4 mt-10 font-display text-3xl">Sobreposição com ela</h2>
      <div className="space-y-2">
        {FRANCESCA.overlap.map((o) => (
          <Panel key={o.her} className="grid gap-2 md:grid-cols-2">
            <p className="text-sm">
              <span className="block text-[11px] uppercase tracking-[0.16em] text-muted">Dela</span>
              {o.her}
            </p>
            <p className="text-sm">
              <span className="block text-[11px] uppercase tracking-[0.16em] text-accent">Sua</span>
              {o.you}
            </p>
          </Panel>
        ))}
      </div>

      <Panel className="mt-8">
        <h2 className="mb-3 font-display text-2xl">Frase de dois minutos</h2>
        <CopyLine
          italic
          text="Eu não vendo curso. Eu transformo essência em código, código em método, método em sistema — e o sistema é o que continua quando eu não estou na sala."
        />
      </Panel>
    </div>
  );
}
