import { useRef, useState } from 'react';
import { OptionsGrid } from '../../components/OptionsGrid';
import { Shell } from '../../layout/Shell';
import { Button, Stack } from '@mantine/core';
import { Link, useSearchParams } from 'react-router';
import { useStore } from '@nanostores/react';
import { $currentSet } from '../../store/currentSet';
import { QuizMode } from '../../model/quiz';
import { $sets } from '../../store/sets';
import { defaultSettings } from '../../store/settings';

export function NewSet() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') as QuizMode;

  const uuid = useRef(crypto.randomUUID());

  const sets = useStore($sets);

  const quizSet = useStore($currentSet);
  const [selectedOptions, setSelectedOptions] = useState(quizSet.options ?? []);

  return (
    <Shell title="Create your custom set">
      <Stack>
        <OptionsGrid
          quizMode={mode}
          onChange={setSelectedOptions}
          value={selectedOptions}
        />

        <Button
          component={Link}
          onClick={() =>
            $sets.set({
              ...sets,
              [mode]: [
                ...sets[mode],
                {
                  key: uuid.current,
                  options: selectedOptions,
                  settings: defaultSettings,
                },
              ],
            })
          }
          to={`/sets/${uuid.current}`}
        >
          Continue
        </Button>
      </Stack>
    </Shell>
  );
}
