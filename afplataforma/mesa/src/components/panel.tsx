import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-xl bg-surface shadow-[var(--shadow-border)]",
        pad && "p-5 md:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}
