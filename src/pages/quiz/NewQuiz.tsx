import { useState } from 'react';
import { ChordsGrid } from '../../components/ChordsGrid';
import { Shell } from '../../layout/Shell';
import { Chord } from '../../notes';
import { Button, Stack } from '@mantine/core';
import { createSearchParams, Link } from 'react-router';
import { useStore } from '@nanostores/react';
import { $currentChordSet } from '../../store/chordSet';

export function NewQuiz() {
  const chordSet = useStore($currentChordSet);
  const [selectedChords, setSelectedChords] = useState<Chord[]>(
    chordSet.chords
  );

  return (
    <Shell title="Create your custom set">
      <Stack>
        <ChordsGrid
          onChordClick={(chord) => {
            setSelectedChords(
              selectedChords?.some((c) => c.name === chord.name)
                ? selectedChords.filter((c) => c.name !== chord.name)
                : [...selectedChords, chord]
            );
          }}
          selectedChords={selectedChords}
        />

        <Button
          component={Link}
          onClick={() =>
            $currentChordSet.set({
              key: 'custom',
              chords: selectedChords,
              label: '',
            })
          }
          to={{
            pathname: '/quiz',
            search: createSearchParams({
              chordSet: 'custom',
            }).toString(),
          }}
        >
          Continue
        </Button>
      </Stack>
    </Shell>
  );
}
