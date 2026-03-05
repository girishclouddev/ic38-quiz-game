export default function StreakBadge({ streak }) {
  if (streak < 3) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-rose-400 text-slate-900 px-3 py-1.5 text-sm font-semibold shadow motion-safe:animate-wiggle">
      <span aria-hidden="true">🔥</span>
      <span>{streak} correct in a row</span>
    </div>
  );
}

