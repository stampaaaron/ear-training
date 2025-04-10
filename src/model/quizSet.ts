import { chordSets } from './chordSet';
import { QuizOption, QuizMode } from './quiz';

export type QuizSet<O extends QuizOptionBase> = {
  key: string;
  label: string;
  description?: string;
  options?: O[];
};

export const quizSets: { [M in QuizMode]: QuizSet<QuizOption<M>>[] } = {
  [QuizMode.intervals]: [],
  [QuizMode.chords]: chordSets,
  [QuizMode.scales]: [],
};

export const allSets = Object.values(quizSets).flat();

export type QuizOptionBase<G extends string = string> = {
  name: string;
  group?: G;
};
