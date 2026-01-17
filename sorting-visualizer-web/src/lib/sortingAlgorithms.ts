export type ArrayBar = {
  value: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';
};

export type SortStep = {
  array: ArrayBar[];
  comparisons: number;
  swaps: number;
};

export type SortAlgorithm = (
  arr: number[],
  onStep: (step: SortStep) => void
) => void;

// Helper function to create animation steps
export function createStep(
  arr: number[],
  states: { [index: number]: ArrayBar['state'] },
  comparisons: number,
  swaps: number
): SortStep {
  return {
    array: arr.map((value, idx) => ({
      value,
      state: states[idx] || 'default',
    })),
    comparisons,
    swaps,
  };
}

// Bubble Sort
export function bubbleSort(arr: number[], onStep: (step: SortStep) => void) {
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      onStep(createStep(array, { [j]: 'comparing', [j + 1]: 'comparing' }, comparisons, swaps));

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;
        onStep(createStep(array, { [j]: 'swapping', [j + 1]: 'swapping' }, comparisons, swaps));
      }
    }
    onStep(createStep(array, { [n - i - 1]: 'sorted' }, comparisons, swaps));
  }

  // Mark all as sorted
  const sortedStates: { [index: number]: ArrayBar['state'] } = {};
  for (let i = 0; i < n; i++) sortedStates[i] = 'sorted';
  onStep(createStep(array, sortedStates, comparisons, swaps));
}

// Quick Sort
export function quickSort(arr: number[], onStep: (step: SortStep) => void) {
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;

  function partition(low: number, high: number): number {
    const pivot = array[high];
    let i = low - 1;

    onStep(createStep(array, { [high]: 'pivot' }, comparisons, swaps));

    for (let j = low; j < high; j++) {
      comparisons++;
      onStep(createStep(array, { [high]: 'pivot', [j]: 'comparing' }, comparisons, swaps));

      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        swaps++;
        onStep(createStep(array, { [high]: 'pivot', [i]: 'swapping', [j]: 'swapping' }, comparisons, swaps));
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    swaps++;
    onStep(createStep(array, { [i + 1]: 'swapping', [high]: 'swapping' }, comparisons, swaps));

    return i + 1;
  }

  function quickSortRecursive(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortRecursive(low, pi - 1);
      quickSortRecursive(pi + 1, high);
    }
  }

  quickSortRecursive(0, array.length - 1);

  const sortedStates: { [index: number]: ArrayBar['state'] } = {};
  for (let i = 0; i < array.length; i++) sortedStates[i] = 'sorted';
  onStep(createStep(array, sortedStates, comparisons, swaps));
}

// Merge Sort
export function mergeSort(arr: number[], onStep: (step: SortStep) => void) {
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;

  function merge(left: number, mid: number, right: number) {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      const states: { [index: number]: ArrayBar['state'] } = {};
      states[left + i] = 'comparing';
      states[mid + 1 + j] = 'comparing';
      onStep(createStep(array, states, comparisons, swaps));

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }
      swaps++;
      onStep(createStep(array, { [k]: 'swapping' }, comparisons, swaps));
      k++;
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i];
      swaps++;
      onStep(createStep(array, { [k]: 'swapping' }, comparisons, swaps));
      i++;
      k++;
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j];
      swaps++;
      onStep(createStep(array, { [k]: 'swapping' }, comparisons, swaps));
      j++;
      k++;
    }
  }

  function mergeSortRecursive(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSortRecursive(left, mid);
      mergeSortRecursive(mid + 1, right);
      merge(left, mid, right);
    }
  }

  mergeSortRecursive(0, array.length - 1);

  const sortedStates: { [index: number]: ArrayBar['state'] } = {};
  for (let i = 0; i < array.length; i++) sortedStates[i] = 'sorted';
  onStep(createStep(array, sortedStates, comparisons, swaps));
}

// Insertion Sort
export function insertionSort(arr: number[], onStep: (step: SortStep) => void) {
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    onStep(createStep(array, { [i]: 'comparing' }, comparisons, swaps));

    while (j >= 0 && array[j] > key) {
      comparisons++;
      onStep(createStep(array, { [j]: 'comparing', [j + 1]: 'swapping' }, comparisons, swaps));

      array[j + 1] = array[j];
      swaps++;
      j--;
    }

    if (j >= 0) comparisons++;
    array[j + 1] = key;
    onStep(createStep(array, { [j + 1]: 'swapping' }, comparisons, swaps));
  }

  const sortedStates: { [index: number]: ArrayBar['state'] } = {};
  for (let i = 0; i < array.length; i++) sortedStates[i] = 'sorted';
  onStep(createStep(array, sortedStates, comparisons, swaps));
}

