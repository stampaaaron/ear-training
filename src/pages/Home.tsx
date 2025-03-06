import { Button, Stack, Title, Text } from '@mantine/core';
import { basicTensions } from '../notes';
import { Link } from 'react-router';
import { Shell } from '../layout/Shell';

const chordSets = [
  {
    label: 'Basic Tensions',
    description:
      'maj7, maj6, dom7, dom7sus4, min7, min6, min7(b5) and min(maj7) with all tensions',
    chords: basicTensions,
  },
];

export function Home() {
  return (
    <Shell title="Choose your chord set">
      <Stack>
        {chordSets.map((chordSet) => (
          <Button
            variant="outline"
            component={Link}
            to="/quiz"
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
