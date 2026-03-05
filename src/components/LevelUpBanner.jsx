export default function LevelUpBanner({ show, message = "Level Up!" }) {
  if (!show) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-emerald-300 to-cyan-300 text-slate-900 p-4 shadow-xl motion-safe:animate-pop">
      <div className="flex items-start gap-3">
        <div className="shrink-0 text-2xl leading-none" aria-hidden="true">
          ⭐
        </div>
        <div className="min-w-0">
          <div className="text-base font-extrabold">{message}</div>
          <div className="mt-0.5 text-sm font-semibold">
            70%+ score achieved — keep going.
          </div>
        </div>
      </div>
    </div>
  );
}

