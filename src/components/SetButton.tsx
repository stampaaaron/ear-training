import { Button, Stack, Title, Text } from '@mantine/core';
import { createSearchParams, Link, To } from 'react-router';
import { ChordSet } from '../notes';

type SetButtonType = {
  chordSet: ChordSet;
  to?: To;
};

export function SetButton({ chordSet, to }: SetButtonType) {
  return (
    <Button
      variant="outline"
      component={Link}
      to={
        to ?? {
          pathname: '/quiz',
          search: createSearchParams({
            chordSet: chordSet.key,
          }).toString(),
        }
      }
      h="auto"
      p="lg"
      maw="100%"
    >
      <Stack gap="xs" w="100%">
        <Title order={3} w="100%">
          {chordSet.label}
        </Title>
        <Text style={{ whiteSpace: 'wrap' }}>{chordSet.description}</Text>
      </Stack>
    </Button>
  );
}
