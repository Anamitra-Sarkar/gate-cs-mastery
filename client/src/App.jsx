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
  Award
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('topics'); // 'topics' | 'practice' | 'revision'
  
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

  // User Stats & State
  const [stats, setStats] = useState({
    xp: 140,
    streak: 3,
    level: 2,
    totalAttempted: 14,
    totalCorrect: 12,
    bookmarks: [],
    attempts: {}
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

    // Also prefetch full pool for mock exam & speed run
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
    fetch('/api/bookmarks/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: qId })
    })
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({ ...prev, bookmarks: data.bookmarks }));
      })
      .catch(e => console.error('Toggle bookmark error:', e));
  };

  const handleRecordAttempt = (questionId, selected, isCorrect, timeSpent) => {
    fetch('/api/stats/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, selected, isCorrect, timeSpent })
    })
      .then(res => res.json())
      .then(updatedStats => setStats(updatedStats))
      .catch(e => console.error('Attempt recording error:', e));
  };

  const handleAskAI = (question) => {
    setActiveQuestionForAI(question);
    setIsAIModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        stats={stats}
        onOpenAI={() => { setActiveQuestionForAI(questions[0] || null); setIsAIModalOpen(true); }}
        onOpenVisualizers={() => setIsVisualizersOpen(true)}
        onOpenMock={() => setIsMockExamOpen(true)}
        onOpenSpeedRun={() => setIsSpeedRunOpen(true)}
        onOpenScratchpad={() => setIsScratchpadOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: TOPIC SYLLABUS GRID */}
        {currentTab === 'topics' && (
          <TopicGrid
            topics={topics}
            onSelectTopic={handleSelectTopicFromGrid}
            onSelectSubtopic={handleSelectSubtopicFromGrid}
          />
        )}

        {/* VIEW 2: QUESTION PRACTICE PLAYER */}
        {currentTab === 'practice' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                
                {/* Back to Topics if filtered */}
                {selectedSubject !== 'All' && (
                  <button
                    onClick={() => { setSelectedSubject('All'); setSelectedSubtopic('All'); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> All Subjects
                  </button>
                )}

                {/* Subject Selector */}
                <select
                  value={selectedSubject}
                  onChange={e => { setSelectedSubject(e.target.value); setSelectedSubtopic('All'); setPage(1); }}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500"
                >
                  <option value="All">All Subjects ({totalQuestions})</option>
                  {Object.keys(topics).map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>

                {/* Subtopic Selector */}
                {selectedSubject !== 'All' && topics[selectedSubject]?.subtopics && (
                  <select
                    value={selectedSubtopic}
                    onChange={e => { setSelectedSubtopic(e.target.value); setPage(1); }}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500"
                  >
                    <option value="All">All Subtopics</option>
                    {Object.keys(topics[selectedSubject].subtopics).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                )}

                {/* Difficulty Selector */}
                <select
                  value={selectedDifficulty}
                  onChange={e => { setSelectedDifficulty(e.target.value); setPage(1); }}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy (1 Mark)</option>
                  <option value="Medium">Medium (2 Marks)</option>
                  <option value="Hard">Hard (Multi-Concept)</option>
                </select>

                {/* Question Type Selector */}
                <select
                  value={selectedType}
                  onChange={e => { setSelectedType(e.target.value); setPage(1); }}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500"
                >
                  <option value="All">All Formats</option>
                  <option value="MCQ">MCQ (Multiple Choice)</option>
                  <option value="NAT">NAT (Numerical)</option>
                  <option value="MSQ">MSQ (Multi-Select)</option>
                </select>

                {/* Year Selector */}
                <select
                  value={selectedYear}
                  onChange={e => { setSelectedYear(e.target.value); setPage(1); }}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500"
                >
                  <option value="All">All Years (1991–2025)</option>
                  {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2014, 2013, 2012, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991].map(yr => (
                    <option key={yr} value={yr}>GATE {yr}</option>
                  ))}
                </select>

                {/* Search box */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    placeholder="Search in questions or formulas..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Questions List */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Loading GATE Question Bank...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
                <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-sm font-bold text-white">No questions matched the active filters</h3>
                <p className="text-xs text-slate-400">Try loosening your search query or selecting "All Subjects".</p>
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
                <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs">
                  <span className="text-slate-400">
                    Showing <strong>{questions.length}</strong> of <strong>{totalQuestions}</strong> questions (Page {page} of {totalPages})
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition flex items-center gap-1 font-medium"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition flex items-center gap-1 font-medium"
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
