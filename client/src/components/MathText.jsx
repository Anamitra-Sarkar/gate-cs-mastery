import React, { useState } from 'react';
import katex from 'katex';
import { 
  Compass, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  Bookmark, 
  FileText,
  HelpCircle,
  Copy,
  Check,
  Code2,
  Terminal,
  Database,
  FileCode2,
  Code
} from 'lucide-react';

// Pre-clean LaTeX math syntax, bracket delimiters, exponents, and isolated raw LaTeX symbols
function preCleanMath(text) {
  if (!text) return '';
  
  let s = text;

  // 1. Standardize \[ ... \] and \( ... \) to $$ and $
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, '\n\n$$$$$1$$$$\n\n');
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, ' $$$1$$ ');

  // 2. Clean isolated raw LaTeX symbol commands and exponent corruption outside of math blocks
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
      seg = seg.replace(/105\s*distinct/g, '10⁵ distinct');
      seg = seg.replace(/([a-zA-Z\u{1D400}-\u{1D7FF}])2(\s|[\),;.])/gu, '$1²$2');
      seg = seg.replace(/([a-zA-Z\u{1D400}-\u{1D7FF}])3(\s|[\),;.])/gu, '$1³$2');
      seg = seg.replace(/\b2([nNkK])\b/g, '2^$1');

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

