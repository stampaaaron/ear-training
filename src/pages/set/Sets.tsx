import { Button, Card, Stack, Text } from '@mantine/core';
import { Shell } from '../../layout/Shell';
import { SetButton } from '../../components/SetButton';
import { useSearchParams, createSearchParams, Link } from 'react-router';
import { QuizMode } from '../../model/quiz';
import { IconPlus } from '@tabler/icons-react';
import { useSetsStore } from '../../store/sets';

export function Sets() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  const sets = useSetsStore((s) => s.sets);

  if (!mode) return null;

  const modeSets = sets[mode as QuizMode];

  return (
    <Shell title="Choose your set" backUrl="/modes">
      <Stack>
        {modeSets.length ? (
          <Card padding={0} withBorder>
            {modeSets.map((quizSet, index) => (
              <SetButton
                key={quizSet.key}
                quizSet={quizSet}
                to={quizSet.key}
                withDivider={index > 0}
              />
            ))}
          </Card>
        ) : (
          <Text c="dimmed">Coming soon</Text>
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
