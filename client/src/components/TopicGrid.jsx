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
  Search,
  BookOpen
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

export default function TopicGrid({ topics, onSelectTopic, onSelectSubtopic }) {
  const [search, setSearch] = useState('');

  const topicEntries = Object.entries(topics || {});
  const totalQuestionsInSyllabus = topicEntries.reduce((acc, [_, d]) => acc + (d.total || 0), 0);

  const filteredTopics = topicEntries.filter(([subj, data]) => {
    const qLower = search.toLowerCase();
    if (subj.toLowerCase().includes(qLower)) return true;
    if (data.subtopics && Object.keys(data.subtopics).some(st => st.toLowerCase().includes(qLower))) return true;
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Syllabus Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              GATE Official Topic Syllabus
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Complete computer science and data science curriculum. Practice topic-wise with {totalQuestionsInSyllabus} verified questions, step-by-step proofs, and common trap alerts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search subjects or subtopics..."
            className="w-full bg-[#0b0f19] border border-slate-800 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map(([subject, data]) => {
          const Icon = TOPIC_ICONS[subject] || BookOpen;
          const subtopicsList = Object.entries(data.subtopics || {});

          return (
            <div
              key={subject}
              className="p-5 sm:p-6 rounded-2xl bg-[#111827] border border-slate-800/90 hover:border-indigo-500/40 hover:bg-[#141d30] transition-all duration-200 shadow-md flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1a233a] border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:scale-105 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#0b0f19] border border-slate-800 text-slate-300">
                    {data.total} Qs
                  </span>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onSelectTopic(subject)}
                  className="text-base font-bold text-white group-hover:text-indigo-200 transition cursor-pointer mb-2"
                >
                  {subject}
                </h3>

                {/* Subtopics chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {subtopicsList.slice(0, 4).map(([stName, stCount]) => (
                    <button
                      key={stName}
                      onClick={(e) => { e.stopPropagation(); onSelectSubtopic(subject, stName); }}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-[#0b0f19] hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-800 transition"
                    >
                      {stName} ({stCount})
                    </button>
                  ))}
                  {subtopicsList.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] text-slate-400">
                      +{subtopicsList.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <button
                onClick={() => onSelectTopic(subject)}
                className="w-full mt-2 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition"
              >
                <span>Practice All {subject} Questions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition transform" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
