import { Stack } from '@mantine/core';
import { Shell } from '../layout/Shell';
import { SetButton } from '../components/SetButton';
import { chordSets } from '../model/chordSet';

export function Home() {
  return (
    <Shell title="Choose your chord set">
      <Stack>
        {chordSets.map((chordSet) => (
          <SetButton chordSet={chordSet} />
        ))}
        <SetButton
          chordSet={{
            chords: [],
            key: 'custom',
            label: 'Custom',
            description: 'Choose your own chords.',
          }}
          to="/quiz/new"
        />
      </Stack>
    </Shell>
  );
}
