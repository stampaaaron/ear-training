import { atom } from 'nanostores';
import { QuizOption } from '../model/quiz';
import { getRandomFromArray } from '../utils';
import { useStore } from '@nanostores/react';
import { $settings } from './settings';
import { getRandomMidiNote } from '../player';

type QuizState = {
  current?: {
    startNote: number;
    option: QuizOption;
  };
  guess?: QuizOption;
};

export const $quiz = atom<QuizState>({});

export function useQuiz() {
  const quiz = useStore($quiz);

  const { startNoteRange } = useStore($settings);

  function nextQuestion(options: QuizOption[]) {
    const randomOption = getRandomFromArray(options);

    const startNote = getRandomMidiNote(startNoteRange);
    const current = { startNote, option: randomOption };

    $quiz.set({
      current,
      guess: undefined,
    });

    return current;
  }

  function setGuess(guess: QuizOption) {
    $quiz.set({ ...quiz, guess });
  }

  return { quiz, nextQuestion, setGuess };
}
