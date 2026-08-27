import React, { useState, useRef } from 'react';
import { StackItem } from '../types';
import { ArrowUp, ArrowDown, Eye, Trash2, Info, FileText } from 'lucide-react';

const MAX_STACK_SIZE = 8;

export const StackPanel: React.FC = () => {
  const [stack, setStack] = useState<StackItem[]>([
    { id: '1', value: 45 },
    { id: '2', value: 12 },
    { id: '3', value: 89 },
  ]);
  const [inputValue, setInputValue] = useState<string>('30');
  const [highlightType, setHighlightType] = useState<'' | 'push' | 'pop' | 'peek'>('');
  const [status, setStatus] = useState<string>('PUSH karo — koi bhi number!');
  const [logs, setLogs] = useState<string[]>([
    '📋 Operation Log:',
    '──────────────────',
    'Initial stack loaded with [45, 12, 89]',
  ]);

  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerHighlight = (type: 'push' | 'pop' | 'peek', duration = 800) => {
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    setHighlightType(type);
    highlightTimerRef.current = setTimeout(() => {
      setHighlightType('');
    }, duration);
  };

  const handlePush = () => {
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
    if (stack.length >= MAX_STACK_SIZE) {
      setStatus('⚠️ Stack full hai! Pehle POP karo.');
      return;
    }

    const newItem: StackItem = {
      id: `${Date.now()}-${Math.random()}`,
      value: val,
    };
    const newStack = [...stack, newItem];
    setStack(newStack);
    triggerHighlight('push', 800);
    setInputValue('');
    setStatus(`✅ PUSH(${val}) — Top pe add ho gaya!`);
    setLogs((prev) => [
      ...prev,
      `⬆ PUSH(${val}) → Stack size: ${newStack.length}`,
    ]);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setStatus('⚠️ Stack khali hai — POP nahi ho sakta!');
      return;
    }
    triggerHighlight('pop', 600);
    const poppedItem = stack[stack.length - 1];

    setTimeout(() => {
      setStack((prev) => prev.slice(0, -1));
      setStatus(`✅ POP — ${poppedItem.value} nikal gaya top se!`);
      setLogs((prev) => [
        ...prev,
        `⬇ POP() → ${poppedItem.value} nikala | Stack size: ${stack.length - 1}`,
      ]);
    }, 300);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setStatus('⚠️ Stack khali hai!');
      return;
    }
    const topItem = stack[stack.length - 1];
    triggerHighlight('peek', 1000);
    setStatus(`👁 PEEK — Top element: ${topItem.value} (nahi nikala)`);
    setLogs((prev) => [
      ...prev,
      `👁 PEEK() → Top = ${topItem.value} (removed nahi)`,
    ]);
  };

  const handleClear = () => {
    setStack([]);
    setHighlightType('');
    setStatus('Stack clear ho gayi!');
    setLogs((prev) => [...prev, '🗑 CLEAR — Stack khali ho gayi']);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 max-w-6xl mx-auto w-full gap-4">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-[#191928] p-4 rounded-xl border border-[#323250]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📚</span>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#F59E0B]">
              Stack Visualizer
            </h2>
            <p className="text-xs text-[#7878A0] italic mt-0.5">
              LIFO — Last In, First Out
            </p>
          </div>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#28283C] text-amber-400 border border-amber-500/30 font-bold">
          Capacity: {stack.length} / {MAX_STACK_SIZE}
        </div>
      </div>

      {/* Main Grid: Stack Container + Right Info & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {/* Left 2 Cols: Stack Physics Box */}
        <div className="lg:col-span-2 bg-[#161626] border-2 border-[#323250] rounded-xl p-6 flex flex-col justify-between shadow-inner min-h-[380px] relative">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold text-[#A0A0C8]">Size: {stack.length}</span>
            <span className="text-[11px] text-slate-500">Max elements: {MAX_STACK_SIZE}</span>
          </div>

          {/* Stack Container Canvas */}
          <div className="flex-1 flex flex-col items-center justify-end pb-4 pt-2">
            <div className="w-64 sm:w-72 border-x-4 border-b-8 border-[#3F3F60] rounded-b-xl px-4 pt-4 pb-2 bg-[#12121E]/60 flex flex-col-reverse gap-2 min-h-[280px] justify-start shadow-xl relative">
              {stack.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 italic text-sm text-center px-4">
                  Stack khali hai — PUSH karo!
                </div>
              ) : (
                stack.map((item, idx) => {
                  const isTop = idx === stack.length - 1;
                  let itemBg = 'from-amber-500 to-amber-600 border-amber-400';

                  if (isTop) {
                    if (highlightType === 'push') {
                      itemBg = 'from-emerald-400 to-[#10B981] border-emerald-300 ring-4 ring-emerald-500/40 scale-102';
                    } else if (highlightType === 'pop') {
                      itemBg = 'from-red-400 to-[#EF4444] border-red-300 ring-4 ring-red-500/40 opacity-70';
                    } else if (highlightType === 'peek') {
                      itemBg = 'from-indigo-400 to-[#6366F1] border-indigo-300 ring-4 ring-indigo-500/40 scale-105';
                    } else {
                      itemBg = 'from-amber-400 to-amber-500 border-amber-300 ring-2 ring-amber-400/30';
                    }
                  }

                  return (
                    <div
                      key={item.id}
                      className={`h-12 w-full rounded-lg bg-gradient-to-r ${itemBg} border-2 flex items-center justify-center font-bold text-xl text-white shadow-lg transition-all duration-200 relative select-none`}
                    >
                      <span>{item.value}</span>
                      {isTop && (
                        <span className="absolute -right-20 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2 py-0.5 rounded-full font-mono font-bold animate-pulse whitespace-nowrap">
                          ◀ TOP
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Label */}
            <div className="text-xs font-bold text-[#64648C] mt-2 tracking-wider">
              ▼ BOTTOM
            </div>
          </div>
        </div>

        {/* Right Col: Info & Logs */}
        <div className="flex flex-col gap-4">
          {/* Stack Info Box */}
          <div className="bg-[#161626] border-2 border-[#F59E0B] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F59E0B] mb-2">
              <Info className="w-4 h-4" />
              <span>Stack Info</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#A0A0D2] font-mono leading-relaxed">
              <li>• <b className="text-emerald-400">PUSH</b> → Top pe add karo</li>
              <li>• <b className="text-red-400">POP</b> → Top se nikalo</li>
              <li>• <b className="text-indigo-400">PEEK</b> → Top dekho (remove nahi)</li>
              <li>• <b className="text-amber-400">LIFO</b> — Last In First Out</li>
              <li className="text-[11px] text-slate-400">• Use: Undo, Recursion, Browser back</li>
            </ul>
          </div>

          {/* Operation Log */}
          <div className="bg-[#161626] border-2 border-[#323250] rounded-xl p-4 flex-1 flex flex-col min-h-[200px]">
            <div className="flex items-center gap-2 pb-2 border-b border-[#28283C] text-sm font-bold text-amber-400">
              <FileText className="w-4 h-4" />
              <span>Operation Log</span>
            </div>
            <div
              id="stack-log-area"
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
            id="input-stack-value"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handlePush();
            }}
            placeholder="Val"
            className="w-20 px-3 py-1.5 rounded-lg bg-[#28283C] text-white font-bold text-sm border border-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />

          <button
            id="btn-stack-push"
            onClick={handlePush}
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#10B981] hover:bg-emerald-600 font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <ArrowUp className="w-4 h-4" />
            <span>PUSH</span>
          </button>

          <button
            id="btn-stack-pop"
            onClick={handlePop}
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#EF4444] hover:bg-red-600 font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer shadow-md shadow-red-500/20"
          >
            <ArrowDown className="w-4 h-4" />
            <span>POP</span>
          </button>

          <button
            id="btn-stack-peek"
            onClick={handlePeek}
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#6366F1] hover:bg-indigo-600 font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer shadow-md shadow-indigo-500/20"
          >
            <Eye className="w-4 h-4" />
            <span>PEEK</span>
          </button>

          <button
            id="btn-stack-clear"
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
