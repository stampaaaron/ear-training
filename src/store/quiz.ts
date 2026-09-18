import { create } from 'zustand';
import { QuizOption } from '../model/quiz';
import { getRandomFromArray } from '../utils';
import { useSettings } from './settings';
import { getRandomMidiNote } from '../player';
import {
  Voicing,
  isClosePositionValidForChord,
  isVoicingValidForChord,
} from '../model/voicing';
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

    if ('tensions' in randomOption) {
      // Alternative voicings (extended/tension shapes) and inversions
      // (close-position, non-root bass) are independent toggles — pool
      // whichever of them are enabled for this set. Each uses its own
      // matching rule: alternativeVoicings deliberately also matches a
      // chord with extra tensions on top, while a close-position voicing
      // must match the chord's tone count exactly (see
      // isClosePositionValidForChord) — otherwise a 3-tone triad voicing
      // could silently apply to a 4-tone seventh chord and drop its 7th.
      const availableVoicings = [
        ...(set?.settings?.alternativeVoicings
          ? (set.settings.voicings ?? []).filter((voicing) =>
              isVoicingValidForChord(voicing, randomOption)
            )
          : []),
        ...(set?.settings?.inversions
          ? (set.settings.inversionVoicings ?? []).filter((voicing) =>
              isClosePositionValidForChord(voicing, randomOption)
            )
          : []),
      ];

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
