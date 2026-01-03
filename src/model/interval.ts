import { QuizOptionBase, QuizSet } from '../store/sets';
import { Entries } from './helper';

export type Interval =
  | '1'
  | 'b2'
  | '2'
  | '#2'
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
  '#2': 3,
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

const intervalNaming: Record<Interval, string> = {
  1: '1',
  b2: 'b2',
  '2': '2',
  '#2': '#2',
  b3: 'b3',
  '3': '3',
  '4': '4',
  '#4': '#4 / b5',
  b5: 'b5',
  '5': '5',
  '#5': '#5',
  b6: 'b6',
  '6': '6',
  bb7: 'bb7',
  b7: 'b7',
  '7': '7',
  8: '8',
  b9: 'b9',
  9: '9',
  '#9': '#9',
  10: '10',
  11: '11',
  '#11': '#11',
  b13: 'b13',
  13: '13',
  14: '14',
};

export type IntervalOption = QuizOptionBase & {
  interval: Interval;
};

type Intervals<C extends object = typeof intervalNaming> = Record<
  keyof C,
  IntervalOption
>;

const intervals = (
  Object.entries(intervalNaming) as Entries<typeof intervalNaming>
).reduce(
  (acc, [interval, name]) => ({ ...acc, [interval]: { name, interval } }),
  {} as Intervals
);

export const allIntervals = Object.values(intervals);

const lowerMajorIntervals = [
  intervals[1],
  intervals[2],
  intervals[3],
  intervals[4],
  intervals[5],
  intervals[6],
  intervals[7],
  intervals[8],
];

const allLowerIntervals = [
  intervals['1'],
  intervals['b2'],
  intervals['2'],
  intervals['b3'],
  intervals['3'],
  intervals['4'],
  intervals['#4'],
  intervals['5'],
  intervals['b6'],
  intervals['6'],
  intervals['b7'],
  intervals['7'],
  intervals['8'],
];

const upperIntervals = [
  intervals['b9'],
  intervals['9'],
  intervals['#9'],
  intervals['10'],
  intervals['11'],
  intervals['#11'],
  intervals['b13'],
  intervals['13'],
  intervals['14'],
];

export const intervalSets: QuizSet<IntervalOption>[] = [
  {
    key: 'basic',
    label: 'Basic intervals',
    description: lowerMajorIntervals.map(({ name }) => name).join(', '),
    options: lowerMajorIntervals,
  },
  {
    key: 'lower',
    label: 'All lower intervals',
    description: allLowerIntervals.map(({ name }) => name).join(', '),
    options: allLowerIntervals,
  },
  {
    key: 'upper',
    label: 'Upper intervals',
    description: upperIntervals.map(({ name }) => name).join(', '),
    options: upperIntervals,
  },
];
