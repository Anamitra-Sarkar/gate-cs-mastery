import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TopicGrid from './components/TopicGrid';
import QuestionCard from './components/QuestionCard';
import MockExamModal from './components/MockExamModal';
import SpeedRunModal from './components/SpeedRunModal';
import VisualizersModal from './components/VisualizersModal';
import AIAssistantDrawer from './components/AIAssistantDrawer';
import ScratchpadModal from './components/ScratchpadModal';
import RevisionDeck from './components/RevisionDeck';
import { 
  Filter, 
  Search, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  RefreshCw,
  BookOpen,
  Award,
  RotateCcw
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('practice'); // 'topics' | 'practice' | 'revision'
  
  // Theme State: 'light' (Warm Academic Paper) | 'dark' (Midnight Stone)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('gate_theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('gate_theme', theme);
  }, [theme]);
  
  // Data State
  const [topics, setTopics] = useState({});
  const [questions, setQuestions] = useState([]);
  const [allQuestionsList, setAllQuestionsList] = useState([]); // for mock exams
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedSubtopic, setSelectedSubtopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Real Device-Cached User Stats & Progress
  const STATS_KEY = 'gate_cs_mastery_user_stats';

  const [stats, setStats] = useState(() => {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const today = new Date().toISOString().slice(0, 10);
        const last = parsed.lastActiveDate;
        if (last && last !== today) {
          const diffDays = Math.round((new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            parsed.streak = (parsed.streak || 1) + 1;
          } else if (diffDays > 1) {
            parsed.streak = 1;
          }
          parsed.lastActiveDate = today;
          localStorage.setItem(STATS_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {}

    return {
      xp: 0,
      streak: 1,
      level: 1,
      totalAttempted: 0,
      totalCorrect: 0,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      bookmarks: [],
      attempts: {},
      subjectStats: {}
    };
  });

  // Modal States
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [activeQuestionForAI, setActiveQuestionForAI] = useState(null);
  const [isVisualizersOpen, setIsVisualizersOpen] = useState(false);
  const [isMockExamOpen, setIsMockExamOpen] = useState(false);
  const [isSpeedRunOpen, setIsSpeedRunOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

  // 1. Initial Load of Topics & User Stats
  useEffect(() => {
    fetch('/api/topics')
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(e => console.error('Failed to load topics:', e));

    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(e => console.error('Failed to load stats:', e));

    // Prefetch pool for mock exam & speed run
    fetch('/api/questions?limit=2500')
      .then(res => res.json())
      .then(data => setAllQuestionsList(data.questions || []))
      .catch(e => console.error('Failed to prefetch questions pool:', e));
  }, []);

  // 2. Fetch Questions when filters or page changes
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '15'
    });
    if (selectedSubject !== 'All') params.append('subject', selectedSubject);
    if (selectedSubtopic !== 'All') params.append('subtopic', selectedSubtopic);
    if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
    if (selectedType !== 'All') params.append('type', selectedType);
    if (selectedYear !== 'All') params.append('year', selectedYear);
    if (searchTerm.trim()) params.append('search', searchTerm.trim());

    fetch(`/api/questions?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || []);
        setTotalQuestions(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch(e => console.error('Failed to fetch questions:', e))
      .finally(() => setLoading(false));
  }, [selectedSubject, selectedSubtopic, selectedDifficulty, selectedType, selectedYear, searchTerm, page]);

  // Handlers
  const handleSelectTopicFromGrid = (subj) => {
    setSelectedSubject(subj);
    setSelectedSubtopic('All');
    setPage(1);
    setCurrentTab('practice');
  };

  const handleSelectSubtopicFromGrid = (subj, subtop) => {
    setSelectedSubject(subj);
    setSelectedSubtopic(subtop);
    setPage(1);
    setCurrentTab('practice');
  };

  const handleToggleBookmark = (qId) => {
    setStats(prev => {
      const bms = prev.bookmarks || [];
      const updated = bms.includes(qId) 
        ? bms.filter(id => id !== qId)
        : [...bms, qId];
      const newStats = { ...prev, bookmarks: updated };
      try { localStorage.setItem(STATS_KEY, JSON.stringify(newStats)); } catch (e) {}
      return newStats;
    });

    fetch('/api/bookmarks/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: qId })
    }).catch(() => {});
  };

  const handleRecordAttempt = (questionId, selected, isCorrect, timeSpent) => {
    const qObj = questions.find(q => q.id === questionId) || allQuestionsList.find(q => q.id === questionId);
    const subj = qObj?.subject || 'General Aptitude';

    setStats(prev => {
      const prevAttempts = prev.attempts || {};
      const alreadyAnswered = !!prevAttempts[questionId];
      
      // Real XP Award: +20 XP for correct, +5 XP for attempt (only once per unique question)
      const xpGained = alreadyAnswered ? 0 : (isCorrect ? 20 : 5);
      const newXP = (prev.xp || 0) + xpGained;
      const newLevel = Math.floor(newXP / 100) + 1;

      const subjStat = prev.subjectStats?.[subj] || { attempted: 0, correct: 0 };
      const updatedSubjectStats = {
        ...(prev.subjectStats || {}),
        [subj]: {
          attempted: subjStat.attempted + (alreadyAnswered ? 0 : 1),
          correct: subjStat.correct + (!alreadyAnswered && isCorrect ? 1 : 0)
        }
      };

      const newStats = {
        ...prev,
        xp: newXP,
        level: newLevel,
        totalAttempted: (prev.totalAttempted || 0) + (alreadyAnswered ? 0 : 1),
        totalCorrect: (prev.totalCorrect || 0) + (!alreadyAnswered && isCorrect ? 1 : 0),
        attempts: {
          ...prevAttempts,
          [questionId]: { selected, isCorrect, timeSpent, timestamp: Date.now() }
        },
        subjectStats: updatedSubjectStats,
        lastActiveDate: new Date().toISOString().slice(0, 10)
      };

      try { localStorage.setItem(STATS_KEY, JSON.stringify(newStats)); } catch (e) {}
      return newStats;
    });

    fetch('/api/stats/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, selected, isCorrect, timeSpent })
    }).catch(() => {});
  };

  const handleAskAI = (question) => {
    setActiveQuestionForAI(question);
    setIsAIModalOpen(true);
  };

  const handleResetProgress = () => {
    const freshStats = {
      xp: 0,
      streak: 1,
      level: 1,
      totalAttempted: 0,
      totalCorrect: 0,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      bookmarks: [],
      attempts: {},
      subjectStats: {}
    };
    setStats(freshStats);
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(freshStats));
    } catch (e) {}
  };

  const handleResetFilters = () => {
    setSelectedSubject('All');
    setSelectedSubtopic('All');
    setSelectedDifficulty('All');
    setSelectedType('All');
    setSelectedYear('All');
    setSearchTerm('');
    setPage(1);
  };

  const hasActiveFilters = selectedSubject !== 'All' || selectedDifficulty !== 'All' || selectedType !== 'All' || selectedYear !== 'All' || searchTerm.trim();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-paper)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        stats={stats}
        theme={theme}
        setTheme={setTheme}
        onOpenAI={() => { setActiveQuestionForAI(questions[0] || null); setIsAIModalOpen(true); }}
        onOpenVisualizers={() => setIsVisualizersOpen(true)}
        onOpenMock={() => setIsMockExamOpen(true)}
        onOpenSpeedRun={() => setIsSpeedRunOpen(true)}
        onOpenScratchpad={() => setIsScratchpadOpen(true)}
        onResetProgress={handleResetProgress}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 pb-36 lg:pb-12">
        
        {/* VIEW 1: TOPIC SYLLABUS GRID */}
        {currentTab === 'topics' && (
          <TopicGrid
            topics={topics}
            stats={stats}
            onSelectTopic={handleSelectTopicFromGrid}
            onSelectSubtopic={handleSelectSubtopicFromGrid}
          />
        )}

        {/* VIEW 2: QUESTION PRACTICE PLAYER */}
        {currentTab === 'practice' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar: Academic Card */}
            <div className="academic-card p-5 sm:p-6 rounded-3xl space-y-4 shadow-sm">
              
              {/* Row 1: Search + Format Segmented Control */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    placeholder="Search keywords, formulas, algorithms (e.g. Dijkstra, Paging, B+ Tree)..."
                    className="w-full bg-white dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-950 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition shadow-inner font-medium"
                  />
                </div>

                {/* Segmented Format Pills: All / MCQ / MSQ / NAT */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0b0f19] p-1 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm self-start md:self-auto shrink-0 shadow-sm overflow-x-auto max-w-full">
                  {['All', 'MCQ', 'MSQ', 'NAT'].map(ft => (
                    <button
                      key={ft}
                      onClick={() => { setSelectedType(ft); setPage(1); }}
                      className={`px-3.5 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                        selectedType === ft 
                          ? 'bg-slate-950 text-white dark:bg-blue-600 dark:text-white shadow-sm' 
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      {ft === 'All' ? 'All Formats' : ft}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: Responsive Dropdown Selects Grid for Subject, Subtopic, Year, Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 text-xs sm:text-sm">
                
                {/* Subject Selector */}
                <select
                  value={selectedSubject}
                  onChange={e => { setSelectedSubject(e.target.value); setSelectedSubtopic('All'); setPage(1); }}
                  className="w-full bg-white dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 cursor-pointer shadow-sm font-semibold truncate"
                >
                  <option value="All">All Subjects ({totalQuestions})</option>
                  {Object.keys(topics).map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>

                {/* Subtopic Selector */}
                <select
                  value={selectedSubtopic}
                  onChange={e => { setSelectedSubtopic(e.target.value); setPage(1); }}
                  disabled={selectedSubject === 'All'}
                  className="w-full bg-white dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 cursor-pointer shadow-sm font-semibold disabled:opacity-50 truncate"
                >
                  <option value="All">{selectedSubject === 'All' ? 'Select a Subject First' : 'All Subtopics'}</option>
                  {selectedSubject !== 'All' && topics[selectedSubject]?.subtopics && (
                    Object.keys(topics[selectedSubject].subtopics).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))
                  )}
                </select>

                {/* Year Selector (Modern First: 2025 -> 1991) */}
                <select
                  value={selectedYear}
                  onChange={e => { setSelectedYear(e.target.value); setPage(1); }}
                  className="w-full bg-white dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 cursor-pointer font-mono font-semibold shadow-sm truncate"
                >
                  <option value="All">All Exam Years (2025–1991)</option>
                  {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2016, 2014, 2013, 2012, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991].map(yr => (
                    <option key={yr} value={yr}>GATE {yr}</option>
                  ))}
                </select>

                {/* Difficulty Selector */}
                <select
                  value={selectedDifficulty}
                  onChange={e => { setSelectedDifficulty(e.target.value); setPage(1); }}
                  className="w-full bg-white dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 cursor-pointer shadow-sm font-semibold truncate"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy (1 Mark)</option>
                  <option value="Medium">Medium (2 Marks)</option>
                  <option value="Hard">Hard (Multi-Concept)</option>
                </select>
              </div>

              {/* Reset Filters Bar */}
              {hasActiveFilters && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition font-bold border border-slate-300 dark:border-slate-700 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Questions Feed */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-7 h-7 text-amber-600 dark:text-amber-400 animate-spin mx-auto" />
                <p className="text-sm text-slate-800 dark:text-slate-200 font-bold font-serif">Fetching authentic questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="academic-card py-16 text-center rounded-2xl space-y-3 p-8">
                <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-950 dark:text-white">No questions matched the active filters</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 max-w-sm mx-auto font-medium">
                  Try loosening your search terms or clearing specific year/subject filters to view more questions.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map(q => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    isBookmarked={stats.bookmarks?.includes(q.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onAskAI={handleAskAI}
                    onRecordAttempt={handleRecordAttempt}
                  />
                ))}

                {/* Pagination Controls */}
                <div className="academic-card flex flex-col sm:flex-row items-center justify-between p-4.5 sm:p-5 rounded-2xl text-xs sm:text-sm gap-3">
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">
                    Showing <strong className="text-slate-950 dark:text-white font-extrabold">{questions.length}</strong> of <strong className="text-slate-950 dark:text-white font-extrabold">{totalQuestions}</strong> questions (Page {page} of {totalPages})
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="px-4 py-2 bg-white hover:bg-slate-50 dark:bg-[#0b0f19] dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-30 text-slate-900 dark:text-white rounded-xl transition flex items-center gap-1 font-bold shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <span className="px-3.5 py-1.5 font-mono text-slate-950 dark:text-white font-extrabold bg-slate-100 dark:bg-[#1a233a] border border-slate-300 dark:border-blue-500/30 rounded-xl">
                      {page} / {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="px-4 py-2 bg-white hover:bg-slate-50 dark:bg-[#0b0f19] dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-30 text-slate-900 dark:text-white rounded-xl transition flex items-center gap-1 font-bold shadow-sm"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: REVISION DECK / MISTAKE NOTEBOOK */}
        {currentTab === 'revision' && (
          <RevisionDeck
            bookmarks={stats.bookmarks || []}
            attempts={stats.attempts || {}}
            allQuestions={allQuestionsList.length ? allQuestionsList : questions}
            onToggleBookmark={handleToggleBookmark}
            onAskAI={handleAskAI}
            onRecordAttempt={handleRecordAttempt}
          />
        )}
      </main>

      {/* MODALS */}
      <MockExamModal
        isOpen={isMockExamOpen}
        onClose={() => setIsMockExamOpen(false)}
        allQuestions={allQuestionsList.length ? allQuestionsList : questions}
      />

      <SpeedRunModal
        isOpen={isSpeedRunOpen}
        onClose={() => setIsSpeedRunOpen(false)}
        allQuestions={allQuestionsList.length ? allQuestionsList : questions}
        onAddXP={(xp) => setStats(prev => ({ ...prev, xp: prev.xp + xp }))}
      />

      <VisualizersModal
        isOpen={isVisualizersOpen}
        onClose={() => setIsVisualizersOpen(false)}
      />

      <AIAssistantDrawer
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        activeQuestion={activeQuestionForAI}
      />

      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />
    </div>
  );
}
