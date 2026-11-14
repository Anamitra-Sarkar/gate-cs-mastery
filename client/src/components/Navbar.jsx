import React from 'react';
import { 
  GraduationCap, 
  Flame, 
  Award, 
  Bot, 
  Cpu, 
  Zap, 
  Bookmark, 
  Edit3, 
  BookOpen, 
  Layers,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  stats, 
  theme,
  setTheme,
  onOpenAI, 
  onOpenVisualizers, 
  onOpenMock, 
  onOpenSpeedRun, 
  onOpenScratchpad 
}) {
  const isDark = theme === 'dark';

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0f1117]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('topics')}
            className="flex items-center gap-3 cursor-pointer group shrink-0 select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition transform">
              <GraduationCap className="w-5 h-5 text-amber-700 dark:text-amber-400 transition" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  GATE Mastery
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded border border-amber-300 dark:border-amber-700/50">
                  CS & DA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden xs:block">
                Authentic Past Papers • Verified CBT Solutions
              </p>
            </div>
          </div>

          {/* Center Mode Nav (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-850 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium">
            <button
              onClick={() => setCurrentTab('topics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                currentTab === 'topics' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Syllabus
            </button>

            <button
              onClick={() => setCurrentTab('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                currentTab === 'practice' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Question Player
            </button>

            <button
              onClick={onOpenMock}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
            >
              <Award className="w-3.5 h-3.5" />
              CBT Mock Exam
            </button>

            <button
              onClick={onOpenSpeedRun}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
            >
              <Zap className="w-3.5 h-3.5" />
              Speed Sprint
            </button>

            <button
              onClick={onOpenVisualizers}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
            >
              <Cpu className="w-3.5 h-3.5" />
              Visualizers
            </button>

            <button
              onClick={() => setCurrentTab('revision')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                currentTab === 'revision' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              Mistake Deck
            </button>
          </nav>

          {/* Right Stats & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle (Warm Paper vs Midnight Stone) */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition"
              title={isDark ? "Switch to Warm Academic Paper" : "Switch to Midnight Stone"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Streak & XP Badge */}
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold">
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400" title="Daily Streak">
                <Flame className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>{stats?.streak || 3}d</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <div className="flex items-center gap-1 text-blue-600 dark:text-indigo-300 font-mono">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{stats?.xp || 140} XP</span>
              </div>
            </div>

            {/* Scratchpad Button */}
            <button
              onClick={onOpenScratchpad}
              className="p-2 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition flex items-center"
              title="Open Rough Sheet / Scratchpad"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-sm active:scale-95"
            >
              <Bot className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0 text-amber-400 dark:text-white" />
              <span className="hidden xs:inline">AI Tutor</span>
              <span className="xs:hidden">AI</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Bottom Navigation Bar (< lg) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0f1117]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 lg:hidden px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setCurrentTab('topics')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] transition ${
            currentTab === 'topics' ? 'text-amber-700 dark:text-amber-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Syllabus</span>
        </button>

        <button
          onClick={() => setCurrentTab('practice')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] transition ${
            currentTab === 'practice' ? 'text-blue-700 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Questions</span>
        </button>

        <button
          onClick={onOpenMock}
          className="flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] text-emerald-700 dark:text-emerald-400 font-medium"
        >
          <Award className="w-4 h-4" />
          <span>CBT Mock</span>
        </button>

        <button
          onClick={onOpenSpeedRun}
          className="flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] text-amber-700 dark:text-amber-400 font-medium"
        >
          <Zap className="w-4 h-4" />
          <span>Sprint</span>
        </button>

        <button
          onClick={onOpenVisualizers}
          className="flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] text-indigo-700 dark:text-indigo-400 font-medium"
        >
          <Cpu className="w-4 h-4" />
          <span>Visuals</span>
        </button>

        <button
          onClick={() => setCurrentTab('revision')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] transition ${
            currentTab === 'revision' ? 'text-rose-700 dark:text-rose-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Mistakes</span>
        </button>
      </div>
    </>
  );
}
