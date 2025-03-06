import { Button, Fieldset, SimpleGrid } from '@mantine/core';
import { Chord } from '../notes';

type ChordSetProps = {
  chordSet: Chord[];
  label: string;
  chordGuess?: Chord;
  guessedCorrectly?: boolean;
  onChordClick: (chord: Chord) => void;
};

export function ChordSet({
  chordSet,
  label,
  onChordClick,
  chordGuess,
  guessedCorrectly,
}: ChordSetProps) {
  return (
    <Fieldset legend={label} p="sm">
      <SimpleGrid cols={2}>
        {chordSet.map((chord) => (
          <Button
            key={chord.name}
            variant="default"
            onClick={() => onChordClick(chord)}
            rightSection={
              chord === chordGuess && (guessedCorrectly ? 'Correct' : 'x')
            }
          >
            {chord.name}
          </Button>
        ))}
      </SimpleGrid>
    </Fieldset>
  );
}
