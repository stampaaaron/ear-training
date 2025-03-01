import { Note } from 'tone/build/esm/core/type/Units';
import {
  availableAccidentals,
  availableLetters,
  availableOctaves,
} from './config';
import { Chord } from './notes';

function getRandomFromArray<T>(items: ArrayLike<T>): T {
  return items[Math.floor(Math.random() * items.length)];
}

export const getRandomNote = (): Note =>
  `${getRandomFromArray(availableLetters)}${getRandomFromArray(availableAccidentals)}${getRandomFromArray(availableOctaves)}`;

export const getRandomChord = (chordSet: Chord[]) =>
  getRandomFromArray(chordSet);
