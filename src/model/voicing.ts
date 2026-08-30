import { getRandomFromArray } from '../utils';
import { Chord, ChordTension } from './chord';
import { Interval, intervalDistanceMap } from './interval';

type VoicingInterval = 1 | 3 | 5 | 7 | 9 | '#9' | '10' | 11 | 13;

export const chordIntervalBaseMap: Record<VoicingInterval, Interval[]> = {
  '1': ['1'],
  '3': ['b3', '3', '4'],
  '5': ['5', 'b5'],
  '7': ['bb7', 'b7', '7', '6'],
  '9': ['b9', '9'],
  '#9': ['#9'],
  '10': ['10'],
  '11': ['11', '#11'],
  '13': ['b13', '13'],
};

export type VoicingIntervalOctave = VoicingInterval[];

export type Voicing = VoicingIntervalOctave[];

export const alternativeVoicings: Voicing[] = [
  // 1,5
  [
    [1, 5],
    [9, 3, 7],
  ],
  [
    [1, 5],
    [3, 11, 7],
  ],
  [
    [1, 5],
    [3, 13, 7],
  ],

  // add chords
  [
    [1, 5],
    [9, 3, 11],
  ],
  [
    [1, 11],
    [9, 3, 5],
  ],

  // 1,5,13
  [
    [1, 5, 13],
    [3, 7],
  ],

  // 1,13
  [
    [1, 13],
    [9, 3, 7],
  ],
  [
    [1, 13],
    [3, 11, 7],
  ],
  [
    [1, 13],
    [3, 5, 7],
  ],

  // 1,7
  [
    [1, 7],
    [9, 3, 5],
  ],
  [
    [1, 7],
    [9, 3, 11], // 10 prüfen
  ],
  [
    [1, 7],
    [9, 3, 13],
  ],
  [
    [1, 7],
    [3, 11, 5],
  ],
  [
    [1, 7],
    [3, 11, 13], // 10 prüfen
  ],
  [
    [1, 7],
    [3, 5, 13],
  ],

  // 1,11,7
  [
    [1, 11, 7],
    [9, 3],
  ],
  [
    [1, 11, 7],
    [3, 5],
  ],
  [
    [1, 11, 7],
    [3, 13],
  ],
  [[1, 11, 5, 7], [3]],

  //  1,3,7
  [
    [1, 3, 7],
    [11, 5],
  ],
  [
    [1, 3, 7],
    [9, 11],
  ],
  [
    [1, 3, 7],
    [9, 5],
  ],
  [
    [1, 3, 7],
    [11, 13],
  ],
  [
    [1, 3, 7],
    [9, 13],
  ],

  // 1,5,7
  [
    [1, 5, 7],
    [9, 3],
  ],
  [
    [1, 5, 7],
    [3, 11],
  ],
  [
    [1, 5, 7],
    [3, 13],
  ],

  [[1, 5], [9, 13], [3]],
  [
    [1, 5],
    [9, 3, 13],
  ],

  // #9
  [
    [1, 3],
    [9, '#9', 7],
  ],
  // #9 without a b9 alongside it
  [
    [1, 3, 5],
    ['#9', 7],
  ],

  // 10
  [
    [1, 3, 7],
    [9, '10'],
  ],
  [
    [1, 3, 7],
    ['10', 5],
  ],
  [
    [1, 3, 7],
    ['10', 13],
  ],

  [[1, 5, 13, 7], [3]],
  [[1, 3, 13, 7], [9]],
];

// TODO
// 1, 3, b9, #11, 7b
// 1, 13, 7, 3 #11
// 1, 6, 9, 3, 5
// 1, b7, b9, 3, 13
// 1, 7, 9, 3, #11

export const isTensionsVoicing = (voicing: Voicing, tensions: ChordTension[]) =>
  tensions?.every((t) =>
    voicing.flat().some((i) => chordIntervalBaseMap[i].includes(t))
  );

export const voicingContainsChord = (voicing: Voicing, chord: Chord) => {
  const chordWithFiveNotes = resolveChordIntervalsForVoicings(chord);

  return voicing
    .flat()
    .map((voicingInterval) => chordIntervalBaseMap[voicingInterval])
    .every((intervals) =>
      intervals.some((i) => chordWithFiveNotes.includes(i))
    );
};

const resolveChordIntervalsForVoicings = (chord: Chord) => {
  return chord.intervals.length > 5
    ? chord.intervals.filter((i) => i !== '5')
    : chord.intervals;
};

export const resolveVoicingOctaveIntervals = (
  chord: Interval[],
  voicing = getRandomFromArray(alternativeVoicings)
) =>
  voicing.map((octave) =>
    octave
      .map((voicingInterval) => {
        const interval = chordIntervalBaseMap[voicingInterval].find((i) =>
          chord.includes(i)
        );

        if (!interval) return;

        const semitones = intervalDistanceMap[interval];

        if (semitones < 12) return interval;

        const intervalOneOctaveLower = Object.entries(intervalDistanceMap).find(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, value]) => value === semitones - 12
        )?.[0];

        return intervalOneOctaveLower;
      })
      .filter((x): x is Interval => !!x)
  );
