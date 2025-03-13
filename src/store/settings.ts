import { PlaybackMode } from '../player';
import { persistentAtom } from '@nanostores/persistent';

export const defaultSettings = {
  startNoteRange: [48, 72] as [number, number], // C3 - C5
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
