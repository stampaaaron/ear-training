export const arrayRange = (start: number, stop: number, step: number = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step
  );

export function getRandomFromArray<T>(items: ArrayLike<T>): T {
  return items[Math.floor(Math.random() * items.length)];
}
