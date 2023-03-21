/**
 * Returns the index of the smallest value in an array
 * @param a - Array of numbers
 */
export function indexOfSmallest(a) {
  let lowest = 0;
  for (let i = 1; i < a.length; i++) {
    if (a[i] < a[lowest]) lowest = i;
  }
  return lowest;
}

/**
 * Returns the average of an array of numbers
 * @param a - Array of numbers
 */
export function average(a) {
  const sum = a.reduce((a, b) => a + b, 0);
  return (sum / a.length) || 0
}


/**
 * Returns the average of an array of numbers around a given index. At the edges of the array, the
 * window is truncated to fit within the array.
 *
 * @param a - Array of numbers
 * @param index - Index of the value to average around
 * @param window - Number of values to average around the index
 */
export function averageAroundIndex(a, index, window) {
  let leftIndex = ((index < window) ? 0 : index - window);
  return average(a.slice(leftIndex, index + window + 1))
}