// Dedicated IDE/Terminal-Style Code Block
function CodeBlock({ code, lang = 'c' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const normalizedLang = (lang || 'code').toLowerCase();
  let displayLang = normalizedLang.toUpperCase();
  let LangIcon = Code;
  let iconColor = 'text-slate-400';

  if (normalizedLang === 'c' || normalizedLang === 'cpp') {
    displayLang = 'C';
    LangIcon = Terminal;
    iconColor = 'text-blue-400';
  } else if (normalizedLang === 'sql') {
    displayLang = 'SQL';
    LangIcon = Database;
    iconColor = 'text-sky-400';
  } else if (normalizedLang === 'python' || normalizedLang === 'py') {
    displayLang = 'PYTHON';
    LangIcon = FileCode2;
    iconColor = 'text-emerald-400';
  } else if (normalizedLang === 'text' || normalizedLang === 'pseudocode') {
    displayLang = 'PSEUDOCODE';
    LangIcon = Terminal;
    iconColor = 'text-amber-400';
  }

  return (
    <div className="my-3.5 rounded-2xl overflow-hidden border border-slate-750/90 dark:border-slate-800 bg-[#0b0f19] dark:bg-[#070b14] shadow-lg text-left">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 dark:bg-slate-900/60 border-b border-slate-800/80 select-none">
        <div className="flex items-center gap-2">
          {/* Mac window dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <LangIcon className={`w-3.5 h-3.5 ${iconColor}`} />
            <span className="font-mono text-[11px] font-bold tracking-wider text-slate-300">
              {displayLang}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 sm:p-5 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed text-slate-100 selection:bg-blue-600/50 selection:text-white">
        <pre className="whitespace-pre font-mono tab-4">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

// Dedicated Responsive Glassmorphic Table View
function TableView({ headers, rows }) {
  if (!headers || headers.length === 0) return null;

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-slate-250 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/60">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/90 dark:bg-slate-850/90 border-b border-slate-200 dark:border-slate-800">
              {headers.map((h, i) => (
                <th 
                  key={i} 
                  className="px-4 py-2.5 font-mono font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase text-[11px]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800/60">
            {rows.map((row, rIdx) => (
              <tr 
                key={rIdx} 
                className="even:bg-slate-50/60 dark:even:bg-slate-900/30 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors"
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-300">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper to check if a raw line looks like C or pseudo-code
function isCCodeLine(line) {
  const t = line.trim();
  if (!t) return false;
  return (
    /^#include\s*<.+>/.test(t) ||
    /^(int|void|float|char|double|bool|long|short)\s+[a-zA-Z_]\w*\s*\([^)]*\)\s*\{?/.test(t) ||
    /^(int|void)\s+main\s*\([^)]*\)\s*\{?/.test(t) ||
    /^(typedef\s+struct|struct\s+[a-zA-Z_]\w*\s*\{?)/.test(t) ||
    /^(printf|scanf)\s*\(/.test(t) ||
    /^(for|while|if|switch)\s*\(.+\)\s*\{?/.test(t) ||
    /^return\s+[^;]+;/.test(t) ||
    /^[{}]$/.test(t) ||
    /^\*?[a-zA-Z_]\w*\s*=\s*[^;]+;/.test(t) ||
    /^[a-zA-Z_]\w*\s*\([^)]*\)\s*;/.test(t) ||
    /;\s*$/.test(t)
  );
}

// Helper to check if a line looks like SQL
function isSQLLine(line) {
  const t = line.trim();
  if (!t) return false;
  return (
    /^(SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b/i.test(t) ||
    /^(FROM|WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+OUTER\s+JOIN|UNION|EXCEPT|INTERSECT)\b/i.test(t)
  );
}

// Helper to check if a line looks like Python
function isPythonLine(line) {
  const t = line.trim();
  if (!t) return false;
  return (
    /^(def|class|import|from)\s+[a-zA-Z_]/.test(t) ||
    /^(elif|except|finally)\s*:/.test(t) ||
    /^(if|for|while)\s+.*:$/.test(t)
  );
}

// Check if a line is a markdown table row
function isTableLine(line) {
  const t = line.trim();
  return t.startsWith('|') && t.endsWith('|') && t.includes('|');
}

// Parse markdown table block
function parseTableBlock(tableLines) {
  if (tableLines.length < 2) return null;
  const rows = tableLines.map(l => {
    return l.trim().slice(1, -1).split('|').map(c => c.trim());
  });
  const headers = rows[0];
  const dataRows = rows.slice(1).filter(r => !r.every(c => /^:?-+:?$/.test(c)));
  return { headers, dataRows };
}

// Tokenize text into semantic blocks (code blocks, tables, headings, quotes, lists, and unified paragraphs)
function parseBlocks(text) {
  if (!text) return [];
  const lines = text.split('\n');
  const blocks = [];
  let currentParagraph = [];
  let inCode = false;
  let codeLang = '';
  let codeLines = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'paragraph', text: currentParagraph.join(' ').trim() });
      currentParagraph = [];
    }
  };

  const flushCode = () => {
    if (codeLines.length > 0) {
      blocks.push({ type: 'code', lang: codeLang || 'code', code: codeLines.join('\n') });
      codeLines = [];
      codeLang = '';
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Explicit Markdown code fence ```
    if (trimmed.startsWith('```')) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushParagraph();
        inCode = true;
        codeLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    // 2. Markdown Table Detection
    if (isTableLine(line)) {
      flushParagraph();
      const tableLines = [line];
      while (i + 1 < lines.length && isTableLine(lines[i + 1])) {
        i++;
        tableLines.push(lines[i]);
      }
      const tableData = parseTableBlock(tableLines);
      if (tableData) {
        blocks.push({ type: 'table', headers: tableData.headers, rows: tableData.dataRows });
        continue;
      }
    }

    // 3. Headings (must have space after # to prevent collision with #include)
    if (/^#{1,6}\s+/.test(trimmed)) {
      flushParagraph();
      const level = trimmed.match(/^#+/)[0].length;
      blocks.push({ 
        type: 'heading', 
        level, 
        text: trimmed.replace(/^#{1,6}\s+/, '').trim() 
      });
      continue;
    }

    // 4. Blockquotes
    if (trimmed.startsWith('> ')) {
      flushParagraph();
      blocks.push({ type: 'quote', text: trimmed.slice(2).trim() });
      continue;
    }

    // 5. Horizontal Rules
    if (trimmed === '---' || trimmed === '***' || trimmed === '===') {
      flushParagraph();
      blocks.push({ type: 'hr' });
      continue;
    }

    // 6. Bullet Lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      blocks.push({ type: 'bullet', text: trimmed.slice(2).trim() });
      continue;
    }

    // 7. Numbered Lists
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      flushParagraph();
      blocks.push({ type: 'number', num: numMatch[1], text: numMatch[2].trim() });
      continue;
    }

    // 8. Blank Line => End of current paragraph
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    // 9. Auto-Detect SQL Query Blocks
    if (isSQLLine(line)) {
      flushParagraph();
      const sqlCode = [line];
      while (
        i + 1 < lines.length && 
        (isSQLLine(lines[i + 1]) || (!lines[i + 1].trim() && i + 2 < lines.length && isSQLLine(lines[i + 2])))
      ) {
        i++;
        sqlCode.push(lines[i]);
      }
      while (sqlCode.length > 0 && !sqlCode[sqlCode.length - 1].trim()) {
        sqlCode.pop();
      }
      blocks.push({ type: 'code', lang: 'sql', code: sqlCode.join('\n') });
      continue;
    }

    // 10. Auto-Detect Python Function Blocks
    if (isPythonLine(line)) {
      flushParagraph();
      const pyCode = [line];
      while (
        i + 1 < lines.length && 
        (isPythonLine(lines[i + 1]) || lines[i + 1].startsWith('    ') || lines[i + 1].startsWith('\t') || (!lines[i + 1].trim() && i + 2 < lines.length && (isPythonLine(lines[i + 2]) || lines[i + 2].startsWith('    '))))
      ) {
        i++;
        pyCode.push(lines[i]);
      }
      while (pyCode.length > 0 && !pyCode[pyCode.length - 1].trim()) {
        pyCode.pop();
      }
      blocks.push({ type: 'code', lang: 'python', code: pyCode.join('\n') });
      continue;
    }

    // 11. Auto-Detect Contiguous Raw C Code Blocks
    if (isCCodeLine(line)) {
      flushParagraph();
      const rawCode = [line];
      while (
        i + 1 < lines.length && 
        (isCCodeLine(lines[i + 1]) || (!lines[i + 1].trim() && i + 2 < lines.length && isCCodeLine(lines[i + 2])))
      ) {
        i++;
        rawCode.push(lines[i]);
      }
      while (rawCode.length > 0 && !rawCode[rawCode.length - 1].trim()) {
        rawCode.pop();
      }
      blocks.push({ type: 'code', lang: 'c', code: rawCode.join('\n') });
      continue;
    }

    // 12. Normal Paragraph Text
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushCode();
  return blocks;
}

function sanitizeFormula(formula) {
  if (!formula) return '';
  let s = formula.trim();
  s = s.replace(/\\text\{_+([a-zA-Z0-9\s]*)\}/g, '\\underline{\\hspace{1.5cm}}');
  s = s.replace(/_{2,}/g, '\\underline{\\hspace{1.5cm}}');
  return s;
}

export default function MathText({ text, className = '' }) {
  if (!text) return null;

  const cleanedText = preCleanMath(text);
  const blocks = parseBlocks(cleanedText);

  const renderInlineFormatted = (rawStr) => {
    if (!rawStr) return null;

    // Split on math delimiters ($$...$$ or $...$)
    const mathSegments = rawStr.split(/(\$\$[\s\S]+?\$\$|\$.+?\$)/g);

    return mathSegments.map((segment, segIdx) => {
      if (!segment) return null;

      // Display math $$...$$
      if (segment.startsWith('$$') && segment.endsWith('$$')) {
        const formula = sanitizeFormula(segment.slice(2, -2));
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
        const formula = sanitizeFormula(segment.slice(1, -1));
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
    <div className={`space-y-3 break-words leading-relaxed text-slate-950 dark:text-slate-100 font-normal px-0.5 ${className}`}>
      {blocks.map((block, blockIdx) => {
        // 1. Code Block (C, SQL, Python, Pseudocode)
        if (block.type === 'code') {
          return <CodeBlock key={blockIdx} code={block.code} lang={block.lang} />;
        }

        // 2. Table Block
        if (block.type === 'table') {
          return <TableView key={blockIdx} headers={block.headers} rows={block.rows} />;
        }

        // 3. Headings
        if (block.type === 'heading') {
          const headingText = block.text;
          const lower = headingText.toLowerCase();

          // Heading 4 Specialized Pedagogical Cards
          if (block.level === 4) {
            // Pitfall / Warning / Trap Heading
            if (lower.includes('pitfall') || lower.includes('trap') || lower.includes('alert') || lower.includes('mistake')) {
              return (
                <div 
                  key={blockIdx} 
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
                  key={blockIdx} 
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
                  key={blockIdx} 
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
                  key={blockIdx} 
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
              <div key={blockIdx} className="mt-5 mb-2.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                <h4 className="text-xs sm:text-sm font-serif font-bold text-slate-900 dark:text-slate-200">
                  {renderInlineFormatted(headingText)}
                </h4>
              </div>
            );
          }

          // Heading 3 (###)
          if (block.level === 3) {
            return (
              <h3 key={blockIdx} className="text-sm sm:text-base font-serif font-extrabold text-blue-950 dark:text-blue-300 mt-4 mb-2 pb-1.5 border-b border-slate-250 dark:border-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{renderInlineFormatted(headingText)}</span>
              </h3>
            );
          }

          // Heading 2 (##)
          if (block.level === 2) {
            return (
              <h2 key={blockIdx} className="text-base sm:text-lg font-serif font-extrabold text-slate-950 dark:text-white mt-5 mb-2.5 pb-1.5 border-b border-slate-300 dark:border-slate-700">
                {renderInlineFormatted(headingText)}
              </h2>
            );
          }

          // Heading 1 (#)
          return (
            <h1 key={blockIdx} className="text-lg sm:text-xl font-serif font-black text-slate-950 dark:text-white mt-6 mb-3 pb-2 border-b-2 border-blue-600 dark:border-blue-500">
              {renderInlineFormatted(headingText)}
            </h1>
          );
        }

        // 4. Blockquotes
        if (block.type === 'quote') {
          return (
            <div key={blockIdx} className="my-2.5 pl-4 py-2 border-l-4 border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100 rounded-r-xl italic">
              {renderInlineFormatted(block.text)}
            </div>
          );
        }

        // 5. Horizontal Rules
        if (block.type === 'hr') {
          return <hr key={blockIdx} className="my-4 border-t border-slate-200 dark:border-slate-800" />;
        }

        // 6. Bullet Lists
        if (block.type === 'bullet') {
          return (
            <div key={blockIdx} className="flex items-start gap-2.5 pl-2 my-1 text-slate-950 dark:text-slate-100">
              <span className="text-amber-700 dark:text-amber-400 font-bold leading-tight select-none mt-1.5 text-[8px]">●</span>
              <div className="flex-1 leading-relaxed">{renderInlineFormatted(block.text)}</div>
            </div>
          );
        }

        // 7. Numbered Lists
        if (block.type === 'number') {
          return (
            <div key={blockIdx} className="flex items-start gap-2.5 pl-2 my-1 text-slate-950 dark:text-slate-100">
              <span className="font-mono text-blue-700 dark:text-blue-400 font-bold text-xs min-w-[20px] text-right mt-0.5">
                {block.num}.
              </span>
              <div className="flex-1 leading-relaxed">{renderInlineFormatted(block.text)}</div>
            </div>
          );
        }

        // 8. Unified Natural Flowing Paragraphs
        return (
          <p key={blockIdx} className="text-slate-950 dark:text-slate-100 font-normal leading-relaxed my-2 px-0.5">
            {renderInlineFormatted(block.text)}
          </p>
        );
      })}
    </div>
  );
}
