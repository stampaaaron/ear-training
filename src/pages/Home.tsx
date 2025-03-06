import { Button, Stack, Title } from '@mantine/core';
import { basicTensions } from '../notes';
import { Link } from 'react-router';
import { Shell } from '../layout/Shell';

const chordSets = [
  {
    label: 'Basic Tensions',
    description:
      'Maj7, Maj6, Dom7, Dom7sus4, Min7, Min6, Min7b5 and MinMaj7 with all tensions',
    chords: basicTensions,
  },
];

export function Home() {
  return (
    <Shell title="Choose your chord set">
      <Stack>
        {chordSets.map((chordSet) => (
          <Button variant="outline" component={Link} to="/quiz" h="auto" p="lg">
            <Stack gap="xs">
              <Title order={3}>{chordSet.label}</Title>
              {chordSet.description}
            </Stack>
          </Button>
        ))}
      </Stack>
    </Shell>
  );
}
