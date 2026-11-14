import React, { useState, useEffect } from 'react';
import { Clock, Calculator, CheckCircle, AlertCircle, Bookmark, ChevronRight, ChevronLeft, X, Award, RotateCcw } from 'lucide-react';
import MathText from './MathText';
import confetti from 'canvas-confetti';

export default function MockExamModal({ isOpen, onClose, allQuestions }) {
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [durationMins, setDurationMins] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Responses map: { [qId]: { selected: 'A', status: 'ANSWERED' | 'REVIEW' | 'ANS_REVIEW' | 'NOT_ANSWERED' } }
  const [responses, setResponses] = useState({});
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcInput, setCalcInput] = useState('0');

  // Initialize Exam
  const startExam = (mins) => {
    setDurationMins(mins);
    setTimeLeft(mins * 60);
    // Pick 20 to 30 well-balanced questions across topics
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const count = mins === 180 ? 65 : (mins === 60 ? 30 : 15);
    const selected = shuffled.slice(0, count);
    setExamQuestions(selected);
    
    // Init status
    const initialResp = {};
    selected.forEach((q, idx) => {
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
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selected: opt,
        status: prev[currentQ.id]?.status === 'REVIEW' ? 'ANS_REVIEW' : 'ANSWERED'
      }
    }));
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: {
        selected: null,
        status: 'NOT_ANSWERED'
      }
    }));
  };

  const handleMarkForReview = () => {
    if (!currentQ) return;
    const current = responses[currentQ.id];
    const newStatus = current?.selected ? 'ANS_REVIEW' : 'REVIEW';
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        status: newStatus
      }
    }));
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSaveAndNext = () => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  // Calculate Results
  const computeScore = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    let totalMarksScored = 0;
    let maxMarks = 0;

    examQuestions.forEach(q => {
      const qMarks = q.marks || 1;
      maxMarks += qMarks;
      const resp = responses[q.id];
      if (resp && resp.selected) {
        if (String(resp.selected).trim().toUpperCase() === String(q.answer).trim().toUpperCase()) {
          correct += 1;
          totalMarksScored += qMarks;
        } else {
          wrong += 1;
          totalMarksScored -= (q.negative_marks || (qMarks === 2 ? 0.66 : 0.33));
        }
      } else {
        unattempted += 1;
      }
    });

    totalMarksScored = Math.max(0, totalMarksScored);
    const accuracy = (correct + wrong) > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top bar */}
        <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 text-xs font-bold rounded">
              GATE Official CBT Mock
            </span>
            <span className="text-sm font-semibold text-slate-200 hidden md:inline">
              Computer Science & Data Science Examination
            </span>
          </div>

          <div className="flex items-center gap-4">
            {examStarted && !examSubmitted && (
              <>
                <button
                  onClick={() => setCalcOpen(!calcOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg transition"
                >
                  <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                  GATE Scientific Calc
                </button>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 font-mono text-sm font-bold">
                  <Clock className="w-4 h-4 animate-pulse" />
                  {formatTime(timeLeft)}
                </div>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {!examStarted ? (
          /* Selection Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400 max-w-md">
              <Award className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-1">Select GATE Mock Duration</h3>
              <p className="text-xs text-slate-300">
                Experience the authentic examination layout with official negative marking and real GATE PYQs!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              <button
                onClick={() => startExam(15)}
                className="p-6 bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-xl transition text-left group"
              >
                <div className="text-sm font-bold text-indigo-400 mb-1">Rapid Sprint Mock</div>
                <div className="text-2xl font-bold text-white mb-2">15 Mins</div>
                <div className="text-xs text-slate-400">10 High-Yield Questions • Ideal for daily revision</div>
              </button>

              <button
                onClick={() => startExam(30)}
                className="p-6 bg-slate-900 border border-indigo-500/50 bg-indigo-500/5 hover:border-indigo-500 rounded-xl transition text-left group ring-1 ring-indigo-500/30"
              >
                <div className="text-sm font-bold text-emerald-400 mb-1">Standard Sectional Mock</div>
                <div className="text-2xl font-bold text-white mb-2">30 Mins</div>
                <div className="text-xs text-slate-400">15 Mixed Core CS & DA Questions • Recommended</div>
              </button>

              <button
                onClick={() => startExam(60)}
                className="p-6 bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-xl transition text-left group"
              >
                <div className="text-sm font-bold text-purple-400 mb-1">Full Section Mock</div>
                <div className="text-2xl font-bold text-white mb-2">60 Mins</div>
                <div className="text-xs text-slate-400">30 Comprehensive Questions • Full GATE syllabus</div>
              </button>
            </div>
          </div>
        ) : examSubmitted ? (
          /* Results Screen */
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {(() => {
              const res = computeScore();
              return (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-extrabold text-white">GATE Mock Examination Report</h3>
                    <p className="text-sm text-slate-400">Detailed performance analysis and percentile forecast</p>
                  </div>

                  {/* Summary Scorecard */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                      <div className="text-xs text-slate-400 mb-1">Total Score</div>
                      <div className="text-3xl font-extrabold text-indigo-400">{res.totalMarksScored} <span className="text-xs text-slate-400">/ {res.maxMarks}</span></div>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                      <div className="text-xs text-slate-400 mb-1">Accuracy</div>
                      <div className="text-3xl font-extrabold text-emerald-400">{res.accuracy}%</div>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                      <div className="text-xs text-slate-400 mb-1">Correct Answers</div>
                      <div className="text-3xl font-extrabold text-emerald-400">{res.correct}</div>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                      <div className="text-xs text-slate-400 mb-1">Incorrect Answers</div>
                      <div className="text-3xl font-extrabold text-rose-400">{res.wrong}</div>
                    </div>
                  </div>

                  {/* Question Review List */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-200">Question-by-Question Solution Breakdown</h4>
                    <div className="space-y-3">
                      {examQuestions.map((q, idx) => {
                        const userResp = responses[q.id]?.selected;
                        const isCorrect = userResp && String(userResp).trim().toUpperCase() === String(q.answer).trim().toUpperCase();
                        return (
                          <div key={q.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-400">Question {idx + 1} • {q.subject} ({q.topic})</span>
                              <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                                !userResp ? 'bg-slate-800 text-slate-400' : (isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400')
                              }`}>
                                {!userResp ? 'Unattempted' : (isCorrect ? '+1.0 Correct' : '-0.33 Incorrect')}
                              </span>
                            </div>
                            <div className="text-sm text-slate-200">
                              <MathText text={q.question} />
                            </div>
                            <div className="text-xs font-mono flex gap-4 pt-1 border-t border-slate-800/80">
                              <span className="text-slate-400">Your Answer: <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{userResp || 'None'}</strong></span>
                              <span className="text-slate-400">Correct Key: <strong className="text-emerald-400">{q.answer}</strong></span>
                            </div>
                            <div className="p-3 bg-slate-950/70 rounded-lg text-xs text-slate-300 border border-slate-800">
                              <MathText text={q.explanation} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-4">
                    <button
                      onClick={() => setExamStarted(false)}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition"
                    >
                      Take Another Mock
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition"
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
          <div className="flex-1 flex overflow-hidden">
            {/* Left Question Body */}
            <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-4 border-r border-slate-800">
              {currentQ && (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Question {currentIndex + 1} of {examQuestions.length}</span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded font-medium">
                        {currentQ.subject}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      Marks: <span className="text-emerald-400">+{currentQ.marks || 1}</span> / <span className="text-rose-400">-{currentQ.negative_marks || 0.33}</span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="text-base text-slate-100 font-normal leading-relaxed py-2">
                    <MathText text={currentQ.question} />
                  </div>

                  {/* Options */}
                  <div className="space-y-3 pt-2">
                    {currentQ.options && currentQ.options.length > 0 ? (
                      currentQ.options.map((opt) => {
                        const isSelected = responses[currentQ.id]?.selected === opt.label;
                        return (
                          <button
                            key={opt.label}
                            onClick={() => handleSelectOption(opt.label)}
                            className={`w-full text-left p-4 rounded-xl border flex items-start gap-3 transition ${
                              isSelected 
                                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {opt.label}
                            </span>
                            <div className="pt-0.5 text-sm flex-1">
                              <MathText text={opt.text} />
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                        <label className="text-xs font-semibold text-slate-400">Numerical Answer Type (NAT):</label>
                        <input
                          type="text"
                          value={responses[currentQ.id]?.selected || ''}
                          onChange={(e) => handleSelectOption(e.target.value)}
                          placeholder="Enter exact numerical value"
                          className="w-full bg-slate-950 border border-slate-700 text-white font-mono rounded-lg p-3 text-sm focus:border-indigo-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Navigation Action Buttons */}
                  <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearResponse}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
                      >
                        Clear Response
                      </button>
                      <button
                        onClick={handleMarkForReview}
                        className="px-3.5 py-2 bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold rounded-lg transition"
                      >
                        Mark for Review & Next
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </button>
                      <button
                        onClick={handleSaveAndNext}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-md shadow-indigo-600/30"
                      >
                        Save & Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Question Palette */}
            <div className="w-72 bg-slate-900 p-5 flex flex-col justify-between hidden md:flex">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question Palette
                </h4>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-600" /> Answered
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-rose-600" /> Unanswered
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-purple-600" /> Review
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-slate-700" /> Not Visited
                  </div>
                </div>

                {/* Numbers Grid */}
                <div className="grid grid-cols-5 gap-2 max-h-[360px] overflow-y-auto pr-1">
                  {examQuestions.map((q, idx) => {
                    const st = responses[q.id]?.status;
                    let bg = 'bg-slate-800 text-slate-400';
                    if (st === 'ANSWERED') bg = 'bg-emerald-600 text-white font-bold';
                    else if (st === 'NOT_ANSWERED') bg = 'bg-rose-600 text-white font-bold';
                    else if (st === 'REVIEW') bg = 'bg-purple-600 text-white font-bold';
                    else if (st === 'ANS_REVIEW') bg = 'bg-purple-600 text-white font-bold ring-2 ring-emerald-400';

                    const isCurrent = currentIndex === idx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-full aspect-square rounded-lg text-xs flex items-center justify-center transition ${bg} ${
                          isCurrent ? 'ring-2 ring-indigo-400 scale-105' : 'hover:opacity-80'
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
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/30"
              >
                Submit Examination
              </button>
            </div>
          </div>
        )}

        {/* Scientific Calculator Popup */}
        {calcOpen && (
          <div className="absolute top-16 right-8 w-64 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-50 animate-pop">
            <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">TCS iON Scientific Calc</span>
              <button onClick={() => setCalcOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-2 bg-slate-950 font-mono text-right text-emerald-400 font-bold rounded mb-2 text-sm overflow-x-auto">
              {calcInput}
            </div>
            <div className="grid grid-cols-4 gap-1 text-xs font-mono">
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
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-center transition"
                >
                  {btn}
                </button>
              ))}
              <button
                onClick={() => {
                  try {
                    // Safe evaluation of basic math
                    const sanitized = calcInput.replace(/[^0-9+\-*/.()]/g, '');
                    setCalcInput(String(Function(`'use strict'; return (${sanitized})`)()));
                  } catch (e) {
                    setCalcInput('Err');
                  }
                }}
                className="col-span-4 p-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-center transition mt-1"
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
