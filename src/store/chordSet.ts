import { persistentAtom } from '@nanostores/persistent';
import { QuizSet } from '../model/quizSet';
import { QuizOption } from '../model/quiz';

export const $currentQuizSet = persistentAtom<QuizSet<QuizOption>>(
  'currentChordSet',
  {
    key: '',
    label: '',
    description: '',
    options: [],
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);
