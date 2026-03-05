export default function LandingScreen({
  level,
  totalLevels,
  totalStars,
  bestScore,
  totalQuizzesPlayed,
  theme,
  onStart,
  onJumpToLevel,
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between max-w-md md:max-w-lg mx-auto px-4 py-6">
      <div>
        <div className="rounded-2xl bg-slate-900/70 shadow-lg backdrop-blur p-5 border border-slate-800/60 overflow-hidden">
          <div
            className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${
              theme?.primaryGradient || "from-cyan-400 via-sky-400 to-indigo-500"
            } opacity-90`}
          />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${
                  theme?.primaryGradient || "from-cyan-400 to-indigo-500"
                } text-slate-900 flex items-center justify-center text-2xl shadow-lg motion-safe:animate-pop`}
                aria-hidden="true"
              >
                ⚡
              </div>
              <div>
                <div className="text-3xl font-extrabold tracking-tight">
                  IC-38 Power Play
                </div>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-900/60 px-2 py-0.5 text-[11px] text-slate-300 border border-slate-700/70">
                  <span className="text-[10px]">🎮</span>
                  <span>Gamified LIC Agent prep</span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-300">
              દરરોજ રમો, streak બનાવો, અને IC‑38 માં confidence જીતો.
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div
                className={`rounded-xl border border-slate-800/60 p-3 ${
                  theme?.chipBg || "bg-sky-500/10"
                }`}
              >
                <div className="text-xs text-slate-400">Level</div>
                <div className="mt-1 text-lg font-semibold">
                  {level}
                  {totalLevels ? (
                    <span className="text-xs text-slate-400">/{totalLevels}</span>
                  ) : null}
                </div>
              </div>
              <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3">
                <div className="text-xs text-slate-400">Best</div>
                <div className="mt-1 text-lg font-semibold">{bestScore}</div>
              </div>
              <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3">
                <div className="text-xs text-slate-400">Stars</div>
                <div className="mt-1 text-lg font-semibold">{totalStars}</div>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-400">
              Quizzes played: <span className="text-slate-200">{totalQuizzesPlayed}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-900/50 shadow-lg backdrop-blur p-4 border border-slate-800/60">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Choose Level</div>
            <div className="text-xs text-slate-400">10 questions per level</div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onJumpToLevel(Math.max(1, level - 1))}
              className="min-h-12 w-14 rounded-xl bg-slate-800 hover:bg-slate-700 transition active:scale-[0.99]"
              aria-label="Previous level"
            >
              ‹
            </button>
            <div className="flex-1 rounded-xl bg-slate-950/40 border border-slate-800/60 px-4 py-3">
              <div className="text-xs text-slate-400">Current</div>
              <div className="text-base font-semibold">Level {level}</div>
            </div>
            <button
              type="button"
              onClick={() => onJumpToLevel(level + 1)}
              disabled={!!totalLevels && level >= totalLevels}
              className="min-h-12 w-14 rounded-xl bg-slate-800 hover:bg-slate-700 transition active:scale-[0.99] disabled:opacity-50 disabled:hover:bg-slate-800"
              aria-label="Next level"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={onStart}
          className={`w-full min-h-12 py-3 rounded-full bg-gradient-to-r ${
            theme?.primaryGradient || "from-cyan-400 to-indigo-500"
          } text-slate-900 font-semibold shadow-xl transition transform active:scale-95`}
        >
          Start Level {level}
        </button>

        <div className="mt-3 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("how-to-play");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="w-full min-h-12 py-3 rounded-full border border-slate-700 bg-transparent hover:bg-white/5 transition active:scale-[0.99]"
          >
            How to Play?
          </button>
        </div>

        <div
          id="how-to-play"
          className="mt-4 rounded-2xl bg-slate-900/50 shadow-lg backdrop-blur p-4 border border-slate-800/60"
        >
          <div className="text-sm font-semibold">How it works</div>
          <ul className="mt-2 text-sm text-slate-300 space-y-1.5">
            <li>
              - દરેક લેવલમાં <span className="text-slate-100 font-semibold">10</span>{" "}
              પ્રશ્નો.
            </li>
            <li>- સાચા જવાબ માટે +10 points.</li>
            <li>- 5 સેકન્ડથી ઓછી અંદર સાચો જવાબ: +5 bonus.</li>
            <li>- 30s timer: સમય પૂરું થાય તો પ્રશ્ન wrong ગણાય.</li>
            <li>- 70%+ સ્કોર: Level Up.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

