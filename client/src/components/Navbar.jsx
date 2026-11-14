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
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b0d13]/95 backdrop-blur-md border-b border-slate-300 dark:border-slate-800 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('topics')}
            className="flex items-center gap-3 cursor-pointer group shrink-0 select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-300 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition transform">
              <GraduationCap className="w-5.5 h-5.5 text-amber-800 dark:text-amber-400 transition" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-slate-950 dark:text-white">
                  GATE Mastery
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 rounded-lg border border-amber-300 dark:border-amber-700/60 shadow-xs">
                  CS & DA
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold hidden xs:block">
                Authentic Past Papers • Verified CBT Solutions
              </p>
            </div>
          </div>

          {/* Center Mode Nav (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-850 p-1 rounded-2xl border border-slate-300 dark:border-slate-800 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setCurrentTab('topics')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                currentTab === 'topics' 
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm font-bold border border-slate-200 dark:border-slate-700' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              Syllabus
            </button>

            <button
              onClick={() => setCurrentTab('practice')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                currentTab === 'practice' 
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm font-bold border border-slate-200 dark:border-slate-700' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              Question Player
            </button>

            <button
              onClick={onOpenMock}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40 transition font-bold"
            >
              <Award className="w-4 h-4" />
              CBT Mock Exam
            </button>

            <button
              onClick={onOpenSpeedRun}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-amber-800 dark:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 transition font-bold"
            >
              <Zap className="w-4 h-4" />
              Speed Sprint
            </button>

            <button
              onClick={onOpenVisualizers}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/40 transition font-bold"
            >
              <Cpu className="w-4 h-4" />
              Visualizers
            </button>

            <button
              onClick={() => setCurrentTab('revision')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                currentTab === 'revision' 
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm font-bold border border-slate-200 dark:border-slate-700' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 text-rose-700 dark:text-rose-400" />
              Mistake Deck
            </button>
          </nav>

          {/* Right Stats & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle (Warm Paper vs Midnight Stone) */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition shadow-xs"
              title={isDark ? "Switch to Warm Academic Paper" : "Switch to Midnight Stone"}
            >
              {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-800" />}
            </button>

            {/* Streak & XP Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold shadow-xs">
              <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400" title="Daily Streak">
                <Flame className="w-4 h-4 fill-current shrink-0" />
                <span>{stats?.streak || 3}d</span>
              </div>
              <span className="text-slate-400 dark:text-slate-600">|</span>
              <div className="flex items-center gap-1 text-blue-700 dark:text-blue-300 font-mono">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{stats?.xp || 140} XP</span>
              </div>
            </div>

            {/* Scratchpad Button */}
            <button
              onClick={onOpenScratchpad}
              className="p-2.5 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl transition flex items-center shadow-xs"
              title="Open Rough Sheet / Scratchpad"
            >
              <Edit3 className="w-4.5 h-4.5" />
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-950 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-sm active:scale-95"
            >
              <Bot className="w-4 h-4 shrink-0 text-amber-400 dark:text-white" />
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
