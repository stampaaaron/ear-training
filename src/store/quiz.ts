import { create } from 'zustand';
import { QuizOption } from '../model/quiz';
import { getRandomFromArray } from '../utils';
import { useSettings } from './settings';
import { getRandomMidiNote } from '../player';
import { InvertedChord, Voicing, isVoicingValidForChord } from '../model/voicing';
import { QuizSet } from './sets';

type QuizState = {
  current?: {
    startNote: number;
    voicing?: Voicing;
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

    const invertedOption = randomOption as Partial<InvertedChord>;

    if (invertedOption.voicing) {
      // This option IS a specific inversion (see getChordInversions in
      // model/voicing.ts) — its voicing is the answer, not a random pick.
      current.voicing = invertedOption.voicing;
    } else if (set?.settings?.alternativeVoicings && 'tensions' in randomOption) {
      const availableVoicings = (set.settings.voicings ?? []).filter((voicing) =>
        isVoicingValidForChord(voicing, randomOption)
      );

      current.voicing =
        availableVoicings.length > 0
          ? getRandomFromArray(availableVoicings)
          : undefined;
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
