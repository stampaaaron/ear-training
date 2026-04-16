import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { alternativeVoicings } from '../model/chord';
import { PlaybackMode } from '../player';

export const defaultSettings = {
  startNoteRange: [48, 72] as [number, number], // C3 - C5
  noteToNoteDelay: 1,
  releaseDelay: 2,
  playBackModes: ['harmonic', 'ascending'] as PlaybackMode[],
  delayBetweenModes: 0.5,
  autoPlayNext: true,
  alternativeVoicings: false,
  voicings: alternativeVoicings,
};

export type Settings = typeof defaultSettings;

export const useSettings = create<Settings>()(
  persist(() => ({ ...defaultSettings }), { name: 'settings' })
);
