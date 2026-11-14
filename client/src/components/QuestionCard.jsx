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
  ArrowRight
} from 'lucide-react';
import MathText from './MathText';
import confetti from 'canvas-confetti';

export function evaluateGATEAnswer(userAns, officialAnswer, qType = 'MCQ') {
  if (!userAns && userAns !== 0) return false;
  const cleanUser = String(userAns).trim().toUpperCase();
  const cleanKey = String(officialAnswer).trim().toUpperCase();

  // 1. MSQ handling (comma separated or multi-character)
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
    // Range with "TO" or "-" or ":"
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
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
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
    <div className={`p-4 sm:p-6 rounded-2xl bg-slate-900 border transition-all duration-300 shadow-xl ${
      isSubmitted 
        ? (isCorrect ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-rose-500/40 bg-rose-950/10') 
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Question Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="px-2.5 py-0.5 rounded-md font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            {paperLabel} {question.q_no ? `• Q.${question.q_no}` : ''}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
            {question.subject}
          </span>
          <span className="text-slate-400 font-mono text-[11px] truncate max-w-[200px] sm:max-w-none">
            • {question.topic}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            isMSQ ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
            (isNAT ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30')
          }`}>
            {isMSQ ? 'MSQ' : (isNAT ? 'NAT' : 'MCQ')}
          </span>
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
      <div className="py-4 text-sm sm:text-base text-slate-100 font-normal leading-relaxed break-words overflow-x-auto">
        <MathText text={question.question} />
      </div>

      {/* SVG Diagram Visualizer (if present) */}
      {question.visual && (
        <div 
          className="my-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-x-auto max-w-full"
          dangerouslySetInnerHTML={{ __html: question.visual }}
        />
      )}

      {/* Options / Input Block */}
      <div className="space-y-2.5 pt-2">
        {question.options && question.options.length > 0 ? (
          <>
            {isMSQ && !isSubmitted && (
              <p className="text-[11px] font-semibold text-purple-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" /> Multiple Choice Select (MSQ): Select all correct choices and submit.
              </p>
            )}

            {question.options.map(opt => {
              const labelUpper = String(opt.label).trim().toUpperCase();
              const keyList = String(question.answer).split(',').map(s => s.trim().toUpperCase());
              const isAnswerKey = keyList.includes(labelUpper);

              const isSelected = isMSQ 
                ? selectedMsqOptions.includes(opt.label)
                : selectedOption === opt.label;

              let optionStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60';
              if (isSubmitted) {
                if (isAnswerKey) {
                  optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-medium shadow-md shadow-emerald-500/20';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                } else {
                  optionStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
                }
              } else if (isMSQ && isSelected) {
                optionStyle = 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-md shadow-purple-500/10';
              }

              return (
                <button
                  key={opt.label}
                  disabled={isSubmitted}
                  onClick={() => isMSQ ? handleToggleMSQ(opt.label) : handleSelectMCQ(opt.label)}
                  className={`w-full text-left p-3 sm:p-3.5 rounded-xl border flex items-start gap-3 transition-all ${optionStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    isSubmitted && isAnswerKey 
                      ? 'bg-emerald-500 text-slate-950' 
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold rounded-lg text-xs transition flex items-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  <CheckSquare className="w-4 h-4" />
                  Submit MSQ Response ({selectedMsqOptions.length} selected)
                </button>
              </div>
            )}
          </>
        ) : (
          /* NAT Input */
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <label className="text-xs font-semibold text-slate-400">
              Enter Numerical Value (NAT):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
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
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium rounded-lg text-xs transition whitespace-nowrap"
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

      {/* Result feedback alert when submitted */}
      {isSubmitted && (
        <div className={`mt-4 p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
          isCorrect 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-semibold">
              {isCorrect 
                ? `Excellent! Correct Answer (+${qMarks} Marks awarded).` 
                : `Incorrect (${negMarks > 0 ? `-${negMarks} Marks` : '0 Negative Marks'}). Review the step-by-step concept breakdown below:`}
            </span>
          </div>
          <span className="font-mono text-[11px] opacity-80 hidden sm:inline">
            Official Key: {question.answer}
          </span>
        </div>
      )}

      {/* Action Footer: Hint, Explanation, Ask AI */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition font-medium"
          >
            <Lightbulb className="w-3.5 h-3.5 shrink-0" />
            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 transition font-medium"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>{showExplanation ? 'Hide Concept & Solution' : 'Concept, Example & Solution'}</span>
          </button>
        </div>

        <button
          onClick={() => onAskAI(question)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white font-semibold transition ml-auto sm:ml-0"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white shrink-0" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Hint Drawer */}
      {showHint && question.hint && (
        <div className="mt-3 p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200 animate-fadeIn space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Lightbulb className="w-3.5 h-3.5 shrink-0" />
            Strategic Hint:
          </div>
          <p className="leading-relaxed">{question.hint}</p>
        </div>
      )}

      {/* Detailed Concept & Explanation Drawer */}
      {showExplanation && (
        <div className="mt-4 p-4 sm:p-5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 space-y-4 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 font-bold gap-2 text-indigo-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Verified GATE Explanation & First-Principles Solution
            </span>
            <span className="font-mono text-emerald-400 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
              Answer: ({question.answer})
            </span>
          </div>

          {/* Quick Concept Spotlight Cards */}
          {(question.core_concept || question.example || question.pitfall) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Concept */}
              {question.core_concept && (
                <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-300 text-xs">
                    <Compass className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                    Core Theory & Law
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    {question.core_concept}
                  </p>
                </div>
              )}

              {/* Example */}
              {question.example && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-xs">
                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    Worked Example / Analogy
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    {question.example}
                  </p>
                </div>
              )}

              {/* Common Pitfall */}
              {question.pitfall && (
                <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-300 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                    Common GATE Trap
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    {question.pitfall}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Full Structured Solution */}
          <div className="pt-2 leading-relaxed text-slate-300 font-sans break-words overflow-x-auto">
            <MathText text={question.explanation} />
          </div>

          {/* Deep Dive AI Prompt CTA */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Need more clarification on this problem?
            </span>
            <button
              onClick={() => onAskAI(question)}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              Ask AI Assistant for alternate proofs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
