// Algorithms.js

export function getMergeSortAnimations(array){
  const animations = [];
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
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
  let i = startIdx; // Initial index of first sub-array
  let j = middleIdx + 1; // Initial index of second sub-array
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
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice(); // Copy array
  insertionSortHelper(array, auxiliaryArray, animations);
  return animations;
}

function insertionSortHelper(mainArray, auxiliaryArray, animations) {
  const N = auxiliaryArray.length;
  for (let i = 1; i < N; i++) {
    let j = i;
    while (j > 0 && auxiliaryArray[j] < auxiliaryArray[j - 1]) {
      animations.push([j, j-1]);
      animations.push([j, j-1]);
      [auxiliaryArray[j], auxiliaryArray[j-1]] = [auxiliaryArray[j-1], auxiliaryArray[j]]; // Swap
      animations.push([j, auxiliaryArray[j]]);
      animations.push([j-1, auxiliaryArray[j-1]]);
      mainArray[j] = auxiliaryArray[j];
      mainArray[j-1] = auxiliaryArray[j-1];
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
