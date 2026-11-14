import React, { useState, useEffect } from 'react';
import { Zap, Timer, Flame, Award, X, RotateCcw, ArrowRight } from 'lucide-react';
import MathText from './MathText';
import confetti from 'canvas-confetti';
import { evaluateGATEAnswer } from './QuestionCard';

export default function SpeedRunModal({ isOpen, onClose, allQuestions, onAddXP }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [shuffledList, setShuffledList] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  const startGame = () => {
    // Only pick MCQs with options for speed run
    const mcqs = allQuestions.filter(q => q.options && q.options.length >= 2);
    const shuffled = [...mcqs].sort(() => 0.5 - Math.random());
    setShuffledList(shuffled);
    setCurrentQIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(60);
    setFeedback(null);
    setIsPlaying(true);
    setIsGameOver(false);
  };

  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isGameOver]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  };

  const currentQ = shuffledList[currentQIndex];

  const handleAnswer = (selectedLabel) => {
    if (!currentQ || isGameOver) return;

    const isCorrect = evaluateGATEAnswer(selectedLabel, currentQ.answer, 'MCQ');

    if (isCorrect) {
      const multiplier = Math.min(5, Math.floor(streak / 2) + 1);
      const points = 10 * multiplier;
      setScore(prev => prev + points);
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
      setFeedback('correct');
      if (onAddXP) onAddXP(points);
    } else {
      setStreak(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQIndex < shuffledList.length - 1) {
        setCurrentQIndex(prev => prev + 1);
      } else {
        handleGameOver();
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#fdfbf7] dark:bg-[#0f1117] border border-slate-300 dark:border-slate-800 rounded-3xl w-full max-w-2xl h-[85vh] sm:h-[75vh] flex flex-col shadow-2xl overflow-hidden relative transition-colors">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 gap-2 backdrop-blur">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
            <span className="font-serif font-bold text-slate-950 dark:text-white text-base">GATE Speed Sprint (60s)</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isPlaying && (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-bold rounded-xl text-xs">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {streak}x Combo
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300 font-mono font-bold rounded-xl text-xs sm:text-sm">
                  <Timer className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  {timeLeft}s
                </div>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isPlaying && !isGameOver ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Zap className="w-8 h-8 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-slate-950 dark:text-white mb-2">60-Second GATE Speed Sprint</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Test your instinctive recall! Answer as many questions as you can in 60 seconds. Build consecutive combos for huge score multipliers.
              </p>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-3.5 bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-2xl text-sm shadow-md transition transform hover:scale-105"
            >
              Start Sprint Now
            </button>
          </div>
        ) : isGameOver ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <Award className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto" />
            <div>
              <h3 className="text-2xl font-serif font-bold text-slate-950 dark:text-white mb-1">Time's Up!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Sprint Completed</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="p-4 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">Final Score</div>
                <div className="text-3xl font-serif font-bold text-amber-700 dark:text-amber-400">{score}</div>
              </div>
              <div className="p-4 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">Max Combo</div>
                <div className="text-3xl font-serif font-bold text-blue-700 dark:text-blue-400">{maxStreak}x</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-sm"
              >
                Play Again
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-sm transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Active Gameplay */
          <div className={`flex-1 flex flex-col p-6 overflow-y-auto justify-between transition-colors duration-200 ${
            feedback === 'correct' ? 'bg-emerald-50 dark:bg-emerald-950/20' : (feedback === 'wrong' ? 'bg-rose-50 dark:bg-rose-950/20' : '')
          }`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-blue-700 dark:text-blue-400">{currentQ?.subject}</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">Score: <strong className="text-amber-700 dark:text-amber-400 text-sm">{score}</strong></span>
              </div>

              <div className="text-base font-serif font-medium text-slate-950 dark:text-slate-50 leading-relaxed max-h-40 overflow-y-auto pr-1">
                <MathText text={currentQ?.question} />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {currentQ?.options?.map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => handleAnswer(opt.label)}
                    className="p-3.5 bg-white dark:bg-[#13161f] hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-2xl text-left flex items-start gap-3 transition shadow-sm active:scale-95"
                  >
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center shrink-0">
                      {opt.label}
                    </span>
                    <span className="text-xs text-slate-900 dark:text-slate-100 pt-1 font-medium">
                      <MathText text={opt.text} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}