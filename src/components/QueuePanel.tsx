import React, { useState, useRef } from 'react';
import { QueueItem } from '../types';
import { ArrowRight, ArrowLeft, Eye, Trash2, Info, FileText } from 'lucide-react';

const MAX_QUEUE_SIZE = 8;

export const QueuePanel: React.FC = () => {
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: '1', value: 10 },
    { id: '2', value: 25 },
    { id: '3', value: 40 },
    { id: '4', value: 55 },
  ]);
  const [inputValue, setInputValue] = useState<string>('70');
  const [highlightType, setHighlightType] = useState<'' | 'enqueue' | 'dequeue' | 'peek'>('');
  const [status, setStatus] = useState<string>('ENQUEUE karo — koi bhi number!');
  const [logs, setLogs] = useState<string[]>([
    '📋 Operation Log:',
    '──────────────────',
    'Initial queue initialized with [10, 25, 40, 55]',
  ]);

  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerHighlight = (type: 'enqueue' | 'dequeue' | 'peek', duration = 800) => {
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    setHighlightType(type);
    highlightTimerRef.current = setTimeout(() => {
      setHighlightType('');
    }, duration);
  };

  const handleEnqueue = () => {
    const text = inputValue.trim();
    if (!text) {
      setStatus('⚠️ Value enter karo!');
      return;
    }
    const val = parseInt(text, 10);
    if (isNaN(val)) {
      setStatus('⚠️ Sirf number enter karo!');
      return;
    }
    if (queue.length >= MAX_QUEUE_SIZE) {
      setStatus('⚠️ Queue full hai! Pehle DEQUEUE karo.');
      return;
    }

    const newItem: QueueItem = {
      id: `${Date.now()}-${Math.random()}`,
      value: val,
    };
    const newQueue = [...queue, newItem];
    setQueue(newQueue);
    triggerHighlight('enqueue', 800);
    setInputValue('');
    setStatus(`✅ ENQUEUE(${val}) — Rear pe add ho gaya!`);
    setLogs((prev) => [
      ...prev,
      `➡ ENQUEUE(${val}) → Rear pe add | Size: ${newQueue.length}`,
    ]);
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setStatus('⚠️ Queue khali hai!');
      return;
    }
    triggerHighlight('dequeue', 600);
    const dequeuedItem = queue[0];

    setTimeout(() => {
      setQueue((prev) => prev.slice(1));
      setStatus(`✅ DEQUEUE — ${dequeuedItem.value} front se nikal gaya!`);
      setLogs((prev) => [
        ...prev,
        `⬅ DEQUEUE() → ${dequeuedItem.value} nikala (Front) | Size: ${queue.length - 1}`,
      ]);
    }, 300);
  };

  const handlePeek = () => {
    if (queue.length === 0) {
      setStatus('⚠️ Queue khali hai!');
      return;
    }
    const frontItem = queue[0];
    triggerHighlight('peek', 1000);
    setStatus(`👁 PEEK — Front element: ${frontItem.value} (nahi nikala)`);
    setLogs((prev) => [
      ...prev,
      `👁 PEEK() → Front = ${frontItem.value} (removed nahi)`,
    ]);
  };

  const handleClear = () => {
    setQueue([]);
    setHighlightType('');
    setStatus('Queue clear ho gayi!');
    setLogs((prev) => [...prev, '🗑 CLEAR — Queue khali ho gayi']);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 max-w-6xl mx-auto w-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-[#191928] p-4 rounded-xl border border-[#323250]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔄</span>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#EF4444]">
              Queue Visualizer
            </h2>
            <p className="text-xs text-[#7878A0] italic mt-0.5">
              FIFO — First In, First Out
            </p>
          </div>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#28283C] text-red-400 border border-red-500/30 font-bold">
          Capacity: {queue.length} / {MAX_QUEUE_SIZE}
        </div>
      </div>

      {/* Main Grid: Queue Canvas + Info & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {/* Left 2 Cols: Queue Visualizer Canvas */}
        <div className="lg:col-span-2 bg-[#161626] border-2 border-[#323250] rounded-xl p-6 flex flex-col justify-between shadow-inner min-h-[380px]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold text-[#A0A0C8]">Size: {queue.length}</span>
            <span className="text-[11px] text-slate-500">Max elements: {MAX_QUEUE_SIZE}</span>
          </div>

          {/* Queue Visualization Track */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-x-auto w-full">
            {/* Flow Indicators */}
            {queue.length > 0 && (
              <div className="flex items-center justify-between w-full max-w-lg mb-3 px-4 text-xs font-bold select-none">
                <span className="text-[#EF4444] flex items-center gap-1 animate-pulse">
                  ← DEQUEUE
                </span>
                <span className="text-[#10B981] flex items-center gap-1 animate-pulse">
                  ENQUEUE →
                </span>
              </div>
            )}

            {/* Queue Item Nodes */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 p-4 min-h-[140px] bg-[#12121E]/60 rounded-xl border border-[#28283C] w-full max-w-2xl relative">
              {queue.length === 0 ? (
                <div className="text-slate-500 italic text-sm text-center">
                  Queue khali hai — ENQUEUE karo!
                </div>
              ) : (
                queue.map((item, idx) => {
                  const isFront = idx === 0;
                  const isRear = idx === queue.length - 1;

                  let cellBg = 'from-[#3A3A54] to-[#2B2B40] border-[#55557A]';

                  if (isFront && highlightType === 'dequeue') {
                    cellBg = 'from-red-400 to-[#EF4444] border-red-300 ring-4 ring-red-500/40 opacity-70';
                  } else if (isFront && highlightType === 'peek') {
                    cellBg = 'from-indigo-400 to-[#6366F1] border-indigo-300 ring-4 ring-indigo-500/40 scale-105';
                  } else if (isRear && highlightType === 'enqueue') {
                    cellBg = 'from-emerald-400 to-[#10B981] border-emerald-300 ring-4 ring-emerald-500/40 scale-105';
                  } else if (isFront) {
                    cellBg = 'from-red-500/80 to-red-600/80 border-red-400 ring-2 ring-red-400/30';
                  } else if (isRear) {
                    cellBg = 'from-emerald-500/80 to-emerald-600/80 border-emerald-400 ring-2 ring-emerald-400/30';
                  }

                  return (
                    <React.Fragment key={item.id}>
                      <div className="flex flex-col items-center select-none relative">
                        {/* Top Label (FRONT) */}
                        <div className="h-5 flex items-center justify-center mb-1">
                          {isFront && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-[#EF4444] text-white shadow">
                              FRONT
                            </span>
                          )}
                        </div>

                        {/* Cell Box */}
                        <div
                          className={`w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-gradient-to-br ${cellBg} border-2 flex items-center justify-center font-bold text-xl text-white shadow-lg transition-all duration-200`}
                        >
                          {item.value}
                        </div>

                        {/* Bottom Label (REAR) */}
                        <div className="h-5 flex items-center justify-center mt-1">
                          {isRear && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-[#10B981] text-white shadow">
                              REAR
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Direction Arrow Between Cells */}
                      {idx < queue.length - 1 && (
                        <div className="text-slate-500 font-bold text-lg select-none px-0.5">
                          →
                        </div>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>

          {/* Queue Legend */}
          <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 pt-4 border-t border-[#28283C] text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#EF4444]" />
              <span>Front (Dequeue site)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#10B981]" />
              <span>Rear (Enqueue site)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#6366F1]" />
              <span>Peek Highlight</span>
            </div>
          </div>
        </div>

        {/* Right Col: Info & Logs */}
        <div className="flex flex-col gap-4">
          {/* Queue Info Box */}
          <div className="bg-[#161626] border-2 border-[#EF4444] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-[#EF4444] mb-2">
              <Info className="w-4 h-4" />
              <span>Queue Info</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#A0A0D2] font-mono leading-relaxed">
              <li>• <b className="text-emerald-400">ENQUEUE</b> → Rear pe add karo</li>
              <li>• <b className="text-red-400">DEQUEUE</b> → Front se nikalo</li>
              <li>• <b className="text-indigo-400">PEEK</b> → Front dekho (remove nahi)</li>
              <li>• <b className="text-red-400">FIFO</b> — First In First Out</li>
              <li className="text-[11px] text-slate-400">• Use: Print queue, BFS, CPU scheduling</li>
            </ul>
          </div>

          {/* Operation Log */}
          <div className="bg-[#161626] border-2 border-[#323250] rounded-xl p-4 flex-1 flex flex-col min-h-[200px]">
            <div className="flex items-center gap-2 pb-2 border-b border-[#28283C] text-sm font-bold text-red-400">
              <FileText className="w-4 h-4" />
              <span>Operation Log</span>
            </div>
            <div
              id="queue-log-area"
              className="flex-1 overflow-y-auto p-3 font-mono text-xs text-[#A0C8A0] bg-[#12121E] rounded-lg mt-3 border border-[#28283C] whitespace-pre-wrap select-text leading-relaxed"
            >
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-[#161626] border border-[#323250] rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <label className="text-sm text-slate-300 font-medium whitespace-nowrap">
            Value:
          </label>
          <input
            id="input-queue-value"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEnqueue();
            }}
            placeholder="Val"
            className="w-20 px-3 py-1.5 rounded-lg bg-[#28283C] text-white font-bold text-sm border border-[#EF4444] focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />

          <button
            id="btn-queue-enqueue"
            onClick={handleEnqueue}
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#10B981] hover:bg-emerald-600 font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <ArrowRight className="w-4 h-4" />
            <span>ENQUEUE</span>
          </button>

          <button
            id="btn-queue-dequeue"
            onClick={handleDequeue}
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#EF4444] hover:bg-red-600 font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer shadow-md shadow-red-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>DEQUEUE</span>
          </button>

          <button
            id="btn-queue-peek"
            onClick={handlePeek}
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#6366F1] hover:bg-indigo-600 font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer shadow-md shadow-indigo-500/20"
          >
            <Eye className="w-4 h-4" />
            <span>PEEK</span>
          </button>

          <button
            id="btn-queue-clear"
            onClick={handleClear}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#3F3F5A] hover:bg-[#4E4E70] font-bold text-xs sm:text-sm text-slate-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR</span>
          </button>
        </div>

        {/* Status */}
        <div className="text-xs sm:text-sm text-[#A0A0C8] font-medium border-t sm:border-t-0 border-[#28283C] pt-2 sm:pt-0 w-full sm:w-auto">
          {status}
        </div>
      </div>
    </div>
  );
};
