import { create } from 'zustand';
import { QuizOption } from '../model/quiz';
import { getRandomFromArray } from '../utils';
import { useSettings } from './settings';
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

export const useQuizStore = create<QuizState>()(() => ({}));

export function useQuiz(set?: QuizSet<QuizOption>) {
  const quiz = useQuizStore();

  const startNoteRange = useSettings((s) => s.startNoteRange);

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

    useQuizStore.setState(
      {
        current,
        guess: undefined,
        revealed: false,
      },
      true
    );

    return current;
  }

  function setGuess(guess: QuizOption, revealed?: true) {
    useQuizStore.setState({ guess, revealed });
  }

  return { quiz, nextQuestion, setGuess };
}
