import { createFileRoute } from "@tanstack/react-router";
import { ABOVE_17, FAIXAS, SMART_MONEY_LANG, faixaFor } from "@/data/faixas";
import { SectionHead } from "@/components/section-head";
import { Panel } from "@/components/panel";
import { useCallStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faixas")({ component: FaixasPage });

function FaixasPage() {
  const namedValue = useCallStore((s) => s.namedValue);
  const setNamedValue = useCallStore((s) => s.setNamedValue);
  const current = faixaFor(namedValue);

  return (
    <div>
      <SectionHead
        kicker="Interno · nunca ler em voz alta como tabela"
        title="O número compra responsabilidade."
        lede="R$ 3 mil não é R$ 17 mil de obra. Descubra o nível. Depois case com o recorte. Não anuncie o piso."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {FAIXAS.map((f) => {
          const active = current?.id === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setNamedValue(f.max === 17000 ? 12000 : f.min || 350)}
              className="text-left"
            >
              <Panel
                className={cn(
                  "h-full transition-shadow",
                  active && "shadow-[0_0_0_1px_rgba(197,208,203,0.45)]",
                )}
              >
                <p className="font-mono text-xs text-accent">{f.range}</p>
                <h2 className="mt-1 font-display text-3xl leading-tight">{f.name}</h2>
                <p className="mt-2 text-sm text-muted">{f.done}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-ok">Abre</p>
                    <ul className="space-y-1 text-sm">
                      {f.opens.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-danger">Não abre</p>
                    <ul className="space-y-1 text-sm text-muted">
                      {f.closed.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Panel>
            </button>
          );
        })}
      </div>

      <Panel className="mt-6">
        <h2 className="font-display text-2xl">{ABOVE_17.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{ABOVE_17.body}</p>
      </Panel>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel>
          <h2 className="font-display text-2xl">Linguagem</h2>
          <p className="mt-2 text-sm text-muted">Interno: {SMART_MONEY_LANG.internal}</p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-accent">Para ela</p>
          <ul className="mt-1 space-y-1 text-sm">
            {SMART_MONEY_LANG.external.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h2 className="font-display text-2xl">Por quê</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{SMART_MONEY_LANG.why}</p>
        </Panel>
      </div>
    </div>
  );
}
