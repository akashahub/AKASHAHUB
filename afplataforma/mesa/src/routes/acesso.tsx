import { createFileRoute } from "@tanstack/react-router";
import { SHOW_AFTER, SHOW_BEFORE } from "@/data/convergencia";
import { FRANCESCA } from "@/data/francesca";
import { SectionHead } from "@/components/section-head";
import { Panel } from "@/components/panel";
import { CopyLine } from "@/components/copy-line";

export const Route = createFileRoute("/acesso")({ component: AcessoPage });

function AcessoPage() {
  return (
    <div>
      <SectionHead
        kicker="Antes e depois do Pix"
        title="Abrir a casa na medida do compromisso."
        lede="Call atual: visão, algumas provas, diagnóstico. Entrada: reciprocidade. Depois: arquitetura proporcional."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <p className="text-[11px] uppercase tracking-[0.16em] text-ok">Mostrar agora</p>
          <h2 className="mt-1 font-display text-3xl">Antes</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed">
            {SHOW_BEFORE.map((s) => (
              <li key={s} className="rounded-md bg-raised px-3 py-2">
                {s}
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Uma ou duas telas da AF — não o login dela.</li>
            <li>A cadeia Essência → Legado em voz alta.</li>
            <li>Quem você é nesta mesa: arquiteto, não pedinte.</li>
          </ul>
        </Panel>
        <Panel>
          <p className="text-[11px] uppercase tracking-[0.16em] text-danger">Travar</p>
          <h2 className="mt-1 font-display text-3xl">Depois</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
            {SHOW_AFTER.map((s) => (
              <li key={s} className="rounded-md bg-raised px-3 py-2">
                {s}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <h2 className="mb-4 mt-10 font-display text-3xl">Dossiê Francesca</h2>
      <Panel>
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{FRANCESCA.role}</p>
        <h3 className="mt-1 font-display text-3xl">{FRANCESCA.name}</h3>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
          {FRANCESCA.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </Panel>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {FRANCESCA.ecosystems.map((e) => (
          <Panel key={e.name}>
            <h3 className="font-display text-2xl">{e.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{e.body}</p>
          </Panel>
        ))}
      </div>

      <Panel className="mt-6">
        <h2 className="mb-3 font-display text-2xl">Postura na mesa</h2>
        <div className="divide-y divide-border">
          {FRANCESCA.posture.map((p) => (
            <CopyLine key={p} text={p} />
          ))}
        </div>
      </Panel>
    </div>
  );
}
