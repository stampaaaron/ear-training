import { Stack } from '@mantine/core';
import { allDomChords, allMajChords, allMinChords, Chord } from '../notes';
import { ChordSet } from './ChordSet';

type ChordsGridProps = {
  availableChords: Chord[];
  chordGuess?: Chord;
  guessedCorrectly?: boolean;
  onChordClick: (chord: Chord) => void;
};

export function ChordsGrid({
  availableChords,
  onChordClick,
  chordGuess,
  guessedCorrectly,
}: ChordsGridProps) {
  return (
    <Stack>
      <ChordSet
        label="Major"
        chordSet={allMajChords.filter((chord) =>
          availableChords.includes(chord)
        )}
        onChordClick={onChordClick}
        chordGuess={chordGuess}
        guessedCorrectly={guessedCorrectly}
      />
      <ChordSet
        label="Dominant"
        chordSet={allDomChords.filter((chord) =>
          availableChords.includes(chord)
        )}
        onChordClick={onChordClick}
        chordGuess={chordGuess}
        guessedCorrectly={guessedCorrectly}
      />
      <ChordSet
        label="Minor"
        chordSet={allMinChords.filter((chord) =>
          availableChords.includes(chord)
        )}
        onChordClick={onChordClick}
        chordGuess={chordGuess}
        guessedCorrectly={guessedCorrectly}
      />
    </Stack>
  );
}
