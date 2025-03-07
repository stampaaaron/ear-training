export type Interval =
  | '1'
  | 'b2'
  | '2'
  | 'b3'
  | '3'
  | '4'
  | '#4'
  | 'b5'
  | '5'
  | '#5'
  | 'b6'
  | '6'
  | 'bb7'
  | 'b7'
  | '7'
  | '8'
  | 'b9'
  | '9'
  | '#9'
  | '10'
  | '11'
  | '#11'
  | 'b13'
  | '13'
  | '14';

export const intervalDistanceMap: Record<Interval, number> = {
  1: 0,
  b2: 1,
  '2': 2,
  b3: 3,
  '3': 4,
  '4': 5,
  '#4': 6,
  b5: 6,
  '5': 7,
  '#5': 8,
  b6: 8,
  '6': 9,
  bb7: 9,
  b7: 10,
  '7': 11,
  8: 12,
  b9: 13,
  9: 14,
  '#9': 15,
  10: 16,
  11: 17,
  '#11': 18,
  b13: 20,
  13: 21,
  14: 23,
};

export type Chord = {
  name: string;
  intervals: Interval[];
};

export type ChordSet = {
  key: string;
  label: string;
  description?: string;
  chords: Chord[];
};

const majIntervals: Interval[] = ['1', '3', '5'];
const maj7Intervals: Interval[] = [...majIntervals, '7'];
const maj6Intervals: Interval[] = [...majIntervals, '6'];
const domIntervals: Interval[] = ['1', '3', 'b7'];
const domSus4Intervals: Interval[] = ['1', '4', '5', 'b7'];
const minIntervals: Interval[] = ['1', 'b3', '5'];
const min7Intervals: Interval[] = [...minIntervals, 'b7'];
const min6Intervals: Interval[] = [...minIntervals, '6'];
const minj7Intervals: Interval[] = [...minIntervals, '7'];
const dimIntervals: Interval[] = ['1', 'b3', 'b5'];
const min7b5Intervals: Interval[] = [...dimIntervals, 'b7'];
const dim7Intervals: Interval[] = [...dimIntervals, 'bb7'];
const augIntervals: Interval[] = ['1', '3', '#5'];
const aug7Intervals: Interval[] = [...augIntervals, 'b7'];
const augj7Intervals: Interval[] = [...augIntervals, '7'];

export const maj7: Chord = {
  name: 'Maj7',
  intervals: maj7Intervals,
};
export const maj6: Chord = {
  name: 'Maj6',
  intervals: maj6Intervals,
};
export const maj7s5: Chord = {
  name: 'Maj7#5',
  intervals: augj7Intervals,
};

const basicMaj7Chords = [maj7, maj6];
const maj7Chords = [...basicMaj7Chords, maj7s5];

export const dom7: Chord = {
  name: '7',
  intervals: domIntervals,
};
export const dom7Sus4: Chord = {
  name: '7sus4',
  intervals: domSus4Intervals,
};
export const dom7s5: Chord = {
  name: '7#5',
  intervals: aug7Intervals,
};

const basicDomChords = [dom7, dom7Sus4];
const domChords = [...basicDomChords, dom7s5];

export const min7: Chord = {
  name: 'Min7',
  intervals: min7Intervals,
};
export const min6: Chord = {
  name: 'Min6',
  intervals: min7Intervals,
};
export const minj7: Chord = {
  name: 'Minj7',
  intervals: minj7Intervals,
};
export const min7b5: Chord = {
  name: 'Min7b5',
  intervals: min7b5Intervals,
};

const basicMinChords = [min7, min6, minj7, min7b5];
const minChords = [...basicMinChords];

export const dim7: Chord = {
  name: 'Dim7',
  intervals: dim7Intervals,
};
export const dimj7: Chord = {
  name: 'Dim(maj7)',
  intervals: dim7Intervals,
};

const basicDimChords = [dim7];
const dimChords = [dim7, dimj7];

const basicSenventhChords = [
  ...basicMaj7Chords,
  ...basicDomChords,
  ...basicMinChords,
  ...basicDimChords,
];
const allSeventhChords = [
  ...maj7Chords,
  ...domChords,
  ...minChords,
  ...dimChords,
];

export const maj79: Chord = {
  name: 'Maj7(9)',
  intervals: [...maj7Intervals, '9'],
};
export const maj7s11: Chord = {
  name: 'Maj7(#11)',
  intervals: [...maj7Intervals, '#11'],
};
export const maj713: Chord = {
  name: 'Maj7(13)',
  intervals: [...maj7Intervals, '13'],
};

export const maj7ChordsWithTensions = [maj79, maj7s11, maj713];

export const maj69: Chord = {
  name: 'Maj6(9)',
  intervals: [...maj6Intervals, '9'],
};
export const maj6s11: Chord = {
  name: 'Maj6(#11)',
  intervals: [...maj6Intervals, '#11'],
};

