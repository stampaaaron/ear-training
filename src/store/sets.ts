import { persistentAtom } from '@nanostores/persistent';
import { QuizMode, QuizOption } from '../model/quiz';
import { Settings } from './settings';
import { chordSets } from '../model/chordSet';
import { intervalSets } from '../model/interval';
import { scaleSets } from '../model/scale';
import { useStore } from '@nanostores/react';

export type QuizOptionBase<G extends string = string> = {
  name: string;
  group?: G;
};

export type QuizSet<O extends QuizOptionBase> = {
  key: string;
  label: string;
  settings?: Settings;
  description?: string;
  options?: O[];
};

export const initialSets: { [M in QuizMode]: QuizSet<QuizOption<M>>[] } = {
  [QuizMode.intervals]: intervalSets,
  [QuizMode.chords]: chordSets,
  [QuizMode.scales]: scaleSets,
};

export const allSets = Object.values(initialSets).flat();

export const $sets = persistentAtom<typeof initialSets>('sets', initialSets, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function useSet(key: string) {
  const sets = useStore($sets);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mode] = (Object.entries(sets).find(([_, sets]) =>
    sets.some((set) => set.key === key)
  ) as QuizMode[]) ?? [QuizMode.intervals];

  const set = sets[mode].find((set) => set.key === key);

  const updateSet = (setDraft: Partial<QuizSet<QuizOption>>) => {
    $sets.set({
      ...sets,
      [mode]: sets[mode].map((set) =>
        set.key === key ? { ...set, ...setDraft } : set
      ),
    });
  };

  const deleteSet = (key: string) => {
    $sets.set({
      ...sets,
      [mode]: sets[mode].filter((set) => set.key !== key),
    });
  };

  return {
    set,
    mode,
    updateSet,
    deleteSet,
  };
}
