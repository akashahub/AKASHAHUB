import { ENTRADA_ACTS, FECHAMENTO_ACTS } from "@/data/acts";
import { CADERNO } from "@/data/caderno";
import { FAIXAS, faixaFor, formatHint } from "@/data/faixas";
import { PIT_RECOVERY } from "@/data/igor";
import { FRANCESCA } from "@/data/francesca";
import { useCallStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { CopyLine } from "@/components/copy-line";
import { CallClock } from "@/components/call-clock";
import { Panel } from "@/components/panel";
import { cn, formatBRL, formatElapsed } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";


export function MesaCockpit() {
  const mode = useCallStore((s) => s.mode);
  const setMode = useCallStore((s) => s.setMode);
  const actIndex = useCallStore((s) => s.actIndex);
  const setAct = useCallStore((s) => s.setAct);
  const pit = useCallStore((s) => s.pit);
  const setPit = useCallStore((s) => s.setPit);
  const namedValue = useCallStore((s) => s.namedValue);
  const setNamedValue = useCallStore((s) => s.setNamedValue);
  const notes = useCallStore((s) => s.notes);
  const setNotes = useCallStore((s) => s.setNotes);
  const energy = useCallStore((s) => s.energy);
  const setEnergy = useCallStore((s) => s.setEnergy);
  const closed = useCallStore((s) => s.closed);
  const setClosed = useCallStore((s) => s.setClosed);
  const cadernoDone = useCallStore((s) => s.cadernoDone);
  const toggleCaderno = useCallStore((s) => s.toggleCaderno);
  const resetCall = useCallStore((s) => s.resetCall);
  const elapsed = useCallStore((s) => s.elapsed);

  const acts = mode === "fechamento" ? FECHAMENTO_ACTS : ENTRADA_ACTS;
  const act = acts[Math.min(actIndex, acts.length - 1)]!;
  const faixa = faixaFor(namedValue);
  const doneCount = CADERNO.filter((c) => cadernoDone[c.id]).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-[0.22em] text-muted">
            Cockpit privado · não compartilhar tela
          </p>
          <h1 className="font-display text-4xl leading-none md:text-5xl">
            {mode === "fechamento" ? "Call de fechamento" : "Call de entrada"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            {mode === "fechamento"
              ? "Peer para peer. Diagnóstico → PIT → obra. Ela não é mentoranda."
              : "Sessão de Alinhamento, 1h30. Continuidade só se fizer sentido."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-sm tabular-nums text-muted">{formatElapsed(elapsed)}</span>
          <CallClock />
          <Button
            variant={mode === "fechamento" ? "primary" : "outline"}
            size="sm"
            onClick={() => setMode("fechamento")}
          >
            Fechamento
          </Button>
          <Button
            variant={mode === "entrada" ? "primary" : "outline"}
            size="sm"
            onClick={() => setMode("entrada")}
          >
            Entrada · R$ 350
          </Button>
          <Button variant="ghost" size="sm" onClick={resetCall}>
            Resetar mesa
          </Button>
        </div>
      </div>

      <ol className="flex gap-1 overflow-x-auto pb-1">
        {acts.map((a, i) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => setAct(i)}
              className={cn(
                "flex h-11 min-w-[7.5rem] flex-col justify-center rounded-md px-3 text-left transition-colors duration-150",
                i === actIndex ? "bg-accent text-accent-fg" : "bg-surface text-muted hover:text-fg",
              )}
            >
              <span className="font-mono text-[10px] tabular-nums opacity-70">
                {String(a.n).padStart(2, "0")} · {a.minutes}
              </span>
              <span className="text-[13px] font-medium leading-tight">{a.label}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <div className="space-y-4">
          <Panel>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  Ato {act.n} · {act.minutes}
                </p>
                <h2 className="mt-1 font-display text-3xl">{act.label}</h2>
                <p className="mt-1 text-sm text-accent">{act.intent}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={actIndex === 0}
                  onClick={() => setAct(Math.max(0, actIndex - 1))}
                  aria-label="Ato anterior"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={actIndex >= acts.length - 1}
                  onClick={() => setAct(Math.min(acts.length - 1, actIndex + 1))}
                  aria-label="Próximo ato"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted">Falar</p>
            <div className="divide-y divide-border">
              {act.script.map((line) => (
                <CopyLine key={line} text={line} italic />
              ))}
            </div>

            <p className="mb-2 mt-6 text-[11px] uppercase tracking-[0.18em] text-muted">
              Perguntar · e calar
            </p>
            <div className="space-y-1">
              {act.questions.map((q) => (
                <CopyLine key={q} text={q} />
              ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-raised p-4">
                <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-danger">Não fazer</p>
                <ul className="space-y-1.5 text-sm text-muted">
                  {act.never.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-raised p-4">
                <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-warn">Se esfriar</p>
                <p className="text-sm leading-relaxed text-fg/90">{act.nextIfCold}</p>
              </div>
            </div>
          </Panel>

          <Panel pad={false}>
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="text-sm font-medium">Caderno · {doneCount}/20</h3>
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted">riscar</span>
            </div>
            <ol className="max-h-[22rem] overflow-y-auto p-2">
              {CADERNO.map((item) => {
                const on = !!cadernoDone[item.id];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggleCaderno(item.id)}
                      className="flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left hover:bg-raised"
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-[5px] border",
                          on ? "border-ok bg-ok text-bg" : "border-border",
                        )}
                      >
                        {on ? <Check className="size-3" strokeWidth={3} /> : null}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block text-sm font-medium",
                            on && "text-muted line-through",
                          )}
                        >
                          {item.n}. {item.title}
                        </span>
                        <span className="block text-[13px] leading-snug text-muted">
                          {item.speak}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel>
            <h3 className="mb-3 text-sm font-medium">PIT 01 · 0 a 10</h3>
            <div className="grid grid-cols-11 gap-1">
              {Array.from({ length: 11 }, (_, n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPit(n)}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-sm font-mono text-xs tabular-nums transition-colors",
                    pit === n
                      ? n >= 10
                        ? "bg-ok text-bg"
                        : n >= 8
                          ? "bg-warn text-bg"
                          : "bg-accent text-accent-fg"
                      : "bg-raised text-muted hover:text-fg",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-fg/90">
              {PIT_RECOVERY[pit] ?? PIT_RECOVERY[0]}
            </p>
            {pit < 10 ? (
              <p className="mt-2 text-[12px] uppercase tracking-[0.14em] text-danger">
                Não apresentar solução
              </p>
            ) : (
              <p className="mt-2 text-[12px] uppercase tracking-[0.14em] text-ok">
                Autorizado a avançar
              </p>
            )}
          </Panel>

          <Panel>
            <h3 className="mb-3 text-sm font-medium">Recurso nomeado</h3>
            <p className="mb-3 text-[13px] text-muted">
              Ela fala o número. Você não fala o piso. Digite o que ela disser.
            </p>
            <div className="flex flex-wrap gap-2">
              {[350, 2000, 5000, 7000, 10000, 15000, 17000].map((v) => (
                <Button
                  key={v}
                  size="sm"
                  variant={namedValue === v ? "primary" : "outline"}
                  onClick={() => setNamedValue(v)}
                >
                  {formatBRL(v)}
                </Button>
              ))}
              <Button size="sm" variant="ghost" onClick={() => setNamedValue(null)}>
                Limpar
              </Button>
            </div>
            {faixa ? (
              <div className="mt-4 rounded-lg bg-raised p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
                  {faixa.range} · {faixa.name}
                </p>
                <p className="mt-1 font-display text-2xl">{faixa.done}</p>
                <p className="mt-2 text-sm text-muted">Abre: {faixa.opens[0]}</p>
                <p className="text-sm text-danger">Não abre: {faixa.closed[0]}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">{formatHint()}</p>
            )}
          </Panel>

          <Panel>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">Energia na mesa</h3>
              <div className="flex gap-1">
                {(["baixa", "media", "alta"] as const).map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEnergy(e)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.12em]",
                      energy === e ? "bg-accent text-accent-fg" : "bg-raised text-muted",
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            {energy === "baixa" ? (
              <p className="text-sm text-danger">
                Sem energia, não apresenta produto. Devolver o diagnóstico. Pedir presença.
              </p>
            ) : (
              <p className="text-sm text-muted">
                Decisão é emocional. Manter silêncio depois da pergunta de recurso.
              </p>
            )}
            <Button
              className="mt-4 w-full"
              variant={closed ? "primary" : "outline"}
              onClick={() => setClosed(!closed)}
            >
              {closed ? "Marcada como fechada" : "Marcar fechamento"}
            </Button>
          </Panel>

          <Panel>
            <h3 className="mb-2 text-sm font-medium">Bloco de notas da call</h3>
            <textarea
              suppressHydrationWarning
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gargalo dela, palavras que ela usou, número, papel que ela se deu…"
              className="min-h-36 w-full resize-y rounded-lg bg-raised px-3 py-2.5 text-sm leading-relaxed text-fg outline-none ring-0 placeholder:text-subtle focus-visible:shadow-[0_0_0_1px_rgba(197,208,203,0.4)]"
            />
          </Panel>

          <Panel>
            <h3 className="mb-3 text-sm font-medium">Lembrar quem ela é</h3>
            <ul className="space-y-2 text-[13px] leading-snug text-muted">
              {FRANCESCA.posture.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <h3 className="mb-2 text-sm font-medium">Faixas internas</h3>
            <ul className="space-y-2">
              {FAIXAS.map((f) => (
                <li key={f.id} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-muted">{f.name}</span>
                  <span className="font-mono text-[12px] tabular-nums text-fg">{f.range}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
