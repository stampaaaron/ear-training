import * as Tone from 'tone';
import { Interval, intervalDistanceMap } from './model/interval';
import { Settings } from './store/settings';
import { QuizOption, QuizMode } from './model/quiz';
import {
  ChordFunction,
  chordFunctionIntervalMap,
  chordFunctionVoicings,
} from './model/cadence';
import { useAudio } from './pages/AudioProvider';
import { resolveVoicingOctaveIntervals, Voicing } from './model/chord';

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

export const getRandomMidiNote = ([start, end]: [number, number]) => {
  return Math.floor(Math.random() * (end - start) + start);
};

export const usePlayer = ({
  noteToNoteDelay,
  releaseDelay,
  delayBetweenModes,
  startNoteRange,
  playBackModes,
}: Settings) => {
  const { piano } = useAudio();

  const stopAll = () => {
    const transport = Tone.getTransport();
    transport.cancel();
    transport.stop();
    piano?.releaseAll(Tone.now());
  };

  const playIntervals = async (
    chord: Interval[][] | Interval[],
    startNote = getRandomMidiNote(startNoteRange),
    sustained = true,
    modes: PlaybackMode[] = playBackModes
  ) => {
    await Tone.start();
    await Tone.loaded();

    stopAll();
    Tone.getTransport().position = 0;

    const octaves = (Array.isArray(chord[0]) ? chord : [chord]) as Interval[][];

    let notes = octaves.flatMap((intervals, index) =>
      intervals.map((note) =>
        Tone.Frequency(startNote, 'midi')
          .transpose(intervalDistanceMap[note] + index * 12)
          .toNote()
      )
    );

    let offset = 0;

    modes.forEach((mode) => {
      // TODO lautstärke

      switch (mode) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        case 'descending':
          notes = notes.reverse();
        // falls through
        case 'ascending':
          if (sustained) {
            notes.forEach((note, index) => {
              const t = offset + index * noteToNoteDelay;
              Tone.getTransport().schedule((time) => {
                piano?.triggerAttack(note, time, 0.8);
              }, t);
            });
            offset = offset + notes.length * noteToNoteDelay + releaseDelay;
            Tone.getTransport().schedule((time) => {
              piano?.releaseAll(time);
            }, offset);
          } else {
            notes.forEach((note, index) => {
              const t = offset + index * noteToNoteDelay;
              Tone.getTransport().schedule((time) => {
                piano?.triggerAttackRelease(note, releaseDelay, time, 0.8);
              }, t);
            });
            offset = offset + notes.length * noteToNoteDelay + releaseDelay;
          }

          break;
        case 'harmonic':
          Tone.getTransport().schedule((time) => {
            piano?.triggerAttack(notes, time, 0.8);
          }, offset);
          offset += releaseDelay;
          Tone.getTransport().schedule((time) => {
            piano?.releaseAll(time);
          }, offset);
          break;
        default:
          break;
      }
      offset += delayBetweenModes;
    });

    Tone.getTransport().start();
  };

  const playCadence = (
    cadence: ChordFunction[],
    startNote = getRandomMidiNote(startNoteRange)
  ) => {
    stopAll();
    Tone.getTransport().position = 0;

    let offset = 0;

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

      Tone.getTransport().schedule((time) => {
        piano?.triggerAttack(notes, time, 0.8);
      }, offset);
      offset += releaseDelay;
      Tone.getTransport().schedule((time) => {
        piano?.releaseAll(time);
      }, offset);
    });

    Tone.getTransport().start();
  };

  const handlePlayOption = <M extends QuizMode>(
    mode: M,
    quizOption: QuizOption<M>,
    startNote?: number,
    voicing?: Voicing
  ) => {
    switch (mode) {
      case QuizMode.chords: {
        const chordIntervals = (quizOption as QuizOption<QuizMode.chords>)
          .intervals;

        const intervals = voicing
          ? resolveVoicingOctaveIntervals(chordIntervals, voicing)
          : chordIntervals;

        playIntervals(intervals, startNote);

        break;
      }
      case QuizMode.intervals:
        playIntervals(
          ['1', (quizOption as QuizOption<QuizMode.intervals>).interval],
          startNote
        );
        break;
      case QuizMode.scales:
        playIntervals(
          [...(quizOption as QuizOption<QuizMode.scales>).intervals, '8'],
          startNote,
          false,
          playBackModes.filter((mode) => mode !== PlaybackMode.harmonic)
        );
        break;
      default:
        break;
    }
  };

  return {
    playIntervals,
    handlePlayOption,
    getRandomMidiNote,
    playCadence,
    stopAll,
  };
};
