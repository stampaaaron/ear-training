import { useRef, useState } from 'react';
import { OptionsGrid } from '../../components/OptionsGrid';
import { Shell } from '../../layout/Shell';
import { Button, Stack } from '@mantine/core';
import { Link, useSearchParams } from 'react-router';
import { useCurrentSet } from '../../store/currentSet';
import { QuizMode } from '../../model/quiz';
import { useSetsStore } from '../../store/sets';
import { defaultSettings } from '../../store/settings';

export function NewSet() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') as QuizMode;

  const uuid = useRef(crypto.randomUUID());

  const sets = useSetsStore((s) => s.sets);

  const currentSet = useCurrentSet((s) => s.currentSet);
  const [selectedOptions, setSelectedOptions] = useState(
    currentSet.options ?? []
  );

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
            useSetsStore.setState({
              sets: {
                ...sets,
                [mode]: [
                  ...sets[mode],
                  {
                    key: uuid.current,
                    options: selectedOptions,
                    settings: defaultSettings,
                  },
                ],
              },
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
