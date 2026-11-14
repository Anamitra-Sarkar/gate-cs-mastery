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
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  stats, 
  onOpenAI, 
  onOpenVisualizers, 
  onOpenMock, 
  onOpenSpeedRun, 
  onOpenScratchpad 
}) {
  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('topics')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:text-emerald-400 transition" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  GATE Mastery
                </span>
                <span className="px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  CS & DA
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium hidden xs:block">AIR 1 Exam Intelligence Platform</p>
            </div>
          </div>

          {/* Center Mode Nav (Desktop / Large Tablet) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setCurrentTab('topics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                currentTab === 'topics' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Topic Syllabus
            </button>

            <button
              onClick={() => setCurrentTab('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                currentTab === 'practice' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Question Player
            </button>

            <button
              onClick={onOpenMock}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-emerald-400 hover:bg-emerald-500/10 transition"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              CBT Mock Exam
            </button>

            <button
              onClick={onOpenSpeedRun}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-amber-400 hover:bg-amber-500/10 transition"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Speed Sprint
            </button>

            <button
              onClick={onOpenVisualizers}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-indigo-300 hover:bg-indigo-500/10 transition"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Visualizers
            </button>

            <button
              onClick={() => setCurrentTab('revision')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                currentTab === 'revision' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-rose-400" />
              Mistake Deck
            </button>
          </nav>

          {/* Right Stats & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* XP & Level Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-[11px] sm:text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse shrink-0" />
                <span>{stats?.streak || 3}d</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1 text-indigo-300 font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{stats?.xp || 140} XP</span>
              </div>
            </div>

            {/* Scratchpad Trigger */}
            <button
              onClick={onOpenScratchpad}
              className="p-1.5 sm:p-2 text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition flex items-center"
              title="Open Scratchpad"
            >
              <Edit3 className="w-4 h-4 text-indigo-400" />
            </button>

            {/* AI Tutor Button */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-[11px] sm:text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <Bot className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
              <span className="hidden xs:inline">AI Tutor</span>
              <span className="xs:hidden">AI</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Bottom Navigation Bar (Visible on screens < lg) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 lg:hidden px-2 py-1 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setCurrentTab('topics')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-medium transition ${
            currentTab === 'topics' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Syllabus</span>
        </button>

        <button
          onClick={() => setCurrentTab('practice')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-medium transition ${
            currentTab === 'practice' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Practice</span>
        </button>

        <button
          onClick={onOpenMock}
          className="flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-medium text-emerald-400 hover:text-emerald-300 transition"
        >
          <Award className="w-4 h-4" />
          <span>CBT Mock</span>
        </button>

        <button
          onClick={onOpenSpeedRun}
          className="flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-medium text-amber-400 hover:text-amber-300 transition"
        >
          <Zap className="w-4 h-4" />
          <span>Sprint</span>
        </button>

        <button
          onClick={onOpenVisualizers}
          className="flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-medium text-cyan-400 hover:text-cyan-300 transition"
        >
          <Cpu className="w-4 h-4" />
          <span>Visuals</span>
        </button>

        <button
          onClick={() => setCurrentTab('revision')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-medium transition ${
            currentTab === 'revision' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Deck</span>
        </button>
      </div>
    </>
  );
}
