import { createFileRoute } from "@tanstack/react-router";
import {
  CONVERGENCIA_ONE_LINER,
  ENGINEERING_ORDER,
  JOURNEY,
  LOCKED,
  OPEN_WITH_HER,
  SHOW_AFTER,
  SHOW_BEFORE,
  TICKETS,
  V1_DOD,
} from "@/data/convergencia";
import { SectionHead } from "@/components/section-head";
import { Panel } from "@/components/panel";
import { CopyLine } from "@/components/copy-line";

export const Route = createFileRoute("/convergencia")({ component: ConvPage });

function ConvPage() {
  return (
    <div>
      <SectionHead
        kicker="Convergência"
        title="Não resumir a evento."
        lede={CONVERGENCIA_ONE_LINER}
      />

      <Panel className="mb-6">
        <CopyLine text={CONVERGENCIA_ONE_LINER} italic />
      </Panel>

      <h2 className="mb-4 font-display text-3xl">DNA que não muda</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {LOCKED.map((l, i) => (
          <Panel key={l.title}>
            <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 font-display text-2xl leading-tight">{l.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{l.body}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-3 font-display text-2xl">Pode cocriar com ela</h2>
          <ul className="space-y-2 text-sm">
            {OPEN_WITH_HER.map((o) => (
              <li key={o} className="rounded-md bg-raised px-3 py-2">
                {o}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h2 className="mb-3 font-display text-2xl">Ordem de engenharia</h2>
          <ol className="space-y-2">
            {ENGINEERING_ORDER.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-sm">
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted">
            Primeiro o videogame. Depois o mundo físico. Não contratar audiovisual de nove salas sem organismo.
          </p>
        </Panel>
      </div>

      <h2 className="mb-4 mt-10 font-display text-3xl">Jornada</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {JOURNEY.map((j) => (
          <Panel key={j.act}>
            <h3 className="font-display text-2xl">{j.act}</h3>
            <p className="mt-2 text-sm text-muted">{j.body}</p>
          </Panel>
        ))}
      </div>

      <h2 className="mb-4 mt-10 font-display text-3xl">Ingressos</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {TICKETS.map((t) => (
          <Panel key={t.name}>
            <h3 className="font-display text-2xl">{t.name}</h3>
            <p className="mt-2 text-sm text-muted">{t.body}</p>
          </Panel>
        ))}
      </div>

      <Panel className="mt-8">
        <h2 className="mb-3 font-display text-3xl">V1 · Definition of Done</h2>
        <p className="mb-4 max-w-2xl text-sm text-muted">
          R$ 7–17 mil compra esta obra. Não compra “tudo que surgir até o ano que vem”. Feature nova = nova construção.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {V1_DOD.map((d) => (
            <li key={d} className="rounded-md bg-raised px-3 py-2 text-sm">
              {d}
            </li>
          ))}
        </ul>
      </Panel>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-3 font-display text-2xl">Antes do pagamento</h2>
          <ul className="space-y-2 text-sm text-muted">
            {SHOW_BEFORE.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h2 className="mb-3 font-display text-2xl">Só depois do compromisso</h2>
          <ul className="space-y-2 text-sm text-danger">
            {SHOW_AFTER.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
