import { persistentAtom } from '@nanostores/persistent';
import { ChordSet } from '../model/chord';

export const $currentChordSet = persistentAtom<ChordSet>(
  'currentChordSet',
  {
    key: '',
    label: '',
    description: '',
    chords: [],
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);
