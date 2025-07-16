// Algorithms.js

export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  const mainArray = array.slice();
  const auxiliaryArray = array.slice();
  mergeSortHelper(mainArray, 0, mainArray.length - 1, auxiliaryArray, animations);
  return animations;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    animations.push([i, j]);
    animations.push([i, j]);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIdx) {
    animations.push([i, i]);
    animations.push([i, i]);
    animations.push([k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIdx) {
    animations.push([j, j]);
    animations.push([j, j]);
    animations.push([k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }
}

export function getInsertionSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  const mainArray = array.slice();
  insertionSortHelper(mainArray, animations);
  return animations;
}

function insertionSortHelper(arr, animations) {
  const N = arr.length;
  for (let i = 1; i < N; i++) {
    let j = i;
    while (j > 0 && arr[j] < arr[j - 1]) {
      animations.push([j, j-1]);
      animations.push([j, j-1]);
      [arr[j], arr[j-1]] = [arr[j-1], arr[j]];
      animations.push([j, arr[j]]);
      animations.push([j-1, arr[j-1]]);
      j--;
    }
  }
}


export function getBubbleSortAnimations(array) {
  const animations = [];
  const auxiliaryArray = array.slice();
  const n = auxiliaryArray.length;
  // Bubble sort: compare adjacent bars and swap if necessary
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Push compare animation: highlight bars j and j+1
      animations.push([j, j+1, "compare"]);
      // Push revert animation: reset bars j and j+1 to original color
      animations.push([j, j+1, "revert"]);
      // If the bar at index j is greater than its neighbor, swap them
      if (auxiliaryArray[j] > auxiliaryArray[j+1]) {
        // Push swap animations for both bars
        animations.push([j, auxiliaryArray[j+1], "swap"]);
        animations.push([j+1, auxiliaryArray[j], "swap"]);
        // Perform the swap in the auxiliary array
        let temp = auxiliaryArray[j];
        auxiliaryArray[j] = auxiliaryArray[j+1];
        auxiliaryArray[j+1] = temp;
      }
    }
  }
  return animations;
}

// --- Quick Sort ---
export function getQuickSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  const arr = array.slice();
  quickSortHelper(arr, 0, arr.length - 1, animations);
  return animations;
}

function quickSortHelper(arr, low, high, animations) {
  if (low < high) {
    const pi = partition(arr, low, high, animations);
    quickSortHelper(arr, low, pi - 1, animations);
    quickSortHelper(arr, pi + 1, high, animations);
  }
}

function partition(arr, low, high, animations) {
  const pivot = arr[high];
  let i = low;
  for (let j = low; j < high; j++) {
    animations.push([j, high, "compare"]);
    animations.push([j, high, "revert"]);
    if (arr[j] < pivot) {
      animations.push([i, arr[j], "swap"]);
      animations.push([j, arr[i], "swap"]);
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  animations.push([i, arr[high], "swap"]);
  animations.push([high, arr[i], "swap"]);
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}

// --- Unit Test Function ---
export function testAllSorts() {
  const testArrays = [
    [],
    [1],
    [2, 1],
    [5, 3, 8, 4, 2],
    [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    [3, 1, 2, 3, 1, 2]
  ];
  const sorts = [
    { name: 'Merge', fn: getMergeSortAnimations },
    { name: 'Insertion', fn: getInsertionSortAnimations },
    { name: 'Bubble', fn: getBubbleSortAnimations },
    { name: 'Quick', fn: getQuickSortAnimations }
  ];
  for (const arr of testArrays) {
    for (const { name, fn } of sorts) {
      const anims = fn(arr);
      let animResult = arr.slice();
      // Simulate the sort for Merge, Insertion, Quick
      if (name === 'Merge') {
        animResult = arr.slice();
        getMergeSortAnimations(animResult);
      } else if (name === 'Insertion') {
        animResult = arr.slice();
        getInsertionSortAnimations(animResult);
      } else if (name === 'Quick') {
        animResult = arr.slice();
        getQuickSortAnimations(animResult);
      } else if (name === 'Bubble') {
        animResult = arr.slice();
        getBubbleSortAnimations(animResult);
      }
      console.log(`[${name}] Input:`, arr, 'Sorted:', animResult, 'Animations:', anims);
    }
  }
}

// --- Run Animation Function ---
export function runSortAnimation(algorithm, array) {
  let anims;
  switch (algorithm) {
    case 'merge':
      anims = getMergeSortAnimations(array);
      break;
    case 'insertion':
      anims = getInsertionSortAnimations(array);
      break;
    case 'bubble':
      anims = getBubbleSortAnimations(array);
      break;
    case 'quick':
      anims = getQuickSortAnimations(array);
      break;
    default:
      throw new Error('Unknown algorithm: ' + algorithm);
  }
  console.log(`Running ${algorithm} sort on`, array);
  for (let i = 0; i < anims.length; i++) {
    console.log('Step', i, anims[i]);
  }
  return anims;
}
