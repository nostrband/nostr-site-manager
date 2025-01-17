// https://stackoverflow.com/a/12646864
export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function countItems<T>(array: T[]): Map<T, number> {
  const count = new Map<T, number>();
  array.forEach(function (i) {
    count.set(i, (count.get(i) || 0) + 1);
  });
  return count;
}