// Selection Sort
export function selectionSort(arr: number[], onStep: (step: SortStep) => void) {
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < array.length - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < array.length; j++) {
      comparisons++;
      onStep(createStep(array, { [minIdx]: 'comparing', [j]: 'comparing' }, comparisons, swaps));

      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      swaps++;
      onStep(createStep(array, { [i]: 'swapping', [minIdx]: 'swapping' }, comparisons, swaps));
    }

    onStep(createStep(array, { [i]: 'sorted' }, comparisons, swaps));
  }

  const sortedStates: { [index: number]: ArrayBar['state'] } = {};
  for (let i = 0; i < array.length; i++) sortedStates[i] = 'sorted';
  onStep(createStep(array, sortedStates, comparisons, swaps));
}

// Heap Sort
export function heapSort(arr: number[], onStep: (step: SortStep) => void) {
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const n = array.length;

  function heapify(n: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      comparisons++;
      onStep(createStep(array, { [left]: 'comparing', [largest]: 'comparing' }, comparisons, swaps));
      if (array[left] > array[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      comparisons++;
      onStep(createStep(array, { [right]: 'comparing', [largest]: 'comparing' }, comparisons, swaps));
      if (array[right] > array[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      swaps++;
      onStep(createStep(array, { [i]: 'swapping', [largest]: 'swapping' }, comparisons, swaps));
      heapify(n, largest);
    }
  }

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    swaps++;
    onStep(createStep(array, { [0]: 'swapping', [i]: 'swapping' }, comparisons, swaps));
    heapify(i, 0);
    onStep(createStep(array, { [i]: 'sorted' }, comparisons, swaps));
  }

  const sortedStates: { [index: number]: ArrayBar['state'] } = {};
  for (let i = 0; i < array.length; i++) sortedStates[i] = 'sorted';
  onStep(createStep(array, sortedStates, comparisons, swaps));
}

// Cocktail Shaker Sort
export function cocktailShakerSort(arr: number[], onStep: (step: SortStep) => void) {
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;
  let swapped = true;
  let start = 0;
  let end = array.length - 1;

  while (swapped) {
    swapped = false;

    // Forward pass
    for (let i = start; i < end; i++) {
      comparisons++;
      onStep(createStep(array, { [i]: 'comparing', [i + 1]: 'comparing' }, comparisons, swaps));

      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swaps++;
        swapped = true;
        onStep(createStep(array, { [i]: 'swapping', [i + 1]: 'swapping' }, comparisons, swaps));
      }
    }

    if (!swapped) break;

    onStep(createStep(array, { [end]: 'sorted' }, comparisons, swaps));
    end--;
    swapped = false;

    // Backward pass
    for (let i = end; i > start; i--) {
      comparisons++;
      onStep(createStep(array, { [i]: 'comparing', [i - 1]: 'comparing' }, comparisons, swaps));

      if (array[i] < array[i - 1]) {
        [array[i], array[i - 1]] = [array[i - 1], array[i]];
        swaps++;
        swapped = true;
        onStep(createStep(array, { [i]: 'swapping', [i - 1]: 'swapping' }, comparisons, swaps));
      }
    }

    onStep(createStep(array, { [start]: 'sorted' }, comparisons, swaps));
    start++;
  }

  const sortedStates: { [index: number]: ArrayBar['state'] } = {};
  for (let i = 0; i < array.length; i++) sortedStates[i] = 'sorted';
  onStep(createStep(array, sortedStates, comparisons, swaps));
}

export const algorithms = {
  'Bubble Sort': bubbleSort,
  'Quick Sort': quickSort,
  'Merge Sort': mergeSort,
  'Insertion Sort': insertionSort,
  'Selection Sort': selectionSort,
  'Heap Sort': heapSort,
  'Cocktail Shaker Sort': cocktailShakerSort,
};

export type AlgorithmName = keyof typeof algorithms;
