'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

// Color palette for visualization
const COLORS = {
  white: '#FFFFFF',    // 0 - normal
  red: '#FF0000',      // 1 - comparing/marked
  green: '#00FF00',    // 2 - pivot/special
  cyan: '#00FFFF',     // 3 - working area
  yellow: '#FFFF00',   // 4
  magenta: '#FF00FF',  // 5
};

type Algorithm = {
  name: string;
  func: (arr: number[], callbacks: SortCallbacks) => Promise<void>;
};

type SortCallbacks = {
  compare: (i: number, j: number) => Promise<void>;
  swap: (i: number, j: number) => Promise<void>;
  set: (i: number, value: number) => void;
  mark: (indices: number[], color: number) => void;
  unmark: () => void;
  delay: () => Promise<void>;
  checkStop: () => boolean;
};

const algorithms: Algorithm[] = [
  { name: 'Selection Sort', func: selectionSort },
  { name: 'Insertion Sort', func: insertionSort },
  { name: 'Merge Sort', func: mergeSort },
  { name: 'Quick Sort (LR ptrs)', func: quickSortLR },
  { name: 'Bubble Sort', func: bubbleSort },
  { name: 'Cocktail Shaker Sort', func: cocktailSort },
  { name: 'Heap Sort', func: heapSort },
  { name: 'Shell Sort', func: shellSort },
];

// Selection Sort
async function selectionSort(arr: number[], cb: SortCallbacks) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    if (cb.checkStop()) return;
    let minIdx = i;
    cb.mark([i], 2);
    
    for (let j = i + 1; j < n; j++) {
      if (cb.checkStop()) return;
      await cb.compare(minIdx, j);
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        cb.mark([minIdx], 2);
      }
    }
    
    if (minIdx !== i) {
      await cb.swap(i, minIdx);
    }
    cb.unmark();
  }
}

// Insertion Sort
async function insertionSort(arr: number[], cb: SortCallbacks) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    if (cb.checkStop()) return;
    let j = i;
    
    cb.mark([i], 2);
    
    while (j > 0) {
      if (cb.checkStop()) return;
      await cb.compare(j - 1, j);
      if (arr[j - 1] <= arr[j]) break;
      await cb.swap(j - 1, j);
      j--;
    }
    cb.unmark();
  }
}

// Bubble Sort
async function bubbleSort(arr: number[], cb: SortCallbacks) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    if (cb.checkStop()) return;
    for (let j = 0; j < n - i - 1; j++) {
      if (cb.checkStop()) return;
      await cb.compare(j, j + 1);
      if (arr[j] > arr[j + 1]) {
        await cb.swap(j, j + 1);
      }
    }
  }
}

// Cocktail Shaker Sort
async function cocktailSort(arr: number[], cb: SortCallbacks) {
  let start = 0;
  let end = arr.length - 1;
  let swapped = true;
  
  while (swapped) {
    if (cb.checkStop()) return;
    swapped = false;
    
    for (let i = start; i < end; i++) {
      if (cb.checkStop()) return;
      await cb.compare(i, i + 1);
      if (arr[i] > arr[i + 1]) {
        await cb.swap(i, i + 1);
        swapped = true;
      }
    }
    
    if (!swapped) break;
    swapped = false;
    end--;
    
    for (let i = end - 1; i >= start; i--) {
      if (cb.checkStop()) return;
      await cb.compare(i, i + 1);
      if (arr[i] > arr[i + 1]) {
        await cb.swap(i, i + 1);
        swapped = true;
      }
    }
    start++;
  }
}

// Quick Sort (LR pointers)
async function quickSortLR(arr: number[], cb: SortCallbacks) {
  async function partition(lo: number, hi: number): Promise<number> {
    const pivotValue = arr[hi];
    cb.mark([hi], 2);
    let i = lo;
    let j = hi - 1;
    
    while (i <= j) {
      if (cb.checkStop()) return lo;
      
      while (i <= j && arr[i] < pivotValue) {
        await cb.compare(i, hi);
        i++;
      }
      
      while (i <= j && arr[j] > pivotValue) {
        await cb.compare(j, hi);
        j--;
      }
      
      if (i < j) {
        await cb.swap(i, j);
        i++;
        j--;
      }
    }
    
    await cb.swap(i, hi);
    cb.unmark();
    return i;
  }
  
  async function sort(lo: number, hi: number) {
    if (lo < hi) {
      if (cb.checkStop()) return;
      const p = await partition(lo, hi);
      await sort(lo, p - 1);
      await sort(p + 1, hi);
    }
  }
  
  await sort(0, arr.length - 1);
}

