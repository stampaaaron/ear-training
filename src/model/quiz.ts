import { chordGroupNaming } from './chord';
import { allChords } from './chordSet';

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
  [QuizMode.intervals]: [],
  [QuizMode.chords]: allChords,
  [QuizMode.scales]: [],
} as const;

export type QuizOption<M extends QuizMode = keyof typeof quizOptions> =
  (typeof quizOptions)[M][number];

export const quizGroups: { [M in QuizMode]: Record<string, string> } = {
  [QuizMode.intervals]: {},
  [QuizMode.chords]: chordGroupNaming,
  [QuizMode.scales]: {},
};