export const maj6ChordsWithTensions = [maj69, maj6s11];

export const majChordsWithTensions = [
  ...maj7ChordsWithTensions,
  ...maj6ChordsWithTensions,
];

export const allMajChords = [...maj7Chords, ...majChordsWithTensions];

export const dom7b9: Chord = {
  name: '7(b9)',
  intervals: [...domIntervals, 'b9'],
};
export const dom79: Chord = {
  name: '7(9)',
  intervals: [...domIntervals, '9'],
};
export const dom7s9: Chord = {
  name: '7(#9)',
  intervals: [...domIntervals, '#9'],
};
export const dom7s11: Chord = {
  name: '7(#11)',
  intervals: [...domIntervals, '#11'],
};
export const dom7b13: Chord = {
  name: '7(b13)',
  intervals: [...domIntervals, 'b13'],
};
export const dom713: Chord = {
  name: '7(13)',
  intervals: [...domIntervals, '13'],
};

export const dom7ChordsWithTensions = [
  dom7b9,
  dom79,
  dom7s9,
  dom7s11,
  dom7b13,
  dom713,
];

export const dom7Sus4b9: Chord = {
  name: '7sus4(b9)',
  intervals: [...domSus4Intervals, 'b9'],
};
export const dom7Sus49: Chord = {
  name: '7sus4(9)',
  intervals: [...domSus4Intervals, '9'],
};
export const dom7Sus410: Chord = {
  name: '7sus4(10)',
  intervals: [...domSus4Intervals, '10'],
};
export const dom7Sus413: Chord = {
  name: '7sus4(13)',
  intervals: [...domSus4Intervals, '13'],
};

export const dom7Sus4ChordsWithTensions = [
  dom7Sus4b9,
  dom7Sus49,
  dom7Sus410,
  dom7Sus413,
];

export const domChordsWithTensions = [
  ...dom7ChordsWithTensions,
  ...dom7Sus4ChordsWithTensions,
];

export const allDomChords = [...domChords, ...domChordsWithTensions];

export const min79: Chord = {
  name: 'Min7(9)',
  intervals: [...min7Intervals, '9'],
};
export const min711: Chord = {
  name: 'Min7(11)',
  intervals: [...min7Intervals, '11'],
};
export const min713: Chord = {
  name: 'Min7(13)',
  intervals: [...min7Intervals, '13'],
};

export const min7ChordsWithTensions = [min79, min711, min713];

export const min69: Chord = {
  name: 'Min6(9)',
  intervals: [...min6Intervals, '9'],
};
export const min611: Chord = {
  name: 'Min6(11)',
  intervals: [...min6Intervals, '11'],
};

export const min6ChordsWithTensions = [min69, min611];

export const minj79: Chord = {
  name: 'Min(maj7)(9)',
  intervals: [...minj7Intervals, '9'],
};
export const minj711: Chord = {
  name: 'Min(maj7)(11)',
  intervals: [...minj7Intervals, '11'],
};
export const minj713: Chord = {
  name: 'Min(maj7)(13)',
  intervals: [...minj7Intervals, '13'],
};

export const minj7ChordsWithTensions = [minj79, minj711, minj713];

export const min7b59: Chord = {
  name: 'Min7(b5)(9)',
  intervals: [...min7b5Intervals, '9'],
};
export const min7b511: Chord = {
  name: 'Min7(b5)(11)',
  intervals: [...min7b5Intervals, '11'],
};
export const min7b5b13: Chord = {
  name: 'Min7(b5)(b13)',
  intervals: [...min7b5Intervals, 'b13'],
};

export const min7b5ChordsWithTensions = [min7b59, min7b511, min7b5b13];

export const minChordsWithTensions = [
  ...min7ChordsWithTensions,
  ...min6ChordsWithTensions,
  ...minj7ChordsWithTensions,
  ...min7b5ChordsWithTensions,
];

export const allMinChords = [...minChords, ...minChordsWithTensions];

export const basicTensions = [
  ...majChordsWithTensions,
  ...domChordsWithTensions,
  ...minChordsWithTensions,
];

export const chordSets = [
  {
    key: 'basic-seventh-chords',
    label: 'Basic Seventh Chords',
    description:
      ' maj7, maj6, dom7, dom7sus4, min7, min6, min7(b5) and min(maj7).',

    chords: basicSenventhChords,
  },
  {
    key: 'all-seventh-chords',
    label: 'All Seventh Chords',
    description:
      'maj7, maj6, maj7#5, dom7, dom7sus4, dom7#5, min7, min6, min7(b5) and min(maj7).',
    chords: allSeventhChords,
  },
  {
    key: 'basic-tensions',
    label: 'Basic Tensions',
    description:
      'maj7, maj6, dom7, dom7sus4, min7, min6, min7(b5) and min(maj7) with all tensions',
    chords: basicTensions,
  },
];
