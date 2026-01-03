import { persistentAtom } from '@nanostores/persistent';
import { QuizOption } from '../model/quiz';
import { QuizSet } from './sets';

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
