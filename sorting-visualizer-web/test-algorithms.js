// Quick test script to verify sorting algorithms work correctly
// Run with: node test-algorithms.js

function testSort(name, sortFunc) {
  const testArrays = [
    [5, 2, 8, 1, 9],
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1],
    [3, 3, 3, 3, 3],
    [1],
    []
  ];

  console.log(`Testing ${name}...`);
  
  for (const arr of testArrays) {
    const original = [...arr];
    const result = sortFunc([...arr]);
    const expected = [...arr].sort((a, b) => a - b);
    
    const passed = JSON.stringify(result) === JSON.stringify(expected);
    if (!passed) {
      console.error(`  ❌ FAILED for [${original}]`);
      console.error(`     Expected: [${expected}]`);
      console.error(`     Got:      [${result}]`);
      return false;
    }
  }
  
  console.log(`  ✓ PASSED`);
  return true;
}

// Synchronous versions for testing
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}

function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      j--;
    }
  }
  return arr;
}

function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

function cocktailSort(arr) {
  let start = 0;
  let end = arr.length - 1;
  let swapped = true;
  
  while (swapped) {
    swapped = false;
    for (let i = start; i < end; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    if (!swapped) break;
    swapped = false;
    end--;
    for (let i = end - 1; i >= start; i--) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    start++;
  }
  return arr;
}

function quickSort(arr) {
  function partition(lo, hi) {
    const pivotValue = arr[hi];
    let i = lo;
    let j = hi - 1;
    
    while (i <= j) {
      while (i <= j && arr[i] < pivotValue) i++;
      while (i <= j && arr[j] > pivotValue) j--;
      if (i <= j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
        j--;
      }
    }
    [arr[i], arr[hi]] = [arr[hi], arr[i]];
    return i;
  }
  
  function sort(lo, hi) {
    if (lo < hi) {
      const p = partition(lo, hi);
      sort(lo, p - 1);
      sort(p + 1, hi);
    }
  }
  
  if (arr.length > 0) {
    sort(0, arr.length - 1);
  }
  return arr;
}

function mergeSort(arr) {
  function merge(l, m, r) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      k++;
    }
    
    while (i < left.length) {
      arr[k] = left[i];
      i++;
      k++;
    }
    
    while (j < right.length) {
      arr[k] = right[j];
      j++;
      k++;
    }
  }
  
  function sort(l, r) {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      sort(l, m);
      sort(m + 1, r);
      merge(l, m, r);
    }
  }
  
  if (arr.length > 0) {
    sort(0, arr.length - 1);
  }
  return arr;
}

function heapSort(arr) {
  function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(n, largest);
    }
  }
  
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }
  
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(i, 0);
  }
  
  return arr;
}

function shellSort(arr) {
  const n = arr.length;
  let gap = Math.floor(n / 2);
  
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      let j = i;
      while (j >= gap && arr[j - gap] > arr[j]) {
        [arr[j - gap], arr[j]] = [arr[j], arr[j - gap]];
        j -= gap;
      }
    }
    gap = Math.floor(gap / 2);
  }
  
  return arr;
}

// Run all tests
console.log('Running sorting algorithm tests...\n');

const algorithms = [
  ['Selection Sort', selectionSort],
  ['Insertion Sort', insertionSort],
  ['Bubble Sort', bubbleSort],
  ['Cocktail Shaker Sort', cocktailSort],
  ['Quick Sort', quickSort],
  ['Merge Sort', mergeSort],
  ['Heap Sort', heapSort],
  ['Shell Sort', shellSort]
];

let allPassed = true;
for (const [name, func] of algorithms) {
  if (!testSort(name, func)) {
    allPassed = false;
  }
}

console.log('\n' + (allPassed ? '✅ All tests passed!' : '❌ Some tests failed!'));
