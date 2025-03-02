import { startNoteRange } from './config';
import { Chord } from './notes';
import { Frequency } from 'tone';

function getRandomFromArray<T>(items: ArrayLike<T>): T {
  return items[Math.floor(Math.random() * items.length)];
}

export const getRandomChord = (chordSet: Chord[]) =>
  getRandomFromArray(chordSet);

export const getRandomMidiNote = (range = startNoteRange) => {
  const [start, end] = range.map((note) => Frequency(note).toMidi());
  return Math.floor(Math.random() * (end - start) + start);
};
