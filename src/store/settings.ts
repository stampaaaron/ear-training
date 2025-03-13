import { Note } from 'tone/build/esm/core/type/Units';
import { PlaybackMode } from '../player';
import { persistentAtom } from '@nanostores/persistent';

export const defaultSettings = {
  startNoteRange: ['C3', 'C5'] as [Note, Note],
  noteToNoteDelay: 1,
  releaseDelay: 2,
  playBackModes: ['harmonic', 'ascending'] as PlaybackMode[],
  delayBetweenModes: 0.5,
};

export const $settings = persistentAtom<typeof defaultSettings>(
  'settings',
  defaultSettings,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);
