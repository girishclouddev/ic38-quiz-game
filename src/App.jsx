import { useEffect, useMemo, useRef, useState } from "react";
import NavBar from "./components/NavBar.jsx";
import LandingScreen from "./components/LandingScreen.jsx";
import QuizScreen from "./components/QuizScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";

const LS_KEYS = {
  level: "ic38pp_currentLevel",
  bestScore: "ic38pp_bestScore",
  totalStars: "ic38pp_totalStars",
  totalQuizzesPlayed: "ic38pp_totalQuizzesPlayed",
};

// Tune game rules here
const LEVEL_SIZE = 10;
const POINTS_PER_CORRECT = 10;
const SPEED_BONUS_POINTS = 5;
const PASS_PERCENT = 70;

// Hand-picked important questions for Test mode (by ID, non-sequential)
const TEST_QUESTION_IDS = [
  1, 3, 8, 12, 2, 88, 99, 5, 10, 15,
  20, 22, 25, 28, 30, 33, 35, 38, 40, 42,
  45, 48, 50, 52, 55, 58, 60, 62, 65, 68,
  70, 72, 75, 78, 80, 82, 85, 86, 88, 90,
  92, 94, 95, 96, 97, 98, 99, 100, 37, 47,
];

const LEVEL_THEMES = [
  {
    id: "sky",
    primaryGradient: "from-sky-400 to-indigo-500",
    chipBg: "bg-sky-500/10",
    accentText: "text-sky-300",
  },
  {
    id: "emerald",
    primaryGradient: "from-emerald-400 to-cyan-500",
    chipBg: "bg-emerald-500/10",
    accentText: "text-emerald-300",
  },
  {
    id: "amber",
    primaryGradient: "from-amber-300 to-rose-400",
    chipBg: "bg-amber-400/15",
    accentText: "text-amber-200",
  },
  {
    id: "violet",
    primaryGradient: "from-violet-400 to-fuchsia-500",
    chipBg: "bg-violet-500/10",
    accentText: "text-violet-300",
  },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function safeParseInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function starsForPercentage(pct) {
  if (pct >= 90) return 3;
  if (pct >= 70) return 2;
  if (pct >= 50) return 1;
  return 0;
}

export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | quiz | result
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // persisted progression
  const [currentLevel, setCurrentLevel] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [totalQuizzesPlayed, setTotalQuizzesPlayed] = useState(0);

  // run state
  const [levelQuestions, setLevelQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [runScore, setRunScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [answerLog, setAnswerLog] = useState([]); // { question, selectedIndex, isCorrect, speedBonus, timeTakenMs }

  const runScoreRef = useRef(0);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    const lvl = safeParseInt(localStorage.getItem(LS_KEYS.level), 1);
    const best = safeParseInt(localStorage.getItem(LS_KEYS.bestScore), 0);
    const stars = safeParseInt(localStorage.getItem(LS_KEYS.totalStars), 0);
    const played = safeParseInt(localStorage.getItem(LS_KEYS.totalQuizzesPlayed), 0);

    setCurrentLevel(clamp(lvl, 1, 10_000));
    setBestScore(Math.max(0, best));
    setTotalStars(Math.max(0, stars));
    setTotalQuizzesPlayed(Math.max(0, played));
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.level, String(currentLevel));
  }, [currentLevel]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.bestScore, String(bestScore));
  }, [bestScore]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.totalStars, String(totalStars));
  }, [totalStars]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.totalQuizzesPlayed, String(totalQuizzesPlayed));
  }, [totalQuizzesPlayed]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/questions.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data?.questions) ? data.questions : [];
        if (!list.length) throw new Error("No questions found in questions.json");
        if (!cancelled) setQuestions(list);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load questions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalLevels = useMemo(() => {
    const n = questions.length;
    return n ? Math.ceil(n / LEVEL_SIZE) : 0;
  }, [questions.length]);

  const effectiveLevel = useMemo(() => {
    if (!totalLevels) return 1;
    return clamp(currentLevel, 1, totalLevels);
  }, [currentLevel, totalLevels]);

  const currentTheme = useMemo(() => {
    if (!LEVEL_THEMES.length) return null;
    return LEVEL_THEMES[(effectiveLevel - 1) % LEVEL_THEMES.length];
  }, [effectiveLevel]);

  useEffect(() => {
    if (totalLevels && currentLevel !== effectiveLevel) {
      setCurrentLevel(effectiveLevel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveLevel, totalLevels]);

  function buildLevelQuestions(level) {
    const start = (level - 1) * LEVEL_SIZE;
    const slice = questions.slice(start, start + LEVEL_SIZE);
    return slice;
  }

  function buildTestQuestions() {
    if (!questions.length) return [];
    const byId = new Map(questions.map((q) => [q.id, q]));
    const picked = [];
    for (const id of TEST_QUESTION_IDS) {
      const q = byId.get(id);
      if (q) picked.push(q);
      if (picked.length >= 50) break;
    }
    // Fallback: fill up to 50 with remaining questions if needed
    if (picked.length < 50) {
      for (const q of questions) {
        if (picked.includes(q)) continue;
        picked.push(q);
        if (picked.length >= 50) break;
      }
    }
    return picked;
  }

  function resetRun(mode = "level", level = effectiveLevel) {
    const slice = mode === "test" ? buildTestQuestions() : buildLevelQuestions(level);
    setIsTestMode(mode === "test");
    setLevelQuestions(slice);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswerLocked(false);
    setRunScore(0);
    runScoreRef.current = 0;
    setCorrectStreak(0);
    setAnswerLog([]);
  }

  function startQuiz() {
    resetRun("level", effectiveLevel);
    setScreen("quiz");
  }

  function startTest() {
    resetRun("test", effectiveLevel);
    setScreen("quiz");
  }

  function onAnswer({ selectedIndex, isCorrect, speedBonus, timeTakenMs }) {
    setSelectedAnswerIndex(selectedIndex);
    setIsAnswerLocked(true);
    setAnswerLog((prev) => [
      ...prev,
      {
        question: levelQuestions[currentQuestionIndex],
        selectedIndex,
        isCorrect,
        speedBonus,
        timeTakenMs,
      },
    ]);

    if (isCorrect) {
      const points =
        POINTS_PER_CORRECT + (speedBonus ? SPEED_BONUS_POINTS : 0);
      setRunScore((s) => {
        const next = s + points;
        runScoreRef.current = next;
        return next;
      });
      setCorrectStreak((st) => st + 1);
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(20);
    } else {
      setCorrectStreak(0);
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([10, 40, 10]);
    }
  }

  function goNext() {
    const isLast = currentQuestionIndex >= levelQuestions.length - 1;
    if (isLast) {
      finishRun();
      return;
    }
    setCurrentQuestionIndex((i) => i + 1);
    setSelectedAnswerIndex(null);
    setIsAnswerLocked(false);
  }

  function finishRun() {
    setTotalQuizzesPlayed((n) => n + 1);
    setBestScore((b) => Math.max(b, runScoreRef.current));
    setScreen("result");
  }

  const resultSummary = useMemo(() => {
    const total = levelQuestions.length || LEVEL_SIZE;
    const correct = answerLog.filter((a) => a.isCorrect).length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const earnedStars = starsForPercentage(pct);
    const didPass = pct >= PASS_PERCENT;
    return { total, correct, pct, earnedStars, didPass };
  }, [answerLog, levelQuestions.length]);

  function applyRewardsAndMaybeLevelUp() {
    if (isTestMode) {
      // No stars/level-up changes in Test mode
      return;
    }
    setTotalStars((s) => s + resultSummary.earnedStars);
    if (resultSummary.didPass && effectiveLevel < totalLevels) {
      setCurrentLevel((lvl) => clamp(lvl + 1, 1, totalLevels));
    }
  }

  // Apply stars/level-up once when entering result screen
  const rewardsAppliedRef = useRef(false);
  useEffect(() => {
    if (screen !== "result") {
      rewardsAppliedRef.current = false;
      return;
    }
    if (rewardsAppliedRef.current) return;
    rewardsAppliedRef.current = true;
    applyRewardsAndMaybeLevelUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  function playAgainSameLevel() {
    resetRun(effectiveLevel);
    setScreen("quiz");
  }

  function nextLevel() {
    const next = clamp(effectiveLevel + 1, 1, totalLevels || 1);
    setCurrentLevel(next);
    resetRun(next);
    setScreen("quiz");
  }

  const canGoNextLevel = resultSummary.didPass && effectiveLevel < totalLevels;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
      <NavBar
        title="IC-38 Power Play"
        subtitle="Mobile-first LIC Agent prep"
        level={effectiveLevel}
        totalLevels={totalLevels}
        onStartTest={startTest}
        theme={currentTheme}
      />

      <main className="min-h-[calc(100vh-56px)]">
        {loading ? (
          <div className="max-w-md mx-auto px-4 py-10">
            <div className="rounded-2xl bg-slate-900/70 shadow-lg backdrop-blur p-5">
              <div className="text-lg font-semibold">Loading questions…</div>
              <div className="mt-2 text-sm text-slate-300">
                Please wait. We’re setting up your level.
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-cyan-400 to-indigo-500 animate-pulse" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto px-4 py-10">
            <div className="rounded-2xl bg-slate-900/70 shadow-lg backdrop-blur p-5 border border-rose-500/30">
              <div className="text-lg font-semibold text-rose-200">Couldn’t load questions</div>
              <div className="mt-2 text-sm text-slate-200">
                Make sure `public/questions.json` exists and is valid JSON.
              </div>
              <div className="mt-3 text-xs text-slate-300 break-words">
                Error: <span className="text-slate-100">{error}</span>
              </div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 w-full min-h-12 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition active:scale-[0.99]"
              >
                Reload
              </button>
            </div>
          </div>
        ) : screen === "landing" ? (
          <LandingScreen
            level={effectiveLevel}
            totalLevels={totalLevels}
            totalStars={totalStars}
            bestScore={bestScore}
            totalQuizzesPlayed={totalQuizzesPlayed}
            theme={currentTheme}
            onStart={startQuiz}
            onJumpToLevel={(lvl) => setCurrentLevel(clamp(lvl, 1, totalLevels || 1))}
          />
        ) : screen === "quiz" ? (
          <QuizScreen
            level={effectiveLevel}
            isTestMode={isTestMode}
            theme={currentTheme}
            questions={levelQuestions}
            currentQuestionIndex={currentQuestionIndex}
            selectedAnswerIndex={selectedAnswerIndex}
            isAnswerLocked={isAnswerLocked}
            score={runScore}
            correctStreak={correctStreak}
            onAnswer={onAnswer}
            onNext={goNext}
            onQuit={() => setScreen("landing")}
          />
        ) : (
          <ResultScreen
            level={effectiveLevel}
            totalLevels={totalLevels}
            score={runScore}
            bestScore={bestScore}
            totalStars={totalStars}
            answerLog={answerLog}
            isTestMode={isTestMode}
            didPass={resultSummary.didPass}
            percentage={resultSummary.pct}
            earnedStars={resultSummary.earnedStars}
            canGoNextLevel={canGoNextLevel}
            theme={currentTheme}
            onPlayAgain={playAgainSameLevel}
            onNextLevel={nextLevel}
            onBackToHome={() => setScreen("landing")}
          />
        )}
      </main>
    </div>
  );
}

