import { createFileRoute } from "@tanstack/react-router";
import { ASCENSAO_INTRO, ASCENSAO_TRACK, D30, D90, H72, IF_NO_CLOSE } from "@/data/ascensao";
import { AF_ENTRY } from "@/data/af";
import { SectionHead } from "@/components/section-head";
import { Panel } from "@/components/panel";
import { formatBRL } from "@/lib/utils";

export const Route = createFileRoute("/ascensao")({ component: AscPage });

function AscPage() {
  return (
    <div>
      <SectionHead
        kicker="Roteiro da Ascensão"
        title="Se ela fecha, ela também sobe."
        lede={ASCENSAO_INTRO}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {H72.map((h) => (
          <Panel key={h.t}>
            <p className="font-mono text-xs text-accent">{h.t}</p>
            <h2 className="mt-1 font-display text-2xl">{h.title}</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {h.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="font-display text-2xl">30 dias</h2>
          <ol className="mt-3 space-y-2">
            {D30.map((d, i) => (
              <li key={d} className="flex gap-3 text-sm">
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                {d}
              </li>
            ))}
          </ol>
        </Panel>
        <Panel>
          <h2 className="font-display text-2xl">90 dias</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {D90.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <h2 className="mb-4 mt-10 font-display text-3xl">Os 7 vetores nela</h2>
      <div className="space-y-2">
        {ASCENSAO_TRACK.map((t) => (
          <Panel key={t.n} className="md:flex md:items-baseline md:gap-6">
            <p className="font-mono text-xs text-accent">{t.n}</p>
            <h3 className="font-display text-2xl md:w-36">{t.title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted md:mt-0">{t.hers}</p>
          </Panel>
        ))}
      </div>

      <Panel className="mt-8">
        <h2 className="font-display text-2xl">{IF_NO_CLOSE.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{IF_NO_CLOSE.body}</p>
        <p className="mt-3 font-display text-2xl">
          {AF_ENTRY.name} · {formatBRL(AF_ENTRY.price)}
        </p>
      </Panel>
    </div>
  );
}
