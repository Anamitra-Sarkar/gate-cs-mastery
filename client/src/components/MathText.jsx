import React from 'react';
import katex from 'katex';

export default function MathText({ text, className = '' }) {
  if (!text) return null;

  // Split by inline $...$ or display $$...$$
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$.+?\$)/g);

  return (
    <span className={`leading-relaxed whitespace-pre-wrap ${className}`}>
      {parts.map((part, index) => {
        if (!part) return null;

        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2);
          try {
            const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
            return <div key={index} className="my-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            return <span key={index} className="font-mono text-indigo-300">{math}</span>;
          }
        }

        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          try {
            const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
            return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            return <span key={index} className="font-mono text-indigo-300">{math}</span>;
          }
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
