import React, { useState } from 'react';
import { Bookmark, Sparkles, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import QuestionCard from './QuestionCard';

export default function RevisionDeck({ 
  bookmarks = [], 
  attempts = {}, 
  allQuestions = [], 
  onToggleBookmark, 
  onAskAI, 
  onRecordAttempt 
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'bookmarked' | 'mistakes'

  // Mistakes: questions where attempt.isCorrect === false
  const mistakeIds = Object.keys(attempts).filter(qId => attempts[qId] && !attempts[qId].isCorrect);
  
  let targetIds = [];
  if (activeFilter === 'bookmarked') {
    targetIds = bookmarks;
  } else if (activeFilter === 'mistakes') {
    targetIds = mistakeIds;
  } else {
    // Union of bookmarks + mistakes
    targetIds = Array.from(new Set([...bookmarks, ...mistakeIds]));
  }

  const reviewQuestions = allQuestions.filter(q => targetIds.includes(q.id));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="academic-card p-6 sm:p-7 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Mistake Notebook & Spaced Repetition</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Review questions you bookmarked or answered incorrectly during tests until you achieve 100% mastery.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-850 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeFilter === 'all' 
                ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-sm font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Review Deck ({targetIds.length})
          </button>
          <button
            onClick={() => setActiveFilter('bookmarked')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeFilter === 'bookmarked' 
                ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-sm font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bookmarked ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveFilter('mistakes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeFilter === 'mistakes' 
                ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-sm font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Test Mistakes ({mistakeIds.length})
          </button>
        </div>
      </div>

      {/* Questions list */}
      {reviewQuestions.length === 0 ? (
        <div className="academic-card p-12 text-center rounded-2xl space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">Revision Deck Clean!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            You currently have no bookmarked or flagged mistake questions in this category. Solve questions in Practice or CBT Mock mode to build your personalized revision notebook.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviewQuestions.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              isBookmarked={bookmarks.includes(q.id)}
              onToggleBookmark={onToggleBookmark}
              onAskAI={onAskAI}
              onRecordAttempt={onRecordAttempt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
