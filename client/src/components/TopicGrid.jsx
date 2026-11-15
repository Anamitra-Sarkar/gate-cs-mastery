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
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award
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

export default function TopicGrid({ topics, stats, onSelectTopic, onSelectSubtopic }) {
  const [search, setSearch] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState({});

  const toggleExpand = (e, subj) => {
    e.stopPropagation();
    setExpandedSubjects(prev => ({
      ...prev,
      [subj]: !prev[subj]
    }));
  };

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
      <div className="academic-card p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-950 dark:text-white tracking-tight">
              GATE Curriculum & Topic Mastery
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
            Curriculum covering CS & DA. Track your real-time mastery across all {totalQuestionsInSyllabus} verified questions with step-by-step derivations and trap analysis.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80 shrink-0">
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
          
          // Calculate Real Mastery
          const attemptedCount = stats?.subjectStats?.[subject]?.attempted || data.attempted || 0;
          const correctCount = stats?.subjectStats?.[subject]?.correct || data.correct || 0;
          const totalInSubj = data.total || 1;
          const masteryPercent = Math.min(100, Math.round((correctCount / totalInSubj) * 100));
          const isExpanded = !!expandedSubjects[subject];

          return (
            <div
              key={subject}
              onClick={() => onSelectTopic(subject)}
              className="academic-card academic-card-hover p-6 sm:p-7 rounded-3xl flex flex-col justify-between group cursor-pointer transition-all duration-200 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-center justify-center text-amber-700 dark:text-amber-400 group-hover:scale-105 transition transform shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-xs">
                      {data.total} Qs
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 
                  className="text-base sm:text-lg font-serif font-bold text-slate-950 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition mb-3"
                >
                  {subject}
                </h3>

                {/* Real Mastery Progress Bar */}
                <div className="mb-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>{attemptedCount} / {data.total} Solved</span>
                    </span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{masteryPercent}% Mastery</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div 
                      className="bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(attemptedCount > 0 ? 5 : 0, masteryPercent)}%` }}
                    />
                  </div>
                </div>

                {/* Subtopics chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(isExpanded ? subtopicsList : subtopicsList.slice(0, 4)).map(([stName, stCount]) => (
                    <button
                      key={stName}
                      onClick={(e) => { e.stopPropagation(); onSelectSubtopic(subject, stName); }}
                      className="px-2.5 py-1 rounded-xl text-xs bg-slate-100 hover:bg-amber-100/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition font-semibold"
                    >
                      {stName} ({stCount})
                    </button>
                  ))}
                  {subtopicsList.length > 4 && (
                    <button
                      onClick={(e) => toggleExpand(e, subject)}
                      className="px-2.5 py-1 rounded-xl text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 transition flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>+{subtopicsList.length - 4} more <ChevronDown className="w-3 h-3" /></>
                      )}
                    </button>
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
