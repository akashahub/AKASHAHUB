export function SectionHead({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="mb-8 max-w-3xl">
      <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-muted">{kicker}</p>
      <h1 className="font-display text-4xl leading-[1.05] md:text-5xl">{title}</h1>
      {lede ? <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{lede}</p> : null}
    </header>
  );
}
