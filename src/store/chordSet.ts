import { persistentAtom } from '@nanostores/persistent';
import { ChordSet } from '../notes';

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
