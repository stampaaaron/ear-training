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
