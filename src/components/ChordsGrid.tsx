import { Stack } from '@mantine/core';
import { Chord, domChords, majChords, minChords } from '../notes';
import { ChordSet } from './ChordSet';

type ChordsGridProps = {
  chordGuess?: Chord;
  guessedCorrectly?: boolean;
  onChordClick: (chord: Chord) => void;
};

export function ChordsGrid({
  onChordClick,
  chordGuess,
  guessedCorrectly,
}: ChordsGridProps) {
  return (
    <Stack>
      <ChordSet
        label="Major"
        chordSet={majChords}
        onChordClick={onChordClick}
        chordGuess={chordGuess}
        guessedCorrectly={guessedCorrectly}
      />
      <ChordSet
        label="Dominant"
        chordSet={domChords}
        onChordClick={onChordClick}
        chordGuess={chordGuess}
        guessedCorrectly={guessedCorrectly}
      />
      <ChordSet
        label="Minor"
        chordSet={minChords}
        onChordClick={onChordClick}
        chordGuess={chordGuess}
        guessedCorrectly={guessedCorrectly}
      />
    </Stack>
  );
}
