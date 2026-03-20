import { atom } from 'nanostores';
import { QuizOption } from '../model/quiz';
import { getRandomFromArray } from '../utils';
import { useStore } from '@nanostores/react';
import { $settings } from './settings';
import { getRandomMidiNote } from '../player';
import {
  alternativeVoicings,
  Vocing,
  voicingContainsChord,
} from '../model/chord';
import { QuizSet } from './sets';

type QuizState = {
  current?: {
    startNote: number;
    voicing?: Vocing;
    option: QuizOption;
  };
  guess?: QuizOption;
  revealed?: boolean;
};

export const $quiz = atom<QuizState>({});

export function useQuiz(set?: QuizSet<QuizOption>) {
  const quiz = useStore($quiz);

  const { startNoteRange } = useStore($settings);

  function nextQuestion(options: QuizOption[]) {
    const randomOption = getRandomFromArray(options);

    const startNote = getRandomMidiNote(
      set?.settings?.startNoteRange ?? startNoteRange
    );

    const current: QuizState['current'] = { startNote, option: randomOption };

    if ('tensions' in randomOption) {
      const availableVoicings = alternativeVoicings.filter((voicing) =>
        voicingContainsChord(voicing, randomOption)
      );

      const voicing = set?.settings?.alternativeVoicings
        ? getRandomFromArray(availableVoicings)
        : undefined;

      current.voicing = voicing;
    }

    $quiz.set({
      current,
      guess: undefined,
      revealed: false,
    });

    return current;
  }

  function setGuess(guess: QuizOption, revealed?: true) {
    $quiz.set({ ...quiz, guess, revealed });
  }

  return { quiz, nextQuestion, setGuess };
}
