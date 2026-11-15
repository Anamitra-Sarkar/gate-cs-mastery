import React from 'react';
import katex from 'katex';
import { 
  Compass, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  Bookmark, 
  FileText,
  HelpCircle
} from 'lucide-react';

// Pre-clean LaTeX math syntax, bracket delimiters, exponents, and isolated raw LaTeX symbols
function preCleanMath(text) {
  if (!text) return '';
  
  let s = text;

  // 1. Standardize \[ ... \] and \( ... \) to $$ and $
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, '\n\n$$$$$1$$$$\n\n');
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, ' $$$1$$ ');

  // 2. Fix common exponent corruption (e.g. 𝑛2 -> 𝑛², 2𝑛 -> 2ⁿ, 105 distinct -> 10⁵)
  s = s.replace(/105\s*distinct/g, '10⁵ distinct');
  s = s.replace(/([a-zA-Z\u{1D400}-\u{1D7FF}])2(\s|[\),;.])/gu, '$1²$2');
  s = s.replace(/([a-zA-Z\u{1D400}-\u{1D7FF}])3(\s|[\),;.])/gu, '$1³$2');
  s = s.replace(/\b2([nNkK])\b/g, '2^$1');

  // 3. Clean isolated raw LaTeX symbol commands when found outside of math blocks
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
  const lines = cleanedText.split('\n');

  const renderInlineFormatted = (rawStr) => {
    if (!rawStr) return null;

    // Split on math delimiters ($$...$$ or $...$)
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
              className="my-3 py-2.5 px-4 bg-slate-100/80 dark:bg-slate-850/90 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto text-center text-slate-950 dark:text-slate-50 shadow-xs font-medium" 
              dangerouslySetInnerHTML={{ __html: html }} 
            />
          );
        } catch (e) {
          return <pre key={segIdx} className="font-mono text-amber-800 dark:text-amber-300 text-xs overflow-x-auto p-2">{formula}</pre>;
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
              className="inline-block px-1 overflow-x-auto align-baseline text-slate-950 dark:text-slate-50 font-normal" 
              dangerouslySetInnerHTML={{ __html: html }} 
            />
          );
        } catch (e) {
          return <code key={segIdx} className="font-mono text-amber-800 dark:text-amber-300 text-xs font-semibold px-1">{formula}</code>;
        }
      }

      // Inline markdown: `code` and **bold**
      const inlineParts = segment.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
      return (
        <React.Fragment key={segIdx}>
          {inlineParts.map((sub, subIdx) => {
            if (!sub) return null;
            if (sub.startsWith('`') && sub.endsWith('`')) {
              return (
                <code 
                  key={subIdx} 
                  className="px-1.5 py-0.5 mx-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 text-amber-900 dark:text-amber-300 rounded font-mono text-[11px] md:text-xs font-semibold"
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
    <div className={`space-y-2.5 break-words leading-relaxed text-slate-950 dark:text-slate-100 font-normal px-0.5 ${className}`}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-2" />;
        }

        // 1. Heading 4 (####) - Specialized Pedagogical Section Cards
        if (trimmed.startsWith('#### ')) {
          const headingText = trimmed.slice(5).trim();
          const lower = headingText.toLowerCase();

          // Pitfall / Warning / Trap Heading
          if (lower.includes('pitfall') || lower.includes('trap') || lower.includes('alert') || lower.includes('mistake')) {
            return (
              <div 
                key={lineIdx} 
                className="mt-6 mb-3 p-3.5 sm:p-4 bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300/90 dark:border-rose-800/80 rounded-2xl flex items-center gap-3 shadow-xs"
              >
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 shrink-0">
                  <AlertTriangle className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-rose-950 dark:text-rose-200 tracking-wide uppercase">
                    {renderInlineFormatted(headingText)}
                  </h4>
                </div>
              </div>
            );
          }

          // Core Principle / Theory Heading
          if (lower.includes('core principle') || lower.includes('theory') || lower.includes('concept') || lower.includes('theorem')) {
            return (
              <div 
                key={lineIdx} 
                className="mt-6 mb-3 p-3.5 sm:p-4 bg-blue-50/90 dark:bg-blue-950/40 border border-blue-300/90 dark:border-blue-800/80 rounded-2xl flex items-center gap-3 shadow-xs"
              >
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 shrink-0">
                  <Compass className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-blue-950 dark:text-blue-200 tracking-wide uppercase">
                    {renderInlineFormatted(headingText)}
                  </h4>
                </div>
              </div>
            );
          }

          // Concrete Example / Mental Model Heading
          if (lower.includes('example') || lower.includes('mental model') || lower.includes('intuition')) {
            return (
              <div 
                key={lineIdx} 
                className="mt-6 mb-3 p-3.5 sm:p-4 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300/90 dark:border-amber-800/80 rounded-2xl flex items-center gap-3 shadow-xs"
              >
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-amber-950 dark:text-amber-200 tracking-wide uppercase">
                    {renderInlineFormatted(headingText)}
                  </h4>
                </div>
              </div>
            );
          }

          // Step-by-Step Derivation Heading
          if (lower.includes('step') || lower.includes('derivation') || lower.includes('proof') || lower.includes('solution')) {
            return (
              <div 
                key={lineIdx} 
                className="mt-6 mb-3 p-3.5 sm:p-4 bg-slate-100/90 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl flex items-center gap-3 shadow-xs"
              >
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-slate-950 dark:text-slate-100 tracking-wide uppercase">
                    {renderInlineFormatted(headingText)}
                  </h4>
                </div>
              </div>
            );
          }

          // Default Heading 4
          return (
            <div key={lineIdx} className="mt-5 mb-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
              <h4 className="text-xs sm:text-sm font-serif font-bold text-slate-900 dark:text-slate-200">
                {renderInlineFormatted(headingText)}
              </h4>
            </div>
          );
        }

        // 2. Heading 3 (###)
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={lineIdx} className="text-sm sm:text-base font-serif font-extrabold text-blue-950 dark:text-blue-300 mt-4 mb-2 pb-1.5 border-b border-slate-250 dark:border-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{renderInlineFormatted(trimmed.slice(4))}</span>
            </h3>
          );
        }

        // 3. Heading 2 (##)
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={lineIdx} className="text-base sm:text-lg font-serif font-extrabold text-slate-950 dark:text-white mt-5 mb-2.5 pb-1.5 border-b border-slate-300 dark:border-slate-700">
              {renderInlineFormatted(trimmed.slice(3))}
            </h2>
          );
        }

        // 4. Heading 1 (#)
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={lineIdx} className="text-lg sm:text-xl font-serif font-black text-slate-950 dark:text-white mt-6 mb-3 pb-2 border-b-2 border-blue-600 dark:border-blue-500">
              {renderInlineFormatted(trimmed.slice(2))}
            </h1>
          );
        }

        // 5. Blockquotes (> ...)
        if (trimmed.startsWith('> ')) {
          return (
            <div key={lineIdx} className="my-2.5 pl-4 py-2 border-l-4 border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100 rounded-r-xl italic">
              {renderInlineFormatted(trimmed.slice(2))}
            </div>
          );
        }

        // 6. Horizontal Rules (--- or ***)
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={lineIdx} className="my-4 border-t border-slate-200 dark:border-slate-800" />;
        }

        // 7. Bullet lists (- or *)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={lineIdx} className="flex items-start gap-2.5 pl-2 my-1 text-slate-950 dark:text-slate-100">
              <span className="text-amber-700 dark:text-amber-400 font-bold leading-tight select-none mt-1.5 text-[8px]">●</span>
              <div className="flex-1 leading-relaxed">{renderInlineFormatted(trimmed.slice(2))}</div>
            </div>
          );
        }

        // 8. Numbered lists (1., 2.)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2.5 pl-2 my-1 text-slate-950 dark:text-slate-100">
              <span className="font-mono text-blue-700 dark:text-blue-400 font-bold text-xs min-w-[20px] text-right mt-0.5">
                {numMatch[1]}.
              </span>
              <div className="flex-1 leading-relaxed">{renderInlineFormatted(numMatch[2])}</div>
            </div>
          );
        }

        // 9. Standard paragraph line with comfortable line-height and margin
        return (
          <p key={lineIdx} className="text-slate-950 dark:text-slate-100 font-normal leading-relaxed my-1.5 px-0.5">
            {renderInlineFormatted(line)}
          </p>
        );
      })}
    </div>
  );
}
