import { useState, type FormEvent } from "react";
import { hashPin, useMentorGate } from "@/lib/mentor-gate";
import { Button } from "@/components/ui/button";

const inputClass =
  "h-12 w-full rounded-md bg-raised px-3.5 text-sm tracking-[0.18em] text-fg outline-none placeholder:tracking-normal placeholder:text-subtle focus-visible:shadow-[0_0_0_1px_rgba(197,208,203,0.4)]";

export function MentorLock() {
  const pinHash = useMentorGate((s) => s.pinHash);
  const setPin = useMentorGate((s) => s.setPin);
  const unlock = useMentorGate((s) => s.unlock);
  const clearPin = useMentorGate((s) => s.clearPin);
  const setup = !pinHash;

  const [pin, setPinValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const code = pin.trim();
    if (code.length < 4) {
      setError("Mínimo de 4 caracteres.");
      return;
    }
    setBusy(true);
    try {
      const hash = await hashPin(code);
      if (setup) {
        if (code !== confirm.trim()) {
          setError("Os dois códigos não conferem.");
          return;
        }
        setPin(hash);
        unlock();
        return;
      }
      if (hash !== pinHash) {
        setError("Código não confere.");
        return;
      }
      unlock();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg px-5 text-fg">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm"
        autoComplete="off"
      >
        <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-muted">
          AF Plataforma · sessão do mentor
        </p>
        <h1 className="font-display text-4xl leading-none">Mentor</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {setup
            ? "Defina um código. Sem ele, a mesa não abre na AF."
            : "Só o mentor. Nada da call aparece sem o código."}
        </p>

        <label className="mt-8 block">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
            {setup ? "Novo código" : "Código"}
          </span>
          <input
            suppressHydrationWarning
            type="password"
            value={pin}
            onChange={(e) => setPinValue(e.target.value)}
            className={inputClass}
            autoFocus
            autoComplete="off"
            name="mentor-code"
          />
        </label>

        {setup ? (
          <label className="mt-4 block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted">
              Confirmar
            </span>
            <input
              suppressHydrationWarning
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
              autoComplete="off"
              name="mentor-code-confirm"
            />
          </label>
        ) : null}

        {error ? (
          <p className="mt-3 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="mt-6 w-full" disabled={busy}>
          {setup ? "Guardar e entrar" : "Entrar"}
        </Button>
        {!setup ? (
          <button
            type="button"
            className="mt-4 w-full text-center text-[12px] text-subtle hover:text-muted"
            onClick={() => {
              setPinValue("");
              setConfirm("");
              setError("");
              clearPin();
            }}
          >
            Redefinir código
          </button>
        ) : null}
      </form>
    </div>
  );
}
