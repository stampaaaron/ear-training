import { Chord } from './notes';

export const arrayRange = (start: number, stop: number, step: number = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step
  );
function getRandomFromArray<T>(items: ArrayLike<T>): T {
  return items[Math.floor(Math.random() * items.length)];
}

export const getRandomChord = (chordSet: Chord[]) =>
  getRandomFromArray(chordSet);
