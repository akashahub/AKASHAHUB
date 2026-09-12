import { createFileRoute } from "@tanstack/react-router";
import { CADERNO, STORY_CUT, STORY_KEEP } from "@/data/caderno";
import { useCallStore } from "@/lib/store";
import { SectionHead } from "@/components/section-head";
import { Panel } from "@/components/panel";
import { CopyLine } from "@/components/copy-line";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const Route = createFileRoute("/caderno")({ component: CadernoPage });

function CadernoPage() {
  const cadernoDone = useCallStore((s) => s.cadernoDone);
  const toggleCaderno = useCallStore((s) => s.toggleCaderno);
  const done = CADERNO.filter((c) => cadernoDone[c.id]).length;

  return (
    <div>
      <SectionHead
        kicker="Folha de caderno"
        title="Vinte pontos. Riscar na call."
        lede={`Ordem fixa. ${done} de 20 riscados. História serve à tese — não ao documentário.`}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ol className="space-y-2">
          {CADERNO.map((item) => {
            const on = !!cadernoDone[item.id];
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggleCaderno(item.id)}
                  className={cn(
                    "flex w-full items-start gap-4 rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-colors hover:bg-raised md:p-5",
                    on && "opacity-60",
                  )}
                >
                  <span className="font-display text-2xl text-muted tabular-nums">
                    {String(item.n).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "grid size-5 place-items-center rounded-[5px] border",
                          on ? "border-ok bg-ok text-bg" : "border-border",
                        )}
                      >
                        {on ? <Check className="size-3" strokeWidth={3} /> : null}
                      </span>
                      <span className={cn("font-medium", on && "line-through")}>
                        {item.title}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">
                      {item.speak}
                    </span>
                    {item.note ? (
                      <span className="mt-1 block text-[12px] uppercase tracking-[0.12em] text-accent">
                        {item.note}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="space-y-4">
          <Panel>
            <h2 className="mb-3 font-display text-2xl">Contar</h2>
            <div className="divide-y divide-border">
              {STORY_KEEP.map((s) => (
                <CopyLine key={s} text={s} />
              ))}
            </div>
          </Panel>
          <Panel>
            <h2 className="mb-3 font-display text-2xl">Cortar</h2>
            <ul className="space-y-2 text-sm leading-relaxed text-danger">
              {STORY_CUT.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
