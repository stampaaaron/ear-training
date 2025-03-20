import { Stack } from '@mantine/core';
import { allDomChords, allMajChords, allMinChords, Chord } from '../notes';
import { ChordSet } from './ChordSet';

type ChordsGridProps = {
  availableChords?: Chord[];
  chordGuess?: Chord;
  guessedCorrectly?: boolean;
  selectedChords?: Chord[];
  onChordClick: (chord: Chord) => void;
};

export function ChordsGrid({
  availableChords,
  onChordClick,
  chordGuess,
  guessedCorrectly,
  selectedChords,
}: ChordsGridProps) {
  return (
    <Stack>
      <ChordSet
        label="Major"
        chordSet={allMajChords.filter(
          (chord) =>
            !availableChords ||
            availableChords.some((c) => c.name === chord.name)
        )}
        selectedChords={selectedChords}
        onChordClick={onChordClick}
        chordGuess={chordGuess}
        guessedCorrectly={guessedCorrectly}
      />
      <ChordSet
        label="Dominant"
        chordSet={allDomChords.filter(
          (chord) =>
            !availableChords ||
            availableChords.some((c) => c.name === chord.name)
        )}
        selectedChords={selectedChords}
        onChordClick={onChordClick}
        chordGuess={chordGuess}
        guessedCorrectly={guessedCorrectly}
      />
      <ChordSet
        label="Minor"
        chordSet={allMinChords.filter(
          (chord) =>
            !availableChords ||
            availableChords.some((c) => c.name === chord.name)
        )}
        selectedChords={selectedChords}
        onChordClick={onChordClick}
        chordGuess={chordGuess}
        guessedCorrectly={guessedCorrectly}
      />
    </Stack>
  );
}
