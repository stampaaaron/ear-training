import { Chord } from './notes';

function getRandomFromArray<T>(items: ArrayLike<T>): T {
  return items[Math.floor(Math.random() * items.length)];
}

export const getRandomChord = (chordSet: Chord[]) =>
  getRandomFromArray(chordSet);
