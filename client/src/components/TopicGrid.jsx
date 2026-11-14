import React, { useState } from 'react';
import { 
  Cpu, 
  Database, 
  Network, 
  Binary, 
  Terminal, 
  Layers, 
  GitBranch, 
  Calculator, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Search
} from 'lucide-react';

const TOPIC_ICONS = {
  'Operating Systems': Cpu,
  'Databases': Database,
  'Computer Networks': Network,
  'Theory of Computation': Binary,
  'Compiler Design': Terminal,
  'Algorithms': GitBranch,
  'Programming & Data Structures': Terminal,
  'Computer Organization & Architecture': Cpu,
  'Digital Logic': Binary,
  'Discrete Mathematics': Layers,
  'Engineering Mathematics': Calculator,
  'General Aptitude': Sparkles,
  'Data Science & AI': BrainCircuit,
};

const TOPIC_GRADIENTS = {
  'Operating Systems': 'from-blue-600/20 via-indigo-600/10 to-transparent border-blue-500/30',
  'Databases': 'from-emerald-600/20 via-teal-600/10 to-transparent border-emerald-500/30',
  'Computer Networks': 'from-cyan-600/20 via-sky-600/10 to-transparent border-cyan-500/30',
  'Theory of Computation': 'from-purple-600/20 via-fuchsia-600/10 to-transparent border-purple-500/30',
  'Compiler Design': 'from-amber-600/20 via-orange-600/10 to-transparent border-amber-500/30',
  'Algorithms': 'from-indigo-600/20 via-violet-600/10 to-transparent border-indigo-500/30',
  'Programming & Data Structures': 'from-rose-600/20 via-pink-600/10 to-transparent border-rose-500/30',
  'Computer Organization & Architecture': 'from-blue-600/20 via-indigo-600/10 to-transparent border-blue-500/30',
  'Digital Logic': 'from-teal-600/20 via-emerald-600/10 to-transparent border-teal-500/30',
  'Discrete Mathematics': 'from-violet-600/20 via-purple-600/10 to-transparent border-violet-500/30',
  'Engineering Mathematics': 'from-amber-600/20 via-yellow-600/10 to-transparent border-amber-500/30',
  'General Aptitude': 'from-pink-600/20 via-rose-600/10 to-transparent border-pink-500/30',
  'Data Science & AI': 'from-fuchsia-600/20 via-purple-600/10 to-transparent border-fuchsia-500/30',
};

export default function TopicGrid({ topics, onSelectTopic, onSelectSubtopic }) {
  const [search, setSearch] = useState('');

  const topicEntries = Object.entries(topics || {});
  const filteredTopics = topicEntries.filter(([subj, data]) => {
    const qLower = search.toLowerCase();
    if (subj.toLowerCase().includes(qLower)) return true;
    if (data.subtopics && Object.keys(data.subtopics).some(st => st.toLowerCase().includes(qLower))) return true;
    return false;
  });

  const totalQuestions = topicEntries.reduce((acc, [, d]) => acc + (d.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-emerald-950/20 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Topic-Wise Structured Learning
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Comprehensive GATE CS & DA Syllabus Question Bank
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Master all <strong>{totalQuestions} verified PYQ questions</strong> categorized cleanly by core computer science subject. Each question comes with step-by-step logic, verified keys, KaTeX mathematics, and live Groq AI assistance.
          </p>
        </div>

        {/* Search bar */}
        <div className="mt-6 relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search subject or subtopic (e.g. CPU Scheduling, Paging, B+ Tree)..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map(([subj, data]) => {
          const Icon = TOPIC_ICONS[subj] || Layers;
          const gradient = TOPIC_GRADIENTS[subj] || 'from-indigo-600/20 to-transparent border-indigo-500/30';
          const subtopicsList = Object.entries(data.subtopics || {}).slice(0, 4);

          return (
            <div
              key={subj}
              className={`p-5 rounded-2xl bg-slate-900/90 border bg-gradient-to-br ${gradient} hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between shadow-lg group`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-indigo-400 group-hover:text-emerald-400 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] font-mono font-semibold text-slate-300">
                    <span className="text-indigo-400">{data.total}</span> Questions
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                    {subj}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Mastery Progress</span>
                    <span className="font-mono font-bold text-emerald-400">{data.mastery || 0}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mt-1.5">
                    <div 
                      style={{ width: `${Math.max(5, data.mastery || 0)}%` }} 
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                    />
                  </div>
                </div>

                {/* Subtopic Pills */}
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                    High-Yield Areas
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {subtopicsList.map(([st, cnt]) => (
                      <button
                        key={st}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSubtopic(subj, st);
                        }}
                        className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500 text-[10px] text-slate-300 hover:text-white transition flex items-center gap-1"
                      >
                        <span className="truncate max-w-[130px]">{st}</span>
                        <span className="text-slate-500 text-[9px]">({cnt})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectTopic(subj)}
                className="mt-5 w-full py-2.5 px-4 bg-slate-950/80 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500 text-slate-200 hover:text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 group-hover:shadow-lg"
              >
                <span>Practice {subj}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
