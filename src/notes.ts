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
  b13: 19,
  13: 20,
  14: 22,
};

export type Chord = {
  name: string;
  intervals: Interval[];
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

const maj7Chords = [maj79, maj7s11, maj713];

export const maj69: Chord = {
  name: 'Maj6(9)',
  intervals: [...maj6Intervals, '9'],
};
export const maj6s11: Chord = {
  name: 'Maj6(#11)',
  intervals: [...maj6Intervals, '#11'],
};

const maj6Chords = [maj69, maj6s11];

const majChords = [...maj7Chords, ...maj6Chords];

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

const dom7Chords = [dom7b9, dom79, dom7s9, dom7s11, dom7b13, dom713];

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

const dom7Sus4Chords = [dom7Sus4b9, dom7Sus49, dom7Sus410, dom7Sus413];

const domChords = [...dom7Chords, ...dom7Sus4Chords];

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

const min7Chords = [min79, min711, min713];

export const min69: Chord = {
  name: 'Min6(9)',
  intervals: [...min6Intervals, '9'],
};
export const min611: Chord = {
  name: 'Min6(11)',
  intervals: [...min6Intervals, '11'],
};

const min6Chords = [min69, min611];

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

const minj7Chords = [minj79, minj711, minj713];

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

const min7b5Chords = [min7b59, min7b511, min7b5b13];

const minChords = [
  ...min7Chords,
  ...min6Chords,
  ...minj7Chords,
  ...min7b5Chords,
];

export const basicTensions = [...majChords, ...domChords, ...minChords];
