import { QuizOptionBase } from '../store/sets';
import { getRandomFromArray } from '../utils';
import { Entries } from './helper';
import { Interval, intervalDistanceMap } from './interval';

type ChordExtension = Extract<Interval, '6' | 'bb7' | 'b7' | '7'> | 'add';
export type ChordTension = Extract<
  Interval,
  'b9' | '9' | '#9' | '10' | '11' | '#11' | 'b13' | '13' | '14'
>;

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

type VoicingIntervalOctave = VoicingInterval[];

export type Voicing = VoicingIntervalOctave[];

export const alternativeVoicings: Voicing[] = [
  // 1,5
  [
    [1, 5],
    [9, 3, 7],
  ],
  [
    //   Zu grosser sprung?
    [1, 5],
    [3, 11, 7],
  ],
  [
    //   Zu grosser sprung?
    [1, 5],
    [3, 13, 7],
  ],

  // add chords
  [
    [1, 5],
    [9, 3, 11],
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

  // #9
  [
    [1, 3],
    [9, '#9', 7],
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

export enum ChordBase {
  maj = 'maj',
  min = 'min',
  dom = 'dom',
  dim = 'dim',
  aug = 'aug',
  sus = 'sus',
  sus2 = 'sus2',
}

export type Chord = QuizOptionBase<ChordBase> & {
  intervals: Interval[];
  tensions?: ChordTension[][];
};

export const chordGroupNaming: { [K in ChordBase]?: string } = {
  [ChordBase.maj]: 'Major',
  [ChordBase.min]: 'Minor',
  [ChordBase.dom]: 'Dominant',
  [ChordBase.dim]: 'Diminished',
  [ChordBase.aug]: 'Augmented',
  [ChordBase.sus]: 'Sus',
};

const chordBaseIntervals: Record<ChordBase, Interval[]> = {
  maj: ['1', '3', '5'],
  min: ['1', 'b3', '5'],
  dom: ['1', '3'],
  dim: ['1', 'b3', 'b5'],
  aug: ['1', '3', '#5'],
  sus: ['1', '4', '5'],
  sus2: ['1', '2', '5'],
};

const chords: {
  [b in ChordBase]: {
    [e in ChordExtension]?: ChordTension[][];
  };
} = {
  maj: {
    '7': [
      ['9', '#11'],
      ['#11', '13'],
      ['9', '13'],
    ],
    '6': [['9', '#11']],
    b7: [],
    add: [['9', '#11']],
  },
  dom: {
    b7: [
      ['b9', '#9'],
      ['b9', '#11'],
      ['b9', 'b13'],
      ['b9', '13'],
      ['9', '#11'],
      ['9', 'b13'],
      ['9', '13'],
      ['#9', '#11'],
      ['#9', 'b13'],
      ['#9', '13'],
      ['#11', 'b13'],
      ['#11', '13'],
    ],
  },
  sus: {
    b7: [
      ['b9', '10'],
      ['b9', '13'],
      ['9', '10'],
      ['10', '13'],
    ],
    add: [
      ['b9', '10'],
      ['b9', '13'],
      ['9', '10'],
      ['10', '13'],
    ],
  },
  sus2: {},
  min: {
    b7: [
      ['9', '11'],
      ['9', '13'],
      ['11', '13'],
    ],
    '6': [['9', '11']],
    '7': [
      ['9', '11'],
      ['9', '13'],
      ['11', '13'],
    ],
    add: [['9', '11']],
  },
  dim: {
    '7': [],
    b7: [
      ['9', '11'],
      ['9', 'b13'],
      ['11', 'b13'],
    ],
    bb7: [
      ['9', '11'],
      ['9', 'b13'],
      ['9', '14'],
      ['11', 'b13'],
      ['11', '14'],
      ['b13', '14'],
    ],
  },
  aug: {
    '7': [['9', '#11']],
    b7: [
      ['b9', '#11'],
      ['9', '#11'],
    ],
  },
};

const chordExtensionNames: Record<ChordExtension, string> = {
  7: '(maj7)',
  6: '6',
  bb7: '7',
  b7: '7',
  add: ' add',
};

const chordNaming: {
  [b in ChordBase]: {
    name: string;
    customExtensionNames?: { [e in ChordExtension]?: string };
  };
} = {
  maj: { name: 'Maj', customExtensionNames: { 7: 'Maj7', b7: '7' } },
  min: { name: 'Min' },
  dom: { name: '' },
  dim: { name: 'Dim', customExtensionNames: { b7: 'Min7b5' } },
  aug: { name: 'Aug', customExtensionNames: { 7: 'Maj7#5', b7: '7#5' } },
  sus: { name: 'Sus4', customExtensionNames: { b7: '7sus4' } },
  sus2: { name: 'Sus2' },
};

type ChordGrouping<C extends object = typeof chords> = {
  [K in keyof C]: {
    group: ChordBase;
    customExtensionGroups?: { [e in keyof C[K]]?: ChordBase };
  };
};

const chordGrouping: ChordGrouping = {
  maj: { group: ChordBase.maj, customExtensionGroups: { b7: ChordBase.dom } },
  min: { group: ChordBase.min },
  dom: { group: ChordBase.dom },
  sus: { group: ChordBase.sus, customExtensionGroups: { b7: ChordBase.dom } },
  sus2: { group: ChordBase.sus },
  aug: {
    group: ChordBase.aug,
    customExtensionGroups: { '7': ChordBase.maj, b7: ChordBase.dom },
  },
  dim: { group: ChordBase.dim, customExtensionGroups: { b7: ChordBase.min } },
};

export type SeventhChords<C extends object = typeof chords> = Record<
  {
    [K in keyof C]: `${Exclude<K, symbol>}.${Exclude<keyof C[K], symbol>}`;
  }[keyof C],
  Chord
>;

export const baseChords = (
  Object.entries(chords) as Entries<typeof chords>
).reduce(
  (acc, [base]) => {
    acc[base] = {
      intervals: chordBaseIntervals[base],
      name: chordNaming[base].name,
      group: chordGrouping[base].group,
    };

    return acc;
  },
  {} as Record<keyof typeof chords, Chord>
);

export const seventhChords = (
  Object.entries(chords) as Entries<typeof chords>
).reduce<SeventhChords>((acc, [base, extensions]) => {
  if (extensions) {
    const extensionEntries = Object.entries(extensions) as Entries<
      typeof extensions
    >;
    extensionEntries.map(([extension, tensions]) => {
      const name =
        chordNaming[base].customExtensionNames?.[extension] ??
        `${chordNaming[base].name}${chordExtensionNames[extension]}`;

      const group =
        chordGrouping[base].customExtensionGroups?.[extension] ??
        chordGrouping[base].group;

      const intervals = [
        ...chordBaseIntervals[base],
        ...(extension === 'add' ? [] : [extension]),
      ];

      acc[`${base}.${extension}`] = {
        intervals,
        tensions,
        group,
        name,
      };
    });
  }

  return acc;
}, {} as SeventhChords);

export function getAllOneTensionChords(chord: Chord): Chord[] {
  const uniqueTensions = chord.tensions
    ?.flat()
    .filter((value, index, array) => array.indexOf(value) === index);

  return (
    uniqueTensions?.map((t) => ({
      ...chord,
      intervals: [...chord.intervals, t],
      name: `${chord.name}(${t})`,
    })) ?? []
  );
}

export function getAllTwoTensionChords(chord: Chord): Chord[] {
  return (
    chord.tensions?.map((t) => ({
      ...chord,
      intervals: [...chord.intervals, ...t],
      name: `${chord.name}(${t})`,
    })) ?? []
  );
}

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
