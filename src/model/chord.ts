import { Entries } from './helper';
import { Interval } from './interval';
import { QuizOptionBase } from './quizSet';

type ChordExtension = Extract<Interval, '6' | 'bb7' | 'b7' | '7'>;
export type ChordTension = Extract<
  Interval,
  'b9' | '9' | '#9' | '10' | '11' | '#11' | 'b13' | '13' | '14'
>;

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
  tensions?: ChordTension[];
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

const chords =
// : {
//   [b in ChordBase]: {
//     [e in ChordExtension]?: ChordTension[];
//   };
// }
{
  maj: {
    '7': ['9', '#11', '13'],
    '6': ['9', '#11'],
    b7: [],
  },
  dom: {
    b7: ['b9', '9', '#9', '#11', 'b13', '13'],
  },
  sus: {
    b7: ['b9', '9', '10', '13'],
  },
  sus2: undefined,
  min: {
    b7: ['9', '11', '13'],
    '6': ['9', '11'],
    '7': ['9', '11', '13'],
  },
  dim: {
    '7': [],
    b7: ['9', '11', 'b13'],
    bb7: ['9', '11', 'b13', '14'],
  },
  aug: {
    '7': ['9', '#11'],
    b7: ['b9', '9', '#11'],
  },
};

const chordExtensionNames: Record<ChordExtension, string> = {
  7: '(maj7)',
  6: '6',
  bb7: '7',
  b7: '7',
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

      acc[`${base}.${extension}`] = {
        intervals: [...chordBaseIntervals[base], extension],
        tensions: tensions as ChordTension[],
        group,
        name,
      };
    });
  }

  return acc;
}, {} as SeventhChords);

export function getAllTensionChords(chord: Chord): Chord[] {
  return (
    chord.tensions?.map((t) => ({
      ...chord,
      intervals: [...chord.intervals, t],
      name: `${chord.name}(${t})`,
    })) ?? []
  );
}
