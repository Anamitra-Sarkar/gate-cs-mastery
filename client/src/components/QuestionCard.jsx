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
    <div className={`p-5 sm:p-7 rounded-2xl bg-[#111827] border transition-all duration-200 shadow-xl ${
      isSubmitted 
        ? (isCorrect ? 'border-emerald-500/40 bg-[#0e1a1e]' : 'border-rose-500/30 bg-[#1a1219]') 
        : 'border-slate-800/90 hover:border-slate-700'
    }`}>
      {/* Question Header: Clean, Minimalist & Dignified */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg font-mono font-bold bg-[#1a233a] text-indigo-300 border border-indigo-500/30">
            {paperLabel} {question.q_no ? `• Q.${question.q_no}` : ''}
          </span>
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <span className="text-slate-200 font-semibold">{question.subject}</span>
            <span className="text-slate-600">›</span>
            <span className="text-slate-400 truncate max-w-[220px] sm:max-w-none">{question.topic}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
            {isMSQ ? 'MSQ' : (isNAT ? 'NAT' : 'MCQ')} • +{qMarks} / -{negMarks}
          </span>
          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`p-1.5 rounded-lg border transition ${
              isBookmarked 
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' 
                : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Bookmark to Review Notebook"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Question Statement */}
      <div className="py-5 text-[15px] sm:text-base text-slate-100 font-normal leading-relaxed break-words overflow-x-auto">
        <MathText text={question.question} />
      </div>

      {/* SVG Diagram Visualizer (if present) */}
      {question.visual && (
        <div 
          className="my-3 p-4 bg-[#090d16] rounded-xl border border-slate-800 overflow-x-auto max-w-full"
          dangerouslySetInnerHTML={{ __html: question.visual }}
        />
      )}

      {/* Options / Answer Input Section */}
      <div className="space-y-3 pt-1">
        {question.options && question.options.length > 0 ? (
          <>
            {isMSQ && !isSubmitted && (
              <p className="text-xs font-medium text-purple-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" /> Multiple Correct Options (MSQ): Select all correct choices and submit.
              </p>
            )}

            {question.options.map(opt => {
              const labelUpper = String(opt.label).trim().toUpperCase();
              const keyList = String(question.answer).split(',').map(s => s.trim().toUpperCase());
              const isAnswerKey = keyList.includes(labelUpper);

              const isSelected = isMSQ 
                ? selectedMsqOptions.includes(opt.label)
                : selectedOption === opt.label;

              let optionStyle = 'bg-[#0f1523] border-slate-800/90 text-slate-200 hover:border-slate-700 hover:bg-[#141c30]';
              if (isSubmitted) {
                if (isAnswerKey) {
                  optionStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-100 font-medium shadow-sm';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-500/15 border-rose-500 text-rose-200';
                } else {
                  optionStyle = 'bg-[#0f1523]/40 border-slate-900 text-slate-500 opacity-50';
                }
              } else if (isMSQ && isSelected) {
                optionStyle = 'bg-purple-950/40 border-purple-500 text-purple-100';
              }

              return (
                <button
                  key={opt.label}
                  disabled={isSubmitted}
                  onClick={() => isMSQ ? handleToggleMSQ(opt.label) : handleSelectMCQ(opt.label)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border flex items-start gap-3.5 transition-all duration-150 ${optionStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    isSubmitted && isAnswerKey 
                      ? 'bg-emerald-500 text-slate-950 font-extrabold' 
                      : (isSubmitted && isSelected ? 'bg-rose-500 text-white' : (isMSQ && isSelected ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'))
                  }`}>
                    {opt.label}
                  </span>
                  <div className="pt-0.5 text-xs sm:text-sm flex-1 break-words overflow-x-auto">
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
            })}

            {isMSQ && !isSubmitted && (
              <div className="pt-2 flex justify-end">
                <button
                  disabled={selectedMsqOptions.length === 0}
                  onClick={handleMsqSubmit}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  <CheckSquare className="w-4 h-4" />
                  Submit MSQ Response ({selectedMsqOptions.length} selected)
                </button>
              </div>
            )}
          </>
        ) : (
          /* NAT Numerical Input */
          <div className="p-4 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-3">
            <label className="text-xs font-semibold text-slate-300">
              Enter Numerical Answer (NAT):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                disabled={isSubmitted}
                value={natAnswer}
                onChange={e => setNatAnswer(e.target.value)}
                placeholder="e.g. 28.5"
                className="bg-[#111827] border border-slate-700 text-white font-mono rounded-lg px-4 py-2.5 text-sm flex-1 focus:outline-none focus:border-indigo-500"
              />
              <button
                disabled={isSubmitted || !natAnswer.trim()}
                onClick={handleNatSubmit}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold rounded-lg text-xs transition"
              >
                Submit Answer
              </button>
            </div>
            {isSubmitted && (
              <div className="text-xs font-mono pt-1 text-slate-300">
                Official Answer Key: <strong className="text-emerald-400 font-bold">{question.answer}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submission Feedback Banner */}
      {isSubmitted && (
        <div className={`mt-4 p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 animate-fadeIn ${
          isCorrect 
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' 
            : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">
              {isCorrect 
                ? `Correct Answer! +${qMarks}.0 Marks awarded.` 
                : `Incorrect (${negMarks > 0 ? `-${negMarks} Marks` : '0 Negative Marks'}). Official Answer: ${question.answer}`}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Verified Key: {question.answer}
          </span>
        </div>
      )}

      {/* Action Footer: Hint, Explanation, Ask AI */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 hover:bg-amber-500/20 transition font-medium"
          >
            <Lightbulb className="w-3.5 h-3.5 shrink-0" />
            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/20 transition font-medium"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>{showExplanation ? 'Hide Solution & Theory' : 'Solution, Theory & Example'}</span>
          </button>
        </div>

        <button
          onClick={() => onAskAI(question)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1a233a] hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white font-semibold transition ml-auto sm:ml-0"
        >
          <Bot className="w-3.5 h-3.5 shrink-0 text-indigo-400 group-hover:text-white" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Hint Drawer */}
      {showHint && question.hint && (
        <div className="mt-4 p-4 bg-amber-950/20 border border-amber-500/25 rounded-xl text-xs text-amber-200 animate-fadeIn space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Lightbulb className="w-3.5 h-3.5 shrink-0" />
            Strategic Hint:
          </div>
          <p className="leading-relaxed text-amber-200/90">{question.hint}</p>
        </div>
      )}

      {/* Comprehensive Solution & Concept Drawer */}
      {showExplanation && (
        <div className="mt-4 p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4 animate-fadeIn text-xs sm:text-sm">
          {/* Solution Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2 overflow-x-auto">
            <div className="flex items-center gap-1 bg-[#111827] p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveSolutionTab('solution')}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  activeSolutionTab === 'solution' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Full Derivation
              </button>
              {question.core_concept && (
                <button
                  onClick={() => setActiveSolutionTab('concept')}
                  className={`px-3 py-1.5 rounded-md font-medium transition ${
                    activeSolutionTab === 'concept' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Core Concept
                </button>
              )}
              {question.example && (
                <button
                  onClick={() => setActiveSolutionTab('example')}
                  className={`px-3 py-1.5 rounded-md font-medium transition ${
                    activeSolutionTab === 'example' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Worked Example
                </button>
              )}
              {question.pitfall && (
                <button
                  onClick={() => setActiveSolutionTab('trap')}
                  className={`px-3 py-1.5 rounded-md font-medium transition ${
                    activeSolutionTab === 'trap' ? 'bg-rose-600/30 text-rose-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  GATE Trap
                </button>
              )}
            </div>

            <span className="font-mono text-emerald-400 font-bold px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs whitespace-nowrap">
              Answer: ({question.answer})
            </span>
          </div>

          {/* Tab Content Display */}
          {activeSolutionTab === 'concept' && question.core_concept && (
            <div className="p-4 bg-[#111827] rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-400 text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4 text-indigo-400" />
                Fundamental Theory & Theorems
              </div>
              <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                {question.core_concept}
              </p>
            </div>
          )}

          {activeSolutionTab === 'example' && question.example && (
            <div className="p-4 bg-[#111827] rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Intuitive Miniature Example & Analogy
              </div>
              <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                {question.example}
              </p>
            </div>
          )}

          {activeSolutionTab === 'trap' && question.pitfall && (
            <div className="p-4 bg-rose-950/20 rounded-xl border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-400 text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Common GATE Exam Trap to Avoid
              </div>
              <p className="text-rose-200/90 leading-relaxed text-xs sm:text-sm">
                {question.pitfall}
              </p>
            </div>
          )}

          {activeSolutionTab === 'solution' && (
            <div className="leading-relaxed text-slate-300 font-sans break-words overflow-x-auto space-y-2">
              <MathText text={question.explanation} />
            </div>
          )}

          {/* Quick AI Tutor Assist Link */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Need another derivation angle?
            </span>
            <button
              onClick={() => onAskAI(question)}
              className="flex items-center gap-1.5 font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              Consult AI Tutor for this problem <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
