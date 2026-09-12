import { createFileRoute, Link } from "@tanstack/react-router";
import { AF_ENTRY, AF_HEADLINE, AF_MODULES, AF_PLATFORM, AF_PROCESS, AF_SHOW_ON_CALL } from "@/data/af";
import { SectionHead } from "@/components/section-head";
import { Panel } from "@/components/panel";
import { CopyLine } from "@/components/copy-line";
import { formatBRL } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/af")({ component: AfPage });

function AfPage() {
  return (
    <div>
      <SectionHead
        kicker="Alinhamento Financeiro · plataforma viva"
        title="A prova de que o método mora em sistema."
        lede={AF_HEADLINE}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="md:col-span-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Porta de entrada</p>
          <h2 className="mt-2 font-display text-3xl leading-tight">{AF_ENTRY.name}</h2>
          <p className="mt-2 text-sm text-muted">{AF_ENTRY.duration}</p>
          <p className="mt-4 font-display text-4xl">{formatBRL(AF_ENTRY.price)}</p>
          <p className="mt-3 text-sm leading-relaxed text-accent">{AF_ENTRY.rule}</p>
        </Panel>
        <Panel className="md:col-span-2">
          <h2 className="mb-3 font-display text-2xl">O que a sessão entrega</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {AF_ENTRY.includes.map((i) => (
              <li key={i} className="rounded-md bg-raised px-3 py-2 text-sm">
                {i}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {AF_PROCESS.map((p) => (
          <Panel key={p.n}>
            <p className="font-mono text-xs text-accent">{p.n}</p>
            <h3 className="mt-1 font-display text-2xl">{p.title}</h3>
            <p className="mt-2 text-sm text-muted">{p.body}</p>
          </Panel>
        ))}
      </div>

      <h2 className="mb-4 mt-10 font-display text-3xl">Sete módulos. Uma governança.</h2>
      <div className="space-y-3">
        {AF_MODULES.map((m) => (
          <Panel key={m.n}>
            <div className="grid gap-4 md:grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,1fr)] md:items-start">
              <div>
                <p className="font-mono text-xs text-accent">{m.n}</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{m.axis}</p>
                <h3 className="font-display text-2xl leading-tight">{m.title}</h3>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-danger">Vazamento</p>
                <p className="mt-1 text-sm leading-relaxed">{m.leak}</p>
                <p className="mt-2 text-sm text-muted">{m.body}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Para a Francesca</p>
                <p className="mt-1 text-sm leading-relaxed">{m.forFran}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-3 font-display text-2xl">AF Plataforma</h2>
          <p className="mb-3 text-sm leading-relaxed text-muted">{AF_PLATFORM.promise}</p>
          <Button asChild size="sm" className="mb-4">
            <Link to="/afplataforma">Abrir a plataforma viva</Link>
          </Button>
          <div className="mb-4 flex flex-wrap gap-2">
            {AF_PLATFORM.nav.map((n) => (
              <span key={n} className="rounded-full bg-raised px-3 py-1 text-[12px] uppercase tracking-[0.12em] text-muted">
                {n}
              </span>
            ))}
          </div>
          <ul className="space-y-1.5 text-sm text-fg/90">
            {AF_PLATFORM.extras.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h2 className="mb-3 font-display text-2xl">Mostrar na call · não o mapa inteiro</h2>
          <div className="divide-y divide-border">
            {AF_SHOW_ON_CALL.map((s) => (
              <CopyLine key={s} text={s} />
            ))}
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-danger">Isto o AF não vende</p>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {AF_PLATFORM.not.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
