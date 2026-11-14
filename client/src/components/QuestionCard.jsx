import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  BookOpen, 
  Bot, 
  Bookmark, 
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import MathText from './MathText';
import confetti from 'canvas-confetti';

export default function QuestionCard({ 
  question, 
  isBookmarked, 
  onToggleBookmark, 
  onAskAI, 
  onRecordAttempt 
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [natAnswer, setNatAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const qMarks = question.marks || 1;
  const negMarks = question.negative_marks || (qMarks === 2 ? 0.66 : 0.33);

  // Check correct
  const checkIsCorrect = (userAns) => {
    if (!userAns) return false;
    const cleanUser = String(userAns).trim().toUpperCase();
    const cleanKey = String(question.answer).trim().toUpperCase();

    // If NAT range (e.g. "28 to 30")
    if (cleanKey.includes('TO')) {
      const parts = cleanKey.split('TO').map(p => parseFloat(p.trim()));
      const numUser = parseFloat(cleanUser);
      if (!isNaN(numUser) && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return numUser >= parts[0] && numUser <= parts[1];
      }
    }

    // Direct match or comma separated MSQ
    if (cleanKey.includes(',')) {
      const keys = cleanKey.split(',').map(s => s.trim());
      return keys.includes(cleanUser);
    }

    return cleanUser === cleanKey;
  };

  const handleSelectOption = (lbl) => {
    if (isSubmitted) return;
    setSelectedOption(lbl);
    setIsSubmitted(true);
    setShowExplanation(true);

    const isCorrect = checkIsCorrect(lbl);
    if (isCorrect) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
    if (onRecordAttempt) {
      onRecordAttempt(question.id, lbl, isCorrect, 15);
    }
  };

  const handleNatSubmit = () => {
    if (isSubmitted || !natAnswer.trim()) return;
    setIsSubmitted(true);
    setShowExplanation(true);
    const isCorrect = checkIsCorrect(natAnswer);
    if (isCorrect) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
    if (onRecordAttempt) {
      onRecordAttempt(question.id, natAnswer, isCorrect, 15);
    }
  };

  const isCorrect = checkIsCorrect(selectedOption || natAnswer);

  return (
    <div className={`p-6 rounded-2xl bg-slate-900 border transition-all duration-300 shadow-xl ${
      isSubmitted 
        ? (isCorrect ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-rose-500/40 bg-rose-950/10 animate-shake') 
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Question Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            {question.id.split('_').slice(0, 3).join(' ')}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
            {question.subject}
          </span>
          <span className="text-slate-400 font-mono hidden sm:inline">
            • {question.topic}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            question.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
            (question.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400')
          }`}>
            {question.difficulty}
          </span>
          <span className="font-mono text-slate-400 text-[11px]">
            +{qMarks} / -{negMarks}
          </span>
          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`p-1.5 rounded-lg border transition ${
              isBookmarked 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' 
                : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Bookmark to Mistake Deck"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Question Body */}
      <div className="py-4 text-sm md:text-base text-slate-100 font-normal leading-relaxed">
        <MathText text={question.question} />
      </div>

      {/* SVG Diagram Visualizer (if present) */}
      {question.visual && (
        <div 
          className="my-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: question.visual }}
        />
      )}

      {/* Options Grid */}
      <div className="space-y-2.5 pt-2">
        {question.options && question.options.length > 0 ? (
          question.options.map(opt => {
            const isSelected = selectedOption === opt.label;
            const isAnswerKey = String(opt.label).trim().toUpperCase() === String(question.answer).trim().toUpperCase();

            let optionStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60';
            if (isSubmitted) {
              if (isAnswerKey) {
                optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-medium shadow-md shadow-emerald-500/20';
              } else if (isSelected) {
                optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
              } else {
                optionStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
              }
            }

            return (
              <button
                key={opt.label}
                disabled={isSubmitted}
                onClick={() => handleSelectOption(opt.label)}
                className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition-all ${optionStyle}`}
              >
                <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                  isSubmitted && isAnswerKey 
                    ? 'bg-emerald-500 text-slate-950' 
                    : (isSubmitted && isSelected ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300')
                }`}>
                  {opt.label}
                </span>
                <div className="pt-0.5 text-xs md:text-sm flex-1">
                  <MathText text={opt.text} />
                </div>
                {isSubmitted && isAnswerKey && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pop" />
                )}
                {isSubmitted && isSelected && !isAnswerKey && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })
        ) : (
          /* NAT Input */
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <label className="text-xs font-semibold text-slate-400">
              Enter Numerical Value (NAT):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                disabled={isSubmitted}
                value={natAnswer}
                onChange={e => setNatAnswer(e.target.value)}
                placeholder="e.g. 28.5"
                className="bg-slate-900 border border-slate-800 text-white font-mono rounded-lg px-4 py-2 text-sm flex-1 focus:border-indigo-500"
              />
              <button
                disabled={isSubmitted || !natAnswer.trim()}
                onClick={handleNatSubmit}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium rounded-lg text-xs transition"
              >
                Submit Answer
              </button>
            </div>
            {isSubmitted && (
              <div className="text-xs font-mono pt-1">
                Official Answer Key: <strong className="text-emerald-400">{question.answer}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer: Hint, Explanation, Ask AI */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Hint Button */}
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition font-medium"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>

          {/* Explanation Button */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 transition font-medium"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showExplanation ? 'Hide Solution' : 'Step-by-Step Solution'}</span>
          </button>
        </div>

        {/* AI Tutor Context Button */}
        <button
          onClick={() => onAskAI(question)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white font-semibold transition"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Hint Drawer */}
      {showHint && question.hint && (
        <div className="mt-3 p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200 animate-fadeIn space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Lightbulb className="w-3.5 h-3.5" />
            Strategic Hint:
          </div>
          <p className="leading-relaxed">{question.hint}</p>
        </div>
      )}

      {/* Detailed Explanation Drawer */}
      {showExplanation && (
        <div className="mt-4 p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs md:text-sm text-slate-200 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold text-indigo-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verified GATE Explanation & Proof
            </span>
            <span className="font-mono text-emerald-400">Correct Answer: ({question.answer})</span>
          </div>
          <div className="pt-2 leading-relaxed text-slate-300 font-sans">
            <MathText text={question.explanation} />
          </div>
        </div>
      )}
    </div>
  );
}
