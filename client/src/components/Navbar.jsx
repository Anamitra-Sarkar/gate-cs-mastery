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
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('topics')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:text-emerald-400 transition" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                GATE Mastery
              </span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                CS & DA
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">AIR 1 Exam Intelligence Platform</p>
          </div>
        </div>

        {/* Center Mode Nav */}
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
        <div className="flex items-center gap-2.5">
          {/* XP & Level Badge */}
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
              <span>{stats?.streak || 3}d</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1 text-indigo-300 font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{stats?.xp || 140} XP</span>
            </div>
          </div>

          {/* Scratchpad Trigger */}
          <button
            onClick={onOpenScratchpad}
            className="p-2 text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition hidden sm:flex"
            title="Open Scratchpad"
          >
            <Edit3 className="w-4 h-4 text-indigo-400" />
          </button>

          {/* AI Tutor Button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>AI Tutor</span>
          </button>
        </div>
      </div>
    </header>
  );
}
