import { Button, SimpleGrid } from '@mantine/core';
import { Shell } from '../layout/Shell';
import { createSearchParams, Link } from 'react-router';
import { QuizMode, quizModeNames } from '../model/quiz';

export function Home() {
  return (
    <Shell title="Choose what you want to train">
      <SimpleGrid cols={2}>
        {Object.values(QuizMode).map((mode) => (
          <Button
            key={mode}
            component={Link}
            variant="outline"
            to={{
              pathname: '/sets',
              search: createSearchParams({ mode }).toString(),
            }}
          >
            {quizModeNames[mode]}
          </Button>
        ))}
      </SimpleGrid>
    </Shell>
  );
}
