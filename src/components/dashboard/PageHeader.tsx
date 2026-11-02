export function DashboardPageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-line/70 pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.02] tracking-[-0.045em]">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
