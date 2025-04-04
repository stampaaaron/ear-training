import * as Tone from 'tone';
import { Interval, intervalDistanceMap } from './model/interval';
import { useStore } from '@nanostores/react';
import { $settings } from './store/settings';

export const piano = new Tone.Sampler({
  urls: {
    A3: 'A3.wav',
    A4: 'A4.wav',
    A5: 'A5.wav',
  },
  baseUrl: './',
}).toDestination();

export enum PlaybackMode {
  ascending = 'ascending',
  descending = 'descending',
  harmonic = 'harmonic',
}

export const playbackModeTranslationMap: Record<PlaybackMode, string> = {
  ascending: 'Ascending',
  descending: 'Descending',
  harmonic: 'Harmonic',
};

export const usePlayer = () => {
  const {
    noteToNoteDelay,
    releaseDelay,
    delayBetweenModes,
    startNoteRange,
    playBackModes,
  } = useStore($settings);

  const playChord = async (
    chord: Interval[],
    startNote = getRandomMidiNote(),
    modes: PlaybackMode[] = playBackModes
  ) => {
    await Tone.start();
    let now = Tone.now();

    let notes = chord.map((note) =>
      Tone.Frequency(startNote, 'midi')
        .transpose(intervalDistanceMap[note])
        .toNote()
    );

    modes.forEach((mode) => {
      // TODO lautstärke

      switch (mode) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        case 'descending':
          notes = notes.reverse();
        // falls through
        case 'ascending':
          notes.forEach((note, index) => {
            piano.triggerAttack(note, now + index * noteToNoteDelay, 1);
          });
          now = now + notes.length * noteToNoteDelay + releaseDelay;
          piano.releaseAll(now);
          break;
        case 'harmonic':
          piano.triggerAttack(notes, now);
          now += releaseDelay;
          piano.releaseAll(now);
          break;
        default:
          break;
      }
      now += delayBetweenModes;
    });
  };

  const getRandomMidiNote = ([start, end] = startNoteRange) => {
    return Math.floor(Math.random() * (end - start) + start);
  };

  return { playChord, getRandomMidiNote };
};
