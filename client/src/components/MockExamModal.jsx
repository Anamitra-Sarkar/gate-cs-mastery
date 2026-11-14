import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calculator, 
  CheckCircle, 
  AlertCircle, 
  Bookmark, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Award, 
  RotateCcw,
  LayoutGrid
} from 'lucide-react';
import MathText from './MathText';
import confetti from 'canvas-confetti';
import { evaluateGATEAnswer } from './QuestionCard';

export default function MockExamModal({ isOpen, onClose, allQuestions }) {
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [durationMins, setDurationMins] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Responses map: { [qId]: { selected: 'A' | ['A', 'B'], status: 'ANSWERED' | 'REVIEW' | 'ANS_REVIEW' | 'NOT_ANSWERED' } }
  const [responses, setResponses] = useState({});
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcInput, setCalcInput] = useState('0');
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);

  // Initialize Exam
  const startExam = (mins) => {
    setDurationMins(mins);
    setTimeLeft(mins * 60);
    // Pick well-balanced questions across topics
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const count = mins === 180 ? 65 : (mins === 60 ? 30 : 15);
    const selected = shuffled.slice(0, count);
    setExamQuestions(selected);
    
    // Init status
    const initialResp = {};
    selected.forEach((q) => {
      initialResp[q.id] = { selected: null, status: 'NOT_VISITED' };
    });
    setResponses(initialResp);
    setExamStarted(true);
    setExamSubmitted(false);
    setCurrentIndex(0);
  };

  // Timer tick
  useEffect(() => {
    if (!examStarted || examSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examStarted, examSubmitted]);

  const currentQ = examQuestions[currentIndex];

  const handleSelectOption = (opt) => {
    if (!currentQ) return;
    const isMSQ = currentQ.type === 'MSQ' || (typeof currentQ.answer === 'string' && currentQ.answer.includes(','));
    let newSelected;
    if (isMSQ) {
      const prev = responses[currentQ.id]?.selected;
      const currentList = Array.isArray(prev) ? prev : (prev ? String(prev).split(',').map(s => s.trim()) : []);
      newSelected = currentList.includes(opt) ? currentList.filter(x => x !== opt) : [...currentList, opt];
      newSelected = newSelected.sort();
    } else {
      newSelected = opt;
    }

    const hasSelection = Array.isArray(newSelected) ? newSelected.length > 0 : Boolean(newSelected);
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selected: newSelected,
        status: hasSelection 
          ? (prev[currentQ.id]?.status === 'REVIEW' ? 'ANS_REVIEW' : 'ANSWERED')
          : 'NOT_ANSWERED'
      }
    }));
  };

  const handleSaveAndNext = () => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selected: null,
        status: 'NOT_ANSWERED'
      }
    }));
  };

  const handleMarkForReview = () => {
    if (!currentQ) return;
    const userSel = responses[currentQ.id]?.selected;
    const hasSelection = Array.isArray(userSel) ? userSel.length > 0 : Boolean(userSel);
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        status: hasSelection ? 'ANS_REVIEW' : 'REVIEW'
      }
    }));
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
  };

  const computeScore = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    let totalMarksScored = 0;
    let maxMarks = 0;

    examQuestions.forEach(q => {
      const qMarks = q.marks || 1;
      maxMarks += qMarks;
      const userResp = responses[q.id]?.selected;
      const isMSQ = q.type === 'MSQ' || (typeof q.answer === 'string' && q.answer.includes(','));
      const isNAT = q.type === 'NAT' || (!q.options || q.options.length === 0);
      const neg = typeof q.negative_marks === 'number' ? q.negative_marks : (isNAT || isMSQ ? 0 : (qMarks === 2 ? 0.66 : 0.33));

      const hasSelection = userResp && (Array.isArray(userResp) ? userResp.length > 0 : Boolean(userResp));

      if (!hasSelection) {
        unattempted++;
      } else {
        const isCorrect = evaluateGATEAnswer(userResp, q.answer, isMSQ ? 'MSQ' : (isNAT ? 'NAT' : 'MCQ'));
        if (isCorrect) {
          correct++;
          totalMarksScored += qMarks;
        } else {
          wrong++;
          totalMarksScored -= neg;
        }
      }
    });

    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
    return {
      correct,
      wrong,
      unattempted,
      totalMarksScored: totalMarksScored.toFixed(2),
      maxMarks,
      accuracy
    };
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#fdfbf7] dark:bg-[#0f1117] border border-slate-300 dark:border-slate-800 rounded-3xl w-full max-w-6xl h-[95vh] sm:h-[92vh] flex flex-col shadow-2xl overflow-hidden relative transition-colors">
        
        {/* Top bar */}
        <div className="px-3 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 gap-2 backdrop-blur">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs font-bold rounded-lg">
              GATE Official CBT Mock
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hidden md:inline">
              CS & DA Real-time Simulation
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {examStarted && !examSubmitted && (
              <>
                <button
                  onClick={() => setMobilePaletteOpen(!mobilePaletteOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-blue-700 dark:text-blue-400 rounded-xl transition md:hidden"
                  title="Question Grid"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Q.{currentIndex + 1}/{examQuestions.length}</span>
                </button>

                <button
                  onClick={() => setCalcOpen(!calcOpen)}
                  className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 rounded-xl transition"
                >
                  <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="hidden sm:inline">GATE Calc</span>
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-rose-700 dark:text-rose-400 font-mono text-xs sm:text-sm font-bold">
                  <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 animate-pulse" />
                  {formatTime(timeLeft)}
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

        {/* Modal Content */}
        {!examStarted ? (
          /* Selection Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center space-y-6 overflow-y-auto">
            <div className="p-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 rounded-3xl text-blue-900 dark:text-blue-300 max-w-md shadow-sm">
              <Award className="w-12 h-12 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-serif font-bold text-slate-950 dark:text-white mb-1.5">Select GATE Mock Duration</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Experience authentic CBT simulation with official negative marking, question palette, and real GATE questions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              <button
                onClick={() => startExam(15)}
                className="p-6 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-2xl transition text-left group shadow-sm hover:shadow-md"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1">Rapid Sprint</div>
                <div className="text-2xl font-serif font-bold text-slate-950 dark:text-white mb-2">15 Mins</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">10 High-Yield Questions • Ideal for daily revision</div>
              </button>

              <button
                onClick={() => startExam(30)}
                className="p-6 bg-white dark:bg-[#13161f] border-2 border-blue-600 dark:border-blue-500 rounded-2xl transition text-left group shadow-sm hover:shadow-md ring-2 ring-blue-500/20"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">Standard Sectional</div>
                <div className="text-2xl font-serif font-bold text-slate-950 dark:text-white mb-2">30 Mins</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">15 Mixed Core CS & DA Questions • Recommended</div>
              </button>

              <button
                onClick={() => startExam(60)}
                className="p-6 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-2xl transition text-left group shadow-sm hover:shadow-md"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-1">Full Section</div>
                <div className="text-2xl font-serif font-bold text-slate-950 dark:text-white mb-2">60 Mins</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">30 Comprehensive Questions • Full GATE syllabus</div>
              </button>
            </div>
          </div>
        ) : examSubmitted ? (
          /* Results Screen */
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
            {(() => {
              const res = computeScore();
              return (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="text-center space-y-1.5">
                    <h3 className="text-2xl font-serif font-bold text-slate-950 dark:text-white">GATE Mock Examination Report</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Detailed performance analysis and percentile breakdown</p>
                  </div>

                  {/* Summary Scorecard */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl text-center shadow-sm">
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Total Score</div>
                      <div className="text-2xl sm:text-3xl font-serif font-bold text-blue-700 dark:text-blue-400">{res.totalMarksScored} <span className="text-xs text-slate-500 font-normal">/ {res.maxMarks}</span></div>
                    </div>
                    <div className="p-4 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl text-center shadow-sm">
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Accuracy</div>
                      <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700 dark:text-emerald-400">{res.accuracy}%</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl text-center shadow-sm">
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Correct Answers</div>
                      <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700 dark:text-emerald-400">{res.correct}</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl text-center shadow-sm">
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Incorrect Answers</div>
                      <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-700 dark:text-rose-400">{res.wrong}</div>
                    </div>
                  </div>

                  {/* Question Review List */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-serif font-bold text-slate-950 dark:text-slate-100">Question-by-Question Solution Breakdown</h4>
                    <div className="space-y-3">
                      {examQuestions.map((q, idx) => {
                        const userResp = responses[q.id]?.selected;
                        const isMSQ = q.type === 'MSQ' || (typeof q.answer === 'string' && q.answer.includes(','));
                        const isNAT = q.type === 'NAT' || (!q.options || q.options.length === 0);
                        const hasSelection = userResp && (Array.isArray(userResp) ? userResp.length > 0 : Boolean(userResp));
                        const isCorrect = hasSelection && evaluateGATEAnswer(userResp, q.answer, isMSQ ? 'MSQ' : (isNAT ? 'NAT' : 'MCQ'));
                        const qMarks = q.marks || 1;
                        const neg = typeof q.negative_marks === 'number' ? q.negative_marks : (isNAT || isMSQ ? 0 : (qMarks === 2 ? 0.66 : 0.33));
                        const displayResp = Array.isArray(userResp) ? userResp.join(', ') : userResp;
                        return (
                          <div key={q.id} className="p-5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Question {idx + 1} • {q.subject} ({q.topic})</span>
                              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg ${
                                !hasSelection 
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' 
                                  : (isCorrect ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-700')
                              }`}>
                                {!hasSelection ? 'Unattempted' : (isCorrect ? `+${qMarks}.0 Correct` : (neg > 0 ? `-${neg.toFixed(2)} Incorrect` : '0.0 Incorrect'))}
                              </span>
                            </div>
                            <div className="text-sm text-slate-950 dark:text-slate-50 font-medium overflow-x-auto break-words leading-relaxed">
                              <MathText text={q.question} />
                            </div>
                            <div className="text-xs font-mono flex flex-wrap gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <span className="text-slate-600 dark:text-slate-400">Your Answer: <strong className={isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>{displayResp || 'None'}</strong></span>
                              <span className="text-slate-600 dark:text-slate-400">Correct Key: <strong className="text-emerald-700 dark:text-emerald-400">{q.answer}</strong></span>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800/80 overflow-x-auto">
                              <MathText text={q.explanation} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <button
                      onClick={() => setExamStarted(false)}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-sm"
                    >
                      Take Another Mock
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-sm transition"
                    >
                      Exit to Question Bank
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* Active Examination Interface */
          <div className="flex-1 flex overflow-hidden relative">
            {/* Left Question Body */}
            <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-7 space-y-4 md:border-r border-slate-200 dark:border-slate-800">
              {currentQ && (
                <>
                  <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-serif font-bold text-slate-950 dark:text-white">Question {currentIndex + 1} of {examQuestions.length}</span>
                      <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs rounded-lg font-bold">
                        {currentQ.subject}
                      </span>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-400">
                      Marks: <span className="text-emerald-700 dark:text-emerald-400">+{currentQ.marks || 1}</span> / <span className="text-rose-700 dark:text-rose-400">-{currentQ.negative_marks || 0.33}</span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="text-base text-slate-950 dark:text-slate-50 font-normal leading-relaxed py-2 overflow-x-auto break-words">
                    <MathText text={currentQ.question} />
                  </div>

                  {/* Options */}
                  <div className="space-y-3 pt-2">
                    {currentQ.options && currentQ.options.length > 0 ? (
                      currentQ.options.map((opt) => {
                        const userSel = responses[currentQ.id]?.selected;
                        const isSelected = Array.isArray(userSel) 
                          ? userSel.includes(opt.label) 
                          : userSel === opt.label;
                        return (
                          <button
                            key={opt.label}
                            onClick={() => handleSelectOption(opt.label)}
                            className={`w-full text-left p-4 rounded-2xl border-2 flex items-start gap-3.5 transition shadow-sm ${
                              isSelected 
                                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 text-slate-950 dark:text-white' 
                                : 'bg-white dark:bg-[#13161f] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850/60'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                            }`}>
                              {opt.label}
                            </span>
                            <div className="pt-0.5 text-sm flex-1 overflow-x-auto break-words font-medium">
                              <MathText text={opt.text} />
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 shadow-sm">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-300">Numerical Answer Type (NAT):</label>
                        <input
                          type="text"
                          value={responses[currentQ.id]?.selected || ''}
                          onChange={(e) => handleSelectOption(e.target.value)}
                          placeholder="Enter exact numerical value"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white font-mono rounded-xl p-3 text-sm font-bold focus:border-blue-600"
                        />
                      </div>
                    )}
                  </div>

                  {/* Navigation Action Buttons */}
                  <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2">
                    <div className="contents sm:flex sm:gap-2">
                      <button
                        onClick={handleClearResponse}
                        className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 text-xs font-bold rounded-xl transition text-center"
                      >
                        Clear Response
                      </button>
                      <button
                        onClick={handleMarkForReview}
                        className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-bold rounded-xl transition text-center"
                      >
                        Review & Next
                      </button>
                    </div>

                    <div className="contents sm:flex sm:gap-2">
                      <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-800 dark:text-slate-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Prev
                      </button>
                      <button
                        onClick={handleSaveAndNext}
                        className="px-4 py-2 bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Question Palette (Desktop) */}
            <div className="w-72 bg-slate-50 dark:bg-[#13161f] p-5 flex flex-col justify-between hidden md:flex shrink-0 border-l border-slate-200 dark:border-slate-800">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Question Palette
                </h4>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-600 shrink-0" /> Answered
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-rose-600 shrink-0" /> Unanswered
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-purple-600 shrink-0" /> Review
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-700 shrink-0" /> Not Visited
                  </div>
                </div>

                {/* Numbers Grid */}
                <div className="grid grid-cols-5 gap-2 max-h-[360px] overflow-y-auto pr-1">
                  {examQuestions.map((q, idx) => {
                    const st = responses[q.id]?.status;
                    let bg = 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold';
                    if (st === 'ANSWERED') bg = 'bg-emerald-600 text-white font-bold';
                    else if (st === 'NOT_ANSWERED') bg = 'bg-rose-600 text-white font-bold';
                    else if (st === 'REVIEW') bg = 'bg-purple-600 text-white font-bold';
                    else if (st === 'ANS_REVIEW') bg = 'bg-purple-600 text-white font-bold ring-2 ring-emerald-500';

                    const isCurrent = currentIndex === idx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-full aspect-square rounded-xl text-xs flex items-center justify-center transition ${bg} ${
                          isCurrent ? 'ring-2 ring-blue-600 scale-105' : 'hover:opacity-85'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitExam}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                Submit Examination
              </button>
            </div>

            {/* Mobile Question Palette Drawer */}
            {mobilePaletteOpen && (
              <div className="absolute inset-0 bg-[#fdfbf7]/95 dark:bg-[#0f1117]/95 z-30 p-4 flex flex-col md:hidden animate-fadeIn backdrop-blur">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                    Question Palette ({examQuestions.length} Questions)
                  </h4>
                  <button
                    onClick={() => setMobilePaletteOpen(false)}
                    className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2.5 py-4 overflow-y-auto flex-1">
                  {examQuestions.map((q, idx) => {
                    const st = responses[q.id]?.status;
                    let bg = 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold';
                    if (st === 'ANSWERED') bg = 'bg-emerald-600 text-white font-bold';
                    else if (st === 'NOT_ANSWERED') bg = 'bg-rose-600 text-white font-bold';
                    else if (st === 'REVIEW') bg = 'bg-purple-600 text-white font-bold';
                    else if (st === 'ANS_REVIEW') bg = 'bg-purple-600 text-white font-bold ring-2 ring-emerald-500';

                    const isCurrent = currentIndex === idx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => { setCurrentIndex(idx); setMobilePaletteOpen(false); }}
                        className={`w-full aspect-square rounded-xl text-xs flex items-center justify-center transition ${bg} ${
                          isCurrent ? 'ring-2 ring-blue-600 scale-105' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleSubmitExam}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Submit Examination
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scientific Calculator Popup */}
        {calcOpen && (
          <div className="absolute top-14 right-2 sm:right-6 w-[280px] max-w-[92vw] bg-white dark:bg-[#13161f] border border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 shadow-2xl z-50 animate-pop">
            <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200">TCS iON Scientific Calc</span>
              <button onClick={() => setCalcOpen(false)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2.5 bg-slate-100 dark:bg-slate-950 font-mono text-right text-emerald-800 dark:text-emerald-400 font-bold rounded-xl mb-2 text-base overflow-x-auto border border-slate-200 dark:border-slate-800">
              {calcInput}
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
              {['sin', 'cos', 'tan', 'C', 'log', 'ln', 'sqrt', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '(', ')'].map(btn => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === 'C') setCalcInput('0');
                    else if (btn === 'sqrt') {
                      try { setCalcInput(String(Math.sqrt(parseFloat(calcInput)))); } catch (e) {}
                    } else if (btn === 'log') {
                      try { setCalcInput(String(Math.log10(parseFloat(calcInput)))); } catch (e) {}
                    } else if (btn === 'ln') {
                      try { setCalcInput(String(Math.log(parseFloat(calcInput)))); } catch (e) {}
                    } else if (btn === 'sin') {
                      try { setCalcInput(String(Math.sin(parseFloat(calcInput) * Math.PI / 180).toFixed(4))); } catch (e) {}
                    } else if (btn === 'cos') {
                      try { setCalcInput(String(Math.cos(parseFloat(calcInput) * Math.PI / 180).toFixed(4))); } catch (e) {}
                    } else {
                      setCalcInput(calcInput === '0' ? btn : calcInput + btn);
                    }
                  }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-center font-bold transition"
                >
                  {btn}
                </button>
              ))}
              <button
                onClick={() => {
                  try {
                    const sanitized = calcInput.replace(/[^0-9+\-*/.()]/g, '');
                    setCalcInput(String(Function(`'use strict'; return (${sanitized})`)()));
                  } catch (e) {
                    setCalcInput('Err');
                  }
                }}
                className="col-span-4 p-2.5 bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-xl text-center transition mt-1 shadow-sm"
              >
                =
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}