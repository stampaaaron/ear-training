import { Button, Stack, Title, Text } from '@mantine/core';
import { chordSets } from '../notes';
import { createSearchParams, Link } from 'react-router';
import { Shell } from '../layout/Shell';

export function Home() {
  return (
    <Shell title="Choose your chord set">
      <Stack>
        {chordSets.map((chordSet) => (
          <Button
            variant="outline"
            component={Link}
            to={{
              pathname: '/quiz',
              search: createSearchParams({ chordSet: chordSet.key }).toString(),
            }}
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
        ))}
      </Stack>
    </Shell>
  );
}
