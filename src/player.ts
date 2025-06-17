import * as Tone from 'tone';
import { Interval, intervalDistanceMap } from './model/interval';
import { useStore } from '@nanostores/react';
import { $settings } from './store/settings';
import { QuizOption, QuizMode } from './model/quiz';
import {
  ChordFunction,
  chordFunctionIntervalMap,
  chordFunctionVoicings,
} from './model/cadence';

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
            piano.triggerAttack(note, now + index * noteToNoteDelay, 0.8);
          });
          now = now + notes.length * noteToNoteDelay + releaseDelay;
          piano.releaseAll(now);
          break;
        case 'harmonic':
          piano.triggerAttack(notes, now, 0.8);
          now += releaseDelay;
          piano.releaseAll(now);
          break;
        default:
          break;
      }
      now += delayBetweenModes;
    });
  };

  const playInterval = async (
    interval: Interval,
    startNote = getRandomMidiNote()
  ) => {
    await Tone.start();
    let now = Tone.now();

    const transposedNote = Tone.Frequency(startNote, 'midi')
      .transpose(intervalDistanceMap[interval])
      .toMidi();

    piano.triggerAttackRelease(startNote, releaseDelay, now);
    now += noteToNoteDelay;
    piano.triggerAttackRelease(transposedNote, releaseDelay, now);
  };

  const playCadence = (
    cadence: ChordFunction[],
    startNote = getRandomMidiNote()
  ) => {
    let now = Tone.now();

    cadence.forEach((chordFunction) => {
      const root = Tone.Frequency(startNote, 'midi')
        .transpose(intervalDistanceMap[chordFunctionIntervalMap[chordFunction]])
        .toMidi();

      const notes = chordFunctionVoicings[chordFunction].intervals.map((note) =>
        Tone.Frequency(root, 'midi')
          .transpose(intervalDistanceMap[note])
          .toMidi()
      );

      notes.push(Tone.Frequency(root, 'midi').transpose(-12).toMidi());

      piano.triggerAttack(notes, now, 0.8);
      now += releaseDelay;
      piano.releaseAll(now);
    });
  };

  const getRandomMidiNote = ([start, end] = startNoteRange) => {
    return Math.floor(Math.random() * (end - start) + start);
  };

  const handlePlayOption = <M extends QuizMode>(
    mode: M,
    quizOption: QuizOption<M>,
    startNote?: number
  ) => {
    switch (mode) {
      case QuizMode.chords:
        playChord(
          (quizOption as QuizOption<QuizMode.chords>).intervals,
          startNote
        );
        break;
      case QuizMode.intervals:
        playChord(
          ['1', (quizOption as QuizOption<QuizMode.intervals>).interval],
          startNote
        );
        break;
      default:
        break;
    }
  };

  return {
    playChord,
    playInterval,
    handlePlayOption,
    getRandomMidiNote,
    playCadence,
  };
};
