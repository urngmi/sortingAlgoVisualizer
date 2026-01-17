'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  bubbleSort, 
  quickSort, 
  mergeSort, 
  insertionSort, 
  selectionSort,
  heapSort,
  shellSort,
  cocktailSort,
  gnomeSort,
  combSort,
  radixSort,
  bitonicSort,
  timSort
} from '@/lib/sortingAlgorithms';
import { playNote, stopAllSounds } from '@/lib/soundGenerator';

type SortingAlgorithm = {
  name: string;
  function: (arr: number[], callbacks: SortCallbacks) => Promise<void>;
};

type SortCallbacks = {
  onSwap: (i: number, j: number) => void;
  onCompare: (i: number, j: number) => void;
  onAccess: (i: number) => void;
  onMark: (i: number, color: number) => void;
  onUnmarkAll: () => void;
  shouldStop: () => boolean;
};

const algorithms: SortingAlgorithm[] = [
  { name: 'Selection Sort', function: selectionSort },
  { name: 'Insertion Sort', function: insertionSort },
  { name: 'Merge Sort', function: mergeSort },
  { name: 'Quick Sort', function: quickSort },
  { name: 'Heap Sort', function: heapSort },
  { name: 'Bubble Sort', function: bubbleSort },
  { name: 'Cocktail Shaker Sort', function: cocktailSort },
  { name: 'Gnome Sort', function: gnomeSort },
  { name: 'Comb Sort', function: combSort },
  { name: 'Shell Sort', function: shellSort },
  { name: 'Radix Sort (LSD)', function: radixSort },
  { name: 'Bitonic Sort', function: bitonicSort },
  { name: 'Tim Sort', function: timSort },
];

