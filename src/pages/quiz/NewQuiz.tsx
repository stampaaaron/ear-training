import { useState } from 'react';
import { OptionsGrid } from '../../components/OptionsGrid';
import { Shell } from '../../layout/Shell';
import { Button, Stack } from '@mantine/core';
import { createSearchParams, Link, useSearchParams } from 'react-router';
import { useStore } from '@nanostores/react';
import { $currentQuizSet } from '../../store/chordSet';
import { QuizMode } from '../../model/quiz';

export function NewQuiz() {
    const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') as QuizMode;
  
  const quizSet = useStore($currentQuizSet);
  const [selectedOptions, setSelectedOptions] = useState(
    quizSet.options ?? []
  );

  return (
    <Shell title="Create your custom set">
      <Stack>
        <OptionsGrid
        quizMode={mode} 
          onSelect={(option) => {
            setSelectedOptions(
              selectedOptions?.some((c) => c.name === option.name) 
                ? selectedOptions.filter((c) => c.name !== option.name)
                : [...selectedOptions, option]
            );
          } }
          selectedOptions={selectedOptions}       />

        <Button
          component={Link}
          onClick={() =>
            $currentQuizSet.set({
              key: 'custom',
              options: selectedOptions,
              label: '',
            })
          }
          to={{
            pathname: '/quiz',
            search: createSearchParams({
              quizSet: 'custom',
              mode
            }).toString(),
          }}
        >
          Continue
        </Button>
      </Stack>
    </Shell>
  );
}
