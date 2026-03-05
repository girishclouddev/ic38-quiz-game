import { useMemo, useState } from "react";
import LevelUpBanner from "./LevelUpBanner.jsx";

function starsRow(n) {
  const total = 3;
  return (
    <div className="flex items-center gap-1" aria-label={`${n} stars`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={i < n ? "text-amber-300" : "text-slate-600"}>
          ★
        </span>
      ))}
    </div>
  );
}

function topicFromQuestionText(text) {
  const t = (text || "").toLowerCase();
  const has = (...words) => words.some((w) => t.includes(w));

  if (has("grace", "ગ્રેસ")) return "Grace period";
  if (has("free look", "ફ્રી લુક")) return "Free-look";
  if (has("nomination", "નામાંકન", "નોમિની")) return "Nomination";
  if (has("assignment", "અસાઈન", "અસાઇ")) return "Assignment";
  if (has("irdai")) return "IRDAI / Regulations";
  if (has("ethic", "કોડ", "conduct", "અનૈતિક", "ગોપનીય")) return "Agent ethics";
  if (has("underwriting", "અન્ડરરાઇટ")) return "Underwriting";
  if (has("claim", "દાવ", "repudi")) return "Claims";
  if (has("premium", "પ્રીમિયમ")) return "Premiums";
  if (has("kyc", "aml")) return "KYC / AML";
  if (has("insurable", "વીમાયક હિત")) return "Insurable interest";
  if (has("utmost", "ઉતમ", "સદ્દભાવ", "good faith")) return "Utmost good faith";
  if (has("policy servicing", "servicing", "સર્વિસિંગ", "schedule", "document", "bond"))
    return "Policy servicing";
  return "Basics";
}

function topicInsights(answerLog) {
  const map = new Map();
  for (const item of answerLog) {
    const topic = topicFromQuestionText(item?.question?.question || "");
    const prev = map.get(topic) || { topic, correct: 0, total: 0 };
    const next = {
      ...prev,
      total: prev.total + 1,
      correct: prev.correct + (item.isCorrect ? 1 : 0),
    };
    map.set(topic, next);
  }
  const arr = Array.from(map.values()).map((x) => ({
    ...x,
    pct: x.total ? Math.round((x.correct / x.total) * 100) : 0,
  }));

  const weak = [...arr].sort((a, b) => a.pct - b.pct).slice(0, 3);
  const strong = [...arr].sort((a, b) => b.pct - a.pct).slice(0, 3);
  return { weak, strong };
}

