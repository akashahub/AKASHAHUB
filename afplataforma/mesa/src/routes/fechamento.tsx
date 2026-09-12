import { createFileRoute } from "@tanstack/react-router";
import { IGOR_PRINCIPLES, IF_SHE_ASKS_PRICE, SEQUENCE, PIT_RECOVERY } from "@/data/igor";
import { SectionHead } from "@/components/section-head";
import { Panel } from "@/components/panel";
import { CopyLine } from "@/components/copy-line";
import { useCallStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/fechamento")({ component: FechamentoPage });

function FechamentoPage() {
  const pit = useCallStore((s) => s.pit);
  const setPit = useCallStore((s) => s.setPit);

  return (
    <div>
      <SectionHead
        kicker="Gestão do mentor · Igor Mello"
        title="Engenharia da mesa."
        lede="Não reinventar o comercial. Adaptar: diagnóstico profundo, PIT invertido, fechar na reunião, sem follow-up morno."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {IGOR_PRINCIPLES.map((p) => (
          <Panel key={p.title}>
            <h2 className="font-display text-2xl leading-tight">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
          </Panel>
        ))}
      </div>

      <Panel className="mt-6">
        <h2 className="mb-4 font-display text-3xl">Sequência desta call</h2>
        <ol className="flex flex-wrap gap-2">
          {SEQUENCE.map((s, i) => (
            <li
              key={s}
              className="rounded-full bg-raised px-3 py-1.5 text-[12px] uppercase tracking-[0.12em] text-muted"
            >
              <span className="mr-1.5 font-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>
      </Panel>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-3 font-display text-3xl">Se ela pergunta o preço</h2>
          <CopyLine text={IF_SHE_ASKS_PRICE} italic />
          <p className="mt-3 text-sm text-muted">
            Depois definir o nível. O fechamento ideal não é “vendi uma mentoria”. É “decidimos transformar conexão em execução”.
          </p>
        </Panel>
        <Panel>
          <h2 className="mb-3 font-display text-3xl">PIT agora · {pit}</h2>
          <div className="grid grid-cols-11 gap-1">
            {Array.from({ length: 11 }, (_, n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPit(n)}
                className={cn(
                  "flex h-10 items-center justify-center rounded-sm font-mono text-xs",
                  pit === n ? "bg-accent text-accent-fg" : "bg-raised text-muted",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed">{PIT_RECOVERY[pit] ?? PIT_RECOVERY[0]}</p>
        </Panel>
      </div>
    </div>
  );
}
