import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CopyLine({
  text,
  className,
  italic,
}: {
  text: string;
  className?: string;
  italic?: boolean;
}) {
  const [ok, setOk] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      toast("Frase copiada");
      setTimeout(() => setOk(false), 1400);
    } catch {
      toast("Não foi possível copiar");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "group flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-150 hover:bg-raised",
        className,
      )}
    >
      <span
        className={cn(
          "mt-0.5 min-w-0 flex-1 text-[15px] leading-snug text-fg/90",
          italic && "font-display text-lg italic",
        )}
      >
        {text}
      </span>
      <span className="mt-0.5 text-muted opacity-0 transition-opacity group-hover:opacity-100">
        {ok ? <Check className="size-3.5 text-ok" /> : <Copy className="size-3.5" />}
      </span>
    </button>
  );
}
