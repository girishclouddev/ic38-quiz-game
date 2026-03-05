function OptionButton({
  label,
  index,
  locked,
  onPick,
  variant = "idle", // idle | correct | wrong | muted
}) {
  const base =
    "w-full rounded-2xl border py-3 px-4 text-left mb-3 shadow transition min-h-12";

  const styles =
    variant === "correct"
      ? "border-emerald-400/40 bg-gradient-to-r from-emerald-500/25 to-cyan-500/15"
      : variant === "wrong"
        ? "border-rose-400/40 bg-gradient-to-r from-rose-500/25 to-amber-500/10"
        : variant === "muted"
          ? "border-slate-800 bg-slate-900/30 opacity-70"
          : "border-slate-700 bg-slate-800/80";

  return (
    <button
      type="button"
      onClick={() => onPick(index)}
      disabled={locked}
      className={[
        base,
        styles,
        "md:hover:scale-[1.01] md:hover:shadow-lg motion-safe:animate-pop",
        locked ? "cursor-default" : "active:scale-[0.99]",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-slate-900/50 border border-slate-700/60 flex items-center justify-center text-xs">
          {String.fromCharCode(65 + index)}
        </div>
        <div className="text-base font-semibold">{label}</div>
      </div>
    </button>
  );
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  options,
  correctAnswerIndex,
  selectedAnswerIndex,
  isLocked,
  onSelect,
  showTimeUp,
}) {
  return (
    <div className="rounded-2xl bg-slate-900/70 shadow-lg backdrop-blur p-5 border border-slate-800/60">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs text-slate-400">
          Q{questionNumber}/{totalQuestions}
        </div>
        {showTimeUp ? (
          <div className="text-xs font-semibold text-rose-200">
            સમય પૂરું (Time up)
          </div>
        ) : null}
      </div>

      <div className="mt-2 text-lg font-semibold leading-snug">{question}</div>

      <div className="mt-4">
        {options.map((opt, idx) => {
          let variant = "idle";
          if (isLocked) {
            const isCorrect = idx === correctAnswerIndex;
            const isSelected = selectedAnswerIndex === idx;
            const hasSelection = selectedAnswerIndex !== null && selectedAnswerIndex !== undefined;

            if (isCorrect) variant = "correct";
            else if (hasSelection && isSelected && !isCorrect) variant = "wrong";
            else variant = "muted";
          }
          return (
            <OptionButton
              key={idx}
              label={opt}
              index={idx}
              locked={isLocked}
              onPick={onSelect}
              variant={variant}
            />
          );
        })}
      </div>
    </div>
  );
}

