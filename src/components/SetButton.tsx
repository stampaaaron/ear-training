import { Button, Stack, Title, Text } from '@mantine/core';
import { createSearchParams, Link, To } from 'react-router';
import { QuizMode, QuizOption } from '../model/quiz';
import { QuizSet } from '../store/sets';

type SetButtonType<M extends QuizMode> = {
  quizSet: QuizSet<QuizOption<M>>;
  to?: To;
};

export function SetButton<M extends QuizMode>({
  quizSet,
  to,
}: SetButtonType<M>) {
  return (
    <Button
      variant="outline"
      component={Link}
      to={
        to ?? {
          pathname: '/quiz',
          search: createSearchParams({
            quizSet: quizSet.key,
          }).toString(),
        }
      }
      h="auto"
      p="lg"
      maw="100%"
    >
      <Stack gap="xs" w="100%">
        <Title order={3} w="100%">
          {quizSet.label}
        </Title>
        <Text style={{ whiteSpace: 'wrap' }}>{quizSet.description}</Text>
      </Stack>
    </Button>
  );
}
