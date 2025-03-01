import { Note } from 'tone/build/esm/core/type/Units';
import {
  availableAccidentals,
  availableLetters,
  availableOctaves,
} from './config';

function getRandomFromArray<T>(items: Array<T>): T {
  return items[Math.floor(Math.random() * items.length)];
}

export const getRandomNote = (): Note =>
  `${getRandomFromArray(availableLetters)}${getRandomFromArray(availableAccidentals)}${getRandomFromArray(availableOctaves)}`;
