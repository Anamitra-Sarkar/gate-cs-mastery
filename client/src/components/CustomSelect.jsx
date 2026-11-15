import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  disabled = false,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Trigger Button with Smooth Rounded Edges */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white dark:bg-[#0e121e] border border-slate-300 dark:border-white/10 text-slate-950 dark:text-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-xs hover:border-slate-400 dark:hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all flex items-center justify-between gap-2 text-left disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
          isOpen ? 'ring-2 ring-blue-500/20 border-blue-600 dark:border-blue-500' : ''
        }`}
      >
        <span className="truncate flex-1">{displayLabel}</span>
        <ChevronDown 
          className={`w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
          }`} 
        />
      </button>

      {/* Floating Dropdown Menu with Elegant Smooth Rounded Corners */}
      {isOpen && (
        <div 
          className="absolute left-0 right-0 top-full mt-2 z-50 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0e121e]/95 backdrop-blur-2xl p-1.5 shadow-2xl animate-fadeIn space-y-0.5"
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-bold'
                    : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
