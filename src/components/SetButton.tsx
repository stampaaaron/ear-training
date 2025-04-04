import { Button, Stack, Title, Text } from '@mantine/core';
import { createSearchParams, Link, To } from 'react-router';
import { QuizSet } from '../model/quizSet';

type SetButtonType = {
  quizSet: QuizSet;
  to?: To;
};

export function SetButton({ quizSet, to }: SetButtonType) {
  return (
    <Button
      variant="outline"
      component={Link}
      to={
        to ?? {
          pathname: '/quiz',
          search: createSearchParams({
            chordSet: quizSet.key,
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
