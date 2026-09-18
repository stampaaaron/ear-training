import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizMode, QuizOption } from '../model/quiz';
import { Settings } from './settings';
import { chordSets } from '../model/chordSet';
import { intervalSets } from '../model/interval';
import { scaleSets } from '../model/scale';

export type QuizOptionBase<G extends string = string> = {
  name: string;
  group?: G;
};

export type QuizSet<O extends QuizOptionBase> = {
  key: string;
  label: string;
  settings?: Settings;
  // Either plain text, or a description built from the option names
  // themselves so it can be rendered with the same chord-symbol/scale-name
  // formatting as everywhere else.
  description?: string | { prefix?: string; names: string[]; suffix?: string };
  options?: O[];
};

export const initialSets: { [M in QuizMode]: QuizSet<QuizOption<M>>[] } = {
  [QuizMode.intervals]: intervalSets,
  [QuizMode.chords]: chordSets,
  [QuizMode.scales]: scaleSets,
};

export const allSets = Object.values(initialSets).flat();

type SetsState = {
  sets: typeof initialSets;
};

export const useSetsStore = create<SetsState>()(
  persist(() => ({ sets: initialSets }), {
    name: 'sets',
    version: 1,
    migrate: (prevState) => {
      const state = prevState as SetsState;

      // Built-in sets are re-derived from the current code instead of
      // staying frozen at whatever they looked like when first persisted: a
      // set's fresh fields (name, description, options, ...) always win,
      // its settings are the fresh defaults with the user's own choices
      // layered on top (so a field the user never touched — e.g. one added
      // after they last saved — still gets a sensible default), and the
      // list is rebuilt in initialSets' order so a built-in set the user
      // never had yet lands wherever the code declares it (not tacked onto
      // the end). Sets the user created themselves (no matching key) are
      // kept as-is, appended after the built-ins. Bump `version` above
      // whenever a built-in set's shape changes enough that this needs to
      // run again.
      state.sets = Object.fromEntries(
        (Object.keys(initialSets) as QuizMode[]).map((mode) => {
          const persistedByKey = new Map(
            (state.sets[mode] ?? []).map((set) => [set.key, set])
          );

          const builtIn = initialSets[mode].map((fresh) => {
            const persisted = persistedByKey.get(fresh.key);
            persistedByKey.delete(fresh.key);

            return {
              ...fresh,
              settings: persisted?.settings
                ? { ...fresh.settings, ...persisted.settings }
                : fresh.settings,
            };
          });

          return [mode, [...builtIn, ...persistedByKey.values()]];
        })
      ) as typeof initialSets;

      return state;
    },
  })
);

export function useSet(key: string) {
  const sets = useSetsStore((s) => s.sets);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mode] = (Object.entries(sets).find(([_, sets]) =>
    sets.some((set) => set.key === key)
  ) as QuizMode[]) ?? [QuizMode.intervals];

  const set = sets[mode].find((set) => set.key === key);

  const updateSet = (setDraft: Partial<QuizSet<QuizOption>>) => {
    useSetsStore.setState({
      sets: {
        ...sets,
        [mode]: sets[mode].map((set) =>
          set.key === key ? { ...set, ...setDraft } : set
        ),
      },
    });
  };

  const deleteSet = (key: string) => {
    useSetsStore.setState({
      sets: {
        ...sets,
        [mode]: sets[mode].filter((set) => set.key !== key),
      },
    });
  };

  return {
    set,
    mode,
    updateSet,
    deleteSet,
  };
}
