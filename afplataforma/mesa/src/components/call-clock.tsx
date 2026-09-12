import { useCallStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";

export function CallClock() {
  const startedAt = useCallStore((s) => s.startedAt);
  const startTimer = useCallStore((s) => s.startTimer);
  const resetTimer = useCallStore((s) => s.resetTimer);

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="size-9"
        aria-label={startedAt ? "Pausar" : "Iniciar cronômetro"}
        onClick={() => {
          if (startedAt) {
            useCallStore.setState({ startedAt: null });
          } else {
            startTimer();
          }
        }}
      >
        {startedAt ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-9"
        aria-label="Zerar"
        onClick={resetTimer}
      >
        <RotateCcw className="size-3.5" />
      </Button>
    </div>
  );
}
