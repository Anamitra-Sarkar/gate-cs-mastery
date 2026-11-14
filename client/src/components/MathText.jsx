import React from 'react';
import katex from 'katex';

export default function MathText({ text, className = '' }) {
  if (!text) return null;

  // Split lines to handle markdown structure (headings, lists, block math)
  const lines = text.split('\n');

  const renderInlineFormatted = (rawStr) => {
    if (!rawStr) return null;

    // 1. Split on math delimiters ($$...$$ or $...$)
    const mathSegments = rawStr.split(/(\$\$[\s\S]+?\$\$|\$.+?\$)/g);

    return mathSegments.map((segment, segIdx) => {
      if (!segment) return null;

      // Display math $$...$$
      if (segment.startsWith('$$') && segment.endsWith('$$')) {
        const formula = segment.slice(2, -2).trim();
        try {
          const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
          return (
            <div 
              key={segIdx} 
              className="my-2.5 py-1 px-3 bg-slate-950/60 rounded-lg overflow-x-auto text-center" 
              dangerouslySetInnerHTML={{ __html: html }} 
            />
          );
        } catch (e) {
          return <pre key={segIdx} className="font-mono text-indigo-300 text-xs overflow-x-auto">{formula}</pre>;
        }
      }

      // Inline math $...$
      if (segment.startsWith('$') && segment.endsWith('$') && segment.length > 2) {
        const formula = segment.slice(1, -1).trim();
        try {
          const html = katex.renderToString(formula, { displayMode: false, throwOnError: false });
          return (
            <span 
              key={segIdx} 
              className="inline-block px-0.5 overflow-x-auto align-middle" 
              dangerouslySetInnerHTML={{ __html: html }} 
            />
          );
        } catch (e) {
          return <code key={segIdx} className="font-mono text-indigo-300 text-xs">{formula}</code>;
        }
      }

      // 2. Parse inline markdown: `code` and **bold**
      const inlineParts = segment.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
      return (
        <React.Fragment key={segIdx}>
          {inlineParts.map((sub, subIdx) => {
            if (!sub) return null;
            if (sub.startsWith('`') && sub.endsWith('`')) {
              return (
                <code 
                  key={subIdx} 
                  className="px-1.5 py-0.5 mx-0.5 bg-slate-800 border border-slate-700/60 text-indigo-300 rounded font-mono text-[11px] md:text-xs"
                >
                  {sub.slice(1, -1)}
                </code>
              );
            }
            if (sub.startsWith('**') && sub.endsWith('**')) {
              return (
                <strong key={subIdx} className="font-bold text-white">
                  {sub.slice(2, -2)}
                </strong>
              );
            }
            return sub;
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`space-y-1.5 break-words leading-relaxed ${className}`}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Headings ### or ## or #
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={lineIdx} className="text-xs md:text-sm font-bold text-indigo-400 mt-2 mb-1 flex items-center gap-1.5">
              {renderInlineFormatted(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={lineIdx} className="text-sm md:text-base font-extrabold text-white mt-3 mb-1.5">
              {renderInlineFormatted(trimmed.slice(3))}
            </h3>
          );
        }

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2 text-slate-300">
              <span className="text-indigo-400 font-bold leading-tight select-none mt-1 text-[10px]">●</span>
              <div className="flex-1">{renderInlineFormatted(trimmed.slice(2))}</div>
            </div>
          );
        }

        // Numbered lists e.g. 1.
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2 text-slate-300">
              <span className="font-mono text-indigo-400 font-semibold text-xs min-w-[18px] text-right mt-0.5">
                {numMatch[1]}.
              </span>
              <div className="flex-1">{renderInlineFormatted(numMatch[2])}</div>
            </div>
          );
        }

        // Standard paragraph line
        return (
          <p key={lineIdx} className="text-slate-200">
            {renderInlineFormatted(line)}
          </p>
        );
      })}
    </div>
  );
}
