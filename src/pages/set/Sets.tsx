import { Button, Stack } from '@mantine/core';
import { Shell } from '../../layout/Shell';
import { SetButton } from '../../components/SetButton';
import { useSearchParams, createSearchParams, Link } from 'react-router';
import { QuizMode } from '../../model/quiz';
import { IconPlus } from '@tabler/icons-react';
import { useStore } from '@nanostores/react';
import { $sets } from '../../store/sets';

export function Sets() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  const sets = useStore($sets);

  if (!mode) return null;

  return (
    <Shell title="Choose your set" backUrl="/">
      <Stack>
        {sets[mode as QuizMode].length ? (
          sets[mode as QuizMode].map((quizSet) => (
            <SetButton key={quizSet.key} quizSet={quizSet} to={quizSet.key} />
          ))
        ) : (
          <p>Comming soon</p>
        )}
        <Button
          component={Link}
          to={{
            pathname: 'new',
            search: createSearchParams({
              mode,
            }).toString(),
          }}
          rightSection={<IconPlus />}
        >
          New Set
        </Button>
      </Stack>
    </Shell>
  );
}
