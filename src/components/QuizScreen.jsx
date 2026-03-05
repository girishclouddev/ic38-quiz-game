import { useEffect, useMemo, useRef, useState } from "react";
import ProgressBar from "./ProgressBar.jsx";
import QuestionCard from "./QuestionCard.jsx";
import StreakBadge from "./StreakBadge.jsx";

const TIMER_SECONDS = 30;
const SPEED_BONUS_THRESHOLD_MS = 5000;

function formatSeconds(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${s}s`;
}

export default function QuizScreen({
  level,
  isTestMode,
  theme,
  questions,
  currentQuestionIndex,
  selectedAnswerIndex,
  isAnswerLocked,
  score,
  correctStreak,
  onAnswer,
  onNext,
  onQuit,
}) {
  const q = questions[currentQuestionIndex];
  const total = questions.length || 10;

  const [msLeft, setMsLeft] = useState(TIMER_SECONDS * 1000);
  const [timeUp, setTimeUp] = useState(false);
  const startedAtRef = useRef(0);
  const deadlineRef = useRef(0);
  const timeoutHandledRef = useRef(false);

  useEffect(() => {
    setTimeUp(false);
    timeoutHandledRef.current = false;
    startedAtRef.current = Date.now();
    deadlineRef.current = startedAtRef.current + TIMER_SECONDS * 1000;
    setMsLeft(TIMER_SECONDS * 1000);

    const id = window.setInterval(() => {
      const left = Math.max(0, deadlineRef.current - Date.now());
      setMsLeft(left);
    }, 120);

    return () => window.clearInterval(id);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (isAnswerLocked) return;
    if (msLeft > 0) return;
    if (timeoutHandledRef.current) return;
    timeoutHandledRef.current = true;

    setTimeUp(true);
    onAnswer({
      selectedIndex: null,
      isCorrect: false,
      speedBonus: false,
      timeTakenMs: TIMER_SECONDS * 1000,
    });

    // Auto move to next question shortly after showing the answer
    const t = window.setTimeout(() => {
      onNext();
    }, 650);
    return () => window.clearTimeout(t);
  }, [isAnswerLocked, msLeft, onAnswer, onNext]);

  const secondsLeft = msLeft / 1000;
  const timerPct = Math.round((msLeft / (TIMER_SECONDS * 1000)) * 100);

  const header = useMemo(() => {
    return {
      label: isTestMode ? "Test Mode" : `Level ${level}`,
      counter: `${currentQuestionIndex + 1}/${total}`,
      progressValue: currentQuestionIndex + 1,
      progressMax: total,
    };
  }, [currentQuestionIndex, level, total]);

  function handlePick(idx) {
    if (!q || isAnswerLocked) return;
    const now = Date.now();
    const timeTakenMs = now - startedAtRef.current;
    const isCorrect = idx === q.correctAnswerIndex;
    const speedBonus = isCorrect && timeTakenMs <= SPEED_BONUS_THRESHOLD_MS;

    onAnswer({
      selectedIndex: idx,
      isCorrect,
      speedBonus,
      timeTakenMs,
    });
  }

  const nextLabel =
    currentQuestionIndex >= total - 1 ? "Finish" : "Next";

  return (
    <div className="min-h-screen flex flex-col max-w-md md:max-w-lg mx-auto px-4 pt-3 pb-20">
      <div className="rounded-2xl bg-slate-900/50 shadow-lg backdrop-blur border border-slate-800/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold">{header.label}</div>
            <div className="text-xs text-slate-300">
              Question <span className="text-slate-100 font-semibold">{header.counter}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onQuit}
            className="min-h-11 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition active:scale-[0.99]"
          >
            Quit
          </button>
        </div>

        <div className="mt-3">
          <ProgressBar value={header.progressValue} max={header.progressMax} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            Timer:{" "}
            <span className={secondsLeft <= 5 ? "text-rose-200 font-semibold" : "text-slate-100 font-semibold"}>
              {formatSeconds(secondsLeft)}
            </span>
          </div>
          <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={[
                "h-full transition-all duration-200",
                secondsLeft <= 5
                  ? "bg-rose-400"
                  : theme
                    ? "bg-gradient-to-r from-transparent via-cyan-300 to-emerald-300"
                    : "bg-cyan-400",
              ].join(" ")}
              style={{ width: `${timerPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        {q ? (
          <QuestionCard
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={total}
            question={q.question}
            options={q.options}
            correctAnswerIndex={q.correctAnswerIndex}
            selectedAnswerIndex={selectedAnswerIndex}
            isLocked={isAnswerLocked}
            onSelect={handlePick}
            showTimeUp={timeUp}
          />
        ) : (
          <div className="rounded-2xl bg-slate-900/70 shadow-lg backdrop-blur p-5 border border-slate-800/60">
            <div className="text-base font-semibold">No question found.</div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex-1">
          <StreakBadge streak={correctStreak} />
        </div>
        <div className="text-sm text-slate-300">
          Score: <span className="text-slate-100 font-semibold">{score}</span>
        </div>
      </div>

      <div className="sticky bottom-0 mt-auto pb-3">
        <div className="bg-slate-900/95 backdrop-blur border border-slate-800/60 rounded-2xl p-3 shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-slate-400">Streak</div>
              <div className="text-sm font-semibold">
                {correctStreak}x
              </div>
            </div>

            <button
              type="button"
              onClick={onNext}
              disabled={!isAnswerLocked}
              className={`flex-1 min-h-12 py-3 rounded-xl bg-gradient-to-r ${
                theme?.primaryGradient || "from-cyan-400 to-indigo-500"
              } text-slate-900 font-semibold shadow-xl transition active:scale-[0.99] disabled:opacity-50 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-300`}
            >
              {nextLabel}
            </button>

            <div className="min-w-0 text-right">
              <div className="text-xs text-slate-400">Points</div>
              <div className="text-sm font-semibold">{score}</div>
            </div>
          </div>

          {!isAnswerLocked ? (
            <div className="mt-2 text-xs text-slate-400">
              Tap an option to lock your answer.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

