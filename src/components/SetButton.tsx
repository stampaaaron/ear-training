import { Button, Stack, Title, Text } from '@mantine/core';
import { createSearchParams, Link, To } from 'react-router';
import { QuizOptionBase, QuizSet } from '../model/quizSet';

type SetButtonType<O extends QuizOptionBase> = {
  quizSet: QuizSet<O>;
  to?: To;
};

export function SetButton<O extends QuizOptionBase>({ quizSet, to }: SetButtonType<O>) {
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
