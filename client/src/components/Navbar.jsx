import React, { useState, useRef, useEffect } from 'react';
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
  Moon,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  TrendingUp,
  X
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
  onOpenScratchpad,
  onResetProgress
}) {
  const isDark = theme === 'dark';
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const statsModalRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (statsModalRef.current && !statsModalRef.current.contains(event.target)) {
        setShowStatsModal(false);
        setConfirmReset(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalAttempted = stats?.totalAttempted || 0;
  const totalCorrect = stats?.totalCorrect || 0;
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const xp = stats?.xp || 0;
  const level = stats?.level || 1;
  const streak = stats?.streak || 1;
  const xpToNextLevel = 100 - (xp % 100);
  const levelProgress = xp % 100;

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('topics')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-blue-500/20 dark:from-amber-400/10 dark:to-blue-400/10 border border-amber-300 dark:border-amber-400/30 flex items-center justify-center shadow-xs group-hover:scale-105 transition transform">
              <GraduationCap className="w-5.5 h-5.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif font-black text-base sm:text-lg tracking-tight text-slate-950 dark:text-white">
                  GATE Mastery
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-gradient-to-r from-amber-500/15 to-blue-500/15 text-amber-900 dark:text-amber-300 rounded-lg border border-amber-300 dark:border-amber-600/40 shadow-xs">
                  CS & DA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                Verified Past Papers • TCS-iON CBT Engine
              </p>
            </div>
          </div>

          {/* Center Mode Nav (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-[#0f131f] p-1.5 rounded-2xl border border-slate-250 dark:border-white/10 text-xs font-bold shadow-inner">
            <button
              onClick={() => setCurrentTab('topics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                currentTab === 'topics' 
                  ? 'bg-white dark:bg-blue-600 text-slate-950 dark:text-white shadow-sm' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-600 dark:text-amber-300" />
              <span>Syllabus</span>
            </button>

            <button
              onClick={() => setCurrentTab('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                currentTab === 'practice' 
                  ? 'bg-white dark:bg-blue-600 text-slate-950 dark:text-white shadow-sm' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-300" />
              <span>Question Player</span>
            </button>

            <button
              onClick={onOpenMock}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
            >
              <Award className="w-4 h-4" />
              <span>CBT Mock</span>
            </button>

            <button
              onClick={onOpenSpeedRun}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
            >
              <Zap className="w-4 h-4" />
              <span>Speed Sprint</span>
            </button>

            <button
              onClick={onOpenVisualizers}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-indigo-800 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
            >
              <Cpu className="w-4 h-4" />
              <span>Visualizers</span>
            </button>

            <button
              onClick={() => setCurrentTab('revision')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                currentTab === 'revision' 
                  ? 'bg-white dark:bg-blue-600 text-slate-950 dark:text-white shadow-sm' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              <Bookmark className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Mistake Deck</span>
            </button>
          </nav>

          {/* Right Stats & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 sm:p-2.5 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-[#0f131f] text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition shadow-xs"
              title={isDark ? "Switch to Crisp Light Mode" : "Switch to Midnight OLED Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
            </button>

            {/* Interactive Candidate XP & Streak Capsule */}
            <div className="relative" ref={statsModalRef}>
              <button
                onClick={() => setShowStatsModal(!showStatsModal)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-emerald-500/10 dark:from-[#111728] dark:to-[#0d1c24] border border-amber-300/80 dark:border-blue-500/30 text-xs font-bold shadow-xs hover:border-amber-400 dark:hover:border-blue-400/50 transition cursor-pointer"
                title="Click to view candidate progress or reset"
              >
                <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                  <Flame className="w-4 h-4 fill-current shrink-0 animate-pulse" />
                  <span>{streak}d</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
                <div className="flex items-center gap-1 text-blue-900 dark:text-blue-300 font-mono font-extrabold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                  <span>Lv.{level} • {xp} XP</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {/* Progress & Reset Dropdown Popover */}
              {showStatsModal && (
                <div className="absolute right-0 top-12 z-50 w-72 p-4 bg-white dark:bg-[#0f131f] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl animate-fadeIn space-y-3.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                    <div className="font-serif font-bold text-slate-950 dark:text-white text-sm">
                      Candidate Progress
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      Level {level}
                    </span>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                      <span>XP Progress</span>
                      <span className="font-mono text-slate-900 dark:text-white">{xp % 100} / 100 XP</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${levelProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 text-right">
                      {xpToNextLevel} XP needed for Level {level + 1}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Attempted</span>
                      <p className="text-sm font-mono font-bold text-slate-950 dark:text-white">{totalAttempted}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Accuracy</span>
                      <p className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400">{accuracy}%</p>
                    </div>
                  </div>

                  {/* Reset Progress Action */}
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                    {!confirmReset ? (
                      <button
                        onClick={() => setConfirmReset(true)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[11px] font-bold text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset All Progress</span>
                      </button>
                    ) : (
                      <div className="space-y-1.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/60 text-center">
                        <p className="text-[11px] font-bold text-rose-900 dark:text-rose-200">Reset XP, streak & answers?</p>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              onResetProgress?.();
                              setShowStatsModal(false);
                              setConfirmReset(false);
                            }}
                            className="flex-1 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] transition"
                          >
                            Yes, Reset
                          </button>
                          <button
                            onClick={() => setConfirmReset(false)}
                            className="flex-1 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[10px] transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Scratchpad Button */}
            <button
              onClick={onOpenScratchpad}
              className="p-2 sm:p-2.5 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#0f131f] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-2xl transition flex items-center shadow-xs"
              title="Open Rough Sheet / Scratchpad"
              aria-label="Open Scratchpad"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {/* Glowing AI Tutor Button */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-indigo-500/25 active:scale-95 transition-all duration-200 transform hover:-translate-y-0.5"
              title="Ask GATE AI Tutor"
            >
              <Bot className="w-4 h-4 shrink-0 text-amber-300" />
              <span className="hidden xs:inline">AI Tutor</span>
              <span className="xs:hidden">AI</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Bottom Navigation Bar (< lg) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 lg:hidden px-2 py-2 flex items-center justify-around shadow-xl">
        <button
          onClick={() => setCurrentTab('topics')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] transition ${
            currentTab === 'topics' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Syllabus</span>
        </button>

        <button
          onClick={() => setCurrentTab('practice')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] transition ${
            currentTab === 'practice' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Questions</span>
        </button>

        <button
          onClick={onOpenMock}
          className="flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] text-emerald-700 dark:text-emerald-400 font-medium"
        >
          <Award className="w-4 h-4" />
          <span>CBT Mock</span>
        </button>

        <button
          onClick={onOpenSpeedRun}
          className="flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] text-amber-700 dark:text-amber-400 font-medium"
        >
          <Zap className="w-4 h-4" />
          <span>Sprint</span>
        </button>

        <button
          onClick={onOpenVisualizers}
          className="flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] text-indigo-700 dark:text-indigo-400 font-medium"
        >
          <Cpu className="w-4 h-4" />
          <span>Visuals</span>
        </button>

        <button
          onClick={() => setCurrentTab('revision')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] transition ${
            currentTab === 'revision' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Mistakes</span>
        </button>
      </div>
    </>
  );
}
