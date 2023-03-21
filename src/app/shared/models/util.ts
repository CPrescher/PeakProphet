export function indexOfSmallest(a) {
  let lowest = 0;
  for (let i = 1; i < a.length; i++) {
    if (a[i] < a[lowest]) lowest = i;
  }
  return lowest;
}

export function average(a) {
  const sum = a.reduce((a, b) => a + b, 0);
  return (sum / a.length) || 0
}


export function averageAroundIndex(a, index, window) {
  let leftIndex = ((index < window) ? 0 : index - window);
  return average(a.slice(leftIndex, index + window + 1))
}