export default function ResultScreen({
  level,
  totalLevels,
  score,
  bestScore,
  totalStars,
  answerLog,
  isTestMode,
  didPass,
  percentage,
  earnedStars,
  canGoNextLevel,
  theme,
  onPlayAgain,
  onNextLevel,
  onBackToHome,
}) {
  const [reviewOpen, setReviewOpen] = useState(false);

  const totals = useMemo(() => {
    const total = answerLog.length || 10;
    const correct = answerLog.filter((a) => a.isCorrect).length;
    const speedBonuses = answerLog.filter((a) => a.speedBonus).length;
    return {
      total,
      correct,
      wrong: Math.max(0, total - correct),
      speedBonuses,
    };
  }, [answerLog]);

  const testCorrect = totals.correct;
  const testPassed = isTestMode && testCorrect >= 25;

  const insights = useMemo(() => topicInsights(answerLog), [answerLog]);

  return (
    <div className="min-h-screen max-w-md md:max-w-lg mx-auto px-4 py-6">
      <div className="rounded-2xl bg-slate-900/70 shadow-lg backdrop-blur p-5 border border-slate-800/60">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {isTestMode ? (
              <div className="text-xs text-slate-400">IC‑38 Test • 50 Important Qs</div>
            ) : (
              <div className="text-xs text-slate-400">
                Level {level}
                {totalLevels ? `/${totalLevels}` : ""}
              </div>
            )}
            <div className="mt-1 text-2xl font-extrabold tracking-tight">
              {isTestMode
                ? testPassed
                  ? "You passed the exam!"
                  : "Keep practicing for the exam"
                : didPass
                  ? "Great run!"
                  : "Keep practicing!"}
            </div>
            <div className="mt-1 text-sm text-slate-300">
              Score <span className="text-slate-100 font-semibold">{score}</span>{" "}
              • {percentage}% • Correct{" "}
              <span className="text-slate-100 font-semibold">{totals.correct}</span>/
              {totals.total}
            </div>
            {isTestMode ? (
              <div className="mt-1 text-xs text-slate-300">
                Test rule:{" "}
                <span className="font-semibold text-emerald-200">
                  25+ correct answers
                </span>{" "}
                = Pass.
              </div>
            ) : null}
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">Stars earned</div>
            <div className="mt-1 flex justify-end">{starsRow(earnedStars)}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3">
            <div className="text-xs text-slate-400">Best</div>
            <div className="mt-1 text-lg font-semibold">{bestScore}</div>
          </div>
          <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3">
            <div className="text-xs text-slate-400">Total Stars</div>
            <div className="mt-1 text-lg font-semibold">{totalStars}</div>
          </div>
          <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3">
            <div className="text-xs text-slate-400">Speed Bonus</div>
            <div className="mt-1 text-lg font-semibold">{totals.speedBonuses}</div>
          </div>
        </div>
      </div>

      {!isTestMode ? (
        <div className="mt-4">
          <LevelUpBanner show={didPass} message="Level Up Unlocked" />
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl bg-slate-900/50 shadow-lg backdrop-blur p-4 border border-slate-800/60">
        <div className="text-sm font-semibold">Strong vs Weak topics</div>
        <div className="mt-3 grid grid-cols-1 gap-3">
          <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3">
            <div className="text-xs text-slate-400">Strong</div>
            <div className="mt-2 space-y-1 text-sm">
              {insights.strong.map((t) => (
                <div key={t.topic} className="flex items-center justify-between gap-3">
                  <div className="text-slate-200">{t.topic}</div>
                  <div className="text-emerald-200 font-semibold">{t.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3">
            <div className="text-xs text-slate-400">Weak</div>
            <div className="mt-2 space-y-1 text-sm">
              {insights.weak.map((t) => (
                <div key={t.topic} className="flex items-center justify-between gap-3">
                  <div className="text-slate-200">{t.topic}</div>
                  <div className="text-rose-200 font-semibold">{t.pct}%</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Tip: weak topics ફરી રિવિઝન કરો અને પછી Play Again.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className={`w-full min-h-12 py-3 rounded-full bg-gradient-to-r ${
            theme?.primaryGradient || "from-cyan-400 to-indigo-500"
          } text-slate-900 font-semibold shadow-xl transition active:scale-[0.99]`}
        >
          {isTestMode ? "Retake Test" : "Play Again"}
        </button>

        {!isTestMode ? (
          <button
            type="button"
            onClick={onNextLevel}
            disabled={!canGoNextLevel}
            className="w-full min-h-12 py-3 rounded-full border border-slate-700 bg-transparent hover:bg-white/5 transition active:scale-[0.99] disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Next Level
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => setReviewOpen((v) => !v)}
          className="w-full min-h-12 py-3 rounded-full border border-slate-700 bg-transparent hover:bg-white/5 transition active:scale-[0.99]"
        >
          {reviewOpen ? "Hide Review" : "Review Questions"}
        </button>

        <button
          type="button"
          onClick={onBackToHome}
          className="w-full min-h-12 py-3 rounded-full bg-slate-800 hover:bg-slate-700 transition active:scale-[0.99]"
        >
          Back to Home
        </button>
      </div>

      {reviewOpen ? (
        <div className="mt-4 rounded-2xl bg-slate-900/50 shadow-lg backdrop-blur p-4 border border-slate-800/60">
          <div className="text-sm font-semibold">Review</div>
          <div className="mt-3 space-y-3">
            {answerLog.map((item, idx) => {
              const q = item.question;
              const correctIdx = q.correctAnswerIndex;
              const userIdx = item.selectedIndex;
              const userText =
                userIdx === null || userIdx === undefined
                  ? "No answer (time up)"
                  : q.options[userIdx];
              return (
                <div
                  key={`${q.id ?? idx}`}
                  className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3"
                >
                  <div className="text-xs text-slate-400">
                    Q{idx + 1} • {topicFromQuestionText(q.question)}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-100">
                    {q.question}
                  </div>
                  <div className="mt-2 text-xs text-slate-300">
                    Your answer:{" "}
                    <span className={item.isCorrect ? "text-emerald-200 font-semibold" : "text-rose-200 font-semibold"}>
                      {userText}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-300">
                    Correct:{" "}
                    <span className="text-emerald-200 font-semibold">
                      {q.options[correctIdx]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