// Color palette matching the original C++ application
const COLORS = [
  '#FFFFFF', // 0 white - normal
  '#FF0000', // 1 red - marked/compared
  '#00FF00', // 2 green - pivot/special
  '#00FFFF', // 3 cyan - working area
  '#FFFF00', // 4 yellow
  '#FF00FF', // 5 magenta
  '#FFC080', // 6 orange
  '#FF80C0', // 7 pink
  '#80C0FF', // 8 darker cyan
  '#C0FF80', // 9 darker green
  '#C080FF', // 10 purple
  '#80FFC0', // 11 light green
  '#8080FF', // 12 blue
  '#C080C0', // 13 dark purple
  '#80C0C0', // 14 dark cyan
  '#C0C080', // 15 dark yellow
  '#0080FF', // 16 blue/cyan mix
];

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState(100);
  const [speed, setSpeed] = useState(1000); // 0-2000 scale matching original
  const [isSorting, setIsSorting] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundSustain, setSoundSustain] = useState(700);
  const [comparisons, setComparisons] = useState(0);
  const [arrayAccesses, setArrayAccesses] = useState(0);
  const [colorMap, setColorMap] = useState<Map<number, number>>(new Map());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stopSortingRef = useRef(false);

  // Generate random array
  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setComparisons(0);
    setArrayAccesses(0);
    setColorMap(new Map());
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Draw array on canvas - matching original C++ rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const size = array.length;

    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    if (size === 0) return;

    const drawWidth = width - 20;
    const drawHeight = height - 20;
    
    // Calculate bar width: one pixel between bars
    const wbar = (drawWidth - (size - 1)) / size;
    const bstep = wbar + 1.0;

    const maxValue = Math.max(...array, 1);

    ctx.save();
    ctx.translate(10, 10);

    array.forEach((value, i) => {
      const colorIndex = colorMap.get(i) || 0;
      const color = COLORS[colorIndex];
      
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      const barHeight = (value / maxValue) * drawHeight;
      const x = i * bstep;
      const y = drawHeight - barHeight;
      const barDrawWidth = Math.max(1, Math.floor((i + 1) * bstep) - Math.floor(i * bstep) - (bstep - wbar));

      ctx.fillRect(x, y, barDrawWidth, barHeight);
    });

    ctx.restore();
  }, [array, colorMap]);

  const handleSort = async () => {
    if (isSorting) return;
    
    setIsSorting(true);
    stopSortingRef.current = false;
    setComparisons(0);
    setArrayAccesses(0);

    const arrayCopy = [...array];
    let comparisonCount = 0;
    let accessCount = 0;

    const callbacks: SortCallbacks = {
      onSwap: (i: number, j: number) => {
        [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
        setArray([...arrayCopy]);
        setColorMap(new Map([[i, 1], [j, 1]]));
        accessCount += 2;
        setArrayAccesses(accessCount);
        if (soundEnabled) {
          playNote(arrayCopy[i], soundSustain);
          playNote(arrayCopy[j], soundSustain);
        }
      },
      onCompare: (i: number, j: number) => {
        comparisonCount++;
        setComparisons(comparisonCount);
        setColorMap(new Map([[i, 1], [j, 1]]));
        accessCount += 2;
        setArrayAccesses(accessCount);
        if (soundEnabled) {
          playNote(arrayCopy[i], soundSustain);
          playNote(arrayCopy[j], soundSustain);
        }
      },
      onAccess: (i: number) => {
        setColorMap(new Map([[i, 1]]));
        accessCount++;
        setArrayAccesses(accessCount);
        if (soundEnabled) {
          playNote(arrayCopy[i], soundSustain);
        }
      },
      onMark: (i: number, color: number) => {
        setColorMap(prev => {
          const newMap = new Map(prev);
          newMap.set(i, color);
          return newMap;
        });
      },
      onUnmarkAll: () => {
        setColorMap(new Map());
      },
      shouldStop: () => stopSortingRef.current,
    };

    await algorithms[selectedAlgorithm].function(arrayCopy, callbacks);
    
    setColorMap(new Map());
    setIsSorting(false);
  };

  const handleStop = () => {
    stopSortingRef.current = true;
    setIsSorting(false);
    stopAllSounds();
  };

  const handleReset = () => {
    handleStop();
    generateArray();
  };

  // Calculate actual delay from speed slider (inverse relationship)
  const getDelay = () => {
    // Map 0-2000 slider to reasonable delays
    // 2000 = very slow (100ms), 0 = very fast (0.1ms)
    return Math.max(0.1, (2000 - speed) / 20);
  };

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Main visualization area */}
      <div className="flex-1 flex flex-col p-2">
        <div className="flex-1 bg-black rounded overflow-hidden shadow-lg">
          <canvas
            ref={canvasRef}
            width={1400}
            height={700}
            className="w-full h-full"
          />
        </div>

        {/* Stats bar */}
        <div className="mt-2 bg-white px-4 py-2 rounded shadow flex gap-6 text-sm font-mono">
          <div>
            <span className="text-gray-600">Comparisons:</span>{' '}
            <span className="font-bold text-blue-600">{comparisons}</span>
          </div>
          <div>
            <span className="text-gray-600">Array Accesses:</span>{' '}
            <span className="font-bold text-green-600">{arrayAccesses}</span>
          </div>
          <div>
            <span className="text-gray-600">Algorithm:</span>{' '}
            <span className="font-bold text-purple-600">{algorithms[selectedAlgorithm].name}</span>
          </div>
        </div>
      </div>

      {/* Right sidebar - matching original layout */}
      <div className="w-72 bg-gray-100 border-l border-gray-300 flex flex-col">
        {/* Title */}
        <div className="bg-gray-800 text-white px-4 py-3 text-center font-bold">
          The Sound of Sorting
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Control buttons */}
          <div className="space-y-2">
            <button
              onClick={isSorting ? handleStop : handleSort}
              className={`w-full px-4 py-2 rounded font-semibold shadow ${
                isSorting
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isSorting ? '⏸ Stop' : '▶ Run'}
            </button>

            <button
              onClick={handleReset}
              disabled={isSorting}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Reset
            </button>

            <button
              onClick={generateArray}
              disabled={isSorting}
              className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🎲 Randomize
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-full px-4 py-2 rounded font-semibold shadow ${
                soundEnabled
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-gray-400 hover:bg-gray-500 text-gray-700'
              }`}
            >
              {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
            </button>
          </div>

          {/* Array Size Slider */}
          <div className="bg-white p-3 rounded shadow">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Array Size: <span className="text-blue-600">{arraySize}</span>
            </label>
            <input
              type="range"
              min="10"
              max="500"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              disabled={isSorting}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Speed Slider */}
          <div className="bg-white p-3 rounded shadow">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Speed: <span className="text-green-600">{speed}</span>
            </label>
            <input
              type="range"
              min="0"
              max="2000"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              disabled={isSorting}
              className="w-full accent-green-500"
            />
            <div className="text-xs text-gray-500 mt-1">0 = fastest, 2000 = slowest</div>
          </div>

          {/* Sound Sustain Slider */}
          {soundEnabled && (
            <div className="bg-white p-3 rounded shadow">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Sound Sustain: <span className="text-purple-600">{soundSustain}ms</span>
              </label>
              <input
                type="range"
                min="0"
                max="2000"
                value={soundSustain}
                onChange={(e) => setSoundSustain(parseInt(e.target.value))}
                disabled={isSorting}
                className="w-full accent-purple-500"
              />
            </div>
          )}

          {/* Algorithm List */}
          <div className="bg-white rounded shadow">
            <div className="bg-gray-700 text-white px-3 py-2 text-sm font-semibold rounded-t">
              Sorting Algorithms
            </div>
            <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-b">
              {algorithms.map((algo, index) => (
                <div
                  key={index}
                  onClick={() => !isSorting && setSelectedAlgorithm(index)}
                  className={`px-3 py-2 text-sm cursor-pointer border-b border-gray-200 last:border-b-0 ${
                    selectedAlgorithm === index
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'hover:bg-gray-100 text-gray-800'
                  } ${isSorting ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {algo.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-gray-400 text-xs px-4 py-2 text-center">
          TypeScript port of Sound of Sorting
        </div>
      </div>
    </div>
  );
}
