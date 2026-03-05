import { useEffect, useId, useState } from "react";

function TipsModal({ open, onClose, theme }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        aria-label="Close tips"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md mx-auto px-4 pb-5 sm:pb-0">
        <div className="rounded-2xl bg-slate-900/90 shadow-2xl backdrop-blur border border-slate-700/60 overflow-hidden animate-pop">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between gap-3">
            <div className="shrink-0 hidden sm:block text-2xl" aria-hidden="true">
              📚
            </div>
            <div className="min-w-0">
              <div id={titleId} className="text-base font-semibold">
                IC‑38 Study Tips (Gujarati)
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                5–7 points to stay consistent
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
            >
              Close
            </button>
          </div>

          <div className="p-4 text-sm text-slate-200">
            <ul className="space-y-2 list-disc pl-5">
              <li>દરરોજ 10–20 પ્રશ્નો રમો; સતત પ્રેક્ટિસ સૌથી મહત્વપૂર્ણ છે.</li>
              <li>પહેલા સરળ લેવલ ક્લિયર કરો, પછી “Next Level” થી ધીમે ધીમે આગળ વધો.</li>
              <li>Result માં “Review Questions” થી તમારી ભૂલો ફરી વાંચો.</li>
              <li>જે ટોપિકમાં ભૂલ વધુ થાય, તેને અલગથી 15 મિનિટ રિવિઝન આપો.</li>
              <li>Streak (3+) બનાવવા પ્રયત્ન કરો—આ ધ્યાન અને confidence વધારશે.</li>
              <li>ટાઈમર સાથે જવાબ આપવાની ટેવ પાડો; પરીક્ષામાં સ્પીડ મદદ કરે છે.</li>
              <li>નિયમો/એથિક્સ (IRDAI, conduct) પર ખાસ ફોકસ રાખો.</li>
            </ul>
          </div>

          <div className="p-4 border-t border-slate-700/60">
            <button
              type="button"
              onClick={onClose}
              className={`w-full min-h-12 py-3 rounded-xl bg-gradient-to-r ${
                theme?.primaryGradient || "from-cyan-400 to-indigo-500"
              } text-slate-900 font-semibold shadow-xl transition active:scale-[0.99]`}
            >
              Let’s Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NavBar({
  title,
  subtitle,
  level,
  totalLevels,
  onStartTest,
  theme,
}) {
  const [tipsOpen, setTipsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur border-b border-slate-800/60">
        <div className="h-14 max-w-md md:max-w-lg mx-auto px-4 flex items-center justify-between">
          <div className="min-w-0 flex items-center gap-3">
            <div
              className={`hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${
                theme?.primaryGradient || "from-cyan-400 to-indigo-500"
              } text-slate-900 text-lg font-bold shadow-md motion-safe:animate-float`}
              aria-hidden="true"
            >
              🎯
            </div>
            <div>
              <div className="text-sm font-semibold truncate">{title}</div>
              <div className="text-xs text-slate-300 truncate">
                {subtitle} {totalLevels ? `• Level ${level}/${totalLevels}` : ""}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onStartTest}
              className="min-h-11 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition active:scale-[0.99] border border-slate-700/70 text-xs font-semibold"
            >
              Test
            </button>
            <button
              type="button"
              onClick={() => setTipsOpen(true)}
              className="min-h-11 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition active:scale-[0.99] border border-slate-700/70 text-xs font-semibold"
            >
              Tips
            </button>
          </div>
        </div>
      </header>

      <TipsModal open={tipsOpen} onClose={() => setTipsOpen(false)} theme={theme} />
    </>
  );
}

