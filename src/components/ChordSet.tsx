import { Button, Fieldset, SimpleGrid } from '@mantine/core';
import { Chord } from '../notes';
import { IconCheck, IconX } from '@tabler/icons-react';

type ChordSetProps = {
  chordSet: Chord[];
  label: string;
  chordGuess?: Chord;
  guessedCorrectly?: boolean;
  selectedChords?: Chord[];
  onChordClick: (chord: Chord) => void;
};

export function ChordSet({
  chordSet,
  label,
  onChordClick,
  chordGuess,
  guessedCorrectly,
  selectedChords,
}: ChordSetProps) {
  return (
    <Fieldset legend={label} p="sm">
      <SimpleGrid cols={2}>
        {chordSet.map((chord) => {
          return (
            <Button
              key={chord.name}
              variant={
                chord === chordGuess ||
                selectedChords?.some((c) => c.name === chord.name)
                  ? 'outline'
                  : 'default'
              }
              onClick={() => onChordClick(chord)}
              color={
                chord === chordGuess
                  ? guessedCorrectly
                    ? 'green'
                    : 'red'
                  : selectedChords?.some((c) => c.name === chord.name)
                    ? 'blue'
                    : undefined
              }
              rightSection={
                chord === chordGuess &&
                (guessedCorrectly ? (
                  <IconCheck size={16} />
                ) : (
                  <IconX size={16} />
                ))
              }
            >
              {chord.name}
            </Button>
          );
        })}
      </SimpleGrid>
    </Fieldset>
  );
}
