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
      <div className="academic-card p-6 sm:p-8 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-950 dark:text-white tracking-tight">
              GATE Official Topic Syllabus
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
            Complete computer science and data science curriculum. Practice topic-wise with {totalQuestionsInSyllabus} verified questions, step-by-step proofs, and common trap alerts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search subjects or subtopics..."
            className="w-full bg-white dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 text-slate-950 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 shadow-inner font-medium"
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map(([subject, data]) => {
          const Icon = TOPIC_ICONS[subject] || BookOpen;
          const subtopicsList = Object.entries(data.subtopics || {});

          return (
            <div
              key={subject}
              onClick={() => onSelectTopic(subject)}
              className="academic-card academic-card-hover p-6 rounded-3xl flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-center justify-center text-amber-700 dark:text-amber-400 group-hover:scale-105 transition transform shadow-sm">
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-sm">
                    {data.total} Qs
                  </span>
                </div>

                {/* Title */}
                <h3 
                  className="text-base sm:text-lg font-serif font-bold text-slate-950 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition mb-2.5"
                >
                  {subject}
                </h3>

                {/* Subtopics chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {subtopicsList.slice(0, 4).map(([stName, stCount]) => (
                    <button
                      key={stName}
                      onClick={(e) => { e.stopPropagation(); onSelectSubtopic(subject, stName); }}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-amber-100/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition font-semibold"
                    >
                      {stName} ({stCount})
                    </button>
                  ))}
                  {subtopicsList.length > 4 && (
                    <span className="px-2 py-0.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                      +{subtopicsList.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <div
                className="w-full mt-2 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-400 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition"
              >
                <span>Practice All {subject} Questions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
