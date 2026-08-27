import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SortingAlgorithm, SortBar } from '../types';
import { Play, RotateCcw, Shuffle, Sparkles } from 'lucide-react';

const BAR_COUNT = 30;

export const SortingPanel: React.FC = () => {
  const [algo, setAlgo] = useState<SortingAlgorithm>('Bubble Sort');
  const [bars, setBars] = useState<SortBar[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(5);
  const [steps, setSteps] = useState<number>(0);
  const [status, setStatus] = useState<string>('Ready! Algorithm choose karo aur Start karo.');

  // Ref to cancel/abort sorting asynchronously
  const abortRef = useRef<boolean>(false);
  const speedRef = useRef<number>(speed);
  speedRef.current = speed;

  const generateArray = useCallback(() => {
    const newBars: SortBar[] = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      newBars.push({
        id: i,
        value: Math.floor(Math.random() * 90) + 10,
        state: 0, // 0: default, 1: compare, 2: sorted, 3: min
      });
    }
    setBars(newBars);
    setSteps(0);
    setStatus('Ready! Algorithm choose karo aur Start karo.');
  }, []);

  useEffect(() => {
    generateArray();
    return () => {
      abortRef.current = true;
    };
  }, [generateArray]);

  const sleep = async () => {
    const delay = Math.max(30, 550 - speedRef.current * 50);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };

  const startSorting = async () => {
    if (isSorting) return;
    setIsSorting(true);
    abortRef.current = false;
    let stepCount = 0;

    const currentArray = bars.map((b) => ({ ...b, state: 0 }));
    setBars([...currentArray]);

    try {
      if (algo === 'Bubble Sort') {
        setStatus('Bubble Sort chal raha hai...');
        const n = currentArray.length;
        for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            if (abortRef.current) return;
            currentArray[j].state = 1;
            currentArray[j + 1].state = 1;
            setStatus(`Comparing: ${currentArray[j].value} and ${currentArray[j + 1].value}`);
            setBars([...currentArray]);
            await sleep();

            if (currentArray[j].value > currentArray[j + 1].value) {
              const temp = currentArray[j].value;
              currentArray[j].value = currentArray[j + 1].value;
              currentArray[j + 1].value = temp;
              stepCount++;
              setSteps(stepCount);
            }
            currentArray[j].state = 0;
            currentArray[j + 1].state = 0;
          }
          currentArray[n - 1 - i].state = 2;
          setBars([...currentArray]);
        }
        currentArray[0].state = 2;
        setBars([...currentArray]);
      } else if (algo === 'Selection Sort') {
        setStatus('Selection Sort chal raha hai...');
        const n = currentArray.length;
        for (let i = 0; i < n - 1; i++) {
          let minIdx = i;
          currentArray[i].state = 3;
          for (let j = i + 1; j < n; j++) {
            if (abortRef.current) return;
            currentArray[j].state = 1;
            setStatus(`Finding minimum... current min: ${currentArray[minIdx].value}`);
            setBars([...currentArray]);
            await sleep();

            if (currentArray[j].value < currentArray[minIdx].value) {
              if (minIdx !== i) currentArray[minIdx].state = 0;
              minIdx = j;
              currentArray[minIdx].state = 3;
            } else {
              currentArray[j].state = 0;
            }
          }
          if (abortRef.current) return;
          const temp = currentArray[i].value;
          currentArray[i].value = currentArray[minIdx].value;
          currentArray[minIdx].value = temp;
          stepCount++;
          setSteps(stepCount);

          currentArray[i].state = 2;
          if (minIdx !== i) currentArray[minIdx].state = 0;
          setBars([...currentArray]);
        }
        currentArray[n - 1].state = 2;
        setBars([...currentArray]);
      } else if (algo === 'Insertion Sort') {
        setStatus('Insertion Sort chal raha hai...');
        const n = currentArray.length;
        currentArray[0].state = 2;
        for (let i = 1; i < n; i++) {
          if (abortRef.current) return;
          const key = currentArray[i].value;
          let j = i - 1;
          currentArray[i].state = 1;
          setStatus(`Inserting ${key} at correct position...`);
          setBars([...currentArray]);
          await sleep();

          while (j >= 0 && currentArray[j].value > key) {
            if (abortRef.current) return;
            currentArray[j + 1].value = currentArray[j].value;
            currentArray[j + 1].state = 1;
            currentArray[j].state = 1;
            j--;
            stepCount++;
            setSteps(stepCount);
            setBars([...currentArray]);
            await sleep();
          }
          currentArray[j + 1].value = key;
          for (let k = 0; k <= i; k++) {
            currentArray[k].state = 2;
          }
          setBars([...currentArray]);
        }
      }

      if (!abortRef.current) {
        for (let i = 0; i < currentArray.length; i++) {
          currentArray[i].state = 2;
        }
        setBars([...currentArray]);
        setStatus(`✅ Sorting Complete! Steps: ${stepCount}`);
      }
    } catch {
      // stopped
    } finally {
      setIsSorting(false);
    }
  };

  const resetSorting = () => {
    abortRef.current = true;
    setIsSorting(false);
    generateArray();
    setStatus('Reset! New array ready.');
    setSteps(0);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 max-w-6xl mx-auto w-full gap-4">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-[#191928] p-4 rounded-xl border border-[#323250]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <h2 className="text-xl md:text-2xl font-bold text-[#6366F1]">Sorting Visualizer</h2>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-300 font-medium">Algorithm:</label>
          <select
            id="algo-select"
            value={algo}
            disabled={isSorting}
            onChange={(e) => setAlgo(e.target.value as SortingAlgorithm)}
            className="bg-[#28283C] text-white text-sm font-semibold px-3 py-2 rounded-lg border border-[#4B4B70] focus:outline-none focus:border-[#6366F1] cursor-pointer disabled:opacity-50"
          >
            <option value="Bubble Sort">Bubble Sort</option>
            <option value="Selection Sort">Selection Sort</option>
            <option value="Insertion Sort">Insertion Sort</option>
          </select>
        </div>
      </div>

      {/* Main Bar Visualization Panel */}
      <div className="flex-1 min-h-[320px] md:min-h-[380px] bg-[#161626] border-2 border-[#323250] rounded-xl p-4 md:p-6 flex flex-col justify-between shadow-inner">
        {/* Bars Container */}
        <div className="flex-1 flex items-end justify-center gap-1 sm:gap-1.5 md:gap-2 pb-4 pt-8 w-full">
          {bars.map((bar) => {
            // Colors matching Java original
            let bgGradient = 'from-indigo-400 to-[#6366F1] border-indigo-300';
            if (bar.state === 1) {
              // Comparing
              bgGradient = 'from-red-400 to-[#EF4444] border-red-300 ring-2 ring-red-400/50';
            } else if (bar.state === 2) {
              // Sorted
              bgGradient = 'from-emerald-400 to-[#10B981] border-emerald-300';
            } else if (bar.state === 3) {
              // Min / Pivot
              bgGradient = 'from-amber-400 to-[#F59E0B] border-amber-300 ring-2 ring-amber-400/50';
            }

            return (
              <div
                key={bar.id}
                className="flex-1 max-w-[28px] flex flex-col items-center justify-end h-full group relative"
              >
                {/* Number Value On Top */}
                <span className="text-[10px] sm:text-xs font-bold text-slate-200 mb-1 select-none text-center">
                  {bar.value}
                </span>

                {/* Bar */}
                <div
                  style={{ height: `${(bar.value / 100) * 85}%` }}
                  className={`w-full rounded-t-md bg-gradient-to-b ${bgGradient} border-t shadow-md transition-all duration-100`}
                />
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 pt-3 border-t border-[#28283C] text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#6366F1]" />
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#EF4444]" />
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#F59E0B]" />
            <span>Min / Pivot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#10B981]" />
            <span>Sorted</span>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="bg-[#161626] border border-[#323250] rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
        {/* Speed Slider */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-300 font-medium">Speed:</label>
          <input
            id="speed-slider"
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 sm:w-32 accent-[#6366F1] cursor-pointer"
          />
          <span className="text-xs font-mono text-indigo-300 w-4">{speed}x</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            id="btn-new-array"
            disabled={isSorting}
            onClick={generateArray}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#6366F1] hover:bg-indigo-600 font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <Shuffle className="w-4 h-4" />
            <span>🎲 New Array</span>
          </button>

          <button
            id="btn-start"
            disabled={isSorting}
            onClick={startSorting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10B981] hover:bg-emerald-600 font-bold text-xs sm:text-sm text-white transition-colors shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            <span>▶ Start</span>
          </button>

          <button
            id="btn-reset"
            onClick={resetSorting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#EF4444] hover:bg-red-600 font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>⟳ Reset</span>
          </button>
        </div>

        {/* Status & Step Count */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-[#28283C] pt-2 lg:pt-0">
          <div className="text-xs sm:text-sm text-[#A0A0C8] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{status}</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-[#F59E0B] whitespace-nowrap bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
            Steps: {steps}
          </div>
        </div>
      </div>
    </div>
  );
};