// Merge Sort
async function mergeSort(arr: number[], cb: SortCallbacks) {
  async function merge(l: number, m: number, r: number) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    
    while (i < left.length && j < right.length) {
      if (cb.checkStop()) return;
      cb.mark([k], 3);
      
      if (left[i] <= right[j]) {
        cb.set(k, left[i]);
        i++;
      } else {
        cb.set(k, right[j]);
        j++;
      }
      k++;
      await cb.delay();
    }
    
    while (i < left.length) {
      if (cb.checkStop()) return;
      cb.mark([k], 3);
      cb.set(k, left[i]);
      i++;
      k++;
      await cb.delay();
    }
    
    while (j < right.length) {
      if (cb.checkStop()) return;
      cb.mark([k], 3);
      cb.set(k, right[j]);
      j++;
      k++;
      await cb.delay();
    }
    
    cb.unmark();
  }
  
  async function sort(l: number, r: number) {
    if (l < r) {
      if (cb.checkStop()) return;
      const m = Math.floor((l + r) / 2);
      await sort(l, m);
      await sort(m + 1, r);
      await merge(l, m, r);
    }
  }
  
  await sort(0, arr.length - 1);
}

// Heap Sort
async function heapSort(arr: number[], cb: SortCallbacks) {
  async function heapify(n: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n) {
      await cb.compare(left, largest);
      if (arr[left] > arr[largest]) largest = left;
    }
    
    if (right < n) {
      await cb.compare(right, largest);
      if (arr[right] > arr[largest]) largest = right;
    }
    
    if (largest !== i) {
      await cb.swap(i, largest);
      await heapify(n, largest);
    }
  }
  
  const n = arr.length;
  
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (cb.checkStop()) return;
    await heapify(n, i);
  }
  
  for (let i = n - 1; i > 0; i--) {
    if (cb.checkStop()) return;
    await cb.swap(0, i);
    await heapify(i, 0);
  }
}

