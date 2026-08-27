import React, { useState, useRef } from 'react';
import { Search, RotateCcw, Shuffle, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const INITIAL_ARRAY = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 89, 95];

export const SearchingPanel: React.FC = () => {
  const [array, setArray] = useState<number[]>(INITIAL_ARRAY);
  const [searchValue, setSearchValue] = useState<string>('23');
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(INITIAL_ARRAY.length - 1);
  const [mid, setMid] = useState<number>(-1);
  const [foundIdx, setFoundIdx] = useState<number>(-1);
  const [state, setState] = useState<'idle' | 'searching' | 'found' | 'notfound'>('idle');
  const [stepCount, setStepCount] = useState<number>(0);
  const [status, setStatus] = useState<string>('Koi bhi number search karo array mein se!');
  const [logs, setLogs] = useState<string[]>(['📋 Search Log:', '─────────────────────']);

  const isSearching = state === 'searching';
  const abortRef = useRef<boolean>(false);

  const generateNewSortedArray = () => {
    if (isSearching) return;
    const count = 12;
    const nums = new Set<number>();
    while (nums.size < count) {
      nums.add(Math.floor(Math.random() * 95) + 3);
    }
    const sorted = Array.from(nums).sort((a, b) => a - b);
    setArray(sorted);
    resetSearch(sorted);
  };

  const sleep = async (ms = 1200) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  };

  const startSearch = async () => {
    const text = searchValue.trim();
    if (!text) {
      setStatus('⚠️ Pehle ek number enter karo!');
      return;
    }
    const target = parseInt(text, 10);
    if (isNaN(target)) {
      setStatus('⚠️ Sirf number enter karo!');
      return;
    }

    abortRef.current = false;
    setState('searching');
    setFoundIdx(-1);
    let curLow = 0;
    let curHigh = array.length - 1;
    let curMid = -1;
    let steps = 0;

    setLow(curLow);
    setHigh(curHigh);
    setMid(-1);
    setStepCount(0);

    const initialLogs = [
      '📋 Search Log:',
      '─────────────────────',
      `🎯 Target: ${target}`,
      `📦 Array: [${array.join(', ')}]`,
      '',
    ];
    setLogs(initialLogs);

    while (curLow <= curHigh) {
      if (abortRef.current) return;
      curMid = Math.floor((curLow + curHigh) / 2);
      steps++;
      setLow(curLow);
      setHigh(curHigh);
      setMid(curMid);
      setStepCount(steps);

      const stepMsg = `Step ${steps}: low=${curLow}, high=${curHigh}, mid=${curMid} (value=${array[curMid]})`;
      setStatus(stepMsg);
      setLogs((prev) => [
        ...prev,
        `Step ${steps}: low[${curLow}]=${array[curLow]}, high[${curHigh}]=${array[curHigh]}, mid[${curMid}]=${array[curMid]}`,
      ]);

      await sleep(1200);
      if (abortRef.current) return;

      if (array[curMid] === target) {
        setFoundIdx(curMid);
        setState('found');
        setStatus(`✅ Found ${target} at index [${curMid}] in ${steps} steps!`);
        setLogs((prev) => [
          ...prev,
          '',
          `✅ FOUND! Value ${target} at index [${curMid}]`,
          `Total Steps: ${steps}`,
        ]);
        return;
      } else if (array[curMid] < target) {
        const oldLow = curLow;
        curLow = curMid + 1;
        setLogs((prev) => [
          ...prev,
          `   → ${array[curMid]} < ${target}, go RIGHT (low → ${oldLow + 1})`,
        ]);
      } else {
        curHigh = curMid - 1;
        setLogs((prev) => [
          ...prev,
          `   → ${array[curMid]} > ${target}, go LEFT (high → ${curMid - 1})`,
        ]);
      }
    }

    if (!abortRef.current) {
      setState('notfound');
      setStatus(`❌ ${target} nahi mila array mein!`);
      setLogs((prev) => [
        ...prev,
        '',
        `❌ NOT FOUND: ${target} is not in the array.`,
      ]);
    }
  };

  const resetSearch = (currentArr = array) => {
    abortRef.current = true;
    setState('idle');
    setLow(0);
    setHigh(currentArr.length - 1);
    setMid(-1);
    setFoundIdx(-1);
    setStepCount(0);
    setStatus('Koi bhi number search karo array mein se!');
    setLogs(['📋 Search Log:', '─────────────────────']);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 max-w-6xl mx-auto w-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-[#191928] p-4 rounded-xl border border-[#323250]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#10B981]">
              Binary Search Visualizer
            </h2>
            <p className="text-xs text-[#7878A0] italic mt-0.5">
              (Array sorted hai — Binary Search tabhi kaam karta hai!)
            </p>
          </div>
        </div>

        <button
          id="btn-new-sorted-array"
          disabled={isSearching}
          onClick={generateNewSortedArray}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#28283C] hover:bg-[#353550] text-xs font-semibold text-slate-200 border border-[#4B4B70] transition-colors cursor-pointer disabled:opacity-50"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>New Sorted Array</span>
        </button>
      </div>

      {/* Main Grid: Array View + Log Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {/* Left 2 Cols: Array Cells Visualization */}
        <div className="lg:col-span-2 bg-[#161626] border-2 border-[#323250] rounded-xl p-6 flex flex-col justify-between shadow-inner min-h-[340px]">
          {/* Top Pointer Indicators & Cells */}
          <div className="flex-1 flex flex-col justify-center items-center py-6 overflow-x-auto w-full">
            <div className="relative inline-flex items-center gap-2 px-4 py-8">
              {/* Range background box when searching */}
              {state !== 'idle' && low <= high && (
                <div
                  style={{
                    left: `${low * 68 + 12}px`,
                    width: `${Math.max(1, high - low + 1) * 68 - 8}px`,
                  }}
                  className="absolute top-6 bottom-6 bg-indigo-500/15 border border-indigo-500/30 rounded-xl transition-all duration-300 pointer-events-none"
                />
              )}

              {array.map((val, idx) => {
                const isMid = idx === mid && state !== 'idle';
                const isLow = idx === low && state !== 'idle';
                const isHigh = idx === high && state !== 'idle';
                const isFound = state === 'found' && idx === foundIdx;
                const inRange = state !== 'idle' && idx >= low && idx <= high;

                let cellBg = 'bg-[#232338] border-[#3F3F60] text-slate-200';
                if (isFound) {
                  cellBg = 'bg-[#10B981] border-emerald-300 text-white ring-4 ring-emerald-500/40 scale-105 shadow-lg';
                } else if (isMid) {
                  cellBg = 'bg-[#F59E0B] border-amber-300 text-white ring-2 ring-amber-400/50 scale-105';
                } else if (isLow) {
                  cellBg = 'bg-[#6366F1] border-indigo-300 text-white ring-2 ring-indigo-400/50';
                } else if (isHigh) {
                  cellBg = 'bg-[#EF4444] border-red-300 text-white ring-2 ring-red-400/50';
                } else if (inRange) {
                  cellBg = 'bg-[#2E2E48] border-[#55557A] text-slate-100';
                } else if (state !== 'idle') {
                  cellBg = 'bg-[#181824] border-[#252538] text-slate-600 opacity-60';
                }

                return (
                  <div key={idx} className="flex flex-col items-center relative select-none w-15">
                    {/* Top Pointer Badge */}
                    <div className="h-6 flex items-center justify-center mb-1">
                      {isLow && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#6366F1] text-white shadow">
                          LOW
                        </span>
                      )}
                      {isHigh && !isLow && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#EF4444] text-white shadow">
                          HIGH
                        </span>
                      )}
                      {isLow && isHigh && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-600 text-white shadow">
                          L & H
                        </span>
                      )}
                    </div>

                    {/* Cell Box */}
                    <div
                      className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-all duration-200 ${cellBg}`}
                    >
                      {val}
                    </div>

                    {/* Index & Bottom Pointer */}
                    <div className="text-[11px] text-[#7878A0] font-mono mt-1">
                      [{idx}]
                    </div>
                    <div className="h-5 flex items-center justify-center">
                      {isMid && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#F59E0B] text-slate-950 shadow">
                          MID
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 pt-4 border-t border-[#28283C] text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#6366F1]" />
              <span>LOW pointer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#F59E0B]" />
              <span>MID element</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#EF4444]" />
              <span>HIGH pointer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#10B981]" />
              <span>Found!</span>
            </div>
          </div>
        </div>

        {/* Right Col: Monospace Search Log */}
        <div className="bg-[#161626] border-2 border-[#323250] rounded-xl p-4 flex flex-col h-full min-h-[300px]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#28283C] text-sm font-bold text-emerald-400">
            <FileText className="w-4 h-4" />
            <span>Search Log</span>
          </div>

          <div
            id="search-log-area"
            className="flex-1 overflow-y-auto p-3 font-mono text-xs text-[#A0C8A0] bg-[#12121E] rounded-lg mt-3 border border-[#28283C] whitespace-pre-wrap leading-relaxed select-text"
          >
            {logs.map((log, i) => (
              <div
                key={i}
                className={
                  log.includes('FOUND!')
                    ? 'text-emerald-300 font-bold'
                    : log.includes('NOT FOUND')
                    ? 'text-red-400 font-bold'
                    : ''
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Controls Panel */}
      <div className="bg-[#161626] border border-[#323250] rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-300 font-medium whitespace-nowrap">
            Search Value:
          </label>
          <input
            id="input-search-value"
            type="number"
            value={searchValue}
            disabled={isSearching}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') startSearch();
            }}
            placeholder="Target"
            className="w-24 px-3 py-1.5 rounded-lg bg-[#28283C] text-white font-bold text-sm border border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />

          <button
            id="btn-start-search"
            disabled={isSearching}
            onClick={startSearch}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10B981] hover:bg-emerald-600 font-bold text-xs sm:text-sm text-white transition-colors shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>

          <button
            id="btn-reset-search"
            onClick={() => resetSearch()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#EF4444] hover:bg-red-600 font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Status and Steps */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#28283C] pt-2 sm:pt-0">
          <div className="text-xs sm:text-sm text-[#A0A0C8] flex items-center gap-1.5">
            {state === 'found' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : state === 'notfound' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            )}
            <span>{status}</span>
          </div>

          <div className="text-xs sm:text-sm font-bold text-[#F59E0B] whitespace-nowrap bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
            Steps: {stepCount}
          </div>
        </div>
      </div>
    </div>
  );
};
