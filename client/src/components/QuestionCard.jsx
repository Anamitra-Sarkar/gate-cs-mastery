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
  CheckSquare, 
  Square,
  AlertTriangle,
  Compass,
  ArrowRight,
  Award
} from 'lucide-react';
import MathText from './MathText';
import confetti from 'canvas-confetti';

export function evaluateGATEAnswer(userAns, officialAnswer, qType = 'MCQ') {
  if (!userAns && userAns !== 0) return false;
  const cleanUser = String(userAns).trim().toUpperCase();
  const cleanKey = String(officialAnswer).trim().toUpperCase();

  // 1. MSQ handling
  if (qType === 'MSQ' || cleanKey.includes(',')) {
    const userChoices = (Array.isArray(userAns) ? userAns : cleanUser.split(','))
      .map(s => String(s).trim().toUpperCase())
      .filter(Boolean);
    const keyChoices = cleanKey.split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);
    
    userChoices.sort();
    keyChoices.sort();
    return userChoices.length === keyChoices.length && 
           userChoices.every((val, idx) => val === keyChoices[idx]);
  }

  // 2. NAT handling
  if (qType === 'NAT' || (!cleanKey.match(/^[A-D]$/) && !cleanKey.includes(','))) {
    const rangeMatch = cleanKey.match(/([-+]?[0-9]*\.?[0-9]+)\s*(?:TO|to|–|-|:)\s*([-+]?[0-9]*\.?[0-9]+)/);
    const numUser = parseFloat(cleanUser);
    if (!isNaN(numUser)) {
      if (rangeMatch) {
        const minVal = parseFloat(rangeMatch[1]);
        const maxVal = parseFloat(rangeMatch[2]);
        if (!isNaN(minVal) && !isNaN(maxVal)) {
          return numUser >= Math.min(minVal, maxVal) && numUser <= Math.max(minVal, maxVal);
        }
      }
      const numKey = parseFloat(cleanKey);
      if (!isNaN(numKey)) {
        return Math.abs(numUser - numKey) <= 0.01;
      }
    }
  }

  // 3. Standard MCQ direct match
  return cleanUser === cleanKey;
}

