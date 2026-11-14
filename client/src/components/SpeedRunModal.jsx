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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl h-[85vh] sm:h-[75vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-amber-400 fill-amber-400 animate-bounce shrink-0" />
            <span className="font-bold text-white text-sm sm:text-base">GATE Speed Sprint (60s)</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {isPlaying && (
              <>
                <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-lg text-xs">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  {streak}x Combo
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono font-bold rounded-lg text-xs sm:text-sm">
                  <Timer className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  {timeLeft}s
                </div>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1 sm:p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isPlaying && !isGameOver ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400">
              <Zap className="w-8 h-8 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">60-Second GATE Speed Sprint</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Test your instinctive CS recall! Answer as many questions as you can in 60 seconds. Build consecutive combos for huge score multipliers.
              </p>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-amber-500/20 transition transform hover:scale-105"
            >
              Start Sprint Now
            </button>
          </div>
        ) : isGameOver ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <Award className="w-16 h-16 text-indigo-400 mx-auto" />
            <div>
              <h3 className="text-2xl font-extrabold text-white mb-1">Time's Up!</h3>
              <p className="text-xs text-slate-400">Sprint Completed</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 mb-1">Final Score</div>
                <div className="text-3xl font-extrabold text-amber-400">{score}</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 mb-1">Max Combo Streak</div>
                <div className="text-3xl font-extrabold text-indigo-400">{maxStreak}x</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition"
              >
                Play Again
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Active Gameplay */
          <div className={`flex-1 flex flex-col p-6 overflow-y-auto justify-between transition-colors duration-200 ${
            feedback === 'correct' ? 'bg-emerald-950/20' : (feedback === 'wrong' ? 'bg-rose-950/20' : '')
          }`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-bold text-indigo-400">{currentQ?.subject}</span>
                <span className="font-mono">Score: <strong className="text-amber-400 text-sm">{score}</strong></span>
              </div>

              <div className="text-sm md:text-base font-medium text-slate-100 leading-relaxed max-h-40 overflow-y-auto pr-1">
                <MathText text={currentQ?.question} />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                {currentQ?.options?.map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => handleAnswer(opt.label)}
                    className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded-xl text-left flex items-start gap-2.5 transition active:scale-95"
                  >
                    <span className="w-6 h-6 rounded bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {opt.label}
                    </span>
                    <span className="text-xs text-slate-200 pt-0.5">
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
