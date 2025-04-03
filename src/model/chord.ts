import { Interval } from '../notes';

type Entries<T> = {
  [K in keyof T]-?: [K, T[K]];
}[keyof T][];

export type Chord = {
  name: string;
  intervals: Interval[];
  tensions?: ChordTension[];
  group: ChordBase;
};

export type ChordSet = {
  key: string;
  label: string;
  description?: string;
  chords: Chord[];
};

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
  maj: { name: 'Maj', customExtensionNames: { 7: 'Maj7' } },
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

type SeventhChords<C extends object = typeof chords> = Record<
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

function getAllTensionChords(chord: Chord): Chord[] {
  return (
    chord.tensions?.map((t) => ({
      ...chord,
      intervals: [...chord.intervals, t],
      name: `${chord.name}(${t})`,
    })) ?? []
  );
}

const allTriads = [
  baseChords['maj'],
  baseChords['min'],
  baseChords['dim'],
  baseChords['aug'],
  baseChords['sus'],
  baseChords['sus2'],
];

const basicSenventhChords = [
  seventhChords['maj.7'],
  seventhChords['maj.6'],
  seventhChords['min.7'],
  seventhChords['min.6'],
  seventhChords['maj.b7'],
  seventhChords['sus.b7'],
  seventhChords['dim.b7'],
];

const allSeventhChords = Object.values(seventhChords);

const allChordsWithTensions = allSeventhChords.flatMap(getAllTensionChords);

export const allChords = [
  ...allTriads,
  ...allSeventhChords,
  ...allChordsWithTensions,
];

export const chordSets: ChordSet[] = [
  {
    key: 'triads',
    label: 'Triads',
    chords: allTriads,
    description: `All triads (${allTriads.map(({ name }) => name).join(', ')})`,
  },
  {
    key: 'basic-seventh-chords',
    label: 'Basic Seventh Chords',
    chords: basicSenventhChords,
    description: basicSenventhChords.map(({ name }) => name).join(', '),
  },
  {
    key: 'all-seventh-chords',
    label: 'All Seventh Chords',
    chords: allSeventhChords,
    description: allSeventhChords.map(({ name }) => name).join(', '),
  },
  {
    key: 'basic-tensions',
    label: 'Basic Tensions',
    chords: basicSenventhChords.flatMap(getAllTensionChords),
    description: `${basicSenventhChords.map(({ name }) => name).join(', ')} with Tensions`,
  },
  {
    key: 'all-tensions',
    label: 'All Tensions',
    chords: allChordsWithTensions,
    description: `${allSeventhChords.map(({ name }) => name).join(', ')} with Tensions`,
  },
];
