import { chordSets } from './chordSet';
import { QuizMode } from './quiz';

export type QuizSet = {
  key: string;
  label: string;
  description?: string;
};

export const quizSets: Record<QuizMode, QuizSet[]> = {
  [QuizMode.intervals]: [],
  [QuizMode.chords]: chordSets,
  [QuizMode.scales]: [],
};
