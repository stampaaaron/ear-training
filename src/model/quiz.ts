import { chordGroupNaming } from './chord';
import { allChords } from './chordSet';
import { allIntervals } from './interval';
import { allScales, scaleGroupNaming } from './scale';

export enum QuizMode {
  intervals = 'intervals',
  chords = 'chords',
  scales = 'scales',
}

export const quizModeNames: Record<QuizMode, string> = {
  [QuizMode.intervals]: 'Intervals',
  [QuizMode.chords]: 'Chords',
  [QuizMode.scales]: 'Scales',
};

export const quizOptions = {
  [QuizMode.intervals]: allIntervals,
  [QuizMode.chords]: allChords,
  [QuizMode.scales]: allScales,
} as const;

export type QuizOption<M extends QuizMode = keyof typeof quizOptions> =
  (typeof quizOptions)[M][number];

export const quizGroups: { [M in QuizMode]: Record<string, string> } = {
  [QuizMode.intervals]: {},
  [QuizMode.chords]: chordGroupNaming,
  [QuizMode.scales]: scaleGroupNaming,
};
