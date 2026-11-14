import React from 'react';
import katex from 'katex';

// Pre-clean LaTeX math syntax, bracket delimiters, and isolated raw LaTeX symbols
function preCleanMath(text) {
  if (!text) return '';
  // 1. Standardize \[ ... \] and \( ... \) to $$ and $
  let s = text.replace(/\\\[([\s\S]+?)\\\]/g, '\n\n$$$$$1$$$$\n\n');
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, ' $$$1$$ ');

  // 2. Clean isolated raw LaTeX symbol commands when found outside of math blocks
  const rawReplacements = [
    [/\\to\b/g, '→'],
    [/\\rightarrow\b/g, '→'],
    [/\\leftarrow\b/g, '←'],
    [/\\Rightarrow\b/g, '⇒'],
    [/\\Leftarrow\b/g, '⇐'],
    [/\\iff\b/g, '⟺'],
    [/\\times\b/g, '×'],
    [/\\le\b|\\leq\b/g, '≤'],
    [/\\ge\b|\\geq\b/g, '≥'],
    [/\\neq\b/g, '≠'],
    [/\\pm\b/g, '±'],
    [/\\approx\b/g, '≈'],
    [/\\equiv\b/g, '≡'],
    [/\\in\b/g, '∈'],
    [/\\notin\b/g, '∉'],
    [/\\subset\b/g, '⊂'],
    [/\\subseteq\b/g, '⊆'],
    [/\\cup\b/g, '∪'],
    [/\\cap\b/g, '∩'],
    [/\\cdot\b/g, '·'],
    [/\\ldots\b|\\dots\b/g, '…'],
    [/\\infty\b/g, '∞'],
    [/\\Theta\b/g, 'Θ'],
    [/\\Omega\b/g, 'Ω'],
    [/\\Sigma\b/g, 'Σ'],
    [/\\Delta\b/g, 'Δ'],
    [/\\alpha\b/g, 'α'],
    [/\\beta\b/g, 'β'],
    [/\\gamma\b/g, 'γ'],
    [/\\lambda\b/g, 'λ'],
    [/\\mu\b/g, 'μ'],
    [/\\pi\b/g, 'π'],
    [/\\sigma\b/g, 'σ'],
    [/\\phi\b/g, 'φ'],
  ];

  const parts = s.split(/(\$\$[\s\S]+?\$\$|\$.+?\$)/g);
  for (let i = 0; i < parts.length; i += 2) {
    if (parts[i]) {
      let seg = parts[i];
      // Replace raw $\to$ or $\times$ if someone wrote isolated dollar tags
      seg = seg.replace(/\$\\to\$/g, '→');
      seg = seg.replace(/\$\\rightarrow\$/g, '→');
      seg = seg.replace(/\$\\times\$/g, '×');
      seg = seg.replace(/\$\\le\$/g, '≤');
      seg = seg.replace(/\$\\ge\$/g, '≥');
      seg = seg.replace(/\$\\neq\$/g, '≠');

      for (const [re, rep] of rawReplacements) {
        seg = seg.replace(re, rep);
      }
      parts[i] = seg;
    }
  }
  return parts.join('');
}

export default function MathText({ text, className = '' }) {
  if (!text) return null;

  const cleanedText = preCleanMath(text);

  // Split lines to handle markdown structure (headings, lists, block math)
  const lines = cleanedText.split('\n');

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
              className="my-3 py-2 px-3 bg-slate-100/70 dark:bg-slate-850/80 border border-slate-250 dark:border-slate-800 rounded-xl overflow-x-auto text-center text-slate-950 dark:text-slate-50 shadow-xs font-medium" 
              dangerouslySetInnerHTML={{ __html: html }} 
            />
          );
        } catch (e) {
          return <pre key={segIdx} className="font-mono text-amber-800 dark:text-amber-300 text-xs overflow-x-auto">{formula}</pre>;
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
              className="inline-block px-0.5 overflow-x-auto align-middle text-slate-950 dark:text-slate-50" 
              dangerouslySetInnerHTML={{ __html: html }} 
            />
          );
        } catch (e) {
          return <code key={segIdx} className="font-mono text-amber-800 dark:text-amber-300 text-xs font-semibold">{formula}</code>;
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
                  className="px-1.5 py-0.5 mx-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-amber-900 dark:text-amber-300 rounded font-mono text-[11px] md:text-xs font-semibold"
                >
                  {sub.slice(1, -1)}
                </code>
              );
            }
            if (sub.startsWith('**') && sub.endsWith('**')) {
              return (
                <strong key={subIdx} className="font-bold text-slate-950 dark:text-white">
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
    <div className={`space-y-1.5 break-words leading-relaxed text-slate-950 dark:text-slate-50 font-normal ${className}`}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Headings ### or ## or #
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={lineIdx} className="text-xs md:text-sm font-serif font-bold text-blue-900 dark:text-blue-300 mt-2 mb-1 flex items-center gap-1.5">
              {renderInlineFormatted(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={lineIdx} className="text-sm md:text-base font-serif font-extrabold text-slate-950 dark:text-white mt-3 mb-1.5">
              {renderInlineFormatted(trimmed.slice(3))}
            </h3>
          );
        }

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2 text-slate-950 dark:text-slate-50">
              <span className="text-amber-700 dark:text-amber-400 font-bold leading-tight select-none mt-1 text-[10px]">●</span>
              <div className="flex-1">{renderInlineFormatted(trimmed.slice(2))}</div>
            </div>
          );
        }

        // Numbered lists e.g. 1.
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2 text-slate-950 dark:text-slate-50">
              <span className="font-mono text-blue-700 dark:text-blue-400 font-bold text-xs min-w-[18px] text-right mt-0.5">
                {numMatch[1]}.
              </span>
              <div className="flex-1">{renderInlineFormatted(numMatch[2])}</div>
            </div>
          );
        }

        // Standard paragraph line
        return (
          <p key={lineIdx} className="text-slate-950 dark:text-slate-50 font-normal leading-relaxed">
            {renderInlineFormatted(line)}
          </p>
        );
      })}
    </div>
  );
}
