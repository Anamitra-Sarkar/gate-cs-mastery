import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  RefreshCw, 
  ChevronDown, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Compass, 
  ArrowRight,
  Zap,
  RotateCcw
} from 'lucide-react';
import MathText from './MathText';

const INITIAL_WELCOME_MESSAGE = {
  role: 'assistant',
  content: `### Welcome to Your Personal GATE CS/DA Mentor! 🎓

I am powered by **Groq Live Acceleration** to provide instantaneous, step-by-step reasoning for all GATE Computer Science and Data Science problems.

**How I can guide you:**
- 🎯 **First Principles:** Break down deep proofs, recurrences, and memory hierarchies.
- 💡 **Strategic Clues:** Give progressive hints without spoiling the final answer.
- ⚠️ **Trap Avoidance:** Explain precisely why specific options are seductive distractors.
- 📝 **Step Verification:** Walk through equations and boundary conditions step-by-step.

Feel free to ask about the active question or any concept in the syllabus!`
};

export default function AIAssistantDrawer({ isOpen, onClose, activeQuestion }) {
  const [models, setModels] = useState(['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b']);
  const [currentModel, setCurrentModel] = useState('openai/gpt-oss-120b');
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setInputPrompt('');
  };

  // Fetch models dynamically from backend
  useEffect(() => {
    fetch('/api/ai/models')
      .then(res => res.json())
      .then(data => {
        if (data.available && data.available.length > 0) {
          setModels(data.available);
          if (data.active) setCurrentModel(data.active);
        }
      })
      .catch(err => console.error('Failed to load AI models:', err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSend = async (textToSend) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || loading) return;

    const userMsg = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          questionContext: activeQuestion || null,
          model: currentModel,
          history: messages.slice(-4)
        })
      });

      const data = await res.json();
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ **Groq Error:** ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ **Connection Error:** Failed to communicate with AI inference endpoint. Please verify connection.` }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn transition-opacity">
      <div 
        className="w-full sm:max-w-xl h-full bg-white/95 dark:bg-[#0c0f17]/95 backdrop-blur-2xl border-l border-slate-250 dark:border-slate-800 shadow-2xl flex flex-col animate-slideLeft transition-colors"
      >
        {/* Sleek Gradient Header */}
        <div className="p-4 sm:p-5 border-b border-slate-250 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-[#111422]/90 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-slate-950 dark:text-white tracking-tight">
                  GATE AI Tutor
                </h3>
                <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500/15 to-blue-500/15 border border-emerald-400/40 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold rounded-lg flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Groq Live
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                Instant reasoning & first-principles mentor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dynamic Model Dropdown */}
            <div className="relative">
              <select
                value={currentModel}
                onChange={e => setCurrentModel(e.target.value)}
                className="bg-white dark:bg-[#151928] border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 rounded-xl px-2.5 py-1.5 appearance-none pr-6 cursor-pointer focus:outline-none focus:border-blue-600 shadow-xs"
              >
                {models.map(m => (
                  <option key={m} value={m}>{m.split('/').pop()}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* New Chat / Clear Button */}
            <button
              type="button"
              onClick={handleClearChat}
              aria-label="New Chat"
              title="Start a new chat session"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 dark:bg-[#151928] dark:hover:bg-[#1d2235] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold transition active:scale-95 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close AI Tutor"
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Question Context Banner */}
        {activeQuestion && (
          <div className="px-5 py-2.5 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-blue-200/80 dark:border-blue-900/40 flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 truncate">
              <Compass className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
              <span className="text-slate-900 dark:text-slate-200 truncate font-semibold">
                Target: <strong className="text-blue-900 dark:text-blue-300">{activeQuestion.subject}</strong> ({activeQuestion.topic})
              </span>
            </div>
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 text-[10px] font-mono font-bold rounded-lg shrink-0">
              {activeQuestion.paper || `GATE ${activeQuestion.year}`}
            </span>
          </div>
        )}

        {/* Quick Suggestion Prompt Chips */}
        <div className="px-4 py-2.5 border-b border-slate-250 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0e121d] flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
          {[
            { label: '💡 Gentle Hint', prompt: 'Give me a subtle hint to solve this problem without revealing the answer.' },
            { label: '🎯 First Principles', prompt: 'Explain the core theoretical concept behind this problem from first principles.' },
            { label: '⚠️ Trap Analysis', prompt: 'Why are the other options seductive traps? Analyze the distractors.' },
            { label: '📝 Formulas & Proof', prompt: 'What are the essential formulas, bounds, and theorems needed to solve this problem?' },
          ].map(chip => (
            <button
              key={chip.label}
              onClick={() => handleSend(chip.prompt)}
              disabled={loading}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 dark:bg-[#161a29] dark:hover:bg-[#1d2235] text-slate-800 dark:text-slate-200 rounded-xl whitespace-nowrap transition font-semibold border border-slate-250 dark:border-slate-700 shadow-xs active:scale-95 shrink-0"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/40 dark:bg-[#0a0d14]">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[90%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed relative group ${
                    isUser 
                      ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-br-xs shadow-md' 
                      : 'bg-white dark:bg-[#121624] border border-slate-250 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs shadow-sm'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800/80 text-[11px]">
                      <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider font-serif">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        AI Solution Guide
                      </div>
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center gap-1"
                        title="Copy Response"
                      >
                        {copiedIdx === idx ? (
                          <><Check className="w-3.5 h-3.5 text-emerald-500" /> <span className="text-[10px] text-emerald-500">Copied</span></>
                        ) : (
                          <><Copy className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    </div>
                  )}

                  <MathText text={msg.content} />
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-[#121624] border border-slate-250 dark:border-slate-800 rounded-3xl rounded-bl-xs p-4 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-3 shadow-sm">
                <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" />
                <span className="font-semibold">Synthesizing pedagogical proof via {currentModel.split('/').pop()}...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-250 dark:border-slate-800 bg-white dark:bg-[#101420] shadow-lg">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0a0d14] p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-inner">
            <input
              type="text"
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question about this problem, formula, or concept..."
              className="flex-1 bg-transparent border-none text-xs sm:text-sm px-3 py-2 text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-medium"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputPrompt.trim()}
              className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white rounded-xl transition shadow-md shadow-blue-500/20 active:scale-95"
              aria-label="Send query to AI Tutor"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1.5 px-2 text-center">
            Press <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700">Enter</kbd> to submit query
          </p>
        </div>
      </div>
    </div>
  );
}
