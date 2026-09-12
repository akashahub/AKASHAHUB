import { createFileRoute } from "@tanstack/react-router";
import { OBJECOES } from "@/data/objecoes";
import { SectionHead } from "@/components/section-head";
import { Panel } from "@/components/panel";
import { CopyLine } from "@/components/copy-line";

export const Route = createFileRoute("/objecoes")({ component: ObjPage });

function ObjPage() {
  return (
    <div>
      <SectionHead
        kicker="PIT invertido · quebrar antes do preço"
        title="O que ela pode dizer."
        lede="Não argumentar. Devolver clareza. Preferir recorte de escopo a desconto."
      />
      <div className="space-y-4">
        {OBJECOES.map((o, i) => (
          <Panel key={o.id}>
            <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-1 font-display text-3xl leading-tight">{o.title}</h2>
            <p className="mt-2 font-display text-lg italic text-muted">“{o.hear}”</p>
            <div className="mt-4 divide-y divide-border rounded-lg bg-raised">
              {o.break.map((b) => (
                <CopyLine key={b} text={b} italic />
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
