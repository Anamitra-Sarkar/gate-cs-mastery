import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Eraser, Trash2, X, Download } from 'lucide-react';

export default function ScratchpadModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  const [color, setColor] = useState('#818cf8'); // Indigo
  const [lineWidth, setLineWidth] = useState(2);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [isOpen]);

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
    ctx.strokeStyle = tool === 'eraser' ? '#0f172a' : color;
    ctx.lineWidth = tool === 'eraser' ? 24 : lineWidth;
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
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[85vh] sm:h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Controls */}
        <div className="p-3 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold text-slate-300">Rough Sheet / Scratchpad</span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setTool('pen')}
                className={`p-1.5 rounded transition ${tool === 'pen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Pen"
              >
                <PenTool className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-1.5 rounded transition ${tool === 'eraser' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Eraser"
              >
                <Eraser className="w-4 h-4" />
              </button>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1.5">
              {['#818cf8', '#34d399', '#f87171', '#fbbf24', '#ffffff'].map(c => (
                <button
                  key={c}
                  onClick={() => { setColor(c); setTool('pen'); }}
                  style={{ backgroundColor: c }}
                  className={`w-4 h-4 rounded-full transition ${color === c && tool === 'pen' ? 'ring-2 ring-white scale-110' : ''}`}
                />
              ))}
            </div>

            <button
              onClick={clearCanvas}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition"
              title="Clear Canvas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition ml-auto"
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
