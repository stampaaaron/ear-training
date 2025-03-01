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
export const maj69: Chord = {
  name: 'Maj6(9)',
  intervals: [...maj6Intervals, '9'],
};
export const maj6s11: Chord = {
  name: 'Maj6(#11)',
  intervals: [...maj6Intervals, '#11'],
};

export const basicTensions = [maj79, maj7s11, maj713, maj69, maj6s11];
