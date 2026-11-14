import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Send, X, RefreshCw, ChevronDown, BookOpen, Lightbulb, HelpCircle, CheckCircle2 } from 'lucide-react';
import MathText from './MathText';

export default function AIAssistantDrawer({ isOpen, onClose, activeQuestion }) {
  const [models, setModels] = useState(['qwen/qwen3.8-27b']);
  const [currentModel, setCurrentModel] = useState('qwen/qwen3.8-27b');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your **GATE AI Study Assistant**, powered by live Groq acceleration.\n\nI can explain complex concepts from first principles, break down mathematical proofs, give subtle hints without spoiling answers, or analyze why specific distractors are incorrect.\n\nHow can I help you conquer your GATE preparation today?`
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error from Groq API: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Connection error: Failed to reach AI service.` }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col animate-slideLeft">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">GATE AI Tutor</h3>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                Groq Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Contextual pedagogical mentor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Dynamic Model Dropdown */}
          <div className="relative">
            <select
              value={currentModel}
              onChange={e => setCurrentModel(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 rounded-lg px-2.5 py-1 appearance-none pr-6 cursor-pointer focus:outline-none focus:border-indigo-500"
            >
              {models.map(m => (
                <option key={m} value={m}>{m.split('/').pop()}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Active Question Context Banner (if viewing a question) */}
      {activeQuestion && (
        <div className="px-4 py-2 bg-indigo-950/40 border-b border-indigo-500/20 flex items-center justify-between text-xs">
          <span className="text-indigo-300 truncate max-w-[280px]">
            Target: <strong>{activeQuestion.subject}</strong> ({activeQuestion.topic})
          </span>
          <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-mono rounded">
            {activeQuestion.id.split('_').slice(0, 3).join(' ')}
          </span>
        </div>
      )}

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/50 flex gap-1.5 overflow-x-auto text-[11px]">
        {[
          { label: '💡 Gentle Hint', prompt: 'Give me a subtle hint to solve this problem without revealing the answer.' },
          { label: '🎯 First Principles', prompt: 'Explain the core theoretical concept behind this problem from first principles.' },
          { label: '❌ Why Not C?', prompt: 'Why are the alternative options incorrect? Analyze the distractors.' },
          { label: '📐 Key Formulas', prompt: 'What are the essential formulas and theorems needed to solve this problem?' },
        ].map(chip => (
          <button
            key={chip.label}
            onClick={() => handleSend(chip.prompt)}
            disabled={loading}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full whitespace-nowrap transition border border-slate-700/60"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed ${
                isUser 
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20' 
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow'
              }`}>
                <MathText text={msg.content} />
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none p-3 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>Consulting {currentModel.split('/').pop()}...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex items-center gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about this problem or topic..."
          className="flex-1 bg-slate-950 border border-slate-800 text-xs md:text-sm rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputPrompt.trim()}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition shadow-md shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
