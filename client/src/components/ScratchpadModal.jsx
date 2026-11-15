import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Eraser, Trash2, X, Download } from 'lucide-react';

export default function ScratchpadModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const bgColor = isDark ? '#0f1117' : '#fdfbf7';
  const defaultPenColor = isDark ? '#38bdf8' : '#1e3a8a';

  const [color, setColor] = useState(defaultPenColor);
  const [lineWidth, setLineWidth] = useState(2.5);

  useEffect(() => {
    setColor(defaultPenColor);
  }, [isDark]);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [isOpen, isDark]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = tool === 'eraser' ? bgColor : color;
    ctx.lineWidth = tool === 'eraser' ? 28 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const paletteColors = isDark 
    ? ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#c084fc', '#ffffff'] 
    : ['#1e3a8a', '#047857', '#b45309', '#b91c1c', '#6d28d9', '#0f172a'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#fdfbf7] dark:bg-[#0f1117] border border-slate-300 dark:border-slate-800 rounded-3xl w-full max-w-4xl h-[85vh] sm:h-[80vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Controls */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-serif font-bold text-slate-950 dark:text-slate-100">Rough Sheet / Scratchpad</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setTool('pen')}
                className={`p-1.5 rounded-lg transition ${tool === 'pen' ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                title="Pen"
              >
                <PenTool className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-1.5 rounded-lg transition ${tool === 'eraser' ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                title="Eraser"
              >
                <Eraser className="w-4 h-4" />
              </button>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1.5 px-2">
              {paletteColors.map(c => (
                <button
                  key={c}
                  onClick={() => { setColor(c); setTool('pen'); }}
                  style={{ backgroundColor: c }}
                  aria-label={`Select ink color ${c}`}
                  title={`Color ${c}`}
                  className={`w-4 h-4 rounded-full transition ${color === c && tool === 'pen' ? 'ring-2 ring-blue-600 scale-125' : 'hover:scale-110'}`}
                />
              ))}
            </div>

            <button
              onClick={clearCanvas}
              className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              title="Clear Canvas"
              aria-label="Clear entire canvas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Close scratchpad"
            title="Close"
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 w-full h-full relative cursor-crosshair touch-none">
          <canvas
            ref={canvasRef}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
            className="w-full h-full block"
          />
        </div>
      </div>
    </div>
  );
}