export default function QuestionCard({ 
  question, 
  isBookmarked, 
  onToggleBookmark, 
  onAskAI, 
  onRecordAttempt 
}) {
  const isMSQ = question.type === 'MSQ' || (typeof question.answer === 'string' && question.answer.includes(','));
  const isNAT = question.type === 'NAT' || (!question.options || question.options.length === 0);

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMsqOptions, setSelectedMsqOptions] = useState([]);
  const [natAnswer, setNatAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeSolutionTab, setActiveSolutionTab] = useState('solution'); // 'concept' | 'example' | 'solution' | 'trap'

  const qMarks = question.marks || 1;
  const negMarks = typeof question.negative_marks === 'number' ? question.negative_marks : 
                  (isNAT || isMSQ ? 0 : (qMarks === 2 ? 0.66 : 0.33));

  // MCQ Selection
  const handleSelectMCQ = (lbl) => {
    if (isSubmitted || isMSQ) return;
    setSelectedOption(lbl);
    setIsSubmitted(true);
    setShowExplanation(true);

    const correct = evaluateGATEAnswer(lbl, question.answer, 'MCQ');
    if (correct) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
    if (onRecordAttempt) {
      onRecordAttempt(question.id, lbl, correct, 15);
    }
  };

  // MSQ Toggle
  const handleToggleMSQ = (lbl) => {
    if (isSubmitted) return;
    setSelectedMsqOptions(prev => 
      prev.includes(lbl) ? prev.filter(x => x !== lbl) : [...prev, lbl]
    );
  };

  const handleMsqSubmit = () => {
    if (isSubmitted || selectedMsqOptions.length === 0) return;
    setIsSubmitted(true);
    setShowExplanation(true);

    const correct = evaluateGATEAnswer(selectedMsqOptions, question.answer, 'MSQ');
    if (correct) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    }
    if (onRecordAttempt) {
      onRecordAttempt(question.id, selectedMsqOptions.join(', '), correct, 25);
    }
  };

  // NAT Submit
  const handleNatSubmit = () => {
    if (isSubmitted || !natAnswer.trim()) return;
    setIsSubmitted(true);
    setShowExplanation(true);

    const correct = evaluateGATEAnswer(natAnswer, question.answer, 'NAT');
    if (correct) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
    if (onRecordAttempt) {
      onRecordAttempt(question.id, natAnswer, correct, 20);
    }
  };

  const currentAnswer = isMSQ ? selectedMsqOptions : (isNAT ? natAnswer : selectedOption);
  const isCorrect = evaluateGATEAnswer(currentAnswer, question.answer, isMSQ ? 'MSQ' : (isNAT ? 'NAT' : 'MCQ'));

  const paperLabel = question.paper || question.id.split('_').slice(0, 3).join(' ');

  return (
    <div className={`p-6 sm:p-8 rounded-3xl academic-card transition-all duration-200 ${
      isSubmitted 
        ? (isCorrect ? 'border-emerald-500/60 bg-emerald-50/25 dark:bg-emerald-950/25' : 'border-rose-500/50 bg-rose-50/25 dark:bg-rose-950/25') 
        : ''
    }`}>
      {/* Question Header: Authentic Academic Paper Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-250 dark:border-slate-800 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl font-serif font-bold bg-amber-100/70 dark:bg-slate-800 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-slate-700 shadow-sm">
            {paperLabel} {question.q_no ? `• Question ${question.q_no}` : ''}
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5">
            <span className="text-slate-950 dark:text-white font-bold">{question.subject}</span>
            <span className="text-slate-400 dark:text-slate-500">›</span>
            <span className="text-slate-800 dark:text-slate-200 truncate max-w-[220px] sm:max-w-none">{question.topic}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 shadow-sm">
            {isMSQ ? 'MSQ' : (isNAT ? 'NAT' : 'MCQ')} • +{qMarks} / -{negMarks}
          </span>
          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`p-1.5 rounded-xl border transition ${
              isBookmarked 
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 text-rose-600 dark:text-rose-400 shadow-sm' 
                : 'border-slate-300 dark:border-slate-700 text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Bookmark to Review Notebook"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Question Statement: High Contrast, Crisp KaTeX */}
      <div className="py-5 text-base sm:text-[17px] text-slate-950 dark:text-slate-50 font-normal leading-relaxed break-words overflow-x-auto tracking-normal">
        <MathText text={question.question} />
      </div>

      {/* SVG Diagram Visualizer (if present) */}
      {question.visual && (
        <div 
          className="my-5 p-4 bg-slate-50/80 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto max-w-full shadow-sm"
          dangerouslySetInnerHTML={{ __html: question.visual }}
        />
      )}

      {/* Options / Answer Input Section */}
      <div className="space-y-3 pt-1">
        {question.options && question.options.length > 0 ? (
          <>
            {isMSQ && !isSubmitted && (
              <p className="text-xs sm:text-sm font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-400" /> Multiple Correct Choices (MSQ): Select all correct options and click submit.
              </p>
            )}

            {question.options.map(opt => {
              const labelUpper = String(opt.label).trim().toUpperCase();
              const keyList = String(question.answer).split(',').map(s => s.trim().toUpperCase());
              const isAnswerKey = keyList.includes(labelUpper);

              const isSelected = isMSQ 
                ? selectedMsqOptions.includes(opt.label)
                : selectedOption === opt.label;

              let optionStyle = 'bg-white dark:bg-[#161925] border-slate-300 dark:border-slate-700 text-slate-950 dark:text-slate-50 hover:border-slate-450 dark:hover:border-slate-500 hover:bg-slate-50/80 dark:hover:bg-[#1d2232]';
              if (isSubmitted) {
                if (isAnswerKey) {
                  optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-50 font-medium shadow-sm';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 text-rose-950 dark:text-rose-50';
                } else {
                  optionStyle = 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400 opacity-60';
                }
              } else if (isMSQ && isSelected) {
                optionStyle = 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-950 dark:text-purple-50 shadow-sm';
              }

              return (
                <button
                  key={opt.label}
                  disabled={isSubmitted}
                  onClick={() => isMSQ ? handleToggleMSQ(opt.label) : handleSelectMCQ(opt.label)}
                  className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border flex items-start gap-4 transition-all duration-150 shadow-sm ${optionStyle}`}
                >
                  <span className={`w-8 h-8 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 border ${
                    isSubmitted && isAnswerKey 
                      ? 'bg-emerald-600 text-white font-extrabold border-emerald-700 shadow-sm' 
                      : (isSubmitted && isSelected ? 'bg-rose-600 text-white border-rose-700' : (isMSQ && isSelected ? 'bg-purple-600 text-white border-purple-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 shadow-inner'))
                  }`}>
                    {opt.label}
                  </span>
                  <div className="pt-0.5 text-sm sm:text-base text-slate-950 dark:text-slate-50 flex-1 break-words overflow-x-auto leading-relaxed">
                    <MathText text={opt.text} />
                  </div>
                  {isSubmitted && isAnswerKey && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 animate-pop" />
                  )}
                  {isSubmitted && isSelected && !isAnswerKey && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}

            {isMSQ && !isSubmitted && (
              <div className="pt-2 flex justify-end">
                <button
                  disabled={selectedMsqOptions.length === 0}
                  onClick={handleMsqSubmit}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-sm"
                >
                  <CheckSquare className="w-4 h-4" />
                  Submit MSQ Response ({selectedMsqOptions.length} selected)
                </button>
              </div>
            )}
          </>
        ) : (
          /* NAT Numerical Input */
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl space-y-3 shadow-sm">
            <label className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Enter Numerical Answer (NAT):
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                disabled={isSubmitted}
                value={natAnswer}
                onChange={e => setNatAnswer(e.target.value)}
                placeholder="e.g. 28.5"
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white font-mono rounded-xl px-4 py-3 text-base flex-1 focus:outline-none focus:border-amber-600 shadow-inner"
              />
              <button
                disabled={isSubmitted || !natAnswer.trim()}
                onClick={handleNatSubmit}
                className="px-7 py-3 bg-slate-950 hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-sm"
              >
                Submit Answer
              </button>
            </div>
            {isSubmitted && (
              <div className="text-xs sm:text-sm font-mono pt-1 text-slate-800 dark:text-slate-200">
                Official Answer Key: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{question.answer}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submission Feedback Banner */}
      {isSubmitted && (
        <div className={`mt-5 p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 animate-fadeIn shadow-sm ${
          isCorrect 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100' 
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-100'
        }`}>
          <div className="flex items-center gap-2.5">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="font-semibold">
              {isCorrect 
                ? `Correct Answer! +${qMarks}.0 Marks awarded.` 
                : `Incorrect (${negMarks > 0 ? `-${negMarks} Marks` : '0 Negative Marks'}). Official Answer: ${question.answer}`}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">
            Official Key: {question.answer}
          </span>
        </div>
      )}

      {/* Action Footer: Hint, Explanation, Ask AI */}
      <div className="mt-6 pt-4 border-t border-slate-250 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 text-amber-900 dark:text-amber-300 transition font-bold shadow-sm"
          >
            <Lightbulb className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-700/50 text-blue-900 dark:text-blue-300 transition font-bold shadow-sm"
          >
            <BookOpen className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>{showExplanation ? 'Hide Solution' : 'Solution, Concept & Proof'}</span>
          </button>
        </div>

        <button
          onClick={() => onAskAI(question)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold transition ml-auto sm:ml-0 shadow-sm"
        >
          <Bot className="w-4 h-4 shrink-0 text-amber-400 dark:text-white" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Hint Drawer */}
      {showHint && question.hint && (
        <div className="mt-4 p-4.5 bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 rounded-2xl text-xs sm:text-sm text-amber-950 dark:text-amber-100 animate-fadeIn space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
            <Lightbulb className="w-4 h-4 shrink-0" />
            Strategic Hint:
          </div>
          <p className="leading-relaxed text-amber-950 dark:text-amber-100 font-medium">{question.hint}</p>
        </div>
      )}

      {/* Comprehensive Solution & Concept Drawer */}
      {showExplanation && (
        <div className="mt-4 p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl space-y-4 animate-fadeIn text-xs sm:text-sm shadow-sm">
          {/* Solution Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-250 dark:border-slate-700 text-xs sm:text-sm">
              <button
                onClick={() => setActiveSolutionTab('solution')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                  activeSolutionTab === 'solution' 
                    ? 'bg-slate-950 text-white dark:bg-blue-600 shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                Step-by-Step Proof
              </button>
              {question.core_concept && (
                <button
                  onClick={() => setActiveSolutionTab('concept')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                    activeSolutionTab === 'concept' 
                      ? 'bg-slate-950 text-white dark:bg-blue-600 shadow-sm' 
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  Core Concept
                </button>
              )}
              {question.example && (
                <button
                  onClick={() => setActiveSolutionTab('example')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                    activeSolutionTab === 'example' 
                      ? 'bg-slate-950 text-white dark:bg-blue-600 shadow-sm' 
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  Worked Example
                </button>
              )}
              {question.pitfall && (
                <button
                  onClick={() => setActiveSolutionTab('trap')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                    activeSolutionTab === 'trap' 
                      ? 'bg-rose-600 text-white shadow-sm' 
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  GATE Trap
                </button>
              )}
            </div>

            <span className="font-mono text-emerald-900 dark:text-emerald-300 font-extrabold px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs sm:text-sm whitespace-nowrap shadow-sm">
              Official Key: ({question.answer})
            </span>
          </div>

          {/* Tab Content Display */}
          {activeSolutionTab === 'concept' && question.core_concept && (
            <div className="p-4.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 text-xs sm:text-sm uppercase tracking-wider">
                <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Fundamental Theory & Theorems
              </div>
              <p className="text-slate-950 dark:text-slate-100 font-medium leading-relaxed text-sm sm:text-base">
                {question.core_concept}
              </p>
            </div>
          )}

          {activeSolutionTab === 'example' && question.example && (
            <div className="p-4.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Concrete Example & Mental Model
              </div>
              <p className="text-slate-950 dark:text-slate-100 font-medium leading-relaxed text-sm sm:text-base">
                {question.example}
              </p>
            </div>
          )}

          {activeSolutionTab === 'trap' && question.pitfall && (
            <div className="p-4.5 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-300 dark:border-rose-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-300 text-xs sm:text-sm uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Common GATE Trap to Avoid
              </div>
              <p className="text-rose-950 dark:text-rose-100 font-medium leading-relaxed text-sm sm:text-base">
                {question.pitfall}
              </p>
            </div>
          )}

          {activeSolutionTab === 'solution' && (
            <div className="leading-relaxed text-slate-950 dark:text-slate-100 font-medium break-words overflow-x-auto space-y-2 bg-slate-50 dark:bg-slate-800 p-4.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm sm:text-base">
              <MathText text={question.explanation} />
            </div>
          )}

          {/* Quick AI Tutor Assist Link */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Need another perspective on this problem?
            </span>
            <button
              onClick={() => onAskAI(question)}
              className="flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-800 dark:text-blue-400 hover:underline transition"
            >
              Consult AI Tutor for this problem <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
