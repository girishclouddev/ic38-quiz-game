export default function ProgressBar({ value, max }) {
  const pct = max ? Math.round((value / max) * 100) : 0;

  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

