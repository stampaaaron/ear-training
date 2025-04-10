import { persistentAtom } from '@nanostores/persistent';
import { QuizSet } from '../model/quizSet';
import { QuizOption } from '../model/quiz';

export const $currentSet = persistentAtom<QuizSet<QuizOption>>(
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
