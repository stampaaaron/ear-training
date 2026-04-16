import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizOption } from '../model/quiz';
import { QuizSet } from './sets';

type CurrentSetState = {
  currentSet: QuizSet<QuizOption>;
};

const initialCurrentSet: QuizSet<QuizOption> = {
  key: '',
  label: '',
  description: '',
  options: [],
};

export const useCurrentSet = create<CurrentSetState>()(
  persist(() => ({ currentSet: initialCurrentSet }), {
    name: 'currentChordSet',
  })
);