// Shell Sort
async function shellSort(arr: number[], cb: SortCallbacks) {
  const n = arr.length;
  let gap = Math.floor(n / 2);
  
  while (gap > 0) {
    if (cb.checkStop()) return;
    
    for (let i = gap; i < n; i++) {
      if (cb.checkStop()) return;
      let j = i;
      
      while (j >= gap) {
        await cb.compare(j - gap, j);
        if (arr[j - gap] <= arr[j]) break;
        await cb.swap(j - gap, j);
        j -= gap;
      }
    }
    gap = Math.floor(gap / 2);
  }
}

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState(100);
  const [speedSlider, setSpeedSlider] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [arrayAccesses, setArrayAccesses] = useState(0);
  const [inputType, setInputType] = useState('RANDOM');
  const [colorMap, setColorMap] = useState<Map<number, number>>(new Map());
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stopRef = useRef(false);
  const arrayRef = useRef<number[]>([]);
  const speedRef = useRef(50);

  useEffect(() => {
    speedRef.current = speedSlider;
  }, [speedSlider]);

  const getDelay = () => {
    return Math.max(1, 101 - speedRef.current);
  };

  const generateArray = useCallback(() => {
    let arr: number[];
    if (inputType === 'SORTED') {
      arr = Array.from({ length: arraySize }, (_, i) => i + 1);
    } else if (inputType === 'REVERSE') {
      arr = Array.from({ length: arraySize }, (_, i) => arraySize - i);
    } else {
      arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 1000));
    }
    setArray(arr);
    arrayRef.current = arr;
    setComparisons(0);
    setArrayAccesses(0);
    setColorMap(new Map());
  }, [arraySize, inputType]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const n = array.length;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    if (n === 0) return;

    const padding = 20;
    const drawWidth = width - padding * 2;
    const drawHeight = height - padding * 2;

    const barWidth = (drawWidth - (n - 1)) / n;
    const barStep = barWidth + 1;

    const maxVal = Math.max(...array, 1);

    ctx.save();
    ctx.translate(padding, padding);

    array.forEach((value, i) => {
      const colorIdx = colorMap.get(i) || 0;
      const colors = [COLORS.white, COLORS.red, COLORS.green, COLORS.cyan, COLORS.yellow, COLORS.magenta];
      ctx.fillStyle = colors[colorIdx];
      ctx.strokeStyle = colors[colorIdx];

      const barHeight = (value / maxVal) * drawHeight;
      const x = i * barStep;
      const y = drawHeight - barHeight;
      const w = Math.max(1, Math.floor((i + 1) * barStep) - Math.floor(i * barStep) - 1);

      ctx.fillRect(x, y, w, barHeight);
    });

    ctx.restore();
  }, [array, colorMap]);

  const runSort = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    stopRef.current = false;
    setComparisons(0);
    setArrayAccesses(0);

    const arr = [...arrayRef.current];
    let compCount = 0;
    let accessCount = 0;

    const callbacks: SortCallbacks = {
      compare: async (i: number, j: number) => {
        compCount++;
        accessCount += 2;
        setComparisons(compCount);
        setArrayAccesses(accessCount);
        setColorMap(new Map([[i, 1], [j, 1]]));
        await new Promise(r => setTimeout(r, getDelay()));
      },
      swap: async (i: number, j: number) => {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        accessCount += 2;
        setArrayAccesses(accessCount);
        setArray([...arr]);
        arrayRef.current = arr;
        setColorMap(new Map([[i, 1], [j, 1]]));
        await new Promise(r => setTimeout(r, getDelay()));
      },
      set: (i: number, value: number) => {
        arr[i] = value;
        accessCount += 1;
        setArrayAccesses(accessCount);
        setArray([...arr]);
        arrayRef.current = arr;
      },
      mark: (indices: number[], color: number) => {
        const map = new Map();
        indices.forEach(idx => map.set(idx, color));
        setColorMap(map);
      },
      unmark: () => {
        setColorMap(new Map());
      },
      delay: async () => {
        await new Promise(r => setTimeout(r, getDelay()));
      },
      checkStop: () => stopRef.current,
    };

    await algorithms[selectedAlgo].func(arr, callbacks);
    
    // Completion animation: color bars green progressively from left to right
    if (!stopRef.current) {
      for (let i = 0; i < arr.length; i++) {
        if (stopRef.current) break;
        const greenMap = new Map();
        for (let j = 0; j <= i; j++) {
          greenMap.set(j, 2);
        }
        setColorMap(greenMap);
        await new Promise(r => setTimeout(r, 3));
      }
      await new Promise(r => setTimeout(r, 300));
    }
    
    setColorMap(new Map());
    setIsRunning(false);
  };

  const stopSort = () => {
    stopRef.current = true;
    setIsRunning(false);
  };

  const resetArray = () => {
    stopRef.current = true;
    setIsRunning(false);
    generateArray();
  };

  return (
    <div className="flex flex-col h-screen bg-black font-mono overflow-hidden">
      {/* Top: Stats Bar */}
      <div className="bg-black text-white px-4 py-2 flex items-center gap-6 text-xs border-b border-gray-700">
        <span className="font-bold uppercase">{algorithms[selectedAlgo].name}</span>
        <span className="uppercase">
          COMPARISONS: <span className="font-semibold">{comparisons}</span>
        </span>
        <span className="uppercase">
          ARRAY ACCESSES: <span className="font-semibold">{arrayAccesses}</span>
        </span>
        <span className="uppercase">
          DELAY: <span className="font-semibold">{getDelay()} MS</span>
        </span>
        <div className="flex-1"></div>
        <a 
          href="https://github.com/urngmi/sortingAlgoVisualizer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="uppercase text-white hover:underline"
        >
          GITHUB: SORTINGALGOVISUALIZER
        </a>
      </div>

      {/* Center: Visualization */}
      <div className="flex-1 flex items-center justify-center bg-black overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1200}
          height={500}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Bottom: Controls */}
      <div className="bg-black border-t border-gray-700 px-4 py-2">
        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={isRunning ? stopSort : runSort}
            className="px-4 py-1.5 border-2 border-white hover:bg-white hover:text-black text-white rounded font-semibold transition-colors uppercase"
          >
            {isRunning ? 'STOP' : 'RUN'}
          </button>

          <button
            onClick={resetArray}
            className="px-4 py-1.5 border-2 border-white hover:bg-white hover:text-black text-white rounded font-semibold transition-colors uppercase"
          >
            RESET
          </button>

          <div className="w-px h-6 bg-gray-700"></div>

          <div className="flex items-center gap-2">
            <label className="text-white whitespace-nowrap uppercase">ALGO:</label>
            <select
              value={selectedAlgo}
              onChange={(e) => !isRunning && setSelectedAlgo(Number(e.target.value))}
              disabled={isRunning}
              className="px-2 py-1.5 text-xs border-2 border-gray-600 rounded bg-black text-white hover:border-white focus:outline-none focus:border-white disabled:opacity-50 uppercase"
            >
              {algorithms.map((algo, idx) => (
                <option key={idx} value={idx}>
                  {algo.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <label className="text-white whitespace-nowrap uppercase">
              SIZE: <span className="font-semibold">{arraySize}</span>
            </label>
            <input
              type="range"
              min="10"
              max="400"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isRunning}
              className="flex-1 min-w-0 accent-white disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <label className="text-white whitespace-nowrap uppercase">
              SPEED: <span className="font-semibold">{speedSlider}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={speedSlider}
              onChange={(e) => setSpeedSlider(Number(e.target.value))}
              className="flex-1 min-w-0 accent-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-white whitespace-nowrap uppercase">INPUT:</label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="px-2 py-1.5 text-xs border-2 border-gray-600 rounded bg-black text-white hover:border-white focus:outline-none focus:border-white uppercase"
            >
              <option>RANDOM</option>
              <option>SORTED</option>
              <option>REVERSE</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
